import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/service'
import type { LineItem } from '@/types/database'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface QuoteTrigger {
  action: 'generate_quote'
  line_items: LineItem[]
  customer_name: string
  subtotal: number
  total: number
}

type ConversationResult =
  | { type: 'message'; text: string }
  | { type: 'quote_created'; quoteId: string }

const SYSTEM_PROMPT = `You are a quoting assistant for a tradesperson (plumber/electrician/HVAC tech).
Help them build a professional job quote through natural conversation.

RULES:
1. Never ask for info you can already infer. "Fixed pipe $120" = one complete line item. Add it. Don't ask for breakdown.
2. Ask ONE question at a time. Never list multiple questions.
3. Confirm what you captured before moving on: "Got it — pipe repair $120 ✓"
4. If price is missing, ask once. If still missing, add as TBD and continue.
5. After each item ask: "Anything else on this job?"
6. When user signals done (no/nope/that's it/done/send it), show full summary with total. Format the summary with each line item on its own line, then the total bold and on its own line at the bottom. Use plain text line breaks (not markdown).
7. Keep replies under 3 lines. They're on a phone.
8. After confirming the summary, ask for customer name.
9. Once you have customer name, output ONLY this JSON (no other text):
   {
     "action": "generate_quote",
     "customer_name": "John Smith",
     "line_items": [
       { "description": "Pipe repair", "quantity": 1, "unit_price": 120.00, "total": 120.00 },
       { "description": "Copper fittings x3", "quantity": 3, "unit_price": 15.00, "total": 45.00 }
     ],
     "subtotal": 165.00,
     "total": 165.00
   }

CRITICAL: Every line item MUST include the actual "unit_price" and "total" from the conversation — never 0. The "subtotal" and "total" fields must also be the real calculated amounts, not 0.
IMPORTANT: Preserve the exact job description the tradesperson gives you. Never normalise or generalise — do not change "replaced kitchen faucet" to "Maintenance" or "Installation". Use their exact words in the line_items description field.
IMPORTANT: Output ONLY the raw JSON object. No other text before or after it.`

async function checkPlanAccess(userId: string): Promise<string | null> {
  const supabase = createServiceClient()

  const { data: user } = await supabase
    .from('users')
    .select('plan, trial_ends_at')
    .eq('id', userId)
    .single()

  if (!user) return 'Account not found.'

  if (user.plan === 'canceled') {
    return 'Your subscription has ended. Reactivate at your billing page to continue quoting.'
  }

  if (user.plan === 'trial') {
    const expired = user.trial_ends_at && new Date(user.trial_ends_at) < new Date()
    if (expired) {
      return 'Your free trial has expired. Subscribe to continue sending quotes.'
    }
    return null
  }

  if (user.plan === 'starter') {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    if ((count ?? 0) >= 10) {
      return "You've reached your 10 quotes/month limit on the Starter plan. Upgrade to Pro for unlimited quotes."
    }
    return null
  }

  // pro / team — unlimited
  return null
}

export async function handleConversation(
  userId: string,
  message: string,
  threadId: string
): Promise<ConversationResult> {
  const supabase = createServiceClient()

  // 0. Plan access check
  const gateMessage = await checkPlanAccess(userId)
  if (gateMessage) return { type: 'message', text: gateMessage }

  // 1. Load or create quote_session
  console.log('handleConversation called — userId:', userId, 'threadId:', threadId)

  let { data: session } = await supabase
    .from('quote_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('whatsapp_thread_id', threadId)
    .eq('state', 'collecting')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!session) {
    const { data: newSession, error } = await supabase
      .from('quote_sessions')
      .insert({
        user_id: userId,
        whatsapp_thread_id: threadId,
        state: 'collecting',
        quote_draft: {},
        messages: [],
      })
      .select()
      .single()

    if (error || !newSession) throw new Error(`Failed to create session: ${error?.message}`)
    session = newSession
  }

  // 2. Append user message
  const messages = (session.messages as { role: string; content: string }[]) ?? []
  messages.push({ role: 'user', content: message })

  // 3. Load user settings + price memory for context
  const [{ data: userProfile }, { data: priceMemory }] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('price_memory').select('job_type, last_labor, last_total, use_count').eq('user_id', userId).order('use_count', { ascending: false }).limit(10),
  ])

  const taxRate = userProfile?.default_tax_rate ?? 0
  const currency = userProfile?.currency ?? 'USD'
  const currencySymbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'
  const priceMemoryText = priceMemory?.length
    ? priceMemory.map(p => `${p.job_type}: last total ${currencySymbol}${p.last_total ?? 'unknown'} (used ${p.use_count}x)`).join('\n')
    : 'No previous jobs yet.'

  // 4. Call Claude
  const systemWithContext = [
    SYSTEM_PROMPT,
    `\nCURRENT QUOTE STATE:\n${JSON.stringify(session.quote_draft, null, 2)}`,
    `\nPRICE MEMORY (their past jobs):\n${priceMemoryText}`,
  ].join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemWithContext,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const assistantText = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  console.log('Claude raw response:', assistantText)
  console.log('Action detected:', assistantText.includes('generate_quote'))
  console.log('Current session state:', session.state)

  // Append assistant reply to history
  messages.push({ role: 'assistant', content: assistantText })

  // 5. Detect JSON trigger
  const jsonMatch = assistantText.match(/\{[\s\S]*"action"\s*:\s*"generate_quote"[\s\S]*\}/)

  if (jsonMatch) {
    let trigger: QuoteTrigger
    try {
      trigger = JSON.parse(jsonMatch[0]) as QuoteTrigger
    } catch {
      // Malformed JSON — treat as regular message
      await saveSession(supabase, session.id, messages, session.quote_draft as Record<string, unknown>)
      return { type: 'message', text: assistantText }
    }

    // Calculate totals
    console.log('Raw trigger from Claude:', JSON.stringify(trigger))

    const lineItems: LineItem[] = trigger.line_items.map(item => ({
      description: item.description,
      quantity: item.quantity ?? 1,
      unit_price: item.unit_price ?? 0,
      total: item.total ?? (item.quantity ?? 1) * (item.unit_price ?? 0),
    }))

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
    const total = subtotal * (1 + taxRate)

    console.log('Quote data for PDF:', JSON.stringify({ customer_name: trigger.customer_name, lineItems, subtotal, total }))

    // Insert quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        user_id: userId,
        customer_name: trigger.customer_name,
        status: 'draft',
        line_items: lineItems,
        subtotal,
        tax_rate: taxRate,
        total,
        notes: null,
        pdf_url: null,
        sent_at: null,
        viewed_at: null,
        accepted_at: null,
        customer_id: null,
      })
      .select()
      .single()

    if (quoteError || !quote) throw new Error(`Failed to create quote: ${quoteError?.message}`)

    // Update price memory for each line item
    await Promise.all(
      lineItems.map(async item => {
        const jobType = item.description.toLowerCase().slice(0, 60)
        const { data: existing } = await supabase
          .from('price_memory')
          .select('id, use_count')
          .eq('user_id', userId)
          .eq('job_type', jobType)
          .single()

        if (existing) {
          await supabase
            .from('price_memory')
            .update({ last_total: item.total, use_count: existing.use_count + 1 })
            .eq('id', existing.id)
        } else {
          await supabase.from('price_memory').insert({
            user_id: userId,
            job_type: jobType,
            last_labor: null,
            last_total: item.total,
          })
        }
      })
    )

    // Mark session complete
    await supabase
      .from('quote_sessions')
      .update({ state: 'complete', quote_id: quote.id, messages })
      .eq('id', session.id)

    return { type: 'quote_created', quoteId: quote.id }
  }

  // 6. Regular message — save updated session
  await saveSession(supabase, session.id, messages, session.quote_draft as Record<string, unknown>)

  return { type: 'message', text: assistantText }
}

async function saveSession(
  supabase: ReturnType<typeof createServiceClient>,
  sessionId: string,
  messages: { role: string; content: string }[],
  quoteDraft: Record<string, unknown>
) {
  await supabase
    .from('quote_sessions')
    .update({ messages, quote_draft: quoteDraft })
    .eq('id', sessionId)
}

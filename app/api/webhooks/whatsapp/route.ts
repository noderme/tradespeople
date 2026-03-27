import { type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import { generateQuotePdf } from '@/lib/generatePdf'
import { sendWhatsAppMessage, sendWhatsAppDocument } from '@/lib/whatsapp'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$', NZD: 'NZ$',
}

// ── GET — Meta webhook verification ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return new Response('Forbidden', { status: 403 })
}

// ── POST — incoming messages ──────────────────────────────────────────────────
export async function POST(request: Request) {
  // Always return 200 quickly — Meta will retry on non-200
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return new Response('ok', { status: 200 })
  }

  try {
    await handleIncoming(body)
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
  }

  return new Response('ok', { status: 200 })
}

async function handleIncoming(body: Record<string, unknown>) {
  const value = (body as {
    entry?: { changes?: { value?: {
      messages?: { from: string; type: string; text?: { body: string } }[]
      statuses?: unknown[]
    } }[] }[]
  })?.entry?.[0]?.changes?.[0]?.value

  // Ignore status updates (delivered, read, etc.)
  if (!value?.messages?.length) return

  const msg = value.messages[0]

  // Only handle text messages
  if (msg.type !== 'text' || !msg.text?.body) return

  const senderPhone = msg.from          // digits only, e.g. "447911123456"
  const messageText = msg.text.body
  const threadId    = senderPhone       // phone number is the thread identifier

  // ── Look up user by WhatsApp number ────────────────────────────────────────
  const supabase   = createServiceClient()
  const withPlus   = `+${senderPhone}`

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .or(`whatsapp_number.eq.${senderPhone},whatsapp_number.eq.${withPlus}`)
    .maybeSingle()

  if (!user) {
    await sendWhatsAppMessage(
      senderPhone,
      "I don't recognise this number. Sign up at TradeQuote to get started."
    )
    return
  }

  // ── Process the conversation ────────────────────────────────────────────────
  const result = await handleConversation(user.id, messageText, threadId)

  if (result.type === 'message') {
    await sendWhatsAppMessage(senderPhone, result.text)
    return
  }

  // ── Quote created — generate PDF and send it back ──────────────────────────
  const { data: quote } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', result.quoteId)
    .single()

  if (!quote) return

  await generateQuotePdf(quote, user)

  // Re-fetch to get the stored pdf_url
  const { data: sent } = await supabase
    .from('quotes')
    .select('pdf_url, total, customer_name, id')
    .eq('id', result.quoteId)
    .single()

  if (!sent?.pdf_url) return

  const symbol   = CURRENCY_SYMBOLS[user.currency ?? 'USD'] ?? '$'
  const total    = Number(quote.total).toFixed(2)
  const year     = new Date(quote.created_at).getFullYear()
  const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
  const caption  = `Quote ${quoteNum} for ${quote.customer_name} — ${symbol}${total}`

  await sendWhatsAppDocument(
    senderPhone,
    sent.pdf_url,
    `${quoteNum}.pdf`,
    caption
  )
}

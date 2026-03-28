
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import type { LineItem, QuoteStatus } from '@/types/database'

/**
 * SKILL AS A SERVICE (SkaaS) API
 */

interface SkillRequest {
  action: 'chat' | 'get_price_history' | 'create_quote' | 'send_quote' | 'get_quotes'
  user_id: string
  data?: Record<string, unknown>
}

interface SkillResponse {
  success: boolean
  action: string
  result?: unknown
  error?: string
}

function verifySkillApiKey(authHeader: string | null): boolean {
  if (!authHeader) return false
  const token = authHeader.replace('Bearer ', '')
  const validKey = process.env.SKILL_API_KEY
  if (!validKey) {
    console.error('SKILL_API_KEY not configured in environment')
    return false
  }
  return token === validKey
}

export async function POST(request: NextRequest): Promise<NextResponse<SkillResponse>> {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!verifySkillApiKey(authHeader)) {
      return NextResponse.json(
        { success: false, action: 'auth', error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    const body = (await request.json()) as SkillRequest
    console.log('Incoming Skill API Request Body:', JSON.stringify(body, null, 2))
    const { action, data } = body
    let { user_id } = body

    const supabase = createServiceClient()

    if (user_id && user_id.includes('@')) {
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user_id.toLowerCase())
        .single()

      if (userError && userError.code !== 'PGRST116') throw userError

      if (userRecord) {
        user_id = userRecord.id
      } else {
        return NextResponse.json(
          { success: false, action: 'user_lookup', error: 'Account not found. Please register or provide a valid email.' },
          { status: 404 }
        )
      }
    }

    if (!action || !user_id) {
      return NextResponse.json(
        { success: false, action: 'validate', error: 'Missing action or user_id' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'chat': {
        if (!data || !data.message || !data.threadId) {
          return NextResponse.json({ success: false, action: 'chat', error: 'Missing message or threadId' }, { status: 400 })
        }
        const result = await handleConversation(user_id, data.message as string, data.threadId as string)
        return NextResponse.json({ success: true, action: 'chat', result })
      }

      case 'get_price_history': {
        if (!data || !data.job_type) {
          return NextResponse.json({ success: false, action: 'get_price_history', error: 'Missing job_type' }, { status: 400 })
        }
        const { data: priceMemory, error } = await supabase
          .from('price_memory')
          .select('*')
          .eq('user_id', user_id)
          .eq('job_type', (data.job_type as string).toLowerCase())
          .order('use_count', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        return NextResponse.json({ success: true, action: 'get_price_history', result: priceMemory || { message: 'No previous pricing found' } })
      }

      case 'get_quotes': {
        const limit = (data?.limit as number) || 10
        const status = data?.status as string
        let query = supabase.from('quotes').select('*').eq('user_id', user_id).order('created_at', { ascending: false }).limit(limit)
        const validQuoteStatuses: QuoteStatus[] = ['draft', 'pending', 'sent', 'viewed', 'accepted', 'declined', 'cancelled']
        if (status && validQuoteStatuses.includes(status as QuoteStatus)) {
          query = query.eq('status', status as QuoteStatus)
        }
        const { data: quotes, error } = await query
        if (error) throw error
        return NextResponse.json({ success: true, action: 'get_quotes', result: quotes })
      }

      case 'create_quote': {
        if (!data) {
          return NextResponse.json({ success: false, action: 'create_quote', error: 'Missing data object' }, { status: 400 })
        }

        // 1. Get user profile and quote count simultaneously
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('plan, default_tax_rate')
          .eq('id', user_id)
          .single()

        if (profileError) throw profileError

        const { count: quoteCountRaw, error: countError } = await supabase
          .from('quotes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user_id)

        if (countError) throw countError
        const quoteCount = (quoteCountRaw ?? 0) as number;

        // 2. Enforce plan limits
        if (userProfile.plan === 'trial' && quoteCount >= 10) {
          return NextResponse.json(
            { success: false, action: 'create_quote', error: 'Quote limit reached. Please upgrade your plan at quotejob.app/billing to create more quotes.' },
            { status: 403 } // 403 Forbidden is perfect for this
          )
        }

        const { customer_name, customer_address, line_items, notes, tax_rate } = data as { customer_name: string, customer_address?: string, line_items: LineItem[], notes?: string, tax_rate?: number }

        if (!customer_name || !line_items || line_items.length === 0) {
          return NextResponse.json({ success: false, action: 'create_quote', error: 'Missing required fields: customer_name or line_items' }, { status: 400 })
        }

        const finalTaxRate = tax_rate ?? userProfile?.default_tax_rate ?? 0
        const subtotal = line_items.reduce((sum, item) => sum + (item.total || 0), 0)
        const total = subtotal * (1 + finalTaxRate)

        const { data: quote, error: quoteError } = await supabase
          .from('quotes')
          .insert({ user_id, customer_name, customer_address, status: 'draft', line_items, subtotal, tax_rate: finalTaxRate, total, notes })
          .select()
          .single()

        if (quoteError) throw quoteError

        return NextResponse.json({ success: true, action: 'create_quote', result: { quote_id: quote.id, total, message: `Quote created for ${customer_name}` } })
      }

      case 'send_quote': {
        if (!data || !data.quote_id || (!data.email && !data.phone)) {
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Missing quote_id and email/phone' }, { status: 400 })
        }
        const { quote_id, email, phone } = data as { quote_id: string, email?: string, phone?: string }

        const sendUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/quotes/${quote_id}/send`
        console.log('send_quote: calling', sendUrl, 'for user_id:', user_id, 'email:', email)

        try {
          const sendRes = await fetch(sendUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SKILL_API_KEY}`,
            },
            body: JSON.stringify({ email, phone, user_id }),
          })

          const sendBody = await sendRes.text()
          console.log('send_quote: response status:', sendRes.status, 'body:', sendBody)

          if (!sendRes.ok) {
            return NextResponse.json({ success: false, action: 'send_quote', error: `Failed to send email: ${sendBody}` }, { status: sendRes.status })
          }
        } catch (fetchError) {
          console.error('send_quote: fetch error:', fetchError)
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Failed to connect to send endpoint' }, { status: 500 })
        }

        return NextResponse.json({ success: true, action: 'send_quote', result: { message: `Quote sent to ${email || phone}` } })
      }

      default:
        return NextResponse.json({ success: false, action: 'unknown', error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error('Skill API error:', error)
    return NextResponse.json(
      { success: false, action: 'error', error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


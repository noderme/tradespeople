
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import { buildPdfBuffer } from '@/lib/generatePdf'
import { Resend } from 'resend'
import type { LineItem, QuoteStatus } from '@/types/database'

/**
 * SKILL AS A SERVICE (SkaaS) API
 */

interface SkillRequest {
  action: 'check_user' | 'chat' | 'get_price_history' | 'create_quote' | 'send_quote' | 'get_quotes' | 'get_reviews'
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
      case 'check_user': {
        return NextResponse.json({ success: true, action: 'check_user', result: { status: 'ok' } })
      }

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

        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const { count: quoteCountRaw, error: countError } = await supabase
          .from('quotes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user_id)
          .gte('created_at', startOfMonth.toISOString())

        if (countError) throw countError
        const quoteCount = (quoteCountRaw ?? 0) as number;

        // 2. Enforce plan limits
        if (userProfile.plan === 'trial' && quoteCount >= 10) {
          return NextResponse.json(
            { success: false, action: 'create_quote', error: 'Quote limit reached. Please upgrade your plan at quotejob.app/billing to create more quotes.' },
            { status: 403 }
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

        // Generate PDF and upload to storage
        const { data: fullProfile } = await supabase.from('users').select('*').eq('id', user_id).single()
        if (fullProfile) {
          const pdfBuffer = await buildPdfBuffer(quote, fullProfile)
          const filename = `quote-${quote.id}.pdf`
          await supabase.storage.from('quotes').upload(filename, pdfBuffer, { contentType: 'application/pdf', upsert: true })
          const { data: { publicUrl } } = supabase.storage.from('quotes').getPublicUrl(filename)
          await supabase.from('quotes').update({ pdf_url: publicUrl }).eq('id', quote.id)
        }

        const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
        return NextResponse.json({ success: true, action: 'create_quote', result: { quote_id: quote.id, total, pdf_url: `${siteUrl}/viewpdf/${quote.id}`, message: `Quote created for ${customer_name}` } })
      }

      case 'send_quote': {
        if (!data || !data.quote_id || (!data.email && !data.phone)) {
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Missing quote_id and email/phone' }, { status: 400 })
        }
        const { quote_id, email } = data as { quote_id: string, email?: string, phone?: string }

        if (!email) {
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Email is required to send a quote' }, { status: 400 })
        }

        // Fetch quote and user profile directly (no internal HTTP call)
        const [{ data: quote, error: quoteErr }, { data: profile, error: profileErr }] = await Promise.all([
          supabase.from('quotes').select('*').eq('id', quote_id).eq('user_id', user_id).single(),
          supabase.from('users').select('*').eq('id', user_id).single(),
        ])

        if (quoteErr || !quote) {
          console.error('send_quote: quote not found', quoteErr)
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Quote not found' }, { status: 404 })
        }
        if (profileErr || !profile) {
          console.error('send_quote: profile not found', profileErr)
          return NextResponse.json({ success: false, action: 'send_quote', error: 'User profile not found' }, { status: 404 })
        }

        // Build and upload PDF
        const buffer = await buildPdfBuffer(quote, profile)
        const pdfFilename = `quote-${quote.id}.pdf`
        await supabase.storage.from('quotes').upload(pdfFilename, buffer, { contentType: 'application/pdf', upsert: true })
        const year = new Date(quote.created_at).getFullYear()
        const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
        const currency = profile.currency ?? 'USD'
        const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(quote.total))

        const reviewUrl = profile.google_place_id
          ? `https://search.google.com/local/writereview?placeid=${profile.google_place_id}`
          : null
        const reviewButtonHtml = reviewUrl
          ? `<p style="margin-top:24px;"><a href="${reviewUrl}" style="background:#f97316;color:#000;font-weight:bold;padding:12px 24px;text-decoration:none;display:inline-block;font-family:sans-serif;font-size:14px;letter-spacing:1px;text-transform:uppercase;">⭐ Leave a Google Review</a></p>`
          : ''

        // Send email via Resend
        if (!process.env.RESEND_API_KEY) {
          console.warn('RESEND_API_KEY not set')
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Email service not configured' }, { status: 500 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)
        const from = process.env.RESEND_FROM_EMAIL ?? 'quotes@resend.dev'

        const { data: sendData, error: sendError } = await resend.emails.send({
          from,
          to: email,
          subject: `Quote ${quoteNum} from ${profile.business_name}`,
          html: `
            <p>Hi,</p>
            <p>${profile.business_name} has sent you a quote (${quoteNum}).</p>
            <p>Please find the quote attached as a PDF.</p>
            <p><strong>Total: ${totalFormatted}</strong></p>
            ${reviewButtonHtml}
            <p>Thanks,<br/>${profile.business_name}</p>
          `,
          attachments: [{ filename: `${quoteNum}.pdf`, content: buffer }],
        })

        if (sendError) {
          console.error('send_quote: Resend error:', sendError)
          return NextResponse.json({ success: false, action: 'send_quote', error: 'Failed to send email' }, { status: 500 })
        }

        // Update quote status + create review record
        await Promise.all([
          supabase.from('quotes').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', quote_id),
          supabase.from('reviews').insert({
            user_id,
            quote_id,
            customer_email: email,
            resend_email_id: sendData?.id ?? null,
            status: 'sent',
          }),
        ])

        console.log('send_quote: email sent successfully to', email)
        return NextResponse.json({ success: true, action: 'send_quote', result: { message: `Quote sent to ${email}` } })
      }

      case 'get_reviews': {
        const limit = (data?.limit as number) || 5
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('id, customer_email, status, created_at, updated_at, quote_id')
          .eq('user_id', user_id)
          .order('created_at', { ascending: false })
          .limit(limit)
        if (error) throw error
        return NextResponse.json({ success: true, action: 'get_reviews', result: reviews })
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

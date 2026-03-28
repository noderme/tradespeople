import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { buildPdfBuffer } from '@/lib/generatePdf'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let userId: string | null = null
  const service = createServiceClient()

  // Auth method 1: SKILL_API_KEY (from GPT / external skill)
  const authHeader = request.headers.get('Authorization')
  const skillApiKey = process.env.SKILL_API_KEY
  if (authHeader && skillApiKey && authHeader.replace('Bearer ', '') === skillApiKey) {
    // Skill API call — get user_id from request body
    const body = await request.json()
    const { email, user_id } = body as { email?: string; user_id?: string }

    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    if (user_id) {
      // user_id could be a UUID or an email
      if (user_id.includes('@')) {
        const { data: userRecord } = await service
          .from('users')
          .select('id')
          .eq('email', user_id.toLowerCase())
          .single()
        if (userRecord) userId = userRecord.id
      } else {
        userId = user_id
      }
    }

    if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return await sendQuoteEmail(service, params.id, userId, email)
  }

  // Auth method 2: Supabase cookie auth (from web UI)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { email } = body as { email?: string }
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  return await sendQuoteEmail(service, params.id, user.id, email)
}

async function sendQuoteEmail(
  service: ReturnType<typeof createServiceClient>,
  quoteId: string,
  userId: string,
  email: string
) {
  const [{ data: quote }, { data: profile }] = await Promise.all([
    service.from('quotes').select('*').eq('id', quoteId).eq('user_id', userId).single(),
    service.from('users').select('*').eq('id', userId).single(),
  ])

  if (!quote || !profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const buffer    = await buildPdfBuffer(quote, profile)
  const year      = new Date(quote.created_at).getFullYear()
  const quoteNum  = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
  const currency  = profile.currency ?? 'USD'
  const totalFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(quote.total))
  const siteUrl   = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const acceptUrl = `${siteUrl}/quote/${quote.id}`

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email send')
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.RESEND_FROM_EMAIL ?? 'quotes@resend.dev'

  const { error: sendError } = await resend.emails.send({
    from,
    to: email,
    subject: `Quote ${quoteNum} from ${profile.business_name}`,
    html: `
      <p>Hi,</p>
      <p>${profile.business_name} has sent you a quote (${quoteNum}).</p>
      <p>Please find the quote attached as a PDF.</p>
      <p><strong>Total: ${totalFormatted}</strong></p>
      <p>View and accept your quote online: <a href="${acceptUrl}">${acceptUrl}</a></p>
      <p>Thanks,<br/>${profile.business_name}</p>
    `,
    attachments: [
      {
        filename: `${quoteNum}.pdf`,
        content: buffer,
      },
    ],
  })

  if (sendError) {
    console.error('Resend error:', sendError)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  // Update quote status to 'sent'
  await service
    .from('quotes')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', quoteId)

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { buildPdfBuffer } from '@/lib/generatePdf'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const service = createServiceClient()

  const [{ data: quote }, { data: profile }] = await Promise.all([
    service.from('quotes').select('*').eq('id', params.id).eq('user_id', user.id).single(),
    service.from('users').select('*').eq('id', user.id).single(),
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
    .eq('id', params.id)

  return NextResponse.json({ ok: true })
}

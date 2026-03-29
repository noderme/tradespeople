import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { ReviewStatus } from '@/types/database'

interface ResendWebhookEvent {
  type: string
  data: {
    email_id: string
    [key: string]: unknown
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify signing secret
    const secret = process.env.RESEND_WEBHOOK_SECRET
    if (secret) {
      const signature = request.headers.get('svix-signature')
      const msgId = request.headers.get('svix-id')
      const msgTimestamp = request.headers.get('svix-timestamp')
      if (!signature || !msgId || !msgTimestamp) {
        return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 })
      }
      const rawBody = await request.text()
      const signedContent = `${msgId}.${msgTimestamp}.${rawBody}`
      const secretBytes = Buffer.from(secret.split('_')[1] ?? secret, 'base64')
      const { createHmac } = await import('crypto')
      const expectedSig = createHmac('sha256', secretBytes).update(signedContent).digest('base64')
      const validSig = signature.split(' ').some(s => s.split(',')[1] === expectedSig)
      if (!validSig) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
      const body = JSON.parse(rawBody) as ResendWebhookEvent
      return await handleEvent(body)
    }

    const body = await request.json() as ResendWebhookEvent
    return await handleEvent(body)
  } catch (err) {
    console.error('Resend webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function handleEvent(body: ResendWebhookEvent): Promise<NextResponse> {
  console.log('Resend webhook payload:', JSON.stringify(body, null, 2))

  const { type, data } = body
  const emailId = data?.email_id
  console.log('type:', type, 'emailId:', emailId)

  if (!emailId) return NextResponse.json({ ok: true })

  let status: ReviewStatus | null = null
  if (type === 'email.opened') status = 'opened'
  else if (type === 'email.clicked') status = 'clicked'

  if (!status) return NextResponse.json({ ok: true })

  const supabase = createServiceClient()

  const { data: updated, error } = await supabase
    .from('reviews')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('resend_email_id', emailId)
    .select()

  console.log('Updated rows:', updated, 'Error:', error)

  return NextResponse.json({ ok: true })
}

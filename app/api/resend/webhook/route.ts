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
    const body = await request.json() as ResendWebhookEvent
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
  } catch (err) {
    console.error('Resend webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

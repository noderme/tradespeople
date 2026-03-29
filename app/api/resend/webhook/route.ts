import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { ReviewStatus } from '@/types/database'

interface ResendWebhookEvent {
  type: string
  data: {
    email_id: string
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json() as ResendWebhookEvent

  const { type, data } = body
  const emailId = data?.email_id
  if (!emailId) return NextResponse.json({ ok: true })

  let status: ReviewStatus | null = null
  if (type === 'email.opened') status = 'opened'
  else if (type === 'email.clicked') status = 'clicked'

  if (!status) return NextResponse.json({ ok: true })

  const supabase = createServiceClient()

  await supabase
    .from('reviews')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('resend_email_id', emailId)

  return NextResponse.json({ ok: true })
}

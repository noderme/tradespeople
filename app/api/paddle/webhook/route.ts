import { getPaddle, priceIdToPlan } from '@/lib/paddle'
import { createServiceClient } from '@/lib/supabase/service'
import { EventName } from '@paddle/paddle-node-sdk'
import { headers } from 'next/headers'
import { Resend } from 'resend'

export async function POST(request: Request) {
  const body      = await request.text()
  const signature = headers().get('paddle-signature')

  if (!signature) {
    return new Response('Missing paddle-signature header', { status: 400 })
  }

  let event
  try {
    event = await getPaddle().webhooks.unmarshal(
      body,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature,
    )
  } catch (err) {
    console.error('Paddle webhook signature verification failed:', err)
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.eventType) {
      // Subscription activated — link Paddle customer/subscription to user, set plan
      case EventName.SubscriptionActivated: {
        const sub    = event.data
        const userId = (sub.customData as Record<string, string> | null)?.user_id
        if (!userId) break

        const priceId = sub.items[0]?.price?.id ?? ''
        const plan    = priceIdToPlan(priceId)

        await supabase
          .from('users')
          .update({
            paddle_customer_id:     sub.customerId,
            paddle_subscription_id: sub.id,
            plan,
          })
          .eq('id', userId)
        break
      }

      // Subscription canceled — downgrade to canceled
      case EventName.SubscriptionCanceled: {
        const sub = event.data

        await supabase
          .from('users')
          .update({ plan: 'canceled', paddle_subscription_id: null })
          .eq('paddle_customer_id', sub.customerId)
        break
      }

      // Payment failed — send email to user
      case EventName.TransactionPaymentFailed: {
        const tx = event.data

        if (!tx.customerId) break

        const { data: user } = await supabase
          .from('users')
          .select('email')
          .eq('paddle_customer_id', tx.customerId)
          .single()

        if (user?.email) {
          const resend  = new Resend(process.env.RESEND_API_KEY)
          const appUrl  = process.env.NEXT_PUBLIC_APP_URL ?? ''
          await resend.emails.send({
            from:    process.env.RESEND_FROM_EMAIL!,
            to:      user.email,
            subject: 'TradeQuote — payment failed',
            html: `
              <p>Your TradeQuote payment failed.</p>
              <p>Update your billing details to keep quoting:
                <a href="${appUrl}/billing">${appUrl}/billing</a>
              </p>
            `,
          })
        }
        break
      }
    }
  } catch (err) {
    console.error(`Error handling Paddle event ${event.eventType}:`, err)
    return new Response('Internal error', { status: 500 })
  }

  return new Response('ok', { status: 200 })
}

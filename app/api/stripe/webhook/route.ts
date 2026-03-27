import { getStripe, priceIdToPlan } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { headers } from 'next/headers'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig  = headers().get('stripe-signature')

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      // Checkout completed — link Stripe customer/subscription to user, set plan
      case 'checkout.session.completed': {
        const session    = event.data.object as Stripe.Checkout.Session
        const userId     = session.metadata?.user_id
        const customerId = session.customer as string
        const subId      = session.subscription as string

        if (!userId) break

        // Resolve plan from the subscription's price
        const sub    = await getStripe().subscriptions.retrieve(subId)
        const plan   = priceIdToPlan(sub.items.data[0]?.price.id ?? '')

        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId, stripe_subscription_id: subId, plan })
          .eq('id', userId)
        break
      }

      // Subscription canceled — downgrade to canceled
      case 'customer.subscription.deleted': {
        const sub        = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string

        await supabase
          .from('users')
          .update({ plan: 'canceled', stripe_subscription_id: null })
          .eq('stripe_customer_id', customerId)
        break
      }

      // Payment failed — notify user via WhatsApp
      case 'invoice.payment_failed': {
        const invoice    = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: user } = await supabase
          .from('users')
          .select('whatsapp_number')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user?.whatsapp_number) {
          await sendWhatsAppMessage(
            user.whatsapp_number,
            `Your TradeQuote payment failed. Update your billing details here: ${process.env.NEXT_PUBLIC_SITE_URL}/billing`
          )
        }
        break
      }
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err)
    return new Response('Internal error', { status: 500 })
  }

  return new Response('ok', { status: 200 })
}

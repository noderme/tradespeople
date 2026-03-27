import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export function priceIdToPlan(priceId: string): import('@/types/database').Plan {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID)     return 'pro'
  if (priceId === process.env.STRIPE_TEAM_PRICE_ID)    return 'team'
  return 'starter'
}

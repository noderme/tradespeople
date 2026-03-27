import { Paddle, Environment } from '@paddle/paddle-node-sdk'
import type { Plan } from '@/types/database'

let _paddle: Paddle | undefined

export function getPaddle(): Paddle {
  return (_paddle ??= new Paddle(process.env.PADDLE_API_KEY!, {
    environment: Environment.sandbox,
  }))
}

export function priceIdToPlan(priceId: string): Plan {
  if (priceId === process.env.PADDLE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.PADDLE_PRO_PRICE_ID)     return 'pro'
  if (priceId === process.env.PADDLE_TEAM_PRICE_ID)    return 'team'
  return 'starter'
}

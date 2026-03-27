'use client'

import { useEffect, useState } from 'react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { openPortalAction } from './actions'
import { Spinner } from '@/components/Spinner'
import { SubmitButton } from '@/components/SubmitButton'
import type { Plan } from '@/types/database'

const PLANS: {
  id: Plan
  label: string
  price: number
  priceEnvKey: string
  features: string[]
  highlight?: boolean
}[] = [
  {
    id: 'starter',
    label: 'Starter',
    price: 29,
    priceEnvKey: 'NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID',
    features: ['Up to 10 quotes/month', 'PDF generation', 'Email support'],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 79,
    priceEnvKey: 'NEXT_PUBLIC_PADDLE_PRO_PRICE_ID',
    features: ['Unlimited quotes', 'PDF generation', 'Custom branding', 'Priority support'],
    highlight: true,
  },
  {
    id: 'team',
    label: 'Team',
    price: 149,
    priceEnvKey: 'NEXT_PUBLIC_PADDLE_TEAM_PRICE_ID',
    features: ['Everything in Pro', 'Multiple users', 'Dedicated support', 'API access'],
  },
]

interface Props {
  userId: string
  plan: Plan
  isSubscribed: boolean
  trialDaysLeft: number | null
  success: boolean
  canceledReason: boolean
}

export function BillingClient({ userId, plan, isSubscribed, trialDaysLeft, success, canceledReason }: Props) {
  const [paddle, setPaddle] = useState<Paddle | undefined>()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  useEffect(() => {
    initializePaddle({
      environment: 'production',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(p => setPaddle(p))
  }, [])

  function handleCheckout(planId: string, priceEnvKey: string) {
    const priceId = (process.env as Record<string, string>)[priceEnvKey]
    if (!priceId) return
    setLoadingPlan(planId)
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { user_id: userId },
      settings: {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=1`,
      },
    })
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-2">Billing</h1>

      {success && (
        <div className="bg-green-950 border border-green-800 text-green-300 px-4 py-3 text-sm mb-6 font-bold uppercase tracking-wider">
          Subscription activated. Welcome aboard.
        </div>
      )}

      {canceledReason && (
        <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-6 font-bold uppercase tracking-wider">
          Your subscription has ended. Renew to continue quoting.
        </div>
      )}

      {/* Current plan status */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Current Plan</div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="font-display font-bold text-3xl uppercase">
            {plan === 'canceled' ? (
              <span className="text-red-400">Canceled</span>
            ) : plan === 'trial' ? (
              'Free Trial'
            ) : (
              PLANS.find(p => p.id === plan)?.label ?? plan
            )}
          </div>

          <div className="flex items-center gap-3">
            {plan === 'trial' && trialDaysLeft !== null && (
              <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 ${
                trialDaysLeft <= 2
                  ? 'bg-red-900/60 text-red-300 border border-red-800'
                  : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
              }`}>
                {trialDaysLeft === 0 ? 'Expires today' : `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left`}
              </span>
            )}

            {isSubscribed && (
              <form action={openPortalAction}>
                <SubmitButton
                  label="Manage / Cancel →"
                  loadingLabel="Opening portal…"
                  className="border border-neutral-600 text-neutral-300 text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-neutral-400 transition-colors"
                />
              </form>
            )}
          </div>
        </div>

        {plan === 'canceled' && (
          <p className="text-neutral-500 text-sm mt-3">
            Your subscription has ended. Pick a plan below to reactivate.
          </p>
        )}
      </div>

      {/* Plan cards */}
      {plan !== 'pro' && plan !== 'team' && (
        <>
          <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4">
            {plan === 'starter' ? 'Upgrade Plan' : 'Choose a Plan'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map(p => {
              const isCurrent = plan === p.id

              return (
                <div
                  key={p.id}
                  className={`bg-neutral-900 border-2 p-6 flex flex-col ${
                    p.highlight ? 'border-orange-500' : 'border-neutral-800'
                  }`}
                >
                  {p.highlight && (
                    <div className="bg-orange-500 text-black text-xs font-bold uppercase tracking-widest px-2 py-0.5 self-start mb-3">
                      Most Popular
                    </div>
                  )}

                  <div className="font-display font-bold text-2xl uppercase mb-1">{p.label}</div>
                  <div className="mb-4">
                    <span className="font-display font-bold text-4xl text-orange-500">${p.price}</span>
                    <span className="text-neutral-500 text-sm">/mo</span>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="text-neutral-400 text-sm flex items-start gap-2">
                        <span className="text-orange-500 font-bold mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <div className="border border-neutral-700 text-neutral-500 text-xs font-bold uppercase tracking-wider px-4 py-3 text-center">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckout(p.id, p.priceEnvKey)}
                      disabled={loadingPlan === p.id}
                      className={`w-full font-bold uppercase tracking-wider py-3 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${
                        p.highlight
                          ? 'bg-orange-500 text-black hover:bg-orange-400'
                          : 'border border-neutral-600 text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {loadingPlan === p.id ? <><Spinner />Opening…</> : `Get ${p.label} →`}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {(plan === 'pro' || plan === 'team') && (
        <div className="bg-neutral-900 border border-neutral-800 p-6 text-center">
          <p className="text-neutral-400">
            You&apos;re on the <span className="text-orange-500 font-bold">{PLANS.find(p => p.id === plan)?.label}</span> plan.
            Use the button above to manage or cancel your subscription.
          </p>
        </div>
      )}
    </main>
  )
}

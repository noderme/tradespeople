'use client'

import type { Plan } from '@/types/database'

const PLANS = [
  {
    id: 'starter',
    label: 'Starter',
    price: 29,
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 79,
    highlight: true,
  },
  {
    id: 'team',
    label: 'Team',
    price: 149,
  },
]

interface Props {
  plan: Plan
  trialDaysLeft: number | null
}

export function BillingClient({ plan, trialDaysLeft }: Props) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-2">Billing</h1>

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
          {plan === 'trial' && trialDaysLeft !== null && (
            <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 ${
              trialDaysLeft <= 2
                ? 'bg-red-900/60 text-red-300 border border-red-800'
                : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
            }`}>
              {trialDaysLeft === 0 ? 'Expires today' : `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left`}
            </span>
          )}
        </div>
      </div>

      <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-4">Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {PLANS.map(p => (
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
            <div className="mb-6">
              <span className="font-display font-bold text-4xl text-orange-500">${p.price}</span>
              <span className="text-neutral-500 text-sm">/mo</span>
            </div>
            <div className="mt-auto border border-neutral-700 text-neutral-500 text-xs font-bold uppercase tracking-wider px-4 py-3 text-center">
              {plan === p.id ? 'Current Plan' : `Get ${p.label}`}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 p-6 text-center">
        <p className="text-neutral-400 text-sm">
          Billing will be available shortly.{' '}
          <span className="text-orange-400 font-bold">You&apos;re on a free trial — no action needed yet.</span>
        </p>
      </div>
    </main>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import type { Plan } from '@/types/database'

const PLAN_LABELS: Record<Plan, string> = {
  trial: 'Free Trial',
  starter: 'Starter',
  pro: 'Pro',
  team: 'Team',
}

const PLAN_FEATURES: Record<Plan, string[]> = {
  trial: ['Up to 10 quotes', 'WhatsApp bot', 'PDF generation', '7 days free'],
  starter: ['Unlimited quotes', 'WhatsApp bot', 'PDF generation', 'Email support'],
  pro: ['Everything in Starter', 'Custom branding', 'Priority support', 'Analytics'],
  team: ['Everything in Pro', 'Multiple users', 'Dedicated support', 'API access'],
}

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('plan, trial_ends_at, paddle_subscription_id, business_name')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const plan = profile.plan as Plan
  const trialDaysLeft = profile.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="min-h-screen bg-neutral-950">
      <Nav active="billing" />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">Billing</h1>

        {/* Current plan */}
        <section className="bg-neutral-900 border border-neutral-800 p-6 mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Current Plan</div>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold text-3xl uppercase">{PLAN_LABELS[plan]}</div>
            {plan === 'trial' && trialDaysLeft !== null && (
              <div className={`text-sm font-bold uppercase tracking-wider px-3 py-1 ${
                trialDaysLeft <= 2
                  ? 'bg-red-900/60 text-red-300 border border-red-800'
                  : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
              }`}>
                {trialDaysLeft === 0 ? 'Expires today' : `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left`}
              </div>
            )}
          </div>
          <ul className="space-y-1">
            {PLAN_FEATURES[plan].map(f => (
              <li key={f} className="text-neutral-400 text-sm flex items-center gap-2">
                <span className="text-orange-500 font-bold">✓</span> {f}
              </li>
            ))}
          </ul>
        </section>

        {/* Upgrade section */}
        {plan === 'trial' || plan === 'starter' ? (
          <section className="bg-neutral-900 border border-neutral-800 p-6 mb-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Upgrade Plan</div>

            {process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN !== 'REPLACE_WITH_PADDLE_CLIENT_TOKEN' ? (
              <div className="space-y-3">
                <div className="border border-neutral-700 p-4 flex items-center justify-between hover:border-orange-500/50 transition-colors cursor-pointer">
                  <div>
                    <div className="font-bold uppercase tracking-wide">Starter</div>
                    <div className="text-neutral-400 text-sm">Unlimited quotes, no expiry</div>
                  </div>
                  <div className="font-display font-bold text-xl text-orange-500">£29<span className="text-sm text-neutral-500">/mo</span></div>
                </div>
                <div className="border border-orange-500 p-4 flex items-center justify-between cursor-pointer bg-orange-500/5">
                  <div>
                    <div className="font-bold uppercase tracking-wide">Pro</div>
                    <div className="text-neutral-400 text-sm">Custom branding + analytics</div>
                  </div>
                  <div className="font-display font-bold text-xl text-orange-500">£59<span className="text-sm text-neutral-500">/mo</span></div>
                </div>
                <p className="text-neutral-600 text-xs mt-2">Checkout powered by Paddle</p>
              </div>
            ) : (
              <div className="border border-dashed border-neutral-700 p-8 text-center">
                <p className="text-neutral-500 text-sm uppercase tracking-wider">
                  Paddle integration not configured
                </p>
                <p className="text-neutral-600 text-xs mt-2">
                  Set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN to enable payments
                </p>
              </div>
            )}
          </section>
        ) : null}

        {/* Cancel subscription */}
        {profile.paddle_subscription_id && (
          <section className="bg-neutral-900 border border-neutral-800 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Danger Zone</div>
            <p className="text-neutral-400 text-sm mb-4">
              Cancelling will downgrade your account at the end of the current billing period.
            </p>
            <button className="border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-950 transition-colors">
              Cancel Subscription
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

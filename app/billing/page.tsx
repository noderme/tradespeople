import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { BillingClient } from './BillingClient'
import type { Plan } from '@/types/database'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; reason?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const plan = profile.plan as Plan
  const trialDaysLeft = profile.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null
  const isSubscribed = !!profile.paddle_subscription_id && plan !== 'trial' && plan !== 'canceled'

  return (
    <div className="min-h-screen bg-neutral-950">
      <Nav active="billing" />
      <BillingClient
        userId={user.id}
        plan={plan}
        isSubscribed={isSubscribed}
        trialDaysLeft={trialDaysLeft}
        success={!!searchParams.success}
        canceledReason={searchParams.reason === 'canceled'}
      />
      <Footer />
    </div>
  )
}

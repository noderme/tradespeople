import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { BillingClient } from './BillingClient'
import type { Plan } from '@/types/database'

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('plan, trial_ends_at')
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
      <BillingClient plan={plan} trialDaysLeft={trialDaysLeft} />
      <Footer />
    </div>
  )
}

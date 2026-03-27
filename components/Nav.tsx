import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function signOut() {
  'use server'
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function Nav({ active }: { active?: 'dashboard' | 'settings' | 'billing' }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('users').select('*').eq('id', user.id).single()
    : { data: null }

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null

  const navLink = (href: string, label: string, key: typeof active) => (
    <Link
      href={href}
      className={`text-xs font-bold uppercase tracking-widest transition-colors ${
        active === key
          ? 'text-orange-500'
          : 'text-neutral-400 hover:text-neutral-50'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-display font-bold text-lg tracking-widest uppercase text-orange-500">
            TRADEQUOTE
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            {navLink('/dashboard', 'Dashboard', 'dashboard')}
            {navLink('/settings', 'Settings', 'settings')}
            {navLink('/billing', 'Billing', 'billing')}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {profile?.plan === 'trial' && trialDaysLeft !== null && (
            <span className="hidden sm:inline-block bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider px-2 py-1">
              {trialDaysLeft}d left
            </span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-neutral-500 hover:text-neutral-200 uppercase tracking-widest font-bold transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

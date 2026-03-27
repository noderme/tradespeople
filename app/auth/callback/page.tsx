'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function handleAuth() {
      // With implicit flow, the browser client automatically processes
      // the #access_token hash fragment on initialization.
      // Give it a tick to complete before calling getSession.
      await new Promise(r => setTimeout(r, 100))

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.log('No session:', sessionError?.message)
        router.replace('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'))
        return
      }

      console.log('Session established for user:', session.user.id)

      // Check if profile exists
      const { data: profile } = await supabase
        .from('users')
        .select('id, trade_type')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        router.replace(profile.trade_type ? '/dashboard' : '/onboarding')
        return
      }

      // No profile — create it
      const meta = session.user.user_metadata ?? {}
      const { error: insertError } = await supabase.from('users').insert({
        id: session.user.id,
        email: session.user.email!,
        full_name: meta.full_name ?? '',
        business_name: meta.business_name ?? '',
        plan: 'trial',
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })

      if (insertError) {
        console.error('Profile insert error:', insertError.message)
        setError('Failed to create profile. Please try again.')
        return
      }

      router.replace('/onboarding')
    }

    handleAuth()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/signup" className="text-orange-500 hover:text-orange-400 text-sm uppercase tracking-wider font-bold">
            Back to signup
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-neutral-400 text-sm uppercase tracking-widest">Signing you in…</div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

async function handleSession(
  session: { user: { id: string; email?: string; user_metadata?: Record<string, string> } },
  isSignup: boolean,
  supabase: SupabaseClient
) {
  const user = session.user
  console.log('User:', user.id)

  const { data: profile } = await supabase
    .from('users')
    .select('id, trade_type')
    .eq('id', user.id)
    .single()

  console.log('Profile:', profile)

  if (isSignup || !profile) {
    if (!profile) {
      const meta = user.user_metadata ?? {}
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email!,
        full_name: meta.full_name ?? '',
        business_name: meta.business_name ?? '',
        plan: 'trial',
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      if (insertError) {
        console.error('Profile insert error:', insertError.message)
        return null // signal error
      }
    }
    console.log('Redirecting to: /onboarding')
    window.location.href = '/onboarding'
    return
  }

  const destination = profile.trade_type ? '/dashboard' : '/onboarding'
  console.log('Redirecting to:', destination)
  window.location.href = destination
}

function AuthCallback() {
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const isSignup = searchParams.get('signup') === '1'
    console.log('isSignup:', isSignup)

    async function checkSession() {
      // Wait for Supabase to process the hash
      await new Promise(resolve => setTimeout(resolve, 500))

      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session check:', session?.user?.id)

      if (!session) {
        // Try once more after another second
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: { session: session2 } } = await supabase.auth.getSession()
        console.log('Session retry:', session2?.user?.id)
        if (!session2) {
          window.location.href = '/login?error=' + encodeURIComponent('Authentication failed. Please try again.')
          return
        }
        const result = await handleSession(session2, isSignup, supabase)
        if (result === null) setError('Failed to create profile. Please try again.')
        return
      }

      const result = await handleSession(session, isSignup, supabase)
      if (result === null) setError('Failed to create profile. Please try again.')
    }

    checkSession()
  }, [searchParams])

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
      <div className="text-neutral-400 text-sm uppercase tracking-widest">Signing you in…</div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-400 text-sm uppercase tracking-widest">Signing you in…</div>
      </div>
    }>
      <AuthCallback />
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/Spinner'

export default function SignupPage() {
  const [fullName,     setFullName]     = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email,        setEmail]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [sent,         setSent]         = useState(false)

  // Read error from URL on mount
  const urlError = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('error')
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
          business_name: businessName.trim(),
          is_new_signup: true,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col">
        <header className="border-b border-neutral-800 px-6 h-14 flex items-center">
          <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">TRADEQUOTE</span>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            <div className="text-4xl mb-4">✉</div>
            <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-3">Check your email</h2>
            <p className="text-neutral-400">We sent a magic link to <span className="text-neutral-200">{email}</span>. Click it to activate your account.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center">
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">TRADEQUOTE</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-2">
              START YOUR<br />
              <span className="text-orange-500">FREE TRIAL</span>
            </h1>
            <p className="text-neutral-400">7 days free. No credit card needed.</p>
          </div>

          {(error || urlError) && (
            <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-6">
              {error || urlError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                placeholder="John Smith"
                className="w-full px-4 py-3 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                required
                placeholder="Smith Plumbing Ltd"
                className="w-full px-4 py-3 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="john@smithplumbing.com"
                className="w-full px-4 py-3 text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 text-lg hover:bg-orange-400 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Spinner />Creating account…</> : 'Create Account →'}
            </button>
          </form>

          <p className="text-neutral-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-orange-500 hover:text-orange-400">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

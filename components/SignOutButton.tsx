'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/Spinner'
import NProgress from 'nprogress'

export function SignOutButton() {
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    NProgress.start()
    const supabase = createClient()
    await supabase.auth.signOut()
    // Hard navigate so server re-reads cookies and sees no session
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-xs text-neutral-500 hover:text-neutral-200 uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5"
    >
      {loading ? <><Spinner />Signing out…</> : 'Sign Out'}
    </button>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NProgress from 'nprogress'

export function SignOutButton() {
  const router = useRouter()

  function handleSignOut() {
    NProgress.start()
    // Redirect immediately — don't wait for Supabase
    router.push('/')
    // Clear session in background
    const supabase = createClient()
    supabase.auth.signOut().catch(() => {})
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-neutral-500 hover:text-neutral-200 uppercase tracking-widest font-bold transition-colors"
    >
      Sign Out
    </button>
  )
}

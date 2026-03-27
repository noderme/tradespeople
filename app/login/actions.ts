'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string).trim()
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://quotejob.app/auth/callback',
      shouldCreateUser: false,
    },
  })

  if (error) {
    // Supabase returns an error when shouldCreateUser: false and email doesn't exist
    redirect(`/login?error=no_account`)
  }

  redirect('/login/check-email')
}

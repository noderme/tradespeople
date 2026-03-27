'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUpAction(formData: FormData) {
  const email = (formData.get('email') as string).trim()
  const full_name = (formData.get('full_name') as string).trim()
  const business_name = (formData.get('business_name') as string).trim()
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://quotejob.app/auth/callback',
      data: { full_name, business_name, is_new_signup: true },
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/signup/check-email')
}

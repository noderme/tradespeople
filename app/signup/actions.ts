'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export async function signUpAction(formData: FormData) {
  const email = (formData.get('email') as string).trim()
  const full_name = (formData.get('full_name') as string).trim()
  const business_name = (formData.get('business_name') as string).trim()
  const whatsapp_number = (formData.get('whatsapp_number') as string).trim()

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Supabase → Auth → URL Configuration → add this URL to allowed redirects
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      data: { full_name, business_name, whatsapp_number, is_new_signup: true },
    },
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/signup/check-email')
}

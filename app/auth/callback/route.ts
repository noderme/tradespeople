import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // Check if user profile row already exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (existing) {
    // Returning user — send to dashboard or onboarding if not complete
    const dest = existing.trade_type ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(`${origin}${dest}`)
  }

  // New user — create profile row from metadata set during signup
  const meta = user.user_metadata ?? {}
  const { error: insertError } = await supabase.from('users').insert({
    id: user.id,
    email: user.email!,
    full_name: meta.full_name ?? '',
    business_name: meta.business_name ?? '',
    whatsapp_number: meta.whatsapp_number ?? '',
    plan: 'trial',
    trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })

  if (insertError) {
    console.error('Failed to create user profile:', insertError.message)
    return NextResponse.redirect(`${origin}/login?error=profile_failed`)
  }

  return NextResponse.redirect(`${origin}/onboarding`)
}

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const supabaseError = searchParams.get('error_description') || searchParams.get('error')
  if (supabaseError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(supabaseError)}`)
  }

  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null

  if (!code && !token_hash) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Invalid or expired link. Please request a new one.')}`)
  }

  const response = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  let authError = null

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    user = data.user
    authError = error
  } else if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    user = data.user
    authError = error
  }

  if (authError || !user) {
    console.error('Auth error:', authError?.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed. Make sure you opened the link in the same browser you signed up in.')}`)
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, trade_type')
    .eq('id', user.id)
    .single()

  // No profile → new user, create it and go to onboarding
  if (!profile) {
    const meta = user.user_metadata ?? {}
    await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
      full_name: meta.full_name ?? '',
      business_name: meta.business_name ?? '',
      plan: 'trial',
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    response.headers.set('Location', `${origin}/onboarding`)
    return response
  }

  // Profile exists but onboarding not complete
  if (!profile.trade_type) {
    response.headers.set('Location', `${origin}/onboarding`)
    return response
  }

  // Fully set up → dashboard
  response.headers.set('Location', `${origin}/dashboard`)
  return response
}

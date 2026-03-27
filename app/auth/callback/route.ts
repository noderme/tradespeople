import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  console.log('Callback URL:', request.url)

  // Supabase sends ?error= when the link is expired, already used, or denied
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

  // Build redirect response first so session cookies attach to it
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

  console.log('Auth result — user:', user?.id ?? null, 'error:', authError?.message ?? null)

  if (authError || !user) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`)
  }

  // Profile exists → route based on onboarding status
  const { data: existing } = await supabase
    .from('users')
    .select('id, trade_type')
    .eq('id', user.id)
    .single()

  if (existing) {
    const dest = existing.trade_type ? '/dashboard' : '/onboarding'
    response.headers.set('Location', `${origin}${dest}`)
    return response
  }

  // No profile — auth succeeded so this is a valid user. Create profile and send to onboarding.
  // (If they came via the login page with a fresh email, onboarding will collect what's needed.)
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
    console.error('Failed to create user profile:', insertError.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Failed to create profile. Please try again.')}`)
  }

  response.headers.set('Location', `${origin}/onboarding`)
  return response
}

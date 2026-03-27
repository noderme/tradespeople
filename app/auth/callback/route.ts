import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  console.log('1. Callback hit - full URL:', request.url)

  // Supabase sends ?error= when the link is expired, already used, or denied
  const supabaseError = searchParams.get('error_description') || searchParams.get('error')
  if (supabaseError) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(supabaseError)}`)
  }

  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null

  console.log('2. Code param:', code)
  console.log('3. Signup param:', searchParams.get('signup'))

  if (!code && !token_hash) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Invalid or expired link. Please request a new one.')}`)
  }

  // Build redirect response first so session cookies attach to it
  const response = NextResponse.redirect(`${origin}/dashboard`)

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
      },
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
    console.log('4. Exchange code result:', { data: { user: data?.user?.id }, error })
    console.log('5. User ID:', data?.user?.id)
    user = data.user
    authError = error
  } else if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    console.log('4. verifyOtp result:', { data: { user: data?.user?.id }, error })
    console.log('5. User ID:', data?.user?.id)
    user = data.user
    authError = error
  }

  if (authError || !user) {
    console.log('7. Redirecting to: /login (auth failed)', authError?.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`)
  }

  const { data: userRow, error: userError } = await supabase
    .from('users')
    .select('id, trade_type')
    .eq('id', user.id)
    .single()

  console.log('6. User lookup result:', { userRow, userError: userError?.message })

  if (userRow) {
    const redirectTo = userRow.trade_type ? '/dashboard' : '/onboarding'
    console.log('7. Redirecting to:', redirectTo)
    response.headers.set('Location', `${origin}${redirectTo}`)
    return response
  }

  // No profile — create it and send to onboarding
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
    console.error('Insert error:', insertError.message)
    console.log('7. Redirecting to: /login (profile creation failed)')
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Failed to create profile. Please try again.')}`)
  }

  console.log('7. Redirecting to: /onboarding (new user)')
  response.headers.set('Location', `${origin}/onboarding`)
  return response
}

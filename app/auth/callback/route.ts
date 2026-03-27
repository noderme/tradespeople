import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  // Build the redirect response up front so we can attach session cookies to it.
  // The `next/headers` cookie store used by createClient() does NOT propagate
  // cookies onto a NextResponse.redirect() — they get dropped, leaving the
  // browser sessionless and triggering an infinite redirect loop.
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

  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // Check if user profile row already exists
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

  response.headers.set('Location', `${origin}/onboarding`)
  return response
}

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Service-role Supabase client — bypasses Row Level Security.
 *
 * USE ONLY in:
 *   - Route Handlers called by external services (WhatsApp, Paddle webhooks)
 *   - Server Actions that need to act on behalf of any user
 *
 * NEVER expose this client to the browser or return it from a Server Component.
 * NEVER use NEXT_PUBLIC_* for the service role key.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase service role env vars')
  }

  return createClient<Database>(url, key, {
    auth: {
      // Service role clients must not persist sessions
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run on all routes EXCEPT:
     * - _next/static, _next/image  (Next.js internals)
     * - favicon, images            (static assets)
     * - api/webhooks/*             (WhatsApp + Paddle webhooks — must be
     *                               publicly accessible, no auth redirect)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|api/skill|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

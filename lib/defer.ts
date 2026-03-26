import { waitUntil } from '@vercel/functions'

/**
 * Run `fn` after the HTTP response has already been sent.
 *
 * This is REQUIRED for the WhatsApp webhook handler:
 *   - Meta requires a 200 OK within 5 seconds.
 *   - Claude inference + PDF generation takes 15–30 seconds.
 *   - Without defer(), Vercel would kill the function on response,
 *     leaving the work incomplete.
 *
 * Usage in a Route Handler:
 *
 *   export async function POST(req: Request) {
 *     const body = await req.json()
 *     defer(() => processWhatsAppMessage(body))  // runs after 200 is sent
 *     return new Response('ok', { status: 200 })
 *   }
 *
 * Vercel keeps the function alive until the promise resolves, up to
 * the maxDuration set in vercel.json (60s for webhook routes).
 */
export function defer(fn: () => Promise<void>) {
  waitUntil(fn())
}

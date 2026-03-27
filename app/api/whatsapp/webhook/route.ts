import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import { generateQuotePdf } from '@/lib/generatePdf'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$', NZD: 'NZ$',
}

function twiml(message: string, mediaUrl?: string) {
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  const body = mediaUrl
    ? `${escaped}<Media>${mediaUrl}</Media>`
    : escaped

  console.log('Returning TwiML:', message)

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${body}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' }, status: 200 }
  )
}

export async function POST(request: Request) {
  const form     = await request.formData()
  const from     = form.get('From') as string | null   // "whatsapp:+447911123456"
  const bodyText = form.get('Body') as string | null

  if (!from || !bodyText) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response/>`,
      { headers: { 'Content-Type': 'text/xml' }, status: 200 }
    )
  }

  // Strip "whatsapp:" prefix to get the plain phone number
  const phone = from.replace('whatsapp:', '')  // "+447911123456"

  const supabase = createServiceClient()

  // Look up user — number may be stored with or without + prefix
  const digits   = phone.replace(/\D/g, '')
  const withPlus = `+${digits}`

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .or(`whatsapp_number.eq.${digits},whatsapp_number.eq.${withPlus}`)
    .maybeSingle()

  if (!user) {
    return twiml("I don't recognise this number. Sign up at TradeQuote to get started.")
  }

  // Await Claude fully before returning — response MUST come after this
  const result = await handleConversation(user.id, bodyText, phone)

  // Regular message — reply inline via TwiML
  if (result.type === 'message') {
    return twiml(result.text)
  }

  // Quote created — generate PDF synchronously, then return TwiML with media
  console.log('Quote JSON received:', result.quoteId)

  try {
    const { data: quote } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', result.quoteId)
      .single()

    if (!quote) return twiml('Your quote was created. Check your dashboard for the PDF.')

    console.log('Generating PDF...')
    await generateQuotePdf(quote, user)
    console.log('PDF generated, uploading to Supabase...')

    // Re-fetch to get the stored pdf_url
    const { data: sent } = await supabase
      .from('quotes')
      .select('pdf_url')
      .eq('id', result.quoteId)
      .single()

    console.log('PDF URL:', sent?.pdf_url)

    const symbol   = CURRENCY_SYMBOLS[user.currency ?? 'USD'] ?? '$'
    const total    = Number(quote.total).toFixed(2)
    const year     = new Date(quote.created_at).getFullYear()
    const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
    const caption  = `Quote ${quoteNum} for ${quote.customer_name} — ${symbol}${total}`

    // Return TwiML with PDF as media — single message, no separate REST call
    return twiml(caption, sent?.pdf_url ?? undefined)
  } catch (err) {
    console.error('Error generating or sending PDF:', err)
    return twiml('Your quote was created but the PDF failed to generate. Check your dashboard.')
  }
}

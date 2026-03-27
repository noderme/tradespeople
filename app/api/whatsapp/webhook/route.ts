import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import { generateQuotePdf } from '@/lib/generatePdf'
import { sendWhatsAppDocument } from '@/lib/whatsapp'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$', NZD: 'NZ$',
}

function twiml(message: string) {
  // Escape XML special characters in the message body
  const escaped = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  )
}

function twimlEmpty() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response/>`,
    { headers: { 'Content-Type': 'text/xml' } }
  )
}

export async function POST(request: Request) {
  const form     = await request.formData()
  const from     = form.get('From') as string | null   // "whatsapp:+447911123456"
  const bodyText = form.get('Body') as string | null

  if (!from || !bodyText) return twimlEmpty()

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
    return twiml(
      "I don't recognise this number. Sign up at TradeQuote to get started."
    )
  }

  const result = await handleConversation(user.id, bodyText, phone)

  // Regular message — reply inline via TwiML
  if (result.type === 'message') {
    return twiml(result.text)
  }

  // Quote created — generate PDF and send via Twilio REST API
  console.log('Quote JSON received:', result.quoteId)

  try {
    const { data: quote } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', result.quoteId)
      .single()

    if (!quote) return twimlEmpty()

    console.log('Generating PDF...')
    await generateQuotePdf(quote, user)
    console.log('PDF generated, uploading to Supabase...')

    // Re-fetch to get the uploaded pdf_url
    const { data: sent } = await supabase
      .from('quotes')
      .select('pdf_url')
      .eq('id', result.quoteId)
      .single()

    console.log('PDF URL:', sent?.pdf_url)

    if (sent?.pdf_url) {
      const symbol   = CURRENCY_SYMBOLS[user.currency ?? 'USD'] ?? '$'
      const total    = Number(quote.total).toFixed(2)
      const year     = new Date(quote.created_at).getFullYear()
      const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
      const caption  = `Quote ${quoteNum} for ${quote.customer_name} — ${symbol}${total}`

      console.log('Sending PDF via Twilio...')
      await sendWhatsAppDocument(phone, sent.pdf_url, caption)
      console.log('PDF sent successfully')
    }
  } catch (err) {
    console.error('Error generating or sending PDF:', err)
  }

  // Return empty TwiML — the PDF message was sent via REST API above
  return twimlEmpty()
}

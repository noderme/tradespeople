import { createServiceClient } from '@/lib/supabase/service'
import { handleConversation } from '@/lib/conversation'
import { generateQuotePdf } from '@/lib/generatePdf'
import { sendWhatsAppMessage, sendWhatsAppDocument } from '@/lib/whatsapp'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', CAD: 'CA$', AUD: 'A$', NZD: 'NZ$',
}

export async function POST(request: Request) {
  const form     = await request.formData()
  const from     = form.get('From') as string | null   // "whatsapp:+447911123456"
  const bodyText = form.get('Body') as string | null

  if (!from || !bodyText) return new Response('', { status: 200 })

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
    await sendWhatsAppMessage(phone, "I don't recognise this number. Sign up at TradeQuote to get started.")
    return new Response('', { status: 200 })
  }

  const result = await handleConversation(user.id, bodyText, phone)

  if (result.type === 'message') {
    console.log('Sending reply via Twilio REST:', result.text)
    await sendWhatsAppMessage(phone, result.text)
    return new Response('', { status: 200 })
  }

  // Quote created — generate PDF and send via Twilio REST API
  console.log('Quote JSON received:', result.quoteId)

  try {
    const { data: quote } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', result.quoteId)
      .single()

    if (!quote) {
      await sendWhatsAppMessage(phone, 'Your quote was created. Check your dashboard for the PDF.')
      return new Response('', { status: 200 })
    }

    console.log('Generating PDF...')
    await generateQuotePdf(quote, user)
    console.log('PDF generated, uploading to Supabase...')

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

    if (sent?.pdf_url) {
      console.log('Sending PDF via Twilio...')
      await sendWhatsAppDocument(phone, sent.pdf_url, caption)
      console.log('PDF sent successfully')
    } else {
      await sendWhatsAppMessage(phone, caption)
    }
  } catch (err) {
    console.error('Error generating or sending PDF:', err)
    await sendWhatsAppMessage(phone, 'Your quote was created but the PDF failed to generate. Check your dashboard.')
  }

  return new Response('', { status: 200 })
}

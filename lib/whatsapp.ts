import twilio from 'twilio'

function client() {
  return twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
}

const FROM = () => process.env.TWILIO_WHATSAPP_NUMBER!  // e.g. "whatsapp:+14155238886"

/** Send a plain-text WhatsApp message via Twilio. */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio env vars not set — skipping message to', to)
    return
  }

  // Ensure the number has whatsapp: prefix
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

  await client().messages.create({
    from: FROM(),
    to: toFormatted,
    body: text,
  })
}

/** Send a PDF document via Twilio WhatsApp using a public URL. */
export async function sendWhatsAppDocument(
  to: string,
  pdfUrl: string,
  caption: string
): Promise<void> {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio env vars not set — skipping document to', to)
    return
  }

  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

  await client().messages.create({
    from: FROM(),
    to: toFormatted,
    body: caption,
    mediaUrl: [pdfUrl],
  })
}

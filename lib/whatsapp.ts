async function whatsappPost(phoneNumberId: string, token: string, payload: object): Promise<void> {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messaging_product: 'whatsapp', ...payload }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('WhatsApp send failed:', err)
  }
}

/**
 * Send a plain-text WhatsApp message via the Cloud API.
 * Used by webhooks and notification flows.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token         = process.env.WHATSAPP_TOKEN

  if (!phoneNumberId || !token) {
    console.warn('WhatsApp env vars not set — skipping message to', to)
    return
  }

  await whatsappPost(phoneNumberId, token, {
    to: to.replace(/\D/g, ''),
    type: 'text',
    text: { body: text },
  })
}

/**
 * Send a PDF document via WhatsApp using a public URL.
 * The link must be publicly accessible (Supabase Storage public bucket qualifies).
 */
export async function sendWhatsAppDocument(
  to: string,
  link: string,
  filename: string,
  caption: string
): Promise<void> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token         = process.env.WHATSAPP_TOKEN

  if (!phoneNumberId || !token) {
    console.warn('WhatsApp env vars not set — skipping document to', to)
    return
  }

  await whatsappPost(phoneNumberId, token, {
    to: to.replace(/\D/g, ''),
    type: 'document',
    document: { link, filename, caption },
  })
}

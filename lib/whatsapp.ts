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

  // Strip all non-digit characters
  const normalizedTo = to.replace(/\D/g, '')

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizedTo,
        type: 'text',
        text: { body: text },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('WhatsApp send failed:', err)
  }
}

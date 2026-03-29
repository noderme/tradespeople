import { buildPdfBuffer } from '@/lib/generatePdf'
import type { Database } from '@/types/database'

type Quote = Database['public']['Tables']['quotes']['Row']
type User  = Database['public']['Tables']['users']['Row']

export async function GET() {
  const quote: Quote = {
    id:            'b4e1f9c2-8d3a-4f7e-9b2c-1a3d5e7f9a3f',
    user_id:       'test-user',
    customer_id:   null,
    customer_name:    'John Smith',
    customer_address: '42 Oak Street, Manchester',
    status:           'draft',
    line_items: [
      { description: 'Pipe repair',        quantity: 1, unit_price: 120, total: 120 },
      { description: 'Leakage fix',        quantity: 1, unit_price: 345, total: 345 },
      { description: 'Copper fittings x3', quantity: 3, unit_price:  15, total:  45 },
    ],
    subtotal:    510,
    tax_rate:    0,
    total:       510,
    notes:       null,
    pdf_url:     null,
    created_at:  new Date().toISOString(),
    sent_at:     null,
    viewed_at:   null,
    accepted_at: null,
  }

  const user: User = {
    id:                     'test-user',
    created_at:             new Date().toISOString(),
    email:                  'mike@mikesplumbing.com',
    full_name:              'Mike Johnson',
    business_name:          "Mike's Plumbing",
    whatsapp_number:        '+447911123456',
    logo_url:               null,
    plan:                   'trial',
    trial_ends_at:          null,
    paddle_customer_id:     null,
    paddle_subscription_id: null,
    trade_type:             'plumber',
    default_tax_rate:       0,
    currency:               'USD',
    business_phone:         '+44 7911 123456',
    business_email:         'mike@mikesplumbing.com',
    google_place_id:        null,
  }

  const buffer = await buildPdfBuffer(quote, user)

  return new Response(buffer.buffer as ArrayBuffer, {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': 'inline; filename="test-quote.pdf"',
    },
  })
}

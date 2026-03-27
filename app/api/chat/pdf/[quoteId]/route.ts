import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { buildPdfBuffer, generateQuotePdf } from '@/lib/generatePdf'

async function getQuoteAndUser(quoteId: string, userId: string) {
  const service = createServiceClient()

  const [{ data: quote }, { data: userProfile }] = await Promise.all([
    service.from('quotes').select('*').eq('id', quoteId).eq('user_id', userId).single(),
    service.from('users').select('*').eq('id', userId).single(),
  ])

  return { quote, userProfile }
}

// GET — stream PDF as a file download (no storage side effects)
export async function GET(
  _request: Request,
  { params }: { params: { quoteId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { quote, userProfile } = await getQuoteAndUser(params.quoteId, user.id)
  if (!quote || !userProfile) return new Response('Not found', { status: 404 })

  console.log('Quote data for PDF:', JSON.stringify(quote))
  console.log('User business_name:', userProfile.business_name)

  const buffer   = await buildPdfBuffer(quote, userProfile)
  const year     = new Date(quote.created_at).getFullYear()
  const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`

  return new Response(buffer.buffer as ArrayBuffer, {
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${quoteNum}.pdf"`,
    },
  })
}

// POST — upload PDF to storage, mark as sent, return public URL
export async function POST(
  _request: Request,
  { params }: { params: { quoteId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { quote, userProfile } = await getQuoteAndUser(params.quoteId, user.id)
  if (!quote || !userProfile) return Response.json({ error: 'Not found' }, { status: 404 })

  await generateQuotePdf(quote, userProfile)

  // Re-fetch pdf_url set by generateQuotePdf
  const service = createServiceClient()
  const { data: updated } = await service
    .from('quotes')
    .select('pdf_url')
    .eq('id', params.quoteId)
    .single()

  return Response.json({ pdfUrl: updated?.pdf_url ?? null })
}

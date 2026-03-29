import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient()

  const { data: quote } = await supabase
    .from('quotes')
    .select('pdf_url')
    .eq('id', params.id)
    .single()

  if (!quote?.pdf_url) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }

  return NextResponse.redirect(quote.pdf_url)
}

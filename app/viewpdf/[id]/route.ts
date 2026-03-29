import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient()

  // Verify the quote exists and belongs to someone
  const { data: quote } = await supabase
    .from('quotes')
    .select('id')
    .eq('id', params.id)
    .single()

  if (!quote) {
    return NextResponse.json({ error: 'PDF not found' }, { status: 404 })
  }

  // Generate a time-limited signed URL (valid 30 days)
  const { data, error } = await supabase.storage
    .from('quotes')
    .createSignedUrl(`quote-${params.id}.pdf`, 60 * 60 * 24 * 30)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'PDF not available' }, { status: 404 })
  }

  return NextResponse.redirect(data.signedUrl)
}

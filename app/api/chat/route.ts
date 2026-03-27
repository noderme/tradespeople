import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleConversation } from '@/lib/conversation'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, threadId } = await request.json()
  if (!message || !threadId) {
    return NextResponse.json({ error: 'Missing message or threadId' }, { status: 400 })
  }

  const result = await handleConversation(user.id, message, threadId)
  return NextResponse.json(result)
}

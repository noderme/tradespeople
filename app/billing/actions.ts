'use server'

import { getPaddle } from '@/lib/paddle'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function openPortalAction() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('paddle_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.paddle_customer_id) redirect('/billing')

  const session = await getPaddle().customerPortalSessions.create(
    profile.paddle_customer_id,
    [],
  )

  redirect(session.urls.general.overview)
}

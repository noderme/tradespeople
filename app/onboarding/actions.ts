'use server'

import { createClient } from '@/lib/supabase/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function uploadLogoAction(formData: FormData): Promise<{ logo_url: string | null }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('logo') as File
  if (!file || file.size === 0) return { logo_url: null }

  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${user.id}/logo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw new Error(uploadError.message)

  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)

  await supabase.from('users').update({ logo_url: publicUrl }).eq('id', user.id)

  return { logo_url: publicUrl }
}

export async function saveTradeTypeAction(trade_type: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile, error } = await supabase
    .from('users')
    .update({ trade_type: trade_type as import('@/types/database').TradeType })
    .eq('id', user.id)
    .select('whatsapp_number')
    .single()

  if (error) throw new Error(error.message)

  if (profile?.whatsapp_number) {
    await sendWhatsAppMessage(
      profile.whatsapp_number,
      `Welcome to TradeQuote! 🔧\n\nYou're all set. Just message me here anytime to create a quote.\n\nTry it now — describe your first job and I'll generate a PDF quote in seconds.`
    )
  }
}

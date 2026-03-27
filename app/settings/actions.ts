'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const business_name   = (formData.get('business_name') as string).trim()
  const trade_type      = formData.get('trade_type') as string
  const default_tax_rate = parseFloat(formData.get('default_tax_rate') as string) / 100
  const business_phone  = (formData.get('business_phone') as string).trim() || null
  const business_email  = (formData.get('business_email') as string).trim() || null

  const { error } = await supabase
    .from('users')
    .update({
      business_name,
      trade_type: trade_type as import('@/types/database').TradeType,
      default_tax_rate,
      business_phone,
      business_email,
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/settings')
}

export async function uploadLogoAction(formData: FormData): Promise<{ logo_url: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('logo') as File
  if (!file || file.size === 0) throw new Error('No file selected')

  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${user.id}/logo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw new Error(uploadError.message)

  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(path)

  await supabase.from('users').update({ logo_url: publicUrl }).eq('id', user.id)

  revalidatePath('/settings')
  return { logo_url: publicUrl }
}

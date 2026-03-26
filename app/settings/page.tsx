import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen bg-neutral-950">
      <Nav active="settings" />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">Settings</h1>

        {searchParams.saved && (
          <div className="bg-green-950 border border-green-800 text-green-300 px-4 py-3 text-sm mb-6 uppercase tracking-wider font-bold">
            Saved.
          </div>
        )}

        <SettingsForm profile={profile} />
      </main>
    </div>
  )
}

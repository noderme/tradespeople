import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { QuotesTable } from './QuotesTable'

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
// formatDate kept for potential future use
void formatDate

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (!profile.trade_type) redirect('/onboarding')

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const currency   = profile.currency ?? 'USD'
  const allQuotes  = quotes ?? []
  const accepted   = allQuotes.filter(q => q.status === 'accepted')
  const pending    = allQuotes.filter(q => q.status === 'sent' || q.status === 'viewed')
  const totalValue = allQuotes.reduce((sum, q) => sum + Number(q.total), 0)
  const recentQuotes = allQuotes.slice(0, 10)

  return (
    <div className="min-h-screen bg-neutral-950">
      <Nav active="dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight">
            {profile.business_name}
          </h1>
          <p className="text-neutral-500 text-sm mt-1 uppercase tracking-wider">
            {profile.trade_type}
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 p-5">
            <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Total Quotes</div>
            <div className="font-display font-bold text-4xl">{allQuotes.length}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-5">
            <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Accepted</div>
            <div className="font-display font-bold text-4xl text-green-400">{accepted.length}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-5">
            <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Pending</div>
            <div className="font-display font-bold text-4xl text-yellow-400">{pending.length}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-5">
            <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Total Value</div>
            <div className="font-display font-bold text-4xl text-orange-500">
              {formatCurrency(totalValue, currency)}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">Recent Quotes</h2>
          <div className="flex gap-3">
            <a
              href="/chat"
              className="bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold uppercase tracking-wider px-4 py-2 transition-colors"
            >
              + New Quote
            </a>
            <a
              href="/settings"
              className="border border-neutral-700 text-neutral-400 text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-neutral-500 hover:text-neutral-200 transition-colors"
            >
              Settings
            </a>
          </div>
        </div>

        {/* Quotes table */}
        {recentQuotes.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-neutral-400 font-bold uppercase tracking-wider mb-2">No quotes yet</p>
            <p className="text-neutral-600 text-sm">
              Use the chat to create your first quote.
            </p>
          </div>
        ) : (
          <QuotesTable quotes={recentQuotes} currency={currency} />
        )}
      </main>
      <Footer />
    </div>
  )
}

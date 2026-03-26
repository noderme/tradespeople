import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import type { QuoteStatus } from '@/types/database'

const STATUS_STYLES: Record<QuoteStatus, string> = {
  draft:    'bg-neutral-800 text-neutral-400',
  sent:     'bg-blue-900/60 text-blue-300',
  viewed:   'bg-yellow-900/60 text-yellow-300',
  accepted: 'bg-green-900/60 text-green-300',
  declined: 'bg-red-900/60 text-red-400',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

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

  const allQuotes = quotes ?? []
  const accepted = allQuotes.filter(q => q.status === 'accepted')
  const pending = allQuotes.filter(q => q.status === 'sent' || q.status === 'viewed')
  const totalValue = accepted.reduce((sum, q) => sum + Number(q.total), 0)
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
            <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Total Sent</div>
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
            <div className="font-display font-bold text-4xl text-orange-500">{formatCurrency(totalValue)}</div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight">Recent Quotes</h2>
          <div className="flex gap-3">
            <a
              href="/billing"
              className="border border-neutral-700 text-neutral-400 text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-neutral-500 hover:text-neutral-200 transition-colors"
            >
              Manage Billing
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
              Message your WhatsApp bot to create your first quote.
            </p>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-neutral-500 px-5 py-3">Customer</th>
                  <th className="text-right text-xs font-bold uppercase tracking-widest text-neutral-500 px-5 py-3">Amount</th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-neutral-500 px-5 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-xs font-bold uppercase tracking-widest text-neutral-500 px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map((quote, i) => (
                  <tr
                    key={quote.id}
                    className={`border-b border-neutral-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-neutral-900/50'}`}
                  >
                    <td className="px-5 py-4 font-medium">{quote.customer_name}</td>
                    <td className="px-5 py-4 text-right font-bold font-display text-lg">
                      {formatCurrency(Number(quote.total))}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[quote.status as QuoteStatus]}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-500 text-sm hidden md:table-cell">
                      {formatDate(quote.created_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {quote.pdf_url && (
                        <a
                          href={quote.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:text-orange-400 font-bold uppercase tracking-wider"
                        >
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

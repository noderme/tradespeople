'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Database, QuoteStatus } from '@/types/database'

type Quote = Database['public']['Tables']['quotes']['Row']

const STATUS_STYLES: Record<QuoteStatus, string> = {
  draft:    'bg-neutral-800 text-neutral-400',
  sent:     'bg-blue-900/60 text-blue-300',
  viewed:   'bg-yellow-900/60 text-yellow-300',
  accepted: 'bg-green-900/60 text-green-300',
  declined: 'bg-red-900/60 text-red-400',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

interface SendModalState {
  quoteId: string
  quoteNum: string
}

export function QuotesTable({ quotes, currency }: { quotes: Quote[], currency: string }) {
  const router = useRouter()
  const [modal,     setModal]     = useState<SendModalState | null>(null)
  const [email,     setEmail]     = useState('')
  const [sending,   setSending]   = useState(false)
  const [sentIds,   setSentIds]   = useState<Set<string>>(new Set())
  const [error,     setError]     = useState<string | null>(null)

  function openModal(quote: Quote) {
    const year     = new Date(quote.created_at).getFullYear()
    const quoteNum = `Q-${year}-${quote.id.slice(-4).toUpperCase()}`
    setModal({ quoteId: quote.id, quoteNum })
    setEmail('')
    setError(null)
  }

  function closeModal() {
    setModal(null)
    setEmail('')
    setError(null)
  }

  async function handleSend() {
    if (!modal || !email.trim()) return
    setSending(true)
    setError(null)

    try {
      const res = await fetch(`/api/quotes/${modal.quoteId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to send')
      }

      setSentIds(prev => { const next = new Set(prev); next.add(modal.quoteId); return next })
      closeModal()
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
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
            {quotes.map((quote, i) => {
              const isSent = sentIds.has(quote.id)
              const status = isSent ? 'sent' : quote.status as QuoteStatus
              return (
                <tr
                  key={quote.id}
                  className={`border-b border-neutral-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-neutral-900/50'}`}
                >
                  <td className="px-5 py-4 font-medium">{quote.customer_name}</td>
                  <td className="px-5 py-4 text-right font-bold font-display text-lg">
                    {formatCurrency(Number(quote.total), currency)}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-neutral-500 text-sm hidden md:table-cell">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {quote.pdf_url && (
                        <a
                          href={quote.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-400 hover:text-neutral-200 font-bold uppercase tracking-wider transition-colors"
                        >
                          View PDF
                        </a>
                      )}
                      {status === 'draft' && (
                        <button
                          onClick={() => openModal(quote)}
                          className="text-xs text-orange-500 hover:text-orange-400 font-bold uppercase tracking-wider transition-colors"
                        >
                          Send
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Send modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md p-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-1">
              Send Quote
            </h3>
            <p className="text-neutral-500 text-sm mb-6">{modal.quoteNum} — PDF will be attached</p>

            {error && (
              <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Customer Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
              placeholder="customer@example.com"
              autoFocus
              className="w-full px-4 py-3 mb-6 bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-orange-500"
              style={{ fontSize: '16px' }}
            />

            <div className="flex gap-3">
              <button
                onClick={handleSend}
                disabled={!email.trim() || sending}
                className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold uppercase tracking-wider py-3 transition-colors"
              >
                {sending ? 'Sending…' : 'Send PDF →'}
              </button>
              <button
                onClick={closeModal}
                className="border border-neutral-700 text-neutral-400 hover:text-neutral-200 font-bold uppercase tracking-wider px-6 py-3 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

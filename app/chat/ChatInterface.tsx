'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'bot'
  text: string
  loading?: boolean
}

interface QuoteReady {
  quoteId: string
}

type Stage = 'chatting' | 'quote_ready' | 'sending' | 'sent'

const WELCOME = "Hey! Describe your first job and I'll generate a PDF quote in seconds."

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ChatInterface({ userId }: { userId: string }) {
  const threadId  = useRef(typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36)).current
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: WELCOME },
  ])
  const [input,       setInput]       = useState('')
  const [sending,     setSending]     = useState(false)
  const [stage,       setStage]       = useState<Stage>('chatting')
  const [quoteReady,  setQuoteReady]  = useState<QuoteReady | null>(null)
  const [email,       setEmail]       = useState('')
  const [pdfUrl,      setPdfUrl]      = useState<string | null>(null)
  const [copied,      setCopied]      = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stage])

  const addBotMessage = useCallback((text: string) => {
    setMessages(prev => [...prev.filter(m => !m.loading), { role: 'bot', text }])
  }, [])

  async function sendMessage() {
    const text = input.trim()
    if (!text || sending || stage !== 'chatting') return

    setInput('')
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'bot', text: '●●●', loading: true },
    ])
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, threadId }),
      })

      if (!res.ok) throw new Error('Request failed')
      const result = await res.json()

      if (result.type === 'message') {
        addBotMessage(result.text)
      } else if (result.type === 'quote_created') {
        addBotMessage("Quote ready! Download the PDF or send it to your customer.")
        setQuoteReady({ quoteId: result.quoteId })
        setStage('quote_ready')
      }
    } catch {
      addBotMessage('Something went wrong. Please try again.')
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  async function handleDownloadPdf() {
    if (!quoteReady) return
    window.open(`/api/chat/pdf/${quoteReady.quoteId}`, '_blank')
  }

  async function handleSendToCustomer() {
    if (!quoteReady) return
    setStage('sending')

    try {
      const res = await fetch(`/api/chat/pdf/${quoteReady.quoteId}`, { method: 'POST' })
      const { pdfUrl: url } = await res.json()
      setPdfUrl(url)
      setStage('sent')
    } catch {
      addBotMessage('Failed to generate PDF link. Try downloading instead.')
      setStage('quote_ready')
    }
  }

  async function copyLink() {
    if (!pdfUrl) return
    await navigator.clipboard.writeText(pdfUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function startOver() {
    setMessages([{ role: 'bot', text: "Quote sent! Start another job — describe it below." }])
    setStage('chatting')
    setQuoteReady(null)
    setPdfUrl(null)
    setEmail('')
    setCopied(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col bg-neutral-950 text-neutral-100" style={{ height: '100dvh' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="flex-none border-b border-neutral-800 px-4 h-14 flex items-center justify-between bg-neutral-950 z-10"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </span>
        <Link
          href="/dashboard"
          className="text-neutral-500 hover:text-neutral-200 text-xs uppercase tracking-widest font-bold transition-colors"
        >
          Dashboard
        </Link>
      </header>

      {/* ── Messages ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] px-4 py-3 text-[15px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-black font-medium rounded-2xl rounded-br-sm'
                  : 'bg-neutral-800 text-neutral-100 rounded-2xl rounded-bl-sm'
              } ${msg.loading ? 'animate-pulse text-neutral-400' : ''}`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* ── Quote ready actions ────────────────────────── */}
        {(stage === 'quote_ready' || stage === 'sending') && quoteReady && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[82%] w-full space-y-3">
              <button
                onClick={handleDownloadPdf}
                className="w-full bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-neutral-100 font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                <span>↓</span> Download PDF
              </button>
              <button
                onClick={handleSendToCustomer}
                disabled={stage === 'sending'}
                className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60 text-black font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                {stage === 'sending' ? 'Generating link…' : <><span>✉</span> Send to Customer</>}
              </button>
            </div>
          </div>
        )}

        {/* ── Sent — show shareable link ─────────────────── */}
        {stage === 'sent' && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[82%] w-full space-y-3">
              <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold mb-1">
                PDF ready — share with customer
              </div>

              {email !== undefined && (
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Customer email (optional)"
                  className="w-full bg-neutral-700 text-neutral-100 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              )}

              <div className="flex gap-2">
                <input
                  readOnly
                  value={pdfUrl ?? ''}
                  className="flex-1 bg-neutral-900 text-neutral-300 text-xs px-3 py-2 truncate focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className="bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors whitespace-nowrap"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={startOver}
                className="w-full border border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-neutral-100 font-bold uppercase tracking-wider text-sm py-3 transition-colors"
              >
                Start Another Job →
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ──────────────────────────────────────── */}
      <div
        className="flex-none border-t border-neutral-800 bg-neutral-950 px-4 pt-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
      >
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={stage === 'chatting' ? 'Describe the job…' : 'Quote complete'}
            disabled={sending || stage !== 'chatting'}
            rows={2}
            className="flex-1 bg-neutral-800 text-neutral-100 placeholder-neutral-500 px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-orange-500 leading-snug disabled:opacity-40"
            style={{ fontSize: '16px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending || stage !== 'chatting'}
            className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-40 text-black font-bold uppercase tracking-widest text-sm px-5 transition-colors whitespace-nowrap"
            style={{ minHeight: '44px', height: '60px' }}
          >
            {sending ? '…' : 'Send →'}
          </button>
        </div>
        <p className="text-neutral-600 text-xs mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/Spinner'

interface Message {
  role: 'user' | 'bot'
  text: string
  loading?: boolean
}

interface QuoteReady {
  quoteId: string
  pdfUrl: string | null
  pdfLoading: boolean
}

type Stage = 'chatting' | 'quote_ready'

const WELCOME = "Hey! Describe your first job and I'll generate a PDF quote in seconds."

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ChatInterface({ userId }: { userId: string }) {
  const threadId  = useRef(typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36)).current
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  const [messages,     setMessages]     = useState<Message[]>([{ role: 'bot', text: WELCOME }])
  const [input,        setInput]        = useState('')
  const [sending,      setSending]      = useState(false)
  const [stage,        setStage]        = useState<Stage>('chatting')
  const [quoteReady,   setQuoteReady]   = useState<QuoteReady | null>(null)
  const [email,        setEmail]        = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailError,   setEmailError]   = useState<string | null>(null)
  const [emailSent,    setEmailSent]    = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stage])

  const addBotMessage = useCallback((text: string) => {
    setMessages(prev => [...prev.filter(m => !m.loading), { role: 'bot', text }])
  }, [])

  async function generatePdfUrl(quoteId: string) {
    try {
      const res = await fetch(`/api/chat/pdf/${quoteId}`, { method: 'POST' })
      const { pdfUrl } = await res.json()
      setQuoteReady(prev => prev ? { ...prev, pdfUrl, pdfLoading: false } : null)
    } catch {
      setQuoteReady(prev => prev ? { ...prev, pdfLoading: false } : null)
    }
  }

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
        addBotMessage('Your quote is ready.')
        setQuoteReady({ quoteId: result.quoteId, pdfUrl: null, pdfLoading: true })
        setStage('quote_ready')
        generatePdfUrl(result.quoteId)
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

  async function handleEmailSend() {
    if (!quoteReady || !email.trim()) return
    setSendingEmail(true)
    setEmailError(null)
    try {
      const res = await fetch(`/api/quotes/${quoteReady.quoteId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to send')
      }
      setEmailSent(true)
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSendingEmail(false)
    }
  }

  function startAnother() {
    setMessages([{ role: 'bot', text: "Ready for the next one! Describe the job." }])
    setStage('chatting')
    setQuoteReady(null)
    setEmail('')
    setSendingEmail(false)
    setEmailError(null)
    setEmailSent(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col bg-neutral-950 text-neutral-100" style={{ height: '100dvh', overflow: 'hidden' }}>

      {/* ── Header ──────────────────────────────────────────── */}
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

      {/* ── Messages ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-black font-medium rounded-2xl rounded-br-sm'
                  : 'bg-neutral-800 text-neutral-100 rounded-2xl rounded-bl-sm'
              } ${msg.loading ? 'animate-pulse text-neutral-400' : ''}`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* ── Quote ready panel ────────────────────────────── */}
        {stage === 'quote_ready' && quoteReady && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[82%] w-full space-y-3">

              {/* Email send */}
              {emailSent ? (
                <div className="text-green-400 text-sm font-bold uppercase tracking-wider">
                  Sent! ✓
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(null) }}
                      onKeyDown={e => { if (e.key === 'Enter') handleEmailSend() }}
                      placeholder="Customer email"
                      disabled={quoteReady.pdfLoading}
                      className="flex-1 bg-neutral-700 text-neutral-100 px-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-40"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      onClick={handleEmailSend}
                      disabled={!email.trim() || sendingEmail || quoteReady.pdfLoading}
                      className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors whitespace-nowrap"
                    >
                      {sendingEmail
                        ? <><Spinner className="mr-1" />Sending…</>
                        : quoteReady.pdfLoading
                        ? <><Spinner className="mr-1" />Preparing…</>
                        : 'Send to Customer →'}
                    </button>
                  </div>
                  {emailError && <div className="text-red-400 text-xs">{emailError}</div>}
                </>
              )}

              {/* Subtle text links */}
              <div className="flex gap-4 pt-1">
                <button
                  onClick={startAnother}
                  className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-wider transition-colors"
                >
                  Start another job
                </button>
                <Link
                  href="/dashboard"
                  className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-wider transition-colors"
                >
                  Go to dashboard
                </Link>
              </div>

            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ────────────────────────────────────────── */}
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
            {sending ? <><Spinner className="mr-1" />Sending…</> : 'Send →'}
          </button>
        </div>
        <p className="text-neutral-600 text-xs mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}

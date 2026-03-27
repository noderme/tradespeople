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

// quote_prompt  → "Another job?" question
// quote_actions → action panel (view / send / download)
type Stage = 'chatting' | 'quote_prompt' | 'quote_actions'

const INACTIVITY_MS = 5 * 60 * 1000 // 5 minutes

const WELCOME = "Hey! Describe your first job and I'll generate a PDF quote in seconds."

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ChatInterface({ userId }: { userId: string }) {
  const threadId  = useRef(typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36)).current
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [messages,    setMessages]    = useState<Message[]>([{ role: 'bot', text: WELCOME }])
  const [input,       setInput]       = useState('')
  const [sending,     setSending]     = useState(false)
  const [stage,       setStage]       = useState<Stage>('chatting')
  const [quoteReady,  setQuoteReady]  = useState<QuoteReady | null>(null)

  // Action panel sub-states
  const [showEmail,   setShowEmail]   = useState(false)
  const [email,       setEmail]       = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailError,   setEmailError]   = useState<string | null>(null)
  const [emailSent,    setEmailSent]    = useState(false)
  const [timedOut,     setTimedOut]     = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stage])

  // ── Inactivity timer ──────────────────────────────────────────────────────

  function startInactivityTimer() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setTimedOut(true), INACTIVITY_MS)
  }

  function resetInactivityTimer() {
    if (timedOut) return
    startInactivityTimer()
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────

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

  // ── Send message ──────────────────────────────────────────────────────────

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
        addBotMessage("Your quote is ready!")
        const initial: QuoteReady = { quoteId: result.quoteId, pdfUrl: null, pdfLoading: true }
        setQuoteReady(initial)
        setStage('quote_prompt')
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

  // ── Step 1 actions ─────────────────────────────────────────────────────────

  function handleStartAnother() {
    // Quote is already saved — just reset the chat
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessages([{ role: 'bot', text: "Ready for the next one! Describe the job." }])
    setStage('chatting')
    setQuoteReady(null)
    setShowEmail(false)
    setEmail('')
    setSendingEmail(false)
    setEmailError(null)
    setEmailSent(false)
    setTimedOut(false)
    inputRef.current?.focus()
  }

  function handleDone() {
    setStage('quote_actions')
    startInactivityTimer()
  }

  // ── Step 2 actions ─────────────────────────────────────────────────────────

  function handleViewPdf() {
    if (quoteReady?.pdfUrl) {
      resetInactivityTimer()
      window.open(quoteReady.pdfUrl, '_blank')
    }
  }

  function handleDownload() {
    if (!quoteReady) return
    resetInactivityTimer()
    window.open(`/api/chat/pdf/${quoteReady.quoteId}`, '_blank')
  }

  function handleToggleEmail() {
    resetInactivityTimer()
    setShowEmail(v => !v)
  }

  async function handleEmailSend() {
    if (!quoteReady || !email.trim()) return
    resetInactivityTimer()
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

  // ── Render ────────────────────────────────────────────────────────────────

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

        {/* ── STEP 1: Another job? ─────────────────────────── */}
        {stage === 'quote_prompt' && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[82%] w-full space-y-3">
              <p className="text-sm text-neutral-200 font-medium">
                Quote saved! Do you have another job to quote?
              </p>
              <button
                onClick={handleStartAnother}
                className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-black font-bold uppercase tracking-wider text-sm transition-colors"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                Yes, start another →
              </button>
              <button
                onClick={handleDone}
                className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold uppercase tracking-wider text-sm transition-colors"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                No, I&apos;m done
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Action panel ─────────────────────────── */}
        {stage === 'quote_actions' && quoteReady && (
          <div className="flex justify-start">
            <div
              className={`bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[82%] w-full space-y-3 transition-opacity duration-700 ${timedOut ? 'opacity-0 pointer-events-none h-0 overflow-hidden p-0 m-0' : 'opacity-100'}`}
            >
              {/* View PDF */}
              <button
                onClick={handleViewPdf}
                disabled={quoteReady.pdfLoading || !quoteReady.pdfUrl}
                className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-50 text-black font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                {quoteReady.pdfLoading ? <><Spinner className="mr-2" />Preparing PDF…</> : '↗ View PDF'}
              </button>

              {/* Send to Customer */}
              <button
                onClick={handleToggleEmail}
                disabled={quoteReady.pdfLoading || !quoteReady.pdfUrl}
                className="w-full bg-neutral-900 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-600 text-neutral-200 font-bold uppercase tracking-wider text-sm transition-colors"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                ✉ Send to Customer
              </button>

              {/* Email input — expands inline */}
              {showEmail && (
                <div className="space-y-2">
                  {emailSent ? (
                    <div className="text-green-400 text-sm font-bold uppercase tracking-wider">
                      ✓ Email sent!
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setEmailError(null) }}
                        placeholder="Customer email"
                        className="flex-1 bg-neutral-700 text-neutral-100 px-3 py-2 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        style={{ fontSize: '16px' }}
                        autoFocus
                      />
                      <button
                        onClick={handleEmailSend}
                        disabled={!email.trim() || sendingEmail}
                        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black text-xs font-bold uppercase tracking-wider px-3 py-2 transition-colors whitespace-nowrap"
                      >
                        {sendingEmail ? <><Spinner className="mr-1" />Sending…</> : 'Send →'}
                      </button>
                    </div>
                  )}
                  {emailError && <div className="text-red-400 text-xs">{emailError}</div>}
                </div>
              )}

              {/* Download */}
              <button
                onClick={handleDownload}
                className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold uppercase tracking-wider text-sm transition-colors"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                ↓ Download
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Timed-out message ────────────────────── */}
        {stage === 'quote_actions' && timedOut && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-4 max-w-[82%] w-full space-y-3 animate-in fade-in duration-700">
              <p className="text-sm text-neutral-300 leading-relaxed">
                Quote saved to your dashboard.
              </p>
              <Link
                href="/dashboard"
                className="block w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-bold uppercase tracking-wider text-sm text-center transition-colors"
                style={{ minHeight: '44px', padding: '12px' }}
              >
                View it anytime → Dashboard
              </Link>
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

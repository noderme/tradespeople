'use client'

import { useEffect, useState } from 'react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'

export default function TestPaymentPage() {
  const [paddle,  setPaddle]  = useState<Paddle | undefined>()
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('success') === '1') {
      setSuccess(true)
      return
    }

    const token   = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
    const priceId = process.env.NEXT_PUBLIC_PADDLE_TEST_PRICE_ID

    console.log('Paddle token:', token ? `${token.slice(0, 8)}…` : 'MISSING')
    console.log('Paddle price ID:', priceId || 'MISSING')

    if (!token)   { setError('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set'); return }
    if (!priceId) { setError('NEXT_PUBLIC_PADDLE_TEST_PRICE_ID is not set'); return }

    initializePaddle({ environment: 'production', token })
      .then(p => { setPaddle(p); setReady(true) })
      .catch(err => setError(`Paddle init failed: ${err}`))
  }, [])

  function handlePay() {
    const priceId = process.env.NEXT_PUBLIC_PADDLE_TEST_PRICE_ID!
    console.log('Opening checkout with priceId:', priceId)
    try {
      paddle?.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/test-payment?success=1`,
        },
      })
    } catch (err) {
      setError(`Checkout failed: ${err}`)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-green-400 text-2xl font-bold uppercase tracking-widest">
          Payment successful!
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
      {error && (
        <div className="bg-red-950 border border-red-700 text-red-300 px-4 py-3 text-sm font-mono max-w-sm text-center">
          {error}
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={!ready}
        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold uppercase tracking-widest text-lg px-8 py-4 transition-colors"
      >
        {ready ? 'Pay $1' : 'Loading…'}
      </button>
      <div className="text-neutral-600 text-xs font-mono">
        paddle: {ready ? 'ready' : 'initialising…'}
      </div>
    </div>
  )
}

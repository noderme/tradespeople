'use client'

import { useEffect, useState } from 'react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'

export default function TestPaymentPage() {
  const [paddle,  setPaddle]  = useState<Paddle | undefined>()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('success') === '1') {
      setSuccess(true)
      return
    }
    initializePaddle({
      environment: 'production',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then(p => setPaddle(p))
  }, [])

  function handlePay() {
    paddle?.Checkout.open({
      items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_TEST_PRICE_ID!, quantity: 1 }],
      settings: {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/test-payment?success=1`,
      },
    })
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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <button
        onClick={handlePay}
        disabled={!paddle}
        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-black font-bold uppercase tracking-widest text-lg px-8 py-4 transition-colors"
      >
        Pay $1
      </button>
    </div>
  )
}

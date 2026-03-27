'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { uploadLogoAction, saveTradeTypeAction } from './actions'
import { Spinner } from '@/components/Spinner'

const TRADES = [
  { value: 'plumber', label: '🔧 Plumber' },
  { value: 'electrician', label: '⚡ Electrician' },
  { value: 'hvac', label: '❄️ HVAC' },
  { value: 'roofer', label: '🏠 Roofer' },
  { value: 'other', label: '🔨 Other' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleLogoStep(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData(e.currentTarget)
      await uploadLogoAction(fd)
      setStep(2)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleTradeStep() {
    if (!selectedTrade) return
    setLoading(true)
    setError(null)
    try {
      await saveTradeTypeAction(selectedTrade)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center justify-between">
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </span>
        <div className="flex gap-2">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`w-8 h-1 ${s <= step ? 'bg-orange-500' : 'bg-neutral-700'}`}
            />
          ))}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Logo */}
          {step === 1 && (
            <form onSubmit={handleLogoStep}>
              <div className="mb-10">
                <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Step 1 of 2</div>
                <h1 className="font-display font-bold text-4xl uppercase tracking-tight mb-2">
                  ADD YOUR<br />
                  <span className="text-orange-500">LOGO</span>
                </h1>
                <p className="text-neutral-400">Shows on every quote you send. Optional.</p>
              </div>

              <div
                className="border-2 border-dashed border-neutral-700 p-10 text-center cursor-pointer hover:border-neutral-500 transition-colors mb-6"
                onClick={() => fileRef.current?.click()}
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="Logo preview" className="max-h-24 mx-auto object-contain" />
                ) : (
                  <div>
                    <div className="text-4xl mb-3">📁</div>
                    <div className="text-neutral-400 text-sm">Click to upload PNG or JPG</div>
                    <div className="text-neutral-600 text-xs mt-1">Max 2MB</div>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) setLogoPreview(URL.createObjectURL(file))
                }}
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-500 text-black font-bold uppercase tracking-wider py-4 hover:bg-orange-400 transition-colors disabled:opacity-50"
                >
                  {loading ? <><Spinner />Uploading…</> : logoPreview ? 'Upload & Continue →' : 'Continue →'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-neutral-500 text-sm mt-3 hover:text-neutral-300 uppercase tracking-wider py-2"
              >
                Skip for now
              </button>
            </form>
          )}

          {/* Step 2: Trade type */}
          {step === 2 && (
            <div>
              <div className="mb-10">
                <div className="text-neutral-500 text-xs uppercase tracking-widest mb-2">Step 2 of 2</div>
                <h1 className="font-display font-bold text-4xl uppercase tracking-tight mb-2">
                  WHAT&apos;S YOUR<br />
                  <span className="text-orange-500">TRADE?</span>
                </h1>
                <p className="text-neutral-400">Helps us tailor your quoting experience.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-8">
                {TRADES.map(trade => (
                  <button
                    key={trade.value}
                    onClick={() => setSelectedTrade(trade.value)}
                    className={`px-6 py-4 text-left font-bold text-lg uppercase tracking-wide border-2 transition-colors ${
                      selectedTrade === trade.value
                        ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                        : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    {trade.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleTradeStep}
                disabled={!selectedTrade || loading}
                className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 text-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
              >
                {loading ? <><Spinner />Setting up…</> : 'Go to Dashboard →'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction, uploadLogoAction } from './actions'
import { Spinner } from '@/components/Spinner'
import type { Database } from '@/types/database'

type UserRow = Database['public']['Tables']['users']['Row']

const TRADES = [
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'hvac', label: 'HVAC' },
  { value: 'roofer', label: 'Roofer' },
  { value: 'other', label: 'Other' },
]

export function SettingsForm({ profile }: { profile: UserRow }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [logoSaving, setLogoSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_url)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    setLogoSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('logo', file)
      await uploadLogoAction(fd)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLogoSaving(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateProfileAction(new FormData(e.currentTarget))
      router.push('/settings?saved=1')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Logo */}
      <section className="bg-neutral-900 border border-neutral-800 p-6">
        <h2 className="font-bold uppercase tracking-widest text-xs text-neutral-500 mb-4">Business Logo</h2>
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 border border-neutral-700 flex items-center justify-center cursor-pointer hover:border-neutral-500 transition-colors overflow-hidden bg-neutral-800"
            onClick={() => fileRef.current?.click()}
          >
            {logoPreview
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              : <span className="text-neutral-600 text-2xl">+</span>
            }
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border border-neutral-600 text-neutral-300 text-xs font-bold uppercase tracking-wider px-4 py-2 hover:border-neutral-400 transition-colors"
            >
              {logoSaving ? <><Spinner className="mr-2" />Uploading…</> : 'Change Logo'}
            </button>
            <p className="text-neutral-600 text-xs mt-2">PNG or JPG, max 2MB</p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleLogoChange}
        />
      </section>

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-6">
        <section className="bg-neutral-900 border border-neutral-800 p-6 space-y-5">
          <h2 className="font-bold uppercase tracking-widest text-xs text-neutral-500">Business Details</h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Business Name
            </label>
            <input
              name="business_name"
              type="text"
              required
              defaultValue={profile.business_name}
              className="w-full px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Trade Type
            </label>
            <select
              name="trade_type"
              defaultValue={profile.trade_type ?? ''}
              className="w-full px-4 py-3"
            >
              {TRADES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Business Phone
            </label>
            <input
              name="business_phone"
              type="tel"
              defaultValue={profile.business_phone ?? ''}
              placeholder="e.g. 07911 123456"
              className="w-full px-4 py-3"
            />
            <p className="text-neutral-600 text-xs mt-1">Shown in PDF footer</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Business Email
            </label>
            <input
              name="business_email"
              type="email"
              defaultValue={profile.business_email ?? ''}
              placeholder="e.g. quotes@mybusiness.com"
              className="w-full px-4 py-3"
            />
            <p className="text-neutral-600 text-xs mt-1">Shown in PDF footer</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Default Tax Rate (%)
            </label>
            <input
              name="default_tax_rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              defaultValue={(profile.default_tax_rate * 100).toFixed(1)}
              className="w-full px-4 py-3"
            />
            <p className="text-neutral-600 text-xs mt-1">Applied to new quotes by default</p>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 text-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
        >
          {saving ? <><Spinner className="mr-2" />Saving…</> : 'Save Changes'}
        </button>
      </form>

      {/* WhatsApp Coming Soon */}
      <section className="bg-neutral-900 border border-neutral-800 p-6 space-y-4 opacity-60">
        <div className="flex items-center gap-3">
          <h2 className="font-bold uppercase tracking-widest text-xs text-neutral-500">WhatsApp Quoting</h2>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-neutral-600 text-neutral-500">
            Coming Soon
          </span>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            disabled
            placeholder="+447911123456"
            className="w-full px-4 py-3 cursor-not-allowed"
          />
          <p className="text-neutral-600 text-xs mt-1">
            Add your number to receive and create quotes directly via WhatsApp
          </p>
        </div>
        <button
          type="button"
          disabled
          className="w-full border border-neutral-700 text-neutral-600 font-bold uppercase tracking-wider py-3 cursor-not-allowed"
        >
          Save WhatsApp Number
        </button>
      </section>
    </div>
  )
}

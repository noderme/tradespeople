import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Footer } from '@/components/Footer'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { code?: string; token_hash?: string; type?: string; error?: string; error_description?: string }
}) {
  // Supabase sometimes redirects to Site URL root instead of /auth/callback — forward it
  if (searchParams.error || searchParams.error_description) {
    const msg = searchParams.error_description || searchParams.error || 'Authentication failed'
    redirect(`/login?error=${encodeURIComponent(msg)}`)
  }
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`)
  }
  if (searchParams.token_hash && searchParams.type) {
    redirect(`/auth/callback?token_hash=${searchParams.token_hash}&type=${searchParams.type}`)
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center justify-between">
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </span>
        <Link
          href="/login"
          className="text-neutral-400 hover:text-neutral-100 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-orange-500 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 mb-8">
            Built for the job site
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight leading-none mb-6">
            Send professional quotes<br />
            <span className="text-orange-500">in 60 seconds</span>
          </h1>

          <p className="text-neutral-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your job by text. Get a branded PDF quote instantly.
            Built for plumbers, electricians and HVAC techs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-orange-500 text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-orange-400 transition-colors text-lg"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/login"
              className="border border-neutral-600 text-neutral-300 font-bold uppercase tracking-wider px-8 py-4 hover:border-neutral-400 hover:text-neutral-50 transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>

          <p className="text-neutral-600 text-sm mt-6">7-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────── */}
      <div className="border-y border-neutral-800 px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">60s</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Quote time</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">PDF</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Branded output</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">0</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Paperwork</div>
          </div>
        </div>
      </div>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight text-center mb-16">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe your job',
                body: 'Type what you did — "replaced kitchen tap, 2 hours labour, new fittings". No forms, no templates.',
              },
              {
                step: '02',
                title: 'AI builds the quote',
                body: 'The AI extracts line items, calculates the total, and structures a professional quote in seconds.',
              },
              {
                step: '03',
                title: 'Send PDF to customer',
                body: 'Email a branded PDF directly from the app. Your customer sees your business name, logo, and total.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-neutral-900 border border-neutral-800 p-8">
                <div className="font-display font-bold text-5xl text-orange-500/30 mb-4">{step}</div>
                <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-3">{title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight text-center mb-4">
            Simple pricing
          </h2>
          <p className="text-neutral-500 text-center text-sm mb-16 uppercase tracking-widest">
            7-day free trial on every plan. No credit card required.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: 'Starter',
                price: 29,
                features: ['10 quotes/month', 'PDF generation', 'Email delivery', 'Custom branding'],
                highlight: false,
              },
              {
                label: 'Pro',
                price: 79,
                features: ['Unlimited quotes', 'PDF generation', 'Email delivery', 'Custom branding', 'Priority support'],
                highlight: true,
              },
              {
                label: 'Team',
                price: 149,
                features: ['Everything in Pro', 'Multiple users', 'Dedicated support'],
                highlight: false,
              },
            ].map(({ label, price, features, highlight }) => (
              <div
                key={label}
                className={`bg-neutral-900 border-2 p-8 flex flex-col ${highlight ? 'border-orange-500' : 'border-neutral-800'}`}
              >
                {highlight && (
                  <div className="bg-orange-500 text-black text-xs font-bold uppercase tracking-widest px-2 py-0.5 self-start mb-4">
                    Most Popular
                  </div>
                )}
                <div className="font-display font-bold text-2xl uppercase mb-1">{label}</div>
                <div className="mb-6">
                  <span className="font-display font-bold text-4xl text-orange-500">${price}</span>
                  <span className="text-neutral-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {features.map(f => (
                    <li key={f} className="text-neutral-400 text-sm flex items-start gap-2">
                      <span className="text-orange-500 font-bold mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center font-bold uppercase tracking-wider py-3 transition-colors text-sm ${
                    highlight
                      ? 'bg-orange-500 text-black hover:bg-orange-400'
                      : 'border border-neutral-600 text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  Start free 7-day trial →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

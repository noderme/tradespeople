import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'TradeQuote — AI Quote Generator for Plumbers, Electricians & HVAC Techs',
  description: 'Create and send professional PDF job quotes in 60 seconds. AI-powered quoting tool built for plumbers, electricians, HVAC techs, roofers, and gas engineers. Works in ChatGPT and Claude.',
  alternates: { canonical: 'https://www.quotejob.app/' },
  openGraph: {
    title: 'TradeQuote — AI Quote Generator for Tradespeople',
    description: 'Quote on-site. Get paid faster. Send professional PDF quotes in 60 seconds — built for plumbers, electricians, HVAC techs, roofers, and gas engineers.',
    url: 'https://www.quotejob.app/',
    type: 'website',
  },
}

export default async function HomePage() {
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
            AI quote generator for tradespeople
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase tracking-tight leading-none mb-6">
            Quote on-site.<br />
            <span className="text-orange-500">Get paid faster.</span>
          </h1>

          <p className="text-neutral-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe the job, get a professional PDF estimate in 60 seconds.
            Send it to your customer before you leave the driveway.
            Built for plumbers, electricians, HVAC techs, roofers, and gas engineers.
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

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              { label: '⚡ Quote in 60 seconds', cls: 'bg-orange-500 text-black' },
              { label: '📄 Branded PDF', cls: 'bg-blue-600 text-white' },
              { label: '⭐ Auto Google reviews', cls: 'bg-yellow-400 text-black' },
              { label: '💬 Works in ChatGPT', cls: 'bg-emerald-500 text-black' },
              { label: '0 paperwork', cls: 'bg-purple-600 text-white' },
            ].map(({ label, cls }) => (
              <span key={label} className={`${cls} text-xs font-bold uppercase tracking-wider px-4 py-2`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────── */}
      <div className="border-y border-neutral-800 px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">60s</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Quote time</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">PDF</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Branded estimate</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">AI</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">ChatGPT + Claude</div>
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
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight text-center mb-4">
            How it works
          </h2>
          <p className="text-neutral-500 text-center text-sm mb-16 uppercase tracking-widest">
            From job description to customer quote in under a minute
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe the job',
                body: 'Tell the AI what you did — "replaced boiler, 3 hours labour, parts included". Works in ChatGPT, Claude, or the web app. No forms.',
              },
              {
                step: '02',
                title: 'AI builds your estimate',
                body: 'Line items, labour, materials, tax — all structured into a professional trade quote. Your business name and logo on every PDF.',
              },
              {
                step: '03',
                title: 'Send. Get approved. Get paid.',
                body: 'Email the quote on the spot. A Google review request goes out automatically after every job — silent, no extra steps.',
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

      {/* ── Google Reviews callout ──────────────────────────────────── */}
      <section className="px-6 py-12 border-t border-neutral-800 bg-neutral-900">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="text-4xl shrink-0">⭐</div>
          <div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-2">
              Automatic Google review requests — zero effort
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every time you send a quote, a Google review request goes to your customer automatically.
              No reminder, no extra step, no dashboard to check. Silent and hands-free — reviews build up while you focus on the job.
            </p>
          </div>
        </div>
      </section>

      {/* ── Works where you work ────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-4">
            Works where you work
          </h2>
          <p className="text-neutral-500 text-sm mb-12 uppercase tracking-widest">
            Use it in the AI tools you already have open
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                title: 'ChatGPT',
                body: "Search 'Invoice & Quote Maker for Trades' on the ChatGPT store. Create quotes, send estimates, track jobs and get automatic Google review requests sent to your customers — all without leaving ChatGPT.",
              },
              {
                title: 'Web App',
                body: 'Full dashboard on any device. Manage your quotes, review customer history, and track sent estimates. Automatic Google review requests sent to customers after every job — silent, no effort needed.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="bg-neutral-900 border border-neutral-800 p-6 text-left">
                <div className="text-orange-500 font-display font-bold text-lg uppercase tracking-tight mb-2">{title}</div>
                <p className="text-neutral-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trades ──────────────────────────────────────────────────── */}
      <section className="px-6 py-16 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-neutral-600 text-xs uppercase tracking-widest mb-6">Built for every trade</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Plumbers', 'Electricians', 'HVAC Techs', 'Gas Engineers', 'Roofers', 'Builders', 'Carpenters', 'Tilers', 'Painters', 'Landscapers'].map(trade => (
              <span key={trade} className="border border-neutral-800 text-neutral-500 text-xs font-bold uppercase tracking-wider px-3 py-1.5">
                {trade}
              </span>
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
                features: ['10 quotes/month', 'Branded PDF estimates', 'Email delivery', 'ChatGPT & Claude', 'ChatGPT Store'],
                highlight: false,
              },
              {
                label: 'Pro',
                price: 79,
                features: ['Unlimited quotes', 'Branded PDF estimates', 'Email delivery', 'ChatGPT & Claude', 'ChatGPT Store', 'Custom branding', 'Google review requests', 'Priority support'],
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

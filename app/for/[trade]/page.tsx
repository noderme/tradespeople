import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TRADES, getTrade } from '@/lib/trades'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://www.quotejob.app'

interface Props {
  params: { trade: string }
}

export function generateStaticParams() {
  return TRADES.map(t => ({ trade: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trade = getTrade(params.trade)
  if (!trade) return {}

  const title = `${trade.headline} — Send Quotes in 60 Seconds`
  const description = `${trade.subheadline} 7-day free trial, no credit card required.`

  return {
    title,
    description,
    keywords: [`${trade.name.toLowerCase()} quoting software`, `${trade.name.toLowerCase()} quote app`, `${trade.name.toLowerCase()} estimate app`, 'trade quote generator', 'send quote from phone'],
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/for/${trade.slug}`,
      type: 'website',
    },
    alternates: { canonical: `${SITE_URL}/for/${trade.slug}` },
  }
}

export default function TradePage({ params }: Props) {
  const trade = getTrade(params.trade)
  if (!trade) notFound()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: trade.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: trade.plural, item: `${SITE_URL}/for/${trade.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <header className="border-b border-neutral-800 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </Link>
        <Link href="/login" className="text-neutral-400 hover:text-neutral-100 text-xs font-bold uppercase tracking-widest transition-colors">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-orange-500 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 mb-8">
            Built for {trade.plural}
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl uppercase tracking-tight leading-none mb-6">
            {trade.headline}
          </h1>
          <p className="text-neutral-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {trade.subheadline}
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

      {/* Job examples */}
      <section className="px-6 py-16 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-8 text-center">
            Quote any {trade.name.toLowerCase()} job in seconds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {trade.jobExamples.map(job => (
              <div key={job} className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-4 py-3">
                <span className="text-orange-500 font-bold">✓</span>
                <span className="text-neutral-300 text-sm">{job}</span>
              </div>
            ))}
          </div>

          {/* Quote example */}
          <div className="bg-neutral-900 border border-neutral-800 p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Example — what you type</div>
            <p className="text-neutral-300 text-sm italic leading-relaxed">&ldquo;{trade.quoteExample}&rdquo;</p>
            <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest">
              → TradeQuote turns this into a branded PDF quote in 60 seconds
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-10 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Describe the job', body: `Type what you did — no forms, no templates. Plain English works perfectly.` },
              { step: '02', title: 'AI builds the quote', body: 'Line items, labour, materials, tax — structured into a professional quote with your branding.' },
              { step: '03', title: 'Send on-site', body: 'Email the PDF to your customer before you leave. They approve it. You get paid.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-neutral-900 border border-neutral-800 p-6">
                <div className="font-display font-bold text-4xl text-orange-500/30 mb-3">{step}</div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works in ChatGPT and Claude */}
      <section className="px-6 py-16 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-4">
            Works in ChatGPT, Claude & WhatsApp
          </h2>
          <p className="text-neutral-400 text-sm mb-8 max-w-xl mx-auto">
            Use the TradeQuote GPT in ChatGPT, the skill in Claude, or the WhatsApp bot. Wherever you are, your quotes go out fast.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-orange-500 text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-orange-400 transition-colors text-sm"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 border-t border-neutral-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {trade.faqs.map(faq => (
              <div key={faq.q} className="border-b border-neutral-800 pb-6">
                <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-3">{faq.q}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 border-t border-neutral-800 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-4xl uppercase tracking-tight mb-4">
            Ready to quote faster?
          </h2>
          <p className="text-neutral-400 text-lg mb-8">
            Join {trade.plural.toLowerCase()} using TradeQuote to send professional quotes on-site in 60 seconds.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-orange-500 text-black font-bold uppercase tracking-wider px-10 py-4 hover:bg-orange-400 transition-colors text-lg"
          >
            Start Free Trial →
          </Link>
          <p className="text-neutral-600 text-sm mt-4">7-day free trial. No credit card required.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

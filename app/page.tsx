import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center">
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <div className="inline-block bg-orange-500 text-black text-xs font-bold uppercase tracking-widest px-3 py-1 mb-8">
            Built for the job site
          </div>

          <h1 className="font-display font-bold text-6xl md:text-8xl uppercase tracking-tight leading-none mb-6">
            QUOTE IN<br />
            <span className="text-orange-500">60 SECONDS</span>
          </h1>

          <p className="text-neutral-400 text-xl max-w-lg mx-auto mb-12">
            Send professional quotes straight from WhatsApp. No laptop, no faff.
            Your customer gets a branded PDF. You get paid faster.
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
      </div>

      <div className="border-t border-neutral-800 px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">60s</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Quote time</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">WhatsApp</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">No app needed</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl text-orange-500 mb-1">PDF</div>
            <div className="text-neutral-500 text-sm uppercase tracking-wider">Branded output</div>
          </div>
        </div>
      </div>
    </main>
  )
}

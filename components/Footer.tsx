import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 mt-16 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <span className="text-neutral-600 text-xs uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} TradeQuote
        </span>
        <div className="flex gap-6">
          <Link href="/terms"   className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-widest transition-colors">Terms</Link>
          <Link href="/privacy" className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-widest transition-colors">Privacy</Link>
          <Link href="/refund"  className="text-neutral-500 hover:text-neutral-300 text-xs uppercase tracking-widest transition-colors">Refunds</Link>
        </div>
      </div>
    </footer>
  )
}

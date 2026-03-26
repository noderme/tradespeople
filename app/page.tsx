import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">TradeQuote</h1>
      <p className="text-gray-500 text-lg max-w-md mb-8">
        Send professional quotes to customers in under 60 seconds — straight from WhatsApp.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Get started free
        </Link>
        <Link
          href="/login"
          className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </main>
  )
}

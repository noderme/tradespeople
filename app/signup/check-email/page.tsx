export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center">
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="font-display font-bold text-4xl uppercase tracking-tight mb-4">
            CHECK YOUR<br />
            <span className="text-orange-500">EMAIL</span>
          </h1>
          <p className="text-neutral-400 text-lg mb-4">
            We sent a magic link to your inbox. Click it to verify your account and continue setup.
          </p>
          <p className="text-neutral-600 text-sm">
            Didn&apos;t get it? Check your spam folder or{' '}
            <a href="/signup" className="text-orange-500 hover:text-orange-400">
              try again
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display font-bold text-4xl uppercase tracking-tight text-orange-500 mb-4">
          TRADEQUOTE
        </div>
        <p className="text-neutral-400 text-lg mb-2">You&apos;re offline</p>
        <p className="text-neutral-600 text-sm">Connect to the internet to create quotes.</p>
      </div>
    </div>
  )
}

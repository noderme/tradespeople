import { signUpAction } from './actions'
import { SubmitButton } from '@/components/SubmitButton'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center">
        <span className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="font-display font-bold text-5xl uppercase tracking-tight mb-2">
              START YOUR<br />
              <span className="text-orange-500">FREE TRIAL</span>
            </h1>
            <p className="text-neutral-400">7 days free. No credit card needed.</p>
          </div>

          {searchParams.error && (
            <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-6">
              {searchParams.error}
            </div>
          )}

          <form action={signUpAction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Full Name
              </label>
              <input
                name="full_name"
                type="text"
                required
                placeholder="John Smith"
                className="w-full px-4 py-3 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Business Name
              </label>
              <input
                name="business_name"
                type="text"
                required
                placeholder="Smith Plumbing Ltd"
                className="w-full px-4 py-3 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="john@smithplumbing.com"
                className="w-full px-4 py-3 text-base"
              />
            </div>

            <SubmitButton
              label="Create Account →"
              loadingLabel="Creating account…"
              className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 text-lg hover:bg-orange-400 transition-colors mt-2"
            />
          </form>

          <p className="text-neutral-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-orange-500 hover:text-orange-400">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

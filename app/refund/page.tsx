import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Refund Policy — TradeQuote' }

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-2">Refund Policy</h1>
        <p className="text-neutral-500 text-sm mb-8">Last updated: March 2026</p>

        <section className="space-y-6 text-neutral-300 text-sm leading-relaxed">

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">1. Free Trial</h2>
            <p>All new TradeQuote accounts start with a 7-day free trial. No credit card required. We encourage you to fully evaluate the service before subscribing. The trial gives you access to all features and up to 10 quotes.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">2. No Refunds After Payment</h2>
            <p>Because we offer a free trial before any charge is made, we do not provide refunds once a subscription payment has been processed. All sales are final. This applies to all plans (Starter, Pro, and Team).</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">3. Cancellation</h2>
            <p>You may cancel your subscription at any time from the billing portal (Settings → Billing → Manage / Cancel). When you cancel:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Your subscription will not renew at the next billing date.</li>
              <li>You retain full access to TradeQuote until the end of your current billing period.</li>
              <li>No partial refund is issued for the remaining days in the billing period.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">4. Exceptions</h2>
            <p>We may issue refunds at our sole discretion in exceptional circumstances — for example, if a technical error on our part resulted in a duplicate charge. To request an exception, contact us within 7 days of the charge at support@tradequotehq.com with your account email and a description of the issue.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">5. Failed Payments</h2>
            <p>If a payment fails, we will notify you by email. You have 7 days to update your payment details before your account is downgraded to the canceled state. No charge is made for a failed payment attempt.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">6. Contact</h2>
            <p>Questions about billing or this policy: support@tradequotehq.com.</p>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  )
}

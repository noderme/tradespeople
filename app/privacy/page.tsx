import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata = { title: 'Privacy Policy — TradeQuote' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-neutral-500 text-sm mb-8">Last updated: March 2026</p>

        <section className="space-y-6 text-neutral-300 text-sm leading-relaxed">

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">1. Who We Are</h2>
            <p>TradeQuote is an AI quoting service for tradespeople. This policy explains what personal data we collect, why we collect it, and how we handle it. By using TradeQuote you agree to the practices described here.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-neutral-200">Account data:</strong> name, email address, business name, trade type, WhatsApp number, business phone.</li>
              <li><strong className="text-neutral-200">Quote data:</strong> job descriptions, line items, prices, customer names, and any notes you enter.</li>
              <li><strong className="text-neutral-200">Usage data:</strong> conversation history with the AI assistant, quote session activity.</li>
              <li><strong className="text-neutral-200">Billing data:</strong> subscription status and plan. Full payment details are handled by Paddle and never stored on our servers.</li>
              <li><strong className="text-neutral-200">Technical data:</strong> IP address, browser type, and device information collected automatically when you use the service.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide, maintain, and improve the TradeQuote service.</li>
              <li>To generate PDF quotes and send them to your customers on your behalf.</li>
              <li>To manage your subscription and process billing via Paddle.</li>
              <li>To send transactional emails (magic link login, quote delivery, payment notifications).</li>
              <li>To enforce plan limits and prevent abuse.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">4. Data Sharing</h2>
            <p>We do not sell your personal data to third parties. We share data only with the following service providers who help us operate the service:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-neutral-200">Supabase</strong> — database and file storage (EU region).</li>
              <li><strong className="text-neutral-200">Anthropic</strong> — AI model provider. Conversation messages are sent to Claude for processing. Anthropic&apos;s data retention policies apply.</li>
              <li><strong className="text-neutral-200">Paddle</strong> — payment processing. Billing data is governed by Paddle&apos;s privacy policy.</li>
              <li><strong className="text-neutral-200">Resend</strong> — transactional email delivery.</li>
              <li><strong className="text-neutral-200">Twilio</strong> — WhatsApp message delivery.</li>
              <li><strong className="text-neutral-200">Vercel</strong> — application hosting.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">5. Data Retention</h2>
            <p>We retain your account and quote data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">6. Your Rights (GDPR &amp; CCPA)</h2>
            <p>Depending on your location you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-neutral-200">Access:</strong> request a copy of the data we hold about you.</li>
              <li><strong className="text-neutral-200">Correction:</strong> ask us to correct inaccurate data.</li>
              <li><strong className="text-neutral-200">Deletion:</strong> request that we delete your data.</li>
              <li><strong className="text-neutral-200">Portability:</strong> receive your data in a machine-readable format.</li>
              <li><strong className="text-neutral-200">Opt-out (CCPA):</strong> California residents may opt out of the sale of personal information. We do not sell personal information.</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, email us at support@tradequotehq.com.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">7. Security</h2>
            <p>We use industry-standard security measures including encrypted connections (HTTPS), row-level security on our database, and token-based authentication. No system is completely secure; if you suspect unauthorised access to your account, contact us immediately.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">8. Cookies</h2>
            <p>We use only essential cookies required to maintain your login session. We do not use advertising or tracking cookies.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you by email before material changes take effect. The current version is always available at tradequotehq.com/privacy.</p>
          </div>

          <div>
            <h2 className="text-neutral-100 font-bold text-lg uppercase tracking-wide mb-2">10. Contact</h2>
            <p>For privacy-related questions or requests: support@tradequotehq.com.</p>
          </div>

        </section>
      </main>
      <Footer />
    </div>
  )
}

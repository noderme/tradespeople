import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import { Suspense } from 'react'
import { NavigationProgress } from '@/components/NavigationProgress'
import './globals.css'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow-condensed',
})

const SITE_URL = 'https://www.quotejob.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TradeQuote — AI Quote Generator for Tradespeople',
    template: '%s | TradeQuote',
  },
  description: 'Create and send professional PDF job quotes in 60 seconds. AI-powered quoting tool built for plumbers, electricians, HVAC techs, roofers, and gas engineers.',
  keywords: ['trade quote app', 'quoting software for tradespeople', 'plumber quote app', 'electrician quoting software', 'HVAC estimate app', 'job quote generator', 'send quote from phone', 'trade invoice app', 'AI quote builder'],
  authors: [{ name: 'TradeQuote', url: SITE_URL }],
  creator: 'TradeQuote',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'TradeQuote',
    title: 'TradeQuote — AI Quote Generator for Tradespeople',
    description: 'Create and send professional PDF job quotes in 60 seconds. Built for plumbers, electricians, HVAC techs, roofers, and gas engineers.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TradeQuote — AI Quote Generator for Tradespeople' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeQuote — AI Quote Generator for Tradespeople',
    description: 'Create and send professional PDF job quotes in 60 seconds.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'TradeQuote',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="TradeQuote" />
        <link rel="icon" href="/icon-192.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png?v=2" />
      </head>
      <body className={`${barlow.variable} ${barlowCondensed.variable} font-sans antialiased bg-neutral-950 text-neutral-50`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'TradeQuote',
              url: SITE_URL,
              description: 'AI-powered job quoting tool for tradespeople. Create and send professional PDF quotes in 60 seconds via ChatGPT, Claude, or the web app.',
              applicationCategory: 'BusinessApplication',
              applicationSubCategory: 'Quoting Software',
              operatingSystem: 'Web',
              offers: { '@type': 'Offer', price: '29', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
              featureList: ['AI quote generation', 'Branded PDF output', 'Email delivery', 'ChatGPT integration', 'Claude integration', 'WhatsApp bot', 'Google review requests'],
              author: { '@type': 'Organization', name: 'TradeQuote', url: SITE_URL },
              inLanguage: 'en-US',
              audience: { '@type': 'BusinessAudience', audienceType: 'Plumbers, Electricians, HVAC Technicians, Roofers, Gas Engineers, Builders' },
            }),
          }}
        />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog — Trade Quoting Tips, Guides & Resources',
  description: 'Practical guides for plumbers, electricians, HVAC techs, and roofers on quoting jobs, getting paid faster, and running a more efficient trade business.',
  openGraph: {
    title: 'TradeQuote Blog — Trade Quoting Tips & Guides',
    description: 'Practical guides for tradespeople on quoting jobs professionally and getting paid faster.',
    url: 'https://www.quotejob.app/blog',
    type: 'website',
  },
  alternates: { canonical: 'https://www.quotejob.app/blog' },
}

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <header className="border-b border-neutral-800 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </Link>
        <Link href="/login" className="text-neutral-400 hover:text-neutral-100 text-xs font-bold uppercase tracking-widest transition-colors">
          Sign In
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Resources</div>
          <h1 className="font-display font-bold text-4xl uppercase tracking-tight mb-4">Blog</h1>
          <p className="text-neutral-400 text-lg">
            Practical guides for plumbers, electricians, HVAC techs, roofers, and gas engineers on quoting jobs and getting paid faster.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-neutral-900 border border-neutral-800 p-6 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-neutral-600">·</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">{post.readTime} read</span>
                </div>
                <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-2 group-hover:text-orange-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed">{post.metaDescription}</p>
                <div className="mt-4 text-orange-500 text-xs font-bold uppercase tracking-widest">
                  Read more →
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

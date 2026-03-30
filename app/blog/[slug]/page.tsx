import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getBlogPost } from '@/lib/blog'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://www.quotejob.app'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['TradeQuote'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'TradeQuote', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'TradeQuote',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-192.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    inLanguage: 'en-GB',
  }

  const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="border-b border-neutral-800 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-widest uppercase text-orange-500">
          TRADEQUOTE
        </Link>
        <Link href="/login" className="text-neutral-400 hover:text-neutral-100 text-xs font-bold uppercase tracking-widest transition-colors">
          Sign In
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-orange-400 transition-colors">Blog</Link>
          <span>›</span>
          <span className="text-neutral-600 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">
              {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-xs text-neutral-600">·</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest">{post.readTime} read</span>
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Article content */}
        <div
          className="prose prose-invert prose-neutral max-w-none
            prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-4
            prose-li:text-neutral-300 prose-li:mb-1
            prose-strong:text-neutral-100
            prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
            prose-ul:my-4 prose-ol:my-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="bg-neutral-900 border border-orange-500/30 p-8 mt-14 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Get Started Free</div>
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-3">
            Quote jobs in 60 seconds
          </h2>
          <p className="text-neutral-400 text-sm mb-6">
            No paperwork. No templates. Just describe the job and send a branded PDF quote to your customer — from ChatGPT, Claude, or the web app.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-orange-500 text-black font-bold uppercase tracking-wider px-8 py-3 hover:bg-orange-400 transition-colors text-sm"
          >
            Start Free Trial →
          </Link>
          <p className="text-neutral-600 text-xs mt-3">7-day free trial. No credit card required.</p>
        </div>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <div className="mt-14">
            <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-6 text-neutral-400">
              More guides
            </h3>
            <div className="space-y-4">
              {otherPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                  <div className="border border-neutral-800 p-4 hover:border-orange-500/40 transition-colors">
                    <div className="font-display font-bold text-sm uppercase tracking-tight group-hover:text-orange-400 transition-colors">
                      {p.title}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">{p.readTime} read</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

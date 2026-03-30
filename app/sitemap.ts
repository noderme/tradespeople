import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog'
import { TRADES } from '@/lib/trades'

const SITE_URL = 'https://www.quotejob.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split('T')[0]

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: today, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/signup`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: today, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: today, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const tradePages: MetadataRoute.Sitemap = TRADES.map(trade => ({
    url: `${SITE_URL}/for/${trade.slug}`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages, ...tradePages]
}

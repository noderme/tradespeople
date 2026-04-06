import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.quotejob.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/settings/', '/billing/', '/api/', '/chat/', '/quotes/', '/onboarding/', '/_next/static/', '/_next/image/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

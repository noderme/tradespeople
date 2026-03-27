const CACHE = 'tradequote-v1'

// Assets to cache on install
const PRECACHE = [
  '/',
  '/chat',
  '/offline',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Never intercept API calls or Supabase — always go to network
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('twilio') ||
    request.method !== 'GET'
  ) {
    return
  }

  // Network-first for navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/offline') ?? caches.match('/')
      )
    )
    return
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then(cached => cached ?? fetch(request))
  )
})

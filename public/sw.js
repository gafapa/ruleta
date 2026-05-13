const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, '')
const toScopePath = (path) => `${SCOPE_PATH}${path}`
const CACHE_PREFIX = `ruleta:${SCOPE_PATH || '/'}:`
const CACHE_NAME = `${CACHE_PREFIX}v3`
const APP_SHELL = [
  toScopePath('/'),
  toScopePath('/manifest.webmanifest'),
  toScopePath('/favicon.svg'),
  toScopePath('/apple-touch-icon.svg'),
  toScopePath('/pwa-192x192.svg'),
  toScopePath('/pwa-512x512.svg'),
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response.ok) return response
        const copy = response.clone()
        const url = new URL(request.url)
        if (url.origin === self.location.origin && url.pathname.startsWith(`${SCOPE_PATH}/`)) {
          void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
      .catch(async () => {
        const cached = await caches.match(request)
        if (cached) return cached

        if (request.mode === 'navigate') {
          return caches.match(toScopePath('/'))
        }

        throw new Error('Network error and no cached response available.')
      }),
  )
})

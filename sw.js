// sw.js

const CACHE_NAME = 'tr-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/data/sentences.json',
  '/data/glossary.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Install: precache assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first with network update
self.addEventListener('fetch', (e) => {
  const { request } = e;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Only handle same-origin requests
  if (!request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(request)
      .then(cached => {
        // Return cached response immediately
        if (cached) {
          // Update cache in background
          fetch(request)
            .then(response => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then(cache => cache.put(request, response));
              }
            })
            .catch(() => {}); // Fail silently

          return cached;
        }

        // Fetch from network and cache
        return fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
            }
            return response;
          });
      })
      .catch(() => {
        // Navigation fallback
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

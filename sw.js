const CACHE = 'whalems-business-manager-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for navigations (so a fresh deploy is picked up when online),
// falling back to the cached app shell when offline. Cache-first for everything else.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        caches.open(CACHE).then((cache) => cache.put('./index.html', res.clone()));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      // Only cache same-origin app-shell assets; leave CDN/OCR requests to the network.
      if (req.url.startsWith(self.location.origin)) {
        caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
      }
      return res;
    }).catch(() => cached))
  );
});

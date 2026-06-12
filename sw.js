const CACHE = 'cv-2026-06b';
const ASSETS = ['./cieloverde.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Nunca cachear — siempre ir a la red
  e.respondWith(
    fetch(e.request, {cache: 'reload'})
      .catch(() => caches.match(e.request))
  );
});

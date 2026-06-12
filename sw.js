const CACHE = 'cv-2026-06';
const ASSETS = ['./cieloverde.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Activar inmediatamente sin esperar
});

self.addEventListener('activate', e => {
  // Borrar todos los cachés viejos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => {
        console.log('Borrando caché viejo:', k);
        return caches.delete(k);
      }))
    )
  );
  self.clients.claim(); // Tomar control inmediato de todas las pestañas
});

self.addEventListener('fetch', e => {
  // Network-first: siempre intentar red, caché solo si sin conexión
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'}) // no-cache fuerza verificar servidor
      .then(res => {
        if(res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Notificar a la app cuando hay una nueva versión disponible
self.addEventListener('message', e => {
  if(e.data === 'skipWaiting') self.skipWaiting();
});

/* Orée — service worker (lot 1)
   Stratégie : réseau d'abord, cache en secours, pour que les mises à jour
   arrivent vite et que l'app s'ouvre quand même sans connexion.
   Pour forcer une mise à jour du cache, change le numéro de version ci-dessous. */

const CACHE = 'oree-v2';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'supabase.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // On ne touche jamais aux appels vers d'autres sites (Supabase, etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || caches.match('index.html'))
      )
  );
});

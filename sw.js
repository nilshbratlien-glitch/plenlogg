/* Plenlogg service worker — offline shell + installability.
   Bump CACHE when you deploy a new version of the app. */
const CACHE = 'plenlogg-v2';
const SHELL = ['./', './index.html', './icon-192.png', './icon-512.png', './manifest.webmanifest'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never cache the sync API — a stale backup response would be worse than none.
  if (url.pathname.startsWith('/api/')) return;
  // Same-origin: network-first, fall back to cache (so updates land but offline works).
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  }
  // Cross-origin (Google Fonts): cache-first so the app styles offline.
  else {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(()=>hit))
    );
  }
});

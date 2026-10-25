const CACHE = 'eigo-v5e2f8acc';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
// Network first so content updates arrive; fall back to the cache when offline.
// The page itself skips the browser's HTTP cache (GitHub Pages lets it keep pages for 10 minutes), so an update shows on the next launch.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const fresh = e.request.mode === 'navigate' ? { cache: 'no-cache' } : undefined;
  e.respondWith(fetch(e.request, fresh).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});

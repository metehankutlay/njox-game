const CACHE = 'njox-v7';
const ASSETS = ['./game.html', './index.html', './manifest.json', './icon.png', './splash-icon.png', './kule.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Network-first: önce sunucudan çek, başarısız olursa cache'den göster
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      if(res.ok) {
        const c = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, c));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});

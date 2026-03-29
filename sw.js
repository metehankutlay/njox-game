// Service worker'ı kaldır ve tüm cache'leri temizle
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll()).then(clients => {
        clients.forEach(c => c.postMessage({type:'SW_CLEARED'}));
      })
  );
});
// Fetch'i intercept etme — direkt network'e gönder
self.addEventListener('fetch', () => {});

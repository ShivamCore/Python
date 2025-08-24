// Service Worker for Enterprise AI Dashboard
const CACHE_NAME = 'ai-dashboard-v2.0';
const urlsToCache = [
  '/',
  '/static/css/style.css',
  '/static/js/app.js',
  '/api/models/info'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 
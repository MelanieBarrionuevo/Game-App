const CACHE_NAME = 'game-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/audio/car.mp3',
  '/audio/plane.mp3',
  '/audio/boat.mp3',
  '/audio/grab.mp3',
  '/audio/paste.mp3',
  '/audio/brush.mp3',
  '/audio/water.mp3',
  '/audio/soap.mp3',
  '/audio/rub.mp3',
  '/audio/dry.mp3',
  '/audio/success.mp3',
  '/images/vehicles/road.svg',
  '/images/vehicles/sky.svg',
  '/images/vehicles/sea.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Cache addAll error:', err);
        // No falles si algunos archivos no están disponibles
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Cache First
self.addEventListener('fetch', (event) => {
  // No cachear requests POST
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver del cache si existe
      if (response) {
        return response;
      }

      // Si no está en cache, intentar red
      return fetch(event.request)
        .then((response) => {
          // No cachear si la respuesta no es válida
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clonar y cachear
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Si la red falla, intentar del cache
          return caches.match(event.request);
        });
    })
  );
});

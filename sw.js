var cacheName = 'EX-WebThrottle'+version;
var filesToCache = [
  'images/favicon.ico',
  'images/carbon_fibre.png',
  'images/cover.png',
  'images/darkmkBigBackground.png',
  'images/darkmkBigFront.png',
  'images/lightBigBackground.png',
  'images/lightBigBackground@2x.png',
  'images/lightBigFront.png',
  'images/lightBigFront@2x.png',
  'images/pattern.png',
  'css/jquery.rotaryswitch.css',
  'css/pwa.css',
  'css/roundslider.min.css',
  'css/fonts/icomoon.eot',
  'css/fonts/icomoon.svg',
  'css/fonts/icomoon.ttf',
  'css/fonts/icomoon.woff',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installing');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
  console.log('[ServiceWorker] Install Complete');
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});


var cacheName = 'WebThrottle-EX';
var filesToCache = [
  'images/favicon.ico',
  'images/carbon_fibre.png',
  'images/cover.png',
  'images/darkmkBigBackground.png',
  'images/darkmkBigFront.png',
  'images/full-logo.png',
  'images/lightBigBackground.png',
  'images/lightBigBackground@2x.png',
  'images/lightBigFront.png',
  'images/lightBigFront@2x.png',
  'images/pattern.png',
  'images/WebThrottle.png',
  'css/icons.css',
  'css/jquery-ui.css',
  'css/jquery.rotaryswitch.css',
  'css/pwa.css',
  'css/roundslider.min.css',
  'css/settings.css',
  'css/fonts/icomoon.eot',
  'css/fonts/icomoon.svg',
  'css/fonts/icomoon.ttf',
  'css/fonts/icomoon.woff',
  'css/themes/dark.css',
  'css/themes/metallic.css',
  'js/jquery-3.2.1.min.js',
  'js/jquery-ui.min.js',
  'js/jquery.rotaryswitch.js',
  'js/pwa.js',
  'js/roundslider.min.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      // cache.delete('index.html');
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
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


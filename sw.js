var cacheName = 'WebThrottle-EX';
var filesToCache = [
  '/WebThrottle-EX/',
  'index.html',
  'images/favicon.ico',
  'images/carbon_fibre.png',
  'images/cover.jpg',
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
  'css/layout.css',
  'css/pwa.css',
  'css/roundslider.min.css',
  'css/settings.css',
  'css/throttle.css',
  'css/fonts/icomoon.eot',
  'css/fonts/icomoon.svg',
  'css/fonts/icomoon.ttf',
  'css/fonts/icomoon.woff',
  'css/themes/dark.css',
  'css/themes/metallic.css',
  'js/addloco.js',
  'js/commandController.js',
  'js/emulator.js',
  'js/exwebthrottle.js',
  'js/fnMaster.js',
  'js/jquery-3.2.1.min.js',
  'js/jquery-ui.min.js',
  'js/jquery.rotaryswitch.js',
  'js/pwa.js',
  'js/roundslider.min.js',
  'js/storageController.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
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


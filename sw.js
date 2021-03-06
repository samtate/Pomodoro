self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('pomodoro').then(function(cache) {
     return cache.addAll([
       '/index.html',
       '/styles/main.css',
       '/scripts/main.js',
       '/img/close.png',
       '/font/DS.TTF'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});

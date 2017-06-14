
console.log(self.registration.installing);

self.addEventListener('install', function(event) {
  console.log('install event is fired');

  event.waitUntil(
    // remove old caches
    caches.delete('sw-storage').then(function(){
      return caches.open('sw-storage').then(function(cache) {
        return cache.addAll([
          './',
          'script.js',
          'image.jpg',
          'style.css',
        ]);
      })
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('activate event is fired');
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    // hijack fetch request
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    // if not matched, fetch from network
    }).catch(function() {
      return fetch(event.request);
    })
  );
});

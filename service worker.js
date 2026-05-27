const CACHE_NAME = "baloTV";

const urlsToCache = [

  "/",
  "/index.html",
  "/library.html",
  "/blog.html",
  "/styles.css",
  "/blog.css",
  "/library.css",
  "/app.js"

];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)

    .then(cache => {

      return cache.addAll(urlsToCache);

    })

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)

    .then(response => {

      return response || fetch(event.request);

    })

  );

});
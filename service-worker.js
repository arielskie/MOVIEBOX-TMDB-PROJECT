self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("moviebox-cache").then(cache => {
      return cache.addAll([
        "/",
        "/offline.html"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match("/offline.html"))
  );
});

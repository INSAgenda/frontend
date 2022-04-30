self.addEventListener('install', function(event) {
    console.log("Service worker installed");
});
  
self.addEventListener('fetch', function(event) {
    //console.debug('The service worker is serving the ressource...');

    if (event.request.url.includes("/api/")) {
        return;
    }

    event.respondWith(caches.match(event.request).then(function(response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request);
        }
    }));

    event.waitUntil(
        update(event.request).then(/*console.debug("...and the ressource has been updated.")*/)
    );
});

function update(request) {
    return caches.open("v1").then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
}

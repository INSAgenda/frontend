self.addEventListener('install', function(event) {
    console.log("Service worker installed");
});
  
self.addEventListener('fetch', function(event) {
    console.debug('The service worker is serving the ressource...');

    event.respondWith(caches.match(event.request).then(function(response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                    // We don't want to cache api responses
                    if (event.request.url.contains("/api/")) {
                        return response;
                    }

                    // response may be used only once
                    // we need to save clone to put one copy in cache
                    // and serve second one
                    let responseClone = response.clone();
                    
                    caches.open('v1').then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                    
                    return response;
                });
        }
    }));

    event.waitUntil(
        update(event.request).then(console.debug("...and the ressource has been updated."))
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

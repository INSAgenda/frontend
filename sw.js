self.addEventListener('install', function(event) {
    console.log("Service worker installed");
});
  
self.addEventListener('fetch', function(event) {
    let request = event.request;

    if (request.url.includes("/api/") || request.url.includes("zebi")) {
        return;
    }

    // All these paths are handled by the same app, and we serve the same index.html file on them
    let url = new URL(request.url);
    if (request.destination == "document" && (request. url.pathname == "/settings" || url.pathname == "/settings.html" || url.pathname == "/settings/"
        || url.pathname == "/change-password" || url.pathname == "/change-password.html" || url.pathname == "/change-password/"
        || url.pathname == "/change-email" || url.pathname == "/change-email.html" || url.pathname == "/change-email/"
        || url.pathname == "/change-group" || url.pathname == "/change-group.html" || url.pathname == "/change-group/"
        || url.pathname == "/agenda" || url.pathname == "/agenda.html" || url.pathname == "/agenda/"
        || url.pathname.startsWith("/survey/"))) {

        request = new Request("/agenda", {
            body: request.body,
            cache: request.cache,
            destination: request.destination,
            headers: request.headers,
            method: request.method,
            priority: request.priority,
            redirect: request.redirect,
            url: new URL("/agenda", url.origin),
        });
    }

    event.respondWith(caches.match(request).then(function(response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(request);
        }
    }));

    event.waitUntil(update(request));
});

function update(request) {
    caches.open("v1").then(function (cache) {
        fetch(request).then(function (response) {
            if (response.status == 200) {
                cache.put(request, response);
            }
        });
    });
}

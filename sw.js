self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", async (event) => {
    if (event.request.method !== "GET" ||
            (event.request.mode !== "navigate" &&
                event.request.destination !== "script")) {
        return; // cache only index page and scripts
    }

    event.respondWith((async () => {
        let response;
        let responseError;

        try {
            response = await fetch(event.request);
        } catch (e) {
            responseError = e;
        }

        if (response) {
            (await caches.open("demo")).put(event.request, response.clone());
            return response;
        }

        response = await caches.match(event.request);
        if (response) {
            console.log("loaded from SW cache", event.request.url);
            return response;
        } else {
            throw responseError;
        }
    })());
});

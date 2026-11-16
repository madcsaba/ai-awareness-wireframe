/* EcoAI service worker – offline app shell
 *
 * Frissítés: az új verzió NEM aktiválódik azonnal. Az `install` csak
 * letölti az új shellt, a `skipWaiting` pedig a felhasználó kérésére indul
 * el (a "Frissítés" gomb üzenete). Így a telepített app nem vált
 * verziót a felhasználó észrevehetetlenül – és nem is veszíti el a
 * beszélgetését.
 *
 * Cache-stratégia:
 *   – navigációk és a kód (index.html, app.js, app.css): hálózat-először,
 *     offline a cache-ből. Így a felhasználó MINDIG a legfrissebb appot
 *     kapja – a gyorsítótárazás csak az offline működést szolgálja ki.
 *   – statikus assetek (képek, betűtípusok, ikonok): cache-first,
 *     stale-while-revalidate – ezek ritkán változnak, és gyorsan kell
 *     betöltődniük.
 */
var CACHE = "ecoai-v6";
var SHELL = ["./", "index.html", "app.css", "app.js", "manifest.webmanifest",
  "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "fonts/inter-latin-wght-normal.woff2", "fonts/inter-latin-ext-wght-normal.woff2"];

// Ezek mindig frissek legyenek a hálózatról (a kód és a HTML).
function mindigFriss(url) {
  return url.pathname.endsWith("/app.js") ||
         url.pathname.endsWith("/app.css") ||
         url.pathname.endsWith("/index.html") ||
         url.pathname.endsWith("/");
}

self.addEventListener("install", function (e) {
  // Nincs skipWaiting: az új verzió megvárja, hogy a felhasználó rákattintson
  // a "Frissítés" gombra.
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// A felhasználó jóváhagyta a frissítést → aktiváljuk az új verziót.
self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  var url = new URL(e.request.url);
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok) c.put(e.request, res.clone());
        return res;
      }).catch(function () {
        // offline: a gyorsítótárazott shellt adjuk vissza
        return hit || (e.request.mode === "navigate" ? c.match("index.html") : undefined);
      });
      // a kód és a navigáció: hálózat-először (friss app), offline a cache
      if (mindigFriss(url) || e.request.mode === "navigate") return net;
      return hit || net;
    });
  }));
});

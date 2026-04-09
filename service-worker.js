// Futuro Musica — Service Worker
// Versione: aggiorna questo numero ad ogni deploy per forzare il refresh della cache
const CACHE_VERSION = 'fm-v1';
const CACHE_STATIC = [
  '/FM-webapp/webapp.html',
  '/FM-webapp/app.js',
  '/FM-webapp/fm_sync.js',
  '/FM-webapp/supabase_integration.js',
  '/FM-webapp/manifest.json',
];

// ── Install: pre-carica le risorse statiche ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CACHE_STATIC);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: rimuove cache vecchie ─────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first per API Supabase, cache-first per statici ───────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase API e WhatsApp Graph API → sempre network (dati live)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('graph.facebook.com') ||
    url.hostname.includes('anthropic.com')
  ) {
    return; // lascia passare senza intercettare
  }

  // Risorse statiche → cache-first con fallback network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Salva in cache solo le risposte valide
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/FM-webapp/webapp.html');
        }
      });
    })
  );
});

// ── Push Notifications (per futura integrazione WhatsApp inbox) ──────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Futuro Musica';
  const options = {
    body:    data.body || 'Hai una nuova notifica',
    icon:    '/FM-webapp/icons/icon-192.png',
    badge:   '/FM-webapp/icons/icon-192.png',
    tag:     data.tag || 'fm-notification',
    data:    { url: data.url || '/FM-webapp/webapp.html' },
    vibrate: [200, 100, 200],
    requireInteraction: data.requireInteraction || false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Click su notifica push → apre l'app ─────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/FM-webapp/webapp.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('FM-webapp') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

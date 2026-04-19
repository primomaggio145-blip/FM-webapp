// Futuro Musica — Service Worker v5
// STRATEGIA CACHE:
//   - app.js, fm_sync.js, supabase_integration.js → NETWORK-FIRST (sempre freschi)
//   - webapp.html, manifest.json, icone          → NETWORK-FIRST con fallback cache
//   - API Supabase                               → solo network, mai cache
const CACHE_VERSION = 'fm-v5';

// File pre-cachati all'install (solo per fallback offline)
const CACHE_STATIC = [
  '/FM-webapp/webapp.html',
  '/FM-webapp/manifest.json',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CACHE_STATIC))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: rimuove cache vecchie e notifica l'app dell'aggiornamento ───────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Notifica tutte le tab aperte che c'è una nuova versione
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
          });
        });
      })
  );
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1) API esterne → solo network, non intercettare
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('graph.facebook.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('googleapis.com')
  ) {
    return;
  }

  // 2) File JS/CSS → NETWORK-FIRST (aggiornamento immediato)
  //    Cache usata solo se network fallisce (offline)
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          // Aggiorna la cache con la versione fresca
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3) HTML e altri statici → network-first con fallback cache
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.destination === 'document') {
            return caches.match('/FM-webapp/webapp.html');
          }
        });
      })
  );
});

// ── Push: riceve le notifiche dal server ─────────────────────────────────────
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { title: 'Futuro Musica', body: event.data?.text() || '' }; }

  const title   = data.title || 'Futuro Musica';
  const options = {
    body:               data.body || 'Hai una nuova notifica',
    icon:               '/FM-webapp/icons/icon-192.png',
    badge:              '/FM-webapp/icons/icon-192.png',
    tag:                data.tag  || 'fm-notification',
    data:               { url: data.url || '/FM-webapp/webapp.html' },
    vibrate:            [200, 100, 200],
    requireInteraction: false,
    actions:            [{ action: 'open', title: '📅 Apri app' }],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Click sulla notifica → apre/porta in primo piano l'app ───────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/FM-webapp/webapp.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('FM-webapp') && 'focus' in client) return client.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});

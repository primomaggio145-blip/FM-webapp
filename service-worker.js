// Futuro Musica — Service Worker v6
// STRATEGIA CACHE:
//   - app.js, fm_sync.js, supabase_integration.js → NETWORK-FIRST (sempre freschi)
//   - webapp.html, manifest.json, icone          → NETWORK-FIRST con fallback cache
//   - API Supabase, font Google (googleapis/gstatic) → solo network, mai cache
const CACHE_VERSION = 'fm-v9'; // v9: percorsi corretti per dominio personalizzato (era /FM-webapp/...)

// File pre-cachati all'install (solo per fallback offline)
const CACHE_STATIC = [
  '/webapp.html',
  '/manifest.json',
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

  // 1) API esterne e font Google → solo network, non intercettare
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('graph.facebook.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
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
          // Salva in cache solo le versioni SENZA cache-busting (?v=...): quelle
          // versionate sono uniche ad ogni caricamento pagina e non verrebbero mai
          // ritrovate in cache — salvarle farebbe solo crescere lo storage a vuoto.
          if (response && response.status === 200 && !url.search) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
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
            return caches.match('/webapp.html');
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

  // Base reale dell'app (es. https://<utente>.github.io/FM-webapp/): GitHub Pages ospita
  // il progetto in un sottopercorso, non alla radice del dominio. Usare la scope del SW
  // invece di percorsi assoluti "/xxx" evita che il link finisca alla radice del dominio
  // (che non esiste → 404) invece che dentro la cartella dell'app.
  const base = self.registration.scope;

  const title = data.title || 'Futuro Musica';

  // Normalizza l'URL di destinazione: un path che il server manda come "/webapp.html"
  // va interpretato come relativo alla cartella dell'app, non alla radice del dominio.
  let rawUrl = data.url || 'webapp.html';
  if (rawUrl.startsWith('/')) rawUrl = rawUrl.slice(1);
  let targetUrl;
  try { targetUrl = new URL(rawUrl, base).href; } catch (e) { targetUrl = base + 'webapp.html'; }

  const iconUrl  = new URL('icons/icon-192.png', base).href;

  const options = {
    body:               data.body || 'Hai una nuova notifica',
    icon:               iconUrl,
    badge:              iconUrl,
    tag:                data.tag  || 'fm-notification',
    data:               { url: targetUrl },
    vibrate:            [200, 100, 200],
    requireInteraction: false,
    actions:            [{ action: 'open', title: '📅 Apri app' }],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Click sulla notifica → apre/porta in primo piano l'app ───────────────────
// Se la PWA è installata e la url richiesta rientra nel suo scope, il sistema operativo/
// browser la instrada automaticamente all'app installata (comportamento nativo PWA);
// altrimenti clients.openWindow() apre l'URL nel browser mobile di default. Qui ci limitiamo
// a garantire che l'URL sia sempre corretto (con il prefisso /FM-webapp/) e a riusare una
// finestra dell'app già aperta, se presente, invece di aprirne una nuova.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const base = self.registration.scope;
  let targetUrl = event.notification.data && event.notification.data.url;
  if (!targetUrl) targetUrl = base + 'webapp.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.startsWith(base) && 'focus' in client) {
          // Se il client già aperto punta a una pagina diversa (es. deep-link diverso),
          // naviga verso l'URL corretto prima di dare il focus.
          if (client.url !== targetUrl && 'navigate' in client) {
            return client.navigate(targetUrl).then(c => c ? c.focus() : client.focus());
          }
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

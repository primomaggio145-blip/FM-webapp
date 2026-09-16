// Futuro Musica — Service Worker v6
// STRATEGIA CACHE:
//   - app.js, fm_sync.js, supabase_integration.js → NETWORK-FIRST (sempre freschi)
//   - webapp.html, manifest.json, icone          → NETWORK-FIRST con fallback cache
//   - API Supabase, font Google (googleapis/gstatic) → solo network, mai cache
const CACHE_VERSION = 'fm-v11'; // v11: ignora dominio/percorso mandato dal server (residuo pre-migrazione a www.fmspettacolo.it), usa sempre la base reale corrente

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

  // Base reale dell'app, letta a runtime dallo scope del service worker — es.
  // "https://www.fmspettacolo.it/". Non ci fidiamo del dominio/percorso che il server
  // mette in data.url: dopo un cambio di dominio (com'è successo qui: da GitHub Pages
  // sotto /FM-webapp/ al dominio proprio www.fmspettacolo.it) quel valore resta spesso
  // vecchio (es. "/FM-webapp/webapp.html") e produce un 404 anche se il DOMINIO combacia,
  // perché è il PERCORSO a non esistere più su quel dominio. Per questo ricostruiamo
  // sempre il link sulla nostra base nota + nome file fisso, tenendo dal valore del
  // server solo eventuali query/hash utili per un deep-link (es. "#notifiche").
  const base = self.registration.scope;

  const title = data.title || 'Futuro Musica';

  let targetUrl = base + 'webapp.html';
  try {
    if (data.url) {
      const parsed = new URL(data.url, base);
      targetUrl = base + 'webapp.html' + parsed.search + parsed.hash;
    }
  } catch (e) { /* usa il default già impostato sopra */ }

  const iconUrl  = new URL('icons/icon-192.png', base).href;
  console.log('[FM SW] push ricevuto — base:', base, '| data.url originale:', data.url, '| targetUrl risolto:', targetUrl);

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
// a garantire che l'URL sia sempre corretto (sulla base reale del dominio attuale) e a
// riusare una finestra dell'app già aperta, se presente, invece di aprirne una nuova.
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

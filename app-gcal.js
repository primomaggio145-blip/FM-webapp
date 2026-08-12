// ══════════════════════════════════════════════════════════════
// Futuro Musica — app-gcal.js
// Modulo Google Calendar: sync automatico lezioni ↔ Google Calendar
//
// ISTRUZIONI DEPLOY:
// 1. Carica questo file su GitHub nella stessa cartella degli altri app-*.js
// 2. fm_sync.js è già aggiornato per caricarlo
// 3. In app-root.js cerca "ImpSection.*Simulazione Ruolo" e dopo la sua
//    chiusura ) aggiungi:
//      , React.createElement(ImpSection, {title:'Google Calendar', icon:'calendar'}
//          , React.createElement(GoogleCalendarSection, {appUser: window.__appUser__||null})
//        )
// 4. Crea la tabella Supabase `app_settings` (vedi migrazione SQL allegata) —
//    serve per salvare il Client ID configurato da UI (non serve più modificare
//    il codice: usa il pulsante "🔑 Client ID" in Impostazioni → Google Calendar)
// 5. Su Supabase → Edge Functions → Secrets aggiungi:
//      GOOGLE_CLIENT_ID     = <Client ID>
//      GOOGLE_CLIENT_SECRET = <Client Secret>
//      APP_URL              = https://primomaggio145-blip.github.io/FM-webapp/webapp.html
// ══════════════════════════════════════════════════════════════

(function() {
  try {

// ── Configurazione ────────────────────────────────────────────────────────────
const GCAL_EDGE = 'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/gcal-sync';

// ← Google OAuth 2.0 Client ID
// Ora configurabile da UI (pulsante "🔑 Configura Client ID" in Impostazioni →
// Google Calendar, visibile per ADMIN) invece che modificando il codice.
// Il valore è salvato sulla tabella Supabase `app_settings` (chiave
// 'google_client_id_frontend') ed è quindi condiviso da tutti i ruoli
// (docenti/allievi lo ricevono automaticamente una volta configurato).
// Il valore letterale qui sotto resta solo come fallback iniziale.
let GOOGLE_CLIENT_ID_FRONTEND = '';

// ── Client ID dinamico: lettura/scrittura da Supabase (tabella app_settings) ──
const GCAL_SETTINGS_TABLE = 'app_settings';
const GCAL_SETTINGS_KEY   = 'google_client_id_frontend';

async function fetchGcalClientId() {
  try {
    const sb = window.supabaseClient;
    if (!sb) return GOOGLE_CLIENT_ID_FRONTEND;
    const { data, error } = await sb.from(GCAL_SETTINGS_TABLE)
      .select('value').eq('key', GCAL_SETTINGS_KEY).maybeSingle();
    if (!error && data && data.value) {
      GOOGLE_CLIENT_ID_FRONTEND = data.value;
      window.__GCAL_CLIENT_ID__ = data.value;
    }
  } catch(e) { /* silenzioso */ }
  return GOOGLE_CLIENT_ID_FRONTEND;
}

async function saveGcalClientId(id) {
  const sb = window.supabaseClient;
  if (!sb) throw new Error('Supabase non disponibile');
  const { data: { session } } = await sb.auth.getSession();
  const { error } = await sb.from(GCAL_SETTINGS_TABLE).upsert({
    key: GCAL_SETTINGS_KEY,
    value: id,
    updated_at: new Date().toISOString(),
    updated_by: session && session.user ? session.user.id : null
  }, { onConflict: 'key' });
  if (error) throw error;
  GOOGLE_CLIENT_ID_FRONTEND = id;
  window.__GCAL_CLIENT_ID__ = id;
}

// ── Componente condiviso: mappatura corso → calendario Google (per utente) ────
// Ogni utente (admin, docente, allievo) sceglie autonomamente, per ciascun
// corso/strumento, se sincronizzarlo e su quale dei propri calendari Google.
function GcalCourseMapping(props) {
  const userId = props.userId;
  const [calendars, setCalendars] = React.useState([]);
  const [mapping, setMapping]     = React.useState({});
  const [loading, setLoading]     = React.useState(true);
  const [error, setError]         = React.useState(null);
  const [savingKey, setSavingKey] = React.useState(null);

  const corsi = React.useMemo(function() {
    const base = ((window.__FM_DATA__ && window.__FM_DATA__.courses) || [])
      .map(function(c) { return c.name || c.nome || ''; })
      .filter(Boolean);
    const unique = Array.from(new Set(base)).sort(function(a,b){ return a.localeCompare(b); });
    return unique.concat(['_collettivo', '_sala_prove']);
  }, []);

  const labelFor = function(corso) {
    if (corso === '_collettivo') return '🎵 Lezioni collettive';
    if (corso === '_sala_prove') return '🥁 Sala prove';
    return corso;
  };

  const load = React.useCallback(async function() {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const sb = window.supabaseClient;
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(GCAL_EDGE, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + session.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_calendars', user_id: userId })
      });
      const json = await res.json();
      if (json.ok) setCalendars(json.calendars || []);
      else setError(json.error || 'Errore caricamento calendari');

      const { data: rows, error: mapErr } = await sb.from('gcal_calendar_map')
        .select('corso, calendar_id, enabled').eq('user_id', userId);
      if (mapErr) throw mapErr;
      const m = {};
      (rows || []).forEach(function(r) { m[r.corso] = { calendar_id: r.calendar_id, enabled: r.enabled !== false }; });
      setMapping(m);
    } catch(e) {
      setError((e && e.message) || 'Errore caricamento');
    }
    setLoading(false);
  }, [userId]);

  React.useEffect(function() { load(); }, [load]);

  const updateRow = async function(corso, patch) {
    setSavingKey(corso);
    const current = mapping[corso] || { calendar_id: null, enabled: true };
    const next = Object.assign({}, current, patch);
    setMapping(function(m) { const copy = Object.assign({}, m); copy[corso] = next; return copy; });
    try {
      const sb = window.supabaseClient;
      await sb.from('gcal_calendar_map').upsert({
        user_id: userId,
        corso: corso,
        calendar_id: next.calendar_id || null,
        enabled: next.enabled,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,corso' });
    } catch(e) {
      setError((e && e.message) || 'Errore salvataggio');
    }
    setSavingKey(null);
  };

  if (loading) {
    return React.createElement('div', { style: { fontSize: 12, color: C.textMuted, fontFamily: "'Open Sans',sans-serif" } }, '⏳ Caricamento calendari...');
  }

  return React.createElement('div', null
    , error && React.createElement('div', { style: { fontSize: 12, color: C.red, marginBottom: 8, fontFamily: "'Open Sans',sans-serif" } }, error)
    , calendars.length === 0 && !error && React.createElement('div', { style: { fontSize: 12, color: C.textDim, marginBottom: 8, fontFamily: "'Open Sans',sans-serif" } }, 'Nessun calendario trovato sul tuo account Google.')
    , corsi.length === 0 && React.createElement('div', { style: { fontSize: 12, color: C.textDim, fontFamily: "'Open Sans',sans-serif" } }, '(nessun corso trovato)')
    , corsi.map(function(corso) {
        const row = mapping[corso] || { calendar_id: null, enabled: true };
        const busy = savingKey === corso;
        return React.createElement('div', {
            key: corso,
            style: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid '+C.border, opacity: busy ? 0.6 : 1 }
          }
          , React.createElement('input', {
              type: 'checkbox',
              checked: row.enabled !== false,
              disabled: busy,
              onChange: function(e) { updateRow(corso, { enabled: e.target.checked }); },
              title: 'Sincronizza questo corso'
            })
          , React.createElement('span', { style: { fontSize: 13, color: C.text, flex: '1 1 auto', fontFamily: "'Open Sans',sans-serif" } }, labelFor(corso))
          , React.createElement('select', {
              value: row.calendar_id || '',
              disabled: busy || row.enabled === false,
              onChange: function(e) { updateRow(corso, { calendar_id: e.target.value || null }); },
              style: { padding: '5px 8px', borderRadius: 6, border: '1px solid '+C.border, background: C.surface, color: C.text, fontSize: 12, fontFamily: "'Open Sans',sans-serif", maxWidth: 190 }
            }
            , React.createElement('option', { value: '' }, '📅 Calendario predefinito')
            , calendars.map(function(cal) {
                return React.createElement('option', { key: cal.id, value: cal.id }, cal.name + (cal.primary ? ' (principale)' : ''));
              })
            )
        );
      })
    , React.createElement('div', { style: { fontSize: 11, color: C.textDim, marginTop: 8, fontFamily: "'Open Sans',sans-serif", lineHeight: 1.5 } }, '💡 Deseleziona un corso per escluderlo dalla sincronizzazione. Ogni corso può avere un calendario diverso — le modifiche si salvano subito, non serve premere "Salva".')
  );
}

// ── Utility: sync singola lezione in background ───────────────────────────────
// Chiamata automaticamente da app-calendario.js e app-views-b.js
// quando una lezione viene creata/modificata/eliminata
window.gcalSyncLesson = async function(action, lesson) {
  try {
    const sb = window.supabaseClient;
    if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session?.user?.id) return;
    // Controlla se l'utente ha GCal connesso e abilitato
    const { data: tokenRow } = await sb.from('google_calendar_tokens')
      .select('sync_enabled').eq('user_id', session.user.id).maybeSingle();
    if (!tokenRow?.sync_enabled) return;
    // Fire & forget — non blocca l'UI
    fetch(GCAL_EDGE, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        user_id: session.user.id,
        lesson,
        lezione_id: lesson && lesson.id ? lesson.id : undefined,
      }),
    }).catch(function() { /* silenzioso */ });
  } catch(e) { /* silenzioso */ }
};

// ── Componente: sezione Google Calendar in Impostazioni ───────────────────────
window.GoogleCalendarSection = function(props) {
  const appUser = props && props.appUser;
  const _useState = React.useState;
  const _useEffect = React.useEffect;
  const _useCallback = React.useCallback;

  const [status,  setStatus]  = _useState(null);
  const [loading, setLoading] = _useState(true);
  const [syncing, setSyncing] = _useState(false);
  const [toast,   setToast]   = _useState(null);
  const [clientId, setClientId] = _useState(GOOGLE_CLIENT_ID_FRONTEND);
  const [showClientIdModal, setShowClientIdModal] = _useState(false);
  const [clientIdInput, setClientIdInput] = _useState('');
  const [savingClientId, setSavingClientId] = _useState(false);
  const [userId, setUserId] = _useState(null);

  const showToast = function(ok, msg) {
    setToast({ok: ok, msg: msg});
    setTimeout(function() { setToast(null); }, 4000);
  };

  const checkStatus = _useCallback(async function() {
    try {
      const sb = window.supabaseClient;
      if (!sb) { setLoading(false); return; }
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUserId(session.user.id);
      const res = await fetch(
        GCAL_EDGE + '?action=status&user_id=' + session.user.id,
        { headers: { 'Authorization': 'Bearer ' + session.access_token } }
      );
      const json = await res.json();
      setStatus(json);
    } catch(e) {
      console.warn('[FM] gcal status:', e && e.message);
    }
    setLoading(false);
  }, []);

  _useEffect(function() { checkStatus(); }, [checkStatus]);

  // Carica il Client ID Google salvato su Supabase (condiviso con tutti i ruoli)
  _useEffect(function() {
    fetchGcalClientId().then(function(id) { if (id) setClientId(id); });
  }, []);

  // Gestisce ritorno da OAuth Google (gcal_code nel query string)
  _useEffect(function() {
    const params = new URLSearchParams(window.location.search);
    // Google redirect usa ?code=, la webapp lo rinomina ?gcal_code= per distinguerlo
    const code = params.get('gcal_code') || (params.get('code') && params.get('scope') ? params.get('code') : null);
    if (!code) return;
    // Rimuovi i parametri OAuth dall'URL
    const cleanUrl = window.location.href
      .replace(/[?&]gcal_code=[^&]+/, '')
      .replace(/[?&]code=[^&]+/, '')
      .replace(/[?&]scope=[^&]+/, '')
      .replace(/[?&]authuser=[^&]+/, '')
      .replace(/[?&]prompt=[^&]+/, '')
      .replace(/\?$/, '');
    window.history.replaceState({}, '', cleanUrl);
    // Scambia il code con i token
    (async function() {
      setLoading(true);
      try {
        const sb = window.supabaseClient;
        const { data: { session } } = await sb.auth.getSession();
        // Invia il code all'Edge Function con il token Supabase dell'utente
        // redirect_uri deve corrispondere a quello usato nell'autorizzazione
        const res = await fetch(GCAL_EDGE, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + session.access_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'oauth_callback',
            code: code,
            user_id: session.user.id,
            redirect_uri: 'https://primomaggio145-blip.github.io/FM-webapp/webapp.html'
          })
        });
        const json = await res.json();
        if (json.ok) {
          showToast(true, '✅ Google Calendar connesso!');
          checkStatus();
        } else {
          showToast(false, 'Errore: ' + (json.error || 'OAuth fallito'));
        }
      } catch(e) {
        showToast(false, e && e.message || 'Errore');
      }
      setLoading(false);
    })();
  }, []);

  // URL della webapp — Google reindirizza qui con ?gcal_code=...
  const WEBAPP_URL = 'https://primomaggio145-blip.github.io/FM-webapp/webapp.html';

  const handleConnect = function() {
    if (!clientId) {
      setClientIdInput('');
      setShowClientIdModal(true);
      return;
    }
    // Redirect URI = la webapp stessa (riceve il code e lo manda all'Edge Function)
    const redirectUri = encodeURIComponent(WEBAPP_URL);
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.calendarlist.readonly');
    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      '?client_id=' + clientId +
      '&redirect_uri=' + redirectUri +
      '&response_type=code' +
      '&scope=' + scope +
      '&access_type=offline&prompt=consent';
    window.location.href = authUrl;
  };

  const handleSaveClientId = async function() {
    const val = (clientIdInput || '').trim();
    if (!val) { showToast(false, 'Inserisci un Client ID valido'); return; }
    setSavingClientId(true);
    try {
      await saveGcalClientId(val);
      setClientId(val);
      setShowClientIdModal(false);
      setClientIdInput('');
      showToast(true, '✅ Client ID salvato e attivo per tutti i ruoli');
    } catch(e) {
      showToast(false, 'Errore salvataggio: ' + (e && e.message || 'sconosciuto'));
    }
    setSavingClientId(false);
  };

  const handleDisconnect = async function() {
    if (!confirm('Disconnettere Google Calendar?\nGli eventi già creati su Google Calendar NON verranno eliminati.')) return;
    try {
      const sb = window.supabaseClient;
      const { data: { session } } = await sb.auth.getSession();
      await fetch(GCAL_EDGE, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'disconnect', user_id: session.user.id })
      });
      setStatus(null);
      showToast(true, 'Google Calendar disconnesso');
    } catch(e) {
      showToast(false, e && e.message || 'Errore');
    }
  };

  const handleSyncAll = async function() {
    setSyncing(true);
    try {
      const sb = window.supabaseClient;
      const { data: { session } } = await sb.auth.getSession();
      const today = new Date().toISOString().split('T')[0];
      const allLessons = (window.__FM_DATA__ && window.__FM_DATA__.lessons) || [];
      const futureLessons = allLessons.filter(function(l) {
        return (l.date || l.data) >= today;
      });
      const res = await fetch(GCAL_EDGE, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'sync_all',
          user_id: session.user.id,
          lessons: futureLessons
        })
      });
      const json = await res.json();
      if (json.ok) {
        showToast(true, '✅ Sincronizzate ' + json.synced + ' lezioni su Google Calendar' +
          (json.errors > 0 ? ' (' + json.errors + ' errori)' : ''));
      } else {
        showToast(false, json.error || 'Errore durante sync');
      }
    } catch(e) {
      showToast(false, e && e.message || 'Errore');
    }
    setSyncing(false);
  };

  // ── Configurazione filtri e caption ──────────────────────────────────────
  const [showConfig, setShowConfig] = React.useState(false);
  const [captionTpl, setCaptionTpl] = React.useState(
    (window.__gcalConfig__ && window.__gcalConfig__.captionTemplate) || '{studente} - {strumento}'
  );
  const [filtroDocente,   setFiltroDocente]   = React.useState('');
  const [filtroStrumento, setFiltroStrumento] = React.useState('');

  const saveConfig = function() {
    const cfg = {
      captionTemplate: captionTpl,
      filtroDocente:   filtroDocente ? filtroDocente.split(',').map(s=>s.trim()).filter(Boolean) : [],
      filtroCorso: filtroStrumento ? filtroStrumento.split(',').map(s=>s.trim()).filter(Boolean) : [],
    };
    window.__gcalConfig__ = cfg;
    // Salva in localStorage per persistenza
    try { localStorage.setItem('fm_gcal_config', JSON.stringify(cfg)); } catch(e) {}
    showToast(true, '✅ Configurazione GCal salvata');
    setShowConfig(false);
  };

  // Carica config salvata
  React.useEffect(function() {
    try {
      const saved = localStorage.getItem('fm_gcal_config');
      if (saved) {
        const cfg = JSON.parse(saved);
        window.__gcalConfig__ = cfg;
        if (cfg.captionTemplate) setCaptionTpl(cfg.captionTemplate);
        if (cfg.filtroDocente)   setFiltroDocente(cfg.filtroDocente.join(', '));
        if (cfg.filtroStrumento) setFiltroStrumento(cfg.filtroStrumento.join(', '));
      }
    } catch(e) {}
  }, []);

  // Stili riutilizzabili (usa i colori C già definiti in app-core.js)
  const cardStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 14px', borderRadius: 10, marginBottom: 12
  };

  return React.createElement('div', null
    // Toast notifica
    , toast && React.createElement('div', {
        style: {
          padding: '8px 12px', borderRadius: 8, marginBottom: 10,
          fontSize: 13, fontFamily: "'Open Sans',sans-serif",
          background: toast.ok ? C.greenBg  : C.redBg,
          border: '1px solid ' + (toast.ok ? C.greenBorder : C.redBorder),
          color:  toast.ok ? C.green : C.red
        }
      }, toast.msg)

    // Loading
    , loading && React.createElement('div', {
        style: { color: C.textMuted, fontSize: 13, fontFamily: "'Open Sans',sans-serif" }
      }, '⏳ Controllo connessione Google Calendar...')

    // Connesso
    , !loading && status && status.connected && React.createElement('div', null
        , React.createElement('div', {
            style: Object.assign({}, cardStyle, {
              background: C.greenBg,
              border: '1px solid ' + C.greenBorder
            })
          }
          , React.createElement('span', { style: { fontSize: 22 } }, '📅')
          , React.createElement('div', { style: { flex: 1 } }
            , React.createElement('div', {
                style: { fontSize: 13, fontWeight: 700, color: C.green,
                  fontFamily: "'Open Sans',sans-serif" }
              }, '✅ Google Calendar connesso')
            , React.createElement('div', {
                style: { fontSize: 11, color: C.textMuted,
                  fontFamily: "'Open Sans',sans-serif", marginTop: 2 }
              }, 'Ultimo aggiornamento: ' + (
                status.updated_at
                  ? new Date(status.updated_at).toLocaleString('it-IT')
                  : 'mai'
              ))
          )
          , React.createElement('button', {
              onClick: handleDisconnect,
              style: {
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                border: '1px solid ' + C.redBorder,
                background: C.redBg, color: C.red,
                fontSize: 12, fontFamily: "'Open Sans',sans-serif"
              }
            }, 'Disconnetti')
        )
        , React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }
          , React.createElement('button', {
              onClick: function() { setShowConfig(!showConfig); },
              style: { padding: '9px 14px', borderRadius: 8, border: '1px solid '+(showConfig?C.tealBorder:C.border), background: showConfig?C.tealBg:C.bg, color: showConfig?C.teal:C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: "'Open Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }
            }, '⚙️ Impostazioni')
          , React.createElement('button', {
              onClick: function() { setClientIdInput(clientId || ''); setShowClientIdModal(true); },
              style: { padding: '9px 14px', borderRadius: 8, border: '1px solid '+C.border, background: C.bg, color: C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: "'Open Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }
            }, '🔑 Client ID')
          , React.createElement('button', {
              onClick: handleSyncAll,
              disabled: syncing,
              style: {
                padding: '9px 18px', borderRadius: 8, border: 'none',
                background: syncing ? C.surface : C.teal,
                color: syncing ? C.textMuted : '#fff',
                cursor: syncing ? 'wait' : 'pointer',
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Open Sans',sans-serif",
                display: 'flex', alignItems: 'center', gap: 6
              }
            }
            , syncing ? '⏳ Sincronizzazione in corso...' : '🔄 Sincronizza tutte le lezioni future'
          )
        )
        , React.createElement('div', {
            style: {
              fontSize: 11, color: C.textMuted, marginTop: 10,
              fontFamily: "'Open Sans',sans-serif", lineHeight: 1.6
            }
          }
          , '💡 Le lezioni vengono sincronizzate automaticamente quando le crei o modifichi. '
          , 'Usa "Sincronizza tutte" per il primo avvio o dopo un\'importazione massiva.'
        )
        , showConfig && React.createElement('div', { style: { marginTop: 14, padding: 16, background: C.bg, border: '1px solid '+C.border, borderRadius: 10 } }
          , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, fontFamily: "'Open Sans',sans-serif" } }, '⚙️ Impostazioni sincronizzazione')
          , React.createElement('div', { style: { marginBottom: 10 } }
            , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 4, fontFamily: "'Open Sans',sans-serif" } }, '📝 Titolo evento GCal')
            , React.createElement('input', { type: 'text', value: captionTpl, onChange: function(e){setCaptionTpl(e.target.value);}, placeholder: '{studente} - {strumento}', style: { width: '100%', boxSizing: 'border-box', padding: '7px 10px', borderRadius: 7, border: '1px solid '+C.border, background: C.surface, color: C.text, fontSize: 13, fontFamily: "'Open Sans',sans-serif" } })
            , React.createElement('div', { style: { fontSize: 11, color: C.textDim, marginTop: 3, fontFamily: "'Open Sans',sans-serif" } }, 'Variabili: {studente} {strumento} {docente} {aula} {argomento} {tipo} {ora}')
          )
          , React.createElement('div', { style: { marginBottom: 10 } }
            , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6, fontFamily: "'Open Sans',sans-serif" } }, '👤 Sincronizza docenti (vuoto = tutti)')
            , React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }
                , (window.__FM_DATA__&&window.__FM_DATA__.docenti||[]).map(function(d) {
                    const nome = d.nome||d.name||'';
                    const sel = filtroDocente ? filtroDocente.split(',').map(s=>s.trim()).includes(nome) : false;
                    return React.createElement('button', { key: d.id||nome, onClick: function() {
                        const cur = filtroDocente ? filtroDocente.split(',').map(s=>s.trim()).filter(Boolean) : [];
                        const next = sel ? cur.filter(x=>x!==nome) : [...cur, nome];
                        setFiltroDocente(next.join(', '));
                      }, style: { padding: '4px 10px', borderRadius: 20, border: '1px solid '+(sel?C.teal:C.border), background: sel?C.tealBg:C.bg, color: sel?C.teal:C.textMuted, cursor: 'pointer', fontSize: 12, fontFamily: "'Open Sans',sans-serif" }
                    }, nome);
                  })
                , (window.__FM_DATA__&&window.__FM_DATA__.docenti||[]).length===0 && React.createElement('span',{style:{fontSize:12,color:C.textDim,fontFamily:"'Open Sans',sans-serif"}},'(nessun docente trovato)')
            )
            , filtroDocente && React.createElement('div',{style:{fontSize:11,color:C.teal,marginTop:4,fontFamily:"'Open Sans',sans-serif"}},'Selezionati: ',filtroDocente)
          )
          , React.createElement('div', { style: { marginBottom: 14 } }
            , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6, fontFamily: "'Open Sans',sans-serif" } }, '🎵 Sincronizza corsi (vuoto = tutti)')
            , React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } }
                , (window.__FM_DATA__&&window.__FM_DATA__.courses||[])
                    .slice().sort(function(a,b){ return (a.name||a.nome||'').localeCompare(b.name||b.nome||''); })
                    .map(function(c) {
                        const nome = c.name||c.nome||'';
                        if (!nome) return null;
                        const sel = filtroStrumento ? filtroStrumento.split(',').map(s=>s.trim()).includes(nome) : false;
                        return React.createElement('button', { key: c.id||nome, onClick: function() {
                            const cur = filtroStrumento ? filtroStrumento.split(',').map(s=>s.trim()).filter(Boolean) : [];
                            const next = sel ? cur.filter(x=>x!==nome) : [...cur, nome];
                            setFiltroStrumento(next.join(', '));
                          }, style: { padding: '4px 10px', borderRadius: 20, border: '1px solid '+(sel?C.teal:C.border), background: sel?C.tealBg:C.bg, color: sel?C.teal:C.textMuted, cursor: 'pointer', fontSize: 12, fontFamily: "'Open Sans',sans-serif" }
                        }, nome);
                      })
                , (window.__FM_DATA__&&window.__FM_DATA__.courses||[]).length===0 && React.createElement('span',{style:{fontSize:12,color:C.textDim,fontFamily:"'Open Sans',sans-serif"}},'(nessun corso trovato)')
            )
            , filtroStrumento && React.createElement('div',{style:{fontSize:11,color:C.teal,marginTop:4,fontFamily:"'Open Sans',sans-serif"}},'Selezionati: ',filtroStrumento)
          )
          , React.createElement('div', { style: { marginBottom: 14, paddingTop: 12, borderTop: '1px solid '+C.border } }
            , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8, fontFamily: "'Open Sans',sans-serif" } }, '🗓️ Calendario di destinazione per corso')
            , userId
              ? React.createElement(GcalCourseMapping, { userId: userId })
              : React.createElement('div', { style: { fontSize: 12, color: C.textDim, fontFamily: "'Open Sans',sans-serif" } }, '⏳ In attesa della connessione...')
          )
          , React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } }
            , React.createElement('button', { onClick: function(){setShowConfig(false);}, style: { padding: '8px 14px', borderRadius: 7, border: '1px solid '+C.border, background: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: "'Open Sans',sans-serif" } }, 'Annulla')
            , React.createElement('button', { onClick: saveConfig, style: { padding: '8px 16px', borderRadius: 7, border: 'none', background: C.teal, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',sans-serif" } }, '💾 Salva')
          )
        )
      )

    // Non connesso
    , !loading && (!status || !status.connected) && React.createElement('div', null
        , React.createElement('p', {
            style: {
              fontSize: 13, color: C.textMuted, marginBottom: 14,
              fontFamily: "'Open Sans',sans-serif", lineHeight: 1.6
            }
          }
          , 'Connetti il tuo Google Calendar per sincronizzare automaticamente le lezioni. '
          , 'Ogni lezione creata, modificata o eliminata verrà aggiornata in tempo reale.'
        )
        , clientId
          ? React.createElement('button', {
              onClick: handleConnect,
              style: {
                padding: '10px 22px', borderRadius: 8, border: 'none',
                background: '#4285f4', color: '#fff', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                fontFamily: "'Open Sans',sans-serif",
                display: 'inline-flex', alignItems: 'center', gap: 8
              }
            }
            , React.createElement('span', { style: { fontSize: 16 } }, '📅')
            , 'Connetti Google Calendar'
            )
          : React.createElement('div', null
            , React.createElement('div', {
                style: {
                  padding: '12px 16px',
                  background: '#fef9c3', border: '1px solid #fde68a',
                  borderRadius: 8, fontSize: 12, color: '#92400e',
                  lineHeight: 1.8, fontFamily: "'Open Sans',sans-serif",
                  marginBottom: 10
                }
              }
              , React.createElement('strong', null, '⚙️ Configurazione richiesta')
              , React.createElement('br', null)
              , '1. Vai su '
              , React.createElement('a', {
                  href: 'https://console.cloud.google.com/apis/credentials',
                  target: '_blank',
                  style: { color: '#1d4ed8' }
                }, 'Google Cloud Console → Credenziali')
              , React.createElement('br', null)
              , '2. Crea un OAuth 2.0 Client ID (tipo: Web Application)'
              , React.createElement('br', null)
              , '3. Aggiungi come Authorized Redirect URI:'
              , React.createElement('br', null)
              , React.createElement('code', { style: { fontSize: 11, background: '#fef3c7', padding: '1px 4px' } },
                  WEBAPP_URL)
              , React.createElement('br', null)
              , '4. Copia il Client ID e inseriscilo col pulsante qui sotto — non serve modificare il codice'
              )
            , React.createElement('button', {
                onClick: function() { setClientIdInput(''); setShowClientIdModal(true); },
                style: {
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  background: C.teal, color: '#fff', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',sans-serif",
                  display: 'inline-flex', alignItems: 'center', gap: 8
                }
              }
              , React.createElement('span', { style: { fontSize: 16 } }, '🔑')
              , 'Configura Client ID'
              )
          )
      )
    // Modal configurazione Client ID
    , showClientIdModal && React.createElement('div', {
        style: {
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
        },
        onClick: function(e) { if (e.target === e.currentTarget) setShowClientIdModal(false); }
      }
      , React.createElement('div', {
          style: { background: C.surface || '#fff', borderRadius: 12, padding: 22, width: '100%', maxWidth: 440, boxShadow: '0 10px 40px rgba(0,0,0,.25)' }
        }
        , React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6, fontFamily: "'Open Sans',sans-serif" } }, '🔑 Configura Google Client ID')
        , React.createElement('div', { style: { fontSize: 12, color: C.textMuted, marginBottom: 14, fontFamily: "'Open Sans',sans-serif", lineHeight: 1.6 } },
            'Incolla qui il Client ID OAuth 2.0 ottenuto da Google Cloud Console. Viene salvato centralmente su Supabase ed è reso disponibile automaticamente a tutti i ruoli (docenti e allievi inclusi), senza dover toccare il codice.')
        , React.createElement('input', {
            type: 'text',
            value: clientIdInput,
            onChange: function(e) { setClientIdInput(e.target.value); },
            placeholder: 'xxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
            autoFocus: true,
            style: { width: '100%', boxSizing: 'border-box', padding: '9px 11px', borderRadius: 7, border: '1px solid '+C.border, background: C.bg, color: C.text, fontSize: 13, fontFamily: 'monospace', marginBottom: 16 }
          })
        , React.createElement('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } }
          , React.createElement('button', {
              onClick: function() { setShowClientIdModal(false); },
              style: { padding: '8px 14px', borderRadius: 7, border: '1px solid '+C.border, background: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: "'Open Sans',sans-serif" }
            }, 'Annulla')
          , React.createElement('button', {
              onClick: handleSaveClientId,
              disabled: savingClientId,
              style: { padding: '8px 16px', borderRadius: 7, border: 'none', background: C.teal, color: '#fff', cursor: savingClientId ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',sans-serif" }
            }, savingClientId ? '⏳ Salvataggio...' : '💾 Salva')
        )
      )
    )
  );
};

// ── GoogleCalendarSectionSimple: per docente e allievo ──────────────────────
// Sincronizza SOLO le proprie lezioni, senza filtri
window.GoogleCalendarSectionSimple = function(props) {
  const appUser = props && props.appUser;
  const userRuolo = props && props.userRuolo || 'docente';
  const [status,  setStatus]  = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [toast,   setToast]   = React.useState(null);
  const [clientId, setClientId] = React.useState(GOOGLE_CLIENT_ID_FRONTEND);
  const [userId, setUserId] = React.useState(null);
  const [showConfig, setShowConfig] = React.useState(false);

  const showToast = function(ok, msg) {
    setToast({ok:ok, msg:msg});
    setTimeout(function(){ setToast(null); }, 4000);
  };

  const checkStatus = React.useCallback(async function() {
    try {
      const sb = window.supabaseClient; if (!sb) { setLoading(false); return; }
      const { data:{session} } = await sb.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUserId(session.user.id);
      const res = await fetch(GCAL_EDGE+'?action=status&user_id='+session.user.id,
        { headers: {'Authorization':'Bearer '+session.access_token} });
      setStatus(await res.json());
    } catch(e) {}
    setLoading(false);
  }, []);

  React.useEffect(function(){ checkStatus(); }, [checkStatus]);

  // Carica il Client ID Google configurato dall'amministratore (tabella app_settings)
  React.useEffect(function() {
    fetchGcalClientId().then(function(id) { if (id) setClientId(id); });
  }, []);

  // Gestisce ritorno da OAuth Google
  React.useEffect(function() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('gcal_code') || (params.get('code') && params.get('scope') ? params.get('code') : null);
    if (!code) return;
    const cleanUrl = window.location.href
      .replace(/[?&]gcal_code=[^&]+/,'').replace(/[?&]code=[^&]+/,'')
      .replace(/[?&]scope=[^&]+/,'').replace(/[?&]authuser=[^&]+/,'')
      .replace(/[?&]prompt=[^&]+/,'').replace(/\?$/,'');
    window.history.replaceState({}, '', cleanUrl);
    (async function() {
      setLoading(true);
      try {
        const sb = window.supabaseClient;
        const { data:{session} } = await sb.auth.getSession();
        const res = await fetch(GCAL_EDGE, {
          method:'POST',
          headers:{'Authorization':'Bearer '+session.access_token,'Content-Type':'application/json'},
          body: JSON.stringify({ action:'oauth_callback', code:code, user_id:session.user.id, redirect_uri:'https://primomaggio145-blip.github.io/FM-webapp/webapp.html' })
        });
        const json = await res.json();
        if (json.ok) { showToast(true,'✅ Google Calendar connesso!'); checkStatus(); }
        else showToast(false,'Errore: '+(json.error||'OAuth fallito'));
      } catch(e) { showToast(false, e&&e.message||'Errore'); }
      setLoading(false);
    })();
  }, []);

  const WEBAPP_URL = 'https://primomaggio145-blip.github.io/FM-webapp/webapp.html';

  const handleConnect = function() {
    if (!clientId) {
      showToast(false, 'Google Calendar non è ancora configurato. Contatta l\'amministratore.');
      return;
    }
    const redirectUri = encodeURIComponent(WEBAPP_URL);
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.calendarlist.readonly');
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+clientId+'&redirect_uri='+redirectUri+'&response_type=code&scope='+scope+'&access_type=offline&prompt=consent';
  };

  const handleDisconnect = async function() {
    if (!confirm('Disconnettere Google Calendar?')) return;
    const sb = window.supabaseClient;
    const { data:{session} } = await sb.auth.getSession();
    await fetch(GCAL_EDGE, { method:'POST', headers:{'Authorization':'Bearer '+session.access_token,'Content-Type':'application/json'}, body:JSON.stringify({action:'disconnect',user_id:session.user.id}) });
    setStatus(null); showToast(true,'Google Calendar disconnesso');
  };

  const handleSyncAll = async function() {
    setSyncing(true);
    try {
      const sb = window.supabaseClient;
      const { data:{session} } = await sb.auth.getSession();
      const allLessons = (window.__FM_DATA__&&window.__FM_DATA__.lessons)||[];
      const myName = appUser && (appUser.nome||appUser.name||'');
      // Filtra solo le proprie lezioni
      const myLessons = allLessons.filter(function(l) {
        if (userRuolo==='docente') {
          return (l.teacher||l.docente||'').toLowerCase()===myName.toLowerCase();
        }
        if (userRuolo==='allievo') {
          return (l.student||l.studente||'').toLowerCase()===myName.toLowerCase();
        }
        return false;
      });
      const res = await fetch(GCAL_EDGE, {
        method:'POST',
        headers:{'Authorization':'Bearer '+session.access_token,'Content-Type':'application/json'},
        body: JSON.stringify({ action:'sync_all', user_id:session.user.id, lessons:myLessons })
      });
      const json = await res.json();
      if (json.ok) showToast(true,'✅ Sincronizzate '+json.synced+' lezioni');
      else showToast(false,json.error||'Errore sync');
    } catch(e) { showToast(false, e&&e.message||'Errore'); }
    setSyncing(false);
  };

  return React.createElement('div', null
    , toast && React.createElement('div', { style: { padding:'8px 12px', borderRadius:8, marginBottom:10, fontSize:13, fontFamily:"'Open Sans',sans-serif", background:toast.ok?C.greenBg:C.redBg, border:'1px solid '+(toast.ok?C.greenBorder:C.redBorder), color:toast.ok?C.green:C.red } }, toast.msg)
    , loading && React.createElement('div', { style:{color:C.textMuted,fontSize:13,fontFamily:"'Open Sans',sans-serif"} }, '⏳ Controllo connessione...')
    , !loading && status && status.connected && React.createElement('div', null
        , React.createElement('div', { style:{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:C.greenBg,border:'1px solid '+C.greenBorder,borderRadius:10,marginBottom:12} }
          , React.createElement('span',{style:{fontSize:20}},'📅')
          , React.createElement('div',{style:{flex:1}}
            , React.createElement('div',{style:{fontSize:13,fontWeight:700,color:C.green,fontFamily:"'Open Sans',sans-serif"}},'✅ Google Calendar connesso')
            , React.createElement('div',{style:{fontSize:11,color:C.textMuted,fontFamily:"'Open Sans',sans-serif",marginTop:2}},'Sincronizza automaticamente le tue lezioni')
          )
          , React.createElement('button',{onClick:handleDisconnect,style:{padding:'5px 12px',borderRadius:6,cursor:'pointer',border:'1px solid '+C.redBorder,background:C.redBg,color:C.red,fontSize:12,fontFamily:"'Open Sans',sans-serif"}},'Disconnetti')
        )
        , React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }
          , React.createElement('button', {
              onClick: function() { setShowConfig(!showConfig); },
              style: { padding: '9px 14px', borderRadius: 8, border: '1px solid '+(showConfig?C.tealBorder:C.border), background: showConfig?C.tealBg:C.bg, color: showConfig?C.teal:C.textMuted, cursor: 'pointer', fontSize: 13, fontFamily: "'Open Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 5 }
            }, '⚙️ Impostazioni')
          , React.createElement('button',{onClick:handleSyncAll,disabled:syncing,style:{padding:'9px 18px',borderRadius:8,border:'none',background:syncing?C.surface:C.teal,color:syncing?C.textMuted:'#fff',cursor:syncing?'wait':'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif"}},syncing?'⏳ Sincronizzazione...':'🔄 Sincronizza le mie lezioni')
        )
        , React.createElement('div',{style:{fontSize:11,color:C.textMuted,marginTop:8,fontFamily:"'Open Sans',sans-serif",lineHeight:1.6}},'💡 Solo le tue lezioni vengono sincronizzate su Google Calendar.')
        , showConfig && React.createElement('div', { style: { marginTop: 14, padding: 16, background: C.bg, border: '1px solid '+C.border, borderRadius: 10 } }
          , React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, fontFamily: "'Open Sans',sans-serif" } }, '🗓️ Calendario di destinazione per corso')
          , userId
            ? React.createElement(GcalCourseMapping, { userId: userId })
            : React.createElement('div', { style: { fontSize: 12, color: C.textDim, fontFamily: "'Open Sans',sans-serif" } }, '⏳ In attesa della connessione...')
        )
      )
    , !loading && (!status||!status.connected) && React.createElement('div', null
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:14,fontFamily:"'Open Sans',sans-serif",lineHeight:1.6}},'Connetti Google Calendar per sincronizzare automaticamente le tue lezioni.')
        , clientId
          ? React.createElement('button',{onClick:handleConnect,style:{padding:'10px 20px',borderRadius:8,border:'none',background:'#4285f4',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",display:'inline-flex',alignItems:'center',gap:8}}
              ,React.createElement('span',{style:{fontSize:16}},'📅'),'Connetti Google Calendar')
          : React.createElement('div',{style:{padding:'10px 14px',background:'#fef9c3',border:'1px solid #fde68a',borderRadius:8,fontSize:12,color:'#92400e',fontFamily:"'Open Sans',sans-serif",lineHeight:1.6}},'⚙️ Google Calendar non è ancora configurato. Contatta l\'amministratore per attivarlo dalle Impostazioni.')
      )
  );
};

console.log('[FM] app-gcal.js caricato ✓');

  } catch(err) {
    window.__BOOT_ERROR = window.__BOOT_ERROR || err;
    console.error('[FM] app-gcal.js errore:', err.message || err);
  }
})();

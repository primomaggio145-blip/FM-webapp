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
// 4. Imposta GOOGLE_CLIENT_ID_FRONTEND qui sotto con il tuo Client ID Google
// 5. Su Supabase → Edge Functions → Secrets aggiungi:
//      GOOGLE_CLIENT_ID     = <Client ID>
//      GOOGLE_CLIENT_SECRET = <Client Secret>
//      APP_URL              = https://primomaggio145-blip.github.io/FM-webapp/webapp.html
// ══════════════════════════════════════════════════════════════

(function() {
  try {

// ── Configurazione ────────────────────────────────────────────────────────────
const GCAL_EDGE = 'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/gcal-sync';

// ← Inserisci qui il tuo Google OAuth 2.0 Client ID
// Ottienilo da: console.cloud.google.com → Credenziali → OAuth 2.0 Client ID
const GOOGLE_CLIENT_ID_FRONTEND = '';

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
    if (!GOOGLE_CLIENT_ID_FRONTEND) {
      alert(
        'Per attivare Google Calendar:\n\n' +
        '1. Vai su console.cloud.google.com → Credenziali\n' +
        '2. Crea un OAuth 2.0 Client ID (tipo: Web Application)\n' +
        '3. Aggiungi come Authorized Redirect URI:\n   ' + WEBAPP_URL + '\n' +
        '4. Copia il Client ID e incollalo in app-gcal.js\n' +
        '   alla riga GOOGLE_CLIENT_ID_FRONTEND'
      );
      return;
    }
    // Redirect URI = la webapp stessa (riceve il code e lo manda all'Edge Function)
    const redirectUri = encodeURIComponent(WEBAPP_URL);
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events');
    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      '?client_id=' + GOOGLE_CLIENT_ID_FRONTEND +
      '&redirect_uri=' + redirectUri +
      '&response_type=code' +
      '&scope=' + scope +
      '&access_type=offline&prompt=consent';
    window.location.href = authUrl;
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
        , GOOGLE_CLIENT_ID_FRONTEND
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
          : React.createElement('div', {
              style: {
                padding: '12px 16px',
                background: '#fef9c3', border: '1px solid #fde68a',
                borderRadius: 8, fontSize: 12, color: '#92400e',
                lineHeight: 1.8, fontFamily: "'Open Sans',sans-serif"
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
                GCAL_EDGE)
            , React.createElement('br', null)
            , '4. Copia il Client ID e incollalo in '
            , React.createElement('code', { style: { fontSize: 11 } }, 'app-gcal.js')
            , ' alla riga '
            , React.createElement('code', { style: { fontSize: 11 } }, 'GOOGLE_CLIENT_ID_FRONTEND')
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

  const showToast = function(ok, msg) {
    setToast({ok:ok, msg:msg});
    setTimeout(function(){ setToast(null); }, 4000);
  };

  const checkStatus = React.useCallback(async function() {
    try {
      const sb = window.supabaseClient; if (!sb) { setLoading(false); return; }
      const { data:{session} } = await sb.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(GCAL_EDGE+'?action=status&user_id='+session.user.id,
        { headers: {'Authorization':'Bearer '+session.access_token} });
      setStatus(await res.json());
    } catch(e) {}
    setLoading(false);
  }, []);

  React.useEffect(function(){ checkStatus(); }, [checkStatus]);

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
    if (!GOOGLE_CLIENT_ID_FRONTEND) {
      alert('Inserisci il GOOGLE_CLIENT_ID_FRONTEND in app-gcal.js'); return;
    }
    const redirectUri = encodeURIComponent(WEBAPP_URL);
    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events');
    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+GOOGLE_CLIENT_ID_FRONTEND+'&redirect_uri='+redirectUri+'&response_type=code&scope='+scope+'&access_type=offline&prompt=consent';
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
        , React.createElement('button',{onClick:handleSyncAll,disabled:syncing,style:{padding:'9px 18px',borderRadius:8,border:'none',background:syncing?C.surface:C.teal,color:syncing?C.textMuted:'#fff',cursor:syncing?'wait':'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif"}},syncing?'⏳ Sincronizzazione...':'🔄 Sincronizza le mie lezioni')
        , React.createElement('div',{style:{fontSize:11,color:C.textMuted,marginTop:8,fontFamily:"'Open Sans',sans-serif",lineHeight:1.6}},'💡 Solo le tue lezioni vengono sincronizzate su Google Calendar.')
      )
    , !loading && (!status||!status.connected) && React.createElement('div', null
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:14,fontFamily:"'Open Sans',sans-serif",lineHeight:1.6}},'Connetti Google Calendar per sincronizzare automaticamente le tue lezioni.')
        , GOOGLE_CLIENT_ID_FRONTEND
          ? React.createElement('button',{onClick:handleConnect,style:{padding:'10px 20px',borderRadius:8,border:'none',background:'#4285f4',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",display:'inline-flex',alignItems:'center',gap:8}}
              ,React.createElement('span',{style:{fontSize:16}},'📅'),'Connetti Google Calendar')
          : React.createElement('div',{style:{padding:'10px 14px',background:'#fef9c3',border:'1px solid #fde68a',borderRadius:8,fontSize:12,color:'#92400e',fontFamily:"'Open Sans',sans-serif"}},'⚙️ Inserisci GOOGLE_CLIENT_ID_FRONTEND in app-gcal.js')
      )
  );
};

console.log('[FM] app-gcal.js caricato ✓');

  } catch(err) {
    window.__BOOT_ERROR = window.__BOOT_ERROR || err;
    console.error('[FM] app-gcal.js errore:', err.message || err);
  }
})();

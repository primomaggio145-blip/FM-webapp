(function() {
  try {
var _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN
function App() {
  // ── TUTTI GLI HOOK IN CIMA — mai dopo un return condizionale ──
  const [user,           setUser]           = useState(null);
  const [view,           setView]           = useState("dashboard");
  const [panKey,         setPanKey]         = useState(0);
  const [schermata,      setSchermata]      = useState("login");
  const _d = window.__FM_DATA__ || {};
  const [sharedStudents,       setSharedStudents]       = useState(_d.students   || INIT_STUDENTS);
  const [sharedCourses,        setSharedCourses]        = useState(_d.courses    || []);
  const [sharedDocenti,        setSharedDocenti]        = useState(_d.docenti    || INIT_DOCENTI_EXT);
  const [sharedLessons,        setSharedLessons]        = useState(_d.lessons    || INIT_LESSONS);
  const [sharedRepertorio,     setSharedRepertorio]     = useState(_d.brani      || INIT_BRANI);
  const [sharedConcerti,       setSharedConcerti]       = useState(_d.concerti   || INIT_CONCERTI);
  const [sharedAllegati,       setSharedAllegati]       = useState(_d.allegati   || []);
  const [sharedRichieste,      setSharedRichieste]      = useState([]);
  const [sharedNotifiche,      setSharedNotifiche]      = useState([]);
  const [sharedConfig,         setSharedConfig]         = useState(_d.config ? {...CONFIG_DEFAULT, ..._d.config} : CONFIG_DEFAULT);
  // Esponi config globalmente per componenti che non ricevono la prop (es. WeekCalSala)
  React.useEffect(() => { window.__FM_CONFIG__ = sharedConfig; }, [sharedConfig]);
  const [sharedQuickAction,    setSharedQuickAction]    = useState(null);
  const [sharedSpese,          setSharedSpese]          = useState(_d.spese      || INIT_SPESE);
  const [sharedAnniScolastici, setSharedAnniScolastici] = useState(_d.anniScolastici || INIT_ANNI_SCOLASTICI);
  const [sharedIscrizioniAnno, setSharedIscrizioniAnno] = useState(_d.iscrizioniAnno || []);
  React.useEffect(() => {
    window.__FM_DATA__ = {...(window.__FM_DATA__||{}), iscrizioniAnno: sharedIscrizioniAnno, anniScolastici: sharedAnniScolastici};
  }, [sharedIscrizioniAnno, sharedAnniScolastici]);
  const [sharedEntrate,         setSharedEntrate]         = useState(_d.entrate  || INIT_ENTRATE_QUOTE);
  // ── Stato globale per pannelli dashboard e ruolo simulazione ──
  const [sharedPanels,  setSharedPanels]  = useState({});
  const [sharedRuolo,   setSharedRuolo]   = useState("admin");
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  const [globalModal,        setGlobalModal]        = useState(null); // overlay top-level fuori da main-scroll animato
  const [recuperoScadutoModal, setRecuperoScadutoModal] = useState(null); // {lesson, onExtend, onDismiss}
  const [cambioOraModal,     setCambioOraModal]         = useState(null); // {lesson, onSave}
  const [adminRecuperoModal, setAdminRecuperoModal]     = useState(null); // {lesson}
  // ── Ripristina sessione Auth al refresh pagina + gestisci link invito ──────
  useEffect(()=>{
    if(!window.FM_AUTH) return;
    (async()=>{
      try {
        // Controlla se siamo arrivati da un link di invito/reset (hash nell'URL)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token') && hash.includes('type=invite')) {
          // Supabase ha già gestito il token e creato la sessione
          setSchermata("setpassword");
          // Pulisci l'URL
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }

        const session = await window.FM_AUTH.getSession();
        if(session?.user){
          const profilo = await window.FM_AUTH.getProfilo(session.user.id);
          if(profilo && profilo.stato!=='sospeso'){
            setUser({email:session.user.email, nome:profilo.nome, ruolo:profilo.ruolo, userId:session.user.id, docenteId:profilo.docente_id||null, allievoId:profilo.allievo_id||null});
            setSharedRuolo(profilo.ruolo||"admin");
            try{ window.__currentUserName__=profilo.nome||""; }catch(e){}
            setSchermata("app");
            // Carica richieste in attesa per le notifiche (admin)
            if ((profilo.ruolo||'admin')==='admin' && window.FM_AUTH.getRichieste) {
              try { const r = await window.FM_AUTH.getRichieste(); setSharedRichieste(r||[]); } catch(e){}
            }
            // Carica notifiche non lette — filtrate per ruolo/utente
            const sb0 = window.supabaseClient;
            if (sb0) {
              try {
                // Usa l'utente corrente se disponibile, altrimenti skip
                // (verrà caricato correttamente al login)
                const _cu = window.__currentUser__;
                if (_cu && _cu.ruolo) {
                  const _r0 = _cu.ruolo;
                  const _i0 = _cu.allievoId || _cu.docenteId || null;
                  const _n0 = _cu.nome || '';
                  const { data: nn } = await sb0.from('notifiche').select('*')
                    .eq('letto', false).eq('destinatario_ruolo', _r0)
                    .order('created_at', {ascending:false}).limit(50);
                  if (nn) {
                    let filtered = nn;
                    if (_r0 !== 'admin') {
                      filtered = nn.filter(function(n){
                        if(!n.destinatario_id && !n.destinatario_nome) return true;
                        if(_i0 && n.destinatario_id && String(n.destinatario_id)===String(_i0)) return true;
                        if(_n0 && n.destinatario_nome){const dn=(n.destinatario_nome||'').toLowerCase();const mn=_n0.toLowerCase();return dn===mn||dn.includes(mn)||mn.includes(dn);}
                        return false;
                      });
                    }
                    setSharedNotifiche(filtered);
                  }
                }
              } catch(e){}
              try {
                const { data: rr } = await sb0.from('richieste_recupero').select('*').order('created_at', {ascending:false}).limit(200);
                if (rr) window.__richiesteRecupero__ = rr;
              } catch(e){}
            }
          }
        }
      } catch(e){}
    })();
  },[]);
  // ───────────────────────────────────────────────────────────────

  // ── Sync corsi e statistiche → sito pubblico ───────────────────
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('fm_admin_data') || '{}');
      existing.corsi = sharedCourses.map(c => ({
        nome:    c.name,
        desc:    c.description || '',
        livelli: c.type === 'individuale' ? 'Tutti i livelli' : 'Base, Avanzato',
        foto:    ((existing.corsi || []).find(x => x.nome === c.name) || {}).foto || ''
      }));
      if (!existing.testi) existing.testi = {};
      existing.testi.stat_studenti = sharedStudents.length + '+';
      existing.testi.stat_docenti  = sharedDocenti.length  + '+';
      localStorage.setItem('fm_admin_data', JSON.stringify(existing));
    } catch(e) {}
  }, [sharedCourses, sharedStudents, sharedDocenti]);
  // ───────────────────────────────────────────────────────────────

  // ── Supabase: esponi stato + reload hook ──────────────────────
  useEffect(() => {
    // Aggiorna snapshot stato corrente (usato da fm_sync.js per il write-back)
    if (window.__FM_ON_STATE__) {
      window.__FM_ON_STATE__({
        students: sharedStudents, courses: sharedCourses, docenti: sharedDocenti,
        lessons: sharedLessons, brani: sharedRepertorio, spese: sharedSpese, entrate: sharedEntrate,
        concerti: sharedConcerti, allegati: sharedAllegati,
      });
    }
    // Espone docenti globalmente per recupero modal e altri componenti profondi
    window.__docenti__ = sharedDocenti;
    window.__unreadCount__ = (sharedNotifiche||[]).filter(n=>!n.letto).length;
  }, [sharedStudents, sharedCourses, sharedDocenti, sharedLessons, sharedRepertorio, sharedSpese, sharedEntrate, sharedConcerti, sharedAllegati]);

  useEffect(() => {
    // Hook che fm_sync.js chiama per iniettare aggiornamenti real-time nel React state
    window.__FM_RELOAD__ = function(data) {
      if (data.students)       setSharedStudents(data.students);
      if (data.courses)        setSharedCourses(data.courses);
      if (data.docenti)        setSharedDocenti(data.docenti);
      if (data.lessons)        setSharedLessons(data.lessons);
      if (data.brani)          setSharedRepertorio(data.brani);
      if (data.spese)          setSharedSpese(data.spese);
      if (data.entrate)        setSharedEntrate(data.entrate);
      if (data.concerti)       setSharedConcerti(data.concerti);
      if (data.allegati)       setSharedAllegati(data.allegati);
      if (data.richieste)      setSharedRichieste(data.richieste);
      if (data.config)          setSharedConfig(c => ({...CONFIG_DEFAULT, ...c, ...data.config}));
      if (data.anniScolastici !== undefined) setSharedAnniScolastici(data.anniScolastici || []);
      if (data.iscrizioniAnno !== undefined) setSharedIscrizioniAnno(data.iscrizioniAnno || []);
      if (data.dashboardPanels) setSharedPanels(p => ({...p, ...data.dashboardPanels}));
    };

    // ── Refresh completo da Supabase ─────────────────────────────────────────
    // Espone window.__FM_FORCE_REFRESH__ per trigger manuale da qualsiasi punto
    let _refreshing = false;
    window.__FM_FORCE_REFRESH__ = async function(silent) {
      if (_refreshing) return;
      _refreshing = true;
      if (!silent) {
        const t = document.getElementById('sync-toast');
        if (t) { t.textContent = '⟳ Aggiornamento…'; t.style.opacity = '1'; }
      }
      try {
        const sb = window.supabaseClient;
        if (!sb) return;
        const FA = window.FMAdapter;
        const todayISO = new Date().toISOString().split('T')[0];
        // Soglia: ultimi 24h per lezioni modificate/create (non tutto il DB)
        const threshold24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // ── Tabelle piccole: carica tutto (cambiano raramente) ───────────────
        const [
          { data: sS }, { data: sD }, { data: sC },
          { data: sB }, { data: sP }, { data: sQ }, { data: sEV },
          { data: sAL }, { data: sSALA }, { data: sCFG }, { data: sANNI },
          { data: sISCR }, { data: sCP },
        ] = await Promise.all([
          sb.from('studenti').select('*').order('nome'),
          sb.from('docenti').select('*').order('nome'),
          sb.from('corsi').select('*, corsi_docenti(docente_id)').order('nome'),
          sb.from('brani').select('*').order('titolo'),
          sb.from('spese').select('*').order('data', { ascending: false }),
          sb.from('quote').select('*').order('anno').order('mese'),
          sb.from('concerti').select('*').order('data', { ascending: false }),
          sb.from('allegati').select('*').order('created_at', { ascending: false }),
          sb.from('prenotazioni_sala').select('*').order('data').order('ora_inizio'),
          sb.from('sito_config').select('*'),
          sb.from('anni_scolastici').select('*').order('anno_inizio', { ascending: false }),
          sb.from('iscrizioni_anno').select('*'),
          sb.from('concerti_partecipanti').select('*'),
        ]);

        // ── Lezioni: SOLO oggi + modificate nelle ultime 24h ────────────────
        // Mantiene in memoria quelle più vecchie già caricate
        const [{ data: sLToday }, { data: sLRecent }] = await Promise.all([
          sb.from('lezioni').select('*').eq('data', todayISO),
          sb.from('lezioni').select('*').gt('updated_at', threshold24h).neq('data', todayISO),
        ]);
        const allFetchedL = [...(sLToday||[]), ...(sLRecent||[])];
        const fetchedIds  = new Set(allFetchedL.map(r => r.id));
        // Lezioni già in memoria che non sono state toccate → le teniamo
        const existingLessons = (window.__FM_DATA__ && window.__FM_DATA__.lessons) || [];
        const untouched = existingLessons.filter(l => !fetchedIds.has(l.id));

        const adaptL = (r) => {
          const allegatiAll = sAL || [];
          const allegati = allegatiAll.filter(a => a.lezione_id === r.id).map(a => ({
            id: a.id, fileName: a.file_name||'', fileUrl: a.file_url||null,
            fileType: a.file_type||'', descrizione: a.descrizione||'',
            corso: a.corso||'', lezioneId: a.lezione_id||null,
            allievoNome: a.allievo_nome||'', createdAt: a.created_at||null,
          }));
          return {
            id: r.id, date: r.data,
            hour: r.ora ? r.ora.slice(0,5) : '',
            student: r.student||'', tipo: r.tipo||'individuale',
            studentId: r.studente_id||null,
            instrument: r.strumento||r.instrument||'', teacher: r.teacher||'',
            room: r.room||'', topic: r.topic||'', attendance: r.attendance||'',
            recurrence: r.recurrence||'Nessuna', notes: r.notes||'',
            exercises: r.exercises||'', type: r.tipo||'individuale',
            linkUrl: r.link_url||'', inRecupero: r.in_recupero||false,
            recuperoScadenza: r.recupero_scadenza||null,
            durata: r.durata ? parseInt(r.durata) : (r.tipo==='collettivo'?60:r.tipo==='prova'?30:45),
            repertorioIds: (() => { try { return r.repertorio_ids ? JSON.parse(r.repertorio_ids) : []; } catch(e) { return []; } })(),
            allegati,
            courseId: r.corso_id||null, courseName: r.corso_nome||null,
            students: (() => { try { return r.students ? JSON.parse(r.students) : []; } catch(e) { return []; } })(),
          };
        };
        const sL = [...untouched, ...allFetchedL.map(adaptL)];

        const adaptA = r => ({
          id:r.id, lezioneId:r.lezione_id||null, allievoId:r.allievo_id||null,
          allievoNome:r.allievo_nome||null, corso:r.corso||null,
          descrizione:r.descrizione||null, fileUrl:r.file_url||null,
          fileName:r.file_name||null, fileType:r.file_type||null, createdAt:r.created_at||null,
        });
        const configFromDB = {};
        (sCFG || []).forEach(r => {
          try { configFromDB[r.chiave] = JSON.parse(r.valore); }
          catch(e) { configFromDB[r.chiave] = r.valore; }
        });
        // Estrai chiavi speciali da configFromDB (non sono campi config normali)
        const anniScolasticiDB = (sANNI||[]).map(r => ({
          id: r.id, label: r.label||`${r.anno_inizio}/${(r.anno_fine||(r.anno_inizio+1))}`,
          annoInizio: r.anno_inizio, annoFine: r.anno_fine||(r.anno_inizio+1),
          mesiAttivi: Array.isArray(r.mesi_attivi) ? r.mesi_attivi : [0,1,2,3,4,8,9,10,11],
          attivo: r.attivo||false, stato: r.stato, note: r.note||'',
        }));
        // annoInizioAttivo: usa l'anno con attivo=true come fonte di verità
        const annoAttivoFromDB = (sANNI||[]).find(r => r.attivo === true);
        if (annoAttivoFromDB) {
          configFromDB.annoInizioAttivo = annoAttivoFromDB.anno_inizio;
        } else if (configFromDB.annoInizioAttivo) {
          configFromDB.annoInizioAttivo = parseInt(configFromDB.annoInizioAttivo) || configFromDB.annoInizioAttivo;
        }
        if (configFromDB.anniScolastici) delete configFromDB.anniScolastici;
        const dashboardPanelsDB = (configFromDB.dashboardPanels && typeof configFromDB.dashboardPanels === 'object') ? configFromDB.dashboardPanels : null;
        if (dashboardPanelsDB) delete configFromDB.dashboardPanels;

        // Iscrizioni per anno scolastico
        const iscrizioniAnnoDB = (sISCR||[]).map(r => ({
          id: r.id, studentId: r.studente_id, annoInizio: r.anno_inizio,
          corsoId: r.corso_id||'', corsoNome: r.corso_nome||'',
          docenteId: r.docente_id||'', docenteNome: r.docente_nome||'',
          dataIscrizione: r.data_iscrizione||'', note: r.note||'',
        }));

        if (window.__FM_RELOAD__) {
          const reloadData = {
            students: (sS||[]).map(r => {
              const base = FA ? FA.studente(r) : r;
              const pj = (v,f=[]) => { if(!v) return f; if(Array.isArray(v)) return v; try { return JSON.parse(v); } catch(e) { return f; } };
              base.repertorio = pj(r.repertorio, []);
              base.extraInstruments = pj(r.extra_instruments, []);
              base.extraTeachers = pj(r.extra_teachers, {});
              return base;
            }),
            docenti:  (sD||[]).map(r => FA ? FA.docente(r) : r),
            courses:  (sC||[]).map(r => FA ? FA.corso(r) : r),
            lessons:  sL,
            brani:    (sB||[]).map(r => {
              const pj = (v,f=[]) => { if(!v) return f; if(Array.isArray(v)) return v; if(typeof v==='object') return v; try { return JSON.parse(v); } catch(e) { return f; } };
              let versioni = pj(r.versioni, []);
              if (versioni.length === 0) {
                const tonLeg = r.tonalita||r.tonality||'';
                const spLeg = pj(r.spartiti,[]); const fLeg = pj(r.files,[]);
                const lkLeg = r.link_backing ? [{url:r.link_backing,label:'Backing track'}] : [];
                if (tonLeg||spLeg.length||fLeg.length||lkLeg.length) versioni = [{tonalita:tonLeg,spartiti:spLeg,allegati:fLeg,link:lkLeg,allievi:[]}];
              }
              return { id:r.id, title:r.titolo||'', composer:r.compositore||'', tipo:r.tipo||'individuale', strumento:r.strumento||'', eventiIds:pj(r.eventi_ids,[]), versioni:versioni, note:r.note||'', lezioni:r.lezioni||0, periodo:r.periodo||'', difficulty:r.difficolta||'Intermedio' };
            }),
            spese:    (sP||[]).map(r => ({ id:String(r.id), docenteId:r.docente_id||null, data:r.data||'', mese:r.mese!=null?r.mese:new Date((r.data||'')+'T00:00:00').getMonth(), anno:r.anno||new Date().getFullYear(), importo:parseFloat(r.importo)||0, desc:r.desc||r.descrizione||'', nota:r.nota||'', metodo:r.metodo||'Bonifico', categoria:r.categoria||'altro' })),
            entrate:  (sQ||[]).map(r => ({ id:String(r.id), studentId:r.studente_id||null, studentName:r.studente_nome||'', importo:parseFloat(r.importo)||0, mese:r.mese, anno:r.anno, data:r.data_pagamento||'', metodo:r.metodo||'Contanti', categoria:'quota', desc:r.note||'', stato:r.stato||'attesa' })),
            concerti: (sEV||[]).map(r => {
              const pj = (v,f=[]) => { if(!v) return f; if(Array.isArray(v)) return v; if(typeof v==='object') return v; try { return JSON.parse(v); } catch(e) { return f; } };
              // Partecipanti: fonte di verità = tabella concerti_partecipanti (relazionale)
              const partecipantiDaTabella = (sCP||[])
                .filter(p => String(p.concerto_id) === String(r.id))
                .map(p => ({ studentId: p.studente_id, studentName: p.studente_nome||'', brani: p.brani||[] }));
              return { id:r.id, titolo:r.titolo||'', nome:r.titolo||'', data:r.data||'', luogo:r.luogo||'', tipo:r.tipo||'evento', stato:r.stato||'programmato', descrizione:r.descrizione||'', note:r.note||'', programma:pj(r.programma,[]), scaletta:pj(r.scaletta,[]), partecipanti: partecipantiDaTabella.length>0 ? partecipantiDaTabella : pj(r.partecipanti,[]), prenotazioni:pj(r.prenotazioni,[]), biglietto:r.biglietto||false, prezzoBiglietto:parseFloat(r.prezzo_biglietto)||0, ora:r.ora||'', capienza:r.capienza||null };
            }),
            allegati: (sAL||[]).map(adaptA),
            config:   Object.keys(configFromDB).length > 0 ? configFromDB : null,
            anniScolastici:  anniScolasticiDB,
            iscrizioniAnno:  iscrizioniAnnoDB,
            dashboardPanels: dashboardPanelsDB,
          };
          if (window.__FM_UPDATE_PREV__) window.__FM_UPDATE_PREV__(reloadData);
          window.__FM_RELOAD__(reloadData);
        }
        // Notifiche
        try {
          const _u = window.__currentUser__;
          const _ruolo = (_u && _u.ruolo) || 'admin';
          const _id = (_u && (_u.allievoId || _u.docenteId)) || null;
          const _nome = (_u && _u.nome) || '';
          let nq = sb.from('notifiche').select('*').eq('letto', false).eq('destinatario_ruolo', _ruolo).order('created_at', {ascending:false}).limit(50);
          const { data: nn } = await nq;
          if (nn) {
            let filtered = nn;
            if (_ruolo !== 'admin') {
              filtered = nn.filter(function(n){
                if(!n.destinatario_id && !n.destinatario_nome) return true;
                if(_id && n.destinatario_id && String(n.destinatario_id)===String(_id)) return true;
                if(_nome && n.destinatario_nome){const dn=(n.destinatario_nome||'').toLowerCase();const mn=_nome.toLowerCase();return dn===mn||dn.includes(mn)||mn.includes(dn);}
                return false;
              });
            }
            setSharedNotifiche(filtered);
          }
        } catch(e) {}
        // Richieste recupero
        try {
          const { data: rr } = await sb.from('richieste_recupero').select('*').order('created_at', {ascending:false}).limit(200);
          if (rr) window.__richiesteRecupero__ = rr;
        } catch(e) {}
        if (!silent) {
          const t = document.getElementById('sync-toast');
          if (t) {
            const nLezioni = allFetchedL.length;
            t.textContent = `✓ Aggiornati ${nLezioni} lezioni oggi/recenti`;
            t.style.opacity = '1';
            setTimeout(() => { t.style.opacity = '0'; }, 2500);
          }
        }
      } catch(e) {
        console.warn('[FM] Refresh error:', e);
        if (!silent) {
          const t = document.getElementById('sync-toast');
          if (t) { t.textContent = '⚠ Errore aggiornamento'; t.style.opacity = '1'; setTimeout(() => { t.style.opacity = '0'; }, 3000); }
        }
      } finally {
        _refreshing = false;
      }
    };

    // ── Carica notifiche_config al boot (per il reminder checker) ────────────
    (async function() {
      try {
        const sb = window.supabaseClient;
        if (!sb) return;
        const { data } = await sb.from('notifiche_config').select('*');
        if (data && data.length > 0) {
          const map = {};
          data.forEach(r => { map[r.id] = { attivo: r.attivo !== false, anticipo_min: r.anticipo_min ?? 60 }; });
          window.__FM_NOTIFICHE_CONFIG__ = map;
          console.log('[FM] notifiche_config caricate:', Object.keys(map));
        }
      } catch(e) { console.warn('[FM] notifiche_config load error:', e?.message); }
    })();

    // ── Polling leggero ogni 45s: solo dati del giorno + notifiche ────────────
    // Il refresh COMPLETO (tutti i record) rimane solo sul pulsante manuale ⟳
    let _polling = false;
    window.__FM_POLL_TODAY__ = async function() {
      if (_polling) return;
      _polling = true;
      try {
        const sb = window.supabaseClient;
        if (!sb) return;
        const todayISO = new Date().toISOString().split('T')[0];
        // Soglia "recente": tutto ciò che è stato modificato negli ultimi 10 minuti
        const recentThreshold = new Date(Date.now() - 10 * 60 * 1000).toISOString();

        // 1. Lezioni di OGGI + lezioni modificate di recente (nuove ricorrenti, nuove prove, modifiche stato)
        //    Due query leggere invece di scaricare tutto il DB
        const [{ data: sLToday }, { data: sLRecent }] = await Promise.all([
          sb.from('lezioni').select('*').eq('data', todayISO),
          sb.from('lezioni').select('*').gt('updated_at', recentThreshold).neq('data', todayISO),
        ]);

        const allFetched = [...(sLToday||[]), ...(sLRecent||[])];

        if (allFetched.length > 0 && window.__FM_RELOAD__) {
          const existingLessons = (window.__FM_DATA__ && window.__FM_DATA__.lessons) || [];
          const fetchedIds = new Set(allFetched.map(function(r){ return r.id; }));
          // Mantieni le lezioni non toccate da questo poll
          const untouched = existingLessons.filter(function(l){ return !fetchedIds.has(l.id); });
          const adaptL = function(r) {
            return {
              id: r.id, date: r.data, hour: r.ora ? r.ora.slice(0,5) : '',
              student: r.student||'', tipo: r.tipo||'individuale',
              studentId: r.studente_id||null, instrument: r.strumento||r.instrument||'',
              teacher: r.teacher||'', room: r.room||'', topic: r.topic||'',
              attendance: r.attendance||'', recurrence: r.recurrence||'Nessuna',
              notes: r.notes||'', type: r.tipo||'individuale',
              linkUrl: r.link_url||'', inRecupero: r.in_recupero||false,
              recuperoScadenza: r.recupero_scadenza||null,
              durata: r.durata ? parseInt(r.durata) : (r.tipo==='collettivo'?60:45),
              repertorioIds: (function(){ try{return r.repertorio_ids?JSON.parse(r.repertorio_ids):[];}catch(e){return [];} })(),
              allegati: [],
              students: (function(){ try{return r.students?JSON.parse(r.students):[];}catch(e){return [];} })(),
              courseId: r.corso_id||null, courseName: r.corso_nome||null,
              notesRecupero: r.notes_recupero||'',
            };
          };
          const mergedLessons = [...untouched, ...allFetched.map(adaptL)];
          if (window.__FM_UPDATE_PREV__) window.__FM_UPDATE_PREV__({ lessons: mergedLessons });
          window.__FM_RELOAD__({ lessons: mergedLessons });
        }

        // 2. Notifiche non lette — filtrate per utente corrente
        try {
          const _pu = window.__currentUser__;
          const _pr = (_pu && _pu.ruolo) || 'admin';
          const _pi = (_pu && (_pu.allievoId || _pu.docenteId)) || null;
          const _pn = (_pu && _pu.nome) || '';
          const { data: nn } = await sb.from('notifiche').select('*')
            .eq('letto', false).eq('destinatario_ruolo', _pr)
            .order('created_at', {ascending:false}).limit(50);
          if (nn) {
            let filtered = nn;
            if (_pr !== 'admin') {
              filtered = nn.filter(function(n){
                if(!n.destinatario_id && !n.destinatario_nome) return true;
                if(_pi && n.destinatario_id && String(n.destinatario_id)===String(_pi)) return true;
                if(_pn && n.destinatario_nome){const dn=(n.destinatario_nome||'').toLowerCase();const mn=_pn.toLowerCase();return dn===mn||dn.includes(mn)||mn.includes(dn);}
                return false;
              });
            }
            setSharedNotifiche(filtered);
          }
        } catch(e) {}

        // 3. Richieste recupero recenti
        const { data: rr } = await sb.from('richieste_recupero').select('*')
          .order('created_at', {ascending:false}).limit(100);
        if (rr) window.__richiesteRecupero__ = rr;

        // 4. Auto-marca recuperi scaduti come ASSENTE
        // Lezioni con inRecupero=true e recuperoScadenza < oggi → assente (così il docente viene pagato)
        try {
          const todayISO2 = new Date().toISOString().split('T')[0];
          const { data: scaduti } = await sb.from('lezioni')
            .select('id,student,teacher,data')
            .eq('in_recupero', true)
            .lt('recupero_scadenza', todayISO2)
            .is('attendance', null);  // solo quelle senza presenza ancora
          if (scaduti && scaduti.length > 0) {
            console.log('[FM] Recuperi scaduti da marcare come assente:', scaduti.length);
            // Aggiorna in batch
            const ids = scaduti.map(function(l){ return l.id; });
            await sb.from('lezioni').update({
              attendance: 'assente',
              in_recupero: false,
              recupero_scadenza: null,
            }).in('id', ids);
            // Aggiorna React state
            if (window.__FM_RELOAD__) {
              const allLessons = (window.__FM_DATA__ && window.__FM_DATA__.lessons) || [];
              const updated = allLessons.map(function(l) {
                if (ids.includes(l.id)) {
                  return { ...l, attendance: 'assente', inRecupero: false, recuperoScadenza: null };
                }
                return l;
              });
              if (window.__FM_UPDATE_PREV__) window.__FM_UPDATE_PREV__({ lessons: updated });
              window.__FM_RELOAD__({ lessons: updated });
            }
          }
        } catch(eRec) {
          console.warn('[FM] Auto-mark recuperi error:', eRec?.message);
        }

      } catch(e) {
        console.warn('[FM] Poll today error:', e);
      } finally {
        _polling = false;
      }
    };

    const _pollInterval = setInterval(function() {
      // Poll adattivo: ogni 60s durante l'orario scolastico (8-20), ogni 5 minuti di notte
      const h = new Date().getHours();
      const isScoolHours = h >= 8 && h < 20;
      if (!isScoolHours) {
        // Di notte, esegui solo ogni 5 minuti (ogni 5° tick)
        _pollNightCounter = (_pollNightCounter||0) + 1;
        if (_pollNightCounter < 5) return;
        _pollNightCounter = 0;
      }
      window.__FM_POLL_TODAY__ && window.__FM_POLL_TODAY__();
      // ── Reminder lezioni 1h prima ────────────────────────────────────────
      window.__FM_CHECK_LESSON_REMINDER__ && window.__FM_CHECK_LESSON_REMINDER__();
    }, 60000);
    var _pollNightCounter = 0;

    // ── Reminder lezioni: controlla ogni minuto se c'è una lezione tra 55-65 min ──
    // Prima chiamata dopo 5 secondi (per dare tempo al DB di caricare le lezioni)
    setTimeout(function() {
      window.__FM_CHECK_LESSON_REMINDER__ && window.__FM_CHECK_LESSON_REMINDER__();
    }, 5000);
    const _reminderSent = new Set(); // evita notifiche doppie per la stessa lezione
    window.__FM_CHECK_LESSON_REMINDER__ = function() {
      const nowMs  = Date.now();
      const nowStr = new Date().toISOString().split('T')[0];
      const lessons = (window.__FM_DATA__ && window.__FM_DATA__.lessons) || [];
      const curUser = window.__currentUser__;
      if (!curUser) return;

      lessons.forEach(function(l) {
        if (l.date !== nowStr) return;
        if (l.tipo === 'sala_prove') return;
        // Controlla se il tipo di notifica è abilitato
        const cfgKey   = isColl(l) ? 'lezione_collettiva' : 'lezione_individuale';
        const notifCfg = (window.__FM_NOTIFICHE_CONFIG__ || {})[cfgKey];
        if (notifCfg && notifCfg.attivo === false) return;
        const anticipoMin = (notifCfg && notifCfg.anticipo_min != null) ? notifCfg.anticipo_min : 60;
        const marginLow   = anticipoMin - 5;
        const marginHigh  = anticipoMin + 5;
        // Orario lezione
        const hhmmParts = (l.hour||'00:00').split(':').map(Number);
        const hh = hhmmParts[0] || 0;
        const mm = hhmmParts[1] || 0;
        const todayMid = new Date(); todayMid.setHours(0,0,0,0);
        const lessonMs = todayMid.getTime() + hh*3600000 + mm*60000;
        const diffMin  = (lessonMs - nowMs) / 60000;
        // Finestra configurabile attorno all'anticipo scelto (±5 min)
        if (diffMin < marginLow || diffMin > marginHigh) return;
        const key = l.id + '_' + nowStr;
        if (_reminderSent.has(key)) return;

        // Filtra per utente corrente
        const ruolo = curUser.ruolo || 'admin';
        if (ruolo === 'allievo') {
          const myId   = curUser.allievoId;
          const myNome = (curUser.nome||'').toLowerCase();
          const match  = (myId && String(l.studentId) === String(myId))
                      || (myNome && (l.student||'').toLowerCase().includes(myNome));
          if (!match) return;
        } else if (ruolo === 'docente') {
          const myNome = (curUser.nome||'').toLowerCase();
          if (!(l.teacher||'').toLowerCase().includes(myNome)) return;
        }
        // admin vede tutte

        _reminderSent.add(key);
        const titolo  = `⏰ Lezione tra 1 ora`;
        const testo   = (l.tipo==='collettivo'
          ? `${l.courseName||'Lezione collettiva'} alle ${l.hour}`
          : `${l.instrument||'Lezione'} con ${l.teacher||''} alle ${l.hour}`);

        // PWA: notifica push nativa
        if (IS_PWA && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(function(reg) {
              reg.showNotification(titolo, {
                body:    testo,
                icon:    '/FM-webapp/icons/icon-192.png',
                badge:   '/FM-webapp/icons/icon-192.png',
                tag:     key,
                vibrate: [200, 100, 200],
              });
            }).catch(function() {
              new Notification(titolo, { body: testo, icon: '/FM-webapp/icons/icon-192.png' });
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function(p) {
              if (p === 'granted') {
                new Notification(titolo, { body: testo, icon: '/FM-webapp/icons/icon-192.png' });
              }
            });
          }
        } else {
          // Desktop: banner a video stile Google Calendar
          var banner = document.createElement('div');
          banner.style.cssText = [
            'position:fixed','top:20px','right:20px','z-index:99999',
            'background:#fff','border:1px solid #e2e8f0','border-radius:12px',
            'box-shadow:0 8px 32px rgba(0,0,0,0.18)','padding:16px 20px',
            'display:flex','align-items:flex-start','gap:12px','max-width:320px',
            'font-family:Open Sans,sans-serif','animation:slideIn 0.3s ease',
          ].join(';');
          banner.innerHTML = `
            <div style="width:36px;height:36px;border-radius:10px;background:#fff7ed;
              border:1px solid #fed7aa;display:flex;align-items:center;
              justify-content:center;font-size:18px;flex-shrink:0">⏰</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:3px">
                ${titolo}</div>
              <div style="font-size:12px;color:#64748b;line-height:1.4">${testo}</div>
              <button onclick="this.closest('[data-fm-reminder]').remove()"
                style="margin-top:8px;font-size:11px;color:#f97316;background:none;
                  border:none;cursor:pointer;padding:0;font-family:inherit;font-weight:600">
                Chiudi
              </button>
            </div>
            <button onclick="this.closest('[data-fm-reminder]').remove()"
              style="background:none;border:none;cursor:pointer;color:#94a3b8;
                font-size:18px;line-height:1;padding:0;flex-shrink:0">×</button>
          `;
          banner.setAttribute('data-fm-reminder', key);
          document.body.appendChild(banner);
          // Auto-chiudi dopo 30 secondi
          setTimeout(function() { if (banner.parentNode) banner.remove(); }, 30000);
        }
      });
    };

    // ── beforeunload: avvisa sempre quando l'utente prova a uscire ──────────
    const handleBeforeUnload = (e) => {
      // Mostra sempre il dialog nativo del browser quando si è loggati
      e.preventDefault();
      e.returnValue = ''; // stringa vuota = il browser usa il suo testo standard
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Overlay globale
    window.__FM_SHOW_MODAL__ = (element) => setGlobalModal(element);
    window.__FM_HIDE_MODAL__ = ()        => setGlobalModal(null);
    window.__FM_SHOW_RECUPERO_SCADUTO__ = (data) => setRecuperoScadutoModal(data);
    window.__FM_SHOW_CAMBIO_ORA__ = (data) => setCambioOraModal(data);
    window.__FM_SHOW_ADMIN_RECUPERO__ = (lesson) => setAdminRecuperoModal({ lesson });
    return () => {
      window.__FM_RELOAD__ = null;
      window.__FM_FORCE_REFRESH__ = null;
      window.__FM_POLL_TODAY__ = null;
      window.__FM_UPDATE_PREV__ = null;
      window.__FM_SHOW_MODAL__ = null;
      window.__FM_HIDE_MODAL__ = null;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(_pollInterval);
    };
  }, []);
  // ─────────────────────────────────────────────────────────────

  const cambiaSchermata = (s) => { setSchermata(s); setPanKey(p=>p+1); };

  // ── SCHERMATA AUTH ──
  if (!user) {
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10745}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",display:"flex",background:C.bg,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10746}}
          , React.createElement('div', { className: "login-left-panel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10747}}, React.createElement(PanelloSinistra, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10747}}))
          , React.createElement('div', { style: {flex:1,display:"flex",alignItems:"center",justifyContent:"center",
            padding:"40px 24px",overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10748}}
            , React.createElement('div', { key: panKey, style: {width:"100%",maxWidth:400,padding:"0 4px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10750}}
              , schermata==="login" && (
                React.createElement(FormLogin, {
                  onSuccess: u=>{
                    setUser(u);setSharedRuolo(u.ruolo||"admin");setView(u.ruolo==="band"?"sala_prove":"dashboard");
                    try{window.__currentUserName__=u.nome||"";}catch(e){};
                    if(u.ruolo==="admin"&&window.FM_AUTH&&window.FM_AUTH.getRichieste){window.FM_AUTH.getRichieste().then(r=>setSharedRichieste(r||[])).catch(()=>{});}
                    // Carica notifiche non lette al login — filtrate per ruolo/utente
                    const sbLogin = window.supabaseClient;
                    if(sbLogin){
                      const ruoloLogin = u.ruolo || 'admin';
                      const idLogin = u.allievoId || u.docenteId || null;
                      const nomeLogin = u.nome || '';
                      sbLogin.from('notifiche').select('*').eq('letto',false).eq('destinatario_ruolo', ruoloLogin).order('created_at',{ascending:false}).limit(50).then(function(r){
                        if(r.data){
                          let nn = r.data;
                          if(ruoloLogin !== 'admin'){
                            nn = r.data.filter(function(n){
                              if(!n.destinatario_id && !n.destinatario_nome) return true;
                              if(idLogin && n.destinatario_id && String(n.destinatario_id)===String(idLogin)) return true;
                              if(nomeLogin && n.destinatario_nome){
                                const dn=(n.destinatario_nome||'').toLowerCase().trim();
                                const mn=nomeLogin.toLowerCase().trim();
                                return dn===mn||dn.includes(mn)||mn.includes(dn);
                              }
                              return false;
                            });
                          }
                          setSharedNotifiche(nn);
                        }
                      });
                    }
                  },
                  onRegistrazione: ()=>cambiaSchermata("register"),
                  onRecupero: ()=>cambiaSchermata("recover"),
                  onBand: ()=>cambiaSchermata("band"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10752}}
                )
              )
              , schermata==="register" && React.createElement(FormRegistrazione, { onBack: ()=>cambiaSchermata("login"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10758}})
              , schermata==="band"     && React.createElement(FormRegistrazioneBand, { onBack: ()=>cambiaSchermata("login") })
              , schermata==="recover"  && React.createElement(FormRecupero, { onBack: ()=>cambiaSchermata("login"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10759}})
              , schermata==="setpassword" && React.createElement(FormSetPassword, {
                  onSuccess: async () => {
                    // Dopo aver impostato la password, carica il profilo e fa login
                    try {
                      const sb = window.supabaseClient;
                      const { data: { session } } = await sb.auth.getSession();
                      if (session?.user) {
                        const profilo = await window.FM_AUTH.getProfilo(session.user.id);
                        if (profilo) {
                          // Aggiorna profilo da invitato ad attivo
                          await sb.from('profili').update({ stato: 'attivo' }).eq('id', session.user.id);
                          setUser({email:session.user.email, nome:profilo.nome, ruolo:profilo.ruolo, userId:session.user.id, docenteId:profilo.docente_id||null, allievoId:profilo.allievo_id||null});
                          setSharedRuolo(profilo.ruolo||"admin");
                          try{ window.__currentUserName__=profilo.nome||""; }catch(e){}
                          setSchermata("app");
                        }
                      }
                    } catch(e) { cambiaSchermata("login"); }
                  }
                })
            )
          )
        )
      )
    );
  }

  // ── WEBAPP PRINCIPALE ──
  // Render della vista corrente — NON usare un oggetto views{} perché ricrea i componenti
  // ad ogni render di App (ogni cambio stato), causando il reset dei setInterval interni
  const renderCurrentView = () => {
    switch(view) {
      case 'dashboard':   return React.createElement(DashboardView, { appUser: user, onNavigate: setView, config: sharedConfig, setConfig: setSharedConfig, anniScolastici: sharedAnniScolastici, setAnniScolastici: setSharedAnniScolastici, students: sharedStudents, entrate: sharedEntrate, setEntrate: setSharedEntrate, spese: sharedSpese, docenti: sharedDocenti, lessons: sharedLessons, concerti: sharedConcerti, richieste: sharedRichieste, notifiche: sharedNotifiche, panels: sharedPanels, setPanels: setSharedPanels, onQuickAction: (action)=>setSharedQuickAction(action)});
      case 'allievi':     return React.createElement(AllieviView, { students: sharedStudents, setStudents: setSharedStudents, courses: sharedCourses, setCourses: setSharedCourses, lessons: sharedLessons, entrate: sharedEntrate, setEntrate: setSharedEntrate, annoInizioAttivo: sharedConfig.annoInizioAttivo, config: sharedConfig, setConfig: setSharedConfig, docenti: sharedDocenti, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user, iscrizioniAnno: sharedIscrizioniAnno, setIscrizioniAnno: setSharedIscrizioniAnno, anniScolastici: sharedAnniScolastici});
      case 'docenti':     return React.createElement(DocentiView, { students: sharedStudents, lessons: sharedLessons, docenti: sharedDocenti, setDocenti: setSharedDocenti, courses: sharedCourses, userRuolo: user?.ruolo||"admin", appUser: user, annoInizioAttivo: sharedConfig.annoInizioAttivo, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), iscrizioniAnno: sharedIscrizioniAnno, anniScolastici: sharedAnniScolastici});
      case 'corsi':       return React.createElement(CorsiView, { courses: sharedCourses, setCourses: setSharedCourses, students: sharedStudents, setStudents: setSharedStudents, docenti: sharedDocenti, userRuolo: user?.ruolo||"admin", appUser: user, iscrizioniAnno: sharedIscrizioniAnno, annoInizioAttivo: sharedConfig.annoInizioAttivo, anniScolastici: sharedAnniScolastici});
      case 'calendario':  return React.createElement(CalendarioView, { lessons: sharedLessons, setLessons: setSharedLessons, courses: sharedCourses, students: sharedStudents, setStudents: setSharedStudents, docenti: sharedDocenti, repertorio: sharedRepertorio, setRepertorio: setSharedRepertorio, allegati: sharedAllegati, setAllegati: setSharedAllegati, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user, config: sharedConfig});
      case 'contabilita': return React.createElement(ContabilitaView, { students: sharedStudents, entrate: sharedEntrate, setEntrate: setSharedEntrate, spese: sharedSpese, setSpese: setSharedSpese, config: sharedConfig, setConfig: setSharedConfig, docenti: sharedDocenti, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user});
      case 'repertorio':  return React.createElement(RepertorioView, { brani: sharedRepertorio, setBrani: setSharedRepertorio, students: sharedStudents, lessons: sharedLessons, docenti: sharedDocenti, concerti: sharedConcerti, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user});
      case 'allegati':    return React.createElement(AllegatiView, { allegati: sharedAllegati, setAllegati: setSharedAllegati, lessons: sharedLessons, students: sharedStudents, courses: sharedCourses, brani: sharedRepertorio, setBrani: setSharedRepertorio, userRuolo: user?.ruolo||'admin', appUser: user});
      case 'biblioteca':  return React.createElement(BibliotecaView, { userRuolo: user?.ruolo||"admin", appUser: user});
      case 'concerti':    return React.createElement(ConcertiView, { students: sharedStudents, brani: sharedRepertorio, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", concerti: sharedConcerti, setConcerti: setSharedConcerti, docenti: sharedDocenti});
      case 'utenti':      return (user?.ruolo||"admin")==="admin" ? React.createElement(UtentiView, { students: sharedStudents, docenti: sharedDocenti}) : null;
      case 'impostazioni':return React.createElement(ImpostazioniView, { config: sharedConfig, setConfig: setSharedConfig, panels: sharedPanels, setPanels: setSharedPanels, ruolo: sharedRuolo, setRuolo: setSharedRuolo, anniScolastici: sharedAnniScolastici, setAnniScolastici: setSharedAnniScolastici, setIscrizioniAnno: setSharedIscrizioniAnno});
      case 'schedaScuola':return React.createElement(SchedaScuolaView, { config: sharedConfig});
      case 'modulistica': return React.createElement(ModulisticaView, {});
      case 'messaggi':            return React.createElement(MessaggiView, { appUser: user, ruolo: user?.ruolo||'admin', students: sharedStudents, docenti: sharedDocenti });
      case 'notifiche':          return React.createElement(NotificheView, { notifiche: sharedNotifiche, setNotifiche: setSharedNotifiche, ruolo: user?.ruolo||"admin", appUser: user, lessons: sharedLessons, students: sharedStudents, richieste: sharedRichieste});
      case 'notifiche_settings': return React.createElement(NotificheSettingsView, { ruolo: user?.ruolo||"admin" });
      case 'reminders':   return React.createElement(RemindersView, { ruolo: user?.ruolo||"admin" });
      case 'sala_prove':  return React.createElement(SalaProveStandaloneView, { appUser: user, userRuolo: user?.ruolo||"band", lessons: sharedLessons });
      default: return null;
    }
  };

  // Logout con controllo notifiche non lette (include notifiche live calcolate in memoria)
  const handleLogout = async () => {
    const unreadDB   = (sharedNotifiche||[]).filter(n=>!n.letto).length;
    const unreadLive = window.__FM_NOTIF_COUNT__ || 0;
    const unread     = Math.max(unreadDB, unreadLive);
    if (unread > 0) {
      const ok = window.confirm(`Hai ${unread} notific${unread===1?'a':'he'} non lett${unread===1?'a':'e'}.\nVuoi leggerle prima di uscire?`);
      if (ok) { setView("notifiche"); return; }
    }
    try { if(window.FM_AUTH) await window.FM_AUTH.signOut(); } catch(e) {}
    setUser(null); setSharedRuolo("admin"); setView("dashboard");
    setSchermata("login"); setPanKey(p=>p+1);
    try{window.__currentUserName__="";}catch(e){}
    window.__FM_NOTIF_COUNT__ = 0;
  };

  // Esci senza fare signOut — la sessione rimane attiva per le notifiche PWA
  // La prossima apertura dell'app riprende automaticamente la sessione
  const handleEsciSenzaLogout = () => {
    if (IS_PWA) {
      // In PWA: minimizza tornando alla home dello smartphone
      window.history.back();
    } else {
      // Su browser desktop: chiude il tab se possibile, altrimenti avvisa
      const closed = window.close();
      if (closed === false || closed === undefined) {
        window.alert('Puoi chiudere questo tab manualmente (Ctrl+W / Cmd+W).\nLa sessione rimarrà attiva — al prossimo accesso entrerai direttamente.');
      }
    }
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10785}}, G)
      , React.createElement('div', { style: {display:"flex",height:"100dvh",overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10786}}
        , React.createElement(Sidebar, { current: view, setView: setView, user: user, onLogout: handleLogout, onEsciSenzaLogout: handleEsciSenzaLogout, settingsDrawerOpen: false, onSettingsOpen: ()=>{}, currentRuolo: sharedRuolo, onQuickAction: (action)=>setSharedQuickAction(action), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10787}})
        , React.createElement('div', { key: view, className: "main-scroll", style: {flex:1,overflow:"auto",background:C.bg,animation:"fadeIn 0.25s ease",
          paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 4px)",minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10788}}
          , renderCurrentView()
        )
      )
      /* ─── Global Modal Slot ───────────────────────────────────────────────────
         Renderizzato come fratello del div principale, FUORI da main-scroll.
         main-scroll ha animation:"fadeIn" che crea un compositing layer:
         i position:fixed dentro vengono trappola da esso. Qui siamo nel Fragment
         root, quindi position:fixed si aggancia al viewport come previsto.  */
      , globalModal
      /* Modal recupero scaduto — solo admin, position:fixed fuori da main-scroll */
      , recuperoScadutoModal && React.createElement(RecuperoScadutoModal, {
          lesson: recuperoScadutoModal.lesson,
          onExtend: recuperoScadutoModal.onExtend,
          onDismiss: () => setRecuperoScadutoModal(null),
          setLessons: setSharedLessons,
        })
      , cambioOraModal && React.createElement(CambioOraModal, {
          lesson: cambioOraModal.lesson,
          onSave: (updatedLesson) => {
            setSharedLessons(p => p.map(l => l.id === updatedLesson.id ? {...l, ...updatedLesson} : l));
            if (cambioOraModal.onSave) cambioOraModal.onSave(updatedLesson);
          },
          onDismiss: () => setCambioOraModal(null),
        })
      , adminRecuperoModal && React.createElement(AdminRecuperoModal, {
          lesson: adminRecuperoModal.lesson,
          setLessons: setSharedLessons,
          onDismiss: () => setAdminRecuperoModal(null),
        })
    )
  );
}


// ─── MODAL RECUPERO SCADUTO (solo admin) ──────────────────────────────────────
// ─── MODAL CAMBIO ORA ─────────────────────────────────────────────────────────
// Aperto quando si seleziona "Cambio ora" su una lezione ricorrente.
// Permette di modificare data e orario della lezione CORRENTE,
// mentre la prossima lezione ricorrente viene già creata dall'orario originale.
const CambioOraModal = ({ lesson, onSave, onDismiss }) => {
  const [nuovaData, setNuovaData] = useState(lesson.date || '');
  const [nuoraOra,  setNuovaOra]  = useState(lesson.hour || '');
  const [saving, setSaving] = useState(false);

  const dataOrig = lesson.date
    ? new Date(lesson.date+'T00:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})
    : '—';

  const handleSalva = async () => {
    if (!nuovaData || !nuoraOra) return;
    setSaving(true);
    const sb = window.supabaseClient;
    if (sb) {
      await sb.from('lezioni').update({
        data: nuovaData,
        ora:  nuoraOra + ':00',
      }).eq('id', lesson.id);
    }
    onSave({ ...lesson, date: nuovaData, hour: nuoraOra });
    setSaving(false);
    onDismiss();
  };

  return React.createElement(React.Fragment, null
    , React.createElement('div', {
        onClick: onDismiss,
        style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(3px)'}
      })
    , React.createElement('div', {
        style:{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
          zIndex:9999,background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,
          width:420,maxWidth:'calc(100vw - 32px)',boxShadow:'0 20px 60px rgba(0,0,0,0.4)',
          fontFamily:"'Open Sans',sans-serif"}
      }
      // Header viola
      , React.createElement('div', {style:{background:'rgba(139,92,246,0.08)',borderBottom:`1px solid rgba(139,92,246,0.25)`,borderRadius:'16px 16px 0 0',padding:'18px 24px',display:'flex',alignItems:'center',gap:12}}
        , React.createElement('div', {style:{width:36,height:36,borderRadius:10,background:'rgba(139,92,246,0.12)',border:'1px solid rgba(139,92,246,0.3)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
          , React.createElement(Ic,{n:'clock',size:18,stroke:'#7c3aed'})
        )
        , React.createElement('div', null
          , React.createElement('div', {style:{fontSize:15,fontWeight:700,color:'#7c3aed'}}, '🔄 Cambio ora')
          , React.createElement('div', {style:{fontSize:12,color:C.textDim,marginTop:2}}, 'Modifica giorno/orario lezione corrente')
        )
      )
      // Body
      , React.createElement('div', {style:{padding:'20px 24px',display:'flex',flexDirection:'column',gap:16}}
        , React.createElement('div', {style:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 16px'}}
          , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginBottom:2}}, 'Lezione originale')
          , React.createElement('div', {style:{fontSize:13,fontWeight:600}}, lesson.student || lesson.courseName || '—')
          , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginTop:2}},
              '📅 ', dataOrig, ' · 🕐 ', lesson.hour||'—')
        )
        , React.createElement('div', {style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}
          , React.createElement('div', null
            , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Nuovo giorno')
            , React.createElement('input', {
                type:'date', value:nuovaData,
                onChange:e=>setNuovaData(e.target.value),
                style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${nuovaData?C.border:'rgba(139,92,246,0.5)'}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif"}
              })
          )
          , React.createElement('div', null
            , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Nuovo orario')
            , React.createElement('input', {
                type:'time', value:nuoraOra,
                onChange:e=>setNuovaOra(e.target.value),
                style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${nuoraOra?C.border:'rgba(139,92,246,0.5)'}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif"}
              })
          )
        )
        , React.createElement('div', {style:{fontSize:12,color:C.textDim,background:'rgba(139,92,246,0.06)',border:'1px solid rgba(139,92,246,0.2)',borderRadius:8,padding:'10px 12px',lineHeight:1.5}}
          , '💡 La prossima lezione ricorrente viene già creata dall\'orario originale. Solo questa lezione verrà spostata.'
        )
        , React.createElement('div', {style:{display:'flex',gap:10,justifyContent:'flex-end'}}
          , React.createElement('button', {
              onClick: onDismiss,
              style:{padding:'9px 18px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Open Sans',sans-serif"}
            }, 'Annulla')
          , React.createElement('button', {
              onClick: handleSalva,
              disabled: saving || !nuovaData || !nuoraOra,
              style:{padding:'9px 18px',borderRadius:8,border:'none',background:'#7c3aed',color:'#fff',
                cursor:(saving||!nuovaData||!nuoraOra)?'not-allowed':'pointer',
                fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",
                opacity:(saving||!nuovaData||!nuoraOra)?0.6:1}
            }, saving ? '⏳...' : '✓ Conferma cambio')
        )
      )
    )
  );
};

// ─── ADMIN RECUPERO MODAL ─────────────────────────────────────────────────────
// Permette all'admin di fissare una lezione di recupero direttamente,
// rispettando le disponibilità del docente senza richiedere la prenotazione dell'allievo.
const AdminRecuperoModal = ({ lesson, setLessons, onDismiss }) => {
  const [slots,     setSlots]     = useState([]);
  const [slotSel,   setSlotSel]   = useState(null);
  const [note,      setNote]      = useState('');
  const [saving,    setSaving]    = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Calcola slot disponibili dalle disponibilità del docente
  React.useEffect(() => {
    const docName = (lesson.teacher || '').toLowerCase().trim();
    const allDocenti = window.__docenti__ || [];
    const docRecord = docName
      ? allDocenti.find(d => {
          const tk = (d.teacherKey||'').toLowerCase().trim();
          const nm = (d.nome||'').toLowerCase().trim();
          return tk===docName||nm===docName||tk.includes(docName)||docName.includes(tk)||nm.includes(docName)||docName.includes(nm);
        })
      : null;

    const rawDisp = docRecord?.disponibilitaRecuperi || [];
    const disp = typeof rawDisp === 'string'
      ? (() => { try { return JSON.parse(rawDisp); } catch(e){ return []; } })()
      : (Array.isArray(rawDisp) ? rawDisp : []);

    if (!disp.length) { setLoadingSlots(false); return; }

    const durataMin = lesson.durata || 45;
    const toMin = t => { const [h,m]=(t||'0:0').split(':'); return +h*60+(+m||0); };
    const toStr = m => String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');

    const oggi_s = new Date(); oggi_s.setHours(0,0,0,0);
    const domani  = new Date(oggi_s); domani.setDate(domani.getDate()+1);
    const maxData = new Date(oggi_s); maxData.setDate(maxData.getDate()+60);

    const giornoToIdx = { "domenica":0,"lunedi":1,"lunedì":1,"martedi":2,"martedì":2,"mercoledi":3,"mercoledì":3,"giovedi":4,"giovedì":4,"venerdi":5,"venerdì":5,"sabato":6 };

    const allLessons = window.__FM_DATA__?.lessons || [];
    const occupati = new Set(allLessons.map(l => l.date+'_'+(l.hour||'').slice(0,5)));

    // ── FIX DATA: usa date locali, NON toISOString() che usa UTC ──
    const toLocalDateStr = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      return `${y}-${m}-${dd}`;
    };

    const risultato = [];
    for (const slot of disp) {
      const dow = giornoToIdx[(slot.giorno||'').toLowerCase().trim()];
      if (dow === undefined) continue;
      const cursor = new Date(domani);
      while (cursor <= maxData) {
        if (cursor.getDay() === dow) {
          const dataStr = toLocalDateStr(cursor); // FIX: era cursor.toISOString().split('T')[0]
          let cur = toMin(slot.oraInizio);
          const end = toMin(slot.oraFine);
          while (cur + durataMin <= end) {
            const key = dataStr+'_'+toStr(cur);
            risultato.push({
              data: dataStr, giorno: slot.giorno,
              oraInizio: toStr(cur), oraFine: toStr(cur+durataMin),
              key, occupato: occupati.has(key),
            });
            cur += durataMin;
          }
        }
        cursor.setDate(cursor.getDate()+1);
      }
    }
    setSlots(risultato);
    setLoadingSlots(false);
  }, [lesson.id]);

  const handleConferma = async () => {
    if (!slotSel || saving) return;
    setSaving(true);
    const sb = window.supabaseClient;
    if (sb) {
      const nuovaId = uid();
      const MESI_N=['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
      const [oy,om,od] = (lesson.date||'').split('-');
      const dataOrigLabel = od && om ? `${od} ${MESI_N[+om-1]} ${oy}` : lesson.date;
      // Nota recupero nel campo NOTE, argomento libero per il docente
      const noteText = `🔄 Recupero del ${dataOrigLabel}` + (note ? ` — ${note}` : '');

      // tipo:'individuale' → la lezione entra nei conteggi normali come tutte le altre lezioni
      // topic con emoji 🔄 → badge visivo nell'elenco
      const nuovaLez = {
        ...lesson,
        id:              nuovaId,
        date:            slotSel.data,
        hour:            slotSel.oraInizio,
        attendance:      null,
        tipo:            'individuale',
        topic:           '',           // campo argomento libero per il docente
        notes:           noteText,     // nota recupero nel campo NOTE
        inRecupero:      false,
        recuperoScadenza:null,
        recurrence:      'Nessuna',
      };

      // 1. Inserisci la nuova lezione
      await sb.from('lezioni').insert({
        id: nuovaId, data: nuovaLez.date, ora: nuovaLez.hour+':00',
        student: nuovaLez.student, studente_id: nuovaLez.studentId||null,
        strumento: nuovaLez.instrument||nuovaLez.strumento||null,
        teacher: nuovaLez.teacher, room: nuovaLez.room||null,
        attendance: null,
        tipo: 'individuale',
        topic: null,       // argomento libero — il docente lo compilerà
        recurrence: 'Nessuna', notes: noteText,  // nota recupero nel campo NOTE
        in_recupero: false, recupero_scadenza: null,
        durata: nuovaLez.durata||45,
        corso_id: nuovaLez.courseId||null, corso_nome: nuovaLez.courseName||null,
      });

      // 2. Segna la lezione ORIGINALE come "recuperata" → esce dalla lista "lezioni in recupero"
      //    FIX bug 1: era 'in_recupero'/true → restava nella lista. Ora 'recuperata'/false → sparisce
      await sb.from('lezioni').update({
        attendance:        'recuperata',
        in_recupero:       false,
        recupero_scadenza: null,
        notes_recupero:    `Recuperata il ${slotSel.data} ore ${slotSel.oraInizio}`,
      }).eq('id', lesson.id);

      // 3. Crea record in richieste_recupero con stato='completata'
      const allievoId = lesson.studentId || lesson.studente_id || null;
      await sb.from('richieste_recupero').insert({
        allievo_id:     allievoId ? String(allievoId) : null,
        allievo_nome:   lesson.student || '',
        docente:        lesson.teacher || '',
        data_preferita: slotSel.data,
        ora_recupero:   slotSel.oraInizio,
        note:           noteText,
        stato:          'completata',
        lezioni_ids:    JSON.stringify([lesson.id]),
        created_at:     new Date().toISOString(),
      });

      // 4. Notifica all'allievo
      if (allievoId) {
        const [dy,dm,dd2] = slotSel.data.split('-');
        const dataLabel = `${dd2} ${MESI_N[+dm-1]} ${dy}`;
        await sb.from('notifiche').insert({
          destinatario_ruolo: 'allievo',
          destinatario_id:    String(allievoId),
          destinatario_nome:  lesson.student||'',
          tipo:               'recupero_ufficiale',
          titolo:             '✅ Recupero confermato ufficialmente',
          messaggio:          `Il tuo recupero è stato fissato per ${dataLabel} ore ${slotSel.oraInizio}.` + (note ? ' Nota: '+note : ''),
          letto:              false,
          created_at:         new Date().toISOString(),
        });
      }

      // 5. Aggiorna lo state React:
      //    - aggiunge la nuova lezione
      //    - segna la lezione originale come "recuperata" (esce dalla lista recuperi)
      setLessons(p => [...p, nuovaLez].map(l =>
        l.id===lesson.id
          ? {...l, attendance:'recuperata', inRecupero:false, recuperoScadenza:null}
          : l
      ));
    }
    setSaving(false);
    onDismiss();
  };

  const MESI_L = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const fmtData = d => {
    if (!d) return '—';
    const [y,m,dd] = d.split('-');
    return `${dd} ${MESI_L[+m-1]} ${y}`;
  };

  // Raggruppa slot per settimana
  const slotLiberi = slots.filter(s => !s.occupato);
  const oggi = new Date().toISOString().split('T')[0];

  return React.createElement(React.Fragment, null
    , React.createElement('div', { onClick:onDismiss, style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,.65)',backdropFilter:'blur(3px)'} })
    , React.createElement('div', { style:{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:9999,background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:520,maxWidth:'calc(100vw - 32px)',maxHeight:'85vh',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,.4)',fontFamily:"'Open Sans',sans-serif"} }
      // Header
      , React.createElement('div', {style:{padding:'18px 24px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:12,flexShrink:0}}
        , React.createElement('div', {style:{width:36,height:36,borderRadius:10,background:C.tealBg,border:`1px solid ${C.tealBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}
          , React.createElement(Ic,{n:'calendar',size:18,stroke:C.teal}))
        , React.createElement('div', null
          , React.createElement('div', {style:{fontSize:15,fontWeight:700,color:C.teal}}, '📅 Fissa recupero')
          , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginTop:2}}, (lesson.student||lesson.courseName||'—')+' · lezione del '+fmtData(lesson.date))
        )
        , React.createElement('button', {onClick:onDismiss,style:{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:C.textMuted,fontSize:20}},'×')
      )
      // Body scrollabile
      , React.createElement('div', {style:{flex:1,overflow:'auto',padding:'18px 24px',display:'flex',flexDirection:'column',gap:16}}
        , loadingSlots
          ? React.createElement('div',{style:{textAlign:'center',padding:32,color:C.textDim}},'⏳ Caricamento disponibilità...')
          : slotLiberi.length === 0
          ? React.createElement('div',{style:{padding:20,background:`${C.gold}08`,border:`1px solid ${C.goldDim}`,borderRadius:10,fontSize:13,color:C.textMuted,lineHeight:1.6}}
              , '⚠️ Nessuno slot disponibile nei prossimi 60 giorni. '
              , React.createElement('br',null)
              , 'Verifica che il docente ', React.createElement('strong',null,lesson.teacher||'—'), ' abbia configurato le disponibilità recuperi nel suo profilo (Docenti → Impostazioni).'
            )
          : React.createElement(React.Fragment, null
              , React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginBottom:4}}, `${slotLiberi.length} slot disponibili dalla disponibilità del docente · prossimi 60 giorni`)
              , React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:6}}
                , slotLiberi.slice(0,30).map(s => {
                    const isSel = slotSel?.key === s.key;
                    return React.createElement('button', {key:s.key,
                        onClick:()=>setSlotSel(s),
                        style:{padding:'10px 14px',borderRadius:10,border:`2px solid ${isSel?C.teal:C.border}`,background:isSel?C.tealBg:C.bg,
                          cursor:'pointer',display:'flex',alignItems:'center',gap:12,textAlign:'left',fontFamily:"'Open Sans',sans-serif",transition:'all .12s'}}
                      , React.createElement('div', {style:{width:36,height:36,borderRadius:8,background:isSel?C.teal:C.surface,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}
                          , React.createElement('div',{style:{fontSize:11,fontWeight:700,color:isSel?'#fff':C.text,lineHeight:1}}, s.data.split('-')[2])
                          , React.createElement('div',{style:{fontSize:9,color:isSel?'rgba(255,255,255,.8)':C.textDim,textTransform:'uppercase'}}, MESI_L[+s.data.split('-')[1]-1])
                        )
                      , React.createElement('div',{style:{flex:1}}
                          , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:isSel?C.teal:C.text}}, fmtData(s.data) + ' · ' + s.giorno)
                          , React.createElement('div',{style:{fontSize:12,color:C.textMuted}}, '🕐 ', s.oraInizio, ' → ', s.oraFine)
                        )
                      , isSel && React.createElement(Ic,{n:'check',size:16,stroke:C.teal})
                    );
                  })
                , slotLiberi.length > 30 && React.createElement('div',{style:{fontSize:11,color:C.textDim,textAlign:'center',padding:8}}, `+${slotLiberi.length-30} altri slot...`)
              )
            )
        // Note
        , React.createElement('div', null
          , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}},'Note (opzionale)')
          , React.createElement('textarea',{value:note,rows:2,onChange:e=>setNote(e.target.value),placeholder:'Es. Recupero concordato telefonicamente',
              style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif",resize:'none'}})
        )
      )
      // Footer
      , React.createElement('div', {style:{padding:'14px 24px',borderTop:`1px solid ${C.border}`,display:'flex',gap:10,justifyContent:'flex-end',flexShrink:0}}
        , React.createElement('button',{onClick:onDismiss,style:{padding:'9px 18px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Open Sans',sans-serif"}},'Annulla')
        , React.createElement('button',{onClick:handleConferma,disabled:!slotSel||saving,style:{padding:'9px 18px',borderRadius:8,border:'none',background:slotSel?C.teal:C.surface,color:slotSel?'#fff':C.textMuted,cursor:(!slotSel||saving)?'not-allowed':'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",opacity:saving?.7:1}}
          , saving?'⏳ Salvo...':'✓ Conferma recupero')
      )
    )
  );
};

const RecuperoScadutoModal = ({ lesson, onExtend, onDismiss, setLessons }) => {
  const [nuovaScadenza, setNuovaScadenza] = useState('');
  const [saving, setSaving] = useState(false);

  // Calcola fine del prossimo mese come default
  const oggi = new Date();
  const fineMesseProssimo = new Date(oggi.getFullYear(), oggi.getMonth()+2, 0).toISOString().split('T')[0];

  const handleEstendi = async () => {
    if (!nuovaScadenza) return;
    setSaving(true);
    const sb = window.supabaseClient;
    if (sb) {
      await sb.from('lezioni').update({
        in_recupero:       true,
        recupero_scadenza: nuovaScadenza,
        attendance:        null,   // rimuovi 'assente' se era già stato marcato
      }).eq('id', lesson.id);
      // Aggiorna React state
      setLessons(p => p.map(l => l.id === lesson.id
        ? {...l, inRecupero: true, recuperoScadenza: nuovaScadenza, attendance: ''}
        : l));
      if (window.__FM_UPDATE_PREV__) {
        const all = (window.__FM_DATA__?.lessons || []);
        window.__FM_UPDATE_PREV__({ lessons: all.map(l => l.id === lesson.id
          ? {...l, inRecupero: true, recuperoScadenza: nuovaScadenza, attendance: ''}
          : l)});
      }
    }
    setSaving(false);
    onDismiss();
    if (onExtend) onExtend();
  };

  const dataLez = lesson.date
    ? new Date(lesson.date+'T00:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})
    : '—';
  const scadenza = lesson.recuperoScadenza
    ? new Date(lesson.recuperoScadenza+'T00:00:00').toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'})
    : '—';

  return React.createElement(React.Fragment, null
    // Overlay
    , React.createElement('div', {
        onClick: onDismiss,
        style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(3px)'}
      })
    // Modal
    , React.createElement('div', {
        style:{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
          zIndex:9999,background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,
          width:460,maxWidth:'calc(100vw - 32px)',boxShadow:'0 20px 60px rgba(0,0,0,0.4)',
          fontFamily:"'Open Sans',sans-serif"}
      }
      // Header rosso
      , React.createElement('div', {style:{background:'rgba(220,38,38,0.08)',borderBottom:`1px solid ${C.redBorder}`,borderRadius:'16px 16px 0 0',padding:'18px 24px',display:'flex',alignItems:'center',gap:12}}
        , React.createElement('div', {style:{width:36,height:36,borderRadius:10,background:C.redBg,border:`1px solid ${C.redBorder}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
          , React.createElement(Ic, {n:'alert',size:18,stroke:C.red})
        )
        , React.createElement('div', null
          , React.createElement('div', {style:{fontSize:15,fontWeight:700,color:C.red}}, '⏰ Recupero scaduto')
          , React.createElement('div', {style:{fontSize:12,color:C.textDim,marginTop:2}}, 'Termine di recupero superato')
        )
      )
      // Body
      , React.createElement('div', {style:{padding:'20px 24px',display:'flex',flexDirection:'column',gap:14}}
        , React.createElement('div', {style:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}
          , React.createElement('div', {style:{fontSize:13,fontWeight:600,marginBottom:4}},
              lesson.student || lesson.courseName || '—')
          , React.createElement('div', {style:{fontSize:12,color:C.textMuted}},
              '📅 ', dataLez, ' · 🕐 ', lesson.hour||'—')
          , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginTop:4}},
              '👨‍🏫 ', lesson.teacher||'—')
          , React.createElement('div', {style:{fontSize:12,color:C.red,marginTop:6,fontWeight:600}},
              '⚠️ Scadenza: ', scadenza)
        )
        , React.createElement('div', {style:{fontSize:13,color:C.text,lineHeight:1.5}}
          , 'La lezione verrà automaticamente segnata come ', React.createElement('strong',null,'ASSENTE'),
            ' così da essere retribuita al docente. '
          , React.createElement('br',null)
          , 'Vuoi comunque prorogare il termine di recupero?'
        )
        , React.createElement('div', null
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Nuova scadenza recupero')
          , React.createElement('input', {
              type:'date',
              min: new Date().toISOString().split('T')[0],
              value: nuovaScadenza || fineMesseProssimo,
              onChange: e => setNuovaScadenza(e.target.value),
              style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'10px 14px',fontFamily:"'Open Sans',sans-serif"}
            })
        )
        , React.createElement('div', {style:{display:'flex',gap:10,justifyContent:'flex-end'}}
          , React.createElement('button', {
              onClick: onDismiss,
              style:{padding:'9px 18px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Open Sans',sans-serif"}
            }, 'Lascia come assente')
          , React.createElement('button', {
              onClick: handleEstendi,
              disabled: saving,
              style:{padding:'9px 18px',borderRadius:8,border:'none',background:C.gold,color:'#fff',cursor:saving?'wait':'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",opacity:saving?0.7:1}
            }, saving ? '⏳...' : '✓ Proroga recupero')
        )
      )
    )
  );
};

// ─── NOTIFICHE VIEW ────────────────────────────────────────────────────────────
// ─── REMINDERS VIEW ───────────────────────────────────────────────────────────
const SUPABASE_URL_WA  = 'https://ocsxrjommtrjelnbihfr.supabase.co';
const SERVICE_ROLE_KEY_WA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc3hyam9tbXRyamVsbmJpaGZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MTQ0MCwiZXhwIjoyMDg3OTM3NDQwfQ.7gLyBPJtq3iR6GkW1p5FVJpvhBV-a5-s_dj4z4yVBLc';

const REMINDER_DEFAULTS = [
  { id:'individuale', label:'Lezioni individuali', icon:'user',     dest:'allievo',  oraDefault:'09:00', giornoDefault:'daily',   desc:'Reminder lezione individuale del giorno seguente' },
  { id:'collettivo',  label:'Lezioni collettive',  icon:'users',    dest:'allievo',  oraDefault:'09:00', giornoDefault:'daily',   desc:'Reminder lezione collettiva del giorno seguente' },
  { id:'docente',     label:'Calendario docenti',  icon:'calendar', dest:'docente',  oraDefault:'08:00', giornoDefault:'daily',   desc:'Riepilogo lezioni del giorno per il docente' },
  { id:'pagamento',   label:'Pagamento mensile',   icon:'euro',     dest:'allievo',  oraDefault:'09:00', giornoDefault:'monthly', desc:'Promemoria quota mensile non ancora pagata' },
  { id:'recupero',    label:'Recuperi in scadenza',icon:'clock',    dest:'allievo',  oraDefault:'09:00', giornoDefault:'daily',   desc:'Avviso recupero che scade entro 3 giorni' },
];

// Wizard per creare un nuovo reminder
const ReminderWizard = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    id: '', label: '', desc: '', dest: 'allievo', orario: '09:00',
    giorno: 'daily', giornoMese: '1', attivo: true,
    template: 'Ciao {{nome}}, ti ricordiamo che domani {{data}} alle {{ora}} hai lezione di {{strumento}} con {{docente}}.',
  });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const steps = ['Tipo', 'Schedule', 'Template', 'Riepilogo'];

  return React.createElement(React.Fragment,null
    , React.createElement('div',{onClick:onClose,style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(3px)'}})
    , React.createElement('div',{style:{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        zIndex:9999,background:C.surface,border:`1px solid ${C.border}`,borderRadius:18,
        width:560,maxWidth:'calc(100vw - 32px)',maxHeight:'85vh',overflow:'auto',
        boxShadow:'0 20px 60px rgba(0,0,0,0.4)',fontFamily:"'Open Sans',sans-serif"}}

      // Header wizard
      , React.createElement('div',{style:{padding:'20px 24px',borderBottom:`1px solid ${C.border}`,background:'rgba(37,211,102,0.06)'}}
        , React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}
          , React.createElement('div',{style:{fontSize:16,fontWeight:700,color:'#25d366'}}, '🧙 Wizard nuovo reminder')
          , React.createElement('button',{onClick:onClose,style:{background:'none',border:'none',cursor:'pointer',fontSize:20,color:C.textMuted}}, '×')
        )
        // Progress bar
        , React.createElement('div',{style:{display:'flex',gap:6}}
          , steps.map((s,i) => React.createElement('div',{key:s,style:{flex:1}}
              , React.createElement('div',{style:{height:4,borderRadius:2,background:i+1<=step?'#25d366':C.border,transition:'all .2s'}})
              , React.createElement('div',{style:{fontSize:10,color:i+1<=step?'#25d366':C.textDim,marginTop:4,textAlign:'center'}}, s)
            ))
        )
      )

      , React.createElement('div',{style:{padding:'24px'}}

        // Step 1: Tipo
        , step===1 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:14}}
          , React.createElement('div',{style:{fontSize:13,fontWeight:600,marginBottom:4}}, '1. Identifica il reminder')
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'ID univoco (snake_case, es. lezione_sabato)')
            , React.createElement('input',{value:form.id,onChange:e=>set('id',e.target.value.replace(/[^a-z0-9_]/g,'')),
                placeholder:'es. lezione_sabato',
                style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'10px 14px',fontFamily:"'Open Sans',sans-serif"}})
            , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:4}}, 'Verrà usato come ?tipo=ID nella Edge Function')
          )
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Nome visualizzato')
            , React.createElement('input',{value:form.label,onChange:e=>set('label',e.target.value),
                placeholder:'es. Lezioni del sabato',
                style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'10px 14px',fontFamily:"'Open Sans',sans-serif"}})
          )
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Descrizione')
            , React.createElement('input',{value:form.desc,onChange:e=>set('desc',e.target.value),
                placeholder:'Breve descrizione dello scopo',
                style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'10px 14px',fontFamily:"'Open Sans',sans-serif"}})
          )
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Destinatario')
            , React.createElement('div',{style:{display:'flex',gap:8}}
              , ['allievo','docente','entrambi'].map(d => React.createElement('button',{key:d,
                    onClick:()=>set('dest',d),
                    style:{flex:1,padding:'10px',borderRadius:8,border:`2px solid ${form.dest===d?'#25d366':C.border}`,
                      background:form.dest===d?'rgba(37,211,102,0.1)':'none',color:form.dest===d?'#16a34a':C.textMuted,
                      cursor:'pointer',fontSize:12,fontWeight:form.dest===d?700:400,fontFamily:"'Open Sans',sans-serif",textTransform:'capitalize'}}
                  , d))
            )
          )
        )

        // Step 2: Schedule
        , step===2 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:14}}
          , React.createElement('div',{style:{fontSize:13,fontWeight:600,marginBottom:4}}, '2. Imposta la frequenza')
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Frequenza')
            , React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}
              , [{id:'daily',label:'🔄 Ogni giorno'},{id:'weekly',label:'📅 Ogni settimana'},{id:'monthly',label:'📆 1° del mese'}].map(f =>
                  React.createElement('button',{key:f.id,onClick:()=>set('giorno',f.id),
                      style:{padding:'12px 8px',borderRadius:10,border:`2px solid ${form.giorno===f.id?'#25d366':C.border}`,
                        background:form.giorno===f.id?'rgba(37,211,102,0.1)':'none',cursor:'pointer',fontSize:12,
                        fontWeight:form.giorno===f.id?700:400,color:form.giorno===f.id?'#16a34a':C.textMuted,fontFamily:"'Open Sans',sans-serif"}}
                    , f.label))
            )
          )
          , form.giorno==='weekly' && React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Giorno della settimana')
            , React.createElement('div',{style:{display:'flex',gap:6,flexWrap:'wrap'}}
              , ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'].map((g,i) =>
                  React.createElement('button',{key:g,onClick:()=>set('giornoSett',i+1),
                      style:{padding:'8px 12px',borderRadius:8,border:`2px solid ${form.giornoSett===i+1?'#25d366':C.border}`,
                        background:form.giornoSett===i+1?'rgba(37,211,102,0.1)':'none',cursor:'pointer',fontSize:12,
                        fontWeight:form.giornoSett===i+1?700:400,color:form.giornoSett===i+1?'#16a34a':C.textMuted,fontFamily:"'Open Sans',sans-serif"}}
                    , g))
            )
          )
          , form.giorno==='monthly' && React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Giorno del mese (1-28)')
            , React.createElement('input',{type:'number',min:1,max:28,value:form.giornoMese,onChange:e=>set('giornoMese',e.target.value),
                style:{width:80,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif"}})
          )
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Orario di invio')
            , React.createElement('input',{type:'time',value:form.orario,onChange:e=>set('orario',e.target.value),
                style:{width:120,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif"}})
          )
          // Anteprima cron
          , React.createElement('div',{style:{padding:'12px 16px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}}
            , React.createElement('div',{style:{fontSize:10,color:C.textDim,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}, 'Espressione pg_cron risultante')
            , React.createElement('div',{style:{fontFamily:'monospace',fontSize:13,color:C.text}},
                (() => {
                  const [hh,mm] = (form.orario||'09:00').split(':');
                  if(form.giorno==='daily')   return `${mm} ${hh} * * *`;
                  if(form.giorno==='weekly')  return `${mm} ${hh} * * ${form.giornoSett||1}`;
                  if(form.giorno==='monthly') return `${mm} ${hh} ${form.giornoMese||1} * *`;
                  return '—';
                })()
              )
          )
        )

        // Step 3: Template
        , step===3 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:14}}
          , React.createElement('div',{style:{fontSize:13,fontWeight:600,marginBottom:4}}, '3. Template del messaggio')
          , React.createElement('div',null
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Testo messaggio WhatsApp')
            , React.createElement('textarea',{value:form.template,onChange:e=>set('template',e.target.value),rows:5,
                style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'10px 14px',fontFamily:"'Open Sans',sans-serif",resize:'vertical',lineHeight:1.6}})
          )
          , React.createElement('div',{style:{padding:'12px 16px',background:`rgba(37,211,102,0.06)`,border:'1px solid rgba(37,211,102,0.25)',borderRadius:8,fontSize:12,color:C.textMuted,lineHeight:1.8}}
            , React.createElement('div',{style:{fontWeight:600,marginBottom:4,color:'#16a34a'}}, 'Variabili disponibili')
            , ['{{nome}}','{{data}}','{{ora}}','{{strumento}}','{{docente}}','{{importo}}','{{scadenza}}'].map(v=>
                React.createElement('span',{key:v,style:{display:'inline-block',background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,padding:'2px 8px',margin:'2px',fontFamily:'monospace',fontSize:11,color:C.text}}, v))
          )
          , React.createElement('div',{style:{padding:'12px 16px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}}
            , React.createElement('div',{style:{fontSize:10,color:C.textDim,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}, '👁 Anteprima')
            , React.createElement('div',{style:{fontSize:13,color:C.text,lineHeight:1.6,whiteSpace:'pre-wrap'}},
                form.template
                  .replace('{{nome}}','Mario Rossi')
                  .replace('{{data}}','domani 15/04')
                  .replace('{{ora}}','16:00')
                  .replace('{{strumento}}','Pianoforte')
                  .replace('{{docente}}','Andrea De Nuzzo')
                  .replace('{{importo}}','€70')
                  .replace('{{scadenza}}','31/03')
              )
          )
        )

        // Step 4: Riepilogo
        , step===4 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:14}}
          , React.createElement('div',{style:{fontSize:13,fontWeight:600,marginBottom:4}}, '4. Riepilogo — istruzioni di deploy')
          , React.createElement('div',{style:{padding:'16px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,display:'flex',flexDirection:'column',gap:8}}
            , [{label:'ID',    val:form.id||'—'},
               {label:'Nome',  val:form.label||'—'},
               {label:'Dest.', val:form.dest},
               {label:'Schedule', val:form.giorno==='daily'?`Ogni giorno ${form.orario}`:form.giorno==='monthly'?`${form.giornoMese}° del mese ${form.orario}`:`Ogni settimana ${form.orario}`},
              ].map(r=>React.createElement('div',{key:r.label,style:{display:'flex',gap:12,fontSize:13}}
                , React.createElement('div',{style:{color:C.textMuted,minWidth:80}}, r.label)
                , React.createElement('div',{style:{fontWeight:600,color:C.text}}, r.val)
              ))
          )
          , React.createElement('div',{style:{padding:'16px',background:'rgba(37,211,102,0.06)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:10,fontSize:13,lineHeight:1.8}}
            , React.createElement('div',{style:{fontWeight:700,color:'#16a34a',marginBottom:8}}, '📋 Passi per attivare il nuovo reminder')
            , React.createElement('div',null
              , React.createElement('strong',null,'1.'), ' Nella Edge Function ',React.createElement('code',{style:{background:C.bg,padding:'1px 6px',borderRadius:4,fontSize:12}},`whatsapp-reminder`),
                ' aggiungi il case ',React.createElement('code',{style:{background:C.bg,padding:'1px 6px',borderRadius:4,fontSize:12}},`case '${form.id||'nuovo_tipo'}':`),
                ' con la query SQL e il template.'
            )
            , React.createElement('div',{style:{marginTop:6}},
              React.createElement('strong',null,'2.'), ' In Supabase > SQL Editor esegui il pg_cron:'
            )
            , React.createElement('pre',{style:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 14px',fontSize:11,fontFamily:'monospace',overflow:'auto',marginTop:6}},
              (() => {
                const [hh,mm] = (form.orario||'09:00').split(':');
                let cron = '';
                if(form.giorno==='daily')   cron = `${mm} ${hh} * * *`;
                if(form.giorno==='weekly')  cron = `${mm} ${hh} * * ${form.giornoSett||1}`;
                if(form.giorno==='monthly') cron = `${mm} ${hh} ${form.giornoMese||1} * *`;
                return `SELECT cron.schedule(\n  '${form.id||'nuovo_tipo'}-reminder',\n  '${cron}',\n  $$\n  SELECT net.http_post(\n    url := 'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/whatsapp-reminder?tipo=${form.id||'nuovo_tipo'}',\n    headers := '{"Authorization":"Bearer ${SERVICE_ROLE_KEY_WA.slice(0,20)}...","Content-Type":"application/json"}'::jsonb,\n    body := '{}'::jsonb\n  );\n  $$\n);`;
              })()
            )
          )
        )

        // Navigazione step
        , React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginTop:20,paddingTop:16,borderTop:`1px solid ${C.border}`}}
          , step > 1
            ? React.createElement('button',{onClick:()=>setStep(s=>s-1),
                style:{padding:'9px 20px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Open Sans',sans-serif"}}, '← Indietro')
            : React.createElement('div')
          , step < 4
            ? React.createElement('button',{
                onClick:()=>setStep(s=>s+1),
                disabled:step===1&&(!form.id||!form.label),
                style:{padding:'9px 20px',borderRadius:8,border:'none',background:'#25d366',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",opacity:step===1&&(!form.id||!form.label)?0.5:1}}
              , 'Avanti →')
            : React.createElement('button',{onClick:()=>{onSave&&onSave(form);onClose();},
                style:{padding:'9px 20px',borderRadius:8,border:'none',background:'#25d366',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif"}}
              , '✓ Completa wizard')
        )
      )
    )
  );
};

// ─── DIAGNOSTICA CRON (pannello dentro NotificheSettingsView) ────────────────
const DiagnosticaPanel = ({ showToast }) => {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const runCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const sb = window.supabaseClient;
      if (!sb) { showToast(false, 'Supabase non inizializzato'); setLoading(false); return; }
      const { data: { session } } = await sb.auth.getSession();
      const token = session?.access_token;
      if (!token) { showToast(false, 'Sessione non trovata'); setLoading(false); return; }
      const res = await fetch('https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/send-push', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ check: true }),
      });
      const json = await res.json();
      setResult(json);
    } catch(e) {
      setResult({ error: String(e) });
    }
    setLoading(false);
  };

  return React.createElement('div', { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 24 } }
    , React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: result ? 16 : 0 } }
      , React.createElement('div', null
        , React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: C.text } }, '🔍 Diagnostica cron')
        , React.createElement('div', { style: { fontSize: 12, color: C.textMuted, marginTop: 3 } },
            'Mostra lo stato attuale: ora IT, lezioni di oggi, dispositivi, config anticipo. Non invia push.')
      )
      , React.createElement('button', {
          onClick: runCheck, disabled: loading,
          style: { padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`,
            background: C.bg, color: C.text, cursor: loading ? 'wait' : 'pointer',
            fontSize: 13, fontFamily: "'Open Sans',sans-serif", fontWeight: 600, flexShrink: 0 }
        }, loading ? '⏳ Controllo...' : '🔍 Controlla ora')
    )
    , result && React.createElement('div', { style: { marginTop: 8 } }
      , result.error
        ? React.createElement('div', { style: { color: C.red, fontSize: 13 } }, '❌ Errore: ' + result.error)
        : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }

          /* Ora IT e timezone */
          , React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }
            , React.createElement('div', { style: { background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, padding: '8px 12px', fontSize: 13 } }
              , React.createElement('span', { style: { color: C.textMuted, fontSize: 11 } }, 'ORA ITALIANA  ')
              , React.createElement('strong', { style: { color: C.teal } }, result.oraIT + ' del ' + result.dateStr)
            )
            , React.createElement('div', { style: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13 } }
              , React.createElement('span', { style: { color: C.textMuted, fontSize: 11 } }, 'UTC+  ')
              , React.createElement('strong', { style: { color: C.text } }, result.tzOffset)
            )
            , React.createElement('div', { style: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', fontSize: 13 } }
              , React.createElement('span', { style: { color: C.textMuted, fontSize: 11 } }, 'DISPOSITIVI  ')
              , React.createElement('strong', { style: { color: C.text } }, result.dispositiviRegistrati)
            )
          )

          /* Lezioni di oggi */
          , React.createElement('div', null
            , React.createElement('div', { style: { fontSize: 12, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 } },
                `Lezioni oggi (${result.lezioniOggi})`)
            , result.lezioniOggi === 0
              ? React.createElement('div', { style: { fontSize: 13, color: C.red, padding: '8px 12px', background: C.redBg, borderRadius: 8, border: `1px solid ${C.redBorder}` } },
                  '⚠️ Nessuna lezione trovata per oggi. Il cron non invierà nulla.')
              : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } }
                  , (result.lezioni || []).map((l, i) => {
                    const notifCfgLocal = (result.notifiche_config || []).find(c =>
                      c.id === ((l.tipo||'').toLowerCase().includes('collettiv') ? 'lezione_collettiva' : 'lezione_individuale')
                    );
                    const anticipo = notifCfgLocal?.anticipo_min ?? 60;
                    const [lhh, lmm] = (l.ora || '00:00').split(':').map(Number);
                    const lessonMin = lhh * 60 + lmm;
                    const [, oraMin] = result.oraIT.split(':').map(Number);
                    const [oraHH] = result.oraIT.split(':').map(Number);
                    const nowMin = oraHH * 60 + oraMin;
                    const diff = lessonMin - nowMin;
                    const inRange = diff >= anticipo - 4 && diff <= anticipo + 4;
                    return React.createElement('div', { key: i,
                        style: { display: 'flex', gap: 8, alignItems: 'center', fontSize: 12,
                          padding: '6px 10px', borderRadius: 6,
                          background: inRange ? C.tealBg : C.bg,
                          border: `1px solid ${inRange ? C.tealBorder : C.border}` }
                      }
                      , React.createElement('strong', null, l.ora)
                      , React.createElement('span', { style: { color: C.textMuted } }, l.student || l.teacher || '—')
                      , React.createElement('span', { style: { color: C.textMuted } }, l.tipo)
                      , React.createElement('span', { style: { color: inRange ? C.teal : C.textMuted, fontWeight: inRange ? 700 : 400 } },
                          inRange ? `✅ IN RANGE (tra ${diff}min, anticipo ${anticipo}min)` : `⏳ diff=${diff}min (anticipo ${anticipo}min)`)
                    );
                  })
              )
          )
        )
    )
  );
};

// ─── NOTIFICHE IMPOSTAZIONI (Admin) ──────────────────────────────────────────
// Configurazione notifiche in-app e push per ogni tipo di evento.
// Salvato in tabella `notifiche_config` su Supabase (chiave per tipo).
const NOTIFICHE_CONFIG_TYPES = [
  {
    id: 'lezione_individuale',
    label: 'Lezioni individuali',
    icon: 'user',
    color: C.teal,
    colorBg: C.tealBg,
    colorBorder: C.tealBorder,
    desc: 'Notifica prima di ogni lezione individuale',
    defaultAnticipoMin: 60,
    defaultDest: ['allievo', 'docente', 'admin'],
  },
  {
    id: 'lezione_collettiva',
    label: 'Lezioni collettive',
    icon: 'users',
    color: C.purple,
    colorBg: C.purpleBg,
    colorBorder: 'rgba(139,92,246,.3)',
    desc: 'Notifica prima di ogni lezione collettiva',
    defaultAnticipoMin: 60,
    defaultDest: ['allievo', 'admin'],
  },
  {
    id: 'pagamento',
    label: 'Pagamento quota',
    icon: 'euro',
    color: C.orange,
    colorBg: C.orangeBg,
    colorBorder: C.orangeBorder,
    desc: 'Notifica in-app quando la quota mensile non è ancora pagata',
    defaultAnticipoMin: 0,
    defaultDest: ['allievo', 'admin'],
  },
  {
    id: 'recupero',
    label: 'Recuperi in scadenza',
    icon: 'clock',
    color: C.red,
    colorBg: C.redBg,
    colorBorder: C.redBorder,
    desc: 'Notifica quando un recupero scade entro 3 giorni',
    defaultAnticipoMin: 0,
    defaultDest: ['allievo', 'docente', 'admin'],
  },
  {
    id: 'sala_prove',
    label: 'Sala Prove',
    icon: 'drum',
    color: C.orange2,
    colorBg: C.orange2Bg,
    colorBorder: C.orange2Border,
    desc: 'Notifica push quando arriva una nuova richiesta di prenotazione sala prove',
    defaultAnticipoMin: 0,
    defaultDest: ['band', 'admin'],
  },
];

const NotificheSettingsView = ({ ruolo }) => {
  if (ruolo !== 'admin') return null;

  const [configs,  setConfigs]  = useState(() =>
    NOTIFICHE_CONFIG_TYPES.reduce((a, t) => ({
      ...a, [t.id]: { attivo: true, anticipo_min: t.defaultAnticipoMin, destinatari: t.defaultDest }
    }), {})
  );
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState({});
  const [toast,    setToast]    = useState(null);
  const [pushSubs, setPushSubs] = useState(null); // null = non caricato ancora

  const showToast = (ok, msg) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 4500);
  };

  // Carica configurazioni da Supabase
  React.useEffect(() => {
    const sb = window.supabaseClient; if (!sb) { setLoading(false); return; }
    sb.from('notifiche_config').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        const map = {};
        data.forEach(r => {
          let dest = r.destinatari;
          // destinatari può essere array JSON o stringa JSON
          if (typeof dest === 'string') { try { dest = JSON.parse(dest); } catch(e) { dest = null; } }
          const tipo = NOTIFICHE_CONFIG_TYPES.find(t => t.id === r.id);
          map[r.id] = {
            attivo:      r.attivo !== false,
            anticipo_min: r.anticipo_min ?? 60,
            destinatari: Array.isArray(dest) ? dest : (tipo ? tipo.defaultDest : ['allievo','admin']),
            giorno_mese: r.giorno_mese ?? 1,
          };
        });
        setConfigs(p => ({ ...p, ...map }));
      }
      setLoading(false);
    });
  }, []);

  const saveConfig = async (id, cfg) => {
    setSaving(p => ({ ...p, [id]: true }));
    const sb = window.supabaseClient;
    if (sb) {
      const { error } = await sb.from('notifiche_config').upsert(
        { id, attivo: cfg.attivo, anticipo_min: cfg.anticipo_min,
          destinatari: cfg.destinatari || ['allievo','admin'],
          giorno_mese: cfg.giorno_mese ?? 1,
          updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
      if (error) showToast(false, 'Errore: ' + error.message);
      else showToast(true, 'Salvato');
    }
    setConfigs(p => ({ ...p, [id]: cfg }));
    setSaving(p => ({ ...p, [id]: false }));
    if (window.__FM_NOTIFICHE_CONFIG__) window.__FM_NOTIFICHE_CONFIG__[id] = cfg;
    else window.__FM_NOTIFICHE_CONFIG__ = { [id]: cfg };
  };

  const toggleAttivo = (id) => {
    const cfg = { ...configs[id], attivo: !configs[id].attivo };
    saveConfig(id, cfg);
  };

  return React.createElement('div', { style: { padding: '28px 32px', maxWidth: 800, margin: '0 auto' } }

    /* Header */
    , React.createElement('div', { style: { marginBottom: 28 } }
      , React.createElement('h1', { style: { fontFamily: "'Oswald',sans-serif", fontWeight: 600, fontSize: 26, letterSpacing: '0.02em', color: C.text, marginBottom: 6 } }, 'Impostazioni Notifiche')
      , React.createElement('p', { style: { fontSize: 13, color: C.textMuted, lineHeight: 1.6 } }
        , 'Configura quali notifiche vengono mostrate in-app e inviate come push (PWA). '
        , 'Le notifiche disattivate non verranno mostrate ad alcun utente.'
      )
    )

    /* Toast */
    , toast && React.createElement('div', {
        style: { position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '12px 20px',
          borderRadius: 10, fontFamily: "'Open Sans',sans-serif", fontSize: 13, fontWeight: 600,
          color: '#fff', background: toast.ok ? '#16a34a' : C.red,
          boxShadow: '0 4px 20px rgba(0,0,0,.2)' }
      }, toast.msg)

    /* ── Sezione TEST notifica ─────────────────────────────────────── */
    , React.createElement('div', { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 24 } }
      , React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 } }, '🔔 Test notifica push')
      , React.createElement('div', { style: { fontSize: 12, color: C.textMuted, marginBottom: 16, lineHeight: 1.6 } }
        , 'Invia subito una notifica di prova per verificare che il sistema funzioni, senza attendere l\'orario delle lezioni. '
        , 'In modalità PWA arriva come notifica push nativa. Sul desktop appare il banner arancione.'
      )
      , React.createElement('div', { style: { display: 'flex', gap: 10, flexWrap: 'wrap' } }
        /* Test banner desktop */
        , React.createElement('button', {
            onClick: () => {
              // Mostra banner desktop direttamente
              const existing = document.querySelector('[data-fm-reminder]');
              if (existing) existing.remove();
              const banner = document.createElement('div');
              banner.style.cssText = [
                'position:fixed','top:20px','right:20px','z-index:99999',
                'background:#fff','border:1px solid #e2e8f0','border-radius:12px',
                'box-shadow:0 8px 32px rgba(0,0,0,0.18)','padding:16px 20px',
                'display:flex','align-items:flex-start','gap:12px','max-width:320px',
                'font-family:Open Sans,sans-serif','animation:slideIn 0.3s ease',
              ].join(';');
              banner.innerHTML = `
                <div style="width:36px;height:36px;border-radius:10px;background:#fff7ed;border:1px solid #fed7aa;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">⏰</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:3px">⏰ Lezione tra 1 ora [TEST]</div>
                  <div style="font-size:12px;color:#64748b;line-height:1.4">Pianoforte con Prof. Bianchi alle 15:30</div>
                  <button onclick="this.closest('[data-fm-reminder]').remove()" style="margin-top:8px;font-size:11px;color:#f97316;background:none;border:none;cursor:pointer;padding:0;font-family:inherit;font-weight:600">Chiudi</button>
                </div>
                <button onclick="this.closest('[data-fm-reminder]').remove()" style="background:none;border:none;cursor:pointer;color:#94a3b8;font-size:18px;line-height:1;padding:0;flex-shrink:0">×</button>
              `;
              banner.setAttribute('data-fm-reminder', 'test');
              document.body.appendChild(banner);
              setTimeout(() => { if (banner.parentNode) banner.remove(); }, 30000);
              showToast(true, '✅ Banner test mostrato!');
            },
            style: { padding: '10px 18px', borderRadius: 10, border: `1px solid ${C.border}`,
              background: C.bg, color: C.text, cursor: 'pointer', fontSize: 13,
              fontFamily: "'Open Sans',sans-serif", fontWeight: 600 }
          }, '🖥️ Test banner desktop')

        /* Test push PWA */
        , React.createElement('button', {
            onClick: async () => {
              if (!('Notification' in window)) {
                showToast(false, 'Notifiche non supportate da questo browser');
                return;
              }
              if (Notification.permission === 'denied') {
                showToast(false, 'Notifiche bloccate — abilitale nelle impostazioni del browser');
                return;
              }
              const perm = Notification.permission === 'granted'
                ? 'granted'
                : await Notification.requestPermission();
              if (perm !== 'granted') {
                showToast(false, 'Permesso notifiche non concesso');
                return;
              }
              // Invia via service worker se disponibile (PWA), altrimenti Notification diretta
              const sendNotif = () => new Notification('⏰ Lezione tra 1 ora [TEST]', {
                body: 'Pianoforte con Prof. Bianchi alle 15:30',
                icon: '/FM-webapp/icons/icon-192.png',
              });
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(reg => {
                  reg.showNotification('⏰ Lezione tra 1 ora [TEST]', {
                    body: 'Pianoforte con Prof. Bianchi alle 15:30',
                    icon: '/FM-webapp/icons/icon-192.png',
                    badge: '/FM-webapp/icons/icon-192.png',
                    tag: 'fm-test',
                  });
                }).catch(sendNotif);
              } else {
                sendNotif();
              }
              showToast(true, '✅ Notifica push inviata!');
            },
            style: { padding: '10px 18px', borderRadius: 10,
              border: `1px solid ${C.orange}`, background: C.orangeBg,
              color: C.orange, cursor: 'pointer', fontSize: 13,
              fontFamily: "'Open Sans',sans-serif", fontWeight: 600 }
          }, '📱 Test push notifica')

        /* Test push da server (Edge Function) */
        , React.createElement('button', {
            onClick: async () => {
              showToast(true, '⏳ Invio via server...');
              try {
                const sb = window.supabaseClient;
                if (!sb) { showToast(false, 'Supabase non inizializzato'); return; }

                // Recupera il token della sessione corrente
                const { data: { session } } = await sb.auth.getSession();
                const token = session?.access_token;
                if (!token) { showToast(false, 'Sessione non trovata — riloggati'); return; }

                // Usa fetch diretto con il token della sessione
                const SUPABASE_URL = 'https://ocsxrjommtrjelnbihfr.supabase.co';
                const res = await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ test: true }),
                });

                if (res.status === 401) {
                  showToast(false, '🔒 401 — La funzione richiede JWT. Vai su Supabase Dashboard → Edge Functions → send-push → disabilita "Enforce JWT Verification"');
                  return;
                }
                if (res.status === 404) {
                  showToast(false, '❌ Funzione non trovata — esegui: supabase functions deploy send-push --no-verify-jwt');
                  return;
                }

                const json = await res.json();
                if (json.ok) {
                  if (json.total === 0 || json.message) {
                    showToast(true, '⚠️ ' + (json.message || 'Nessun dispositivo registrato — attiva le notifiche dalla PWA'));
                  } else {
                    showToast(true, `✅ Push inviato a ${json.sent}/${json.total} dispositivi`);
                  }
                } else {
                  showToast(false, 'Errore: ' + (json.error || 'risposta inattesa'));
                }
              } catch(e) {
                showToast(false, 'Errore: ' + (e.message || String(e)));
              }
            },
            style: { padding: '10px 18px', borderRadius: 10,
              border: `1px solid #7c3aed`, background: '#f5f3ff',
              color: '#7c3aed', cursor: 'pointer', fontSize: 13,
              fontFamily: "'Open Sans',sans-serif", fontWeight: 600 }
          }, '🌐 Test push da server')
      )
    )

    /* ── Diagnostica cron ─────────────────────────────────────────────── */
    , React.createElement(DiagnosticaPanel, { showToast })
    /* ── Pannello dispositivi registrati ─────────────────────────────────── */
    , React.createElement('div', { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 24 } }
      , React.createElement('div', { style: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 } }
        , React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: C.text } }, '📱 Dispositivi registrati per push')
        , React.createElement('div', { style: { display:'flex', gap: 8 } }
          /* Registra questo dispositivo */
          , React.createElement('button', {
              onClick: async () => {
                if (!('Notification' in window)) { showToast(false, 'Browser non supporta le notifiche'); return; }
                const perm = Notification.permission === 'granted'
                  ? 'granted'
                  : await Notification.requestPermission();
                if (perm !== 'granted') { showToast(false, 'Permesso notifiche negato'); return; }
                if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                  showToast(false, 'Push non supportato su questo browser. Usa Chrome o Edge, o installa la PWA.'); return;
                }
                const sub = await subscribeAndSavePush(VAPID_PUBLIC_KEY);
                if (sub) {
                  showToast(true, '✅ Dispositivo registrato!');
                  // Ricarica la lista
                  const sb = window.supabaseClient;
                  if (sb) {
                    const { data } = await sb.from('push_subscriptions')
                      .select('id, nome, ruolo, created_at, updated_at, endpoint')
                      .order('updated_at', { ascending: false });
                    setPushSubs(data || []);
                  }
                } else {
                  showToast(false, 'Registrazione fallita — controlla che il Service Worker sia attivo');
                }
              },
              style: { padding: '6px 14px', borderRadius: 8,
                border: `1px solid ${C.teal}`, background: C.tealBg,
                color: C.teal, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: "'Open Sans',sans-serif" }
            }, '➕ Registra questo dispositivo')
          /* Aggiorna lista */
          , React.createElement('button', {
              onClick: async () => {
                const sb = window.supabaseClient; if (!sb) return;
                const { data } = await sb.from('push_subscriptions')
                  .select('id, nome, ruolo, created_at, updated_at, endpoint')
                  .order('updated_at', { ascending: false });
                setPushSubs(data || []);
              },
              style: { padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
                background: C.bg, color: C.textMuted, cursor: 'pointer', fontSize: 12,
                fontFamily: "'Open Sans',sans-serif" }
            }, pushSubs === null ? '🔄 Carica' : '🔄 Aggiorna')
        )
      )
      , pushSubs === null
        ? React.createElement('div', { style: { fontSize: 13, color: C.textMuted, fontStyle: 'italic' } },
            'Clicca "Carica" per vedere i dispositivi che riceveranno le notifiche push.')
        : pushSubs.length === 0
          ? React.createElement('div', { style: { fontSize: 13, color: C.textMuted } },
              '⚠️ Nessun dispositivo registrato. Apri la PWA sul telefono e premi "Attiva notifiche".')
          : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }
              , React.createElement('div', { style: { fontSize: 12, color: C.textMuted, marginBottom: 4 } },
                  pushSubs.length + ' dispositiv' + (pushSubs.length === 1 ? 'o' : 'i') + ' registrat' + (pushSubs.length === 1 ? 'o' : 'i'))
              , pushSubs.map((s, i) => {
                  const ruoloLabel = { admin: '👑 Admin', docente: '🎓 Docente', allievo: '🎵 Allievo' }[s.ruolo] || s.ruolo;
                  const updated = s.updated_at ? new Date(s.updated_at).toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
                  const endpointShort = s.endpoint ? s.endpoint.split('/').pop()?.slice(0, 20) + '…' : '—';
                  return React.createElement('div', { key: s.id || i,
                      style: { display:'flex', alignItems:'center', justifyContent:'space-between',
                        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                        padding: '10px 14px', gap: 12 }
                    }
                    , React.createElement('div', { style: { flex: 1, minWidth: 0 } }
                      , React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: C.text } },
                          s.nome || '(senza nome)')
                      , React.createElement('div', { style: { fontSize: 11, color: C.textMuted, marginTop: 2 } },
                          ruoloLabel + ' · aggiornato ' + updated)
                      , React.createElement('div', { style: { fontSize: 10, color: C.textDim, marginTop: 1, fontFamily: 'monospace' } },
                          endpointShort)
                    )
                    , React.createElement('button', {
                        onClick: async () => {
                          if (!window.confirm(`Rimuovere il dispositivo di ${s.nome || '?'}?`)) return;
                          const sb = window.supabaseClient;
                          if (!sb) return;
                          await sb.from('push_subscriptions').delete().eq('id', s.id);
                          setPushSubs(p => (p || []).filter(x => x.id !== s.id));
                          showToast(true, 'Dispositivo rimosso');
                        },
                        title: 'Rimuovi questo dispositivo',
                        style: { padding: '5px 10px', borderRadius: 6, border: `1px solid ${C.border}`,
                          background: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 11, flexShrink: 0 }
                      }, '✕')
                  );
                })
          )
    )

    /* SQL setup hint */
    , React.createElement('div', { style: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: 12, color: C.textMuted, lineHeight: 1.6 } }
      , React.createElement('span', { style: { fontWeight: 700, color: C.text } }, '⚙️ Setup DB richiesto: ')
      , 'Esegui su Supabase → SQL Editor:'
      , React.createElement('pre', { style: { marginTop: 8, fontSize: 11, background: '#0f0f1a', color: '#a3e635', padding: '10px 14px', borderRadius: 8, overflowX: 'auto', fontFamily: 'monospace' } }
        , `CREATE TABLE IF NOT EXISTS public.notifiche_config (
  id text PRIMARY KEY,
  attivo boolean DEFAULT true,
  anticipo_min integer DEFAULT 60,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.notifiche_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON public.notifiche_config FOR ALL USING (true);`
      )
    )

    /* Cards per tipo */
    , loading
      ? React.createElement('div', { style: { textAlign: 'center', padding: 40, color: C.textDim } }, '⏳ Caricamento...')
      : React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }
          , NOTIFICHE_CONFIG_TYPES.map(tipo => {
              const cfg  = configs[tipo.id] || { attivo: true, anticipo_min: tipo.defaultAnticipoMin, destinatari: tipo.defaultDest };
              const isOn = cfg.attivo !== false;
              const isSav = saving[tipo.id];
              const dest  = Array.isArray(cfg.destinatari) ? cfg.destinatari : tipo.defaultDest;

              const RUOLI = [
                { id: 'allievo',  label: '🎵 Allievo'  },
                { id: 'docente',  label: '🎓 Docente'  },
                { id: 'admin',    label: '👑 Admin'     },
                { id: 'band',     label: '🥁 Band'      },
              ];

              const toggleRuolo = (ruoloId) => {
                const newDest = dest.includes(ruoloId)
                  ? dest.filter(r => r !== ruoloId)
                  : [...dest, ruoloId];
                if (newDest.length === 0) return; // almeno uno
                saveConfig(tipo.id, { ...cfg, destinatari: newDest });
              };

              const destLabel = dest.map(r => ({ allievo:'Allievo', docente:'Docente', admin:'Admin' }[r] || r)).join(' + ');

              return React.createElement('div', { key: tipo.id,
                  style: { background: C.surface, border: `1px solid ${isOn ? tipo.colorBorder : C.border}`,
                    borderRadius: 14, overflow: 'hidden', opacity: isOn ? 1 : 0.85, transition: 'all .2s' } }

                /* Card header */
                , React.createElement('div', { style: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 } }
                  , React.createElement('div', { style: { width: 42, height: 42, borderRadius: 10,
                      background: isOn ? tipo.colorBg : C.bg, border: `1px solid ${isOn ? tipo.colorBorder : C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } }
                    , React.createElement(Ic, { n: tipo.icon, size: 18, stroke: isOn ? tipo.color : C.textMuted })
                  )
                  , React.createElement('div', { style: { flex: 1 } }
                    , React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: 8 } }
                      , tipo.label
                      , !isOn && React.createElement('span', { style: { fontSize: 10, background: C.redBg, color: C.red, border: `1px solid ${C.redBorder}`, borderRadius: 20, padding: '2px 8px', fontWeight: 600 } }, 'DISATTIVATA')
                    )
                    , React.createElement('div', { style: { fontSize: 12, color: C.textMuted, marginTop: 2 } }, tipo.desc)
                  )
                  /* Toggle */
                  , React.createElement('button', {
                      onClick: () => toggleAttivo(tipo.id),
                      disabled: isSav,
                      style: { width: 44, height: 24, borderRadius: 12, border: 'none', cursor: isSav ? 'wait' : 'pointer',
                        background: isOn ? tipo.color : C.border, position: 'relative', transition: 'background .2s',
                        flexShrink: 0, opacity: isSav ? .6 : 1 } }
                    , React.createElement('div', { style: { position: 'absolute', top: 3, left: isOn ? 23 : 3,
                        width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,.2)' } })
                  )
                )

                /* Sezione inferiore: anticipo + destinatari */
                , isOn && React.createElement('div', { style: { padding: '12px 20px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 14 } }

                  /* Anticipo (solo lezioni) */
                  , (tipo.id === 'lezione_individuale' || tipo.id === 'lezione_collettiva') && (
                    React.createElement('div', null
                      , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 } }
                        , '⏱ Anticipo notifica'
                      )
                      , React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }
                        , [15, 30, 45, 60, 90, 120].map(min =>
                            React.createElement('button', {
                              key: min,
                              onClick: () => saveConfig(tipo.id, { ...cfg, anticipo_min: min }),
                              style: { padding: '6px 14px', borderRadius: 8,
                                border: `1px solid ${cfg.anticipo_min === min ? tipo.color : C.border}`,
                                background: cfg.anticipo_min === min ? tipo.colorBg : C.bg,
                                color: cfg.anticipo_min === min ? tipo.color : C.textMuted,
                                cursor: 'pointer', fontSize: 12, fontWeight: cfg.anticipo_min === min ? 700 : 400,
                                fontFamily: "'Open Sans',sans-serif" } }
                              , min === 60 ? '1h' : min === 90 ? '1h30' : min === 120 ? '2h' : `${min}m`
                            )
                          )
                      )
                    )
                  )

                  /* Giorno del mese (per pagamento e recupero) */
                  , (tipo.id === 'pagamento' || tipo.id === 'recupero') && (
                    React.createElement('div', null
                      , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 } }
                        , tipo.id === 'pagamento' ? '📅 Giorno del mese per l\'invio' : '📅 Controlla ogni giorno da questo giorno in poi'
                      )
                      , React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } }
                        , [1, 2, 3, 4, 5, 8, 10, 15, 20, 25].map(d =>
                            React.createElement('button', {
                              key: d,
                              onClick: () => saveConfig(tipo.id, { ...cfg, giorno_mese: d }),
                              style: { padding: '6px 14px', borderRadius: 8,
                                border: `1px solid ${(cfg.giorno_mese ?? 1) === d ? tipo.color : C.border}`,
                                background: (cfg.giorno_mese ?? 1) === d ? tipo.colorBg : C.bg,
                                color: (cfg.giorno_mese ?? 1) === d ? tipo.color : C.textMuted,
                                cursor: 'pointer', fontSize: 12, fontWeight: (cfg.giorno_mese ?? 1) === d ? 700 : 400,
                                fontFamily: "'Open Sans',sans-serif" } }
                              , `${d}°`
                            )
                          )
                      )
                      , React.createElement('div', { style: { fontSize: 11, color: C.textMuted, marginTop: 6 } },
                          tipo.id === 'pagamento'
                            ? `La notifica viene inviata il giorno ${cfg.giorno_mese ?? 1}° di ogni mese agli utenti con quota non pagata.`
                            : `I recuperi in scadenza vengono controllati e notificati ogni giorno a partire dal ${cfg.giorno_mese ?? 1}° del mese.`
                      )
                      /* Test button per questa notifica */
                      , React.createElement('button', {
                          onClick: async () => {
                            showToast(true, '⏳ Invio test...');
                            try {
                              const sb = window.supabaseClient;
                              if (!sb) { showToast(false, 'Supabase non inizializzato'); return; }
                              const { data: { session } } = await sb.auth.getSession();
                              const token = session?.access_token;
                              if (!token) { showToast(false, 'Sessione non trovata'); return; }
                              const res = await fetch('https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/send-push', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ test: true, tipo: tipo.id }),
                              });
                              if (res.status === 401) { showToast(false, '🔒 Edge Function non autorizzata — disabilita JWT verification'); return; }
                              const json = await res.json();
                              if (json.ok) {
                                showToast(true, `✅ Test "${tipo.label}" inviato a ${json.sent}/${json.total} dispositivi`);
                              } else {
                                showToast(false, 'Errore: ' + (json.error || 'risposta inattesa'));
                              }
                            } catch(e) {
                              showToast(false, 'Errore: ' + (e.message || String(e)));
                            }
                          },
                          style: { marginTop: 8, padding: '7px 16px', borderRadius: 8,
                            border: `1px solid ${tipo.color}`, background: tipo.colorBg,
                            color: tipo.color, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            fontFamily: "'Open Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }
                        }
                        , '🧪 Test push "' + tipo.label + '"')
                    )
                  )

                  /* Selettore destinatari */
                  , React.createElement('div', null
                    , React.createElement('label', { style: { fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 } }
                      , '👥 Chi riceve la notifica push'
                    )
                    , React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } }
                      , RUOLI.map(r =>
                          React.createElement('button', {
                            key: r.id,
                            onClick: () => toggleRuolo(r.id),
                            disabled: isSav || (dest.includes(r.id) && dest.length === 1),
                            style: { padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
                              fontFamily: "'Open Sans',sans-serif", fontWeight: 600, transition: 'all .15s',
                              border: `1.5px solid ${dest.includes(r.id) ? tipo.color : C.border}`,
                              background: dest.includes(r.id) ? tipo.colorBg : C.bg,
                              color: dest.includes(r.id) ? tipo.color : C.textMuted,
                              opacity: (dest.includes(r.id) && dest.length === 1) ? .5 : 1 } }
                            , (dest.includes(r.id) ? '✓ ' : '') + r.label
                          )
                        )
                    )
                    , React.createElement('div', { style: { fontSize: 11, color: C.textMuted, marginTop: 6 } },
                        'Notifica inviata a: ' + (destLabel || '—'))
                  )
                )
              );
            })
        )
  );
};

const REMINDER_TYPES = [
  { id:'individuale', label:'Lezioni individuali', icon:'user',     dest:'Allievo', scheduleDefault:'09:00', cronDefault:'0 9 * * *', desc:'Reminder lezione individuale del giorno seguente' },
  { id:'collettivo',  label:'Lezioni collettive',  icon:'users',    dest:'Allievo', scheduleDefault:'09:00', cronDefault:'0 9 * * *', desc:'Reminder lezione collettiva del giorno seguente'  },
  { id:'docente',     label:'Calendario docenti',  icon:'calendar', dest:'Docente', scheduleDefault:'08:00', cronDefault:'0 8 * * *', desc:'Riepilogo lezioni del giorno per il docente'      },
  { id:'pagamento',   label:'Pagamento mensile',   icon:'euro',     dest:'Allievo', scheduleDefault:'09:00', cronDefault:'0 9 1 * *', desc:'Promemoria quota mensile non ancora pagata'       },
  { id:'recupero',    label:'Recuperi in scadenza',icon:'clock',    dest:'Allievo', scheduleDefault:'09:00', cronDefault:'0 9 * * *', desc:'Avviso recupero che scade entro 3 giorni'         },
];

const GIORNI_SETTIMANA = [
  {id:'lun',label:'Lun'},{id:'mar',label:'Mar'},{id:'mer',label:'Mer'},
  {id:'gio',label:'Gio'},{id:'ven',label:'Ven'},{id:'sab',label:'Sab'},{id:'dom',label:'Dom'},
];

const WA_SUPABASE_URL = 'https://ocsxrjommtrjelnbihfr.supabase.co';
const WA_SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc3hyam9tbXRyamVsbmJpaGZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MTQ0MCwiZXhwIjoyMDg3OTM3NDQwfQ.7gLyBPJtq3iR6GkW1p5FVJpvhBV-a5-s_dj4z4yVBLc';

const RemindersView = ({ ruolo }) => {
  const [log,          setLog]          = useState([]);
  const [logLoading,   setLogLoading]   = useState(false);
  const [sending,      setSending]      = useState({});
  const [saving,       setSaving]       = useState({});
  const [activeTab,    setActiveTab]    = useState('panoramica');
  const [logFilter,    setLogFilter]    = useState('tutti');
  const [editingId,    setEditingId]    = useState(null);
  const [showWizard,   setShowWizard]   = useState(false);

  const defaultCfg = (t) => ({
    attivo: true, ora_invio: t.scheduleDefault,
    giorni: ['lun','mar','mer','gio','ven','sab'], anticipo_ore: 24, note: '',
  });

  const [configs, setConfigs] = useState(() =>
    REMINDER_TYPES.reduce((a, t) => ({ ...a, [t.id]: defaultCfg(t) }), {})
  );

  const [wizard, setWizard] = useState({
    id:'', label:'', dest:'Allievo', ora_invio:'09:00',
    giorni:['lun','mar','mer','gio','ven','sab'], anticipo_ore:24, desc:'', template:'',
  });

  React.useEffect(() => { loadConfig(); loadLog(); }, []);

  const loadConfig = async () => {
    try {
      const sb = window.supabaseClient; if (!sb) return;
      const { data } = await sb.from('whatsapp_config').select('*');
      if (data && data.length > 0) {
        setConfigs(prev => {
          const next = { ...prev };
          data.forEach(row => {
            if (next[row.id]) next[row.id] = {
              attivo:      row.attivo !== false,
              ora_invio:   row.ora_invio   || next[row.id].ora_invio,
              giorni:      Array.isArray(row.giorni) ? row.giorni : next[row.id].giorni,
              anticipo_ore:row.anticipo_ore || 24,
              note:        row.note || '',
            };
          });
          return next;
        });
      }
    } catch(e) { console.warn('[WA config]', e?.message); }
  };

  const loadLog = async () => {
    setLogLoading(true);
    try {
      const sb = window.supabaseClient; if (!sb) return;
      // Usa select('*') — non richiedere 'tipo' esplicitamente perché potrebbe non esistere
      const { data, error, status } = await sb
        .from('whatsapp_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      console.log('[WA log] status:', status, 'count:', data?.length, 'error:', error?.message);

      if (error) {
        if (error.code === '42P01') {
          setLog([{ _errore: 'tabella_mancante' }]);
        } else {
          setLog([{ _errore: 'errore_query', msg: `${error.message} (${error.code})` }]);
        }
        setLogLoading(false);
        return;
      }
      setLog(data || []);
    } catch(e) {
      console.warn('[WA log catch]', e?.message);
      setLog([{ _errore: 'errore_query', msg: e?.message }]);
    }
    setLogLoading(false);
  };

  const toast = (ok, msg) => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:999999;padding:14px 28px;border-radius:12px;font-family:"Open Sans",sans-serif;font-size:14px;font-weight:600;color:#fff;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,.35);' + (ok ? 'background:#16a34a' : 'background:#dc2626');
    el.textContent = (ok ? '✅  ' : '❌  ') + msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  };

  const saveConfig = async (id, cfg) => {
    setSaving(p => ({ ...p, [id]: true }));
    try {
      const sb = window.supabaseClient;
      if (sb) await sb.from('whatsapp_config').upsert(
        { id, attivo:cfg.attivo, ora_invio:cfg.ora_invio, giorni:cfg.giorni, anticipo_ore:cfg.anticipo_ore, note:cfg.note, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
      setConfigs(p => ({ ...p, [id]: cfg }));
      setEditingId(null);
      toast(true, 'Configurazione salvata');
    } catch(e) { toast(false, 'Errore: ' + e?.message); }
    setSaving(p => ({ ...p, [id]: false }));
  };

  const toggleAttivo = (id) => {
    const cfg = { ...configs[id], attivo: !configs[id].attivo };
    saveConfig(id, cfg);
  };

  const triggerReminder = async (tipoId) => {
    setSending(p => ({ ...p, [tipoId]: true }));
    try {
      const sb = window.supabaseClient;
      if (!sb) { toast(false, 'Supabase non disponibile'); setSending(p=>({...p,[tipoId]:false})); return; }
      // Recupera il token di sessione per l'Authorization header (evita il CORS del service role key)
      const { data: { session } } = await sb.auth.getSession();
      const token = session?.access_token || WA_SERVICE_KEY;
      // fetch con il token di sessione — il CORS è gestito dall'Edge Function
      const res = await fetch(
        `${WA_SUPABASE_URL}/functions/v1/whatsapp-reminder?tipo=${tipoId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: '{}',
        }
      );
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const n = json?.sent ?? json?.count ?? '';
        toast(true, `Reminder "${tipoId}" inviato!${n!==''?' ('+n+' messaggi)':''}`);
        setTimeout(loadLog, 2500);
      } else {
        const txt = await res.text().catch(() => res.status);
        toast(false, `Errore ${res.status}: ${txt}`);
      }
    } catch(e) {
      toast(false, 'Errore di rete: ' + e?.message + ' — verifica che l\'Edge Function abbia i CORS headers');
    }
    setSending(p => ({ ...p, [tipoId]: false }));
  };

  const cronExpr = (cfg, tipo) => {
    const [hh, mm] = (cfg.ora_invio || '09:00').split(':');
    return tipo === 'pagamento' ? `${mm||0} ${hh||9} 1 * *` : `${mm||0} ${hh||9} * * *`;
  };

  const realLog     = log.filter(r => !r._errore);
  const logFiltrato = logFilter === 'tutti' ? realLog : realLog.filter(r => r.stato === logFilter);
  const statInviati = realLog.filter(r => r.stato === 'inviato').length;
  const statErrori  = realLog.filter(r => r.stato === 'errore').length;
  const statOggi    = realLog.filter(r => (r.created_at||'').startsWith(new Date().toISOString().split('T')[0])).length;
  const statAttivi  = REMINDER_TYPES.filter(t => configs[t.id]?.attivo !== false).length;
  const isAdmin     = ruolo === 'admin';

  const TABS = [
    { id:'panoramica', label:'⚙️ Panoramica' },
    { id:'log',        label:'📋 Log invii'  },
    { id:'istruzioni', label:'📖 Istruzioni' },
  ];

  const inputStyle = { width:'100%', boxSizing:'border-box', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:'9px 12px', fontFamily:"'Open Sans',sans-serif" };
  const labelStyle = { fontSize:11, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', display:'block', marginBottom:6 };
  const codeStyle  = { background:'#1e1e2e', color:'#cdd6f4', borderRadius:10, padding:'14px 18px', fontSize:11, overflowX:'auto', lineHeight:1.7, margin:0, whiteSpace:'pre' };

  return React.createElement('div', { style:{ maxWidth:960, margin:'0 auto', padding:'28px 24px' } }

    /* ── Header ── */
    , React.createElement('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 } }
      , React.createElement('div', null
        , React.createElement('h2', { style:{ fontFamily:"'Oswald',sans-serif", fontSize:28, fontWeight:600, margin:0 } }, '📱 Reminders WhatsApp')
        , React.createElement('p',  { style:{ fontSize:13, color:C.textMuted, marginTop:4 } }, 'Gestione notifiche automatiche · Meta Business API · pg_cron su Supabase')
      )
      , React.createElement('button', {
          onClick: loadLog,
          style:{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:C.textMuted, cursor:'pointer', fontSize:12, fontFamily:"'Open Sans',sans-serif" }
        }
        , React.createElement(Ic, { n:'refresh', size:13, stroke:C.textMuted }), ' Aggiorna log'
      )
    )

    /* ── KPI strip ── */
    , React.createElement('div', { style:{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 } }
      , [ {label:'Inviati', value:statInviati, hex:C.green, icon:'check'},
          {label:'Errori',  value:statErrori,  hex:C.red,   icon:'alert'},
          {label:'Oggi',    value:statOggi,    hex:C.gold,  icon:'calendar'},
          {label:'Attivi',  value:statAttivi,  hex:C.teal,  icon:'bell'},
        ].map(k => React.createElement('div', { key:k.label, style:{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:12 } }
          , React.createElement('div', { style:{ width:36, height:36, borderRadius:10, background:`${k.hex}18`, display:'flex', alignItems:'center', justifyContent:'center' } }
            , React.createElement(Ic, { n:k.icon, size:18, stroke:k.hex }))
          , React.createElement('div', null
            , React.createElement('div', { style:{ fontFamily:"'Oswald',sans-serif", fontSize:26, fontWeight:600, color:k.hex, lineHeight:1 } }, k.value)
            , React.createElement('div', { style:{ fontSize:11, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:3 } }, k.label)
          )
        ))
    )

    /* ── Tabs ── */
    , React.createElement('div', { style:{ display:'flex', gap:2, marginBottom:20, background:C.surface, borderRadius:10, padding:4, border:`1px solid ${C.border}`, width:'fit-content' } }
      , TABS.map(t => React.createElement('button', { key:t.id, onClick:()=>setActiveTab(t.id),
            style:{ padding:'8px 18px', borderRadius:7, border:'none', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Open Sans',sans-serif", transition:'all .12s',
              background: activeTab===t.id ? C.gold : 'none', color: activeTab===t.id ? '#fff' : C.textMuted } }
          , t.label))
    )

    /* ═══════════════ TAB PANORAMICA ═══════════════ */
    , activeTab === 'panoramica' && React.createElement('div', { style:{ display:'flex', flexDirection:'column', gap:12 } }
      , REMINDER_TYPES.map(tipo => {
          const cfg   = configs[tipo.id] || defaultCfg(tipo);
          const isEdit= editingId === tipo.id;
          const isOn  = cfg.attivo !== false;
          // tipo potrebbe non esistere come colonna — cerca nel lezione_id e dettaglio come fallback
          const VALID_TIPI = new Set(['individuale','collettivo','docente','pagamento','recupero']);
          const matchTipo = (r) => {
            // Usa r.tipo SOLO se è un tipo reminder valido (non un wamid o stringa casuale)
            if (r.tipo && VALID_TIPI.has(r.tipo)) return r.tipo === tipo.id;
            // Fallback 1: lezione_id prefissato — "docente_xxx" → tipo docente
            const lid = String(r.lezione_id || '');
            if (lid.startsWith(tipo.id + '_')) return true;
            // Fallback 2: lezione_id è un UUID standard → tipo individuale/collettivo/recupero
            if (tipo.id === 'individuale' && lid.match(/^[0-9a-f-]{36}$/i)) return true;
            // Fallback 3: cerca nel dettaglio
            return (r.dettaglio||'').toLowerCase().includes(tipo.id);
          };
          const tLog  = log.filter(r => !r._errore && matchTipo(r));
          const last  = tLog[0];

          return React.createElement('div', { key:tipo.id,
              style:{ background:C.surface, border:`1px solid ${isOn ? C.border : 'rgba(220,38,38,.3)'}`, borderRadius:14, overflow:'hidden', opacity: isOn ? 1 : 0.8, transition:'all .2s' } }

            /* card header */
            , React.createElement('div', { style:{ padding:'16px 20px', display:'flex', alignItems:'center', gap:14 } }
              , React.createElement('div', { style:{ width:40, height:40, borderRadius:10, background:`${isOn?C.green:C.red}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 } }
                , React.createElement(Ic, { n:tipo.icon, size:18, stroke:isOn?C.green:C.red }))
              , React.createElement('div', { style:{ flex:1 } }
                , React.createElement('div', { style:{ fontSize:14, fontWeight:700, color:C.text, display:'flex', alignItems:'center', gap:8 } }
                  , tipo.label
                  , !isOn && React.createElement('span', { style:{ fontSize:10, background:C.redBg, color:C.red, border:`1px solid ${C.redBorder}`, borderRadius:20, padding:'2px 8px', fontWeight:600 } }, 'DISATTIVATO'))
                , React.createElement('div', { style:{ fontSize:12, color:C.textMuted, marginTop:2 } }, tipo.desc)
              )
              , React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'flex-end' } }
                , React.createElement('span', { style:{ fontSize:11, background:tipo.dest==='Docente'?C.tealBg:C.purpleBg, color:tipo.dest==='Docente'?C.teal:'#7c3aed', border:`1px solid ${tipo.dest==='Docente'?C.tealBorder:'rgba(139,92,246,.3)'}`, borderRadius:20, padding:'3px 10px', fontWeight:600 } }, tipo.dest)
                , React.createElement('span', { style:{ fontSize:11, background:C.bg, color:C.textMuted, border:`1px solid ${C.border}`, borderRadius:20, padding:'3px 10px', display:'flex', alignItems:'center', gap:4 } }
                  , React.createElement(Ic,{n:'clock',size:11,stroke:C.textDim}), ' ', cfg.ora_invio)
                /* toggle */
                , isAdmin && React.createElement('button', { onClick:()=>toggleAttivo(tipo.id),
                    style:{ padding:'6px 14px', borderRadius:8, border:`1px solid ${isOn?C.greenBorder:C.redBorder}`, background:isOn?C.greenBg:C.redBg, color:isOn?C.green:C.red, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:"'Open Sans',sans-serif", whiteSpace:'nowrap' } }
                  , isOn ? '🟢 Attivo' : '🔴 Inattivo')
                /* edit */
                , isAdmin && React.createElement('button', { onClick:()=>setEditingId(isEdit?null:tipo.id),
                    style:{ padding:'6px 12px', borderRadius:8, border:`1px solid ${isEdit?C.gold:C.border}`, background:isEdit?C.goldBg:'none', color:isEdit?C.gold:C.textMuted, cursor:'pointer', fontSize:12, fontFamily:"'Open Sans',sans-serif" } }
                  , React.createElement(Ic,{n:'edit',size:13,stroke:isEdit?C.gold:C.textMuted}))
                /* trigger */
                , isAdmin && React.createElement('button', { onClick:()=>triggerReminder(tipo.id),
                    disabled: sending[tipo.id] || !isOn,
                    style:{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:8, border:'none',
                      background: (!isOn||sending[tipo.id]) ? C.surface : '#25d366',
                      color: (!isOn||sending[tipo.id]) ? C.textMuted : '#fff',
                      cursor:(!isOn||sending[tipo.id])?'not-allowed':'pointer', fontSize:12, fontWeight:600, fontFamily:"'Open Sans',sans-serif", whiteSpace:'nowrap', opacity:!isOn?.4:1 } }
                  , sending[tipo.id] ? React.createElement(React.Fragment,null,React.createElement(Ic,{n:'clock',size:13,stroke:'currentColor'}),' Invio...') : '▶ Invia ora')
              )
            )

            /* pannello edit schedule */
            , isEdit && isAdmin && React.createElement('div', { style:{ borderTop:`1px solid ${C.goldDim}`, background:`${C.gold}06`, padding:'18px 20px' } }
              , React.createElement('div', { style:{ fontSize:12, fontWeight:700, color:C.gold, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:14 } }, '⚙️ Modifica schedule')
              , React.createElement('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:14 } }
                , React.createElement('div', null
                  , React.createElement('label', { style:labelStyle }, 'Orario invio')
                  , React.createElement('input', { type:'time', value:cfg.ora_invio, style:inputStyle,
                      onChange:e=>setConfigs(p=>({...p,[tipo.id]:{...p[tipo.id],ora_invio:e.target.value}})) }))
                , React.createElement('div', null
                  , React.createElement('label', { style:labelStyle }, 'Anticipo (ore)')
                  , React.createElement('select', { value:cfg.anticipo_ore, style:{...inputStyle,appearance:'none'},
                      onChange:e=>setConfigs(p=>({...p,[tipo.id]:{...p[tipo.id],anticipo_ore:Number(e.target.value)}})) }
                    , [1,2,3,6,12,24,48].map(h=>React.createElement('option',{key:h,value:h}, h+' ore prima'))))
                , React.createElement('div', null
                  , React.createElement('label', { style:labelStyle }, 'Note interne')
                  , React.createElement('input', { type:'text', value:cfg.note||'', placeholder:'Solo giorni feriali…', style:inputStyle,
                      onChange:e=>setConfigs(p=>({...p,[tipo.id]:{...p[tipo.id],note:e.target.value}})) }))
              )
              /* giorni settimana */
              , React.createElement('div', { style:{ marginBottom:14 } }
                , React.createElement('label', { style:labelStyle }, 'Giorni di invio')
                , React.createElement('div', { style:{ display:'flex', gap:6, flexWrap:'wrap' } }
                  , GIORNI_SETTIMANA.map(g => {
                      const on = (cfg.giorni||[]).includes(g.id);
                      return React.createElement('button', { key:g.id,
                          onClick:()=>setConfigs(p=>{ const d=p[tipo.id].giorni||[]; return {...p,[tipo.id]:{...p[tipo.id],giorni:on?d.filter(x=>x!==g.id):[...d,g.id]}}; }),
                          style:{ padding:'6px 14px', borderRadius:20, border:`2px solid ${on?C.gold:C.border}`, background:on?C.goldBg:C.bg, color:on?C.gold:C.textMuted, cursor:'pointer', fontSize:12, fontWeight:on?600:400, fontFamily:"'Open Sans',sans-serif", transition:'all .12s' } }
                        , g.label);
                    })
                )
              )
              /* cron preview */
              , React.createElement('div', { style:{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 14px', fontSize:12, color:C.textMuted, marginBottom:14 } }
                , '🕐 pg_cron: '
                , React.createElement('code', { style:{ fontFamily:'monospace', background:`${C.gold}12`, color:C.gold, padding:'2px 8px', borderRadius:4 } }, cronExpr(cfg, tipo.id))
                , ' — aggiorna il cron manualmente su Supabase → Database → Cron Jobs'
              )
              /* salva */
              , React.createElement('div', { style:{ display:'flex', gap:10, justifyContent:'flex-end' } }
                , React.createElement('button', { onClick:()=>setEditingId(null),
                    style:{ padding:'8px 18px', borderRadius:8, border:`1px solid ${C.border}`, background:'none', color:C.textMuted, cursor:'pointer', fontSize:13, fontFamily:"'Open Sans',sans-serif" } }, 'Annulla')
                , React.createElement('button', { onClick:()=>saveConfig(tipo.id, configs[tipo.id]), disabled:saving[tipo.id],
                    style:{ padding:'8px 18px', borderRadius:8, border:'none', background:C.gold, color:'#fff', cursor:saving[tipo.id]?'wait':'pointer', fontSize:13, fontWeight:600, fontFamily:"'Open Sans',sans-serif" } }
                  , saving[tipo.id] ? '⏳ Salvo…' : '✓ Salva config')
              )
            )

            /* stats footer */
            , React.createElement('div', { style:{ padding:'10px 20px 12px', borderTop:`1px solid ${C.border}`, background:C.bg, display:'flex', gap:20, flexWrap:'wrap' } }
              , React.createElement('span',{style:{fontSize:12,color:C.textMuted}}, React.createElement('span',{style:{color:C.green,fontWeight:600}}, tLog.filter(r=>r.stato==='inviato').length), ' inviati')
              , React.createElement('span',{style:{fontSize:12,color:C.textMuted}}, React.createElement('span',{style:{color:tLog.filter(r=>r.stato==='errore').length>0?C.red:C.textDim,fontWeight:600}}, tLog.filter(r=>r.stato==='errore').length), ' errori')
              , last && React.createElement('span',{style:{fontSize:12,color:C.textMuted}}, 'Ultimo: ', new Date(last.created_at).toLocaleString('it-IT',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}))
            )
          );
        })

      /* info box */
      , React.createElement('div', { style:{ marginTop:8, padding:'14px 18px', background:`${C.gold}08`, border:`1px solid ${C.goldDim}`, borderRadius:12, fontSize:13, color:C.textMuted, lineHeight:1.6 } }
        , React.createElement('strong',{style:{color:C.gold}}, '🤖 Scheduling automatico via pg_cron')
        , React.createElement('br',null)
        , 'Il servizio gira autonomamente su Supabase. Le modifiche all\'orario vengono lette dall\'Edge Function; per cambiare il trigger pg_cron aggiorna manualmente il Cron Job nella Dashboard Supabase.'
      )
    )

    /* ═══════════════ TAB LOG ═══════════════ */
    , activeTab === 'log' && React.createElement('div', null
      , React.createElement('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 } }
        , React.createElement('div', { style:{ display:'flex', gap:8 } }
          , [ {id:'tutti',label:`Tutti (${realLog.length})`}, {id:'inviato',label:`✅ Inviati (${statInviati})`}, {id:'errore',label:`❌ Errori (${statErrori})`} ]
            .map(f => React.createElement('button', { key:f.id, onClick:()=>setLogFilter(f.id),
                style:{ padding:'6px 14px', borderRadius:8, border:`1px solid ${logFilter===f.id?C.gold:C.border}`, background:logFilter===f.id?C.goldBg:'none', color:logFilter===f.id?C.gold:C.textMuted, cursor:'pointer', fontSize:12, fontFamily:"'Open Sans',sans-serif", fontWeight:logFilter===f.id?600:400 } }
              , f.label))
        )
        , React.createElement('button', { onClick:loadLog,
            style:{ display:'flex', alignItems:'center', gap:5, padding:'6px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:C.textMuted, cursor:'pointer', fontSize:12, fontFamily:"'Open Sans',sans-serif" } }
          , React.createElement(Ic,{n:'refresh',size:13,stroke:C.textMuted}), ' Ricarica')
      )
      , logLoading ? React.createElement('div',{style:{textAlign:'center',padding:40,color:C.textDim}},'⏳ Caricamento…')
        : log.length === 1 && log[0]?._errore === 'tabella_mancante'
        ? React.createElement('div',{style:{textAlign:'center',padding:32,background:`${C.red}08`,borderRadius:12,border:`1px solid ${C.redBorder}`,color:C.textMuted}}
            , React.createElement('div',{style:{fontSize:15,fontWeight:700,color:C.red,marginBottom:8}}, '⚠️ Tabella whatsapp_log non trovata')
            , React.createElement('div',{style:{fontSize:13}}, 'Esegui le migrazioni SQL indicate nel tab Istruzioni.')
          )
        : log.length === 1 && log[0]?._errore === 'errore_query'
        ? React.createElement('div',{style:{textAlign:'center',padding:32,background:`${C.red}08`,borderRadius:12,border:`1px solid ${C.redBorder}`,color:C.textMuted}}
            , React.createElement('div',{style:{fontSize:15,fontWeight:700,color:C.red,marginBottom:8}}, '⚠️ Errore query')
            , React.createElement('div',{style:{fontSize:13,fontFamily:'monospace'}}, log[0].msg || 'Controlla la console per dettagli.')
            , React.createElement('div',{style:{fontSize:12,color:C.textDim,marginTop:8}}, 'Potrebbe essere un problema di RLS — verifica che la policy "admin_all" sia attiva su whatsapp_log.')
          )
        : logFiltrato.length === 0 ? React.createElement('div',{style:{textAlign:'center',padding:40,background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,color:C.textDim}},'📭 Nessun record trovato')
        : React.createElement('div', { style:{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' } }
            , React.createElement('table',{style:{width:'100%',borderCollapse:'collapse'}}
              , React.createElement('thead',null
                , React.createElement('tr',{style:{background:C.bg,borderBottom:`2px solid ${C.border}`}}
                  , ['Data/Ora','Telefono','Tipo','Stato','Dettaglio'].map(h=>
                      React.createElement('th',{key:h,style:{padding:'10px 14px',textAlign:'left',fontSize:10,textTransform:'uppercase',letterSpacing:'0.08em',color:C.textMuted,fontWeight:600}},h))))
              , React.createElement('tbody',null
                , logFiltrato.slice(0,100).map((r,i)=>React.createElement('tr',{key:r.id||i,style:{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.surface:C.bg}}
                    , React.createElement('td',{style:{padding:'9px 14px',fontSize:12,color:C.textMuted,whiteSpace:'nowrap'}}, r.created_at ? new Date(r.created_at).toLocaleString('it-IT',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—')
                    , React.createElement('td',{style:{padding:'9px 14px',fontSize:12,fontFamily:'monospace',color:C.text}}, r.telefono||'—')
                    , React.createElement('td',{style:{padding:'9px 14px'}}, (() => {
                        const VALID_T = new Set(['individuale','collettivo','docente','pagamento','recupero']);
                        const lid = String(r.lezione_id||'');
                        // Ricava il tipo: preferisci r.tipo solo se è un tipo valido
                        let label = VALID_T.has(r.tipo) ? r.tipo
                          : lid.startsWith('docente_') ? 'docente'
                          : lid.startsWith('pagamento_') ? 'pagamento'
                          : lid.match(/^[0-9a-f-]{36}$/i) ? 'lezione'
                          : '—';
                        return React.createElement('span',{style:{fontSize:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:'2px 8px',color:C.textMuted}}, label);
                      })())
                    , React.createElement('td',{style:{padding:'9px 14px'}}, React.createElement('span',{style:{fontSize:11,fontWeight:600,background:r.stato==='inviato'?C.greenBg:C.redBg,color:r.stato==='inviato'?C.green:C.red,border:`1px solid ${r.stato==='inviato'?C.greenBorder:C.redBorder}`,borderRadius:20,padding:'3px 10px'}}, r.stato==='inviato'?'✅ Inviato':'❌ Errore'))
                    , React.createElement('td',{style:{padding:'9px 14px',fontSize:11,color:C.textMuted,maxWidth:260,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, r.dettaglio||'—')
                  ))
              )
            )
            , logFiltrato.length>100 && React.createElement('div',{style:{padding:'10px',textAlign:'center',fontSize:12,color:C.textDim,borderTop:`1px solid ${C.border}`}}, `Mostrati 100 su ${logFiltrato.length}`)
          )
    )

    /* ═══════════════ TAB ISTRUZIONI ═══════════════ */
    , activeTab === 'istruzioni' && React.createElement('div', { style:{ display:'flex', flexDirection:'column', gap:20 } }

      /* wizard CTA */
      , isAdmin && React.createElement('div', { style:{ background:`${C.goldBg}`, border:`1px solid ${C.goldDim}`, borderRadius:16, padding:'24px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 } }
        , React.createElement('div', null
          , React.createElement('div',{style:{fontSize:16,fontWeight:700,color:C.gold,marginBottom:4}}, '🧙 Crea nuovo reminder')
          , React.createElement('div',{style:{fontSize:13,color:C.textMuted}}, 'Usa il wizard per generare il codice pronto per Edge Function, REMINDER_TYPES e pg_cron SQL')
        )
        , React.createElement('button', { onClick:()=>setShowWizard(true),
            style:{ padding:'12px 28px', borderRadius:10, border:'none', background:C.gold, color:'#fff', cursor:'pointer', fontSize:14, fontWeight:700, fontFamily:"'Open Sans',sans-serif", whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(0,0,0,.2)' } }
          , '🚀 Avvia wizard')
      )

      /* step 1 */
      , React.createElement('div',{style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 24px'}}
        , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:12}}
          , React.createElement('div',{style:{width:28,height:28,borderRadius:'50%',background:C.gold,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}},'1')
          , React.createElement('h3',{style:{margin:0,fontSize:15,fontWeight:700}},'Crea la tabella whatsapp_config su Supabase'))
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:10}},'Esegui questo SQL nel SQL Editor di Supabase (una tantum):')
        , React.createElement('pre',{style:codeStyle},
`CREATE TABLE IF NOT EXISTS public.whatsapp_config (
  id          text PRIMARY KEY,
  attivo      boolean NOT NULL DEFAULT true,
  ora_invio   text NOT NULL DEFAULT '09:00',
  giorni      jsonb DEFAULT '["lun","mar","mer","gio","ven","sab"]',
  anticipo_ore integer DEFAULT 24,
  note        text,
  updated_at  timestamptz DEFAULT now()
);
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON public.whatsapp_config
  FOR ALL TO authenticated USING(true) WITH CHECK(true);`)
      )

      /* step 2 */
      , React.createElement('div',{style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 24px'}}
        , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:12}}
          , React.createElement('div',{style:{width:28,height:28,borderRadius:'50%',background:C.gold,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}},'2')
          , React.createElement('h3',{style:{margin:0,fontSize:15,fontWeight:700}},'Struttura dell\'Edge Function (Deno/TypeScript)'))
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:10}},'Template base da copiare in ', React.createElement('code',{style:{background:C.bg,padding:'1px 6px',borderRadius:4}},'supabase/functions/whatsapp-reminder/index.ts'),':')
        , React.createElement('pre',{style:codeStyle},
`import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const tipo = new URL(req.url).searchParams.get("tipo") ?? "";
  const sb   = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1. Leggi config — se disattivato esci subito
  const { data: cfg } = await sb.from("whatsapp_config")
    .select("*").eq("id", tipo).maybeSingle();
  if (cfg && !cfg.attivo)
    return new Response(JSON.stringify({ skip: "reminder disattivato" }));

  // 2. Recupera destinatari dal DB (esempio lezioni di domani)
  const domani = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const { data: lezioni } = await sb.from("lezioni")
    .select("*, studenti(nome, telefono)")
    .eq("data", domani);

  let sent = 0;
  for (const lez of lezioni ?? []) {
    const tel = lez.studenti?.telefono;
    if (!tel) continue;
    const msg = \`Ciao \${lez.studenti.nome}! Reminder lezione domani 🎵\`;
    // 3. Chiama Meta WhatsApp API
    const res = await fetch(\`https://graph.facebook.com/v18.0/\${PHONE_ID}/messages\`, {
      method: "POST",
      headers: { "Authorization": \`Bearer \${WA_TOKEN}\`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product:"whatsapp", to: tel, type:"text", text:{ body: msg } })
    });
    const stato = res.ok ? "inviato" : "errore";
    // 4. Log
    await sb.from("whatsapp_log").insert({ tipo, telefono: tel, lezione_id: lez.id, stato });
    if (res.ok) sent++;
  }
  return new Response(JSON.stringify({ ok: true, sent }));
});`)
      )

      /* step 3 */
      , React.createElement('div',{style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 24px'}}
        , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:12}}
          , React.createElement('div',{style:{width:28,height:28,borderRadius:'50%',background:C.gold,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}},'3')
          , React.createElement('h3',{style:{margin:0,fontSize:15,fontWeight:700}},'Registra il pg_cron per lo scheduling automatico'))
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:10}},'Esegui su Supabase → Database → Cron Jobs (o SQL Editor):')
        , React.createElement('pre',{style:codeStyle},
`SELECT cron.schedule(
  'whatsapp-TIPO',             -- nome univoco del job
  '0 9 * * *',                 -- cron expression
  $$
    SELECT net.http_post(
      url     := 'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/whatsapp-reminder?tipo=TIPO',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || 'SERVICE_ROLE_KEY',
        'Content-Type',  'application/json'
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- Cron expressions utili:
-- Ogni giorno ore 9:00   →  0 9 * * *
-- 1° del mese ore 9:00   →  0 9 1 * *
-- Ogni lunedì ore 8:00   →  0 8 * * 1
-- Ogni giorno ore 8:30   →  30 8 * * *`)
      )

      /* step 4 */
      , React.createElement('div',{style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'20px 24px'}}
        , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:12}}
          , React.createElement('div',{style:{width:28,height:28,borderRadius:'50%',background:C.gold,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}},'4')
          , React.createElement('h3',{style:{margin:0,fontSize:15,fontWeight:700}},'Aggiungi il nuovo tipo a questa scheda'))
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:10}},'In app.js, aggiungi un oggetto all\'array ', React.createElement('code',{style:{background:C.bg,padding:'1px 6px',borderRadius:4}},'REMINDER_TYPES'),':')
        , React.createElement('pre',{style:codeStyle},
`{ id:'nuovo_tipo',   label:'Nome visualizzato',  icon:'bell',
  dest:'Allievo',    scheduleDefault:'09:00',
  cronDefault:'0 9 * * *',
  desc:'Breve descrizione di cosa fa' },`)
      )
    )

    /* ═══════════════ WIZARD MODAL ═══════════════ */
    , showWizard && React.createElement(React.Fragment, null
      , React.createElement('div',{onClick:()=>setShowWizard(false),style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,.65)',backdropFilter:'blur(3px)'}})
      , React.createElement('div',{style:{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:9999,background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:640,maxWidth:'calc(100vw - 32px)',maxHeight:'88vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.4)',fontFamily:"'Open Sans',sans-serif"}}

        /* modal header */
        , React.createElement('div',{style:{padding:'20px 24px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,background:C.surface,zIndex:1}}
          , React.createElement('div',null
            , React.createElement('div',{style:{fontSize:16,fontWeight:700,color:C.gold}},'🧙 Wizard nuovo reminder')
            , React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginTop:2}},'Compila i campi — il codice viene generato automaticamente'))
          , React.createElement('button',{onClick:()=>setShowWizard(false),style:{background:'none',border:'none',cursor:'pointer',color:C.textMuted,fontSize:22,lineHeight:1}},'×')
        )

        /* modal body */
        , React.createElement('div',{style:{padding:'20px 24px',display:'flex',flexDirection:'column',gap:16}}

          , React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}
            , React.createElement('div',null
              , React.createElement('label',{style:labelStyle},'ID univoco *')
              , React.createElement('input',{type:'text',value:wizard.id,placeholder:'es. saggio_annuale',style:{...inputStyle,border:`1px solid ${wizard.id?C.border:'rgba(139,92,246,.5)'}`},
                  onChange:e=>setWizard(p=>({...p,id:e.target.value.toLowerCase().replace(/\s+/g,'_')}))}))
            , React.createElement('div',null
              , React.createElement('label',{style:labelStyle},'Nome visualizzato *')
              , React.createElement('input',{type:'text',value:wizard.label,placeholder:'es. Saggio di fine anno',style:inputStyle,
                  onChange:e=>setWizard(p=>({...p,label:e.target.value}))}))
            , React.createElement('div',null
              , React.createElement('label',{style:labelStyle},'Destinatario')
              , React.createElement('select',{value:wizard.dest,style:{...inputStyle,appearance:'none'},onChange:e=>setWizard(p=>({...p,dest:e.target.value}))}
                , React.createElement('option',{value:'Allievo'},'Allievo')
                , React.createElement('option',{value:'Docente'},'Docente')
                , React.createElement('option',{value:'Entrambi'},'Entrambi')))
            , React.createElement('div',null
              , React.createElement('label',{style:labelStyle},'Orario invio')
              , React.createElement('input',{type:'time',value:wizard.ora_invio,style:inputStyle,onChange:e=>setWizard(p=>({...p,ora_invio:e.target.value}))}))
          )
          , React.createElement('div',null
            , React.createElement('label',{style:labelStyle},'Descrizione breve')
            , React.createElement('input',{type:'text',value:wizard.desc,placeholder:'Cosa fa questo reminder?',style:inputStyle,onChange:e=>setWizard(p=>({...p,desc:e.target.value}))}))
          , React.createElement('div',null
            , React.createElement('label',{style:labelStyle},'Template messaggio (opzionale)')
            , React.createElement('textarea',{value:wizard.template,rows:3,placeholder:'Ciao {{nome}}! 🎵 Reminder: {{evento}} il {{data}} alle {{ora}}.',style:{...inputStyle,resize:'vertical',lineHeight:1.5},onChange:e=>setWizard(p=>({...p,template:e.target.value}))}))

          /* codice generato */
          , wizard.id && wizard.label && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:12}}
            , React.createElement('div',{style:{fontSize:11,color:C.gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em'}},'📋 1. Aggiungi a REMINDER_TYPES in app.js')
            , React.createElement('pre',{style:{...codeStyle,userSelect:'all'}},
`{ id:'${wizard.id}', label:'${wizard.label}', icon:'bell',
  dest:'${wizard.dest}', scheduleDefault:'${wizard.ora_invio}',
  cronDefault:'${(wizard.ora_invio.split(':')[1]||'0')} ${wizard.ora_invio.split(':')[0]||'9'} * * *',
  desc:'${wizard.desc||'Nuovo reminder'}' },`)

            , React.createElement('div',{style:{fontSize:11,color:C.gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em'}},'📋 2. SQL pg_cron da eseguire su Supabase')
            , React.createElement('pre',{style:{...codeStyle,userSelect:'all'}},
`SELECT cron.schedule(
  'whatsapp-${wizard.id}',
  '${(wizard.ora_invio.split(':')[1]||'0')} ${wizard.ora_invio.split(':')[0]||'9'} * * *',
  $$SELECT net.http_post(
    url     := '${WA_SUPABASE_URL}/functions/v1/whatsapp-reminder?tipo=${wizard.id}',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || 'SERVICE_ROLE_KEY',
      'Content-Type',  'application/json'),
    body    := '{}'::jsonb);$$);`)
          )

          , React.createElement('div',{style:{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:4}}
            , React.createElement('button',{onClick:()=>setShowWizard(false),style:{padding:'9px 20px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13,fontFamily:"'Open Sans',sans-serif"}},'Chiudi')
            , wizard.id && wizard.label && React.createElement('button',{
                onClick:()=>{
                  const code=`{ id:'${wizard.id}', label:'${wizard.label}', icon:'bell', dest:'${wizard.dest}', scheduleDefault:'${wizard.ora_invio}', cronDefault:'0 ${wizard.ora_invio.split(':')[0]||9} * * *', desc:'${wizard.desc}' },`;
                  navigator.clipboard?.writeText(code);
                  toast(true,'Codice copiato negli appunti!');
                },
                style:{padding:'9px 20px',borderRadius:8,border:'none',background:C.gold,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif"}}
              ,'📋 Copia REMINDER_TYPES')
          )
        )
      )
    )
  );
};

const NotificheView = ({ notifiche: propNotifiche, setNotifiche, ruolo, appUser, lessons, students, richieste }) => {
  const [filter, setFilter] = useState('non_lette');
  const [marking, setMarking] = useState(false);
  const [allNotifiche, setAllNotifiche] = useState(null);
  const [loading, setLoading] = useState(false);
  // Tiene traccia dei live ID già "letti" durante la sessione
  const [dismissedLiveIds, setDismissedLiveIds] = useState(new Set());

  const myId      = appUser?.allievoId || appUser?.docenteId || null;
  const myNome    = appUser?.nome || '';
  const myRuolo   = ruolo || 'admin';

  // Risolvi il teacherKey del docente loggato per matching nome
  const myDocenteTeacherKey = React.useMemo(function() {
    if (myRuolo !== 'docente') return '';
    var allDoc = window.__docenti__ || [];
    var rec = myId
      ? allDoc.find(function(d){ return String(d.id) === String(myId); })
      : allDoc.find(function(d){ return (d.nome||'').toLowerCase() === myNome.toLowerCase(); });
    return rec ? (rec.teacherKey || rec.nome || myNome) : myNome;
  }, [myRuolo, myId, myNome]);

  // Funzione di matching notifica → utente corrente
  const matchNotifica = function(n) {
    // 1. Filtra per ruolo — deve corrispondere esattamente
    if (!n.destinatario_ruolo || n.destinatario_ruolo !== myRuolo) return false;
    // 2. Band: vede solo notifiche relative alla sala prove
    if (myRuolo === 'band') {
      const tipiSala = ['sala_prove_richiesta','sala_prove_approvata','sala_prove_rifiutata','messaggio_band'];
      return tipiSala.includes(n.tipo) || (n.titolo||'').toLowerCase().includes('sala');
    }
    // 3. Per admin: vede solo le notifiche destinate ad admin
    if (myRuolo === 'admin') return true;
    // 4. Notifica broadcast (nessun destinatario specifico) → visibile a tutto il ruolo
    if (!n.destinatario_id && !n.destinatario_nome) return true;
    // 5. Match per ID specifico
    if (myId && n.destinatario_id && String(n.destinatario_id) === String(myId)) return true;
    // 6. Match per nome (docente: confronto con teacherKey e nome)
    const destNome = (n.destinatario_nome||'').toLowerCase().trim();
    const mieiNomi = [myNome, myDocenteTeacherKey].filter(Boolean).map(s=>s.toLowerCase().trim());
    return mieiNomi.some(function(mn) {
      return destNome === mn || destNome.includes(mn) || mn.includes(destNome);
    });
  };

  // Carica notifiche al mount — filtro server-side stretto per ruolo + id
  React.useEffect(function() {
    const sb = window.supabaseClient;
    if (!sb) return;
    setLoading(true);

    sb.from('notifiche')
      .select('*')
      .eq('destinatario_ruolo', myRuolo)
      .order('created_at', {ascending:false})
      .limit(200)
      .then(function(r) {
        setLoading(false);
        if (!r.data) return;
        // Filtra ulteriormente lato client per destinatario specifico
        setAllNotifiche(r.data.filter(matchNotifica));
      });
  }, [myRuolo, myId, myNome, myDocenteTeacherKey]);

  // Filtra anche la prop (fallback pre-caricamento)
  const _filterNotifiche = function(arr) {
    return (arr||[]).filter(matchNotifica).sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||''); });
  };

  // Genera notifiche "live" dagli stessi dati della campanella (lezioni senza presenza, recuperi scaduti, richieste)
  const liveNotifiche = React.useMemo(function() {
    // Band e allievo: nessuna notifica live (solo notifiche DB esplicite)
    if (myRuolo === 'band' || myRuolo === 'allievo') return [];
    const oggi = new Date(); oggi.setHours(0,0,0,0);
    const todayStr = oggi.toISOString().split('T')[0];
    const results = [];
    const allLessons = lessons || [];
    const mieLessons = myRuolo === 'docente'
      ? allLessons.filter(function(l){ const tk = (myDocenteTeacherKey||myNome).toLowerCase(); return tk && (l.teacher||'').toLowerCase().includes(tk); })
      : allLessons;

    // Lezioni senza presenza passate
    const senzaPresenza = mieLessons.filter(function(l){
      return l.date && l.date < todayStr && !l.attendance && l.attendance !== 'recuperata' && l.attendance !== 'recupero';
    });
    if (senzaPresenza.length > 0) {
      results.push({ id:'__live_senza_presenza__', letto:false, destinatario_ruolo:myRuolo, tipo:'avviso_presenza',
        titolo: senzaPresenza.length + (senzaPresenza.length>1?' lezioni senza presenza':" lezione senza presenza"),
        messaggio: senzaPresenza.slice(0,4).map(function(l){ return (l.student||l.courseName||'—')+' · '+(l.date||''); }).join('; '),
        created_at: todayStr+'T08:00:00', _isLive:true });
    }

    // Recuperi scaduti
    const recuperiScaduti = mieLessons.filter(function(l){ return l.inRecupero && l.recuperoScadenza && l.recuperoScadenza < todayStr; });
    if (recuperiScaduti.length > 0) {
      results.push({ id:'__live_recuperi_scaduti__', letto:false, destinatario_ruolo:myRuolo, tipo:'recupero_scaduto',
        titolo: recuperiScaduti.length + (recuperiScaduti.length>1?' recuperi scaduti':' recupero scaduto'),
        messaggio: recuperiScaduti.slice(0,4).map(function(l){ return (l.student||'—')+' — scaduto il '+l.recuperoScadenza; }).join('; '),
        created_at: todayStr+'T07:00:00', _isLive:true });
    }

    // Richieste di recupero in attesa
    const richiesteAttesa = (richieste||[]).filter(function(r){ return r.stato === 'in_attesa' || !r.stato; });
    if (richiesteAttesa.length > 0) {
      results.push({ id:'__live_richieste__', letto:false, destinatario_ruolo:myRuolo, tipo:'recupero_richiesto',
        titolo: richiesteAttesa.length + (richiesteAttesa.length>1?' richieste di recupero in attesa':' richiesta di recupero in attesa'),
        messaggio: richiesteAttesa.slice(0,4).map(function(r){ return r.allievo_nome||'—'; }).join(', '),
        created_at: todayStr+'T06:00:00', _isLive:true });
    }

    // Allievi che superano la soglia lezioni individuali nel mese corrente (solo admin)
    if (myRuolo === 'admin') {
      const now2 = new Date();
      const meseCurr = now2.getMonth() + 1;
      const annoCurr = now2.getFullYear();
      // Leggi soglia da config globale (window.__FM_DATA__.config) o default 4
      const cfgGlob = window.__FM_DATA__ && window.__FM_DATA__.config;
      const SOGLIA_IND_GLOB = (cfgGlob && cfgGlob.sogliaLezioniIndividuali != null) ? Number(cfgGlob.sogliaLezioniIndividuali) : 4;
      const MESI_N = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
      const stArr = students || [];
      const getSoglia = function(nomeStudente) {
        const st = stArr.find(function(s){ return (s.name||s.nome||'').toLowerCase() === (nomeStudente||'').toLowerCase(); });
        if (st && st.sogliaIndividualeEcc != null) return Number(st.sogliaIndividualeEcc);
        return SOGLIA_IND_GLOB;
      };
      const conteggioPerAllievo = {};
      allLessons.forEach(function(l) {
        if (l.tipo === 'collettivo' || l.tipo === 'prova' || l.tipo === 'sala_prove' || l.tipo === 'recupero') return;
        if (l.attendance === 'recuperata') return;
        if (!l.date) return;
        const parts = (l.date||'').split('-').map(Number);
        if (parts[0] !== annoCurr || parts[1] !== meseCurr) return;
        const key = l.student || String(l.studentId||'');
        if (!key) return;
        conteggioPerAllievo[key] = (conteggioPerAllievo[key]||0) + 1;
      });
      const superanoSoglia = Object.entries(conteggioPerAllievo)
        .filter(function([nome, c]){ return c > getSoglia(nome); })
        .map(function([nome, count]){ return nome + ' (' + count + '/' + getSoglia(nome) + ')'; });
      if (superanoSoglia.length > 0) {
        results.push({ id:'__live_lezioni_extra__', letto:false, destinatario_ruolo:'admin', tipo:'lezioni_extra',
          titolo: superanoSoglia.length + ' allievo' + (superanoSoglia.length>1?'i':'') + ' oltre la soglia lezioni ind. di ' + MESI_N[meseCurr-1],
          messaggio: superanoSoglia.slice(0,5).join(' · '),
          created_at: todayStr+'T05:00:00', _isLive:true });
      }
    }
    return results;
  }, [myRuolo, myNome, myDocenteTeacherKey, lessons, richieste, students]);

  // Unione DB + live, ordinate per data
  const mieNotifiche = React.useMemo(function() {
    const db = allNotifiche !== null ? allNotifiche : _filterNotifiche(propNotifiche);
    // Le live vengono filtrate: se l'ID è nei dismissed, vengono mostrate come lette
    const live = liveNotifiche.map(n => dismissedLiveIds.has(n.id) ? {...n, letto:true} : n);
    return [...live, ...db].sort(function(a,b){ return (b.created_at||'').localeCompare(a.created_at||''); });
  }, [allNotifiche, propNotifiche, liveNotifiche, dismissedLiveIds]);

  const nonLette = mieNotifiche.filter(n => !n.letto);
  const mostrate = filter === 'non_lette' ? nonLette : mieNotifiche;

  const markAllRead = async () => {
    if (!nonLette.length) return;
    setMarking(true);

    // Separa notifiche live (no DB) da quelle reali del DB
    const liveIds = nonLette.filter(n => n._isLive).map(n => n.id);
    const dbIds   = nonLette.filter(n => !n._isLive && n.id).map(n => n.id);

    // Marca le live come lette nello stato locale (non esistono su DB)
    if (liveIds.length > 0) {
      setDismissedLiveIds(prev => new Set([...prev, ...liveIds]));
    }

    // Marca le DB come lette su Supabase
    const sb = window.supabaseClient;
    if (sb && dbIds.length > 0) {
      await sb.from('notifiche').update({letto:true}).in('id', dbIds);
      const updater = p => (p||[]).map(n => dbIds.includes(n.id) ? {...n, letto:true} : n);
      setAllNotifiche(updater);
      setNotifiche(updater);
    }
    setMarking(false);
  };

  const markOneRead = async (n) => {
    if (n.letto) return;
    if (n._isLive) {
      // Notifica live: segna come letta solo in stato locale
      setDismissedLiveIds(prev => new Set([...prev, n.id]));
      return;
    }
    const sb = window.supabaseClient;
    if (sb) await sb.from('notifiche').update({letto:true}).eq('id', n.id);
    const updater = p => (p||[]).map(x => x.id===n.id ? {...x, letto:true} : x);
    setAllNotifiche(updater);
    setNotifiche(updater);
  };

  const tipoIcon = (tipo) => {
    if (!tipo) return '🔔';
    if (tipo.includes('recupero')) return '🔄';
    if (tipo.includes('approvato')||tipo.includes('ufficiale')) return '✅';
    if (tipo.includes('rifiutato')) return '❌';
    if (tipo.includes('confermato')) return '✅';
    return '🔔';
  };

  return React.createElement('div', {style:{maxWidth:700, margin:'0 auto', padding:'28px 24px'}}
    // Header
    , React.createElement('div', {style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24}}
      , React.createElement('div', null
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,margin:0}}, '🔔 Notifiche')
        , React.createElement('p', {style:{fontSize:13,color:C.textMuted,marginTop:4}},
            nonLette.length > 0 ? `${nonLette.length} non lette su ${mieNotifiche.length} totali` : `${mieNotifiche.length} notifiche · tutte lette`)
      )
      , nonLette.length > 0 && React.createElement('button', {
          onClick: markAllRead, disabled: marking,
          style:{padding:'9px 18px',borderRadius:8,border:'none',background:C.green,color:'#fff',
            fontSize:13,fontWeight:600,cursor:marking?'wait':'pointer',fontFamily:"'Open Sans',sans-serif",opacity:marking?0.7:1}}
        , marking ? '...' : `✓ Segna tutte come lette (${nonLette.length})`
      )
    )
    // Filter tabs
    , React.createElement('div', {style:{display:'flex',gap:4,marginBottom:16,background:C.surface,borderRadius:10,padding:4,border:`1px solid ${C.border}`,width:'fit-content'}}
      , ['non_lette','tutte'].map(f => React.createElement('button', {key:f,
            onClick:()=>setFilter(f),
            style:{padding:'7px 16px',borderRadius:7,border:'none',fontSize:12,fontWeight:600,cursor:'pointer',
              fontFamily:"'Open Sans',sans-serif",transition:'all .12s',
              background: filter===f ? C.gold : 'none',
              color: filter===f ? '#fff' : C.textMuted}}
          , f==='non_lette' ? `Non lette${nonLette.length>0?' ('+nonLette.length+')':''}` : 'Tutte'
        ))
    )
    // List
    , mostrate.length === 0
      ? React.createElement('div', {style:{textAlign:'center',padding:'40px 20px',color:C.textDim,background:C.surface,borderRadius:12,border:`1px solid ${C.border}`}}
          , React.createElement('div', {style:{fontSize:32,marginBottom:8}}, filter==='non_lette'?'📭':'🔔')
          , filter==='non_lette' ? 'Nessuna notifica da leggere' : 'Nessuna notifica'
        )
      : React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:6}}
          , mostrate.map(n => React.createElement('div', {
              key: n.id,
              onClick: ()=>markOneRead(n),
              style:{
                background: n.letto ? C.surface : `${C.gold}08`,
                border: `1px solid ${n.letto ? C.border : C.goldDim}`,
                borderRadius:12, padding:'14px 18px',
                display:'flex', gap:14, alignItems:'flex-start',
                cursor: n.letto ? 'default' : 'pointer',
                transition:'all .12s',
              },
              onMouseEnter: !n.letto ? e=>{e.currentTarget.style.background=`${C.gold}14`;} : undefined,
              onMouseLeave: !n.letto ? e=>{e.currentTarget.style.background=`${C.gold}08`;} : undefined,
            }
            , React.createElement('div', {style:{fontSize:22,flexShrink:0,marginTop:1}}, tipoIcon(n.tipo))
            , React.createElement('div', {style:{flex:1}}
              , React.createElement('div', {style:{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,marginBottom:3}}
                , React.createElement('div', {style:{fontSize:14,fontWeight:n.letto?400:700,color:C.text}}, n.titolo||'—')
                , !n.letto && React.createElement('div', {style:{width:8,height:8,borderRadius:'50%',background:C.gold,flexShrink:0}})
              )
              , n.messaggio && React.createElement('div', {style:{fontSize:12,color:C.textMuted,lineHeight:1.5}}, n.messaggio)
              , React.createElement('div', {style:{fontSize:11,color:C.textDim,marginTop:4}},
                  n.created_at ? new Date(n.created_at).toLocaleString('it-IT',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '')
            )
          ))
        )
  );
};

// ─── IMPOSTAZIONI VIEW (standalone page) ──────────────────────────────────────
// ⚠ ImpToggle e ImpSection DEVONO essere FUORI da ImpostazioniView.
//   Se fossero dentro, React li tratta come tipi nuovi a ogni render
//   → i campi input perdono il focus dopo 1 carattere.
const ImpSection = ({title, icon, children}) =>
  React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:20}}
    , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}
      , React.createElement(Ic,{n:icon,size:14,stroke:C.gold})
      , React.createElement('span', {style:{fontSize:12,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:C.gold}}, title)
    )
    , React.createElement('div', {style:{padding:"18px 20px"}}, children)
  );

// Riceve rs, ac, setRS esplicitamente per evitare closure stantia
const ImpRSToggle = ({k, label, rs, ac, setRS}) => {
  const val = rs[k]!==false;
  return React.createElement('label', {style:{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"6px 0"}}
    , React.createElement('div', {onClick:()=>setRS(k,!val),
        style:{width:34,height:20,borderRadius:10,background:val?ac:"#444",position:"relative",cursor:"pointer",transition:"background .15s",flexShrink:0,marginTop:2}}
      , React.createElement('div', {style:{position:"absolute",top:3,left:val?15:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .15s"}})
    )
    , React.createElement('div', null
      , React.createElement('div', {style:{fontSize:13,color:val?C.text:C.textMuted}}, label)
    )
  );
};

// ─── RESET DATI (solo admin) ──────────────────────────────────────────────────
const ADMIN_RESET_EDGE = 'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/admin-reset';

const CATEGORIE_RESET = [
  {id:'allievi',    label:'👨‍🎓 Allievi',              desc:'Tutte le schede allievi'},
  {id:'docenti',     label:'👤 Docenti',               desc:'Tutte le schede docenti'},
  {id:'corsi',       label:'🎵 Corsi',                 desc:'Tutti i corsi configurati'},
  {id:'lezioni',     label:'📅 Lezioni',               desc:'Tutto il calendario lezioni'},
  {id:'pagamenti',   label:'💶 Pagamenti/Quote',       desc:'Storico quote e ricevute'},
  {id:'spese',       label:'💸 Spese/Rimborsi',        desc:'Rimborsi spese docenti'},
  {id:'concerti',    label:'🎤 Concerti/Eventi',       desc:'Eventi, scalette, prenotazioni biglietti'},
  {id:'iscrizioni',  label:'📋 Iscrizioni anno',       desc:'Iscrizioni allievi per anno scolastico'},
  {id:'repertorio',  label:'🎼 Repertorio/Brani',      desc:'Catalogo brani'},
  {id:'allegati',    label:'📎 Allegati',              desc:'Riferimenti file allegati'},
  {id:'messaggi',    label:'💬 Messaggi',              desc:'Tutti i messaggi interni'},
  {id:'notifiche',   label:'🔔 Notifiche',             desc:'Storico notifiche'},
  {id:'sala_prove',  label:'🥁 Sala prove',            desc:'Prenotazioni sala prove'},
];

const ResetDatiSection = () => {
  const [selected, setSelected] = React.useState({});
  const [counts, setCounts] = React.useState({});
  const [loadingCounts, setLoadingCounts] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState('');
  const [resetting, setResetting] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [showPanel, setShowPanel] = React.useState(false);

  const showToast = (ok, msg) => { setToast({ok,msg}); setTimeout(()=>setToast(null),6000); };

  const toggle = (id) => setSelected(p => ({...p, [id]: !p[id]}));
  const selectedIds = Object.keys(selected).filter(k=>selected[k]);

  const loadCounts = async () => {
    if (selectedIds.length === 0) { setCounts({}); return; }
    setLoadingCounts(true);
    try {
      const sb = window.supabaseClient;
      const { data:{session} } = await sb.auth.getSession();
      const res = await fetch(ADMIN_RESET_EDGE, {
        method:'POST',
        headers:{'Authorization':'Bearer '+session.access_token,'Content-Type':'application/json'},
        body: JSON.stringify({action:'count', categorie:selectedIds})
      });
      const json = await res.json();
      if (json.ok) setCounts(json.counts);
    } catch(e) { console.warn('[FM] count error:', e?.message); }
    setLoadingCounts(false);
  };

  React.useEffect(() => { loadCounts(); }, [JSON.stringify(selectedIds)]);

  const totaleRecord = Object.values(counts).reduce((a,b)=>a+b,0);

  const handleReset = async () => {
    if (confirmText !== 'ELIMINA') { showToast(false, 'Scrivi esattamente ELIMINA per confermare'); return; }
    setResetting(true);
    try {
      const sb = window.supabaseClient;
      const { data:{session} } = await sb.auth.getSession();
      const res = await fetch(ADMIN_RESET_EDGE, {
        method:'POST',
        headers:{'Authorization':'Bearer '+session.access_token,'Content-Type':'application/json'},
        body: JSON.stringify({action:'reset', categorie:selectedIds})
      });
      const json = await res.json();
      if (json.ok) {
        showToast(true, `✅ Reset completato. Ricarica la pagina per vedere i cambiamenti.`);
        setSelected({}); setCounts({}); setConfirmText(''); setShowPanel(false);
      } else {
        showToast(false, json.error||'Errore durante il reset');
      }
    } catch(e) { showToast(false, e?.message||'Errore'); }
    setResetting(false);
  };

  return React.createElement(ImpSection, {title:"⚠️ Reset dati", icon:"trash"}
    , toast && React.createElement('div',{style:{padding:'10px 14px',borderRadius:8,marginBottom:12,fontSize:13,background:toast.ok?C.greenBg:C.redBg,border:`1px solid ${toast.ok?C.greenBorder:C.redBorder}`,color:toast.ok?C.green:C.red}}, toast.msg)
    , React.createElement('div', {style:{padding:'12px 14px',background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:8,marginBottom:14,fontSize:12,color:C.red}}
        , '🔴 Operazione irreversibile. Elimina permanentemente i dati delle categorie selezionate. Non tocca account utente, profili o configurazioni generali.'
      )
    , !showPanel
      ? React.createElement('button', {onClick:()=>setShowPanel(true),
          style:{padding:'9px 18px',borderRadius:8,border:`1px solid ${C.red}`,background:C.redBg,color:C.red,cursor:'pointer',fontSize:13,fontWeight:600}}
        , '🗑️ Apri pannello reset')
      : React.createElement('div', null
        , React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}
            , CATEGORIE_RESET.map(cat => React.createElement('label', {key:cat.id,
                style:{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:selected[cat.id]?C.redBg:C.bg,border:`1px solid ${selected[cat.id]?C.redBorder:C.border}`,borderRadius:8,cursor:'pointer'}}
                , React.createElement('input',{type:'checkbox', checked:!!selected[cat.id], onChange:()=>toggle(cat.id), style:{width:16,height:16,cursor:'pointer'}})
                , React.createElement('div',{style:{flex:1}}
                  , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:selected[cat.id]?C.red:C.text}}, cat.label)
                  , React.createElement('div',{style:{fontSize:11,color:C.textDim}}, cat.desc)
                )
                , selected[cat.id] && React.createElement('span',{style:{fontSize:12,fontWeight:700,color:C.red}}
                    , loadingCounts ? '...' : (counts[cat.id]!==undefined ? counts[cat.id]+' record' : '')
                  )
              ))
          )
        , selectedIds.length > 0 && React.createElement('div', {style:{padding:'12px 14px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:14}}
            , React.createElement('div',{style:{fontSize:13,fontWeight:600,marginBottom:10}}, `Stai per eliminare ${totaleRecord} record totali da ${selectedIds.length} categorie.`)
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,display:'block',marginBottom:5}}, 'Scrivi "ELIMINA" per confermare:')
            , React.createElement('input',{type:'text', value:confirmText, onChange:e=>setConfirmText(e.target.value), placeholder:'ELIMINA',
                style:{width:'100%',padding:'8px 12px',borderRadius:7,border:`1px solid ${C.redBorder}`,background:C.bg,color:C.text,fontSize:14,fontFamily:"'Open Sans',sans-serif",boxSizing:'border-box'}})
          )
        , React.createElement('div', {style:{display:'flex',gap:10,justifyContent:'flex-end'}}
            , React.createElement('button', {onClick:()=>{setShowPanel(false);setSelected({});setConfirmText('');},
                style:{padding:'9px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13}}, 'Annulla')
            , React.createElement('button', {onClick:handleReset, disabled:resetting||selectedIds.length===0||confirmText!=='ELIMINA',
                style:{padding:'9px 20px',borderRadius:8,border:'none',
                  background:(resetting||selectedIds.length===0||confirmText!=='ELIMINA')?C.border:C.red,
                  color:'#fff',cursor:(resetting||selectedIds.length===0||confirmText!=='ELIMINA')?'not-allowed':'pointer',fontSize:13,fontWeight:700}}
              , resetting?'⏳ Eliminazione...':'🗑️ Esegui reset definitivo')
          )
      )
  );
};

const ImpostazioniView = ({ config, setConfig, panels: propPanels, setPanels: propSetPanels, ruolo: propRuolo, setRuolo: propSetRuolo, anniScolastici: propAnni, setAnniScolastici: propSetAnni, setIscrizioniAnno: propSetIscrizioniAnno }) => {
  const [draft, setDraft] = useState(config||CONFIG_DEFAULT);
  // NON aggiornare draft quando config cambia dall'esterno — altrimenti handleSave viene interrotto
  // Il draft viene aggiornato solo dall'utente che modifica i campi
  const setD  = (k,v) => setDraft(p=>({...p,[k]:v}));
  const setRS = (k,v) => setDraft(p=>({...p, ricevutaStyle:{...(p.ricevutaStyle||{}), [k]:v}}));
  const rs = draft.ricevutaStyle || {};
  const ac = rs.accentColor || "#1a4fa0";
  const [saveError, setSaveError] = useState('');

  // Panels e Ruolo locali se non passati dall'esterno
  const [_lPanels, _setLPanels] = useState({});
  const [_lRuolo,  _setLRuolo]  = useState("admin");
  const panels    = propPanels    !== undefined ? propPanels    : _lPanels;
  const setPanels = propSetPanels !== undefined ? propSetPanels : _setLPanels;
  const ruolo     = propRuolo     !== undefined ? propRuolo     : _lRuolo;
  const setRuolo  = propSetRuolo  !== undefined ? propSetRuolo  : _setLRuolo;

  // Popup DOM nativo
  const showPopup = (ok, msg) => {
    // Rimuovi popup precedente
    const existing = document.getElementById('fm-save-popup');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = 'fm-save-popup';
    el.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:999999;padding:16px 32px;border-radius:12px;font-family:"Open Sans",sans-serif;font-size:15px;font-weight:600;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.4);white-space:nowrap;' + (ok ? 'background:#16a34a;' : 'background:#dc2626;');
    el.textContent = (ok ? '✅  ' : '❌  ') + msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ok ? 3000 : 7000);
  };

  const handleSave = async () => {
    // Feedback immediato che il click è stato ricevuto
    const btn = document.querySelector('[data-fm-save-btn]');
    if (btn) { btn.textContent = '⏳ Salvataggio...'; btn.disabled = true; }

    const restore = () => {
      if (btn) { btn.textContent = '💾 Salva impostazioni'; btn.disabled = false; }
    };

    const SUPABASE_URL  = 'https://ocsxrjommtrjelnbihfr.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc3hyam9tbXRyamVsbmJpaGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjE0NDAsImV4cCI6MjA4NzkzNzQ0MH0.ScXeqKD73hu1zMwVWppybmNRqCtKWnR9C_pfNMjwQio';

    // Token sessione — OBBLIGATORIO per operazioni di scrittura
    let authToken = SUPABASE_ANON;
    try {
      const sb = window.supabaseClient;
      if (sb) {
        const { data } = await sb.auth.getSession();
        if (data?.session?.access_token) {
          authToken = data.session.access_token;
        } else {
          restore();
          showPopup(false, 'Sessione scaduta — rieffettua il login');
          return;
        }
      }
    } catch(e) {
      restore();
      showPopup(false, 'Errore sessione: ' + (e?.message || e));
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': 'Bearer ' + authToken,
    };

    // Prepara righe (escludi funzioni)
    const rows = [];
    Object.entries(draft).forEach(([chiave, valore]) => {
      if (typeof valore === 'function') return;
      rows.push({
        chiave,
        valore: valore == null ? '' : typeof valore === 'object' ? JSON.stringify(valore) : String(valore),
      });
    });

    try {
      // 1. DELETE tutto tranne una chiave impossibile
      const delRes = await fetch(`${SUPABASE_URL}/rest/v1/sito_config?chiave=neq.___x___`, {
        method: 'DELETE', headers
      });
      if (!delRes.ok && delRes.status !== 404) {
        const body = await delRes.text();
        restore();
        showPopup(false, `Delete fallita (${delRes.status}): ${body.slice(0,80)}`);
        return;
      }

      // 2. INSERT tutte le righe
      const insRes = await fetch(`${SUPABASE_URL}/rest/v1/sito_config`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(rows),
      });

      if (!insRes.ok) {
        const body = await insRes.text();
        restore();
        showPopup(false, `Salvataggio fallito (${insRes.status}): ${body.slice(0,80)}`);
        return;
      }

      // Successo
      setConfig({...draft});
      restore();
      showPopup(true, 'Impostazioni salvate!');

    } catch(e) {
      restore();
      showPopup(false, 'Errore rete: ' + (e?.message || String(e)));
    }
  };

  return React.createElement('div', {style:{maxWidth:800,margin:"0 auto",padding:"24px 24px"}}
    , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}
      , React.createElement('div', null
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,margin:0}}, "Impostazioni")
        , React.createElement('p', {style:{fontSize:13,color:C.textMuted,marginTop:4}}, "Configurazione generale del gestionale")
      )
    , React.createElement('button', {'data-fm-save-btn':true, onClick:handleSave,
        style:{display:"flex",alignItems:"center",gap:7,padding:"10px 20px",borderRadius:9,
          border:"none", background:C.gold, color:"#ffffff", cursor:"pointer",
          fontSize:13, fontWeight:600, fontFamily:"'Open Sans',sans-serif"}}
      , React.createElement(Ic,{n:"check", size:14, stroke:"#ffffff"})
      , "💾 Salva impostazioni"
    )
    )

    , React.createElement(ImpSection, {title:"Identità scuola", icon:"flag"}
      , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}
        , React.createElement(Input,{label:"Nome scuola", value:draft.nomeScuola||"", onChange:e=>setD("nomeScuola",e.target.value), placeholder:"Accademia Musicale"})
        , React.createElement(Input,{label:"Tipo ente", value:draft.tipoEnte||"", onChange:e=>setD("tipoEnte",e.target.value), placeholder:"Associazione no-profit"})
        , React.createElement(Input,{label:"Indirizzo", value:draft.indirizzo||"", onChange:e=>setD("indirizzo",e.target.value), placeholder:"Via..."})
        , React.createElement(Input,{label:"Codice fiscale", value:draft.codiceFiscale||"", onChange:e=>setD("codiceFiscale",e.target.value), placeholder:"CF..."})
        , React.createElement(Input,{label:"Partita IVA", value:draft.pIva||"", onChange:e=>setD("pIva",e.target.value), placeholder:"P.IVA..."})
        , React.createElement(Input,{label:"Telefono", value:draft.telefono||"", onChange:e=>setD("telefono",e.target.value), placeholder:"+39..."})
        , React.createElement(Input,{label:"Email", value:draft.email||"", onChange:e=>setD("email",e.target.value), placeholder:"info@..."})
        , React.createElement(Input,{label:"Codice SDI", value:draft.sdi||"", onChange:e=>setD("sdi",e.target.value), placeholder:"SDI..."})
        , React.createElement(Input,{label:"IBAN", value:draft.iban||"", onChange:e=>setD("iban",e.target.value), placeholder:"IT..."})
        , React.createElement(Input,{label:"Intestatario conto", value:draft.intestatarioConto||"", onChange:e=>setD("intestatarioConto",e.target.value), placeholder:"..."})
        , React.createElement(Input,{label:"Anno scolastico", value:draft.annoScolastico||"", onChange:e=>setD("annoScolastico",e.target.value), placeholder:"2024/2025"})
        , React.createElement(Input,{label:"Nota ricevuta", value:draft.notaRicevuta||"", onChange:e=>setD("notaRicevuta",e.target.value), placeholder:"Ricevuta non fiscale..."})
      )
    )

    /* ── Sale lezioni ──────────────────────────────────────────────────────── */
    , React.createElement(ImpSection, {title:"Sale e aule", icon:"home"}
      , React.createElement('div', {style:{fontSize:13,color:C.textMuted,marginBottom:12}},
          'Gestisci le sale dove si svolgono le lezioni. Le sale appaiono nel form di creazione lezione.')
      , React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:8,marginBottom:10}}
        , (draft.sale||[]).map((sala, i) =>
            React.createElement('div', {key:i, style:{display:'flex',alignItems:'center',gap:8}}
              , React.createElement('input', {type:'text', value:sala, placeholder:'Es. Sala A, Studio 1...',
                  onChange: e => {const ns=[...(draft.sale||[])]; ns[i]=e.target.value; setD('sale',ns);},
                  style:{flex:1,padding:'7px 10px',borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif"}})
              , React.createElement('button', {onClick:()=>setD('sale',(draft.sale||[]).filter((_,j)=>j!==i)),
                  style:{padding:'6px 10px',borderRadius:6,border:`1px solid ${C.redBorder}`,background:C.redBg,color:C.red,cursor:'pointer',fontSize:12}}, '✕')
            )
          )
      )
      , React.createElement('button', {
          onClick:()=>setD('sale',[...(draft.sale||[]),'Sala A'.replace('A',String.fromCharCode(65+(draft.sale||[]).length))]),
          style:{padding:'7px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:'pointer',fontSize:12,fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:6}}
        , React.createElement(Ic,{n:'plus',size:13,stroke:C.textMuted}), '+ Aggiungi sala'
      )
    )

    /* ── Anni scolastici ────────────────────────────────────────────────────── */
    , React.createElement(ImpSection, {title:"Archivio anni scolastici", icon:"cal"}
      , React.createElement('div', {style:{fontSize:13,color:C.textMuted,marginBottom:12}},
          'Gestisci gli anni scolastici. Imposta quello attivo e i mesi in cui si svolgono le lezioni.')
      , (() => {
          const MESI_LABEL = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
          const anni = propAnni || [];
          const annoAttivo = draft.annoInizioAttivo || (anni[0] && anni[0].annoInizio) || new Date().getFullYear();

          const handleSetAttivo = async (annoInizio) => {
            setD('annoInizioAttivo', annoInizio);
            const sb = window.supabaseClient; if (!sb) return;
            // Disattiva TUTTI, poi attiva quello scelto
            await sb.from('anni_scolastici').update({attivo:false}).gt('anno_inizio', 0);
            await sb.from('anni_scolastici').update({attivo:true}).eq('anno_inizio', annoInizio);
            // Salva anche nel config così persiste al ricaricamento
            await sb.from('sito_config').upsert(
              {chiave:'annoInizioAttivo', valore: String(annoInizio)},
              {onConflict:'chiave'}
            );
            // Aggiorna anche lo sharedConfig globale
            if (setConfig) setConfig(p => ({...p, annoInizioAttivo: annoInizio}));
            showToast && showToast(true, `Anno scolastico ${annoInizio}/${annoInizio+1} impostato come attivo ✅`);
          };

          const handleToggleMese = async (annoInizio, mese) => {
            const anno = anni.find(a => a.annoInizio === annoInizio); if (!anno) return;
            const mesiAttivi = anno.mesiAttivi || [];
            const nuovi = mesiAttivi.includes(mese) ? mesiAttivi.filter(m=>m!==mese) : [...mesiAttivi, mese].sort((a,b)=>a-b);
            if (propSetAnni) propSetAnni(prev => prev.map(a => a.annoInizio===annoInizio ? {...a, mesiAttivi:nuovi} : a));
            const sb = window.supabaseClient; if (!sb) return;
            await sb.from('anni_scolastici').update({mesi_attivi: nuovi}).eq('anno_inizio', annoInizio);
          };

          const handleAddAnno = async () => {
            const ultimoAnno = anni.reduce((max, a) => Math.max(max, a.annoInizio||0), new Date().getFullYear()-1);
            const nuovoInizio = ultimoAnno + 1;
            const nuovoAnno = { annoInizio: nuovoInizio, annoFine: nuovoInizio+1, mesiAttivi:[0,1,2,3,4,8,9,10,11], attivo:false };
            if (propSetAnni) propSetAnni(prev => [...prev, nuovoAnno]);
            const sb = window.supabaseClient; if (!sb) return;
            await sb.from('anni_scolastici').upsert({anno_inizio:nuovoInizio, anno_fine:nuovoInizio+1, mesi_attivi:[0,1,2,3,4,8,9,10,11], attivo:false});
          };

          return React.createElement('div', null
            , anni.length === 0 && React.createElement('div',{style:{fontSize:13,color:C.textDim,fontStyle:'italic',marginBottom:12}},'Nessun anno scolastico configurato. Aggiungine uno.')

            , anni.slice().sort((a,b)=>(b.annoInizio||0)-(a.annoInizio||0)).map(anno => {
                const inizio = anno.annoInizio || new Date().getFullYear();
                const fine   = anno.annoFine   || inizio+1;
                const label  = `${inizio}/${fine}`;
                const isAttivo = String(inizio) === String(annoAttivo);
                const mesiAttivi = anno.mesiAttivi || [];

                // Mesi nell'ordine scolastico: set(8), ott(9), nov(10), dic(11), gen(0), feb(1), mar(2), apr(3), mag(4), giu(5), lug(6), ago(7)
                const ORDINE_SCOLASTICO = [8,9,10,11,0,1,2,3,4,5,6,7];

                return React.createElement('div', {key:inizio, style:{background:isAttivo?`${C.teal}0A`:C.bg, border:`1px solid ${isAttivo?C.teal:C.border}`, borderRadius:10, padding:'14px 16px', marginBottom:10}}
                  , React.createElement('div', {style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}
                    , React.createElement('div', null
                      , React.createElement('span', {style:{fontSize:15,fontWeight:700,color:isAttivo?C.teal:C.text,fontFamily:"'Oswald',sans-serif"}}, label)
                      , isAttivo && React.createElement('span',{style:{marginLeft:8,fontSize:10,background:C.teal,color:'#fff',borderRadius:20,padding:'2px 8px',fontWeight:600}},'ATTIVO')
                    )
                    , !isAttivo && React.createElement('button', {
                        onClick: ()=>handleSetAttivo(inizio),
                        style:{padding:'5px 12px',borderRadius:6,border:`1px solid ${C.teal}`,background:C.tealBg,color:C.teal,cursor:'pointer',fontSize:11,fontWeight:600}
                      }, '→ Imposta attivo')
                  )
                  /* Mesi nell'ordine scolastico con anno di riferimento */
                  , React.createElement('div', {style:{display:'flex',flexWrap:'wrap',gap:5}}
                    , ORDINE_SCOLASTICO.map(m => {
                        const annoRif = m >= 8 ? inizio : fine;
                        const sel = mesiAttivi.includes(m);
                        return React.createElement('button', {key:m, onClick:()=>handleToggleMese(inizio,m),
                          style:{padding:'4px 8px',borderRadius:20,border:`1px solid ${sel?C.teal:C.border}`,background:sel?C.teal:C.bg,color:sel?'#fff':C.textMuted,cursor:'pointer',fontSize:11,fontFamily:"'Open Sans',sans-serif"}}
                          , MESI_LABEL[m].slice(0,3)+' '+String(annoRif).slice(2)
                        );
                      })
                  )
                );
              })

            , React.createElement('button', {onClick:handleAddAnno,
                style:{marginTop:6,padding:'7px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:'pointer',fontSize:12,fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:6}}
              , React.createElement(Ic,{n:'plus',size:13,stroke:C.textMuted}), '+ Aggiungi anno scolastico'
            )

            /* Migrazione una tantum: crea iscrizioni_anno per allievi esistenti */
            , React.createElement('div', {style:{marginTop:18,paddingTop:16,borderTop:`1px solid ${C.border}`}}
              , React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginBottom:8}},
                  '⚠️ Se hai appena attivato questa funzione, importa gli allievi esistenti come iscritti all\'anno attivo:')
              , React.createElement('button', {
                  onClick: async () => {
                    if (!window.confirm(`Iscrivere tutti gli allievi attivi all'anno ${annoAttivo}/${annoAttivo+1}? (Userà il corso/docente attuale di ciascuno)`)) return;
                    const sb = window.supabaseClient; if (!sb) return;
                    const allStu = (window.__FM_DATA__&&window.__FM_DATA__.students) || [];
                    const allCourses = (window.__FM_DATA__&&window.__FM_DATA__.courses) || [];
                    if (allStu.length === 0) { alert('⚠️ Nessun allievo trovato in window.__FM_DATA__.students.\nProva a ricaricare la pagina e riprova.'); return; }
                    const annoInt = parseInt(annoAttivo) || annoAttivo;
                    const righe = allStu.filter(s=>s.status!=='inattivo').map(s => {
                      const corso = allCourses.find(c=>String(c.id)===String(s.courseId)||c.name===s.course);
                      return {
                        studente_id: parseInt(s.id)||s.id,
                        anno_inizio: annoInt,
                        corso_id: corso?String(corso.id):null,
                        corso_nome: corso?(corso.name||corso.nome):(s.course||''),
                        docente_id: null,
                        docente_nome: s.teacher||s.docente||'',
                        data_iscrizione: yyyymmdd(new Date()),
                      };
                    });
                    if (righe.length===0) { alert('Nessun allievo da migrare (tutti segnati come inattivi?)'); return; }
                    const { data: inserted, error } = await sb.from('iscrizioni_anno')
                      .upsert(righe, {onConflict:'studente_id,anno_inizio'})
                      .select();
                    if (error) { alert('❌ Errore upsert:\n'+error.message+'\n\nVerifica che la tabella iscrizioni_anno e le sue RLS siano configurate correttamente.'); return; }
                    // Verifica effettiva nel DB con una query di conferma
                    const { count: countDB } = await sb.from('iscrizioni_anno')
                      .select('*', { count: 'exact', head: true })
                      .eq('anno_inizio', annoInt);
                    alert(`✅ Operazione completata.\n\n`+
                      `Righe inviate: ${righe.length}\n`+
                      `Righe confermate dal DB (upsert): ${inserted?inserted.length:'?'}\n`+
                      `Totale righe in iscrizioni_anno per l'anno ${annoInt}: ${countDB}\n\n`+
                      `Se "Totale righe" è 0, il problema è nelle RLS o nel valore di anno_inizio. Se è > 0, ricarica la pagina (F5) — i dati dovrebbero apparire.`);
                    // Aggiorna subito lo stato locale, senza aspettare il refresh
                    if (inserted && inserted.length > 0 && typeof propSetIscrizioniAnno === 'function') {
                      const nuoveLocali = inserted.map(r => ({
                        id:r.id, studentId:r.studente_id, annoInizio:r.anno_inizio,
                        corsoId:r.corso_id||'', corsoNome:r.corso_nome||'',
                        docenteId:r.docente_id||'', docenteNome:r.docente_nome||'',
                        dataIscrizione:r.data_iscrizione||'',
                      }));
                      propSetIscrizioniAnno(prev => {
                        const idsNuovi = new Set(nuoveLocali.map(n=>`${n.studentId}-${n.annoInizio}`));
                        const filtratiVecchi = prev.filter(p=>!idsNuovi.has(`${p.studentId}-${p.annoInizio}`));
                        return [...filtratiVecchi, ...nuoveLocali];
                      });
                    }
                    if (window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__();
                  },
                  style:{padding:'7px 16px',borderRadius:8,border:`1px solid ${C.gold}`,background:C.goldBg,color:C.gold,cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Open Sans',sans-serif"}
                }, '🔄 Migra allievi esistenti nell\'anno attivo')
            )
          );
        })()
    )

    /* ── Contatore ricevute ─────────────────────────────────────────────────── */
    , React.createElement(ImpSection, {title:"Contatore ricevute", icon:"receipt"}
      , React.createElement('div', {style:{fontSize:13,color:C.textMuted,marginBottom:12}},
          'Il contatore si azzera automaticamente ogni 1° gennaio. Puoi impostare il numero di partenza per l\'anno corrente.')
      , (() => {
          const annoCorrente = new Date().getFullYear();
          const contatoriAnni = draft.contatoriRicevute || {};
          const annoSolare = String(annoCorrente);
          const valoreCorrente = contatoriAnni[annoSolare] ?? draft.progressivoRicevute ?? 1;

          return React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:14}}
            /* Anno corrente */
            , React.createElement('div', {style:{background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:10,padding:'14px 16px'}}
              , React.createElement('div',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6}},'📋 Anno solare corrente: ',annoCorrente)
              , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:12}}
                , React.createElement('div',{style:{fontSize:12,color:C.textMuted}},'Prossimo n° ricevuta:')
                , React.createElement('input',{type:'number',min:1,value:valoreCorrente,
                    onChange: e => {
                      const v = parseInt(e.target.value)||1;
                      const nuovi = {...(draft.contatoriRicevute||{}), [annoSolare]: v};
                      setD('contatoriRicevute', nuovi);
                      setD('progressivoRicevute', v);
                    },
                    style:{width:90,padding:'6px 10px',borderRadius:7,border:`1px solid ${C.teal}`,background:C.surface,color:C.text,fontSize:14,fontWeight:700,textAlign:'center',fontFamily:"'Oswald',sans-serif"}})
              )
            )
            /* Anni precedenti */
            , Object.keys(contatoriAnni).filter(a=>a!==annoSolare).sort((a,b)=>b-a).map(anno =>
                React.createElement('div', {key:anno, style:{display:'flex',alignItems:'center',gap:12,padding:'8px 12px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}}
                  , React.createElement('span',{style:{fontSize:12,color:C.textMuted,minWidth:60}},'Anno '+anno)
                  , React.createElement('span',{style:{fontSize:13,color:C.textDim}},'Ultimo n° emesso: ')
                  , React.createElement('span',{style:{fontSize:13,fontWeight:600,color:C.text}},contatoriAnni[anno])
                )
              )
          );
        })()
    )

    /* ── Reset dati (solo admin) ──────────────────────────────────────────── */
    , (propRuolo==="admin"||!propRuolo) && React.createElement(ResetDatiSection)

    , React.createElement(ImpSection, {title:"Stile grafico app", icon:"palette"}
      , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}
        , React.createElement('div', {style:{marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Colore accento principale")
          , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}
            , ["#1a4fa0","#2d6a8f","#6a4c93","#2a7d4f","#c0392b","#e67e22","#1a1a2e"].map(col=>
                React.createElement('button', {key:col, onClick:()=>setD("accentColor",col),
                  style:{width:28,height:28,borderRadius:"50%",background:col,
                    border:(draft.accentColor||"#1a4fa0")===col?"3px solid #fff":"2px solid transparent",
                    outline:(draft.accentColor||"#1a4fa0")===col?`2px solid ${col}`:"none",cursor:"pointer"}})
              )
          )
          , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
            , React.createElement('input', {type:"color", value:draft.accentColor||"#1a4fa0", onChange:e=>setD("accentColor",e.target.value),
                style:{width:32,height:32,borderRadius:8,border:"none",cursor:"pointer",padding:0}})
            , React.createElement('span',{style:{fontSize:12,color:C.textMuted}}, "Colore personalizzato")
          )
        )
        , React.createElement('div', {style:{marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Tema")
          , React.createElement('div', {style:{display:"flex",gap:8}}
            , ["Scuro","Chiaro"].map(t=>React.createElement('button', {key:t, onClick:()=>setD("tema",t.toLowerCase()),
                style:{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${(draft.tema||"scuro")===t.toLowerCase()?C.gold:C.border}`,
                  background:(draft.tema||"scuro")===t.toLowerCase()?C.goldBg:C.bg,color:(draft.tema||"scuro")===t.toLowerCase()?C.gold:C.textMuted,
                  cursor:"pointer",fontSize:12,fontFamily:"'Open Sans',sans-serif"}}, t))
          )
          , React.createElement('p',{style:{fontSize:11,color:C.textDim,marginTop:6}},"Nota: il cambio tema sarà applicato al prossimo caricamento")
        )
      )
    )

    , React.createElement(ImpSection, {title:"Impostazioni ricevuta", icon:"receipt"}
      , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px",marginBottom:16}}
        , React.createElement('div', {style:{marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Colore accento ricevuta")
          , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}
            , ["#1a4fa0","#2d6a8f","#6a4c93","#2a7d4f","#c0392b","#1a1a2e"].map(col=>
                React.createElement('button', {key:col, onClick:()=>setRS("accentColor",col),
                  style:{width:26,height:26,borderRadius:"50%",background:col,
                    border:ac===col?"3px solid #fff":"2px solid transparent",
                    outline:ac===col?`2px solid ${col}`:"none",cursor:"pointer"}})
              )
          )
          , React.createElement('input', {type:"color", value:ac, onChange:e=>setRS("accentColor",e.target.value),
              style:{width:30,height:30,borderRadius:6,border:"none",cursor:"pointer",padding:0}})
        )
        , React.createElement('div', {style:{marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Font intestazione ricevuta")
          , ["Cormorant Garamond","Georgia","Times New Roman","Arial"].map(f=>
              React.createElement('label', {key:f, style:{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"3px 0",fontSize:12,color:(rs.fontTitle||"Cormorant Garamond")===f?C.text:C.textMuted}}
                , React.createElement('input', {type:"radio", checked:(rs.fontTitle||"Cormorant Garamond")===f, onChange:()=>setRS("fontTitle",f), style:{accentColor:ac}})
                , React.createElement('span',{style:{fontFamily:f}}, f)
              )
            )
        )
      )
      , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:16}}
        , React.createElement(ImpRSToggle,{k:"showIndirizzo",    label:"Indirizzo scuola",  rs:rs,ac:ac,setRS:setRS})
        , React.createElement(ImpRSToggle,{k:"showDataNascita", label:"Data di nascita",    rs:rs,ac:ac,setRS:setRS})
        , React.createElement(ImpRSToggle,{k:"showFirme",       label:"Spazio firme",       rs:rs,ac:ac,setRS:setRS})
        , React.createElement(ImpRSToggle,{k:"showFooter",      label:"Footer",             rs:rs,ac:ac,setRS:setRS})
        , React.createElement(ImpRSToggle,{k:"showCompetenza",  label:"Competenza",         rs:rs,ac:ac,setRS:setRS})
        , React.createElement(ImpRSToggle,{k:"showMetodo",      label:"Metodo pagamento",   rs:rs,ac:ac,setRS:setRS})
      )
      /* Anteprima live ricevuta */
      , React.createElement('div', {style:{background:"#f0ede8",borderRadius:10,padding:"14px",marginBottom:18}}
        , React.createElement('div', {style:{fontSize:10,color:"#888",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}, "Anteprima")
        , React.createElement('div', {style:{background:"#fff",borderRadius:8,padding:"16px 20px",boxShadow:"0 2px 10px rgba(0,0,0,.12)",fontSize:10,maxWidth:340}}
          , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:`2px solid ${ac}`,paddingBottom:8,marginBottom:10}}
            , React.createElement('div', null
              , React.createElement('div', {style:{fontFamily:`'${rs.fontTitle||"Oswald"}',sans-serif`,fontSize:14,fontWeight:700,color:"#1a1a2e"}}, draft.nomeScuola||"Accademia Musicale")
              , draft.tipoEnte && React.createElement('div', {style:{fontSize:8,color:"#888",textTransform:"uppercase",letterSpacing:".08em",marginTop:1}}, draft.tipoEnte)
              , rs.showIndirizzo!==false && draft.indirizzo && React.createElement('div', {style:{fontSize:8,color:"#666",marginTop:1}}, draft.indirizzo)
            )
            , React.createElement('div', {style:{textAlign:"right"}}
              , React.createElement('div', {style:{fontSize:8,color:"#888",textTransform:"uppercase"}}, "Ricevuta n°")
              , React.createElement('div', {style:{fontFamily:`'${rs.fontTitle||"Oswald"}',sans-serif`,fontSize:16,fontWeight:700,color:ac,lineHeight:1}}, "029/2026")
              , React.createElement('div', {style:{fontSize:8,color:"#888",marginTop:1}}, "05/03/2026")
            )
          )
          , [
              rs.showNominativo!==false   && ["Ricevuta da","Giulia Romano"],
              rs.showDataNascita!==false  && ["Data di nascita","30/09/2011"],
              rs.showDataPagamento!==false&& ["Data pagamento","01/03/2026"],
              rs.showDescrizione!==false  && ["Descrizione","Quota mensile Marzo 2026"],
              rs.showCompetenza!==false   && ["Competenza","Marzo 2026"],
              rs.showMetodo!==false       && ["Metodo","Bonifico bancario"],
            ].filter(Boolean).map(([k,v],i,arr)=>
              React.createElement('div', {key:k, style:{display:"flex",justifyContent:"space-between",padding:"3px 0",
                borderBottom:i<arr.length-1?"1px solid #eee":"none"}}
                , React.createElement('span', {style:{color:"#888",fontSize:9}}, k)
                , React.createElement('span', {style:{fontWeight:600,color:"#1a1a2e",fontSize:9}}, v)
              )
            )
          , React.createElement('div', {style:{textAlign:"center",margin:"8px 0",padding:"8px",border:`2px solid ${ac}`,borderRadius:5,background:ac+"15"}}
            , React.createElement('div', {style:{fontFamily:`'${rs.fontTitle||"Oswald"}',sans-serif`,fontSize:18,fontWeight:700,color:ac}}, "€ 120,00")
            , React.createElement('div', {style:{fontSize:8,color:"#888",textTransform:"uppercase",letterSpacing:".1em",marginTop:1}}, "Importo ricevuto")
          )
          , rs.showFirme!==false && React.createElement('div', {style:{display:"flex",justifyContent:"space-between",marginTop:10}}
            , [rs.labelPagante||"Il pagante",rs.labelCassiere||"Il cassiere"].map(l=>
                React.createElement('div', {key:l, style:{textAlign:"center",width:"42%"}}
                  , React.createElement('div', {style:{borderTop:"1px solid #333",marginBottom:3}})
                  , React.createElement('div', {style:{fontSize:8,color:"#888",textTransform:"uppercase",letterSpacing:".05em"}}, l)
                )
              )
          )
          , rs.showFooter!==false && React.createElement('div', {style:{marginTop:6,paddingTop:5,borderTop:"1px solid #eee",textAlign:"center",fontSize:8,color:"#888"}}
            , draft.notaRicevuta||"Ricevuta non fiscale"
          )
        )
      )
      , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}
        , React.createElement('div', {style:{marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Etichetta firma sinistra")
          , React.createElement('input', {value:rs.labelPagante||"Il pagante", onChange:e=>setRS("labelPagante",e.target.value),
              style:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 13px",fontFamily:"'Open Sans',sans-serif"}})
        )
        , React.createElement('div', {style:{marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Etichetta firma destra")
          , React.createElement('input', {value:rs.labelCassiere||"Il cassiere / responsabile", onChange:e=>setRS("labelCassiere",e.target.value),
              style:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:"9px 13px",fontFamily:"'Open Sans',sans-serif"}})
        )
        , React.createElement('div', {style:{gridColumn:"1/-1",marginBottom:14}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Firma presidente (immagine per stampa)")
          , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:12}}
            , rs.firmaPresidenteUrl && React.createElement('img', {src:rs.firmaPresidenteUrl, alt:"firma",
                style:{height:50,maxWidth:180,objectFit:"contain",background:"#fff",borderRadius:6,border:`1px solid ${C.border}`,padding:4}})
            , React.createElement('label', {style:{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",borderRadius:8,
                border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:"pointer",fontSize:12}}
              , React.createElement(Ic,{n:"upload",size:13,stroke:C.textMuted})
              , rs.firmaPresidenteUrl ? "Cambia immagine" : "Carica firma"
              , React.createElement('input', {type:"file",accept:"image/*",style:{display:"none"},
                  onChange:e=>{const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>setRS("firmaPresidenteUrl",ev.target.result); r.readAsDataURL(f);}})
            )
            , rs.firmaPresidenteUrl && React.createElement('button', {onClick:()=>setRS("firmaPresidenteUrl",""),
                style:{background:"none",border:"none",cursor:"pointer",color:C.textDim,fontSize:11}}, "✕ Rimuovi")
          )
          , React.createElement('p',{style:{fontSize:11,color:C.textDim,marginTop:4}}, "La firma verrà stampata nello spazio «", rs.labelCassiere||"Il cassiere / responsabile", "»")
        )
        , React.createElement('div', {style:{gridColumn:"1/-1",marginBottom:4}}
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Note aggiuntive footer ricevuta")
          , React.createElement('textarea', {value:rs.noteFooter||"", onChange:e=>setRS("noteFooter",e.target.value),
              placeholder:"Es. IBAN IT00..., note legali...", rows:2,
              style:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12,padding:"9px 13px",fontFamily:"'Open Sans',sans-serif",resize:"vertical"}})
        )
      )
    )

    /* ── Pannelli Dashboard ── */
    , React.createElement(ImpSection, {title:"Pannelli Dashboard", icon:"grid"}
      , React.createElement('p',{style:{fontSize:12,color:C.textDim,marginBottom:14}}, "Scegli quali sezioni mostrare nella dashboard. Le KPI card sono sempre visibili.")
      , React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:6}}
        , PANNELLI_DEF.map(function(p){
          const on = panels[p.id]!==false;
          return React.createElement('div', {key:p.id,
            style:{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
              borderRadius:10,border:`1px solid ${on&&!p.sempre?C.goldDim:C.border}`,
              background:on&&!p.sempre?C.goldBg:C.bg,transition:"all .15s",opacity:p.sempre?0.6:1}},
            React.createElement('div', {style:{width:32,height:32,borderRadius:8,
              background:on?`${C.gold}18`:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}},
              React.createElement(Ic,{n:p.icon,size:15,stroke:on?C.gold:C.textDim})
            ),
            React.createElement('div', {style:{flex:1}},
              React.createElement('div',{style:{fontSize:13,fontWeight:500,color:on?C.text:C.textMuted}}, p.label),
              React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:1}}, p.desc)
            ),
            p.sempre
              ? React.createElement('span',{style:{fontSize:10,color:C.textDim,letterSpacing:".06em"}}, "FISSO")
              : React.createElement(Toggle, {value:on, onChange:function(v){ setPanels(function(prev){ return Object.assign({},prev,{[p.id]:v}); }); }})
          );
        })
      )
    )

    /* ── Simulazione Ruolo ── */
    , React.createElement(ImpSection, {title:"Simulazione Ruolo", icon:"shield"}
      , React.createElement('p',{style:{fontSize:12,color:C.textDim,marginBottom:14}}, "Simula la vista per un ruolo diverso. Le voci del menu laterale vengono filtrate di conseguenza.")
      , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},className:"form-2col"}
        , DASH_RUOLI.map(function(r){
          return React.createElement('button', {key:r.id, onClick:function(){ setRuolo(r.id); },
            style:{padding:"12px 14px",borderRadius:10,textAlign:"left",cursor:"pointer",
              fontFamily:"'Open Sans',sans-serif",transition:"all .15s",
              background:ruolo===r.id?`${r.hex}18`:C.bg,
              border:`1.5px solid ${ruolo===r.id?r.hex:C.border}`}},
            React.createElement('div',{style:{fontSize:13,fontWeight:500,color:ruolo===r.id?r.hex:C.text}}, r.label),
            React.createElement('div',{style:{fontSize:10,color:C.textDim,marginTop:3}}, r.desc)
          );
        })
      )
      , React.createElement('div',{style:{marginTop:12,padding:"8px 12px",borderRadius:8,background:C.goldBg,border:`1px solid ${C.goldDim}`,fontSize:12,color:C.gold}},
        "► Ruolo attivo: ",
        React.createElement('strong',null, (DASH_RUOLI.find(function(r){ return r.id===ruolo; })||{label:"—"}).label),
        " — le voci del menu cambieranno di conseguenza."
      )
    )

    /* ── Google Calendar ─────────────────────────────────────────────────── */
    , React.createElement(ImpSection, {title:"Google Calendar", icon:"calendar"}
      , typeof GoogleCalendarSection !== 'undefined'
        ? React.createElement(GoogleCalendarSection, {appUser: window.__appUser__||null})
        : React.createElement('div', {style:{fontSize:13,color:C.textMuted}}, '⏳ Caricamento modulo Google Calendar...')
    )

    /* ── Chiusure personalizzate ──────────────────────────────────────────── */
    , React.createElement(ImpSection, {title:"Chiusure e festività", icon:"cal"}
      // Festività nazionali con toggle aperto/chiuso
      , React.createElement('div', {style:{marginBottom:20}}
        , React.createElement('div', {style:{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}, '🇮🇹 Festività nazionali')
        , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginBottom:12}},
            'Per default la scuola è chiusa in tutte le festività. Disattiva per segnare che fate lezione.')
        , React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:8}}
          , Object.entries(getItalianHolidays(new Date().getFullYear())).sort((a,b)=>a[0].localeCompare(b[0])).map(([dateStr, h]) => {
              const isAperta = (draft.festivitaConfig||{})[dateStr] === false;
              return React.createElement('div', {key:dateStr, style:{display:'flex',alignItems:'center',gap:12,padding:'8px 12px',borderRadius:8,background:isAperta?C.greenBg:C.redBg,border:`1px solid ${isAperta?C.greenBorder:C.redBorder}`}}
                , React.createElement('span',{style:{fontSize:16}}, h.emoji)
                , React.createElement('div',{style:{flex:1}}
                  , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:isAperta?C.green:'#b91c1c'}}, h.label)
                  , React.createElement('div',{style:{fontSize:11,color:C.textMuted}}, dateStr.split('-').reverse().join('/'))
                )
                , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8}}
                  , React.createElement('span',{style:{fontSize:11,color:isAperta?C.green:'#b91c1c',fontWeight:600}}, isAperta?'APERTO':'CHIUSO')
                  , React.createElement('button', {
                      onClick: () => {
                        const fc = {...(draft.festivitaConfig||{})};
                        if (isAperta) { delete fc[dateStr]; } else { fc[dateStr] = false; }
                        setD('festivitaConfig', fc);
                      },
                      style:{width:40,height:22,borderRadius:11,border:'none',cursor:'pointer',position:'relative',
                        background:isAperta?C.green:'#d1d5db',transition:'background .2s'}
                    }
                    , React.createElement('div',{style:{position:'absolute',top:3,left:isAperta?22:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}})
                  )
                )
              );
            })
        )
      )
      // Chiusure personalizzate (periodi arbitrari)
      , React.createElement('div', null
        , React.createElement('div', {style:{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}, '🔒 Chiusure personalizzate')
        , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginBottom:12}},
            'Aggiungi periodi di chiusura (es. vacanze natalizie, estive). I giorni appariranno con sfondo grigio striato nel calendario.')
        , (draft.giorniChiusi||[]).map((c, i) => (
            React.createElement('div', {key:i, style:{display:'flex',alignItems:'center',gap:8,marginBottom:8,padding:'10px 12px',borderRadius:8,background:C.bg,border:`1px solid ${C.border}`}}
              , React.createElement('div', {style:{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,alignItems:'center'}}
                , React.createElement('div',null
                  , React.createElement('div',{style:{fontSize:10,color:C.textMuted,marginBottom:3,textTransform:'uppercase',letterSpacing:'.05em'}},'Dal')
                  , React.createElement('input',{type:'date',value:c.da||'',onChange:e=>{const nc=[...(draft.giorniChiusi||[])];nc[i]={...nc[i],da:e.target.value};setD('giorniChiusi',nc);},style:{width:'100%',padding:'5px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:12,fontFamily:"'Open Sans',sans-serif"}})
                )
                , React.createElement('div',null
                  , React.createElement('div',{style:{fontSize:10,color:C.textMuted,marginBottom:3,textTransform:'uppercase',letterSpacing:'.05em'}},'Al')
                  , React.createElement('input',{type:'date',value:c.a||'',onChange:e=>{const nc=[...(draft.giorniChiusi||[])];nc[i]={...nc[i],a:e.target.value};setD('giorniChiusi',nc);},style:{width:'100%',padding:'5px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:12,fontFamily:"'Open Sans',sans-serif"}})
                )
                , React.createElement('div',null
                  , React.createElement('div',{style:{fontSize:10,color:C.textMuted,marginBottom:3,textTransform:'uppercase',letterSpacing:'.05em'}},'Etichetta')
                  , React.createElement('input',{type:'text',value:c.etichetta||'',placeholder:'Es. Vacanze natalizie',onChange:e=>{const nc=[...(draft.giorniChiusi||[])];nc[i]={...nc[i],etichetta:e.target.value};setD('giorniChiusi',nc);},style:{width:'100%',padding:'5px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:12,fontFamily:"'Open Sans',sans-serif"}})
                )
              )
              , React.createElement('button',{onClick:()=>{const nc=(draft.giorniChiusi||[]).filter((_,j)=>j!==i);setD('giorniChiusi',nc);},style:{padding:'5px 10px',borderRadius:6,border:`1px solid ${C.redBorder}`,background:C.redBg,color:C.red,cursor:'pointer',fontSize:12,flexShrink:0}},'✕')
            )
          ))
        , React.createElement('button', {
            onClick: () => setD('giorniChiusi', [...(draft.giorniChiusi||[]), {da:'',a:'',etichetta:''}]),
            style:{marginTop:8,padding:'7px 16px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:'pointer',fontSize:12,fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:6}
          }
          , React.createElement(Ic,{n:'plus',size:13,stroke:C.textMuted}), '+ Aggiungi periodo di chiusura'
        )
      )
    )   /* end React.createElement(ImpSection,...) */

  );
};

// ─── SCHEDA SCUOLA VIEW ────────────────────────────────────────────────────────
const SchedaScuolaView = ({ config }) => {
  const cfg = config || CONFIG_DEFAULT;
  const handlePrint = () => {
    const w = window.open("","_blank","width=794,height=1123");
    if(!w){ alert("Abilita i popup per stampare"); return; }
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Scheda Scuola — ${cfg.nomeScuola||""}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Open+Sans:wght@400;500;600&display=swap');
      @page{margin:20mm 22mm;size:A4}
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Open Sans',sans-serif;color:#1a1a2e;background:#fff;font-size:13px}
      .header{border-bottom:2px solid #1a4fa0;padding-bottom:16px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:flex-start}
      .nome{font-family:'Oswald',sans-serif;font-size:28px;font-weight:700}
      .sub{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-top:3px}
      .section{margin-bottom:24px}
      .section-title{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #eee}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px}
      .field label{font-size:10px;color:#888;display:block;margin-bottom:2px}
      .field .val{font-size:13px;font-weight:600;color:#1a1a2e}
      .iban-box{background:#f9f6f0;border:1px solid #1a4fa030;border-radius:8px;padding:14px 18px;margin-top:12px;text-align:center}
      .iban-val{font-family:'Courier New',monospace;font-size:16px;font-weight:700;letter-spacing:.08em;color:#1a4fa0;margin-bottom:3px}
      .footer{margin-top:32px;padding-top:12px;border-top:1px solid #eee;font-size:10px;color:#999;text-align:center}
    </style></head><body>
    <div class="header">
      <div>
        <div class="nome">${cfg.nomeScuola||"Accademia Musicale"}</div>
        <div class="sub">${cfg.tipoEnte||""}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#888">
        <div>Anno scolastico</div>
        <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-top:2px">${cfg.annoScolastico||""}</div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Dati identificativi</div>
      <div class="grid">
        ${cfg.codiceFiscale?`<div class="field"><label>Codice Fiscale</label><div class="val">${cfg.codiceFiscale}</div></div>`:""}
        ${cfg.pIva?`<div class="field"><label>Partita IVA</label><div class="val">${cfg.pIva}</div></div>`:""}
        ${cfg.sdi?`<div class="field"><label>Codice SDI</label><div class="val">${cfg.sdi}</div></div>`:""}
        ${cfg.indirizzo?`<div class="field" style="grid-column:1/-1"><label>Sede legale</label><div class="val">${cfg.indirizzo}</div></div>`:""}
      </div>
    </div>
    <div class="section">
      <div class="section-title">Recapiti</div>
      <div class="grid">
        ${cfg.telefono?`<div class="field"><label>Telefono</label><div class="val">${cfg.telefono}</div></div>`:""}
        ${cfg.email?`<div class="field"><label>Email</label><div class="val">${cfg.email}</div></div>`:""}
      </div>
    </div>
    ${cfg.iban?`<div class="section">
      <div class="section-title">Dati bancari</div>
      ${cfg.intestatarioConto?`<div class="field" style="margin-bottom:8px"><label>Intestatario conto</label><div class="val">${cfg.intestatarioConto}</div></div>`:""}
      <div class="iban-box">
        <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">IBAN</div>
        <div class="iban-val">${cfg.iban}</div>
      </div>
    </div>`:""}
    <div class="footer">${cfg.nomeScuola||""} · ${cfg.notaRicevuta||"Ricevuta non fiscale"} · ${cfg.annoScolastico||""}</div>
    <script>window.onload=function(){window.print();}<\/script>
    </body></html>`);
    w.document.close();
  };

  const cfg_rows = [
    {label:"Nome scuola",        value:cfg.nomeScuola},
    {label:"Tipo ente",          value:cfg.tipoEnte},
    {label:"Anno scolastico",    value:cfg.annoScolastico},
    {label:"Codice Fiscale",     value:cfg.codiceFiscale},
    {label:"Partita IVA",        value:cfg.pIva},
    {label:"Codice SDI",         value:cfg.sdi},
    {label:"Indirizzo",          value:cfg.indirizzo},
    {label:"Telefono",           value:cfg.telefono},
    {label:"Email",              value:cfg.email},
    {label:"IBAN",               value:cfg.iban, mono:true},
    {label:"Intestatario conto", value:cfg.intestatarioConto},
  ].filter(r=>r.value!=null);

  const ALL_FIELDS = [
    {k:"nomeScuola",      label:"Nome scuola"},
    {k:"tipoEnte",        label:"Tipo ente"},
    {k:"annoScolastico",  label:"Anno scolastico"},
    {k:"codiceFiscale",   label:"Codice Fiscale"},
    {k:"pIva",            label:"Partita IVA"},
    {k:"sdi",             label:"Codice SDI"},
    {k:"indirizzo",       label:"Indirizzo"},
    {k:"telefono",        label:"Telefono"},
    {k:"email",           label:"Email"},
    {k:"iban",            label:"IBAN"},
    {k:"intestatarioConto",label:"Intestatario conto"},
    {k:"notaRicevuta",    label:"Nota ricevuta"},
  ];
  const [hidden, setHidden] = useState({});
  const toggleField = k => setHidden(p=>({...p,[k]:!p[k]}));
  const visible_rows = cfg_rows.filter(r=>{
    const field = ALL_FIELDS.find(f=>f.label===r.label);
    return field ? !hidden[field.k] : true;
  });

  return React.createElement('div', {style:{maxWidth:700,margin:"0 auto",padding:"24px"}}
    , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}
      , React.createElement('div', null
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,margin:0}}, "Scheda Scuola")
        , React.createElement('p', {style:{fontSize:13,color:C.textMuted,marginTop:4}}, "Riepilogo dati fiscali e contatto")
      )
      , React.createElement('button', {onClick:handlePrint,
          style:{display:"flex",alignItems:"center",gap:7,padding:"10px 18px",borderRadius:9,
            border:`1px solid ${C.goldDim}`,background:C.goldBg,color:C.gold,cursor:"pointer",fontSize:13,fontFamily:"'Open Sans',sans-serif"}}
        , React.createElement(Ic,{n:"receipt",size:14,stroke:C.gold}), " Stampa scheda"
      )
    )
    /* Visibility toggles */
    , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:18}}
      , React.createElement('div', {style:{fontSize:11,color:C.textMuted,letterSpacing:".08em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}}
        , React.createElement(Ic,{n:"list",size:12,stroke:C.textMuted}), "Campi visibili"
      )
      , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:6}}
        , ALL_FIELDS.filter(f=>cfg[f.k]).map(f=>
            React.createElement('button', {key:f.k, onClick:()=>toggleField(f.k),
              style:{padding:"4px 10px",borderRadius:20,fontSize:11,cursor:"pointer",transition:"all .15s",
                border:`1px solid ${hidden[f.k]?C.border:C.goldDim}`,
                background:hidden[f.k]?"transparent":C.goldBg,
                color:hidden[f.k]?C.textDim:C.gold,
                fontFamily:"'Open Sans',sans-serif"}}
              , React.createElement(Ic,{n:hidden[f.k]?"eye-off":"eye",size:11,stroke:"currentColor"})
              , " ", f.label
            )
          )
      )
    )
    , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
      , React.createElement('div', {style:{padding:"18px 22px",background:`linear-gradient(135deg,${C.goldBg},transparent)`,borderBottom:`2px solid ${C.gold}`}}
        , React.createElement('div', {style:{fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:700}}, cfg.nomeScuola||"—")
        , cfg.tipoEnte && React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginTop:2,letterSpacing:".08em",textTransform:"uppercase"}}, cfg.tipoEnte)
        , cfg.annoScolastico && React.createElement('div', {style:{fontSize:12,color:C.textDim,marginTop:2}}, "Anno scolastico: ", React.createElement('strong',{style:{color:C.text}}, cfg.annoScolastico))
      )
      , visible_rows.map((r,i)=>React.createElement('div', {key:r.label, style:{display:"flex",justifyContent:"space-between",
          alignItems:"center",padding:"13px 22px",borderBottom:i<visible_rows.length-1?`1px solid ${C.border}`:"none"}}
          , React.createElement('span', {style:{fontSize:12,color:C.textMuted,minWidth:180}}, r.label)
          , React.createElement('span', {style:{fontSize:13,fontWeight:600,fontFamily:r.mono?"'Courier New',monospace":"inherit",
              color:r.label==="IBAN"?C.gold:C.text}}, r.value)
        ))
    )
    , visible_rows.length===0 && React.createElement('div', {style:{textAlign:"center",padding:"48px 0",color:C.textDim,border:`1px dashed ${C.border}`,borderRadius:12,marginTop:16}}
      , React.createElement(Ic,{n:"flag",size:28,stroke:C.textDim})
      , React.createElement('p',{style:{marginTop:12,fontSize:13}}, "Nessun dato configurato")
      , React.createElement('p',{style:{fontSize:11,marginTop:4}}, "Vai in Impostazioni per compilare i dati della scuola")
    )
  );
};

// ─── MODULISTICA VIEW ─────────────────────────────────────────────────────────
const ModulisticaView = () => {
  const [docs,     setDocs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [uploading,setUploading]= useState(false);
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState(null);

  const BUCKET = 'allegati';
  const MOD_PREFIX = 'modulistica/';
  const META_KEY   = 'fm_modulistica_meta';

  // Carica metadati + lista file da Supabase Storage
  const loadDocs = async () => {
    setLoading(true);
    const sb = window.supabaseClient;
    if (!sb) { setLoading(false); return; }
    try {
      const { data, error: listErr } = await sb.storage.from(BUCKET).list(MOD_PREFIX, { limit: 200, sortBy:{column:'created_at',order:'desc'} });
      if (listErr) throw listErr;
      // Carica metadati (categoria) da sito_config
      const { data: metaRow } = await sb.from('sito_config').select('valore').eq('chiave', META_KEY).maybeSingle();
      const meta = (() => { try { return JSON.parse(metaRow?.valore||'{}'); } catch { return {}; } })();
      const rows = (data||[]).filter(f=>f.name&&f.name!=='.emptyFolderPlaceholder').map(f => {
        const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(MOD_PREFIX+f.name);
        return {
          id:   f.name,
          name: f.name,
          size: f.metadata?.size || 0,
          type: f.metadata?.mimetype || '',
          fileUrl: urlData?.publicUrl || '',
          categoria: meta[f.name] || 'generale',
          uploadDate: f.created_at ? new Date(f.created_at).toLocaleDateString('it-IT') : '',
        };
      });
      setDocs(rows);
    } catch(e) { setError('Errore caricamento: '+e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadDocs(); }, []);

  // Salva metadati categoria su sito_config
  const saveMeta = async (newMeta) => {
    const sb = window.supabaseClient;
    if (!sb) return;
    await sb.from('sito_config').upsert({chiave:META_KEY, valore:JSON.stringify(newMeta), updated_at:new Date().toISOString()},{onConflict:'chiave'});
  };

  const handleFiles = async (files) => {
    const sb = window.supabaseClient;
    if (!sb) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
      const path = MOD_PREFIX + Date.now() + '_' + safeName;
      const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, { upsert:false });
      if (upErr) { console.warn('[FM] upload modulistica error:', upErr.message); }
    }
    setUploading(false);
    await loadDocs();
  };

  const removeDoc = async (id) => {
    const sb = window.supabaseClient;
    if (!sb) return;
    await sb.storage.from(BUCKET).remove([MOD_PREFIX+id]);
    setDocs(prev=>prev.filter(d=>d.id!==id));
  };

  const updateCat = async (id, cat) => {
    setDocs(prev=>prev.map(d=>d.id===id?{...d,categoria:cat}:d));
    const meta = {};
    docs.forEach(d=>{ meta[d.id]=d.categoria; });
    meta[id]=cat;
    await saveMeta(meta);
  };

  const CATS = ["generale","iscrizione","regolamento","verbale","contratto","modulo","altro"];
  const [filterCat, setFilterCat] = useState("tutti");
  const filtered = filterCat==="tutti" ? docs : docs.filter(d=>d.categoria===filterCat);
  const fmtSize = b => b>1024*1024 ? (b/1024/1024).toFixed(1)+" MB" : (b/1024).toFixed(0)+" KB";
  const getIcon = t => t.includes("pdf")?"file":t.includes("image")?"image":t.includes("word")?"file":"file";

  return React.createElement('div', {style:{maxWidth:900,margin:"0 auto",padding:"24px"}}
    , loading && React.createElement('div',{style:{textAlign:'center',padding:'60px 0',color:C.textMuted}}
      , React.createElement('div',{style:{fontSize:13}},'Caricamento modulistica...')
    )
    , !loading && React.createElement(React.Fragment, null
    , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}
      , React.createElement('div', null
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,margin:0}}, "Modulistica")
        , React.createElement('p', {style:{fontSize:13,color:C.textMuted,marginTop:4}}, docs.length, " documenti caricati · Storage Supabase")
      )
      , React.createElement('label', {style:{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:9,
          border:`1px solid ${C.border}`,background:uploading?C.surface:C.goldBg,color:uploading?C.textMuted:C.gold,
          cursor:uploading?"not-allowed":"pointer",fontSize:13,fontFamily:"'Open Sans',sans-serif",opacity:uploading?0.7:1}}
        , uploading ? "Upload in corso..." : React.createElement(React.Fragment,null,React.createElement(Ic,{n:"upload",size:14,stroke:C.gold}), " Carica documenti")
        , !uploading && React.createElement('input', {type:"file",multiple:true,accept:".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",style:{display:"none"},
            onChange:e=>handleFiles(e.target.files)})
      )
    )

    , React.createElement('div', {
        onDragOver:e=>{e.preventDefault();setDragging(true);},
        onDragLeave:()=>setDragging(false),
        onDrop:e=>{e.preventDefault();setDragging(false);handleFiles(e.dataTransfer.files);},
        style:{border:`2px dashed ${dragging?C.gold:C.border}`,borderRadius:12,padding:"24px",
          textAlign:"center",marginBottom:20,transition:"all .2s",background:dragging?C.goldBg:C.surface}}
      , React.createElement(Ic,{n:"upload",size:24,stroke:dragging?C.gold:C.textDim})
      , React.createElement('p',{style:{marginTop:8,fontSize:13,color:dragging?C.gold:C.textDim}}, "Trascina qui i documenti, oppure usa il pulsante «Carica»")
      , React.createElement('p',{style:{fontSize:11,color:C.textDim,marginTop:2}}, "PDF, Word, Excel, immagini")
    )

    , docs.length>0 && React.createElement('div', {style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}
      , ["tutti",...CATS].map(cat=>React.createElement('button', {key:cat, onClick:()=>setFilterCat(cat),
          style:{padding:"5px 12px",borderRadius:14,border:`1px solid ${filterCat===cat?C.gold:C.border}`,
            background:filterCat===cat?C.goldBg:"transparent",color:filterCat===cat?C.gold:C.textMuted,
            cursor:"pointer",fontSize:11,fontFamily:"'Open Sans',sans-serif",textTransform:"capitalize"}}
        , cat==="tutti"?`Tutti (${docs.length})`:cat))
    )

    , error && React.createElement('div',{style:{padding:'12px 16px',borderRadius:9,background:C.redBg,border:`1px solid ${C.redBorder}`,color:C.red,fontSize:13,marginBottom:16}}, error)
    , filtered.length===0 && docs.length===0 && React.createElement('div', {style:{textAlign:"center",padding:"60px 0",color:C.textDim,border:`1px dashed ${C.border}`,borderRadius:12}}
      , React.createElement(Ic,{n:"file",size:32,stroke:C.textDim})
      , React.createElement('p',{style:{marginTop:12,fontSize:14}}, "Nessun documento caricato")
      , React.createElement('p',{style:{fontSize:12,marginTop:4}}, "Carica regolamenti, moduli di iscrizione, verbali e altri documenti")
    )

    , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}
      , filtered.map(doc=>React.createElement('div', {key:doc.id, style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}
          , React.createElement('div', {style:{padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12}}
            , React.createElement('div', {style:{width:40,height:40,borderRadius:10,background:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
              , React.createElement(Ic,{n:getIcon(doc.type),size:18,stroke:C.gold})
            )
            , React.createElement('div', {style:{flex:1,minWidth:0}}
              , React.createElement('div', {style:{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}, doc.name)
              , React.createElement('div', {style:{fontSize:11,color:C.textDim}}, fmtSize(doc.size), " · ", doc.uploadDate)
              , React.createElement('select', {value:doc.categoria, onChange:e=>updateCat(doc.id,e.target.value),
                  style:{marginTop:6,fontSize:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,
                    color:C.textMuted,padding:"2px 6px",fontFamily:"'Open Sans',sans-serif",cursor:"pointer"}}
                , CATS.map(c=>React.createElement('option',{key:c,value:c}, c.charAt(0).toUpperCase()+c.slice(1)))
              )
            )
          )
          , React.createElement('div', {style:{padding:"10px 16px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}
            , React.createElement('a', {href:doc.fileUrl, target:"_blank", rel:"noreferrer",
                style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"7px 0",
                  borderRadius:7,border:`1px solid ${C.border}`,color:C.textMuted,fontSize:11,textDecoration:"none",fontFamily:"'Open Sans',sans-serif"}}
              , React.createElement(Ic,{n:"eye",size:12,stroke:C.textMuted}), " Visualizza"
            )
            , React.createElement('a', {href:doc.fileUrl, download:doc.name,
                style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"7px 0",
                  borderRadius:7,background:C.goldBg,border:`1px solid ${C.goldDim}`,color:C.gold,fontSize:11,textDecoration:"none",fontFamily:"'Open Sans',sans-serif"}}
              , React.createElement(Ic,{n:"download",size:12,stroke:C.gold}), " Scarica"
            )
            , React.createElement('button', {onClick:()=>removeDoc(doc.id),
                style:{padding:"7px 10px",borderRadius:7,border:`1px solid ${C.border}`,background:"none",
                  color:C.textDim,cursor:"pointer"},
                onMouseEnter:e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textDim;}}
              , React.createElement(Ic,{n:"trash",size:12,stroke:"currentColor"})
            )
          )
        ))
    )
    )  // end !loading Fragment
  );
};

// Espone App al bootstrap in index.html
window.__AppComponent = App;
  } catch(err) { window.__BOOT_ERROR = window.__BOOT_ERROR || err; console.error('[FM]', err.message||err); }
})();

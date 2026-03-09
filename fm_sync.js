// ═══════════════════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — fm_sync.js  v3
//  
//  ARCHITETTURA CORRETTA:
//  1. fm_sync.js carica i dati da Supabase (await)
//  2. Solo DOPO aver popolato window.__FM_DATA__, carica app.js dinamicamente
//  3. React inizializza il suo stato leggendo __FM_DATA__ — sempre dati reali
//  4. Al logout/re-login, intercetta __FM_RELOAD__ e ricarica dati freschi
//
//  webapp.html NON deve più avere <script src="app.js"> — ci pensa fm_sync
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const log  = (...a) => console.log('%c[fm_sync]', 'color:#1a4fa0;font-weight:700', ...a);
  const warn = (...a) => console.warn('%c[fm_sync]', 'color:#c9a84c;font-weight:700', ...a);
  const err  = (...a) => console.error('%c[fm_sync]', 'color:#8c1818;font-weight:700', ...a);

  // ── Stato interno ─────────────────────────────────────────────────────────
  let _prevState  = {};
  let _syncTimer  = null;
  let _channels   = [];
  let _reloadFn   = null;   // window.__FM_RELOAD__ (registrato da React)
  let _syncActive = false;  // true solo dopo iniezione dati confermata
  const DEBOUNCE_MS = 800;

  // ══════════════════════════════════════════════════════════════════════════
  //  ADAPTERS DB → React
  // ══════════════════════════════════════════════════════════════════════════
  function adaptLezione(row) {
    return {
      id: row.id, date: row.data, hour: row.ora || '', student: row.student || '',
      instrument: row.instrument || '', teacher: row.teacher || '', room: row.room || '',
      topic: row.topic || '', attendance: row.attendance || '', recurrence: row.recurrence || 'Nessuna',
      notes: row.notes || '', exercises: row.exercises || '', repertorio: row.repertorio || '',
      type: row.tipo || 'individuale',
    };
  }

  function adaptQuota(row) {
    const statoMap = { 'da pagare': 'attesa', 'in ritardo': 'ritardo' };
    return {
      id: String(row.id), studentId: row.studente_id || null, studentName: row.studente_nome || '',
      importo: parseFloat(row.importo) || 0, mese: row.mese, anno: row.anno,
      data: row.data_pagamento || '', metodo: row.metodo || 'Contanti',
      categoria: 'quota', desc: row.note || '',
      stato: statoMap[row.stato] || row.stato || 'attesa',
      dataPagamento: row.data_pagamento || '', numRicevuta: row.num_ricevuta || '',
    };
  }

  function adaptSpesa(row) {
    return {
      id: row.id, categoria: row.categoria || 'altro', desc: row.desc || '',
      importo: parseFloat(row.importo) || 0, mese: row.mese ?? 0,
      anno: row.anno || new Date().getFullYear(), metodo: row.metodo || '',
      data: row.data || '', docenteId: row.docente_id || null, note: row.note || '',
    };
  }

  function adaptBrano(row) {
    return {
      id: row.id, title: row.title || '', composer: row.composer || '',
      periodo: row.periodo || '', tonality: row.tonality || '', difficulty: row.difficulty || '',
      tipo: row.tipo || 'individuale', note: row.note || '',
      dataPrima: row.data_prima || '', dataUltima: row.data_ultima || '',
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  ADAPTERS React → DB
  // ══════════════════════════════════════════════════════════════════════════
  const toDB = {
    studente(s) {
      return {
        id: s.id, nome: s.name || '', email: s.email || null, phone: s.phone || null,
        strumento: s.instrument || null, docente: s.teacher || null,
        livello: s.level || 'Principiante', status: s.status || 'attivo',
        monthly_fee: parseFloat(s.monthlyFee) || 0, fee_type: s.feeType || 'fisso',
        birthdate: s.birthdate || null, enroll_date: s.enrollDate || null,
        complementary_course: s.complementaryCourse || null, notes: s.notes || null,
        updated_at: new Date().toISOString(),
      };
    },
    lezione(l) {
      return {
        id: l.id, data: l.date, ora: l.hour || null, student: l.student || null,
        instrument: l.instrument || null, teacher: l.teacher || null, room: l.room || null,
        topic: l.topic || null, attendance: l.attendance || null, recurrence: l.recurrence || 'Nessuna',
        notes: l.notes || null, exercises: l.exercises || null, repertorio: l.repertorio || null,
        tipo: l.type || 'individuale', updated_at: new Date().toISOString(),
      };
    },
    quota(q) {
      const statoMap = { 'attesa': 'da pagare', 'ritardo': 'in ritardo' };
      return {
        id: String(q.id), studente_id: q.studentId ? parseInt(q.studentId, 10) : null,
        studente_nome: q.studentName || '', importo: parseFloat(q.importo) || 0,
        mese: q.mese, anno: q.anno,
        anno_scolastico: (q.anno && q.mese) ? (q.mese >= 9 ? q.anno : q.anno - 1) : null,
        stato: statoMap[q.stato] || q.stato || 'da pagare',
        data_pagamento: q.dataPagamento || null, num_ricevuta: q.numRicevuta || '',
        metodo: q.metodo || 'Contanti', note: q.note || '',
      };
    },
    spesa(s) {
      return {
        id: s.id, categoria: s.categoria || 'altro', desc: s.desc || null,
        importo: parseFloat(s.importo) || 0, mese: s.mese ?? null,
        anno: s.anno || new Date().getFullYear(), metodo: s.metodo || null,
        data: s.data || null, docente_id: s.docenteId || null, note: s.note || null,
        updated_at: new Date().toISOString(),
      };
    },
    brano(b) {
      return {
        id: b.id, title: b.title || b.titolo || '', composer: b.composer || b.compositore || null,
        periodo: b.periodo || null, tonality: b.tonality || null, difficulty: b.difficulty || null,
        tipo: b.tipo || 'individuale', note: b.note || null,
        data_prima: b.dataPrima || null, data_ultima: b.dataUltima || null,
        updated_at: new Date().toISOString(),
      };
    },
    docente(d) {
      return {
        id:          d.id,
        nome:        d.nome        || d.name  || '',
        teacher_key: d.teacherKey  || d.nome  || '',
        email:       d.email       || null,
        phone:       d.phone       || null,
        strumenti:   d.strumenti   || null,
        bio:         d.bio         || null,
        tariffa_ora: parseFloat(d.tariffaOra) || 0,
        contratto:   d.contratto   || null,
        data_inizio: d.dataInizio  || null,
        attivo:      d.attivo !== false,
      };
    },
    corso(c) {
      return {
        id:          c.id,
        nome:        c.name        || c.nome || '',
        tipo:        c.type        || c.tipo || 'individuale',
        descrizione: c.description || null,
        livelli:     c.livelli     || null,
        foto:        c.foto        || null,
        visible:     c.visible     !== false,
      };
    },
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  DIFF + PERSIST
  // ══════════════════════════════════════════════════════════════════════════
  function diff(prev, next) {
    const prevMap = new Map((prev || []).map(r => [String(r.id), JSON.stringify(r)]));
    const nextMap = new Map((next || []).map(r => [String(r.id), r]));
    const added = [], updated = [], deleted = [];
    nextMap.forEach((item, id) => {
      if (!prevMap.has(id)) added.push(item);
      else if (prevMap.get(id) !== JSON.stringify(item)) updated.push(item);
    });
    prevMap.forEach((_, id) => { if (!nextMap.has(id)) deleted.push(id); });
    return { added, updated, deleted };
  }

  // IDs client-side (demo): numeri o stringhe corte tipo "d1", "q001", "b3"
  function isClientId(id) {
    return typeof id === 'number' || /^[a-zA-Z]{0,3}\d{1,6}$/.test(String(id));
  }

  async function persistDiff(table, changes, adapter) {
    const sb = window.supabaseClient;
    if (!sb) return;
    for (const item of changes.added) {
      try {
        const row = adapter(item);
        if (isClientId(row.id)) delete row.id;
        const { error } = await sb.from(table).insert(row);
        if (error) warn(`INSERT ${table}:`, error.message);
        else log(`+ ${table}`, row.nome || row.title || row.desc || '');
      } catch(e) { err('insert', e); }
    }
    for (const item of changes.updated) {
      try {
        const row = adapter(item);
        const { error } = await sb.from(table).update(row).eq('id', item.id);
        if (error) warn(`UPDATE ${table} ${item.id}:`, error.message);
        else log(`✎ ${table}`, item.id);
      } catch(e) { err('update', e); }
    }
    for (const id of changes.deleted) {
      try {
        const { error } = await sb.from(table).delete().eq('id', id);
        if (error) warn(`DELETE ${table} ${id}:`, error.message);
        else log(`✕ ${table}`, id);
      } catch(e) { err('delete', e); }
    }
  }

  async function syncState(state) {
    if (!_syncActive) return;
    const tasks = [];
    if (state.students && _prevState.students !== undefined)
      tasks.push(persistDiff('studenti', diff(_prevState.students, state.students), toDB.studente));
    if (state.docenti && _prevState.docenti !== undefined)
      tasks.push(persistDiff('docenti', diff(_prevState.docenti, state.docenti), toDB.docente));
    if (state.courses && _prevState.courses !== undefined)
      tasks.push(persistDiff('corsi', diff(_prevState.courses, state.courses), toDB.corso));
    if (state.lessons && _prevState.lessons !== undefined)
      tasks.push(persistDiff('lezioni', diff(_prevState.lessons, state.lessons), toDB.lezione));
    if (state.entrate && _prevState.entrate !== undefined)
      tasks.push(persistDiff('quote', diff(_prevState.entrate, state.entrate), toDB.quota));
    if (state.spese && _prevState.spese !== undefined)
      tasks.push(persistDiff('spese', diff(_prevState.spese, state.spese), toDB.spesa));
    if (state.brani && _prevState.brani !== undefined)
      tasks.push(persistDiff('brani', diff(_prevState.brani, state.brani), toDB.brano));
    await Promise.all(tasks);
    _prevState = {
      students: state.students ? [...state.students] : _prevState.students,
      docenti:  state.docenti  ? [...state.docenti]  : _prevState.docenti,
      courses:  state.courses  ? [...state.courses]  : _prevState.courses,
      lessons:  state.lessons  ? [...state.lessons]  : _prevState.lessons,
      entrate:  state.entrate  ? [...state.entrate]  : _prevState.entrate,
      spese:    state.spese    ? [...state.spese]    : _prevState.spese,
      brani:    state.brani    ? [...state.brani]    : _prevState.brani,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  LOAD ALL — carica tutti i dati da Supabase
  // ══════════════════════════════════════════════════════════════════════════
  async function loadAll() {
    const sb = window.supabaseClient;
    if (!sb) { warn('supabaseClient non disponibile'); return null; }
    log('Caricamento da Supabase...');
    try {
      const [
        { data: studentiRaw, error: e1 },
        { data: docentiRaw,  error: e2 },
        { data: corsiRaw,    error: e3 },
        { data: lezioniRaw,  error: e4 },
        { data: braniRaw,    error: e5 },
        { data: speseRaw,    error: e6 },
        { data: quoteRaw,    error: e7 },
      ] = await Promise.all([
        sb.from('studenti').select('*').order('nome'),
        sb.from('docenti').select('*').order('nome'),
        sb.from('corsi').select('*, corsi_docenti(docente_id)').order('nome'),
        sb.from('lezioni').select('*').order('data', { ascending: false }),
        sb.from('brani').select('*').order('title'),
        sb.from('spese').select('*').order('data', { ascending: false }),
        sb.from('quote').select('*').order('anno').order('mese'),
      ]);
      [['studenti',e1],['docenti',e2],['corsi',e3],['lezioni',e4],
       ['brani',e5],['spese',e6],['quote',e7]].forEach(([t,e]) => {
        if (e) warn(`Errore ${t}:`, e.message);
      });
      const FA = window.FMAdapter;
      const data = {
        students: (studentiRaw || []).map(r => FA?.studente(r) || r),
        docenti:  (docentiRaw  || []).map(r => FA?.docente(r)  || r),
        courses:  (corsiRaw    || []).map(r => FA?.corso(r)    || r),
        lessons:  (lezioniRaw  || []).map(adaptLezione),
        brani:    (braniRaw    || []).map(adaptBrano),
        spese:    (speseRaw    || []).map(adaptSpesa),
        entrate:  (quoteRaw    || []).map(adaptQuota),
      };
      log('Caricati →', Object.entries(data).map(([k,v]) => `${k}:${v.length}`).join(', '));
      return data;
    } catch(e) { err('loadAll fallito:', e); return null; }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  REALTIME
  // ══════════════════════════════════════════════════════════════════════════
  function subscribeRealtime() {
    const sb = window.supabaseClient;
    if (!sb || typeof sb.channel !== 'function') return;
    const cfg = [
      { table: 'studenti', key: 'students', order: 'nome',  adapt: r => window.FMAdapter?.studente(r) || r },
      { table: 'docenti',  key: 'docenti',  order: 'nome',  adapt: r => window.FMAdapter?.docente(r)  || r },
      { table: 'corsi',    key: 'courses',  order: 'nome',  adapt: r => window.FMAdapter?.corso(r)    || r },
      { table: 'lezioni',  key: 'lessons',  order: 'data',  adapt: adaptLezione },
      { table: 'quote',    key: 'entrate',  order: 'mese',  adapt: adaptQuota  },
      { table: 'spese',    key: 'spese',    order: 'data',  adapt: adaptSpesa  },
      { table: 'brani',    key: 'brani',    order: 'title', adapt: adaptBrano  },
    ];
    cfg.forEach(({ table, key, order, adapt }) => {
      try {
        const ch = sb.channel(`fm:${table}`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
            const asc = table !== 'lezioni';
            const { data, error } = await sb.from(table).select('*').order(order, { ascending: asc });
            if (error) { warn('realtime reload', table, error.message); return; }
            const adapted = (data || []).map(adapt);
            _prevState[key] = adapted;
            if (_reloadFn) _reloadFn({ [key]: adapted });
          })
          .subscribe();
        _channels.push(ch);
      } catch(e) { warn('subscribe error', table, e); }
    });
    log('Realtime attivo');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  INTERCETTA __FM_RELOAD__ per rilevare logout/re-login
  // ══════════════════════════════════════════════════════════════════════════
  Object.defineProperty(window, '__FM_RELOAD__', {
    get() { return _reloadFn; },
    set(fn) {
      const wasSet = !!_reloadFn;
      _reloadFn = fn;
      if (!fn) {
        // Logout: React si smonta
        log('Logout — sync in pausa');
        _syncActive = false;
        clearTimeout(_syncTimer);
        _channels.forEach(ch => {
          try { window.supabaseClient?.removeChannel(ch); } catch(e) {}
        });
        _channels = [];
        return;
      }
      if (wasSet) {
        // Re-login: React si è rimontato — ricarica dati freschi
        log('Re-login rilevato — ricarico da Supabase');
        _syncActive = false;
        _prevState  = {};
        loadAll().then(fresh => {
          if (!fresh) return;
          _prevState  = { students:[...fresh.students], docenti:[...fresh.docenti],
                          courses:[...fresh.courses], lessons:[...fresh.lessons],
                          entrate:[...fresh.entrate], spese:[...fresh.spese], brani:[...fresh.brani] };
          _syncActive = true;
          if (_reloadFn) _reloadFn(fresh);
          log('Re-login dati iniettati →', Object.entries(fresh).map(([k,v])=>`${k}:${v.length}`).join(', '));
          subscribeRealtime();
        });
      }
    },
    configurable: true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  __FM_ON_STATE__ — intercettore write verso Supabase
  // ══════════════════════════════════════════════════════════════════════════
  window.__FM_ON_STATE__ = function(state) {
    if (!_syncActive) return; // blocca scritture finché i dati reali non sono caricati
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(() => syncState(state), DEBOUNCE_MS);
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  CARICA app.js DINAMICAMENTE — solo dopo che i dati sono pronti
  // ══════════════════════════════════════════════════════════════════════════
  function setStatus(msg) {
    const el = document.getElementById('status');
    if (el) el.textContent = msg;
  }

  function mountReact() {
    setStatus('Avvio React…');
    const rootEl    = document.getElementById('root');
    const loadingEl = document.getElementById('loading');
    try {
      if (window.__BOOT_ERROR) throw window.__BOOT_ERROR;
      const App = window.__AppComponent;
      if (!App) throw new Error('__AppComponent non definito');
      window.ReactDOM.createRoot(rootEl).render(window.React.createElement(App));
      loadingEl.style.opacity = '0';
      loadingEl.style.transition = 'opacity 0.5s';
      setTimeout(() => { loadingEl.style.display = 'none'; }, 550);
      log('React montato ✓');
    } catch(e) {
      document.getElementById('spinner').style.display = 'none';
      setStatus('⚠️ Errore avvio');
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = 'ERRORE:\n' + (e.stack || e.message || String(e));
      loadingEl.appendChild(d);
    }
  }

  async function boot() {
    if (!window.supabaseClient) {
      warn('supabaseClient non trovato');
      // Carica app.js comunque — funzionerà offline con dati demo
      loadAppThen(mountReact);
      return;
    }

    // 1. Carica dati da Supabase PRIMA di caricare app.js
    setStatus('Connessione Supabase…');
    const data = await loadAll();

    if (data) {
      // 2. Inietta in __FM_DATA__ — React lo leggerà nel primo useState
      window.__FM_DATA__ = data;
      _prevState  = { students:[...data.students], docenti:[...data.docenti],
                      courses:[...data.courses], lessons:[...data.lessons],
                      entrate:[...data.entrate], spese:[...data.spese], brani:[...data.brani] };
      log('__FM_DATA__ pronto — carico app.js');
    } else {
      warn('Supabase non disponibile — uso dati demo (sola lettura)');
    }

    // 3. Carica app.js dinamicamente (DOPO che __FM_DATA__ è popolato)
    setStatus('Caricamento app…');
    loadAppThen(() => {
      mountReact();
      // 4. Abilita il sync solo dopo che React è montato e i dati reali sono stati usati
      if (data) {
        setTimeout(() => {
          _syncActive = true;
          subscribeRealtime();
          log('Sync attivo ✓');
        }, 500); // breve attesa per assicurarsi che React abbia finito di montare
      }
    });
  }

  function loadAppThen(callback) {
    const script = document.createElement('script');
    script.src = './app.js';
    script.onload = callback;
    script.onerror = () => {
      document.getElementById('spinner').style.display = 'none';
      setStatus('ERRORE: app.js non trovato (404)');
    };
    document.body.appendChild(script);
  }

  boot();

  // ── Cleanup ──────────────────────────────────────────────────────────────
  window.addEventListener('beforeunload', () => {
    clearTimeout(_syncTimer);
    _channels.forEach(ch => {
      try { window.supabaseClient?.removeChannel(ch); } catch(e) {}
    });
  });

  // ── Debug API ─────────────────────────────────────────────────────────────
  window.__FM_SYNC__ = {
    reload: async () => {
      const d = await loadAll();
      if (d && _reloadFn) { _reloadFn(d); log('Reload manuale OK'); }
    },
    status: () => ({ syncActive: _syncActive, channels: _channels.length,
      snapshot: Object.fromEntries(Object.entries(_prevState).map(([k,v])=>[k,Array.isArray(v)?v.length:'?'])) }),
  };

})();

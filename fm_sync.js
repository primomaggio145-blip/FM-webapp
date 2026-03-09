// ═══════════════════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — fm_sync.js
//  Bridge tra React (app.js) e Supabase (supabase_integration.js)
//
//  COME FUNZIONA:
//  1. Pre-carica tutti i dati da Supabase in window.__FM_DATA__ prima del boot React
//  2. Dopo il boot, intercetta window.__FM_ON_STATE__ per rilevare mutazioni
//  3. Persiste automaticamente le differenze su Supabase (diff-based sync)
//  4. Ascolta real-time subscriptions per sincronizzare più utenti
//
//  ORDINE SCRIPT in webapp.html:
//  <script src="supabase_integration.js"></script>
//  <script src="fm_sync.js"></script>   ← questo file
//  <script src="./app.js"></script>
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ── Utility log ────────────────────────────────────────────────────────────
  const log  = (...a) => console.log('%c[fm_sync]', 'color:#1a4fa0;font-weight:600', ...a);
  const warn = (...a) => console.warn('%c[fm_sync]', 'color:#c9a84c;font-weight:600', ...a);
  const err  = (...a) => console.error('%c[fm_sync]', 'color:#8c1818;font-weight:600', ...a);

  // ── Stato interno ──────────────────────────────────────────────────────────
  let _prevState   = {};
  let _syncTimer   = null;
  let _channels    = [];
  let _booted      = false;
  let _initialized = false;  // true solo dopo che i dati Supabase sono stati iniettati in React
  const DEBOUNCE_MS = 800;

  // ══════════════════════════════════════════════════════════════════════════
  //  REVERSE ADAPTERS — formato app React → formato tabella Supabase
  // ══════════════════════════════════════════════════════════════════════════
  const toDB = {

    studente(s) {
      return {
        id:                   s.id,
        nome:                 s.name           || '',
        email:                s.email          || null,
        phone:                s.phone          || null,
        strumento:            s.instrument     || null,
        docente:              s.teacher        || null,
        livello:              s.level          || 'Principiante',
        status:               s.status         || 'attivo',
        monthly_fee:          parseFloat(s.monthlyFee) || 0,
        fee_type:             s.feeType        || 'fisso',
        birthdate:            s.birthdate      || null,
        enroll_date:          s.enrollDate     || null,
        complementary_course: s.complementaryCourse || null,
        notes:                s.notes          || null,
        updated_at:           new Date().toISOString(),
      };
    },

    lezione(l) {
      return {
        id:         l.id,
        data:       l.date,
        ora:        l.hour        || null,
        student:    l.student     || null,
        instrument: l.instrument  || null,
        teacher:    l.teacher     || null,
        room:       l.room        || null,
        topic:      l.topic       || null,
        attendance: l.attendance  || null,
        recurrence: l.recurrence  || 'Nessuna',
        notes:      l.notes       || null,
        exercises:  l.exercises   || null,
        repertorio: l.repertorio  || null,
        tipo:       l.type        || 'individuale',
        updated_at: new Date().toISOString(),
      };
    },

    quota(q) {
      // Mappa stati app → stati DB
      // App usa: 'pagato' | 'attesa' | 'ritardo' | 'esonerato'
      // DB usa:  'pagato' | 'da pagare' | 'in ritardo' | 'esonerato'
      const statoMap = { 'attesa': 'da pagare', 'ritardo': 'in ritardo' };
      const stato = statoMap[q.stato] || q.stato || 'da pagare';
      return {
        id:              String(q.id),
        studente_id:     q.studentId    ? parseInt(q.studentId, 10) : null,
        studente_nome:   q.studentName  || '',
        importo:         parseFloat(q.importo) || 0,
        mese:            q.mese,
        anno:            q.anno,
        anno_scolastico: (q.anno && q.mese) ? (q.mese >= 9 ? q.anno : q.anno - 1) : null,
        stato:           stato,
        data_pagamento:  q.dataPagamento || null,
        num_ricevuta:    q.numRicevuta   || '',
        metodo:          q.metodo        || 'Contanti',
        note:            q.note          || '',
      };
    },

    spesa(s) {
      return {
        id:         s.id,
        categoria:  s.categoria  || 'altro',
        desc:       s.desc       || null,
        importo:    parseFloat(s.importo) || 0,
        mese:       s.mese       ?? null,
        anno:       s.anno       || new Date().getFullYear(),
        metodo:     s.metodo     || null,
        data:       s.data       || null,
        docente_id: s.docenteId  || null,
        note:       s.note       || null,
        updated_at: new Date().toISOString(),
      };
    },

    brano(b) {
      return {
        id:          b.id,
        title:       b.title      || b.titolo || '',
        composer:    b.composer   || b.compositore || null,
        periodo:     b.periodo    || null,
        tonality:    b.tonality   || null,
        difficulty:  b.difficulty || null,
        tipo:        b.tipo       || 'individuale',
        note:        b.note       || null,
        data_prima:  b.dataPrima  || null,
        data_ultima: b.dataUltima || null,
        updated_at:  new Date().toISOString(),
      };
    },
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  LOAD ADAPTERS — formato DB Supabase → formato app React
  // ══════════════════════════════════════════════════════════════════════════
  function adaptLezione(row) {
    return {
      id:         row.id,
      date:       row.data,
      hour:       row.ora         || '',
      student:    row.student     || '',
      instrument: row.instrument  || '',
      teacher:    row.teacher     || '',
      room:       row.room        || '',
      topic:      row.topic       || '',
      attendance: row.attendance  || '',
      recurrence: row.recurrence  || 'Nessuna',
      notes:      row.notes       || '',
      exercises:  row.exercises   || '',
      repertorio: row.repertorio  || '',
      type:       row.tipo        || 'individuale',
    };
  }

  function adaptQuota(row) {
    // Mappa stati DB → stati app
    const statoMap = { 'da pagare': 'attesa', 'in ritardo': 'ritardo' };
    return {
      id:            String(row.id),
      studentId:     row.studente_id    || null,
      studentName:   row.studente_nome  || '',
      importo:       parseFloat(row.importo) || 0,
      mese:          row.mese,
      anno:          row.anno,
      data:          row.data_pagamento || '',   // app usa "data" per la data pagamento
      metodo:        row.metodo         || 'Contanti',
      categoria:     'quota',
      desc:          row.note           || '',
      stato:         statoMap[row.stato] || row.stato || 'attesa',
      dataPagamento: row.data_pagamento || '',
      numRicevuta:   row.num_ricevuta   || '',
    };
  }

  function adaptSpesa(row) {
    return {
      id:        row.id,
      categoria: row.categoria || 'altro',
      desc:      row.desc      || '',
      importo:   parseFloat(row.importo) || 0,
      mese:      row.mese      ?? 0,
      anno:      row.anno      || new Date().getFullYear(),
      metodo:    row.metodo    || '',
      data:      row.data      || '',
      docenteId: row.docente_id|| null,
      note:      row.note      || '',
    };
  }

  function adaptBrano(row) {
    return {
      id:         row.id,
      title:      row.title      || '',
      composer:   row.composer   || '',
      periodo:    row.periodo    || '',
      tonality:   row.tonality   || '',
      difficulty: row.difficulty || '',
      tipo:       row.tipo       || 'individuale',
      note:       row.note       || '',
      dataPrima:  row.data_prima || '',
      dataUltima: row.data_ultima|| '',
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  DIFF ENGINE — rileva aggiunte, modifiche e cancellazioni
  // ══════════════════════════════════════════════════════════════════════════
  function diff(prev, next) {
    const prevMap = new Map((prev || []).map(r => [String(r.id), JSON.stringify(r)]));
    const nextMap = new Map((next || []).map(r => [String(r.id), r]));

    const added   = [];
    const updated = [];
    const deleted = [];

    nextMap.forEach((item, id) => {
      if (!prevMap.has(id)) {
        added.push(item);
      } else if (prevMap.get(id) !== JSON.stringify(item)) {
        updated.push(item);
      }
    });

    prevMap.forEach((_, id) => {
      if (!nextMap.has(id)) deleted.push(id);
    });

    return { added, updated, deleted };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PERSIST ENGINE — scrive le differenze su Supabase
  // ══════════════════════════════════════════════════════════════════════════
  // Regex per IDs client-side (es: "e001", "b1", uid() brevi) — non sono UUID Supabase
  const CLIENT_ID_RE = /^[a-zA-Z]?\d{1,6}$|^[a-z]{1,3}\d{3}$|^[a-f0-9]{8}$/;

  function isClientId(id) {
    return typeof id === 'number' || CLIENT_ID_RE.test(String(id));
  }

  async function persistDiff(table, changes, adapter) {
    const sb = window.supabaseClient;
    if (!sb) return;

    for (const item of changes.added) {
      try {
        const row = adapter(item);
        if (isClientId(row.id)) delete row.id; // Lascia generare l'UUID a Supabase
        const { error } = await sb.from(table).insert(row);
        if (error) warn(`INSERT ${table}:`, error.message);
        else log(`+ ${table}`, row.nome || row.title || row.desc || '(nuovo)');
      } catch(e) { err('insert', table, e); }
    }

    for (const item of changes.updated) {
      try {
        const row = adapter(item);
        const { error } = await sb.from(table).update(row).eq('id', item.id);
        if (error) warn(`UPDATE ${table} ${item.id}:`, error.message);
        else log(`✎ ${table}`, item.id);
      } catch(e) { err('update', table, e); }
    }

    for (const id of changes.deleted) {
      try {
        const { error } = await sb.from(table).delete().eq('id', id);
        if (error) warn(`DELETE ${table} ${id}:`, error.message);
        else log(`✕ ${table}`, id);
      } catch(e) { err('delete', table, e); }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SYNC — confronta stato precedente → nuovo e persiste differenze
  // ══════════════════════════════════════════════════════════════════════════
  async function syncState(state) {
    if (!_booted) return;

    const tasks = [];

    if (state.students && _prevState.students !== undefined)
      tasks.push(persistDiff('studenti', diff(_prevState.students, state.students), toDB.studente));

    if (state.lessons && _prevState.lessons !== undefined)
      tasks.push(persistDiff('lezioni', diff(_prevState.lessons, state.lessons), toDB.lezione));

    if (state.entrate && _prevState.entrate !== undefined)
      tasks.push(persistDiff('quote', diff(_prevState.entrate, state.entrate), toDB.quota));

    if (state.spese && _prevState.spese !== undefined)
      tasks.push(persistDiff('spese', diff(_prevState.spese, state.spese), toDB.spesa));

    if (state.brani && _prevState.brani !== undefined)
      tasks.push(persistDiff('brani', diff(_prevState.brani, state.brani), toDB.brano));

    await Promise.all(tasks);

    // Aggiorna snapshot
    _prevState = {
      students: state.students ? [...state.students] : _prevState.students,
      lessons:  state.lessons  ? [...state.lessons]  : _prevState.lessons,
      entrate:  state.entrate  ? [...state.entrate]  : _prevState.entrate,
      spese:    state.spese    ? [...state.spese]    : _prevState.spese,
      brani:    state.brani    ? [...state.brani]    : _prevState.brani,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CARICAMENTO INIZIALE — tutti i dati da Supabase
  // ══════════════════════════════════════════════════════════════════════════
  async function loadAll() {
    const sb = window.supabaseClient;
    if (!sb) { warn('supabaseClient non disponibile'); return null; }

    log('Caricamento dati da Supabase...');

    try {
      const [
        { data: studentiRaw, error: e1 },
        { data: docentiRaw,  error: e2 },
        { data: corsiRaw,    error: e3 },
        { data: lezioniRaw,  error: e4 },
        { data: braniRaw,    error: e5 },
        { data: speseRaw,    error: e6 },
        { data: quoteRaw,  error: e7 },
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
       ['brani',e5],['spese',e6],['quote',e7]].forEach(([t, e]) => {
        if (e) warn(`Errore caricamento ${t}:`, e.message);
      });

      const FA = window.FMAdapter;
      const data = {
        students: (studentiRaw || []).map(r => FA?.studente(r) || r),
        docenti:  (docentiRaw  || []).map(r => FA?.docente(r)  || r),
        courses:  (corsiRaw    || []).map(r => FA?.corso(r)    || r),
        lessons:  (lezioniRaw  || []).map(adaptLezione),
        brani:    (braniRaw    || []).map(adaptBrano),
        spese:    (speseRaw    || []).map(adaptSpesa),
        entrate:  (quoteRaw  || []).map(adaptQuota),
      };

      log('Caricati →', Object.entries(data).map(([k,v]) => `${k}:${v.length}`).join(', '));
      return data;

    } catch (e) {
      err('loadAll fallito:', e);
      return null;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  REALTIME — aggiornamenti live per multi-utente
  // ══════════════════════════════════════════════════════════════════════════
  function subscribeRealtime() {
    const sb = window.supabaseClient;
    if (!sb || typeof sb.channel !== 'function') {
      warn('Realtime non disponibile');
      return;
    }

    const config = [
      { table: 'studenti', key: 'students',  order: 'nome',  adapt: r => window.FMAdapter?.studente(r) || r },
      { table: 'lezioni',  key: 'lessons',   order: 'data',  adapt: adaptLezione },
      { table: 'quote',    key: 'entrate',  order: 'mese',  adapt: adaptQuota  },
      { table: 'spese',    key: 'spese',     order: 'data',  adapt: adaptSpesa  },
      { table: 'brani',    key: 'brani',     order: 'title', adapt: adaptBrano  },
    ];

    config.forEach(({ table, key, order, adapt }) => {
      try {
        const ch = sb.channel(`fm:${table}`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, async () => {
            log(`realtime ${table} — ricarico`);
            const { data, error } = await sb.from(table).select('*').order(order, { ascending: table !== 'lezioni' });
            if (error) { warn('realtime reload', table, error.message); return; }
            const adapted = (data || []).map(adapt);
            _prevState[key] = adapted; // aggiorna snapshot senza triggerare sync write
            if (window.__FM_RELOAD__) window.__FM_RELOAD__({ [key]: adapted });
          })
          .subscribe();
        _channels.push(ch);
      } catch(e) { warn('subscribe error', table, e); }
    });

    log('Realtime attivo su:', config.map(c => c.table).join(', '));
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  BOOT
  // ══════════════════════════════════════════════════════════════════════════

  // __FM_RELOAD__ interno (React lo sovrascrive ad ogni montaggio)
  let _reloadFn = null;

  // Intercetta la registrazione di __FM_RELOAD__:
  // ogni volta che React rimonta (login dopo logout), questa prop viene riassegnata.
  // La usiamo per resettare lo stato sync e ricaricare i dati da Supabase.
  Object.defineProperty(window, '__FM_RELOAD__', {
    get() { return _reloadFn; },
    set(fn) {
      const wasRegistered = !!_reloadFn;
      _reloadFn = fn;

      if (!fn) return; // logout: React si smonta, fn = null

      if (wasRegistered || _booted) {
        // React si è rimontato (re-login) — reset completo e ricarica
        log('Re-login rilevato — reset sync e ricaricamento da Supabase');
        clearTimeout(_syncTimer);
        _booted      = false;
        _initialized = false;
        _prevState   = {};
        // Scollega canali realtime precedenti
        _channels.forEach(ch => {
          try { window.supabaseClient?.removeChannel(ch); } catch(e) {}
        });
        _channels = [];
        // Ricarica dati freschi da Supabase e inietta in React
        loadAll().then(fresh => {
          if (fresh && _reloadFn) {
            _prevState = {
              students: [...fresh.students],
              lessons:  [...fresh.lessons],
              entrate:  [...fresh.entrate],
              spese:    [...fresh.spese],
              brani:    [...fresh.brani],
            };
            _initialized = true;
            _reloadFn(fresh);
            log('Dati ricaricati dopo re-login →',
              Object.entries(fresh).map(([k,v]) => `${k}:${v.length}`).join(', '));
            subscribeRealtime();
          }
        });
      }
    },
    configurable: true,
  });

  async function boot() {
    if (!window.supabaseClient) {
      warn('supabaseClient non trovato — includi supabase_integration.js PRIMA di fm_sync.js');
      return;
    }

    // 1. Carica dati iniziali da Supabase
    const data = await loadAll();
    if (data) {
      window.__FM_DATA__ = data;  // letto da React prima del primo useState
      _prevState = {
        students: [...data.students],
        lessons:  [...data.lessons],
        entrate:  [...data.entrate],
        spese:    [...data.spese],
        brani:    [...data.brani],
      };
      _initialized = true;
    }

    // 2. Aggancia intercettore stato React
    // __FM_ON_STATE__ è chiamato da App() ad ogni setState
    window.__FM_ON_STATE__ = function (state) {
      if (!_booted) {
        _booted = true;
        log('React montato — sync attivo');

        // Inietta i dati Supabase in React sovrascrivendo i dati demo
        if (data) {
          setTimeout(() => {
            if (_reloadFn) {
              log('Iniezione dati Supabase → sovrascrittura dati demo');
              _reloadFn(data);
            }
          }, 50);
        } else {
          // Supabase non disponibile: accetta i dati demo ma non scriverli
          _prevState = {
            students: state.students ? [...state.students] : [],
            lessons:  state.lessons  ? [...state.lessons]  : [],
            entrate:  state.entrate  ? [...state.entrate]  : [],
            spese:    state.spese    ? [...state.spese]    : [],
            brani:    state.brani    ? [...state.brani]    : [],
          };
          _initialized = true;
        }

        subscribeRealtime();
        return;
      }

      // Blocca il sync finché i dati Supabase non sono stati iniettati
      // (evita di scrivere dati demo durante il caricamento iniziale o il re-login)
      if (!_initialized) {
        log('Sync bloccato — attendo iniezione dati Supabase');
        return;
      }

      // Debounce write verso Supabase
      clearTimeout(_syncTimer);
      _syncTimer = setTimeout(() => syncState(state), DEBOUNCE_MS);
    };

    log('✅ fm_sync.js pronto');
  }

  boot();

  // ── Cleanup ────────────────────────────────────────────────────────────────
  window.addEventListener('beforeunload', () => {
    clearTimeout(_syncTimer);
    _channels.forEach(ch => {
      try { window.supabaseClient?.removeChannel(ch); } catch(e) {}
    });
  });

  // ── API pubblica per debug da console ──────────────────────────────────────
  window.__FM_SYNC__ = {
    reload: async () => {
      const data = await loadAll();
      if (data && _reloadFn) {
        _reloadFn(data);
        log('Ricaricamento manuale OK');
      }
    },
    status: () => ({
      booted: _booted,
      initialized: _initialized,
      snapshot: Object.fromEntries(
        Object.entries(_prevState).map(([k,v]) => [k, Array.isArray(v) ? v.length : '?'])
      ),
      channels: _channels.length,
    }),
  };

})();

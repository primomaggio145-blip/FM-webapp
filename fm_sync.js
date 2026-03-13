// ═══════════════════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — fm_sync.js  v4
//
//  DESIGN SEMPLIFICATO:
//  1. loadAll() carica i dati da Supabase → window.__FM_DATA__
//  2. Carica app.js dinamicamente (React legge __FM_DATA__ nel primo useState)
//  3. Dopo 1.5s dal mount React, attiva il sync
//  4. __FM_ON_STATE__ riceve ogni cambio di stato e scrive su Supabase (debounced)
//  5. Nessuna magia con re-login: App non si smonta mai, il sync resta attivo
// ═══════════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const log  = (...a) => console.log('%c[FM]', 'color:#1a4fa0;font-weight:700;font-size:12px', ...a);
  const warn = (...a) => console.warn('%c[FM]', 'color:#c9a84c;font-weight:700;font-size:12px', ...a);
  const fail = (...a) => console.error('%c[FM] ⚠️', 'color:#8c1818;font-weight:700;font-size:12px', ...a);

  // ─── Stato ──────────────────────────────────────────────────────────────────
  let _prev       = {};         // snapshot dati al momento dell'ultimo sync
  let _ready      = false;      // true dopo che React ha ricevuto i dati Supabase
  let _timer      = null;
  const DEBOUNCE  = 1200;       // ms — aspetta che l'utente finisca di modificare

  // ─── Utility ────────────────────────────────────────────────────────────────
  function setStatus(msg) {
    const el = document.getElementById('status');
    if (el) el.textContent = msg;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ADAPTERS  DB → React
  // ═══════════════════════════════════════════════════════════════════════════
  function adaptStudente(r) {
    const FA = window.FMAdapter;
    const base = FA ? FA.studente(r) : r;
    // Aggiunge 'repertorio' che FMAdapter.studente non mappa
    const parseJson = (v, fallback=[]) => { if (!v) return fallback; if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch(e) { return fallback; } };
    base.repertorio = parseJson(r.repertorio, []);
    return base;
  }
  function adaptDocente(r) {
    const FA = window.FMAdapter;
    return FA ? FA.docente(r) : r;
  }
  function adaptCorso(r) {
    const FA = window.FMAdapter;
    return FA ? FA.corso(r) : r;
  }
  function adaptLezione(r, allegatiAll) {
    // Collega gli allegati di questa lezione (dal array globale allegati)
    const allegati = allegatiAll
      ? allegatiAll.filter(a => a.lezione_id === r.id).map(a => ({
          id: a.id,
          fileName: a.file_name || '',
          fileUrl: a.file_url || null,
          fileType: a.file_type || '',
          descrizione: a.descrizione || '',
          corso: a.corso || '',
          lezioneId: a.lezione_id || null,
          allievoNome: a.allievo_nome || '',
          createdAt: a.created_at || null,
        }))
      : [];
    return {
      id: r.id, date: r.data, hour: r.ora || '', student: r.student || '',
      tipo: r.tipo || 'individuale',
      studentId: r.studente_id || null,
      instrument: r.strumento || r.instrument || '', teacher: r.teacher || '', room: r.room || '',
      topic: r.topic || '', attendance: r.attendance || '',
      recurrence: r.recurrence || 'Nessuna', notes: r.notes || '',
      exercises: r.exercises || '', repertorio: r.repertorio || '',
      type: r.tipo || 'individuale',
      linkUrl: r.link_url || '',
      inRecupero: r.in_recupero || false,
      recuperoScadenza: r.recupero_scadenza || null,
      allegati,
    };
  }
  function adaptQuota(r) {
    const sm = { 'da pagare': 'attesa', 'in ritardo': 'ritardo' };
    return {
      id: String(r.id), studentId: r.studente_id || null,
      studentName: r.studente_nome || '', importo: parseFloat(r.importo) || 0,
      mese: r.mese, anno: r.anno, data: r.data_pagamento || '',
      metodo: r.metodo || 'Contanti', categoria: 'quota', desc: r.note || '',
      stato: sm[r.stato] || r.stato || 'attesa',
      dataPagamento: r.data_pagamento || '', numRicevuta: r.num_ricevuta || '',
    };
  }
  function adaptSpesa(r) {
    return {
      id: r.id, categoria: r.categoria || 'altro', desc: r.desc || '',
      importo: parseFloat(r.importo) || 0, mese: r.mese ?? 0,
      anno: r.anno || new Date().getFullYear(), metodo: r.metodo || '',
      data: r.data || '', docenteId: r.docente_id || null, note: r.note || '',
    };
  }
  function adaptBrano(r) {
    const parseJson = (v, fallback=[]) => { if (!v) return fallback; if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch(e) { return fallback; } };
    return {
      id: r.id,
      title: r.titolo || r.title || '',
      composer: r.compositore || r.composer || '',
      periodo: r.periodo || '', tonality: r.tonality || '',
      difficulty: r.difficulty || '', tipo: r.tipo || 'individuale',
      note: r.note || '', dataPrima: r.data_prima || '',
      dataUltima: r.data_ultima || '',
      linkBacking: r.link_backing || '',
      files: parseJson(r.files, []),
      spartiti: parseJson(r.spartiti, []),
    };
  }
  function adaptConcerto(r) {
    return {
      id: r.id,
      tipo: r.tipo || 'saggio',
      titolo: r.titolo || '',
      data: r.data || null,
      ora: r.ora || null,
      luogo: r.luogo || null,
      capienza: r.capienza ? parseInt(r.capienza) : 0,
      biglietto: r.biglietto || false,
      prezzoBiglietto: parseFloat(r.prezzo_biglietto) || 0,
      stato: r.stato || 'programmato',
      descrizione: r.descrizione || '',
      note: r.note || '',
      partecipanti: Array.isArray(r.partecipanti) ? r.partecipanti : (r.partecipanti ? JSON.parse(r.partecipanti) : []),
      scaletta: Array.isArray(r.scaletta) ? r.scaletta : (r.scaletta ? JSON.parse(r.scaletta) : []),
      prenotazioni: [],  // tabella separata concerti_prenotazioni — non ancora sincronizzata
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ADAPTERS  React → DB
  // ═══════════════════════════════════════════════════════════════════════════
  const toDB = {
    studenti(s) {
      return {
        id: s.id, nome: s.name || '', email: s.email || null,
        phone: s.phone || null, strumento: s.instrument || null,
        docente: s.teacher || null, livello: s.level || 'Principiante',
        status: s.status || 'attivo', monthly_fee: parseFloat(s.monthlyFee) || 0,
        fee_type: s.feeType || 'fisso', birthdate: s.birthdate || null,
        enroll_date: s.enrollDate || null,
        complementary_course: s.complementaryCourse || null,
        notes: s.notes || null,
        repertorio: Array.isArray(s.repertorio) ? JSON.stringify(s.repertorio) : (s.repertorio || null),
        updated_at: new Date().toISOString(),
      };
    },
    docenti(d) {
      // strumenti: l'app usa stringa "Piano · Violino", il DB può avere jsonb array o text
      const strumentiVal = Array.isArray(d.strumenti)
        ? d.strumenti
        : (d.strumenti ? d.strumenti.split(' · ').map(s => s.trim()).filter(Boolean) : null);
      return {
        id: d.id || null,
        nome: d.nome || d.name || '',
        teacher_key: d.teacherKey || d.nome || '',
        email: d.email || null, phone: d.phone || null,
        strumenti: strumentiVal,
        colore: d.colore || null,
        bio: d.bio || null,
        tariffa_ora: parseFloat(d.tariffaOra) || 0,
        contratto: d.contratto || null,
        data_inizio: d.dataInizio || null,
        attivo: d.attivo !== false,
      };
    },
    corsi(c) {
      return {
        id: c.id || null,
        nome: c.name || c.nome || '',
        tipo: c.type || c.tipo || 'individuale',  // DB usa "tipo"
        descrizione: c.description || null,
        livelli: c.livelli || null,
        foto: c.foto || null,
        visible: c.visible !== false,
      };
    },
    lezioni(l) {
      return {
        id: l.id || null,
        data: l.date, ora: l.hour || null,
        student: l.student || null,
        strumento: l.instrument || l.strumento || null,
        teacher: l.teacher || null, room: l.room || null,
        topic: l.topic || null, attendance: l.attendance || null,
        recurrence: l.recurrence || 'Nessuna', notes: l.notes || null,
        tipo: l.type || 'individuale', updated_at: new Date().toISOString(),
        link_url: l.linkUrl || null,
        in_recupero: l.inRecupero || false,
        recupero_scadenza: l.recuperoScadenza || null,
      };
    },
    quote(q) {
      const sm = { 'attesa': 'da pagare', 'ritardo': 'in ritardo' };
      return {
        id: String(q.id), studente_id: q.studentId ? parseInt(q.studentId, 10) : null,
        studente_nome: q.studentName || '', importo: parseFloat(q.importo) || 0,
        mese: q.mese, anno: q.anno,
        anno_scolastico: (q.anno && q.mese) ? (q.mese >= 9 ? q.anno : q.anno - 1) : null,
        stato: sm[q.stato] || q.stato || 'da pagare',
        data_pagamento: q.dataPagamento || null,
        num_ricevuta: q.numRicevuta || '', metodo: q.metodo || 'Contanti',
        note: q.note || '',
      };
    },
    spese(s) {
      return {
        id: s.id, categoria: s.categoria || 'altro', descrizione: s.desc || s.descrizione || null,
        importo: parseFloat(s.importo) || 0, mese: s.mese ?? null,
        anno: s.anno || new Date().getFullYear(), metodo: s.metodo || null,
        data: s.data || null, docente_id: s.docenteId || null, note: s.note || null,
        updated_at: new Date().toISOString(),
      };
    },
    brani(b) {
      return {
        id: b.id || null,
        titolo: b.title || b.titolo || '',
        compositore: b.composer || b.compositore || null,
        periodo: b.periodo || null, tonality: b.tonality || null,
        difficulty: b.difficulty || null, tipo: b.tipo || 'individuale',
        note: b.note || null,
        link_backing: b.linkBacking || null,
        files: b.files ? JSON.stringify(b.files) : null,
        spartiti: b.spartiti ? JSON.stringify(b.spartiti) : null,
      };
    },
    allegati(a) {
      return {
        id: a.id || null,
        lezione_id: a.lezioneId || null,
        allievo_id: a.allievoId || null,
        allievo_nome: a.allievoNome || null,
        corso: a.corso || null,
        descrizione: a.descrizione || null,
        file_url: a.fileUrl || null,
        file_name: a.fileName || null,
        file_type: a.fileType || null,
        created_at: a.createdAt || new Date().toISOString(),
      };
    },
    concerti(c) {
      return {
        id: c.id || null,
        tipo: c.tipo || 'saggio',
        titolo: c.titolo || '',
        data: c.data || null,
        ora: c.ora || null,
        luogo: c.luogo || null,
        capienza: c.capienza ? parseInt(c.capienza) : null,
        biglietto: c.biglietto || false,
        prezzo_biglietto: parseFloat(c.prezzoBiglietto) || 0,
        stato: c.stato || 'programmato',
        descrizione: c.descrizione || null,
        note: c.note || null,
        partecipanti: JSON.stringify(c.partecipanti || []),
        scaletta: JSON.stringify(c.scaletta || []),
      };
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  DIFF
  // ═══════════════════════════════════════════════════════════════════════════
  function diff(prev, next) {
    if (!Array.isArray(prev) || !Array.isArray(next)) return { added:[], updated:[], deleted:[] };
    const pm = new Map(prev.map(r => [String(r.id), JSON.stringify(r)]));
    const nm = new Map(next.map(r => [String(r.id), r]));
    const added = [], updated = [], deleted = [];
    nm.forEach((item, id) => {
      if (!pm.has(id)) added.push(item);
      else if (pm.get(id) !== JSON.stringify(item)) updated.push(item);
    });
    pm.forEach((_, id) => { if (!nm.has(id)) deleted.push(id); });
    return { added, updated, deleted };
  }

  // Genera un UUID v4 valido per Supabase (colonne di tipo uuid)
  function newId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // Pulisce un oggetto row rimuovendo solo i valori `undefined` (non null)
  function cleanRow(row) {
    const r = {};
    Object.entries(row).forEach(([k, v]) => { if (v !== undefined) r[k] = v; });
    return r;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  WRITE — scrive una tabella su Supabase
  //
  //  Strategia ID per tabella:
  //  - studenti: ID intero auto-increment → per NUOVI record, rimuoviamo l'ID client
  //              e lasciamo generare a Supabase
  //  - tutte le altre (docenti, corsi, lezioni, quote, spese, brani): ID text
  //              assegnato dall'app → MANTENIAMO sempre l'ID; per nuovi record
  //              con ID placeholder (corto, tipo 'c3'), generiamo un vero ID univoco
  // ═══════════════════════════════════════════════════════════════════════════
  async function writeTable(table, changes, adapter) {
    const sb = window.supabaseClient;
    if (!sb) return;

    // Per record già esistenti in Supabase: UPDATE diretto
    for (const item of changes.updated) {
      try {
        const row = cleanRow(adapter(item));
        const { error } = await sb.from(table).update(row).eq('id', item.id);
        if (error) fail(`UPDATE ${table} [${item.id}]:`, error.message, '| row:', row);
        else log(`✎ ${table}`, item.id);
      } catch(e) { fail('update error', table, e); }
    }

    // Per nuovi record: INSERT con ID corretto
    for (const item of changes.added) {
      try {
        const row = cleanRow(adapter(item));
        if (table === 'studenti') {
          // studenti: ID intero auto-increment → Supabase lo genera
          delete row.id;
        } else {
          // Tutte le altre tabelle: ID text assegnato dall'app
          // Se l'ID non è un UUID valido, generiamo uno nuovo
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(row.id || ''));
          if (!row.id || !isValidUUID) row.id = newId();
        }
        const { error } = await sb.from(table).insert(row);
        if (error) {
          // Se duplicate key (record già esiste): proviamo upsert
          if (error.code === '23505') {
            const { error: e2 } = await sb.from(table).upsert(row);
            if (e2) fail(`UPSERT fallback ${table}:`, e2.message);
            else log(`✚ (upsert) ${table}`, row.id || '(auto)');
          } else {
            fail(`INSERT ${table}:`, error.message, '| row:', row);
          }
        } else {
          log(`✚ ${table}`, row.id || '(auto)');
        }
      } catch(e) { fail('upsert error', table, e); }
    }

    for (const id of changes.deleted) {
      try {
        const { error } = await sb.from(table).delete().eq('id', id);
        if (error) fail(`DELETE ${table} [${id}]:`, error.message);
        else log(`✕ ${table}`, id);
      } catch(e) { fail('delete error', table, e); }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SYNC — confronta _prev con lo stato corrente e scrive le differenze
  // ═══════════════════════════════════════════════════════════════════════════
  async function syncState(state) {
    if (!_ready) { warn('Sync non ancora attivo — salto'); return; }

    const MAP = [
      ['studenti', 'students', toDB.studenti],
      ['docenti',  'docenti',  toDB.docenti ],
      ['corsi',    'courses',  toDB.corsi   ],
      ['lezioni',  'lessons',  toDB.lezioni ],
      ['quote',    'entrate',  toDB.quote   ],
      ['spese',    'spese',    toDB.spese   ],
      ['brani',    'brani',    toDB.brani   ],
      ['concerti', 'concerti', toDB.concerti],
      ['allegati', 'allegati', toDB.allegati],
    ];

    let totalChanges = 0;
    const tasks = MAP.map(([table, key, adapter]) => {
      if (!state[key] || _prev[key] === undefined) return Promise.resolve();
      const d = diff(_prev[key], state[key]);
      const n = d.added.length + d.updated.length + d.deleted.length;
      if (n === 0) return Promise.resolve();
      totalChanges += n;
      log(`Sync ${table}: +${d.added.length} ~${d.updated.length} -${d.deleted.length}`);
      return writeTable(table, d, adapter);
    });

    await Promise.all(tasks);

    if (totalChanges > 0) {
      // Aggiorna snapshot
      _prev = {
        students: state.students ? [...state.students] : _prev.students,
        docenti:  state.docenti  ? [...state.docenti]  : _prev.docenti,
        courses:  state.courses  ? [...state.courses]  : _prev.courses,
        lessons:  state.lessons  ? [...state.lessons]  : _prev.lessons,
        entrate:  state.entrate  ? [...state.entrate]  : _prev.entrate,
        spese:    state.spese    ? [...state.spese]    : _prev.spese,
        brani:    state.brani    ? [...state.brani]    : _prev.brani,
        concerti: state.concerti ? [...state.concerti] : _prev.concerti,
        allegati: state.allegati ? [...state.allegati] : _prev.allegati,
      };
      log(`Sync completato (${totalChanges} modifiche)`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  LOAD ALL — carica tutti i dati da Supabase
  // ═══════════════════════════════════════════════════════════════════════════
  async function loadAll() {
    const sb = window.supabaseClient;
    if (!sb) return null;
    log('Caricamento da Supabase...');
    try {
      const [
        { data: sS, error: e1 }, { data: sD, error: e2 }, { data: sC, error: e3 },
        { data: sL, error: e4 }, { data: sB, error: e5 },
        { data: sP, error: e6 }, { data: sQ, error: e7 },
        { data: sEV, error: e8 }, { data: sAL, error: e9 },
        { data: sCFG },
      ] = await Promise.all([
        sb.from('studenti').select('*').order('nome'),
        sb.from('docenti').select('*').order('nome'),
        sb.from('corsi').select('*, corsi_docenti(docente_id)').order('nome'),
        sb.from('lezioni').select('*').order('data', { ascending: false }),
        sb.from('brani').select('*').order('titolo'),
        sb.from('spese').select('*').order('data', { ascending: false }),
        sb.from('quote').select('*').order('anno').order('mese'),
        sb.from('concerti').select('*').order('data', { ascending: false }),
        sb.from('allegati').select('*').order('created_at', { ascending: false }),
        sb.from('sito_config').select('*'),
      ]);

      // Log errori
      [['studenti',e1],['docenti',e2],['corsi',e3],['lezioni',e4],
       ['brani',e5],['spese',e6],['quote',e7],['concerti',e8],['allegati',e9]].forEach(([t,e]) => {
        if (e) fail(`Errore lettura ${t}:`, e.message);
      });

      // Converti array di righe sito_config in oggetto config
      const configFromDB = {};
      (sCFG || []).forEach(r => {
        try { configFromDB[r.chiave] = JSON.parse(r.valore); }
        catch(e) { configFromDB[r.chiave] = r.valore; }
      });

      const data = {
        config: Object.keys(configFromDB).length > 0 ? configFromDB : null,
        students: (sS || []).map(adaptStudente),
        docenti:  (sD || []).map(adaptDocente),
        courses:  (sC || []).map(adaptCorso),
        lessons:  (sL || []).map(r => adaptLezione(r, sAL || [])),
        brani:    (sB || []).map(adaptBrano),
        spese:    (sP || []).map(adaptSpesa),
        entrate:  (sQ || []).map(adaptQuota),
        concerti: (sEV || []).map(adaptConcerto),
        allegati: (sAL || []).map(r => ({
          id: r.id,
          lezioneId: r.lezione_id || null,
          allievoId: r.allievo_id || null,
          allievoNome: r.allievo_nome || null,
          corso: r.corso || null,
          descrizione: r.descrizione || null,
          fileUrl: r.file_url || null,
          fileName: r.file_name || null,
          fileType: r.file_type || null,
          createdAt: r.created_at || null,
        })),
      };

      log('Caricati →',
        `studenti:${data.students.length}`,
        `docenti:${data.docenti.length}`,
        `corsi:${data.courses.length}`,
        `lezioni:${data.lessons.length}`
      );
      return data;
    } catch(e) { fail('loadAll fallito:', e); return null; }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  REALTIME
  // ═══════════════════════════════════════════════════════════════════════════
  function subscribeRealtime() {
    const sb = window.supabaseClient;
    if (!sb || typeof sb.channel !== 'function') return;

    const cfg = [
      { t: 'studenti', k: 'students', o: 'nome',  a: adaptStudente },
      { t: 'docenti',  k: 'docenti',  o: 'nome',  a: adaptDocente  },
      { t: 'corsi',    k: 'courses',  o: 'nome',  a: adaptCorso    },
      { t: 'lezioni',  k: 'lessons',  o: 'data',  a: (r) => adaptLezione(r, [])  },
  { t: 'allegati', k: 'allegati', o: 'created_at', a: r => ({ id:r.id, lezioneId:r.lezione_id||null, allievoNome:r.allievo_nome||null, corso:r.corso||null, descrizione:r.descrizione||null, fileUrl:r.file_url||null, fileName:r.file_name||null, fileType:r.file_type||null, createdAt:r.created_at||null }) },
      { t: 'quote',    k: 'entrate',  o: 'mese',  a: adaptQuota    },
      { t: 'spese',    k: 'spese',    o: 'data',  a: adaptSpesa    },
      { t: 'brani',    k: 'brani',    o: 'titolo', a: adaptBrano    },
      { t: 'concerti', k: 'concerti', o: 'data',   a: adaptConcerto },
    ];

    cfg.forEach(({ t, k, o, a }) => {
      try {
        sb.channel(`fm4:${t}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: t }, async () => {
            const asc = (t !== 'lezioni' && t !== 'spese');
            const { data, error } = await sb.from(t).select('*').order(o, { ascending: asc });
            if (error) { warn('realtime', t, error.message); return; }
            const adapted = (data || []).map(a);
            _prev[k] = adapted;  // aggiorna snapshot senza triggerare write
            if (window.__FM_RELOAD__) window.__FM_RELOAD__({ [k]: adapted });
          })
          .subscribe();
      } catch(e) { warn('subscribe error', t, e); }
    });

    log('Realtime attivo');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  HOOK __FM_ON_STATE__ — chiamato da React ad ogni cambio di stato
  // ═══════════════════════════════════════════════════════════════════════════
  window.__FM_ON_STATE__ = function(state) {
    if (!_ready) return;
    clearTimeout(_timer);
    _timer = setTimeout(() => syncState(state), DEBOUNCE);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  MOUNT REACT
  // ═══════════════════════════════════════════════════════════════════════════
  function mountReact() {
    const rootEl    = document.getElementById('root');
    const loadingEl = document.getElementById('loading');
    setStatus('Avvio React…');
    try {
      if (window.__BOOT_ERROR) throw window.__BOOT_ERROR;
      const App = window.__AppComponent;
      if (!App) throw new Error('__AppComponent non definito — controlla app.js');
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

  // ═══════════════════════════════════════════════════════════════════════════
  //  BOOT — punto di ingresso
  // ═══════════════════════════════════════════════════════════════════════════
  async function boot() {
    if (!window.supabaseClient) {
      warn('supabaseClient non trovato');
      loadAppThen(mountReact);
      return;
    }

    // 1. Carica dati da Supabase PRIMA di caricare app.js
    setStatus('Connessione Supabase…');
    const data = await loadAll();

    if (data) {
      // 2. Inietta in __FM_DATA__ — React lo legge nel primo useState
      window.__FM_DATA__ = data;

      // 3. Snapshot per il diff
      _prev = {
        students: [...data.students], docenti: [...data.docenti],
        courses:  [...data.courses],  lessons: [...data.lessons],
        entrate:  [...data.entrate],  spese:   [...data.spese],
        brani:    [...data.brani],    concerti: [...(data.concerti||[])],
        allegati: [...(data.allegati||[])],
      };
    } else {
      warn('Supabase non disponibile — uso dati demo (modalità offline)');
    }

    // 4. Carica app.js e monta React
    setStatus('Caricamento app…');
    loadAppThen(() => {
      mountReact();

      if (data) {
        // 5. Attiva sync dopo 2s — tempo sufficiente per React di montarsi
        //    e per ricevere i dati da __FM_DATA__ senza scrivere demo su Supabase
        setTimeout(() => {
          _ready = true;
          log('✅ Sync attivo — pronto a scrivere su Supabase');
          subscribeRealtime();
        }, 2000);
      }
    });
  }

  function loadAppThen(callback) {
    const script = document.createElement('script');
    script.src   = './app.js';
    script.onload  = callback;
    script.onerror = () => {
      document.getElementById('spinner').style.display = 'none';
      setStatus('ERRORE: app.js non trovato (404)');
    };
    document.body.appendChild(script);
  }

  boot();

  // ── Cleanup ──────────────────────────────────────────────────────────────
  window.addEventListener('beforeunload', () => { clearTimeout(_timer); });

  // ── API debug da console ──────────────────────────────────────────────────
  window.__FM_SYNC__ = {
    // Forza ricaricamento dati da Supabase
    reload: async () => {
      const d = await loadAll();
      if (d && window.__FM_RELOAD__) {
        _prev = { students:[...d.students], docenti:[...d.docenti], courses:[...d.courses],
                  lessons:[...d.lessons], entrate:[...d.entrate], spese:[...d.spese],
                  brani:[...d.brani], concerti:[...(d.concerti||[])], allegati:[...(d.allegati||[])] };
        window.__FM_RELOAD__(d);
        log('Reload manuale OK');
      }
    },
    // Test scrittura: prova a fare un UPDATE su un record esistente
    testWrite: async (table = 'studenti') => {
      const sb = window.supabaseClient;
      const { data, error } = await sb.from(table).select('id').limit(1);
      if (error) { fail('testWrite SELECT:', error.message); return; }
      if (!data?.length) { warn('testWrite: tabella vuota'); return; }
      const id = data[0].id;
      const { error: e2 } = await sb.from(table).update({ updated_at: new Date().toISOString() }).eq('id', id);
      if (e2) fail(`testWrite UPDATE ${table} [${id}]:`, e2.message);
      else log(`testWrite OK — ${table} [${id}] aggiornato`);
    },
    status: () => ({
      ready: _ready,
      snap: Object.fromEntries(Object.entries(_prev).map(([k,v]) => [k, Array.isArray(v) ? v.length : '?'])),
    }),
  };

})();

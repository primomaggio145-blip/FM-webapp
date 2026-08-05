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
    const parseJson = (v, fallback=[]) => { if (!v) return fallback; if (Array.isArray(v)) return v; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch(e) { return fallback; } };
    base.repertorio      = parseJson(r.repertorio, []);
    base.extraInstruments = parseJson(r.extra_instruments, []);
    base.extraTeachers    = parseJson(r.extra_teachers, {});
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
      id: r.id, date: r.data,
      // Normalizza ora da "HH:MM:SS" (TIME Postgres) a "HH:MM"
      hour: r.ora ? r.ora.slice(0,5) : '',
      student: r.student || '',
      tipo: r.tipo || 'individuale',
      type: r.tipo || 'individuale',   // alias per compatibilità
      studentId: r.studente_id || null,
      instrument: r.strumento || r.instrument || '', teacher: r.teacher || '', room: r.room || '',
      topic: r.topic || '', attendance: r.attendance || '',
      recurrence: r.recurrence || 'Nessuna', notes: r.notes || '',
      exercises: r.exercises || '', repertorio: r.repertorio || '',
      linkUrl: r.link_url || '',
      inRecupero: r.in_recupero || false,
      recuperoScadenza: r.recupero_scadenza || null,
      durata: r.durata
        ? parseInt(r.durata)
        : (r.tipo === 'collettivo' ? 60 : r.tipo === 'prova' ? 30 : 45),
      repertorioIds: (() => {
        if (!r.repertorio_ids) return [];
        try { return JSON.parse(r.repertorio_ids); } catch(e) { return []; }
      })(),
      // Campi collettive
      courseId:   r.corso_id   || null,
      courseName: r.corso_nome || null,
      students: (() => {
        if (!r.students) return [];
        if (Array.isArray(r.students)) return r.students;
        try { return JSON.parse(r.students); } catch(e) { return []; }
      })(),
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
    const parseJson = (v, fallback=[]) => { if (!v) return fallback; if (Array.isArray(v)) return v; if (typeof v==='object') return v; try { return JSON.parse(v); } catch(e) { return fallback; } };
    let versioni = parseJson(r.versioni, []);
    // Migrazione automatica: se non ci sono versioni ma ci sono dati legacy
    // (tonalita/tonality, spartiti, files, link_backing), crea la prima versione al volo
    if (versioni.length === 0) {
      const tonLegacy = r.tonalita || r.tonality || '';
      const spartitiLegacy = parseJson(r.spartiti, []);
      const filesLegacy = parseJson(r.files, []);
      const linkLegacy = r.link_backing ? [{url:r.link_backing, label:'Backing track'}] : [];
      if (tonLegacy || spartitiLegacy.length || filesLegacy.length || linkLegacy.length) {
        versioni = [{ tonalita: tonLegacy, spartiti: spartitiLegacy, allegati: filesLegacy, link: linkLegacy, allievi: [] }];
      }
    }
    return {
      id: r.id,
      title: r.titolo || r.title || '',
      composer: r.compositore || r.composer || '',
      tipo: r.tipo || 'individuale',
      strumento: r.strumento || '',           // '' = ensemble/tutti gli strumenti
      eventiIds: parseJson(r.eventi_ids, []),
      versioni: versioni,
      note: r.note || '', dataPrima: r.data_prima || '',
      dataUltima: r.data_ultima || '',
      lezioni: r.lezioni || 0,
      // Campi legacy mantenuti per retrocompatibilità (letti, non più scritti)
      periodo: r.periodo || '',
      difficulty: r.difficolta || r.difficulty || '',
    };
  }
  function adaptConcerto(r, partecipantiMap) {
    const pj = (v, f) => { if(!v) return f; if(Array.isArray(v)) return v; if(typeof v==='object') return v; try { return JSON.parse(v); } catch(e) { return f; } };
    // Partecipanti: fonte di verità = tabella concerti_partecipanti (relazionale)
    const partecipantiDaTabella = (partecipantiMap && partecipantiMap[r.id]) || null;
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
      programma: pj(r.programma, []),
      scaletta: pj(r.scaletta, []),
      partecipanti: (partecipantiDaTabella && partecipantiDaTabella.length>0) ? partecipantiDaTabella : pj(r.partecipanti, []),
      prenotazioni: pj(r.prenotazioni, []),
    };
  }

  function adaptPrenotazioneSala(r) {
    return {
      id:          r.id,
      userId:      r.user_id     || null,
      richiedente: r.richiedente || '',
      ruolo:       r.ruolo       || 'allievo',
      data:        r.data        || '',
      oraInizio:   r.ora_inizio  ? r.ora_inizio.slice(0,5)  : '',
      oraFine:     r.ora_fine    ? r.ora_fine.slice(0,5)    : '',
      telefono:    r.telefono    || '',
      motivo:      r.motivo      || '',
      stato:       r.stato       || 'in_attesa',
      noteAdmin:   r.note_admin  || '',
      createdAt:   r.created_at  || '',
      updatedAt:   r.updated_at  || '',
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
        docente: s.teacher || null,
        codice_fiscale: s.codiceFiscale || null,
        status: s.status || 'attivo', monthly_fee: parseFloat(s.monthlyFee) || 0,
        fee_type: s.feeType || 'fisso', birthdate: s.birthdate || null,
        enroll_date: s.enrollDate || null,
        complementary_course: s.complementaryCourse || null,
        notes: s.notes || null,
        extra_instruments: s.extraInstruments && s.extraInstruments.length > 0
          ? JSON.stringify(s.extraInstruments) : null,
        extra_teachers: s.extraTeachers && Object.keys(s.extraTeachers).length > 0
          ? JSON.stringify(s.extraTeachers) : null,
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
        studente_id: l.studentId ? parseInt(l.studentId, 10) : null,
        strumento: l.instrument || l.strumento || null,
        teacher: l.teacher || null, room: l.room || null,
        topic: l.topic || null, attendance: l.attendance || null,
        recurrence: l.recurrence || 'Nessuna', notes: l.notes || null,
        // tipo: leggi da l.tipo PRIMA di l.type (l.type è il vecchio alias, tipo è il campo corretto)
        tipo: l.tipo || l.type || 'individuale',
        updated_at: new Date().toISOString(),
        link_url: l.linkUrl || null,
        in_recupero: l.inRecupero || false,
        recupero_scadenza: l.recuperoScadenza || null,
        durata: l.durata ? parseInt(l.durata) : null,
        exercises: l.exercises || null,
        repertorio_ids: l.repertorioIds && l.repertorioIds.length > 0
          ? JSON.stringify(l.repertorioIds)
          : null,
        // Campi collettive — essenziali per non perdere gli allievi
        corso_id:   l.courseId   || null,
        corso_nome: l.courseName || null,
        students: l.students && l.students.length > 0
          ? JSON.stringify(l.students)
          : null,
      };
    },
    quote(q) {
      // React state → DB values
      const smToDB = { 'attesa': 'da pagare', 'ritardo': 'in ritardo', 'pagato': 'pagato' };
      return {
        id: String(q.id), studente_id: q.studentId ? parseInt(q.studentId, 10) : null,
        studente_nome: q.studentName || '', importo: parseFloat(q.importo) || 0,
        mese: q.mese, anno: q.anno,
        anno_scolastico: (q.anno && q.mese) ? (q.mese >= 9 ? q.anno : q.anno - 1) : null,
        stato: smToDB[q.stato] || q.stato || 'da pagare',
        data_pagamento: q.dataPagamento || q.data || null,
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
    prenotazioni_sala(p) {
      return {
        id:          p.id || null,
        user_id:     p.userId || null,
        richiedente: p.richiedente || '',
        ruolo:       p.ruolo || 'allievo',
        data:        p.data || null,
        ora_inizio:  p.oraInizio || null,
        ora_fine:    p.oraFine || null,
        motivo:      p.motivo    || null,
        telefono:    p.telefono  || null,
        stato:       p.stato || 'in_attesa',
        note_admin:  p.noteAdmin || null,
        updated_at:  new Date().toISOString(),
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
  //  NOTIFICHE AUTOMATICHE — campanella (tabella `notifiche`) + push PWA
  //
  //  Ogni riga inserita in `notifiche` appare sulla campanella del destinatario
  //  e — se il destinatario ha la PWA installata con push attivo — genera anche
  //  una notifica push nativa (stessa infrastruttura già usata per recuperi/pagamenti).
  //  Rispetta il toggle "attivo" configurato in Impostazioni Notifiche (admin),
  //  se presente per il tipo (window.__FM_NOTIFICHE_CONFIG__).
  // ═══════════════════════════════════════════════════════════════════════════

  // Esposto su window così può essere richiamato anche dagli altri file dell'app
  // (es. RepertorioView, modal Modifica Lezione) per gli eventi che non passano
  // dal diff automatico di questo file.
  window.FM_NOTIFY = async function(opts) {
    const sb = window.supabaseClient;
    if (!sb || !opts || !opts.tipo) return;
    const cfg = (window.__FM_NOTIFICHE_CONFIG__ || {})[opts.tipo];
    if (cfg && cfg.attivo === false) return; // rispetta il toggle admin, se configurato
    // Ruoli effettivamente abilitati per questo tipo (se l'admin ha configurato i destinatari
    // in Impostazioni Notifiche, altrimenti nessun filtro: si usano i destinatari passati alla chiamata)
    const ruoliAbilitati = (cfg && Array.isArray(cfg.destinatari)) ? cfg.destinatari : null;

    const now  = new Date().toISOString();
    const meta = opts.meta ? JSON.stringify(opts.meta) : null;
    const rows = [];
    const seen = new Set();
    const pushEnabled = opts.push !== false; // default true — solo i tipi che passano push:false lo disattivano
    const pushRow = (ruolo, id, nome) => {
      if (ruoliAbilitati && !ruoliAbilitati.includes(ruolo)) return; // ruolo escluso dall'admin → nessuna notifica
      const key = ruolo + ':' + (id != null ? 'id:' + id : 'nome:' + String(nome || '').toLowerCase());
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({
        destinatario_ruolo: ruolo,
        destinatario_id:    id != null ? String(id) : null,
        destinatario_nome:  nome || null,
        tipo:               opts.tipo,
        titolo:             opts.titolo,
        messaggio:          opts.messaggio,
        letto:              false,
        push:               pushEnabled, // false = solo campanella, nessuna notifica push
        created_at:         now,
        meta:               meta,
      });
    };
    (opts.studentIds    || []).forEach(id   => { if (id != null) pushRow('allievo', id, null); });
    (opts.studentNames  || []).forEach(nome => { if (nome) pushRow('allievo', null, nome); });
    (opts.teacherIds    || []).forEach(id   => { if (id != null) pushRow('docente', id, null); });
    (opts.teacherNames  || []).forEach(nome => { if (nome) pushRow('docente', null, nome); });
    // Broadcast: notifica l'intero ruolo (nessun destinatario_id/nome → visibile a tutti quelli del ruolo)
    (opts.broadcastRoles || []).forEach(ruolo => pushRow(ruolo, null, null));
    if (opts.includeAdmin !== false) pushRow('admin', null, null);

    if (!rows.length) return;
    try {
      const { error } = await sb.from('notifiche').insert(rows);
      if (error) warn('FM_NOTIFY insert error:', error.message);
    } catch(e) { warn('FM_NOTIFY exception:', e && e.message); }
  };

  // Estrae allievo/i e docente destinatari di una lezione (gestisce sia
  // individuali — student/studentId/teacher — sia collettive — students[]/teacher).
  // Quando possibile risolve il NOME al vero ID (studenti/docenti) così il match a
  // valle (bell/tab notifiche) è per id e non per confronto testuale del nome,
  // che può differire tra profili.nome e studenti.nome/docenti.nome.
  function _lezioneDestinatari(l, studentsList, docentiList) {
    let teacherIds = [], teacherNames = [];
    if (l.teacher) {
      const doc = (docentiList || []).find(d => (d.name || d.nome || '').toLowerCase().trim() === String(l.teacher).toLowerCase().trim());
      if (doc && doc.id != null) teacherIds = [doc.id]; else teacherNames = [l.teacher];
    }
    let studentIds = [], studentNames = [];
    if (Array.isArray(l.students) && l.students.length > 0) {
      l.students.forEach(s => {
        if (!s) return;
        if (s.id != null) { studentIds.push(s.id); return; }
        if (s.name) {
          const stu = (studentsList || []).find(st => (st.name || st.nome || '').toLowerCase().trim() === String(s.name).toLowerCase().trim());
          if (stu && stu.id != null) studentIds.push(stu.id); else studentNames.push(s.name);
        }
      });
    } else if (l.studentId != null) {
      studentIds = [l.studentId];
    } else if (l.student) {
      const stu = (studentsList || []).find(st => (st.name || st.nome || '').toLowerCase().trim() === String(l.student).toLowerCase().trim());
      if (stu && stu.id != null) studentIds = [stu.id]; else studentNames = [l.student];
    }
    return { teacherIds, teacherNames, studentIds, studentNames };
  }

  function _fmtDataOraLezione(l) {
    let d = l.date || l.data || '';
    if (d) { try { d = new Date(d + 'T00:00:00').toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit' }); } catch(e) {} }
    return (d || '') + (l.hour ? ' ore ' + l.hour : '');
  }

  const ATTENDANCE_LABEL = {
    presente:    'Presente',
    assente:     'Assente',
    recuperata:  'Recuperata',
    in_recupero: 'In attesa di recupero',
    recupero:    'Lezione di recupero',
  };

  // Tipi di lezione con un proprio flusso di notifiche dedicato già esistente
  // (sala prove ha già le sue notifiche di richiesta/approvazione) → esclusi qui
  const LEZIONI_TIPI_ESCLUSI = new Set(['sala_prove']);

  async function notifyLezioniChanges(d, prevMap, studentsList, docentiList) {
    if (!d) return;

    for (const l of d.added) {
      if (LEZIONI_TIPI_ESCLUSI.has(l.tipo)) continue;
      const { teacherIds, teacherNames, studentIds, studentNames } = _lezioneDestinatari(l, studentsList, docentiList);
      if (!teacherIds.length && !teacherNames.length && !studentIds.length && !studentNames.length) continue;
      const nomeCorso = l.courseName || l.instrument || 'Lezione';
      await window.FM_NOTIFY({
        tipo:      'lezione_creata',
        titolo:    '📅 Nuova lezione in calendario',
        messaggio: nomeCorso + ' — ' + _fmtDataOraLezione(l) + (l.teacher ? ' con ' + l.teacher : ''),
        studentIds, studentNames, teacherIds, teacherNames,
        push: false, // solo campanella, nessuna notifica push (richiesta esplicita)
        meta: { lezioneId: l.id },
      });
    }

    for (const id of d.deleted) {
      const l = prevMap.get(String(id));
      if (!l || LEZIONI_TIPI_ESCLUSI.has(l.tipo)) continue;
      const { teacherIds, teacherNames, studentIds, studentNames } = _lezioneDestinatari(l, studentsList, docentiList);
      if (!teacherIds.length && !teacherNames.length && !studentIds.length && !studentNames.length) continue;
      const nomeCorso = l.courseName || l.instrument || 'Lezione';
      await window.FM_NOTIFY({
        tipo:      'lezione_eliminata',
        titolo:    '🗑️ Lezione eliminata',
        messaggio: nomeCorso + ' — ' + _fmtDataOraLezione(l) + (l.teacher ? ' con ' + l.teacher : ''),
        studentIds, studentNames, teacherIds, teacherNames,
        push: false, // solo campanella, nessuna notifica push
        meta: { lezioneId: id },
      });
    }

    for (const l of d.updated) {
      if (LEZIONI_TIPI_ESCLUSI.has(l.tipo)) continue;
      const prevL  = prevMap.get(String(l.id));
      const attNew = l.attendance || '';
      const attOld = (prevL && prevL.attendance) || '';
      if (!attNew || attNew === attOld) continue; // nessuna variazione di presenza reale
      const { teacherIds, teacherNames, studentIds, studentNames } = _lezioneDestinatari(l, studentsList, docentiList);
      if (!teacherIds.length && !teacherNames.length && !studentIds.length && !studentNames.length) continue;
      const nomeCorso = l.courseName || l.instrument || 'Lezione';
      const label = ATTENDANCE_LABEL[attNew] || attNew;
      await window.FM_NOTIFY({
        tipo:      'presenza_variata',
        titolo:    '✔️ Presenza registrata',
        messaggio: nomeCorso + ' — ' + _fmtDataOraLezione(l) + ': ' + label,
        studentIds, studentNames, teacherIds, teacherNames,
        push: false, // solo campanella, nessuna notifica push
        meta: { lezioneId: l.id, attendance: attNew },
      });
    }
  }

  async function notifyConcertiChanges(d) {
    if (!d) return;
    for (const c of d.added) {
      const studentIds   = (c.partecipanti || []).map(p => p && p.studentId).filter(v => v != null);
      const studentNames = (c.partecipanti || []).map(p => p && p.studentName).filter(Boolean);
      let dataFmt = c.data || '';
      try { if (dataFmt) dataFmt = new Date(dataFmt + 'T00:00:00').toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric' }); } catch(e) {}
      await window.FM_NOTIFY({
        tipo:      'concerto_evento',
        titolo:    '🎤 Nuovo evento: ' + (c.titolo || 'Concerto'),
        messaggio: (dataFmt || '') + (c.luogo ? ' — ' + c.luogo : ''),
        studentIds, studentNames,
        broadcastRoles: ['docente'], // tutti i docenti vengono informati dei nuovi eventi
        push: false, // solo campanella, nessuna notifica push
        meta: { concertoId: c.id },
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SYNC — confronta _prev con lo stato corrente e scrive le differenze
  // ═══════════════════════════════════════════════════════════════════════════
  async function syncState(state) {
    if (!_ready) { warn('Sync non ancora attivo — salto'); return; }

    // NOTA: le lezioni NON sono in questo MAP — vengono scritte direttamente
    // dall'app (handleEdit, handleAttendance, safeInsertRecurringLesson, ecc.)
    // Includerle qui causerebbe scritture duplicate e falsi "~151 modifiche" ad ogni sync.
    const MAP = [
      ['studenti', 'students', toDB.studenti],
      ['docenti',  'docenti',  toDB.docenti ],
      ['corsi',    'courses',  toDB.corsi   ],
      ['lezioni',  'lessons',  toDB.lezioni ],  // ← ri-aggiunto: handleAdd non scrive direttamente
      ['quote',    'entrate',  toDB.quote   ],
      ['spese',    'spese',    toDB.spese   ],
      // brani: gestiti direttamente da RepertorioView (no double-insert)
     ['concerti', 'concerti', toDB.concerti],
      ['allegati', 'allegati', toDB.allegati],
      ['prenotazioni_sala', 'prenotazioni_sala', toDB.prenotazioni_sala],
    ];

    // Snapshot pre-scrittura di prev.lessons: serve a notifyLezioniChanges per
    // recuperare i dati di una lezione eliminata e il vecchio valore di "attendance"
    const prevLezioniMap = new Map((_prev.lessons || []).map(l => [String(l.id), l]));
    const diffsByKey = {};

    let totalChanges = 0;
    const tasks = MAP.map(([table, key, adapter]) => {
      if (!state[key] || _prev[key] === undefined) return Promise.resolve();
      const d = diff(_prev[key], state[key]);
      diffsByKey[key] = d;
      const n = d.added.length + d.updated.length + d.deleted.length;
      if (n === 0) return Promise.resolve();
      totalChanges += n;
      log(`Sync ${table}: +${d.added.length} ~${d.updated.length} -${d.deleted.length}`);
      return writeTable(table, d, adapter);
    });

    await Promise.all(tasks);

    // ── Notifiche automatiche (campanella + push PWA) ────────────────────────
    try {
      if (diffsByKey.lessons)  await notifyLezioniChanges(diffsByKey.lessons, prevLezioniMap, state.students, state.docenti);
      if (diffsByKey.concerti) await notifyConcertiChanges(diffsByKey.concerti);
    } catch(e) { warn('Errore notifiche automatiche:', e && e.message); }

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
        prenotazioni_sala: state.prenotazioni_sala ? [...state.prenotazioni_sala] : _prev.prenotazioni_sala,
      };
      log(`Sync completato (${totalChanges} modifiche) [lezioni scritte direttamente dall'app]`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  LOAD ALL — carica tutti i dati da Supabase
  //  PER LE LEZIONI: solo ultimi 60 giorni + future (non tutto il DB storico)
  //  Le lezioni più vecchie rimangono in memoria dal caricamento iniziale
  // ═══════════════════════════════════════════════════════════════════════════
  async function loadAll() {
    const sb = window.supabaseClient;
    if (!sb) return null;
    log('Caricamento da Supabase...');
    try {
      // Soglia: 60 giorni fa (abbastanza per calendario mensile + recuperi)
      const oggi = new Date();
      const soglia60g = new Date(oggi);
      soglia60g.setDate(soglia60g.getDate() - 60);
      const sogliaISO = soglia60g.toISOString().split('T')[0];

      const [
        { data: sS, error: e1 }, { data: sD, error: e2 }, { data: sC, error: e3 },
        { data: sL, error: e4 }, { data: sB, error: e5 },
        { data: sP, error: e6 }, { data: sQ, error: e7 },
        { data: sEV, error: e8 }, { data: sAL, error: e9 },
        { data: sCFG },
        { data: sSALA, error: e10 },
        { data: sANNI },
        { data: sISCR },
        { data: sCP },
      ] = await Promise.all([
        sb.from('studenti').select('*').order('nome'),
        sb.from('docenti').select('*').order('nome'),
        sb.from('corsi').select('*, corsi_docenti(docente_id)').order('nome'),
        // Lezioni: solo ultimi 60 giorni + future (non lo storico completo)
        sb.from('lezioni').select('*').gte('data', sogliaISO).order('data', { ascending: false }),
        sb.from('brani').select('*').order('titolo'),
        sb.from('spese').select('*').order('data', { ascending: false }),
        sb.from('quote').select('*').order('anno').order('mese'),
        sb.from('concerti').select('*').order('data', { ascending: false }),
        sb.from('allegati').select('*').order('created_at', { ascending: false }),
        sb.from('sito_config').select('*'),
        sb.from('prenotazioni_sala').select('*').order('data').order('ora_inizio'),
        sb.from('anni_scolastici').select('*').order('anno_inizio', { ascending: false }),
        sb.from('iscrizioni_anno').select('*'),
        sb.from('concerti_partecipanti').select('*'),
      ]);

      // Log errori
      [['studenti',e1],['docenti',e2],['corsi',e3],['lezioni',e4],
       ['brani',e5],['spese',e6],['quote',e7],['concerti',e8],['allegati',e9],['prenotazioni_sala',e10]].forEach(([t,e]) => {
        if (e) fail(`Errore lettura ${t}:`, e.message);
      });

      // Converti array di righe sito_config in oggetto config
      const configFromDB = {};
      (sCFG || []).forEach(r => {
        try { configFromDB[r.chiave] = JSON.parse(r.valore); }
        catch(e) { configFromDB[r.chiave] = r.valore; }
      });
      // dashboardPanels from sito_config
      const dashboardPanelsDB = configFromDB.dashboardPanels && typeof configFromDB.dashboardPanels === 'object' ? configFromDB.dashboardPanels : null;
      if (dashboardPanelsDB) delete configFromDB.dashboardPanels;
      // Remove legacy anniScolastici from sito_config if present (now stored in anni_scolastici table)
      if (configFromDB.anniScolastici) delete configFromDB.anniScolastici;

      // Adatta righe anni_scolastici → formato app
      const anniScolasticiDB = (sANNI||[]).map(r => ({
        id:         r.id,
        label:      r.label,
        annoInizio: r.anno_inizio,
        annoFine:   r.anno_fine || (r.anno_inizio+1),
        mesiAttivi: Array.isArray(r.mesi_attivi) ? r.mesi_attivi : [0,1,2,3,4,8,9,10,11],
        attivo:     r.attivo || false,
        stato:      r.stato,
        note:       r.note || '',
      }));
      log('Anni scolastici DB: ' + anniScolasticiDB.length + ' — ' + anniScolasticiDB.map(a=>a.label+'('+a.stato+')').join(', '));

      // annoInizioAttivo: usa l'anno con attivo=true come fonte di verità
      // (coerente con la stessa logica in app-root.js __FM_FORCE_REFRESH__)
      const annoAttivoFromDB = (sANNI||[]).find(r => r.attivo === true);
      if (annoAttivoFromDB) {
        configFromDB.annoInizioAttivo = annoAttivoFromDB.anno_inizio;
      } else if (configFromDB.annoInizioAttivo) {
        configFromDB.annoInizioAttivo = parseInt(configFromDB.annoInizioAttivo) || configFromDB.annoInizioAttivo;
      }

      // Mappa concerto_id → lista partecipanti (da tabella relazionale concerti_partecipanti)
      const partecipantiMap = {};
      (sCP || []).forEach(p => {
        const cid = String(p.concerto_id);
        if (!partecipantiMap[cid]) partecipantiMap[cid] = [];
        partecipantiMap[cid].push({ studentId: p.studente_id, studentName: p.studente_nome||'', brani: p.brani||[] });
      });

      // Iscrizioni per anno scolastico (chi è iscritto, a che corso, con che docente)
      const iscrizioniAnnoDB = (sISCR || []).map(r => ({
        id: r.id, studentId: r.studente_id, annoInizio: r.anno_inizio,
        corsoId: r.corso_id||'', corsoNome: r.corso_nome||'',
        docenteId: r.docente_id||'', docenteNome: r.docente_nome||'',
        dataIscrizione: r.data_iscrizione||'', note: r.note||'',
      }));

      const data = {
        config: Object.keys(configFromDB).length > 0 ? configFromDB : null,
        anniScolastici: anniScolasticiDB, // sempre passato, anche se []
        iscrizioniAnno: iscrizioniAnnoDB, // sempre passato, anche se []
        dashboardPanels: dashboardPanelsDB,
        students: (sS || []).map(adaptStudente),
        docenti:  (sD || []).map(adaptDocente),
        courses:  (sC || []).map(adaptCorso),
        lessons:  (sL || []).map(r => adaptLezione(r, sAL || [])),
        brani:    (sB || []).map(adaptBrano),
        spese:    (sP || []).map(adaptSpesa),
        entrate:  (sQ || []).map(adaptQuota),
        concerti: (sEV || []).map(r => adaptConcerto(r, partecipantiMap)),
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
        prenotazioni_sala: (sSALA || []).map(adaptPrenotazioneSala),
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
      { t: 'prenotazioni_sala', k: 'prenotazioni_sala', o: 'data', a: adaptPrenotazioneSala },
    ];

    cfg.forEach(({ t, k, o, a }) => {
      try {
        sb.channel(`fm4:${t}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: t }, async () => {
            // Per 'lezioni': carica solo oggi + ultime modifiche (non tutto il DB)
            if (t === 'lezioni') {
              const todayISO = new Date().toISOString().split('T')[0];
              const recentThreshold = new Date(Date.now() - 5 * 60 * 1000).toISOString();
              const [{ data: dToday }, { data: dRecent }] = await Promise.all([
                sb.from('lezioni').select('*').eq('data', todayISO),
                sb.from('lezioni').select('*').gt('updated_at', recentThreshold).neq('data', todayISO),
              ]);
              const allFetched = [...(dToday||[]), ...(dRecent||[])];
              const fetchedIds = new Set(allFetched.map(r => r.id));
              const existing = (_prev[k] || []).filter(l => !fetchedIds.has(l.id));
              const adapted = [...existing, ...allFetched.map(r => adaptLezione(r, []))];
              _prev[k] = adapted;
              if (window.__FM_RELOAD__) window.__FM_RELOAD__({ [k]: adapted });
              return;
            }
            // Per le altre tabelle: carica tutto (sono tabelle piccole)
            const asc = (t !== 'spese');
            // Per corsi: include il join con corsi_docenti per preservare l'assegnazione docenti
            const selectStr = t === 'corsi' ? '*, corsi_docenti(docente_id)' : '*';
            const { data, error } = await sb.from(t).select(selectStr).order(o, { ascending: asc });
            if (error) { warn('realtime', t, error.message); return; }
            const adapted = (data || []).map(a);
            _prev[k] = adapted;
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

  // Esposto a app.js per aggiornare _prev dopo insert diretto su Supabase
  window.__FM_UPDATE_PREV__ = function(data) {
    if (data.lessons) {
      _prev.lessons = data.lessons.map(l => {
        try { return toDB.lezioni(l); } catch(e) { return l; }
      });
    }
    if (data.entrate) {
      _prev.entrate = data.entrate.map(e => {
        try { return toDB.quote(e); } catch(e2) { return e; }
      });
    }
  };

  // Esposto alle view (Allievi/Corsi/Docenti/Impostazioni): carica SOLO le lezioni
  // dell'anno scolastico indicato (1 set annoInizio → 31 ago annoInizio+1) e SOSTITUISCE
  // per intero lo stato React `lessons`, così calendario/registro mostrano solo quell'anno.
  // Resetta anche _prev.lessons alla stessa selezione: senza questo, il prossimo giro di
  // syncState() vedrebbe tutte le lezioni fuori range come "cancellate" e le eliminerebbe
  // davvero da Supabase — vedi window.__FM_UPDATE_PREV__ sopra, stesso principio.
  window.__FM_LOAD_LEZIONI_ANNO__ = async function(annoInizio) {
    const sb = window.supabaseClient;
    if (!sb || annoInizio == null) return null;
    try {
      const dataInizio = `${annoInizio}-09-01`;
      const dataFine   = `${Number(annoInizio) + 1}-08-31`;
      const { data, error } = await sb.from('lezioni').select('*')
        .gte('data', dataInizio).lte('data', dataFine)
        .order('data', { ascending: true });
      if (error) { warn('load lezioni anno', error.message); return null; }
      const adapted = (data || []).map(r => adaptLezione(r, []));
      _prev.lessons = adapted;
      if (window.__FM_RELOAD__) window.__FM_RELOAD__({ lessons: adapted });
      log(`Lezioni caricate per anno ${annoInizio}/${Number(annoInizio) + 1}: ${adapted.length}`);
      return adapted;
    } catch(e) { warn('load lezioni anno', e); return null; }
  };

  // Guard globale: set di chiavi "data_ora_corso/studente" per cui un insert è in corso o completato
  // Previene inserimenti doppi da handleEdit + debounce fm_sync
  window.__FM_LESSON_INSERTED__ = window.__FM_LESSON_INSERTED__ || new Set();

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
        prenotazioni_sala: [...(data.prenotazioni_sala||[])],
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
    // Carica i moduli in sequenza — ogni file espone i propri componenti globalmente
    const MODULES = [
      './app-core.js',
      './app-dashboard.js',
      './app-calendario.js',
      './app-views-a.js',
      './app-views-b.js',
      './app-root.js',
      './app-gcal.js',
    ];
    let idx = 0;
    function loadNext() {
      if (idx >= MODULES.length) { callback(); return; }
      const src = MODULES[idx++];
      const script = document.createElement('script');
      script.src = src;
      script.onload = loadNext;
      script.onerror = () => {
        document.getElementById('spinner').style.display = 'none';
        setStatus('ERRORE: ' + src + ' non trovato (404)');
      };
      document.body.appendChild(script);
    }
    loadNext();
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
                  brani:[...d.brani], concerti:[...(d.concerti||[])], allegati:[...(d.allegati||[])],
                  prenotazioni_sala:[...(d.prenotazioni_sala||[])] };
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

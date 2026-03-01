// ═══════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — Integrazione Supabase
//  
//  ISTRUZIONI:
//  1. Crea il progetto su supabase.com
//  2. Vai su Settings → API e copia URL e anon key
//  3. Sostituisci i valori sotto
//  4. Questo file va incluso PRIMA di app.js e di admin.html
//
//  <script src="supabase_integration.js"></script>
//  <script src="app.js"></script>
// ═══════════════════════════════════════════════════════════════════

// ─── CONFIGURAZIONE ────────────────────────────────────────────────
const SUPABASE_URL  = 'https://ocsxrjommtrjelnbihfr.supabase.co';   // ← sostituisci
const SUPABASE_KEY  = 'sb_publishable_hoDexm3CUGWCnH6OrjbQ7Q_zMutnDcO';     // ← anon public key

// ─── CLIENT ────────────────────────────────────────────────────────
// Carica la libreria Supabase (già inclusa via CDN in webapp.html/admin.html)
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════════════════════════════════
//  API — funzioni usate dalla webapp (app.js) e dall'admin
// ═══════════════════════════════════════════════════════════════════

const FM = {

  // ─── STUDENTI ────────────────────────────────────────────────────
  studenti: {
    async list() {
      const { data, error } = await db.from('studenti').select('*').order('nome');
      if (error) throw error;
      return data;
    },
    async get(id) {
      const { data, error } = await db.from('studenti').select(`
        *, 
        lezioni(*), 
        repertorio_studenti(*), 
        quote(*)
      `).eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async add(studente) {
      const { data, error } = await db.from('studenti').insert(studente).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, fields) {
      const { data, error } = await db.from('studenti')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await db.from('studenti').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // ─── DOCENTI ─────────────────────────────────────────────────────
  docenti: {
    async list() {
      const { data, error } = await db.from('docenti').select('*').order('nome');
      if (error) throw error;
      return data;
    },
    async add(docente) {
      const { data, error } = await db.from('docenti').insert(docente).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, fields) {
      const { data, error } = await db.from('docenti').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
  },

  // ─── CORSI ───────────────────────────────────────────────────────
  corsi: {
    async list() {
      const { data, error } = await db.from('corsi').select('*, corsi_docenti(docente_id)').order('nome');
      if (error) throw error;
      return data;
    },
    async update(id, fields) {
      const { data, error } = await db.from('corsi').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async toggleVisible(id, visible) {
      return FM.corsi.update(id, { visible });
    }
  },

  // ─── LEZIONI ─────────────────────────────────────────────────────
  lezioni: {
    async listByStudente(studenteId) {
      const { data, error } = await db.from('lezioni')
        .select('*').eq('studente_id', studenteId).order('data', { ascending: false });
      if (error) throw error;
      return data;
    },
    async add(lezione) {
      const { data, error } = await db.from('lezioni').insert(lezione).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await db.from('lezioni').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // ─── QUOTE (pagamenti) ────────────────────────────────────────────
  quote: {
    async list(filters = {}) {
      let q = db.from('quote').select('*');
      if (filters.studente_id) q = q.eq('studente_id', filters.studente_id);
      if (filters.anno)        q = q.eq('anno', filters.anno);
      if (filters.stato)       q = q.eq('stato', filters.stato);
      const { data, error } = await q.order('anno').order('mese');
      if (error) throw error;
      return data;
    },
    async update(id, fields) {
      const { data, error } = await db.from('quote').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async add(quota) {
      const { data, error } = await db.from('quote').insert(quota).select().single();
      if (error) throw error;
      return data;
    },
    async setStato(id, stato, dataPagamento = null) {
      return FM.quote.update(id, {
        stato,
        data_pagamento: dataPagamento || (stato === 'pagato' ? new Date().toISOString().split('T')[0] : null)
      });
    }
  },

  // ─── CONCERTI ────────────────────────────────────────────────────
  concerti: {
    async list() {
      const { data, error } = await db.from('concerti').select('*, concerti_partecipanti(*), concerti_prenotazioni(*)').order('data');
      if (error) throw error;
      return data;
    },
    async add(concerto) {
      const { data, error } = await db.from('concerti').insert(concerto).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, fields) {
      const { data, error } = await db.from('concerti').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await db.from('concerti').delete().eq('id', id);
      if (error) throw error;
    },
    async toggleVisible(id, visible) {
      return FM.concerti.update(id, { visible });
    }
  },

  // ─── SPESE ───────────────────────────────────────────────────────
  spese: {
    async list(anno) {
      let q = db.from('spese').select('*');
      if (anno) q = q.eq('anno', anno);
      const { data, error } = await q.order('data', { ascending: false });
      if (error) throw error;
      return data;
    },
    async add(spesa) {
      const { data, error } = await db.from('spese').insert(spesa).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await db.from('spese').delete().eq('id', id);
      if (error) throw error;
    }
  },

  // ─── BRANI (repertorio) ───────────────────────────────────────────
  brani: {
    async list() {
      const { data, error } = await db.from('brani').select('*').order('titolo');
      if (error) throw error;
      return data;
    },
    async add(brano) {
      const { data, error } = await db.from('brani').insert(brano).select().single();
      if (error) throw error;
      return data;
    }
  },

  // ─── UTENTI ──────────────────────────────────────────────────────
  utenti: {
    async list() {
      const { data, error } = await db.from('utenti').select('*').order('nome');
      if (error) throw error;
      return data;
    },
    async update(id, fields) {
      const { data, error } = await db.from('utenti').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
  },

  // ─── SITO CONFIG (admin + sito pubblico) ─────────────────────────
  sito: {
    async getAll() {
      const { data, error } = await db.from('sito_config').select('*');
      if (error) throw error;
      // Trasforma in oggetto chiave:valore
      const result = {};
      (data || []).forEach(row => { result[row.chiave] = row.valore; });
      return result;
    },
    async set(chiave, valore) {
      const { error } = await db.from('sito_config')
        .upsert({ chiave, valore: typeof valore === 'object' ? JSON.stringify(valore) : String(valore), updated_at: new Date().toISOString() })
        .eq('chiave', chiave);
      if (error) throw error;
    },
    async getAttivita() {
      const { data, error } = await db.from('sito_attivita').select('*').eq('visible', true).order('ordine');
      if (error) throw error;
      return data;
    },
    async getAttivitaAll() {
      const { data, error } = await db.from('sito_attivita').select('*').order('ordine');
      if (error) throw error;
      return data;
    },
    async updateAttivita(id, fields) {
      const { data, error } = await db.from('sito_attivita').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async getCorsiComplementari() {
      const { data, error } = await db.from('corsi_complementari').select('*').eq('visible', true).order('ordine');
      if (error) throw error;
      return data;
    },
    async getCorsiComplementariAll() {
      const { data, error } = await db.from('corsi_complementari').select('*').order('ordine');
      if (error) throw error;
      return data;
    },
    async updateCorsoComplementare(id, fields) {
      const { data, error } = await db.from('corsi_complementari').update(fields).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
  },

  // ─── REALTIME ────────────────────────────────────────────────────
  // Usa subscribeToTable() per ricevere aggiornamenti in tempo reale
  realtime: {
    subscribe(table, callback) {
      return db.channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
        .subscribe();
    },
    unsubscribe(channel) {
      db.removeChannel(channel);
    }
  },

  // ─── ANNO SCOLASTICO ──────────────────────────────────────────────
  anni: {
    async list() {
      const { data, error } = await db.from('anni_scolastici').select('*').order('anno_inizio', { ascending: false });
      if (error) throw error;
      return data;
    },
    async attivo() {
      const { data, error } = await db.from('anni_scolastici').select('*').eq('stato', 'attivo').single();
      if (error) throw error;
      return data;
    }
  }
};

// ═══════════════════════════════════════════════════════════════════
//  HELPER — converte formato DB → formato webapp React
// ═══════════════════════════════════════════════════════════════════
const FMAdapter = {
  studente(row) {
    if (!row) return null;
    return {
      id: row.id,
      name: row.nome,
      email: row.email || '',
      phone: row.phone || '',
      instrument: row.strumento || '',
      teacher: row.docente || '',
      level: row.livello || 'Principiante',
      status: row.status || 'attivo',
      monthlyFee: parseFloat(row.monthly_fee) || 0,
      feeType: row.fee_type || 'fisso',
      birthdate: row.birthdate || '',
      enrollDate: row.enroll_date || '',
      complementaryCourse: row.complementary_course || '',
      notes: row.notes || '',
      lessons: (row.lezioni || []).map(FMAdapter.lezione),
      repertorio: (row.repertorio_studenti || []).map(FMAdapter.repertorioItem),
      quote: (row.quote || []).map(FMAdapter.quota),
    };
  },
  lezione(row) {
    return { id: row.id, date: row.data, topic: row.topic, attendance: row.attendance, notes: row.notes || '' };
  },
  repertorioItem(row) {
    return { id: row.id, titolo: row.titolo, compositore: row.compositore || '', periodo: row.periodo || '', stato: row.stato, dataInizio: row.data_inizio || '', note: row.note || '' };
  },
  quota(row) {
    return { id: row.id, mese: row.mese, anno: row.anno, importo: parseFloat(row.importo), stato: row.stato, dataPagamento: row.data_pagamento || '', numRicevuta: row.num_ricevuta || '' };
  },
  docente(row) {
    return { id: row.id, nome: row.nome, teacherKey: row.teacher_key, email: row.email || '', phone: row.phone || '', strumenti: row.strumenti || '', bio: row.bio || '', tariffaOra: parseFloat(row.tariffa_ora) || 0, contratto: row.contratto || '', dataInizio: row.data_inizio || '', attivo: row.attivo };
  },
  corso(row) {
    return { id: row.id, name: row.nome, type: row.tipo, description: row.descrizione || '', livelli: row.livelli || '', foto: row.foto || '', visible: row.visible, docenti: (row.corsi_docenti || []).map(cd => cd.docente_id) };
  },
  concerto(row) {
    return { id: row.id, tipo: row.tipo, titolo: row.titolo, data: row.data, ora: row.ora, luogo: row.luogo || '', capienza: row.capienza || 0, biglietto: row.biglietto, prezzoBiglietto: parseFloat(row.prezzo_biglietto) || 0, stato: row.stato, descrizione: row.descrizione || '', note: row.note || '', badge: row.badge || 'Concerto', visible: row.visible, ingresso: row.ingresso || 'Ingresso libero', partecipanti: (row.concerti_partecipanti || []), prenotazioni: (row.concerti_prenotazioni || []) };
  }
};

// Esporta globalmente
window.FM = FM;
window.FMAdapter = FMAdapter;
window.supabaseClient = db;

console.log('✅ Futuro Musica — Supabase connesso');

// ════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — supabase_integration.js
//  Inizializza il client Supabase + FMAdapter + gestione Auth reale
// ════════════════════════════════════════════════════════════════

(function () {
  // ── CONFIGURA QUESTE DUE RIGHE CON I TUOI VALORI SUPABASE ────
  const SUPABASE_URL  = 'https://ocsxrjommtrjelnbihfr.supabase.co';
  const SUPABASE_ANON = 'INCOLLA_QUI_LA_TUA_ANON_KEY';
  // URL della Edge Function (dopo averla deployata)
  const EDGE_APPROVE  = `${SUPABASE_URL}/functions/v1/approve-user`;
  // ─────────────────────────────────────────────────────────────

  const { createClient } = window.supabase;
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
      autoRefreshToken:  true,
      persistSession:    true,
      detectSessionInUrl: true,   // necessario per il link di invito email
    }
  });

  window.supabaseClient = sb;
  window.SUPABASE_EDGE_APPROVE = EDGE_APPROVE;

  // ── FMAdapter: DB → formato React ───────────────────────────
  window.FMAdapter = {
    studente(r) {
      return {
        id:                   r.id,
        name:                 r.nome                    || '',
        email:                r.email                   || '',
        phone:                r.phone                   || '',
        instrument:           r.strumento               || '',
        teacher:              r.docente                 || '',
        level:                r.livello                 || 'Principiante',
        status:               r.status                  || 'attivo',
        monthlyFee:           parseFloat(r.monthly_fee) || 0,
        feeType:              r.fee_type                || 'fisso',
        birthdate:            r.birthdate               || '',
        enrollDate:           r.enroll_date             || '',
        complementaryCourse:  r.complementary_course    || '',
        notes:                r.notes                   || '',
        lessons:              [],
      };
    },
    docente(r) {
      // strumenti può essere array (jsonb) o stringa — normalizziamo a stringa
      let strumentiStr = '';
      if (Array.isArray(r.strumenti)) strumentiStr = r.strumenti.join(' · ');
      else if (typeof r.strumenti === 'string') strumentiStr = r.strumenti;
      return {
        id:          r.id,
        nome:        r.nome           || '',
        email:       r.email          || '',
        phone:       r.phone          || '',
        strumenti:   strumentiStr,
        colore:      r.colore         || '#1a4fa0',
        teacherKey:  r.teacher_key    || r.nome || '',
        bio:         r.bio            || '',
        stato:       r.stato          || 'attivo',
        tariffaOra:  parseFloat(r.tariffa_ora) || 0,
        contratto:   r.contratto      || '',
        dataInizio:  r.data_inizio    || '',
        corsi:       r.corsi          || [],
      };
    },
    corso(r) {
      // docenti: array di ID dalla join corsi_docenti
      const docenti = (r.corsi_docenti || []).map(cd => cd.docente_id);
      return {
        id:          r.id,
        name:        r.nome           || '',
        type:        r.tipo           || 'individuale',  // app usa "type" non "tipo"
        description: r.descrizione    || '',
        docenti,                                          // app usa "docenti" non "docentiIds"
      };
    },
  };

  // ── Auth helpers esposti a fm_sync e app.js ──────────────────

  // Login con email + password
  window.FM_AUTH = {

    async signIn(email, password) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Leggi il ruolo dal profilo
      const profilo = await window.FM_AUTH.getProfilo(data.user.id);
      return { user: data.user, profilo };
    },

    async signOut() {
      await sb.auth.signOut();
    },

    async getSession() {
      const { data: { session } } = await sb.auth.getSession();
      return session;
    },

    async getCurrentUser() {
      const { data: { user } } = await sb.auth.getUser();
      return user;
    },

    async getProfilo(userId) {
      const { data, error } = await sb.from('profili').select('*').eq('id', userId).single();
      if (error) return null;
      return data;
    },

    // Invia richiesta di accesso (senza essere autenticati)
    async inviaRichiesta({ nome, email, ruolo, messaggio }) {
      // Genera UUID compatibile con tutti i browser
      const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      const row = { id: newId, nome, email, ruolo };
      // Aggiungi colonne opzionali solo se presenti
      if (messaggio) row.messaggio = messaggio;
      try { row.stato = 'in_attesa'; } catch(e) {}
      const { error } = await sb.from('richieste_accesso').insert(row);
      if (error) throw error;
    },

    // Admin: approva richiesta → manda email invito
    async approvaRichiesta({ richiestaId, nome, email, ruolo }) {
      const session = await window.FM_AUTH.getSession();
      const res = await fetch(window.SUPABASE_EDGE_APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({ action: 'approva', richiestaId, nome, email, ruolo }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Errore approvazione');
      return json;
    },

    // Admin: rifiuta richiesta
    async rifiutaRichiesta({ richiestaId }) {
      const session = await window.FM_AUTH.getSession();
      const res = await fetch(window.SUPABASE_EDGE_APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({ action: 'rifiuta', richiestaId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Errore rifiuto');
      return json;
    },

    // Admin: sospendi / riattiva utente
    async sospendiUtente({ userId, sospendi }) {
      const session = await window.FM_AUTH.getSession();
      const res = await fetch(window.SUPABASE_EDGE_APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({ action: sospendi ? 'sospendi' : 'riattiva', userId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Errore sospensione');
      return json;
    },

    // Admin: elimina utente
    async eliminaUtente({ userId }) {
      const session = await window.FM_AUTH.getSession();
      const res = await fetch(window.SUPABASE_EDGE_APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({ action: 'elimina', userId }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Errore eliminazione');
      return json;
    },

    // Carica tutte le richieste in attesa (solo admin)
    async getRichieste() {
      const { data, error } = await sb
        .from('richieste_accesso')
        .select('*')
        .eq('stato', 'in_attesa')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },

    // Carica tutti i profili utente (solo admin)
    async getProfili() {
      const { data, error } = await sb
        .from('profili')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    },
  };

  console.log('%c[FM] supabase_integration.js caricato ✓', 'color:#1a4fa0;font-weight:600');
})();

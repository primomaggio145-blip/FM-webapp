// ════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — supabase_integration.js
//  Inizializza il client Supabase + FMAdapter + gestione Auth reale
// ════════════════════════════════════════════════════════════════

(function () {
  // ── CONFIGURA QUESTE DUE RIGHE CON I TUOI VALORI SUPABASE ────
  const SUPABASE_URL  = 'https://ocsxrjommtrjelnbihfr.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc3hyam9tbXRyamVsbmJpaGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjE0NDAsImV4cCI6MjA4NzkzNzQ0MH0.ScXeqKD73hu1zMwVWppybmNRqCtKWnR9C_pfNMjwQio';
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
      return {
        id:         r.id,
        nome:       r.nome        || '',
        email:      r.email       || '',
        phone:      r.phone       || '',
        strumenti:  r.strumenti   || [],
        colore:     r.colore      || '#1a4fa0',
        teacherKey: r.teacher_key || r.nome || '',
        bio:        r.bio         || '',
        stato:      r.stato       || 'attivo',
      };
    },
    corso(r) {
      const docentiIds = (r.corsi_docenti || []).map(cd => cd.docente_id);
      return {
        id:          r.id,
        name:        r.nome       || '',
        instrument:  r.strumento  || '',
        tipo:        r.tipo       || 'individuale',
        description: r.descrizione|| '',
        docentiIds,
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
      const { error } = await sb.from('richieste_accesso').insert({
        id:              crypto.randomUUID(),
        nome,
        email,
        ruolo_richiesto: ruolo,
        messaggio:       messaggio || '',
        stato:           'in_attesa',
      });
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

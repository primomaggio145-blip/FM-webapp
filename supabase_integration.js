// ════════════════════════════════════════════════════════════════
//  FUTURO MUSICA — supabase_integration.js
//  Inizializza il client Supabase + FMAdapter + gestione Auth reale
// ════════════════════════════════════════════════════════════════

(function () {
  // ── CONFIGURA QUESTE DUE RIGHE CON I TUOI VALORI SUPABASE ────
  const SUPABASE_URL  = 'https://ocsxrjommtrjelnbihfr.supabase.co';
  const SUPABASE_ANON = 'sb_publishable_hoDexm3CUGWCnH6OrjbQ7Q_zMutnDcO'; // publishable key (nuovo sistema Supabase)
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
        codiceFiscale:        r.codice_fiscale          || '',
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
        // Visibilità prenotazioni sala prove nel calendario personale del docente —
        // di default disattivata (il docente deve attivarla dalle sue Impostazioni)
        mostraPrenotazioniSala: r.mostra_prenotazioni_sala === true,
        disponibilitaRecuperi: (() => {
          const v = r.disponibilita_recuperi;
          if (!v) return [];
          if (Array.isArray(v)) return v;
          try { return JSON.parse(v); } catch(e) { return []; }
        })(),
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
      const profilo = await window.FM_AUTH.getProfilo(data.user.id);
      if (profilo && profilo.stato === 'sospeso') {
        await sb.auth.signOut();
        throw new Error("Account sospeso. Contatta l'amministratore.");
      }
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
      const { data, error } = await sb.from('profili').select('*').eq('id', userId).maybeSingle();
      if (error) return null;
      // Collegamento automatico per EMAIL (lato server, SECURITY DEFINER): se l'allievo/docente
      // non è ancora collegato al suo record, lo colleghiamo quando l'email dell'account
      // coincide in modo univoco con quella in anagrafica. Il nome NON viene usato qui: chi si
      // registra con un nome diverso resta comunque collegabile, e nessuno può "agganciarsi"
      // ai dati di un altro allievo solo scrivendone il nome. Best-effort: se la funzione SQL
      // non esiste ancora, si prosegue come prima.
      try {
        const manca = data && ((data.ruolo === 'allievo' && data.allievo_id == null) ||
                               (data.ruolo === 'docente' && data.docente_id == null));
        if (manca && userId) {
          const { data: res, error: rpcErr } = await sb.rpc('fm_collega_profilo_per_email');
          if (rpcErr) console.warn('[FM] auto-collegamento profilo non disponibile:', rpcErr.message);
          else if (res && res.ok) {
            if (res.allievo_id != null) data.allievo_id = res.allievo_id;
            if (Array.isArray(res.allievi_ids)) data.allievi_ids = res.allievi_ids;
            if (res.docente_id != null) data.docente_id = res.docente_id;
            console.log('[FM] profilo collegato automaticamente per email:', res);
          } else if (res) console.warn('[FM] profilo non collegato (' + (res.motivo || '?') + ') — collegalo da Impostazioni › Utenti');
        }
      } catch (ex) { console.warn('[FM] auto-collegamento profilo fallito (non bloccante):', ex.message); }
      return data;
    },

    // Invia richiesta di accesso (senza essere autenticati)
    async inviaRichiesta({ nome, email, ruolo, messaggio, nomeSocio }) {
      // Genera UUID compatibile con tutti i browser
      const newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      const row = { id: newId, nome, email, ruolo };
      // Aggiungi colonne opzionali solo se presenti
      if (messaggio) row.messaggio = messaggio;
      if (nomeSocio) row.nome_socio = nomeSocio;
      try { row.stato = 'in_attesa'; } catch(e) {}
      const { error } = await sb.from('richieste_accesso').insert(row);
      if (error) throw error;
    },

    // Admin: approva richiesta → manda email invito
    async approvaRichiesta({ richiestaId, nome, email, ruolo, nomeSocio, allievoId, docenteId, allieviIds }) {
      // Usa session token se disponibile, altrimenti anon key (admin senza sessione Auth)
      const session = await window.FM_AUTH.getSession();
      console.log('[FM] approvaRichiesta session:', session ? 'OK uid='+session.user?.id : 'NULL');
      const token = (session && session.access_token) ? session.access_token : SUPABASE_ANON;
      console.log('[FM] approvaRichiesta token starts with:', token ? token.substring(0,20) : 'NULL');
      const res = await fetch(window.SUPABASE_EDGE_APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({ action: 'approva', richiestaId, nome, email, ruolo }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || 'Errore approvazione');

      // Dopo la creazione del profilo: nome socio (best-effort) + COLLEGAMENTO per ID al record
      // allievo/docente scelto dall'admin. Senza allievo_id/docente_id l'app ricade sul
      // confronto per nome e non trova nulla se l'utente si è registrato con un nome diverso.
      const newUserId = json.user?.id || json.userId || json.id || null;
      const toId = v => (v == null || v === '') ? null : (isNaN(Number(v)) ? v : Number(v));
      const upd = {};
      if (nomeSocio) { upd.nome_socio = nomeSocio; upd.note = `Socio/iscritto: ${nomeSocio}`; }
      // Più figli collegati allo stesso account: allievi_ids = tutti, allievo_id = quello attivo (il primo)
      const listaAll = (Array.isArray(allieviIds) ? allieviIds : []).map(toId).filter(v => v != null);
      if (ruolo === 'allievo' && listaAll.length) { upd.allievi_ids = listaAll; if (toId(allievoId) == null) allievoId = listaAll[0]; }
      if (ruolo === 'allievo' && toId(allievoId) != null) upd.allievo_id = toId(allievoId);
      if (ruolo === 'docente' && toId(docenteId) != null) upd.docente_id = toId(docenteId);
      json._collegato = false;
      if (Object.keys(upd).length) {
        try {
          const query = newUserId
            ? sb.from('profili').update(upd).eq('id', newUserId).select('id')
            : sb.from('profili').update(upd).eq('email', email).select('id');
          let { data: updRows, error: updErr } = await query;
          // Colonna allievi_ids non ancora creata (migrazione non eseguita): riprova senza
          if (updErr && /allievi_ids/.test(updErr.message || '') && upd.allievi_ids) {
            console.warn('[FM] colonna profili.allievi_ids mancante: esegui la migrazione SQL. Salvo solo il primo allievo.');
            delete upd.allievi_ids;
            ({ data: updRows, error: updErr } = await (newUserId
              ? sb.from('profili').update(upd).eq('id', newUserId).select('id')
              : sb.from('profili').update(upd).eq('email', email).select('id')));
          }
          if (updErr) console.warn('[FM] impossibile aggiornare il profilo approvato:', updErr.message);
          else json._collegato = !!(updRows && updRows.length) && (upd.allievo_id != null || upd.docente_id != null);
          if (!updErr && (!updRows || !updRows.length)) console.warn('[FM] profilo approvato non trovato per il collegamento (id/email):', newUserId, email);
        } catch (ex) {
          console.warn('[FM] aggiornamento profilo approvato fallito (non bloccante):', ex.message);
        }
      }
      return json;
    },

    // Admin: rinvia l'email di invito a un utente che non ha ancora impostato la password.
    // Riusa la stessa Edge Function di approvaRichiesta (già configurata con service role),
    // con action:'reinvia' — richiede che l'Edge Function gestisca questo case (vedi nota
    // separata data all'amministratore per l'aggiunta lato server).
    async reinviaInvito({ email }) {
      const session = await window.FM_AUTH.getSession();
      const token = (session && session.access_token) ? session.access_token : SUPABASE_ANON;
      const res = await fetch(window.SUPABASE_EDGE_APPROVE, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey':        SUPABASE_ANON,
        },
        body: JSON.stringify({ action: 'reinvia', email }),
      });
      const json = await res.json().catch(()=>({}));
      if (!res.ok || json.error) throw new Error(json.error || `Errore HTTP ${res.status}`);
      return json;
    },

    // Admin: rifiuta richiesta — aggiorna direttamente il DB (non serve Edge Function)
    async rifiutaRichiesta({ richiestaId }) {
      const { error } = await sb.from("richieste_accesso")
        .update({ stato: "rifiutata", updated_at: new Date().toISOString() })
        .eq("id", richiestaId);
      if (error) throw new Error(error.message || "Errore rifiuto");
      return { ok: true };
    },

    // Admin: sospendi / riattiva utente — aggiorna solo il profilo nel DB
    async sospendiUtente({ userId, sospendi }) {
      const stato = sospendi ? "sospeso" : "attivo";
      const { error } = await sb.from("profili")
        .update({ stato, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw new Error(error.message || "Errore sospensione");
      // Nota: il ban Auth-side richiede service_role (Edge Function)
      // Per ora blocchiamo solo a livello profilo — il login fallirà perché
      // loadProfile restituirà stato=sospeso e lapp mostra errore
      return { ok: true };
    },

    // Admin: elimina utente — rimuove solo il profilo nel DB
    async eliminaUtente({ userId }) {
      // Usa la Edge Function admin-users per eliminare COMPLETAMENTE
      // l'account (auth.users + profilo), non solo il profilo.
      // Richiede ruolo admin — verificato lato server.
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (!session) throw new Error("Sessione non valida");
        const res = await fetch(
          'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/admin-users',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + session.access_token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'delete', userId }),
          }
        );
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Errore eliminazione");
        return { ok: true };
      } catch (e) {
        // Fallback: elimina almeno il profilo se la Edge Function non risponde
        console.warn('[FM] admin-users delete failed, fallback a solo profilo:', e?.message);
        const { error } = await sb.from("profili").delete().eq("id", userId);
        if (error) throw new Error(error.message || "Errore eliminazione");
        return { ok: true, partial: true };
      }
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

    // Genitore con più figli: elenco (id, nome) degli allievi collegati all'utente corrente.
    // Via RPC SECURITY DEFINER: le RLS dell'allievo potrebbero non permettere di leggere
    // l'anagrafica dell'altro figlio, ma il nome serve per il selettore.
    async mieiAllievi() {
      const { data, error } = await sb.rpc('fm_miei_allievi');
      if (error) { console.warn('[FM] fm_miei_allievi:', error.message); return []; }
      return (data || []).map(r => ({ id: String(r.id), nome: r.nome || '' }));
    },

    // Cambia l'allievo ATTIVO (profili.allievo_id) tra quelli collegati. Lato server verifica
    // che l'ID sia davvero tra gli allievi_ids dell'utente: nessuno può selezionare altri allievi.
    // Aggiornare allievo_id sul DB fa sì che anche eventuali policy RLS basate su allievo_id
    // seguano il figlio selezionato, e che al prossimo accesso si riparta dall'ultimo scelto.
    async selezionaAllievo(allievoId) {
      const { data, error } = await sb.rpc('fm_seleziona_allievo', { p_allievo_id: String(allievoId) });
      if (error) throw error;
      if (!data || !data.ok) throw new Error((data && data.motivo) || 'Selezione non consentita');
      return data;
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

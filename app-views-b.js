(function() {
  try {
var _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN
// ─── DATI DOCENTI ESTESI ──────────────────────────────────────────────────────
const INIT_DOCENTI_EXT = [
  { id:"d1", corsi:["c1","c3","c7","c8","c10"], nome:"Prof. Marco Rossi",   teacherKey:"Prof. Rossi",   email:"m.rossi@accademia.it",    phone:"338 1122334", strumenti:"Pianoforte · Violino",   bio:"Diplomato al Conservatorio di Milano. 15 anni di esperienza.", tariffaOra:35, contratto:"Tempo indeterminato", dataInizio:"2015-09-01", colore:C.gold    },
  { id:"d2", corsi:["c2","c4","c7","c10"], nome:"Prof. Luca Bianchi",  teacherKey:"Prof. Bianchi", email:"l.bianchi@accademia.it",  phone:"347 5566778", strumenti:"Chitarra · Flauto",      bio:"Specializzato in musica moderna e jazz. Masterclass annuali.", tariffaOra:35, contratto:"Tempo determinato",    dataInizio:"2018-01-15", colore:C.teal    },
  { id:"d3", corsi:["c5","c8","c10"], nome:"Prof. Mario Verde",   teacherKey:"Prof. Verde",   email:"m.verde@accademia.it",    phone:"333 9988776", strumenti:"Batteria · Percussioni", bio:"Batterista professionista, collabora con diverse orchestre.",   tariffaOra:35, contratto:"Collaborazione",        dataInizio:"2020-03-01", colore:C.blue    },
  { id:"d4", corsi:["c9","c10"], nome:"Prof.ssa Lia Marino", teacherKey:"Prof. Marino",  email:"l.marino@accademia.it",   phone:"366 3344556", strumenti:"Canto · Solfeggio",      bio:"Soprano lirico, docente di tecnica vocale e teoria musicale.",  tariffaOra:35, contratto:"Tempo indeterminato", dataInizio:"2017-09-01", colore:C.purple  },
];

const DocentiView = ({ students:_studentsRaw, lessons:_lessonsRaw, docenti, setDocenti, annoInizioAttivo, courses:_coursesDocView, userRuolo:_ruoloDocView, appUser:_appUserDocView, quickAction:_qaDocView, clearQuickAction:_clearQaDocView }) => {
  const ruoloDocView = _ruoloDocView || "admin";
  const isMobile = useIsMobile();
  const students = _studentsRaw || [];
  const lessons = _lessonsRaw || [];

  // Auto-seleziona il proprio record se loggato come docente
  const _myDocRecord = React.useMemo(() => {
    if (ruoloDocView !== "docente") return null;
    const did = (_appUserDocView && _appUserDocView.docenteId) || null;
    if (did) return (docenti||[]).find(d => String(d.id) === String(did)) || null;
    const ln  = (_appUserDocView && _appUserDocView.nome) || "";
    if (!ln) return null;
    return (docenti||[]).find(d => d.teacherKey===ln || (d.nome||"").toLowerCase().includes(ln.toLowerCase())) || null;
  }, [ruoloDocView, docenti, _appUserDocView]);

  const [selected,  setSelected]  = useState(null);
  const [tab,       setTab]       = useState("profilo");
  const [modal,     setModal]     = useState(null);
  const [draft,     setDraft]     = useState({});

  // Quando arrivano i dati da Supabase, aggiorna selected per il docente loggato
  // MA NON durante un salvataggio attivo (evita di sovrascrivere le modifiche)
  React.useEffect(() => {
    if (ruoloDocView !== "docente") return;
    // Non aggiornare se c'è un profiloForm attivo o un salvataggio in corso
    if (docSettings.profiloForm || docSettings.savingProfilo) return;
    if (_myDocRecord) setSelected(_myDocRecord);
  }, [_myDocRecord, ruoloDocView]);

  // Per admin: sincronizza selected con l'array docenti aggiornato
  React.useEffect(() => {
    if (ruoloDocView === "docente") return;
    if (!selected) return;
    const updated = (_studentsRaw ? null : null) || docenti.find(d => d.id === selected.id);
    if (updated && JSON.stringify(updated) !== JSON.stringify(selected)) {
      setSelected(updated);
    }
  }, [docenti]);

  // Carica disponibilità recuperi dal record selezionato quando cambia
  React.useEffect(() => {
    if (!selected) return;
    const disp = selected.disponibilitaRecuperi || [];
    const parsed = typeof disp === "string" ? (()=>{ try{return JSON.parse(disp);}catch(e){return [];} })() : disp;
    setDocSettings(p => ({ ...p, disponibilita: Array.isArray(parsed) ? parsed : [] }));
  }, [selected?.id]);

  // Gestisce quickAction — apre tab specifico
  React.useEffect(() => {
    if (_qaDocView === "showImpostazioni") {
      setTab("impostazioni");
      if (_clearQaDocView) _clearQaDocView();
    } else if (_qaDocView === "showCompenso") {
      setTab("compenso");
      if (_clearQaDocView) _clearQaDocView();
    }
  }, [_qaDocView]);

  const initDoc = { nome:"", email:"", phone:"", bio:"", tariffaOra:35, contratto:"Collaborazione", dataInizio:"", colore:C.gold, corsi:[] };

  const openNew  = () => { setDraft({...initDoc}); setModal("new"); };
  const openEdit = (d) => {
    // Ricava i corsi assegnati dal docente dalla lista corsi (junction corsi_docenti)
    // Se d.corsi è vuoto (come viene dal DB senza join dedicato), usa la lista courses
    const corsiCalcolati = (_coursesDocView||[])
      .filter(c => (c.docenti||[]).map(String).includes(String(d.id)))
      .map(c => c.id);
    setDraft({...d, corsi: (d.corsi||[]).length > 0 ? d.corsi : corsiCalcolati});
    setModal("edit");
  };
  const saveDoc  = async () => {
    const isNew = modal === "new";
    const saved = isNew
      ? {...draft, id:uid(), colore:draft.colore||C.gold, teacherKey:draft.teacherKey||draft.nome}
      : {...draft};
    if(isNew)  setDocenti(p=>[...p, saved]);
    if(!isNew) { setDocenti(p=>p.map(d=>d.id===saved.id?saved:d)); if(_optionalChain([selected, 'optionalAccess', _83 => _83.id])===saved.id) setSelected(saved); }
    setModal(null);

    // Persiste corsi_docenti su Supabase
    const sb = window.supabaseClient;
    if (sb && saved.id) {
      try {
        // Prima: elimina tutte le associazioni esistenti per questo docente
        await sb.from('corsi_docenti').delete().eq('docente_id', saved.id);
        // Poi: inserisce le nuove associazioni
        const nuovi = (saved.corsi||[]).map(corsoId => ({ docente_id: saved.id, corso_id: corsoId }));
        if (nuovi.length > 0) {
          const { error } = await sb.from('corsi_docenti').insert(nuovi);
          if (error) console.warn('[FM] corsi_docenti insert:', error.message);
        }
        // Aggiorna immediatamente il campo docenti di ogni corso in React state
        // così l'UI riflette subito senza aspettare realtime
        if (window.__FM_RELOAD__ && window.__FM_DATA__) {
          const updatedCourses = (window.__FM_DATA__.courses || []).map(c => {
            const wasAssigned = (c.docenti||[]).map(String).includes(String(saved.id));
            const nowAssigned = (saved.corsi||[]).map(String).includes(String(c.id));
            if (wasAssigned === nowAssigned) return c;
            const newDocenti = nowAssigned
              ? [...(c.docenti||[]).filter(id=>String(id)!==String(saved.id)), saved.id]
              : (c.docenti||[]).filter(id=>String(id)!==String(saved.id));
            return { ...c, docenti: newDocenti };
          });
          window.__FM_DATA__.courses = updatedCourses;
          window.__FM_RELOAD__({ courses: updatedCourses });
        }
        // Aggiorna la tabella docenti con i nomi colonne del DB (non campi app)
        // NON usare FMAdapter.docente (è DB→App); costruiamo il row App→DB qui
        const strumentiDb = typeof saved.strumenti === 'string' && saved.strumenti
          ? saved.strumenti.split(' · ').map(s=>s.trim()).filter(Boolean)
          : (Array.isArray(saved.strumenti) ? saved.strumenti : null);
        const row = {
          id:          saved.id,
          nome:        saved.nome        || '',
          email:       saved.email       || null,
          phone:       saved.phone       || null,
          strumenti:   strumentiDb,
          colore:      saved.colore      || null,
          teacher_key: saved.teacherKey  || saved.nome || '',
          bio:         saved.bio         || null,
          tariffa_ora: parseFloat(saved.tariffaOra) || 0,
          contratto:   saved.contratto   || null,
          data_inizio: saved.dataInizio  || null,
          attivo:      saved.attivo !== false,
        };
        // rimuove undefined
        Object.keys(row).forEach(k => { if (row[k] === undefined) delete row[k]; });
        if (isNew) {
          await sb.from('docenti').insert(row);
        } else {
          await sb.from('docenti').update(row).eq('id', saved.id);
        }
      } catch(e) { console.warn('[FM] saveDoc Supabase error:', e); }
    }
  };
  const delDoc = (id) => { setDocenti(p=>p.filter(d=>d.id!==id)); if(_optionalChain([selected, 'optionalAccess', _84 => _84.id])===id) setSelected(null); setModal(null); };

  // Helpers — match tramite teacherKey (campo dedicato per corrispondenza esatta)
  const matchTeacher = (d, teacherField) => {
    if(!teacherField) return false;
    const tf = teacherField.toLowerCase().trim();
    const key = (d.teacherKey || d.nome || '').toLowerCase().trim();
    const nom = (d.nome || '').toLowerCase().trim();
    if(!key && !nom) return false;
    return tf === key || tf === nom || tf.includes(key) || key.includes(tf)
        || tf.includes(nom) || nom.includes(tf);
  };
  const allievi  = (d) => students.filter(s => matchTeacher(d, s.teacher));
  const lezioniD = (d) => lessons.filter(l => l.date && matchTeacher(d, l.teacher) && l.attendance !== 'recuperata');

  // Calcoli mensili basati su lezioni effettive
  const nowDate   = new Date(today);
  const curYear   = nowDate.getFullYear();
  const curMonth  = nowDate.getMonth()+1;
  const prevMonth = curMonth===1 ? 12 : curMonth-1;
  const prevYear  = curMonth===1 ? curYear-1 : curYear;

  // Lezioni del mese di un docente: SOLO presenza "presente" o "assente" contano per il compenso
  // (giustificato, recupero, in_recupero, vuoto → non retribuiti)
  // Lezioni del mese di un docente che contano per il COMPENSO: presenza presente|assente
  const lezioniMese = (d, m, y) => lessons.filter(l => {
    if(l.attendance === 'recuperata') return false;
    if(!matchTeacher(d, l.teacher)) return false;
    const att = l.attendance || '';
    if(att !== 'presente' && att !== 'assente') return false;
    const [ly,lm] = (l.date||'').split("-").map(Number);
    return ly===y && lm===m;
  });
  // Nota: lezioniMese già funziona per collettive perché l.teacher è sempre valorizzato
  const stipendioMese = (d, m=curMonth, y=curYear) => lezioniMese(d,m,y).length * d.tariffaOra;

  // Tutte le lezioni del mese di un docente (per conteggio totale)
  const tutteLezioniMese = (d, m, y) => lessons.filter(l => {
    if(l.attendance === 'recuperata') return false;
    if(!matchTeacher(d, l.teacher)) return false;
    const [ly,lm] = (l.date||'').split("-").map(Number);
    return ly===y && lm===m;
  });

  // Strumenti di un docente: usa d.strumenti se presente, altrimenti ricava
  // dai corsi individuali assegnati (i nomi dei corsi individuali = gli strumenti)
  const strumentiDocente = (d) => {
    if (d.strumenti) return d.strumenti;
    const corsiIds = d.corsi || [];
    const nomi = (_coursesDocView || [])
      .filter(c => c.type === 'individuale' && corsiIds.includes(c.id))
      .map(c => c.name);
    return nomi.length > 0 ? nomi.join(' · ') : '—';
  };

  // Anno scolastico — usa il prop dall'admin (fallback: auto da data corrente)
  // Supporta sia annoInizioAttivo (integer) sia label "YYYY/YYYY" dal config
  const annoInizio = (() => {
    if (annoInizioAttivo) return Number(annoInizioAttivo);
    // Fallback: ricava dall'anno scolastico corrente basandosi sulla data
    return curMonth >= 9 ? curYear : curYear - 1;
  })();
  const MESI_AS = [
    {m:9, y:annoInizio},{m:10,y:annoInizio},{m:11,y:annoInizio},{m:12,y:annoInizio},
    {m:1, y:annoInizio+1},{m:2,y:annoInizio+1},{m:3,y:annoInizio+1},
    {m:4, y:annoInizio+1},{m:5,y:annoInizio+1},{m:6,y:annoInizio+1},
  ];
  // Aggiunge SOLO il mese corrente se non è nel range dell'anno scolastico
  if (!MESI_AS.some(x => x.m===curMonth && x.y===curYear)) {
    MESI_AS.push({m:curMonth, y:curYear});
  }
  const isFuture = (x) => new Date(x.y, x.m-1, 1) > new Date(curYear, curMonth-1, 1);
  const defaultSelMese = MESI_AS.find(x=>x.m===curMonth && x.y===curYear) || MESI_AS[MESI_AS.length-1];
  // ← useState QUI, prima di qualsiasi return condizionale
  const [selMese, setSelMese] = useState(defaultSelMese);
  const [sortKeyDP, sortDirDP, handleSortDP, sortFnDP] = useSortable("mese", "asc");
  const [sortKeyDC, sortDirDC, handleSortDC, sortFnDC] = useSortable("mese", "asc");
  // Mostra/nascondi importi (per il docente loggato)
  const [showAmountsDoc, setShowAmountsDoc] = useState(false);
  // Impostazioni docente (dashboard panels + profilo personale)
  const [docSettings, setDocSettings] = useState({
    panels: { lezioni:true, allievi:true, compenso:true, repertorio:true, allegati:true },
    profiloForm: null,
    pwForm: null,
    savingProfilo: false,
    savingPw: false,
    msgProfilo: null,
    msgPw: null,
    disponibilita: [], // [{giorno:"lunedi", oraInizio:"15:00", oraFine:"18:00"}]
    showDisp: false,
    newSlot: { giorno:"lunedi", oraInizio:"15:00", oraFine:"18:00" },
  });

  // FormModal inline JSX (evita re-mount su ogni keystroke)
  const formModalJSX = (modal && modal !== "del") ? (
    React.createElement(Modal, { title: modal==="new"?"Nuovo docente":"Modifica docente", onClose: ()=>setModal(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9935}}
      , React.createElement('div', { style: {padding:24,display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9936}}
        , React.createElement('div', { className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9937}}
          , React.createElement(Input, { label: "Nome completo *"  , value: draft.nome||"", onChange: e=>setDraft(p=>({...p,nome:e.target.value})), placeholder: "Prof. Nome Cognome"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9938}})
          , React.createElement(Input, { label: "Email", type: "email", value: draft.email||"", onChange: e=>setDraft(p=>({...p,email:e.target.value})), placeholder: "nome@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9939}})
          , React.createElement(Input, { label: "Telefono", value: draft.phone||"", onChange: e=>setDraft(p=>({...p,phone:e.target.value})), placeholder: "333 0000000" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9940}})
          , React.createElement('div', { style:{gridColumn:"1/-1"} }
            , React.createElement('label', { style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8} }, "Corsi assegnati")
            , (() => {
                const tuttiCorsi = (_coursesDocView||[]);
                if (tuttiCorsi.length === 0) return React.createElement('div', {style:{fontSize:12,color:C.textDim,fontStyle:"italic",padding:"8px 0"}}, "Nessun corso disponibile — aggiungili prima nella sezione Corsi");
                return React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:6}}
                  , tuttiCorsi.map(c => {
                    const isSelected = (draft.corsi||[]).map(String).includes(String(c.id));
                    const isInd = c.type==="individuale";
                    const hex = isInd ? C.gold : C.purple;
                    return React.createElement('button', {
                      key:c.id,
                      onClick: () => setDraft(p => {
                        const corsi = (p.corsi||[]).map(String);
                        const cid = String(c.id);
                        return { ...p, corsi: isSelected ? corsi.filter(x=>x!==cid) : [...corsi, cid] };
                      }),
                      style:{padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:12,fontFamily:"'Open Sans',sans-serif",transition:"all .12s",
                        border:`2px solid ${isSelected?hex:C.border}`,
                        background: isSelected ? hex+"22" : C.bg,
                        color: isSelected ? hex : C.textMuted,
                        fontWeight: isSelected ? 600 : 400}
                    }, (isSelected ? '✓ ' : '') + c.name);
                  })
                );
              })()
          )
          , React.createElement(Input, { label: "Tariffa oraria (€)"  , type: "number", value: draft.tariffaOra!=null ? draft.tariffaOra : 35, onChange: e=>setDraft(p=>({...p,tariffaOra:e.target.value===""?0:+e.target.value})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9942}})
          , React.createElement(Sel, { label: "Tipo contratto" , value: draft.contratto||"", onChange: e=>setDraft(p=>({...p,contratto:e.target.value})),
            options: ["Tempo indeterminato","Tempo determinato","Collaborazione","Partita IVA"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 9943}})
          , React.createElement(Input, { label: "Data inizio" , type: "date", value: draft.dataInizio||"", onChange: e=>setDraft(p=>({...p,dataInizio:e.target.value})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9945}})
        )
        , React.createElement(Textarea, { label: "Biografia", value: draft.bio||"", onChange: e=>setDraft(p=>({...p,bio:e.target.value})), placeholder: "Formazione, esperienza..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9947}})
      )
      , React.createElement('div', { style: {padding:"14px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9949}}
        , React.createElement(Btn, { variant: "secondary", onClick: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9950}}, "Annulla")
        , React.createElement(Btn, { onClick: saveDoc, disabled: !_optionalChain([draft, 'access', _85 => _85.nome, 'optionalAccess', _86 => _86.trim, 'call', _87 => _87()]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9951}}, React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9951}}), "Salva")
      )
    )
  ) : null;

  // ── VISTA LISTA ──────────────────────────────────────────────────────────────
  if (!selected) {
    // Il docente non deve mai vedere la lista: mostra spinner mentre arrivano i dati
    if (ruoloDocView === "docente") return (
      React.createElement('div', {style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 20px",gap:12,color:C.textMuted,fontSize:14,fontFamily:"'Open Sans',sans-serif"}}
        , React.createElement('div', {style:{width:20,height:20,border:`2px solid ${C.border}`,borderTopColor:C.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite"}})
        , "Caricamento profilo..."
      )
    );
    return (
    React.createElement('div', { style: {maxWidth:1100,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9958}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9959}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9960}}
          , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:32,fontWeight:600,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9961}}, "Docenti")
          , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9962}}
            , docenti.length, " docenti"
          )
        )
        , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
          , React.createElement(RefreshBtn)
          , ruoloDocView==="admin" && React.createElement(Btn, { onClick: openNew, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9966}}, React.createElement(Ic, { n: "plus", size: 15, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9966}}), "Nuovo docente" )
        )
      )

      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9969}}
        , (ruoloDocView==="docente"
          ? (()=>{ const did=(_appUserDocView&&_appUserDocView.docenteId)||null; if(did) return (docenti||[]).filter(d=>String(d.id)===String(did)); const ln=(_appUserDocView&&_appUserDocView.nome)||""; return (docenti||[]).filter(d=>d.teacherKey===ln||(d.nome||"").toLowerCase().includes(ln.toLowerCase())); })()
          : (docenti||[])).map(d=>{
          const all = allievi(d);
          return (
            React.createElement('div', { key: d.id, onClick: ()=>{setSelected(d);setTab("profilo");},
              style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,
                padding:22,cursor:"pointer",transition:"all 0.18s",borderTop:`3px solid ${d.colore}30`},
              onMouseEnter: e=>{e.currentTarget.style.borderColor=d.colore;e.currentTarget.style.borderTopColor=d.colore;},
              onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.borderTopColor=d.colore+"30";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9973}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9978}}
                , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9979}}
                  , React.createElement(Avatar, { initials: d.nome.replace("Prof.ssa ","").replace("Prof. ","").split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(), hex: d.colore, size: 44, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9980}})
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9981}}
                    , React.createElement('div', { style: {fontSize:15,fontWeight:600,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9982}}, d.nome)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9983}}, strumentiDocente(d))
                  )
                )
                , ruoloDocView==="admin" && React.createElement('button', { onClick: e=>{e.stopPropagation();openEdit(d);},
                  style: {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:6,color:C.textMuted},
                  onMouseEnter: ev=>ev.currentTarget.style.background=C.bg,
                  onMouseLeave: ev=>ev.currentTarget.style.background="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9986}}
                  , React.createElement(Ic, { n: "edit", size: 15, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9990}})
                )
              )
              , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9993}}
                , [
                  {label:"Allievi",  value:all.length,                                      hex:d.colore},
                  {label:"Lez/mese", value:tutteLezioniMese(d,curMonth,curYear).length,        hex:_optionalChain([selected, 'optionalAccess', _88 => _88.id])===d.id?d.colore:C.textMuted},
                  // Compenso visibile sempre (docente vede solo sé stesso nella lista)
                  {label:"Compenso mese", value:`€${stipendioMese(d).toLocaleString("it-IT")}`, hex:C.green},
                ].map(s=>(
                  React.createElement('div', { key: s.label, style: {textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9999}}
                    , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:s.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10000}}, s.value)
                    , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10001}}, s.label)
                  )
                ))
              )
              , React.createElement('div', { style: {marginTop:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10005}}
                , React.createElement('span', { style: {fontSize:11,color:C.textDim,background:C.bg,borderRadius:4,padding:"3px 8px",border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10006}}
                  , d.contratto
                )
              )
            )
          );
        })
      )
      , formModalJSX
    )
  );
  } // end if (!selected)

  // ── VISTA DETTAGLIO ──────────────────────────────────────────────────────────
  const MESI_LABEL_L = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const MESI_LABEL_S = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

  const all   = allievi(selected);
  const lez   = lezioniD(selected);
  const TABS  = [
    {id:"profilo",  label:"Profilo",  icon:"user"},
    {id:"allievi",  label:"Allievi",  icon:"users"},
    {id:"lezioni",  label:"Lezioni",  icon:"calendar"},
    {id:"compenso", label:"Compenso", icon:"euro"},
    // Tab Impostazioni: solo per il docente loggato, e solo in modalità desktop
    ...(ruoloDocView==="docente" && !IS_PWA ? [{id:"impostazioni", label:"Impostazioni", icon:"settings"}] : []),
  ];
  const stip = stipendioMese(selected);


  // Dati del mese selezionato
  // lezSel/lezPrev = solo presente+assente → usate per il compenso
  // lezSelAll       = tutte le lezioni      → usate per il tab Lezioni
  const lezSel   = lezioniMese(selected, selMese.m, selMese.y);
  const lezPrevM = selMese.m===1 ? 12 : selMese.m-1;
  const lezPrevY = selMese.m===1 ? selMese.y-1 : selMese.y;
  const lezPrev  = lezioniMese(selected, lezPrevM, lezPrevY);
  const stipSel  = lezSel.length * selected.tariffaOra;
  const stipPrev = lezPrev.length * selected.tariffaOra;
  const lezSelAll = tutteLezioniMese(selected, selMese.m, selMese.y);

  // andamento anno scolastico (tutte le lezioni per il grafico)
  const andamento = MESI_AS.map(x => {
    const n = tutteLezioniMese(selected, x.m, x.y).length;
    return { label:MESI_LABEL_S[x.m-1], n, comp:n*selected.tariffaOra, m:x.m, y:x.y,
             isSel: x.m===selMese.m && x.y===selMese.y, isFut: isFuture(x) };
  });
  const maxN = Math.max(...andamento.map(x=>x.n), 1);

  // Selettore mese UI
  const MeseSelector = () => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10051}}
      , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10052}}, "Anno scolastico "
          , annoInizio, "/", String(annoInizio+1).slice(-2)
      )
      , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10055}}
        , MESI_AS.map(x=>{
          const isS  = x.m===selMese.m && x.y===selMese.y;
          const isF  = isFuture(x);
          const hasD = lezioniMese(selected,x.m,x.y).length > 0;
          return (
            React.createElement('button', { key: `${x.y}-${x.m}`, onClick: ()=>!isF&&setSelMese(x),
              disabled: isF,
              style: {padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:isS?600:400,
                border:`1px solid ${isS?selected.colore:hasD?selected.colore+"50":C.border}`,
                background: isS ? selected.colore : hasD ? selected.colore+"15" : C.bg,
                color: isS ? C.bg : isF ? C.textDim : hasD ? selected.colore : C.textMuted,
                cursor: isF ? "not-allowed" : "pointer", opacity: isF ? 0.4 : 1,
                transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10061}}
              , MESI_LABEL_S[x.m-1]
              , hasD && !isF && React.createElement('span', { style: {display:"inline-block",width:4,height:4,borderRadius:"50%",
                background:isS?C.bg:selected.colore,marginLeft:5,verticalAlign:"middle"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10070}})
            )
          );
        })
      )
    )
  );

  // Grafico andamento anno scolastico (barre cliccabili)
  const GraficoAS = ({tipo="lezioni"}) => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10081}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10082}}
        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10083}}, "Andamento anno scolastico"

        )
        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10086}}
          , tipo==="lezioni"
            ? `Totale: ${andamento.reduce((t,x)=>t+x.n,0)} lezioni`
            : `Totale: €${andamento.reduce((t,x)=>t+x.comp,0).toLocaleString("it-IT")}`
        )
      )
      , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10092}}
        , andamento.map(x=>(
          React.createElement('div', { key: `${x.y}-${x.m}`, onClick: ()=>!x.isFut&&setSelMese({m:x.m,y:x.y}),
            style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              cursor:x.isFut?"default":"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10094}}
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?selected.colore:C.textDim,fontWeight:x.isSel?700:400,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10097}}
              , tipo==="lezioni"?(x.isFut?"":x.n):(x.isFut?"":x.n>0?`${(x.comp/1000).toFixed(1)}k`:"")
            )
            , React.createElement('div', { style: {width:"100%",borderRadius:"3px 3px 0 0",
              background: x.isFut ? C.border : x.isSel ? selected.colore : `${selected.colore}45`,
              height:`${x.isFut ? 4 : Math.round((x.n/maxN)*60)+4}px`,
              minHeight:4,transition:"all 0.2s",
              outline: x.isSel ? `2px solid ${selected.colore}` : "none", outlineOffset:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10100}})
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?selected.colore:C.textDim,textTransform:"uppercase",
              fontWeight:x.isSel?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10105}}, x.label)
          )
        ))
      )
    )
  );

  return (
    React.createElement('div', { style: {maxWidth:1100,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10114}}
      , ruoloDocView !== "docente" && React.createElement('button', { onClick: ()=>setSelected(null),
        style: {display:"flex",alignItems:"center",gap:6,background:"none",border:"none",
          cursor:"pointer",color:C.textMuted,fontSize:13,fontFamily:"'Open Sans',sans-serif",marginBottom:20,padding:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10115}}
        , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10118}}), "Tutti i docenti"
      )

      /* Header card */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,marginBottom:24,
        padding:"16px 20px",borderTop:`3px solid ${selected.colore}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10122}}
        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10124}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16,flex:"1 1 auto",minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10125}}
            , React.createElement(Avatar, { initials: selected.nome.replace("Prof.ssa ","").replace("Prof. ","").split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(), hex: selected.colore, size: 56, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10126}})
            , React.createElement('div', {style:{minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10127}}
              , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(18px,5vw,26px)",fontWeight:600,marginBottom:4,wordBreak:"break-word"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10128}}, selected.nome)
              , React.createElement('div', { style: {fontSize:13,color:C.textMuted,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10129}}, strumentiDocente(selected))
              , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10130}}
                , React.createElement('span', { style: {fontSize:11,background:C.goldBg,color:C.gold,border:`1px solid ${C.goldDim}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10131}}, selected.contratto)
                , selected.dataInizio && React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10132}}, "Dal " , new Date(selected.dataInizio+"T00:00:00").toLocaleDateString("it-IT",{month:"long",year:"numeric"}))
              )
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10136}}
            , ruoloDocView==="docente" && React.createElement('button', {
                onClick: ()=>setShowAmountsDoc(p=>!p),
                title: showAmountsDoc ? "Nascondi importi" : "Mostra importi",
                style:{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",
                  background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,
                  cursor:"pointer",fontFamily:"'Open Sans',sans-serif",fontSize:11,
                  color:C.textMuted,transition:"all 0.15s",whiteSpace:"nowrap"},
                onMouseEnter:e=>{e.currentTarget.style.borderColor=selected.colore;e.currentTarget.style.color=selected.colore;},
                onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}
              }
              , React.createElement(Ic, {n: showAmountsDoc?"eye":"eye-off", size:13, stroke:showAmountsDoc?selected.colore:C.textMuted})
              , showAmountsDoc ? "Nascondi" : "Mostra importi"
            )
            , ruoloDocView==="admin" && React.createElement(Btn, { small: true, variant: "secondary", onClick: ()=>openEdit(selected), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10137}}, React.createElement(Ic, { n: "edit", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10137}}), "Modifica")
            , ruoloDocView==="admin" && React.createElement(Btn, { small: true, danger: true, onClick: ()=>setModal("del"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10138}}, React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10138}}))
          )
        )
        /* KPI strip — dati mese selezionato */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginTop:20,paddingTop:20,borderTop:`1px solid ${C.border}`}, className: "stat-strip", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10142}}
          , [
            {label:"Allievi totali",  value:all.length,                          hex:selected.colore, money:false},
            {label:`Lez. ${MESI_LABEL_S[selMese.m-1]}`, value:lezSelAll.length, hex:C.textMuted, money:false},
            // Tariffa e Compenso sempre visibili (docente vede solo sé stesso)
            {label:"Tariffa/ora",     value:`€${selected.tariffaOra}`,           hex:C.gold, money:true},
            {label:`Compenso ${MESI_LABEL_S[selMese.m-1]}`, value:`€${stipSel.toLocaleString("it-IT")}`, hex:C.green, money:true},
          ].map(k=>(
            React.createElement('div', { key: k.label, style: {background:C.bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10149}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(20px,5vw,26px)",fontWeight:600,color:k.hex,lineHeight:1,
                  filter: k.money && !showAmountsDoc ? "blur(7px)" : "none",
                  transition:"filter 0.2s", userSelect: k.money && !showAmountsDoc ? "none" : "auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10150}}
                , k.money && !showAmountsDoc ? "••••" : k.value
              )
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10151}}, k.label)
            )
          ))
        )
      )

      /* Tabs — scrollabili orizzontalmente su mobile */
      , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:22,
          overflowX:"auto",WebkitOverflowScrolling:"touch",
          // Nasconde la scrollbar mantenendo la funzionalità
          scrollbarWidth:"none",msOverflowStyle:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10158}}
        , TABS.map(t=>(
          React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id),
            style: {display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:"none",
              border:"none",borderBottom:`2px solid ${tab===t.id?selected.colore:"transparent"}`,
              color:tab===t.id?selected.colore:C.textMuted,cursor:"pointer",
              fontFamily:"'Open Sans',sans-serif",fontSize:13,transition:"all 0.15s",marginBottom:-1,
              flexShrink:0,whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10160}}
            , React.createElement(Ic, { n: t.icon, size: 13, stroke: tab===t.id?selected.colore:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10165}}), t.label
          )
        ))
      )

      /* ── PROFILO ── */
      , tab==="profilo" && (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10172}}
          , [
            {label:"Email",    value:selected.email||"—", icon:"mail"},
            {label:"Telefono", value:selected.phone||"—", icon:"phone"},
            {label:"Strumenti insegnati", value:strumentiDocente(selected), icon:"music"},
            // Contratto e tariffa sempre visibili (docente vede solo sé stesso)
            {label:"Tipo contratto", value:selected.contratto||"—", icon:"tag"},
            {label:"Tariffa oraria", value:`€${selected.tariffaOra}/h`, icon:"euro"},
            {label:"Data inizio", value:selected.dataInizio||"—", icon:"calendar"},
          ].map(f=>(
            React.createElement('div', { key: f.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10181}}
              , React.createElement('div', { style: {width:34,height:34,borderRadius:8,background:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10182}}
                , React.createElement(Ic, { n: f.icon, size: 15, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10183}})
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10185}}
                , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10186}}, f.label)
                , React.createElement('div', { style: {fontSize:14,fontWeight:500,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10187}}, f.value)
              )
            )
          ))
          , selected.bio && (
            React.createElement('div', { style: {gridColumn:"1/-1",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10192}}
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10193}}, "Biografia")
              , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10194}}, selected.bio)
            )
          )
        )
      )

      /* ── ALLIEVI ── */
      , tab==="allievi" && (
        React.createElement('div', null
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}
              , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
                , React.createElement(Ic,{n:"users",size:14,stroke:C.textMuted})
                , React.createElement('span', {style:{fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}}, "Allievi assegnati")
              )
              , React.createElement('span', {style:{fontSize:12,color:C.textDim}}, all.length, " allievi")
            )
            , all.length===0
              ? React.createElement('div', {style:{textAlign:"center",padding:"48px 0",color:C.textMuted,fontSize:14}}, "Nessun allievo assegnato")
              : all.map((s,i)=>
                  React.createElement('div', {key:s.id, style:{display:"flex",alignItems:"center",gap:14,
                    padding:"14px 18px",borderBottom:i<all.length-1?`1px solid ${C.border}`:"none"}}
                    , React.createElement(Avatar, {initials:s.name.split(" ").map(p=>p[0]).join("").slice(0,2), hex:selected.colore, size:36})
                    , React.createElement('div', {style:{flex:1}}
                      , React.createElement('div', {style:{fontSize:14,fontWeight:500}}, s.name)
                      , React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginTop:2}}, s.instrument, s.level?" · "+s.level:"")
                    )
                    , React.createElement(Badge, {stato:s.status})
                  )
                )
          )
        )
      )

, tab==="lezioni" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10284}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10285}})
          , React.createElement(GraficoAS, { tipo: "lezioni", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10286}})
          /* Lista lezioni mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10288}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10289}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10290}}
                , React.createElement(Ic, { n: "calendar", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10291}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10292}}
                  , MESI_LABEL_L[selMese.m-1], " " , selMese.y
                )
              )
              , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10296}}
                , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10297}}, lezSelAll.length, " lezioni" )
                , lezSelAll.filter(l=>l.attendance==="presente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10299}}
                    , lezSelAll.filter(l=>l.attendance==="presente").length, " pres."
                  )
                )
                , lezSelAll.filter(l=>l.attendance==="assente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10304}}
                    , lezSelAll.filter(l=>l.attendance==="assente").length, " ass."
                  )
                )
              )
            )
            , lezSelAll.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textMuted,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10311}}
                , isFuture(selMese) ? "Mese non ancora iniziato" : "Nessuna lezione registrata"
              )
            ) : (
              lezSelAll.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.hour.localeCompare(b.hour)).map((l,i)=>{
                const insHex2 = (typeof INS_HEX !== "undefined" && INS_HEX[l.instrument]) || C.gold;
                return (
                  React.createElement('div', { key: l.id, style: {display:"grid",gridTemplateColumns:"90px 1fr 1fr auto",gap:12,alignItems:"center",
                    padding:"12px 20px",borderBottom:i<lezSelAll.length-1?`1px solid ${C.border}`:"none",
                    borderLeft:`3px solid ${isColl(l)?C.purple:"transparent"}`,
                    background:isColl(l)?`${C.purple}06`:"transparent"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10318}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10322}}
                      , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10323}}, new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}))
                      , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:isColl(l)?C.purple:selected.colore}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10324}}, l.hour)
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10326}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10327}}
                        , React.createElement('span', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10328}}
                          , isColl(l)?l.courseName:l.student
                        )
                        , isColl(l) && React.createElement('span', { style: {fontSize:10,background:C.purpleBg,color:C.purple,
                          border:`1px solid ${C.purpleBorder}`,borderRadius:4,padding:"1px 6px",letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10331}}, "collettiva")
                      )
                      , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10334}}
                        , isColl(l)
                          ? `${(l.students||[]).length} allievi`
                          : l.topic||"—"
                      )
                    )
                    , React.createElement('div', { style: {fontSize:12,color:isColl(l)?C.purple:insHex2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10340}}
                      , isColl(l)?`${l.room||"—"}`:`${l.instrument} · ${l.room||"—"}`
                    )
                    , l.attendance
                      ? React.createElement(Badge, { label: l.attendance, color: l.attendance==="presente"?"green":l.attendance==="assente"?"red":"gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10344}})
                      : React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10345}}, "—")
                    
                  )
                );
              })
            )
          )
          /* Tabella riepilogo anno */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,marginTop:16,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10353}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10354}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10355}}, "Riepilogo anno scolastico"  )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10357}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10358}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10359}}
                  , React.createElement(SortTh,{label:"Mese",         sortKey:"mese",  currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Lezioni",      sortKey:"tot",   currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Presenti",     sortKey:"pres",  currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Assenti",      sortKey:"ass",   currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Giustificati", sortKey:"giust", currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Da recuperare",sortKey:"rec",   currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Tasso pres.",  sortKey:"tasso", currentKey:sortKeyDP, dir:sortDirDP, onSort:handleSortDP, style:{padding:"10px 18px",fontSize:10}})
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10365}}
                , sortFnDP(MESI_AS.map((x,i)=>{
                  const lm = tutteLezioniMese(selected,x.m,x.y);
                  const pres  = lm.filter(l=>l.attendance==="presente").length;
                  const ass   = lm.filter(l=>l.attendance==="assente").length;
                  const giust = lm.filter(l=>l.attendance==="giustificato").length;
                  const rec   = lm.filter(l=>l.attendance==="in_recupero"||l.inRecupero).length;
                  const attended = lm.filter(l=>l.attendance).length;
                  const tasso = attended>0 ? Math.round((pres/attended)*100) : null;
                  return { x, i, lm, pres, ass, giust, rec, tasso, mese: x.y*100+x.m, tot: lm.length };
                }), (r,k) => {
                  if(k==="mese")  return r.mese;
                  if(k==="tot")   return r.tot;
                  if(k==="pres")  return r.pres;
                  if(k==="ass")   return r.ass;
                  if(k==="giust") return r.giust;
                  if(k==="rec")   return r.rec;
                  if(k==="tasso") return r.tasso ?? -1;
                  return 0;
                }).map(({x,i,lm,pres,ass,giust,rec,tasso})=>{
                  const isF = isFuture(x);
                  const isS = x.m===selMese.m && x.y===selMese.y;
                  return (
                    React.createElement('tr', { key: `${x.y}-${x.m}`, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:`1px solid ${C.border}`,
                        background:isS?`${selected.colore}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${selected.colore}12`:"transparent";}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?selected.colore:C.text}}
                        , MESI_LABEL_L[x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}}
                        , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:isF?C.textDim:lm.length>0?selected.colore:C.textDim}}
                          , isF?"—":lm.length
                        )
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}}, isF?"—":pres||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:ass>0?C.red:C.textDim}}, isF?"—":ass||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:giust>0?C.gold:C.textDim}}, isF?"—":giust||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:rec>0?C.purple:C.textDim}}, isF?"—":rec||"—")
                      , React.createElement('td', { style: {padding:"11px 18px"}}
                        , !isF && tasso!==null && !isNaN(tasso) ? (
                          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}}
                            , React.createElement('div', { style: {flex:1,height:4,background:C.border,borderRadius:2,maxWidth:60}}
                              , React.createElement('div', { style: {height:"100%",borderRadius:2,background:tasso>=80?C.green:tasso>=60?C.gold:C.red,width:`${tasso}%`}})
                            )
                            , React.createElement('span', { style: {fontSize:12,color:tasso>=80?C.green:tasso>=60?C.gold:C.red}}, tasso, "%")
                          )
                        ) : React.createElement('span', { style: {color:C.textDim}}, "—")
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10404}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10405}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10406}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10407}}
                    , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:selected.colore}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10408}}
                      , andamento.reduce((t,x)=>t+x.n,0)
                    )
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10412}}, andamento.reduce((t,x)=>t+tutteLezioniMese(selected,x.m,x.y).filter(l=>l.attendance==="presente").length,0))
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10413}}, andamento.reduce((t,x)=>t+tutteLezioniMese(selected,x.m,x.y).filter(l=>l.attendance==="assente").length,0))
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.gold}}, andamento.reduce((t,x)=>t+tutteLezioniMese(selected,x.m,x.y).filter(l=>l.attendance==="giustificato").length,0)||"—")
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.purple}}, andamento.reduce((t,x)=>t+tutteLezioniMese(selected,x.m,x.y).filter(l=>l.attendance==="in_recupero"||l.inRecupero).length,0)||"—")
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10414}}, "—")
                )
              )
            )
          )
        )
      )

      /* ── COMPENSO ── */
      , tab==="compenso" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10424}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10425}})
          , React.createElement(GraficoAS, { tipo: "compenso", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10426}})
          /* KPI mese selezionato */
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10428}}
            , [
              {label:"Tariffa oraria",    value:`€${selected.tariffaOra}`,             desc:"Base contrattuale",      hex:C.gold},
              {label:`Lezioni ${MESI_LABEL_S[selMese.m-1]} ${selMese.y}`, value:lezSel.length,
               desc: lezSel.length>lezPrev.length?`+${lezSel.length-lezPrev.length} vs mese prec.`:
                     lezSel.length<lezPrev.length?`${lezSel.length-lezPrev.length} vs mese prec.`:"= mese prec.",
               hex:selected.colore},
              {label:`Compenso ${MESI_LABEL_S[selMese.m-1]}`,
               value:`€${stipSel.toLocaleString("it-IT")}`,
               desc:`mese prec.: €${stipPrev.toLocaleString("it-IT")}`,
               hex:C.green},
            ].map(k=>(
              React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${k.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10440}}
                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,color:k.hex,lineHeight:1,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10441}}, k.value)
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10442}}, k.label)
                , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10443}}, k.desc)
              )
            ))
          )
          /* Dettaglio lezioni mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10448}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10449}}
              , React.createElement('span', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10450}}, "Dettaglio "
                 , MESI_LABEL_L[selMese.m-1], " " , selMese.y
              )
              , React.createElement('span', { style: {fontSize:13,color:C.green,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10453}}, "€", stipSel.toLocaleString("it-IT"))
            )
            , lezSel.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"32px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10456}}
                , isFuture(selMese)?"Mese non ancora iniziato":"Nessuna lezione registrata questo mese"
              )
            ) : (
              lezSel.slice().sort((a,b)=>a.date.localeCompare(b.date)).map((l,i)=>(
                React.createElement('div', { key: l.id, style: {display:"grid",gridTemplateColumns:"90px 1fr auto",gap:12,alignItems:"center",
                  padding:"11px 20px",borderBottom:i<lezSel.length-1?`1px solid ${C.border}`:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10461}}
                  , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10463}}
                    , new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}), " " , l.hour
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10466}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10467}}, l.student)
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10468}}, l.topic||"—")
                  )
                  , React.createElement('div', { style: {textAlign:"right",display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10470}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10471}}, "€", selected.tariffaOra)
                    , l.attendance && React.createElement(Badge, { label: l.attendance, color: l.attendance==="presente"?"green":l.attendance==="assente"?"red":"gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10472}})
                  )
                )
              ))
            )
          )
          /* Tabella compensi anno scolastico */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10479}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10480}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10481}}, "Compensi anno scolastico"  )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10483}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10484}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10485}}
                  , React.createElement(SortTh,{label:"Mese",    sortKey:"mese",    currentKey:sortKeyDC, dir:sortDirDC, onSort:handleSortDC, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Lezioni", sortKey:"n",       currentKey:sortKeyDC, dir:sortDirDC, onSort:handleSortDC, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Compenso",sortKey:"c",       currentKey:sortKeyDC, dir:sortDirDC, onSort:handleSortDC, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement('th',{style:{padding:"10px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}}, "vs mese prec.")
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10491}}
                , sortFnDC(MESI_AS.map((x,i)=>{
                  const pm = x.m===1?12:x.m-1, py = x.m===1?x.y-1:x.y;
                  const n  = lezioniMese(selected,x.m,x.y).length;
                  const np = lezioniMese(selected,pm,py).length;
                  const c  = n * selected.tariffaOra;
                  const delta = n - np;
                  return { x, i, n, np, c, delta, mese: x.y*100+x.m };
                }), (r,k) => {
                  if(k==="mese") return r.mese;
                  if(k==="n")    return r.n;
                  if(k==="c")    return r.c;
                  return 0;
                }).map(({x,i,n,np,c,delta})=>{
                  const isS = x.m===selMese.m&&x.y===selMese.y;
                  const isF = isFuture(x);
                  return (
                    React.createElement('tr', { key: `${x.y}-${x.m}`, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:`1px solid ${C.border}`,
                        background:isS?`${selected.colore}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${selected.colore}12`:"transparent";}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?selected.colore:C.text}}
                        , MESI_LABEL_L[x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:isF?C.textDim:n>0?selected.colore:C.textDim}}
                        , isF?"—":n
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:14,fontWeight:600,color:isF?C.textDim:n>0?C.green:C.textDim}}
                        , isF?"—":n>0?`€${c.toLocaleString("it-IT")}`:"—"
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}}
                        , !isF && np>0 && (
                          React.createElement('span', { style: {fontSize:12,color:delta>0?C.green:delta<0?C.red:C.textDim,fontWeight:500}}
                            , delta>0?`+${delta}`:delta<0?delta:"="
                          )
                        )
                        , !isF && np===0 && n>0 && React.createElement('span', { style: {fontSize:11,color:C.textDim}}, "primo mese")
                        , isF && React.createElement('span', { style: {color:C.textDim}}, "—")
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10529}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10530}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10531}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:selected.colore}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10532}}
                    , andamento.reduce((t,x)=>t+x.n,0)
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:14,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10535}}, "€"
                    , andamento.reduce((t,x)=>t+x.comp,0).toLocaleString("it-IT")
                  )
                  , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10538}})
                )
              )
            )
          )
          /* Pulsante STAMPA RESOCONTO MENSILE — solo admin */
          , ruoloDocView === 'admin' && (
            React.createElement('div', {style:{display:'flex',justifyContent:'flex-end',marginTop:12}}
              , React.createElement('button', {
                  onClick: () => {
                    const mLabel = MESI_LABEL_L[selMese.m-1] + ' ' + selMese.y;
                    const lezioni = lezSel.slice().sort((a,b)=>a.date.localeCompare(b.date));
                    const nLez = lezioni.length;
                    const totale = nLez * selected.tariffaOra;
                    const rows = lezioni.map((l,i) => `
                      <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:8px 12px;font-size:13px;">${i+1}</td>
                        <td style="padding:8px 12px;font-size:13px;">${new Date(l.date+'T00:00:00').toLocaleDateString('it-IT',{weekday:'short',day:'2-digit',month:'long'})}</td>
                        <td style="padding:8px 12px;font-size:13px;">${l.hour||'—'}</td>
                        <td style="padding:8px 12px;font-size:13px;">${isColl(l)?(l.courseName||'Collettiva'):(l.student||'—')}</td>
                        <td style="padding:8px 12px;font-size:13px;">${l.topic||'—'}</td>
                        <td style="padding:8px 12px;font-size:13px;text-align:right;">€${selected.tariffaOra}</td>
                        <td style="padding:8px 12px;font-size:12px;text-align:center;"><span style="background:${l.attendance==='presente'?'#dcfce7':l.attendance==='assente'?'#fee2e2':'#fef3c7'};color:${l.attendance==='presente'?'#166534':l.attendance==='assente'?'#991b1b':'#92400e'};padding:2px 8px;border-radius:20px;">${l.attendance||'—'}</span></td>
                      </tr>`).join('');
                    const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>Resoconto ${selected.nome||selected.name} — ${mLabel}</title>
<style>body{font-family:'Open Sans',Arial,sans-serif;margin:0;padding:32px;color:#1a1a1a;background:#fff;}h1{font-size:22px;font-weight:700;margin:0 0 4px;}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #e5e7eb;}
.logo{font-size:18px;font-weight:700;color:#8c1818;}table{width:100%;border-collapse:collapse;}
th{background:#f9fafb;padding:10px 12px;font-size:11px;text-align:left;text-transform:uppercase;letter-spacing:.07em;color:#666;border-bottom:2px solid #e5e7eb;}
.totale{display:flex;justify-content:flex-end;gap:32px;margin-top:20px;padding:16px 20px;background:#f9fafb;border-radius:8px;}
.totale-label{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#666;}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#999;text-align:center;}
@media print{body{padding:20px;}}</style></head><body>
<div class="header"><div><div class="logo">🎵 Futuro Musica</div><div style="font-size:11px;color:#999;margin-top:2px;">Generato il ${new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'})}</div></div>
<div style="text-align:right;"><div style="font-size:16px;font-weight:700;">${selected.nome||selected.name||'Docente'}</div><div style="font-size:12px;color:#666;">Tariffa: €${selected.tariffaOra}/ora · ${selected.strumento||'—'}</div></div></div>
<h1>Resoconto mensile — ${mLabel}</h1><div style="font-size:14px;color:#666;margin-bottom:24px;">${nLez} lezioni · compenso totale: €${totale.toLocaleString('it-IT')}</div>
<table><thead><tr><th>#</th><th>Data</th><th>Ora</th><th>Allievo / Corso</th><th>Argomento</th><th style="text-align:right;">Tariffa</th><th style="text-align:center;">Presenza</th></tr></thead>
<tbody>${rows}</tbody></table>
<div class="totale"><div><div class="totale-label">Lezioni</div><div style="font-size:22px;font-weight:700;">${nLez}</div></div>
<div><div class="totale-label">Compenso</div><div style="font-size:22px;font-weight:700;color:#166534;">€${totale.toLocaleString('it-IT')}</div></div></div>
<div class="footer">Futuro Musica — Resoconto compensi ${mLabel} · ${selected.nome||selected.name}</div>
</body></html>`;
                    const w = window.open('','_blank','width=900,height=700');
                    if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),500);}
                  },
                  style:{display:'flex',alignItems:'center',gap:8,padding:'10px 22px',borderRadius:9,
                    border:'none',background:C.gold,color:'#fff',cursor:'pointer',
                    fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",
                    boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}
                }
                , React.createElement(Ic,{n:'download',size:14,stroke:'#fff'})
                , '🖨\uFE0F Stampa resoconto ' + MESI_LABEL_L[selMese.m-1] + ' ' + selMese.y
              )
            )
          )
        )
      )

      /* Modali — sempre renderizzati indipendentemente dal tab */
      , formModalJSX
      , modal==="del" && (
        React.createElement(ConfirmDel, {
          title: "Rimuovi docente" ,
          testo: `Rimuovere ${selected.nome} dall\'organico? Questa azione è irreversibile.`,
          onConfirm: ()=>delDoc(selected.id),
          onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10549}}
        )
      )

      /* ── IMPOSTAZIONI (solo docente) ── */
      , tab==="impostazioni" && ruoloDocView==="docente" && (
        React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:20}}

          /* ── Mostra/nascondi importi ── */
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}
              , React.createElement(Ic, {n:"eye",size:14,stroke:C.gold})
              , React.createElement('span', {style:{fontSize:12,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted}}, "Privacy importi")
            )
            , React.createElement('div', {style:{padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}
              , React.createElement('div', null
                , React.createElement('div', {style:{fontSize:13,fontWeight:500,marginBottom:3}}, "Mostra importi e compensi")
                , React.createElement('div', {style:{fontSize:12,color:C.textDim}}, "Quando disattivo, tariffa e compensi sono oscurati con blur")
              )
              , React.createElement('button', {
                  onClick: ()=>setShowAmountsDoc(p=>!p),
                  style:{
                    width:48, height:26, borderRadius:13,
                    background: showAmountsDoc ? selected.colore : C.border,
                    border:"none", cursor:"pointer", position:"relative",
                    transition:"background 0.2s", flexShrink:0,
                  }
                }
                , React.createElement('div', {style:{
                    position:"absolute", top:3,
                    left: showAmountsDoc ? 24 : 4,
                    width:20, height:20, borderRadius:"50%",
                    background:"#fff", transition:"left 0.2s",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
                  }})
              )
            )
          )

          /* ── Sezioni dashboard visibili ── */
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}
              , React.createElement(Ic, {n:"grid",size:14,stroke:C.gold})
              , React.createElement('span', {style:{fontSize:12,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted}}, "Sezioni dashboard")
            )
            , [
                {key:"lezioni",   label:"Calendario lezioni",    desc:"Vista calendario e gestione lezioni"},
                {key:"allievi",   label:"Allievi",               desc:"Schede allievi assegnati"},
                {key:"compenso",  label:"Compensi",              desc:"Storico pagamenti e tariffa"},
                {key:"repertorio",label:"Repertorio",            desc:"Brani e programma musicale"},
                {key:"allegati",  label:"Allegati",              desc:"Documenti e file caricati"},
              ].map((item,i,arr)=>(
              React.createElement('div', {key:item.key, style:{
                  padding:"14px 20px",
                  borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none",
                  display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
                }}
                , React.createElement('div', null
                  , React.createElement('div', {style:{fontSize:13,fontWeight:500,marginBottom:2}}, item.label)
                  , React.createElement('div', {style:{fontSize:12,color:C.textDim}}, item.desc)
                )
                , React.createElement('button', {
                    onClick: ()=>setDocSettings(p=>({...p, panels:{...p.panels, [item.key]:!p.panels[item.key]}})),
                    style:{
                      width:48, height:26, borderRadius:13,
                      background: docSettings.panels[item.key] ? selected.colore : C.border,
                      border:"none", cursor:"pointer", position:"relative",
                      transition:"background 0.2s", flexShrink:0,
                    }
                  }
                  , React.createElement('div', {style:{
                      position:"absolute", top:3,
                      left: docSettings.panels[item.key] ? 24 : 4,
                      width:20, height:20, borderRadius:"50%",
                      background:"#fff", transition:"left 0.2s",
                      boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
                    }})
                )
              )
            ))
          )

          /* ── Disponibilità per recuperi ── */
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}
              , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
                , React.createElement(Ic, {n:"clock",size:14,stroke:C.gold})
                , React.createElement('span', {style:{fontSize:12,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted}}, "Disponibilità per recuperi")
              )
              , React.createElement('button', {
                  onClick: ()=>setDocSettings(p=>({...p,showDisp:!p.showDisp})),
                  style:{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",
                    background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    cursor:"pointer",fontSize:12,color:C.textMuted,fontFamily:"'Open Sans',sans-serif"}
                }
                , React.createElement(Ic,{n:docSettings.showDisp?"x":"plus",size:12,stroke:C.textMuted})
                , docSettings.showDisp ? " Chiudi" : " Aggiungi slot"
              )
            )
            /* Lista slot esistenti */
            , docSettings.disponibilita.length === 0 && !docSettings.showDisp && (
              React.createElement('div', {style:{padding:"16px 20px",fontSize:13,color:C.textDim,textAlign:"center"}}
                , "Nessuna disponibilità configurata. Gli allievi non potranno prenotare recuperi."
              )
            )
            , docSettings.disponibilita.length > 0 && (
              React.createElement('div', {style:{borderBottom:docSettings.showDisp?`1px solid ${C.border}`:"none"}}
                , docSettings.disponibilita.map((slot, idx) => (
                  React.createElement('div', {key:idx, style:{
                      display:"flex",alignItems:"center",justifyContent:"space-between",
                      padding:"12px 20px",borderBottom:`1px solid ${C.border}20`
                    }}
                    , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:12}}
                      , React.createElement('span', {style:{fontSize:13,fontWeight:500,textTransform:"capitalize",color:C.text,minWidth:90}}, slot.giorno)
                      , React.createElement('span', {style:{fontSize:13,color:C.textMuted}}, `${slot.oraInizio} — ${slot.oraFine}`)
                    )
                    , React.createElement('button', {
                        onClick:()=>{
                          const updatedDisp = docSettings.disponibilita.filter((_,i)=>i!==idx);
                          setDocSettings(p=>({...p,disponibilita:updatedDisp}));
                          const updatedDoc = { ...selected, disponibilitaRecuperi: updatedDisp };
                          setSelected(updatedDoc);
                          setDocenti(prev => prev.map(d => d.id === selected.id ? updatedDoc : d));
                          const sb = window.supabaseClient;
                          if (sb && selected) {
                            sb.from('docenti').update({disponibilita_recuperi: JSON.stringify(updatedDisp)})
                              .eq('id', selected.id)
                              .then(({error})=>{ if(error) console.warn('[FM] disponibilita delete error:', error.message); });
                          }
                        },
                        style:{background:"none",border:"none",cursor:"pointer",color:C.red,padding:4,borderRadius:4,display:"flex"}
                      }
                      , React.createElement(Ic,{n:"trash",size:14,stroke:C.red})
                    )
                  )
                ))
              )
            )
            /* Form aggiunta slot */
            , docSettings.showDisp && (
              React.createElement('div', {style:{padding:"16px 20px"}}
                , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}
                  , React.createElement('div', null
                    , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:4}}, "Giorno")
                    , React.createElement('select', {
                        value:docSettings.newSlot.giorno,
                        onChange:e=>setDocSettings(p=>({...p,newSlot:{...p.newSlot,giorno:e.target.value}})),
                        style:{width:"100%",padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,
                          fontSize:13,fontFamily:"'Open Sans',sans-serif",background:C.bg,color:C.text}
                      }
                      , ["lunedì","martedì","mercoledì","giovedì","venerdì","sabato"].map(g=>
                          React.createElement('option',{key:g,value:g},g)
                        )
                    )
                  )
                  , React.createElement('div', null
                    , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:4}}, "Dalle")
                    , React.createElement('input', {
                        type:"time", value:docSettings.newSlot.oraInizio,
                        onChange:e=>setDocSettings(p=>({...p,newSlot:{...p.newSlot,oraInizio:e.target.value}})),
                        style:{width:"100%",padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,
                          fontSize:13,fontFamily:"'Open Sans',sans-serif",background:C.bg,color:C.text}
                      })
                  )
                  , React.createElement('div', null
                    , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:4}}, "Alle")
                    , React.createElement('input', {
                        type:"time", value:docSettings.newSlot.oraFine,
                        onChange:e=>setDocSettings(p=>({...p,newSlot:{...p.newSlot,oraFine:e.target.value}})),
                        style:{width:"100%",padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,
                          fontSize:13,fontFamily:"'Open Sans',sans-serif",background:C.bg,color:C.text}
                      })
                  )
                )
                , React.createElement('div', {style:{display:"flex",justifyContent:"flex-end"}}
                  , React.createElement(Btn, {
                      onClick: async () => {
                        const slot = docSettings.newSlot;
                        if (!slot.giorno || !slot.oraInizio || !slot.oraFine) return;
                        const updated = [...docSettings.disponibilita, {...slot}];
                        setDocSettings(p=>({...p,disponibilita:updated,showDisp:false,newSlot:{giorno:"lunedì",oraInizio:"15:00",oraFine:"18:00"}}));
                        // Aggiorna il record in memoria (React state)
                        const updatedDoc = { ...selected, disponibilitaRecuperi: updated };
                        setSelected(updatedDoc);
                        setDocenti(prev => prev.map(d => d.id === selected.id ? updatedDoc : d));
                        // Persisti su Supabase
                        const sb = window.supabaseClient;
                        if (sb && selected) {
                          sb.from('docenti').update({
                            disponibilita_recuperi: JSON.stringify(updated),
                          }).eq('id', selected.id).then(({error})=>{
                            if(error) console.warn('[FM] disponibilita save error:', error.message);
                          });
                        }
                      }
                    }
                    , React.createElement(Ic,{n:"plus",size:13,stroke:"#fff"}), " Aggiungi"
                  )
                )
              )
            )
          )

          /* ── Informazioni personali ── */
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}
              , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
                , React.createElement(Ic, {n:"user",size:14,stroke:C.gold})
                , React.createElement('span', {style:{fontSize:12,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted}}, "Informazioni personali")
              )
              , !docSettings.profiloForm && React.createElement('button', {
                  onClick: ()=>setDocSettings(p=>({...p, profiloForm:{nome:selected.nome||"", email:selected.email||"", phone:selected.phone||"", bio:selected.bio||""}, msgProfilo:null})),
                  style:{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",
                    background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    cursor:"pointer",fontSize:12,color:C.textMuted,fontFamily:"'Open Sans',sans-serif"}
                }
                , React.createElement(Ic,{n:"edit",size:12,stroke:C.textMuted}), " Modifica"
              )
            )
            , docSettings.profiloForm ? (
              React.createElement('div', {style:{padding:"20px"}}
                , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}, [
                    {key:"nome",  label:"Nome completo *", type:"text",  placeholder:"Prof. Mario Rossi"},
                    {key:"email", label:"Email",           type:"email", placeholder:"email@esempio.it"},
                    {key:"phone", label:"Telefono",        type:"tel",   placeholder:"+39 333 1234567"},
                  ].map(f=>(
                    React.createElement('div', {key:f.key}
                      , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:5}}, f.label)
                      , React.createElement('input', {
                          type:f.type, value:docSettings.profiloForm[f.key],
                          onChange:e=>setDocSettings(p=>({...p,profiloForm:{...p.profiloForm,[f.key]:e.target.value}})),
                          placeholder:f.placeholder,
                          style:{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,
                            fontSize:13,fontFamily:"'Open Sans',sans-serif",background:C.bg,color:C.text,outline:"none"}
                        })
                    )
                  )))
                , React.createElement('div', {style:{marginBottom:14}}
                  , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:5}}, "Biografia")
                  , React.createElement('textarea', {
                      value: docSettings.profiloForm.bio,
                      onChange:e=>setDocSettings(p=>({...p,profiloForm:{...p.profiloForm,bio:e.target.value}})),
                      placeholder:"Formazione, esperienze, specializzazioni...",
                      rows:4,
                      style:{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,
                        fontSize:13,fontFamily:"'Open Sans',sans-serif",background:C.bg,color:C.text,
                        outline:"none",resize:"vertical"}
                    })
                )
                , docSettings.msgProfilo && React.createElement('div', {style:{padding:"10px 14px",marginBottom:12,
                    borderRadius:8,fontSize:12,
                    background: docSettings.msgProfilo.ok ? C.greenBg : C.redBg,
                    color:       docSettings.msgProfilo.ok ? C.green   : C.red,
                    border:`1px solid ${docSettings.msgProfilo.ok?C.greenBorder:C.redBorder}`}}
                  , docSettings.msgProfilo.text
                )
                , React.createElement('div', {style:{display:"flex",gap:8,justifyContent:"flex-end"}}
                  , React.createElement(Btn, {variant:"secondary", onClick:()=>setDocSettings(p=>({...p,profiloForm:null,msgProfilo:null}))}, "Annulla")
                  , React.createElement(Btn, {
                      disabled: docSettings.savingProfilo || !(docSettings.profiloForm.nome||"").trim(),
                      onClick: async ()=>{
                        setDocSettings(p=>({...p,savingProfilo:true,msgProfilo:null}));
                        try {
                          const f = docSettings.profiloForm;
                          const updated = {...selected, nome:f.nome, email:f.email, phone:f.phone, bio:f.bio};
                          setDocenti(prev=>prev.map(d=>d.id===selected.id?updated:d));
                          setSelected(updated);
                          const sb=window.supabaseClient;
                          if(sb){
                            await sb.from('docenti').update({nome:f.nome,email:f.email||null,phone:f.phone||null,bio:f.bio||null}).eq('id',selected.id);
                            // Aggiorna anche il profilo auth
                            await sb.from('profili').update({nome:f.nome,updated_at:new Date().toISOString()}).eq('id',auth.uid?.()??_appUserDocView?.userId??'');
                          }
                          // Aggiorna _prev in fm_sync per evitare che il realtime sovrascriva
                          if (window.__FM_UPDATE_PREV__ && window.__FM_DATA__) {
                            const newDocenti = (window.__FM_DATA__.docenti||[]).map(d => d.id===selected.id ? updated : d);
                            window.__FM_DATA__.docenti = newDocenti;
                          }
                          setDocSettings(p=>({...p,savingProfilo:false,profiloForm:null,msgProfilo:{ok:true,text:"✓ Profilo aggiornato con successo"}}));
                          setTimeout(()=>setDocSettings(p=>({...p,msgProfilo:null})),3000);
                        } catch(e){
                          setDocSettings(p=>({...p,savingProfilo:false,msgProfilo:{ok:false,text:"Errore: "+e.message}}));
                        }
                      }
                    }
                    , React.createElement(Ic,{n:"check",size:13,stroke:"#fff"}), docSettings.savingProfilo?" Salvataggio...":" Salva modifiche"
                  )
                )
              )
            ) : (
              React.createElement('div', {style:{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}
                , [{label:"Nome",      value:selected.nome||"—", icon:"user"},
                   {label:"Email",     value:selected.email||"—", icon:"mail"},
                   {label:"Telefono",  value:selected.phone||"—", icon:"phone"},
                  ].map(f=>(
                  React.createElement('div', {key:f.label, style:{display:"flex",alignItems:"flex-start",gap:10}}
                    , React.createElement(Ic,{n:f.icon,size:14,stroke:C.textDim})
                    , React.createElement('div', null
                      , React.createElement('div', {style:{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}, f.label)
                      , React.createElement('div', {style:{fontSize:13,color:C.text}}, f.value)
                    )
                  )
                ))
                , selected.bio && React.createElement('div', {style:{gridColumn:"1/-1",marginTop:8,paddingTop:12,borderTop:`1px solid ${C.border}`}}
                  , React.createElement('div', {style:{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}, "Biografia")
                  , React.createElement('p', {style:{fontSize:13,color:C.textMuted,lineHeight:1.6,margin:0}}, selected.bio)
                )
              )
            )
          )

          /* ── Cambio password ── */
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}
              , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
                , React.createElement(Ic, {n:"lock",size:14,stroke:C.gold})
                , React.createElement('span', {style:{fontSize:12,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted}}, "Sicurezza account")
              )
              , !docSettings.pwForm && React.createElement('button', {
                  onClick: ()=>setDocSettings(p=>({...p,pwForm:{old:"",new1:"",new2:""},msgPw:null})),
                  style:{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",
                    background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    cursor:"pointer",fontSize:12,color:C.textMuted,fontFamily:"'Open Sans',sans-serif"}
                }
                , React.createElement(Ic,{n:"edit",size:12,stroke:C.textMuted}), " Cambia password"
              )
            )
            , docSettings.pwForm ? (
              React.createElement('div', {style:{padding:"20px"}}
                , React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}
                  , [{key:"old",  label:"Password attuale *"},
                     {key:"new1", label:"Nuova password *"},
                     {key:"new2", label:"Conferma nuova password *"},
                    ].map(f=>(
                    React.createElement('div', {key:f.key}
                      , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:5}}, f.label)
                      , React.createElement('input', {
                          type:"password", value:docSettings.pwForm[f.key],
                          onChange:e=>setDocSettings(p=>({...p,pwForm:{...p.pwForm,[f.key]:e.target.value}})),
                          style:{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,
                            fontSize:13,fontFamily:"'Open Sans',sans-serif",background:C.bg,color:C.text,outline:"none"}
                        })
                    )
                  ))
                )
                , docSettings.msgPw && React.createElement('div', {style:{padding:"10px 14px",marginBottom:12,borderRadius:8,fontSize:12,
                    background: docSettings.msgPw.ok ? C.greenBg : C.redBg,
                    color:       docSettings.msgPw.ok ? C.green   : C.red,
                    border:`1px solid ${docSettings.msgPw.ok?C.greenBorder:C.redBorder}`}}
                  , docSettings.msgPw.text
                )
                , React.createElement('div', {style:{display:"flex",gap:8,justifyContent:"flex-end"}}
                  , React.createElement(Btn, {variant:"secondary", onClick:()=>setDocSettings(p=>({...p,pwForm:null,msgPw:null}))}, "Annulla")
                  , React.createElement(Btn, {
                      disabled: docSettings.savingPw,
                      onClick: async ()=>{
                        const {old,new1,new2} = docSettings.pwForm;
                        if(!old||!new1||!new2){setDocSettings(p=>({...p,msgPw:{ok:false,text:"Compila tutti i campi"}}));return;}
                        if(new1.length<8){setDocSettings(p=>({...p,msgPw:{ok:false,text:"La nuova password deve essere di almeno 8 caratteri"}}));return;}
                        if(new1!==new2){setDocSettings(p=>({...p,msgPw:{ok:false,text:"Le password non coincidono"}}));return;}
                        setDocSettings(p=>({...p,savingPw:true,msgPw:null}));
                        try {
                          const sb=window.supabaseClient;
                          if(sb){
                            // Verifica password attuale con re-auth
                            const email = selected.email || _appUserDocView?.email || "";
                            const {error:signErr} = await sb.auth.signInWithPassword({email, password:old});
                            if(signErr) throw new Error("Password attuale errata");
                            const {error:updErr} = await sb.auth.updateUser({password:new1});
                            if(updErr) throw new Error(updErr.message);
                          }
                          setDocSettings(p=>({...p,savingPw:false,pwForm:null,msgPw:{ok:true,text:"✓ Password aggiornata con successo"}}));
                          setTimeout(()=>setDocSettings(p=>({...p,msgPw:null})),3000);
                        } catch(e){
                          setDocSettings(p=>({...p,savingPw:false,msgPw:{ok:false,text:"Errore: "+e.message}}));
                        }
                      }
                    }
                    , React.createElement(Ic,{n:"check",size:13,stroke:"#fff"}), docSettings.savingPw?" Aggiornamento...":" Aggiorna password"
                  )
                )
              )
            ) : (
              React.createElement('div', {style:{padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}
                , React.createElement(Ic,{n:"lock",size:16,stroke:C.textDim})
                , React.createElement('span', {style:{fontSize:13,color:C.textMuted}}, "Password protetta — clicca \"Cambia password\" per modificarla")
              )
            )
          )

        )
      )
    )
  );
};
// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════
// Permessi navigazione per ruolo (sidebar): false = voce nascosta
const ROLE_PERMS = {
  admin:   {dashboard:true, allievi:true, docenti:true, corsi:true, calendario:true, concerti:true,  contabilita:true, repertorio:true, allegati:true, biblioteca:true, utenti:true,  impostazioni:true,  schedaScuola:true,  modulistica:true,  notifiche:true, reminders:true,  notifiche_settings:true,  sala_prove:true,  messaggi:true  },
  docente: {dashboard:true, allievi:true, docenti:true, corsi:true, calendario:true, concerti:true,  contabilita:true, repertorio:true, allegati:true, biblioteca:true, utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true, reminders:false, notifiche_settings:false, sala_prove:false, messaggi:true  },
  allievo: {dashboard:true, allievi:true, docenti:false,corsi:true,  calendario:true, concerti:false, contabilita:true, repertorio:true, allegati:false,biblioteca:true, utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true, reminders:false, notifiche_settings:false, sala_prove:false, messaggi:true  },
  // Ruolo band: accede solo alla sala prove
  band:    {dashboard:false,allievi:false,docenti:false,corsi:false, calendario:false,concerti:false, contabilita:false,repertorio:false,allegati:false,biblioteca:false,utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true,  reminders:false, notifiche_settings:false, sala_prove:true,  messaggi:false },
};

// Rileva se l'app è aperta come PWA (standalone) — usato per menu più snello
// Rileva modalità PWA con più metodi:
// 1. display-mode standalone (Chrome/Android installato)
// 2. navigator.standalone (iOS Safari installato)
// 3. Parametro URL ?pwa=1 (test manuale)
// 4. SessionStorage (persiste durante la sessione PWA)
const _isPwaMedia    = window.matchMedia('(display-mode: standalone)').matches;
const _isPwaIOS      = window.navigator.standalone === true;
const _isPwaParam    = new URLSearchParams(window.location.search).get('pwa') === '1';
const _isPwaSession  = sessionStorage.getItem('fm_pwa') === '1';
const IS_PWA = _isPwaMedia || _isPwaIOS || _isPwaParam || _isPwaSession;
// Salva in sessione così rimane attivo anche navigando senza il parametro
if (IS_PWA) sessionStorage.setItem('fm_pwa', '1');

// ── Aggiornamento SW: mostra banner quando il Service Worker si aggiorna ──────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'SW_UPDATED') {
      // Mostra banner di aggiornamento non invasivo
      const existing = document.getElementById('__fm_update_banner__');
      if (existing) return; // già mostrato
      const banner = document.createElement('div');
      banner.id = '__fm_update_banner__';
      banner.style.cssText = [
        'position:fixed','bottom:80px','left:50%','transform:translateX(-50%)',
        'z-index:99998','background:#1a4fa0','color:#fff',
        'padding:12px 20px','border-radius:12px',
        'font-family:Open Sans,sans-serif','font-size:13px','font-weight:600',
        'display:flex','align-items:center','gap:12px',
        'box-shadow:0 4px 20px rgba(0,0,0,0.3)',
        'white-space:nowrap','cursor:pointer',
      ].join(';');
      banner.innerHTML = `
        <span>🔄 Nuova versione disponibile</span>
        <button onclick="window.location.reload()" style="
          background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);
          color:#fff;padding:5px 12px;border-radius:8px;cursor:pointer;
          font-family:inherit;font-size:12px;font-weight:700">
          Aggiorna ora
        </button>
        <button onclick="document.getElementById('__fm_update_banner__')?.remove()" style="
          background:none;border:none;color:rgba(255,255,255,0.6);
          cursor:pointer;font-size:18px;padding:0;line-height:1">
          ×
        </button>
      `;
      document.body.appendChild(banner);
      // Auto-rimozione dopo 30 secondi
      setTimeout(() => banner.remove(), 30000);
    }
  });
}

// ── Menu PWA (sottoinsieme snello per mobile) ────────────────────────────────
// Modifica qui per personalizzare cosa appare nella versione PWA per ogni ruolo.
// Desktop usa sempre ROLE_PERMS completo — questa lista vale SOLO per PWA.
const PWA_PERMS = {
  admin:   {dashboard:true, allievi:true, docenti:true, corsi:true, calendario:true, concerti:true,  contabilita:true, repertorio:true, allegati:false, biblioteca:false, utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true, reminders:false, notifiche_settings:false, sala_prove:true },
  docente: {dashboard:true, allievi:false,docenti:true, corsi:true, calendario:true, concerti:false, contabilita:true, repertorio:true, allegati:true,  biblioteca:true,  utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true, reminders:false, notifiche_settings:false, sala_prove:false},
  allievo: {dashboard:true, allievi:true, docenti:false,corsi:false, calendario:true, concerti:true,  contabilita:true, repertorio:true, allegati:false, biblioteca:false, utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true, reminders:false, notifiche_settings:false, sala_prove:false},
  band:    {dashboard:false,allievi:false,docenti:false,corsi:false, calendario:false,concerti:false, contabilita:false,repertorio:false,allegati:false, biblioteca:false, utenti:false, impostazioni:false, schedaScuola:false, modulistica:false, notifiche:true,  reminders:false, notifiche_settings:false, sala_prove:true },
};

const NAV_ITEMS = [
  { id:"dashboard",   label:"Dashboard",    icon:"grid"     },
  { id:"allievi",     label:"Allievi",      icon:"users"    },
  { id:"docenti",     label:"Docenti",      icon:"user"     },
  { id:"corsi",       label:"Corsi",        icon:"courses"  },
  { id:"calendario",  label:"Calendario",   icon:"calendar",
    subItems: [
      { qaKey:"showCalendario", label:"Calendario",    icon:"cal"      },
      { qaKey:"showRecuperi",   label:"Recuperi",      icon:"clock"    },
      { qaKey:"showElenco",     label:"Elenco lezioni", icon:"list", adminOnly:true },
      { qaKey:"showSalaProve",  label:"Sala Prove",     icon:"drum", adminOnly:false },
    ]
  },
  { id:"concerti",    label:"Concerti",     icon:"mic"      },
  { id:"contabilita", label:"Contabilità",  icon:"euro"     },
  { id:"repertorio",  label:"Repertorio",   icon:"music"    },
  { id:"allegati",    label:"Allegati",     icon:"paperclip"},
  { id:"biblioteca",  label:"Manuali & Libri", icon:"courses"},
  { id:"messaggi",    label:"Messaggi",     icon:"mail"     },
  { id:"utenti",      label:"Utenti",       icon:"shield"   },
  { id:"notifiche",   label:"Notifiche",    icon:"bell"     },
  { id:"reminders",          label:"Reminders WA",       icon:"phone"   },
  { id:"notifiche_settings", label:"Config. Notifiche",  icon:"bell"    },
  { id:"sala_prove",  label:"Sala Prove",   icon:"drum"     },
];

const Sidebar = ({ current, setView, user, onLogout, onEsciSenzaLogout, settingsDrawerOpen, onSettingsOpen, currentRuolo, onQuickAction }) => {
  const ruoloHex = {admin:C.gold, docente:C.teal, allievo:C.blue}[_optionalChain([user, 'optionalAccess', _89 => _89.ruolo])] || C.gold;
  const ini = _optionalChain([user, 'optionalAccess', _90 => _90.nome]) ? user.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() : "??";
  const _userRoleSB  = (user && user.ruolo) || "admin";
  const _effRoleSB   = (_userRoleSB === "admin" && currentRuolo) ? currentRuolo : _userRoleSB;
  const _permsSB     = IS_PWA
    ? (PWA_PERMS[_effRoleSB] || PWA_PERMS["admin"])
    : (ROLE_PERMS[_effRoleSB] || ROLE_PERMS["admin"]);
  const FILTERED_ITEMS = NAV_ITEMS.filter(item => _permsSB[item.id] !== false);
  const BOTTOM_ITEMS   = FILTERED_ITEMS.slice(0, 5);

  // Gruppi collassabili (solo admin desktop)
  const SIDEBAR_GROUPS = [
    { id:"scuola",   label:"Scuola",                icon:"graduation", items:["allievi","docenti","corsi","calendario"] },
    { id:"risorse",  label:"Risorse & Libri",        icon:"book",       items:["allegati","repertorio","biblioteca"] },
    { id:"notif",    label:"Notifiche & Reminders",  icon:"bell",       items:["notifiche","notifiche_settings","reminders"] },
    { id:"config",   label:"Impostazioni",           icon:"settings",   items:["utenti","schedaScuola","modulistica","impostazioni"] },
  ];
  // Auto-apri il gruppo che contiene la voce attiva
  const initOpen = () => {
    const o = {};
    SIDEBAR_GROUPS.forEach(g => { if(g.items.includes(current)) o[g.id] = true; });
    if(current === 'impostazioni') o["config"] = true;
    return o;
  };
  const [openGroups, setOpenGroups] = useState(initOpen);
  const toggleGroup = (id) => setOpenGroups(p => ({...p, [id]: !p[id]}));
  // Quando cambia current, apri il gruppo corrispondente
  React.useEffect(() => {
    SIDEBAR_GROUPS.forEach(g => {
      if(g.items.includes(current)) setOpenGroups(p => ({...p, [g.id]: true}));
    });
    if(current === 'impostazioni') setOpenGroups(p => ({...p, config: true}));
  }, [current]);

  return (
    React.createElement(React.Fragment, null
      /* ── Desktop sidebar ── */
      , React.createElement('div', { className: "sidebar-desktop", style: {width:220,background:C.sidebar,borderRight:"none",
        display:"flex",flexDirection:"column",height:"100vh",flexShrink:0,overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10582}}
        /* Logo */
        , React.createElement('div', { style: {padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.15)",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10585}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10586}}
            , React.createElement('div', { style: {width:32,height:32,borderRadius:0,background:"#8c1818",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10587}}
              , React.createElement(Ic, { n: "music", size: 15, stroke: "#fff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10589}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10591}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,lineHeight:1.2,color:"#fff",letterSpacing:"0.05em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10592}}, "Futuro Musica"

              )
              , React.createElement('div', { style: {fontSize:9,color:"rgba(255,255,255,0.55)",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10595}}, "gestionale"

              )
            )
          )
        )
        /* Navigation */
        , React.createElement('nav', { style: {flex:1,padding:"10px 8px",overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10602}}
          , (() => {
              const sideRuolo = (user && user.ruolo) || "admin";
              const effRole   = (sideRuolo === "admin" && currentRuolo) ? currentRuolo : sideRuolo;
              const perms     = IS_PWA ? (PWA_PERMS[effRole]||PWA_PERMS["admin"]) : (ROLE_PERMS[effRole]||ROLE_PERMS["admin"]);
              const isAdmin   = sideRuolo === "admin" && !IS_PWA;

              // Helper: render a single nav button
              const NavBtn = ({id, label, icon, indent=false}) => {
                if(perms[id] === false) return null;
                const active = current === id;
                return React.createElement('button', {
                  key: id,
                  onClick: () => setView(id),
                  style: {width:"100%",display:"flex",alignItems:"center",gap:10,
                    padding: indent ? "7px 10px 7px 26px" : "9px 12px",
                    borderRadius:0,border:"none",cursor:"pointer",
                    background: active ? "rgba(255,255,255,0.15)" : "transparent",
                    color: active ? "#ffffff" : indent ? "rgba(255,255,255,0.65)" : C.sidebarText,
                    fontFamily:"'Open Sans',sans-serif",
                    fontSize: indent ? 12 : 13,
                    fontWeight: active ? 600 : 400,
                    textAlign:"left",transition:"all 0.15s",marginBottom:1,
                    borderLeft: active ? "3px solid #8c1818" : indent ? "3px solid rgba(255,255,255,0.1)" : "3px solid transparent"}},
                  React.createElement(Ic, {n:icon, size: indent?12:15, stroke: active?"#ffffff": indent?"rgba(255,255,255,0.5)":C.sidebarText}),
                  label
                );
              };

              // Helper: render a collapsible group header
              const GroupHdr = ({id, label, icon}) => {
                const isOpen = !!openGroups[id];
                const groupItems = (SIDEBAR_GROUPS.find(g=>g.id===id)||{}).items || [];
                const hasActive  = groupItems.includes(current);
                return React.createElement('button', {
                  onClick: () => toggleGroup(id),
                  style: {width:"100%",display:"flex",alignItems:"center",gap:10,
                    padding:"9px 12px",borderRadius:0,border:"none",cursor:"pointer",
                    background: hasActive ? "rgba(255,255,255,0.08)" : "transparent",
                    color: hasActive ? "#ffffff" : C.sidebarText,
                    fontFamily:"'Open Sans',sans-serif",fontSize:13,fontWeight: hasActive?600:400,
                    textAlign:"left",transition:"all 0.15s",marginBottom:1,
                    borderLeft: hasActive ? "3px solid rgba(255,255,255,0.3)" : "3px solid transparent"}},
                  React.createElement(Ic,{n:icon, size:15, stroke: hasActive?"#ffffff":C.sidebarText}),
                  React.createElement('span',{style:{flex:1}}, label),
                  React.createElement('span',{style:{fontSize:10,opacity:0.5,transition:"transform 0.2s",
                    display:"inline-block",transform: isOpen?"rotate(90deg)":"rotate(0deg)"}}, "▶")
                );
              };

              if(isAdmin) {
                // ADMIN: gruppi collassabili
                return React.createElement(React.Fragment, null

                  /* ── Dashboard (diretto) ── */
                  , NavBtn({id:"dashboard", label:"Dashboard", icon:"grid"})

                  /* Separatore */
                  , React.createElement('div',{style:{height:1,background:"rgba(255,255,255,0.1)",margin:"6px 4px"}})

                  /* ── Gruppo SCUOLA ── */
                  , GroupHdr({id:"scuola", label:"Scuola", icon:"graduation"})
                  , openGroups.scuola && ["allievi","docenti","corsi","calendario"].map(id => {
                      const it = NAV_ITEMS.find(x=>x.id===id);
                      if(!it || perms[id]===false) return null;
                      return NavBtn({id:it.id, label:it.label, icon:it.icon, indent:true});
                    })

                  /* ── Gruppo RISORSE & LIBRI ── */
                  , GroupHdr({id:"risorse", label:"Risorse & Libri", icon:"book"})
                  , openGroups.risorse && ["allegati","repertorio","biblioteca"].map(id => {
                      const it = NAV_ITEMS.find(x=>x.id===id);
                      if(!it || perms[id]===false) return null;
                      return NavBtn({id:it.id, label:it.label, icon:it.icon, indent:true});
                    })

                  /* Separatore */
                  , React.createElement('div',{style:{height:1,background:"rgba(255,255,255,0.1)",margin:"6px 4px"}})

                  /* ── Contabilità (diretto) ── */
                  , NavBtn({id:"contabilita", label:"Contabilità", icon:"euro"})

                  /* ── Concerti (diretto) ── */
                  , NavBtn({id:"concerti", label:"Concerti", icon:"mic"})

                  /* ── Sala Prove (diretto, sotto Concerti) ── */
                  , NavBtn({id:"sala_prove", label:"Sala Prove", icon:"drum"})

                  /* Separatore */
                  , React.createElement('div',{style:{height:1,background:"rgba(255,255,255,0.1)",margin:"6px 4px"}})

                  /* ── Gruppo NOTIFICHE & REMINDERS ── */
                  , GroupHdr({id:"notif", label:"Notifiche & Reminders", icon:"bell"})
                  , openGroups.notif && React.createElement(React.Fragment, null
                      , NavBtn({id:"messaggi",          label:"Messaggi",           icon:"mail",  indent:true})
                      , NavBtn({id:"notifiche",         label:"Notifiche",         icon:"bell",  indent:true})
                      , NavBtn({id:"notifiche_settings",label:"Config. Notifiche", icon:"settings", indent:true})
                      , NavBtn({id:"reminders",          label:"Reminders WA",     icon:"phone", indent:true})
                    )

                  /* Separatore */
                  , React.createElement('div',{style:{height:1,background:"rgba(255,255,255,0.1)",margin:"6px 4px"}})

                  /* ── Gruppo IMPOSTAZIONI ── */
                  , GroupHdr({id:"config", label:"Impostazioni", icon:"settings"})
                  , openGroups.config && React.createElement(React.Fragment, null
                      /* Impostazioni generali → pagina full-screen */
                      , NavBtn({id:"impostazioni", label:"Impostazioni generali", icon:"settings", indent:true})
                      , NavBtn({id:"utenti",        label:"Utenti",               icon:"shield",   indent:true})
                      , NavBtn({id:"schedaScuola",   label:"Scheda scuola",        icon:"flag",     indent:true})
                      , NavBtn({id:"modulistica",    label:"Modulistica",          icon:"file",     indent:true})
                      /* Sito Web */
                      , React.createElement('a', {
                          key:"sito-web",
                          href:"index.html", target:"_blank",
                          style:{width:"100%",display:"flex",alignItems:"center",gap:10,
                            padding:"7px 10px 7px 26px",borderRadius:0,border:"none",cursor:"pointer",
                            background:"transparent",color:"rgba(255,255,255,0.65)",
                            fontFamily:"'Open Sans',sans-serif",fontSize:12,fontWeight:400,
                            textAlign:"left",textDecoration:"none",transition:"all .15s",
                            borderLeft:"3px solid rgba(255,255,255,0.1)"},
                          onMouseEnter:e=>{e.currentTarget.style.color="#fff";},
                          onMouseLeave:e=>{e.currentTarget.style.color="rgba(255,255,255,0.65)";}}
                        , React.createElement(Ic,{n:"globe",size:12,stroke:"rgba(255,255,255,0.5)"})
                        , "Sito Web"
                        , React.createElement('span',{style:{marginLeft:"auto",fontSize:9,opacity:0.5}},"↗")
                      )
                    )
                );
              }

              // NON-ADMIN: lista piatta originale
              return NAV_ITEMS.filter(item => perms[item.id] !== false).map(item => {
                const active = current === item.id;
                const userRole2 = (user&&user.ruolo)||'admin';
                return React.createElement(React.Fragment, {key:item.id}
                  , React.createElement('button', { onClick: ()=>{ setView(item.id); if(item.subItems&&onQuickAction) setTimeout(()=>onQuickAction('showCalendario'),80); },
                    style: {width:"100%",display:"flex",alignItems:"center",gap:10,
                      padding:"9px 12px",borderRadius:0,border:"none",cursor:"pointer",
                      background:active?"rgba(255,255,255,0.15)":"transparent",
                      color:active?"#ffffff":C.sidebarText,
                      fontFamily:"'Open Sans',sans-serif",fontSize:13,fontWeight:active?600:400,
                      textAlign:"left",transition:"all 0.15s",marginBottom:1,
                      borderLeft:active?"3px solid #8c1818":"3px solid transparent"}}
                    , React.createElement(Ic, { n: item.icon, size: 15, stroke: active?"#ffffff":C.sidebarText})
                    , item.label
                  )
                  , active && item.subItems && React.createElement('div', {style:{paddingLeft:18,paddingBottom:4}}
                    , item.subItems
                      .filter(s=>!s.adminOnly || userRole2==='admin')
                      .map(s => React.createElement('button', {key:s.qaKey,
                        onClick:()=>{ setView(item.id); if(onQuickAction) setTimeout(()=>onQuickAction(s.qaKey),120); },
                        style:{width:'100%',display:'flex',alignItems:'center',gap:8,
                          padding:'6px 10px',border:'none',borderRadius:0,cursor:'pointer',
                          background:'transparent',color:'rgba(255,255,255,0.6)',
                          fontFamily:"'Open Sans',sans-serif",fontSize:12,fontWeight:400,
                          textAlign:'left',transition:'all .12s',
                          borderLeft:'2px solid rgba(255,255,255,0.15)'}}
                        , React.createElement(Ic,{n:s.icon,size:12,stroke:'rgba(255,255,255,0.5)'})
                        , s.label
                      ))
                  )
                );
              });
            })()
        )

        /* ── Sezione strumenti — docente ── */
        , (function(){
            const sideRuolo = _optionalChain([user, 'optionalAccess', _sdoc => _sdoc.ruolo]) || "admin";
            if(sideRuolo !== "docente") return null;
            const isImpostActive = current === "docenti";
            return React.createElement('div', { style: {padding:"6px 8px",borderTop:"1px solid rgba(255,255,255,0.12)",flexShrink:0} }
              , React.createElement('div', {style:{fontSize:9,color:"rgba(255,255,255,0.45)",letterSpacing:".15em",textTransform:"uppercase",padding:"6px 4px 4px"}}, "Il mio profilo")
              , React.createElement('button', {
                  onClick: function(){
                    setView("docenti");
                    if(onQuickAction) setTimeout(()=>onQuickAction("showImpostazioni"), 120);
                  },
                  style:{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"7px 10px",
                    borderRadius:0,border:"none",cursor:"pointer",
                    background:isImpostActive?"rgba(255,255,255,0.15)":"transparent",
                    color:isImpostActive?"#ffffff":C.sidebarText,
                    fontFamily:"'Open Sans',sans-serif",fontSize:12,fontWeight:isImpostActive?600:400,
                    textAlign:"left",transition:"all .15s",marginBottom:1,
                    borderLeft:isImpostActive?"3px solid #8c1818":"3px solid transparent"},
                  onMouseEnter:e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.color="#fff";},
                  onMouseLeave:e=>{e.currentTarget.style.background=isImpostActive?"rgba(255,255,255,0.15)":"transparent";e.currentTarget.style.color=isImpostActive?"#fff":C.sidebarText;}
                }
                , React.createElement(Ic,{n:"settings",size:14,stroke:isImpostActive?"#ffffff":C.sidebarText})
                , "Impostazioni"
              )
            );
          })()

        /* User profile */
        , React.createElement('div', { style: {padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.15)",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10621}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10622}}
            , React.createElement(Avatar, { initials: ini, hex: "#8c1818", size: 32, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10623}})
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10624}}
              , React.createElement('div', { style: {fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#ffffff"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10625}}
                , _optionalChain([user, 'optionalAccess', _91 => _91.nome]) || "Utente"
              )
              , React.createElement('div', { style: {fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"capitalize",marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10628}}
                , {admin:"Amministratore",docente:"Docente",allievo:"Allievo"}[_optionalChain([user,'optionalAccess',_92=>_92.ruolo])] || "—"
              )
            )
          )
          /* ── Due pulsanti uscita ── */
          , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:4} }
            /* Esci senza logout — azione principale */
            , React.createElement('button', {
                onClick: onEsciSenzaLogout,
                title: "Chiude l'app ma mantiene la sessione attiva — al prossimo accesso entri direttamente",
                style: {width:"100%",padding:"9px 0",borderRadius:0,border:"1px solid rgba(255,255,255,0.4)",
                  background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.9)",fontSize:13,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                  fontFamily:"'Open Sans',sans-serif",fontWeight:600,transition:"all 0.15s"},
                onMouseEnter: e=>{e.currentTarget.style.background="rgba(255,255,255,0.18)";e.currentTarget.style.borderColor="rgba(255,255,255,0.7)";e.currentTarget.style.color="#fff";},
                onMouseLeave: e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(255,255,255,0.4)";e.currentTarget.style.color="rgba(255,255,255,0.9)";},
              }, "✕ Esci"
            )
            /* Logout — azione secondaria */
            , React.createElement('button', {
                onClick: onLogout,
                title: "Esci e disconnetti l'account",
                style: {width:"100%",padding:"5px 0",borderRadius:0,border:"none",
                  background:"transparent",color:"rgba(255,255,255,0.35)",fontSize:10,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                  fontFamily:"'Open Sans',sans-serif",transition:"all 0.15s", letterSpacing:"0.03em"},
                onMouseEnter: e=>{e.currentTarget.style.color="#ff8080";},
                onMouseLeave: e=>{e.currentTarget.style.color="rgba(255,255,255,0.35)";},
              }, "↩ Logout"
            )
          )
        )
      )

      /* ── Mobile bottom navigation bar ── */
      , React.createElement('div', { className: "bottom-nav", style: {
        position:"fixed",bottom:0,left:0,right:0,zIndex:300,
        background:C.sidebar,borderTop:"2px solid #8c1818",
        display:"none", // hidden by default, shown by CSS on mobile
        justifyContent:"space-around",alignItems:"center",
        height:"calc(60px + env(safe-area-inset-bottom, 0px))",
        paddingBottom:"env(safe-area-inset-bottom, 0px)",
        padding:"0 4px",paddingBottom:"env(safe-area-inset-bottom, 0px)",gap:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10646}}
        , BOTTOM_ITEMS.map(item => {
          const active = current === item.id;
          return (
            React.createElement('button', { key: item.id, onClick: ()=>setView(item.id),
              style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:3,border:"none",background:"transparent",
                cursor:"pointer",padding:"6px 2px",
                color:active?"#ffffff":C.sidebarText,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10655}}
              , React.createElement(Ic, { n: item.icon, size: 20, stroke: active?"#ffffff":C.sidebarText, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10660}})
              , React.createElement('span', { style: {fontSize:9,letterSpacing:"0.04em",fontFamily:"'Open Sans',sans-serif",
                fontWeight:active?600:400,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10661}}
                , item.label.slice(0,6)
              )
            )
          );
        })
        /* "Altro" button for remaining items */
        , React.createElement(MobileMoreMenu, { current: current, setView: setView, extraItems: FILTERED_ITEMS.slice(5), onLogout: onLogout, onEsciSenzaLogout: onEsciSenzaLogout, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10669}})
      )
    )
  );
};

const MobileMoreMenu = ({ current, setView, extraItems, onLogout, onEsciSenzaLogout }) => {
  const [open, setOpen] = useState(false);
  const activeExtra = extraItems.some(i => i.id === current);
  return (
    React.createElement(React.Fragment, null
      , React.createElement('button', { onClick: ()=>setOpen(v=>!v),
        style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",gap:3,border:"none",background:"transparent",
          cursor:"pointer",padding:"6px 2px",
          color:activeExtra?C.gold:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10680}}
        , React.createElement(Ic, { n: "grid", size: 20, stroke: activeExtra?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10685}})
        , React.createElement('span', { style: {fontSize:9,letterSpacing:"0.04em",fontFamily:"'Open Sans',sans-serif",
          fontWeight:activeExtra?600:400,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10686}}, "Altro")
      )
      , open && (
        React.createElement('div', { style: {position:"fixed",bottom:60,left:0,right:0,zIndex:400,
          background:C.surface,borderTop:`1px solid ${C.border}`,
          padding:"8px 0",boxShadow:"0 -4px 20px rgba(0,0,0,0.5)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10690}}
          , extraItems.map(item => {
            const active = current === item.id;
            return (
              React.createElement('button', { key: item.id, onClick: ()=>{setView(item.id);setOpen(false);},
                style: {width:"100%",display:"flex",alignItems:"center",gap:14,
                  padding:"14px 20px",border:"none",background:active?C.goldBg:"transparent",
                  cursor:"pointer",color:active?C.gold:C.text,
                  fontFamily:"'Open Sans',sans-serif",fontSize:14,textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10696}}
                , React.createElement(Ic, { n: item.icon, size: 18, stroke: active?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10701}})
                , item.label
              )
            );
          })
          , React.createElement('div', { style: {height:1,background:C.border,margin:"8px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10706}})
          /* Esci (azione principale — senza logout) */
          , React.createElement('button', { onClick: ()=>{ setOpen(false); onEsciSenzaLogout && onEsciSenzaLogout(); },
            style: {width:"100%",display:"flex",alignItems:"center",gap:14,
              padding:"14px 20px",border:"none",background:"transparent",
              cursor:"pointer",color:C.text,
              fontFamily:"'Open Sans',sans-serif",fontSize:14,fontWeight:600,textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10707}}
            , React.createElement(Ic, { n: "x", size: 18, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10712}}), "✕ Esci"
          )
          /* Logout — azione secondaria */
          , React.createElement('button', { onClick: ()=>{ setOpen(false); onLogout && onLogout(); },
            style: {width:"100%",display:"flex",alignItems:"center",gap:14,
              padding:"10px 20px",border:"none",background:"transparent",
              cursor:"pointer",color:C.textMuted,
              fontFamily:"'Open Sans',sans-serif",fontSize:12,textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10713}}
            , React.createElement(Ic, { n: "log-out", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10714}}), "↩ Logout"
          )
        )
      )
    )
  );
};



// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════

// ─── BAND WEEK CALENDAR — stessa time-grid dell'admin ─────────────────────────
const BandWeekCalendar = ({ lessons, prenotazioni }) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const getMonday = (offset) => {
    const d = new Date(), day = d.getDay()||7;
    d.setDate(d.getDate()-day+1+offset*7); d.setHours(0,0,0,0); return d;
  };
  const monday = getMonday(weekOffset);
  const days   = Array.from({length:7},(_,i)=>{ const d=new Date(monday); d.setDate(d.getDate()+i); return d; });
  const toLocalDateStr = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const toMin = t => { if(!t) return 0; const [h,m]=(t).split(':').map(Number); return h*60+(m||0); };

  const GIORNI_S  = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
  const MESI_S    = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const HOUR_H    = 44;
  const MORNING   = [9,10,11,12];
  const EVENING   = [16,17,18,19,20,21,22];
  const oggi      = toLocalDateStr(new Date());

  const s=days[0], e=days[6];
  const weekLabel = s.getMonth()===e.getMonth()
    ? `${s.getDate()}–${e.getDate()} ${MESI_S[s.getMonth()]} ${s.getFullYear()}`
    : `${s.getDate()} ${MESI_S[s.getMonth()]} – ${e.getDate()} ${MESI_S[e.getMonth()]} ${e.getFullYear()}`;

  const getEvents = (ds, h) => {
    const evts = [];
    // Prenotazioni (tutte tranne rifiutate)
    (prenotazioni||[]).filter(p => {
      if (p.data!==ds||p.stato==='rifiutata') return false;
      return parseInt((p.oraInizio||'00').split(':')[0])===h;
    }).forEach(p => {
      const dur = (toMin(p.oraFine)-toMin(p.oraInizio))/60;
      evts.push({ id:'p'+p.id, top:(toMin(p.oraInizio)%60/60)*HOUR_H, height:Math.max(dur*HOUR_H-2,18),
        bg:p.stato==='approvata'?C.orange2Bg:'rgba(245,158,11,0.08)',
        bd:p.stato==='approvata'?C.orange2Border:'rgba(245,158,11,0.3)',
        accent:p.stato==='approvata'?C.orange2:'#f59e0b',
        label:(p.oraInizio||'').slice(0,5)+'–'+(p.oraFine||'').slice(0,5),
        tag:p.stato==='approvata'?'✅':'⏳' });
    });
    // Batteria → sala occupata (senza nome allievo)
    (lessons||[]).filter(l => {
      const ds2 = l.date||l.data||'';
      if (ds2!==ds) return false;
      const str=(l.instrument||l.strumento||'').toLowerCase();
      return (str.includes('batter')||str.includes('drum')||str.includes('percuss')) &&
             parseInt((l.hour||l.ora||'00').split(':')[0])===h;
    }).forEach(l => {
      const ora=l.hour||l.ora||'00:00', dur=l.durata||45;
      const sm=toMin(ora), em=sm+dur;
      evts.push({ id:'b'+l.id, top:(sm%60/60)*HOUR_H, height:Math.max((dur/60)*HOUR_H-2,18),
        bg:'#fef3c7', bd:'#fcd34d', accent:'#d97706',
        label:ora.slice(0,5)+'–'+String(Math.floor(em/60)).padStart(2,'0')+':'+String(em%60).padStart(2,'0'),
        tag:'🔒' });
    });
    return evts;
  };

  const btnStyle = {width:30,height:30,borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'};

  const TimeCell = ({ds,h}) => {
    const isToday = ds===oggi;
    const evts = getEvents(ds,h);
    const chiuso = isGiornoChiuso(ds, window.__FM_CONFIG__||null);
    return React.createElement('div',{style:{borderTop:`1px solid ${C.border}`,borderLeft:`1px solid ${C.border}`,height:HOUR_H,background:isToday?'#fffbf0':C.surface,position:'relative'}}
      , chiuso && React.createElement('div',{style:{
          position:'absolute',inset:0,
          background: chiuso.tipo==='festività'
            ? 'repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(220,38,38,0.07) 5px,rgba(220,38,38,0.07) 10px)'
            : 'repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(55,65,81,0.07) 5px,rgba(55,65,81,0.07) 10px)',
          backgroundColor: chiuso.tipo==='festività' ? 'rgba(254,242,242,0.55)' : 'rgba(243,244,246,0.55)',
          zIndex:0, pointerEvents:'none'
        }})
      ,evts.map(ev=>React.createElement('div',{key:ev.id,style:{position:'absolute',top:ev.top+1,left:2,right:2,height:ev.height,background:ev.bg,border:`1px solid ${ev.bd}`,borderLeft:`3px solid ${ev.accent}`,borderRadius:4,padding:'2px 4px',fontSize:9,color:ev.accent,fontWeight:600,overflow:'hidden',zIndex:2,display:'flex',flexDirection:'column',gap:1}}
        ,React.createElement('div',{style:{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:700}},ev.tag,' ',ev.label)
      ))
    );
  };

  const ClosedRow = () => React.createElement(React.Fragment,null
    ,React.createElement('div',{style:{padding:'2px 4px',fontSize:9,color:'#b8a898',textAlign:'right',background:'#f8f4f0',borderTop:`1px solid ${C.border}`,height:22,display:'flex',alignItems:'center',justifyContent:'flex-end',fontStyle:'italic'}},'13–16')
    ,days.map((_,i)=>React.createElement('div',{key:i,style:{borderTop:`1px solid ${C.border}`,borderLeft:`1px solid ${C.border}`,height:22,background:'repeating-linear-gradient(135deg,#f8f4f0 0px,#f8f4f0 4px,#f1ece8 4px,#f1ece8 8px)',position:'relative'}}
      ,React.createElement('div',{style:{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#b8a898',fontWeight:600,letterSpacing:'.05em'}},'CHIUSO')
    ))
  );

  return React.createElement('div',{style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden',marginBottom:8}}
    /* Header nav */
    ,React.createElement('div',{style:{padding:'10px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}
      ,React.createElement('div',{style:{fontSize:13,fontWeight:700,color:C.text}},'📅 Disponibilità sala — settimana')
      ,React.createElement('div',{style:{display:'flex',alignItems:'center',gap:6}}
        ,React.createElement('button',{onClick:()=>setWeekOffset(p=>p-1),style:btnStyle},'‹')
        ,React.createElement('span',{style:{fontSize:11,color:C.textMuted,minWidth:150,textAlign:'center'}},weekLabel)
        ,React.createElement('button',{onClick:()=>setWeekOffset(p=>p+1),style:btnStyle},'›')
        ,weekOffset!==0&&React.createElement('button',{onClick:()=>setWeekOffset(0),style:{padding:'3px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:'pointer',fontSize:10,fontFamily:"'Open Sans',sans-serif"}},'Oggi')
      )
    )
    /* Griglia time */
    ,React.createElement('div',{style:{overflowX:'auto',overflowY:'auto',maxHeight:'55vh'}}
      ,React.createElement('div',{style:{display:'grid',gridTemplateColumns:`36px repeat(7,1fr)`,minWidth:480}}
        /* Header giorni */
        ,React.createElement('div',{style:{background:C.surface,borderBottom:`1px solid ${C.border}`}})
        ,days.map((d,i)=>{
          const isToday=toLocalDateStr(d)===oggi;
          const holiday=getHoliday(toLocalDateStr(d));
          return React.createElement('div',{key:i,style:{padding:'5px 3px',textAlign:'center',
            background:holiday?'rgba(220,38,38,0.06)':isToday?C.tealBg:C.surface,
            borderBottom:`1px solid ${C.border}`,borderLeft:`1px solid ${C.border}`,
            fontSize:10,fontWeight:isToday?700:500,color:holiday?'#b91c1c':isToday?C.teal:C.text}}
            ,React.createElement('div',null,GIORNI_S[i])
            ,React.createElement('div',{style:{fontSize:13,fontWeight:700}},d.getDate())
            ,holiday&&React.createElement('div',{style:{fontSize:8,color:'#b91c1c',fontWeight:600,lineHeight:1.2,marginTop:1}},holiday.emoji,' ',holiday.label)
          );
        })
        /* Mattina 9-13 */
        ,MORNING.map(h=>React.createElement(React.Fragment,{key:'m'+h}
          ,React.createElement('div',{style:{padding:'2px 4px',fontSize:9,color:C.textDim,textAlign:'right',borderTop:`1px solid ${C.border}`,height:HOUR_H,background:C.bg,display:'flex',alignItems:'flex-start',paddingTop:3}},String(h).padStart(2,'0')+':00')
          ,days.map((d,i)=>React.createElement(TimeCell,{key:i,ds:toLocalDateStr(d),h}))
        ))
        /* Chiuso 13-16 */
        ,React.createElement(ClosedRow,null)
        /* Sera 16-23 */
        ,EVENING.map(h=>React.createElement(React.Fragment,{key:'e'+h}
          ,React.createElement('div',{style:{padding:'2px 4px',fontSize:9,color:C.textDim,textAlign:'right',borderTop:`1px solid ${C.border}`,height:HOUR_H,background:C.bg,display:'flex',alignItems:'flex-start',paddingTop:3}},String(h).padStart(2,'0')+':00')
          ,days.map((d,i)=>React.createElement(TimeCell,{key:i,ds:toLocalDateStr(d),h}))
        ))
      )
    )
    /* Legenda */
    ,React.createElement('div',{style:{padding:'6px 12px',borderTop:`1px solid ${C.border}`,display:'flex',gap:12,flexWrap:'wrap'}}
      ,[{bg:'#fef3c7',bd:'#fcd34d',t:'🔒 Sala occupata (batteria)'},{bg:C.orange2Bg,bd:C.orange2Border,t:'✅ Prenotata'},{bg:'rgba(245,158,11,0.08)',bd:'rgba(245,158,11,0.3)',t:'⏳ In attesa'}]
       .map((l,i)=>React.createElement('div',{key:i,style:{display:'flex',alignItems:'center',gap:4,fontSize:10,color:C.textMuted}}
         ,React.createElement('div',{style:{width:10,height:10,borderRadius:2,background:l.bg,border:`1px solid ${l.bd}`,flexShrink:0}})
         ,l.t
       ))
    )
  );
};

// SALA PROVE — VISTA STANDALONE (ruolo band + admin dedicato)
// ═══════════════════════════════════════════════════════════════════════════════
const SalaProveStandaloneView = ({ appUser, userRuolo, lessons }) => {
  const [prenotazioni,   setPrenotazioni]   = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showForm,       setShowForm]       = useState(false);
  const [showContatto,   setShowContatto]   = useState(false);
  const [editTarget,     setEditTarget]     = useState(null);
  const [toast,          setToast]          = useState(null);
  const [msgContatto,    setMsgContatto]    = useState('');
  const [sendingMsg,     setSendingMsg]     = useState(false);
  const isMobile = useIsMobile();

  const showToast = (ok, msg) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadPrenotazioni = React.useCallback(async () => {
    const sb = window.supabaseClient; if (!sb) { setLoading(false); return; }
    try {
      const { data, error } = await sb.from('prenotazioni_sala').select('*').order('data').order('ora_inizio');
      if (error) throw error;
      setPrenotazioni((data||[]).map(adaptPrenotazioneSala));
    } catch(e) { console.warn('[FM] SalaProveStandalone load:', e?.message); }
    setLoading(false);
  }, []);

  React.useEffect(() => { loadPrenotazioni(); }, []);

  const handleSendContatto = async () => {
    if (!msgContatto.trim()) return;
    setSendingMsg(true);
    try {
      const sb = window.supabaseClient;
      if (sb) {
        await sb.from('notifiche').insert({
          destinatario_ruolo: 'admin',
          tipo:               'messaggio_band',
          titolo:             `💬 Messaggio da ${appUser?.nome || 'Band'}`,
          messaggio:          msgContatto.trim(),
          letto:              false,
          created_at:         new Date().toISOString(),
          meta:               JSON.stringify({ mittente: appUser?.nome, email: appUser?.email }),
        });
      }
      setMsgContatto('');
      setShowContatto(false);
      showToast(true, '✅ Messaggio inviato all\'amministrazione');
    } catch(e) {
      showToast(false, 'Errore invio: ' + (e.message||'riprova'));
    }
    setSendingMsg(false);
  };

  const oggi = yyyymmdd(new Date());
  const isBand  = userRuolo === 'band';
  const isAdmin = userRuolo === 'admin';

  const miePrenotazioni = isBand
    ? prenotazioni.filter(p => p.userId === (appUser?.userId || appUser?.id))
    : prenotazioni;

  const MESI = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const GIORNI = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
  const fmtData = d => { if(!d) return '—'; const [y,m,dd]=d.split('-'); return `${dd} ${MESI[+m-1]} ${y}`; };

  const statoStyle = s => ({
    in_attesa:  { bg:'rgba(245,158,11,0.1)', fg:'#b45309', bd:'rgba(245,158,11,0.3)', label:'⏳ In attesa' },
    approvata:  { bg:C.greenBg,   fg:C.green,   bd:C.greenBorder,   label:'✅ Approvata' },
    rifiutata:  { bg:C.redBg,     fg:C.red,     bd:C.redBorder,     label:'❌ Rifiutata' },
  }[s] || { bg:C.bg, fg:C.textMuted, bd:C.border, label:s });

  const handleDelete = async (p) => {
    if (!window.confirm(`Eliminare la prenotazione del ${fmtData(p.data)}?`)) return;
    const sb = window.supabaseClient; if (!sb) return;
    await sb.from('prenotazioni_sala').delete().eq('id', p.id);
    setPrenotazioni(prev => prev.filter(x => x.id !== p.id));
    showToast(true, 'Prenotazione eliminata');
  };

  const handleApprova = async (p, nuovoStato) => {
    const sb = window.supabaseClient; if (!sb) return;
    await sb.from('prenotazioni_sala').update({ stato: nuovoStato, updated_at: new Date().toISOString() }).eq('id', p.id);
    setPrenotazioni(prev => prev.map(x => x.id === p.id ? { ...x, stato: nuovoStato } : x));
    if (p.userId) {
      try {
        await sb.from('notifiche').insert({
          destinatario_ruolo: 'band',
          tipo:               nuovoStato === 'approvata' ? 'sala_prove_approvata' : 'sala_prove_rifiutata',
          titolo:             nuovoStato === 'approvata' ? '✅ Sala prove confermata' : '❌ Sala prove non disponibile',
          messaggio:          `La tua prenotazione del ${fmtData(p.data)} (${p.oraInizio}–${p.oraFine}) è stata ${nuovoStato === 'approvata' ? 'approvata' : 'rifiutata'}.`,
          letto:              false,
          created_at:         new Date().toISOString(),
        });
      } catch(e) { console.warn('[FM] notifica approvazione sala:', e?.message); }
    }
    showToast(true, nuovoStato === 'approvata' ? 'Prenotazione approvata ✅' : 'Prenotazione rifiutata');
  };

  const pad = isMobile ? '16px' : '32px';

  return React.createElement('div', { style: { minHeight: '100%', background: C.bg } }

    /* Header */
    , React.createElement('div', { style: { padding: `16px ${pad} 0`, background: C.surface, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 } }
      , React.createElement('div', { style: { display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' } }
        , React.createElement('div', { style: { display:'flex', alignItems:'center', gap:12 } }
          , React.createElement('div', { style: { width:44,height:44,borderRadius:12,background:C.orange2Bg,border:`1px solid ${C.orange2Border}`,display:'flex',alignItems:'center',justifyContent:'center' } }
            , React.createElement(Ic, { n:'drum', size:22, stroke:C.orange2 })
          )
          , React.createElement('div', null
            , React.createElement('h1', { style: { fontFamily:"'Oswald',sans-serif", fontSize:'clamp(18px,4vw,24px)', fontWeight:600, color:C.text, marginBottom:2 } }, '🥁 Sala Prove')
            , React.createElement('p', { style: { fontSize:12, color:C.textMuted } }, isBand ? 'Prenota la sala e gestisci le tue prenotazioni' : 'Gestione prenotazioni sala prove')
          )
        )
        , React.createElement('div', { style: { display:'flex', gap:8 } }
          , isBand && React.createElement('button', {
              onClick: () => setShowContatto(true),
              style: { padding:'9px 16px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.textMuted, cursor:'pointer', fontSize:13, fontFamily:"'Open Sans',sans-serif", display:'flex', alignItems:'center', gap:6 }
            }
            , React.createElement(Ic, { n:'mail', size:14, stroke:C.textMuted })
            , 'Contatta admin'
          )
          , React.createElement('button', {
              onClick: () => { setEditTarget(null); setShowForm(true); },
              style: { padding:'9px 18px', borderRadius:8, border:'none', background:C.orange2, color:'#fff', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'Open Sans',sans-serif", display:'flex', alignItems:'center', gap:6 }
            }
            , React.createElement(Ic, { n:'plus', size:14, stroke:'#fff' }), '+ Prenota'
          )
        )
      )
    )

    /* Toast */
    , toast && React.createElement('div', { style: { position:'fixed', top:20, right:20, zIndex:9999, padding:'12px 20px', borderRadius:10, background:toast.ok?'#16a34a':C.red, color:'#fff', fontFamily:"'Open Sans',sans-serif", fontSize:13, fontWeight:600, boxShadow:'0 4px 20px rgba(0,0,0,.2)' } }, toast.msg)

    /* Contenuto */
    , React.createElement('div', { style: { padding: `20px ${pad}` } }

      /* ── DASHBOARD band ────────────────────────────────────────── */
      , isBand && (() => {
          const mie   = prenotazioni.filter(p => p.userId===(appUser?.userId||appUser?.id));
          const attesa   = mie.filter(p=>p.stato==='in_attesa'   && p.data >= oggi);
          const approvate= mie.filter(p=>p.stato==='approvata'   && p.data >= oggi);
          const passate  = mie.filter(p=>p.data < oggi);
          const prossima = approvate.sort((a,b)=>a.data.localeCompare(b.data))[0];
          return React.createElement('div', { style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10,marginBottom:16} }
            /* card prossima prenotazione */
            , React.createElement('div', { style:{background:C.surface,border:`1px solid ${C.orange2Border}`,borderRadius:12,padding:'14px 16px',gridColumn:'span 2'} }
              , React.createElement('div',{style:{fontSize:10,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}},'📅 Prossima prenotazione confermata')
              , prossima
                ? React.createElement('div',null
                    ,React.createElement('div',{style:{fontSize:18,fontWeight:700,color:C.orange2,fontFamily:"'Oswald',sans-serif"}}
                      , fmtData(prossima.data))
                    ,React.createElement('div',{style:{fontSize:13,color:C.textMuted,marginTop:2}},'🕐 ',prossima.oraInizio,'–',prossima.oraFine)
                  )
                : React.createElement('div',{style:{fontSize:13,color:C.textDim,fontStyle:'italic'}},'Nessuna prenotazione confermata')
            )
            , [{label:'In attesa',val:attesa.length,hex:'#92400e',bg:'rgba(245,158,11,0.08)',icon:'⏳'},
               {label:'Approvate',val:approvate.length,hex:C.green,bg:C.greenBg,icon:'✅'},
               {label:'Passate',val:passate.length,hex:C.textDim,bg:C.bg,icon:'📋'}]
              .map(k=>React.createElement('div',{key:k.label,style:{background:k.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:'12px 14px'}}
                ,React.createElement('div',{style:{fontSize:10,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}
                  ,k.icon,' ',k.label)
                ,React.createElement('div',{style:{fontSize:22,fontWeight:700,color:k.hex,fontFamily:"'Oswald',sans-serif"}},k.val)
              ))
          );
        })()

      /* Info band */
      , isBand && React.createElement('div', { style: { background:C.orange2Bg, border:`1px solid ${C.orange2Border}`, borderRadius:10, padding:'12px 16px', fontSize:12, color:'#92400e', lineHeight:1.7, marginBottom:16 } }
        , '🎸 Compila la richiesta e attendi la conferma dell\'admin. Per domande usa il pulsante "Contatta admin".'
      )

      , isBand && React.createElement(BandWeekCalendar, { lessons, prenotazioni })

      /* Lista mie prenotazioni (band) */
      , isBand && React.createElement('div', { style: { marginTop: 20 } }
        , React.createElement('div', { style: { fontSize:12, color:C.textMuted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:10, fontWeight:600 } }, 'Le tue prenotazioni')
        , loading
          ? React.createElement('div', { style: { padding:32, textAlign:'center', color:C.textDim } }, '⏳ Caricamento...')
          : miePrenotazioni.length === 0
            ? React.createElement('div', { style: { padding:'24px 0', color:C.textMuted, fontSize:13, textAlign:'center' } }, 'Nessuna prenotazione — usa + Prenota per aggiungerne una')
            : miePrenotazioni.sort((a,b) => b.data.localeCompare(a.data)).map(p => {
                const st = statoStyle(p.stato);
                const isPast = p.data < oggi;
                return React.createElement('div', { key:p.id, style: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px', opacity:isPast?.65:1, display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap', marginBottom:10 } }
                  , React.createElement('div', { style: { width:44,height:44,borderRadius:8,background:C.orange2Bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0 } }
                    , React.createElement('div', { style: { fontSize:14,fontWeight:700,color:C.orange2,lineHeight:1 } }, p.data.split('-')[2])
                    , React.createElement('div', { style: { fontSize:9,color:C.orange2,textTransform:'uppercase' } }, MESI[+p.data.split('-')[1]-1])
                  )
                  , React.createElement('div', { style: { flex:1, minWidth:0 } }
                    , React.createElement('div', { style: { fontWeight:600, fontSize:14, color:C.text, marginBottom:3 } }, fmtData(p.data), ' · ', GIORNI[new Date(p.data+'T00:00:00').getDay()])
                    , React.createElement('div', { style: { fontSize:12, color:C.textMuted, marginBottom:6 } }, '🕐 ', p.oraInizio, ' → ', p.oraFine, p.motivo ? ' · '+p.motivo : '')
                    , React.createElement('span', { style: { background:st.bg, color:st.fg, border:`1px solid ${st.bd}`, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600 } }, st.label)
                  )
                  , !isPast && p.stato === 'in_attesa' && React.createElement('button', {
                      onClick: () => handleDelete(p),
                      style: { padding:'5px 10px', borderRadius:6, border:`1px solid ${C.redBorder}`, background:C.redBg, color:C.red, cursor:'pointer', fontSize:11, fontFamily:"'Open Sans',sans-serif" }
                    }, '✕ Annulla')
                );
              })
      )

      /* Lista admin: tutte le prenotazioni future */
      , isAdmin && React.createElement('div', null
        , React.createElement(BandWeekCalendar, { lessons, prenotazioni })
        , React.createElement('div', { style: { fontSize:12, color:C.textMuted, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:10, fontWeight:600 } }
          , 'Prenotazioni future · ', prenotazioni.filter(p => p.data >= oggi).length, ' totali'
        )
        , loading
          ? React.createElement('div', { style: { padding:32, textAlign:'center', color:C.textDim } }, '⏳ Caricamento...')
          : prenotazioni.filter(p => p.data >= oggi).sort((a,b) => a.data.localeCompare(b.data)||a.oraInizio.localeCompare(b.oraInizio)).map(p => {
              const st = statoStyle(p.stato);
              return React.createElement('div', { key:p.id, style: { background:C.surface, border:`1px solid ${p.stato==='in_attesa'?'rgba(245,158,11,.4)':C.border}`, borderLeft:`4px solid ${p.stato==='in_attesa'?'#f59e0b':p.stato==='approvata'?C.green:C.red}`, borderRadius:12, padding:'14px 18px', marginBottom:10, display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap' } }
                , React.createElement('div', { style: { width:44,height:44,borderRadius:8,background:C.orange2Bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0 } }
                  , React.createElement('div', { style: { fontSize:14,fontWeight:700,color:C.orange2,lineHeight:1 } }, p.data.split('-')[2])
                  , React.createElement('div', { style: { fontSize:9,color:C.orange2,textTransform:'uppercase' } }, MESI[+p.data.split('-')[1]-1])
                )
                , React.createElement('div', { style: { flex:1, minWidth:0 } }
                  , React.createElement('div', { style: { display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:3 } }
                    , React.createElement('span', { style: { fontWeight:700, fontSize:14, color:C.text } }, p.richiedente)
                    , React.createElement('span', { style: { background:st.bg, color:st.fg, border:`1px solid ${st.bd}`, borderRadius:20, padding:'1px 8px', fontSize:11, fontWeight:600 } }, st.label)
                  )
                  , React.createElement('div', { style: { fontSize:12, color:C.textMuted } }, fmtData(p.data), ' · 🕐 ', p.oraInizio, ' → ', p.oraFine)
                  , p.motivo && React.createElement('div', { style: { fontSize:12, color:C.textDim, marginTop:2, fontStyle:'italic' } }, '"', p.motivo, '"')
                  , p.telefono && React.createElement('div', { style: { fontSize:12, color:C.textMuted, marginTop:2 } }, '📞 ', p.telefono)
                )
                , p.stato === 'in_attesa' && React.createElement('div', { style: { display:'flex', gap:6, flexShrink:0 } }
                  , React.createElement('button', { onClick:()=>handleApprova(p,'approvata'), style:{ padding:'6px 14px',borderRadius:8,border:'none',background:C.green,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Open Sans',sans-serif" } }, '✓ Approva')
                  , React.createElement('button', { onClick:()=>handleApprova(p,'rifiutata'), style:{ padding:'6px 14px',borderRadius:8,border:`1px solid ${C.redBorder}`,background:C.redBg,color:C.red,cursor:'pointer',fontSize:12,fontFamily:"'Open Sans',sans-serif" } }, '✕ Rifiuta')
                )
              );
            })
      )
    )

    /* Modal form prenotazione */
    , showForm && React.createElement(Modal, { title: editTarget ? 'Modifica prenotazione' : 'Nuova prenotazione', onClose:()=>{ setShowForm(false); setEditTarget(null); } }
      , React.createElement(SalaProveForm, {
          initial: editTarget, role: userRuolo, appUser: appUser,
          onClose: ()=>{ setShowForm(false); setEditTarget(null); },
          onSave: (nuova) => {
            setPrenotazioni(prev => editTarget ? prev.map(x=>x.id===nuova.id?nuova:x) : [...prev,nuova]);
            setShowForm(false); setEditTarget(null);
            showToast(true, editTarget ? 'Prenotazione aggiornata ✅' : (userRuolo==='admin' ? '✅ Sala prenotata' : '✅ Richiesta inviata — in attesa di approvazione'));
          },
        })
    )

    /* Modal contatta admin */
    , showContatto && React.createElement('div', { onClick:()=>setShowContatto(false), style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,.6)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16} }
      , React.createElement('div', { onClick:e=>e.stopPropagation(), style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:'100%',maxWidth:420,padding:24,boxShadow:'0 20px 60px rgba(0,0,0,.4)',fontFamily:"'Open Sans',sans-serif"} }
        , React.createElement('div', { style:{display:'flex',alignItems:'center',gap:10,marginBottom:16} }
          , React.createElement('div', { style:{width:36,height:36,borderRadius:10,background:C.tealBg,border:`1px solid ${C.tealBorder}`,display:'flex',alignItems:'center',justifyContent:'center'} }
            , React.createElement(Ic,{n:'mail',size:18,stroke:C.teal})
          )
          , React.createElement('div', null
            , React.createElement('div', { style:{fontSize:15,fontWeight:700,color:C.text} }, '💬 Contatta l\'amministrazione')
            , React.createElement('div', { style:{fontSize:12,color:C.textMuted} }, 'Il messaggio arriverà come notifica all\'admin')
          )
          , React.createElement('button', { onClick:()=>setShowContatto(false), style:{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:C.textMuted,fontSize:20} }, '×')
        )
        , React.createElement('textarea', {
            value: msgContatto,
            onChange: e=>setMsgContatto(e.target.value),
            rows: 5,
            placeholder: 'Es. Vorremmo prenotare la sala ogni settimana, è possibile? Abbiamo bisogno di un amplificatore...',
            style: { width:'100%', boxSizing:'border-box', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, padding:'10px 12px', fontFamily:"'Open Sans',sans-serif", resize:'vertical' }
          })
        , React.createElement('div', { style:{display:'flex',gap:10,justifyContent:'flex-end',marginTop:14} }
          , React.createElement('button', { onClick:()=>setShowContatto(false), style:{padding:'9px 18px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13} }, 'Annulla')
          , React.createElement('button', { onClick:handleSendContatto, disabled:!msgContatto.trim()||sendingMsg, style:{padding:'9px 18px',borderRadius:8,border:'none',background:msgContatto.trim()?C.teal:C.surface,color:msgContatto.trim()?'#fff':C.textMuted,cursor:msgContatto.trim()?'pointer':'not-allowed',fontSize:13,fontWeight:600} }, sendingMsg?'Invio…':'Invia messaggio')
        )
      )
    )
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGGI VIEW
// ═══════════════════════════════════════════════════════════════════════════════
const MessaggiView = ({ appUser, ruolo, students, docenti }) => {
  const [messaggi,    setMessaggi]    = useState([]);
  const [myAuthId,    setMyAuthId]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState('ricevuti'); // 'ricevuti' | 'inviati'
  const [showCompose, setShowCompose] = useState(false);
  const [toast,       setToast]       = useState(null);
  const isMobile = useIsMobile();

  const showToast = (ok, msg) => { setToast({ok,msg}); setTimeout(()=>setToast(null),4000); };

  // Carica messaggi
  const loadMessaggi = React.useCallback(async () => {
    const sb = window.supabaseClient; if (!sb) { setLoading(false); return; }
    try {
      const { data:{ session } } = await sb.auth.getSession();
      const myId = session?.user?.id;
      if (!myId) { setLoading(false); return; }
      setMyAuthId(myId);

      const [{ data: ricevuti }, { data: broadcast }, { data: inviati }] = await Promise.all([
        sb.from('messaggi').select('*').eq('destinatario_id', myId).order('created_at', {ascending:false}).limit(100),
        sb.from('messaggi').select('*').is('destinatario_id', null).eq('destinatario_ruolo', ruolo).order('created_at', {ascending:false}).limit(50),
        sb.from('messaggi').select('*').eq('mittente_id', myId).order('created_at', {ascending:false}).limit(100),
      ]);
      const tutti = [...(ricevuti||[]), ...(broadcast||[]), ...(inviati||[])];
      const dedup = Object.values(tutti.reduce((a, m) => { a[m.id]=m; return a; }, {}));
      setMessaggi(dedup);
    } catch(e) { console.warn('[FM] loadMessaggi:', e?.message); }
    setLoading(false);
  }, [appUser, ruolo]);

  React.useEffect(() => { loadMessaggi(); }, []);

  const myId = myAuthId || appUser?.userId || appUser?.id;
  const ricevuti = messaggi.filter(m => m.destinatario_id===myId || (!m.destinatario_id && m.destinatario_ruolo===ruolo));
  const inviati  = messaggi.filter(m => m.mittente_id===myId);
  const nonLetti = ricevuti.filter(m => !m.letto).length;

  const fmtDate = d => {
    if (!d) return '';
    const dt = new Date(d);
    const oggi = new Date(); oggi.setHours(0,0,0,0);
    const ieri = new Date(oggi); ieri.setDate(ieri.getDate()-1);
    if (dt >= oggi) return dt.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
    if (dt >= ieri) return 'Ieri '+dt.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
    return dt.toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit'});
  };

  const segnaLetto = async (id) => {
    const sb = window.supabaseClient; if (!sb) return;
    const { error } = await sb.from('messaggi').update({letto:true, letto_at:new Date().toISOString()}).eq('id',id);
    if (error) console.warn('[FM] segnaLetto error:', error.message);
    else setMessaggi(p => p.map(m => m.id===id ? {...m,letto:true} : m));
  };

  const lista = tab==='ricevuti' ? ricevuti : inviati;

  return React.createElement('div', {style:{minHeight:'100%',background:C.bg}}
    /* Header */
    , React.createElement('div', {style:{padding:isMobile?'16px 16px 0':'24px 32px 0',background:C.surface,borderBottom:`1px solid ${C.border}`,paddingBottom:0}}
      , React.createElement('div', {style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:8}}
        , React.createElement('div', {style:{display:'flex',alignItems:'center',gap:12}}
          , React.createElement('div', {style:{width:40,height:40,borderRadius:10,background:C.tealBg,border:`1px solid ${C.tealBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}
            , React.createElement(Ic,{n:'mail',size:20,stroke:C.teal})
          )
          , React.createElement('div', null
            , React.createElement('h1',{style:{fontFamily:"'Oswald',sans-serif",fontSize:'clamp(18px,4vw,22px)',fontWeight:600,color:C.text,marginBottom:2}},'💬 Messaggi')
            , React.createElement('p',{style:{fontSize:12,color:C.textMuted}}, nonLetti>0 ? `${nonLetti} non lett${nonLetti===1?'o':'i'}` : 'Nessun messaggio da leggere')
          )
        )
        , React.createElement('button', {
            onClick: ()=>setShowCompose(true),
            style:{padding:'9px 18px',borderRadius:8,border:'none',background:C.teal,color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:6}
          }
          , React.createElement(Ic,{n:'plus',size:14,stroke:'#fff'}), '✉️ Nuovo messaggio'
        )
      )
      /* Tabs */
      , React.createElement('div', {style:{display:'flex',gap:0}}
        , [['ricevuti','📥 Ricevuti', ricevuti.length],['inviati','📤 Inviati', inviati.length]].map(([id,lbl,cnt]) =>
            React.createElement('button', {key:id, onClick:()=>setTab(id),
              style:{padding:'10px 20px',border:'none',background:'transparent',cursor:'pointer',
                fontFamily:"'Open Sans',sans-serif",fontSize:13,fontWeight:tab===id?700:400,
                color:tab===id?C.teal:C.textMuted,borderBottom:`2px solid ${tab===id?C.teal:'transparent'}`,
                marginBottom:-1,display:'flex',alignItems:'center',gap:6}}
              , lbl
              , React.createElement('span',{style:{fontSize:11,background:tab===id?C.tealBg:C.bg,color:tab===id?C.teal:C.textDim,borderRadius:10,padding:'1px 7px',border:`1px solid ${tab===id?C.tealBorder:C.border}`}},cnt)
            )
          )
      )
    )

    /* Toast */
    , toast && React.createElement('div',{style:{position:'fixed',top:20,right:20,zIndex:9999,padding:'12px 20px',borderRadius:10,background:toast.ok?'#16a34a':C.red,color:'#fff',fontFamily:"'Open Sans',sans-serif",fontSize:13,fontWeight:600,boxShadow:'0 4px 20px rgba(0,0,0,.2)'}}, toast.msg)

    /* Lista messaggi */
    , React.createElement('div', {style:{padding:isMobile?'12px 16px':'20px 32px'}}
      , loading
        ? React.createElement('div',{style:{textAlign:'center',padding:40,color:C.textDim}},'⏳ Caricamento...')
        : lista.length===0
          ? React.createElement('div',{style:{textAlign:'center',padding:'48px 0',color:C.textDim}}
              , React.createElement(Ic,{n:'mail',size:32,stroke:C.textDim})
              , React.createElement('p',{style:{marginTop:12,fontSize:14}}, tab==='ricevuti'?'Nessun messaggio ricevuto':'Nessun messaggio inviato')
            )
          : React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:8}}
              , lista.map(m => {
                  const isRicevuto = tab==='ricevuti';
                  const nonLetto = isRicevuto && !m.letto;
                  return React.createElement('div', {key:m.id,
                      onClick: ()=>{ if(nonLetto) segnaLetto(m.id); },
                      style:{background:nonLetto?`${C.teal}08`:C.surface,border:`1px solid ${nonLetto?C.tealBorder:C.border}`,
                        borderRadius:12,padding:'14px 18px',cursor:nonLetto?'pointer':'default',
                        display:'flex',gap:14,alignItems:'flex-start',transition:'background .15s'}}
                    , React.createElement('div',{style:{width:36,height:36,borderRadius:8,background:nonLetto?C.tealBg:C.bg,border:`1px solid ${nonLetto?C.tealBorder:C.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                      , React.createElement(Ic,{n:nonLetto?'mail':'mail',size:16,stroke:nonLetto?C.teal:C.textMuted})
                    )
                    , React.createElement('div',{style:{flex:1,minWidth:0}}
                      , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,justifyContent:'space-between',marginBottom:3}}
                        , React.createElement('span',{style:{fontSize:13,fontWeight:nonLetto?700:600,color:C.text}},
                            isRicevuto ? m.mittente_nome : `→ ${m.destinatario_nome||m.destinatario_ruolo}`)
                        , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:6}}
                          , nonLetto && React.createElement('div',{style:{width:7,height:7,borderRadius:'50%',background:C.teal,flexShrink:0}})
                          , React.createElement('span',{style:{fontSize:11,color:C.textDim,whiteSpace:'nowrap'}},fmtDate(m.created_at))
                        )
                      )
                      , React.createElement('div',{style:{fontSize:12,fontWeight:nonLetto?600:500,color:C.text,marginBottom:3}},m.oggetto||'(senza oggetto)')
                      , React.createElement('div',{style:{fontSize:12,color:C.textMuted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},m.testo)
                      , React.createElement('div',{style:{display:'flex',gap:6,marginTop:5}}
                        , m.inviato_push && React.createElement('span',{style:{fontSize:10,background:C.tealBg,color:C.teal,border:`1px solid ${C.tealBorder}`,borderRadius:4,padding:'1px 6px'}},'📱 Push')
                        , m.inviato_wa && React.createElement('span',{style:{fontSize:10,background:'#dcfce7',color:'#16a34a',border:'1px solid #bbf7d0',borderRadius:4,padding:'1px 6px'}},'💬 WA')
                        , m.inviato_email && React.createElement('span',{style:{fontSize:10,background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBorder}`,borderRadius:4,padding:'1px 6px'}},'📧 Email')
                      )
                    )
                  );
                })
            )
    )

    /* Modal Compose */
    , showCompose && React.createElement(ComposeModal, {
        appUser, ruolo, students, docenti,
        onClose: ()=>setShowCompose(false),
        onSent: (nuovi) => {
          setMessaggi(p=>[...nuovi,...p]);
          setShowCompose(false);
          setTab('inviati');
          showToast(true, `✅ Messaggio inviato a ${nuovi.length} destinatar${nuovi.length===1?'io':'i'}`);
        }
      })
  );
};

// ── Modal Compose Message ─────────────────────────────────────────────────────
const ComposeModal = ({ appUser, ruolo, students, docenti, onClose, onSent }) => {
  const [oggetto,   setOggetto]   = useState('');
  const [testo,     setTesto]     = useState('');
  const [destSel,   setDestSel]   = useState([]);   // [{id, nome, ruolo, email, telefono}]
  const [canali,    setCanali]    = useState({app:true, push:true, email:false, whatsapp:false});
  const [sending,   setSending]   = useState(false);
  const [search,    setSearch]    = useState('');
  const isAdmin = ruolo === 'admin';

  // Destinatari disponibili
  const DEST_FISSI = !isAdmin ? [
    {id:'__admin__', nome:'Amministrazione', ruolo:'admin', email:'', telefono:''}
  ] : [];

  const DEST_LISTA = isAdmin ? [
    ...( (students||[]).map(s=>({id:String(s.id||s.userId||''), nome:s.nome||s.name||'', ruolo:'allievo', email:s.email||'', telefono:s.telefono||s.phone||''})) ),
    ...( (docenti||[]).map(d=>({id:String(d.id||d.userId||''), nome:d.nome||'', ruolo:'docente', email:d.email||'', telefono:d.phone||d.telefono||''})) ),
  ] : DEST_FISSI;

  const filtered = search
    ? DEST_LISTA.filter(d => d.nome.toLowerCase().includes(search.toLowerCase()) || d.ruolo.toLowerCase().includes(search.toLowerCase()))
    : DEST_LISTA;

  const toggleDest = (d) => {
    if (d.id==='__admin__') { setDestSel([d]); return; }
    setDestSel(p => p.some(x=>x.id===d.id) ? p.filter(x=>x.id!==d.id) : [...p,d]);
  };

  const selectAll = (ruolo) => {
    const tutti = DEST_LISTA.filter(d=>d.ruolo===ruolo);
    const yaPresenti = tutti.filter(d=>destSel.some(x=>x.id===d.id));
    if (yaPresenti.length===tutti.length) { setDestSel(p=>p.filter(d=>d.ruolo!==ruolo)); }
    else { setDestSel(p=>[...p.filter(d=>d.ruolo!==ruolo),...tutti]); }
  };

  const handleSend = async () => {
    if (!oggetto.trim()||!testo.trim()||!destSel.length) return;
    setSending(true);
    try {
      const sb = window.supabaseClient;
      const { data:{ session } } = await sb.auth.getSession();
      const token = session?.access_token;
      if (!token) { alert('Sessione scaduta — riloggati'); setSending(false); return; }

      const mittente_id    = session.user.id;  // UUID reale auth
      const mittente_nome  = appUser?.nome||session.user.email||'';
      const mittente_ruolo = ruolo;

      // Risolvi __admin__: cerca UUID reale dell'admin in auth.users via profili
      let destinatariReali = await Promise.all(destSel.map(async d => {
        if (d.id !== '__admin__') return d;
        // Cerca il profilo admin: profili.id = auth.users.id
        const { data: adminP } = await sb.from('profili')
          .select('id, nome').eq('ruolo','admin').limit(1);
        if (adminP?.length) {
          return { ...d, id: adminP[0].id, nome: adminP[0].nome||'Amministrazione' };
        }
        return { ...d, id: null }; // broadcast admin senza ID specifico
      }));

      const res = await fetch('https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/send-message', {
        method:'POST',
        headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},
        body: JSON.stringify({
          mittente_id, mittente_nome, mittente_ruolo,
          oggetto: oggetto.trim(), testo: testo.trim(),
          destinatari: destinatariReali, canali
        }),
      });
      const json = await res.json().catch(()=>({ok:false,error:'Risposta non valida'}));
      if (!res.ok || !json.ok) {
        alert('Errore: '+(json.error||`HTTP ${res.status}`));
        setSending(false); return;
      }
      const now = new Date().toISOString();
      const nuovi = destinatariReali.map(d=>({
        id: crypto.randomUUID(), mittente_id, mittente_nome, mittente_ruolo,
        destinatario_id:d.id, destinatario_nome:d.nome, destinatario_ruolo:d.ruolo,
        oggetto:oggetto.trim(), testo:testo.trim(), letto:false, created_at:now,
        inviato_push:canali.push, inviato_wa:canali.whatsapp, inviato_email:canali.email
      }));
      onSent(nuovi);
    } catch(e) { alert('Errore invio: '+e.message); }
    setSending(false);
  };

  const RUOLO_COLORS = {admin:{c:C.gold,bg:C.goldBg},docente:{c:C.teal,bg:C.tealBg},allievo:{c:C.blue,bg:C.blueBg}};

  return React.createElement('div', {onClick:onClose, style:{position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,.6)',backdropFilter:'blur(3px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}
    , React.createElement('div', {onClick:e=>e.stopPropagation(), style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:'100%',maxWidth:580,maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,.4)',fontFamily:"'Open Sans',sans-serif"}}
      /* Header */
      , React.createElement('div',{style:{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:10}}
        , React.createElement(Ic,{n:'mail',size:18,stroke:C.teal})
        , React.createElement('div',{style:{fontSize:15,fontWeight:700,color:C.text,flex:1}},'✉️ Nuovo messaggio')
        , React.createElement('button',{onClick:onClose,style:{background:'none',border:'none',cursor:'pointer',color:C.textMuted,fontSize:20,lineHeight:1}},'×')
      )
      /* Body scrollable */
      , React.createElement('div',{style:{flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:14}}
        /* Destinatari */
        , React.createElement('div',null
          , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:6}},'A:')
          , isAdmin && React.createElement('div',{style:{display:'flex',gap:6,marginBottom:8}}
              , ['allievo','docente'].map(r=>React.createElement('button',{key:r,onClick:()=>selectAll(r),style:{padding:'4px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:C.bg,color:C.textMuted,cursor:'pointer',fontSize:11}},'Tutti i '+r+'i'))
            )
          , isAdmin && React.createElement('input',{type:'text',placeholder:'Cerca destinatario...',value:search,onChange:e=>setSearch(e.target.value),style:{width:'100%',boxSizing:'border-box',padding:'7px 10px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,marginBottom:6}})
          /* Lista destinatari selezionabili */
          , React.createElement('div',{style:{maxHeight:150,overflowY:'auto',border:`1px solid ${C.border}`,borderRadius:8,background:C.bg}}
              , filtered.map(d=>{
                  const sel = destSel.some(x=>x.id===d.id);
                  const rc = RUOLO_COLORS[d.ruolo]||RUOLO_COLORS.allievo;
                  return React.createElement('div',{key:d.id,onClick:()=>toggleDest(d),style:{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',cursor:'pointer',background:sel?`${rc.c}08`:'transparent',borderBottom:`1px solid ${C.border}10`}}
                    , React.createElement('div',{style:{width:16,height:16,borderRadius:4,border:`1.5px solid ${sel?rc.c:C.border}`,background:sel?rc.c:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}
                      , sel&&React.createElement('div',{style:{color:'#fff',fontSize:10,fontWeight:700}},'✓')
                    )
                    , React.createElement('span',{style:{fontSize:13,color:C.text,flex:1}},d.nome)
                    , React.createElement('span',{style:{fontSize:10,background:rc.bg,color:rc.c,borderRadius:4,padding:'1px 6px'}},d.ruolo)
                  );
                })
            )
          /* Badge destinatari selezionati */
          , destSel.length>0 && React.createElement('div',{style:{display:'flex',gap:5,flexWrap:'wrap',marginTop:6}}
              , destSel.map(d=>React.createElement('span',{key:d.id,style:{fontSize:11,background:C.tealBg,color:C.teal,border:`1px solid ${C.tealBorder}`,borderRadius:20,padding:'2px 10px',display:'flex',alignItems:'center',gap:4}}
                  ,d.nome
                  ,React.createElement('button',{onClick:()=>toggleDest(d),style:{background:'none',border:'none',cursor:'pointer',color:C.teal,fontSize:13,lineHeight:1,padding:0}},'×')
                ))
            )
        )
        /* Oggetto */
        , React.createElement('div',null
          , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:4}},'Oggetto')
          , React.createElement('input',{type:'text',value:oggetto,onChange:e=>setOggetto(e.target.value),placeholder:'Oggetto del messaggio',style:{width:'100%',boxSizing:'border-box',padding:'8px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13}})
        )
        /* Testo */
        , React.createElement('div',null
          , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:4}},'Messaggio')
          , React.createElement('textarea',{value:testo,onChange:e=>setTesto(e.target.value),rows:5,placeholder:'Scrivi il tuo messaggio...',style:{width:'100%',boxSizing:'border-box',padding:'8px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,resize:'vertical',fontFamily:"'Open Sans',sans-serif"}})
        )
        /* Canali */
        , React.createElement('div',null
          , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'.07em',display:'block',marginBottom:8}},'Invia tramite')
          , React.createElement('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}}
              , [['app','📱 App',true],['push','🔔 Push',true],['whatsapp','💬 WhatsApp',false],['email','📧 Email',false]].map(([k,lbl])=>{
                  const on = canali[k];
                  return React.createElement('button',{key:k,onClick:()=>setCanali(p=>({...p,[k]:!p[k]})),style:{padding:'6px 14px',borderRadius:20,border:`1.5px solid ${on?C.teal:C.border}`,background:on?C.tealBg:C.bg,color:on?C.teal:C.textMuted,cursor:'pointer',fontSize:12,fontWeight:on?600:400}},lbl);
                })
            )
          , React.createElement('div',{style:{fontSize:11,color:C.textMuted,marginTop:6}},'App e Push sempre attivi. WhatsApp e Email richiedono configurazione aggiuntiva.')
        )
      )
      /* Footer */
      , React.createElement('div',{style:{padding:'14px 20px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'flex-end',gap:10}}
        , React.createElement('button',{onClick:onClose,style:{padding:'9px 18px',borderRadius:8,border:`1px solid ${C.border}`,background:'none',color:C.textMuted,cursor:'pointer',fontSize:13}},'Annulla')
        , React.createElement('button',{onClick:handleSend,disabled:!oggetto.trim()||!testo.trim()||!destSel.length||sending,style:{padding:'9px 20px',borderRadius:8,border:'none',background:(!oggetto.trim()||!testo.trim()||!destSel.length)?C.surface:C.teal,color:(!oggetto.trim()||!testo.trim()||!destSel.length)?C.textMuted:'#fff',cursor:(!oggetto.trim()||!testo.trim()||!destSel.length)?'not-allowed':'pointer',fontSize:13,fontWeight:600}},sending?'⏳ Invio...':destSel.length?`📨 Invia a ${destSel.length}`:'📨 Invia')
      )
    )
  );
};

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
  const [sharedAnniScolastici, setSharedAnniScolastici] = useState(INIT_ANNI_SCOLASTICI);
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
          id: r.id, label: r.label, annoInizio: r.anno_inizio, stato: r.stato, note: r.note||'',
        }));
        if (configFromDB.anniScolastici) delete configFromDB.anniScolastici;
        const dashboardPanelsDB = (configFromDB.dashboardPanels && typeof configFromDB.dashboardPanels === 'object') ? configFromDB.dashboardPanels : null;
        if (dashboardPanelsDB) delete configFromDB.dashboardPanels;

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
            brani:    (sB||[]).map(r => ({ id:r.id, title:r.titolo||'', composer:r.compositore||'', periodo:r.periodo||'', tonality:r.tonalita||'', difficulty:r.difficolta||'Intermedio', tipo:r.tipo||'individuale', note:r.note||'', lezioni:r.lezioni||0 })),
            spese:    (sP||[]).map(r => ({ id:String(r.id), docenteId:r.docente_id||null, data:r.data||'', mese:r.mese!=null?r.mese:new Date((r.data||'')+'T00:00:00').getMonth(), anno:r.anno||new Date().getFullYear(), importo:parseFloat(r.importo)||0, desc:r.desc||r.descrizione||'', nota:r.nota||'', metodo:r.metodo||'Bonifico', categoria:r.categoria||'altro' })),
            entrate:  (sQ||[]).map(r => ({ id:String(r.id), studentId:r.studente_id||null, studentName:r.studente_nome||'', importo:parseFloat(r.importo)||0, mese:r.mese, anno:r.anno, data:r.data_pagamento||'', metodo:r.metodo||'Contanti', categoria:'quota', desc:r.note||'', stato:r.stato||'attesa' })),
            concerti: (sEV||[]).map(r => ({ id:r.id, nome:r.nome||'', data:r.data||'', luogo:r.luogo||'', tipo:r.tipo||'evento', stato:r.stato||'programmato', descrizione:r.descrizione||'', note:r.note||'', programma:[], partecipanti:[], prenotazioni:[], biglietto:r.biglietto||false, prezzoBiglietto:parseFloat(r.prezzo_biglietto)||0 })),
            allegati: (sAL||[]).map(adaptA),
            config:   Object.keys(configFromDB).length > 0 ? configFromDB : null,
            anniScolastici:  anniScolasticiDB, // sempre passato, anche se []
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
      case 'allievi':     return React.createElement(AllieviView, { students: sharedStudents, setStudents: setSharedStudents, courses: sharedCourses, setCourses: setSharedCourses, lessons: sharedLessons, entrate: sharedEntrate, setEntrate: setSharedEntrate, annoInizioAttivo: sharedConfig.annoInizioAttivo, config: sharedConfig, setConfig: setSharedConfig, docenti: sharedDocenti, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user});
      case 'docenti':     return React.createElement(DocentiView, { students: sharedStudents, lessons: sharedLessons, docenti: sharedDocenti, setDocenti: setSharedDocenti, courses: sharedCourses, userRuolo: user?.ruolo||"admin", appUser: user, annoInizioAttivo: sharedConfig.annoInizioAttivo, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null)});
      case 'corsi':       return React.createElement(CorsiView, { courses: sharedCourses, setCourses: setSharedCourses, students: sharedStudents, setStudents: setSharedStudents, docenti: sharedDocenti, userRuolo: user?.ruolo||"admin", appUser: user});
      case 'calendario':  return React.createElement(CalendarioView, { lessons: sharedLessons, setLessons: setSharedLessons, courses: sharedCourses, students: sharedStudents, setStudents: setSharedStudents, docenti: sharedDocenti, repertorio: sharedRepertorio, setRepertorio: setSharedRepertorio, allegati: sharedAllegati, setAllegati: setSharedAllegati, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user, config: sharedConfig});
      case 'contabilita': return React.createElement(ContabilitaView, { students: sharedStudents, entrate: sharedEntrate, setEntrate: setSharedEntrate, spese: sharedSpese, setSpese: setSharedSpese, config: sharedConfig, setConfig: setSharedConfig, docenti: sharedDocenti, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user});
      case 'repertorio':  return React.createElement(RepertorioView, { brani: sharedRepertorio, setBrani: setSharedRepertorio, students: sharedStudents, lessons: sharedLessons, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", appUser: user});
      case 'allegati':    return React.createElement(AllegatiView, { allegati: sharedAllegati, setAllegati: setSharedAllegati, lessons: sharedLessons, students: sharedStudents, courses: sharedCourses, brani: sharedRepertorio, setBrani: setSharedRepertorio, userRuolo: user?.ruolo||'admin', appUser: user});
      case 'biblioteca':  return React.createElement(BibliotecaView, { userRuolo: user?.ruolo||"admin", appUser: user});
      case 'concerti':    return React.createElement(ConcertiView, { students: sharedStudents, brani: sharedRepertorio, quickAction: sharedQuickAction, clearQuickAction: ()=>setSharedQuickAction(null), userRuolo: user?.ruolo||"admin", concerti: sharedConcerti, setConcerti: setSharedConcerti});
      case 'utenti':      return (user?.ruolo||"admin")==="admin" ? React.createElement(UtentiView, { students: sharedStudents, docenti: sharedDocenti}) : null;
      case 'impostazioni':return React.createElement(ImpostazioniView, { config: sharedConfig, setConfig: setSharedConfig, panels: sharedPanels, setPanels: setSharedPanels, ruolo: sharedRuolo, setRuolo: setSharedRuolo, anniScolastici: sharedAnniScolastici, setAnniScolastici: setSharedAnniScolastici});
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
  } catch(err) { window.__BOOT_ERROR = window.__BOOT_ERROR || err; console.error('[FM]', err.message||err); }
})();

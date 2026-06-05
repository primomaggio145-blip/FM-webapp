var _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN

// Hook: useSortable(defaultKey, defaultDir)
// Returns [sortKey, sortDir, handleSort, sortFn]
const useSortable = (defaultKey = "", defaultDir = "asc") => {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);
  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const sortFn = (arr, accessor) => {
    if (!sortKey) return arr;
    return [...arr].sort((a, b) => {
      const va = accessor ? accessor(a, sortKey) : (a[sortKey] ?? "");
      const vb = accessor ? accessor(b, sortKey) : (b[sortKey] ?? "");
      const na = typeof va === "number", nb = typeof vb === "number";
      let cmp;
      if (na && nb) cmp = va - vb;
      else cmp = String(va).toLowerCase().localeCompare(String(vb).toLowerCase(), "it");
      return sortDir === "asc" ? cmp : -cmp;
    });
  };
  return [sortKey, sortDir, handleSort, sortFn];
};

// SortTh: table header cell with sort indicator
const SortTh = ({ label, sortKey: col, currentKey, dir, onSort, style, className }) => {
  const active = currentKey === col;
  return React.createElement('th', {
    onClick: col ? () => onSort(col) : undefined,
    className,
    style: {
      padding: "10px 16px",
      textAlign: "left",
      fontSize: 11,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: active ? C.gold : C.textMuted,
      fontWeight: active ? 700 : 500,
      cursor: col ? "pointer" : "default",
      userSelect: "none",
      whiteSpace: "nowrap",
      background: active ? `${C.gold}08` : undefined,
      transition: "color 0.12s",
      ...style,
    }
  },
    label,
    col && React.createElement('span', {
      style: {
        marginLeft: 4,
        fontSize: 9,
        opacity: active ? 1 : 0.3,
        display: "inline-block",
        transition: "transform 0.15s, opacity 0.15s",
        transform: active && dir === "desc" ? "rotate(180deg)" : "rotate(0deg)",
      }
    }, "▲")
  );
};

// ─── DATI ─────────────────────────────────────────────────────────────────────
const INSTRUMENTS = ["Pianoforte","Chitarra","Violino","Flauto","Batteria","Saxofono","Tromba","Basso","Canto","Clarinetto"];
const TEACHERS    = ["Prof. Rossi","Prof. Bianchi","Prof. Verde","Prof. Marino"];
const LEVELS      = ["Principiante","Elementare","Intermedio","Avanzato","Professionale"];
const INS_COLORS  = { Pianoforte:C.gold, Chitarra:"#4ade80", Violino:"#60a5fa", Flauto:"#c084fc", Batteria:"#fb923c", Saxofono:"#f472b6", Tromba:"#34d399", Basso:"#a78bfa", Canto:"#fbbf24", Clarinetto:"#2dd4bf" };

const INIT_COURSES = [
  { id:"c1",  name:"Pianoforte",        type:"individuale", description:"Lezione individuale di pianoforte classico e moderno",       docenti:["d1"] },
  { id:"c2",  name:"Chitarra",          type:"individuale", description:"Lezione individuale di chitarra classica, acustica ed elettrica", docenti:["d2"] },
  { id:"c3",  name:"Violino",           type:"individuale", description:"Lezione individuale di violino classico",                    docenti:["d1"] },
  { id:"c4",  name:"Flauto",            type:"individuale", description:"Lezione individuale di flauto traverso",                    docenti:["d2"] },
  { id:"c5",  name:"Batteria",          type:"individuale", description:"Lezione individuale di batteria e percussioni",             docenti:["d3"] },
  { id:"c6",  name:"Saxofono",          type:"individuale", description:"Lezione individuale di saxofono",                          docenti:[] },
  { id:"c7",  name:"Teoria e Solfeggio",type:"collettivo",  description:"Corso collettivo di teoria musicale e solfeggio",          docenti:["d1","d2"] },
  { id:"c8",  name:"Musica d'insieme",  type:"collettivo",  description:"Ensemble strumentale e musica da camera",                  docenti:["d1","d3"] },
  { id:"c9",  name:"Ear Training",      type:"collettivo",  description:"Allenamento dell'orecchio musicale",                       docenti:["d4"] },
  { id:"c10", name:"Orchestra",         type:"collettivo",  description:"Orchestra della scuola, aperta a tutti gli strumenti",     docenti:["d1","d2","d3","d4"] },
];

// Helper: genera quote anno scolastico
const mkQuote = (annoInizio, mese, importo, stato, dataPag="") => ({
  id: uid(), mese, anno: mese>=9 ? annoInizio : annoInizio+1,
  importo, stato, dataPagamento: dataPag,
});

const INIT_STUDENTS = [
  { id:1, name:"Sofia Marchetti",  email:"sofia.marchetti@email.it", phone:"333 1234567", instrument:"Pianoforte", teacher:"Prof. Rossi",   level:"Intermedio",   status:"attivo",   monthlyFee:120, feeType:"fisso",    birthdate:"2010-03-15", enrollDate:"2022-09-01", complementaryCourse:"c7",  notes:"Partecipa al saggio di primavera",
    lessons:[{date:"2025-02-17",topic:"Scale e arpeggi",attendance:"presente",notes:""},{date:"2026-02-10",topic:"Chopin Notturno Op.9",attendance:"presente",notes:"Ottimi progressi"},{date:"2026-02-03",topic:"Tecnica staccato",attendance:"assente",notes:"Malattia"}],
    repertorio:[
      {id:"r1a", titolo:"Notturno Op.9 n.2",   compositore:"F. Chopin",    periodo:"Romantico",  stato:"in studio",   dataInizio:"2025-10-01", note:"Lavoro sulla cantabilità"},
      {id:"r1b", titolo:"Invenzione n.1 BWV 772",compositore:"J.S. Bach",   periodo:"Barocco",    stato:"completato",  dataInizio:"2024-09-01", note:"Presentato al saggio di natale"},
      {id:"r1c", titolo:"Sonata K.331",          compositore:"W.A. Mozart", periodo:"Classico",   stato:"in studio",   dataInizio:"2025-01-15", note:"I mov. Tema e variazioni"},
    ],
    quote:[
      mkQuote(annoScolasticoAttivo,9, 120,"pagato","2025-09-05"),
      mkQuote(annoScolasticoAttivo,10,120,"pagato","2025-10-03"),
      mkQuote(annoScolasticoAttivo,11,120,"pagato","2025-11-04"),
      mkQuote(annoScolasticoAttivo,12,120,"pagato","2025-12-02"),
      mkQuote(annoScolasticoAttivo,1, 120,"pagato","2026-01-07"),
      mkQuote(annoScolasticoAttivo,2, 120,"pagato","2026-02-03"),
      mkQuote(annoScolasticoAttivo,3, 120,"attesa",""),
      mkQuote(annoScolasticoAttivo,4, 120,"attesa",""),
      mkQuote(annoScolasticoAttivo,5, 120,"attesa",""),
    ]
  },
  { id:2, name:"Luca Ferrara",     email:"luca.ferrara@email.it",    phone:"345 7654321", instrument:"Chitarra",   teacher:"Prof. Bianchi", level:"Elementare",   status:"attivo",   monthlyFee:100, feeType:"fisso",    birthdate:"2012-07-22", enrollDate:"2023-01-15", complementaryCourse:"c7",  notes:"",
    lessons:[{date:"2025-02-18",topic:"Accordi barre",attendance:"presente",notes:"Difficoltà con il FA"}],
    repertorio:[
      {id:"r2a", titolo:"Romanza d'amore",        compositore:"Anonimo",      periodo:"Romantico",  stato:"completato", dataInizio:"2024-09-01", note:""},
      {id:"r2b", titolo:"Estudio Op.60 n.6",      compositore:"M. Carcassi",  periodo:"Classico",   stato:"in studio",  dataInizio:"2024-11-01", note:"Difficoltà con il barré al III tasto"},
    ],
    quote:[
      mkQuote(annoScolasticoAttivo,9, 100,"pagato","2025-09-10"),
      mkQuote(annoScolasticoAttivo,10,100,"pagato","2025-10-08"),
      mkQuote(annoScolasticoAttivo,11,100,"pagato","2025-11-12"),
      mkQuote(annoScolasticoAttivo,12,100,"scaduto",""),
      mkQuote(annoScolasticoAttivo,1, 100,"pagato","2026-01-20"),
      mkQuote(annoScolasticoAttivo,2, 100,"pagato","2026-02-10"),
      mkQuote(annoScolasticoAttivo,3, 100,"attesa",""),
      mkQuote(annoScolasticoAttivo,4, 100,"attesa",""),
    ]
  },
  { id:3, name:"Emma Conti",       email:"emma.conti@email.it",      phone:"347 9876543", instrument:"Violino",   teacher:"Prof. Rossi",   level:"Avanzato",     status:"attivo",   monthlyFee:130, feeType:"fisso",    birthdate:"2008-11-05", enrollDate:"2020-09-01", complementaryCourse:"c10", notes:"Candidata esame conservatorio",
    lessons:[{date:"2025-02-19",topic:"Sonate Baroque",attendance:"presente",notes:""},{date:"2025-02-12",topic:"Bach Partita",attendance:"presente",notes:"Eccellente"}],
    repertorio:[
      {id:"r3a", titolo:"Partita n.2 in Re min. BWV 1004",compositore:"J.S. Bach",    periodo:"Barocco",   stato:"in studio",   dataInizio:"2024-09-01", note:"Preparazione esame conservatorio"},
      {id:"r3b", titolo:"Concerto in La min. Op.3 n.6",  compositore:"A. Vivaldi",   periodo:"Barocco",   stato:"completato",  dataInizio:"2024-09-01", note:"Saggio di dicembre"},
      {id:"r3c", titolo:"Sonata n.1 Op.105",             compositore:"R. Schumann",  periodo:"Romantico", stato:"in studio",   dataInizio:"2025-02-01", note:"Iniziato recentemente"},
    ],
    quote:[
      mkQuote(annoScolasticoAttivo,9, 130,"pagato","2025-09-02"),
      mkQuote(annoScolasticoAttivo,10,130,"pagato","2025-10-01"),
      mkQuote(annoScolasticoAttivo,11,130,"pagato","2025-11-04"),
      mkQuote(annoScolasticoAttivo,12,130,"pagato","2025-12-03"),
      mkQuote(annoScolasticoAttivo,1, 130,"pagato","2026-01-06"),
      mkQuote(annoScolasticoAttivo,2, 130,"pagato","2026-02-04"),
      mkQuote(annoScolasticoAttivo,3, 130,"attesa",""),
    ]
  },
  { id:4, name:"Marco Ricci",      email:"marco.ricci@email.it",     phone:"339 1112233", instrument:"Batteria",  teacher:"Prof. Verde",   level:"Principiante", status:"inattivo", monthlyFee:110, feeType:"variabile",birthdate:"2005-04-18", enrollDate:"2024-02-01", complementaryCourse:"",    notes:"Sospeso fino a marzo",
    lessons:[],
    repertorio:[
      {id:"r4a", titolo:"Groove in 4/4",  compositore:"Esercizio",  periodo:"—", stato:"completato", dataInizio:"2024-09-01", note:""},
    ],
    quote:[
      mkQuote(annoScolasticoAttivo,9, 110,"pagato","2025-09-15"),
      mkQuote(annoScolasticoAttivo,10,110,"pagato","2025-10-18"),
      mkQuote(annoScolasticoAttivo,11,110,"scaduto",""),
      mkQuote(annoScolasticoAttivo,12,110,"scaduto",""),
      mkQuote(annoScolasticoAttivo,1, 110,"scaduto",""),
      mkQuote(annoScolasticoAttivo,2, 110,"scaduto",""),
    ]
  },
  { id:5, name:"Giulia Romano",    email:"giulia.romano@email.it",   phone:"366 4455667", instrument:"Flauto",    teacher:"Prof. Bianchi", level:"Intermedio",   status:"attivo",   monthlyFee:95,  feeType:"fisso",    birthdate:"2011-09-30", enrollDate:"2022-10-01", complementaryCourse:"c9",  notes:"",
    lessons:[{date:"2025-02-20",topic:"Tecnica respirazione",attendance:"presente",notes:""}],
    repertorio:[
      {id:"r5a", titolo:"Sonata in Sol min.",     compositore:"G.P. Telemann", periodo:"Barocco",  stato:"completato", dataInizio:"2024-09-01", note:""},
      {id:"r5b", titolo:"Concerto in Re mag.",    compositore:"J. Quantz",     periodo:"Barocco",  stato:"in studio",  dataInizio:"2024-12-01", note:"Lavoro sull'articolazione"},
    ],
    quote:[
      mkQuote(annoScolasticoAttivo,9, 95,"pagato","2025-09-08"),
      mkQuote(annoScolasticoAttivo,10,95,"pagato","2025-10-06"),
      mkQuote(annoScolasticoAttivo,11,95,"pagato","2025-11-05"),
      mkQuote(annoScolasticoAttivo,12,95,"pagato","2025-12-09"),
      mkQuote(annoScolasticoAttivo,1, 95,"pagato","2026-01-13"),
      mkQuote(annoScolasticoAttivo,2, 95,"pagato","2026-02-11"),
      mkQuote(annoScolasticoAttivo,3, 95,"attesa",""),
      mkQuote(annoScolasticoAttivo,4, 95,"attesa",""),
      mkQuote(annoScolasticoAttivo,5, 95,"attesa",""),
    ]
  },
  { id:6, name:"Alessandro Gallo", email:"a.gallo@email.it",         phone:"328 8899001", instrument:"Pianoforte",teacher:"Prof. Rossi",   level:"Intermedio",   status:"attivo",   monthlyFee:120, feeType:"fisso",    birthdate:"2009-01-12", enrollDate:"2023-09-01", complementaryCourse:"c8",  notes:"",
    lessons:[],
    repertorio:[
      {id:"r6a", titolo:"Sonatina Op.36 n.1",  compositore:"M. Clementi",   periodo:"Classico",  stato:"completato", dataInizio:"2024-09-01", note:""},
      {id:"r6b", titolo:"Arabesque n.1",        compositore:"C. Debussy",    periodo:"Moderno",   stato:"in studio",  dataInizio:"2025-01-10", note:"Focus sul colore timbrico"},
    ],
    quote:[
      mkQuote(annoScolasticoAttivo,9, 120,"pagato","2025-09-03"),
      mkQuote(annoScolasticoAttivo,10,120,"pagato","2025-10-07"),
      mkQuote(annoScolasticoAttivo,11,120,"pagato","2025-11-06"),
      mkQuote(annoScolasticoAttivo,12,120,"pagato","2025-12-05"),
      mkQuote(annoScolasticoAttivo,1, 120,"pagato","2026-01-08"),
      mkQuote(annoScolasticoAttivo,2, 120,"pagato","2026-02-06"),
      mkQuote(annoScolasticoAttivo,3, 120,"scaduto",""),
      mkQuote(annoScolasticoAttivo,4, 120,"attesa",""),
    ]
  },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════
// GESTIONE CORSI
// ════════════════════════════════════════════════════════════════════════════════
const CourseForm = ({ initial, onSave, onClose, docenti:_docentiRaw }) => {
  const docenti = _docentiRaw || [];
  const [f, setF] = useState(initial || { name:"", type:"collettivo", description:"", docenti:[] });
  const [err, setErr] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const toggleDocente = (id) => {
    setF(p => {
      const cur = p.docenti || [];
      return { ...p, docenti: cur.includes(id) ? cur.filter(x=>x!==id) : [...cur,id] };
    });
  };

  const handleSave = () => {
    if(!f.name.trim()){ setErr({name:"Nome obbligatorio"}); return; }
    onSave({ ...f, docenti: f.docenti || [] });
  };

  const selDocenti = f.docenti || [];

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:24,display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2570}}
        , React.createElement(Input, { label: "Nome del corso *"   , value: f.name, onChange: e=>set("name",e.target.value), error: err.name, placeholder: "Es. Teoria avanzata, Coro voci bianche..."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2571}})
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2572}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2573}}, "Tipo corso" )
          , React.createElement('div', { style: {display:"flex",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2574}}
            , [["individuale","solo","Individuale","1 allievo per lezione",C.gold,"#e8edf5",C.goldDim],["collettivo","group","Collettivo","Più allievi insieme",C.purple,C.purpleBg,C.purpleBorder]].map(([val,icon,lbl,sub,col,bg,border])=>(
              React.createElement('button', { key: val, onClick: ()=>set("type",val), style: {flex:1,padding:"14px 16px",borderRadius:10,border:`2px solid ${f.type===val?col:C.border}`,background:f.type===val?bg:C.bg,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2576}}
                , React.createElement(Ic, { n: icon, size: 18, color: f.type===val?col:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2577}})
                , React.createElement('div', { style: {textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2578}}
                  , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:f.type===val?col:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2579}}, lbl)
                  , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2580}}, sub)
                )
              )
            ))
          )
        )
        , React.createElement(Textarea, { label: "Descrizione (opzionale)" , value: f.description, onChange: e=>set("description",e.target.value), placeholder: "Breve descrizione del corso..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2586}})

        /* ── Docenti assegnati ── */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2589}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2590}}, "Docenti assegnati"

          )
          , docenti.length === 0 ? (
            React.createElement('p', { style: {fontSize:13,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2594}}, "Nessun docente disponibile. Aggiungine uno dalla sezione "       , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2594}}, "Docenti"), ".")
          ) : (
            React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2596}}
              , docenti.map(d => {
                const sel = selDocenti.includes(d.id);
                return (
                  React.createElement('button', { key: d.id, onClick: ()=>toggleDocente(d.id),
                    style: {display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,
                      border:`2px solid ${sel ? d.colore||C.gold : C.border}`,
                      background: sel ? `${d.colore||C.gold}15` : C.bg,
                      cursor:"pointer",transition:"all 0.15s",textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2600}}
                    , React.createElement('div', { style: {width:34,height:34,borderRadius:"50%",background:`${d.colore||C.gold}25`,
                      border:`1px solid ${d.colore||C.gold}60`,display:"flex",alignItems:"center",
                      justifyContent:"center",fontSize:12,fontWeight:700,color:d.colore||C.gold,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2605}}
                      , initials(d.nome)
                    )
                    , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2610}}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:sel?d.colore||C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2611}}, d.nome)
                      , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2612}}, Array.isArray(d.strumenti) ? d.strumenti.join(", ") : (d.strumenti||"—"))
                    )
                    , React.createElement('div', { style: {width:18,height:18,borderRadius:4,border:`2px solid ${sel?d.colore||C.gold:C.border}`,
                      background:sel?d.colore||C.gold:"transparent",display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2614}}
                      , sel && React.createElement(Ic, { n: "check", size: 10, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2617}})
                    )
                  )
                );
              })
            )
          )
        )
      )
      , React.createElement('div', { style: {padding:"16px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2626}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2627}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2628}}, React.createElement(Ic, { n: "check", size: 14, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2628}}), _optionalChain([initial, 'optionalAccess', _29 => _29.id])?"Salva modifiche":"Crea corso")
      )
    )
  );
};

// ── Scheda dettaglio corso ────────────────────────────────────────────────────
const CourseDetail = ({ course, students, docenti:_docentiRaw, onBack, onEdit, onDelete }) => {
  const docenti = _docentiRaw || [];
  const isIndividuale = course.type === "individuale";
  const col  = isIndividuale ? C.gold   : C.purple;
  const bg   = isIndividuale ? "#e8edf5": C.purpleBg;
  const bord = isIndividuale ? C.goldDim: C.purpleBorder;

  const enrolled = isIndividuale
    ? students.filter(s => s.instrument === course.name)
    : students.filter(s => s.complementaryCourse === course.id);

  const attivi   = enrolled.filter(s=>s.status==="attivo").length;
  const totFee   = enrolled.filter(s=>s.status==="attivo").reduce((sum,s)=>sum+s.monthlyFee,0);

  const crsDocenti = docenti.filter(d => (course.docenti||[]).includes(d.id) || (d.corsi||[]).includes(course.id));

  return (
    React.createElement('div', { style: {animation:"slideIn 0.25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2652}}
      /* Back */
      , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,marginBottom:20,padding:0,fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2654}}
        , React.createElement(Ic, { n: "back", size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2655}}), " Tutti i corsi"
      )

      /* Header */
      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:20,marginBottom:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2659}}
        , React.createElement('div', { style: {width:56,height:56,borderRadius:14,background:bg,border:`2px solid ${bord}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2660}}
          , React.createElement(Ic, { n: isIndividuale?"solo":"group", size: 24, color: col, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2661}})
        )
        , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2663}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2664}}
            , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2665}}, course.name)
            , React.createElement(Badge, { label: course.type, color: isIndividuale?"gold":"purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2666}})
          )
          , course.description && React.createElement('p', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2668}}, course.description)
        )
        , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2670}}
          , onEdit && React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2671}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2671}}), "Modifica")
          , onDelete && React.createElement(Btn, { danger: true, onClick: onDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2672}}, React.createElement(Ic, { n: "trash", size: 14, color: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2672}}))
        )
      )

      /* Statistiche rapide */
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isIndividuale?"repeat(auto-fit,minmax(140px,1fr))":"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2677}}
        , (isIndividuale
          ? [{ label:"Allievi iscritti", value:enrolled.length, sub:"totali" }, { label:"Allievi attivi", value:attivi, sub:"in corso" }, { label:"Incasso mensile", value:`€ ${totFee}`, sub:"allievi attivi" }]
          : [{ label:"Allievi iscritti", value:enrolled.length, sub:"totali" }, { label:"Allievi attivi", value:attivi, sub:"in corso" }]
        ).map(s=>(
          React.createElement('div', { key: s.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2682}}
            , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2683}}, s.label)
            , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,color:col}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2684}}, s.value)
            , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2685}}, s.sub)
          )
        ))
      )

      /* Docenti assegnati */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2691}}
        , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2692}}
          , React.createElement(Ic, { n: "teacher", size: 14, color: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2693}})
          , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2694}}, "Docenti assegnati" )
          , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2695}}, "(", crsDocenti.length, ")")
        )
        , crsDocenti.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center",padding:"32px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2698}}
            , React.createElement('p', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2699}}, "Nessun docente assegnato — clicca "     , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2699}}, "Modifica"), " per assegnarne uno"   )
          )
        ) : (
          React.createElement('div', { style: {padding:16,display:"flex",flexWrap:"wrap",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2702}}
            , crsDocenti.map(d => (
              React.createElement('div', { key: d.id, style: {display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                background:`${d.colore||C.gold}12`,border:`1px solid ${d.colore||C.gold}40`,
                borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2704}}
                , React.createElement('div', { style: {width:32,height:32,borderRadius:"50%",background:`${d.colore||C.gold}25`,
                  border:`1px solid ${d.colore||C.gold}60`,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:12,fontWeight:700,color:d.colore||C.gold,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2707}}
                  , initials(d.nome)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2712}}
                  , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:d.colore||C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2713}}, d.nome)
                  , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2714}}, Array.isArray(d.strumenti) ? d.strumenti.join(", ") : (d.strumenti||"—"))
                )
              )
            ))
          )
        )
      )

      /* Lista allievi */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2723}}
        , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2724}}
          , React.createElement(Ic, { n: "user", size: 14, color: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2725}})
          , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2726}}, "Allievi iscritti" )
          , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2727}}, "(", enrolled.length, ")")
        )

        , enrolled.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2731}}
            , React.createElement(Ic, { n: "user", size: 28, color: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2732}})
            , React.createElement('p', { style: {marginTop:12,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2733}}, "Nessun allievo iscritto a questo corso"     )
          )
        ) : (
          React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2736}}
            , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2737}}
              , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2738}}
                , ["Allievo","Insegnante","Livello","Quota mensile","Stato"].map(h=>(
                  React.createElement('th', { key: h, style: {padding:"11px 20px",textAlign:"left",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2740}}, h)
                ))
              )
            )
            , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2744}}
              , enrolled.map((s,i)=>{
                const ic = INS_COLORS[s.instrument]||C.gold;
                return (
                  React.createElement('tr', { key: s.id, style: {borderBottom:i<enrolled.length-1?`1px solid ${C.border}`:"none",transition:"background 0.12s"},
                    onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                    onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2748}}
                    , React.createElement('td', { style: {padding:"13px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2751}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2752}}
                        , React.createElement('div', { style: {width:34,height:34,borderRadius:"50%",background:`${ic}20`,border:`1px solid ${ic}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:ic,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2753}}
                          , initials(s.name)
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2756}}
                          , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2757}}, s.name)
                          , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2758}}, s.email||"—")
                        )
                      )
                    )
                    , React.createElement('td', { style: {padding:"13px 20px",fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2762}}, s.teacher)
                    , React.createElement('td', { style: {padding:"13px 20px",fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2763}}, s.level||"—")
                    , React.createElement('td', { style: {padding:"13px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2764}}
                      , React.createElement('div', { style: {fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2765}}, "€ " , s.monthlyFee)
                      , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2766}}, s.feeType)
                    )
                    , React.createElement('td', { style: {padding:"13px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2768}}
                      , React.createElement(Badge, { label: s.status, color: s.status==="attivo"?"green":s.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2769}})
                    )
                  )
                );
              })
            )
          )
        )
      )
    )
  );
};

// ── Lista corsi ───────────────────────────────────────────────────────────────
const CourseManager = ({ courses, students, docenti:_docentiRaw, onAdd, onEdit, onDelete, userRuolo:_cmRuolo }) => {
  const docenti = _docentiRaw || [];
  const _ruoloCorsi = _cmRuolo || "admin";
  const [modal,         setModal]         = useState(null);
  const [target,        setTarget]        = useState(null);
  const [selectedCourse,setSelectedCourse]= useState(null);

  const individuali = courses.filter(c=>c.type==="individuale");
  const collettivi  = courses.filter(c=>c.type==="collettivo");

  const studentsIn = c => c.type === "individuale"
    ? students.filter(s => s.instrument === c.name).length
    : students.filter(s => s.complementaryCourse === c.id).length;

  // Se un corso selezionato viene eliminato, torna alla lista
  const handleDelete = (id) => { onDelete(id); setSelectedCourse(null); setModal(null); };

  // Scheda dettaglio corso
  if (selectedCourse) {
    const live = courses.find(c=>c.id===selectedCourse.id) || selectedCourse;
    return (
      React.createElement(React.Fragment, null
        , React.createElement(CourseDetail, {
          course: live,
          students: students,
          docenti: docenti,
          onBack: ()=>setSelectedCourse(null),
          onEdit: onEdit ? ()=>{ setTarget(live); setModal("edit"); } : undefined,
          onDelete: onDelete ? ()=>{ setTarget(live); setModal("delete"); } : undefined, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2804}}
        )
        , modal==="edit"   && target && React.createElement(Modal, { title: "Modifica corso" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2812}}, React.createElement(CourseForm, { initial: target, docenti: docenti, onSave: d=>{onEdit({...target,...d});setSelectedCourse(p=>({...p,...d}));setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2812}}))
        , modal==="delete" && target && React.createElement(ConfirmDelete, { label: target.name, description: "Il corso verrà rimosso. Gli allievi iscritti perderanno l'associazione al corso complementare."           , onConfirm: ()=>handleDelete(target.id), onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2813}})
      )
    );
  }

  const CourseRow = ({ c, badgeColor }) => {
    const n   = studentsIn(c);
    const col = badgeColor==="purple" ? C.purple : C.gold;
    const bg  = badgeColor==="purple" ? C.purpleBg : "#e8edf5";
    const bd  = badgeColor==="purple" ? C.purpleBorder : C.goldDim;
    return (
      React.createElement('div', { onClick: (_ruoloCorsi==="allievo"||_ruoloCorsi==="docente") ? undefined : ()=>setSelectedCourse(c),
        style: {display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,cursor:(_ruoloCorsi==="allievo"||_ruoloCorsi==="docente")?"default":"pointer",transition:"all 0.15s"},
        onMouseEnter: e=>{ e.currentTarget.style.borderColor=col; e.currentTarget.style.background=bg+"55"; },
        onMouseLeave: e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2824}}
        , React.createElement('div', { style: {width:38,height:38,borderRadius:8,background:bg,border:`1px solid ${bd}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2828}}
          , React.createElement(Ic, { n: badgeColor==="purple"?"group":"solo", size: 16, color: col, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2829}})
        )
        , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2831}}
          , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2832}}, c.name)
          , c.description && React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2833}}, c.description)
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2835}}
          /* docenti assegnati — piccole icone */
          , docenti.filter(d=>(d.corsi||[]).includes(c.id)||(c.docenti||[]).includes(d.id)).length > 0 && (
            React.createElement('div', { style: {display:"flex",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2838}}
              , docenti.filter(d=>(d.corsi||[]).includes(c.id)||(c.docenti||[]).includes(d.id)).slice(0,3).map((d,i)=>(
                React.createElement('div', { key: d.id, title: d.nome, style: {width:22,height:22,borderRadius:"50%",background:`${d.colore||C.gold}25`,
                  border:`2px solid ${C.bg}`,marginLeft:i===0?0:-6,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:700,color:d.colore||C.gold,zIndex:3-i}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2840}}
                  , initials(d.nome)
                )
              ))
              , docenti.filter(d=>(d.corsi||[]).includes(c.id)||(c.docenti||[]).includes(d.id)).length > 3 && (
                React.createElement('div', { style: {width:22,height:22,borderRadius:"50%",background:C.surfaceHover,border:`2px solid ${C.bg}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textMuted,marginLeft:-6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2848}}, "+"
                  , docenti.filter(d=>(d.corsi||[]).includes(c.id)||(c.docenti||[]).includes(d.id)).length-3
                )
              )
            )
          )
          , _ruoloCorsi !== "allievo" && React.createElement('span', { style: {background:bg,border:`1px solid ${bd}`,borderRadius:20,padding:"3px 10px",fontSize:12,color:col,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2855}}
            , n, " alliev" , n===1?"o":"i"
          )
          /* azioni — stopPropagation per non aprire la scheda */
          , onEdit && React.createElement('button', { onClick: e=>{e.stopPropagation();setTarget(c);setModal("edit");}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
            onMouseEnter: e=>e.currentTarget.style.color=C.gold, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2859}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2860}}))
          , onDelete && React.createElement('button', { onClick: e=>{e.stopPropagation();setTarget(c);setModal("delete");}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
            onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2861}}, React.createElement(Ic, { n: "trash", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2862}}))
          , _ruoloCorsi !== "allievo" && _ruoloCorsi !== "docente" && React.createElement(Ic, { n: "arrow", size: 16, color: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2863}})
        )
      )
    );
  };

  const SectionTitle = ({ icon, label, count, color }) => (
    React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2870}}
      , React.createElement(Ic, { n: icon, size: 14, color: color, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2871}})
      , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2872}}, label)
      , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2873}}, "(", count, ")")
    )
  );

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2878}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2879}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2880}}
          , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:32,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2881}}, "Gestione Corsi" )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:14,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2882}}, individuali.length, " corsi individuali · "    , collettivi.length, " corsi collettivi"  )
        )
        , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
          , React.createElement(RefreshBtn)
          , onAdd && React.createElement(Btn, { onClick: ()=>setModal("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2884}}, React.createElement(Ic, { n: "plus", size: 14, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2884}}), "Nuovo corso" )
        )
      )

      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24,display:"flex",flexDirection:"column",gap:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2887}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2888}}
          , React.createElement(SectionTitle, { icon: "solo", label: "Corsi Individuali (strumento)"  , count: individuali.length, color: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2889}})
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2890}}
            , individuali.length===0 && React.createElement('div', { style: {fontSize:13,color:C.textDim,padding:"8px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2891}}, "Nessun corso individuale"  )
            , individuali.map(c=>React.createElement(CourseRow, { key: c.id, c: c, badgeColor: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2892}}))
          )
        )
        , React.createElement('div', { style: {borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2895}})
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2896}}
          , React.createElement(SectionTitle, { icon: "group", label: "Corsi Collettivi / Complementari"   , count: collettivi.length, color: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2897}})
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2898}}
            , collettivi.length===0 && React.createElement('div', { style: {fontSize:13,color:C.textDim,padding:"8px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2899}}, "Nessun corso collettivo"  )
            , collettivi.map(c=>React.createElement(CourseRow, { key: c.id, c: c, badgeColor: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2900}}))
          )
        )
      )

      , modal==="add"    && React.createElement(Modal, { title: "Nuovo corso" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2905}}, React.createElement(CourseForm, { docenti: docenti, onSave: d=>{onAdd(d);setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2905}}))
      , onEdit && modal==="edit"   && target && React.createElement(Modal, { title: "Modifica corso" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2906}}, React.createElement(CourseForm, { initial: target, docenti: docenti, onSave: d=>{onEdit({...target,...d});setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2906}}))
      , onDelete && modal==="delete" && target && React.createElement(ConfirmDelete, { label: target.name, description: "Il corso verrà rimosso. Gli allievi iscritti perderanno l'associazione al corso complementare."           , onConfirm: ()=>handleDelete(target.id), onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2907}})
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// FORM ALLIEVO
// ════════════════════════════════════════════════════════════════════════════════
const emptyStudent = { name:"",email:"",phone:"",instrument:"",teacher:"",level:"",status:"attivo",monthlyFee:"",nomeRicevuta:"",feeType:"fisso",birthdate:"",enrollDate:"",complementaryCourse:"",notes:"",extraInstruments:[],extraTeachers:{} };

const validate = f => {
  const e = {};
  if(!f.name.trim()) e.name="Nome obbligatorio";
  if(f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email="Email non valida";
  if(!f.instrument) e.instrument="Strumento obbligatorio";
  if(!f.teacher)    e.teacher="Insegnante obbligatorio";
  if(!f.monthlyFee || isNaN(f.monthlyFee) || Number(f.monthlyFee)<=0) e.monthlyFee="Importo non valido";
  return e;
};

const StudentForm = ({ initial, onSave, onClose, courses, docenti:_docentiFSt, role:_roleSF }) => {
  const roleSF = _roleSF || "admin"; // docente = dati anagrafici readOnly
  const _teacherOpts = (_docentiFSt||[]).map(d=>({value:d.nome||d.name||"",label:d.nome||d.name||""}));
  const [f, setF] = useState(initial || emptyStudent);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const collettivi = (courses||[]).filter(c=>c.type==="collettivo");

  // Strumenti dinamici: nomi dei corsi individuali dal DB + fallback lista statica
  const strumentiDisponibili = React.useMemo(() => {
    const individuali = (courses||[])
      .filter(c => c.type !== "collettivo")
      .map(c => c.name)
      .filter(Boolean);
    // Se ci sono corsi reali usa quelli, altrimenti fallback alla lista statica
    return individuali.length > 0 ? individuali.sort() : INSTRUMENTS;
  }, [courses]);

  const handleSubmit = () => {
    const e = validate(f);
    if(Object.keys(e).length){ setErrors(e); return; }
    onSave({...f, monthlyFee:Number(f.monthlyFee), lessons:f.lessons||[]});
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2942}}

        , React.createElement(SectionDivider, { label: "Dati anagrafici" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2944}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2945}}, React.createElement(Input, { label: roleSF==="docente"?"Nome (sola lettura)":"Nome completo *", value: f.name, onChange: roleSF==="docente"?undefined:e=>set("name",e.target.value), readOnly: roleSF==="docente", error: roleSF==="docente"?undefined:errors.name, placeholder: "Es. Sofia Marchetti", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2945}}))
        , React.createElement(Input, { label: "Email", type: "email", value: f.email, onChange: roleSF==="docente"?undefined:e=>set("email",e.target.value), readOnly: roleSF==="docente", error: roleSF==="docente"?undefined:errors.email, placeholder: "email@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2946}})
        , React.createElement(Input, { label: "Telefono", value: f.phone, onChange: roleSF==="docente"?undefined:e=>set("phone",e.target.value), readOnly: roleSF==="docente", placeholder: "333 1234567", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2947}})
        , React.createElement(Input, { label: "Data di nascita", type: "date", value: f.birthdate, onChange: roleSF==="docente"?undefined:e=>set("birthdate",e.target.value), readOnly: roleSF==="docente", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2948}})
        , React.createElement(Input, { label: "Data iscrizione", type: "date", value: f.enrollDate, onChange: roleSF==="docente"?undefined:e=>set("enrollDate",e.target.value), readOnly: roleSF==="docente", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2949}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2950}}
          , React.createElement(Input, { label: "Nome per ricevuta"  , value: f.nomeRicevuta||"", onChange: e=>set("nomeRicevuta",e.target.value),
            placeholder: f.name||"Lascia vuoto per usare il nome dell'allievo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2951}})
          , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2953}}, "Per allievi minorenni inserire il nome del genitore/tutore intestatario della ricevuta."

          )
        )

        , React.createElement(SectionDivider, { label: "Corsi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2958}})

        /* Corsi principali — strumenti multipli */
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2961}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2962}}, "Corsi principali — strumenti *"    )
          , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:8,marginBottom:8} }
            , strumentiDisponibili.map(i => {
              const isSelected = f.instrument === i || (f.extraInstruments||[]).includes(i);
              return React.createElement('button', { key:i,
                onClick: () => {
                  if(i === f.instrument) {
                    // Rimuovi strumento principale — promuovi il primo extra se esiste
                    const extras = f.extraInstruments||[];
                    if(extras.length > 0) {
                      set("instrument", extras[0]);
                      set("extraInstruments", extras.slice(1));
                    } else {
                      set("instrument", "");
                    }
                  } else if((f.extraInstruments||[]).includes(i)) {
                    // Rimuovi da extra
                    set("extraInstruments", (f.extraInstruments||[]).filter(x=>x!==i));
                  } else if(!f.instrument) {
                    // Imposta come principale
                    set("instrument", i);
                  } else {
                    // Aggiungi agli extra
                    set("extraInstruments", [...(f.extraInstruments||[]), i]);
                  }
                },
                style:{padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:12,
                  fontFamily:"'Open Sans',sans-serif",transition:"all 0.12s",
                  border:`2px solid ${i===f.instrument?C.gold:(f.extraInstruments||[]).includes(i)?C.teal:C.border}`,
                  background:i===f.instrument?C.goldBg:(f.extraInstruments||[]).includes(i)?C.tealBg:C.bg,
                  color:i===f.instrument?C.gold:(f.extraInstruments||[]).includes(i)?C.teal:C.textMuted,
                  fontWeight:isSelected?600:400}}
                , i
                , i===f.instrument && React.createElement('span',{style:{marginLeft:4,fontSize:10,opacity:0.7}},"★")
              );
            })
          )
          , React.createElement('div', {style:{fontSize:11,color:C.textDim,marginTop:4}}
            , "Il primo selezionato (★) è il corso principale. Puoi selezionare più corsi."
          )
          , errors.instrument && React.createElement('span', { style: {fontSize:11,color:C.red,marginTop:4,display:"block"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2973}}, errors.instrument)
        )

        /* Corso complementare — pill selector */
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2977}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2978}}, "Corso complementare — collettivo"   )
          , collettivi.length===0
            ? React.createElement('p', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2980}}, "Nessun corso collettivo disponibile. Creane uno dalla sezione "        , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2980}}, "Corsi"), ".")
            : React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2981}}
                , React.createElement('button', { onClick: ()=>set("complementaryCourse",""),
                  style: {padding:"8px 16px",borderRadius:20,border:`2px solid ${!f.complementaryCourse?C.border:C.border}`,background:!f.complementaryCourse?C.surfaceHover:C.bg,cursor:"pointer",fontSize:13,color:!f.complementaryCourse?C.text:C.textMuted,fontFamily:"'Open Sans',sans-serif",transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2982}}, "Nessuno"

                )
                , collettivi.map(c=>(
                  React.createElement('button', { key: c.id, onClick: ()=>set("complementaryCourse",c.id),
                    style: {padding:"8px 16px",borderRadius:20,border:`2px solid ${f.complementaryCourse===c.id?C.purple:C.border}`,background:f.complementaryCourse===c.id?C.purpleBg:C.bg,cursor:"pointer",fontSize:13,color:f.complementaryCourse===c.id?C.purple:C.textMuted,fontFamily:"'Open Sans',sans-serif",fontWeight:f.complementaryCourse===c.id?500:400,transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2987}}
                    , c.name
                  )
                ))
              )
          
        )

        , React.createElement(SectionDivider, { label: "Didattica", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2996}})

        /* Docente per ogni corso selezionato */
        , (() => {
            // Tutti i corsi selezionati: principale + extra
            const tuttiCorsi = [
              ...(f.instrument ? [{ strumento: f.instrument, isPrincipale: true }] : []),
              ...((f.extraInstruments||[]).map(s => ({ strumento: s, isPrincipale: false }))),
            ];
            if (tuttiCorsi.length === 0) {
              // Nessun corso selezionato — mostra un selettore generico
              return React.createElement(Sel, { label: "Insegnante *", value: f.teacher,
                onChange: e => set("teacher", e.target.value),
                options: _teacherOpts.length > 0 ? _teacherOpts : TEACHERS,
                error: errors.teacher });
            }
            return React.createElement(React.Fragment, null,
              tuttiCorsi.map(({ strumento, isPrincipale }) => {
                const val = isPrincipale ? (f.teacher||"") : ((f.extraTeachers||{})[strumento]||"");
                const label = `Insegnante ${strumento}${isPrincipale ? " ★" : ""}${tuttiCorsi.length > 1 ? "" : " *"}`;
                const baseOpts = _teacherOpts.length > 0 ? _teacherOpts : TEACHERS;
                const opts = [{ value:"", label:"— seleziona docente —" }, ...baseOpts];
                return React.createElement('div', { key: strumento, style: { gridColumn:"1/-1" } },
                  React.createElement('label', { style: {
                    fontSize:12, color: C.textMuted, letterSpacing:"0.06em",
                    textTransform:"uppercase", display:"flex", alignItems:"center",
                    gap:6, marginBottom:6 }}
                    , React.createElement('div', { style: {
                        width:10, height:10, borderRadius:"50%", flexShrink:0,
                        background: isPrincipale ? C.gold : C.teal }})
                    , label
                  )
                  , React.createElement('select', {
                      value: val,
                      onChange: e => {
                        if (isPrincipale) {
                          set("teacher", e.target.value);
                        } else {
                          set("extraTeachers", { ...(f.extraTeachers||{}), [strumento]: e.target.value });
                        }
                      },
                      style: { width:"100%", background:C.bg, border:`1px solid ${isPrincipale&&errors.teacher?C.red:C.border}`,
                        borderRadius:8, color:val?C.text:C.textMuted, fontSize:13, padding:"9px 12px",
                        fontFamily:"'Open Sans',sans-serif", appearance:"none", cursor:"pointer",
                        boxSizing:"border-box" }}
                    , opts.map(o => React.createElement('option', { key: o.value, value: o.value }, o.label))
                  )
                  , isPrincipale && errors.teacher && React.createElement('span', {
                      style: { fontSize:11, color:C.red, marginTop:4, display:"block" }}, errors.teacher)
                );
              })
            );
          })()

        , React.createElement(Sel, { label: "Livello", value: f.level, onChange: e=>set("level",e.target.value), options: LEVELS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2998}})
        , React.createElement(Sel, { label: "Stato", value: f.status, onChange: e=>set("status",e.target.value), options: ["attivo","inattivo","sospeso"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 2999}})

        , React.createElement(SectionDivider, { label: "Quota", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3001}})
        , React.createElement(Input, { label: "Quota mensile (€) *"   , type: "number", value: f.monthlyFee, onChange: e=>set("monthlyFee",e.target.value), error: errors.monthlyFee, placeholder: "100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3002}})
        , React.createElement(Sel, { label: "Tipo quota" , value: f.feeType, onChange: e=>set("feeType",e.target.value), options: ["fisso","variabile"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3003}})

        /* Eccezione soglia lezioni mensili */
        , React.createElement(SectionDivider, { label: "Eccezione soglia lezioni" })
        , React.createElement('div', { style: {gridColumn:"1/-1"} }
          , React.createElement('div', {style:{background:`${C.gold}08`,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:'12px 14px',marginBottom:10,fontSize:12,color:C.textMuted,lineHeight:1.5}}
            , '⚙️ Lascia vuoto per usare le soglie globali delle Impostazioni. Compila solo se questo allievo ha un accordo diverso (es. 5 lezioni/mese).'
          )
        )
        , React.createElement('div', null
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Lezioni individuali / mese (eccezione)')
          , React.createElement('input', {
              type:'number', min:1, max:20,
              value: f.sogliaIndividualeEcc != null ? f.sogliaIndividualeEcc : '',
              placeholder: 'Es. 5 — lascia vuoto per default globale',
              onChange: e => set('sogliaIndividualeEcc', e.target.value === '' ? null : Math.max(1, parseInt(e.target.value)||1)),
              style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif"}
            })
        )
        , React.createElement('div', null
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:6}}, 'Lezioni collettive / mese (eccezione)')
          , React.createElement('input', {
              type:'number', min:1, max:20,
              value: f.sogliaCollettivaEcc != null ? f.sogliaCollettivaEcc : '',
              placeholder: 'Es. 2 — lascia vuoto per default globale',
              onChange: e => set('sogliaCollettivaEcc', e.target.value === '' ? null : Math.max(1, parseInt(e.target.value)||1)),
              style:{width:'100%',boxSizing:'border-box',background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,padding:'9px 12px',fontFamily:"'Open Sans',sans-serif"}
            })
        )

        , React.createElement('div', { style: {gridColumn:"1/-1",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3005}}
          , React.createElement(Textarea, { label: "Note", value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note aggiuntive sull'allievo..."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3006}})
        )
      )
      , React.createElement('div', { style: {padding:"16px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3009}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3010}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSubmit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3011}}, React.createElement(Ic, { n: "check", size: 14, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3011}}), _optionalChain([initial, 'optionalAccess', _30 => _30.id])?"Salva modifiche":"Aggiungi allievo")
      )
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// REGISTRO LEZIONI
// ════════════════════════════════════════════════════════════════════════════════
const LessonLog = ({ lessons:_lessonsRaw, studentId, onAddLesson }) => {
  const lessons = _lessonsRaw || [];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date:new Date().toISOString().split("T")[0], topic:"", attendance:"presente", notes:"" });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const handleAdd = () => {
    if(!form.topic.trim()) return;
    onAddLesson(studentId, {...form});
    setForm({ date:new Date().toISOString().split("T")[0], topic:"", attendance:"presente", notes:"" });
    setShowForm(false);
  };
  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3032}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3033}}
        , React.createElement('h3', { style: {fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3034}}, "Registro Lezioni ("  , lessons.length, ")")
        , React.createElement(Btn, { small: true, onClick: ()=>setShowForm(p=>!p), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3035}}, React.createElement(Ic, { n: "plus", size: 12, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3035}}), "Aggiungi")
      )
      , showForm && (
        React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,animation:"fadeIn 0.2s ease"}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3038}}
          , React.createElement(Input, { label: "Data", type: "date", value: form.date, onChange: e=>set("date",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3039}})
          , React.createElement(Sel, { label: "Presenza", value: form.attendance, onChange: e=>set("attendance",e.target.value), options: ["presente","assente","giustificato"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3040}})
          , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3041}}, React.createElement(Input, { label: "Argomento *" , value: form.topic, onChange: e=>set("topic",e.target.value), placeholder: "Es. Scale maggiori, Bach Invenzione n.1..."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3041}}))
          , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3042}}, React.createElement(Textarea, { label: "Note insegnante" , value: form.notes, onChange: e=>set("notes",e.target.value), placeholder: "Osservazioni, compiti per casa..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3042}}))
          , React.createElement('div', { style: {gridColumn:"1/-1",display:"flex",gap:8,justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3043}}
            , React.createElement(Btn, { small: true, variant: "secondary", onClick: ()=>setShowForm(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3044}}, "Annulla")
            , React.createElement(Btn, { small: true, onClick: handleAdd, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3045}}, React.createElement(Ic, { n: "check", size: 12, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3045}}), "Salva lezione" )
          )
        )
      )
      , lessons.length===0 && !showForm && React.createElement('div', { style: {textAlign:"center",padding:"32px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3049}}, "Nessuna lezione registrata"  )
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3050}}
        , [...lessons].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((l,i)=>(
          React.createElement('div', { key: i, style: {display:"flex",gap:12,padding:"12px 14px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3052}}
            , React.createElement('div', { style: {flexShrink:0,minWidth:72,fontSize:11,color:C.textMuted,paddingTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3053}}, fmtDate(l.date))
            , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3054}}
              , React.createElement('div', { style: {fontSize:14,fontWeight:500,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3055}}, l.topic)
              , l.notes && React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3056}}, l.notes)
            )
            , React.createElement(Badge, { label: l.attendance, color: l.attendance==="presente"?"green":l.attendance==="giustificato"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3058}})
          )
        ))
      )
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SCHEDA DETTAGLIO
// ════════════════════════════════════════════════════════════════════════════════
const StudentDetail = ({ student, courses, lessons:_lessonsRaw, entrate:_allEntrateRaw, setEntrate, annoInizioAttivo, onEdit, onDelete, onBack, onAddLesson, onUpdateStudent, config:propConfig, setConfig:propSetConfig, userRuolo:_sdRuolo }) => {
  const isMobile = useIsMobile();
  const sdRuolo = _sdRuolo || "admin"; // admin | docente | allievo
  const lessons = _lessonsRaw || [];
  const allEntrate = _allEntrateRaw || [];
  const accentHex = INS_COLORS[student.instrument] || C.gold;
  const comp   = courses.find(c => c.id === student.complementaryCourse);

  // Anno scolastico e selettore mese ── tutti gli hook PRIMA di qualsiasi return
  const nowDate   = new Date(today);
  const curYear   = nowDate.getFullYear();
  const curMonth  = nowDate.getMonth() + 1;
  const annoInizio = (() => {
    if (annoInizioAttivo) return Number(annoInizioAttivo);
    return curMonth >= 9 ? curYear : curYear - 1;
  })();
  const MESI_LABEL_L = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const MESI_LABEL_S = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  // Anno scolastico base (Set→Giu). Esteso dinamicamente fino al mese corrente.
  const MESI_AS = [
    {m:9,y:annoInizio},{m:10,y:annoInizio},{m:11,y:annoInizio},{m:12,y:annoInizio},
    {m:1,y:annoInizio+1},{m:2,y:annoInizio+1},{m:3,y:annoInizio+1},
    {m:4,y:annoInizio+1},{m:5,y:annoInizio+1},{m:6,y:annoInizio+1},
  ];
  // Se il mese corrente non è nell'anno scolastico, aggiunge SOLO il mese corrente
  // (non tutti i mesi intermedi — evita di mostrare 19 mesi nel selettore)
  const isCurInAS = MESI_AS.some(x => x.m===curMonth && x.y===curYear);
  if (!isCurInAS) MESI_AS.push({m:curMonth, y:curYear});
  const isFuture = x => new Date(x.y, x.m-1, 1) > new Date(curYear, curMonth-1, 1);
  const defaultSelMese = MESI_AS.find(x => x.m===curMonth && x.y===curYear) || MESI_AS[MESI_AS.length-1];

  const [tab,      setTab]      = useState("info");
  const [selMese,  setSelMese]  = useState(defaultSelMese);
  const [showLezForm, setShowLezForm] = useState(false);
  const [lezForm, setLezForm]   = useState({ date: new Date().toISOString().split("T")[0], topic:"", attendance:"presente", notes:"" });
  const [ricevutaEnt, setRicevutaEnt] = useState(null);
  const [showRecuperoModal, setShowRecuperoModal] = useState(false);
  const [recuperoForm, setRecuperoForm] = useState({ date:"", note:"", lezId:null, lezInfo:null, slotSel:null, ora:"" });

  // Espone hook per aprire il modal dall'esterno (dashboard → AllieviView → StudentDetail)
  React.useEffect(() => {
    window.__FM_OPEN_RECUPERO_MODAL__ = () => {
      setRecuperoForm({ date:"", note:"", lezId:null, lezInfo:null, slotSel:null, ora:"" });
      setShowRecuperoModal(true);
    };
    return () => { window.__FM_OPEN_RECUPERO_MODAL__ = null; };
  }, []);
  const [sortKeyPres, sortDirPres, handleSortPres, sortFnPres] = useSortable("mese", "asc");
  const [sortKeyQuote, sortDirQuote, handleSortQuote, sortFnQuote] = useSortable("mese", "asc");
  const config = _nullishCoalesce(propConfig, () => ( CONFIG_DEFAULT));

  // Lezioni globali per questo allievo — esclude 'recuperata' e lezioni senza data
  const lezStudente = lessons.filter(l => {
    if (!l.date) return false;
    if (l.attendance === 'recuperata') return false;
    return studentInLesson(l, student.name, student.id);
  });
  const lezMese     = (m, y) => lezStudente.filter(l => { const [ly,lm] = (l.date||'').split("-").map(Number); return ly===y && lm===m; });
  const lezSel      = lezMese(selMese.m, selMese.y);

  // Lezioni da recuperare (inRecupero=true oppure attendance='in_recupero')
  const lezioniDaRecuperare = lezStudente.filter(l => l.inRecupero === true || l.attendance === 'in_recupero');

  // ── Calcola slot disponibili per recupero (aggiorna quando cambia la lezione selezionata) ──
  const slotsRecuperoDisp = React.useMemo(() => {
    if (!recuperoForm.lezId) return [];
    const lezInfo = lezioniDaRecuperare.find(l => l.id === recuperoForm.lezId);
    if (!lezInfo) return [];
    const docName = ((lezInfo.teacher || student.teacher) || "").toLowerCase().trim();
    const allDocenti = window.__docenti__ || [];
    const docRecord = docName
      ? allDocenti.find(function(d) {
          var tk = (d.teacherKey||"").toLowerCase().trim();
          var nm = (d.nome||"").toLowerCase().trim();
          return tk === docName || nm === docName ||
                 tk.indexOf(docName) >= 0 || docName.indexOf(tk) >= 0 ||
                 nm.indexOf(docName) >= 0 || docName.indexOf(nm) >= 0;
        })
      : null;
    var rawDisp = docRecord ? (docRecord.disponibilitaRecuperi || []) : [];
    var disp = typeof rawDisp === "string"
      ? (function(){ try{ return JSON.parse(rawDisp); } catch(e){ return []; } })()
      : (Array.isArray(rawDisp) ? rawDisp : []);
    if (!disp.length) return [];

    var durataMin = lezInfo.durata || 45;
    var toMin = function(t) { var parts = (t||"0:0").split(":"); return parseInt(parts[0])*60 + (parseInt(parts[1])||0); };
    var toStr = function(m) { return String(Math.floor(m/60)).padStart(2,"0") + ":" + String(m%60).padStart(2,"0"); };

    // Limiti temporali: domani → fine mese corrente (i recuperi decadono a fine mese)
    var oggi_s = new Date(); oggi_s.setHours(0,0,0,0);
    var domani = new Date(oggi_s); domani.setDate(domani.getDate() + 1);
    var fineMese = new Date(oggi_s.getFullYear(), oggi_s.getMonth() + 1, 0); // ultimo giorno del mese
    fineMese.setHours(23,59,59,0);

    // Mappa nomi giorno IT → indice JS (0=dom, 1=lun, ...)
    // getDay(): 0=dom,1=lun,2=mar,3=mer,4=gio,5=ven,6=sab
    var giornoToIdx = {
      "domenica":0, "lunedi":1, "lunedì":1,
      "martedi":2,  "martedì":2,
      "mercoledi":3,"mercoledì":3,
      "giovedi":4,  "giovedì":4,
      "venerdi":5,  "venerdì":5,
      "sabato":6
    };

    var risultato = [];

    for (var si = 0; si < disp.length; si++) {
      var slot = disp[si];
      var giornoNorm = (slot.giorno||"").toLowerCase().trim();
      var targetDow = giornoToIdx[giornoNorm]; // indice giorno della settimana
      if (targetDow === undefined) continue;

      // Itera ogni giorno da domani fino alla fine del mese
      var cursor = new Date(domani);
      while (cursor <= fineMese) {
        if (cursor.getDay() === targetDow) {
          var dataStr = cursor.getFullYear() + "-" +
            String(cursor.getMonth()+1).padStart(2,"0") + "-" +
            String(cursor.getDate()).padStart(2,"0");
          var cur = toMin(slot.oraInizio);
          var end = toMin(slot.oraFine);
          while (cur + durataMin <= end) {
            risultato.push({
              data: dataStr,
              giorno: slot.giorno,
              oraInizio: toStr(cur),
              oraFine: toStr(cur + durataMin),
              key: dataStr + "_" + toStr(cur),
            });
            cur += durataMin;
          }
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    risultato.sort(function(a,b){ return a.key < b.key ? -1 : a.key > b.key ? 1 : 0; });

    // Segna gli slot occupati (conflitti sala o docente)
    var tutteLezioni = lessons || [];
    risultato = risultato.map(function(s) {
      var oraIniMin = toMin(s.oraInizio);
      var oraFinMin = toMin(s.oraFine);
      var conflitto = tutteLezioni.some(function(l) {
        if (l.date !== s.data) return false;
        if (!l.hour) return false;
        var lIni = toMin(l.hour);
        var lFin = lIni + (l.durata || 45);
        // Sovrapposizione temporale
        var sovrappone = oraIniMin < lFin && oraFinMin > lIni;
        if (!sovrappone) return false;
        // Stesso docente?
        var stessoDoc = lezInfo && l.teacher && (l.teacher||"").toLowerCase() === (lezInfo.teacher||"").toLowerCase();
        // Stessa sala (se valorizzata)?
        var stessaSala = lezInfo && lezInfo.room && l.room && l.room === lezInfo.room;
        return stessoDoc || stessaSala;
      });
      return Object.assign({}, s, { occupato: conflitto });
    });

    return risultato;
  }, [recuperoForm.lezId, student.teacher, lessons]);

  // Andamento anno per grafici
  const andamento = MESI_AS.map(x => {
    const n = lezMese(x.m, x.y).length;
    return { label: MESI_LABEL_S[x.m-1], n, m:x.m, y:x.y,
             isSel: x.m===selMese.m && x.y===selMese.y, isFut: isFuture(x) };
  });
  const maxN = Math.max(...andamento.map(x => x.n), 1);

  // Quote anno scolastico corrente
  // Quote: leggiamo da sharedEntrate (fonte unica di verità)
  const entrateStudent = allEntrate.filter(e =>
    (String(e.studentId)===String(student.id) ||
     (e.studentName||'').toLowerCase().trim()===(student.name||'').toLowerCase().trim()) &&
    MESI_AS.some(x => x.m === e.mese && x.y === e.anno)
  );
  const totaleVersato   = entrateStudent.reduce((t,e) => t + e.importo, 0);
  const entrataPerMese  = (m, y) => entrateStudent.find(e => e.mese===m && e.anno===y);

  // Repertorio
  const repertorio = student.repertorio || [];
  const repInStudio   = repertorio.filter(r => r.stato === "in studio");
  const repCompletato = repertorio.filter(r => r.stato === "completato");

  // Selettore mese UI
  const MeseSelector = () => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3127}}
      , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3128}}, "Anno scolastico "
          , annoInizio, "/", String(annoInizio+1).slice(-2)
      )
      , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3131}}
        , MESI_AS.map(x => {
          const isS  = x.m===selMese.m && x.y===selMese.y;
          const isF  = isFuture(x);
          const hasD = lezMese(x.m, x.y).length > 0;
          return (
            React.createElement('button', { key: `${x.y}-${x.m}`, onClick: ()=>!isF && setSelMese(x), disabled: isF,
              style: {padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:isS?600:400,
                border:`1px solid ${isS?accentHex:hasD?accentHex+"50":C.border}`,
                background:isS?accentHex:hasD?accentHex+"15":C.bg,
                color:isS?C.bg:isF?C.textDim:hasD?accentHex:C.textMuted,
                cursor:isF?"not-allowed":"pointer",opacity:isF?0.4:1,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3137}}
              , MESI_LABEL_S[x.m-1]
              , hasD && !isF && React.createElement('span', { style: {display:"inline-block",width:4,height:4,borderRadius:"50%",
                background:isS?C.bg:accentHex,marginLeft:5,verticalAlign:"middle"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3144}})
            )
          );
        })
      )
    )
  );

  // Grafico barre anno scolastico
  const GraficoAS = () => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3155}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3156}}
        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3157}}, "Andamento anno scolastico"  )
        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3158}}, "Totale: " , andamento.reduce((t,x)=>t+x.n,0), " lezioni" )
      )
      , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3160}}
        , andamento.map(x => (
          React.createElement('div', { key: `${x.y}-${x.m}`, onClick: ()=>!x.isFut && setSelMese({m:x.m,y:x.y}),
            style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:x.isFut?"default":"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3162}}
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?accentHex:C.textDim,fontWeight:x.isSel?700:400,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3164}}
              , x.isFut?"":x.n||""
            )
            , React.createElement('div', { style: {width:"100%",borderRadius:"3px 3px 0 0",minHeight:4,
              background:x.isFut?C.border:x.isSel?accentHex:`${accentHex}45`,
              height:`${x.isFut?4:Math.round((x.n/maxN)*60)+4}px`,
              outline:x.isSel?`2px solid ${accentHex}`:"none",outlineOffset:1,transition:"all 0.2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3167}})
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?accentHex:C.textDim,textTransform:"uppercase",fontWeight:x.isSel?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3171}}, x.label)
          )
        ))
      )
    )
  );

  // ── handlers quote — scrivono su sharedEntrate ──
  const registraPagamento = (m, y) => {
    const MESI_ALL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    const progressivo = (config && config.progressivoRicevute) || 1;
    const numRicevuta = String(progressivo).padStart(3,"0") + "/" + y;
    const newE = {
      id: uid(), studentId:student.id, studentName:student.name,
      importo: student.monthlyFee, mese:m, anno:y,
      data: new Date().toISOString().split("T")[0],
      metodo:"Contanti",
      desc:`Quota mensile ${MESI_ALL[m-1]} ${y} — ${student.name}`,
      stato:"pagato",
      numRicevuta,
      dataPagamento: new Date().toISOString().split("T")[0],
    };
    setEntrate(p=>[...p,newE]);
    // Incrementa progressivo ricevute nella config
    if (propSetConfig) {
      propSetConfig(prev => ({...prev, progressivoRicevute: progressivo + 1}));
    }
    // Mostra anteprima ricevuta
    setRicevutaEnt(newE);
  };
  const eliminaPagamento = (id) => setEntrate(p=>p.filter(e=>e.id!==id));

  const TABS = [
    {id:"info",       label:"Informazioni", icon:"user"},
    {id:"lezioni",    label:"Lezioni",      icon:"calendar"},
    // Repertorio: nascosto in PWA per snellire la navigazione
    ...(IS_PWA ? [] : [{id:"repertorio", label:"Repertorio", icon:"music"}]),
    // Quote: visibile solo ad admin e allievo (non al docente)
    ...(sdRuolo !== "docente" ? [{id:"quote", label:"Quote", icon:"euro"}] : []),
  ];

  return (
    React.createElement('div', { style: {animation:"slideIn 0.25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3200}}
      , onBack && React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,marginBottom:20,padding:0,fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3201}}
        , React.createElement(Ic, { n: "back", size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3202}}), " Tutti gli allievi"
      )

      /* Header */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,marginBottom:24,padding:"16px 20px",borderTop:`3px solid ${accentHex}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3206}}
        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3207}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3208}}
            , React.createElement('div', { style: {width:60,height:60,borderRadius:"50%",background:`${accentHex}20`,border:`2px solid ${accentHex}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,accentHex,fontFamily:"'Oswald',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3209}}
              , initials(student.name)
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3212}}
              , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3213}}, student.name)
              , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3214}}
                /* Strumento principale (stella) */
                , React.createElement('span', {style:{display:"inline-flex",alignItems:"center",gap:4}}
                  , React.createElement('span',{style:{color:C.gold,fontSize:11}}, "★")
                  , React.createElement(Badge, { label: student.instrument, accentHex: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3215}})
                )
                /* Strumenti extra */
                , (student.extraInstruments||[]).map(ins =>
                    React.createElement(Badge, {key:ins, label:ins, accentHex:"teal"})
                  )
                /* Corso complementare */
                , comp && React.createElement('span', {style:{display:"inline-flex",alignItems:"center",gap:4}}
                    , React.createElement(Badge, { label: comp.name, accentHex: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3216}})
                  )
                , React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3217}}, "·")
                , React.createElement('span', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3218}}, student.teacher)
                , React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3219}}, "·")
                , React.createElement(Badge, { label: student.status, accentHex: student.status==="attivo"?"green":student.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3220}})
              )
            )
          )
          , sdRuolo !== "docente" && React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3224}}
            , sdRuolo === "allievo" && React.createElement('button', {
                onClick: lezioniDaRecuperare.length > 0 ? () => { setRecuperoForm({ date: "", note: "", lezId: null, lezInfo: null }); setShowRecuperoModal(true); } : undefined,
                disabled: lezioniDaRecuperare.length === 0,
                title: lezioniDaRecuperare.length === 0 ? "Nessuna lezione da recuperare al momento" : `${lezioniDaRecuperare.length} lezione/i da recuperare`,
                style: {display:"flex",alignItems:"center",gap:6,padding:"8px 14px",
                  background: lezioniDaRecuperare.length > 0 ? C.purpleBg : C.surface,
                  border:`1px solid ${lezioniDaRecuperare.length > 0 ? C.purpleBorder : C.border}`,
                  borderRadius:8, cursor: lezioniDaRecuperare.length > 0 ? "pointer" : "default",
                  fontFamily:"'Open Sans',sans-serif", fontSize:13,
                  color: lezioniDaRecuperare.length > 0 ? C.purple : C.textDim,
                  fontWeight: lezioniDaRecuperare.length > 0 ? 600 : 400,
                  opacity: lezioniDaRecuperare.length === 0 ? 0.6 : 1,
                  transition:"all 0.15s"},
                onMouseEnter: lezioniDaRecuperare.length > 0 ? e=>{e.currentTarget.style.background=C.purple;e.currentTarget.style.color="#fff";} : undefined,
                onMouseLeave: lezioniDaRecuperare.length > 0 ? e=>{e.currentTarget.style.background=C.purpleBg;e.currentTarget.style.color=C.purple;} : undefined
              }
              , React.createElement(Ic, {n:"calendar", size:14, stroke: lezioniDaRecuperare.length > 0 ? C.purple : C.textDim})
              , lezioniDaRecuperare.length > 0
                  ? `Prenota recupero (${lezioniDaRecuperare.length})`
                  : "Nessun recupero"
            )
            , sdRuolo !== "allievo" && React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3225}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3225}}), "Modifica")
            , sdRuolo !== "allievo" && React.createElement(Btn, { danger: true, onClick: onDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3226}}, React.createElement(Ic, { n: "trash", size: 14, accentHex: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3226}}))
          )
        )
        /* KPI strip — aggiornano col mese selezionato */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:isMobile?10:12,marginTop:20,paddingTop:20,borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3230}}
          , [
            // Quota mensile e Versato anno: nascosti al docente
            ...(sdRuolo !== "docente" ? [
              {label:"Quota mensile",      value:`€ ${student.monthlyFee}`,    sub:student.feeType,   hex:C.gold},
            ] : []),
            {label:`Lez. ${MESI_LABEL_S[selMese.m-1]}`, value:lezSel.length,  sub:"lezioni",          hex:accentHex},
            {label:"Brani in studio",      value:repInStudio.length,           sub:"repertorio",       hex:C.purple},
            ...(sdRuolo !== "docente" ? [
              {label:"Versato anno",       value:`€ ${totaleVersato}`,         sub:`${entrateStudent.length} rate pagate`, hex:C.green},
            ] : []),
          ].map(k => (
            React.createElement('div', { key: k.label, style: {background:C.bg,borderRadius:10,padding:"12px 16px",border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3237}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3238}}, k.value)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3239}}, k.label)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3240}}, k.sub)
            )
          ))
        )
      )

      /* Tabs */
      , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3247}}
        , TABS.map(t => (
          React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id),
            style: {display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:"none",
              border:"none",borderBottom:`2px solid ${tab===t.id?accentHex:"transparent"}`,
              color:tab===t.id?accentHex:C.textMuted,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",
              fontSize:13,transition:"all 0.15s",marginBottom:-1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3249}}
            , React.createElement(Ic, { n: t.icon, size: 13, stroke: tab===t.id?accentHex:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3254}}), t.label
          )
        ))
      )

      /* ── INFORMAZIONI ── */
      , tab==="info" && (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3261}}
          , [
            // email e telefono: solo admin/allievo, non docente
            ...(sdRuolo !== "docente" ? [
              {icon:"mail",    label:"Email",       value:student.email||"—"},
              {icon:"phone",   label:"Telefono",     value:student.phone||"—"},
            ] : []),
            {icon:"user",    label:"Età",          value:student.birthdate?`${age(student.birthdate)} anni`:"—"},
            {icon:"music",   label:"Livello",      value:student.level||"—"},
            {icon:"calendar",label:"Iscritto dal", value:fmtDate(student.enrollDate)||"—"},
            // quota mensile: solo admin/allievo, non docente
            ...(sdRuolo !== "docente" ? [
              {icon:"euro",    label:"Quota mensile",value:`€ ${student.monthlyFee} (${student.feeType})`},
            ] : []),
          ].map(r => (
            React.createElement('div', { key: r.label, style: {display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3270}}
              , React.createElement(Ic, { n: r.icon, size: 16, accentHex: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3271}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3272}}
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3273}}, r.label)
                , React.createElement('div', { style: {fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3274}}, r.value)
              )
            )
          ))
          , comp && (
            React.createElement('div', { style: {display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",background:C.purpleBg,border:`1px solid ${C.purpleBorder}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3279}}
              , React.createElement(Ic, { n: "group", size: 16, accentHex: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3280}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3281}}
                , React.createElement('div', { style: {fontSize:11,color:C.purple,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3,opacity:0.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3282}}, "Corso complementare" )
                , React.createElement('div', { style: {fontSize:14,color:C.purple,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3283}}, comp.name)
                , comp.description && React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3284}}, comp.description)
              )
            )
          )
          , student.notes && sdRuolo !== "docente" && (
            React.createElement('div', { style: {gridColumn:"1/-1",padding:"14px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3289}}
              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3290}}, "Note")
              , React.createElement('div', { style: {fontSize:13,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3291}}, student.notes)
            )
          )
        )
      )

      /* ── LEZIONI ── */
      , tab==="lezioni" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3299}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3300}})
          , React.createElement(GraficoAS, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3301}})
          /* Lista lezioni mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3303}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3304}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3305}}
                , React.createElement(Ic, { n: "calendar", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3306}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3307}}
                  , MESI_LABEL_L[selMese.m-1], " " , selMese.y
                )
              )
              , React.createElement('div', { style: {display:"flex",gap:10,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3311}}
                , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3312}}, lezSel.length, " lezioni" )
                , lezSel.filter(l=>l.attendance==="presente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3314}}
                    , lezSel.filter(l=>l.attendance==="presente").length, " pres."
                  )
                )
                , lezSel.filter(l=>l.attendance==="assente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3319}}
                    , lezSel.filter(l=>l.attendance==="assente").length, " ass."
                  )
                )
              )
            )
            , lezSel.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"40px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3326}}
                , isFuture(selMese)?"Mese non ancora iniziato":"Nessuna lezione registrata"
              )
            ) : (
              lezSel.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.hour.localeCompare(b.hour)).map((l,i) => (
                React.createElement('div', { key: l.id, style: {display:"grid",gridTemplateColumns:"90px 1fr auto",gap:12,alignItems:"center",
                  padding:"12px 20px",borderBottom:i<lezSel.length-1?`1px solid ${C.border}`:"none",
                  borderLeft:`3px solid ${isColl(l)?C.purple:"transparent"}`,
                  background:isColl(l)?`${C.purple}06`:"transparent"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3331}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3335}}
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3336}}, new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}))
                    , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:isColl(l)?C.purple:accentHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3337}}, l.hour)
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3339}}
                    , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3340}}
                      , React.createElement('span', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3341}}
                        , isColl(l)
                          ? (l.courseName || l.courseId || "Lezione collettiva")
                          : (l.topic || l.instrument || "—")
                      )
                      , isColl(l) && React.createElement('span', { style: {fontSize:10,background:C.purpleBg,color:C.purple,
                        border:`1px solid ${C.purpleBorder}`,borderRadius:4,padding:"1px 6px",letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3342}}, "collettiva")
                    )
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3345}}
                      , isColl(l)
                        ? `${(l.students||[]).length} allievi · ${l.room||"—"} · ${l.teacher||"—"}`
                        : `${l.instrument||"—"} · ${l.room||"—"} · ${l.teacher||"—"}`
                    )
                  )
                  , l.attendance
                    ? React.createElement(Badge, { label: l.attendance, accentHex: l.attendance==="presente"?"green":l.attendance==="assente"?"red":"gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3352}})
                    : React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3353}}, "—")
                  
                )
              ))
            )
          )
          /* Tabella riepilogo anno */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3360}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3361}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3362}}, "Riepilogo anno scolastico"  )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3364}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3365}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3366}}
                  , React.createElement(SortTh,{label:"Mese",         sortKey:"mese",    currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Lezioni",      sortKey:"tot",     currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Presenti",     sortKey:"pres",    currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Assenti",      sortKey:"ass",     currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Giustificati", sortKey:"giust",   currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Da recuperare",sortKey:"rec",     currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Tasso pres.",  sortKey:"tasso",   currentKey:sortKeyPres, dir:sortDirPres, onSort:handleSortPres, style:{padding:"10px 18px",fontSize:10}})
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3372}}
                , sortFnPres(MESI_AS.map((x,i) => {
                  const lm   = lezMese(x.m, x.y);
                  const pres = lm.filter(l=>l.attendance==="presente").length;
                  const ass  = lm.filter(l=>l.attendance==="assente").length;
                  const giust= lm.filter(l=>l.attendance==="giustificato").length;
                  const rec  = lm.filter(l=>l.inRecupero).length;
                  const att  = lm.filter(l=>l.attendance).length;
                  const tasso= att>0 ? Math.round((pres/att)*100) : null;
                  return { x, i, lm, pres, ass, giust, rec, att, tasso, mese: x.y*100+x.m, tot: lm.length };
                }), (r,k) => {
                  if(k==="mese")  return r.mese;
                  if(k==="tot")   return r.tot;
                  if(k==="pres")  return r.pres;
                  if(k==="ass")   return r.ass;
                  if(k==="giust") return r.giust;
                  if(k==="rec")   return r.rec;
                  if(k==="tasso") return r.tasso ?? -1;
                  return 0;
                }).map(({x,i,lm,pres,ass,giust,rec,att,tasso}) => {
                  const isF  = isFuture(x);
                  const isS  = x.m===selMese.m && x.y===selMese.y;
                  return (
                    React.createElement('tr', { key: `${x.y}-${x.m}`, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:`1px solid ${C.border}`,
                        background:isS?`${accentHex}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${accentHex}12`:"transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3382}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?accentHex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3388}}
                        , MESI_LABEL_L[x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:isF?C.textDim:lm.length>0?accentHex:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3391}}
                        , isF?"—":lm.length
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}}, isF?"—":pres||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:ass>0?C.red:C.textDim}}, isF?"—":ass||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:giust>0?C.gold:C.textDim}}, isF?"—":giust||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:rec>0?C.orange:C.textDim}}, isF?"—":rec||"—")
                      , React.createElement('td', { style: {padding:"11px 18px"}}
                        , !isF && tasso!==null ? (
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
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3410}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3411}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3412}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,accentHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3413}}
                    , andamento.reduce((t,x)=>t+x.n,0)
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3416}}
                    , andamento.reduce((t,x)=>t+lezMese(x.m,x.y).filter(l=>l.attendance==="presente").length,0)
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3419}}
                    , andamento.reduce((t,x)=>t+lezMese(x.m,x.y).filter(l=>l.attendance==="assente").length,0)
                  )
                  , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3422}})
                )
              )
            )
          )
        )
      )

      /* ── REPERTORIO ── */
      , tab==="repertorio" && (
        React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3432}}
          /* KPI strip */
          , React.createElement('div', { className: "stat-strip-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3434}}
            , [
              {label:"In studio",    value:repInStudio.length,   hex:accentHex,   sub:"brani correnti"},
              {label:"Completati",   value:repCompletato.length, hex:C.green, sub:"studiati quest'anno"},
              {label:"Totale",       value:repertorio.length,    hex:C.textMuted, sub:"nel registro"},
            ].map(k => (
              React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px",borderTop:`3px solid ${k.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3440}}
                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3441}}, k.value)
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3442}}, k.label)
                , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3443}}, k.sub)
              )
            ))
          )

          /* Brani in studio */
          , repInStudio.length > 0 && (
            React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3450}}
              , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3451}}
                , React.createElement('div', { style: {width:8,height:8,borderRadius:"50%",background:accentHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3452}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3453}}, "In studio" )
              )
              , repInStudio.map((b,i) => (
                React.createElement('div', { key: b.id, style: {padding:"14px 20px",borderBottom:i<repInStudio.length-1?`1px solid ${C.border}`:"none",
                  display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3456}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3458}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:600,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3459}}, b.titolo)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3460}}, b.compositore, " · "  , React.createElement('span', { style: {color:`${accentHex}cc`,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3460}}, b.periodo))
                    , b.note && React.createElement('div', { style: {fontSize:12,color:C.textDim,marginTop:4,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3461}}, b.note)
                  )
                  , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3463}}
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3464}}, "dal " , fmtDate(b.dataInizio))
                    , React.createElement('span', { style: {display:"inline-block",marginTop:4,fontSize:10,background:`${accentHex}20`,accentHex,border:`1px solid ${accentHex}50`,borderRadius:4,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3465}}, "in studio" )
                  )
                )
              ))
            )
          )

          /* Brani completati */
          , repCompletato.length > 0 && (
            React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3474}}
              , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3475}}
                , React.createElement('div', { style: {width:8,height:8,borderRadius:"50%",background:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3476}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3477}}, "Completati")
              )
              , repCompletato.map((b,i) => (
                React.createElement('div', { key: b.id, style: {padding:"14px 20px",borderBottom:i<repCompletato.length-1?`1px solid ${C.border}`:"none",
                  display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start",opacity:0.75}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3480}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3482}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:500,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3483}}, b.titolo)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3484}}, b.compositore, " · "  , React.createElement('span', { style: {fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3484}}, b.periodo))
                    , b.note && React.createElement('div', { style: {fontSize:12,color:C.textDim,marginTop:4,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3485}}, b.note)
                  )
                  , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3487}}
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3488}}, "dal " , fmtDate(b.dataInizio))
                    , React.createElement('span', { style: {display:"inline-block",marginTop:4,fontSize:10,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3489}}, "completato")
                  )
                )
              ))
            )
          )

          , repertorio.length === 0 && (
            React.createElement('div', { style: {textAlign:"center",padding:"56px 0",color:C.textDim,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3497}}, "Nessun brano nel registro"

            )
          )
        )
      )

      /* ── QUOTE ── */
      , tab==="quote" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3506}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3507}})
          /* Grafico a barre entrate anno scolastico */
          , (() => {
            const vals = MESI_AS.map(x=>_optionalChain([entrataPerMese, 'call', _31 => _31(x.m,x.y), 'optionalAccess', _32 => _32.importo])||0);
            const maxV = Math.max(...vals, 1);
            const totAnno = vals.reduce((t,v)=>t+v,0);
            const MESI_S2 = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag","Giu"];
            return (
              React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3515}}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3516}}
                  , React.createElement('span', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3517}}, "Andamento anno scolastico"  )
                  , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3518}}, "Totale incassato: €"  , totAnno.toLocaleString("it-IT"))
                )
                , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3520}}
                  , MESI_AS.map((x,i)=>{
                    const isS=x.m===selMese.m&&x.y===selMese.y, isF=isFuture(x);
                    const v=vals[i], h=isF?4:Math.round((v/maxV)*64)+4;
                    return (
                      React.createElement('div', { key: i, onClick: ()=>!isF&&setSelMese(x),
                        style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:isF?"default":"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3525}}
                        , React.createElement('div', { style: {fontSize:9,color:isS?accentHex:C.textDim,fontWeight:isS?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3527}}, (!isF&&v>0)?`€${v}`:"")
                        , React.createElement('div', { style: {width:"100%",borderRadius:"3px 3px 0 0",minHeight:4,height:h,
                          background:isF?C.border:isS?accentHex:`${accentHex}45`,
                          outline:isS?`2px solid ${accentHex}`:"none",outlineOffset:1,transition:"all 0.2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3528}})
                        , React.createElement('div', { style: {fontSize:9,color:isS?accentHex:C.textDim,textTransform:"uppercase",fontWeight:isS?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3531}}, MESI_S2[i])
                      )
                    );
                  })
                )
              )
            );
          })()
          /* KPI mese selezionato */
          , (() => {
            const entSel  = entrataPerMese(selMese.m, selMese.y);
            const pm = selMese.m===1?12:selMese.m-1, py = selMese.m===1?selMese.y-1:selMese.y;
            const entPrev = entrataPerMese(pm, py);
            const MESI_ALL2 = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
            const MESI_S3 = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
            return (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3548}}
                  , [
                    {label:"Quota mensile",           value:`€${student.monthlyFee}`,         desc:student.feeType,      hex:accentHex},
                    {label:`Stato ${MESI_S3[selMese.m-1]} ${selMese.y}`,
                     value: entSel?"Pagata":"Non pagata",
                     desc:  entSel?`il ${new Date(entSel.data+"T00:00:00").toLocaleDateString("it-IT")}`:
                            isFuture(selMese)?"mese futuro":"quota mancante",
                     hex:   entSel?C.green:isFuture(selMese)?C.textDim:C.red},
                    {label:`Incassato ${MESI_S3[selMese.m-1]}`,
                     value: entSel?`€${entSel.importo.toLocaleString("it-IT")}`:"—",
                     desc:  entPrev?`mese prec.: €${entPrev.importo}`:"primo mese",
                     hex:   entSel?C.green:C.textDim},
                  ].map(k=>(
                    React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${k.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3561}}
                      , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,color:k.hex,lineHeight:1,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3562}}, k.value)
                      , React.createElement('div', { style: {fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3563}}, k.label)
                      , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3564}}, k.desc)
                    )
                  ))
                )
                /* Dettaglio mese selezionato */
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3569}}
                  , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,
                    display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3570}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3572}}, "Dettaglio "
                       , MESI_ALL2[selMese.m-1], " " , selMese.y
                    )
                    , React.createElement('span', { style: {fontSize:13,fontWeight:600,color:entSel?C.green:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3575}}
                      , entSel?`€${entSel.importo.toLocaleString("it-IT")}`:"Non pagata"
                    )
                  )
                  , entSel ? (
                    React.createElement('div', { style: {display:"grid",gridTemplateColumns:"80px 1fr auto",gap:12,alignItems:"center",padding:"14px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3580}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3581}}
                        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3582}}, new Date(entSel.data+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}))
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3584}}
                        , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3585}}, entSel.desc)
                        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3586}}, entSel.metodo)
                      )
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3588}}
                        , React.createElement('div', { style: {fontSize:15,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3589}}, "€", entSel.importo)
                        , React.createElement('button', { onClick: ()=>setRicevutaEnt(entSel), title: "Stampa ricevuta" ,
                          style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:6,
                            cursor:"pointer",color:C.gold,padding:"4px 8px",display:"flex",alignItems:"center",gap:4,fontSize:11},
                          onMouseEnter: e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg;},
                          onMouseLeave: e=>{e.currentTarget.style.background=C.goldBg;e.currentTarget.style.color=C.gold;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3590}}
                          , React.createElement(Ic, { n: "receipt", size: 12, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3595}}), "Ricevuta"
                        )
                        , React.createElement('button', { onClick: ()=>eliminaPagamento(entSel.id),
                          style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                          onMouseEnter: e=>e.currentTarget.style.color=C.red,
                          onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3597}}
                          , React.createElement(Ic, { n: "trash", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3601}})
                        )
                      )
                    )
                  ) : (
                    React.createElement('div', { style: {padding:"24px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3606}}
                      , React.createElement('span', { style: {fontSize:13,color:C.textDim,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3607}}
                        , isFuture(selMese)?"Mese non ancora iniziato":"Quota non registrata"
                      )
                      , !isFuture(selMese) && sdRuolo !== "allievo" && (
                        React.createElement('button', { onClick: ()=>registraPagamento(selMese.m,selMese.y),
                          style: {padding:"8px 18px",borderRadius:8,cursor:"pointer",
                            background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,
                            fontFamily:"'Open Sans',sans-serif",fontSize:13,fontWeight:500,
                            display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3611}}
                          , React.createElement(Ic, { n: "check", size: 14, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3616}}), "Registra pagamento"
                        )
                      )
                    )
                  )
                )
              )
            );
          })()
          /* Tabella quote anno scolastico */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3626}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3627}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3628}}, "Quote anno scolastico "
                   , annoInizio, "/", String(annoInizio+1).slice(-2)
              )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3632}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3633}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3634}}
                  , React.createElement(SortTh,{label:"Mese",         sortKey:"mese",    currentKey:sortKeyQuote, dir:sortDirQuote, onSort:handleSortQuote, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Importo",      sortKey:"importo", currentKey:sortKeyQuote, dir:sortDirQuote, onSort:handleSortQuote, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement(SortTh,{label:"Stato",        sortKey:"stato",   currentKey:sortKeyQuote, dir:sortDirQuote, onSort:handleSortQuote, style:{padding:"10px 18px",fontSize:10}})
                  , React.createElement('th', {style:{padding:"10px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}}, "vs mese prec.")
                  , React.createElement('th', {style:{padding:"10px 18px"}})
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3640}}
                , sortFnQuote(MESI_AS.map((x,i)=>{
                  const pm = x.m===1?12:x.m-1, py = x.m===1?x.y-1:x.y;
                  const ent  = entrataPerMese(x.m,x.y);
                  const entP = entrataPerMese(pm,py);
                  const isF  = isFuture(x);
                  const stato = ent?"pagata":isF?"futuro":"non pagata";
                  return { x, i, ent, entP, isF, stato,
                    mese: x.y*100+x.m,
                    importo: ent ? Number(ent.importo)||0 : 0 };
                }), (r,k) => {
                  if(k==="mese")    return r.mese;
                  if(k==="importo") return r.importo;
                  if(k==="stato")   return r.stato;
                  return 0;
                }).map(({x,i,ent,entP,isF,stato})=>{
                  const isS    = x.m===selMese.m && x.y===selMese.y;
                  const stColor = ent?C.green:isF?C.textDim:C.red;
                  const stBg    = ent?C.greenBg:isF?C.bg:C.redBg;
                  const stBd    = ent?C.greenBorder:isF?C.border:C.redBorder;
                  return (
                    React.createElement('tr', { key: `${x.y}-${x.m}`, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:`1px solid ${C.border}`,
                        background:isS?`${accentHex}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${accentHex}12`:"transparent";}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?accentHex:C.text}}
                        , ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"][x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,
                        color:ent?C.green:isF?C.textDim:C.red}}
                        , isF?"—":ent?`€${ent.importo}`:`€${student.monthlyFee}`
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}}
                        , React.createElement('span', { style: {fontSize:11,background:stBg,color:stColor,border:`1px solid ${stBd}`,
                          borderRadius:4,padding:"2px 8px",letterSpacing:"0.06em"}}, stato)
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}}
                        , !isF && (
                          ent && entP ? (
                            React.createElement('span', { style: {fontSize:12,color:C.green}}, "= mese prec.")
                          ) : ent && !entP ? (
                            React.createElement('span', { style: {fontSize:11,color:C.textDim}}, "primo pagamento")
                          ) : !ent && entP ? (
                            React.createElement('span', { style: {fontSize:12,color:C.red}}, "mese prec. pagata")
                          ) : (
                            React.createElement('span', { style: {color:C.textDim}}, "—")
                          )
                        )
                        , isF && React.createElement('span', { style: {color:C.textDim}}, "—")
                      )
                      , React.createElement('td', { style: {padding:"11px 12px"}, onClick: e=>e.stopPropagation()}
                        , ent && (
                          React.createElement('button', { onClick: ()=>setRicevutaEnt(ent), title: "Stampa ricevuta",
                            style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:6,
                              cursor:"pointer",color:C.gold,padding:"3px 8px",display:"flex",alignItems:"center",gap:4,fontSize:11,
                              fontFamily:"'Open Sans',sans-serif"},
                            onMouseEnter: e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg;},
                            onMouseLeave: e=>{e.currentTarget.style.background=C.goldBg;e.currentTarget.style.color=C.gold;}}
                            , React.createElement(Ic, { n: "receipt", size: 11, stroke: "currentColor"})
                          )
                        )
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3699}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3700}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3701}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3702}}, "€"
                    , totaleVersato.toLocaleString("it-IT")
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3705}}
                    , entrateStudent.length, " su "  , MESI_AS.filter(x=>!isFuture(x)).length, " mesi"
                  )
                  , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3708}}), React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3708}})
                )
              )
            )
          )
        )
      )
      , ricevutaEnt && (
        React.createElement(RicevutaModal, {
          entrata: ricevutaEnt,
          student: student,
          config: config,
          onClose: ()=>setRicevutaEnt(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3716}}
        )
      )
      /* ── MODAL PRENOTA RECUPERO (solo allievo) ── */
      , showRecuperoModal && React.createElement(Modal, { title: "Prenota recupero", onClose: ()=>setShowRecuperoModal(false), wide: true }
        , React.createElement('div', {style:{padding:"4px 0 16px"}}

          /* ── Step 1: Selezione lezione da recuperare ── */
          , React.createElement('div', {style:{marginBottom:16}}
            , React.createElement('div', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8,fontWeight:600}}, "1 — Quale lezione vuoi recuperare? *")
            , lezioniDaRecuperare.map((l, idx) => {
                const isSelected = recuperoForm.lezId === l.id;
                return React.createElement('div', {
                    key:l.id,
                    onClick:()=>setRecuperoForm(p=>({...p, lezId:l.id, lezInfo:l, slotSel:null, date:"", ora:""})),
                    style:{
                      display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                      marginBottom:5, borderRadius:8, cursor:"pointer",
                      border:`2px solid ${isSelected ? C.purple : C.border}`,
                      background: isSelected ? C.purpleBg : C.surface,
                      transition:"all 0.12s"
                    }
                  }
                  , React.createElement('div', {style:{
                      width:16,height:16,borderRadius:"50%",flexShrink:0,
                      border:`2px solid ${isSelected ? C.purple : C.border}`,
                      background: isSelected ? C.purple : "transparent",
                      display:"flex",alignItems:"center",justifyContent:"center"
                    }}
                    , isSelected && React.createElement('div', {style:{width:6,height:6,borderRadius:"50%",background:"#fff"}})
                  )
                  , React.createElement('div', null
                    , React.createElement('div', {style:{fontSize:13,fontWeight:500,color:isSelected?C.purple:C.text}}
                      , new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"2-digit",month:"long"})
                      , " ore ", l.hour
                    )
                    , React.createElement('div', {style:{fontSize:11,color:C.textDim,marginTop:1}}, l.topic||l.instrument||"—")
                  )
                );
              })
          )

          /* ── Step 2: Selezione slot dalla disponibilità docente ── */
          , recuperoForm.lezId && (
            React.createElement('div', {style:{marginBottom:16}}
              , React.createElement('div', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8,fontWeight:600}}
                , "2 — Scegli giorno e orario (solo mese corrente) *"
              )
              , slotsRecuperoDisp.length === 0 ? (
                React.createElement('div', {style:{padding:"12px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,color:C.textDim}}
                  , "⚠️ Nessuno slot disponibile entro fine mese. Il docente potrebbe non avere disponibilità questo mese oppure non ha ancora configurato le fasce."
                )
              ) : (
                React.createElement('div', null
                  , (function() {
                      var byDate = {};
                      slotsRecuperoDisp.forEach(function(s) {
                        if (!byDate[s.data]) byDate[s.data] = [];
                        byDate[s.data].push(s);
                      });
                      return Object.keys(byDate).slice(0,14).map(function(data) {
                        var slots = byDate[data];
                        var slotSel = recuperoForm.slotSel || null;
                        return React.createElement('div', {key:data, style:{marginBottom:10}}
                          , React.createElement('div', {style:{fontSize:12,color:C.textMuted,fontWeight:600,marginBottom:5,textTransform:"capitalize"}}
                            , new Date(data+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})
                          )
                          , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:6}}
                            , slots.map(function(s) {
                                var isSel = slotSel === s.key;
                                var isOccupato = s.occupato;
                                return React.createElement('button', {
                                    key: s.key,
                                    onClick: isOccupato ? undefined : function(){ setRecuperoForm(function(p){ return Object.assign({},p,{slotSel:s.key,date:s.data,ora:s.oraInizio}); }); },
                                    title: isOccupato ? "Slot non disponibile — docente o sala già occupati" : "",
                                    disabled: isOccupato,
                                    style:{
                                      padding:"6px 12px",borderRadius:20,fontSize:12,fontFamily:"'Open Sans',sans-serif",
                                      border:"2px solid "+(isSel ? C.purple : isOccupato ? C.border : C.border),
                                      background: isSel ? C.purple : isOccupato ? C.bg : C.bg,
                                      color: isSel ? "#fff" : isOccupato ? C.textDim : C.textMuted,
                                      cursor: isOccupato ? "not-allowed" : "pointer",
                                      fontWeight: isSel ? 600 : 400,
                                      opacity: isOccupato ? 0.45 : 1,
                                      textDecoration: isOccupato ? "line-through" : "none",
                                      transition:"all 0.12s"
                                    }
                                  }
                                  , s.oraInizio + " — " + s.oraFine
                                  , isOccupato && React.createElement('span',{style:{fontSize:9,marginLeft:4,verticalAlign:'middle'}},'🚫')
                                );
                              })
                          )
                        );
                      });
                    })()
                )
              )
            )
          )
          , recuperoForm.lezId && (
            React.createElement('div', {style:{marginBottom:14}}
              , React.createElement('div', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8,fontWeight:600}}, "3 — Note aggiuntive (opzionale)")
              , React.createElement(Textarea, {
                  value: recuperoForm.note || "",
                  onChange: e=>setRecuperoForm(p=>({...p, note:e.target.value})),
                  placeholder:"Es. arrivo puntuale, porto lo spartito...",
                  rows:2
              })
            )
          )

          /* Riepilogo slot selezionato */
          , recuperoForm.slotSel && (
            React.createElement('div', {style:{padding:"10px 14px",background:C.purpleBg,border:`1px solid ${C.purpleBorder}`,borderRadius:8,fontSize:12,color:C.purple,marginBottom:12}}
              , React.createElement(Ic,{n:"check",size:13,stroke:C.purple})
              , " Hai selezionato: "
              , React.createElement('strong',null
                , new Date((recuperoForm.date||"")+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"2-digit",month:"long"})
                , " alle ", recuperoForm.ora
              )
            )
          )

          , React.createElement('div', {style:{padding:"10px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,color:C.textMuted,lineHeight:1.5,marginBottom:14}}
            , "La richiesta verrà inviata al tuo docente. Attendi la conferma prima di presentarti."
          )

          , React.createElement('div', {style:{display:"flex",gap:8,justifyContent:"flex-end"}}
            , React.createElement(Btn, {variant:"secondary", onClick:()=>setShowRecuperoModal(false)}, "Annulla")
            , React.createElement(Btn, {
                disabled: !recuperoForm.lezId || !recuperoForm.slotSel,
                title: !recuperoForm.slotSel ? "Seleziona uno slot dalla disponibilità del docente" : "",
                onClick: async () => {
                  try {
                    const sb = window.supabaseClient;
                    const lezData = recuperoForm.lezInfo;
                    const docenteName = (_optionalChain([recuperoForm.lezInfo, "optionalAccess", function(_x){return _x.teacher}])) || student.teacher || "";
                    const dataRecupero = new Date(recuperoForm.date+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"2-digit",month:"long"});
                    const lezLabel = lezData
                      ? new Date(lezData.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"long"})+" ore "+lezData.hour
                      : "";

                    if (sb) {
                      // Ricava tutti i nomi/key del docente per la notifica
                      var allDocNow = window.__docenti__ || [];
                      var docRec = allDocNow.find(function(d){
                        return (d.teacherKey||d.nome||"").toLowerCase().indexOf(docenteName.toLowerCase()) >= 0 ||
                               docenteName.toLowerCase().indexOf((d.teacherKey||d.nome||"").toLowerCase()) >= 0;
                      });
                      var docNotifNome = docRec ? (docRec.teacherKey || docRec.nome || docenteName) : docenteName;

                      // 1. Salva la richiesta recupero
                      const { data: richData, error: richErr } = await sb.from('richieste_recupero').insert({
                        allievo_id:    student.id,
                        allievo_nome:  student.name,
                        docente:       docenteName,
                        data_preferita:recuperoForm.date,
                        ora_recupero:  recuperoForm.ora || null,
                        note:          recuperoForm.note || null,
                        stato:         "in_attesa",
                        lezioni_ids:   JSON.stringify([recuperoForm.lezId]),
                        created_at:    new Date().toISOString(),
                      }).select().single();
                      if (richErr) console.warn("[FM] richiesta recupero:", richErr.message);

                      // 2. Notifica per il DOCENTE — salva sia teacherKey che nome lezione
                      const msgDocente = student.name + " ha prenotato un recupero per " + dataRecupero + " ore " + recuperoForm.ora;
                      await sb.from('notifiche').insert({
                        destinatario_ruolo: 'docente',
                        destinatario_nome:  docNotifNome,
                        tipo:               'recupero_richiesto',
                        titolo:             '📅 Nuova prenotazione recupero',
                        messaggio:          msgDocente,
                        letto:              false,
                        created_at:         new Date().toISOString(),
                        meta:               JSON.stringify({ allievo: student.name, allievo_id: student.id, data: recuperoForm.date, ora: recuperoForm.ora, docente_key: docNotifNome }),
                      }).then(function(r){ if(r.error) console.warn("[FM] notifica docente:", r.error.message); });

                      // 3. Notifica di conferma per l'ALLIEVO
                      const msgAllievo = "Recupero richiesto per " + dataRecupero + " ore " + recuperoForm.ora + ". In attesa di conferma dal docente " + docenteName + ".";
                      await sb.from('notifiche').insert({
                        destinatario_ruolo: 'allievo',
                        destinatario_id:    String(student.id),
                        destinatario_nome:  student.name,
                        tipo:               'recupero_in_attesa',
                        titolo:             '📅 Recupero prenotato',
                        messaggio:          msgAllievo,
                        letto:              false,
                        created_at:         new Date().toISOString(),
                        meta:               JSON.stringify({ docente: docenteName, data: recuperoForm.date, ora: recuperoForm.ora }),
                      }).then(function(r){ if(r.error) console.warn("[FM] notifica allievo:", r.error.message); });
                    }

                    // 4. Toast visivo immediato all'allievo
                    var t = document.getElementById('sync-toast');
                    if (t) {
                      t.textContent = '📅 Recupero prenotato — in attesa di conferma';
                      t.style.background = '#f0e6ff';
                      t.style.borderColor = '#c084fc';
                      t.style.color = '#7c3aed';
                      t.style.opacity = '1';
                      setTimeout(function(){ t.style.opacity='0'; t.style.background=''; t.style.borderColor=''; t.style.color=''; }, 4000);
                    }

                    setShowRecuperoModal(false);
                    setRecuperoForm({ date:"", note:"", lezId:null, lezInfo:null, slotSel:null, ora:"" });

                    // 5. Forza refresh per aggiornare NotificationBell
                    setTimeout(function(){ if(window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__(true); }, 1500);

                  } catch(e) {
                    console.warn("[FM] recupero submit error:", e);
                    var t2 = document.getElementById('sync-toast');
                    if (t2) { t2.textContent = '📅 Recupero prenotato'; t2.style.opacity='1'; setTimeout(function(){ t2.style.opacity='0'; },3000); }
                    setShowRecuperoModal(false);
                  }
                }
              }
              , React.createElement(Ic, {n:"calendar", size:14, stroke:"#fff"})
              , " Invia richiesta"
            )
          )
        )
      )
    )
  );
};
// ════════════════════════════════════════════════════════════════════════════════
// LISTA ALLIEVI
// ════════════════════════════════════════════════════════════════════════════════
const StudentList = ({ students, courses, onSelect, onAdd, onEdit, onDelete, userRuolo:_slRuolo }) => {
  const slRuolo = _slRuolo || "admin";
  const [search, setSearch]           = useState("");
  const [filterInstrument, setFI]     = useState("");
  const [filterStatus, setFS]         = useState("");
  const [filterCourse, setFC]         = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, sortDir, handleSort, sortFn] = useSortable("name");

  const collettivi = courses.filter(c=>c.type==="collettivo");

  const strumentiPresenti = useMemo(() => {
    const set = new Set();
    students.forEach(s => {
      if (s.instrument) set.add(s.instrument);
      (s.extraInstruments||[]).forEach(i => set.add(i));
    });
    return [...set].sort();
  }, [students]);

  const corsiComplementariPresenti = useMemo(() => {
    const ids = new Set(students.map(s => s.complementaryCourse).filter(Boolean));
    return courses.filter(c => ids.has(c.id));
  }, [students, courses]);

  const filtered = students.filter(s=>{
    const q    = search.toLowerCase();
    const comp = courses.find(c=>c.id===s.complementaryCourse);
    const allInstruments = [s.instrument, ...(s.extraInstruments||[])].filter(Boolean);
    return (!q || s.name.toLowerCase().includes(q) || s.instrument.toLowerCase().includes(q) || _optionalChain([s, 'access', _33 => _33.email, 'optionalAccess', _34 => _34.toLowerCase, 'call', _35 => _35(), 'access', _36 => _36.includes, 'call', _37 => _37(q)]) || _optionalChain([comp, 'optionalAccess', _38 => _38.name, 'access', _39 => _39.toLowerCase, 'call', _40 => _40(), 'access', _41 => _41.includes, 'call', _42 => _42(q)]))
      && (!filterInstrument || allInstruments.includes(filterInstrument))
      && (!filterStatus     || s.status===filterStatus)
      && (!filterCourse     || s.complementaryCourse===filterCourse);
  });

  const sorted = sortFn(filtered, (s, k) => {
    if (k === "name")       return s.name || "";
    if (k === "instrument") return s.instrument || "";
    if (k === "teacher")    return s.teacher || "";
    if (k === "monthlyFee") return Number(s.monthlyFee) || 0;
    if (k === "status")     return s.status || "";
    if (k === "complem")    return (courses.find(c=>c.id===s.complementaryCourse)||{}).name || "";
    return s[k] || "";
  });

  const hasFilters = filterInstrument||filterStatus||filterCourse;

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3750}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3751}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3752}}
          , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3753}}, "Anagrafica Allievi" )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:14,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3754}}, students.filter(s=>s.status==="attivo").length, " attivi · "   , students.length, " totali" )
        )
        , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
          , React.createElement(RefreshBtn)
          , onAdd && React.createElement(Btn, { onClick: onAdd, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3756}}, React.createElement(Ic, { n: "plus", size: 14, color: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3756}}), "Nuovo allievo" )
        )
      )

      , React.createElement('div', { style: {display:"flex",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3759}}
        , React.createElement('div', { style: {position:"relative",flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3760}}
          , React.createElement('span', { style: {position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3761}}, React.createElement(Ic, { n: "search", size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3761}}))
          , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value), placeholder: "Cerca per nome, strumento, corso complementare..."     ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:14,padding:"10px 14px 10px 40px",fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3762}})
        )
        , React.createElement(Btn, { variant: showFilters||hasFilters?"primary":"secondary", onClick: ()=>setShowFilters(p=>!p), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3765}}
          , React.createElement(Ic, { n: "filter", size: 14, color: showFilters||hasFilters?C.bg:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3766}}), "Filtri "
           , hasFilters?`(${[filterInstrument,filterStatus,filterCourse].filter(Boolean).length})`:""
        )
      )

      , showFilters && (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,padding:"12px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,animation:"fadeIn 0.2s ease",alignItems:"end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3772}}
          , React.createElement(Sel, { label: "Strumento", value: filterInstrument, onChange: e=>setFI(e.target.value), options: strumentiPresenti.map(i=>({value:i,label:i})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3773}})
          , React.createElement(Sel, { label: "Stato", value: filterStatus, onChange: e=>setFS(e.target.value), options: ["attivo","inattivo","sospeso"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3774}})
          , React.createElement(Sel, { label: "Corso complementare" , value: filterCourse, onChange: e=>setFC(e.target.value), options: corsiComplementariPresenti.map(c=>({value:c.id,label:c.name})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3775}})
          , React.createElement(Btn, { small: true, variant: "ghost", onClick: ()=>{setFI("");setFS("");setFC("");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3776}}, "Reset")
        )
      )

      , React.createElement('div', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3780}}, filtered.length, " alliev" , filtered.length!==1?"i":"o", " trovat" , filtered.length!==1?"i":"o")

      , React.createElement('div', { className: "table-outer", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3782}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3783}}
        , filtered.length===0
          ? React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3785}}, React.createElement(Ic, { n: "search", size: 28, color: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3785}}), React.createElement('p', { style: {marginTop:12,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3785}}, "Nessun allievo trovato"  ))
          : React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3786}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3787}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3788}}
                  , React.createElement(SortTh, {label:"Allievo",        sortKey:"name",       currentKey:sortKey, dir:sortDir, onSort:handleSort})
                  , React.createElement(SortTh, {label:"Corso principale",sortKey:"instrument", currentKey:sortKey, dir:sortDir, onSort:handleSort})
                  , React.createElement(SortTh, {label:"Corso complem.", sortKey:"complem",    currentKey:sortKey, dir:sortDir, onSort:handleSort, className:"hide-mobile"})
                  , React.createElement(SortTh, {label:"Insegnante",     sortKey:"teacher",    currentKey:sortKey, dir:sortDir, onSort:handleSort, className:"hide-mobile"})
                  , ...(slRuolo!=="docente" ? [React.createElement(SortTh, {key:"quota",label:"Quota",sortKey:"monthlyFee",currentKey:sortKey,dir:sortDir,onSort:handleSort})] : [])
                  , React.createElement(SortTh, {label:"Stato",          sortKey:"status",     currentKey:sortKey, dir:sortDir, onSort:handleSort, className:"resp-hide"})
                  , React.createElement('th', {style:{padding:"10px 16px"}})
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3802}}
                , sorted.map((s,i)=>{
                  const ic   = INS_COLORS[s.instrument]||C.gold;
                  const comp = courses.find(c=>c.id===s.complementaryCourse);
                  return (
                    React.createElement('tr', { key: s.id, style: {borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",transition:"background 0.12s"},
                      onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                      onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3807}}
                      , React.createElement('td', { style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3810}}
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3811}}
                          , React.createElement('div', { style: {width:34,height:34,borderRadius:"50%",background:`${ic}20`,border:`1px solid ${ic}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:ic,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3812}}
                            , initials(s.name)
                          )
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3815}}
                            , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3816}}, s.name)
                            , slRuolo!=="docente" && React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3817}}, s.email||"—")
                          )
                        )
                      )
                      , React.createElement('td', { style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3821}}, React.createElement(Badge, { label: s.instrument, color: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3821}}))
                      , React.createElement('td', { className: "hide-mobile", style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3822}}, comp?React.createElement(Badge, { label: comp.name, color: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3822}}):React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3822}}, "—"))
                      , React.createElement('td', { className: "hide-mobile", style: {padding:"13px 16px",fontSize:13,color:C.textMuted}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3823}}, s.teacher)
                      , slRuolo!=="docente" && React.createElement('td', { style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3824}}
                        , React.createElement('div', { style: {fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3825}}, "€ " , s.monthlyFee)
                        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3826}}, s.feeType)
                      )
                      , React.createElement('td', { className: "resp-hide", style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3828}}
                        , React.createElement(Badge, { label: s.status, color: s.status==="attivo"?"green":s.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3829}})
                      )
                      , React.createElement('td', { style: {padding:"13px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3831}}
                        , React.createElement('div', { style: {display:"flex",gap:4,justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3832}}
                          , onEdit && React.createElement('button', { onClick: e=>{e.stopPropagation();onEdit(s);}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:6,borderRadius:6,display:"flex"},
                            onMouseEnter: e=>e.currentTarget.style.color=C.gold, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3833}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3834}}))
                          , onDelete && React.createElement('button', { onClick: e=>{e.stopPropagation();onDelete(s);}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:6,borderRadius:6,display:"flex"},
                            onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3835}}, React.createElement(Ic, { n: "trash", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3836}}))
                        )
                      )
                    )
                  );
                })
              )
            )
        
        )
      )
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ════════════════════════════════════════════════════════════════════════════════

// ─── REPORT LEZIONI MENSILE ───────────────────────────────────────────────────
const ReportLezioniMensile = ({ lessons, students, config, onSelectAllievo }) => {
  const now3 = new Date();
  const meseCurr = now3.getMonth() + 1;
  const annoCurr = now3.getFullYear();
  const MESI_FULL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const MESI_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  const cfg = config || {};
  const SOGLIA_IND_G = cfg.sogliaLezioniIndividuali != null ? Number(cfg.sogliaLezioniIndividuali) : 4;

  const [reportOpen, setReportOpen] = useState(false);
  const [reportMese, setReportMese] = useState(meseCurr);
  const [reportAnno, setReportAnno] = useState(annoCurr);
  const [reportFiltro, setReportFiltro] = useState('tutti');

  const contInd = {};
  (lessons||[]).forEach(l => {
    if (isColl(l)||l.tipo==='prova'||l.tipo==='sala_prove'||l.tipo==='recupero') return;
    if (l.attendance==='recuperata') return;
    if (!l.date) return;
    const [ly,lm] = l.date.split('-').map(Number);
    if (ly!==reportAnno||lm!==reportMese) return;
    const k = l.student||String(l.studentId||''); if(!k) return;
    contInd[k] = (contInd[k]||0)+1;
  });

  const allieviAttivi = (students||[]).filter(s=>s.status==='attivo'||!s.status);
  const report = allieviAttivi.map(s => {
    const nome = s.name||s.nome||'';
    const soglia = s.sogliaIndividualeEcc!=null ? Number(s.sogliaIndividualeEcc) : SOGLIA_IND_G;
    const count  = contInd[nome]||0;
    const delta  = count - soglia;
    return { id:s.id, nome, count, soglia, delta };
  }).filter(r=>r.nome).sort((a,b)=>b.delta-a.delta);

  const superano    = report.filter(r=>r.delta>0);
  const inLinea     = report.filter(r=>r.delta===0);
  const sottosoglia = report.filter(r=>r.delta<0);

  const filtrato = reportFiltro==='oltre' ? superano
    : reportFiltro==='sotto' ? sottosoglia
    : reportFiltro==='inlinea' ? inLinea : report;

  return React.createElement('div', {style:{marginBottom:20}}
    , React.createElement('div', {
        onClick:()=>setReportOpen(p=>!p),
        style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:reportOpen?'12px 12px 0 0':12,
          padding:'12px 18px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}
      , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10}}
        , React.createElement(Ic,{n:'chart',size:15,stroke:C.gold})
        , React.createElement('span',{style:{fontSize:13,fontWeight:600,color:C.text}}, `Report lezioni individuali · ${MESI_FULL[reportMese-1]} ${reportAnno}`)
        , superano.length>0&&React.createElement('span',{style:{background:C.orangeBg,color:C.orange,border:`1px solid ${C.orangeBorder}`,borderRadius:20,padding:'2px 10px',fontSize:11,fontWeight:700}},`${superano.length} oltre`)
        , sottosoglia.length>0&&React.createElement('span',{style:{background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBorder}`,borderRadius:20,padding:'2px 10px',fontSize:11,fontWeight:700}},`${sottosoglia.length} sotto`)
      )
      , React.createElement(Ic,{n:reportOpen?'chevron-up':'chevron-down',size:16,stroke:C.textMuted})
    )
    , reportOpen && React.createElement('div',{style:{background:C.surface,border:`1px solid ${C.border}`,borderTop:'none',borderRadius:'0 0 12px 12px'}}
      , React.createElement('div',{style:{padding:'12px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}
        , React.createElement('select',{value:reportMese,onChange:e=>setReportMese(Number(e.target.value)),
            style:{padding:'6px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}
          , MESI_SHORT.map((m,i)=>React.createElement('option',{key:i,value:i+1},m)))
        , React.createElement('select',{value:reportAnno,onChange:e=>setReportAnno(Number(e.target.value)),
            style:{padding:'6px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}
          , [annoCurr-1,annoCurr,annoCurr+1].map(y=>React.createElement('option',{key:y,value:y},y)))
        , React.createElement('div',{style:{display:'flex',gap:4,marginLeft:'auto'}}
          , [{id:'tutti',label:`Tutti (${report.length})`},{id:'oltre',label:`🔴 Oltre (${superano.length})`},{id:'inlinea',label:`🟢 In linea (${inLinea.length})`},{id:'sotto',label:`🔵 Sotto (${sottosoglia.length})`}]
            .map(f=>React.createElement('button',{key:f.id,onClick:()=>setReportFiltro(f.id),
                style:{padding:'5px 12px',borderRadius:20,border:`1px solid ${reportFiltro===f.id?C.gold:C.border}`,
                  background:reportFiltro===f.id?C.goldBg:'none',color:reportFiltro===f.id?C.gold:C.textMuted,
                  cursor:'pointer',fontSize:11,fontWeight:reportFiltro===f.id?700:400,fontFamily:"'Open Sans',sans-serif"}},f.label))
        )
      )
      , React.createElement('table',{style:{width:'100%',borderCollapse:'collapse'}}
        , React.createElement('thead',null
          , React.createElement('tr',{style:{background:C.bg,borderBottom:`2px solid ${C.border}`}}
            , ['Allievo','Lezioni svolte','Soglia','Differenza','Stato'].map(h=>
                React.createElement('th',{key:h,style:{padding:'9px 16px',textAlign:'left',fontSize:10,textTransform:'uppercase',letterSpacing:'0.07em',color:C.textMuted,fontWeight:600}},h))
          )
        )
        , React.createElement('tbody',null
          , filtrato.map((r,i)=>{
              const clr = r.delta>0?C.orange : r.delta<0?C.blue : C.green;
              const bg  = r.delta>0?C.orangeBg : r.delta<0?C.blueBg : C.greenBg;
              const bd  = r.delta>0?C.orangeBorder : r.delta<0?C.blueBorder : C.greenBorder;
              const lbl = r.delta>0?`+${r.delta} extra` : r.delta<0?`${r.delta} mancanti`:'✓ In linea';
              return React.createElement('tr',{key:r.id||r.nome,
                  style:{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.surface:C.bg,cursor:'pointer',transition:'background .1s'},
                  onMouseEnter:e=>e.currentTarget.style.background=C.bg,
                  onMouseLeave:e=>e.currentTarget.style.background=i%2===0?C.surface:C.bg,
                  onClick:()=>{ const s=(students||[]).find(st=>(st.name||st.nome||'')===r.nome); if(s&&onSelectAllievo) onSelectAllievo(s); }}
                , React.createElement('td',{style:{padding:'10px 16px',fontSize:13,fontWeight:600,color:C.text}}, r.nome)
                , React.createElement('td',{style:{padding:'10px 16px',fontSize:13,color:C.text,fontWeight:700}}, r.count)
                , React.createElement('td',{style:{padding:'10px 16px',fontSize:12,color:C.textMuted}}, r.soglia, r.soglia!==SOGLIA_IND_G&&React.createElement('span',{style:{fontSize:10,color:C.gold,marginLeft:6}},'(eccezione)'))
                , React.createElement('td',{style:{padding:'10px 16px',fontSize:13,fontWeight:700,color:clr}}, r.delta>0?`+${r.delta}`:r.delta<0?r.delta:'0')
                , React.createElement('td',{style:{padding:'10px 16px'}}, React.createElement('span',{style:{fontSize:11,fontWeight:600,background:bg,color:clr,border:`1px solid ${bd}`,borderRadius:20,padding:'3px 10px'}},lbl))
              );
            })
          , filtrato.length===0&&React.createElement('tr',null,React.createElement('td',{colSpan:5,style:{padding:'20px',textAlign:'center',color:C.textDim,fontSize:13}},'Nessun allievo in questa categoria'))
        )
      )
      , React.createElement('div',{style:{padding:'10px 18px',borderTop:`1px solid ${C.border}`,fontSize:11,color:C.textDim,display:'flex',justifyContent:'space-between'}}
        , `Soglia globale: ${SOGLIA_IND_G} lez/mese · ${report.length} allievi attivi`
        , React.createElement('span',null,'Clicca su un allievo per aprire il profilo')
      )
    )
  );
};

const AllieviView = ({ students:propStudents, setStudents:propSetStudents, courses:propCourses, setCourses:propSetCourses, lessons:propLessons, entrate:propEntrate, setEntrate:propSetEntrate, annoInizioAttivo, config:propConfig, setConfig:propSetConfigAV, docenti:propDocentiAV, quickAction:qaAV, clearQuickAction:clearQaAV, userRuolo:propUserRuoloAV, appUser:_appUserAV }) => {
  const _ruoloAV = propUserRuoloAV || "admin";
  const _nomeAV  = (_appUserAV && _appUserAV.nome) || "";
  const isMobile = useIsMobile();
  const [_students, _setStudents] = useState(INIT_STUDENTS);
  const [_courses,  _setCourses]  = useState(INIT_COURSES);
  const _allStudents = _nullishCoalesce(propStudents, () => ( _students));
  const setStudents  = _nullishCoalesce(propSetStudents, () => ( _setStudents));
  // Se c'è docenteId, trova il teacherKey dal record docente, altrimenti fallback a nome
  const _avDocenteId = (_appUserAV && _appUserAV.docenteId) || null;
  const _avDocRecord = _avDocenteId ? (propDocentiAV||[]).find(d=>String(d.id)===String(_avDocenteId)) : null;
  const _avTeacherKey = _avDocRecord ? (_avDocRecord.teacherKey||_avDocRecord.nome||_nomeAV) : _nomeAV;
  const _avAllievoId = (_appUserAV && _appUserAV.allievoId) || null;
  const students = _ruoloAV==="docente" && _avTeacherKey
    ? _allStudents.filter(s=>{ const t=(s.teacher||"").toLowerCase().trim(); const k=_avTeacherKey.toLowerCase().trim(); return t===k||t.includes(k)||k.includes(t); })
    : _ruoloAV==="allievo" && (_avAllievoId||_nomeAV)
    ? (_avAllievoId ? _allStudents.filter(s=>String(s.id)===String(_avAllievoId)) : _allStudents.filter(s=>(s.name||s.nome||"").toLowerCase()===_nomeAV.toLowerCase()))
    : _allStudents;
  const courses     = _nullishCoalesce(propCourses, () => ( _courses));
  const setCourses  = _nullishCoalesce(propSetCourses, () => ( _setCourses));
  const lessons     = _nullishCoalesce(propLessons, () => ( []));
  const entrate     = _nullishCoalesce(propEntrate, () => ( []));
  const setEntrate  = _nullishCoalesce(propSetEntrate, () => ( (()=>{})));
  const [view,     setView]     = useState(_ruoloAV==="allievo" ? "detail" : "list");
  const [selected, setSelected] = useState(_ruoloAV==="allievo" ? (students[0]||null) : null);
  const [modal,    setModal]    = useState(null);

  // ── Auto-seleziona l'allievo loggato appena i dati Supabase arrivano ──────────
  React.useEffect(() => {
    if (_ruoloAV !== "allievo") return;
    if (selected) return; // già selezionato
    const me = _avAllievoId
      ? _allStudents.find(s => String(s.id) === String(_avAllievoId))
      : _allStudents.find(s => (s.name||s.nome||"").toLowerCase() === _nomeAV.toLowerCase());
    if (me) { setSelected(me); setView("detail"); }
  }, [_allStudents, _avAllievoId, _nomeAV, _ruoloAV]);

  const closeModal = () => setModal(null);
  React.useEffect(()=>{
    if(qaAV==="addAllievo"){ setModal("add"); if(clearQaAV)clearQaAV(); }
    else if(qaAV==="openRecuperoModal"){
      // Apre il modal prenota recupero nel profilo allievo
      // Il selectedStudent è già impostato dall'auto-selezione
      // Usiamo un evento custom per aprire il modal nello StudentDetail
      if(window.__FM_OPEN_RECUPERO_MODAL__) { window.__FM_OPEN_RECUPERO_MODAL__(); }
      if(clearQaAV)clearQaAV();
    }
  },[qaAV]);

  const handleAddStudent = async (d) => {
    const sb = window.supabaseClient;
    if (sb) {
      const row = {
        nome: d.name||'', email: d.email||null, phone: d.phone||null,
        strumento: d.instrument||null, docente: d.teacher||null,
        livello: d.level||'Principiante', status: d.status||'attivo',
        monthly_fee: parseFloat(d.monthlyFee)||0, fee_type: d.feeType||'fisso',
        birthdate: d.birthdate||null, enroll_date: d.enrollDate||null,
        complementary_course: d.complementaryCourse||null, notes: d.notes||null,
        extra_instruments: d.extraInstruments&&d.extraInstruments.length>0 ? JSON.stringify(d.extraInstruments) : null,
        extra_teachers: d.extraTeachers&&Object.keys(d.extraTeachers).length>0 ? JSON.stringify(d.extraTeachers) : null,
      };
      const { data: inserted, error } = await sb.from('studenti').insert(row).select().single();
      if (!error && inserted) {
        // Usa l'ID intero reale restituito da Supabase
        const FA = window.FMAdapter;
        const newStudent = FA ? FA.studente(inserted) : inserted;
        newStudent.repertorio = [];
        newStudent.extraInstruments = d.extraInstruments||[];
        newStudent.extraTeachers = d.extraTeachers||{};
        newStudent.lessons = [];
        setStudents(p => [...p, newStudent]);
      } else if (error) {
        console.warn('[FM] handleAddStudent error:', error.message);
        // Fallback offline
        setStudents(p => [...p, {...d, id: uid(), lessons:[]}]);
      }
    } else {
      setStudents(p => [...p, {...d, id: uid(), lessons:[]}]);
    }
    closeModal();
  };

  const handleEditStudent = async (d) => {
    const sb = window.supabaseClient;
    if (sb && d.id) {
      const row = {
        nome: d.name||'', email: d.email||null, phone: d.phone||null,
        strumento: d.instrument||null, docente: d.teacher||null,
        livello: d.level||'Principiante', status: d.status||'attivo',
        monthly_fee: parseFloat(d.monthlyFee)||0, fee_type: d.feeType||'fisso',
        birthdate: d.birthdate||null, enroll_date: d.enrollDate||null,
        complementary_course: d.complementaryCourse||null, notes: d.notes||null,
        extra_instruments: d.extraInstruments&&d.extraInstruments.length>0 ? JSON.stringify(d.extraInstruments) : null,
        extra_teachers: d.extraTeachers&&Object.keys(d.extraTeachers).length>0 ? JSON.stringify(d.extraTeachers) : null,
      };
      const { error } = await sb.from('studenti').update(row).eq('id', d.id);
      if (error) console.warn('[FM] handleEditStudent error:', error.message);
    }
    setStudents(p => p.map(s => s.id===d.id ? {...s,...d} : s));
    if (_optionalChain([selected, 'optionalAccess', _43 => _43.id])===d.id) setSelected(p=>({...p,...d}));
    closeModal();
  };

  const handleDeleteStudent = async () => {
    const sid = _optionalChain([selected, 'optionalAccess', _44 => _44.id]);
    const sb = window.supabaseClient;
    if (sb && sid) {
      const { error } = await sb.from('studenti').delete().eq('id', sid);
      if (error) console.warn('[FM] handleDeleteStudent error:', error.message);
    }
    setStudents(p => p.filter(s => s.id !== sid));
    setView("list"); setSelected(null); closeModal();
  };
  const handleAddLesson     = (sid,lesson) => {
    setStudents(p=>p.map(s=>s.id===sid?{...s,lessons:[...(s.lessons||[]),lesson]}:s));
    setSelected(p=>_optionalChain([p, 'optionalAccess', _45 => _45.id])===sid?{...p,lessons:[...(p.lessons||[]),lesson]}:p);
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {maxWidth:1200,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3882}}

        /* ── Report Lezioni Mensile (solo admin, solo in vista lista) ── */
        , view==="list" && _ruoloAV==="admin" && React.createElement(ReportLezioniMensile, {
            lessons, students, config: propConfig,
            onSelectAllievo: (s) => { setSelected(s); setView('detail'); },
          })

        , view==="list" && (
          React.createElement(StudentList, {
            students: students, courses: courses,
            onSelect: s=>{setSelected(s);setView("detail");},
            onAdd: _ruoloAV==="admin" ? ()=>setModal("add") : undefined,
            onEdit: _ruoloAV==="admin" ? s=>{setSelected(s);setModal("edit");} : undefined,
            onDelete: _ruoloAV==="admin" ? s=>{setSelected(s);setModal("delete");} : undefined,
            userRuolo: _ruoloAV, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3884}}
          )
        )
        , view==="detail" && selected && (
          React.createElement(StudentDetail, {
            student: students.find(s=>s.id===selected.id)||selected,
            courses: courses,
            lessons: lessons,
            entrate: _ruoloAV==="docente" ? [] : entrate,
            setEntrate: _ruoloAV==="docente" ? undefined : setEntrate,
            annoInizioAttivo: annoInizioAttivo,
            config: propConfig,
            setConfig: propSetConfigAV,
            userRuolo: _ruoloAV,
            onEdit: _ruoloAV==="admin" ? ()=>setModal("edit") : undefined,
            onDelete: _ruoloAV==="admin" ? ()=>setModal("delete") : undefined,
            onBack: _ruoloAV!=="allievo" ? ()=>setView("list") : undefined,
            onAddLesson: handleAddLesson,
            onUpdateStudent: d=>setStudents(p=>p.map(s=>s.id===d.id?d:s)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3893}}
          )
        )
      )
      , _ruoloAV==="admin" && modal==="add" && React.createElement(Modal, { title: "Nuovo allievo" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3909}}, React.createElement(StudentForm, { onSave: handleAddStudent, onClose: closeModal, courses: courses, docenti: propDocentiAV||[], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3909}}))
      , _ruoloAV==="admin" && modal==="edit" && selected && React.createElement(Modal, { title: "Modifica allievo" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3910}}, React.createElement(StudentForm, { initial: students.find(s=>s.id===selected.id), onSave: handleEditStudent, onClose: closeModal, courses: courses, docenti: propDocentiAV||[], role: propUserRuoloAV||"admin", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3910}}))
      , _ruoloAV==="admin" && modal==="delete" && selected && React.createElement(ConfirmDelete, { label: selected.name, description: "Questa azione è irreversibile."   , onConfirm: handleDeleteStudent, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3911}})

      /* ── Google Calendar per allievo ── */
      , _ruoloAV==="allievo" && React.createElement('div', {style:{padding:"16px", maxWidth:600}}
          , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
            , React.createElement('div', {style:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}
              , React.createElement('span',{style:{fontSize:16}},'📅')
              , React.createElement('span',{style:{fontSize:12,fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted}}, "Google Calendar")
            )
            , React.createElement('div',{style:{padding:"16px 20px"}}
              , typeof GoogleCalendarSectionSimple !== 'undefined'
                ? React.createElement(GoogleCalendarSectionSimple, {appUser: _appUserAV, userRuolo: 'allievo'})
                : React.createElement('div',{style:{fontSize:13,color:C.textMuted}},'⏳ Caricamento...')
            )
          )
        )
    )
  );
};

const CorsiView = ({ courses:propCourses, setCourses:propSetCourses, students:propStudents, setStudents:propSetStudents, docenti:propDocenti, userRuolo:_rC2, appUser:_aC }) => {
  const _ruoloCorsi = _rC2 || "admin";
  const _nomeCorsi  = (_aC && _aC.nome) || "";
  const [_courses,  _setCourses]  = useState(INIT_COURSES);
  const [_students, _setStudents] = useState(INIT_STUDENTS);
  const courses     = _nullishCoalesce(propCourses, () => ( _courses));
  const setCourses  = _nullishCoalesce(propSetCourses, () => ( _setCourses));
  const students    = _nullishCoalesce(propStudents, () => ( _students));
  const setStudents = _nullishCoalesce(propSetStudents, () => ( _setStudents));
  const docenti     = _nullishCoalesce(propDocenti, () => ( []));

  const handleAddCourse = async (d) => {
    const sb = window.supabaseClient;
    const newId = uid();
    if (sb) {
      const row = { id:newId, nome:d.name||d.nome||'', tipo:d.type||d.tipo||'individuale', descrizione:d.description||d.descrizione||null, visible:true };
      const { error } = await sb.from('corsi').insert(row);
      if (error) console.warn('[FM] handleAddCourse error:', error.message);
    }
    setCourses(p => [...p, {...d, id:newId}]);
  };
  const handleEditCourse = async (d) => {
    const sb = window.supabaseClient;
    if (sb && d.id) {
      const row = { nome:d.name||d.nome||'', tipo:d.type||d.tipo||'individuale', descrizione:d.description||d.descrizione||null };
      const { error } = await sb.from('corsi').update(row).eq('id', d.id);
      if (error) console.warn('[FM] handleEditCourse error:', error.message);
    }
    setCourses(p => p.map(c => c.id===d.id ? {...c,...d} : c));
  };
  const handleDelCourse = async (id) => {
    const sb = window.supabaseClient;
    if (sb && id) {
      const { error } = await sb.from('corsi').delete().eq('id', id);
      if (error) console.warn('[FM] handleDelCourse error:', error.message);
    }
    setCourses(p => p.filter(c => c.id !== id));
    setStudents(p => p.map(s => s.complementaryCourse===id ? {...s,complementaryCourse:""} : s));
  };

  return (
    React.createElement('div', { style: {maxWidth:1200,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3933}}
      , React.createElement(CourseManager, {
        courses: _ruoloCorsi==="docente" && _nomeCorsi
          ? (()=>{ const myD=(propDocenti||[]).find(d=>d.teacherKey===_nomeCorsi||(d.nome||"").toLowerCase().includes(_nomeCorsi.toLowerCase())); return myD?courses.filter(c=>(c.docenti||[]).includes(myD.id)):courses; })()
          : _ruoloCorsi==="allievo"
          ? (()=>{ const _avId=(_aC&&_aC.allievoId)||null; const me=_avId?students.find(s=>String(s.id)===String(_avId)):students.find(s=>(s.name||s.nome||"").toLowerCase()===_nomeCorsi.toLowerCase()); if(!me) return []; const ids=new Set([...(me.instrument?courses.filter(c=>c.name===me.instrument).map(c=>c.id):[]),...(me.complementaryCourse?[me.complementaryCourse]:[]),...((me.extraInstruments||[]).flatMap(i=>courses.filter(c=>c.name===i).map(c=>c.id)))]); return courses.filter(c=>ids.has(c.id)); })()
          : courses,
        students: students,
        docenti: docenti,
        userRuolo: _ruoloCorsi,
        onAdd: _ruoloCorsi==="admin" ? handleAddCourse : undefined,
        onEdit: _ruoloCorsi==="admin" ? handleEditCourse : undefined,
        onDelete: _ruoloCorsi==="admin" ? handleDelCourse : undefined, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3934}}
      )
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════

// CALENDARIO LEZIONI

// ════════════════════════════════════════════════════════════════════════════════

const DAYS_SHORT  = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
const DAYS_FULL   = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
const MONTHS      = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const HOURS       = Array.from({length:15},(_,i)=>`${(i+8).toString().padStart(2,"0")}:00`);
const STUDENTS_LIST = ["Sofia Marchetti","Luca Ferrara","Emma Conti","Marco Ricci","Giulia Romano","Alessandro Gallo"];
const ROOMS       = ["Sala A","Sala B","Sala C","Sala Grande","Studio 1"];
const RECURRENCE_OPTS = ["Nessuna","Ogni settimana","Ogni 2 settimane","Ogni mese"];
const DIFFICULTY_OPTS = ["Principiante","Elementare","Intermedio","Avanzato","Professionale"];
const TONALITY_OPTS   = [
  "Do maggiore","Sol maggiore","Re maggiore","La maggiore","Mi maggiore","Si maggiore","Fa# maggiore","Do# maggiore",
  "Fa maggiore","Si♭ maggiore","Mi♭ maggiore","La♭ maggiore","Re♭ maggiore","Sol♭ maggiore","Do♭ maggiore",
  "La minore","Mi minore","Si minore","Fa# minore","Do# minore","Sol# minore","Re# minore","La# minore",
  "Re minore","Sol minore","Do minore","Fa minore","Si♭ minore","Mi♭ minore","La♭ minore",
  "Scala cromatica","Scala pentatonica","Blues","Modale - Dorico","Modale - Frigio","Modale - Lidio",
];

const INIT_REPERTORIO = [
  { id:"r1",  title:"Notturno in Mi♭ maggiore Op.9 n.2", composer:"Frédéric Chopin",   tonality:"Mi♭ maggiore", difficulty:"Avanzato",      type:"individuale", notes:"Celebre notturno, richiede fraseggio cantabile" },
  { id:"r2",  title:"Invenzione n.1 in Do maggiore",      composer:"Johann S. Bach",    tonality:"Do maggiore",  difficulty:"Intermedio",     type:"individuale", notes:"Contrappunto a due voci" },
  { id:"r3",  title:"Partita n.2 in Re minore BWV 1004", composer:"Johann S. Bach",    tonality:"Re minore",    difficulty:"Professionale",  type:"individuale", notes:"Per violino solo" },
  { id:"r4",  title:"Sonata K.331 in La maggiore",        composer:"W.A. Mozart",       tonality:"La maggiore",  difficulty:"Intermedio",     type:"individuale", notes:"Tema con variazioni, Rondò alla Turca" },
  { id:"r5",  title:"Accordi jazz - Standard ii-V-I",     composer:"Traditional",       tonality:"Scala cromatica",difficulty:"Intermedio",   type:"individuale", notes:"Progressione fondamentale jazz" },
  { id:"r6",  title:"Ode alla Gioia",                     composer:"Ludwig van Beethoven",tonality:"Re maggiore", difficulty:"Elementare",    type:"collettivo",  notes:"Arrangiamento per orchestra scolastica" },
  { id:"r7",  title:"Canon in Re",                        composer:"Johann Pachelbel",  tonality:"Re maggiore",  difficulty:"Intermedio",     type:"collettivo",  notes:"Ensemble d'archi e fiati" },
  { id:"r8",  title:"Greensleeves",                       composer:"Traditional",       tonality:"Re minore",    difficulty:"Elementare",     type:"collettivo",  notes:"Arrangiamento corale" },
];

// Strumento → colore: chiave INS_HEX per evitare conflitti col nome CSS "color"
const INS_HEX = {
  Pianoforte: C.gold,
  Chitarra:   "#4ade80",
  Violino:    "#60a5fa",
  Flauto:     "#c084fc",
  Batteria:   "#fb923c",
  Saxofono:   "#f472b6",
  Tromba:     "#34d399",
  Basso:      "#a78bfa",
  Canto:      "#fbbf24",
  Clarinetto: "#2dd4bf",
};
const insHex = (instrument) => INS_HEX[instrument] || C.gold;

// Palette colori per corsi collettivi (ciclica, deterministica per nome/id)
const COLL_COLORS = ["#6d28d9","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#0284c7","#16a34a","#ea580c","#9333ea"];
const collHex = (l) => {
  const key = l.courseId || l.courseName || "";
  if (!key) return C.purple;
  let h = 0;
  for (let i = 0; i < key.length; i++) { h = ((h << 5) - h) + key.charCodeAt(i); h |= 0; }
  return COLL_COLORS[Math.abs(h) % COLL_COLORS.length];
};

// Presenza → colore
const attHex = (att) =>
  att === "presente"    ? C.green  :
  att === "assente"     ? C.red    :
  att === "giustificato"? C.gold   :
  att === "recupero"    ? C.blue   :
  att === "recuperata"  ? C.teal   :
  att === "in_recupero" ? '#f59e0b':
  att === "cambio_ora"  ? '#7c3aed': C.textDim;

const attBadge = (att) =>
  att === "presente"    ? "green"  :
  att === "assente"     ? "red"    :
  att === "recupero"    ? "blue"   :
  att === "recuperata"  ? "teal"   :
  att === "in_recupero" ? "gold"   : "gold";

const today    = new Date();
const addDays  = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate()+n); return dt; };
// Helpers lezioni collettive
const isColl      = l => _optionalChain([l, 'optionalAccess', _46 => _46.tipo]) === "collettivo";
const isProva     = l => _optionalChain([l, 'optionalAccess', _47 => _47.tipo]) === "prova";
const isSalaProve = l => _optionalChain([l, 'optionalAccess', _47b => _47b.tipo]) === "sala_prove";

// ── Inserimento SICURO di una lezione ricorrente ──────────────────────────────
// Previene duplicati con un guard globale + controllo Supabase prima di inserire
// Restituisce true se la lezione è stata inserita, false se già esisteva
const safeInsertRecurringLesson = async (lesson, setLessons) => {
  // Chiave univoca per questa lezione: data + ora + corso/studente
  const guardKey = `${lesson.date}_${lesson.hour}_${
    isColl(lesson) ? (lesson.courseId || lesson.courseName || 'coll') : (lesson.student || lesson.studentId || 'ind')
  }`;

  // 1. Check guard in-memory: previene doppio inserimento nello stesso tick
  const guard = window.__FM_LESSON_INSERTED__ || (window.__FM_LESSON_INSERTED__ = new Set());
  if (guard.has(guardKey)) {
    console.log('[FM] safeInsert: SKIP (guard in-memory)', guardKey);
    return false;
  }
  guard.add(guardKey);
  // Rimuovi dalla guard dopo 30s (per permettere future sessioni)
  setTimeout(() => guard.delete(guardKey), 30000);

  const sb = window.supabaseClient;
  if (!sb) return false;

  // 2. Check Supabase: la lezione esiste già nel DB?
  try {
    let q = sb.from('lezioni').select('id').eq('data', lesson.date).eq('ora', lesson.hour);
    if (isColl(lesson) && lesson.courseId) {
      q = q.eq('corso_id', lesson.courseId);
    } else if (lesson.student) {
      q = q.eq('student', lesson.student);
    }
    const { data: existing } = await q.limit(1);
    if (existing && existing.length > 0) {
      console.log('[FM] safeInsert: SKIP (già in Supabase)', guardKey, existing[0].id);
      // Aggiorna React state se non c'è già
      setLessons(prev => {
        const alreadyInState = prev.some(l => l.id === existing[0].id || (l.date === lesson.date && l.hour === lesson.hour && (isColl(lesson) ? l.courseId === lesson.courseId : l.student === lesson.student)));
        return alreadyInState ? prev : [...prev, {...lesson, id: existing[0].id}];
      });
      return false;
    }
  } catch(e) {
    console.warn('[FM] safeInsert check error:', e?.message);
  }

  // 3. Aggiorna _prev PRIMA dell'insert per bloccare il debounce di fm_sync
  if (window.__FM_UPDATE_PREV__) {
    const currentLessons = (window.__FM_DATA__?.lessons || []);
    window.__FM_UPDATE_PREV__({ lessons: [...currentLessons, lesson] });
  }

  // 4. Inserisci su Supabase
  const row = {
    id:               lesson.id,
    data:             lesson.date,
    ora:              lesson.hour       || null,
    student:          lesson.student    || null,
    studente_id:      lesson.studentId  ? parseInt(lesson.studentId, 10) : null,
    strumento:        lesson.instrument || lesson.strumento || null,
    teacher:          lesson.teacher    || null,
    room:             lesson.room       || null,
    topic:            null,            // azzerato: ogni lezione ricorrente ha il proprio argomento
    attendance:       null,
    recurrence:       lesson.recurrence || 'Nessuna',
    notes:            null,
    tipo:             lesson.tipo || lesson.type || 'individuale',
    link_url:         lesson.linkUrl    || null,
    in_recupero:      false,
    recupero_scadenza:null,
    durata:           lesson.durata     || null,
    corso_id:         lesson.courseId   || null,
    corso_nome:       lesson.courseName || null,
    students:         lesson.students && lesson.students.length > 0 ? JSON.stringify(lesson.students) : null,
  };

  try {
    const { error } = await sb.from('lezioni').insert(row);
    if (error) {
      if (error.code === '23505' || error.message?.includes('conflict') || error.message?.includes('duplicate')) {
        console.log('[FM] safeInsert: 409 ignorato (duplicato già gestito)', guardKey);
      } else {
        console.warn('[FM] safeInsert error:', error.message);
      }
      return false;
    }
    console.log('[FM] safeInsert: OK', guardKey);
    return true;
  } catch(e) {
    console.warn('[FM] safeInsert catch:', e?.message);
    return false;
  }
};
const lessonHex   = l => isColl(l) ? collHex(l) : isProva(l) ? C.teal : isSalaProve(l) ? C.orange2 : insHex(_optionalChain([l, 'optionalAccess', _48 => _48.instrument])||"");

// ── Google Calendar auto-sync ─────────────────────────────────────────────────
// Chiama la Edge Function gcal-sync per create/update/delete in background

// Controlla filtri GCal configurati
const gcalShouldSync = (lesson) => {
  const cfg = window.__gcalConfig__ || {};
  // Filtro per docente
  if (cfg.filtroDocente && cfg.filtroDocente.length > 0) {
    const d = (lesson.teacher||lesson.docente||'').toLowerCase();
    if (!cfg.filtroDocente.some(x => x.toLowerCase()===d)) return false;
  }
  // Filtro per corso (courseName o instrument come fallback)
  const filtroCorso = cfg.filtroCorso || cfg.filtroStrumento || [];
  if (filtroCorso.length > 0) {
    const corsoLezione = (lesson.courseName||lesson.corso_nome||lesson.instrument||lesson.strumento||'').toLowerCase();
    if (!filtroCorso.some(x => x.toLowerCase()===corsoLezione)) return false;
  }
  return true;
};

// Costruisce titolo evento GCal con template configurabile
window.gcalBuildCaption = (lesson, tpl) => {
  const t = tpl || (window.__gcalConfig__ && window.__gcalConfig__.captionTemplate) || '{studente} - {strumento}';
  return t
    .replace('{studente}',  lesson.student   ||lesson.studente ||'')
    .replace('{strumento}', lesson.instrument||lesson.strumento||'')
    .replace('{docente}',   lesson.teacher   ||lesson.docente  ||'')
    .replace('{aula}',      lesson.room      ||'')
    .replace('{argomento}', lesson.topic     ||'')
    .replace('{tipo}',      lesson.tipo      ||'individuale')
    .replace('{ora}',       (lesson.hour||'').slice(0,5))
    .trim();
};

const gcalSyncLesson = async (action, lesson) => {
  try {
    const sb = window.supabaseClient; if (!sb) return;
    const { data:{session} } = await sb.auth.getSession();
    if (!session?.user?.id) return;
    const { data: tokenRow } = await sb.from('google_calendar_tokens')
      .select('sync_enabled').eq('user_id', session.user.id).maybeSingle();
    if (!tokenRow?.sync_enabled) return;
    if (action === 'sync_one' && lesson && !gcalShouldSync(lesson)) return;
    const lessonOut = lesson ? { ...lesson, _gcalCaption: window.gcalBuildCaption(lesson) } : lesson;
    fetch(GCAL_EDGE, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer '+session.access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, user_id: session.user.id, lesson: lessonOut, lezione_id: lesson&&lesson.id }),
    }).catch(() => null);
  } catch(e) { /* silenzioso */ }
};
const GCAL_EDGE = 'https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/gcal-sync';
const studentInLesson = (l, name, studentId) => {
  if (isColl(l)) {
    const arr = l.students || [];
    // 1. Match diretto nell'array students
    if (arr.length > 0) {
      return arr.some(s =>
        (studentId != null && s.id != null && String(s.id) === String(studentId)) ||
        (s.name||'').toLowerCase() === (name||'').toLowerCase()
      );
    }
    // 2. Fallback: students array vuoto → la lezione è collettiva ma manca l'array
    //    (lezioni vecchie o caricate senza students). Non escludiamo l'allievo:
    //    se ha studentId → non possiamo verificare, restituiamo false per sicurezza
    //    L'admin/docente vedrà comunque la lezione tramite il teacher match
    return false;
  }
  // Individuali: match per ID
  if (studentId != null && l.studentId != null && String(l.studentId) === String(studentId)) return true;
  const ln = (l.student||'').toLowerCase().trim();
  const nn = (name||'').toLowerCase().trim();
  if (!ln || !nn) return false;
  return ln === nn || ln.includes(nn) || nn.includes(ln);
};
const lessonLabel = l => isColl(l)
  ? (l.courseName||"Collettiva")
  : (l.student||"");
const isSameDay = (a, b) => yyyymmdd(a) === yyyymmdd(b);

const startOfWeek = (d) => {
  const dt = new Date(d);
  const dow = dt.getDay();
  dt.setDate(dt.getDate() - ((dow === 0 ? 7 : dow) - 1));
  dt.setHours(0,0,0,0);
  return dt;
};

const fmtFull  = (d) => `${DAYS_FULL[((d.getDay()||7)-1)]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmtShort = (d) => `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)}`;

// Demo data
const makeLesson = (daysOffset, hour, student, instrument, teacher, room, topic, attendance="", recurrence="Nessuna") => {
  const d = new Date(today); d.setDate(d.getDate()+daysOffset);
  return { id:uid(), date:yyyymmdd(d), hour, student, instrument, teacher, room, topic, attendance, recurrence, notes:"" };
};
const makeLessonDate = (dateStr, hour, student, instrument, teacher, room, topic, attendance="") => ({
  id:uid(), date:dateStr, hour, student, instrument, teacher, room, topic, attendance, recurrence:"Nessuna", notes:""
});
const thisYear = today.getFullYear();
const thisMonth = today.getMonth()+1; // 1-based
const pad2 = n => String(n).padStart(2,"0");
const ym = (month, year=thisYear) => `${year}-${pad2(month)}`;

const INIT_LESSONS = (() => {
  // Anno scolastico: Sep anno_prec -> Giu anno_corrente (o Sep corrente -> Giu prossimo)
  const ref  = new Date(today);
  const refY = ref.getFullYear();
  const refM = ref.getMonth()+1;
  // anno scolastico corrente parte da settembre
  const annoInizio = refM >= 9 ? refY : refY-1;

  const makeD = (year, month, day, hour, student, instrument, teacher, room, topic, attendance="presente") => {
    const dd = String(day).padStart(2,"0");
    const mm = String(month).padStart(2,"0");
    return { id:uid(), date:`${year}-${mm}-${dd}`, hour, student, instrument, teacher, room, topic, attendance, recurrence:"Nessuna", notes:"" };
  };

  const lessons = [];
  // mese corrente + prossimi 5 giorni
  lessons.push(makeLesson(0,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Scale e arpeggi","presente","Ogni settimana"));
  lessons.push(makeLesson(0,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Sonate Baroque","presente","Ogni settimana"));
  lessons.push(makeLesson(0,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Tecnica respirazione","","Ogni settimana"));
  lessons.push(makeLesson(1,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Accordi barre","","Ogni settimana"));
  lessons.push(makeLesson(1,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Chopin Notturno","","Ogni settimana"));
  lessons.push(makeLesson(3,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Bach Partita","","Ogni settimana"));
  lessons.push(makeLesson(3,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Rudimenti","",""));
  lessons.push(makeLesson(4,  "10:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Vivaldi Sonata","","Ogni settimana"));
  lessons.push(makeLesson(-1, "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Scale minori","presente","Ogni settimana"));
  lessons.push(makeLesson(-1, "14:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Fingerpicking","presente",""));
  lessons.push(makeLesson(-2, "10:00","Emma Conti","Violino","Prof. Rossi","Sala A","Vibrato","assente","Ogni settimana"));
  lessons.push(makeLesson(-3, "09:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Tecnica staccato","presente",""));
  lessons.push(makeLesson(-4, "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Rudimenti base","presente",""));
  lessons.push(makeLesson(-5, "14:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Scale maggiori","presente",""));

  // Dati storici per i mesi dell'anno scolastico
  const DATA_STORICI = [
    // [month_offset_from_sep, day, hour, student, instrument, teacher, room, topic, att]
    // Settembre
    [0,  5,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Presentazione programma","presente"],
    [0,  7,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Presentazione programma","presente"],
    [0,  9,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Presentazione programma","presente"],
    [0, 12,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Hanon op.1","presente"],
    [0, 12,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Esercizi di intonazione","presente"],
    [0, 14,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Scale diatoniche","presente"],
    [0, 16,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Paradiddle base","presente"],
    [0, 19,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Czerny op.299","presente"],
    [0, 19,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Sevcik op.1","assente"],
    [0, 21,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Taffanel-Gaubert","presente"],
    [0, 26,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Bach invenzione","presente"],
    [0, 26,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Clementi sonatina","presente"],
    [0, 28,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Arpeggi","presente"],
    [0, 28,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Groove 4/4","presente"],
    // Ottobre
    [1,  3,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Beethoven sonatina","presente"],
    [1,  3,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Kreutzer op.42 n.1","presente"],
    [1,  5,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Carcassi op.60","presente"],
    [1,  5,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Quantz sonata","presente"],
    [1,  7,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Triplet feel","presente"],
    [1, 10,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Mozart KV 331","presente"],
    [1, 10,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Kreutzer n.2","assente"],
    [1, 10,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Scale in ottave","presente"],
    [1, 14,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Giuliani op.1","presente"],
    [1, 14,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Devienne sonata","presente"],
    [1, 17,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Chopin valzer","presente"],
    [1, 21,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Tarrega studio","presente"],
    [1, 21,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Shuffle blues","presente"],
    [1, 24,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Bach partita","presente"],
    [1, 28,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Scarlatti K.1","presente"],
    [1, 28,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Hanon velocità","presente"],
    // Novembre
    [2,  4,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Chopin notturno","presente"],
    [2,  4,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Vivaldi concerto","presente"],
    [2,  4,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Bach sonata","presente"],
    [2,  6,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Barrios","presente"],
    [2,  6,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Jazz swing","assente"],
    [2, 11,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Liszt studio","presente"],
    [2, 11,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Telemann fantasia","presente"],
    [2, 13,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Villa-Lobos","presente"],
    [2, 13,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Debussy arabesque","presente"],
    [2, 13,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Fill poliritmici","presente"],
    [2, 18,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Ravel sonatine","presente"],
    [2, 20,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Kuhlau op.51","assente"],
    [2, 25,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Preparazione saggio","presente"],
    [2, 25,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Preparazione saggio","presente"],
    [2, 27,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Preparazione saggio","presente"],
    // Dicembre
    [3,  2,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Saggio natale - prove","presente"],
    [3,  2,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Saggio natale - prove","presente"],
    [3,  4,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Saggio natale - prove","presente"],
    [3,  4,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Saggio natale - prove","presente"],
    [3,  9,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Finale repertorio","presente"],
    [3, 11,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Finale repertorio","presente"],
    [3, 16,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Ultima lezione","presente"],
    [3, 16,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Ultima lezione","presente"],
    // Gennaio (annoInizio+1)
    [4,  8,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Ripresa anno","presente"],
    [4,  8,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Ripresa anno","presente"],
    [4, 10,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Ripresa anno","presente"],
    [4, 13,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Scarlatti","presente"],
    [4, 15,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Latin groove","presente"],
    [4, 20,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Bach invenzione 8","presente"],
    [4, 20,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Handel sonata","presente"],
    [4, 22,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Hotteterre","presente"],
    [4, 27,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Beethoven op.49","presente"],
    // Febbraio
    [5,  3,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Chopin studio","presente"],
    [5,  3,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Sor op.6","presente"],
    [5,  5,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Mendelssohn concerto","presente"],
    [5,  5,  "16:00","Marco Ricci","Batteria","Prof. Verde","Sala B","Afro-cuban","presente"],
    [5, 10,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Scale minori","presente"],
    [5, 10,  "15:00","Giulia Romano","Flauto","Prof. Bianchi","Sala C","Telemann","assente"],
    [5, 12,  "14:00","Alessandro Gallo","Pianoforte","Prof. Rossi","Sala A","Clementi op.36","presente"],
    [5, 17,  "11:00","Emma Conti","Violino","Prof. Rossi","Sala A","Kreutzer n.12","presente"],
    [5, 17,  "10:00","Luca Ferrara","Chitarra","Prof. Bianchi","Sala B","Giuliani arpeggi","presente"],
    [5, 24,  "09:00","Sofia Marchetti","Pianoforte","Prof. Rossi","Sala A","Scarlatti K.466","presente"],
  ];

  DATA_STORICI.forEach(([moff, day, ...rest]) => {
    // moff: 0=Set, 1=Ott, 2=Nov, 3=Dic, 4=Gen, 5=Feb, 6=Mar, 7=Apr, 8=Mag, 9=Giu
    let month, year;
    if(moff <= 3) {       // Set-Dic anno inizio
      month = 9 + moff;
      year  = annoInizio;
    } else {              // Gen-Giu anno successivo
      month = moff - 3;   // 4->1(Gen), 5->2(Feb)...
      year  = annoInizio + 1;
    }
    // Non aggiungere lezioni future (dopo oggi)
    const d = new Date(year, month-1, day);
    if(d > ref) return;
    lessons.push(makeD(year, month, day, ...rest));
  });

  return lessons;
})();

// ─── FORM LEZIONE ─────────────────────────────────────────────────────────────
// Presenza che conta come lezione svolta (pagabile al docente)
const PRESENZE_PAGATE = ['presente','assente'];
const PRESENZE_SVOLTE = ['presente','assente'];
const isLezionePagabile = (l) => PRESENZE_PAGATE.includes((l.attendance||'').toLowerCase());
const isLezioneSvolta   = (l) => PRESENZE_SVOLTE.includes((l.attendance||'').toLowerCase());

const emptyLesson = { date:yyyymmdd(today), hour:"09:00", student:"", instrument:"", teacher:"", room:"", topic:"", attendance:"", recurrence:"", notes:"", exercises:"", repertorioIds:[], linkUrl:"", allegati:[], inRecupero:false, recuperoScadenza:null, durata:45 };

// ─── ATT_STYLES globale (usato da LessonForm, LessonDetailModal, LezioniAdminView, RecuperoView)
const ATT_STYLES = {
  presente:    { bg:C.greenBg,  fg:C.green,  bd:C.greenBorder,  label:'Presente'    },
  assente:     { bg:C.redBg,    fg:C.red,    bd:C.redBorder,    label:'Assente'     },
  giustificato:{ bg:"#e8edf5",  fg:C.gold,   bd:C.goldDim,      label:'Giustificato'},
  recupero:    { bg:C.blueBg,   fg:C.blue,   bd:C.blueBorder,   label:'Recupero'    },
  in_recupero: { bg:'rgba(255,160,0,0.10)', fg:'#f59e0b', bd:'rgba(245,158,11,0.4)', label:'In recupero' },
  recuperata:  { bg:C.tealBg,   fg:C.teal,   bd:C.tealBorder,   label:'Recuperata'  },
  cambio_ora:  { bg:'rgba(139,92,246,0.10)', fg:'#7c3aed', bd:'rgba(139,92,246,0.4)', label:'Cambio ora'  },
};

const LessonForm = ({ initial, onSave, onClose, repertorio:_repertorioRaw, onAddBrano, students:_studentsRaw, docenti:_docentiFLes, courses:_coursesRaw, role:_roleLF }) => {
  const roleLF = _roleLF || "admin"; // admin = può modificare data; docente = data readOnly
  const _teacherOptsLes = (_docentiFLes||[]).map(d=>({value:d.nome||d.name||"",label:d.nome||d.name||""}));
  const repertorio = _repertorioRaw || [];
  // Lista allievi dinamica: usa quella passata come prop, con fallback alla lista statica
  const dynamicStudents = (_studentsRaw || [])
    .filter(s => s.status === 'attivo' || !s.status)
    .map(s => s.name || s.nome || '')
    .filter(Boolean)
    .sort();

  // Strumenti dinamici: da studenti reali (instrument + extraInstruments) + nomi corsi individuali
  const dynamicInstruments = useMemo(() => {
    const set = new Set();
    // Da studenti
    (_studentsRaw||[]).forEach(s => {
      if (s.instrument) set.add(s.instrument);
      (s.extraInstruments||[]).forEach(i => { if(i) set.add(i); });
    });
    // Da corsi individuali
    (_coursesRaw||[]).filter(c=>c.type!=="collettivo").forEach(c => { if(c.name) set.add(c.name); });
    // Fallback a lista statica se non ci sono dati reali
    if (set.size === 0) INSTRUMENTS.forEach(i => set.add(i));
    return [...set].sort();
  }, [_studentsRaw, _coursesRaw]);

  // Sale dinamiche: da corsi (se hanno sala) + lista statica come fallback
  const dynamicRooms = useMemo(() => {
    const set = new Set();
    (_studentsRaw||[]).forEach(s => { /* niente sale dagli studenti */ });
    // Usa ROOMS come base + aggiungi eventuali sale dai corsi
    ROOMS.forEach(r => set.add(r));
    return [...set];
  }, []);

  // Ref che mappa id → brano appena creato in questa sessione del form
  // Usato da handleSave per includere i brani nel payload senza dipendere da window.__repertorio__
  const newlyCreatedBraniRef = React.useRef({});
  const [showBranoForm, setShowBranoForm] = useState(false);
  const [f, setF] = useState(initial || emptyLesson);
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));

  const hours = Array.from({length:56}, (_, i) => {
    const h = Math.floor(i/4)+8;
    const m = (i%4)*15;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
  }).filter(h => h <= "21:45");

  // Auto-compila strumento e insegnante quando si seleziona un allievo
  useEffect(() => {
    if (!f.student || !_studentsRaw) return;
    const st = (_studentsRaw || []).find(s => (s.name || s.nome || '') === f.student);
    if (!st) return;
    // Strumento principale dell'allievo → pre-seleziona strumento lezione
    const instr = st.instrument || st.strumento || '';
    // Docente principale dell'allievo → pre-seleziona insegnante
    const teacher = st.teacher || st.docente || st.teacherName || '';
    setF(prev => ({
      ...prev,
      instrument: prev.instrument || instr,
      teacher:    prev.teacher    || teacher,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.student]);

  const validate = () => {
    const e = {};
    if(!f.date)       e.date       = "Data obbligatoria";
    if(!f.hour)       e.hour       = "Orario obbligatorio";
    if(!f.student)    e.student    = "Allievo obbligatorio";
    if(!f.instrument) e.instrument = "Strumento obbligatorio";
    if(!f.teacher)    e.teacher    = "Insegnante obbligatorio";
    if(!f.recurrence) e.recurrence = "Seleziona la ricorrenza";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if(Object.keys(e).length){ setErr(e); return; }
    // Allega i brani appena creati al payload così handleAdd può costruire
    // le entry student.repertorio senza dipendere da window.__repertorio__
    onSave({ ...f, _newBrani: newlyCreatedBraniRef.current });
  };

  // ATT_STYLES: vedi definizione globale

  const SDiv = ({ label }) => (
    React.createElement('div', { style: {gridColumn:"1/-1", fontSize:10, color:C.textDim, letterSpacing:"0.12em",
      textTransform:"uppercase", paddingBottom:4, borderBottom:`1px solid ${C.border}`, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4216}}
      , label
    )
  );

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4224}}
        , roleLF !== "docente" && React.createElement(SDiv, { label: "Quando", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4225}})
        , roleLF !== "docente" && React.createElement(Input, { label: "Data *" , type: "date", value: f.date, onChange: e => set("date", e.target.value), error: err.date, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4226}})
        , roleLF !== "docente" && React.createElement(Sel, { label: "Orario *" , value: f.hour, onChange: e => set("hour", e.target.value), options: hours, error: err.hour, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4227}})
        , roleLF !== "docente" && React.createElement(Sel, { label: "Durata" , value: String(f.durata||45), onChange: e => set("durata", parseInt(e.target.value)), options: [{value:"30",label:"30 min"},{value:"45",label:"45 min"},{value:"60",label:"60 min"},{value:"90",label:"1h 30min"},{value:"120",label:"2 ore"}] })

        , React.createElement(SDiv, { label: "Chi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4229}})
        , roleLF !== "docente"
          ? React.createElement(Sel, { label: "Allievo *", value: f.student, onChange: e => set("student", e.target.value), options: dynamicStudents.length > 0 ? dynamicStudents : STUDENTS_LIST, error: err.student })
          : React.createElement(Input, { label: "Allievo", value: f.student || "—", readOnly: true })
        , roleLF !== "docente"
          ? React.createElement(Sel, { label: "Strumento *", value: f.instrument, onChange: e => set("instrument", e.target.value), options: dynamicInstruments, error: err.instrument })
          : React.createElement(Input, { label: "Strumento", value: f.instrument || "—", readOnly: true })
        , roleLF !== "docente"
          ? React.createElement(Sel, { label: "Insegnante *", value: f.teacher, onChange: e => set("teacher", e.target.value), options: _teacherOptsLes.length>0 ? _teacherOptsLes : TEACHERS, error: err.teacher })
          : React.createElement(Input, { label: "Insegnante", value: f.teacher || "—", readOnly: true })
        , roleLF !== "docente"
          ? React.createElement(Sel, { label: "Sala", value: f.room, onChange: e => set("room", e.target.value), options: dynamicRooms })
          : React.createElement(Input, { label: "Sala", value: f.room || "—", readOnly: true })

        , React.createElement(SDiv, { label: "Contenuto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4235}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4236}}, React.createElement(Input, { label: "Argomento", value: f.topic, onChange: e => set("topic", e.target.value), placeholder: "Es. Scale maggiori, Chopin Notturno..."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4236}}))
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4237}}, React.createElement(Textarea, { label: "Note",   value: f.notes, onChange: e => set("notes", e.target.value), placeholder: "Note aggiuntive..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4237}}))
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4238}}, React.createElement(Textarea, { label: "Esercizi da svolgere"  , value: f.exercises, onChange: e => set("exercises", e.target.value), placeholder: "Es. Studiare scale in Do maggiore, ripetere battute 12-24..."        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4238}}))

        , React.createElement(SDiv, { label: "Presenza", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4240}})
        , React.createElement('div', { style: {gridColumn:"1/-1", display:"flex", gap:8, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4241}}
          , (f.attendance === 'recuperata')
            ? React.createElement('div', {style:{display:'flex',alignItems:'center',gap:8}}
                , React.createElement('span', {style:{background:C.tealBg,color:C.teal,border:'1px solid '+C.tealBorder,borderRadius:8,padding:'8px 16px',fontSize:12,fontWeight:600}}, '✅ Recuperata')
                , (f.notesRecupero||f.notes_recupero) && React.createElement('span',{style:{fontSize:12,color:C.textMuted,fontStyle:'italic'}}, f.notesRecupero||f.notes_recupero)
                , React.createElement('span',{style:{fontSize:11,color:C.textDim}},'(sola lettura)')
              )
            : ["presente","assente","giustificato","recupero","in_recupero","cambio_ora"].map(a => {
              const s = ATT_STYLES[a] || ATT_STYLES.presente;
              const active = a === 'in_recupero'
                ? (f.attendance === 'in_recupero' || f.inRecupero === true)
                : f.attendance === a;
              return (
                React.createElement('button', { key: a, onClick: () => set("attendance", active ? "" : a),
                  style: {flex:1, minWidth:90, padding:"9px 12px", borderRadius:8,
                    border:`2px solid ${active ? s.bd : C.border}`,
                    background: active ? s.bg : C.bg,
                    cursor:"pointer", fontSize:12,
                    color: active ? s.fg : C.textMuted,
                    fontFamily:"'Open Sans',sans-serif", fontWeight: active ? 500 : 400,
                    textTransform:"capitalize", transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4246}}
                  , s.label || a
                )
              );
            })
        )

        , React.createElement(SDiv, { label: "Repertorio studiato" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4260}})
        , React.createElement('div', { style: {gridColumn:"1/-1", display:"flex", flexDirection:"column", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4261}}
          , React.createElement(React.Fragment, null
                /* Tendina di selezione */
                , React.createElement('select', {
                  value: "",
                  onChange: e => {
                    const id = e.target.value;
                    if(!id) return;
                    const ids = f.repertorioIds||[];
                    if(!ids.includes(id)) set("repertorioIds", [...ids, id]);
                  },
                  style: {background:C.bg, border:`1px solid ${C.border}`, borderRadius:8,
                    color:C.textMuted, fontSize:13, padding:"10px 14px", width:"100%",
                    fontFamily:"'Open Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4264}}
                  , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4275}}, repertorio.length === 0 ? "Nessun brano nel catalogo" : "+ Aggiungi brano al repertorio...")
                  , repertorio.filter(b=>!(f.repertorioIds||[]).includes(b.id)).map(b => (
                    React.createElement('option', { key: b.id, value: b.id }
                      , b.title, b.composer ? ` — ${b.composer}` : "", b.tonality ? ` (${b.tonality})` : ""
                    )
                  ))
                )

                /* Pills dei brani selezionati */
                , (f.repertorioIds||[]).length > 0 && (
                  React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4293}}
                    , (f.repertorioIds||[]).map(id => {
                      const b = repertorio.find(r => r.id === id);
                      if(!b) return null;
                      const typeHex = (b.tipo||b.type) === "collettivo" ? C.purple : C.gold;
                      const typeBg  = (b.tipo||b.type) === "collettivo" ? C.purpleBg : "#e8edf5";
                      const typeBd  = (b.tipo||b.type) === "collettivo" ? C.purpleBorder : C.goldDim;
                      return (
                        React.createElement('div', { key: id, style: {display:"flex", alignItems:"center", gap:10,
                          padding:"8px 12px", borderRadius:8,
                          border:`1px solid ${typeBd}`, background:typeBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4301}}
                          , React.createElement(Ic, { n: "note", size: 13, stroke: typeHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4304}})
                          , React.createElement('div', { style: {flex:1, minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4305}}
                            , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:typeHex,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4306}}, b.title)
                            , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4308}}
                              , b.composer, b.tonality ? ` · ${b.tonality}` : ""
                            )
                          )
                          , React.createElement('button', { onClick: () => set("repertorioIds", (f.repertorioIds||[]).filter(i=>i!==id)),
                            style: {background:"none", border:"none", cursor:"pointer", padding:4,
                              display:"flex", borderRadius:4, flexShrink:0, color:C.textMuted,
                              transition:"color 0.12s"},
                            onMouseEnter: e => e.currentTarget.style.color=C.red,
                            onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4312}}
                            , React.createElement(Ic, { n: "x", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4318}})
                          )
                        )
                      );
                    })
                  )
                )

                /* Pulsante aggiungi nuovo brano */
                , !showBranoForm && (
                  React.createElement('button', { onClick: () => setShowBranoForm(true),
                    style: {display:"flex", alignItems:"center", gap:7, padding:"8px 12px",
                      background:"none", border:`1px dashed ${C.goldDim}`, borderRadius:8,
                      cursor:"pointer", color:C.goldDim, fontSize:12,
                      fontFamily:"'Open Sans',sans-serif", transition:"all 0.15s", width:"fit-content"},
                    onMouseEnter: e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.color=C.gold; },
                    onMouseLeave: e => { e.currentTarget.style.borderColor=C.goldDim; e.currentTarget.style.color=C.goldDim; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4328}}
                    , React.createElement(Ic, { n: "plus", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4335}}), "Crea nuovo brano e aggiungilo"

                  )
                )

                /* Form inline inserimento brano */
                , showBranoForm && (
                  React.createElement('div', { style: {border:`1px solid ${C.goldDim}`, borderRadius:10, overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4342}}
                    , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"10px 14px", background:"#e8edf5", borderBottom:`1px solid ${C.goldDim}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4343}}
                      , React.createElement('span', { style: {fontSize:12, color:C.gold, fontWeight:500, display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4345}}
                        , React.createElement(Ic, { n: "plus", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4346}}), "Nuovo brano nel catalogo"
                      )
                      , React.createElement('button', { onClick: () => setShowBranoForm(false),
                        style: {background:"none", border:"none", cursor:"pointer", color:C.textMuted, display:"flex", padding:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4348}}
                        , React.createElement(Ic, { n: "x", size: 15, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4350}})
                      )
                    )
                    , React.createElement('div', { style: {padding:14, display:"flex", flexDirection:"column", gap:10, background:C.surface}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4353}}
                      , React.createElement(BranoFormInline, {
                        onSave: b => {
                          const newId = "r_"+Date.now();
                          const newBrano = {...b, id:newId, tipo: b.tipo||b.type||"individuale", note: b.note||b.notes||""};
                          // Salva nel ref locale per handleSave
                          newlyCreatedBraniRef.current[newId] = newBrano;
                          onAddBrano(newBrano);
                          set("repertorioIds", [...(f.repertorioIds||[]), newId]);
                          setShowBranoForm(false);
                        },
                        onClose: () => setShowBranoForm(false),
                        compact: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4354}}
                      )
                    )
                  )
                )
              )

        )

        , React.createElement(SDiv, { label: "Risorse", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4370}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4370}}
          , React.createElement(Input, { label: "Link (YouTube, Drive, altro)", type:"url", value: f.linkUrl||"", onChange: e => set("linkUrl", e.target.value), placeholder: "https://...", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4370}})
        )
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}}
          , React.createElement('div', { style: {fontSize:10, color:C.textDim, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8}}, "Allegati")
          , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:6}}
            , (f.allegati||[]).map((a,i) => (
              React.createElement('div', { key: i, style: {display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, background:C.bg}}
                , React.createElement(Ic, { n: "paperclip", size: 13, stroke: C.blue, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}})
                , React.createElement('div', { style: {flex:1, minWidth:0}}
                  , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}, a.fileName || a.name)
                  , a.descrizione && React.createElement('div', { style: {fontSize:11, color:C.textMuted}}, a.descrizione)
                )
                , React.createElement('button', { onClick: () => set("allegati", (f.allegati||[]).filter((_,j)=>j!==i)),
                  style: {background:"none", border:"none", cursor:"pointer", padding:4, color:C.textMuted, display:"flex", borderRadius:4},
                  onMouseEnter: e => e.currentTarget.style.color=C.red,
                  onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}}
                  , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}})
                )
              )
            ))
            , React.createElement('label', { style: {display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
              background:"none", border:`1px dashed ${C.border}`, borderRadius:8,
              cursor:"pointer", color:C.textMuted, fontSize:12, fontFamily:"'Open Sans',sans-serif",
              transition:"all 0.15s"},
              onMouseEnter: e => { e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.color=C.blue; },
              onMouseLeave: e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}}
              , React.createElement(Ic, { n: "upload", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}})
              , "Allega file"
              , React.createElement('input', { type:"file", style: {display:"none"}, multiple: true,
                onChange: async e => {
                  const files = Array.from(e.target.files||[]);
                  if (!files.length) return;
                  const sb = window.supabaseClient;
                  const newAllegati = [];
                  for (const file of files) {
                    const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
                    let fileUrl = null;
                    if (sb) {
                      try {
                        const { error: upErr } = await sb.storage.from('allegati').upload(path, file, { upsert: true });
                        if (!upErr) {
                          const { data: urlData } = sb.storage.from('allegati').getPublicUrl(path);
                          fileUrl = urlData?.publicUrl || null;
                        }
                      } catch(err) { console.warn('[FM] upload error', err); }
                    }
                    newAllegati.push({
                      id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
                      fileName: file.name,
                      fileUrl,
                      fileType: file.type,
                      descrizione: '',
                      corso: f.instrument || '',
                    });
                  }
                  set("allegati", [...(f.allegati||[]), ...newAllegati]);
                  e.target.value = '';
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4371}})
            )
          )
        )

        , React.createElement(SDiv, { label: err.recurrence ? `Ricorrenza * — ${err.recurrence}` : "Ricorrenza *", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4372}})
        , roleLF === "docente"
          ? React.createElement('div', { style: {gridColumn:"1/-1"} }
              , React.createElement('div', {style:{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:20,
                  background:C.surface,border:`1px solid ${C.border}`,fontSize:12,color:C.textMuted}}
                , React.createElement(Ic,{n:"repeat",size:12,stroke:C.textMuted})
                , f.recurrence || "Nessuna"
                , React.createElement('span',{style:{fontSize:10,color:C.textDim,marginLeft:4}},"(non modificabile)")
              )
            )
          : React.createElement('div', { style: {gridColumn:"1/-1", display:"flex", gap:8, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4373}}
              , RECURRENCE_OPTS.map(r => (
                React.createElement('button', { key: r, onClick: () => { set("recurrence", r); setErr(p=>({...p,recurrence:undefined})); },
                  style: {padding:"8px 14px", borderRadius:20,
                    border:`2px solid ${f.recurrence === r ? C.blue : err.recurrence ? C.red : C.border}`,
                    background: f.recurrence === r ? C.blueBg : err.recurrence ? C.redBg : C.bg,
                    cursor:"pointer", fontSize:12,
                    color: f.recurrence === r ? C.blue : err.recurrence ? C.red : C.textMuted,
                    fontFamily:"'Open Sans',sans-serif", fontWeight: f.recurrence === r ? 500 : 400,
                    transition:"all 0.12s", display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4375}}
                  , r !== "Nessuna" && React.createElement(Ic, { n: "repeat", size: 12, stroke: f.recurrence === r ? C.blue : err.recurrence ? C.red : C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4383}})
                  , r
                )
              ))
            )
      )

      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)", display:"flex", justifyContent:"flex-end", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4390}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4391}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4392}}, React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4392}}), _optionalChain([initial, 'optionalAccess', _49 => _49.id]) ? "Salva modifiche" : "Aggiungi lezione")
      )
    )
  );
};

// ─── PILL LEZIONE ─────────────────────────────────────────────────────────────
const LessonPill = ({ lesson, onClick, compact=false }) => {
  const hex    = lessonHex(lesson);        // viola per collettive, colore strumento per individuali
  const dotHex = attHex(lesson.attendance);

  const bgNormal  = `${hex}15`;
  const bdNormal  = `${hex}35`;
  const bgHover   = `${hex}28`;
  const bdHover   = `${hex}65`;

  return (
    React.createElement('div', {
      onClick: onClick,
      style: {
        background: bgNormal,
        border: `1px solid ${bdNormal}`,
        borderLeft: `3px solid ${hex}`,
        borderRadius: 6,
        padding: compact ? "3px 5px" : "7px 9px",
        cursor: "pointer",
        transition: "all 0.15s",
        overflow: "hidden",
        minWidth: 0,
        width: "100%",
        boxSizing: "border-box",
      },
      onMouseEnter: e => {
        e.currentTarget.style.background  = bgHover;
        e.currentTarget.style.borderColor = bdHover;
      },
      onMouseLeave: e => {
        e.currentTarget.style.background  = bgNormal;
        e.currentTarget.style.borderColor = bdNormal;
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4409}}

      /* Riga 1: ora · nome/corso */
      , (() => {
        let label = "";
        if(lesson.tipo==="collettivo") label = lesson.hour + " · " + (lesson.courseName||"Collettiva");
        else if(lesson.tipo==="prova") label = lesson.hour + " · Prova";
        else if(lesson.tipo==="sala_prove") label = lesson.hour + " · Sala Prove";
        else label = lesson.hour + " · " + (lesson.student||"").split(" ")[0];
        // Tronca etichetta se troppo lunga per celle strette
        if(compact && label.length > 16) label = label.slice(0, 15) + "…";
        return (
          React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4442}}
            , React.createElement('div', { style: {fontSize: compact ? 10 : 12, fontWeight:600, color:hex,
              lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
              flex:1, minWidth:0, maxWidth:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4443}}
              , label
            )
            , lesson.tipo==="collettivo" && (
              React.createElement('div', { style: {fontSize:9, color:hex, fontWeight:700, flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4449}}
                , "\u25CF", (lesson.students||[]).length
              )
            )
            , lesson.tipo==="prova" && (
              React.createElement('span', { style: {fontSize:9, color:C.teal, fontWeight:700, textTransform:"uppercase", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4454}}, "prova"
                , lesson.iscritto ? " \u2713" : ""
              )
            )
            , lesson.tipo==="sala_prove" && (
              React.createElement('span', { style: {fontSize:9, color:C.orange2, fontWeight:700, textTransform:"uppercase", flexShrink:0} }
                , lesson.stato==="in_attesa" ? "⏳" : "🤘"
              )
            )
            , lesson.tipo!=="sala_prove" && (lesson.attendance || lesson.inRecupero) && (
              React.createElement('div', { style: {width:6, height:6, borderRadius:"50%",
                background: lesson.inRecupero && !lesson.attendance ? '#f59e0b' : dotHex,
                flexShrink:0, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4459}})
            )
          )
        );
      })()
      /* Riga 2: sottotitolo */
      , React.createElement('div', { style: {fontSize:9, color:hex, opacity:0.75, marginTop:1,
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4465}}
        , lesson.tipo==="collettivo"
          ? (lesson.students||[]).length + " allievi"
          : lesson.tipo==="prova"
          ? (lesson.instrument||"") + (lesson.phone ? " \u00b7 " + lesson.phone : "")
          : lesson.tipo==="sala_prove"
          ? (lesson.richiedente||lesson.student||"") + (lesson.oraFine ? " → "+(lesson.oraFine||"").slice(0,5) : "")
          : lesson.instrument||""
      )
    )
  );
};

// ─── MODAL DETTAGLIO ─────────────────────────────────────────────────────────
const LessonDetailModal = ({ lesson, onEdit, onDelete, onAttendance, onIscrizione, onClose, role, nextLessonDate, students, onUpdateLesson, allegatiGlobali }) => {
  const canEdit = role === 'admin' || role === 'docente';
  const studentsList = students || [];
  const hex = lessonHex(lesson);

  // Recupero scaduto: per admin mostra banner con possibilità di proroga
  const isRecuperoScaduto = lesson.inRecupero && lesson.recuperoScadenza &&
    new Date(lesson.recuperoScadenza+'T00:00:00') < new Date(new Date().toISOString().split('T')[0]+'T00:00:00');
  // ATT_STYLES: vedi definizione globale

  const [showIscrizionePanel, setShowIscrizionePanel] = useState(false);
  const [iscrizioneStudent, setIscrizioneStudent] = useState("");

  // Stato locale per editing inline
  const [localTopic,     setLocalTopic]     = useState(lesson.topic     || "");
  const [localExercises, setLocalExercises] = useState(lesson.exercises || "");
  const [localLinkUrl,   setLocalLinkUrl]   = useState(lesson.linkUrl   || "");
  // Allegati: usa prima quelli da allegatiGlobali (da Supabase), poi lesson.allegati
  const allegatiFiltrati = (allegatiGlobali||[]).filter(a=>(a.lezioneId||a.lezione_id)===lesson.id);
  const [localAllegati,  setLocalAllegati]  = useState(allegatiFiltrati.length > 0 ? allegatiFiltrati : (lesson.allegati || []));
  // Aggiorna se cambiano gli allegati globali
  useEffect(()=>{ if(allegatiGlobali){ const f=(allegatiGlobali||[]).filter(a=>(a.lezioneId||a.lezione_id)===lesson.id); setLocalAllegati(f); } },[allegatiGlobali]);
  const [saving, setSaving] = useState(false);

  const saveField = (patch) => {
    if (!onUpdateLesson) return;
    setSaving(true);
    onUpdateLesson({ ...lesson, ...patch });
    setTimeout(() => setSaving(false), 600);
  };

  const InlineLabel = ({ label, icon, color }) => (
    React.createElement('div', { style: {fontSize:10, color:color||C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6, display:"flex", alignItems:"center", gap:5}}
      , icon && React.createElement(Ic, {n:icon, size:11, stroke:color||C.textMuted})
      , label
    )
  );

  const SaveDot = () => saving
    ? React.createElement('span', {style:{fontSize:10,color:C.green,marginLeft:6}}, "✓ salvato")
    : null;

  return (
    React.createElement(Modal, { title: "Dettaglio lezione" , onClose: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4493}}
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4494}}
        , React.createElement('div', { style: {display:"flex", gap:14, alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4495}}
          , React.createElement('div', { style: {width:46, height:46, borderRadius:10,
            background: lesson.tipo==="collettivo" ? C.purpleBg : lesson.tipo==="prova" ? C.tealBg : `${hex}20`,
            border:`1px solid ${lesson.tipo==="collettivo" ? C.purpleBorder : lesson.tipo==="prova" ? C.tealBorder : `${hex}40`}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4496}}
            , React.createElement(Ic, { n: lesson.tipo==="collettivo"?"group":lesson.tipo==="prova"?"user":"music",
               size: 20, stroke: lesson.tipo==="collettivo"?C.purple:lesson.tipo==="prova"?C.teal:hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4500}})
          )
          , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4503}}
            , lesson.tipo==="collettivo" ? (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {fontSize:17, fontWeight:600, fontFamily:"'Oswald',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4506}}, lesson.courseName)
                , React.createElement('div', { style: {fontSize:13, color:C.purple, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4507}}, "Lezione collettiva · "   , lesson.teacher)
              )
            ) : lesson.tipo==="prova" ? (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4511}}
                  , React.createElement('div', { style: {fontSize:17, fontWeight:600, fontFamily:"'Oswald',sans-serif", color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4512}}
                    , lesson.contactName || "Lezione di prova"
                  )
                  , lesson.iscritto
                    ? React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,
                        border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4516}}, "Iscritto ✓"
                         , lesson.student ? ` — ${lesson.student}` : ""
                      )
                    : React.createElement('span', { style: {fontSize:11,background:C.tealBg,color:C.teal,
                        border:`1px solid ${C.tealBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4520}}, "Non ancora iscritto"
                      )
                )
                , React.createElement('div', { style: {fontSize:13, color:C.teal, opacity:0.85, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4526}}
                  , lesson.instrument, lesson.teacher ? ` · ${lesson.teacher}` : ""
                  , lesson.phone
                    ? React.createElement('span', { style: {color:C.textMuted, display:"inline-flex", alignItems:"center", gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4529}}
                        , " · ", "📞 " , React.createElement('span', { style: {color:C.teal,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4530}}, lesson.phone)
                      )
                    : ""
                )
              )
            ) : (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {fontSize:17, fontWeight:600, fontFamily:"'Oswald',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4537}}, lesson.student)
                , React.createElement('div', { style: {fontSize:13, color:hex, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4538}}, lesson.instrument)
              )
            )
          )
          , lesson.recurrence !== "Nessuna" && React.createElement(Badge, { label: lesson.recurrence, variant: "blue", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4542}})
          , lesson.tipo==="collettivo" && React.createElement('span', { style:{background:`${hex}15`,color:hex,border:`1px solid ${hex}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap",display:"inline-block"}}, "Collettiva")
          , lesson.tipo==="prova" && React.createElement(Badge, { label: "Prova", variant: "teal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4544}})
        )

        , React.createElement('div', { className: "info-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4547}}
          , [
            {icon:"cal",   label:"Data",       value:fmtFull(new Date(lesson.date+"T00:00:00"))},
            {icon:"clock", label:"Orario",     value:lesson.hour},
            {icon:"user",  label:"Insegnante", value:lesson.teacher},
            {icon:"music", label:"Sala",       value:lesson.room || "—"},
          ].map(r => (
            React.createElement('div', { key: r.label, style: {display:"flex", gap:8, padding:"10px 12px",
              background:C.bg, borderRadius:8, border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4554}}
              , React.createElement(Ic, { n: r.icon, size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4556}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4557}}
                , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4558}}, r.label)
                , React.createElement('div', { style: {fontSize:13, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4559}}, r.value)
              )
            )
          ))
        )

        , lesson.tipo==="collettivo" && (lesson.students||[]).length > 0 && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.purpleBg, borderRadius:8, border:`1px solid ${C.purpleBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4566}}
            , React.createElement('div', { style: {fontSize:10, color:C.purple, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4567}}, "Allievi ("
               , (lesson.students||[]).length, ")"
            )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4570}}
              , (lesson.students||[]).map(s => (
                React.createElement('div', { key: s.id, style: {display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4572}}
                  , React.createElement('div', { style: {width:26, height:26, borderRadius:"50%", flexShrink:0,
                    background:`${insHex(s.instrument)}20`, border:`1px solid ${insHex(s.instrument)}40`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, fontWeight:700, color:insHex(s.instrument)}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4573}}
                    , initials(s.name)
                  )
                  , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4579}}
                    , React.createElement('span', { style: {fontSize:13, fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4580}}, s.name)
                    , React.createElement('span', { style: {fontSize:11, color:C.textMuted, marginLeft:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4581}}, s.instrument)
                  )
                )
              ))
            )
          )
        )

        /* ── Argomento — inline editable ── */
        , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:4}}
          , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between"}}
            , React.createElement(InlineLabel, {label:"Argomento", icon:"note"})
            , React.createElement(SaveDot, null)
          )
          , canEdit
            ? React.createElement('input', { value: localTopic, onChange: e=>setLocalTopic(e.target.value),
                onBlur: () => saveField({topic: localTopic}),
                placeholder: "Es. Scale maggiori, Chopin Notturno...",
                style: {padding:"10px 12px", borderRadius:8, border:`1px solid ${C.border}`,
                  background:C.bg, color:C.text, fontSize:13,
                  fontFamily:"'Open Sans',sans-serif", outline:"none", width:"100%", boxSizing:"border-box"}})
            : React.createElement('div', { style: {padding:"10px 12px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, color:localTopic?C.text:C.textDim, fontStyle:localTopic?"normal":"italic"}},
                localTopic || "Nessun argomento")
        )

        /* ── Note lezione (solo lettura) ── */
        , lesson.notes && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}`}}
            , React.createElement(InlineLabel, {label:"Note"})
            , React.createElement('div', { style: {fontSize:13, color:C.textMuted}}, lesson.notes)
          )
        )

        /* ── Esercizi da svolgere — inline editable ── */
        , lesson.tipo !== "prova" && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.blueBg, borderRadius:8, border:`1px solid ${C.blueBorder}`}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6}}
              , React.createElement(InlineLabel, {label:"Esercizi da svolgere", icon:"check", color:C.blue})
              , React.createElement(SaveDot, null)
            )
            , canEdit
              ? React.createElement('textarea', { value: localExercises, onChange: e=>setLocalExercises(e.target.value),
                  onBlur: () => saveField({exercises: localExercises}),
                  rows: 3, placeholder: "Es. Studiare scale in Do maggiore, ripetere battute 12-24...",
                  style: {width:"100%", boxSizing:"border-box", padding:"8px 10px", borderRadius:7,
                    border:`1px solid ${C.blueBorder}`, background:"rgba(255,255,255,0.08)",
                    color:C.text, fontSize:13, fontFamily:"'Open Sans',sans-serif",
                    outline:"none", resize:"vertical", lineHeight:1.5}})
              : React.createElement('div', { style: {fontSize:13, color:localExercises?C.text:C.textDim, lineHeight:1.6, fontStyle:localExercises?"normal":"italic"}},
                  localExercises || "Nessun esercizio assegnato")
          )
        )

        /* Repertorio */
        , (lesson.repertorioIds||[]).length > 0 ? (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4612}}
            , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4613}}, "Brani studiati" )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4614}}
              , (lesson.repertorioIds||[]).map(id => {
                const b = (window.__repertorio__||[]).find(r=>r.id===id);
                if(!b) return null;
                const typeHex = b.type==="collettivo"?C.purple:C.gold;
                const typeBg  = b.type==="collettivo"?C.purpleBg:"#e8edf5";
                const typeBd  = b.type==="collettivo"?C.purpleBorder:C.goldDim;
                return (
                  React.createElement('div', { key: id, style: {display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                    background:typeBg, border:`1px solid ${typeBd}`, borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4622}}
                    , React.createElement(Ic, { n: "note", size: 14, stroke: typeHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4624}})
                    , React.createElement('div', { style: {flex:1, minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4625}}
                      , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:typeHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4626}}, b.title)
                      , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4627}}, b.composer, b.tonality ? ` · ${b.tonality}` : "")
                    )
                  )
                );
              })
            )
          )
        ) : !canEdit && (
          React.createElement('div', { style:{padding:"10px 12px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}}
            , React.createElement('div', {style:{fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}, "Brani studiati")
            , React.createElement('div', {style:{fontSize:13,color:C.textDim,fontStyle:"italic"}}, "Nessun brano assegnato")
          )
        )

        /* ── Link URL — inline editable ── */
        , canEdit && (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:4}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between"}}
              , React.createElement(InlineLabel, {label:"Link (YouTube, Drive, altro)", icon:"link"})
              , React.createElement(SaveDot, null)
            )
            , React.createElement('input', { value: localLinkUrl, onChange: e=>setLocalLinkUrl(e.target.value),
                onBlur: () => saveField({linkUrl: localLinkUrl}),
                type:"url", placeholder:"https://...",
                style: {padding:"10px 12px", borderRadius:8, border:`1px solid ${C.border}`,
                  background:C.bg, color:C.text, fontSize:13,
                  fontFamily:"'Open Sans',sans-serif", outline:"none", width:"100%", boxSizing:"border-box"}})
          )
        )
        , !canEdit && lesson.linkUrl && (
          React.createElement('div', { style: {padding:"10px 12px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8}}
            , React.createElement(Ic, {n:"link", size:13, stroke:C.blue})
            , React.createElement('a', { href:lesson.linkUrl, target:"_blank", rel:"noopener noreferrer",
                style:{fontSize:13, color:C.blue, textDecoration:"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}},
                lesson.linkUrl)
          )
        )

        /* ── Allegati — inline upload ── */
        , (canEdit || (localAllegati||[]).length > 0 || !canEdit) && (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:6}}
            , React.createElement(InlineLabel, {label:"Allegati", icon:"paperclip"})
            , (localAllegati||[]).map((a,i) => (
              React.createElement('div', { key: a.id||i, style: {display:"flex", alignItems:"center", gap:10,
                padding:"8px 12px", borderRadius:8, border:`1px solid ${C.border}`, background:C.bg}}
                , React.createElement(Ic, {n:"paperclip", size:13, stroke:C.blue})
                , React.createElement('div', {style:{flex:1, minWidth:0}}
                  , a.fileUrl
                    ? React.createElement('a', {href:a.fileUrl, target:"_blank", rel:"noopener noreferrer",
                        style:{fontSize:13, fontWeight:500, color:C.blue, textDecoration:"none",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block"}},
                        a.fileName||"Allegato")
                    : React.createElement('span', {style:{fontSize:13, color:C.text}}, a.fileName||"Allegato")
                  , a.descrizione && React.createElement('div', {style:{fontSize:11, color:C.textMuted}}, a.descrizione)
                )
                , canEdit && React.createElement('button', {
                    onClick: async () => {
                      const att = (localAllegati||[])[i];
                      // 1. Rimuovi da Supabase allegati
                      if (att && att.id && window.supabaseClient) {
                        const sb = window.supabaseClient;
                        const { error } = await sb.from('allegati').delete().eq('id', att.id);
                        if (error) console.warn('[FM] delete allegato:', error.message);
                        // Rimuovi file dallo Storage se ha un URL storage
                        if (att.fileUrl) {
                          try {
                            const urlPath = att.fileUrl.split('/object/public/allegati/')[1];
                            if (urlPath) await sb.storage.from('allegati').remove([urlPath]);
                          } catch(e) { console.warn('[FM] storage delete:', e); }
                        }
                        // Aggiorna sharedAllegati
                        if (window.__FM_RELOAD__) {
                          const { data: allAl } = await sb.from('allegati').select('*').order('created_at',{ascending:false});
                          if (allAl) window.__FM_RELOAD__({ allegati: allAl.map(r=>({ id:r.id, lezioneId:r.lezione_id||null, allievoNome:r.allievo_nome||null, corso:r.corso||null, descrizione:r.descrizione||null, fileUrl:r.file_url||null, fileName:r.file_name||null, fileType:r.file_type||null, createdAt:r.created_at||null })) });
                        }
                      }
                      // 2. Aggiorna stato locale
                      const updated = (localAllegati||[]).filter((_,j)=>j!==i);
                      setLocalAllegati(updated);
                    },
                    style:{background:"none",border:"none",cursor:"pointer",padding:4,color:C.textMuted,display:"flex",borderRadius:4},
                    onMouseEnter:e=>e.currentTarget.style.color=C.red,
                    onMouseLeave:e=>e.currentTarget.style.color=C.textMuted}
                    , React.createElement(Ic, {n:"x", size:13, stroke:"currentColor"})
                  )
              )
            ))
            , canEdit && React.createElement('label', { style: {display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
              background:"none", border:`1px dashed ${C.border}`, borderRadius:8,
              cursor:"pointer", color:C.textMuted, fontSize:12, fontFamily:"'Open Sans',sans-serif",
              transition:"all 0.15s"},
              onMouseEnter:e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;},
              onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}
              , React.createElement(Ic, {n:"upload", size:13, stroke:"currentColor"})
              , "Allega file"
              , React.createElement('input', {type:"file", style:{display:"none"}, multiple:true,
                  onChange: async e => {
                    const files = Array.from(e.target.files||[]);
                    if (!files.length) return;
                    const sb = window.supabaseClient;
                    const newAllegati = [];
                    for (const file of files) {
                      const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
                      let fileUrl = null;
                      if (sb) {
                        try {
                          const { error: upErr } = await sb.storage.from('allegati').upload(path, file, {upsert:true});
                          if (!upErr) {
                            const { data: urlData } = sb.storage.from('allegati').getPublicUrl(path);
                            fileUrl = urlData?.publicUrl || null;
                          }
                        } catch(err) { console.warn('[FM] upload error', err); }
                      }
                      const attId = 'att_'+Date.now()+'_'+Math.random().toString(36).slice(2,6);
                      const attRow = {
                        id: attId,
                        fileName: file.name, fileUrl, fileType: file.type, descrizione:'',
                        corso: lesson.instrument||'', lezioneId: lesson.id,
                        allievoNome: lesson.student||'', createdAt: new Date().toISOString(),
                      };
                      // Salva subito su Supabase allegati (NO id: lascia auto UUID)
                      if (sb && fileUrl) {
                        try {
                          const { data: insData, error: insErr } = await sb.from('allegati').insert({
                            lezione_id: lesson.id,
                            allievo_nome: lesson.student||'',
                            corso: lesson.instrument||'',
                            file_url: fileUrl,
                            file_name: file.name,
                            file_type: file.type,
                            descrizione: '',
                          }).select('id').maybeSingle();
                          if (!insErr && insData?.id) attRow.id = insData.id;
                          else if (insErr) console.warn('[FM] allegato DB error', insErr.message);
                        } catch(dbErr) { console.warn('[FM] allegato DB error', dbErr); }
                      }
                      newAllegati.push(attRow);
                    }
                    const updated = [...(localAllegati||[]), ...newAllegati];
                    setLocalAllegati(updated);
                    // Aggiorna sharedAllegati subito senza aspettare realtime
                    if (window.__FM_RELOAD__) {
                      const sb2 = window.supabaseClient;
                      if (sb2) {
                        const { data: allAl } = await sb2.from('allegati').select('*').order('created_at', {ascending:false});
                        if (allAl) window.__FM_RELOAD__({ allegati: allAl.map(r=>({ id:r.id, lezioneId:r.lezione_id||null, allievoNome:r.allievo_nome||null, corso:r.corso||null, descrizione:r.descrizione||null, fileUrl:r.file_url||null, fileName:r.file_name||null, fileType:r.file_type||null, createdAt:r.created_at||null })) });
                      }
                    }
                    e.target.value='';
                  }})
            )
          )
        )

        /* ── Segna presenza ── */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4636}}
          , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4637}}, "Segna presenza" )
          /* Banner lezione recuperata — sola lettura */
          , lesson.attendance === 'recuperata'
            ? React.createElement('div', {style:{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:C.tealBg,border:'1px solid '+C.tealBorder,borderRadius:8}}
                , React.createElement(Ic,{n:'check',size:15,stroke:C.teal})
                , React.createElement('div',null
                  , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:C.teal}},'✅ Lezione recuperata')
                  , (lesson.notesRecupero||lesson.notes_recupero) && React.createElement('div',{style:{fontSize:11,color:C.textMuted,marginTop:2}},lesson.notesRecupero||lesson.notes_recupero)
                )
                , React.createElement('span',{style:{fontSize:10,color:C.textDim,marginLeft:'auto'}},'(sola lettura)')
              )
            : React.createElement(React.Fragment, null
                /* Banner informativo per lezione di recupero fissata — NON blocca i pulsanti */
                , lesson.tipo === 'recupero' && (
                  React.createElement('div', {style:{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:C.blueBg,border:'1px solid '+C.blueBorder,borderRadius:8,marginBottom:10}}
                    , React.createElement(Ic,{n:'calendar',size:14,stroke:C.blue})
                    , React.createElement('div',{style:{fontSize:12,fontWeight:600,color:C.blue}},'Lezione di recupero · segna la presenza qui sotto')
                  )
                )
                , isRecuperoScaduto && (
                  React.createElement('div', {style:{marginBottom:10,padding:'12px 14px',background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.3)',borderRadius:10,display:'flex',alignItems:'center',gap:10}}
                    , React.createElement(Ic,{n:'alert',size:16,stroke:C.red})
                    , React.createElement('div',{style:{flex:1}}
                      , React.createElement('div',{style:{fontSize:13,fontWeight:700,color:C.red}}, '⏰ Recupero scaduto')
                      , React.createElement('div',{style:{fontSize:11,color:C.textMuted,marginTop:2}},
                          'Termine scaduto il ', lesson.recuperoScadenza,
                          ' — la lezione verrà segnata come assente')
                    )
                    , role === 'admin' && React.createElement('div',{style:{display:'flex',gap:6}}
                      , React.createElement('button', {
                          onClick: () => { if (window.__FM_SHOW_ADMIN_RECUPERO__) window.__FM_SHOW_ADMIN_RECUPERO__(lesson); },
                          style:{padding:'7px 14px',borderRadius:8,border:'none',background:C.teal,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Open Sans',sans-serif",whiteSpace:'nowrap'}
                        }, '📅 Fissa recupero')
                      , React.createElement('button', {
                          onClick: () => { if (window.__FM_SHOW_RECUPERO_SCADUTO__) window.__FM_SHOW_RECUPERO_SCADUTO__({ lesson, onExtend: ()=>{} }); },
                          style:{padding:'7px 14px',borderRadius:8,border:'none',background:C.gold,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Open Sans',sans-serif",whiteSpace:'nowrap'}
                        }, '⏰ Proroga')
                    )
                  )
                )
                /* Banner "in recupero" non ancora scaduto — admin può fissare direttamente */
                , !isRecuperoScaduto && lesson.inRecupero && role === 'admin' && (
                  React.createElement('div', {style:{marginBottom:10,padding:'10px 14px',background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:10,display:'flex',alignItems:'center',gap:10}}
                    , React.createElement(Ic,{n:'calendar',size:15,stroke:C.teal})
                    , React.createElement('div',{style:{flex:1,fontSize:12,color:C.teal,fontWeight:600}}
                      , 'In recupero · scade il ', lesson.recuperoScadenza||'—')
                    , React.createElement('button', {
                        onClick: () => { if (window.__FM_SHOW_ADMIN_RECUPERO__) window.__FM_SHOW_ADMIN_RECUPERO__(lesson); },
                        style:{padding:'6px 14px',borderRadius:8,border:'none',background:C.teal,color:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,fontFamily:"'Open Sans',sans-serif",whiteSpace:'nowrap'}
                      }, '📅 Fissa recupero')
                  )
                )
                , React.createElement('div', { className: "att-row", style: {display:"flex", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4638}}
                  , ["presente","assente","giustificato","recupero","in_recupero","cambio_ora"].map(a => {
                    const s = ATT_STYLES[a] || ATT_STYLES.presente;
                    const active = a === 'in_recupero' ? lesson.inRecupero : lesson.attendance === a;
                    return (
                      React.createElement('button', { key: a, onClick: () => canEdit && onAttendance(lesson.id, active ? "" : a),
                        style: {flex:1, padding:"9px 0", borderRadius:8,
                          border:`2px solid ${active ? s.bd : C.border}`,
                          background: active ? s.bg : C.bg,
                          cursor: canEdit ? "pointer" : "default", fontSize:11,
                          color: active ? s.fg : C.textMuted,
                          opacity: canEdit ? 1 : 0.5,
                          fontFamily:"'Open Sans',sans-serif", fontWeight: active ? 600 : 400,
                          transition:"all 0.12s"},}
                        , s.label || a
                      )
                    );
                  })
                  /* Badge scadenza recupero */
                  , lesson.inRecupero && lesson.recuperoScadenza && (
                    React.createElement('div', {style:{marginTop:6, padding:'6px 10px', borderRadius:7, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', fontSize:11, color:'#f59e0b', display:'flex', alignItems:'center', gap:5}}
                      , React.createElement(Ic,{n:'clock',size:12,stroke:'#f59e0b'})
                      , 'Lezione in recupero — scade il ', lesson.recuperoScadenza
                    )
                  )
                )
              )
          /* Feedback prossima lezione */
          , lesson.recurrence && lesson.recurrence !== "Nessuna" && (
            React.createElement('div', { style: {marginTop:10, padding:"10px 14px", borderRadius:8,
              background: nextLessonDate ? C.greenBg : C.surface,
              border:`1px solid ${nextLessonDate ? C.greenBorder : C.border}`,
              display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4659}}
              , React.createElement(Ic, { n: "repeat", size: 14, stroke: nextLessonDate ? C.green : C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4663}})
              , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4664}}
                , nextLessonDate ? (
                  React.createElement(React.Fragment, null
                    , React.createElement('div', { style: {fontSize:12, color:C.green, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4667}}, "Prossima lezione creata"
                    )
                    , React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4670}}
                      , fmtFull(new Date(nextLessonDate+"T00:00:00")), " · "  , lesson.hour, " · "  , lesson.teacher
                    )
                  )
                ) : (
                  React.createElement('div', { style: {fontSize:12, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4675}}, "Lezione "
                     , lesson.recurrence.toLowerCase(), " — la prossima verrà creata segnando la presenza"
                  )
                )
              )
              , !nextLessonDate && lesson.attendance && (
                React.createElement('span', { style: {fontSize:10, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4681}}, "già pianificata" )
              )
            )
          )
        )

        /* ── Pannello iscrizione (solo lezioni prova) ── */
        , lesson.tipo==="prova" && canEdit && (
          React.createElement('div', { style: {padding:"14px 16px", background:lesson.iscritto?C.greenBg:C.tealBg,
            border:`1px solid ${lesson.iscritto?C.greenBorder:C.tealBorder}`, borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4689}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: showIscrizionePanel&&!lesson.iscritto ? 12 : 0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4691}}
              , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4692}}
                , React.createElement(Ic, { n: lesson.iscritto?"check":"user", size: 15, stroke: lesson.iscritto?C.green:C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4693}})
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4694}}
                  , React.createElement('div', { style: {fontSize:12, fontWeight:600, color:lesson.iscritto?C.green:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4695}}
                    , lesson.iscritto ? `Iscritto — ${lesson.student||""}` : "Allievo non ancora iscritto"
                  )
                  , !lesson.iscritto && (
                    React.createElement('div', { style: {fontSize:11, color:C.teal, opacity:0.8, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4699}}, "Collega a un allievo esistente quando si iscrive"
                    )
                  )
                )
              )
              , !lesson.iscritto && (
                React.createElement('button', { onClick: ()=>setShowIscrizionePanel(v=>!v),
                  style: {background:C.teal,color:"#ffffff",border:"none",borderRadius:7,padding:"6px 13px",
                    cursor:"pointer",fontSize:12,fontFamily:"'Open Sans',sans-serif",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4706}}
                  , showIscrizionePanel ? "Annulla" : "Segna iscritto"
                )
              )
              , lesson.iscritto && onIscrizione && (
                React.createElement('button', { onClick: ()=>onIscrizione(lesson.id, "", false),
                  style: {background:"none",color:C.textDim,border:`1px solid ${C.border}`,borderRadius:7,
                    padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4713}}, "Rimuovi iscrizione"
                )
              )
            )
            , showIscrizionePanel && !lesson.iscritto && (
              React.createElement('div', { style: {display:"flex", gap:8, alignItems:"center", marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4721}}
                , React.createElement('select', { value: iscrizioneStudent, onChange: e=>setIscrizioneStudent(e.target.value),
                  style: {flex:1, background:C.surface, border:`1px solid ${C.tealBorder}`, borderRadius:8,
                    color:iscrizioneStudent?C.text:C.textMuted, fontSize:13, padding:"9px 12px",
                    fontFamily:"'Open Sans',sans-serif", appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4722}}
                  , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4726}}, "— seleziona allievo —"   )
                  , studentsList.filter(s=>s.status==="attivo").map(s=>(
                    React.createElement('option', { key: s.id, value: s.name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4728}}, s.name, " · "  , s.instrument)
                  ))
                  , React.createElement('option', { value: "__nuovo__", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4730}}, "+ Nuovo allievo (da creare)"    )
                )
                , React.createElement('button', {
                  disabled: !iscrizioneStudent,
                  onClick: ()=>{
                    if(onIscrizione) onIscrizione(lesson.id, iscrizioneStudent, true);
                    setShowIscrizionePanel(false);
                  },
                  style: {background:iscrizioneStudent?C.green:"#1a2a1a",color:iscrizioneStudent?C.bg:C.textDim,
                    border:"none",borderRadius:7,padding:"9px 16px",cursor:iscrizioneStudent?"pointer":"not-allowed",
                    fontSize:12,fontFamily:"'Open Sans',sans-serif",fontWeight:600,flexShrink:0,transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4732}}, "Conferma"
                )
              )
            )
          )
        )

      )

      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4750}}
        , canEdit ? (
          React.createElement(React.Fragment, null
            , React.createElement(Btn, { danger: true, onClick: onDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4753}}, React.createElement(Ic, { n: "trash", size: 14, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4753}}), "Elimina")
            , React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4754}}, React.createElement(Ic, { n: "edit", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4754}}), "Modifica")
          )
        ) : (
          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,color:C.textDim,fontSize:12,width:"100%",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4757}}
            , React.createElement(Ic, { n: "lock", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4758}}), "Solo docenti e amministratori possono modificare le lezioni"
          )
        )
      )
    )
  );
};

// ─── VISTA GIORNALIERA ────────────────────────────────────────────────────────
const DayView = ({ date, lessons, onSelect, isMobile, config }) => {
  const dayLessons = lessons
    .filter(l => l.date === yyyymmdd(date))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  const holiday = getHoliday(yyyymmdd(date));
  const chiuso  = isGiornoChiuso(yyyymmdd(date), config);

  const HolidayBanner = chiuso
    ? React.createElement('div', { style:{display:'flex',alignItems:'center',gap:10,padding:'10px 16px',
        background:chiuso.bg,border:`1px solid ${chiuso.bd}`,
        borderRadius:10,marginBottom:isMobile?6:10} }
        , React.createElement('span',{style:{fontSize:20}}, chiuso.emoji)
        , React.createElement('div',null
          , React.createElement('div',{style:{fontSize:13,fontWeight:700,color:chiuso.color}}, chiuso.emoji,' ', chiuso.label, chiuso.tipo==='festività'?' — Festività nazionale':'')
          , React.createElement('div',{style:{fontSize:11,color:chiuso.color,opacity:.8,marginTop:1}}, chiuso.tipo==='chiusura'?'Scuola chiusa':'Giorno festivo · nessuna lezione raccomandata')
        )
      )
    : null;

  if(dayLessons.length === 0) return (
    React.createElement('div', { style: {padding: isMobile ? 8 : 0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4774}}
      , HolidayBanner
      , React.createElement('div', { style: {textAlign:"center", padding:"48px 0", color:C.textDim} }
        , React.createElement(Ic, { n: "cal", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4775}})
        , React.createElement('p', { style: {marginTop:12, fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4776}}, "Nessuna lezione programmata"  )
        , React.createElement('p', { style: {fontSize:12, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4777}}, "Usa il + per aggiungerne una"     )
      )
    )
  );

  return (
    React.createElement('div', { style: {display:"flex", flexDirection:"column", gap: isMobile ? 6 : 10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4782}}
      , HolidayBanner
      , dayLessons.map(l => {
        const hex = lessonHex(l);
        const dotHex = l.attendance ? attHex(l.attendance) : null;

        // ── SALA PROVE card dedicata ──────────────────────────────
        if (isSalaProve(l)) {
          const ora  = (l.hour||"").slice(0,5);
          const fine = (l.oraFine||"").slice(0,5);
          const pending = l.stato === "in_attesa";
          return React.createElement('div', { key:l.id, onClick:()=>onSelect(l),
            style:{display:"flex",gap: isMobile ? 8 : 16,padding: isMobile ? "10px 10px" : "16px 18px",
              background:pending?"#fffbeb":C.orange2Bg,
              border:`1px solid ${pending?"#fde68a":C.orange2Border}`,
              borderLeft:`4px solid ${pending?"#f59e0b":C.orange2}`,
              borderRadius:10,cursor:"pointer",transition:"all 0.15s"},
            onMouseEnter:e=>{e.currentTarget.style.filter="brightness(0.96)";},
            onMouseLeave:e=>{e.currentTarget.style.filter="none";}}
            , React.createElement('div',{style:{width: isMobile ? 36 : 52,flexShrink:0,textAlign:"center",paddingTop:4}}
              , React.createElement(Ic,{n:"drum",size: isMobile ? 20 : 26,stroke:pending?"#f59e0b":C.orange2})
              , React.createElement('div',{style:{fontSize:9,color:pending?"#92400e":C.orange2,marginTop:3,fontWeight:600}},ora)
            )
            , React.createElement('div',{style:{flex:1,minWidth:0}}
              , React.createElement('div',{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}
                , React.createElement('span',{style:{fontSize: isMobile ? 13 : 15,fontWeight:600,color:pending?"#92400e":C.orange2}},"🤘 Sala Prove")
                , React.createElement('span',{style:{fontSize:11,background:pending?"#fffbeb":C.orange2Bg,
                    color:pending?"#92400e":C.orange2,border:`1px solid ${pending?"#fde68a":C.orange2Border}`,
                    borderRadius:4,padding:"1px 7px",letterSpacing:"0.05em"}},
                  pending?"⏳ In attesa":"✓ Approvata")
              )
              , React.createElement('div',{style:{fontSize:12,color:pending?"#92400e":C.orange2,fontWeight:600,marginBottom:2}}
                , ora, fine?" → "+fine:"")
              , React.createElement('div',{style:{fontSize:12,color:C.textMuted}}
                , l.richiedente||l.student
                , l._original&&l._original.telefono?" · 📞 "+l._original.telefono:"")
              , l.topic&&l.topic!=="Sala Prove"&&React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginTop:4,fontStyle:"italic"}},"\"",l.topic,"\"")
            )
          );
        }

        // Badge presenza (per mobile su riga separata, per desktop inline)
        const attBadgeEl = l.tipo !== "sala_prove" && (l.attendance || l.inRecupero)
          ? (() => {
              const att = l.inRecupero && !l.attendance ? 'in_recupero' : l.attendance;
              const s = ATT_STYLES[att];
              const lbl = s ? s.label : att;
              return React.createElement(Badge, { label: lbl, variant: attBadge(att) });
            })()
          : null;

        return (
          React.createElement('div', { key: l.id, onClick: () => onSelect(l),
            style: {display:"flex", flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 6 : 16,
              padding: isMobile ? "10px 10px" : "16px 18px",
              background:C.surface,
              border:`1px solid ${C.border}`, borderLeft:`4px solid ${hex}`,
              borderRadius:10, cursor:"pointer", transition:"all 0.15s"},
            onMouseEnter: e => { e.currentTarget.style.background = C.surfaceHover; },
            onMouseLeave: e => { e.currentTarget.style.background = C.surface; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4787}}

            /* MOBILE: riga ora + badge in cima, poi contenuto */
            , isMobile ? (
              React.createElement(React.Fragment, null
                /* Riga superiore: ora + badge presenza */
                , React.createElement('div', {style:{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}
                  , React.createElement('div', {style:{display:"flex", alignItems:"center", gap:8}}
                    , React.createElement('div', {style:{width:28, height:28, borderRadius:6, background:`${hex}18`, border:`1px solid ${hex}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}
                      , React.createElement(Ic, {n: isColl(l) ? "group" : isProva(l) ? "user" : "music", size:14, stroke:hex})
                    )
                    , React.createElement('div', {style:{fontSize:12, color:hex, fontWeight:700}}, (l.hour||"").slice(0,5))
                    , l.tipo==="collettivo"
                      ? React.createElement('span',{style:{fontSize:11,background:`${hex}15`,color:hex,border:`1px solid ${hex}40`,borderRadius:4,padding:"1px 6px",letterSpacing:"0.04em"}},"Collettiva")
                      : null
                  )
                  , attBadgeEl
                )
                /* Contenuto principale */
                , React.createElement('div', {style:{minWidth:0}}
                  , l.tipo==="collettivo" ? (
                    React.createElement(React.Fragment, null
                      , React.createElement('div',{style:{fontSize:14,fontWeight:600,color:hex,marginBottom:2}},l.courseName)
                      , React.createElement('div',{style:{fontSize:12,color:C.textMuted,display:"flex",gap:8,flexWrap:"wrap"}}
                        , l.teacher && React.createElement('span',null,l.teacher)
                        , l.room && React.createElement('span',null,"· ",l.room)
                        , React.createElement('span',null,"· ",(l.students||[]).length," allievi")
                      )
                    )
                  ) : l.tipo==="prova" ? (
                    React.createElement(React.Fragment, null
                      , React.createElement('div',{style:{fontSize:14,fontWeight:600,color:C.teal,marginBottom:2}},l.contactName||"Lezione prova")
                      , React.createElement('div',{style:{fontSize:12,color:C.textMuted}},l.instrument, l.teacher?" · "+l.teacher:"")
                    )
                  ) : (
                    React.createElement(React.Fragment, null
                      /* Badge recupero in primo piano */
                      , (l.topic && (l.topic.startsWith('🔄') || l.topic.startsWith('Recupero'))) && (
                        React.createElement('div',{style:{display:"inline-flex",alignItems:"center",gap:4,
                          background:C.tealBg,border:`1px solid ${C.tealBorder}`,
                          borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,
                          color:C.teal,marginBottom:4}}
                          , React.createElement(Ic,{n:"repeat",size:11,stroke:C.teal})
                          , l.topic
                        )
                      )
                      , React.createElement('div',{style:{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}
                        , React.createElement('span',{style:{fontSize:14,fontWeight:600,color:C.text}},l.student)
                        , React.createElement('span',{style:{fontSize:12,color:hex}},l.instrument)
                        , l.recurrence !== "Nessuna" && React.createElement(Ic,{n:"repeat",size:11,stroke:C.textDim})
                        , dotHex && React.createElement('div',{style:{width:6,height:6,borderRadius:"50%",background:dotHex,flexShrink:0}})
                      )
                      , React.createElement('div',{style:{fontSize:12,color:C.textMuted}},l.teacher)
                      , l.topic && !l.topic.startsWith('🔄') && !l.topic.startsWith('Recupero') && React.createElement('div',{style:{fontSize:11,color:C.textMuted,marginTop:2,fontStyle:"italic"}},'"',l.topic,'"')
                    )
                  )
                )
              )
            ) : (
              /* DESKTOP: layout orizzontale originale */
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {width:52, flexShrink:0, textAlign:"center", paddingTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4793}}
                  , React.createElement('div', { style: {width:36, height:36, borderRadius:8, background:`${hex}18`, border:`1px solid ${hex}30`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 4px"}},
                    React.createElement(Ic, { n: isColl(l) ? "group" : isProva(l) ? "user" : "music", size:18, stroke:hex })
                  )
                  , React.createElement('div', { style: {fontSize:10, color:hex, fontWeight:600, lineHeight:1}}, (l.hour||"").slice(0,5))
                )
                , React.createElement('div', { style: {flex:1, minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4798}}
                  , l.tipo==="collettivo" ? (
                    React.createElement(React.Fragment, null
                      , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4801}}
                        , React.createElement('span', { style: {fontSize:15, fontWeight:600, color:hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4802}}, l.courseName)
                        , React.createElement('span', { style: {fontSize:11, background:`${hex}15`, color:hex, border:`1px solid ${hex}40`, borderRadius:4, padding:"1px 7px", letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4803}}, "Collettiva")
                        , l.recurrence !== "Nessuna" && React.createElement(Ic, { n: "repeat", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4806}})
                      )
                      , React.createElement('div', { style: {display:"flex", gap:12, fontSize:12, color:C.textMuted, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4808}}
                        , l.teacher && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4809}}, l.teacher)
                        , l.room    && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4810}}, "· " , l.room)
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4811}}, "· " , (l.students||[]).length, " allievi" )
                      )
                      , (l.students||[]).length > 0 && (
                        React.createElement('div', { style: {display:"flex", gap:5, marginTop:6, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4814}}
                          , (l.students||[]).map(s => (
                            React.createElement('span', { key: s.id, style: {fontSize:10, padding:"1px 7px", borderRadius:10, background:`${insHex(s.instrument)}18`, color:insHex(s.instrument), border:`1px solid ${insHex(s.instrument)}40`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4816}}
                              , s.name.split(" ")[0]
                            )
                          ))
                        )
                      )
                      , l.topic && React.createElement('div', { style: {fontSize:12, color:C.textMuted, marginTop:6, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4824}}, "\"", l.topic, "\"")
                    )
                  ) : l.tipo==="prova" ? (
                    React.createElement(React.Fragment, null
                      , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4828}}
                        , React.createElement('span', { style: {fontSize:15, fontWeight:600, color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4829}}
                          , l.contactName || "Lezione prova"
                        )
                        , React.createElement('span', { style: {fontSize:11, background:C.tealBg, color:C.teal, border:`1px solid ${C.tealBorder}`, borderRadius:4, padding:"1px 7px", letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4832}}, "Prova")
                        , l.iscritto
                          ? React.createElement('span', { style: {fontSize:11, background:C.greenBg, color:C.green, border:`1px solid ${C.greenBorder}`, borderRadius:4, padding:"1px 7px",fontWeight:600}}, "Iscritto ✓")
                          : React.createElement('span', { style: {fontSize:11, background:C.tealBg, color:C.teal, border:`1px solid ${C.tealBorder}`, borderRadius:4, padding:"1px 7px"}}, "Non iscritto")
                      )
                      , React.createElement('div', { style: {display:"flex", gap:12, fontSize:12, color:C.textMuted, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4846}}
                        , React.createElement('span', { style: {color:C.teal}}, l.instrument)
                        , l.teacher && React.createElement('span', null, "· " , l.teacher)
                        , l.room    && React.createElement('span', null, "· " , l.room)
                        , l.phone   && React.createElement('span', { style: {color:C.teal}}, "· 📞 "  , l.phone)
                      )
                      , l.notes && React.createElement('div', { style: {fontSize:12, color:C.textMuted, marginTop:6, fontStyle:"italic"}}, l.notes)
                    )
                  ) : (
                    React.createElement(React.Fragment, null
                      /* Badge recupero in primo piano (desktop) */
                      , (l.topic && (l.topic.startsWith('🔄') || l.topic.startsWith('Recupero'))) && (
                        React.createElement('div', {style:{display:"inline-flex",alignItems:"center",gap:5,
                          background:C.tealBg,border:`1px solid ${C.tealBorder}`,
                          borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700,
                          color:C.teal,marginBottom:6}}
                          , React.createElement(Ic,{n:"repeat",size:12,stroke:C.teal})
                          , l.topic
                        )
                      )
                      , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}}
                        , React.createElement('span', { style: {fontSize:15, fontWeight:600}}, l.student)
                        , React.createElement('span', { style: {fontSize:12, color:hex}}, l.instrument)
                        , l.recurrence !== "Nessuna" && React.createElement(Ic, { n: "repeat", size: 12, stroke: C.textDim})
                        , dotHex && React.createElement('div', { style: {width:7, height:7, borderRadius:"50%", background:dotHex}})
                      )
                      , React.createElement('div', { style: {display:"flex", gap:12, fontSize:12, color:C.textMuted, flexWrap:"wrap"}}
                        , l.teacher && React.createElement('span', null, l.teacher)
                        , l.room    && React.createElement('span', null, "· " , l.room)
                      )
                      , l.topic && !l.topic.startsWith('🔄') && !l.topic.startsWith('Recupero') && React.createElement('div', { style: {fontSize:12, color:C.textMuted, marginTop:6, fontStyle:"italic"}}, "\"", l.topic, "\"")
                    )
                  )
                )
                , attBadgeEl && React.createElement('div', {style:{flexShrink:0, alignSelf:"center"}}, attBadgeEl)
              )
            )
          )
        );
      })
    )
  );
};

// ─── VISTA SETTIMANALE ────────────────────────────────────────────────────────
const WeekView = ({ weekStart, lessons, onSelect, config }) => {
  // Solo Lun–Sab (6 giorni, no domenica)
  const days      = Array.from({length:6}, (_, i) => addDays(weekStart, i));
  const HOUR_H    = 64;   // px per 1 ora
  const H_START   = 8;    // prima riga visibile
  const H_END     = 22;   // ultima riga visibile (esclusa)
  const N_HOURS   = H_END - H_START;
  const SAB_AFTERNOON_START = 13; // sabato pomeriggio dalle 13:00

  // "HH:MM:SS" | "HH:MM" → numero decimale di ore
  const toH = (t) => {
    if (!t) return 0;
    const parts = String(t).split(":");
    return parseInt(parts[0]||0) + parseInt(parts[1]||0)/60;
  };

  // Durata in ore di una lezione (priorità: durata salvata → calcolo da oraFine → default per tipo)
  const getDurH = (l) => {
    if (isSalaProve(l)) {
      const sh = toH(l.hour);
      const eh = toH(l.oraFine || l.hour);
      return Math.max(eh - sh, 0.5);
    }
    if (l.durata) return l.durata / 60;
    return (isColl(l) ? 60 : isProva(l) ? 30 : 45) / 60;
  };

  // Pre-calcola offset e altezza per ogni lezione
  const enriched = lessons.map(l => {
    const startH  = toH(l.hour);
    const durHrs  = getDurH(l);
    const topPx   = Math.max(startH - H_START, 0) * HOUR_H;
    const heightPx = Math.max(durHrs * HOUR_H - 3, 18);
    return { ...l, _startH: startH, _durH: durHrs, _top: topPx, _h: heightPx };
  }).filter(l => l._startH < H_END && l._startH >= H_START - 0.1);

  const buildColumns = (dayLessons) => {
    const sorted = [...dayLessons].sort((a,b) => a._startH - b._startH);
    const columns = [];
    sorted.forEach(l => {
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        const lastInCol = columns[c][columns[c].length - 1];
        if (lastInCol._startH + lastInCol._durH <= l._startH + 0.01) {
          columns[c].push(l);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([l]);
    });
    const result = new Map();
    sorted.forEach(l => {
      const endH = l._startH + l._durH;
      let colIdx = 0;
      for (let c = 0; c < columns.length; c++) {
        if (columns[c].find(x => x.id === l.id)) { colIdx = c; break; }
      }
      const overlapping = columns.filter(col =>
        col.some(x => x._startH < endH && x._startH + x._durH > l._startH)
      ).length;
      result.set(l.id, { colIdx, numCols: overlapping });
    });
    return result;
  };

  const TOTAL_H = N_HOURS * HOUR_H;

  return (
    React.createElement('div', { style:{overflowX:"auto", WebkitOverflowScrolling:"touch"}}
      , React.createElement('div', { style:{minWidth:440}}

        /* ── HEADER ── */
        , React.createElement('div', { style:{display:"grid",
            gridTemplateColumns:`52px repeat(6,1fr)`,
            borderBottom:`1px solid ${C.border}`,
            position:"sticky", top:0, background:C.surface, zIndex:4}}
          , React.createElement('div')
          , days.map((d, i) => {
            const isToday = isSameDay(d, today);
            const isSab   = d.getDay() === 6;
            const holiday = getHoliday(yyyymmdd(d));
            const chiuso  = isGiornoChiuso(yyyymmdd(d), config);
            return React.createElement('div', { key:i,
              style:{padding:"6px 4px", textAlign:"center",
                borderLeft:`1px solid ${C.border}`, minWidth:0, overflow:"hidden",
                background: chiuso ? chiuso.bg : isSab ? "#f9f5f0" : undefined,
                backgroundImage: chiuso ? CHIUSO_PATTERN : undefined}}
              , React.createElement('div',{style:{fontSize:11,
                  color: chiuso ? chiuso.color : isSab ? "#b45309" : C.textMuted,
                  letterSpacing:"0.06em",textTransform:"uppercase"}},DAYS_SHORT[i])
              , React.createElement('div',{style:{fontFamily:"'Oswald',sans-serif",
                  fontSize:20,fontWeight:600,marginTop:1,
                  color: chiuso ? chiuso.color : isToday?C.gold: isSab ? "#b45309" : C.text,
                  background:isToday?`${C.gold}15`:undefined,
                  borderRadius:isToday?6:undefined,
                  padding:isToday?"1px 6px":undefined}},d.getDate())
              , chiuso && React.createElement('div',{style:{fontSize:8,color:chiuso.color,fontWeight:600,
                  marginTop:1,lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},
                  chiuso.emoji,' ',chiuso.label)
              , !chiuso && holiday && React.createElement('div',{style:{fontSize:8,color:'#b91c1c',fontWeight:600,
                  marginTop:1,lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},
                  holiday.emoji,' ',holiday.label)
            );
          })
        )

        /* ── BODY ── */
        , React.createElement('div', { style:{display:"grid",
            gridTemplateColumns:`52px repeat(6,1fr)`}}

          /* Colonna etichette ore */
          , React.createElement('div', { style:{position:"relative", height:TOTAL_H}}
            , Array.from({length:N_HOURS}, (_,i) => i + H_START).map(h =>
              React.createElement('div', { key:h,
                style:{position:"absolute",
                  top: (h - H_START) * HOUR_H,
                  left:0, right:0, height:HOUR_H,
                  borderTop:`1px solid ${C.border}20`,
                  display:"flex", alignItems:"flex-start",
                  padding:"3px 6px 0 0",
                  justifyContent:"flex-end"}}
                , React.createElement('span',{style:{fontSize:10,color:C.textDim}},
                    `${String(h).padStart(2,"0")}:00`)
              )
            )
          )

          /* Colonne per ogni giorno (Lun–Sab) */
          , days.map((d, colIdx) => {
            const ds = yyyymmdd(d);
            const dayLessons = enriched.filter(l => l.date === ds);
            const colMap = buildColumns(dayLessons);
            const isToday = isSameDay(d, today);
            const isSab   = d.getDay() === 6;
            const chiuso  = isGiornoChiuso(ds, config);
            // Offset in px da cui inizia il sabato pomeriggio
            const sabPomTopPx = (SAB_AFTERNOON_START - H_START) * HOUR_H;
            const sabPomH     = TOTAL_H - sabPomTopPx;

            return React.createElement('div', { key:colIdx,
              style:{position:"relative", height:TOTAL_H,
                borderLeft:`1px solid ${C.border}20`,
                background: isToday ? "#fffef8" : "transparent"}}

              /* Linee orizzontali di sfondo */
              , Array.from({length:N_HOURS}, (_,i) =>
                React.createElement('div', { key:i,
                  style:{position:"absolute",
                    top: i * HOUR_H, left:0, right:0, height:HOUR_H,
                    borderTop:`1px solid ${C.border}20`}})
              )

              /* Overlay giorno chiuso (festività o chiusura personalizzata) — copre tutta la colonna */
              , chiuso && React.createElement('div', {
                  style:{
                    position:"absolute", top:0, left:0, right:0, bottom:0,
                    background: chiuso.tipo==='festività'
                      ? "repeating-linear-gradient(135deg,transparent,transparent 6px,rgba(220,38,38,0.06) 6px,rgba(220,38,38,0.06) 12px)"
                      : "repeating-linear-gradient(135deg,transparent,transparent 6px,rgba(55,65,81,0.06) 6px,rgba(55,65,81,0.06) 12px)",
                    backgroundColor: chiuso.tipo==='festività' ? "rgba(254,242,242,0.6)" : "rgba(243,244,246,0.6)",
                    zIndex:1, pointerEvents:"none"
                  }}
                , React.createElement('div',{style:{
                    fontSize:9, color:chiuso.color, fontWeight:700,
                    letterSpacing:"0.06em", textTransform:"uppercase",
                    padding:"4px 5px", opacity:0.9, lineHeight:1.3,
                    display:"flex", alignItems:"center", gap:3
                  }}, chiuso.emoji, " ", chiuso.label)
              )

              /* Overlay sabato pomeriggio (dalle 13:00 in poi) */
              , isSab && !chiuso && React.createElement('div', {
                  style:{
                    position:"absolute",
                    top: sabPomTopPx, left:0, right:0,
                    height: sabPomH,
                    background:"repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(180,83,9,0.04) 6px,rgba(180,83,9,0.04) 12px)",
                    backgroundColor:"rgba(251,243,234,0.7)",
                    borderTop:"1.5px dashed #f5d0a0",
                    zIndex:1, pointerEvents:"none"
                  }}
                , React.createElement('div',{style:{
                    fontSize:9,color:"#b45309",fontWeight:600,
                    letterSpacing:"0.06em",textTransform:"uppercase",
                    padding:"3px 5px",opacity:0.7
                  }},"pom.")
              )

              /* Blocchi lezione */
              , dayLessons.map(l => {
                const info    = colMap.get(l.id) || {colIdx:0, numCols:1};
                const wPct    = 100 / info.numCols;
                const lPct    = info.colIdx * wPct;
                const isSala  = isSalaProve(l);
                const hex     = lessonHex(l);
                const pending = isSala && l.stato === "in_attesa";
                const bg      = isSala ? (pending?"#fffbeb":C.orange2Bg) : `${hex}18`;
                const bord    = isSala ? (pending?"#fde68a":C.orange2Border) : `${hex}40`;
                const accent  = isSala ? (pending?"#f59e0b":C.orange2) : hex;
                const normHour = String(l.hour||"").slice(0,5);
                const normFine = String(l.oraFine||"").slice(0,5);

                return React.createElement('div', { key:l.id,
                  onClick: ()=>onSelect(l),
                  style:{
                    position:"absolute",
                    top:    l._top + 1,
                    left:   `calc(${lPct}% + 1px)`,
                    width:  `calc(${wPct}% - 3px)`,
                    height: l._h,
                    background: bg,
                    border:`1px solid ${bord}`,
                    borderLeft:`3px solid ${accent}`,
                    borderRadius:4,
                    cursor:"pointer",
                    zIndex:2,
                    overflow:"hidden",
                    padding:"2px 4px",
                    boxSizing:"border-box",
                    display:"flex", flexDirection:"column", gap:1,
                  }}
                  , React.createElement('div',{style:{fontSize:9,fontWeight:700,color:accent,
                      lineHeight:1.3,display:"flex",alignItems:"center",gap:3,overflow:"hidden"}}
                    , !isSala && React.createElement(Ic, {n: isColl(l)?"group": isProva(l)?"user":"music", size:8, stroke:accent})
                    , React.createElement('span',{style:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1,minWidth:0}}
                      , isSala
                        ? `🤘 ${normHour}–${normFine}`
                        : `${normHour} · ${
                            isColl(l)  ? (l.courseName||"Coll.")
                          : isProva(l) ? (l.contactName||"Prova")
                          : (l.student||"").split(" ")[0]
                          }`
                    )
                    , !isSala && (l.attendance || l.inRecupero) && (
                      React.createElement('div',{style:{
                        width:6, height:6, borderRadius:"50%",
                        background: l.inRecupero && !l.attendance ? '#f59e0b' : attHex(l.attendance),
                        flexShrink:0,
                      }})
                    )
                  )
                  , l._h > 26 && React.createElement('div',{style:{fontSize:9,color:accent,
                      opacity:0.85,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:1.3}}
                    , isSala
                      ? "SALA PROVE"
                      : isColl(l)
                        ? `${(l.students||[]).length} allievi`
                        : (l.instrument||"")
                  )
                  , l._h > 42 && React.createElement('div',{style:{fontSize:9,
                      color:accent,opacity:0.7,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}
                    , isSala
                      ? (l.richiedente||l.student||"")
                      : (l.teacher||"")
                  )
                  , isSala && pending && l._h > 56 && React.createElement('div',{
                      style:{fontSize:8,color:"#92400e",fontWeight:700,marginTop:"auto"}},"⏳ in attesa")
                );
              })
            );
          })
        )
      )
    )
  );
};

// ─── VISTA MENSILE ────────────────────────────────────────────────────────────
const MonthView = ({ year, month, lessons, onSelect, onDayClick, config }) => {
  const firstDay  = new Date(year, month, 1);
  // getDay() 0=Dom,1=Lun...6=Sab → in una settimana Lun–Sab (6 giorni)
  // startDow: quanti slot vuoti prima del primo giorno (0=Lun, 5=Sab, Dom non esiste)
  const rawDow = firstDay.getDay(); // 0=Dom,1=Lun...6=Sab
  // Se il primo giorno è domenica (0), la saltiamo: non appare nel calendario
  // Il numero di celle vuote è: rawDow === 0 ? 6 (poniamo dopo Sab) : rawDow - 1
  const startDow = rawDow === 0 ? 6 : rawDow - 1; // offset 0=Lun…5=Sab
  const totalDays = new Date(year, month+1, 0).getDate();
  // Genera celle: solo giorni Lun–Sab (salta domeniche)
  const cells = [];
  // Celle vuote iniziali
  for (let i = 0; i < startDow; i++) cells.push(null);
  // Aggiungi i giorni del mese, escludendo domeniche
  for (let d = 1; d <= totalDays; d++) {
    const dt = new Date(year, month, d);
    if (dt.getDay() !== 0) cells.push(d); // 0 = domenica, salta
  }
  while(cells.length % 6 !== 0) cells.push(null);

  const DAYS_SHORT_6 = ["Lun","Mar","Mer","Gio","Ven","Sab"];

  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4944}}
      , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"repeat(6,1fr)", borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4945}}
        , DAYS_SHORT_6.map((d, i) => (
          React.createElement('div', { key: d, style: {padding:"8px 0", textAlign:"center", fontSize:11,
            letterSpacing:"0.06em", textTransform:"uppercase",
            color: i === 5 ? "#b45309" : C.textMuted,
            background: i === 5 ? "#fdf4e7" : undefined}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4947}}, d)
        ))
      )
      , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"repeat(6,1fr)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4951}}
        , cells.map((day, idx) => {
          if(!day) return (
            React.createElement('div', { key: idx, style: {minHeight:90, borderBottom:`1px solid ${C.border}20`, borderRight:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4954}})
          );
          const d = new Date(year, month, day);
          const dayStr = yyyymmdd(d);
          const dayLessons = lessons.filter(l => l.date === dayStr);
          const isToday = isSameDay(d, today);
          const isSab  = d.getDay() === 6;
          const chiuso = isGiornoChiuso(dayStr, config);
          const holiday = getHoliday(dayStr);
          const bgBase  = chiuso ? chiuso.bg : isSab ? "rgba(253,244,231,0.7)" : undefined;
          const bgImg   = chiuso ? CHIUSO_PATTERN : isSab ? "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(180,83,9,0.03) 8px,rgba(180,83,9,0.03) 16px)" : undefined;
          return (
            React.createElement('div', { key: idx, onClick: () => onDayClick(d),
              style: {minHeight:"clamp(60px, 10vw, 90px)", borderBottom:`1px solid ${C.border}20`,
                borderRight:`1px solid ${C.border}20`, padding:4, cursor:"pointer", transition:"background 0.1s",
                background: bgBase, backgroundImage: bgImg},
              onMouseEnter: e => { e.currentTarget.style.background = C.surfaceHover; e.currentTarget.style.backgroundImage='none'; },
              onMouseLeave: e => { e.currentTarget.style.background = bgBase||'transparent'; e.currentTarget.style.backgroundImage = bgImg||'none'; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4961}}
              , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4966}}
                , React.createElement('span', { style: {fontSize:12, fontWeight:500,
                  color: chiuso ? chiuso.color : isToday ? C.gold : isSab ? "#b45309" : C.text,
                  background: isToday ? `${C.gold}15` : undefined,
                  borderRadius: isToday ? 4 : undefined,
                  padding: isToday ? "1px 5px" : undefined}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4967}}
                  , day
                )
                , dayLessons.length > 0 && React.createElement('span', { style: {fontSize:10, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4974}}, dayLessons.length)
              )
              , chiuso && React.createElement('div',{style:{fontSize:9,color:chiuso.color,fontWeight:700,marginBottom:2,lineHeight:1.2}}, chiuso.emoji,' ',chiuso.label)
              , !chiuso && holiday && React.createElement('div',{style:{fontSize:9,color:'#b91c1c',fontWeight:600,marginBottom:2,lineHeight:1.2}}, holiday.emoji,' ',holiday.label)
              , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4976}}
                , dayLessons.slice(0,3).map(l => (
                  React.createElement(LessonPill, { key: l.id, lesson: l, onClick: e => { e.stopPropagation(); onSelect(l); }, compact: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4978}})
                ))
                , dayLessons.length > 3 && (
                  React.createElement('div', { style: {fontSize:10, color:C.textDim, paddingLeft:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4981}}, "+", dayLessons.length-3, " altre" )
                )
              )
            )
          );
        })
      )
    )
  );
};


// ════════════════════════════════════════════════════════════════════════════════
// REPERTORIO
// ════════════════════════════════════════════════════════════════════════════════
const emptyBrano = { title:"", composer:"", tonality:"", difficulty:"Intermedio", tipo:"individuale", note:"", linkBacking:"", files:[], spartiti:[] };

const BranoFormInline = ({ initial, onSave, onClose, compact=false }) => {
  const [f, setF] = useState(initial || emptyBrano);
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({...p, [k]:v}));

  const handleSave = () => {
    const e = {};
    if(!f.title.trim())    e.title    = "Titolo obbligatorio";
    // compositore facoltativo
    if(Object.keys(e).length){ setErr(e); return; }
    onSave(f);
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:compact?10:22, display:"flex", flexDirection:"column", gap:compact?8:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5013}}
        , React.createElement(Input, { label: "Titolo *" , value: f.title, onChange: e=>set("title",e.target.value), error: err.title, placeholder: "Es. Notturno Op.9 n.2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5014}})
        , React.createElement(Input, { label: "Compositore *" , value: f.composer, onChange: e=>set("composer",e.target.value), error: err.composer, placeholder: "Es. Frédéric Chopin"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5015}})
        , React.createElement(Sel, { label: "Tonalità / Scala"  , value: f.tonality, onChange: e=>set("tonality",e.target.value), options: TONALITY_OPTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5016}})
        , React.createElement(Sel, { label: "Livello di difficoltà"  , value: f.difficulty, onChange: e=>set("difficulty",e.target.value), options: DIFFICULTY_OPTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5017}})
        
        , React.createElement(Textarea, { label: "Note / annotazioni"  , value: f.notes, onChange: e=>set("notes",e.target.value), placeholder: "Note aggiuntive, indicazioni tecniche..."   })

        /* ── Link Backing/Base Track ── */
        , React.createElement('div', null
          , React.createElement('label', {style:{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.5)',letterSpacing:'.08em',textTransform:'uppercase',display:'block',marginBottom:6}}, 'Link Backing Track / YouTube / Drive')
          , React.createElement('input', {
              type:'url', value:f.linkBacking||'', placeholder:'https://youtube.com/...',
              onChange:e=>set('linkBacking',e.target.value),
              style:{width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${C.border}`,
                background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",
                outline:'none',boxSizing:'border-box'}})
        )

        /* ── Spartiti (PDF upload) ── */
        , React.createElement('div', null
          , React.createElement('div', {style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}
            , React.createElement('label', {style:{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.5)',letterSpacing:'.08em',textTransform:'uppercase'}}, 'Spartiti')
            , React.createElement('label', {style:{fontSize:11,color:C.blue,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}
                , React.createElement(Ic,{n:'paperclip',size:11,stroke:C.blue}), 'Carica PDF'
                , React.createElement('input', {type:'file', accept:'.pdf,image/*', multiple:true, style:{display:'none'},
                    onChange: async e => {
                      const sb = window.supabaseClient;
                      const newItems = [];
                      for (const file of Array.from(e.target.files||[])) {
                        const path = `spartiti/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
                        let fileUrl = null;
                        if (sb) {
                          try {
                            await sb.storage.from('allegati').upload(path, file, {upsert:true});
                            const {data:u} = sb.storage.from('allegati').getPublicUrl(path);
                            fileUrl = u?.publicUrl||null;
                          } catch(er){}
                        }
                        newItems.push({id:'sp_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), fileName:file.name, fileUrl, fileType:file.type});
                      }
                      set('spartiti',[...(f.spartiti||[]),...newItems]);
                      e.target.value='';
                    }})
              )
          )
          , (f.spartiti||[]).length > 0 && React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:4}}
              , (f.spartiti||[]).map((s,i) => React.createElement('div', {key:s.id||i,
                    style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',
                      borderRadius:7,border:`1px solid ${C.border}`,background:C.bg}}
                  , React.createElement(Ic,{n:'paperclip',size:12,stroke:C.red})
                  , s.fileUrl
                    ? React.createElement('a',{href:s.fileUrl,target:'_blank',rel:'noopener noreferrer',
                          style:{flex:1,fontSize:12,color:C.blue,textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, s.fileName||'Spartito')
                    : React.createElement('span',{style:{flex:1,fontSize:12,color:C.text}},s.fileName||'Spartito')
                  , React.createElement('button',{onClick:()=>set('spartiti',(f.spartiti||[]).filter((_,j)=>j!==i)),
                      style:{background:'none',border:'none',cursor:'pointer',padding:2,color:C.textMuted},
                      onMouseEnter:e=>e.currentTarget.style.color=C.red,
                      onMouseLeave:e=>e.currentTarget.style.color=C.textMuted}
                    , React.createElement(Ic,{n:'x',size:12,stroke:'currentColor'}))
                ))
            )
        )

        /* ── File allegati audio/video/altro ── */
        , React.createElement('div', null
          , React.createElement('div', {style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}
            , React.createElement('label', {style:{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.5)',letterSpacing:'.08em',textTransform:'uppercase'}}, 'File allegati')
            , React.createElement('label', {style:{fontSize:11,color:C.blue,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}
                , React.createElement(Ic,{n:'paperclip',size:11,stroke:C.blue}), 'Carica file'
                , React.createElement('input', {type:'file', multiple:true, style:{display:'none'},
                    onChange: async e => {
                      const sb = window.supabaseClient;
                      const newItems = [];
                      for (const file of Array.from(e.target.files||[])) {
                        const path = `brani/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
                        let fileUrl = null;
                        if (sb) {
                          try {
                            await sb.storage.from('allegati').upload(path, file, {upsert:true});
                            const {data:u} = sb.storage.from('allegati').getPublicUrl(path);
                            fileUrl = u?.publicUrl||null;
                          } catch(er){}
                        }
                        newItems.push({id:'fa_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), fileName:file.name, fileUrl, fileType:file.type});
                      }
                      set('files',[...(f.files||[]),...newItems]);
                      e.target.value='';
                    }})
              )
          )
          , (f.files||[]).length > 0 && React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:4}}
              , (f.files||[]).map((fi,i) => React.createElement('div', {key:fi.id||i,
                    style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',
                      borderRadius:7,border:`1px solid ${C.border}`,background:C.bg}}
                  , React.createElement(Ic,{n:'paperclip',size:12,stroke:C.blue})
                  , fi.fileUrl
                    ? React.createElement('a',{href:fi.fileUrl,target:'_blank',rel:'noopener noreferrer',
                          style:{flex:1,fontSize:12,color:C.blue,textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, fi.fileName||'File')
                    : React.createElement('span',{style:{flex:1,fontSize:12,color:C.text}},fi.fileName||'File')
                  , React.createElement('button',{onClick:()=>set('files',(f.files||[]).filter((_,j)=>j!==i)),
                      style:{background:'none',border:'none',cursor:'pointer',padding:2,color:C.textMuted},
                      onMouseEnter:e=>e.currentTarget.style.color=C.red,
                      onMouseLeave:e=>e.currentTarget.style.color=C.textMuted}
                    , React.createElement(Ic,{n:'x',size:12,stroke:'currentColor'}))
                ))
            )
        )
      )
      , React.createElement('div', { style: {padding:compact?"10px 10px":"14px 22px", borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)", display:"flex", justifyContent:"flex-end", gap:8}}
        , React.createElement(Btn, { small: compact, variant: "secondary", onClick: onClose}, "Annulla")
        , React.createElement(Btn, { small: compact, onClick: handleSave}, React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff"}), _optionalChain([initial, 'optionalAccess', _50 => _50.id])?"Salva modifiche":"Aggiungi brano")
      )
    )
  );
};

const DIFF_COLORS = {
  Principiante: { fg:C.green,  bg:C.greenBg,  bd:C.greenBorder  },
  Elementare:   { fg:C.blue,   bg:C.blueBg,   bd:C.blueBorder   },
  Intermedio:   { fg:C.gold,   bg:"#e8edf5",  bd:C.goldDim      },
  Avanzato:     { fg:C.orange, bg:C.orangeBg, bd:C.orangeBorder },
  Professionale:{ fg:C.red,    bg:C.redBg,    bd:C.redBorder    },
};
const DiffBadge = ({ diff }) => {
  const dc = DIFF_COLORS[diff] || DIFF_COLORS.Intermedio;
  return (
    React.createElement('span', { style: {fontSize:10,fontWeight:600,letterSpacing:"0.06em",
      background:dc.bg, color:dc.fg, border:`1px solid ${dc.bd}`,
      borderRadius:4, padding:"2px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5054}}
      , diff||"—"
    )
  );
};
const TipoBadge = ({ tipo }) => {
  const isCol = tipo==="collettivo";
  return (
    React.createElement('span', { style: {fontSize:10,fontWeight:600,letterSpacing:"0.06em",
      background:isCol?C.purpleBg:"#e8edf5",
      color:isCol?C.purple:C.gold,
      border:`1px solid ${isCol?C.purpleBorder:C.goldDim}`,
      borderRadius:4, padding:"2px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5064}}
      , tipo||"—"
    )
  );
};

const CalRepertorioTab = ({ repertorio, lessons, onAdd, onEdit, onDelete, canEdit }) => {
  const [modal,      setModal]   = useState(null);
  const [target,     setTarget]  = useState(null);
  const [search,     setSearch]  = useState("");
  const [filterType, setFT]      = useState("");
  const [filterDiff, setFD]      = useState("");
  const [filterComp, setFC]      = useState("");
  const [expanded,   setExpanded]= useState(null); // id del brano espanso

  const usageCount    = id => (lessons||[]).filter(l => (l.repertorioIds||[]).includes(id)).length;
  const allieviOfBrano= id => [];
  const allieviCount  = id => 0;

  // Lista compositori unici per dropdown
  const composers = [...new Set(repertorio.map(b => b.composer))].sort();

  const hasFilters = search || filterType || filterDiff || filterComp;

  const filtered = repertorio.filter(b => {
    const q = search.toLowerCase();
    return (
      (!q || b.title.toLowerCase().includes(q) || b.composer.toLowerCase().includes(q) || (b.tonality||"").toLowerCase().includes(q))
      && (!filterType || b.type === filterType)
      && (!filterDiff || b.difficulty === filterDiff)
      && (!filterComp || b.composer === filterComp)
    );
  }).sort((a,b) => a.title.localeCompare(b.title));

  const individuali = filtered.filter(b => b.type === "individuale");
  const collettivi  = filtered.filter(b => b.type === "collettivo");

  // ── Riga compatta con espansione accordion ──
  const BranoRow = ({ b }) => {
    const dc      = DIFF_COLORS[b.difficulty] || DIFF_COLORS.Intermedio;
    const typeHex = b.type === "collettivo" ? C.purple : C.gold;
    const typeBg  = b.type === "collettivo" ? C.purpleBg : "#e8edf5";
    const typeBd  = b.type === "collettivo" ? C.purpleBorder : C.goldDim;
    const uses    = usageCount(b.id);
    const open    = expanded === b.id;

    return (
      React.createElement('div', { style: {borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5113}}
        /* Riga principale — clic per espandere */
        , React.createElement('div', { onClick: () => setExpanded(open ? null : b.id),
          style: {display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
            cursor:"pointer", transition:"background 0.12s", background: open ? C.surfaceHover : "transparent"},
          onMouseEnter: e => { if(!open) e.currentTarget.style.background = C.surfaceHover; },
          onMouseLeave: e => { if(!open) e.currentTarget.style.background = "transparent"; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5115}}

          /* Chevron */
          , React.createElement('div', { style: {width:16, flexShrink:0, transition:"transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)", color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5122}}
            , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5124}})
          )

          /* Titolo + compositore */
          , React.createElement('div', { style: {flex:"0 0 38%", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5128}}
            , React.createElement('div', { style: {fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5129}}, b.title)
            , React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5130}}, b.composer)
          )

          /* Tonalità */
          , React.createElement('div', { style: {flex:"0 0 18%", fontSize:12, color:C.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5134}}
            , b.tonality || React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5135}}, "—")
          )

          /* Badge difficoltà */
          , React.createElement('div', { style: {flex:"0 0 120px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5139}}
            , React.createElement('span', { style: {fontSize:11, padding:"2px 8px", borderRadius:4,
              border:`1px solid ${dc.bd}`, background:dc.bg, color:dc.fg, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5140}}
              , b.difficulty
            )
          )

          /* Badge tipo */
          , React.createElement('div', { style: {flex:"0 0 90px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5147}}
            , React.createElement('span', { style: {fontSize:11, padding:"2px 8px", borderRadius:4,
              border:`1px solid ${typeBd}`, background:typeBg, color:typeHex, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5148}}
              , b.type
            )
          )

          /* Utilizzi */
          , React.createElement('div', { style: {flex:"0 0 70px", textAlign:"right", fontSize:11, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5155}}
            , uses > 0 ? `${uses} lez.` : "—"
          )

          /* Azioni */
          , canEdit && (
            React.createElement('div', { style: {display:"flex", gap:2, flexShrink:0}, onClick: e => e.stopPropagation(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5161}}
              , React.createElement('button', { onClick: () => { setTarget(b); setModal("edit"); },
                style: {background:"none", border:"none", cursor:"pointer", color:C.textMuted, padding:"4px 6px", display:"flex", borderRadius:6},
                onMouseEnter: e => e.currentTarget.style.color=C.gold,
                onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5162}}
                , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5166}})
              )
              , React.createElement('button', { onClick: () => { setTarget(b); setModal("delete"); },
                style: {background:"none", border:"none", cursor:"pointer", color:C.textMuted, padding:"4px 6px", display:"flex", borderRadius:6},
                onMouseEnter: e => e.currentTarget.style.color=C.red,
                onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5168}}
                , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5172}})
              )
            )
          )
        )

        /* Pannello espanso */
        , open && (
          React.createElement('div', { style: {padding:"12px 16px 14px 44px", background:C.surfaceHover,
            borderTop:`1px solid ${C.border}20`, display:"flex", flexDirection:"column", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5180}}
            , b.notes
              ? React.createElement('p', { style: {fontSize:13, color:C.textMuted, lineHeight:1.6, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5183}}, b.notes)
              : React.createElement('p', { style: {fontSize:12, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5184}}, "Nessuna annotazione" )
            
            , React.createElement('div', { style: {fontSize:11, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5186}}, "Usato in "
                , React.createElement('strong', { style: {color:uses>0?C.gold:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5187}}, uses), " " , uses===1?"lezione":"lezioni"
            )
          )
        )
      )
    );
  };

  // ── Sezione collassabile ──
  const AccordionSection = ({ label, items, typeHex, icon }) => {
    const [open, setOpen] = useState(true);
    return (
      React.createElement('div', { style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden"}, className: "table-scroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5199}}
        /* Header sezione */
        , React.createElement('button', { onClick: () => setOpen(p => !p),
          style: {width:"100%", display:"flex", alignItems:"center", gap:10, padding:"13px 16px",
            background:"none", border:"none", cursor:"pointer", borderBottom: open ? `1px solid ${C.border}` : "none",
            transition:"background 0.12s"},
          onMouseEnter: e => e.currentTarget.style.background=C.surfaceHover,
          onMouseLeave: e => e.currentTarget.style.background="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5201}}
          , React.createElement(Ic, { n: icon, size: 14, stroke: typeHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5207}})
          , React.createElement('span', { style: {fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textMuted, fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5208}}, label)
          , React.createElement('span', { style: {fontSize:11, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5209}}, "(", items.length, ")")
          , React.createElement('div', { style: {marginLeft:"auto", transition:"transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5210}}
            , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5211}})
          )
        )

        , open && (
          React.createElement(React.Fragment, null
            /* Header colonne */
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:12, padding:"7px 16px",
              borderBottom:`1px solid ${C.border}`, background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5218}}
              , React.createElement('div', { style: {width:16, flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5220}})
              , React.createElement('div', { style: {flex:"0 0 38%", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5221}}, "Titolo / Compositore"  )
              , React.createElement('div', { style: {flex:"0 0 18%", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5222}}, "Tonalità")
              , React.createElement('div', { style: {flex:"0 0 120px", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5223}}, "Difficoltà")
              , React.createElement('div', { style: {flex:"0 0 90px", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5224}}, "Tipo")
              , React.createElement('div', { style: {flex:"0 0 70px", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5225}}, "Lezioni")
              , canEdit && React.createElement('div', { style: {width:56}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5226}})
            )
            , items.map(b => React.createElement(BranoRow, { key: b.id, b: b, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5228}}))
          )
        )
      )
    );
  };

  return (
    React.createElement('div', { style: {flex:1, padding:24, overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5236}}
      , React.createElement('div', { style: {maxWidth:1100, margin:"0 auto", display:"flex", flexDirection:"column", gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5237}}

        /* Header */
        , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5240}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5241}}
            , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif", fontSize:32, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5242}}, "Repertorio")
            , React.createElement('p', { style: {color:C.textMuted, fontSize:14, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5243}}
              , repertorio.length, " brani totali · "    , repertorio.filter(b=>b.type==="individuale").length, " individuali · "   , repertorio.filter(b=>b.type==="collettivo").length, " collettivi"
            )
          )
          , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
            , React.createElement(RefreshBtn)
            , canEdit && React.createElement(Btn, { onClick: ()=>setModal("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5247}}, React.createElement(Ic, { n: "plus", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5247}}), "Nuovo brano" )
          )
        )

        /* Barra ricerca + filtri a tendina */
        , React.createElement('div', { style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px",
          display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5251}}
          /* Ricerca */
          , React.createElement('div', { style: {position:"relative", flex:"1 1 220px", minWidth:180}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5254}}
            , React.createElement('span', { style: {position:"absolute", left:11, top:"50%", transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5255}}
              , React.createElement(Ic, { n: "search", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5256}})
            )
            , React.createElement('input', { value: search, onChange: e => setSearch(e.target.value),
              placeholder: "Cerca titolo, compositore, tonalità..."   ,
              style: {width:"100%", background:C.bg, border:`1px solid ${search?C.goldDim:C.border}`,
                borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px 9px 36px",
                fontFamily:"'Open Sans',sans-serif", transition:"border-color 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5258}})
          )

          /* Tendina tipo */
          , React.createElement('select', { value: filterType, onChange: e => setFT(e.target.value),
            style: {flex:"0 0 130px", background:C.bg, border:`1px solid ${filterType?C.goldDim:C.border}`,
              borderRadius:8, color:filterType?C.gold:C.textMuted, fontSize:13,
              padding:"9px 12px", fontFamily:"'Open Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5266}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5270}}, "Tutti i tipi"  )
            , React.createElement('option', { value: "individuale", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5271}}, "Individuale")
            , React.createElement('option', { value: "collettivo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5272}}, "Collettivo")
          )

          /* Tendina difficoltà */
          , React.createElement('select', { value: filterDiff, onChange: e => setFD(e.target.value),
            style: {flex:"0 0 155px", background:C.bg, border:`1px solid ${filterDiff?C.goldDim:C.border}`,
              borderRadius:8, color:filterDiff?C.gold:C.textMuted, fontSize:13,
              padding:"9px 12px", fontFamily:"'Open Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5276}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5280}}, "Tutte le difficoltà"  )
            , DIFFICULTY_OPTS.map(d => React.createElement('option', { key: d, value: d, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5281}}, d))
          )

          /* Tendina compositore */
          , React.createElement('select', { value: filterComp, onChange: e => setFC(e.target.value),
            style: {flex:"0 0 180px", background:C.bg, border:`1px solid ${filterComp?C.goldDim:C.border}`,
              borderRadius:8, color:filterComp?C.gold:C.textMuted, fontSize:13,
              padding:"9px 12px", fontFamily:"'Open Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5285}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5289}}, "Tutti i compositori"  )
            , composers.map(c => React.createElement('option', { key: c, value: c, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5290}}, c))
          )

          /* Reset filtri */
          , hasFilters && (
            React.createElement('button', { onClick: () => { setSearch(""); setFT(""); setFD(""); setFC(""); },
              style: {background:"none", border:`1px solid ${C.border}`, borderRadius:8,
                color:C.textMuted, fontSize:12, padding:"9px 14px", cursor:"pointer",
                fontFamily:"'Open Sans',sans-serif", display:"flex", alignItems:"center", gap:5,
                transition:"all 0.12s", whiteSpace:"nowrap"},
              onMouseEnter: e => { e.currentTarget.style.borderColor=C.red; e.currentTarget.style.color=C.red; },
              onMouseLeave: e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5295}}
              , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5302}}), "Azzera filtri"
            )
          )

          /* Risultati */
          , React.createElement('span', { style: {fontSize:12, color:C.textDim, marginLeft:"auto", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5307}}
            , filtered.length, " / "  , repertorio.length, " brani"
          )
        )

        /* Sezioni accordion */
        , filtered.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center", padding:"48px 0", color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5314}}
            , React.createElement(Ic, { n: "note", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5315}})
            , React.createElement('p', { style: {marginTop:12, fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5316}}, "Nessun brano trovato"  )
            , hasFilters && React.createElement('p', { style: {fontSize:12, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5317}}, "Prova ad azzera i filtri"    )
          )
        ) : (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5320}}
            , individuali.length > 0 && (
              React.createElement(AccordionSection, { label: "Brani individuali" , items: individuali, typeHex: C.gold, icon: "solo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5322}})
            )
            , collettivi.length > 0 && (
              React.createElement(AccordionSection, { label: "Brani collettivi" , items: collettivi, typeHex: C.purple, icon: "group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5325}})
            )
          )
        )
      )

      , modal==="add"    && React.createElement(Modal, { title: "Nuovo brano" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5331}}, React.createElement(BranoFormInline, { onSave: b=>{onAdd(b);setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5331}}))
      , modal==="edit"   && target && React.createElement(Modal, { title: "Modifica brano" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5332}}, React.createElement(BranoFormInline, { initial: target, onSave: b=>{onEdit({...target,...b});setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5332}}))
      , modal==="delete" && target && React.createElement(ConfirmDelete, { label: target.title, onConfirm: ()=>{onDelete(target.id);setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5333}})
    )
  );
};

// ─── FORM LEZIONE COLLETTIVA ─────────────────────────────────────────────────
const CollectiveLessonForm = ({ initial, courses, students, docenti:_docentiRaw, repertorio:_repertorioRaw, onAddBrano, onSave, onClose }) => {
  const docenti    = _docentiRaw    || [];
  const repertorio = _repertorioRaw || [];
  const collettivi = courses.filter(c => c.type === "collettivo");

  // In modalità edit (initial presente) si salta lo step di selezione corso
  const initCourse = initial ? (courses.find(c => c.id === initial.courseId) || null) : null;

  const [step,        setStep]       = useState(initial ? 2 : 1); // edit → salta al step 2
  const [selCourse,   setSelCourse]  = useState(initCourse);
  const [selStudents, setSelStudents]= useState(
    initial ? (initial.students || []).map(s => s.id).filter(Boolean) : []
  );
  const [repertorioIds, setRepertorioIds] = useState(initial?.repertorioIds || []);
  const [showBranoForm, setShowBranoForm] = useState(false);
  const [newBranoForm, setNewBranoForm]   = useState({ title:'', composer:'', period:'', tonality:'', type:'collettivo', difficulty:'', notes:'' });
  const [form, setForm] = useState({
    date:      initial?.date      || yyyymmdd(today),
    hour:      initial?.hour      || "15:00",
    durata:    initial?.durata    || 60,
    teacherId: initial?.teacher   || "",
    room:      initial?.room      || "",
    topic:     initial?.topic     || "",
    notes:     initial?.notes     || "",
    exercises: initial?.exercises || "",
    recurrence:initial?.recurrence|| "Nessuna",
    attendance:initial?.attendance|| "",
  });
  const [err, setErr] = useState({});
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const setNB = (k,v) => setNewBranoForm(p=>({...p,[k]:v}));

  // Docenti assegnati al corso selezionato
  const courseDocenti = selCourse
    ? docenti.filter(d => (selCourse.docenti||[]).includes(d.id))
    : [];

  // Allievi iscritti al corso e attivi
  const enrolled = selCourse
    ? students.filter(s => s.complementaryCourse === selCourse.id && s.status === "attivo")
    : [];

  const toggleStudent = id =>
    setSelStudents(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const selectAll   = () => setSelStudents(enrolled.map(s=>s.id));
  const deselectAll = () => setSelStudents([]);

  // Quando cambia il corso resetta il docente se non è nel nuovo corso
  const handleCourseSelect = (c) => {
    setSelCourse(c);
    setSelStudents([]);
    // pre-seleziona il docente se c'è uno solo
    const docs = docenti.filter(d => (c.docenti||[]).includes(d.id));
    set("teacherId", docs.length === 1 ? docs[0].id : "");
  };

  const validate = () => {
    const e = {};
    if (!form.date)                    e.date      = "Data obbligatoria";
    if (!form.hour)                    e.hour      = "Orario obbligatorio";
    if (!form.teacherId)               e.teacherId = "Seleziona il docente";
    if (selStudents.length === 0)      e.students  = "Seleziona almeno un allievo";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    const teacherObj = docenti.find(d => d.id === form.teacherId);
    const studObjs   = selStudents.map(id => {
      const s = students.find(x => x.id === id);
      return { id: s.id, name: s.name, instrument: s.instrument, level: s.level||"" };
    });
    onSave({
      id:         initial?.id || uid(),  // preserva id in edit mode
      tipo:       "collettivo",
      courseId:   selCourse.id,
      courseName: selCourse.name,
      date:       form.date,
      hour:       form.hour,
      teacher:    _optionalChain([teacherObj, 'optionalAccess', _51 => _51.nome]) || _optionalChain([teacherObj, 'optionalAccess', _52 => _52.name]) || "",
      teacherId:  form.teacherId,
      room:       form.room,
      topic:      form.topic || selCourse.name,
      notes:      form.notes,
      exercises:  form.exercises,
      recurrence: form.recurrence,
      attendance: form.attendance || initial?.attendance || "",
      inRecupero: initial?.inRecupero || false,
      recuperoScadenza: initial?.recuperoScadenza || null,
      student:    selCourse.name,
      instrument: "Vari",
      students:      studObjs,
      repertorioIds: repertorioIds,
      durata: form.durata || 60,
    });
  };

  // ── STEP 1: scegli corso ──
  if (step === 1) return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5426}}
        , React.createElement('p', { style: {fontSize:13, color:C.textMuted, margin:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5427}}, "Seleziona la materia integrativa per cui creare la sessione collettiva."

        )
        , collettivi.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center", padding:"32px 0", color:C.textDim, fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5431}}, "Nessun corso collettivo configurato. Aggiungine uno dalla sezione "
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5432}}, "Corsi"), "."
          )
        ) : (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5435}}
            , collettivi.map(c => {
              const nIscritti = students.filter(s=>s.complementaryCourse===c.id&&s.status==="attivo").length;
              const nDocenti  = (c.docenti||[]).length;
              const isS = _optionalChain([selCourse, 'optionalAccess', _53 => _53.id]) === c.id;
              return (
                React.createElement('button', { key: c.id, onClick: () => handleCourseSelect(c),
                  style: {display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
                    borderRadius:10, cursor:"pointer", textAlign:"left", width:"100%",
                    border:`2px solid ${isS?C.purple:C.border}`,
                    background:isS?C.purpleBg:C.surface, transition:"all 0.15s",
                    fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5441}}
                  , React.createElement('div', { style: {width:40, height:40, borderRadius:10, background:`${C.purple}20`,
                    border:`1px solid ${C.purpleBorder}`, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5447}}
                    , React.createElement(Ic, { n: "group", size: 18, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5450}})
                  )
                  , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5452}}
                    , React.createElement('div', { style: {fontSize:14, fontWeight:600, color:isS?C.purple:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5453}}, c.name)
                    , c.description && React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5454}}, c.description)
                  )
                  , React.createElement('div', { style: {textAlign:"right", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5456}}
                    , React.createElement('div', { style: {fontSize:16, fontFamily:"'Oswald',sans-serif", fontWeight:600,
                      color:nIscritti>0?C.purple:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5457}}, nIscritti)
                    , React.createElement('div', { style: {fontSize:9, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5459}}, "allievi")
                    , React.createElement('div', { style: {fontSize:9, color:C.textDim, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5460}}, nDocenti, " doc." )
                  )
                )
              );
            })
          )
        )
      )
      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,
        display:"flex", justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5468}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5470}}, "Annulla")
        , React.createElement(Btn, { onClick: () => { if(selCourse) setStep(2); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5471}}, "Avanti "
           , React.createElement(Ic, { n: "right", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5472}})
        )
      )
    )
  );

  // ── STEP 2: docente + dettagli + allievi ──
  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:14,
        maxHeight:"74vh", overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5481}}

        /* Header corso */
        , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
          background:C.purpleBg, border:`1px solid ${C.purpleBorder}`, borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5485}}
          , React.createElement(Ic, { n: "group", size: 16, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5487}})
          , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5488}}
            , React.createElement('div', { style: {fontSize:13, fontWeight:600, color:C.purple}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5489}}, selCourse.name)
            , selCourse.description && React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5490}}, selCourse.description)
          )
          , React.createElement('button', { onClick: () => { setStep(1); setSelStudents([]); },
            style: {background:"none", border:`1px solid ${C.border}`, borderRadius:6,
              cursor:"pointer", color:C.textMuted, fontSize:11, padding:"3px 10px",
              fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5492}}, "Cambia"

          )
        )

        /* Selezione docente */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5501}}
          , React.createElement('label', { style: {fontSize:11, color:err.teacherId?C.red:C.textMuted,
            letterSpacing:"0.07em", textTransform:"uppercase", display:"block", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5502}}, "Docente *"

          )
          , courseDocenti.length === 0 ? (
            React.createElement('p', { style: {fontSize:12, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5507}}, "Nessun docente assegnato a questo corso. Modificalo dalla sezione Corsi."

            )
          ) : (
            React.createElement('div', { style: {display:"flex", gap:8, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5511}}
              , courseDocenti.map(d => {
                const isS = form.teacherId === d.id;
                return (
                  React.createElement('button', { key: d.id, onClick: () => set("teacherId", d.id),
                    style: {display:"flex", alignItems:"center", gap:8, padding:"8px 14px",
                      borderRadius:10, cursor:"pointer", textAlign:"left",
                      border:`2px solid ${isS?C.gold:C.border}`,
                      background:isS?C.goldBg:C.surface, transition:"all 0.12s",
                      fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5515}}
                    , React.createElement('div', { style: {width:30, height:30, borderRadius:"50%", flexShrink:0,
                      background:`${C.gold}20`, border:`1px solid ${C.goldDim}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:700, color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5521}}
                      , initials(d.nome||d.name||"")
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5527}}
                      , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:isS?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5528}}
                        , d.nome||d.name
                      )
                      , React.createElement('div', { style: {fontSize:10, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5531}}, d.strumenti||d.instrument||"")
                    )
                  )
                );
              })
            )
          )
          , err.teacherId && React.createElement('div', { style: {fontSize:11, color:C.red, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5538}}, err.teacherId)
        )

        /* Data, orario, sala */
        , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5542}}
          , React.createElement(Input, { label: "Data *" , type: "date", value: form.date,
            onChange: e=>set("date",e.target.value), error: err.date, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5543}})
          , React.createElement(Input, { label: "Orario *" , type: "time", value: form.hour,
            onChange: e=>set("hour",e.target.value), error: err.hour, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5545}})
          , React.createElement(Sel, { label: "Durata", value: String(form.durata||60),
            onChange: e=>set("durata",parseInt(e.target.value)),
            options: [{value:"45",label:"45 min"},{value:"60",label:"60 min"},{value:"90",label:"1h 30min"},{value:"120",label:"2 ore"}]})
          , React.createElement(Input, { label: "Sala", value: form.room,
            onChange: e=>set("room",e.target.value), placeholder: "Es. Sala A"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5547}})
        )
        , React.createElement(Input, { label: "Argomento", value: form.topic,
          onChange: e=>set("topic",e.target.value),
          placeholder: `Es. Introduzione a ${selCourse.name}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5550}})
        , React.createElement(Textarea, { label: "Note", value: form.notes,
          onChange: e=>set("notes",e.target.value), placeholder: "Annotazioni...", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5553}})

        /* Ricorrenza */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5557}}
          , React.createElement('label', { style: {fontSize:11, color:C.textMuted, letterSpacing:"0.07em",
            textTransform:"uppercase", display:"block", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5558}}, "Ricorrenza")
          , React.createElement('div', { style: {display:"flex", gap:6, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5560}}
            , RECURRENCE_OPTS.map(r => (
              React.createElement('button', { key: r, onClick: () => set("recurrence",r),
                style: {padding:"6px 14px", borderRadius:20, fontSize:12,
                  border:`2px solid ${form.recurrence===r?C.blue:C.border}`,
                  background:form.recurrence===r?C.blueBg:C.bg,
                  color:form.recurrence===r?C.blue:C.textMuted, cursor:"pointer",
                  fontFamily:"'Open Sans',sans-serif", display:"flex", alignItems:"center",
                  gap:5, transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5562}}
                , r!=="Nessuna" && React.createElement(Ic, { n: "repeat", size: 11, stroke: form.recurrence===r?C.blue:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5569}})
                , r
              )
            ))
          )
        )

        /* Selezione allievi */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5577}}
          , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5578}}
            , React.createElement('label', { style: {fontSize:11, color:err.students?C.red:C.textMuted,
              letterSpacing:"0.07em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5579}}, "Allievi iscritti *"

            )
            , React.createElement('div', { style: {display:"flex", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5583}}
              , React.createElement('button', { onClick: selectAll,
                style: {fontSize:11, padding:"2px 10px", borderRadius:6, cursor:"pointer",
                  background:C.purpleBg, color:C.purple, border:`1px solid ${C.purpleBorder}`,
                  fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5584}}, "Tutti")
              , React.createElement('button', { onClick: deselectAll,
                style: {fontSize:11, padding:"2px 10px", borderRadius:6, cursor:"pointer",
                  background:C.bg, color:C.textMuted, border:`1px solid ${C.border}`,
                  fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5588}}, "Nessuno")
            )
          )
          , err.students && React.createElement('div', { style: {fontSize:11, color:C.red, marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5594}}, err.students)

          , enrolled.length === 0 ? (
            React.createElement('div', { style: {padding:"20px 0", textAlign:"center", color:C.textDim, fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5597}}, "Nessun allievo attivo iscritto a questo corso."

            )
          ) : (
            React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5601}}
              , enrolled.map(s => {
                const isSel = selStudents.includes(s.id);
                const sc    = insHex(s.instrument);
                return (
                  React.createElement('button', { key: s.id, onClick: () => toggleStudent(s.id),
                    style: {display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                      borderRadius:8, cursor:"pointer", textAlign:"left", width:"100%",
                      border:`2px solid ${isSel?sc:C.border}`,
                      background:isSel?`${sc}10`:C.surface, transition:"all 0.12s",
                      fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5606}}
                    /* checkbox */
                    , React.createElement('div', { style: {width:18, height:18, borderRadius:5, flexShrink:0,
                      border:`2px solid ${isSel?sc:C.border}`, background:isSel?sc:"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5613}}
                      , isSel && React.createElement(Ic, { n: "check", size: 10, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5617}})
                    )
                    /* avatar */
                    , React.createElement('div', { style: {width:30, height:30, borderRadius:"50%", flexShrink:0,
                      background:`${sc}20`, border:`1px solid ${sc}40`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:700, color:sc}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5620}}
                      , initials(s.name)
                    )
                    , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5626}}
                      , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:isSel?sc:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5627}}, s.name)
                      , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5628}}, s.instrument, " · "  , s.level||"—")
                    )
                    , isSel && React.createElement(Ic, { n: "check", size: 13, stroke: sc, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5630}})
                  )
                );
              })
            )
          )

          /* Riepilogo */
          , selStudents.length > 0 && (
            React.createElement('div', { style: {marginTop:8, padding:"8px 14px", background:C.purpleBg,
              border:`1px solid ${C.purpleBorder}`, borderRadius:8, fontSize:12,
              color:C.purple, display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5639}}
              , React.createElement(Ic, { n: "group", size: 13, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5642}})
              , selStudents.length, " allievo/i · 1 lezione con tutti gli allievi assegnati"
            )
          )
        )
      )

      , React.createElement('div', { style: {padding:"0 22px 14px", borderTop:"none"}, __self: this}
        , React.createElement('label', { style: {fontSize:11, color:C.textMuted, letterSpacing:"0.07em",
            textTransform:"uppercase", display:"block", marginBottom:8}, __self: this}, "Brani per questa lezione" )

        , React.createElement('select', {
            value: "",
            onChange: e => {
              const id = e.target.value;
              if(!id) return;
              if(!repertorioIds.includes(id)) setRepertorioIds(p => [...p, id]);
            },
            style: {background:C.bg, border:"1px solid " + C.border, borderRadius:8,
              color:C.textMuted, fontSize:13, padding:"10px 14px", width:"100%",
              fontFamily:"'Open Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this}
          , React.createElement('option', { value:"", __self: this},
              repertorio.length === 0 ? "Nessun brano nel catalogo" : "+ Aggiungi brano dal catalogo..." )
          , repertorio.map(b =>
              !repertorioIds.includes(b.id) && React.createElement('option', { key:b.id, value:b.id, __self: this},
                b.title + " — " + b.composer + (b.tonality ? " (" + b.tonality + ")" : "") )
            )
        )

        , repertorioIds.length > 0 && React.createElement('div', {
            style: {display:"flex", flexDirection:"column", gap:5, marginTop:8}, __self: this}
          , repertorioIds.map(id => {
              const b = repertorio.find(r => r.id === id);
              if(!b) return null;
              return React.createElement('div', { key:id, style:{display:"flex", alignItems:"center", gap:10,
                padding:"8px 12px", borderRadius:8, background:C.purpleBg,
                border:"1px solid " + C.purpleBorder}, __self: this}
                , React.createElement(Ic, { n:"note", size:13, stroke:C.purple, __self: this})
                , React.createElement('div', { style:{flex:1, fontSize:13, fontWeight:500, color:C.purple,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this},
                    b.title,
                    React.createElement('span', {style:{fontWeight:400, color:C.textMuted, fontSize:11}},
                    " — " + b.composer))
                , React.createElement('button', { onClick: () => setRepertorioIds(p => p.filter(i=>i!==id)),
                    style:{background:"none", border:"none", cursor:"pointer", color:C.textDim,
                      fontSize:16, lineHeight:1, padding:"0 2px", fontFamily:"inherit"}, __self: this}, "×")
              );
            })
        )

        , !showBranoForm && React.createElement('button', {
            onClick: () => setShowBranoForm(true),
            style: {marginTop:8, fontSize:12, color:C.blue, background:"none", border:"none",
              cursor:"pointer", fontFamily:"'Open Sans',sans-serif", padding:"4px 0", textAlign:"left"}, __self: this},
            "+ Crea nuovo brano nel catalogo" )

        , showBranoForm && React.createElement('div', {
            style:{marginTop:10, padding:14, background:C.bg, border:"1px solid " + C.border,
              borderRadius:10, display:"flex", flexDirection:"column", gap:10}, __self: this}
          , React.createElement('div', {style:{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}, __self: this}
            , React.createElement('input', { placeholder:"Titolo *", value:newBranoForm.title,
                onChange:function(e){setNB("title",e.target.value);},
                style:{background:C.surface, border:"1px solid " + (newBranoForm.title ? C.border : C.red),
                  borderRadius:7, color:C.text, fontSize:13, padding:"8px 12px",
                  fontFamily:"'Open Sans',sans-serif", width:"100%", boxSizing:"border-box"}, __self: this})
            , React.createElement('input', { placeholder:"Compositore", value:newBranoForm.composer,
                onChange:function(e){setNB("composer",e.target.value);},
                style:{background:C.surface, border:"1px solid " + C.border, borderRadius:7,
                  color:C.text, fontSize:13, padding:"8px 12px",
                  fontFamily:"'Open Sans',sans-serif", width:"100%", boxSizing:"border-box"}, __self: this})
            , React.createElement('input', { placeholder:"Tonalità (es. Do maggiore)", value:newBranoForm.tonality,
                onChange:function(e){setNB("tonality",e.target.value);},
                style:{background:C.surface, border:"1px solid " + C.border, borderRadius:7,
                  color:C.text, fontSize:13, padding:"8px 12px",
                  fontFamily:"'Open Sans',sans-serif", width:"100%", boxSizing:"border-box"}, __self: this})
            , React.createElement('input', { placeholder:"Periodo (es. Romantico)", value:newBranoForm.period,
                onChange:function(e){setNB("period",e.target.value);},
                style:{background:C.surface, border:"1px solid " + C.border, borderRadius:7,
                  color:C.text, fontSize:13, padding:"8px 12px",
                  fontFamily:"'Open Sans',sans-serif", width:"100%", boxSizing:"border-box"}, __self: this})
          )
          , React.createElement('div', {style:{display:"flex", gap:8}, __self: this}
            , React.createElement('button', {
                onClick: function() {
                  if(!newBranoForm.title.trim()) return;
                  var newId = uid();
                  var newBrano = Object.assign({ id:newId }, newBranoForm, { tipo:"collettivo", type:"collettivo", lezioni:0 });
                  if(onAddBrano) onAddBrano(newBrano);
                  setRepertorioIds(function(p){ return [...p, newId]; });
                  setNewBranoForm({ title:"", composer:"", period:"", tonality:"", type:"collettivo", difficulty:"", notes:"" });
                  setShowBranoForm(false);
                },
                style:{flex:1, padding:"8px 14px", background:C.blue, border:"none", borderRadius:8,
                  color:"#ffffff", fontSize:13, fontWeight:600, cursor:"pointer",
                  fontFamily:"'Open Sans',sans-serif"}, __self: this}, "Aggiungi al catalogo" )
            , React.createElement('button', {
                onClick: function(){ setShowBranoForm(false); setNewBranoForm({title:"",composer:"",period:"",tonality:"",type:"collettivo",difficulty:"",notes:""}); },
                style:{padding:"8px 14px", background:"none", border:"1px solid " + C.border, borderRadius:8,
                  color:C.textMuted, fontSize:13, cursor:"pointer",
                  fontFamily:"'Open Sans',sans-serif"}, __self: this}, "Annulla" )
          )
        )
      )

      , React.createElement('div', { style: {padding:"14px 22px", borderTop:"1px solid " + C.border,
        display:"flex", justifyContent:"space-between", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5649}}
        , React.createElement(Btn, { variant: "secondary", onClick: () => setStep(1), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5651}}
          , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5652}}), "Indietro"
        )
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5654}}
          , React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5655}}), "Crea lezione"
           , selStudents.length>0?` (${selStudents.length} allievi)`:""
        )
      )
    )
  );
};


// ─── FORM LEZIONE PROVA ────────────────────────────────────────────────────────
const emptyProva = {
  date: yyyymmdd(today), hour:"09:00", teacher:"", instrument:"",
  room:"", phone:"", contactName:"", notes:"", student:"", iscritto:false, attendance:"",
  durata: 30,
};

const TrialLessonForm = ({ docenti:_docentiRaw, courses:_coursesRaw, initial, onSave, onClose, date }) => {
  const docenti = _docentiRaw || [];
  const courses = _coursesRaw || [];
  // Merge initial con emptyProva per garantire tutti i campi (phone potrebbe mancare nelle lezioni di prova salvate prima)
  const [f, setF] = useState({...emptyProva, date: date || yyyymmdd(today), ...(initial||{})});
  const [err, setErr] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  // Corsi individuali + collettivi come opzioni strumento/corso
  // Opzioni corso/strumento: usa SEMPRE i corsi reali dal DB
  // Fallback alla lista hardcoded SOLO se il DB non ha ancora caricato nulla
  const STRUMENTI_FALLBACK = ["Pianoforte","Violino","Chitarra","Flauto","Batteria","Canto","Sassofono","Tromba","Violoncello","Solfeggio"];
  const corsiCollettivi  = courses.filter(c => c.type === "collettivo");
  const corsiIndividuali = courses.filter(c => c.type !== "collettivo");
  const corsiOpts = courses.length > 0
    ? [
        ...corsiCollettivi.map(c => ({ id: c.id, label: `${c.name} (collettivo)` })),
        ...corsiIndividuali.map(c => ({ id: c.id, label: c.name })),
      ]
    : STRUMENTI_FALLBACK.map(s => ({ id: s, label: s }));

  const validate = () => {
    const e = {};
    if(!f.teacher)    e.teacher    = "Seleziona un docente";
    if(!f.instrument) e.instrument = "Seleziona un corso/strumento";
    if(!f.date)       e.date       = "Data obbligatoria";
    if(!f.hour)       e.hour       = "Orario obbligatorio";
    if(!(f.phone||'').trim()) e.phone    = "Recapito obbligatorio";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if(Object.keys(e).length){ setErr(e); return; }
    onSave({
      ...f,
      id: (initial && initial.id) || uid(),  // preserva id in edit mode
      tipo:"prova",
      student: f.student || "",
      iscritto: f.iscritto || false,
      attendance: f.attendance || "",
      recurrence:"Nessuna", repertorioIds:[],
      durata: f.durata || 30,
    });
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5707}}
        /* Banner informativo */
        , React.createElement('div', { style: {padding:"10px 14px", background:C.tealBg, border:`1px solid ${C.tealBorder}`,
          borderRadius:8, display:"flex", alignItems:"center", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5709}}
          , React.createElement(Ic, { n: "user", size: 15, stroke: C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5711}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5712}}
            , React.createElement('div', { style: {fontSize:12, fontWeight:600, color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5713}}, "Lezione di prova"  )
            , React.createElement('div', { style: {fontSize:11, color:C.teal, opacity:0.8, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5714}}, "Nessun allievo ancora iscritto — il contatto verrà collegato all'allievo dopo l'iscrizione"

            )
          )
        )

        /* Nome contatto */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5721}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5722}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5723}}, "Nome contatto" )
            , React.createElement('input', { value: f.contactName, onChange: e=>set("contactName",e.target.value),
              placeholder: "Es. Marco Rossi"  ,
              style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5724}})
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5729}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5730}}, "Recapito telefonico *"  )
            , React.createElement('input', { type: "tel", value: f.phone, onChange: e=>set("phone",e.target.value),
              placeholder: "Es. 333 1234567"  ,
              style: {width:"100%",background:C.surface,border:`1px solid ${err.phone?C.red:C.border}`,
                borderRadius:8,color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5731}})
            , err.phone && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5735}}, err.phone)
          )
        )

        /* Docente */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5740}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5741}}, "Docente *"

          )
          , React.createElement('select', { value: f.teacher, onChange: e=>set("teacher",e.target.value),
            style: {width:"100%",background:C.surface,border:`1px solid ${err.teacher?C.red:C.border}`,
              borderRadius:8,color:f.teacher?C.text:C.textMuted,fontSize:13,padding:"10px 14px",
              fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5744}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5748}}, "— seleziona docente —"   )
            , docenti.map(d=>(
              React.createElement('option', { key: d.id, value: d.teacherKey||d.nome, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5750}}, d.nome, " · "  , d.strumenti)
            ))
          )
          , err.teacher && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5753}}, err.teacher)
        )

        /* Corso / Strumento */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5757}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5758}}, "Corso / Strumento *"

          )
          , React.createElement('select', { value: f.instrument, onChange: e=>set("instrument",e.target.value),
            style: {width:"100%",background:C.surface,border:`1px solid ${err.instrument?C.red:C.border}`,
              borderRadius:8,color:f.instrument?C.text:C.textMuted,fontSize:13,padding:"10px 14px",
              fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5761}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5765}}, "— seleziona corso —"   )
            , corsiOpts.map(c=>React.createElement('option', { key: c.id, value: c.label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5766}}, c.label))
          )
          , err.instrument && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5768}}, err.instrument)
        )

        /* Data e Orario */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5772}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5773}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5774}}, "Data *" )
            , React.createElement('input', { type: "date", value: f.date, onChange: e=>set("date",e.target.value),
              style: {width:"100%",background:C.surface,border:`1px solid ${err.date?C.red:C.border}`,
                borderRadius:8,color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5775}})
            , err.date && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5778}}, err.date)
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5780}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5781}}, "Orario *" )
            , React.createElement('input', { type: "time", value: f.hour, onChange: e=>set("hour",e.target.value),
              style: {width:"100%",background:C.surface,border:`1px solid ${err.hour?C.red:C.border}`,
                borderRadius:8,color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5782}})
            , err.hour && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5785}}, err.hour)
          )
          , React.createElement('div', null
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6} }, "Durata" )
            , React.createElement('select', { value: String(f.durata||30), onChange: e=>set("durata",parseInt(e.target.value)),
                style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                  color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"} }
              , React.createElement('option',{value:"30"},"30 min")
              , React.createElement('option',{value:"45"},"45 min")
              , React.createElement('option',{value:"60"},"60 min")
            )
          )
        )

        /* Sala */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5790}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5791}}, "Sala")
          , React.createElement('input', { value: f.room, onChange: e=>set("room",e.target.value),
            placeholder: "Es. Sala A"  ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5792}})
        )

        /* Note */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5799}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5800}}, "Note")
          , React.createElement('textarea', { value: f.notes, onChange: e=>set("notes",e.target.value), rows: 3,
            placeholder: "Motivazioni, interessi musicali, strumento richiesto..."    ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",
              resize:"vertical",lineHeight:1.5,boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5801}})
        )
      )

      , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5809}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5810}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, style: {background:C.teal, borderColor:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5811}}
          , React.createElement(Ic, { n: "user", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5812}}), "Crea lezione prova"
        )
      )
    )
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────

// ─── RECUPERO VIEW (sub-tab di CalendarioView) ───────────────────────────────
const RecuperoView = ({ lessons, onOpenLesson, role, appUser }) => {
  const [rfCorso,   setRfCorso]   = useState('');
  const [rfDocente, setRfDocente] = useState('');
  const [rfAllievo, setRfAllievo] = useState('');
  const [richiesteRec, setRichiesteRec] = useState([]);
  const [loadingR, setLoadingR] = useState(false);
  const [selRich, setSelRich] = useState(null);
  const [modalMode, setModalMode] = useState('');
  const [modNota, setModNota] = useState('');
  const [modData, setModData] = useState('');
  const [modOra, setModOra]   = useState('');
  const [saving, setSaving]   = useState(false);
  const [sortKeyR, sortDirR, handleSortR, sortFnR] = useSortable("date", "asc");
  const oggi_r = new Date(); oggi_r.setHours(0,0,0,0);

  // Risolvi teacherKey del docente loggato
  var myDocKey = (function() {
    if (role !== 'docente') return '';
    var allDoc = window.__docenti__ || [];
    var myId = appUser && appUser.docenteId;
    var rec = myId
      ? allDoc.find(function(d){ return String(d.id)===String(myId); })
      : allDoc.find(function(d){
          var nm=(d.nome||'').toLowerCase(), un=((appUser&&appUser.nome)||'').toLowerCase();
          return nm===un || nm.indexOf(un)>=0 || un.indexOf(nm)>=0;
        });
    return rec ? (rec.teacherKey||rec.nome||'') : ((appUser&&appUser.nome)||'');
  })();

  // Carica richieste da Supabase
  React.useEffect(function() {
    var sb = window.supabaseClient; if (!sb) return;
    setLoadingR(true);
    sb.from('richieste_recupero').select('*').order('created_at',{ascending:false}).limit(200)
      .then(function(r){ setLoadingR(false); if(r.data){ setRichiesteRec(r.data); window.__richiesteRecupero__=r.data; } });
  }, []);

  var openModal = function(rich, mode) {
    setSelRich(rich); setModalMode(mode);
    setModNota(''); setModData(rich.data_preferita||''); setModOra(rich.ora_recupero||'');
  };
  var closeModal = function() { setSelRich(null); setModalMode(''); setSaving(false); };

  var handleSalva = async function() {
    if (!selRich || saving) return;
    setSaving(true);
    var sb = window.supabaseClient; if(!sb){ setSaving(false); return; }
    var nuovoStato = modalMode==='approva'?'confermata':modalMode==='rifiuta'?'rifiutata':modalMode==='ufficiale'?'completata':selRich.stato;
    var dataFin = modData||selRich.data_preferita, oraFin = modOra||selRich.ora_recupero;
    await sb.from('richieste_recupero').update({stato:nuovoStato,data_preferita:dataFin,ora_recupero:oraFin,note_docente:modNota||null}).eq('id',selRich.id);
    setRichiesteRec(function(p){ return p.map(function(r){ return r.id===selRich.id?Object.assign({},r,{stato:nuovoStato,data_preferita:dataFin,ora_recupero:oraFin,note_docente:modNota||null}):r; }); });
    var dL = new Date((dataFin||'')+'T00:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'2-digit',month:'long'});
    if(modalMode==='approva'){
      await sb.from('notifiche').insert({destinatario_ruolo:'admin',tipo:'recupero_approvato_docente',titolo:'✅ Recupero approvato — conferma richiesta',messaggio:(selRich.docente||'Docente')+' ha approvato il recupero di '+(selRich.allievo_nome||'')+' per '+dL+' ore '+oraFin,letto:false,created_at:new Date().toISOString(),meta:JSON.stringify({allievo:selRich.allievo_nome,allievo_id:selRich.allievo_id,docente:selRich.docente,data:dataFin,ora:oraFin})});
      await sb.from('notifiche').insert({destinatario_ruolo:'allievo',destinatario_id:String(selRich.allievo_id||''),destinatario_nome:selRich.allievo_nome||'',tipo:'recupero_confermato_docente',titolo:'✅ Recupero confermato dal docente',messaggio:'Il docente '+(selRich.docente||'')+' ha confermato il tuo recupero per '+dL+' ore '+oraFin+'.'+(modNota?' Nota: '+modNota:''),letto:false,created_at:new Date().toISOString()});
    } else if(modalMode==='rifiuta'){
      await sb.from('notifiche').insert({destinatario_ruolo:'allievo',destinatario_id:String(selRich.allievo_id||''),destinatario_nome:selRich.allievo_nome||'',tipo:'recupero_rifiutato',titolo:'❌ Recupero non confermato',messaggio:'Il docente '+(selRich.docente||'')+' non può confermare il recupero.'+(modNota?' Motivo: '+modNota:' Contattalo per concordare una nuova data.'),letto:false,created_at:new Date().toISOString()});
    } else if(modalMode==='ufficiale'){
      // 1. Notifica finale all'allievo
      await sb.from('notifiche').insert({destinatario_ruolo:'allievo',destinatario_id:String(selRich.allievo_id||''),destinatario_nome:selRich.allievo_nome||'',tipo:'recupero_ufficiale',titolo:'✅ Recupero confermato ufficialmente',messaggio:'Il tuo recupero per '+dL+' ore '+oraFin+" è stato confermato dall'amministrazione."+(modNota?' Nota: '+modNota:''),letto:false,created_at:new Date().toISOString()});

      // Trova la data della lezione ORIGINALE per il titolo "Recupero del..."
      var lezioniIds = [];
      try { lezioniIds = JSON.parse(selRich.lezioni_ids||'[]'); } catch(e){}
      var dataLezOriginale = '';
      var corsoId = null, corsoNome = null, roomOrig = null, strumentoOrig = selRich.strumento || null;
      if (lezioniIds.length > 0) {
        var { data: lezOrig } = await sb.from('lezioni').select('data,strumento,corso_id,corso_nome,room').eq('id', lezioniIds[0]).single();
        if (lezOrig) {
          dataLezOriginale = lezOrig.data || '';
          corsoId   = lezOrig.corso_id   || null;
          corsoNome = lezOrig.corso_nome  || null;
          roomOrig  = lezOrig.room        || null;
          // Usa strumento dalla lezione originale se non già in selRich
          if (!selRich.strumento && lezOrig.strumento) strumentoOrig = lezOrig.strumento;
        }
      }
      var dLOrigine = dataLezOriginale
        ? new Date(dataLezOriginale+'T00:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'2-digit',month:'long'})
        : dL; // fallback alla data recupero se non trovata

      // 2. Crea la nuova lezione di RECUPERO su Supabase
      var newLezId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);});
      var lezRow = {
        id:         newLezId,
        data:       dataFin,
        ora:        oraFin ? (oraFin.length===5 ? oraFin+':00' : oraFin) : null,
        student:    selRich.allievo_nome || '',
        studente_id:selRich.allievo_id ? parseInt(selRich.allievo_id, 10) : null,
        teacher:    selRich.docente      || '',
        strumento:  strumentoOrig,
        corso_id:   corsoId,
        corso_nome: corsoNome,
        room:       roomOrig,
        topic:      null,    // argomento libero — il docente lo compila a lezione
        attendance: null,    // segnabile normalmente
        tipo:       'individuale',
        recurrence: 'Nessuna',
        notes:      '🔄 Recupero del ' + dLOrigine + ' — Richiesta #'+(selRich.id||''),
        in_recupero: false,
        recupero_scadenza: null,
      };
      var { error: lezErr } = await sb.from('lezioni').insert(lezRow);
      if (lezErr) {
        console.warn('[FM] crea lezione recupero error:', lezErr.message, '| codice:', lezErr.code, '| row:', JSON.stringify(lezRow));
        // Mostra errore visibile
        var tErr = document.getElementById('sync-toast');
        if (tErr) { tErr.textContent = '⚠️ Errore creazione lezione: ' + lezErr.message; tErr.style.opacity='1'; setTimeout(function(){ tErr.style.opacity='0'; }, 5000); }
        setSaving(false); return; // blocca qui se la creazione lezione fallisce
      }
      console.log('[FM] Lezione recupero creata:', newLezId, dataFin, oraFin);

      // 3. Segna le lezioni ORIGINALI come "recuperata"
      if (lezioniIds.length > 0) {
        for (var li = 0; li < lezioniIds.length; li++) {
          var { error: updErr } = await sb.from('lezioni').update({
            attendance:        'recuperata',
            in_recupero:       false,
            recupero_scadenza: null,
            notes_recupero:    'Recuperata il '+dL+' ore '+oraFin,
          }).eq('id', lezioniIds[li]);
          if (updErr) console.warn('[FM] update lezione originale error:', updErr.message, lezioniIds[li]);
          else console.log('[FM] Lezione originale segnata recuperata:', lezioniIds[li]);
        }
      } else {
        console.warn('[FM] Nessuna lezione_id trovata in selRich.lezioni_ids:', selRich.lezioni_ids);
      }

      // 4. Aggiorna il React state locale tramite force refresh
    }
    setSaving(false); closeModal();
    setTimeout(function(){ if(window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__(true); }, 800);
  };

  // Filtra per ruolo
  var richFiltered = richiesteRec.filter(function(r){
    if(role==='docente'){
      if(!myDocKey) return true;
      var docR=(r.docente||'').toLowerCase().trim(), myK=myDocKey.toLowerCase().trim();
      return docR===myK||docR.indexOf(myK)>=0||myK.indexOf(docR)>=0;
    }
    return true;
  });
  var richInAttesa   = richFiltered.filter(function(r){ return r.stato==='in_attesa'; });
  var richConfermata = richFiltered.filter(function(r){ return r.stato==='confermata'; });

  const lezioniRec = (lessons||[]).filter(l=>l.inRecupero||l.attendance==='in_recupero');
  const docenteOptsR=[...new Set(lezioniRec.map(l=>l.teacher).filter(Boolean))].sort();
  const allievoOptsR=[...new Set(lezioniRec.map(l=>l.student).filter(Boolean))].sort();
  const corsoOptsR  =[...new Set(lezioniRec.map(l=>l.instrument||l.courseId).filter(Boolean))].sort();
  const filtered_r=lezioniRec.filter(l=>(!rfCorso||l.instrument===rfCorso||l.courseId===rfCorso)&&(!rfDocente||l.teacher===rfDocente)&&(!rfAllievo||l.student===rfAllievo));
  const sorted_r=sortFnR(filtered_r,(l,k)=>{
    if(k==="date") return l.date||""; if(k==="student") return l.student||"";
    if(k==="teacher") return l.teacher||""; if(k==="instrument") return l.instrument||"";
    if(k==="recuperoScadenza") return l.recuperoScadenza||""; return l[k]||"";
  });

  var StatoBadge=function(props){
    var s=props.stato, cfg={in_attesa:{bg:'rgba(245,158,11,0.1)',color:'#b45309',border:'rgba(245,158,11,0.3)',label:'In attesa'},confermata:{bg:C.blueBg,color:C.blue,border:C.blueBorder,label:'Approvata dal docente'},completata:{bg:C.greenBg,color:C.green,border:C.greenBorder,label:'Confermata ufficialmente'},rifiutata:{bg:C.redBg,color:C.red,border:C.redBorder,label:'Rifiutata'}};
    var c=cfg[s]||{bg:C.surface,color:C.textMuted,border:C.border,label:s||'—'};
    return React.createElement('span',{style:{background:c.bg,color:c.color,border:'1px solid '+c.border,borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:600}},c.label);
  };

  // Colori modal
  var mBg = modalMode==='approva'?C.greenBg:modalMode==='rifiuta'?C.redBg:C.blueBg;
  var mColor = modalMode==='approva'?C.green:modalMode==='rifiuta'?C.red:C.blue;
  var mIcon  = modalMode==='approva'?'✅':modalMode==='rifiuta'?'❌':'🏛️';
  var mTitle = modalMode==='approva'?'Approva recupero':modalMode==='rifiuta'?'Rifiuta richiesta':'Conferma ufficiale';
  var mBtn   = saving?'Salvataggio...':(modalMode==='approva'?'✓ Approva e notifica':modalMode==='rifiuta'?'✗ Rifiuta e notifica':'✅ Conferma ufficialmente');
  var mBtnBg = modalMode==='approva'?C.green:modalMode==='rifiuta'?C.red:C.purple;

  return React.createElement(React.Fragment, null
    /* ══ MODAL OVERLAY — renderizzato al livello del Fragment, fuori da ogni overflow ══ */
    , selRich && React.createElement('div', {
        style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:9999,
               display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'},
        onClick:function(e){if(e.target===e.currentTarget) closeModal();}
      }
      , React.createElement('div', {style:{background:C.surface,borderRadius:16,width:'100%',maxWidth:480,
          boxShadow:'0 24px 80px rgba(0,0,0,0.5)',overflow:'hidden'}}
        , React.createElement('div',{style:{padding:'18px 22px',borderBottom:'1px solid '+C.border,
            display:'flex',alignItems:'center',justifyContent:'space-between',background:mBg}}
          , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:10}}
            , React.createElement('span',{style:{fontSize:22}},mIcon)
            , React.createElement('div',null
              , React.createElement('div',{style:{fontFamily:"'Oswald',sans-serif",fontSize:17,fontWeight:700,color:mColor}},mTitle)
              , React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginTop:2}},selRich.allievo_nome||'—')
            )
          )
          , React.createElement('button',{onClick:closeModal,
              style:{background:'none',border:'none',cursor:'pointer',color:C.textMuted,fontSize:24,lineHeight:1,padding:'2px 8px'}},'×')
        )
        , React.createElement('div',{style:{padding:'22px'}}
          , React.createElement('div',{style:{background:C.bg,borderRadius:10,padding:'14px 16px',marginBottom:18,border:'1px solid '+C.border}}
            , React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 20px'}}
              , [{label:'Allievo',val:selRich.allievo_nome||'—'},{label:'Docente',val:selRich.docente||'—'},
                 {label:'Data richiesta',val:selRich.data_preferita?new Date(selRich.data_preferita+'T00:00:00').toLocaleDateString('it-IT',{weekday:'short',day:'2-digit',month:'short'}):'—'},
                 {label:'Ora richiesta',val:selRich.ora_recupero||'—'}
                ].map(function(f){
                  return React.createElement('div',{key:f.label}
                    , React.createElement('div',{style:{fontSize:10,color:C.textDim,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}},f.label)
                    , React.createElement('div',{style:{fontSize:14,fontWeight:600,color:C.text}},f.val)
                  );
                })
            )
            , selRich.note && React.createElement('div',{style:{marginTop:12,paddingTop:10,borderTop:'1px solid '+C.border,fontSize:12,color:C.textMuted,fontStyle:'italic'}},'"'+selRich.note+'"')
          )
          , (modalMode==='approva'||modalMode==='ufficiale') && React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}
            , React.createElement('div',null
              , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',display:'block',marginBottom:6}},'Data confermata')
              , React.createElement('input',{type:'date',value:modData,onChange:function(e){setModData(e.target.value);},
                  style:{width:'100%',padding:'9px 11px',borderRadius:8,border:'1px solid '+C.border,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",boxSizing:'border-box'}})
            )
            , React.createElement('div',null
              , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',display:'block',marginBottom:6}},'Ora confermata')
              , React.createElement('input',{type:'time',value:modOra,onChange:function(e){setModOra(e.target.value);},
                  style:{width:'100%',padding:'9px 11px',borderRadius:8,border:'1px solid '+C.border,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",boxSizing:'border-box'}})
            )
          )
          , React.createElement('div',{style:{marginBottom:18}}
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.06em',display:'block',marginBottom:6}},
                modalMode==='rifiuta'?'Motivo del rifiuto (opzionale)':'Nota per l\'allievo (opzionale)')
            , React.createElement('textarea',{value:modNota,onChange:function(e){setModNota(e.target.value);},rows:3,
                placeholder:modalMode==='rifiuta'?'Es. sono già impegnato quel giorno, contattami...':'Es. porta lo spartito, aula B...',
                style:{width:'100%',padding:'9px 11px',borderRadius:8,border:'1px solid '+C.border,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",resize:'vertical',boxSizing:'border-box'}})
          )
          , React.createElement('div',{style:{display:'flex',gap:8,justifyContent:'flex-end'}}
            , React.createElement('button',{onClick:closeModal,disabled:saving,
                style:{padding:'10px 20px',borderRadius:8,border:'1px solid '+C.border,background:'none',color:C.textMuted,fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}},'Annulla')
            , React.createElement('button',{onClick:handleSalva,disabled:saving,
                style:{padding:'10px 24px',borderRadius:8,border:'none',fontSize:13,fontWeight:700,cursor:saving?'wait':'pointer',fontFamily:"'Open Sans',sans-serif",background:mBtnBg,color:'#fff',opacity:saving?0.7:1}},mBtn)
          )
        )
      )
    )

    /* ══ CONTENUTO PRINCIPALE ══ */
    , React.createElement('div', {style:{flex:1, padding:'20px', overflow:'auto'}}

      /* Richieste */
      , (role === 'docente' || role === 'admin') && React.createElement('div', {style:{marginBottom:32}}
        , React.createElement('div', {style:{display:'flex',alignItems:'center',gap:10,marginBottom:14}}
          , React.createElement('h3', {style:{fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,margin:0}}, 'Richieste di recupero')
          , richInAttesa.length > 0 && React.createElement('span',{style:{background:'rgba(245,158,11,0.12)',color:'#b45309',border:'1px solid rgba(245,158,11,0.3)',borderRadius:20,padding:'3px 12px',fontSize:12,fontWeight:700}}, richInAttesa.length+' da gestire')
          , role==='admin' && richConfermata.length > 0 && React.createElement('span',{style:{background:C.blueBg,color:C.blue,border:'1px solid '+C.blueBorder,borderRadius:20,padding:'3px 12px',fontSize:12,fontWeight:700}}, richConfermata.length+' da confermare')
        )
        , loadingR && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'16px 0',color:C.textDim,fontSize:13}}
            , 'Caricamento richieste...')
        , !loadingR && richFiltered.length === 0 && React.createElement('div',{style:{textAlign:'center',padding:'28px 0',color:C.textDim,fontSize:13,background:C.surface,borderRadius:12,border:'1px solid '+C.border}}
            , React.createElement('div',{style:{fontSize:28,marginBottom:8}}, role==='docente'?'📭':'📋')
            , role==='docente' ? ('Nessuna richiesta di recupero'+(myDocKey?' per '+myDocKey:'')) : 'Nessuna richiesta di recupero')
        , !loadingR && richFiltered.length > 0 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:8}}
            , richFiltered.map(function(rich) {
                var dL = rich.data_preferita ? new Date(rich.data_preferita+'T00:00:00').toLocaleDateString('it-IT',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}) : '—';
                var isActionable = (rich.stato==='in_attesa'&&role==='docente')||(rich.stato==='confermata'&&role==='admin');
                return React.createElement('div',{key:rich.id,style:{background:C.surface,borderRadius:12,padding:'16px 20px',
                    border:'1px solid '+(isActionable?'rgba(245,158,11,0.45)':C.border),
                    display:'flex',alignItems:'center',flexWrap:'wrap',gap:12,
                    boxShadow:isActionable?'0 2px 10px rgba(245,158,11,0.1)':'none'}}
                  , React.createElement('div',{style:{flex:1,minWidth:180}}
                    , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:5}}
                      , React.createElement('span',{style:{fontSize:15,fontWeight:700,color:C.text}}, rich.allievo_nome||'—')
                      , React.createElement(StatoBadge,{stato:rich.stato})
                    )
                    , React.createElement('div',{style:{fontSize:12,color:C.textMuted}}
                      , '📅 '+dL+(rich.ora_recupero?' alle '+rich.ora_recupero:'')
                      , rich.docente && role==='admin' ? ' · 👤 '+rich.docente : ''
                    )
                    , rich.note && React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:4,fontStyle:'italic'}},'"'+rich.note+'"')
                    , rich.note_docente && React.createElement('div',{style:{fontSize:11,color:C.green,marginTop:4,fontWeight:500}},'💬 '+rich.note_docente)
                  )
                  , isActionable && React.createElement('div',{style:{display:'flex',gap:7,flexShrink:0}}
                    , rich.stato==='in_attesa' && role==='docente' && React.createElement(React.Fragment,null
                      , React.createElement('button',{onClick:function(){openModal(rich,'approva');},
                          style:{padding:'9px 18px',borderRadius:8,border:'none',background:C.green,color:'#fff',fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",fontWeight:700}},
                          React.createElement(Ic,{n:'check',size:13,stroke:'#fff'}), ' Approva')
                      , React.createElement('button',{onClick:function(){openModal(rich,'rifiuta');},
                          style:{padding:'9px 14px',borderRadius:8,border:'1px solid '+C.redBorder,background:C.redBg,color:C.red,fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",fontWeight:600}},'✗ Rifiuta')
                    )
                    , rich.stato==='confermata' && role==='admin' && React.createElement('button',{onClick:function(){openModal(rich,'ufficiale');},
                        style:{padding:'9px 18px',borderRadius:8,border:'none',background:C.purple,color:'#fff',fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",fontWeight:700}},
                        '✅ Conferma ufficiale')
                  )
                );
              })
          )
      )

      /* ── LEZIONI IN RECUPERO (tabella) ── */
      , React.createElement('div', {style:{marginBottom:16, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:600, margin:0}}, 'Lezioni in Recupero')
        , React.createElement('span', {style:{background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20, padding:'3px 10px', fontSize:12}}, lezioniRec.length+' lezioni')
      )
      , React.createElement('div', {style:{display:'flex', gap:8, marginBottom:16, flexWrap:'wrap'}}
        , React.createElement('select', {value:rfCorso, onChange:e=>setRfCorso(e.target.value), style:{padding:'8px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:rfCorso?C.text:C.textMuted, fontSize:12, fontFamily:"'Open Sans',sans-serif"}}
          , React.createElement('option',{value:''},'Tutti i corsi')
          , corsoOptsR.map(c=>React.createElement('option',{key:c,value:c},c))
        )
        , React.createElement('select', {value:rfDocente, onChange:e=>setRfDocente(e.target.value), style:{padding:'8px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:rfDocente?C.text:C.textMuted, fontSize:12, fontFamily:"'Open Sans',sans-serif"}}
          , React.createElement('option',{value:''},'Tutti i docenti')
          , docenteOptsR.map(d=>React.createElement('option',{key:d,value:d},d))
        )
        , React.createElement('select', {value:rfAllievo, onChange:e=>setRfAllievo(e.target.value), style:{padding:'8px 12px', borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, color:rfAllievo?C.text:C.textMuted, fontSize:12, fontFamily:"'Open Sans',sans-serif"}}
          , React.createElement('option',{value:''},'Tutti gli allievi')
          , allievoOptsR.map(a=>React.createElement('option',{key:a,value:a},a))
        )
      )
      , filtered_r.length===0
        ? React.createElement('div',{style:{textAlign:'center', padding:'60px 20px', color:C.textMuted}}
            , React.createElement('div',{style:{fontSize:40,marginBottom:12}},'✓')
            , React.createElement('div',{style:{fontSize:16,fontWeight:600,marginBottom:8}},'Nessuna lezione in recupero')
            , React.createElement('p',{style:{fontSize:13,color:C.textDim}},'Tutte le lezioni sono in regola.')
          )
        : React.createElement('div',{style:{background:C.surface, borderRadius:12, border:`1px solid ${C.border}`, overflow:'hidden'}}
            , React.createElement('table',{style:{width:'100%',borderCollapse:'collapse'}}
              , React.createElement('thead',null
                , React.createElement('tr',{style:{background:C.bg, borderBottom:`1px solid ${C.border}`}}
                  , React.createElement(SortTh,{label:'Data', sortKey:'date', currentKey:sortKeyR, dir:sortDirR, onSort:handleSortR})
                  , React.createElement(SortTh,{label:'Allievo', sortKey:'student', currentKey:sortKeyR, dir:sortDirR, onSort:handleSortR})
                  , React.createElement(SortTh,{label:'Docente', sortKey:'teacher', currentKey:sortKeyR, dir:sortDirR, onSort:handleSortR})
                  , React.createElement(SortTh,{label:'Strumento', sortKey:'instrument', currentKey:sortKeyR, dir:sortDirR, onSort:handleSortR})
                  , React.createElement(SortTh,{label:'Scadenza', sortKey:'recuperoScadenza', currentKey:sortKeyR, dir:sortDirR, onSort:handleSortR})
                  , React.createElement('th',{style:{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em'}},'Stato')
                  , React.createElement('th',{style:{padding:'10px 14px'}})
                )
              )
              , React.createElement('tbody',null
                , sorted_r.map(l => {
                    const scad = l.recuperoScadenza ? new Date(l.recuperoScadenza+'T00:00:00') : null;
                    const scaduto = scad && scad < oggi_r;
                    const urgente = scad && !scaduto && (scad - oggi_r)/86400000 <= 5;
                    return React.createElement('tr',{key:l.id, style:{borderBottom:`1px solid ${C.border}`},
                      onMouseEnter:e=>e.currentTarget.style.background=C.bg,
                      onMouseLeave:e=>e.currentTarget.style.background='transparent'}
                      , React.createElement('td',{style:{padding:'11px 14px',fontSize:13}},l.date||'—')
                      , React.createElement('td',{style:{padding:'11px 14px',fontSize:13,fontWeight:500}},l.student||'—')
                      , React.createElement('td',{style:{padding:'11px 14px',fontSize:13,color:C.textMuted}},l.teacher||'—')
                      , React.createElement('td',{style:{padding:'11px 14px',fontSize:12}},React.createElement('span',{style:{background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBorder}`,borderRadius:20,padding:'2px 8px',fontSize:11}},l.instrument||l.courseId||'—'))
                      , React.createElement('td',{style:{padding:'11px 14px',fontSize:12,color:scaduto?C.red:urgente?C.orange:C.textMuted}},l.recuperoScadenza||'—')
                      , React.createElement('td',{style:{padding:'11px 14px'}},
                          scaduto ? React.createElement('span',{style:{background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:20,padding:'2px 8px',fontSize:11}},'SCADUTO')
                          : urgente ? React.createElement('span',{style:{background:'rgba(245,158,11,0.1)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.3)',borderRadius:20,padding:'2px 8px',fontSize:11}},'In scadenza')
                          : React.createElement('span',{style:{background:'rgba(245,158,11,0.08)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.2)',borderRadius:20,padding:'2px 8px',fontSize:11}},'In recupero')
                        )
                      , React.createElement('td',{style:{padding:'11px 14px'}},
                          React.createElement('button',{onClick:()=>onOpenLesson&&onOpenLesson(l),style:{padding:'4px 10px',borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:12,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}},'Apri')
                        )
                    );
                  })
              )
            )
          )
    )
  );
};
const LezioniAdminView = ({ lessons, onEditLesson, onDeleteLesson }) => {
  const [laSearch,   setLaSearch]   = useState('');
  const [laDocente,  setLaDocente]  = useState('');
  const [laAllievo,  setLaAllievo]  = useState('');
  const [laPresenza, setLaPresenza] = useState('');
  const [confirmDel, setConfirmDel] = useState(null);
  const [sortKeyLA, sortDirLA, handleSortLA, sortFnLA] = useSortable("date", "desc");
  const docenteOptsA = [...new Set((lessons||[]).map(l=>l.teacher).filter(Boolean))].sort();
  const allievoOptsA = [...new Set((lessons||[]).map(l=>l.student).filter(Boolean))].sort();
  const laFiltered = (lessons||[]).filter(l =>
    (!laDocente  || l.teacher===laDocente) &&
    (!laAllievo  || l.student===laAllievo) &&
    (!laPresenza || (laPresenza==='in_recupero' ? l.inRecupero : l.attendance===laPresenza)) &&
    (!laSearch   || (l.student||'').toLowerCase().includes(laSearch.toLowerCase()) ||
                    (l.teacher||'').toLowerCase().includes(laSearch.toLowerCase()) ||
                    (l.topic||'').toLowerCase().includes(laSearch.toLowerCase()))
  );
  const laSorted = sortFnLA(laFiltered, (l,k) => {
    if (k==='date')       return l.date||'';
    if (k==='hour')       return l.hour||'';
    if (k==='student')    return l.student||l.courseId||'';
    if (k==='teacher')    return l.teacher||'';
    if (k==='instrument') return l.instrument||'';
    if (k==='topic')      return l.topic||'';
    if (k==='attendance') return l.inRecupero?'in_recupero':(l.attendance||'');
    return l[k]||'';
  });
  const handleDelConfirm = (l) => {
    if (onDeleteLesson) onDeleteLesson(l);
    setConfirmDel(null);
  };
  return React.createElement('div', {style:{flex:1, padding:'20px', overflow:'auto'}}
    , React.createElement('div',{style:{marginBottom:16,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}
      , React.createElement('h2',{style:{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,margin:0}},'Elenco Lezioni')
      , React.createElement('span',{style:{background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBorder}`,borderRadius:20,padding:'3px 10px',fontSize:12}},laSorted.length+' lezioni')
    )
    , React.createElement('div',{style:{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}
      , React.createElement('input',{type:'text',placeholder:'Cerca allievo, docente, argomento...',value:laSearch,onChange:e=>setLaSearch(e.target.value),
        style:{padding:'8px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",minWidth:200}})
      , React.createElement('select',{value:laDocente,onChange:e=>setLaDocente(e.target.value),
        style:{padding:'8px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:laDocente?C.text:C.textMuted,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}
        , React.createElement('option',{value:''},'Tutti i docenti')
        , docenteOptsA.map(d=>React.createElement('option',{key:d,value:d},d))
      )
      , React.createElement('select',{value:laAllievo,onChange:e=>setLaAllievo(e.target.value),
        style:{padding:'8px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:laAllievo?C.text:C.textMuted,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}
        , React.createElement('option',{value:''},'Tutti gli allievi')
        , allievoOptsA.map(a=>React.createElement('option',{key:a,value:a},a))
      )
      , React.createElement('select',{value:laPresenza,onChange:e=>setLaPresenza(e.target.value),
        style:{padding:'8px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:laPresenza?C.text:C.textMuted,fontSize:12,fontFamily:"'Open Sans',sans-serif"}}
        , React.createElement('option',{value:''},'Tutte le presenze')
        , ['presente','assente','giustificato','recupero','in_recupero'].map(v=>
          React.createElement('option',{key:v,value:v}, v==='in_recupero'?'In recupero':v.charAt(0).toUpperCase()+v.slice(1))
        )
      )
    )
    , React.createElement('div',{style:{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:'hidden'}}
      , React.createElement('table',{style:{width:'100%',borderCollapse:'collapse'}}
        , React.createElement('thead',null
          , React.createElement('tr',{style:{background:C.bg,borderBottom:`1px solid ${C.border}`}}
            , React.createElement(SortTh,{label:'Data',      sortKey:'date',       currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement(SortTh,{label:'Ora',       sortKey:'hour',       currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement(SortTh,{label:'Allievo',   sortKey:'student',    currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement(SortTh,{label:'Docente',   sortKey:'teacher',    currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement(SortTh,{label:'Strumento', sortKey:'instrument', currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement(SortTh,{label:'Argomento', sortKey:'topic',      currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement(SortTh,{label:'Presenza',  sortKey:'attendance', currentKey:sortKeyLA,dir:sortDirLA,onSort:handleSortLA})
            , React.createElement('th',{style:{padding:'10px 12px',textAlign:'left',fontSize:11,fontWeight:600,color:C.textMuted,textTransform:'uppercase',letterSpacing:'0.07em'}},'Azioni')
          )
        )
        , React.createElement('tbody',null
          , laSorted.slice(0,200).map(l => {
            const att = l.inRecupero ? 'in_recupero' : (l.attendance||'');
            const s = ATT_STYLES[att] || {bg:'transparent',fg:C.textDim,bd:C.border,label:'—'};
            return React.createElement('tr',{key:l.id,style:{borderBottom:`1px solid ${C.border}`},
              onMouseEnter:e=>e.currentTarget.style.background=C.bg,
              onMouseLeave:e=>e.currentTarget.style.background='transparent'}
              , React.createElement('td',{style:{padding:'9px 12px',fontSize:13}},l.date||'—')
              , React.createElement('td',{style:{padding:'9px 12px',fontSize:13,color:C.textMuted}},l.hour||'—')
              , React.createElement('td',{style:{padding:'9px 12px',fontSize:13,fontWeight:500}},l.student||l.courseId||'—')
              , React.createElement('td',{style:{padding:'9px 12px',fontSize:13,color:C.textMuted}},l.teacher||'—')
              , React.createElement('td',{style:{padding:'9px 12px',fontSize:12}}
                , React.createElement('span',{style:{background:C.blueBg,color:C.blue,borderRadius:20,padding:'2px 7px',fontSize:11}},l.instrument||'—')
              )
              , React.createElement('td',{style:{padding:'9px 12px',fontSize:12,color:C.textDim,maxWidth:160}}
                , (l.topic && (l.topic.startsWith('🔄') || l.topic.startsWith('Recupero')))
                  ? React.createElement('span',{style:{background:C.tealBg,color:C.teal,border:`1px solid ${C.tealBorder}`,borderRadius:4,padding:'2px 7px',fontSize:11,fontWeight:600,whiteSpace:'nowrap'}},l.topic)
                  : React.createElement('span',{style:{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}},l.topic||'—')
              )
              , React.createElement('td',{style:{padding:'9px 12px'}}
                , att
                  ? React.createElement('span',{style:{background:s.bg,color:s.fg,border:`1px solid ${s.bd}`,borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:500}},s.label||att)
                  : React.createElement('span',{style:{color:C.textDim,fontSize:11}},'—')
              )
              , React.createElement('td',{style:{padding:'9px 12px'}}
                , React.createElement('div',{style:{display:'flex',gap:6}}
                  , React.createElement('button',{onClick:()=>onEditLesson&&onEditLesson(l),
                    style:{padding:'4px 9px',borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:4}}
                    , React.createElement(Ic,{n:'edit',size:11,stroke:C.text}), 'Modifica'
                  )
                  , React.createElement('button',{onClick:()=>setConfirmDel(l),
                    style:{padding:'4px 9px',borderRadius:7,border:`1px solid ${C.redBorder}`,background:C.redBg,color:C.red,fontSize:11,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:4}}
                    , React.createElement(Ic,{n:'trash',size:11,stroke:C.red}), 'Elimina'
                  )
                )
              )
            );
          })
        )
      )
    )
    , laSorted.length > 200 && React.createElement('p',{style:{textAlign:'center',padding:12,fontSize:12,color:C.textDim}},
      'Mostrate 200 di '+laSorted.length+' lezioni — usa i filtri per restringere')
    , confirmDel && React.createElement('div',{style:{position:'fixed',inset:0,zIndex:400,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center'}}
      , React.createElement('div',{style:{background:C.surface,borderRadius:14,padding:'24px 28px',maxWidth:400,width:'100%',border:`1px solid ${C.border}`}}
        , React.createElement('h3',{style:{fontFamily:"'Oswald',sans-serif",fontSize:20,marginBottom:8,color:C.red}},'Elimina lezione')
        , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:20}},
          'Eliminare la lezione del ',confirmDel.date,' — ',(confirmDel.student||confirmDel.courseId||'?'),'? Questa azione non è reversibile.')
        , React.createElement('div',{style:{display:'flex',gap:10,justifyContent:'flex-end'}}
          , React.createElement('button',{onClick:()=>setConfirmDel(null),style:{padding:'9px 18px',borderRadius:9,border:`1px solid ${C.border}`,background:'none',color:C.text,fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}},'Annulla')
          , React.createElement('button',{onClick:()=>handleDelConfirm(confirmDel),style:{padding:'9px 18px',borderRadius:9,border:'none',background:C.red,color:'#fff',fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",fontWeight:600}},'Elimina')
        )
      )
    )
  );
};


// ── Adatta riga Supabase prenotazioni_sala → oggetto React ───────────────────
const adaptPrenotazioneSala = (r) => ({
  id:          r.id,
  userId:      r.user_id     || null,
  richiedente: r.richiedente || '',
  ruolo:       r.ruolo       || 'allievo',
  data:        r.data        || '',
  oraInizio:   r.ora_inizio  ? (r.ora_inizio.slice(0,5)) : '',
  oraFine:     r.ora_fine    ? (r.ora_fine.slice(0,5))   : '',
  motivo:      r.motivo      || '',
  telefono:    r.telefono    || '',
  stato:       r.stato       || 'in_attesa',
  noteAdmin:   r.note_admin  || '',
  createdAt:   r.created_at  || '',
  updatedAt:   r.updated_at  || '',
});

// ── Form prenotazione sala prove ──────────────────────────────────────────────
const SalaProveForm = ({ initial, onSave, onClose, appUser, role }) => {
  const todaySP = yyyymmdd(new Date());
  const [spData,        setSpData]        = useState((initial && initial.data)        || todaySP);
  const [spOraInizio,   setSpOraInizio]   = useState((initial && initial.oraInizio)   || "09:00");
  const [spOraFine,     setSpOraFine]     = useState((initial && initial.oraFine)     || "11:00");
  const [spMotivo,      setSpMotivo]      = useState((initial && initial.motivo)      || "");
  const [spTelefono,    setSpTelefono]    = useState((initial && initial.telefono)    || (appUser && appUser.phone) || "");
  const [spRichiedente, setSpRichiedente] = useState((initial && initial.richiedente) || (appUser && appUser.nome) || "");
  const [spSaving,      setSpSaving]      = useState(false);
  const [spErr,         setSpErr]         = useState("");

  const handleSaveSP = async () => {
    if (!spData || !spOraInizio || !spOraFine) { setSpErr("Compila tutti i campi obbligatori."); return; }
    if (!spRichiedente.trim()) { setSpErr("Inserisci il nome del richiedente."); return; }
    if (spOraFine <= spOraInizio) { setSpErr("L'ora di fine deve essere successiva all'ora di inizio."); return; }
    setSpSaving(true); setSpErr("");
    try {
      const sb = window.supabaseClient;
      const userId = appUser && appUser.userId;
      const richiedente = spRichiedente.trim();
      const ruoloR = role || "allievo";
      const stato = role === "admin" ? "approvata" : "in_attesa";
      const row = {
        user_id: userId || null, richiedente, ruolo: ruoloR,
        data: spData, ora_inizio: spOraInizio, ora_fine: spOraFine,
        motivo: spMotivo || null, telefono: spTelefono || null, stato,
      };
      if (initial && initial.id) {
        const { error } = await sb.from("prenotazioni_sala").update({...row, updated_at: new Date().toISOString()}).eq("id", initial.id);
        if (error) throw error;
        onSave(adaptPrenotazioneSala({ ...row, id: initial.id, created_at: initial.createdAt, updated_at: new Date().toISOString() }));
      } else {
        const { data: ins, error } = await sb.from("prenotazioni_sala").insert(row).select().single();
        if (error) throw error;
        // Notifica per nuove prenotazioni non-admin
        if (ruoloR !== "admin") {
          try {
            // Leggi i destinatari configurati per sala_prove (fallback: solo admin)
            const cfgSala = (window.__FM_NOTIFICHE_CONFIG__ || {})["sala_prove"];
            const destinatari = (cfgSala && Array.isArray(cfgSala.destinatari))
              ? cfgSala.destinatari
              : ["admin"];

            // Notifica in-app per ogni ruolo destinatario
            for (const dest of destinatari) {
              await sb.from("notifiche").insert({
                destinatario_ruolo: dest,
                tipo:               "sala_prove_richiesta",
                titolo:             "🥁 Nuova richiesta sala prove",
                messaggio:          `${richiedente} ha richiesto la sala il ${spData} dalle ${spOraInizio} alle ${spOraFine}${spMotivo ? ' — ' + spMotivo : ''}`,
                letto:              false,
                created_at:         new Date().toISOString(),
                meta:               JSON.stringify({ data: spData, ora_inizio: spOraInizio, ora_fine: spOraFine, richiedente, ruolo: ruoloR, telefono: spTelefono }),
              });
            }

            // Push notification — solo ai ruoli configurati
            const session = await sb.auth.getSession();
            const token = session?.data?.session?.access_token;
            if (token && destinatari.length > 0) {
              for (const dest of destinatari) {
                fetch("https://ocsxrjommtrjelnbihfr.supabase.co/functions/v1/send-push", {
                  method: "POST",
                  headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                  body: JSON.stringify({
                    override: {
                      title:       "🥁 Nuova richiesta sala prove",
                      body:        `${richiedente} · ${spData} ${spOraInizio}–${spOraFine}`,
                      tag:         "fm-sala-prove",
                      targetRuolo: dest,
                    }
                  }),
                }).catch(() => null);
              }
            }
          } catch(ne) { console.warn("[FM] notifica sala prove:", ne?.message); }
        }
        onSave(adaptPrenotazioneSala(ins));
      }
    } catch(e) { setSpErr(e.message || "Errore salvataggio."); }
    finally { setSpSaving(false); }
  };

  const inpS = { width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`, borderRadius:8,
    fontSize:13, color:C.text, background:C.bg, fontFamily:"'Open Sans',sans-serif" };
  const lblS = { fontSize:11, color:C.textMuted, fontWeight:600, letterSpacing:"0.05em",
    textTransform:"uppercase", marginBottom:4, display:"block" };

  return (
    React.createElement('div', { style:{padding:"8px 0",display:"flex",flexDirection:"column",gap:16} }
      , React.createElement('div', { style:{background:C.orange2Bg,border:`1px solid ${C.orange2Border}`,
          borderRadius:10,padding:"12px 14px",fontSize:12,color:"#92400e"} }
        , React.createElement('b', null, "🤘 Sala Prove  ·  ")
        , role === "admin"
          ? "Come amministratore la prenotazione viene confermata immediatamente."
          : "La richiesta sarà inviata all'amministratore per l'approvazione."
      )
      , React.createElement('div', { className:"form-2col" }
        , React.createElement('div', null
          , React.createElement('label', { style:lblS }, "Nome richiedente *")
          , React.createElement('input', { value:spRichiedente, onChange:e=>setSpRichiedente(e.target.value),
              placeholder:"Es. Mario Rossi", style:inpS })
        )
        , React.createElement('div', null
          , React.createElement('label', { style:lblS }, "Telefono di contatto")
          , React.createElement('input', { type:"tel", value:spTelefono, onChange:e=>setSpTelefono(e.target.value),
              placeholder:"Es. 333 1234567", style:inpS })
        )
      )
      , React.createElement('div', { className:"form-2col" }
        , React.createElement('div', null
          , React.createElement('label', { style:lblS }, "Data *")
          , React.createElement('input', { type:"date", value:spData, onChange:e=>setSpData(e.target.value),
              min:todaySP, style:inpS })
        )
        , React.createElement('div', null)
      )
      , React.createElement('div', { className:"form-2col" }
        , React.createElement('div', null
          , React.createElement('label', { style:lblS }, "Ora inizio *")
          , React.createElement('input', { type:"time", value:spOraInizio, onChange:e=>setSpOraInizio(e.target.value), style:inpS })
        )
        , React.createElement('div', null
          , React.createElement('label', { style:lblS }, "Ora fine *")
          , React.createElement('input', { type:"time", value:spOraFine, onChange:e=>setSpOraFine(e.target.value), style:inpS })
        )
      )
      , React.createElement('div', null
        , React.createElement('label', { style:lblS }, "Motivo / descrizione")
        , React.createElement('textarea', { value:spMotivo, onChange:e=>setSpMotivo(e.target.value),
            rows:3, placeholder:"Es. Prove per il saggio, band, ensemble…",
            style:{...inpS, resize:"vertical"} })
      )
      , spErr && React.createElement('div', { style:{color:C.red,fontSize:12,background:C.redBg,
          border:`1px solid ${C.redBorder}`,borderRadius:8,padding:"10px 14px"} }, spErr)
      , React.createElement('div', { style:{display:"flex",gap:10,justifyContent:"flex-end"} }
        , React.createElement(Btn, { variant:"secondary", onClick:onClose }, "Annulla")
        , React.createElement(Btn, { onClick:handleSaveSP, disabled:spSaving }
          , spSaving ? "Salvataggio…" : (role==="admin" ? "Prenota sala" : "Invia richiesta")
        )
      )
    )
  );
};

// ── Vista admin: gestione richieste sala prove ────────────────────────────────
const SalaProveView = ({ prenotazioni, onUpdate, onDelete, role, appUser, lessons }) => {
  const isMobile = useIsMobile();
  const [svPanel,      setSvPanel]      = useState("calendario");
  const [svCalMode,    setSvCalMode]    = useState("week");
  const [svCurDate,    setSvCurDate]    = useState(new Date());
  const [svFilterStato,setSvFilterStato]= useState("tutti");
  const [svNoteAdmin,  setSvNoteAdmin]  = useState({});
  const [svLoading,    setSvLoading]    = useState({});
  const [svModal,      setSvModal]      = useState(null);
  const [svSelPren,    setSvSelPren]    = useState(null);

  const DAYS_IT   = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
  const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
                     "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const spStartOfWeek = (d) => { const dt=new Date(d); const dow=dt.getDay(); dt.setDate(dt.getDate()-((dow===0?7:dow)-1)); dt.setHours(0,0,0,0); return dt; };
  const spAddDays = (d,n) => { const dt=new Date(d); dt.setDate(dt.getDate()+n); return dt; };

  const approved   = prenotazioni.filter(p=>p.stato==="approvata");
  const allVisible = prenotazioni.filter(p=>p.stato!=="rifiutata");

  const navigate = (dir) => {
    const d = new Date(svCurDate);
    if (svCalMode==="week")  d.setDate(d.getDate()+dir*7);
    else d.setMonth(d.getMonth()+dir);
    setSvCurDate(d);
  };

  const navLabel = React.useMemo(()=>{
    if(svCalMode==="month") return `${MONTHS_IT[svCurDate.getMonth()]} ${svCurDate.getFullYear()}`;
    const ws=spStartOfWeek(svCurDate), we=spAddDays(ws,6);
    return `${ws.getDate()} ${MONTHS_IT[ws.getMonth()].slice(0,3)} – ${we.getDate()} ${MONTHS_IT[we.getMonth()].slice(0,3)} ${we.getFullYear()}`;
  },[svCalMode,svCurDate]);

  // ── VISTA SETTIMANALE TIME-GRID ────────────────────────────────────────────
  // Fasce orarie: 9-13 | [CHIUSO 13-16] | 16-23
  const MORNING_SLOTS = [9,10,11,12];
  const EVENING_SLOTS = [16,17,18,19,20,21,22];
  const HOUR_H = 44; // px per ora
  const fmtHHMM = t => t ? t.slice(0,5) : "";
  const toMin = t => { if(!t) return 0; const [h,m]=(t).split(":").map(Number); return h*60+(m||0); };

  const WeekCalSala = () => {
    const ws   = spStartOfWeek(svCurDate);
    const days = Array.from({length:7},(_,i)=>spAddDays(ws,i));
    const todayStr = yyyymmdd(new Date());

    // Calcola eventi per ogni cella (prenotazioni + lezioni batteria)
    const getEvents = (ds, h) => {
      const events = [];
      // Prenotazioni sala
      allVisible.filter(p => {
        if (p.data !== ds) return false;
        const startH = parseInt((p.oraInizio||"00:00").split(":")[0]);
        return startH === h;
      }).forEach(p => {
        const sh = toMin(p.oraInizio), eh = toMin(p.oraFine);
        const dur = (eh - sh) / 60;
        events.push({
          id: 'p_'+p.id,
          top: (toMin(p.oraInizio)%60/60)*HOUR_H,
          height: Math.max(dur*HOUR_H - 2, HOUR_H*0.5),
          bg:     p.stato==='approvata' ? C.orange2Bg   : 'rgba(245,158,11,0.08)',
          bd:     p.stato==='approvata' ? C.orange2Border: 'rgba(245,158,11,0.3)',
          accent: p.stato==='approvata' ? C.orange2      : '#f59e0b',
          label:  fmtHHMM(p.oraInizio)+'–'+fmtHHMM(p.oraFine),
          sub:    p.richiedente,
          tag:    p.stato==='approvata' ? '✅' : '⏳',
        });
      });
      // Lezioni batteria → sala occupata
      (lessons||[]).filter(l => {
        if ((l.date||l.data) !== ds) return false;
        const str = (l.instrument||l.strumento||'').toLowerCase();
        const isBatt = str.includes('batter')||str.includes('drum')||str.includes('percuss');
        if (!isBatt) return false;
        const lh = parseInt((l.hour||l.ora||'00:00').split(':')[0]);
        return lh === h;
      }).forEach(l => {
        const ora = l.hour||l.ora||'00:00';
        const durata = l.durata || 45;
        const startMin = toMin(ora);
        const endMin = startMin + durata;
        const endStr = String(Math.floor(endMin/60)).padStart(2,'0')+':'+String(endMin%60).padStart(2,'0');
        events.push({
          id: 'b_'+l.id,
          top: (startMin%60/60)*HOUR_H,
          height: Math.max((durata/60)*HOUR_H - 2, HOUR_H*0.5),
          bg: '#fef3c7', bd: '#fcd34d', accent: '#d97706',
          label: ora.slice(0,5)+'–'+endStr,
          sub:   '🥁 Lezione batteria',
          tag:   '🔒',
        });
      });
      return events;
    };

    const ColHeader = ({d, i}) => {
      const isToday = yyyymmdd(d)===todayStr;
      const chiuso  = isGiornoChiuso(yyyymmdd(d), window.__FM_CONFIG__||null);
      return React.createElement('div', { style:{padding:"6px 4px",textAlign:"center",
        background: chiuso ? chiuso.bg : isToday?C.goldBg:C.surface,
        borderBottom:`1px solid ${C.border}`,
        borderLeft:`1px solid ${C.border}`, fontSize:11, fontWeight:isToday?700:500,
        color: chiuso ? chiuso.color : isToday?C.gold:C.text,
        position:'sticky', top:0, zIndex:2} }
        , React.createElement('div',null, DAYS_IT[i])
        , React.createElement('div',{style:{fontSize:14,fontWeight:700}}, d.getDate())
        , chiuso && React.createElement('div',{style:{fontSize:8,fontWeight:700,lineHeight:1.2,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, chiuso.emoji,' ',chiuso.label)
      );
    };

    const TimeCell = ({ds, h, isToday}) => {
      const events = getEvents(ds, h);
      const chiuso = isGiornoChiuso(ds, window.__FM_CONFIG__||null);
      const children = [];
      if (chiuso) children.push(React.createElement('div', {key:'overlay', style:{
          position:'absolute', inset:0,
          background: chiuso.tipo==='festività'
            ? 'repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(220,38,38,0.07) 5px,rgba(220,38,38,0.07) 10px)'
            : 'repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(55,65,81,0.07) 5px,rgba(55,65,81,0.07) 10px)',
          backgroundColor: chiuso.tipo==='festività' ? 'rgba(254,242,242,0.55)' : 'rgba(243,244,246,0.55)',
          zIndex:0, pointerEvents:'none'}}));
      events.forEach(ev => children.push(React.createElement('div', {key:ev.id, style:{
          position:'absolute', top:ev.top+1, left:2, right:2, height:ev.height,
          background:ev.bg, border:`1px solid ${ev.bd}`, borderLeft:`3px solid ${ev.accent}`,
          borderRadius:4, padding:'2px 5px', fontSize:9, color:ev.accent, fontWeight:600,
          overflow:'hidden', zIndex:2, display:'flex', flexDirection:'column', gap:1}}
        , React.createElement('div',{style:{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontWeight:700}}, ev.tag,' ',ev.label)
        , ev.height>18 && React.createElement('div',{style:{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',opacity:.85}}, ev.sub)
      )));
      return React.createElement('div', {style:{
        borderTop:`1px solid ${C.border}`, borderLeft:`1px solid ${C.border}`,
        height:HOUR_H, background:isToday?'#fffbf0':C.surface, position:'relative'}},
        ...children
      );
    };

    const ClosedRow = () => (
      React.createElement(React.Fragment, null
        , React.createElement('div', {style:{padding:'3px 6px',fontSize:9,color:C.textDim,textAlign:'right',
            background:'#f8f4f0',borderTop:`1px solid ${C.border}`,height:24,
            display:'flex',alignItems:'center',justifyContent:'flex-end',fontStyle:'italic'}}, '13–16')
        , days.map((_,i) => (
          React.createElement('div', { key:i, style:{borderTop:`1px solid ${C.border}`,borderLeft:`1px solid ${C.border}`,
            height:24,background:'repeating-linear-gradient(135deg,#f8f4f0 0px,#f8f4f0 4px,#f1ece8 4px,#f1ece8 8px)',
            position:'relative'} }
            , React.createElement('div',{style:{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:9,color:'#b8a898',fontWeight:600,letterSpacing:'.05em'}},'CHIUSO')
          )
        ))
      )
    );

    return (
      React.createElement('div', {style:{overflowX:'auto',overflowY:'auto',maxHeight:'70vh'}}
        , React.createElement('div', {style:{display:'grid',gridTemplateColumns:`44px repeat(7,1fr)`,minWidth:560}}

          /* Intestazione */
          , React.createElement('div', {style:{background:C.surface,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:3}})
          , days.map((d,i) => React.createElement(ColHeader, {key:i,d,i}))

          /* Slot mattina: 9–13 */
          , MORNING_SLOTS.map(h => (
            React.createElement(React.Fragment, {key:'m'+h}
              , React.createElement('div', {style:{padding:'2px 6px',fontSize:9,color:C.textDim,textAlign:'right',
                  borderTop:`1px solid ${C.border}`,height:HOUR_H,background:C.bg,
                  display:'flex',alignItems:'flex-start',paddingTop:4}}, String(h).padStart(2,'0')+':00')
              , days.map((d,i) => React.createElement(TimeCell, {key:i, ds:yyyymmdd(d), h, isToday:yyyymmdd(d)===todayStr}))
            )
          ))

          /* Fascia chiusa 13–16 */
          , React.createElement(ClosedRow, null)

          /* Slot sera: 16–23 */
          , EVENING_SLOTS.map(h => (
            React.createElement(React.Fragment, {key:'e'+h}
              , React.createElement('div', {style:{padding:'2px 6px',fontSize:9,color:C.textDim,textAlign:'right',
                  borderTop:`1px solid ${C.border}`,height:HOUR_H,background:C.bg,
                  display:'flex',alignItems:'flex-start',paddingTop:4}}, String(h).padStart(2,'0')+':00')
              , days.map((d,i) => React.createElement(TimeCell, {key:i, ds:yyyymmdd(d), h, isToday:yyyymmdd(d)===todayStr}))
            )
          ))
        )
      )
    );
  };

  // ── VISTA MENSILE ───────────────────────────────────────────────
  const MonthCalSala = () => {
    const y=svCurDate.getFullYear(), m=svCurDate.getMonth();
    const firstDay = new Date(y,m,1);
    const firstDow = (firstDay.getDay()||7)-1; // 0=Lun
    const daysInMonth = new Date(y,m+1,0).getDate();
    const cells = [];
    for(let i=0;i<firstDow;i++) cells.push(null);
    for(let d=1;d<=daysInMonth;d++) cells.push(d);
    while(cells.length%7!==0) cells.push(null);
    const todayStr = yyyymmdd(new Date());
    return (
      React.createElement('div', null
        , React.createElement('div', { style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:2} }
          , DAYS_IT.map(d=>React.createElement('div',{key:d,style:{textAlign:"center",fontSize:11,fontWeight:600,
              color:C.textMuted,padding:"4px 0"}},d))
        )
        , React.createElement('div', { style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2} }
          , cells.map((d,i) => {
            if(!d) return React.createElement('div',{key:i});
            const ds = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
            const evs = approved.filter(p=>p.data===ds);
            const isToday = ds===todayStr;
            return React.createElement('div', { key:i,
              style:{minHeight:60,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px",
                background:isToday?C.goldBg:C.surface} }
              , React.createElement('div', { style:{fontSize:11,fontWeight:isToday?700:500,
                  color:isToday?C.gold:C.text,marginBottom:2} }, d)
              , evs.map(p=>React.createElement('div',{key:p.id,
                  style:{background:C.orange2Bg,border:`1px solid ${C.orange2Border}`,
                    borderLeft:`3px solid ${C.orange2}`,borderRadius:3,
                    padding:"1px 4px",fontSize:9,color:C.orange2,fontWeight:600,
                    overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",marginBottom:1},
                  title:`${p.richiedente} · ${p.oraInizio}–${p.oraFine}${p.telefono?" · "+p.telefono:""}`}
                  ,(p.oraInizio||"").slice(0,5),"–",(p.oraFine||"").slice(0,5),isMobile?"":" "+p.richiedente
                ))
            );
          })
        )
      )
    );
  };

  // ── stati approvazioni ──────────────────────────────────────────
  const statoMeta = {
    in_attesa: { bg:C.orange2Bg, bd:C.orange2Border, tx:C.orange2, label:"In attesa", dot:"#f59e0b" },
    approvata:  { bg:C.greenBg,  bd:C.greenBorder,   tx:C.green,   label:"Approvata", dot:C.green  },
    rifiutata:  { bg:C.redBg,    bd:C.redBorder,     tx:C.red,     label:"Rifiutata", dot:C.red    },
  };

  const aggiornaStato = async (p, nuovoStato) => {
    setSvLoading(l=>({...l,[p.id]:true}));
    try {
      const sb = window.supabaseClient;
      const note = svNoteAdmin[p.id] || "";
      const { error } = await sb.from("prenotazioni_sala")
        .update({ stato: nuovoStato, note_admin: note, updated_at: new Date().toISOString() })
        .eq("id", p.id);
      if (error) throw error;
      onUpdate({ ...p, stato: nuovoStato, noteAdmin: note });
    } catch(e) { alert("Errore: " + e.message); }
    finally { setSvLoading(l=>({...l,[p.id]:false})); }
  };

  const elimina = async (p) => {
    if (!confirm("Eliminare la prenotazione di " + p.richiedente + " del " + fmtDate(p.data) + "?")) return;
    setSvLoading(l=>({...l, ["del_"+p.id]:true}));
    try {
      const sb = window.supabaseClient;
      if (!sb) throw new Error("Supabase non disponibile");
      const { error } = await sb.from("prenotazioni_sala").delete().eq("id", p.id);
      if (error) throw error;
      if (onDelete) onDelete(p.id);
    } catch(e) {
      alert("Errore eliminazione: " + (e.message || String(e)));
    } finally {
      setSvLoading(l=>({...l, ["del_"+p.id]:false}));
    }
  };

  const pending = prenotazioni.filter(p=>p.stato==="in_attesa").length;
  const filteredRichieste = prenotazioni
    .filter(p => svFilterStato==="tutti" || p.stato===svFilterStato)
    .sort((a,b)=>(a.data>b.data?1:a.data<b.data?-1:(a.oraInizio||"")>(b.oraInizio||"")?1:-1));

  return (
    React.createElement('div', { style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"} }

      /* ── TOP BAR ──────────────────────────────────────────────── */
      , React.createElement('div', { style:{padding:"10px 20px",borderBottom:`1px solid ${C.border}`,
          background:C.surface,display:"flex",alignItems:"center",justifyContent:"space-between",
          gap:10,flexWrap:"wrap",flexShrink:0} }
        /* panel tabs */
        , React.createElement('div', { style:{display:"flex",gap:4} }
          , React.createElement('button', { onClick:()=>setSvPanel("calendario"),
              style:{padding:"6px 14px",borderRadius:8,border:`1px solid ${svPanel==="calendario"?C.orange2:C.border}`,
                background:svPanel==="calendario"?C.orange2Bg:"transparent",
                color:svPanel==="calendario"?C.orange2:C.textMuted,
                fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",
                fontWeight:svPanel==="calendario"?600:400,display:"flex",alignItems:"center",gap:6} }
            , React.createElement(Ic,{n:"cal",size:13,stroke:svPanel==="calendario"?C.orange2:C.textMuted})
            , "Calendario occupazioni"
          )
          , role==="admin" && React.createElement('button', { onClick:()=>setSvPanel("richieste"),
              style:{padding:"6px 14px",borderRadius:8,border:`1px solid ${svPanel==="richieste"?C.gold:C.border}`,
                background:svPanel==="richieste"?C.goldBg:"transparent",
                color:svPanel==="richieste"?C.gold:C.textMuted,
                fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",
                fontWeight:svPanel==="richieste"?600:400,display:"flex",alignItems:"center",gap:6} }
            , React.createElement(Ic,{n:"list",size:13,stroke:svPanel==="richieste"?C.gold:C.textMuted})
            , "Richieste"
            , pending>0 && React.createElement('span', { style:{background:"#f59e0b",color:"#fff",
                borderRadius:20,padding:"0px 6px",fontSize:10,fontWeight:700,marginLeft:4} }, pending)
          )
        )
        /* prenota button */
        , React.createElement(Btn, { onClick:()=>setSvModal("add"),
            style:{background:C.orange2,border:"none"} }
          , React.createElement(Ic,{n:"plus",size:14,stroke:"#fff"})
          , role==="admin" ? " Prenota" : " Richiedi prenotazione"
        )
      )

      /* ── CALENDARIO OCCUPAZIONI ───────────────────────────────── */
      , svPanel==="calendario" && React.createElement('div', { style:{flex:1,overflow:"auto",padding:"16px 20px"} }
        , React.createElement(BandWeekCalendar, { lessons: lessons, prenotazioni: prenotazioni })
      )

      /* ── RICHIESTE (admin only) ───────────────────────────────── */
      , svPanel==="richieste" && role==="admin" && React.createElement('div', { style:{flex:1,overflow:"auto",padding:"16px 20px"} }
        /* filtri */
        , React.createElement('div', { style:{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"} }
          , ["tutti","in_attesa","approvata","rifiutata"].map(s => {
            const m=statoMeta[s];
            return React.createElement('button',{key:s,onClick:()=>setSvFilterStato(s),
              style:{padding:"5px 14px",borderRadius:20,cursor:"pointer",fontSize:12,
                fontFamily:"'Open Sans',sans-serif",
                border:`1px solid ${svFilterStato===s?(m?m.dot:C.gold):C.border}`,
                background:svFilterStato===s?(m?m.bg:C.goldBg):"transparent",
                color:svFilterStato===s?(m?m.tx:C.gold):C.textMuted,
                fontWeight:svFilterStato===s?600:400} }
              , s==="tutti"?"Tutte":(m||{}).label||s
            );
          })
        )
        , filteredRichieste.length===0 && React.createElement('div',{style:{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}},"Nessuna richiesta trovata")
        , filteredRichieste.map(p => {
          const m=statoMeta[p.stato]||statoMeta.in_attesa;
          return React.createElement('div',{key:p.id,style:{background:C.surface,border:`1px solid ${C.border}`,
              borderRadius:12,padding:"14px 16px",marginBottom:12,borderLeft:`4px solid ${m.dot}`}}
            , React.createElement('div',{style:{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}
              , React.createElement('div',{style:{flex:1,minWidth:0}}
                , React.createElement('div',{style:{fontSize:14,fontWeight:600,color:C.text,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}
                  , p.richiedente
                  , React.createElement('span',{style:{fontSize:10,color:C.textMuted,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"2px 8px"}},p.ruolo)
                )
                , React.createElement('div',{style:{fontSize:13,color:C.textMuted,marginTop:4}}
                  , React.createElement('b',null,fmtDate(p.data)),"  ·  ",(p.oraInizio||"").slice(0,5)," → ",(p.oraFine||"").slice(0,5)
                )
                , p.motivo && React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginTop:3,fontStyle:"italic"}},"\"",p.motivo,"\"")
                , p.telefono && React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginTop:3,display:"flex",alignItems:"center",gap:5}}
                  ,React.createElement(Ic,{n:"phone",size:11,stroke:C.textMuted}), p.telefono
                )
              )
              , React.createElement('div',{style:{background:m.bg,border:`1px solid ${m.bd}`,color:m.tx,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,flexShrink:0}},m.label)
            )
            , p.stato==="in_attesa" && (
              React.createElement('div',{style:{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:12}}
                , React.createElement('textarea',{placeholder:"Nota per il richiedente (opzionale)…",value:svNoteAdmin[p.id]||"",onChange:e=>setSvNoteAdmin(n=>({...n,[p.id]:e.target.value})),rows:2,
                    style:{width:"100%",padding:"8px 10px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,fontFamily:"'Open Sans',sans-serif",resize:"vertical",background:C.bg,marginBottom:8}})
                , React.createElement('div',{style:{display:"flex",gap:8,justifyContent:"flex-end"}}
                  , React.createElement('button',{onClick:()=>aggiornaStato(p,"rifiutata"),disabled:svLoading[p.id],
                      style:{padding:"7px 16px",borderRadius:8,border:`1px solid ${C.redBorder}`,background:C.redBg,color:C.red,fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif"}}
                    ,svLoading[p.id]?"…":"✕ Rifiuta")
                  , React.createElement('button',{onClick:()=>aggiornaStato(p,"approvata"),disabled:svLoading[p.id],
                      style:{padding:"7px 16px",borderRadius:8,border:`1px solid ${C.greenBorder}`,background:C.greenBg,color:C.green,fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:"'Open Sans',sans-serif"}}
                    ,svLoading[p.id]?"…":"✓ Approva")
                )
              )
            )
            , p.noteAdmin && React.createElement('div',{style:{marginTop:8,fontSize:12,color:C.textMuted,background:C.bg,borderRadius:8,padding:"8px 10px"}}
              ,React.createElement('b',null,"Nota: "),p.noteAdmin)
            , React.createElement('div',{style:{marginTop:8,display:"flex",justifyContent:"flex-end",gap:8}}
              , role==="admin" && React.createElement('button',{onClick:()=>{setSvSelPren(p);setSvModal("edit");},style:{padding:"3px 10px",borderRadius:6,border:`1px solid ${C.border}`,background:C.bg,color:C.gold,fontSize:11,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}
                , React.createElement(Ic,{n:"edit",size:11,stroke:C.gold}), " Modifica")
              ,React.createElement('button',{onClick:()=>elimina(p),disabled:!!svLoading["del_"+p.id],style:{padding:"3px 10px",borderRadius:6,border:"none",background:"none",color:C.red,fontSize:11,cursor:"pointer",opacity:svLoading["del_"+p.id]?0.5:1}},svLoading["del_"+p.id]?"…":"🗑 Elimina")
            )
          );
        })
      )

      /* ── MODAL PRENOTAZIONE ───────────────────────────────────── */
      , svModal==="add" && React.createElement(Modal,{title:"Prenota Sala Prove",onClose:()=>setSvModal(null),wide:true}
        ,React.createElement(SalaProveForm,{
            onSave:(p)=>{if(onUpdate)onUpdate(p);setSvModal(null);},
            onClose:()=>setSvModal(null),
            appUser:appUser,
            role:role,
          })
      )

      /* ── MODAL MODIFICA PRENOTAZIONE (admin only) ─────────────────── */
      , svModal==="edit" && svSelPren && React.createElement(Modal,{title:"Modifica prenotazione",onClose:()=>{setSvModal(null);setSvSelPren(null);},wide:true}
        ,React.createElement(SalaProveForm,{
            initial: svSelPren,
            onSave:(p)=>{if(onUpdate)onUpdate(p);setSvModal(null);setSvSelPren(null);},
            onClose:()=>{setSvModal(null);setSvSelPren(null);},
            appUser:appUser,
            role:role,
          })
      )
    )
  );
};


// ════════════════════════════════════════════════════════════════════════════════
// BIBLIOTECA — Manuali & Libri
// Accessibile a tutti i profili; upload solo admin/docente
// ════════════════════════════════════════════════════════════════════════════════
const BibliotecaView = ({ userRuolo, appUser }) => {
  const ruolo = userRuolo || "allievo";
  const canUpload = ruolo === "admin" || ruolo === "docente";

  const [libri,      setLibri]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filterCat,  setFilterCat]  = useState("");
  const [uploading,  setUploading]  = useState(false);
  const [modal,      setModal]      = useState(null); // "add"
  const [delTarget,  setDelTarget]  = useState(null);

  const CATEGORIE = ["Teoria","Solfeggio","Metodo","Spartito","Manuale","Altro"];

  // ── Carica da Supabase Storage bucket "biblioteca" ──────────────────────────
  const carica = React.useCallback(async () => {
    setLoading(true);
    try {
      const sb = window.supabaseClient;
      if (!sb) { setLoading(false); return; }
      const { data, error } = await sb
        .from("biblioteca")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setLibri(data);
    } catch(e) { console.warn("[FM] biblioteca load:", e); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { carica(); }, []);

  const elimina = async (item) => {
    if (!confirm(`Eliminare "${item.titolo}"?`)) return;
    try {
      const sb = window.supabaseClient;
      // Rimuovi record DB
      await sb.from("biblioteca").delete().eq("id", item.id);
      // Rimuovi file dallo Storage
      if (item.storage_path) {
        await sb.storage.from("biblioteca").remove([item.storage_path]);
      }
      setLibri(p => p.filter(x => x.id !== item.id));
    } catch(e) { alert("Errore eliminazione: " + e.message); }
    setDelTarget(null);
  };

  // ── Form upload ─────────────────────────────────────────────────────────────
  const AddModal = () => {
    const [titolo,    setTitolo]    = useState("");
    const [autore,    setAutore]    = useState("");
    const [categoria, setCategoria] = useState("Manuale");
    const [desc,      setDesc]      = useState("");
    const [file,      setFile]      = useState(null);
    const [err,       setErr]       = useState("");

    const handleSubmit = async () => {
      if (!titolo.trim()) { setErr("Titolo obbligatorio"); return; }
      if (!file)          { setErr("Seleziona un file"); return; }
      setUploading(true); setErr("");
      try {
        const sb = window.supabaseClient;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${Date.now()}_${safeName}`;
        // Upload file
        const { error: upErr } = await sb.storage.from("biblioteca").upload(storagePath, file, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = sb.storage.from("biblioteca").getPublicUrl(storagePath);
        const fileUrl = urlData?.publicUrl || null;
        // Salva record
        const row = {
          titolo: titolo.trim(),
          autore: autore.trim() || null,
          categoria,
          descrizione: desc.trim() || null,
          file_url: fileUrl,
          file_name: file.name,
          file_type: file.type || null,
          file_size: file.size || null,
          storage_path: storagePath,
          caricato_da: (appUser && appUser.nome) || null,
        };
        const { data: inserted, error: dbErr } = await sb.from("biblioteca").insert(row).select().single();
        if (dbErr) throw dbErr;
        setLibri(p => [inserted, ...p]);
        setModal(null);
      } catch(e) { setErr(e.message || "Errore upload"); }
      finally { setUploading(false); }
    };

    const inpS = { width:"100%", padding:"9px 12px", border:`1px solid ${C.border}`,
      borderRadius:8, fontSize:13, color:C.text, background:C.bg,
      fontFamily:"'Open Sans',sans-serif", boxSizing:"border-box" };
    const lblS = { fontSize:11, color:C.textMuted, fontWeight:600,
      letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:4, display:"block" };

    return React.createElement(Modal, { title:"Aggiungi libro / manuale", onClose:()=>setModal(null), wide:true }
      , React.createElement('div', { style:{padding:"16px 22px", display:"flex", flexDirection:"column", gap:14} }
        , React.createElement('div', { className:"form-2col" }
          , React.createElement('div', null
            , React.createElement('label', {style:lblS}, "Titolo *")
            , React.createElement('input', { value:titolo, onChange:e=>setTitolo(e.target.value),
                placeholder:"Es. Metodo Beyer, Scale Hanon…", style:inpS })
          )
          , React.createElement('div', null
            , React.createElement('label', {style:lblS}, "Autore")
            , React.createElement('input', { value:autore, onChange:e=>setAutore(e.target.value),
                placeholder:"Es. Czerny, Hanon…", style:inpS })
          )
        )
        , React.createElement('div', { className:"form-2col" }
          , React.createElement('div', null
            , React.createElement('label', {style:lblS}, "Categoria")
            , React.createElement('select', { value:categoria, onChange:e=>setCategoria(e.target.value),
                style:{...inpS, appearance:"none", cursor:"pointer"} }
              , CATEGORIE.map(c => React.createElement('option', {key:c, value:c}, c))
            )
          )
          , React.createElement('div', null
            , React.createElement('label', {style:lblS}, "Descrizione breve")
            , React.createElement('input', { value:desc, onChange:e=>setDesc(e.target.value),
                placeholder:"Note opzionali…", style:inpS })
          )
        )
        , React.createElement('div', null
          , React.createElement('label', {style:lblS}, "File (PDF, immagine, zip…) *")
          , React.createElement('input', { type:"file",
              accept:".pdf,.doc,.docx,.xls,.xlsx,.zip,.png,.jpg,.jpeg,.mp3,.mp4",
              onChange:e=>setFile(e.target.files[0]||null),
              style:{...inpS, padding:"7px 10px", cursor:"pointer"} })
          , file && React.createElement('div', {style:{fontSize:11,color:C.green,marginTop:4}},
              `✓ ${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`)
        )
        , err && React.createElement('div', {style:{color:C.red,fontSize:12,background:C.redBg,
            border:`1px solid ${C.redBorder}`,borderRadius:8,padding:"10px 14px"}}, err)
        , React.createElement('div', {style:{display:"flex",gap:10,justifyContent:"flex-end"}}
          , React.createElement(Btn, {variant:"secondary", onClick:()=>setModal(null)}, "Annulla")
          , React.createElement(Btn, {onClick:handleSubmit, disabled:uploading}
            , uploading ? "Caricamento…" : "Carica"
          )
        )
      )
    );
  };

  const catColor = {
    Teoria:    {bg:C.blueBg,   bd:C.blueBorder,   tx:C.blue},
    Solfeggio: {bg:C.tealBg,   bd:C.tealBorder,   tx:C.teal},
    Metodo:    {bg:C.goldBg,   bd:C.goldDim,      tx:C.gold},
    Spartito:  {bg:C.purpleBg, bd:C.purpleBorder, tx:C.purple},
    Manuale:   {bg:C.greenBg,  bd:C.greenBorder,  tx:C.green},
    Altro:     {bg:C.surface,  bd:C.border,       tx:C.textMuted},
  };

  const fmtSize = (b) => {
    if (!b) return "";
    if (b < 1024) return b + " B";
    if (b < 1024*1024) return (b/1024).toFixed(0) + " KB";
    return (b/1024/1024).toFixed(1) + " MB";
  };

  const filtered = libri.filter(l => {
    const q = search.toLowerCase();
    const matchQ = !q || (l.titolo||"").toLowerCase().includes(q) || (l.autore||"").toLowerCase().includes(q);
    const matchC = !filterCat || l.categoria === filterCat;
    return matchQ && matchC;
  });

  return (
    React.createElement('div', { style:{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"} }
      /* ── HEADER ── */
      , React.createElement('div', { style:{padding:"0 24px",height:56,display:"flex",alignItems:"center",
          justifyContent:"space-between",flexShrink:0,borderBottom:`1px solid ${C.border}`,background:C.surface} }
        , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:10}}
          , React.createElement(Ic, {n:"courses", size:18, stroke:C.gold})
          , React.createElement('span', {style:{fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,
              letterSpacing:"0.05em",textTransform:"uppercase"}}, "Manuali & Libri")
        )
        , canUpload && React.createElement(Btn, { onClick:()=>setModal("add") }
          , React.createElement(Ic,{n:"plus",size:14,stroke:"#fff"}), " Aggiungi"
        )
      )
      /* ── FILTRI ── */
      , React.createElement('div', { style:{padding:"10px 24px",borderBottom:`1px solid ${C.border}`,
          background:C.surface,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",flexShrink:0} }
        , React.createElement('div', {style:{position:"relative",flex:"1 1 200px",maxWidth:300}}
          , React.createElement(Ic, {n:"search",size:14,stroke:C.textDim,style:{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}})
          , React.createElement('input', { value:search, onChange:e=>setSearch(e.target.value),
              placeholder:"Cerca titolo, autore…",
              style:{width:"100%",padding:"8px 12px 8px 32px",border:`1px solid ${C.border}`,
                borderRadius:8,fontSize:12,color:C.text,background:C.bg,
                fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"} })
        )
        , React.createElement('select', { value:filterCat, onChange:e=>setFilterCat(e.target.value),
            style:{padding:"8px 12px",border:`1px solid ${filterCat?C.gold:C.border}`,borderRadius:8,
              fontSize:12,color:filterCat?C.gold:C.textMuted,background:filterCat?C.goldBg:C.bg,
              fontFamily:"'Open Sans',sans-serif",cursor:"pointer"} }
          , React.createElement('option',{value:""},"Tutte le categorie")
          , CATEGORIE.map(c=>React.createElement('option',{key:c,value:c},c))
        )
      )
      /* ── LISTA ── */
      , React.createElement('div', { style:{flex:1,overflow:"auto",padding:"16px 24px"} }
        , loading && React.createElement('div', {style:{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}},
            "Caricamento…")
        , !loading && filtered.length===0 && React.createElement('div', {style:{textAlign:"center",padding:60,color:C.textMuted}}
          , React.createElement(Ic,{n:"courses",size:40,stroke:C.textDim})
          , React.createElement('p',{style:{marginTop:12,fontSize:14}}, search||filterCat ? "Nessun risultato" : "Nessun file caricato")
          , canUpload && !search && !filterCat && React.createElement('p',{style:{fontSize:12,color:C.textDim,marginTop:4}},
              "Usa il pulsante \"Aggiungi\" per caricare il primo file.")
        )
        , !loading && filtered.length > 0 && React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:10}}
          , filtered.map(item => {
            const cc = catColor[item.categoria] || catColor.Altro;
            const isImg = (item.file_type||"").startsWith("image/");
            const isPdf = (item.file_type||"").includes("pdf");
            const fileIcon = isPdf ? "report" : isImg ? "eye" : "paperclip";
            return React.createElement('div', { key:item.id,
              style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                padding:"14px 18px",display:"flex",alignItems:"flex-start",gap:14,
                transition:"box-shadow 0.15s"},
              onMouseEnter:e=>e.currentTarget.style.boxShadow=`0 2px 12px rgba(0,0,0,0.07)`,
              onMouseLeave:e=>e.currentTarget.style.boxShadow="none"}
              /* Icona tipo */
              , React.createElement('div', {style:{width:44,height:44,borderRadius:10,
                  background:cc.bg,border:`1px solid ${cc.bd}`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                , React.createElement(Ic,{n:fileIcon,size:20,stroke:cc.tx})
              )
              /* Info */
              , React.createElement('div', {style:{flex:1,minWidth:0}}
                , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}
                  , React.createElement('span',{style:{fontSize:14,fontWeight:600,color:C.text}},item.titolo)
                  , React.createElement('span',{style:{fontSize:10,background:cc.bg,color:cc.tx,
                      border:`1px solid ${cc.bd}`,borderRadius:10,padding:"2px 8px",fontWeight:600}},
                      item.categoria||"Altro")
                )
                , item.autore && React.createElement('div',{style:{fontSize:12,color:C.textMuted,marginBottom:2}},
                    item.autore)
                , item.descrizione && React.createElement('div',{style:{fontSize:12,color:C.textMuted,fontStyle:"italic"}},
                    item.descrizione)
                , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:4,display:"flex",gap:12,flexWrap:"wrap"}}
                  , item.file_name && React.createElement('span',null,item.file_name)
                  , item.file_size && React.createElement('span',null,fmtSize(item.file_size))
                  , item.caricato_da && React.createElement('span',null,"by ",item.caricato_da)
                )
              )
              /* Azioni */
              , React.createElement('div', {style:{display:"flex",gap:6,flexShrink:0,alignItems:"center"}}
                , item.file_url && React.createElement('a', {
                    href:item.file_url, target:"_blank", rel:"noopener noreferrer",
                    style:{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",
                      background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:8,
                      color:C.gold,fontSize:12,fontWeight:600,textDecoration:"none",
                      fontFamily:"'Open Sans',sans-serif",cursor:"pointer"}}
                  , React.createElement(Ic,{n:"download",size:13,stroke:C.gold}), " Scarica"
                )
                , canUpload && React.createElement('button', {
                    onClick:()=>elimina(item),
                    style:{display:"flex",alignItems:"center",padding:"7px 10px",
                      background:"none",border:`1px solid ${C.border}`,borderRadius:8,
                      color:C.textDim,cursor:"pointer"},
                    onMouseEnter:e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                    onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textDim;}}
                  , React.createElement(Ic,{n:"trash",size:13,stroke:"currentColor"})
                )
              )
            );
          })
        )
      )
      /* ── MODALS ── */
      , modal==="add" && React.createElement(AddModal)
    )
  );
};

const CalendarioView = ({ lessons:propLessons, setLessons:propSetLessons, courses:_propCoursesRaw, students:_propStudentsRaw, setStudents:propSetStudents, docenti:_propDocentiRaw, repertorio:propRepertorio, setRepertorio:propSetRepertorio, allegati:propAllegati, setAllegati:propSetAllegati, quickAction:qaCV, clearQuickAction:clearQaCV, userRuolo:propUserRuolo, appUser:_appUserCV, config:calConfig }) => {
  const isMobile = useIsMobile();
  const propCourses = _propCoursesRaw || [];
  const propStudents = _propStudentsRaw || [];
  const propDocenti = _propDocentiRaw || [];
  const [_lessons, _setLessons] = useState(INIT_LESSONS);
  const lessons    = _nullishCoalesce(propLessons, () => ( _lessons));
  const setLessons = _nullishCoalesce(propSetLessons, () => ( _setLessons));
  // Usa il repertorio condiviso dall'app root; fallback a stato locale se non passato
  const [_repertorioLocal, _setRepertorioLocal] = useState(INIT_REPERTORIO);
  const repertorio    = propRepertorio    || _repertorioLocal;
  const setRepertorio = propSetRepertorio || _setRepertorioLocal;
    const [viewMode,  setViewMode]  = useState("day");
    const [curDate,   setCurDate]   = useState(new Date(today));
    const [modal,     setModal]     = useState(null);
    const [selLesson, setSelLesson] = useState(null);
    const [addDate,   setAddDate]   = useState(null);
    const role = propUserRuolo || "admin"; // ricevuto dall'App; admin | docente | allievo
    const _cvDocenteId = (_appUserCV && _appUserCV.docenteId) || null;
    const _cvAllievoId = (_appUserCV && _appUserCV.allievoId) || null;
    const _cvNome = (_appUserCV && _appUserCV.nome) || window.__currentUserName__ || "";
    // Per allievo: usa il nome canonico dal record studente nel DB (non il nome del profilo)
    const currentStudent = React.useMemo(() => {
      if (role !== "allievo") return _cvNome;
      if (_cvAllievoId) {
        const stu = propStudents.find(s => String(s.id) === String(_cvAllievoId));
        if (stu) return stu.name || stu.nome || _cvNome;
      }
      // fallback: cerca per nome profilo (case-insensitive)
      const stu = propStudents.find(s =>
        (s.name||s.nome||'').toLowerCase().trim() === _cvNome.toLowerCase().trim()
      );
      return stu ? (stu.name || stu.nome || _cvNome) : _cvNome;
    }, [role, _cvAllievoId, _cvNome, propStudents]);
    const [appView,     setAppView]    = useState("calendario"); // calendario | repertorio | recupero | lezioni_admin

  
    const closeModal = () => { setModal(null); setSelLesson(null); setAddDate(null); setNextLessonCreated(null); };
  React.useEffect(()=>{
    if(qaCV==="addLezione"){ setModal("add"); if(clearQaCV)clearQaCV(); }
    else if(qaCV==="showRecuperi"){ setAppView("recupero"); if(clearQaCV)clearQaCV(); }
    else if(qaCV==="showElenco"){ setAppView("lezioni_admin"); if(clearQaCV)clearQaCV(); }
    else if(qaCV==="showSalaProve"){ setAppView("sala_prove"); if(clearQaCV)clearQaCV(); }
    else if(qaCV==="showCalendario"){ setAppView("calendario"); if(clearQaCV)clearQaCV(); }
    else if(typeof qaCV==="string" && qaCV.startsWith("openLesson:")) {
      const lid = qaCV.slice("openLesson:".length);
      const found = (propLessons||[]).find(l=>String(l.id)===lid);
      if (found) {
        setSelLesson(found);
        setAppView("calendario");
        // Naviga alla data della lezione
        setCurDate(new Date((found.date||found.data||yyyymmdd(oggi))+"T00:00:00"));
        setModal("detail");
      }
      if(clearQaCV)clearQaCV();
    }
  },[qaCV]);

    const navigate = (dir) => {
      const d = new Date(curDate);
      if(viewMode === "day")   d.setDate(d.getDate()+dir);
      if(viewMode === "week")  d.setDate(d.getDate()+dir*7);
      if(viewMode === "month") d.setMonth(d.getMonth()+dir);
      setCurDate(d);
    };
  
    const navLabel = useMemo(() => {
      if(viewMode === "day")   return fmtFull(curDate);
      if(viewMode === "month") return `${MONTHS[curDate.getMonth()]} ${curDate.getFullYear()}`;
      const ws = startOfWeek(curDate);
      const we = addDays(ws, 6);
      return `${fmtShort(ws)} – ${fmtShort(we)} ${we.getFullYear()}`;
    }, [viewMode, curDate]);
  
    const weekStart = startOfWeek(curDate);
  
    // Espone il repertorio globalmente per il modal dettaglio (workaround senza prop drilling)
    window.__repertorio__ = repertorio;
  
    const [nextLessonCreated, setNextLessonCreated] = useState(null);

    // ── Sala Prove ─────────────────────────────────────────────────
    const [prenotazioniSala, setPrenotazioniSala] = useState([]);
    const loadPrenotazioniSala = React.useCallback(async () => {
      const sb = window.supabaseClient;
      if (!sb) return;
      const { data: spRows, error: spErr } = await sb
        .from("prenotazioni_sala").select("*")
        .order("data").order("ora_inizio");
      if (!spErr && spRows) setPrenotazioniSala(spRows.map(adaptPrenotazioneSala));
    }, []);
    React.useEffect(() => { loadPrenotazioniSala(); }, []);

    const handleAdd = (data) => {
      const lessonId = uid();
      setLessons(p => [...p, { ...data, id: lessonId }]);

      // ── 1. Aggiungi i brani NUOVI al catalogo globale (sharedRepertorio) ──
      if (data._newBrani && Object.keys(data._newBrani).length > 0) {
        const nuoviBrani = Object.values(data._newBrani).map(b => ({
          id:         b.id,
          title:      b.title      || b.titolo      || '',
          composer:   b.composer   || b.compositore || '',
          tonality:   b.tonality   || b.tonalita    || '',
          difficulty: b.difficulty || 'Intermedio',
          tipo:       b.tipo       || b.type        || 'individuale',
          note:       b.note       || b.notes       || '',
          lezioni:    0,
        }));
        setRepertorio(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const toAdd = nuoviBrani.filter(b => !existingIds.has(b.id));
          return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
        });
      }

      // ── 2. Propaga tutti i brani selezionati al repertorio dello studente ──
      if (data.repertorioIds && data.repertorioIds.length > 0 && data.student) {
        propSetStudents && propSetStudents(allStudents =>
          allStudents.map(stu => {
            const stuName = stu.name || stu.nome || '';
            if (stuName !== data.student) return stu;

            const existing = (stu.repertorio || []).map(r => r.id);
            const toAdd = data.repertorioIds
              .filter(id => !existing.includes(id))
              .map(id => {
                const fresh = data._newBrani && data._newBrani[id];
                const b = fresh || (window.__repertorio__ || []).find(r => r.id === id);
                if (!b) return null;
                return {
                  id,
                  titolo:      b.title      || b.titolo      || '',
                  compositore: b.composer   || b.compositore || '',
                  periodo:     b.period     || b.periodo     || '',
                  tonalita:    b.tonality   || b.tonalita    || '',
                  stato:       'in studio',
                  note:        ''
                };
              })
              .filter(Boolean);

            if (toAdd.length === 0) return stu;
            return { ...stu, repertorio: [...(stu.repertorio || []), ...toAdd] };
          })
        );
      }

      // ── 3. Salva allegati della lezione con il nuovo lessonId ──
      if (data.allegati && data.allegati.length > 0 && propSetAllegati) {
        const student = (allStudents||[]).find(s=>(s.name||s.nome||'')===data.student);
        const newAllegati = data.allegati.map(a => ({
          ...a,
          lezioneId: lessonId,
          allievoId: student?.id || '',
          allievoNome: data.student || '',
          corso: data.instrument || a.corso || '',
          createdAt: new Date().toISOString(),
        }));
        propSetAllegati(p => [...(p||[]), ...newAllegati]);
      }

      closeModal();
    };
    const handleAddProva   = (data)      => { setLessons(p => [...p, data]); closeModal(); };
    const handleIscrizioneProva = (id, studentName, iscritto) => {
      setLessons(p => p.map(l => l.id === id
        ? {...l, iscritto, student: iscritto ? studentName : ""}
        : l
      ));
    };
    const handleAddCollective = (lesson) => {
      setLessons(p => [...p, lesson]);

      // --- Propaga i brani al repertorio di ogni allievo ---
      if (lesson.repertorioIds && lesson.repertorioIds.length > 0 && lesson.students && lesson.students.length > 0) {
        const lessonStudentIds = lesson.students.map(s => s.id);
        propSetStudents && propSetStudents(allStudents =>
          allStudents.map(stu => {
            if (!lessonStudentIds.includes(stu.id)) return stu;
            const existing = (stu.repertorio || []).map(r => r.id);
            const toAdd = lesson.repertorioIds
              .filter(id => !existing.includes(id))
              .map(id => {
                const b = (window.__repertorio__ || []).find(r => r.id === id);
                return b ? {
                  id: b.id,
                  titolo: b.title || b.titolo || "",
                  compositore: b.composer || b.compositore || "",
                  periodo: b.period || b.periodo || "",
                  tonalita: b.tonality || b.tonalita || "",
                  stato: "in studio",
                  note: ""
                } : null;
              })
              .filter(Boolean);
            if (toAdd.length === 0) return stu;
            return { ...stu, repertorio: [...(stu.repertorio || []), ...toAdd] };
          })
        );
      }

      closeModal();
      // GCal: crea evento
      gcalSyncLesson('sync_one', { ...data, id: lessonId });
    };
    const handleEdit = (data) => {
      // BLOCCO: lezioni recuperate non possono essere modificate
      const existingLesson = (lessons||[]).find(function(l){ return l.id === data.id; });
      if (existingLesson && (existingLesson.attendance === 'recuperata' || existingLesson.attendance === 'recupero')) {
        return; // sola lettura
      }
      var attNorm = data.attendance || null;
      var inRecNorm = data.inRecupero || false;
      var scadNorm = data.recuperoScadenza || null;
      var openCambioOra = false;
      if (attNorm === 'cambio_ora') {
        attNorm = existingLesson?.attendance || null; // mantieni la presenza precedente
        inRecNorm = false;
        scadNorm = null;
        openCambioOra = true;
      } else if (attNorm === 'in_recupero') {
        attNorm = null;
        inRecNorm = true;
        const dLezione = data.date ? new Date(data.date+'T00:00:00') : new Date();
        const lastDay = new Date(dLezione.getFullYear(), dLezione.getMonth()+1, 0);
        scadNorm = lastDay.toISOString().split('T')[0];
      } else if (attNorm === 'recupero') {
        attNorm = 'presente';
        inRecNorm = false;
        scadNorm = null;
      } else if (attNorm === 'presente' || attNorm === 'assente' || attNorm === 'giustificato') {
        inRecNorm = false;
        scadNorm = null;
      }
      const dataNorm = {
        ...data,
        attendance: attNorm,
        inRecupero: inRecNorm,
        recuperoScadenza: scadNorm,
      };

      // Per lezioni collettive: preserva students/courseId se il form non li ha modificati
      const existingStudents = existingLesson?.students || [];
      const mergedStudents   = (dataNorm.students && dataNorm.students.length > 0)
        ? dataNorm.students : existingStudents;
      const mergedCourseId   = dataNorm.courseId   || existingLesson?.courseId   || null;
      const mergedCourseName = dataNorm.courseName || existingLesson?.courseName || null;

      const dataNormFull = { ...dataNorm, students: mergedStudents, courseId: mergedCourseId, courseName: mergedCourseName };
      setLessons(p => p.map(l => l.id === data.id ? { ...l, ...dataNormFull } : l));

      // Write diretto su Supabase — non aspetta il debounce di fm_sync
      const sb = window.supabaseClient;
      if (sb && data.id) {
        const row = {
          data:             dataNormFull.date        || null,
          ora:              dataNormFull.hour        || null,
          student:          dataNormFull.student     || null,
          studente_id:      dataNormFull.studentId   || null,
          strumento:        dataNormFull.instrument  || dataNormFull.strumento || null,
          teacher:          dataNormFull.teacher     || null,
          room:             dataNormFull.room        || null,
          topic:            dataNormFull.topic       || null,
          attendance:       attNorm,
          recurrence:       dataNormFull.recurrence  || 'Nessuna',
          notes:            dataNormFull.notes       || null,
          exercises:        dataNormFull.exercises   || null,
          tipo:             dataNormFull.type        || dataNormFull.tipo || 'individuale',
          link_url:         dataNormFull.linkUrl     || null,
          in_recupero:      inRecNorm,
          recupero_scadenza:scadNorm,
          repertorio_ids:   dataNormFull.repertorioIds && dataNormFull.repertorioIds.length > 0
                              ? JSON.stringify(dataNormFull.repertorioIds) : null,
          corso_id:         mergedCourseId,
          corso_nome:       mergedCourseName,
          students:         mergedStudents.length > 0 ? JSON.stringify(mergedStudents) : null,
        };
        sb.from('lezioni').update(row).eq('id', data.id)
          .then(({ error }) => {
            if (error) console.warn('[FM] handleEdit update error:', error.message);
          });
      }

      // ── 1. Aggiungi i brani NUOVI al catalogo globale ──
      if (data._newBrani && Object.keys(data._newBrani).length > 0) {
        const nuoviBrani = Object.values(data._newBrani).map(b => ({
          id:         b.id,
          title:      b.title      || b.titolo      || '',
          composer:   b.composer   || b.compositore || '',
          tonality:   b.tonality   || b.tonalita    || '',
          difficulty: b.difficulty || 'Intermedio',
          tipo:       b.tipo       || b.type        || 'individuale',
          note:       b.note       || b.notes       || '',
          lezioni:    0,
        }));
        setRepertorio(prev => {
          const existingIds = new Set(prev.map(r => r.id));
          const toAdd = nuoviBrani.filter(b => !existingIds.has(b.id));
          return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
        });
      }

      // ── 2. Propaga eventuali nuovi brani al repertorio dello studente ──
      if (data.repertorioIds && data.repertorioIds.length > 0 && data.student) {
        propSetStudents && propSetStudents(allStudents =>
          allStudents.map(stu => {
            const stuName = stu.name || stu.nome || '';
            if (stuName !== data.student) return stu;

            const existing = (stu.repertorio || []).map(r => r.id);
            const toAdd = data.repertorioIds
              .filter(id => !existing.includes(id))
              .map(id => {
                const fresh = data._newBrani && data._newBrani[id];
                const b = fresh || (window.__repertorio__ || []).find(r => r.id === id);
                if (!b) return null;
                return {
                  id,
                  titolo:      b.title      || b.titolo      || '',
                  compositore: b.composer   || b.compositore || '',
                  periodo:     b.period     || b.periodo     || '',
                  tonalita:    b.tonality   || b.tonalita    || '',
                  stato:       'in studio',
                  note:        ''
                };
              })
              .filter(Boolean);

            if (toAdd.length === 0) return stu;
            return { ...stu, repertorio: [...(stu.repertorio || []), ...toAdd] };
          })
        );
      }

      // ── Crea lezione successiva se ricorrente e viene segnata presenza ──
      const originalLesson = (lessons||[]).find(l => l.id === data.id);
      const attendanceNow = data.attendance && data.attendance !== '';
      if (attendanceNow && dataNormFull.recurrence && dataNormFull.recurrence !== "Nessuna") {
        const isLezioneRecupero = dataNormFull.tipo === 'recupero' || dataNormFull.inRecupero === true;
        if (!isLezioneRecupero) {
          const daysMap = { "Ogni settimana":7, "Ogni 2 settimane":14, "Ogni mese":30 };
          const gap      = daysMap[dataNormFull.recurrence] || 7;
          const nextDate = yyyymmdd(addDays(new Date((dataNormFull.date||"")+"T00:00:00"), gap));
          // Check sincrono nello state React per evitare doppio render
          const alreadyInState = (lessons||[]).some(l =>
            l.date === nextDate && l.hour === dataNormFull.hour &&
            (isColl(dataNormFull)
              ? (l.courseId && dataNormFull.courseId && l.courseId === dataNormFull.courseId)
              : (l.student && dataNormFull.student && l.student === dataNormFull.student))
          );
          if (!alreadyInState) {
            const nextLesson = {
              ...dataNormFull,
              id:               uid(),
              date:             nextDate,
              attendance:       "",
              notes:            "",
              exercises:        "",
              topic:            "",    // azzera argomento per ogni nuova lezione ricorrente
              inRecupero:       false,
              recuperoScadenza: null,
              tipo:             dataNormFull.tipo === 'recupero' ? 'individuale' : (dataNormFull.tipo || 'individuale'),
            };
            // Aggiorna React state
            setLessons(prev => {
              const dup = prev.some(l => l.date === nextDate && l.hour === nextLesson.hour &&
                (isColl(nextLesson) ? l.courseId === nextLesson.courseId : l.student === nextLesson.student));
              if (dup) return prev;
              return [...prev, nextLesson];
            });
            setNextLessonCreated(nextDate);
            // Insert sicuro su Supabase (con guard + check DB)
            safeInsertRecurringLesson(nextLesson, setLessons);
            gcalSyncLesson('sync_one', nextLesson);
          }
        }
      }

      closeModal();
      // Se cambio_ora: apri il modal per cambiare giorno/orario della lezione corrente
      // E azzera la ricorrenza della lezione corrente nel DB così la prossima segnatura di presenza
      // non creerà un'altra ricorrente (il sistema crea già la prossima qui sopra)
      if (openCambioOra && window.__FM_SHOW_CAMBIO_ORA__) {
        const lessonRef = existingLesson || { ...data, id: data.id };
        // Azzera ricorrenza nel DB
        const sbCo = window.supabaseClient;
        if (sbCo && data.id) {
          sbCo.from('lezioni').update({ recurrence: 'Nessuna' }).eq('id', data.id).then(() => {});
        }
        // Azzera ricorrenza in React state
        setLessons(p => p.map(l => l.id === data.id ? { ...l, recurrence: 'Nessuna' } : l));
        setTimeout(() => window.__FM_SHOW_CAMBIO_ORA__({ lesson: { ...lessonRef, recurrence: 'Nessuna' } }), 120);
      }
      // GCal: aggiorna evento (solo se non cambio_ora — quello aggiorna dopo)
      if (!openCambioOra) gcalSyncLesson('sync_one', data);
    };
    const handleDelete = async () => {
      const id = _optionalChain([selLesson, 'optionalAccess', _54 => _54.id]);
      if (!id) { closeModal(); return; }
      setLessons(p => p.filter(l => l.id !== id));
      closeModal();
      try {
        const sb = window.supabaseClient;
        if (sb) {
          const { error } = await sb.from('lezioni').delete().eq('id', id);
          if (error) console.warn('[FM] handleDelete lezione error:', error.message);
        }
      } catch(e) { console.warn('[FM] handleDelete exception:', e?.message); }
      // GCal: rimuovi evento
      gcalSyncLesson('delete_one', { id });
    };
    const handleAttendance = (id, val) => {
      setLessons(prev => {
        const lesson = prev.find(l => l.id === id);
        // BLOCCO: lezioni recuperate o di recupero non possono essere modificate
        if (lesson && (lesson.attendance === 'recuperata' || lesson.attendance === 'recupero')) {
          return prev; // nessuna modifica
        }
        let extraProps = {};
        if (val === 'in_recupero') {
          const d = lesson?.date ? new Date(lesson.date+'T00:00:00') : new Date();
          const lastDay = new Date(d.getFullYear(), d.getMonth()+1, 0);
          extraProps = { inRecupero: true, recuperoScadenza: lastDay.toISOString().split('T')[0] };
        } else if (val === 'recupero') {
          extraProps = { inRecupero: false, recuperoScadenza: null };
        } else if (val === 'cambio_ora') {
          // cambio_ora: non modifica l'attendance, solo crea la prossima ricorrente
          // L'attendance reale viene gestita dal CambioOraModal dopo
          extraProps = { inRecupero: false, recuperoScadenza: null };
        } else if (!val) {
          extraProps = {};
        } else {
          extraProps = { inRecupero: false, recuperoScadenza: null };
        }
        // cambio_ora non aggiorna attendance in state — lascia quella attuale
        const attStateVal = val === 'cambio_ora' ? (lesson.attendance || '') : (val === 'in_recupero' ? '' : val);
        const updated = prev.map(l => l.id === id ? {...l, attendance: attStateVal, ...extraProps} : l);

        // Persisti su Supabase (cambio_ora non persiste ancora — lo fa il modal dopo)
        const sb = window.supabaseClient;
        if (sb && lesson && val !== 'cambio_ora') {
          var attDb = val;
          var inRecDb = extraProps.inRecupero  ?? (lesson.inRecupero  || false);
          var scadDb  = extraProps.recuperoScadenza ?? (lesson.recuperoScadenza || null);
          if (attDb === 'in_recupero') {
            attDb = null;
          } else if (attDb === 'recupero') {
            attDb = 'presente';
            inRecDb = false;
            scadDb = null;
          } else if (!attDb || attDb === '') {
            attDb = null;  // stringa vuota → NULL (il check constraint accetta solo i valori noti)
          }
          sb.from('lezioni').update({
            attendance:        attDb,
            in_recupero:       inRecDb,
            recupero_scadenza: scadDb,
          }).eq('id', id).then(({ error }) => {
            if (error) console.warn('[FM] attendance update error:', error.message);
          });
        }

        // Se segno presenza REALE (non in_recupero) su lezione ricorrente → crea la prossima
        // cambio_ora: crea la prossima lezione all'orario originale, poi apre modal per cambiare l'attuale
        // IMPORTANTE: le lezioni con recurrence='Nessuna' non creano ricorrenti — usato per lezioni già consumate
        const isLezioneRecupero = lesson && (lesson.tipo === 'recupero' || lesson.inRecupero === true);
        const valCreaLezione = val && val !== "" && val !== "in_recupero";
        const isCambioOra = val === 'cambio_ora';
        // Se la lezione ha recurrence='Nessuna' (già consumata da un cambio_ora precedente) non creare ricorrente
        if (lesson && lesson.recurrence === 'Nessuna_consumed') {
          // Lezione già "consumata" — segna solo la presenza
          return updated;
        }
        let shouldOpenCambioOra = false;
        if (lesson && valCreaLezione && lesson.recurrence && lesson.recurrence !== "Nessuna" && !isLezioneRecupero) {
          const daysMap = { "Ogni settimana":7, "Ogni 2 settimane":14, "Ogni mese":30 };
          const gap     = daysMap[lesson.recurrence] || 7;
          const nextDate = yyyymmdd(addDays(new Date(lesson.date+"T00:00:00"), gap));

          const alreadyExists = updated.some(l =>
            l.id !== lesson.id &&
            l.date === nextDate &&
            l.hour === lesson.hour &&
            (isColl(lesson)
              ? (l.courseId && lesson.courseId && l.courseId === lesson.courseId)
              : (l.student  && lesson.student  && l.student  === lesson.student))
          );
          if (!alreadyExists) {
            const nextLesson = {
              ...lesson,
              id:               uid(),
              date:             nextDate,
              attendance:       "",
              notes:            "",
              exercises:        "",
              topic:            "",    // azzera argomento per ogni nuova lezione ricorrente
              inRecupero:       false,
              recuperoScadenza: null,
              tipo:             lesson.tipo === 'recupero' ? 'individuale' : (lesson.tipo || 'individuale'),
            };
            safeInsertRecurringLesson(nextLesson, setLessons);
            gcalSyncLesson('sync_one', nextLesson);
            setNextLessonCreated(nextDate);
            if (isCambioOra) {
              shouldOpenCambioOra = true;
              // Azzera la ricorrenza della lezione corrente nel DB e nello state
              // così la prossima segnatura di presenza NON creerà un'altra ricorrente
              const sb2 = window.supabaseClient;
              if (sb2) {
                sb2.from('lezioni').update({ recurrence: 'Nessuna' }).eq('id', id)
                  .then(() => {});
              }
              return [...updated.map(l =>
                l.id === id ? { ...l, recurrence: 'Nessuna' } : l
              ), nextLesson];
            }
            return [...updated, nextLesson];
          }
          if (isCambioOra) shouldOpenCambioOra = true;
        } else if (isCambioOra) {
          shouldOpenCambioOra = true;
        }
        // Side effect (apertura modal) schedulata DOPO il ritorno dallo state updater
        if (shouldOpenCambioOra) {
          setTimeout(() => {
            if (window.__FM_SHOW_CAMBIO_ORA__) window.__FM_SHOW_CAMBIO_ORA__({ lesson });
          }, 80);
        }
        return updated;
      });
      setSelLesson(p => p ? {...p, attendance:val} : p);
    };
  
    const [filterCorso,   setFilterCorso]   = useState("");
    const [filterDocente, setFilterDocente] = useState("");
    const [filterTipo,    setFilterTipo]    = useState("");

    const visibleLessons = useMemo(() => {
      let ls = role === "allievo"
        ? lessons.filter(l => {
            if (isColl(l)) {
              // collettiva: controlla per ID o nome
              return (l.students||[]).some(s =>
                (_cvAllievoId && String(s.id)===String(_cvAllievoId)) || s.name===currentStudent
              );
            }
            // individuale: prima per studentId (campo numerico certo), poi per nome
            if (_cvAllievoId && l.studentId != null) {
              return String(l.studentId) === String(_cvAllievoId);
            }
            return studentInLesson(l, currentStudent);
          })
        : role === "docente"
        ? (_cvDocenteId
            ? lessons.filter(l => { const d=propDocenti.find(x=>String(x.id)===String(_cvDocenteId)); const k=(d?(d.teacherKey||d.nome||''):_cvNome).toLowerCase().trim(); const t=(l.teacher||"").toLowerCase().trim(); return t===k||t.includes(k)||k.includes(t); })
            : _cvNome ? lessons.filter(l => (l.teacher||"").toLowerCase().includes(_cvNome.toLowerCase())) : lessons)
        : lessons;
      if (filterCorso) {
        ls = ls.filter(l =>
          isColl(l)
            ? l.courseId === filterCorso
            : l.instrument === filterCorso
        );
      }
      if (filterDocente) {
        ls = ls.filter(l => l.teacher === filterDocente);
      }
      if (filterTipo) {
        if (filterTipo === "prova")     ls = ls.filter(l => isProva(l));
        else if (filterTipo === "collettivo") ls = ls.filter(l => isColl(l));
        else if (filterTipo === "normale")    ls = ls.filter(l => !isProva(l) && !isColl(l));
      }
      // Aggiungi eventi sala prove al calendario
      const spEvents = prenotazioniSala
        .filter(p => p.stato === "approvata" || p.stato === "in_attesa")
        .filter(p => {
          const myUserId = _appUserCV && _appUserCV.userId;
          // Admin vede tutto
          if (role === "admin") return true;
          // Docente vede TUTTE le prenotazioni approvate (per sapere quando la sala è occupata)
          // e le proprie in attesa
          if (role === "docente") return p.stato === "approvata" || p.userId === myUserId;
          // Allievo vede solo le proprie
          return p.userId === myUserId;
        })
        .map(p => ({
          id: "sala_" + p.id,
          _isSalaProve: true,
          _original: p,
          tipo: "sala_prove",
          date: p.data,
          hour: p.oraInizio || "",
          oraFine: p.oraFine || "",
          student: p.richiedente || "",
          richiedente: p.richiedente || "",
          teacher: "",
          instrument: "",
          room: "Sala Prove",
          topic: p.motivo || "Sala Prove",
          attendance: p.stato === "approvata" ? "presente" : "",
          notes: p.noteAdmin || "",
          stato: p.stato,
        }));
      return [...ls, ...spEvents];
    }, [lessons, role, filterCorso, filterDocente, filterTipo, _cvAllievoId, currentStudent, _cvDocenteId, _cvNome, prenotazioniSala]);
  
    const todayStr     = yyyymmdd(today);
    const todayLessons = visibleLessons.filter(l => l.date === todayStr);
    const ws           = startOfWeek(today);
    const we           = addDays(ws, 6);
    const weekLessons  = visibleLessons.filter(l => l.date >= yyyymmdd(ws) && l.date <= yyyymmdd(we));
    const pending      = visibleLessons.filter(l => l.date <= todayStr && !l.attendance && l.attendance !== 'recuperata').length;
    const pendingLessons = visibleLessons.filter(l => l.date <= todayStr && !l.attendance && l.attendance !== 'recuperata');
    const [showPending, setShowPending] = useState(false);
  
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5947}}, G)
        , React.createElement('div', { style: {minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5948}}

          /* Navbar */
          , React.createElement('div', { style: {background:C.surface, borderBottom:`1px solid ${C.border}`,
            padding:"0 16px", display:"flex", alignItems:"center", flexShrink:0, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5951}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:10, padding:"14px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5953}}
              , React.createElement('div', { style: {width:26, height:26, borderRadius:6, background:C.gold,
                display:"flex", alignItems:"center", justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5954}}
                , React.createElement(Ic, { n: "music", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5956}})
              )
              , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif", fontSize:15, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5958}}, "Accademia Musicale · Calendario"   )
            )
          )

          /* Calendario sempre visibile */
          , true && React.createElement(React.Fragment, null

          /* Stats ribbon */
          , React.createElement('div', { style: {background:C.surface, borderBottom:`1px solid ${C.border}`,
            padding:"8px clamp(8px,3vw,16px)", display:"flex", gap:"clamp(4px,2vw,16px)", flexShrink:0, overflowX:"auto", WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5966}}
            , [
              { label:"Oggi",                  count:todayLessons.length, sub:"lezioni",       hex:C.gold,   click: null },
              { label:"Questa settimana",       count:weekLessons.length,  sub:"lezioni",       hex:C.blue,   click: null },
              { label:"Presenza da segnare",    count:pending,             sub:"lezioni passate", hex:pending > 0 ? C.orange : C.green, click: (role==='admin'||role==='docente') && pending > 0 ? ()=>setShowPending(p=>!p) : null },
            ].map(s => (
              React.createElement('div', { key: s.label,
                onClick: s.click || undefined,
                style: {display:"flex", alignItems:"center", gap:8, cursor: s.click ? "pointer" : "default",
                  padding:"4px 6px", borderRadius:8, transition:"background .12s", flexShrink:0,
                  background: (s.label==="Presenza da segnare" && showPending) ? `${C.orange}15` : "transparent"},
                onMouseEnter: s.click ? e=>{e.currentTarget.style.background=`${s.hex}15`;} : undefined,
                onMouseLeave: s.click ? e=>{e.currentTarget.style.background=(s.label==="Presenza da segnare"&&showPending)?`${C.orange}15`:"transparent";} : undefined,
                __self: this, __source: {fileName: _jsxFileName, lineNumber: 5973}}
                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif", fontSize:"clamp(20px,5vw,24px)", fontWeight:600, color:s.hex, lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5974}}, s.count)
                , React.createElement('div', { style: {fontSize:11, lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5975}}
                  , React.createElement('div', { style: {color:s.hex, opacity:0.8, textTransform:"uppercase", letterSpacing:"0.04em", fontSize:9, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5976}}, s.label)
                  , React.createElement('div', { style: {color:C.textDim, fontSize:9, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5977}}, s.sub)
                )
                , React.createElement('div', { style: {width:1, height:28, background:C.border, marginLeft:"clamp(4px,2vw,12px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5979}})
              )
            ))
          )

          /* Pannello lezioni da segnare */
          , showPending && pendingLessons.length > 0 && (
            React.createElement('div', {style:{background:C.surface, borderBottom:`1px solid ${C.border}`,
              padding:"12px 16px", flexShrink:0, maxHeight:280, overflow:"auto"}}
              , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}
                , React.createElement('span', {style:{fontSize:12,fontWeight:700,color:C.orange,textTransform:"uppercase",letterSpacing:"0.07em"}},
                    React.createElement(Ic,{n:"clock",size:12,stroke:C.orange}), " ", pending, " lezioni senza presenza")
                , React.createElement('button', {onClick:()=>setShowPending(false),
                    style:{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:16}}, "×")
              )
              , React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:4}}
                , pendingLessons
                    .sort((a,b)=>(a.date+' '+(a.hour||'')).localeCompare(b.date+' '+(b.hour||'')))
                    .map(l => {
                      const d = new Date((l.date||"")+"T00:00:00");
                      const dateStr = d.toLocaleDateString("it-IT",{weekday:"short",day:"2-digit",month:"short"});
                      return React.createElement('div', {key:l.id,
                          onClick:()=>{ setSelLesson(l); setModal('detail'); setShowPending(false); },
                          style:{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,
                            background:C.bg,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .12s"},
                          onMouseEnter:e=>{e.currentTarget.style.borderColor=C.orange;},
                          onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;}}
                        , React.createElement('div', {style:{fontSize:11,color:C.orange,fontWeight:600,minWidth:70}}, dateStr)
                        , React.createElement('div', {style:{fontSize:11,color:C.textMuted,minWidth:40}}, l.hour||"—")
                        , React.createElement('div', {style:{fontSize:12,fontWeight:500,color:C.text,flex:1}},
                            isColl(l) ? (l.courseName||"Collettiva") : (l.student||"—"))
                        , React.createElement('div', {style:{fontSize:11,color:C.textDim}}, l.teacher||"")
                        , React.createElement('span', {style:{fontSize:10,background:"rgba(245,158,11,0.12)",color:C.orange,
                            border:"1px solid rgba(245,158,11,0.3)",borderRadius:20,padding:"2px 7px",fontWeight:600}}, "da segnare")
                      );
                    })
              )
            )
          )

          /* Sub-tabs Calendario / Recupero / Elenco Lezioni */
          , React.createElement('div', {style:{display:'flex', borderBottom:`1px solid ${C.border}`, background:C.surface, flexShrink:0}}
            , [
                {id:'calendario', label:'Calendario', icon:'cal'},
                {id:'recupero',   label:'Recuperi',   icon:'clock'},
                ...(role==='admin'?[{id:'lezioni_admin', label:'Elenco Lezioni', icon:'list'}]:[]),
                {id:'sala_prove', label:'Sala Prove', icon:'drum'},
              ].map(t => React.createElement('button', {key:t.id, onClick:()=>setAppView(t.id),
                style:{padding:'10px 18px', border:'none', background:'none', cursor:'pointer',
                  fontSize:12, fontFamily:"'Open Sans',sans-serif", display:'flex', alignItems:'center', gap:5,
                  color: appView===t.id ? C.gold : C.textMuted,
                  borderBottom:`2px solid ${appView===t.id ? C.gold : 'transparent'}`,
                  transition:'all .15s'}}
                , React.createElement(Ic,{n:t.icon,size:13,stroke:appView===t.id?C.gold:C.textMuted})
                , t.label
              ))
          )

          /* ── VISTA RECUPERO ─────────────────────────────── */
          , appView==='recupero' && React.createElement(RecuperoView, {
              lessons: visibleLessons,
              role: role,
              appUser: _appUserCV,
              onOpenLesson: (l) => { setSelLesson(l); setModal(isSalaProve(l) ? 'detailsala' : ('detail')); },
            })

          /* ── ELENCO LEZIONI ADMIN ───────────────────────── */
          , appView==='lezioni_admin' && role==='admin' && React.createElement(LezioniAdminView, {
              lessons: lessons,
              onEditLesson: (l) => { setSelLesson(l); setModal('edit'); },
              onDeleteLesson: (l) => {
                setLessons(p=>p.filter(x=>x.id!==l.id));
                const sb=window.supabaseClient;
                if(sb) sb.from('lezioni').delete().eq('id',l.id).then(({error})=>{ if(error) console.warn('[FM] delete lezione error:',error.message); });
              },
            })

          /* ── SALA PROVE ─────────────────────────────────────── */
          , appView==='sala_prove' && React.createElement(SalaProveView, {
              prenotazioni: prenotazioniSala,
              lessons:      visibleLessons,
              onUpdate: (updated) => setPrenotazioniSala(p => {
                const exists = p.some(x => x.id === updated.id);
                return exists ? p.map(x => x.id===updated.id ? updated : x) : [...p, updated];
              }),
              onDelete: (id) => setPrenotazioniSala(p => p.filter(x => x.id !== id)),
              role: role,
              appUser: _appUserCV,
            })

          /* Toolbar */
          , appView==='calendario' && React.createElement('div', { className: "cal-toolbar", style: {padding:isMobile?"10px 12px":"14px 24px", display:"flex", justifyContent:"space-between",
            alignItems:"center", flexShrink:0, gap:isMobile?8:12, flexWrap:"wrap"}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5987}}
              , React.createElement('button', { onClick: () => navigate(-1), style: {background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:8, color:C.textMuted, padding:"7px 10px", cursor:"pointer", display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5988}}
                , React.createElement(Ic, { n: "left", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5990}})
              )
              , React.createElement('button', { onClick: () => navigate(1), style: {background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:8, color:C.textMuted, padding:"7px 10px", cursor:"pointer", display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5992}}
                , React.createElement(Ic, { n: "right", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5994}})
              )
              , React.createElement('button', { onClick: () => setCurDate(new Date(today)),
                style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
                  color:C.textMuted, padding:"7px 12px", cursor:"pointer", fontSize:12,
                  fontFamily:"'Open Sans',sans-serif", display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5996}}
                , React.createElement(Ic, { n: "today", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6000}}), "Oggi"
              )
              , React.createElement('span', { className: "cal-nav-label", style: {fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:600,
                marginLeft:4, color:C.text, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6002}}, navLabel)
            )

            , React.createElement('div', { className: "cal-toolbar-right", style: {display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6006}}
              , React.createElement(RefreshBtn)
              , React.createElement('div', { style: {display:"flex", background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:8, overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6007}}
                , [["day","Giorno","day"],["week","Settimana","week"],["month","Mese","cal"]].map(([v, lbl, icon]) => (
                  React.createElement('button', { key: v, onClick: () => setViewMode(v),
                    style: {padding:"7px 10px", border:"none",
                      background: viewMode === v ? `${C.gold}20` : "transparent",
                      color: viewMode === v ? C.gold : C.textMuted,
                      cursor:"pointer", fontSize:12, fontFamily:"'Open Sans',sans-serif",
                      display:"flex", alignItems:"center", gap:4, transition:"all 0.12s",
                      borderRight:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6010}}
                    , React.createElement(Ic, { n: icon, size: 13, stroke: viewMode === v ? C.gold : C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6017}})
                    , React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6018}}, lbl)
                  )
                ))
              )
              , role === "admin" && (
                React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6023}}
                  , React.createElement(Btn, { variant: "secondary", onClick: () => { setAddDate(viewMode==="day"?yyyymmdd(curDate):yyyymmdd(today)); setModal("addprova"); },
                    style: {border:`1px solid ${C.teal}`,color:C.teal,background:C.tealBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6024}}
                    , React.createElement(Ic, { n: "user", size: 14, stroke: C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6026}}), React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6026}}, "Lezione prova" )
                  )
                  , React.createElement(Btn, { variant: "secondary", onClick: () => setModal("addcoll"),
                    style: {border:`1px solid ${C.purple}`,color:C.purple,background:C.purpleBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6028}}
                    , React.createElement(Ic, { n: "group", size: 14, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6030}}), React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6030}}, "Collettiva")
                  )
                  , React.createElement(Btn, { onClick: () => { setAddDate(viewMode === "day" ? yyyymmdd(curDate) : yyyymmdd(today)); setModal("add"); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6032}}
                    , React.createElement(Ic, { n: "plus", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6033}}), React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6033}}, "Nuova lezione" )
                  )
                )
              )
            )
          )

          /* Barra filtri — solo nella tab Calendario, non in Elenco Lezioni che ha la propria barra */
          , appView === 'calendario' && (role === "admin" || role === "docente") && (() => {
            // Valori unici di docente e corso dalle lezioni
            const docenteOpts = [...new Set(lessons.map(l=>l.teacher).filter(Boolean))].sort();
            // Corsi: collettivi (dal nome) + strumenti individuali
            const corsiColl = [...new Map(
              lessons.filter(isColl).map(l=>[l.courseId, {id:l.courseId, label:l.courseName||"Collettiva", coll:true}])
            ).values()];
            const strumentiInd = [...new Set(
              lessons.filter(l=>!isColl(l)).map(l=>l.instrument).filter(Boolean)
            )].sort().map(s=>({id:s, label:s, coll:false}));
            const corsiOpts = [...corsiColl, ...strumentiInd];
            const hasFilter = filterCorso || filterDocente || filterTipo;
            return (
              React.createElement('div', { style: {padding:"6px 16px 8px", background:C.surface,
                borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center",
                gap:8, flexWrap:"wrap", flexShrink:0, overflowX:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6054}}
                , React.createElement(Ic, { n: "filter", size: 13, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6057}})
                /* Filtro corso/strumento */
                , React.createElement('div', { style: {position:"relative", display:"flex", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6059}}
                  , React.createElement('select', { value: filterCorso, onChange: e=>setFilterCorso(e.target.value),
                    style: {appearance:"none", background:filterCorso?C.goldBg:C.bg,
                      border:`1px solid ${filterCorso?C.goldDim:C.border}`, borderRadius:8,
                      padding:"5px 28px 5px 10px", fontSize:12, color:filterCorso?C.gold:C.textMuted,
                      cursor:"pointer", fontFamily:"'Open Sans',sans-serif", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6060}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6065}}, "Tutti i corsi"  )
                    , corsiColl.length>0 && React.createElement('optgroup', { label: "Corsi collettivi" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6066}}
                      , corsiColl.map(c=>React.createElement('option', { key: c.id, value: c.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6067}}, c.label))
                    )
                    , strumentiInd.length>0 && React.createElement('optgroup', { label: "Strumenti individuali" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6069}}
                      , strumentiInd.map(c=>React.createElement('option', { key: c.id, value: c.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6070}}, c.label))
                    )
                  )
                  , React.createElement(Ic, { n: "right", size: 11, stroke: filterCorso?C.gold:C.textDim,
                    style: {position:"absolute", right:8, pointerEvents:"none", transform:"rotate(90deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6073}})
                )
                /* Filtro docente */
                , React.createElement('div', { style: {position:"relative", display:"flex", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6077}}
                  , React.createElement('select', { value: filterDocente, onChange: e=>setFilterDocente(e.target.value),
                    style: {appearance:"none", background:filterDocente?C.goldBg:C.bg,
                      border:`1px solid ${filterDocente?C.goldDim:C.border}`, borderRadius:8,
                      padding:"5px 28px 5px 10px", fontSize:12, color:filterDocente?C.gold:C.textMuted,
                      cursor:"pointer", fontFamily:"'Open Sans',sans-serif", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6078}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6083}}, "Tutti i docenti"  )
                    , docenteOpts.map(d=>React.createElement('option', { key: d, value: d, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6084}}, d))
                  )
                  , React.createElement(Ic, { n: "right", size: 11, stroke: filterDocente?C.gold:C.textDim,
                    style: {position:"absolute", right:8, pointerEvents:"none", transform:"rotate(90deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6086}})
                )
                /* Filtro tipo lezione */
                , React.createElement('div', { style: {position:"relative", display:"flex", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6090}}
                  , React.createElement('select', { value: filterTipo, onChange: e=>setFilterTipo(e.target.value),
                    style: {appearance:"none", background:filterTipo?C.tealBg:C.bg,
                      border:`1px solid ${filterTipo?C.tealBorder:C.border}`, borderRadius:8,
                      padding:"5px 28px 5px 10px", fontSize:12, color:filterTipo?C.teal:C.textMuted,
                      cursor:"pointer", fontFamily:"'Open Sans',sans-serif", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6091}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6096}}, "Tutti i tipi"  )
                    , React.createElement('option', { value: "normale", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6097}}, "Individuali")
                    , React.createElement('option', { value: "collettivo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6098}}, "Collettive")
                    , React.createElement('option', { value: "prova", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6099}}, "Lezioni prova" )
                  )
                  , React.createElement(Ic, { n: "right", size: 11, stroke: filterTipo?C.teal:C.textDim,
                    style: {position:"absolute", right:8, pointerEvents:"none", transform:"rotate(90deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6101}})
                )

                /* Reset filtri */
                , hasFilter && (
                  React.createElement('button', { onClick: ()=>{setFilterCorso(""); setFilterDocente(""); setFilterTipo("");},
                    style: {display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
                      borderRadius:8, border:`1px solid ${C.border}`, background:C.bg,
                      cursor:"pointer", fontSize:11, color:C.textMuted,
                      fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6107}}
                    , React.createElement(Ic, { n: "x", size: 11, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6112}}), "Reset"
                  )
                )
                , hasFilter && (
                  React.createElement('span', { style: {fontSize:11, color:C.textDim, marginLeft:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6116}}
                    , visibleLessons.length, " lezione/i"
                  )
                )
              )
            );
          })()

          /* Contenuto */
          , React.createElement('div', { style: {flex:1, padding: isMobile ? "0 8px 8px" : "0 12px 12px", overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6125}}
            , React.createElement('div', { style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"visible"}, className: "table-scroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6126}}
              , appView==='calendario' && viewMode === "day"   && React.createElement('div', { style: {padding: isMobile ? "6px 4px" : 20}}, React.createElement(DayView, { date: curDate, lessons: visibleLessons, isMobile: isMobile, config: calConfig, onSelect: l => { if(isSalaProve(l)){setSelLesson(l);setModal("detailsala");}else{setSelLesson(l);setModal("detail");} }}))
              , appView==='calendario' && viewMode === "week"  && React.createElement(WeekView, {  weekStart: weekStart, lessons: visibleLessons, config: calConfig, onSelect: l => { if(isSalaProve(l)){setSelLesson(l);setModal("detailsala");}else{setSelLesson(l);setModal("detail");} }})
              , appView==='calendario' && viewMode === "month" && React.createElement(MonthView, { year: curDate.getFullYear(), month: curDate.getMonth(), lessons: visibleLessons, config: calConfig, onSelect: l => { if(isSalaProve(l)){setSelLesson(l);setModal("detailsala");}else{setSelLesson(l);setModal("detail");} }, onDayClick: d => { setCurDate(d); setViewMode("day"); }})
            )
          )
          )
        )

        , modal === "add" && (
          React.createElement(Modal, { title: "Nuova lezione" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6136}}
            , React.createElement(LessonForm, { initial: addDate ? {...emptyLesson, date:addDate} : undefined, onSave: handleAdd, onClose: closeModal, repertorio: repertorio, onAddBrano: b => setRepertorio(p=>[...p,b]), students: propStudents, docenti: propDocenti, courses: propCourses, role: role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6137}})
          )
        )
        , modal === "edit" && selLesson && (
          isColl(selLesson)
            ? React.createElement(Modal, { title: "Modifica lezione collettiva", onClose: closeModal, wide: true}
                , React.createElement(CollectiveLessonForm, {
                    initial: selLesson,
                    courses: propCourses,
                    students: propStudents,
                    docenti: propDocenti,
                    repertorio: repertorio,
                    onAddBrano: b => setRepertorio(p=>[...p,b]),
                    onSave: handleEdit,
                    onClose: closeModal,
                  })
              )
            : isProva(selLesson)
            ? React.createElement(Modal, { title: "Modifica lezione di prova", onClose: closeModal, wide: true}
                , React.createElement(TrialLessonForm, {
                    initial: selLesson,
                    docenti: propDocenti,
                    courses: propCourses,
                    onSave: handleEdit,
                    onClose: closeModal,
                  })
              )
            : React.createElement(Modal, { title: "Modifica lezione" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6141}}
                , React.createElement(LessonForm, { initial: selLesson, onSave: handleEdit, onClose: closeModal, repertorio: repertorio, onAddBrano: b => setRepertorio(p=>[...p,b]), students: propStudents, docenti: propDocenti, courses: propCourses, role: role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6142}})
              )
        )
        , modal === "detail" && selLesson && (
          React.createElement(LessonDetailModal, {
            lesson: lessons.find(l => l.id === selLesson.id) || selLesson,
            onEdit: () => setModal("edit"),
            onDelete: () => setModal("delete"),
            onAttendance: handleAttendance,
            onIscrizione: handleIscrizioneProva,
            onUpdateLesson: (updated) => {
              setLessons(p => p.map(l => l.id === updated.id ? {...l,...updated} : l));
              // Persisti su Supabase
              const sb = window.supabaseClient;
              if (sb && updated.id) {
                sb.from('lezioni').update({
                  topic:          updated.topic        || null,
                  exercises:      updated.exercises    || null,
                  link_url:       updated.linkUrl      || null,
                  notes:          updated.notes        || null,
                  repertorio_ids: updated.repertorioIds && updated.repertorioIds.length > 0
                                    ? JSON.stringify(updated.repertorioIds) : null,
                  updated_at:     new Date().toISOString(),
                }).eq('id', updated.id).then(({ error }) => {
                  if (error) console.warn('[FM] onUpdateLesson error:', error.message);
                });
              }
            },
            allegatiGlobali: propAllegati,
            students: propStudents,
            nextLessonDate: _optionalChain([selLesson, 'optionalAccess', _55 => _55.recurrence]) && selLesson.recurrence !== 'Nessuna' ? nextLessonCreated : null,
            onClose: closeModal,
            role: role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6146}})
        )
        , modal === "delete" && selLesson && (
          React.createElement(ConfirmDel, { label: selLesson.student, onConfirm: handleDelete, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6158}})
        )
        , modal === "addcoll" && (
          React.createElement(Modal, { title: "Nuova lezione collettiva"  , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6161}}
            , React.createElement(CollectiveLessonForm, {
              courses: propCourses,
              students: propStudents,
              docenti: propDocenti,
              repertorio: repertorio,
              onAddBrano: b => setRepertorio(p=>[...p,b]),
              onSave: handleAddCollective,
              onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6162}})
          )
        )
        , modal === "addprova" && (
          React.createElement(Modal, { title: "Lezione di prova"  , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6171}}
            , React.createElement(TrialLessonForm, {
              docenti: propDocenti,
              courses: propCourses,
              date: addDate,
              onSave: handleAddProva,
              onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6172}})
          )
        )
        , modal === "addsala" && (
          React.createElement(Modal, { title: "Prenota Sala Prove", onClose: closeModal, wide: true }
            , React.createElement(SalaProveForm, {
                onSave: (p) => {
                  setPrenotazioniSala(prev => {
                    const exists = prev.some(x => x.id === p.id);
                    return exists ? prev.map(x => x.id===p.id ? p : x) : [...prev, p];
                  });
                  closeModal();
                },
                onClose: closeModal,
                appUser: _appUserCV,
                role: role,
              })
          )
        )
        , modal === "detailsala" && selLesson && (() => {
          // _original è il record prenotazione_sala; se manca, ricostruiamo dai campi del selLesson
          const orig = selLesson._original || {
            id:         selLesson.id?.replace("sala_",""),
            data:       selLesson.date,
            oraInizio:  selLesson.hour,
            oraFine:    selLesson.oraFine,
            richiedente:selLesson.richiedente || selLesson.student,
            ruolo:      selLesson.ruolo || "",
            telefono:   selLesson.telefono || "",
            motivo:     selLesson.topic !== "Sala Prove" ? selLesson.topic : "",
            stato:      selLesson.stato || "approvata",
            noteAdmin:  selLesson.notes || "",
          };
          return (
          React.createElement(Modal, { title: "Sala Prove", onClose: closeModal }
            , React.createElement('div', { style:{padding:"8px 0",display:"flex",flexDirection:"column",gap:14} }
              , React.createElement('div', { style:{background:C.orange2Bg,border:`1px solid ${C.orange2Border}`,
                  borderRadius:10,padding:"14px 16px"} }
                , React.createElement('div', { style:{fontSize:13,fontWeight:600,color:C.orange2,marginBottom:6} }, "🤘 Prenotazione Sala Prove")
                , React.createElement('div', { style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13} }
                  , React.createElement('div', null, React.createElement('span',{style:{color:C.textMuted,fontSize:11}},"Data"), React.createElement('div',{style:{fontWeight:600}}, fmtDate(orig.data)))
                  , React.createElement('div', null, React.createElement('span',{style:{color:C.textMuted,fontSize:11}},"Orario"), React.createElement('div',{style:{fontWeight:600}}, (orig.oraInizio||"").slice(0,5), " → ", (orig.oraFine||"").slice(0,5)))
                  , React.createElement('div', null, React.createElement('span',{style:{color:C.textMuted,fontSize:11}},"Richiedente"), React.createElement('div',{style:{fontWeight:600}}, orig.richiedente))
                  , orig.ruolo && React.createElement('div', null, React.createElement('span',{style:{color:C.textMuted,fontSize:11}},"Ruolo"), React.createElement('div',{style:{fontWeight:600}}, orig.ruolo))
                  , orig.telefono && React.createElement('div', null, React.createElement('span',{style:{color:C.textMuted,fontSize:11}},"Telefono"), React.createElement('div',{style:{fontWeight:600,display:"flex",alignItems:"center",gap:5}},React.createElement(Ic,{n:"phone",size:12,stroke:C.orange2}),orig.telefono))
                )
                , orig.motivo && (
                  React.createElement('div', { style:{marginTop:10,fontSize:12,color:C.textMuted,fontStyle:"italic"} }
                    , "\"", orig.motivo, "\""
                  )
                )
              )
              , React.createElement('div', { style:{display:"flex",alignItems:"center",gap:10} }
                , React.createElement('div', { style:{
                    background: orig.stato==="approvata" ? C.greenBg : orig.stato==="rifiutata" ? C.redBg : C.orange2Bg,
                    border:`1px solid ${orig.stato==="approvata" ? C.greenBorder : orig.stato==="rifiutata" ? C.redBorder : C.orange2Border}`,
                    color: orig.stato==="approvata" ? C.green : orig.stato==="rifiutata" ? C.red : C.orange2,
                    borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:700} }
                  , orig.stato==="approvata" ? "✓ Approvata" : orig.stato==="rifiutata" ? "✕ Rifiutata" : "⏳ In attesa di approvazione"
                )
              )
              , orig.noteAdmin && (
                React.createElement('div', { style:{fontSize:12,color:C.textMuted,background:C.bg,
                    borderRadius:8,padding:"10px 12px"} }
                  , React.createElement('b', null, "Nota admin: "), orig.noteAdmin
                )
              )
              , role==="admin" && orig.stato==="in_attesa" && (
                React.createElement('div', { style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4} }
                  , React.createElement('button', { onClick: async () => {
                      const sb=window.supabaseClient;
                      await sb.from("prenotazioni_sala").update({stato:"rifiutata",updated_at:new Date().toISOString()}).eq("id",orig.id);
                      setPrenotazioniSala(p=>p.map(x=>x.id===orig.id?{...x,stato:"rifiutata"}:x));
                      closeModal();
                    }, style:{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.redBorder}`,
                      background:C.redBg,color:C.red,fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif"} }
                    , "✕ Rifiuta"
                  )
                  , React.createElement('button', { onClick: async () => {
                      const sb=window.supabaseClient;
                      await sb.from("prenotazioni_sala").update({stato:"approvata",updated_at:new Date().toISOString()}).eq("id",orig.id);
                      setPrenotazioniSala(p=>p.map(x=>x.id===orig.id?{...x,stato:"approvata"}:x));
                      closeModal();
                    }, style:{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.greenBorder}`,
                      background:C.greenBg,color:C.green,fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:"'Open Sans',sans-serif"} }
                    , "✓ Approva"
                  )
                )
              )
              , React.createElement('div', { style:{display:"flex",justifyContent:"flex-end"} }
                , React.createElement(Btn, { variant:"secondary", onClick:closeModal }, "Chiudi")
              )
            )
          )
          );
        })()
      )
    );
};


// ════════════════════════════════════════════════════════════════════════════════

// CONTABILITÀ

// ════════════════════════════════════════════════════════════════════════════════

// ─── COSTANTI ─────────────────────────────────────────────────────────────────
const ANNO_ATT = new Date().getFullYear();
const MESE_ATT = new Date().getMonth();
const CATEGORIE_DEFAULT = [
  { id:"docenti",       label:"Compensi docenti",   hex:C.gold,   bg:C.goldBg,    bd:C.goldDim    },
  { id:"pulizie",       label:"Pulizie",             hex:C.teal,   bg:C.tealBg,    bd:C.tealBorder },
  { id:"rappresentanza",label:"Rappresentanza",      hex:C.purple, bg:C.purpleBg,  bd:C.purpleBorder},
  { id:"materiale",     label:"Acquisto materiale",  hex:C.blue,   bg:C.blueBg,    bd:C.blueBorder },
  { id:"utenze",        label:"Utenze",              hex:C.orange, bg:C.orangeBg,  bd:C.orangeBorder},
  { id:"manutenzione",  label:"Manutenzione",        hex:C.red,    bg:C.redBg,     bd:C.redBorder  },
  { id:"altro",         label:"Altro",               hex:C.textMuted,bg:C.surface, bd:C.border     },
];
const catById = id => CATEGORIE_DEFAULT.find(c=>c.id===id)||CATEGORIE_DEFAULT[CATEGORIE_DEFAULT.length-1];

const METODI_PAG = ["Bonifico bancario","Contanti","Carta / POS","PayPal / Satispay","Assegno"];

const DOCENTI = [
  {id:"d1",name:"Prof. Rossi",   instrument:"Pianoforte / Violino", baseOraria:35},
  {id:"d2",name:"Prof. Bianchi", instrument:"Chitarra / Flauto",    baseOraria:35},
  {id:"d3",name:"Prof. Verde",   instrument:"Batteria",             baseOraria:35},
  {id:"d4",name:"Prof. Marino",  instrument:"Canto",                baseOraria:35},
];

// ─── DATI DEMO ────────────────────────────────────────────────────────────────
const mkSpesa = (id,categoria,desc,importo,mese,anno,metodo,data,docenteId=null,note="") =>
  ({id,categoria,desc,importo,mese,anno,metodo,data,docenteId,note});

const INIT_SPESE = [
  // Compensi docenti
  mkSpesa("e001","docenti","Compenso mensile Prof. Rossi",   980, 0,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-01-28`,"d1"),
  mkSpesa("e002","docenti","Compenso mensile Prof. Bianchi", 840, 0,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-01-28`,"d2"),
  mkSpesa("e003","docenti","Compenso mensile Prof. Verde",   700, 0,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-01-28`,"d3"),
  mkSpesa("e004","docenti","Compenso mensile Prof. Rossi",   980, 1,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-02-28`,"d1"),
  mkSpesa("e005","docenti","Compenso mensile Prof. Bianchi", 840, 1,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-02-28`,"d2"),
  mkSpesa("e006","docenti","Compenso mensile Prof. Verde",   700, 1,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-02-28`,"d3"),
  mkSpesa("e007","docenti","Compenso mensile Prof. Rossi",   980, 2,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-03-28`,"d1"),
  mkSpesa("e008","docenti","Compenso mensile Prof. Bianchi", 840, 2,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-03-28`,"d2"),
  mkSpesa("e009","docenti","Compenso mensile Prof. Verde",   700, 2,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-03-28`,"d3"),
  mkSpesa("e010","docenti","Compenso mensile Prof. Rossi",   980, 3,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-04-28`,"d1"),
  mkSpesa("e011","docenti","Compenso mensile Prof. Bianchi", 840, 3,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-04-28`,"d2"),
  mkSpesa("e012","docenti","Compenso mensile Prof. Verde",   700, 3,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-04-28`,"d3"),
  mkSpesa("e013","docenti","Compenso mensile Prof. Rossi",   980, 4,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-05-28`,"d1"),
  mkSpesa("e014","docenti","Compenso mensile Prof. Bianchi", 840, 4,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-05-28`,"d2"),
  mkSpesa("e015","docenti","Compenso mensile Prof. Verde",   700, 4,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-05-28`,"d3"),
  // Pulizie
  mkSpesa("e020","pulizie","Servizio pulizia mensile",180,0,ANNO_ATT,"Contanti",`${ANNO_ATT}-01-31`),
  mkSpesa("e021","pulizie","Servizio pulizia mensile",180,1,ANNO_ATT,"Contanti",`${ANNO_ATT}-02-28`),
  mkSpesa("e022","pulizie","Servizio pulizia mensile",180,2,ANNO_ATT,"Contanti",`${ANNO_ATT}-03-31`),
  mkSpesa("e023","pulizie","Servizio pulizia mensile",180,3,ANNO_ATT,"Contanti",`${ANNO_ATT}-04-30`),
  mkSpesa("e024","pulizie","Servizio pulizia mensile",180,4,ANNO_ATT,"Contanti",`${ANNO_ATT}-05-31`),
  // Rappresentanza
  mkSpesa("e030","rappresentanza","Saggio fine anno — catering",320,4,ANNO_ATT,"Carta / POS",`${ANNO_ATT}-05-15`),
  mkSpesa("e031","rappresentanza","Stampa programmi di sala",95,4,ANNO_ATT,"Contanti",`${ANNO_ATT}-05-10`),
  // Materiale
  mkSpesa("e040","materiale","Acquisto spartiti e metodi",210,0,ANNO_ATT,"Carta / POS",`${ANNO_ATT}-01-15`),
  mkSpesa("e041","materiale","Pelli batteria",145,2,ANNO_ATT,"Contanti",`${ANNO_ATT}-03-20`),
  mkSpesa("e042","materiale","Corde chitarra (stock)",88,3,ANNO_ATT,"Contanti",`${ANNO_ATT}-04-10`),
  // Utenze
  mkSpesa("e050","utenze","Bolletta luce Gennaio",240,0,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-01-20`),
  mkSpesa("e051","utenze","Bolletta luce Febbraio",230,1,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-02-20`),
  mkSpesa("e052","utenze","Bolletta luce Marzo",195,2,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-03-20`),
  mkSpesa("e053","utenze","Bolletta luce Aprile",175,3,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-04-20`),
  mkSpesa("e054","utenze","Bolletta luce Maggio",160,4,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-05-20`),
  mkSpesa("e055","utenze","Internet + telefono",45,0,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-01-05`),
  mkSpesa("e056","utenze","Internet + telefono",45,1,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-02-05`),
  mkSpesa("e057","utenze","Internet + telefono",45,2,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-03-05`),
  mkSpesa("e058","utenze","Internet + telefono",45,3,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-04-05`),
  mkSpesa("e059","utenze","Internet + telefono",45,4,ANNO_ATT,"Bonifico bancario",`${ANNO_ATT}-05-05`),
  // Manutenzione
  mkSpesa("e060","manutenzione","Accordatura pianoforte Sala A",120,1,ANNO_ATT,"Contanti",`${ANNO_ATT}-02-14`),
  mkSpesa("e061","manutenzione","Riparazione pedaliera batteria",65,3,ANNO_ATT,"Contanti",`${ANNO_ATT}-04-22`),
];

// Entrate demo (quote allievi — per il saldo netto)
// Quote pagate (entrate) — fonte di verità per i pagamenti degli allievi
// mese: 1-indexed (1=Gen, 12=Dic); anno: anno solare del mese
const mkQ = (id, sid, sname, importo, mese, anno, data, metodo="Bonifico bancario") => ({
  id, studentId:sid, studentName:sname, importo, mese, anno, data, metodo,
  categoria:"quota",
  desc:`Quota mensile ${["","Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"][mese]} ${anno} — ${sname}`
});
const AS = annoScolasticoAttivo; // anno inizio a.s. corrente (es. 2025)
const INIT_ENTRATE_QUOTE = (()=>{
  let n=1;
  const addNum = (e) => {
    const anno = e.anno || new Date().getFullYear();
    return {...e, numRicevuta: String(n++).padStart(3,"0")+"/"+anno};
  };
  return [
  // ── Sofia Marchetti (id:1, €120) ──
  mkQ("q001",1,"Sofia Marchetti",  120, 9, AS,   `${AS}-09-05`),
  mkQ("q002",1,"Sofia Marchetti",  120,10, AS,   `${AS}-10-03`),
  mkQ("q003",1,"Sofia Marchetti",  120,11, AS,   `${AS}-11-04`),
  mkQ("q004",1,"Sofia Marchetti",  120,12, AS,   `${AS}-12-02`),
  mkQ("q005",1,"Sofia Marchetti",  120, 1, AS+1, `${AS+1}-01-07`),
  mkQ("q006",1,"Sofia Marchetti",  120, 2, AS+1, `${AS+1}-02-03`),
  // ── Luca Ferrara (id:2, €100) — dicembre non pagato ──
  mkQ("q011",2,"Luca Ferrara",     100, 9, AS,   `${AS}-09-10`),
  mkQ("q012",2,"Luca Ferrara",     100,10, AS,   `${AS}-10-08`),
  mkQ("q013",2,"Luca Ferrara",     100,11, AS,   `${AS}-11-12`),
  mkQ("q015",2,"Luca Ferrara",     100, 1, AS+1, `${AS+1}-01-20`),
  mkQ("q016",2,"Luca Ferrara",     100, 2, AS+1, `${AS+1}-02-10`),
  // ── Emma Conti (id:3, €130) ──
  mkQ("q021",3,"Emma Conti",       130, 9, AS,   `${AS}-09-02`),
  mkQ("q022",3,"Emma Conti",       130,10, AS,   `${AS}-10-01`),
  mkQ("q023",3,"Emma Conti",       130,11, AS,   `${AS}-11-04`),
  mkQ("q024",3,"Emma Conti",       130,12, AS,   `${AS}-12-03`),
  mkQ("q025",3,"Emma Conti",       130, 1, AS+1, `${AS+1}-01-06`),
  mkQ("q026",3,"Emma Conti",       130, 2, AS+1, `${AS+1}-02-04`),
  // ── Marco Ricci (id:4, €110) — inattivo da nov ──
  mkQ("q031",4,"Marco Ricci",      110, 9, AS,   `${AS}-09-15`),
  mkQ("q032",4,"Marco Ricci",      110,10, AS,   `${AS}-10-18`,"Contanti"),
  // ── Giulia Romano (id:5, €95) ──
  mkQ("q041",5,"Giulia Romano",    95,  9, AS,   `${AS}-09-08`),
  mkQ("q042",5,"Giulia Romano",    95, 10, AS,   `${AS}-10-06`),
  mkQ("q043",5,"Giulia Romano",    95, 11, AS,   `${AS}-11-05`),
  mkQ("q044",5,"Giulia Romano",    95, 12, AS,   `${AS}-12-09`),
  mkQ("q045",5,"Giulia Romano",    95,  1, AS+1, `${AS+1}-01-13`),
  mkQ("q046",5,"Giulia Romano",    95,  2, AS+1, `${AS+1}-02-11`),
  // ── Alessandro Gallo (id:6, €120) ──
  mkQ("q051",6,"Alessandro Gallo", 120, 9, AS,   `${AS}-09-03`),
  mkQ("q052",6,"Alessandro Gallo", 120,10, AS,   `${AS}-10-07`),
  mkQ("q053",6,"Alessandro Gallo", 120,11, AS,   `${AS}-11-06`),
  mkQ("q054",6,"Alessandro Gallo", 120,12, AS,   `${AS}-12-05`),
  mkQ("q055",6,"Alessandro Gallo", 120, 1, AS+1, `${AS+1}-01-08`),
  mkQ("q056",6,"Alessandro Gallo", 120, 2, AS+1, `${AS+1}-02-06`),
  ].map(addNum);
})();

// ─── FORM SPESA ───────────────────────────────────────────────────────────────
const SpesaForm = ({ initial, onSave, onClose, docenti:_docentiFSp, categorie:_catSpeseForm, onAddCategoria }) => {
  const CATEGORIE = _catSpeseForm || CATEGORIE_DEFAULT;
  const [nuovaCat, setNuovaCat] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);
  const [f, setF] = useState(initial || {
    categoria:"docenti", desc:"", importo:"",
    mese:MESE_ATT, anno:ANNO_ATT,
    metodo:"Bonifico bancario", data:yyyymmdd(oggi),
    docenteId:"", note:""
  });
  const [err, setErr] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const validate = () => {
    const e={};
    if(!f.desc.trim())                          e.desc    = "Descrizione obbligatoria";
    if(!f.importo||isNaN(f.importo)||Number(f.importo)<=0) e.importo = "Importo non valido";
    if(!f.data)                                 e.data    = "Data obbligatoria";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if(Object.keys(e).length){ setErr(e); return; }
    // Auto-compila desc per docente
    let desc = f.desc;
    if(f.categoria==="docenti"&&f.docenteId&&!f.desc) {
      const d = (_docentiFSp&&_docentiFSp.length?_docentiFSp:DOCENTI).find(x=>x.id===f.docenteId);
      if(d) desc = `Compenso mensile ${(d.nome||d.name)}`;
    }
    onSave({...f, desc, importo:Number(f.importo)});
  };

  const cat = catById(f.categoria);

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22,display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6355}}

        /* Categoria */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6358}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6359}}, "Categoria")
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6360}}
            , [...CATEGORIE, ...(showAddCat?[]:[{id:"__new__",label:"+ Nuova",hex:C.textMuted,bg:"transparent",bd:C.border}])].map(c=>(
              React.createElement('button', { key: c.id, onClick: ()=>c.id==="__new__"?setShowAddCat(true):set("categoria",c.id),
                style: {padding:"8px 6px",borderRadius:8,border:`2px solid ${f.categoria===c.id?c.hex:C.border}`,
                  background:f.categoria===c.id?c.bg:C.bg,cursor:"pointer",fontSize:11,textAlign:"center",
                  color:f.categoria===c.id?c.hex:C.textMuted,fontFamily:"'Open Sans',sans-serif",
                  fontWeight:f.categoria===c.id?500:400,transition:"all 0.12s",lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6362}}
                , c.label
              )
            ))
          )
        )

        /* Se categoria = docenti, mostra select docente */
        , f.categoria==="docenti" && (
          React.createElement(Sel, { label: "Docente", value: f.docenteId, onChange: e=>{ set("docenteId",e.target.value); const _dList=(_docentiFSp&&_docentiFSp.length?_docentiFSp:DOCENTI); const d=_dList.find(x=>x.id===e.target.value); if(d) set("desc",`Compenso mensile ${d.nome||d.name}`); },
            options: [{value:"",label:"— seleziona docente —"},...(_docentiFSp&&_docentiFSp.length?_docentiFSp:DOCENTI).map(d=>({value:d.id,label:d.nome||d.name}))], __self: this, __source: {fileName: _jsxFileName, lineNumber: 6375}})
        )

        , showAddCat && React.createElement('div', {style:{display:"flex",gap:8,alignItems:"center",marginTop:8,gridColumn:"1/-1"}}
          , React.createElement('input', {autoFocus:true, value:nuovaCat, onChange:e=>setNuovaCat(e.target.value),
              placeholder:"Nome nuova categoria...",
              style:{flex:1,background:C.bg,border:`1px solid ${C.gold}`,borderRadius:8,color:C.text,fontSize:12,padding:"7px 11px",fontFamily:"'Open Sans',sans-serif"}})
          , React.createElement('button', {onClick:()=>{
              const id="cat_"+Date.now(); const label=nuovaCat.trim();
              if(!label)return;
              const newCat={id,label,hex:C.teal,bg:C.tealBg,bd:C.tealBorder};
              if(onAddCategoria)onAddCategoria(newCat);
              set("categoria",id);
              setNuovaCat(""); setShowAddCat(false);
            }, style:{padding:"7px 14px",borderRadius:8,border:"none",background:C.gold,color:"#ffffff",fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",fontWeight:500}}
            , "Aggiungi"
          )
          , React.createElement('button', {onClick:()=>setShowAddCat(false),
              style:{padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:"none",color:C.textMuted,fontSize:12,cursor:"pointer"}}
            , "✕"
          )
        )
        , React.createElement(Input, { label: "Descrizione *" , value: f.desc, onChange: e=>set("desc",e.target.value), error: err.desc, placeholder: "Es. Bolletta luce gennaio, Spartiti..."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6379}})

        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6381}}
          , React.createElement(Input, { label: "Importo (€) *"  , type: "number", value: f.importo, onChange: e=>set("importo",e.target.value), error: err.importo, placeholder: "0.00", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6382}})
          , React.createElement(Input, { label: "Data *", type: "date", value: f.data, onChange: e=>set("data",e.target.value), error: err.data, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6383}})
          , React.createElement(Sel, { label: "Mese di riferimento"  , value: f.mese, onChange: e=>set("mese",Number(e.target.value)),
            options: MESI.map((m,i)=>({value:i,label:m})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6384}})
          , React.createElement(Input, { label: "Anno", type: "number", value: f.anno, onChange: e=>set("anno",Number(e.target.value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6386}})
        )

        , React.createElement(Sel, { label: "Metodo di pagamento"  , value: f.metodo, onChange: e=>set("metodo",e.target.value), options: METODI_PAG, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6389}})
        , React.createElement(Textarea, { label: "Note", value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note aggiuntive..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6390}})
      )
      , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6392}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6393}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6394}}, React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6394}}), _optionalChain([initial, 'optionalAccess', _56 => _56.id])?"Salva modifiche":"Registra spesa")
      )
    )
  );
};

// ─── VISTA DOCENTE ────────────────────────────────────────────────────────────
const DocenteView = ({ docente, spese, onBack }) => {
  const speseDoc = spese.filter(s=>s.docenteId===docente.id).sort((a,b)=>b.data.localeCompare(a.data));
  const totAnno  = speseDoc.filter(s=>s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0);

  const perMese = MESI.map((m,i)=>({
    mese:m, idx:i,
    spese: speseDoc.filter(s=>s.mese===i&&s.anno===ANNO_ATT),
    tot:   speseDoc.filter(s=>s.mese===i&&s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0),
  })).filter(m=>m.spese.length>0);

  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6412}}
      , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
        border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,marginBottom:20,padding:0,fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6413}}
        , React.createElement(Ic, { n: "left", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6415}}), "Tutti i docenti"
      )

      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:14,marginBottom:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6418}}
        , React.createElement('div', { style: {width:52,height:52,borderRadius:14,background:C.goldBg,border:`2px solid ${C.goldDim}`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6419}}
          , React.createElement(Ic, { n: "user", size: 24, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6421}})
        )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6423}}
          , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6424}}, docente.name)
          , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6425}}, docente.instrument)
        )
        , React.createElement('div', { style: {marginLeft:"auto",textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6427}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6428}}, "Pagato " , ANNO_ATT)
          , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6429}}, fmt(totAnno))
        )
      )

      /* Storico per mese */
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6434}}
        , perMese.length===0 && (
          React.createElement('div', { style: {textAlign:"center",padding:"40px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6436}}, "Nessun compenso registrato"  )
        )
        , perMese.map(m=>(
          React.createElement('div', { key: m.idx, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6439}}
            , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"11px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6440}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6442}}, m.mese, " " , ANNO_ATT)
              , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6443}}, fmt(m.tot))
            )
            , m.spese.map(s=>(
              React.createElement('div', { key: s.id, style: {display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 16px",borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6446}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6448}}
                  , React.createElement('div', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6449}}, s.desc)
                  , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6450}}
                    , new Date(s.data+"T00:00:00").toLocaleDateString("it-IT"), " · "  , s.metodo
                  )
                )
                , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6454}}, fmt(s.importo))
              )
            ))
          )
        ))
      )
    )
  );
};

// ─── REPORT / SALDO NETTO ─────────────────────────────────────────────────────
class ReportErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  componentDidCatch(err) { this.setState({ error: err }); }
  static getDerivedStateFromError(err) { return { error: err }; }
  render() {
    if (this.state.error) {
      return React.createElement('div', {style:{padding:32,textAlign:"center",color:"#f87171",fontFamily:"'Open Sans',sans-serif"}},
        React.createElement('div', {style:{fontSize:32,marginBottom:12}}, "⚠"),
        React.createElement('div', {style:{fontWeight:600,marginBottom:6,fontSize:15}}, "Errore nel Report"),
        React.createElement('div', {style:{fontSize:12,color:"#888",marginBottom:16}}, String(this.state.error.message||this.state.error)),
        React.createElement('button', {onClick:()=>this.setState({error:null}),
          style:{padding:"8px 18px",borderRadius:8,border:"1px solid #f87171",
            background:"transparent",color:"#f87171",cursor:"pointer",fontSize:13}}, "Riprova")
      );
    }
    return this.props.children;
  }
}

const ReportView = ({ spese, entrate }) => {
  const [anno, setAnno] = useState(ANNO_ATT);

  const speseAnno    = spese.filter(s=>s.anno===anno);
  const entrateAnno  = entrate.filter(e=>e.anno===anno);

  const totUscite  = speseAnno.reduce((t,s)=>t+s.importo,0);
  const totEntrate = entrateAnno.reduce((t,e)=>t+e.importo,0);
  const saldo      = totEntrate - totUscite;

  // Per categoria
  const perCat = CATEGORIE_DEFAULT.map(c=>({
    ...c,
    tot: speseAnno.filter(s=>s.categoria===c.id).reduce((t,s)=>t+s.importo,0),
    n:   speseAnno.filter(s=>s.categoria===c.id).length,
  })).filter(c=>c.tot>0).sort((a,b)=>b.tot-a.tot);

  // Per mese (entrate vs uscite)
  const datiMesi = MESI.map((m,i)=>({
    mese:m,
    uscite:  speseAnno.filter(s=>s.mese===i).reduce((t,s)=>t+s.importo,0),
    entrate: entrateAnno.filter(e=>e.mese===(i+1)).reduce((t,e)=>t+e.importo,0),
  }));
  const maxVal = Math.max(...datiMesi.flatMap(d=>[d.uscite,d.entrate]),1);

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6491}}

      /* Header */
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6494}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6495}}
          , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6496}}, "Report & saldo netto"   )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:13,marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6497}}, "Anno " , anno)
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6499}}
          , React.createElement('button', { onClick: ()=>setAnno(p=>p-1), style: {background:C.surface,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.textMuted,padding:"7px 10px",cursor:"pointer",display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6500}}
            , React.createElement(Ic, { n: "left", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6502}})
          )
          , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,minWidth:60,textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6504}}, anno)
          , React.createElement('button', { onClick: ()=>setAnno(p=>p+1), style: {background:C.surface,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.textMuted,padding:"7px 10px",cursor:"pointer",display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6505}}
            , React.createElement(Ic, { n: "right", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6507}})
          )
        )
      )

      /* KPI saldo */
      , React.createElement('div', { className: "stat-strip-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6513}}
        , [
          {label:"Entrate totali",  val:fmt(totEntrate), hex:C.green, icon:"arrow_up"},
          {label:"Uscite totali",   val:fmt(totUscite),  hex:C.red,   icon:"arrow_dn"},
          {label:"Saldo netto",     val:fmt(saldo),      hex:saldo>=0?C.green:C.red, icon:saldo>=0?"arrow_up":"arrow_dn"},
        ].map(k=>(
          React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${k.hex}30`,borderRadius:12,padding:"18px 20px",
            borderLeft:`4px solid ${k.hex}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6519}}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6521}}
              , React.createElement(Ic, { n: k.icon, size: 14, stroke: k.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6522}})
              , React.createElement('span', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6523}}, k.label)
            )
            , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,color:k.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6525}}, k.val)
          )
        ))
      )

      /* Grafico entrate vs uscite */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6531}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6532}}
          , React.createElement('span', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6533}}, "Entrate vs Uscite mensili"   )
          , React.createElement('div', { style: {display:"flex",gap:12,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6534}}
            , [{lbl:"Entrate",hex:C.green},{lbl:"Uscite",hex:C.red}].map(l=>(
              React.createElement('div', { key: l.lbl, style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6536}}
                , React.createElement('div', { style: {width:10,height:10,borderRadius:2,background:l.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6537}})
                , React.createElement('span', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6538}}, l.lbl)
              )
            ))
          )
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:130}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6543}}
          , datiMesi.map((d,i)=>{
            const hE = maxVal>0?Math.max((d.entrate/maxVal)*120,d.entrate>0?3:0):0;
            const hU = maxVal>0?Math.max((d.uscite/maxVal)*120,d.uscite>0?3:0):0;
            const isCur = i===MESE_ATT&&anno===ANNO_ATT;
            return (
              React.createElement('div', { key: i, style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6549}}
                , React.createElement('div', { style: {display:"flex",gap:2,alignItems:"flex-end",width:"100%",justifyContent:"center",height:126}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6550}}
                  , React.createElement('div', { title: `Entrate: ${fmt(d.entrate)}`, style: {flex:1,height:hE,borderRadius:"3px 3px 0 0",
                    background:isCur?C.green:`${C.green}55`,transition:"height 0.3s",minHeight:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6551}})
                  , React.createElement('div', { title: `Uscite: ${fmt(d.uscite)}`, style: {flex:1,height:hU,borderRadius:"3px 3px 0 0",
                    background:isCur?C.red:`${C.red}55`,transition:"height 0.3s",minHeight:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6553}})
                )
                , React.createElement('div', { style: {fontSize:9,color:isCur?C.gold:C.textDim,letterSpacing:"0.04em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6556}}
                  , d.mese.slice(0,3).toUpperCase()
                )
              )
            );
          })
        )
      )

      /* Breakdown per categoria */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6566}}
        , React.createElement('div', { style: {padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6567}}
          , React.createElement(Ic, { n: "tag", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6568}})
          , React.createElement('span', { style: {fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6569}}, "Uscite per categoria"  )
        )
        , perCat.length===0?(
          React.createElement('div', { style: {padding:"30px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6572}}, "Nessuna spesa registrata"  )
        ):(
          React.createElement('div', { style: {padding:"12px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6574}}
            , perCat.map(c=>{
              const pct = totUscite>0?(c.tot/totUscite*100):0;
              return (
                React.createElement('div', { key: c.id, style: {padding:"10px 20px",display:"flex",alignItems:"center",gap:14,
                  transition:"background 0.1s"},
                  onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                  onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6578}}
                  /* Dot categoria */
                  , React.createElement('div', { style: {width:10,height:10,borderRadius:"50%",background:c.hex,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6583}})
                  /* Nome */
                  , React.createElement('div', { style: {width:160,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6585}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6586}}, c.label)
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6587}}, c.n, " voc" , c.n===1?"e":"i")
                  )
                  /* Barra */
                  , React.createElement('div', { style: {flex:1,height:8,background:C.border,borderRadius:4,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6590}}
                    , React.createElement('div', { style: {height:"100%",width:`${pct}%`,background:c.hex,borderRadius:4,transition:"width 0.4s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6591}})
                  )
                  /* % e importo */
                  , React.createElement('div', { style: {textAlign:"right",flexShrink:0,minWidth:100}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6594}}
                    , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:600,color:c.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6595}}, fmt(c.tot))
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6596}}, pct.toFixed(1), "%")
                  )
                )
              );
            })
          )
        )
      )

      /* Tabella mensile dettagliata */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6606}}
        , React.createElement('div', { style: {padding:"13px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6607}}
          , React.createElement('span', { style: {fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6608}}, "Dettaglio mensile" )
        )
        , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6610}}
          , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6611}}
            , React.createElement('tr', { style: {background:C.bg,borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6612}}
              , ["Mese","Entrate","Uscite","Saldo"].map(h=>(
                React.createElement('th', { key: h, style: {padding:"9px 16px",textAlign:"left",fontSize:10,
                  letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6614}}, h)
              ))
            )
          )
          , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6619}}
            , datiMesi.map((d,i)=>{
              const sl = d.entrate - d.uscite;
              const isCur = i===MESE_ATT&&anno===ANNO_ATT;
              return (
                React.createElement('tr', { key: i, style: {borderBottom:`1px solid ${C.border}20`,
                  background:isCur?C.goldBg:"transparent",transition:"background 0.1s"},
                  onMouseEnter: e=>{if(!isCur)e.currentTarget.style.background=C.surfaceHover;},
                  onMouseLeave: e=>{if(!isCur)e.currentTarget.style.background="transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6624}}
                  , React.createElement('td', { style: {padding:"10px 16px",fontSize:13,fontWeight:isCur?600:400,color:isCur?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6628}}, d.mese)
                  , React.createElement('td', { style: {padding:"10px 16px",fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,color:d.entrate>0?C.green:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6629}}, d.entrate>0?fmt(d.entrate):"—")
                  , React.createElement('td', { style: {padding:"10px 16px",fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,color:d.uscite>0?C.red:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6630}}, d.uscite>0?fmt(d.uscite):"—")
                  , React.createElement('td', { style: {padding:"10px 16px",fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,
                    color:sl>0?C.green:sl<0?C.red:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6631}}, (d.entrate>0||d.uscite>0)?fmt(sl):"—")
                )
              );
            })
            , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6636}}
              , React.createElement('td', { style: {padding:"12px 16px",fontWeight:600,color:C.gold,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6637}}, "Totale " , anno)
              , React.createElement('td', { style: {padding:"12px 16px",fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6638}}, fmt(totEntrate))
              , React.createElement('td', { style: {padding:"12px 16px",fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6639}}, fmt(totUscite))
              , React.createElement('td', { style: {padding:"12px 16px",fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:saldo>=0?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6640}}, fmt(saldo))
            )
          )
        )
      )
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// APP PRINCIPALE
// ════════════════════════════════════════════════════════════════════════════════

// ─── FORM QUOTA ──────────────────────────────────────────────────────────────
const CAT_ENTRATE_DEFAULT = [
  { id:"quota",        label:"Quota mensile",     icon:"receipt", student:true  },
  { id:"iscrizione",   label:"Iscrizione annuale", icon:"star",    student:true  },
  { id:"concerto",     label:"Concerto",           icon:"music",   student:false },
  { id:"evento",       label:"Evento / Saggio",    icon:"calendar",student:false },
  { id:"altro",        label:"Altro",              icon:"plus",    student:false },
];

const EntrataForm = ({ students, initial, onSave, onClose, categorie:_catEntrForm, onAddCategoriaEntr }) => {
  const [nuovaCatE, setNuovaCatE] = React.useState("");
  const [showAddCatE, setShowAddCatE] = React.useState(false);
  const MESI_ALL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
                    "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const [f, setF] = useState(initial || {
    categoria: "quota",
    studentId: "", importo: "", mese: new Date().getMonth()+1,
    anno: new Date().getFullYear(), data: yyyymmdd(today),
    metodo: "Bonifico bancario", desc: "", note: "",
    stato: "pagato",  // default: registrare un'entrata = già pagata
  });
  const [err, setErr] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const CAT_ENTRATE_USE = _catEntrForm || CAT_ENTRATE_DEFAULT;
  const catObj     = CAT_ENTRATE_USE.find(c=>c.id===f.categoria)||CAT_ENTRATE_USE[0];
  const needStudent = catObj.student;
  const selStudent  = needStudent ? students.find(s=>s.id===Number(f.studentId)) : null;

  const handleStudentChange = (e) => {
    const s = students.find(st=>st.id===Number(e.target.value));
    set("studentId", e.target.value);
    if(s && f.categoria==="quota") set("importo", s.monthlyFee);
    if(s && f.categoria==="iscrizione") set("importo", s.monthlyFee * 2);
  };

  const validate = () => {
    const e = {};
    if(needStudent && !f.studentId) e.studentId = "Seleziona un allievo";
    if(!f.importo||isNaN(f.importo)||Number(f.importo)<=0) e.importo = "Importo non valido";
    if(!f.data)                     e.data      = "Data obbligatoria";
    if(!needStudent && !f.desc.trim()) e.desc   = "Descrizione obbligatoria";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if(Object.keys(e).length){ setErr(e); return; }
    const s = needStudent ? students.find(st=>st.id===Number(f.studentId)) : null;
    const nomeMese = MESI_ALL[f.mese-1];
    const autoDesc = f.categoria==="quota"
      ? `Quota mensile ${nomeMese} ${f.anno}${s?` — ${s.name}`:""}`
      : f.categoria==="iscrizione"
      ? `Iscrizione ${f.anno}/${Number(f.anno)+1}${s?` — ${s.name}`:""}`
      : f.desc;
    onSave({
      ...f,
      studentId:    needStudent ? Number(f.studentId) : null,
      studentName:  _optionalChain([s, 'optionalAccess', _57 => _57.name]) || "",
      importo:      Number(f.importo),
      mese:         Number(f.mese),
      anno:         Number(f.anno),
      desc:         autoDesc || f.desc,
      stato:        f.stato || 'pagato',
      dataPagamento: f.data || f.dataPagamento || '',
    });
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22,display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6717}}
        /* Categoria */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6719}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6720}}, "Categoria *" )
          , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6721}}
            , [...CAT_ENTRATE_USE,...(!showAddCatE?[{id:"__new__e__",label:"+ Nuova",icon:"plus",student:false}]:[])].map(c=>{
              const isS=f.categoria===c.id;
              return (
                React.createElement('button', { key: c.id, onClick: ()=>{if(c.id==="__new__e__"){setShowAddCatE(true);return;} set("categoria",c.id); if(!c.student){set("studentId","");}},
                  style: {display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:20,
                    border:`2px solid ${isS?C.green:C.border}`,background:isS?C.greenBg:C.bg,
                    color:isS?C.green:C.textMuted,cursor:"pointer",fontSize:12,
                    fontFamily:"'Open Sans',sans-serif",fontWeight:isS?600:400,transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6725}}
                  , React.createElement(Ic, { n: c.icon||"plus", size: 12, stroke: isS?C.green:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6730}})
                  , c.label
                )
              );
            })
          )
          , showAddCatE && React.createElement('div', {style:{display:"flex",gap:8,alignItems:"center",marginTop:8}}
            , React.createElement('input', {autoFocus:true, value:nuovaCatE, onChange:e=>setNuovaCatE(e.target.value),
                placeholder:"Nome nuova categoria entrate...",
                style:{flex:1,background:C.bg,border:`1px solid ${C.green}`,borderRadius:8,color:C.text,fontSize:12,padding:"7px 11px",fontFamily:"'Open Sans',sans-serif"}})
            , React.createElement('button', {onClick:()=>{
                const id="cate_"+Date.now(); const label=nuovaCatE.trim();
                if(!label)return;
                const newCat={id,label,icon:"euro",student:false};
                if(onAddCategoriaEntr)onAddCategoriaEntr(newCat);
                set("categoria",id); setNuovaCatE(""); setShowAddCatE(false);
              }, style:{padding:"7px 14px",borderRadius:8,border:"none",background:C.gold,color:"#ffffff",fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",fontWeight:500}}
              , "Aggiungi"
            )
            , React.createElement('button', {onClick:()=>setShowAddCatE(false),
                style:{padding:"7px 10px",borderRadius:8,border:`1px solid ${C.border}`,background:"none",color:C.textMuted,fontSize:12,cursor:"pointer"}}
              , "✕"
            )
          )
        )

        /* Allievo (solo per categorie che lo richiedono) */
        , needStudent && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6740}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6741}}, "Allievo *" )
            , React.createElement('select', { value: f.studentId, onChange: handleStudentChange,
              style: {width:"100%",background:C.surface,border:`1px solid ${err.studentId?C.red:C.border}`,borderRadius:8,
                color:f.studentId?C.text:C.textMuted,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6742}}
              , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6745}}, "— seleziona allievo —"   )
              , students.filter(s=>s.status==="attivo").map(s=>(
                React.createElement('option', { key: s.id, value: s.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6747}}, s.name, " (" , s.instrument, ")")
              ))
            )
            , err.studentId && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6750}}, err.studentId)
          )
        )

        , selStudent && (
          React.createElement('div', { style: {padding:"10px 14px",background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:8,
            display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6755}}
            , React.createElement('span', { style: {fontSize:12,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6757}}
              , f.categoria==="quota"?"Quota mensile prevista":"Importo suggerito"
            )
            , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6760}}, "€"
              , f.categoria==="quota"?selStudent.monthlyFee:selStudent.monthlyFee*2, " / "  , f.categoria==="quota"?"mese":"anno"
            )
          )
        )

        /* Descrizione (per categorie senza allievo o Altro) */
        , (!needStudent || f.categoria==="altro") && (
          React.createElement(Input, { label: "Descrizione *" , value: f.desc, onChange: e=>set("desc",e.target.value),
            error: err.desc, placeholder: `Es. ${catObj.label}…`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6768}})
        )

        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6772}}
          , (f.categoria==="quota" || f.categoria==="iscrizione") && (
            React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6774}}
              , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6775}}, "Mese di riferimento"  )
              , React.createElement('select', { value: f.mese, onChange: e=>set("mese",Number(e.target.value)),
                style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                  color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6776}}
                , MESI_ALL.map((m,i)=>React.createElement('option', { key: i+1, value: i+1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6779}}, m))
              )
            )
          )
          , React.createElement(Input, { label: "Anno", type: "number", value: f.anno, onChange: e=>set("anno",Number(e.target.value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6783}})
          , React.createElement(Input, { label: "Importo (€) *"  , type: "number", value: f.importo, onChange: e=>set("importo",e.target.value), error: err.importo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6784}})
          , React.createElement(Input, { label: "Data *" , type: "date", value: f.data, onChange: e=>set("data",e.target.value), error: err.data, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6785}})
        )
        , React.createElement(Sel, { label: "Metodo di pagamento"  , value: f.metodo, onChange: e=>set("metodo",e.target.value), options: METODI_PAG, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6787}})
        , React.createElement('div', null
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}, "Stato pagamento")
          , React.createElement('div', {style:{display:"flex",gap:8}}
            , [
                {v:"pagato",   label:"✅ Pagato",     bg:C.greenBg,  bd:C.greenBorder,  fg:C.green},
                {v:"attesa",   label:"⏳ In attesa",  bg:"rgba(245,158,11,0.1)", bd:"rgba(245,158,11,0.35)", fg:"#b45309"},
                {v:"ritardo",  label:"⚠️ In ritardo", bg:C.redBg,    bd:C.redBorder,    fg:C.red},
              ].map(opt => {
                const sel = (f.stato||"pagato") === opt.v;
                return React.createElement('button', {key:opt.v, type:"button",
                    onClick:()=>set("stato",opt.v),
                    style:{flex:1,padding:"8px 10px",borderRadius:8,border:`2px solid ${sel?opt.bd:C.border}`,
                      background:sel?opt.bg:C.bg,color:sel?opt.fg:C.textMuted,
                      cursor:"pointer",fontSize:12,fontFamily:"'Open Sans',sans-serif",fontWeight:sel?600:400,transition:"all .12s"}}
                  , opt.label
                );
              })
          )
        )
        , React.createElement(Textarea, { label: "Note", value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note aggiuntive..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6788}})
      )
      , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6790}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6791}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6792}}, React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6792}}), _optionalChain([initial, 'optionalAccess', _58 => _58.id])?"Salva modifiche":"Registra entrata")
      )
    )
  );
};

// Navbar interna alla Contabilità
const Navbar = ({ tab, setTab, onSelDoc, onSetModal, onSetModalQuota, ruoloCV }) => (
  React.createElement('div', { style: {background:C.surface, borderBottom:`1px solid ${C.border}`,
    padding:"0 16px", display:"flex", alignItems:"center", gap:4, flexShrink:0, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6800}}
    , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,paddingRight:20,marginRight:8,
      borderRight:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6802}}
      , React.createElement(Ic, { n: "euro", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6804}})
      , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:14,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6805}}, "Contabilità")
    )
    , [
      {id:"spese",   label:"Uscite",   icon:"down"},
      {id:"entrate", label:"Entrate",  icon:"up"},
      {id:"report",  label:"Report",   icon:"chart"},
    ].filter(t => {
      if(ruoloCV==="allievo") return t.id==="entrate";
      if(ruoloCV==="docente") return t.id==="spese";
      return true;
    }).map(t=>(
      React.createElement('button', { key: t.id, onClick: ()=>{ setTab(t.id); _optionalChain([onSelDoc, 'optionalCall', _59 => _59()]); },
        style: {display:"flex",alignItems:"center",gap:6,padding:"0 16px",
          alignSelf:"stretch",background:"none",border:"none",
          borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
          color:tab===t.id?C.gold:C.textMuted,cursor:"pointer",
          fontSize:13,fontFamily:"'Open Sans',sans-serif",transition:"all 0.15s",
          minHeight:48}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6813}}
        , React.createElement(Ic, { n: t.icon, size: 13, stroke: tab===t.id?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6820}}), t.label
      )
    ))
    , React.createElement('div', { style: {marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6823}}
      , React.createElement(RefreshBtn)
      , tab==="entrate"  && onSetModalQuota && (
        React.createElement(Btn, { small: true, onClick: onSetModalQuota, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6825}}, React.createElement(Ic, { n: "plus", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6825}}), "Nuova entrata" )
      )
      , tab==="spese"  && onSetModal && (
        React.createElement(Btn, { small: true, onClick: onSetModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6828}}, React.createElement(Ic, { n: "plus", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6828}}), "Registra spesa" )
      )
    )
  )
);

const ContabilitaView = ({ students:propStudents, entrate:propEntrate, setEntrate:propSetEntrate, spese:propSpese, setSpese:propSetSpese, config:propConfig, setConfig:propSetConfig, docenti:propDocentiCV, quickAction, clearQuickAction, userRuolo:_ruoloCV, appUser:_appUserCV }) => {
  const ruoloCV = _ruoloCV || "admin";
  const _loginNomeCV = (_appUserCV && _appUserCV.nome) || "";
  const myDocIdCV = ruoloCV==="docente"
    ? ((_appUserCV && _appUserCV.docenteId)
        || (()=>{ const d=(propDocentiCV||[]).find(x=>x.teacherKey===_loginNomeCV||(x.nome||"").toLowerCase().includes(_loginNomeCV.toLowerCase())); return d?d.id:null; })())
    : null;
  const [catSpese,   setCatSpese]   = useState(CATEGORIE_DEFAULT);
  const [catEntrate, setCatEntrate] = useState(CAT_ENTRATE_DEFAULT);
  // Handle quick action from dashboard
  React.useEffect(()=>{
    if(quickAction==="addEntrata"){ setTab("entrate"); setModal("addq"); if(clearQuickAction)clearQuickAction(); }
    else if(quickAction==="addSpesa"){ setTab("spese"); setModal("add"); if(clearQuickAction)clearQuickAction(); }
  },[quickAction]);
  const isMobile = useIsMobile();
  const [_entrate, _setEntrate] = useState(INIT_ENTRATE_QUOTE);
  const entrate    = _nullishCoalesce(propEntrate, () => ( _entrate));
  const setEntrate = _nullishCoalesce(propSetEntrate, () => ( _setEntrate));
  const students   = _nullishCoalesce(propStudents, () => ( []));
  const config     = _nullishCoalesce(propConfig, () => ( CONFIG_DEFAULT));
  const setConfig  = _nullishCoalesce(propSetConfig, () => ( (()=>{})));
  const [_speseLocal, _setSpeseLocal] = useState(INIT_SPESE);
  const spese    = propSpese    || _speseLocal;
  const setSpese = propSetSpese || _setSpeseLocal;
    const [tab,      setTab]      = useState(ruoloCV==="allievo"?"entrate":"spese");
    const [modal,    setModal]    = useState(null);
    const [selSpesa, setSelSpesa] = useState(null);
    const [selQuota, setSelQuota] = useState(null);
    const [selDoc,   setSelDoc]   = useState(null);
    const [search,   setSearch]   = useState("");
    const [filterCat,setFCat]     = useState("");
    const [filterMese,setFMese]   = useState("");
    const [searchQ,  setSearchQ]  = useState("");
    const [filterQMese,setFQMese] = useState("");
  
    const closeModal = () => { setModal(null); setSelSpesa(null); setSelQuota(null); };
    const handleAdd    = d => { setSpese(p=>[...p,{...d,id:uid()}]); closeModal(); };
    const handleEdit   = d => { setSpese(p=>p.map(x=>x.id===d.id?{...x,...d}:x)); closeModal(); };
    const handleDel    = () => { setSpese(p=>p.filter(x=>x.id!==_optionalChain([selSpesa, 'optionalAccess', _60 => _60.id]))); closeModal(); };
    const handleAddQ   = d => {
      const anno = d.anno || new Date().getFullYear();
      const progressivo = config.progressivoRicevute || 1;
      const numRicevuta = String(progressivo).padStart(3,"0") + "/" + anno;
      // Normalizza: il form usa 'data', toDB.quote usa 'dataPagamento'
      const dataPagamento = d.dataPagamento || d.data || '';
      setEntrate(p=>[...p,{...d, id:uid(), numRicevuta, dataPagamento}]);
      setConfig(p=>({...p, progressivoRicevute: progressivo + 1}));
      closeModal();
    };
    const handleEditQ  = d => { setEntrate(p=>p.map(x=>x.id===d.id?{...x,...d, dataPagamento: d.data||d.dataPagamento||x.dataPagamento}:x)); closeModal(); };
    const handleDelQ   = () => { setEntrate(p=>p.filter(x=>x.id!==_optionalChain([selQuota, 'optionalAccess', _61 => _61.id]))); closeModal(); };
  
    // Stats ribbon
    const MESE_C = new Date().getMonth()+1; // 1-indexed
    const totMese    = spese.filter(s=>s.mese===MESE_ATT&&s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0);
    const totAnno    = spese.filter(s=>s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0);
    const totDocAnno = spese.filter(s=>s.anno===ANNO_ATT&&s.categoria==="docenti").reduce((t,s)=>t+s.importo,0);
    const totQuoteAnno = entrate.filter(e=>e.anno===ANNO_ATT||(e.anno===ANNO_ATT-1&&e.mese>=9)).reduce((t,e)=>t+e.importo,0);
    const totQuoteMese = entrate.filter(e=>e.mese===MESE_C&&e.anno===new Date().getFullYear()).reduce((t,e)=>t+e.importo,0);
  
    // Spese filtrate — docente vede solo le proprie, allievo non vede uscite
    const [sortKeySp, sortDirSp, handleSortSp, sortFnSp] = useSortable("data", "desc");
    const filteredRaw = spese.filter(s=>{
      const q=search.toLowerCase();
      if(ruoloCV==="allievo") return false;
      if(ruoloCV==="docente") return myDocIdCV ? String(s.docenteId)===String(myDocIdCV) : false;
      return s.anno===ANNO_ATT
        &&(!q||s.desc.toLowerCase().includes(q)||(s.note||"").toLowerCase().includes(q))
        &&(!filterCat||s.categoria===filterCat)
        &&(!filterMese||s.mese===Number(filterMese));
    });
    const filtered = sortFnSp(filteredRaw, (s,k) => {
      if(k==="data")        return s.data||"";
      if(k==="desc")        return s.desc||"";
      if(k==="categoria")   return s.categoria||"";
      if(k==="importo")     return Number(s.importo)||0;
      if(k==="mese")        return Number(s.mese)||0;
      return s[k]||"";
    });
  
    // Aggregato docenti
    const docenteStats = useMemo(()=>DOCENTI.map(d=>({
      ...d,
      totAnno: spese.filter(s=>s.docenteId===d.id&&s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0),
      ultimoPag: _optionalChain([spese, 'access', _62 => _62.filter, 'call', _63 => _63(s=>s.docenteId===d.id), 'access', _64 => _64.sort, 'call', _65 => _65((a,b)=>b.data.localeCompare(a.data)), 'access', _66 => _66[0], 'optionalAccess', _67 => _67.data])||null,
    })),[spese]);
  
    // Vista dettaglio docente
    if(selDoc) {
      const d = DOCENTI.find(x=>x.id===selDoc);
      return (
        React.createElement(React.Fragment, null
          , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6898}}, G)
          , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6899}}
            , React.createElement(Navbar, { tab: tab, setTab: setTab, onSelDoc: ()=>setSelDoc(null), onSetModalQuota: ruoloCV==="admin"?()=>setModal('addq'):undefined, ruoloCV: ruoloCV, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6900}})
            , React.createElement('div', { style: {flex:1,padding:24,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6901}}
              , React.createElement(DocenteView, { docente: d, spese: spese, onBack: ()=>setSelDoc(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6902}})
            )
          )
        )
      );
    }
  
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6911}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6912}}
          , React.createElement(Navbar, { tab: tab, setTab: t=>{ setTab(t); setSelDoc(null); }, onSetModal: ruoloCV==="admin"?()=>setModal("add"):undefined, onSetModalQuota: ruoloCV==="admin"?()=>setModal('addq'):undefined, ruoloCV: ruoloCV, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6913}})

          /* Stats ribbon — solo admin */
          , ruoloCV==="admin" && React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"10px 24px",display:"flex",gap:0,flexShrink:0,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6916}}
            , [
              {label:"Entrate (a.s.)",  val:fmt(totQuoteAnno), hex:C.green},
              {label:"Entrate mese",      val:fmt(totQuoteMese), hex:C.green,  opacity:0.7},
              {label:`Uscite totali ${ANNO_ATT}`,val:fmt(totAnno),      hex:C.red},
              {label:"Compensi docenti",         val:fmt(totDocAnno),   hex:C.gold},
            ].map((s,i)=>(
              React.createElement('div', { key: s.label, style: {display:"flex",alignItems:"center",gap:10,paddingRight:24,marginRight:i<3?24:0,
                borderRight:i<3?`1px solid ${C.border}`:"none",opacity:s.opacity||1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6924}}
                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6926}}, s.val)
                , React.createElement('div', { style: {fontSize:10,color:s.hex,opacity:0.8,textTransform:"uppercase",letterSpacing:"0.06em",maxWidth:90,lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6927}}, s.label)
              )
            ))
            , React.createElement('div', { style: {marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6930}})
          )

          , React.createElement('div', { style: {flex:1,padding:24,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6933}}

            /* TAB SPESE */
            , tab==="spese" && (
              React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6937}}

                /* Banner info per docente */
                , ruoloCV==="docente" && React.createElement('div', { style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}
                  , React.createElement(Ic, {n:"info",size:15,stroke:C.gold})
                  , React.createElement('span', {style:{fontSize:13,color:C.gold}}, "Stai visualizzando solo le tue competenze registrate.")
                )

                /* Filtri per admin */
                , ruoloCV==="admin" && React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6940}}
                  , React.createElement('div', { style: {position:"relative",flex:"1 1 200px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6941}}
                    , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6942}}
                      , React.createElement(Ic, { n: "search", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6943}})
                    )
                    , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
                      placeholder: "Cerca spesa..." ,
                      style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.text,fontSize:13,padding:"9px 12px 9px 36px",fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6945}})
                  )
                  , React.createElement('select', { value: filterCat, onChange: e=>setFCat(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterCat?C.goldDim:C.border}`,borderRadius:8,
                      color:filterCat?C.gold:C.textMuted,fontSize:13,padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6950}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6953}}, "Tutte le categorie"  )
                    , catSpese.map(c=>React.createElement('option', { key: c.id, value: c.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6954}}, c.label))
                  )
                  , React.createElement('select', { value: filterMese, onChange: e=>setFMese(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterMese?C.goldDim:C.border}`,borderRadius:8,
                      color:filterMese?C.gold:C.textMuted,fontSize:13,padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6956}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6959}}, "Tutti i mesi"  )
                    , MESI.map((m,i)=>React.createElement('option', { key: i, value: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6960}}, m))
                  )
                  , (search||filterCat||filterMese)&&(
                    React.createElement('button', { onClick: ()=>{setSearch("");setFCat("");setFMese("");},
                      style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,
                        fontSize:12,padding:"9px 12px",cursor:"pointer",fontFamily:"'Open Sans',sans-serif",
                        display:"flex",alignItems:"center",gap:5},
                      onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                      onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6963}}
                      , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6969}}), "Azzera"
                    )
                  )
                  , React.createElement('span', { style: {fontSize:12,color:C.textDim,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6972}}, filtered.length, " voci" )
                )

                /* Lista spese */
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6976}}
                  , React.createElement('div', { style: {overflowX:"auto",WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6977}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"auto 2fr 1fr 1fr 1fr auto",minWidth:520,
                    padding:"9px 18px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6978}}
                    , React.createElement('div', {style:{fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}, "Cat.")
                    , React.createElement('div', {onClick:()=>handleSortSp("desc"), style:{fontSize:10,color:sortKeySp==="desc"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Descrizione", React.createElement('span',{style:{opacity:sortKeySp==="desc"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="desc"?"▲":"▼"))
                    , React.createElement('div', {onClick:()=>handleSortSp("mese"),  style:{fontSize:10,color:sortKeySp==="mese"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Mese",   React.createElement('span',{style:{opacity:sortKeySp==="mese"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="mese"?"▲":"▼"))
                    , React.createElement('div', {style:{fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}, "Metodo")
                    , React.createElement('div', {onClick:()=>handleSortSp("importo"),style:{fontSize:10,color:sortKeySp==="importo"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Importo", React.createElement('span',{style:{opacity:sortKeySp==="importo"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="importo"?"▲":"▼"))
                    , React.createElement('div', {style:{fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}, "")
                  )
                  , filtered.length===0?(
                    React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6985}}, "Nessuna spesa trovata"  )
                  ):filtered.map((s,i)=>{
                    const cat = catById(s.categoria);
                    const doc = s.docenteId?DOCENTI.find(d=>d.id===s.docenteId):null;
                    return (
                      React.createElement('div', { key: s.id, style: {display:"grid",gridTemplateColumns:"auto 2fr 1fr 1fr 1fr auto",minWidth:520,
                        padding:"12px 18px",borderBottom:i<filtered.length-1?`1px solid ${C.border}20`:"none",
                        alignItems:"center",transition:"background 0.1s"},
                        onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                        onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6990}}
                        /* Badge categoria */
                        , React.createElement('div', { style: {marginRight:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6996}}
                          , React.createElement('span', { style: {display:"inline-block",width:9,height:9,borderRadius:"50%",background:cat.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6997}})
                        )
                        /* Descrizione */
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7000}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7001}}, s.desc)
                          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7002}}
                            , new Date(s.data+"T00:00:00").toLocaleDateString("it-IT")
                            , doc && React.createElement(React.Fragment, null, " · "  , React.createElement('span', { style: {color:cat.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7004}}, doc.name))
                            , s.note && React.createElement(React.Fragment, null, " · "  , s.note)
                          )
                        )
                        /* Mese */
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7009}}, MESI[s.mese])
                        /* Metodo */
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7011}}, s.metodo)
                        /* Importo */
                        , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:17,fontWeight:600,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7013}}, fmt(s.importo))
                        /* Azioni — solo admin */
                        , ruoloCV==="admin" && React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7015}}
                          , React.createElement('button', { onClick: ()=>{setSelSpesa(s);setModal("edit");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: e=>e.currentTarget.style.color=C.gold,
                            onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7016}}
                            , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7020}})
                          )
                          , React.createElement('button', { onClick: ()=>{setSelSpesa(s);setModal("delete");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: e=>e.currentTarget.style.color=C.red,
                            onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7022}}
                            , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7026}})
                          )
                        )
                      )
                    );
                  })
                  )
                )
              )
            )

                        , tab==="entrate" && (() => {
              const MESI_ALL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
              const curY = new Date().getFullYear(), curM = new Date().getMonth()+1;
              const qFiltrate = sortFnSp(entrate
                .filter(e=>{
                  const q = searchQ.toLowerCase();
                  // docente non vede le entrate (quote degli allievi — dati contabili riservati)
                  if(ruoloCV==="docente") return false;
                  // allievo vede solo i propri pagamenti
                  if(ruoloCV==="allievo"){
                    const myId = (_appUserCV&&_appUserCV.allievoId)||null;
                    const myName = (_appUserCV&&_appUserCV.nome)||(typeof window!=="undefined"&&window.__currentUserName__)||"";
                    if(myId) return String(e.studentId)===String(myId);
                    return myName ? (e.studentName||"").toLowerCase().includes(myName.toLowerCase()) : true;
                  }
                  return (!q||((e.studentName||"").toLowerCase().includes(q)||(e.desc||"").toLowerCase().includes(q)))
                    && (!filterQMese||Number(filterQMese)===e.mese);
                }), (e,k) => {
                  if(k==="data")        return e.data||"";
                  if(k==="desc")        return e.desc||e.studentName||"";
                  if(k==="importo")     return Number(e.importo)||0;
                  if(k==="mese")        return Number(e.mese)||0;
                  if(k==="metodo")      return e.metodo||"";
                  if(k==="categoria")   return e.categoria||"";
                  return e[k]||"";
                });
              const totQFiltrate = qFiltrate.reduce((t,e)=>t+e.importo,0);

              // Riepilogo per allievo (usato in tabella studenti)
              const stSummary = students.map(s=>{
                const pagamenti = entrate.filter(e=>e.studentId===s.id);
                const totPag    = pagamenti.reduce((t,e)=>t+e.importo,0);
                const ultPag    = pagamenti.sort((a,b)=>(b.data||'').localeCompare(a.data||''))[0];
                return {...s, totPag, ultPag:_optionalChain([ultPag, 'optionalAccess', _68 => _68.data])||null, nPagamenti:pagamenti.length};
              });

              return (
                React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7099}}
                  /* Riepilogo per allievo */
                  
                  /* Lista pagamenti filtrata */
                  , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7141}}
                    , React.createElement('div', { style: {position:"relative",flex:"1 1 200px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7142}}
                      , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7143}}, React.createElement(Ic, { n: "search", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7143}}))
                      , React.createElement('input', { value: searchQ, onChange: e=>setSearchQ(e.target.value), placeholder: "Cerca descrizione, allievo..."  ,
                        style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                          color:C.text,fontSize:13,padding:"9px 12px 9px 36px",fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7144}})
                    )
                    , React.createElement('select', { value: filterQMese, onChange: e=>setFQMese(e.target.value),
                      style: {background:C.surface,border:`1px solid ${filterQMese?C.goldDim:C.border}`,borderRadius:8,
                        color:filterQMese?C.gold:C.textMuted,fontSize:13,padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7148}}
                      , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7151}}, "Tutti i mesi"  )
                      , MESI_ALL.map((m,i)=>React.createElement('option', { key: i+1, value: i+1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7152}}, m))
                    )
                    , (searchQ||filterQMese)&&(
                      React.createElement('button', { onClick: ()=>{setSearchQ("");setFQMese("");},
                        style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,fontSize:12,padding:"9px 12px",
                          cursor:"pointer",fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:5},
                        onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                        onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7155}}
                        , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7160}}), "Azzera"
                      )
                    )
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7163}}, qFiltrate.length, " entrate · "   , fmt(totQFiltrate))
                  )

                  , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7166}}
                    , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 100px auto",minWidth:480,
                      padding:"9px 18px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7167}}
                      , React.createElement('div',{onClick:()=>handleSortSp("desc"),     style:{fontSize:10,color:sortKeySp==="desc"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Descrizione", React.createElement('span',{style:{opacity:sortKeySp==="desc"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="desc"?"▲":"▼"))
                      , React.createElement('div',{onClick:()=>handleSortSp("categoria"), style:{fontSize:10,color:sortKeySp==="categoria"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Categoria", React.createElement('span',{style:{opacity:sortKeySp==="categoria"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="categoria"?"▲":"▼"))
                      , React.createElement('div',{onClick:()=>handleSortSp("data"),      style:{fontSize:10,color:sortKeySp==="data"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Data", React.createElement('span',{style:{opacity:sortKeySp==="data"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="data"?"▲":"▼"))
                      , React.createElement('div',{onClick:()=>handleSortSp("metodo"),    style:{fontSize:10,color:sortKeySp==="metodo"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Metodo", React.createElement('span',{style:{opacity:sortKeySp==="metodo"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="metodo"?"▲":"▼"))
                      , React.createElement('div',{onClick:()=>handleSortSp("importo"),   style:{fontSize:10,color:sortKeySp==="importo"?C.gold:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",userSelect:"none",display:"flex",alignItems:"center",gap:3}}, "Importo", React.createElement('span',{style:{opacity:sortKeySp==="importo"?1:0.3,fontSize:9}},sortDirSp==="asc"&&sortKeySp==="importo"?"▲":"▼"))
                      , React.createElement('div',{style:{fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}, "")
                    )
                    , qFiltrate.length===0?(
                      React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7174}}, "Nessun pagamento trovato"  )
                    ):qFiltrate.map((e,i)=>(
                      React.createElement('div', { key: e.id, style: {display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 100px auto",minWidth:520,
                        padding:"12px 18px",borderBottom:i<qFiltrate.length-1?`1px solid ${C.border}20`:"none",
                        alignItems:"center",transition:"background 0.1s"},
                        onMouseEnter: el=>el.currentTarget.style.background=C.surfaceHover,
                        onMouseLeave: el=>el.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7176}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7181}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7182}}, e.desc||e.studentName||"—")
                          , e.numRicevuta&&React.createElement('div', { style: {fontSize:11,color:C.gold,marginTop:1,fontFamily:"'Oswald',sans-serif",letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7183}}, "Ric. n° "  , e.numRicevuta)
                          , e.studentName&&e.categoria!=="quota"&&React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7184}}, e.studentName)
                          , e.note&&React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7185}}, e.note)
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7187}}
                          , (()=>{const c=catEntrate.find(x=>x.id===e.categoria)||{label:"Quota",icon:"receipt"};
                            return React.createElement('span', { style: {fontSize:11,padding:"2px 8px",borderRadius:10,background:C.greenBg,
                              color:C.green,border:`1px solid ${C.greenBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7189}}, c.label);})()
                        )
                        , React.createElement('div', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7192}}
                          , e.data ? new Date(e.data+"T00:00:00").toLocaleDateString("it-IT") : "—"
                        )
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7195}}, e.metodo)
                        , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:17,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7196}}, fmt(e.importo))
                        , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7197}}
                          , React.createElement('button', { onClick: ()=>{setSelQuota(e);setModal("ricevuta");},
                            title: "Stampa ricevuta" ,
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: el=>el.currentTarget.style.color=C.gold,
                            onMouseLeave: el=>el.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7198}}
                            , React.createElement(Ic, { n: "receipt", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7203}})
                          )
                          , ruoloCV==="admin" && React.createElement('button', { onClick: ()=>{setSelQuota(e);setModal("editq");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: el=>el.currentTarget.style.color=C.gold,
                            onMouseLeave: el=>el.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7205}}
                            , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7209}})
                          )
                          , ruoloCV==="admin" && React.createElement('button', { onClick: ()=>{setSelQuota(e);setModal("deleteq");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: el=>el.currentTarget.style.color=C.red,
                            onMouseLeave: el=>el.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7211}}
                            , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7215}})
                          )
                        )
                      )
                    ))
                  )
                )
              );
            })()

            /* TAB REPORT */
            , tab==="brani" && (() => {
          const prog  = evento.programma || [];
          const parts = evento.partecipanti || [];
          const hasProg2 = ["saggio","concerto","pubblico"].includes(evento.tipo);
          return React.createElement('div', {style:{maxWidth:700}}
            , React.createElement('div', {style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}
              , React.createElement('h3', {style:{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,margin:0}}, "Scaletta — ", evento.titolo)
              , hasProg2 && prog.length>0 && React.createElement('button', {
                  onClick:()=>{
                    const w=window.open("","_blank");
                    const rows=prog.map((p,i)=>`<div class="brano"><div class="num">${i+1}</div><div>
                      <div class="title">${p.branoTitle||""}</div>
                      <div class="comp">${p.composer||""}</div>
                      ${(p.allievi||[]).length>0?`<div class="esec">${(p.allievi||[]).map(a=>a.studentName).join(", ")}</div>`:""}
                    </div></div>`).join("");
                    w.document.write(`<html><head><title>Scaletta</title><style>
                      body{font-family:'Georgia',serif;padding:40px;max-width:700px;margin:0 auto}
                      h1{font-size:28px;margin-bottom:4px}.sub{color:#666;margin-bottom:32px;font-size:14px}
                      .brano{border-bottom:1px solid #eee;padding:14px 0;display:flex;gap:16px;align-items:flex-start}
                      .num{font-size:26px;font-weight:700;color:#1a4fa0;min-width:36px;font-family:'Georgia',serif}
                      .title{font-size:16px;font-weight:600;margin-bottom:2px}.comp{font-size:13px;color:#666;margin-bottom:3px}
                      .esec{font-size:12px;color:#888}@media print{button{display:none}}
                    </style></head><body>
                    <h1>${evento.titolo}</h1>
                    <div class="sub">${evento.data?new Date(evento.data+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):""} ${evento.luogo?"· "+evento.luogo:""}</div>
                    ${rows}<script>window.print();<\/script></body></html>`);
                    w.document.close();
                  },
                  style:{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,
                    border:"1px solid "+C.goldDim,background:C.goldBg,color:C.gold,
                    cursor:"pointer",fontSize:12,fontFamily:"'Open Sans',sans-serif"}
                }
                , React.createElement(Ic,{n:"print",size:13,stroke:C.gold}), " Stampa scaletta"
              )
            )
            , hasProg2 && prog.length===0 && React.createElement('div', {style:{textAlign:"center",padding:"48px 0",color:C.textDim,border:"1px dashed "+C.border,borderRadius:12}}
              , React.createElement(Ic,{n:"music",size:28,stroke:C.textDim})
              , React.createElement('p',{style:{marginTop:12}},"Nessun brano nel programma — modifica l'evento per aggiungerli")
            )
            , hasProg2 && prog.map((p,i)=>
              React.createElement('div', {key:p.branoId||i, style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}
                , React.createElement('div', {style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:44}}
                  , React.createElement('div', {style:{fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:700,color:C.gold,lineHeight:1,marginBottom:2}}, i+1)
                  , React.createElement('button', {
                      onClick:()=>{ const p2=[...(evento.programma||[])]; if(i===0)return; [p2[i],p2[i-1]]=[p2[i-1],p2[i]]; onUpdate({...evento,programma:p2}); },
                      disabled:i===0,
                      style:{background:"none",border:"none",cursor:i===0?"default":"pointer",padding:"1px 5px",color:i===0?C.border:C.textMuted,lineHeight:1,fontSize:15}
                    }, "▲")
                  , React.createElement('button', {
                      onClick:()=>{ const p2=[...(evento.programma||[])]; if(i>=p2.length-1)return; [p2[i],p2[i+1]]=[p2[i+1],p2[i]]; onUpdate({...evento,programma:p2}); },
                      disabled:i>=(evento.programma||[]).length-1,
                      style:{background:"none",border:"none",cursor:i>=(evento.programma||[]).length-1?"default":"pointer",padding:"1px 5px",color:i>=(evento.programma||[]).length-1?C.border:C.textMuted,lineHeight:1,fontSize:15}
                    }, "▼")
                )
                , React.createElement('div', {style:{flex:1}}
                  , React.createElement('div', {style:{fontSize:15,fontWeight:600,marginBottom:2}}, p.branoTitle||"")
                  , p.composer && React.createElement('div', {style:{fontSize:12,color:C.textMuted,marginBottom:6}}, p.composer)
                  , (p.allievi||[]).length>0 && React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:5}}
                    , (p.allievi||[]).map(a=>React.createElement('span', {key:a.studentId,style:{padding:"2px 8px",borderRadius:12,background:C.goldBg,border:"1px solid "+C.goldDim,color:C.gold,fontSize:11}}, a.studentName))
                  )
                  , (p.allievi||[]).length===0 && React.createElement('div', {style:{fontSize:11,color:C.textDim,fontStyle:"italic"}}, "Nessun esecutore specificato")
                )
              )
            )
            , !hasProg2 && React.createElement('div', null
              , parts.length===0 && React.createElement('div', {style:{textAlign:"center",padding:"32px 0",color:C.textDim,border:"1px dashed "+C.border,borderRadius:8}}, "Nessun partecipante registrato")
              , parts.map(p=>React.createElement('div', {key:p.studentId,style:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:6}}
                  , React.createElement('div', {style:{width:32,height:32,borderRadius:"50%",background:C.teal+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:600,color:C.teal}}, initials(p.studentName))
                  , React.createElement('span',{style:{fontSize:13}}, p.studentName)
                ))
            )
          );
        })()

        , tab==="report" && React.createElement(ReportErrorBoundary, null, React.createElement(ReportView, { spese: spese||[], entrate: entrate||[], __self: this, __source: {fileName: _jsxFileName, lineNumber: 7226}}))
          )
        )

        , ruoloCV==="admin" && modal==="add"    && React.createElement(Modal, { title: "Registra spesa" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7230}}, React.createElement(SpesaForm, { onSave: handleAdd, onClose: closeModal, docenti: propDocentiCV||[], categorie: catSpese, onAddCategoria: (cat)=>setCatSpese(p=>[...p,cat]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7230}}))
        , modal==="edit"   && selSpesa && React.createElement(Modal, { title: "Modifica spesa" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7231}}, React.createElement(SpesaForm, { initial: selSpesa, docenti: propDocentiCV||[], categorie: catSpese, onAddCategoria: (cat)=>setCatSpese(p=>[...p,cat]), onSave: handleEdit, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7231}}))
        , modal==="delete" && selSpesa && React.createElement(ConfirmDel, { label: selSpesa.desc, onConfirm: handleDel, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7232}})
        , ruoloCV==="admin" && modal==="addq"   && React.createElement(Modal, { title: "Nuova entrata" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7233}}, React.createElement(EntrataForm, { students: students, onSave: handleAddQ, onClose: closeModal, categorie: catEntrate, onAddCategoriaEntr: (cat)=>setCatEntrate(p=>[...p,cat]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7233}}))
        , modal==="editq"  && selQuota && React.createElement(Modal, { title: "Modifica entrata" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7234}}, React.createElement(EntrataForm, { students: students, initial: selQuota, onSave: handleEditQ, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7234}}))
        , modal==="deleteq"&& selQuota && React.createElement(ConfirmDel, { label: selQuota.desc, onConfirm: handleDelQ, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7235}})
        , modal==="ricevuta" && selQuota && (
          React.createElement(RicevutaModal, {
            entrata: selQuota,
            student: students.find(s=>s.id===selQuota.studentId),
            config: config,
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7237}}
          )
        )
      )
    );
};


// ════════════════════════════════════════════════════════════════════════════════

// REPERTORIO

// ════════════════════════════════════════════════════════════════════════════════

// ─── COSTANTI ────────────────────────────────────────────────────────────────
const DIFFICULTY = [
  {id:"Principiante", hex:C.green,  bg:C.greenBg,  bd:C.greenBorder,  rank:1},
  {id:"Elementare",   hex:C.blue,   bg:C.blueBg,   bd:C.blueBorder,   rank:2},
  {id:"Intermedio",   hex:C.gold,   bg:C.goldBg,   bd:C.goldDim,      rank:3},
  {id:"Avanzato",     hex:C.orange, bg:C.orangeBg, bd:C.orangeBorder, rank:4},
  {id:"Professionale",hex:C.red,    bg:C.redBg,    bd:C.redBorder,    rank:5},
];
const diffById = id => DIFFICULTY.find(d=>d.id===id)||DIFFICULTY[2];

const PERIODI = [
  {id:"Barocco",      hex:"#a78bfa"},
  {id:"Classico",     hex:C.blue},
  {id:"Romantico",    hex:C.gold},
  {id:"Moderno",      hex:C.teal},
  {id:"Contemporaneo",hex:C.orange},
  {id:"Jazz/Blues",   hex:"#f472b6"},
  {id:"Folk/Pop",     hex:C.green},
  {id:"Traditional",  hex:C.textMuted},
];
const periodoById = id => PERIODI.find(p=>p.id===id)||PERIODI[7];

const INSEGNANTI = ["Prof. Rossi","Prof. Bianchi","Prof. Verde","Prof. Marino"];

// ─── DATI DEMO ───────────────────────────────────────────────────────────────
const INIT_BRANI = [
  {id:"b1",  title:"Notturno in Mi♭ maggiore Op.9 n.2",  composer:"Frédéric Chopin",    periodo:"Romantico",  tonality:"Mi♭ maggiore", difficulty:"Avanzato",      tipo:"individuale",
   note:"Celebre notturno, richiede fraseggio cantabile e tocco morbido. Fondamentale lavorare sul rubato.", dataPrima:"2024-10-15", dataUltima:"2025-05-20"},

  {id:"b2",  title:"Invenzione n.1 in Do maggiore BWV 772", composer:"Johann S. Bach",     periodo:"Barocco",    tonality:"Do maggiore",  difficulty:"Intermedio",    tipo:"individuale",
   note:"Contrappunto a due voci. Attenzione all'indipendenza delle mani.", dataPrima:"2025-01-10", dataUltima:"2025-04-28"},

  {id:"b3",  title:"Partita n.2 in Re minore BWV 1004",   composer:"Johann S. Bach",     periodo:"Barocco",    tonality:"Re minore",    difficulty:"Professionale", tipo:"individuale",
   note:"Per violino solo. Chaconne finale è uno dei pezzi più impegnativi del repertorio violinistico.", dataPrima:"2024-09-01", dataUltima:"2025-05-22"},

  {id:"b4",  title:"Sonata K.331 in La maggiore",          composer:"W.A. Mozart",        periodo:"Classico",   tonality:"La maggiore",  difficulty:"Intermedio",    tipo:"individuale",
   note:"Tema con variazioni, Rondò alla Turca nel finale. Classico del repertorio pianistico.", dataPrima:"2025-02-01", dataUltima:"2025-05-15"},

  {id:"b5",  title:"Standard Jazz ii-V-I in Do maggiore",  composer:"Traditional",        periodo:"Jazz/Blues",  tonality:"Do maggiore", difficulty:"Intermedio",    tipo:"individuale",
   note:"Progressione fondamentale jazz. Lavorare su voicings e improvvisazione.", dataPrima:"2025-03-10", dataUltima:"2025-05-18"},

  {id:"b6",  title:"Studio op.10 n.1 in Do maggiore",      composer:"Frédéric Chopin",    periodo:"Romantico",  tonality:"Do maggiore",  difficulty:"Professionale", tipo:"individuale",
   note:"Studio per l'estensione della mano destra. Tecnica impegnativa.", dataPrima:"2025-04-05", dataUltima:"2025-05-10"},

  {id:"b7",  title:"Ode alla Gioia (Sinfonia n.9)",         composer:"Ludwig van Beethoven",periodo:"Classico",  tonality:"Re maggiore",  difficulty:"Elementare",    tipo:"collettivo",
   note:"Arrangiamento per orchestra scolastica. Eseguito al saggio di fine anno.", dataPrima:"2025-01-15", dataUltima:"2025-05-22"},

  {id:"b8",  title:"Canon in Re",                           composer:"Johann Pachelbel",   periodo:"Barocco",   tonality:"Re maggiore",  difficulty:"Elementare",    tipo:"collettivo",
   note:"Ensemble d'archi. Buona introduzione al suonare in gruppo.", dataPrima:"2025-02-20", dataUltima:"2025-04-30"},

  {id:"b9",  title:"Greensleeves",                          composer:"Traditional",        periodo:"Folk/Pop",   tonality:"Re minore",    difficulty:"Principiante",  tipo:"collettivo",
   note:"Arrangiamento corale. Ottimo per i principianti.", dataPrima:"2025-03-01", dataUltima:"2025-04-10"},

  {id:"b10", title:"Preludio in Do maggiore BWV 846",       composer:"Johann S. Bach",     periodo:"Barocco",   tonality:"Do maggiore",  difficulty:"Elementare",    tipo:"individuale",
   note:"Dal Clavicembalo Ben Temperato. Ottimo esercizio per la fluidità.", dataPrima:"2026-02-10", dataUltima:"2025-05-01"},
];

// ─── FORM BRANO ──────────────────────────────────────────────────────────────
const BranoForm = ({initial,onSave,onClose,students:_studBranoIn})=>{
  const empty={title:"",composer:"",periodo:"",tonality:"",difficulty:"Intermedio",tipo:"individuale",note:"",linkBacking:"",files:[],spartiti:[]};
  const [f,setF]=useState(initial||empty);
  const [err,setErr]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const validate=()=>{
    const e={};
    if(!f.title.trim())    e.title="Titolo obbligatorio";
    // compositore facoltativo
    return e;
  };
  const handleSave=()=>{
    const e=validate(); if(Object.keys(e).length){setErr(e);return;}
    onSave(f);
  };

  return(
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:"20px 22px",display:"flex",flexDirection:"column",gap:14,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7358}}
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7359}}
          , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7360}}
            , React.createElement(Input, { label: "Titolo *" , value: f.title, onChange: e=>set("title",e.target.value), error: err.title, placeholder: "Es. Notturno Op.9 n.2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7361}})
          )
          , React.createElement(Input, { label: "Compositore *" , value: f.composer, onChange: e=>set("composer",e.target.value), error: err.composer, placeholder: "Es. Chopin" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7363}})
          , React.createElement(Sel, { label: "Periodo", value: f.periodo, onChange: e=>set("periodo",e.target.value),
            options: PERIODI.map(p=>({value:p.id,label:p.id})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7364}})
          , React.createElement(Sel, { label: "Tonalità / Scala"  , value: f.tonality, onChange: e=>set("tonality",e.target.value), options: TONALITY_OPTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7366}})
          , React.createElement(Sel, { label: "Difficoltà", value: f.difficulty, onChange: e=>set("difficulty",e.target.value),
            options: DIFFICULTY.map(d=>({value:d.id,label:d.id})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7367}})
        )




        /* Note */
        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}},"Note tecniche / annotazioni")
          , React.createElement('textarea', { value: f.note, onChange: e=>set("note",e.target.value), rows: 3,
            placeholder: "Indicazioni tecniche, riferimenti, obiettivi didattici...",
            style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"9px 13px",width:"100%",
              fontFamily:"'Open Sans',sans-serif",resize:"vertical"}})
        )

        /* ── Link Backing Track ── */
        , React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:5}}
          , React.createElement('label',{style:{fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}},'Link Backing / YouTube / Drive')
          , React.createElement('input',{
              type:'url', value:f.linkBacking||'', placeholder:'https://youtube.com/...',
              onChange:e=>set('linkBacking',e.target.value),
              style:{width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${C.border}`,
                background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",
                outline:'none',boxSizing:'border-box'}})
        )

        /* ── Spartiti (PDF) ── */
        , React.createElement('div', null
          , React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,letterSpacing:'0.07em',textTransform:'uppercase'}},'Spartiti')
            , React.createElement('label',{style:{fontSize:11,color:C.blue,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}
              , React.createElement(Ic,{n:'paperclip',size:11,stroke:C.blue}),' Carica PDF'
              , React.createElement('input',{type:'file',accept:'.pdf,image/*',multiple:true,style:{display:'none'},
                  onChange:async e=>{
                    const sb=window.supabaseClient; const newItems=[];
                    for(const file of Array.from(e.target.files||[])){
                      const path=`spartiti/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
                      let fileUrl=null;
                      if(sb){try{await sb.storage.from('allegati').upload(path,file,{upsert:true});const{data:u}=sb.storage.from('allegati').getPublicUrl(path);fileUrl=u?.publicUrl||null;}catch(er){}}
                      newItems.push({id:'sp_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),fileName:file.name,fileUrl,fileType:file.type});
                    }
                    set('spartiti',[...(f.spartiti||[]),...newItems]);e.target.value='';
                  }})
            )
          )
          , (f.spartiti||[]).length>0 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:4}}
            , (f.spartiti||[]).map((s,i)=>React.createElement('div',{key:s.id||i,style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:7,border:`1px solid ${C.border}`,background:C.bg}}
              , React.createElement(Ic,{n:'paperclip',size:12,stroke:C.red})
              , s.fileUrl
                ? React.createElement('a',{href:s.fileUrl,target:'_blank',rel:'noopener noreferrer',style:{flex:1,fontSize:12,color:C.blue,textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},s.fileName||'Spartito')
                : React.createElement('span',{style:{flex:1,fontSize:12,color:C.text}},s.fileName||'Spartito')
              , React.createElement('button',{onClick:()=>set('spartiti',(f.spartiti||[]).filter((_,j)=>j!==i)),style:{background:'none',border:'none',cursor:'pointer',padding:2,color:C.textMuted},onMouseEnter:e=>e.currentTarget.style.color=C.red,onMouseLeave:e=>e.currentTarget.style.color=C.textMuted}
                , React.createElement(Ic,{n:'x',size:12,stroke:'currentColor'}))
            ))
          )
        )

        /* ── File allegati (audio/video/altro) ── */
        , React.createElement('div', null
          , React.createElement('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,letterSpacing:'0.07em',textTransform:'uppercase'}},'File allegati')
            , React.createElement('label',{style:{fontSize:11,color:C.blue,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}
              , React.createElement(Ic,{n:'paperclip',size:11,stroke:C.blue}),' Carica file'
              , React.createElement('input',{type:'file',multiple:true,style:{display:'none'},
                  onChange:async e=>{
                    const sb=window.supabaseClient; const newItems=[];
                    for(const file of Array.from(e.target.files||[])){
                      const path=`brani/${Date.now()}_${file.name.replace(/\s+/g,'_')}`;
                      let fileUrl=null;
                      if(sb){try{await sb.storage.from('allegati').upload(path,file,{upsert:true});const{data:u}=sb.storage.from('allegati').getPublicUrl(path);fileUrl=u?.publicUrl||null;}catch(er){}}
                      newItems.push({id:'fa_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),fileName:file.name,fileUrl,fileType:file.type});
                    }
                    set('files',[...(f.files||[]),...newItems]);e.target.value='';
                  }})
            )
          )
          , (f.files||[]).length>0 && React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:4}}
            , (f.files||[]).map((fi,i)=>React.createElement('div',{key:fi.id||i,style:{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:7,border:`1px solid ${C.border}`,background:C.bg}}
              , React.createElement(Ic,{n:'paperclip',size:12,stroke:C.blue})
              , fi.fileUrl
                ? React.createElement('a',{href:fi.fileUrl,target:'_blank',rel:'noopener noreferrer',style:{flex:1,fontSize:12,color:C.blue,textDecoration:'none',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},fi.fileName||'File')
                : React.createElement('span',{style:{flex:1,fontSize:12,color:C.text}},fi.fileName||'File')
              , React.createElement('button',{onClick:()=>set('files',(f.files||[]).filter((_,j)=>j!==i)),style:{background:'none',border:'none',cursor:'pointer',padding:2,color:C.textMuted},onMouseEnter:e=>e.currentTarget.style.color=C.red,onMouseLeave:e=>e.currentTarget.style.color=C.textMuted}
                , React.createElement(Ic,{n:'x',size:12,stroke:'currentColor'}))
            ))
          )
        )
      )

      , React.createElement('div', { style: {padding:"13px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:8}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave}, React.createElement(Ic, { n: "check", size: 13, stroke: "#ffffff"}), _optionalChain([initial, 'optionalAccess', _69 => _69.id])?"Salva modifiche":"Aggiungi brano")
      )
    )
  );
};

// ─── DRAWER DETTAGLIO BRANO ──────────────────────────────────────────────────
const BranoDrawer = ({brano,lezioniCount,allieviList,onClose,onEdit,onDelete})=>{
  const _lezCount = lezioniCount || 0;
  const _allieviL = allieviList  || [];
  const d=diffById(brano.difficulty);
  const p=periodoById(brano.periodo);
  const isCol=brano.tipo==="collettivo";
  const typeHex=isCol?C.purple:C.gold;
  const typeBg=isCol?C.purpleBg:C.goldBg;
  const typeBd=isCol?C.purpleBorder:C.goldDim;

  return(
    React.createElement(React.Fragment, null
      , React.createElement('div', { onClick: onClose, style: {position:"fixed",inset:0,zIndex:300,
        background:"rgba(0,0,0,.7)",backdropFilter:"blur(3px)",animation:"fadeIn .2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7455}})
      , React.createElement('div', { style: {position:"fixed",top:0,right:0,bottom:0,zIndex:301,
        width:"min(480px, 100vw)",
        background:C.surface,borderLeft:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",animation:"slideDrawer .26s cubic-bezier(.4,0,.2,1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7457}}

        /* Header */
        , React.createElement('div', { style: {padding:"calc(env(safe-area-inset-top, 0px) + 18px) 22px 18px",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7462}}
          , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7463}}
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7464}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:21,fontWeight:600,lineHeight:1.25,marginBottom:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7465}}
                , brano.title
              )
              , React.createElement('div', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7468}}, brano.composer)
            )
            , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
              color:C.textMuted,display:"flex",padding:4,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7470}}
              , React.createElement(Ic, { n: "x", size: 17, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7472}})
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7475}}
            , React.createElement(DiffBadge, { diff: brano.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7476}})
            , React.createElement(TipoBadge, { tipo: brano.tipo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7477}})
            , brano.periodo&&(
              React.createElement('span', { style: {background:p.hex+"18",color:p.hex,border:`1px solid ${p.hex}40`,
                borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:600,letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7479}}, brano.periodo)
            )
            , brano.tonality&&(
              React.createElement('span', { style: {background:C.bg,color:C.textMuted,border:`1px solid ${C.border}`,
                borderRadius:4,padding:"2px 7px",fontSize:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7483}}, brano.tonality)
            )
          )
        )

        /* Body */
        , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"18px 22px",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7490}}

          /* Statistiche */
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7493}}
            , [
              {label:"Lezioni totali",   val:_lezCount, hex:C.gold},
              {label:"Allievi assegnati",val:_allieviL.length, hex:typeHex},
              {label:"Settimane attivo", val:brano.dataPrima?Math.round((new Date()-new Date(brano.dataPrima))/(7*86400000)):0, hex:C.blue},
            ].map(s=>(
              React.createElement('div', { key: s.label, style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7499}}
                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:600,color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7500}}, s.val)
                , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3,lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7501}}, s.label)
              )
            ))
          )

          /* Timeline */
          , (brano.dataPrima||brano.dataUltima)&&(
            React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7508}}
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7509}}, "Timeline studio" )
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7510}}
                , brano.dataPrima&&(
                  React.createElement('div', { style: {display:"flex",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7512}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7513}}, "Prima lezione" )
                    , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7514}}, new Date(brano.dataPrima+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"}))
                  )
                )
                , brano.dataUltima&&(
                  React.createElement('div', { style: {display:"flex",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7518}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7519}}, "Ultima lezione" )
                    , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7520}}, new Date(brano.dataUltima+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"}))
                  )
                )
                , brano.insegnante&&(
                  React.createElement('div', { style: {display:"flex",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7524}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7525}}, "Insegnante")
                    , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7526}}, brano.insegnante)
                  )
                )
              )
            )
          )

          /* Allievi */
          , (brano.allievi||[]).length>0&&(
            React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7535}}
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7536}}, "Allievi "
                 , brano.tipo==="collettivo"?"nell'ensemble":"che studiano questo brano", " (" , brano.allievi.length, ")"
              )
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7539}}
                , brano.allievi.map(a=>(
                  React.createElement('div', { key: a, style: {display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                    background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7541}}
                    , React.createElement('div', { style: {width:30,height:30,borderRadius:"50%",background:`${typeHex}18`,
                      border:`1.5px solid ${typeHex}40`,display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0,
                      fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:600,color:typeHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7543}}
                      , stuName.split(" ").map(p=>p[0]).join("").slice(0,2)
                    )
                    , React.createElement('span', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7549}}, a)
                  )
                ))
              )
            )
          )

          /* Note */
          , brano.note&&(
            React.createElement('div', { style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7558}}
              , React.createElement('div', { style: {fontSize:10,color:C.gold,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7559}}, "Note tecniche" )
              , React.createElement('div', { style: {fontSize:13,color:C.text,lineHeight:1.65}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7560}}, brano.note)
            )
          )
          , _allieviL.length > 0 && (
            React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"} }
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10} }, "Allievi")
              , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"} }
                , _allieviL.map(nome=>React.createElement('span', { key: nome,
                    style: {fontSize:12,padding:"3px 10px",borderRadius:4,background:typeHex+"18",color:typeHex,border:`1px solid ${typeHex}40`} }
                  , nome
                ))
              )
            )
          )
        )

        /* Footer */
        , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,
          position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-between",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7566}}
          , React.createElement(Btn, { danger: true, onClick: ()=>onDelete(brano), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7568}}
            , React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7569}}), "Elimina"
          )
          , React.createElement(Btn, { variant: "secondary", onClick: ()=>onEdit(brano), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7571}}
            , React.createElement(Ic, { n: "edit", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7572}}), "Modifica"
          )
        )
      )
    )
  );
};

// ─── VISTA ALLIEVO ───────────────────────────────────────────────────────────
const AllievoBraniView = ({allievo,allievoId,brani,allStudents,lessons,onBack})=>{
  const isMobile = useIsMobile();
  const [filterCorso, setFilterCorso] = useState("");
  const _stu = allievoId
    ? (allStudents||[]).find(s=>String(s.id)===String(allievoId))
    : (allStudents||[]).find(s=>(s.name||s.nome||"").toLowerCase().trim()===( allievo||"").toLowerCase().trim());
  // Cerca prima in student.repertorio, poi nelle lezioni tramite repertorioIds
  const _braniIds = React.useMemo(()=>{
    const ids = new Set();
    // da student.repertorio in memoria
    if(_stu) (_stu.repertorio||[]).forEach(r=>ids.add(r.id));
    // da lezioni (fonte persistente su DB tramite repertorioIds)
    (lessons||[]).forEach(l=>{
      const match = allievoId
        ? String(l.studentId||'')===String(allievoId)
        : (l.student||'').toLowerCase().trim()===(allievo||'').toLowerCase().trim();
      if(match) (l.repertorioIds||[]).forEach(id=>ids.add(id));
    });
    return ids;
  },[_stu,lessons,allievo,allievoId]);
  const suoiBrani = (brani||[]).filter(b=>_braniIds.has(b.id));

  // Corsi disponibili per il filtro: strumenti/tipi unici nei brani dell'allievo
  const corsiDisponibili = React.useMemo(()=>{
    const tipi = new Set(suoiBrani.map(b=>b.tipo||b.type||"individuale"));
    // Aggiungi i corsi dalle lezioni dell'allievo
    (lessons||[]).forEach(l=>{
      const match = allievoId
        ? String(l.studentId||'')===String(allievoId)
        : (l.student||'').toLowerCase().trim()===(allievo||'').toLowerCase().trim();
      if(match && l.instrument) tipi.add(l.instrument);
      if(match && isColl(l) && l.courseName) tipi.add(l.courseName);
    });
    return [...tipi].filter(Boolean).sort();
  },[suoiBrani, lessons, allievo, allievoId]);

  // Applica filtro corso
  const braniFiltrati = filterCorso
    ? suoiBrani.filter(b=>{
        if((b.tipo||b.type||"individuale")===filterCorso) return true;
        // controlla se il brano è associato a una lezione del corso
        return (lessons||[]).some(l=>{
          const match = allievoId
            ? String(l.studentId||'')===String(allievoId)
            : (l.student||'').toLowerCase().trim()===(allievo||'').toLowerCase().trim();
          return match && (l.instrument===filterCorso||l.courseName===filterCorso) && (l.repertorioIds||[]).includes(b.id);
        });
      })
    : suoiBrani;
  
  return(
    React.createElement('div', { style: {flex:1,padding:isMobile?"12px":"20px 24px",overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7588}}
      , onBack && React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
        border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,fontFamily:"'Open Sans',sans-serif",
        marginBottom:20,padding:"4px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7589}}
        , React.createElement('svg', { width: 16, height: 16, viewBox: "0 0 24 24"   , fill: "none", stroke: C.textMuted, strokeWidth: "1.8", strokeLinecap: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7592}}, React.createElement('path', { d: "m15 18-6-6 6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7592}})), "Tutti gli allievi"

      )

      , React.createElement('div', { style: {display:"flex",alignItems:"flex-start",gap:16,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7596}}
        , React.createElement('div', { style: {width:56,height:56,borderRadius:"50%",background:`${C.gold}18`,
          border:`2px solid ${C.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7597}}
          , allievo.split(" ").map(p=>p[0]).join("").slice(0,2)
        )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7602}}
          , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7603}}, allievo)
          , React.createElement('div', { style: {fontSize:13,color:C.textMuted,marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7604}}
            , suoiBrani.length, " brani in repertorio"
          )
        )
      )

      /* Filtro per corso */
      , corsiDisponibili.length > 1 && React.createElement('div', {style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}
        , React.createElement('button', {
            onClick:()=>setFilterCorso(""),
            style:{padding:"5px 14px",borderRadius:20,border:`1px solid ${!filterCorso?C.gold:C.border}`,
              background:!filterCorso?C.goldBg:"transparent",color:!filterCorso?C.gold:C.textMuted,
              fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",fontWeight:!filterCorso?600:400}}
          , "Tutti")
        , corsiDisponibili.map(c=>React.createElement('button', {key:c,
            onClick:()=>setFilterCorso(c),
            style:{padding:"5px 14px",borderRadius:20,border:`1px solid ${filterCorso===c?C.gold:C.border}`,
              background:filterCorso===c?C.goldBg:"transparent",color:filterCorso===c?C.gold:C.textMuted,
              fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif",fontWeight:filterCorso===c?600:400}}
          , c))
      )

      , braniFiltrati.length===0&&(
        React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7611}}
          , React.createElement(Ic, { n: "music", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7612}})
          , React.createElement('p', { style: {marginTop:12,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7613}}, filterCorso ? `Nessun brano per il corso: ${filterCorso}` : "Nessun brano assegnato a questo allievo"     )
        )
      )

      , braniFiltrati.length>0&&(
        React.createElement('div', { style: {marginBottom:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7618}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7619}}
            , React.createElement(Ic, { n: "music", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7620}}), " Brani in repertorio ("   , braniFiltrati.length, ")"
          )
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7622}}
            , braniFiltrati.map(b=>{
              const d=diffById(b.difficulty);
              const p=periodoById(b.periodo);
              return(
                React.createElement('div', { key: b.id, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,
                  padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7627}}
                  , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7629}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:600,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7630}}, b.title)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7631}}, b.composer, b.tonality?` · ${b.tonality}`:"")
                  )
                  , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7633}}
                    , React.createElement(DiffBadge, { diff: b.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7634}})
                    , b.periodo&&React.createElement('span', { style: {background:p.hex+"18",color:p.hex,border:`1px solid ${p.hex}30`,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7635}}, b.periodo)
                    , React.createElement('span', { style: {fontSize:11,color:C.textDim} }, (lessons||[]).filter(l=>(l.repertorioIds||[]).includes(b.id)).length, " lez." )
                  )
                )
              );
            })
          )
        )
      )

      
    )
  );
};

// ─── CONFIRM ─────────────────────────────────────────────────────────────────

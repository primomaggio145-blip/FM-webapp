var _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN
const ANNO   = oggi.getFullYear();
const MESE   = oggi.getMonth();
const GIORNO = oggi.getDay(); // 0=dom
const MESI   = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
                 "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const GIORNI = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];

const fmt  = n => `€ ${Number(n).toLocaleString("it-IT",{minimumFractionDigits:0,maximumFractionDigits:0})}`;
const fmtD = n => `€ ${Number(n).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

// ─── DATI DEMO ────────────────────────────────────────────────────────────────
const ALLIEVI = [
  {id:"a1",name:"Sofia Marchetti",  instrument:"Pianoforte",teacher:"Prof. Rossi",   stato:"pagato", monthlyFee:120},
  {id:"a2",name:"Luca Ferrara",     instrument:"Chitarra",  teacher:"Prof. Bianchi", stato:"attesa", monthlyFee:100},
  {id:"a3",name:"Emma Conti",       instrument:"Violino",   teacher:"Prof. Rossi",   stato:"pagato", monthlyFee:120},
  {id:"a4",name:"Marco Ricci",      instrument:"Batteria",  teacher:"Prof. Verde",   stato:"scaduto",monthlyFee:110},
  {id:"a5",name:"Giulia Romano",    instrument:"Flauto",    teacher:"Prof. Bianchi", stato:"pagato", monthlyFee:100},
  {id:"a6",name:"Alessandro Gallo", instrument:"Pianoforte",teacher:"Prof. Rossi",   stato:"sospeso",monthlyFee:120},
  {id:"a7",name:"Chiara Esposito",  instrument:"Canto",     teacher:"Prof. Marino",  stato:"pagato", monthlyFee:115},
  {id:"a8",name:"Matteo Bruno",     instrument:"Chitarra",  teacher:"Prof. Bianchi", stato:"scaduto",monthlyFee:100},
];

const LEZIONI_OGGI = [
  {id:"l1",ora:"09:00",durata:60, allievo:"Sofia Marchetti",  strumento:"Pianoforte",docente:"Prof. Rossi",   aula:"Sala A", tipo:"individuale",confermata:true},
  {id:"l2",ora:"10:15",durata:45, allievo:"Emma Conti",       strumento:"Violino",   docente:"Prof. Rossi",   aula:"Sala A", tipo:"individuale",confermata:true},
  {id:"l3",ora:"11:00",durata:60, allievo:"Luca Ferrara",     strumento:"Chitarra",  docente:"Prof. Bianchi", aula:"Sala B", tipo:"individuale",confermata:false},
  {id:"l4",ora:"14:00",durata:90, allievo:"Ensemble Junior",  strumento:"Vari",      docente:"Prof. Rossi",   aula:"Sala C", tipo:"collettivo", confermata:true},
  {id:"l5",ora:"15:30",durata:45, allievo:"Giulia Romano",    strumento:"Flauto",    docente:"Prof. Bianchi", aula:"Sala B", tipo:"individuale",confermata:true},
  {id:"l6",ora:"16:30",durata:60, allievo:"Marco Ricci",      strumento:"Batteria",  docente:"Prof. Verde",   aula:"Sala D", tipo:"individuale",confermata:false},
  {id:"l7",ora:"18:00",durata:60, allievo:"Chiara Esposito",  strumento:"Canto",     docente:"Prof. Marino",  aula:"Sala A", tipo:"individuale",confermata:true},
];

const PROSSIMI_EVENTI = [
  {data:`${ANNO}-06-07`,titolo:"Saggio di fine anno",luogo:"Aula Magna",tipo:"saggio"},
  {data:`${ANNO}-06-14`,titolo:"Masterclass Chitarra",luogo:"Sala C",tipo:"masterclass"},
  {data:`${ANNO}-06-21`,titolo:"Concerto Estate",luogo:"Piazza del Comune",tipo:"concerto"},
  {data:`${ANNO}-07-10`,titolo:"Audizioni nuovi allievi",luogo:"Sala A",tipo:"audizione"},
];

// Dati finanziari mensili (gen-mag)
const FIN_MENSILE = [
  {m:"Gen", entr:1660, usc:2420},
  {m:"Feb", entr:1010, usc:2290},
  {m:"Mar", entr:1570, usc:2260},
  {m:"Apr", entr:1430, usc:2210},
  {m:"Mag", entr:1570, usc:3300},
];

const ATTIVITA_RECENTE = [
  {id:1,tipo:"pagamento",  desc:"Pagamento quota maggio",   sogg:"Sofia Marchetti",   quando:"Oggi, 09:15",  importo:120,  segno:1},
  {id:2,tipo:"pagamento",  desc:"Pagamento quota maggio",   sogg:"Emma Conti",        quando:"Oggi, 08:40",  importo:120,  segno:1},
  {id:3,tipo:"spesa",      desc:"Compenso mensile",         sogg:"Prof. Rossi",       quando:"Ieri, 14:00",  importo:980,  segno:-1},
  {id:4,tipo:"spesa",      desc:"Compenso mensile",         sogg:"Prof. Bianchi",     quando:"Ieri, 14:00",  importo:840,  segno:-1},
  {id:5,tipo:"allievo",    desc:"Nuovo allievo iscritto",   sogg:"Chiara Esposito",   quando:"2 giorni fa",  importo:null, segno:0},
  {id:6,tipo:"pagamento",  desc:"Pagamento iscrizione",     sogg:"Giulia Romano",     quando:"3 giorni fa",  importo:150,  segno:1},
  {id:7,tipo:"evento",     desc:"Masterclass confermata",   sogg:"Sala C — 14 Giugno",quando:"4 giorni fa",  importo:null, segno:0},
];

// ─── OROLOGIO ─────────────────────────────────────────────────────────────────
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);
  const h=String(now.getHours()).padStart(2,"0");
  const m=String(now.getMinutes()).padStart(2,"0");
  const s=String(now.getSeconds()).padStart(2,"0");
  return (
    React.createElement('div', { style: {textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1217}}
      , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:36,fontWeight:300,letterSpacing:"0.04em",lineHeight:1,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1218}}
        , h, React.createElement('span', { style: {animation:"pulse 2s infinite",display:"inline-block",margin:"0 2px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1219}}, ":"), m
        , React.createElement('span', { style: {fontSize:22,color:C.goldDim,marginLeft:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1220}}, s)
      )
      , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1222}}
        , GIORNI[oggi.getDay()], " " , oggi.getDate(), " " , MESI[oggi.getMonth()], " " , oggi.getFullYear()
      )
    )
  );
};

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, sub, hex=C.gold, bg, trend, onClick, hideAmounts }) => {
  const [displayed, setDisplayed] = useState(0);
  const isNum = typeof value === "number";
  const isMonetary = typeof value === "string" && value.startsWith("€");

  useEffect(()=>{
    if(!isNum){ setDisplayed(value); return; }
    let start=0; const end=value; const dur=900;
    const step=()=>{ start+=Math.ceil((end-start)/8)+1; if(start>=end)start=end; setDisplayed(start); if(start<end)requestAnimationFrame(step); };
    setTimeout(()=>requestAnimationFrame(step),200);
  },[value]);

  const displayValue = hideAmounts && isMonetary ? "••••" : (isNum ? displayed : value);

  return (
    React.createElement('div', { className: "kpi-card", onClick: onClick,
      style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,
        padding:"20px 22px",cursor:onClick?"pointer":"default",
        transition:"all 0.18s",position:"relative",overflow:"hidden",
        borderTop:`3px solid ${hex}20`},
      onMouseEnter: e=>{if(onClick){e.currentTarget.style.borderColor=hex;e.currentTarget.style.borderTopColor=hex;}},
      onMouseLeave: e=>{if(onClick){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.borderTopColor=hex+"20";}}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1242}}
      /* Glow */
      , React.createElement('div', { style: {position:"absolute",top:-30,right:-30,width:100,height:100,
        borderRadius:"50%",background:hex,opacity:0.04,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1250}})
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1252}}
        , React.createElement('div', { style: {width:38,height:38,borderRadius:10,background:bg||`${hex}15`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1253}}
          , React.createElement(Ic, { n: icon, size: 18, stroke: hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1255}})
        )
        , trend!==undefined && (
          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:4,fontSize:11,
            color:trend>=0?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1258}}
            , React.createElement(Ic, { n: trend>=0?"up":"down", size: 11, stroke: trend>=0?C.green:C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1260}})
            , Math.abs(trend), "%"
          )
        )
      )
      , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:34,fontWeight:600,
        color:hex,lineHeight:1,letterSpacing:"-0.01em",animation:"countUp 0.4s ease both",
        filter: hideAmounts && isMonetary ? "blur(6px)" : "none",
        transition:"filter 0.2s",userSelect: hideAmounts && isMonetary ? "none" : "auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1265}}
        , displayValue
      )
      , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:6,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1269}}, label)
      , sub && React.createElement('div', { style: {fontSize:12,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1270}}, sub)
    )
  );
};

// ─── MINI GRAFICO FINANZIARIO ─────────────────────────────────────────────────
const MiniChart = ({ dati }) => {
  const maxVal = Math.max(...dati.flatMap(d=>[d.entr,d.usc]),1);
  const [hov, setHov] = useState(null);

  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1281}}
      , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:6,height:80,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1282}}
        , dati.map((d,i)=>{
          const hE = Math.max((d.entr/maxVal)*76, d.entr>0?3:0);
          const hU = Math.max((d.usc/maxVal)*76,  d.usc>0?3:0);
          const isHov = hov===i;
          return (
            React.createElement('div', { key: i, style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0},
              onMouseEnter: ()=>setHov(i), onMouseLeave: ()=>setHov(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1288}}
              , isHov && (
                React.createElement('div', { style: {position:"absolute",background:C.surface2,border:`1px solid ${C.border}`,
                  borderRadius:6,padding:"5px 8px",fontSize:10,whiteSpace:"nowrap",
                  transform:"translateY(-60px)",color:C.text,zIndex:10,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1291}}
                  , React.createElement('div', { style: {color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1294}}, "↑ " , fmtD(d.entr))
                  , React.createElement('div', { style: {color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1295}}, "↓ " , fmtD(d.usc))
                )
              )
              , React.createElement('div', { style: {display:"flex",gap:3,alignItems:"flex-end",width:"100%",justifyContent:"center",height:80,position:"relative"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1298}}
                , React.createElement('div', { className: "bar-fill", style: {flex:1,height:hE,borderRadius:"3px 3px 0 0",
                  background:isHov?C.green:`${C.green}60`,transition:"background 0.15s",
                  animationDelay:`${i*0.06}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1299}})
                , React.createElement('div', { className: "bar-fill", style: {flex:1,height:hU,borderRadius:"3px 3px 0 0",
                  background:isHov?C.red:`${C.red}60`,transition:"background 0.15s",
                  animationDelay:`${i*0.06+0.03}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1302}})
              )
            )
          );
        })
      )
      , React.createElement('div', { style: {display:"flex",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1310}}
        , dati.map((d,i)=>(
          React.createElement('div', { key: i, style: {flex:1,textAlign:"center",fontSize:9,
            color:i===dati.length-1?C.gold:C.textDim,letterSpacing:"0.05em",
            fontWeight:i===dati.length-1?600:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1312}}, d.m)
        ))
      )
    )
  );
};

// ─── LESSON TIMELINE ──────────────────────────────────────────────────────────
const LessonTimeline = ({ lezioni, onLessonClick }) => {
  const oraNum = t => { const [h,m]=(t||"0:0").split(":").map(Number); return h*60+m; };

  // Clock locale che si aggiorna ogni 60s → la timeline scorre col tempo reale
  const [nowLive, setNowLive] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNowLive(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  const nowMins = nowLive.getHours()*60 + nowLive.getMinutes();

  const scrollRef = React.useRef(null);

  // Auto-scroll: porta la prima lezione in corso / prossima in cima al contenitore
  React.useEffect(function() {
    if (!scrollRef.current) return;
    const container = scrollRef.current.closest('[data-timeline-scroll]');
    if (!container) return;
    // Trova il primo elemento non-passato (in corso o futuro)
    const firstActive = scrollRef.current.querySelector('[data-timeline-active]');
    if (firstActive) {
      const containerTop = container.getBoundingClientRect().top;
      const elTop = firstActive.getBoundingClientRect().top;
      const offset = elTop - containerTop + container.scrollTop - 8; // 8px di margine
      container.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [lezioni.length]);

  return (
    React.createElement('div', { ref: scrollRef, style: {display:"flex",flexDirection:"column",gap:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1327}}
      , lezioni.map((l,i)=>{
        const startM = oraNum(l.ora);
        const endM   = startM + l.durata;
        const inCorso= nowMins>=startM && nowMins<endM;
        const passata = nowMins>=endM;
        const prossima= !passata && !inCorso && i===lezioni.findIndex(x=>oraNum(x.ora)>nowMins);
        const clickable = !!onLessonClick;
        const isActive = inCorso || prossima; // primo elemento da mostrare in cima

        const docenteColor = {
          "Prof. Rossi":C.gold,"Prof. Bianchi":C.teal,"Prof. Verde":C.blue,"Prof. Marino":C.purple
        }[l.docente]||C.textMuted;

        return (
          React.createElement('div', { key: l.id, className: "lesson-row",
            'data-timeline-active': isActive ? "1" : undefined,
            onClick: clickable ? ()=>onLessonClick(l.id) : undefined,
            style: {display:"grid",gridTemplateColumns:"52px 4px 1fr auto",
              gap:10,alignItems:"center",padding:"9px 12px",borderRadius:10,
              background:inCorso?`${C.goldBg}cc`:passata?C.bg:C.surface,
              border:`1px solid ${inCorso?C.goldDim:passata?C.border+"60":C.border}`,
              opacity:passata?0.5:1,
              cursor: clickable ? "pointer" : "default",
              transition:"all 0.12s"},
            onMouseEnter: clickable ? e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=inCorso?`${C.goldBg}cc`:`${C.gold}0a`;} : undefined,
            onMouseLeave: clickable ? e=>{e.currentTarget.style.borderColor=inCorso?C.goldDim:passata?C.border+"60":C.border;e.currentTarget.style.background=inCorso?`${C.goldBg}cc`:passata?C.bg:C.surface;} : undefined,
            __self: this, __source: {fileName: _jsxFileName, lineNumber: 1340}}
            /* Ora */
            , React.createElement('div', { style: {textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1347}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:inCorso?C.gold:passata?C.textDim:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1348}}, l.ora)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1349}}, l.durata, "′")
            )
            /* Indicatore */
            , React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",height:"100%",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1352}}
              , React.createElement('div', { style: {width:4,height:4,borderRadius:"50%",flexShrink:0,
                background:inCorso?C.gold:passata?C.textDim:docenteColor,
                boxShadow:inCorso?`0 0 8px ${C.gold}`:undefined,
                animation:inCorso?"pulse 1.5s infinite":undefined}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1353}})
              , i<lezioni.length-1 && React.createElement('div', { style: {flex:1,width:1,background:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1357}})
            )
            /* Contenuto */
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1360}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1361}}
                , React.createElement('span', { style: {fontSize:13,fontWeight:500,color:inCorso?C.gold:C.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1362}}
                  , l.tipo==="collettivo"
                      ? (l.students&&l.students.length>0
                          ? l.students.slice(0,2).map(function(s){return s.name||s.nome||s;}).join(", ")+(l.students.length>2?" +"+( l.students.length-2):"")
                          : l.strumento||"Lezione collettiva")
                      : (l.allievo||l.strumento||"—")
                )
                , inCorso && (
                  React.createElement('span', { style: {fontSize:9,background:C.gold,color:"#ffffff",borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1367}}, "In corso"

                  )
                )
                , prossima && (
                  React.createElement('span', { style: {fontSize:9,background:C.blueBg,color:C.blue,borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0,
                    border:`1px solid ${C.blueBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1373}}, "Prossima"

                  )
                )
                , !l.confermata && !passata && (
                  React.createElement('span', { style: {fontSize:9,background:C.orangeBg,color:C.orange,borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0,
                    border:`1px solid ${C.orangeBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1380}}, "Da confermare"

                  )
                )
                , l.topic && (l.topic.startsWith('🔄') || l.topic.startsWith('Recupero')) && (
                  React.createElement('span', { style: {fontSize:9,background:C.tealBg,color:C.teal,borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",flexShrink:0,
                    border:`1px solid ${C.tealBorder}`}}
                    , "🔄 Recupero"
                  )
                )
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1387}}
                , React.createElement('span', { style: {color:docenteColor}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1388}}, l.docente)
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1389}}, "·")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1390}}, l.strumento)
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1391}}, "·")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1392}}, l.aula)
              )
            )
            /* Tipo */
            , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1396}}
              , React.createElement('span', { style: {fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase",
                color:l.tipo==="collettivo"?C.purple:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1397}}
                , l.tipo==="collettivo"?"Coll.":"Ind."
              )
            )
          )
        );
      })
    )
  );
};

// ─── STATO ALLIEVI DONUT ──────────────────────────────────────────────────────
const StatoAllievi = ({ allievi }) => {
  const conteggi = {
    pagato:  allievi.filter(a=>a.stato==="pagato").length,
    attesa:  allievi.filter(a=>a.stato==="attesa").length,
    scaduto: allievi.filter(a=>a.stato==="scaduto").length,
    sospeso: allievi.filter(a=>a.stato==="sospeso").length,
  };
  const tot = allievi.length;
  const cfg = [
    {k:"pagato", label:"Pagato",    hex:C.green},
    {k:"attesa", label:"In attesa", hex:C.orange},
    {k:"scaduto",label:"Scaduto",   hex:C.red},
    {k:"sospeso",label:"Sospeso",   hex:C.textMuted},
  ];

  // SVG donut
  const R=36, cx=44, cy=44, stroke=14;
  const circ=2*Math.PI*R;
  let offset=0;
  const slices=cfg.map(c=>{
    const pct=(conteggi[c.k]||0)/tot;
    const dash=pct*circ;
    const s={ ...c, pct, dash, offset };
    offset+=dash;
    return s;
  });

  return (
    React.createElement('div', { style: {display:"flex",gap:16,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1438}}
      , React.createElement('svg', { width: 88, height: 88, style: {flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1439}}
        , React.createElement('circle', { cx: cx, cy: cy, r: R, fill: "none", stroke: C.border, strokeWidth: stroke, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1440}})
        , slices.filter(s=>s.dash>0).map((s,i)=>(
          React.createElement('circle', { key: s.k, cx: cx, cy: cy, r: R, fill: "none",
            stroke: s.hex, strokeWidth: stroke,
            strokeDasharray: `${s.dash} ${circ-s.dash}`,
            strokeDashoffset: -s.offset+circ/4,
            style: {transition:"stroke-dasharray 0.6s ease",animationDelay:`${i*0.1}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1442}})
        ))
        , React.createElement('text', { x: cx, y: cy+2, textAnchor: "middle", dominantBaseline: "middle",
          fontFamily: "'Oswald',sans-serif" , fontSize: 22, fontWeight: 600, fill: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1448}}
          , tot
        )
        , React.createElement('text', { x: cx, y: cy+16, textAnchor: "middle", dominantBaseline: "middle",
          fontFamily: "'Open Sans',sans-serif" , fontSize: 8, fill: C.textDim, letterSpacing: "0.08em", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1452}}, "ALLIEVI"

        )
      )
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:7,flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1457}}
        , cfg.map(c=>(
          React.createElement('div', { key: c.k, style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1459}}
            , React.createElement('div', { style: {width:7,height:7,borderRadius:"50%",background:c.hex,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1460}})
            , React.createElement('div', { style: {flex:1,fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1461}}, c.label)
            , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:c.hex,fontFamily:"'Oswald',sans-serif",minWidth:18,textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1462}}
              , conteggi[c.k]||0
            )
          )
        ))
      )
    )
  );
};

// ─── EVENTI PROSSIMI ──────────────────────────────────────────────────────────
const EventiCard = ({ eventi }) => {
  const tipoColor = {
    saggio:"gold",concerto:C.teal,masterclass:C.purple,audizione:C.blue
  };
  const tipoHex = {
    saggio:C.gold,concerto:C.teal,masterclass:C.purple,audizione:C.blue
  };

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1482}}
      , eventi.map(e=>{
        const d=new Date(e.data+"T00:00:00");
        const diff=Math.ceil((d-oggi)/(1000*60*60*24));
        const hex=tipoHex[e.tipo]||C.textMuted;
        return (
          React.createElement('div', { key: e.data, style: {display:"flex",gap:12,alignItems:"center",
            padding:"10px 14px",borderRadius:10,background:C.bg,border:`1px solid ${C.border}`,
            transition:"all 0.15s"},
            onMouseEnter: ev=>ev.currentTarget.style.borderColor=hex,
            onMouseLeave: ev=>ev.currentTarget.style.borderColor=C.border, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1488}}
            /* Data box */
            , React.createElement('div', { style: {width:42,textAlign:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1494}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1495}}
                , d.getDate()
              )
              , React.createElement('div', { style: {fontSize:9,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1498}}
                , MESI[d.getMonth()].slice(0,3)
              )
            )
            , React.createElement('div', { style: {width:1,height:32,background:C.border,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1502}})
            /* Info */
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1504}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1505}}
                , e.titolo
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1508}}
                , e.luogo
              )
            )
            /* Countdown */
            , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1513}}
              , React.createElement('div', { style: {fontSize:11,color:diff<=7?C.orange:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1514}}
                , diff===0?"Oggi":diff===1?"Domani":`${diff}g`
              )
            )
          )
        );
      })
    )
  );
};

// ─── ATTIVITÀ RECENTE ─────────────────────────────────────────────────────────
const AttivitaFeed = ({ items }) => {
  const iconMap = { pagamento:"receipt",spesa:"down",allievo:"user",evento:"star" };
  const colorMap = { pagamento:C.green, spesa:C.red, allievo:C.gold, evento:C.purple };

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1531}}
      , items.map((a,i)=>{
        const hex=colorMap[a.tipo]||C.textMuted;
        return (
          React.createElement('div', { key: a.id, className: "alert-row", style: {display:"flex",alignItems:"center",gap:12,
            padding:"10px 14px",borderRadius:9,transition:"background 0.12s",
            animationDelay:`${i*0.05}s`},
            onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
            onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1535}}
            , React.createElement('div', { style: {width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",
              justifyContent:"center",background:`${hex}15`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1540}}
              , React.createElement(Ic, { n: iconMap[a.tipo], size: 14, stroke: hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1542}})
            )
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1544}}
              , React.createElement('div', { style: {fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1545}}
                , a.desc
                , a.sogg && React.createElement('span', { style: {color:C.textMuted,fontWeight:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1547}}, " — "  , a.sogg)
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1549}}, a.quando)
            )
            , a.importo!==null && (
              React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,
                color:a.segno>0?C.green:C.red,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1552}}
                , a.segno>0?"+":"-", fmtD(a.importo)
              )
            )
          )
        );
      })
    )
  );
};

// ─── ALERT PANEL ──────────────────────────────────────────────────────────────
const AlertPanel = ({ allievi, lezioniOggi }) => {
  const morosi    = allievi.filter(a=>a.stato==="scaduto");
  const daConf    = lezioniOggi.filter(l=>!l.confermata);
  const sospesi   = allievi.filter(a=>a.stato==="sospeso");
  const alerts = [
    ...morosi.map(a=>({tipo:"scaduto", msg:`${a.name} — rate scadute`, hex:C.red, bg:C.redBg, bd:C.redBorder})),
    ...daConf.map(l=>({tipo:"lezione", msg:`${l.ora} ${l.allievo} — lezione da confermare`, hex:C.orange, bg:C.orangeBg, bd:C.orangeBorder})),
    ...sospesi.map(a=>({tipo:"sospeso",msg:`${a.name} — abbonamento sospeso`, hex:C.textMuted, bg:C.surface, bd:C.border})),
  ];
  if(alerts.length===0) return (
    React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,padding:"14px 16px",
      background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1575}}
      , React.createElement(Ic, { n: "check", size: 15, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1577}})
      , React.createElement('span', { style: {fontSize:13,color:C.green,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1578}}, "Nessun alert — tutto in ordine"     )
    )
  );
  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1582}}
      , alerts.map((a,i)=>(
        React.createElement('div', { key: i, className: "alert-row", style: {display:"flex",alignItems:"center",gap:10,
          padding:"10px 14px",background:a.bg,border:`1px solid ${a.bd}`,borderRadius:9,
          animationDelay:`${i*0.06}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1584}}
          , React.createElement(Ic, { n: "alert", size: 14, stroke: a.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1587}})
          , React.createElement('span', { style: {fontSize:12,color:a.hex,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1588}}, a.msg)
        )
      ))
    )
  );
};

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────
// ─── INPUT IMPOSTAZIONI ───────────────────────────────────────────────────────
// ─── MODALE IMPOSTAZIONI ──────────────────────────────────────────────────────
const PANNELLI_DEF = [
  {id:"kpi",       label:"KPI Cards",            desc:"Allievi, lezioni, entrate, uscite, saldo", icon:"chart",    sempre:true},
  {id:"azioni",    label:"Azioni rapide",         desc:"Shortcut ai flussi principali",             icon:"plus"},
  {id:"lezioni",   label:"Lezioni di oggi",       desc:"Timeline con orari e stato",               icon:"calendar"},
  {id:"recuperi",  label:"Recuperi in sospeso",   desc:"Lezioni in recupero con scadenze",          icon:"clock"},
  {id:"grafico",   label:"Andamento finanziario", desc:"Grafico mensile entrate/uscite",            icon:"chart"},
  {id:"pagamenti", label:"Stato pagamenti",       desc:"Donut con distribuzione allievi",           icon:"users"},
  {id:"eventi",    label:"Prossimi eventi",       desc:"Elenco eventi in calendario",               icon:"flag"},
  {id:"report",    label:"Report lezioni mese",   desc:"Allievi oltre/in linea/sotto soglia",       icon:"chart"},
  {id:"alert",     label:"Alert prioritari",      desc:"Morosi, lezioni da confermare",             icon:"alert"},
  {id:"attivita",  label:"Attività recente",      desc:"Feed ultimi movimenti",                     icon:"clock"},
];

const DASH_RUOLI = [
  {id:"admin",   label:"Amministratore", hex:C.gold, desc:"Accesso completo + impostazioni"},
  {id:"docente", label:"Docente",        hex:C.teal, desc:"Proprie lezioni, allievi assegnati, repertorio"},
  {id:"allievo", label:"Allievo",        hex:C.blue, desc:"Dashboard, calendario e concerti propri"},
];

const SettingsDrawer = ({ open, onClose, panels, onPanels, config, onConfig, ruolo, onRuolo, anniScolastici:_anniScolasticiRaw, setAnniScolastici }) => {
  const anniScolastici = _anniScolasticiRaw || [];
  const [tab, setTab]     = useState("dashboard");
  const [draft, setDraft] = useState(config);
  const [logoMode, setLogoMode] = useState("icon"); // "icon" | "text" | "image"
  const isAdmin = ruolo==="admin";

  // Sync draft when config changes from outside
  useState(()=>setDraft(config),[config]);

  const setD = (k,v) => setDraft(p=>({...p,[k]:v}));

  const handleSave = async () => {
    const annoAs = (anniScolastici||[]).find(a=>a.stato==="attivo");
    const newConfig = {...draft, annoInizioAttivo: _nullishCoalesce(_optionalChain([annoAs, 'optionalAccess', _7 => _7.annoInizio]), () => ( draft.annoInizioAttivo))};
    onConfig(newConfig);

    try {
      const sb = window.supabaseClient;
      if (!sb) throw new Error('supabaseClient non disponibile');

      // ── 1. Salva sito_config (impostazioni generali + panels) ──────────────
      const rows = [];
      Object.entries(newConfig).forEach(([chiave, valore]) => {
        if (typeof valore === 'function') return;
        rows.push({ chiave, valore: valore == null ? '' : typeof valore === 'object' ? JSON.stringify(valore) : String(valore) });
      });
      rows.push({ chiave: 'dashboardPanels', valore: JSON.stringify(panels||{}) });
      // Rimuovi eventuali vecchie chiavi anni da sito_config
      rows.push({ chiave: 'anniScolastici', valore: '[]' }); // legacy cleanup

      await sb.from('sito_config').delete().neq('chiave', '___x___');
      const { error: cfgErr } = await sb.from('sito_config').insert(rows);
      if (cfgErr) console.warn('[FM] sito_config INSERT error:', cfgErr.message);

      // ── 2. Sincronizza tabella anni_scolastici ──────────────────────────────
      if (anniScolastici && anniScolastici.length > 0) {
        for (const a of anniScolastici) {
          await sb.from('anni_scolastici').upsert({
            id: a.id, label: a.label,
            anno_inizio: a.annoInizio, stato: a.stato, note: a.note || null,
          }, { onConflict: 'id' });
        }
      }

      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:999999;padding:14px 28px;border-radius:12px;font-family:"Open Sans",sans-serif;font-size:14px;font-weight:600;color:#fff;background:#16a34a;box-shadow:0 8px 32px rgba(0,0,0,0.35);white-space:nowrap;';
      el.textContent = '✅  Impostazioni salvate!';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
      if (window.__FM_RELOAD__) window.__FM_RELOAD__({ anniScolastici, dashboardPanels: panels });

    } catch(e) { console.warn('[FM] SettingsDrawer save catch:', e?.message); alert('Errore: ' + e?.message); }

    onClose();
  };

  if(!open) return null;

  return (
    React.createElement(React.Fragment, null
      /* Overlay */
      , React.createElement('div', { onClick: onClose, style: {position:"fixed",inset:0,zIndex:300,
        background:"rgba(0,0,0,0.7)",backdropFilter:"blur(3px)",animation:"fadeIn 0.2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1639}})

      /* Drawer */
      , React.createElement('div', { style: {position:"fixed",top:0,right:0,bottom:0,zIndex:301,width:520,
        background:C.surface,borderLeft:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",animation:"slideDrawer 0.28s cubic-bezier(.4,0,.2,1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1643}}

        /* Header */
        , React.createElement('div', { style: {padding:"18px 22px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1648}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1650}}
            , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:C.goldBg,
              display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1651}}
              , React.createElement(Ic, { n: "settings", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1653}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1655}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1656}}, "Impostazioni")
              , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1657}}, "Dashboard e configurazione sistema"   )
            )
          )
          , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
            color:C.textMuted,padding:6,display:"flex",borderRadius:6},
            onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
            onMouseLeave: e=>e.currentTarget.style.background="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1660}}
            , React.createElement(Ic, { n: "x", size: 18, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1664}})
          )
        )

        /* Tabs */
        , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1669}}
          , [
            ["dashboard","grid",    "Dashboard"],
            ["ricevuta","receipt",  "Ricevuta"],
            ...(isAdmin?[["admin","settings","Amministrazione"]]:  []),
          ].map(([v,ic,lbl])=>(
            React.createElement('button', { key: v, onClick: ()=>setTab(v),
              style: {flex:1,padding:"12px 0",display:"flex",alignItems:"center",justifyContent:"center",
                gap:6,background:"none",border:"none",cursor:"pointer",fontSize:13,
                color:tab===v?C.gold:C.textMuted,fontFamily:"'Open Sans',sans-serif",
                borderBottom:`2px solid ${tab===v?C.gold:"transparent"}`,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1674}}
              , React.createElement(Ic, { n: ic, size: 13, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1679}}), lbl
            )
          ))
        )

        /* Body */
        , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"20px 22px",display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1685}}

          /* ── TAB DASHBOARD ── */
          , tab==="dashboard" && (
            React.createElement(React.Fragment, null
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1690}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1691}}, "Pannelli visibili" )
                , React.createElement('div', { style: {fontSize:12,color:C.textDim,marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1692}}, "Attiva/disattiva e riordina i pannelli della dashboard con le frecce ▲▼."
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1695}}
                  , (() => {
                      // Ricostruisci ordine pannelli da panels.panelOrder (se esiste)
                      const order = (panels.panelOrder && panels.panelOrder.length > 0)
                        ? panels.panelOrder
                        : PANNELLI_DEF.map(p=>p.id);
                      const ordered = order
                        .map(id => PANNELLI_DEF.find(p=>p.id===id))
                        .filter(Boolean)
                        .concat(PANNELLI_DEF.filter(p=>!order.includes(p.id)));

                      const movePanel = (idx, dir) => {
                        const newOrder = ordered.map(p=>p.id);
                        const target = idx + dir;
                        // Non permettere di muovere i pannelli "sempre" fuori dalla posizione fissa
                        if (target < 0 || target >= newOrder.length) return;
                        [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
                        onPanels(p => ({...p, panelOrder: newOrder}));
                      };

                      return ordered.map((p, idx) => {
                        const on = panels[p.id]!==false;
                        return React.createElement('div', { key: p.id,
                          style: {display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                            borderRadius:10,border:`1px solid ${on&&!p.sempre?C.goldDim:C.border}`,
                            background:on&&!p.sempre?C.goldBg:C.bg,transition:"all 0.15s",
                            opacity:p.sempre?0.75:1}}
                          /* Frecce riordino */
                          , React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}
                            , React.createElement('button',{onClick:()=>movePanel(idx,-1),disabled:idx===0,
                                style:{padding:'1px 5px',borderRadius:4,border:`1px solid ${C.border}`,background:'none',cursor:idx===0?'not-allowed':'pointer',color:idx===0?C.textDim:C.textMuted,fontSize:10,lineHeight:1,opacity:idx===0?0.3:1}},'▲')
                            , React.createElement('button',{onClick:()=>movePanel(idx,+1),disabled:idx===ordered.length-1,
                                style:{padding:'1px 5px',borderRadius:4,border:`1px solid ${C.border}`,background:'none',cursor:idx===ordered.length-1?'not-allowed':'pointer',color:idx===ordered.length-1?C.textDim:C.textMuted,fontSize:10,lineHeight:1,opacity:idx===ordered.length-1?0.3:1}},'▼')
                          )
                          , React.createElement('div', { style: {width:28,height:28,borderRadius:8,
                            background:on?`${C.gold}18`:C.surface,
                            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                            , React.createElement(Ic, { n: p.icon, size: 13, stroke: on?C.gold:C.textDim})
                          )
                          , React.createElement('div', { style: {flex:1}}
                            , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:on?C.text:C.textMuted}}, p.label)
                            , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:1}}, p.desc)
                          )
                          , p.sempre
                            ? React.createElement('span', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.06em"}}, "FISSO")
                            : React.createElement(Toggle, { value: on, onChange: v=>onPanels(prev=>({...prev,[p.id]:v}))})
                        );
                      });
                    })()
                )
              )

              /* ── Ordine KPI cards (solo admin) ── */
              , isAdmin && React.createElement('div', null
                , React.createElement('div', {style:{fontSize:13,fontWeight:500,marginBottom:4}}, 'Ordine KPI cards')
                , React.createElement('div', {style:{fontSize:12,color:C.textDim,marginBottom:14}}, 'Trascina o usa le frecce per cambiare l\'ordine delle card nella dashboard.')
                , (() => {
                    const ALL_KPI_DEF = [
                      {id:'allievi', icon:'users',    label:'Allievi attivi'},
                      {id:'lezioni', icon:'calendar', label:'Lezioni oggi'},
                      {id:'entrate', icon:'up',       label:'Entrate mese'},
                      {id:'uscite',  icon:'down',     label:'Uscite mese'},
                      {id:'saldo',   icon:'chart',    label:'Saldo anno'},
                    ];
                    const kpiOrder = (panels.kpiOrder && panels.kpiOrder.length > 0)
                      ? panels.kpiOrder
                      : ALL_KPI_DEF.map(k=>k.id);
                    const ordered = kpiOrder
                      .map(id => ALL_KPI_DEF.find(k=>k.id===id))
                      .filter(Boolean)
                      .concat(ALL_KPI_DEF.filter(k=>!kpiOrder.includes(k.id)));

                    const moveKpi = (idx, dir) => {
                      const newOrder = [...ordered.map(k=>k.id)];
                      const target = idx + dir;
                      if (target < 0 || target >= newOrder.length) return;
                      [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
                      onPanels(p => ({...p, kpiOrder: newOrder}));
                    };

                    return React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:6}}
                      , ordered.map((k, idx) =>
                          React.createElement('div', {key:k.id,
                              style:{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',
                                borderRadius:10,border:`1px solid ${C.border}`,background:C.bg}}
                            , React.createElement('div',{style:{width:24,height:24,borderRadius:6,background:`${C.gold}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
                              , React.createElement(Ic,{n:k.icon,size:13,stroke:C.gold}))
                            , React.createElement('span',{style:{flex:1,fontSize:13,color:C.text,fontWeight:500}}, k.label)
                            , React.createElement('span',{style:{fontSize:11,color:C.textDim,marginRight:4}}, `#${idx+1}`)
                            , React.createElement('button',{onClick:()=>moveKpi(idx,-1),disabled:idx===0,
                                style:{padding:'3px 7px',borderRadius:6,border:`1px solid ${C.border}`,background:'none',cursor:idx===0?'not-allowed':'pointer',color:idx===0?C.textDim:C.text,fontFamily:"'Open Sans',sans-serif",fontSize:13,opacity:idx===0?0.4:1}},'▲')
                            , React.createElement('button',{onClick:()=>moveKpi(idx,+1),disabled:idx===ordered.length-1,
                                style:{padding:'3px 7px',borderRadius:6,border:`1px solid ${C.border}`,background:'none',cursor:idx===ordered.length-1?'not-allowed':'pointer',color:idx===ordered.length-1?C.textDim:C.text,fontFamily:"'Open Sans',sans-serif",fontSize:13,opacity:idx===ordered.length-1?0.4:1}},'▼')
                          )
                        )
                    );
                  })()
              )

              /* Ruolo simulazione */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1724}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1725}}, "Ruolo corrente" )
                , React.createElement('div', { style: {fontSize:12,color:C.textDim,marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1726}}, "Simula la vista per ruolo diverso. In produzione il ruolo sarà assegnato dall'amministratore."
                )
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1729}}
                  , DASH_RUOLI.map(r=>(
                    React.createElement('button', { key: r.id, onClick: ()=>onRuolo(r.id),
                      style: {padding:"11px 14px",borderRadius:10,textAlign:"left",cursor:"pointer",
                        fontFamily:"'Open Sans',sans-serif",transition:"all 0.15s",
                        background:ruolo===r.id?`${r.hex}18`:C.bg,
                        border:`1.5px solid ${ruolo===r.id?r.hex:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1731}}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1736}}, r.label)
                      , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1737}}, r.desc)
                    )
                  ))
                )
              )
            )
          )

          /* ── TAB AMMINISTRAZIONE ── */
          , tab==="admin" && isAdmin && (
            React.createElement(React.Fragment, null
              /* Identità */
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1749}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1750}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1752}}), "Identità scuola"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1755}}
                  , React.createElement(SField, { label: "Nome associazione / scuola *"    ,
                    value: draft.nomeScuola, onChange: e=>setD("nomeScuola",e.target.value),
                    placeholder: "Es. Accademia Musicale Roma"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1756}})
                  , React.createElement(SField, { label: "Sottotitolo / tipo ente"   ,
                    value: draft.tipoEnte, onChange: e=>setD("tipoEnte",e.target.value),
                    placeholder: "Es. Associazione Musicale APS"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1759}})
                  /* Logo */
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1763}}
                    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",
                      textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1764}}, "Logo")
                    , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1766}}
                      , [["icon","Icona"],["text","Iniziali"],["image","Immagine URL"]].map(([v,l])=>(
                        React.createElement('button', { key: v, onClick: ()=>setLogoMode(v),
                          style: {flex:1,padding:"7px 0",borderRadius:7,fontSize:12,cursor:"pointer",
                            fontFamily:"'Open Sans',sans-serif",
                            background:logoMode===v?C.goldBg:C.bg,
                            color:logoMode===v?C.gold:C.textMuted,
                            border:`1px solid ${logoMode===v?C.goldDim:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1768}}, l)
                      ))
                    )
                    , logoMode==="icon" && (
                      React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1777}}
                        , ["music","star","flag","euro2","users","bell"].map(ic=>(
                          React.createElement('button', { key: ic, onClick: ()=>setD("logoIcon",ic),
                            style: {width:40,height:40,borderRadius:9,cursor:"pointer",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              background:draft.logoIcon===ic?C.goldBg:C.bg,
                              border:`1.5px solid ${draft.logoIcon===ic?C.gold:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1779}}
                            , React.createElement(Ic, { n: ic, size: 18, stroke: draft.logoIcon===ic?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1784}})
                          )
                        ))
                        /* Colore logo */
                        , React.createElement('div', { style: {display:"flex",gap:6,marginLeft:4,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1788}}
                          , [C.gold,C.teal,C.purple,C.blue,C.green,C.red].map(col=>(
                            React.createElement('button', { key: col, onClick: ()=>setD("logoColor",col),
                              style: {width:22,height:22,borderRadius:"50%",cursor:"pointer",
                                background:col,border:`2px solid ${draft.logoColor===col?"#fff":col}`,
                                transition:"transform 0.1s",transform:draft.logoColor===col?"scale(1.2)":"scale(1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1790}})
                          ))
                        )
                      )
                    )
                    , logoMode==="text" && (
                      React.createElement(SField, { label: "Testo iniziali (max 2 caratteri)"    ,
                        value: draft.logoText, onChange: e=>setD("logoText",e.target.value.slice(0,2).toUpperCase()),
                        placeholder: "AM", maxLength: 2, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1799}})
                    )
                    , logoMode==="image" && (
                      React.createElement(SField, { label: "URL immagine logo"  ,
                        value: draft.logoUrl, onChange: e=>setD("logoUrl",e.target.value),
                        placeholder: "https://...", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1804}})
                    )
                  )
                )
              )

              /* Dati fiscali / ricevute */
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1813}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1814}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1816}}), "Dati ricevute e fatture"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1819}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1820}}
                    , React.createElement(SField, { label: "Codice fiscale / P.IVA"   ,
                      value: draft.codiceFiscale, onChange: e=>setD("codiceFiscale",e.target.value),
                      placeholder: "00000000000", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1821}})
                    , React.createElement(SField, { label: "Codice SDI / PEC"   ,
                      value: draft.sdi, onChange: e=>setD("sdi",e.target.value),
                      placeholder: "XXXXXXX o PEC"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1824}})
                  )
                  , React.createElement(SField, { label: "Sede legale / indirizzo"   ,
                    value: draft.indirizzo, onChange: e=>setD("indirizzo",e.target.value),
                    placeholder: "Via della Musica 1, 00100 Roma (RM)"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1828}})
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1831}}
                    , React.createElement(SField, { label: "Telefono",
                      value: draft.telefono, onChange: e=>setD("telefono",e.target.value),
                      placeholder: "+39 06 1234567"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1832}})
                    , React.createElement(SField, { label: "Email",
                      value: draft.email, onChange: e=>setD("email",e.target.value),
                      placeholder: "info@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1835}})
                  )
                  , React.createElement(SField, { label: "IBAN bonifici" ,
                    value: draft.iban, onChange: e=>setD("iban",e.target.value),
                    placeholder: "IT00 X000 0000 0000 0000 0000 000"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1839}})
                  , React.createElement(SField, { label: "Nota a piè di ricevuta"    ,
                    value: draft.notaRicevuta, onChange: e=>setD("notaRicevuta",e.target.value),
                    placeholder: "Es. Associazione no-profit ex art. 148 TUIR"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1842}})
                )
              )

              /* Anno scolastico */
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1849}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1850}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1852}}), "Anno scolastico e calendario"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1855}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1856}}
                    , React.createElement(SField, { label: "Anno scolastico" ,
                      value: draft.annoScolastico, onChange: e=>setD("annoScolastico",e.target.value),
                      placeholder: "2024/2025", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1857}})
                    , React.createElement(SField, { label: "Inizio anno (data)"  ,
                      type: "date", value: draft.inizioAnno, onChange: e=>setD("inizioAnno",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1860}})
                  )
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1863}}
                    , React.createElement(SField, { label: "Fine anno (data)"  ,
                      type: "date", value: draft.fineAnno, onChange: e=>setD("fineAnno",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1864}})
                    , React.createElement(SField, { label: "Giorno saggio finale"  ,
                      type: "date", value: draft.dataSaggio, onChange: e=>setD("dataSaggio",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1866}})
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1869}}
                    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",
                      display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1870}}, "Mesi attivi (lezioni)"  )
                    , React.createElement('div', { style: {display:"flex",gap:5,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1872}}
                      , MESI.map((m,i)=>{
                        const on=(draft.mesiAttivi||[]).includes(i);
                        return (
                          React.createElement('button', { key: i, onClick: ()=>setD("mesiAttivi",
                            on?(draft.mesiAttivi||[]).filter(x=>x!==i):[...(draft.mesiAttivi||[]),i].sort()),
                            style: {padding:"5px 10px",borderRadius:6,fontSize:11,cursor:"pointer",
                              fontFamily:"'Open Sans',sans-serif",background:on?C.goldBg:C.bg,
                              color:on?C.gold:C.textDim,border:`1px solid ${on?C.goldDim:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1876}}
                            , m.slice(0,3)
                          )
                        );
                      })
                    )
                  )
                )
              )

              /* Anni Scolastici */
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1891}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}}), "Soglie lezioni mensili"
                )
                , React.createElement('p', {style:{fontSize:12,color:C.textMuted,marginBottom:12,lineHeight:1.5}}
                  , 'Definisci quante lezioni standard prevede il mese. Verranno generate notifiche per gli allievi che superano queste soglie (salvo eccezioni individuali).'
                )
                , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}
                  , React.createElement(SField, {
                      label: "Lezioni individuali / mese",
                      type: "number",
                      value: draft.sogliaLezioniIndividuali != null ? draft.sogliaLezioniIndividuali : 4,
                      onChange: e => setD("sogliaLezioniIndividuali", Math.max(1, parseInt(e.target.value)||4)),
                      placeholder: "4",
                    })
                  , React.createElement(SField, {
                      label: "Lezioni collettive / mese",
                      type: "number",
                      value: draft.sogliaLezioniCollettive != null ? draft.sogliaLezioniCollettive : 4,
                      onChange: e => setD("sogliaLezioniCollettive", Math.max(1, parseInt(e.target.value)||4)),
                      placeholder: "4",
                    })
                )
              )

              /* Anni Scolastici */
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1891}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1892}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1894}}), "Storico anni scolastici"
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1897}}
                  /* Lista anni — se vuota mostra placeholder di caricamento */
                  , anniScolastici.length === 0 && (
                    React.createElement('div', {style:{padding:'14px 16px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,color:C.textDim,fontStyle:'italic'}}
                      , '⏳ Caricamento anni scolastici dal database...'
                      , React.createElement('br',null)
                      , React.createElement('span',{style:{fontSize:11,color:C.textMuted}}, 'Se persiste, premi ⟳ Aggiorna nella barra laterale')
                    )
                  )
                  , anniScolastici.slice().sort((a,b)=>b.annoInizio-a.annoInizio).map(as=>{
                    const isAttivo = as.stato==="attivo";
                    return (
                      React.createElement('div', { key: as.id, style: {background:C.bg,border:`1px solid ${isAttivo?C.gold:C.border}`,
                        borderRadius:10,padding:"12px 16px",
                        borderLeft:`3px solid ${isAttivo?C.gold:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1902}}
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1905}}
                          , React.createElement('span', { style: {fontSize:14,fontWeight:600,color:isAttivo?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1906}}, as.label)
                          , isAttivo && (
                            React.createElement('span', { style: {fontSize:10,background:C.goldBg,color:C.gold,
                              border:`1px solid ${C.goldDim}`,borderRadius:4,padding:"1px 7px",
                              letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1908}}, "Attivo")
                          )
                          , as.stato==="archiviato" && (
                            React.createElement('span', { style: {fontSize:10,background:C.bg,color:C.textDim,
                              border:`1px solid ${C.border}`,borderRadius:4,padding:"1px 7px",
                              letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1913}}, "Archiviato")
                          )
                        )
                        , as.note && React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1918}}, as.note)
                        , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1919}}
                          , !isAttivo && (
                            React.createElement('button', { onClick: async ()=>{
                              // Aggiorna React state
                              setAnniScolastici(p=>p.map(a=>({...a,stato:a.id===as.id?"attivo":"archiviato"})));
                              setDraft(p=>({...p,annoScolastico:as.label,annoInizioAttivo:as.annoInizio}));
                              setD("annoScolastico",as.label);
                              setD("annoInizioAttivo",as.annoInizio);
                              if (onConfig) onConfig(c=>({...c,annoScolastico:as.label,annoInizioAttivo:as.annoInizio}));
                              // Scrivi subito nel DB — imposta questo attivo e tutti gli altri archiviati
                              const sb = window.supabaseClient;
                              if (sb) {
                                await sb.from('anni_scolastici').update({ stato: 'archiviato' }).neq('id', as.id);
                                await sb.from('anni_scolastici').update({ stato: 'attivo' }).eq('id', as.id);
                              }
                            },
                              style: {fontSize:11,padding:"3px 10px",borderRadius:6,cursor:"pointer",
                                background:C.goldBg,color:C.gold,border:`1px solid ${C.goldDim}`,
                                fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1921}}, "Imposta attivo"
                            )
                          )
                          , React.createElement('button', { onClick: ()=>setAnniScolastici(p=>p.filter(a=>a.id!==as.id)),
                            disabled: isAttivo,
                            style: {fontSize:11,padding:"3px 10px",borderRadius:6,
                              cursor:isAttivo?"not-allowed":"pointer",opacity:isAttivo?0.3:1,
                              background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,
                              fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1932}}, "Rimuovi"

                          )
                        )
                      )
                    );
                  })
                  /* Nuovo anno scolastico */
                  , (() => {
                    const attivoAs = anniScolastici.find(a=>a.stato==="attivo");
                    const nextAnno = attivoAs ? attivoAs.annoInizio+1 : new Date().getFullYear();
                    const nextLabel = `${nextAnno}/${nextAnno+1}`;
                    const esiste = anniScolastici.some(a=>a.annoInizio===nextAnno);
                    return !esiste ? (
                      React.createElement('button', { onClick: async ()=>{
                        const newAs = {
                          id:`as-${nextAnno}`, label:nextLabel, annoInizio:nextAnno, stato:"archiviato", note:""
                        };
                        // Scrivi nel DB prima di aggiornare React state
                        const sb = window.supabaseClient;
                        if (sb) {
                          const { error } = await sb.from('anni_scolastici').upsert({
                            id: newAs.id, label: newAs.label,
                            anno_inizio: newAs.annoInizio, stato: newAs.stato, note: null,
                          }, { onConflict: 'id', ignoreDuplicates: true });
                          if (error && error.code !== '23505') { alert('Errore creazione anno: ' + error.message); return; }
                        }
                        setAnniScolastici(p => p.find(x=>x.id===newAs.id) ? p : [...p, newAs]);
                      },
                        style: {display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                          padding:"10px 16px",borderRadius:10,cursor:"pointer",
                          background:"transparent",color:C.textMuted,border:`1px dashed ${C.border}`,
                          fontSize:12,fontFamily:"'Open Sans',sans-serif",width:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1951}}
                        , React.createElement(Ic, { n: "plus", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1961}}), "Crea anno "
                          , nextLabel
                      )
                    ) : null;
                  })()
                )
              )

              /* Numerazione ricevute */
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1970}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1971}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1973}}), "Numerazione documenti"

                )
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1976}}
                  , React.createElement(SField, { label: "Prossimo numero ricevuta"  ,
                    type: "number", value: draft.progressivoRicevute,
                    onChange: e=>setD("progressivoRicevute",Number(e.target.value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1977}})
                  , React.createElement('div', { style: {display:"flex",alignItems:"center",paddingTop:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1980}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1981}}, "Formato: "
                       , React.createElement('span', { style: {color:C.gold,fontFamily:"'Oswald',sans-serif",fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1982}}
                        , String(draft.progressivoRicevute||1).padStart(3,"0"), "/", new Date().getFullYear()
                      )
                    )
                  )
                )
              )
            )
          )

          /* ── TAB RICEVUTA ── */
          , tab==="ricevuta" && (() => {
            const rs = draft.ricevutaStyle || {};
            const setRS = (k,v) => setD("ricevutaStyle", {...(draft.ricevutaStyle||{}), [k]:v});
            const ac = rs.accentColor || "#1a4fa0";
            const Toggle = ({k, label}) => {
              const val = rs[k]!==false;
              return React.createElement('label', {style:{display:"flex",alignItems:"center",gap:8,cursor:"pointer",
                fontSize:13,color:val?C.text:C.textMuted,padding:"5px 0"}}
                , React.createElement('div', {
                    onClick:()=>setRS(k,!val),
                    style:{width:34,height:20,borderRadius:10,background:val?ac:"#444",position:"relative",cursor:"pointer",transition:"background .15s",flexShrink:0}}
                  , React.createElement('div', {style:{position:"absolute",top:3,left:val?15:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .15s"}})
                )
                , label
              );
            };
            const SF = ({label, k, placeholder}) => React.createElement('div', {style:{marginBottom:12}}
              , React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginBottom:4,letterSpacing:".06em",textTransform:"uppercase"}}, label)
              , React.createElement('input', {value:rs[k]||"", onChange:e=>setRS(k,e.target.value),
                  placeholder, style:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                  color:C.text,fontSize:13,padding:"9px 12px",fontFamily:"'Open Sans',sans-serif"}})
            );

            return React.createElement(React.Fragment, null
              /* ANTEPRIMA */
              , React.createElement('section', null
                , React.createElement('div', {style:{fontSize:11,color:C.gold,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}
                  , React.createElement(Ic,{n:"receipt",size:12,stroke:C.gold}), "Anteprima ricevuta"
                )
                , React.createElement('div', {style:{background:"#f0ede8",borderRadius:10,padding:"16px",marginBottom:4}}
                  , React.createElement('div', {style:{background:"#fff",borderRadius:8,padding:"18px 22px",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",fontSize:11}}
                    , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:`2px solid ${ac}`,paddingBottom:10,marginBottom:12}}
                      , React.createElement('div', null
                        , React.createElement('div', {style:{fontFamily:`'${rs.fontTitle||"Oswald"}',sans-serif`,fontSize:15,fontWeight:700,color:"#1a1a2e"}}, draft.nomeScuola||"Accademia Musicale")
                        , draft.tipoEnte && React.createElement('div', {style:{fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:".08em",marginTop:1}}, draft.tipoEnte)
                        , rs.showIndirizzo!==false && draft.indirizzo && React.createElement('div', {style:{fontSize:9,color:"#666",marginTop:2}}, draft.indirizzo)
                      )
                      , React.createElement('div', {style:{textAlign:"right"}}
                        , React.createElement('div', {style:{fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:".08em"}}, "Ricevuta n°")
                        , React.createElement('div', {style:{fontFamily:`'${rs.fontTitle||"Oswald"}',sans-serif`,fontSize:18,fontWeight:700,color:ac,lineHeight:1}}, "025/2026")
                        , React.createElement('div', {style:{fontSize:9,color:"#888",marginTop:1}}, "del 04/03/2026")
                      )
                    )
                    , [
                        rs.showNominativo!==false   && ["Ricevuta da","Giulia Romano"],
                        rs.showDataNascita!==false  && ["Data di nascita","30/09/2011"],
                        rs.showDataPagamento!==false&& ["Data pagamento","11/02/2026"],
                        rs.showDescrizione!==false  && ["Descrizione","Quota mensile Febbraio 2026"],
                        rs.showCompetenza!==false   && ["Competenza","Febbraio 2026"],
                        rs.showMetodo!==false       && ["Metodo di pagamento","Bonifico bancario"],
                      ].filter(Boolean).map(([k,v],i,arr)=>
                        React.createElement('div', {key:k, style:{display:"flex",justifyContent:"space-between",padding:"4px 0",
                          borderBottom:i<arr.length-1?"1px solid #eee":"none"}}
                          , React.createElement('span', {style:{color:"#888"}}, k)
                          , React.createElement('span', {style:{fontWeight:600,color:"#1a1a2e"}}, v)
                        )
                      )
                    , React.createElement('div', {style:{textAlign:"center",margin:"10px 0",padding:"10px",border:`2px solid ${ac}`,borderRadius:6,background:ac+"12"}}
                      , React.createElement('div', {style:{fontFamily:`'${rs.fontTitle||"Oswald"}',sans-serif`,fontSize:22,fontWeight:700,color:ac}}, "€ 95,00")
                      , React.createElement('div', {style:{fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:".1em",marginTop:2}}, "Importo ricevuto")
                    )
                    , rs.showFirme!==false && React.createElement('div', {style:{display:"flex",justifyContent:"space-between",marginTop:12,marginBottom:4}}
                      , [rs.labelPagante||"Il pagante", rs.labelCassiere||"Il cassiere / responsabile"].map(l=>
                          React.createElement('div', {key:l, style:{textAlign:"center",width:"42%"}}
                            , React.createElement('div', {style:{borderTop:"1px solid #333",marginBottom:3}})
                            , React.createElement('div', {style:{fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:".06em"}}, l)
                          )
                        )
                    )
                    , rs.showFooter!==false && React.createElement('div', {style:{marginTop:8,paddingTop:6,borderTop:"1px solid #eee",textAlign:"center",fontSize:9,color:"#888",lineHeight:1.6}}
                      , draft.notaRicevuta||"Ricevuta non fiscale"
                      , React.createElement('br', null)
                      , draft.nomeScuola, " · ", draft.annoScolastico
                      , rs.noteFooter && React.createElement(React.Fragment, null, React.createElement('br',null), rs.noteFooter)
                    )
                  )
                )
              )

              /* COLORE E FONT */
              , React.createElement('section', null
                , React.createElement('div', {style:{fontSize:11,color:C.gold,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}
                  , React.createElement(Ic,{n:"palette",size:12,stroke:C.gold}), "Stile grafico"
                )
                , React.createElement('div', {style:{marginBottom:12}}
                  , React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginBottom:8,letterSpacing:".06em",textTransform:"uppercase"}}, "Colore principale")
                  , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:8,marginBottom:8}}
                    , ["#1a4fa0","#2d6a8f","#6a4c93","#2a7d4f","#c0392b","#1a1a2e","#555555"].map(col=>
                        React.createElement('button', {key:col, onClick:()=>setRS("accentColor",col),
                          style:{width:26,height:26,borderRadius:"50%",background:col,border:ac===col?"3px solid #fff":"2px solid transparent",
                            outline:ac===col?`2px solid ${col}`:"none",cursor:"pointer",transition:"all .1s"}}
                        )
                      )
                  )
                  , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
                    , React.createElement('input', {type:"color", value:ac, onChange:e=>setRS("accentColor",e.target.value),
                        style:{width:32,height:32,borderRadius:8,border:"none",cursor:"pointer",padding:0}})
                    , React.createElement('span', {style:{fontSize:12,color:C.textMuted}}, "Colore personalizzato: ", React.createElement('strong',{style:{color:C.text}}, ac))
                  )
                )
                , React.createElement('div', {style:{marginBottom:4}}
                  , React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginBottom:8,letterSpacing:".06em",textTransform:"uppercase"}}, "Font intestazione")
                  , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:6}}
                    , ["Oswald","Open Sans","Georgia","Arial","Helvetica"].map(f=>
                        React.createElement('button', {key:f, onClick:()=>setRS("fontTitle",f),
                          style:{padding:"5px 12px",borderRadius:6,fontSize:12,cursor:"pointer",fontFamily:f,
                            border:`1px solid ${(rs.fontTitle||"Cormorant Garamond")===f?ac:C.border}`,
                            background:(rs.fontTitle||"Cormorant Garamond")===f?ac+"18":C.bg,
                            color:(rs.fontTitle||"Cormorant Garamond")===f?ac:C.textMuted}}
                        , f)
                      )
                  )
                )
              )

              /* CAMPI VISIBILI */
              , React.createElement('section', null
                , React.createElement('div', {style:{fontSize:11,color:C.gold,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}
                  , React.createElement(Ic,{n:"list",size:12,stroke:C.gold}), "Campi da mostrare"
                )
                , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}
                  , React.createElement(Toggle, {k:"showNumeroRicevuta",  label:"Numero ricevuta"})
                  , React.createElement(Toggle, {k:"showDataStampa",      label:"Data stampa"})
                  , React.createElement(Toggle, {k:"showNominativo",      label:"Nominativo"})
                  , React.createElement(Toggle, {k:"showDataNascita",     label:"Data di nascita"})
                  , React.createElement(Toggle, {k:"showDataPagamento",   label:"Data pagamento"})
                  , React.createElement(Toggle, {k:"showDescrizione",     label:"Descrizione"})
                  , React.createElement(Toggle, {k:"showCompetenza",      label:"Competenza"})
                  , React.createElement(Toggle, {k:"showMetodo",          label:"Metodo di pagamento"})
                  , React.createElement(Toggle, {k:"showIndirizzo",       label:"Indirizzo scuola"})
                  , React.createElement(Toggle, {k:"showFirme",           label:"Spazio firme"})
                  , React.createElement(Toggle, {k:"showFooter",          label:"Footer"})
                )
              )

              /* TESTI PERSONALIZZATI */
              , React.createElement('section', null
                , React.createElement('div', {style:{fontSize:11,color:C.gold,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:6}}
                  , React.createElement(Ic,{n:"edit",size:12,stroke:C.gold}), "Testi personalizzati"
                )
                , React.createElement(SF, {label:"Etichetta firma sinistra", k:"labelPagante", placeholder:"Il pagante"})
                , React.createElement(SF, {label:"Etichetta firma destra",   k:"labelCassiere", placeholder:"Il cassiere / responsabile"})
                , React.createElement('div', {style:{marginBottom:12}}
                  , React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginBottom:6,letterSpacing:".06em",textTransform:"uppercase"}}, "Immagine firma cassiere/presidente")
                  , rs.firmaPresidenteUrl && React.createElement('div', {style:{marginBottom:8,display:"flex",alignItems:"center",gap:8}}
                    , React.createElement('img',{src:rs.firmaPresidenteUrl, style:{height:40,borderRadius:4,border:`1px solid ${C.border}`,objectFit:"contain",background:"#fff",padding:3}})
                    , React.createElement('button',{onClick:()=>setRS("firmaPresidenteUrl",""),
                        style:{fontSize:11,color:C.red,background:"none",border:"none",cursor:"pointer",padding:0}}, "✕ Rimuovi")
                  )
                  , React.createElement('label', {style:{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"8px 12px",borderRadius:8,
                      border:`1px dashed ${C.border}`,background:C.bg,color:C.textMuted,fontSize:12}}
                    , React.createElement(Ic,{n:"upload",size:13,stroke:C.textMuted})
                    , rs.firmaPresidenteUrl ? "Cambia immagine firma" : "Carica PNG/JPG..."
                    , React.createElement('input',{type:"file",accept:"image/*",style:{display:"none"},
                        onChange:e=>{
                          const fi=e.target.files[0]; if(!fi)return;
                          const rd=new FileReader();
                          rd.onload=ev=>setRS("firmaPresidenteUrl",ev.target.result);
                          rd.readAsDataURL(fi);
                        }})
                  )
                  , React.createElement('div',{style:{fontSize:10,color:C.textDim,marginTop:4}}, "Apparirà sopra la firma del cassiere nella ricevuta stampata")
                )
                , React.createElement('div', {style:{marginBottom:4}}
                  , React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginBottom:4,letterSpacing:".06em",textTransform:"uppercase"}}, "Note aggiuntive footer")
                  , React.createElement('textarea', {value:rs.noteFooter||"", onChange:e=>setRS("noteFooter",e.target.value),
                      placeholder:"Testo libero sotto il footer (es. IBAN, riferimenti legali...)",
                      rows:3, style:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.text,fontSize:12,padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",resize:"vertical"}})
                )
              )

              /* RESET */
              , React.createElement('div', {style:{paddingTop:8}}
                , React.createElement('button', {
                    onClick:()=>setD("ricevutaStyle", CONFIG_DEFAULT.ricevutaStyle),
                    style:{padding:"7px 14px",borderRadius:8,border:`1px solid ${C.border}`,
                      background:"none",color:C.textMuted,fontSize:12,cursor:"pointer",fontFamily:"'Open Sans',sans-serif"}
                  }, "↺ Ripristina impostazioni predefinite")
              )
            );
          })()
          /* Messaggio non-admin */
          , tab==="admin" && !isAdmin && (
            React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              height:"100%",gap:14,padding:"40px 0",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1994}}
              , React.createElement('div', { style: {width:56,height:56,borderRadius:14,background:C.redBg,
                border:`1px solid ${C.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1996}}
                , React.createElement(Ic, { n: "alert", size: 24, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1998}})
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2000}}
                , React.createElement('div', { style: {fontSize:16,fontWeight:500,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2001}}, "Accesso riservato" )
                , React.createElement('div', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2002}}, "Solo gli utenti con ruolo "
                       , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2003}}, "Amministratore"), " possono modificare la configurazione del sistema."

                )
              )
            )
          )
        )

        /* Footer */
        , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,
          position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2012}}
          , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2014}}, "Ruolo: "
             , React.createElement('span', { style: {color:_optionalChain([DASH_RUOLI, 'access', _8 => _8.find, 'call', _9 => _9(r=>r.id===ruolo), 'optionalAccess', _10 => _10.hex])||C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2015}}
              , (DASH_RUOLI.find(r=>r.id===ruolo)||DASH_RUOLI[0]).label
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2019}}
            , React.createElement('button', { onClick: onClose,
              style: {padding:"8px 16px",background:"none",border:`1px solid ${C.border}`,borderRadius:8,
                color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2020}}, "Annulla"

            )
            , React.createElement('button', { onClick: handleSave,
              style: {padding:"8px 18px",background:C.gold,border:"none",borderRadius:8,
                color:"#ffffff",cursor:"pointer",fontSize:13,fontFamily:"'Open Sans',sans-serif",fontWeight:500,
                display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2025}}
              , React.createElement(Ic, { n: "check", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2029}}), "Salva"
            )
          )
        )
      )
    )
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
// Anno scolastico attivo (annoInizio = anno di settembre)
const annoScolasticoAttivo = oggi.getMonth()>=8 ? oggi.getFullYear() : oggi.getFullYear()-1;

// Anni scolastici: lista di fallback mostrata fino al caricamento dal DB (tabella anni_scolastici)
// Viene sempre sovrascritta dai dati reali in __FM_RELOAD__ — aggiornare qui solo se cambiano i dati iniziali
const INIT_ANNI_SCOLASTICI = [
  { id:"as-2022", label:"2022/2023", annoInizio:2022, stato:"archiviato", note:"Anno regolare. Saggio: 10 giugno 2023." },
  { id:"as-2023", label:"2023/2024", annoInizio:2023, stato:"archiviato", note:"Anno con masterclass internazionale. Saggio: 8 giugno 2024." },
  { id:"as-2024", label:"2024/2025", annoInizio:2024, stato:"archiviato", note:"Anno corrente." },
  { id:"as-2025", label:"2025/2026", annoInizio:2025, stato:"attivo",     note:"" },
];

const CONFIG_DEFAULT = {
  nomeScuola:"Accademia Musicale", tipoEnte:"Sistema gestionale",
  logoIcon:"music", logoColor:C.gold, logoText:"AM", logoUrl:"",
  codiceFiscale:"", pIva:"", sdi:"", indirizzo:"Via della Musica 1, 00100 Roma (RM)",
  telefono:"", email:"", iban:"", intestatarioConto:"",
  notaRicevuta:"Associazione no-profit — ricevuta non fiscale",
  annoScolastico:"2024/2025",
  annoInizioAttivo: annoScolasticoAttivo,
  inizioAnno:`${ANNO}-09-01`, fineAnno:`${ANNO+1}-06-30`, dataSaggio:`${ANNO+1}-06-07`,
  mesiAttivi:[0,1,2,3,4,8,9,10,11],
  progressivoRicevute:29,
  // Chiusure personalizzate: array di {da, a, etichetta}
  giorniChiusi: [],
  // Festività nazionali: oggetto {data: true/false} (true=chiuso, false=aperto)
  festivitaConfig: {},
  ricevutaStyle: {
    accentColor: "#1a4fa0",
    fontTitle: "Oswald",
    fontBody: "Open Sans",
    showIndirizzo: true,
    showDataNascita: true,
    showFirme: true,
    showFooter: true,
    showNumeroRicevuta: true,
    showDataStampa: true,
    showNominativo: true,
    showDataPagamento: true,
    showDescrizione: true,
    showCompetenza: true,
    showMetodo: true,
    noteFooter: "",
    labelPagante: "Il pagante",
    labelCassiere: "Il cassiere / responsabile",
  },
};


// ─── NOTIFICATION BELL ────────────────────────────────────────────────────────
const NotificationBell = ({ students, lessons, richieste, onNavigate, ruolo:_ruoloNB, appUser:_appUserNB, notifiche:_notificheNB, onQuickAction:_onQANB, config:_configNB }) => {
  const ruoloNB = _ruoloNB || "admin";
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  // Chiudi cliccando fuori
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Calcola notifiche live ──────────────────────────────────────────────────
  const oggi = new Date();
  const todayStr = yyyymmdd(oggi);
  const ieri = new Date(oggi); ieri.setDate(oggi.getDate()-1);
  const ieriStr = yyyymmdd(ieri);

  // Helper: filtra lezioni in base al ruolo
  const myDocenteNome = ruoloNB === "docente" ? ((_appUserNB && _appUserNB.nome) || "") : "";
  const myDocenteId   = ruoloNB === "docente" ? ((_appUserNB && _appUserNB.docenteId) || null) : null;
  // Ricava il teacherKey dal record docente reale
  const myDocenteTeacherKey = (function() {
    if (ruoloNB !== "docente") return "";
    var allDoc = window.__docenti__ || [];
    var rec = myDocenteId
      ? allDoc.find(function(d){ return String(d.id) === String(myDocenteId); })
      : allDoc.find(function(d){ return (d.nome||"").toLowerCase() === myDocenteNome.toLowerCase(); });
    return rec ? (rec.teacherKey || rec.nome || myDocenteNome) : myDocenteNome;
  })();
  const myAllievoId   = ruoloNB === "allievo" ? ((_appUserNB && _appUserNB.allievoId) || null) : null;
  const myAllievoNome = ruoloNB === "allievo" ? ((_appUserNB && _appUserNB.nome) || "") : "";

  const myLessons = ruoloNB === "docente"
    ? (lessons||[]).filter(l => myDocenteNome && (l.teacher||"").toLowerCase().includes(myDocenteNome.toLowerCase()))
    : ruoloNB === "allievo"
    ? (lessons||[]).filter(l => myAllievoId
        ? String(l.studentId) === String(myAllievoId)
        : (l.student||"").toLowerCase().includes(myAllievoNome.toLowerCase()))
    : (lessons||[]); // admin vede tutto

  const notifs = [];

  // 1. Nuove richieste accesso (solo ADMIN)
  if (ruoloNB === "admin") {
    const richiesteAttesa = (richieste||[]).filter(r=>r.stato==='in_attesa'||!r.stato);
    if (richiesteAttesa.length > 0) {
      notifs.push({
        id:'richieste', tipo:'info',
        icon:'users', color: C.blue,
        titolo: `${richiesteAttesa.length} ${richiesteAttesa.length===1?'richiesta':'richieste'} di accesso in attesa`,
        desc: richiesteAttesa.map(r=>r.nome).join(', '),
        action: () => { onNavigate('utenti'); setOpen(false); },
        actionLabel: 'Gestisci utenti',
      });
    }
  }

  // 2. Allievi con rate scadute (solo ADMIN)
  if (ruoloNB === "admin") {
    const morosi = (students||[]).filter(s=>s.status==='scaduto'||s.stato==='scaduto');
    if (morosi.length > 0) {
      notifs.push({
        id:'morosi', tipo:'warning',
        icon:'euro', color: C.orange,
        titolo: `${morosi.length} ${morosi.length===1?'allievo ha':'allievi hanno'} rate scadute`,
        desc: morosi.slice(0,3).map(s=>s.name||s.nome||'').join(', ') + (morosi.length>3?' e altri...':''),
        action: () => { onNavigate('allievi'); setOpen(false); },
        actionLabel: 'Vedi contabilità',
      });
    }
  }

  // 3. Lezioni di oggi senza presenza (ADMIN e DOCENTE, filtrate per ruolo)
  if (ruoloNB === "admin" || ruoloNB === "docente") {
    const lezioniOggiSenzaPresenza = myLessons.filter(l => {
      const d = l.date||l.data||'';
      return d===todayStr && (!l.attendance||l.attendance==='');
    });
    if (lezioniOggiSenzaPresenza.length > 0) {
      notifs.push({
        id:'presenze', tipo:'warning',
        icon:'check', color: C.gold,
        titolo: `${lezioniOggiSenzaPresenza.length} ${lezioniOggiSenzaPresenza.length===1?'lezione oggi senza':'lezioni oggi senza'} presenza`,
        desc: lezioniOggiSenzaPresenza.slice(0,3).map(l=>l.student||l.allievo||'Lezione collettiva').join(', '),
        action: () => { onNavigate('calendario'); setOpen(false); },
        actionLabel: 'Apri calendario',
      });
    }
  }

  // 4. Assenze ieri (ADMIN e DOCENTE, filtrate per ruolo)
  if (ruoloNB === "admin" || ruoloNB === "docente") {
    const presenzeIeri = myLessons.filter(l => {
      const d = l.date||l.data||'';
      return d===ieriStr && l.attendance && l.attendance!=='';
    });
    if (presenzeIeri.length > 0) {
      const assenze = presenzeIeri.filter(l=>l.attendance==='assente'||l.attendance==='giustificato');
      if (assenze.length > 0) {
        notifs.push({
          id:'assenze_ieri', tipo:'info',
          icon:'alert', color: C.red,
          titolo: `${assenze.length} ${assenze.length===1?'assenza':'assenze'} registrate ieri`,
          desc: assenze.slice(0,3).map(l=>l.student||l.allievo||'—').join(', '),
          action: () => { onNavigate('calendario'); setOpen(false); },
          actionLabel: 'Vedi calendario',
        });
      }
    }
  }

  // 5. Recuperi scaduti/in scadenza (ADMIN e DOCENTE, filtrate; ALLIEVO vede i propri)
  const oggi_d = new Date(); oggi_d.setHours(0,0,0,0);
  const lessonsForRecupero = ruoloNB === "allievo" ? myLessons : myLessons;
  const recuperiScaduti = lessonsForRecupero.filter(l => l.inRecupero && l.recuperoScadenza && new Date(l.recuperoScadenza+'T00:00:00') < oggi_d);
  const recuperiInScadenza = lessonsForRecupero.filter(l => {
    if (!l.inRecupero || !l.recuperoScadenza) return false;
    const scad = new Date(l.recuperoScadenza+'T00:00:00');
    const diff = (scad - oggi_d) / 86400000;
    return diff >= 0 && diff <= 5;
  });
  if (recuperiScaduti.length > 0) {
    notifs.push({
      id:'recuperi_scaduti', tipo:'warning',
      icon:'alert', color: C.red,
      titolo: `${recuperiScaduti.length} ${recuperiScaduti.length===1?'lezione in recupero scaduta':'lezioni in recupero scadute'}`,
      desc: ruoloNB === "allievo" ? 'Contatta il tuo docente' : 'Verranno segnate come ASSENTE e pagate al docente',
      action: () => { onNavigate('calendario'); setOpen(false); },
      actionLabel: 'Gestisci recuperi',
    });
  } else if (recuperiInScadenza.length > 0) {
    notifs.push({
      id:'recuperi_in_scadenza', tipo:'warning',
      icon:'clock', color: C.orange,
      titolo: `${recuperiInScadenza.length} ${recuperiInScadenza.length===1?'lezione in recupero':'lezioni in recupero'} in scadenza`,
      desc: recuperiInScadenza.slice(0,3).map(l=>l.student||'—').join(', '),
      action: () => { onNavigate('calendario'); setOpen(false); },
      actionLabel: 'Vedi recuperi',
    });
  }

  // 6. Allievi sospesi (solo ADMIN)
  if (ruoloNB === "admin") {
    const sospesi = (students||[]).filter(s=>s.status==='sospeso'||s.stato==='sospeso');
    if (sospesi.length > 0) {
      notifs.push({
        id:'sospesi', tipo:'info',
        icon:'user', color: C.textMuted,
        titolo: `${sospesi.length} ${sospesi.length===1?'abbonamento sospeso':'abbonamenti sospesi'}`,
        desc: sospesi.slice(0,3).map(s=>s.name||s.nome||'').join(', '),
        action: () => { onNavigate('allievi'); setOpen(false); },
        actionLabel: 'Vedi allievi',
      });
    }
  }

  // 7. Allievi con lezioni individuali superiori alla soglia mensile (solo ADMIN)
  if (ruoloNB === "admin") {
    const meseCurr  = oggi.getMonth() + 1;
    const annoCurr  = oggi.getFullYear();
    // Soglia globale da config (default 4), può essere sovrascritta per singolo allievo
    const SOGLIA_IND_GLOB = (_configNB && _configNB.sogliaLezioniIndividuali != null) ? Number(_configNB.sogliaLezioniIndividuali) : 4;
    const MESI_N = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];

    // Mappa studente → soglia individuale effettiva (eccezione o globale)
    const getSogliaStudente = (nomeStudente) => {
      const st = (students||[]).find(s => (s.name||s.nome||'').toLowerCase() === (nomeStudente||'').toLowerCase());
      if (st && st.sogliaIndividualeEcc != null) return Number(st.sogliaIndividualeEcc);
      return SOGLIA_IND_GLOB;
    };

    // Conta lezioni individuali del mese per studente
    const conteggioPerAllievo = {};
    (lessons||[]).forEach(l => {
      if (isColl(l) || l.tipo === 'prova' || l.tipo === 'sala_prove' || l.tipo === 'recupero') return;
      if (l.attendance === 'recuperata') return;
      if (!l.date) return;
      const [ly,lm] = (l.date||'').split('-').map(Number);
      if (ly !== annoCurr || lm !== meseCurr) return;
      const key = l.student || String(l.studentId||'');
      if (!key) return;
      conteggioPerAllievo[key] = (conteggioPerAllievo[key]||0) + 1;
    });

    // Trova chi supera la propria soglia
    const superanoSoglia = Object.entries(conteggioPerAllievo)
      .filter(([nome, count]) => count > getSogliaStudente(nome))
      .map(([nome, count]) => ({ nome, count, soglia: getSogliaStudente(nome) }))
      .sort((a,b) => b.count - a.count);

    if (superanoSoglia.length > 0) {
      notifs.push({
        id: 'lezioni_extra_mese',
        tipo: 'warning',
        icon: 'alert',
        color: C.orange,
        titolo: `${superanoSoglia.length} allievo${superanoSoglia.length>1?'i':''} oltre la soglia lezioni ind. di ${MESI_N[meseCurr-1]}`,
        desc: superanoSoglia.slice(0,3).map(a => `${a.nome} (${a.count}/${a.soglia})`).join(' · ')
          + (superanoSoglia.length > 3 ? ` +${superanoSoglia.length-3} altri` : ''),
        action: () => { onNavigate('allievi'); setOpen(false); },
        actionLabel: 'Vedi allievi',
      });
    }
  }

  // 8. Notifiche da tabella `notifiche` Supabase (recuperi e altro)
  var notificheArr = Array.isArray(_notificheNB) ? _notificheNB : [];
  // Filtra per il ruolo/utente corrente
  var myNotifiche = notificheArr.filter(function(n) {
    if (n.letto) return false;
    if (n.destinatario_ruolo === ruoloNB) {
      if (ruoloNB === 'docente') {
        if (!n.destinatario_nome) return true; // notifica generica per tutti i docenti
        var dest = (n.destinatario_nome||"").toLowerCase().trim();
        var tk   = myDocenteTeacherKey.toLowerCase().trim();
        var nm   = myDocenteNome.toLowerCase().trim();
        return dest === tk || dest === nm ||
               (tk && dest.indexOf(tk) >= 0) || (tk && tk.indexOf(dest) >= 0) ||
               (nm && dest.indexOf(nm) >= 0) || (nm && nm.indexOf(dest) >= 0);
      }
      if (ruoloNB === 'allievo') {
        if (!n.destinatario_id && !n.destinatario_nome) return true; // broadcast allievo
        if (myAllievoId && n.destinatario_id && String(n.destinatario_id) === String(myAllievoId)) return true;
        if (myAllievoNome && n.destinatario_nome) {
          var dn = (n.destinatario_nome||'').toLowerCase().trim();
          var an = myAllievoNome.toLowerCase().trim();
          return dn === an || dn.includes(an) || an.includes(dn);
        }
        return false;
      }
      return true; // admin vede tutto
    }
    return false;
  });

  myNotifiche.forEach(function(n) {
    // Routing per tipo notifica
    var actionFn = function() {
      // Segna come letta su Supabase (fire-and-forget)
      var sb = window.supabaseClient;
      if (sb && n.id) {
        sb.from('notifiche').update({letto: true}).eq('id', n.id)
          .then(function(){});
      }
      // Naviga alla schermata corretta
      var tipo = n.tipo || '';
      if (tipo === 'recupero_richiesto' || tipo === 'recupero_approvato_docente') {
        // Docente/Admin: vai al tab recuperi
        onNavigate('calendario');
        if (_onQANB) setTimeout(function(){ _onQANB('showRecuperi'); }, 100);
      } else if (tipo === 'recupero_confermato' || tipo === 'recupero_in_attesa' ||
                 tipo === 'recupero_confermato_docente' || tipo === 'recupero_ufficiale' ||
                 tipo === 'recupero_rifiutato') {
        // Allievo: vai al profilo (schermata allievi)
        onNavigate('allievi');
      } else {
        // Default per altri tipi
        onNavigate('dashboard');
      }
      setOpen(false);
    };
    var actionLabel = 'Vedi dettagli';
    if (n.tipo === 'recupero_richiesto')          actionLabel = 'Gestisci recupero';
    else if (n.tipo === 'recupero_approvato_docente') actionLabel = 'Conferma ufficialmente';
    else if (n.tipo === 'recupero_confermato_docente' || n.tipo === 'recupero_ufficiale') actionLabel = 'Vedi dettagli';
    else if (n.tipo === 'recupero_rifiutato')     actionLabel = 'Vedi dettagli';
    notifs.push({
      id: 'notifica_' + n.id,
      tipo: (n.tipo === 'recupero_richiesto' || n.tipo === 'recupero_approvato_docente') ? 'warning' : 'info',
      icon: 'calendar',
      color: (n.tipo === 'recupero_richiesto' || n.tipo === 'recupero_approvato_docente') ? C.orange : C.purple,
      titolo: n.titolo || 'Notifica',
      desc: n.messaggio || '',
      action: actionFn,
      actionLabel: actionLabel,
    });
  });

  const count = notifs.length;
  // Esponi il conteggio globalmente così handleLogout può leggerlo
  window.__FM_NOTIF_COUNT__ = count;

  const TIPO_COLORS = {
    warning: { bg: '#fff7ed', border: '#fed7aa', dot: C.orange },
    info:    { bg: C.blueBg,  border: C.blueBorder, dot: C.blue },
    error:   { bg: C.redBg,   border: C.redBorder,  dot: C.red  },
  };

  return (
    React.createElement('div', {ref, style:{position:'relative'}}
      , React.createElement('button', {
          onClick: ()=>setOpen(p=>!p),
          style:{position:'relative',background:'none',border:`1px solid ${C.border}`,
            borderRadius:8,padding:'6px 8px',cursor:'pointer',display:'flex',
            color:open?C.gold:C.textMuted,
            transition:'all .15s',
            borderColor: open ? C.gold : C.border},
          onMouseEnter:e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;},
          onMouseLeave:e=>{if(!open){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}}
        , React.createElement(Ic, {n:'bell', size:15, stroke:'currentColor'})
        , count > 0 && React.createElement('span', {style:{
            position:'absolute',top:-5,right:-5,
            minWidth:16,height:16,borderRadius:8,
            background:C.red,color:'#fff',
            fontSize:9,fontWeight:700,
            display:'flex',alignItems:'center',justifyContent:'center',
            padding:'0 3px',lineHeight:1,
            border:`2px solid ${C.bg}`,
          }}, count > 9 ? '9+' : count)
      )

      /* ── Dropdown ── */
      , open && React.createElement('div', {style:{
            position:'fixed',
            top: ref.current ? ref.current.getBoundingClientRect().bottom + 8 : 60,
            right: 8,
            left: 8,
            maxWidth: 380,
            marginLeft: 'auto',
            maxHeight: 480, overflowY:'auto',
            background:C.surface,border:`1px solid ${C.border}`,
            borderRadius:14,boxShadow:'0 12px 40px rgba(0,0,0,0.25)',
            zIndex:1000,animation:'fadeUp .18s ease both',
          }}
          , React.createElement('div', {style:{padding:'14px 16px',borderBottom:`1px solid ${C.border}`,
              display:'flex',alignItems:'center',justifyContent:'space-between'}}
            , React.createElement('span', {style:{fontFamily:"'Oswald',sans-serif",fontSize:14,fontWeight:600,letterSpacing:'.04em'}}, 'NOTIFICHE')
            , count > 0 && React.createElement('span', {style:{fontSize:10,color:C.textMuted}}, `${count} attive`)
          )
          , count === 0
            ? React.createElement('div', {style:{padding:'32px 16px',textAlign:'center'}}
                , React.createElement(Ic, {n:'check',size:28,stroke:C.green})
                , React.createElement('p', {style:{fontSize:13,color:C.textMuted,marginTop:10}}, 'Nessuna notifica attiva')
              )
            : notifs.map(n => {
                const tc = TIPO_COLORS[n.tipo] || TIPO_COLORS.info;
                return React.createElement('div', {key:n.id, style:{
                    padding:'12px 16px',
                    borderBottom:`1px solid ${C.border}`,
                    background:'transparent',
                    transition:'background .12s',
                  },
                  onMouseEnter:e=>e.currentTarget.style.background=C.surfaceHover,
                  onMouseLeave:e=>e.currentTarget.style.background='transparent'}
                  , React.createElement('div', {style:{display:'flex',gap:10,alignItems:'flex-start'}}
                    , React.createElement('div', {style:{
                          width:30,height:30,borderRadius:8,flexShrink:0,
                          background:`${n.color}18`,
                          display:'flex',alignItems:'center',justifyContent:'center',marginTop:1}}
                        , React.createElement(Ic, {n:n.icon, size:13, stroke:n.color})
                      )
                    , React.createElement('div', {style:{flex:1,minWidth:0}}
                      , React.createElement('div', {style:{fontSize:12,fontWeight:600,color:C.text,lineHeight:1.4}}, n.titolo)
                      , n.desc && React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginTop:2,lineHeight:1.4,
                          overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, n.desc)
                      , React.createElement('button', {
                            onClick: n.action,
                            style:{marginTop:6,fontSize:11,color:n.color,background:'none',border:'none',
                              cursor:'pointer',padding:0,fontFamily:"'Open Sans',sans-serif",fontWeight:600}}
                          , n.actionLabel, ' →'
                        )
                    )
                  )
                );
              })
        )
    )
  );
};


// ─── REPORT LEZIONI CARD (Dashboard) ────────────────────────────────────────
const ReportLezioniCard = ({ lessons, students, config, onNavigate }) => {
  const meseCurr = new Date().getMonth() + 1;
  const annoCurr = new Date().getFullYear();
  const MESI_FULL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const SOGLIA_IND_GLOB = (config && config.sogliaLezioniIndividuali != null) ? Number(config.sogliaLezioniIndividuali) : 4;

  // Sezioni collassabili indipendenti
  const [openOltre,   setOpenOltre]   = useState(true);
  const [openInLinea, setOpenInLinea] = useState(false);
  const [openSotto,   setOpenSotto]   = useState(false);

  const contInd = {};
  (lessons||[]).forEach(l => {
    if (isColl(l)||l.tipo==='prova'||l.tipo==='sala_prove'||l.tipo==='recupero') return;
    if (l.attendance==='recuperata') return;
    if (!l.date) return;
    const [ly,lm] = l.date.split('-').map(Number);
    if (ly!==annoCurr||lm!==meseCurr) return;
    const k = l.student||String(l.studentId||''); if(!k) return;
    contInd[k] = (contInd[k]||0)+1;
  });

  const allieviAttivi = (students||[]).filter(s=>s.status==='attivo'||s.stato==='attivo'||!s.status);
  const report = allieviAttivi.map(s => {
    const nome = s.name||s.nome||'';
    const soglia = s.sogliaIndividualeEcc!=null ? Number(s.sogliaIndividualeEcc) : SOGLIA_IND_GLOB;
    const count  = contInd[nome]||0;
    const delta  = count - soglia;
    return { nome, count, soglia, delta };
  }).filter(r=>r.nome);

  const superano    = report.filter(r=>r.delta>0).sort((a,b)=>b.delta-a.delta);
  const inLinea     = report.filter(r=>r.delta===0);
  const sottosoglia = report.filter(r=>r.delta<0).sort((a,b)=>a.delta-b.delta);

  const ColSection = ({ title, color, icon, items, open, onToggle, renderItem }) =>
    React.createElement('div', {style:{borderBottom:`1px solid ${C.border}`}}
      , React.createElement('div', {
          onClick: onToggle,
          style:{padding:'10px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:8,
            background: open ? `${color}08` : 'transparent',
            transition:'background .15s'}}
        , React.createElement(Ic,{n:icon,size:12,stroke:color})
        , React.createElement('span',{style:{fontSize:11,color,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',flex:1}}, title, ` (${items.length})`)
        , React.createElement(Ic,{n:open?'chevron-up':'chevron-down',size:13,stroke:C.textMuted})
      )
      , open && React.createElement('div', {style:{padding:'4px 16px 10px'}}
        , items.length === 0
          ? React.createElement('div',{style:{fontSize:12,color:C.textDim,fontStyle:'italic',padding:'4px 0'}},'Nessuno')
          : items.map(r => React.createElement('div',{key:r.nome,
              style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:`1px solid ${C.border}44`}}
            , React.createElement('span',{style:{fontSize:12,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'65%'}}, r.nome)
            , renderItem(r)
          ))
      )
    );

  return React.createElement('div', {style:{marginBottom:16}}
    , React.createElement('div', {style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:'hidden'}}
      /* Header */
      , React.createElement('div', {style:{padding:'14px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}
        , React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8}}
          , React.createElement(Ic,{n:'chart',size:14,stroke:C.gold})
          , React.createElement('span',{style:{fontSize:12,fontWeight:500,letterSpacing:'0.06em',textTransform:'uppercase',color:C.textMuted}},
              `Report lezioni · ${MESI_FULL[meseCurr-1]} ${annoCurr}`)
        )
        , React.createElement('div',{style:{display:'flex',gap:6}}
          , superano.length>0&&React.createElement('span',{style:{background:C.orangeBg,color:C.orange,border:`1px solid ${C.orangeBorder}`,borderRadius:4,padding:'2px 8px',fontSize:10,fontWeight:700}},`${superano.length} oltre`)
          , inLinea.length>0&&React.createElement('span',{style:{background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:'2px 8px',fontSize:10,fontWeight:700}},`${inLinea.length} ok`)
          , sottosoglia.length>0&&React.createElement('span',{style:{background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBorder}`,borderRadius:4,padding:'2px 8px',fontSize:10,fontWeight:700}},`${sottosoglia.length} sotto`)
        )
      )
      /* Sezioni collassabili */
      , React.createElement(ColSection, {
          title:'Oltre soglia', color:C.orange, icon:'alert',
          items:superano, open:openOltre, onToggle:()=>setOpenOltre(p=>!p),
          renderItem: r => React.createElement('span',{style:{fontSize:12,fontWeight:700,color:C.orange,whiteSpace:'nowrap'}},
            `${r.count}/${r.soglia} `, React.createElement('span',{style:{fontSize:10}},`+${r.delta}`))
        })
      , React.createElement(ColSection, {
          title:'In linea', color:C.green, icon:'check',
          items:inLinea, open:openInLinea, onToggle:()=>setOpenInLinea(p=>!p),
          renderItem: r => React.createElement('span',{style:{fontSize:12,fontWeight:700,color:C.green}},`${r.count}/${r.soglia}`)
        })
      , React.createElement(ColSection, {
          title:'Sotto soglia', color:C.blue, icon:'clock',
          items:sottosoglia, open:openSotto, onToggle:()=>setOpenSotto(p=>!p),
          renderItem: r => React.createElement('span',{style:{fontSize:12,fontWeight:700,color:C.blue,whiteSpace:'nowrap'}},
            `${r.count}/${r.soglia} `, React.createElement('span',{style:{fontSize:10}},`${r.delta}`))
        })
      /* Footer */
      , React.createElement('div',{style:{padding:'10px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}
        , React.createElement('span',{style:{fontSize:11,color:C.textDim}},`Soglia globale: ${SOGLIA_IND_GLOB} lez/mese · ${report.length} allievi attivi`)
        , React.createElement('button',{onClick:()=>onNavigate('allievi'),
            style:{background:'none',border:'none',cursor:'pointer',fontSize:12,color:C.gold,fontFamily:"'Open Sans',sans-serif",display:'flex',alignItems:'center',gap:4}}
          , React.createElement(Ic,{n:'users',size:12,stroke:C.gold}), ' Gestisci allievi →')
      )
    )
  );
};

const DashboardView = ({ appUser, onNavigate, config:propConfig, setConfig:propSetConfig, anniScolastici:propAnni, setAnniScolastici:propSetAnni, students:propStudentsDash, entrate:propEntrateDash, spese:propSpeseDash, docenti:propDocentiDash, lessons:propLessonsDash, concerti:propConcertiDash, richieste:propRichieste, notifiche:propNotifiche, panels:propPanels, setPanels:propSetPanels, onQuickAction }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Clock live: aggiorna ogni 60s per far scorrere la progressbar e la timeline
  const [dashNow, setDashNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setDashNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
    const [showAmounts,  setShowAmounts]  = useState(false);
    const [_localPanels, _setLocalPanels]  = useState({});
    const panels    = propPanels    !== undefined ? propPanels    : _localPanels;
    const setPanels = propSetPanels !== undefined ? propSetPanels : _setLocalPanels;
    const [_config,  _setConfig]  = useState(CONFIG_DEFAULT);
    const [_anni,    _setAnni]    = useState(INIT_ANNI_SCOLASTICI);
    const config         = _nullishCoalesce(propConfig, () => ( _config));
    const setConfig      = _nullishCoalesce(propSetConfig, () => ( _setConfig));
    const anniScolastici = _nullishCoalesce(propAnni, () => ( _anni));
    const setAnniScolastici = _nullishCoalesce(propSetAnni, () => ( _setAnni));
    // ruolo deriva dal login, non da stato locale
    const ruolo = (appUser && appUser.ruolo) || "admin";

    const isVisible = id => panels[id] !== false;
  
    // Calcoli KPI
    // KPI calcolati live sotto
    // KPI live — usano props se disponibili, fallback a dati statici
    const _students = propStudentsDash || [];
    const _docenti  = propDocentiDash  || [];
    const _entrate  = propEntrateDash  || [];
    const _lessons  = propLessonsDash  || [];
    // Dati filtrati per allievo loggato (definiti dopo _students/_entrate)
    const myNome = (appUser && appUser.nome) || "";
    const myDocNome = ruolo==="docente" ? myNome : "";
    // Preferisci ID diretto dal profilo, fallback a match per nome
    const myDocenteId = (appUser && appUser.docenteId) || null;
    const myAllievoId = (appUser && appUser.allievoId) || null;
    const myDocRecord = ruolo==="docente"
      ? (myDocenteId
          ? (_docenti||[]).find(d=>String(d.id)===String(myDocenteId))
          : (_docenti||[]).find(d=>d.teacherKey===myNome||(d.nome||"").toLowerCase().includes(myNome.toLowerCase())))
      : null;
    const myStudentRecord = ruolo==="allievo"
      ? (myAllievoId
          ? (_students.find(s=>String(s.id)===String(myAllievoId))||null)
          : (_students.find(s=>(s.name||s.nome||"").toLowerCase()===myNome.toLowerCase())||null))
      : null;
    const myStudentId = myStudentRecord ? myStudentRecord.id : null;
    // Nome reale dello studente (da record Supabase), fallback a nome profilo
    const myStudentName = myStudentRecord ? (myStudentRecord.name || myStudentRecord.nome || myNome) : myNome;
    // Helper: matcha una lezione all'allievo loggato (prima per ID, poi per nome studente, poi per nome profilo)
    const matchLezioneAllievo = (l) => {
      if (ruolo !== "allievo") return true;
      const tipoL = l.tipo || l.type || "individuale";
      if (tipoL === "collettivo") {
        // Match per lista students della lezione
        const studentsArr = l.students || [];
        if (studentsArr.length > 0) {
          return studentsArr.some(s =>
            (myAllievoId && s.id != null && String(s.id) === String(myAllievoId)) ||
            (s.name||"").toLowerCase() === myStudentName.toLowerCase()
          );
        }
        // Fallback: se students è vuoto, controlla se l'allievo è iscritto al corso
        // tramite il courseId della lezione vs i corsi dell'allievo
        if (l.courseId && myStudentRecord) {
          const myCorsi = [
            myStudentRecord.instrument,
            myStudentRecord.complementaryCourse,
            ...(myStudentRecord.extraInstruments || []),
          ].filter(Boolean);
          // Controlla match per nome corso
          if (l.courseName) {
            return myCorsi.some(c => (c||'').toLowerCase() === (l.courseName||'').toLowerCase());
          }
        }
        return false;
      }
      // Per individuali
      if (myAllievoId && (l.studentId ?? null) != null) return String(l.studentId) === String(myAllievoId);
      const sn = (l.student || l.allievo || "").toLowerCase().trim();
      if (myStudentName && sn && sn === myStudentName.toLowerCase().trim()) return true;
      if (myNome && sn && sn === myNome.toLowerCase().trim()) return true;
      if (myStudentName && sn && sn.includes(myStudentName.toLowerCase().split(" ")[0])) return true;
      return false;
    };
    // teacherKey = il valore salvato nel campo "teacher" delle lezioni
    const myDocTeacherKey = myDocRecord
      ? (myDocRecord.teacherKey || myDocRecord.nome || myDocNome)
      : myDocNome;
    // Helper per matchare una lezione al docente loggato
    const matchDocLezione = (l) => {
      if (!myDocTeacherKey) return false;
      const t = (l.teacher || l.docente || '').toLowerCase().trim();
      const k = myDocTeacherKey.toLowerCase().trim();
      return t === k || t.includes(k) || k.includes(t);
    };
    const _myStudentsForDash = ruolo==="docente"
      ? _students.filter(s=>{ const t=(s.teacher||"").toLowerCase().trim(); const k=myDocTeacherKey.toLowerCase().trim(); return t===k||t.includes(k)||k.includes(t); })
      : _students;
    const allieviAttivi    = _myStudentsForDash.filter(a=>a.status==="attivo"||a.stato==="attivo").length;
    const morosi           = ruolo==="docente" ? 0 : _students.filter(a=>a.status==="scaduto"||a.stato==="scaduto").length;
    const oraNum  = t => { const [h,m]=(t||"0:0").split(":").map(Number); return h*60+m; };
    const nowMins = dashNow.getHours()*60+dashNow.getMinutes();
    const lezioniOggi      = _lessons.filter(l=>{const d=l.date||l.data||""; return d===yyyymmdd(dashNow) && l.attendance !== 'recuperata';}).length;
    const lezComplete      = _lessons.filter(l=>{const d=l.date||l.data||""; return d===yyyymmdd(dashNow)&&l.attendance !== 'recuperata'&&oraNum(l.hour||l.time||l.ora||"0:0")+(l.duration||l.durata||0)<=nowMins;}).length;
    const lezioniSettimana = _lessons.filter(l=>{if(!l.recurring&&!l.ricorrente) return false; if(l.attendance==='recuperata') return false; const d=new Date(l.date||l.data||oggi); return d<=oggi&&(!l.endDate||new Date(l.endDate)>=oggi);}).length || _lessons.filter(l=>l.attendance!=='recuperata').length;
    const meseCorrente = oggi.getMonth()+1;
    const annoCorrente = oggi.getFullYear();
    const entrMeseLiveLive = ruolo==="docente" ? 0 : _entrate.filter(e=>e.mese===meseCorrente&&e.anno===annoCorrente).reduce((t,e)=>t+(e.importo||0),0);
    const _spese = propSpeseDash || [];
    const meseCorrenteSpese = oggi.getMonth(); /* spese usano mese 0-based */
    const uscMeseLiveLive  = ruolo==="docente" ? 0 : _spese.filter(e=>e.mese===meseCorrenteSpese&&e.anno===annoCorrente).reduce((t,e)=>t+(e.importo||0),0);
    const saldoAnnoLiveLive = ruolo==="docente" ? 0 : (_entrate.filter(e=>e.anno===annoCorrente).reduce((t,e)=>t+(e.importo||0),0)
                        - _spese.filter(e=>e.anno===annoCorrente).reduce((t,e)=>t+(e.importo||0),0));
  
    // ── Dati live per la dashboard (sostituiscono costanti hardcoded) ──────────
    const _concerti = propConcertiDash || [];

    // ALLIEVI live: prende da _students con formato compatibile AlertPanel/StatoAllievi
    const meseOggi = oggi.getMonth() + 1;
    const annoOggi = oggi.getFullYear();

    const ALLIEVI_LIVE = _students
      .filter(s => (s.status || s.stato || '') !== 'inattivo')
      .map(s => {
        const idAllievo = s.id;
        const nomeAllievo = (s.name || s.nome || '').toLowerCase().trim();

        const matchAllievo = (e) => {
          if (e.studentId != null && idAllievo != null && String(e.studentId) === String(idAllievo)) return true;
          const en = (e.studentName || '').toLowerCase().trim();
          if (!en || !nomeAllievo) return false;
          const partiNome = nomeAllievo.split(' ').filter(p => p.length > 2);
          if (en === nomeAllievo) return true;
          if (partiNome.length > 0 && partiNome.every(p => en.includes(p))) return true;
          return en.includes(nomeAllievo) || nomeAllievo.includes(en);
        };

        // Cerca entrata del mese corrente
        const quotaMeseCorrente = _entrate.find(e =>
          Number(e.mese) === meseOggi &&
          Number(e.anno) === annoOggi &&
          matchAllievo(e)
        );

        let stato = 'attesa';
        if (quotaMeseCorrente) {
          const statoQ = (quotaMeseCorrente.stato || '').toLowerCase();
          // Se stato è esplicitamente ritardo/attesa → usa quello
          // In tutti gli altri casi (pagato, null, undefined, '') → pagato
          // (registrare un'entrata = è stata incassata)
          if (statoQ === 'ritardo' || statoQ === 'in_ritardo' || statoQ === 'in ritardo') stato = 'scaduto';
          else if (statoQ === 'attesa' || statoQ === 'da pagare') stato = 'attesa';
          else stato = 'pagato'; // include 'pagato', '', null, undefined
        } else {
          const st = (s.status || s.stato || '');
          if (st === 'sospeso') stato = 'sospeso';
          else if (st === 'scaduto' || st === 'ritardo') stato = 'scaduto';
        }

        return {
          id: idAllievo,
          name: s.name || s.nome || '',
          instrument: s.instrument || s.strumento || '',
          teacher: s.teacher || s.docente || '',
          stato,
          monthlyFee: s.monthlyFee || s.quota || 0,
        };
      });

    // LEZIONI_OGGI live: lezioni di oggi con formato compatibile AlertPanel
    const todayStr = yyyymmdd(oggi);
    const LEZIONI_OGGI_LIVE = _lessons
      .filter(l => (l.date || l.data || '') === todayStr)
      .sort((a, b) => (a.hour || a.ora || '').localeCompare(b.hour || b.ora || ''))
      .map(l => ({
        id: l.id,
        studentId: l.studentId || null,
        students: l.students || [],
        tipo: l.tipo || l.type || 'individuale',
        ora: l.hour || l.ora || '',
        durata: l.duration || l.durata || 60,
        allievo: l.student || l.allievo || '',
        strumento: l.instrument || l.strumento || '',
        docente: l.teacher || l.docente || '',
        aula: l.room || l.aula || '',
        confermata: (l.attendance || '') !== '',
      }));

    // PROSSIMI_EVENTI live: concerti/eventi futuri
    const PROSSIMI_EVENTI_LIVE = _concerti
      .filter(e => (e.data || e.date || '') >= todayStr)
      .sort((a,b) => (a.data||a.date||'').localeCompare(b.data||b.date||''))
      .slice(0, 5)
      .map(e => ({
        data: e.data || e.date || '',
        titolo: e.nome || e.titolo || e.name || '',
        luogo: e.luogo || e.location || '',
        tipo: e.tipo || e.type || 'evento',
      }));

    // ATTIVITA_RECENTE live: ultimi movimenti da entrate + spese
    const attivistaEntrate = (_entrate || []).slice().sort((a,b)=>(b.data||'').localeCompare(a.data||'')).slice(0,5).map((e,i)=>({
      id: 'e'+e.id, tipo:'pagamento',
      desc: e.desc || 'Pagamento quota',
      sogg: e.studentName || e.allievo || '',
      quando: (() => { try { const d=new Date((e.data||'')+'T00:00:00'); const diff=Math.floor((oggi-d)/86400000); return diff===0?'Oggi':diff===1?'Ieri':`${diff} giorni fa`; } catch(er){return '';} })(),
      importo: e.importo || 0, segno: 1,
    }));
    const attivistaSpese = (_spese || []).slice().sort((a,b)=>(b.data||'').localeCompare(a.data||'')).slice(0,3).map((e,i)=>({
      id: 's'+e.id, tipo:'spesa',
      desc: e.desc || 'Spesa',
      sogg: e.docenteNome || e.fornitore || '',
      quando: (() => { try { const d=new Date((e.data||'')+'T00:00:00'); const diff=Math.floor((oggi-d)/86400000); return diff===0?'Oggi':diff===1?'Ieri':`${diff} giorni fa`; } catch(er){return '';} })(),
      importo: e.importo || 0, segno: -1,
    }));
    const ATTIVITA_RECENTE_LIVE = [...attivistaEntrate, ...attivistaSpese]
      .sort((a,b)=>a.quando.localeCompare(b.quando))
      .slice(0, 8);

    // ── Grafico andamento: dati mensili reali ───────────────────────────────────
    const MESI_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
    const FIN_MENSILE_LIVE = MESI_SHORT.map((m, idx) => {
      const mesNum = idx + 1; // 1-based, come nei dati entrate
      const entr = (_entrate || [])
        .filter(e => e.anno === annoCorrente && e.mese === mesNum)
        .reduce((t, e) => t + (e.importo || 0), 0);
      const usc = (_spese || [])
        .filter(s => s.anno === annoCorrente && s.mese === idx) // spese 0-based
        .reduce((t, s) => t + (s.importo || 0), 0);
      return { m, entr, usc };
    }).filter((d, idx) => {
      // Mostra solo i mesi fino al mese corrente (incluso)
      return idx <= oggi.getMonth();
    });

    const totEntrateAnno = FIN_MENSILE_LIVE.reduce((t, d) => t + d.entr, 0);
    const totUsciteAnno  = FIN_MENSILE_LIVE.reduce((t, d) => t + d.usc,  0);

    // Render logo navbar
    const LogoMark = () => {
      if(config.logoUrl) return (
        React.createElement('img', { src: config.logoUrl, alt: "logo", style: {width:28,height:28,borderRadius:7,objectFit:"cover"},
          onError: e=>e.target.style.display="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2098}})
      );
      if(config.logoText) return (
        React.createElement('div', { style: {width:28,height:28,borderRadius:7,background:config.logoColor||C.gold,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Oswald',sans-serif",fontSize:13,fontWeight:600,color:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2102}}
          , config.logoText
        )
      );
      return (
        React.createElement('div', { style: {width:28,height:28,borderRadius:7,background:config.logoColor||C.gold,
          display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2109}}
          , React.createElement(Ic, { n: config.logoIcon||"music", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2111}})
        )
      );
    };
  
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2118}}, G+`@keyframes slideDrawer{from{transform:translateX(100%)}to{transform:translateX(0)}}`)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2119}}

          /* ── NAVBAR ── */
          , React.createElement('header', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"0 28px",paddingTop:0,
            display:"flex",alignItems:"center",gap:0,flexShrink:0,
            minHeight:56,height:56}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2122}}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,height:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2124}}
              , React.createElement(LogoMark, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2125}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2126}}
                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2127}}
                  , config.nomeScuola
                )
                , React.createElement('div', { style: {fontSize:9,color:C.textDim,letterSpacing:"0.12em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2130}}
                  , config.tipoEnte
                )
              )
            )
            , React.createElement('div', { style: {marginLeft:"auto",display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2135}}
              /* Pulsante refresh */
              , React.createElement('button', {
                  onClick: ()=>{ if(window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__(false); },
                  title:"Aggiorna dati",
                  style:{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",
                    cursor:"pointer",display:"flex",alignItems:"center",color:C.textMuted,transition:"all .15s"},
                  onMouseEnter:e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;},
                  onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}
                }
                , React.createElement(Ic,{n:"refresh",size:15,stroke:"currentColor"})
              )
              , React.createElement(NotifPermBtn)
              , React.createElement(NotificationBell, {
                  students: _students,
                  lessons: _lessons,
                  richieste: propRichieste||[],
                  notifiche: propNotifiche||[],
                  onNavigate: onNavigate,
                  onQuickAction: onQuickAction,
                  ruolo: ruolo,
                  appUser: appUser,
                  config: propConfig,
                })
              /* Settings button rimosso dall'header — vedi Strumenti > Impostazioni */
              /* Ruolo badge */
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,padding:"4px 10px",
                borderRadius:8,border:`1px solid ${_optionalChain([DASH_RUOLI, 'access', _14 => _14.find, 'call', _15 => _15(r=>r.id===ruolo), 'optionalAccess', _16 => _16.hex])+"40"}`,
                background:`${_optionalChain([DASH_RUOLI, 'access', _17 => _17.find, 'call', _18 => _18(r=>r.id===ruolo), 'optionalAccess', _19 => _19.hex])}10`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2149}}
                , React.createElement('div', { style: {width:7,height:7,borderRadius:"50%",
                  background:_optionalChain([DASH_RUOLI, 'access', _20 => _20.find, 'call', _21 => _21(r=>r.id===ruolo), 'optionalAccess', _22 => _22.hex])}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2152}})
                , React.createElement('span', { style: {fontSize:11,color:_optionalChain([DASH_RUOLI, 'access', _23 => _23.find, 'call', _24 => _24(r=>r.id===ruolo), 'optionalAccess', _25 => _25.hex]),fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2154}}
                  , _optionalChain([DASH_RUOLI, 'access', _26 => _26.find, 'call', _27 => _27(r=>r.id===ruolo), 'optionalAccess', _28 => _28.label])
                )
              )
            )
          )

          /* ── HERO HEADER ── */
          , React.createElement('div', { style: {background:`linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
            borderBottom:`1px solid ${C.border}`,padding:"16px 20px",
            display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2162}}
            , React.createElement('div', { style: {animation:"fadeUp 0.4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2165}}
              , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:30,fontWeight:300,letterSpacing:"0.02em",lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2166}}, "Buongiorno, "
                 , React.createElement('span', { style: {fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2167}}
                  , myNome || (ruolo==="admin"?"Amministratore":ruolo==="docente"?"Docente":ruolo==="allievo"?"Allievo":"Utente")
                )
              )
              , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2171}}
                , config.annoScolastico
                , ruolo==="docente" ? " · " + _lessons.filter(function(l){return matchDocLezione(l) && l.attendance !== "recuperata";}).length + " mie lezioni"
                : ruolo==="allievo" ? " · " + (_lessons||[]).filter(l => matchLezioneAllievo(l) && l.attendance !== 'recuperata').length + " lezioni assegnate"
                : " · " + lezioniOggi + " lezioni oggi · " + lezComplete + " completate · " + (lezioniOggi-lezComplete) + " rimanenti"
              )
              , React.createElement('div', { style: {marginTop:10,width:220}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2174}}
                , React.createElement('div', { style: {height:4,background:C.border,borderRadius:2,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2175}}
                  , React.createElement('div', { style: {height:"100%",borderRadius:2,background:C.gold,
                    width:`${lezioniOggi>0?(lezComplete/lezioniOggi*100):0}%`,transition:"width 0.8s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2176}})
                )
              )
            )
            , React.createElement(LiveClock, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2181}})
          )

          /* ── BODY ── */
          , React.createElement('div', { style: {flex:1,padding:"16px 20px",display:"flex",flexDirection:"column",gap:16,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2185}}

            /* Helper ordine pannelli: legge panels.panelOrder e restituisce {order:N} */
            , (() => {
                const _panelOrder = (panels.panelOrder && panels.panelOrder.length > 0)
                  ? panels.panelOrder
                  : PANNELLI_DEF.map(p=>p.id);
                window.__dash_panel_order__ = (id) => {
                  const idx = _panelOrder.indexOf(id);
                  return { order: idx >= 0 ? idx : 99 };
                };
                return null;
              })()

            /* ── RIGA 1: KPI ── */
            , React.createElement('div', null
              /* Pulsante mostra/nascondi importi */
              , (ruolo === "admin" || ruolo === "allievo" || ruolo === "docente") && React.createElement('div', {
                  style:{display:"flex",justifyContent:"flex-end",marginBottom:8}
                }
                , React.createElement('button', {
                    onClick: ()=>setShowAmounts(p=>!p),
                    title: showAmounts ? "Nascondi importi" : "Mostra importi",
                    style:{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",
                      background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,
                      cursor:"pointer",fontFamily:"'Open Sans',sans-serif",fontSize:11,
                      color:C.textMuted,transition:"all 0.15s"},
                    onMouseEnter:e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;},
                    onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}
                  }
                  , React.createElement(Ic, {n: showAmounts ? "eye" : "eye-off", size:13, stroke:showAmounts?C.gold:C.textMuted})
                  , showAmounts ? "Nascondi importi" : "Mostra importi"
                )
              )
              , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2188}}
              , ruolo==="docente" ? React.createElement(React.Fragment, null
                  , React.createElement(KpiCard, { icon: "calendar", label: "Lezioni settimana",
                      value: _lessons.filter(function(l){return matchDocLezione(l) && l.attendance !== "recuperata";}).length,
                      sub: "mie lezioni", hex: C.teal})
                  , React.createElement(KpiCard, { icon: "clock", label: "Prossima lezione",
                      value: (()=>{ const p=_lessons.filter(l=>matchDocLezione(l)&&(l.date||l.data||"")>=yyyymmdd(oggi)).sort((a,b)=>(a.date||a.data||"").localeCompare(b.date||b.data||""))[0]; return p?new Date((p.date||p.data)+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short"}):"—"; })(),
                      sub: "data più vicina", hex: C.gold})
                  , React.createElement(KpiCard, { icon: "euro", label: "Compenso mese",
                      value: fmt((()=>{ const m=oggi.getMonth()+1, y=oggi.getFullYear(); return _lessons.filter(l=>matchDocLezione(l)&&(l.attendance==="presente"||l.attendance==="assente")&&l.date&&new Date(l.date+"T00:00:00").getMonth()+1===m&&new Date(l.date+"T00:00:00").getFullYear()===y).length * (myDocRecord?myDocRecord.tariffaOra||0:0); })()),
                      sub: "mese corrente", hex: C.green, hideAmounts: !showAmounts})
                )
              : ruolo==="allievo" ? React.createElement(React.Fragment, null
                  , (() => {
                    // Reminder quota mensile: mostra se siamo nei primi 10 giorni del mese
                    // e la quota del mese corrente NON è ancora pagata
                    const oggi2 = new Date();
                    const meseC = oggi2.getMonth() + 1; // 1-12
                    const annoC = oggi2.getFullYear();
                    const giornoC = oggi2.getDate();
                    // Solo mesi scolastici: set(9)→giu(6)
                    const mesiScolastici = [9,10,11,12,1,2,3,4,5,6];
                    if (!mesiScolastici.includes(meseC)) return null;
                    // Cerca quota del mese corrente per questo allievo
                    const quotaMese = _entrate.find(e =>
                      (myStudentId ? e.studentId === myStudentId : (e.studentName||"").toLowerCase().includes(myNome.toLowerCase()))
                      && e.mese === meseC
                      && e.anno === annoC
                    );
                    const pagata = quotaMese && (quotaMese.stato === "pagato" || quotaMese.stato === "pagata");
                    if (pagata) return null; // già pagata: nessun reminder
                    // Mostra reminder tutto il mese se non pagata
                    const MESI_N = ["","Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
                    return React.createElement('div', { style:{
                      background:"#fffbeb", border:"1px solid #f59e0b",
                      borderRadius:12, padding:"14px 18px",
                      display:"flex", alignItems:"flex-start", gap:12,
                      marginBottom:4, animation:"fadeUp 0.5s ease both"
                    }}
                      , React.createElement('div', { style:{
                          width:36, height:36, borderRadius:10,
                          background:"#fef3c7", border:"1px solid #fde68a",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                        }}
                        , React.createElement(Ic, {n:"bell", size:18, stroke:"#f59e0b"})
                      )
                      , React.createElement('div', null
                        , React.createElement('div', {style:{fontSize:14, fontWeight:600, color:"#92400e", marginBottom:2}},
                            `⏰ Quota ${MESI_N[meseC]} ${annoC}`)
                        , React.createElement('div', {style:{fontSize:12, color:"#b45309", lineHeight:1.5}},
                            "La quota mensile non risulta ancora registrata. Contatta l'amministrazione per il pagamento.")
                      )
                    );
                  })()
                  , React.createElement(KpiCard, { icon: "calendar", label: "Le mie lezioni",
                      value: (_lessons||[]).filter(l => matchLezioneAllievo(l) && l.attendance !== 'recuperata').length,
                      sub: "questa settimana", hex: C.teal})
                  , React.createElement(KpiCard, { icon: "clock", label: "Prossima lezione",
                      value: (()=>{
                        const p=(_lessons||[]).filter(l=>matchLezioneAllievo(l)&&(l.date||l.data||"")>=yyyymmdd(oggi)).sort((a,b)=>(a.date||a.data||"").localeCompare(b.date||b.data||""))[0];
                        return p ? new Date((p.date||p.data)+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short"}) : "—";
                      })(),
                      sub: "data più vicina", hex: C.gold})
                  , React.createElement(KpiCard, { icon: "receipt", label: "Tot. versato",
                      value: fmt(_entrate.filter(e=>myStudentId?e.studentId===myStudentId:(e.studentName||"").toLowerCase().includes(myNome.toLowerCase())).reduce((t,e)=>t+(e.importo||0),0)),
                      sub: "pagamenti registrati", hex: C.green, hideAmounts: !showAmounts})
                )
              : React.createElement(React.Fragment, null
                  , (() => {
                      // KPI cards configurabili — ordine salvato in panels.kpiOrder
                      const ALL_KPI = [
                        { id:'allievi',  icon:"users",    label:"Allievi attivi",  value: allieviAttivi, sub: `${_students.length} totali`, hex: C.gold },
                        { id:'lezioni',  icon:"calendar", label:"Lezioni oggi",    value: lezioniOggi,   sub: `${lezioniSettimana} questa settimana`, hex: C.teal },
                        { id:'entrate',  icon:"up",       label:"Entrate mese",    value: fmt(entrMeseLiveLive), hex: C.green, trend:+8, hideAmounts:!showAmounts },
                        { id:'uscite',   icon:"down",     label:"Uscite mese",     value: fmt(uscMeseLiveLive),  hex: C.red,   trend:+12, hideAmounts:!showAmounts },
                        { id:'saldo',    icon:"chart",    label:`Saldo ${ANNO}`,   value: fmt(saldoAnnoLiveLive), hex: saldoAnnoLiveLive>=0?C.green:C.red, hideAmounts:!showAmounts },
                      ];
                      const kpiOrder = panels.kpiOrder && panels.kpiOrder.length > 0
                        ? panels.kpiOrder
                        : ALL_KPI.map(k=>k.id);
                      const sorted = kpiOrder
                        .map(id => ALL_KPI.find(k=>k.id===id))
                        .filter(Boolean)
                        .concat(ALL_KPI.filter(k=>!kpiOrder.includes(k.id)));
                      return sorted.map(k => React.createElement(KpiCard, { key:k.id, icon:k.icon, label:k.label, value:k.value, sub:k.sub, hex:k.hex, trend:k.trend, hideAmounts:k.hideAmounts }));
                    })()
                )
            )
            )

            /* ── RIGA 2: AZIONI RAPIDE (full width) ── */
            , isVisible("azioni") && ruolo==="docente" && (
              React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",...(window.__dash_panel_order__&&window.__dash_panel_order__('azioni'))}}
                , React.createElement('div', { style: {padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}
                  , React.createElement(Ic, { n: "plus", size: 14, stroke: C.gold})
                  , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}}, "Scorciatoie" )
                )
                , React.createElement('div', { style: {padding:"14px 16px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}
                  , [
                      {icon:"music",    label:"Nuovo brano",     hex:C.blue,   bg:C.blueBg,   bd:C.blueBorder,   action:"addBrano",   nav:"repertorio"},
                      {icon:"calendar", label:"Vai al calendario",hex:C.teal,  bg:C.tealBg,   bd:C.tealBorder,   nav:"calendario"},
                    ].map(a=>(
                    React.createElement('button', { key: a.label, onClick: ()=>{ if(a.action&&onQuickAction) onQuickAction(a.action); if(a.nav) onNavigate(a.nav); },
                      className: "quick-action",
                      style: {display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
                        background:a.bg,border:`1px solid ${a.bd}`,borderRadius:10,
                        cursor:"pointer",fontFamily:"'Open Sans',sans-serif",textAlign:"left",
                        width:"100%",transition:"all 0.15s"},
                      onMouseEnter: e=>{e.currentTarget.style.filter="brightness(1.15)";},
                      onMouseLeave: e=>{e.currentTarget.style.filter="";}}
                      , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:`${a.hex}20`,border:`1px solid ${a.bd}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}
                        , React.createElement(Ic, { n: a.icon, size: 16, stroke: a.hex})
                      )
                      , React.createElement('span', { style: {fontSize:13,color:a.hex,fontWeight:500}}, a.label)
                    ))
                  )
                )
              )
            )
            , isVisible("azioni") && ruolo==="admin" && (
              React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",...(window.__dash_panel_order__&&window.__dash_panel_order__('azioni'))}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2198}}
                , React.createElement('div', { style: {padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2199}}
                  , React.createElement(Ic, { n: "plus", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2200}})
                  , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2201}}, "Azioni rapide" )
                )
                , React.createElement('div', { style: {padding:"14px 16px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2203}}
                  , (function(){
                      const allAzioni = [
                        {icon:"receipt",  label:"Registra pagamento",  hex:C.green,  bg:C.greenBg,  bd:C.greenBorder,  action:"addEntrata", ruoli:["admin"]},
                        {icon:"calendar", label:"Aggiungi lezione",     hex:C.teal,   bg:C.tealBg,   bd:C.tealBorder,   action:"addLezione", ruoli:["admin"]},
                        {icon:"user",     label:"Nuovo allievo",        hex:C.gold,   bg:C.goldBg,   bd:C.goldDim,      action:"addAllievo", ruoli:["admin"]},
                        {icon:"down",     label:"Registra spesa",       hex:C.red,    bg:C.redBg,    bd:C.redBorder,    action:"addSpesa",   ruoli:["admin"]},
                        {icon:"music",    label:"Nuovo brano",          hex:C.blue,   bg:C.blueBg,   bd:C.blueBorder,   action:"addBrano",   ruoli:["admin","docente"]},
                        {icon:"flag",     label:"Crea evento/concerto", hex:C.purple, bg:C.purpleBg, bd:C.purpleBorder, action:"addEvento",  ruoli:["admin"]},
                      ];
                      return allAzioni.filter(a=>a.ruoli.includes(ruolo));
                    })().map(a=>(
                    React.createElement('button', { key: a.label, onClick: ()=>{ if(onQuickAction&&a.action){
                          onQuickAction(a.action);
                          const navMap={addAllievo:"allievi",addLezione:"calendario",addBrano:"repertorio",addEvento:"concerti",addEntrata:"contabilita",addSpesa:"contabilita"};
                          if(navMap[a.action]) onNavigate(navMap[a.action]);
                        } else if(a.nav){ onNavigate(a.nav); } },
                      className: "quick-action",
                      style: {display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
                        background:a.bg,border:`1px solid ${a.bd}`,borderRadius:10,
                        cursor:"pointer",fontFamily:"'Open Sans',sans-serif",textAlign:"left",
                        width:"100%",transition:"all 0.15s"},
                      onMouseEnter: e=>{e.currentTarget.style.filter="brightness(1.15)";e.currentTarget.style.transform="translateY(-1px)";},
                      onMouseLeave: e=>{e.currentTarget.style.filter="";e.currentTarget.style.transform="";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2213}}
                      , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:`${a.hex}20`,border:`1px solid ${a.bd}`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2221}}
                        , React.createElement(Ic, { n: a.icon, size: 16, stroke: a.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2223}})
                      )
                      , React.createElement('span', { style: {fontSize:13,color:a.hex,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2225}}, a.label)
                    )
                  ))
                )
              )
            )

            /* ── RIGA 3: LEZIONI + GRAFICO ── */
            , (isVisible("lezioni")||isVisible("grafico")||isVisible("recuperi")) && (
              React.createElement('div', { style: {display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",...(window.__dash_panel_order__&&window.__dash_panel_order__('lezioni'))}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2234}}

                /* Lezioni oggi */
                , isVisible("lezioni") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2238}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
                      display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2239}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2241}}
                        , React.createElement(Ic, { n: "calendar", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2242}})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2243}}, "Lezioni di oggi"  )
                      )
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2245}}
                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2246}}, lezComplete, "/", lezioniOggi)
                        , React.createElement('div', { style: {width:48,height:4,background:C.border,borderRadius:2,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2247}}
                          , React.createElement('div', { style: {height:"100%",width:`${lezioniOggi>0?lezComplete/lezioniOggi*100:0}%`,background:C.gold,borderRadius:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2248}})
                        )
                      )
                    )
                    , React.createElement('div', { 'data-timeline-scroll': '1', style: {padding:14,maxHeight:340,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2252}}
                      , React.createElement(LessonTimeline, { lezioni: ruolo==="allievo"
                        ? LEZIONI_OGGI_LIVE.filter(l=>matchLezioneAllievo(l))
                        : ruolo==="docente" ? LEZIONI_OGGI_LIVE.filter(matchDocLezione)
                        : LEZIONI_OGGI_LIVE,
                        onLessonClick: (lessonId) => {
                          onNavigate("calendario");
                          if (onQuickAction) setTimeout(()=>onQuickAction("openLesson:"+lessonId), 120);
                        },
                        __self: this, __source: {fileName: _jsxFileName, lineNumber: 2253}})
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2255}}
                      , React.createElement('button', { onClick: ()=>{ onNavigate("calendario"); if(onQuickAction) setTimeout(()=>onQuickAction("showCalendario"), 80); },
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2256}}
                        , React.createElement(Ic, { n: "calendar", size: 12, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2258}}), "Apri calendario →"
                      )
                    )
                  )
                )

                /* ── Card Recuperi ── */
                , isVisible("recuperi") && (() => {
                  const oggi_r = new Date(); oggi_r.setHours(0,0,0,0);
                  const _lessonsFiltered = ruolo==="docente"
                    ? (_lessons||[]).filter(l=>matchDocLezione(l))
                    : ruolo==="allievo"
                    ? (_lessons||[]).filter(l=>matchLezioneAllievo(l))
                    : (_lessons||[]);
                  const lezioniRec = _lessonsFiltered.filter(l=>l.inRecupero || l.attendance==='in_recupero');
                  const scaduti = lezioniRec.filter(l=>l.recuperoScadenza && new Date(l.recuperoScadenza+'T00:00:00') < oggi_r);
                  const urgenti = lezioniRec.filter(l=>{
                    const s=l.recuperoScadenza?new Date(l.recuperoScadenza+'T00:00:00'):null;
                    return s && s >= oggi_r && (s - oggi_r)/86400000 <= 5;
                  });
                  const recOk = lezioniRec.filter(l=>{
                    const s=l.recuperoScadenza?new Date(l.recuperoScadenza+'T00:00:00'):null;
                    return !s || (s >= oggi_r && (s - oggi_r)/86400000 > 5);
                  });

                  // Richieste recupero in attesa (da Supabase, via window per semplicità)
                  const richRec = (window.__richiesteRecupero__ || []);
                  const richDocente = ruolo==="docente"
                    ? richRec.filter(function(r){
                        var myKey = (myDocRecord && (myDocRecord.teacherKey||myDocRecord.nome)) || myDocNome;
                        return myKey && ((r.docente||"").toLowerCase().indexOf(myKey.toLowerCase())>=0 || myKey.toLowerCase().indexOf((r.docente||"").toLowerCase())>=0);
                      })
                    : ruolo==="admin" ? richRec : [];
                  const richInAttesa   = richDocente.filter(function(r){ return r.stato==='in_attesa'; });
                  const richConfermata = ruolo==='admin' ? richRec.filter(function(r){ return r.stato==='confermata'; }) : [];

                  return React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}
                      , React.createElement('div',{style:{display:"flex",alignItems:"center",gap:8}}
                        , React.createElement(Ic, { n: "clock", size: 14, stroke: '#f59e0b'})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}}, "Recuperi in sospeso")
                      )
                      , React.createElement('span', { style: {fontSize:22,fontWeight:700,fontFamily:"'Oswald',sans-serif",color:lezioniRec.length>0?'#f59e0b':C.green}}, lezioniRec.length)
                    )
                    , React.createElement('div', { style: {padding:"14px 18px"}}
                      /* Richieste da gestire (docente/admin) */
                      , (richInAttesa.length > 0 || richConfermata.length > 0) && React.createElement('div', {style:{marginBottom:10}}
                        , richInAttesa.length > 0 && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:C.purpleBg,border:`1px solid ${C.purpleBorder}`,marginBottom:5,cursor:'pointer'},
                            onClick:()=>{ onNavigate("calendario"); if(onQuickAction) setTimeout(()=>onQuickAction("showRecuperi"),80); }}
                          , React.createElement(Ic,{n:"calendar",size:13,stroke:C.purple})
                          , React.createElement('div',{style:{flex:1}}
                            , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:C.purple}}, richInAttesa.length+' richiesta'+(richInAttesa.length===1?'':'e')+' da approvare')
                            , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:1}}, richInAttesa.slice(0,2).map(function(r){return r.allievo_nome||'?';}).join(', ')+(richInAttesa.length>2?' +altri':''))
                          )
                        )
                        , richConfermata.length > 0 && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:C.blueBg,border:`1px solid ${C.blueBorder}`,marginBottom:5,cursor:'pointer'},
                            onClick:()=>{ onNavigate("calendario"); if(onQuickAction) setTimeout(()=>onQuickAction("showRecuperi"),80); }}
                          , React.createElement(Ic,{n:"check",size:13,stroke:C.blue})
                          , React.createElement('div',{style:{flex:1}}
                            , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:C.blue}}, richConfermata.length+' da confermare ufficialmente')
                            , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:1}}, richConfermata.slice(0,2).map(function(r){return r.allievo_nome||'?';}).join(', ')+(richConfermata.length>2?' +altri':''))
                          )
                        )
                      )
                      , lezioniRec.length === 0
                        ? React.createElement('div',{style:{textAlign:'center',padding:'20px 0',color:C.textDim}}
                            , React.createElement('div',{style:{fontSize:24,marginBottom:6}},'✓')
                            , React.createElement('p',{style:{fontSize:13}},'Nessuna lezione in recupero')
                          )
                        : React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:8}}
                            , scaduti.length>0 && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:C.redBg,border:`1px solid ${C.redBorder}`}}
                              , React.createElement('div',{style:{width:6,height:6,borderRadius:'50%',background:C.red,flexShrink:0}})
                              , React.createElement('div',{style:{flex:1}}
                                , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:C.red}}, scaduti.length+' scadut'+(scaduti.length===1?'a':'e'))
                                , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:1}}, scaduti.slice(0,2).map(l=>l.student||l.courseId||'?').join(', ')+(scaduti.length>2?' +altri':''))
                              )
                            )
                            , urgenti.length>0 && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.3)'}}
                              , React.createElement('div',{style:{width:6,height:6,borderRadius:'50%',background:'#f59e0b',flexShrink:0}})
                              , React.createElement('div',{style:{flex:1}}
                                , React.createElement('div',{style:{fontSize:13,fontWeight:600,color:'#b45309'}}, urgenti.length+' in scadenza (≤5 giorni)')
                                , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:1}}, urgenti.slice(0,2).map(l=>l.student||l.courseId||'?').join(', ')+(urgenti.length>2?' +altri':''))
                              )
                            )
                            , recOk.length>0 && React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:9,background:'rgba(245,158,11,0.04)',border:'1px solid rgba(245,158,11,0.15)'}}
                              , React.createElement('div',{style:{width:6,height:6,borderRadius:'50%',background:'#f59e0b',flexShrink:0}})
                              , React.createElement('div',{style:{flex:1}}
                                , React.createElement('div',{style:{fontSize:13,fontWeight:500,color:'#92400e'}}, recOk.length+' in recupero')
                                , React.createElement('div',{style:{fontSize:11,color:C.textDim,marginTop:1}}, 'Nessuna scadenza imminente')
                              )
                            )
                          )
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}
                      , React.createElement('button', { onClick: ()=>{ onNavigate("calendario"); if(onQuickAction) setTimeout(()=>onQuickAction("showRecuperi"),80); },
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:'#f59e0b',fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:5}}
                        , React.createElement(Ic, { n: "clock", size: 12, stroke: '#f59e0b'}), "Vai ai recuperi →"
                      )
                      , ruolo==="allievo" && lezioniRec.length > 0 && React.createElement('button', {
                          onClick: ()=>{ onNavigate("allievi"); if(onQuickAction) setTimeout(()=>onQuickAction("openRecuperoModal"),120); },
                          style:{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",
                            background:C.purpleBg,border:`1px solid ${C.purpleBorder}`,borderRadius:7,
                            cursor:"pointer",fontSize:12,color:C.purple,fontWeight:600,
                            fontFamily:"'Open Sans',sans-serif",transition:"all 0.12s"},
                          onMouseEnter:e=>{e.currentTarget.style.background=C.purple;e.currentTarget.style.color="#fff";},
                          onMouseLeave:e=>{e.currentTarget.style.background=C.purpleBg;e.currentTarget.style.color=C.purple;}
                        }
                        , React.createElement(Ic,{n:"calendar",size:12,stroke:"inherit"})
                        , ` Prenota recupero (${lezioniRec.length})`
                      )
                    )
                  );
                })()

                /* Grafico andamento */
                , isVisible("grafico") && ruolo==="admin" && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2266}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2267}}
                      , React.createElement(Ic, { n: "chart", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2268}})
                      , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2269}}, "Andamento " , ANNO)
                    )
                    , React.createElement('div', { style: {padding:"18px 18px 12px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2271}}
                      , React.createElement(MiniChart, { dati: FIN_MENSILE_LIVE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2272}})
                      , React.createElement('div', { style: {marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2273}}
                        , [{lbl:"Entrate",hex:C.green},{lbl:"Uscite",hex:C.red}].map(x=>(
                          React.createElement('div', { key: x.lbl, style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2275}}
                            , React.createElement('div', { style: {width:8,height:8,borderRadius:2,background:x.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2276}})
                            , React.createElement('span', { style: {fontSize:10,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2277}}, x.lbl)
                          )
                        ))
                      )
                      , React.createElement('div', { style: {marginTop:14,display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2281}}
                        , [
                          {lbl:"Tot. entrate",val:fmt(totEntrateAnno),hex:C.green},
                          {lbl:"Tot. uscite", val:fmt(totUsciteAnno), hex:C.red},
                          {lbl:"Saldo",       val:fmt(saldoAnnoLiveLive), hex:saldoAnnoLiveLive>=0?C.green:C.red},
                        ].map(x=>(
                          React.createElement('div', { key: x.lbl, style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2287}}
                            , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2288}}, x.lbl)
                            , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:600,color:x.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2289}}, x.val)
                          )
                        ))
                      )
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2294}}
                      , React.createElement('button', { onClick: ()=>onNavigate("contabilita"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2295}}
                        , React.createElement(Ic, { n: "euro", size: 12, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2297}}), "Apri contabilità →"
                      )
                    )
                  )
                )
              )
            )

            /* ── RIGA 4: PAGAMENTI + EVENTI ── */
            , (isVisible("pagamenti")||isVisible("eventi")) && (
              React.createElement('div', { style: {display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",...(window.__dash_panel_order__&&window.__dash_panel_order__('pagamenti'))}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2307}}
                , isVisible("pagamenti") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2309}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2310}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2311}}
                        , React.createElement(Ic, { n: ruolo==="docente"?"euro":"users", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2312}})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2313}}
                          , ruolo==="docente" ? "Compensi ricevuti" : ruolo==="allievo" ? "I miei pagamenti" : "Stato pagamenti"
                        )
                      )
                      , ruolo==="docente" && React.createElement('button', { onClick: ()=>{
                          onNavigate("docenti");
                          if(onQuickAction) setTimeout(()=>onQuickAction("showCompenso"), 120);
                        },
                          style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}, "Dettaglio →"
                      )
                      , ruolo!=="allievo" && ruolo!=="docente" && React.createElement('button', { onClick: ()=>onNavigate("allievi"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2315}}, "Vedi allievi →"
                      )
                    )
                    , React.createElement('div', { style: {padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2320}}
                      , ruolo==="docente"
                        ? React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:8}},
                            (()=>{
                              const meseC = oggi.getMonth()+1;
                              const annoC = oggi.getFullYear();
                              // KPI strip compensi
                              const lezMeseDoc = (_lessons||[]).filter(l=>
                                myDocRecord && matchDocLezione(l) && l.attendance !== 'recuperata' &&
                                (l.attendance==="presente"||l.attendance==="assente") &&
                                l.date && new Date(l.date+"T00:00:00").getMonth()+1===meseC &&
                                new Date(l.date+"T00:00:00").getFullYear()===annoC
                              );
                              const lezAnnoDoc = (_lessons||[]).filter(l=>
                                myDocRecord && matchDocLezione(l) && l.attendance !== 'recuperata' &&
                                (l.attendance==="presente"||l.attendance==="assente") &&
                                l.date && new Date(l.date+"T00:00:00").getFullYear()===annoC
                              );
                              const compMese = lezMeseDoc.length * (myDocRecord ? myDocRecord.tariffaOra||0 : 0);
                              const compAnno = lezAnnoDoc.length * (myDocRecord ? myDocRecord.tariffaOra||0 : 0);
                              const MESI_N = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
                              return React.createElement(React.Fragment, null
                                /* KPI strip */
                                , React.createElement('div', {style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}
                                  , [
                                      {label:"Lezioni mese",  value:lezMeseDoc.length, hex:C.teal, monetary:false},
                                      {label:`Compenso ${MESI_N[meseC-1]}`, value:fmt(compMese), hex:C.green, monetary:true},
                                      {label:`Totale ${annoC}`, value:fmt(compAnno), hex:C.gold, monetary:true},
                                    ].map(k=>
                                      React.createElement('div', {key:k.label, style:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",textAlign:"center"}}
                                        , React.createElement('div', {style:{fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,color:k.hex,lineHeight:1,
                                          filter: (!showAmounts && k.monetary) ? "blur(6px)" : "none",
                                          userSelect: (!showAmounts && k.monetary) ? "none" : "auto",
                                          transition:"filter 0.2s"}}, (!showAmounts && k.monetary) ? "••••" : k.value)
                                        , React.createElement('div', {style:{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:3}}, k.label)
                                      )
                                    )
                                )
                                /* Ultime lezioni fatturate */
                                , React.createElement('div', {style:{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}, "Ultime lezioni")
                                , (()=>{
                                    const ultime = (_lessons||[]).filter(l=>
                                      myDocRecord && matchDocLezione(l) && l.attendance !== 'recuperata' &&
                                      (l.attendance==="presente"||l.attendance==="assente")
                                    ).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,4);
                                    if(!ultime.length) return React.createElement('p',{style:{fontSize:13,color:C.textDim,textAlign:"center",padding:"8px 0"}},"Nessuna lezione registrata");
                                    return ultime.map((l,i)=>
                                      React.createElement('div',{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:C.bg,borderRadius:7,border:`1px solid ${C.border}`,marginBottom:5}}
                                        , React.createElement('div',null
                                          , React.createElement('div',{style:{fontSize:12,fontWeight:500,color:C.text}},l.student||"—")
                                          , React.createElement('div',{style:{fontSize:10,color:C.textDim}},
                                              new Date((l.date||"")+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"})
                                              +" ore "+(l.hour||"—")
                                            )
                                        )
                                        , React.createElement('div',{style:{textAlign:"right"}}
                                          , React.createElement('div',{style:{fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,color:C.green}},fmt(myDocRecord?myDocRecord.tariffaOra||0:0))
                                          , React.createElement('div',{style:{fontSize:9,color:C.textDim}},l.attendance)
                                        )
                                      )
                                    );
                                  })()
                              );
                            })()
                          )
                        : ruolo==="allievo"
                        ? React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:8}},
                            (()=>{
                              const miei=_entrate.filter(e=>myStudentId?e.studentId===myStudentId:(e.studentName||"").toLowerCase().includes(myNome.toLowerCase())).sort((a,b)=>(b.data||'').localeCompare(a.data||'')).slice(0,5);
                              if(!miei.length) return React.createElement('p',{style:{fontSize:13,color:C.textDim,textAlign:"center",padding:"12px 0"}},"Nessun pagamento registrato");
                              return miei.map((e,i)=>React.createElement('div',{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}},
                                React.createElement('div',null,
                                  React.createElement('div',{style:{fontSize:13,color:C.text}},e.desc||"Quota mensile"),
                                  React.createElement('div',{style:{fontSize:11,color:C.textDim}},new Date((e.data||"")+"T00:00:00").toLocaleDateString("it-IT"))
                                ),
                                React.createElement('span',{style:{fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:600,color:C.green}},fmt(e.importo||0))
                              ));
                            })()
                          )
                        : React.createElement(StatoAllievi, { allievi: ALLIEVI_LIVE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2321}})
                    )
                  )
                )
                , isVisible("eventi") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2326}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2327}}
                      , React.createElement(Ic, { n: "flag", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2328}})
                      , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2329}}, "Prossimi eventi" )
                    )
                    , React.createElement('div', { style: {padding:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2331}}
                      , React.createElement(EventiCard, { eventi: PROSSIMI_EVENTI_LIVE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2332}})
                    )
                  )
                )
              )
            )

            /* ── RIGA 5: ALERT + ATTIVITÀ (solo admin/docente) ── */
            , (isVisible("alert")||isVisible("attivita")) && ruolo==="admin" && (
              React.createElement('div', { style: {display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",...(window.__dash_panel_order__&&window.__dash_panel_order__('alert'))}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2341}}
                , isVisible("alert") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2343}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
                      display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2344}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2346}}
                        , React.createElement(Ic, { n: "alert", size: 14, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2347}})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2348}}, "Alert prioritari" )
                      )
                      , morosi>0 && (
                        React.createElement('span', { style: {background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,
                          borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2351}}
                          , morosi, " critici"
                        )
                      )
                    )
                    , React.createElement('div', { style: {padding:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2357}}
                      , React.createElement(AlertPanel, { allievi: ALLIEVI_LIVE, lezioniOggi: LEZIONI_OGGI_LIVE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2358}})
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2360}}
                      , React.createElement('button', { onClick: ()=>onNavigate("allievi"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2361}}
                        , React.createElement(Ic, { n: "users", size: 12, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2363}}), "Gestisci allievi →"
                      )
                    )
                  )
                )
                , isVisible("attivita") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2369}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2370}}
                      , React.createElement(Ic, { n: "clock", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2371}})
                      , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2372}}, "Attività recente" )
                    )
                    , React.createElement('div', { style: {padding:"6px 4px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2374}}
                      , React.createElement(AttivitaFeed, { items: ruolo==="allievo"
                        ? ATTIVITA_RECENTE_LIVE.filter(a=>{
                            const s=(a.sogg||"").toLowerCase();
                            return s.includes(myStudentName.toLowerCase()) || s.includes(myNome.toLowerCase());
                          })
                        : ruolo==="docente" ? ATTIVITA_RECENTE_LIVE.filter(a=>matchDocLezione({teacher:a.sogg}))
                        : ATTIVITA_RECENTE_LIVE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2375}})
                    )
                  )
                )
              )
            )

            /* ── Report Lezioni Mese (solo ADMIN) ── */
            , ruolo === "admin" && isVisible("report") && React.createElement('div',{style:{...(window.__dash_panel_order__&&window.__dash_panel_order__('report'))}}
              , React.createElement(ReportLezioniCard, {
                  lessons: _lessons,
                  students: ALLIEVI_LIVE,
                  config,
                  onNavigate,
                })
            )

            /* Footer */
            , React.createElement('div', { style: {paddingBottom:8,textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2383}}
              , React.createElement('span', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2384}}
                , config.nomeScuola.toUpperCase(), " · SISTEMA GESTIONALE · "     , config.annoScolastico
              )
            )
          )
        )

        , React.createElement(SettingsDrawer, {
          open: settingsOpen,
          onClose: ()=>setSettingsOpen(false),
          anniScolastici: anniScolastici,
          setAnniScolastici: setAnniScolastici,
          panels: panels,
          onPanels: setPanels,
          config: config,
          onConfig: setConfig,
          ruolo: ruolo,
          onRuolo: function(){}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2391}}
        )
      )
    );
};


// ════════════════════════════════════════════════════════════════════════════════

// ANAGRAFICA ALLIEVI

// ════════════════════════════════════════════════════════════════════════════════
// SORTING UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

var _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN
// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════

const RepertorioView = ({ brani:propBrani, setBrani:propSetBrani, students:_propStudentsRep, lessons:_propLessonsRep, docenti:_propDocentiRep, concerti:_propConcertiRep, quickAction, clearQuickAction, userRuolo:_ruoloRep, appUser:_appUserRep }) => {
  const ruoloRep = _ruoloRep || "admin";
  const _nomeAllievoRep = ruoloRep==="allievo" ? ((_appUserRep&&_appUserRep.nome)||"") : "";
  const isMobile = useIsMobile();
  const [_braniLocal, _setBraniLocal] = useState(INIT_BRANI);
  React.useEffect(()=>{ if(quickAction==="addBrano"){ setModal("add"); if(clearQuickAction)clearQuickAction(); } },[quickAction]);
  const brani    = propBrani    || _braniLocal;
  const setBrani = propSetBrani || _setBraniLocal;
  const _studBranoRep = (_propStudentsRep||[]).filter(s=>s.status==="attivo"||!s.status);
  const _lessonsRep   = _propLessonsRep || [];
  const _concertiRep  = _propConcertiRep || [];
  const usageCount    = id => _lessonsRep.filter(l => (l.repertorioIds||[]).includes(id)).length;
  // Conta allievi assegnati attraverso TUTTE le versioni del brano
  const allieviOfBrano= id => {
    const b = brani.find(x=>x.id===id); if (!b) return [];
    const ids = new Set();
    const out = [];
    (b.versioni||[]).forEach(v => (v.allievi||[]).forEach(a => {
      if (!ids.has(a.studentId)) { ids.add(a.studentId); out.push(a); }
    }));
    return out;
  };
  const allieviCount  = id => allieviOfBrano(id).length;

  // Il proprio strumento (per allievi) — usato per filtrare la visibilità
  const _myStudentRep = ruoloRep==="allievo" ? _studBranoRep.find(s=>(s.name||s.nome||"").toLowerCase()===_nomeAllievoRep.toLowerCase()) : null;
  const _myStrumento = _myStudentRep ? (_myStudentRep.instrument||"") : "";

    const [tab,       setTab]      = useState("catalogo"); // catalogo | allievi
    const [layout,    setLayout]   = useState("grid");     // grid | list
    const [search,    setSearch]   = useState("");
    const [fStrumento,setFStrumento]= useState("");
    const [fTipo,     setFTipo]    = useState("");
    const [fTonalita, setFTonalita]= useState("");
    const [drawer,    setDrawer]   = useState(null);
    const [modal,     setModal]    = useState(null); // "add"|"edit"|"confirm_delete"
    const [selBrano,  setSelBrano] = useState(null);
    const [allievoPOV,setAllievoPOV]=useState(null);
    const [toast,     setToast]    = useState(null);
  
    const showToast=(msg,hex=C.green)=>{setToast({msg,hex});setTimeout(()=>setToast(null),3000);};
    const closeModal=()=>{setModal(null);setSelBrano(null);};

    // ── Mappa brano JS → riga DB ──
    const toDbRow = (f, includeId=false) => ({
      ...(includeId ? {id: f.id||uid()} : {}),
      titolo: f.title||'', compositore: f.composer||'',
      strumento: f.strumento||null,
      eventi_ids: f.eventiIds||[], versioni: f.versioni||[],
      note: f.note||'',
    });

    // ── CRUD con persistenza Supabase ──
    // Sincronizza brano nella scaletta degli eventi collegati
    const syncBranoInEventi = async (branoId, branoTitle, branoComposer, eventiIds) => {
      const sb = window.supabaseClient; if (!sb) return;
      for (const evId of (eventiIds||[])) {
        const evento = _concertiRep.find(e=>e.id===evId); if (!evento) continue;
        const scaletta = evento.scaletta||[];
        // Aggiungi solo se non già presente
        if (!scaletta.some(s=>(s.branoId||s.brano)===branoId && !s.branoId ? s.brano===branoTitle : s.branoId===branoId)) {
          const nuovaScaletta = [...scaletta, {brano:branoTitle, performer:'', branoId:branoId, note:''}];
          await sb.from('concerti').update({scaletta:nuovaScaletta}).eq('id',evId);
          // Aggiorna stato locale concerti
          if (window.__FM_DATA__&&window.__FM_DATA__.setConcerti) {
            window.__FM_DATA__.setConcerti(p=>p.map(e=>e.id===evId?{...e,scaletta:nuovaScaletta}:e));
          }
        }
      }
    };

    const aggiungiBrano = async (f) => {
      const tempId = uid();
      setBrani(p=>[...p,{...f,id:tempId}]);
      closeModal();
      try {
        const sb = window.supabaseClient;
        if (sb) {
          const { data, error } = await sb.from('brani').insert(toDbRow(f, true)).select().single();
          if (error) { console.warn('[FM] insert brano error:', error.message); showToast('Errore salvataggio: '+error.message, C.red); }
          else if (data) {
            const realId = data.id;
            setBrani(p=>p.map(b=>b.id===tempId?{...f,id:realId}:b));
            if ((f.eventiIds||[]).length>0) await syncBranoInEventi(realId, f.title, f.composer, f.eventiIds);
          }
        }
      } catch(e) { console.warn('[FM] aggiungiBrano exception:', e?.message); }
      showToast("Brano aggiunto");
      // Aggiorna scaletta concerti se necessario
      if ((f.eventiIds||[]).length>0 && window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__();
    };
    const modificaBrano = async (f) => {
      setBrani(p=>p.map(b=>b.id===selBrano.id?{...b,...f}:b));
      closeModal(); setDrawer(null);
      try {
        const sb = window.supabaseClient;
        if (sb) {
          const { error } = await sb.from('brani').update(toDbRow(f)).eq('id', selBrano.id);
          if (error) { console.warn('[FM] update brano error:', error.message); showToast('Errore salvataggio: '+error.message, C.red); return; }
          // Sincronizza eventi collegati nuovi (quelli già presenti vengono saltati)
          if ((f.eventiIds||[]).length>0) await syncBranoInEventi(selBrano.id, f.title, f.composer, f.eventiIds);
        }
      } catch(e) { console.warn('[FM] modificaBrano exception:', e?.message); }
      showToast("Brano aggiornato");
    };
    const eliminaBrano = async () => {
      const id = selBrano.id;
      setBrani(p=>p.filter(b=>b.id!==id));
      setDrawer(null); closeModal();
      try {
        const sb = window.supabaseClient;
        if (sb) {
          const { error } = await sb.from('brani').delete().eq('id', id);
          if (error) console.warn('[FM] delete brano error:', error.message);
        }
      } catch(e) { console.warn('[FM] eliminaBrano exception:', e?.message); }
      showToast("Brano eliminato",C.red);
    };

    // Salva direttamente le versioni di un brano (usato dal drawer per assegnare allievi/file inline)
    const aggiornaVersioni = async (branoId, nuoveVersioni) => {
      setBrani(p=>p.map(b=>b.id===branoId?{...b,versioni:nuoveVersioni}:b));
      try {
        const sb = window.supabaseClient;
        if (sb) {
          const { error } = await sb.from('brani').update({versioni:nuoveVersioni}).eq('id', branoId);
          if (error) console.warn('[FM] aggiornaVersioni error:', error.message);
        }
      } catch(e) { console.warn('[FM] aggiornaVersioni exception:', e?.message); }
    };
  
    // ── VISIBILITÀ per strumento (allievi vedono solo il proprio + ensemble) ──
    const braniVisibili = useMemo(() => {
      if (ruoloRep === "docente" || ruoloRep === "admin") return brani; // vedono tutto
      if (ruoloRep === "allievo" && _myStrumento) {
        return brani.filter(b => !b.strumento || b.strumento === _myStrumento);
      }
      return brani;
    }, [brani, ruoloRep, _myStrumento]);

    // ── FILTRI ──
    const tuttiStrumenti = useMemo(() => [...new Set(braniVisibili.map(b=>b.strumento).filter(Boolean))].sort(), [braniVisibili]);
    const tutteTonalita  = useMemo(() => {
      const set = new Set();
      braniVisibili.forEach(b => (b.versioni||[]).forEach(v => { if (v.tonalita) set.add(v.tonalita); }));
      return [...set].sort();
    }, [braniVisibili]);

    const filtrati = useMemo(()=>braniVisibili.filter(b=>{
      const q=search.toLowerCase();
      const matchTonalita = (b.versioni||[]).some(v=>(v.tonalita||'').toLowerCase().includes(q));
      return(!q||b.title.toLowerCase().includes(q)||b.composer.toLowerCase().includes(q)||matchTonalita)
        &&(!fStrumento||b.strumento===fStrumento||(fStrumento==='__ensemble__'&&!b.strumento))
        &&(!fTipo||b.tipo===fTipo)
        &&(!fTonalita||(b.versioni||[]).some(v=>v.tonalita===fTonalita));
    }),[braniVisibili,search,fStrumento,fTipo,fTonalita]);
  

    // ── STATS ──
    const totLezioni=_lessonsRep.length;
    const braniAvanzati=brani.filter(b=>b.difficulty==="Avanzato"||b.difficulty==="Professionale").length;
  
    return(
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7726}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7727}}

          /* ── BARRA MODULO ── */
          , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"0 clamp(12px,3vw,24px)",display:"flex",alignItems:"center",
            height:52,flexShrink:0,gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7730}}
            , React.createElement(Ic, { n: "book", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7733}})
            , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,color:C.gold,letterSpacing:"0.04em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7734}}, "Repertorio")
            , ruoloRep!=="allievo" && React.createElement('div', { style: {marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7735}}
              , React.createElement(Btn, { onClick: ()=>setModal("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7736}}
                , React.createElement(Ic, { n: "plus", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7737}}), "Nuovo brano"
              )
            )
          )

          /* ── Per allievo loggato: vista diretta propri brani ── */
          , ruoloRep==="allievo" && _nomeAllievoRep ? (
            React.createElement(AllievoBraniView, {
              allievo: _nomeAllievoRep,
              allievoId: (_appUserRep&&_appUserRep.allievoId)||null,
              brani: brani,
              allStudents: _studBranoRep,
              lessons: _lessonsRep,
              onBack: undefined,
            }
            )
          ) : allievoPOV ? (
            React.createElement(AllievoBraniView, {
              allievo: allievoPOV,
              brani: brani,
              allStudents: _studBranoRep,
              lessons: _lessonsRep,
              onBack: ()=>setAllievoPOV(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7744}}
            )
          ) : (
            React.createElement(React.Fragment, null
              /* ── PAGE HEADER ── */
              , React.createElement('div', { style: {background:`linear-gradient(135deg,${C.surface} 0%,${C.bg} 100%)`,
                borderBottom:`1px solid ${C.border}`,padding:"16px clamp(12px,3vw,20px)",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7752}}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7754}}
                  , React.createElement('div', { style: {animation:"fadeUp .4s ease both",flex:"1 1 auto",minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7755}}
                    , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(20px,5vw,28px)",fontWeight:300,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7756}}
                      , React.createElement('span', { style: {fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7757}}, "Repertorio"), " musicale"
                    )
                    , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7759}}, "Catalogo brani, assegnazioni allievi e storico lezioni"
                    )
                  )
                  , React.createElement('div', { style: {display:"flex",gap:8,animation:"fadeUp .4s ease .1s both",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7763}}
                    , [
                      {label:"Brani totali",  val:brani.length,                                    hex:C.gold},
                      {label:"Avanzati",      val:brani.filter(b=>b.difficulty==="Avanzato"||b.difficulty==="Professionale").length, hex:C.gold},
                      {label:"Lezioni totali",val:totLezioni,                                       hex:C.blue},
                    ].map(k=>(
                      React.createElement('div', { key: k.label, style: {padding:"8px 12px",background:C.surface,
                        border:`1px solid ${C.border}`,borderRadius:10,textAlign:"center",minWidth:60}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7770}}
                        , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(18px,4vw,24px)",fontWeight:600,color:k.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7772}}, k.val)
                        , React.createElement('div', { style: {fontSize:9,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase",marginTop:2,whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7773}}, k.label)
                      )
                    ))
                  )
                )
              )

              /* ── BODY ── */
              , React.createElement('div', { style: {flex:1,padding:isMobile?"12px":"20px 24px",overflow:"auto",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7781}}

                /* Tabs + layout */
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7784}}
                  , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7785}}
                    , [["catalogo","book","Catalogo brani"],["allievi","users","Per allievo"]].map(([v,ic,lb])=>(
                      React.createElement('button', { key: v, onClick: ()=>setTab(v),
                        style: {display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,
                          background:tab===v?C.goldBg:"none",border:`1px solid ${tab===v?C.goldDim:C.border}`,
                          cursor:"pointer",fontSize:13,color:tab===v?C.gold:C.textMuted,
                          fontFamily:"'Open Sans',sans-serif",transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7787}}
                        , React.createElement(Ic, { n: ic, size: 14, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7792}}), lb
                      )
                    ))
                  )
                  , tab==="catalogo"&&(
                    React.createElement('div', { style: {display:"flex",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7797}}
                      , [["grid","grid2"],["list","list"]].map(([v,ic])=>(
                        React.createElement('button', { key: v, onClick: ()=>setLayout(v),
                          style: {padding:"7px 12px",display:"flex",alignItems:"center",gap:5,
                            background:layout===v?C.goldBg:"transparent",border:"none",cursor:"pointer",
                            color:layout===v?C.gold:C.textMuted,borderRight:`1px solid ${C.border}`,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7799}}
                          , React.createElement(Ic, { n: ic, size: 14, stroke: layout===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7803}})
                        )
                      ))
                    )
                  )
                )

                /* ── TAB CATALOGO ── */
                , tab==="catalogo"&&(
                  React.createElement(React.Fragment, null
                    /* Filtri */
                    , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7814}}
                      , React.createElement('div', { style: {position:"relative",flex:"1 1 220px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7815}}
                        , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7816}}
                          , React.createElement(Ic, { n: "search", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7817}})
                        )
                        , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
                          placeholder: "Cerca titolo, compositore, tonalità..."   ,
                          style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                            color:C.text,fontSize:13,padding:"9px 12px 9px 34px",fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7819}})
                      )
                      , [
                        {val:fStrumento,set:setFStrumento,opts:[{id:'__ensemble__',label:'🎭 Ensemble/Collettivo'},...tuttiStrumenti.map(s=>({id:s,label:s}))],ph:"Strumento/Corso"},
                        {val:fTipo,set:setFTipo,opts:[{id:'individuale',label:'Individuale'},{id:'collettivo',label:'Collettivo'}],ph:"Tipo"},
                        {val:fTonalita,set:setFTonalita,opts:tutteTonalita.map(t=>({id:t,label:t})),ph:"Tonalità"},
                      ].map((f,i)=>(
                        React.createElement('select', { key: i, value: f.val, onChange: e=>f.set(e.target.value),
                          style: {background:C.surface,border:`1px solid ${f.val?C.goldDim:C.border}`,
                            borderRadius:8,color:f.val?C.gold:C.textMuted,fontSize:13,
                            padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7829}}
                          , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7833}}, f.ph)
                          , f.opts.map(o=>React.createElement('option', { key: o.id, value: o.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7834}}, o.label))
                        )
                      ))
                      , (search||fStrumento||fTipo||fTonalita)&&(
                        React.createElement(Btn, { small: true, variant: "ghost", onClick: ()=>{setSearch("");setFStrumento("");setFTipo("");setFTonalita("");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7838}}
                          , React.createElement(Ic, { n: "x", size: 12, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7839}}), "Azzera"
                        )
                      )
                      , React.createElement('span', { style: {fontSize:12,color:C.textDim,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7842}}, filtrati.length, " brani" )
                    )

                    /* ── GRID ── */
                    , layout==="grid"&&(
                      React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7847}}
                        /* Sezione individuale */
                        , filtrati.length>0&&(
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7850}}
                            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7856}}
                              , filtrati.map((b,i)=>{
                                const primaTonalita = (b.versioni||[])[0]?.tonalita || '';
                                const nVersioni = (b.versioni||[]).length;
                                return(
                                  React.createElement('div', { key: b.id, className: "card-anim", onClick: ()=>{setSelBrano(b);setModal('view');},
                                    style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                                      padding:"15px 17px",cursor:"pointer",transition:"all .15s"},
                                    onMouseEnter: e=>{e.currentTarget.style.borderColor=C.gold+"50";e.currentTarget.style.background=C.surfaceHover;},
                                    onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}
                                    , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}
                                      , React.createElement('div', { style: {flex:1,minWidth:0}}
                                        , React.createElement('div', { style: {fontSize:14,fontWeight:600,lineHeight:1.3,marginBottom:3,
                                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}, b.title)
                                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}}, b.composer)
                                      )
                                      , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim})
                                    )
                                    , React.createElement('div', { style: {display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginBottom:8}}
                                      , React.createElement('span', { style: {fontSize:10,padding:"2px 7px",borderRadius:4,
                                          background:b.strumento?`${C.teal}18`:`${C.purple}18`,
                                          color:b.strumento?C.teal:C.purple,
                                          border:`1px solid ${b.strumento?C.tealBorder:C.purple+'40'}`}}
                                        , b.strumento ? b.strumento : '🎭 Ensemble')
                                      , primaTonalita&&React.createElement('span', { style: {fontSize:10,padding:"2px 6px",borderRadius:4,border:`1px solid ${C.border}`,color:C.textMuted}}, primaTonalita)
                                      , nVersioni>1&&React.createElement('span', { style: {fontSize:10,padding:"2px 6px",borderRadius:4,background:C.bg,color:C.textDim,border:`1px solid ${C.border}`}}, nVersioni+' versioni')
                                    )
                                    , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",
                                      paddingTop:8,borderTop:`1px solid ${C.border}20`}}
                                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}}
                                        , React.createElement(Ic, { n: "users", size: 12, stroke: C.textDim})
                                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}}, allieviCount(b.id), " alliev" , allieviCount(b.id)===1?"o":"i")
                                      )
                                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}}
                                        , React.createElement(Ic, { n: "calendar", size: 12, stroke: C.textDim})
                                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}}, usageCount(b.id), " lezioni" )
                                      )
                                    )
                                  )
                                );
                              })
                            )
                          )
                        )


                        , filtrati.length===0&&(
                          React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7946}}
                            , React.createElement(Ic, { n: "music", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7947}})
                            , React.createElement('p', { style: {marginTop:12,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7948}}, "Nessun brano trovato"  )
                          )
                        )
                      )
                    )

                    /* ── LIST ── */
                    , layout==="list"&&(
                      React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7956}}
                        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2.5fr 1fr 1.2fr 1fr 0.8fr 0.8fr auto",minWidth:560,
                          padding:"8px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}}
                          , ["Brano","Tipo","Strumento","Tonalità","Allievi","Lezioni",""].map(h=>(
                            React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}, h)
                          ))
                        )
                        , filtrati.map((b,i)=>{
                          const primaTonalita = (b.versioni||[])[0]?.tonalita || '';
                          return(
                            React.createElement('div', { key: b.id, onClick: ()=>{setSelBrano(b);setModal('view');},
                              style: {display:"grid",gridTemplateColumns:"2.5fr 1fr 1.2fr 1fr 0.8fr 0.8fr auto",minWidth:560,
                                padding:"12px 20px",borderBottom:i<filtrati.length-1?`1px solid ${C.border}20`:"none",
                                alignItems:"center",cursor:"pointer",transition:"background .1s"},
                              onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                              onMouseLeave: e=>e.currentTarget.style.background="transparent"}
                              , React.createElement('div', null
                                , React.createElement('div', { style: {fontSize:13,fontWeight:500}}, b.title)
                                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}}, b.composer)
                              )
                              , React.createElement(TipoBadge, { tipo: b.tipo})
                              , React.createElement('span', { style: {fontSize:12,color:b.strumento?C.teal:C.purple}}, b.strumento||'🎭 Ensemble')
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted}}, primaTonalita||'—')
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted}}, allieviCount(b.id))
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted}}, usageCount(b.id))
                              , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim})
                            )
                          );
                        })
                      )
                    )
                  )
                )

                /* ── TAB ALLIEVI ── */
                , tab==="allievi"&&(
                  React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7994}}
                    , _studBranoRep.map((a,i)=>{
                      const stuName=a.name||a.nome||"";
                      const suoiBrani=brani.filter(b=>(a.repertorio||[]).some(r=>r.id===b.id));
                      const totLez=suoiBrani.reduce((acc,b)=>acc+_lessonsRep.filter(l=>(l.repertorioIds||[]).includes(b.id)).length,0);
                      const ind=suoiBrani.length;
                      return(
                        React.createElement('div', { key: stuName, className: "card-anim", onClick: ()=>setAllievoPOV(stuName),
                          style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                            padding:"18px 18px",cursor:"pointer",transition:"all .15s"},
                          onMouseEnter: e=>{e.currentTarget.style.borderColor=C.gold+"50";e.currentTarget.style.background=C.surfaceHover;},
                          onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8001}}
                          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12,marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8006}}
                            , React.createElement('div', { style: {width:44,height:44,borderRadius:"50%",background:`${C.gold}18`,
                              border:`2px solid ${C.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",
                              fontFamily:"'Oswald',sans-serif",fontSize:17,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8007}}
                              , stuName.split(" ").map(p=>p[0]).join("").slice(0,2)
                            )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8012}}
                              , React.createElement('div', { style: {fontSize:13,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8013}}, stuName)
                              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8014}}, suoiBrani.length, " brani" )
                            )
                          )
                          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,
                            borderTop:`1px solid ${C.border}`,paddingTop:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8017}}
                            , [{val:suoiBrani.length,label:"Brani",hex:C.gold},{val:totLez,label:"Lez.",hex:C.blue}].map(s=>(
                              React.createElement('div', { key: s.label, style: {textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8020}}
                                , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8021}}, s.val)
                                , React.createElement('div', { style: {fontSize:9,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8022}}, s.label)
                              )
                            ))
                          )
                        )
                      );
                    })
                  )
                )
              )
            )
          )
        )

        /* drawer rimosso — brano aperto come modal */


        /* ── MODALI ── */
        , modal==="view"&&selBrano&&(
          React.createElement(Modal, { title: selBrano.title, onClose: closeModal, wide: true}
            , React.createElement('div',{style:{display:'flex',flexDirection:'column'}}
              /* Badges header */
              , React.createElement('div',{style:{padding:'4px 22px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',gap:6,flexWrap:'wrap'}}
                , selBrano.strumento && React.createElement('span',{style:{fontSize:11,padding:'3px 10px',borderRadius:20,background:`${C.teal}18`,color:C.teal,border:`1px solid ${C.tealBorder}`}}, '🎵 '+selBrano.strumento)
                , (selBrano.eventiIds||[]).length>0 && React.createElement('span',{style:{fontSize:11,padding:'3px 10px',borderRadius:20,background:C.goldBg,color:C.gold,border:`1px solid ${C.goldDim}`}}, '🎤 '+( selBrano.eventiIds||[]).length+' event'+(( selBrano.eventiIds||[]).length===1?'o':'i'))
                , (selBrano.versioni||[]).length>1 && React.createElement('span',{style:{fontSize:11,padding:'3px 10px',borderRadius:20,background:C.bg,color:C.textMuted,border:`1px solid ${C.border}`}}, (selBrano.versioni||[]).length+' versioni')
              )
              /* Versioni con toggle */
              , React.createElement('div',{style:{padding:'16px 22px',maxHeight:'65vh',overflowY:'auto',display:'flex',flexDirection:'column',gap:10}}
                , selBrano.note && React.createElement('div',{style:{fontSize:13,color:C.textMuted,fontStyle:'italic',marginBottom:4}},selBrano.note)
                , (selBrano.versioni||[]).map((v,idx)=>{
                    const fileCount=(v.spartiti||[]).length+(v.allegati||[]).length+(v.link||[]).length;
                    const label=[selBrano.title,v.strumento||selBrano.strumento,v.tonalita].filter(Boolean).join(' - ')||`Versione ${idx+1}`;
                    return React.createElement('div',{key:idx,style:{border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}
                      , React.createElement('div',{style:{padding:'12px 16px',background:C.bg,display:'flex',justifyContent:'space-between',alignItems:'center'}}
                        , React.createElement('span',{style:{fontWeight:600,fontSize:13}},label)
                        , React.createElement('span',{style:{fontSize:11,color:C.textDim}},`${(v.allievi||[]).length} 👤 · ${fileCount} 📎`)
                      )
                      , React.createElement('div',{style:{padding:'12px 16px',display:'flex',flexDirection:'column',gap:8}}
                        , (v.link||[]).map((l,li)=>React.createElement('a',{key:li,href:l.url,target:'_blank',rel:'noopener noreferrer',style:{fontSize:12,color:C.blue,display:'flex',alignItems:'center',gap:6}},React.createElement(Ic,{n:'link',size:11,stroke:C.blue}),l.label||l.url))
                        , [...(v.spartiti||[]),...(v.allegati||[])].map((fi,fii)=>React.createElement('a',{key:fi.id||fii,href:fi.fileUrl,target:'_blank',rel:'noopener noreferrer',style:{fontSize:12,color:C.text,display:'flex',alignItems:'center',gap:6,padding:'5px 8px',background:C.surface,borderRadius:6,border:`1px solid ${C.border}`}},React.createElement(Ic,{n:'paperclip',size:11,stroke:C.textMuted}),fi.fileName))
                        , (v.allievi||[]).length>0 && React.createElement('div',{style:{display:'flex',flexWrap:'wrap',gap:5,marginTop:4}},
                            (v.allievi||[]).map(a=>React.createElement('span',{key:a.studentId,style:{fontSize:11,padding:'3px 9px',borderRadius:20,background:`${C.teal}18`,color:C.teal,border:`1px solid ${C.tealBorder}`}},a.studentName))
                          )
                      )
                    );
                  })
              )
              /* Footer */
              , React.createElement('div',{style:{padding:'14px 22px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between'}}
                , React.createElement(Btn,{danger:true,onClick:()=>{setModal('confirm_delete');}},React.createElement(Ic,{n:'trash',size:13,stroke:C.red}),'Elimina')
                , React.createElement(Btn,{variant:'secondary',onClick:()=>setModal('edit')},React.createElement(Ic,{n:'edit',size:13,stroke:C.textMuted}),'Modifica')
              )
            )
          )
        )
        , modal==="add"&&(
          React.createElement(Modal, { title: "Nuovo brano" , onClose: closeModal, wide: true}
            , React.createElement(BranoForm, { onSave: aggiungiBrano, onClose: closeModal, students: _studBranoRep, concerti: _concertiRep, courses: _propStudentsRep?window.__FM_DATA__&&window.__FM_DATA__.courses||[]:[]})
          )
        )
        , modal==="edit"&&selBrano&&(
          React.createElement(Modal, { title: "Modifica brano" , onClose: closeModal, wide: true}
            , React.createElement(BranoForm, { initial: selBrano, onSave: modificaBrano, onClose: closeModal, students: _studBranoRep, concerti: _concertiRep, courses: window.__FM_DATA__&&window.__FM_DATA__.courses||[]})
          )
        )
        , modal==="confirm_delete"&&selBrano&&(
          React.createElement(ConfirmDel, {
            title: "Elimina brano" ,
            testo: `Eliminare "${selBrano.title}" dal catalogo? L'operazione è irreversibile.`,
            onConfirm: eliminaBrano,
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8058}}
          )
        )

        /* ── TOAST ── */
        , toast&&(
          React.createElement('div', { style: {position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:400,
            background:C.surface,border:`1px solid ${toast.hex}40`,borderLeft:`3px solid ${toast.hex}`,
            borderRadius:10,padding:"11px 18px",display:"flex",alignItems:"center",gap:10,
            animation:"fadeUp .25s ease",boxShadow:"0 8px 32px rgba(0,0,0,.5)",
            fontFamily:"'Open Sans',sans-serif",fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8068}}
            , React.createElement(Ic, { n: "check", size: 14, stroke: toast.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8073}})
            , React.createElement('span', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8074}}, toast.msg)
          )
        )
      )
    );
};

// ════════════════════════════════════════════════════════════════════════════════
// CONCERTI & EVENTI
// ════════════════════════════════════════════════════════════════════════════════

const TIPI_EVENTO = [
  { id:"saggio",      label:"Saggio",         icon:"star2",   hex:C.gold,
    desc:"Esibizione degli allievi con brani del repertorio studiato. Partecipazione obbligatoria." },
  { id:"concerto",    label:"Concerto",        icon:"mic",     hex:C.purple,
    desc:"Concerto pubblico con allievi avanzati e docenti. Biglietteria opzionale." },
  { id:"workshop",    label:"Workshop",        icon:"group",   hex:C.teal,
    desc:"Workshop intensivo. Partecipazione facoltativa per gli allievi della scuola." },
  { id:"masterclass", label:"Masterclass",     icon:"user",    hex:C.blue,
    desc:"Con artista ospite. Aperta anche a studenti esterni. Biglietteria opzionale." },
  { id:"pubblico",    label:"Evento pubblico", icon:"bell",    hex:C.green,
    desc:"Rassegna, festival o evento aperto. Partecipazione facoltativa." },
];

const STATI_EVENTO = ["programmato","in corso","completato","annullato"];

const statoEvColor = st => ({
  programmato:{ fg:C.blue,   bg:C.blueBg,   bd:C.blueBorder  },
  completato: { fg:C.green,  bg:C.greenBg,  bd:C.greenBorder },
  annullato:  { fg:C.red,    bg:C.redBg,    bd:C.redBorder   },
  "in corso": { fg:C.gold,   bg:C.goldBg,   bd:C.goldDim     },
}[st] || { fg:C.textMuted, bg:C.surface, bd:C.border });

const tipoEv = id => TIPI_EVENTO.find(t=>t.id===id)||TIPI_EVENTO[0];

const INIT_CONCERTI = [
  {
    id:"ev1", tipo:"saggio", titolo:"Saggio di Fine Anno 2025/2026",
    data:"2026-06-15", ora:"17:00", luogo:"Aula Magna", capienza:150,
    biglietto:true, prezzoBiglietto:10, stato:"programmato",
    descrizione:"Esibizione annuale di tutti gli allievi con i brani studiati durante l'anno.",
    note:"Rinfresco post-saggio nel cortile.",
    partecipanti:[
      {studentId:1, studentName:"Sofia Marchetti", brani:["Notturno Op.9 n.2 – Chopin","Invenzione n.1 – Bach"]},
      {studentId:2, studentName:"Luca Ferrara",    brani:["Romanza senza parole – Mendelssohn"]},
      {studentId:3, studentName:"Emma Conti",      brani:["Gavotte – Gossec","Minuetto – Boccherini"]},
      {studentId:4, studentName:"Marco Ricci",     brani:["Solo batteria – Red Hot Chili Peppers"]},
      {studentId:5, studentName:"Giulia Romano",   brani:["Syrinx – Debussy"]},
    ],
    prenotazioni:[
      {id:"pr1",nome:"Anna Bianchi",  email:"anna.b@email.it", telefono:"333 1111111",posti:2,stato:"confermata",dataPren:"2026-05-10",pagato:true},
      {id:"pr2",nome:"Carlo Verdi",   email:"carlo.v@email.it",telefono:"333 2222222",posti:3,stato:"confermata",dataPren:"2026-05-12",pagato:true},
      {id:"pr3",nome:"Maria Russo",   email:"maria.r@email.it",telefono:"333 3333333",posti:2,stato:"confermata",dataPren:"2026-05-15",pagato:false},
      {id:"pr4",nome:"Giuseppe Conti",email:"g.conti@email.it",telefono:"333 4444444",posti:4,stato:"confermata",dataPren:"2026-05-20",pagato:true},
      {id:"pr5",nome:"Laura Esposito",email:"l.esp@email.it",  telefono:"333 5555555",posti:1,stato:"annullata", dataPren:"2026-05-21",pagato:false},
    ],
  },
  {
    id:"ev2", tipo:"masterclass", titolo:"Masterclass Pianoforte – Marco Bargagna",
    data:"2026-04-12", ora:"10:00", luogo:"Sala B", capienza:30,
    biglietto:true, prezzoBiglietto:25, stato:"completato",
    descrizione:"Masterclass aperta anche a studenti esterni.",
    note:"Presenti 18 partecipanti. Grande successo.",
    partecipanti:[{studentId:1,studentName:"Sofia Marchetti",brani:["Notturno Op.9 n.2 – Chopin"]}],
    prenotazioni:[
      {id:"pr6",nome:"Elena Ferretti",email:"e.ferretti@email.it",telefono:"333 6666666",posti:1,stato:"confermata",dataPren:"2026-03-20",pagato:true},
      {id:"pr7",nome:"Paolo Martini", email:"p.martini@email.it", telefono:"333 7777777",posti:1,stato:"confermata",dataPren:"2026-03-22",pagato:true},
      {id:"pr8",nome:"Sara Colombo",  email:"s.colombo@email.it", telefono:"333 8888888",posti:1,stato:"confermata",dataPren:"2026-03-25",pagato:true},
    ],
  },
  {
    id:"ev3", tipo:"workshop", titolo:"Workshop: Improvvisazione Jazz",
    data:"2026-05-08", ora:"14:30", luogo:"Sala Prove", capienza:20,
    biglietto:false, prezzoBiglietto:0, stato:"programmato",
    descrizione:"Workshop gratuito di introduzione all'improvvisazione jazz.",
    note:"", partecipanti:[
      {studentId:2,studentName:"Luca Ferrara",brani:[]},
      {studentId:4,studentName:"Marco Ricci",  brani:[]},
    ], prenotazioni:[],
  },
  {
    id:"ev4", tipo:"concerto", titolo:"Concerto di Natale 2025",
    data:"2025-12-21", ora:"18:00", luogo:"Piazza del Comune", capienza:500,
    biglietto:false, prezzoBiglietto:0, stato:"completato",
    descrizione:"Concerto natalizio all'aperto con docenti e allievi avanzati.",
    note:"Stima pubblico: ~200 persone.",
    partecipanti:[
      {studentId:1,studentName:"Sofia Marchetti",brani:["White Christmas","O Holy Night"]},
      {studentId:3,studentName:"Emma Conti",      brani:["Noel"]},
      {studentId:5,studentName:"Giulia Romano",   brani:["Adeste Fideles"]},
    ],
    prenotazioni:[],
  },
];

// ─── TOGGLE COMPONENT ─────────────────────────────────────────────────────────


// ─── FORM PRENOTAZIONE ────────────────────────────────────────────────────────
const PrenotazioneForm = ({ evento, students:psStudents, docenti:psDocenti, initial, onSave, onClose }) => {
  const stuList = psStudents || [];
  const docList = psDocenti || [];
  const def = initial || {id:"",nome:"",email:"",telefono:"",posti:1,stato:"confermata",dataPren:new Date().toISOString().split("T")[0],pagato:false,categoria:"pubblico",studentId:"",docenteId:"",sconto:0};
  const [f,setF] = useState(def);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const postiGia = evento.prenotazioni
    .filter(p=>p.stato==="confermata"&&p.id!==(_optionalChain([initial, 'optionalAccess', _75 => _75.id])||""))
    .reduce((t,p)=>t+p.posti,0);
  const postiLib = Math.max(0, evento.capienza - postiGia);
  const importoLordo = f.posti*(evento.prezzoBiglietto||0);
  const importo  = Math.max(0, importoLordo - (parseFloat(f.sconto)||0));

  // Quando si seleziona un allievo/docente dal menu, precompila automaticamente il nome
  const handleSelectPersona = (id, tipo) => {
    if (tipo === 'allievo') {
      const stu = stuList.find(s=>String(s.id)===String(id));
      setF(p=>({...p, studentId:id, docenteId:'', nome: stu?(stu.name||stu.nome):p.nome}));
    } else if (tipo === 'docente') {
      const doc = docList.find(d=>String(d.id)===String(id));
      setF(p=>({...p, docenteId:id, studentId:'', nome: doc?doc.nome:p.nome}));
    }
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:"20px 24px",display:"flex",flexDirection:"column",gap:14,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8184}}

        /* Categoria prenotazione */
        , React.createElement('div', null
          , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:6}}, "Categoria biglietto")
          , React.createElement('div', {style:{display:"flex",gap:6,flexWrap:"wrap"}}
            , [{id:"pubblico",label:"🎫 Pubblico esterno"},{id:"allievo",label:"🎓 Allievo"},{id:"docente",label:"👤 Docente"}].map(c => {
                const sel = f.categoria === c.id;
                return React.createElement('button', {key:c.id, onClick:()=>set("categoria",c.id),
                  style:{padding:"6px 14px",borderRadius:20,border:`1px solid ${sel?C.gold:C.border}`,
                    background:sel?C.goldBg:C.bg,color:sel?C.gold:C.textMuted,cursor:"pointer",
                    fontSize:12,fontWeight:sel?700:400,fontFamily:"'Open Sans',sans-serif"}}, c.label);
              })
          )
        )

        /* Selettore allievo o docente, se categoria lo richiede */
        , f.categoria === "allievo" && React.createElement('div', null
            , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:4}}, "Seleziona allievo")
            , React.createElement('select', {value:f.studentId, onChange:e=>handleSelectPersona(e.target.value,'allievo'),
                style:{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif"}}
              , React.createElement('option',{value:""},"-- Seleziona --")
              , stuList.slice().sort((a,b)=>(a.name||a.nome||"").localeCompare(b.name||b.nome||"")).map(s=>
                  React.createElement('option',{key:s.id,value:s.id}, s.name||s.nome)
                )
            )
          )
        , f.categoria === "docente" && React.createElement('div', null
            , React.createElement('label', {style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",display:"block",marginBottom:4}}, "Seleziona docente")
            , React.createElement('select', {value:f.docenteId, onChange:e=>handleSelectPersona(e.target.value,'docente'),
                style:{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif"}}
              , React.createElement('option',{value:""},"-- Seleziona --")
              , docList.slice().sort((a,b)=>(a.nome||"").localeCompare(b.nome||"")).map(d=>
                  React.createElement('option',{key:d.id,value:d.id}, d.nome)
                )
            )
          )

        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8185}}
          , React.createElement(Input, { label: "Nome *" , value: f.nome, onChange: e=>set("nome",e.target.value), placeholder: "Nome e cognome"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8186}})
          , React.createElement(Input, { label: "Email", type: "email", value: f.email, onChange: e=>set("email",e.target.value), placeholder: "email@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8187}})
          , React.createElement(Input, { label: "Telefono", value: f.telefono, onChange: e=>set("telefono",e.target.value), placeholder: "333 0000000" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8188}})
          , React.createElement(Input, { label: `Posti (max ${postiLib})`, type: "number", value: f.posti,
            onChange: e=>set("posti",Math.min(postiLib,Math.max(1,+e.target.value))), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8189}})
          , React.createElement(Sel, { label: "Stato", value: f.stato, onChange: e=>set("stato",e.target.value), options: ["confermata","in attesa","annullata"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 8191}})
          , React.createElement(Sel, { label: "Pagamento", value: f.pagato?"pagato":"da pagare", onChange: e=>set("pagato",e.target.value==="pagato"), options: ["pagato","da pagare"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 8192}})
          , evento.biglietto && React.createElement(Input, { label: "Sconto (€)", type: "number", value: f.sconto||0,
              onChange: e=>set("sconto", Math.max(0, parseFloat(e.target.value)||0)), placeholder: "0.00" })
        )
        , evento.biglietto && (
          React.createElement('div', { style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:8,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8195}}
            , React.createElement('span', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8196}}
              , "Importo da riscuotere", (parseFloat(f.sconto)||0)>0 && React.createElement('span',{style:{display:"block",fontSize:10,color:C.textDim}}, `€${importoLordo.toFixed(2)} − €${(parseFloat(f.sconto)||0).toFixed(2)} sconto`)
            )
            , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8197}}, "€ " , importo.toFixed(2))
          )
        )
      )
      , React.createElement('div', { style: {padding:"14px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:(window.__IS_PWA__||window.matchMedia('(display-mode:standalone)').matches||window.innerWidth<=768)?"calc(env(safe-area-inset-bottom,0px) + 64px)":"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8201}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8202}}, "Annulla")
        , React.createElement(Btn, { onClick: ()=>{if(!f.nome.trim())return alert("Nome obbligatorio");onSave({...f,id:f.id||uid()});}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8203}}
          , React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8204}}), _optionalChain([initial, 'optionalAccess', _76 => _76.id])?"Salva":"Aggiungi"
        )
      )
    )
  );
};

// ─── FORM EVENTO ──────────────────────────────────────────────────────────────
const EventoForm = ({ initial, students, brani:_braniEv, onSave, onClose }) => {
  const braniEv = _braniEv || [];
  const def = initial || {id:"",tipo:"saggio",titolo:"",data:"",ora:"",luogo:"",capienza:100,
    biglietto:false,prezzoBiglietto:0,stato:"programmato",descrizione:"",note:"",programma:[],partecipanti:[],prenotazioni:[]};
  const [f,setF] = useState({...def, titolo: def.titolo||'', programma:def.programma||[], partecipanti:def.partecipanti||[]});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const tp  = tipoEv(f.tipo);
  const hasProgramma  = ["saggio","concerto","pubblico"].includes(f.tipo);
  const hasPartFacolt = ["workshop","masterclass"].includes(f.tipo);

  const addBranoProg = (bid) => {
    if(!bid) return;
    if((f.programma||[]).find(p=>p.branoId===bid)) return;
    const b = braniEv.find(x=>x.id===bid);
    if(!b) return;
    set("programma", [...(f.programma||[]), {id:"pb"+Date.now(),branoId:bid,branoTitle:b.title||"",composer:b.composer||"",allievi:[]}]);
  };
  const remBranoProg = (bid) => set("programma",(f.programma||[]).filter(p=>p.branoId!==bid));
  const toggleAllievoBrano = (bid,sid,sname) => {
    set("programma",(f.programma||[]).map(p=>{
      if(p.branoId!==bid) return p;
      const has=(p.allievi||[]).find(a=>a.studentId===sid);
      return {...p, allievi:has?p.allievi.filter(a=>a.studentId!==sid):[...(p.allievi||[]),{studentId:sid,studentName:sname}]};
    }));
  };
  const moveBrano = (idx,dir) => {
    const prog=[...(f.programma||[])]; const ni=idx+dir;
    if(ni<0||ni>=prog.length) return;
    [prog[idx],prog[ni]]=[prog[ni],prog[idx]]; set("programma",prog);
  };
  const addPart = sid => {
    if((f.partecipanti||[]).find(p=>p.studentId===sid)) return;
    const st=students.find(s=>s.id===sid); if(!st) return;
    set("partecipanti",[...(f.partecipanti||[]),{studentId:sid,studentName:st.name}]);
  };
  const remPart = sid => set("partecipanti",(f.partecipanti||[]).filter(p=>p.studentId!==sid));

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8246}}

        /* Tipo */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8249}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8250}}, "Tipo evento" )
          , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8251}}
            , TIPI_EVENTO.map(t=>(
              React.createElement('button', { key: t.id, onClick: ()=>set("tipo",t.id),
                style: {padding:"7px 14px",borderRadius:20,border:"2px solid "+(f.tipo===t.id?t.hex:C.border),
                  background:f.tipo===t.id?(t.hex+"15"):"transparent",color:f.tipo===t.id?t.hex:C.textMuted,
                  cursor:"pointer",fontSize:12,fontFamily:"'Open Sans',sans-serif",
                  display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8253}}
                , React.createElement(Ic, { n: t.icon, size: 12, stroke: f.tipo===t.id?t.hex:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8258}}), t.label
              )
            ))
          )
          , React.createElement('p', { style: {fontSize:11,color:C.textDim,marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8262}}, tp.desc)
        )

        /* Campi base */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8266}}
          , React.createElement(Input, { label: "Titolo *" , value: f.titolo, onChange: e=>set("titolo",e.target.value), placeholder: "Es. Saggio di Fine Anno"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8267}})
          , React.createElement(Sel, { label: "Stato", value: f.stato, onChange: e=>set("stato",e.target.value), options: STATI_EVENTO, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8268}})
          , React.createElement(Input, { label: "Data *" , type: "date", value: f.data, onChange: e=>set("data",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8269}})
          , React.createElement(Input, { label: "Ora", type: "time", value: f.ora, onChange: e=>set("ora",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8270}})
          , React.createElement(Input, { label: "Luogo", value: f.luogo, onChange: e=>set("luogo",e.target.value), placeholder: "Es. Aula Magna"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8271}})
          , React.createElement(Input, { label: "Capienza max" , type: "number", value: f.capienza, onChange: e=>set("capienza",+e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8272}})
        )
        , React.createElement(Textarea, { label: "Descrizione", value: f.descrizione, onChange: e=>set("descrizione",e.target.value), placeholder: "Descrizione pubblica dell'evento..."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8274}})

        /* Biglietto */
        , React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8277}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12,marginBottom:f.biglietto?12:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8278}}
            , React.createElement(Toggle, { checked: f.biglietto, onChange: v=>set("biglietto",v), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8279}})
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8280}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8281}}, "Evento a biglietto"  )
              , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8282}}, "Abilita la gestione prenotazioni e biglietteria"     )
            )
          )
          , f.biglietto && (
            React.createElement('div', { style: {paddingLeft:50}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8286}}
              , React.createElement(Input, { label: "Prezzo biglietto (euro)"  , type: "number", value: f.prezzoBiglietto, onChange: e=>set("prezzoBiglietto",+e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8287}})
            )
          )
        )

        /* ── PROGRAMMA (saggio/concerto/pubblico) ── */
        , hasProgramma && React.createElement('div', null
          , React.createElement('label', { style:{fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:10} }, "Programma — brani da eseguire")
          , React.createElement('select', { value:"", onChange:e=>addBranoProg(e.target.value),
              style:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                color:C.textMuted,fontSize:13,padding:"10px 14px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer",marginBottom:12} }
            , React.createElement('option', {value:""}, braniEv.length===0?"Nessun brano nel catalogo":"+ Seleziona brano da aggiungere...")
            , braniEv.filter(b=>!(f.programma||[]).find(p=>p.branoId===b.id)).map(b=>
                React.createElement('option', {key:b.id,value:b.id}, b.title, b.composer?` — ${b.composer}`:"")
              )
          )
          , (f.programma||[]).length===0 && React.createElement('div', {style:{textAlign:"center",padding:"16px 0",color:C.textDim,fontSize:12,border:"1px dashed "+C.border,borderRadius:8}}, "Nessun brano selezionato")
          , (f.programma||[]).map((prog,pidx)=>
            React.createElement('div', {key:prog.branoId, style:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8}}
              , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8,marginBottom:8}}
                , React.createElement('div', {style:{width:24,height:24,borderRadius:4,background:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.gold,flexShrink:0}}, pidx+1)
                , React.createElement('div', {style:{flex:1,minWidth:0}}
                  , React.createElement('div', {style:{fontSize:13,fontWeight:600}}, prog.branoTitle)
                  , prog.composer && React.createElement('div', {style:{fontSize:11,color:C.textMuted}}, prog.composer)
                )

                , React.createElement('button', {onClick:()=>remBranoProg(prog.branoId),style:{background:"none",border:"none",cursor:"pointer",color:C.textDim,padding:4,display:"flex"},onMouseEnter:e=>e.currentTarget.style.color=C.red,onMouseLeave:e=>e.currentTarget.style.color=C.textDim}
                  , React.createElement(Ic,{n:"x",size:12,stroke:"currentColor"})
                )
              )
              , React.createElement('div', {style:{paddingLeft:32}}
                , (() => {
                  const conBrano = students.filter(s=>(s.repertorio||[]).some(r=>r.id===prog.branoId||r.titolo===prog.branoTitle));
                  const lista = conBrano.length>0 ? conBrano : students;
                  return React.createElement(React.Fragment, null
                    , React.createElement('div', {style:{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}
                      , conBrano.length>0 ? "Allievi esecutori:" : "Allievi esecutori (tutti):"
                    )
                    , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:6}}
                      , lista.map(s=>
                        React.createElement('label', {key:s.id, style:{display:"flex",alignItems:"center",gap:5,cursor:"pointer",padding:"3px 8px",borderRadius:6,
                          background:(prog.allievi||[]).find(a=>a.studentId===s.id)?(tp.hex+"18"):C.surface,
                          border:`1px solid ${(prog.allievi||[]).find(a=>a.studentId===s.id)?tp.hex:C.border}`,transition:"all .12s",fontSize:11}}
                          , React.createElement('input', {type:"checkbox",checked:!!(prog.allievi||[]).find(a=>a.studentId===s.id),
                              onChange:()=>toggleAllievoBrano(prog.branoId,s.id,s.name||s.nome||""),
                              style:{accentColor:tp.hex,width:12,height:12,flexShrink:0}})
                          , s.name||s.nome||""
                        )
                      )
                    )
                  );
                })()
              )
            )
          )
        )

        /* ── PARTECIPANTI FACOLTATIVI (workshop/masterclass) ── */
        , hasPartFacolt && React.createElement('div', null
          , React.createElement('div', {style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}
            , React.createElement('label', {style:{fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}}, "Partecipanti (facoltativi)")
            , React.createElement('span', {style:{fontSize:11,color:C.textDim}}, (f.partecipanti||[]).length, "/", students.length)
          )
          , React.createElement('div', {style:{display:"flex",flexWrap:"wrap",gap:6,padding:"10px 12px",background:C.bg,borderRadius:8,border:"1px dashed "+C.border}}
            , students.map(s=>{
              const sel=!!(f.partecipanti||[]).find(p=>p.studentId===s.id);
              return React.createElement('button', {key:s.id,onClick:()=>sel?remPart(s.id):addPart(s.id),
                style:{padding:"4px 10px",borderRadius:14,border:`1px solid ${sel?tp.hex:C.border}`,
                  background:sel?(tp.hex+"18"):"transparent",color:sel?tp.hex:C.textMuted,
                  cursor:"pointer",fontSize:11,fontFamily:"'Open Sans',sans-serif",transition:"all 0.15s"}
                }, s.name||s.nome||"");
            })
          )
        )

                , React.createElement(Textarea, { label: "Note interne" , value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note riservate alla segreteria..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8458}})
      )

      , React.createElement('div', { style: {padding:"14px 24px",borderTop:"1px solid "+C.border,display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8461}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8462}}, "Annulla")
        , React.createElement(Btn, { onClick: ()=>{if(!(f.titolo||'').trim()||!f.data)return alert("Titolo e data obbligatori");onSave({...f,id:f.id||("ev"+Date.now())});}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8463}}
          , React.createElement(Ic, { n: "check", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8464}}), initial && initial.id?"Salva modifiche":"Crea evento"
        )
      )
    )
  );
};

// ─── DETTAGLIO EVENTO ─────────────────────────────────────────────────────────
const ScalettaTab = ({ evento, onUpdate, brani: braniCatalog, students: studentsTab }) => {
  // Restituisce il testo performer con corso accoppiato a ciascun nome:
  // "Mario Rossi - Pianoforte, Luigi Bianchi - Chitarra"
  const getPerformerConCorso = React.useCallback((nomePerformer) => {
    if (!nomePerformer || !studentsTab || studentsTab.length===0) return nomePerformer||'';
    const norm = (s) => (s||'').toLowerCase().trim().replace(/\s+/g,' ');
    const nomi = nomePerformer.split(',').map(n=>n.trim()).filter(Boolean);
    return nomi.map(nome => {
      const target = norm(nome);
      const stu = studentsTab.find(s => norm(s.name||s.nome) === target);
      const corso = stu ? (stu.instrument||stu.corso||'') : '';
      return corso ? (nome+' - '+corso) : nome;
    }).join(', ');
  }, [studentsTab]);
  const cat = braniCatalog || [];

  // Costruisce lista brani dalla struttura programma (eventi creati dal form)
  const fromProgramma = React.useMemo(() => {
    const prog = evento.programma || [];
    return prog.map(p => ({
      brano: p.branoTitle || p.title || '',
      performer: (p.allievi||[]).map(a => a.studentName).join(', ')
    })).filter(x => x.brano);
  }, [evento.programma]);

  // Oppure dalla struttura partecipanti.brani (formato INIT_CONCERTI)
  const fromPartecipanti = React.useMemo(() => {
    return (evento.partecipanti||[]).flatMap(p =>
      (p.brani||[]).map(b => ({ brano: b, performer: p.studentName }))
    );
  }, [evento.partecipanti]);

  // Fallback chain: scaletta salvata → programma → partecipanti
  const autoItems = fromProgramma.length > 0 ? fromProgramma : fromPartecipanti;

  const [items, setItems] = React.useState(() => {
    if (evento.scaletta && evento.scaletta.length > 0) return evento.scaletta;
    return autoItems;
  });

  const [showAdd, setShowAdd] = React.useState(false);
  const [addText, setAddText] = React.useState('');
  const [addPerf, setAddPerf] = React.useState('');
  const [addNote, setAddNote] = React.useState('');
  const [editingNoteIdx, setEditingNoteIdx] = React.useState(null);
  const [noteTemp, setNoteTemp] = React.useState('');

  // Ricarica se cambia evento
  React.useEffect(() => {
    if (evento.scaletta && evento.scaletta.length > 0) {
      setItems(evento.scaletta);
    } else {
      setItems(autoItems);
    }
  }, [evento.id]);

  const save = (newItems) => {
    setItems(newItems);
    if (onUpdate) onUpdate({...evento, scaletta: newItems});
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const s = [...items];
    const tmp = s[idx-1]; s[idx-1] = s[idx]; s[idx] = tmp;
    save(s);
  };

  const moveDown = (idx) => {
    if (idx === items.length-1) return;
    const s = [...items];
    const tmp = s[idx]; s[idx] = s[idx+1]; s[idx+1] = tmp;
    save(s);
  };

  const removeItem = (idx) => save(items.filter((_,i) => i !== idx));

  const addItem = () => {
    if (!addText.trim()) return;
    const newItems = [...items, { brano: addText.trim(), performer: addPerf.trim(), note: addNote.trim() }];
    save(newItems);
    setAddText(''); setAddPerf(''); setAddNote(''); setShowAdd(false);
  };

  // Aggiorna la nota di un singolo brano in scaletta
  const updateNote = (idx, nuovaNota) => {
    const newItems = items.map((it,i) => i===idx ? {...it, note: nuovaNota} : it);
    save(newItems);
  };

  // Importa da programma SENZA azzerare la scaletta esistente: aggiunge solo
  // i brani non già presenti (confronto per nome brano, case-insensitive)
  const importaDaProgramma = () => {
    if (autoItems.length === 0) {
      alert('Nessun brano trovato nel Programma o nei Partecipanti.\nAssegna prima gli allievi ai brani nella tab "Programma" dell\'evento.');
      return;
    }
    const nomiGiaPresenti = new Set(items.map(i => (i.brano||'').toLowerCase().trim()));
    const nuoviDaAggiungere = autoItems.filter(a => !nomiGiaPresenti.has((a.brano||'').toLowerCase().trim()));
    if (nuoviDaAggiungere.length === 0) {
      alert('Tutti i brani del programma sono già presenti in scaletta.');
      return;
    }
    save([...items, ...nuoviDaAggiungere]);
  };

  const handlePrint = () => {
    const w = window.open('','_blank','width=794,height=1123');
    if (!w) { alert('Abilita i popup per stampare'); return; }
    const rows = items.map((s,i) => {
      const perfTesto = getPerformerConCorso(s.performer);
      const perf = s.performer ? '<div style="font-size:11px;color:#888;margin-top:3px">'+perfTesto+'</div>' : '';
      const nota = s.note ? '<div style="font-size:10.5px;color:#b8860b;margin-top:4px;font-style:italic">📝 '+s.note+'</div>' : '';
      return '<tr><td style="width:44px;text-align:center;font-weight:700;color:#1a4fa0;font-size:16px;padding:16px 8px">'+(i+1)+'</td>'
        +'<td style="padding:14px 16px"><div style="font-size:15px;font-weight:600">'+s.brano+'</div>'+perf+nota+'</td></tr>';
    }).join('');
    const dataStr = evento.data ? new Date(evento.data+'T00:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '';
    w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Programma – '+evento.titolo+'</title>'
      +'<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">'
      +'<style>@page{margin:20mm 22mm;size:A4}*{margin:0;padding:0;box-sizing:border-box}'
      +'body{font-family:\'DM Sans\',sans-serif;color:#1a1a2e;background:#fff;padding:40px}'
      +'.hdr{border-bottom:2px solid #1a4fa0;padding-bottom:16px;margin-bottom:32px}'
      +'.ttl{font-family:\'Cormorant Garamond\',serif;font-size:30px;font-weight:700}'
      +'.sub{font-size:12px;color:#888;margin-top:6px}'
      +'table{width:100%;border-collapse:collapse}'
      +'tr{border-bottom:1px solid #eee}tr:last-child{border:none}</style>'
      +'</head><body>'
      +'<div class="hdr"><div class="ttl">'+evento.titolo+'</div>'
      +'<div class="sub">'+dataStr+' '+(evento.ora||'')+' · '+(evento.luogo||'')+'</div></div>'
      +'<table>'+rows+'</table>'
      +'<script>window.onload=function(){window.print()}<\/script>'
      +'</body></html>');
    w.document.close();
  };

  const btnStyle = (extra) => Object.assign({
    display:'flex',alignItems:'center',justifyContent:'center',
    borderRadius:6,border:'1px solid '+C.border,
    background:C.bg,cursor:'pointer',fontSize:13
  }, extra||{});

  return React.createElement('div', {style:{maxWidth:700}},

    /* ── toolbar ── */
    React.createElement('div', {style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:8}},
      React.createElement('div', {style:{fontSize:13,color:C.textMuted}},
        items.length > 0 ? items.length+' brani in scaletta' : 'Scaletta vuota'
      ),
      React.createElement('div', {style:{display:'flex',gap:8,flexWrap:'wrap'}},
        React.createElement('button', {onClick:importaDaProgramma,
          style:{fontSize:12,padding:'6px 12px',borderRadius:7,border:'1px solid '+C.border,
            background:C.bg,color:C.textMuted,cursor:'pointer'}},
          autoItems.length > 0 ? '➕ Aggiungi da programma ('+autoItems.length+')' : '➕ Aggiungi da programma'
        ),
        React.createElement('button', {onClick:()=>setShowAdd(v=>!v),
          style:{fontSize:12,padding:'6px 12px',borderRadius:7,
            border:'1px solid '+C.goldDim,background:C.goldBg,color:C.gold,cursor:'pointer'}},
          showAdd ? '✕ Annulla' : '+ Aggiungi brano'
        ),
        items.length > 0 && React.createElement('button', {onClick:handlePrint,
          style:{display:'flex',alignItems:'center',gap:5,fontSize:12,padding:'6px 12px',
            borderRadius:7,border:'1px solid '+C.border,background:C.bg,color:C.text,cursor:'pointer'}},
          React.createElement(Ic,{n:'receipt',size:12,stroke:C.text}), ' Stampa'
        )
      )
    ),

    /* ── form aggiungi brano ── */
    showAdd && React.createElement('div', {style:{background:C.surface,border:'1px solid '+C.goldDim,borderRadius:10,padding:16,marginBottom:14,display:'flex',flexDirection:'column',gap:10}},
      React.createElement('div', {style:{fontSize:11,color:C.gold,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:2}}, 'Aggiungi brano alla scaletta'),
      React.createElement('div', {style:{display:'flex',gap:8,flexWrap:'wrap'}},
        React.createElement('div', {style:{flex:'2 1 200px'}},
          React.createElement('label', {style:{fontSize:10,color:C.textMuted,display:'block',marginBottom:4}}, 'TITOLO BRANO *'),
          React.createElement('input', {
            value: addText,
            onChange: e=>setAddText(e.target.value),
            onKeyDown: e=>{if(e.key==='Enter')addItem();},
            placeholder: 'Es. Notturno Op.9 – Chopin',
            list: 'scaletta-brani-list',
            style:{width:'100%',background:C.bg,border:'1px solid '+C.border,borderRadius:7,
              color:C.text,fontSize:13,padding:'8px 12px',fontFamily:"'Open Sans',sans-serif"}
          }),
          React.createElement('datalist', {id:'scaletta-brani-list'},
            cat.map(b => React.createElement('option', {key:b.id, value:(b.title||'')+(b.composer?' – '+b.composer:'')}))
          )
        ),
        React.createElement('div', {style:{flex:'1 1 140px'}},
          React.createElement('label', {style:{fontSize:10,color:C.textMuted,display:'block',marginBottom:4}}, 'ESECUTORE'),
          React.createElement('input', {
            value: addPerf,
            onChange: e=>setAddPerf(e.target.value),
            onKeyDown: e=>{if(e.key==='Enter')addItem();},
            placeholder: 'Nome allievo',
            style:{width:'100%',background:C.bg,border:'1px solid '+C.border,borderRadius:7,
              color:C.text,fontSize:13,padding:'8px 12px',fontFamily:"'Open Sans',sans-serif"}
          })
        )
      ),
      React.createElement('div', null,
        React.createElement('label', {style:{fontSize:10,color:C.textMuted,display:'block',marginBottom:4}}, 'NOTE (facoltative)'),
        React.createElement('input', {
          value: addNote,
          onChange: e=>setAddNote(e.target.value),
          onKeyDown: e=>{if(e.key==='Enter')addItem();},
          placeholder: 'Es. Cambio microfono, durata 4min...',
          style:{width:'100%',background:C.bg,border:'1px solid '+C.border,borderRadius:7,
            color:C.text,fontSize:13,padding:'8px 12px',fontFamily:"'Open Sans',sans-serif"}
        })
      ),
      React.createElement('button', {onClick:addItem,
        style:{alignSelf:'flex-start',padding:'7px 18px',borderRadius:7,border:'none',
          background:C.gold,color:"#ffffff",cursor:'pointer',fontSize:13,fontWeight:600,
          fontFamily:"'Open Sans',sans-serif"}},
        'Aggiungi'
      )
    ),

    /* ── lista vuota ── */
    items.length === 0 && React.createElement('div', {style:{textAlign:'center',padding:'48px 0',
      color:C.textDim,border:'1px dashed '+C.border,borderRadius:12}},
      React.createElement(Ic,{n:'music',size:32,stroke:C.textDim}),
      React.createElement('p', {style:{marginTop:12,fontSize:14,fontWeight:500}}, 'Nessun brano in scaletta'),
      React.createElement('p', {style:{fontSize:12,marginTop:6,color:C.textDim}},
        autoItems.length > 0
          ? 'Clicca "Importa da programma" per caricare i brani del programma'
          : 'Usa "+ Aggiungi brano" per inserire i brani manualmente'
      )
    ),

    /* ── lista brani ── */
    items.length > 0 && React.createElement('div', {style:{display:'flex',flexDirection:'column',gap:6}},
      items.map(function(item, idx) {
        return React.createElement('div', {key:String(idx)+item.brano,
          style:{display:'flex',alignItems:'center',gap:10,background:C.surface,
            border:'1px solid '+C.border,borderRadius:10,padding:'11px 13px',
            transition:'background .1s'}},

          /* numero */
          React.createElement('div', {style:{width:28,height:28,borderRadius:7,background:C.goldBg,
            border:'1px solid '+C.goldDim,display:'flex',alignItems:'center',
            justifyContent:'center',fontSize:12,fontWeight:700,color:C.gold,flexShrink:0}}, idx+1),

          /* testo */
          React.createElement('div', {style:{flex:1,minWidth:0}},
            React.createElement('div', {style:{fontSize:13,fontWeight:600,
              overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}, item.brano),
            item.performer && React.createElement('div', {style:{fontSize:11,color:C.textMuted,marginTop:1}},
              getPerformerConCorso(item.performer)
            ),
            /* Nota: editabile inline al click, altrimenti mostrata come testo */
            editingNoteIdx === idx
              ? React.createElement('input', {
                  autoFocus: true,
                  value: noteTemp,
                  onChange: e=>setNoteTemp(e.target.value),
                  onBlur: () => { updateNote(idx, noteTemp); setEditingNoteIdx(null); },
                  onKeyDown: e=>{ if(e.key==='Enter'){ updateNote(idx, noteTemp); setEditingNoteIdx(null); } if(e.key==='Escape'){ setEditingNoteIdx(null); } },
                  placeholder: 'Note (facoltative)...',
                  style:{width:'100%',marginTop:4,fontSize:11,padding:'4px 7px',borderRadius:5,
                    border:'1px solid '+C.goldDim,background:C.bg,color:C.text,fontFamily:"'Open Sans',sans-serif"}
                })
              : React.createElement('div', {
                  onClick: ()=>{ setEditingNoteIdx(idx); setNoteTemp(item.note||''); },
                  style:{fontSize:11,color:item.note?C.gold:C.textDim,marginTop:3,cursor:'pointer',
                    fontStyle:item.note?'normal':'italic'}
                }, item.note || '📝 Aggiungi nota...')
          ),

          /* bottoni */
          React.createElement('div', {style:{display:'flex',gap:3,flexShrink:0}},
            React.createElement('button', {
              onClick: function(e){ e.preventDefault(); moveUp(idx); },
              disabled: idx===0, title:'Sposta su',
              style:btnStyle({width:28,height:28,color:idx===0?C.textDim:C.gold,
                borderColor:idx===0?C.border:C.goldDim,fontSize:12,
                cursor:idx===0?'not-allowed':'pointer'})},
              '▲'
            ),
            React.createElement('button', {
              onClick: function(e){ e.preventDefault(); moveDown(idx); },
              disabled: idx===items.length-1, title:'Sposta giù',
              style:btnStyle({width:28,height:28,color:idx===items.length-1?C.textDim:C.gold,
                borderColor:idx===items.length-1?C.border:C.goldDim,fontSize:12,
                cursor:idx===items.length-1?'not-allowed':'pointer'})},
              '▼'
            ),
            React.createElement('button', {
              onClick: function(e){ e.preventDefault(); removeItem(idx); },
              title:'Rimuovi',
              style:btnStyle({width:28,height:28,color:C.red||'#f87171',
                borderColor:C.redBorder||C.border,cursor:'pointer',fontSize:12})},
              '✕'
            )
          )
        );
      })
    )
  );
};


// ─── Deriva la lista unificata di partecipanti da TUTTE le fonti ────────────
// Fonti: programma (allievi strutturati per brano), scaletta (performer testo
// libero, può contenere più nomi separati da virgola), partecipanti (picker)
// Tenta di collegare i nomi liberi (scaletta) a uno studentId reale per nome.
const derivePartecipanti = (evento, studentsList) => {
  const stuList = studentsList || [];
  const map = {};
  const keyFor = (id, name) => id ? ('id:'+id) : ('name:'+(name||'').toLowerCase().trim());

  // 1. Da programma (struttura ricca, già con studentId)
  (evento.programma||[]).forEach(p => {
    (p.allievi||[]).forEach(a => {
      const k = keyFor(a.studentId, a.studentName);
      if (!map[k]) map[k] = {studentId:a.studentId||null, studentName:a.studentName||'', brani:new Set()};
      if (p.branoTitle) map[k].brani.add(p.branoTitle);
    });
  });

  // 2. Da scaletta (performer testo libero — split su virgola, match per nome)
  (evento.scaletta||[]).forEach(s => {
    const nomi = (s.performer||'').split(',').map(n=>n.trim()).filter(Boolean);
    nomi.forEach(nome => {
      const stu = stuList.find(st => (st.name||st.nome||'').toLowerCase() === nome.toLowerCase());
      const k = keyFor(stu?stu.id:null, nome);
      if (!map[k]) map[k] = {studentId: stu?stu.id:null, studentName:nome, brani:new Set()};
      if (s.brano) map[k].brani.add(s.brano);
    });
  });

  // 3. Da partecipanti espliciti (picker "Partecipanti facoltativi")
  (evento.partecipanti||[]).forEach(p => {
    const k = keyFor(p.studentId, p.studentName);
    if (!map[k]) map[k] = {studentId:p.studentId||null, studentName:p.studentName||'', brani: new Set(p.brani||[])};
  });

  return Object.values(map).map(p => ({...p, brani: Array.from(p.brani)}));
};

const EventoDetail = ({ evento, students, docenti:docentiED, brani:_braniED, onEdit, onDelete, onBack, onUpdate }) => {
  const braniCatalog = _braniED || [];
  const [tab,    setTab]    = useState("info");
  const [modalP, setModalP] = useState(null); // null | "add" | prenotazione-obj

  const tp  = tipoEv(evento.tipo);
  const sc  = statoEvColor(evento.stato);
  const prenConf     = evento.prenotazioni.filter(p=>p.stato==="confermata");
  const postiOcc     = prenConf.reduce((t,p)=>t+p.posti,0);
  const incassoRisc  = prenConf.filter(p=>p.pagato).reduce((t,p)=>t+Math.max(0,p.posti*(evento.prezzoBiglietto||0)-(parseFloat(p.sconto)||0)),0);
  const incassoAtteso= prenConf.reduce((t,p)=>t+Math.max(0,p.posti*(evento.prezzoBiglietto||0)-(parseFloat(p.sconto)||0)),0);

  const savePren = pren => {
    const newP = evento.prenotazioni.find(p=>p.id===pren.id)
      ? evento.prenotazioni.map(p=>p.id===pren.id?pren:p)
      : [...evento.prenotazioni,pren];
    onUpdate({...evento,prenotazioni:newP});
    setModalP(null);
  };
  const delPren = id => onUpdate({...evento,prenotazioni:evento.prenotazioni.filter(p=>p.id!==id)});
  const togglePagato = id => onUpdate({...evento,prenotazioni:evento.prenotazioni.map(p=>p.id===id?{...p,pagato:!p.pagato}:p)});

  const TABS = [
    {id:"info",    label:"Informazioni", icon:"flag"},
    {id:"partec",  label:"Partecipanti", icon:"users"},
    ...(evento.biglietto?[{id:"biglietti",label:"Biglietteria",icon:"receipt"}]:[]),
    {id:"brani",   label:"Scaletta",     icon:"music"},
    {id:"report",  label:"Report",       icon:"chart"},
  ];

  const formatData = d => d ? new Date(d+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}) : "—";
  const formatDataS = d => d ? new Date(d+"T00:00:00").toLocaleDateString("it-IT") : "—";

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8503}}

      /* ── HEADER ── */
      , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"16px 24px 0",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8506}}
        , React.createElement('div', { style: {display:"flex",alignItems:"flex-start",gap:12,marginBottom:12,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8507}}
          , React.createElement('button', { onClick: onBack, style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,
            padding:"6px 10px",cursor:"pointer",display:"flex",color:C.textMuted,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8508}}
            , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8510}})
          )
          , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8512}}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8513}}
              , React.createElement('span', { style: {padding:"3px 10px",borderRadius:12,background:`${tp.hex}15`,color:tp.hex,
                fontSize:10,fontWeight:700,border:`1px solid ${tp.hex}30`,display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8514}}
                , React.createElement(Ic, { n: tp.icon, size: 9, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8516}}), tp.label
              )
              , React.createElement('span', { style: {padding:"3px 10px",borderRadius:12,background:sc.bg,color:sc.fg,
                fontSize:10,fontWeight:700,border:`1px solid ${sc.bd}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8518}}, evento.stato)
              , evento.biglietto && (
                React.createElement('span', { style: {padding:"3px 10px",borderRadius:12,background:C.goldBg,color:C.gold,
                  fontSize:10,fontWeight:700,border:`1px solid ${C.goldDim}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8521}}, "€ " , evento.prezzoBiglietto, " / biglietto"  )
              )
            )
            , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(18px,3vw,26px)",fontWeight:600,lineHeight:1.2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8525}}
              , evento.titolo
            )
            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:4,display:"flex",gap:12,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8528}}
              , evento.data  && React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8529}}, React.createElement(Ic, { n: "calendar", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8529}}), formatData(evento.data), evento.ora&&` · ${evento.ora}`)
              , evento.luogo && React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8530}}, React.createElement(Ic, { n: "map", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8530}}), evento.luogo)
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8533}}
            , React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8534}}, React.createElement(Ic, { n: "edit", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8534}}), "Modifica")
            , React.createElement('button', { onClick: onDelete, style: {background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:8,
              padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8535}}
              , React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8537}})
            )
          )
        )
        /* Tab bar */
        , React.createElement('div', { style: {display:"flex",gap:0,overflowX:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8542}}
          , TABS.map(t=>(
            React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id),
              style: {padding:"10px 16px",border:"none",background:"none",whiteSpace:"nowrap",
                borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
                color:tab===t.id?C.gold:C.textMuted,cursor:"pointer",
                fontSize:13,fontFamily:"'Open Sans',sans-serif",
                display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8544}}
              , React.createElement(Ic, { n: t.icon, size: 12, stroke: tab===t.id?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8550}}), t.label
            )
          ))
        )
      )

      /* ── CONTENT ── */
      , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"24px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8557}}

        /* INFO */
        , tab==="info" && (
          React.createElement('div', { style: {maxWidth:760,display:"flex",flexDirection:"column",gap:18}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8561}}
            /* KPI row */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8563}}
              , [
                {l:"Partecipanti",val:evento.partecipanti.length, hex:C.gold},
                {l:"Capienza",    val:evento.capienza,            hex:C.blue},
                {l:"Prenotazioni",val:prenConf.length,            hex:C.teal},
                {l:"Posti liberi",val:Math.max(0,evento.capienza-postiOcc),hex:postiOcc>=evento.capienza?C.red:C.green},
              ].map(k=>(
                React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8570}}
                  , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8571}}, k.l)
                  , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:600,color:k.hex,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8572}}, k.val)
                )
              ))
            )

            /* Biglietteria summary */
            , evento.biglietto && (
              React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8579}}
                , [
                  {l:"Prezzo",           val:`€ ${evento.prezzoBiglietto}`,  hex:C.gold},
                  {l:"Incasso previsto", val:fmt(incassoAtteso),             hex:C.blue},
                  {l:"Riscosso",         val:fmt(incassoRisc),               hex:C.green},
                  {l:"Da riscuotere",    val:fmt(incassoAtteso-incassoRisc), hex:C.red},
                ].map(k=>(
                  React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8586}}
                    , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8587}}, k.l)
                    , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:k.hex,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8588}}, k.val)
                  )
                ))
              )
            )

            /* Occupazione */
            , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8595}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8596}}
                , React.createElement('span', { style: {fontSize:12,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8597}}, "Occupazione posti" )
                , React.createElement('span', { style: {fontSize:13,fontWeight:600,color:postiOcc>=evento.capienza?C.red:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8598}}
                  , postiOcc, " / "  , evento.capienza, " (" , Math.round(postiOcc/evento.capienza*100)||0, "%)"
                )
              )
              , React.createElement('div', { style: {height:8,background:C.border,borderRadius:4,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8602}}
                , React.createElement('div', { style: {height:"100%",borderRadius:4,transition:"width 0.5s",
                  background:postiOcc>=evento.capienza?C.red:postiOcc/evento.capienza>0.8?C.gold:C.green,
                  width:`${Math.min(100,(postiOcc/Math.max(1,evento.capienza)*100))}%`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8603}})
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8607}}
                , Math.max(0,evento.capienza-postiOcc), " posti ancora disponibili"
              )
            )

            , evento.descrizione && (
              React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8613}}
                , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8614}}, "Descrizione")
                , React.createElement('p', { style: {fontSize:13,color:C.text,lineHeight:1.65}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8615}}, evento.descrizione)
              )
            )
            , evento.note && (
              React.createElement('div', { style: {background:`${C.gold}08`,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8619}}
                , React.createElement('div', { style: {fontSize:10,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8620}}, "Note")
                , React.createElement('p', { style: {fontSize:13,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8621}}, evento.note)
              )
            )
          )
        )

        /* PARTECIPANTI */
        , tab==="partec" && (() => {
          const lista = derivePartecipanti(evento, students);
          const hasProg3 = lista.some(p=>(p.brani||[]).length>0);
          return React.createElement('div', {style:{maxWidth:680}}
            , lista.length===0
              ? React.createElement('div', {style:{textAlign:"center",padding:"56px 0",color:C.textDim}}
                  , React.createElement(Ic,{n:"users",size:36,stroke:C.textDim})
                  , React.createElement('p',{style:{marginTop:12,fontSize:13}}, "Nessun partecipante")
                  , React.createElement('p',{style:{fontSize:11,marginTop:4}}, "Modifica l'evento per aggiungere allievi")
                )
              : React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:8}}
                  , lista.map((p,i)=>
                    React.createElement('div', {key:p.studentId, style:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}
                      , React.createElement('div', {style:{padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}
                        , React.createElement('div', {style:{width:36,height:36,borderRadius:"50%",background:`${C.gold}20`,
                            border:`1px solid ${C.goldDim}`,display:"flex",alignItems:"center",
                            justifyContent:"center",fontSize:12,fontWeight:600,color:C.gold,flexShrink:0}}
                          , initials(p.studentName)
                        )
                        , React.createElement('div', {style:{flex:1}}
                          , React.createElement('div', {style:{fontSize:14,fontWeight:500}}, p.studentName)
                          , hasProg3 && (p.brani||[]).length>0 && React.createElement('div', {style:{fontSize:11,color:C.textDim,marginTop:2}}, (p.brani||[]).join(" · "))
                        )
                      )
                      , hasProg3 && (p.brani||[]).length>0 && React.createElement('div', {style:{padding:"6px 16px 10px 64px",borderTop:`1px solid ${C.border}20`}}
                        , (p.brani||[]).map((b,j)=>React.createElement('div', {key:j, style:{display:"flex",alignItems:"center",gap:7,marginBottom:3}}
                            , React.createElement(Ic,{n:"music",size:10,stroke:C.gold})
                            , React.createElement('span',{style:{fontSize:12}}, b)
                          ))
                      )
                    )
                  )
                )
          );
        })()
, tab==="biglietti" && (
          React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8674}}
            /* Stats */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8676}}
              , [
                {l:"Prenotazioni", val:prenConf.length,                    hex:C.blue},
                {l:"Posti venduti",val:postiOcc,                           hex:C.teal},
                {l:"Riscosso",     val:fmt(incassoRisc),                   hex:C.green},
                {l:"Da riscuotere",val:fmt(incassoAtteso-incassoRisc),    hex:incassoAtteso-incassoRisc>0?C.red:C.textDim},
              ].map(k=>(
                React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8683}}
                  , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8684}}, k.l)
                  , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,color:k.hex,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8685}}, k.val)
                )
              ))
            )

            /* Tabella prenotazioni */
            , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8691}}
              , React.createElement('div', { style: {padding:"13px 18px",borderBottom:`1px solid ${C.border}`,
                display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8692}}
                , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8694}}
                  , React.createElement(Ic, { n: "receipt", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8695}})
                  , React.createElement('span', { style: {fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8696}}, "Prenotazioni ("
                     , evento.prenotazioni.length, ")"
                  )
                )
                , React.createElement('div', {style:{display:"flex",gap:8}}
                  , evento.prenotazioni.length > 0 && React.createElement('button', {
                      onClick: () => {
                        const w = window.open('','_blank','width=900,height=700');
                        if(!w){alert('Abilita i popup per stampare');return;}
                        const dataEvento = evento.data ? new Date(evento.data+'T00:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '';
                        const CAT_LABEL = {allievo:'🎓 Allievo', docente:'👤 Docente', pubblico:'🎫 Pubblico'};
                        const righe = evento.prenotazioni.map((p,i) => {
                          const lordo = p.posti*(evento.prezzoBiglietto||0);
                          const sconto = parseFloat(p.sconto)||0;
                          const imp = Math.max(0, lordo - sconto);
                          const statoColor = p.stato==='confermata'?'#15803d':p.stato==='annullata'?'#8c1818':'#b45309';
                          // Il check riflette il PAGAMENTO effettivo, non lo stato prenotazione
                          const check = p.pagato?'☑':'☐';
                          const scontoTxt = sconto>0 ? `<br><small style="color:#b45309">−€${sconto.toFixed(2)} sconto</small>` : '';
                          return `<tr style="border-bottom:1px solid #eee">
                            <td style="padding:10px 12px;text-align:center;font-size:16px;color:#1a4fa0;font-weight:700">${check}</td>
                            <td style="padding:10px 12px;font-weight:600">${p.nome||'—'}</td>
                            <td style="padding:10px 12px;font-size:11px;color:#666">${CAT_LABEL[p.categoria]||CAT_LABEL.pubblico}</td>
                            <td style="padding:10px 12px;font-size:12px;color:#666">${p.email||''}<br>${p.telefono||''}</td>
                            <td style="padding:10px 12px;text-align:center;font-weight:600">${p.posti||0}</td>
                            <td style="padding:10px 12px;font-weight:600;color:${p.pagato?'#15803d':'#8c1818'}">${p.pagato?'✓ Pagato':'Da pagare'}<br><small style="font-weight:400">€${imp.toFixed(2)}</small>${scontoTxt}</td>
                            <td style="padding:10px 12px"><span style="padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;background:${statoColor}20;color:${statoColor}">${p.stato||'—'}</span></td>
                            <td style="padding:10px 12px;text-align:center;width:80px"><div style="width:70px;height:24px;border:1px solid #999;border-radius:4px;"></div></td>
                          </tr>`;
                        }).join('');
                        const totPosti = evento.prenotazioni.reduce((t,p)=>t+p.posti,0);
                        const totIncassoSistema = evento.prenotazioni.filter(p=>p.pagato).reduce((t,p)=>t+Math.max(0,p.posti*(evento.prezzoBiglietto||0)-(parseFloat(p.sconto)||0)),0);
                        const totTeorico = totPosti*(evento.prezzoBiglietto||0);
                        w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
                          <title>Biglietteria – ${evento.titolo}</title>
                          <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
                          <style>
                            @page{margin:15mm 18mm;size:A4 landscape}
                            *{margin:0;padding:0;box-sizing:border-box}
                            body{font-family:'Open Sans',sans-serif;color:#1a1a2e;background:#fff;padding:24px}
                            .hdr{border-bottom:3px solid #1a4fa0;padding-bottom:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-end}
                            .ttl{font-family:'Oswald',sans-serif;font-size:26px;font-weight:700;color:#1a4fa0}
                            .sub{font-size:12px;color:#666;margin-top:4px}
                            table{width:100%;border-collapse:collapse;font-size:13px}
                            thead tr{background:#1a4fa0;color:#fff}
                            thead th{padding:10px 12px;text-align:left;font-size:11px;letter-spacing:0.06em;text-transform:uppercase}
                            tbody tr:nth-child(even){background:#f8f9fb}
                            .footer{margin-top:20px;display:flex;justify-content:space-between;font-size:11px;color:#888;border-top:1px solid #eee;padding-top:10px}
                            .saldo{margin-top:24px;border:2px solid #1a4fa0;border-radius:8px;overflow:hidden;page-break-inside:avoid}
                            .saldo-hdr{background:#1a4fa0;color:#fff;padding:8px 16px;font-family:'Oswald',sans-serif;font-size:14px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase}
                            .saldo-body{padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
                            .saldo-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee}
                            .saldo-label{font-size:12px;color:#555}
                            .saldo-val{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600}
                            .saldo-blank{display:inline-block;min-width:110px;border-bottom:2px solid #333;height:20px;}
                            .saldo-ref{font-size:10px;color:#999;margin-top:14px;text-align:center;font-style:italic}
                            @media print{button{display:none}}
                          </style>
                        </head><body>
                          <div class="hdr">
                            <div>
                              <div class="ttl">${evento.titolo}</div>
                              <div class="sub">${dataEvento}${evento.ora?' · '+evento.ora:''}${evento.luogo?' · '+evento.luogo:''}</div>
                            </div>
                            <div style="text-align:right;font-size:12px;color:#666">
                              <div><strong>${evento.prenotazioni.length}</strong> prenotazioni · <strong>${totPosti}</strong> posti</div>
                              <div>Incassato (sistema): <strong style="color:#15803d">€${totIncassoSistema.toFixed(2)}</strong></div>
                            </div>
                          </div>
                          <table>
                            <thead><tr>
                              <th style="width:36px">✓</th>
                              <th>Nome</th>
                              <th style="width:90px">Categoria</th>
                              <th>Contatto</th>
                              <th style="width:55px;text-align:center">Posti</th>
                              <th style="width:130px">Pagamento</th>
                              <th style="width:100px">Stato</th>
                              <th style="width:90px;text-align:center">Timbro</th>
                            </tr></thead>
                            <tbody>${righe}</tbody>
                          </table>

                          <div class="saldo">
                            <div class="saldo-hdr">💰 Riepilogo cassa — da completare alla biglietteria</div>
                            <div class="saldo-body">
                              <div class="saldo-row">
                                <span class="saldo-label">Biglietti già pagati (calcolo da sistema)</span>
                                <span class="saldo-val" style="color:#15803d">€${totIncassoSistema.toFixed(2)}</span>
                              </div>
                              <div class="saldo-row">
                                <span class="saldo-label">Biglietti pagati in loco (manuale)</span>
                                <span class="saldo-blank"></span>
                              </div>
                              <div class="saldo-row">
                                <span class="saldo-label"><strong>SALDO TOTALE</strong></span>
                                <span class="saldo-blank"></span>
                              </div>
                              <div class="saldo-row" style="border-bottom:none">
                                <span class="saldo-label">Firma responsabile cassa</span>
                                <span class="saldo-blank" style="min-width:160px"></span>
                              </div>
                            </div>
                            <div class="saldo-ref" style="padding-bottom:12px">
                              Il Saldo Totale deve coincidere con: ${totPosti} biglietti venduti × €${(evento.prezzoBiglietto||0).toFixed(2)} = <strong>€${totTeorico.toFixed(2)}</strong> (al netto di eventuali sconti applicati)
                            </div>
                          </div>

                          <div class="footer">
                            <span>Controllo accessi — ${evento.titolo}</span>
                            <span>Data stampa: ${new Date().toLocaleDateString('it-IT')}</span>
                          </div>
                          <script>window.onload=function(){window.print()}<\/script>
                        </body></html>`);
                        w.document.close();
                      },
                      style:{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:8,
                        border:`1px solid ${C.border}`,background:C.bg,cursor:'pointer',fontSize:12,
                        fontFamily:"'Open Sans',sans-serif",color:C.text},
                      onMouseEnter:e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.gold;},
                      onMouseLeave:e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text;}}
                    , React.createElement(Ic, {n:"report", size:13, stroke:"currentColor"})
                    , " Esporta biglietteria"
                  )
                  , React.createElement(Btn, { small: true, onClick: ()=>setModalP("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8700}}, React.createElement(Ic, { n: "plus", size: 12, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8700}}), "Nuova")
                )
              )
              , evento.prenotazioni.length===0 ? (
                React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8703}}, "Nessuna prenotazione ancora"

                )
              ) : (
                React.createElement('div', { style: {overflowX:"auto",WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8707}}
                  /* Header */
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1.6fr 1fr 55px 90px 85px 70px",minWidth:520,
                    padding:"8px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8709}}
                    , ["Nome","Contatto","Posti","Importo","Stato",""].map(h=>(
                      React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8712}}, h)
                    ))
                  )
                  , evento.prenotazioni.map((pren,i)=>{
                    const imp = Math.max(0, pren.posti*(evento.prezzoBiglietto||0) - (parseFloat(pren.sconto)||0));
                    const pc  = {confermata:{fg:C.green,bg:C.greenBg},annullata:{fg:C.red,bg:C.redBg},"in attesa":{fg:C.gold,bg:C.goldBg}}[pren.stato]||{fg:C.textMuted,bg:C.surface};
                    return (
                      React.createElement('div', { key: pren.id, style: {display:"grid",gridTemplateColumns:"1.6fr 1fr 55px 90px 85px 70px",minWidth:520,
                        padding:"11px 16px",borderBottom:i<evento.prenotazioni.length-1?`1px solid ${C.border}20`:"none",alignItems:"center"},
                        onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                        onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8719}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8723}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8724}}
                            , pren.nome
                            , pren.categoria==="allievo" && React.createElement('span',{style:{fontSize:9,padding:"1px 6px",borderRadius:8,background:C.tealBg,color:C.teal}},"🎓")
                            , pren.categoria==="docente" && React.createElement('span',{style:{fontSize:9,padding:"1px 6px",borderRadius:8,background:C.goldBg,color:C.gold}},"👤")
                          )
                          , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8725}}, formatDataS(pren.dataPren))
                        )
                        , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8727}}
                          , React.createElement('div', { style: {overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8728}}, pren.email)
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8729}}, pren.telefono)
                        )
                        , React.createElement('div', { style: {fontSize:13,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8731}}, pren.posti)
                        , React.createElement('div', {
                            onClick: ()=>togglePagato(pren.id),
                            title: "Clicca per cambiare stato pagamento",
                            style:{cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8732}}
                          , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,
                            color:pren.pagato?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8733}}, fmt(imp))
                          , React.createElement('div', { style: {fontSize:10,color:pren.pagato?C.green:C.red,display:"flex",alignItems:"center",gap:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8735}}
                            , React.createElement('span',{style:{fontSize:12}}, pren.pagato?"☑":"☐")
                            , pren.pagato?"pagato":"da pagare"
                          )
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8739}}
                          , React.createElement('span', { style: {padding:"3px 8px",borderRadius:8,fontSize:10,fontWeight:600,
                            background:pc.bg,color:pc.fg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8740}}, pren.stato)
                        )
                        , React.createElement('div', { style: {display:"flex",gap:4,justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8743}}
                          , React.createElement('button', { onClick: ()=>setModalP(pren), style: {background:"none",border:"none",cursor:"pointer",display:"flex",padding:4,color:C.textDim,borderRadius:5},
                            onMouseEnter: e=>e.currentTarget.style.color=C.gold, onMouseLeave: e=>e.currentTarget.style.color=C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8744}}
                            , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8746}})
                          )
                          , React.createElement('button', { onClick: ()=>{if(window.confirm(`Eliminare la prenotazione di ${pren.nome}?`))delPren(pren.id);},
                            style: {background:"none",border:"none",cursor:"pointer",display:"flex",padding:4,color:C.textDim,borderRadius:5},
                            onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8748}}
                            , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8751}})
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

        /* SCALETTA */
        , tab==="brani" && React.createElement(ScalettaTab, { evento: evento, onUpdate: onUpdate, brani: braniCatalog, students: students })

        /* REPORT */
        , tab==="report" && (
          React.createElement('div', { style: {maxWidth:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8765}}
            , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8766}}
              /* Report header con colore tipo */
              , React.createElement('div', { style: {background:`linear-gradient(135deg,${tp.hex}18,${tp.hex}05)`,
                borderBottom:`1px solid ${tp.hex}30`,padding:"20px 24px",
                display:"flex",alignItems:"center",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8768}}
                , React.createElement('div', { style: {width:48,height:48,borderRadius:12,background:`${tp.hex}20`,border:`1px solid ${tp.hex}40`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8771}}
                  , React.createElement(Ic, { n: tp.icon, size: 22, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8773}})
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8775}}
                  , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8776}}, evento.titolo)
                  , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8777}}
                    , tp.label, " · "  , formatData(evento.data), evento.ora&&` · ${evento.ora}`
                  )
                )
              )

              , React.createElement('div', { style: {padding:"20px 24px",display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8783}}
                /* Dettagli */
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8785}}
                  , [
                    {l:"Luogo",  v:evento.luogo||"—"},
                    {l:"Stato",  v:evento.stato},
                    {l:"Tipo",   v:tp.label},
                    {l:"Capienza",v:`${evento.capienza} posti`},
                  ].map(x=>(
                    React.createElement('div', { key: x.l, style: {padding:"10px 0",borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8792}}
                      , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8793}}, x.l)
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8794}}, x.v)
                    )
                  ))
                )

                /* Programma */
                , evento.partecipanti.length>0 && (
                  React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8801}}
                    , React.createElement('div', { style: {fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8802}}, "Programma partecipanti"

                    )
                    , evento.partecipanti.map((p,i)=>(
                      React.createElement('div', { key: p.studentId, style: {display:"flex",gap:10,marginBottom:10,paddingBottom:10,
                        borderBottom:i<evento.partecipanti.length-1?`1px solid ${C.border}20`:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8806}}
                        , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:16,color:C.textDim,
                          width:24,flexShrink:0,textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8808}}, i+1, ".")
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8810}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8811}}, p.studentName)
                          , p.brani.length>0 && p.brani.map((b,j)=>(
                            React.createElement('div', { key: j, style: {display:"flex",alignItems:"center",gap:5,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8813}}
                              , React.createElement(Ic, { n: "music", size: 10, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8814}})
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8815}}, b)
                            )
                          ))
                        )
                      )
                    ))
                  )
                )

                /* Riepilogo biglietteria */
                , evento.biglietto && (
                  React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8826}}
                    , React.createElement('div', { style: {fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8827}}, "Riepilogo biglietteria"

                    )
                    , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8830}}
                      , [
                        {l:"Prezzo biglietto",  v:`€ ${evento.prezzoBiglietto}`},
                        {l:"Posti occupati",    v:`${postiOcc} / ${evento.capienza}`},
                        {l:"Prenotazioni conf.",v:prenConf.length},
                        {l:"Annullate",         v:evento.prenotazioni.filter(p=>p.stato==="annullata").length},
                        {l:"Incasso previsto",  v:fmt(incassoAtteso)},
                        {l:"Incasso riscosso",  v:fmt(incassoRisc)},
                        {l:"Da riscuotere",     v:fmt(incassoAtteso-incassoRisc)},
                      ].map(x=>(
                        React.createElement('div', { key: x.l, style: {display:"flex",justifyContent:"space-between",padding:"5px 0",
                          borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8840}}
                          , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8842}}, x.l)
                          , React.createElement('span', { style: {fontSize:12,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8843}}, x.v)
                        )
                      ))
                    )
                  )
                )

                /* Note */
                , evento.note && (
                  React.createElement('div', { style: {background:`${C.gold}08`,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8852}}
                    , React.createElement('div', { style: {fontSize:10,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8853}}, "Note post-evento" )
                    , React.createElement('p', { style: {fontSize:13,color:C.text,lineHeight:1.65}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8854}}, evento.note)
                  )
                )
              )
            )
          )
        )
      )

      /* Modal prenotazione */
      , modalP && (
        React.createElement(Modal, { title: modalP==="add"?"Nuova prenotazione":"Modifica prenotazione", onClose: ()=>setModalP(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8865}}
          , React.createElement(PrenotazioneForm, { evento: evento, students: students, docenti: docentiED, initial: modalP!=="add"?modalP:null, onSave: savePren, onClose: ()=>setModalP(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8866}})
        )
      )
    )
  );
};

// ─── CONCERTI VIEW ────────────────────────────────────────────────────────────
const ConcertiView = ({ students:propStudents, brani:propBraniCV, quickAction, clearQuickAction, userRuolo:_ruoloConc, concerti:propConcerti, setConcerti:propSetConcerti, docenti:propDocentiCV }) => {
  const ruoloConc = _ruoloConc || "admin";
  const isMobile = useIsMobile();
  const students  = propStudents || INIT_STUDENTS;
  const docenti   = propDocentiCV || [];
  const [_localConcerti, _setLocalConcerti] = useState(INIT_CONCERTI);
  const concerti    = propConcerti    || _localConcerti;
  const setConcerti = propSetConcerti || _setLocalConcerti;

  // ── Sync concerti → sito pubblico ──────────────────────────────
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('fm_admin_data') || '{}');
      existing.concerti = concerti.map(c => ({
        titolo:   c.titolo,
        data:     c.data,
        ora:      c.ora || '21:00',
        luogo:    c.luogo || '',
        ingresso: c.biglietto ? ('\u20AC' + (c.prezzoBiglietto || 0)) : 'Ingresso libero',
        badge:    c.tipo === 'saggio' ? 'Saggio' : c.tipo === 'concerto' ? 'Concerto' : 'Evento'
      }));
      localStorage.setItem('fm_admin_data', JSON.stringify(existing));
    } catch(e) {}
  }, [concerti]);
  // ───────────────────────────────────────────────────────────────
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null);
  React.useEffect(()=>{ if(quickAction==="addEvento"){ setModal("new"); if(clearQuickAction)clearQuickAction(); } },[quickAction]);
  const [fTipo,    setFTipo]    = useState("");
  const [fStato,   setFStato]   = useState("");
  const [search,   setSearch]   = useState("");

  const _myNomeConc = typeof window!=="undefined" ? (window.__currentUserName__||"") : "";
  const filtered = concerti.filter(e=>{
    const q = search.toLowerCase();
    const base = (!q || e.titolo.toLowerCase().includes(q)||e.luogo.toLowerCase().includes(q))
      && (!fTipo  || e.tipo===fTipo)
      && (!fStato || e.stato===fStato);
    if(ruoloConc==="allievo" && _myNomeConc)
      return base && (e.partecipanti||[]).some(p=>(p.studentName||"").toLowerCase().includes(_myNomeConc.toLowerCase()));
    if(ruoloConc==="docente") return base;
    return base;
  }).sort((a,b)=>(b.data||'').localeCompare(a.data||''));

  // Sincronizza i partecipanti su tabella relazionale concerti_partecipanti
  // (fonte di verità) — sostituisce tutte le righe per questo concerto
  const syncPartecipanti = async (concertoId, partecipanti) => {
    const sb = window.supabaseClient; if (!sb) return;
    try {
      // Elimina le righe esistenti per questo concerto
      await sb.from('concerti_partecipanti').delete().eq('concerto_id', concertoId);
      const lista = (partecipanti||[]).filter(p=>p.studentId);
      if (lista.length === 0) return;
      const righe = lista.map(p => ({
        concerto_id: concertoId,
        studente_id: parseInt(p.studentId)||p.studentId,
        studente_nome: p.studentName||'',
        brani: p.brani||[],
      }));
      const { error } = await sb.from('concerti_partecipanti').insert(righe);
      if (error) console.warn('[FM] syncPartecipanti error:', error.message);
    } catch(e) { console.warn('[FM] syncPartecipanti exception:', e?.message); }
  };

  const handleSave   = async ev => {
    const isNew = !concerti.some(x=>x.id===ev.id);
    setConcerti(p=>[...p.filter(x=>x.id!==ev.id),ev]);
    setModal(null);
    if(_optionalChain([selected, 'optionalAccess', _77 => _77.id])===ev.id) setSelected(ev);
    // Persisti su Supabase — colonne reali: titolo (non nome), id è TEXT (ok passarlo), jsonb diretto
    try {
      const sb = window.supabaseClient;
      if (sb) {
        const row = {
          id: ev.id, titolo: ev.titolo||ev.nome||'', data: ev.data||'', luogo: ev.luogo||'',
          tipo: ev.tipo||'evento', stato: ev.stato||'programmato',
          descrizione: ev.descrizione||'', note: ev.note||'',
          biglietto: !!ev.biglietto, prezzo_biglietto: parseFloat(ev.prezzoBiglietto)||0,
          programma: ev.programma||[],
          scaletta: ev.scaletta||[],
          prenotazioni: ev.prenotazioni||[],
          ora: ev.ora||null, capienza: ev.capienza||null,
        };
        if (isNew) {
          const { error } = await sb.from('concerti').insert(row);
          if (error) { console.warn('[FM] insert concerto error:', error.message); alert('⚠️ Errore salvataggio concerto:\n'+error.message); }
        } else {
          const { error } = await sb.from('concerti').update(row).eq('id', ev.id);
          if (error) { console.warn('[FM] update concerto error:', error.message); alert('⚠️ Errore salvataggio concerto:\n'+error.message); }
        }
        // Sincronizza i partecipanti sulla tabella relazionale dedicata
        await syncPartecipanti(ev.id, derivePartecipanti(ev, students));
      }
    } catch(e) { console.warn('[FM] handleSave concerto exception:', e?.message); }
  };
  const handleDelete = async () => {
    const id = _optionalChain([selected, 'optionalAccess', _78 => _78.id]);
    setConcerti(p=>p.filter(x=>x.id!==id)); setSelected(null); setModal(null);
    try {
      const sb = window.supabaseClient;
      if (sb && id) {
        const { error } = await sb.from('concerti').delete().eq('id', id);
        if (error) console.warn('[FM] delete concerto error:', error.message);
        // concerti_partecipanti viene eliminato automaticamente (ON DELETE CASCADE)
      }
    } catch(e) { console.warn('[FM] handleDelete concerto exception:', e?.message); }
  };
  const handleUpdate = async ev => {
    setConcerti(p=>p.map(x=>x.id===ev.id?ev:x)); setSelected(ev);
    try {
      const sb = window.supabaseClient;
      if (sb) {
        const row = {
          titolo: ev.titolo||ev.nome||'', data: ev.data||'', luogo: ev.luogo||'',
          tipo: ev.tipo||'evento', stato: ev.stato||'programmato',
          descrizione: ev.descrizione||'', note: ev.note||'',
          biglietto: !!ev.biglietto, prezzo_biglietto: parseFloat(ev.prezzoBiglietto)||0,
          programma: ev.programma||[],
          scaletta: ev.scaletta||[],
          prenotazioni: ev.prenotazioni||[],
        };
        const { error } = await sb.from('concerti').update(row).eq('id', ev.id);
        if (error) console.warn('[FM] handleUpdate concerto error:', error.message);
        // Se sono stati modificati i partecipanti (raro da qui, ma per sicurezza)
        await syncPartecipanti(ev.id, derivePartecipanti(ev, students));
      }
    } catch(e) { console.warn('[FM] handleUpdate concerto exception:', e?.message); }
  };


  if(selected) return (
    React.createElement(React.Fragment, null
      , React.createElement(EventoDetail, { evento: selected, students: students, docenti: docenti, brani: propBraniCV||[],
        onEdit: ()=>setModal("edit"),
        onDelete: ()=>setModal("del"),
        onBack: ()=>setSelected(null),
        onUpdate: handleUpdate, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8897}})
      , modal==="edit" && (
        React.createElement(Modal, { title: "Modifica evento" , onClose: ()=>setModal(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8903}}
          , React.createElement(EventoForm, { initial: selected, students: students, brani: propBraniCV||[], onSave: handleSave, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8904}})
        )
      )
      , modal==="del" && selected && (
        React.createElement(ConfirmDelete, { label: selected.titolo, description: "Tutte le prenotazioni associate verranno eliminate."     ,
          onConfirm: handleDelete, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8908}})
      )
    )
  );

  const prossimi   = concerti.filter(e=>e.stato==="programmato").length;
  const completati = concerti.filter(e=>e.stato==="completato").length;

  return (
    React.createElement('div', { style: {padding:isMobile?"12px":"clamp(16px,3vw,28px)",display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8918}}

      /* Header */
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8921}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8922}}
          , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8923}}, "Concerti & Eventi"  )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:14,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8924}}
            , prossimi, " programmati · "   , completati, " completati · "   , concerti.length, " totali"
          )
        )
        , React.createElement('div', {style:{display:"flex",alignItems:"center",gap:8}}
          , React.createElement(RefreshBtn)
          , ruoloConc==="admin" && React.createElement(Btn, { onClick: ()=>setModal("new"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8928}}, React.createElement(Ic, { n: "plus", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8928}}), "Nuovo evento" )
        )
      )

      /* KPI strip */
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8932}}
        , [
          {l:"Prossimi",    v:prossimi,    hex:C.blue,   icon:"calendar"},
          {l:"Completati",  v:completati,  hex:C.green,  icon:"check"},
          {l:"Con biglietto",v:concerti.filter(e=>e.biglietto).length, hex:C.gold, icon:"ticket"},
          {l:"Gratuiti",    v:concerti.filter(e=>!e.biglietto).length, hex:C.teal, icon:"users"},
          {l:"Annullati",   v:concerti.filter(e=>e.stato==="annullato").length, hex:C.red, icon:"x"},
        ].map(k=>(
          React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",
            display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8940}}
            , React.createElement('div', { style: {width:36,height:36,borderRadius:9,background:`${k.hex}15`,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8942}}
              , React.createElement(Ic, { n: k.icon, size: 16, stroke: k.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8944}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8946}}
              , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8947}}, k.v)
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8948}}, k.l)
            )
          )
        ))
      )

      /* Filtri */
      , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8955}}
        , React.createElement('div', { style: {position:"relative",flex:"1 1 180px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8956}}
          , React.createElement('span', { style: {position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8957}}, React.createElement(Ic, { n: "search", size: 13, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8957}}))
          , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value), placeholder: "Cerca eventi…" ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"8px 12px 8px 32px",fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8958}})
        )
        , React.createElement('select', { value: fTipo, onChange: e=>setFTipo(e.target.value),
          style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,
            fontSize:12,padding:"8px 12px",fontFamily:"'Open Sans',sans-serif",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8962}}
          , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8965}}, "Tutti i tipi"  )
          , TIPI_EVENTO.map(t=>React.createElement('option', { key: t.id, value: t.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8966}}, t.label))
        )
        , React.createElement('select', { value: fStato, onChange: e=>setFStato(e.target.value),
          style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,
            fontSize:12,padding:"8px 12px",fontFamily:"'Open Sans',sans-serif",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8968}}
          , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8971}}, "Tutti gli stati"  )
          , STATI_EVENTO.map(s=>React.createElement('option', { key: s, value: s, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8972}}, s))
        )
        , (fTipo||fStato||search) && (
          React.createElement('button', { onClick: ()=>{setFTipo("");setFStato("");setSearch("");},
            style: {background:"none",border:"none",cursor:"pointer",color:C.textDim,fontSize:12,fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8975}}, "Reset"

          )
        )
      )

      /* Card grid */
      , filtered.length===0 ? (
        React.createElement('div', { style: {textAlign:"center",padding:"64px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8984}}
          , React.createElement(Ic, { n: "flag", size: 40, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8985}})
          , React.createElement('p', { style: {marginTop:14,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8986}}, "Nessun evento trovato"  )
          , React.createElement('p', { style: {fontSize:12,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8987}}, "Crea il primo con il pulsante in alto"       )
        )
      ) : (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8990}}
          , filtered.map(ev=>{
            const tp  = tipoEv(ev.tipo);
            const sc  = statoEvColor(ev.stato);
            const pConf = ev.prenotazioni.filter(p=>p.stato==="confermata");
            const pOcc  = pConf.reduce((t,p)=>t+p.posti,0);
            const pct   = ev.capienza>0?Math.min(100,pOcc/ev.capienza*100):0;
            return (
              React.createElement('div', { key: ev.id,
                onClick: ruoloConc==="admin" ? ()=>setSelected(ev) : undefined,
                style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",
                  cursor:ruoloConc==="admin"?"pointer":"default",transition:"all 0.18s",display:"flex",flexDirection:"column"},
                onMouseEnter: ruoloConc==="admin" ? e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.28)";} : undefined,
                onMouseLeave: ruoloConc==="admin" ? e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";} : undefined, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8998}}
                /* Accent bar */
                , React.createElement('div', { style: {height:4,background:`linear-gradient(90deg,${tp.hex},${tp.hex}50)`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9004}})
                , React.createElement('div', { style: {padding:"15px 18px",flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9005}}
                  , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9006}}
                    , React.createElement('span', { style: {padding:"3px 10px",borderRadius:10,background:`${tp.hex}15`,color:tp.hex,
                      fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9007}}
                      , React.createElement(Ic, { n: tp.icon, size: 9, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9009}}), tp.label
                    )
                    , React.createElement('span', { style: {padding:"3px 10px",borderRadius:10,background:sc.bg,color:sc.fg,fontSize:10,fontWeight:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9011}}
                      , ev.stato
                    )
                    , ev.biglietto && (
                      React.createElement('span', { style: {padding:"3px 10px",borderRadius:10,background:C.goldBg,color:C.gold,fontSize:10,fontWeight:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9015}}, "€ "
                         , ev.prezzoBiglietto
                      )
                    )
                  )
                  , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,lineHeight:1.3,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9020}}
                    , ev.titolo
                  )
                  , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:3,fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9023}}
                    , ev.data && (
                      React.createElement('span', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9025}}
                        , React.createElement(Ic, { n: "calendar", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9026}})
                        , new Date(ev.data+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"})
                        , ev.ora&&` · ${ev.ora}`
                      )
                    )
                    , ev.luogo && (
                      React.createElement('span', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9032}}
                        , React.createElement(Ic, { n: "map", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9033}}), ev.luogo
                      )
                    )
                  )
                )
                /* Card footer */
                , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9039}}
                  , React.createElement('div', { style: {display:"flex",gap:10,fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9040}}
                    , React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9041}}
                      , React.createElement(Ic, { n: "users", size: 10, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9042}}), ev.partecipanti.length, " allievi"
                    )
                    , ev.biglietto && (
                      React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9045}}
                        , React.createElement(Ic, { n: "receipt", size: 10, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9046}}), pConf.length, " prenotazioni"
                      )
                    )
                  )
                  , ev.biglietto && ev.capienza>0 && (
                    React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9051}}
                      , React.createElement('div', { style: {width:56,height:4,background:C.border,borderRadius:2,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9052}}
                        , React.createElement('div', { style: {height:"100%",borderRadius:2,
                          background:pct>=90?C.red:pct>=70?C.gold:C.green,
                          width:`${pct}%`,transition:"width 0.4s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9053}})
                      )
                      , React.createElement('span', { style: {fontSize:10,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9057}}, pOcc, "/", ev.capienza)
                    )
                  )
                )
              )
            );
          })
        )
      )

      /* Modal nuovo evento */
      , modal==="new" && (
        React.createElement(Modal, { title: "Nuovo evento" , onClose: ()=>setModal(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9069}}
          , React.createElement(EventoForm, { students: students, brani: propBraniCV||[], onSave: handleSave, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9070}})
        )
      )
    )
  );
};


// ════════════════════════════════════════════════════════════════════════════════

// GESTIONE UTENTI

// ════════════════════════════════════════════════════════════════════════════════

// ─── COSTANTI ─────────────────────────────────────────────────────────────────
const OGGI = new Date();
const fmt_data = d => new Date(d+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"short",year:"numeric"});
const fmt_ts   = d => new Date(d).toLocaleDateString("it-IT",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});

const RUOLI = [
  {id:"admin",   label:"Amministratore", hex:C.gold,    bg:C.goldBg,    bd:C.goldDim,      desc:"Accesso completo al sistema e alle impostazioni"},
  {id:"docente", label:"Docente",        hex:C.teal,    bg:C.tealBg,    bd:C.tealBorder,   desc:"Proprie lezioni, allievi assegnati, repertorio"},
  {id:"allievo", label:"Allievo",        hex:C.blue,    bg:C.blueBg,    bd:C.blueBorder,   desc:"Dashboard personale, calendario e concerti propri"},
  {id:"band",    label:"Sala Prove",     hex:C.orange2, bg:C.orange2Bg, bd:C.orange2Border,desc:"Solo prenotazione sala prove"},
];
const ruoloById = id => RUOLI.find(r=>r.id===id) || {id, label:id, hex:C.textMuted, bg:C.bg, bd:C.border, desc:''};

const MODULI = [
  {id:"dashboard",   label:"Dashboard",      icon:"grid"},
  {id:"allievi",     label:"Allievi",         icon:"users"},
  {id:"docenti",     label:"Docenti",         icon:"user"},
  {id:"corsi",       label:"Corsi",           icon:"music"},
  {id:"calendario",  label:"Calendario",      icon:"calendar"},
  {id:"concerti",    label:"Concerti",        icon:"star"},
  {id:"contabilita", label:"Contabilità",     icon:"euro"},
  {id:"repertorio",  label:"Repertorio",      icon:"music"},
  {id:"allegati",    label:"Allegati",        icon:"paperclip"},
  {id:"utenti",      label:"Gestione utenti", icon:"shield"},
];

// Permessi default per ruolo (usati da UtentiView per granularità moduli)
const PERM_DEFAULT = {
  admin:   {dashboard:true, allievi:true,  calendario:true, contabilita:true,  repertorio:true,  report:true,  impostazioni:true,  utenti:true},
  docente: {dashboard:true, allievi:true,  calendario:true, contabilita:true,  repertorio:true,  report:false, impostazioni:false, utenti:false},
  allievo: {dashboard:true, allievi:false, calendario:true, contabilita:true,  repertorio:false, report:false, impostazioni:false, utenti:false},
};

const STATI = [
  {id:"attivo",   label:"Attivo",           hex:C.green,  bg:C.greenBg,  bd:C.greenBorder},
  {id:"attesa",   label:"In attesa",         hex:C.orange, bg:C.orangeBg, bd:C.orangeBorder},
  {id:"sospeso",  label:"Sospeso",           hex:C.red,    bg:C.redBg,    bd:C.redBorder},
  {id:"invitato", label:"Invito inviato",    hex:C.blue,   bg:C.blueBg,   bd:C.blueBorder},
];
const statoById = id => STATI.find(s=>s.id===id)||STATI[0];

// ─── DATI DEMO ────────────────────────────────────────────────────────────────
const INIT_UTENTI = [
  {id:"u1", nome:"Marco Bianchi",    email:"admin@accademia.it",      ruolo:"admin",   stato:"attivo",  avatar:"MB", iscritto:"2023-09-01", ultimoAccesso:"2025-05-23T09:14:00", permessi:{...PERM_DEFAULT.admin},   note:"Amministratore di sistema"},
  {id:"u3", nome:"Prof. Rossi",      email:"rossi@accademia.it",      ruolo:"docente",  stato:"attivo",  avatar:"PR", iscritto:"2023-10-01", ultimoAccesso:"2025-05-22T18:05:00", permessi:{...PERM_DEFAULT.docente}, note:"Docente di pianoforte"},
  {id:"u4", nome:"Prof. Bianchi",    email:"fbianchi@accademia.it",   ruolo:"docente",  stato:"attivo",  avatar:"PB", iscritto:"2023-10-01", ultimoAccesso:"2025-05-20T16:30:00", permessi:{...PERM_DEFAULT.docente}, note:""},
  {id:"u5", nome:"Prof. Verde",      email:"verde@accademia.it",      ruolo:"docente",  stato:"attivo",  avatar:"PV", iscritto:"2024-01-10", ultimoAccesso:"2025-05-21T14:00:00", permessi:{...PERM_DEFAULT.docente}, note:""},
  {id:"u8", nome:"Sofia Marchetti",  email:"sofia@accademia.it",      ruolo:"allievo",  stato:"attivo",  avatar:"SM", iscritto:"2024-09-01", ultimoAccesso:"2025-05-22T10:00:00", permessi:{...PERM_DEFAULT.allievo}, note:"Allievo di pianoforte"},
  {id:"u9", nome:"Luca Ferrari",     email:"luca.f@gmail.com",        ruolo:"allievo",  stato:"attivo",  avatar:"LF", iscritto:"2024-09-10", ultimoAccesso:"2025-05-20T15:30:00", permessi:{...PERM_DEFAULT.allievo}, note:"Allievo di chitarra"},
  {id:"u7", nome:"Antonio Ferrara",  email:"a.ferrara@gmail.com",     ruolo:"docente",  stato:"sospeso", avatar:"AF", iscritto:"2024-06-01", ultimoAccesso:"2025-03-10T09:00:00", permessi:{...PERM_DEFAULT.docente}, note:"Sospeso — contratto scaduto"},
];

const INIT_RICHIESTE = [
  {id:"r1", nome:"Chiara Lombardi",  email:"c.lombardi@gmail.com",  ruolo:"docente", data:"2025-05-22", messaggio:"Docente di violoncello, vorrei accedere al calendario e al repertorio."},
  {id:"r2", nome:"Matteo Conti",     email:"m.conti@gmail.com",       ruolo:"allievo", data:"2025-05-20", messaggio:"Sono un nuovo allievo di chitarra, vorrei accedere al portale."},
  {id:"r3", nome:"Sofia Belli",      email:"s.belli@accademia.it",    ruolo:"docente", data:"2025-05-18", messaggio:"Nuova insegnante di canto assunta dal 1° giugno."},
];

// ─── DRAWER DETTAGLIO UTENTE ──────────────────────────────────────────────────
const UtenteDrawer = ({utente,onClose,onSave,onSospendi,onElimina,isCurrentAdmin,students,docenti})=>{
  const [draft,setDraft]=useState({...utente, docenteId:utente.docenteId||null, allievoId:utente.allievoId||null});
  const [tab,setTab]=useState("profilo");
  const r=ruoloById(draft.ruolo);
  const isSelf=isCurrentAdmin&&utente.id==="u1";// non può modificare se stesso

  const setD=(k,v)=>setDraft(p=>({...p,[k]:v}));
  const setPerm=(k,v)=>setDraft(p=>({...p,permessi:{...p.permessi,[k]:v}}));

  const handleRuolo=(rid)=>{
    setDraft(p=>({...p,ruolo:rid,permessi:{...PERM_DEFAULT[rid]}}));
  };

  return(
    React.createElement(React.Fragment, null
      , React.createElement('div', { onClick: onClose, style: {position:"fixed",inset:0,zIndex:300,
        background:"rgba(0,0,0,.7)",backdropFilter:"blur(3px)",animation:"fadeIn .2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9157}})
      , React.createElement('div', { style: {position:"fixed",top:0,right:0,bottom:0,zIndex:301,width:500,
        background:C.surface,borderLeft:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",animation:"slideDrawer .26s cubic-bezier(.4,0,.2,1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9159}}

        /* Header */
        , React.createElement('div', { style: {padding:"18px 22px",borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",gap:14,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9164}}
          , React.createElement(Avatar, { initials: utente.avatar, hex: r.hex, size: 46, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9166}})
          , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9167}}
            , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:20,fontWeight:600,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9168}}, utente.nome)
            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9170}}, utente.email)
          )
          , React.createElement('div', { style: {display:"flex",gap:8,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9172}}
            , React.createElement(Badge, { stato: utente.stato, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9173}})
            , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
              color:C.textMuted,display:"flex",padding:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9174}}
              , React.createElement(Ic, { n: "x", size: 17, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9176}})
            )
          )
        )

        /* Tabs */
        , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9182}}
          , [["profilo","user","Profilo"],["permessi","shield","Permessi"],["attivita","clock","Attività"]].map(([v,ic,lb])=>(
            React.createElement('button', { key: v, onClick: ()=>setTab(v),
              style: {flex:1,padding:"11px 0",display:"flex",alignItems:"center",justifyContent:"center",
                gap:6,background:"none",border:"none",cursor:"pointer",fontSize:12,
                color:tab===v?C.gold:C.textMuted,fontFamily:"'Open Sans',sans-serif",
                borderBottom:`2px solid ${tab===v?C.gold:"transparent"}`,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9184}}
              , React.createElement(Ic, { n: ic, size: 13, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9189}}), lb
            )
          ))
        )

        /* Body */
        , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"18px 22px",display:"flex",flexDirection:"column",gap:18}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9195}}

          /* ── PROFILO ── */
          , tab==="profilo"&&(
            React.createElement(React.Fragment, null
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9200}}
                , React.createElement(Field, { label: "Nome completo *"  , value: draft.nome, onChange: e=>setD("nome",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9201}})
                , React.createElement(Field, { label: "Email *" , type: "email", value: draft.email, onChange: e=>setD("email",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9202}})
              )

              /* Ruolo */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9206}}
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9207}}, "Ruolo")
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9208}}
                  , RUOLI.map(r=>(
                    React.createElement('button', { key: r.id, onClick: ()=>!isSelf&&handleRuolo(r.id),
                      style: {padding:"10px 13px",borderRadius:10,textAlign:"left",cursor:isSelf?"default":"pointer",
                        fontFamily:"'Open Sans',sans-serif",transition:"all .15s",
                        background:draft.ruolo===r.id?r.bg:C.bg,
                        border:`1.5px solid ${draft.ruolo===r.id?r.hex:C.border}`,
                        opacity:isSelf&&draft.ruolo!==r.id?.4:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9210}}
                      , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:draft.ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9216}}, r.label)
                      , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3,lineHeight:1.4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9217}}, r.desc)
                    )
                  ))
                )
                , isSelf&&React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9221}}, "Non puoi modificare il tuo ruolo."     )
              )

              /* Note */
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9225}}
                , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9226}}, "Note interne" )
                , React.createElement('textarea', { value: draft.note, onChange: e=>setD("note",e.target.value), rows: 2,
                  placeholder: "Note visibili solo agli amministratori..."    ,
                  style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    color:C.text,fontSize:13,padding:"9px 13px",width:"100%",
                    fontFamily:"'Open Sans',sans-serif",resize:"vertical"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9227}})
              )

              /* ── Collega record allievo/docente ── */
              , (draft.ruolo==='allievo'||draft.ruolo==='docente') && (
                React.createElement('div', {style:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px'}}
                  , React.createElement('div', {style:{fontSize:10,color:C.textMuted,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:10}}
                    , React.createElement(Ic,{n:'link',size:11,stroke:C.textMuted}), ' Collega record '
                    , React.createElement('span',{style:{color:C.gold}}, draft.ruolo==='allievo'?'Allievo':'Docente')
                  )
                  , React.createElement('p',{style:{fontSize:12,color:C.textDim,marginBottom:12,lineHeight:1.5}},
                    'Collega questo utente al suo record nel gestionale. I dati (lezioni, pagamenti, ecc.) verranno filtrati in base a questa associazione.')
                  , React.createElement('select', {
                      value: draft.ruolo==='allievo' ? (draft.allievoId||'') : (draft.docenteId||''),
                      onChange: e => {
                        const val = e.target.value||null;
                        if (draft.ruolo==='allievo') setD('allievoId', val);
                        else setD('docenteId', val);
                      },
                      style:{width:'100%',padding:'10px 12px',borderRadius:8,
                        border:`1px solid ${C.border}`,background:C.surface,
                        color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",outline:'none'}
                    }
                    , React.createElement('option',{value:''},'— Nessun collegamento —')
                    , draft.ruolo==='allievo'
                      ? (students||[]).map(s=>React.createElement('option',{key:s.id,value:String(s.id)},s.name||s.nome||''))
                      : (docenti||[]).map(d=>React.createElement('option',{key:d.id,value:String(d.id)},d.nome||d.name||''))
                  )
                  , (draft.ruolo==='allievo'?draft.allievoId:draft.docenteId) && (
                    React.createElement('div',{style:{marginTop:8,fontSize:11,color:C.green,display:'flex',alignItems:'center',gap:5}}
                      , React.createElement(Ic,{n:'check',size:11,stroke:C.green})
                      , 'Collegato — i dati vengono filtrati automaticamente al login'
                    )
                  )
                )
              )

              /* Info di sistema */
              , React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}}
                , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9236}}, "Informazioni account" )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9237}}
                  , [
                    {label:"Iscritto il",    val:fmt_data(utente.iscritto)},
                    {label:"Ultimo accesso", val:utente.ultimoAccesso?fmt_ts(utente.ultimoAccesso):"Mai"},
                    {label:"Stato account",  val:React.createElement(Badge, { stato: utente.stato, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9241}})},
                  ].map(row=>(
                    React.createElement('div', { key: row.label, style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9243}}
                      , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9244}}, row.label)
                      , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9245}}, row.val)
                    )
                  ))
                )
              )

              /* Azioni pericolose */
              , !isSelf&&(
                React.createElement('div', { style: {background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9253}}
                  , React.createElement('div', { style: {fontSize:11,color:C.red,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9254}}, "Zona pericolosa" )
                  , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9255}}
                    , React.createElement(Btn, { small: true, danger: true, onClick: ()=>onSospendi(utente), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9256}}
                      , React.createElement(Ic, { n: utente.stato==="sospeso"?"unlock":"ban", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9257}})
                      , utente.stato==="sospeso"?"Riattiva account":"Sospendi account"
                    )
                    , React.createElement(Btn, { small: true, danger: true, onClick: ()=>onElimina(utente), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9260}}
                      , React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9261}}), "Elimina utente"
                    )
                  )
                )
              )
            )
          )

          /* ── PERMESSI ── */
          , tab==="permessi"&&(
            React.createElement(React.Fragment, null
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9272}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9273}}, "Permessi moduli" )
                , React.createElement('div', { style: {fontSize:12,color:C.textDim,marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9274}}, "Personalizza l'accesso ai moduli rispetto al ruolo base. Il ruolo "

                    , React.createElement('span', { style: {color:r.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9276}}, r.label), " ha permessi predefiniti."
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9278}}
                  , MODULI.map(m=>{
                    const def=_optionalChain([PERM_DEFAULT, 'access', _79 => _79[draft.ruolo], 'optionalAccess', _80 => _80[m.id]])||false;
                    const val=_nullishCoalesce(_optionalChain([draft, 'access', _81 => _81.permessi, 'optionalAccess', _82 => _82[m.id]]), () => (def));
                    const personalizzato=val!==def;
                    return(
                      React.createElement('div', { key: m.id, style: {display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                        borderRadius:10,border:`1px solid ${val?C.border+"80":C.border+"30"}`,
                        background:val?C.bg:C.surface2,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9284}}
                        , React.createElement('div', { style: {width:30,height:30,borderRadius:8,flexShrink:0,
                          background:val?`${r.hex}18`:C.surface,
                          display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9287}}
                          , React.createElement(Ic, { n: m.icon, size: 14, stroke: val?r.hex:C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9290}})
                        )
                        , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9292}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:val?C.text:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9293}}, m.label)
                          , personalizzato&&(
                            React.createElement('div', { style: {fontSize:10,color:val?C.green:C.orange,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9295}}
                              , val?"Aggiunto rispetto al ruolo base":"Rimosso rispetto al ruolo base"
                            )
                          )
                        )
                        , React.createElement(Toggle, { value: val, onChange: v=>setPerm(m.id,v), disabled: isSelf&&m.id==="utenti", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9300}})
                      )
                    );
                  })
                )
              )
              , React.createElement('button', { onClick: ()=>setDraft(p=>({...p,permessi:{...PERM_DEFAULT[p.ruolo]}})),
                style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,
                  fontSize:12,padding:"8px 14px",cursor:"pointer",fontFamily:"'Open Sans',sans-serif",
                  display:"flex",alignItems:"center",gap:6,alignSelf:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9306}}
                , React.createElement(Ic, { n: "check", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9310}}), "Ripristina default ruolo"
              )
            )
          )

          /* ── ATTIVITÀ ── */
          , tab==="attivita"&&(
            React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9317}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9318}}, "Storico accessi" )
              , [
                {data:"23/05/2025 09:14",evento:"Accesso effettuato",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"22/05/2025 18:05",evento:"Accesso effettuato",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"22/05/2025 14:30",evento:"Modifica permessi utente",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"20/05/2025 09:00",evento:"Accesso effettuato",ip:"10.0.0.5",dispositivo:"Safari / iPhone"},
                {data:"18/05/2025 16:45",evento:"Password modificata",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"15/05/2025 11:22",evento:"Accesso effettuato",ip:"192.168.1.10",dispositivo:"Firefox / Windows"},
              ].map((a,i)=>(
                React.createElement('div', { key: i, style: {padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,
                  borderRadius:9,display:"flex",gap:12,alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9327}}
                  , React.createElement('div', { style: {width:7,height:7,borderRadius:"50%",background:C.goldDim,marginTop:5,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9329}})
                  , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9330}}
                    , React.createElement('div', { style: {fontSize:12,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9331}}, a.evento)
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:2,display:"flex",gap:10,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9332}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9333}}, a.data)
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9334}}, "·"), React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9334}}, a.dispositivo)
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9335}}, "·"), React.createElement('span', { style: {fontFamily:"monospace",fontSize:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9335}}, a.ip)
                    )
                  )
                )
              ))
            )
          )
        )

        /* Footer */
        , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,
          position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:(window.__IS_PWA__||window.matchMedia('(display-mode:standalone)').matches||window.innerWidth<=768)?"calc(env(safe-area-inset-bottom,0px) + 64px)":"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:8,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9345}}
          , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9347}}, "Annulla")
          , React.createElement(Btn, { onClick: ()=>onSave(draft), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9348}}
            , React.createElement(Ic, { n: "check", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9349}}), "Salva modifiche"
          )
        )
      )
    )
  );
};

// ─── MODAL INVITA UTENTE ──────────────────────────────────────────────────────
const InvitaModal=({onInvita,onClose})=>{
  const [f,setF]=useState({nome:"",email:"",ruolo:"docente",messaggio:""});
  const [err,setErr]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const validate=()=>{
    const e={};
    if(!f.nome.trim()) e.nome="Nome obbligatorio";
    if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email)) e.email="Email non valida";
    return e;
  };
  const handleSend=()=>{
    const e=validate(); if(Object.keys(e).length){setErr(e);return;}
    onInvita(f);
  };

  return(
    React.createElement(Modal, { title: "Invita nuovo utente"  , onClose: onClose, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9375}}
      , React.createElement('div', { style: {padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9376}}
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9377}}
          , React.createElement(Field, { label: "Nome completo *"  , value: f.nome, onChange: e=>set("nome",e.target.value), error: err.nome, placeholder: "Es. Mario Rossi"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9378}})
          , React.createElement(Field, { label: "Email *" , type: "email", value: f.email, onChange: e=>set("email",e.target.value), error: err.email, placeholder: "mario@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9379}})
        )
        /* Selezione ruolo */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9382}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:9}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9383}}, "Ruolo assegnato" )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9384}}
            , RUOLI.map(r=>(
              React.createElement('button', { key: r.id, onClick: ()=>set("ruolo",r.id),
                style: {padding:"10px 12px",borderRadius:9,textAlign:"left",cursor:"pointer",
                  fontFamily:"'Open Sans',sans-serif",transition:"all .15s",
                  background:f.ruolo===r.id?r.bg:C.bg,
                  border:`1.5px solid ${f.ruolo===r.id?r.hex:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9386}}
                , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:f.ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9391}}, r.label)
                , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3,lineHeight:1.35}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9392}}, r.desc)
              )
            ))
          )
        )
        /* Link invito simulato */
        , React.createElement('div', { style: {background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:9,padding:"11px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9398}}
          , React.createElement('div', { style: {fontSize:11,color:C.blue,marginBottom:5,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9399}}, "Link di invito (verrà inviato via email)"      )
          , React.createElement('div', { style: {fontSize:11,color:C.textDim,fontFamily:"monospace",
            background:C.bg,padding:"6px 10px",borderRadius:6,wordBreak:"break-all"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9400}}, "https://accademia.it/accesso?token=inv_"
            , Math.random().toString(36).slice(2,10)
          )
        )
        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9405}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9406}}, "Messaggio personalizzato (opzionale)"  )
          , React.createElement('textarea', { value: f.messaggio, onChange: e=>set("messaggio",e.target.value), rows: 2,
            placeholder: "Es. Benvenuto! Clicca il link per completare la registrazione."        ,
            style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"9px 13px",width:"100%",
              fontFamily:"'Open Sans',sans-serif",resize:"vertical"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9407}})
        )
      )
      , React.createElement('div', { style: {padding:"13px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:(window.__IS_PWA__||window.matchMedia('(display-mode:standalone)').matches||window.innerWidth<=768)?"calc(env(safe-area-inset-bottom,0px) + 64px)":"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9414}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9415}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSend, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9416}}, React.createElement(Ic, { n: "mail", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9416}}), "Invia invito" )
      )
    )
  );
};

// ─── MODAL RICHIESTA DETTAGLIO ────────────────────────────────────────────────
const RichiestaModal=({richiesta,onApprova,onRifiuta,onClose})=>{
  const [ruolo,setRuolo]=useState(richiesta.ruolo);
  const r=ruoloById(ruolo);
  return(
    React.createElement(Modal, { title: "Richiesta di accesso"  , onClose: onClose, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9427}}
      , React.createElement('div', { style: {padding:"20px 22px",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9428}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9429}}
          , React.createElement(Avatar, { initials: richiesta.nome.split(" ").map(p=>p[0]).join("").slice(0,2), hex: r.hex, size: 48, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9430}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9431}}
            , React.createElement('div', { style: {fontSize:16,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9432}}, richiesta.nome)
            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9433}}, richiesta.email)
            , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9434}}, "Richiesta del "  , fmt_data(richiesta.data))
          )
        )
        , React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9437}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginBottom:6,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9438}}, "Messaggio")
          , React.createElement('div', { style: {fontSize:13,color:C.text,lineHeight:1.55}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9439}}, richiesta.messaggio)
        )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9441}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:9}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9442}}, "Assegna ruolo" )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9443}}
            , RUOLI.map(r=>(
              React.createElement('button', { key: r.id, onClick: ()=>setRuolo(r.id),
                style: {padding:"9px 12px",borderRadius:9,textAlign:"left",cursor:"pointer",
                  fontFamily:"'Open Sans',sans-serif",transition:"all .15s",
                  background:ruolo===r.id?r.bg:C.bg,
                  border:`1.5px solid ${ruolo===r.id?r.hex:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9445}}
                , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9450}}, r.label)
              )
            ))
          )
        )
      )
      , React.createElement('div', { style: {padding:"13px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:(window.__IS_PWA__||window.matchMedia('(display-mode:standalone)').matches||window.innerWidth<=768)?"calc(env(safe-area-inset-bottom,0px) + 64px)":"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-between",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9456}}
        , React.createElement(Btn, { danger: true, onClick: ()=>onRifiuta(richiesta), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9457}}
          , React.createElement(Ic, { n: "x", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9458}}), "Rifiuta"
        )
        , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9460}}
          , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9461}}, "Annulla")
          , React.createElement(Btn, { onClick: ()=>onApprova(richiesta,ruolo), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9462}}
            , React.createElement(Ic, { n: "check", size: 13, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9463}}), "Approva e attiva"
          )
        )
      )
    )
  );
};

// ─── CONFIRM DELETE ───────────────────────────────────────────────────────────
const ConfirmModal=({titolo,testo,onConfirm,onClose,danger=true})=>(
  React.createElement(Modal, { title: titolo, onClose: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9473}}
    , React.createElement('div', { style: {padding:"22px 22px 14px",display:"flex",flexDirection:"column",gap:14,alignItems:"center",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9474}}
      , React.createElement('div', { style: {width:50,height:50,borderRadius:"50%",background:danger?C.redBg:C.orangeBg,
        border:`1px solid ${danger?C.redBorder:C.orangeBorder}`,
        display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9475}}
        , React.createElement(Ic, { n: "warn", size: 22, stroke: danger?C.red:C.orange, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9478}})
      )
      , React.createElement('p', { style: {fontSize:14,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9480}}, testo)
    )
    , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:(window.__IS_PWA__||window.matchMedia('(display-mode:standalone)').matches||window.innerWidth<=768)?"calc(env(safe-area-inset-bottom,0px) + 64px)":"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9482}}
      , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9483}}, "Annulla")
      , React.createElement(Btn, { danger: true, onClick: onConfirm, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9484}}, "Conferma")
    )
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════

const RuoloBadge = ({ ruolo }) => {
  const r = ruoloById(ruolo);
  return (
    React.createElement('span', { style: {display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",
      borderRadius:20,background:r.bg,border:`1px solid ${r.bd}`,
      fontSize:11,fontWeight:500,color:r.hex,fontFamily:"'Open Sans',sans-serif",
      letterSpacing:"0.04em",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9496}}
      , r.label
    )
  );
};


// ─── PORTAL HELPER ──────────────────────────────────────────────────────────
// Monta elementi su document.body, evitando che overflow:auto+animation
// sul contenitore padre intrappoli i position:fixed
const _Portal = ({ children }) => {
  if (typeof document === 'undefined' || !window.ReactDOM || !window.ReactDOM.createPortal) return null;
  return window.ReactDOM.createPortal(children, document.body);
};

// ─── ALLEGATI VIEW ────────────────────────────────────────────────────────────
const AllegatiView = ({ allegati:propAllegati, setAllegati:propSetAllegati, lessons:propLessons, students:propStudents, courses:propCourses, brani:propBrani, setBrani:propSetBrani, userRuolo:_avRuolo, appUser:_avUser }) => {
  const lessons   = propLessons   || [];
  const students  = propStudents  || [];
  const brani     = propBrani     || [];
  // Merge: allegati da propAllegati (DB) + allegati embedded nelle lezioni (lesson.allegati)
  // Filtra lezioni per docente se necessario
  const _avNome = (_avUser && _avUser.nome) || '';
  const _avLessons = _avRuolo === 'docente' && _avNome
    ? lessons.filter(l => {
        const t = (l.teacher||'').toLowerCase().trim();
        const k = _avNome.toLowerCase().trim();
        return t === k || t.includes(k) || k.includes(t);
      })
    : lessons;
  const _avLessonIds = new Set(_avLessons.map(l=>l.id));
  // Filtra allegati DB per docente (solo lezioni visibili)
  const fromDB = (_avRuolo === 'docente' && _avNome)
    ? (propAllegati||[]).filter(a => !a.lezioneId || _avLessonIds.has(a.lezioneId))
    : (propAllegati || []);
  const fromLessons = [];
  _avLessons.forEach(l => {
    (l.allegati||[]).forEach(a => {
      if (!fromDB.find(x=>x.id===a.id)) {
        fromLessons.push({
          id: a.id, lezioneId: l.id, allievoId: l.studentId||null,
          allievoNome: l.student||null, corso: l.instrument||null,
          descrizione: a.descrizione||null, fileUrl: a.fileUrl||null,
          fileName: a.fileName||null, fileType: a.fileType||null, createdAt: a.createdAt||null,
        });
      }
    });
  });
  const allegatiLezioni = [...fromDB, ...fromLessons];
  const [search,  setSearch]  = useState("");
  const [fCorso,  setFCorso]  = useState("");
  const [fAllievo,setFAllievo]= useState("");
  const [fTipo,   setFTipo]   = useState(""); // 'lezione'|'spartito'|'file_brano'
  const [editAllegato, setEditAllegato] = useState(null);
  const [editAllegatoDesc, setEditAllegatoDesc] = useState('');
  const [confirmDelAll, setConfirmDelAll] = useState(null);

  // Sync modali verso lo slot globale di App (fuori da main-scroll animato)
  const _closeConfirmDel = () => {
    setConfirmDelAll(null);
    if (window.__FM_HIDE_MODAL__) window.__FM_HIDE_MODAL__();
  };
  const _closeEditAll = () => {
    setEditAllegato(null);
    if (window.__FM_HIDE_MODAL__) window.__FM_HIDE_MODAL__();
  };

  const handleDeleteAllegato = async (allegatoDaEliminare) => {
    const a = allegatoDaEliminare; // cattura prima di azzerare
    setConfirmDelAll(null);
    const sb = window.supabaseClient;

    if (a._categoria === 'storage_orphan') {
      // File orfano in Storage — elimina solo il file fisico (non ha record nel DB)
      if (sb && a.fileUrl) {
        try {
          const urlPath = a.fileUrl.split('/object/public/allegati/')[1];
          if (urlPath) {
            const { error } = await sb.storage.from('allegati').remove([decodeURIComponent(urlPath)]);
            if (error) { alert('Errore eliminazione file: '+error.message); return; }
          }
        } catch(e) { alert('Errore: '+e?.message); return; }
      }
      // Rimuovi dalla lista locale (storageOrphans è derivato dinamicamente — forza refresh)
      if (window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__();
      return;
    }

    if (a._categoria === 'lezione') {
      if (a.lezioneId) {
        // Allegato inline nella lezione — aggiorna la lezione stessa
        const lesson = _avLessons.find(l => l.id === a.lezioneId);
        if (lesson && sb) {
          const nuoviAllegati = (lesson.allegati||[]).filter(x => x.id !== a.id);
          const { error } = await sb.from('lezioni').update({allegati: nuoviAllegati}).eq('id', a.lezioneId);
          if (error) { alert('Errore: '+error.message); return; }
          // Rimuovi file fisico dallo Storage
          if (a.fileUrl) {
            try {
              const urlPath = a.fileUrl.split('/object/public/allegati/')[1];
              if (urlPath) await sb.storage.from('allegati').remove([urlPath]);
            } catch(e) { console.warn('[FM] storage delete lesson file:', e); }
          }
        }
      } else {
        // Allegato in tabella allegati separata
        if (sb) {
          const { error } = await sb.from('allegati').delete().eq('id', a.id);
          if (error) { alert('Errore: '+error.message); return; }
          if (a.fileUrl) {
            try {
              const urlPath = a.fileUrl.split('/object/public/allegati/')[1];
              if (urlPath) await sb.storage.from('allegati').remove([urlPath]);
            } catch(e) { console.warn('[FM] storage delete allegati:', e); }
          }
        }
      }
      // Aggiorna stato locale
      if (propSetAllegati) propSetAllegati(p => p.filter(x => x.id !== a.id));
      // Forza ricaricamento dati
      if (window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__();

    } else if ((a._categoria === 'spartito' || a._categoria === 'file_brano') && a.branoId) {
      const brano = brani.find(b => b.id === a.branoId);
      if (!brano) { console.warn('[FM] brano non trovato', a.branoId); return; }
      const vIdx = a.versioneIdx != null ? a.versioneIdx : 0;
      const campo = a._categoria === 'spartito' ? 'spartiti' : 'allegati';
      const nuoveVersioni = (brano.versioni||[]).map((v, i) => {
        if (i !== vIdx) return v;
        return {...v, [campo]: (v[campo]||[]).filter(f => f.id !== a.id)};
      });
      if (propSetBrani) propSetBrani(p => p.map(b => b.id === a.branoId ? {...b, versioni: nuoveVersioni} : b));
      if (sb) {
        const { error } = await sb.from('brani').update({versioni: nuoveVersioni}).eq('id', a.branoId);
        if (error) { alert('Errore eliminazione file brano: '+error.message); return; }
        const storePath = a.storagePath || (a.fileUrl ? a.fileUrl.split('/object/public/allegati/')[1] : null);
        if (storePath) {
          try { await sb.storage.from('allegati').remove([storePath]); } catch(e) {}
        }
      }
    }
  };

  // Modal inline: niente __FM_SHOW_MODAL__ (può non essere definito)
  // Renderizzati direttamente nel return della AllegatiView
  // Unisce allegati lezioni + spartiti/allegati di TUTTE le versioni dei brani
  const allegatiBrani = [];
  brani.forEach(b => {
    (b.versioni||[]).forEach((v, vIdx) => {
      const tonLabel = v.tonalita ? ` (${v.tonalita})` : '';
      (v.spartiti||[]).forEach(s => {
        if(s.fileUrl||s.fileName) allegatiBrani.push({
          id: s.id||('sp_'+b.id+'_'+vIdx+'_'+s.fileName),
          fileName: s.fileName||'Spartito', fileUrl: s.fileUrl||null, fileType: s.fileType||'application/pdf',
          descrizione: `Spartito: ${b.title||''}${tonLabel}`,
          corso: b.title||'', allievoNome:'', lezioneId:null,
          branoId: b.id, versioneIdx: vIdx, storagePath: s.storagePath||null,
          _categoria:'spartito', createdAt: s.createdAt||null,
        });
      });
      (v.allegati||[]).forEach(fi => {
        if(fi.fileUrl||fi.fileName) allegatiBrani.push({
          id: fi.id||('fa_'+b.id+'_'+vIdx+'_'+fi.fileName),
          fileName: fi.fileName||'File', fileUrl: fi.fileUrl||null, fileType: fi.fileType||'',
          descrizione: `File brano: ${b.title||''}${tonLabel}`,
          corso: b.title||'', allievoNome:'', lezioneId:null,
          branoId: b.id, versioneIdx: vIdx, storagePath: fi.storagePath||null,
          _categoria:'file_brano', createdAt: fi.createdAt||null,
        });
      });
    });
  });
  const allegati = [
    ...allegatiLezioni.map(a=>({...a, _categoria:'lezione'})),
    ...allegatiBrani,
  ];

  // Scansione storage bucket: trova file caricati direttamente senza record in DB
  const [storageOrphans, setStorageOrphans] = useState([]);
  const [scanningStorage, setScanningStorage] = useState(false);

  React.useEffect(function() {
    const sb = window.supabaseClient;
    if (!sb) return;
    setScanningStorage(true);
    const supabaseUrl = 'https://ocsxrjommtrjelnbihfr.supabase.co';
    const dbUrls = new Set(allegatiLezioni.map(a => a.fileUrl).filter(Boolean));

    // Funzione ricorsiva per listare tutti i file incluse sottocartelle
    async function listAll(prefix) {
      const { data: items } = await sb.storage.from('allegati').list(prefix, { limit: 500 });
      if (!items) return [];
      const files = [];
      for (const item of items) {
        if (item.id) {
          // è un file
          const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
          const url = `${supabaseUrl}/storage/v1/object/public/allegati/${fullPath}`;
          if (!dbUrls.has(url)) {
            files.push({
              id: item.id || fullPath,
              fileName: item.name,
              fileUrl: url,
              fileType: item.metadata?.mimetype || '',
              createdAt: item.created_at || null,
              descrizione: prefix ? `Cartella: ${prefix}` : '(storage non collegato)',
              _categoria: 'storage_orphan', _isOrphan: true,
            });
          }
        } else {
          // è una cartella — scendi ricorsivamente
          const subPath = prefix ? `${prefix}/${item.name}` : item.name;
          const sub = await listAll(subPath);
          files.push(...sub);
        }
      }
      return files;
    }

    listAll('').then(function(orphans) {
      setStorageOrphans(orphans);
      setScanningStorage(false);
    }).catch(function() { setScanningStorage(false); });
  }, [allegatiLezioni.length]);

  const allegatiAll = [...allegati, ...storageOrphans];

  const [sortKeyAl, sortDirAl, handleSortAl, sortFnAl] = useSortable("createdAt", "desc");

  const corsiList   = [...new Set(allegatiAll.map(a=>a.corso).filter(Boolean))].sort();
  const allieviList = [...new Set(allegatiLezioni.map(a=>a.allievoNome||a.allievoId).filter(Boolean))].sort();

  const filtered = allegatiAll.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q || (a.fileName||"").toLowerCase().includes(q) || (a.descrizione||"").toLowerCase().includes(q);
    const matchC = !fCorso   || a.corso === fCorso;
    const matchA = !fAllievo || (a.allievoNome||a.allievoId) === fAllievo;
    const matchT = !fTipo    || a._categoria === fTipo;
    return matchQ && matchC && matchA && matchT;
  });

  const sortedAl = sortFnAl(filtered, (a, k) => {
    if (k === "fileName")    return a.fileName || "";
    if (k === "descrizione") return a.descrizione || "";
    if (k === "corso")       return a.corso || "";
    if (k === "allievoNome") return a.allievoNome || a.allievoId || "";
    if (k === "createdAt")   return a.createdAt || "";
    return a[k] || "";
  });

  const getLessonLabel = (lessonId) => {
    const l = lessons.find(x=>x.id===lessonId);
    if (!l) return lessonId || "—";
    return `${l.date} ${l.hour||""} · ${l.student||""}`;
  };

  return (
    React.createElement(React.Fragment, null
    , React.createElement('div', { style: {padding:"28px 32px", maxWidth:1100, margin:"0 auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 0}}
      , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24}}
        , React.createElement('div', null
          , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif", fontWeight:600, fontSize:26, letterSpacing:"0.02em", color:C.text}}, "Allegati")
          , React.createElement('p', { style: {fontSize:13, color:C.textMuted, marginTop:4}}, allegatiAll.length, " allegati totali (", allegatiLezioni.length, " lezioni · ", allegatiBrani.length, " brani", storageOrphans.length > 0 ? ` · ${storageOrphans.length} storage non collegati` : "", ")")
        )
        , React.createElement(RefreshBtn)
      )
      , React.createElement('div', { style: {display:"flex", gap:12, marginBottom:20, flexWrap:"wrap"}}
        , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
          placeholder: "Cerca per nome file o descrizione...",
          style: {flex:"1 1 220px", padding:"10px 14px", borderRadius:10, border:`1px solid ${C.border}`,
            background:C.surface, color:C.text, fontSize:13, fontFamily:"'Open Sans',sans-serif",
            outline:"none"}})
        , React.createElement('select', { value: fCorso, onChange: e=>setFCorso(e.target.value),
          style: {padding:"10px 14px", borderRadius:10, border:`1px solid ${C.border}`,
            background:C.surface, color:fCorso?C.text:C.textMuted, fontSize:13, fontFamily:"'Open Sans',sans-serif", cursor:"pointer"}}
          , React.createElement('option', {value:""}, "Tutti gli strumenti")
          , corsiList.map(c=>React.createElement('option', {key:c,value:c}, c))
        )
        , React.createElement('select', { value: fTipo, onChange: e=>setFTipo(e.target.value),
          style: {padding:"10px 14px", borderRadius:10, border:`1px solid ${C.border}`,
            background:C.surface, color:fTipo?C.text:C.textMuted, fontSize:12,
            fontFamily:"'Open Sans',sans-serif", outline:"none"}}
          , React.createElement('option', {value:""}, "Tutti i tipi")
          , React.createElement('option', {value:"lezione"}, "📁 Allegati lezione")
          , React.createElement('option', {value:"spartito"}, "🎼 Spartiti")
          , React.createElement('option', {value:"file_brano"}, "🎵 File brani")
          , storageOrphans.length > 0 && React.createElement('option', {value:"storage_orphan"}, `⚠️ Storage non collegati (${storageOrphans.length})`)
        )
        , React.createElement('select', { value: fAllievo, onChange: e=>setFAllievo(e.target.value),
          style: {padding:"10px 14px", borderRadius:10, border:`1px solid ${C.border}`,
            background:C.surface, color:fAllievo?C.text:C.textMuted, fontSize:13, fontFamily:"'Open Sans',sans-serif", cursor:"pointer"}}
          , React.createElement('option', {value:""}, "Tutti gli allievi")
          , allieviList.map(a=>React.createElement('option', {key:a,value:a}, a))
        )
      )
      , filtered.length === 0
        ? React.createElement('div', { style: {textAlign:"center", padding:"60px 0", color:C.textMuted}}
          , React.createElement(Ic, {n:"paperclip", size:32, stroke:C.border})
          , React.createElement('p', {style:{marginTop:12, fontSize:14}}, "Nessun allegato trovato")
          , React.createElement('p', {style:{fontSize:12, color:C.textDim, marginTop:4}}, "Gli allegati vengono aggiunti nelle lezioni")
        )
        : React.createElement('div', { style: {overflowX:"auto", WebkitOverflowScrolling:"touch", borderRadius:14, border:`1px solid ${C.border}`}}
          , React.createElement('table', { style: {width:"100%", borderCollapse:"collapse", minWidth:680}}
            , React.createElement('thead', null
              , React.createElement('tr', { style: {background:C.bg, borderBottom:`1px solid ${C.border}`}}
                , React.createElement(SortTh, {label:"Allegato",    sortKey:"fileName",    currentKey:sortKeyAl, dir:sortDirAl, onSort:handleSortAl})
                , React.createElement(SortTh, {label:"Descrizione", sortKey:"descrizione", currentKey:sortKeyAl, dir:sortDirAl, onSort:handleSortAl})
                , React.createElement(SortTh, {label:"Strumento",   sortKey:"corso",       currentKey:sortKeyAl, dir:sortDirAl, onSort:handleSortAl})
                , React.createElement(SortTh, {label:"Lezione",     sortKey:null,          currentKey:sortKeyAl, dir:sortDirAl, onSort:handleSortAl})
                , React.createElement(SortTh, {label:"Allievo",     sortKey:"allievoNome", currentKey:sortKeyAl, dir:sortDirAl, onSort:handleSortAl})
                , React.createElement('th', {style:{padding:"10px 16px"}})
              )
            )
            , React.createElement('tbody', null
              , sortedAl.map((a,i)=>(
                React.createElement('tr', { key: a.id||i, style: {borderBottom:`1px solid ${C.border}`, transition:"background 0.1s"},
                  onMouseEnter: e=>e.currentTarget.style.background=C.bg,
                  onMouseLeave: e=>e.currentTarget.style.background="transparent"}
                  , React.createElement('td', { style: {padding:"12px 16px"}}
                    , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8}}
                      , React.createElement('div', { style: {width:32, height:32, borderRadius:8, background:C.blueBg, border:`1px solid ${C.blueBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}
                        , React.createElement(Ic, {n:"paperclip", size:14, stroke:C.blue})
                      )
                      , React.createElement('div', null
                        , a.fileUrl
                          ? React.createElement('a', { href:a.fileUrl, target:"_blank", rel:"noopener noreferrer",
                              style:{fontSize:13, fontWeight:500, color:C.blue, textDecoration:"none",
                                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block", maxWidth:200}}, a.fileName||"File")
                          : React.createElement('span', {style:{fontSize:13,fontWeight:500,color:C.text}}, a.fileName||"File")
                      )
                    )
                  )
                  , React.createElement('td', { style: {padding:"12px 16px", fontSize:13, color:C.textMuted}}, a.descrizione||"—")
                  , React.createElement('td', { style: {padding:"12px 16px"}}
                    , a.corso ? React.createElement('span', {style:{fontSize:12, padding:"3px 8px", borderRadius:20, background:C.blueBg, color:C.blue, border:`1px solid ${C.blueBorder}`, fontWeight:500}}, a.corso) : React.createElement('span',{style:{color:C.textDim}},"—")
                  )
                  , React.createElement('td', { style: {padding:"12px 16px", fontSize:12, color:C.textMuted}}, getLessonLabel(a.lezioneId))
                  , React.createElement('td', { style: {padding:"12px 16px", fontSize:13, color:C.text}}, a.allievoNome||a.allievoId||"—")
                  , React.createElement('td', { style: {padding:"12px 16px"}}
                    , React.createElement('div',{style:{display:'flex',gap:6,alignItems:'center'}}
                      , a.fileUrl && React.createElement('a', { href:a.fileUrl, target:"_blank", rel:"noopener noreferrer",
                          style:{display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.blue, textDecoration:"none",
                            padding:"5px 9px", borderRadius:7, border:`1px solid ${C.blueBorder}`, background:C.blueBg}}
                          , React.createElement(Ic, {n:"download", size:12, stroke:C.blue}), "Apri"
                        )
                      , a._categoria==='lezione' && React.createElement('button',{onClick:()=>{setEditAllegato(a);setEditAllegatoDesc(a.descrizione||'');},
                          style:{display:'flex',alignItems:'center',gap:4,fontSize:12,padding:'5px 9px',borderRadius:7,
                            border:`1px solid ${C.border}`,background:C.bg,color:C.text,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}}
                          , React.createElement(Ic,{n:'edit',size:11,stroke:C.text}), 'Modifica'
                        )
                      , React.createElement('button',{onClick:()=>setConfirmDelAll(a),
                          style:{display:'flex',alignItems:'center',gap:4,fontSize:12,padding:'5px 9px',borderRadius:7,
                            border:`1px solid ${C.redBorder}`,background:C.redBg,color:C.red,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}}
                          , React.createElement(Ic,{n:'trash',size:11,stroke:C.red}), 'Elimina'
                        )
                    )
                  )
                )
              ))
            )
          )
        )

      /* ── Modal conferma eliminazione allegato (inline, non globale) ── */
      , confirmDelAll && React.createElement('div',{style:{position:'fixed',inset:0,zIndex:9000,background:'rgba(0,0,0,0.78)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center'}}
          , React.createElement('div',{style:{background:C.surface,borderRadius:14,padding:'24px 28px',maxWidth:400,width:'90%',border:`1px solid ${C.border}`,boxShadow:'0 24px 80px rgba(0,0,0,0.6)'}}
            , React.createElement('h3',{style:{fontFamily:"'Oswald',sans-serif",fontSize:20,marginBottom:8,color:C.red}},'Elimina allegato')
            , React.createElement('p',{style:{fontSize:13,color:C.textMuted,marginBottom:20}},'Eliminare "',confirmDelAll.fileName,'"? Questa azione non è reversibile.')
            , React.createElement('div',{style:{display:'flex',gap:10,justifyContent:'flex-end'}}
              , React.createElement('button',{onClick:()=>setConfirmDelAll(null),style:{padding:'9px 18px',borderRadius:9,border:`1px solid ${C.border}`,background:'none',color:C.text,fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}},'Annulla')
              , React.createElement('button',{onClick:()=>handleDeleteAllegato(confirmDelAll),style:{padding:'9px 18px',borderRadius:9,border:'none',background:C.red,color:'#fff',fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",fontWeight:600}},'Elimina')
            )
          )
        )

      /* ── Modal modifica descrizione allegato (inline) ── */
      , editAllegato && React.createElement('div',{style:{position:'fixed',inset:0,zIndex:9000,background:'rgba(0,0,0,0.78)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center'}}
          , React.createElement('div',{style:{background:C.surface,borderRadius:14,padding:'24px 28px',maxWidth:440,width:'90%',border:`1px solid ${C.border}`,boxShadow:'0 24px 80px rgba(0,0,0,0.6)'}}
            , React.createElement('h3',{style:{fontFamily:"'Oswald',sans-serif",fontSize:20,marginBottom:16}},'Modifica allegato')
            , React.createElement('label',{style:{fontSize:11,color:C.textMuted,letterSpacing:'0.07em',textTransform:'uppercase',display:'block',marginBottom:6}},'Descrizione')
            , React.createElement('input',{type:'text',autoFocus:true,value:editAllegatoDesc,
                onChange:e=>setEditAllegatoDesc(e.target.value),
                style:{width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:13,fontFamily:"'Open Sans',sans-serif",outline:'none',boxSizing:'border-box',marginBottom:18}})
            , React.createElement('div',{style:{display:'flex',gap:10,justifyContent:'flex-end'}}
              , React.createElement('button',{onClick:()=>setEditAllegato(null),style:{padding:'9px 18px',borderRadius:9,border:`1px solid ${C.border}`,background:'none',color:C.text,fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif"}},'Annulla')
              , React.createElement('button',{onClick:async()=>{
                    if(propSetAllegati) propSetAllegati(p=>p.map(x=>x.id===editAllegato.id?{...x,descrizione:editAllegatoDesc}:x));
                    const sb2=window.supabaseClient;
                    if(sb2){ const {error}=await sb2.from('allegati').update({descrizione:editAllegatoDesc}).eq('id',editAllegato.id); if(error) console.warn('[FM] edit allegato:',error.message); }
                    setEditAllegato(null);
                  },style:{padding:'9px 18px',borderRadius:9,border:'none',background:C.gold,color:'#0d1f4a',fontSize:13,cursor:'pointer',fontFamily:"'Open Sans',sans-serif",fontWeight:700}},'Salva')
            )
          )
        )
    )
    )
    ) // close Fragment
};

const UtentiView = ({ students:propStudents, docenti:propDocenti }) => {
  const isMobile = useIsMobile();
  const allStudents = propStudents || [];
  const allDocenti  = propDocenti  || [];
  const [utenti,    setUtenti]    = useState(INIT_UTENTI);
    const [richieste, setRichieste] = useState(INIT_RICHIESTE);
    const [tab,       setTab]       = useState("utenti");
    const [search,    setSearch]    = useState("");
    const [filterRuolo,setFR]       = useState("");
    const [filterStato,setFS]       = useState("");
    const [drawerUtente, setDrawer] = useState(null);
    const [modal,     setModal]     = useState(null);  // "invita" | "richiesta" | "confirm_sospendi" | "confirm_elimina"
    const [selReq,    setSelReq]    = useState(null);
    const [selUtente, setSelUtente] = useState(null);
    const [toast,     setToast]     = useState(null);
    const [saving,    setSaving]    = useState(false);

    // Carica dati reali da Supabase al mount
    useEffect(()=>{
      if(!window.FM_AUTH) return;
      (async()=>{
        try {
          const [profili, richiesteLive] = await Promise.all([
            window.FM_AUTH.getProfili(),
            window.FM_AUTH.getRichieste(),
          ]);
          if(profili.length>0){
            setUtenti(profili.map(p=>({
              id:           p.id,
              nome:         p.nome,
              email:        p.email,
              ruolo:        p.ruolo,
              stato:        p.stato||'attivo',
              avatar:       p.nome.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(),
              iscritto:     p.created_at?.split("T")[0]||'',
              ultimoAccesso:p.updated_at?.split("T")[0]||null,
              permessi:     {...(PERM_DEFAULT[p.ruolo]||{})},
              note:         p.note||'',
              docenteId:    p.docente_id||null,
              allievoId:    p.allievo_id||null,
            })));
          }
          if(richiesteLive.length>0){
            setRichieste(richiesteLive.map(r=>({
              id:       r.id,
              nome:     r.nome,
              email:    r.email,
              ruolo:    r.ruolo||'allievo',
              messaggio:r.messaggio||'',
              data:     r.created_at?.split("T")[0]||'',
            })));
          } else {
            setRichieste([]);
          }
        } catch(ex){ console.warn('[UtentiView] caricamento fallito:', ex.message); }
      })();
    },[]);

    const closeModal=()=>{setModal(null);setSelReq(null);setSelUtente(null);};
  
    const showToast=(msg,hex=C.green)=>{
      setToast({msg,hex});
      setTimeout(()=>setToast(null),3000);
    };
  
    // ── Metriche ──
    const totAttivi   = utenti.filter(u=>u.stato==="attivo").length;
    const totSospesi  = utenti.filter(u=>u.stato==="sospeso").length;
    const totInvitati = utenti.filter(u=>u.stato==="invitato").length;
    const totAttesa   = richieste.length;
  
    // ── Filtri ──
    const filtrati = useMemo(()=>utenti.filter(u=>{
      const q=search.toLowerCase();
      return (!q||u.nome.toLowerCase().includes(q)||u.email.toLowerCase().includes(q))
        &&(!filterRuolo||u.ruolo===filterRuolo)
        &&(!filterStato||u.stato===filterStato);
    }),[utenti,search,filterRuolo,filterStato]);
  
    // ── CRUD ──
    const salvaUtente=(draft)=>{
      setUtenti(p=>p.map(u=>u.id===draft.id?{...draft}:u));
      setDrawer(null);
      // Salva su Supabase in modo affidabile
      (async()=>{
        const sb = window.supabaseClient;
        if (!sb) { showToast(`${draft.nome} aggiornato (offline)`); return; }
        // Normalizza gli ID: potrebbero essere stringhe da <select>
        const docenteIdVal = draft.docenteId ? (isNaN(Number(draft.docenteId)) ? draft.docenteId : Number(draft.docenteId)) : null;
        const allievoIdVal = draft.allievoId ? (isNaN(Number(draft.allievoId)) ? draft.allievoId : Number(draft.allievoId)) : null;
        const { error } = await sb.from('profili').update({
          nome:       draft.nome,
          ruolo:      draft.ruolo,
          note:       draft.note||null,
          docente_id: docenteIdVal,
          allievo_id: allievoIdVal,
          updated_at: new Date().toISOString(),
        }).eq('id', draft.id);
        if (error) {
          console.warn('[FM] salvaUtente error:', error.message);
          showToast(`Errore salvataggio: ${error.message}`, C.red);
        } else {
          showToast(`${draft.nome} aggiornato ✓`, C.green);
        }
      })();
    };
    const sospendiUtente=(u)=>{
      const nuovoStato=u.stato==="sospeso"?"attivo":"sospeso";
      setSaving(true);
      (async()=>{
        try {
          if(window.FM_AUTH) await window.FM_AUTH.sospendiUtente({userId:u.id,sospendi:nuovoStato==="sospeso"});
          setUtenti(p=>p.map(x=>x.id===u.id?{...x,stato:nuovoStato}:x));
          setDrawer(null); closeModal();
          showToast(`${u.nome} ${nuovoStato==="sospeso"?"sospeso":"riattivato"}`,nuovoStato==="sospeso"?C.orange:C.green);
        } catch(ex){ showToast(`Errore: ${ex.message}`,C.red); }
        finally { setSaving(false); }
      })();
    };
    const eliminaUtente=(u)=>{
      setSaving(true);
      (async()=>{
        try {
          if(window.FM_AUTH) await window.FM_AUTH.eliminaUtente({userId:u.id});
          setUtenti(p=>p.filter(x=>x.id!==u.id));
          setDrawer(null); closeModal();
          showToast(`${u.nome} eliminato`,C.red);
        } catch(ex){ showToast(`Errore: ${ex.message}`,C.red); }
        finally { setSaving(false); }
      })();
    };
    const approvaRichiesta=(req,ruolo)=>{
      setSaving(true);
      (async()=>{
        try {
          if(window.FM_AUTH){
            await window.FM_AUTH.approvaRichiesta({richiestaId:req.id,nome:req.nome,email:req.email,ruolo});
          }
          const nuovo={id:uid(),nome:req.nome,email:req.email,ruolo,stato:"invitato",
            avatar:req.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),
            iscritto:new Date().toISOString().split("T")[0],
            ultimoAccesso:null,permessi:{...PERM_DEFAULT[ruolo]},note:""};
          setUtenti(p=>[...p,nuovo]);
          setRichieste(p=>p.filter(r=>r.id!==req.id));
          closeModal();
          showToast(`${req.nome} approvato — invito inviato a ${req.email}`);
        } catch(ex){
          showToast(`Errore: ${ex.message}`,C.red);
        } finally { setSaving(false); }
      })();
    };
    const rifiutaRichiesta=(req)=>{
      setSaving(true);
      (async()=>{
        try {
          if(window.FM_AUTH) await window.FM_AUTH.rifiutaRichiesta({richiestaId:req.id});
          setRichieste(p=>p.filter(r=>r.id!==req.id));
          closeModal();
          showToast(`Richiesta di ${req.nome} rifiutata`,C.orange);
        } catch(ex){ showToast(`Errore: ${ex.message}`,C.red); }
        finally { setSaving(false); }
      })();
    };
    const invitaUtente=(f)=>{
      setSaving(true);
      (async()=>{
        try {
          if(window.FM_AUTH){
            // Crea una richiesta fittizia e approvala subito (flusso admin diretto)
            await window.FM_AUTH.approvaRichiesta({richiestaId:null,nome:f.nome,email:f.email,ruolo:f.ruolo});
          }
          const nuovo={id:uid(),nome:f.nome,email:f.email,ruolo:f.ruolo,stato:"invitato",
            avatar:f.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),
            iscritto:new Date().toISOString().split("T")[0],ultimoAccesso:null,
            permessi:{...PERM_DEFAULT[f.ruolo]},note:""};
          setUtenti(p=>[...p,nuovo]);
          closeModal();
          showToast(`Invito inviato a ${f.email}`,C.blue);
        } catch(ex){ showToast(`Errore: ${ex.message}`,C.red); }
        finally { setSaving(false); }
      })();
    };
  
    return(
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9584}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9585}}

          /* ── BARRA MODULO ── */
          , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"0 clamp(12px,3vw,24px)",display:"flex",alignItems:"center",
            height:52,flexShrink:0,gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9588}}
            , React.createElement(Ic, { n: "shield", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9591}})
            , React.createElement('span', { style: {fontFamily:"'Oswald',sans-serif",fontSize:15,fontWeight:600,color:C.gold,letterSpacing:"0.04em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9592}}, "Utenti")
            , React.createElement('div', { style: {marginLeft:"auto",display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9593}}
              , React.createElement(RefreshBtn)
              , React.createElement(Btn, { onClick: ()=>setModal("invita"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9594}}
                , React.createElement(Ic, { n: "plus", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9595}}), "Invita utente"
              )
            )
          )

          /* ── PAGE HEADER ── */
          , React.createElement('div', { style: {background:`linear-gradient(135deg,${C.surface} 0%,${C.bg} 100%)`,
            borderBottom:`1px solid ${C.border}`,padding:"16px 20px",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9601}}
            , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9603}}
              , React.createElement('div', { style: {animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9604}}
                , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:300,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9605}}, "Gestione "
                   , React.createElement('span', { style: {fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9606}}, "Utenti")
                )
                , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9608}}, "Accessi, ruoli e permessi per l'area riservata"

                )
              )
              /* KPI rapide */
              , React.createElement('div', { style: {display:"flex",gap:12,animation:"fadeUp .4s ease .1s both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9613}}
                , [
                  {label:"Attivi",    val:totAttivi,   hex:C.green},
                  {label:"In attesa", val:totAttesa,   hex:C.orange},
                  {label:"Invitati",  val:totInvitati, hex:C.blue},
                  {label:"Sospesi",   val:totSospesi,  hex:C.red},
                ].map(k=>(
                  React.createElement('div', { key: k.label, style: {padding:"10px 16px",background:C.surface,
                    border:`1px solid ${C.border}`,borderRadius:10,textAlign:"center",minWidth:72}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9620}}
                    , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:600,color:k.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9622}}, k.val)
                    , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9623}}, k.label)
                  )
                ))
              )
            )
          )

          /* ── BODY ── */
          , React.createElement('div', { style: {flex:1,padding:isMobile?"12px":"20px 24px",overflow:"auto",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9631}}

            /* Sub-tabs */
            , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9634}}
              , [["utenti","users","Utenti",""],
                ["richieste","mail","Richieste",richieste.length>0?richieste.length:null]
              ].map(([v,ic,lb,badge])=>(
                React.createElement('button', { key: v, onClick: ()=>setTab(v),
                  style: {display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,
                    background:tab===v?C.goldBg:"none",border:`1px solid ${tab===v?C.goldDim:C.border}`,
                    cursor:"pointer",fontSize:13,color:tab===v?C.gold:C.textMuted,
                    fontFamily:"'Open Sans',sans-serif",transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9638}}
                  , React.createElement(Ic, { n: ic, size: 14, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9643}}), lb
                  , badge!=null&&(
                    React.createElement('span', { style: {background:C.orange,color:"#ffffff",borderRadius:"10px",
                      padding:"1px 7px",fontSize:10,fontWeight:700,marginLeft:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9645}}, badge)
                  )
                )
              ))
            )

            /* ── TAB UTENTI ── */
            , tab==="utenti"&&(
              React.createElement(React.Fragment, null
                /* Filtri */
                , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9656}}
                  , React.createElement('div', { style: {position:"relative",flex:"1 1 220px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9657}}
                    , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9658}}
                      , React.createElement(Ic, { n: "search", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9659}})
                    )
                    , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
                      placeholder: "Cerca per nome o email..."    ,
                      style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.text,fontSize:13,padding:"9px 12px 9px 34px",fontFamily:"'Open Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9661}})
                  )
                  , React.createElement('select', { value: filterRuolo, onChange: e=>setFR(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterRuolo?C.goldDim:C.border}`,
                      borderRadius:8,color:filterRuolo?C.gold:C.textMuted,fontSize:13,
                      padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9666}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9670}}, "Tutti i ruoli"  )
                    , RUOLI.map(r=>React.createElement('option', { key: r.id, value: r.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9671}}, r.label))
                  )
                  , React.createElement('select', { value: filterStato, onChange: e=>setFS(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterStato?C.goldDim:C.border}`,
                      borderRadius:8,color:filterStato?C.gold:C.textMuted,fontSize:13,
                      padding:"9px 12px",fontFamily:"'Open Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9673}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9677}}, "Tutti gli stati"  )
                    , STATI.map(s=>React.createElement('option', { key: s.id, value: s.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9678}}, s.label))
                  )
                  , (search||filterRuolo||filterStato)&&(
                    React.createElement('button', { onClick: ()=>{setSearch("");setFR("");setFS("");},
                      style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.textMuted,fontSize:12,padding:"9px 12px",cursor:"pointer",
                        fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:5,
                        transition:"all .12s"},
                      onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                      onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9681}}
                      , React.createElement(Ic, { n: "x", size: 12, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9688}}), "Azzera"
                    )
                  )
                  , React.createElement('span', { style: {fontSize:12,color:C.textDim,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9691}}, filtrati.length, " utenti" )
                )

                /* Tabella */
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9695}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2.5fr 1.6fr 1.2fr 1.2fr 1.6fr auto",minWidth:520,
                    padding:"9px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9696}}
                    , ["Utente","Email","Ruolo","Stato","Ultimo accesso",""].map(h=>(
                      React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9699}}, h)
                    ))
                  )
                  , filtrati.length===0&&(
                    React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9703}}, "Nessun utente trovato"

                    )
                  )
                  , filtrati.map((u,i)=>{
                    const r=ruoloById(u.ruolo);
                    const oraFa=(d)=>{
                      if(!d) return "Mai";
                      const diff=Math.floor((new Date()-new Date(d))/60000);
                      if(diff<60) return `${diff}min fa`;
                      if(diff<1440) return `${Math.floor(diff/60)}h fa`;
                      return fmt_ts(d);
                    };
                    return(
                      React.createElement('div', { key: u.id, className: "row-anim hover-row" ,
                        onClick: ()=>setDrawer(u),
                        style: {display:"grid",gridTemplateColumns:"2.5fr 1.6fr 1.2fr 1.2fr 1.6fr auto",minWidth:520,
                          padding:"13px 20px",borderBottom:i<filtrati.length-1?`1px solid ${C.border}20`:"none",
                          alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9717}}
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:11}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9722}}
                          , React.createElement(Avatar, { initials: u.avatar, hex: r.hex, size: 34, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9723}})
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9724}}
                            , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9725}}, u.nome)
                            , u.note&&React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1,
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9726}}, u.note)
                          )
                        )
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                          paddingRight:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9730}}, u.email)
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9732}}, React.createElement(RuoloBadge, { ruolo: u.ruolo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9732}}))
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9733}}, React.createElement(Badge, { stato: u.stato, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9733}}))
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9734}}
                          , u.stato==="attivo"&&(
                            React.createElement('span', { style: {width:6,height:6,borderRadius:"50%",background:C.green,
                              animation:u.ultimoAccesso&&new Date()-new Date(u.ultimoAccesso)<3600000?"pulse 2s infinite":undefined,
                              display:"inline-block",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9736}})
                          )
                          , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9740}}, oraFa(u.ultimoAccesso))
                        )
                        , React.createElement(Ic, { n: "right", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9742}})
                      )
                    );
                  })
                )
              )
            )

            /* ── TAB RICHIESTE ── */
            , tab==="richieste"&&(
              React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9752}}
                , richieste.length===0&&(
                  React.createElement('div', { style: {background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,
                    padding:"16px 20px",display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9754}}
                    , React.createElement(Ic, { n: "check", size: 16, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9756}})
                    , React.createElement('span', { style: {fontSize:13,color:C.green,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9757}}, "Nessuna richiesta in sospeso"   )
                  )
                )
                , richieste.map((req,i)=>{
                  const r=ruoloById(req.ruolo);
                  return(
                    React.createElement('div', { key: req.id, className: "row-anim",
                      style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                        overflow:"hidden",animationDelay:`${i*0.07}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9763}}
                      , React.createElement('div', { style: {padding:"16px 20px",display:"flex",gap:14,alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9766}}
                        , React.createElement(Avatar, { initials: req.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(), hex: r.hex, size: 44, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9767}})
                        , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9768}}
                          , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9769}}
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9770}}
                              , React.createElement('div', { style: {fontSize:15,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9771}}, req.nome)
                              , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9772}}, req.email)
                            )
                            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9774}}
                              , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9775}}, fmt_data(req.data))
                              , React.createElement(RuoloBadge, { ruolo: req.ruolo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9776}})
                            )
                          )
                          , React.createElement('div', { style: {marginTop:10,padding:"10px 14px",background:C.bg,
                            borderRadius:8,border:`1px solid ${C.border}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9779}}
                            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,lineHeight:1.55}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9781}}, req.messaggio)
                          )
                        )
                      )
                      , React.createElement('div', { style: {padding:"12px 20px",borderTop:`1px solid ${C.border}20`,
                        display:"flex",justifyContent:"flex-end",gap:8,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9785}}
                        , React.createElement(Btn, { small: true, danger: true, onClick: ()=>{setSelReq(req);setModal("confirm_rifiuta");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9787}}
                          , React.createElement(Ic, { n: "x", size: 12, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9788}}), "Rifiuta"
                        )
                        , React.createElement(Btn, { small: true, variant: "secondary", onClick: ()=>{setSelReq(req);setModal("richiesta");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9790}}
                          , React.createElement(Ic, { n: "user", size: 12, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9791}}), "Esamina"
                        )
                        , React.createElement(Btn, { small: true, onClick: ()=>approvaRichiesta(req,req.ruolo), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9793}}
                          , React.createElement(Ic, { n: "check", size: 12, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9794}}), "Approva come "  , ruoloById(req.ruolo).label
                        )
                      )
                    )
                  );
                })
              )
            )
          )
        )

        /* ── DRAWER UTENTE ── */
        , drawerUtente&&(
          React.createElement(UtenteDrawer, {
            utente: drawerUtente,
            onClose: ()=>setDrawer(null),
            onSave: salvaUtente,
            isCurrentAdmin: true,
            students: allStudents,
            docenti: allDocenti,
            onSospendi: u=>{setSelUtente(u);setModal("confirm_sospendi");},
            onElimina: u=>{setSelUtente(u);setModal("confirm_elimina");}
          })
        )

        /* ── MODALI ── */
        , modal==="invita"&&React.createElement(InvitaModal, { onInvita: invitaUtente, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9818}})
        , modal==="richiesta"&&selReq&&(
          React.createElement(RichiestaModal, { richiesta: selReq, onApprova: approvaRichiesta, onRifiuta: r=>{rifiutaRichiesta(r);closeModal();}, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9820}})
        )
        , modal==="confirm_sospendi"&&selUtente&&(
          React.createElement(ConfirmDel, {
            title: selUtente.stato==="sospeso"?"Riattiva account":"Sospendi account",
            testo: selUtente.stato==="sospeso"
              ?`Riattivare l'account di ${selUtente.nome}? Potrà accedere di nuovo all'area riservata.`
              :`Sospendere l'account di ${selUtente.nome}? Non potrà più accedere finché non viene riattivato.`,
            onConfirm: ()=>sospendiUtente(selUtente),
            onClose: closeModal,
            danger: selUtente.stato!=="sospeso", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9823}}
          )
        )
        , modal==="confirm_elimina"&&selUtente&&(
          React.createElement(ConfirmDel, {
            title: "Elimina utente" ,
            testo: `Eliminare definitivamente l'account di ${selUtente.nome}? L'operazione è irreversibile.`,
            onConfirm: ()=>eliminaUtente(selUtente),
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9834}}
          )
        )
        , modal==="confirm_rifiuta"&&selReq&&(
          React.createElement(ConfirmDel, {
            title: "Rifiuta richiesta" ,
            testo: `Rifiutare la richiesta di accesso di ${selReq.nome}?`,
            onConfirm: ()=>{rifiutaRichiesta(selReq);closeModal();},
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9842}}
          )
        )

        /* ── TOAST ── */
        , toast&&(
          React.createElement('div', { style: {position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:400,
            background:C.surface,border:`1px solid ${toast.hex}40`,borderLeft:`3px solid ${toast.hex}`,
            borderRadius:10,padding:"11px 18px",display:"flex",alignItems:"center",gap:10,
            animation:"fadeUp .25s ease",boxShadow:"0 8px 32px rgba(0,0,0,.5)",
            fontFamily:"'Open Sans',sans-serif",fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9852}}
            , React.createElement(Ic, { n: "check", size: 14, stroke: toast.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9857}})
            , React.createElement('span', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9858}}, toast.msg)
          )
        )
      )
    );
};






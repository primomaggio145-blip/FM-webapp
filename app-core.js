var _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN
const { useState, useEffect, useMemo } = React;

// ═══════════════════════════════════════════════════════════════════════════════
// TEMA CONDIVISO
// ═══════════════════════════════════════════════════════════════════════════════
const C = {
  bg:"#f4f6fa", surface:"#ffffff", surfaceHover:"#eef2f9", surface2:"#e8edf5",
  border:"#d0d9eb", borderHover:"#a8b9d8",
  gold:"#1a4fa0", goldDim:"#123a7a", goldBg:"#e8edf5", goldLight:"#2e69c4",
  text:"#111827", textMuted:"#6b7280", textDim:"#9ca3af",
  green:"#15803d", greenBg:"#f0fdf4", greenBorder:"#bbf7d0",
  red:"#8c1818",  redBg:"#fff5f5",   redBorder:"#fca5a5",
  blue:"#1a4fa0", blueBg:"#eff6ff",  blueBorder:"#bfdbfe",
  orange:"#c2410c",orangeBg:"#fff7ed",orangeBorder:"#fed7aa",
  purple:"#6d28d9",purpleBg:"#f5f3ff",purpleBorder:"#c4b5fd",
  teal:"#0e7490", tealBg:"#f0f9ff",  tealBorder:"#a5f3fc",
  orange2:"#b45309", orange2Bg:"#fffbeb", orange2Border:"#fde68a",
  // Sidebar specific
  sidebar:"#1a4fa0", sidebarActive:"#123a7a", sidebarText:"rgba(255,255,255,0.85)", sidebarActiveTxt:"#ffffff",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;1,400&family=Open+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;background:${C.bg};}
  body{color:${C.text};font-family:'Open Sans',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:${C.bg};}
  ::-webkit-scrollbar-thumb{background:${C.goldDim};border-radius:2px;}
  input::placeholder,textarea::placeholder{color:${C.textDim};}
  input:focus,textarea:focus,select:focus{outline:none;}

  @keyframes fadeUp   {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
  @keyframes overlayIn{from{opacity:0}to{opacity:1}}
  @keyframes slideIn  {from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideDrawer{from{transform:translateX(100%)}to{transform:translateX(0)}}
  @keyframes pulse    {0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes tick     {from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
  @keyframes slideR   {from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes spin     {to{transform:rotate(360deg)}}
  @keyframes countUp  {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatA   {0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(1deg)}}
  @keyframes floatB   {0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(-1.5deg)}}
  @keyframes floatC   {0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}

  .kpi-card{animation:fadeUp 0.5s ease both;}
  .kpi-card:nth-child(1){animation-delay:0.05s}
  .kpi-card:nth-child(2){animation-delay:0.10s}
  .kpi-card:nth-child(3){animation-delay:0.15s}
  .kpi-card:nth-child(4){animation-delay:0.20s}
  .kpi-card:nth-child(5){animation-delay:0.25s}
  .section{animation:fadeUp 0.6s ease both;}
  .section:nth-child(1){animation-delay:0.25s}
  .section:nth-child(2){animation-delay:0.35s}
  .section:nth-child(3){animation-delay:0.45s}
  .alert-row{animation:slideR 0.35s ease both;}
  .hover-row{cursor:pointer;transition:background 0.12s;}
  .hover-row:hover{background:${C.surfaceHover}!important;}
  .lesson-row{transition:background 0.12s;}
  .lesson-row:hover{background:${C.surfaceHover}!important;}
  .bar-fill{animation:tick 0.6s cubic-bezier(.4,0,.2,1) both;}
  .nav-btn{transition:all 0.15s;}
  .nav-btn:hover{background:${C.surfaceHover}!important;}
  .quick-action{transition:all 0.18s;}
  .quick-action:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.4);}
  .btn-gold{transition:all .18s;}
  .btn-gold:hover{filter:brightness(1.12);transform:translateY(-1px);}
  .st1{animation:fadeUp .5s ease both}
  .st2{animation:fadeUp .5s .1s ease both}
  .st3{animation:fadeUp .5s .2s ease both}
  .st4{animation:fadeUp .5s .3s ease both}
  .st5{animation:fadeUp .5s .4s ease both}
  .inp:focus-within label{color:${C.gold}!important;}
  .inp:focus-within div{border-color:${C.goldDim}!important;}
  /* ── RESPONSIVE ── */

  /* layout grids (desktop defaults) */
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .stat-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  .stat-strip-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .form-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .form-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
  .cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .week-grid{overflow-x:auto;-webkit-overflow-scrolling:touch;}

  @media (max-width:767px){
    /* navigation */
    .sidebar-desktop{display:none!important;}
    .bottom-nav{display:flex!important;}
    .login-left-panel{display:none!important;}
    .hide-mobile{display:none!important;}

    /* modal */
    .modal-wide{max-width:calc(100vw - 16px)!important;width:calc(100vw - 16px)!important;margin:8px!important;border-radius:14px!important;}

    /* toolbar */
    .cal-toolbar{flex-wrap:wrap!important;gap:8px!important;}
    .cal-toolbar-right{flex-wrap:wrap!important;gap:6px!important;}
    .toolbar-wrap{flex-wrap:wrap!important;gap:8px!important;}

    /* grids */
    .info-grid{grid-template-columns:1fr!important;}
    .stat-strip{grid-template-columns:1fr 1fr!important;}
    .stat-strip-3{grid-template-columns:1fr 1fr!important;}
    .form-2col{grid-template-columns:1fr!important;}
    .form-3col{grid-template-columns:1fr 1fr!important;}
    .cards-grid{grid-template-columns:1fr 1fr!important;}
    .grid-resp-1{grid-template-columns:1fr!important;}
    .grid-resp-2{grid-template-columns:1fr 1fr!important;}

    /* spacing */
    .view-pad{padding:12px 12px!important;}
    .inner-pad{padding:12px 12px!important;}
    .main-scroll{padding-bottom:calc(60px + env(safe-area-inset-bottom, 0px) + 8px)!important;}

    /* table */
    .table-scroll{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}
    .table-scroll > *{min-width:480px;}
    .week-grid > *{min-width:580px;}

    /* flex */
    .flex-wrap-mob{flex-wrap:wrap!important;gap:8px!important;}
    .btn-group-mob{flex-wrap:wrap!important;gap:6px!important;}

    /* login */
    .login-form-wrap{padding:24px 20px!important;}
  }

  @media (max-width:480px){
    .stat-strip{grid-template-columns:1fr 1fr!important;}
    .cards-grid{grid-template-columns:1fr!important;}
    .info-grid{grid-template-columns:1fr!important;}
    .modal-wide{max-width:100vw!important;width:100vw!important;margin:0!important;border-radius:0 0 16px 16px!important;max-height:96vh!important;}
    .view-pad{padding:10px 10px!important;}
    .hide-xxs{display:none!important;}
  }

  @media (min-width:768px){
    .bottom-nav{display:none!important;}
    .modal-resp{align-self:center;border-radius:16px!important;margin:24px auto!important;max-height:92vh!important;}
    .modal-resp-outer{align-items:center!important;padding:24px!important;}
  }
  @media (max-width:767px){
    .modal-resp{border-radius:16px 16px 0 0!important;max-height:92vh!important;}
  }

  /* ── TABLET (max 1024px) ── */
  @media (max-width:1024px){
    .cards-grid{grid-template-columns:1fr 1fr!important;}
    .stat-strip{grid-template-columns:1fr 1fr!important;}
    .form-3col{grid-template-columns:1fr 1fr!important;}
  }

  /* ── RESPONSIVE TABLE COLUMNS ── */
  .hide-mobile{display:table-cell;}
  @media (max-width:700px){
    .hide-mobile{display:none!important;}
    .cal-toolbar-right{flex-wrap:wrap!important;}
    .tb-label{display:none!important;}
  }
  @media (max-width:480px){
    .hide-mobile{display:none!important;}
    .resp-hide{display:none!important;}
  }
  
  /* Ensure overflow containers work */
  .table-outer{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .table-outer table{min-width:520px;}
  
  /* Fix allievi table minimum width */
  @media (max-width:700px){
    th.hide-mobile, td.hide-mobile{display:none!important;}
  }

  /* ── UNIVERSAL FIXES ── */
  .view-content{padding:20px 24px;}
  .view-header{padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .view-inner{padding:16px 24px;overflow:auto;flex:1;}
  .toolbar-btns{display:flex;gap:8px;flex-wrap:wrap;}
  .cal-filter-bar{flex-wrap:wrap;gap:6px;}
  .resp-select{min-width:100px!important;max-width:160px!important;}
  .resp-table{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .resp-table-inner{min-width:480px;}
  .resp-grid-detail{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .resp-stat-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  .resp-stat-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .resp-cards-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  .resp-form-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

  @media (max-width:767px){
    .view-content{padding:12px!important;}
    .view-header{padding:0 12px!important;height:52px!important;}
    .view-inner{padding:12px!important;}
    .toolbar-btns{gap:6px!important;}
    .toolbar-btns .tb-label{display:none!important;}
    .resp-select{min-width:80px!important;}
    .resp-stat-4{grid-template-columns:1fr 1fr!important;}
    .resp-stat-3{grid-template-columns:1fr 1fr!important;}
    .resp-cards-3{grid-template-columns:1fr!important;}
    .resp-form-2{grid-template-columns:1fr!important;}
    .resp-grid-detail{grid-template-columns:1fr!important;}
    .resp-hide{display:none!important;}
    .modal-box{max-width:calc(100vw - 16px)!important;max-height:94vh!important;border-radius:14px!important;}
    .modal-box-full{max-width:100vw!important;width:100vw!important;border-radius:12px 12px 0 0!important;position:fixed!important;bottom:0!important;max-height:90vh!important;}
    .modal-scroll{max-height:70vh!important;overflow-y:auto!important;}
    .week-view-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;}
    .week-view-wrap > div{min-width:560px!important;}
    .resp-table{overflow-x:auto!important;}
    .resp-table-inner{min-width:420px!important;}
    .btn-icon-only .btn-txt{display:none!important;}
    .filter-bar-mob{flex-direction:column!important;align-items:stretch!important;}
    .cal-toolbar{gap:6px!important;padding:10px 12px!important;}
    .cal-nav-label{font-size:14px!important;}
    .entrate-cols .col-cat{display:none!important;}
    .att-row{flex-wrap:wrap!important;gap:4px!important;}
    .att-row button{flex:1 1 calc(50% - 4px)!important;}
  }

  @media (max-width:480px){
    .view-content{padding:8px!important;}
    .view-header{padding:0 8px!important;}
    .view-inner{padding:8px!important;}
    .resp-stat-4{grid-template-columns:1fr 1fr!important;}
    .resp-cards-3{grid-template-columns:1fr!important;}
    .modal-box{max-width:100vw!important;width:100vw!important;border-radius:12px 12px 0 0!important;max-height:96vh!important;}
  }

  /* Safe area per iPhone/Android con barra di navigazione */
  .modal-resp { padding-bottom: env(safe-area-inset-bottom, 0px); }
  .modal-footer-safe { padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important; }
  /* Su mobile PWA: spinge il contenuto fuori dalla zona della Dynamic Island/notch */
  @media (max-width:767px) {
    .main-scroll { padding-top: env(safe-area-inset-top, 0px) !important; }
  }
  /* Nascondi pulsante Sito Web esterno */
  #sito-web-fab, .sito-web-btn, a[href*="futuro-musica"], a[href*="index.html"].fab { display:none!important; }
  `;

// ── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};



// ═══════════════════════════════════════════════════════════════════════════════
// ICONE — superset di tutti i moduli
// ═══════════════════════════════════════════════════════════════════════════════
const Ic = ({ n, size=16, stroke="currentColor", fill="none" }) => {
  const p = {
    users:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}), React.createElement('circle', { cx: "9", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}), React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}})),
    music:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M9 18V5l12-2v13" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}), React.createElement('circle', { cx: "6", cy: "18", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}), React.createElement('circle', { cx: "18", cy: "16", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}})),
    note:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M9 18V5l12-2v13" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}), React.createElement('circle', { cx: "6", cy: "18", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}), React.createElement('circle', { cx: "18", cy: "16", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}})),
    calendar: React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}), React.createElement('line', { x1: "16", y1: "2", x2: "16", y2: "6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}), React.createElement('line', { x1: "8", y1: "2", x2: "8", y2: "6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}), React.createElement('line', { x1: "3", y1: "10", x2: "21", y2: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}})),
    cal:      React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "17", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}), React.createElement('path', { d: "M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}})),
    euro:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 10h12M4 14h12M19 6a7 7 0 1 0 0 12"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}})),
    euro2:    React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}), React.createElement('path', { d: "M15 9.354a4 4 0 1 0 0 5.292M8.5 10H13M8.5 14H13"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}})),
    chart:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M3 3v18h18" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}), React.createElement('path', { d: "m19 9-5 5-4-4-3 3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}})),
    alert:    React.createElement(React.Fragment, null, React.createElement('path', { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}), React.createElement('line', { x1: "12", y1: "9", x2: "12", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}), React.createElement('line', { x1: "12", y1: "17", x2: "12.01", y2: "17", __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}})),
    warn:     React.createElement(React.Fragment, null, React.createElement('path', { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}), React.createElement('line', { x1: "12", y1: "9", x2: "12", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}), React.createElement('line', { x1: "12", y1: "17", x2: "12.01", y2: "17", __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}})),
    check:    React.createElement('path', { d: "M20 6 9 17l-5-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}),
    clock:    React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}), React.createElement('polyline', { points: "12 6 12 12 16 14"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}})),
    user:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}), React.createElement('circle', { cx: "12", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}})),
    solo:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}), React.createElement('circle', { cx: "12", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}})),
    group:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}), React.createElement('circle', { cx: "9", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}), React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}})),
    up:       React.createElement(React.Fragment, null, React.createElement('path', { d: "m5 12 7-7 7 7"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}), React.createElement('path', { d: "M12 19V5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}})),
    down:     React.createElement(React.Fragment, null, React.createElement('path', { d: "m19 12-7 7-7-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}), React.createElement('path', { d: "M12 5v14" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}})),
    star:     React.createElement('polygon', { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"                     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}),
    flag:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}), React.createElement('line', { x1: "4", y1: "22", x2: "4", y2: "15", __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}})),
    pin:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}), React.createElement('circle', { cx: "12", cy: "10", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}})),
    bell:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}), React.createElement('path', { d: "M13.73 21a2 2 0 0 1-3.46 0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}})),
    plus:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 5v14M5 12h14"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}})),
    grid:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}), React.createElement('rect', { x: "14", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}), React.createElement('rect', { x: "14", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}), React.createElement('rect', { x: "3", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}})),
    settings: React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}), React.createElement('path', { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"                                                                                                                                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}})),
    receipt:  React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}), React.createElement('path', { d: "M16 8H8M16 12H8M12 16H8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}})),
    x:        React.createElement(React.Fragment, null, React.createElement('path', { d: "M18 6 6 18"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}), React.createElement('path', { d: "m6 6 12 12"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}})),
    chevD:    React.createElement('path', { d: "m6 9 6 6 6-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}),
    info:     React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}), React.createElement('path', { d: "M12 16v-4M12 8h.01"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}})),
    edit:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}), React.createElement('path', { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}})),
    trash:    React.createElement(React.Fragment, null, React.createElement('polyline', { points: "3 6 5 6 21 6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}), React.createElement('path', { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}), React.createElement('path', { d: "M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}})),
    search:   React.createElement(React.Fragment, null, React.createElement('circle', { cx: "11", cy: "11", r: "8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}), React.createElement('path', { d: "m21 21-4.35-4.35" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}})),
    back:     React.createElement('path', { d: "m15 18-6-6 6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}),
    arrow:    React.createElement('path', { d: "m9 18 6-6-6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}),
    right:    React.createElement('path', { d: "m9 18 6-6-6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}),
    left:     React.createElement('path', { d: "m15 18-6-6 6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}),
    eye:      React.createElement(React.Fragment, null, React.createElement('path',{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}), React.createElement('circle',{cx:"12",cy:"12",r:"3"})),
    "eye-off":React.createElement(React.Fragment, null, React.createElement('path',{d:"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"}), React.createElement('line',{x1:"1",y1:"1",x2:"23",y2:"23"})),
    refresh:  React.createElement(React.Fragment, null, React.createElement('polyline',{points:"23 4 23 10 17 10"}), React.createElement('polyline',{points:"1 20 1 14 7 14"}), React.createElement('path',{d:"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"})),
    mail:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}), React.createElement('polyline', { points: "22,6 12,13 2,6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}})),
    lock:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "11", width: "18", height: "11", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}), React.createElement('path', { d: "M7 11V7a5 5 0 0 1 10 0v4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}})),
    eye:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}), React.createElement('circle', { cx: "12", cy: "12", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}})),
    eyeOff:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"                                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}), React.createElement('line', { x1: "1", y1: "1", x2: "23", y2: "23", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}})),
    send:     React.createElement(React.Fragment, null, React.createElement('line', { x1: "22", y1: "2", x2: "11", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}), React.createElement('polygon', { points: "22 2 15 22 11 13 2 9 22 2"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}})),
    shield:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}})),
    filter:   React.createElement('polygon', { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}),
    phone:    React.createElement('path', { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.19 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"                                                            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}),
    tag:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}), React.createElement('line', { x1: "7", y1: "7", x2: "7.01", y2: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}})),
    repeat:   React.createElement(React.Fragment, null, React.createElement('polyline', { points: "17 1 21 5 17 9"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}), React.createElement('path', { d: "M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}), React.createElement('path', { d: "M21 13v2a4 4 0 0 1-4 4H3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}})),
    today:    React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "17", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}), React.createElement('path', { d: "M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}})),
    courses:  React.createElement('path', { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}}),
    list:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}})),
    ban:      React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}), React.createElement('line', { x1: "4.93", y1: "4.93", x2: "19.07", y2: "19.07", __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}})),
    unlock:   React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}), React.createElement('path', { d: "M7 11V7a5 5 0 0 1 9.9-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}})),
    copy:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}), React.createElement('path', { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}})),
    mic:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}), React.createElement('path', { d: "M19 10v2a7 7 0 0 1-14 0v-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}), React.createElement('line', { x1: "12", y1: "19", x2: "12", y2: "23", __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}), React.createElement('line', { x1: "8", y1: "23", x2: "16", y2: "23", __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}})),
    ticket:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"                                   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}})),
    star2:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}})),
    map:      React.createElement(React.Fragment, null, React.createElement('polygon', { points: "3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}), React.createElement('line', { x1: "9", y1: "3", x2: "9", y2: "18", __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}), React.createElement('line', { x1: "15", y1: "6", x2: "15", y2: "21", __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}})),
    qr:       React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "14", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "14", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "3", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "5", y: "5", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "16", y: "5", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "16", y: "16", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('rect', { x: "5", y: "16", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}})),
    report:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}), React.createElement('polyline', { points: "14 2 14 8 20 8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}), React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}), React.createElement('line', { x1: "16", y1: "17", x2: "8", y2: "17", __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}), React.createElement('polyline', { points: "10 9 9 9 8 9"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}})),
    globe:    React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10"}), React.createElement('line', { x1: "2", y1: "12", x2: "22", y2: "12"}), React.createElement('path', { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"})),
    paperclip: React.createElement('path', { d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"}),
    download: React.createElement(React.Fragment, null, React.createElement('path',{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}), React.createElement('polyline',{points:"7 10 12 15 17 10"}), React.createElement('line',{x1:"12",y1:"15",x2:"12",y2:"3"})),
    upload:   React.createElement(React.Fragment, null, React.createElement('path',{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}), React.createElement('polyline',{points:"17 8 12 3 7 8"}), React.createElement('line',{x1:"12",y1:"3",x2:"12",y2:"15"})),
    drum:     React.createElement(React.Fragment, null,
      React.createElement('circle',{cx:"12",cy:"13",r:"5"}),
      React.createElement('path',{d:"M9 8 Q10 2 12 1 Q14 2 15 8"}),
      React.createElement('path',{d:"M7 7 Q5 2 7 0"}),
      React.createElement('path',{d:"M17 7 Q19 2 17 0"}),
      React.createElement('line',{x1:"10",y1:"14",x2:"10",y2:"14.5",strokeWidth:"2",strokeLinecap:"round"}),
      React.createElement('line',{x1:"14",y1:"14",x2:"14",y2:"14.5",strokeWidth:"2",strokeLinecap:"round"}),
      React.createElement('path',{d:"M10 17 Q12 19 14 17",strokeLinecap:"round",fill:"none"})),
  };
  return (
    React.createElement('svg', { width: size, height: size, viewBox: "0 0 24 24"   , fill: fill,
      stroke: stroke, strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}
      , p[n] || null
    )
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVI CONDIVISI
// ═══════════════════════════════════════════════════════════════════════════════
const uid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const initials = (nome) => nome ? nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() : "??";
const age = (dataN) => { if(!dataN) return "—"; const d=new Date(dataN); const now=new Date(); let a=now.getFullYear()-d.getFullYear(); if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))a--; return a; };
const fmtDate = (s) => { if(!s) return "—"; const d=new Date(s+"T00:00:00"); return d.toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric"}); };
const yyyymmdd = (d) => { const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), dd=String(d.getDate()).padStart(2,"0"); return `${y}-${m}-${dd}`; };

// ── Festività italiane ───────────────────────────────────────────────────────
// Calcola la Pasqua (algoritmo di Gauss) e tutte le festività fisse + mobili
const getItalianHolidays = (year) => {
  // Pasqua (algoritmo anonimo gregoriano)
  const a = year % 19, b = Math.floor(year/100), c = year % 100;
  const d = Math.floor(b/4), e = b % 4, f = Math.floor((b+8)/25);
  const g = Math.floor((b-f+1)/3), h = (19*a+b-d-g+15) % 30;
  const i = Math.floor(c/4), k = c % 4;
  const l = (32+2*e+2*i-h-k) % 7;
  const m2 = Math.floor((a+11*h+22*l)/451);
  const month = Math.floor((h+l-7*m2+114)/31);
  const day   = ((h+l-7*m2+114) % 31) + 1;
  const easter = new Date(year, month-1, day);

  const pad = n => String(n).padStart(2,'0');
  const fmt = (y,m,d2) => `${y}-${pad(m)}-${pad(d2)}`;
  const addDays = (date, n) => { const d2=new Date(date); d2.setDate(d2.getDate()+n); return d2; };

  const easterStr    = fmt(easter.getFullYear(), easter.getMonth()+1, easter.getDate());
  const easterMonday = addDays(easter, 1);
  const easterMonStr = fmt(easterMonday.getFullYear(), easterMonday.getMonth()+1, easterMonday.getDate());

  return {
    [fmt(year,1,1)]:  { label:"Capodanno",                emoji:"🎆" },
    [fmt(year,1,6)]:  { label:"Epifania",                  emoji:"⭐" },
    [easterStr]:      { label:"Pasqua",                    emoji:"🐣" },
    [easterMonStr]:   { label:"Pasquetta",                 emoji:"🐣" },
    [fmt(year,4,25)]: { label:"Liberazione",               emoji:"🇮🇹" },
    [fmt(year,5,1)]:  { label:"Festa del Lavoro",          emoji:"🔨" },
    [fmt(year,6,2)]:  { label:"Repubblica",                emoji:"🇮🇹" },
    [fmt(year,8,15)]: { label:"Ferragosto",                emoji:"☀️" },
    [fmt(year,11,1)]: { label:"Ognissanti",                emoji:"🕯️" },
    [fmt(year,12,8)]: { label:"Immacolata",                emoji:"✝️" },
    [fmt(year,12,25)]:{ label:"Natale",                    emoji:"🎄" },
    [fmt(year,12,26)]:{ label:"Santo Stefano",             emoji:"🎄" },
  };
};
// Cache per non ricalcolare ogni render
const _holidayCache = {};
const getHoliday = (dateStr) => {
  if (!dateStr) return null;
  const year = parseInt(dateStr.slice(0,4));
  if (!_holidayCache[year]) _holidayCache[year] = getItalianHolidays(year);
  return _holidayCache[year][dateStr] || null;
};

// Verifica se una data è chiusa (festività o chiusura personalizzata)
// Ritorna null se aperta, oppure { tipo, label, emoji, color, bg, bd }
const isGiornoChiuso = (dateStr, config) => {
  if (!dateStr || !config) return null;
  // 1. Chiusure personalizzate [{da, a, etichetta}]
  const chiusure = Array.isArray(config.giorniChiusi) ? config.giorniChiusi : [];
  for (const c of chiusure) {
    if (!c.da) continue;
    const fine = c.a || c.da;
    if (dateStr >= c.da && dateStr <= fine) {
      return { tipo:'chiusura', label: c.etichetta||'Scuola chiusa', emoji:'🔒', color:'#374151', bg:'rgba(55,65,81,0.07)', bd:'rgba(55,65,81,0.25)' };
    }
  }
  // 2. Festività nazionale marcata come chiusa
  const holiday = getHoliday(dateStr);
  if (holiday) {
    const festivitaConfig = config.festivitaConfig || {};
    // Default chiuso; se esplicitamente false = scuola aperta quella festività
    if (festivitaConfig[dateStr] !== false) {
      return { tipo:'festività', label: holiday.label, emoji: holiday.emoji, color:'#b91c1c', bg:'rgba(220,38,38,0.06)', bd:'rgba(220,38,38,0.22)' };
    }
  }
  return null;
};

// Pattern CSS per giorno chiuso (righe oblique)
const CHIUSO_PATTERN = 'repeating-linear-gradient(135deg,transparent,transparent 5px,rgba(0,0,0,0.04) 5px,rgba(0,0,0,0.04) 10px)';

const Badge = ({ label, color="gold", stato, variant }) => {
  const lbl = label || stato;
  const col = color !== "gold" ? color : variant ? variant :
    stato === "attivo"    ? "green" : stato === "inattivo"  ? "red" :
    stato === "sospeso"   ? "orange": stato === "invitato"  ? "blue" :
    stato === "pagato"    ? "green" : stato === "scaduto"   ? "red"  :
    stato === "attesa"    ? "orange": color;
  const map = {
    green:  {bg:C.greenBg,  c:C.green,  b:C.greenBorder},
    red:    {bg:C.redBg,    c:C.red,    b:C.redBorder},
    gold:   {bg:C.goldBg,   c:C.gold,   b:C.goldDim},
    orange: {bg:C.orangeBg, c:C.orange, b:C.orangeBorder},
    blue:   {bg:C.blueBg,   c:C.blue,   b:C.blueBorder},
    teal:   {bg:C.tealBg,   c:C.teal,   b:C.tealBorder},
    purple: {bg:C.purpleBg, c:C.purple, b:C.purpleBorder},
    gray:   {bg:C.surface,  c:C.textMuted, b:C.border},
  };
  const s = map[col] || map.gold;
  return (
    React.createElement('span', { style: {background:s.bg,color:s.c,border:`1px solid ${s.b}`,borderRadius:4,
      padding:"2px 8px",fontSize:11,fontWeight:500,letterSpacing:"0.04em",
      textTransform:"uppercase",whiteSpace:"nowrap",display:"inline-block"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}
      , lbl
    )
  );
};

const Btn = ({ children, onClick, variant:_variantRaw, small:_smallRaw, danger:_dangerRaw, disabled:_disabledRaw, style:_extraStyleRaw }) => {
  const variant = _variantRaw||"primary"; const small=_smallRaw||false; const danger=_dangerRaw||false; const disabled=_disabledRaw||false; const extraStyle=_extraStyleRaw||{};
  const base = {display:"flex",alignItems:"center",gap:6,border:"none",borderRadius:0,
    cursor:disabled?"not-allowed":"pointer",fontFamily:"'Open Sans',sans-serif",fontWeight:600,
    transition:"all 0.15s",opacity:disabled?0.5:1,fontSize:small?12:13,
    padding:small?"6px 12px":"10px 18px"};
  const v = {
    primary:   {background:C.gold,color:"#ffffff"},
    secondary: {background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`},
    ghost:     {background:"transparent",color:C.textMuted},
    danger:    {background:C.red,color:"#ffffff",border:`1px solid ${C.red}`},
  };
  return React.createElement('button', { onClick: disabled?undefined:onClick, style: {...base,...v[danger?"danger":variant],...extraStyle}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}, children);
};

const Input = ({ label, error, ...props }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
    , label && React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}, label)
    , React.createElement('input', { style: {background:C.surface,border:`1px solid ${error?C.red:C.border}`,borderRadius:0,
      color:C.text,fontSize:14,padding:"10px 14px",width:"100%",fontFamily:"'Open Sans',sans-serif"}, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}})
    , error && React.createElement('span', { style: {fontSize:11,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, error)
  )
);

const Sel = ({ label, options:_optionsRaw, error, value, onChange, ...props }) => {
  const options = _optionsRaw || [];
  return (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}
    , label && React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}, label)
    , React.createElement('select', { value: value, onChange: onChange,
      style: {background:C.surface,border:`1px solid ${error?C.red:C.border}`,borderRadius:0,
        color:C.text,fontSize:14,padding:"10px 14px",width:"100%",
        fontFamily:"'Open Sans',sans-serif",appearance:"none"}, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}
      , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}, "— seleziona —"  )
      , options.map(o=>React.createElement('option', { key: o.value||o, value: o.value||o, __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}, o.label||o))
    )
    , error && React.createElement('span', { style: {fontSize:11,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}, error)
  )
);
}

const Textarea = ({ label, ...props }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
    , label && React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}, label)
    , React.createElement('textarea', { rows: 3, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:0,
      color:C.text,fontSize:14,padding:"10px 14px",width:"100%",
      fontFamily:"'Open Sans',sans-serif",resize:"vertical"}, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}})
  )
);

// ─── REFRESH BUTTON — usato negli header di tutte le viste ────────────────────
const RefreshBtn = function() {
  return React.createElement('button', {
    onClick: function(){ if(window.__FM_FORCE_REFRESH__) window.__FM_FORCE_REFRESH__(false); },
    title: "Aggiorna dati",
    style: {
      background:"none", border:"1px solid "+C.border, borderRadius:8,
      padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center",
      color:C.textMuted, transition:"all .15s", flexShrink:0
    },
    onMouseEnter: function(e){ e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.color=C.gold; },
    onMouseLeave: function(e){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }
  }, React.createElement(Ic, {n:"refresh", size:15, stroke:"currentColor"}));
};

// Pulsante richiesta permesso notifiche push (solo in PWA, solo se non ancora concesso)
// ── Salva la push subscription su Supabase ──────────────────────────────────
async function savePushSubscriptionToDB(subscription) {
  const sb = window.supabaseClient;
  if (!sb || !subscription) return;
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return;

  // Recupera user_id e profilo corrente
  let userId = null, ruolo = 'admin', nome = '';
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
      userId = user.id;
      const { data: profilo } = await sb.from('profili').select('ruolo, nome').eq('id', user.id).maybeSingle();
      if (profilo) { ruolo = profilo.ruolo || 'admin'; nome = profilo.nome || ''; }
    }
  } catch(e) {}

  try {
    await sb.from('push_subscriptions').upsert({
      user_id:  userId,
      endpoint: json.endpoint,
      p256dh:   json.keys.p256dh,
      auth:     json.keys.auth,
      ruolo,
      nome,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,endpoint' });
    console.log('[FM] Push subscription salvata su DB');
  } catch(e) {
    console.warn('[FM] Errore salvataggio push subscription:', e);
  }
}

// ── Sottoscrivi ai push (richiede permesso + salva su DB) ────────────────────
async function subscribeAndSavePush(vapidPublicKey) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    // Controlla se esiste già
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      // Crea nuova subscription
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
    }
    await savePushSubscriptionToDB(sub);
    return sub;
  } catch(e) {
    console.warn('[FM] Errore subscribe push:', e);
    return null;
  }
}

// Utility: converti VAPID public key da base64url a Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

// VAPID public key (deve corrispondere a quella in .env dell'Edge Function)
const VAPID_PUBLIC_KEY = 'BHTTzvpknRzvw9GeoWwbWn7izHORW3cDv1RiSaJSplmUBqd6J_4fdbmsjpqQVuQGReXOMlh-8rZk3SEF6ujifZ8';

const NotifPermBtn = function() {
  const [perm, setPerm] = React.useState(
    ('Notification' in window) ? Notification.permission : 'denied'
  );

  // Se il permesso è già granted ma non abbiamo ancora la subscription, salvala
  React.useEffect(() => {
    if (perm === 'granted' && IS_PWA) {
      subscribeAndSavePush(VAPID_PUBLIC_KEY);
    }
  }, [perm]);

  if (!IS_PWA || !('Notification' in window) || perm !== 'default') return null;

  return React.createElement('button', {
    onClick: async function() {
      const p = await Notification.requestPermission();
      setPerm(p);
      if (p === 'granted') {
        const sub = await subscribeAndSavePush(VAPID_PUBLIC_KEY);
        // Notifica di conferma
        navigator.serviceWorker.ready.then(function(reg) {
          reg.showNotification('✅ Notifiche attivate', {
            body: 'Riceverai un avviso prima di ogni lezione, anche con l\'app chiusa.',
            icon: '/FM-webapp/icons/icon-192.png',
          });
        }).catch(function() {
          new Notification('✅ Notifiche attivate', {
            body: 'Riceverai un avviso prima di ogni lezione.',
          });
        });
      }
    },
    title: "Attiva notifiche push",
    style: {
      background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8,
      padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
      gap: 5, color: '#f97316', fontSize: 11, fontWeight: 600,
      fontFamily: "'Open Sans',sans-serif", flexShrink: 0,
    }
  },
    React.createElement(Ic, {n:'bell', size:13, stroke:'#f97316'}),
    ' Attiva notifiche'
  );
};

const Modal = ({ title, onClose, children, footer, wide=false }) => {
  // Detect mobile/PWA — full-screen layout; desktop — centered overlay
  const isMob = typeof useIsMobile === 'function' ? useIsMobile() : false;
  const isPwa = typeof window !== 'undefined' &&
    (window.__IS_PWA__ || window.matchMedia('(display-mode: standalone)').matches);
  const fullScreen = isMob || isPwa;

  if (fullScreen) {
    // ── MOBILE / PWA — full-screen come le schede native ────────────────────
    return React.createElement('div', { style: {
        position:"fixed", inset:0, zIndex:200,
        display:"flex", flexDirection:"column",
        background:C.surface, animation:"fadeIn 0.2s ease"
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}

      /* Header con safe-area per notch/Dynamic Island */
      , React.createElement('div', { style: {
          paddingTop:"env(safe-area-inset-top, 0px)",
          background:C.surface, borderBottom:`1px solid ${C.border}`, flexShrink:0
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
          , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,margin:0,letterSpacing:"0.05em",textTransform:"uppercase",color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}, title)
          , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,display:"flex",padding:4,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
            , React.createElement(Ic, { n:"x", size:22, stroke:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}})
          )
        )
      )
      /* Contenuto scrollabile */
      , React.createElement('div', { style: {flex:1,overflow:"auto",WebkitOverflowScrolling:"touch",width:"100%",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}, children)
      /* Footer sopra la bottom nav */
      , footer && React.createElement('div', { style: {flexShrink:0,borderTop:`1px solid ${C.border}`,background:C.surface,paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 60px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}, footer)
    );
  }

  // ── DESKTOP — centered overlay classico ─────────────────────────────────
  return React.createElement('div', { className: "modal-resp-outer", style: {
      position:"fixed",inset:0,zIndex:200,
      display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"
    }, onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}
    /* Backdrop */
    , React.createElement('div', { style: {position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(4px)",animation:"overlayIn 0.2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}})
    /* Pannello centrale */
    , React.createElement('div', { onClick: e=>e.stopPropagation(), className:"modal-resp"+(wide?" modal-wide":""),
        style: {
          position:"relative",background:C.surface,border:`1px solid ${C.border}`,
          borderRadius:16,width:"100%",maxWidth:wide?900:520,
          maxHeight:"90vh",overflow:"hidden",
          display:"flex",flexDirection:"column",animation:"fadeUp 0.22s ease",
          boxSizing:"border-box"
        }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}
      /* Header */
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 22px",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
        , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:18,fontWeight:600,margin:0,letterSpacing:"0.05em",textTransform:"uppercase",color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}, title)
        , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,display:"flex",padding:4,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
          , React.createElement(Ic, { n:"x", size:18, stroke:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}})
        )
      )
      /* Contenuto scrollabile */
      , React.createElement('div', { style: {overflow:"auto",flex:1,WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}, children)
      /* Footer */
      , footer && React.createElement('div', { style: {flexShrink:0,borderTop:`1px solid ${C.border}`,background:C.surface}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}, footer)
    )
  );
};

const Toggle = ({ value, checked, onChange, label }) => (
  React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,cursor:"pointer"},
    onClick: ()=>onChange(!(checked!==undefined?checked:!!value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 444}}
    , React.createElement('div', { style: {width:38,height:21,borderRadius:11,
      background:(checked!==undefined?checked:!!value)?C.gold:C.border,
      position:"relative",transition:"background 0.2s",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}}
      , React.createElement('div', { style: {width:15,height:15,borderRadius:"50%",background:C.bg,
        boxShadow:"0 1px 3px rgba(0,0,0,0.4)",position:"absolute",top:3,
        left:(checked!==undefined?checked:!!value)?20:3,transition:"left 0.2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}})
    )
    , label&&React.createElement('span', { style: {fontSize:13,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}, label)
  )
);

const Avatar = ({ initials:ini, hex=C.gold, size=36 }) => (
  React.createElement('div', { style: {width:size,height:size,borderRadius:"50%",background:`${hex}20`,
    border:`1.5px solid ${hex}40`,display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*0.35,fontWeight:700,color:hex,flexShrink:0,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}
    , ini
  )
);

const Field = ({ label, children }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}, label)
    , children
  )
);

const SectionDivider = ({ label }) => (
  React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,margin:"8px 0 4px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}
    , React.createElement('div', { style: {flex:1,height:1,background:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}})
    , React.createElement('span', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}, label)
    , React.createElement('div', { style: {flex:1,height:1,background:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}})
  )
);

const ConfirmDel = ({ title="Conferma eliminazione", testo, label, description, onConfirm, onClose }) => (
  React.createElement(Modal, { title: title, onClose: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 481}}
    , React.createElement('div', { style: {padding:24,display:"flex",flexDirection:"column",gap:16,alignItems:"center",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}
      , React.createElement('div', { style: {width:56,height:56,borderRadius:"50%",background:C.redBg,
        border:`1px solid ${C.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}
        , React.createElement(Ic, { n: "warn", size: 24, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}})
      )
      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}
        , label && React.createElement('p', { style: {fontSize:16,fontWeight:500,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}, "Eliminare "
           , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}, label), "?"
        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}, testo||description||"Questa azione è irreversibile.")
      )
    )
    , React.createElement('div', { style: {padding:"16px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}}
      , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 495}}, "Annulla")
      , React.createElement(Btn, { danger: true, onClick: onConfirm, __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}, React.createElement(Ic, { n: "trash", size: 14, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}), "Conferma")
    )
  )
);

const ConfirmDelete = ConfirmDel; // alias — alcuni componenti usano ConfirmDelete

// ─── RICEVUTA MODAL + PRINT ───────────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  body > * { display: none !important; }
  #ricevuta-print-root { display: block !important; }
  @page { margin: 18mm 20mm; size: A4; }
}
#ricevuta-print-root {
  display: none;
  font-family: 'Open Sans',sans-serif;
  color: #1a1a2e;
  background: #fff;
}
.ric-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; border-bottom: 2px solid #1a4fa0; padding-bottom: 16px; }
.ric-logo   { font-size: 22px; font-weight: 700; letter-spacing: 0.03em; }
.ric-scuola-sub { font-size: 11px; color: #666; margin-top: 2px; letter-spacing: 0.06em; text-transform: uppercase; }
.ric-num    { text-align: right; }
.ric-num .num { font-size: 28px; font-weight: 700; color: #1a4fa0; line-height: 1; }
.ric-num .lbl { font-size: 10px; color: #888; letter-spacing: 0.1em; text-transform: uppercase; }
.ric-body   { margin-bottom: 24px; }
.ric-row    { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
.ric-row:last-child { border-bottom: none; }
.ric-row .k { color: #666; }
.ric-row .v { font-weight: 600; }
.ric-importo { text-align: center; margin: 28px 0; padding: 20px; border: 2px solid #1a4fa0; border-radius: 8px; }
.ric-importo .val { font-size: 42px; font-weight: 700; color: #1a4fa0; font-family: 'Oswald',sans-serif; }
.ric-importo .lbl { font-size: 11px; color: #888; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }
.ric-footer { font-size: 10px; color: #888; text-align: center; margin-top: 32px; padding-top: 12px; border-top: 1px solid #ddd; line-height: 1.6; }
.ric-firma  { margin-top: 40px; display: flex; justify-content: space-between; }
.ric-firma-box { text-align: center; width: 180px; }
.ric-firma-line { border-top: 1px solid #333; margin-bottom: 6px; }
.ric-firma-lbl  { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
`;

const RICEVUTA_STYLE_DEFAULT = {
  accentColor: "#1a4fa0",
  fontBody: "Open Sans",
  fontTitle: "Oswald",
  showIndirizzo: true,
  showFirme: true,
  showFooter: true,
  showDataNascita: true,
  notePersonalizzate: "",
  firmaPresidenteUrl: "",
};

const RicevutaModal = ({ entrata, student, config, onClose }) => {
  const cfg = config || CONFIG_DEFAULT;
  const stile = {...RICEVUTA_STYLE_DEFAULT, ...(cfg.ricevutaStyle||{})};

  const numRic = entrata.numRicevuta || (String(cfg.progressivoRicevute||1).padStart(3,"0") + "/" + (entrata.anno||new Date().getFullYear()));
  const intestatario = (student && student.nomeRicevuta && student.nomeRicevuta.trim()) || (student && student.name) || entrata.studentName || "—";
  const MESI_N = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const dataStampa = new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric"});
  const dataPag    = entrata.data ? new Date(entrata.data+"T00:00:00").toLocaleDateString("it-IT") : dataStampa;
  const meseLabel  = entrata.mese ? MESI_N[entrata.mese-1]+" "+(entrata.anno||new Date().getFullYear()) : "";
  const importoStr = `€ ${(entrata.importo||0).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const ac = stile.accentColor;

  // Genera HTML puro per la stampa in popup
  const buildHtml = () => {
    const indirizzoHtml = stile.showIndirizzo!==false && cfg.indirizzo ? `<div style="font-size:11px;color:#666;margin-top:3px">${cfg.indirizzo}</div>` : "";
    const cfHtml = cfg.codiceFiscale ? `<div style="font-size:11px;color:#666">CF: ${cfg.codiceFiscale}</div>` : "";
    const nascitaRow = stile.showDataNascita!==false && student && student.birthdate
      ? `<tr><td class="k">Data di nascita</td><td class="v">${new Date(student.birthdate+"T00:00:00").toLocaleDateString("it-IT")}</td></tr>` : "";
    const meseRow = stile.showCompetenza!==false && meseLabel ? `<tr><td class="k">Competenza</td><td class="v">${meseLabel}</td></tr>` : "";
    const noteRow = stile.noteFooter ? `<tr><td class="k">Note</td><td class="v">${stile.noteFooter}</td></tr>` : "";
    const firmaImg = stile.firmaPresidenteUrl ? `<img src="${stile.firmaPresidenteUrl}" style="height:42px;max-width:160px;object-fit:contain;display:block;margin:0 auto 4px;" alt="firma">` : `<div class="firma-line"></div>`;
    const firmeHtml = stile.showFirme!==false ? `
      <div class="firma-wrap">
        <div class="firma-box"><div class="firma-line"></div><div class="firma-lbl">${stile.labelPagante||"Il pagante"}</div></div>
        <div class="firma-box">${firmaImg}<div class="firma-lbl">${stile.labelCassiere||"Il cassiere / responsabile"}</div></div>
      </div>` : "";
    const footerHtml = stile.showFooter!==false ? `<div class="footer">${cfg.notaRicevuta||"Ricevuta non fiscale"}<br>${cfg.nomeScuola||""} · ${cfg.annoScolastico||""}${stile.noteFooter?"<br>"+stile.noteFooter:""}</div>` : "";

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Ricevuta ${numRic}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Open+Sans:wght@400;500;600&display=swap');
      @page { margin: 18mm 20mm; size: A4; }
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'${stile.fontBody}',Arial,sans-serif; color:#1a1a2e; background:#fff; }
      .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; border-bottom:2px solid ${ac}; padding-bottom:16px; }
      .logo { font-family:'${stile.fontTitle}',Georgia,serif; font-size:22px; font-weight:700; }
      .sub  { font-size:10px; color:#888; letter-spacing:.1em; text-transform:uppercase; margin-top:2px; }
      .num-box { text-align:right; }
      .num-lbl { font-size:10px; color:#888; letter-spacing:.1em; text-transform:uppercase; }
      .num-val { font-family:'${stile.fontTitle}',Georgia,serif; font-size:28px; font-weight:700; color:${ac}; line-height:1; }
      .num-date { font-size:11px; color:#888; margin-top:4px; }
      table { width:100%; border-collapse:collapse; margin-bottom:24px; }
      td { padding:9px 0; border-bottom:1px solid #eee; font-size:13px; vertical-align:middle; }
      tr:last-child td { border-bottom:none; }
      td.k { color:#666; width:50%; }
      td.v { font-weight:600; text-align:right; }
      .importo-box { text-align:center; margin:24px 0; padding:20px; border:2px solid ${ac}; border-radius:8px; background:${ac}12; }
      .importo-val { font-family:'${stile.fontTitle}',Georgia,serif; font-size:44px; font-weight:700; color:${ac}; line-height:1; }
      .importo-lbl { font-size:11px; color:#888; letter-spacing:.12em; text-transform:uppercase; margin-top:4px; }
      .firma-wrap { display:flex; justify-content:space-between; margin-top:44px; }
      .firma-box  { text-align:center; width:180px; }
      .firma-line { border-top:1px solid #333; margin-bottom:6px; }
      .firma-lbl  { font-size:10px; color:#888; text-transform:uppercase; letter-spacing:.08em; }
      .footer { font-size:10px; color:#888; text-align:center; margin-top:32px; padding-top:12px; border-top:1px solid #ddd; line-height:1.7; }
    </style></head><body>
    <div class="header">
      <div>
        <div class="logo">${cfg.nomeScuola||"Accademia Musicale"}</div>
        <div class="sub">${cfg.tipoEnte||""}</div>
        ${indirizzoHtml}${cfHtml}
      </div>
      <div class="num-box">
        <div class="num-lbl">Ricevuta n°</div>
        <div class="num-val">${numRic}</div>
        <div class="num-date">del ${dataStampa}</div>
      </div>
    </div>
    <table>
      ${stile.showNominativo!==false?`<tr><td class="k">Ricevuta da</td><td class="v">${intestatario}</td></tr>`:""}
      ${nascitaRow}
      ${stile.showDataPagamento!==false?`<tr><td class="k">Data pagamento</td><td class="v">${dataPag}</td></tr>`:""}
      ${stile.showDescrizione!==false?`<tr><td class="k">Descrizione</td><td class="v">${entrata.desc||"Quota mensile"}</td></tr>`:""}
      ${meseRow}
      ${stile.showMetodo!==false?`<tr><td class="k">Metodo di pagamento</td><td class="v">${entrata.metodo||"—"}</td></tr>`:""}
      ${noteRow}
    </table>
    <div class="importo-box">
      <div class="importo-val">${importoStr}</div>
      <div class="importo-lbl">Importo ricevuto</div>
    </div>
    ${firmeHtml}
    ${footerHtml}
    <script>window.onload=function(){window.print();}<\/script>
    </body></html>`;
  };

  const handlePrint = () => {
    const w = window.open("","_blank","width=794,height=1123");
    if(!w) { alert("Abilita i popup per stampare"); return; }
    w.document.write(buildHtml());
    w.document.close();
  };

  const handleExportPdf = async () => {
    // Usa la Print API con destinazione file su browser moderni
    // Su iOS/Safari → apre dialog stampa → "Salva come PDF"
    // Su Chrome/Edge → usa jsPDF o print-to-PDF
    try {
      // Prova con jsPDF se disponibile
      if (window.jspdf || window.jsPDF) {
        const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        const doc = new jsPDF({ unit:'mm', format:'a4' });
        const html = buildHtml();
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none';
        document.body.appendChild(iframe);
        iframe.contentDocument.write(html);
        iframe.contentDocument.close();
        setTimeout(() => {
          doc.html(iframe.contentDocument.body, {
            callback: (doc2) => {
              doc2.save(`Ricevuta_${numRic.replace('/','_')}_${intestatario.replace(/\s+/g,'_')}.pdf`);
              document.body.removeChild(iframe);
            },
            x:0, y:0, width:210, windowWidth:794
          });
        }, 500);
      } else {
        // Fallback: apri in popup e stampa
        const w = window.open("","_blank","width=794,height=1123");
        if(!w) { alert("Abilita i popup per esportare il PDF"); return; }
        // Modifica l'HTML per non auto-stampare ma salvare come PDF
        const pdfHtml = buildHtml().replace(
          'window.onload=function(){window.print();}',
          `window.onload=function(){
            const btn=document.createElement('button');
            btn.innerText='Salva come PDF';
            btn.style='position:fixed;top:12px;right:12px;padding:10px 18px;background:#1a4fa0;color:#fff;border:none;borderRadius:6px;cursor:pointer;fontSize:14px;zIndex:9999;fontFamily:Arial';
            btn.onclick=function(){window.print();};
            document.body.insertBefore(btn,document.body.firstChild);
          }`
        );
        w.document.write(pdfHtml);
        w.document.close();
      }
    } catch(e) {
      console.warn('[FM] exportPdf error:', e);
      handlePrint();
    }
  };

  const rows = [
    {k:"Ricevuta n°", v:numRic},
    {k:"Data stampa",  v:dataStampa},
    {k:"Nominativo",   v:intestatario},
    {k:"Data pagamento", v:dataPag},
    {k:"Descrizione",  v:entrata.desc||"Quota mensile"},
    ...(meseLabel ? [{k:"Competenza", v:meseLabel}] : []),
    {k:"Metodo",       v:entrata.metodo||"—"},
    ...(stile.notePersonalizzate ? [{k:"Note", v:stile.notePersonalizzate}] : []),
  ];

  const Toggle2 = ({checked, onChange, label}) => React.createElement('label', {style:{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:checked?C.text:C.textMuted}}
    , React.createElement('div', {
        onClick:()=>onChange(!checked),
        style:{width:32,height:18,borderRadius:9,background:checked?ac:"#444",position:"relative",cursor:"pointer",transition:"background .15s",flexShrink:0}}
      , React.createElement('div', {style:{position:"absolute",top:2,left:checked?14:2,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .15s"}})
    )
    , label
  );

  return React.createElement(Modal, { title: "Ricevuta — anteprima e stampa", onClose, wide: true }
    , React.createElement('div', {style:{display:"flex",gap:0,maxHeight:"75vh",overflow:"hidden"}}

      /* ── ANTEPRIMA ── */
      , React.createElement('div', {style:{flex:1,overflow:"auto",padding:"20px 24px",background:"#f0ede8"}}
        , React.createElement('div', {style:{background:"#fff",borderRadius:10,overflow:"hidden",
            boxShadow:"0 4px 32px rgba(0,0,0,0.22)",maxWidth:560,margin:"0 auto",padding:"24px 28px"}}
          /* Header */
          , React.createElement('div', {style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
              marginBottom:24,borderBottom:`2px solid ${ac}`,paddingBottom:14}}
            , React.createElement('div', null
              , React.createElement('div', {style:{fontFamily:`'${stile.fontTitle}',Georgia,serif`,fontSize:20,fontWeight:700,color:"#1a1a2e",lineHeight:1}}, cfg.nomeScuola)
              , cfg.tipoEnte && React.createElement('div', {style:{fontSize:10,color:"#888",letterSpacing:".1em",textTransform:"uppercase",marginTop:2}}, cfg.tipoEnte)
              , stile.showIndirizzo && cfg.indirizzo && React.createElement('div', {style:{fontSize:11,color:"#666",marginTop:3}}, cfg.indirizzo)
              , cfg.codiceFiscale && React.createElement('div', {style:{fontSize:11,color:"#666"}}, "CF: ", cfg.codiceFiscale)
            )
            , React.createElement('div', {style:{textAlign:"right"}}
              , React.createElement('div', {style:{fontSize:10,color:"#888",letterSpacing:".1em",textTransform:"uppercase"}}, "Ricevuta n°")
              , React.createElement('div', {style:{fontFamily:`'${stile.fontTitle}',Georgia,serif`,fontSize:26,fontWeight:700,color:ac,lineHeight:1}}, numRic)
              , React.createElement('div', {style:{fontSize:11,color:"#888",marginTop:2}}, "del ", dataStampa)
            )
          )
          /* Rows */
          , React.createElement('div', {style:{marginBottom:20}}
            , rows.map((r,i)=>React.createElement('div', {key:i, style:{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:i<rows.length-1?"1px solid #eee":"none"}}
                , React.createElement('span', {style:{fontSize:12,color:"#666"}}, r.k)
                , React.createElement('span', {style:{fontSize:13,fontWeight:600,color:"#1a1a2e"}}, r.v)
              ))
          )
          /* Nota: stile globale gestito in Impostazioni > Ricevuta */
          /* Importo */
          , React.createElement('div', {style:{textAlign:"center",margin:"20px 0",padding:"18px",
              border:`2px solid ${ac}`,borderRadius:8,background:ac+"12"}}
            , React.createElement('div', {style:{fontFamily:`'${stile.fontTitle}',Georgia,serif`,fontSize:36,fontWeight:700,color:ac,lineHeight:1}}, importoStr)
            , React.createElement('div', {style:{fontSize:10,color:"#888",letterSpacing:".12em",textTransform:"uppercase",marginTop:4}}, "Importo ricevuto")
          )
          /* Firme */
          , stile.showFirme && React.createElement('div', {style:{display:"flex",justifyContent:"space-between",marginTop:36}}
            , [
                {label:stile.labelPagante||"Il pagante", img:null},
                {label:stile.labelCassiere||"Il cassiere / responsabile", img:stile.firmaPresidenteUrl}
              ].map(({label:l,img})=>React.createElement('div', {key:l, style:{textAlign:"center",width:160}}
                , img && React.createElement('img',{src:img,style:{height:32,objectFit:"contain",display:"block",margin:"0 auto 2px"}})
                , React.createElement('div', {style:{borderTop:"1px solid #333",marginBottom:5}})
                , React.createElement('div', {style:{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:".08em"}}, l)
              ))
          )
          /* Footer */
          , stile.showFooter && React.createElement('div', {style:{marginTop:24,paddingTop:10,borderTop:"1px solid #eee",textAlign:"center"}}
            , React.createElement('div', {style:{fontSize:10,color:"#888",lineHeight:1.7}}, cfg.notaRicevuta)
            , React.createElement('div', {style:{fontSize:10,color:"#aaa",marginTop:1}}, cfg.nomeScuola, " · ", cfg.annoScolastico)
          )
        )
      )

    )

    /* ── Footer modal ── */
    , React.createElement('div', {style:{padding:"14px 24px",borderTop:`1px solid ${C.border}`,
        display:"flex",justifyContent:"flex-end",gap:10,background:C.surface}}
      , React.createElement(Btn, {variant:"secondary", onClick:onClose}, "Chiudi")
      , React.createElement(Btn, {variant:"secondary", onClick:handleExportPdf}
        , React.createElement(Ic,{n:"download",size:14,stroke:C.textMuted}), " Esporta PDF"
      )
      , React.createElement(Btn, {onClick:handlePrint}
        , React.createElement(Ic,{n:"receipt",size:14,stroke:"#ffffff"}), " Stampa ricevuta"
      )
    )
  );
};

// SField usato dal SettingsDrawer della dashboard
const SField = ({ label, sub, ...props }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 676}}
    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 677}}, label)
    , sub && React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:-3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}, sub)
    , React.createElement('input', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:0,
      color:C.text,fontSize:13,padding:"9px 13px",width:"100%",fontFamily:"'Open Sans',sans-serif"},
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}})
  )
);




// ════════════════════════════════════════════════════════════════════════════════

// AUTH — Input con icone e form login/registrazione/recupero

// ════════════════════════════════════════════════════════════════════════════════

// ─── INPUT COMPONENTE ─────────────────────────────────────────────────────────
const AuthInput = ({label,type="text",value,onChange,error,icon,right})=>{
  const [show,setShow]=useState(false);
  const t=type==="password"?(show?"text":"password"):type;
  return(
    React.createElement('div', { className: "inp", style: {display:"flex",flexDirection:"column",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 699}}
      , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:500,transition:"color .2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 700}}, label)
      , React.createElement('div', { style: {display:"flex",alignItems:"center",background:C.surface,border:`1px solid ${error?C.red:C.border}`,
        borderRadius:0,overflow:"hidden",transition:"border-color .2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 701}}
        , icon&&React.createElement('div', { style: {padding:"0 12px",color:C.textDim,flexShrink:0,display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 703}}, React.createElement(Ic, { n: icon, size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 703}}))
        , React.createElement('input', { type: t, value: value, onChange: onChange,
          style: {flex:1,background:"transparent",border:"none",color:C.text,fontSize:14,
            padding:icon?"11px 0":"11px 14px",fontFamily:"'Open Sans',sans-serif",width:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 704}})
        , type==="password"&&(
          React.createElement('button', { onClick: ()=>setShow(p=>!p), style: {background:"none",border:"none",cursor:"pointer",
            padding:"0 13px",color:C.textDim,display:"flex",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 708}}
            , React.createElement(Ic, { n: show?"eyeOff":"eye", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 710}})
          )
        )
        , right&&React.createElement('div', { style: {padding:"0 12px",color:C.textDim,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 713}}, right)
      )
      , error&&React.createElement('span', { style: {fontSize:11,color:C.red,display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 715}}
        , React.createElement(Ic, { n: "alert", size: 12, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 716}}), error
      )
    )
  );
};

// ─── PANNELLO SINISTRA ────────────────────────────────────────────────────────
const PanelloSinistra = ()=>{
  // Elementi decorativi geometrici — cerchi/linee ispirate a pentagrammi
  const righeDecorative = [0,1,2,3,4];
  const note = [
    {x:"18%",y:"22%",delay:0,  size:18,anim:"floatA 6s ease-in-out infinite"},
    {x:"72%",y:"15%",delay:1.2,size:13,anim:"floatB 7s 1.2s ease-in-out infinite"},
    {x:"85%",y:"55%",delay:0.5,size:22,anim:"floatC 5.5s .5s ease-in-out infinite"},
    {x:"12%",y:"68%",delay:2,  size:16,anim:"floatA 8s 2s ease-in-out infinite"},
    {x:"60%",y:"75%",delay:1,  size:12,anim:"floatB 6.5s 1s ease-in-out infinite"},
    {x:"40%",y:"30%",delay:1.8,size:10,anim:"floatC 7.5s 1.8s ease-in-out infinite"},
  ];

  return(
    React.createElement('div', { style: {flex:"0 0 46%",background:`linear-gradient(160deg,#123a7a 0%,#1a4fa0 40%,#0d2d6b 100%)`,
      position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",
      justifyContent:"space-between",padding:"48px 52px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 736}}

      /* Righe pentagramma */
      , React.createElement('div', { style: {position:"absolute",inset:0,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 741}}
        , righeDecorative.map((i)=>(
          React.createElement('div', { key: i, style: {position:"absolute",left:0,right:0,
            top:`${30+i*8}%`,height:"1px",
            background:`linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 20%,rgba(255,255,255,0.15) 80%,transparent 100%)`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 743}})
        ))
      )

      /* Cerchio decorativo grande */
      , React.createElement('div', { style: {position:"absolute",right:"-120px",top:"50%",transform:"translateY(-50%)",
        width:400,height:400,borderRadius:"50%",
        border:`1px solid rgba(255,255,255,0.12)`,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 750}})
      , React.createElement('div', { style: {position:"absolute",right:"-80px",top:"50%",transform:"translateY(-50%)",
        width:300,height:300,borderRadius:"50%",
        border:`1px solid rgba(255,255,255,0.15)`,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 753}})

      /* Note musicali flottanti */
      , note.map((n,i)=>(
        React.createElement('div', { key: i, style: {position:"absolute",left:n.x,top:n.y,
          animation:n.anim,pointerEvents:"none",opacity:.2,color:"rgba(255,255,255,0.5)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}
          , React.createElement(Ic, { n: "music", size: n.size, stroke: "rgba(255,255,255,0.5)", __self: this, __source: {fileName: _jsxFileName, lineNumber: 761}})
        )
      ))

      /* Contenuto */
      , React.createElement('div', { style: {position:"relative",zIndex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 766}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 767}}
          , React.createElement('div', { style: {width:34,height:34,borderRadius:0,background:"#8c1818",
            display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 768}}
            , React.createElement(Ic, { n: "music", size: 17, stroke: "#fff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 770}})
          )
          , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontSize:16,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:"#fff"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 772}}, "Futuro Musica"

          )
        )
      )

      , React.createElement('div', { style: {position:"relative",zIndex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 778}}
        , React.createElement('div', { style: {fontFamily:"'Oswald',sans-serif",fontWeight:500,fontSize:48,
          lineHeight:1.1,letterSpacing:"0.02em",marginBottom:20,textTransform:"uppercase",color:"#fff"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 779}}, "La musica"
           , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 781}})
          , React.createElement('em', { style: {color:"#e88080",fontStyle:"normal"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 782}}, "inizia qui." )
        )
        , React.createElement('p', { style: {fontSize:14,color:"rgba(255,255,255,0.75)",lineHeight:1.75,maxWidth:320}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 784}}, "Gestisci lezioni, repertorio, pagamenti e allievi della tua scuola di musica in un'unica piattaforma."

        )
      )

      , React.createElement('div', { style: {position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 789}}
        , [
          {icon:"music",   label:"Calendario e lezioni",    desc:"Vista giornaliera, settimanale e mensile"},
          {icon:"shield",  label:"Gestione pagamenti",      desc:"Rate, ricevute e contabilità"},
          {icon:"edit",    label:"Repertorio musicale",     desc:"Catalogo brani e progressi allievi"},
        ].map(f=>(
          React.createElement('div', { key: f.label, style: {display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 795}}
            , React.createElement('div', { style: {width:32,height:32,borderRadius:0,background:"rgba(255,255,255,0.15)",
              border:`1px solid rgba(255,255,255,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 796}}
              , React.createElement(Ic, { n: f.icon, size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 798}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 800}}
              , React.createElement('div', { style: {fontSize:12,fontWeight:600,color:"#ffffff"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 801}}, f.label)
              , React.createElement('div', { style: {fontSize:11,color:"rgba(255,255,255,0.6)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 802}}, f.desc)
            )
          )
        ))
      )
    )
  );
};

// ─── FORM LOGIN ───────────────────────────────────────────────────────────────
const FormLogin = ({onSuccess,onRegistrazione,onRecupero,onBand})=>{
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState({});

  const validate=()=>{
    const e={};
    if(!email.trim())    e.email="Email obbligatoria";
    else if(!/\S+@\S+\.\S+/.test(email)) e.email="Email non valida";
    if(!password.trim()) e.password="Password obbligatoria";
    return e;
  };

  const handleLogin=()=>{
    const e=validate(); if(Object.keys(e).length){setErr(e);return;}
    setLoading(true);
    (async()=>{
      try {
        if(window.FM_AUTH){
          const {user, profilo} = await window.FM_AUTH.signIn(email.trim().toLowerCase(), password);
          if(!profilo){ setErr({form:"Profilo non trovato. Contatta l'amministratore."}); setLoading(false); return; }
          if(profilo.stato==='sospeso'){ setErr({form:"Il tuo account è stato sospeso. Contatta l'amministratore."}); setLoading(false); return; }
          if(profilo.stato==='invitato'){ setErr({form:"Account non ancora attivato. Imposta la password dal link nell'email di invito."}); setLoading(false); return; }
          onSuccess({email:user.email, nome:profilo.nome, ruolo:profilo.ruolo, userId:user.id, docenteId:profilo.docente_id||null, allievoId:profilo.allievo_id||null});
        } else {
          // Fallback DEMO (sviluppo locale senza Supabase)
          const DEMO={"admin@accademia.it":{password:"admin123",nome:"Marco Bianchi",ruolo:"admin"},"rossi@accademia.it":{password:"musica2024",nome:"Prof. Rossi",ruolo:"docente"},"sofia@accademia.it":{password:"sofia2024",nome:"Sofia Marchetti",ruolo:"allievo"}};
          const u=DEMO[email.toLowerCase()];
          if(u&&u.password===password){ onSuccess({email,nome:u.nome,ruolo:u.ruolo}); }
          else { setErr({form:"Credenziali non valide."}); setLoading(false); }
        }
      } catch(ex){
        setErr({form: ex.message==="Invalid login credentials" ? "Email o password errati." : (ex.message||"Errore di accesso.")});
        setLoading(false);
      }
    })();
  };

  const handleKeyDown=(e)=>{if(e.key==="Enter")handleLogin();};

  return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 850}}
      , React.createElement('div', { className: "st1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 851}}
        , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:30,fontWeight:600,marginBottom:6,letterSpacing:"0.03em",textTransform:"uppercase",color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 852}}, "Bentornato"

        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 855}}, "Accedi al tuo account per continuare"     )
      )

      , err.form&&(
        React.createElement('div', { style: {background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:10,padding:"11px 14px",
          display:"flex",alignItems:"flex-start",gap:9,animation:"slideIn .25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 859}}
          , React.createElement(Ic, { n: "alert", size: 15, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 861}})
          , React.createElement('span', { style: {fontSize:13,color:C.red,lineHeight:1.5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 862}}, err.form)
        )
      )

      , React.createElement('div', { className: "st2", style: {display:"flex",flexDirection:"column",gap:14}, onKeyDown: handleKeyDown, __self: this, __source: {fileName: _jsxFileName, lineNumber: 866}}
        , React.createElement(AuthInput, { label: "Indirizzo email" , type: "email", icon: "mail", value: email,
          onChange: e=>{setEmail(e.target.value);setErr(p=>({...p,email:"",form:""}));},
          error: err.email, placeholder: "nome@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 867}})
        , React.createElement(AuthInput, { label: "Password", type: "password", icon: "lock", value: password,
          onChange: e=>{setPassword(e.target.value);setErr(p=>({...p,password:"",form:""}));},
          error: err.password, placeholder: "••••••••", __self: this, __source: {fileName: _jsxFileName, lineNumber: 870}})
      )

      , React.createElement('div', { className: "st3", style: {display:"flex",justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}
        , React.createElement('button', { onClick: onRecupero, style: {background:"none",border:"none",cursor:"pointer",
          fontSize:12,color:C.textMuted,fontFamily:"'Open Sans',sans-serif",
          textDecoration:"underline",textDecorationColor:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 876}}, "Password dimenticata?"

        )
      )

      , React.createElement('div', { className: "st4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 883}}
        , React.createElement('button', { className: "btn-gold", onClick: handleLogin, disabled: loading,
          style: {width:"100%",padding:"14px 0",borderRadius:0,border:"none",
            background:loading?C.goldDim:C.gold,color:"#ffffff",fontSize:14,fontWeight:600,
            cursor:loading?"not-allowed":"pointer",fontFamily:"'Oswald',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 884}}
          , loading?(
            React.createElement('svg', { width: 18, height: 18, viewBox: "0 0 24 24"   , style: {animation:"spin 1s linear infinite"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 890}}
              , React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "none", stroke: "#ffffff", strokeWidth: "2.5", strokeDasharray: "31.4", strokeDashoffset: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 891}})
            )
          ):React.createElement(Ic, { n: "check", size: 15, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 893}})
          , loading?"Accesso in corso…":"Accedi"
        )
      )



      , React.createElement('div', { style: {textAlign:"center",paddingTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 915}}
        , React.createElement('span', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 916}}, "Non hai un account? "    )
        , React.createElement('button', { onClick: onRegistrazione, style: {background:"none",border:"none",cursor:"pointer",
          fontSize:13,color:C.gold,fontFamily:"'Open Sans',sans-serif",fontWeight:500,textDecoration:"underline"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 917}}, "Richiedi accesso"
        )
      )
      /* Link accesso rapido sala prove per band */
      , React.createElement('div', { style: {textAlign:"center",paddingTop:0} }
        , React.createElement('div', {style:{height:1,background:C.border,margin:"4px 0 12px"}})
        , React.createElement('button', { onClick: onBand, style: {background:"none",border:`1px solid ${C.orange2Border}`,borderRadius:8,cursor:"pointer",
          padding:"8px 16px",fontSize:12,color:C.orange2,fontFamily:"'Open Sans',sans-serif",fontWeight:600,
          display:"inline-flex",alignItems:"center",gap:6,transition:"all .15s"},
          onMouseEnter:e=>{e.currentTarget.style.background=C.orange2Bg;},
          onMouseLeave:e=>{e.currentTarget.style.background="none";} }
          , React.createElement(Ic,{n:"drum",size:13,stroke:C.orange2})
          , "🎸 Prenota Sala Prove (band/ensemble)"
        )
      )
    )
  );
};

// ─── FORM RICHIEDI ACCESSO ────────────────────────────────────────────────────
const FormRegistrazione = ({onBack})=>{
  const [step,    setStep]    = useState(1); // 1=dati, 2=inviato
  const [f,       setF]       = useState({nome:"",email:"",ruolo:"docente",messaggio:""});
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const RUOLI=[
    {id:"docente", label:"Docente", desc:"Lezioni assegnate, allievi propri, repertorio"},
    {id:"allievo", label:"Allievo", desc:"Dashboard personale, calendario e concerti propri"},
  ];

  const validate=()=>{
    const e={};
    if(!f.nome.trim())  e.nome="Nome obbligatorio";
    if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email)) e.email="Email non valida";
    return e;
  };

  const handleInvia=()=>{
    const e=validate(); if(Object.keys(e).length){setErr(e);return;}
    setLoading(true);
    (async()=>{
      try {
        if(window.FM_AUTH){
          await window.FM_AUTH.inviaRichiesta({nome:f.nome.trim(),email:f.email.trim().toLowerCase(),ruolo:f.ruolo,messaggio:f.messaggio||''});
        }
        setLoading(false); setStep(2);
      } catch(ex){
        console.error('[FM] inviaRichiesta error:', ex);
        setErr({form: ex.message||"Errore nell'invio della richiesta. Riprova."});
        setLoading(false);
      }
    })();
  };

  if(step===2) return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:22,alignItems:"center",textAlign:"center",paddingTop:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 954}}
      , React.createElement('div', { style: {width:64,height:64,borderRadius:"50%",background:C.greenBg,border:`2px solid ${C.greenBorder}`,
        display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 955}}
        , React.createElement(Ic, { n: "send", size: 28, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 957}})
      )
      , React.createElement('div', { style: {animation:"fadeUp .4s .1s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 959}}
        , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:26,fontWeight:600,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 960}}, "Richiesta inviata!"

        )
        , React.createElement('p', { style: {fontSize:14,color:C.textMuted,lineHeight:1.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 963}}, "La tua richiesta è stata inviata agli amministratori."
                 , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 964}}), "Riceverai un'email a "
             , React.createElement('strong', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 965}}, f.email), React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 965}}), "quando il tuo account sarà attivato."

        )
      )
      , React.createElement('div', { style: {background:C.goldBg,border:`1px solid rgba(26,79,160,0.25)`,borderRadius:10,
        padding:"12px 18px",animation:"fadeUp .4s .2s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 969}}
        , React.createElement('p', { style: {fontSize:12,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 971}}, "Solitamente l'attivazione avviene entro "
              , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 972}}, "24 ore" ), ".", React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 972}}), "Se non ricevi notizie, contatta l'amministratore."

        )
      )
      , React.createElement('button', { onClick: onBack,
        style: {padding:"12px 28px",borderRadius:10,background:"transparent",
          border:`1px solid ${C.border}`,color:C.textMuted,cursor:"pointer",
          fontSize:13,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:6,
          transition:"all .15s"},
        onMouseEnter: e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;},
        onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 976}}
        , React.createElement(Ic, { n: "left", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 983}}), "Torna al login"
      )
    )
  );

  return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 989}}
      , React.createElement('div', { className: "st1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 990}}
        , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
          border:"none",cursor:"pointer",color:C.textMuted,fontSize:12,fontFamily:"'Open Sans',sans-serif",
          marginBottom:16,padding:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 991}}
          , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 994}}), "Torna al login"
        )
        , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 996}}, "Richiedi accesso"

        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 999}}, "Compila il modulo. Un amministratore approverà la tua richiesta."

        )
      )

      , React.createElement('div', { className: "st2", style: {display:"flex",flexDirection:"column",gap:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1004}}
        , React.createElement(AuthInput, { label: "Nome completo *"  , icon: "user", value: f.nome,
          onChange: e=>{set("nome",e.target.value);setErr(p=>({...p,nome:""}));},
          error: err.nome, placeholder: "Es. Mario Rossi"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1005}})
        , React.createElement(AuthInput, { label: "Email *" , type: "email", icon: "mail", value: f.email,
          onChange: e=>{set("email",e.target.value);setErr(p=>({...p,email:""}));},
          error: err.email, placeholder: "mario@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1008}})
      )

      /* Ruolo */
      , React.createElement('div', { className: "st3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1014}}
        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1015}}, "Ruolo richiesto" )
        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1016}}
          , RUOLI.map(r=>(
            React.createElement('button', { key: r.id, onClick: ()=>set("ruolo",r.id),
              style: {display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,
                border:`1.5px solid ${f.ruolo===r.id?C.gold:C.border}`,
                background:f.ruolo===r.id?C.goldBg:C.surface2,
                cursor:"pointer",textAlign:"left",transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1018}}
              , React.createElement('div', { style: {width:8,height:8,borderRadius:"50%",
                background:f.ruolo===r.id?C.gold:C.border,flexShrink:0,transition:"background .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1023}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1025}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:f.ruolo===r.id?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1026}}, r.label)
                , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1027}}, r.desc)
              )
            )
          ))
        )
      )

      /* Messaggio */
      , React.createElement('div', { className: "st4", style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1035}}
        , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1036}}, "Messaggio (opzionale)"

        )
        , React.createElement('textarea', { value: f.messaggio, onChange: e=>set("messaggio",e.target.value), rows: 2,
          placeholder: "Presentati brevemente e spiega il tuo ruolo nell'accademia..."       ,
          style: {background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,
            color:C.text,fontSize:13,padding:"11px 14px",width:"100%",
            fontFamily:"'Open Sans',sans-serif",resize:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1039}})
      )

      , React.createElement('div', { className: "st5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1046}}
        , React.createElement('button', { className: "btn-gold", onClick: handleInvia, disabled: loading,
          style: {width:"100%",padding:"14px 0",borderRadius:12,border:"none",
            background:loading?C.goldDim:C.gold,color:"#ffffff",fontSize:14,fontWeight:600,
            cursor:loading?"not-allowed":"pointer",fontFamily:"'Open Sans',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1047}}
          , loading?(
            React.createElement('svg', { width: 18, height: 18, viewBox: "0 0 24 24"   , style: {animation:"spin 1s linear infinite"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1053}}
              , React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "none", stroke: "#ffffff", strokeWidth: "2.5", strokeDasharray: "31.4", strokeDashoffset: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1054}})
            )
          ):React.createElement(Ic, { n: "send", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1056}})
          , loading?"Invio in corso…":"Invia richiesta"
        )
      )
    )
  );
};

// ─── FORM REGISTRAZIONE BAND / SALA PROVE ────────────────────────────────────
const FormRegistrazioneBand = ({onBack})=>{
  const [step, setStep] = useState(1);
  const [f, setF] = useState({nome:"",email:"",nomeBand:"",telefono:"",messaggio:""});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const validate=()=>{
    const e={};
    if(!f.nome.trim()) e.nome="Nome obbligatorio";
    if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email)) e.email="Email non valida";
    return e;
  };

  const handleInvia=()=>{
    const e=validate(); if(Object.keys(e).length){setErr(e);return;}
    setLoading(true);
    (async()=>{
      try {
        if(window.FM_AUTH){
          const msg=[f.nomeBand?"Band: "+f.nomeBand:"",f.telefono?"Tel: "+f.telefono:"",f.messaggio||""].filter(Boolean).join(" · ");
          await window.FM_AUTH.inviaRichiesta({nome:f.nome.trim(),email:f.email.trim().toLowerCase(),ruolo:"band",messaggio:msg||"Richiesta accesso sala prove"});
        }
        setLoading(false); setStep(2);
      } catch(ex){ setErr({form:ex.message||"Errore. Riprova."}); setLoading(false); }
    })();
  };

  const inpS={width:"100%",padding:"10px 13px",border:"1px solid "+C.border,borderRadius:8,fontSize:13,color:C.text,background:C.bg,fontFamily:"'Open Sans',sans-serif",boxSizing:"border-box"};

  if(step===2) return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:22,alignItems:"center",textAlign:"center",paddingTop:20}}
    ,React.createElement("div",{style:{width:64,height:64,borderRadius:"50%",background:"rgba(234,88,12,0.1)",border:"2px solid rgba(234,88,12,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement(Ic,{n:"drum",size:28,stroke:C.orange2}))
    ,React.createElement("h2",{style:{fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:600}},"Richiesta inviata! 🎸")
    ,React.createElement("p",{style:{fontSize:13,color:C.textMuted,lineHeight:1.7}},"Riceverai un email a ",React.createElement("strong",null,f.email)," quando il tuo account sarà attivato.")
    ,React.createElement("div",{style:{background:"rgba(234,88,12,0.06)",border:"1px solid rgba(234,88,12,0.2)",borderRadius:10,padding:"12px 16px",fontSize:12,color:"#92400e",lineHeight:1.6,maxWidth:320,textAlign:"left"}}
      ,"🥁 Con l'account Sala Prove potrai vedere la disponibilità e prenotare la sala.")
    ,React.createElement("button",{onClick:onBack,style:{padding:"10px 24px",borderRadius:8,background:"transparent",border:"1px solid "+C.border,color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:6}},React.createElement(Ic,{n:"left",size:14,stroke:"currentColor"})," Torna al login")
  );

  return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:16}}
    ,React.createElement("div",null
      ,React.createElement("button",{onClick:onBack,style:{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:12,fontFamily:"'Open Sans',sans-serif",marginBottom:12,padding:0}},React.createElement(Ic,{n:"left",size:14,stroke:C.textMuted})," Torna al login")
      ,React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:4}}
        ,React.createElement("div",{style:{width:38,height:38,borderRadius:10,background:"rgba(234,88,12,0.1)",border:"1px solid rgba(234,88,12,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}},React.createElement(Ic,{n:"drum",size:19,stroke:C.orange2}))
        ,React.createElement("div",null
          ,React.createElement("h1",{style:{fontFamily:"'Oswald',sans-serif",fontSize:22,fontWeight:600,marginBottom:1}},"Prenota Sala Prove")
          ,React.createElement("p",{style:{fontSize:12,color:C.textMuted}},"Registrati — l'accesso sarà approvato dall'admin")
        )
      )
    )
    ,err.form&&React.createElement("div",{style:{background:C.redBg,border:"1px solid "+C.redBorder,borderRadius:8,padding:"9px 12px",fontSize:12,color:C.red}},err.form)
    ,React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:11}}
      ,React.createElement("div",null
        ,React.createElement("label",{style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:4}},"Nome e cognome *")
        ,React.createElement("input",{value:f.nome,onChange:e=>{set("nome",e.target.value);setErr(p=>({...p,nome:""}));},placeholder:"Es. Mario Rossi",style:inpS})
        ,err.nome&&React.createElement("div",{style:{fontSize:11,color:C.red,marginTop:2}},err.nome)
      )
      ,React.createElement("div",null
        ,React.createElement("label",{style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:4}},"Email *")
        ,React.createElement("input",{type:"email",value:f.email,onChange:e=>{set("email",e.target.value);setErr(p=>({...p,email:""}));},placeholder:"mario@esempio.it",style:inpS})
        ,err.email&&React.createElement("div",{style:{fontSize:11,color:C.red,marginTop:2}},err.email)
      )
      ,React.createElement("div",{className:"form-2col"}
        ,React.createElement("div",null
          ,React.createElement("label",{style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:4}},"Nome band")
          ,React.createElement("input",{value:f.nomeBand,onChange:e=>set("nomeBand",e.target.value),placeholder:"Es. The Rockets",style:inpS})
        )
        ,React.createElement("div",null
          ,React.createElement("label",{style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:4}},"Telefono")
          ,React.createElement("input",{type:"tel",value:f.telefono,onChange:e=>set("telefono",e.target.value),placeholder:"333 1234567",style:inpS})
        )
      )
      ,React.createElement("div",null
        ,React.createElement("label",{style:{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:4}},"Note (opzionale)")
        ,React.createElement("textarea",{value:f.messaggio,onChange:e=>set("messaggio",e.target.value),rows:2,placeholder:"Es. Prove settimanali, genere rock...",style:{...inpS,resize:"none"}})
      )
    )
    ,React.createElement("div",{style:{background:"rgba(234,88,12,0.06)",border:"1px solid rgba(234,88,12,0.2)",borderRadius:10,padding:"9px 13px",fontSize:12,color:"#92400e",lineHeight:1.6}},"ℹ️ Dopo l'approvazione riceverai le credenziali via email. Potrai vedere la disponibilità e prenotare la sala.")
    ,React.createElement("button",{onClick:handleInvia,disabled:loading,style:{width:"100%",padding:"12px 0",borderRadius:8,border:"none",background:loading?"rgba(234,88,12,0.5)":C.orange2,color:"#fff",fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
      ,loading?"Invio in corso…":React.createElement(React.Fragment,null,React.createElement(Ic,{n:"send",size:14,stroke:"#fff"})," Invia richiesta")
    )
  );
};


// ─── FORM RECUPERO PASSWORD ───────────────────────────────────────────────────
const FormRecupero = ({onBack})=>{
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [err,     setErr]     = useState("");

  const handleInvia=()=>{
    if(!email.trim()||!/\S+@\S+\.\S+/.test(email)){setErr("Email non valida");return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);setSent(true);},1000);
  };

  if(sent) return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20,alignItems:"center",textAlign:"center",paddingTop:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1078}}
      , React.createElement('div', { style: {width:60,height:60,borderRadius:"50%",background:C.greenBg,border:`2px solid ${C.greenBorder}`,
        display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1079}}
        , React.createElement(Ic, { n: "mail", size: 26, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1081}})
      )
      , React.createElement('div', { style: {animation:"fadeUp .4s .1s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1083}}
        , React.createElement('h2', { style: {fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:600,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1084}}, "Email inviata" )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1085}}, "Se l'account esiste, riceverai le istruzioni"
               , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1086}}), "per reimpostare la password a"    , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1086}})
          , React.createElement('strong', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1087}}, email)
        )
      )
      , React.createElement('button', { onClick: onBack,
        style: {padding:"11px 24px",borderRadius:10,background:"transparent",
          border:`1px solid ${C.border}`,color:C.textMuted,cursor:"pointer",
          fontSize:13,fontFamily:"'Open Sans',sans-serif",display:"flex",alignItems:"center",gap:6,
          transition:"all .15s"},
        onMouseEnter: e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;},
        onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1090}}
        , React.createElement(Ic, { n: "left", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1097}}), "Torna al login"
      )
    )
  );

  return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1103}}
      , React.createElement('div', { className: "st1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1104}}
        , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
          border:"none",cursor:"pointer",color:C.textMuted,fontSize:12,fontFamily:"'Open Sans',sans-serif",
          marginBottom:16,padding:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1105}}
          , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1108}}), "Torna al login"
        )
        , React.createElement('h1', { style: {fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1110}}, "Password dimenticata?"

        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1113}}, "Inserisci la tua email e ti invieremo un link per reimpostare la password."

        )
      )
      , React.createElement('div', { className: "st2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1117}}
        , React.createElement(AuthInput, { label: "Indirizzo email" , type: "email", icon: "mail", value: email,
          onChange: e=>{setEmail(e.target.value);setErr("");},
          error: err, placeholder: "nome@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1118}})
      )
      , React.createElement('div', { className: "st3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1122}}
        , React.createElement('button', { className: "btn-gold", onClick: handleInvia, disabled: loading,
          style: {width:"100%",padding:"14px 0",borderRadius:12,border:"none",
            background:loading?C.goldDim:C.gold,color:"#ffffff",fontSize:14,fontWeight:600,
            cursor:loading?"not-allowed":"pointer",fontFamily:"'Open Sans',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1123}}
          , loading?(
            React.createElement('svg', { width: 18, height: 18, viewBox: "0 0 24 24"   , style: {animation:"spin 1s linear infinite"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1129}}
              , React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "none", stroke: "#ffffff", strokeWidth: "2.5", strokeDasharray: "31.4", strokeDashoffset: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1130}})
            )
          ):React.createElement(Ic, { n: "send", size: 14, stroke: "#ffffff", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1132}})
          , loading?"Invio in corso…":"Invia link di reset"
        )
      )
    )
  );
};

// ─── APP ─────────────────────────────────────────────────────────────────────


// ════════════════════════════════════════════════════════════════════════════════

// DASHBOARD

// ════════════════════════════════════════════════════════════════════════════════

// ─── COSTANTI ─────────────────────────────────────────────────────────────────
// ─── FORM IMPOSTA PASSWORD (da link invito/reset) ─────────────────────────────
const FormSetPassword = ({onSuccess}) => {
  const [pw1,     setPw1]     = useState("");
  const [pw2,     setPw2]     = useState("");
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");
  const [done,    setDone]    = useState(false);

  const handleSave = async () => {
    if (pw1.length < 8) { setErr("La password deve essere di almeno 8 caratteri"); return; }
    if (pw1 !== pw2)    { setErr("Le password non coincidono"); return; }
    setLoading(true); setErr("");
    try {
      const sb = window.supabaseClient;
      const { error } = await sb.auth.updateUser({ password: pw1 });
      if (error) throw error;
      setDone(true);
      setTimeout(() => onSuccess(), 2000);
    } catch(e) {
      setErr(e.message || "Errore durante il salvataggio");
      setLoading(false);
    }
  };

  if (done) return (
    React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:20,alignItems:"center",textAlign:"center",paddingTop:16}}
      , React.createElement('div', {style:{width:60,height:60,borderRadius:"50%",background:C.greenBg,border:`2px solid ${C.greenBorder}`,
          display:"flex",alignItems:"center",justifyContent:"center"}}
        , React.createElement(Ic, {n:"check",size:26,stroke:C.green})
      )
      , React.createElement('div', null
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:600,marginBottom:8}}, "Password impostata!")
        , React.createElement('p', {style:{fontSize:13,color:C.textMuted,lineHeight:1.7}}, "Accesso in corso...")
      )
    )
  );

  return (
    React.createElement('div', {style:{display:"flex",flexDirection:"column",gap:22}}
      , React.createElement('div', null
        , React.createElement('h2', {style:{fontFamily:"'Oswald',sans-serif",fontSize:28,fontWeight:600,marginBottom:6}}, "Imposta la password")
        , React.createElement('p', {style:{fontSize:13,color:C.textMuted,lineHeight:1.6}}, "Scegli una password per accedere al portale.")
      )
      , React.createElement(Input, {label:"Nuova password *", type:"password",
          value:pw1, onChange:e=>{setPw1(e.target.value);setErr("");}})
      , React.createElement(Input, {label:"Conferma password *", type:"password",
          value:pw2, onChange:e=>{setPw2(e.target.value);setErr("");}})
      , err && React.createElement('div', {style:{fontSize:12,color:C.red,background:C.redBg,
          border:`1px solid ${C.redBorder}`,borderRadius:8,padding:"10px 14px"}}, err)
      , React.createElement('button', {onClick:handleSave, disabled:loading,
          style:{padding:"13px",borderRadius:10,background:C.gold,border:"none",
            color:"#ffffff",cursor:loading?"not-allowed":"pointer",fontSize:14,
            fontWeight:600,fontFamily:"'Open Sans',sans-serif",opacity:loading?0.7:1}}
        , loading ? "Salvataggio..." : "Imposta password e accedi"
      )
    )
  );
};


const oggi   = new Date();

(function(){
try{
const _jsxFileName = ""; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// React hooks are available globally via window.React when loaded via CDN
const { useState, useEffect, useMemo } = React;

// ═══════════════════════════════════════════════════════════════════════════════
// TEMA CONDIVISO
// ═══════════════════════════════════════════════════════════════════════════════
const C = {
  bg:"#0f0e0c", surface:"#1a1815", surfaceHover:"#1f1d1a", surface2:"#141210",
  border:"#2a2520", borderHover:"#3d372e",
  gold:"#c9a84c", goldDim:"#7a6430", goldBg:"#2e2308", goldLight:"#e8c76a",
  text:"#f0ead8", textMuted:"#8a8070", textDim:"#4a4438",
  green:"#4ade80", greenBg:"#0a2016", greenBorder:"#14532d",
  red:"#f87171",  redBg:"#2a0d0d",   redBorder:"#7f1d1d",
  blue:"#60a5fa", blueBg:"#0d1a2e",  blueBorder:"#1e3a5f",
  orange:"#fb923c",orangeBg:"#2a1508",orangeBorder:"#9a3412",
  purple:"#c084fc",purpleBg:"#1a0d2e",purpleBorder:"#6b21a8",
  teal:"#2dd4bf", tealBg:"#0a2420",  tealBorder:"#0f766e",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;background:${C.bg};}
  body{color:${C.text};font-family:'DM Sans',sans-serif;overflow-x:hidden;}
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
    .main-scroll{padding-bottom:72px!important;}

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
    .settings-form-2col{grid-template-columns:1fr!important;}
  }
  @media (max-width:700px){
    .settings-form-2col{grid-template-columns:1fr!important;}
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

  /* Safe area + sticky footer fix per iOS */
  .modal-resp { padding-bottom: env(safe-area-inset-bottom, 0px); }
  .modal-footer-safe { padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)) !important; }
  /* Sticky footer in form: visible above safe area */
  [style*="position:\"sticky\""][style*="bottom:0"] {
    padding-bottom: max(12px, env(safe-area-inset-bottom, 12px)) !important;
  }

  /* Settings drawer responsive */
  @media (max-width: 540px) {
    .settings-tabs button { font-size: 11px !important; padding: 10px 4px !important; }
    .settings-tabs button span { display: none; }
  }
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
    users:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}), React.createElement('circle', { cx: "9", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}), React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}})),
    music:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M9 18V5l12-2v13" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}), React.createElement('circle', { cx: "6", cy: "18", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}), React.createElement('circle', { cx: "18", cy: "16", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}})),
    note:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M9 18V5l12-2v13" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}), React.createElement('circle', { cx: "6", cy: "18", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}), React.createElement('circle', { cx: "18", cy: "16", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}})),
    calendar: React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}), React.createElement('line', { x1: "16", y1: "2", x2: "16", y2: "6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}), React.createElement('line', { x1: "8", y1: "2", x2: "8", y2: "6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}), React.createElement('line', { x1: "3", y1: "10", x2: "21", y2: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}})),
    cal:      React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "17", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}), React.createElement('path', { d: "M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}})),
    euro:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 10h12M4 14h12M19 6a7 7 0 1 0 0 12"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}})),
    euro2:    React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}), React.createElement('path', { d: "M15 9.354a4 4 0 1 0 0 5.292M8.5 10H13M8.5 14H13"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}})),
    chart:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M3 3v18h18" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}), React.createElement('path', { d: "m19 9-5 5-4-4-3 3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}})),
    alert:    React.createElement(React.Fragment, null, React.createElement('path', { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}), React.createElement('line', { x1: "12", y1: "9", x2: "12", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}), React.createElement('line', { x1: "12", y1: "17", x2: "12.01", y2: "17", __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}})),
    warn:     React.createElement(React.Fragment, null, React.createElement('path', { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}), React.createElement('line', { x1: "12", y1: "9", x2: "12", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}), React.createElement('line', { x1: "12", y1: "17", x2: "12.01", y2: "17", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}})),
    check:    React.createElement('path', { d: "M20 6 9 17l-5-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}),
    clock:    React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}), React.createElement('polyline', { points: "12 6 12 12 16 14"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}})),
    user:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}), React.createElement('circle', { cx: "12", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}})),
    solo:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}), React.createElement('circle', { cx: "12", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}})),
    group:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}), React.createElement('circle', { cx: "9", cy: "7", r: "4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}), React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}})),
    up:       React.createElement(React.Fragment, null, React.createElement('path', { d: "m5 12 7-7 7 7"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}), React.createElement('path', { d: "M12 19V5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}})),
    down:     React.createElement(React.Fragment, null, React.createElement('path', { d: "m19 12-7 7-7-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}), React.createElement('path', { d: "M12 5v14" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}})),
    star:     React.createElement('polygon', { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"                     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}),
    flag:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}), React.createElement('line', { x1: "4", y1: "22", x2: "4", y2: "15", __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}})),
    pin:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}), React.createElement('circle', { cx: "12", cy: "10", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}})),
    bell:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}), React.createElement('path', { d: "M13.73 21a2 2 0 0 1-3.46 0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}})),
    plus:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 5v14M5 12h14"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}})),
    grid:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}), React.createElement('rect', { x: "14", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}), React.createElement('rect', { x: "14", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}), React.createElement('rect', { x: "3", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}})),
    settings: React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}), React.createElement('path', { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"                                                                                                                                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}})),
    receipt:  React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}), React.createElement('path', { d: "M16 8H8M16 12H8M12 16H8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}})),
    x:        React.createElement(React.Fragment, null, React.createElement('path', { d: "M18 6 6 18"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}), React.createElement('path', { d: "m6 6 12 12"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}})),
    chevD:    React.createElement('path', { d: "m6 9 6 6 6-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}),
    info:     React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}), React.createElement('path', { d: "M12 16v-4M12 8h.01"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}})),
    edit:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}), React.createElement('path', { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}})),
    trash:    React.createElement(React.Fragment, null, React.createElement('polyline', { points: "3 6 5 6 21 6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}), React.createElement('path', { d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}), React.createElement('path', { d: "M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}})),
    search:   React.createElement(React.Fragment, null, React.createElement('circle', { cx: "11", cy: "11", r: "8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}}), React.createElement('path', { d: "m21 21-4.35-4.35" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}})),
    back:     React.createElement('path', { d: "m15 18-6-6 6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}),
    arrow:    React.createElement('path', { d: "m9 18 6-6-6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}),
    right:    React.createElement('path', { d: "m9 18 6-6-6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}),
    left:     React.createElement('path', { d: "m15 18-6-6 6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}),
    mail:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}), React.createElement('polyline', { points: "22,6 12,13 2,6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}})),
    lock:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "11", width: "18", height: "11", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}), React.createElement('path', { d: "M7 11V7a5 5 0 0 1 10 0v4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}})),
    eye:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}), React.createElement('circle', { cx: "12", cy: "12", r: "3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}})),
    eyeOff:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"                                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}), React.createElement('line', { x1: "1", y1: "1", x2: "23", y2: "23", __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}})),
    send:     React.createElement(React.Fragment, null, React.createElement('line', { x1: "22", y1: "2", x2: "11", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}), React.createElement('polygon', { points: "22 2 15 22 11 13 2 9 22 2"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}})),
    shield:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}})),
    filter:   React.createElement('polygon', { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}),
    phone:    React.createElement('path', { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.19 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"                                                            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}),
    tag:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}), React.createElement('line', { x1: "7", y1: "7", x2: "7.01", y2: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}})),
    repeat:   React.createElement(React.Fragment, null, React.createElement('polyline', { points: "17 1 21 5 17 9"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}), React.createElement('path', { d: "M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}), React.createElement('path', { d: "M21 13v2a4 4 0 0 1-4 4H3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}})),
    day:      React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "17", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}), React.createElement('path', { d: "M16 2v4M8 2v4M3 10h18"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}), React.createElement('rect', { x: "8", y: "14", width: "8", height: "5", rx: "1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}})),
    week:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "17", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}), React.createElement('path', { d: "M16 2v4M8 2v4M3 10h18M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2M15 17h2"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}})),
    today:    React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "4", width: "18", height: "17", rx: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}), React.createElement('path', { d: "M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}})),
    courses:  React.createElement('path', { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}),
    list:     React.createElement(React.Fragment, null, React.createElement('path', { d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}})),
    ban:      React.createElement(React.Fragment, null, React.createElement('circle', { cx: "12", cy: "12", r: "10", __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}), React.createElement('line', { x1: "4.93", y1: "4.93", x2: "19.07", y2: "19.07", __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}})),
    unlock:   React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}), React.createElement('path', { d: "M7 11V7a5 5 0 0 1 9.9-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}})),
    copy:     React.createElement(React.Fragment, null, React.createElement('rect', { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}), React.createElement('path', { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}})),
    mic:      React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}), React.createElement('path', { d: "M19 10v2a7 7 0 0 1-14 0v-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}), React.createElement('line', { x1: "12", y1: "19", x2: "12", y2: "23", __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}), React.createElement('line', { x1: "8", y1: "23", x2: "16", y2: "23", __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}})),
    ticket:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"                                   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}})),
    star2:    React.createElement(React.Fragment, null, React.createElement('path', { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}})),
    map:      React.createElement(React.Fragment, null, React.createElement('polygon', { points: "3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}), React.createElement('line', { x1: "9", y1: "3", x2: "9", y2: "18", __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}), React.createElement('line', { x1: "15", y1: "6", x2: "15", y2: "21", __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}})),
    qr:       React.createElement(React.Fragment, null, React.createElement('rect', { x: "3", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "14", y: "3", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "14", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "3", y: "14", width: "7", height: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "5", y: "5", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "16", y: "5", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "16", y: "16", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}), React.createElement('rect', { x: "5", y: "16", width: "3", height: "3", fill: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}})),
    report:   React.createElement(React.Fragment, null, React.createElement('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}), React.createElement('polyline', { points: "14 2 14 8 20 8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}), React.createElement('line', { x1: "16", y1: "13", x2: "8", y2: "13", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}), React.createElement('line', { x1: "16", y1: "17", x2: "8", y2: "17", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}), React.createElement('polyline', { points: "10 9 9 9 8 9"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}})),
  };
  return (
    React.createElement('svg', { width: size, height: size, viewBox: "0 0 24 24"   , fill: fill,
      stroke: stroke, strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}
      , p[n] || null
    )
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVI CONDIVISI
// ═══════════════════════════════════════════════════════════════════════════════
const uid = () => "id_" + Date.now() + "_" + Math.floor(Math.random()*10000);

const initials = (nome) => nome ? nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() : "??";
const age = (dataN) => { if(!dataN) return "—"; const d=new Date(dataN); const now=new Date(); let a=now.getFullYear()-d.getFullYear(); if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))a--; return a; };
const fmtDate = (s) => { if(!s) return "—"; const d=new Date(s+"T00:00:00"); return d.toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric"}); };
const yyyymmdd = (d) => d.toISOString().split("T")[0];

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
      textTransform:"uppercase",whiteSpace:"nowrap",display:"inline-block"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}
      , lbl
    )
  );
};

const Btn = ({ children, onClick, variant:_variantRaw, small:_smallRaw, danger:_dangerRaw, disabled:_disabledRaw, style:_extraStyleRaw }) => {
  const variant = _variantRaw||"primary"; const small=_smallRaw||false; const danger=_dangerRaw||false; const disabled=_disabledRaw||false; const extraStyle=_extraStyleRaw||{};
  const base = {display:"flex",alignItems:"center",gap:6,border:"none",borderRadius:8,
    cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,
    transition:"all 0.15s",opacity:disabled?0.5:1,fontSize:small?12:13,
    padding:small?"6px 12px":"10px 18px"};
  const v = {
    primary:   {background:C.gold,color:C.bg},
    secondary: {background:"transparent",color:C.textMuted,border:`1px solid ${C.border}`},
    ghost:     {background:"transparent",color:C.textMuted},
    danger:    {background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`},
  };
  return React.createElement('button', { onClick: disabled?undefined:onClick, style: {...base,...v[danger?"danger":variant],...extraStyle}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, children);
};

const Input = ({ label, error, ...props }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}
    , label && React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}, label)
    , React.createElement('input', { style: {background:C.surface,border:`1px solid ${error?C.red:C.border}`,borderRadius:8,
      color:C.text,fontSize:14,padding:"10px 14px",width:"100%",fontFamily:"'DM Sans',sans-serif"}, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}})
    , error && React.createElement('span', { style: {fontSize:11,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}, error)
  )
);

const Sel = ({ label, options:_optionsRaw, error, value, onChange, ...props }) => {
  const options = _optionsRaw || [];
  return (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}
    , label && React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, label)
    , React.createElement('select', { value: value, onChange: onChange,
      style: {background:C.surface,border:`1px solid ${error?C.red:C.border}`,borderRadius:8,
        color:C.text,fontSize:14,padding:"10px 14px",width:"100%",
        fontFamily:"'DM Sans',sans-serif",appearance:"none"}, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}
      , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}, "— seleziona —"  )
      , options.map(o=>React.createElement('option', { key: o.value||o, value: o.value||o, __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}, o.label||o))
    )
    , error && React.createElement('span', { style: {fontSize:11,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, error)
  )
);
}

const Textarea = ({ label, ...props }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}
    , label && React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}, label)
    , React.createElement('textarea', { rows: 3, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
      color:C.text,fontSize:14,padding:"10px 14px",width:"100%",
      fontFamily:"'DM Sans',sans-serif",resize:"vertical"}, ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}})
  )
);

const Modal = ({ title, onClose, children, footer, wide=false }) => (
  React.createElement('div', { className: "modal-resp-outer", style: {position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end",
    justifyContent:"center",padding:"0"}, onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}
    , React.createElement('div', { style: {position:"absolute",inset:0,background:"rgba(0,0,0,0.78)",
      backdropFilter:"blur(4px)",animation:"overlayIn 0.2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}})
    , React.createElement('div', { onClick: e=>e.stopPropagation(), className: "modal-resp" + (wide?" modal-wide":""),
      style: {position:"relative",background:C.surface,
      border:`1px solid ${C.border}`,borderRadius:"16px 16px 0 0",width:"100%",
      maxWidth:wide?900:520,
      maxHeight:"min(94svh, calc(100svh - env(safe-area-inset-bottom, 0px) - 8px))",
      margin:"0 auto",
      boxSizing:"border-box",
      display:"flex",flexDirection:"column",animation:"fadeUp 0.25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
      /* Intestazione fissa */
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"14px 20px",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}
        , React.createElement('h2', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,margin:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}, title)
        , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
          color:C.textMuted,display:"flex",padding:4,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}
          , React.createElement(Ic, { n: "x", size: 18, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}})
        )
      )
      /* Contenuto scrollabile — i footer sticky funzionano dentro questo div */
      , React.createElement('div', { style: {overflow:"auto",flex:1,WebkitOverflowScrolling:"touch",
        display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}}
        , children
      )
      /* Footer opzionale fisso fuori dallo scroll */
      , footer && (
        React.createElement('div', { style: {flexShrink:0,borderTop:`1px solid ${C.border}`,
          paddingBottom:"env(safe-area-inset-bottom, 12px)",
          background:C.surface}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 453}}
          , footer
        )
      )
    )
  )
);

const Toggle = ({ value, checked, onChange, label }) => (
  React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,cursor:"pointer"},
    onClick: ()=>onChange(!(checked!==undefined?checked:!!value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 464}}
    , React.createElement('div', { style: {width:38,height:21,borderRadius:11,
      background:(checked!==undefined?checked:!!value)?C.gold:C.border,
      position:"relative",transition:"background 0.2s",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
      , React.createElement('div', { style: {width:15,height:15,borderRadius:"50%",background:C.bg,
        boxShadow:"0 1px 3px rgba(0,0,0,0.4)",position:"absolute",top:3,
        left:(checked!==undefined?checked:!!value)?20:3,transition:"left 0.2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 469}})
    )
    , label&&React.createElement('span', { style: {fontSize:13,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}, label)
  )
);

const Avatar = ({ initials:ini, hex=C.gold, size=36 }) => (
  React.createElement('div', { style: {width:size,height:size,borderRadius:"50%",background:`${hex}20`,
    border:`1.5px solid ${hex}40`,display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*0.35,fontWeight:700,color:hex,flexShrink:0,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
    , ini
  )
);

const Field = ({ label, children }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}
    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}, label)
    , children
  )
);

const SectionDivider = ({ label }) => (
  React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,margin:"8px 0 4px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}
    , React.createElement('div', { style: {flex:1,height:1,background:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}})
    , React.createElement('span', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 495}}, label)
    , React.createElement('div', { style: {flex:1,height:1,background:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}})
  )
);

const ConfirmDel = ({ title="Conferma eliminazione", testo, label, description, onConfirm, onClose }) => (
  React.createElement(Modal, { title: title, onClose: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 501}}
    , React.createElement('div', { style: {padding:24,display:"flex",flexDirection:"column",gap:16,alignItems:"center",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}
      , React.createElement('div', { style: {width:56,height:56,borderRadius:"50%",background:C.redBg,
        border:`1px solid ${C.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}
        , React.createElement(Ic, { n: "warn", size: 24, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}})
      )
      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}
        , label && React.createElement('p', { style: {fontSize:16,fontWeight:500,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}, "Eliminare "
           , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}}, label), "?"
        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}, testo||description||"Questa azione è irreversibile.")
      )
    )
    , React.createElement('div', { style: {padding:"16px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}
      , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 515}}, "Annulla")
      , React.createElement(Btn, { danger: true, onClick: onConfirm, __self: this, __source: {fileName: _jsxFileName, lineNumber: 516}}, React.createElement(Ic, { n: "trash", size: 14, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 516}}), "Conferma")
    )
  )
);

// ─── RICEVUTA MODAL + PRINT ───────────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  body > * { display: none !important; }
  #ricevuta-print-root { display: block !important; }
  @page { margin: 18mm 20mm; size: A4; }
}
#ricevuta-print-root {
  display: none;
  font-family: 'DM Sans', Arial, sans-serif;
  color: #1a1a2e;
  background: #fff;
}
.ric-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; border-bottom: 2px solid #c9a84c; padding-bottom: 16px; }
.ric-logo   { font-size: 22px; font-weight: 700; letter-spacing: 0.03em; }
.ric-scuola-sub { font-size: 11px; color: #666; margin-top: 2px; letter-spacing: 0.06em; text-transform: uppercase; }
.ric-num    { text-align: right; }
.ric-num .num { font-size: 28px; font-weight: 700; color: #c9a84c; line-height: 1; }
.ric-num .lbl { font-size: 10px; color: #888; letter-spacing: 0.1em; text-transform: uppercase; }
.ric-body   { margin-bottom: 24px; }
.ric-row    { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
.ric-row:last-child { border-bottom: none; }
.ric-row .k { color: #666; }
.ric-row .v { font-weight: 600; }
.ric-importo { text-align: center; margin: 28px 0; padding: 20px; border: 2px solid #c9a84c; border-radius: 8px; }
.ric-importo .val { font-size: 42px; font-weight: 700; color: #c9a84c; font-family: 'Cormorant Garamond', Georgia, serif; }
.ric-importo .lbl { font-size: 11px; color: #888; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }
.ric-footer { font-size: 10px; color: #888; text-align: center; margin-top: 32px; padding-top: 12px; border-top: 1px solid #ddd; line-height: 1.6; }
.ric-firma  { margin-top: 40px; display: flex; justify-content: space-between; }
.ric-firma-box { text-align: center; width: 180px; }
.ric-firma-line { border-top: 1px solid #333; margin-bottom: 6px; }
.ric-firma-lbl  { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
`;

const RicevutaModal = ({ entrata, student, config, onClose }) => {
  const cfg = config || CONFIG_DEFAULT;
  // Numero ricevuta: usa quello salvato sull'entrata, oppure genera al volo (legacy/anteprima)
  const numRic = entrata.numRicevuta || (String(cfg.progressivoRicevute||1).padStart(3,"0") + "/" + (entrata.anno||new Date().getFullYear()));
  // Intestatario: nomeRicevuta dell'allievo (genitore/tutore per minorenni), fallback al nome allievo
  const intestatario = _optionalChain([student, 'optionalAccess', _2 => _2.nomeRicevuta, 'optionalAccess', _3 => _3.trim, 'call', _4 => _4()]) || _optionalChain([student, 'optionalAccess', _5 => _5.name]) || entrata.studentName || "—";
  const MESI_N = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const dataStampa = new Date().toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit",year:"numeric"});
  const dataPag    = entrata.data ? new Date(entrata.data+"T00:00:00").toLocaleDateString("it-IT") : dataStampa;
  const meseLabel  = entrata.mese ? MESI_N[entrata.mese-1]+" "+(entrata.anno||new Date().getFullYear()) : "";
  const importoStr = `€ ${(entrata.importo||0).toLocaleString("it-IT",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

  const handlePrint = () => {
    // inject print css once
    if(!document.getElementById("ric-print-style")) {
      const s = document.createElement("style");
      s.id = "ric-print-style";
      s.innerHTML = PRINT_CSS;
      document.head.appendChild(s);
    }
    // create / update print root
    let root = document.getElementById("ricevuta-print-root");
    if(!root) { root = document.createElement("div"); root.id = "ricevuta-print-root"; document.body.appendChild(root); }
    const indirizzoHtml = cfg.indirizzo ? '<div style="font-size:11px;color:#666;margin-top:4px">'+cfg.indirizzo+'</div>' : '';
    const cfHtml = cfg.codiceFiscale ? '<div style="font-size:11px;color:#666">CF: '+cfg.codiceFiscale+'</div>' : '';
    const nascitaHtml = _optionalChain([student, 'optionalAccess', _6 => _6.birthdate]) ? '<div class="ric-row"><span class="k">Data di nascita</span><span class="v">'+new Date(student.birthdate+'T00:00:00').toLocaleDateString('it-IT')+'</span></div>' : '';
    const mesesHtml = meseLabel ? '<div class="ric-row"><span class="k">Competenza</span><span class="v">'+meseLabel+'</span></div>' : '';
    root.innerHTML = `
      <div class="ric-header">
        <div>
          <div class="ric-logo">${cfg.nomeScuola||'Accademia Musicale'}</div>
          <div class="ric-scuola-sub">${cfg.tipoEnte||''}</div>
          ${indirizzoHtml}
          ${cfHtml}
        </div>
        <div class="ric-num">
          <div class="lbl">Ricevuta n°</div>
          <div class="num">${numRic}</div>
          <div style="font-size:11px;color:#888;margin-top:4px">del ${dataStampa}</div>
        </div>
      </div>
      <div class="ric-body">
        <div class="ric-row"><span class="k">Ricevuta da</span><span class="v">${intestatario}</span></div>
        ${nascitaHtml}
        <div class="ric-row"><span class="k">Data pagamento</span><span class="v">${dataPag}</span></div>
        <div class="ric-row"><span class="k">Descrizione</span><span class="v">${entrata.desc||'Quota mensile'}</span></div>
        ${mesesHtml}
        <div class="ric-row"><span class="k">Metodo di pagamento</span><span class="v">${entrata.metodo||'—'}</span></div>
      </div>
      <div class="ric-importo">
        <div class="val">${importoStr}</div>
        <div class="lbl">Importo ricevuto</div>
      </div>
      <div class="ric-firma">
        <div class="ric-firma-box">
          <div class="ric-firma-line"></div>
          <div class="ric-firma-lbl">Il pagante</div>
        </div>
        <div class="ric-firma-box">
          <div class="ric-firma-line"></div>
          <div class="ric-firma-lbl">Il cassiere / responsabile</div>
        </div>
      </div>
      <div class="ric-footer">${cfg.notaRicevuta||'Ricevuta non fiscale'}<br/>${cfg.nomeScuola} · ${cfg.annoScolastico||''}</div>
    `;
    window.print();
  };

  const rows = [
    {k:"Ricevuta n°",         v: numRic},
    {k:"Data stampa",          v: dataStampa},
    {k:"Nominativo",           v: intestatario},
    {k:"Data pagamento",       v: dataPag},
    {k:"Descrizione",          v: entrata.desc||"Quota mensile"},
    ...(meseLabel ? [{k:"Competenza",   v: meseLabel}] : []),
    {k:"Metodo",               v: entrata.metodo||"—"},
  ];

  return (
    React.createElement(Modal, { title: "Anteprima ricevuta" , onClose: onClose, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}
      , React.createElement('div', { style: {padding:"20px 24px",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 635}}

        /* Preview card */
        , React.createElement('div', { style: {background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",
          boxShadow:"0 4px 24px rgba(0,0,0,0.18)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 638}}
          /* Header ricevuta */
          , React.createElement('div', { style: {background:`linear-gradient(135deg,${C.goldBg},#fff)`,
            borderBottom:`2px solid ${C.gold}`,padding:"18px 24px",
            display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 641}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"#1a1a2e",lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 645}}
                , cfg.nomeScuola
              )
              , cfg.tipoEnte && React.createElement('div', { style: {fontSize:10,color:"#888",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}}, cfg.tipoEnte)
              , cfg.indirizzo && React.createElement('div', { style: {fontSize:11,color:"#666",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}, cfg.indirizzo)
              , cfg.codiceFiscale && React.createElement('div', { style: {fontSize:11,color:"#666"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 650}}, "CF: " , cfg.codiceFiscale)
            )
            , React.createElement('div', { style: {textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}
              , React.createElement('div', { style: {fontSize:10,color:"#888",letterSpacing:"0.1em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}, "Ricevuta n°" )
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.gold,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}}, numRic)
              , React.createElement('div', { style: {fontSize:11,color:"#888",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}, "del " , dataStampa)
            )
          )
          /* Body */
          , React.createElement('div', { style: {padding:"0 24px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}
            , rows.map((r,i)=>(
              React.createElement('div', { key: i, style: {display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 0",borderBottom:i<rows.length-1?"1px solid #eee":"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 661}}
                , React.createElement('span', { style: {fontSize:12,color:"#666"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 663}}, r.k)
                , React.createElement('span', { style: {fontSize:13,fontWeight:600,color:"#1a1a2e"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 664}}, r.v)
              )
            ))
          )
          /* Importo */
          , React.createElement('div', { style: {margin:"16px 24px",padding:"18px",textAlign:"center",
            border:`2px solid ${C.gold}`,borderRadius:10,background:C.goldBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}
            , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700,color:C.gold,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}
              , importoStr
            )
            , React.createElement('div', { style: {fontSize:10,color:"#888",letterSpacing:"0.12em",textTransform:"uppercase",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 674}}, "Importo ricevuto" )
          )
          /* Footer */
          , React.createElement('div', { style: {padding:"12px 24px 16px",borderTop:"1px solid #eee",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 677}}
            , React.createElement('div', { style: {fontSize:11,color:"#888",lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}, cfg.notaRicevuta)
            , React.createElement('div', { style: {fontSize:10,color:"#aaa",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}}, cfg.nomeScuola, " · "  , cfg.annoScolastico)
          )
        )

        , React.createElement('div', { style: {display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 683}}
          , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}, "Chiudi")
          , React.createElement(Btn, { onClick: handlePrint, __self: this, __source: {fileName: _jsxFileName, lineNumber: 685}}
            , React.createElement(Ic, { n: "receipt", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 686}}), "Stampa ricevuta"
          )
        )
      )
    )
  );
};

// SField usato dal SettingsDrawer della dashboard
const SField = ({ label, sub, ...props }) => (
  React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}}
    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 697}}, label)
    , sub && React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:-3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 698}}, sub)
    , React.createElement('input', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
      color:C.text,fontSize:13,padding:"9px 13px",width:"100%",fontFamily:"'DM Sans',sans-serif"},
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 699}})
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
    React.createElement('div', { className: "inp", style: {display:"flex",flexDirection:"column",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 719}}
      , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:500,transition:"color .2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}, label)
      , React.createElement('div', { style: {display:"flex",alignItems:"center",background:C.surface2,border:`1px solid ${error?C.red:C.border}`,
        borderRadius:10,overflow:"hidden",transition:"border-color .2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 721}}
        , icon&&React.createElement('div', { style: {padding:"0 12px",color:C.textDim,flexShrink:0,display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}, React.createElement(Ic, { n: icon, size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}))
        , React.createElement('input', { type: t, value: value, onChange: onChange,
          style: {flex:1,background:"transparent",border:"none",color:C.text,fontSize:14,
            padding:icon?"11px 0":"11px 14px",fontFamily:"'DM Sans',sans-serif",width:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 724}})
        , type==="password"&&(
          React.createElement('button', { onClick: ()=>setShow(p=>!p), style: {background:"none",border:"none",cursor:"pointer",
            padding:"0 13px",color:C.textDim,display:"flex",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 728}}
            , React.createElement(Ic, { n: show?"eyeOff":"eye", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 730}})
          )
        )
        , right&&React.createElement('div', { style: {padding:"0 12px",color:C.textDim,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 733}}, right)
      )
      , error&&React.createElement('span', { style: {fontSize:11,color:C.red,display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 735}}
        , React.createElement(Ic, { n: "alert", size: 12, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 736}}), error
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
    React.createElement('div', { style: {flex:"0 0 46%",background:`linear-gradient(160deg,#1a160f 0%,#0f0e0c 40%,#1c1409 100%)`,
      position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",
      justifyContent:"space-between",padding:"48px 52px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 756}}

      /* Righe pentagramma */
      , React.createElement('div', { style: {position:"absolute",inset:0,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 761}}
        , righeDecorative.map((i)=>(
          React.createElement('div', { key: i, style: {position:"absolute",left:0,right:0,
            top:`${30+i*8}%`,height:"1px",
            background:`linear-gradient(90deg,transparent 0%,${C.goldDim}30 20%,${C.goldDim}30 80%,transparent 100%)`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 763}})
        ))
      )

      /* Cerchio decorativo grande */
      , React.createElement('div', { style: {position:"absolute",right:"-120px",top:"50%",transform:"translateY(-50%)",
        width:400,height:400,borderRadius:"50%",
        border:`1px solid ${C.goldDim}15`,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 770}})
      , React.createElement('div', { style: {position:"absolute",right:"-80px",top:"50%",transform:"translateY(-50%)",
        width:300,height:300,borderRadius:"50%",
        border:`1px solid ${C.goldDim}20`,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 773}})

      /* Note musicali flottanti */
      , note.map((n,i)=>(
        React.createElement('div', { key: i, style: {position:"absolute",left:n.x,top:n.y,
          animation:n.anim,pointerEvents:"none",opacity:.25,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 779}}
          , React.createElement(Ic, { n: "music", size: n.size, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 781}})
        )
      ))

      /* Contenuto */
      , React.createElement('div', { style: {position:"relative",zIndex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 786}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 787}}
          , React.createElement('div', { style: {width:34,height:34,borderRadius:9,background:C.gold,
            display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 788}}
            , React.createElement(Ic, { n: "music", size: 17, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 790}})
          )
          , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,letterSpacing:"0.01em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 792}}, "Accademia Musicale"

          )
        )
      )

      , React.createElement('div', { style: {position:"relative",zIndex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 798}}
        , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:48,
          lineHeight:1.1,letterSpacing:"-0.01em",marginBottom:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 799}}, "La musica"
           , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 801}})
          , React.createElement('em', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 802}}, "inizia qui." )
        )
        , React.createElement('p', { style: {fontSize:14,color:C.textMuted,lineHeight:1.75,maxWidth:320}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 804}}, "Gestisci lezioni, repertorio, pagamenti e allievi della tua scuola di musica in un'unica piattaforma elegante."

        )
      )

      , React.createElement('div', { style: {position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 809}}
        , [
          {icon:"music",   label:"Calendario e lezioni",    desc:"Vista giornaliera, settimanale e mensile"},
          {icon:"shield",  label:"Gestione pagamenti",      desc:"Rate, ricevute e contabilità"},
          {icon:"edit",    label:"Repertorio musicale",     desc:"Catalogo brani e progressi allievi"},
        ].map(f=>(
          React.createElement('div', { key: f.label, style: {display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 815}}
            , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:`${C.gold}15`,
              border:`1px solid ${C.goldDim}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}
              , React.createElement(Ic, { n: f.icon, size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 818}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 820}}
              , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 821}}, f.label)
              , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 822}}, f.desc)
            )
          )
        ))
      )
    )
  );
};

// ─── FORM LOGIN ───────────────────────────────────────────────────────────────
const FormLogin = ({onSuccess,onRegistrazione,onRecupero})=>{
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState({});

  // Credenziali demo
  const DEMO = {
    "admin@accademia.it":       {password:"admin123",   nome:"Marco Bianchi",   ruolo:"admin"},
    "segreteria@accademia.it":  {password:"segr2024",   nome:"Laura Esposito",  ruolo:"segreteria"},
    "rossi@accademia.it":       {password:"musica2024", nome:"Prof. Rossi",     ruolo:"docente"},
  };

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
    setTimeout(()=>{
      const u=DEMO[email.toLowerCase()];
      if(u&&u.password===password){
        onSuccess({email,nome:u.nome,ruolo:u.ruolo});
      } else {
        setErr({form:"Credenziali non valide. Prova con le credenziali demo sotto."});
        setLoading(false);
      }
    },900);
  };

  const handleKeyDown=(e)=>{if(e.key==="Enter")handleLogin();};

  return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 870}}
      , React.createElement('div', { className: "st1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 871}}
        , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 872}}, "Bentornato"

        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 875}}, "Accedi al tuo account per continuare"     )
      )

      , err.form&&(
        React.createElement('div', { style: {background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:10,padding:"11px 14px",
          display:"flex",alignItems:"flex-start",gap:9,animation:"slideIn .25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 879}}
          , React.createElement(Ic, { n: "alert", size: 15, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 881}})
          , React.createElement('span', { style: {fontSize:13,color:C.red,lineHeight:1.5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 882}}, err.form)
        )
      )

      , React.createElement('div', { className: "st2", style: {display:"flex",flexDirection:"column",gap:14}, onKeyDown: handleKeyDown, __self: this, __source: {fileName: _jsxFileName, lineNumber: 886}}
        , React.createElement(AuthInput, { label: "Indirizzo email" , type: "email", icon: "mail", value: email,
          onChange: e=>{setEmail(e.target.value);setErr(p=>({...p,email:"",form:""}));},
          error: err.email, placeholder: "nome@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 887}})
        , React.createElement(AuthInput, { label: "Password", type: "password", icon: "lock", value: password,
          onChange: e=>{setPassword(e.target.value);setErr(p=>({...p,password:"",form:""}));},
          error: err.password, placeholder: "••••••••", __self: this, __source: {fileName: _jsxFileName, lineNumber: 890}})
      )

      , React.createElement('div', { className: "st3", style: {display:"flex",justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 895}}
        , React.createElement('button', { onClick: onRecupero, style: {background:"none",border:"none",cursor:"pointer",
          fontSize:12,color:C.textMuted,fontFamily:"'DM Sans',sans-serif",
          textDecoration:"underline",textDecorationColor:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 896}}, "Password dimenticata?"

        )
      )

      , React.createElement('div', { className: "st4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 903}}
        , React.createElement('button', { className: "btn-gold", onClick: handleLogin, disabled: loading,
          style: {width:"100%",padding:"14px 0",borderRadius:12,border:"none",
            background:loading?C.goldDim:C.gold,color:C.bg,fontSize:14,fontWeight:600,
            cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 904}}
          , loading?(
            React.createElement('svg', { width: 18, height: 18, viewBox: "0 0 24 24"   , style: {animation:"spin 1s linear infinite"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 910}}
              , React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "none", stroke: C.bg, strokeWidth: "2.5", strokeDasharray: "31.4", strokeDashoffset: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 911}})
            )
          ):React.createElement(Ic, { n: "check", size: 15, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 913}})
          , loading?"Accesso in corso…":"Accedi"
        )
      )

      /* Credenziali demo */
      , React.createElement('div', { className: "st5", style: {background:C.goldBg,border:`1px solid ${C.goldDim}40`,
        borderRadius:12,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 919}}
        , React.createElement('div', { style: {fontSize:10,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:600,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 921}}, "Credenziali demo"

        )
        , Object.entries(DEMO).map(([em,u])=>(
          React.createElement('button', { key: em, onClick: ()=>{setEmail(em);setPassword(u.password);setErr({});},
            style: {display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",
              background:"transparent",border:"none",cursor:"pointer",padding:"5px 0",
              borderBottom:`1px solid ${C.goldDim}20`,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 925}}
            , React.createElement('span', { style: {fontSize:11,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 929}}, u.nome)
            , React.createElement('span', { style: {fontSize:10,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 930}}, u.ruolo, " · "  , em)
          )
        ))
      )

      , React.createElement('div', { style: {textAlign:"center",paddingTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 935}}
        , React.createElement('span', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 936}}, "Non hai un account? "    )
        , React.createElement('button', { onClick: onRegistrazione, style: {background:"none",border:"none",cursor:"pointer",
          fontSize:13,color:C.gold,fontFamily:"'DM Sans',sans-serif",fontWeight:500,textDecoration:"underline"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 937}}, "Richiedi accesso"

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
    {id:"docente",    label:"Docente",       desc:"Accesso al calendario e repertorio"},
    {id:"segreteria", label:"Segreteria",    desc:"Allievi, pagamenti, calendario"},
    {id:"direttore",  label:"Direttore",     desc:"Accesso completo, senza impostazioni admin"},
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
    setTimeout(()=>{setLoading(false);setStep(2);},1200);
  };

  if(step===2) return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:22,alignItems:"center",textAlign:"center",paddingTop:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 974}}
      , React.createElement('div', { style: {width:64,height:64,borderRadius:"50%",background:C.greenBg,border:`2px solid ${C.greenBorder}`,
        display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 975}}
        , React.createElement(Ic, { n: "send", size: 28, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 977}})
      )
      , React.createElement('div', { style: {animation:"fadeUp .4s .1s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 979}}
        , React.createElement('h2', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 980}}, "Richiesta inviata!"

        )
        , React.createElement('p', { style: {fontSize:14,color:C.textMuted,lineHeight:1.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 983}}, "La tua richiesta è stata inviata agli amministratori."
                 , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 984}}), "Riceverai un'email a "
             , React.createElement('strong', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 985}}, f.email), React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 985}}), "quando il tuo account sarà attivato."

        )
      )
      , React.createElement('div', { style: {background:C.goldBg,border:`1px solid ${C.goldDim}40`,borderRadius:10,
        padding:"12px 18px",animation:"fadeUp .4s .2s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 989}}
        , React.createElement('p', { style: {fontSize:12,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 991}}, "Solitamente l'attivazione avviene entro "
              , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 992}}, "24 ore" ), ".", React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 992}}), "Se non ricevi notizie, contatta l'amministratore."

        )
      )
      , React.createElement('button', { onClick: onBack,
        style: {padding:"12px 28px",borderRadius:10,background:"transparent",
          border:`1px solid ${C.border}`,color:C.textMuted,cursor:"pointer",
          fontSize:13,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6,
          transition:"all .15s"},
        onMouseEnter: e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;},
        onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 996}}
        , React.createElement(Ic, { n: "left", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1003}}), "Torna al login"
      )
    )
  );

  return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1009}}
      , React.createElement('div', { className: "st1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1010}}
        , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
          border:"none",cursor:"pointer",color:C.textMuted,fontSize:12,fontFamily:"'DM Sans',sans-serif",
          marginBottom:16,padding:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1011}}
          , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1014}}), "Torna al login"
        )
        , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1016}}, "Richiedi accesso"

        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1019}}, "Compila il modulo. Un amministratore approverà la tua richiesta."

        )
      )

      , React.createElement('div', { className: "st2", style: {display:"flex",flexDirection:"column",gap:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1024}}
        , React.createElement(AuthInput, { label: "Nome completo *"  , icon: "user", value: f.nome,
          onChange: e=>{set("nome",e.target.value);setErr(p=>({...p,nome:""}));},
          error: err.nome, placeholder: "Es. Mario Rossi"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1025}})
        , React.createElement(AuthInput, { label: "Email *" , type: "email", icon: "mail", value: f.email,
          onChange: e=>{set("email",e.target.value);setErr(p=>({...p,email:""}));},
          error: err.email, placeholder: "mario@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1028}})
      )

      /* Ruolo */
      , React.createElement('div', { className: "st3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1034}}
        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1035}}, "Ruolo richiesto" )
        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1036}}
          , RUOLI.map(r=>(
            React.createElement('button', { key: r.id, onClick: ()=>set("ruolo",r.id),
              style: {display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,
                border:`1.5px solid ${f.ruolo===r.id?C.gold:C.border}`,
                background:f.ruolo===r.id?C.goldBg:C.surface2,
                cursor:"pointer",textAlign:"left",transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1038}}
              , React.createElement('div', { style: {width:8,height:8,borderRadius:"50%",
                background:f.ruolo===r.id?C.gold:C.border,flexShrink:0,transition:"background .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1043}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1045}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:f.ruolo===r.id?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1046}}, r.label)
                , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1047}}, r.desc)
              )
            )
          ))
        )
      )

      /* Messaggio */
      , React.createElement('div', { className: "st4", style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1055}}
        , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1056}}, "Messaggio (opzionale)"

        )
        , React.createElement('textarea', { value: f.messaggio, onChange: e=>set("messaggio",e.target.value), rows: 2,
          placeholder: "Presentati brevemente e spiega il tuo ruolo nell'accademia..."       ,
          style: {background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,
            color:C.text,fontSize:13,padding:"11px 14px",width:"100%",
            fontFamily:"'DM Sans',sans-serif",resize:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1059}})
      )

      , React.createElement('div', { className: "st5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1066}}
        , React.createElement('button', { className: "btn-gold", onClick: handleInvia, disabled: loading,
          style: {width:"100%",padding:"14px 0",borderRadius:12,border:"none",
            background:loading?C.goldDim:C.gold,color:C.bg,fontSize:14,fontWeight:600,
            cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1067}}
          , loading?(
            React.createElement('svg', { width: 18, height: 18, viewBox: "0 0 24 24"   , style: {animation:"spin 1s linear infinite"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1073}}
              , React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "none", stroke: C.bg, strokeWidth: "2.5", strokeDasharray: "31.4", strokeDashoffset: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1074}})
            )
          ):React.createElement(Ic, { n: "send", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1076}})
          , loading?"Invio in corso…":"Invia richiesta"
        )
      )
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
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20,alignItems:"center",textAlign:"center",paddingTop:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1098}}
      , React.createElement('div', { style: {width:60,height:60,borderRadius:"50%",background:C.greenBg,border:`2px solid ${C.greenBorder}`,
        display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1099}}
        , React.createElement(Ic, { n: "mail", size: 26, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1101}})
      )
      , React.createElement('div', { style: {animation:"fadeUp .4s .1s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1103}}
        , React.createElement('h2', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1104}}, "Email inviata" )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1105}}, "Se l'account esiste, riceverai le istruzioni"
               , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1106}}), "per reimpostare la password a"    , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1106}})
          , React.createElement('strong', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1107}}, email)
        )
      )
      , React.createElement('button', { onClick: onBack,
        style: {padding:"11px 24px",borderRadius:10,background:"transparent",
          border:`1px solid ${C.border}`,color:C.textMuted,cursor:"pointer",
          fontSize:13,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6,
          transition:"all .15s"},
        onMouseEnter: e=>{e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.color=C.text;},
        onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1110}}
        , React.createElement(Ic, { n: "left", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1117}}), "Torna al login"
      )
    )
  );

  return(
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1123}}
      , React.createElement('div', { className: "st1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1124}}
        , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
          border:"none",cursor:"pointer",color:C.textMuted,fontSize:12,fontFamily:"'DM Sans',sans-serif",
          marginBottom:16,padding:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1125}}
          , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1128}}), "Torna al login"
        )
        , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1130}}, "Password dimenticata?"

        )
        , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1133}}, "Inserisci la tua email e ti invieremo un link per reimpostare la password."

        )
      )
      , React.createElement('div', { className: "st2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1137}}
        , React.createElement(AuthInput, { label: "Indirizzo email" , type: "email", icon: "mail", value: email,
          onChange: e=>{setEmail(e.target.value);setErr("");},
          error: err, placeholder: "nome@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1138}})
      )
      , React.createElement('div', { className: "st3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1142}}
        , React.createElement('button', { className: "btn-gold", onClick: handleInvia, disabled: loading,
          style: {width:"100%",padding:"14px 0",borderRadius:12,border:"none",
            background:loading?C.goldDim:C.gold,color:C.bg,fontSize:14,fontWeight:600,
            cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1143}}
          , loading?(
            React.createElement('svg', { width: 18, height: 18, viewBox: "0 0 24 24"   , style: {animation:"spin 1s linear infinite"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1149}}
              , React.createElement('circle', { cx: "12", cy: "12", r: "10", fill: "none", stroke: C.bg, strokeWidth: "2.5", strokeDasharray: "31.4", strokeDashoffset: "7", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1150}})
            )
          ):React.createElement(Ic, { n: "send", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1152}})
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
const oggi   = new Date();
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
    React.createElement('div', { style: {textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1237}}
      , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,letterSpacing:"0.04em",lineHeight:1,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1238}}
        , h, React.createElement('span', { style: {animation:"pulse 2s infinite",display:"inline-block",margin:"0 2px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1239}}, ":"), m
        , React.createElement('span', { style: {fontSize:22,color:C.goldDim,marginLeft:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1240}}, s)
      )
      , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1242}}
        , GIORNI[oggi.getDay()], " " , oggi.getDate(), " " , MESI[oggi.getMonth()], " " , oggi.getFullYear()
      )
    )
  );
};

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, sub, hex=C.gold, bg, trend, onClick }) => {
  const [displayed, setDisplayed] = useState(0);
  const isNum = typeof value === "number";

  useEffect(()=>{
    if(!isNum){ setDisplayed(value); return; }
    let start=0; const end=value; const dur=900;
    const step=()=>{ start+=Math.ceil((end-start)/8)+1; if(start>=end)start=end; setDisplayed(start); if(start<end)requestAnimationFrame(step); };
    setTimeout(()=>requestAnimationFrame(step),200);
  },[value]);

  return (
    React.createElement('div', { className: "kpi-card", onClick: onClick,
      style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,
        padding:"20px 22px",cursor:onClick?"pointer":"default",
        transition:"all 0.18s",position:"relative",overflow:"hidden",
        borderTop:`3px solid ${hex}20`},
      onMouseEnter: e=>{if(onClick){e.currentTarget.style.borderColor=hex;e.currentTarget.style.borderTopColor=hex;}},
      onMouseLeave: e=>{if(onClick){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.borderTopColor=hex+"20";}}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1262}}
      /* Glow */
      , React.createElement('div', { style: {position:"absolute",top:-30,right:-30,width:100,height:100,
        borderRadius:"50%",background:hex,opacity:0.04,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1270}})
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1272}}
        , React.createElement('div', { style: {width:38,height:38,borderRadius:10,background:bg||`${hex}15`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1273}}
          , React.createElement(Ic, { n: icon, size: 18, stroke: hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1275}})
        )
        , trend!==undefined && (
          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:4,fontSize:11,
            color:trend>=0?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1278}}
            , React.createElement(Ic, { n: trend>=0?"up":"down", size: 11, stroke: trend>=0?C.green:C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1280}})
            , Math.abs(trend), "%"
          )
        )
      )
      , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:600,
        color:hex,lineHeight:1,letterSpacing:"-0.01em",animation:"countUp 0.4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1285}}
        , isNum ? displayed : value
      )
      , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:6,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1289}}, label)
      , sub && React.createElement('div', { style: {fontSize:12,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1290}}, sub)
    )
  );
};

// ─── MINI GRAFICO FINANZIARIO ─────────────────────────────────────────────────
const MiniChart = ({ dati }) => {
  const maxVal = Math.max(...dati.flatMap(d=>[d.entr,d.usc]),1);
  const [hov, setHov] = useState(null);

  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1301}}
      , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:6,height:80,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1302}}
        , dati.map((d,i)=>{
          const hE = Math.max((d.entr/maxVal)*76, d.entr>0?3:0);
          const hU = Math.max((d.usc/maxVal)*76,  d.usc>0?3:0);
          const isHov = hov===i;
          return (
            React.createElement('div', { key: i, style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0},
              onMouseEnter: ()=>setHov(i), onMouseLeave: ()=>setHov(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1308}}
              , isHov && (
                React.createElement('div', { style: {position:"absolute",background:C.surface2,border:`1px solid ${C.border}`,
                  borderRadius:6,padding:"5px 8px",fontSize:10,whiteSpace:"nowrap",
                  transform:"translateY(-60px)",color:C.text,zIndex:10,pointerEvents:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1311}}
                  , React.createElement('div', { style: {color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1314}}, "↑ " , fmtD(d.entr))
                  , React.createElement('div', { style: {color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1315}}, "↓ " , fmtD(d.usc))
                )
              )
              , React.createElement('div', { style: {display:"flex",gap:3,alignItems:"flex-end",width:"100%",justifyContent:"center",height:80,position:"relative"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1318}}
                , React.createElement('div', { className: "bar-fill", style: {flex:1,height:hE,borderRadius:"3px 3px 0 0",
                  background:isHov?C.green:`${C.green}60`,transition:"background 0.15s",
                  animationDelay:`${i*0.06}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1319}})
                , React.createElement('div', { className: "bar-fill", style: {flex:1,height:hU,borderRadius:"3px 3px 0 0",
                  background:isHov?C.red:`${C.red}60`,transition:"background 0.15s",
                  animationDelay:`${i*0.06+0.03}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1322}})
              )
            )
          );
        })
      )
      , React.createElement('div', { style: {display:"flex",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1330}}
        , dati.map((d,i)=>(
          React.createElement('div', { key: i, style: {flex:1,textAlign:"center",fontSize:9,
            color:i===dati.length-1?C.gold:C.textDim,letterSpacing:"0.05em",
            fontWeight:i===dati.length-1?600:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1332}}, d.m)
        ))
      )
    )
  );
};

// ─── LESSON TIMELINE ──────────────────────────────────────────────────────────
const LessonTimeline = ({ lezioni }) => {
  const oraNum = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
  const nowMins = oggi.getHours()*60+oggi.getMinutes();

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1347}}
      , lezioni.map((l,i)=>{
        const startM = oraNum(l.ora);
        const endM   = startM + l.durata;
        const inCorso= nowMins>=startM && nowMins<endM;
        const passata = nowMins>=endM;
        const prossima= !passata && !inCorso && i===lezioni.findIndex(x=>oraNum(x.ora)>nowMins);

        const docenteColor = {
          "Prof. Rossi":C.gold,"Prof. Bianchi":C.teal,"Prof. Verde":C.blue,"Prof. Marino":C.purple
        }[l.docente]||C.textMuted;

        return (
          React.createElement('div', { key: l.id, className: "lesson-row",
            style: {display:"grid",gridTemplateColumns:"52px 4px 1fr auto",
              gap:10,alignItems:"center",padding:"9px 12px",borderRadius:10,
              background:inCorso?`${C.goldBg}cc`:passata?C.bg:C.surface,
              border:`1px solid ${inCorso?C.goldDim:passata?C.border+"60":C.border}`,
              opacity:passata?0.5:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1360}}
            /* Ora */
            , React.createElement('div', { style: {textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1367}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:inCorso?C.gold:passata?C.textDim:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1368}}, l.ora)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1369}}, l.durata, "′")
            )
            /* Indicatore */
            , React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",height:"100%",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1372}}
              , React.createElement('div', { style: {width:4,height:4,borderRadius:"50%",flexShrink:0,
                background:inCorso?C.gold:passata?C.textDim:docenteColor,
                boxShadow:inCorso?`0 0 8px ${C.gold}`:undefined,
                animation:inCorso?"pulse 1.5s infinite":undefined}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1373}})
              , i<lezioni.length-1 && React.createElement('div', { style: {flex:1,width:1,background:C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1377}})
            )
            /* Contenuto */
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1380}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1381}}
                , React.createElement('span', { style: {fontSize:13,fontWeight:500,color:inCorso?C.gold:C.text,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1382}}
                  , l.allievo
                )
                , inCorso && (
                  React.createElement('span', { style: {fontSize:9,background:C.gold,color:C.bg,borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1387}}, "In corso"

                  )
                )
                , prossima && (
                  React.createElement('span', { style: {fontSize:9,background:C.blueBg,color:C.blue,borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0,
                    border:`1px solid ${C.blueBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1393}}, "Prossima"

                  )
                )
                , !l.confermata && !passata && (
                  React.createElement('span', { style: {fontSize:9,background:C.orangeBg,color:C.orange,borderRadius:4,
                    padding:"1px 6px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0,
                    border:`1px solid ${C.orangeBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1400}}, "Da confermare"

                  )
                )
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1407}}
                , React.createElement('span', { style: {color:docenteColor}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1408}}, l.docente)
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1409}}, "·")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1410}}, l.strumento)
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1411}}, "·")
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1412}}, l.aula)
              )
            )
            /* Tipo */
            , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1416}}
              , React.createElement('span', { style: {fontSize:9,letterSpacing:"0.08em",textTransform:"uppercase",
                color:l.tipo==="collettivo"?C.purple:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1417}}
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
    React.createElement('div', { style: {display:"flex",gap:16,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1458}}
      , React.createElement('svg', { width: 88, height: 88, style: {flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1459}}
        , React.createElement('circle', { cx: cx, cy: cy, r: R, fill: "none", stroke: C.border, strokeWidth: stroke, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1460}})
        , slices.filter(s=>s.dash>0).map((s,i)=>(
          React.createElement('circle', { key: s.k, cx: cx, cy: cy, r: R, fill: "none",
            stroke: s.hex, strokeWidth: stroke,
            strokeDasharray: `${s.dash} ${circ-s.dash}`,
            strokeDashoffset: -s.offset+circ/4,
            style: {transition:"stroke-dasharray 0.6s ease",animationDelay:`${i*0.1}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1462}})
        ))
        , React.createElement('text', { x: cx, y: cy+2, textAnchor: "middle", dominantBaseline: "middle",
          fontFamily: "'Cormorant Garamond',serif" , fontSize: 22, fontWeight: 600, fill: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1468}}
          , tot
        )
        , React.createElement('text', { x: cx, y: cy+16, textAnchor: "middle", dominantBaseline: "middle",
          fontFamily: "'DM Sans',sans-serif" , fontSize: 8, fill: C.textDim, letterSpacing: "0.08em", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1472}}, "ALLIEVI"

        )
      )
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:7,flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1477}}
        , cfg.map(c=>(
          React.createElement('div', { key: c.k, style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1479}}
            , React.createElement('div', { style: {width:7,height:7,borderRadius:"50%",background:c.hex,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1480}})
            , React.createElement('div', { style: {flex:1,fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1481}}, c.label)
            , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:c.hex,fontFamily:"'Cormorant Garamond',serif",minWidth:18,textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1482}}
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
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1502}}
      , eventi.map(e=>{
        const d=new Date(e.data+"T00:00:00");
        const diff=Math.ceil((d-oggi)/(1000*60*60*24));
        const hex=tipoHex[e.tipo]||C.textMuted;
        return (
          React.createElement('div', { key: e.data, style: {display:"flex",gap:12,alignItems:"center",
            padding:"10px 14px",borderRadius:10,background:C.bg,border:`1px solid ${C.border}`,
            transition:"all 0.15s"},
            onMouseEnter: ev=>ev.currentTarget.style.borderColor=hex,
            onMouseLeave: ev=>ev.currentTarget.style.borderColor=C.border, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1508}}
            /* Data box */
            , React.createElement('div', { style: {width:42,textAlign:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1514}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1515}}
                , d.getDate()
              )
              , React.createElement('div', { style: {fontSize:9,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1518}}
                , MESI[d.getMonth()].slice(0,3)
              )
            )
            , React.createElement('div', { style: {width:1,height:32,background:C.border,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1522}})
            /* Info */
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1524}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1525}}
                , e.titolo
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1528}}
                , e.luogo
              )
            )
            /* Countdown */
            , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1533}}
              , React.createElement('div', { style: {fontSize:11,color:diff<=7?C.orange:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1534}}
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
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1551}}
      , items.map((a,i)=>{
        const hex=colorMap[a.tipo]||C.textMuted;
        return (
          React.createElement('div', { key: a.id, className: "alert-row", style: {display:"flex",alignItems:"center",gap:12,
            padding:"10px 14px",borderRadius:9,transition:"background 0.12s",
            animationDelay:`${i*0.05}s`},
            onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
            onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1555}}
            , React.createElement('div', { style: {width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",
              justifyContent:"center",background:`${hex}15`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1560}}
              , React.createElement(Ic, { n: iconMap[a.tipo], size: 14, stroke: hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1562}})
            )
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1564}}
              , React.createElement('div', { style: {fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1565}}
                , a.desc
                , a.sogg && React.createElement('span', { style: {color:C.textMuted,fontWeight:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1567}}, " — "  , a.sogg)
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1569}}, a.quando)
            )
            , a.importo!==null && (
              React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,
                color:a.segno>0?C.green:C.red,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1572}}
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
      background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1595}}
      , React.createElement(Ic, { n: "check", size: 15, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1597}})
      , React.createElement('span', { style: {fontSize:13,color:C.green,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1598}}, "Nessun alert — tutto in ordine"     )
    )
  );
  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1602}}
      , alerts.map((a,i)=>(
        React.createElement('div', { key: i, className: "alert-row", style: {display:"flex",alignItems:"center",gap:10,
          padding:"10px 14px",background:a.bg,border:`1px solid ${a.bd}`,borderRadius:9,
          animationDelay:`${i*0.06}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1604}}
          , React.createElement(Ic, { n: "alert", size: 14, stroke: a.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1607}})
          , React.createElement('span', { style: {fontSize:12,color:a.hex,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1608}}, a.msg)
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
  {id:"lezioni",   label:"Lezioni di oggi",       desc:"Timeline con orari e stato",               icon:"calendar"},
  {id:"grafico",   label:"Andamento finanziario", desc:"Grafico mensile entrate/uscite",            icon:"chart"},
  {id:"pagamenti", label:"Stato pagamenti",       desc:"Donut con distribuzione allievi",           icon:"users"},
  {id:"eventi",    label:"Prossimi eventi",       desc:"Elenco eventi in calendario",               icon:"flag"},
  {id:"alert",     label:"Alert prioritari",      desc:"Morosi, lezioni da confermare",             icon:"alert"},
  {id:"attivita",  label:"Attività recente",      desc:"Feed ultimi movimenti",                     icon:"clock"},
  {id:"azioni",    label:"Azioni rapide",         desc:"Shortcut ai flussi principali",             icon:"plus"},
];

const DASH_RUOLI = [
  {id:"admin",     label:"Amministratore", hex:C.gold,   desc:"Accesso completo + impostazioni"},
  {id:"direttore", label:"Direttore",      hex:C.purple, desc:"Dashboard completa, no impostazioni admin"},
  {id:"docente",   label:"Docente",        hex:C.teal,   desc:"Solo lezioni e repertorio"},
  {id:"segreteria",label:"Segreteria",     hex:C.blue,   desc:"Allievi e pagamenti"},
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

  const handleSave = () => {
    const annoAs = (anniScolastici||[]).find(a=>a.stato==="attivo");
    onConfig({...draft, annoInizioAttivo: _nullishCoalesce(_optionalChain([annoAs, 'optionalAccess', _7 => _7.annoInizio]), () => ( draft.annoInizioAttivo))});
    onClose();
  };

  if(!open) return null;

  return (
    React.createElement(React.Fragment, null
      /* Overlay */
      , React.createElement('div', { onClick: onClose, style: {position:"fixed",inset:0,zIndex:300,
        background:"rgba(0,0,0,0.7)",backdropFilter:"blur(3px)",animation:"fadeIn 0.2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1659}})

      /* Drawer */
      , React.createElement('div', { style: {position:"fixed",top:0,right:0,bottom:0,zIndex:301,width:"min(520px, 100vw)",
        background:C.surface,borderLeft:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",animation:"slideDrawer 0.28s cubic-bezier(.4,0,.2,1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1663}}

        /* Header */
        , React.createElement('div', { style: {padding:"18px 22px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1668}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1670}}
            , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:C.goldBg,
              display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1671}}
              , React.createElement(Ic, { n: "settings", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1673}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1675}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1676}}, "Impostazioni")
              , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1677}}, "Dashboard e configurazione sistema"   )
            )
          )
          , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
            color:C.textMuted,padding:6,display:"flex",borderRadius:6},
            onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
            onMouseLeave: e=>e.currentTarget.style.background="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1680}}
            , React.createElement(Ic, { n: "x", size: 18, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1684}})
          )
        )

        /* Tabs */
        , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1689}}
          , [
            ["dashboard","grid",    "Dashboard"],
            ...(isAdmin?[["admin","settings","Amministrazione"]]:  []),
          ].map(([v,ic,lbl])=>(
            React.createElement('button', { key: v, onClick: ()=>setTab(v),
              style: {flex:1,padding:"12px 0",display:"flex",alignItems:"center",justifyContent:"center",
                gap:6,background:"none",border:"none",cursor:"pointer",fontSize:13,
                color:tab===v?C.gold:C.textMuted,fontFamily:"'DM Sans',sans-serif",
                borderBottom:`2px solid ${tab===v?C.gold:"transparent"}`,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1694}}
              , React.createElement(Ic, { n: ic, size: 13, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1699}}), lbl
            )
          ))
        )

        /* Body */
        , React.createElement('div', { style: {flex:1,overflow:"auto",overflowX:"hidden",padding:"clamp(12px,4vw,22px)",display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1705}}

          /* ── TAB DASHBOARD ── */
          , tab==="dashboard" && (
            React.createElement(React.Fragment, null
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1710}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1711}}, "Pannelli visibili" )
                , React.createElement('div', { style: {fontSize:12,color:C.textDim,marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1712}}, "Seleziona quali sezioni mostrare nella tua dashboard. Le KPI card sono sempre visibili."

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1715}}
                  , PANNELLI_DEF.map(p=>{
                    const on = panels[p.id]!==false;
                    return (
                      React.createElement('div', { key: p.id,
                        style: {display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                          borderRadius:10,border:`1px solid ${on&&!p.sempre?C.goldDim:C.border}`,
                          background:on&&!p.sempre?C.goldBg:C.bg,transition:"all 0.15s",
                          opacity:p.sempre?0.6:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1719}}
                        , React.createElement('div', { style: {width:32,height:32,borderRadius:8,
                          background:on?`${C.gold}18`:C.surface,
                          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1724}}
                          , React.createElement(Ic, { n: p.icon, size: 15, stroke: on?C.gold:C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1727}})
                        )
                        , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1729}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:on?C.text:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1730}}, p.label)
                          , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1731}}, p.desc)
                        )
                        , p.sempre
                          ? React.createElement('span', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1734}}, "FISSO")
                          : React.createElement(Toggle, { value: on, onChange: v=>onPanels(prev=>({...prev,[p.id]:v})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1735}})
                        
                      )
                    );
                  })
                )
              )

              /* Ruolo simulazione */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1744}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1745}}, "Ruolo corrente" )
                , React.createElement('div', { style: {fontSize:12,color:C.textDim,marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1746}}, "Simula la vista per ruolo diverso. In produzione il ruolo sarà assegnato dall'amministratore."

                )
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}, className: "settings-form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1749}}
                  , DASH_RUOLI.map(r=>(
                    React.createElement('button', { key: r.id, onClick: ()=>onRuolo(r.id),
                      style: {padding:"11px 14px",borderRadius:10,textAlign:"left",cursor:"pointer",
                        fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",
                        background:ruolo===r.id?`${r.hex}18`:C.bg,
                        border:`1.5px solid ${ruolo===r.id?r.hex:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1751}}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1756}}, r.label)
                      , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1757}}, r.desc)
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
              , React.createElement('section', { style: {maxWidth:"100%",overflowX:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1769}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1770}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1772}}), "Identità scuola"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1775}}
                  , React.createElement(SField, { label: "Nome associazione / scuola *"    ,
                    value: draft.nomeScuola, onChange: e=>setD("nomeScuola",e.target.value),
                    placeholder: "Es. Accademia Musicale Roma"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1776}})
                  , React.createElement(SField, { label: "Sottotitolo / tipo ente"   ,
                    value: draft.tipoEnte, onChange: e=>setD("tipoEnte",e.target.value),
                    placeholder: "Es. Associazione Musicale APS"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1779}})
                  /* Logo */
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1783}}
                    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",
                      textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1784}}, "Logo")
                    , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1786}}
                      , [["icon","Icona"],["text","Iniziali"],["image","Immagine URL"]].map(([v,l])=>(
                        React.createElement('button', { key: v, onClick: ()=>setLogoMode(v),
                          style: {flex:1,padding:"7px 0",borderRadius:7,fontSize:12,cursor:"pointer",
                            fontFamily:"'DM Sans',sans-serif",
                            background:logoMode===v?C.goldBg:C.bg,
                            color:logoMode===v?C.gold:C.textMuted,
                            border:`1px solid ${logoMode===v?C.goldDim:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1788}}, l)
                      ))
                    )
                    , logoMode==="icon" && (
                      React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1797}}
                        , ["music","star","flag","euro2","users","bell"].map(ic=>(
                          React.createElement('button', { key: ic, onClick: ()=>setD("logoIcon",ic),
                            style: {width:40,height:40,borderRadius:9,cursor:"pointer",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              background:draft.logoIcon===ic?C.goldBg:C.bg,
                              border:`1.5px solid ${draft.logoIcon===ic?C.gold:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1799}}
                            , React.createElement(Ic, { n: ic, size: 18, stroke: draft.logoIcon===ic?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1804}})
                          )
                        ))
                        /* Colore logo */
                        , React.createElement('div', { style: {display:"flex",gap:6,marginLeft:4,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1808}}
                          , [C.gold,C.teal,C.purple,C.blue,C.green,C.red].map(col=>(
                            React.createElement('button', { key: col, onClick: ()=>setD("logoColor",col),
                              style: {width:22,height:22,borderRadius:"50%",cursor:"pointer",
                                background:col,border:`2px solid ${draft.logoColor===col?"#fff":col}`,
                                transition:"transform 0.1s",transform:draft.logoColor===col?"scale(1.2)":"scale(1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1810}})
                          ))
                        )
                      )
                    )
                    , logoMode==="text" && (
                      React.createElement(SField, { label: "Testo iniziali (max 2 caratteri)"    ,
                        value: draft.logoText, onChange: e=>setD("logoText",e.target.value.slice(0,2).toUpperCase()),
                        placeholder: "AM", maxLength: 2, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1819}})
                    )
                    , logoMode==="image" && (
                      React.createElement(SField, { label: "URL immagine logo"  ,
                        value: draft.logoUrl, onChange: e=>setD("logoUrl",e.target.value),
                        placeholder: "https://...", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1824}})
                    )
                  )
                )
              )

              /* Dati fiscali / ricevute */
              , React.createElement('section', { style: {maxWidth:"100%",overflowX:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1833}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1834}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1836}}), "Dati ricevute e fatture"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1839}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "settings-form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1840}}
                    , React.createElement(SField, { label: "Codice fiscale / P.IVA"   ,
                      value: draft.codiceFiscale, onChange: e=>setD("codiceFiscale",e.target.value),
                      placeholder: "00000000000", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1841}})
                    , React.createElement(SField, { label: "Codice SDI / PEC"   ,
                      value: draft.sdi, onChange: e=>setD("sdi",e.target.value),
                      placeholder: "XXXXXXX o PEC"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1844}})
                  )
                  , React.createElement(SField, { label: "Sede legale / indirizzo"   ,
                    value: draft.indirizzo, onChange: e=>setD("indirizzo",e.target.value),
                    placeholder: "Via della Musica 1, 00100 Roma (RM)"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1848}})
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "settings-form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1851}}
                    , React.createElement(SField, { label: "Telefono",
                      value: draft.telefono, onChange: e=>setD("telefono",e.target.value),
                      placeholder: "+39 06 1234567"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1852}})
                    , React.createElement(SField, { label: "Email",
                      value: draft.email, onChange: e=>setD("email",e.target.value),
                      placeholder: "info@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1855}})
                  )
                  , React.createElement(SField, { label: "IBAN bonifici" ,
                    value: draft.iban, onChange: e=>setD("iban",e.target.value),
                    placeholder: "IT00 X000 0000 0000 0000 0000 000"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1859}})
                  , React.createElement(SField, { label: "Nota a piè di ricevuta"    ,
                    value: draft.notaRicevuta, onChange: e=>setD("notaRicevuta",e.target.value),
                    placeholder: "Es. Associazione no-profit ex art. 148 TUIR"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 1862}})
                )
              )

              /* Anno scolastico */
              , React.createElement('section', { style: {maxWidth:"100%",overflowX:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1869}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1870}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1872}}), "Anno scolastico e calendario"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1875}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "settings-form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1876}}
                    , React.createElement(SField, { label: "Anno scolastico" ,
                      value: draft.annoScolastico, onChange: e=>setD("annoScolastico",e.target.value),
                      placeholder: "2024/2025", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1877}})
                    , React.createElement(SField, { label: "Inizio anno (data)"  ,
                      type: "date", value: draft.inizioAnno, onChange: e=>setD("inizioAnno",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1880}})
                  )
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "settings-form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1883}}
                    , React.createElement(SField, { label: "Fine anno (data)"  ,
                      type: "date", value: draft.fineAnno, onChange: e=>setD("fineAnno",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1884}})
                    , React.createElement(SField, { label: "Giorno saggio finale"  ,
                      type: "date", value: draft.dataSaggio, onChange: e=>setD("dataSaggio",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1886}})
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 1889}}
                    , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",
                      display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1890}}, "Mesi attivi (lezioni)"  )
                    , React.createElement('div', { style: {display:"flex",gap:5,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1892}}
                      , MESI.map((m,i)=>{
                        const on=(draft.mesiAttivi||[]).includes(i);
                        return (
                          React.createElement('button', { key: i, onClick: ()=>setD("mesiAttivi",
                            on?(draft.mesiAttivi||[]).filter(x=>x!==i):[...(draft.mesiAttivi||[]),i].sort()),
                            style: {padding:"5px 10px",borderRadius:6,fontSize:11,cursor:"pointer",
                              fontFamily:"'DM Sans',sans-serif",background:on?C.goldBg:C.bg,
                              color:on?C.gold:C.textDim,border:`1px solid ${on?C.goldDim:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1896}}
                            , m.slice(0,3)
                          )
                        );
                      })
                    )
                  )
                )
              )

              /* Anni Scolastici */
              , React.createElement('section', { style: {maxWidth:"100%",overflowX:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1911}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1912}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1914}}), "Storico anni scolastici"

                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1917}}
                  /* Lista anni */
                  , anniScolastici.slice().sort((a,b)=>b.annoInizio-a.annoInizio).map(as=>{
                    const isAttivo = as.stato==="attivo";
                    return (
                      React.createElement('div', { key: as.id, style: {background:C.bg,border:`1px solid ${isAttivo?C.gold:C.border}`,
                        borderRadius:10,padding:"12px 16px",
                        borderLeft:`3px solid ${isAttivo?C.gold:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1922}}
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1925}}
                          , React.createElement('span', { style: {fontSize:14,fontWeight:600,color:isAttivo?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1926}}, as.label)
                          , isAttivo && (
                            React.createElement('span', { style: {fontSize:10,background:C.goldBg,color:C.gold,
                              border:`1px solid ${C.goldDim}`,borderRadius:4,padding:"1px 7px",
                              letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1928}}, "Attivo")
                          )
                          , as.stato==="archiviato" && (
                            React.createElement('span', { style: {fontSize:10,background:C.bg,color:C.textDim,
                              border:`1px solid ${C.border}`,borderRadius:4,padding:"1px 7px",
                              letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1933}}, "Archiviato")
                          )
                        )
                        , as.note && React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1938}}, as.note)
                        , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1939}}
                          , !isAttivo && (
                            React.createElement('button', { onClick: ()=>{
                              setAnniScolastici(p=>p.map(a=>({...a,stato:a.id===as.id?"attivo":"archiviato"})));
                              setConfig(p=>({...p,annoScolastico:as.label,annoInizioAttivo:as.annoInizio}));
                              setD("annoScolastico",as.label);
                            },
                              style: {fontSize:11,padding:"3px 10px",borderRadius:6,cursor:"pointer",
                                background:C.goldBg,color:C.gold,border:`1px solid ${C.goldDim}`,
                                fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1941}}, "Imposta attivo"

                            )
                          )
                          , React.createElement('button', { onClick: ()=>setAnniScolastici(p=>p.filter(a=>a.id!==as.id)),
                            disabled: isAttivo,
                            style: {fontSize:11,padding:"3px 10px",borderRadius:6,
                              cursor:isAttivo?"not-allowed":"pointer",opacity:isAttivo?0.3:1,
                              background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,
                              fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1952}}, "Rimuovi"

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
                      React.createElement('button', { onClick: ()=>{
                        const newAs = {
                          id:`as-${nextAnno}`, label:nextLabel, annoInizio:nextAnno, stato:"archiviato", note:""
                        };
                        setAnniScolastici(p=>[...p, newAs]);
                      },
                        style: {display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                          padding:"10px 16px",borderRadius:10,cursor:"pointer",
                          background:"transparent",color:C.textMuted,border:`1px dashed ${C.border}`,
                          fontSize:12,fontFamily:"'DM Sans',sans-serif",width:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1971}}
                        , React.createElement(Ic, { n: "plus", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1981}}), "Crea anno "
                          , nextLabel
                      )
                    ) : null;
                  })()
                )
              )

              /* Numerazione ricevute */
              , React.createElement('section', { style: {maxWidth:"100%",overflowX:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1990}}
                , React.createElement('div', { style: {fontSize:11,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",
                  marginBottom:12,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1991}}
                  , React.createElement('div', { style: {height:1,width:16,background:C.goldDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1993}}), "Numerazione documenti"

                )
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}, className: "settings-form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1996}}
                  , React.createElement(SField, { label: "Prossimo numero ricevuta"  ,
                    type: "number", value: draft.progressivoRicevute,
                    onChange: e=>setD("progressivoRicevute",Number(e.target.value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1997}})
                  , React.createElement('div', { style: {display:"flex",alignItems:"center",paddingTop:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2000}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2001}}, "Formato: "
                       , React.createElement('span', { style: {color:C.gold,fontFamily:"'Cormorant Garamond',serif",fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2002}}
                        , String(draft.progressivoRicevute||1).padStart(3,"0"), "/", new Date().getFullYear()
                      )
                    )
                  )
                )
              )
            )
          )

          /* Messaggio non-admin */
          , tab==="admin" && !isAdmin && (
            React.createElement('div', { style: {display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              height:"100%",gap:14,padding:"40px 0",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2014}}
              , React.createElement('div', { style: {width:56,height:56,borderRadius:14,background:C.redBg,
                border:`1px solid ${C.redBorder}`,display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2016}}
                , React.createElement(Ic, { n: "alert", size: 24, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2018}})
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2020}}
                , React.createElement('div', { style: {fontSize:16,fontWeight:500,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2021}}, "Accesso riservato" )
                , React.createElement('div', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2022}}, "Solo gli utenti con ruolo "
                       , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2023}}, "Amministratore"), " possono modificare la configurazione del sistema."

                )
              )
            )
          )
        )

        /* Footer */
        , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,
          position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2032}}
          , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2034}}, "Ruolo: "
             , React.createElement('span', { style: {color:_optionalChain([DASH_RUOLI, 'access', _8 => _8.find, 'call', _9 => _9(r=>r.id===ruolo), 'optionalAccess', _10 => _10.hex])||C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2035}}
              , _optionalChain([DASH_RUOLI, 'access', _11 => _11.find, 'call', _12 => _12(r=>r.id===ruolo), 'optionalAccess', _13 => _13.label])
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2039}}
            , React.createElement('button', { onClick: onClose,
              style: {padding:"8px 16px",background:"none",border:`1px solid ${C.border}`,borderRadius:8,
                color:C.textMuted,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2040}}, "Annulla"

            )
            , React.createElement('button', { onClick: handleSave,
              style: {padding:"8px 18px",background:C.gold,border:"none",borderRadius:8,
                color:C.bg,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",fontWeight:500,
                display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2045}}
              , React.createElement(Ic, { n: "check", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2049}}), "Salva"
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

const INIT_ANNI_SCOLASTICI = [
  { id:"as-2022", label:"2022/2023", annoInizio:2022, stato:"archiviato",
    note:"Anno regolare. Saggio: 10 giugno 2023." },
  { id:"as-2023", label:"2023/2024", annoInizio:2023, stato:"archiviato",
    note:"Anno con masterclass internazionale. Saggio: 8 giugno 2024." },
  { id:"as-2024", label:"2024/2025", annoInizio:2024, stato:"attivo",
    note:"Anno corrente." },
];

const CONFIG_DEFAULT = {
  nomeScuola:"Accademia Musicale", tipoEnte:"Sistema gestionale",
  logoIcon:"music", logoColor:C.gold, logoText:"AM", logoUrl:"",
  codiceFiscale:"", sdi:"", indirizzo:"Via della Musica 1, 00100 Roma (RM)",
  telefono:"", email:"", iban:"",
  notaRicevuta:"Associazione no-profit — ricevuta non fiscale",
  annoScolastico:"2024/2025",
  annoInizioAttivo: annoScolasticoAttivo,
  inizioAnno:`${ANNO}-09-01`, fineAnno:`${ANNO+1}-06-30`, dataSaggio:`${ANNO+1}-06-07`,
  mesiAttivi:[0,1,2,3,4,8,9,10,11],
  progressivoRicevute:29,
};

const DashboardView = ({ appUser, onNavigate, config:propConfig, setConfig:propSetConfig, anniScolastici:propAnni, setAnniScolastici:propSetAnni }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
    const [panels,  setPanels]  = useState({});  // pannelli visibili (default = tutti on)
    const [_config,  _setConfig]  = useState(CONFIG_DEFAULT);
    const [_anni,    _setAnni]    = useState(INIT_ANNI_SCOLASTICI);
    const config         = _nullishCoalesce(propConfig, () => ( _config));
    const setConfig      = _nullishCoalesce(propSetConfig, () => ( _setConfig));
    const anniScolastici = _nullishCoalesce(propAnni, () => ( _anni));
    const setAnniScolastici = _nullishCoalesce(propSetAnni, () => ( _setAnni));
    const [ruolo,   setRuolo]   = useState("admin");
  
    const isVisible = id => panels[id] !== false;
  
    // Calcoli KPI
    const entrMese = useMemo(()=>{
      const base=[120,100,120,100,115].reduce((t,v)=>t+v,0);
      const altri=1570-base;
      return base+altri;
    },[]);
    const uscMese    = 3300;
    const saldoAnno  = FIN_MENSILE.reduce((t,d)=>t+(d.entr-d.usc),0);
    const lezioniSettimana = 34;
    const allieviAttivi    = ALLIEVI.filter(a=>a.stato!=="sospeso").length;
    const lezioniOggi      = LEZIONI_OGGI.length;
    const oraNum  = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
    const nowMins = oggi.getHours()*60+oggi.getMinutes();
    const lezComplete = LEZIONI_OGGI.filter(l=>oraNum(l.ora)+l.durata<=nowMins).length;
    const morosi  = ALLIEVI.filter(a=>a.stato==="scaduto").length;
  
    // Render logo navbar
    const LogoMark = () => {
      if(config.logoUrl) return (
        React.createElement('img', { src: config.logoUrl, alt: "logo", style: {width:28,height:28,borderRadius:7,objectFit:"cover"},
          onError: e=>e.target.style.display="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2118}})
      );
      if(config.logoText) return (
        React.createElement('div', { style: {width:28,height:28,borderRadius:7,background:config.logoColor||C.gold,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2122}}
          , config.logoText
        )
      );
      return (
        React.createElement('div', { style: {width:28,height:28,borderRadius:7,background:config.logoColor||C.gold,
          display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2129}}
          , React.createElement(Ic, { n: config.logoIcon||"music", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2131}})
        )
      );
    };
  
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2138}}, G+`@keyframes slideDrawer{from{transform:translateX(100%)}to{transform:translateX(0)}}`)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2139}}

          /* ── NAVBAR ── */
          , React.createElement('header', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"0 28px",display:"flex",alignItems:"center",gap:0,flexShrink:0,height:56}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2142}}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,height:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2144}}
              , React.createElement(LogoMark, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2145}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2146}}
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2147}}
                  , config.nomeScuola
                )
                , React.createElement('div', { style: {fontSize:9,color:C.textDim,letterSpacing:"0.12em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2150}}
                  , config.tipoEnte
                )
              )
            )
            , React.createElement('div', { style: {marginLeft:"auto",display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2155}}
              , React.createElement('button', { className: "nav-btn", style: {background:"none",border:`1px solid ${C.border}`,
                borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"flex",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2156}}
                , React.createElement(Ic, { n: "bell", size: 15, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2158}})
              )
              /* Settings */
              , React.createElement('button', { onClick: ()=>setSettingsOpen(true), className: "nav-btn",
                style: {background:settingsOpen?C.goldBg:"none",
                  border:`1px solid ${settingsOpen?C.goldDim:C.border}`,
                  borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"flex",
                  color:settingsOpen?C.gold:C.textMuted,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2161}}
                , React.createElement(Ic, { n: "settings", size: 15, stroke: settingsOpen?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2166}})
              )
              /* Ruolo badge */
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,padding:"4px 10px",
                borderRadius:8,border:`1px solid ${_optionalChain([DASH_RUOLI, 'access', _14 => _14.find, 'call', _15 => _15(r=>r.id===ruolo), 'optionalAccess', _16 => _16.hex])+"40"}`,
                background:`${_optionalChain([DASH_RUOLI, 'access', _17 => _17.find, 'call', _18 => _18(r=>r.id===ruolo), 'optionalAccess', _19 => _19.hex])}10`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2169}}
                , React.createElement('div', { style: {width:7,height:7,borderRadius:"50%",
                  background:_optionalChain([DASH_RUOLI, 'access', _20 => _20.find, 'call', _21 => _21(r=>r.id===ruolo), 'optionalAccess', _22 => _22.hex])}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2172}})
                , React.createElement('span', { style: {fontSize:11,color:_optionalChain([DASH_RUOLI, 'access', _23 => _23.find, 'call', _24 => _24(r=>r.id===ruolo), 'optionalAccess', _25 => _25.hex]),fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2174}}
                  , _optionalChain([DASH_RUOLI, 'access', _26 => _26.find, 'call', _27 => _27(r=>r.id===ruolo), 'optionalAccess', _28 => _28.label])
                )
              )
            )
          )

          /* ── HERO HEADER ── */
          , React.createElement('div', { style: {background:`linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
            borderBottom:`1px solid ${C.border}`,padding:"16px 20px",
            display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2182}}
            , React.createElement('div', { style: {animation:"fadeUp 0.4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2185}}
              , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:300,letterSpacing:"0.02em",lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2186}}, "Buongiorno, "
                 , React.createElement('span', { style: {fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2187}}
                  , ruolo==="admin"?"Amministratore":ruolo==="direttore"?"Direttore":ruolo==="docente"?"Docente":"Segreteria"
                )
              )
              , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2191}}
                , config.annoScolastico, " · "  , lezioniOggi, " lezioni oggi · "    , lezComplete, " completate · "   , lezioniOggi-lezComplete, " rimanenti"
              )
              , React.createElement('div', { style: {marginTop:10,width:220}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2194}}
                , React.createElement('div', { style: {height:4,background:C.border,borderRadius:2,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2195}}
                  , React.createElement('div', { style: {height:"100%",borderRadius:2,background:C.gold,
                    width:`${lezioniOggi>0?(lezComplete/lezioniOggi*100):0}%`,transition:"width 0.8s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2196}})
                )
              )
            )
            , React.createElement(LiveClock, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2201}})
          )

          /* ── BODY ── */
          , React.createElement('div', { style: {flex:1,padding:"16px 20px",display:"flex",flexDirection:"column",gap:16,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2205}}

            /* ── RIGA 1: KPI ── */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2208}}
              , React.createElement(KpiCard, { icon: "users",    label: "Allievi attivi" ,  value: allieviAttivi, sub: `${ALLIEVI.length} totali`, hex: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2209}})
              , React.createElement(KpiCard, { icon: "calendar", label: "Lezioni oggi" ,    value: lezioniOggi,   sub: `${lezioniSettimana} questa settimana`, hex: C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2210}})
              , React.createElement(KpiCard, { icon: "up",       label: "Entrate mese" ,    value: fmt(entrMese), hex: C.green, trend: +8, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2211}})
              , React.createElement(KpiCard, { icon: "down",     label: "Uscite mese" ,     value: fmt(uscMese),  hex: C.red,   trend: +12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2212}})
              , React.createElement(KpiCard, { icon: "chart",    label: `Saldo ${ANNO}`, value: fmt(saldoAnno), hex: saldoAnno>=0?C.green:C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2213}})
            )

            /* ── RIGA 2: AZIONI RAPIDE (full width) ── */
            , isVisible("azioni") && (
              React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2218}}
                , React.createElement('div', { style: {padding:"13px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2219}}
                  , React.createElement(Ic, { n: "plus", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2220}})
                  , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2221}}, "Azioni rapide" )
                )
                , React.createElement('div', { style: {padding:"14px 16px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2223}}
                  , [
                    {icon:"receipt",  label:"Registra pagamento",    hex:C.green,  bg:C.greenBg,  bd:C.greenBorder,  nav:"contabilita"},
                    {icon:"calendar", label:"Aggiungi lezione",       hex:C.teal,   bg:C.tealBg,   bd:C.tealBorder,   nav:"calendario"},
                    {icon:"user",     label:"Nuovo allievo",          hex:C.gold,   bg:C.goldBg,   bd:C.goldDim,      nav:"allievi"},
                    {icon:"down",     label:"Registra spesa",         hex:C.red,    bg:C.redBg,    bd:C.redBorder,    nav:"contabilita"},
                    
                    {icon:"music",    label:"Vai al repertorio",      hex:C.blue,   bg:C.blueBg,   bd:C.blueBorder,   nav:"repertorio"},
                    {icon:"flag",     label:"Crea evento/concerto",   hex:C.purple, bg:C.purpleBg, bd:C.purpleBorder, nav:"concerti"},
                  ].map(a=>(
                    React.createElement('button', { key: a.label, onClick: ()=>onNavigate(a.nav),
                      className: "quick-action",
                      style: {display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
                        background:a.bg,border:`1px solid ${a.bd}`,borderRadius:10,
                        cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",
                        width:"100%",transition:"all 0.15s"},
                      onMouseEnter: e=>{e.currentTarget.style.filter="brightness(1.15)";e.currentTarget.style.transform="translateY(-1px)";},
                      onMouseLeave: e=>{e.currentTarget.style.filter="";e.currentTarget.style.transform="";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2233}}
                      , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:`${a.hex}20`,border:`1px solid ${a.bd}`,
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2241}}
                        , React.createElement(Ic, { n: a.icon, size: 16, stroke: a.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2243}})
                      )
                      , React.createElement('span', { style: {fontSize:13,color:a.hex,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2245}}, a.label)
                    )
                  ))
                )
              )
            )

            /* ── RIGA 3: LEZIONI + GRAFICO ── */
            , (isVisible("lezioni")||isVisible("grafico")) && (
              React.createElement('div', { style: {display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2254}}

                /* Lezioni oggi */
                , isVisible("lezioni") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2258}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
                      display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2259}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2261}}
                        , React.createElement(Ic, { n: "calendar", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2262}})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2263}}, "Lezioni di oggi"  )
                      )
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2265}}
                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2266}}, lezComplete, "/", lezioniOggi)
                        , React.createElement('div', { style: {width:48,height:4,background:C.border,borderRadius:2,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2267}}
                          , React.createElement('div', { style: {height:"100%",width:`${lezioniOggi>0?lezComplete/lezioniOggi*100:0}%`,background:C.gold,borderRadius:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2268}})
                        )
                      )
                    )
                    , React.createElement('div', { style: {padding:14,maxHeight:380,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2272}}
                      , React.createElement(LessonTimeline, { lezioni: LEZIONI_OGGI, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2273}})
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2275}}
                      , React.createElement('button', { onClick: ()=>onNavigate("calendario"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2276}}
                        , React.createElement(Ic, { n: "calendar", size: 12, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2278}}), "Apri calendario →"
                      )
                    )
                  )
                )

                /* Grafico andamento */
                , isVisible("grafico") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2286}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2287}}
                      , React.createElement(Ic, { n: "chart", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2288}})
                      , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2289}}, "Andamento " , ANNO)
                    )
                    , React.createElement('div', { style: {padding:"18px 18px 12px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2291}}
                      , React.createElement(MiniChart, { dati: FIN_MENSILE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2292}})
                      , React.createElement('div', { style: {marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2293}}
                        , [{lbl:"Entrate",hex:C.green},{lbl:"Uscite",hex:C.red}].map(x=>(
                          React.createElement('div', { key: x.lbl, style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2295}}
                            , React.createElement('div', { style: {width:8,height:8,borderRadius:2,background:x.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2296}})
                            , React.createElement('span', { style: {fontSize:10,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2297}}, x.lbl)
                          )
                        ))
                      )
                      , React.createElement('div', { style: {marginTop:14,display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2301}}
                        , [
                          {lbl:"Tot. entrate",val:fmt(FIN_MENSILE.reduce((t,d)=>t+d.entr,0)),hex:C.green},
                          {lbl:"Tot. uscite", val:fmt(FIN_MENSILE.reduce((t,d)=>t+d.usc,0)), hex:C.red},
                          {lbl:"Saldo",       val:fmt(saldoAnno), hex:saldoAnno>=0?C.green:C.red},
                        ].map(x=>(
                          React.createElement('div', { key: x.lbl, style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2307}}
                            , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2308}}, x.lbl)
                            , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:x.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2309}}, x.val)
                          )
                        ))
                      )
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2314}}
                      , React.createElement('button', { onClick: ()=>onNavigate("contabilita"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2315}}
                        , React.createElement(Ic, { n: "euro", size: 12, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2317}}), "Apri contabilità →"
                      )
                    )
                  )
                )
              )
            )

            /* ── RIGA 4: PAGAMENTI + EVENTI ── */
            , (isVisible("pagamenti")||isVisible("eventi")) && (
              React.createElement('div', { style: {display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2327}}
                , isVisible("pagamenti") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2329}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2330}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2331}}
                        , React.createElement(Ic, { n: "users", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2332}})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2333}}, "Stato pagamenti" )
                      )
                      , React.createElement('button', { onClick: ()=>onNavigate("allievi"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2335}}, "Vedi allievi →"

                      )
                    )
                    , React.createElement('div', { style: {padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2340}}
                      , React.createElement(StatoAllievi, { allievi: ALLIEVI, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2341}})
                    )
                  )
                )
                , isVisible("eventi") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2346}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2347}}
                      , React.createElement(Ic, { n: "flag", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2348}})
                      , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2349}}, "Prossimi eventi" )
                    )
                    , React.createElement('div', { style: {padding:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2351}}
                      , React.createElement(EventiCard, { eventi: PROSSIMI_EVENTI, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2352}})
                    )
                  )
                )
              )
            )

            /* ── RIGA 5: ALERT + ATTIVITÀ ── */
            , (isVisible("alert")||isVisible("attivita")) && (
              React.createElement('div', { style: {display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2361}}
                , isVisible("alert") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2363}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,
                      display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2364}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2366}}
                        , React.createElement(Ic, { n: "alert", size: 14, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2367}})
                        , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2368}}, "Alert prioritari" )
                      )
                      , morosi>0 && (
                        React.createElement('span', { style: {background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,
                          borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2371}}
                          , morosi, " critici"
                        )
                      )
                    )
                    , React.createElement('div', { style: {padding:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2377}}
                      , React.createElement(AlertPanel, { allievi: ALLIEVI, lezioniOggi: LEZIONI_OGGI, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2378}})
                    )
                    , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2380}}
                      , React.createElement('button', { onClick: ()=>onNavigate("allievi"),
                        style: {background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.gold,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2381}}
                        , React.createElement(Ic, { n: "users", size: 12, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2383}}), "Gestisci allievi →"
                      )
                    )
                  )
                )
                , isVisible("attivita") && (
                  React.createElement('div', { className: "section", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2389}}
                    , React.createElement('div', { style: {padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2390}}
                      , React.createElement(Ic, { n: "clock", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2391}})
                      , React.createElement('span', { style: {fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2392}}, "Attività recente" )
                    )
                    , React.createElement('div', { style: {padding:"6px 4px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2394}}
                      , React.createElement(AttivitaFeed, { items: ATTIVITA_RECENTE, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2395}})
                    )
                  )
                )
              )
            )

            /* Footer */
            , React.createElement('div', { style: {paddingBottom:8,textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2403}}
              , React.createElement('span', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2404}}
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
          onRuolo: setRuolo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2411}}
        )
      )
    );
};


// ════════════════════════════════════════════════════════════════════════════════

// ANAGRAFICA ALLIEVI

// ════════════════════════════════════════════════════════════════════════════════

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
      , React.createElement('div', { style: {padding:24,display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2590}}
        , React.createElement(Input, { label: "Nome del corso *"   , value: f.name, onChange: e=>set("name",e.target.value), error: err.name, placeholder: "Es. Teoria avanzata, Coro voci bianche..."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2591}})
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2592}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2593}}, "Tipo corso" )
          , React.createElement('div', { style: {display:"flex",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2594}}
            , [["individuale","solo","Individuale","1 allievo per lezione",C.gold,"#2e2308",C.goldDim],["collettivo","group","Collettivo","Più allievi insieme",C.purple,C.purpleBg,C.purpleBorder]].map(([val,icon,lbl,sub,col,bg,border])=>(
              React.createElement('button', { key: val, onClick: ()=>set("type",val), style: {flex:1,padding:"14px 16px",borderRadius:10,border:`2px solid ${f.type===val?col:C.border}`,background:f.type===val?bg:C.bg,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2596}}
                , React.createElement(Ic, { n: icon, size: 18, color: f.type===val?col:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2597}})
                , React.createElement('div', { style: {textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2598}}
                  , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:f.type===val?col:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2599}}, lbl)
                  , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2600}}, sub)
                )
              )
            ))
          )
        )
        , React.createElement(Textarea, { label: "Descrizione (opzionale)" , value: f.description, onChange: e=>set("description",e.target.value), placeholder: "Breve descrizione del corso..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2606}})

        /* ── Docenti assegnati ── */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2609}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2610}}, "Docenti assegnati"

          )
          , docenti.length === 0 ? (
            React.createElement('p', { style: {fontSize:13,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2614}}, "Nessun docente disponibile. Aggiungine uno dalla sezione "       , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2614}}, "Docenti"), ".")
          ) : (
            React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2616}}
              , docenti.map(d => {
                const sel = selDocenti.includes(d.id);
                return (
                  React.createElement('button', { key: d.id, onClick: ()=>toggleDocente(d.id),
                    style: {display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,
                      border:`2px solid ${sel ? d.colore||C.gold : C.border}`,
                      background: sel ? `${d.colore||C.gold}15` : C.bg,
                      cursor:"pointer",transition:"all 0.15s",textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2620}}
                    , React.createElement('div', { style: {width:34,height:34,borderRadius:"50%",background:`${d.colore||C.gold}25`,
                      border:`1px solid ${d.colore||C.gold}60`,display:"flex",alignItems:"center",
                      justifyContent:"center",fontSize:12,fontWeight:700,color:d.colore||C.gold,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2625}}
                      , initials(d.nome)
                    )
                    , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2630}}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:sel?d.colore||C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2631}}, d.nome)
                      , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2632}}, Array.isArray(d.strumenti) ? d.strumenti.join(", ") : (d.strumenti||"—"))
                    )
                    , React.createElement('div', { style: {width:18,height:18,borderRadius:4,border:`2px solid ${sel?d.colore||C.gold:C.border}`,
                      background:sel?d.colore||C.gold:"transparent",display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2634}}
                      , sel && React.createElement(Ic, { n: "check", size: 10, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2637}})
                    )
                  )
                );
              })
            )
          )
        )
      )
      , React.createElement('div', { style: {padding:"16px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2646}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2647}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2648}}, React.createElement(Ic, { n: "check", size: 14, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2648}}), _optionalChain([initial, 'optionalAccess', _29 => _29.id])?"Salva modifiche":"Crea corso")
      )
    )
  );
};

// ── Scheda dettaglio corso ────────────────────────────────────────────────────
const CourseDetail = ({ course, students, docenti:_docentiRaw, onBack, onEdit, onDelete }) => {
  const docenti = _docentiRaw || [];
  const isIndividuale = course.type === "individuale";
  const col  = isIndividuale ? C.gold   : C.purple;
  const bg   = isIndividuale ? "#2e2308": C.purpleBg;
  const bord = isIndividuale ? C.goldDim: C.purpleBorder;

  const enrolled = isIndividuale
    ? students.filter(s => s.instrument === course.name)
    : students.filter(s => s.complementaryCourse === course.id);

  const attivi   = enrolled.filter(s=>s.status==="attivo").length;
  const totFee   = enrolled.filter(s=>s.status==="attivo").reduce((sum,s)=>sum+s.monthlyFee,0);

  const crsDocenti = docenti.filter(d => (course.docenti||[]).includes(d.id));

  return (
    React.createElement('div', { style: {animation:"slideIn 0.25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2672}}
      /* Back */
      , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,marginBottom:20,padding:0,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2674}}
        , React.createElement(Ic, { n: "back", size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2675}}), " Tutti i corsi"
      )

      /* Header */
      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:20,marginBottom:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2679}}
        , React.createElement('div', { style: {width:56,height:56,borderRadius:14,background:bg,border:`2px solid ${bord}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2680}}
          , React.createElement(Ic, { n: isIndividuale?"solo":"group", size: 24, color: col, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2681}})
        )
        , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2683}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2684}}
            , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2685}}, course.name)
            , React.createElement(Badge, { label: course.type, color: isIndividuale?"gold":"purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2686}})
          )
          , course.description && React.createElement('p', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2688}}, course.description)
        )
        , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2690}}
          , React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2691}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2691}}), "Modifica")
          , React.createElement(Btn, { danger: true, onClick: onDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2692}}, React.createElement(Ic, { n: "trash", size: 14, color: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2692}}))
        )
      )

      /* Statistiche rapide */
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isIndividuale?"repeat(auto-fit,minmax(140px,1fr))":"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2697}}
        , (isIndividuale
          ? [{ label:"Allievi iscritti", value:enrolled.length, sub:"totali" }, { label:"Allievi attivi", value:attivi, sub:"in corso" }, { label:"Incasso mensile", value:`€ ${totFee}`, sub:"allievi attivi" }]
          : [{ label:"Allievi iscritti", value:enrolled.length, sub:"totali" }, { label:"Allievi attivi", value:attivi, sub:"in corso" }]
        ).map(s=>(
          React.createElement('div', { key: s.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2702}}
            , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2703}}, s.label)
            , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:col}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2704}}, s.value)
            , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2705}}, s.sub)
          )
        ))
      )

      /* Docenti assegnati */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2711}}
        , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2712}}
          , React.createElement(Ic, { n: "teacher", size: 14, color: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2713}})
          , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2714}}, "Docenti assegnati" )
          , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2715}}, "(", crsDocenti.length, ")")
        )
        , crsDocenti.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center",padding:"32px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2718}}
            , React.createElement('p', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2719}}, "Nessun docente assegnato — clicca "     , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2719}}, "Modifica"), " per assegnarne uno"   )
          )
        ) : (
          React.createElement('div', { style: {padding:16,display:"flex",flexWrap:"wrap",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2722}}
            , crsDocenti.map(d => (
              React.createElement('div', { key: d.id, style: {display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                background:`${d.colore||C.gold}12`,border:`1px solid ${d.colore||C.gold}40`,
                borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2724}}
                , React.createElement('div', { style: {width:32,height:32,borderRadius:"50%",background:`${d.colore||C.gold}25`,
                  border:`1px solid ${d.colore||C.gold}60`,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:12,fontWeight:700,color:d.colore||C.gold,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2727}}
                  , initials(d.nome)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2732}}
                  , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:d.colore||C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2733}}, d.nome)
                  , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2734}}, Array.isArray(d.strumenti) ? d.strumenti.join(", ") : (d.strumenti||"—"))
                )
              )
            ))
          )
        )
      )

      /* Lista allievi */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2743}}
        , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2744}}
          , React.createElement(Ic, { n: "user", size: 14, color: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2745}})
          , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2746}}, "Allievi iscritti" )
          , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2747}}, "(", enrolled.length, ")")
        )

        , enrolled.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2751}}
            , React.createElement(Ic, { n: "user", size: 28, color: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2752}})
            , React.createElement('p', { style: {marginTop:12,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2753}}, "Nessun allievo iscritto a questo corso"     )
          )
        ) : (
          React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2756}}
            , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2757}}
              , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2758}}
                , ["Allievo","Insegnante","Livello","Quota mensile","Stato"].map(h=>(
                  React.createElement('th', { key: h, style: {padding:"11px 20px",textAlign:"left",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2760}}, h)
                ))
              )
            )
            , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2764}}
              , enrolled.map((s,i)=>{
                const ic = INS_COLORS[s.instrument]||C.gold;
                return (
                  React.createElement('tr', { key: s.id, style: {borderBottom:i<enrolled.length-1?`1px solid ${C.border}`:"none",transition:"background 0.12s"},
                    onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                    onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2768}}
                    , React.createElement('td', { style: {padding:"13px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2771}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2772}}
                        , React.createElement('div', { style: {width:34,height:34,borderRadius:"50%",background:`${ic}20`,border:`1px solid ${ic}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:ic,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2773}}
                          , initials(s.name)
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2776}}
                          , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2777}}, s.name)
                          , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2778}}, s.email||"—")
                        )
                      )
                    )
                    , React.createElement('td', { style: {padding:"13px 20px",fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2782}}, s.teacher)
                    , React.createElement('td', { style: {padding:"13px 20px",fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2783}}, s.level||"—")
                    , React.createElement('td', { style: {padding:"13px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2784}}
                      , React.createElement('div', { style: {fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2785}}, "€ " , s.monthlyFee)
                      , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2786}}, s.feeType)
                    )
                    , React.createElement('td', { style: {padding:"13px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2788}}
                      , React.createElement(Badge, { label: s.status, color: s.status==="attivo"?"green":s.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2789}})
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
const CourseManager = ({ courses, students, docenti:_docentiRaw, onAdd, onEdit, onDelete }) => {
  const docenti = _docentiRaw || [];
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
          onEdit: ()=>{ setTarget(live); setModal("edit"); },
          onDelete: ()=>{ setTarget(live); setModal("delete"); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2824}}
        )
        , modal==="edit"   && target && React.createElement(Modal, { title: "Modifica corso" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2832}}, React.createElement(CourseForm, { initial: target, docenti: docenti, onSave: d=>{onEdit({...target,...d});setSelectedCourse(p=>({...p,...d}));setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2832}}))
        , modal==="delete" && target && React.createElement(ConfirmDelete, { label: target.name, description: "Il corso verrà rimosso. Gli allievi iscritti perderanno l'associazione al corso complementare."           , onConfirm: ()=>handleDelete(target.id), onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2833}})
      )
    );
  }

  const CourseRow = ({ c, badgeColor }) => {
    const n   = studentsIn(c);
    const col = badgeColor==="purple" ? C.purple : C.gold;
    const bg  = badgeColor==="purple" ? C.purpleBg : "#2e2308";
    const bd  = badgeColor==="purple" ? C.purpleBorder : C.goldDim;
    return (
      React.createElement('div', { onClick: ()=>setSelectedCourse(c),
        style: {display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,cursor:"pointer",transition:"all 0.15s"},
        onMouseEnter: e=>{ e.currentTarget.style.borderColor=col; e.currentTarget.style.background=bg+"55"; },
        onMouseLeave: e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2844}}
        , React.createElement('div', { style: {width:38,height:38,borderRadius:8,background:bg,border:`1px solid ${bd}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2848}}
          , React.createElement(Ic, { n: badgeColor==="purple"?"group":"solo", size: 16, color: col, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2849}})
        )
        , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2851}}
          , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2852}}, c.name)
          , c.description && React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2853}}, c.description)
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2855}}
          /* docenti assegnati — piccole icone */
          , (c.docenti||[]).length > 0 && (
            React.createElement('div', { style: {display:"flex",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2858}}
              , docenti.filter(d=>(c.docenti||[]).includes(d.id)).slice(0,3).map((d,i)=>(
                React.createElement('div', { key: d.id, title: d.nome, style: {width:22,height:22,borderRadius:"50%",background:`${d.colore||C.gold}25`,
                  border:`2px solid ${C.bg}`,marginLeft:i===0?0:-6,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:700,color:d.colore||C.gold,zIndex:3-i}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2860}}
                  , initials(d.nome)
                )
              ))
              , (c.docenti||[]).length > 3 && (
                React.createElement('div', { style: {width:22,height:22,borderRadius:"50%",background:C.surfaceHover,border:`2px solid ${C.bg}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.textMuted,marginLeft:-6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2868}}, "+"
                  , (c.docenti||[]).length-3
                )
              )
            )
          )
          , React.createElement('span', { style: {background:bg,border:`1px solid ${bd}`,borderRadius:20,padding:"3px 10px",fontSize:12,color:col,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2875}}
            , n, " alliev" , n===1?"o":"i"
          )
          /* azioni — stopPropagation per non aprire la scheda */
          , React.createElement('button', { onClick: e=>{e.stopPropagation();setTarget(c);setModal("edit");}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
            onMouseEnter: e=>e.currentTarget.style.color=C.gold, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2879}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2880}}))
          , React.createElement('button', { onClick: e=>{e.stopPropagation();setTarget(c);setModal("delete");}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
            onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2881}}, React.createElement(Ic, { n: "trash", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2882}}))
          , React.createElement(Ic, { n: "arrow", size: 16, color: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2883}})
        )
      )
    );
  };

  const SectionTitle = ({ icon, label, count, color }) => (
    React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2890}}
      , React.createElement(Ic, { n: icon, size: 14, color: color, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2891}})
      , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2892}}, label)
      , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2893}}, "(", count, ")")
    )
  );

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2898}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2899}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2900}}
          , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2901}}, "Gestione Corsi" )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:14,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2902}}, individuali.length, " corsi individuali · "    , collettivi.length, " corsi collettivi"  )
        )
        , React.createElement(Btn, { onClick: ()=>setModal("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2904}}, React.createElement(Ic, { n: "plus", size: 14, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2904}}), "Nuovo corso" )
      )

      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:24,display:"flex",flexDirection:"column",gap:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2907}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2908}}
          , React.createElement(SectionTitle, { icon: "solo", label: "Corsi Individuali (strumento)"  , count: individuali.length, color: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2909}})
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2910}}
            , individuali.length===0 && React.createElement('div', { style: {fontSize:13,color:C.textDim,padding:"8px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2911}}, "Nessun corso individuale"  )
            , individuali.map(c=>React.createElement(CourseRow, { key: c.id, c: c, badgeColor: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2912}}))
          )
        )
        , React.createElement('div', { style: {borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2915}})
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2916}}
          , React.createElement(SectionTitle, { icon: "group", label: "Corsi Collettivi / Complementari"   , count: collettivi.length, color: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2917}})
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2918}}
            , collettivi.length===0 && React.createElement('div', { style: {fontSize:13,color:C.textDim,padding:"8px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2919}}, "Nessun corso collettivo"  )
            , collettivi.map(c=>React.createElement(CourseRow, { key: c.id, c: c, badgeColor: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2920}}))
          )
        )
      )

      , modal==="add"    && React.createElement(Modal, { title: "Nuovo corso" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2925}}, React.createElement(CourseForm, { docenti: docenti, onSave: d=>{onAdd(d);setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2925}}))
      , modal==="edit"   && target && React.createElement(Modal, { title: "Modifica corso" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2926}}, React.createElement(CourseForm, { initial: target, docenti: docenti, onSave: d=>{onEdit({...target,...d});setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2926}}))
      , modal==="delete" && target && React.createElement(ConfirmDelete, { label: target.name, description: "Il corso verrà rimosso. Gli allievi iscritti perderanno l'associazione al corso complementare."           , onConfirm: ()=>handleDelete(target.id), onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2927}})
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// FORM ALLIEVO
// ════════════════════════════════════════════════════════════════════════════════
const emptyStudent = { name:"",email:"",phone:"",instrument:"",teacher:"",level:"",status:"attivo",monthlyFee:"",nomeRicevuta:"",feeType:"fisso",birthdate:"",enrollDate:"",complementaryCourse:"",notes:"" };

const validate = f => {
  const e = {};
  if(!f.name.trim()) e.name="Nome obbligatorio";
  if(f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email="Email non valida";
  if(!f.instrument) e.instrument="Strumento obbligatorio";
  if(!f.teacher)    e.teacher="Insegnante obbligatorio";
  if(!f.monthlyFee || isNaN(f.monthlyFee) || Number(f.monthlyFee)<=0) e.monthlyFee="Importo non valido";
  return e;
};

const StudentForm = ({ initial, onSave, onClose, courses }) => {
  const [f, setF] = useState(initial || emptyStudent);
  const [errors, setErrors] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const collettivi = courses.filter(c=>c.type==="collettivo");

  const handleSubmit = () => {
    const e = validate(f);
    if(Object.keys(e).length){ setErrors(e); return; }
    onSave({...f, monthlyFee:Number(f.monthlyFee), lessons:f.lessons||[]});
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:24,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2962}}

        , React.createElement(SectionDivider, { label: "Dati anagrafici" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2964}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2965}}, React.createElement(Input, { label: "Nome completo *"  , value: f.name, onChange: e=>set("name",e.target.value), error: errors.name, placeholder: "Es. Sofia Marchetti"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2965}}))
        , React.createElement(Input, { label: "Email", type: "email", value: f.email, onChange: e=>set("email",e.target.value), error: errors.email, placeholder: "email@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2966}})
        , React.createElement(Input, { label: "Telefono", value: f.phone, onChange: e=>set("phone",e.target.value), placeholder: "333 1234567" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 2967}})
        , React.createElement(Input, { label: "Data di nascita"  , type: "date", value: f.birthdate, onChange: e=>set("birthdate",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2968}})
        , React.createElement(Input, { label: "Data iscrizione" , type: "date", value: f.enrollDate, onChange: e=>set("enrollDate",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 2969}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2970}}
          , React.createElement(Input, { label: "Nome per ricevuta"  , value: f.nomeRicevuta||"", onChange: e=>set("nomeRicevuta",e.target.value),
            placeholder: f.name||"Lascia vuoto per usare il nome dell'allievo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2971}})
          , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2973}}, "Per allievi minorenni inserire il nome del genitore/tutore intestatario della ricevuta."

          )
        )

        , React.createElement(SectionDivider, { label: "Corsi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2978}})

        /* Corso principale */
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2981}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2982}}, "Corso principale — strumento *"    )
          , React.createElement('div', { style: {display:"flex",gap:10,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2983}}
            , React.createElement('select', { value: f.instrument, onChange: e=>set("instrument",e.target.value),
              style: {flex:1,background:C.bg,border:`1px solid ${errors.instrument?C.red:C.border}`,borderRadius:8,color:f.instrument?C.text:C.textDim,fontSize:14,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2984}}
              , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 2986}}, "— seleziona strumento —"   )
              , INSTRUMENTS.map(i=>React.createElement('option', { key: i, value: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2987}}, i))
            )
            , React.createElement('div', { style: {width:38,height:38,borderRadius:8,background:"#2e2308",border:`1px solid ${C.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2989}}
              , React.createElement(Ic, { n: "music", size: 16, color: f.instrument?(INS_COLORS[f.instrument]||C.gold):C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2990}})
            )
          )
          , errors.instrument && React.createElement('span', { style: {fontSize:11,color:C.red,marginTop:4,display:"block"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2993}}, errors.instrument)
        )

        /* Corso complementare — pill selector */
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2997}}
          , React.createElement('label', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 2998}}, "Corso complementare — collettivo"   )
          , collettivi.length===0
            ? React.createElement('p', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3000}}, "Nessun corso collettivo disponibile. Creane uno dalla sezione "        , React.createElement('strong', { style: {color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3000}}, "Corsi"), ".")
            : React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3001}}
                , React.createElement('button', { onClick: ()=>set("complementaryCourse",""),
                  style: {padding:"8px 16px",borderRadius:20,border:`2px solid ${!f.complementaryCourse?C.border:C.border}`,background:!f.complementaryCourse?C.surfaceHover:C.bg,cursor:"pointer",fontSize:13,color:!f.complementaryCourse?C.text:C.textMuted,fontFamily:"'DM Sans',sans-serif",transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3002}}, "Nessuno"

                )
                , collettivi.map(c=>(
                  React.createElement('button', { key: c.id, onClick: ()=>set("complementaryCourse",c.id),
                    style: {padding:"8px 16px",borderRadius:20,border:`2px solid ${f.complementaryCourse===c.id?C.purple:C.border}`,background:f.complementaryCourse===c.id?C.purpleBg:C.bg,cursor:"pointer",fontSize:13,color:f.complementaryCourse===c.id?C.purple:C.textMuted,fontFamily:"'DM Sans',sans-serif",fontWeight:f.complementaryCourse===c.id?500:400,transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3007}}
                    , c.name
                  )
                ))
              )
          
        )

        , React.createElement(SectionDivider, { label: "Didattica", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3016}})
        , React.createElement(Sel, { label: "Insegnante *" , value: f.teacher, onChange: e=>set("teacher",e.target.value), options: TEACHERS, error: errors.teacher, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3017}})
        , React.createElement(Sel, { label: "Livello", value: f.level, onChange: e=>set("level",e.target.value), options: LEVELS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3018}})
        , React.createElement(Sel, { label: "Stato", value: f.status, onChange: e=>set("status",e.target.value), options: ["attivo","inattivo","sospeso"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3019}})

        , React.createElement(SectionDivider, { label: "Quota", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3021}})
        , React.createElement(Input, { label: "Quota mensile (€) *"   , type: "number", value: f.monthlyFee, onChange: e=>set("monthlyFee",e.target.value), error: errors.monthlyFee, placeholder: "100", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3022}})
        , React.createElement(Sel, { label: "Tipo quota" , value: f.feeType, onChange: e=>set("feeType",e.target.value), options: ["fisso","variabile"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3023}})

        , React.createElement('div', { style: {gridColumn:"1/-1",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3025}}
          , React.createElement(Textarea, { label: "Note", value: f.notes, onChange: e=>set("notes",e.target.value), placeholder: "Note aggiuntive sull'allievo..."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3026}})
        )
      )
      , React.createElement('div', { style: {padding:"16px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3029}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3030}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSubmit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3031}}, React.createElement(Ic, { n: "check", size: 14, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3031}}), _optionalChain([initial, 'optionalAccess', _30 => _30.id])?"Salva modifiche":"Aggiungi allievo")
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
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3052}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3053}}
        , React.createElement('h3', { style: {fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3054}}, "Registro Lezioni ("  , lessons.length, ")")
        , React.createElement(Btn, { small: true, onClick: ()=>setShowForm(p=>!p), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3055}}, React.createElement(Ic, { n: "plus", size: 12, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3055}}), "Aggiungi")
      )
      , showForm && (
        React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,animation:"fadeIn 0.2s ease"}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3058}}
          , React.createElement(Input, { label: "Data", type: "date", value: form.date, onChange: e=>set("date",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3059}})
          , React.createElement(Sel, { label: "Presenza", value: form.attendance, onChange: e=>set("attendance",e.target.value), options: ["presente","assente","giustificato"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3060}})
          , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3061}}, React.createElement(Input, { label: "Argomento *" , value: form.topic, onChange: e=>set("topic",e.target.value), placeholder: "Es. Scale maggiori, Bach Invenzione n.1..."     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3061}}))
          , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3062}}, React.createElement(Textarea, { label: "Note insegnante" , value: form.notes, onChange: e=>set("notes",e.target.value), placeholder: "Osservazioni, compiti per casa..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 3062}}))
          , React.createElement('div', { style: {gridColumn:"1/-1",display:"flex",gap:8,justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3063}}
            , React.createElement(Btn, { small: true, variant: "secondary", onClick: ()=>setShowForm(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3064}}, "Annulla")
            , React.createElement(Btn, { small: true, onClick: handleAdd, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3065}}, React.createElement(Ic, { n: "check", size: 12, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3065}}), "Salva lezione" )
          )
        )
      )
      , lessons.length===0 && !showForm && React.createElement('div', { style: {textAlign:"center",padding:"32px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3069}}, "Nessuna lezione registrata"  )
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3070}}
        , [...lessons].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((l,i)=>(
          React.createElement('div', { key: i, style: {display:"flex",gap:12,padding:"12px 14px",background:C.bg,borderRadius:8,border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3072}}
            , React.createElement('div', { style: {flexShrink:0,minWidth:72,fontSize:11,color:C.textMuted,paddingTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3073}}, fmtDate(l.date))
            , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3074}}
              , React.createElement('div', { style: {fontSize:14,fontWeight:500,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3075}}, l.topic)
              , l.notes && React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3076}}, l.notes)
            )
            , React.createElement(Badge, { label: l.attendance, color: l.attendance==="presente"?"green":l.attendance==="giustificato"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3078}})
          )
        ))
      )
    )
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SCHEDA DETTAGLIO
// ════════════════════════════════════════════════════════════════════════════════
const StudentDetail = ({ student, courses, lessons:_lessonsRaw, entrate:_allEntrateRaw, setEntrate, annoInizioAttivo, onEdit, onDelete, onBack, onAddLesson, onUpdateStudent, config:propConfig }) => {
  const isMobile = useIsMobile();
  const lessons = _lessonsRaw || [];
  const allEntrate = _allEntrateRaw || [];
  const accentHex = INS_COLORS[student.instrument] || C.gold;
  const comp   = courses.find(c => c.id === student.complementaryCourse);

  // Anno scolastico e selettore mese ── tutti gli hook PRIMA di qualsiasi return
  const nowDate   = new Date(today);
  const curYear   = nowDate.getFullYear();
  const curMonth  = nowDate.getMonth() + 1;
  const annoInizio = _nullishCoalesce(annoInizioAttivo, () => ( (curMonth >= 9 ? curYear : curYear - 1)));
  const MESI_LABEL_L = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const MESI_LABEL_S = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  const MESI_AS = [
    {m:9,y:annoInizio},{m:10,y:annoInizio},{m:11,y:annoInizio},{m:12,y:annoInizio},
    {m:1,y:annoInizio+1},{m:2,y:annoInizio+1},{m:3,y:annoInizio+1},
    {m:4,y:annoInizio+1},{m:5,y:annoInizio+1},{m:6,y:annoInizio+1},
  ];
  const isFuture = x => new Date(x.y, x.m-1, 1) > new Date(curYear, curMonth-1, 1);
  const defaultSelMese = MESI_AS.find(x => x.m===curMonth && x.y===curYear) || MESI_AS[MESI_AS.length-1];

  const [tab,      setTab]      = useState("info");
  const [selMese,  setSelMese]  = useState(defaultSelMese);
  const [showLezForm, setShowLezForm] = useState(false);
  const [lezForm, setLezForm]   = useState({ date: new Date().toISOString().split("T")[0], topic:"", attendance:"presente", notes:"" });
  const [ricevutaEnt, setRicevutaEnt] = useState(null); // entrata da stampare
  const config = _nullishCoalesce(propConfig, () => ( CONFIG_DEFAULT));

  // Lezioni globali per questo allievo
  const lezStudente = lessons.filter(l => studentInLesson(l, student.name));
  const lezMese     = (m, y) => lezStudente.filter(l => { const [ly,lm] = l.date.split("-").map(Number); return ly===y && lm===m; });
  const lezSel      = lezMese(selMese.m, selMese.y);

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
    e.studentId === student.id &&
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
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3147}}
      , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3148}}, "Anno scolastico "
          , annoInizio, "/", String(annoInizio+1).slice(-2)
      )
      , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3151}}
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
                cursor:isF?"not-allowed":"pointer",opacity:isF?0.4:1,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3157}}
              , MESI_LABEL_S[x.m-1]
              , hasD && !isF && React.createElement('span', { style: {display:"inline-block",width:4,height:4,borderRadius:"50%",
                background:isS?C.bg:accentHex,marginLeft:5,verticalAlign:"middle"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3164}})
            )
          );
        })
      )
    )
  );

  // Grafico barre anno scolastico
  const GraficoAS = () => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3175}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3176}}
        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3177}}, "Andamento anno scolastico"  )
        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3178}}, "Totale: " , andamento.reduce((t,x)=>t+x.n,0), " lezioni" )
      )
      , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3180}}
        , andamento.map(x => (
          React.createElement('div', { key: `${x.y}-${x.m}`, onClick: ()=>!x.isFut && setSelMese({m:x.m,y:x.y}),
            style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:x.isFut?"default":"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3182}}
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?accentHex:C.textDim,fontWeight:x.isSel?700:400,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3184}}
              , x.isFut?"":x.n||""
            )
            , React.createElement('div', { style: {width:"100%",borderRadius:"3px 3px 0 0",minHeight:4,
              background:x.isFut?C.border:x.isSel?accentHex:`${accentHex}45`,
              height:`${x.isFut?4:Math.round((x.n/maxN)*60)+4}px`,
              outline:x.isSel?`2px solid ${accentHex}`:"none",outlineOffset:1,transition:"all 0.2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3187}})
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?accentHex:C.textDim,textTransform:"uppercase",fontWeight:x.isSel?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3191}}, x.label)
          )
        ))
      )
    )
  );

  // ── handlers quote — scrivono su sharedEntrate ──
  const registraPagamento = (m, y) => {
    const MESI_ALL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    const newE = {
      id: uid(), studentId:student.id, studentName:student.name,
      importo: student.monthlyFee, mese:m, anno:y,
      data: new Date().toISOString().split("T")[0],
      metodo:"Bonifico bancario",
      desc:`Quota mensile ${MESI_ALL[m-1]} ${y} — ${student.name}`,
    };
    setEntrate(p=>[...p,newE]);
  };
  const eliminaPagamento = (id) => setEntrate(p=>p.filter(e=>e.id!==id));

  const TABS = [
    {id:"info",       label:"Informazioni", icon:"user"},
    {id:"lezioni",    label:"Lezioni",      icon:"calendar"},
    {id:"repertorio", label:"Repertorio",   icon:"music"},
    {id:"quote",      label:"Quote",        icon:"euro"},
  ];

  return (
    React.createElement('div', { style: {animation:"slideIn 0.25s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3220}}
      , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,marginBottom:20,padding:0,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3221}}
        , React.createElement(Ic, { n: "back", size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3222}}), " Tutti gli allievi"
      )

      /* Header */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,marginBottom:24,padding:"16px 20px",borderTop:`3px solid ${accentHex}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3226}}
        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3227}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3228}}
            , React.createElement('div', { style: {width:60,height:60,borderRadius:"50%",background:`${accentHex}20`,border:`2px solid ${accentHex}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,accentHex,fontFamily:"'Cormorant Garamond',serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3229}}
              , initials(student.name)
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3232}}
              , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3233}}, student.name)
              , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3234}}
                , React.createElement(Badge, { label: student.instrument, accentHex: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3235}})
                , comp && React.createElement(Badge, { label: comp.name, accentHex: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3236}})
                , React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3237}}, "·")
                , React.createElement('span', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3238}}, student.teacher)
                , React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3239}}, "·")
                , React.createElement(Badge, { label: student.status, accentHex: student.status==="attivo"?"green":student.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3240}})
              )
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3244}}
            , React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3245}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3245}}), "Modifica")
            , React.createElement(Btn, { danger: true, onClick: onDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3246}}, React.createElement(Ic, { n: "trash", size: 14, accentHex: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3246}}))
          )
        )
        /* KPI strip — aggiornano col mese selezionato */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:isMobile?10:12,marginTop:20,paddingTop:20,borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3250}}
          , [
            {label:"Quota mensile",        value:`€ ${student.monthlyFee}`,    sub:student.feeType,   hex:C.gold},
            {label:`Lez. ${MESI_LABEL_S[selMese.m-1]}`, value:lezSel.length,  sub:"lezioni",          hex:accentHex},
            {label:"Brani in studio",      value:repInStudio.length,           sub:"repertorio",       hex:C.purple},
            {label:"Versato anno",         value:`€ ${totaleVersato}`,         sub:`${entrateStudent.length} rate pagate`, hex:C.green},
          ].map(k => (
            React.createElement('div', { key: k.label, style: {background:C.bg,borderRadius:10,padding:"12px 16px",border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3257}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3258}}, k.value)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3259}}, k.label)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3260}}, k.sub)
            )
          ))
        )
      )

      /* Tabs */
      , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3267}}
        , TABS.map(t => (
          React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id),
            style: {display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:"none",
              border:"none",borderBottom:`2px solid ${tab===t.id?accentHex:"transparent"}`,
              color:tab===t.id?accentHex:C.textMuted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              fontSize:13,transition:"all 0.15s",marginBottom:-1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3269}}
            , React.createElement(Ic, { n: t.icon, size: 13, stroke: tab===t.id?accentHex:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3274}}), t.label
          )
        ))
      )

      /* ── INFORMAZIONI ── */
      , tab==="info" && (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3281}}
          , [
            {icon:"mail",    label:"Email",       value:student.email||"—"},
            {icon:"phone",   label:"Telefono",     value:student.phone||"—"},
            {icon:"user",    label:"Età",          value:student.birthdate?`${age(student.birthdate)} anni`:"—"},
            {icon:"music",   label:"Livello",      value:student.level||"—"},
            {icon:"calendar",label:"Iscritto dal", value:fmtDate(student.enrollDate)||"—"},
            {icon:"euro",    label:"Quota mensile",value:`€ ${student.monthlyFee} (${student.feeType})`},
          ].map(r => (
            React.createElement('div', { key: r.label, style: {display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3290}}
              , React.createElement(Ic, { n: r.icon, size: 16, accentHex: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3291}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3292}}
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3293}}, r.label)
                , React.createElement('div', { style: {fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3294}}, r.value)
              )
            )
          ))
          , comp && (
            React.createElement('div', { style: {display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",background:C.purpleBg,border:`1px solid ${C.purpleBorder}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3299}}
              , React.createElement(Ic, { n: "group", size: 16, accentHex: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3300}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3301}}
                , React.createElement('div', { style: {fontSize:11,color:C.purple,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:3,opacity:0.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3302}}, "Corso complementare" )
                , React.createElement('div', { style: {fontSize:14,color:C.purple,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3303}}, comp.name)
                , comp.description && React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3304}}, comp.description)
              )
            )
          )
          , student.notes && (
            React.createElement('div', { style: {gridColumn:"1/-1",padding:"14px 16px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3309}}
              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3310}}, "Note")
              , React.createElement('div', { style: {fontSize:13,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3311}}, student.notes)
            )
          )
        )
      )

      /* ── LEZIONI ── */
      , tab==="lezioni" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3319}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3320}})
          , React.createElement(GraficoAS, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3321}})
          /* Lista lezioni mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3323}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3324}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3325}}
                , React.createElement(Ic, { n: "calendar", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3326}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3327}}
                  , MESI_LABEL_L[selMese.m-1], " " , selMese.y
                )
              )
              , React.createElement('div', { style: {display:"flex",gap:10,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3331}}
                , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3332}}, lezSel.length, " lezioni" )
                , lezSel.filter(l=>l.attendance==="presente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3334}}
                    , lezSel.filter(l=>l.attendance==="presente").length, " pres."
                  )
                )
                , lezSel.filter(l=>l.attendance==="assente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3339}}
                    , lezSel.filter(l=>l.attendance==="assente").length, " ass."
                  )
                )
              )
            )
            , lezSel.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"40px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3346}}
                , isFuture(selMese)?"Mese non ancora iniziato":"Nessuna lezione registrata"
              )
            ) : (
              lezSel.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.hour.localeCompare(b.hour)).map((l,i) => (
                React.createElement('div', { key: l.id, style: {display:"grid",gridTemplateColumns:"90px 1fr auto",gap:12,alignItems:"center",
                  padding:"12px 20px",borderBottom:i<lezSel.length-1?`1px solid ${C.border}`:"none",
                  borderLeft:`3px solid ${isColl(l)?C.purple:"transparent"}`,
                  background:isColl(l)?`${C.purple}06`:"transparent"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3351}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3355}}
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3356}}, new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}))
                    , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:isColl(l)?C.purple:accentHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3357}}, l.hour)
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3359}}
                    , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3360}}
                      , React.createElement('span', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3361}}, isColl(l)?l.courseName:l.topic||"—")
                      , isColl(l) && React.createElement('span', { style: {fontSize:10,background:C.purpleBg,color:C.purple,
                        border:`1px solid ${C.purpleBorder}`,borderRadius:4,padding:"1px 6px",letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3362}}, "collettiva")
                    )
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3365}}
                      , isColl(l)
                        ? `${(l.students||[]).length} allievi · ${l.room||"—"} · ${l.teacher}`
                        : `${l.instrument} · ${l.room||"—"} · ${l.teacher}`
                    )
                  )
                  , l.attendance
                    ? React.createElement(Badge, { label: l.attendance, accentHex: l.attendance==="presente"?"green":l.attendance==="assente"?"red":"gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3372}})
                    : React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3373}}, "—")
                  
                )
              ))
            )
          )
          /* Tabella riepilogo anno */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3380}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3381}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3382}}, "Riepilogo anno scolastico"  )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3384}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3385}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3386}}
                  , ["Mese","Lezioni","Presenti","Assenti","Tasso pres."].map(h=>(
                    React.createElement('th', { key: h, style: {padding:"10px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3388}}, h)
                  ))
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3392}}
                , MESI_AS.map((x,i) => {
                  const lm   = lezMese(x.m, x.y);
                  const pres = lm.filter(l=>l.attendance==="presente").length;
                  const ass  = lm.filter(l=>l.attendance==="assente").length;
                  const att  = lm.filter(l=>l.attendance).length;
                  const tasso= att>0 ? Math.round((pres/att)*100) : null;
                  const isS  = x.m===selMese.m && x.y===selMese.y;
                  const isF  = isFuture(x);
                  return (
                    React.createElement('tr', { key: i, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:i<MESI_AS.length-1?`1px solid ${C.border}`:"none",
                        background:isS?`${accentHex}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${accentHex}12`:"transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3402}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?accentHex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3408}}
                        , MESI_LABEL_L[x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:isF?C.textDim:lm.length>0?accentHex:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3411}}
                        , isF?"—":lm.length
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3414}}, isF?"—":pres||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:ass>0?C.red:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3415}}, isF?"—":ass||"—")
                      , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3416}}
                        , !isF && tasso!==null ? (
                          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3418}}
                            , React.createElement('div', { style: {flex:1,height:4,background:C.border,borderRadius:2,maxWidth:60}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3419}}
                              , React.createElement('div', { style: {height:"100%",borderRadius:2,background:tasso>=80?C.green:tasso>=60?C.gold:C.red,width:`${tasso}%`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3420}})
                            )
                            , React.createElement('span', { style: {fontSize:12,color:tasso>=80?C.green:tasso>=60?C.gold:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3422}}, tasso, "%")
                          )
                        ) : React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3424}}, "—")
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3430}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3431}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3432}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,accentHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3433}}
                    , andamento.reduce((t,x)=>t+x.n,0)
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3436}}
                    , andamento.reduce((t,x)=>t+lezMese(x.m,x.y).filter(l=>l.attendance==="presente").length,0)
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3439}}
                    , andamento.reduce((t,x)=>t+lezMese(x.m,x.y).filter(l=>l.attendance==="assente").length,0)
                  )
                  , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3442}})
                )
              )
            )
          )
        )
      )

      /* ── REPERTORIO ── */
      , tab==="repertorio" && (
        React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3452}}
          /* KPI strip */
          , React.createElement('div', { className: "stat-strip-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3454}}
            , [
              {label:"In studio",    value:repInStudio.length,   hex:accentHex,   sub:"brani correnti"},
              {label:"Completati",   value:repCompletato.length, hex:C.green, sub:"studiati quest'anno"},
              {label:"Totale",       value:repertorio.length,    hex:C.textMuted, sub:"nel registro"},
            ].map(k => (
              React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px",borderTop:`3px solid ${k.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3460}}
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3461}}, k.value)
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3462}}, k.label)
                , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3463}}, k.sub)
              )
            ))
          )

          /* Brani in studio */
          , repInStudio.length > 0 && (
            React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3470}}
              , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3471}}
                , React.createElement('div', { style: {width:8,height:8,borderRadius:"50%",background:accentHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3472}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3473}}, "In studio" )
              )
              , repInStudio.map((b,i) => (
                React.createElement('div', { key: b.id, style: {padding:"14px 20px",borderBottom:i<repInStudio.length-1?`1px solid ${C.border}`:"none",
                  display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3476}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3478}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:600,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3479}}, b.titolo)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3480}}, b.compositore, " · "  , React.createElement('span', { style: {color:`${accentHex}cc`,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3480}}, b.periodo))
                    , b.note && React.createElement('div', { style: {fontSize:12,color:C.textDim,marginTop:4,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3481}}, b.note)
                  )
                  , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3483}}
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3484}}, "dal " , fmtDate(b.dataInizio))
                    , React.createElement('span', { style: {display:"inline-block",marginTop:4,fontSize:10,background:`${accentHex}20`,accentHex,border:`1px solid ${accentHex}50`,borderRadius:4,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3485}}, "in studio" )
                  )
                )
              ))
            )
          )

          /* Brani completati */
          , repCompletato.length > 0 && (
            React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3494}}
              , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3495}}
                , React.createElement('div', { style: {width:8,height:8,borderRadius:"50%",background:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3496}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3497}}, "Completati")
              )
              , repCompletato.map((b,i) => (
                React.createElement('div', { key: b.id, style: {padding:"14px 20px",borderBottom:i<repCompletato.length-1?`1px solid ${C.border}`:"none",
                  display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"start",opacity:0.75}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3500}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3502}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:500,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3503}}, b.titolo)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3504}}, b.compositore, " · "  , React.createElement('span', { style: {fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3504}}, b.periodo))
                    , b.note && React.createElement('div', { style: {fontSize:12,color:C.textDim,marginTop:4,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3505}}, b.note)
                  )
                  , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3507}}
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3508}}, "dal " , fmtDate(b.dataInizio))
                    , React.createElement('span', { style: {display:"inline-block",marginTop:4,fontSize:10,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px",textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3509}}, "completato")
                  )
                )
              ))
            )
          )

          , repertorio.length === 0 && (
            React.createElement('div', { style: {textAlign:"center",padding:"56px 0",color:C.textDim,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3517}}, "Nessun brano nel registro"

            )
          )
        )
      )

      /* ── QUOTE ── */
      , tab==="quote" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3526}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3527}})
          /* Grafico a barre entrate anno scolastico */
          , (() => {
            const vals = MESI_AS.map(x=>_optionalChain([entrataPerMese, 'call', _31 => _31(x.m,x.y), 'optionalAccess', _32 => _32.importo])||0);
            const maxV = Math.max(...vals, 1);
            const totAnno = vals.reduce((t,v)=>t+v,0);
            const MESI_S2 = ["Set","Ott","Nov","Dic","Gen","Feb","Mar","Apr","Mag","Giu"];
            return (
              React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3535}}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3536}}
                  , React.createElement('span', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3537}}, "Andamento anno scolastico"  )
                  , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3538}}, "Totale incassato: €"  , totAnno.toLocaleString("it-IT"))
                )
                , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3540}}
                  , MESI_AS.map((x,i)=>{
                    const isS=x.m===selMese.m&&x.y===selMese.y, isF=isFuture(x);
                    const v=vals[i], h=isF?4:Math.round((v/maxV)*64)+4;
                    return (
                      React.createElement('div', { key: i, onClick: ()=>!isF&&setSelMese(x),
                        style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:isF?"default":"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3545}}
                        , React.createElement('div', { style: {fontSize:9,color:isS?accentHex:C.textDim,fontWeight:isS?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3547}}, (!isF&&v>0)?`€${v}`:"")
                        , React.createElement('div', { style: {width:"100%",borderRadius:"3px 3px 0 0",minHeight:4,height:h,
                          background:isF?C.border:isS?accentHex:`${accentHex}45`,
                          outline:isS?`2px solid ${accentHex}`:"none",outlineOffset:1,transition:"all 0.2s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3548}})
                        , React.createElement('div', { style: {fontSize:9,color:isS?accentHex:C.textDim,textTransform:"uppercase",fontWeight:isS?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3551}}, MESI_S2[i])
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
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3568}}
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
                    React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${k.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3581}}
                      , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:k.hex,lineHeight:1,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3582}}, k.value)
                      , React.createElement('div', { style: {fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3583}}, k.label)
                      , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3584}}, k.desc)
                    )
                  ))
                )
                /* Dettaglio mese selezionato */
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3589}}
                  , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,
                    display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3590}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3592}}, "Dettaglio "
                       , MESI_ALL2[selMese.m-1], " " , selMese.y
                    )
                    , React.createElement('span', { style: {fontSize:13,fontWeight:600,color:entSel?C.green:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3595}}
                      , entSel?`€${entSel.importo.toLocaleString("it-IT")}`:"Non pagata"
                    )
                  )
                  , entSel ? (
                    React.createElement('div', { style: {display:"grid",gridTemplateColumns:"80px 1fr auto",gap:12,alignItems:"center",padding:"14px 20px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3600}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3601}}
                        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3602}}, new Date(entSel.data+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}))
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3604}}
                        , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3605}}, entSel.desc)
                        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3606}}, entSel.metodo)
                      )
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3608}}
                        , React.createElement('div', { style: {fontSize:15,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3609}}, "€", entSel.importo)
                        , React.createElement('button', { onClick: ()=>setRicevutaEnt(entSel), title: "Stampa ricevuta" ,
                          style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:6,
                            cursor:"pointer",color:C.gold,padding:"4px 8px",display:"flex",alignItems:"center",gap:4,fontSize:11},
                          onMouseEnter: e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg;},
                          onMouseLeave: e=>{e.currentTarget.style.background=C.goldBg;e.currentTarget.style.color=C.gold;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3610}}
                          , React.createElement(Ic, { n: "receipt", size: 12, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3615}}), "Ricevuta"
                        )
                        , React.createElement('button', { onClick: ()=>eliminaPagamento(entSel.id),
                          style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                          onMouseEnter: e=>e.currentTarget.style.color=C.red,
                          onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3617}}
                          , React.createElement(Ic, { n: "trash", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3621}})
                        )
                      )
                    )
                  ) : (
                    React.createElement('div', { style: {padding:"24px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3626}}
                      , React.createElement('span', { style: {fontSize:13,color:C.textDim,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3627}}
                        , isFuture(selMese)?"Mese non ancora iniziato":"Quota non registrata"
                      )
                      , !isFuture(selMese) && (
                        React.createElement('button', { onClick: ()=>registraPagamento(selMese.m,selMese.y),
                          style: {padding:"8px 18px",borderRadius:8,cursor:"pointer",
                            background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,
                            fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,
                            display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3631}}
                          , React.createElement(Ic, { n: "check", size: 14, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3636}}), "Registra pagamento"
                        )
                      )
                    )
                  )
                )
              )
            );
          })()
          /* Tabella quote anno scolastico */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3646}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3647}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3648}}, "Quote anno scolastico "
                   , annoInizio, "/", String(annoInizio+1).slice(-2)
              )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3652}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3653}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3654}}
                  , ["Mese","Importo","Stato","vs mese prec.",""].map(h=>(
                    React.createElement('th', { key: h, style: {padding:"10px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3656}}, h)
                  ))
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3660}}
                , MESI_AS.map((x,i)=>{
                  const pm = x.m===1?12:x.m-1, py = x.m===1?x.y-1:x.y;
                  const ent  = entrataPerMese(x.m,x.y);
                  const entP = entrataPerMese(pm,py);
                  const isS  = x.m===selMese.m&&x.y===selMese.y;
                  const isF  = isFuture(x);
                  const stColor = ent?C.green:isF?C.textDim:C.red;
                  const stBg    = ent?C.greenBg:isF?C.bg:C.redBg;
                  const stBd    = ent?C.greenBorder:isF?C.border:C.redBorder;
                  const stato   = ent?"pagata":isF?"futuro":"non pagata";
                  return (
                    React.createElement('tr', { key: i, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:i<MESI_AS.length-1?`1px solid ${C.border}`:"none",
                        background:isS?`${accentHex}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${accentHex}12`:"transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3672}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?accentHex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3678}}
                        , ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"][x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,
                        color:ent?C.green:isF?C.textDim:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3681}}
                        , isF?"—":ent?`€${ent.importo}`:`€${student.monthlyFee}`
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3685}}
                        , React.createElement('span', { style: {fontSize:11,background:stBg,color:stColor,border:`1px solid ${stBd}`,
                          borderRadius:4,padding:"2px 8px",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3686}}, stato)
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3689}}
                        , !isF && (
                          ent && entP ? (
                            React.createElement('span', { style: {fontSize:12,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3692}}, "= mese prec."  )
                          ) : ent && !entP ? (
                            React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3694}}, "primo pagamento" )
                          ) : !ent && entP ? (
                            React.createElement('span', { style: {fontSize:12,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3696}}, "mese prec. pagata"  )
                          ) : (
                            React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3698}}, "—")
                          )
                        )
                        , isF && React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3701}}, "—")
                      )
                      , React.createElement('td', { style: {padding:"11px 12px"}, onClick: e=>e.stopPropagation(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3703}}
                        , ent && (
                          React.createElement('button', { onClick: ()=>setRicevutaEnt(ent), title: "Stampa ricevuta" ,
                            style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:6,
                              cursor:"pointer",color:C.gold,padding:"3px 8px",display:"flex",alignItems:"center",gap:4,fontSize:11,
                              fontFamily:"'DM Sans',sans-serif"},
                            onMouseEnter: e=>{e.currentTarget.style.background=C.gold;e.currentTarget.style.color=C.bg;},
                            onMouseLeave: e=>{e.currentTarget.style.background=C.goldBg;e.currentTarget.style.color=C.gold;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3705}}
                            , React.createElement(Ic, { n: "receipt", size: 11, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3711}})
                          )
                        )
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3719}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3720}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3721}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3722}}, "€"
                    , totaleVersato.toLocaleString("it-IT")
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3725}}
                    , entrateStudent.length, " su "  , MESI_AS.filter(x=>!isFuture(x)).length, " mesi"
                  )
                  , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3728}}), React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3728}})
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
          onClose: ()=>setRicevutaEnt(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3736}}
        )
      )
    )
  );
};
// ════════════════════════════════════════════════════════════════════════════════
// LISTA ALLIEVI
// ════════════════════════════════════════════════════════════════════════════════
const StudentList = ({ students, courses, onSelect, onAdd, onEdit, onDelete }) => {
  const [search, setSearch]           = useState("");
  const [filterInstrument, setFI]     = useState("");
  const [filterStatus, setFS]         = useState("");
  const [filterCourse, setFC]         = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const collettivi = courses.filter(c=>c.type==="collettivo");

  const filtered = students.filter(s=>{
    const q    = search.toLowerCase();
    const comp = courses.find(c=>c.id===s.complementaryCourse);
    return (!q || s.name.toLowerCase().includes(q) || s.instrument.toLowerCase().includes(q) || _optionalChain([s, 'access', _33 => _33.email, 'optionalAccess', _34 => _34.toLowerCase, 'call', _35 => _35(), 'access', _36 => _36.includes, 'call', _37 => _37(q)]) || _optionalChain([comp, 'optionalAccess', _38 => _38.name, 'access', _39 => _39.toLowerCase, 'call', _40 => _40(), 'access', _41 => _41.includes, 'call', _42 => _42(q)]))
      && (!filterInstrument || s.instrument===filterInstrument)
      && (!filterStatus     || s.status===filterStatus)
      && (!filterCourse     || s.complementaryCourse===filterCourse);
  });

  const hasFilters = filterInstrument||filterStatus||filterCourse;

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3770}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3771}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3772}}
          , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3773}}, "Anagrafica Allievi" )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:14,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3774}}, students.filter(s=>s.status==="attivo").length, " attivi · "   , students.length, " totali" )
        )
        , React.createElement(Btn, { onClick: onAdd, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3776}}, React.createElement(Ic, { n: "plus", size: 14, color: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3776}}), "Nuovo allievo" )
      )

      , React.createElement('div', { style: {display:"flex",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3779}}
        , React.createElement('div', { style: {position:"relative",flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3780}}
          , React.createElement('span', { style: {position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3781}}, React.createElement(Ic, { n: "search", size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3781}}))
          , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value), placeholder: "Cerca per nome, strumento, corso complementare..."     ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:14,padding:"10px 14px 10px 40px",fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3782}})
        )
        , React.createElement(Btn, { variant: showFilters||hasFilters?"primary":"secondary", onClick: ()=>setShowFilters(p=>!p), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3785}}
          , React.createElement(Ic, { n: "filter", size: 14, color: showFilters||hasFilters?C.bg:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3786}}), "Filtri "
           , hasFilters?`(${[filterInstrument,filterStatus,filterCourse].filter(Boolean).length})`:""
        )
      )

      , showFilters && (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,padding:"12px 14px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,animation:"fadeIn 0.2s ease",alignItems:"end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3792}}
          , React.createElement(Sel, { label: "Strumento", value: filterInstrument, onChange: e=>setFI(e.target.value), options: INSTRUMENTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3793}})
          , React.createElement(Sel, { label: "Stato", value: filterStatus, onChange: e=>setFS(e.target.value), options: ["attivo","inattivo","sospeso"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 3794}})
          , React.createElement(Sel, { label: "Corso complementare" , value: filterCourse, onChange: e=>setFC(e.target.value), options: collettivi.map(c=>({value:c.id,label:c.name})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3795}})
          , React.createElement(Btn, { small: true, variant: "ghost", onClick: ()=>{setFI("");setFS("");setFC("");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3796}}, "Reset")
        )
      )

      , React.createElement('div', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3800}}, filtered.length, " alliev" , filtered.length!==1?"i":"o", " trovat" , filtered.length!==1?"i":"o")

      , React.createElement('div', { className: "table-outer", style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3802}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3803}}
        , filtered.length===0
          ? React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3805}}, React.createElement(Ic, { n: "search", size: 28, color: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3805}}), React.createElement('p', { style: {marginTop:12,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3805}}, "Nessun allievo trovato"  ))
          : React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3806}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3807}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3808}}
                  , [
                    {l:"Allievo",cls:""},
                    {l:"Corso principale",cls:""},
                    {l:"Corso complementare",cls:"hide-mobile"},
                    {l:"Insegnante",cls:"hide-mobile"},
                    {l:"Quota",cls:""},
                    {l:"Stato",cls:"resp-hide"},
                    {l:"",cls:""},
                  ].map(({l:h,cls})=>(
                    React.createElement('th', { key: h, className: cls, style: {padding:"11px 16px",textAlign:"left",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3818}}, h)
                  ))
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3822}}
                , filtered.map((s,i)=>{
                  const ic   = INS_COLORS[s.instrument]||C.gold;
                  const comp = courses.find(c=>c.id===s.complementaryCourse);
                  return (
                    React.createElement('tr', { key: s.id, style: {borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",transition:"background 0.12s"},
                      onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                      onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3827}}
                      , React.createElement('td', { style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3830}}
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3831}}
                          , React.createElement('div', { style: {width:34,height:34,borderRadius:"50%",background:`${ic}20`,border:`1px solid ${ic}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:ic,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3832}}
                            , initials(s.name)
                          )
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 3835}}
                            , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3836}}, s.name)
                            , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3837}}, s.email||"—")
                          )
                        )
                      )
                      , React.createElement('td', { style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3841}}, React.createElement(Badge, { label: s.instrument, color: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3841}}))
                      , React.createElement('td', { className: "hide-mobile", style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3842}}, comp?React.createElement(Badge, { label: comp.name, color: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3842}}):React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3842}}, "—"))
                      , React.createElement('td', { className: "hide-mobile", style: {padding:"13px 16px",fontSize:13,color:C.textMuted}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3843}}, s.teacher)
                      , React.createElement('td', { style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3844}}
                        , React.createElement('div', { style: {fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3845}}, "€ " , s.monthlyFee)
                        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3846}}, s.feeType)
                      )
                      , React.createElement('td', { className: "resp-hide", style: {padding:"13px 16px"}, onClick: ()=>onSelect(s), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3848}}
                        , React.createElement(Badge, { label: s.status, color: s.status==="attivo"?"green":s.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 3849}})
                      )
                      , React.createElement('td', { style: {padding:"13px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3851}}
                        , React.createElement('div', { style: {display:"flex",gap:4,justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3852}}
                          , React.createElement('button', { onClick: e=>{e.stopPropagation();onEdit(s);}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:6,borderRadius:6,display:"flex"},
                            onMouseEnter: e=>e.currentTarget.style.color=C.gold, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3853}}, React.createElement(Ic, { n: "edit", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3854}}))
                          , React.createElement('button', { onClick: e=>{e.stopPropagation();onDelete(s);}, style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:6,borderRadius:6,display:"flex"},
                            onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3855}}, React.createElement(Ic, { n: "trash", size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3856}}))
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

const AllieviView = ({ students:propStudents, setStudents:propSetStudents, courses:propCourses, setCourses:propSetCourses, lessons:propLessons, entrate:propEntrate, setEntrate:propSetEntrate, annoInizioAttivo, config:propConfig }) => {
  const isMobile = useIsMobile();
  const [_students, _setStudents] = useState(INIT_STUDENTS);
  const [_courses,  _setCourses]  = useState(INIT_COURSES);
  const students    = _nullishCoalesce(propStudents, () => ( _students));
  const setStudents = _nullishCoalesce(propSetStudents, () => ( _setStudents));
  const courses     = _nullishCoalesce(propCourses, () => ( _courses));
  const setCourses  = _nullishCoalesce(propSetCourses, () => ( _setCourses));
  const lessons     = _nullishCoalesce(propLessons, () => ( []));
  const entrate     = _nullishCoalesce(propEntrate, () => ( []));
  const setEntrate  = _nullishCoalesce(propSetEntrate, () => ( (()=>{})));
  const [view,     setView]     = useState("list");
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null);

  const closeModal = () => setModal(null);

  const handleAddStudent    = d  => { setStudents(p=>[...p,{...d,id:uid(),lessons:[]}]); closeModal(); };
  const handleEditStudent   = d  => { setStudents(p=>p.map(s=>s.id===d.id?{...s,...d}:s)); if(_optionalChain([selected, 'optionalAccess', _43 => _43.id])===d.id) setSelected(p=>({...p,...d})); closeModal(); };
  const handleDeleteStudent = () => { setStudents(p=>p.filter(s=>s.id!==_optionalChain([selected, 'optionalAccess', _44 => _44.id]))); setView("list"); setSelected(null); closeModal(); };
  const handleAddLesson     = (sid,lesson) => {
    setStudents(p=>p.map(s=>s.id===sid?{...s,lessons:[...(s.lessons||[]),lesson]}:s));
    setSelected(p=>_optionalChain([p, 'optionalAccess', _45 => _45.id])===sid?{...p,lessons:[...(p.lessons||[]),lesson]}:p);
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {maxWidth:1200,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3902}}
        , view==="list" && (
          React.createElement(StudentList, {
            students: students, courses: courses,
            onSelect: s=>{setSelected(s);setView("detail");},
            onAdd: ()=>setModal("add"),
            onEdit: s=>{setSelected(s);setModal("edit");},
            onDelete: s=>{setSelected(s);setModal("delete");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3904}}
          )
        )
        , view==="detail" && selected && (
          React.createElement(StudentDetail, {
            student: students.find(s=>s.id===selected.id)||selected,
            courses: courses,
            lessons: lessons,
            entrate: entrate,
            setEntrate: setEntrate,
            annoInizioAttivo: annoInizioAttivo,
            config: propConfig,
            onEdit: ()=>setModal("edit"),
            onDelete: ()=>setModal("delete"),
            onBack: ()=>setView("list"),
            onAddLesson: handleAddLesson,
            onUpdateStudent: d=>setStudents(p=>p.map(s=>s.id===d.id?d:s)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 3913}}
          )
        )
      )
      , modal==="add"    && React.createElement(Modal, { title: "Nuovo allievo" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3929}}, React.createElement(StudentForm, { onSave: handleAddStudent, onClose: closeModal, courses: courses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3929}}))
      , modal==="edit"   && selected && React.createElement(Modal, { title: "Modifica allievo" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3930}}, React.createElement(StudentForm, { initial: students.find(s=>s.id===selected.id), onSave: handleEditStudent, onClose: closeModal, courses: courses, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3930}}))
      , modal==="delete" && selected && React.createElement(ConfirmDelete, { label: selected.name, description: "Questa azione è irreversibile."   , onConfirm: handleDeleteStudent, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3931}})
    )
  );
};

const CorsiView = ({ courses:propCourses, setCourses:propSetCourses, students:propStudents, setStudents:propSetStudents, docenti:propDocenti }) => {
  const [_courses,  _setCourses]  = useState(INIT_COURSES);
  const [_students, _setStudents] = useState(INIT_STUDENTS);
  const courses     = _nullishCoalesce(propCourses, () => ( _courses));
  const setCourses  = _nullishCoalesce(propSetCourses, () => ( _setCourses));
  const students    = _nullishCoalesce(propStudents, () => ( _students));
  const setStudents = _nullishCoalesce(propSetStudents, () => ( _setStudents));
  const docenti     = _nullishCoalesce(propDocenti, () => ( []));

  const handleAddCourse  = d  => setCourses(p=>[...p,{...d,id:uid()}]);
  const handleEditCourse = d  => setCourses(p=>p.map(c=>c.id===d.id?{...c,...d}:c));
  const handleDelCourse  = id => {
    setCourses(p=>p.filter(c=>c.id!==id));
    setStudents(p=>p.map(s=>s.complementaryCourse===id?{...s,complementaryCourse:""}:s));
  };

  return (
    React.createElement('div', { style: {maxWidth:1200,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3953}}
      , React.createElement(CourseManager, {
        courses: courses,
        students: students,
        docenti: docenti,
        onAdd: handleAddCourse,
        onEdit: handleEditCourse,
        onDelete: handleDelCourse, __self: this, __source: {fileName: _jsxFileName, lineNumber: 3954}}
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

// Presenza → colore
const attHex = (att) =>
  att === "presente"    ? C.green :
  att === "assente"     ? C.red   :
  att === "giustificato"? C.gold  :
  att === "recupero"    ? C.blue  : C.textDim;

const attBadge = (att) =>
  att === "presente"    ? "green" :
  att === "assente"     ? "red"   :
  att === "recupero"    ? "blue"  : "gold";

const today    = new Date();
const addDays  = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate()+n); return dt; };
// Helpers lezioni collettive
const isColl      = l => _optionalChain([l, 'optionalAccess', _46 => _46.tipo]) === "collettivo";
const isProva     = l => _optionalChain([l, 'optionalAccess', _47 => _47.tipo]) === "prova";
const lessonHex   = l => isColl(l) ? C.purple : isProva(l) ? C.teal : insHex(_optionalChain([l, 'optionalAccess', _48 => _48.instrument])||"");
const studentInLesson = (l, name) =>
  isColl(l) ? (l.students||[]).some(s=>s.name===name) : l.student===name;
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
const emptyLesson = { date:yyyymmdd(today), hour:"09:00", student:"", instrument:"", teacher:"", room:"", topic:"", attendance:"", recurrence:"Nessuna", notes:"", exercises:"", repertorioIds:[] };

const LessonForm = ({ initial, onSave, onClose, repertorio:_repertorioRaw, onAddBrano }) => {
  const repertorio = _repertorioRaw || [];
  const [showBranoForm, setShowBranoForm] = useState(false);
  const [f, setF] = useState(initial || emptyLesson);
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));

  const hours = Array.from({length:49}, (_, i) => {
    const h = Math.floor(i/4)+8;
    const m = (i%4)*15;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
  }).filter(h => h <= "22:00");

  const validate = () => {
    const e = {};
    if(!f.date)       e.date       = "Data obbligatoria";
    if(!f.hour)       e.hour       = "Orario obbligatorio";
    if(!f.student)    e.student    = "Allievo obbligatorio";
    if(!f.instrument) e.instrument = "Strumento obbligatorio";
    if(!f.teacher)    e.teacher    = "Insegnante obbligatorio";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if(Object.keys(e).length){ setErr(e); return; }
    onSave(f);
  };

  const ATT_STYLES = {
    presente:    { bg:C.greenBg,  fg:C.green,  bd:C.greenBorder  },
    assente:     { bg:C.redBg,    fg:C.red,    bd:C.redBorder    },
    giustificato:{ bg:"#2e2308",  fg:C.gold,   bd:C.goldDim      },
    recupero:    { bg:C.blueBg,   fg:C.blue,   bd:C.blueBorder   },
  };

  const SDiv = ({ label }) => (
    React.createElement('div', { style: {gridColumn:"1/-1", fontSize:10, color:C.textDim, letterSpacing:"0.12em",
      textTransform:"uppercase", paddingBottom:4, borderBottom:`1px solid ${C.border}`, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4236}}
      , label
    )
  );

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"grid", gridTemplateColumns:"1fr 1fr", gap:14}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4244}}
        , React.createElement(SDiv, { label: "Quando", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4245}})
        , React.createElement(Input, { label: "Data *" , type: "date", value: f.date, onChange: e => set("date", e.target.value), error: err.date, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4246}})
        , React.createElement(Sel, { label: "Orario *" , value: f.hour, onChange: e => set("hour", e.target.value), options: hours, error: err.hour, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4247}})

        , React.createElement(SDiv, { label: "Chi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4249}})
        , React.createElement(Sel, { label: "Allievo *" ,    value: f.student,    onChange: e => set("student", e.target.value),    options: STUDENTS_LIST, error: err.student, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4250}})
        , React.createElement(Sel, { label: "Strumento *" ,  value: f.instrument, onChange: e => set("instrument", e.target.value), options: INSTRUMENTS,   error: err.instrument, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4251}})
        , React.createElement(Sel, { label: "Insegnante *" , value: f.teacher,    onChange: e => set("teacher", e.target.value),    options: TEACHERS,      error: err.teacher, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4252}})
        , React.createElement(Sel, { label: "Sala",         value: f.room,       onChange: e => set("room", e.target.value),       options: ROOMS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4253}})

        , React.createElement(SDiv, { label: "Contenuto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4255}})
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4256}}, React.createElement(Input, { label: "Argomento", value: f.topic, onChange: e => set("topic", e.target.value), placeholder: "Es. Scale maggiori, Chopin Notturno..."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4256}}))
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4257}}, React.createElement(Textarea, { label: "Note",   value: f.notes, onChange: e => set("notes", e.target.value), placeholder: "Note aggiuntive..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4257}}))
        , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4258}}, React.createElement(Textarea, { label: "Esercizi da svolgere"  , value: f.exercises, onChange: e => set("exercises", e.target.value), placeholder: "Es. Studiare scale in Do maggiore, ripetere battute 12-24..."        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4258}}))

        , React.createElement(SDiv, { label: "Presenza", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4260}})
        , React.createElement('div', { style: {gridColumn:"1/-1", display:"flex", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4261}}
          , ["presente","assente","giustificato","recupero"].map(a => {
            const s = ATT_STYLES[a];
            const active = f.attendance === a;
            return (
              React.createElement('button', { key: a, onClick: () => set("attendance", active ? "" : a),
                style: {flex:1, padding:"9px 12px", borderRadius:8,
                  border:`2px solid ${active ? s.bd : C.border}`,
                  background: active ? s.bg : C.bg,
                  cursor:"pointer", fontSize:13,
                  color: active ? s.fg : C.textMuted,
                  fontFamily:"'DM Sans',sans-serif", fontWeight: active ? 500 : 400,
                  textTransform:"capitalize", transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4266}}
                , a
              )
            );
          })
        )

        , React.createElement(SDiv, { label: "Repertorio studiato" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 4280}})
        , React.createElement('div', { style: {gridColumn:"1/-1", display:"flex", flexDirection:"column", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4281}}
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
                    fontFamily:"'DM Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4284}}
                  , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4295}}, repertorio.length === 0 ? "Nessun brano nel catalogo" : "+ Aggiungi brano al repertorio...")
                  , ["individuale","collettivo"].map(tipo => {
                    const group = repertorio.filter(b => b.type === tipo && !(f.repertorioIds||[]).includes(b.id));
                    if(group.length === 0) return null;
                    return (
                      React.createElement('optgroup', { key: tipo, label: tipo === "individuale" ? "── Individuali ──" : "── Collettivi ──", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4300}}
                        , group.map(b => (
                          React.createElement('option', { key: b.id, value: b.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4302}}
                            , b.title, " — "  , b.composer, b.tonality ? ` (${b.tonality})` : ""
                          )
                        ))
                      )
                    );
                  })
                )

                /* Pills dei brani selezionati */
                , (f.repertorioIds||[]).length > 0 && (
                  React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4313}}
                    , (f.repertorioIds||[]).map(id => {
                      const b = repertorio.find(r => r.id === id);
                      if(!b) return null;
                      const typeHex = b.type === "collettivo" ? C.purple : C.gold;
                      const typeBg  = b.type === "collettivo" ? C.purpleBg : "#2e2308";
                      const typeBd  = b.type === "collettivo" ? C.purpleBorder : C.goldDim;
                      return (
                        React.createElement('div', { key: id, style: {display:"flex", alignItems:"center", gap:10,
                          padding:"8px 12px", borderRadius:8,
                          border:`1px solid ${typeBd}`, background:typeBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4321}}
                          , React.createElement(Ic, { n: "note", size: 13, stroke: typeHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4324}})
                          , React.createElement('div', { style: {flex:1, minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4325}}
                            , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:typeHex,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4326}}, b.title)
                            , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4328}}
                              , b.composer, b.tonality ? ` · ${b.tonality}` : ""
                            )
                          )
                          , React.createElement('button', { onClick: () => set("repertorioIds", (f.repertorioIds||[]).filter(i=>i!==id)),
                            style: {background:"none", border:"none", cursor:"pointer", padding:4,
                              display:"flex", borderRadius:4, flexShrink:0, color:C.textMuted,
                              transition:"color 0.12s"},
                            onMouseEnter: e => e.currentTarget.style.color=C.red,
                            onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4332}}
                            , React.createElement(Ic, { n: "x", size: 14, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4338}})
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
                      fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s", width:"fit-content"},
                    onMouseEnter: e => { e.currentTarget.style.borderColor=C.gold; e.currentTarget.style.color=C.gold; },
                    onMouseLeave: e => { e.currentTarget.style.borderColor=C.goldDim; e.currentTarget.style.color=C.goldDim; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4348}}
                    , React.createElement(Ic, { n: "plus", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4355}}), "Crea nuovo brano e aggiungilo"

                  )
                )

                /* Form inline inserimento brano */
                , showBranoForm && (
                  React.createElement('div', { style: {border:`1px solid ${C.goldDim}`, borderRadius:10, overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4362}}
                    , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"10px 14px", background:"#2e2308", borderBottom:`1px solid ${C.goldDim}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4363}}
                      , React.createElement('span', { style: {fontSize:12, color:C.gold, fontWeight:500, display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4365}}
                        , React.createElement(Ic, { n: "plus", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4366}}), "Nuovo brano nel catalogo"
                      )
                      , React.createElement('button', { onClick: () => setShowBranoForm(false),
                        style: {background:"none", border:"none", cursor:"pointer", color:C.textMuted, display:"flex", padding:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4368}}
                        , React.createElement(Ic, { n: "x", size: 15, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4370}})
                      )
                    )
                    , React.createElement('div', { style: {padding:14, display:"flex", flexDirection:"column", gap:10, background:C.surface}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4373}}
                      , React.createElement(BranoFormInline, {
                        onSave: b => {
                          const newId = "r_"+Date.now();
                          const newBrano = {...b, id:newId};
                          onAddBrano(newBrano);
                          set("repertorioIds", [...(f.repertorioIds||[]), newId]);
                          setShowBranoForm(false);
                        },
                        onClose: () => setShowBranoForm(false),
                        compact: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4374}}
                      )
                    )
                  )
                )
              )

        )

        , React.createElement(SDiv, { label: "Ricorrenza", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4392}})
        , React.createElement('div', { style: {gridColumn:"1/-1", display:"flex", gap:8, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4393}}
          , RECURRENCE_OPTS.map(r => (
            React.createElement('button', { key: r, onClick: () => set("recurrence", r),
              style: {padding:"8px 14px", borderRadius:20,
                border:`2px solid ${f.recurrence === r ? C.blue : C.border}`,
                background: f.recurrence === r ? C.blueBg : C.bg,
                cursor:"pointer", fontSize:12,
                color: f.recurrence === r ? C.blue : C.textMuted,
                fontFamily:"'DM Sans',sans-serif", fontWeight: f.recurrence === r ? 500 : 400,
                transition:"all 0.12s", display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4395}}
              , r !== "Nessuna" && React.createElement(Ic, { n: "repeat", size: 12, stroke: f.recurrence === r ? C.blue : C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4403}})
              , r
            )
          ))
        )
      )

      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)", display:"flex", justifyContent:"flex-end", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4410}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4411}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4412}}, React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4412}}), _optionalChain([initial, 'optionalAccess', _49 => _49.id]) ? "Salva modifiche" : "Aggiungi lezione")
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
      }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4429}}

      /* Riga 1: ora · nome/corso */
      , (() => {
        let label = "";
        if(lesson.tipo==="collettivo") label = lesson.hour + " · " + (lesson.courseName||"Collettiva");
        else if(lesson.tipo==="prova") label = lesson.hour + " · Prova";
        else label = lesson.hour + " · " + (lesson.student||"").split(" ")[0];
        // Tronca etichetta se troppo lunga per celle strette
        if(compact && label.length > 16) label = label.slice(0, 15) + "…";
        return (
          React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4462}}
            , React.createElement('div', { style: {fontSize: compact ? 10 : 12, fontWeight:600, color:hex,
              lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
              flex:1, minWidth:0, maxWidth:"100%"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4463}}
              , label
            )
            , lesson.tipo==="collettivo" && (
              React.createElement('div', { style: {fontSize:9, color:C.purple, fontWeight:700, flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4469}}
                , "\u25CF", (lesson.students||[]).length
              )
            )
            , lesson.tipo==="prova" && (
              React.createElement('span', { style: {fontSize:9, color:C.teal, fontWeight:700, textTransform:"uppercase", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4474}}, "prova"
                , lesson.iscritto ? " \u2713" : ""
              )
            )
            , lesson.tipo!=="collettivo" && lesson.tipo!=="prova" && lesson.attendance && (
              React.createElement('div', { style: {width:6, height:6, borderRadius:"50%", background:dotHex, flexShrink:0, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4479}})
            )
          )
        );
      })()
      /* Riga 2: sottotitolo */
      , React.createElement('div', { style: {fontSize:9, color:hex, opacity:0.75, marginTop:1,
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4485}}
        , lesson.tipo==="collettivo"
          ? (lesson.students||[]).length + " allievi"
          : lesson.tipo==="prova"
          ? (lesson.instrument||"") + (lesson.phone ? " \u00b7 " + lesson.phone : "")
          : lesson.instrument||""
      )
    )
  );
};

// ─── MODAL DETTAGLIO ─────────────────────────────────────────────────────────
const LessonDetailModal = ({ lesson, onEdit, onDelete, onAttendance, onIscrizione, onClose, role, nextLessonDate, students }) => {
  const canEdit = role === 'admin' || role === 'docente';
  const studentsList = students || [];
  const hex = insHex(lesson.instrument);
  const ATT_STYLES = {
    presente:    { bg:C.greenBg,  fg:C.green,  bd:C.greenBorder  },
    assente:     { bg:C.redBg,    fg:C.red,    bd:C.redBorder    },
    giustificato:{ bg:"#2e2308",  fg:C.gold,   bd:C.goldDim      },
    recupero:    { bg:C.blueBg,   fg:C.blue,   bd:C.blueBorder   },
  };

  const [showIscrizionePanel, setShowIscrizionePanel] = useState(false);
  const [iscrizioneStudent, setIscrizioneStudent] = useState("");

  return (
    React.createElement(Modal, { title: "Dettaglio lezione" , onClose: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4513}}
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4514}}
        , React.createElement('div', { style: {display:"flex", gap:14, alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4515}}
          , React.createElement('div', { style: {width:46, height:46, borderRadius:10,
            background: lesson.tipo==="collettivo" ? C.purpleBg : lesson.tipo==="prova" ? C.tealBg : `${hex}20`,
            border:`1px solid ${lesson.tipo==="collettivo" ? C.purpleBorder : lesson.tipo==="prova" ? C.tealBorder : `${hex}40`}`,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4516}}
            , React.createElement(Ic, { n: lesson.tipo==="collettivo"?"group":lesson.tipo==="prova"?"user":"music",
               size: 20, stroke: lesson.tipo==="collettivo"?C.purple:lesson.tipo==="prova"?C.teal:hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4520}})
          )
          , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4523}}
            , lesson.tipo==="collettivo" ? (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {fontSize:17, fontWeight:600, fontFamily:"'Cormorant Garamond',serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4526}}, lesson.courseName)
                , React.createElement('div', { style: {fontSize:13, color:C.purple, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4527}}, "Lezione collettiva · "   , lesson.teacher)
              )
            ) : lesson.tipo==="prova" ? (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4531}}
                  , React.createElement('div', { style: {fontSize:17, fontWeight:600, fontFamily:"'Cormorant Garamond',serif", color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4532}}
                    , lesson.contactName || "Lezione di prova"
                  )
                  , lesson.iscritto
                    ? React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,
                        border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4536}}, "Iscritto ✓"
                         , lesson.student ? ` — ${lesson.student}` : ""
                      )
                    : React.createElement('span', { style: {fontSize:11,background:C.tealBg,color:C.teal,
                        border:`1px solid ${C.tealBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4540}}, "Non ancora iscritto"

                      )
                  
                )
                , React.createElement('div', { style: {fontSize:13, color:C.teal, opacity:0.85, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4546}}
                  , lesson.instrument, lesson.teacher ? ` · ${lesson.teacher}` : ""
                  , lesson.phone
                    ? React.createElement('span', { style: {color:C.textMuted, display:"inline-flex", alignItems:"center", gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4549}}
                        , " · ", "📞 " , React.createElement('span', { style: {color:C.teal,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4550}}, lesson.phone)
                      )
                    : ""
                )
              )
            ) : (
              React.createElement(React.Fragment, null
                , React.createElement('div', { style: {fontSize:17, fontWeight:600, fontFamily:"'Cormorant Garamond',serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4557}}, lesson.student)
                , React.createElement('div', { style: {fontSize:13, color:hex, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4558}}, lesson.instrument)
              )
            )
          )
          , lesson.recurrence !== "Nessuna" && React.createElement(Badge, { label: lesson.recurrence, variant: "blue", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4562}})
          , lesson.tipo==="collettivo" && React.createElement(Badge, { label: "Collettiva", variant: "purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4563}})
          , lesson.tipo==="prova" && React.createElement(Badge, { label: "Prova", variant: "teal", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4564}})
        )

        , React.createElement('div', { className: "info-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4567}}
          , [
            {icon:"cal",   label:"Data",       value:fmtFull(new Date(lesson.date+"T00:00:00"))},
            {icon:"clock", label:"Orario",     value:lesson.hour},
            {icon:"user",  label:"Insegnante", value:lesson.teacher},
            {icon:"music", label:"Sala",       value:lesson.room || "—"},
          ].map(r => (
            React.createElement('div', { key: r.label, style: {display:"flex", gap:8, padding:"10px 12px",
              background:C.bg, borderRadius:8, border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4574}}
              , React.createElement(Ic, { n: r.icon, size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4576}})
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4577}}
                , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4578}}, r.label)
                , React.createElement('div', { style: {fontSize:13, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4579}}, r.value)
              )
            )
          ))
        )

        , lesson.tipo==="collettivo" && (lesson.students||[]).length > 0 && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.purpleBg, borderRadius:8, border:`1px solid ${C.purpleBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4586}}
            , React.createElement('div', { style: {fontSize:10, color:C.purple, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4587}}, "Allievi ("
               , (lesson.students||[]).length, ")"
            )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4590}}
              , (lesson.students||[]).map(s => (
                React.createElement('div', { key: s.id, style: {display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4592}}
                  , React.createElement('div', { style: {width:26, height:26, borderRadius:"50%", flexShrink:0,
                    background:`${insHex(s.instrument)}20`, border:`1px solid ${insHex(s.instrument)}40`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:10, fontWeight:700, color:insHex(s.instrument)}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4593}}
                    , initials(s.name)
                  )
                  , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4599}}
                    , React.createElement('span', { style: {fontSize:13, fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4600}}, s.name)
                    , React.createElement('span', { style: {fontSize:11, color:C.textMuted, marginLeft:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4601}}, s.instrument)
                  )
                )
              ))
            )
          )
        )
        , lesson.topic && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4609}}
            , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4610}}, "Argomento")
            , React.createElement('div', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4611}}, lesson.topic)
          )
        )
        , lesson.notes && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4615}}
            , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4616}}, "Note")
            , React.createElement('div', { style: {fontSize:13, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4617}}, lesson.notes)
          )
        )
        , lesson.tipo !== "prova" && (
          React.createElement('div', { style: {padding:"12px 14px", background:C.blueBg, borderRadius:8, border:`1px solid ${C.blueBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4621}}
            , React.createElement('div', { style: {fontSize:10, color:C.blue, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:6, opacity:0.8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4622}}, "Esercizi da svolgere"  )
            , lesson.exercises
              ? React.createElement('div', { style: {fontSize:13, color:C.text, lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4624}}, lesson.exercises)
              : React.createElement('div', { style: {fontSize:13, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4625}}, "Nessun esercizio assegnato"  )
            
          )
        )

        /* Repertorio */
        , (lesson.repertorioIds||[]).length > 0 && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4632}}
            , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4633}}, "Brani studiati" )
            , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4634}}
              , (lesson.repertorioIds||[]).map(id => {
                const b = (window.__repertorio__||[]).find(r=>r.id===id);
                if(!b) return null;
                const typeHex = b.type==="collettivo"?C.purple:C.gold;
                const typeBg  = b.type==="collettivo"?C.purpleBg:"#2e2308";
                const typeBd  = b.type==="collettivo"?C.purpleBorder:C.goldDim;
                return (
                  React.createElement('div', { key: id, style: {display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                    background:typeBg, border:`1px solid ${typeBd}`, borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4642}}
                    , React.createElement(Ic, { n: "note", size: 14, stroke: typeHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4644}})
                    , React.createElement('div', { style: {flex:1, minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4645}}
                      , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:typeHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4646}}, b.title)
                      , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4647}}, b.composer, b.tonality ? ` · ${b.tonality}` : "")
                    )
                  )
                );
              })
            )
          )
        )

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4656}}
          , React.createElement('div', { style: {fontSize:10, color:C.textMuted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4657}}, "Segna presenza" )
          , React.createElement('div', { className: "att-row", style: {display:"flex", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4658}}
            , ["presente","assente","giustificato","recupero"].map(a => {
              const s = ATT_STYLES[a];
              const active = lesson.attendance === a;
              return (
                React.createElement('button', { key: a, onClick: () => canEdit && onAttendance(lesson.id, active ? "" : a),
                  style: {flex:1, padding:"9px 0", borderRadius:8,
                    border:`2px solid ${active ? s.bd : C.border}`,
                    background: active ? s.bg : C.bg,
                    cursor: canEdit ? "pointer" : "default", fontSize:12,
                    color: active ? s.fg : C.textMuted,
                    opacity: canEdit ? 1 : 0.5,
                    fontFamily:"'DM Sans',sans-serif", fontWeight: active ? 600 : 400,
                    textTransform:"capitalize", transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4663}}
                  , a
                )
              );
            })
          )
          /* Feedback prossima lezione */
          , lesson.recurrence && lesson.recurrence !== "Nessuna" && (
            React.createElement('div', { style: {marginTop:10, padding:"10px 14px", borderRadius:8,
              background: nextLessonDate ? C.greenBg : C.surface,
              border:`1px solid ${nextLessonDate ? C.greenBorder : C.border}`,
              display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4679}}
              , React.createElement(Ic, { n: "repeat", size: 14, stroke: nextLessonDate ? C.green : C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4683}})
              , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4684}}
                , nextLessonDate ? (
                  React.createElement(React.Fragment, null
                    , React.createElement('div', { style: {fontSize:12, color:C.green, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4687}}, "Prossima lezione creata"

                    )
                    , React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4690}}
                      , fmtFull(new Date(nextLessonDate+"T00:00:00")), " · "  , lesson.hour, " · "  , lesson.teacher
                    )
                  )
                ) : (
                  React.createElement('div', { style: {fontSize:12, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4695}}, "Lezione "
                     , lesson.recurrence.toLowerCase(), " — la prossima verrà creata segnando la presenza"
                  )
                )
              )
              , !nextLessonDate && lesson.attendance && (
                React.createElement('span', { style: {fontSize:10, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4701}}, "già pianificata" )
              )
            )
          )
        )

        /* ── Pannello iscrizione (solo lezioni prova) ── */
        , lesson.tipo==="prova" && canEdit && (
          React.createElement('div', { style: {padding:"14px 16px", background:lesson.iscritto?C.greenBg:C.tealBg,
            border:`1px solid ${lesson.iscritto?C.greenBorder:C.tealBorder}`, borderRadius:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4709}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: showIscrizionePanel&&!lesson.iscritto ? 12 : 0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4711}}
              , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4712}}
                , React.createElement(Ic, { n: lesson.iscritto?"check":"user", size: 15, stroke: lesson.iscritto?C.green:C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4713}})
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4714}}
                  , React.createElement('div', { style: {fontSize:12, fontWeight:600, color:lesson.iscritto?C.green:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4715}}
                    , lesson.iscritto ? `Iscritto — ${lesson.student||""}` : "Allievo non ancora iscritto"
                  )
                  , !lesson.iscritto && (
                    React.createElement('div', { style: {fontSize:11, color:C.teal, opacity:0.8, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4719}}, "Collega a un allievo esistente quando si iscrive"

                    )
                  )
                )
              )
              , !lesson.iscritto && (
                React.createElement('button', { onClick: ()=>setShowIscrizionePanel(v=>!v),
                  style: {background:C.teal,color:C.bg,border:"none",borderRadius:7,padding:"6px 13px",
                    cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4726}}
                  , showIscrizionePanel ? "Annulla" : "Segna iscritto"
                )
              )
              , lesson.iscritto && onIscrizione && (
                React.createElement('button', { onClick: ()=>onIscrizione(lesson.id, "", false),
                  style: {background:"none",color:C.textDim,border:`1px solid ${C.border}`,borderRadius:7,
                    padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4733}}, "Rimuovi iscrizione"

                )
              )
            )
            , showIscrizionePanel && !lesson.iscritto && (
              React.createElement('div', { style: {display:"flex", gap:8, alignItems:"center", marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4741}}
                , React.createElement('select', { value: iscrizioneStudent, onChange: e=>setIscrizioneStudent(e.target.value),
                  style: {flex:1, background:C.surface, border:`1px solid ${C.tealBorder}`, borderRadius:8,
                    color:iscrizioneStudent?C.text:C.textMuted, fontSize:13, padding:"9px 12px",
                    fontFamily:"'DM Sans',sans-serif", appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4742}}
                  , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4746}}, "— seleziona allievo —"   )
                  , studentsList.filter(s=>s.status==="attivo").map(s=>(
                    React.createElement('option', { key: s.id, value: s.name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4748}}, s.name, " · "  , s.instrument)
                  ))
                  , React.createElement('option', { value: "__nuovo__", __self: this, __source: {fileName: _jsxFileName, lineNumber: 4750}}, "+ Nuovo allievo (da creare)"    )
                )
                , React.createElement('button', {
                  disabled: !iscrizioneStudent,
                  onClick: ()=>{
                    if(onIscrizione) onIscrizione(lesson.id, iscrizioneStudent, true);
                    setShowIscrizionePanel(false);
                  },
                  style: {background:iscrizioneStudent?C.green:"#1a2a1a",color:iscrizioneStudent?C.bg:C.textDim,
                    border:"none",borderRadius:7,padding:"9px 16px",cursor:iscrizioneStudent?"pointer":"not-allowed",
                    fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600,flexShrink:0,transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4752}}, "Conferma"

                )
              )
            )
          )
        )

      )

      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)", display:"flex", justifyContent:"space-between", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4770}}
        , canEdit ? (
          React.createElement(React.Fragment, null
            , React.createElement(Btn, { danger: true, onClick: onDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4773}}, React.createElement(Ic, { n: "trash", size: 14, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4773}}), "Elimina")
            , React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4774}}, React.createElement(Ic, { n: "edit", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4774}}), "Modifica")
          )
        ) : (
          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,color:C.textDim,fontSize:12,width:"100%",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4777}}
            , React.createElement(Ic, { n: "lock", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4778}}), "Solo docenti e amministratori possono modificare le lezioni"

          )
        )
      )
    )
  );
};

// ─── VISTA GIORNALIERA ────────────────────────────────────────────────────────
const DayView = ({ date, lessons, onSelect }) => {
  const dayLessons = lessons
    .filter(l => l.date === yyyymmdd(date))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  if(dayLessons.length === 0) return (
    React.createElement('div', { style: {textAlign:"center", padding:"64px 0", color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4794}}
      , React.createElement(Ic, { n: "cal", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4795}})
      , React.createElement('p', { style: {marginTop:12, fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4796}}, "Nessuna lezione programmata"  )
      , React.createElement('p', { style: {fontSize:12, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4797}}, "Usa il + per aggiungerne una"     )
    )
  );

  return (
    React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4802}}
      , dayLessons.map(l => {
        const hex = lessonHex(l);
        const dotHex = l.attendance ? attHex(l.attendance) : null;
        return (
          React.createElement('div', { key: l.id, onClick: () => onSelect(l),
            style: {display:"flex", gap:16, padding:"16px 18px", background:C.surface,
              border:`1px solid ${C.border}`, borderLeft:`4px solid ${hex}`,
              borderRadius:10, cursor:"pointer", transition:"all 0.15s"},
            onMouseEnter: e => { e.currentTarget.style.background = C.surfaceHover; },
            onMouseLeave: e => { e.currentTarget.style.background = C.surface; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4807}}
            , React.createElement('div', { style: {width:52, flexShrink:0, textAlign:"center", paddingTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4813}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif", fontSize:22,
                fontWeight:600, color:hex, lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4814}}, l.hour)
              , React.createElement('div', { style: {fontSize:10, color:C.textDim, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4816}}, "ora")
            )
            , React.createElement('div', { style: {flex:1, minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4818}}
              , l.tipo==="collettivo" ? (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4821}}
                    , React.createElement('span', { style: {fontSize:15, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4822}}, l.courseName)
                    , React.createElement('span', { style: {fontSize:11, background:C.purpleBg, color:C.purple,
                      border:`1px solid ${C.purpleBorder}`, borderRadius:4, padding:"1px 7px",
                      letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4823}}, "Collettiva")
                    , l.recurrence !== "Nessuna" && React.createElement(Ic, { n: "repeat", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4826}})
                  )
                  , React.createElement('div', { style: {display:"flex", gap:12, fontSize:12, color:C.textMuted, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4828}}
                    , l.teacher && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4829}}, l.teacher)
                    , l.room    && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4830}}, "· " , l.room)
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4831}}, "· " , (l.students||[]).length, " allievi" )
                  )
                  , (l.students||[]).length > 0 && (
                    React.createElement('div', { style: {display:"flex", gap:5, marginTop:6, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4834}}
                      , (l.students||[]).map(s => (
                        React.createElement('span', { key: s.id, style: {fontSize:10, padding:"1px 7px", borderRadius:10,
                          background:`${insHex(s.instrument)}18`, color:insHex(s.instrument),
                          border:`1px solid ${insHex(s.instrument)}40`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4836}}
                          , s.name.split(" ")[0]
                        )
                      ))
                    )
                  )
                  , l.topic && React.createElement('div', { style: {fontSize:12, color:C.textMuted, marginTop:6, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4844}}, "\"", l.topic, "\"")
                )
              ) : l.tipo==="prova" ? (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4848}}
                    , React.createElement('span', { style: {fontSize:15, fontWeight:600, color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4849}}
                      , l.contactName || "Lezione prova"
                    )
                    , React.createElement('span', { style: {fontSize:11, background:C.tealBg, color:C.teal,
                      border:`1px solid ${C.tealBorder}`, borderRadius:4, padding:"1px 7px",
                      letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4852}}, "Prova")
                    , l.iscritto
                      ? React.createElement('span', { style: {fontSize:11, background:C.greenBg, color:C.green,
                          border:`1px solid ${C.greenBorder}`, borderRadius:4, padding:"1px 7px",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4856}}, "Iscritto ✓"

                        )
                      : React.createElement('span', { style: {fontSize:11, background:C.tealBg, color:C.teal,
                          border:`1px solid ${C.tealBorder}`, borderRadius:4, padding:"1px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4860}}, "Non iscritto"

                        )
                    
                  )
                  , React.createElement('div', { style: {display:"flex", gap:12, fontSize:12, color:C.textMuted, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4866}}
                    , React.createElement('span', { style: {color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4867}}, l.instrument)
                    , l.teacher && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4868}}, "· " , l.teacher)
                    , l.room    && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4869}}, "· " , l.room)
                    , l.phone   && React.createElement('span', { style: {color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4870}}, "· 📞 "  , l.phone)
                  )
                  , l.notes && React.createElement('div', { style: {fontSize:12, color:C.textMuted, marginTop:6, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4872}}, l.notes)
                )
              ) : (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4876}}
                    , React.createElement('span', { style: {fontSize:15, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4877}}, l.student)
                    , React.createElement('span', { style: {fontSize:12, color:hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4878}}, l.instrument)
                    , l.recurrence !== "Nessuna" && React.createElement(Ic, { n: "repeat", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4879}})
                    , dotHex && React.createElement('div', { style: {width:7, height:7, borderRadius:"50%", background:dotHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4880}})
                  )
                  , React.createElement('div', { style: {display:"flex", gap:12, fontSize:12, color:C.textMuted, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4882}}
                    , l.teacher && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4883}}, l.teacher)
                    , l.room    && React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4884}}, "· " , l.room)
                  )
                  , l.topic && React.createElement('div', { style: {fontSize:12, color:C.textMuted, marginTop:6, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4886}}, "\"", l.topic, "\"")
                )
              )
            )
            , l.tipo !== "collettivo" && l.attendance && (
              React.createElement('div', { style: {flexShrink:0, alignSelf:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4891}}
                , React.createElement(Badge, { label: l.attendance, variant: attBadge(l.attendance), __self: this, __source: {fileName: _jsxFileName, lineNumber: 4892}})
              )
            )
          )
        );
      })
    )
  );
};

// ─── VISTA SETTIMANALE ────────────────────────────────────────────────────────
const WeekView = ({ weekStart, lessons, onSelect }) => {
  const days = Array.from({length:7}, (_, i) => addDays(weekStart, i));

  return (
    React.createElement('div', { style: {overflowX:"auto",WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4907}}
      , React.createElement('div', { style: {minWidth:480}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4908}}
        /* header */
        , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"52px repeat(7,1fr)",
          borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:C.surface, zIndex:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4910}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4912}})
          , days.map((d, i) => {
            const isToday = isSameDay(d, today);
            return (
              React.createElement('div', { key: i, style: {padding:"8px 4px", textAlign:"center", borderLeft:`1px solid ${C.border}`, minWidth:0, overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4916}}
                , React.createElement('div', { style: {fontSize:11, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4917}}, DAYS_SHORT[i])
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, marginTop:2,
                  color: isToday ? C.gold : C.text,
                  background: isToday ? `${C.gold}15` : undefined,
                  borderRadius: isToday ? 6 : undefined,
                  padding: isToday ? "1px 6px" : undefined}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4918}}
                  , d.getDate()
                )
              )
            );
          })
        )
        /* righe orarie */
        , HOURS.map(hour => (
          React.createElement('div', { key: hour, style: {display:"grid", gridTemplateColumns:"52px repeat(7,1fr)",
            borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4931}}
            , React.createElement('div', { style: {padding:"8px 6px 0", fontSize:11, color:C.textDim, textAlign:"right", paddingRight:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4933}}, hour)
            , days.map((d, i) => {
              const cellLessons = lessons.filter(l => l.date === yyyymmdd(d) && l.hour === hour);
              return (
                React.createElement('div', { key: i, style: {borderLeft:`1px solid ${C.border}20`, minHeight:58, padding:3,
                  display:"flex", flexDirection:"column", gap:2, minWidth:0, overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4937}}
                  , cellLessons.map(l => (
                    React.createElement(LessonPill, { key: l.id, lesson: l, onClick: () => onSelect(l), compact: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4940}})
                  ))
                )
              );
            })
          )
        ))
      )
    )
  );
};

// ─── VISTA MENSILE ────────────────────────────────────────────────────────────
const MonthView = ({ year, month, lessons, onSelect, onDayClick }) => {
  const firstDay  = new Date(year, month, 1);
  const startDow  = (firstDay.getDay() || 7) - 1;
  const totalDays = new Date(year, month+1, 0).getDate();
  const cells = [
    ...Array.from({length:startDow}, () => null),
    ...Array.from({length:totalDays}, (_, i) => i+1),
  ];
  while(cells.length % 7 !== 0) cells.push(null);

  return (
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 4964}}
      , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4965}}
        , DAYS_SHORT.map(d => (
          React.createElement('div', { key: d, style: {padding:"8px 0", textAlign:"center", fontSize:11,
            letterSpacing:"0.06em", textTransform:"uppercase", color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4967}}, d)
        ))
      )
      , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"repeat(7,1fr)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4971}}
        , cells.map((day, idx) => {
          if(!day) return (
            React.createElement('div', { key: idx, style: {minHeight:90, borderBottom:`1px solid ${C.border}20`, borderRight:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4974}})
          );
          const d = new Date(year, month, day);
          const dayStr = yyyymmdd(d);
          const dayLessons = lessons.filter(l => l.date === dayStr);
          const isToday = isSameDay(d, today);
          return (
            React.createElement('div', { key: idx, onClick: () => onDayClick(d),
              style: {minHeight:"clamp(60px, 10vw, 90px)", borderBottom:`1px solid ${C.border}20`,
                borderRight:`1px solid ${C.border}20`, padding:4, cursor:"pointer", transition:"background 0.1s"},
              onMouseEnter: e => { e.currentTarget.style.background = C.surfaceHover; },
              onMouseLeave: e => { e.currentTarget.style.background = "transparent"; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4981}}
              , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4986}}
                , React.createElement('span', { style: {fontSize:12, fontWeight:500,
                  color: isToday ? C.gold : C.text,
                  background: isToday ? `${C.gold}15` : undefined,
                  borderRadius: isToday ? 4 : undefined,
                  padding: isToday ? "1px 5px" : undefined}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4987}}
                  , day
                )
                , dayLessons.length > 0 && React.createElement('span', { style: {fontSize:10, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4994}}, dayLessons.length)
              )
              , React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4996}}
                , dayLessons.slice(0,3).map(l => (
                  React.createElement(LessonPill, { key: l.id, lesson: l, onClick: e => { e.stopPropagation(); onSelect(l); }, compact: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 4998}})
                ))
                , dayLessons.length > 3 && (
                  React.createElement('div', { style: {fontSize:10, color:C.textDim, paddingLeft:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5001}}, "+", dayLessons.length-3, " altre" )
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
const emptyBrano = { title:"", composer:"", tonality:"", difficulty:"Intermedio", type:"individuale", notes:"" };

const BranoFormInline = ({ initial, onSave, onClose, compact=false }) => {
  const [f, setF] = useState(initial || emptyBrano);
  const [err, setErr] = useState({});
  const set = (k, v) => setF(p => ({...p, [k]:v}));

  const handleSave = () => {
    const e = {};
    if(!f.title.trim())    e.title    = "Titolo obbligatorio";
    if(!f.composer.trim()) e.composer = "Compositore obbligatorio";
    if(Object.keys(e).length){ setErr(e); return; }
    onSave(f);
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:compact?10:22, display:"flex", flexDirection:"column", gap:compact?8:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5033}}
        , React.createElement(Input, { label: "Titolo *" , value: f.title, onChange: e=>set("title",e.target.value), error: err.title, placeholder: "Es. Notturno Op.9 n.2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5034}})
        , React.createElement(Input, { label: "Compositore *" , value: f.composer, onChange: e=>set("composer",e.target.value), error: err.composer, placeholder: "Es. Frédéric Chopin"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5035}})
        , React.createElement(Sel, { label: "Tonalità / Scala"  , value: f.tonality, onChange: e=>set("tonality",e.target.value), options: TONALITY_OPTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5036}})
        , React.createElement(Sel, { label: "Livello di difficoltà"  , value: f.difficulty, onChange: e=>set("difficulty",e.target.value), options: DIFFICULTY_OPTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5037}})
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5038}}
          , React.createElement('label', { style: {fontSize:12, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase", display:"block", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5039}}, "Tipo brano" )
          , React.createElement('div', { style: {display:"flex", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5040}}
            , [["individuale","solo",C.gold,"#2e2308",C.goldDim],["collettivo","group",C.purple,C.purpleBg,C.purpleBorder]].map(([val,icon,fg,bg,bd]) => (
              React.createElement('button', { key: val, onClick: ()=>set("type",val), style: {flex:1, padding:"12px 14px", borderRadius:10,
                border:`2px solid ${f.type===val?fg:C.border}`, background:f.type===val?bg:C.bg,
                cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5042}}
                , React.createElement(Ic, { n: icon, size: 16, stroke: f.type===val?fg:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5045}})
                , React.createElement('div', { style: {textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5046}}
                  , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:f.type===val?fg:C.text, textTransform:"capitalize"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5047}}, val)
                  , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5048}}, val==="individuale"?"Studio personale":"Ensemble / orchestra")
                )
              )
            ))
          )
        )
        , React.createElement(Textarea, { label: "Note / annotazioni"  , value: f.notes, onChange: e=>set("notes",e.target.value), placeholder: "Note aggiuntive, indicazioni tecniche..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5054}})
      )
      , React.createElement('div', { style: {padding:compact?"10px 10px":"14px 22px", borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)", display:"flex", justifyContent:"flex-end", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5056}}
        , React.createElement(Btn, { small: compact, variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5057}}, "Annulla")
        , React.createElement(Btn, { small: compact, onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5058}}, React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5058}}), _optionalChain([initial, 'optionalAccess', _50 => _50.id])?"Salva modifiche":"Aggiungi brano")
      )
    )
  );
};

const DIFF_COLORS = {
  Principiante: { fg:C.green,  bg:C.greenBg,  bd:C.greenBorder  },
  Elementare:   { fg:C.blue,   bg:C.blueBg,   bd:C.blueBorder   },
  Intermedio:   { fg:C.gold,   bg:"#2e2308",  bd:C.goldDim      },
  Avanzato:     { fg:C.orange, bg:C.orangeBg, bd:C.orangeBorder },
  Professionale:{ fg:C.red,    bg:C.redBg,    bd:C.redBorder    },
};
const DiffBadge = ({ diff }) => {
  const dc = DIFF_COLORS[diff] || DIFF_COLORS.Intermedio;
  return (
    React.createElement('span', { style: {fontSize:10,fontWeight:600,letterSpacing:"0.06em",
      background:dc.bg, color:dc.fg, border:`1px solid ${dc.bd}`,
      borderRadius:4, padding:"2px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5074}}
      , diff||"—"
    )
  );
};
const TipoBadge = ({ tipo }) => {
  const isCol = tipo==="collettivo";
  return (
    React.createElement('span', { style: {fontSize:10,fontWeight:600,letterSpacing:"0.06em",
      background:isCol?C.purpleBg:"#2e2308",
      color:isCol?C.purple:C.gold,
      border:`1px solid ${isCol?C.purpleBorder:C.goldDim}`,
      borderRadius:4, padding:"2px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5084}}
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

  const usageCount = id => lessons.filter(l => (l.repertorioIds||[]).includes(id)).length;

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
    const typeBg  = b.type === "collettivo" ? C.purpleBg : "#2e2308";
    const typeBd  = b.type === "collettivo" ? C.purpleBorder : C.goldDim;
    const uses    = usageCount(b.id);
    const open    = expanded === b.id;

    return (
      React.createElement('div', { style: {borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5133}}
        /* Riga principale — clic per espandere */
        , React.createElement('div', { onClick: () => setExpanded(open ? null : b.id),
          style: {display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
            cursor:"pointer", transition:"background 0.12s", background: open ? C.surfaceHover : "transparent"},
          onMouseEnter: e => { if(!open) e.currentTarget.style.background = C.surfaceHover; },
          onMouseLeave: e => { if(!open) e.currentTarget.style.background = "transparent"; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5135}}

          /* Chevron */
          , React.createElement('div', { style: {width:16, flexShrink:0, transition:"transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)", color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5142}}
            , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5144}})
          )

          /* Titolo + compositore */
          , React.createElement('div', { style: {flex:"0 0 38%", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5148}}
            , React.createElement('div', { style: {fontSize:13, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5149}}, b.title)
            , React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5150}}, b.composer)
          )

          /* Tonalità */
          , React.createElement('div', { style: {flex:"0 0 18%", fontSize:12, color:C.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5154}}
            , b.tonality || React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5155}}, "—")
          )

          /* Badge difficoltà */
          , React.createElement('div', { style: {flex:"0 0 120px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5159}}
            , React.createElement('span', { style: {fontSize:11, padding:"2px 8px", borderRadius:4,
              border:`1px solid ${dc.bd}`, background:dc.bg, color:dc.fg, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5160}}
              , b.difficulty
            )
          )

          /* Badge tipo */
          , React.createElement('div', { style: {flex:"0 0 90px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5167}}
            , React.createElement('span', { style: {fontSize:11, padding:"2px 8px", borderRadius:4,
              border:`1px solid ${typeBd}`, background:typeBg, color:typeHex, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5168}}
              , b.type
            )
          )

          /* Utilizzi */
          , React.createElement('div', { style: {flex:"0 0 70px", textAlign:"right", fontSize:11, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5175}}
            , uses > 0 ? `${uses} lez.` : "—"
          )

          /* Azioni */
          , canEdit && (
            React.createElement('div', { style: {display:"flex", gap:2, flexShrink:0}, onClick: e => e.stopPropagation(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5181}}
              , React.createElement('button', { onClick: () => { setTarget(b); setModal("edit"); },
                style: {background:"none", border:"none", cursor:"pointer", color:C.textMuted, padding:"4px 6px", display:"flex", borderRadius:6},
                onMouseEnter: e => e.currentTarget.style.color=C.gold,
                onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5182}}
                , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5186}})
              )
              , React.createElement('button', { onClick: () => { setTarget(b); setModal("delete"); },
                style: {background:"none", border:"none", cursor:"pointer", color:C.textMuted, padding:"4px 6px", display:"flex", borderRadius:6},
                onMouseEnter: e => e.currentTarget.style.color=C.red,
                onMouseLeave: e => e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5188}}
                , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5192}})
              )
            )
          )
        )

        /* Pannello espanso */
        , open && (
          React.createElement('div', { style: {padding:"12px 16px 14px 44px", background:C.surfaceHover,
            borderTop:`1px solid ${C.border}20`, display:"flex", flexDirection:"column", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5200}}
            , b.notes
              ? React.createElement('p', { style: {fontSize:13, color:C.textMuted, lineHeight:1.6, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5203}}, b.notes)
              : React.createElement('p', { style: {fontSize:12, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5204}}, "Nessuna annotazione" )
            
            , React.createElement('div', { style: {fontSize:11, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5206}}, "Usato in "
                , React.createElement('strong', { style: {color:uses>0?C.gold:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5207}}, uses), " " , uses===1?"lezione":"lezioni"
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
      React.createElement('div', { style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden"}, className: "table-scroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5219}}
        /* Header sezione */
        , React.createElement('button', { onClick: () => setOpen(p => !p),
          style: {width:"100%", display:"flex", alignItems:"center", gap:10, padding:"13px 16px",
            background:"none", border:"none", cursor:"pointer", borderBottom: open ? `1px solid ${C.border}` : "none",
            transition:"background 0.12s"},
          onMouseEnter: e => e.currentTarget.style.background=C.surfaceHover,
          onMouseLeave: e => e.currentTarget.style.background="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5221}}
          , React.createElement(Ic, { n: icon, size: 14, stroke: typeHex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5227}})
          , React.createElement('span', { style: {fontSize:12, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textMuted, fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5228}}, label)
          , React.createElement('span', { style: {fontSize:11, color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5229}}, "(", items.length, ")")
          , React.createElement('div', { style: {marginLeft:"auto", transition:"transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5230}}
            , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5231}})
          )
        )

        , open && (
          React.createElement(React.Fragment, null
            /* Header colonne */
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:12, padding:"7px 16px",
              borderBottom:`1px solid ${C.border}`, background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5238}}
              , React.createElement('div', { style: {width:16, flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5240}})
              , React.createElement('div', { style: {flex:"0 0 38%", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5241}}, "Titolo / Compositore"  )
              , React.createElement('div', { style: {flex:"0 0 18%", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5242}}, "Tonalità")
              , React.createElement('div', { style: {flex:"0 0 120px", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5243}}, "Difficoltà")
              , React.createElement('div', { style: {flex:"0 0 90px", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5244}}, "Tipo")
              , React.createElement('div', { style: {flex:"0 0 70px", fontSize:10, color:C.textDim, letterSpacing:"0.08em", textTransform:"uppercase", textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5245}}, "Lezioni")
              , canEdit && React.createElement('div', { style: {width:56}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5246}})
            )
            , items.map(b => React.createElement(BranoRow, { key: b.id, b: b, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5248}}))
          )
        )
      )
    );
  };

  return (
    React.createElement('div', { style: {flex:1, padding:24, overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5256}}
      , React.createElement('div', { style: {maxWidth:1100, margin:"0 auto", display:"flex", flexDirection:"column", gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5257}}

        /* Header */
        , React.createElement('div', { style: {display:"flex", justifyContent:"space-between", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5260}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5261}}
            , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5262}}, "Repertorio")
            , React.createElement('p', { style: {color:C.textMuted, fontSize:14, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5263}}
              , repertorio.length, " brani totali · "    , repertorio.filter(b=>b.type==="individuale").length, " individuali · "   , repertorio.filter(b=>b.type==="collettivo").length, " collettivi"
            )
          )
          , canEdit && React.createElement(Btn, { onClick: ()=>setModal("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5267}}, React.createElement(Ic, { n: "plus", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5267}}), "Nuovo brano" )
        )

        /* Barra ricerca + filtri a tendina */
        , React.createElement('div', { style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px",
          display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5271}}
          /* Ricerca */
          , React.createElement('div', { style: {position:"relative", flex:"1 1 220px", minWidth:180}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5274}}
            , React.createElement('span', { style: {position:"absolute", left:11, top:"50%", transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5275}}
              , React.createElement(Ic, { n: "search", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5276}})
            )
            , React.createElement('input', { value: search, onChange: e => setSearch(e.target.value),
              placeholder: "Cerca titolo, compositore, tonalità..."   ,
              style: {width:"100%", background:C.bg, border:`1px solid ${search?C.goldDim:C.border}`,
                borderRadius:8, color:C.text, fontSize:13, padding:"9px 12px 9px 36px",
                fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5278}})
          )

          /* Tendina tipo */
          , React.createElement('select', { value: filterType, onChange: e => setFT(e.target.value),
            style: {flex:"0 0 130px", background:C.bg, border:`1px solid ${filterType?C.goldDim:C.border}`,
              borderRadius:8, color:filterType?C.gold:C.textMuted, fontSize:13,
              padding:"9px 12px", fontFamily:"'DM Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5286}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5290}}, "Tutti i tipi"  )
            , React.createElement('option', { value: "individuale", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5291}}, "Individuale")
            , React.createElement('option', { value: "collettivo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5292}}, "Collettivo")
          )

          /* Tendina difficoltà */
          , React.createElement('select', { value: filterDiff, onChange: e => setFD(e.target.value),
            style: {flex:"0 0 155px", background:C.bg, border:`1px solid ${filterDiff?C.goldDim:C.border}`,
              borderRadius:8, color:filterDiff?C.gold:C.textMuted, fontSize:13,
              padding:"9px 12px", fontFamily:"'DM Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5296}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5300}}, "Tutte le difficoltà"  )
            , DIFFICULTY_OPTS.map(d => React.createElement('option', { key: d, value: d, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5301}}, d))
          )

          /* Tendina compositore */
          , React.createElement('select', { value: filterComp, onChange: e => setFC(e.target.value),
            style: {flex:"0 0 180px", background:C.bg, border:`1px solid ${filterComp?C.goldDim:C.border}`,
              borderRadius:8, color:filterComp?C.gold:C.textMuted, fontSize:13,
              padding:"9px 12px", fontFamily:"'DM Sans',sans-serif", appearance:"none", cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5305}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5309}}, "Tutti i compositori"  )
            , composers.map(c => React.createElement('option', { key: c, value: c, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5310}}, c))
          )

          /* Reset filtri */
          , hasFilters && (
            React.createElement('button', { onClick: () => { setSearch(""); setFT(""); setFD(""); setFC(""); },
              style: {background:"none", border:`1px solid ${C.border}`, borderRadius:8,
                color:C.textMuted, fontSize:12, padding:"9px 14px", cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:5,
                transition:"all 0.12s", whiteSpace:"nowrap"},
              onMouseEnter: e => { e.currentTarget.style.borderColor=C.red; e.currentTarget.style.color=C.red; },
              onMouseLeave: e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5315}}
              , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5322}}), "Azzera filtri"
            )
          )

          /* Risultati */
          , React.createElement('span', { style: {fontSize:12, color:C.textDim, marginLeft:"auto", whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5327}}
            , filtered.length, " / "  , repertorio.length, " brani"
          )
        )

        /* Sezioni accordion */
        , filtered.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center", padding:"48px 0", color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5334}}
            , React.createElement(Ic, { n: "note", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5335}})
            , React.createElement('p', { style: {marginTop:12, fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5336}}, "Nessun brano trovato"  )
            , hasFilters && React.createElement('p', { style: {fontSize:12, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5337}}, "Prova ad azzera i filtri"    )
          )
        ) : (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5340}}
            , individuali.length > 0 && (
              React.createElement(AccordionSection, { label: "Brani individuali" , items: individuali, typeHex: C.gold, icon: "solo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5342}})
            )
            , collettivi.length > 0 && (
              React.createElement(AccordionSection, { label: "Brani collettivi" , items: collettivi, typeHex: C.purple, icon: "group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5345}})
            )
          )
        )
      )

      , modal==="add"    && React.createElement(Modal, { title: "Nuovo brano" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5351}}, React.createElement(BranoFormInline, { onSave: b=>{onAdd(b);setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5351}}))
      , modal==="edit"   && target && React.createElement(Modal, { title: "Modifica brano" , onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5352}}, React.createElement(BranoFormInline, { initial: target, onSave: b=>{onEdit({...target,...b});setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5352}}))
      , modal==="delete" && target && React.createElement(ConfirmDelete, { label: target.title, onConfirm: ()=>{onDelete(target.id);setModal(null);}, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5353}})
    )
  );
};

// ─── FORM LEZIONE COLLETTIVA ─────────────────────────────────────────────────
const CollectiveLessonForm = ({ courses, students, docenti:_docentiRaw, onSave, onClose }) => {
  const docenti = _docentiRaw || [];
  const collettivi = courses.filter(c => c.type === "collettivo");

  const [step,        setStep]       = useState(1);      // 1=corso  2=dettagli+allievi
  const [selCourse,   setSelCourse]  = useState(null);
  const [selStudents, setSelStudents]= useState([]);      // id[] allievi selezionati
  const [form, setForm] = useState({
    date:      yyyymmdd(today),
    hour:      "15:00",
    teacherId: "",
    room:      "",
    topic:     "",
    notes:     "",
    exercises: "",
    recurrence:"Nessuna",
  });
  const [err, setErr] = useState({});
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

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
      id:         uid(),
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
      attendance: "",
      // campo compat. individuale (nome del corso per visualizzazioni legacy)
      student:    selCourse.name,
      instrument: "Vari",
      // array allievi — la vera struttura collettiva
      students:   studObjs,
    });
  };

  // ── STEP 1: scegli corso ──
  if (step === 1) return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5446}}
        , React.createElement('p', { style: {fontSize:13, color:C.textMuted, margin:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5447}}, "Seleziona la materia integrativa per cui creare la sessione collettiva."

        )
        , collettivi.length === 0 ? (
          React.createElement('div', { style: {textAlign:"center", padding:"32px 0", color:C.textDim, fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5451}}, "Nessun corso collettivo configurato. Aggiungine uno dalla sezione "
                    , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5452}}, "Corsi"), "."
          )
        ) : (
          React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5455}}
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
                    fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5461}}
                  , React.createElement('div', { style: {width:40, height:40, borderRadius:10, background:`${C.purple}20`,
                    border:`1px solid ${C.purpleBorder}`, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5467}}
                    , React.createElement(Ic, { n: "group", size: 18, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5470}})
                  )
                  , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5472}}
                    , React.createElement('div', { style: {fontSize:14, fontWeight:600, color:isS?C.purple:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5473}}, c.name)
                    , c.description && React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5474}}, c.description)
                  )
                  , React.createElement('div', { style: {textAlign:"right", flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5476}}
                    , React.createElement('div', { style: {fontSize:16, fontFamily:"'Cormorant Garamond',serif", fontWeight:600,
                      color:nIscritti>0?C.purple:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5477}}, nIscritti)
                    , React.createElement('div', { style: {fontSize:9, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5479}}, "allievi")
                    , React.createElement('div', { style: {fontSize:9, color:C.textDim, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5480}}, nDocenti, " doc." )
                  )
                )
              );
            })
          )
        )
      )
      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,
        display:"flex", justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5488}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5490}}, "Annulla")
        , React.createElement(Btn, { onClick: () => { if(selCourse) setStep(2); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5491}}, "Avanti "
           , React.createElement(Ic, { n: "right", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5492}})
        )
      )
    )
  );

  // ── STEP 2: docente + dettagli + allievi ──
  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:14,
        maxHeight:"74vh", overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5501}}

        /* Header corso */
        , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:10, padding:"10px 14px",
          background:C.purpleBg, border:`1px solid ${C.purpleBorder}`, borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5505}}
          , React.createElement(Ic, { n: "group", size: 16, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5507}})
          , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5508}}
            , React.createElement('div', { style: {fontSize:13, fontWeight:600, color:C.purple}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5509}}, selCourse.name)
            , selCourse.description && React.createElement('div', { style: {fontSize:11, color:C.textMuted, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5510}}, selCourse.description)
          )
          , React.createElement('button', { onClick: () => { setStep(1); setSelStudents([]); },
            style: {background:"none", border:`1px solid ${C.border}`, borderRadius:6,
              cursor:"pointer", color:C.textMuted, fontSize:11, padding:"3px 10px",
              fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5512}}, "Cambia"

          )
        )

        /* Selezione docente */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5521}}
          , React.createElement('label', { style: {fontSize:11, color:err.teacherId?C.red:C.textMuted,
            letterSpacing:"0.07em", textTransform:"uppercase", display:"block", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5522}}, "Docente *"

          )
          , courseDocenti.length === 0 ? (
            React.createElement('p', { style: {fontSize:12, color:C.textDim, fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5527}}, "Nessun docente assegnato a questo corso. Modificalo dalla sezione Corsi."

            )
          ) : (
            React.createElement('div', { style: {display:"flex", gap:8, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5531}}
              , courseDocenti.map(d => {
                const isS = form.teacherId === d.id;
                return (
                  React.createElement('button', { key: d.id, onClick: () => set("teacherId", d.id),
                    style: {display:"flex", alignItems:"center", gap:8, padding:"8px 14px",
                      borderRadius:10, cursor:"pointer", textAlign:"left",
                      border:`2px solid ${isS?C.gold:C.border}`,
                      background:isS?C.goldBg:C.surface, transition:"all 0.12s",
                      fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5535}}
                    , React.createElement('div', { style: {width:30, height:30, borderRadius:"50%", flexShrink:0,
                      background:`${C.gold}20`, border:`1px solid ${C.goldDim}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:11, fontWeight:700, color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5541}}
                      , initials(d.nome||d.name||"")
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5547}}
                      , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:isS?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5548}}
                        , d.nome||d.name
                      )
                      , React.createElement('div', { style: {fontSize:10, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5551}}, d.strumenti||d.instrument||"")
                    )
                  )
                );
              })
            )
          )
          , err.teacherId && React.createElement('div', { style: {fontSize:11, color:C.red, marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5558}}, err.teacherId)
        )

        /* Data, orario, sala */
        , React.createElement('div', { style: {display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5562}}
          , React.createElement(Input, { label: "Data *" , type: "date", value: form.date,
            onChange: e=>set("date",e.target.value), error: err.date, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5563}})
          , React.createElement(Input, { label: "Orario *" , type: "time", value: form.hour,
            onChange: e=>set("hour",e.target.value), error: err.hour, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5565}})
          , React.createElement(Input, { label: "Sala", value: form.room,
            onChange: e=>set("room",e.target.value), placeholder: "Es. Sala A"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5567}})
        )
        , React.createElement(Input, { label: "Argomento", value: form.topic,
          onChange: e=>set("topic",e.target.value),
          placeholder: `Es. Introduzione a ${selCourse.name}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5570}})
        , React.createElement(Textarea, { label: "Note", value: form.notes,
          onChange: e=>set("notes",e.target.value), placeholder: "Annotazioni...", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5573}})

        /* Ricorrenza */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5577}}
          , React.createElement('label', { style: {fontSize:11, color:C.textMuted, letterSpacing:"0.07em",
            textTransform:"uppercase", display:"block", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5578}}, "Ricorrenza")
          , React.createElement('div', { style: {display:"flex", gap:6, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5580}}
            , RECURRENCE_OPTS.map(r => (
              React.createElement('button', { key: r, onClick: () => set("recurrence",r),
                style: {padding:"6px 14px", borderRadius:20, fontSize:12,
                  border:`2px solid ${form.recurrence===r?C.blue:C.border}`,
                  background:form.recurrence===r?C.blueBg:C.bg,
                  color:form.recurrence===r?C.blue:C.textMuted, cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center",
                  gap:5, transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5582}}
                , r!=="Nessuna" && React.createElement(Ic, { n: "repeat", size: 11, stroke: form.recurrence===r?C.blue:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5589}})
                , r
              )
            ))
          )
        )

        /* Selezione allievi */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5597}}
          , React.createElement('div', { style: {display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5598}}
            , React.createElement('label', { style: {fontSize:11, color:err.students?C.red:C.textMuted,
              letterSpacing:"0.07em", textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5599}}, "Allievi iscritti *"

            )
            , React.createElement('div', { style: {display:"flex", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5603}}
              , React.createElement('button', { onClick: selectAll,
                style: {fontSize:11, padding:"2px 10px", borderRadius:6, cursor:"pointer",
                  background:C.purpleBg, color:C.purple, border:`1px solid ${C.purpleBorder}`,
                  fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5604}}, "Tutti")
              , React.createElement('button', { onClick: deselectAll,
                style: {fontSize:11, padding:"2px 10px", borderRadius:6, cursor:"pointer",
                  background:C.bg, color:C.textMuted, border:`1px solid ${C.border}`,
                  fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5608}}, "Nessuno")
            )
          )
          , err.students && React.createElement('div', { style: {fontSize:11, color:C.red, marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5614}}, err.students)

          , enrolled.length === 0 ? (
            React.createElement('div', { style: {padding:"20px 0", textAlign:"center", color:C.textDim, fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5617}}, "Nessun allievo attivo iscritto a questo corso."

            )
          ) : (
            React.createElement('div', { style: {display:"flex", flexDirection:"column", gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5621}}
              , enrolled.map(s => {
                const isSel = selStudents.includes(s.id);
                const sc    = insHex(s.instrument);
                return (
                  React.createElement('button', { key: s.id, onClick: () => toggleStudent(s.id),
                    style: {display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                      borderRadius:8, cursor:"pointer", textAlign:"left", width:"100%",
                      border:`2px solid ${isSel?sc:C.border}`,
                      background:isSel?`${sc}10`:C.surface, transition:"all 0.12s",
                      fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5626}}
                    /* checkbox */
                    , React.createElement('div', { style: {width:18, height:18, borderRadius:5, flexShrink:0,
                      border:`2px solid ${isSel?sc:C.border}`, background:isSel?sc:"transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5633}}
                      , isSel && React.createElement(Ic, { n: "check", size: 10, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5637}})
                    )
                    /* avatar */
                    , React.createElement('div', { style: {width:30, height:30, borderRadius:"50%", flexShrink:0,
                      background:`${sc}20`, border:`1px solid ${sc}40`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, fontWeight:700, color:sc}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5640}}
                      , initials(s.name)
                    )
                    , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5646}}
                      , React.createElement('div', { style: {fontSize:13, fontWeight:500, color:isSel?sc:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5647}}, s.name)
                      , React.createElement('div', { style: {fontSize:11, color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5648}}, s.instrument, " · "  , s.level||"—")
                    )
                    , isSel && React.createElement(Ic, { n: "check", size: 13, stroke: sc, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5650}})
                  )
                );
              })
            )
          )

          /* Riepilogo */
          , selStudents.length > 0 && (
            React.createElement('div', { style: {marginTop:8, padding:"8px 14px", background:C.purpleBg,
              border:`1px solid ${C.purpleBorder}`, borderRadius:8, fontSize:12,
              color:C.purple, display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5659}}
              , React.createElement(Ic, { n: "group", size: 13, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5662}})
              , selStudents.length, " allievo/i · 1 lezione con tutti gli allievi assegnati"
            )
          )
        )
      )

      , React.createElement('div', { style: {padding:"14px 22px", borderTop:`1px solid ${C.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5669}}
        , React.createElement(Btn, { variant: "secondary", onClick: () => setStep(1), __self: this, __source: {fileName: _jsxFileName, lineNumber: 5671}}
          , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5672}}), "Indietro"
        )
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5674}}
          , React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5675}}), "Crea lezione"
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
};

const TrialLessonForm = ({ docenti:_docentiRaw, courses:_coursesRaw, initial, onSave, onClose, date }) => {
  const docenti = _docentiRaw || [];
  const courses = _coursesRaw || [];
  const [f, setF] = useState(initial || {...emptyProva, date: date || yyyymmdd(today)});
  const [err, setErr] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  // Corsi individuali + collettivi come opzioni strumento/corso
  const corsiOpts = [
    ...courses.filter(c=>c.type==="collettivo").map(c=>({id:c.id, label:c.name})),
    ...["Pianoforte","Violino","Chitarra","Flauto","Batteria","Canto","Sassofono","Tromba","Violoncello","Solfeggio"]
      .filter(s => !courses.find(c=>c.name===s))
      .map(s=>({id:s, label:s}))
  ];

  const validate = () => {
    const e = {};
    if(!f.teacher)    e.teacher    = "Seleziona un docente";
    if(!f.instrument) e.instrument = "Seleziona un corso/strumento";
    if(!f.date)       e.date       = "Data obbligatoria";
    if(!f.hour)       e.hour       = "Orario obbligatorio";
    if(!f.phone.trim()) e.phone    = "Recapito obbligatorio";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if(Object.keys(e).length){ setErr(e); return; }
    onSave({
      ...f, id: uid(), tipo:"prova",
      student: "", iscritto: false, attendance:"",
      recurrence:"Nessuna", repertorioIds:[],
    });
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22, display:"flex", flexDirection:"column", gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5727}}
        /* Banner informativo */
        , React.createElement('div', { style: {padding:"10px 14px", background:C.tealBg, border:`1px solid ${C.tealBorder}`,
          borderRadius:8, display:"flex", alignItems:"center", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5729}}
          , React.createElement(Ic, { n: "user", size: 15, stroke: C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5731}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5732}}
            , React.createElement('div', { style: {fontSize:12, fontWeight:600, color:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5733}}, "Lezione di prova"  )
            , React.createElement('div', { style: {fontSize:11, color:C.teal, opacity:0.8, marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5734}}, "Nessun allievo ancora iscritto — il contatto verrà collegato all'allievo dopo l'iscrizione"

            )
          )
        )

        /* Nome contatto */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5741}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5742}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5743}}, "Nome contatto" )
            , React.createElement('input', { value: f.contactName, onChange: e=>set("contactName",e.target.value),
              placeholder: "Es. Marco Rossi"  ,
              style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5744}})
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5749}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5750}}, "Recapito telefonico *"  )
            , React.createElement('input', { type: "tel", value: f.phone, onChange: e=>set("phone",e.target.value),
              placeholder: "Es. 333 1234567"  ,
              style: {width:"100%",background:C.surface,border:`1px solid ${err.phone?C.red:C.border}`,
                borderRadius:8,color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5751}})
            , err.phone && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5755}}, err.phone)
          )
        )

        /* Docente */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5760}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5761}}, "Docente *"

          )
          , React.createElement('select', { value: f.teacher, onChange: e=>set("teacher",e.target.value),
            style: {width:"100%",background:C.surface,border:`1px solid ${err.teacher?C.red:C.border}`,
              borderRadius:8,color:f.teacher?C.text:C.textMuted,fontSize:13,padding:"10px 14px",
              fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5764}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5768}}, "— seleziona docente —"   )
            , docenti.map(d=>(
              React.createElement('option', { key: d.id, value: d.teacherKey||d.nome, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5770}}, d.nome, " · "  , d.strumenti)
            ))
          )
          , err.teacher && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5773}}, err.teacher)
        )

        /* Corso / Strumento */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5777}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5778}}, "Corso / Strumento *"

          )
          , React.createElement('select', { value: f.instrument, onChange: e=>set("instrument",e.target.value),
            style: {width:"100%",background:C.surface,border:`1px solid ${err.instrument?C.red:C.border}`,
              borderRadius:8,color:f.instrument?C.text:C.textMuted,fontSize:13,padding:"10px 14px",
              fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5781}}
            , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5785}}, "— seleziona corso —"   )
            , corsiOpts.map(c=>React.createElement('option', { key: c.id, value: c.label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5786}}, c.label))
          )
          , err.instrument && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5788}}, err.instrument)
        )

        /* Data e Orario */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 5792}}
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5793}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5794}}, "Data *" )
            , React.createElement('input', { type: "date", value: f.date, onChange: e=>set("date",e.target.value),
              style: {width:"100%",background:C.surface,border:`1px solid ${err.date?C.red:C.border}`,
                borderRadius:8,color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5795}})
            , err.date && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5798}}, err.date)
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5800}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5801}}, "Orario *" )
            , React.createElement('input', { type: "time", value: f.hour, onChange: e=>set("hour",e.target.value),
              style: {width:"100%",background:C.surface,border:`1px solid ${err.hour?C.red:C.border}`,
                borderRadius:8,color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5802}})
            , err.hour && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5805}}, err.hour)
          )
        )

        /* Sala */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5810}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5811}}, "Sala")
          , React.createElement('input', { value: f.room, onChange: e=>set("room",e.target.value),
            placeholder: "Es. Sala A"  ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5812}})
        )

        /* Note */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5819}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5820}}, "Note")
          , React.createElement('textarea', { value: f.notes, onChange: e=>set("notes",e.target.value), rows: 3,
            placeholder: "Motivazioni, interessi musicali, strumento richiesto..."    ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",
              resize:"vertical",lineHeight:1.5,boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5821}})
        )
      )

      , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5829}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5830}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, style: {background:C.teal, borderColor:C.teal}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5831}}
          , React.createElement(Ic, { n: "user", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5832}}), "Crea lezione prova"
        )
      )
    )
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────

const CalendarioView = ({ lessons:propLessons, setLessons:propSetLessons, courses:_propCoursesRaw, students:_propStudentsRaw, docenti:_propDocentiRaw }) => {
  const isMobile = useIsMobile();
  const propCourses = _propCoursesRaw || [];
  const propStudents = _propStudentsRaw || [];
  const propDocenti = _propDocentiRaw || [];
  const [_lessons, _setLessons] = useState(INIT_LESSONS);
  const lessons    = _nullishCoalesce(propLessons, () => ( _lessons));
  const setLessons = _nullishCoalesce(propSetLessons, () => ( _setLessons));
    const [viewMode,  setViewMode]  = useState("day");
    const [curDate,   setCurDate]   = useState(new Date(today));
    const [modal,     setModal]     = useState(null);
    const [selLesson, setSelLesson] = useState(null);
    const [addDate,   setAddDate]   = useState(null);
    const [role,      setRole]      = useState("admin"); // admin | docente | allievo
    const currentStudent = "Sofia Marchetti"; // in produzione verrà dal sistema di login
    const [repertorio,  setRepertorio] = useState(INIT_REPERTORIO);
    const [appView,     setAppView]    = useState("calendario"); // calendario | repertorio
  
    const closeModal = () => { setModal(null); setSelLesson(null); setAddDate(null); setNextLessonCreated(null); };
  
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

    const handleAdd        = (data)      => { setLessons(p => [...p, {...data, id:uid()}]); closeModal(); };
    const handleAddProva   = (data)      => { setLessons(p => [...p, data]); closeModal(); };
    const handleIscrizioneProva = (id, studentName, iscritto) => {
      setLessons(p => p.map(l => l.id === id
        ? {...l, iscritto, student: iscritto ? studentName : ""}
        : l
      ));
    };
    const handleAddCollective  = (lesson) => { setLessons(p => [...p, lesson]); closeModal(); };
    const handleEdit       = (data)      => { setLessons(p => p.map(l => l.id === data.id ? {...l,...data} : l)); closeModal(); };
    const handleDelete     = ()          => { setLessons(p => p.filter(l => l.id !== _optionalChain([selLesson, 'optionalAccess', _54 => _54.id]))); closeModal(); };
    const handleAttendance = (id, val) => {
      setLessons(prev => {
        const updated = prev.map(l => l.id === id ? {...l, attendance:val} : l);

        // Se segno presenza (qualsiasi valore) su lezione ricorrente → crea la prossima
        const lesson = prev.find(l => l.id === id);
        if (lesson && val && val !== "" && lesson.recurrence && lesson.recurrence !== "Nessuna") {
          const daysMap = { "Ogni settimana":7, "Ogni 2 settimane":14, "Ogni mese":30 };
          const gap     = daysMap[lesson.recurrence] || 7;
          const nextDate = yyyymmdd(addDays(new Date(lesson.date+"T00:00:00"), gap));

          // Evita duplicati: controlla se esiste già una lezione stesso studente/ora/data
          const exists = updated.some(l =>
            l.date === nextDate &&
            l.hour === lesson.hour &&
            (isColl(lesson)
              ? l.courseId === lesson.courseId
              : l.student  === lesson.student)
          );
          if (!exists) {
            const nextLesson = {
              ...lesson,
              id:         uid(),
              date:       nextDate,
              attendance: "",
              notes:      "",
              exercises:  "",
            };
            setNextLessonCreated(nextDate); // feedback toast
            return [...updated, nextLesson];
          }
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
        ? lessons.filter(l => studentInLesson(l, currentStudent))
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
      return ls;
    }, [lessons, role, filterCorso, filterDocente, filterTipo]);
  
    const todayStr     = yyyymmdd(today);
    const todayLessons = visibleLessons.filter(l => l.date === todayStr);
    const ws           = startOfWeek(today);
    const we           = addDays(ws, 6);
    const weekLessons  = visibleLessons.filter(l => l.date >= yyyymmdd(ws) && l.date <= yyyymmdd(we));
    const pending      = visibleLessons.filter(l => l.date <= todayStr && !l.attendance).length;
  
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 5967}}, G)
        , React.createElement('div', { style: {minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5968}}

          /* Navbar */
          , React.createElement('div', { style: {background:C.surface, borderBottom:`1px solid ${C.border}`,
            padding:"0 16px", display:"flex", alignItems:"center", flexShrink:0, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5971}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:10, padding:"14px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5973}}
              , React.createElement('div', { style: {width:26, height:26, borderRadius:6, background:C.gold,
                display:"flex", alignItems:"center", justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5974}}
                , React.createElement(Ic, { n: "music", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5976}})
              )
              , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5978}}, "Accademia Musicale · Calendario"   )
            )
          )

          /* Calendario sempre visibile */
          , true && React.createElement(React.Fragment, null

          /* Stats ribbon */
          , React.createElement('div', { style: {background:C.surface, borderBottom:`1px solid ${C.border}`,
            padding:"8px 16px", display:"flex", gap:16, flexShrink:0, overflowX:"auto", WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5986}}
            , [
              { label:"Oggi",                  count:todayLessons.length, sub:"lezioni",       hex:C.gold   },
              { label:"Questa settimana",       count:weekLessons.length,  sub:"lezioni",       hex:C.blue   },
              { label:"Presenza da segnare",    count:pending,             sub:"lezioni passate", hex:pending > 0 ? C.orange : C.green },
            ].map(s => (
              React.createElement('div', { key: s.label, style: {display:"flex", alignItems:"center", gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5993}}
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5994}}, s.count)
                , React.createElement('div', { style: {fontSize:11}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5995}}
                  , React.createElement('div', { style: {color:s.hex, opacity:0.8, textTransform:"uppercase", letterSpacing:"0.06em", fontSize:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5996}}, s.label)
                  , React.createElement('div', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5997}}, s.sub)
                )
                , React.createElement('div', { style: {width:1, height:30, background:C.border, marginLeft:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 5999}})
              )
            ))
          )

          /* Toolbar */
          , React.createElement('div', { className: "cal-toolbar", style: {padding:isMobile?"10px 12px":"14px 24px", display:"flex", justifyContent:"space-between",
            alignItems:"center", flexShrink:0, gap:isMobile?8:12, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6005}}
            , React.createElement('div', { style: {display:"flex", alignItems:"center", gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6007}}
              , React.createElement('button', { onClick: () => navigate(-1), style: {background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:8, color:C.textMuted, padding:"7px 10px", cursor:"pointer", display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6008}}
                , React.createElement(Ic, { n: "left", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6010}})
              )
              , React.createElement('button', { onClick: () => navigate(1), style: {background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:8, color:C.textMuted, padding:"7px 10px", cursor:"pointer", display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6012}}
                , React.createElement(Ic, { n: "right", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6014}})
              )
              , React.createElement('button', { onClick: () => setCurDate(new Date(today)),
                style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
                  color:C.textMuted, padding:"7px 12px", cursor:"pointer", fontSize:12,
                  fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6016}}
                , React.createElement(Ic, { n: "today", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6020}}), "Oggi"
              )
              , React.createElement('span', { className: "cal-nav-label", style: {fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600,
                marginLeft:4, color:C.text, whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6022}}, navLabel)
            )

            , React.createElement('div', { className: "cal-toolbar-right", style: {display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6026}}
              , React.createElement('div', { style: {display:"flex", background:C.surface, border:`1px solid ${C.border}`,
                borderRadius:8, overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6027}}
                , [["day","Giorno","day"],["week","Settimana","week"],["month","Mese","cal"]].map(([v, lbl, icon]) => (
                  React.createElement('button', { key: v, onClick: () => setViewMode(v),
                    style: {padding:"7px clamp(8px,2vw,12px)", border:"none",
                      background: viewMode === v ? `${C.gold}20` : "transparent",
                      color: viewMode === v ? C.gold : C.textMuted,
                      cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif",
                      display:"flex", alignItems:"center", gap:4, transition:"all 0.12s",
                      borderRight:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6030}}
                    , React.createElement(Ic, { n: icon, size: 14, stroke: viewMode === v ? C.gold : C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6037}})
                    , React.createElement('span', { style: {fontSize:11}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6038}}, lbl)
                  )
                ))
              )
              , (role === "admin" || role === "docente") && (
                React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6043}}
                  , React.createElement(Btn, { variant: "secondary", onClick: () => { setAddDate(viewMode==="day"?yyyymmdd(curDate):yyyymmdd(today)); setModal("addprova"); },
                    style: {border:`1px solid ${C.teal}`,color:C.teal,background:C.tealBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6044}}
                    , React.createElement(Ic, { n: "user", size: 14, stroke: C.teal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6046}}), React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6046}}, "Lezione prova" )
                  )
                  , React.createElement(Btn, { variant: "secondary", onClick: () => setModal("addcoll"),
                    style: {border:`1px solid ${C.purple}`,color:C.purple,background:C.purpleBg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6048}}
                    , React.createElement(Ic, { n: "group", size: 14, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6050}}), React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6050}}, "Collettiva")
                  )
                  , React.createElement(Btn, { onClick: () => { setAddDate(viewMode === "day" ? yyyymmdd(curDate) : yyyymmdd(today)); setModal("add"); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6052}}
                    , React.createElement(Ic, { n: "plus", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6053}}), React.createElement('span', { className: "tb-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6053}}, "Nuova lezione" )
                  )
                )
              )
            )
          )

          /* Barra filtri */
          , (role === "admin" || role === "docente") && (() => {
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
                gap:8, flexWrap:"wrap", flexShrink:0, overflowX:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6074}}
                , React.createElement(Ic, { n: "filter", size: 13, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6077}})
                /* Filtro corso/strumento */
                , React.createElement('div', { style: {position:"relative", display:"flex", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6079}}
                  , React.createElement('select', { value: filterCorso, onChange: e=>setFilterCorso(e.target.value),
                    style: {appearance:"none", background:filterCorso?C.goldBg:C.bg,
                      border:`1px solid ${filterCorso?C.goldDim:C.border}`, borderRadius:8,
                      padding:"5px 28px 5px 10px", fontSize:12, color:filterCorso?C.gold:C.textMuted,
                      cursor:"pointer", fontFamily:"'DM Sans',sans-serif", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6080}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6085}}, "Tutti i corsi"  )
                    , corsiColl.length>0 && React.createElement('optgroup', { label: "Corsi collettivi" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6086}}
                      , corsiColl.map(c=>React.createElement('option', { key: c.id, value: c.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6087}}, c.label))
                    )
                    , strumentiInd.length>0 && React.createElement('optgroup', { label: "Strumenti individuali" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6089}}
                      , strumentiInd.map(c=>React.createElement('option', { key: c.id, value: c.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6090}}, c.label))
                    )
                  )
                  , React.createElement(Ic, { n: "right", size: 11, stroke: filterCorso?C.gold:C.textDim,
                    style: {position:"absolute", right:8, pointerEvents:"none", transform:"rotate(90deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6093}})
                )
                /* Filtro docente */
                , React.createElement('div', { style: {position:"relative", display:"flex", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6097}}
                  , React.createElement('select', { value: filterDocente, onChange: e=>setFilterDocente(e.target.value),
                    style: {appearance:"none", background:filterDocente?C.goldBg:C.bg,
                      border:`1px solid ${filterDocente?C.goldDim:C.border}`, borderRadius:8,
                      padding:"5px 28px 5px 10px", fontSize:12, color:filterDocente?C.gold:C.textMuted,
                      cursor:"pointer", fontFamily:"'DM Sans',sans-serif", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6098}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6103}}, "Tutti i docenti"  )
                    , docenteOpts.map(d=>React.createElement('option', { key: d, value: d, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6104}}, d))
                  )
                  , React.createElement(Ic, { n: "right", size: 11, stroke: filterDocente?C.gold:C.textDim,
                    style: {position:"absolute", right:8, pointerEvents:"none", transform:"rotate(90deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6106}})
                )
                /* Filtro tipo lezione */
                , React.createElement('div', { style: {position:"relative", display:"flex", alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6110}}
                  , React.createElement('select', { value: filterTipo, onChange: e=>setFilterTipo(e.target.value),
                    style: {appearance:"none", background:filterTipo?C.tealBg:C.bg,
                      border:`1px solid ${filterTipo?C.tealBorder:C.border}`, borderRadius:8,
                      padding:"5px 28px 5px 10px", fontSize:12, color:filterTipo?C.teal:C.textMuted,
                      cursor:"pointer", fontFamily:"'DM Sans',sans-serif", minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6111}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6116}}, "Tutti i tipi"  )
                    , React.createElement('option', { value: "normale", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6117}}, "Individuali")
                    , React.createElement('option', { value: "collettivo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6118}}, "Collettive")
                    , React.createElement('option', { value: "prova", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6119}}, "Lezioni prova" )
                  )
                  , React.createElement(Ic, { n: "right", size: 11, stroke: filterTipo?C.teal:C.textDim,
                    style: {position:"absolute", right:8, pointerEvents:"none", transform:"rotate(90deg)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6121}})
                )

                /* Reset filtri */
                , hasFilter && (
                  React.createElement('button', { onClick: ()=>{setFilterCorso(""); setFilterDocente(""); setFilterTipo("");},
                    style: {display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
                      borderRadius:8, border:`1px solid ${C.border}`, background:C.bg,
                      cursor:"pointer", fontSize:11, color:C.textMuted,
                      fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6127}}
                    , React.createElement(Ic, { n: "x", size: 11, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6132}}), "Reset"
                  )
                )
                , hasFilter && (
                  React.createElement('span', { style: {fontSize:11, color:C.textDim, marginLeft:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6136}}
                    , visibleLessons.length, " lezione/i"
                  )
                )
              )
            );
          })()

          /* Contenuto */
          , React.createElement('div', { style: {flex:1, padding:"0 12px 12px", overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6145}}
            , React.createElement('div', { style: {background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden"}, className: "table-scroll", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6146}}
              , viewMode === "day"   && React.createElement('div', { style: {padding:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6147}}, React.createElement(DayView, { date: curDate, lessons: visibleLessons, onSelect: l => { setSelLesson(l); setModal("detail"); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6147}}))
              , viewMode === "week"  && React.createElement(WeekView, {  weekStart: weekStart, lessons: visibleLessons, onSelect: l => { setSelLesson(l); setModal("detail"); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6148}})
              , viewMode === "month" && React.createElement(MonthView, { year: curDate.getFullYear(), month: curDate.getMonth(), lessons: visibleLessons, onSelect: l => { setSelLesson(l); setModal("detail"); }, onDayClick: d => { setCurDate(d); setViewMode("day"); }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6149}})
            )
          )
          )
        )

        , modal === "add" && (
          React.createElement(Modal, { title: "Nuova lezione" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6156}}
            , React.createElement(LessonForm, { initial: addDate ? {...emptyLesson, date:addDate} : undefined, onSave: handleAdd, onClose: closeModal, repertorio: repertorio, onAddBrano: b => setRepertorio(p=>[...p,b]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6157}})
          )
        )
        , modal === "edit" && selLesson && (
          React.createElement(Modal, { title: "Modifica lezione" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6161}}
            , React.createElement(LessonForm, { initial: selLesson, onSave: handleEdit, onClose: closeModal, repertorio: repertorio, onAddBrano: b => setRepertorio(p=>[...p,b]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6162}})
          )
        )
        , modal === "detail" && selLesson && (
          React.createElement(LessonDetailModal, {
            lesson: lessons.find(l => l.id === selLesson.id) || selLesson,
            onEdit: () => setModal("edit"),
            onDelete: () => setModal("delete"),
            onAttendance: handleAttendance,
            onIscrizione: handleIscrizioneProva,
            students: propStudents,
            nextLessonDate: _optionalChain([selLesson, 'optionalAccess', _55 => _55.recurrence]) && selLesson.recurrence !== 'Nessuna' ? nextLessonCreated : null,
            onClose: closeModal,
            role: role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6166}})
        )
        , modal === "delete" && selLesson && (
          React.createElement(ConfirmDel, { label: selLesson.student, onConfirm: handleDelete, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6178}})
        )
        , modal === "addcoll" && (
          React.createElement(Modal, { title: "Nuova lezione collettiva"  , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6181}}
            , React.createElement(CollectiveLessonForm, {
              courses: propCourses,
              students: propStudents,
              docenti: propDocenti,
              onSave: handleAddCollective,
              onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6182}})
          )
        )
        , modal === "addprova" && (
          React.createElement(Modal, { title: "Lezione di prova"  , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6191}}
            , React.createElement(TrialLessonForm, {
              docenti: propDocenti,
              courses: propCourses,
              date: addDate,
              onSave: handleAddProva,
              onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6192}})
          )
        )
      )
    );
};


// ════════════════════════════════════════════════════════════════════════════════

// CONTABILITÀ

// ════════════════════════════════════════════════════════════════════════════════

// ─── COSTANTI ─────────────────────────────────────────────────────────────────
const ANNO_ATT = new Date().getFullYear();
const MESE_ATT = new Date().getMonth();
const CATEGORIE = [
  { id:"docenti",       label:"Compensi docenti",   hex:C.gold,   bg:C.goldBg,    bd:C.goldDim    },
  { id:"pulizie",       label:"Pulizie",             hex:C.teal,   bg:C.tealBg,    bd:C.tealBorder },
  { id:"rappresentanza",label:"Rappresentanza",      hex:C.purple, bg:C.purpleBg,  bd:C.purpleBorder},
  { id:"materiale",     label:"Acquisto materiale",  hex:C.blue,   bg:C.blueBg,    bd:C.blueBorder },
  { id:"utenze",        label:"Utenze",              hex:C.orange, bg:C.orangeBg,  bd:C.orangeBorder},
  { id:"manutenzione",  label:"Manutenzione",        hex:C.red,    bg:C.redBg,     bd:C.redBorder  },
  { id:"altro",         label:"Altro",               hex:C.textMuted,bg:C.surface, bd:C.border     },
];
const catById = id => CATEGORIE.find(c=>c.id===id)||CATEGORIE[CATEGORIE.length-1];

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
const SpesaForm = ({ initial, onSave, onClose }) => {
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
      const d = DOCENTI.find(x=>x.id===f.docenteId);
      if(d) desc = `Compenso mensile ${d.name}`;
    }
    onSave({...f, desc, importo:Number(f.importo)});
  };

  const cat = catById(f.categoria);

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22,display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6375}}

        /* Categoria */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6378}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6379}}, "Categoria")
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6380}}
            , CATEGORIE.map(c=>(
              React.createElement('button', { key: c.id, onClick: ()=>set("categoria",c.id),
                style: {padding:"8px 6px",borderRadius:8,border:`2px solid ${f.categoria===c.id?c.hex:C.border}`,
                  background:f.categoria===c.id?c.bg:C.bg,cursor:"pointer",fontSize:11,textAlign:"center",
                  color:f.categoria===c.id?c.hex:C.textMuted,fontFamily:"'DM Sans',sans-serif",
                  fontWeight:f.categoria===c.id?500:400,transition:"all 0.12s",lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6382}}
                , c.label
              )
            ))
          )
        )

        /* Se categoria = docenti, mostra select docente */
        , f.categoria==="docenti" && (
          React.createElement(Sel, { label: "Docente", value: f.docenteId, onChange: e=>{ set("docenteId",e.target.value); const d=DOCENTI.find(x=>x.id===e.target.value); if(d) set("desc",`Compenso mensile ${d.name}`); },
            options: [{value:"",label:"— seleziona docente —"},...DOCENTI.map(d=>({value:d.id,label:d.name}))], __self: this, __source: {fileName: _jsxFileName, lineNumber: 6395}})
        )

        , React.createElement(Input, { label: "Descrizione *" , value: f.desc, onChange: e=>set("desc",e.target.value), error: err.desc, placeholder: "Es. Bolletta luce gennaio, Spartiti..."    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6399}})

        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6401}}
          , React.createElement(Input, { label: "Importo (€) *"  , type: "number", value: f.importo, onChange: e=>set("importo",e.target.value), error: err.importo, placeholder: "0.00", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6402}})
          , React.createElement(Input, { label: "Data *" , type: "date", value: f.data, onChange: e=>set("data",e.target.value), error: err.data, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6403}})
          , React.createElement(Sel, { label: "Mese di riferimento"  , value: f.mese, onChange: e=>set("mese",Number(e.target.value)),
            options: MESI.map((m,i)=>({value:i,label:m})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6404}})
          , React.createElement(Input, { label: "Anno", type: "number", value: f.anno, onChange: e=>set("anno",Number(e.target.value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6406}})
        )

        , React.createElement(Sel, { label: "Metodo di pagamento"  , value: f.metodo, onChange: e=>set("metodo",e.target.value), options: METODI_PAG, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6409}})
        , React.createElement(Textarea, { label: "Note", value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note aggiuntive..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6410}})
      )
      , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6412}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6413}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6414}}, React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6414}}), _optionalChain([initial, 'optionalAccess', _56 => _56.id])?"Salva modifiche":"Registra spesa")
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
    React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6432}}
      , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
        border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,marginBottom:20,padding:0,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6433}}
        , React.createElement(Ic, { n: "left", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6435}}), "Tutti i docenti"
      )

      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:14,marginBottom:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6438}}
        , React.createElement('div', { style: {width:52,height:52,borderRadius:14,background:C.goldBg,border:`2px solid ${C.goldDim}`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6439}}
          , React.createElement(Ic, { n: "user", size: 24, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6441}})
        )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6443}}
          , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6444}}, docente.name)
          , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6445}}, docente.instrument)
        )
        , React.createElement('div', { style: {marginLeft:"auto",textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6447}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.06em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6448}}, "Pagato " , ANNO_ATT)
          , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6449}}, fmt(totAnno))
        )
      )

      /* Storico per mese */
      , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6454}}
        , perMese.length===0 && (
          React.createElement('div', { style: {textAlign:"center",padding:"40px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6456}}, "Nessun compenso registrato"  )
        )
        , perMese.map(m=>(
          React.createElement('div', { key: m.idx, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6459}}
            , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"11px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6460}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.06em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6462}}, m.mese, " " , ANNO_ATT)
              , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6463}}, fmt(m.tot))
            )
            , m.spese.map(s=>(
              React.createElement('div', { key: s.id, style: {display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 16px",borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6466}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6468}}
                  , React.createElement('div', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6469}}, s.desc)
                  , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6470}}
                    , new Date(s.data+"T00:00:00").toLocaleDateString("it-IT"), " · "  , s.metodo
                  )
                )
                , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6474}}, fmt(s.importo))
              )
            ))
          )
        ))
      )
    )
  );
};

// ─── REPORT / SALDO NETTO ─────────────────────────────────────────────────────
const ReportView = ({ spese, entrate }) => {
  const [anno, setAnno] = useState(ANNO_ATT);

  const speseAnno    = spese.filter(s=>s.anno===anno);
  const entrateAnno  = entrate.filter(e=>e.anno===anno);

  const totUscite  = speseAnno.reduce((t,s)=>t+s.importo,0);
  const totEntrate = entrateAnno.reduce((t,e)=>t+e.importo,0);
  const saldo      = totEntrate - totUscite;

  // Per categoria
  const perCat = CATEGORIE.map(c=>({
    ...c,
    tot: speseAnno.filter(s=>s.categoria===c.id).reduce((t,s)=>t+s.importo,0),
    n:   speseAnno.filter(s=>s.categoria===c.id).length,
  })).filter(c=>c.tot>0).sort((a,b)=>b.tot-a.tot);

  // Per mese (entrate vs uscite)
  const datiMesi = MESI.map((m,i)=>({
    mese:m,
    uscite:  speseAnno.filter(s=>s.mese===i).reduce((t,s)=>t+s.importo,0),
    entrate: entrateAnno.filter(e=>e.mese===i).reduce((t,e)=>t+e.importo,0),
  }));
  const maxVal = Math.max(...datiMesi.flatMap(d=>[d.uscite,d.entrate]),1);

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6511}}

      /* Header */
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6514}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6515}}
          , React.createElement('h2', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6516}}, "Report & saldo netto"   )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:13,marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6517}}, "Anno " , anno)
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6519}}
          , React.createElement('button', { onClick: ()=>setAnno(p=>p-1), style: {background:C.surface,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.textMuted,padding:"7px 10px",cursor:"pointer",display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6520}}
            , React.createElement(Ic, { n: "left", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6522}})
          )
          , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,minWidth:60,textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6524}}, anno)
          , React.createElement('button', { onClick: ()=>setAnno(p=>p+1), style: {background:C.surface,border:`1px solid ${C.border}`,
            borderRadius:8,color:C.textMuted,padding:"7px 10px",cursor:"pointer",display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6525}}
            , React.createElement(Ic, { n: "right", size: 16, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6527}})
          )
        )
      )

      /* KPI saldo */
      , React.createElement('div', { className: "stat-strip-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6533}}
        , [
          {label:"Entrate totali",  val:fmt(totEntrate), hex:C.green, icon:"arrow_up"},
          {label:"Uscite totali",   val:fmt(totUscite),  hex:C.red,   icon:"arrow_dn"},
          {label:"Saldo netto",     val:fmt(saldo),      hex:saldo>=0?C.green:C.red, icon:saldo>=0?"arrow_up":"arrow_dn"},
        ].map(k=>(
          React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${k.hex}30`,borderRadius:12,padding:"18px 20px",
            borderLeft:`4px solid ${k.hex}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6539}}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6541}}
              , React.createElement(Ic, { n: k.icon, size: 14, stroke: k.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6542}})
              , React.createElement('span', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6543}}, k.label)
            )
            , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:k.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6545}}, k.val)
          )
        ))
      )

      /* Grafico entrate vs uscite */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6551}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6552}}
          , React.createElement('span', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6553}}, "Entrate vs Uscite mensili"   )
          , React.createElement('div', { style: {display:"flex",gap:12,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6554}}
            , [{lbl:"Entrate",hex:C.green},{lbl:"Uscite",hex:C.red}].map(l=>(
              React.createElement('div', { key: l.lbl, style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6556}}
                , React.createElement('div', { style: {width:10,height:10,borderRadius:2,background:l.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6557}})
                , React.createElement('span', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6558}}, l.lbl)
              )
            ))
          )
        )
        , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:130}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6563}}
          , datiMesi.map((d,i)=>{
            const hE = maxVal>0?Math.max((d.entrate/maxVal)*120,d.entrate>0?3:0):0;
            const hU = maxVal>0?Math.max((d.uscite/maxVal)*120,d.uscite>0?3:0):0;
            const isCur = i===MESE_ATT&&anno===ANNO_ATT;
            return (
              React.createElement('div', { key: i, style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6569}}
                , React.createElement('div', { style: {display:"flex",gap:2,alignItems:"flex-end",width:"100%",justifyContent:"center",height:126}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6570}}
                  , React.createElement('div', { title: `Entrate: ${fmt(d.entrate)}`, style: {flex:1,height:hE,borderRadius:"3px 3px 0 0",
                    background:isCur?C.green:`${C.green}55`,transition:"height 0.3s",minHeight:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6571}})
                  , React.createElement('div', { title: `Uscite: ${fmt(d.uscite)}`, style: {flex:1,height:hU,borderRadius:"3px 3px 0 0",
                    background:isCur?C.red:`${C.red}55`,transition:"height 0.3s",minHeight:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6573}})
                )
                , React.createElement('div', { style: {fontSize:9,color:isCur?C.gold:C.textDim,letterSpacing:"0.04em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6576}}
                  , d.mese.slice(0,3).toUpperCase()
                )
              )
            );
          })
        )
      )

      /* Breakdown per categoria */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6586}}
        , React.createElement('div', { style: {padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6587}}
          , React.createElement(Ic, { n: "tag", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6588}})
          , React.createElement('span', { style: {fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6589}}, "Uscite per categoria"  )
        )
        , perCat.length===0?(
          React.createElement('div', { style: {padding:"30px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6592}}, "Nessuna spesa registrata"  )
        ):(
          React.createElement('div', { style: {padding:"12px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6594}}
            , perCat.map(c=>{
              const pct = totUscite>0?(c.tot/totUscite*100):0;
              return (
                React.createElement('div', { key: c.id, style: {padding:"10px 20px",display:"flex",alignItems:"center",gap:14,
                  transition:"background 0.1s"},
                  onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                  onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6598}}
                  /* Dot categoria */
                  , React.createElement('div', { style: {width:10,height:10,borderRadius:"50%",background:c.hex,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6603}})
                  /* Nome */
                  , React.createElement('div', { style: {width:160,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6605}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6606}}, c.label)
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6607}}, c.n, " voc" , c.n===1?"e":"i")
                  )
                  /* Barra */
                  , React.createElement('div', { style: {flex:1,height:8,background:C.border,borderRadius:4,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6610}}
                    , React.createElement('div', { style: {height:"100%",width:`${pct}%`,background:c.hex,borderRadius:4,transition:"width 0.4s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6611}})
                  )
                  /* % e importo */
                  , React.createElement('div', { style: {textAlign:"right",flexShrink:0,minWidth:100}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6614}}
                    , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:c.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6615}}, fmt(c.tot))
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6616}}, pct.toFixed(1), "%")
                  )
                )
              );
            })
          )
        )
      )

      /* Tabella mensile dettagliata */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6626}}
        , React.createElement('div', { style: {padding:"13px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6627}}
          , React.createElement('span', { style: {fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6628}}, "Dettaglio mensile" )
        )
        , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6630}}
          , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6631}}
            , React.createElement('tr', { style: {background:C.bg,borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6632}}
              , ["Mese","Entrate","Uscite","Saldo"].map(h=>(
                React.createElement('th', { key: h, style: {padding:"9px 16px",textAlign:"left",fontSize:10,
                  letterSpacing:"0.07em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6634}}, h)
              ))
            )
          )
          , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6639}}
            , datiMesi.map((d,i)=>{
              const sl = d.entrate - d.uscite;
              const isCur = i===MESE_ATT&&anno===ANNO_ATT;
              return (
                React.createElement('tr', { key: i, style: {borderBottom:`1px solid ${C.border}20`,
                  background:isCur?C.goldBg:"transparent",transition:"background 0.1s"},
                  onMouseEnter: e=>{if(!isCur)e.currentTarget.style.background=C.surfaceHover;},
                  onMouseLeave: e=>{if(!isCur)e.currentTarget.style.background="transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6644}}
                  , React.createElement('td', { style: {padding:"10px 16px",fontSize:13,fontWeight:isCur?600:400,color:isCur?C.gold:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6648}}, d.mese)
                  , React.createElement('td', { style: {padding:"10px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:d.entrate>0?C.green:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6649}}, d.entrate>0?fmt(d.entrate):"—")
                  , React.createElement('td', { style: {padding:"10px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:d.uscite>0?C.red:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6650}}, d.uscite>0?fmt(d.uscite):"—")
                  , React.createElement('td', { style: {padding:"10px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,
                    color:sl>0?C.green:sl<0?C.red:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6651}}, (d.entrate>0||d.uscite>0)?fmt(sl):"—")
                )
              );
            })
            , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6656}}
              , React.createElement('td', { style: {padding:"12px 16px",fontWeight:600,color:C.gold,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6657}}, "Totale " , anno)
              , React.createElement('td', { style: {padding:"12px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6658}}, fmt(totEntrate))
              , React.createElement('td', { style: {padding:"12px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6659}}, fmt(totUscite))
              , React.createElement('td', { style: {padding:"12px 16px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:saldo>=0?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6660}}, fmt(saldo))
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
const CAT_ENTRATE = [
  { id:"quota",        label:"Quota mensile",     icon:"receipt", student:true  },
  { id:"iscrizione",   label:"Iscrizione annuale", icon:"star",    student:true  },
  { id:"concerto",     label:"Concerto",           icon:"music",   student:false },
  { id:"evento",       label:"Evento / Saggio",    icon:"calendar",student:false },
  { id:"altro",        label:"Altro",              icon:"plus",    student:false },
];

const EntrataForm = ({ students, initial, onSave, onClose }) => {
  const MESI_ALL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
                    "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const [f, setF] = useState(initial || {
    categoria: "quota",
    studentId: "", importo: "", mese: new Date().getMonth()+1,
    anno: new Date().getFullYear(), data: yyyymmdd(today),
    metodo: "Bonifico bancario", desc: "", note: "",
  });
  const [err, setErr] = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const catObj     = CAT_ENTRATE.find(c=>c.id===f.categoria)||CAT_ENTRATE[0];
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
      studentId:   needStudent ? Number(f.studentId) : null,
      studentName: _optionalChain([s, 'optionalAccess', _57 => _57.name]) || "",
      importo:     Number(f.importo),
      mese:        Number(f.mese),
      anno:        Number(f.anno),
      desc:        autoDesc || f.desc,
    });
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:22,display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6737}}
        /* Categoria */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6739}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6740}}, "Categoria *" )
          , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6741}}
            , CAT_ENTRATE.map(c=>{
              const isS=f.categoria===c.id;
              return (
                React.createElement('button', { key: c.id, onClick: ()=>{set("categoria",c.id); if(!c.student){set("studentId","");}},
                  style: {display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:20,
                    border:`2px solid ${isS?C.green:C.border}`,background:isS?C.greenBg:C.bg,
                    color:isS?C.green:C.textMuted,cursor:"pointer",fontSize:12,
                    fontFamily:"'DM Sans',sans-serif",fontWeight:isS?600:400,transition:"all 0.12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6745}}
                  , React.createElement(Ic, { n: c.icon, size: 12, stroke: isS?C.green:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6750}})
                  , c.label
                )
              );
            })
          )
        )

        /* Allievo (solo per categorie che lo richiedono) */
        , needStudent && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6760}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6761}}, "Allievo *" )
            , React.createElement('select', { value: f.studentId, onChange: handleStudentChange,
              style: {width:"100%",background:C.surface,border:`1px solid ${err.studentId?C.red:C.border}`,borderRadius:8,
                color:f.studentId?C.text:C.textMuted,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6762}}
              , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6765}}, "— seleziona allievo —"   )
              , students.filter(s=>s.status==="attivo").map(s=>(
                React.createElement('option', { key: s.id, value: s.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6767}}, s.name, " (" , s.instrument, ")")
              ))
            )
            , err.studentId && React.createElement('div', { style: {fontSize:11,color:C.red,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6770}}, err.studentId)
          )
        )

        , selStudent && (
          React.createElement('div', { style: {padding:"10px 14px",background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:8,
            display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6775}}
            , React.createElement('span', { style: {fontSize:12,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6777}}
              , f.categoria==="quota"?"Quota mensile prevista":"Importo suggerito"
            )
            , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6780}}, "€"
              , f.categoria==="quota"?selStudent.monthlyFee:selStudent.monthlyFee*2, " / "  , f.categoria==="quota"?"mese":"anno"
            )
          )
        )

        /* Descrizione (per categorie senza allievo o Altro) */
        , (!needStudent || f.categoria==="altro") && (
          React.createElement(Input, { label: "Descrizione *" , value: f.desc, onChange: e=>set("desc",e.target.value),
            error: err.desc, placeholder: `Es. ${catObj.label}…`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6788}})
        )

        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6792}}
          , (f.categoria==="quota" || f.categoria==="iscrizione") && (
            React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6794}}
              , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6795}}, "Mese di riferimento"  )
              , React.createElement('select', { value: f.mese, onChange: e=>set("mese",Number(e.target.value)),
                style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                  color:C.text,fontSize:13,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",appearance:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6796}}
                , MESI_ALL.map((m,i)=>React.createElement('option', { key: i+1, value: i+1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6799}}, m))
              )
            )
          )
          , React.createElement(Input, { label: "Anno", type: "number", value: f.anno, onChange: e=>set("anno",Number(e.target.value)), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6803}})
          , React.createElement(Input, { label: "Importo (€) *"  , type: "number", value: f.importo, onChange: e=>set("importo",e.target.value), error: err.importo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6804}})
          , React.createElement(Input, { label: "Data *" , type: "date", value: f.data, onChange: e=>set("data",e.target.value), error: err.data, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6805}})
        )
        , React.createElement(Sel, { label: "Metodo di pagamento"  , value: f.metodo, onChange: e=>set("metodo",e.target.value), options: METODI_PAG, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6807}})
        , React.createElement(Textarea, { label: "Note", value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note aggiuntive..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 6808}})
      )
      , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6810}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6811}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6812}}, React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6812}}), _optionalChain([initial, 'optionalAccess', _58 => _58.id])?"Salva modifiche":"Registra entrata")
      )
    )
  );
};

// Navbar interna alla Contabilità
const Navbar = ({ tab, setTab, onSelDoc, onSetModal, onSetModalQuota }) => (
  React.createElement('div', { style: {background:C.surface, borderBottom:`1px solid ${C.border}`,
    padding:"0 16px", display:"flex", alignItems:"center", gap:4, flexShrink:0, flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6820}}
    , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8,paddingRight:20,marginRight:8,
      borderRight:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6822}}
      , React.createElement(Ic, { n: "euro", size: 14, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6824}})
      , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6825}}, "Contabilità")
    )
    , [
      {id:"spese",   label:"Uscite",   icon:"down"},
      {id:"entrate", label:"Entrate",  icon:"up"},
      {id:"docenti", label:"Docenti",  icon:"user"},
      {id:"report",  label:"Report",   icon:"chart"},
    ].map(t=>(
      React.createElement('button', { key: t.id, onClick: ()=>{ setTab(t.id); _optionalChain([onSelDoc, 'optionalCall', _59 => _59()]); },
        style: {display:"flex",alignItems:"center",gap:6,padding:"0 16px",
          alignSelf:"stretch",background:"none",border:"none",
          borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
          color:tab===t.id?C.gold:C.textMuted,cursor:"pointer",
          fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",
          minHeight:48}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6833}}
        , React.createElement(Ic, { n: t.icon, size: 13, stroke: tab===t.id?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6840}}), t.label
      )
    ))
    , React.createElement('div', { style: {marginLeft:"auto",display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6843}}
      , tab==="entrate"  && onSetModalQuota && (
        React.createElement(Btn, { small: true, onClick: onSetModalQuota, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6845}}, React.createElement(Ic, { n: "plus", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6845}}), "Nuova entrata" )
      )
      , tab==="spese"  && onSetModal && (
        React.createElement(Btn, { small: true, onClick: onSetModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6848}}, React.createElement(Ic, { n: "plus", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6848}}), "Registra spesa" )
      )
    )
  )
);

const ContabilitaView = ({ students:propStudents, entrate:propEntrate, setEntrate:propSetEntrate, config:propConfig, setConfig:propSetConfig }) => {
  const isMobile = useIsMobile();
  const [_entrate, _setEntrate] = useState(INIT_ENTRATE_QUOTE);
  const entrate    = _nullishCoalesce(propEntrate, () => ( _entrate));
  const setEntrate = _nullishCoalesce(propSetEntrate, () => ( _setEntrate));
  const students   = _nullishCoalesce(propStudents, () => ( []));
  const config     = _nullishCoalesce(propConfig, () => ( CONFIG_DEFAULT));
  const setConfig  = _nullishCoalesce(propSetConfig, () => ( (()=>{})));
  const [spese,    setSpese]    = useState(INIT_SPESE);
    const [tab,      setTab]      = useState("spese");
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
      setEntrate(p=>[...p,{...d, id:uid(), numRicevuta}]);
      setConfig(p=>({...p, progressivoRicevute: progressivo + 1}));
      closeModal();
    };
    const handleEditQ  = d => { setEntrate(p=>p.map(x=>x.id===d.id?{...x,...d}:x)); closeModal(); };
    const handleDelQ   = () => { setEntrate(p=>p.filter(x=>x.id!==_optionalChain([selQuota, 'optionalAccess', _61 => _61.id]))); closeModal(); };
  
    // Stats ribbon
    const MESE_C = new Date().getMonth()+1; // 1-indexed
    const totMese    = spese.filter(s=>s.mese===MESE_ATT&&s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0);
    const totAnno    = spese.filter(s=>s.anno===ANNO_ATT).reduce((t,s)=>t+s.importo,0);
    const totDocAnno = spese.filter(s=>s.anno===ANNO_ATT&&s.categoria==="docenti").reduce((t,s)=>t+s.importo,0);
    const totQuoteAnno = entrate.filter(e=>e.anno===ANNO_ATT||(e.anno===ANNO_ATT-1&&e.mese>=9)).reduce((t,e)=>t+e.importo,0);
    const totQuoteMese = entrate.filter(e=>e.mese===MESE_C&&e.anno===new Date().getFullYear()).reduce((t,e)=>t+e.importo,0);
  
    // Spese filtrate
    const filtered = spese.filter(s=>{
      const q=search.toLowerCase();
      return s.anno===ANNO_ATT
        &&(!q||s.desc.toLowerCase().includes(q)||(s.note||"").toLowerCase().includes(q))
        &&(!filterCat||s.categoria===filterCat)
        &&(!filterMese||s.mese===Number(filterMese));
    }).sort((a,b)=>b.data.localeCompare(a.data));
  
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
          , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6918}}, G)
          , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6919}}
            , React.createElement(Navbar, { tab: tab, setTab: setTab, onSelDoc: ()=>setSelDoc(null), onSetModalQuota: ()=>setModal('addq'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6920}})
            , React.createElement('div', { style: {flex:1,padding:24,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6921}}
              , React.createElement(DocenteView, { docente: d, spese: spese, onBack: ()=>setSelDoc(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6922}})
            )
          )
        )
      );
    }
  
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 6931}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6932}}
          , React.createElement(Navbar, { tab: tab, setTab: t=>{ setTab(t); setSelDoc(null); }, onSetModal: ()=>setModal("add"), onSetModalQuota: ()=>setModal('addq'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 6933}})

          /* Stats ribbon */
          , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"10px 24px",display:"flex",gap:0,flexShrink:0,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6936}}
            , [
              {label:"Entrate (a.s.)",  val:fmt(totQuoteAnno), hex:C.green},
              {label:"Entrate mese",      val:fmt(totQuoteMese), hex:C.green,  opacity:0.7},
              {label:`Uscite totali ${ANNO_ATT}`,val:fmt(totAnno),      hex:C.red},
              {label:"Compensi docenti",         val:fmt(totDocAnno),   hex:C.gold},
            ].map((s,i)=>(
              React.createElement('div', { key: s.label, style: {display:"flex",alignItems:"center",gap:10,paddingRight:24,marginRight:i<3?24:0,
                borderRight:i<3?`1px solid ${C.border}`:"none",opacity:s.opacity||1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6944}}
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6946}}, s.val)
                , React.createElement('div', { style: {fontSize:10,color:s.hex,opacity:0.8,textTransform:"uppercase",letterSpacing:"0.06em",maxWidth:90,lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6947}}, s.label)
              )
            ))
            , React.createElement('div', { style: {marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6950}})
          )

          , React.createElement('div', { style: {flex:1,padding:24,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6953}}

            /* TAB SPESE */
            , tab==="spese" && (
              React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6957}}

                /* Filtri */
                , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6960}}
                  , React.createElement('div', { style: {position:"relative",flex:"1 1 200px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6961}}
                    , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6962}}
                      , React.createElement(Ic, { n: "search", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6963}})
                    )
                    , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
                      placeholder: "Cerca spesa..." ,
                      style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.text,fontSize:13,padding:"9px 12px 9px 36px",fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6965}})
                  )
                  , React.createElement('select', { value: filterCat, onChange: e=>setFCat(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterCat?C.goldDim:C.border}`,borderRadius:8,
                      color:filterCat?C.gold:C.textMuted,fontSize:13,padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6970}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6973}}, "Tutte le categorie"  )
                    , CATEGORIE.map(c=>React.createElement('option', { key: c.id, value: c.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6974}}, c.label))
                  )
                  , React.createElement('select', { value: filterMese, onChange: e=>setFMese(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterMese?C.goldDim:C.border}`,borderRadius:8,
                      color:filterMese?C.gold:C.textMuted,fontSize:13,padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6976}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6979}}, "Tutti i mesi"  )
                    , MESI.map((m,i)=>React.createElement('option', { key: i, value: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6980}}, m))
                  )
                  , (search||filterCat||filterMese)&&(
                    React.createElement('button', { onClick: ()=>{setSearch("");setFCat("");setFMese("");},
                      style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,
                        fontSize:12,padding:"9px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                        display:"flex",alignItems:"center",gap:5},
                      onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                      onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6983}}
                      , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 6989}}), "Azzera"
                    )
                  )
                  , React.createElement('span', { style: {fontSize:12,color:C.textDim,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6992}}, filtered.length, " voci" )
                )

                /* Lista spese */
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6996}}
                  , React.createElement('div', { style: {overflowX:"auto",WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6997}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"auto 2fr 1fr 1fr 1fr auto",minWidth:520,
                    padding:"9px 18px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 6998}}
                    , ["Cat.","Descrizione","Mese","Metodo","Importo",""].map(h=>(
                      React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7001}}, h)
                    ))
                  )
                  , filtered.length===0?(
                    React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7005}}, "Nessuna spesa trovata"  )
                  ):filtered.map((s,i)=>{
                    const cat = catById(s.categoria);
                    const doc = s.docenteId?DOCENTI.find(d=>d.id===s.docenteId):null;
                    return (
                      React.createElement('div', { key: s.id, style: {display:"grid",gridTemplateColumns:"auto 2fr 1fr 1fr 1fr auto",minWidth:520,
                        padding:"12px 18px",borderBottom:i<filtered.length-1?`1px solid ${C.border}20`:"none",
                        alignItems:"center",transition:"background 0.1s"},
                        onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                        onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7010}}
                        /* Badge categoria */
                        , React.createElement('div', { style: {marginRight:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7016}}
                          , React.createElement('span', { style: {display:"inline-block",width:9,height:9,borderRadius:"50%",background:cat.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7017}})
                        )
                        /* Descrizione */
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7020}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7021}}, s.desc)
                          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7022}}
                            , new Date(s.data+"T00:00:00").toLocaleDateString("it-IT")
                            , doc && React.createElement(React.Fragment, null, " · "  , React.createElement('span', { style: {color:cat.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7024}}, doc.name))
                            , s.note && React.createElement(React.Fragment, null, " · "  , s.note)
                          )
                        )
                        /* Mese */
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7029}}, MESI[s.mese])
                        /* Metodo */
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7031}}, s.metodo)
                        /* Importo */
                        , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7033}}, fmt(s.importo))
                        /* Azioni */
                        , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7035}}
                          , React.createElement('button', { onClick: ()=>{setSelSpesa(s);setModal("edit");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: e=>e.currentTarget.style.color=C.gold,
                            onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7036}}
                            , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7040}})
                          )
                          , React.createElement('button', { onClick: ()=>{setSelSpesa(s);setModal("delete");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: e=>e.currentTarget.style.color=C.red,
                            onMouseLeave: e=>e.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7042}}
                            , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7046}})
                          )
                        )
                      )
                    );
                  })
                  )
                )
              )
            )

            /* TAB DOCENTI */
            , tab==="docenti" && (
              React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7059}}
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7060}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",minWidth:480,
                    padding:"9px 18px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7061}}
                    , ["Docente","Strumenti","Pagato anno","Ultimo pagamento",""].map(h=>(
                      React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7064}}, h)
                    ))
                  )
                  , docenteStats.map((d,i)=>(
                    React.createElement('div', { key: d.id, onClick: ()=>setSelDoc(d.id),
                      style: {display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr auto",minWidth:480,
                        padding:"14px 18px",borderBottom:i<docenteStats.length-1?`1px solid ${C.border}20`:"none",
                        cursor:"pointer",transition:"background 0.12s",alignItems:"center"},
                      onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                      onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7068}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7074}}
                        , React.createElement('div', { style: {width:36,height:36,borderRadius:"50%",background:C.goldBg,
                          border:`1px solid ${C.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7075}}
                          , React.createElement(Ic, { n: "user", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7077}})
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7079}}
                          , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7080}}, d.name)
                        )
                      )
                      , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7083}}, d.instrument)
                      , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7084}}
                        , d.totAnno>0?fmt(d.totAnno):"—"
                      )
                      , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7087}}
                        , d.ultimoPag?new Date(d.ultimoPag+"T00:00:00").toLocaleDateString("it-IT"):"—"
                      )
                      , React.createElement(Ic, { n: "right", size: 16, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7090}})
                    )
                  ))
                )
              )
            )

            /* TAB QUOTE */
            , tab==="entrate" && (() => {
              const MESI_ALL = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
              const curY = new Date().getFullYear(), curM = new Date().getMonth()+1;
              const qFiltrate = entrate
                .filter(e=>{
                  const q = searchQ.toLowerCase();
                  return (!q||e.studentName.toLowerCase().includes(q)||e.desc.toLowerCase().includes(q))
                    && (!filterQMese||Number(filterQMese)===e.mese);
                })
                .sort((a,b)=>b.data.localeCompare(a.data));
              const totQFiltrate = qFiltrate.reduce((t,e)=>t+e.importo,0);

              // Riepilogo per allievo (usato in tabella studenti)
              const stSummary = students.map(s=>{
                const pagamenti = entrate.filter(e=>e.studentId===s.id);
                const totPag    = pagamenti.reduce((t,e)=>t+e.importo,0);
                const ultPag    = pagamenti.sort((a,b)=>b.data.localeCompare(a.data))[0];
                return {...s, totPag, ultPag:_optionalChain([ultPag, 'optionalAccess', _68 => _68.data])||null, nPagamenti:pagamenti.length};
              });

              return (
                React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7119}}
                  /* Riepilogo per allievo */
                  , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7121}}
                    , React.createElement('div', { style: {padding:"12px 20px",borderBottom:`1px solid ${C.border}`,
                      display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7122}}
                      , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7124}}, "Riepilogo quote per allievo"   )
                      , React.createElement('span', { style: {fontSize:12,color:C.green,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7125}}, "Totale incassato a.s.: "   , fmt(totQuoteAnno))
                    )
                    , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7127}}
                      , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7128}}
                        , React.createElement('tr', { style: {background:C.bg,borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7129}}
                          , ["Allievo","Strumento","Quota mensile","Quote pagate","Totale incassato","Ultimo pagamento"].map(h=>(
                            React.createElement('th', { key: h, style: {padding:"9px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7131}}, h)
                          ))
                        )
                      )
                      , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7135}}
                        , stSummary.map((s,i)=>(
                          React.createElement('tr', { key: s.id, style: {borderBottom:i<stSummary.length-1?`1px solid ${C.border}20`:"none",
                            transition:"background 0.1s"},
                            onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                            onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7137}}
                            , React.createElement('td', { style: {padding:"12px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7141}}
                              , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7142}}, s.name)
                              , React.createElement(Badge, { label: s.status, color: s.status==="attivo"?"green":s.status==="sospeso"?"gold":"red", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7143}})
                            )
                            , React.createElement('td', { style: {padding:"12px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7145}}, React.createElement(Badge, { label: s.instrument, color: "gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7145}}))
                            , React.createElement('td', { style: {padding:"12px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7146}}, "€", s.monthlyFee)
                            , React.createElement('td', { style: {padding:"12px 18px",fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7147}}, s.nPagamenti, " pagam." )
                            , React.createElement('td', { style: {padding:"12px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:s.totPag>0?C.green:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7148}}
                              , s.totPag>0?fmt(s.totPag):"—"
                            )
                            , React.createElement('td', { style: {padding:"12px 18px",fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7151}}
                              , s.ultPag?new Date(s.ultPag+"T00:00:00").toLocaleDateString("it-IT"):"—"
                            )
                          )
                        ))
                      )
                    )
                  )

                  /* Lista pagamenti filtrata */
                  , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7161}}
                    , React.createElement('div', { style: {position:"relative",flex:"1 1 200px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7162}}
                      , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7163}}, React.createElement(Ic, { n: "search", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7163}}))
                      , React.createElement('input', { value: searchQ, onChange: e=>setSearchQ(e.target.value), placeholder: "Cerca descrizione, allievo..."  ,
                        style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                          color:C.text,fontSize:13,padding:"9px 12px 9px 36px",fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7164}})
                    )
                    , React.createElement('select', { value: filterQMese, onChange: e=>setFQMese(e.target.value),
                      style: {background:C.surface,border:`1px solid ${filterQMese?C.goldDim:C.border}`,borderRadius:8,
                        color:filterQMese?C.gold:C.textMuted,fontSize:13,padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7168}}
                      , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7171}}, "Tutti i mesi"  )
                      , MESI_ALL.map((m,i)=>React.createElement('option', { key: i+1, value: i+1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7172}}, m))
                    )
                    , (searchQ||filterQMese)&&(
                      React.createElement('button', { onClick: ()=>{setSearchQ("");setFQMese("");},
                        style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,fontSize:12,padding:"9px 12px",
                          cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5},
                        onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                        onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7175}}
                        , React.createElement(Ic, { n: "x", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7180}}), "Azzera"
                      )
                    )
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7183}}, qFiltrate.length, " entrate · "   , fmt(totQFiltrate))
                  )

                  , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7186}}
                    , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 100px auto",minWidth:480,
                      padding:"9px 18px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7187}}
                      , ["Descrizione","Categoria","Data","Metodo","Importo",""].map(h=>(
                        React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7190}}, h)
                      ))
                    )
                    , qFiltrate.length===0?(
                      React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7194}}, "Nessun pagamento trovato"  )
                    ):qFiltrate.map((e,i)=>(
                      React.createElement('div', { key: e.id, style: {display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 100px auto",minWidth:520,
                        padding:"12px 18px",borderBottom:i<qFiltrate.length-1?`1px solid ${C.border}20`:"none",
                        alignItems:"center",transition:"background 0.1s"},
                        onMouseEnter: el=>el.currentTarget.style.background=C.surfaceHover,
                        onMouseLeave: el=>el.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7196}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7201}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7202}}, e.desc||e.studentName||"—")
                          , e.numRicevuta&&React.createElement('div', { style: {fontSize:11,color:C.gold,marginTop:1,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7203}}, "Ric. n° "  , e.numRicevuta)
                          , e.studentName&&e.categoria!=="quota"&&React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7204}}, e.studentName)
                          , e.note&&React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7205}}, e.note)
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7207}}
                          , (()=>{const c=CAT_ENTRATE.find(x=>x.id===e.categoria)||{label:"Quota",icon:"receipt"};
                            return React.createElement('span', { style: {fontSize:11,padding:"2px 8px",borderRadius:10,background:C.greenBg,
                              color:C.green,border:`1px solid ${C.greenBorder}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7209}}, c.label);})()
                        )
                        , React.createElement('div', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7212}}
                          , new Date(e.data+"T00:00:00").toLocaleDateString("it-IT")
                        )
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7215}}, e.metodo)
                        , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7216}}, fmt(e.importo))
                        , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7217}}
                          , React.createElement('button', { onClick: ()=>{setSelQuota(e);setModal("ricevuta");},
                            title: "Stampa ricevuta" ,
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: el=>el.currentTarget.style.color=C.gold,
                            onMouseLeave: el=>el.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7218}}
                            , React.createElement(Ic, { n: "receipt", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7223}})
                          )
                          , React.createElement('button', { onClick: ()=>{setSelQuota(e);setModal("editq");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: el=>el.currentTarget.style.color=C.gold,
                            onMouseLeave: el=>el.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7225}}
                            , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7229}})
                          )
                          , React.createElement('button', { onClick: ()=>{setSelQuota(e);setModal("deleteq");},
                            style: {background:"none",border:"none",cursor:"pointer",color:C.textMuted,padding:4,display:"flex",borderRadius:6},
                            onMouseEnter: el=>el.currentTarget.style.color=C.red,
                            onMouseLeave: el=>el.currentTarget.style.color=C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7231}}
                            , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7235}})
                          )
                        )
                      )
                    ))
                  )
                )
              );
            })()

            /* TAB REPORT */
            , tab==="report" && React.createElement(ReportView, { spese: spese, entrate: entrate, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7246}})
          )
        )

        , modal==="add"    && React.createElement(Modal, { title: "Registra spesa" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7250}}, React.createElement(SpesaForm, { onSave: handleAdd, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7250}}))
        , modal==="edit"   && selSpesa && React.createElement(Modal, { title: "Modifica spesa" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7251}}, React.createElement(SpesaForm, { initial: selSpesa, onSave: handleEdit, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7251}}))
        , modal==="delete" && selSpesa && React.createElement(ConfirmDel, { label: selSpesa.desc, onConfirm: handleDel, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7252}})
        , modal==="addq"   && React.createElement(Modal, { title: "Nuova entrata" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7253}}, React.createElement(EntrataForm, { students: students, onSave: handleAddQ, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7253}}))
        , modal==="editq"  && selQuota && React.createElement(Modal, { title: "Modifica entrata" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7254}}, React.createElement(EntrataForm, { students: students, initial: selQuota, onSave: handleEditQ, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7254}}))
        , modal==="deleteq"&& selQuota && React.createElement(ConfirmDel, { label: selQuota.desc, onConfirm: handleDelQ, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7255}})
        , modal==="ricevuta" && selQuota && (
          React.createElement(RicevutaModal, {
            entrata: selQuota,
            student: students.find(s=>s.id===selQuota.studentId),
            config: config,
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7257}}
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
   note:"Celebre notturno, richiede fraseggio cantabile e tocco morbido. Fondamentale lavorare sul rubato.",
   allievi:["Sofia Marchetti","Alessandro Gallo"], insegnante:"Prof. Rossi",
   lezioni:7, dataPrima:"2024-10-15", dataUltima:"2025-05-20"},

  {id:"b2",  title:"Invenzione n.1 in Do maggiore BWV 772", composer:"Johann S. Bach",     periodo:"Barocco",    tonality:"Do maggiore",  difficulty:"Intermedio",    tipo:"individuale",
   note:"Contrappunto a due voci. Attenzione all'indipendenza delle mani.",
   allievi:["Luca Ferrara","Emma Conti"], insegnante:"Prof. Rossi",
   lezioni:5, dataPrima:"2025-01-10", dataUltima:"2025-04-28"},

  {id:"b3",  title:"Partita n.2 in Re minore BWV 1004",   composer:"Johann S. Bach",     periodo:"Barocco",    tonality:"Re minore",    difficulty:"Professionale", tipo:"individuale",
   note:"Per violino solo. Chaconne finale è uno dei pezzi più impegnativi del repertorio violinistico.",
   allievi:["Emma Conti"], insegnante:"Prof. Rossi",
   lezioni:12, dataPrima:"2024-09-01", dataUltima:"2025-05-22"},

  {id:"b4",  title:"Sonata K.331 in La maggiore",          composer:"W.A. Mozart",        periodo:"Classico",   tonality:"La maggiore",  difficulty:"Intermedio",    tipo:"individuale",
   note:"Tema con variazioni, Rondò alla Turca nel finale. Classico del repertorio pianistico.",
   allievi:["Giulia Romano","Sofia Marchetti"], insegnante:"Prof. Bianchi",
   lezioni:8, dataPrima:"2025-02-01", dataUltima:"2025-05-15"},

  {id:"b5",  title:"Standard Jazz ii-V-I in Do maggiore",  composer:"Traditional",        periodo:"Jazz/Blues",  tonality:"Do maggiore", difficulty:"Intermedio",    tipo:"individuale",
   note:"Progressione fondamentale jazz. Lavorare su voicings e improvvisazione.",
   allievi:["Marco Ricci","Davide Russo"], insegnante:"Prof. Verde",
   lezioni:4, dataPrima:"2025-03-10", dataUltima:"2025-05-18"},

  {id:"b6",  title:"Studio op.10 n.1 in Do maggiore",      composer:"Frédéric Chopin",    periodo:"Romantico",  tonality:"Do maggiore",  difficulty:"Professionale", tipo:"individuale",
   note:"Studio per l'estensione della mano destra. Tecnica impegnativa.",
   allievi:["Sofia Marchetti"], insegnante:"Prof. Rossi",
   lezioni:3, dataPrima:"2025-04-05", dataUltima:"2025-05-10"},

  {id:"b7",  title:"Ode alla Gioia (Sinfonia n.9)",         composer:"Ludwig van Beethoven",periodo:"Classico",  tonality:"Re maggiore",  difficulty:"Elementare",    tipo:"collettivo",
   note:"Arrangiamento per orchestra scolastica. Eseguito al saggio di fine anno.",
   allievi:["Sofia Marchetti","Luca Ferrara","Emma Conti","Marco Ricci","Giulia Romano","Alessandro Gallo"], insegnante:"Prof. Rossi",
   lezioni:15, dataPrima:"2025-01-15", dataUltima:"2025-05-22"},

  {id:"b8",  title:"Canon in Re",                           composer:"Johann Pachelbel",   periodo:"Barocco",   tonality:"Re maggiore",  difficulty:"Elementare",    tipo:"collettivo",
   note:"Ensemble d'archi. Buona introduzione al suonare in gruppo.",
   allievi:["Emma Conti","Giulia Romano","Chiara Esposito"], insegnante:"Prof. Bianchi",
   lezioni:6, dataPrima:"2025-02-20", dataUltima:"2025-04-30"},

  {id:"b9",  title:"Greensleeves",                          composer:"Traditional",        periodo:"Folk/Pop",   tonality:"Re minore",    difficulty:"Principiante",  tipo:"collettivo",
   note:"Arrangiamento corale. Ottimo per i principianti.",
   allievi:["Chiara Esposito","Davide Russo"], insegnante:"Prof. Verde",
   lezioni:3, dataPrima:"2025-03-01", dataUltima:"2025-04-10"},

  {id:"b10", title:"Preludio in Do maggiore BWV 846",       composer:"Johann S. Bach",     periodo:"Barocco",   tonality:"Do maggiore",  difficulty:"Elementare",    tipo:"individuale",
   note:"Dal Clavicembalo Ben Temperato. Ottimo esercizio per la fluidità.",
   allievi:["Alessandro Gallo","Davide Russo"], insegnante:"Prof. Rossi",
   lezioni:4, dataPrima:"2026-02-10", dataUltima:"2025-05-01"},
];

// ─── FORM BRANO ──────────────────────────────────────────────────────────────
const BranoForm = ({initial,onSave,onClose})=>{
  const empty={title:"",composer:"",periodo:"",tonality:"",difficulty:"Intermedio",
    tipo:"individuale",note:"",allievi:[],insegnante:""};
  const [f,setF]=useState(initial||empty);
  const [err,setErr]=useState({});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const toggleAllievo=(a)=>{
    const arr=f.allievi||[];
    set("allievi",arr.includes(a)?arr.filter(x=>x!==a):[...arr,a]);
  };

  const validate=()=>{
    const e={};
    if(!f.title.trim())    e.title="Titolo obbligatorio";
    if(!f.composer.trim()) e.composer="Compositore obbligatorio";
    return e;
  };
  const handleSave=()=>{
    const e=validate(); if(Object.keys(e).length){setErr(e);return;}
    onSave(f);
  };

  return(
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:"20px 22px",display:"flex",flexDirection:"column",gap:14,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7378}}
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7379}}
          , React.createElement('div', { style: {gridColumn:"1/-1"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7380}}
            , React.createElement(Field, { label: "Titolo *" , value: f.title, onChange: e=>set("title",e.target.value), error: err.title, placeholder: "Es. Notturno Op.9 n.2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7381}})
          )
          , React.createElement(Field, { label: "Compositore *" , value: f.composer, onChange: e=>set("composer",e.target.value), error: err.composer, placeholder: "Es. Chopin" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7383}})
          , React.createElement(Sel, { label: "Periodo", value: f.periodo, onChange: e=>set("periodo",e.target.value),
            options: PERIODI.map(p=>({value:p.id,label:p.id})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7384}})
          , React.createElement(Sel, { label: "Tonalità / Scala"  , value: f.tonality, onChange: e=>set("tonality",e.target.value), options: TONALITY_OPTS, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7386}})
          , React.createElement(Sel, { label: "Difficoltà", value: f.difficulty, onChange: e=>set("difficulty",e.target.value),
            options: DIFFICULTY.map(d=>({value:d.id,label:d.id})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7387}})
        )

        /* Tipo */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7392}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:9}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7393}}, "Tipo brano" )
          , React.createElement('div', { style: {display:"flex",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7394}}
            , [["individuale","solo","Studio personale"],[" collettivo","group","Ensemble / orchestra"]].map(([val,ic,desc])=>{
              const v=val.trim();
              const isCol=v==="collettivo";
              const hex=isCol?C.purple:C.gold;
              const bg=isCol?C.purpleBg:C.goldBg;
              const bd=isCol?C.purpleBorder:C.goldDim;
              const sel=f.tipo===v;
              return(
                React.createElement('button', { key: v, onClick: ()=>set("tipo",v), style: {flex:1,padding:"10px 14px",borderRadius:10,
                  border:`2px solid ${sel?hex:C.border}`,background:sel?bg:C.bg,
                  cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7403}}
                  , React.createElement(Ic, { n: ic, size: 16, stroke: sel?hex:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7406}})
                  , React.createElement('div', { style: {textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7407}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:sel?hex:C.text,textTransform:"capitalize"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7408}}, v)
                    , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7409}}, desc)
                  )
                )
              );
            })
          )
        )

        /* Insegnante */
        , React.createElement(Sel, { label: "Insegnante responsabile" , value: f.insegnante, onChange: e=>set("insegnante",e.target.value), options: INSEGNANTI, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7418}})

        /* Allievi */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7421}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:9}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7422}}, "Allievi assegnati ("
              , (f.allievi||[]).length, ")"
          )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7425}}
            , ALLIEVI.map(a=>{
              const sel=(f.allievi||[]).includes(a);
              return(
                React.createElement('button', { key: a, onClick: ()=>toggleAllievo(a),
                  style: {display:"flex",alignItems:"center",gap:8,padding:"7px 10px",
                    borderRadius:8,border:`1.5px solid ${sel?C.gold:C.border}`,
                    background:sel?C.goldBg:C.bg,cursor:"pointer",transition:"all .12s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7429}}
                  , React.createElement('div', { style: {width:14,height:14,borderRadius:3,border:`2px solid ${sel?C.gold:C.border}`,
                    background:sel?C.gold:"transparent",flexShrink:0,display:"flex",
                    alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7433}}
                    , sel&&React.createElement(Ic, { n: "check", size: 9, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7436}})
                  )
                  , React.createElement('span', { style: {fontSize:12,color:sel?C.gold:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7438}}, a)
                )
              );
            })
          )
        )

        /* Note */
        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7446}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7447}}, "Note tecniche / annotazioni"   )
          , React.createElement('textarea', { value: f.note, onChange: e=>set("note",e.target.value), rows: 3,
            placeholder: "Indicazioni tecniche, riferimenti, obiettivi didattici..."    ,
            style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"9px 13px",width:"100%",
              fontFamily:"'DM Sans',sans-serif",resize:"vertical"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7448}})
        )
      )

      , React.createElement('div', { style: {padding:"13px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7456}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7457}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSave, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7458}}, React.createElement(Ic, { n: "check", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7458}}), _optionalChain([initial, 'optionalAccess', _69 => _69.id])?"Salva modifiche":"Aggiungi brano")
      )
    )
  );
};

// ─── DRAWER DETTAGLIO BRANO ──────────────────────────────────────────────────
const BranoDrawer = ({brano,onClose,onEdit,onDelete})=>{
  const d=diffById(brano.difficulty);
  const p=periodoById(brano.periodo);
  const isCol=brano.tipo==="collettivo";
  const typeHex=isCol?C.purple:C.gold;
  const typeBg=isCol?C.purpleBg:C.goldBg;
  const typeBd=isCol?C.purpleBorder:C.goldDim;

  return(
    React.createElement(React.Fragment, null
      , React.createElement('div', { onClick: onClose, style: {position:"fixed",inset:0,zIndex:300,
        background:"rgba(0,0,0,.7)",backdropFilter:"blur(3px)",animation:"fadeIn .2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7475}})
      , React.createElement('div', { style: {position:"fixed",top:0,right:0,bottom:0,zIndex:301,width:480,
        background:C.surface,borderLeft:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",animation:"slideDrawer .26s cubic-bezier(.4,0,.2,1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7477}}

        /* Header */
        , React.createElement('div', { style: {padding:"18px 22px",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7482}}
          , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7483}}
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7484}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,lineHeight:1.25,marginBottom:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7485}}
                , brano.title
              )
              , React.createElement('div', { style: {fontSize:13,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7488}}, brano.composer)
            )
            , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
              color:C.textMuted,display:"flex",padding:4,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7490}}
              , React.createElement(Ic, { n: "x", size: 17, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7492}})
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7495}}
            , React.createElement(DiffBadge, { diff: brano.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7496}})
            , React.createElement(TipoBadge, { tipo: brano.tipo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7497}})
            , brano.periodo&&(
              React.createElement('span', { style: {background:p.hex+"18",color:p.hex,border:`1px solid ${p.hex}40`,
                borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:600,letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7499}}, brano.periodo)
            )
            , brano.tonality&&(
              React.createElement('span', { style: {background:C.bg,color:C.textMuted,border:`1px solid ${C.border}`,
                borderRadius:4,padding:"2px 7px",fontSize:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7503}}, brano.tonality)
            )
          )
        )

        /* Body */
        , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"18px 22px",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7510}}

          /* Statistiche */
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7513}}
            , [
              {label:"Lezioni totali",   val:brano.lezioni||0, hex:C.gold},
              {label:"Allievi assegnati",val:(brano.allievi||[]).length, hex:typeHex},
              {label:"Settimane attivo", val:brano.dataPrima?Math.round((new Date()-new Date(brano.dataPrima))/(7*86400000)):0, hex:C.blue},
            ].map(s=>(
              React.createElement('div', { key: s.label, style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7519}}
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7520}}, s.val)
                , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3,lineHeight:1.3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7521}}, s.label)
              )
            ))
          )

          /* Timeline */
          , (brano.dataPrima||brano.dataUltima)&&(
            React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7528}}
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7529}}, "Timeline studio" )
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7530}}
                , brano.dataPrima&&(
                  React.createElement('div', { style: {display:"flex",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7532}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7533}}, "Prima lezione" )
                    , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7534}}, new Date(brano.dataPrima+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"}))
                  )
                )
                , brano.dataUltima&&(
                  React.createElement('div', { style: {display:"flex",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7538}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7539}}, "Ultima lezione" )
                    , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7540}}, new Date(brano.dataUltima+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"long",year:"numeric"}))
                  )
                )
                , brano.insegnante&&(
                  React.createElement('div', { style: {display:"flex",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7544}}
                    , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7545}}, "Insegnante")
                    , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7546}}, brano.insegnante)
                  )
                )
              )
            )
          )

          /* Allievi */
          , (brano.allievi||[]).length>0&&(
            React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7555}}
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7556}}, "Allievi "
                 , brano.tipo==="collettivo"?"nell'ensemble":"che studiano questo brano", " (" , brano.allievi.length, ")"
              )
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7559}}
                , brano.allievi.map(a=>(
                  React.createElement('div', { key: a, style: {display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                    background:C.bg,border:`1px solid ${C.border}`,borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7561}}
                    , React.createElement('div', { style: {width:30,height:30,borderRadius:"50%",background:`${typeHex}18`,
                      border:`1.5px solid ${typeHex}40`,display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0,
                      fontFamily:"'Cormorant Garamond',serif",fontSize:13,fontWeight:600,color:typeHex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7563}}
                      , a.split(" ").map(p=>p[0]).join("").slice(0,2)
                    )
                    , React.createElement('span', { style: {fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7569}}, a)
                  )
                ))
              )
            )
          )

          /* Note */
          , brano.note&&(
            React.createElement('div', { style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7578}}
              , React.createElement('div', { style: {fontSize:10,color:C.gold,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7579}}, "Note tecniche" )
              , React.createElement('div', { style: {fontSize:13,color:C.text,lineHeight:1.65}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7580}}, brano.note)
            )
          )
        )

        /* Footer */
        , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,
          position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-between",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7586}}
          , React.createElement(Btn, { danger: true, onClick: ()=>onDelete(brano), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7588}}
            , React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7589}}), "Elimina"
          )
          , React.createElement(Btn, { variant: "secondary", onClick: ()=>onEdit(brano), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7591}}
            , React.createElement(Ic, { n: "edit", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7592}}), "Modifica"
          )
        )
      )
    )
  );
};

// ─── VISTA ALLIEVO ───────────────────────────────────────────────────────────
const AllievoBraniView = ({allievo,brani,onBack})=>{
  const isMobile = useIsMobile();
  const suoiBrani=brani.filter(b=>(b.allievi||[]).includes(allievo));
  const individuali=suoiBrani.filter(b=>b.tipo==="individuale");
  const collettivi=suoiBrani.filter(b=>b.tipo==="collettivo");

  return(
    React.createElement('div', { style: {flex:1,padding:isMobile?"12px":"20px 24px",overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7608}}
      , React.createElement('button', { onClick: onBack, style: {display:"flex",alignItems:"center",gap:6,background:"none",
        border:"none",cursor:"pointer",color:C.textMuted,fontSize:13,fontFamily:"'DM Sans',sans-serif",
        marginBottom:20,padding:"4px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7609}}
        , React.createElement('svg', { width: 16, height: 16, viewBox: "0 0 24 24"   , fill: "none", stroke: C.textMuted, strokeWidth: "1.8", strokeLinecap: "round", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7612}}, React.createElement('path', { d: "m15 18-6-6 6-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7612}})), "Tutti gli allievi"

      )

      , React.createElement('div', { style: {display:"flex",alignItems:"flex-start",gap:16,marginBottom:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7616}}
        , React.createElement('div', { style: {width:56,height:56,borderRadius:"50%",background:`${C.gold}18`,
          border:`2px solid ${C.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7617}}
          , allievo.split(" ").map(p=>p[0]).join("").slice(0,2)
        )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7622}}
          , React.createElement('h2', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7623}}, allievo)
          , React.createElement('div', { style: {fontSize:13,color:C.textMuted,marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7624}}
            , suoiBrani.length, " brani · "   , individuali.length, " individuali · "   , collettivi.length, " collettivi"
          )
        )
      )

      , suoiBrani.length===0&&(
        React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7631}}
          , React.createElement(Ic, { n: "music", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7632}})
          , React.createElement('p', { style: {marginTop:12,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7633}}, "Nessun brano assegnato a questo allievo"     )
        )
      )

      , individuali.length>0&&(
        React.createElement('div', { style: {marginBottom:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7638}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7639}}
            , React.createElement(Ic, { n: "solo", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7640}}), " Studio personale ("   , individuali.length, ")"
          )
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7642}}
            , individuali.map(b=>{
              const d=diffById(b.difficulty);
              const p=periodoById(b.periodo);
              return(
                React.createElement('div', { key: b.id, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,
                  padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7647}}
                  , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7649}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:600,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7650}}, b.title)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7651}}, b.composer, b.tonality?` · ${b.tonality}`:"")
                  )
                  , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7653}}
                    , React.createElement(DiffBadge, { diff: b.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7654}})
                    , b.periodo&&React.createElement('span', { style: {background:p.hex+"18",color:p.hex,border:`1px solid ${p.hex}30`,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7655}}, b.periodo)
                    , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7656}}, b.lezioni, " lez." )
                  )
                )
              );
            })
          )
        )
      )

      , collettivi.length>0&&(
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7666}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7667}}
            , React.createElement(Ic, { n: "group", size: 13, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7668}}), " Ensemble / orchestra ("    , collettivi.length, ")"
          )
          , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7670}}
            , collettivi.map(b=>{
              const d=diffById(b.difficulty);
              return(
                React.createElement('div', { key: b.id, style: {background:C.surface,border:`1px solid ${C.purpleBorder}30`,borderRadius:10,
                  padding:"14px 18px",display:"flex",gap:14,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7674}}
                  , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7676}}
                    , React.createElement('div', { style: {fontSize:14,fontWeight:600,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7677}}, b.title)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7678}}, b.composer)
                    , (b.allievi||[]).length>1&&(
                      React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7680}}, "Con: "
                         , b.allievi.filter(a=>a!==allievo).slice(0,3).join(", "), b.allievi.length>4?` +${b.allievi.length-4} altri`:""
                      )
                    )
                  )
                  , React.createElement(DiffBadge, { diff: b.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7685}})
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
// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════

const RepertorioView = () => {
  const isMobile = useIsMobile();
  const [brani,     setBrani]    = useState(INIT_BRANI);
    const [tab,       setTab]      = useState("catalogo"); // catalogo | allievi
    const [layout,    setLayout]   = useState("grid");     // grid | list
    const [search,    setSearch]   = useState("");
    const [fDiff,     setFDiff]    = useState("");
    const [fTipo,     setFTipo]    = useState("");
    const [fPeriodo,  setFPeriodo] = useState("");
    const [drawer,    setDrawer]   = useState(null);
    const [modal,     setModal]    = useState(null); // "add"|"edit"|"confirm_delete"
    const [selBrano,  setSelBrano] = useState(null);
    const [allievoPOV,setAllievoPOV]=useState(null);
    const [toast,     setToast]    = useState(null);
  
    const showToast=(msg,hex=C.green)=>{setToast({msg,hex});setTimeout(()=>setToast(null),3000);};
    const closeModal=()=>{setModal(null);setSelBrano(null);};
  
    // ── CRUD ──
    const aggiungiBrano=(f)=>{setBrani(p=>[...p,{...f,id:uid(),lezioni:0}]);closeModal();showToast("Brano aggiunto");};
    const modificaBrano=(f)=>{setBrani(p=>p.map(b=>b.id===selBrano.id?{...b,...f}:b));closeModal();setDrawer(null);showToast("Brano aggiornato");};
    const eliminaBrano=()=>{
      setBrani(p=>p.filter(b=>b.id!==selBrano.id));
      setDrawer(null); closeModal();
      showToast("Brano eliminato",C.red);
    };
  
    // ── FILTRI ──
    const filtrati = useMemo(()=>brani.filter(b=>{
      const q=search.toLowerCase();
      return(!q||b.title.toLowerCase().includes(q)||b.composer.toLowerCase().includes(q)||_optionalChain([b, 'access', _70 => _70.tonality, 'optionalAccess', _71 => _71.toLowerCase, 'call', _72 => _72(), 'access', _73 => _73.includes, 'call', _74 => _74(q)]))
        &&(!fDiff||b.difficulty===fDiff)
        &&(!fTipo||b.tipo===fTipo)
        &&(!fPeriodo||b.periodo===fPeriodo);
    }),[brani,search,fDiff,fTipo,fPeriodo]);
  
    const individuali=filtrati.filter(b=>b.tipo==="individuale");
    const collettivi= filtrati.filter(b=>b.tipo==="collettivo");
  
    // ── STATS ──
    const totLezioni=brani.reduce((s,b)=>s+(b.lezioni||0),0);
    const braniAvanzati=brani.filter(b=>b.difficulty==="Avanzato"||b.difficulty==="Professionale").length;
  
    return(
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7746}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7747}}

          /* ── BARRA MODULO ── */
          , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"0 clamp(12px,3vw,24px)",display:"flex",alignItems:"center",
            height:52,flexShrink:0,gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7750}}
            , React.createElement(Ic, { n: "book", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7753}})
            , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:C.gold,letterSpacing:"0.04em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7754}}, "Repertorio")
            , React.createElement('div', { style: {marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7755}}
              , React.createElement(Btn, { onClick: ()=>setModal("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7756}}
                , React.createElement(Ic, { n: "plus", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7757}}), "Nuovo brano"
              )
            )
          )

          /* ── Se allievoPOV attivo, mostra vista allievo ── */
          , allievoPOV ? (
            React.createElement(AllievoBraniView, {
              allievo: allievoPOV,
              brani: brani,
              onBack: ()=>setAllievoPOV(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 7764}}
            )
          ) : (
            React.createElement(React.Fragment, null
              /* ── PAGE HEADER ── */
              , React.createElement('div', { style: {background:`linear-gradient(135deg,${C.surface} 0%,${C.bg} 100%)`,
                borderBottom:`1px solid ${C.border}`,padding:"16px 20px",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7772}}
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7774}}
                  , React.createElement('div', { style: {animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7775}}
                    , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7776}}
                      , React.createElement('span', { style: {fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7777}}, "Repertorio"), " musicale"
                    )
                    , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7779}}, "Catalogo brani, assegnazioni allievi e storico lezioni"

                    )
                  )
                  , React.createElement('div', { style: {display:"flex",gap:12,animation:"fadeUp .4s ease .1s both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7783}}
                    , [
                      {label:"Brani totali",  val:brani.length,                                    hex:C.gold},
                      {label:"Individuali",   val:brani.filter(b=>b.tipo==="individuale").length,   hex:C.gold},
                      {label:"Collettivi",    val:brani.filter(b=>b.tipo==="collettivo").length,    hex:C.purple},
                      {label:"Lezioni totali",val:totLezioni,                                       hex:C.blue},
                    ].map(k=>(
                      React.createElement('div', { key: k.label, style: {padding:"10px 16px",background:C.surface,
                        border:`1px solid ${C.border}`,borderRadius:10,textAlign:"center",minWidth:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7790}}
                        , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:k.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7792}}, k.val)
                        , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7793}}, k.label)
                      )
                    ))
                  )
                )
              )

              /* ── BODY ── */
              , React.createElement('div', { style: {flex:1,padding:isMobile?"12px":"20px 24px",overflow:"auto",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7801}}

                /* Tabs + layout */
                , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7804}}
                  , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7805}}
                    , [["catalogo","book","Catalogo brani"],["allievi","users","Per allievo"]].map(([v,ic,lb])=>(
                      React.createElement('button', { key: v, onClick: ()=>setTab(v),
                        style: {display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,
                          background:tab===v?C.goldBg:"none",border:`1px solid ${tab===v?C.goldDim:C.border}`,
                          cursor:"pointer",fontSize:13,color:tab===v?C.gold:C.textMuted,
                          fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7807}}
                        , React.createElement(Ic, { n: ic, size: 14, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7812}}), lb
                      )
                    ))
                  )
                  , tab==="catalogo"&&(
                    React.createElement('div', { style: {display:"flex",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7817}}
                      , [["grid","grid2"],["list","list"]].map(([v,ic])=>(
                        React.createElement('button', { key: v, onClick: ()=>setLayout(v),
                          style: {padding:"7px 12px",display:"flex",alignItems:"center",gap:5,
                            background:layout===v?C.goldBg:"transparent",border:"none",cursor:"pointer",
                            color:layout===v?C.gold:C.textMuted,borderRight:`1px solid ${C.border}`,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7819}}
                          , React.createElement(Ic, { n: ic, size: 14, stroke: layout===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7823}})
                        )
                      ))
                    )
                  )
                )

                /* ── TAB CATALOGO ── */
                , tab==="catalogo"&&(
                  React.createElement(React.Fragment, null
                    /* Filtri */
                    , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7834}}
                      , React.createElement('div', { style: {position:"relative",flex:"1 1 220px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7835}}
                        , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7836}}
                          , React.createElement(Ic, { n: "search", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7837}})
                        )
                        , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
                          placeholder: "Cerca titolo, compositore, tonalità..."   ,
                          style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                            color:C.text,fontSize:13,padding:"9px 12px 9px 34px",fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7839}})
                      )
                      , [
                        {val:fTipo,set:setFTipo,opts:["individuale","collettivo"],ph:"Tipo"},
                        {val:fDiff,set:setFDiff,opts:DIFFICULTY.map(d=>d.id),ph:"Difficoltà"},
                        {val:fPeriodo,set:setFPeriodo,opts:PERIODI.map(p=>p.id),ph:"Periodo"},
                      ].map((f,i)=>(
                        React.createElement('select', { key: i, value: f.val, onChange: e=>f.set(e.target.value),
                          style: {background:C.surface,border:`1px solid ${f.val?C.goldDim:C.border}`,
                            borderRadius:8,color:f.val?C.gold:C.textMuted,fontSize:13,
                            padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7849}}
                          , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7853}}, f.ph)
                          , f.opts.map(o=>React.createElement('option', { key: o, value: o, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7854}}, o))
                        )
                      ))
                      , (search||fDiff||fTipo||fPeriodo)&&(
                        React.createElement(Btn, { small: true, variant: "ghost", onClick: ()=>{setSearch("");setFDiff("");setFTipo("");setFPeriodo("");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7858}}
                          , React.createElement(Ic, { n: "x", size: 12, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7859}}), "Azzera"
                        )
                      )
                      , React.createElement('span', { style: {fontSize:12,color:C.textDim,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7862}}, filtrati.length, " brani" )
                    )

                    /* ── GRID ── */
                    , layout==="grid"&&(
                      React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:24}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7867}}
                        /* Sezione individuale */
                        , individuali.length>0&&(
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7870}}
                            , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",
                              marginBottom:12,display:"flex",alignItems:"center",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7871}}
                              , React.createElement(Ic, { n: "solo", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7873}}), "Brani individuali "
                                , React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7874}}, "(", individuali.length, ")")
                            )
                            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7876}}
                              , individuali.map((b,i)=>{
                                const d=diffById(b.difficulty);
                                const p=periodoById(b.periodo);
                                return(
                                  React.createElement('div', { key: b.id, className: "card-anim", onClick: ()=>setDrawer(b),
                                    style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                                      padding:"15px 17px",cursor:"pointer",transition:"all .15s"},
                                    onMouseEnter: e=>{e.currentTarget.style.borderColor=C.gold+"50";e.currentTarget.style.background=C.surfaceHover;},
                                    onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7881}}
                                    , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7886}}
                                      , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7887}}
                                        , React.createElement('div', { style: {fontSize:14,fontWeight:600,lineHeight:1.3,marginBottom:3,
                                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7888}}, b.title)
                                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7890}}, b.composer)
                                      )
                                      , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7892}})
                                    )
                                    , React.createElement('div', { style: {display:"flex",gap:5,flexWrap:"wrap",alignItems:"center",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7894}}
                                      , b.tonality&&React.createElement('span', { style: {fontSize:10,padding:"2px 6px",borderRadius:4,border:`1px solid ${C.border}`,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7895}}, b.tonality)
                                      , b.periodo&&React.createElement('span', { style: {fontSize:10,padding:"2px 6px",borderRadius:4,background:p.hex+"18",color:p.hex,border:`1px solid ${p.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7896}}, b.periodo)
                                      , React.createElement(DiffBadge, { diff: b.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7897}})
                                    )
                                    , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",
                                      paddingTop:8,borderTop:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7899}}
                                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7901}}
                                        , React.createElement(Ic, { n: "users", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7902}})
                                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7903}}, (b.allievi||[]).length, " alliev" , (b.allievi||[]).length===1?"o":"i")
                                      )
                                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7905}}
                                        , React.createElement(Ic, { n: "calendar", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7906}})
                                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7907}}, b.lezioni||0, " lezioni" )
                                      )
                                    )
                                  )
                                );
                              })
                            )
                          )
                        )

                        /* Sezione collettivi */
                        , collettivi.length>0&&(
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7919}}
                            , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",
                              marginBottom:12,display:"flex",alignItems:"center",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7920}}
                              , React.createElement(Ic, { n: "group", size: 13, stroke: C.purple, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7922}}), "Brani collettivi "
                                , React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7923}}, "(", collettivi.length, ")")
                            )
                            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7925}}
                              , collettivi.map((b,i)=>{
                                const d=diffById(b.difficulty);
                                const p=periodoById(b.periodo);
                                return(
                                  React.createElement('div', { key: b.id, className: "card-anim", onClick: ()=>setDrawer(b),
                                    style: {background:C.surface,border:`1px solid ${C.purpleBorder}30`,borderRadius:12,
                                      padding:"15px 17px",cursor:"pointer",transition:"all .15s"},
                                    onMouseEnter: e=>{e.currentTarget.style.borderColor=C.purple+"50";e.currentTarget.style.background=C.surfaceHover;},
                                    onMouseLeave: e=>{e.currentTarget.style.borderColor=C.purpleBorder+"30";e.currentTarget.style.background=C.surface;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7930}}
                                    , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7935}}
                                      , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7936}}
                                        , React.createElement('div', { style: {fontSize:14,fontWeight:600,lineHeight:1.3,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7937}}, b.title)
                                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7938}}, b.composer)
                                      )
                                      , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7940}})
                                    )
                                    , React.createElement('div', { style: {display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7942}}
                                      , b.periodo&&React.createElement('span', { style: {fontSize:10,padding:"2px 6px",borderRadius:4,background:p.hex+"18",color:p.hex,border:`1px solid ${p.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7943}}, b.periodo)
                                      , React.createElement(DiffBadge, { diff: b.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7944}})
                                      , React.createElement(TipoBadge, { tipo: b.tipo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7945}})
                                    )
                                    , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",
                                      paddingTop:8,borderTop:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7947}}
                                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7949}}
                                        , React.createElement(Ic, { n: "users", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7950}})
                                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7951}}, (b.allievi||[]).length, " partecipanti" )
                                      )
                                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7953}}
                                        , React.createElement(Ic, { n: "calendar", size: 12, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7954}})
                                        , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7955}}, b.lezioni||0, " lezioni" )
                                      )
                                    )
                                  )
                                );
                              })
                            )
                          )
                        )

                        , filtrati.length===0&&(
                          React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7966}}
                            , React.createElement(Ic, { n: "music", size: 32, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7967}})
                            , React.createElement('p', { style: {marginTop:12,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7968}}, "Nessun brano trovato"  )
                          )
                        )
                      )
                    )

                    /* ── LIST ── */
                    , layout==="list"&&(
                      React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7976}}
                        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2.5fr 1.2fr 1.2fr 1fr 0.8fr 0.8fr auto",minWidth:560,
                          padding:"8px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7977}}
                          , ["Brano","Tipo","Difficoltà","Periodo","Allievi","Lezioni",""].map(h=>(
                            React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7980}}, h)
                          ))
                        )
                        , filtrati.map((b,i)=>{
                          const p=periodoById(b.periodo);
                          return(
                            React.createElement('div', { key: b.id, onClick: ()=>setDrawer(b),
                              style: {display:"grid",gridTemplateColumns:"2.5fr 1.2fr 1.2fr 1fr 0.8fr 0.8fr auto",minWidth:560,
                                padding:"12px 20px",borderBottom:i<filtrati.length-1?`1px solid ${C.border}20`:"none",
                                alignItems:"center",cursor:"pointer",transition:"background .1s"},
                              onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                              onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 7986}}
                              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7992}}
                                , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7993}}, b.title)
                                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7994}}, b.composer)
                              )
                              , React.createElement(TipoBadge, { tipo: b.tipo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7996}})
                              , React.createElement(DiffBadge, { diff: b.difficulty, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7997}})
                              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 7998}}
                                , b.periodo&&React.createElement('span', { style: {fontSize:11,color:p.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7999}}, b.periodo)
                              )
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8001}}, (b.allievi||[]).length)
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8002}}, b.lezioni||0)
                              , React.createElement(Ic, { n: "right", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8003}})
                            )
                          );
                        })
                      )
                    )
                  )
                )

                /* ── TAB ALLIEVI ── */
                , tab==="allievi"&&(
                  React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8014}}
                    , ALLIEVI.map((a,i)=>{
                      const suoiBrani=brani.filter(b=>(b.allievi||[]).includes(a));
                      const totLez=suoiBrani.reduce((s,b)=>s+(b.lezioni||0),0);
                      const ind=suoiBrani.filter(b=>b.tipo==="individuale").length;
                      const col=suoiBrani.filter(b=>b.tipo==="collettivo").length;
                      return(
                        React.createElement('div', { key: a, className: "card-anim", onClick: ()=>setAllievoPOV(a),
                          style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                            padding:"18px 18px",cursor:"pointer",transition:"all .15s"},
                          onMouseEnter: e=>{e.currentTarget.style.borderColor=C.gold+"50";e.currentTarget.style.background=C.surfaceHover;},
                          onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8021}}
                          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12,marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8026}}
                            , React.createElement('div', { style: {width:44,height:44,borderRadius:"50%",background:`${C.gold}18`,
                              border:`2px solid ${C.goldDim}`,display:"flex",alignItems:"center",justifyContent:"center",
                              fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8027}}
                              , a.split(" ").map(p=>p[0]).join("").slice(0,2)
                            )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8032}}
                              , React.createElement('div', { style: {fontSize:13,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8033}}, a)
                              , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8034}}, suoiBrani.length, " brani" )
                            )
                          )
                          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,
                            borderTop:`1px solid ${C.border}`,paddingTop:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8037}}
                            , [{val:ind,label:"Ind.",hex:C.gold},{val:col,label:"Col.",hex:C.purple},{val:totLez,label:"Lez.",hex:C.blue}].map(s=>(
                              React.createElement('div', { key: s.label, style: {textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8040}}
                                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:s.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8041}}, s.val)
                                , React.createElement('div', { style: {fontSize:9,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8042}}, s.label)
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

        /* ── DRAWER ── */
        , drawer&&(
          React.createElement(BranoDrawer, {
            brano: drawer,
            onClose: ()=>setDrawer(null),
            onEdit: (b)=>{setSelBrano(b);setDrawer(null);setModal("edit");},
            onDelete: (b)=>{setSelBrano(b);setModal("confirm_delete");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8058}}
          )
        )

        /* ── MODALI ── */
        , modal==="add"&&(
          React.createElement(Modal, { title: "Nuovo brano" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8068}}
            , React.createElement(BranoForm, { onSave: aggiungiBrano, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8069}})
          )
        )
        , modal==="edit"&&selBrano&&(
          React.createElement(Modal, { title: "Modifica brano" , onClose: closeModal, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8073}}
            , React.createElement(BranoForm, { initial: selBrano, onSave: modificaBrano, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8074}})
          )
        )
        , modal==="confirm_delete"&&selBrano&&(
          React.createElement(ConfirmDel, {
            title: "Elimina brano" ,
            testo: `Eliminare "${selBrano.title}" dal catalogo? L'operazione è irreversibile.`,
            onConfirm: eliminaBrano,
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8078}}
          )
        )

        /* ── TOAST ── */
        , toast&&(
          React.createElement('div', { style: {position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:400,
            background:C.surface,border:`1px solid ${toast.hex}40`,borderLeft:`3px solid ${toast.hex}`,
            borderRadius:10,padding:"11px 18px",display:"flex",alignItems:"center",gap:10,
            animation:"fadeUp .25s ease",boxShadow:"0 8px 32px rgba(0,0,0,.5)",
            fontFamily:"'DM Sans',sans-serif",fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8088}}
            , React.createElement(Ic, { n: "check", size: 14, stroke: toast.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8093}})
            , React.createElement('span', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8094}}, toast.msg)
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
const PrenotazioneForm = ({ evento, initial, onSave, onClose }) => {
  const def = initial || {id:"",nome:"",email:"",telefono:"",posti:1,stato:"confermata",dataPren:new Date().toISOString().split("T")[0],pagato:false};
  const [f,setF] = useState(def);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const postiGia = evento.prenotazioni
    .filter(p=>p.stato==="confermata"&&p.id!==(_optionalChain([initial, 'optionalAccess', _75 => _75.id])||""))
    .reduce((t,p)=>t+p.posti,0);
  const postiLib = Math.max(0, evento.capienza - postiGia);
  const importo  = f.posti*(evento.prezzoBiglietto||0);
  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {padding:"20px 24px",display:"flex",flexDirection:"column",gap:14,overflow:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8204}}
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8205}}
          , React.createElement(Input, { label: "Nome *" , value: f.nome, onChange: e=>set("nome",e.target.value), placeholder: "Nome e cognome"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8206}})
          , React.createElement(Input, { label: "Email", type: "email", value: f.email, onChange: e=>set("email",e.target.value), placeholder: "email@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8207}})
          , React.createElement(Input, { label: "Telefono", value: f.telefono, onChange: e=>set("telefono",e.target.value), placeholder: "333 0000000" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8208}})
          , React.createElement(Input, { label: `Posti (max ${postiLib})`, type: "number", value: f.posti,
            onChange: e=>set("posti",Math.min(postiLib,Math.max(1,+e.target.value))), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8209}})
          , React.createElement(Sel, { label: "Stato", value: f.stato, onChange: e=>set("stato",e.target.value), options: ["confermata","in attesa","annullata"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 8211}})
          , React.createElement(Sel, { label: "Pagamento", value: f.pagato?"pagato":"da pagare", onChange: e=>set("pagato",e.target.value==="pagato"), options: ["pagato","da pagare"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 8212}})
        )
        , evento.biglietto && (
          React.createElement('div', { style: {background:C.goldBg,border:`1px solid ${C.goldDim}`,borderRadius:8,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8215}}
            , React.createElement('span', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8216}}, "Importo da riscuotere"  )
            , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8217}}, "€ " , importo.toFixed(2))
          )
        )
      )
      , React.createElement('div', { style: {padding:"14px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8221}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8222}}, "Annulla")
        , React.createElement(Btn, { onClick: ()=>{if(!f.nome.trim())return alert("Nome obbligatorio");onSave({...f,id:f.id||uid()});}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8223}}
          , React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8224}}), _optionalChain([initial, 'optionalAccess', _76 => _76.id])?"Salva":"Aggiungi"
        )
      )
    )
  );
};

// ─── FORM EVENTO ──────────────────────────────────────────────────────────────
const EventoForm = ({ initial, students, onSave, onClose }) => {
  const def = initial || {id:"",tipo:"saggio",titolo:"",data:"",ora:"",luogo:"",capienza:100,
    biglietto:false,prezzoBiglietto:0,stato:"programmato",descrizione:"",note:"",partecipanti:[],prenotazioni:[]};
  const [f,setF]       = useState(def);
  const [branoInp, setBranoInp] = useState({});
  const [repOpen, setRepOpen]   = useState({});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const tp  = tipoEv(f.tipo);
  const isMandatory = f.tipo === "saggio";
  const hasBrani = f.tipo === "saggio" || f.tipo === "concerto";

  const addPart = sid => {
    if(f.partecipanti.find(p=>p.studentId===sid)) return;
    const st = students.find(s=>s.id===sid);
    if(!st) return;
    set("partecipanti",[...f.partecipanti,{studentId:sid,studentName:st.name,brani:[]}]);
  };
  const remPart  = sid => set("partecipanti",f.partecipanti.filter(p=>p.studentId!==sid));
  const addBrano = (sid,b) => { if(!b.trim())return; set("partecipanti",f.partecipanti.map(p=>p.studentId===sid?{...p,brani:[...p.brani,b.trim()]}:p)); };
  const remBrano = (sid,i) => set("partecipanti",f.partecipanti.map(p=>p.studentId===sid?{...p,brani:p.brani.filter((_,j)=>j!==i)}:p));
  const toggleRepBrano = (sid, titolo) => {
    set("partecipanti", f.partecipanti.map(p => {
      if(p.studentId !== sid) return p;
      const has = p.brani.includes(titolo);
      return {...p, brani: has ? p.brani.filter(b=>b!==titolo) : [...p.brani, titolo]};
    }));
  };
  const addTutti = () => {
    const nuovi = students.filter(s=>!f.partecipanti.find(p=>p.studentId===s.id));
    set("partecipanti",[...f.partecipanti,...nuovi.map(s=>({studentId:s.id,studentName:s.name,brani:[]}))]);
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:18}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8266}}

        /* Tipo */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8269}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8270}}, "Tipo evento" )
          , React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8271}}
            , TIPI_EVENTO.map(t=>(
              React.createElement('button', { key: t.id, onClick: ()=>set("tipo",t.id),
                style: {padding:"7px 14px",borderRadius:20,border:"2px solid "+(f.tipo===t.id?t.hex:C.border),
                  background:f.tipo===t.id?(t.hex+"15"):"transparent",color:f.tipo===t.id?t.hex:C.textMuted,
                  cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",
                  display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8273}}
                , React.createElement(Ic, { n: t.icon, size: 12, stroke: f.tipo===t.id?t.hex:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8278}}), t.label
              )
            ))
          )
          , React.createElement('p', { style: {fontSize:11,color:C.textDim,marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8282}}, tp.desc)
        )

        /* Campi base */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8286}}
          , React.createElement(Input, { label: "Titolo *" , value: f.titolo, onChange: e=>set("titolo",e.target.value), placeholder: "Es. Saggio di Fine Anno"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8287}})
          , React.createElement(Sel, { label: "Stato", value: f.stato, onChange: e=>set("stato",e.target.value), options: STATI_EVENTO, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8288}})
          , React.createElement(Input, { label: "Data *" , type: "date", value: f.data, onChange: e=>set("data",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8289}})
          , React.createElement(Input, { label: "Ora", type: "time", value: f.ora, onChange: e=>set("ora",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8290}})
          , React.createElement(Input, { label: "Luogo", value: f.luogo, onChange: e=>set("luogo",e.target.value), placeholder: "Es. Aula Magna"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8291}})
          , React.createElement(Input, { label: "Capienza max" , type: "number", value: f.capienza, onChange: e=>set("capienza",+e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8292}})
        )
        , React.createElement(Textarea, { label: "Descrizione", value: f.descrizione, onChange: e=>set("descrizione",e.target.value), placeholder: "Descrizione pubblica dell'evento..."  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8294}})

        /* Biglietto */
        , React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:10,padding:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8297}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12,marginBottom:f.biglietto?12:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8298}}
            , React.createElement(Toggle, { checked: f.biglietto, onChange: v=>set("biglietto",v), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8299}})
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8300}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8301}}, "Evento a biglietto"  )
              , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8302}}, "Abilita la gestione prenotazioni e biglietteria"     )
            )
          )
          , f.biglietto && (
            React.createElement('div', { style: {paddingLeft:50}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8306}}
              , React.createElement(Input, { label: "Prezzo biglietto (euro)"  , type: "number", value: f.prezzoBiglietto, onChange: e=>set("prezzoBiglietto",+e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8307}})
            )
          )
        )

        /* Partecipanti */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8313}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8314}}
            , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8315}}
              , isMandatory ? "Partecipanti — obbligatori" : f.tipo==="concerto" ? "Partecipanti allievi" : "Partecipanti (facoltativi)"
            )
            , React.createElement('div', { style: {display:"flex",gap:6,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8318}}
              , isMandatory && f.partecipanti.length < students.length && (
                React.createElement('button', { onClick: addTutti,
                  style: {padding:"4px 10px",borderRadius:10,border:"1px solid "+C.gold,background:C.goldBg,
                    color:C.gold,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif",
                    display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8320}}
                  , React.createElement(Ic, { n: "plus", size: 9, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8324}}), " Aggiungi tutti"
                )
              )
              , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8327}}, f.partecipanti.length, "/", students.length)
            )
          )

          , students.filter(s=>!f.partecipanti.find(p=>p.studentId===s.id)).length > 0 && (
            React.createElement('div', { style: {display:"flex",flexWrap:"wrap",gap:6,marginBottom:10,
              padding:"10px 12px",background:C.bg,borderRadius:8,border:"1px dashed "+C.border}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8332}}
              , React.createElement('span', { style: {fontSize:10,color:C.textDim,width:"100%",marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8334}}
                , isMandatory ? "Aggiungi un allievo:" : "Aggiungi partecipanti (facoltativi):"
              )
              , students.filter(s=>!f.partecipanti.find(p=>p.studentId===s.id)).map(s=>(
                React.createElement('button', { key: s.id, onClick: ()=>addPart(s.id),
                  style: {padding:"4px 10px",borderRadius:14,border:"1px solid "+C.border,
                    background:"transparent",color:C.textMuted,cursor:"pointer",fontSize:11,
                    fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5,transition:"all 0.15s"},
                  onMouseEnter: e=>{e.currentTarget.style.borderColor=tp.hex;e.currentTarget.style.color=tp.hex;},
                  onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8338}}
                  , React.createElement(Ic, { n: "plus", size: 10, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8344}}), s.name
                )
              ))
            )
          )

          , f.partecipanti.map(p=>{
            const st = students.find(s=>s.id===p.studentId);
            const rep = (st ? (st.repertorio||[]) : []);
            const repComp   = rep.filter(r=>r.stato==="completato");
            const repStudio = rep.filter(r=>r.stato==="in studio");
            const showRep   = repOpen[p.studentId];
            return (
              React.createElement('div', { key: p.studentId, style: {background:C.bg,border:"1px solid "+C.border,borderRadius:8,padding:"12px 14px",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8357}}
                , React.createElement('div', { style: {display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:hasBrani?8:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8358}}
                  , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8359}}
                    , React.createElement('div', { style: {width:28,height:28,borderRadius:"50%",background:tp.hex+"20",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:tp.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8360}}
                      , initials(p.studentName)
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8364}}
                      , React.createElement('span', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8365}}, p.studentName)
                      , st && React.createElement('span', { style: {fontSize:10,color:C.textDim,marginLeft:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8366}}, st.instrument)
                    )
                  )
                  , React.createElement('div', { style: {display:"flex",gap:6,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8369}}
                    , hasBrani && rep.length > 0 && (
                      React.createElement('button', { onClick: ()=>setRepOpen(r=>({...r,[p.studentId]:!r[p.studentId]})),
                        style: {padding:"3px 8px",borderRadius:8,border:"1px solid "+C.border,background:"transparent",
                          color:C.textMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif",
                          display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8371}}
                        , React.createElement(Ic, { n: "music", size: 9, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8375}}), showRep?"Chiudi":"Scegli dal repertorio"
                      )
                    )
                    , React.createElement('button', { onClick: ()=>remPart(p.studentId), style: {background:"none",border:"none",cursor:"pointer",
                      display:"flex",padding:4,color:C.textDim},
                      onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8378}}
                      , React.createElement(Ic, { n: "x", size: 12, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8381}})
                    )
                  )
                )

                , hasBrani && (
                  React.createElement('div', { style: {paddingLeft:36}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8387}}
                    , showRep && rep.length > 0 && (
                      React.createElement('div', { style: {background:C.surface,border:"1px solid "+C.border,borderRadius:8,padding:"10px 12px",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8389}}
                        , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8390}}, "Repertorio — "
                            , p.studentName
                        )
                        , repComp.length > 0 && (
                          React.createElement('div', { style: {marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8394}}
                            , React.createElement('div', { style: {fontSize:9,color:C.green,fontWeight:600,letterSpacing:"0.06em",marginBottom:4,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8395}}, "Completati"

                            )
                            , repComp.map(r=>{
                              const sel = p.brani.includes(r.titolo);
                              return (
                                React.createElement('label', { key: r.id, style: {display:"flex",alignItems:"center",gap:8,cursor:"pointer",
                                  padding:"5px 6px",borderRadius:6,marginBottom:2,
                                  background:sel?(C.green+"15"):"transparent",transition:"background 0.1s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8401}}
                                  , React.createElement('input', { type: "checkbox", checked: sel,
                                    onChange: ()=>toggleRepBrano(p.studentId,r.titolo),
                                    style: {accentColor:C.green,width:14,height:14,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8404}})
                                  , React.createElement('span', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8407}}
                                    , React.createElement('span', { style: {fontSize:12,fontWeight:sel?600:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8408}}, r.titolo)
                                    , React.createElement('span', { style: {fontSize:10,color:C.textDim,marginLeft:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8409}}, r.compositore)
                                  )
                                )
                              );
                            })
                          )
                        )
                        , repStudio.length > 0 && (
                          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8417}}
                            , React.createElement('div', { style: {fontSize:9,color:C.gold,fontWeight:600,letterSpacing:"0.06em",marginBottom:4,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8418}}, "In studio"

                            )
                            , repStudio.map(r=>{
                              const sel = p.brani.includes(r.titolo);
                              return (
                                React.createElement('label', { key: r.id, style: {display:"flex",alignItems:"center",gap:8,cursor:"pointer",
                                  padding:"5px 6px",borderRadius:6,marginBottom:2,
                                  background:sel?(C.gold+"15"):"transparent",transition:"background 0.1s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8424}}
                                  , React.createElement('input', { type: "checkbox", checked: sel,
                                    onChange: ()=>toggleRepBrano(p.studentId,r.titolo),
                                    style: {accentColor:C.gold,width:14,height:14,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8427}})
                                  , React.createElement('span', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8430}}
                                    , React.createElement('span', { style: {fontSize:12,fontWeight:sel?600:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8431}}, r.titolo)
                                    , React.createElement('span', { style: {fontSize:10,color:C.textDim,marginLeft:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8432}}, r.compositore)
                                  )
                                )
                              );
                            })
                          )
                        )
                      )
                    )
                    , p.brani.map((b,i)=>(
                      React.createElement('div', { key: i, style: {display:"flex",alignItems:"center",gap:6,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8442}}
                        , React.createElement(Ic, { n: "music", size: 10, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8443}})
                        , React.createElement('span', { style: {fontSize:11,flex:1,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8444}}, b)
                        , React.createElement('button', { onClick: ()=>remBrano(p.studentId,i), style: {background:"none",border:"none",cursor:"pointer",
                          display:"flex",padding:2,color:C.textDim},
                          onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8445}}
                          , React.createElement(Ic, { n: "x", size: 9, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8448}})
                        )
                      )
                    ))
                    , React.createElement('div', { style: {display:"flex",gap:6,marginTop:p.brani.length?6:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8452}}
                      , React.createElement('input', { value: branoInp[p.studentId]||"",
                        onChange: e=>setBranoInp(prev=>({...prev,[p.studentId]:e.target.value})),
                        onKeyDown: e=>{if(e.key==="Enter"&&branoInp[p.studentId] && branoInp[p.studentId].trim()){addBrano(p.studentId,branoInp[p.studentId]);setBranoInp(prev=>({...prev,[p.studentId]:""}));}},
                        placeholder: "Aggiungi brano manuale + Invio..."    ,
                        style: {flex:1,background:C.surface,border:"1px solid "+C.border,borderRadius:6,
                          padding:"5px 10px",color:C.text,fontSize:11,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8453}})
                      , React.createElement('button', { onClick: ()=>{if(branoInp[p.studentId] && branoInp[p.studentId].trim()){addBrano(p.studentId,branoInp[p.studentId]);setBranoInp(prev=>({...prev,[p.studentId]:""}));}},
                        style: {background:C.goldBg,border:"1px solid "+C.goldDim,borderRadius:6,padding:"5px 8px",cursor:"pointer",display:"flex"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8459}}
                        , React.createElement(Ic, { n: "plus", size: 11, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8461}})
                      )
                    )
                  )
                )
              )
            );
          })

          , f.partecipanti.length === 0 && (
            React.createElement('div', { style: {textAlign:"center",padding:"20px 0",color:C.textDim,fontSize:12,
              border:"1px dashed "+C.border,borderRadius:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8471}}
              , isMandatory ? "Aggiungi gli allievi con il pulsante sopra" : "Nessun partecipante — facoltativo per questo tipo di evento"
            )
          )
        )

        , React.createElement(Textarea, { label: "Note interne" , value: f.note, onChange: e=>set("note",e.target.value), placeholder: "Note riservate alla segreteria..."   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8478}})
      )

      , React.createElement('div', { style: {padding:"14px 24px",borderTop:"1px solid "+C.border,display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8481}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8482}}, "Annulla")
        , React.createElement(Btn, { onClick: ()=>{if(!f.titolo.trim()||!f.data)return alert("Titolo e data obbligatori");onSave({...f,id:f.id||("ev"+Date.now())});}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8483}}
          , React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8484}}), initial && initial.id?"Salva modifiche":"Crea evento"
        )
      )
    )
  );
};

// ─── DETTAGLIO EVENTO ─────────────────────────────────────────────────────────
const EventoDetail = ({ evento, students, onEdit, onDelete, onBack, onUpdate }) => {
  const [tab,    setTab]    = useState("info");
  const [modalP, setModalP] = useState(null); // null | "add" | prenotazione-obj

  const tp  = tipoEv(evento.tipo);
  const sc  = statoEvColor(evento.stato);
  const prenConf     = evento.prenotazioni.filter(p=>p.stato==="confermata");
  const postiOcc     = prenConf.reduce((t,p)=>t+p.posti,0);
  const incassoRisc  = prenConf.filter(p=>p.pagato).reduce((t,p)=>t+p.posti*(evento.prezzoBiglietto||0),0);
  const incassoAtteso= prenConf.reduce((t,p)=>t+p.posti*(evento.prezzoBiglietto||0),0);

  const savePren = pren => {
    const newP = evento.prenotazioni.find(p=>p.id===pren.id)
      ? evento.prenotazioni.map(p=>p.id===pren.id?pren:p)
      : [...evento.prenotazioni,pren];
    onUpdate({...evento,prenotazioni:newP});
    setModalP(null);
  };
  const delPren = id => onUpdate({...evento,prenotazioni:evento.prenotazioni.filter(p=>p.id!==id)});

  const TABS = [
    {id:"info",    label:"Informazioni", icon:"flag"},
    {id:"partec",  label:"Partecipanti", icon:"users"},
    ...(evento.biglietto?[{id:"biglietti",label:"Biglietteria",icon:"receipt"}]:[]),
    {id:"report",  label:"Report",       icon:"chart"},
  ];

  const formatData = d => d ? new Date(d+"T00:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"}) : "—";
  const formatDataS = d => d ? new Date(d+"T00:00:00").toLocaleDateString("it-IT") : "—";

  return (
    React.createElement('div', { style: {display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8523}}

      /* ── HEADER ── */
      , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"16px 24px 0",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8526}}
        , React.createElement('div', { style: {display:"flex",alignItems:"flex-start",gap:12,marginBottom:12,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8527}}
          , React.createElement('button', { onClick: onBack, style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,
            padding:"6px 10px",cursor:"pointer",display:"flex",color:C.textMuted,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8528}}
            , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8530}})
          )
          , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8532}}
            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8533}}
              , React.createElement('span', { style: {padding:"3px 10px",borderRadius:12,background:`${tp.hex}15`,color:tp.hex,
                fontSize:10,fontWeight:700,border:`1px solid ${tp.hex}30`,display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8534}}
                , React.createElement(Ic, { n: tp.icon, size: 9, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8536}}), tp.label
              )
              , React.createElement('span', { style: {padding:"3px 10px",borderRadius:12,background:sc.bg,color:sc.fg,
                fontSize:10,fontWeight:700,border:`1px solid ${sc.bd}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8538}}, evento.stato)
              , evento.biglietto && (
                React.createElement('span', { style: {padding:"3px 10px",borderRadius:12,background:C.goldBg,color:C.gold,
                  fontSize:10,fontWeight:700,border:`1px solid ${C.goldDim}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8541}}, "€ " , evento.prezzoBiglietto, " / biglietto"  )
              )
            )
            , React.createElement('h2', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(18px,3vw,26px)",fontWeight:600,lineHeight:1.2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8545}}
              , evento.titolo
            )
            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:4,display:"flex",gap:12,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8548}}
              , evento.data  && React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8549}}, React.createElement(Ic, { n: "calendar", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8549}}), formatData(evento.data), evento.ora&&` · ${evento.ora}`)
              , evento.luogo && React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8550}}, React.createElement(Ic, { n: "map", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8550}}), evento.luogo)
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8553}}
            , React.createElement(Btn, { variant: "secondary", onClick: onEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8554}}, React.createElement(Ic, { n: "edit", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8554}}), "Modifica")
            , React.createElement('button', { onClick: onDelete, style: {background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:8,
              padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8555}}
              , React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8557}})
            )
          )
        )
        /* Tab bar */
        , React.createElement('div', { style: {display:"flex",gap:0,overflowX:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8562}}
          , TABS.map(t=>(
            React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id),
              style: {padding:"10px 16px",border:"none",background:"none",whiteSpace:"nowrap",
                borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`,
                color:tab===t.id?C.gold:C.textMuted,cursor:"pointer",
                fontSize:13,fontFamily:"'DM Sans',sans-serif",
                display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8564}}
              , React.createElement(Ic, { n: t.icon, size: 12, stroke: tab===t.id?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8570}}), t.label
            )
          ))
        )
      )

      /* ── CONTENT ── */
      , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"24px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8577}}

        /* INFO */
        , tab==="info" && (
          React.createElement('div', { style: {maxWidth:760,display:"flex",flexDirection:"column",gap:18}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8581}}
            /* KPI row */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8583}}
              , [
                {l:"Partecipanti",val:evento.partecipanti.length, hex:C.gold},
                {l:"Capienza",    val:evento.capienza,            hex:C.blue},
                {l:"Prenotazioni",val:prenConf.length,            hex:C.teal},
                {l:"Posti liberi",val:Math.max(0,evento.capienza-postiOcc),hex:postiOcc>=evento.capienza?C.red:C.green},
              ].map(k=>(
                React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8590}}
                  , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8591}}, k.l)
                  , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:k.hex,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8592}}, k.val)
                )
              ))
            )

            /* Biglietteria summary */
            , evento.biglietto && (
              React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8599}}
                , [
                  {l:"Prezzo",           val:`€ ${evento.prezzoBiglietto}`,  hex:C.gold},
                  {l:"Incasso previsto", val:fmt(incassoAtteso),             hex:C.blue},
                  {l:"Riscosso",         val:fmt(incassoRisc),               hex:C.green},
                  {l:"Da riscuotere",    val:fmt(incassoAtteso-incassoRisc), hex:C.red},
                ].map(k=>(
                  React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8606}}
                    , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8607}}, k.l)
                    , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:k.hex,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8608}}, k.val)
                  )
                ))
              )
            )

            /* Occupazione */
            , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8615}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8616}}
                , React.createElement('span', { style: {fontSize:12,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8617}}, "Occupazione posti" )
                , React.createElement('span', { style: {fontSize:13,fontWeight:600,color:postiOcc>=evento.capienza?C.red:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8618}}
                  , postiOcc, " / "  , evento.capienza, " (" , Math.round(postiOcc/evento.capienza*100)||0, "%)"
                )
              )
              , React.createElement('div', { style: {height:8,background:C.border,borderRadius:4,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8622}}
                , React.createElement('div', { style: {height:"100%",borderRadius:4,transition:"width 0.5s",
                  background:postiOcc>=evento.capienza?C.red:postiOcc/evento.capienza>0.8?C.gold:C.green,
                  width:`${Math.min(100,(postiOcc/Math.max(1,evento.capienza)*100))}%`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8623}})
              )
              , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8627}}
                , Math.max(0,evento.capienza-postiOcc), " posti ancora disponibili"
              )
            )

            , evento.descrizione && (
              React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8633}}
                , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8634}}, "Descrizione")
                , React.createElement('p', { style: {fontSize:13,color:C.text,lineHeight:1.65}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8635}}, evento.descrizione)
              )
            )
            , evento.note && (
              React.createElement('div', { style: {background:`${C.gold}08`,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8639}}
                , React.createElement('div', { style: {fontSize:10,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8640}}, "Note")
                , React.createElement('p', { style: {fontSize:13,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8641}}, evento.note)
              )
            )
          )
        )

        /* PARTECIPANTI */
        , tab==="partec" && (
          React.createElement('div', { style: {maxWidth:680}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8649}}
            , evento.partecipanti.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"56px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8651}}
                , React.createElement(Ic, { n: "users", size: 36, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8652}})
                , React.createElement('p', { style: {marginTop:12,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8653}}, "Nessun partecipante" )
                , React.createElement('p', { style: {fontSize:11,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8654}}, "Modifica l'evento per aggiungere allievi"    )
              )
            ) : (
              React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8657}}
                , evento.partecipanti.map((p,i)=>(
                  React.createElement('div', { key: p.studentId, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8659}}
                    , React.createElement('div', { style: {padding:"12px 16px",display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8660}}
                      , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,
                        color:C.textDim,width:28,textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8661}}, i+1)
                      , React.createElement('div', { style: {width:36,height:36,borderRadius:"50%",background:`${C.gold}20`,
                        border:`1px solid ${C.goldDim}`,display:"flex",alignItems:"center",
                        justifyContent:"center",fontSize:12,fontWeight:600,color:C.gold,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8663}}
                        , initials(p.studentName)
                      )
                      , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8668}}
                        , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8669}}, p.studentName)
                        , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8670}}
                          , p.brani.length, " bran" , p.brani.length!==1?"i":"o", " in programma"
                        )
                      )
                    )
                    , p.brani.length>0 && (
                      React.createElement('div', { style: {padding:"8px 16px 12px 76px",borderTop:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8676}}
                        , p.brani.map((b,j)=>(
                          React.createElement('div', { key: j, style: {display:"flex",alignItems:"center",gap:8,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8678}}
                            , React.createElement(Ic, { n: "music", size: 11, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8679}})
                            , React.createElement('span', { style: {fontSize:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8680}}, b)
                          )
                        ))
                      )
                    )
                  )
                ))
              )
            )
          )
        )

        /* BIGLIETTERIA */
        , tab==="biglietti" && (
          React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8694}}
            /* Stats */
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8696}}
              , [
                {l:"Prenotazioni", val:prenConf.length,                    hex:C.blue},
                {l:"Posti venduti",val:postiOcc,                           hex:C.teal},
                {l:"Riscosso",     val:fmt(incassoRisc),                   hex:C.green},
                {l:"Da riscuotere",val:fmt(incassoAtteso-incassoRisc),    hex:incassoAtteso-incassoRisc>0?C.red:C.textDim},
              ].map(k=>(
                React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8703}}
                  , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8704}}, k.l)
                  , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:k.hex,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8705}}, k.val)
                )
              ))
            )

            /* Tabella prenotazioni */
            , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8711}}
              , React.createElement('div', { style: {padding:"13px 18px",borderBottom:`1px solid ${C.border}`,
                display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8712}}
                , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8714}}
                  , React.createElement(Ic, { n: "receipt", size: 13, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8715}})
                  , React.createElement('span', { style: {fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8716}}, "Prenotazioni ("
                     , evento.prenotazioni.length, ")"
                  )
                )
                , React.createElement(Btn, { small: true, onClick: ()=>setModalP("add"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8720}}, React.createElement(Ic, { n: "plus", size: 12, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8720}}), "Nuova")
              )
              , evento.prenotazioni.length===0 ? (
                React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8723}}, "Nessuna prenotazione ancora"

                )
              ) : (
                React.createElement('div', { style: {overflowX:"auto",WebkitOverflowScrolling:"touch"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8727}}
                  /* Header */
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1.6fr 1fr 55px 90px 85px 70px",minWidth:520,
                    padding:"8px 16px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8729}}
                    , ["Nome","Contatto","Posti","Importo","Stato",""].map(h=>(
                      React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8732}}, h)
                    ))
                  )
                  , evento.prenotazioni.map((pren,i)=>{
                    const imp = pren.posti*(evento.prezzoBiglietto||0);
                    const pc  = {confermata:{fg:C.green,bg:C.greenBg},annullata:{fg:C.red,bg:C.redBg},"in attesa":{fg:C.gold,bg:C.goldBg}}[pren.stato]||{fg:C.textMuted,bg:C.surface};
                    return (
                      React.createElement('div', { key: pren.id, style: {display:"grid",gridTemplateColumns:"1.6fr 1fr 55px 90px 85px 70px",minWidth:520,
                        padding:"11px 16px",borderBottom:i<evento.prenotazioni.length-1?`1px solid ${C.border}20`:"none",alignItems:"center"},
                        onMouseEnter: e=>e.currentTarget.style.background=C.surfaceHover,
                        onMouseLeave: e=>e.currentTarget.style.background="transparent", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8739}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8743}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8744}}, pren.nome)
                          , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8745}}, formatDataS(pren.dataPren))
                        )
                        , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8747}}
                          , React.createElement('div', { style: {overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8748}}, pren.email)
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8749}}, pren.telefono)
                        )
                        , React.createElement('div', { style: {fontSize:13,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8751}}, pren.posti)
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8752}}
                          , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,
                            color:pren.pagato?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8753}}, fmt(imp))
                          , React.createElement('div', { style: {fontSize:10,color:pren.pagato?C.green:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8755}}
                            , pren.pagato?"✓ pagato":"da pagare"
                          )
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8759}}
                          , React.createElement('span', { style: {padding:"3px 8px",borderRadius:8,fontSize:10,fontWeight:600,
                            background:pc.bg,color:pc.fg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8760}}, pren.stato)
                        )
                        , React.createElement('div', { style: {display:"flex",gap:4,justifyContent:"flex-end"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8763}}
                          , React.createElement('button', { onClick: ()=>setModalP(pren), style: {background:"none",border:"none",cursor:"pointer",display:"flex",padding:4,color:C.textDim,borderRadius:5},
                            onMouseEnter: e=>e.currentTarget.style.color=C.gold, onMouseLeave: e=>e.currentTarget.style.color=C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8764}}
                            , React.createElement(Ic, { n: "edit", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8766}})
                          )
                          , React.createElement('button', { onClick: ()=>{if(window.confirm(`Eliminare la prenotazione di ${pren.nome}?`))delPren(pren.id);},
                            style: {background:"none",border:"none",cursor:"pointer",display:"flex",padding:4,color:C.textDim,borderRadius:5},
                            onMouseEnter: e=>e.currentTarget.style.color=C.red, onMouseLeave: e=>e.currentTarget.style.color=C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8768}}
                            , React.createElement(Ic, { n: "trash", size: 13, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8771}})
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

        /* REPORT */
        , tab==="report" && (
          React.createElement('div', { style: {maxWidth:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8785}}
            , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8786}}
              /* Report header con colore tipo */
              , React.createElement('div', { style: {background:`linear-gradient(135deg,${tp.hex}18,${tp.hex}05)`,
                borderBottom:`1px solid ${tp.hex}30`,padding:"20px 24px",
                display:"flex",alignItems:"center",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8788}}
                , React.createElement('div', { style: {width:48,height:48,borderRadius:12,background:`${tp.hex}20`,border:`1px solid ${tp.hex}40`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8791}}
                  , React.createElement(Ic, { n: tp.icon, size: 22, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8793}})
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8795}}
                  , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8796}}, evento.titolo)
                  , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8797}}
                    , tp.label, " · "  , formatData(evento.data), evento.ora&&` · ${evento.ora}`
                  )
                )
              )

              , React.createElement('div', { style: {padding:"20px 24px",display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8803}}
                /* Dettagli */
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8805}}
                  , [
                    {l:"Luogo",  v:evento.luogo||"—"},
                    {l:"Stato",  v:evento.stato},
                    {l:"Tipo",   v:tp.label},
                    {l:"Capienza",v:`${evento.capienza} posti`},
                  ].map(x=>(
                    React.createElement('div', { key: x.l, style: {padding:"10px 0",borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8812}}
                      , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8813}}, x.l)
                      , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8814}}, x.v)
                    )
                  ))
                )

                /* Programma */
                , evento.partecipanti.length>0 && (
                  React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8821}}
                    , React.createElement('div', { style: {fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8822}}, "Programma partecipanti"

                    )
                    , evento.partecipanti.map((p,i)=>(
                      React.createElement('div', { key: p.studentId, style: {display:"flex",gap:10,marginBottom:10,paddingBottom:10,
                        borderBottom:i<evento.partecipanti.length-1?`1px solid ${C.border}20`:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8826}}
                        , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.textDim,
                          width:24,flexShrink:0,textAlign:"right"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8828}}, i+1, ".")
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8830}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8831}}, p.studentName)
                          , p.brani.length>0 && p.brani.map((b,j)=>(
                            React.createElement('div', { key: j, style: {display:"flex",alignItems:"center",gap:5,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8833}}
                              , React.createElement(Ic, { n: "music", size: 10, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8834}})
                              , React.createElement('span', { style: {fontSize:12,color:C.textMuted,fontStyle:"italic"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8835}}, b)
                            )
                          ))
                        )
                      )
                    ))
                  )
                )

                /* Riepilogo biglietteria */
                , evento.biglietto && (
                  React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8846}}
                    , React.createElement('div', { style: {fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8847}}, "Riepilogo biglietteria"

                    )
                    , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8850}}
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
                          borderBottom:`1px solid ${C.border}20`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8860}}
                          , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8862}}, x.l)
                          , React.createElement('span', { style: {fontSize:12,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8863}}, x.v)
                        )
                      ))
                    )
                  )
                )

                /* Note */
                , evento.note && (
                  React.createElement('div', { style: {background:`${C.gold}08`,border:`1px solid ${C.goldDim}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8872}}
                    , React.createElement('div', { style: {fontSize:10,color:C.gold,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8873}}, "Note post-evento" )
                    , React.createElement('p', { style: {fontSize:13,color:C.text,lineHeight:1.65}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8874}}, evento.note)
                  )
                )
              )
            )
          )
        )
      )

      /* Modal prenotazione */
      , modalP && (
        React.createElement(Modal, { title: modalP==="add"?"Nuova prenotazione":"Modifica prenotazione", onClose: ()=>setModalP(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8885}}
          , React.createElement(PrenotazioneForm, { evento: evento, initial: modalP!=="add"?modalP:null, onSave: savePren, onClose: ()=>setModalP(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8886}})
        )
      )
    )
  );
};

// ─── CONCERTI VIEW ────────────────────────────────────────────────────────────
const ConcertiView = ({ students:propStudents }) => {
  const isMobile = useIsMobile();
  const students  = propStudents || INIT_STUDENTS;
  const [concerti, setConcerti] = useState(INIT_CONCERTI);
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null);
  const [fTipo,    setFTipo]    = useState("");
  const [fStato,   setFStato]   = useState("");
  const [search,   setSearch]   = useState("");

  const filtered = concerti.filter(e=>{
    const q = search.toLowerCase();
    return (!q || e.titolo.toLowerCase().includes(q)||e.luogo.toLowerCase().includes(q))
      && (!fTipo  || e.tipo===fTipo)
      && (!fStato || e.stato===fStato);
  }).sort((a,b)=>b.data.localeCompare(a.data));

  const handleSave   = ev => { setConcerti(p=>[...p.filter(x=>x.id!==ev.id),ev]); setModal(null); if(_optionalChain([selected, 'optionalAccess', _77 => _77.id])===ev.id) setSelected(ev); };
  const handleDelete = () => { setConcerti(p=>p.filter(x=>x.id!==_optionalChain([selected, 'optionalAccess', _78 => _78.id]))); setSelected(null); setModal(null); };
  const handleUpdate = ev => { setConcerti(p=>p.map(x=>x.id===ev.id?ev:x)); setSelected(ev); };

  if(selected) return (
    React.createElement(React.Fragment, null
      , React.createElement(EventoDetail, { evento: selected, students: students,
        onEdit: ()=>setModal("edit"),
        onDelete: ()=>setModal("del"),
        onBack: ()=>setSelected(null),
        onUpdate: handleUpdate, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8917}})
      , modal==="edit" && (
        React.createElement(Modal, { title: "Modifica evento" , onClose: ()=>setModal(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8923}}
          , React.createElement(EventoForm, { initial: selected, students: students, onSave: handleSave, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8924}})
        )
      )
      , modal==="del" && selected && (
        React.createElement(ConfirmDelete, { label: selected.titolo, description: "Tutte le prenotazioni associate verranno eliminate."     ,
          onConfirm: handleDelete, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8928}})
      )
    )
  );

  const prossimi   = concerti.filter(e=>e.stato==="programmato").length;
  const completati = concerti.filter(e=>e.stato==="completato").length;

  return (
    React.createElement('div', { style: {padding:isMobile?"12px":"clamp(16px,3vw,28px)",display:"flex",flexDirection:"column",gap:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8938}}

      /* Header */
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8941}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8942}}
          , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8943}}, "Concerti & Eventi"  )
          , React.createElement('p', { style: {color:C.textMuted,fontSize:14,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8944}}
            , prossimi, " programmati · "   , completati, " completati · "   , concerti.length, " totali"
          )
        )
        , React.createElement(Btn, { onClick: ()=>setModal("new"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 8948}}, React.createElement(Ic, { n: "plus", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8948}}), "Nuovo evento" )
      )

      /* KPI strip */
      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8952}}
        , [
          {l:"Prossimi",    v:prossimi,    hex:C.blue,   icon:"calendar"},
          {l:"Completati",  v:completati,  hex:C.green,  icon:"check"},
          {l:"Con biglietto",v:concerti.filter(e=>e.biglietto).length, hex:C.gold, icon:"ticket"},
          {l:"Gratuiti",    v:concerti.filter(e=>!e.biglietto).length, hex:C.teal, icon:"users"},
          {l:"Annullati",   v:concerti.filter(e=>e.stato==="annullato").length, hex:C.red, icon:"x"},
        ].map(k=>(
          React.createElement('div', { key: k.l, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",
            display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8960}}
            , React.createElement('div', { style: {width:36,height:36,borderRadius:9,background:`${k.hex}15`,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8962}}
              , React.createElement(Ic, { n: k.icon, size: 16, stroke: k.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8964}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 8966}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8967}}, k.v)
              , React.createElement('div', { style: {fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8968}}, k.l)
            )
          )
        ))
      )

      /* Filtri */
      , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8975}}
        , React.createElement('div', { style: {position:"relative",flex:"1 1 180px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8976}}
          , React.createElement('span', { style: {position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8977}}, React.createElement(Ic, { n: "search", size: 13, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8977}}))
          , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value), placeholder: "Cerca eventi…" ,
            style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"8px 12px 8px 32px",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8978}})
        )
        , React.createElement('select', { value: fTipo, onChange: e=>setFTipo(e.target.value),
          style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,
            fontSize:12,padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8982}}
          , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8985}}, "Tutti i tipi"  )
          , TIPI_EVENTO.map(t=>React.createElement('option', { key: t.id, value: t.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8986}}, t.label))
        )
        , React.createElement('select', { value: fStato, onChange: e=>setFStato(e.target.value),
          style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,
            fontSize:12,padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8988}}
          , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 8991}}, "Tutti gli stati"  )
          , STATI_EVENTO.map(s=>React.createElement('option', { key: s, value: s, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8992}}, s))
        )
        , (fTipo||fStato||search) && (
          React.createElement('button', { onClick: ()=>{setFTipo("");setFStato("");setSearch("");},
            style: {background:"none",border:"none",cursor:"pointer",color:C.textDim,fontSize:12,fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 8995}}, "Reset"

          )
        )
      )

      /* Card grid */
      , filtered.length===0 ? (
        React.createElement('div', { style: {textAlign:"center",padding:"64px 0",color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9004}}
          , React.createElement(Ic, { n: "flag", size: 40, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9005}})
          , React.createElement('p', { style: {marginTop:14,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9006}}, "Nessun evento trovato"  )
          , React.createElement('p', { style: {fontSize:12,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9007}}, "Crea il primo con il pulsante in alto"       )
        )
      ) : (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9010}}
          , filtered.map(ev=>{
            const tp  = tipoEv(ev.tipo);
            const sc  = statoEvColor(ev.stato);
            const pConf = ev.prenotazioni.filter(p=>p.stato==="confermata");
            const pOcc  = pConf.reduce((t,p)=>t+p.posti,0);
            const pct   = ev.capienza>0?Math.min(100,pOcc/ev.capienza*100):0;
            return (
              React.createElement('div', { key: ev.id, onClick: ()=>setSelected(ev),
                style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",
                  cursor:"pointer",transition:"all 0.18s",display:"flex",flexDirection:"column"},
                onMouseEnter: e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.28)";},
                onMouseLeave: e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9018}}
                /* Accent bar */
                , React.createElement('div', { style: {height:4,background:`linear-gradient(90deg,${tp.hex},${tp.hex}50)`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9024}})
                , React.createElement('div', { style: {padding:"15px 18px",flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9025}}
                  , React.createElement('div', { style: {display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9026}}
                    , React.createElement('span', { style: {padding:"3px 10px",borderRadius:10,background:`${tp.hex}15`,color:tp.hex,
                      fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9027}}
                      , React.createElement(Ic, { n: tp.icon, size: 9, stroke: tp.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9029}}), tp.label
                    )
                    , React.createElement('span', { style: {padding:"3px 10px",borderRadius:10,background:sc.bg,color:sc.fg,fontSize:10,fontWeight:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9031}}
                      , ev.stato
                    )
                    , ev.biglietto && (
                      React.createElement('span', { style: {padding:"3px 10px",borderRadius:10,background:C.goldBg,color:C.gold,fontSize:10,fontWeight:700}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9035}}, "€ "
                         , ev.prezzoBiglietto
                      )
                    )
                  )
                  , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,lineHeight:1.3,marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9040}}
                    , ev.titolo
                  )
                  , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:3,fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9043}}
                    , ev.data && (
                      React.createElement('span', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9045}}
                        , React.createElement(Ic, { n: "calendar", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9046}})
                        , new Date(ev.data+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"})
                        , ev.ora&&` · ${ev.ora}`
                      )
                    )
                    , ev.luogo && (
                      React.createElement('span', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9052}}
                        , React.createElement(Ic, { n: "map", size: 11, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9053}}), ev.luogo
                      )
                    )
                  )
                )
                /* Card footer */
                , React.createElement('div', { style: {padding:"10px 18px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9059}}
                  , React.createElement('div', { style: {display:"flex",gap:10,fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9060}}
                    , React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9061}}
                      , React.createElement(Ic, { n: "users", size: 10, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9062}}), ev.partecipanti.length, " allievi"
                    )
                    , ev.biglietto && (
                      React.createElement('span', { style: {display:"flex",alignItems:"center",gap:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9065}}
                        , React.createElement(Ic, { n: "receipt", size: 10, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9066}}), pConf.length, " prenotazioni"
                      )
                    )
                  )
                  , ev.biglietto && ev.capienza>0 && (
                    React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9071}}
                      , React.createElement('div', { style: {width:56,height:4,background:C.border,borderRadius:2,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9072}}
                        , React.createElement('div', { style: {height:"100%",borderRadius:2,
                          background:pct>=90?C.red:pct>=70?C.gold:C.green,
                          width:`${pct}%`,transition:"width 0.4s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9073}})
                      )
                      , React.createElement('span', { style: {fontSize:10,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9077}}, pOcc, "/", ev.capienza)
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
        React.createElement(Modal, { title: "Nuovo evento" , onClose: ()=>setModal(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9089}}
          , React.createElement(EventoForm, { students: students, onSave: handleSave, onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9090}})
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
  {id:"admin",      label:"Amministratore", hex:C.gold,   bg:C.goldBg,    bd:C.goldDim,      desc:"Accesso completo al sistema e alle impostazioni"},
  {id:"direttore",  label:"Direttore",      hex:C.purple, bg:C.purpleBg,  bd:C.purpleBorder, desc:"Dashboard completa, report, nessuna impostazione admin"},
  {id:"segreteria", label:"Segreteria",     hex:C.blue,   bg:C.blueBg,    bd:C.blueBorder,   desc:"Allievi, pagamenti, calendario"},
  {id:"docente",    label:"Docente",        hex:C.teal,   bg:C.tealBg,    bd:C.tealBorder,   desc:"Solo le proprie lezioni e il repertorio"},
];
const ruoloById = id => RUOLI.find(r=>r.id===id)||RUOLI[3];

const MODULI = [
  {id:"dashboard",   label:"Dashboard",      icon:"grid"},
  {id:"allievi",     label:"Allievi",         icon:"users"},
  {id:"calendario",  label:"Calendario",      icon:"calendar"},
  {id:"contabilita", label:"Contabilità",     icon:"euro"},
  {id:"repertorio",  label:"Repertorio",      icon:"music"},
  {id:"report",      label:"Report",          icon:"chart"},
  {id:"impostazioni",label:"Impostazioni",    icon:"settings"},
  {id:"utenti",      label:"Gestione utenti", icon:"shield"},
];

// Permessi default per ruolo
const PERM_DEFAULT = {
  admin:      {dashboard:true, allievi:true, calendario:true, contabilita:true, repertorio:true, report:true, impostazioni:true, utenti:true},
  direttore:  {dashboard:true, allievi:true, calendario:true, contabilita:true, repertorio:true, report:true, impostazioni:false, utenti:false},
  segreteria: {dashboard:true, allievi:true, calendario:true, contabilita:true, repertorio:false,report:false,impostazioni:false, utenti:false},
  docente:    {dashboard:true, allievi:false,calendario:true, contabilita:false,repertorio:true, report:false,impostazioni:false, utenti:false},
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
  {id:"u1", nome:"Marco Bianchi",    email:"m.bianchi@accademia.it",  ruolo:"admin",      stato:"attivo",   avatar:"MB", iscritto:"2023-09-01", ultimoAccesso:"2025-05-23T09:14:00", permessi:{...PERM_DEFAULT.admin},     note:"Fondatore e direttore artistico"},
  {id:"u2", nome:"Laura Esposito",   email:"l.esposito@accademia.it", ruolo:"segreteria", stato:"attivo",   avatar:"LE", iscritto:"2023-09-15", ultimoAccesso:"2025-05-23T08:40:00", permessi:{...PERM_DEFAULT.segreteria},note:""},
  {id:"u3", nome:"Prof. Rossi",      email:"rossi@accademia.it",      ruolo:"docente",    stato:"attivo",   avatar:"PR", iscritto:"2023-10-01", ultimoAccesso:"2025-05-22T18:05:00", permessi:{...PERM_DEFAULT.docente,allievi:true},note:"Accesso allievi esteso per coordinamento"},
  {id:"u4", nome:"Prof. Bianchi",    email:"fbianchi@accademia.it",   ruolo:"docente",    stato:"attivo",   avatar:"PB", iscritto:"2023-10-01", ultimoAccesso:"2025-05-20T16:30:00", permessi:{...PERM_DEFAULT.docente},   note:""},
  {id:"u5", nome:"Prof. Verde",      email:"verde@accademia.it",      ruolo:"docente",    stato:"attivo",   avatar:"PV", iscritto:"2024-01-10", ultimoAccesso:"2025-05-21T14:00:00", permessi:{...PERM_DEFAULT.docente},   note:""},
  {id:"u6", nome:"Giulia Moretti",   email:"g.moretti@gmail.com",     ruolo:"direttore",  stato:"attivo",   avatar:"GM", iscritto:"2024-03-01", ultimoAccesso:"2025-05-19T10:22:00", permessi:{...PERM_DEFAULT.direttore}, note:"Direttore amministrativo"},
  {id:"u7", nome:"Antonio Ferrara",  email:"a.ferrara@gmail.com",     ruolo:"docente",    stato:"sospeso",  avatar:"AF", iscritto:"2024-06-01", ultimoAccesso:"2025-03-10T09:00:00", permessi:{...PERM_DEFAULT.docente},   note:"Sospeso — contratto scaduto"},
];

const INIT_RICHIESTE = [
  {id:"r1", nome:"Chiara Lombardi",  email:"c.lombardi@gmail.com",    ruolo:"docente",    data:"2025-05-22", messaggio:"Docente di violoncello, vorrei accedere al calendario e al repertorio."},
  {id:"r2", nome:"Roberto Neri",     email:"r.neri@outlook.com",      ruolo:"segreteria", data:"2025-05-20", messaggio:"Collaboro in segreteria, ho bisogno di accedere alla gestione allievi e pagamenti."},
  {id:"r3", nome:"Sofia Belli",      email:"s.belli@accademia.it",    ruolo:"docente",    data:"2025-05-18", messaggio:"Nuova insegnante di canto assunta dal 1° giugno."},
];

// ─── DRAWER DETTAGLIO UTENTE ──────────────────────────────────────────────────
const UtenteDrawer = ({utente,onClose,onSave,onSospendi,onElimina,isCurrentAdmin})=>{
  const [draft,setDraft]=useState({...utente});
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
        background:"rgba(0,0,0,.7)",backdropFilter:"blur(3px)",animation:"fadeIn .2s ease"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9177}})
      , React.createElement('div', { style: {position:"fixed",top:0,right:0,bottom:0,zIndex:301,width:500,
        background:C.surface,borderLeft:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",animation:"slideDrawer .26s cubic-bezier(.4,0,.2,1)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9179}}

        /* Header */
        , React.createElement('div', { style: {padding:"18px 22px",borderBottom:`1px solid ${C.border}`,
          display:"flex",alignItems:"center",gap:14,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9184}}
          , React.createElement(Avatar, { initials: utente.avatar, hex: r.hex, size: 46, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9186}})
          , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9187}}
            , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9188}}, utente.nome)
            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9190}}, utente.email)
          )
          , React.createElement('div', { style: {display:"flex",gap:8,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9192}}
            , React.createElement(Badge, { stato: utente.stato, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9193}})
            , React.createElement('button', { onClick: onClose, style: {background:"none",border:"none",cursor:"pointer",
              color:C.textMuted,display:"flex",padding:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9194}}
              , React.createElement(Ic, { n: "x", size: 17, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9196}})
            )
          )
        )

        /* Tabs */
        , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9202}}
          , [["profilo","user","Profilo"],["permessi","shield","Permessi"],["attivita","clock","Attività"]].map(([v,ic,lb])=>(
            React.createElement('button', { key: v, onClick: ()=>setTab(v),
              style: {flex:1,padding:"11px 0",display:"flex",alignItems:"center",justifyContent:"center",
                gap:6,background:"none",border:"none",cursor:"pointer",fontSize:12,
                color:tab===v?C.gold:C.textMuted,fontFamily:"'DM Sans',sans-serif",
                borderBottom:`2px solid ${tab===v?C.gold:"transparent"}`,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9204}}
              , React.createElement(Ic, { n: ic, size: 13, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9209}}), lb
            )
          ))
        )

        /* Body */
        , React.createElement('div', { style: {flex:1,overflow:"auto",padding:"18px 22px",display:"flex",flexDirection:"column",gap:18}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9215}}

          /* ── PROFILO ── */
          , tab==="profilo"&&(
            React.createElement(React.Fragment, null
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9220}}
                , React.createElement(Field, { label: "Nome completo *"  , value: draft.nome, onChange: e=>setD("nome",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9221}})
                , React.createElement(Field, { label: "Email *" , type: "email", value: draft.email, onChange: e=>setD("email",e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9222}})
              )

              /* Ruolo */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9226}}
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9227}}, "Ruolo")
                , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9228}}
                  , RUOLI.map(r=>(
                    React.createElement('button', { key: r.id, onClick: ()=>!isSelf&&handleRuolo(r.id),
                      style: {padding:"10px 13px",borderRadius:10,textAlign:"left",cursor:isSelf?"default":"pointer",
                        fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
                        background:draft.ruolo===r.id?r.bg:C.bg,
                        border:`1.5px solid ${draft.ruolo===r.id?r.hex:C.border}`,
                        opacity:isSelf&&draft.ruolo!==r.id?.4:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9230}}
                      , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:draft.ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9236}}, r.label)
                      , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3,lineHeight:1.4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9237}}, r.desc)
                    )
                  ))
                )
                , isSelf&&React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9241}}, "Non puoi modificare il tuo ruolo."     )
              )

              /* Note */
              , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9245}}
                , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9246}}, "Note interne" )
                , React.createElement('textarea', { value: draft.note, onChange: e=>setD("note",e.target.value), rows: 2,
                  placeholder: "Note visibili solo agli amministratori..."    ,
                  style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                    color:C.text,fontSize:13,padding:"9px 13px",width:"100%",
                    fontFamily:"'DM Sans',sans-serif",resize:"vertical"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9247}})
              )

              /* Info di sistema */
              , React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9255}}
                , React.createElement('div', { style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9256}}, "Informazioni account" )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9257}}
                  , [
                    {label:"Iscritto il",    val:fmt_data(utente.iscritto)},
                    {label:"Ultimo accesso", val:utente.ultimoAccesso?fmt_ts(utente.ultimoAccesso):"Mai"},
                    {label:"Stato account",  val:React.createElement(Badge, { stato: utente.stato, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9261}})},
                  ].map(row=>(
                    React.createElement('div', { key: row.label, style: {display:"flex",justifyContent:"space-between",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9263}}
                      , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9264}}, row.label)
                      , React.createElement('span', { style: {fontSize:12,color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9265}}, row.val)
                    )
                  ))
                )
              )

              /* Azioni pericolose */
              , !isSelf&&(
                React.createElement('div', { style: {background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:10,padding:"14px 16px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9273}}
                  , React.createElement('div', { style: {fontSize:11,color:C.red,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9274}}, "Zona pericolosa" )
                  , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9275}}
                    , React.createElement(Btn, { small: true, danger: true, onClick: ()=>onSospendi(utente), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9276}}
                      , React.createElement(Ic, { n: utente.stato==="sospeso"?"unlock":"ban", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9277}})
                      , utente.stato==="sospeso"?"Riattiva account":"Sospendi account"
                    )
                    , React.createElement(Btn, { small: true, danger: true, onClick: ()=>onElimina(utente), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9280}}
                      , React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9281}}), "Elimina utente"
                    )
                  )
                )
              )
            )
          )

          /* ── PERMESSI ── */
          , tab==="permessi"&&(
            React.createElement(React.Fragment, null
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9292}}
                , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9293}}, "Permessi moduli" )
                , React.createElement('div', { style: {fontSize:12,color:C.textDim,marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9294}}, "Personalizza l'accesso ai moduli rispetto al ruolo base. Il ruolo "

                    , React.createElement('span', { style: {color:r.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9296}}, r.label), " ha permessi predefiniti."
                )
                , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9298}}
                  , MODULI.map(m=>{
                    const def=_optionalChain([PERM_DEFAULT, 'access', _79 => _79[draft.ruolo], 'optionalAccess', _80 => _80[m.id]])||false;
                    const val=_nullishCoalesce(_optionalChain([draft, 'access', _81 => _81.permessi, 'optionalAccess', _82 => _82[m.id]]), () => (def));
                    const personalizzato=val!==def;
                    return(
                      React.createElement('div', { key: m.id, style: {display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                        borderRadius:10,border:`1px solid ${val?C.border+"80":C.border+"30"}`,
                        background:val?C.bg:C.surface2,transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9304}}
                        , React.createElement('div', { style: {width:30,height:30,borderRadius:8,flexShrink:0,
                          background:val?`${r.hex}18`:C.surface,
                          display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9307}}
                          , React.createElement(Ic, { n: m.icon, size: 14, stroke: val?r.hex:C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9310}})
                        )
                        , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9312}}
                          , React.createElement('div', { style: {fontSize:13,fontWeight:500,color:val?C.text:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9313}}, m.label)
                          , personalizzato&&(
                            React.createElement('div', { style: {fontSize:10,color:val?C.green:C.orange,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9315}}
                              , val?"Aggiunto rispetto al ruolo base":"Rimosso rispetto al ruolo base"
                            )
                          )
                        )
                        , React.createElement(Toggle, { value: val, onChange: v=>setPerm(m.id,v), disabled: isSelf&&m.id==="utenti", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9320}})
                      )
                    );
                  })
                )
              )
              , React.createElement('button', { onClick: ()=>setDraft(p=>({...p,permessi:{...PERM_DEFAULT[p.ruolo]}})),
                style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,
                  fontSize:12,padding:"8px 14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                  display:"flex",alignItems:"center",gap:6,alignSelf:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9326}}
                , React.createElement(Ic, { n: "check", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9330}}), "Ripristina default ruolo"
              )
            )
          )

          /* ── ATTIVITÀ ── */
          , tab==="attivita"&&(
            React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9337}}
              , React.createElement('div', { style: {fontSize:13,fontWeight:500,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9338}}, "Storico accessi" )
              , [
                {data:"23/05/2025 09:14",evento:"Accesso effettuato",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"22/05/2025 18:05",evento:"Accesso effettuato",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"22/05/2025 14:30",evento:"Modifica permessi utente",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"20/05/2025 09:00",evento:"Accesso effettuato",ip:"10.0.0.5",dispositivo:"Safari / iPhone"},
                {data:"18/05/2025 16:45",evento:"Password modificata",ip:"192.168.1.10",dispositivo:"Chrome / macOS"},
                {data:"15/05/2025 11:22",evento:"Accesso effettuato",ip:"192.168.1.10",dispositivo:"Firefox / Windows"},
              ].map((a,i)=>(
                React.createElement('div', { key: i, style: {padding:"11px 14px",background:C.bg,border:`1px solid ${C.border}`,
                  borderRadius:9,display:"flex",gap:12,alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9347}}
                  , React.createElement('div', { style: {width:7,height:7,borderRadius:"50%",background:C.goldDim,marginTop:5,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9349}})
                  , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9350}}
                    , React.createElement('div', { style: {fontSize:12,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9351}}, a.evento)
                    , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:2,display:"flex",gap:10,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9352}}
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9353}}, a.data)
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9354}}, "·"), React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9354}}, a.dispositivo)
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9355}}, "·"), React.createElement('span', { style: {fontFamily:"monospace",fontSize:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9355}}, a.ip)
                    )
                  )
                )
              ))
            )
          )
        )

        /* Footer */
        , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,
          position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:8,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9365}}
          , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9367}}, "Annulla")
          , React.createElement(Btn, { onClick: ()=>onSave(draft), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9368}}
            , React.createElement(Ic, { n: "check", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9369}}), "Salva modifiche"
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
    React.createElement(Modal, { title: "Invita nuovo utente"  , onClose: onClose, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9395}}
      , React.createElement('div', { style: {padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9396}}
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9397}}
          , React.createElement(Field, { label: "Nome completo *"  , value: f.nome, onChange: e=>set("nome",e.target.value), error: err.nome, placeholder: "Es. Mario Rossi"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9398}})
          , React.createElement(Field, { label: "Email *" , type: "email", value: f.email, onChange: e=>set("email",e.target.value), error: err.email, placeholder: "mario@esempio.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9399}})
        )
        /* Selezione ruolo */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9402}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:9}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9403}}, "Ruolo assegnato" )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9404}}
            , RUOLI.map(r=>(
              React.createElement('button', { key: r.id, onClick: ()=>set("ruolo",r.id),
                style: {padding:"10px 12px",borderRadius:9,textAlign:"left",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
                  background:f.ruolo===r.id?r.bg:C.bg,
                  border:`1.5px solid ${f.ruolo===r.id?r.hex:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9406}}
                , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:f.ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9411}}, r.label)
                , React.createElement('div', { style: {fontSize:10,color:C.textDim,marginTop:3,lineHeight:1.35}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9412}}, r.desc)
              )
            ))
          )
        )
        /* Link invito simulato */
        , React.createElement('div', { style: {background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:9,padding:"11px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9418}}
          , React.createElement('div', { style: {fontSize:11,color:C.blue,marginBottom:5,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9419}}, "Link di invito (verrà inviato via email)"      )
          , React.createElement('div', { style: {fontSize:11,color:C.textDim,fontFamily:"monospace",
            background:C.bg,padding:"6px 10px",borderRadius:6,wordBreak:"break-all"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9420}}, "https://accademia.it/accesso?token=inv_"
            , Math.random().toString(36).slice(2,10)
          )
        )
        , React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9425}}
          , React.createElement('label', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9426}}, "Messaggio personalizzato (opzionale)"  )
          , React.createElement('textarea', { value: f.messaggio, onChange: e=>set("messaggio",e.target.value), rows: 2,
            placeholder: "Es. Benvenuto! Clicca il link per completare la registrazione."        ,
            style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
              color:C.text,fontSize:13,padding:"9px 13px",width:"100%",
              fontFamily:"'DM Sans',sans-serif",resize:"vertical"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9427}})
        )
      )
      , React.createElement('div', { style: {padding:"13px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9434}}
        , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9435}}, "Annulla")
        , React.createElement(Btn, { onClick: handleSend, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9436}}, React.createElement(Ic, { n: "mail", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9436}}), "Invia invito" )
      )
    )
  );
};

// ─── MODAL RICHIESTA DETTAGLIO ────────────────────────────────────────────────
const RichiestaModal=({richiesta,onApprova,onRifiuta,onClose})=>{
  const [ruolo,setRuolo]=useState(richiesta.ruolo);
  const r=ruoloById(ruolo);
  return(
    React.createElement(Modal, { title: "Richiesta di accesso"  , onClose: onClose, wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9447}}
      , React.createElement('div', { style: {padding:"20px 22px",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9448}}
        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9449}}
          , React.createElement(Avatar, { initials: richiesta.nome.split(" ").map(p=>p[0]).join("").slice(0,2), hex: r.hex, size: 48, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9450}})
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9451}}
            , React.createElement('div', { style: {fontSize:16,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9452}}, richiesta.nome)
            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9453}}, richiesta.email)
            , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9454}}, "Richiesta del "  , fmt_data(richiesta.data))
          )
        )
        , React.createElement('div', { style: {background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"12px 14px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9457}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,marginBottom:6,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9458}}, "Messaggio")
          , React.createElement('div', { style: {fontSize:13,color:C.text,lineHeight:1.55}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9459}}, richiesta.messaggio)
        )
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9461}}
          , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:9}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9462}}, "Assegna ruolo" )
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9463}}
            , RUOLI.map(r=>(
              React.createElement('button', { key: r.id, onClick: ()=>setRuolo(r.id),
                style: {padding:"9px 12px",borderRadius:9,textAlign:"left",cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",transition:"all .15s",
                  background:ruolo===r.id?r.bg:C.bg,
                  border:`1.5px solid ${ruolo===r.id?r.hex:C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9465}}
                , React.createElement('div', { style: {fontSize:12,fontWeight:500,color:ruolo===r.id?r.hex:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9470}}, r.label)
              )
            ))
          )
        )
      )
      , React.createElement('div', { style: {padding:"13px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"space-between",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9476}}
        , React.createElement(Btn, { danger: true, onClick: ()=>onRifiuta(richiesta), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9477}}
          , React.createElement(Ic, { n: "x", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9478}}), "Rifiuta"
        )
        , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9480}}
          , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9481}}, "Annulla")
          , React.createElement(Btn, { onClick: ()=>onApprova(richiesta,ruolo), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9482}}
            , React.createElement(Ic, { n: "check", size: 13, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9483}}), "Approva e attiva"
          )
        )
      )
    )
  );
};

// ─── CONFIRM DELETE ───────────────────────────────────────────────────────────
const ConfirmModal=({titolo,testo,onConfirm,onClose,danger=true})=>(
  React.createElement(Modal, { title: titolo, onClose: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9493}}
    , React.createElement('div', { style: {padding:"22px 22px 14px",display:"flex",flexDirection:"column",gap:14,alignItems:"center",textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9494}}
      , React.createElement('div', { style: {width:50,height:50,borderRadius:"50%",background:danger?C.redBg:C.orangeBg,
        border:`1px solid ${danger?C.redBorder:C.orangeBorder}`,
        display:"flex",alignItems:"center",justifyContent:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9495}}
        , React.createElement(Ic, { n: "warn", size: 22, stroke: danger?C.red:C.orange, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9498}})
      )
      , React.createElement('p', { style: {fontSize:14,color:C.textMuted,lineHeight:1.6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9500}}, testo)
    )
    , React.createElement('div', { style: {padding:"14px 22px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9502}}
      , React.createElement(Btn, { variant: "secondary", onClick: onClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9503}}, "Annulla")
      , React.createElement(Btn, { danger: true, onClick: onConfirm, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9504}}, "Conferma")
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
      fontSize:11,fontWeight:500,color:r.hex,fontFamily:"'DM Sans',sans-serif",
      letterSpacing:"0.04em",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9516}}
      , r.label
    )
  );
};

const UtentiView = () => {
  const isMobile = useIsMobile();
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
      showToast(`${draft.nome} aggiornato`);
    };
    const sospendiUtente=(u)=>{
      const nuovo=u.stato==="sospeso"?"attivo":"sospeso";
      setUtenti(p=>p.map(x=>x.id===u.id?{...x,stato:nuovo}:x));
      setDrawer(null); closeModal();
      showToast(`${u.nome} ${nuovo==="sospeso"?"sospeso":"riattivato"}`,nuovo==="sospeso"?C.orange:C.green);
    };
    const eliminaUtente=(u)=>{
      setUtenti(p=>p.filter(x=>x.id!==u.id));
      setDrawer(null); closeModal();
      showToast(`${u.nome} eliminato`,C.red);
    };
    const approvaRichiesta=(req,ruolo)=>{
      const nuovo={id:uid(),nome:req.nome,email:req.email,ruolo,stato:"attivo",
        avatar:req.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),
        iscritto:new Date().toISOString().split("T")[0],
        ultimoAccesso:null,permessi:{...PERM_DEFAULT[ruolo]},note:""};
      setUtenti(p=>[...p,nuovo]);
      setRichieste(p=>p.filter(r=>r.id!==req.id));
      closeModal();
      showToast(`${req.nome} approvato come ${ruoloById(ruolo).label}`);
    };
    const rifiutaRichiesta=(req)=>{
      setRichieste(p=>p.filter(r=>r.id!==req.id));
      closeModal();
      showToast(`Richiesta di ${req.nome} rifiutata`,C.orange);
    };
    const invitaUtente=(f)=>{
      const nuovo={id:uid(),nome:f.nome,email:f.email,ruolo:f.ruolo,stato:"invitato",
        avatar:f.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(),
        iscritto:new Date().toISOString().split("T")[0],ultimoAccesso:null,
        permessi:{...PERM_DEFAULT[f.ruolo]},note:""};
      setUtenti(p=>[...p,nuovo]);
      closeModal();
      showToast(`Invito inviato a ${f.email}`,C.blue);
    };
  
    return(
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9604}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9605}}

          /* ── BARRA MODULO ── */
          , React.createElement('div', { style: {background:C.surface,borderBottom:`1px solid ${C.border}`,
            padding:"0 clamp(12px,3vw,24px)",display:"flex",alignItems:"center",
            height:52,flexShrink:0,gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9608}}
            , React.createElement(Ic, { n: "shield", size: 16, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9611}})
            , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:C.gold,letterSpacing:"0.04em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9612}}, "Utenti")
            , React.createElement('div', { style: {marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9613}}
              , React.createElement(Btn, { onClick: ()=>setModal("invita"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9614}}
                , React.createElement(Ic, { n: "plus", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9615}}), "Invita utente"
              )
            )
          )

          /* ── PAGE HEADER ── */
          , React.createElement('div', { style: {background:`linear-gradient(135deg,${C.surface} 0%,${C.bg} 100%)`,
            borderBottom:`1px solid ${C.border}`,padding:"16px 20px",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9621}}
            , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9623}}
              , React.createElement('div', { style: {animation:"fadeUp .4s ease both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9624}}
                , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,letterSpacing:"0.02em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9625}}, "Gestione "
                   , React.createElement('span', { style: {fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9626}}, "Utenti")
                )
                , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9628}}, "Accessi, ruoli e permessi per l'area riservata"

                )
              )
              /* KPI rapide */
              , React.createElement('div', { style: {display:"flex",gap:12,animation:"fadeUp .4s ease .1s both"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9633}}
                , [
                  {label:"Attivi",    val:totAttivi,   hex:C.green},
                  {label:"In attesa", val:totAttesa,   hex:C.orange},
                  {label:"Invitati",  val:totInvitati, hex:C.blue},
                  {label:"Sospesi",   val:totSospesi,  hex:C.red},
                ].map(k=>(
                  React.createElement('div', { key: k.label, style: {padding:"10px 16px",background:C.surface,
                    border:`1px solid ${C.border}`,borderRadius:10,textAlign:"center",minWidth:72}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9640}}
                    , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:k.hex}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9642}}, k.val)
                    , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.07em",textTransform:"uppercase",marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9643}}, k.label)
                  )
                ))
              )
            )
          )

          /* ── BODY ── */
          , React.createElement('div', { style: {flex:1,padding:isMobile?"12px":"20px 24px",overflow:"auto",display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9651}}

            /* Sub-tabs */
            , React.createElement('div', { style: {display:"flex",gap:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9654}}
              , [["utenti","users","Utenti",""],
                ["richieste","mail","Richieste",richieste.length>0?richieste.length:null]
              ].map(([v,ic,lb,badge])=>(
                React.createElement('button', { key: v, onClick: ()=>setTab(v),
                  style: {display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:8,
                    background:tab===v?C.goldBg:"none",border:`1px solid ${tab===v?C.goldDim:C.border}`,
                    cursor:"pointer",fontSize:13,color:tab===v?C.gold:C.textMuted,
                    fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9658}}
                  , React.createElement(Ic, { n: ic, size: 14, stroke: tab===v?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9663}}), lb
                  , badge!=null&&(
                    React.createElement('span', { style: {background:C.orange,color:C.bg,borderRadius:"10px",
                      padding:"1px 7px",fontSize:10,fontWeight:700,marginLeft:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9665}}, badge)
                  )
                )
              ))
            )

            /* ── TAB UTENTI ── */
            , tab==="utenti"&&(
              React.createElement(React.Fragment, null
                /* Filtri */
                , React.createElement('div', { style: {display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9676}}
                  , React.createElement('div', { style: {position:"relative",flex:"1 1 220px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9677}}
                    , React.createElement('span', { style: {position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9678}}
                      , React.createElement(Ic, { n: "search", size: 14, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9679}})
                    )
                    , React.createElement('input', { value: search, onChange: e=>setSearch(e.target.value),
                      placeholder: "Cerca per nome o email..."    ,
                      style: {width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.text,fontSize:13,padding:"9px 12px 9px 34px",fontFamily:"'DM Sans',sans-serif"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9681}})
                  )
                  , React.createElement('select', { value: filterRuolo, onChange: e=>setFR(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterRuolo?C.goldDim:C.border}`,
                      borderRadius:8,color:filterRuolo?C.gold:C.textMuted,fontSize:13,
                      padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9686}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9690}}, "Tutti i ruoli"  )
                    , RUOLI.map(r=>React.createElement('option', { key: r.id, value: r.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9691}}, r.label))
                  )
                  , React.createElement('select', { value: filterStato, onChange: e=>setFS(e.target.value),
                    style: {background:C.surface,border:`1px solid ${filterStato?C.goldDim:C.border}`,
                      borderRadius:8,color:filterStato?C.gold:C.textMuted,fontSize:13,
                      padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",appearance:"none",cursor:"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9693}}
                    , React.createElement('option', { value: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9697}}, "Tutti gli stati"  )
                    , STATI.map(s=>React.createElement('option', { key: s.id, value: s.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9698}}, s.label))
                  )
                  , (search||filterRuolo||filterStato)&&(
                    React.createElement('button', { onClick: ()=>{setSearch("");setFR("");setFS("");},
                      style: {background:"none",border:`1px solid ${C.border}`,borderRadius:8,
                        color:C.textMuted,fontSize:12,padding:"9px 12px",cursor:"pointer",
                        fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5,
                        transition:"all .12s"},
                      onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
                      onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9701}}
                      , React.createElement(Ic, { n: "x", size: 12, stroke: "currentColor", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9708}}), "Azzera"
                    )
                  )
                  , React.createElement('span', { style: {fontSize:12,color:C.textDim,marginLeft:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9711}}, filtrati.length, " utenti" )
                )

                /* Tabella */
                , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9715}}
                  , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"2.5fr 1.6fr 1.2fr 1.2fr 1.6fr auto",minWidth:520,
                    padding:"9px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9716}}
                    , ["Utente","Email","Ruolo","Stato","Ultimo accesso",""].map(h=>(
                      React.createElement('div', { key: h, style: {fontSize:10,color:C.textMuted,letterSpacing:"0.08em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9719}}, h)
                    ))
                  )
                  , filtrati.length===0&&(
                    React.createElement('div', { style: {padding:"40px 0",textAlign:"center",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9723}}, "Nessun utente trovato"

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
                          alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9737}}
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:11}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9742}}
                          , React.createElement(Avatar, { initials: u.avatar, hex: r.hex, size: 34, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9743}})
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9744}}
                            , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9745}}, u.nome)
                            , u.note&&React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:1,
                              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9746}}, u.note)
                          )
                        )
                        , React.createElement('div', { style: {fontSize:12,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                          paddingRight:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9750}}, u.email)
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9752}}, React.createElement(RuoloBadge, { ruolo: u.ruolo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9752}}))
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9753}}, React.createElement(Badge, { stato: u.stato, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9753}}))
                        , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:5}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9754}}
                          , u.stato==="attivo"&&(
                            React.createElement('span', { style: {width:6,height:6,borderRadius:"50%",background:C.green,
                              animation:u.ultimoAccesso&&new Date()-new Date(u.ultimoAccesso)<3600000?"pulse 2s infinite":undefined,
                              display:"inline-block",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9756}})
                          )
                          , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9760}}, oraFa(u.ultimoAccesso))
                        )
                        , React.createElement(Ic, { n: "right", size: 15, stroke: C.textDim, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9762}})
                      )
                    );
                  })
                )
              )
            )

            /* ── TAB RICHIESTE ── */
            , tab==="richieste"&&(
              React.createElement('div', { style: {display:"flex",flexDirection:"column",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9772}}
                , richieste.length===0&&(
                  React.createElement('div', { style: {background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,
                    padding:"16px 20px",display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9774}}
                    , React.createElement(Ic, { n: "check", size: 16, stroke: C.green, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9776}})
                    , React.createElement('span', { style: {fontSize:13,color:C.green,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9777}}, "Nessuna richiesta in sospeso"   )
                  )
                )
                , richieste.map((req,i)=>{
                  const r=ruoloById(req.ruolo);
                  return(
                    React.createElement('div', { key: req.id, className: "row-anim",
                      style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,
                        overflow:"hidden",animationDelay:`${i*0.07}s`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9783}}
                      , React.createElement('div', { style: {padding:"16px 20px",display:"flex",gap:14,alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9786}}
                        , React.createElement(Avatar, { initials: req.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(), hex: r.hex, size: 44, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9787}})
                        , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9788}}
                          , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9789}}
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9790}}
                              , React.createElement('div', { style: {fontSize:15,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9791}}, req.nome)
                              , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9792}}, req.email)
                            )
                            , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9794}}
                              , React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9795}}, fmt_data(req.data))
                              , React.createElement(RuoloBadge, { ruolo: req.ruolo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9796}})
                            )
                          )
                          , React.createElement('div', { style: {marginTop:10,padding:"10px 14px",background:C.bg,
                            borderRadius:8,border:`1px solid ${C.border}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9799}}
                            , React.createElement('div', { style: {fontSize:12,color:C.textMuted,lineHeight:1.55}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9801}}, req.messaggio)
                          )
                        )
                      )
                      , React.createElement('div', { style: {padding:"12px 20px",borderTop:`1px solid ${C.border}20`,
                        display:"flex",justifyContent:"flex-end",gap:8,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9805}}
                        , React.createElement(Btn, { small: true, danger: true, onClick: ()=>{setSelReq(req);setModal("confirm_rifiuta");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9807}}
                          , React.createElement(Ic, { n: "x", size: 12, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9808}}), "Rifiuta"
                        )
                        , React.createElement(Btn, { small: true, variant: "secondary", onClick: ()=>{setSelReq(req);setModal("richiesta");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9810}}
                          , React.createElement(Ic, { n: "user", size: 12, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9811}}), "Esamina"
                        )
                        , React.createElement(Btn, { small: true, onClick: ()=>approvaRichiesta(req,req.ruolo), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9813}}
                          , React.createElement(Ic, { n: "check", size: 12, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9814}}), "Approva come "  , ruoloById(req.ruolo).label
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
            onSospendi: u=>{setSelUtente(u);setModal("confirm_sospendi");},
            onElimina: u=>{setSelUtente(u);setModal("confirm_elimina");}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9827}}
          )
        )

        /* ── MODALI ── */
        , modal==="invita"&&React.createElement(InvitaModal, { onInvita: invitaUtente, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9838}})
        , modal==="richiesta"&&selReq&&(
          React.createElement(RichiestaModal, { richiesta: selReq, onApprova: approvaRichiesta, onRifiuta: r=>{rifiutaRichiesta(r);closeModal();}, onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9840}})
        )
        , modal==="confirm_sospendi"&&selUtente&&(
          React.createElement(ConfirmDel, {
            title: selUtente.stato==="sospeso"?"Riattiva account":"Sospendi account",
            testo: selUtente.stato==="sospeso"
              ?`Riattivare l'account di ${selUtente.nome}? Potrà accedere di nuovo all'area riservata.`
              :`Sospendere l'account di ${selUtente.nome}? Non potrà più accedere finché non viene riattivato.`,
            onConfirm: ()=>sospendiUtente(selUtente),
            onClose: closeModal,
            danger: selUtente.stato!=="sospeso", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9843}}
          )
        )
        , modal==="confirm_elimina"&&selUtente&&(
          React.createElement(ConfirmDel, {
            title: "Elimina utente" ,
            testo: `Eliminare definitivamente l'account di ${selUtente.nome}? L'operazione è irreversibile.`,
            onConfirm: ()=>eliminaUtente(selUtente),
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9854}}
          )
        )
        , modal==="confirm_rifiuta"&&selReq&&(
          React.createElement(ConfirmDel, {
            title: "Rifiuta richiesta" ,
            testo: `Rifiutare la richiesta di accesso di ${selReq.nome}?`,
            onConfirm: ()=>{rifiutaRichiesta(selReq);closeModal();},
            onClose: closeModal, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9862}}
          )
        )

        /* ── TOAST ── */
        , toast&&(
          React.createElement('div', { style: {position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:400,
            background:C.surface,border:`1px solid ${toast.hex}40`,borderLeft:`3px solid ${toast.hex}`,
            borderRadius:10,padding:"11px 18px",display:"flex",alignItems:"center",gap:10,
            animation:"fadeUp .25s ease",boxShadow:"0 8px 32px rgba(0,0,0,.5)",
            fontFamily:"'DM Sans',sans-serif",fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9872}}
            , React.createElement(Ic, { n: "check", size: 14, stroke: toast.hex, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9877}})
            , React.createElement('span', { style: {color:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9878}}, toast.msg)
          )
        )
      )
    );
};





// ─── DATI DOCENTI ESTESI ──────────────────────────────────────────────────────
const INIT_DOCENTI_EXT = [
  { id:"d1", nome:"Prof. Marco Rossi",   teacherKey:"Prof. Rossi",   email:"m.rossi@accademia.it",    phone:"338 1122334", strumenti:"Pianoforte · Violino",   bio:"Diplomato al Conservatorio di Milano. 15 anni di esperienza.", tariffaOra:35, contratto:"Tempo indeterminato", dataInizio:"2015-09-01", colore:C.gold    },
  { id:"d2", nome:"Prof. Luca Bianchi",  teacherKey:"Prof. Bianchi", email:"l.bianchi@accademia.it",  phone:"347 5566778", strumenti:"Chitarra · Flauto",      bio:"Specializzato in musica moderna e jazz. Masterclass annuali.", tariffaOra:35, contratto:"Tempo determinato",    dataInizio:"2018-01-15", colore:C.teal    },
  { id:"d3", nome:"Prof. Mario Verde",   teacherKey:"Prof. Verde",   email:"m.verde@accademia.it",    phone:"333 9988776", strumenti:"Batteria · Percussioni", bio:"Batterista professionista, collabora con diverse orchestre.",   tariffaOra:35, contratto:"Collaborazione",        dataInizio:"2020-03-01", colore:C.blue    },
  { id:"d4", nome:"Prof.ssa Lia Marino", teacherKey:"Prof. Marino",  email:"l.marino@accademia.it",   phone:"366 3344556", strumenti:"Canto · Solfeggio",      bio:"Soprano lirico, docente di tecnica vocale e teoria musicale.",  tariffaOra:35, contratto:"Tempo indeterminato", dataInizio:"2017-09-01", colore:C.purple  },
];

const DocentiView = ({ students:_studentsRaw, lessons:_lessonsRaw, docenti, setDocenti, annoInizioAttivo }) => {
  const isMobile = useIsMobile();
  const students = _studentsRaw || [];
  const lessons = _lessonsRaw || [];
  const [selected,  setSelected]  = useState(null);
  const [tab,       setTab]       = useState("profilo");
  const [modal,     setModal]     = useState(null); // null | "new" | "edit" | "del"
  const [draft,     setDraft]     = useState({});

  const initDoc = { nome:"", email:"", phone:"", strumenti:"", bio:"", tariffaOra:35, contratto:"Collaborazione", dataInizio:"", colore:C.gold };

  const openNew  = () => { setDraft({...initDoc}); setModal("new"); };
  const openEdit = (d) => { setDraft({...d}); setModal("edit"); };
  const saveDoc  = () => {
    if(modal==="new")  setDocenti(p=>[...p,{...draft,id:uid(),colore:draft.colore||C.gold,teacherKey:draft.teacherKey||draft.nome}]);
    if(modal==="edit") { setDocenti(p=>p.map(d=>d.id===draft.id?{...draft}:d)); if(_optionalChain([selected, 'optionalAccess', _83 => _83.id])===draft.id) setSelected({...draft}); }
    setModal(null);
  };
  const delDoc = (id) => { setDocenti(p=>p.filter(d=>d.id!==id)); if(_optionalChain([selected, 'optionalAccess', _84 => _84.id])===id) setSelected(null); setModal(null); };

  // Helpers — match tramite teacherKey (campo dedicato per corrispondenza esatta)
  const matchTeacher = (d, teacherField) => {
    if(!teacherField) return false;
    const key = d.teacherKey || d.nome;
    return teacherField === key || teacherField === d.nome;
  };
  const allievi  = (d) => students.filter(s => matchTeacher(d, s.teacher));
  const lezioniD = (d) => lessons.filter(l  => matchTeacher(d, l.teacher));

  // Calcoli mensili basati su lezioni effettive
  const nowDate   = new Date(today);
  const curYear   = nowDate.getFullYear();
  const curMonth  = nowDate.getMonth()+1;
  const prevMonth = curMonth===1 ? 12 : curMonth-1;
  const prevYear  = curMonth===1 ? curYear-1 : curYear;

  const lezioniMese = (d, m, y) => lessons.filter(l => {
    if(!matchTeacher(d, l.teacher)) return false;
    const [ly,lm] = l.date.split("-").map(Number);
    return ly===y && lm===m;
  });
  // Nota: lezioniMese già funziona per collettive perché l.teacher è sempre valorizzato
  const stipendioMese = (d, m=curMonth, y=curYear) => lezioniMese(d,m,y).length * d.tariffaOra;

  // Anno scolastico — usa il prop dall'admin (fallback: auto da data corrente)
  const annoInizio = _nullishCoalesce(annoInizioAttivo, () => ( (curMonth >= 9 ? curYear : curYear-1)));
  const MESI_AS = [
    {m:9, y:annoInizio},{m:10,y:annoInizio},{m:11,y:annoInizio},{m:12,y:annoInizio},
    {m:1, y:annoInizio+1},{m:2,y:annoInizio+1},{m:3,y:annoInizio+1},
    {m:4, y:annoInizio+1},{m:5,y:annoInizio+1},{m:6,y:annoInizio+1},
  ];
  const isFuture = (x) => new Date(x.y, x.m-1, 1) > new Date(curYear, curMonth-1, 1);
  const defaultSelMese = MESI_AS.find(x=>x.m===curMonth && x.y===curYear) || MESI_AS[MESI_AS.length-1];
  // ← useState QUI, prima di qualsiasi return condizionale
  const [selMese, setSelMese] = useState(defaultSelMese);

  // FormModal inline JSX (evita re-mount su ogni keystroke)
  const formModalJSX = (modal && modal !== "del") ? (
    React.createElement(Modal, { title: modal==="new"?"Nuovo docente":"Modifica docente", onClose: ()=>setModal(null), wide: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9955}}
      , React.createElement('div', { style: {padding:24,display:"flex",flexDirection:"column",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9956}}
        , React.createElement('div', { className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9957}}
          , React.createElement(Input, { label: "Nome completo *"  , value: draft.nome||"", onChange: e=>setDraft(p=>({...p,nome:e.target.value})), placeholder: "Prof. Nome Cognome"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9958}})
          , React.createElement(Input, { label: "Email", type: "email", value: draft.email||"", onChange: e=>setDraft(p=>({...p,email:e.target.value})), placeholder: "nome@accademia.it", __self: this, __source: {fileName: _jsxFileName, lineNumber: 9959}})
          , React.createElement(Input, { label: "Telefono", value: draft.phone||"", onChange: e=>setDraft(p=>({...p,phone:e.target.value})), placeholder: "333 0000000" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9960}})
          , React.createElement(Input, { label: "Strumenti", value: draft.strumenti||"", onChange: e=>setDraft(p=>({...p,strumenti:e.target.value})), placeholder: "Pianoforte · Chitarra"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9961}})
          , React.createElement(Input, { label: "Tariffa oraria (€)"  , type: "number", value: draft.tariffaOra||35, onChange: e=>setDraft(p=>({...p,tariffaOra:+e.target.value})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9962}})
          , React.createElement(Sel, { label: "Tipo contratto" , value: draft.contratto||"", onChange: e=>setDraft(p=>({...p,contratto:e.target.value})),
            options: ["Tempo indeterminato","Tempo determinato","Collaborazione","Partita IVA"], __self: this, __source: {fileName: _jsxFileName, lineNumber: 9963}})
          , React.createElement(Input, { label: "Data inizio" , type: "date", value: draft.dataInizio||"", onChange: e=>setDraft(p=>({...p,dataInizio:e.target.value})), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9965}})
        )
        , React.createElement(Textarea, { label: "Biografia", value: draft.bio||"", onChange: e=>setDraft(p=>({...p,bio:e.target.value})), placeholder: "Formazione, esperienza..." , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9967}})
      )
      , React.createElement('div', { style: {padding:"14px 24px",borderTop:`1px solid ${C.border}`,position:"sticky",bottom:0,background:C.surface,zIndex:2,paddingBottom:"env(safe-area-inset-bottom,12px)",display:"flex",justifyContent:"flex-end",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9969}}
        , React.createElement(Btn, { variant: "secondary", onClick: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9970}}, "Annulla")
        , React.createElement(Btn, { onClick: saveDoc, disabled: !_optionalChain([draft, 'access', _85 => _85.nome, 'optionalAccess', _86 => _86.trim, 'call', _87 => _87()]), __self: this, __source: {fileName: _jsxFileName, lineNumber: 9971}}, React.createElement(Ic, { n: "check", size: 14, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9971}}), "Salva")
      )
    )
  ) : null;

  // ── VISTA LISTA ──────────────────────────────────────────────────────────────
  if (!selected) return (
    React.createElement('div', { style: {maxWidth:1100,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9978}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9979}}
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9980}}
          , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9981}}, "Docenti")
          , React.createElement('p', { style: {fontSize:13,color:C.textMuted,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9982}}
            , docenti.length, " docenti"
          )
        )
        , React.createElement(Btn, { onClick: openNew, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9986}}, React.createElement(Ic, { n: "plus", size: 15, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9986}}), "Nuovo docente" )
      )

      , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9989}}
        , docenti.map(d=>{
          const all = allievi(d);
          return (
            React.createElement('div', { key: d.id, onClick: ()=>{setSelected(d);setTab("profilo");},
              style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,
                padding:22,cursor:"pointer",transition:"all 0.18s",borderTop:`3px solid ${d.colore}30`},
              onMouseEnter: e=>{e.currentTarget.style.borderColor=d.colore;e.currentTarget.style.borderTopColor=d.colore;},
              onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.borderTopColor=d.colore+"30";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9993}}
              , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9998}}
                , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9999}}
                  , React.createElement(Avatar, { initials: d.nome.replace("Prof.ssa ","").replace("Prof. ","").split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(), hex: d.colore, size: 44, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10000}})
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10001}}
                    , React.createElement('div', { style: {fontSize:15,fontWeight:600,marginBottom:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10002}}, d.nome)
                    , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10003}}, d.strumenti)
                  )
                )
                , React.createElement('button', { onClick: e=>{e.stopPropagation();openEdit(d);},
                  style: {background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:6,color:C.textMuted},
                  onMouseEnter: ev=>ev.currentTarget.style.background=C.bg,
                  onMouseLeave: ev=>ev.currentTarget.style.background="none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10006}}
                  , React.createElement(Ic, { n: "edit", size: 15, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10010}})
                )
              )
              , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10013}}
                , [
                  {label:"Allievi",  value:all.length,                                      hex:d.colore},
                  {label:"Lez/mese", value:lezioniMese(d,curMonth,curYear).length,            hex:_optionalChain([selected, 'optionalAccess', _88 => _88.id])===d.id?d.colore:C.textMuted},
                  {label:"Compenso",  value:`€${stipendioMese(d).toLocaleString("it-IT")}`,    hex:C.green},
                ].map(s=>(
                  React.createElement('div', { key: s.label, style: {textAlign:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10019}}
                    , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:s.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10020}}, s.value)
                    , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:3}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10021}}, s.label)
                  )
                ))
              )
              , React.createElement('div', { style: {marginTop:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10025}}
                , React.createElement('span', { style: {fontSize:11,color:C.textDim,background:C.bg,borderRadius:4,padding:"3px 8px",border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10026}}
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
  ];
  const stip = stipendioMese(selected);


  // Dati del mese selezionato
  const lezSel   = lezioniMese(selected, selMese.m, selMese.y);
  const lezPrevM = selMese.m===1 ? 12 : selMese.m-1;
  const lezPrevY = selMese.m===1 ? selMese.y-1 : selMese.y;
  const lezPrev  = lezioniMese(selected, lezPrevM, lezPrevY);
  const stipSel  = lezSel.length * selected.tariffaOra;
  const stipPrev = lezPrev.length * selected.tariffaOra;

  // andamento anno scolastico (tutte le lezioni per il grafico)
  const andamento = MESI_AS.map(x => {
    const n = lezioniMese(selected, x.m, x.y).length;
    return { label:MESI_LABEL_S[x.m-1], n, comp:n*selected.tariffaOra, m:x.m, y:x.y,
             isSel: x.m===selMese.m && x.y===selMese.y, isFut: isFuture(x) };
  });
  const maxN = Math.max(...andamento.map(x=>x.n), 1);

  // Selettore mese UI
  const MeseSelector = () => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:20}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10071}}
      , React.createElement('div', { style: {fontSize:10,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10072}}, "Anno scolastico "
          , annoInizio, "/", String(annoInizio+1).slice(-2)
      )
      , React.createElement('div', { style: {display:"flex",gap:6,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10075}}
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
                transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10081}}
              , MESI_LABEL_S[x.m-1]
              , hasD && !isF && React.createElement('span', { style: {display:"inline-block",width:4,height:4,borderRadius:"50%",
                background:isS?C.bg:selected.colore,marginLeft:5,verticalAlign:"middle"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10090}})
            )
          );
        })
      )
    )
  );

  // Grafico andamento anno scolastico (barre cliccabili)
  const GraficoAS = ({tipo="lezioni"}) => (
    React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10101}}
      , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10102}}
        , React.createElement('div', { style: {fontSize:11,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10103}}, "Andamento anno scolastico"

        )
        , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10106}}
          , tipo==="lezioni"
            ? `Totale: ${andamento.reduce((t,x)=>t+x.n,0)} lezioni`
            : `Totale: €${andamento.reduce((t,x)=>t+x.comp,0).toLocaleString("it-IT")}`
        )
      )
      , React.createElement('div', { style: {display:"flex",alignItems:"flex-end",gap:4,height:80}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10112}}
        , andamento.map(x=>(
          React.createElement('div', { key: `${x.y}-${x.m}`, onClick: ()=>!x.isFut&&setSelMese({m:x.m,y:x.y}),
            style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,
              cursor:x.isFut?"default":"pointer"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10114}}
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?selected.colore:C.textDim,fontWeight:x.isSel?700:400,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10117}}
              , tipo==="lezioni"?(x.isFut?"":x.n):(x.isFut?"":x.n>0?`${(x.comp/1000).toFixed(1)}k`:"")
            )
            , React.createElement('div', { style: {width:"100%",borderRadius:"3px 3px 0 0",
              background: x.isFut ? C.border : x.isSel ? selected.colore : `${selected.colore}45`,
              height:`${x.isFut ? 4 : Math.round((x.n/maxN)*60)+4}px`,
              minHeight:4,transition:"all 0.2s",
              outline: x.isSel ? `2px solid ${selected.colore}` : "none", outlineOffset:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10120}})
            , React.createElement('div', { style: {fontSize:9,color:x.isSel?selected.colore:C.textDim,textTransform:"uppercase",
              fontWeight:x.isSel?700:400}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10125}}, x.label)
          )
        ))
      )
    )
  );

  return (
    React.createElement('div', { style: {maxWidth:1100,margin:"0 auto",padding:"clamp(12px, 3vw, 32px)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10134}}
      , React.createElement('button', { onClick: ()=>setSelected(null),
        style: {display:"flex",alignItems:"center",gap:6,background:"none",border:"none",
          cursor:"pointer",color:C.textMuted,fontSize:13,fontFamily:"'DM Sans',sans-serif",marginBottom:20,padding:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10135}}
        , React.createElement(Ic, { n: "left", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10138}}), "Tutti i docenti"
      )

      /* Header card */
      , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,marginBottom:24,
        padding:"16px 20px",borderTop:`3px solid ${selected.colore}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10142}}
        , React.createElement('div', { style: {display:"flex",justifyContent:"space-between",alignItems:"flex-start"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10144}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10145}}
            , React.createElement(Avatar, { initials: selected.nome.replace("Prof.ssa ","").replace("Prof. ","").split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase(), hex: selected.colore, size: 56, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10146}})
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10147}}
              , React.createElement('h1', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10148}}, selected.nome)
              , React.createElement('div', { style: {fontSize:13,color:C.textMuted,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10149}}, selected.strumenti)
              , React.createElement('div', { style: {display:"flex",gap:8,flexWrap:"wrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10150}}
                , React.createElement('span', { style: {fontSize:11,background:C.goldBg,color:C.gold,border:`1px solid ${C.goldDim}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10151}}, selected.contratto)
                , selected.dataInizio && React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10152}}, "Dal " , new Date(selected.dataInizio+"T00:00:00").toLocaleDateString("it-IT",{month:"long",year:"numeric"}))
              )
            )
          )
          , React.createElement('div', { style: {display:"flex",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10156}}
            , React.createElement(Btn, { small: true, variant: "secondary", onClick: ()=>openEdit(selected), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10157}}, React.createElement(Ic, { n: "edit", size: 13, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10157}}), "Modifica")
            , React.createElement(Btn, { small: true, danger: true, onClick: ()=>setModal("del"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10158}}, React.createElement(Ic, { n: "trash", size: 13, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10158}}))
          )
        )
        /* KPI strip — dati mese selezionato */
        , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginTop:20,paddingTop:20,borderTop:`1px solid ${C.border}`}, className: "stat-strip", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10162}}
          , [
            {label:"Allievi totali",  value:all.length,                          hex:selected.colore},
            {label:`Lez. ${MESI_LABEL_S[selMese.m-1]}`, value:lezSel.length,    hex:C.textMuted},
            {label:"Tariffa/ora",     value:`€${selected.tariffaOra}`,           hex:C.gold},
            {label:`Compenso ${MESI_LABEL_S[selMese.m-1]}`, value:`€${stipSel.toLocaleString("it-IT")}`, hex:C.green},
          ].map(k=>(
            React.createElement('div', { key: k.label, style: {background:C.bg,borderRadius:10,padding:"12px 16px",border:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10169}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:k.hex,lineHeight:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10170}}, k.value)
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10171}}, k.label)
            )
          ))
        )
      )

      /* Tabs */
      , React.createElement('div', { style: {display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:22}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10178}}
        , TABS.map(t=>(
          React.createElement('button', { key: t.id, onClick: ()=>setTab(t.id),
            style: {display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:"none",
              border:"none",borderBottom:`2px solid ${tab===t.id?selected.colore:"transparent"}`,
              color:tab===t.id?selected.colore:C.textMuted,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",fontSize:13,transition:"all 0.15s",marginBottom:-1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10180}}
            , React.createElement(Ic, { n: t.icon, size: 13, stroke: tab===t.id?selected.colore:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10185}}), t.label
          )
        ))
      )

      /* ── PROFILO ── */
      , tab==="profilo" && (
        React.createElement('div', { style: {display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}, className: "form-2col", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10192}}
          , [
            {label:"Email",    value:selected.email||"—", icon:"mail"},
            {label:"Telefono", value:selected.phone||"—", icon:"phone"},
            {label:"Strumenti insegnati", value:selected.strumenti||"—", icon:"music"},
            {label:"Tipo contratto",      value:selected.contratto||"—", icon:"tag"},
            {label:"Tariffa oraria",      value:`€${selected.tariffaOra}/h`, icon:"euro"},
            {label:"Data inizio",         value:selected.dataInizio||"—", icon:"calendar"},
          ].map(f=>(
            React.createElement('div', { key: f.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10201}}
              , React.createElement('div', { style: {width:34,height:34,borderRadius:8,background:C.goldBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10202}}
                , React.createElement(Ic, { n: f.icon, size: 15, stroke: C.gold, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10203}})
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10205}}
                , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10206}}, f.label)
                , React.createElement('div', { style: {fontSize:14,fontWeight:500,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10207}}, f.value)
              )
            )
          ))
          , selected.bio && (
            React.createElement('div', { style: {gridColumn:"1/-1",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10212}}
              , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10213}}, "Biografia")
              , React.createElement('p', { style: {fontSize:13,color:C.textMuted,lineHeight:1.7}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10214}}, selected.bio)
            )
          )
        )
      )

      /* ── ALLIEVI ── */
      , tab==="allievi" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10222}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10223}})
          , React.createElement(GraficoAS, { tipo: "lezioni", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10224}})
          /* Allievi con lezioni nel mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10226}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10227}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10228}}
                , React.createElement(Ic, { n: "users", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10229}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10230}}, "Allievi — "
                    , MESI_LABEL_L[selMese.m-1], " " , selMese.y
                )
              )
              , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10234}}
                , [...new Set(lezSel.flatMap(l=>isColl(l)?(l.students||[]).map(s=>s.name):[l.student]))].length, " su "  , all.length, " totali"
              )
            )
            , all.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textMuted,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10239}}, "Nessun allievo assegnato"  )
            ) : (
              all.map((s,i)=>{
                const lezS = lezSel.filter(l=>studentInLesson(l,s.name));
                const attPres = lezS.filter(l=>l.attendance==="presente").length;
                const attAss  = lezS.filter(l=>l.attendance==="assente").length;
                const hasMese = lezS.length > 0;
                return (
                  React.createElement('div', { key: s.id, style: {display:"flex",alignItems:"center",gap:14,
                    padding:"14px 18px",borderBottom:i<all.length-1?`1px solid ${C.border}`:"none",
                    opacity: hasMese ? 1 : 0.45}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10247}}
                    , React.createElement(Avatar, { initials: s.name.split(" ").map(p=>p[0]).join("").slice(0,2), hex: selected.colore, size: 36, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10250}})
                    , React.createElement('div', { style: {flex:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10251}}
                      , React.createElement('div', { style: {fontSize:14,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10252}}, s.name)
                      , React.createElement('div', { style: {fontSize:12,color:C.textMuted,marginTop:2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10253}}, s.instrument, " · "  , s.level)
                    )
                    , React.createElement('div', { style: {textAlign:"center",minWidth:60}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10255}}
                      , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:hasMese?selected.colore:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10256}}, lezS.length)
                      , React.createElement('div', { style: {fontSize:10,color:C.textDim,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10257}}, "lezioni")
                    )
                    , hasMese && (
                      React.createElement('div', { style: {display:"flex",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10260}}
                        , attPres>0 && React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10261}}, attPres, "P")
                        , attAss>0  && React.createElement('span', { style: {fontSize:11,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 7px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10262}}, attAss, "A")
                      )
                    )
                    , React.createElement(Badge, { stato: s.status, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10265}})
                    , React.createElement('div', { style: {textAlign:"right",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10266}}
                      , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:C.gold}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10267}}, "€", s.monthlyFee, "/mese")
                    )
                  )
                );
              })
            )
          )
          /* Riepilogo tutti i mesi */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,marginTop:16,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10275}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10276}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10277}}, "Riepilogo anno scolastico"  )
            )
            , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(5,1fr)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10279}}
              , MESI_AS.map((x,i)=>{
                const n = lezioniMese(selected,x.m,x.y).length;
                const isS = x.m===selMese.m&&x.y===selMese.y;
                const isF = isFuture(x);
                return (
                  React.createElement('div', { key: i, onClick: ()=>!isF&&setSelMese(x),
                    style: {padding:"14px 16px",borderRight:i%5!==4?`1px solid ${C.border}`:"none",
                      borderBottom:i<5?`1px solid ${C.border}`:"none",
                      background:isS?`${selected.colore}15`:"transparent",
                      cursor:isF?"default":"pointer",opacity:isF?0.4:1,
                      transition:"background 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10285}}
                    , React.createElement('div', { style: {fontSize:10,color:isS?selected.colore:C.textDim,textTransform:"uppercase",marginBottom:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10291}}, MESI_LABEL_S[x.m-1])
                    , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:isF?C.textDim:n>0?selected.colore:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10292}}, isF?"—":n)
                    , React.createElement('div', { style: {fontSize:10,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10293}}, isF?"":n===1?"lezione":"lezioni")
                  )
                );
              })
            )
          )
        )
      )

      /* ── LEZIONI ── */
      , tab==="lezioni" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10304}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10305}})
          , React.createElement(GraficoAS, { tipo: "lezioni", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10306}})
          /* Lista lezioni mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10308}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10309}}
              , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10310}}
                , React.createElement(Ic, { n: "calendar", size: 14, stroke: C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10311}})
                , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10312}}
                  , MESI_LABEL_L[selMese.m-1], " " , selMese.y
                )
              )
              , React.createElement('div', { style: {display:"flex",gap:12,alignItems:"center"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10316}}
                , React.createElement('span', { style: {fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10317}}, lezSel.length, " lezioni" )
                , lezSel.filter(l=>l.attendance==="presente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.greenBg,color:C.green,border:`1px solid ${C.greenBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10319}}
                    , lezSel.filter(l=>l.attendance==="presente").length, " pres."
                  )
                )
                , lezSel.filter(l=>l.attendance==="assente").length>0 && (
                  React.createElement('span', { style: {fontSize:11,background:C.redBg,color:C.red,border:`1px solid ${C.redBorder}`,borderRadius:4,padding:"2px 8px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10324}}
                    , lezSel.filter(l=>l.attendance==="assente").length, " ass."
                  )
                )
              )
            )
            , lezSel.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"48px 0",color:C.textMuted,fontSize:14}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10331}}
                , isFuture(selMese) ? "Mese non ancora iniziato" : "Nessuna lezione registrata"
              )
            ) : (
              lezSel.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.hour.localeCompare(b.hour)).map((l,i)=>{
                const insHex2 = (typeof INS_HEX !== "undefined" && INS_HEX[l.instrument]) || C.gold;
                return (
                  React.createElement('div', { key: l.id, style: {display:"grid",gridTemplateColumns:"90px 1fr 1fr auto",gap:12,alignItems:"center",
                    padding:"12px 20px",borderBottom:i<lezSel.length-1?`1px solid ${C.border}`:"none",
                    borderLeft:`3px solid ${isColl(l)?C.purple:"transparent"}`,
                    background:isColl(l)?`${C.purple}06`:"transparent"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10338}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10342}}
                      , React.createElement('div', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10343}}, new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}))
                      , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:isColl(l)?C.purple:selected.colore}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10344}}, l.hour)
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10346}}
                      , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10347}}
                        , React.createElement('span', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10348}}
                          , isColl(l)?l.courseName:l.student
                        )
                        , isColl(l) && React.createElement('span', { style: {fontSize:10,background:C.purpleBg,color:C.purple,
                          border:`1px solid ${C.purpleBorder}`,borderRadius:4,padding:"1px 6px",letterSpacing:"0.05em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10351}}, "collettiva")
                      )
                      , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10354}}
                        , isColl(l)
                          ? `${(l.students||[]).length} allievi`
                          : l.topic||"—"
                      )
                    )
                    , React.createElement('div', { style: {fontSize:12,color:isColl(l)?C.purple:insHex2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10360}}
                      , isColl(l)?`${l.room||"—"}`:`${l.instrument} · ${l.room||"—"}`
                    )
                    , l.attendance
                      ? React.createElement(Badge, { label: l.attendance, color: l.attendance==="presente"?"green":l.attendance==="assente"?"red":"gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10364}})
                      : React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10365}}, "—")
                    
                  )
                );
              })
            )
          )
          /* Tabella riepilogo anno */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,marginTop:16,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10373}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10374}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10375}}, "Riepilogo anno scolastico"  )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10377}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10378}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10379}}
                  , ["Mese","Lezioni","Presenti","Assenti","Tasso pres."].map(h=>(
                    React.createElement('th', { key: h, style: {padding:"10px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10381}}, h)
                  ))
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10385}}
                , MESI_AS.map((x,i)=>{
                  const lm = lezioniMese(selected,x.m,x.y);
                  const pres = lm.filter(l=>l.attendance==="presente").length;
                  const ass  = lm.filter(l=>l.attendance==="assente").length;
                  const tasso = lm.length>0 ? Math.round((pres/lm.filter(l=>l.attendance).length||0)*100) : null;
                  const isS  = x.m===selMese.m&&x.y===selMese.y;
                  const isF  = isFuture(x);
                  return (
                    React.createElement('tr', { key: i, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:i<MESI_AS.length-1?`1px solid ${C.border}`:"none",
                        background:isS?`${selected.colore}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${selected.colore}12`:"transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10394}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?selected.colore:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10400}}
                        , MESI_LABEL_L[x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10403}}
                        , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:isF?C.textDim:lm.length>0?selected.colore:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10404}}
                          , isF?"—":lm.length
                        )
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10408}}, isF?"—":pres||"—")
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:ass>0?C.red:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10409}}, isF?"—":ass||"—")
                      , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10410}}
                        , !isF && tasso!==null && !isNaN(tasso) ? (
                          React.createElement('div', { style: {display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10412}}
                            , React.createElement('div', { style: {flex:1,height:4,background:C.border,borderRadius:2,maxWidth:60}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10413}}
                              , React.createElement('div', { style: {height:"100%",borderRadius:2,background:tasso>=80?C.green:tasso>=60?C.gold:C.red,width:`${tasso}%`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10414}})
                            )
                            , React.createElement('span', { style: {fontSize:12,color:tasso>=80?C.green:tasso>=60?C.gold:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10416}}, tasso, "%")
                          )
                        ) : React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10418}}, "—")
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10424}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10425}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10426}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10427}}
                    , React.createElement('span', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:selected.colore}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10428}}
                      , andamento.reduce((t,x)=>t+x.n,0)
                    )
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10432}}, andamento.reduce((t,x)=>t+lezioniMese(selected,x.m,x.y).filter(l=>l.attendance==="presente").length,0))
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,color:C.red}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10433}}, andamento.reduce((t,x)=>t+lezioniMese(selected,x.m,x.y).filter(l=>l.attendance==="assente").length,0))
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10434}}, "—")
                )
              )
            )
          )
        )
      )

      /* ── COMPENSO ── */
      , tab==="compenso" && (
        React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10444}}
          , React.createElement(MeseSelector, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10445}})
          , React.createElement(GraficoAS, { tipo: "compenso", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10446}})
          /* KPI mese selezionato */
          , React.createElement('div', { style: {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10448}}
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
              React.createElement('div', { key: k.label, style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",borderTop:`3px solid ${k.hex}30`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10460}}
                , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:k.hex,lineHeight:1,marginBottom:6}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10461}}, k.value)
                , React.createElement('div', { style: {fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.07em"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10462}}, k.label)
                , React.createElement('div', { style: {fontSize:11,color:C.textDim,marginTop:4}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10463}}, k.desc)
              )
            ))
          )
          /* Dettaglio lezioni mese selezionato */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:16}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10468}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10469}}
              , React.createElement('span', { style: {fontSize:12,color:C.textMuted,letterSpacing:"0.07em",textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10470}}, "Dettaglio "
                 , MESI_LABEL_L[selMese.m-1], " " , selMese.y
              )
              , React.createElement('span', { style: {fontSize:13,color:C.green,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10473}}, "€", stipSel.toLocaleString("it-IT"))
            )
            , lezSel.length===0 ? (
              React.createElement('div', { style: {textAlign:"center",padding:"32px 0",color:C.textDim,fontSize:13}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10476}}
                , isFuture(selMese)?"Mese non ancora iniziato":"Nessuna lezione registrata questo mese"
              )
            ) : (
              lezSel.slice().sort((a,b)=>a.date.localeCompare(b.date)).map((l,i)=>(
                React.createElement('div', { key: l.id, style: {display:"grid",gridTemplateColumns:"90px 1fr auto",gap:12,alignItems:"center",
                  padding:"11px 20px",borderBottom:i<lezSel.length-1?`1px solid ${C.border}`:"none"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10481}}
                  , React.createElement('div', { style: {fontSize:12,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10483}}
                    , new Date(l.date+"T00:00:00").toLocaleDateString("it-IT",{day:"2-digit",month:"2-digit"}), " " , l.hour
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10486}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10487}}, l.student)
                    , React.createElement('div', { style: {fontSize:11,color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10488}}, l.topic||"—")
                  )
                  , React.createElement('div', { style: {textAlign:"right",display:"flex",alignItems:"center",gap:8}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10490}}
                    , React.createElement('div', { style: {fontSize:13,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10491}}, "€", selected.tariffaOra)
                    , l.attendance && React.createElement(Badge, { label: l.attendance, color: l.attendance==="presente"?"green":l.attendance==="assente"?"red":"gold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10492}})
                  )
                )
              ))
            )
          )
          /* Tabella compensi anno scolastico */
          , React.createElement('div', { style: {background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10499}}
            , React.createElement('div', { style: {padding:"14px 20px",borderBottom:`1px solid ${C.border}`}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10500}}
              , React.createElement('span', { style: {fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10501}}, "Compensi anno scolastico"  )
            )
            , React.createElement('table', { style: {width:"100%",borderCollapse:"collapse"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10503}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10504}}
                , React.createElement('tr', { style: {borderBottom:`1px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10505}}
                  , ["Mese","Lezioni","Compenso","vs mese prec."].map(h=>(
                    React.createElement('th', { key: h, style: {padding:"10px 18px",textAlign:"left",fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",color:C.textMuted,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10507}}, h)
                  ))
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10511}}
                , MESI_AS.map((x,i)=>{
                  const pm = x.m===1?12:x.m-1, py = x.m===1?x.y-1:x.y;
                  const n  = lezioniMese(selected,x.m,x.y).length;
                  const np = lezioniMese(selected,pm,py).length;
                  const c  = n * selected.tariffaOra;
                  const delta = n - np;
                  const isS  = x.m===selMese.m&&x.y===selMese.y;
                  const isF  = isFuture(x);
                  return (
                    React.createElement('tr', { key: i, onClick: ()=>!isF&&setSelMese(x),
                      style: {borderBottom:i<MESI_AS.length-1?`1px solid ${C.border}`:"none",
                        background:isS?`${selected.colore}12`:"transparent",
                        cursor:isF?"default":"pointer",opacity:isF?0.45:1,transition:"background 0.12s"},
                      onMouseEnter: e=>{if(!isF&&!isS)e.currentTarget.style.background=C.surfaceHover;},
                      onMouseLeave: e=>{e.currentTarget.style.background=isS?`${selected.colore}12`:"transparent";}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10521}}
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:13,fontWeight:isS?600:400,color:isS?selected.colore:C.text}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10527}}
                        , MESI_LABEL_L[x.m-1], " " , x.y
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:isF?C.textDim:n>0?selected.colore:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10530}}
                        , isF?"—":n
                      )
                      , React.createElement('td', { style: {padding:"11px 18px",fontSize:14,fontWeight:600,color:isF?C.textDim:n>0?C.green:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10533}}
                        , isF?"—":n>0?`€${c.toLocaleString("it-IT")}`:"—"
                      )
                      , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10536}}
                        , !isF && np>0 && (
                          React.createElement('span', { style: {fontSize:12,color:delta>0?C.green:delta<0?C.red:C.textDim,fontWeight:500}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10538}}
                            , delta>0?`+${delta}`:delta<0?delta:"="
                          )
                        )
                        , !isF && np===0 && n>0 && React.createElement('span', { style: {fontSize:11,color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10542}}, "primo mese" )
                        , isF && React.createElement('span', { style: {color:C.textDim}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10543}}, "—")
                      )
                    )
                  );
                })
              )
              , React.createElement('tfoot', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10549}}
                , React.createElement('tr', { style: {borderTop:`2px solid ${C.border}`,background:C.bg}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10550}}
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:12,color:C.textMuted,fontWeight:600}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10551}}, "TOTALE ANNO" )
                  , React.createElement('td', { style: {padding:"11px 18px",fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,color:selected.colore}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10552}}
                    , andamento.reduce((t,x)=>t+x.n,0)
                  )
                  , React.createElement('td', { style: {padding:"11px 18px",fontSize:14,fontWeight:600,color:C.green}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10555}}, "€"
                    , andamento.reduce((t,x)=>t+x.comp,0).toLocaleString("it-IT")
                  )
                  , React.createElement('td', { style: {padding:"11px 18px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10558}})
                )
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
          onClose: ()=>setModal(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10569}}
        )
      )
    )
  );
};
// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id:"dashboard",   label:"Dashboard",    icon:"grid"     },
  { id:"allievi",     label:"Allievi",      icon:"users"    },
  { id:"docenti",     label:"Docenti",      icon:"user"     },
  { id:"corsi",       label:"Corsi",        icon:"courses"  },
  { id:"calendario",  label:"Calendario",   icon:"calendar" },
  { id:"concerti",    label:"Concerti",     icon:"mic"      },
  { id:"contabilita", label:"Contabilità",  icon:"euro"     },
  { id:"repertorio",  label:"Repertorio",   icon:"music"    },
  { id:"utenti",      label:"Utenti",       icon:"shield"   },
];

const Sidebar = ({ current, setView, user, onLogout }) => {
  const ruoloHex = {admin:C.gold, direttore:C.purple, segreteria:C.blue, docente:C.teal}[_optionalChain([user, 'optionalAccess', _89 => _89.ruolo])] || C.gold;
  const ini = _optionalChain([user, 'optionalAccess', _90 => _90.nome]) ? user.nome.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() : "??";
  // Primary nav items shown in bottom bar (most used)
  const BOTTOM_ITEMS = NAV_ITEMS.slice(0, 5);
  return (
    React.createElement(React.Fragment, null
      /* ── Desktop sidebar ── */
      , React.createElement('div', { className: "sidebar-desktop", style: {width:220,background:C.surface,borderRight:`1px solid ${C.border}`,
        display:"flex",flexDirection:"column",height:"100vh",flexShrink:0,overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10602}}
        /* Logo */
        , React.createElement('div', { style: {padding:"18px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10605}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10606}}
            , React.createElement('div', { style: {width:32,height:32,borderRadius:8,background:C.gold,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10607}}
              , React.createElement(Ic, { n: "music", size: 15, stroke: C.bg, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10609}})
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10611}}
              , React.createElement('div', { style: {fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,lineHeight:1.2}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10612}}, "Accademia Musicale"

              )
              , React.createElement('div', { style: {fontSize:9,color:C.textDim,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10615}}, "gestionale"

              )
            )
          )
        )
        /* Navigation */
        , React.createElement('nav', { style: {flex:1,padding:"10px 8px",overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10622}}
          , NAV_ITEMS.map(item => {
            const active = current === item.id;
            return (
              React.createElement('button', { key: item.id, onClick: ()=>setView(item.id),
                style: {width:"100%",display:"flex",alignItems:"center",gap:10,
                  padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",
                  background:active?C.goldBg:"transparent",
                  color:active?C.gold:C.textMuted,
                  fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:active?500:400,
                  textAlign:"left",transition:"all 0.15s",marginBottom:1,
                  borderLeft:active?`2px solid ${C.gold}`:"2px solid transparent"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10626}}
                , React.createElement(Ic, { n: item.icon, size: 15, stroke: active?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10634}})
                , item.label
              )
            );
          })
        )
        /* User profile */
        , React.createElement('div', { style: {padding:"12px 14px",borderTop:`1px solid ${C.border}`,flexShrink:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10641}}
          , React.createElement('div', { style: {display:"flex",alignItems:"center",gap:10,marginBottom:10}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10642}}
            , React.createElement(Avatar, { initials: ini, hex: ruoloHex, size: 32, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10643}})
            , React.createElement('div', { style: {flex:1,minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10644}}
              , React.createElement('div', { style: {fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10645}}
                , _optionalChain([user, 'optionalAccess', _91 => _91.nome]) || "Utente"
              )
              , React.createElement('div', { style: {fontSize:10,color:ruoloHex,textTransform:"capitalize",marginTop:1}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10648}}
                , _optionalChain([user, 'optionalAccess', _92 => _92.ruolo]) || "—"
              )
            )
          )
          , React.createElement('button', { onClick: onLogout,
            style: {width:"100%",padding:"7px 0",borderRadius:7,border:`1px solid ${C.border}`,
              background:"transparent",color:C.textMuted,fontSize:12,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"},
            onMouseEnter: e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;},
            onMouseLeave: e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10653}}, "Esci"

          )
        )
      )

      /* ── Mobile bottom navigation bar ── */
      , React.createElement('div', { className: "bottom-nav", style: {
        position:"fixed",bottom:0,left:0,right:0,zIndex:300,
        background:C.surface,borderTop:`1px solid ${C.border}`,
        display:"none", // hidden by default, shown by CSS on mobile
        justifyContent:"space-around",alignItems:"center",
        height:60,padding:"0 4px",gap:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10666}}
        , BOTTOM_ITEMS.map(item => {
          const active = current === item.id;
          return (
            React.createElement('button', { key: item.id, onClick: ()=>setView(item.id),
              style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                justifyContent:"center",gap:3,border:"none",background:"transparent",
                cursor:"pointer",padding:"6px 2px",
                color:active?C.gold:C.textMuted,transition:"all 0.15s"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10675}}
              , React.createElement(Ic, { n: item.icon, size: 20, stroke: active?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10680}})
              , React.createElement('span', { style: {fontSize:9,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif",
                fontWeight:active?600:400,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10681}}
                , item.label.slice(0,6)
              )
            )
          );
        })
        /* "Altro" button for remaining items */
        , React.createElement(MobileMoreMenu, { current: current, setView: setView, extraItems: NAV_ITEMS.slice(5), onLogout: onLogout, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10689}})
      )
    )
  );
};

const MobileMoreMenu = ({ current, setView, extraItems, onLogout }) => {
  const [open, setOpen] = useState(false);
  const activeExtra = extraItems.some(i => i.id === current);
  return (
    React.createElement(React.Fragment, null
      , React.createElement('button', { onClick: ()=>setOpen(v=>!v),
        style: {flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",gap:3,border:"none",background:"transparent",
          cursor:"pointer",padding:"6px 2px",
          color:activeExtra?C.gold:C.textMuted}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10700}}
        , React.createElement(Ic, { n: "grid", size: 20, stroke: activeExtra?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10705}})
        , React.createElement('span', { style: {fontSize:9,letterSpacing:"0.04em",fontFamily:"'DM Sans',sans-serif",
          fontWeight:activeExtra?600:400,textTransform:"uppercase"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10706}}, "Altro")
      )
      , open && (
        React.createElement('div', { style: {position:"fixed",bottom:60,left:0,right:0,zIndex:400,
          background:C.surface,borderTop:`1px solid ${C.border}`,
          padding:"8px 0",boxShadow:"0 -4px 20px rgba(0,0,0,0.5)"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10710}}
          , extraItems.map(item => {
            const active = current === item.id;
            return (
              React.createElement('button', { key: item.id, onClick: ()=>{setView(item.id);setOpen(false);},
                style: {width:"100%",display:"flex",alignItems:"center",gap:14,
                  padding:"14px 20px",border:"none",background:active?C.goldBg:"transparent",
                  cursor:"pointer",color:active?C.gold:C.text,
                  fontFamily:"'DM Sans',sans-serif",fontSize:14,textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10716}}
                , React.createElement(Ic, { n: item.icon, size: 18, stroke: active?C.gold:C.textMuted, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10721}})
                , item.label
              )
            );
          })
          , React.createElement('div', { style: {height:1,background:C.border,margin:"8px 0"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10726}})
          , React.createElement('button', { onClick: onLogout,
            style: {width:"100%",display:"flex",alignItems:"center",gap:14,
              padding:"14px 20px",border:"none",background:"transparent",
              cursor:"pointer",color:C.red,
              fontFamily:"'DM Sans',sans-serif",fontSize:14,textAlign:"left"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10727}}
            , React.createElement(Ic, { n: "x", size: 18, stroke: C.red, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10732}}), "Esci"
          )
        )
      )
    )
  );
};



// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
function App() {
  // ── TUTTI GLI HOOK IN CIMA — mai dopo un return condizionale ──
  const [user,           setUser]           = useState(null);
  const [view,           setView]           = useState("dashboard");
  const [panKey,         setPanKey]         = useState(0);
  const [schermata,      setSchermata]      = useState("login");
  const [sharedStudents,       setSharedStudents]       = useState(INIT_STUDENTS);
  const [sharedCourses,        setSharedCourses]        = useState(INIT_COURSES);
  const [sharedDocenti,        setSharedDocenti]        = useState(INIT_DOCENTI_EXT);
  const [sharedLessons,        setSharedLessons]        = useState(INIT_LESSONS);
  const [sharedConfig,         setSharedConfig]         = useState(CONFIG_DEFAULT);
  const [sharedAnniScolastici, setSharedAnniScolastici] = useState(INIT_ANNI_SCOLASTICI);
  const [sharedEntrate,         setSharedEntrate]         = useState(INIT_ENTRATE_QUOTE);

  const cambiaSchermata = (s) => { setSchermata(s); setPanKey(p=>p+1); };

  // ── SCHERMATA AUTH ──
  if (!user) {
    return (
      React.createElement(React.Fragment, null
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10765}}, G)
        , React.createElement('div', { style: {minHeight:"100vh",display:"flex",background:C.bg,overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10766}}
          , React.createElement('div', { className: "login-left-panel", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10767}}, React.createElement(PanelloSinistra, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10767}}))
          , React.createElement('div', { style: {flex:1,display:"flex",alignItems:"center",justifyContent:"center",
            padding:"40px 24px",overflowY:"auto"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10768}}
            , React.createElement('div', { key: panKey, style: {width:"100%",maxWidth:400,padding:"0 4px"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10770}}
              , schermata==="login" && (
                React.createElement(FormLogin, {
                  onSuccess: u=>{setUser(u);setView("dashboard");},
                  onRegistrazione: ()=>cambiaSchermata("register"),
                  onRecupero: ()=>cambiaSchermata("recover"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10772}}
                )
              )
              , schermata==="register" && React.createElement(FormRegistrazione, { onBack: ()=>cambiaSchermata("login"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10778}})
              , schermata==="recover"   && React.createElement(FormRecupero, { onBack: ()=>cambiaSchermata("login"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10779}})
            )
          )
        )
      )
    );
  }

  // ── WEBAPP PRINCIPALE ──
  const views = {
    dashboard:   React.createElement(DashboardView, { appUser: user, onNavigate: setView,
                   config: sharedConfig, setConfig: setSharedConfig,
                   anniScolastici: sharedAnniScolastici, setAnniScolastici: setSharedAnniScolastici, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10789}}),
    allievi:     React.createElement(AllieviView, {    students: sharedStudents, setStudents: setSharedStudents, courses: sharedCourses, setCourses: setSharedCourses, lessons: sharedLessons, entrate: sharedEntrate, setEntrate: setSharedEntrate, annoInizioAttivo: sharedConfig.annoInizioAttivo, config: sharedConfig, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10792}}),
    docenti:     React.createElement(DocentiView, {   students: sharedStudents, lessons: sharedLessons, docenti: sharedDocenti, setDocenti: setSharedDocenti,
                   annoInizioAttivo: sharedConfig.annoInizioAttivo, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10793}}),
    corsi:       React.createElement(CorsiView, {     courses: sharedCourses,   setCourses: setSharedCourses, students: sharedStudents, setStudents: setSharedStudents, docenti: sharedDocenti, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10795}}),
    calendario:  React.createElement(CalendarioView, { lessons: sharedLessons, setLessons: setSharedLessons, courses: sharedCourses, students: sharedStudents, docenti: sharedDocenti, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10796}}),
    contabilita: React.createElement(ContabilitaView, { students: sharedStudents, entrate: sharedEntrate, setEntrate: setSharedEntrate, config: sharedConfig, setConfig: setSharedConfig, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10797}}),
    repertorio:  React.createElement(RepertorioView, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10798}}),
    concerti:    React.createElement(ConcertiView, { students: sharedStudents, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10799}}),
    utenti:      React.createElement(UtentiView, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10800}}),
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10805}}, G)
      , React.createElement('div', { style: {display:"flex",height:"100vh",overflow:"hidden"}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10806}}
        , React.createElement(Sidebar, { current: view, setView: setView, user: user, onLogout: ()=>setUser(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 10807}})
        , React.createElement('div', { key: view, className: "main-scroll", style: {flex:1,overflow:"auto",background:C.bg,animation:"fadeIn 0.25s ease",
          paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 4px)",minWidth:0}, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10808}}
          , views[view]
        )
      )
    )
  );
}

// Espone App al bootstrap in index.html
window.__AppComponent = App;

}catch(err){window.__BOOT_ERROR=err;}
})();
/* ==========================================================================
   Caapora — Espaço de Culturas · mockup script
   --------------------------------------------------------------------------
   DATA FILE — the owner edits ONLY this block.
   • Never add a dish, price, event, artist, teacher or date that the
     business has not confirmed. Unconfirmed values stay "[CONFIRM ...]".
   • To add an event: copy one object in EVENTS, set date "AAAA-MM-DD",
     time "HH:MM", type, title, entry, set confirmed:true. It then appears in
     the list, the month calendar, the hero strip and the Event JSON-LD.
   ========================================================================== */
var SITE = {
  phone: "(48) 99117-0481",          // lead sheet
  whatsapp: null,                     // [CONFIRM this is the WhatsApp number] — when confirmed: "5548991170481"
  instagram: "https://www.instagram.com/caaporaculturas/",
  siteUrl: "https://caapora.com.br"   // [CONFIRM domain]
};

/* Hours: kitchen and events almost certainly differ. [CONFIRM both]
   Format: { 0:[["12:00","15:00"]], 1:[...] }  (0 = domingo). null = unknown. */
var HOURS = { cozinha: null, eventos: null };

/* ---- MESA — cardápio -------------------------------------------------- */
/* [CONFIRM the real grouping — this is a plausible structure, not their menu.] */
var MENU_GROUPS = [
  { key:"entradas",  pt:"Entradas",            en:"Starters",          img:"1615366105533-5b8f3255ea5d" },
  { key:"pratos",    pt:"Pratos principais",   en:"Mains",             img:"1604909052743-94e838986d24" },
  { key:"lanches",   pt:"Lanches",             en:"Snacks & sandwiches",img:"1525059696034-4967a8e1dca2" },
  { key:"bowls",     pt:"Bowls & saladas",     en:"Bowls & salads",    img:"1512621776951-a57141f2eefd" },
  { key:"sobremesas",pt:"Sobremesas",          en:"Desserts",          img:"1626803775151-61d756612f97" },
  { key:"cafes",     pt:"Cafés & bebidas",     en:"Coffee & drinks",   img:"1509042239860-f550ce710b93" },
  { key:"sucos",     pt:"Sucos & kombuchas",   en:"Juices & kombucha", img:"1583396216852-1e1d61137170" }
];
/* Three clearly-labelled placeholder rows per group. Replace with real items:
   { name:"...", desc:"...", price:"R$ 00,00", gluten:"CONTÉM GLÚTEN" | "NÃO CONTÉM GLÚTEN",
     allergens:"...", tags:["sem glúten","sem lactose","sem castanhas","sem soja"] } */
var MENU_ITEMS = {};
MENU_GROUPS.forEach(function(g){ MENU_ITEMS[g.key] = [null,null,null]; });

var DAILY_SPECIAL = null; // { name:"...", price:"R$ 00,00" } — [CONFIRM]

/* ---- PALCO — programação ---------------------------------------------- */
/* Three visibly-labelled [CONFIRM] example entries. NO real artist, class,
   teacher or date. confirmed:false keeps them out of the Event JSON-LD. */
var EVENTS = [
  { slug:"evento-exemplo", date:null, time:null, type:"musica",   confirmed:false },
  { slug:"evento-exemplo", date:null, time:null, type:"yoga",     confirmed:false },
  { slug:"evento-exemplo", date:null, time:null, type:"oficina",  confirmed:false }
];
/* [CONFIRM the real categories] */
var EVENT_TYPES = {
  musica:   { pt:"Música ao vivo",  en:"Live music" },
  yoga:     { pt:"Yoga",            en:"Yoga" },
  oficina:  { pt:"Oficina",         en:"Workshop" },
  feira:    { pt:"Feira",           en:"Market" },
  exposicao:{ pt:"Exposição",       en:"Exhibition" },
  roda:     { pt:"Roda de conversa",en:"Talk circle" }
};

/* ============================ ENGINE ==================================== */
(function(){
  "use strict";
  var LANG=(document.documentElement.lang||"pt-BR").toLowerCase().indexOf("en")===0?"en":"pt";
  var BASE=document.body.getAttribute("data-base")||"";
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  var T={
    pt:{
      dish:"[CONFIRM prato]", dishDesc:"[PLACEHOLDER: descrição de 1 linha — cliente fornece]",
      gluten:"Glúten: [CONFIRM: CONTÉM GLÚTEN / NÃO CONTÉM GLÚTEN]", allergens:"Alérgenos: [CONFIRM]",
      tags:["sem glúten","sem lactose","sem castanhas","sem soja"], vegan:"vegano",
      photo:"FOTO ILUSTRATIVA — placeholder",
      groupAlt:function(g){return "Prato vegano fotografado de cima em luz natural — ilustração para "+g.toLowerCase();},
      order:function(g){return "Pedir "+g.toLowerCase()+" pelo WhatsApp";},
      special:"Prato do dia em breve — acompanhe no @caaporaculturas",
      evTitle:"[CONFIRM evento]", evDesc:"[PLACEHOLDER: descrição do evento — cliente fornece]",
      entry:"Entrada: [CONFIRM — entrada franca, contribuição consciente, ou ingresso?]",
      time:"Início: [CONFIRM HH:MM]", interest:"Tenho interesse", details:"Página do evento",
      noEvents:"Nenhum evento agendado no momento.", noPast:"Nenhum evento passado registrado ainda.",
      next:"Próximo evento", noNext:"Nenhum evento agendado no momento — acompanhe no @caaporaculturas",
      undated:"Sem data", months:["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],
      dows:["dom","seg","ter","qua","qui","sex","sáb"],
      calNote:function(n){return n? n+" evento(s) neste mês." : "Nenhum evento com data confirmada neste mês. Os exemplos acima aguardam datas [CONFIRM].";},
      waMsg:function(x){return "Olá! Vim pelo site da Caapora e tenho interesse em: "+x;},
      kitchen:"Cozinha", events:"Eventos", unknown:"horário [CONFIRM]", open:"aberta agora", closed:"fechada",
      openE:"acontecendo agora", closedE:"sem evento agora",
      formOk:"Demonstração: este formulário ainda não envia dados. Nada foi coletado.",
      waConfirm:"[CONFIRM WhatsApp]"
    },
    en:{
      dish:"[CONFIRM dish]", dishDesc:"[PLACEHOLDER: 1-line description — client to supply]",
      gluten:"Gluten: [CONFIRM: CONTAINS GLUTEN / GLUTEN-FREE]", allergens:"Allergens: [CONFIRM]",
      tags:["gluten-free","lactose-free","nut-free","soy-free"], vegan:"vegan",
      photo:"ILLUSTRATIVE PHOTO — placeholder",
      groupAlt:function(g){return "Vegan dish shot from above in daylight — illustration for "+g.toLowerCase();},
      order:function(g){return "Order "+g.toLowerCase()+" on WhatsApp";},
      special:"Dish of the day coming soon — follow @caaporaculturas",
      evTitle:"[CONFIRM event]", evDesc:"[PLACEHOLDER: event description — client to supply]",
      entry:"Entry: [CONFIRM — free, pay-what-you-can, or ticketed?]",
      time:"Starts: [CONFIRM HH:MM]", interest:"I'm interested", details:"Event page (PT)",
      noEvents:"No events scheduled at the moment.", noPast:"No past events recorded yet.",
      next:"Next event", noNext:"No events scheduled at the moment — follow @caaporaculturas",
      undated:"No date", months:["January","February","March","April","May","June","July","August","September","October","November","December"],
      dows:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
      calNote:function(n){return n? n+" event(s) this month." : "No events with confirmed dates this month. The examples above await dates [CONFIRM].";},
      waMsg:function(x){return "Hello! I found Caapora's website and I'm interested in: "+x;},
      kitchen:"Kitchen", events:"Events", unknown:"hours [CONFIRM]", open:"open now", closed:"closed",
      openE:"on now", closedE:"nothing on now",
      formOk:"Demo only: this form does not send anything yet. No data was collected.",
      waConfirm:"[CONFIRM WhatsApp]"
    }
  }[LANG];

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function img(id,w){return "https://images.unsplash.com/photo-"+id+"?auto=format&fit=crop&w="+w+"&q=70";}
  function mark(txt){return esc(txt).replace(/\[(CONFIRM[^\]]*)\]/g,'<span class="confirm">[$1]</span>').replace(/\[(PLACEHOLDER[^\]]*)\]/g,'<span class="ph">[$1]</span>');}
  function waHref(text){
    if(!SITE.whatsapp){ var id=LANG==="en"?"contact":"contato"; return document.getElementById(id)?"#"+id:"index.html#"+id; }
    return "https://wa.me/"+SITE.whatsapp+"?text="+encodeURIComponent(text);
  }
  var ICON={
    wa:'<svg viewBox="0 0 32 32" aria-hidden="true"><use href="#i-wa"/></svg>',
    wheat:'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wheat"/></svg>',
    drop:'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-drop"/></svg>',
    nut:'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-nut"/></svg>',
    bean:'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-bean"/></svg>',
    leaf:'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-leaf"/></svg>'
  };
  var TAGICON=[ICON.wheat,ICON.drop,ICON.nut,ICON.bean];

  /* reveal observer */
  var io=null;
  if(!reduce&&"IntersectionObserver" in window){
    io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px",threshold:.08});
  }
  function observe(list){list.forEach(function(n){ if(io) io.observe(n); else n.classList.add("is-in"); });}

  /* year */
  $$("[data-year]").forEach(function(el){el.textContent=new Date().getFullYear();});

  /* WhatsApp links */
  function wireWa(root){
    $$("[data-wa]",root).forEach(function(a){
      a.setAttribute("href",waHref(T.waMsg(a.getAttribute("data-wa")||"")));
      if(!SITE.whatsapp) a.setAttribute("title",T.waConfirm);
    });
  }
  wireWa(document);
  if(SITE.whatsapp) $$(".wa-label").forEach(function(l){l.hidden=true;});

  /* header + CTA bar */
  var header=$(".site-header"), bar=$(".cta-bar");
  function onScroll(){var y=window.scrollY||0; if(header) header.classList.toggle("is-condensed",y>24); if(bar) bar.classList.toggle("is-visible",y>320);}
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

  /* mobile menu */
  var tg=$(".menu-toggle"), mm=$("#mobile-menu");
  if(tg&&mm){
    tg.addEventListener("click",function(){var o=tg.getAttribute("aria-expanded")!=="true";tg.setAttribute("aria-expanded",String(o));mm.classList.toggle("is-open",o);document.body.style.overflow=o?"hidden":"";});
    mm.addEventListener("click",function(e){if(e.target.closest("a")){tg.setAttribute("aria-expanded","false");mm.classList.remove("is-open");document.body.style.overflow="";}});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&mm.classList.contains("is-open")){tg.click();tg.focus();}});
  }

  /* open / closed pills — kitchen and events separately */
  function isOpen(h){
    var now=new Date(),d=now.getDay(),m=now.getHours()*60+now.getMinutes(),o=false;
    (h[d]||[]).forEach(function(r){var a=r[0].split(":"),b=r[1].split(":");if(m>=+a[0]*60+ +a[1]&&m<+b[0]*60+ +b[1])o=true;});
    return o;
  }
  $$("[data-status]").forEach(function(p){
    var which=p.getAttribute("data-status"), h=HOURS[which], label=which==="cozinha"?T.kitchen:T.events, txt, st;
    if(!h){ txt=label+": "+T.unknown; st="unknown"; }
    else { var o=isOpen(h); txt=label+": "+(which==="cozinha"?(o?T.open:T.closed):(o?T.openE:T.closedE)); st=o?"open":"closed"; }
    p.setAttribute("data-state",st);
    var t=$(".status-text",p); if(t) t.innerHTML=mark(txt);
  });
  $$('tr[data-day="'+new Date().getDay()+'"]').forEach(function(r){r.classList.add("is-today");});

  /* ---------- MESA: menu tabs ---------- */
  var tabs=$("#menu-tabs"), panel=$("#menu-panel");
  function dishHtml(it,i){
    var name=it?it.name:T.dish, desc=it?it.desc:T.dishDesc, price=it?it.price:"R$ 00,00";
    var tags=T.tags.map(function(t,k){return '<li>'+TAGICON[k]+esc(t)+' <span class="confirm">[CONFIRM]</span></li>';}).join("");
    return '<li class="dish reveal" style="--i:'+i+'"><div class="dish-top"><h4>'+mark(name)+'</h4><span class="price-pill">'+esc(price)+'</span></div>'+
      '<p>'+mark(desc)+'</p><ul class="diet" aria-label="Informações alimentares"><li class="vegan">'+ICON.leaf+esc(T.vegan)+' <span class="confirm">[CONFIRM]</span></li>'+tags+'</ul>'+
      '<div class="gluten-line">'+mark(T.gluten)+'<br>'+mark(T.allergens)+'</div></li>';
  }
  function renderGroup(key){
    var g=MENU_GROUPS.filter(function(x){return x.key===key;})[0]; if(!g||!panel) return;
    var label=g[LANG];
    panel.innerHTML='<!-- PLACEHOLDER-mesa-'+g.key+' --><div class="ph-img mesa-img" data-placeholder="'+T.photo+'"><img src="'+img(g.img,900)+'" alt="'+esc(T.groupAlt(label))+'" loading="lazy" width="900" height="900"></div>'+
      '<div><h3 class="sr-only" id="panel-title">'+esc(label)+'</h3><ul class="menu-items">'+(MENU_ITEMS[g.key]||[]).map(dishHtml).join("")+'</ul>'+
      '<div class="menu-actions"><a class="btn btn-wa" data-wa="'+esc(label)+'" href="#">'+ICON.wa+esc(T.order(label))+'</a></div></div>';
    panel.setAttribute("aria-labelledby","tab-"+g.key);
    wireWa(panel);
    observe($$(".reveal",panel));
  }
  if(tabs&&panel){
    tabs.innerHTML=MENU_GROUPS.map(function(g,i){return '<button class="menu-tab" role="tab" type="button" id="tab-'+g.key+'" aria-controls="menu-panel" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-key="'+g.key+'">'+esc(g[LANG])+'</button>';}).join("");
    var btns=$$(".menu-tab",tabs);
    function select(b){btns.forEach(function(x){x.setAttribute("aria-selected",String(x===b));x.tabIndex=x===b?0:-1;});renderGroup(b.getAttribute("data-key"));}
    btns.forEach(function(b,i){
      b.addEventListener("click",function(){select(b);});
      b.addEventListener("keydown",function(e){var n=null;if(e.key==="ArrowRight")n=btns[(i+1)%btns.length];if(e.key==="ArrowLeft")n=btns[(i-1+btns.length)%btns.length];if(n){e.preventDefault();n.focus();select(n);}});
    });
    renderGroup(MENU_GROUPS[0].key);
  }
  var sp=$("#daily-special");
  if(sp){ sp.innerHTML=DAILY_SPECIAL? '<b>'+esc(DAILY_SPECIAL.name)+'</b> <span class="price-pill">'+esc(DAILY_SPECIAL.price)+'</span>' : '<b>'+esc(T.special)+'</b>'; }

  /* ---------- PALCO: events ---------- */
  var today=new Date(); today.setHours(0,0,0,0);
  function evDate(e){ if(!e.date) return null; var p=e.date.split("-"); return new Date(+p[0],+p[1]-1,+p[2]); }
  function pad(n){return String(n).padStart(2,"0");}
  function eventHtml(e,i){
    var d=evDate(e), typeLabel=(EVENT_TYPES[e.type]||{})[LANG]||e.type;
    var dateBlock=d? '<time datetime="'+e.date+(e.time?"T"+e.time:"")+'">'+pad(d.getDate())+'/'+pad(d.getMonth()+1)+'</time><small>'+esc(T.months[d.getMonth()].slice(0,3))+'</small>'
                   : '<time>DD/MM</time><small>'+esc(T.undated)+'</small>';
    var title=e.title||T.evTitle, url=BASE+"agenda/"+e.slug+"/index.html";
    return '<li class="event reveal" style="--i:'+(i%3)+'"><div class="date">'+dateBlock+'</div><div class="body">'+
      '<span class="type">'+esc(typeLabel)+' <span class="confirm" style="font-size:.9em">[CONFIRM]</span></span>'+
      '<h3>'+mark(title)+'</h3><p>'+mark(e.desc||T.evDesc)+'</p>'+
      '<p class="entry">'+mark(e.time?(LANG==="en"?"Starts: ":"Início: ")+e.time:T.time)+'</p>'+
      '<p class="entry">'+mark(e.entry||T.entry)+'</p>'+
      '<div class="actions"><a class="btn btn-terra btn-sm btn-hard" data-wa="'+esc((e.title||typeLabel))+'" href="#">'+ICON.wa+esc(T.interest)+'</a>'+
      '<a class="btn btn-ghost btn-sm btn-hard" href="'+url+'">'+esc(T.details)+'</a></div></div></li>';
  }
  var evState={type:null,past:false};
  function filtered(){
    return EVENTS.filter(function(e){
      var d=evDate(e), isPast=d? d<today : false;
      return (evState.past?isPast:!isPast)&&(!evState.type||e.type===evState.type);
    }).sort(function(a,b){var da=evDate(a),db=evDate(b);return (da?da.getTime():Infinity)-(db?db.getTime():Infinity);});
  }
  function renderEvents(){
    $$("[data-event-list]").forEach(function(list){
      var limit=+(list.getAttribute("data-limit")||99), items=filtered().slice(0,limit);
      list.innerHTML=items.length? items.map(eventHtml).join("") : '<li class="event-empty">'+esc(evState.past?T.noPast:T.noEvents)+'</li>';
      wireWa(list); observe($$(".reveal",list));
    });
  }
  $$("[data-cat]").forEach(function(b){
    b.addEventListener("click",function(){
      var v=b.getAttribute("data-cat")||null; evState.type=(evState.type===v)?null:v;
      $$("[data-cat]").forEach(function(x){x.setAttribute("aria-pressed",String((x.getAttribute("data-cat")||null)===evState.type));});
      renderEvents();
    });
  });
  $$("[data-when]").forEach(function(b){
    b.addEventListener("click",function(){
      evState.past=b.getAttribute("data-when")==="past";
      $$("[data-when]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
      renderEvents();
    });
  });
  if($("[data-event-list]")) renderEvents();

  /* hero next-event strip */
  var ns=$("#next-event");
  if(ns){
    var up=EVENTS.filter(function(e){var d=evDate(e);return e.confirmed&&d&&d>=today;}).sort(function(a,b){return evDate(a)-evDate(b);})[0];
    if(up){ var d=evDate(up); ns.innerHTML='<b>'+esc(T.next)+'</b><time datetime="'+up.date+'">'+pad(d.getDate())+'/'+pad(d.getMonth()+1)+'</time> · '+esc(up.title); }
    else ns.innerHTML='<b>'+esc(T.next)+'</b><span>'+esc(T.noNext)+'</span>';
  }

  /* month calendar */
  var cal=$("#calendar");
  if(cal){
    var view=new Date(today.getFullYear(),today.getMonth(),1);
    function drawCal(){
      var y=view.getFullYear(), m=view.getMonth(), first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
      $("#cal-title").textContent=T.months[m]+" "+y;
      var marks={}; var count=0;
      EVENTS.forEach(function(e){var d=evDate(e); if(d&&d.getFullYear()===y&&d.getMonth()===m){marks[d.getDate()]=true;count++;}});
      var html=T.dows.map(function(d){return '<div class="dow" aria-hidden="true">'+d+'</div>';}).join("");
      for(var i=0;i<first;i++) html+='<div class="day muted" aria-hidden="true"></div>';
      for(var d=1;d<=days;d++){
        var isT=(y===today.getFullYear()&&m===today.getMonth()&&d===today.getDate());
        html+='<div class="day'+(isT?" today":"")+(marks[d]?" has-event":"")+'" aria-label="'+d+' '+T.months[m]+(marks[d]?" — evento":"")+'">'+d+'</div>';
      }
      $("#cal-grid").innerHTML=html;
      $("#cal-note").innerHTML=mark(T.calNote(count));
    }
    $("#cal-prev").addEventListener("click",function(){view.setMonth(view.getMonth()-1);drawCal();});
    $("#cal-next").addEventListener("click",function(){view.setMonth(view.getMonth()+1);drawCal();});
    drawCal();
  }

  /* Event JSON-LD — emitted ONLY for confirmed, dated events */
  (function(){
    var ev=EVENTS.filter(function(e){return e.confirmed&&e.date&&e.title;});
    if(!ev.length) return;
    var data={"@context":"https://schema.org","@graph":ev.map(function(e){return {
      "@type":"Event","name":e.title,"startDate":e.date+(e.time?"T"+e.time+":00-03:00":""),
      "eventAttendanceMode":"https://schema.org/OfflineEventAttendanceMode","eventStatus":"https://schema.org/EventScheduled",
      "location":{"@id":SITE.siteUrl+"/#venue"},"organizer":{"@id":SITE.siteUrl+"/#business"},
      "url":SITE.siteUrl+"/agenda/"+e.slug+"/"
    };})};
    var s=document.createElement("script"); s.type="application/ld+json"; s.textContent=JSON.stringify(data); document.head.appendChild(s);
  })();

  /* gallery track filter */
  $$("[data-gal]").forEach(function(b){
    b.addEventListener("click",function(){
      var v=b.getAttribute("data-gal");
      $$("[data-gal]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});
      $$(".gallery figure").forEach(function(f){ f.hidden = v!=="all" && f.getAttribute("data-track")!==v; });
    });
  });

  /* parallax: canopy background + foliage layer (transform only) */
  var bg=$(".hero-bg"), fol=$$(".hero-foliage");
  if(bg&&!reduce){
    var tick=false;
    window.addEventListener("scroll",function(){
      if(tick) return; tick=true;
      requestAnimationFrame(function(){
        var y=Math.min(window.scrollY,1000);
        bg.style.transform="translate3d(0,"+(y*0.3)+"px,0)";
        fol.forEach(function(f,i){ f.style.transform="translate3d(0,"+(y*(i?-0.06:-0.12))+"px,0)"; });
        tick=false;
      });
    },{passive:true});
  }

  /* demo forms */
  $$("form[data-demo]").forEach(function(f){
    f.addEventListener("submit",function(e){e.preventDefault();var n=$(".form-notice",f);if(n){n.textContent=T.formOk;n.classList.add("is-visible");n.focus();}});
  });

  /* LGPD cookie banner */
  var KEY="caapora_cookie_consent_v1", cb=$("#cookie-banner");
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v));}catch(e){}}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){return null;}}
  function openCb(prefs){
    if(!cb) return; cb.hidden=false; requestAnimationFrame(function(){cb.classList.add("is-open");});
    var s=load(); if(s){$('[name="analytics"]',cb).checked=!!s.analytics;$('[name="marketing"]',cb).checked=!!s.marketing;}
    $(".cookie-prefs",cb).classList.toggle("is-open",!!prefs);
    if(prefs){var f=$("button",cb); if(f) f.focus();}
  }
  function closeCb(){cb.classList.remove("is-open");setTimeout(function(){cb.hidden=true;},420);}
  if(cb){
    cb.addEventListener("click",function(e){
      var b=e.target.closest("[data-consent]"); if(!b) return; var a=b.getAttribute("data-consent");
      if(a==="accept"){save({necessary:true,analytics:true,marketing:true,ts:Date.now()});closeCb();}
      else if(a==="reject"){save({necessary:true,analytics:false,marketing:false,ts:Date.now()});closeCb();}
      else if(a==="prefs"){$(".cookie-prefs",cb).classList.toggle("is-open");}
      else if(a==="save"){save({necessary:true,analytics:$('[name="analytics"]',cb).checked,marketing:$('[name="marketing"]',cb).checked,ts:Date.now()});closeCb();}
    });
    if(!load()) setTimeout(function(){openCb(false);},700);
  }
  $$("[data-cookie-open]").forEach(function(b){b.addEventListener("click",function(){openCb(true);});});

  observe($$(".reveal:not(.is-in)"));
})();

/* ==========================================================================
   Ótica Campeche — mockup script
   --------------------------------------------------------------------------
   DATA FILE (edit here). Everything below the "ENGINE" line reads from it.
   RULES: never add a real brand, lens technology, price or instalment count
   until the shop confirms it in writing. Unconfirmed values stay as
   "[CONFIRM]" / "00,00" and render as visible placeholders.
   ========================================================================== */
var SITE = {
  phoneDisplay: "(48) 3338-2101",          // verified (own site + lead sheet)
  phoneHref: "tel:+554833382101",
  whatsapp: null,                            // [CONFIRM] — no WhatsApp number found. Format when known: "5548XXXXXXXXX"
  instagram: "https://www.instagram.com/oticacampeche/",
  installments: null                         // [CONFIRM] number of instalments (CDC: show count + value + total together)
};

/* Opening hours — NONE published anywhere. [CONFIRM]
   Format when confirmed: { 1:[["09:00","18:00"]], ... } where 0 = domingo.
   While null, the hero pill shows a neutral "[CONFIRM]" state instead of guessing. */
var HOURS = null;

/* --- Módulo A: Óculos (frame-shape navigator) ---------------------------
   shape: redonda | quadrada | aviador | gatinho | retangular | oval
   tipo: grau | solar | infantil     genero: masculino | feminino | unissex
   Tipo/gênero values below are DEMO attributes so the filters can be shown;
   they do not describe real stock. img = stock placeholder id. */
var PRODUCTS = [
  { id:"p01", shape:"redonda",    tipo:"grau",  genero:"unissex",   img:"1614715838608-dd527c46231d" },
  { id:"p02", shape:"redonda",    tipo:"solar", genero:"feminino",  img:"1511499767150-a48a237f0083" },
  { id:"p03", shape:"quadrada",   tipo:"grau",  genero:"masculino", img:"1591076482161-42ce6da69f67" },
  { id:"p04", shape:"quadrada",   tipo:"solar", genero:"unissex",   img:"1584036553516-bf83210aa16c" },
  { id:"p05", shape:"aviador",    tipo:"solar", genero:"masculino", img:"1589642380614-4a8c2147b857" },
  { id:"p06", shape:"aviador",    tipo:"solar", genero:"unissex",   img:"1473496169904-658ba7c44d8a" },
  { id:"p07", shape:"gatinho",    tipo:"grau",  genero:"feminino",  img:"1646084081219-1090f72a531c" },
  { id:"p08", shape:"gatinho",    tipo:"solar", genero:"feminino",  img:"1577803645773-f96470509666" },
  { id:"p09", shape:"retangular", tipo:"grau",  genero:"masculino", img:"1589176449149-71f7ea77ec25" },
  { id:"p10", shape:"retangular", tipo:"grau",  genero:"unissex",   img:"1574258495973-f010dfbb5371" },
  { id:"p11", shape:"oval",       tipo:"grau",  genero:"unissex",   img:"1483412468200-72182dbbc544" },
  { id:"p12", shape:"oval",       tipo:"grau",  genero:"feminino",  img:"1534844978-b859e5a09ad6" }
];

/* --- Módulo B: Serviços (clinical track) ---------------------------------
   No prices in this module. Remove any row the shop does not perform. */
var SERVICES = [
  { pt:"Exame de vista", en:"Eye examination", flag:{ pt:"[CONFIRM se é realizado na loja e por quem]", en:"[CONFIRM whether performed on site and by whom]" } },
  { pt:"Montagem de lentes", en:"Lens fitting", flag:null },
  { pt:"Lentes de grau", en:"Prescription lenses", flag:{ pt:"[CONFIRM: monofocal, multifocal/progressiva, antirreflexo, fotossensível, filtro de luz azul — confirmar quais]", en:"[CONFIRM: single vision, multifocal/progressive, anti-reflective, photochromic, blue-light filter — confirm which]" } },
  { pt:"Lentes de contato", en:"Contact lenses", flag:{ pt:"[CONFIRM]", en:"[CONFIRM]" } },
  { pt:"Ajustes e consertos", en:"Adjustments & repairs", flag:null },
  { pt:"Troca de plaquetas e hastes", en:"Nose-pad & temple replacement", flag:null },
  { pt:"Óculos de sol com grau", en:"Prescription sunglasses", flag:{ pt:"[CONFIRM]", en:"[CONFIRM]" } }
];

/* ============================ ENGINE ==================================== */
(function(){
  "use strict";
  var doc = document.documentElement;
  var LANG = (doc.lang || "pt-BR").toLowerCase().indexOf("en") === 0 ? "en" : "pt";
  var BASE = document.body.getAttribute("data-base") || "";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var T = {
    pt: {
      shapes:{redonda:"Redonda",quadrada:"Quadrada",aviador:"Aviador",gatinho:"Gatinho",retangular:"Retangular",oval:"Oval"},
      tipos:{grau:"Grau",solar:"Solar",infantil:"Infantil"},
      generos:{masculino:"Masculino",feminino:"Feminino",unissex:"Unissex"},
      model:"[CONFIRM modelo]", brand:"[CONFIRM marca]", material:"Material: acetato / metal / titânio",
      inst:function(n){return "em até "+n+"x de R$ 00,00 · total R$ 00,00";},
      reserve:"Reservar pelo WhatsApp",
      empty:"Catálogo em atualização — fale conosco no WhatsApp para ver o que temos em loja.",
      count:function(n){return n+(n===1?" modelo":" modelos")+" exibido"+(n===1?"":"s")+" · fotos ilustrativas";},
      photo:"FOTO ILUSTRATIVA — placeholder",
      alt:function(s){return "Armação de óculos em formato "+s.toLowerCase()+" sobre superfície neutra — foto ilustrativa de banco de imagens";},
      desc:"[PLACEHOLDER: descrição de 1–2 frases — cliente fornece]",
      prazo:"Prazo: [CONFIRM prazo]",
      waMsg:function(x){return "Olá! Vim pelo site e gostaria de informações sobre: "+x;},
      pillCfg:"Horário de funcionamento [CONFIRM]",
      open:"Aberto agora", closed:"Fechado",
      formOk:"Demonstração: este formulário ainda não envia dados. Nada foi coletado.",
      waConfirm:"[CONFIRM WhatsApp]"
    },
    en: {
      shapes:{redonda:"Round",quadrada:"Square",aviador:"Aviator",gatinho:"Cat-eye",retangular:"Rectangular",oval:"Oval"},
      tipos:{grau:"Prescription",solar:"Sun",infantil:"Kids"},
      generos:{masculino:"Men",feminino:"Women",unissex:"Unisex"},
      model:"[CONFIRM model]", brand:"[CONFIRM brand]", material:"Material: acetate / metal / titanium",
      inst:function(n){return "up to "+n+"x of R$ 00,00 · total R$ 00,00";},
      reserve:"Reserve on WhatsApp",
      empty:"Catalogue being updated — message us on WhatsApp to see what we have in store.",
      count:function(n){return n+(n===1?" frame":" frames")+" shown · illustrative photos";},
      photo:"ILLUSTRATIVE PHOTO — placeholder",
      alt:function(s){return s+" spectacle frame on a neutral surface — illustrative stock photo";},
      desc:"[PLACEHOLDER: 1–2 sentence description — client to supply]",
      prazo:"Turnaround: [CONFIRM]",
      waMsg:function(x){return "Hello! I found you on the website and would like information about: "+x;},
      pillCfg:"Opening hours [CONFIRM]",
      open:"Open now", closed:"Closed",
      formOk:"Demo only: this form does not send anything yet. No data was collected.",
      waConfirm:"[CONFIRM WhatsApp]"
    }
  }[LANG];

  var waSvg='<svg viewBox="0 0 32 32" aria-hidden="true" fill="currentColor"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.8 6.4L3 29l7-1.8c1.8 1 3.9 1.5 6 1.5 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.4 16 26.4zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
  var io=null;
  if(!reduce && "IntersectionObserver" in window){
    io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var t=en.target;
        if(t.classList.contains("focus-pending")){
          var go=function(){ requestAnimationFrame(function(){ t.classList.remove("focus-pending"); }); };
          if(t.complete) setTimeout(go,120); else { t.addEventListener("load",go,{once:true}); t.addEventListener("error",go,{once:true}); }
        } else t.classList.add("is-in");
        io.unobserve(t);
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:.08});
  }
  function observe(nodes){
    Array.prototype.forEach.call(nodes,function(n){ if(io) io.observe(n); else n.classList.add("is-in"); });
  }

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function img(id,w){return "https://images.unsplash.com/photo-"+id+"?auto=format&fit=crop&w="+w+"&q=70";}
  function phWrap(txt){ // turns [CONFIRM ...] / [PLACEHOLDER ...] into styled spans
    return esc(txt).replace(/\[(CONFIRM[^\]]*)\]/g,'<span class="confirm">[$1]</span>').replace(/\[(PLACEHOLDER[^\]]*)\]/g,'<span class="ph">[$1]</span>');
  }
  /* WhatsApp link builder: never produces a dead wa.me link. */
  function waHref(text){
    if(!SITE.whatsapp){ var id=LANG==="en"?"contact":"contato"; return document.getElementById(id)?"#"+id:"index.html#"+id; }
    return "https://wa.me/"+SITE.whatsapp+"?text="+encodeURIComponent(text);
  }
  window.OC_waHref = waHref;

  /* ---------- Year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"),function(el){el.textContent=new Date().getFullYear();});

  /* ---------- WhatsApp links ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-wa]"),function(a){
    a.setAttribute("href",waHref(T.waMsg(a.getAttribute("data-wa")||"")));
    if(!SITE.whatsapp){ a.setAttribute("data-wa-pending","true"); a.setAttribute("title",T.waConfirm); }
  });
  if(SITE.whatsapp){ Array.prototype.forEach.call(document.querySelectorAll(".wa-label"),function(l){ l.hidden=true; }); }

  /* ---------- Sticky header ---------- */
  var header=document.querySelector(".site-header");
  var ctaBar=document.querySelector(".cta-bar");
  function onScroll(){
    var y=window.scrollY||window.pageYOffset;
    if(header) header.classList.toggle("is-condensed",y>24);
    if(ctaBar) ctaBar.classList.toggle("is-visible",y>320);
  }
  window.addEventListener("scroll",onScroll,{passive:true}); onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle=document.querySelector(".menu-toggle"), menu=document.getElementById("mobile-menu");
  if(toggle&&menu){
    toggle.addEventListener("click",function(){
      var open=toggle.getAttribute("aria-expanded")!=="true";
      toggle.setAttribute("aria-expanded",String(open));
      menu.classList.toggle("is-open",open);
      document.body.style.overflow=open?"hidden":"";
    });
    menu.addEventListener("click",function(e){ if(e.target.closest("a")){ toggle.setAttribute("aria-expanded","false"); menu.classList.remove("is-open"); document.body.style.overflow=""; }});
    document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&menu.classList.contains("is-open")){ toggle.click(); toggle.focus(); }});
  }

  /* ---------- Open / closed pill ---------- */
  function renderStatus(){
    var pills=document.querySelectorAll("[data-status]");
    if(!pills.length) return;
    var label, state;
    if(!HOURS){ label=T.pillCfg; state="unknown"; }
    else{
      var now=new Date(), d=now.getDay(), mins=now.getHours()*60+now.getMinutes(), open=false;
      (HOURS[d]||[]).forEach(function(r){ var a=r[0].split(":"), b=r[1].split(":"); if(mins>=+a[0]*60+ +a[1] && mins<+b[0]*60+ +b[1]) open=true; });
      label=open?T.open:T.closed; state=open?"open":"closed";
    }
    Array.prototype.forEach.call(pills,function(p){
      p.setAttribute("data-state",state);
      var t=p.querySelector(".status-text"); if(t) t.innerHTML=phWrap(label);
    });
    var row=document.querySelector('.hours tr[data-day="'+new Date().getDay()+'"]');
    if(row) row.classList.add("is-today");
  }
  renderStatus();

  /* ---------- Services list ---------- */
  var sl=document.getElementById("service-list");
  if(sl){
    sl.innerHTML=SERVICES.map(function(s,i){
      return '<li class="reveal" style="--i:'+i+'"><span class="num">'+String(i+1).padStart(2,"0")+'</span>'+
        '<div><h3>'+esc(s[LANG])+(s.flag?' '+phWrap(s.flag[LANG]):'')+'</h3><p>'+phWrap(T.desc)+'</p></div>'+
        '<span class="prazo">'+phWrap(T.prazo)+'</span></li>';
    }).join("");
  }

  /* ---------- Frame-shape navigator ---------- */
  var grid=document.getElementById("product-grid");
  if(grid){
    var state={shape:null,tipo:null,genero:null};
    var meta=document.getElementById("result-meta");
    var n=SITE.installments||"[CONFIRM]";
    function card(p,i){
      var shapeName=T.shapes[p.shape];
      return '<article class="card reveal" style="--i:'+(i%4)+'">'+
        '<!-- PLACEHOLDER-produto-'+p.id+' -->'+
        '<div class="ph-img" data-placeholder="'+T.photo+'"><img src="'+img(p.img,640)+'" alt="'+esc(T.alt(shapeName))+'" loading="lazy" width="640" height="640"></div>'+
        '<div class="card-body">'+
          '<div class="card-tags"><span class="tag">'+esc(shapeName)+'</span><span class="tag">'+esc(T.tipos[p.tipo])+'</span><span class="tag">'+esc(T.generos[p.genero])+'</span></div>'+
          '<h3><span class="confirm">'+esc(T.model)+'</span></h3>'+
          '<div class="meta"><span class="confirm">'+esc(T.brand)+'</span></div>'+
          '<div class="meta">'+esc(T.material)+' <span class="confirm">[CONFIRM]</span></div>'+
          '<div class="price"><span class="price-pill">R$ 00,00</span><small>'+phWrap(T.inst(n==="[CONFIRM]"?"[CONFIRM]":n))+'</small></div>'+
          '<a class="btn btn-wa btn-sm" href="'+waHref(T.waMsg(shapeName+" "+p.id))+'">'+waSvg+' '+esc(T.reserve)+'</a>'+
        '</div></article>';
    }
    function render(){
      var list=PRODUCTS.filter(function(p){
        return (!state.shape||p.shape===state.shape)&&(!state.tipo||p.tipo===state.tipo)&&(!state.genero||p.genero===state.genero);
      });
      if(!list.length){
        grid.innerHTML='<div class="empty-state"><p>'+esc(T.empty)+'</p><a class="btn btn-wa" href="'+waHref(T.waMsg(LANG==="en"?"catalogue":"catálogo"))+'">'+waSvg+' WhatsApp</a></div>';
      } else grid.innerHTML=list.map(card).join("");
      if(meta) meta.textContent=T.count(list.length);
      observe(grid.querySelectorAll(".reveal"));
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-filter]"),function(btn){
      btn.addEventListener("click",function(){
        var group=btn.getAttribute("data-filter"), val=btn.getAttribute("data-value");
        state[group]=(state[group]===val)?null:val;
        Array.prototype.forEach.call(document.querySelectorAll('[data-filter="'+group+'"]'),function(b){
          b.setAttribute("aria-pressed",String(b.getAttribute("data-value")===state[group]));
        });
        render();
      });
    });
    var clear=document.getElementById("filter-clear");
    if(clear) clear.addEventListener("click",function(){
      state={shape:null,tipo:null,genero:null};
      Array.prototype.forEach.call(document.querySelectorAll("[data-filter]"),function(b){b.setAttribute("aria-pressed","false");});
      render();
    });
    render();
  }

  /* ---------- Carousel ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"),function(c){
    var track=c.querySelector(".carousel-track");
    function step(dir){ var f=track.querySelector("figure"); var w=f?f.getBoundingClientRect().width+16:300; track.scrollBy({left:dir*w,behavior:reduce?"auto":"smooth"}); }
    var p=c.querySelector("[data-prev]"), nx=c.querySelector("[data-next]");
    if(p) p.addEventListener("click",function(){step(-1);});
    if(nx) nx.addEventListener("click",function(){step(1);});
  });

  /* ---------- Reveal + focus-resolve ---------- */
  observe(document.querySelectorAll(".reveal:not(.is-in)"));
  /* Focus resolve: images ship sharp; blur is applied only here, then removed. */
  if(io){
    Array.prototype.forEach.call(document.querySelectorAll("img[data-focus]"),function(im){
      im.classList.add("focus-resolve","focus-pending");
      io.observe(im);
      setTimeout(function(){ im.classList.remove("focus-pending"); },2500); // safety net
    });
  }

  /* ---------- Hero parallax (transform only) ---------- */
  var hero=document.querySelector(".hero-media img");
  if(hero&&!reduce){
    var ticking=false;
    window.addEventListener("scroll",function(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){ var y=Math.min(window.scrollY,900); hero.style.transform="translate3d(0,"+(y*0.18)+"px,0) scale(1.06)"; ticking=false; });
    },{passive:true});
  }

  /* ---------- Demo forms ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("form[data-demo]"),function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var n=f.querySelector(".form-notice");
      if(n){ n.textContent=T.formOk; n.classList.add("is-visible"); n.focus(); }
    });
  });

  /* ---------- LGPD cookie banner ---------- */
  var KEY="oc_cookie_consent_v1";
  var banner=document.getElementById("cookie-banner");
  function store(v){ try{ localStorage.setItem(KEY,JSON.stringify(v)); }catch(e){} }
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)||"null"); }catch(e){ return null; } }
  function openBanner(showPrefs){
    if(!banner) return;
    banner.hidden=false;
    requestAnimationFrame(function(){ banner.classList.add("is-open"); });
    var prefs=banner.querySelector(".cookie-prefs");
    var saved=read();
    if(saved){ banner.querySelector('[name="analytics"]').checked=!!saved.analytics; banner.querySelector('[name="marketing"]').checked=!!saved.marketing; }
    if(prefs) prefs.classList.toggle("is-open",!!showPrefs);
    var first=banner.querySelector("button"); if(first&&showPrefs) first.focus();
  }
  function closeBanner(){ if(!banner) return; banner.classList.remove("is-open"); setTimeout(function(){ banner.hidden=true; },420); }
  if(banner){
    banner.addEventListener("click",function(e){
      var b=e.target.closest("[data-consent]"); if(!b) return;
      var act=b.getAttribute("data-consent");
      if(act==="accept"){ store({necessary:true,analytics:true,marketing:true,ts:Date.now()}); closeBanner(); }
      else if(act==="reject"){ store({necessary:true,analytics:false,marketing:false,ts:Date.now()}); closeBanner(); }
      else if(act==="prefs"){ banner.querySelector(".cookie-prefs").classList.toggle("is-open"); }
      else if(act==="save"){ store({necessary:true,analytics:banner.querySelector('[name="analytics"]').checked,marketing:banner.querySelector('[name="marketing"]').checked,ts:Date.now()}); closeBanner(); }
    });
    if(!read()) setTimeout(function(){ openBanner(false); },700);
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-cookie-open]"),function(b){ b.addEventListener("click",function(){ openBanner(true); }); });
})();

/* ==========================================================================
   Veritá Campeche — unit page mockup script
   --------------------------------------------------------------------------
   DATA FILE — edit here only.
   ⚠ Product names, ingredients, nutrition panels and prices from the ordering
   platform are the FRANCHISOR's content and are NOT reproduced. Every card is
   a visible placeholder until the franchisor authorises publication.
   ⚠ This site holds NO basket and NO checkout: every purchase action hands off
   to the official ordering platform with the Campeche unit pre-selected.
   ========================================================================== */
var UNIT = {
  name: "Veritá — Florianópolis — Campeche",
  address: "Avenida Campeche, 1512 — Campeche, Florianópolis, SC, CEP 88063-300", // from ordering platform [CONFIRM]
  phone: "48 99621-1966",           // lead sheet — likely the unit's own line
  whatsapp: null,                   // [CONFIRM it is the unit's WhatsApp] → "5548996211966"
  orderUrl: "https://delivery.veritasaudavel.com.br/verita/campeche",
  areaUrl: "https://delivery.veritasaudavel.com.br/verita/campeche/pages/area-de-entrega",
  brandUrl: "https://veritasaudavel.com.br/",
  opens: "10:00",                   // evidenced on the platform ("Abriremos às 10:00")
  closes: null,                     // [CONFIRM]
  openDays: null,                   // [CONFIRM] e.g. [1,2,3,4,5,6]
  delivery: { fromFee: "R$ 8,00", freeAbove: "R$ 300,00", window: "1h–3h" }, // platform values [CONFIRM current]
  zones: null,                      // [CONFIRM] bairros from /pages/area-de-entrega
  nutritionPermitted: false,        // [CONFIRM franchisor permission]
  utm: "utm_source=site-unidade-campeche&utm_medium=referral&utm_campaign=vitrine-local"
};

/* Categories mirror the shape of the range without naming items. [CONFIRM at this unit] */
var CATEGORIES = [
  { key:"pratos",     pt:"Pratos prontos",   en:"Ready meals",        img:"1543353071-c953d88f7033" },
  { key:"sopas",      pt:"Sopas & cremes",   en:"Soups",              img:"1777299721812-87fb82f5e84b" },
  { key:"salgados",   pt:"Salgados",         en:"Savoury bakes",      img:"1624128082309-35000879a89f" },
  { key:"sobremesas", pt:"Sobremesas",       en:"Desserts",           img:"1517427294546-5aa121f68e8a" },
  { key:"paes",       pt:"Pães & massas",    en:"Breads & pasta",     img:"1548228586-171fb0887ac0" },
  { key:"bebidas",    pt:"Bebidas & cafés",  en:"Drinks & coffee",    img:"1509042239860-f550ce710b93" }
];
/* Three placeholder cards per category. Real item format (only once authorised):
   { name, desc, portion:"000g", price:"R$ 00,00", gluten:"NÃO CONTÉM GLÚTEN", semLeite:true, vegano:false, stock:"disponível" } */
var PRODUCTS = {};
CATEGORIES.forEach(function(c){ PRODUCTS[c.key] = [null,null,null]; });

/* ============================ ENGINE ==================================== */
(function(){
  "use strict";
  var LANG=(document.documentElement.lang||"pt-BR").toLowerCase().indexOf("en")===0?"en":"pt";
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
  var T={
    pt:{
      product:"[CONFIRM produto]", desc:"[PLACEHOLDER: descrição de 1 linha — cliente fornece]", portion:"Porção: [CONFIRM: 00g]",
      frozen:"CONGELADO", gluten:"NÃO CONTÉM GLÚTEN", milk:"SEM LEITE", vegan:"VEGANO",
      nutri:"Ver informação nutricional", nutriBody:"Tabela nutricional deste item — publicação depende de autorização da franqueadora [CONFIRM]. Até lá, consulte o catálogo nutricional oficial da marca.",
      allergens:"Alérgenos: [CONFIRM — trigo, leite, ovos, soja, castanhas, amendoim, gergelim]",
      stock:"Estoque nesta loja: [CONFIRM]", order:"Pedir na plataforma oficial",
      photo:"FOTO ILUSTRATIVA — placeholder", alt:function(c){return "Produto congelado ilustrativo da categoria "+c.toLowerCase()+" — foto de banco de imagens, não é produto Veritá";},
      closedUntil:function(h){return "Fechado — abrimos às "+h;}, openFrom:function(h){return "Abrimos às "+h+" · fechamento [CONFIRM]";},
      zone:"Área de entrega em confirmação [CONFIRM]. Consulte a área oficial na plataforma:", zoneLink:"ver área de entrega",
      zoneOk:"Entregamos em", waMsg:function(x){return "Olá, Veritá Campeche! Vim pelo site e tenho uma dúvida sobre: "+x;},
      formOk:"Demonstração: este formulário ainda não envia dados. Nada foi coletado.", waConfirm:"[CONFIRM WhatsApp]",
      shelfTitle:function(c){return c;}
    },
    en:{
      product:"[CONFIRM product]", desc:"[PLACEHOLDER: 1-line description — client to supply]", portion:"Portion: [CONFIRM: 00g]",
      frozen:"FROZEN", gluten:"GLUTEN-FREE", milk:"DAIRY-FREE", vegan:"VEGAN",
      nutri:"View nutrition information", nutriBody:"Nutrition panel for this item — publishing depends on the franchisor's authorisation [CONFIRM]. Until then, see the brand's official nutrition catalogue.",
      allergens:"Allergens: [CONFIRM — wheat, milk, eggs, soy, tree nuts, peanuts, sesame]",
      stock:"Stock at this shop: [CONFIRM]", order:"Order on the official platform",
      photo:"ILLUSTRATIVE PHOTO — placeholder", alt:function(c){return "Illustrative frozen product, "+c.toLowerCase()+" category — stock photo, not a Veritá product";},
      closedUntil:function(h){return "Closed — we open at "+h;}, openFrom:function(h){return "We open at "+h+" · closing time [CONFIRM]";},
      zone:"Delivery area being confirmed [CONFIRM]. Check the official area on the ordering platform:", zoneLink:"see delivery area",
      zoneOk:"We deliver to", waMsg:function(x){return "Hello, Veritá Campeche! I found your website and have a question about: "+x;},
      formOk:"Demo only: this form does not send anything yet. No data was collected.", waConfirm:"[CONFIRM WhatsApp]",
      shelfTitle:function(c){return c;}
    }
  }[LANG];
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
  function mark(t){return esc(t).replace(/\[(CONFIRM[^\]]*)\]/g,'<span class="confirm">[$1]</span>').replace(/\[(PLACEHOLDER[^\]]*)\]/g,'<span class="ph">[$1]</span>');}
  function img(id,w){return "https://images.unsplash.com/photo-"+id+"?auto=format&fit=crop&w="+w+"&q=70";}
  function orderHref(slot){return UNIT.orderUrl+"?"+UNIT.utm+"&utm_content="+encodeURIComponent(slot||"geral");}
  function waHref(text){
    if(!UNIT.whatsapp){ var id=LANG==="en"?"contact":"contato"; return document.getElementById(id)?"#"+id:"index.html#"+id; }
    return "https://wa.me/"+UNIT.whatsapp+"?text="+encodeURIComponent(text);
  }
  var ICON=function(id){return '<svg aria-hidden="true"><use href="#'+id+'"/></svg>';};

  var io=null;
  if(!reduce&&"IntersectionObserver" in window){
    io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px",threshold:.08});
  }
  function observe(l){l.forEach(function(n){if(io)io.observe(n);else n.classList.add("is-in");});}

  $$("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear();});

  /* order hand-off links (tagged so the franchisee can see what the site sends) */
  function wireOrder(root){ $$("[data-order]",root).forEach(function(a){ a.href=orderHref(a.getAttribute("data-order")); a.rel="noopener"; a.target="_blank"; }); }
  wireOrder(document);
  function wireWa(root){ $$("[data-wa]",root).forEach(function(a){ a.href=waHref(T.waMsg(a.getAttribute("data-wa")||"")); if(!UNIT.whatsapp) a.title=T.waConfirm; }); }
  wireWa(document);
  if(UNIT.whatsapp) $$(".wa-label").forEach(function(l){l.hidden=true;});

  /* header / cta */
  var header=$(".site-header"), bar=$(".cta-bar");
  function onScroll(){var y=window.scrollY||0;if(header)header.classList.toggle("is-condensed",y>24);if(bar)bar.classList.toggle("is-visible",y>360);}
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
  var tg=$(".menu-toggle"),mm=$("#mobile-menu");
  if(tg&&mm){
    tg.addEventListener("click",function(){var o=tg.getAttribute("aria-expanded")!=="true";tg.setAttribute("aria-expanded",String(o));mm.classList.toggle("is-open",o);document.body.style.overflow=o?"hidden":"";});
    mm.addEventListener("click",function(e){if(e.target.closest("a")){tg.setAttribute("aria-expanded","false");mm.classList.remove("is-open");document.body.style.overflow="";}});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&mm.classList.contains("is-open")){tg.click();tg.focus();}});
  }

  /* status pill — only the 10:00 opening is evidenced */
  (function(){
    var now=new Date(), mins=now.getHours()*60+now.getMinutes(), p=UNIT.opens.split(":"), openM=+p[0]*60+ +p[1];
    var txt, st;
    if(mins<openM){ txt=T.closedUntil(UNIT.opens); st="closed"; }
    else if(UNIT.closes){ var c=UNIT.closes.split(":"), cm=+c[0]*60+ +c[1]; if(mins<cm){txt=(LANG==="en"?"Open now":"Aberto agora");st="open";}else{txt=T.closedUntil(UNIT.opens);st="closed";} }
    else { txt=T.openFrom(UNIT.opens); st="unknown"; }
    $$("[data-status]").forEach(function(el){ el.setAttribute("data-state",st); var t=$(".status-text",el); if(t) t.innerHTML=mark(txt); });
    $$('tr[data-day="'+now.getDay()+'"]').forEach(function(r){r.classList.add("is-today");});
  })();

  /* fulfilment segmented control (tabs pattern) */
  var segBtns=$$(".seg [role=tab]");
  function selectSeg(b){
    segBtns.forEach(function(x){var on=x===b;x.setAttribute("aria-selected",String(on));x.tabIndex=on?0:-1;var p=document.getElementById(x.getAttribute("aria-controls"));if(p)p.hidden=!on;});
  }
  segBtns.forEach(function(b,i){
    b.addEventListener("click",function(){selectSeg(b);});
    b.addEventListener("keydown",function(e){var n=null;if(e.key==="ArrowRight")n=segBtns[(i+1)%segBtns.length];if(e.key==="ArrowLeft")n=segBtns[(i-1+segBtns.length)%segBtns.length];if(n){e.preventDefault();n.focus();selectSeg(n);}});
  });

  /* delivery-zone checker — never guesses coverage */
  $$("form[data-zone]").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var v=($("input",f).value||"").trim(), out=$(".zone-result",f.parentNode)||$(".zone-result");
      if(!out) return;
      if(UNIT.zones&&v){
        var hit=UNIT.zones.some(function(z){return z.toLowerCase()===v.toLowerCase();});
        if(hit){ out.innerHTML=esc(T.zoneOk)+" "+esc(v)+"."; return; }
      }
      out.innerHTML=mark(T.zone)+' <a href="'+UNIT.areaUrl+'" target="_blank" rel="noopener">'+esc(T.zoneLink)+'</a>';
    });
  });

  /* shelf */
  var tilesEl=$("#cat-tiles"), shelf=$("#shelf"), shelfTitle=$("#shelf-title");
  function productCard(c,p,i){
    var marks='<ul class="marks" aria-label="'+(LANG==="en"?"Dietary marks":"Marcas alimentares")+'">'+
      '<li class="mark">'+ICON("i-nogluten")+esc(T.gluten)+' <span class="confirm">[CONFIRM]</span></li>'+
      '<li class="mark">'+ICON("i-nomilk")+esc(T.milk)+' <span class="confirm">[CONFIRM]</span></li>'+
      '<li class="mark">'+ICON("i-leaf")+esc(T.vegan)+' <span class="confirm">[CONFIRM]</span></li></ul>';
    return '<article class="product reveal" style="--i:'+i+'">'+
      '<!-- PLACEHOLDER-produto-'+c.key+'-'+(i+1)+' -->'+
      '<div class="ph-img" data-placeholder="'+T.photo+'"><span class="frozen">'+ICON("i-snow")+esc(T.frozen)+'</span><img src="'+img(c.img,600)+'" alt="'+esc(T.alt(c[LANG]))+'" loading="lazy" width="600" height="600"></div>'+
      '<div class="product-body"><h4>'+mark(p?p.name:T.product)+'</h4><p class="desc">'+mark(p?p.desc:T.desc)+'</p>'+marks+
      '<div class="meta"><span>'+mark(T.portion)+'</span><span class="price-pill">'+esc(p?p.price:"R$ 00,00")+'</span></div>'+
      '<p class="stock">'+mark(T.stock)+'</p>'+
      '<details><summary>'+esc(T.nutri)+'</summary><div class="nutri"><p style="margin:0">'+mark(T.nutriBody)+'</p><p style="margin:.4em 0 0">'+mark(T.allergens)+'</p></div></details>'+
      '<a class="btn btn-sm" data-order="prateleira-'+c.key+'-'+(i+1)+'" href="'+orderHref("prateleira-"+c.key)+'">'+esc(T.order)+' <span class="arrow" aria-hidden="true">↗</span></a>'+
      '</div></article>';
  }
  function renderCat(key){
    var c=CATEGORIES.filter(function(x){return x.key===key;})[0]; if(!c||!shelf) return;
    shelf.innerHTML=(PRODUCTS[key]||[]).map(function(p,i){return productCard(c,p,i);}).join("");
    shelf.setAttribute("aria-labelledby","tile-"+key);
    if(shelfTitle) shelfTitle.textContent=T.shelfTitle(c[LANG]);
    wireOrder(shelf); observe($$(".reveal",shelf));
  }
  if(tilesEl&&shelf){
    tilesEl.innerHTML=CATEGORIES.map(function(c,i){
      return '<button class="cat-tile" type="button" role="tab" id="tile-'+c.key+'" aria-controls="shelf" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-key="'+c.key+'">'+
        '<!-- PLACEHOLDER-categoria-'+c.key+' --><img src="'+img(c.img,500)+'" alt="" loading="lazy" width="500" height="375"><span>'+esc(c[LANG])+'</span></button>';
    }).join("");
    var tiles=$$(".cat-tile",tilesEl);
    function sel(b){tiles.forEach(function(x){x.setAttribute("aria-selected",String(x===b));x.tabIndex=x===b?0:-1;});renderCat(b.getAttribute("data-key"));}
    tiles.forEach(function(b,i){
      b.addEventListener("click",function(){sel(b);});
      b.addEventListener("keydown",function(e){var n=null;if(e.key==="ArrowRight")n=tiles[(i+1)%tiles.length];if(e.key==="ArrowLeft")n=tiles[(i-1+tiles.length)%tiles.length];if(n){e.preventDefault();n.focus();sel(n);}});
    });
    renderCat(CATEGORIES[0].key);
  }

  /* carousel */
  $$("[data-carousel]").forEach(function(c){
    var tr=$(".carousel-track",c);
    function step(d){var f=$("figure",tr);var w=f?f.getBoundingClientRect().width+14:300;tr.scrollBy({left:d*w,behavior:reduce?"auto":"smooth"});}
    var p=$("[data-prev]",c),n=$("[data-next]",c);
    if(p)p.addEventListener("click",function(){step(-1);});
    if(n)n.addEventListener("click",function(){step(1);});
  });

  /* hero parallax */
  var hi=$(".hero-media img");
  if(hi&&!reduce){
    var tick=false;
    window.addEventListener("scroll",function(){if(tick)return;tick=true;requestAnimationFrame(function(){var y=Math.min(window.scrollY,900);hi.style.transform="translate3d(0,"+(y*.2)+"px,0) scale(1.06)";tick=false;});},{passive:true});
  }

  /* demo forms */
  $$("form[data-demo]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var n=$(".form-notice",f);if(n){n.textContent=T.formOk;n.classList.add("is-visible");n.focus();}});});

  /* cookie banner */
  var KEY="verita_campeche_cookie_v1", cb=$("#cookie-banner");
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v));}catch(e){}}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){return null;}}
  function openCb(prefs){
    if(!cb)return; cb.hidden=false; requestAnimationFrame(function(){cb.classList.add("is-open");});
    var s=load(); if(s){$('[name="analytics"]',cb).checked=!!s.analytics;$('[name="marketing"]',cb).checked=!!s.marketing;}
    $(".cookie-prefs",cb).classList.toggle("is-open",!!prefs);
    if(prefs){var f=$("button",cb);if(f)f.focus();}
  }
  function closeCb(){cb.classList.remove("is-open");setTimeout(function(){cb.hidden=true;},420);}
  if(cb){
    cb.addEventListener("click",function(e){
      var b=e.target.closest("[data-consent]");if(!b)return;var a=b.getAttribute("data-consent");
      if(a==="accept"){save({necessary:true,analytics:true,marketing:true,ts:Date.now()});closeCb();}
      else if(a==="reject"){save({necessary:true,analytics:false,marketing:false,ts:Date.now()});closeCb();}
      else if(a==="prefs"){$(".cookie-prefs",cb).classList.toggle("is-open");}
      else if(a==="save"){save({necessary:true,analytics:$('[name="analytics"]',cb).checked,marketing:$('[name="marketing"]',cb).checked,ts:Date.now()});closeCb();}
    });
    if(!load())setTimeout(function(){openCb(false);},700);
  }
  $$("[data-cookie-open]").forEach(function(b){b.addEventListener("click",function(){openCb(true);});});

  observe($$(".reveal:not(.is-in)"));
})();

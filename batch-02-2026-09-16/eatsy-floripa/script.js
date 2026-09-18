/* =====================================================================
   EATSY â€” MENU DATA (edit here â€” this is the whole menu)
   ---------------------------------------------------------------------
   NOTHING BELOW IS A REAL DISH. No dish, price or dietary status was
   verifiable. Dietary tags on these placeholder slots are EXAMPLES to
   demonstrate the filter â€” every badge must be confirmed by PREPARATION
   METHOD (shared oil, butter, honey, shared benches), not just ingredients.
   Per item:
     name / desc  : text (null = shows [CONFIRM])
     price        : number in BRL, e.g. 32.9 -> "R$ 32,90" (never USD). State "por quilo" in desc if sold by weight.
     gluten       : "contem" | "nao-contem" | null   (Lei 10.674/2003 - mandatory)
     allergens    : ["trigo","leite","ovos","soja","castanhas","amendoim","gergelim"] (ANVISA RDC 26/2015)
     tags         : any of "vegano","vegetariano","sem-gluten","sem-lactose","sem-acucar"
   PRATO_DO_DIA   : set name/price/tags each morning; date is today's date automatically.
   NOTE: the static HTML fallback (for visitors without JavaScript) is
   generated from this same data at build time â€” regenerate after edits.
   ===================================================================== */
var WA_NUMBER = ''; // [CONFIRM] â€” +55 48 3025-2880 is on file but NOT confirmed as WhatsApp. Leave empty until confirmed.
var PRATO_DO_DIA = { name: null, desc: null, price: null, gluten: null, tags: [] };
var MENU ={
  "labels": {
    "pt": {"vegano":"vegano","vegetariano":"vegetariano","sem-gluten":"sem glúten*","sem-lactose":"sem lactose","sem-acucar":"sem açúcar",
           "demo":"exemplo","item":"[CONFIRM prato]","desc":"[CONFIRM descrição]","price":"[CONFIRM preço]",
           "gluten":"[CONFIRM] CONTÉM GLÚTEN / NÃO CONTÉM GLÚTEN · ver aviso de contaminação cruzada",
           "allergens":"Alérgenos: [CONFIRM] · por unidade ou por quilo: [CONFIRM]","noTags":"tags alimentares [CONFIRM]",
           "badgesLabel":"Informação alimentar","section":"[CONFIRM se existe]","photo":"Foto ilustrativa"},
    "en": {"vegano":"vegan","vegetariano":"vegetarian","sem-gluten":"gluten-free ingredients*","sem-lactose":"lactose-free","sem-acucar":"no added sugar",
           "demo":"example","item":"[CONFIRM dish]","desc":"[CONFIRM description]","price":"[CONFIRM price]",
           "gluten":"[CONFIRM] CONTAINS GLUTEN / GLUTEN-FREE · see cross-contact notice",
           "allergens":"Allergens: [CONFIRM] · per item or per kilo: [CONFIRM]","noTags":"dietary tags [CONFIRM]",
           "badgesLabel":"Dietary information","section":"[CONFIRM whether it exists]","photo":"Illustrative"}
  },
  "groups": [
    {"id":"pratos","pt":"Pratos do dia","en":"Dishes of the day","img":"photo-1476718406336-bb5a9690ee2a",
     "altPt":"Duas tigelas de sopa cremosa alaranjada com sementes, vistas de cima sobre mesa clara","altEn":"Two bowls of creamy orange soup with seeds, seen from above on a pale table",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-lactose"]},{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegetariano"]}]},
    {"id":"saladas","pt":"Saladas & bowls","en":"Salads & bowls","img":"photo-1547592180-85f173990554",
     "altPt":"Bowl com grãos, vagens e legumes assados visto de cima, em luz natural","altEn":"Bowl of grains, green beans and roasted vegetables from above, in daylight",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-gluten","sem-lactose"]},{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegetariano","sem-gluten"]}]},
    {"id":"tortas","pt":"Tortas & salgados","en":"Pies & savoury bakes","img":"photo-1519915028121-7d3463d20b13",
     "altPt":"Torta fatiada sobre superfície clara","altEn":"Sliced tart on a pale surface",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegetariano"]},{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-lactose"]}]},
    {"id":"acai","pt":"Açaí","en":"Açaí","img":"photo-1488477181946-6428a0291777",
     "altPt":"Copinhos com creme e morangos sobre mesa branca","altEn":"Small cups with cream and strawberries on a white table",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-lactose"]}]},
    {"id":"sucos","pt":"Sucos & smoothies","en":"Juices & smoothies","img":"photo-1610970881699-44a5587cabec",
     "altPt":"Copo de suco verde com canudo, kiwi e folhas ao redor","altEn":"Glass of green juice with a straw, kiwi and leaves around it",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-gluten","sem-lactose","sem-acucar"]},{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-lactose"]}]},
    {"id":"cafes","pt":"Cafés","en":"Coffee","img":"photo-1511920170033-f8396924c348",
     "altPt":"Xícara de café com arte no leite ao lado de café moído e grãos, vistos de cima","altEn":"Cup of coffee with latte art beside ground coffee and beans, from above",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegetariano","sem-gluten"]}]},
    {"id":"sobremesas","pt":"Sobremesas","en":"Desserts","img":"photo-1565958011703-44f9829ba187",
     "altPt":"Fatia de bolo com framboesas sobre prato escuro","altEn":"Slice of cake with raspberries on a dark plate",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegano","sem-lactose"]},{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":["vegetariano","sem-gluten","sem-acucar"]}]},
    {"id":"emporio","pt":"Empório","en":"Pantry shop","confirm":true,"img":"photo-1542990253-a781e04c0082",
     "altPt":"Potes de vidro com grãos, castanhas e sementes sobre fundo branco","altEn":"Glass jars of grains, nuts and seeds on a white background",
     "items":[{"name": null, "desc": null, "price": null, "gluten": null, "allergens": [], "tags":[]}]}
  ]
};


/* =====================================================================
   EATSY — menu renderer, dietary filter (enhancement), prato do dia
   The filter itself works WITHOUT JavaScript (CSS :has + radio inputs).
   JS adds: live match count, enter animation, ?dieta= deep links.
   ===================================================================== */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').indexOf('en') === 0;
  var L = MENU.labels[EN ? 'en' : 'pt'];
  var IMG = 'https://images.unsplash.com/';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function conf(t) { return '<span class="confirm">' + t + '</span>'; }
  function price(v) {
    return v == null ? '<span><span class="price">R$ 00,00</span> ' + conf(L.price) + '</span>'
      : '<span class="price">R$ ' + Number(v).toFixed(2).replace('.', ',') + '</span>';
  }
  function glutenLine(g) {
    if (g === 'contem') return (EN ? 'CONTAINS GLUTEN' : 'CONTÉM GLÚTEN');
    if (g === 'nao-contem') return (EN ? 'GLUTEN-FREE INGREDIENTS · see cross-contact notice' : 'NÃO CONTÉM GLÚTEN (ingredientes) · ver aviso de contaminação cruzada');
    return L.gluten;
  }
  function badges(it, confirmed) {
    if (!it.tags.length) return '<span class="badge demo">' + L.noTags + '</span>';
    return it.tags.map(function (t) {
      return confirmed ? '<span class="badge">' + L[t] + '</span>'
        : '<span class="badge demo">' + L[t] + ' (' + L.demo + ') [CONFIRM]</span>';
    }).join('');
  }
  function dishHTML(it) {
    var confirmed = !!it.name; // tags count as confirmed only once the client has filled in the dish
    return '<article class="dish ' + it.tags.map(function (t) { return 'd-' + t; }).join(' ') + '" data-reveal>' +
      '<div class="dish-top"><span class="dish-name">' + (it.name ? esc(it.name) : conf(L.item)) + '</span>' + price(it.price) + '</div>' +
      '<p>' + (it.desc ? esc(it.desc) : conf(L.desc)) + '</p>' +
      '<div class="badges" aria-label="' + L.badgesLabel + '">' + badges(it, confirmed) + '</div>' +
      '<p class="gluten-line">' + glutenLine(it.gluten) + '</p>' +
      '<p class="allergen-line">' + (it.allergens.length ? (EN ? 'Allergens: ' : 'Alérgenos: ') + esc(it.allergens.join(', ')) : L.allergens) + '</p></article>';
  }
  function render(root) {
    var h = '';
    MENU.groups.forEach(function (g) {
      h += '<section class="menu-group" id="grupo-' + g.id + '" aria-labelledby="gh-' + g.id + '">' +
        '<div class="group-head"><figure class="photo" data-placeholder><img src="' + IMG + g.img + '?auto=format&amp;fit=crop&amp;w=320&amp;q=70" loading="lazy" width="320" height="320" alt="' + esc(EN ? g.altEn : g.altPt) + '"><figcaption class="photo-tag">' + L.photo + '</figcaption></figure>' +
        '<h3 id="gh-' + g.id + '">' + (EN ? g.en : g.pt) + (g.confirm ? ' ' + conf(L.section) : '') + '</h3></div>' +
        '<div class="dish-grid">' + g.items.map(dishHTML).join('') + '</div></section>';
    });
    root.innerHTML = h;
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-menu-root]'), render);

  /* live count + animation */
  Array.prototype.forEach.call(document.querySelectorAll('.menu-app'), function (app) {
    var out = app.querySelector('.match-count');
    var radios = app.querySelectorAll('input[name="dieta"]');
    function update(animate) {
      var dishes = app.querySelectorAll('.dish');
      var n = 0;
      Array.prototype.forEach.call(dishes, function (d) {
        var visible = d.offsetParent !== null;
        if (visible) {
          n++;
          if (animate) { d.classList.remove('pop'); void d.offsetWidth; d.classList.add('pop'); d.classList.add('is-visible'); }
        }
      });
      var sel = app.querySelector('input[name="dieta"]:checked');
      var label = sel && sel.value !== 'todos' ? app.querySelector('label[for="' + sel.id + '"]').textContent.replace('✓', '').trim() : '';
      if (out) out.innerHTML = EN
        ? '<strong>' + n + '</strong> ' + (n === 1 ? 'slot' : 'slots') + (label ? ' marked “' + label + '”' : ' on the menu') + ' <span class="confirm">[template]</span>'
        : '<strong>' + n + '</strong> ' + (n === 1 ? 'item' : 'itens') + (label ? ' marcados “' + label + '”' : ' no cardápio') + ' <span class="confirm">[modelo]</span>';
    }
    Array.prototype.forEach.call(radios, function (r) { r.addEventListener('change', function () { update(true); }); });
    var param = new URLSearchParams(location.search).get('dieta') || ({ vegano: 'vegano', 'sem-gluten': 'sem-gluten' })[document.body.getAttribute('data-page')];
    if (param) {
      var pre = app.querySelector('#f-' + param);
      if (pre) {
        pre.checked = true;
        var lab = app.querySelector('label[for="f-' + param + '"]');
        var bar = app.querySelector('.diet-filter');
        if (lab && bar) bar.scrollLeft = Math.max(0, lab.offsetLeft - bar.offsetLeft - 16);
      }
    }
    update(false);
    window.EatsySetDiet = function (v) {
      var r = app.querySelector('#f-' + v);
      if (r) { r.checked = true; update(true); }
    };
  });

  /* hero chips on the same page: set the filter, then scroll */
  Array.prototype.forEach.call(document.querySelectorAll('[data-diet]'), function (a) {
    a.addEventListener('click', function (e) {
      if (!window.EatsySetDiet || !document.querySelector('.menu-app')) return;
      e.preventDefault();
      window.EatsySetDiet(a.getAttribute('data-diet'));
      var target = document.getElementById('cardapio');
      if (target) target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });

  /* prato do dia — date is today's; dish comes from PRATO_DO_DIA */
  var now = new Date();
  var dd = ('0' + now.getDate()).slice(-2) + '/' + ('0' + (now.getMonth() + 1)).slice(-2);
  Array.prototype.forEach.call(document.querySelectorAll('[data-today]'), function (el) { el.textContent = dd; });
  Array.prototype.forEach.call(document.querySelectorAll('[data-pdd-name]'), function (el) { if (PRATO_DO_DIA.name) el.textContent = PRATO_DO_DIA.name; });
  var dow = now.getDay(); // 0 = domingo
  Array.prototype.forEach.call(document.querySelectorAll('.week [data-dow]'), function (el) {
    if (parseInt(el.getAttribute('data-dow'), 10) === dow) el.classList.add('today');
  });

  /* demo form: encomendas */
  window.SiteForms = window.SiteForms || {};
  window.SiteForms.encomenda = function (form) {
    if (!form.elements['nome'].value.trim()) { form.elements['nome'].focus(); return EN ? 'Please add your name.' : 'Informe seu nome.'; }
    return WA_NUMBER ? '' : (EN ? 'Demo only — nothing was sent. WhatsApp number to be confirmed.' : 'Demonstração — nada foi enviado. Número de WhatsApp a confirmar.');
  };
})();

/* =====================================================================
   CORE BEHAVIOUR — header, menu, reveals, count-up, carousel,
   cookie consent (LGPD), demo forms, toast, footer year.
   ===================================================================== */
(function () {
  'use strict';
  var doc = document.documentElement;
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = EN ? {
    formDemo: 'Demo only — nothing was sent. On the live site this form will be connected.',
    consent: 'Please tick the privacy consent box to continue.',
    saved: 'Cookie preferences saved.'
  } : {
    formDemo: 'Demonstração — nada foi enviado. No site real este formulário será conectado.',
    consent: 'Marque a caixa de consentimento (LGPD) para continuar.',
    saved: 'Preferências de cookies salvas.'
  };

  /* ---- toast ---- */
  var toastEl = document.querySelector('.toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 5200);
  }

  /* ---- footer year ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- sticky header condense ---- */
  var header = document.querySelector('.site-header');
  var ticking = false;
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-condensed', y > 24);
    parallaxEls.forEach(function (el) {
      var f = parseFloat(el.getAttribute('data-parallax')) || 0.12;
      if (y < window.innerHeight * 1.4) el.style.transform = 'translate3d(0,' + (y * f).toFixed(1) + 'px,0) scale(1.06)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      nav.classList.toggle('is-open', !open);
      if (!open) { var first = nav.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1080) closeNav(); });
  }

  /* ---- reveal on scroll (stagger via --i) ---- */
  var io = null;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  function observeReveals(root) {
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll('[data-stagger]'), function (group) {
      var kids = group.querySelectorAll(':scope > [data-reveal]');
      Array.prototype.forEach.call(kids, function (k, idx) { k.style.setProperty('--i', idx); });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-reveal]:not(.is-visible)'), function (el) {
      if (io) io.observe(el); else el.classList.add('is-visible');
    });
  }
  observeReveals(document);

  /* ---- count-up: ONLY for verified numbers (data-count). None ship in this mockup. ---- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (reduceMotion) { el.textContent = target.toLocaleString(EN ? 'en' : 'pt-BR'); return; }
      var start = null, dur = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString(EN ? 'en' : 'pt-BR');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(counters, function (c) { cio.observe(c); });
    } else { Array.prototype.forEach.call(counters, runCount); }
  }

  /* ---- carousels ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.carousel'), function (car) {
    var track = car.querySelector('.carousel-track');
    if (!track) return;
    var by = function (dir) {
      var item = track.firstElementChild;
      var w = item ? item.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
      track.scrollBy({ left: dir * w, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var prev = car.querySelector('[data-car-prev]');
    var next = car.querySelector('[data-car-next]');
    if (prev) prev.addEventListener('click', function () { by(-1); });
    if (next) next.addEventListener('click', function () { by(1); });
  });

  /* ---- click-to-load map (LGPD: no third-party embed before an explicit action) ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-map-load]'), function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.map-ph');
      if (!box) return;
      var q = btn.getAttribute('data-map-load');
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
      f.title = EN ? 'Map: ' + q : 'Mapa: ' + q;
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.className = 'map-frame';
      box.innerHTML = '';
      box.classList.add('is-loaded');
      box.appendChild(f);
    });
  });

  /* ---- demo forms (no backend) ---- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-demo]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var consent = form.querySelector('input[data-consent]');
      if (consent && !consent.checked) {
        if (status) status.textContent = T.consent;
        consent.focus();
        return;
      }
      var handler = window.SiteForms && window.SiteForms[form.getAttribute('data-demo')];
      var msg = handler ? handler(form) : T.formDemo;
      if (status) status.textContent = msg || T.formDemo;
      toast(msg || T.formDemo);
    });
  });

  /* ---- LGPD cookie consent ---- */
  var KEY = 'mockup-cookie-consent-v1';
  var banner = document.getElementById('cookie-banner');
  function readConsent() {
    try { var v = window.localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch (err) { return null; }
  }
  function writeConsent(obj) {
    obj.necessary = true;
    obj.date = new Date().toISOString();
    try { window.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (err) { /* storage blocked: keep choice for this page view only */ }
    // Analytics / marketing tags would be loaded here ONLY if obj.analytics / obj.marketing are true.
  }
  if (banner) {
    var prefs = banner.querySelector('.cookie-prefs');
    var boxA = banner.querySelector('input[name="c-analytics"]');
    var boxM = banner.querySelector('input[name="c-marketing"]');
    var saveBtn = banner.querySelector('[data-cookie="save"]');
    var lastFocus = null;
    var openBanner = function (showPrefs, moveFocus) {
      lastFocus = document.activeElement;
      var c = readConsent();
      if (boxA) boxA.checked = !!(c && c.analytics);
      if (boxM) boxM.checked = !!(c && c.marketing);
      banner.hidden = false;
      if (prefs) prefs.hidden = !showPrefs;
      if (saveBtn) saveBtn.hidden = !showPrefs;
      var h = banner.querySelector('h2');
      if (h && moveFocus) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    };
    var closeBanner = function () {
      banner.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') { writeConsent({ analytics: true, marketing: true }); closeBanner(); toast(T.saved); }
      else if (act === 'reject') { writeConsent({ analytics: false, marketing: false }); closeBanner(); toast(T.saved); }
      else if (act === 'prefs') { prefs.hidden = !prefs.hidden; if (saveBtn) saveBtn.hidden = prefs.hidden; }
      else if (act === 'save') { writeConsent({ analytics: !!(boxA && boxA.checked), marketing: !!(boxM && boxM.checked) }); closeBanner(); toast(T.saved); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-cookie-open]'), function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); openBanner(true, true); });
    });
    if (!readConsent()) openBanner(false, false);
  }

  window.SiteCore = { observeReveals: observeReveals, toast: toast, reduceMotion: reduceMotion, EN: EN };
  document.dispatchEvent(new CustomEvent('sitecore:ready'));
})();

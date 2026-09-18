/* =====================================================================
   ANNA'Z â€” CATALOGUE DATA (edit here â€” swap the week's pieces in minutes)
   ---------------------------------------------------------------------
   NOTHING BELOW IS A REAL PIECE. No garment, collection, brand, fabric,
   size or price was verifiable. Every slot is a template.
   Per piece:
     name        : text (null = "Template piece NN [CONFIRM]")
     fit         : short fabric/fit line
     sizes       : e.g. "P Â· M Â· G"   (never estimate)
     price       : number in BRL, e.g. 289.9 -> "R$ 289,90" (never USD;
                   instalments must state number, interest and total)
     composition : fabric composition exactly as on the label (no "100% algodÃ£o",
                   "sustentÃ¡vel", "feito no Brasil" unless confirmed)
     cat         : vestidos | blusas | calcas | malhas | alfaiataria | acessorios
     img / img2  : image ids (replace with the client's own photos)
   The static HTML fallback and the per-piece pages are generated from this
   same data at build time â€” regenerate after edits.
   No cart / checkout by design (phase two). Enquiry goes to WhatsApp.
   ===================================================================== */
var WA_NUMBER = ''; // [CONFIRM] +55 48 98831-1694 found in a public directory â€” NOT confirmed. Leave empty until confirmed.
var CATALOGUE ={
  "cats": [
    {"id":"vestidos","pt":"Vestidos","en":"Dresses"},
    {"id":"blusas","pt":"Blusas & camisas","en":"Blouses & shirts"},
    {"id":"calcas","pt":"Calças","en":"Trousers"},
    {"id":"malhas","pt":"Malhas & tricô","en":"Knitwear"},
    {"id":"alfaiataria","pt":"Alfaiataria","en":"Tailoring"},
    {"id":"acessorios","pt":"Acessórios","en":"Accessories"}
  ],
  "pieces": [
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"01","cat":"blusas","img":"photo-1558171813-4c088753af8f","img2":"photo-1490481651871-ab68de25d43d",
     "altPt":"Camisa clara pendurada em uma cadeira de madeira contra parede de reboco","altEn":"Pale shirt hanging on a wooden chair against a plaster wall",
     "alt2Pt":"Arara com camisas e blusas em tons neutros contra parede branca","alt2En":"Rail of shirts and blouses in neutral tones against a white wall"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"02","cat":"malhas","img":"photo-1434389677669-e08b4cac3105","img2":"photo-1558769132-cb1aea458c5e",
     "altPt":"Peça de tricô cor creme em um cabide contra parede clara","altEn":"Cream knitted piece on a hanger against a pale wall",
     "alt2Pt":"Arara com malhas em tons de areia ao lado de ramos secos","alt2En":"Rail of sand-toned knitwear beside dried grasses"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"03","cat":"calcas","img":"photo-1594633312681-425c7b97ccd1","img2":"photo-1445205170230-053b83016050",
     "altPt":"Calça de alfaiataria rosada vestida por modelo adulta, rosto fora do enquadramento","altEn":"Blush tailored trousers worn by an adult model, face out of frame",
     "alt2Pt":"Arara com roupas em tons neutros e terrosos","alt2En":"Rail of clothes in neutral and earthy tones"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"04","cat":"vestidos","img":"photo-1496747611176-843222e1e57c","img2":"photo-1490481651871-ab68de25d43d",
     "altPt":"Vestido transpassado claro estampado em modelo adulta à beira-mar, rosto fora do enquadramento","altEn":"Pale printed wrap dress on an adult model by the sea, face out of frame",
     "alt2Pt":"Arara com peças claras contra parede branca","alt2En":"Rail of pale pieces against a white wall"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"05","cat":"blusas","img":"photo-1620799140408-edc6dcb6d633","img2":"photo-1509319117193-57bab727e09d",
     "altPt":"Blusa branca dobrada sobre superfície clara com acessórios em volta","altEn":"White top laid flat on a pale surface with accessories around it",
     "alt2Pt":"Detalhe de malhas e blusas penduradas em cabides brancos","alt2En":"Detail of knits and tops on white hangers"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"06","cat":"acessorios","img":"photo-1624222247344-550fb60583dc","img2":"photo-1602173574767-37ac01994b2a",
     "altPt":"Cinto de couro marrom com fivela metálica","altEn":"Brown leather belt with a metal buckle",
     "alt2Pt":"Pulseira dourada de elos sobre páginas de revista","alt2En":"Gold chain bracelet on magazine pages"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"07","cat":"alfaiataria","img":"photo-1551232864-3f0890e580d9","img2":"photo-1445205170230-053b83016050",
     "altPt":"Arara com casacos e jaquetas em tons neutros e sapatos no chão","altEn":"Rail of coats and jackets in neutral tones with shoes below",
     "alt2Pt":"Arara com roupas em tons terrosos","alt2En":"Rail of clothes in earthy tones"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"08","cat":"acessorios","img":"photo-1560343090-f0409e92791a","img2":"photo-1533867617858-e7b97e060509",
     "altPt":"Sapato de camurça sobre bloco claro em fundo rosado","altEn":"Suede shoe on a pale block against a blush background",
     "alt2Pt":"Par de sapatos de couro marrom sobre superfície de madeira","alt2En":"Pair of brown leather shoes on a wooden surface"},
    {"name": null, "fit": null, "sizes": null, "price": null, "composition": null, "n":"09","cat":"malhas","img":"photo-1558769132-cb1aea458c5e","img2":"photo-1604176354204-9268737828e4",
     "altPt":"Textura de malhas em tons de areia penduradas lado a lado","altEn":"Texture of sand-toned knits hanging side by side",
     "alt2Pt":"Pilha de peças dobradas segurada por pessoa adulta, rosto fora do enquadramento","alt2En":"Stack of folded garments held by an adult, face out of frame"}
  ]
};


/* =====================================================================
   ANNA'Z — vitrine renderer + WhatsApp enquiry (no cart, no checkout)
   Category filter works without JS (CSS :has + radios).
   ===================================================================== */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').indexOf('en') === 0;
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var IMG = 'https://images.unsplash.com/';
  var Q = '?auto=format&fit=crop&w=720&q=70';
  var T = EN ? { name: 'Template piece', cn: '[CONFIRM piece]', fit: 'Fabric / fit', sizes: 'Sizes', cs: '[CONFIRM sizes]',
      price: '[CONFIRM price]', ask: 'Ask on WhatsApp', det: 'View details', photo: 'Illustrative', path: 'en/pieces/template-piece-',
      hello: 'Hello, ANNA\'Z! I\'m interested in this piece: ' }
    : { name: 'Peça modelo', cn: '[CONFIRM peça]', fit: 'Tecido / modelagem', sizes: 'Tamanhos', cs: '[CONFIRM tamanhos]',
      price: '[CONFIRM preço]', ask: 'Consultar pelo WhatsApp', det: 'Ver ficha', photo: 'Foto ilustrativa', path: 'pecas/peca-modelo-',
      hello: 'Olá, ANNA\'Z! Tenho interesse nesta peça: ' };
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45c6.55 0 11.89-5.34 11.89-11.89A11.82 11.82 0 0 0 12.05 0zm0 21.79a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 5.45 0 9.88 4.43 9.88 9.88 0 5.45-4.44 9.89-9.89 9.89z"/></svg>';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function conf(t) { return '<span class="confirm">' + t + '</span>'; }
  var cats = {};
  CATALOGUE.cats.forEach(function (c) { cats[c.id] = c; });

  function card(p) {
    var label = p.name ? esc(p.name) : T.name + ' ' + p.n + ' ' + conf(T.cn);
    var plain = p.name || (T.name + ' ' + p.n);
    var href = ROOT + T.path + p.n + '/index.html';
    return '<article class="piece c-' + p.cat + '" data-reveal>' +
      '<a class="piece-link" href="' + href + '"><figure class="photo piece-media" data-placeholder>' +
      '<img class="img-a" src="' + IMG + p.img + Q + '" loading="lazy" width="720" height="900" alt="' + esc(EN ? p.altEn : p.altPt) + '">' +
      '<img class="img-b" src="' + IMG + p.img2 + Q + '" loading="lazy" width="720" height="900" alt="' + esc(EN ? p.alt2En : p.alt2Pt) + '">' +
      '<figcaption class="photo-tag">' + T.photo + '</figcaption></figure>' +
      '<span class="piece-cat">' + (EN ? cats[p.cat].en : cats[p.cat].pt) + '</span>' +
      '<h3 class="piece-name">' + label + '</h3></a>' +
      '<p class="piece-line">' + T.fit + ': ' + (p.fit ? esc(p.fit) : conf('[CONFIRM]')) + '</p>' +
      '<p class="piece-line">' + T.sizes + ': ' + (p.sizes ? esc(p.sizes) : conf(T.cs)) + '</p>' +
      '<p class="piece-price">' + (p.price != null ? '<span class="price">R$ ' + Number(p.price).toFixed(2).replace('.', ',') + '</span>'
        : '<span class="price">R$ 00,00</span> ' + conf(T.price)) + '</p>' +
      '<div class="piece-actions"><a class="btn btn-wa btn-sm" href="#contato" data-enquire="' + esc(plain) + '" data-enquire-url="' + T.path + p.n + '/">' + WA_ICON + ' ' + T.ask + '</a>' +
      '<a class="btn btn-ghost btn-sm" href="' + href + '">' + T.det + '</a></div></article>';
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-vitrine-root]'), function (root) {
    root.innerHTML = CATALOGUE.pieces.map(card).join('');
  });

  /* WhatsApp enquiry with the piece pre-filled */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-enquire]');
    if (!a) return;
    var msg = T.hello + a.getAttribute('data-enquire') + ' — ' + location.origin + '/' + a.getAttribute('data-enquire-url');
    if (WA_NUMBER) {
      e.preventDefault();
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    } else if (window.SiteCore) {
      window.SiteCore.toast((EN ? 'Demo — WhatsApp number to be confirmed. Message would be: “' : 'Demonstração — número de WhatsApp a confirmar. A mensagem seria: “') + msg + '”');
    }
  });

  /* category deep link ?categoria= */
  var cat = new URLSearchParams(location.search).get('categoria');
  if (cat) { var r = document.getElementById('c-' + cat); if (r) r.checked = true; }

  window.SiteForms = window.SiteForms || {};
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

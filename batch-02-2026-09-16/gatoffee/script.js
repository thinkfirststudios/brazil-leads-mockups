/* =====================================================================
   GATOFFEE CAT CAFÉ — MENU DATA (edit here)
   ---------------------------------------------------------------------
   ⚠️ NOTHING BELOW IS REAL. Their current site publishes no menu at all.
   Every item, description, price, dietary tag and allergen is a
   placeholder until the client supplies the real menu. [CONFIRM]
   - price: number in BRL (null = not confirmed → shows "R$ 00,00 [CONFIRM preço]")
   - gluten: 'contem' | 'nao-contem' | null  (Lei 10.674/2003 — mandatory per item)
   - tags: any of 'vegano','vegetariano','sem-gluten','sem-lactose' (each must be confirmed)
   - allergens: ANVISA RDC 26/2015 list per item, e.g. ['trigo','leite','ovos']
   Never convert prices to USD.
   ===================================================================== */
var WA_NUMBER = '5548991958407'; // (48) 9 9195-8407 — verified phone. [CONFIRM it is WhatsApp-enabled]

var MENU = [
  { id: 'cafes', pt: 'Cafés', en: 'Coffee', items: [
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] },
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] },
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] }
  ]},
  { id: 'geladas', pt: 'Bebidas geladas', en: 'Cold drinks', items: [
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] },
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] }
  ]},
  { id: 'doces', pt: 'Doces', en: 'Sweets', items: [
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] },
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] }
  ]},
  { id: 'salgados', pt: 'Salgados & lanches', en: 'Savoury & snacks', items: [
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] },
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] }
  ]},
  { id: 'veganas', pt: 'Opções veganas', en: 'Vegan options', confirmSection: true, items: [
    { name: null, desc: null, price: null, gluten: null, tags: [], allergens: [] }
  ]}
];

/* =====================================================================
   MENU RENDERER + BOOKING → WHATSAPP composer
   ===================================================================== */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').indexOf('en') === 0;
  var C = function (t) { return '<span class="confirm">' + t + '</span>'; };
  var L = EN ? {
    item: '[CONFIRM item]', desc: '[CONFIRM description]', price: '[CONFIRM price]',
    gluten: '[CONFIRM] CONTAINS GLUTEN / GLUTEN-FREE', contem: 'CONTAINS GLUTEN', nao: 'GLUTEN-FREE',
    diet: 'dietary tags [CONFIRM]', allergens: 'Allergens: [CONFIRM]', section: '[CONFIRM whether offered]',
    tagNames: { 'vegano': 'vegan', 'vegetariano': 'vegetarian', 'sem-gluten': 'gluten-free', 'sem-lactose': 'lactose-free' }
  } : {
    item: '[CONFIRM item]', desc: '[CONFIRM descrição]', price: '[CONFIRM preço]',
    gluten: '[CONFIRM] CONTÉM GLÚTEN / NÃO CONTÉM GLÚTEN', contem: 'CONTÉM GLÚTEN', nao: 'NÃO CONTÉM GLÚTEN',
    diet: 'tags alimentares [CONFIRM]', allergens: 'Alérgenos: [CONFIRM]', section: '[CONFIRM se é oferecido]',
    tagNames: { 'vegano': 'vegano', 'vegetariano': 'vegetariano', 'sem-gluten': 'sem glúten', 'sem-lactose': 'sem lactose' }
  };
  function money(v) {
    if (v === null || v === undefined) return '<span><span class="price">R$ 00,00</span> ' + C(L.price) + '</span>';
    return '<span class="price">R$ ' + v.toFixed(2).replace('.', ',') + '</span>';
  }
  function renderMenu(root) {
    var html = '';
    MENU.forEach(function (g) {
      html += '<div class="menu-group" id="menu-' + g.id + '"><h3>' + (EN ? g.en : g.pt) +
        (g.confirmSection ? ' ' + C(L.section) : '') + '</h3>';
      g.items.forEach(function (it) {
        var tags = it.tags.length ? it.tags.map(function (t) { return '<span class="tag">' + L.tagNames[t] + '</span>'; }).join('') : '<span class="tag">' + L.diet + '</span>';
        var gl = it.gluten === 'contem' ? L.contem : it.gluten === 'nao-contem' ? L.nao : L.gluten;
        html += '<div class="menu-item" data-reveal>' +
          '<span class="mi-name">' + (it.name || C(L.item)) + '</span>' + money(it.price) +
          '<p class="mi-desc">' + (it.desc || C(L.desc)) + '</p>' +
          '<div class="tags">' + tags + '<span class="tag gluten">' + gl + '</span>' +
          '<span class="tag">' + (it.allergens.length ? (EN ? 'Allergens: ' : 'Alérgenos: ') + it.allergens.join(', ') : L.allergens) + '</span></div></div>';
      });
      html += '</div>';
    });
    root.innerHTML = html;
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-menu-root]'), renderMenu);

  /* guest stepper */
  Array.prototype.forEach.call(document.querySelectorAll('.guest-stepper'), function (st) {
    var input = st.querySelector('input');
    st.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-step]');
      if (!b) return;
      var v = (parseInt(input.value, 10) || 1) + parseInt(b.getAttribute('data-step'), 10);
      input.value = Math.max(1, Math.min(v, parseInt(input.max, 10) || 99));
    });
  });

  /* booking form → WhatsApp message (no backend) */
  function ddmm(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  }
  window.SiteForms = window.SiteForms || {};
  window.SiteForms.booking = function (form) {
    var f = form.elements;
    if (!f['data'].value || !f['sessao'].value || !f['nome'].value.trim()) {
      var miss = f['data'].value ? (f['sessao'].value ? f['nome'] : f['sessao']) : f['data'];
      miss.focus();
      return EN ? 'Please fill in date, session and name.' : 'Preencha data, sessão e nome.';
    }
    var lines = EN ? [
      'Hello, Gatoffee! I would like to book a visit.',
      'Name: ' + f['nome'].value,
      'Date: ' + ddmm(f['data'].value),
      'Session: ' + f['sessao'].value,
      'Guests: ' + f['pessoas'].value,
      f['obs'].value ? 'Notes: ' + f['obs'].value : ''
    ] : [
      'Olá, Gatoffee! Gostaria de agendar uma visita.',
      'Nome: ' + f['nome'].value,
      'Data: ' + ddmm(f['data'].value),
      'Sessão: ' + f['sessao'].value,
      'Pessoas: ' + f['pessoas'].value,
      f['obs'].value ? 'Observações: ' + f['obs'].value : ''
    ];
    var text = lines.filter(Boolean).join('\n');
    var pre = form.querySelector('.wa-preview');
    var link = form.querySelector('.wa-open');
    if (pre) pre.textContent = text;
    if (link && WA_NUMBER) {
      link.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      link.hidden = false;
    }
    return EN ? 'Message ready (demo). Review it below and open WhatsApp to send it.'
              : 'Mensagem pronta (demonstração). Confira abaixo e abra o WhatsApp para enviar.';
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

/* Dom Sorriso — mockup behaviour (progressive enhancement:
   every section, the specialty finder and the convênios list work without JS) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = (doc.getAttribute('lang') || 'pt-BR').slice(0, 2);

  var T = {
    pt: { found: function (n) { return n === 1 ? '1 tratamento encontrado' : n + ' tratamentos encontrados'; }, none: 'Nenhum tratamento encontrado. Tente outro termo ou fale com a recepção.', demo: 'Demonstração: este formulário não envia dados. Na versão final, a solicitação segue para o sistema de agendamento da clínica.', consent: 'Marque a caixa de consentimento para continuar.', plans: function (n) { return n + ' resultado(s)'; } },
    en: { found: function (n) { return n === 1 ? '1 treatment found' : n + ' treatments found'; }, none: 'No treatment found. Try another term or contact reception.', demo: 'Demo only: this form does not send any data. In the live version the request goes to the clinic’s booking system.', consent: 'Please tick the consent box to continue.', plans: function (n) { return n + ' result(s)'; } },
    es: { found: function (n) { return n === 1 ? '1 especialidad encontrada' : n + ' tratamentos encontrados'; }, none: 'No se encontró ninguna especialidad. Pruebe otro término o contacte a recepción.', demo: 'Demostración: este formulario no envía datos. En la versión final, la solicitud va al sistema de turnos de la clínica.', consent: 'Marque la casilla de consentimiento para continuar.', plans: function (n) { return n + ' resultado(s)'; } }
  }[lang] || null;
  if (!T) { T = { found: function (n) { return n; }, none: '', demo: '', consent: '', plans: function (n) { return n; } }; }

  /* ---------- year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- sticky header condense ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');
  function setNavTop() { if (header && nav) nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px'); }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      setNavTop();
      burger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); burger.focus(); }
    });
    window.addEventListener('resize', setNavTop);
  }

  /* ---------- scroll reveal (calm) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- count-up (only for elements carrying a VERIFIED data-count) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || reduce || !('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; o.disconnect();
      var start = null, from = Math.max(0, target - 20);
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / 900, 1); el.textContent = Math.round(from + (target - from) * p); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
    o.observe(el);
  });

  /* ---------- specialty finder ---------- */
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var finder = document.querySelector('[data-finder]');
  if (finder) {
    var input = finder.querySelector('[data-finder-input]');
    var chips = finder.querySelectorAll('[data-filter]');
    var tiles = finder.querySelectorAll('.tile');
    var groups = finder.querySelectorAll('[data-group]');
    var status = finder.querySelector('[data-finder-status]');
    var current = 'all';
    function apply() {
      var q = norm(input ? input.value : '');
      var shown = 0;
      Array.prototype.forEach.call(tiles, function (t) {
        var okGroup = current === 'all' || t.getAttribute('data-kind') === current;
        var okText = !q || norm(t.textContent + ' ' + (t.getAttribute('data-keywords') || '')).indexOf(q) > -1;
        var show = okGroup && okText;
        var wasHidden = t.classList.contains('is-hidden');
        t.classList.toggle('is-hidden', !show);
        if (show) {
          shown++;
          if (wasHidden && !reduce) { t.classList.remove('is-entering'); void t.offsetWidth; t.classList.add('is-entering'); }
        }
      });
      Array.prototype.forEach.call(groups, function (g) {
        g.hidden = !g.querySelector('.tile:not(.is-hidden)');
      });
      if (status) status.textContent = shown ? T.found(shown) : T.none;
    }
    if (input) input.addEventListener('input', apply);
    Array.prototype.forEach.call(chips, function (c) {
      c.setAttribute('role', 'button');
      c.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); c.click(); } });
      c.addEventListener('click', function (e) {
        e.preventDefault();
        current = c.getAttribute('data-filter');
        Array.prototype.forEach.call(chips, function (x) { x.setAttribute('aria-pressed', String(x === c)); });
        apply();
      });
    });
    var ff = finder.querySelector('form');
    if (ff) ff.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
  }

  /* ---------- convênios search ---------- */
  var planInput = document.querySelector('[data-plan-input]');
  if (planInput) {
    var plans = document.querySelectorAll('[data-plan-list] li');
    var pStatus = document.querySelector('[data-plan-status]');
    planInput.addEventListener('input', function () {
      var q = norm(planInput.value), n = 0;
      Array.prototype.forEach.call(plans, function (li) { var ok = !q || norm(li.textContent).indexOf(q) > -1; li.classList.toggle('is-hidden', !ok); if (ok) n++; });
      if (pStatus) pStatus.textContent = T.plans(n);
    });
    var pf = planInput.closest('form');
    if (pf) pf.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ---------- quick select → specialty page ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-quick]'), function (form) {
    form.addEventListener('submit', function (e) {
      var sel = form.querySelector('select');
      if (sel && sel.value) { e.preventDefault(); window.location.href = sel.value; }
    });
  });

  /* ---------- carousels ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (c) {
    var track = c.querySelector('.carousel-track');
    Array.prototype.forEach.call(c.querySelectorAll('[data-dir]'), function (b) {
      b.addEventListener('click', function () {
        var dir = parseInt(b.getAttribute('data-dir'), 10);
        var item = track.firstElementChild;
        var w = item ? item.getBoundingClientRect().width + 16 : 300;
        track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------- demo forms ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-demo]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = form.querySelector('input[data-consent]');
      var notice = form.querySelector('.form-notice');
      if (consent && !consent.checked) { consent.focus(); if (notice) { notice.textContent = T.consent; notice.classList.add('is-visible'); } return; }
      if (notice) { notice.textContent = T.demo; notice.classList.add('is-visible'); }
    });
  });

  /* ---------- UNIT SWITCHER (Santa Mônica / Ingleses) ----------
     Without JS both units stay visible and every link works.
     With JS the chosen unit is remembered (per-viewer convenience only),
     the booking card cross-fades, and the sticky CTA + WhatsApp follow the unit. */
  var UNIT_KEY = 'ds_unit_v1';
  var unitNames = { 'santa-monica': 'Santa Mônica', 'ingleses': 'Ingleses' };
  function setUnit(unit, focusPanel) {
    if (!unitNames[unit]) return;
    try { localStorage.setItem(UNIT_KEY, unit); } catch (e) { /* ignore */ }
    doc.setAttribute('data-unit', unit);
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-btn]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-unit-btn') === unit));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-panel]'), function (p) {
      var on = p.getAttribute('data-unit-panel') === unit;
      p.hidden = !on;
      if (on && !reduce) { p.classList.remove('is-fading'); void p.offsetWidth; p.classList.add('is-fading'); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-link]'), function (a) {
      var h = a.getAttribute('data-href-' + unit); if (h) a.setAttribute('href', h);
      var lbl = a.querySelector('.unit-label'); if (lbl) lbl.textContent = unitNames[unit];
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-select]'), function (s) { s.value = unit; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-card]'), function (c) {
      c.classList.toggle('is-selected', c.getAttribute('data-unit-card') === unit);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-current]'), function (el) { el.textContent = unitNames[unit]; });
    if (focusPanel) { var st = document.querySelector('[data-unit-status]'); if (st) st.textContent = (lang === 'en' ? 'Selected unit: ' : 'Unidade selecionada: ') + unitNames[unit]; }
  }
  var unitBtns = document.querySelectorAll('[data-unit-btn]');
  if (unitBtns.length) {
    doc.classList.add('has-units');
    Array.prototype.forEach.call(unitBtns, function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); setUnit(b.getAttribute('data-unit-btn'), true); if (b.hasAttribute('data-unit-go')) { var tg = document.querySelector(b.getAttribute('href')); if (tg) { tg.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } } });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-unit-select]'), function (s) {
      s.addEventListener('change', function () { if (s.value) setUnit(s.value, true); });
    });
    var savedUnit = null;
    try { savedUnit = localStorage.getItem(UNIT_KEY); } catch (e) { savedUnit = null; }
    var forced = document.body.getAttribute('data-page-unit');
    if (forced) setUnit(forced, false);
    else if (savedUnit) setUnit(savedUnit, false);
  }

  /* ---------- LGPD cookie banner ---------- */
  var KEY = 'ds_cookie_consent_v1';
  var sheet = document.getElementById('cookie-sheet');
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  if (sheet) {
    var prefs = sheet.querySelector('.cookie-prefs');
    var an = sheet.querySelector('#ck-analytics');
    var mk = sheet.querySelector('#ck-marketing');
    var prefBtn = sheet.querySelector('[data-ck="prefs"]');
    var saveBtn = sheet.querySelector('[data-ck="save"]');
    function openSheet(showPrefs) {
      var saved = read();
      if (an) an.checked = !!(saved && saved.analytics);
      if (mk) mk.checked = !!(saved && saved.marketing);
      sheet.hidden = false;
      if (prefs) prefs.hidden = !showPrefs;
      if (saveBtn) saveBtn.hidden = !showPrefs;
      if (prefBtn) prefBtn.setAttribute('aria-expanded', String(!!showPrefs));
    }
    function close(v) { v.date = new Date().toISOString(); store(v); sheet.hidden = true; }
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); if (!b) return;
      var k = b.getAttribute('data-ck');
      if (k === 'accept') close({ necessary: true, analytics: true, marketing: true });
      if (k === 'reject') close({ necessary: true, analytics: false, marketing: false });
      if (k === 'prefs') { var o = prefs.hidden; prefs.hidden = !o; saveBtn.hidden = !o; b.setAttribute('aria-expanded', String(o)); }
      if (k === 'save') close({ necessary: true, analytics: !!(an && an.checked), marketing: !!(mk && mk.checked) });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-cookie-open]'), function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); openSheet(true); var f = sheet.querySelector('button'); if (f) f.focus(); });
    });
    if (!read()) openSheet(false);
  }

  /* ---------- click-to-load maps (LGPD: no third-party embed before consent/click) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-map-load]'), function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map-src]'); if (!box) return;
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-map-src');
      f.title = box.getAttribute('data-map-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('is-loaded');
      f.focus();
    });
  });
})();
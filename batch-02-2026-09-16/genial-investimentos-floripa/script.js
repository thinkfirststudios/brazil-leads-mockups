/* =========================================================================
   Genial Investimentos · Florianópolis — mockup · script compartilhado
   Movimento mínimo e estável. Sem contadores, sem simuladores, sem
   calculadoras, sem dados de mercado — por exigência regulatória (CVM).
   ========================================================================= */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // current year
  var y = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });

  // sticky header condense
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('mobile-panel');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
  }

  // understated scroll reveals
  var els = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }

  // "Eventos" link pre-selects the neutral interest option
  document.querySelectorAll('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = document.getElementById('ag-interesse');
      if (sel) sel.value = a.getAttribute('data-interest');
    });
  });

  // booking form — demo only; never submits, never collects financial data
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = f.querySelector('.form-note');
      var consent = f.querySelector('input[name="lgpd"]');
      if (consent && !consent.checked) {
        note.textContent = EN ? 'Please tick the privacy consent box to continue.' : 'Marque a caixa de consentimento de privacidade para continuar.';
        note.classList.add('is-on');
        consent.focus();
        return;
      }
      note.textContent = EN
        ? 'Demo only — nothing was sent. In production this request is routed to the firm’s approved channel [CONFIRM].'
        : 'Demonstração — nada foi enviado. Em produção, a solicitação segue para o canal aprovado pela instituição [CONFIRM].';
      note.classList.add('is-on');
    });
  });

  /* ---- Map: third-party iframe injected ONLY after an explicit click (LGPD) ---- */
  document.querySelectorAll('[data-map-load]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map]');
      if (!box) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(box.getAttribute('data-map')) + '&output=embed';
      f.title = box.getAttribute('data-map-title') || (EN ? 'Map' : 'Mapa');
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.className = 'map-frame';
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('is-loaded');
    });
  });

  /* ---- LGPD cookie consent ---------------------------------------- */
  var KEY = 'genial-floripa-cookie-consent-v1';
  var banner = document.getElementById('cookie');
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* unavailable */ } }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function open(showPrefs) {
    if (!banner) return;
    var saved = read() || {};
    banner.querySelectorAll('input[data-cat]').forEach(function (i) { i.checked = !!saved[i.getAttribute('data-cat')]; });
    banner.querySelector('.cookie__prefs').hidden = !showPrefs;
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
  }
  function close() {
    banner.classList.remove('is-open');
    setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 400);
  }
  if (banner) {
    if (!read()) open(false);
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cookie]');
      if (!b) return;
      var a = b.getAttribute('data-cookie');
      if (a === 'accept') { store({ necessarios: true, analise: true, marketing: true, ts: Date.now() }); close(); }
      else if (a === 'reject') { store({ necessarios: true, analise: false, marketing: false, ts: Date.now() }); close(); }
      else if (a === 'prefs') {
        var prefs = banner.querySelector('.cookie__prefs');
        if (prefs.hidden) { prefs.hidden = false; b.textContent = EN ? 'Save choices' : 'Salvar escolhas'; }
        else {
          var v = { necessarios: true, ts: Date.now() };
          banner.querySelectorAll('input[data-cat]').forEach(function (i) { v[i.getAttribute('data-cat')] = i.checked; });
          store(v); close();
          b.textContent = EN ? 'Preferences' : 'Preferências';
        }
      }
    });
  }
  document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
    b.addEventListener('click', function () { open(true); });
  });
})();

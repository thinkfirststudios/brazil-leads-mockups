/* =====================================================================
   Regente Imoveis — spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   LANGUAGE: shared by the pt-BR, /en/ and /es/ trees, which are REAL
   parallel pages with their own translated markup. Only the strings JS
   itself produces are switched here.

   PRESERVED FROM THEIR LIVE SITE, DELIBERATELY: the Comprar/Alugar
   sliding toggle built on radio inputs, and the autocomplete with
   keyboard hints and full combobox ARIA. Both are genuinely good and
   rebuilding them worse would be a downgrade. A third tab, Lancamentos,
   is added and swaps the field set.
   ===================================================================== */
(function () {
  'use strict';

  var docLang = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var IS_EN = docLang.indexOf('en') === 0;
  var IS_ES = docLang.indexOf('es') === 0;

  function t(pt, en, es) {
    if (IS_ES) { return es === undefined ? en : es; }
    return IS_EN ? en : pt;
  }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     WHATSAPP
     Regente publishes a landline, (48) 3233-1919, and no WhatsApp number.
     A landline is not a WhatsApp line, so nothing is dialled: every
     WhatsApp control is visibly disabled and says why. The tel: links to
     the published landline DO work, because that number is published.
     Set WA_NUMBER to '5548...' once a business WhatsApp is confirmed.
     =================================================================== */
  var WA_NUMBER = null; /* [CONFIRM] */
  var PHONE = '+554832331919';

  function noNumber() {
    window.alert(t(
      'MOCKUP: a Regente publica o telefone fixo (48) 3233-1919, mas nenhum numero de WhatsApp. Um fixo nao e uma linha de WhatsApp, entao nada e discado aqui ate que um numero comercial seja confirmado. O botao Ligar funciona normalmente.',
      'MOCKUP: Regente publishes the landline (48) 3233-1919 but no WhatsApp number. A landline is not a WhatsApp line, so nothing is dialled here until a business number is confirmed. The Call button works normally.',
      'MOCKUP: Regente publica el telefono fijo (48) 3233-1919, pero ningun numero de WhatsApp. Un fijo no es una linea de WhatsApp, asi que aca no se marca nada hasta confirmar un numero comercial. El boton Llamar funciona con normalidad.'
    ));
  }

  function wireWA(el, msg) {
    if (WA_NUMBER) {
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.removeAttribute('data-unconfirmed');
    } else {
      el.setAttribute('href', '#');
      el.setAttribute('data-unconfirmed', '');
      el.setAttribute('aria-describedby', 'wa-unconfirmed-note');
      el.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
    }
  }

  function wireAllWA() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      wireWA(nodes[i], nodes[i].getAttribute('data-wa') || t('Ola!', 'Hello!', 'Hola!'));
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) { tels[j].setAttribute('href', 'tel:' + PHONE); }
  }

  /* ===================================================================
     Sticky header, mobile nav, reveals, parallax
     =================================================================== */
  function header() {
    var head = document.querySelector('.site-head');
    var burger = document.querySelector('.burger');
    var mnav = document.querySelector('.mobile-nav');
    if (head) {
      var onScroll = function () {
        if (window.pageYOffset > 24) { head.classList.add('condensed'); }
        else { head.classList.remove('condensed'); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    if (burger && mnav) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', open ? 'false' : 'true');
        mnav.classList.toggle('open', !open);
      });
      var links = mnav.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
          burger.setAttribute('aria-expanded', 'false');
          mnav.classList.remove('open');
        });
      }
    }
  }

  function reveals() {
    var items = document.querySelectorAll('.rev');
    if (!items.length) { return; }
    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) { items[i].classList.add('in'); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        var e = entries[j];
        if (!e.isIntersecting) { continue; }
        var el = e.target, idx = 0, sib = el;
        while ((sib = sib.previousElementSibling)) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
        }
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
  }

  function parallax() {
    var media = document.querySelector('.hero-media img');
    if (!media || reduced) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset;
      if (y < 900) { media.style.transform = 'translate3d(0,' + (y * 0.14) + 'px,0) scale(1.06)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.06)';
  }

  /* ===================================================================
     Count-ups.
     The figures Regente publishes about itself (31+ anos, 2.000+ imoveis,
     5.000+ clientes) animate. Anything whose data-count is not a number -
     because it is a visible [CONFIRM] placeholder, as the unsourced 4.9
     rating is - returns immediately and never animates to a made-up value.
     =================================================================== */
  function countUps() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) { return; }
    function fmt(n, sep) {
      var s = String(n);
      if (!sep) { return s; }
      return s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    }
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) { return; }
      var sep = el.getAttribute('data-sep') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = fmt(target, sep) + suffix; return; }
      var start = null, dur = 1300;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased), sep) + suffix;
        if (p < 1) { window.requestAnimationFrame(step); }
      }
      window.requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) { run(nodes[i]); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) { run(entries[j].target); io.unobserve(entries[j].target); }
      }
    }, { threshold: 0.4 });
    for (var k = 0; k < nodes.length; k++) { io.observe(nodes[k]); }
  }

  /* ===================================================================
     HERO SEARCH — tabs + combobox autocomplete
     The tab set swaps the visible field group. Lancamentos is the added
     third tab and swaps in construtora / regiao / estagio da obra.
     Without JavaScript the form still submits: it is a real <form> with
     real named fields and a real submit button.
     =================================================================== */
  function searchTabs() {
    var box = document.getElementById('search');
    if (!box) { return; }
    var radios = box.querySelectorAll('.tab input[type="radio"]');
    function apply() {
      var chosen = box.querySelector('.tab input:checked');
      var mode = chosen ? chosen.value : 'comprar';
      var groups = box.querySelectorAll('[data-mode]');
      for (var i = 0; i < groups.length; i++) {
        groups[i].hidden = groups[i].getAttribute('data-mode') !== mode;
      }
    }
    for (var r = 0; r < radios.length; r++) {
      radios[r].addEventListener('change', apply);
    }
    apply();
  }

  function combobox() {
    var input = document.getElementById('q');
    var list = document.getElementById('q-list');
    if (!input || !list) { return; }
    var raw = (input.getAttribute('data-options') || '').split('|');
    var options = [];
    for (var i = 0; i < raw.length; i++) {
      if (raw[i]) { options.push(raw[i]); }
    }
    var active = -1, current = [];

    function close() {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }

    function render(items) {
      current = items;
      list.innerHTML = '';
      for (var j = 0; j < items.length; j++) {
        var li = document.createElement('li');
        li.id = 'q-opt-' + j;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.textContent = items[j];
        (function (value) {
          li.addEventListener('mousedown', function (ev) {
            ev.preventDefault();
            input.value = value;
            close();
          });
        })(items[j]);
        list.appendChild(li);
      }
      if (items.length) {
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
      } else {
        close();
      }
    }

    function mark(n) {
      var lis = list.querySelectorAll('li');
      for (var k = 0; k < lis.length; k++) {
        lis[k].setAttribute('aria-selected', k === n ? 'true' : 'false');
      }
      if (n > -1 && lis[n]) {
        input.setAttribute('aria-activedescendant', lis[n].id);
        lis[n].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    input.addEventListener('input', function () {
      var v = input.value.trim().toLowerCase();
      if (!v) { close(); return; }
      var hits = [];
      for (var m = 0; m < options.length && hits.length < 8; m++) {
        if (options[m].toLowerCase().indexOf(v) > -1) { hits.push(options[m]); }
      }
      render(hits);
      mark(-1);
    });

    input.addEventListener('keydown', function (ev) {
      if (list.hidden && (ev.key === 'ArrowDown' || ev.key === 'ArrowUp')) { return; }
      if (ev.key === 'ArrowDown') {
        ev.preventDefault(); active = Math.min(active + 1, current.length - 1); mark(active);
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault(); active = Math.max(active - 1, -1); mark(active);
      } else if (ev.key === 'Enter') {
        if (active > -1 && current[active]) { ev.preventDefault(); input.value = current[active]; close(); }
      } else if (ev.key === 'Escape') {
        close();
      }
    });

    input.addEventListener('blur', function () { window.setTimeout(close, 120); });
    close();
  }

  /* ===================================================================
     Favoritos — the saved-property layer they already run live.
     Stored per browser only. No account, no server, nothing sent.
     =================================================================== */
  var FAV_KEY = 'rg_favs_v1';

  function favourites() {
    var counter = document.querySelector('[data-fav-count]');
    var hearts = document.querySelectorAll('.heart');
    var saved = {};
    try { saved = JSON.parse(window.localStorage.getItem(FAV_KEY) || '{}') || {}; }
    catch (e) { saved = {}; }

    function count() {
      var n = 0, k;
      for (k in saved) { if (saved[k]) { n++; } }
      return n;
    }
    function paint() {
      if (counter) { counter.textContent = String(count()); }
    }
    function persist() {
      try { window.localStorage.setItem(FAV_KEY, JSON.stringify(saved)); } catch (e) { /* private mode */ }
    }

    for (var i = 0; i < hearts.length; i++) {
      (function (btn) {
        var id = btn.getAttribute('data-id') || '';
        btn.setAttribute('aria-pressed', saved[id] ? 'true' : 'false');
        btn.addEventListener('click', function () {
          saved[id] = !saved[id];
          btn.setAttribute('aria-pressed', saved[id] ? 'true' : 'false');
          persist();
          paint();
        });
      })(hearts[i]);
    }
    paint();
  }

  /* ===================================================================
     LGPD consent (Lei 13.709/2018)
     Regente loads Google Tag Manager (GTM-P84HNL97) on the live site, so
     consent has to GATE it rather than sit beside it. Non-essential is
     off by default and reject is as prominent as accept. In this mockup
     the consented branch is deliberately inert: no tag ever fires.
     =================================================================== */
  var CONSENT_KEY = 'rg_lgpd_v1';

  function consent() {
    var sheet = document.getElementById('lgpd');
    if (!sheet) { return; }
    var prefs = document.getElementById('lgpd-prefs');
    var btnAccept = document.getElementById('lgpd-accept');
    var btnReject = document.getElementById('lgpd-reject');
    var btnPrefs = document.getElementById('lgpd-open-prefs');
    var btnSave = document.getElementById('lgpd-save');
    var reopen = document.querySelectorAll('[data-lgpd-reopen]');

    function show() { sheet.classList.add('show'); sheet.removeAttribute('aria-hidden'); }
    function hide() { sheet.classList.remove('show'); sheet.setAttribute('aria-hidden', 'true'); }

    function store(analytics, marketing) {
      try {
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify(
          { a: !!analytics, m: !!marketing, ts: new Date().toISOString() }));
      } catch (e) { /* private mode */ }
      /* GTM would be injected HERE, behind requestIdleCallback, and only
         when analytics consent is true. Left deliberately empty in the
         mockup so nothing is loaded and nothing is measured. */
      hide();
    }

    if (prefs) { prefs.hidden = true; }
    if (btnPrefs && prefs) {
      btnPrefs.addEventListener('click', function () {
        prefs.hidden = !prefs.hidden;
        btnPrefs.setAttribute('aria-expanded', prefs.hidden ? 'false' : 'true');
      });
    }
    if (btnAccept) { btnAccept.addEventListener('click', function () { store(true, true); }); }
    if (btnReject) { btnReject.addEventListener('click', function () { store(false, false); }); }
    if (btnSave) {
      btnSave.addEventListener('click', function () {
        var a = document.getElementById('ck-analytics');
        var m = document.getElementById('ck-marketing');
        store(a && a.checked, m && m.checked);
      });
    }
    for (var i = 0; i < reopen.length; i++) {
      reopen[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        if (prefs) { prefs.hidden = false; }
        show();
      });
    }
    var seen = null;
    try { seen = window.localStorage.getItem(CONSENT_KEY); } catch (e) { seen = null; }
    if (!seen) { window.setTimeout(show, 900); } else { hide(); }
  }

  function year() {
    var nodes = document.querySelectorAll('[data-year]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  function init() {
    header();
    reveals();
    parallax();
    countUps();
    searchTabs();
    combobox();
    favourites();
    consent();
    year();
    wireAllWA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

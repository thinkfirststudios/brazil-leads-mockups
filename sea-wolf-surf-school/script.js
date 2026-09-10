/* =====================================================================
   Sea Wolf Surf School + Surf Hostel - spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   LANGUAGE: shared by the pt-BR and /en/ trees, which are REAL parallel
   pages with their own translated markup. Only the strings JS itself
   produces are switched here. Their live site has no English version and
   no hreflang at all, on a business whose own footer tagline is in
   English and whose Work & Surf product is sold to international nomads.

   THE TWO-DOOR SWITCH is a real ARIA tablist: keyboard-operable with
   arrow keys, Home and End, and the selected door announced. It reorders
   the nav without a page load, so the visitor is asked what they came to
   do rather than which of two businesses they want.
   ===================================================================== */
(function () {
  'use strict';

  var IS_EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return IS_EN ? en : pt; }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WA = '5548988219440';

  function wireWA() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      var msg = nodes[i].getAttribute('data-wa') ||
        t('Ola! Vim pelo site da Sea Wolf.', 'Hi! I came from the Sea Wolf website.');
      nodes[i].setAttribute('href', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg));
      nodes[i].setAttribute('target', '_blank');
      nodes[i].setAttribute('rel', 'noopener');
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) { tels[j].setAttribute('href', 'tel:+5548988219440'); }
  }

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

  /* ===================================================================
     THE TWO-DOOR SWITCH
     =================================================================== */
  function doors() {
    var list = document.querySelector('.doors');
    if (!list) { return; }
    var tabs = list.querySelectorAll('.door');
    var navs = document.querySelectorAll('[data-door-panel]');
    var live = document.getElementById('door-status');

    function select(name, focus) {
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].getAttribute('data-door') === name;
        tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
        tabs[i].setAttribute('tabindex', on ? '0' : '-1');
        if (on && focus) { tabs[i].focus(); }
      }
      for (var j = 0; j < navs.length; j++) {
        navs[j].hidden = navs[j].getAttribute('data-door-panel') !== name;
      }
      if (live) {
        live.textContent = name === 'surfar'
          ? t('Menu de surf selecionado: aulas, surf guide, surf and stay, camps e aluguel.',
              'Surf menu selected: lessons, surf guide, surf and stay, camps and board rental.')
          : t('Menu de hospedagem selecionado: Barra da Lagoa, Lagoa da Conceicao, Campeche e Work and Surf.',
              'Stay menu selected: Barra da Lagoa, Lagoa da Conceicao, Campeche and Work and Surf.');
      }
      try { window.localStorage.setItem('sw_door', name); } catch (e) { /* private mode */ }
    }

    for (var k = 0; k < tabs.length; k++) {
      (function (btn, idx) {
        btn.addEventListener('click', function () { select(btn.getAttribute('data-door'), false); });
        btn.addEventListener('keydown', function (ev) {
          var next = null;
          if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { next = (idx + 1) % tabs.length; }
          else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') { next = (idx - 1 + tabs.length) % tabs.length; }
          else if (ev.key === 'Home') { next = 0; }
          else if (ev.key === 'End') { next = tabs.length - 1; }
          if (next !== null) {
            ev.preventDefault();
            select(tabs[next].getAttribute('data-door'), true);
          }
        });
      })(tabs[k], k);
    }

    var saved = null;
    try { saved = window.localStorage.getItem('sw_door'); } catch (e) { saved = null; }
    select(saved === 'ficar' ? 'ficar' : 'surfar', false);
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
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.07 });
    for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
  }

  function parallax() {
    var media = document.querySelector('.hero-media img');
    if (!media || reduced) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset;
      if (y < 900) { media.style.transform = 'translate3d(0,' + (y * 0.15) + 'px,0) scale(1.07)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.07)';
  }

  /* Their own published counts animate; anything non-numeric - a visible
     [CONFIRM] - returns immediately and never animates to a made-up value. */
  function countUps() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) { return; }
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) { return; }
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = pre + target + suf; return; }
      var start = null, dur = 1200;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(target * eased) + suf;
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
     SURF & STAY CONFIGURATOR
     Their own four steps, turned into a mechanic: unidade -> noites
     (min. 2) -> aulas -> resultado. The result panel does NOT fake a
     price: Surf & Stay is sold as a "pacote personalizado" with no
     published rate, so it composes a WhatsApp message and links to the
     correct Cloudbeds property, with the price left as R$ [CONFIRM].
     =================================================================== */
  function configurator() {
    var box = document.getElementById('config');
    if (!box) { return; }
    var outUnit = document.getElementById('out-unit');
    var outNights = document.getElementById('out-nights');
    var outLessons = document.getElementById('out-lessons');
    var send = document.getElementById('config-send');
    var book = document.getElementById('config-book');

    function pick(name) {
      var c = box.querySelector('input[name="' + name + '"]:checked');
      return c || null;
    }

    function update() {
      var u = pick('unidade'), n = pick('noites'), a = pick('aulas');
      var uLabel = u ? u.getAttribute('data-label') : t('a escolher', 'to choose');
      var nLabel = n ? n.value : t('a escolher', 'to choose');
      var aLabel = a ? a.value : t('a escolher', 'to choose');
      if (outUnit) { outUnit.textContent = uLabel; }
      if (outNights) { outNights.textContent = nLabel; }
      if (outLessons) { outLessons.textContent = aLabel; }
      if (book && u) {
        book.setAttribute('href', u.getAttribute('data-cloudbeds'));
        book.removeAttribute('aria-disabled');
      }
      if (!send) { return; }
      var msg = t(
        'Ola! Queria um Surf & Stay: unidade ' + uLabel + ', ' + nLabel + ' noites, ' + aLabel +
          ' aulas. Podem me passar o valor do pacote?',
        'Hi! I would like a Surf & Stay: ' + uLabel + ' unit, ' + nLabel + ' nights, ' + aLabel +
          ' lessons. Could you send me the package price?');
      var clone = send.cloneNode(true);
      clone.setAttribute('data-wa', msg);
      send.parentNode.replaceChild(clone, send);
      send = clone;
      send.setAttribute('href', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg));
      send.setAttribute('target', '_blank');
      send.setAttribute('rel', 'noopener');
    }

    var inputs = box.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < inputs.length; i++) { inputs[i].addEventListener('change', update); }
    update();
  }

  function rails() {
    var groups = document.querySelectorAll('[data-rail]');
    for (var i = 0; i < groups.length; i++) {
      (function (g) {
        var rail = g.querySelector('.rail');
        var prev = g.querySelector('[data-rail-prev]');
        var next = g.querySelector('[data-rail-next]');
        if (!rail) { return; }
        function go(dir) {
          var step = Math.max(240, Math.round(rail.clientWidth * 0.6));
          rail.scrollBy({ left: dir * step, top: 0, behavior: reduced ? 'auto' : 'smooth' });
        }
        if (prev) { prev.addEventListener('click', function () { go(-1); }); }
        if (next) { next.addEventListener('click', function () { go(1); }); }
      })(groups[i]);
    }
  }

  /* ===================================================================
     LGPD consent (Lei 13.709/2018)
     They run Google Tag Manager and hand booking off to Cloudbeds, a
     third-party processor. Non-essential is off by default, reject is as
     prominent as accept, and the consented branch is deliberately inert
     in this mockup: no tag fires and no booking widget is embedded.
     =================================================================== */
  var CONSENT_KEY = 'sw_lgpd_v1';

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
    wireWA();
    header();
    doors();
    reveals();
    parallax();
    countUps();
    configurator();
    rails();
    consent();
    year();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =====================================================================
   Samatva Yoga - spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   LANGUAGE: shared by the pt-BR and /en/ trees, which are REAL parallel
   pages with their own translated markup. Only the strings JS itself
   produces are switched here.

   THE TIMETABLE IS THE POINT. Their live site publishes no class times at
   all, so every "what time, where, am I too new for this" question has to
   be asked over WhatsApp before anyone can decide. The grade below ships
   as STRUCTURE: real table, real filters, real keyboard behaviour, and
   every single cell carrying a visible [CONFIRM] instead of an invented
   class time. The structure ships; the invented data does not.
   ===================================================================== */
(function () {
  'use strict';

  var IS_EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;

  function t(pt, en) { return IS_EN ? en : pt; }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WA = '5548999728804';

  function wireWA() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      var msg = nodes[i].getAttribute('data-wa') ||
        t('Ola! Vim pelo site da Samatva.', 'Hello! I came from the Samatva website.');
      nodes[i].setAttribute('href', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg));
      nodes[i].setAttribute('target', '_blank');
      nodes[i].setAttribute('rel', 'noopener');
    }
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
        el.style.transitionDelay = Math.min(idx, 8) * 80 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
  }

  function parallax() {
    var media = document.querySelector('.hero-media img');
    if (!media || reduced) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset;
      if (y < 900) { media.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0) scale(1.05)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.05)';
  }

  /* ===================================================================
     GRADE DE HORARIOS
     A real <table> with real headers, filtered by three ARIA-grouped chip
     sets. Nothing here is JavaScript-only: with JS off every slot in the
     week is visible, which is strictly more information than the live
     site offers today.
     =================================================================== */
  function grade() {
    var box = document.getElementById('grade');
    if (!box) { return; }
    var slots = box.querySelectorAll('.slot');
    var live = document.getElementById('grade-status');
    var empty = document.getElementById('grade-empty');

    function chosen(name) {
      var c = box.querySelector('input[name="' + name + '"]:checked');
      return c ? c.value : '';
    }

    function apply() {
      var sh = chosen('f-shala'), st = chosen('f-estilo'), lv = chosen('f-nivel');
      var shown = 0;
      for (var i = 0; i < slots.length; i++) {
        var s = slots[i];
        var ok = (!sh || s.getAttribute('data-shala') === sh)
              && (!st || s.getAttribute('data-estilo') === st)
              && (!lv || s.getAttribute('data-nivel') === lv);
        s.hidden = !ok;
        if (ok) { shown++; }
      }
      if (empty) { empty.hidden = shown > 0; }
      if (live) {
        live.textContent = shown
          ? t(shown + ' horarios correspondem ao filtro. Cada um segue marcado [CONFIRM] ate a escola enviar a grade real.',
              shown + ' slots match the filter. Each one stays marked [CONFIRM] until the school supplies the real timetable.')
          : t('Nenhum horario corresponde a essa combinacao de filtros.',
              'No slots match that combination of filters.');
      }
    }

    var inputs = box.querySelectorAll('.fchip input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', apply);
    }
    var clear = document.getElementById('grade-clear');
    if (clear) {
      clear.addEventListener('click', function () {
        for (var j = 0; j < inputs.length; j++) { inputs[j].checked = false; }
        apply();
      });
    }

    /* Mobile: the grid becomes a day selector plus a vertical list. */
    var dayBtns = box.querySelectorAll('[data-day-pick]');
    function pickDay(d) {
      var cells = box.querySelectorAll('td[data-day]');
      for (var k = 0; k < cells.length; k++) {
        cells[k].style.display = (cells[k].getAttribute('data-day') === d) ? '' : '';
        cells[k].setAttribute('data-visible-day', d);
      }
      var style = document.getElementById('day-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'day-style';
        document.head.appendChild(style);
      }
      style.textContent = '@media (max-width:820px){table.grade td[data-day]{display:none}' +
        'table.grade td[data-day="' + d + '"]{display:block}}';
      for (var m = 0; m < dayBtns.length; m++) {
        var on = dayBtns[m].getAttribute('data-day-pick') === d;
        dayBtns[m].setAttribute('aria-pressed', on ? 'true' : 'false');
        dayBtns[m].classList.toggle('chip-clay', on);
      }
    }
    for (var n = 0; n < dayBtns.length; n++) {
      (function (btn) {
        btn.addEventListener('click', function () { pickDay(btn.getAttribute('data-day-pick')); });
      })(dayBtns[n]);
    }
    if (dayBtns.length) { pickDay(dayBtns[0].getAttribute('data-day-pick')); }

    apply();
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
     Their live site runs Google Tag Manager (GTM-WB4LPM3), a Mailchimp
     newsletter and an embedded Instagram feed, and surfaces no consent
     mechanism at all. Here nothing non-essential loads without consent,
     reject is as prominent as accept, and the consented branch is left
     deliberately inert: no tag, pixel or embed fires anywhere.
     =================================================================== */
  var CONSENT_KEY = 'sy_lgpd_v1';

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

  /* The live footer reads (c)2025 on a site modified in 2026. */
  function year() {
    var nodes = document.querySelectorAll('[data-year]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  function init() {
    wireWA();
    header();
    reveals();
    parallax();
    grade();
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

/* =====================================================================
   Rio Tavares Forro de PVC e Revestimentos - spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem. pt-BR only, by design.

   The number IS published: 48 98828-3041, used by their own site as
   wa.me/5548988283041 with pre-filled message text on every button. That
   pattern is theirs, it works, and it is extended here to the new
   sections so each block's lead volume is traceable. What is added is the
   thing their site has nowhere: a tel: click-to-call link.
   ===================================================================== */
(function () {
  'use strict';

  var WA = '5548988283041';
  var TEL = '+5548988283041';

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wireLinks() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      var msg = nodes[i].getAttribute('data-wa') || 'Ola! Vim pelo site.';
      nodes[i].setAttribute('href', 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg));
      nodes[i].setAttribute('target', '_blank');
      nodes[i].setAttribute('rel', 'noopener');
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) { tels[j].setAttribute('href', 'tel:' + TEL); }
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
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
  }

  function parallax() {
    var media = document.querySelector('[data-parallax]');
    if (!media || reduced) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset;
      if (y < 800) { media.style.transform = 'translate3d(0,' + (y * 0.08) + 'px,0) scale(1.05)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.05)';
  }

  /* Count-ups return immediately on a non-numeric value, so a visible
     [CONFIRM] placeholder never animates up to an invented figure. Nothing
     on this build carries a real counted number: no years in business, no
     project count, no capacity claim, because none is published. */
  function countUps() {
    var nodes = document.querySelectorAll('[data-count]');
    for (var i = 0; i < nodes.length; i++) {
      var target = parseFloat(nodes[i].getAttribute('data-count'));
      if (isNaN(target)) { continue; }
      nodes[i].textContent = String(target);
    }
  }

  /* ===================================================================
     LGPD consent (Lei 13.709/2018)
     Their current site has no banner and no policy at all. Non-essential
     is off by default, reject is as prominent as accept, and the
     consented branch is deliberately inert in this mockup.
     =================================================================== */
  var CONSENT_KEY = 'rt_lgpd_v1';

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
    wireLinks();
    header();
    reveals();
    parallax();
    countUps();
    consent();
    year();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

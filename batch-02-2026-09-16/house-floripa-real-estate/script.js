/* House Floripa Real Estate — mockup interactions (no framework) */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var lang = (root.getAttribute('lang') || 'pt-BR').slice(0, 2);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = 'housefloripa_cookie_consent_v1';
  var MSG = {
    pt: { consent: 'Para enviar, marque o consentimento LGPD.', demo: 'Demonstração: nada foi enviado. Este formulário é apenas um mockup.', play: 'Retomar apresentação', pause: 'Pausar apresentação' },
    en: { consent: 'Please tick the privacy consent box to send.', demo: 'Demo only: nothing was sent. This form is a mockup.', play: 'Resume slideshow', pause: 'Pause slideshow' },
    es: { consent: 'Para enviar, marque la casilla de consentimiento.', demo: 'Demostración: no se envió nada. Este formulario es solo una maqueta.', play: 'Reanudar presentación', pause: 'Pausar presentación' }
  }[lang] || {};

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');
  function closeNav() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (header) root.style.setProperty('--hdr', header.getBoundingClientRect().bottom + 'px');
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); toggle.focus(); } });
  }

  $$('[data-stagger]').forEach(function (g) { $$('[data-reveal]', g).forEach(function (el, i) { el.style.setProperty('--i', i % 8); }); });
  var revealEls = $$('[data-reveal], .lang-gate');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* hero parallax */
  var par = $('[data-parallax]');
  if (par && !reduce) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { par.style.transform = 'translate3d(0,' + Math.min(window.scrollY, 900) * 0.15 + 'px,0)'; tick = false; });
    }, { passive: true });
  }

  /* hero slides: pausable, keyboard-operable, no auto-advance under reduced motion */
  var slider = $('[data-slider]');
  if (slider) {
    var slides = $$('.slide', slider);
    var lines = $$('[data-slide-line]');
    var dots = $$('.slide-dots button', slider.parentNode);
    var pauseBtn = $('[data-slide="pause"]', slider.parentNode);
    var idx = 0, timer = null, playing = !reduce;
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); s.setAttribute('aria-hidden', String(i !== idx)); });
      lines.forEach(function (l, i) { l.hidden = i !== idx; });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === idx)); });
    }
    function start() { stop(); if (playing) timer = setInterval(function () { go(idx + 1); }, 7000); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    function syncPause() {
      if (!pauseBtn) return;
      pauseBtn.setAttribute('aria-label', playing ? MSG.pause : MSG.play);
      pauseBtn.innerHTML = playing ? '<svg width="16" height="16" aria-hidden="true"><use href="#i-pause"/></svg>' : '<svg width="16" height="16" aria-hidden="true"><use href="#i-play"/></svg>';
    }
    $$('[data-slide]', slider.parentNode).forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.getAttribute('data-slide');
        if (a === 'prev') go(idx - 1);
        if (a === 'next') go(idx + 1);
        if (a === 'pause') { playing = !playing; syncPause(); }
        start();
      });
    });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });
    slider.parentNode.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(idx - 1); start(); }
      if (e.key === 'ArrowRight') { go(idx + 1); start(); }
    });
    slider.parentNode.addEventListener('focusin', stop);
    slider.parentNode.addEventListener('focusout', start);
    go(0); syncPause(); start();
  }

  /* demo forms */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', f);
      var consent = $('input[name="lgpd"]', f);
      if (consent && !consent.checked) { if (status) status.textContent = MSG.consent; consent.focus(); return; }
      if (status) status.textContent = MSG.demo;
    });
  });

  /* click-to-load map */
  $$('.js-load-map').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.map-panel');
      var src = btn.getAttribute('data-src');
      if (!panel || !src) return;
      var f = doc.createElement('iframe');
      f.src = src; f.title = btn.getAttribute('data-title') || 'Map'; f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      panel.appendChild(f);
      btn.disabled = true;
    });
  });

  /* LGPD cookie banner */
  var banner = $('#cookie-banner');
  if (banner) {
    var prefs = $('#cookie-prefs', banner), cbA = $('#ck-analytics', banner), cbM = $('#ck-marketing', banner);
    function show() { banner.hidden = false; requestAnimationFrame(function () { banner.classList.add('is-visible'); }); }
    function hide() { banner.classList.remove('is-visible'); setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 450); }
    function save(a, m) { store(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: !!a, marketing: !!m, date: new Date().toISOString() })); hide(); }
    var saved = null;
    try { saved = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved) show();
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') save(true, true);
      if (act === 'reject') save(false, false);
      if (act === 'prefs') { prefs.hidden = !prefs.hidden; b.setAttribute('aria-expanded', String(!prefs.hidden)); }
      if (act === 'save') save(cbA.checked, cbM.checked);
    });
    $$('.js-cookie-prefs').forEach(function (l) {
      l.addEventListener('click', function (e) {
        e.preventDefault();
        var cur = null;
        try { cur = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (er) { cur = null; }
        cbA.checked = !!(cur && cur.analytics); cbM.checked = !!(cur && cur.marketing);
        prefs.hidden = false; show();
      });
    });
  }
})();

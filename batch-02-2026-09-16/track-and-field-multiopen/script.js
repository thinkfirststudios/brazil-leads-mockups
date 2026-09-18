/* =====================================================================
   TRACK & FIELD · Loja A10 (unidade franqueada) — CONFIGURAÇÃO
   WHATSAPP: número da unidade [CONFIRM linha própria e permissão da franqueadora]
   ===================================================================== */
const WHATSAPP = '5548988055507';
const WA_DEFAULT_TEXT = 'Olá! Vim pelo site da loja Track & Field do Multi Open.';
const CONSENT_KEY = 'tf_multiopen_a10_consent_v1';

(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* header + menu */
  var header = d.querySelector('.site-header');
  function setHdr() { if (header) d.documentElement.style.setProperty('--hdr', header.getBoundingClientRect().bottom + 'px'); }
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 24); setHdr(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHdr);
  onScroll();
  var tog = d.querySelector('.nav-toggle'), nav = d.getElementById('site-nav');
  function setMenu(open) { tog.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); setHdr(); }
  if (tog && nav) {
    tog.addEventListener('click', function () { setMenu(tog.getAttribute('aria-expanded') !== 'true'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); tog.focus(); } });
  }

  /* stagger + reveals */
  d.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });
  var reveals = d.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* parallax */
  var par = d.querySelector('[data-parallax]');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { par.style.transform = 'translate3d(0,' + (Math.min(window.scrollY, 900) * 0.15) + 'px,0)'; ticking = false; });
    }, { passive: true });
  }

  /* WhatsApp contextual */
  function waHref(text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text || WA_DEFAULT_TEXT); }
  d.querySelectorAll('[data-wa]').forEach(function (a) {
    var sec = a.closest('[data-wa-text]');
    a.href = waHref(sec ? sec.getAttribute('data-wa-text') : WA_DEFAULT_TEXT);
  });
  d.querySelectorAll('.agenda__ask').forEach(function (a) { a.href = waHref('Olá! Quero saber mais sobre um evento da loja do Multi.'); });
  var floating = d.querySelectorAll('.wa-float, .mbar [data-wa], .header__wa');
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var h = waHref(en.target.getAttribute('data-wa-text')); floating.forEach(function (a) { a.href = h; }); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    d.querySelectorAll('main [data-wa-text]').forEach(function (s) { secIO.observe(s); });
  }

  /* consultar peça — só monta a mensagem; nada é enviado pelo site */
  var peca = d.getElementById('c-peca');
  var prev = d.getElementById('c-preview');
  var send = d.getElementById('c-send');
  function buildMsg() {
    var p = (peca.value || '').trim() || '[peça]';
    var t = d.querySelector('input[name="tam"]:checked');
    var tam = t ? (t.value === 'outro' ? '[informar]' : t.value) : '[x]';
    var msg = 'Quero saber se a loja do Multi tem ' + p + ' no tamanho ' + tam;
    prev.textContent = msg;
    send.href = waHref(msg);
  }
  if (peca && prev && send) {
    peca.addEventListener('input', buildMsg);
    d.querySelectorAll('input[name="tam"]').forEach(function (r) { r.addEventListener('change', buildMsg); });
    buildMsg();
  }

  /* mapa sob demanda (LGPD) */
  d.querySelectorAll('[data-map-load]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map-src]');
      var f = d.createElement('iframe');
      f.src = box.getAttribute('data-map-src');
      f.title = box.getAttribute('data-map-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.appendChild(f);
      box.querySelector('.map__panel').hidden = true;
      f.focus();
    });
  });

  /* LGPD: cookies */
  var ck = d.getElementById('cookie');
  if (!ck) return;
  var prefs = d.getElementById('cookie-prefs');
  var btnPrefs = ck.querySelector('[data-cookie="prefs"]');
  var btnSave = ck.querySelector('[data-cookie="save"]');
  function readConsent() { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; } }
  function writeConsent(v) { v.date = new Date().toISOString(); try { localStorage.setItem(CONSENT_KEY, JSON.stringify(v)); } catch (e) {} }
  function showPrefs(on) { prefs.hidden = !on; btnSave.hidden = !on; btnPrefs.setAttribute('aria-expanded', String(on)); }
  function openCookie(withPrefs) {
    var c = readConsent() || {};
    prefs.querySelector('[name="analytics"]').checked = !!c.analytics;
    prefs.querySelector('[name="marketing"]').checked = !!c.marketing;
    showPrefs(!!withPrefs);
    ck.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { ck.classList.add('is-open'); }); });
    if (withPrefs) ck.querySelector('button').focus();
  }
  function closeCookie() { ck.classList.remove('is-open'); setTimeout(function () { ck.hidden = true; }, reduce ? 0 : 450); }
  ck.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cookie]'); if (!b) return;
    var act = b.getAttribute('data-cookie');
    if (act === 'accept') { writeConsent({ necessary: true, analytics: true, marketing: true }); closeCookie(); }
    else if (act === 'reject') { writeConsent({ necessary: true, analytics: false, marketing: false }); closeCookie(); }
    else if (act === 'prefs') { showPrefs(prefs.hidden); }
    else if (act === 'save') {
      writeConsent({ necessary: true, analytics: prefs.querySelector('[name="analytics"]').checked, marketing: prefs.querySelector('[name="marketing"]').checked });
      closeCookie();
    }
  });
  if (!readConsent()) setTimeout(function () { openCookie(false); }, 600);
  d.querySelectorAll('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function () { openCookie(true); }); });
})();

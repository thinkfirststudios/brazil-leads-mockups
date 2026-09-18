/* Dalla Valle Advogados — mockup script (no framework, no build step)
   MOCKUP: nenhum formulário envia dados; nenhuma tag de análise/marketing é carregada. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE_KEY = 'dv_cookie_consent_v1';

  /* ---------- Ano corrente ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Cabeçalho que condensa ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu móvel ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        toggle.focus();
      }
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Seletor de WhatsApp (dois números publicados) ---------- */
  var waBtn = document.querySelector('.wa-float__btn');
  var waPanel = document.getElementById('wa-panel');
  if (waBtn && waPanel) {
    waBtn.addEventListener('click', function () {
      var open = waBtn.getAttribute('aria-expanded') === 'true';
      waBtn.setAttribute('aria-expanded', String(!open));
      waPanel.hidden = open;
    });
    document.addEventListener('click', function (e) {
      if (!waPanel.hidden && !e.target.closest('.wa-float')) {
        waPanel.hidden = true;
        waBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !waPanel.hidden) {
        waPanel.hidden = true;
        waBtn.setAttribute('aria-expanded', 'false');
        waBtn.focus();
      }
    });
  }

  /* ---------- Consentimento de cookies (LGPD) ---------- */
  var sheet = document.getElementById('cookie-sheet');
  var prefs = document.getElementById('cookie-prefs');
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { return null; }
  }
  function writeConsent(v) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ }
  }
  function showSheet(withPrefs) {
    if (!sheet) return;
    sheet.hidden = false;
    var c = readConsent();
    if (prefs) {
      prefs.hidden = !withPrefs;
      var a = sheet.querySelector('input[name="analytics"]');
      var m = sheet.querySelector('input[name="marketing"]');
      if (a) a.checked = !!(c && c.analytics);
      if (m) m.checked = !!(c && c.marketing);
    }
    var first = sheet.querySelector('button');
    if (first && withPrefs) first.focus();
  }
  function hideSheet() { if (sheet) sheet.hidden = true; }
  function save(analytics, marketing) {
    writeConsent({ necessary: true, analytics: !!analytics, marketing: !!marketing, date: new Date().toISOString() });
    hideSheet();
    /* MOCKUP: nenhuma tag é carregada, mesmo com consentimento. */
  }
  if (sheet) {
    if (!readConsent()) showSheet(false);
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') save(true, true);
      else if (act === 'reject') save(false, false);
      else if (act === 'prefs') { if (prefs) prefs.hidden = !prefs.hidden; }
      else if (act === 'save') {
        var a = sheet.querySelector('input[name="analytics"]');
        var m = sheet.querySelector('input[name="marketing"]');
        save(a && a.checked, m && m.checked);
      }
    });
  }
  document.querySelectorAll('[data-open-cookies]').forEach(function (l) {
    l.addEventListener('click', function (e) { e.preventDefault(); showSheet(true); });
  });

  /* ---------- Formulários (demonstração) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var msg = form.querySelector('textarea[maxlength]');
    var counter = form.querySelector('[data-counter]');
    var counterLabel = counter ? (counter.getAttribute('data-counter') || 'Caracteres') : '';
    if (msg && counter) {
      var upd = function () { counter.textContent = counterLabel + ': ' + msg.value.length + ' / ' + msg.getAttribute('maxlength'); };
      msg.addEventListener('input', upd); upd();
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = form.getAttribute('data-error') || 'Verifique os campos obrigatórios.';
        }
        return;
      }
      if (status) {
        status.className = 'form-status is-ok';
        status.textContent = form.getAttribute('data-ok') || 'Mensagem recebida (demonstração).';
        status.focus();
      }
      form.reset();
      if (counter && msg) counter.textContent = counterLabel + ': 0 / ' + msg.getAttribute('maxlength');
    });
  });
})();

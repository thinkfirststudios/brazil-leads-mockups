/* =====================================================================
   POWER CELL · Loja A14 — CONFIGURAÇÃO (edite só aqui)
   ---------------------------------------------------------------------
   LAUNCH_DATE: data/hora da inauguração no formato 'AAAA-MM-DDTHH:MM:00-03:00'
     Ex.: const LAUNCH_DATE = '2026-11-20T10:00:00-03:00';
     Deixe null até a data estar CONFIRMADA POR ESCRITO — a página mostra "em breve".
   WHATSAPP: só dígitos, com 55 + DDD. Ex.: '5548999999999'.
     Deixe null até o número ser confirmado — os botões apontam para #contato.
   No dia da inauguração: troque o bloco #countdown por um bloco de horários/serviços.
   ===================================================================== */
const LAUNCH_DATE = null;   // [CONFIRM] data de inauguração
const WHATSAPP = null;      // [CONFIRM] número de WhatsApp
const WA_DEFAULT_TEXT = 'Quero avisos da inauguração da Power Cell no Multi';
const CONSENT_KEY = 'powercell_a14_consent_v1';

(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ano no rodapé */
  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* header condensa */
  var header = d.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* stagger */
  d.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });

  /* reveals */
  var reveals = d.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* parallax suave no hero (transform apenas) */
  var par = d.querySelector('[data-parallax]');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        par.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* WhatsApp — só vira link wa.me quando o número estiver configurado */
  function waHref(text) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text || WA_DEFAULT_TEXT);
  }
  if (WHATSAPP) {
    d.querySelectorAll('[data-wa]').forEach(function (a) {
      var sec = a.closest('[data-wa-text]');
      a.href = waHref(sec ? sec.getAttribute('data-wa-text') : WA_DEFAULT_TEXT);
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  /* contagem regressiva */
  var cdBox = d.getElementById('countdown');
  if (cdBox) {
    var nums = { d: cdBox.querySelector('[data-cd="d"]'), h: cdBox.querySelector('[data-cd="h"]'), m: cdBox.querySelector('[data-cd="m"]') };
    var status = cdBox.querySelector('[data-cd-status]');
    var target = LAUNCH_DATE ? new Date(LAUNCH_DATE) : null;
    if (target && isNaN(target.getTime())) target = null;

    var setNum = function (el, val) {
      var v = String(val).padStart(2, '0');
      if (el.textContent === v) return;
      el.textContent = v;
      if (!reduce) { el.classList.remove('roll'); void el.offsetWidth; el.classList.add('roll'); }
    };
    var tick = function () {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setNum(nums.d, 0); setNum(nums.h, 0); setNum(nums.m, 0);
        status.innerHTML = '<strong>Estamos abertos!</strong>';
        return false;
      }
      var mins = Math.floor(diff / 60000);
      setNum(nums.d, Math.floor(mins / 1440));
      setNum(nums.h, Math.floor((mins % 1440) / 60));
      setNum(nums.m, mins % 60);
      return true;
    };
    if (target) {
      var dd = String(target.getDate()).padStart(2, '0');
      var mm = String(target.getMonth() + 1).padStart(2, '0');
      status.innerHTML = 'Inauguração: <strong>' + dd + '/' + mm + '</strong>';
      if (tick()) { var t = setInterval(function () { if (!tick()) clearInterval(t); }, 15000); }
    }
    /* sem data: mantém "--" e o texto "em breve" (degradação prevista no briefing) */
  }

  /* ---------- LGPD: banner de cookies ---------- */
  var ck = d.getElementById('cookie');
  var prefs = d.getElementById('cookie-prefs');
  var btnPrefs = ck && ck.querySelector('[data-cookie="prefs"]');
  var btnSave = ck && ck.querySelector('[data-cookie="save"]');
  function readConsent() { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; } }
  function writeConsent(v) { v.date = new Date().toISOString(); try { localStorage.setItem(CONSENT_KEY, JSON.stringify(v)); } catch (e) {} }
  function showPrefs(on) {
    prefs.hidden = !on; btnSave.hidden = !on;
    btnPrefs.setAttribute('aria-expanded', String(on));
  }
  function openCookie(withPrefs) {
    var c = readConsent() || {};
    prefs.querySelector('[name="analytics"]').checked = !!c.analytics;
    prefs.querySelector('[name="marketing"]').checked = !!c.marketing;
    showPrefs(!!withPrefs);
    ck.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { ck.classList.add('is-open'); }); });
    var first = ck.querySelector('button'); if (first && withPrefs) first.focus();
  }
  function closeCookie() {
    ck.classList.remove('is-open');
    setTimeout(function () { ck.hidden = true; }, reduce ? 0 : 450);
  }
  if (ck) {
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
    d.querySelectorAll('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () { openCookie(true); });
    });
  }
})();

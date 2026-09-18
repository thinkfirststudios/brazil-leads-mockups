/* ===================================================================
   Valena Espaco de Saude - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). Runs off
   file:// so the prospect can double-click index.html.

   THE THREE BROKEN THINGS, FIXED VISIBLY.
   Their live site has three defects sitting in plain sight:

   1. The header "Agende seu horario" button links to "#" and does
      nothing. Here every booking control resolves.

   2. Every wa.me link on their site points at 554896407891, which is
      ONE DIGIT SHORT of the number they display in text on the same
      page: (48) 99640-7891 = 5548996407891. As published, the primary
      booking path points at the wrong phone.

      The number used below is the one they PUBLISH IN TEXT, because
      that is the one the business wrote down. The malformed link is a
      typo of it. It still carries a [CONFIRM] on the page, and the
      discrepancy is named in the footer rather than quietly cleaned up.

   3. The eight service cards render with empty image sources. Here
      every card ships with a labelled placeholder photograph.

   NO PRICE IS SHOWN, COMPUTED OR IMPLIED ANYWHERE IN THIS FILE.
   CFM Resolution 1.974/2011 prohibits publishing prices, promotions
   and discounts for medical procedures, and until Valena confirms
   service by service which of its eight categories are medical, the
   safe build shows no price at all. There is no discount device, no
   countdown, no "from R$" and no promo bar in this build.
   =================================================================== */
(function () {
  'use strict';

  /* Published in text on their own site. Their wa.me links are one
     digit short of this. [CONFIRM] */
  var WA_NUMBER = '5548996407891';
  var WA_DISPLAY = '(48) 99640-7891';

  var EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  var reduced = false;
  try {
    reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduced = false; }

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* ---------- booking: every control resolves ------------------
     Their own pre-fill text is good and is kept: "Ola, vim atraves do
     site e gostaria de agendar um horario para:" - extended per
     service so the first message already says which area.
     ----------------------------------------------------------- */
  function wireContacts() {
    var els = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var svc = el.getAttribute('data-wa');
      var base = t('Ola, vim atraves do site e gostaria de agendar um horario para:',
                   'Hello, I came through the website and would like to book an appointment for:');
      var msg = svc ? (base + ' ' + svc) : base;
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) {
      tels[j].setAttribute('href', 'tel:+' + WA_NUMBER);
      if (!tels[j].textContent.trim()) { tels[j].textContent = WA_DISPLAY; }
    }
  }

  /* ---------- sticky header ----------------------------------- */
  function header() {
    var head = document.querySelector('.site-head');
    if (!head) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 24) { head.classList.add('solid'); } else { head.classList.remove('solid'); }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- mobile menu ------------------------------------- */
  function menu() {
    var burger = document.querySelector('.burger');
    var panel = document.querySelector('.mobile-nav');
    if (!burger || !panel) { return; }
    function close() {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    var links = panel.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) { links[i].addEventListener('click', close); }
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && panel.classList.contains('open')) { close(); burger.focus(); }
    });
  }

  /* ---------- reveals ----------------------------------------- */
  function reveals() {
    var items = document.querySelectorAll('.rev');
    if (!items.length) { return; }
    if (reduced || !('IntersectionObserver' in window)) {
      for (var k = 0; k < items.length; k++) { items[k].classList.add('in'); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (!e.isIntersecting) { continue; }
        var el = e.target, idx = 0, sib = el.previousElementSibling;
        while (sib) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
          sib = sib.previousElementSibling;
        }
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < items.length; j++) { io.observe(items[j]); }
  }

  /* ---------- hero parallax ----------------------------------- */
  function parallax() {
    if (reduced) { return; }
    var img = document.querySelector('.hero-media img');
    if (!img) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y < window.innerHeight * 1.2) {
        img.style.transform = 'translate3d(0,' + (y * 0.13) + 'px,0) scale(1.06)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- LGPD -------------------------------------------
     Health data is dado pessoal sensivel under LGPD art. 5, II,
     with a stricter lawful-basis regime than ordinary personal
     data. Anything a visitor says about a condition - in a form or
     in a WhatsApp message - is sensitive. So the bar here does two
     things a generic banner does not: it says so in plain language,
     and it names the three processors that are actually on their
     live site today (Google Tag Manager GTM-PXGKXCQS, Google
     reCAPTCHA and a Facebook domain verification), all of which
     load before any consent on the current build.
     ----------------------------------------------------------- */
  var STORE = 'valena_lgpd_v1';

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveConsent(obj) {
    try { window.localStorage.setItem(STORE, JSON.stringify(obj)); } catch (e) {}
  }

  function applyConsent(c) {
    if (c && c.analytics) {
      /* Google Tag Manager (GTM-PXGKXCQS) would load here, and only
         here. Nothing fires in this mockup. On the live site it
         currently loads on every page view before any consent. */
    }
    if (c && c.marketing) {
      /* The Facebook pixel behind their domain verification would
         load here. Inert in this mockup. */
    }
    /* reCAPTCHA is a functional processor on the contact form rather
       than an analytics one, but it is still a Google service that
       sees the visitor's IP - so it is named in the policy, and on a
       health site it is worth asking whether it is needed at all. */
  }

  function lgpd() {
    var bar = document.getElementById('lgpd');
    if (!bar) { return; }
    var prefs = document.getElementById('lgpd-prefs');
    var accept = document.getElementById('lgpd-accept');
    var reject = document.getElementById('lgpd-reject');
    var openp = document.getElementById('lgpd-open-prefs');
    var save = document.getElementById('lgpd-save');
    var ana = document.getElementById('ck-analytics');
    var mkt = document.getElementById('ck-marketing');

    function show() { bar.setAttribute('aria-hidden', 'false'); bar.classList.add('show'); }
    function hide() { bar.classList.remove('show'); bar.setAttribute('aria-hidden', 'true'); }
    function decide(c) { saveConsent(c); applyConsent(c); hide(); }

    var existing = readConsent();
    if (existing) { applyConsent(existing); } else { window.setTimeout(show, 700); }

    if (accept) {
      accept.addEventListener('click', function () {
        decide({ essential: true, analytics: true, marketing: true, at: Date.now() });
      });
    }
    if (reject) {
      reject.addEventListener('click', function () {
        decide({ essential: true, analytics: false, marketing: false, at: Date.now() });
      });
    }
    if (openp && prefs) {
      openp.addEventListener('click', function () {
        var open = prefs.hasAttribute('hidden');
        if (open) { prefs.removeAttribute('hidden'); } else { prefs.setAttribute('hidden', ''); }
        openp.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (save) {
      save.addEventListener('click', function () {
        decide({
          essential: true,
          analytics: !!(ana && ana.checked),
          marketing: !!(mkt && mkt.checked),
          at: Date.now()
        });
      });
    }
    var reopen = document.querySelectorAll('[data-lgpd-reopen]');
    for (var i = 0; i < reopen.length; i++) {
      reopen[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        var c = readConsent();
        if (ana) { ana.checked = !!(c && c.analytics); }
        if (mkt) { mkt.checked = !!(c && c.marketing); }
        if (prefs) { prefs.removeAttribute('hidden'); }
        if (openp) { openp.setAttribute('aria-expanded', 'true'); }
        show();
      });
    }
  }

  /* ---------- footer year --------------------------------------
     Their live footer still reads (c)2024, which is one of the four
     small things that say nobody has opened this site in two years.
     Opened 08/12/2021 is a date they publish, and it is printed as a
     date rather than counted up into a "X anos" figure.
     ----------------------------------------------------------- */
  function years() {
    var els = document.querySelectorAll('[data-year]');
    var y = String(new Date().getFullYear());
    for (var i = 0; i < els.length; i++) { els[i].textContent = y; }
  }

  ready(function () {
    wireContacts();
    header();
    menu();
    reveals();
    parallax();
    lgpd();
    years();
  });
}());

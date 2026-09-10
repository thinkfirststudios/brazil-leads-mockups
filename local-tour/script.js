/* ===========================================================================
   LOCAL TOUR — shared behaviour for /, /en/ and /es/
   Spec mockup. No framework, no build step, no modules, no fetch().
   Language comes from real parallel URL trees; nothing here swaps DOM text.
   =========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var EN = LANG.indexOf('en') === 0;
  var ES = LANG.indexOf('es') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en, es) { return ES ? es : (EN ? en : pt); }

  /* -------------------------------------------------------------------------
     CONTACT — published by them, used exactly as published.
     +55 48 98487-5199 · Travessa Ressacada, 123 · Carianos · Florianópolis/SC
     No second number, no e-mail address: their published e-mail is obfuscated
     by a spam filter and could not be read, so none is guessed here.
     ---------------------------------------------------------------------- */
  var WA_NUMBER = '5548984875199';
  var WA_DISPLAY = '+55 48 98487-5199';

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function defaultMsg() {
    return t('Olá! Vim pelo site da Local Tour e gostaria de informações sobre um passeio.',
             'Hello! I came from the Local Tour website and would like information about a tour.',
             '¡Hola! Vengo del sitio de Local Tour y quisiera información sobre un paseo.');
  }
  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : defaultMsg();
        if (el.tagName === 'A') { el.href = waHref(msg); el.target = '_blank'; el.rel = 'noopener'; }
        else { el.addEventListener('click', function () { window.open(waHref(msg), '_blank', 'noopener'); }); }
      })(nodes[i]);
    }
  }

  /* --------------------------------------------------------------- header */
  function header() {
    var hdr = document.querySelector('.hdr');
    if (!hdr) return;
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.pageYOffset > 30);
        ticking = false;
      });
    }, { passive: true });
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
        document.body.style.overflow = !open ? 'hidden' : '';
      });
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && nav.classList.contains('is-open')) burger.click();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) burger.click();
      });
    }
  }

  /* --------------------------------------------------------------- reveals */
  function reveals() {
    var els = document.querySelectorAll('.rv');
    if (REDUCED || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, idx = 0, sib = el;
        while ((sib = sib.previousElementSibling)) if (sib.classList.contains('rv')) idx++;
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* -------------------------------------------------------------- parallax */
  function parallax() {
    var img = document.querySelector('.hero__img');
    if (!img || REDUCED) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.2) img.style.transform = 'translate3d(0,' + (y * 0.2) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------- countup
     Guards on isNaN, so the review count — which is a [CONFIRM], because 145
     was true on 31/08/2026 and a live figure must be read live — can never be
     animated up into a number this build invented.                           */
  function countup() {
    var els = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (REDUCED) { el.textContent = String(target); return; }
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1200, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { for (var i = 0; i < els.length; i++) run(els[i]); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ============================================================ THE FINDER
     "Encontre seu passeio" — the element their current site has no equivalent
     of. It is deliberately NOT a booking engine: no availability, no cart, no
     price. It filters the catalogue and composes a WhatsApp message. Local
     Tour publishes no prices anywhere, and this build invents none.
     ====================================================================== */
  function finder() {
    var card = document.querySelector('.finder__card');
    if (!card) return;

    var toggle = card.querySelector('.finder__toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    var kind = card.querySelector('#f-tipo');
    var date = card.querySelector('#f-data');
    var pax = card.querySelector('#f-pax');
    var idiom = card.querySelector('#f-idioma');
    var out = card.querySelector('.finder__out');
    var go = card.querySelector('[data-finder-go]');

    /* the date input cannot be in the past — a tour cannot be booked backwards */
    if (date) {
      var n = new Date();
      var dd = function (x) { return (x < 10 ? '0' : '') + x; };
      date.min = n.getFullYear() + '-' + dd(n.getMonth() + 1) + '-' + dd(n.getDate());
    }

    function ddmm(v) {
      if (!v) return '';
      var p = v.split('-');
      return p[2] + '/' + p[1];        // DD/MM, always — never MM/DD
    }

    function applyFilter() {
      var key = kind ? kind.value : 'all';
      var cards = document.querySelectorAll('.tours .tour');
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var tags = (cards[i].getAttribute('data-tags') || '').split(' ');
        var hit = key === 'all' || tags.indexOf(key) > -1;
        cards[i].classList.toggle('is-out', !hit);
        if (hit) shown++;
      }
      var counter = document.querySelector('.count');
      if (counter) counter.textContent = t(
        shown + (shown === 1 ? ' passeio exibido' : ' passeios exibidos'),
        shown + (shown === 1 ? ' tour shown' : ' tours shown'),
        shown + (shown === 1 ? ' paseo mostrado' : ' paseos mostrados'));
      /* keep the chip row in sync with the finder */
      var chips = document.querySelectorAll('.chips button');
      for (var j = 0; j < chips.length; j++) {
        chips[j].setAttribute('aria-pressed', String(chips[j].getAttribute('data-filter') === key));
      }
      return shown;
    }

    function summary() {
      var parts = [];
      if (kind && kind.value !== 'all') parts.push(kind.options[kind.selectedIndex].text);
      if (date && date.value) parts.push(ddmm(date.value));
      if (pax && pax.value) parts.push(pax.value + ' ' + t('pessoas', 'people', 'personas'));
      if (idiom && idiom.value) parts.push(idiom.options[idiom.selectedIndex].text);
      return parts.join(' · ');
    }

    card.addEventListener('change', function () {
      var shown = applyFilter();
      if (out) {
        var s = summary();
        out.textContent = s
          ? s + ' — ' + shown + ' ' + t('resultado(s)', 'result(s)', 'resultado(s)')
          : t('Escolha o tipo de experiência, a data, quantas pessoas e o idioma do guia.',
              'Choose the type of experience, the date, how many people and the guide language.',
              'Elige el tipo de experiencia, la fecha, cuántas personas y el idioma del guía.');
      }
    });

    if (go) {
      go.addEventListener('click', function (e) {
        e.preventDefault();
        applyFilter();
        var tours = document.querySelector('#passeios');
        if (tours) tours.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        var msg = t(
          'Olá, Local Tour! Estou procurando: ' + (summary() || '[ainda escolhendo]')
            + '\nPode me dizer o que tem disponível e o valor?',
          'Hello, Local Tour! I am looking for: ' + (summary() || '[still choosing]')
            + '\nCould you tell me what is available and the price?',
          '¡Hola, Local Tour! Estoy buscando: ' + (summary() || '[aún eligiendo]')
            + '\n¿Me pueden decir qué hay disponible y el precio?');
        window.open(waHref(msg), '_blank', 'noopener');
      });
    }

    /* the chip row drives the same filter */
    var bar = document.querySelector('.chips');
    if (bar) {
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('button') : null;
        if (!btn) return;
        if (kind) kind.value = btn.getAttribute('data-filter');
        applyFilter();
      });
    }

    applyFilter();
  }

  /* ------------------------------------------------------------------ forms
     Every form is a MOCKUP. Nothing posts anywhere and nothing is stored.
     The transfer form carries the flight number because their own transfer
     page says the flight number is required at booking.                      */
  function forms() {
    var all = document.querySelectorAll('form[data-mock]');
    for (var i = 0; i < all.length; i++) {
      (function (f) {
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          var ok = f.querySelector('input[type="checkbox"][data-consent]');
          if (ok && !ok.checked) {
            window.alert(t('Marque a caixa de consentimento para podermos responder.',
                           'Please tick the consent box so we can reply.',
                           'Marca la casilla de consentimiento para poder responder.'));
            return;
          }
          window.alert(t(
            'MOCKUP — nada foi enviado e nada foi armazenado.\n\nNo site publicado esta solicitação vai '
              + 'para um endpoint com registro de consentimento e abre a conversa no WhatsApp.',
            'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this request goes to a '
              + 'consent-logged endpoint and opens the WhatsApp conversation.',
            'MOCKUP — no se envió ni se almacenó nada.\n\nEn el sitio publicado esta solicitud va a un '
              + 'endpoint con registro de consentimiento y abre la conversación en WhatsApp.'));
        });
      })(all[i]);
    }
  }

  /* ------------------------------------------------------------- LGPD gate */
  var KEY = 'localtour_lgpd_v1';
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function saveConsent(o) { try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      /* Consented branch. Analytics is injected here and nowhere else. */
    }
    if (c.marketing) {
      /* The Google reviews widget and any map embed are third-party data
         transfers. They upgrade from a static rendering to a live embed only
         inside this branch. Their current site loads the Trustindex review
         widget with no consent gate at all. */
    }
  }
  function cookies() {
    var bar = document.querySelector('.ck');
    if (!bar) return;
    var existing = readConsent();
    if (existing) applyConsent(existing);
    else window.setTimeout(function () { bar.classList.add('is-on'); }, 800);

    function close(c) { saveConsent(c); applyConsent(c); bar.classList.remove('is-on'); }
    var acc = bar.querySelector('[data-ck="accept"]');
    var rej = bar.querySelector('[data-ck="reject"]');
    var sav = bar.querySelector('[data-ck="save"]');
    if (acc) acc.addEventListener('click', function () {
      var a = bar.querySelector('#ck-a'), m = bar.querySelector('#ck-m');
      if (a) a.checked = true; if (m) m.checked = true;
      close({ necessary: true, analytics: true, marketing: true, at: Date.now() });
    });
    if (rej) rej.addEventListener('click', function () {
      close({ necessary: true, analytics: false, marketing: false, at: Date.now() });
    });
    if (sav) sav.addEventListener('click', function () {
      var a = bar.querySelector('#ck-a'), m = bar.querySelector('#ck-m');
      close({ necessary: true, analytics: !!(a && a.checked), marketing: !!(m && m.checked), at: Date.now() });
    });
    var open = document.querySelectorAll('[data-ck-open]');
    for (var i = 0; i < open.length; i++) {
      open[i].addEventListener('click', function (e) { e.preventDefault(); bar.classList.add('is-on'); });
    }
  }

  function boot() {
    header(); reveals(); parallax(); countup(); finder(); forms(); cookies(); wireWhatsApp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

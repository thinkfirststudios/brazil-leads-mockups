/* ==========================================================================
   PASSEIOS DE VAN FLORIPA — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch. Runs from
   file:// exactly as it runs from a server. Kept deliberately small: a real
   share of these visitors load the page on international roaming inside an
   airport terminal, which is the opposite of what the current Wix build is
   built for.

   Shared by three real, separately authored locale trees — /, /es/ and
   /en/. Language is read off <html lang>; nothing here swaps text in the
   DOM. Spanish is a first-class locale on this lead, not an add-on: their
   office is on Av. das Nações in Canasvieiras.

   WhatsApp: (48) 99990-0608. Their own page carries TWO links — the correct
   wa.me/554899900608 and a malformed wa.me/48999900608 with no country
   code, which silently fails for any international phone. This build uses
   the country-coded form everywhere, and only that form.
   ========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var ES = LANG.indexOf('es') === 0;
  var EN = LANG.indexOf('en') === 0;

  /* Published by them. The +55 is not optional — see the header comment. */
  var WA_NUMBER = '554899900608';

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function t(pt, es, en) { return EN ? en : (ES ? es : pt); }

  /* ---------------------------------------------------------------- header */
  var hdr = $('.hdr'), burger = $('.burger'), nav = $('.nav');
  window.addEventListener('scroll', function () {
    if (hdr) hdr.classList.toggle('is-stuck', window.pageYOffset > 12);
  }, { passive: true });

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var rv = $$('.rv');
  if (RM || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var i = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = Math.min(i, 6) * 90 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- hero parallax */
  var heroImg = $('.hero img');
  if (heroImg && !RM) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.3) {
          heroImg.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0) scale(1.1)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ===================================================================== */
  /*  ROUTE PICKER — the conversion element                                 */
  /*                                                                        */
  /*  Four controls, one submit, and a wa.me deep link carrying every field  */
  /*  the visitor chose, written in THEIR OWN language. That is the whole    */
  /*  point: right now the only option on the live site is a free-text       */
  /*  "Mensagem/Detalhes do Serviço" box and a promise of a quote by e-mail  */
  /*  later — the wrong latency for somebody standing in an arrivals hall.   */
  /*                                                                        */
  /*  What it does NOT do is quote a price. None is published anywhere, so   */
  /*  none is calculated, guessed or displayed. Every price cell in this     */
  /*  build is a visible [CONFIRM].                                          */
  /* ===================================================================== */
  var pickers = $$('[data-picker]');

  pickers.forEach(function (form) {
    var origin = $('[name="origem"]', form);
    var sub = $('.picker__sub', form);
    var out = $('.picker__out', form);

    function syncFlight() {
      /* The flight-number field is exposed by default when the origin is the
         airport, and hidden when it is not — never the other way round. */
      if (!sub || !origin) return;
      var isAirport = origin.value.indexOf('FLN') >= 0;
      sub.classList.toggle('is-on', isAirport);
      var f = $('[name="voo"]', form);
      if (f) f.required = false;   /* helpful, never blocking */
    }
    if (origin) origin.addEventListener('change', syncFlight);
    syncFlight();

    function compose() {
      var L = [];
      L.push(t('*Reserva de transfer — pelo site*',
               '*Reserva de traslado — desde la web*',
               '*Transfer booking — from the website*'));
      L.push('');
      $$('select, input', form).forEach(function (f) {
        if (!f.name || f.type === 'checkbox' || f.type === 'submit') return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        var name = lab ? lab.textContent.trim() : f.name;
        if (f.name === 'voo' && (!sub || !sub.classList.contains('is-on'))) return;
        L.push(name + ': ' + (f.value || '—'));
      });
      L.push('');
      L.push(t('Podem confirmar o valor e a disponibilidade?',
               '¿Me confirman el valor y la disponibilidad?',
               'Could you confirm the price and availability?'));
      L.push(t('(O site ainda não publica tabela de preços — [CONFIRM].)',
               '(La web todavía no publica tarifas — [CONFIRM].)',
               '(The site does not publish a price table yet — [CONFIRM].)'));
      return L.join('\n');
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = compose();
      if (out) { out.hidden = false; out.textContent = msg; }
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg),
                  '_blank', 'noopener');
    });

    var prev = $('[data-preview]', form);
    if (prev && out) {
      prev.addEventListener('click', function () {
        out.hidden = false;
        out.textContent = compose();
      });
    }
  });

  /* ------------------------------------------------------- generic forms -
     Quote and corporate-proposal forms. Both compose a message and open
     WhatsApp; neither posts anywhere and neither promises a booking.      */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Passeios de Van Floripa', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        if (f.closest && f.closest('[hidden]')) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        lines.push((lab ? lab.textContent.trim() : f.name) + ': ' + (f.value || '—'));
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Enviado desde el formulario de la web — maqueta de demostración.)',
                   '(Sent from the site form — demonstration mockup.)'));
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  });

  /* --------------------------------------------------- contact form modes -
     Two modes — Transfer / Grupo ou evento — that change the fields shown.
     Both field sets ship visible in the HTML; JS collapses the inactive one,
     so the form still works with scripting off.                           */
  $$('[data-modes]').forEach(function (box) {
    var btns = $$('.tabs button', box);
    function apply(mode) {
      btns.forEach(function (b) {
        b.setAttribute('aria-selected', b.getAttribute('data-mode') === mode ? 'true' : 'false');
      });
      $$('[data-mode-panel]', box).forEach(function (p) {
        p.hidden = p.getAttribute('data-mode-panel') !== mode;
      });
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-mode')); });
    });
    if (btns.length) apply(btns[0].getAttribute('data-mode'));
  });

  /* ------------------------------------------------------------------ FAQ -
     Panels ship expanded in the HTML and are collapsed here, so the FAQ is
     fully readable — and fully crawlable as FAQPage — without JS.         */
  $$('.faq__h').forEach(function (btn, i) {
    var p = document.getElementById(btn.getAttribute('aria-controls'));
    if (p && i > 0) { p.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (p) p.hidden = open;
    });
  });

  /* -------------------------------------------------- WhatsApp pre-fills -
     Every wa.me link on the page is built here so the pre-filled text is
     always in the visitor's active locale, and always carries +55.        */
  $$('[data-wa]').forEach(function (el) {
    var key = el.getAttribute('data-wa');
    var msg;
    if (key === 'transfer') {
      msg = t('Olá! Queria reservar um transfer do Aeroporto de Florianópolis (FLN).',
              '¡Hola! Quería reservar un traslado desde el Aeropuerto de Florianópolis (FLN).',
              'Hello! I would like to book a transfer from Florianópolis Airport (FLN).');
    } else if (key === 'grupo') {
      msg = t('Olá! Queria um orçamento para um passeio em grupo.',
              '¡Hola! Quería un presupuesto para una excursión en grupo.',
              'Hello! I would like a quote for a group excursion.');
    } else if (key === 'corp') {
      msg = t('Olá! Queria uma proposta para transporte corporativo / de evento.',
              '¡Hola! Quería una propuesta para transporte corporativo o de evento.',
              'Hello! I would like a proposal for corporate or event transport.');
    } else {
      msg = t('Olá! Vim pelo site da Passeios de Van Floripa.',
              '¡Hola! Vengo desde la web de Passeios de Van Floripa.',
              'Hello! I came from the Passeios de Van Floripa website.');
    }
    el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ------------------------------------------------------- cookie consent -
     LGPD art. 7 / 8. Their current site has no privacy policy and no cookie
     policy at all — both had to be written from scratch. Non-essential is
     OFF by default and "reject" carries the same weight as "accept".      */
  var ck = $('#ck');
  var CK_KEY = 'pvf.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function writeConsent(o) {
    try { window.localStorage.setItem(CK_KEY, JSON.stringify(o)); } catch (e) {}
    if (ck) ck.classList.remove('is-on');
    if (o && o.analytics) { /* consented tags would load here, and nowhere else */ }
  }
  if (ck) {
    if (!readConsent()) window.setTimeout(function () { ck.classList.add('is-on'); }, 900);
    var acc = $('#ck-accept'), rej = $('#ck-reject'), sav = $('#ck-save');
    if (acc) acc.addEventListener('click', function () {
      writeConsent({ essential: true, analytics: true, marketing: true, ts: Date.now() });
    });
    if (rej) rej.addEventListener('click', function () {
      writeConsent({ essential: true, analytics: false, marketing: false, ts: Date.now() });
    });
    if (sav) sav.addEventListener('click', function () {
      writeConsent({
        essential: true,
        analytics: !!($('#ck-an') && $('#ck-an').checked),
        marketing: !!($('#ck-mk') && $('#ck-mk').checked),
        ts: Date.now()
      });
    });
  }

  /* -------------------------------------------------------- year in footer */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

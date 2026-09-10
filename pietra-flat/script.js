/* ==========================================================================
   PIETRA FLAT — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Note the irony this file is answering: Pietra Flat's live site is a React
   single-page app that serves search engines `<div id="root"></div>`. This
   build is server-ready HTML with a small progressive-enhancement layer on
   top — every unit, every tagline, every table row and every language ships
   in the markup. JavaScript here only filters, collapses and composes; it
   never renders content that Google would otherwise not see.

   Three real locale trees: / (pt-BR), /en/, /es/. Their app already carries
   full PT/EN/ES string tables; those strings just need addresses.

   WhatsApp: +55 48 99800-8363, hardcoded in their own floating button
   (api.whatsapp.com/send/?phone=5548998008363). Used exactly as published.
   ========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var ES = LANG.indexOf('es') === 0;
  var EN = LANG.indexOf('en') === 0;
  var WA_NUMBER = '5548998008363';   /* published by them, verbatim */

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
          heroImg.style.transform = 'translate3d(0,' + (y * 0.13).toFixed(1) + 'px,0) scale(1.11)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET                                                   */
  /*                                                                        */
  /*  The single biggest thing missing from a site that already PAYS for a  */
  /*  hospitality booking chatbot. Check-in / check-out / adults / children */
  /*  / VIEW — the view selector being the differentiator, because that is  */
  /*  how this property's own inventory is organised.                       */
  /*                                                                        */
  /*  It checks no calendar and quotes no rate: no rate exists anywhere in  */
  /*  their bundle, so none is invented. It composes a request and hands it */
  /*  to WhatsApp.                                                          */
  /* ===================================================================== */
  function fmtDate(v) {
    /* DD/MM, per the brief. Falls back to whatever the field holds. */
    if (!v || v.indexOf('-') < 0) return v || '—';
    var p = v.split('-');
    return p.length >= 3 ? p[2] + '/' + p[1] : v;
  }

  var avail = $('#avail');
  if (avail) {
    function composeAvail() {
      var L = [];
      L.push(t('*Consulta de disponibilidade — pelo site*',
               '*Consulta de disponibilidad — desde la web*',
               '*Availability enquiry — from the website*'));
      L.push('');
      $$('select, input', avail).forEach(function (f) {
        if (!f.name || f.type === 'checkbox' || f.type === 'submit') return;
        var lab = avail.querySelector('label[for="' + f.id + '"]');
        var name = lab ? lab.textContent.trim() : f.name;
        var val = f.type === 'date' ? fmtDate(f.value) : (f.value || '—');
        L.push(name + ': ' + val);
      });
      L.push('');
      L.push(t('Podem confirmar disponibilidade e diária?',
               '¿Me confirman disponibilidad y tarifa?',
               'Could you confirm availability and the nightly rate?'));
      L.push(t('(O site ainda não publica tarifas — [CONFIRM].)',
               '(La web todavía no publica tarifas — [CONFIRM].)',
               '(The site does not publish rates yet — [CONFIRM].)'));
      return L.join('\n');
    }
    var out = $('.avail__out', avail);
    avail.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = composeAvail();
      if (out) { out.hidden = false; out.textContent = msg; }
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg),
                  '_blank', 'noopener');
    });
    var prev = $('[data-preview]', avail);
    if (prev && out) {
      prev.addEventListener('click', function () {
        out.hidden = false;
        out.textContent = composeAvail();
      });
    }
  }

  /* --------------------------------------------------------- view filters -
     The filters narrow a grid that is FULLY PRESENT in the HTML. With
     JavaScript off, all eleven units are visible — which is the entire
     argument this rebuild is making. */
  var filterBtns = $$('.filters button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-view');
      filterBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      $$('[data-views]').forEach(function (card) {
        card.hidden = !!want && card.getAttribute('data-views').indexOf(want) < 0;
      });
      $$('[data-row-views]').forEach(function (row) {
        row.hidden = !!want && row.getAttribute('data-row-views').indexOf(want) < 0;
      });
    });
  });

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Pietra Flat', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        var val = f.type === 'date' ? fmtDate(f.value) : (f.value || '—');
        lines.push((lab ? lab.textContent.trim() : f.name) + ': ' + val);
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Enviado desde el formulario de la web — maqueta de demostración.)',
                   '(Sent from the site form — demonstration mockup.)'));
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  });

  /* ------------------------------------------------- WhatsApp pre-fills --
     Their existing floating button is folded into the sticky bar rather
     than layered over it; every link is built here so the pre-filled text
     matches the locale of the page. */
  $$('[data-wa]').forEach(function (el) {
    var key = el.getAttribute('data-wa');
    var msg;
    if (key === 'reserva') {
      msg = t('Olá! Queria consultar disponibilidade no Pietra Flat.',
              '¡Hola! Quería consultar disponibilidad en Pietra Flat.',
              'Hello! I would like to check availability at Pietra Flat.');
    } else {
      msg = t('Olá! Vim pelo site do Pietra Flat.',
              '¡Hola! Vengo desde la web de Pietra Flat.',
              'Hello! I came from the Pietra Flat website.');
    }
    el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ===================================================================== */
  /*  LGPD CONSENT — the most urgent compliance item on this lead           */
  /*                                                                        */
  /*  Their live site loads Google Tag Manager (GTM-MBQ68L5W) and the       */
  /*  Asksuite chat widget (cdn.asksuite.com/infochat.js, company id        */
  /*  "pietra-flat") ON PAGE LOAD, with no consent mechanism anywhere in    */
  /*  the served HTML and no privacy policy link. Both set identifiers.     */
  /*                                                                        */
  /*  Here BOTH sit behind the gate below and neither is loaded until the   */
  /*  visitor opts in. The loaders are written out but deliberately inert   */
  /*  in this mockup: nothing third-party is contacted from a spec build.   */
  /* ===================================================================== */
  var ck = $('#ck');
  var CK_KEY = 'pietra.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }

  function loadGatedTags(c) {
    if (!c) return;
    if (c.analytics) {
      /* GTM-MBQ68L5W would be injected HERE, and only here — never on load.
         Left inert in the mockup so no container is fired from a spec build. */
    }
    if (c.marketing) {
      /* The Asksuite assistant (company id "pietra-flat") would load HERE.
         It stays a channel, not the only booking path — the availability
         widget above is the primary route. Also inert in the mockup. */
    }
  }

  function writeConsent(o) {
    try { window.localStorage.setItem(CK_KEY, JSON.stringify(o)); } catch (e) {}
    if (ck) ck.classList.remove('is-on');
    loadGatedTags(o);
  }

  if (ck) {
    var existing = readConsent();
    if (!existing) window.setTimeout(function () { ck.classList.add('is-on'); }, 900);
    else loadGatedTags(existing);
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

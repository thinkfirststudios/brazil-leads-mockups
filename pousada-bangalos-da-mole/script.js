/* ==========================================================================
   POUSADA BANGALÔS DA MOLE — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Shared by the pt-BR tree (/) and the EN tree (/en/). Language is read off
   <html lang>; both trees are real, separately authored pages.

   ⚠️ NO WHATSAPP NUMBER WAS CAPTURED. Nothing was fetchable: the only public
   presence is an Instagram profile behind a login wall. So no number is
   dialled anywhere in this build. Every WhatsApp control is visibly disabled
   and explains why when tapped — a placeholder number on a published site
   rings a stranger's phone. Fill WA_NUMBER in and the whole page wakes up.

   ⚠️ THE OYO QUESTION. Their handle carries an "oyo" prefix. Nothing about
   OYO — no name, no mark, no colour, no rate claim — appears in this build,
   and no "melhor preço direto" claim is made anywhere, because rate parity
   under a live franchise or OTA agreement may forbid exactly that.
   ========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  /* [CONFIRM WhatsApp — blocking. Nothing can be wired without it.] */
  var WA_NUMBER = null;

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

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
  var panes = $$('.hero__pane img');
  if (panes.length && !RM) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.4) {
          panes.forEach(function (im, k) {
            im.style.transform =
              'translate3d(0,' + (y * (k ? 0.13 : 0.08)).toFixed(1) + 'px,0) scale(1.1)';
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------ WhatsApp gating */
  function noNumber() {
    window.alert(t(
      'Nenhum número de WhatsApp foi capturado para a Pousada Bangalôs da Mole. Não há site, e o ' +
      'único canal público — o Instagram — fica atrás de uma barreira de login.\n\n' +
      'Esta maquete deliberadamente NÃO coloca um número no lugar: um número de exemplo num site ' +
      'publicado toca no telefone de um desconhecido.\n\n' +
      'Confirme o WhatsApp e todos os botões desta página passam a funcionar.',
      'No WhatsApp number was captured for Pousada Bangalôs da Mole. There is no website, and the ' +
      'only public channel — Instagram — sits behind a login wall.\n\n' +
      'This mockup deliberately does NOT put a stand-in number in its place: a placeholder number ' +
      'on a published site rings a stranger’s phone.\n\n' +
      'Confirm the WhatsApp number and every button on this page wakes up.'));
  }

  function wireWA(el, msg) {
    if (WA_NUMBER) {
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.removeAttribute('data-unconfirmed');
    } else {
      el.setAttribute('data-unconfirmed', '');
      el.setAttribute('href', '#');
      el.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
    }
  }

  $$('[data-wa]').forEach(function (el) {
    var key = el.getAttribute('data-wa');
    var msg = key === 'reserva'
      ? t('Olá! Queria consultar disponibilidade nos bangalôs.',
          'Hello! I would like to check availability in the bungalows.')
      : t('Olá! Vim pelo site da Pousada Bangalôs da Mole.',
          'Hello! I came from the Pousada Bangalôs da Mole website.');
    wireWA(el, msg);
  });

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET                                                   */
  /*  Dates render DD/MM. It checks no calendar and quotes no rate — none    */
  /*  is published anywhere — and until a booking engine is chosen it        */
  /*  composes a WhatsApp message with the dates pre-filled. If OYO controls */
  /*  distribution this may have to hand off to their engine instead.       */
  /* ===================================================================== */
  function ddmm(v) {
    if (!v || v.indexOf('-') < 0) return v || '—';
    var p = v.split('-');
    return p.length >= 3 ? p[2] + '/' + p[1] : v;
  }

  var avail = $('#avail');
  if (avail) {
    function composeAvail() {
      var L = [];
      L.push(t('*Consulta de disponibilidade — pelo site*',
               '*Availability enquiry — from the website*'));
      L.push('');
      $$('select, input', avail).forEach(function (f) {
        if (!f.name || f.type === 'checkbox' || f.type === 'submit') return;
        var lab = avail.querySelector('label[for="' + f.id + '"]');
        var name = lab ? lab.textContent.trim() : f.name;
        L.push(name + ': ' + (f.type === 'date' ? ddmm(f.value) : (f.value || '—')));
      });
      L.push('');
      L.push(t('Podem confirmar disponibilidade e valor?',
               'Could you confirm availability and the rate?'));
      L.push(t('(O site ainda não publica tarifas — [CONFIRM].)',
               '(The site does not publish rates yet — [CONFIRM].)'));
      return L.join('\n');
    }
    var out = $('.avail__out', avail);
    avail.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = composeAvail();
      if (out) { out.hidden = false; out.textContent = msg; }
      if (!WA_NUMBER) { noNumber(); return; }
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

  /* ===================================================================== */
  /*  SITE PLAN — the signature section                                     */
  /*                                                                        */
  /*  Markers are real <button> elements inside the SVG's foreignObject-free */
  /*  structure (SVG <g> wrapped in <a role="button"> would not be keyboard  */
  /*  operable everywhere, so they are rendered as native buttons overlaid   */
  /*  in an SVG <switch>-free layout). Each carries an accessible name.      */
  /*                                                                        */
  /*  The plain list beneath is NOT a fallback bolted on — it ships in the   */
  /*  HTML, fully readable, and stays visible. Anyone who would rather       */
  /*  scroll than poke at a map gets the same information.                   */
  /* ===================================================================== */
  var plan = $('#plan');
  if (plan) {
    var pins = $$('.pin', plan);
    var cards = $$('[data-unit-card]', plan);

    function showUnit(id) {
      pins.forEach(function (p) {
        p.setAttribute('aria-pressed', p.getAttribute('data-unit') === id ? 'true' : 'false');
      });
      cards.forEach(function (c) {
        c.hidden = c.getAttribute('data-unit-card') !== id;
      });
    }

    pins.forEach(function (p) {
      p.addEventListener('click', function () { showUnit(p.getAttribute('data-unit')); });
    });
    if (pins.length) showUnit(pins[0].getAttribute('data-unit'));
  }

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Pousada Bangalôs da Mole', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        lines.push((lab ? lab.textContent.trim() : f.name) + ': ' +
                   (f.type === 'date' ? ddmm(f.value) : (f.value || '—')));
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Sent from the site form — demonstration mockup.)'));
      if (!WA_NUMBER) { noNumber(); return; }
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  });

  /* ------------------------------------------------------- cookie consent -
     LGPD art. 7 / 8. The Instagram embed is a third-party tracker, so it
     sits behind the marketing category and the static tile fallback shows
     until marketing cookies are accepted. */
  var ck = $('#ck');
  var CK_KEY = 'bangalos.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function applyConsent(c) {
    var gate = $('#igate');
    if (c && c.marketing) {
      /* The live Instagram embed would be injected HERE, and only here.
         Left inert in the mockup: a spec build contacts no third party. */
      if (gate) gate.setAttribute('data-consented', 'yes');
    }
  }
  function writeConsent(o) {
    try { window.localStorage.setItem(CK_KEY, JSON.stringify(o)); } catch (e) {}
    if (ck) ck.classList.remove('is-on');
    applyConsent(o);
  }
  if (ck) {
    var existing = readConsent();
    if (!existing) window.setTimeout(function () { ck.classList.add('is-on'); }, 900);
    else applyConsent(existing);
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

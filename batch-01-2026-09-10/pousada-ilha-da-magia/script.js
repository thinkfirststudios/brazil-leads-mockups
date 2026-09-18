/* ==========================================================================
   POUSADA ILHA DA MAGIA — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Shared by the pt-BR tree (/) and the EN tree (/en/). Language is read off
   <html lang>; both trees are real, separately authored pages, not a text
   swap. They sit 800 m from Praia Mole in a district thick with Argentine
   and nomad traffic and publish only in Portuguese — the EN tree is the
   third pitch argument.

   WhatsApp: wa.me/554899448484 is already live on their own site. Used
   exactly as published, with no digit changed.

   Progressive enhancement note: the eighteen units, all eight guest quotes
   and every gallery tile ship in the HTML. JavaScript only switches tabs,
   scrolls rails and filters — nothing here renders content a crawler would
   otherwise miss. That is the whole technical argument of the pitch.
   ========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  var WA_NUMBER = '554899448484';   /* published on their own site */

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

  /* ------------------------------------------------- WhatsApp pre-fills --
     Every wa.me link is built here so the pre-filled text matches the
     locale of the page the visitor is actually on. */
  $$('[data-wa]').forEach(function (el) {
    var key = el.getAttribute('data-wa');
    var msg;
    if (key === 'reserva') {
      msg = t('Olá! Queria consultar disponibilidade na Pousada Ilha da Magia.',
              'Hello! I would like to check availability at Pousada Ilha da Magia.');
    } else if (key === 'cafe') {
      /* Their breakfast buffet is open to the public and has no booking path
         at all today. This is the CTA that gives it one. */
      msg = t('Olá! Queria reservar o café da manhã colonial (buffet aberto ao público).',
              'Hello! I would like to book the colonial breakfast buffet (open to the public).');
    } else if (key === 'turismo') {
      msg = t('Olá! Queria falar com o balcão de turismo sobre passeios e transfer.',
              'Hello! I would like to talk to the tourism desk about excursions and transfers.');
    } else {
      msg = t('Olá! Vim pelo site da Pousada Ilha da Magia.',
              'Hello! I came from the Pousada Ilha da Magia website.');
    }
    el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET                                                   */
  /*  Their current widget appears to be a lead form rather than a live     */
  /*  availability engine. This one is honest about being the same thing:   */
  /*  it checks no calendar, quotes no rate, and composes a WhatsApp        */
  /*  message with the dates filled in. Dates render DD/MM.                 */
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
        L.push((lab ? lab.textContent.trim() : f.name) + ': ' +
               (f.type === 'date' ? ddmm(f.value) : (f.value || '—')));
      });
      L.push('');
      L.push(t('Podem confirmar disponibilidade e diária?',
               'Could you confirm availability and the nightly rate?'));
      L.push(t('(O site ainda não publica tarifas — [CONFIRM].)',
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

  /* --------------------------------------------- accommodation tab switch -
     Eighteen units in one nav dropdown is the problem this replaces. Both
     rails ship in the HTML; JS only hides the inactive one. */
  var tabs = $$('.tabs button[data-tab]');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-tab');
      tabs.forEach(function (b) {
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      $$('[data-rail]').forEach(function (r) {
        r.hidden = r.getAttribute('data-rail') !== key;
      });
    });
  });

  /* ------------------------------------------------------------- rails --- */
  $$('.railctl').forEach(function (ctl) {
    var rail = document.getElementById(ctl.getAttribute('data-for'));
    if (!rail) return;
    $$('button', ctl).forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.getAttribute('data-dir') === 'next' ? 1 : -1;
        var step = rail.firstElementChild ? rail.firstElementChild.offsetWidth + 18 : 280;
        rail.scrollBy({ left: dir * step, behavior: RM ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------------------------------------------------- gallery filters -- */
  var galBtns = $$('.filters button[data-cat]');
  galBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var want = btn.getAttribute('data-cat');
      galBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      $$('[data-gal]').forEach(function (fig) {
        fig.hidden = !!want && fig.getAttribute('data-gal') !== want;
      });
    });
  });

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Pousada Ilha da Magia', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        lines.push((lab ? lab.textContent.trim() : f.name) + ': ' +
                   (f.type === 'date' ? ddmm(f.value) : (f.value || '—')));
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Sent from the site form — demonstration mockup.)'));
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  });

  /* ------------------------------------------------------- cookie consent -
     LGPD art. 7 / 8. No consent banner and no privacy policy were found on
     their live site; both had to be written here. Non-essential is off by
     default and reject carries the same weight as accept. */
  var ck = $('#ck');
  var CK_KEY = 'ilhadamagia.consent.v1';

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

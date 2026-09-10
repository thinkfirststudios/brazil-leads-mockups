/* ==========================================================================
   HOTEL BOUTIQUE QUINTA DAS VIDEIRAS — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Shared by the pt-BR tree (/) and the EN tree (/en/). Their live site is
   Portuguese-only in structure while displaying two English-language guest
   testimonials from international visitors — that gap is a direct sales
   argument, so the EN tree here is a real page, never a text swap.

   ⚠️ WHATSAPP. Their site carries no wa.me link anywhere. The commercial
   line +55 (48) 99991-8065 has a mobile prefix and is "likely" their
   WhatsApp — likely is not confirmed, so nothing is dialled. Both published
   phone numbers work as tel: links, because those are theirs and verified;
   the WhatsApp controls stay disabled and say why.

   ⚠️ THREE THINGS THIS FILE DELIBERATELY WILL NOT DO:
     · print a review score — four badges reading 9,4/10 sit on their
       homepage with no platform logo rendered, so no source is known;
     · print a ranking — "among the 10 best hotels in Brazil" has no
       awarding body and no year;
     · name a guest — republishing a named person's quote and profession
       needs documented permission, so the testimonial module renders
       initials until that permission exists.
   Each of the three has a switch below. All three default to off.
   ========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  /* [CONFIRM WhatsApp — no wa.me link exists on their site, and a mobile
     prefix alone does not confirm the line answers there.] */
  var WA_NUMBER = null;

  /* --- the three consent-and-sourcing switches, all off by default ------ */
  var SHOW_SCORES = false;      /* [CONFIRM which platforms; then pull live] */
  var SHOW_RANKING = false;     /* [CONFIRM awarding body and year, or drop] */
  var NAMES_PERMITTED = false;  /* [CONFIRM written permission per guest]    */

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
        el.style.transitionDelay = Math.min(i, 6) * 110 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- hero parallax --
     Slow. A 19th-century manor should not bounce. */
  var heroImg = $('.hero img');
  if (heroImg && !RM) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.4) {
          heroImg.style.transform = 'translate3d(0,' + (y * 0.1).toFixed(1) + 'px,0) scale(1.08)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------ WhatsApp gating */
  function noNumber() {
    window.alert(t(
      'Nenhum link de WhatsApp existe no site do Hotel Boutique Quinta das Videiras. O telefone ' +
      'comercial +55 (48) 99991-8065 tem prefixo de celular e provavelmente é também o WhatsApp — ' +
      'mas provavelmente não é confirmado.\n\n' +
      'Esta maquete deliberadamente NÃO monta um link wa.me a partir de um palpite: se o número ' +
      'não atender por lá, a mensagem simplesmente não chega.\n\n' +
      'Os dois telefones publicados funcionam agora, como chamada: reservas +55 (48) 3232-3005 e ' +
      'comercial +55 (48) 99991-8065. Confirme o WhatsApp e todos os botões desta página passam a ' +
      'funcionar.',
      'No WhatsApp link exists anywhere on Hotel Boutique Quinta das Videiras’ website. The ' +
      'commercial line +55 (48) 99991-8065 carries a mobile prefix and is probably also their ' +
      'WhatsApp — but probably is not confirmed.\n\n' +
      'This mockup deliberately does NOT build a wa.me link from a guess: if the line does not ' +
      'answer there, the message simply never arrives.\n\n' +
      'Both published numbers work now, as calls: reservations +55 (48) 3232-3005 and commercial ' +
      '+55 (48) 99991-8065. Confirm the WhatsApp number and every button on this page works.'));
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
    var msg;
    if (key === 'reserva') {
      msg = t('Olá! Queria consultar disponibilidade no Hotel Boutique Quinta das Videiras.',
              'Hello! I would like to check availability at Hotel Boutique Quinta das Videiras.');
    } else if (key === 'casamento') {
      msg = t('Olá! Queria informações sobre casamento no Quinta das Videiras.',
              'Hello! I would like information about a wedding at Quinta das Videiras.');
    } else if (key === 'bistro') {
      msg = t('Olá! Queria reservar uma mesa no Bistrô Sete Ais.',
              'Hello! I would like to book a table at Bistrô Sete Ais.');
    } else {
      msg = t('Olá! Vim pelo site do Quinta das Videiras.',
              'Hello! I came from the Quinta das Videiras website.');
    }
    wireWA(el, msg);
  });

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET                                                   */
  /*  Their live site puts a bare "RESERVAR" link where this belongs. This   */
  /*  composes the enquiry with dates and the chosen suite category. It      */
  /*  checks no calendar and quotes no rate — none is published — and it     */
  /*  says so rather than implying a live engine. Dates render DD/MM.        */
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

  /* ------------------------------------------------------------- rails --- */
  $$('.railctl').forEach(function (ctl) {
    var rail = document.getElementById(ctl.getAttribute('data-for'));
    if (!rail) return;
    $$('button', ctl).forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.getAttribute('data-dir') === 'next' ? 1 : -1;
        var step = rail.firstElementChild ? rail.firstElementChild.offsetWidth + 26 : 300;
        rail.scrollBy({ left: dir * step, behavior: RM ? 'auto' : 'smooth' });
      });
    });
  });

  /* ------------------------------------------------- sourcing safeguards -
     The three switches at the top of this file are enforced here rather
     than left to whoever edits the markup next. Everything ships off. */
  if (!SHOW_SCORES) {
    $$('[data-score]').forEach(function (el) {
      el.textContent = t('[CONFIRM plataforma]', '[CONFIRM platform]');
      el.className = 'cfm';
    });
  }
  if (!SHOW_RANKING) {
    $$('[data-ranking]').forEach(function (el) { el.hidden = true; });
  }
  if (!NAMES_PERMITTED) {
    /* Degrade a named attribution to initials, in place. The quote itself
       stays as a [CONFIRM] until permission and an accurate transcription
       are both in hand. */
    $$('[data-guest]').forEach(function (el) {
      var full = el.getAttribute('data-guest') || '';
      var initials = full.split(/\s+/).filter(Boolean).map(function (w) {
        return w.charAt(0).toUpperCase() + '.';
      }).join(' ');
      el.textContent = initials + ' — ' + t('[CONFIRM permissão para nomear]',
                                            '[CONFIRM permission to name]');
    });
  }

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Quinta das Videiras', ''];
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
     LGPD art. 7 / 8. Their nav has a "Políticas" item; whether it contains
     an actual LGPD privacy notice or only house rules is [CONFIRM]. The
     newsletter needs explicit, unbundled consent — it has its own checkbox,
     separate from any other. */
  var ck = $('#ck');
  var CK_KEY = 'quinta.consent.v1';

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

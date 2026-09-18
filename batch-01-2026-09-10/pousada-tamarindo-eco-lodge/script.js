/* ==========================================================================
   POUSADA VILA TAMARINDO ECO LODGE — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Three real locale trees — / (pt-BR), /es/, /en/ — because their site
   already runs in Portuguese, Spanish and English and regressing to two
   would be a step backwards. [CONFIRM whether their existing EN/ES versions
   are genuine translations.]

   ⚠️ WHATSAPP. Their site carries no wa.me link anywhere. (48) 99183-3464
   has a mobile prefix and is probably the WhatsApp line — probably is not
   confirmed, so nothing is dialled here. The number works as a tel: link,
   because that is theirs and verified.

   ⚠️ THE AWARD AND CERTIFICATION SWITCHES. Their homepage claims "os
   diversos prêmios recebidos" and a "premiado jardim" without naming a
   single award, and three certifications without a certificate number or a
   validity date anywhere. Under the CDC an unsubstantiated claim like that
   is a liability, and certification programmes lapse. Both switches below
   default to off, and the enforcement happens here rather than being left
   to whoever edits the markup next.
   ========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var ES = LANG.indexOf('es') === 0;
  var EN = LANG.indexOf('en') === 0;
  function t(pt, es, en) { return EN ? en : (ES ? es : pt); }

  /* [CONFIRM WhatsApp — no wa.me link exists on their site.] */
  var WA_NUMBER = null;

  /* --- the two sourcing switches, both off by default ------------------- */
  var AWARDS_NAMED = false;      /* [CONFIRM award names, bodies and years]  */
  var CERTS_CURRENT = false;     /* [CONFIRM certificate numbers + validity] */

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
        el.style.transitionDelay = Math.min(i, 6) * 95 + 'ms';
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
          heroImg.style.transform = 'translate3d(0,' + (y * 0.11).toFixed(1) + 'px,0) scale(1.09)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------ WhatsApp gating */
  function noNumber() {
    window.alert(t(
      'Nenhum link de WhatsApp existe no site da Pousada Vila Tamarindo. O telefone ' +
      '(48) 99183-3464 tem prefixo de celular e provavelmente é o WhatsApp — mas provavelmente ' +
      'não é confirmado.\n\n' +
      'Esta maquete deliberadamente NÃO monta um link wa.me a partir de um palpite: se a linha ' +
      'não atender por lá, a mensagem simplesmente não chega.\n\n' +
      'O telefone funciona agora, como chamada. Confirme o WhatsApp e todos os botões desta ' +
      'página passam a funcionar.',
      'No existe ningún enlace de WhatsApp en la web de Pousada Vila Tamarindo. El teléfono ' +
      '(48) 99183-3464 tiene prefijo de celular y probablemente sea el WhatsApp — pero ' +
      'probablemente no está confirmado.\n\n' +
      'Esta maqueta deliberadamente NO arma un enlace wa.me a partir de una suposición: si la ' +
      'línea no atiende por ahí, el mensaje simplemente no llega.\n\n' +
      'El teléfono funciona ahora, como llamada. Confirmá el WhatsApp y todos los botones de esta ' +
      'página empiezan a funcionar.',
      'No WhatsApp link exists anywhere on Pousada Vila Tamarindo’s website. The number ' +
      '+55 48 99183-3464 carries a mobile prefix and is probably the WhatsApp line — but probably ' +
      'is not confirmed.\n\n' +
      'This mockup deliberately does NOT build a wa.me link from a guess: if the line does not ' +
      'answer there, the message simply never arrives.\n\n' +
      'The number works now, as a call. Confirm the WhatsApp number and every button on this page ' +
      'works.'));
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
      msg = t('Olá! Queria consultar disponibilidade na Pousada Vila Tamarindo.',
              '¡Hola! Quería consultar disponibilidad en Pousada Vila Tamarindo.',
              'Hello! I would like to check availability at Pousada Vila Tamarindo.');
    } else if (key === 'office') {
      msg = t('Olá! Queria informações sobre o Beach Office e estadia mensal.',
              '¡Hola! Quería información sobre el Beach Office y la estadía mensual.',
              'Hello! I would like information about the Beach Office and monthly stays.');
    } else if (key === 'evento') {
      msg = t('Olá! Queria informações sobre eventos e retiros na pousada.',
              '¡Hola! Quería información sobre eventos y retiros en la posada.',
              'Hello! I would like information about events and retreats at the lodge.');
    } else {
      msg = t('Olá! Vim pelo site da Pousada Vila Tamarindo.',
              '¡Hola! Vengo desde la web de Pousada Vila Tamarindo.',
              'Hello! I came from the Pousada Vila Tamarindo website.');
    }
    wireWA(el, msg);
  });

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET — the biggest single fix on this lead             */
  /*                                                                        */
  /*  Their current widget collects Adultos and Crianças with an age        */
  /*  selector and renders NO DATE FIELDS AT ALL, which makes it a dead     */
  /*  end. This one keeps their field set and adds the dates, the unit type */
  /*  and the pet question. Dates render DD/MM. It checks no calendar and   */
  /*  quotes no rate, and says so.                                          */
  /* ===================================================================== */
  function ddmm(v) {
    if (!v || v.indexOf('-') < 0) return v || '—';
    var p = v.split('-');
    return p.length >= 3 ? p[2] + '/' + p[1] : v;
  }

  var avail = $('#avail');
  if (avail) {
    /* the child-age selector only appears when children > 0, exactly as
       their own widget behaves */
    var kids = $('[name="criancas"]', avail);
    var ages = $('#av-ages', avail);
    function syncAges() {
      if (!kids || !ages) return;
      ages.hidden = !(parseInt(kids.value, 10) > 0);
    }
    if (kids) kids.addEventListener('change', syncAges);
    if (kids) kids.addEventListener('input', syncAges);
    syncAges();

    function composeAvail() {
      var L = [];
      L.push(t('*Consulta de disponibilidade — pelo site*',
               '*Consulta de disponibilidad — desde la web*',
               '*Availability enquiry — from the website*'));
      L.push('');
      $$('select, input', avail).forEach(function (f) {
        if (!f.name || f.type === 'submit') return;
        if (f.closest && f.closest('[hidden]')) return;
        var lab = avail.querySelector('label[for="' + f.id + '"]');
        var val = f.type === 'checkbox' ? (f.checked ? t('sim', 'sí', 'yes')
                                                     : t('não', 'no', 'no'))
                                        : (f.type === 'date' ? ddmm(f.value) : (f.value || '—'));
        L.push((lab ? lab.textContent.trim() : f.name) + ': ' + val);
      });
      L.push('');
      L.push(t('Podem confirmar disponibilidade, diária e a taxa de sustentabilidade?',
               '¿Me confirman disponibilidad, tarifa y la tasa de sostenibilidad?',
               'Could you confirm availability, the rate and the sustainability fee?'));
      L.push(t('(O site ainda não publica tarifas nem o valor da taxa — [CONFIRM].)',
               '(La web todavía no publica tarifas ni el valor de la tasa — [CONFIRM].)',
               '(The site does not publish rates or the fee amount yet — [CONFIRM].)'));
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
        var step = rail.firstElementChild ? rail.firstElementChild.offsetWidth + 20 : 280;
        rail.scrollBy({ left: dir * step, behavior: RM ? 'auto' : 'smooth' });
      });
    });
  });

  /* --------------------------------------------------- sourcing safeguards */
  if (!AWARDS_NAMED) {
    /* "Os diversos prêmios recebidos" and "premiado jardim" stay out until an
       award, an awarding body and a year exist for each. */
    $$('[data-award]').forEach(function (el) { el.hidden = true; });
  }
  if (!CERTS_CURRENT) {
    /* No certification MARK is rendered without a live certificate number and
       validity date. The chips stay as visible slots. */
    $$('[data-cert-mark]').forEach(function (el) {
      el.textContent = t('[CONFIRM nº e validade]', '[CONFIRM nº y vigencia]',
                         '[CONFIRM number and validity]');
      el.className = 'cfm slot';
    });
  }

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Vila Tamarindo', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        lines.push((lab ? lab.textContent.trim() : f.name) + ': ' +
                   (f.type === 'date' ? ddmm(f.value) : (f.value || '—')));
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Enviado desde el formulario de la web — maqueta de demostración.)',
                   '(Sent from the site form — demonstration mockup.)'));
      if (!WA_NUMBER) { noNumber(); return; }
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  });

  /* ------------------------------------------------------- cookie consent -
     LGPD art. 7 / 8. No privacy policy was found on their site; this one was
     written from scratch. Non-essential off by default, reject as prominent
     as accept. */
  var ck = $('#ck');
  var CK_KEY = 'tamarindo.consent.v1';

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

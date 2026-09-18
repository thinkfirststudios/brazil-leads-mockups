/* ==========================================================================
   POUSADA ILHA FACEIRA — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Three real locale trees — / (pt-BR), /es/, /en/ — because their live site
   already offers Português / English / Español and regressing to two would
   be a step backwards. [CONFIRM whether their existing EN/ES versions are
   genuine translations or a machine widget; that decides whether this is a
   rebuild or a retrofit.]

   ⚠️ WHATSAPP. Their site carries (48) 98850-6595 as a mobile number but
   has NO wa.me deep link anywhere. A mobile prefix is not a confirmation
   that WhatsApp is on the line, so this build does not dial it: every
   WhatsApp control is visibly disabled and says why. The landline and the
   mobile are both published as tel: links, because those are theirs and
   verified. Set WA_NUMBER once it is confirmed and every button wakes up.

   ⚠️ THE RANKING CLAIM. Their homepage hardcodes "Nº 1 de 321 pousadas em
   Florianópolis, segundo avaliações do TripAdvisor" with no date. A ranking
   that quietly goes stale is a consumer-protection exposure under the CDC,
   not just an embarrassment. Nothing here asserts a rank: the module renders
   the claim only alongside a visible date stamp, and the stamp itself is a
   [CONFIRM] until the value is pulled live.
   ========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var ES = LANG.indexOf('es') === 0;
  var EN = LANG.indexOf('en') === 0;
  function t(pt, es, en) { return EN ? en : (ES ? es : pt); }

  /* [CONFIRM — (48) 98850-6595 is a mobile number, but no wa.me link exists
     on their site and a mobile prefix alone does not confirm WhatsApp.] */
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
          heroImg.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0) scale(1.1)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------ WhatsApp gating */
  function noNumber() {
    window.alert(t(
      'Nenhum link de WhatsApp foi encontrado no site da Pousada Ilha Faceira. O celular ' +
      '(48) 98850-6595 está publicado, mas um prefixo de celular não confirma, sozinho, que o ' +
      'número atende no WhatsApp.\n\n' +
      'Esta maquete deliberadamente NÃO monta um link wa.me a partir de um palpite: se o número ' +
      'não for o certo, a mensagem cai no telefone de outra pessoa.\n\n' +
      'Confirme o WhatsApp comercial e todos os botões desta página passam a funcionar. O fixo ' +
      '(48) 3364-0421 e o celular acima funcionam agora, como chamada.',
      'No se encontró ningún enlace de WhatsApp en la web de Pousada Ilha Faceira. El celular ' +
      '(48) 98850-6595 está publicado, pero un prefijo de celular por sí solo no confirma que el ' +
      'número atienda por WhatsApp.\n\n' +
      'Esta maqueta deliberadamente NO arma un enlace wa.me a partir de una suposición: si el ' +
      'número no es el correcto, el mensaje cae en el teléfono de otra persona.\n\n' +
      'Confirmá el WhatsApp comercial y todos los botones de esta página empiezan a funcionar. El ' +
      'fijo (48) 3364-0421 y el celular de arriba funcionan ahora, como llamada.',
      'No WhatsApp link was found on Pousada Ilha Faceira’s website. The mobile number ' +
      '+55 48 98850-6595 is published, but a mobile prefix alone does not confirm that the line ' +
      'answers on WhatsApp.\n\n' +
      'This mockup deliberately does NOT build a wa.me link from a guess: if the number is wrong, ' +
      'the message reaches somebody else’s phone.\n\n' +
      'Confirm the business WhatsApp number and every button on this page wakes up. The landline ' +
      '+55 48 3364-0421 and the mobile above work now, as calls.'));
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
      ? t('Olá! Queria consultar disponibilidade e valores na Pousada Ilha Faceira.',
          '¡Hola! Quería consultar disponibilidad y tarifas en Pousada Ilha Faceira.',
          'Hello! I would like to check availability and rates at Pousada Ilha Faceira.')
      : t('Olá! Vim pelo site da Pousada Ilha Faceira.',
          '¡Hola! Vengo desde la web de Pousada Ilha Faceira.',
          'Hello! I came from the Pousada Ilha Faceira website.');
    wireWA(el, msg);
  });

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET                                                   */
  /*                                                                        */
  /*  Their field set is kept exactly — Entrada / Saída / Adultos /          */
  /*  Crianças / Código — because it is the right field set. Two things are  */
  /*  fixed: the rate range now shows BEFORE the search (their version is a  */
  /*  black box, and browsers bounce off black boxes), and on mobile this    */
  /*  docks as a sheet instead of a wall of inputs.                          */
  /*                                                                        */
  /*  The range itself is a [CONFIRM]. No rate is published anywhere on      */
  /*  their site, so none is invented here — the point is the mechanism.     */
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
               '*Consulta de disponibilidad — desde la web*',
               '*Availability enquiry — from the website*'));
      L.push('');
      $$('select, input', avail).forEach(function (f) {
        if (!f.name || f.type === 'checkbox' || f.type === 'submit') return;
        var lab = avail.querySelector('label[for="' + f.id + '"]');
        L.push((lab ? lab.textContent.trim() : f.name) + ': ' +
               (f.type === 'date' ? ddmm(f.value) : (f.value || '—')));
      });
      L.push('');
      L.push(t('Podem confirmar disponibilidade e valor?',
               '¿Me confirman disponibilidad y valor?',
               'Could you confirm availability and the rate?'));
      L.push(t('(O site ainda não publica faixa de valores — [CONFIRM].)',
               '(La web todavía no publica un rango de tarifas — [CONFIRM].)',
               '(The site does not publish a rate range yet — [CONFIRM].)'));
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

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Pousada Ilha Faceira', ''];
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
     LGPD art. 7 / 8. No privacy policy link was found on their homepage —
     that is a compliance gap, not just a design one. Non-essential is off by
     default and reject carries the same weight as accept. */
  var ck = $('#ck');
  var CK_KEY = 'faceira.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function applyConsent(c) {
    if (c && c.marketing) {
      /* A live TripAdvisor widget is a third-party tracker and would load
         HERE, behind consent — never on page load. Inert in the mockup. */
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

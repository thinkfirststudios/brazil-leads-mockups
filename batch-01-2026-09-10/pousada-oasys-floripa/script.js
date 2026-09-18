/* ==========================================================================
   POUSADA OASYS FLORIPA — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch.

   Shared by the pt-BR tree (/) and the EN tree (/en/). Language is read off
   <html lang>; both trees are real, separately authored pages. A lifestyle
   property that explicitly targets vacationers and tourists is exactly the
   profile where the EN tree earns its keep, so it is not a text swap.

   ⚠️ NO WHATSAPP NUMBER WAS CAPTURED. Nothing was fetchable: the only public
   presence is @oasys.floripa, behind a login wall. So no number is dialled
   anywhere — every WhatsApp control is visibly disabled and says why when
   tapped. Set WA_NUMBER once confirmed and the page wakes up unchanged.

   ⚠️ THE INSTAGRAM EMBED IS A THIRD-PARTY TRACKER. It is the signature
   section of this build and it still sits behind the consent gate, showing
   static tiles until marketing cookies are accepted. Being the most
   important section does not exempt it.
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
  var heroImg = $('.hero__pic img');
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
      'Nenhum número de WhatsApp foi capturado para a Pousada Oasys Floripa. Não existe site, e o ' +
      'único canal público — o Instagram @oasys.floripa — fica atrás de uma barreira de login.\n\n' +
      'Esta maquete deliberadamente NÃO coloca um número no lugar: um número de exemplo num site ' +
      'publicado toca no telefone de um desconhecido.\n\n' +
      'Confirme o WhatsApp e todos os botões desta página passam a funcionar, sem nenhuma outra ' +
      'mudança.',
      'No WhatsApp number was captured for Pousada Oasys Floripa. There is no website, and the ' +
      'only public channel — the Instagram profile @oasys.floripa — sits behind a login wall.\n\n' +
      'This mockup deliberately does NOT put a stand-in number in its place: a placeholder number ' +
      'on a published site rings a stranger’s phone.\n\n' +
      'Confirm the WhatsApp number and every button on this page works, with no other change.'));
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
      ? t('Olá! Queria consultar disponibilidade na Pousada Oasys Floripa.',
          'Hello! I would like to check availability at Pousada Oasys Floripa.')
      : t('Olá! Vim pelo site da Pousada Oasys Floripa.',
          'Hello! I came from the Pousada Oasys Floripa website.');
    wireWA(el, msg);
  });

  /* ===================================================================== */
  /*  AVAILABILITY WIDGET                                                   */
  /*  Until a booking engine is chosen, submit composes a WhatsApp message   */
  /*  with the dates pre-filled — a legitimate interim, and what Brazilian   */
  /*  guests expect anyway. It is described as exactly that rather than      */
  /*  dressed up as a live engine. Dates render DD/MM. No rate is shown,     */
  /*  because none is published.                                             */
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

  /* ------------------------------------------------------- generic forms */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Pousada Oasys Floripa', ''];
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
     LGPD art. 7 / 8. The Instagram embed is the signature section here and
     it is still gated: static tiles show until marketing cookies are
     accepted, and nothing third-party is loaded in this mockup at all. */
  var ck = $('#ck');
  var CK_KEY = 'oasys.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function applyConsent(c) {
    var gate = $('#igate');
    if (c && c.marketing && gate) {
      /* The live @oasys.floripa embed would be injected HERE, and only here.
         Left inert: a spec build contacts no third party. */
      gate.setAttribute('data-consented', 'yes');
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

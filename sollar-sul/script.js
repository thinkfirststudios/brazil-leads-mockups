/* =====================================================================
   Sollar Sul - spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   Note the double L in "Sollar Sul" - a portmanteau of solar and sol. It
   is never silently corrected anywhere in this build.

   NOTHING IS VERIFIED. The only public source for this business is an
   Instagram profile behind a login wall: no phone, no WhatsApp, no email,
   no CNPJ and - critically - no CREA-SC registration. So nothing dials,
   and every contact control says why.

   THE QUOTE FORM NEVER USES mailto:. Personal data does not go into a URL
   query string. It composes a WhatsApp message the visitor sends, and the
   optional CELESC-bill upload is deliberately NOT implemented client-side:
   an electricity bill carries the customer's name, address, installation
   number and occupancy pattern, and that is not something a static mockup
   should be handling at all.
   ===================================================================== */
(function () {
  'use strict';

  var IS_EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return IS_EN ? en : pt; }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WA_NUMBER = null;  /* [CONFIRM] */
  var TEL_NUMBER = null; /* [CONFIRM] - full international format, +55 DD */

  function noNumber() {
    window.alert(t(
      'MOCKUP: nenhum telefone, WhatsApp ou e-mail da Sollar Sul pode ser verificado. O unico canal publico e um perfil de Instagram atras de login. Nada e discado ate que os numeros sejam confirmados por escrito.',
      'MOCKUP: no phone, WhatsApp or email for Sollar Sul could be verified. The only public channel is an Instagram profile behind a login wall. Nothing is dialled until the numbers are confirmed in writing.'
    ));
  }

  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < wa.length; i++) {
      var el = wa[i];
      var msg = el.getAttribute('data-wa') ||
        t('Ola! Vim pelo site da Sollar Sul.', 'Hello! I came from the Sollar Sul website.');
      if (WA_NUMBER) {
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.removeAttribute('data-unconfirmed');
      } else {
        el.setAttribute('href', '#');
        el.setAttribute('data-unconfirmed', '');
        el.setAttribute('aria-describedby', 'contact-unconfirmed-note');
        el.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
      }
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) {
      var tl = tels[j];
      if (TEL_NUMBER) {
        tl.setAttribute('href', 'tel:' + TEL_NUMBER);
        tl.removeAttribute('data-unconfirmed');
      } else {
        tl.setAttribute('href', '#');
        tl.setAttribute('data-unconfirmed', '');
        tl.setAttribute('aria-describedby', 'contact-unconfirmed-note');
        tl.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
      }
    }
  }

  function header() {
    var head = document.querySelector('.site-head');
    var burger = document.querySelector('.burger');
    var mnav = document.querySelector('.mobile-nav');
    if (head) {
      var onScroll = function () {
        if (window.pageYOffset > 24) { head.classList.add('condensed'); }
        else { head.classList.remove('condensed'); }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    if (burger && mnav) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', open ? 'false' : 'true');
        mnav.classList.toggle('open', !open);
      });
      var links = mnav.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
          burger.setAttribute('aria-expanded', 'false');
          mnav.classList.remove('open');
        });
      }
    }
  }

  function reveals() {
    var items = document.querySelectorAll('.rev');
    if (!items.length) { return; }
    if (reduced || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) { items[i].classList.add('in'); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        var e = entries[j];
        if (!e.isIntersecting) { continue; }
        var el = e.target, idx = 0, sib = el;
        while ((sib = sib.previousElementSibling)) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
        }
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.07 });
    for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
  }

  function parallax() {
    var media = document.querySelector('.hero-media img');
    if (!media || reduced) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset;
      if (y < 800) { media.style.transform = 'translate3d(0,' + (y * 0.13) + 'px,0) scale(1.06)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.06)';
  }

  /* Count-ups return on a non-numeric value. Nothing on this build carries
     a real counted figure - no years in business, no systems installed, no
     installed kWp, no savings percentage, no payback - because none of it
     is verified and every one of those is a CDC exposure if wrong. */
  function countUps() {
    var nodes = document.querySelectorAll('[data-count]');
    for (var i = 0; i < nodes.length; i++) {
      var target = parseFloat(nodes[i].getAttribute('data-count'));
      if (isNaN(target)) { continue; }
      nodes[i].textContent = String(target);
    }
  }

  /* ===================================================================
     THE SOLAR QUOTE FORM
     Solar quoting genuinely needs structured input, which is why this is
     the one place in the batch where a form beats WhatsApp. The kWh field
     is the one that matters: it is the difference between a lead you can
     price and a lead you have to chase.
     =================================================================== */
  function quote() {
    var form = document.getElementById('quote');
    if (!form) { return; }
    var status = document.getElementById('quote-status');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var get = function (n) {
        var el = form.elements[n];
        return el && el.value ? el.value.trim() : '';
      };
      var kwh = form.elements['kwh'];
      var consent = form.elements['consent'];

      if (kwh && kwh.value && isNaN(parseFloat(kwh.value))) {
        kwh.setAttribute('aria-invalid', 'true');
        if (status) {
          status.textContent = t('O consumo medio precisa ser um numero em kWh.',
                                 'Average consumption needs to be a number in kWh.');
        }
        if (kwh.focus) { kwh.focus(); }
        return;
      }
      if (kwh) { kwh.removeAttribute('aria-invalid'); }

      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao de contato antes de enviar.',
                                 'Please tick the contact permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }

      var msg = t(
        'Ola! Queria um orcamento de energia solar. Nome: ' + (get('nome') || '[nome]') +
          '. Bairro: ' + (get('bairro') || '[bairro]') + '. Imovel: ' + (get('imovel') || '[tipo]') +
          '. Telhado: ' + (get('telhado') || '[telhado]') + '. Consumo medio: ' +
          (get('kwh') || '[kWh]') + ' kWh/mes. ' + get('mensagem'),
        'Hello! I would like a solar quote. Name: ' + (get('nome') || '[name]') +
          '. Neighbourhood: ' + (get('bairro') || '[area]') + '. Property: ' +
          (get('imovel') || '[type]') + '. Roof: ' + (get('telhado') || '[roof]') +
          '. Average consumption: ' + (get('kwh') || '[kWh]') + ' kWh/month. ' + get('mensagem'));

      if (WA_NUMBER) {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg),
                    '_blank', 'noopener');
        if (status) {
          status.textContent = t('Abrindo o WhatsApp com o teu pedido.',
                                 'Opening WhatsApp with your request.');
        }
      } else {
        if (status) {
          status.textContent = t(
            'MOCKUP: nenhum numero de WhatsApp foi confirmado, entao o pedido nao pode ser enviado. Nada foi gravado e nada foi enviado por e-mail.',
            'MOCKUP: no WhatsApp number has been confirmed, so the request cannot be sent. Nothing was stored and nothing was emailed.');
        }
        noNumber();
      }
    });
  }

  /* ===================================================================
     LGPD consent (Lei 13.709/2018)
     Non-essential off by default, reject as prominent as accept, and the
     consented branch deliberately inert: no tag, pixel or map embed fires
     anywhere in this mockup.
     =================================================================== */
  var CONSENT_KEY = 'sos_lgpd_v1';

  function consent() {
    var sheet = document.getElementById('lgpd');
    if (!sheet) { return; }
    var prefs = document.getElementById('lgpd-prefs');
    var btnAccept = document.getElementById('lgpd-accept');
    var btnReject = document.getElementById('lgpd-reject');
    var btnPrefs = document.getElementById('lgpd-open-prefs');
    var btnSave = document.getElementById('lgpd-save');
    var reopen = document.querySelectorAll('[data-lgpd-reopen]');

    function show() { sheet.classList.add('show'); sheet.removeAttribute('aria-hidden'); }
    function hide() { sheet.classList.remove('show'); sheet.setAttribute('aria-hidden', 'true'); }

    function store(analytics, marketing) {
      try {
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify(
          { a: !!analytics, m: !!marketing, ts: new Date().toISOString() }));
      } catch (e) { /* private mode */ }
      hide();
    }

    if (prefs) { prefs.hidden = true; }
    if (btnPrefs && prefs) {
      btnPrefs.addEventListener('click', function () {
        prefs.hidden = !prefs.hidden;
        btnPrefs.setAttribute('aria-expanded', prefs.hidden ? 'false' : 'true');
      });
    }
    if (btnAccept) { btnAccept.addEventListener('click', function () { store(true, true); }); }
    if (btnReject) { btnReject.addEventListener('click', function () { store(false, false); }); }
    if (btnSave) {
      btnSave.addEventListener('click', function () {
        var a = document.getElementById('ck-analytics');
        var m = document.getElementById('ck-marketing');
        store(a && a.checked, m && m.checked);
      });
    }
    for (var i = 0; i < reopen.length; i++) {
      reopen[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        if (prefs) { prefs.hidden = false; }
        show();
      });
    }
    var seen = null;
    try { seen = window.localStorage.getItem(CONSENT_KEY); } catch (e) { seen = null; }
    if (!seen) { window.setTimeout(show, 900); } else { hide(); }
  }

  function year() {
    var nodes = document.querySelectorAll('[data-year]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  function init() {
    wireContacts();
    header();
    reveals();
    parallax();
    countUps();
    quote();
    consent();
    year();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

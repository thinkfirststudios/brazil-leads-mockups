/* =====================================================================
   Security Floripa - spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   LANGUAGE: shared by the pt-BR and /en/ trees, which are REAL parallel
   pages with their own translated markup and full content on both. This
   is the one lead in the batch where English is a first-class
   requirement, not a secondary nicety: the customer is an absentee owner
   in Sao Paulo, Lisbon or Miami, and a meaningful share of them do not
   read Portuguese.

   NO NUMBER IS CONFIRMED. The only public source for this business is an
   Instagram profile behind a login wall. No phone, no WhatsApp and no
   email could be captured, so nothing is dialled: every contact control
   is visibly disabled and says why. Set WA_NUMBER and TEL_NUMBER once
   they are confirmed and the whole site starts working.
   ===================================================================== */
(function () {
  'use strict';

  var IS_EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return IS_EN ? en : pt; }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WA_NUMBER = null;  /* [CONFIRM] */
  var TEL_NUMBER = null; /* [CONFIRM] - must be stored in full international
                            format, +55 DD number: a large share of this
                            audience dials from another country. */

  function noNumber() {
    window.alert(t(
      'MOCKUP: nenhum telefone, WhatsApp ou e-mail da Security Floripa pode ser verificado. O unico canal publico e um perfil de Instagram atras de login. Nada e discado ate que os numeros sejam confirmados por escrito.',
      'MOCKUP: no phone, WhatsApp or email for Security Floripa could be verified. The only public channel is an Instagram profile behind a login wall. Nothing is dialled until the numbers are confirmed in writing.'
    ));
  }

  function wireContacts() {
    var waNodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < waNodes.length; i++) {
      var el = waNodes[i];
      var msg = el.getAttribute('data-wa') ||
        t('Ola! Vim pelo site da Security Floripa.', 'Hello! I came from the Security Floripa website.');
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
    var telNodes = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < telNodes.length; j++) {
      var tl = telNodes[j];
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

  /* Count-ups return on a non-numeric value. Nothing on this build carries
     a real counted number - no years in business, no systems installed, no
     uptime, no response time - because none of it is verified and a
     security promise that fails is the worst claim to have made. */
  function countUps() {
    var nodes = document.querySelectorAll('[data-count]');
    for (var i = 0; i < nodes.length; i++) {
      var target = parseFloat(nodes[i].getAttribute('data-count'));
      if (isNaN(target)) { continue; }
      nodes[i].textContent = String(target);
    }
  }

  /* The enquiry form never posts personal data through a mailto: query
     string. It composes a WhatsApp message instead, and while no number is
     confirmed it explains that rather than pretending to send. */
  function enquiry() {
    var form = document.getElementById('enquiry');
    if (!form) { return; }
    var status = document.getElementById('enquiry-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var get = function (n) {
        var el = form.elements[n];
        return el && el.value ? el.value.trim() : '';
      };
      var consent = form.elements['consent'];
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t(
            'Marque a autorizacao de contato antes de enviar.',
            'Please tick the contact permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      var msg = t(
        'Ola! Sou ' + (get('nome') || '[nome]') + '. Imovel em ' + (get('bairro') || '[bairro]') +
          ', tipo: ' + (get('tipo') || '[tipo]') + '. Telefone: ' + (get('fone') || '[telefone]') +
          '. ' + get('mensagem'),
        'Hello! I am ' + (get('nome') || '[name]') + '. Property in ' + (get('bairro') || '[area]') +
          ', type: ' + (get('tipo') || '[type]') + '. Phone: ' + (get('fone') || '[phone]') +
          '. ' + get('mensagem'));
      if (WA_NUMBER) {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        if (status) {
          status.textContent = t('Abrindo o WhatsApp com a sua mensagem.',
                                 'Opening WhatsApp with your message.');
        }
      } else {
        if (status) {
          status.textContent = t(
            'MOCKUP: nenhum numero de WhatsApp foi confirmado para esta empresa, entao a mensagem nao pode ser enviada. Nada foi gravado e nada foi enviado por e-mail.',
            'MOCKUP: no WhatsApp number has been confirmed for this business, so the message cannot be sent. Nothing was stored and nothing was emailed.');
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
  var CONSENT_KEY = 'sfl_lgpd_v1';

  function consent() {
    var sheet = document.getElementById('lgpd-sheet');
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
    countUps();
    enquiry();
    consent();
    year();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* =====================================================================
   Smart Hostel Sul da Ilha - spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   LANGUAGE: shared by the pt-BR, /es/ and /en/ trees, which are REAL
   parallel pages with their own translated markup. Spanish is not an
   afterthought here: their own published testimonials include two written
   in Spanish by an Argentine guest, on a site that is Portuguese-only.

   THE RATE LADDER is the centrepiece. Every figure it uses is one Smart
   Hostel actually publishes, and the asymmetric bands are preserved
   exactly - the shared tier breaks at 6/7-14/15-28/29+ while the three
   private tiers break at 7/8-14/15-29/30+. That asymmetry is theirs and
   is not tidied into a uniform grid.
   ===================================================================== */
(function () {
  'use strict';

  var docLang = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var IS_EN = docLang.indexOf('en') === 0;
  var IS_ES = docLang.indexOf('es') === 0;

  function t(pt, en, es) {
    if (IS_ES) { return es === undefined ? en : es; }
    return IS_EN ? en : pt;
  }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Their landline is published. Their WhatsApp is linked but the number
     did not resolve in source, so nothing is dialled on WhatsApp until it
     is confirmed. The tel: link works, because that number is published. */
  var WA_NUMBER = null;               /* [CONFIRM] */
  var TEL_NUMBER = '+554832374944';   /* published */

  function noWA() {
    window.alert(t(
      'MOCKUP: o Smart Hostel publica o telefone (48) 3237-4944, mas o numero de WhatsApp nao foi resolvido na fonte. Nada e discado no WhatsApp ate a confirmacao. O botao de telefone funciona.',
      'MOCKUP: Smart Hostel publishes the landline +55 48 3237-4944, but the WhatsApp number did not resolve in source. Nothing is dialled on WhatsApp until it is confirmed. The phone button works.',
      'MOCKUP: Smart Hostel publica el telefono +55 48 3237-4944, pero el numero de WhatsApp no se resolvio en la fuente. No se marca nada por WhatsApp hasta confirmarlo. El boton de telefono funciona.'
    ));
  }

  function wireContacts() {
    var waNodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < waNodes.length; i++) {
      var el = waNodes[i];
      var msg = el.getAttribute('data-wa') ||
        t('Ola! Vim pelo site do Smart Hostel.', 'Hi! I came from the Smart Hostel website.',
          'Hola! Vengo del sitio de Smart Hostel.');
      if (WA_NUMBER) {
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.removeAttribute('data-unconfirmed');
      } else {
        el.setAttribute('href', '#');
        el.setAttribute('data-unconfirmed', '');
        el.setAttribute('aria-describedby', 'wa-unconfirmed-note');
        el.addEventListener('click', function (ev) { ev.preventDefault(); noWA(); });
      }
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) { tels[j].setAttribute('href', 'tel:' + TEL_NUMBER); }
  }

  function header() {
    var head = document.querySelector('.site-head');
    var burger = document.querySelector('.burger');
    var mnav = document.querySelector('.mobile-nav');
    if (head) {
      var onScroll = function () {
        if (window.pageYOffset > 60) { head.classList.add('condensed'); }
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

  /* Their own Acessibilidade toggle, kept and made to do something real:
     larger type, underlined links and a heavier focus ring, remembered
     between pages. */
  var A11Y_KEY = 'sh_a11y_v1';

  function a11y() {
    var btn = document.getElementById('a11y-toggle');
    if (!btn) { return; }
    function apply(on) {
      document.body.classList.toggle('a11y', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      try { window.localStorage.setItem(A11Y_KEY, on ? '1' : '0'); } catch (e) { /* private mode */ }
    }
    var saved = '0';
    try { saved = window.localStorage.getItem(A11Y_KEY) || '0'; } catch (e) { saved = '0'; }
    apply(saved === '1');
    btn.addEventListener('click', function () {
      apply(btn.getAttribute('aria-pressed') !== 'true');
    });
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
        el.style.transitionDelay = Math.min(idx, 6) * 85 + 'ms';
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
      if (y < 800) { media.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0) scale(1.06)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.06)';
  }

  /* ===================================================================
     THE RATE LADDER
     Each <td> carries data-min and data-max (nights) plus the published
     rate. The applicable band lights up live as the nights control moves,
     and the saving shown is computed from THEIR OWN published numbers -
     never rounded, converted or extrapolated.
     =================================================================== */
  function ladder() {
    var box = document.getElementById('ladder');
    if (!box) { return; }
    var range = document.getElementById('nights');
    var out = document.getElementById('nights-out');
    var live = document.getElementById('ladder-status');
    var cells = box.querySelectorAll('td[data-min]');
    var presets = box.querySelectorAll('[data-nights-preset]');

    function fmt(n) {
      /* BRL only, never converted, with a comma decimal as published */
      return 'R$ ' + n.toFixed(2).replace('.', ',');
    }

    function apply(n) {
      var applied = [];
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        var mn = parseInt(c.getAttribute('data-min'), 10);
        var mxRaw = c.getAttribute('data-max');
        var mx = mxRaw === '' ? Infinity : parseInt(mxRaw, 10);
        var on = n >= mn && n <= mx;
        c.classList.toggle('on', on);
        if (on) { applied.push(c); }
      }
      if (out) {
        out.firstChild.nodeValue = String(n);
      }
      for (var p = 0; p < presets.length; p++) {
        presets[p].setAttribute('aria-pressed',
          parseInt(presets[p].getAttribute('data-nights-preset'), 10) === n ? 'true' : 'false');
      }
      if (live && applied.length) {
        var parts = [];
        for (var q = 0; q < applied.length; q++) {
          var row = applied[q].closest('tr');
          var name = row ? row.querySelector('th').textContent.trim() : '';
          parts.push(name + ' ' + fmt(parseFloat(applied[q].getAttribute('data-rate'))));
        }
        live.textContent = t(
          'Para ' + n + ' noites: ' + parts.join(' - '),
          'For ' + n + ' nights: ' + parts.join(' - '),
          'Para ' + n + ' noches: ' + parts.join(' - '));
      }
      var mirror = document.getElementById('b-nights');
      if (mirror) { mirror.value = String(n); }
    }

    if (range) {
      range.addEventListener('input', function () { apply(parseInt(range.value, 10)); });
    }
    for (var p = 0; p < presets.length; p++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var n = parseInt(btn.getAttribute('data-nights-preset'), 10);
          if (range) { range.value = String(n); }
          apply(n);
        });
      })(presets[p]);
    }
    apply(range ? parseInt(range.value, 10) : 3);
  }

  /* The booking widget and the ladder speak to each other: changing the
     dates updates the nights counter, which drives the table above. */
  function booking() {
    var form = document.getElementById('booking');
    if (!form) { return; }
    var inEl = document.getElementById('b-in');
    var outEl = document.getElementById('b-out');
    var nightsEl = document.getElementById('b-nights');
    var range = document.getElementById('nights');
    var status = document.getElementById('booking-status');

    function recalc() {
      if (!inEl || !outEl || !inEl.value || !outEl.value) { return; }
      var a = new Date(inEl.value), b = new Date(outEl.value);
      var n = Math.round((b - a) / 86400000);
      if (isNaN(n) || n < 1) { return; }
      if (nightsEl) { nightsEl.value = String(n); }
      if (range) {
        range.value = String(Math.min(n, parseInt(range.max, 10)));
        if (window.CustomEvent) {
          range.dispatchEvent(new CustomEvent('input', { bubbles: true }));
        }
      }
    }
    if (inEl) { inEl.addEventListener('change', recalc); }
    if (outEl) { outEl.addEventListener('change', recalc); }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (status) {
        status.textContent = t(
          'MOCKUP: este formulario nao reserva nada. Na versao real ele entrega os dados ao motor de reservas do Smart Hostel [CONFIRM qual e].',
          'MOCKUP: this form books nothing. In the real version it hands off to the Smart Hostel booking engine [CONFIRM which one].',
          'MOCKUP: este formulario no reserva nada. En la version real entrega los datos al motor de reservas de Smart Hostel [CONFIRM cual es].');
      }
    });
  }

  /* The long-stay enquiry composes a WhatsApp message rather than posting
     personal data anywhere. It refuses to send without the consent tick. */
  function longStay() {
    var form = document.getElementById('longstay');
    if (!form) { return; }
    var status = document.getElementById('longstay-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var get = function (n) {
        var el = form.elements[n];
        return el && el.value ? el.value.trim() : '';
      };
      var consent = form.elements['consent'];
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao de contato antes de enviar.',
                                 'Please tick the contact permission before sending.',
                                 'Marca la autorizacion de contacto antes de enviar.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      var msg = t(
        'Ola! Queria uma estadia longa: ' + (get('tipo') || '[tipo]') + ', de ' +
          (get('inicio') || '[data]') + ' a ' + (get('fim') || '[data]') + '. WhatsApp: ' +
          (get('fone') || '[telefone]') + '.',
        'Hi! I would like a long stay: ' + (get('tipo') || '[type]') + ', from ' +
          (get('inicio') || '[date]') + ' to ' + (get('fim') || '[date]') + '. WhatsApp: ' +
          (get('fone') || '[phone]') + '.',
        'Hola! Queria una estadia larga: ' + (get('tipo') || '[tipo]') + ', del ' +
          (get('inicio') || '[fecha]') + ' al ' + (get('fim') || '[fecha]') + '. WhatsApp: ' +
          (get('fone') || '[telefono]') + '.');
      if (WA_NUMBER) {
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg),
                    '_blank', 'noopener');
      } else {
        if (status) {
          status.textContent = t(
            'MOCKUP: o numero de WhatsApp do Smart Hostel nao foi confirmado, entao a mensagem nao pode ser enviada. Nada foi gravado.',
            'MOCKUP: the Smart Hostel WhatsApp number is not confirmed, so the message cannot be sent. Nothing was stored.',
            'MOCKUP: el numero de WhatsApp de Smart Hostel no esta confirmado, asi que el mensaje no puede enviarse. No se guardo nada.');
        }
        noWA();
      }
    });
  }

  /* ===================================================================
     LGPD consent. They already publish a privacy policy, which puts them
     ahead of most of this batch; what is missing is granular consent and
     a stated position on the guest-account system. Non-essential is off
     by default and the consented branch is inert in this mockup.
     =================================================================== */
  var CONSENT_KEY = 'sh_lgpd_v1';

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
    a11y();
    reveals();
    parallax();
    ladder();
    booking();
    longStay();
    consent();
    year();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

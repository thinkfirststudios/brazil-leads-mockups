/* ===================================================================
   Studio Archi - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). The whole
   thing runs off file:// so the prospect can double-click index.html.

   TWO NUMBERS ARE PUBLISHED AND ONE IS NOT.
   Their site publishes a landline (32) 3321-7456 and a mobile
   (32) 98878-7950. Neither is confirmed as a WhatsApp line, and the
   site carries no wa.me link at all. So tel: works from the mobile
   number, and WhatsApp does NOT resolve until somebody confirms in
   writing that the mobile accepts WhatsApp. A wa.me deep link to a
   number that is not on WhatsApp fails silently in the user's face.
   =================================================================== */
(function () {
  'use strict';

  var TEL_LANDLINE = '+553233217456';   /* published on their own footer */
  var TEL_MOBILE   = '+5532988787950';  /* published on their own footer */
  var WA_NUMBER    = null;              /* [CONFIRM] is the mobile a WhatsApp line? */

  var EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  var reduced = false;
  try {
    reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduced = false; }

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* ---------- contacts ---------------------------------------- */
  function noWhatsApp() {
    window.alert(t(
      'MOCKUP: o site do Studio Archi nao publica nenhum link de WhatsApp, e nao ha confirmacao de que o celular (32) 98878-7950 aceite WhatsApp. Nenhum wa.me e montado ate essa confirmacao por escrito. Use o telefone ou o e-mail contato@studioarchi.com.br.',
      'MOCKUP: the Studio Archi site publishes no WhatsApp link, and there is no confirmation that the mobile (32) 98878-7950 accepts WhatsApp. No wa.me link is built until that is confirmed in writing. Use the phone or contato@studioarchi.com.br.'
    ));
  }

  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    var i, el;
    for (i = 0; i < wa.length; i++) {
      el = wa[i];
      if (WA_NUMBER) {
        var msg = el.getAttribute('data-wa') ||
          t('Ola! Vim pelo site do Studio Archi e gostaria de falar sobre um projeto.',
            'Hello! I came from the Studio Archi website and would like to discuss a project.');
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.removeAttribute('data-unconfirmed');
      } else {
        el.setAttribute('href', '#');
        el.setAttribute('data-unconfirmed', '');
        el.setAttribute('aria-describedby', 'wa-unconfirmed-note');
        el.addEventListener('click', function (ev) { ev.preventDefault(); noWhatsApp(); });
      }
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (i = 0; i < tels.length; i++) {
      el = tels[i];
      var which = el.getAttribute('data-tel') === 'landline' ? TEL_LANDLINE : TEL_MOBILE;
      el.setAttribute('href', 'tel:' + which);
    }
  }

  /* ---------- sticky header ----------------------------------- */
  function header() {
    var head = document.querySelector('.site-head');
    if (!head) { return; }
    var hero = document.querySelector('.hero, .cs-hero');
    var trigger = hero ? 80 : 10;
    var ticking = false;
    function apply() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > trigger) { head.classList.add('solid'); }
      else { head.classList.remove('solid'); }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- mobile menu ------------------------------------- */
  function menu() {
    var burger = document.querySelector('.burger');
    var panel = document.querySelector('.mobile-nav');
    if (!burger || !panel) { return; }
    function close() {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    var links = panel.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) { links[i].addEventListener('click', close); }
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && panel.classList.contains('open')) { close(); burger.focus(); }
    });
  }

  /* ---------- scroll reveals with row stagger ----------------- */
  function reveals() {
    var items = document.querySelectorAll('.rev');
    if (!items.length) { return; }
    if (reduced || !('IntersectionObserver' in window)) {
      for (var k = 0; k < items.length; k++) { items[k].classList.add('in'); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (!e.isIntersecting) { continue; }
        var el = e.target;
        var idx = 0;
        var sib = el.previousElementSibling;
        while (sib) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
          sib = sib.previousElementSibling;
        }
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < items.length; j++) { io.observe(items[j]); }
  }

  /* ---------- hero parallax ----------------------------------- */
  function parallax() {
    if (reduced) { return; }
    var img = document.querySelector('.hero-media img');
    if (!img) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y < window.innerHeight * 1.2) {
        img.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0) scale(1.06)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- sector filter on the case-study grid ------------
     Keyboard-operable: the buttons are real buttons in normal tab
     order, aria-pressed carries the state, and the result count is
     announced through a live region rather than only appearing.
     ----------------------------------------------------------- */
  function filters() {
    var bar = document.querySelector('.filters');
    var grid = document.querySelector('.pgrid');
    if (!bar || !grid) { return; }
    var status = document.getElementById('grid-status');
    var btns = bar.querySelectorAll('button');
    var cards = grid.querySelectorAll('.pcard');

    function apply(sector) {
      var shown = 0, i;
      for (i = 0; i < cards.length; i++) {
        var s = cards[i].getAttribute('data-sector') || '';
        var on = sector === 'all' || s === sector;
        cards[i].hidden = !on;
        if (on) { shown++; }
      }
      for (i = 0; i < btns.length; i++) {
        btns[i].setAttribute('aria-pressed',
          btns[i].getAttribute('data-sector') === sector ? 'true' : 'false');
      }
      if (status) {
        status.textContent = shown + t(' projeto(s) em exibicao.', ' project(s) shown.');
      }
    }

    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        apply(this.getAttribute('data-sector'));
      });
    }
    apply('all');
  }

  /* ---------- contact form ------------------------------------
     Composes an e-mail body the visitor can copy, or hands off to
     WhatsApp when a number is eventually confirmed. It never posts
     anywhere: there is no endpoint in a mockup, and pretending
     otherwise loses real enquiries.
     ----------------------------------------------------------- */
  function contactForm() {
    var form = document.getElementById('contato');
    if (!form) { return; }
    var status = document.getElementById('form-status');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var get = function (n) {
        var el = form.elements[n];
        return el && el.value ? el.value.trim() : '';
      };
      var nome = form.elements['nome'];
      var consent = form.elements['consent'];

      if (nome && !nome.value.trim()) {
        nome.setAttribute('aria-invalid', 'true');
        if (status) {
          status.textContent = t('Informe o seu nome.', 'Please enter your name.');
        }
        if (nome.focus) { nome.focus(); }
        return;
      }
      if (nome) { nome.removeAttribute('aria-invalid'); }

      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao de contato antes de enviar.',
                                 'Please tick the contact permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }

      if (status) {
        status.textContent = t(
          'MOCKUP: este formulario nao envia. Resumo do que seria enviado - ' +
            get('nome') + ' | ' + get('email') + ' | ' + get('whatsapp') + ' | ' +
            get('empresa') + ' | ' + get('tipo') + ' | ' + get('modalidade') + ' | ' +
            get('cidade') + '. No site publicado ele iria para contato@studioarchi.com.br.',
          'MOCKUP: this form does not send. Summary of what would be sent - ' +
            get('nome') + ' | ' + get('email') + ' | ' + get('whatsapp') + ' | ' +
            get('empresa') + ' | ' + get('tipo') + ' | ' + get('modalidade') + ' | ' +
            get('cidade') + '. On the live site it would go to contato@studioarchi.com.br.'
        );
      }
    });
  }

  /* ---------- LGPD granular consent ---------------------------
     Non-essential OFF by default. Reject is the same size and the
     same visual weight as accept. Nothing third-party is wired in
     this mockup - the consented branch is where it WOULD go, and
     it is deliberately left inert.
     ----------------------------------------------------------- */
  var STORE = 'sa_lgpd_v1';

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveConsent(obj) {
    try { window.localStorage.setItem(STORE, JSON.stringify(obj)); } catch (e) {}
  }

  function applyConsent(c) {
    if (c && c.analytics) {
      /* Analytics would be loaded here, and only here. Nothing in
         this mockup fires. Prefer a cookieless self-hosted tool. */
    }
    if (c && c.marketing) {
      /* Marketing pixels and any social embed would be loaded here. */
    }
  }

  function lgpd() {
    var bar = document.getElementById('lgpd');
    if (!bar) { return; }
    var prefs = document.getElementById('lgpd-prefs');
    var accept = document.getElementById('lgpd-accept');
    var reject = document.getElementById('lgpd-reject');
    var openp = document.getElementById('lgpd-open-prefs');
    var save = document.getElementById('lgpd-save');
    var ana = document.getElementById('ck-analytics');
    var mkt = document.getElementById('ck-marketing');

    function show() {
      bar.setAttribute('aria-hidden', 'false');
      bar.classList.add('show');
    }
    function hide() {
      bar.classList.remove('show');
      bar.setAttribute('aria-hidden', 'true');
    }
    function decide(c) { saveConsent(c); applyConsent(c); hide(); }

    var existing = readConsent();
    if (existing) { applyConsent(existing); } else { window.setTimeout(show, 700); }

    if (accept) {
      accept.addEventListener('click', function () {
        decide({ essential: true, analytics: true, marketing: true, at: Date.now() });
      });
    }
    if (reject) {
      reject.addEventListener('click', function () {
        decide({ essential: true, analytics: false, marketing: false, at: Date.now() });
      });
    }
    if (openp && prefs) {
      openp.addEventListener('click', function () {
        var open = prefs.hasAttribute('hidden');
        if (open) { prefs.removeAttribute('hidden'); } else { prefs.setAttribute('hidden', ''); }
        openp.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (save) {
      save.addEventListener('click', function () {
        decide({
          essential: true,
          analytics: !!(ana && ana.checked),
          marketing: !!(mkt && mkt.checked),
          at: Date.now()
        });
      });
    }
    var reopen = document.querySelectorAll('[data-lgpd-reopen]');
    for (var i = 0; i < reopen.length; i++) {
      reopen[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        var c = readConsent();
        if (ana) { ana.checked = !!(c && c.analytics); }
        if (mkt) { mkt.checked = !!(c && c.marketing); }
        if (prefs) { prefs.removeAttribute('hidden'); }
        if (openp) { openp.setAttribute('aria-expanded', 'true'); }
        show();
      });
    }
  }

  /* ---------- footer year -------------------------------------
     The current year only. There is deliberately no "since" year:
     the practice publishes no founding date anywhere.
     ----------------------------------------------------------- */
  function years() {
    var els = document.querySelectorAll('[data-year]');
    var y = String(new Date().getFullYear());
    for (var i = 0; i < els.length; i++) { els[i].textContent = y; }
  }

  ready(function () {
    wireContacts();
    header();
    menu();
    reveals();
    parallax();
    filters();
    contactForm();
    lgpd();
    years();
  });
}());

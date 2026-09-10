/* ===================================================================
   Studio Hall Arquitetura e Interiores - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). Runs off
   file:// so the prospect can double-click index.html.

   THE WHATSAPP NUMBER HERE IS REAL AND PUBLISHED.
   Studio Hall publishes +55 48 98422-3351 on their own site under an
   explicit "Contato - Whatsapp" label. So unlike most of this batch,
   the wa.me link resolves. It is still worth verifying it is current
   before launch, but it is not invented and it is not a placeholder.

   THREE CONSENT POINTS, NOT ONE.
   The contact form, the orcamento form and the e-book download each
   carry their own unticked checkbox and their own stated purpose.
   Reusing one consent across three different purposes is exactly what
   LGPD art. 8 does not allow.

   GOOGLE ADS TAGS ARE THE REAL EXPOSURE HERE.
   They run /lpgoogle, so conversion and remarketing tags are almost
   certainly firing today before any consent. In this mockup the
   marketing branch is deliberately inert - it is where those tags go,
   and nowhere else.
   =================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = '5548984223351';   /* published on their own site - verify still current */
  var TEL_DISPLAY = '+55 48 98422-3351';

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
  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    var i;
    for (i = 0; i < wa.length; i++) {
      var el = wa[i];
      var msg = el.getAttribute('data-wa') ||
        t('Ola! Vim pelo site da Studio Hall e gostaria de falar sobre um projeto.',
          'Hello! I came from the Studio Hall website and would like to discuss a project.');
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (i = 0; i < tels.length; i++) {
      tels[i].setAttribute('href', 'tel:+' + WA_NUMBER);
      if (!tels[i].textContent.trim()) { tels[i].textContent = TEL_DISPLAY; }
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

  /* ---------- reveals ----------------------------------------- */
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
        var el = e.target, idx = 0, sib = el.previousElementSibling;
        while (sib) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
          sib = sib.previousElementSibling;
        }
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
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
        img.style.transform = 'translate3d(0,' + (y * 0.15) + 'px,0) scale(1.06)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- project filter ---------------------------------- */
  function filters() {
    var bar = document.querySelector('.filters');
    var grid = document.querySelector('.pgrid');
    if (!bar || !grid) { return; }
    var status = document.getElementById('grid-status');
    var btns = bar.querySelectorAll('button');
    var cards = grid.querySelectorAll('.pcard');

    function apply(f) {
      var shown = 0, i;
      for (i = 0; i < cards.length; i++) {
        var on;
        if (f === 'all') { on = true; }
        else if (f === 'turnkey') { on = cards[i].getAttribute('data-turnkey') === 'yes'; }
        else { on = cards[i].getAttribute('data-typo') === f; }
        cards[i].hidden = !on;
        if (on) { shown++; }
      }
      for (i = 0; i < btns.length; i++) {
        btns[i].setAttribute('aria-pressed',
          btns[i].getAttribute('data-filter') === f ? 'true' : 'false');
      }
      if (status) {
        status.textContent = shown + t(' projeto(s) em exibicao.', ' project(s) shown.');
      }
    }

    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        apply(this.getAttribute('data-filter'));
      });
    }
    apply('all');
  }

  /* ---------- VR facade ---------------------------------------
     A click-to-load facade with NOTHING behind it, on purpose.
     Studio Hall runs a /tour-virtual page that has no tour on it,
     and mocking up a fake walkthrough and presenting it as theirs
     would be worse than the empty page. The button explains what
     it is waiting for.
     ----------------------------------------------------------- */
  function vr() {
    var btns = document.querySelectorAll('[data-vr]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var box = this.closest ? this.closest('.vr') : null;
        var out = box && box.parentNode ?
          box.parentNode.querySelector('.vr-status') : null;
        var msg = t(
          'MOCKUP: nenhum tour foi incorporado, deliberadamente. A pagina /tour-virtual da Studio Hall existe e nao tem tour nenhum nela, e simular um passeio falso e apresenta-lo como deles seria pior do que a pagina vazia. [CONFIRM qual plataforma hospeda os tours, se algum e publicamente compartilhavel, se roda no navegador ou exige headset, e quais sao os termos de licenca do ativo 360.]',
          'MOCKUP: no tour is embedded, deliberately. Studio Hall\u0027s /tour-virtual page exists and has no tour on it, and faking a walkthrough and presenting it as theirs would be worse than the empty page. [CONFIRM which platform hosts the tours, whether any is publicly shareable, whether it runs in-browser or needs a headset, and the licence terms of the 360 asset.]'
        );
        if (out) { out.textContent = msg; } else { window.alert(msg); }
      });
    }
  }

  /* ---------- forms -------------------------------------------
     Three separate forms, three separate consents. None of them
     posts anywhere: there is no endpoint in a mockup, and
     pretending otherwise loses real enquiries.
     ----------------------------------------------------------- */
  function forms() {
    var all = document.querySelectorAll('form[data-form]');
    for (var i = 0; i < all.length; i++) {
      all[i].addEventListener('submit', handle);
    }
  }

  function handle(ev) {
    ev.preventDefault();
    var form = ev.currentTarget;
    var kind = form.getAttribute('data-form');
    var status = form.querySelector('.form-status');
    var get = function (n) {
      var el = form.elements[n];
      return el && el.value ? el.value.trim() : '';
    };
    var nome = form.elements['nome'];
    var consent = form.elements['consent'];

    if (nome && !nome.value.trim()) {
      nome.setAttribute('aria-invalid', 'true');
      if (status) { status.textContent = t('Informe o seu nome.', 'Please enter your name.'); }
      if (nome.focus) { nome.focus(); }
      return;
    }
    if (nome) { nome.removeAttribute('aria-invalid'); }

    if (consent && !consent.checked) {
      if (status) {
        status.textContent = t('Marque a autorizacao antes de enviar.',
                               'Please tick the permission before sending.');
      }
      if (consent.focus) { consent.focus(); }
      return;
    }

    if (kind === 'ebook') {
      if (status) {
        status.textContent = t(
          'MOCKUP: o e-book nao e entregue aqui. [CONFIRM o titulo do e-book, o que ha dentro dele, e para onde o cadastro vai.] O consentimento deste formulario e separado do consentimento do formulario de contato, como exige a LGPD.',
          'MOCKUP: the e-book is not delivered here. [CONFIRM the e-book title, what is inside it, and where the sign-up goes.] This form\u0027s consent is separate from the contact form\u0027s, as the LGPD requires.'
        );
      }
      return;
    }

    /* Contact and orcamento hand off to WhatsApp, which is what this
       studio's buyers actually use - the form is the fallback. */
    var msg = t(
      'Ola! Vim pelo site da Studio Hall. Nome: ' + (get('nome') || '[nome]') +
        '. Cidade/bairro: ' + (get('cidade') || '[cidade]') +
        '. Tipo de projeto: ' + (get('tipo') || '[tipo]') +
        '. Imovel: ' + (get('imovel') || '[imovel]') + '. ' + get('mensagem'),
      'Hello! I came from the Studio Hall website. Name: ' + (get('nome') || '[name]') +
        '. City/area: ' + (get('cidade') || '[city]') +
        '. Project type: ' + (get('tipo') || '[type]') +
        '. Property: ' + (get('imovel') || '[property]') + '. ' + get('mensagem')
    );
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    if (status) {
      status.textContent = t('Abrindo o WhatsApp com o resumo do seu pedido...',
                             'Opening WhatsApp with a summary of your enquiry...');
    }
    window.open(url, '_blank', 'noopener');
  }

  /* ---------- LGPD -------------------------------------------- */
  var STORE = 'sh_lgpd_v1';

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
      /* Analytics would load here and only here. Nothing fires in
         this mockup. Prefer a cookieless self-hosted tool. */
    }
    if (c && c.marketing) {
      /* THIS is where the Google Ads conversion and remarketing tags
         belong - gated, never on page load. Consider consent mode or
         server-side tagging so campaign measurement survives the gate
         instead of collapsing when someone rejects. Inert here. */
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

    function show() { bar.setAttribute('aria-hidden', 'false'); bar.classList.add('show'); }
    function hide() { bar.classList.remove('show'); bar.setAttribute('aria-hidden', 'true'); }
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

  /* ---------- footer year --------------------------------------
     Current year only. 2018 appears on their site as the year
     Francini Portella began practising - which is not the same fact
     as a studio founding date, so nothing counts up from it.
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
    vr();
    forms();
    lgpd();
    years();
  });
}());

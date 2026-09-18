/* ===================================================================
   The 4am Culture - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). Runs off
   file:// so the prospect can double-click index.html.

   THE CONSULTANT WHATSAPP NUMBER IS BROKEN AND IS NOT DIALLED HERE.
   Their site publishes api.whatsapp.com/send?phone=554891977084 for
   the online sales consultants. That is 55 + 48 + EIGHT digits, and a
   Brazilian mobile needs nine. It cannot connect. The two store
   numbers on the same page are correctly formed, so this is a typo in
   the primary online-sales channel - and it is the single most
   concrete thing in the whole pitch.

   So: the two store numbers resolve. The consultant number does NOT,
   and clicking it explains why rather than opening a dead chat.

   NO PRICE IS COMPUTED, DISCOUNTED OR ANIMATED HERE.
   Only the six prices The 4am Culture actually publishes appear
   anywhere in this build, written into the markup as plain text.
   No JavaScript touches a price.
   =================================================================== */
(function () {
  'use strict';

  /* Correctly formed - published and verified on their own site */
  var WA_FLORIPA = '5548991651053';   /* (48) 99165-1053 */
  var WA_POA     = '5551980648406';   /* (51) 98064-8406 */
  /* Published as 554891977084 - one digit short. Deliberately null. */
  var WA_CONSULT = null;

  var LANG = document.documentElement.lang.toLowerCase();
  var ES = LANG.indexOf('es') === 0;
  var EN = LANG.indexOf('en') === 0;
  function t(pt, en, es) {
    if (ES) { return es !== undefined ? es : en; }
    return EN ? en : pt;
  }

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
  function badConsultNumber() {
    window.alert(t(
      'MOCKUP: o numero das consultoras online publicado no site e 55 48 9197-7084 - oito digitos depois do DDD, onde um celular brasileiro precisa de nove. Ele nao conecta. Os dois numeros das lojas, na mesma pagina, estao corretos. Nenhum digito foi chutado aqui para consertar o numero. [CONFIRM o numero correto.] Enquanto isso, fale com a loja de Florianopolis ou de Porto Alegre.',
      'MOCKUP: the online consultant number published on the site is 55 48 9197-7084 - eight digits after the area code, where a Brazilian mobile needs nine. It cannot connect. The two store numbers on the same page are correct. No digit has been guessed here to fix it. [CONFIRM the correct number.] In the meantime, message the Florianopolis or Porto Alegre store.',
      'MOCKUP: el numero de las asesoras online publicado en el sitio es 55 48 9197-7084 - ocho digitos despues del prefijo, cuando un movil brasileno necesita nueve. No conecta. Los dos numeros de las tiendas, en la misma pagina, son correctos. No se ha inventado ningun digito para arreglarlo. [CONFIRM el numero correcto.] Mientras tanto, escribe a la tienda de Florianopolis o de Porto Alegre.'
    ));
  }

  function wireContacts() {
    var els = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var which = el.getAttribute('data-wa');
      var num = which === 'poa' ? WA_POA : (which === 'floripa' ? WA_FLORIPA : WA_CONSULT);
      var msg = el.getAttribute('data-msg') ||
        t('Ola! Vim pelo site da 4am e queria uma ajuda com tamanho.',
          'Hi! I came from the 4am site and I need help with sizing.',
          'Hola! Vengo del sitio de 4am y necesito ayuda con la talla.');
      if (num) {
        el.setAttribute('href', 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        el.setAttribute('href', '#');
        el.setAttribute('data-unconfirmed', '');
        el.setAttribute('aria-describedby', 'wa-broken-note');
        el.addEventListener('click', function (ev) { ev.preventDefault(); badConsultNumber(); });
      }
    }
  }

  /* ---------- sticky header ----------------------------------- */
  function header() {
    var head = document.querySelector('.site-head');
    if (!head) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 24) { head.classList.add('solid'); } else { head.classList.remove('solid'); }
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

  /* ---------- the night-to-dawn scroll shift ------------------
     Capped at t=0.50 on purpose. Measured across the full
     #161C2A -> #E8A15C interpolation, bone text drops below 4.5:1
     at t=0.552 and 4am black does not reach 4.5:1 until t=0.636 -
     an 8.4-point band where NEITHER colour passes AA, whichever way
     the text is switched. So the gradient behind text stops at
     t=0.50 (#7F5E43, bone 5.07:1) and the full amber only appears
     on surfaces that carry no text, or that carry black at 8.96:1.

     prefers-reduced-motion freezes it at the mid-point, which is
     also a measured-safe stop.
     ----------------------------------------------------------- */
  var CAP = 0.5;

  function mix(a, b, t) {
    var out = '#';
    for (var i = 0; i < 3; i++) {
      var av = parseInt(a.substr(1 + i * 2, 2), 16);
      var bv = parseInt(b.substr(1 + i * 2, 2), 16);
      var v = Math.round(av * (1 - t) + bv * t);
      out += (v < 16 ? '0' : '') + v.toString(16);
    }
    return out;
  }

  function dawn() {
    var els = document.querySelectorAll('[data-dawn]');
    if (!els.length) { return; }
    var NIGHT = '#161c2a', FIRST = '#e8a15c';
    if (reduced) {
      var frozen = mix(NIGHT, FIRST, CAP * 0.5);
      for (var f = 0; f < els.length; f++) { els[f].style.backgroundColor = frozen; }
      return;
    }
    var ticking = false;
    function apply() {
      var doc = document.documentElement;
      var max = (doc.scrollHeight - window.innerHeight) || 1;
      var p = Math.min(Math.max((window.pageYOffset || doc.scrollTop) / max, 0), 1);
      var c = mix(NIGHT, FIRST, p * CAP);
      for (var i = 0; i < els.length; i++) { els[i].style.backgroundColor = c; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    window.addEventListener('resize', apply);
    apply();
  }

  /* ---------- product filters ---------------------------------
     Keyboard-operable: real buttons in normal tab order, aria-pressed
     carries the state, and the result count is announced through a
     live region. Out-of-stock sizes are marked in text and struck
     through, never merely greyed.
     ----------------------------------------------------------- */
  function filters() {
    var bar = document.querySelector('.filters');
    var grid = document.querySelector('.pgrid');
    if (!bar || !grid) { return; }
    var status = document.getElementById('grid-status');
    var btns = bar.querySelectorAll('button');
    var cards = grid.querySelectorAll('.prod');

    function apply(kind, val) {
      var shown = 0, i;
      for (i = 0; i < cards.length; i++) {
        var on = val === 'all' || cards[i].getAttribute('data-' + kind) === val;
        cards[i].hidden = !on;
        if (on) { shown++; }
      }
      for (i = 0; i < btns.length; i++) {
        var bk = btns[i].getAttribute('data-kind');
        var bv = btns[i].getAttribute('data-val');
        btns[i].setAttribute('aria-pressed',
          (bk === kind && bv === val) ? 'true' : 'false');
      }
      if (status) {
        status.textContent = shown + t(' peca(s) em exibicao.', ' item(s) shown.',
                                       ' prenda(s) en exhibicion.');
      }
    }

    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        apply(this.getAttribute('data-kind'), this.getAttribute('data-val'));
      });
    }
    bar.addEventListener('keydown', function (ev) {
      var list = Array.prototype.slice.call(btns);
      var at = list.indexOf(document.activeElement);
      if (at < 0) { return; }
      var to = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { to = (at + 1) % list.length; }
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
        to = (at - 1 + list.length) % list.length;
      } else if (ev.key === 'Home') { to = 0; }
      else if (ev.key === 'End') { to = list.length - 1; }
      if (to >= 0) { ev.preventDefault(); list[to].focus(); }
    });
    apply('line', 'all');
  }

  /* ---------- the country-selector demonstration --------------
     This is the pitch, made operable. Their live Shopify selector
     lists roughly forty countries and serves every one of them the
     same Portuguese page priced in BRL. Picking any country here
     reports exactly that, truthfully - no fake localisation, because
     the whole point is that none exists yet.
     ----------------------------------------------------------- */
  function geo() {
    var sel = document.getElementById('geo-country');
    var out = document.getElementById('geo-out');
    if (!sel || !out) { return; }
    function apply() {
      var name = sel.options[sel.selectedIndex].text;
      var isBR = sel.value === 'BR';
      if (isBR) {
        out.innerHTML = t(
          '<b>' + name + '</b> &rarr; pagina em portugues, precos em R$. Correto: e o mercado de origem.',
          '<b>' + name + '</b> &rarr; Portuguese page, prices in R$. Correct: this is the home market.',
          '<b>' + name + '</b> &rarr; pagina en portugues, precios en R$. Correcto: es el mercado de origen.'
        );
      } else {
        out.innerHTML = t(
          'Hoje, no site atual: <b>' + name + '</b> &rarr; a mesma pagina em <b>portugues</b>, com precos em <b>R$</b>. Nenhuma traducao, nenhuma moeda local, nenhum prazo de entrega internacional, nenhuma informacao sobre impostos de importacao. O seletor ja existe; a localizacao atras dele nao.',
          'Today, on the live site: <b>' + name + '</b> &rarr; the same page in <b>Portuguese</b>, priced in <b>R$</b>. No translation, no local currency, no international delivery estimate, no import-duty information. The selector already exists; the localisation behind it does not.',
          'Hoy, en el sitio actual: <b>' + name + '</b> &rarr; la misma pagina en <b>portugues</b>, con precios en <b>R$</b>. Sin traduccion, sin moneda local, sin plazo de entrega internacional, sin informacion sobre impuestos de importacion. El selector ya existe; la localizacion detras de el, no.'
        );
      }
    }
    sel.addEventListener('change', apply);
    apply();
  }

  /* ---------- newsletter --------------------------------------
     Its own consent, separate and separable from checkout. Under
     LGPD art. 8 a marketing opt-in cannot ride along with a
     transaction, and it is never pre-ticked.
     ----------------------------------------------------------- */
  function newsletter() {
    var form = document.getElementById('news');
    if (!form) { return; }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = form.elements['email'];
      var consent = form.elements['consent'];
      if (email && !email.value.trim()) {
        email.setAttribute('aria-invalid', 'true');
        if (status) {
          status.textContent = t('Informe um e-mail.', 'Please enter an email address.',
                                 'Introduce un correo electronico.');
        }
        if (email.focus) { email.focus(); }
        return;
      }
      if (email) { email.removeAttribute('aria-invalid'); }
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao antes de enviar.',
                                 'Please tick the permission before sending.',
                                 'Marca la autorizacion antes de enviar.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      if (status) {
        status.textContent = t(
          'MOCKUP: nada foi enviado. No site publicado este consentimento fica separado do checkout, com finalidade propria, e pode ser revogado a qualquer momento.',
          'MOCKUP: nothing was sent. On the published site this consent stays separate from checkout, with its own stated purpose, and can be withdrawn at any time.',
          'MOCKUP: no se envio nada. En el sitio publicado este consentimiento se mantiene separado del checkout, con su propia finalidad, y puede revocarse en cualquier momento.'
        );
      }
    });
  }

  /* ---------- LGPD -------------------------------------------- */
  var STORE = 'a4am_lgpd_v1';

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
         this mockup. On the real store this is the gate for whatever
         sits behind Shopify's own analytics stack. [CONFIRM the list.] */
    }
    if (c && c.marketing) {
      /* Remarketing pixels and any social embed would load here.
         [CONFIRM which pixels are live today.] */
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
    dawn();
    filters();
    geo();
    newsletter();
    lgpd();
    years();
  });
}());

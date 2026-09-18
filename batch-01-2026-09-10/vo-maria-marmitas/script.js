/* ===================================================================
   Vo Maria Marmitas - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). Runs off
   file:// so the prospect can double-click index.html.

   INSTAGRAM-ONLY LEAD, AND NOTHING IS VERIFIED.
   Their profile returns HTTP 200 behind a login wall with no readable
   metadata. There is no website, no published menu, no price, no plan
   tier, no cutoff time, no delivery area, no phone number.

   TWO THINGS ARE THEREFORE DELIBERATELY NOT COMPUTED:

   1. THE CUTOFF COUNTDOWN. The brief asks for a live countdown in
      America/Sao_Paulo. The engine is written and correct - it will
      run the moment a real cutoff is supplied - but it is NOT
      pointed at a guessed day and time. A countdown ticking toward a
      deadline nobody set is the most confident lie a food site can
      tell, and it is the one a customer acts on.

   2. THE PLAN PRICE. The selector composes a complete WhatsApp order
      with every choice in it, but it never multiplies anything into a
      per-meal or per-week figure, because no price exists to
      multiply. Every price slot stays a visible R$ [CONFIRM].

   And no wa.me link is built: no number was found at all.
   =================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = null;   /* [CONFIRM] - no number published anywhere */

  /* When a real cutoff arrives, set these two and the countdown runs.
     CUTOFF_DOW: 0=Sunday .. 6=Saturday. CUTOFF_HOUR: 0-23, in
     America/Sao_Paulo, NOT in the visitor's timezone. */
  var CUTOFF_DOW = null;   /* [CONFIRM] */
  var CUTOFF_HOUR = null;  /* [CONFIRM] */

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
  function noNumber() {
    window.alert(t(
      'MOCKUP: este lead e so Instagram e nenhum telefone ou WhatsApp foi encontrado - o perfil @vomariadelivery_ esta atras de um login. Nenhum wa.me e montado ate o numero ser confirmado por escrito. [CONFIRM o WhatsApp de pedidos.]',
      'MOCKUP: this lead is Instagram-only and no phone or WhatsApp was found - the @vomariadelivery_ profile sits behind a login wall. No wa.me link is built until the number is confirmed in writing. [CONFIRM the ordering WhatsApp.]'
    ));
  }

  function wireContacts() {
    var els = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (WA_NUMBER) {
        var msg = el.getAttribute('data-wa') ||
          t('Ola! Vim pelo site da Vo Maria.', 'Hi! I came from the Vo Maria website.');
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.removeAttribute('data-unconfirmed');
      } else {
        el.setAttribute('href', '#');
        el.setAttribute('data-unconfirmed', '');
        el.setAttribute('aria-describedby', 'wa-unconfirmed-note');
        el.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
      }
    }
  }

  /* ---------- the cutoff -------------------------------------
     The engine is here and it is correct. It is simply not pointed
     at a guessed deadline. Sao Paulo is UTC-3 with no DST since
     2019, so the offset is fixed - which is exactly why this has to
     be computed from UTC rather than from the visitor's clock.
     ----------------------------------------------------------- */
  function saoPauloNow() {
    var now = new Date();
    return new Date(now.getTime() + (now.getTimezoneOffset() - 180) * 60000);
  }

  function nextCutoff() {
    if (CUTOFF_DOW === null || CUTOFF_HOUR === null) { return null; }
    var sp = saoPauloNow();
    var target = new Date(sp);
    target.setHours(CUTOFF_HOUR, 0, 0, 0);
    var delta = (CUTOFF_DOW - sp.getDay() + 7) % 7;
    if (delta === 0 && sp.getTime() >= target.getTime()) { delta = 7; }
    target.setDate(target.getDate() + delta);
    return target;
  }

  function cutoff() {
    var els = document.querySelectorAll('[data-cutoff]');
    if (!els.length) { return; }
    var target = nextCutoff();
    if (!target) {
      for (var i = 0; i < els.length; i++) {
        els[i].innerHTML = t(
          '<span class="dot" aria-hidden="true"></span>Hor&aacute;rio de corte '
          + '<span class="cfm">[CONFIRM]</span>',
          '<span class="dot" aria-hidden="true"></span>Order cutoff '
          + '<span class="cfm">[CONFIRM]</span>'
        );
        els[i].setAttribute('title', t(
          'Nenhum horario de corte foi publicado, entao nenhuma contagem regressiva e calculada aqui.',
          'No cutoff time is published, so no countdown is computed here.'
        ));
      }
      return;
    }
    function tick() {
      var ms = target.getTime() - saoPauloNow().getTime();
      if (ms < 0) { target = nextCutoff(); ms = target.getTime() - saoPauloNow().getTime(); }
      var h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
      for (var j = 0; j < els.length; j++) {
        els[j].innerHTML = '<span class="dot" aria-hidden="true"></span>' +
          t('Pedidos at&eacute; ', 'Orders close in ') + h + 'h ' + m + 'min';
      }
    }
    tick();
    if (!reduced) { window.setInterval(tick, 60000); }
  }

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

  /* ---------- the plan selector -------------------------------
     Composes a complete, formatted WhatsApp order with every
     selection in it. It never submits, never charges, and never
     multiplies anything into a price - because no price exists.
     Each axis is a keyboard-operable group with aria-pressed state
     and a live-region summary.
     ----------------------------------------------------------- */
  function selector() {
    var panel = document.getElementById('plan-selector');
    if (!panel) { return; }
    var out = document.getElementById('plan-summary');
    var groups = panel.querySelectorAll('.opts');
    var choice = {};

    function label(g) {
      var b = g.querySelector('button[aria-pressed="true"]');
      return b ? b.textContent.trim() : '';
    }

    function refresh() {
      var parts = [];
      for (var i = 0; i < groups.length; i++) {
        var axis = groups[i].getAttribute('data-axis');
        choice[axis] = label(groups[i]);
        if (choice[axis]) { parts.push(axis + ': ' + choice[axis]); }
      }
      if (out) {
        out.textContent = parts.join(' \u00b7 ') ||
          t('Escolha as op&ccedil;&otilde;es acima.', 'Choose the options above.')
            .replace(/&ccedil;/g, 'c').replace(/&atilde;/g, 'a').replace(/&otilde;/g, 'o');
      }
    }

    for (var g = 0; g < groups.length; g++) {
      (function (grp) {
        var btns = grp.querySelectorAll('button');
        for (var b = 0; b < btns.length; b++) {
          btns[b].addEventListener('click', function () {
            for (var k = 0; k < btns.length; k++) {
              btns[k].setAttribute('aria-pressed', btns[k] === this ? 'true' : 'false');
            }
            refresh();
          });
        }
        grp.addEventListener('keydown', function (ev) {
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
      }(groups[g]));
    }

    var send = document.getElementById('plan-send');
    if (send) {
      send.addEventListener('click', function (ev) {
        ev.preventDefault();
        refresh();
        var lines = [];
        for (var k in choice) {
          if (choice.hasOwnProperty(k) && choice[k]) { lines.push(k + ': ' + choice[k]); }
        }
        var msg = t('Ola! Quero assinar um plano da Vo Maria.\n',
                    'Hi! I would like to subscribe to a Vo Maria plan.\n') +
                  lines.join('\n') +
                  t('\nValor: [CONFIRM]\nEndereco de entrega: ',
                    '\nPrice: [CONFIRM]\nDelivery address: ');
        if (!WA_NUMBER) { noNumber(); return; }
        window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg),
                    '_blank', 'noopener');
      });
    }
    refresh();
  }

  /* ---------- the CEP check -----------------------------------
     A hard qualifier: someone outside the zone should find out in
     five seconds, not after filling in a form. Until a real radius
     is confirmed it composes a WhatsApp question rather than
     pretending to know the answer.
     ----------------------------------------------------------- */
  function cepCheck() {
    var form = document.getElementById('cep-check');
    if (!form) { return; }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var cep = form.elements['cep'];
      var v = cep && cep.value ? cep.value.trim() : '';
      if (!v) {
        if (cep) { cep.setAttribute('aria-invalid', 'true'); if (cep.focus) { cep.focus(); } }
        if (status) {
          status.textContent = t('Informe o CEP ou o bairro.',
                                 'Please enter a postcode or neighbourhood.');
        }
        return;
      }
      if (cep) { cep.removeAttribute('aria-invalid'); }
      if (status) {
        status.textContent = t(
          'MOCKUP: a area de entrega ainda nao foi confirmada, entao nada e verificado aqui. No site publicado isto abriria o WhatsApp perguntando por ' + v + '.',
          'MOCKUP: the delivery area has not been confirmed, so nothing is checked here. On the published site this would open WhatsApp asking about ' + v + '.'
        );
      }
    });
  }

  function menuList() {
    var form = document.getElementById('menu-list');
    if (!form) { return; }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var who = form.elements['contato'];
      var consent = form.elements['consent'];
      if (who && !who.value.trim()) {
        who.setAttribute('aria-invalid', 'true');
        if (status) {
          status.textContent = t('Informe um WhatsApp ou e-mail.',
                                 'Please enter a WhatsApp number or email.');
        }
        if (who.focus) { who.focus(); }
        return;
      }
      if (who) { who.removeAttribute('aria-invalid'); }
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao antes de enviar.',
                                 'Please tick the permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      if (status) {
        status.textContent = t(
          'MOCKUP: nada foi enviado. No site publicado este consentimento e so para o cardapio da semana, separado de qualquer pedido, e sai da lista com uma palavra.',
          'MOCKUP: nothing was sent. On the published site this consent covers the weekly menu alone, separate from any order, and one word takes you off the list.'
        );
      }
    });
  }

  function corporate() {
    var form = document.getElementById('empresas');
    if (!form) { return; }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
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
      if (status) {
        status.textContent = t(
          'MOCKUP: este formulario nao envia. No site publicado ele iria para o canal de contas corporativas, separado do pedido individual - um gestor de escritorio pedindo vinte marmitas por semana nao faz isso por DM.',
          'MOCKUP: this form does not send. On the published site it would go to the corporate-accounts channel, separate from individual orders - an office manager ordering twenty meals a week will not do that by DM.'
        );
      }
    });
  }

  /* ---------- LGPD --------------------------------------------
     This service holds recurring customer addresses and delivery
     schedules, and dietary and allergy information is sensitive
     personal data under art. 5, II. The policy says both.
     ----------------------------------------------------------- */
  var STORE = 'vomaria_lgpd_v1';

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
    if (c && c.analytics) { /* Analytics would load here only. Inert. */ }
    if (c && c.marketing) { /* Pixels and any Instagram embed here only. Inert. */ }
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
    cutoff();
    header();
    menu();
    reveals();
    selector();
    cepCheck();
    menuList();
    corporate();
    lgpd();
    years();
  });
}());

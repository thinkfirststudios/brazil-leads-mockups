/* ===========================================================================
   KOMPAAN PADARIA ARTESANAL — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================================
     1. THE BAKE SCHEDULE — the one thing Kompaan will edit themselves.

     Everything about the calendar comes out of this single object. Nothing
     below reads a name, a time or a state from the markup, so the schedule can
     be changed here without touching a line of HTML.

     dow: 0 = Sunday … 6 = Saturday (matching JavaScript's getDay()).
     state: 'ok'  = baked and sold on the shelf that day
            'pre' = pre-order only
            'out' = sold out (set by hand, or wired to their till later)

     EVERY VALUE HERE IS A PLACEHOLDER. Kompaan is Instagram-only behind a
     login wall: we do not know which breads they bake, on which days, at what
     time, or whether they sell out. No loaf name, flour, weight, hydration,
     fermentation time or price is invented anywhere in this file.
     [CONFIRM the entire schedule — this is the spine of the build.]
     ====================================================================== */
  var SCHEDULE = [
    { dow: 1, items: [] },                                                   // [CONFIRM] segunda — bake day?
    { dow: 2, items: [ {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'ok'},
                       {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'pre'} ] },
    { dow: 3, items: [ {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'ok'} ] },
    { dow: 4, items: [ {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'ok'},
                       {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'out'} ] },
    { dow: 5, items: [ {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'ok'},
                       {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'pre'} ] },
    { dow: 6, items: [ {name: '[CONFIRM pão]', time: '[CONFIRM]', state: 'ok'} ] },
    { dow: 0, items: [] }                                                    // [CONFIRM] domingo — closed?
  ];

  var DOW_PT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  var DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  var STATE_PT = { ok: 'Disponível', pre: 'Só por encomenda', out: 'Esgotado' };
  var STATE_EN = { ok: 'On the shelf', pre: 'Pre-order only', out: 'Sold out' };

  var CLOSED_PT = 'Sem fornada <span class="cfm">[CONFIRM]</span>';
  var CLOSED_EN = 'No bake <span class="cfm">[CONFIRM]</span>';

  /* -----------------------------------------------------------------------
     "Today" must be Kompaan's today, in America/Sao_Paulo, not the visitor's.
     A customer reading this from Lisbon or Amsterdam at 23:00 must not be
     shown tomorrow's bread. Intl gives us the real thing; the fallback is a
     fixed UTC-3 offset, which is correct for Brazil year-round since the
     country abolished daylight saving in 2019.
     -------------------------------------------------------------------- */
  function saoPauloNow() {
    var now = new Date();
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(now);
      var v = {};
      for (var i = 0; i < parts.length; i++) v[parts[i].type] = parts[i].value;
      return new Date(Number(v.year), Number(v.month) - 1, Number(v.day),
                      Number(v.hour === '24' ? 0 : v.hour), Number(v.minute));
    } catch (err) {
      return new Date(now.getTime() + (now.getTimezoneOffset() - 180) * 60000);
    }
  }

  function dd(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(d) { return dd(d.getDate()) + '/' + dd(d.getMonth() + 1); }   // DD/MM, always

  function buildCalendar() {
    var host = document.querySelector('.cal');
    if (!host) return;

    var today = saoPauloNow();
    var dows = EN ? DOW_EN : DOW_PT;
    var states = EN ? STATE_EN : STATE_PT;
    var closed = EN ? CLOSED_EN : CLOSED_PT;
    var todayIdx = -1;
    var html = '';

    /* seven consecutive days starting today, so the strip always opens on the
       day the customer is actually standing in */
    for (var i = 0; i < 7; i++) {
      var d = new Date(today.getTime());
      d.setDate(today.getDate() + i);
      var dow = d.getDay();
      var row = null;
      for (var j = 0; j < SCHEDULE.length; j++) if (SCHEDULE[j].dow === dow) row = SCHEDULE[j];
      var items = (row && row.items) || [];
      var isToday = i === 0;
      if (isToday) todayIdx = i;

      var li = '';
      if (!items.length) {
        li = '<li>' + closed + '</li>';
      } else {
        for (var k = 0; k < items.length; k++) {
          var it = items[k];
          li += '<li><b><span class="cfm">' + it.name + '</span></b>'
              + '<span class="cal__time">' + (EN ? 'Out of the oven ' : 'Sai do forno ')
              + '<span class="cfm">' + it.time + '</span></span><br>'
              + '<span class="state state--' + it.state + '">' + states[it.state] + '</span></li>';
        }
      }

      html += '<div class="cal__day' + (isToday ? ' is-today is-open' : '') + '" data-i="' + i + '">'
            + '<button class="cal__head" type="button" aria-expanded="' + (isToday ? 'true' : 'false') + '">'
            + '<span class="cal__dow">' + dows[dow] + '</span>'
            + '<span class="cal__date">' + fmtDate(d) + '</span>'
            + '</button>'
            + '<ul class="cal__items">' + li + '</ul>'
            + '</div>';
    }
    host.innerHTML = html;

    /* mobile accordion — the calendar ships expanded above 900px purely in CSS,
       so this only governs the collapsed phone layout */
    host.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.cal__head') : null;
      if (!btn) return;
      var day = btn.parentNode;
      var open = day.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });

    /* the topbar status line, computed from the same object */
    var status = document.querySelector('[data-today]');
    if (status) {
      var trow = null;
      for (var m = 0; m < SCHEDULE.length; m++) if (SCHEDULE[m].dow === today.getDay()) trow = SCHEDULE[m];
      var names = (trow && trow.items || []).map(function (x) { return x.name; });
      status.innerHTML = names.length
        ? (EN ? 'Baking today: ' : 'Hoje assamos: ') + '<span class="cfm">' + names.join(' · ') + '</span>'
        : (EN ? 'No bake today ' : 'Hoje não há fornada ') + '<span class="cfm">[CONFIRM]</span>';
    }
    var dateOut = document.querySelector('[data-date]');
    if (dateOut) dateOut.textContent = fmtDate(today);
  }

  /* =========================================================================
     2. CONTACT — no number exists, so none is invented.
     Kompaan publishes no phone, no WhatsApp and no e-mail anywhere we can
     reach. Set WA_NUMBER to the confirmed line in international format
     ('5548999999999') and every WhatsApp path on the site switches on.
     ====================================================================== */
  var WA_NUMBER = null;   // [CONFIRM WhatsApp — required for the pre-order flow]

  var WA_UNSET = EN
    ? 'No WhatsApp number, phone number or e-mail address is published for Kompaan. '
      + 'Their Instagram profile (@kompaan_) sits behind a login wall and serves no readable '
      + 'contact details at all.\n\nThis mockup will not invent one. The pre-order flow below is '
      + 'fully built and starts working the moment a real number is supplied.'
    : 'Nenhum número de WhatsApp, telefone ou e-mail está publicado para a Kompaan. O perfil no '
      + 'Instagram (@kompaan_) fica atrás de login e não entrega nenhum dado de contato legível.\n\n'
      + 'Este mockup não vai inventar um. O fluxo de encomenda abaixo está pronto e começa a '
      + 'funcionar no instante em que um número real for informado.';

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function defaultText() {
    return EN
      ? 'Hello! I came from the Kompaan website and I would like to ask about today’s bread.'
      : 'Olá! Vim pelo site da Kompaan e gostaria de saber sobre o pão de hoje.';
  }

  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        if (WA_NUMBER) {
          el.removeAttribute('data-unconfirmed');
          if (el.tagName === 'A') { el.href = waHref(defaultText()); el.target = '_blank'; el.rel = 'noopener'; }
          else { el.addEventListener('click', function () { window.open(waHref(defaultText()), '_blank', 'noopener'); }); }
        } else {
          el.setAttribute('data-unconfirmed', '');
          if (el.tagName === 'A') { el.removeAttribute('href'); el.setAttribute('role', 'button'); el.tabIndex = 0; }
          el.addEventListener('click', function (e) { e.preventDefault(); window.alert(WA_UNSET); });
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.alert(WA_UNSET); }
          });
        }
      })(nodes[i]);
    }
  }

  /* ------------------------------------------------------- pre-order form
     Composes a WhatsApp message. It never submits anywhere on its own, and it
     never pretends an order is confirmed — a bakery confirms by replying.   */
  function preorder() {
    var f = document.querySelector('#form-encomenda');
    if (!f) return;

    var dateField = f.querySelector('#pedido-data');
    if (dateField) {
      /* pickup cannot be in the past; the upper bound is a week out because
         that is as far as the published schedule reaches */
      var t = saoPauloNow();
      dateField.min = t.getFullYear() + '-' + dd(t.getMonth() + 1) + '-' + dd(t.getDate());
      var max = new Date(t.getTime()); max.setDate(t.getDate() + 7);
      dateField.max = max.getFullYear() + '-' + dd(max.getMonth() + 1) + '-' + dd(max.getDate());
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('#consent-enc');
      if (ok && !ok.checked) {
        window.alert(EN ? 'Please tick the consent box so we can reply about your order.'
                        : 'Marque a caixa de consentimento para podermos responder sobre o seu pedido.');
        return;
      }
      var item = f.querySelector('#pedido-item');
      var qty  = f.querySelector('#pedido-qtd');
      var dat  = f.querySelector('#pedido-data');
      var nome = f.querySelector('#pedido-nome');
      var obs  = f.querySelector('#pedido-obs');

      var when = '';
      if (dat && dat.value) {
        var p = dat.value.split('-');
        when = p[2] + '/' + p[1];                       // DD/MM, never MM/DD
      }

      var msg = EN
        ? 'Hello Kompaan! I would like to pre-order:\n'
          + '• Item: ' + (item ? item.value : '') + '\n'
          + '• Quantity: ' + (qty ? qty.value : '') + '\n'
          + '• Pickup: ' + when + '\n'
          + '• Name: ' + (nome ? nome.value : '') + '\n'
          + (obs && obs.value ? '• Notes: ' + obs.value + '\n' : '')
        : 'Olá, Kompaan! Gostaria de encomendar:\n'
          + '• Item: ' + (item ? item.value : '') + '\n'
          + '• Quantidade: ' + (qty ? qty.value : '') + '\n'
          + '• Retirada: ' + when + '\n'
          + '• Nome: ' + (nome ? nome.value : '') + '\n'
          + (obs && obs.value ? '• Observações: ' + obs.value + '\n' : '');

      if (!WA_NUMBER) {
        window.alert((EN ? 'This is the message the form composes:\n\n'
                         : 'Esta é a mensagem que o formulário monta:\n\n')
                     + msg + '\n' + WA_UNSET);
        return;
      }
      window.open(waHref(msg), '_blank', 'noopener');
    });
  }

  /* -------------------------------------------------- bake-day notify list */
  function notifyList() {
    var f = document.querySelector('#form-avisar');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('#consent-avisar');
      if (ok && !ok.checked) {
        window.alert(EN ? 'Please tick the consent box — we cannot add you to the list without it.'
                        : 'Marque a caixa de consentimento — sem ela não podemos incluir você na lista.');
        return;
      }
      window.alert(EN
        ? 'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this is a bake-day '
          + 'notification list: a message when the bread you asked about comes out of the oven. It runs '
          + 'on explicit opt-in with a one-click unsubscribe, under the LGPD.'
        : 'MOCKUP — nada foi enviado e nada foi armazenado.\n\nNo site publicado esta é a lista de aviso '
          + 'de fornada: uma mensagem quando o pão que você pediu sai do forno. Funciona por opt-in '
          + 'explícito e com descadastro em um clique, conforme a LGPD.');
      f.reset();
    });
  }

  /* ---------------------------------------------------------- wholesale form */
  function wholesale() {
    var f = document.querySelector('#form-atacado');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      window.alert(EN
        ? 'MOCKUP — nothing was sent.\n\nWhether Kompaan supplies wholesale at all is unconfirmed. '
          + 'This form is built so the line can be opened the day they say yes.'
        : 'MOCKUP — nada foi enviado.\n\nSe a Kompaan atende atacado ainda não está confirmado. Este '
          + 'formulário fica pronto para o dia em que eles disserem que sim.');
    });
  }

  /* --------------------------------------------------------------- header */
  function header() {
    var hdr = document.querySelector('.hdr');
    if (!hdr) return;
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.pageYOffset > 30);
        ticking = false;
      });
    }, { passive: true });

    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
        document.body.style.overflow = !open ? 'hidden' : '';
      });
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && nav.classList.contains('is-open')) burger.click();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) burger.click();
      });
    }
  }

  /* --------------------------------------------------------------- reveals */
  function reveals() {
    var els = document.querySelectorAll('.rv');
    if (REDUCED || !('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('is-in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, idx = 0, sib = el;
        while ((sib = sib.previousElementSibling)) if (sib.classList.contains('rv')) idx++;
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ---------------------------------------------------------------- countup
     Returns on anything that is not a number, so a [CONFIRM] marker can never
     be animated up into an invented figure.                                  */
  function countup() {
    var els = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (REDUCED) { el.textContent = String(target); return; }
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1200, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { for (var i = 0; i < els.length; i++) run(els[i]); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* ------------------------------------------------------------ prod filter */
  function filters() {
    var bar = document.querySelector('.chips');
    var grid = document.querySelector('.prods');
    var out = document.querySelector('.count');
    if (!bar || !grid) return;
    var cards = grid.querySelectorAll('.prod');

    function apply(key) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var tags = (cards[i].getAttribute('data-tags') || '').split(' ');
        var hit = key === 'all' || tags.indexOf(key) > -1;
        cards[i].classList.toggle('is-out', !hit);
        if (hit) shown++;
      }
      if (out) out.textContent = EN
        ? shown + (shown === 1 ? ' item shown' : ' items shown')
        : shown + (shown === 1 ? ' item exibido' : ' itens exibidos');
    }
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('button') : null;
      if (!btn) return;
      var all = bar.querySelectorAll('button');
      for (var i = 0; i < all.length; i++) all[i].setAttribute('aria-pressed', String(all[i] === btn));
      apply(btn.getAttribute('data-filter'));
    });
    apply('all');
  }

  /* ------------------------------------------------------------- LGPD gate */
  var KEY = 'kompaan_lgpd_v1';
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function saveConsent(o) { try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      /* Consented branch. Empty on purpose: the live site injects a cookieless,
         self-hosted analytics script here, and nothing third-party runs before
         this point. */
    }
    if (c.marketing) {
      /* Map embed and any social widget are upgraded from a static facade to a
         real embed only inside this branch. */
    }
  }
  function cookies() {
    var bar = document.querySelector('.ck');
    if (!bar) return;
    var existing = readConsent();
    if (existing) applyConsent(existing);
    else window.setTimeout(function () { bar.classList.add('is-on'); }, 800);

    function close(c) { saveConsent(c); applyConsent(c); bar.classList.remove('is-on'); }
    var acc = bar.querySelector('[data-ck="accept"]');
    var rej = bar.querySelector('[data-ck="reject"]');
    var sav = bar.querySelector('[data-ck="save"]');
    if (acc) acc.addEventListener('click', function () {
      var a = bar.querySelector('#ck-a'), m = bar.querySelector('#ck-m');
      if (a) a.checked = true; if (m) m.checked = true;
      close({ necessary: true, analytics: true, marketing: true, at: Date.now() });
    });
    if (rej) rej.addEventListener('click', function () {
      close({ necessary: true, analytics: false, marketing: false, at: Date.now() });
    });
    if (sav) sav.addEventListener('click', function () {
      var a = bar.querySelector('#ck-a'), m = bar.querySelector('#ck-m');
      close({ necessary: true, analytics: !!(a && a.checked), marketing: !!(m && m.checked), at: Date.now() });
    });
    var open = document.querySelectorAll('[data-ck-open]');
    for (var i = 0; i < open.length; i++) {
      open[i].addEventListener('click', function (e) { e.preventDefault(); bar.classList.add('is-on'); });
    }
  }

  function boot() {
    header(); reveals(); countup(); filters(); buildCalendar();
    preorder(); notifyList(); wholesale(); cookies(); wireWhatsApp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

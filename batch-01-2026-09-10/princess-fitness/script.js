/* =====================================================================
   Princess Biquinis Floripa — spec mockup behaviour
   Self-contained, no framework, no build step, no modules, no fetch.
   Safe to open straight off the filesystem.

   LANGUAGE: this file is shared by the pt-BR, /en/ and /es/ trees. Those
   trees are REAL parallel pages with their own translated markup — the
   only thing switched here is the handful of strings JS itself produces
   (WhatsApp message bodies, the open/closed status, result counts).
   ===================================================================== */
(function () {
  'use strict';

  var docLang = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var IS_EN = docLang.indexOf('en') === 0;
  var IS_ES = docLang.indexOf('es') === 0;

  /* t(pt, en, es) — es falls back to en if no Spanish string is supplied */
  function t(pt, en, es) {
    if (IS_ES) { return es === undefined ? en : es; }
    return IS_EN ? en : pt;
  }

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     WHATSAPP — DELIBERATELY NOT DIALLED

     The only number on file is (48) 98871-0692, and the brief marks it
     [CONFIRM - secondary source]: it was never read from the business
     own channel, and there is no confirmation that the line answers on
     WhatsApp at all, nor which of the two shops it belongs to. Guessing
     would put a real stranger phone number on a public mockup.

     Set WA_CAMPECHE / WA_CENTRO to 5548... once each line is confirmed
     in writing and every button on the site starts working. Until then
     every WhatsApp control is visibly disabled and says why.
     =================================================================== */
  var WA_CAMPECHE = null; /* [CONFIRM] */
  var WA_CENTRO = null;   /* [CONFIRM] */

  function noNumber() {
    window.alert(t(
      'MOCKUP: nenhum numero de WhatsApp foi confirmado para esta loja. O numero que circula em fontes secundarias nao foi verificado com a loja, e nao ha confirmacao de que a linha atende no WhatsApp. Nada e discado ate a confirmacao por escrito.',
      'MOCKUP: no WhatsApp number has been confirmed for this store. The number circulating in secondary sources has not been verified with the shop, and there is no confirmation that the line answers on WhatsApp. Nothing is dialled until it is confirmed in writing.',
      'MOCKUP: no hay un numero de WhatsApp confirmado para esta tienda. El numero que circula en fuentes secundarias no fue verificado con la tienda, y no hay confirmacion de que la linea atienda por WhatsApp. No se marca nada hasta confirmarlo por escrito.'
    ));
  }

  function numberFor(store) {
    if (store === 'centro') { return WA_CENTRO; }
    if (store === 'campeche') { return WA_CAMPECHE; }
    return WA_CAMPECHE || WA_CENTRO;
  }

  /* Point one element at WhatsApp, or disable it honestly. */
  function wireWA(el, msg, store) {
    var num = numberFor(store);
    if (num) {
      el.setAttribute('href', 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg));
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

  function wireAllWA() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      wireWA(el, el.getAttribute('data-wa') || t('Ola!', 'Hello!', 'Hola!'),
        el.getAttribute('data-store') || '');
    }
  }

  /* ===================================================================
     Sticky header, mobile nav
     =================================================================== */
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

  /* ===================================================================
     Scroll reveals with sibling stagger
     =================================================================== */
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
        var el = e.target;
        var idx = 0, sib = el;
        while ((sib = sib.previousElementSibling)) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
        }
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
  }

  /* ===================================================================
     Hero parallax — rAF-throttled, transform only
     =================================================================== */
  function parallax() {
    var media = document.querySelector('.hero-media img');
    if (!media || reduced) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset;
      if (y < 900) { media.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0) scale(1.06)'; }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    media.style.transform = 'scale(1.06)';
  }

  /* ===================================================================
     Count-ups. If the value is not a number — because it is a visible
     [CONFIRM] placeholder — nothing animates and nothing is invented.
     =================================================================== */
  function countUps() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) { return; }
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) { return; }
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = String(target) + suffix; return; }
      var start = null, dur = 1100;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased)) + suffix;
        if (p < 1) { window.requestAnimationFrame(step); }
      }
      window.requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) { run(nodes[i]); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) { run(entries[j].target); io.unobserve(entries[j].target); }
      }
    }, { threshold: 0.4 });
    for (var k = 0; k < nodes.length; k++) { io.observe(nodes[k]); }
  }

  /* ===================================================================
     Open / closed status.
     Campeche hours are the ONLY hours on file and they are themselves
     [CONFIRM - secondary source]. Centro hours are unknown, so nothing
     is computed for Centro: the page says so instead of guessing.
     =================================================================== */
  var CAMPECHE_HOURS = { 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 14] };

  function status() {
    var el = document.querySelector('[data-status]');
    if (!el) { return; }
    var now = new Date();
    var h = CAMPECHE_HOURS[now.getDay()];
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = !!h && mins >= h[0] * 60 && mins < h[1] * 60;
    var label;
    if (open) {
      label = t('Campeche aberto ate ' + h[1] + 'h',
        'Campeche open until ' + h[1] + ':00',
        'Campeche abierto hasta las ' + h[1] + ':00');
    } else {
      label = t('Campeche fechado agora', 'Campeche closed now', 'Campeche cerrado ahora');
    }
    el.classList.toggle('shut', !open);
    var text = el.querySelector('[data-status-text]');
    if (text) { text.textContent = label; }
  }

  /* ===================================================================
     THE FIT FINDER
     Progressive enhancement: every shape card is already in the page, so
     with JavaScript disabled the visitor still sees the whole range and
     every explanation. JS only filters and announces.

     Each card carries data-cov (1-4), data-sup (1-4) and data-use (a
     space separated list). Those are structural attributes of the SHAPE,
     not invented product data — the shapes themselves stay visible
     [CONFIRM] placeholders until the real range is supplied.
     =================================================================== */
  function fitFinder() {
    var form = document.getElementById('ff-form');
    var out = document.getElementById('ff-out');
    if (!form || !out) { return; }
    var cards = out.querySelectorAll('[data-cov]');
    var summary = document.getElementById('ff-summary');

    function val(name) {
      var c = form.querySelector('input[name="' + name + '"]:checked');
      return c ? c.value : '';
    }

    function score(card, cov, sup, use) {
      var s = 0;
      var cs = parseInt(card.getAttribute('data-sup'), 10);
      if (cov) { s += 3 - Math.min(3, Math.abs(parseInt(card.getAttribute('data-cov'), 10) - parseInt(cov, 10))); }
      /* data-sup="0" means the question does not apply to this shape (bottoms
         have no bust support), so it is scored on coverage and use only. */
      if (sup && cs > 0) { s += 3 - Math.min(3, Math.abs(cs - parseInt(sup, 10))); }
      if (use && (' ' + card.getAttribute('data-use') + ' ').indexOf(' ' + use + ' ') > -1) { s += 2; }
      return s;
    }

    function apply(ev) {
      if (ev) { ev.preventDefault(); }
      var cov = val('cobertura'), sup = val('sustentacao'), use = val('uso');
      var any = !!(cov || sup || use);
      var scored = [];
      for (var i = 0; i < cards.length; i++) {
        scored.push({ el: cards[i], s: score(cards[i], cov, sup, use) });
      }
      scored.sort(function (a, b) { return b.s - a.s; });
      /* Keep the best two TOPS and the best two BOTTOMS. A shortlist that is
         all tops is useless in a category bought as two independent halves. */
      var kept = { top: 0, bottom: 0 }, shown = 0;
      for (var j = 0; j < scored.length; j++) {
        var kind = scored[j].el.getAttribute('data-kind') || 'top';
        var keep = true;
        if (any) {
          keep = kept[kind] < 2;
          if (keep) { kept[kind]++; }
        }
        scored[j].el.hidden = !keep;
        scored[j].el.style.order = String(j);
        if (keep) { shown++; }
      }
      if (summary) {
        summary.textContent = any
          ? t(shown + ' modelo(s) combinam com o que voce descreveu. Toda a linha volta quando voce limpa as respostas.',
              shown + ' shape(s) match what you described. The whole range comes back when you clear the answers.',
              shown + ' modelo(s) coinciden con lo que describiste. Toda la linea vuelve cuando limpias las respuestas.')
          : t('Mostrando todos os modelos.', 'Showing every shape.', 'Mostrando todos los modelos.');
      }
      out.setAttribute('tabindex', '-1');
      if (ev) { out.focus(); }
    }

    form.addEventListener('submit', apply);
    var radios = form.querySelectorAll('input[type="radio"]');
    for (var r = 0; r < radios.length; r++) {
      radios[r].addEventListener('change', function () { apply(null); });
    }
    var clear = document.getElementById('ff-clear');
    if (clear) {
      clear.addEventListener('click', function () { form.reset(); apply(null); });
    }
  }

  /* ===================================================================
     MONTE SEU CONJUNTO — the top / bottom split
     Sizes are chosen independently. Nothing here asserts a price or a
     stock level; it composes a WhatsApp message from two chosen shapes.
     =================================================================== */
  function pairBuilder() {
    var box = document.getElementById('pair');
    if (!box) { return; }
    var outTop = document.getElementById('pair-top');
    var outBot = document.getElementById('pair-bottom');
    var send = document.getElementById('pair-send');
    var placeholder = t('a escolher', 'to choose', 'a elegir');

    function chosen(name) {
      var c = box.querySelector('input[name="' + name + '"]:checked');
      return c ? c.getAttribute('data-label') : '';
    }

    function update() {
      var top = chosen('top'), bot = chosen('bottom');
      if (outTop) { outTop.textContent = top || placeholder; }
      if (outBot) { outBot.textContent = bot || placeholder; }
      if (!send) { return; }
      var msg = t(
        'Oi! Queria montar um conjunto: top ' + (top || placeholder) + ' com calcinha ' + (bot || placeholder) + '. Podem me ajudar com o tamanho de cada peca?',
        'Hi! I would like to put a set together: ' + (top || placeholder) + ' top with ' + (bot || placeholder) + ' bottom. Can you help me size each piece?',
        'Hola! Queria armar un conjunto: top ' + (top || placeholder) + ' con bombacha ' + (bot || placeholder) + '. Me ayudan con el talle de cada pieza?'
      );
      var clone = send.cloneNode(true);
      clone.setAttribute('data-wa', msg);
      send.parentNode.replaceChild(clone, send);
      send = clone;
      wireWA(send, msg, send.getAttribute('data-store') || '');
    }

    var inputs = box.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('change', update);
    }
    update();
  }

  /* ===================================================================
     Lookbook rail
     =================================================================== */
  function rails() {
    var groups = document.querySelectorAll('[data-rail]');
    for (var i = 0; i < groups.length; i++) {
      (function (g) {
        var rail = g.querySelector('.rail');
        var prev = g.querySelector('[data-rail-prev]');
        var next = g.querySelector('[data-rail-next]');
        if (!rail) { return; }
        function go(dir) {
          var step = Math.max(240, Math.round(rail.clientWidth * 0.62));
          rail.scrollBy({ left: dir * step, top: 0, behavior: reduced ? 'auto' : 'smooth' });
        }
        if (prev) { prev.addEventListener('click', function () { go(-1); }); }
        if (next) { next.addEventListener('click', function () { go(1); }); }
      })(groups[i]);
    }
  }

  /* ===================================================================
     LGPD consent (Lei 13.709/2018)
     Nothing non-essential is on by default. Reject is as prominent as
     accept. No tag, pixel or embed fires anywhere in this mockup — the
     consented branch is deliberately left inert.
     =================================================================== */
  var STORE_KEY = 'pbf_lgpd_v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(STORE_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function saveConsent(obj) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* private mode */ }
  }

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
      saveConsent({ a: !!analytics, m: !!marketing, ts: new Date().toISOString() });
      /* Consented branch intentionally empty in this mockup: no analytics,
         no pixel, no map embed and no social embed is loaded anywhere. */
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
    if (!readConsent()) { window.setTimeout(show, 900); }
    else { hide(); }
  }

  function year() {
    var nodes = document.querySelectorAll('[data-year]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = String(new Date().getFullYear());
    }
  }

  function init() {
    header();
    reveals();
    parallax();
    countUps();
    status();
    fitFinder();
    pairBuilder();
    rails();
    consent();
    year();
    wireAllWA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ===========================================================================
   MULTI OPEN SHOPPING E OFFICES — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en) { return EN ? en : pt; }

  /* -------------------------------------------------------------------------
     CONTACT — all three are published on their own site and are used exactly
     as published. No leasing-specific number is published anywhere, and none
     is invented. [CONFIRM whether leasing has a different line from the
     general one — four audiences currently share a single inbox.]
     ---------------------------------------------------------------------- */
  var PHONE_DISPLAY = '(48) 3307-4010';
  var PHONE_TEL = '+554833074010';
  var WA_NUMBER = '5548988378334';           // (48) 98837-8334, from their site
  var EMAIL = 'contato@multiopenshopping.com.br';

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < wa.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : t(
          'Olá! Vim pelo site do MULTI e queria uma informação.',
          'Hello! I came from the MULTI website and would like some information.');
        if (el.tagName === 'A') { el.href = waHref(msg); el.target = '_blank'; el.rel = 'noopener'; }
        else { el.addEventListener('click', function () { window.open(waHref(msg), '_blank', 'noopener'); }); }
      })(wa[i]);
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) {
      if (tels[j].tagName === 'A') tels[j].href = 'tel:' + PHONE_TEL;
    }
  }

  /* =========================================================================
     1. THE OPEN-STATUS BOARD.

     Computed client-side from their own published hours, in São Paulo time
     rather than the visitor's — someone checking from another timezone must
     not be told the place is open when it is shut.

     Their asterisks are reproduced honestly: individual tenant hours vary and
     are listed on each tenant's own directory entry. The cinema has no
     published hours at all, so it renders as a [CONFIRM] and never as a guess.

     STATE IS CONVEYED IN TEXT, never by colour alone.
     ====================================================================== */
  var SCHEDULES = [
    { key: 'shopping', open: 10, close: 22 },   // OPEN SHOPPING 10h–22h*
    { key: 'offices', open: 8, close: 18 },     // OFFICES 08h–18h*
    { key: 'cinema', open: null, close: null }  // [CONFIRM] — none published
  ];

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
      /* Brazil abolished daylight saving in 2019, so UTC-3 holds all year */
      return new Date(now.getTime() + (now.getTimezoneOffset() - 180) * 60000);
    }
  }

  function two(n) { return (n < 10 ? '0' : '') + n; }

  function statusBoard() {
    var now = saoPauloNow();
    var mins = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < SCHEDULES.length; i++) {
      var s = SCHEDULES[i];
      var nodes = document.querySelectorAll('[data-status="' + s.key + '"]');
      var label, cls;
      if (s.open === null) {
        label = t('horário não publicado', 'hours not published');
        cls = '';
      } else if (mins >= s.open * 60 && mins < s.close * 60) {
        label = t('aberto agora', 'open now');
        cls = 'is-open';
      } else {
        label = t('fechado agora', 'closed now');
        cls = 'is-shut';
      }
      for (var j = 0; j < nodes.length; j++) {
        var b = nodes[j].querySelector('b');
        if (b) b.textContent = label;
        nodes[j].classList.remove('is-open', 'is-shut');
        if (cls) nodes[j].classList.add(cls);
      }
    }
    /* the "atualizado em DD/MM" stamps — the whole point of this build */
    var stamps = document.querySelectorAll('[data-stamp]');
    var ddmm = two(now.getDate()) + '/' + two(now.getMonth() + 1);
    for (var k = 0; k < stamps.length; k++) {
      stamps[k].textContent = stamps[k].getAttribute('data-stamp').replace('DD/MM', ddmm);
    }
  }

  /* =========================================================================
     2. THE AGENDA RAIL.

     The single most damaging thing on their current homepage is a STALE
     cinema showtimes block — films from an earlier season, one with a typo in
     the title, sitting under November news items. Anyone who spots it stops
     trusting the opening hours too.

     So: every live-information block on this build is driven by one editable
     array and carries a visible "atualizado em DD/MM" stamp. Showtimes are NOT
     duplicated by hand anywhere — the cinema band links out to the maintained
     source instead.

     The two real news items captured at fetch time seed the agenda. Both keep
     their real dates. No event has been invented. [CONFIRM the current
     programme, and who owns keeping it up to date.]
     ====================================================================== */
  function rail() {
    var host = document.querySelector('.rail');
    if (!host) return;
    var prev = document.querySelector('[data-rail="prev"]');
    var next = document.querySelector('[data-rail="next"]');
    function step(dir) {
      var card = host.querySelector('li');
      var w = card ? card.getBoundingClientRect().width + 18 : 320;
      host.scrollBy({ left: dir * w, behavior: REDUCED ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });

    /* keyboard: the rail is focusable and arrow keys move it */
    host.setAttribute('tabindex', '0');
    host.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  }

  /* =========================================================================
     3. THE DIRECTORY — the site's utility spine.

     Their current directory is a flat scroll with no search, no filters and no
     deep links. Here it is searchable, filterable and deep-linkable, so a
     tenant can share their own entry (#sala-115-c).

     The tenant entries carry only what their own site already publishes —
     name, sala number, phone and individual hours. Nothing has been added,
     no logo is used, and no tenant has been invented. [CONFIRM the complete
     list across all four categories, plus each tenant's documented basis for
     publication and a route to correct or remove their entry.]
     ====================================================================== */
  function directory() {
    var grid = document.querySelector('.dir');
    if (!grid) return;
    var cards = grid.querySelectorAll('.ten');
    var bar = document.querySelector('.chips');
    var input = document.querySelector('#dir-search');
    var out = document.querySelector('.count');
    var key = 'all';

    function apply() {
      var q = (input && input.value || '').trim().toLowerCase();
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var cat = cards[i].getAttribute('data-cat') || '';
        var hay = (cards[i].textContent || '').toLowerCase();
        var hit = (key === 'all' || cat === key) && (!q || hay.indexOf(q) > -1);
        cards[i].classList.toggle('is-out', !hit);
        if (hit) shown++;
      }
      /* the search announces its result count to assistive tech */
      if (out) out.textContent = t(
        shown + (shown === 1 ? ' operação encontrada' : ' operações encontradas'),
        shown + (shown === 1 ? ' business found' : ' businesses found'));
    }
    if (bar) {
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('button') : null;
        if (!btn) return;
        key = btn.getAttribute('data-filter');
        var all = bar.querySelectorAll('button');
        for (var i = 0; i < all.length; i++) all[i].setAttribute('aria-pressed', String(all[i] === btn));
        apply();
      });
    }
    if (input) input.addEventListener('input', apply);
    apply();

    /* deep link: /#sala-115-c scrolls to and highlights that entry */
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        target.classList.remove('is-out');
        window.setTimeout(function () {
          target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        }, 120);
      }
    }
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
        el.style.transitionDelay = Math.min(idx, 5) * 88 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* -------------------------------------------------------------- parallax */
  function parallax() {
    var img = document.querySelector('.hero__img');
    if (!img || REDUCED) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.2) img.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------- countup
     Guards on isNaN. Note what is NOT counted here: there is no footfall
     figure anywhere on this build. Their advertising pitch says "uma grande
     quantidade de pessoas" and publishes no number, and a footfall figure sold
     to an advertiser is a commercial representation — so none is invented.    */
  function countup() {
    var els = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (REDUCED) { el.textContent = String(target); return; }
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1150, 1);
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

  /* ------------------------------------------------------------- form tabs
     FOUR audiences currently share one contact form. Here each has its own
     routed form — which under the LGPD also means four stated purposes and
     four retention rules. Ships with all panels visible; JS collapses them.  */
  function formTabs() {
    var bar = document.querySelector('.formtabs');
    if (!bar) return;
    var btns = bar.querySelectorAll('button');
    var panels = document.querySelectorAll('[data-pane]');
    function show(k) {
      for (var i = 0; i < panels.length; i++) panels[i].hidden = panels[i].getAttribute('data-pane') !== k;
      for (var j = 0; j < btns.length; j++) {
        btns[j].setAttribute('aria-selected', String(btns[j].getAttribute('data-tab') === k));
      }
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (b) show(b.getAttribute('data-tab'));
    });
    if (btns.length) show(btns[0].getAttribute('data-tab'));
  }

  function forms() {
    var all = document.querySelectorAll('form[data-mock]');
    for (var i = 0; i < all.length; i++) {
      (function (f) {
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          var ok = f.querySelector('input[type="checkbox"][data-consent]');
          if (ok && !ok.checked) {
            window.alert(t('Marque a caixa de consentimento para podermos responder.',
                           'Please tick the consent box so we can reply.'));
            return;
          }
          window.alert(t(
            'MOCKUP — nada foi enviado e nada foi armazenado.\n\nNo site publicado esta solicitação ('
              + f.getAttribute('data-mock') + ') vai para um endpoint com registro de consentimento, com '
              + 'finalidade e prazo de retenção próprios. Hoje os quatro públicos dividem a mesma caixa.',
            'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this request ('
              + f.getAttribute('data-mock') + ') goes to a consent-logged endpoint with its own stated '
              + 'purpose and retention rule. Today all four audiences share one inbox.'));
        });
      })(all[i]);
    }
  }

  /* ------------------------------------------------------------- LGPD gate */
  var KEY = 'multi_lgpd_v1';
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function saveConsent(o) { try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      /* Consented branch. Analytics is injected here and nowhere else. */
    }
    if (c.marketing) {
      /* A map embed or a social widget would upgrade from its static
         placeholder only inside this branch. */
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
    header(); reveals(); parallax(); countup();
    statusBoard(); rail(); directory(); formTabs(); forms(); cookies(); wireContacts();
    /* the status board re-ticks every minute so it never goes stale on screen */
    window.setInterval(statusBoard, 60000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

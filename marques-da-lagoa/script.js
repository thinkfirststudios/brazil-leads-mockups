/* ===========================================================================
   MARQUÊS DA LAGOA — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en) { return EN ? en : pt; }

  /* =========================================================================
     1. THE MENU DATA — one editable object, both modules run off it.

     NOTHING HERE IS A REAL ITEM. Marquês da Lagoa is Instagram-only behind a
     login wall: no menu, no drinks list, no price and no dish name was
     recoverable. Not one has been invented — every name and every price is a
     visible [CONFIRM] placeholder, and the allergen chips are the categories
     ANVISA RDC 26/2015 requires, not a claim about any dish.

     [CONFIRM the full food menu, the full drinks list, prices in R$, how many
      people each porção serves, and per-item allergen data.]
     ====================================================================== */
  var CFM = '[CONFIRM]';
  var PRICE = 'R$ [CONFIRM]';

  /* Serving sizes matter under the CDC: on a sharing menu, the number of
     people a porção feeds must sit next to the price. It is the single most
     common source of billing disputes, not a courtesy. */
  var SHARING = [
    { key: 'p1', serves: '[CONFIRM] ', allerg: ['peixes', 'trigo'] },
    { key: 'p2', serves: '[CONFIRM] ', allerg: ['crustáceos'] },
    { key: 'p3', serves: '[CONFIRM] ', allerg: ['moluscos', 'peixes'] },
    { key: 'p4', serves: '[CONFIRM] ', allerg: ['trigo', 'leite'] },
    { key: 'p5', serves: '[CONFIRM] ', allerg: ['leite'] },
    { key: 'p6', serves: '[CONFIRM] ', allerg: ['trigo'] }
  ];

  var MAINS = ['do-mar-1', 'do-mar-2', 'principal-1', 'principal-2', 'vegetariano-1', 'sobremesa-1'];

  var DRINKS = {
    caipirinhas: 6,
    cervejas: 5,
    vinhos: 4,
    semalcool: 5,      /* given genuine equal weight, not a token three lines */
    sucos: 5
  };

  /* ---------------------------------------------------------------------
     Live-music agenda. Driven by this array so the owner can add a night in
     thirty seconds. It ships with THREE VISIBLY LABELLED PLACEHOLDER ROWS —
     no act name has been fabricated, and no cover charge has been assumed.
     A couvert artístico must be disclosed before the customer sits down.
     [CONFIRM whether there is live music at all, which nights, and the couvert]
     ------------------------------------------------------------------ */
  var AGENDA = [
    { date: null, act: '[CONFIRM atração]', time: '[CONFIRM]', cover: '[CONFIRM couvert]' },
    { date: null, act: '[CONFIRM atração]', time: '[CONFIRM]', cover: '[CONFIRM couvert]' },
    { date: null, act: '[CONFIRM atração]', time: '[CONFIRM]', cover: '[CONFIRM couvert]' }
  ];

  /* -------------------------------------------------------------------------
     CONTACT — Instagram-only. No phone, no WhatsApp, no e-mail is published
     anywhere reachable, and none is invented. Set WA_NUMBER and the whole
     reservation path switches itself on.
     ---------------------------------------------------------------------- */
  var WA_NUMBER = null;                       // [CONFIRM]
  var IG = 'https://www.instagram.com/marquesdalagoaoficial/';

  var NO_WA = t(
    'Nenhum número de WhatsApp, telefone ou e-mail está publicado para o Marquês da Lagoa. O único canal '
      + 'público é o Instagram @marquesdalagoaoficial, que fica atrás de login.\n\n'
      + 'Este mockup não inventa um número. Todo o fluxo de reserva abaixo está pronto — inclusive o '
      + 'pedido de mesa na beira da água — e começa a funcionar no instante em que o número real for informado.',
    'No WhatsApp number, phone or e-mail is published for Marquês da Lagoa. The only public channel is the '
      + 'Instagram profile @marquesdalagoaoficial, which sits behind a login wall.\n\n'
      + 'This mockup does not invent a number. The whole reservation flow below is built — including the '
      + 'waterside-table request — and starts working the moment a real number is supplied.');

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : t(
          'Olá! Vim pelo site do Marquês da Lagoa e queria reservar uma mesa.',
          'Hello! I came from the Marquês da Lagoa website and would like to book a table.');
        if (WA_NUMBER) {
          el.removeAttribute('data-unconfirmed');
          if (el.tagName === 'A') { el.href = waHref(msg); el.target = '_blank'; el.rel = 'noopener'; }
          else { el.addEventListener('click', function () { window.open(waHref(msg), '_blank', 'noopener'); }); }
        } else {
          el.setAttribute('data-unconfirmed', '');
          if (el.tagName === 'A') { el.removeAttribute('href'); el.setAttribute('role', 'button'); el.tabIndex = 0; }
          el.addEventListener('click', function (e) { e.preventDefault(); window.alert(NO_WA); });
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.alert(NO_WA); }
          });
        }
      })(nodes[i]);
    }
  }

  /* =========================================================================
     2. PÔR DO SOL HOJE — the signature module.

     Sunset time for Florianópolis computed entirely client-side from the date
     and a fixed latitude/longitude. No API, no key, no third-party request —
     which also means no data leaves the visitor's browser to work out when the
     sun goes down.

     This is the standard NOAA sunset approximation. It is accurate to a minute
     or two, which is exactly why the strip says "por volta de": it is
     informational, never a guarantee, and no promotion is tied to it.

     Florianópolis: -27.5954 lat, -48.5480 long. Brazil abolished daylight
     saving in 2019, so UTC-3 holds all year.
     [CONFIRM the venue's exact coordinates once the address is known — for a
      "near me at sunset" query the geo matters more here than anywhere else.]
     ====================================================================== */
  var LAT = -27.5954, LON = -48.5480, TZ = -3;

  function sunsetFor(date) {
    var rad = Math.PI / 180, deg = 180 / Math.PI;

    /* day of year */
    var start = new Date(date.getFullYear(), 0, 0);
    var n = Math.floor((date - start) / 86400000);

    /* approximate time, solar mean anomaly, ecliptic longitude */
    var lngHour = LON / 15;
    var tApprox = n + ((18 - lngHour) / 24);            /* 18 = evening */
    var M = (0.9856 * tApprox) - 3.289;
    var Ls = M + (1.916 * Math.sin(M * rad)) + (0.020 * Math.sin(2 * M * rad)) + 282.634;
    Ls = ((Ls % 360) + 360) % 360;

    /* right ascension, put in the same quadrant as Ls, converted to hours */
    var RA = Math.atan(0.91764 * Math.tan(Ls * rad)) * deg;
    RA = ((RA % 360) + 360) % 360;
    RA = (RA + (Math.floor(Ls / 90) * 90) - (Math.floor(RA / 90) * 90)) / 15;

    /* declination */
    var sinDec = 0.39782 * Math.sin(Ls * rad);
    var cosDec = Math.cos(Math.asin(sinDec));

    /* local hour angle — 90.833° accounts for refraction and the solar disc */
    var cosH = (Math.cos(90.833 * rad) - (sinDec * Math.sin(LAT * rad)))
             / (cosDec * Math.cos(LAT * rad));
    if (cosH > 1 || cosH < -1) return null;             /* no sunset that day */

    var H = (Math.acos(cosH) * deg) / 15;                /* setting */
    var T = H + RA - (0.06571 * tApprox) - 6.622;
    var UT = ((T - lngHour) % 24 + 24) % 24;
    var local = ((UT + TZ) % 24 + 24) % 24;

    var hh = Math.floor(local);
    var mm = Math.round((local - hh) * 60);
    if (mm === 60) { mm = 0; hh = (hh + 1) % 24; }
    return { h: hh, m: mm };
  }

  function two(n) { return (n < 10 ? '0' : '') + n; }

  function sunsetStrip() {
    var host = document.querySelector('.sunset');
    if (!host) return;
    var out = host.querySelector('[data-sunset]');
    var btn = host.querySelector('[data-sunset-book]');

    var now = new Date();
    var s = sunsetFor(now);
    if (!s || !out) return;                       /* the static line stays */

    out.textContent = two(s.h) + 'h' + two(s.m);

    /* the booking suggestion is a comfortable stretch before sunset, so the
       table is already yours when the light goes */
    var lead = new Date(now.getTime());
    lead.setHours(s.h, s.m, 0, 0);
    lead.setMinutes(lead.getMinutes() - 75);

    var ddmm = two(now.getDate()) + '/' + two(now.getMonth() + 1);   /* DD/MM, always */
    var hhmm = two(lead.getHours()) + 'h' + two(lead.getMinutes());

    if (btn) {
      btn.setAttribute('data-wa', t(
        'Olá! Queria reservar para o pôr do sol.\nData: ' + ddmm + '\nHorário: ' + hhmm
          + '\nPessoas: \nNome: \nSe possível, mesa na beira da água.',
        'Hello! I would like to book for sunset.\nDate: ' + ddmm + '\nTime: ' + hhmm
          + '\nParty size: \nName: \nA table by the water if possible.'));
    }
    var when = host.querySelector('[data-sunset-when]');
    if (when) when.textContent = ddmm;
  }

  /* --------------------------------------------------------------- header */
  function header() {
    var hdr = document.querySelector('.hdr');
    if (!hdr) return;
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.nav');
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.pageYOffset > 60);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
        if (y < window.innerHeight * 1.2) img.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------- countup
     Guards on isNaN. The stats band on this build ships EMPTY on purpose —
     the brief says delete it rather than fill it, and no number is confirmed. */
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

  /* ------------------------------------------------------------ drinks tabs
     The drinks list is a first-class citizen here, not an afterthought at the
     bottom of the food menu — a waterfront bar sells the carta as hard as the
     kitchen. Ships with every panel visible; JS collapses to tabs.           */
  function tabs() {
    var bar = document.querySelector('.tabs');
    if (!bar) return;
    var btns = bar.querySelectorAll('button');
    var panels = document.querySelectorAll('[data-drinks]');

    function show(key) {
      for (var i = 0; i < panels.length; i++) {
        panels[i].hidden = panels[i].getAttribute('data-drinks') !== key;
      }
      for (var j = 0; j < btns.length; j++) {
        btns[j].setAttribute('aria-selected', String(btns[j].getAttribute('data-tab') === key));
      }
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (b) show(b.getAttribute('data-tab'));
    });
    bar.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var list = Array.prototype.slice.call(btns);
      var cur = list.indexOf(document.activeElement);
      if (cur < 0) return;
      e.preventDefault();
      var nxt = list[(cur + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      nxt.focus(); show(nxt.getAttribute('data-tab'));
    });
    if (btns.length) show(btns[0].getAttribute('data-tab'));
  }

  /* ---------------------------------------------------------------- agenda
     Renders from the AGENDA array above. Ships an empty state rather than a
     fabricated line-up.                                                      */
  function agenda() {
    var host = document.querySelector('.agenda');
    var empty = document.querySelector('.empty');
    if (!host) return;
    var real = AGENDA.filter(function (a) { return a.date; });
    if (!real.length) {
      /* the three placeholder rows are already in the HTML, visibly labelled */
      if (empty) empty.hidden = false;
    }
  }

  /* --------------------------------------------------- reservation composer */
  function reservation() {
    var f = document.querySelector('#form-reserva');
    if (!f) return;
    var date = f.querySelector('#r-data');
    if (date) {
      var n = new Date();
      date.min = n.getFullYear() + '-' + two(n.getMonth() + 1) + '-' + two(n.getDate());
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('#r-consent');
      if (ok && !ok.checked) {
        window.alert(t('Marque a caixa de consentimento para podermos responder.',
                       'Please tick the consent box so we can reply.'));
        return;
      }
      var v = function (id) { var el = f.querySelector(id); return el ? el.value : ''; };
      var water = f.querySelector('#r-agua');
      var d = v('#r-data'), ddmm = '';
      if (d) { var p = d.split('-'); ddmm = p[2] + '/' + p[1]; }   /* DD/MM, always */

      var msg = t(
        'Olá! Queria reservar uma mesa.\nData: ' + ddmm + '\nHorário: ' + v('#r-hora')
          + '\nPessoas: ' + v('#r-pessoas') + '\nNome: ' + v('#r-nome')
          + (water && water.checked ? '\nSe possível, mesa na beira da água.' : '')
          + (v('#r-obs') ? '\nObservações: ' + v('#r-obs') : ''),
        'Hello! I would like to book a table.\nDate: ' + ddmm + '\nTime: ' + v('#r-hora')
          + '\nParty size: ' + v('#r-pessoas') + '\nName: ' + v('#r-nome')
          + (water && water.checked ? '\nA table by the water if possible.' : '')
          + (v('#r-obs') ? '\nNotes: ' + v('#r-obs') : ''));

      if (!WA_NUMBER) {
        window.alert(t('Esta é a mensagem que o formulário monta:\n\n',
                       'This is the message the form composes:\n\n') + msg + '\n\n' + NO_WA);
        return;
      }
      window.open(waHref(msg), '_blank', 'noopener');
    });
  }

  /* ------------------------------------------------------------ other forms */
  function forms() {
    var all = document.querySelectorAll('form[data-mock]');
    for (var i = 0; i < all.length; i++) {
      (function (f) {
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          window.alert(t(
            'MOCKUP — nada foi enviado e nada foi armazenado. A reserva só está confirmada quando a casa '
              + 'responde.',
            'MOCKUP — nothing was sent and nothing was stored. A booking is only confirmed once the venue '
              + 'replies.'));
        });
      })(all[i]);
    }
  }

  /* ------------------------------------------------------------- LGPD gate */
  var KEY = 'marques_lgpd_v1';
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
      /* The Instagram strip is a plain grid of local images linking out, not an
         embed, so it transfers nothing either way. A real map embed would be
         upgraded from its static placeholder only inside this branch. */
    }
  }
  function cookies() {
    var bar = document.querySelector('.ck');
    if (!bar) return;
    var existing = readConsent();
    if (existing) applyConsent(existing);
    else window.setTimeout(function () { bar.classList.add('is-on'); }, 900);

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
    header(); reveals(); parallax(); countup(); sunsetStrip();
    tabs(); agenda(); reservation(); forms(); cookies(); wireWhatsApp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

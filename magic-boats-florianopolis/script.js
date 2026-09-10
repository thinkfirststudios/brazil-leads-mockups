/* ===========================================================================
   MAGIC BOATS FLORIANÓPOLIS — shared behaviour for /, /en/ and /es/
   Spec mockup. No framework, no build step, no modules, no fetch().
   =========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var EN = LANG.indexOf('en') === 0;
  var ES = LANG.indexOf('es') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en, es) { return ES ? es : (EN ? en : pt); }

  /* -------------------------------------------------------------------------
     CONTACT — published by them, used exactly as published.
     (48) 99126-7973 · Rua Prof. Heinz Braunsperger, 88 / loja 6 · Jurerê
     No e-mail address is published on their site, so none is invented.
     ---------------------------------------------------------------------- */
  var WA_NUMBER = '5548991267973';
  var WA_DISPLAY = '(48) 99126-7973';

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function defaultMsg() {
    return t('Olá! Vim pelo site da Magic Boats e gostaria de informações sobre um day charter.',
             'Hello! I came from the Magic Boats website and would like details of a day charter.',
             '¡Hola! Vengo del sitio de Magic Boats y quisiera información sobre un day charter.');
  }
  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : defaultMsg();
        if (el.tagName === 'A') { el.href = waHref(msg); el.target = '_blank'; el.rel = 'noopener'; }
        else { el.addEventListener('click', function () { window.open(waHref(msg), '_blank', 'noopener'); }); }
      })(nodes[i]);
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
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
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
        if (y < window.innerHeight * 1.2) img.style.transform = 'translate3d(0,' + (y * 0.2) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------- countup
     Guards on isNaN. Note what is NOT counted here: there is no fleet-size
     counter, because their listing says "mais opções" and the full fleet is
     unconfirmed. "14 roteiros" is countable because they name all fourteen.  */
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

  /* ============================================================ THE FINDER
     Roteiro x guests x date x hull category. Their current fleet listing is a
     flat grid with no filter at all, so a visitor needing a boat for nineteen
     people has to read every card to find the two that fit. This is the whole
     conversion argument.

     The guest bands are read from each card's data-guests attribute, which
     carries THEIR published figure — every one of which is still a [CONFIRM],
     because a passenger capacity is a Marinha do Brasil regulated number
     printed on the vessel's documentation, not a marketing figure.
     ====================================================================== */
  function finder() {
    var card = document.querySelector('.finder__card');
    var grid = document.querySelector('.fleet');
    if (!card || !grid) return;

    var toggle = card.querySelector('.finder__toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
    }

    var route = card.querySelector('#f-roteiro');
    var pax = card.querySelector('#f-pax');
    var date = card.querySelector('#f-data');
    var cat = card.querySelector('#f-cat');
    var out = card.querySelector('.finder__out');
    var go = card.querySelector('[data-finder-go]');
    var boats = grid.querySelectorAll('.boat');
    var counter = document.querySelector('.count');

    if (date) {
      var n = new Date();
      var dd = function (x) { return (x < 10 ? '0' : '') + x; };
      date.min = n.getFullYear() + '-' + dd(n.getMonth() + 1) + '-' + dd(n.getDate());
    }
    function ddmm(v) {
      if (!v) return '';
      var p = v.split('-');
      return p[2] + '/' + p[1];              // DD/MM, always
    }

    /* a band matches a boat when the boat's published capacity covers the
       upper end of the band; "18+" needs the largest hulls */
    function bandOK(band, guests) {
      if (!band || band === 'all') return true;
      if (isNaN(guests)) return true;        // unknown capacity is never filtered out
      if (band === '6') return guests >= 6;
      if (band === '12') return guests >= 12;
      if (band === '17') return guests >= 17;
      if (band === '18') return guests >= 18;
      return true;
    }

    function apply() {
      var band = pax ? pax.value : 'all';
      var kind = cat ? cat.value : 'all';
      var shown = 0;
      for (var i = 0; i < boats.length; i++) {
        var g = parseFloat(boats[i].getAttribute('data-guests'));
        var c = boats[i].getAttribute('data-cat') || '';
        var hit = bandOK(band, g) && (kind === 'all' || c === kind);
        boats[i].classList.toggle('is-out', !hit);
        if (hit) shown++;
      }
      if (counter) counter.textContent = t(
        shown + (shown === 1 ? ' embarcação exibida' : ' embarcações exibidas'),
        shown + (shown === 1 ? ' vessel shown' : ' vessels shown'),
        shown + (shown === 1 ? ' embarcación mostrada' : ' embarcaciones mostradas'));
      var chips = document.querySelectorAll('.chips button');
      for (var j = 0; j < chips.length; j++) {
        chips[j].setAttribute('aria-pressed', String(chips[j].getAttribute('data-filter') === kind));
      }
      return shown;
    }

    function summary() {
      var parts = [];
      if (route && route.value !== 'all') parts.push(route.options[route.selectedIndex].text);
      if (pax && pax.value !== 'all') parts.push(pax.options[pax.selectedIndex].text);
      if (date && date.value) parts.push(ddmm(date.value));
      if (cat && cat.value !== 'all') parts.push(cat.options[cat.selectedIndex].text);
      return parts.join(' · ');
    }

    card.addEventListener('change', function () {
      var shown = apply();
      if (!out) return;
      var s = summary();
      out.textContent = s
        ? s + ' — ' + shown + ' ' + t('embarcação(ões)', 'vessel(s)', 'embarcación(es)')
        : t('Escolha o roteiro, quantos convidados, a data e a categoria de casco.',
            'Choose the itinerary, how many guests, the date and the hull category.',
            'Elige la ruta, cuántos invitados, la fecha y la categoría de casco.');
    });

    if (go) {
      go.addEventListener('click', function (e) {
        e.preventDefault();
        apply();
        var target = document.querySelector('#frota');
        if (target) target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        var svc = selectedServices();
        var msg = t(
          'Olá, Magic Boats! Quero verificar disponibilidade.\n' + (summary() || '[ainda escolhendo]')
            + (svc ? '\nServiços a bordo: ' + svc : ''),
          'Hello, Magic Boats! I would like to check availability.\n' + (summary() || '[still choosing]')
            + (svc ? '\nOnboard services: ' + svc : ''),
          '¡Hola, Magic Boats! Quiero consultar disponibilidad.\n' + (summary() || '[aún eligiendo]')
            + (svc ? '\nServicios a bordo: ' + svc : ''));
        window.open(waHref(msg), '_blank', 'noopener');
      });
    }

    var bar = document.querySelector('.chips');
    if (bar) {
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('button') : null;
        if (!btn) return;
        if (cat) cat.value = btn.getAttribute('data-filter');
        apply();
      });
    }

    apply();
  }

  /* ---------------------------------------------- onboard service attach
     The ten services are high-margin attach revenue currently living in a nav
     dropdown. Ticking one carries it into the enquiry — and into the WhatsApp
     message the finder composes.                                             */
  function selectedServices() {
    var picks = [], boxes = document.querySelectorAll('.svc input:checked');
    for (var i = 0; i < boxes.length; i++) picks.push(boxes[i].value);
    return picks.join(', ');
  }
  function services() {
    var host = document.querySelector('.svcs');
    if (!host) return;
    host.addEventListener('change', function () {
      var out = document.querySelector('[data-svc-out]');
      if (!out) return;
      var s = selectedServices();
      out.textContent = s
        ? t('Selecionados: ', 'Selected: ', 'Seleccionados: ') + s
        : t('Nenhum serviço selecionado ainda.', 'No service selected yet.', 'Ningún servicio seleccionado todavía.');
    });
  }

  /* ------------------------------------------------------------------ forms */
  function forms() {
    var all = document.querySelectorAll('form[data-mock]');
    for (var i = 0; i < all.length; i++) {
      (function (f) {
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          var ok = f.querySelector('input[type="checkbox"][data-consent]');
          if (ok && !ok.checked) {
            window.alert(t('Marque a caixa de consentimento para podermos responder.',
                           'Please tick the consent box so we can reply.',
                           'Marca la casilla de consentimiento para poder responder.'));
            return;
          }
          window.alert(t(
            'MOCKUP — nada foi enviado e nada foi armazenado.\n\nNo site publicado esta solicitação vai '
              + 'para um endpoint com registro de consentimento e abre a conversa no WhatsApp. '
              + 'O prazo de resposta precisa ser confirmado. [CONFIRM SLA]',
            'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this request goes to a '
              + 'consent-logged endpoint and opens the WhatsApp conversation. The response time still needs '
              + 'confirming. [CONFIRM SLA]',
            'MOCKUP — no se envió ni se almacenó nada.\n\nEn el sitio publicado esta solicitud va a un '
              + 'endpoint con registro de consentimiento y abre la conversación en WhatsApp. El plazo de '
              + 'respuesta debe confirmarse. [CONFIRM SLA]'));
        });
      })(all[i]);
    }
  }

  /* ============================================================ LGPD gate
     Magic Boats already runs a granular consent manager — the best starting
     position of any lead in this batch. The one change is the default: their
     Google consent mode currently initialises to `granted` BEFORE the visitor
     chooses. Here everything non-essential starts denied and only the
     consented branch may load a tag.
     ====================================================================== */
  var KEY = 'magicboats_lgpd_v1';
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function saveConsent(o) { try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      /* Consented branch. GTM / analytics is injected HERE and nowhere else,
         with Consent Mode defaulting to denied rather than granted. */
    }
    if (c.marketing) {
      /* The map embed and any social or Tripadvisor widget are third-party data
         transfers and upgrade from a static rendering only inside this branch. */
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
    header(); reveals(); parallax(); countup(); finder(); services(); forms(); cookies(); wireWhatsApp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

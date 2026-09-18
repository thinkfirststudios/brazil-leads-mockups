/* ===========================================================================
   LITUÂNIA TURISMO SC — shared behaviour for /, /en/ and /es/
   Spec mockup. No framework, no build step, no modules, no fetch().

   Their live site drives four languages through a HIDDEN Google Translate
   widget (trocarIdioma('en'|'es'|'fr'|'pt') against a hidden
   google_translate_element). That pattern is gone from this build entirely:
   there is no DOM text swapping anywhere in this file. Language comes from
   real parallel URL trees, and this script only reads which one it is in.
   =========================================================================== */
(function () {
  'use strict';

  var LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
  var EN = LANG.indexOf('en') === 0;
  var ES = LANG.indexOf('es') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t(pt, en, es) { return ES ? es : (EN ? en : pt); }

  /* =========================================================================
     CONTACT — this is the one lead in the batch where the number IS published,
     twice, in their own footer. It is used as published and nothing else is
     added: no second line, no landline, no address.
     ====================================================================== */
  var WA_NUMBER = '5548984365684';                  // wa.me/5548984365684, from their footer
  var WA_DISPLAY = '(48) 98436-5684';
  var EMAIL = 'contato@lituaniaturismosc.com.br';

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = custom && custom.length > 1 ? custom : t(
          'Olá! Vim pelo site da Lituânia Turismo SC e gostaria de mais informações.',
          'Hello! I came from the Lituânia Turismo SC website and would like more information.',
          '¡Hola! Vengo del sitio de Lituânia Turismo SC y me gustaría más información.');
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
     Guards on isNaN so a [CONFIRM] can never be animated into a number. Note
     that on this build there is almost nothing to count: they publish no fleet
     size, no seat count, no passenger total and no years in business, and none
     of those has been invented to give the animation something to do.        */
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

  /* --------------------------------------------------- departure board filter
     Keyboard-operable, announces its result count, filters both the board rows
     and the package cards from the same control.                             */
  function filters() {
    var bar = document.querySelector('.filters');
    if (!bar) return;
    var out = document.querySelector('.count');
    var rows = document.querySelectorAll('.board li');
    var cards = document.querySelectorAll('.cards .card');

    function hits(el, key) {
      var tags = (el.getAttribute('data-tags') || '').split(' ');
      return key === 'all' || tags.indexOf(key) > -1;
    }
    function apply(key) {
      var shown = 0, i;
      for (i = 0; i < rows.length; i++) {
        var ok = hits(rows[i], key);
        rows[i].classList.toggle('is-out', !ok);
        if (ok) shown++;
      }
      for (i = 0; i < cards.length; i++) cards[i].classList.toggle('is-out', !hits(cards[i], key));
      if (out) out.textContent = t(
        shown + (shown === 1 ? ' saída exibida' : ' saídas exibidas'),
        shown + (shown === 1 ? ' departure shown' : ' departures shown'),
        shown + (shown === 1 ? ' salida mostrada' : ' salidas mostradas'));
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

  /* ------------------------------------------------------- city tour planner
     Picks stops and a duration band, then carries the selection into a
     pre-filled WhatsApp message. It quotes nothing: they publish no prices and
     none is invented here.                                                    */
  function planner() {
    var box = document.querySelector('.planner');
    if (!box) return;
    var out = box.querySelector('.planner__out');
    var go = box.querySelector('[data-planner-go]');

    function selected() {
      var picks = [], boxes = box.querySelectorAll('.stops input:checked');
      for (var i = 0; i < boxes.length; i++) picks.push(boxes[i].value);
      return picks;
    }
    function duration() {
      var d = box.querySelector('#tour-dur');
      return d ? d.value : '';
    }
    function render() {
      var picks = selected();
      if (!out) return;
      out.innerHTML = picks.length
        ? '<strong>' + t('Roteiro montado', 'Your route', 'Tu ruta') + ':</strong> '
          + picks.join(' · ') + ' — ' + duration()
        : t('Selecione as paradas que você quer no roteiro.',
            'Choose the stops you want on the route.',
            'Elige las paradas que quieres en la ruta.');
    }
    box.addEventListener('change', render);
    render();

    if (go) {
      go.addEventListener('click', function (e) {
        e.preventDefault();
        var picks = selected();
        if (!picks.length) {
          window.alert(t('Escolha pelo menos uma parada.',
                         'Pick at least one stop.',
                         'Elige al menos una parada.'));
          return;
        }
        var msg = t(
          'Olá! Quero um City Tour privativo em Florianópolis.\nParadas: ' + picks.join(', ')
            + '\nDuração: ' + duration() + '\nData pretendida: \nPessoas: ',
          'Hello! I would like a private City Tour in Florianópolis.\nStops: ' + picks.join(', ')
            + '\nDuration: ' + duration() + '\nPreferred date: \nPassengers: ',
          '¡Hola! Quiero un City Tour privado en Florianópolis.\nParadas: ' + picks.join(', ')
            + '\nDuración: ' + duration() + '\nFecha deseada: \nPasajeros: ');
        window.open(waHref(msg), '_blank', 'noopener');
      });
    }
  }

  /* ------------------------------------------------------------ quote forms */
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
              + 'para um endpoint com registro de consentimento e para ' + EMAIL + '.',
            'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this request goes to a '
              + 'consent-logged endpoint and to ' + EMAIL + '.',
            'MOCKUP — no se envió ni se almacenó nada.\n\nEn el sitio publicado esta solicitud va a un '
              + 'endpoint con registro de consentimiento y a ' + EMAIL + '.'));
        });
      })(all[i]);
    }

    /* the contact form changes its own fields between the two businesses */
    var sw = document.querySelector('.modeswitch');
    if (!sw) return;
    var panes = document.querySelectorAll('[data-pane]');
    sw.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('button') : null;
      if (!btn) return;
      var key = btn.getAttribute('data-mode');
      var bs = sw.querySelectorAll('button');
      for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i] === btn));
      for (var j = 0; j < panes.length; j++) {
        panes[j].hidden = panes[j].getAttribute('data-pane') !== key;
      }
    });
    /* progressive enhancement: both panes ship visible, JS collapses one */
    for (var k = 0; k < panes.length; k++) {
      panes[k].hidden = panes[k].getAttribute('data-pane') !== 'excursao';
    }
  }

  /* ----------------------------------------------------- video click-to-load
     Their four YouTube tour videos are real, already-made content. They are
     promoted out of the footer into a proper band — but as static facades. An
     embedded YouTube player is a third-party data transfer that happens before
     anyone presses play, so nothing loads until the visitor asks AND the
     marketing consent branch is open.                                         */
  function videos() {
    var btns = document.querySelectorAll('[data-video]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        var c = readConsent();
        if (!c || !c.marketing) {
          window.alert(t(
            'O player do YouTube não carrega até você aceitar cookies de conteúdo incorporado — um embed '
              + 'do YouTube transfere dados para o Google antes mesmo de você apertar o play.\n\n'
              + 'Abra as preferências de cookies no rodapé para ligar.',
            'The YouTube player does not load until you accept embedded-content cookies — a YouTube embed '
              + 'transfers data to Google before you even press play.\n\n'
              + 'Open cookie preferences in the footer to switch it on.',
            'El reproductor de YouTube no carga hasta que aceptes cookies de contenido incrustado — un '
              + 'embed de YouTube transfiere datos a Google antes incluso de pulsar play.\n\n'
              + 'Abre las preferencias de cookies en el pie de página para activarlo.'));
          return;
        }
        window.alert(t(
          'MOCKUP — o vídeo real não está incorporado aqui.\n\nOs quatro vídeos do canal deles entram '
            + 'nesta posição como facade estática com poster e VideoObject no JSON-LD. '
            + '[CONFIRM as URLs e as durações dos vídeos]',
          'MOCKUP — the real video is not embedded here.\n\nTheir four channel videos go in this position '
            + 'as a static facade with a poster frame and VideoObject JSON-LD. '
            + '[CONFIRM the video URLs and durations]',
          'MOCKUP — el vídeo real no está incrustado aquí.\n\nLos cuatro vídeos de su canal ocupan esta '
            + 'posición como facade estática con póster y VideoObject en JSON-LD. '
            + '[CONFIRM las URL y las duraciones]'));
      });
    }
  }

  /* ============================================================ LGPD gate
     Their live site fires Google Tag Manager (GTM-MFZM4HMH) unconditionally,
     with no consent gate and no privacy or cookie policy in existence. That is
     the exact exposure this block closes: non-essential OFF by default, reject
     exactly as prominent as accept, and GTM only ever loaded from inside the
     consented branch below.
     ====================================================================== */
  var KEY = 'lituania_lgpd_v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function saveConsent(o) { try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      /* Consented branch. GTM-MFZM4HMH is injected HERE and nowhere else, with
         Consent Mode defaulting to denied. Left empty in the mockup rather than
         shipping a live container on a spec build.
         [CONFIRM they want to keep the existing container.] */
    }
    if (c.marketing) {
      /* YouTube facades may upgrade to real embeds only inside this branch. */
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
    header(); reveals(); parallax(); countup(); filters();
    planner(); forms(); videos(); cookies(); wireWhatsApp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

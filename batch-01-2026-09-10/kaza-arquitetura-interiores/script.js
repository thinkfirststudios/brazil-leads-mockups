/* ===========================================================================
   STUDIO KAZA — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().
   Language is read from <html lang>, never from a URL guess.
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------------
     CONTACT SWITCHES — the single place any real contact detail may enter.

     Their contact page renders the phone number as the string "47-" and stops.
     There is no wa.me link anywhere on studiokaza.arq.br and no social profile
     in the served markup. So we have NO number. It is not guessed, not
     reconstructed from the area code, and not borrowed from a directory.

     Set WA_NUMBER to the confirmed line in international format (no +, no
     spaces, e.g. '5547999999999') and every WhatsApp affordance on the site
     switches itself on. Until then they render disabled and explain why.
     ---------------------------------------------------------------------- */
  var WA_NUMBER = null;                       // [CONFIRM full number + is it WhatsApp?]
  var EMAIL     = 'contato@studiokaza.arq.br'; // the only channel we can verify
  var PHONE     = null;                        // [CONFIRM] — site renders only "47-"

  var WA_TEXT = EN
    ? 'Hello! I came from the Studio Kaza website and I would like to talk about a project.'
    : 'Olá! Vim pelo site do Studio Kaza e gostaria de falar sobre um projeto.';

  var WA_UNSET = EN
    ? 'No WhatsApp number is published on studiokaza.arq.br. Their contact page renders the '
      + 'phone as "47-" and nothing more, and there is no wa.me link anywhere on the site.\n\n'
      + 'This mockup will not invent one. E-mail ' + EMAIL + ' is the only channel we can verify.'
    : 'Nenhum número de WhatsApp está publicado no studiokaza.arq.br. A página de contato '
      + 'mostra o telefone como "47-" e nada mais, e não existe link wa.me em lugar nenhum do site.\n\n'
      + 'Este mockup não vai inventar um. O e-mail ' + EMAIL + ' é o único canal que conseguimos verificar.';

  function waHref() {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
  }

  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        if (WA_NUMBER) {
          el.removeAttribute('data-unconfirmed');
          if (el.tagName === 'A') { el.href = waHref(); el.target = '_blank'; el.rel = 'noopener'; }
          else { el.addEventListener('click', function () { window.open(waHref(), '_blank', 'noopener'); }); }
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

  /* ---------------------------------------------------------------- header */
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
        hdr.classList.toggle('is-stuck', window.pageYOffset > 40);
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
        if (e.target.tagName === 'A' && nav.classList.contains('is-open')) {
          burger.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) { burger.click(); }
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
        var el = en.target;
        var idx = 0, sib = el;
        while ((sib = sib.previousElementSibling)) { if (sib.classList.contains('rv')) idx++; }
        el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* --------------------------------------------------------------- parallax */
  function parallax() {
    var img = document.querySelector('.hero__img');
    if (!img || REDUCED) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.2) img.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- countup
     Returns immediately on anything that is not a finite number, so a
     [CONFIRM] marker can never be animated up into an invented figure.       */
  function countup() {
    var els = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;                 // <- the guard that matters
      if (REDUCED) { el.textContent = String(target); return; }
      var t0 = null, dur = 1300;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
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

  /* ----------------------------------------------------------------- filter
     Keyboard-operable and it announces the result count, per the brief.      */
  function filters() {
    var bar = document.querySelector('.filters');
    var grid = document.querySelector('.grid');
    var out = document.querySelector('.count');
    if (!bar || !grid) return;

    var cards = grid.querySelectorAll('.card');

    function apply(key) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var sectors = (cards[i].getAttribute('data-sector') || '').split(' ');
        var hit = key === 'all' || sectors.indexOf(key) > -1;
        cards[i].classList.toggle('is-out', !hit);
        if (hit) shown++;
      }
      if (out) {
        out.textContent = EN
          ? shown + (shown === 1 ? ' project shown' : ' projects shown')
          : shown + (shown === 1 ? ' projeto exibido' : ' projetos exibidos');
      }
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

  /* ------------------------------------------------------------------ form */
  function form() {
    var f = document.querySelector('.form');
    if (!f) return;
    var thanks = document.querySelector('.thanks');
    if (thanks) thanks.hidden = true;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = f.querySelector('#consent');
      if (ok && !ok.checked) {
        window.alert(EN
          ? 'Please tick the consent box so we may contact you about your enquiry.'
          : 'Marque a caixa de consentimento para que possamos entrar em contato sobre a sua solicitação.');
        return;
      }
      if (thanks) { thanks.hidden = false; thanks.scrollIntoView({ block: 'nearest' }); }
      window.alert(EN
        ? 'MOCKUP — nothing was sent. No form handler is wired on a spec build.\n\n'
          + 'On the live site this posts to a consent-logged endpoint and e-mails ' + EMAIL + '.'
        : 'MOCKUP — nada foi enviado. Um build de proposta não tem handler de formulário.\n\n'
          + 'No site publicado isto vai para um endpoint com registro de consentimento e para o e-mail ' + EMAIL + '.');
    });
  }

  /* ------------------------------------------------------------- LGPD gate
     Non-essential OFF by default. Reject is exactly as prominent as accept.
     Nothing third-party — analytics, embedded broadcast video, social — is
     allowed to run outside the consented branch below.                       */
  var KEY = 'kaza_lgpd_v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); }
    catch (err) { return null; }
  }
  function saveConsent(obj) {
    try { window.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (err) {}
  }

  function applyConsent(c) {
    if (!c) return;
    if (c.analytics) {
      /* Consented branch. Nothing loads here in the mockup — on the live site
         this is where a cookieless, self-hosted analytics script is injected.
         It is deliberately empty rather than commented-out third-party code. */
    }
    if (c.marketing) {
      /* Click-to-load facades for the RECORD / SBT broadcast segments are
         upgraded to real embeds only inside this branch. [CONFIRM licences
         before any broadcaster clip is embedded at all.] */
    }
  }

  function cookies() {
    var bar = document.querySelector('.ck');
    if (!bar) return;
    var existing = readConsent();
    if (existing) { applyConsent(existing); }
    else { window.setTimeout(function () { bar.classList.add('is-on'); }, 700); }

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

  /* ------------------------------------------------------- press video gate
     The TV appearances are the obvious candidate for an embed. They are also
     licensed broadcast material. So there is no player here at all — the
     control explains what would have to be true before one could exist.      */
  function pressVideo() {
    var els = document.querySelectorAll('[data-video]');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('click', function (e) {
        e.preventDefault();
        window.alert(EN
          ? 'No broadcast clip is embedded on this mockup.\n\n'
            + 'RECORD and SBT segments are copyrighted works and the channel marks are '
            + 'trademarks. A clip can only appear here with a written licence, and even '
            + 'then it loads behind the cookie consent gate as a click-to-load facade.'
          : 'Nenhum trecho de TV está incorporado neste mockup.\n\n'
            + 'As matérias da RECORD e do SBT são obras protegidas e as marcas das emissoras '
            + 'são registradas. Um vídeo só pode aparecer aqui com licença por escrito, e ainda '
            + 'assim carrega atrás do consentimento de cookies, por clique.');
      });
    }
  }

  function boot() {
    header(); reveals(); parallax(); countup(); filters();
    form(); cookies(); wireWhatsApp(); pressVideo();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

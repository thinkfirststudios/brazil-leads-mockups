/* ===========================================================================
   MARMORARIA REZENDE — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en) { return EN ? en : pt; }

  /* -------------------------------------------------------------------------
     CONTACT SWITCHES — the only place a real contact detail may enter.

     Marmoraria Rezende is Instagram-only behind a login wall. No phone, no
     WhatsApp, no e-mail, no address and no CNPJ could be retrieved. None is
     invented here. Fill these two in and every call and WhatsApp affordance on
     the site switches itself on.
     ---------------------------------------------------------------------- */
  var WA_NUMBER = null;   // [CONFIRM] e.g. '5548999999999'
  var TEL       = null;   // [CONFIRM] e.g. '+554899999999'

  var NO_CONTACT = t(
    'Nenhum telefone, WhatsApp ou e-mail está publicado para a Marmoraria Rezende. O único canal público '
      + 'é o Instagram @marmorariarezendefloripa, que fica atrás de login.\n\n'
      + 'Este mockup não vai inventar um número. Todo o fluxo de orçamento abaixo está pronto e começa a '
      + 'funcionar no instante em que o número real for informado.',
    'No phone, WhatsApp or e-mail is published for Marmoraria Rezende. The only public channel is the '
      + 'Instagram profile @marmorariarezendefloripa, which sits behind a login wall.\n\n'
      + 'This mockup will not invent a number. The whole quote flow below is built and starts working the '
      + 'moment a real number is supplied.');

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    var i;
    for (i = 0; i < wa.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : t(
          'Olá! Vim pelo site da Marmoraria Rezende e queria um orçamento de bancada.',
          'Hello! I came from the Marmoraria Rezende website and would like a countertop quote.');
        if (WA_NUMBER) {
          el.removeAttribute('data-unconfirmed');
          if (el.tagName === 'A') { el.href = waHref(msg); el.target = '_blank'; el.rel = 'noopener'; }
          else { el.addEventListener('click', function () { window.open(waHref(msg), '_blank', 'noopener'); }); }
        } else {
          el.setAttribute('data-unconfirmed', '');
          if (el.tagName === 'A') { el.removeAttribute('href'); el.setAttribute('role', 'button'); el.tabIndex = 0; }
          el.addEventListener('click', function (e) { e.preventDefault(); window.alert(NO_CONTACT); });
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.alert(NO_CONTACT); }
          });
        }
      })(wa[i]);
    }

    var tels = document.querySelectorAll('[data-tel]');
    for (i = 0; i < tels.length; i++) {
      (function (el) {
        if (TEL) {
          el.removeAttribute('data-unconfirmed');
          if (el.tagName === 'A') el.href = 'tel:' + TEL;
        } else {
          el.setAttribute('data-unconfirmed', '');
          if (el.tagName === 'A') { el.removeAttribute('href'); el.setAttribute('role', 'button'); el.tabIndex = 0; }
          el.addEventListener('click', function (e) { e.preventDefault(); window.alert(NO_CONTACT); });
        }
      })(tels[i]);
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
     Guards on isNaN. Nothing on this build feeds it a real number: no project
     count, no years in business and no team size is published anywhere, and
     none has been invented to give the animation something to do.            */
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

  /* ====================================================== THE FINISH BOARD
     The differentiator, and the pitch. A countertop buyer makes five decisions
     they have never made before — material, borda, cuba, frontão, acabamento —
     and right now none of them can be made anywhere except in a DM or standing
     in a yard. Making them legible before the visit is what shortens the quote
     cycle. The selection is carried into the WhatsApp message.

     Every OPTION here is a standard trade term, not a claim about what Rezende
     offers. [CONFIRM which of these they actually do.]
     ====================================================================== */
  function board() {
    var host = document.querySelector('.board');
    if (!host) return;
    var out = document.querySelector('.boardout');

    function picks() {
      var chosen = {}, boxes = host.querySelectorAll('input[type="radio"]:checked');
      for (var i = 0; i < boxes.length; i++) chosen[boxes[i].name] = boxes[i].value;
      return chosen;
    }
    function line() {
      var p = picks(), parts = [];
      if (p.material) parts.push(t('Material: ', 'Material: ') + p.material);
      if (p.borda) parts.push(t('Borda: ', 'Edge: ') + p.borda);
      if (p.cuba) parts.push(t('Cuba: ', 'Sink: ') + p.cuba);
      if (p.frontao) parts.push(t('Frontão: ', 'Backsplash: ') + p.frontao);
      if (p.acabamento) parts.push(t('Acabamento: ', 'Finish: ') + p.acabamento);
      return parts;
    }
    function render() {
      if (!out) return;
      var parts = line();
      out.innerHTML = parts.length
        ? '<strong>' + t('Sua especificação', 'Your specification') + ':</strong> ' + parts.join(' · ')
        : t('Escolha material, borda, cuba, frontão e acabamento. A escolha vai junto na mensagem — e o '
            + 'orçamento começa três passos à frente.',
            'Choose the material, edge, sink, backsplash and finish. Your choices travel with the message — '
            + 'and the quote starts three steps further along.');
    }
    host.addEventListener('change', render);
    render();

    var go = document.querySelector('[data-board-go]');
    if (go) {
      go.setAttribute('data-wa', t(
        'Olá! Quero um orçamento de bancada.\n', 'Hello! I would like a countertop quote.\n'));
      go.addEventListener('click', function () {
        var parts = line();
        var msg = t('Olá! Quero um orçamento de bancada.\n', 'Hello! I would like a countertop quote.\n')
          + (parts.length ? parts.join('\n') : t('[ainda escolhendo os acabamentos]', '[still choosing the finishes]'));
        go.setAttribute('data-wa', msg);
        if (WA_NUMBER) { go.href = waHref(msg); }
      });
    }
  }

  /* ------------------------------------------------------------------- FAQ
     Ships fully expanded in the HTML; JS collapses it. Without JS the answers
     are all readable, which is the point of progressive enhancement.        */
  function faq() {
    var items = document.querySelectorAll('.faq li');
    for (var i = 0; i < items.length; i++) {
      (function (li, first) {
        var btn = li.querySelector('button');
        var ans = li.querySelector('.a');
        if (!btn || !ans) return;
        ans.hidden = !first;
        btn.setAttribute('aria-expanded', String(!!first));
        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!open));
          ans.hidden = open;
        });
      })(items[i], i === 0);
    }
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
                           'Please tick the consent box so we can reply.'));
            return;
          }
          window.alert(t(
            'MOCKUP — nada foi enviado e nada foi armazenado.\n\nNo site publicado esta solicitação vai '
              + 'para um endpoint com registro de consentimento e abre a conversa no WhatsApp.',
            'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this request goes to a '
              + 'consent-logged endpoint and opens the WhatsApp conversation.'));
        });
      })(all[i]);
    }
  }

  /* ------------------------------------------------------------- LGPD gate */
  var KEY = 'rezende_lgpd_v1';
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
      /* The Instagram embed is a third-party data transfer and upgrades from a
         plain link only inside this branch. Note that the service-area map on
         this build is DRAWN, not an embedded Google Map, so it costs nothing
         and transfers nothing either way. */
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
    header(); reveals(); parallax(); countup(); board(); faq(); forms(); cookies(); wireContacts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

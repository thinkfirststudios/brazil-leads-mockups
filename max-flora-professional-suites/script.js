/* ===========================================================================
   MAX & FLORA PROFESSIONAL SUITES — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().

   ⚠️ Nothing in this file, or anywhere in this build, is carried over from
   maxfloracenter.com.br. That site is compromised — injected SEO spam plus
   "Hacked by HZ grup" posts from 2019 — and a rebuild starts clean: no theme,
   no plugins, no uploads, no database, no user accounts, nothing.
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en) { return EN ? en : pt; }

  /* -------------------------------------------------------------------------
     CONTACT.
     The phone and the e-mail ARE published on their site and are used exactly
     as published. No WhatsApp number is published anywhere, and none is
     invented — set WA_NUMBER and every WhatsApp affordance switches on.
     ---------------------------------------------------------------------- */
  var PHONE_DISPLAY = '(48) 3234-8482';
  var PHONE_TEL = '+554832348482';
  var EMAIL = 'atendimento@maxfloracenter.com.br';
  var WA_NUMBER = null;                              // [CONFIRM] — none published

  var NO_WA = t(
    'Nenhum número de WhatsApp está publicado para o Max & Flora. O site atual publica apenas o telefone '
      + '(48) 3234-8482 e o e-mail atendimento@maxfloracenter.com.br.\n\n'
      + 'Este mockup não inventa um número. Todo o fluxo de locação abaixo está pronto e começa a funcionar '
      + 'no instante em que um número real for informado — e vale notar que um prospecto de locação e um '
      + 'visitante do shopping hoje dividem a mesma caixa de entrada.',
    'No WhatsApp number is published for Max & Flora. Their current site publishes only the phone number '
      + '(48) 3234-8482 and the address atendimento@maxfloracenter.com.br.\n\n'
      + 'This mockup does not invent one. The whole leasing flow below is built and starts working the '
      + 'moment a real number is supplied — and it is worth noting that a leasing prospect and a shopper '
      + 'currently share one inbox.');

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < wa.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : t(
          'Olá! Vim pelo site do Max & Flora e queria informações sobre uma sala.',
          'Hello! I came from the Max & Flora website and would like information about a suite.');
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
      })(wa[i]);
    }
    /* the phone is real and published, so it is simply wired */
    var tels = document.querySelectorAll('[data-tel]');
    for (var j = 0; j < tels.length; j++) {
      if (tels[j].tagName === 'A') tels[j].href = 'tel:' + PHONE_TEL;
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
        el.style.transitionDelay = Math.min(idx, 5) * 85 + 'ms';
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
     The stat row carries the building's REAL published figures — 148 salas,
     2 torres, 34 lojas, 64 vagas, 18.957,37 m², since 2010 — reproduced
     exactly as their own /o-shopping/ page states them. The guard below still
     returns on anything non-numeric, and the m² figure is deliberately NOT
     animated, because rounding 18.957,37 up through an animation would be a
     restatement of a published measurement.                                  */
  function countup() {
    var els = document.querySelectorAll('[data-count]');
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (REDUCED) { el.textContent = String(target); return; }
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1100, 1);
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

  /* ==================================================== THE LEASING SURFACE
     The page that does not exist today. 148 suites across two towers and not
     one of them is marketed anywhere.

     Every value in the table is a bordered [CONFIRM] chip, because nothing is
     published: no availability, no floor plan, no unit size, no rate and no
     leasing contact. The emptiness is the pitch, not a gap in the mockup.

     [CONFIRM the complete suite inventory: torre, andar, sala nº, m²,
      configuração, disponibilidade and valor for all 148 units — and state
      explicitly what the figure covers: aluguel, condomínio, IPTU or total.]
     ====================================================================== */
  function suites() {
    var host = document.querySelector('table.units');
    if (!host) return;
    var rows = host.querySelectorAll('tbody tr');
    var out = document.querySelector('.count');
    var sel = document.querySelectorAll('.filters select');

    function apply() {
      var want = {};
      for (var i = 0; i < sel.length; i++) {
        var k = sel[i].getAttribute('data-f');
        if (k && sel[i].value !== 'all') want[k] = sel[i].value;
      }
      var shown = 0;
      for (var r = 0; r < rows.length; r++) {
        var ok = true;
        for (var key in want) {
          if (!Object.prototype.hasOwnProperty.call(want, key)) continue;
          if ((rows[r].getAttribute('data-' + key) || '') !== want[key]) { ok = false; break; }
        }
        rows[r].classList.toggle('is-out', !ok);
        if (ok) shown++;
      }
      /* the filter announces its result count to assistive tech */
      if (out) out.textContent = t(
        shown + (shown === 1 ? ' sala exibida' : ' salas exibidas'),
        shown + (shown === 1 ? ' suite shown' : ' suites shown'));
    }
    for (var i = 0; i < sel.length; i++) sel[i].addEventListener('change', apply);
    apply();
  }

  /* ================================================= THE PROFESSIONAL DIRECTORY
     The directory that should exist and does not. It is simultaneously a
     service to patients, a retention benefit for tenants and the single
     largest untapped SEO asset on the property.

     Every entry is a [CONFIRM]. Nothing is written on a professional's behalf:
     a directory listing a doctor, dentist, psychologist, lawyer or architect
     touches CFM/CRM, CFO/CRO, CFP/CRP, OAB and CAU advertising rules, several
     of which require the registration number to appear beside the name. NO
     REGISTRATION NUMBER IS INVENTED, and no promotional copy or outcome claim
     is written for anyone. The directory publishes only what each tenant
     supplies and approves. [CONFIRM the process, and each tenant's documented
     legal basis plus a route to correct or remove their entry.]
     ====================================================================== */
  function directory() {
    var bar = document.querySelector('.chips');
    var grid = document.querySelector('.dir');
    if (!bar || !grid) return;
    var cards = grid.querySelectorAll('.pro');
    var out = document.querySelector('.dircount');

    function apply(key) {
      var shown = 0;
      for (var i = 0; i < cards.length; i++) {
        var cat = cards[i].getAttribute('data-cat') || '';
        var hit = key === 'all' || cat === key;
        cards[i].classList.toggle('is-out', !hit);
        if (hit) shown++;
      }
      if (out) out.textContent = t(
        shown + (shown === 1 ? ' profissional exibido' : ' profissionais exibidos'),
        shown + (shown === 1 ? ' professional shown' : ' professionals shown'));
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

  /* ------------------------------------------------------------------- FAQ */
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

  /* ------------------------------------------------------------------ forms
     TWO SEPARATE ROUTED FORMS. A leasing prospect and a shopper are not the
     same enquiry and currently share one inbox — which also means two stated
     purposes and two retention rules under the LGPD.                         */
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
          var kind = f.getAttribute('data-mock');
          window.alert(t(
            'MOCKUP — nada foi enviado e nada foi armazenado.\n\nNo site publicado esta solicitação ('
              + kind + ') vai para um endpoint com registro de consentimento, com finalidade e prazo de '
              + 'retenção próprios — locação e visitante são caixas de entrada separadas.',
            'MOCKUP — nothing was sent and nothing was stored.\n\nOn the live site this request ('
              + kind + ') goes to a consent-logged endpoint with its own stated purpose and retention '
              + 'rule — leasing and visitor enquiries are separate inboxes.'));
        });
      })(all[i]);
    }
  }

  /* ------------------------------------------------------------- LGPD gate
     They currently have no cookie consent and no privacy policy at all.      */
  var KEY = 'maxflora_lgpd_v1';
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
      /* A map embed would upgrade from its static placeholder only inside this
         branch. Nothing third-party loads on this build by default. */
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
    suites(); directory(); faq(); forms(); cookies(); wireContacts();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

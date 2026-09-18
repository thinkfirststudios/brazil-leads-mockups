/* ===========================================================================
   OCEAN RIDERS KITE SURF — shared behaviour for / and /en/
   Spec mockup. No framework, no build step, no modules, no fetch().
   =========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function t(pt, en) { return EN ? en : pt; }

  /* -------------------------------------------------------------------------
     CONTACT SWITCHES.

     Ocean Riders has 14,000 Instagram followers and no website. Their profile
     sits behind a login wall and no phone, WhatsApp or e-mail was readable.
     None is invented here — a placeholder number on a live site could dial a
     stranger. Set WA_NUMBER and every booking path switches itself on.
     ---------------------------------------------------------------------- */
  var WA_NUMBER = null;                    // [CONFIRM]
  var EMAIL = null;                        // [CONFIRM]
  var IG = 'https://www.instagram.com/oceanriderskitesurf/';

  var NO_WA = t(
    'Nenhum número de WhatsApp, telefone ou e-mail está publicado para a Ocean Riders. O perfil no '
      + 'Instagram (@oceanriderskitesurf) fica atrás de login e o cartão público não traz contato.\n\n'
      + 'Este mockup não inventa um número — um número de exemplo num site publicado liga para a casa de '
      + 'um desconhecido. Todo o fluxo de reserva abaixo está pronto e começa a funcionar no instante em '
      + 'que o número real for informado.',
    'No WhatsApp number, phone or e-mail is published for Ocean Riders. Their Instagram profile '
      + '(@oceanriderskitesurf) sits behind a login wall and the public card carries no contact detail.\n\n'
      + 'This mockup does not invent one — a placeholder number on a live site dials a stranger. The whole '
      + 'booking flow below is built and starts working the moment a real number is supplied.');

  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function wireWhatsApp() {
    var nodes = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < nodes.length; i++) {
      (function (el) {
        var custom = el.getAttribute('data-wa');
        var msg = (custom && custom.length > 1) ? custom : t(
          'Olá! Vim pelo site da Ocean Riders e queria informações sobre as aulas de kite.',
          'Hello! I came from the Ocean Riders website and would like details of the kite lessons.');
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

  /* --------------------------------------------------------------- reveals
     The diagonal wipe. Under prefers-reduced-motion every element ships in
     its static end state rather than animating.                             */
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
        if (y < window.innerHeight * 1.2) img.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------- countup
     Guards on isNaN — which on this build means it never runs at all, and
     that is the point. The four hero stats (anos ensinando · alunos formados ·
     instrutores certificados · horas até velejar sozinho) are the four numbers
     a prospective student wants, and not one of them exists anywhere public.
     They render as bordered blanks rather than animating up to a fiction.    */
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

  /* =========================================================================
     THE BOOKING CONFIGURATOR.

     curso → data → nº de alunos → a composed WhatsApp message.

     It deliberately does NOT fake availability, a calendar sync, an inventory
     or a price. There is no published price list to draw on, and a plausible
     figure in a price field would be worse than an empty one. The result panel
     says what it will send and nothing more.
     ====================================================================== */
  function configurator() {
    var box = document.querySelector('.config');
    if (!box) return;
    var course = box.querySelector('#c-curso');
    var date = box.querySelector('#c-data');
    var pax = box.querySelector('#c-alunos');
    var out = box.querySelector('.config__out');
    var go = box.querySelector('[data-config-go]');

    if (date) {
      var n = new Date();
      var two = function (x) { return (x < 10 ? '0' : '') + x; };
      date.min = n.getFullYear() + '-' + two(n.getMonth() + 1) + '-' + two(n.getDate());
    }
    function ddmm(v) {
      if (!v) return '';
      var p = v.split('-');
      return p[2] + '/' + p[1];             /* DD/MM, always */
    }
    function summary() {
      var parts = [];
      if (course && course.value) parts.push(course.options[course.selectedIndex].text);
      if (date && date.value) parts.push(ddmm(date.value));
      if (pax && pax.value) parts.push(pax.value + ' ' + t('aluno(s)', 'student(s)'));
      return parts.join(' · ');
    }
    function render() {
      if (!out) return;
      var s = summary();
      out.textContent = s
        ? t('Vai enviar: ', 'This will send: ') + s
          + t(' — a escola confirma disponibilidade e valor por WhatsApp.',
              ' — the school confirms availability and price over WhatsApp.')
        : t('Escolha o curso, a data e quantos alunos. Isto não consulta agenda nem mostra preço: monta a '
            + 'mensagem e abre o WhatsApp.',
            'Choose the course, the date and how many students. This checks no calendar and shows no price: '
            + 'it composes the message and opens WhatsApp.');
    }
    box.addEventListener('change', render);
    render();

    if (go) {
      go.addEventListener('click', function () {
        var msg = t(
          'Olá! Quero reservar uma aula de kite.\n' + (summary() || '[ainda escolhendo]')
            + '\nNome: \nNível atual: ',
          'Hello! I would like to book a kite lesson.\n' + (summary() || '[still choosing]')
            + '\nName: \nCurrent level: ');
        go.setAttribute('data-wa', msg);
        if (WA_NUMBER) go.href = waHref(msg);
      });
    }
  }

  /* ------------------------------------------------------------------- FAQ
     This accordion doubles as the intake questionnaire handed to the client —
     it is deliberately the same list as the "needed if they sign" checklist.
     Ships fully expanded; JS collapses it.                                  */
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
            'MOCKUP — nada foi enviado e nada foi armazenado.\n\nImportante: o formulário de declaração '
              + 'médica NÃO é este. Dado de saúde é dado pessoal sensível pelo art. 11 da LGPD e exige '
              + 'consentimento específico e destacado, além de um regime de acesso e retenção mais estrito. '
              + 'Ele não pode ser um campo de site que cai numa caixa de e-mail.',
            'MOCKUP — nothing was sent and nothing was stored.\n\nImportant: the medical disclosure form is '
              + 'NOT this one. Health data is sensitive personal data under LGPD art. 11 and needs specific, '
              + 'separate, explicit consent plus a stricter access and retention regime. It cannot be a plain '
              + 'web field feeding an inbox.'));
        });
      })(all[i]);
    }
  }

  /* ------------------------------------------------------------- LGPD gate */
  var KEY = 'oceanriders_lgpd_v1';
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
      /* An Instagram embed would upgrade from the plain linked grid only
         inside this branch. Note that no live wind feed is wired anywhere on
         this build: the wind strip and the season rail are honest [CONFIRM]
         placeholders, never third-party data presented as theirs. */
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
    configurator(); faq(); forms(); cookies(); wireWhatsApp();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

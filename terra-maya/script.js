/* ==========================================================================
   Terra Maya - spec mockup behaviour
   STATUS: LEAD, not signed. Nothing here is deployed.

   WHY THERE IS NO WHATSAPP NUMBER IN THIS FILE.

   A number does circulate for this business - (48) 99164-5621 - but it
   comes from a third-party business directory, not from Terra Maya. A
   directory is not a source: it is a copy of a copy, and this one sits
   alongside an address and a website that are both out of date. Wiring a
   scraped number into a live button is how a prospect finds out you put
   the wrong number on their site.

   So WA_NUMBER stays null, every WhatsApp control is fully built, and
   clicking one names the candidate number and asks for confirmation.

   THE DOMAIN SITUATION, WHICH THE SITE ITSELF TALKS ABOUT.
   terramayacosmetica.com.br - the address in the press coverage and in
   every directory listing - does not resolve. NXDOMAIN. A separate shop
   exists at terramaya.com.br, and whether it belongs to this business is
   unconfirmed. Both facts are surfaced on the page rather than tidied
   away, because between them they are the whole first conversation.
   ========================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = null;                 /* [CONFIRM] - see the note above */
  var WA_CANDIDATE = '(48) 99164-5621'; /* found on a directory, NOT verified */

  var EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  }

  /* ---------------------------------------------------------- WhatsApp */

  var MISSING = t(
    'Este mockup nao tem numero de WhatsApp ligado - de proposito.\n\n' +
    'Um numero circula em diretorio de empresas: ' + WA_CANDIDATE + '. Ele nao ' +
    'veio da Terra Maya, veio de um agregador, e no mesmo registro o site e o ' +
    'endereco estao desatualizados.\n\n' +
    'Nenhum numero raspado de diretorio entra num botao ao vivo sem confirmacao. ' +
    '[CONFIRM o numero comercial.] Assim que voce confirmar, este botao abre a ' +
    'conversa com a mensagem ja escrita:\n\n',
    'This mockup has no WhatsApp number wired in - deliberately.\n\n' +
    'A number does circulate on a business directory: ' + WA_CANDIDATE + '. It did ' +
    'not come from Terra Maya, it came from an aggregator, and in that same record ' +
    'the website and the address are both out of date.\n\n' +
    'No number scraped from a directory goes into a live button without ' +
    'confirmation. [CONFIRM the business number.] Once you do, this button opens ' +
    'the chat with the message already written:\n\n');

  function wire(el) {
    var msg = el.getAttribute('data-wa');
    if (!msg) { return; }
    if (WA_NUMBER) {
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' +
        encodeURIComponent(msg));
      el.setAttribute('rel', 'noopener');
      return;
    }
    el.setAttribute('href', '#contato');
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.alert(MISSING + '"' + msg + '"');
    });
  }

  $$('[data-wa]').forEach(wire);

  /* --------------------------------------------------- sticky header */

  var head = $('.site-head');
  if (head) {
    var stuck = false;
    var onScroll = function () {
      var s = window.pageYOffset > 12;
      if (s !== stuck) { stuck = s; head.classList.toggle('is-stuck', s); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var burger = $('.burger');
  var nav = $('.site-nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        burger.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        burger.focus();
      }
    });
  }

  /* ---------------------------------------------------- scroll reveal */

  var revs = $$('.rev');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        var el = en.target;
        var sibs = el.parentNode ? $$('.rev', el.parentNode) : [];
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 90 : 0) + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revs.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------- hero parallax */

  var heroImg = $('.hero-media img');
  if (heroImg && !reduce) {
    var ticking = false;
    var park = function () {
      var y = window.pageYOffset;
      if (y < window.innerHeight * 1.2) {
        heroImg.style.transform = 'scale(1.06) translate3d(0,' + (y * 0.15) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(park); }
    }, { passive: true });
  }

  /* -------------------------------------------------------- count-ups */
  /* The only numbers anyone has published about this business come from a
     2020 press article - "40+ brands", "99% vegan". Five and a half years
     is a long time in retail and neither is sourced from the company, so
     neither is animated here. The engine returns on anything that is not
     a number, so a [CONFIRM] never turns into a figure. */

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) { return; }
    var dur = 1200, t0 = null;
    var step = function (ts) {
      if (t0 === null) { t0 = ts; }
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) { window.requestAnimationFrame(step); }
    };
    window.requestAnimationFrame(step);
  }

  var counts = $$('[data-count]');
  if (counts.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counts.forEach(countUp);
    } else {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counts.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ------------------------------------------------------------- forms */

  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', form);
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque o consentimento para continuar.',
                                 'Tick the consent box to continue.');
          status.style.color = '#834C2B';
        }
        return;
      }
      var missing = $$('input[required], textarea[required], select[required]', form)
        .filter(function (f) { return f.type !== 'checkbox' && !f.value.trim(); });
      if (missing.length) {
        if (status) {
          status.textContent = t('Preencha os campos obrigatorios.',
                                 'Please fill in the required fields.');
          status.style.color = '#834C2B';
        }
        missing[0].focus();
        return;
      }
      if (status) {
        status.textContent = t(
          'Demonstracao: nada foi enviado. Este mockup nao tem servidor nem caixa ' +
          'de entrada configurada. [CONFIRM o e-mail que deve receber isto]',
          'Demonstration: nothing was sent. This mockup has no server and no ' +
          'configured inbox. [CONFIRM the address that should receive this]');
        status.style.color = '#2E3B30';
      }
      form.reset();
    });
  });

  /* ---------------------------------------------------------- LGPD bar */

  var KEY = 'tm-lgpd-v1';
  var bar = $('#lgpd');

  function stored() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); }
    catch (err) { return null; }
  }
  function applyConsent(v) {
    if (v && v.analytics) {
      /* Analytics would load here. Nothing loads in this mockup. [CONFIRM] */
    }
    if (v && v.marketing) {
      /* A shop this size usually ends up with a Meta pixel and a shopping
         feed. Both are marketing cookies and both wait for the opt-in. */
    }
  }
  function save(v) {
    try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch (err) { /* private */ }
    applyConsent(v);
  }

  if (bar) {
    var prefs = $('#lgpd-prefs');
    var openPrefs = $('#lgpd-open-prefs');
    var ana = $('#ck-analytics');
    var mkt = $('#ck-marketing');
    var current = stored();

    if (!current) {
      window.setTimeout(function () {
        bar.setAttribute('aria-hidden', 'false');
        bar.classList.add('is-open');
      }, 700);
    } else {
      applyConsent(current);
    }

    var close = function () {
      bar.classList.remove('is-open');
      bar.setAttribute('aria-hidden', 'true');
    };

    if (openPrefs && prefs) {
      openPrefs.addEventListener('click', function () {
        var open = openPrefs.getAttribute('aria-expanded') === 'true';
        openPrefs.setAttribute('aria-expanded', open ? 'false' : 'true');
        prefs.hidden = open;
      });
    }
    var accept = $('#lgpd-accept');
    var reject = $('#lgpd-reject');
    var saveBtn = $('#lgpd-save');
    if (accept) {
      accept.addEventListener('click', function () {
        save({ essential: true, analytics: true, marketing: true, ts: Date.now() });
        close();
      });
    }
    if (reject) {
      reject.addEventListener('click', function () {
        save({ essential: true, analytics: false, marketing: false, ts: Date.now() });
        close();
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        save({
          essential: true,
          analytics: !!(ana && ana.checked),
          marketing: !!(mkt && mkt.checked),
          ts: Date.now()
        });
        close();
      });
    }
    $$('[data-lgpd-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var c = stored();
        if (ana) { ana.checked = !!(c && c.analytics); }
        if (mkt) { mkt.checked = !!(c && c.marketing); }
        if (prefs && openPrefs) {
          prefs.hidden = false;
          openPrefs.setAttribute('aria-expanded', 'true');
        }
        bar.setAttribute('aria-hidden', 'false');
        bar.classList.add('is-open');
      });
    });
  }
}());

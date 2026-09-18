/* ==========================================================================
   Wood Art Marcenaria - spec mockup behaviour
   STATUS: LEAD, not signed. Nothing here is deployed.

   THE MOST IMPORTANT LINE IN THIS FILE IS THE NEXT ONE.

   No telephone number, WhatsApp number, e-mail address or street address was
   captured for this business. The domain on the lead sheet - akilar.com.br -
   belongs to AkiLar, a third-party home-services directory out of Jaragua do
   Sul, and the strings "Wood Art" and "marcenaria" appear nowhere on it.

   So WA_NUMBER and TEL_NUMBER stay null. Every WhatsApp and click-to-call
   control on this site is fully built - the message composition, the
   per-section tracking suffix, the EN variants - and deliberately unpointed.
   Clicking one explains what is missing instead of dialling a number somebody
   invented. Fill the two constants in and the whole site starts working.
   ========================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = null;   /* [CONFIRM] - no WhatsApp number published anywhere */
  var TEL_NUMBER = null;  /* [CONFIRM] - no telephone published anywhere */

  var EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  }

  /* ---------------------------------------------------------- WhatsApp */

  function waHref(msg) {
    if (!WA_NUMBER) { return null; }
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  var MISSING = t(
    'Este mockup ainda nao tem numero de WhatsApp.\n\n' +
    'Nenhum telefone, WhatsApp ou e-mail da Wood Art Marcenaria foi encontrado. ' +
    'O dominio que estava na nossa ficha (akilar.com.br) e de um portal de ' +
    'anuncios de terceiros, nao deles.\n\n' +
    'Nenhum numero foi inventado para preencher o botao. Assim que voce ' +
    'confirmar o numero comercial, este botao abre a conversa com a mensagem ' +
    'ja escrita:\n\n',
    'This mockup has no WhatsApp number yet.\n\n' +
    'No telephone, WhatsApp or e-mail for Wood Art Marcenaria could be found. ' +
    'The domain on our lead sheet (akilar.com.br) belongs to a third-party ' +
    'listings portal, not to them.\n\n' +
    'No number was invented to fill the button. Once you confirm the business ' +
    'number, this button opens the chat with the message already written:\n\n');

  function wire(el) {
    var msg = el.getAttribute('data-wa');
    if (!msg) { return; }
    var href = waHref(msg);
    if (href) { el.setAttribute('href', href); el.setAttribute('rel', 'noopener'); return; }
    el.setAttribute('href', '#contato-wa');
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.alert(MISSING + '"' + msg + '"');
    });
  }

  function wireTel(el) {
    if (TEL_NUMBER) { el.setAttribute('href', 'tel:+' + TEL_NUMBER); return; }
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.alert(t(
        'Nenhum telefone foi capturado para a Wood Art Marcenaria, e nenhum foi ' +
        'inventado. [CONFIRM o numero comercial]',
        'No telephone number was captured for Wood Art Marcenaria, and none was ' +
        'invented. [CONFIRM the business number]'));
    });
  }

  $$('[data-wa]').forEach(wire);
  $$('[data-tel]').forEach(wireTel);

  /* ----------------------------------------------------- sticky header */

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

  /* ------------------------------------------------------ scroll reveal */

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

  /* ------------------------------------------------------ hero parallax */

  var heroImg = $('.hero-media img');
  if (heroImg && !reduce) {
    var ticking = false;
    var park = function () {
      var y = window.pageYOffset;
      if (y < window.innerHeight * 1.2) {
        heroImg.style.transform = 'scale(1.06) translate3d(0,' + (y * 0.16) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(park); }
    }, { passive: true });
  }

  /* ---------------------------------------------------------- count-ups */
  /* There is not one verified number about this business - no years in
     operation, no project count, no team size. The engine is here and
     correct; it simply returns on anything that is not a number, so a
     [CONFIRM] never animates into a figure somebody could quote back. */

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) { return; }
    var dur = 1200, t0 = null;
    var step = function (ts) {
      if (t0 === null) { t0 = ts; }
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
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

  /* ------------------------------------------- materials + finishes board */
  /* Two rows, madeiras and acabamentos, filtered by a pressed-state tab
     group. Every card's species and finish is [CONFIRM]: no timber species
     and no finish brand goes on this build until the prospect supplies
     their real list, and - for native Brazilian hardwood - until the
     legal-origin documentation (DOF/IBAMA) is confirmed. */

  var tabs = $$('.board-tabs button');
  if (tabs.length) {
    var apply = function (kind) {
      tabs.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-kind') === kind ? 'true' : 'false');
      });
      $$('.swatch').forEach(function (s) {
        var k = s.getAttribute('data-kind');
        s.hidden = !(kind === 'todos' || k === kind);
      });
    };
    tabs.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-kind')); });
    });
    apply('todos');
  }

  /* ------------------------------------------------ atelier thumb carousel */

  var stage = $('[data-stage]');
  var thumbs = $$('.thumbs button');
  if (stage && thumbs.length) {
    var show = function (btn) {
      var img = $('img', btn);
      if (!img) { return; }
      stage.src = img.getAttribute('data-full') || img.src;
      stage.alt = img.alt;
      thumbs.forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    };
    thumbs.forEach(function (b) {
      b.addEventListener('click', function () { show(b); });
    });
  }

  /* --------------------------------------------------------------- forms */
  /* No server, no endpoint, no third-party form service. Submitting shows
     what would be sent and nothing leaves the browser. */

  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', form);
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque o consentimento para continuar.',
                                 'Tick the consent box to continue.');
          status.style.color = '#A05F17';
        }
        return;
      }
      var missing = $$('input[required], textarea[required], select[required]', form)
        .filter(function (f) { return f.type !== 'checkbox' && !f.value.trim(); });
      if (missing.length) {
        if (status) {
          status.textContent = t('Preencha os campos obrigatorios.',
                                 'Please fill in the required fields.');
          status.style.color = '#A05F17';
        }
        missing[0].focus();
        return;
      }
      if (status) {
        status.textContent = t(
          'Demonstracao: nada foi enviado. Este mockup nao tem servidor nem ' +
          'destinatario configurado. [CONFIRM o e-mail que deve receber]',
          'Demonstration: nothing was sent. This mockup has no server and no ' +
          'configured recipient. [CONFIRM the address that should receive it]');
        status.style.color = '#5C6B4A';
      }
      form.reset();
    });
  });

  /* --------------------------------------------- orcamento message builder */
  /* Section 4 composes the WhatsApp message from what the visitor actually
     has to hand - a photo, a reference image, an architect's drawing, or
     just wall measurements. It never quotes, estimates or multiplies:
     no price, no lead time and no price-per-metre is published anywhere on
     this site, and none is calculated here. */

  var brief = $('#brief-builder');
  if (brief) {
    var out = $('#brief-msg', brief);
    var send = $('#brief-send', brief);
    var read = function () {
      var parts = [];
      $$('[data-field]', brief).forEach(function (f) {
        var v = (f.value || '').trim();
        if (v) { parts.push(f.getAttribute('data-field') + ': ' + v); }
      });
      var refs = $$('[data-ref]:checked', brief).map(function (c) {
        return c.getAttribute('data-ref');
      });
      if (refs.length) { parts.push(t('Tenho em maos', 'What I have') + ': ' + refs.join(', ')); }
      return parts;
    };
    var compose = function () {
      var parts = read();
      var msg = t('Ola! Quero um orcamento de marcenaria sob medida.',
                  'Hello! I would like an estimate for bespoke joinery.');
      if (parts.length) { msg += '\n' + parts.join('\n'); }
      msg += '\n' + t('(enviado pelo site - Orcamento)', '(sent from the site - Estimate)');
      if (out) {
        out.textContent = parts.length
          ? parts.join(' \u00b7 ')
          : t('Preencha o que voce ja sabe. Nada e obrigatorio.',
              'Fill in what you already know. Nothing is required.');
      }
      if (send) { send.setAttribute('data-wa', msg); }
    };
    $$('[data-field], [data-ref]', brief).forEach(function (f) {
      f.addEventListener('input', compose);
      f.addEventListener('change', compose);
    });
    compose();
    if (send) { wire(send); }
  }

  /* ------------------------------------------------------------ LGPD bar */
  /* Non-essential off by default. Reject is the same size and weight as
     accept. Nothing is pre-ticked. No tag fires before a choice is stored. */

  var KEY = 'wa-lgpd-v1';
  var bar = $('#lgpd');

  function stored() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); }
    catch (err) { return null; }
  }
  function save(v) {
    try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch (err) { /* private mode */ }
    applyConsent(v);
  }
  function applyConsent(v) {
    if (v && v.analytics) {
      /* Analytics tag would load here. Nothing is loaded in this mockup:
         no measurement ID exists yet. [CONFIRM which analytics, if any] */
    }
    if (v && v.marketing) {
      /* Remarketing / Meta pixel would load here. Same - inert on purpose. */
    }
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
        if (prefs && openPrefs) { prefs.hidden = false; openPrefs.setAttribute('aria-expanded', 'true'); }
        bar.setAttribute('aria-hidden', 'false');
        bar.classList.add('is-open');
      });
    });
  }
}());

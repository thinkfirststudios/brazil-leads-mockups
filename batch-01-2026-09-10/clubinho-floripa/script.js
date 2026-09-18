/* ==========================================================================
   Clubinho - spec mockup behaviour
   STATUS: LEAD, not signed. Nothing here is deployed.

   NO CONTACT DETAIL WAS PUBLISHED ANYWHERE. The only public surface is
   @clubinhofloripa, which serves a login wall to any server request. No
   phone, no WhatsApp, no e-mail, no unit number inside the shopping
   centre, no CNPJ. So WA_NUMBER stays null and every WhatsApp control is
   built and deliberately unpointed.

   THE ENQUIRY FORM SPLITS IN TWO, AND THAT IS THE POINT.
   An adult booking a trial class and a parent enrolling a child are not
   the same transaction under Brazilian law. LGPD art. 14 requires a
   child's personal data to be processed in their best interest, with
   specific and highlighted consent from a parent or guardian - so the
   kids' path asks for the guardian first and says why, rather than
   collecting a minor's details behind a generic tick-box.
   ========================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = null;   /* [CONFIRM] - nothing published anywhere */

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
    'Este mockup ainda nao tem numero de WhatsApp.\n\n' +
    'A unica superficie publica do Clubinho e o perfil @clubinhofloripa, que fica ' +
    'atras de login. Nenhum telefone, WhatsApp, e-mail ou numero de sala foi ' +
    'encontrado, e nenhum foi inventado.\n\n' +
    'Assim que voce confirmar o numero, este botao abre a conversa com a mensagem ' +
    'ja escrita:\n\n',
    'This mockup has no WhatsApp number yet.\n\n' +
    'The only public surface for Clubinho is the profile @clubinhofloripa, which ' +
    'sits behind a login wall. No telephone, WhatsApp, e-mail or unit number could ' +
    'be found, and none was invented.\n\n' +
    'Once you confirm the number, this button opens the chat with the message ' +
    'already written:\n\n');

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

  /* ------------------------------------------------- trial-class builder */
  /* Composes a WhatsApp message from the service and the preferred time.
     It never states a price, a schedule or a duration: none is published
     and none is guessed. */

  var trial = $('#trial-form');
  if (trial) {
    var trialSend = $('#trial-send');
    var compose = function () {
      var bits = [];
      $$('[data-tf]', trial).forEach(function (f) {
        var v = (f.value || '').trim();
        if (v) { bits.push(f.getAttribute('data-tf') + ': ' + v); }
      });
      var msg = t('Ola! Quero agendar uma aula experimental no Clubinho.',
                  'Hello! I would like to book a trial class at Clubinho.');
      if (bits.length) { msg += '\n' + bits.join('\n'); }
      msg += '\n' + t('(enviado pelo site - aula experimental)',
                      '(sent from the site - trial class)');
      if (trialSend) { trialSend.setAttribute('data-wa', msg); }
      var pv = $('#trial-preview');
      if (pv) {
        pv.textContent = bits.length ? bits.join(' \u00b7 ')
          : t('Escolha a modalidade e o melhor horario.',
              'Pick the activity and the time that suits you.');
      }
    };
    $$('[data-tf]', trial).forEach(function (f) {
      f.addEventListener('input', compose);
      f.addEventListener('change', compose);
    });
    compose();
    if (trialSend) { wire(trialSend); }
  }

  /* ------------------------------------------------- guardian consent gate */
  /* LGPD art. 14: a child's personal data is processed in their best
     interest, with specific and highlighted consent given by a parent or
     guardian. So the kids' enrolment form will not submit on a generic
     tick - it needs the guardian named, and it says so in as many words
     rather than failing silently. */

  var kids = $('#kids-form');
  if (kids) {
    kids.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', kids);
      var guardian = $('#k-resp', kids);
      var gconsent = $('#k-consent', kids);
      var say = function (msg, ok) {
        if (!status) { return; }
        status.textContent = msg;
        status.style.color = ok ? '#4A5A66' : '#6B5108';
      };
      if (!guardian || !guardian.value.trim()) {
        say(t('Informe o nome do responsavel legal. Matricula de menor de idade nao ' +
              'segue sem isso.',
              'Give the legal guardian\u2019s name. A minor\u2019s enrolment does not ' +
              'proceed without it.'), false);
        if (guardian) { guardian.focus(); }
        return;
      }
      if (gconsent && !gconsent.checked) {
        say(t('O consentimento do responsavel e obrigatorio - art. 14 da LGPD.',
              'The guardian\u2019s consent is required \u2014 LGPD art. 14.'), false);
        return;
      }
      say(t('Demonstracao: nada foi enviado e nenhum dado de menor foi guardado. Este ' +
            'mockup nao tem servidor. [CONFIRM o fluxo real de matricula e onde o ' +
            'consentimento do responsavel fica registrado]',
            'Demonstration: nothing was sent and no minor\u2019s data was stored. This ' +
            'mockup has no server. [CONFIRM the real enrolment flow and where the ' +
            'guardian\u2019s consent is recorded]'), true);
      kids.reset();
    });
  }

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
  /* Nothing countable is published: no student count, no years (the 2018
     opening date comes from a press piece, not from them), no class size.
     The engine returns on anything that is not a number. */

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
          status.style.color = '#6B5108';
        }
        return;
      }
      var missing = $$('input[required], textarea[required], select[required]', form)
        .filter(function (f) { return f.type !== 'checkbox' && !f.value.trim(); });
      if (missing.length) {
        if (status) {
          status.textContent = t('Preencha os campos obrigatorios.',
                                 'Please fill in the required fields.');
          status.style.color = '#6B5108';
        }
        missing[0].focus();
        return;
      }
      if (status) {
        status.textContent = t(
          'Demonstracao: nada foi enviado. Este mockup nao tem servidor nem caixa de ' +
          'entrada configurada. [CONFIRM o e-mail que deve receber isto]',
          'Demonstration: nothing was sent. This mockup has no server and no configured ' +
          'inbox. [CONFIRM the address that should receive this]');
        status.style.color = '#4A5A66';
      }
      form.reset();
    });
  });

  /* ---------------------------------------------------------- LGPD bar */

  var KEY = 'cb-lgpd-v1';
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
      /* A pixel would load here. Inert on purpose - and worth noting that a
         remarketing audience built from a kids' class page is an audience of
         parents, assembled from a page about minors. That needs a decision
         before it needs a tag. */
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

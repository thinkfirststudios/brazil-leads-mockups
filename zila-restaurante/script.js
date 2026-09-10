/* ==========================================================================
   Zila Restaurante e Eventos - spec mockup behaviour
   STATUS: LEAD, not signed. Nothing here is deployed.

   THE WHOLE LEAD IS ONE INSTAGRAM HANDLE. @zila_restaurante_e_eventos is
   the only confirmed digital surface, and it serves a login wall to any
   server-side request, so nothing behind it could be read. No phone, no
   WhatsApp, no e-mail, no address, no hours, no menu, no capacity, no
   packages, no prices. WA_NUMBER therefore stays null and every WhatsApp
   control is fully built and deliberately unpointed.

   THE DATA BELOW IS STRUCTURE, NOT CONTENT. Both modules - the a la carte
   cardapio and the event package tiers - run off this one block, exactly
   as the brief asks. Every name, description and price is a visible
   [CONFIRM] placeholder. Nothing here invents a dish, a package, a
   per-person price or a minimum spend, and the capacity fields on the
   spec table are left open for the same reason: capacity is the single
   most-searched fact about an events venue and guessing it would be the
   most damaging thing this file could do.
   ========================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = null;   /* [CONFIRM] - no number captured anywhere */

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
    'A unica superficie digital confirmada da Zila e o perfil ' +
    '@zila_restaurante_e_eventos, que fica atras de login. Nenhum telefone, ' +
    'WhatsApp, e-mail ou endereco pode ser lido de la.\n\n' +
    'Nenhum numero foi inventado. Assim que voce confirmar o numero, este ' +
    'botao abre a conversa com a mensagem ja escrita:\n\n',
    'This mockup has no WhatsApp number yet.\n\n' +
    'The only confirmed digital surface for Zila is the profile ' +
    '@zila_restaurante_e_eventos, which sits behind a login wall. No phone, ' +
    'WhatsApp, e-mail or address can be read from it.\n\n' +
    'No number was invented. Once you confirm the number, this button opens ' +
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

  /* -------------------------------------------------------- menu filter */
  /* The cardapio categories are real scaffolding for a restaurant of this
     kind; the dishes inside them are not, and none was invented. Filtering
     is by data-cat, and every card is already in the DOM so the page works
     with JavaScript switched off. */

  var mtabs = $$('.menu-tabs button');
  if (mtabs.length) {
    var applyMenu = function (cat) {
      mtabs.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-cat') === cat ? 'true' : 'false');
      });
      $$('.dish').forEach(function (d) {
        d.hidden = !(cat === 'todos' || d.getAttribute('data-cat') === cat);
      });
    };
    mtabs.forEach(function (b) {
      b.addEventListener('click', function () { applyMenu(b.getAttribute('data-cat')); });
    });
    applyMenu('todos');
  }

  /* ------------------------------------------------------ gallery tabs */
  /* Two tabs, because the two tracks stay legible right through the
     gallery: a restaurant photo and an event photo answer different
     questions for different buyers. */

  var gtabs = $$('.gal-tabs button');
  if (gtabs.length) {
    var applyGal = function (k) {
      gtabs.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-gal') === k ? 'true' : 'false');
      });
      $$('.gal figure').forEach(function (f) {
        f.hidden = !(k === 'tudo' || f.getAttribute('data-gal') === k);
      });
    };
    gtabs.forEach(function (b) {
      b.addEventListener('click', function () { applyGal(b.getAttribute('data-gal')); });
    });
    applyGal('tudo');
  }

  /* ------------------------------------------------- table reservation */
  /* Pre-fills a WhatsApp message with date (DD/MM), time, party size and
     name. It states plainly that the booking is not confirmed until the
     restaurant replies - a reservation form that implies confirmation it
     cannot give is worse than no form. */

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var resv = $('#resv-form');
  if (resv) {
    var resvSend = $('#resv-send');
    var composeResv = function () {
      var nome = ($('#r-nome') || {}).value || '';
      var data = ($('#r-data') || {}).value || '';
      var hora = ($('#r-hora') || {}).value || '';
      var pax = ($('#r-pax') || {}).value || '';
      var dm = '';
      if (data) {
        var p = data.split('-');
        if (p.length === 3) { dm = pad(parseInt(p[2], 10)) + '/' + pad(parseInt(p[1], 10)); }
      }
      var msg = t('Ola! Quero reservar uma mesa no Zila.',
                  'Hello! I would like to book a table at Zila.');
      var bits = [];
      if (nome) { bits.push(t('Nome', 'Name') + ': ' + nome); }
      if (dm) { bits.push(t('Data', 'Date') + ': ' + dm); }
      if (hora) { bits.push(t('Horario', 'Time') + ': ' + hora); }
      if (pax) { bits.push(t('Pessoas', 'Guests') + ': ' + pax); }
      if (bits.length) { msg += '\n' + bits.join('\n'); }
      msg += '\n' + t('(enviado pelo site - reserva)', '(sent from the site - booking)');
      if (resvSend) { resvSend.setAttribute('data-wa', msg); }
    };
    $$('input, select', resv).forEach(function (f) {
      f.addEventListener('input', composeResv);
      f.addEventListener('change', composeResv);
    });
    composeResv();
    if (resvSend) { wire(resvSend); }
  }

  /* ------------------------------------------------- event enquiry form */
  /* THE ASSET. Every enquiry this captures is one that currently either
     goes to a competitor with a website or dies unread in a DM. It carries
     a date, a headcount and a budget - which is the whole difference
     between a lead and a conversation.

     Two exits on purpose: the form, and the same fields pre-filled into
     WhatsApp. In Brazil a real share of enquirers will always prefer
     WhatsApp, and forcing the form loses them. */

  var ev = $('#event-form');
  if (ev) {
    var evSend = $('#event-wa');
    var readEvent = function () {
      var out = [];
      $$('[data-ef]', ev).forEach(function (f) {
        var v = (f.value || '').trim();
        if (!v) { return; }
        if (f.type === 'date') {
          var p = v.split('-');
          if (p.length === 3) {
            v = pad(parseInt(p[2], 10)) + '/' + pad(parseInt(p[1], 10)) + '/' + p[0];
          }
        }
        out.push(f.getAttribute('data-ef') + ': ' + v);
      });
      return out;
    };
    var composeEvent = function () {
      var bits = readEvent();
      var msg = t('Ola! Quero um orcamento de evento no Zila.',
                  'Hello! I would like a quote for an event at Zila.');
      if (bits.length) { msg += '\n' + bits.join('\n'); }
      msg += '\n' + t('(enviado pelo site - orcamento de evento)',
                      '(sent from the site - event enquiry)');
      if (evSend) { evSend.setAttribute('data-wa', msg); }
      var pv = $('#event-preview');
      if (pv) {
        pv.textContent = bits.length ? bits.join(' \u00b7 ')
          : t('Preencha o que ja souber. Data e numero de convidados sao os dois campos que '
              + 'mais aceleram a resposta.',
              'Fill in what you already know. The date and the guest count are the two '
              + 'fields that speed up the reply most.');
      }
    };
    $$('[data-ef]', ev).forEach(function (f) {
      f.addEventListener('input', composeEvent);
      f.addEventListener('change', composeEvent);
    });
    composeEvent();
    if (evSend) { wire(evSend); }
  }

  /* --------------------------------------------------------------- forms */

  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', form);
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque o consentimento para continuar.',
                                 'Tick the consent box to continue.');
          status.style.color = '#7A2E45';
        }
        return;
      }
      var missing = $$('input[required], textarea[required], select[required]', form)
        .filter(function (f) { return f.type !== 'checkbox' && !f.value.trim(); });
      if (missing.length) {
        if (status) {
          status.textContent = t('Preencha os campos obrigatorios.',
                                 'Please fill in the required fields.');
          status.style.color = '#7A2E45';
        }
        missing[0].focus();
        return;
      }
      if (status) {
        status.textContent = t(
          'Demonstracao: nada foi enviado. Este mockup nao tem servidor nem caixa de ' +
          'entrada configurada. [CONFIRM o e-mail de eventos que deve receber isto]',
          'Demonstration: nothing was sent. This mockup has no server and no configured ' +
          'inbox. [CONFIRM the events e-mail address that should receive this]');
        status.style.color = '#4E1B2C';
      }
      form.reset();
    });
  });

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
        heroImg.style.transform = 'scale(1.06) translate3d(0,' + (y * 0.15) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(park); }
    }, { passive: true });
  }

  /* ---------------------------------------------------------- count-ups */
  /* Section 16 of the brief - the numbers strip - SHIPS EMPTY. Capacity,
     years in business, events hosted and a Google rating are all unknown,
     and capacity in particular is the one an events venue is most tempted
     to guess. The engine is here and correct; it returns on anything that
     is not a number, so a [CONFIRM] never animates into a figure a planner
     could quote back at them. */

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

  /* ------------------------------------------------------------ LGPD bar */
  /* Heavier here than on most leads: the event enquiry form collects a
     named individual's contact details, an event date and a budget range.
     Non-essential off by default, reject as easy as accept, nothing
     pre-ticked, and no tag fires before a choice is stored. */

  var KEY = 'zila-lgpd-v1';
  var bar = $('#lgpd');

  function stored() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); }
    catch (err) { return null; }
  }
  function applyConsent(v) {
    if (v && v.analytics) {
      /* Analytics tag would load here. Nothing loads in this mockup:
         no measurement ID exists yet. [CONFIRM which analytics, if any] */
    }
    if (v && v.marketing) {
      /* Remarketing / Meta pixel would load here. Inert on purpose. */
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

/* ==========================================================================
   Zen Telecom - spec mockup behaviour
   STATUS: LEAD, not signed. Nothing here is deployed.

   THREE THINGS TO READ BEFORE CHANGING ANYTHING.

   1. THE PHONE NUMBER IS REAL. 48 4042-3042 is published on their own
      site and is used verbatim, here and in the mobile bar.

   2. THE WHATSAPP NUMBER IS NOT DECIDED, AND THIS FILE REFUSES TO DECIDE
      IT. Their live site sends visitors to two different destinations:
      the footer link resolves to wa.me/5548991801033, while a second CTA
      posts to api.whatsapp.com/send?phone=554840423042. Picking one would
      quietly resolve a contradiction that is costing them leads right
      now. So WA_NUMBER stays null, every WhatsApp control is fully built,
      and clicking one names BOTH published numbers and asks which is
      monitored.

   3. THE COVERAGE CHECK RUNS ON THEIR OWN PUBLISHED LIST AND NOTHING
      ELSE. No coverage dataset or API is available, so the check matches
      the locality names they publish - and says out loud that a locality
      appearing on that list is not a promise about a specific street.
      It never guesses, and it never returns "covered" for an address it
      cannot place.
   ========================================================================== */
(function () {
  'use strict';

  var TEL_NUMBER = '554840423042';        /* published: 48 4042-3042 */
  var WA_NUMBER = null;                   /* [CONFIRM] - two published, see above */
  var WA_PUBLISHED_A = '5548991801033';   /* their footer link */
  var WA_PUBLISHED_B = '554840423042';    /* their second CTA */

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  }

  /* ---------------------------------------------------------- WhatsApp */

  var MISSING =
    'Este mockup nao escolhe um numero de WhatsApp - de proposito.\n\n' +
    'O site atual da Zen manda o visitante para DOIS destinos diferentes:\n' +
    '  - o link do rodape resolve para wa.me/' + WA_PUBLISHED_A + '\n' +
    '  - um segundo CTA usa api.whatsapp.com/send?phone=' + WA_PUBLISHED_B + '\n\n' +
    'Sao numeros distintos na mesma pagina. Escolher um aqui esconderia um ' +
    'problema que hoje esta perdendo lead de verdade.\n\n' +
    '[CONFIRM qual numero e realmente monitorado.] Assim que voce confirmar, ' +
    'este botao abre a conversa com a mensagem ja escrita:\n\n';

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
  $$('[data-tel]').forEach(function (el) {
    el.setAttribute('href', 'tel:+' + TEL_NUMBER);
  });

  /* ---------------------------------------------------- coverage check */
  /* The dataset is exactly what Zen publishes on their own coverage page,
     nothing added. Oeste is a heading on their site with no list under it,
     so it is an empty array here and the check says so rather than
     pretending the region is uncovered. */

  var COVERAGE = {
    'Sul da Ilha': ['Campeche', 'Rio Tavares', 'Morro das Pedras', 'Ribeirao da Ilha',
                    'Armacao', 'Matadeiro', 'Costa de Dentro', 'Costa de Cima',
                    'Acores', 'Pantano do Sul'],
    'Leste': ['Lagoa da Conceicao', 'Canto da Lagoa', 'Barra da Lagoa', 'Joaquina',
              'Praia Mole', 'Carianos'],
    'Oeste': []   /* [CONFIRM] - the heading exists on their page, the list does not */
  };

  function fold(s) {
    s = (s || '').toLowerCase();
    var from = '\u00e1\u00e0\u00e3\u00e2\u00e4\u00e9\u00e8\u00ea\u00eb\u00ed\u00ec\u00ee' +
               '\u00ef\u00f3\u00f2\u00f5\u00f4\u00f6\u00fa\u00f9\u00fb\u00fc\u00e7';
    var to = 'aaaaaeeeeiiiiooooouuuuc';
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var j = from.indexOf(s.charAt(i));
      out += j >= 0 ? to.charAt(j) : s.charAt(i);
    }
    return out.replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findLocalities(q) {
    var f = fold(q), hits = [];
    if (f.length < 3) { return hits; }
    Object.keys(COVERAGE).forEach(function (region) {
      COVERAGE[region].forEach(function (name) {
        var n = fold(name);
        if (f.indexOf(n) >= 0 || n.indexOf(f) >= 0) {
          hits.push({ region: region, name: name });
        }
      });
    });
    return hits;
  }

  function looksLikeCep(q) {
    return /\d{5}-?\d{3}/.test(q || '');
  }

  var covForm = $('#cov-form');
  if (covForm) {
    var covInput = $('#cov-q', covForm);
    var covOut = $('#cov-out');
    covForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!covOut) { return; }
      var q = covInput ? covInput.value.trim() : '';
      covOut.hidden = false;
      if (!q) {
        covOut.innerHTML = '<b>Digite a rua ou o bairro.</b> A busca compara com a lista de ' +
          'bairros que a Zen publica hoje.';
        return;
      }
      var hits = findLocalities(q);
      if (hits.length) {
        var links = hits.map(function (h) {
          return '<a href="' + (covOut.getAttribute('data-base') || '') +
            fold(h.name).replace(/ /g, '-') + '.html">' + h.name + '</a>';
        }).join('');
        covOut.innerHTML =
          '<b>' + hits[0].name + ' aparece na lista de cobertura publicada pela Zen</b> ' +
          '(regiao ' + hits[0].region + ').<br>' +
          'Isso e o que eles publicam sobre o bairro &mdash; <strong>nao e uma confirmacao ' +
          'sobre a sua rua ou o seu numero</strong>. Cobertura de fibra e por trecho de rede, ' +
          'nao por bairro, e nenhuma base de cobertura foi disponibilizada para este mockup. ' +
          '<span class="cfm">[CONFIRM se existe base ou API de cobertura]</span>' +
          '<div class="cov-hits">' + links + '</div>';
        return;
      }
      if (looksLikeCep(q)) {
        covOut.innerHTML =
          '<b>Consulta por CEP nao foi ligada a nenhuma base.</b> ' +
          'Este mockup nao tem base de CEP nem API de cobertura, e nenhuma foi inventada: ' +
          'um "sim" errado sobre cobertura custa mais que um "nao sei". ' +
          '<span class="cfm">[CONFIRM se existe base de cobertura por CEP]</span><br>' +
          'Deixe o endereco abaixo e a Zen responde &mdash; e o endereco entra como ' +
          'demanda para planejamento de rede, com o seu consentimento.';
        return;
      }
      covOut.innerHTML =
        '<b>Nao encontramos esse nome na lista publicada.</b> ' +
        'A lista atual cobre Sul da Ilha e Leste; a regiao <strong>Oeste</strong> tem ' +
        'titulo na pagina da Zen e <strong>nenhum bairro listado embaixo</strong> ' +
        '<span class="cfm">[CONFIRM a lista do Oeste]</span>. ' +
        'Nao estar na lista nao quer dizer que a rede nao chega: quer dizer que ninguem ' +
        'publicou. Deixe o endereco abaixo e a Zen responde.';
    });
  }

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
  /* The Solix reference this build borrows from has a stats row and
     percentage bars. Both were DELETED from the design, deliberately: a
     bar reading "90%" beside "Fibra Optica" is read as a speed or uptime
     claim, and publishing an unsubstantiated performance figure on an
     ANATEL-regulated service is a real exposure. No verified number about
     this business exists to count anyway - no subscriber count, no years
     in operation, no network size. The engine stays, and returns on
     anything that is not a number, so a [CONFIRM] never animates. */

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
  /* No server, no endpoint, no mailto with personal data in a query
     string. Submitting shows what would be sent and nothing leaves the
     browser. */

  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', form);
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = 'Marque o consentimento para continuar.';
          status.style.color = '#0D7786';
        }
        return;
      }
      var missing = $$('input[required], textarea[required], select[required]', form)
        .filter(function (f) { return f.type !== 'checkbox' && !f.value.trim(); });
      if (missing.length) {
        if (status) {
          status.textContent = 'Preencha os campos obrigatorios.';
          status.style.color = '#0D7786';
        }
        missing[0].focus();
        return;
      }
      if (status) {
        status.textContent = 'Demonstracao: nada foi enviado. Este mockup nao tem servidor ' +
          'nem destinatario configurado, e o endereco digitado nao foi guardado em lugar ' +
          'nenhum. [CONFIRM o destino real e o prazo de retencao do endereco]';
        status.style.color = '#0E5A6B';
      }
      form.reset();
    });
  });

  /* ------------------------------------------------------------ LGPD bar */

  var KEY = 'zen-lgpd-v1';
  var bar = $('#lgpd');

  function stored() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); }
    catch (err) { return null; }
  }
  function applyConsent(v) {
    if (v && v.analytics) {
      /* Analytics tag would load here. Nothing loads in this mockup:
         no measurement ID exists yet. [CONFIRM which analytics] */
    }
    if (v && v.marketing) {
      /* Remarketing / Meta pixel would load here. Inert on purpose.
         Note their live funnel runs through typebot.co/atendimento-zen -
         a third party that sets its own storage. [CONFIRM whether the
         Typebot stays before it is loaded from this page.] */
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

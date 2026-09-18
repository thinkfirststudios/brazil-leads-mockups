/* Imóveis Floripa — mockup behaviour (no framework, no build step) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var isEN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = document.body.getAttribute('data-wa') || '';

  var T = isEN ? {
    formOk: 'Demo only — this form is not connected yet. In production, your message goes to Imóveis Floripa.',
    consent: 'Please tick the consent box to continue.',
    required: 'Please fill in the required fields.',
    details: 'Demo: in the hybrid model, the listing detail page keeps being served by the current platform under the existing URL.',
    code: 'Demo: a search by reference code opens that listing directly in production. Code entered: ',
    all: 'All neighbourhoods', allTypes: 'All types',
    showing: 'Showing', inWord: 'in', clear: 'Clear filters',
    panelIntro: 'Listings in ', panelCount: 'Live listing count: ', see: 'See results',
    waCard: 'Hello! I am interested in the listing shown on the website (card ',
    waCard2: ', reference code to be confirmed).',
    saved: 'Cookie preferences saved.'
  } : {
    formOk: 'Demonstração — este formulário ainda não está conectado. Em produção, sua mensagem vai para a Imóveis Floripa.',
    consent: 'Marque a caixa de consentimento para continuar.',
    required: 'Preencha os campos obrigatórios.',
    details: 'Demonstração: no modelo híbrido, a página de detalhe do imóvel continua servida pela plataforma atual, na URL existente.',
    code: 'Demonstração: a busca por código abre o imóvel diretamente em produção. Código digitado: ',
    all: 'Todos os bairros', allTypes: 'Todos os tipos',
    showing: 'Exibindo', inWord: 'em', clear: 'Limpar filtros',
    panelIntro: 'Imóveis em ', panelCount: 'Contagem ao vivo: ', see: 'Ver resultados',
    waCard: 'Olá! Tenho interesse no imóvel exibido no site (card ',
    waCard2: ', código de referência a confirmar).',
    saved: 'Preferências de cookies salvas.'
  };

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var toastEl = $('.toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4200);
  }
  function waLink(text) {
    if (!WA) return '#contato';
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  }

  /* ---------- year ---------- */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- sticky header (condense + dock search) ---------- */
  var header = $('.site-header');
  var nav = $('.primary-nav');
  var toggle = $('.menu-toggle');
  function setHeaderTop() {
    if (!header) return;
    var r = header.getBoundingClientRect();
    doc.style.setProperty('--header-top', Math.max(0, r.bottom) + 'px');
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-condensed', y > 140);
      setHeaderTop();
      if (!reduce) {
        $$('.hero-media').forEach(function (m) {
          if (y < 1200) m.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
        });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHeaderTop);
  onScroll();

  /* ---------- mobile menu ---------- */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setHeaderTop();
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = $$('.reveal');
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--i', i % 8); });
  });
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- count-up (verified numbers only; none verified on this lead) ---------- */
  var counters = $$('[data-count]');
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target.toLocaleString('pt-BR'); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- listing filter (map + chips + search) ---------- */
  var grid = $('#listing-grid');
  var state = { bairro: '', tipo: '' };
  var names = {};
  $$('[data-bairro-name]').forEach(function (el) { names[el.getAttribute('data-bairro')] = el.getAttribute('data-bairro-name'); });

  function applyFilter(opts) {
    opts = opts || {};
    if (!grid) return;
    var cards = $$('.listing', grid), shown = 0;
    cards.forEach(function (c) {
      var ok = (!state.bairro || c.getAttribute('data-bairro') === state.bairro) &&
               (!state.tipo || c.getAttribute('data-tipo') === state.tipo);
      c.hidden = !ok;
      if (ok) shown++;
    });
    var empty = $('#listing-empty');
    if (empty) empty.hidden = shown !== 0;
    // map regions + bairro buttons
    $$('.region[data-bairro]').forEach(function (r) {
      var on = r.getAttribute('data-bairro') === state.bairro;
      r.classList.toggle('is-active', on);
      r.setAttribute('aria-pressed', String(on));
    });
    $$('.bairro-btn[data-bairro]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-bairro') === state.bairro));
    });
    $$('.chip[data-tipo]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-tipo') === state.tipo));
    });
    $$('select[name="bairro"]').forEach(function (s) { s.value = state.bairro; });
    $$('select[name="tipo"]').forEach(function (s) { s.value = state.tipo; });
    // status line
    var status = $('#filter-status');
    if (status) {
      var chip = state.tipo ? $('.chip[data-tipo="' + state.tipo + '"]') : null;
      var tipoLabel = chip ? chip.textContent : (state.tipo || T.allTypes);
      var txt = T.showing + ' <span class="tag">' + tipoLabel + '</span> ' + T.inWord +
        ' <span class="tag">' + (names[state.bairro] || T.all) + '</span>';
      if (state.bairro || state.tipo) txt += ' <button type="button" class="link-btn js-clear">' + T.clear + '</button>';
      status.innerHTML = txt;
      var clr = $('.js-clear', status);
      if (clr) clr.addEventListener('click', function () { state.bairro = ''; state.tipo = ''; applyFilter(); });
    }
    // map panel
    var panel = $('#map-panel');
    if (panel && state.bairro) {
      $('.js-panel-title', panel).textContent = T.panelIntro + (names[state.bairro] || '');
      panel.hidden = false;
    } else if (panel) {
      panel.hidden = true;
    }
    if (opts.scroll) {
      var target = $('#imoveis') || $('#listings');
      if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function pickBairro(slug, scroll) {
    state.bairro = (state.bairro === slug && !scroll) ? '' : slug;
    applyFilter({ scroll: scroll });
  }

  $$('.region[data-bairro]').forEach(function (r) {
    r.addEventListener('click', function (e) { e.preventDefault(); pickBairro(r.getAttribute('data-bairro')); });
    r.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickBairro(r.getAttribute('data-bairro')); }
    });
  });
  $$('.bairro-btn[data-bairro]').forEach(function (b) {
    b.addEventListener('click', function () { pickBairro(b.getAttribute('data-bairro')); });
  });
  $$('.chip[data-tipo]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-tipo');
      state.tipo = state.tipo === t ? '' : t;
      applyFilter();
    });
  });
  $$('.js-see-results').forEach(function (b) {
    b.addEventListener('click', function () { applyFilter({ scroll: true }); });
  });

  // search forms: filter in place on the home page, otherwise let the GET go to the home page
  $$('form.js-search').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var fd = new FormData(f);
      var code = (fd.get('codigo') || '').toString().trim();
      if (!grid) return; // sub-page: native GET to home with params
      e.preventDefault();
      state.bairro = (fd.get('bairro') || '').toString();
      state.tipo = (fd.get('tipo') || '').toString();
      applyFilter({ scroll: true });
      if (code) toast(T.code + code.toUpperCase());
    });
  });
  // pre-filter from URL params (?bairro=&tipo=)
  if (grid) {
    try {
      var qp = new URLSearchParams(window.location.search);
      if (qp.get('bairro')) state.bairro = qp.get('bairro');
      if (qp.get('tipo')) state.tipo = qp.get('tipo');
      if (qp.get('codigo')) setTimeout(function () { toast(T.code + qp.get('codigo').toUpperCase()); }, 600);
    } catch (err) { /* ignore */ }
    applyFilter();
  }

  /* ---------- card actions ---------- */
  $$('.js-wa-card').forEach(function (a) {
    var n = a.getAttribute('data-card') || '';
    a.setAttribute('href', waLink(T.waCard + n + T.waCard2));
  });
  $$('.js-details').forEach(function (b) {
    b.addEventListener('click', function () { toast(T.details); });
  });

  /* ---------- carousel buttons ---------- */
  $$('.carousel').forEach(function (c) {
    var track = $('.carousel-track', c);
    $$('[data-dir]', c).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10);
        track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------- demo forms ---------- */
  $$('form.js-demo-form').forEach(function (f) {
    f.setAttribute('novalidate', '');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.form-notice', f);
      var consent = $('input[name="consentimento"]', f);
      var ok = f.checkValidity();
      if (note) note.classList.remove('is-error');
      if (!ok) {
        if (note) { note.textContent = T.required; note.classList.add('is-visible', 'is-error'); }
        var bad = $(':invalid', f); if (bad) bad.focus();
        return;
      }
      if (consent && !consent.checked) {
        if (note) { note.textContent = T.consent; note.classList.add('is-visible', 'is-error'); }
        consent.focus();
        return;
      }
      if (note) { note.textContent = T.formOk; note.classList.add('is-visible'); }
    });
  });

  /* ---------- LGPD cookie banner ---------- */
  var KEY = 'imoveisfloripa_cookie_consent_v1';
  var banner = $('#cookie-banner');
  function readConsent() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function writeConsent(v) {
    v.ts = new Date().toISOString();
    v.retencaoDias = 400; // mirrors the retention stated on the current live banner [CONFIRM]
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    // GTM (GTM-NFSRZCP) would only be loaded here, after consent, in production.
  }
  function openBanner(showPrefs) {
    if (!banner) return;
    var c = readConsent() || {};
    var a = $('#ck-analytics', banner), m = $('#ck-marketing', banner);
    if (a) a.checked = !!c.analytics;
    if (m) m.checked = !!c.marketing;
    $('.cookie-prefs', banner).classList.toggle('is-open', !!showPrefs);
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
  }
  function closeBanner() {
    if (!banner) return;
    banner.classList.remove('is-open');
    setTimeout(function () { banner.hidden = true; }, 450);
  }
  if (banner) {
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      var act = btn.getAttribute('data-cookie');
      if (act === 'accept') { writeConsent({ necessary: true, analytics: true, marketing: true }); closeBanner(); toast(T.saved); }
      if (act === 'reject') { writeConsent({ necessary: true, analytics: false, marketing: false }); closeBanner(); toast(T.saved); }
      if (act === 'prefs') { $('.cookie-prefs', banner).classList.toggle('is-open'); }
      if (act === 'save') {
        writeConsent({ necessary: true, analytics: $('#ck-analytics', banner).checked, marketing: $('#ck-marketing', banner).checked });
        closeBanner(); toast(T.saved);
      }
    });
    if (!readConsent()) setTimeout(function () { openBanner(false); }, 700);
  }
  $$('.js-cookie-open').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); });
  });
})();

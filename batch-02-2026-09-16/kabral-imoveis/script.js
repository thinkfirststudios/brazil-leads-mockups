/* Kabral Imóveis — mockup behaviour: unit switcher, routed WhatsApp, search/filter, timeline, LGPD */
(function () {
  'use strict';
  var doc = document.documentElement;
  var isEN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* Verified unit data (from the brief — all published on kabral.com.br) */
  var UNITS = {
    florianopolis: {
      name: 'Florianópolis', cidade: 'florianopolis',
      address: 'Av. Rio Branco, 198, Loja 01 — Florianópolis/SC',
      phone: '(48) 3224-6575', tel: '+554832246575',
      wa: { venda: '5548999710790', aluguel: '5548991159053' }
    },
    campeche: {
      name: 'Campeche', cidade: 'florianopolis',
      address: 'Av. Pequeno Príncipe, 1741, Loja 01 — Campeche, Florianópolis/SC',
      phone: '(48) 3028-1417', tel: '+554830281417',
      wa: { venda: '5548991819645', aluguel: '5548991116275' }
    },
    palhoca: {
      name: 'Palhoça', cidade: 'palhoca',
      address: null, // not published on the current site
      phone: '(48) 3374-9950', tel: '+554833749950',
      wa: {} // no WhatsApp line published for Palhoça
    }
  };

  var T = isEN ? {
    unitSel: 'Selected office: ', addrMissing: 'Address [CONFIRM — not published]',
    waLabel: 'Chat on WhatsApp', waMissing: '[CONFIRM WhatsApp]', waTagMissing: '[CONFIRM WhatsApp — ',
    hello: 'Hello! I found Kabral Imóveis on the website (office ',
    cardMsg: 'Hello! I am interested in the listing on the website (card ',
    cardMsg2: ', reference code to be confirmed). Office: ',
    fnVenda: 'sales', fnAluguel: 'rentals',
    formOk: 'Demo only — this form is not connected. In production it goes to the selected Kabral office.',
    consent: 'Please tick the consent box to continue.', required: 'Please fill in the required fields.',
    details: 'Demo: the listing detail page keeps its current URL pattern (/imovel/…-ref-{code}/).',
    code: 'Demo: searching by reference code opens that listing directly in production. Code: ',
    favOn: 'Saved to favourites (demo — in production this syncs with the client login).', favOff: 'Removed from favourites (demo).',
    all: 'all', showing: 'Showing', deal: 'deal', city: 'city', type: 'type', clear: 'Clear filters',
    saved: 'Cookie preferences saved.', announce: 'Office selected: '
  } : {
    unitSel: 'Unidade selecionada: ', addrMissing: 'Endereço [CONFIRM — não publicado]',
    waLabel: 'Falar no WhatsApp', waMissing: '[CONFIRM WhatsApp]', waTagMissing: '[CONFIRM WhatsApp — ',
    hello: 'Olá! Vim pelo site da Kabral Imóveis (unidade ',
    cardMsg: 'Olá! Tenho interesse no imóvel exibido no site (card ',
    cardMsg2: ', código de referência a confirmar). Unidade: ',
    fnVenda: 'venda', fnAluguel: 'aluguel',
    formOk: 'Demonstração — este formulário não está conectado. Em produção, segue para a unidade Kabral selecionada.',
    consent: 'Marque a caixa de consentimento para continuar.', required: 'Preencha os campos obrigatórios.',
    details: 'Demonstração: a página de detalhe mantém o padrão de URL atual (/imovel/…-ref-{código}/).',
    code: 'Demonstração: a busca por código abre o imóvel diretamente em produção. Código: ',
    favOn: 'Imóvel salvo nos favoritos (demo — em produção sincroniza com o login do cliente).', favOff: 'Imóvel removido dos favoritos (demo).',
    all: 'todos', showing: 'Exibindo', deal: 'negócio', city: 'cidade', type: 'tipo', clear: 'Limpar filtros',
    saved: 'Preferências de cookies salvas.', announce: 'Unidade selecionada: '
  };

  var toastEl = $('.toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4500);
  }
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- header condense + parallax + header offset ---------- */
  var header = $('.site-header'), nav = $('.primary-nav'), toggle = $('.menu-toggle');
  function setHeaderTop() {
    if (header) doc.style.setProperty('--header-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-condensed', y > 160);
      setHeaderTop();
      if (!reduce && y < 1400) {
        $$('.hero-media').forEach(function (m) { m.style.transform = 'translate3d(0,' + (y * 0.15).toFixed(1) + 'px,0)'; });
      }
      updateTimeline();
      ticking = false;
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setHeaderTop();
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); toggle.focus(); }
    });
  }

  /* ---------- reveals ---------- */
  $$('[data-stagger]').forEach(function (g) { $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--i', i % 8); }); });
  var reveals = $$('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- count-up: only elements with a verified data-count (none verified yet) ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute('data-count'), 10);
        cio.unobserve(el);
        if (isNaN(target)) return;
        if (reduce) { el.textContent = target; return; }
        var t0 = null;
        (function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1800, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- unit switcher ---------- */
  var KEY_UNIT = 'kabral_unidade_v1';
  var live = $('#unit-live');
  var current = 'florianopolis';
  function waHref(num, text) { return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text); }

  function routeWA(el, unitKey, extraText) {
    var u = UNITS[unitKey];
    var fn = el.getAttribute('data-wa') || el.getAttribute('data-fn') || 'venda';
    if (fn === 'geral') fn = 'venda';
    var num = u.wa[fn];
    var label = $('.wa-label', el), tag = $('.wa-tag', el);
    if (num) {
      var txt = extraText || (T.hello + u.name + ' — ' + (fn === 'aluguel' ? T.fnAluguel : T.fnVenda) + ').');
      el.setAttribute('href', waHref(num, txt));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.classList.remove('is-unverified');
      if (label && !label.hasAttribute('data-keep')) label.textContent = el.getAttribute('data-label') || T.waLabel;
      if (tag) tag.textContent = '';
    } else {
      el.setAttribute('href', document.getElementById('unidades') ? '#unidades' : '#offices');
      el.removeAttribute('target');
      el.classList.add('is-unverified');
      if (label && !label.hasAttribute('data-keep')) label.textContent = T.waMissing;
      if (tag) tag.textContent = T.waTagMissing + u.name + ']';
    }
  }

  function setUnit(key, opts) {
    opts = opts || {};
    if (!UNITS[key]) key = 'florianopolis';
    current = key;
    var u = UNITS[key];
    $$('input[name="unidade"]').forEach(function (r) { r.checked = r.value === key; });
    $$('[data-u="name"]').forEach(function (el) { el.textContent = u.name; });
    $$('[data-u="phone"]').forEach(function (el) { el.textContent = u.phone; if (el.tagName === 'A') el.setAttribute('href', 'tel:' + u.tel); });
    $$('[data-u="address"]').forEach(function (el) {
      if (u.address) el.textContent = u.address;
      else el.innerHTML = (isEN ? 'Palhoça — address ' : 'Palhoça — endereço ') + '<span class="confirm">' + (isEN ? '[CONFIRM — not published]' : '[CONFIRM — não publicado]') + '</span>';
    });
    $$('a[data-wa]').forEach(function (a) { routeWA(a, key); });
    $$('.js-wa-card').forEach(function (a) {
      var n = a.getAttribute('data-card') || '';
      routeWA(a, key, T.cardMsg + n + T.cardMsg2 + u.name + '.');
    });
    $$('.unit-card[data-unit], .f-unit[data-unit]').forEach(function (c) { c.classList.toggle('is-selected', c.getAttribute('data-unit') === key); });
    $$('select[name="cidade"]').forEach(function (s) { s.value = u.cidade; });
    try { localStorage.setItem(KEY_UNIT, key); } catch (e) { /* ignore */ }
    if (opts.user) {
      if (live) live.textContent = T.announce + u.name;
      if (grid) { state.cidade = u.cidade; applyFilter(); }
    }
  }
  $$('input[name="unidade"]').forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) setUnit(r.value, { user: true }); });
  });

  /* ---------- listing filter ---------- */
  var grid = $('#listing-grid');
  var state = { negocio: '', cidade: '', tipo: '' };
  function labelFor(sel, val) {
    var s = $(sel); if (!s || !val) return T.all;
    var o = $$('option', s).filter(function (op) { return op.value === val; })[0];
    return o ? o.textContent : val;
  }
  function applyFilter(opts) {
    if (!grid) return;
    opts = opts || {};
    var shown = 0;
    $$('.listing', grid).forEach(function (c) {
      var ok = (!state.negocio || c.getAttribute('data-negocio') === state.negocio) &&
               (!state.cidade || c.getAttribute('data-cidade') === state.cidade) &&
               (!state.tipo || c.getAttribute('data-tipo') === state.tipo);
      c.hidden = !ok; if (ok) shown++;
    });
    var empty = $('#listing-empty'); if (empty) empty.hidden = shown !== 0;
    $$('.chip[data-negocio]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-negocio') === state.negocio)); });
    var st = $('#filter-status');
    if (st) {
      st.innerHTML = T.showing + ' — ' + T.deal + ': <b>' + (state.negocio ? (($('.chip[data-negocio="' + state.negocio + '"]') || {}).textContent || state.negocio) : T.all) + '</b> · ' +
        T.city + ': <b>' + labelFor('#s-cidade', state.cidade) + '</b> · ' + T.type + ': <b>' + labelFor('#s-tipo', state.tipo) + '</b>' +
        ((state.negocio || state.cidade || state.tipo) ? ' <button type="button" class="link-btn js-clear">' + T.clear + '</button>' : '');
      var clr = $('.js-clear', st);
      if (clr) clr.addEventListener('click', function () { state = { negocio: '', cidade: '', tipo: '' }; applyFilter(); });
    }
    if (opts.scroll) { var t = $('#imoveis') || $('#listings'); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  }
  $$('.chip[data-negocio]').forEach(function (b) {
    b.addEventListener('click', function () { var v = b.getAttribute('data-negocio'); state.negocio = state.negocio === v ? '' : v; applyFilter(); });
  });
  $$('form.js-search').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!grid) return; // sub-pages: native GET to the home page
      e.preventDefault();
      var fd = new FormData(f);
      state.negocio = (fd.get('negocio') || '').toString();
      state.cidade = (fd.get('cidade') || '').toString();
      state.tipo = (fd.get('tipo') || '').toString();
      applyFilter({ scroll: true });
      var code = (fd.get('codigo') || '').toString().trim();
      if (code) toast(T.code + code.toUpperCase());
    });
  });

  /* ---------- card actions ---------- */
  $$('.fav').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      toast(on ? T.favOn : T.favOff);
    });
  });
  $$('.js-details').forEach(function (b) { b.addEventListener('click', function () { toast(T.details); }); });
  var dlg = $('#visit-dialog');
  $$('.js-visit').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!dlg) return;
      var f = $('input[name="card"]', dlg); if (f) f.value = b.getAttribute('data-card') || '';
      var un = $('[data-u="name"]', dlg); if (un) un.textContent = UNITS[current].name;
      if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    });
  });
  $$('.js-close-dialog').forEach(function (b) { b.addEventListener('click', function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }); });

  /* ---------- timeline (horizontal, scroll-driven on wide screens; vertical list otherwise) ---------- */
  var tl = $('.timeline'), tlTrack = tl ? $('.tl-track', tl) : null, tlSticky = tl ? $('.tl-sticky', tl) : null;
  var tlHorizontal = false;
  function setupTimeline() {
    if (!tl) return;
    var wide = window.matchMedia('(min-width: 980px)').matches;
    tlHorizontal = wide && !reduce;
    tl.classList.toggle('is-horizontal', tlHorizontal);
    if (tlHorizontal) {
      var extra = Math.max(0, tlTrack.scrollWidth - tlSticky.clientWidth);
      tl.style.setProperty('--tl-h', (extra + tlSticky.offsetHeight + 200) + 'px');
    } else {
      tlTrack.style.transform = '';
    }
    updateTimeline();
  }
  function updateTimeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect();
    var vh = window.innerHeight;
    var p;
    if (tlHorizontal) {
      var total = tl.offsetHeight - tlSticky.offsetHeight - 200;
      var top = (parseFloat(getComputedStyle(doc).getPropertyValue('--header-top')) || 120) + 20;
      p = Math.min(1, Math.max(0, (top - r.top) / Math.max(1, total)));
      var extra = Math.max(0, tlTrack.scrollWidth - tlSticky.clientWidth);
      tlTrack.style.transform = 'translate3d(' + (-p * extra).toFixed(1) + 'px,0,0)';
      tl.style.setProperty('--tl-w', (p * 100).toFixed(1) + '%');
    } else if (!reduce) {
      p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / Math.max(1, r.height)));
      tl.style.setProperty('--tl-p', (p * 100).toFixed(1) + '%');
    }
  }

  /* ---------- demo forms ---------- */
  $$('form.js-demo-form').forEach(function (f) {
    f.setAttribute('novalidate', '');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.form-notice', f), consent = $('input[name="consentimento"]', f);
      if (note) note.classList.remove('is-error');
      if (!f.checkValidity()) {
        if (note) { note.textContent = T.required; note.classList.add('is-visible', 'is-error'); }
        var bad = $(':invalid', f); if (bad) bad.focus();
        return;
      }
      if (consent && !consent.checked) {
        if (note) { note.textContent = T.consent; note.classList.add('is-visible', 'is-error'); }
        consent.focus(); return;
      }
      if (note) { note.textContent = T.formOk; note.classList.add('is-visible'); }
    });
  });

  /* ---------- LGPD cookie banner ---------- */
  var KEY = 'kabral_cookie_consent_v1', banner = $('#cookie-banner');
  function readC() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function writeC(v) { v.ts = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } /* GTM-KXRB4LH loads only after consent in production */ }
  function openBanner(prefs) {
    if (!banner) return;
    var c = readC() || {};
    $('#ck-analytics', banner).checked = !!c.analytics;
    $('#ck-marketing', banner).checked = !!c.marketing;
    $('.cookie-prefs', banner).classList.toggle('is-open', !!prefs);
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
  }
  function closeBanner() { banner.classList.remove('is-open'); setTimeout(function () { banner.hidden = true; }, 600); }
  if (banner) {
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      var a = b.getAttribute('data-cookie');
      if (a === 'accept') { writeC({ necessary: true, analytics: true, marketing: true }); closeBanner(); toast(T.saved); }
      else if (a === 'reject') { writeC({ necessary: true, analytics: false, marketing: false }); closeBanner(); toast(T.saved); }
      else if (a === 'prefs') { $('.cookie-prefs', banner).classList.toggle('is-open'); }
      else if (a === 'save') { writeC({ necessary: true, analytics: $('#ck-analytics', banner).checked, marketing: $('#ck-marketing', banner).checked }); closeBanner(); toast(T.saved); }
    });
    if (!readC()) setTimeout(function () { openBanner(false); }, 800);
  }
  $$('.js-cookie-open').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); }); });

  /* ---------- init ---------- */
  var initial = document.body.getAttribute('data-unit');
  if (!initial) { try { initial = localStorage.getItem(KEY_UNIT); } catch (e) { initial = null; } }
  setUnit(initial || 'florianopolis');
  if (grid) {
    try {
      var qp = new URLSearchParams(window.location.search);
      if (qp.get('negocio')) state.negocio = qp.get('negocio');
      if (qp.get('cidade')) state.cidade = qp.get('cidade');
      if (qp.get('tipo')) state.tipo = qp.get('tipo');
      if (qp.get('codigo')) setTimeout(function () { toast(T.code + qp.get('codigo').toUpperCase()); }, 700);
    } catch (e) { /* ignore */ }
    applyFilter();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { setHeaderTop(); setupTimeline(); });
  window.addEventListener('load', setupTimeline);
  setupTimeline();
  onScroll();
})();

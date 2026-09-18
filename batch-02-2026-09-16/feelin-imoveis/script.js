/* Feelin Imóveis — mockup behaviour. No framework, no build step. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 6000);
  }

  /* Year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Sticky header condense */
  var header = $('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = $('.menu-toggle'), nav = $('#menu');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.sr-only').textContent = open ? 'Fechar menu' : 'Abrir menu';
      if (open && header) nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
      nav.classList.toggle('is-open', open);
      doc.body.classList.toggle('no-scroll', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
  }

  /* Scroll reveals with stagger (index set via CSS var) */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--i', i % 6); });
  });
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Count-up: only elements with a verified numeric data-count (none ship unverified) */
  var counters = $$('[data-count]');
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    if (reduce) { el.textContent = fmt(target); return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { cio.observe(c); });
    } else { counters.forEach(runCount); }
  }

  /* Accessible tablists (search mode + owner mode) */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = doc.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      var out = list.getAttribute('data-mode-output');
      if (out && doc.getElementById(out)) doc.getElementById(out).textContent = tab.getAttribute('data-label') || tab.textContent;
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var idx = null;
        if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') idx = 0;
        else if (e.key === 'End') idx = tabs.length - 1;
        if (idx !== null) { e.preventDefault(); select(tabs[idx], true); }
      });
    });
    var initial = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    if (initial) select(initial, false);
  });

  /* Launch stage filter chips */
  $$('[data-filter-group]').forEach(function (group) {
    var chips = $$('[data-filter]', group);
    var target = doc.getElementById(group.getAttribute('data-filter-group'));
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var val = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        if (!target) return;
        $$('[data-stage]', target).forEach(function (card) {
          card.classList.toggle('is-hidden-by-filter', val !== 'todos' && card.getAttribute('data-stage') !== val);
        });
      });
    });
  });

  /* Carousels */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.carousel__track', c);
    var prev = $('[data-prev]', c), next = $('[data-next]', c);
    function by(dir) {
      var card = track.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { by(-1); });
    if (next) next.addEventListener('click', function () { by(1); });
  });

  /* Gentle parallax on page heroes that opt in (transform only) */
  var par = $('[data-parallax]');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        par.style.transform = 'translate3d(0,' + (y * 0.15) + 'px,0) scale(1.06)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* Demo forms: never submit, never collect. Build the WhatsApp message preview. */
  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = $('input[name="lgpd"]', form);
      var status = $('.form-status', form);
      if (consent && !consent.checked) {
        if (status) { status.hidden = false; status.textContent = 'Para enviar, marque a caixa de consentimento (LGPD).'; }
        consent.focus();
        return;
      }
      var parts = [];
      $$('select, input[type=text], input[type=number]', form).forEach(function (f) {
        if (f.value && f.name && f.name !== 'lgpd') parts.push(f.getAttribute('data-label') + ': ' + f.value);
      });
      var msg = (form.getAttribute('data-intro') || 'Olá!') + (parts.length ? ' ' + parts.join(' · ') : '');
      if (status) {
        status.hidden = false;
        status.textContent = 'Demonstração: nada foi enviado. No site real, abriria o WhatsApp ' + (form.getAttribute('data-wa-label') || '(48) 98836-5286') + ' com a mensagem: "' + msg + '"';
      }
    });
  });

  /* Search forms (demo) */
  $$('form[data-search]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fin = form.querySelector('[name="finalidade"]:checked, select[name="finalidade"]');
      var isRent = (fin && /alugar/i.test(fin.value)) || form.hasAttribute('data-rent');
      toast(isRent
        ? 'Demonstração: esta busca vai para /alugar/ e mostra só imóveis para alugar — nunca resultados de venda. Contagem: [CONFIRM].'
        : 'Demonstração: a busca real consultaria o inventário (feed IMOBISOFT). Contagem: [CONFIRM].');
    });
  });

  /* Map: static panel until the visitor asks to load Google Maps (LGPD — no third-party embed before consent) */
  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = doc.getElementById(btn.getAttribute('aria-controls'));
      if (!box) return;
      var ifr = doc.createElement('iframe');
      ifr.src = btn.getAttribute('data-map-load');
      ifr.title = btn.getAttribute('data-map-title') || 'Mapa';
      ifr.loading = 'lazy';
      ifr.referrerPolicy = 'no-referrer-when-downgrade';
      ifr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
      box.innerHTML = '';
      box.appendChild(ifr);
      btn.hidden = true;
    });
  });

  /* LGPD cookie banner */
  /* Favourites (Meus Favoritos) — per-viewer convenience only */
  var FAV = 'feelin_favoritos_v1';
  function favList() { try { return JSON.parse(store(FAV) || '[]'); } catch (e) { return []; } }
  function favRender() {
    var list = favList();
    $$('[data-fav-count]').forEach(function (el) { el.textContent = list.length; });
    $$('button[data-fav]').forEach(function (b) {
      var on = list.indexOf(b.getAttribute('data-fav')) > -1;
      b.setAttribute('aria-pressed', String(on));
    });
  }
  $$('button[data-fav]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-fav'), list = favList(), i = list.indexOf(id);
      if (i > -1) list.splice(i, 1); else list.push(id);
      store(FAV, JSON.stringify(list));
      favRender();
      toast(i > -1 ? 'Removido de Meus Favoritos.' : 'Salvo em Meus Favoritos (neste navegador).');
    });
  });
  favRender();

  /* Bairro index: searchable filter (combobox-style) */
  $$('[data-place-filter]').forEach(function (input) {
    var list = doc.getElementById(input.getAttribute('aria-controls'));
    var status = doc.getElementById(input.getAttribute('data-status'));
    if (!list) return;
    var items = $$('li[data-name]', list);
    function norm(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function run() {
      var q = norm(input.value.trim()), shown = 0;
      items.forEach(function (li) {
        var hit = !q || norm(li.getAttribute('data-name')).indexOf(q) > -1;
        li.hidden = !hit;
        if (hit) shown++;
      });
      $$('li.group-h', list).forEach(function (h) { h.hidden = !!q; });
      if (status) status.textContent = shown + (shown === 1 ? ' bairro listado' : ' bairros listados') + (q ? ' para “' + input.value.trim() + '”' : '') + ' · lista completa: [CONFIRM]';
    }
    input.addEventListener('input', run);
    run();
  });

  var KEY = 'feelin_consent_v1';
  var banner = $('#cookie');
  var prefsForm = $('#cookie-prefs');
  function readConsent() {
    var raw = store(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function applyConsent(c) {
    /* Tag firing is gated here. In production: load GTM only if c.analytics, Meta Pixel only if c.marketing. */
    doc.documentElement.setAttribute('data-consent-analytics', c && c.analytics ? 'granted' : 'denied');
    doc.documentElement.setAttribute('data-consent-marketing', c && c.marketing ? 'granted' : 'denied');
  }
  function saveConsent(c) {
    c.date = new Date().toISOString();
    store(KEY, JSON.stringify(c));
    applyConsent(c);
    closeBanner();
    toast('Preferências de cookies salvas.');
  }
  function openBanner(showPrefs) {
    if (!banner) return;
    banner.hidden = false;
    var c = readConsent() || {};
    if (prefsForm) {
      prefsForm.analytics.checked = !!c.analytics;
      prefsForm.marketing.checked = !!c.marketing;
    }
    setPrefs(!!showPrefs);
  }
  function closeBanner() { if (banner) banner.hidden = true; }
  function setPrefs(show) {
    if (!prefsForm) return;
    prefsForm.hidden = !show;
    var pbtn = $('[data-cookie="prefs"]', banner), sbtn = $('[data-cookie="save"]', banner);
    if (pbtn) { pbtn.setAttribute('aria-expanded', String(show)); pbtn.hidden = show; }
    if (sbtn) sbtn.hidden = !show;
  }
  if (banner) {
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') saveConsent({ necessary: true, analytics: true, marketing: true });
      if (act === 'reject') saveConsent({ necessary: true, analytics: false, marketing: false });
      if (act === 'prefs') setPrefs(true);
      if (act === 'save') saveConsent({ necessary: true, analytics: prefsForm.analytics.checked, marketing: prefsForm.marketing.checked });
    });
    var existing = readConsent();
    applyConsent(existing);
    if (!existing) openBanner(false);
  }
  $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function () { openBanner(true); }); });
})();

/* Loja Hydro — mockup script (vanilla, sem dependências) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = body.getAttribute('data-wa') || '';
  var WA_DEFAULT = body.getAttribute('data-wa-default') || 'Olá!';

  function waHref(text) {
    if (!WA) return '#contato';
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text || WA_DEFAULT);
  }

  /* Ano no rodapé */
  var y = document.querySelectorAll('[data-year]');
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  /* Links de WhatsApp com mensagem própria */
  function wireWaLinks(scope) {
    var links = (scope || document).querySelectorAll('[data-wa-text]');
    for (var j = 0; j < links.length; j++) {
      links[j].setAttribute('href', waHref(links[j].getAttribute('data-wa-text')));
      if (WA) { links[j].setAttribute('target', '_blank'); links[j].setAttribute('rel', 'noopener'); }
    }
  }
  wireWaLinks();

  /* Header condensado */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); toggle.focus();
      }
    });
  }

  /* Revelação ao rolar */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* WhatsApp flutuante sensível à seção */
  var float = document.querySelector('.wa-float');
  var sections = document.querySelectorAll('[data-wa-section]');
  if (float && WA && 'IntersectionObserver' in window && sections.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) float.setAttribute('href', waHref(en.target.getAttribute('data-wa-section')));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* Filtro (chips + busca opcional) */
  document.querySelectorAll('[data-filter-chips]').forEach(function (chipWrap) {
    var grid = document.getElementById(chipWrap.getAttribute('data-filter-chips'));
    var status = document.getElementById(chipWrap.getAttribute('data-status'));
    var search = chipWrap.getAttribute('data-search') ? document.getElementById(chipWrap.getAttribute('data-search')) : null;
    var empty = chipWrap.getAttribute('data-empty') ? document.getElementById(chipWrap.getAttribute('data-empty')) : null;
    var unitSing = chipWrap.getAttribute('data-unit-singular') || 'item exibido';
    var unitPlur = chipWrap.getAttribute('data-unit-plural') || 'itens exibidos';
    var current = 'todos';
    function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function apply() {
      var q = search ? norm(search.value.trim()) : '';
      var n = 0;
      grid.querySelectorAll('[data-cat]').forEach(function (card) {
        var okCat = current === 'todos' || card.getAttribute('data-cat') === current;
        var okQ = !q || norm(card.textContent).indexOf(q) !== -1;
        var show = okCat && okQ;
        card.classList.toggle('is-hidden', !show);
        if (show) { n++; card.classList.add('is-in'); }
      });
      if (status) status.textContent = n + ' ' + (n === 1 ? unitSing : unitPlur) + (q ? ' para “' + search.value.trim() + '”' : '');
      if (empty) empty.classList.toggle('is-show', n === 0);
    }
    chipWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      current = btn.getAttribute('data-filter');
      chipWrap.querySelectorAll('button[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      apply();
    });
    if (search) {
      var deb;
      search.addEventListener('input', function () { clearTimeout(deb); deb = setTimeout(apply, 120); });
      var form = search.closest('form');
      if (form) form.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    }
  });

  /* Seletor de unidade (Multi Open Shopping A05 / Saco Grande) */
  var UNITS = {
    multi: { short: 'Multi · A05', long: 'Multi Open Shopping — Loja A05' },
    saco: { short: 'Saco Grande', long: 'Saco Grande' }
  };
  var UKEY = 'hydro-unit';
  var chipBtn = document.querySelector('.unit-chip');
  var menu = document.getElementById('unit-menu');
  function setUnit(u, announce) {
    if (!UNITS[u]) u = 'multi';
    try { localStorage.setItem(UKEY, u); } catch (e) {}
    body.setAttribute('data-unit', u);
    document.querySelectorAll('[data-unit-short]').forEach(function (el) { el.textContent = UNITS[u].short; });
    document.querySelectorAll('[data-unit-long]').forEach(function (el) { el.textContent = UNITS[u].long; });
    document.querySelectorAll('.store[data-store]').forEach(function (s) {
      var on = s.getAttribute('data-store') === u;
      s.classList.toggle('is-active', on);
      var tag = s.querySelector('.store-viewing');
      if (tag) tag.hidden = !on;
    });
    if (menu) menu.querySelectorAll('button[data-unit]').forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-unit') === u)); });
    if (announce && window.mockToast) window.mockToast('Você está vendo: ' + UNITS[u].long);
  }
  var saved = null;
  try { saved = localStorage.getItem(UKEY); } catch (e) {}
  var pageUnit = body.getAttribute('data-page-unit');
  setUnit(pageUnit || saved || 'multi', false);
  if (chipBtn && menu) {
    function closeMenu() { menu.classList.remove('is-open'); chipBtn.setAttribute('aria-expanded', 'false'); }
    chipBtn.addEventListener('click', function () {
      var open = chipBtn.getAttribute('aria-expanded') === 'true';
      chipBtn.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      if (!open) { var first = menu.querySelector('button[aria-checked="true"]') || menu.querySelector('button'); if (first) first.focus(); }
    });
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-unit]');
      if (!b) return;
      setUnit(b.getAttribute('data-unit'), true);
      closeMenu(); chipBtn.focus();
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.unit-switch')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }
  document.querySelectorAll('[data-set-unit]').forEach(function (b) {
    b.addEventListener('click', function () { setUnit(b.getAttribute('data-set-unit'), true); });
  });

  /* Mapa carregado só com clique (evita cookies de terceiros antes do consentimento) */
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = btn.closest('.map-frame');
      var ifr = document.createElement('iframe');
      ifr.src = btn.getAttribute('data-map-load');
      ifr.title = btn.getAttribute('data-map-title') || 'Mapa';
      ifr.loading = 'lazy';
      ifr.referrerPolicy = 'no-referrer-when-downgrade';
      frame.appendChild(ifr);
    });
  });

  /* Toast */
  var toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  body.appendChild(toast);
  var tt;
  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-show');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-show'); }, 3800);
  }
  window.mockToast = showToast;

  /* Formulários de demonstração */
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Mockup: formulário de demonstração — nada foi enviado ou armazenado.');
    });
  });

  /* Consentimento de cookies (LGPD) */
  var KEY = 'mock-cookie-consent-' + (body.getAttribute('data-site') || 'site');
  var banner = document.getElementById('cookie-banner');
  function store(val) { try { localStorage.setItem(KEY, JSON.stringify(val)); } catch (e) {} }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  if (banner) {
    var prefs = banner.querySelector('.cookie-prefs');
    var boxA = banner.querySelector('input[name="analytics"]');
    var boxM = banner.querySelector('input[name="marketing"]');
    var prefBtn = banner.querySelector('[data-cookie="prefs"]');
    function open() {
      var saved = read();
      if (boxA) boxA.checked = !!(saved && saved.analytics);
      if (boxM) boxM.checked = !!(saved && saved.marketing);
      banner.hidden = false;
      requestAnimationFrame(function () { banner.classList.add('is-open'); });
    }
    function close(val) {
      store(val);
      banner.classList.remove('is-open');
      setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 500);
      showToast('Preferências de cookies salvas.');
    }
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var a = b.getAttribute('data-cookie');
      var stamp = new Date().toISOString();
      if (a === 'accept') close({ necessary: true, analytics: true, marketing: true, at: stamp });
      if (a === 'reject') close({ necessary: true, analytics: false, marketing: false, at: stamp });
      if (a === 'prefs') {
        var hidden = prefs.hasAttribute('hidden');
        if (hidden) { prefs.removeAttribute('hidden'); b.textContent = 'Salvar preferências'; prefBtn.setAttribute('aria-expanded', 'true'); }
        else close({ necessary: true, analytics: !!boxA.checked, marketing: !!boxM.checked, at: stamp });
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); prefs.removeAttribute('hidden'); prefBtn.textContent = 'Salvar preferências'; prefBtn.setAttribute('aria-expanded', 'true'); open(); });
    });
    if (!read()) open();
  }
})();

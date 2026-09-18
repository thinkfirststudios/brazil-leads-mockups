/* =====================================================================
   TANGERINA MULTIMARCAS · Loja A04 — CONFIGURAÇÃO (edite só aqui)
   ---------------------------------------------------------------------
   BRANDS: marcas que a loja trabalha — SOMENTE nomes em texto (logos precisam de autorização).
     nome      — ex.: 'Nome da Marca'
     descricao — uma linha curta, ex.: 'Vestidos e alfaiataria'
   Enquanto nome for null, a página mostra o placeholder. A lista é ordenada automaticamente.
   Não inclua marcas que a loja não confirmou por escrito.
   ATUALIZE a data "atualizado em" no index.html sempre que mudar a lista ou as novidades.
   ===================================================================== */
const WHATSAPP = '5548991219524';
const WA_DEFAULT_TEXT = 'Olá! Vim pelo site da Tangerina Multimarcas (Loja A04, Multi Open).';
const CONSENT_KEY = 'tangerina_a04_consent_v1';
const HERO_INTERVAL_MS = 6500;

const BRANDS = [
  { nome: null, descricao: null },
  { nome: null, descricao: null },
  { nome: null, descricao: null },
  { nome: null, descricao: null },
  { nome: null, descricao: null },
  { nome: null, descricao: null },
  { nome: null, descricao: null },
  { nome: null, descricao: null }
];

(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24"><use href="#i-wa"/></svg>';

  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* header + menu */
  var header = d.querySelector('.site-header');
  function setHdr() { if (header) d.documentElement.style.setProperty('--hdr', header.getBoundingClientRect().bottom + 'px'); }
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 24); setHdr(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHdr);
  onScroll();
  var tog = d.querySelector('.nav-toggle'), nav = d.getElementById('site-nav');
  function setMenu(open) { tog.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); setHdr(); }
  if (tog && nav) {
    tog.addEventListener('click', function () { setMenu(tog.getAttribute('aria-expanded') !== 'true'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); tog.focus(); } });
  }

  /* stagger + reveals */
  d.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });
  var reveals = d.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* hero crossfade — desligado com prefers-reduced-motion */
  var frames = d.querySelectorAll('.hero__frame');
  if (frames.length > 1 && !reduce) {
    var cur = 0;
    setInterval(function () {
      if (d.hidden) return;
      frames[cur].classList.remove('is-active');
      cur = (cur + 1) % frames.length;
      frames[cur].classList.add('is-active');
    }, HERO_INTERVAL_MS);
  }

  /* WhatsApp contextual */
  function waHref(text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text || WA_DEFAULT_TEXT); }
  d.querySelectorAll('[data-wa]').forEach(function (a) {
    var sec = a.closest('[data-wa-text]');
    a.href = waHref(sec ? sec.getAttribute('data-wa-text') : WA_DEFAULT_TEXT);
  });
  d.querySelectorAll('[data-wa-msg]').forEach(function (a) { a.href = waHref(a.getAttribute('data-wa-msg')); });
  var floating = d.querySelectorAll('.wa-float, .mbar [data-wa], .header__wa');
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var h = waHref(en.target.getAttribute('data-wa-text')); floating.forEach(function (a) { a.href = h; }); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    d.querySelectorAll('main [data-wa-text]').forEach(function (s) { secIO.observe(s); });
  }

  /* carrossel de novidades (sem autoplay) */
  var rail = d.getElementById('rail');
  if (rail) {
    d.querySelectorAll('[data-rail]').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = rail.querySelector('.piece');
        var step = card ? card.getBoundingClientRect().width + 18 : 300;
        rail.scrollBy({ left: b.getAttribute('data-rail') === 'next' ? step : -step, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    rail.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { rail.scrollBy({ left: 300 }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { rail.scrollBy({ left: -300 }); e.preventDefault(); }
    });
  }

  /* ---------- índice de marcas ---------- */
  var list = d.getElementById('brand-list');
  var q = d.getElementById('brand-q');
  var countEl = d.getElementById('brand-count');
  var emptyEl = d.getElementById('brand-empty');
  var lettersEl = d.getElementById('brand-letters');
  var letter = '';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  var items = BRANDS.map(function (b, i) {
    var label = b.nome || ('marca ' + String(i + 1).padStart(2, '0'));
    return { b: b, i: i, label: label, first: b.nome ? norm(b.nome).charAt(0).toUpperCase() : '' };
  }).sort(function (a, b) {
    if (a.b.nome && b.b.nome) return a.b.nome.localeCompare(b.b.nome, 'pt-BR');
    return a.i - b.i;
  });

  function buildLetters() {
    if (!lettersEl) return;
    var have = {};
    items.forEach(function (o) { if (o.first) have[o.first] = true; });
    var html = '<button type="button" class="letter" data-letter="" aria-pressed="true">Todas</button>';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (L) {
      html += '<button type="button" class="letter" data-letter="' + L + '" aria-pressed="false"' + (have[L] ? '' : ' disabled') + '>' + L + '</button>';
    });
    if (!Object.keys(have).length) html += '<span class="letters__note">As letras são ativadas quando a lista real de marcas for inserida.</span>';
    lettersEl.innerHTML = html;
    lettersEl.addEventListener('click', function (e) {
      var b = e.target.closest('.letter'); if (!b || b.disabled) return;
      letter = b.getAttribute('data-letter');
      lettersEl.querySelectorAll('.letter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render(true);
    });
  }
  function row(o, k) {
    var name = o.b.nome ? esc(o.b.nome) : '<span class="ph">[PLACEHOLDER: ' + o.label + ']</span>';
    var init = o.b.nome ? esc(o.first) : '?';
    var desc = o.b.descricao ? esc(o.b.descricao) : '<span class="ph">[PLACEHOLDER: descrição em uma linha]</span>';
    var msg = 'Olá! Vocês têm peças da ' + (o.b.nome || o.label) + ' na loja?';
    return '<li class="brand" style="--i:' + k + '"><span class="brand__init" aria-hidden="true">' + init + '</span>' +
      '<div><p class="brand__name">' + name + '</p><p class="brand__desc">' + desc + '</p></div>' +
      '<a class="brand__ask" href="' + waHref(msg) + '" target="_blank" rel="noopener">' + WA_ICON + ' perguntar no WhatsApp</a></li>';
  }
  function render(animate) {
    if (!list) return;
    var term = norm(q && q.value);
    var shown = items.filter(function (o) {
      return (!letter || o.first === letter) && (!term || norm(o.label).indexOf(term) !== -1);
    });
    list.innerHTML = shown.map(row).join('');
    if (animate && !reduce) list.querySelectorAll('.brand').forEach(function (el) { el.classList.add('is-entering'); });
    countEl.textContent = shown.length === 1 ? '1 marca' : shown.length + ' marcas';
    emptyEl.hidden = shown.length !== 0;
  }
  if (list) {
    buildLetters();
    if (q) { var t; q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { render(true); }, 120); }); }
    d.querySelectorAll('[data-brand-clear]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (q) q.value = ''; letter = '';
        lettersEl.querySelectorAll('.letter').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-letter') === '')); });
        render(true); if (q) q.focus();
      });
    });
    render(false);
  }

  /* mapa sob demanda (LGPD) */
  d.querySelectorAll('[data-map-load]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map-src]');
      var f = d.createElement('iframe');
      f.src = box.getAttribute('data-map-src');
      f.title = box.getAttribute('data-map-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.appendChild(f);
      box.querySelector('.map__panel').hidden = true;
      f.focus();
    });
  });

  /* LGPD: cookies */
  var ck = d.getElementById('cookie');
  if (!ck) return;
  var prefs = d.getElementById('cookie-prefs');
  var btnPrefs = ck.querySelector('[data-cookie="prefs"]');
  var btnSave = ck.querySelector('[data-cookie="save"]');
  function readConsent() { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; } }
  function writeConsent(v) { v.date = new Date().toISOString(); try { localStorage.setItem(CONSENT_KEY, JSON.stringify(v)); } catch (e) {} }
  function showPrefs(on) { prefs.hidden = !on; btnSave.hidden = !on; btnPrefs.setAttribute('aria-expanded', String(on)); }
  function openCookie(withPrefs) {
    var c = readConsent() || {};
    prefs.querySelector('[name="analytics"]').checked = !!c.analytics;
    prefs.querySelector('[name="marketing"]').checked = !!c.marketing;
    showPrefs(!!withPrefs);
    ck.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { ck.classList.add('is-open'); }); });
    if (withPrefs) ck.querySelector('button').focus();
  }
  function closeCookie() { ck.classList.remove('is-open'); setTimeout(function () { ck.hidden = true; }, reduce ? 0 : 450); }
  ck.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cookie]'); if (!b) return;
    var act = b.getAttribute('data-cookie');
    if (act === 'accept') { writeConsent({ necessary: true, analytics: true, marketing: true }); closeCookie(); }
    else if (act === 'reject') { writeConsent({ necessary: true, analytics: false, marketing: false }); closeCookie(); }
    else if (act === 'prefs') { showPrefs(prefs.hidden); }
    else if (act === 'save') {
      writeConsent({ necessary: true, analytics: prefs.querySelector('[name="analytics"]').checked, marketing: prefs.querySelector('[name="marketing"]').checked });
      closeCookie();
    }
  });
  if (!readConsent()) setTimeout(function () { openCookie(false); }, 600);
  d.querySelectorAll('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function () { openCookie(true); }); });
})();

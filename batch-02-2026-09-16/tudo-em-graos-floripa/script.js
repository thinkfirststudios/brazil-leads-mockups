/* =====================================================================
   TUDO EM GRÃOS FLORIPA · Loja A06 — CONFIGURAÇÃO (edite só aqui)
   ---------------------------------------------------------------------
   PRODUCTS: índice de produtos. Para cada item preencha:
     nome     — ex.: 'Castanha-do-pará'
     unidade  — base do preço: 'kg', '100 g' ou 'g'   (CDC: sempre informar)
     preco    — número em reais, ex.: 89.9   → exibido como R$ 89,90 / kg
     dietas   — qualquer combinação de: 'sem-gluten', 'sem-lactose', 'vegano', 'integral', 'a-granel'
                (o termo "orgânico" NÃO pode ser usado sem certificação — Lei 10.831/2003)
   Enquanto um campo for null, a página mostra o placeholder.
   ATUALIZE também a data "atualizado em" no index.html sempre que mudar preços.
   ===================================================================== */
const WHATSAPP = '5548991032636';
const WA_DEFAULT_TEXT = 'Olá! Vim pelo site da Tudo em Grãos (Loja A06, Multi Open).';
const CONSENT_KEY = 'tudoemgraos_a06_consent_v1';

/* As dietas abaixo são SÓ DEMONSTRAÇÃO do filtro — substituir pelos dados reais. */
const PRODUCTS = [
  { nome: null, unidade: null, preco: null, dietas: ['sem-gluten', 'vegano', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['vegano', 'integral', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['sem-gluten', 'sem-lactose', 'vegano'] },
  { nome: null, unidade: null, preco: null, dietas: ['integral', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['sem-lactose', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['sem-gluten', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['vegano', 'sem-lactose'] },
  { nome: null, unidade: null, preco: null, dietas: ['sem-gluten', 'sem-lactose', 'vegano', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['integral'] },
  { nome: null, unidade: null, preco: null, dietas: ['sem-gluten', 'integral', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['vegano', 'a-granel'] },
  { nome: null, unidade: null, preco: null, dietas: ['sem-lactose'] }
];
const DIET_LABELS = { 'sem-gluten': 'sem glúten', 'sem-lactose': 'sem lactose', 'vegano': 'vegano', 'integral': 'integral', 'a-granel': 'a granel' };

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
  function setMenu(open) {
    tog.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    setHdr();
  }
  if (tog && nav) {
    tog.addEventListener('click', function () { setMenu(tog.getAttribute('aria-expanded') !== 'true'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); tog.focus(); }
    });
  }

  /* stagger + reveals */
  d.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });
  var io = null;
  function observe(list) {
    if (reduce || !('IntersectionObserver' in window)) { list.forEach(function (el) { el.classList.add('is-visible'); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    list.forEach(function (el) { io.observe(el); });
  }
  observe(d.querySelectorAll('.reveal'));

  /* parallax */
  var par = d.querySelector('[data-parallax]');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { par.style.transform = 'translate3d(0,' + (Math.min(window.scrollY, 900) * 0.15) + 'px,0)'; ticking = false; });
    }, { passive: true });
  }

  /* WhatsApp contextual */
  function waHref(text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text || WA_DEFAULT_TEXT); }
  var floating = d.querySelectorAll('.wa-float, .mbar [data-wa], .header__wa');
  function applyStatic() {
    d.querySelectorAll('[data-wa]').forEach(function (a) {
      var sec = a.closest('[data-wa-text]');
      a.href = waHref(sec ? sec.getAttribute('data-wa-text') : WA_DEFAULT_TEXT);
    });
  }
  applyStatic();
  if ('IntersectionObserver' in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var href = waHref(en.target.getAttribute('data-wa-text'));
          floating.forEach(function (a) { a.href = href; });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    d.querySelectorAll('main [data-wa-text]').forEach(function (s) { secIO.observe(s); });
  }

  /* ---------- índice de produtos ---------- */
  var grid = d.getElementById('product-grid');
  var q = d.getElementById('q');
  var countEl = d.getElementById('result-count');
  var emptyEl = d.getElementById('product-empty');
  var chips = d.querySelectorAll('.chip[data-diet]');
  var clearBtns = d.querySelectorAll('[data-clear]');
  var active = [];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function price(p) {
    if (p.preco == null) return 'R$ <span class="ph">[PLACEHOLDER — cliente informar]</span>';
    return 'R$ ' + Number(p.preco).toFixed(2).replace('.', ',') + (p.unidade ? ' / ' + esc(p.unidade) : '');
  }
  function card(p, i) {
    var n = String(i + 1).padStart(2, '0');
    var name = p.nome ? esc(p.nome) : '<span class="ph">[PLACEHOLDER: produto ' + n + ']</span>';
    var unit = p.unidade ? 'Unidade: ' + esc(p.unidade) : 'Unidade: <span class="ph">[PLACEHOLDER: g / kg / 100g]</span>';
    var ask = 'Olá! Tem disponível: ' + (p.nome || 'produto ' + n) + '? (vi no site)';
    var tags = p.dietas.map(function (t) { return '<li>' + DIET_LABELS[t] + '</li>'; }).join('');
    return '<li class="product" style="--i:' + i + '">' +
      '<span class="product__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 21c4-3 7-7 7-11a7 7 0 0 0-14 0c0 4 3 8 7 11zM12 21V9M12 13l-3-2M12 11l3-2"/></svg></span>' +
      '<h3>' + name + '</h3>' +
      '<p class="product__unit">' + unit + '</p>' +
      '<p class="product__price">' + price(p) + '</p>' +
      '<ul class="product__tags" aria-label="Dietas">' + tags + '</ul>' +
      '<a class="product__ask" href="' + waHref(ask) + '" target="_blank" rel="noopener">' + WA_ICON + ' perguntar no WhatsApp</a>' +
      '</li>';
  }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function render(animate) {
    if (!grid) return;
    var term = norm(q && q.value);
    var list = PRODUCTS.map(function (p, i) { return { p: p, i: i }; }).filter(function (o) {
      var okDiet = active.every(function (a) { return o.p.dietas.indexOf(a) !== -1; });
      var hay = norm((o.p.nome || 'produto ' + String(o.i + 1).padStart(2, '0')) + ' ' + o.p.dietas.map(function (t) { return DIET_LABELS[t]; }).join(' '));
      return okDiet && (!term || hay.indexOf(term) !== -1);
    });
    grid.innerHTML = list.map(function (o, k) { return card(o.p, o.i).replace('style="--i:' + o.i + '"', 'style="--i:' + k + '"'); }).join('');
    if (animate && !reduce) grid.querySelectorAll('.product').forEach(function (el) { el.classList.add('is-entering'); });
    var n = list.length;
    countEl.textContent = n === 1 ? '1 produto' : n + ' produtos';
    emptyEl.hidden = n !== 0;
    clearBtns.forEach(function (b) { if (b.classList.contains('chip')) b.hidden = !active.length && !(q && q.value); });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var k = c.getAttribute('data-diet');
      var on = c.getAttribute('aria-pressed') !== 'true';
      c.setAttribute('aria-pressed', String(on));
      if (on) active.push(k); else active = active.filter(function (x) { return x !== k; });
      render(true);
    });
  });
  clearBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      active = []; chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      if (q) q.value = '';
      render(true);
    });
  });
  if (q) { var t; q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { render(true); }, 120); }); }
  render(false);

  /* ---------- mapa sob demanda (LGPD) ---------- */
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

  /* ---------- LGPD: cookies ---------- */
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

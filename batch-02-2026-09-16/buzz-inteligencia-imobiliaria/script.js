/* Buzz Inteligência Imobiliária — mockup script (sem dependências). */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = (doc.documentElement.getAttribute('lang') || 'pt-BR').slice(0, 2);
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) {
    try {
      if (v === undefined) return window.localStorage.getItem(k);
      window.localStorage.setItem(k, v);
    } catch (e) { return null; }
    return null;
  }
  var T = {
    pt: { any: 'Qualquer valor', allB: 'Todos os bairros', demo: 'Demonstração: a busca abriria ', cnt: ' — contagem de resultados virá do estoque real [CONFIRM].', sent: 'Mockup: formulário de demonstração — nada foi enviado nem armazenado.', need: 'Para enviar, marque o consentimento de uso dos dados (LGPD).', map: 'Mapa: ', ficha: 'Ficha do bairro — ' },
    es: { any: 'Cualquier valor', allB: 'Todos los barrios', demo: 'Demostración: la búsqueda abriría ', cnt: ' — el número de resultados vendrá del inventario real [CONFIRM].', sent: 'Mockup: formulario de demostración — no se envió ni guardó nada.', need: 'Para enviar, marque el consentimiento de uso de datos (LGPD).', map: 'Mapa: ', ficha: 'Ficha del barrio — ' },
    en: { any: 'Any price', allB: 'All neighbourhoods', demo: 'Demo: the search would open ', cnt: ' — result counts will come from live inventory [CONFIRM].', sent: 'Mockup: demo form — nothing was sent or stored.', need: 'To send, please tick the data-use consent (LGPD).', map: 'Map: ', ficha: 'Neighbourhood data sheet — ' }
  }[lang] || null;

  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* header */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var toggle = $('.menu-toggle'), nav = $('#main-nav');
  function closeMenu() {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    doc.body.style.overflow = '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      if (open && header) nav.style.setProperty('--nav-top', Math.max(header.getBoundingClientRect().bottom, 0) + 'px');
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1080) closeMenu(); });
  }

  /* reveals */
  $$('[data-stagger]').forEach(function (g) {
    var step = parseInt(g.getAttribute('data-stagger'), 10) || 100;
    $$(':scope > .rv', g).forEach(function (el, i) { el.style.setProperty('--d', (i * step) + 'ms'); });
  });
  var rv = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(function (e) { e.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (e) { io.observe(e); });
  }

  /* count-up: only [data-count] (verified figures). Never used inside the data register fichas. */
  var counters = $$('[data-count]');
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    if (reduce) { el.textContent = String(target); return; }
    var t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1200, 1);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { runCount(x.target); cio.unobserve(x.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* hero parallax */
  var px = $('[data-parallax]');
  if (px && !reduce) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        px.style.transform = 'translate3d(0,' + (Math.min(window.scrollY, 900) * -0.12) + 'px,0)';
        tick = false;
      });
    }, { passive: true });
  }

  /* generic tablists (search mode + FAQ) — arrow-key operable */
  $$('[role="tablist"]').forEach(function (tl) {
    var tabs = $$('[role="tab"]', tl);
    function sel(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        var pid = x.getAttribute('aria-controls');
        var p = pid ? doc.getElementById(pid) : null;
        if (p && tl.hasAttribute('data-panels')) p.hidden = !on;
      });
      if (focus) t.focus();
      tl.dispatchEvent(new CustomEvent('tabchange', { detail: t }));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { sel(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); sel(n, true); }
      });
    });
  });

  /* search: mode-bound price ladder + region→bairro (their own taxonomy) */
  var form = $('#busca');
  if (form && T) {
    var L = {
      pt: {
        comprar: ['até R$ 500 mil', 'R$ 500 mil – R$ 1 milhão', 'R$ 1 – 2 milhões', 'R$ 2 – 5 milhões', 'acima de R$ 5 milhões'],
        alugar: ['até R$ 2.000/mês', 'R$ 2.000 – R$ 4.000/mês', 'R$ 4.000 – R$ 8.000/mês', 'acima de R$ 8.000/mês'],
        lancamentos: ['até R$ 1 milhão', 'R$ 1 – 3 milhões', 'acima de R$ 3 milhões']
      },
      es: {
        comprar: ['hasta R$ 500 mil', 'R$ 500 mil – R$ 1 millón', 'R$ 1 – 2 millones', 'R$ 2 – 5 millones', 'más de R$ 5 millones'],
        alugar: ['hasta R$ 2.000/mes', 'R$ 2.000 – R$ 4.000/mes', 'R$ 4.000 – R$ 8.000/mes', 'más de R$ 8.000/mes'],
        lancamentos: ['hasta R$ 1 millón', 'R$ 1 – 3 millones', 'más de R$ 3 millones']
      },
      en: {
        comprar: ['up to R$ 500k', 'R$ 500k – R$ 1m', 'R$ 1m – 2m', 'R$ 2m – 5m', 'over R$ 5m'],
        alugar: ['up to R$ 2,000/month', 'R$ 2,000 – 4,000/month', 'R$ 4,000 – 8,000/month', 'over R$ 8,000/month'],
        lancamentos: ['up to R$ 1m', 'R$ 1m – 3m', 'over R$ 3m']
      }
    }[lang];
    var priceSel = $('#s-valor', form);
    var priceLbl = $('#s-valor-lbl', form);
    var labels = JSON.parse(priceLbl.getAttribute('data-labels') || '{}');
    var mode = 'comprar';
    function applyMode(m) {
      mode = m;
      priceSel.innerHTML = '';
      priceSel.name = m === 'alugar' ? 'valor_locacao' : 'valor_venda';
      [T.any].concat(L[m]).forEach(function (t, i) {
        var o = doc.createElement('option'); o.value = i ? String(i) : ''; o.textContent = t; priceSel.appendChild(o);
      });
      if (labels[m]) priceLbl.textContent = labels[m];
      $$('[data-only]', form).forEach(function (el) { el.hidden = el.getAttribute('data-only') !== m; });
    }
    var modeTabs = $('#busca-tabs');
    if (modeTabs) modeTabs.addEventListener('tabchange', function (e) { applyMode(e.detail.getAttribute('data-mode')); });
    applyMode('comprar');

    var BAIRROS = JSON.parse($('#bairros-data').textContent);
    var reg = $('#s-regiao', form), bai = $('#s-bairro', form);
    function fillB() {
      var r = reg.value;
      bai.innerHTML = '';
      var o0 = doc.createElement('option'); o0.value = ''; o0.textContent = T.allB; bai.appendChild(o0);
      Object.keys(BAIRROS).forEach(function (k) {
        if (r && r !== k) return;
        var g = doc.createElement('optgroup'); g.label = k;
        BAIRROS[k].forEach(function (b) { var o = doc.createElement('option'); o.textContent = b; g.appendChild(o); });
        bai.appendChild(g);
      });
    }
    reg.addEventListener('change', fillB);
    fillB();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('#busca-status');
      var path = (mode === 'alugar' ? '/alugar/' : mode === 'lancamentos' ? '/lancamentos/' : '/comprar/') + (reg.value ? reg.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-') + '/' : '');
      if (st) st.textContent = T.demo + path + T.cnt;
    });
  }
  // region tiles pre-select the search
  $$('[data-pick-region]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = $('#s-regiao');
      if (r) { r.value = a.getAttribute('data-pick-region'); r.dispatchEvent(new Event('change')); }
    });
  });

  /* ficha: bairro selector — caption only; values stay [CONFIRM] until sourced */
  var fsel = $('#ficha-bairro');
  if (fsel && T) {
    fsel.addEventListener('change', function () {
      var cap = $('#ficha-caption');
      if (cap) cap.textContent = T.ficha + fsel.value;
      $$('[data-ficha-name]').forEach(function (el) { el.textContent = fsel.value; });
    });
  }

  /* click-to-load maps (LGPD: nothing third-party before an explicit click) */
  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var holder = doc.getElementById(btn.getAttribute('data-map-load'));
      if (!holder) return;
      var q = btn.getAttribute('data-map-query') || '';
      var f = doc.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
      f.title = (T ? T.map : 'Mapa: ') + q;
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.style.cssText = 'border:0;width:100%;height:280px;display:block';
      holder.innerHTML = '';
      holder.appendChild(f);
      holder.classList.add('is-loaded');
      btn.hidden = true;
    });
  });

  /* stage chips */
  $$('[data-stage-filter]').forEach(function (g) {
    var btns = $$('button', g), target = doc.getElementById(g.getAttribute('data-stage-filter'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var s = b.getAttribute('data-stage');
        $$('[data-stage]', target).forEach(function (c) { c.hidden = !(s === 'todos' || c.getAttribute('data-stage') === s); });
      });
    });
  });

  /* carousels */
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.carousel-track', wrap);
    function by(d) {
      var it = track.firstElementChild;
      track.scrollBy({ left: d * (it ? it.getBoundingClientRect().width + 16 : 300), behavior: reduce ? 'auto' : 'smooth' });
    }
    var p = $('[data-prev]', wrap), n = $('[data-next]', wrap);
    if (p) p.addEventListener('click', function () { by(-1); });
    if (n) n.addEventListener('click', function () { by(1); });
  });

  /* favourites */
  $$('.fav').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); });
  });

  /* demo forms */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.form-notice', f), c = $('input[data-consent]', f);
      if (!T || !note) return;
      note.hidden = false;
      if (c && !c.checked) { note.textContent = T.need; c.focus(); return; }
      note.textContent = T.sent;
    });
  });

  /* LGPD cookie banner — non-essential tags gated on consent */
  var KEY = 'buzz_cookie_consent_v1';
  var banner = $('#cookie');
  function activate(c) {
    $$('script[type="text/plain"][data-consent]').forEach(function (s) {
      if (c[s.getAttribute('data-consent')] && !s.getAttribute('data-done')) {
        var n = doc.createElement('script'); n.text = s.text; s.setAttribute('data-done', '1'); doc.body.appendChild(n);
      }
    });
  }
  function save(c) { c.data = new Date().toISOString(); store(KEY, JSON.stringify(c)); banner.hidden = true; activate(c); }
  if (banner) {
    var prefs = $('#cookie-prefs'), a = $('#ck-analise'), m = $('#ck-marketing'), pb = $('#ck-prefs');
    var saved = null;
    try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved) banner.hidden = false; else activate(saved);
    $('#ck-accept').addEventListener('click', function () { save({ necessarios: true, analise: true, marketing: true }); });
    $('#ck-reject').addEventListener('click', function () { save({ necessarios: true, analise: false, marketing: false }); });
    pb.addEventListener('click', function () { prefs.hidden = !prefs.hidden; pb.setAttribute('aria-expanded', String(!prefs.hidden)); });
    $('#ck-save').addEventListener('click', function () { save({ necessarios: true, analise: a.checked, marketing: m.checked }); });
    $$('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        var cur = null;
        try { cur = JSON.parse(store(KEY) || 'null'); } catch (e) { cur = null; }
        a.checked = !!(cur && cur.analise); m.checked = !!(cur && cur.marketing);
        banner.hidden = false; prefs.hidden = false; pb.setAttribute('aria-expanded', 'true'); a.focus();
      });
    });
  }
})();

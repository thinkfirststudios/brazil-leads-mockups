/* Brognoli Imóveis — mockup script (sem dependências). */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  /* ---------- year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- sticky header condense ---------- */
  var header = $('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var nav = $('#main-nav');
  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    doc.body.style.overflow = '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      if (open && header) {
        var r = header.getBoundingClientRect();
        nav.style.setProperty('--nav-top', Math.max(r.bottom, 0) + 'px');
      }
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1080) closeMenu(); });
  }
  // close desktop dropdowns on outside click
  doc.addEventListener('click', function (e) {
    $$('details[data-autoclose][open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });

  /* ---------- reveal on scroll ---------- */
  var rvEls = $$('.rv');
  // stagger siblings inside [data-stagger]
  $$('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 100;
    $$(':scope > .rv', group).forEach(function (el, i) { el.style.setProperty('--d', (i * step) + 'ms'); });
  });
  if (reduce || !('IntersectionObserver' in window)) {
    rvEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rvEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up (only [data-count] with verified values) ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
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
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { cio.observe(c); });
    } else { counters.forEach(runCount); }
  }

  /* ---------- hero parallax (transform only) ---------- */
  var heroImg = $('[data-parallax]');
  if (heroImg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroImg.style.transform = 'translate3d(0,' + (y * -0.12) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- search: mode-bound price ladder ----------
     Restores the Comprar/Alugar control that drives the existing
     val_venda / val_locacao ladder swap. Band values are UI filter
     steps only — [CONFIRM] against the live feed ladders. */
  var ladders = {
    comprar: { name: 'val_venda', label: 'Faixa de valor (venda)', opts: ['Qualquer valor', 'até R$ 300 mil', 'R$ 300 mil – R$ 600 mil', 'R$ 600 mil – R$ 1 milhão', 'R$ 1 milhão – R$ 2 milhões', 'acima de R$ 2 milhões'] },
    alugar: { name: 'val_locacao', label: 'Faixa de valor (aluguel/mês)', opts: ['Qualquer valor', 'até R$ 1.500/mês', 'R$ 1.500 – R$ 3.000/mês', 'R$ 3.000 – R$ 5.000/mês', 'R$ 5.000 – R$ 8.000/mês', 'acima de R$ 8.000/mês'] },
    lancamentos: { name: 'val_venda', label: 'Faixa de valor (lançamento)', opts: ['Qualquer valor', 'até R$ 500 mil', 'R$ 500 mil – R$ 1 milhão', 'acima de R$ 1 milhão'] }
  };
  var priceSel = $('#f-valor');
  var priceLabel = $('#f-valor-label');
  var searchForm = $('#busca');
  function applyMode(mode) {
    var l = ladders[mode];
    if (!l || !priceSel) return;
    priceSel.innerHTML = '';
    priceSel.name = l.name;
    l.opts.forEach(function (t, i) {
      var o = doc.createElement('option');
      o.value = i === 0 ? '' : String(i);
      o.textContent = t;
      priceSel.appendChild(o);
    });
    if (priceLabel) priceLabel.textContent = l.label;
    if (searchForm) searchForm.setAttribute('data-mode', mode);
    var btnTxt = $('#busca-submit-txt');
    if (btnTxt) btnTxt.textContent = mode === 'alugar' ? 'Buscar para alugar' : (mode === 'lancamentos' ? 'Buscar lançamentos' : 'Buscar para comprar');
  }
  $$('input[name="modo"]').forEach(function (r) {
    r.addEventListener('change', function () { if (r.checked) applyMode(r.value); });
  });
  var checked = $('input[name="modo"]:checked');
  if (checked) applyMode(checked.value);
  // deep links: #alugar-busca sets the mode
  $$('[data-set-mode]').forEach(function (a) {
    a.addEventListener('click', function () {
      var m = a.getAttribute('data-set-mode');
      var r = $('input[name="modo"][value="' + m + '"]');
      if (r) { r.checked = true; applyMode(m); }
    });
  });

  /* ---------- cidade multi-select summary ---------- */
  $$('.ms').forEach(function (ms) {
    var sum = $('summary .ms-value', ms);
    function upd() {
      var picked = $$('input:checked', ms).map(function (i) { return i.value; });
      if (sum) sum.textContent = picked.length === 0 ? 'Todas as cidades' : (picked.length === 1 ? picked[0] : picked.length + ' cidades');
    }
    ms.addEventListener('change', upd);
    upd();
  });

  /* ---------- bairro combobox (searchable, keyboard, multi) ---------- */
  $$('[data-combobox]').forEach(function (box) {
    var input = $('input', box);
    var list = $('ul', box);
    var chips = $('.chips', box.parentNode);
    var hidden = $('input[type=hidden]', box.parentNode);
    var options = JSON.parse(box.getAttribute('data-options') || '[]');
    var picked = [];
    var active = -1;
    function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function render() {
      var q = norm(input.value.trim());
      var matches = options.filter(function (o) { return !q || norm(o).indexOf(q) > -1; });
      list.innerHTML = '';
      if (!matches.length) {
        var li0 = doc.createElement('li');
        li0.className = 'combo-empty';
        li0.textContent = 'Nenhum bairro encontrado';
        li0.setAttribute('role', 'presentation');
        list.appendChild(li0);
      }
      matches.forEach(function (o, i) {
        var li = doc.createElement('li');
        li.id = input.id + '-opt-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === active ? 'true' : 'false');
        if (picked.indexOf(o) > -1) li.classList.add('is-picked');
        li.textContent = o;
        li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(o); });
        list.appendChild(li);
      });
      var foot = doc.createElement('li');
      foot.className = 'combo-foot';
      foot.setAttribute('role', 'presentation');
      foot.textContent = 'Amostra de ' + options.length + ' bairros · lista completa (~90) virá do feed [CONFIRM]';
      list.appendChild(foot);
      if (active > -1 && matches[active]) input.setAttribute('aria-activedescendant', input.id + '-opt-' + active);
      else input.removeAttribute('aria-activedescendant');
      return matches;
    }
    function open() { list.hidden = false; input.setAttribute('aria-expanded', 'true'); render(); }
    function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; input.removeAttribute('aria-activedescendant'); }
    function pick(o) {
      var i = picked.indexOf(o);
      if (i > -1) picked.splice(i, 1); else picked.push(o);
      input.value = '';
      drawChips();
      render();
    }
    function drawChips() {
      if (!chips) return;
      chips.innerHTML = '';
      picked.forEach(function (o) {
        var c = doc.createElement('span');
        c.className = 'chip';
        c.textContent = o + ' ';
        var b = doc.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Remover ' + o);
        b.textContent = '×';
        b.addEventListener('click', function () { pick(o); input.focus(); });
        c.appendChild(b);
        chips.appendChild(c);
      });
      if (hidden) hidden.value = picked.join(',');
    }
    input.addEventListener('focus', open);
    input.addEventListener('input', function () { active = -1; open(); });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
    input.addEventListener('keydown', function (e) {
      var matches = render();
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) open(); active = Math.min(active + 1, matches.length - 1); render(); scrollActive(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); render(); scrollActive(); }
      else if (e.key === 'Enter') { if (!list.hidden && matches[active]) { e.preventDefault(); pick(matches[active]); } }
      else if (e.key === 'Escape') { close(); }
      else if (e.key === 'Backspace' && !input.value && picked.length) { pick(picked[picked.length - 1]); }
    });
    function scrollActive() {
      var el = $('[aria-selected="true"]', list);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }
  });

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('#busca-status');
      var mode = searchForm.getAttribute('data-mode') || 'comprar';
      var path = mode === 'alugar' ? '/alugar/' : (mode === 'lancamentos' ? '/lancamentos/' : '/comprar/');
      if (st) st.textContent = 'Demonstração: a busca levaria a ' + path + ' com os filtros escolhidos. Contagem de resultados: [CONFIRM — virá do feed].';
    });
  }

  /* ---------- office locator ---------- */
  var officeList = $('#office-list');
  if (officeList) {
    var offices = $$('.office', officeList);
    var muniSel = $('#f-agencia-muni');
    var countEl = $('#office-count');
    function filterOffices() {
      var v = muniSel ? muniSel.value : '';
      var shown = 0;
      offices.forEach(function (o) {
        var m = o.getAttribute('data-municipio');
        var visible = !v || !m || m === v; // unconfirmed offices stay visible
        o.hidden = !visible;
        if (visible) shown++;
      });
      if (countEl) countEl.textContent = v ? ('Filtro: ' + v + ' — agências com município não confirmado continuam visíveis') : 'Todas as agências';
    }
    if (muniSel) muniSel.addEventListener('change', filterOffices);
    function activate(id) {
      offices.forEach(function (o) { o.classList.toggle('is-active', o.id === id); });
      $$('.map-pin').forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-office') === id); });
    }
    $$('.map-pin').forEach(function (p) {
      function go() {
        var id = p.getAttribute('data-office');
        activate(id);
        var card = doc.getElementById(id);
        if (card) {
          card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
          var f = $('h3', card); if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
        }
      }
      p.addEventListener('click', go);
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    offices.forEach(function (o) {
      o.addEventListener('mouseenter', function () { activate(o.id); });
      o.addEventListener('focusin', function () { activate(o.id); });
    });

    // geolocation needs its own explicit, revocable consent
    var geoBtn = $('#geo-btn');
    var geoBox = $('#geo-consent');
    var geoMsg = $('#geo-msg');
    if (geoBtn && geoBox) {
      geoBtn.addEventListener('click', function () {
        geoBox.hidden = false;
        var first = $('button', geoBox); if (first) first.focus();
      });
      $('#geo-deny', geoBox).addEventListener('click', function () {
        geoBox.hidden = true;
        store('brognoli_geo', 'denied');
        if (geoMsg) geoMsg.textContent = 'Localização não utilizada. Use o filtro por município.';
        geoBtn.focus();
      });
      $('#geo-allow', geoBox).addEventListener('click', function () {
        geoBox.hidden = true;
        store('brognoli_geo', 'granted-session');
        if (!('geolocation' in navigator)) {
          if (geoMsg) geoMsg.textContent = 'Seu navegador não oferece localização. Use o filtro por município.';
          return;
        }
        if (geoMsg) geoMsg.textContent = 'Solicitando localização ao navegador…';
        navigator.geolocation.getCurrentPosition(function () {
          if (geoMsg) geoMsg.textContent = 'Localização recebida (usada só nesta página, não armazenada). Ordenação por proximidade depende das coordenadas das agências [CONFIRM].';
        }, function () {
          if (geoMsg) geoMsg.textContent = 'Localização recusada ou indisponível. Use o filtro por município.';
        }, { timeout: 8000, maximumAge: 0 });
      });
    }
  }

  /* ---------- click-to-load maps (LGPD: no third-party embed before an explicit click) ---------- */
  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var holder = doc.getElementById(btn.getAttribute('data-map-load'));
      if (!holder) return;
      var q = btn.getAttribute('data-map-query') || '';
      var f = doc.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
      f.title = 'Mapa: ' + q;
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      f.style.cssText = 'border:0;width:100%;height:100%;min-height:320px;display:block';
      holder.innerHTML = '';
      holder.appendChild(f);
      holder.classList.add('is-loaded');
      btn.hidden = true;
    });
  });

  /* ---------- launches: stage chips ---------- */
  $$('[data-stage-filter]').forEach(function (group) {
    var btns = $$('button', group);
    var target = doc.getElementById(group.getAttribute('data-stage-filter'));
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var s = b.getAttribute('data-stage');
        if (!target) return;
        $$('[data-stage]', target).forEach(function (card) {
          card.hidden = !(s === 'todos' || card.getAttribute('data-stage') === s);
        });
      });
    });
  });

  /* ---------- carousels ---------- */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.carousel-track', c);
    var prev = $('[data-prev]', c.parentNode) || $('[data-prev]', c);
    var next = $('[data-next]', c.parentNode) || $('[data-next]', c);
    function by(dir) {
      var item = track.firstElementChild;
      var w = item ? item.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { by(-1); });
    if (next) next.addEventListener('click', function () { by(1); });
  });

  /* ---------- favourites ---------- */
  $$('.fav').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
    });
  });

  /* ---------- directory filter ---------- */
  var dirSel = $('#f-dir-agencia');
  if (dirSel) {
    dirSel.addEventListener('change', function () {
      var st = $('#dir-status');
      if (st) st.textContent = 'Demonstração: o filtro por agência usará o cadastro real de corretores [CONFIRM].';
    });
  }

  /* ---------- FAQ tabs ---------- */
  $$('[role="tablist"][data-tabs]').forEach(function (tl) {
    var tabs = $$('[role="tab"]', tl);
    function sel(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
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

  /* ---------- demo forms ---------- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.form-notice', f);
      var consent = $('input[data-consent]', f);
      if (consent && !consent.checked) {
        if (note) { note.hidden = false; note.textContent = 'Para enviar, marque o consentimento de uso dos dados (LGPD).'; }
        consent.focus();
        return;
      }
      if (note) { note.hidden = false; note.textContent = 'Mockup: formulário de demonstração — nada foi enviado nem armazenado.'; }
    });
  });

  /* ---------- LGPD cookie banner ----------
     Non-essential tags (e.g. GTM) must only load after consent.
     Scripts marked type="text/plain" data-consent="analise|marketing"
     are activated here. */
  var KEY = 'brognoli_cookie_consent_v1';
  var banner = $('#cookie');
  function activateTags(c) {
    $$('script[type="text/plain"][data-consent]').forEach(function (s) {
      var cat = s.getAttribute('data-consent');
      if (c[cat] && !s.getAttribute('data-done')) {
        var n = doc.createElement('script');
        n.text = s.text;
        s.setAttribute('data-done', '1');
        doc.body.appendChild(n);
      }
    });
  }
  function save(c) {
    store(KEY, JSON.stringify(c));
    if (banner) banner.hidden = true;
    activateTags(c);
  }
  if (banner) {
    var prefs = $('#cookie-prefs', banner);
    var cbA = $('#ck-analise', banner);
    var cbM = $('#ck-marketing', banner);
    var saved = null;
    try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved) banner.hidden = false; else activateTags(saved);
    $('#ck-accept', banner).addEventListener('click', function () { save({ necessarios: true, analise: true, marketing: true, data: new Date().toISOString() }); });
    $('#ck-reject', banner).addEventListener('click', function () { save({ necessarios: true, analise: false, marketing: false, data: new Date().toISOString() }); });
    $('#ck-prefs', banner).addEventListener('click', function () {
      prefs.hidden = !prefs.hidden;
      this.setAttribute('aria-expanded', String(!prefs.hidden));
    });
    $('#ck-save', banner).addEventListener('click', function () { save({ necessarios: true, analise: cbA.checked, marketing: cbM.checked, data: new Date().toISOString() }); });
    $$('[data-cookie-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        var cur = null;
        try { cur = JSON.parse(store(KEY) || 'null'); } catch (e) { cur = null; }
        cbA.checked = !!(cur && cur.analise);
        cbM.checked = !!(cur && cur.marketing);
        banner.hidden = false;
        prefs.hidden = false;
        $('#ck-prefs', banner).setAttribute('aria-expanded', 'true');
        cbA.focus();
      });
    });
  }
})();

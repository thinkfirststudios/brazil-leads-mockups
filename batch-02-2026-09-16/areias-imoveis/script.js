/* Areias Imóveis — mockup interactions (no framework) */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = 'areias_cookie_consent_v1';
  var FAV_KEY = 'areias_favoritos_v1';

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  /* Areas from the agency's own published location index (grouped honestly) */
  var PLACES = [
    { g: 'Florianópolis', items: ['Campeche', 'Rio Tavares', 'Ribeirão da Ilha', 'Morro das Pedras', 'Pântano do Sul', 'Lagoa da Conceição', 'Jurerê Internacional', 'Canasvieiras', 'Ingleses', 'Santo Antônio de Lisboa', 'Cacupé', 'Sambaqui', 'Centro', 'Coqueiros', 'Estreito', 'Trindade', 'Agronômica', 'Saco Grande', 'Carianos', 'Costeira do Pirajubaé'] },
    { g: 'Palhoça e Litoral Sul', items: ['Pinheira', 'Praia do Sonho', 'Guarda do Embaú', 'Passagem do Maciambu', 'Enseada do Brito', 'Balneário Ponta do Papagaio', 'Praia de Fora', 'Praia do Pontal', 'Aririú', 'Jardim Janaína', 'Pedra Branca', 'Nova Palhoça'] },
    { g: 'São José', items: ['Serraria', 'Kobrasol', 'Forquilhas', 'Barreiros', 'Bosque das Mansões', 'Real Parque', 'Ponte do Imaruim'] },
    { g: 'Outros', items: ['Garopaba', 'Ibiraquera', 'Palmas', 'Rancho Queimado', 'Águas Mornas'] }
  ];
  /* Named developments from the agency's own "Por Condomínio" search */
  var CONDOS = [
    ['Caminhos do Engenho 2', 'caminhos-do-engenho-2'], ['Ed. Residencial Orquídeas', 'ed-residencial-orquideas'], ['Gaivotas Golden Residence', 'gaivotas-golden-residence'],
    ['Harmonie Residencial', 'harmonie-residencial'], ['Loteamento Portal do Maciambu', 'loteamento-portal-do-maciambu'], ['Mentawai', 'mentawai'], ['Meridiem', 'meridiem'],
    ['Mondrian', 'mondrian'], ['Oceanic', 'oceanic'], ['Opera Palmas Residence', 'opera-palmas-residence'], ['Palmas Neo Classic', 'palmas-neo-classic'], ['Porto do Sol', 'porto-do-sol'],
    ['Reflect', 'reflect'], ['Residencial Campeche 2', 'residencial-campeche-2'], ['Residencial Golfinhos', 'residencial-golfinhos'], ['Residencial Hercílio Luz', 'residencial-hercilio-luz'],
    ['Residencial Veneza', 'residencial-veneza'], ['Villa Florença Residence', 'villa-florenca-residence'], ['Villa Toscana Residence', 'villa-toscana-residence']
  ];
  var SCALES = {
    comprar: ['Qualquer valor', 'Até R$ [CONFIRM faixa 1]', 'R$ [CONFIRM faixa 2]', 'Acima de R$ [CONFIRM faixa 3]'],
    alugar: ['Qualquer aluguel', 'Aluguel até R$ [CONFIRM]', 'Aluguel acima de R$ [CONFIRM]'],
    temporada: ['Qualquer diária', 'Diária até R$ [CONFIRM]', 'Diária acima de R$ [CONFIRM]']
  };

  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = $('.menu-toggle'), nav = $('#site-nav');
  if (toggle && nav) {
    var closeNav = function () { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (header) root.style.setProperty('--hdr', header.getBoundingClientRect().bottom + 'px');
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); toggle.focus(); } });
  }

  $$('[data-stagger]').forEach(function (g) { $$('[data-reveal]', g).forEach(function (el, i) { el.style.setProperty('--i', i % 8); }); });
  var revealEls = $$('[data-reveal], .search');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  var par = $('[data-parallax]');
  if (par && !reduce) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { par.style.transform = 'translate3d(0,' + Math.min(window.scrollY, 900) * 0.16 + 'px,0)'; tick = false; });
    }, { passive: true });
  }

  /* ---------- combobox (listbox pattern) ---------- */
  function combobox(input, build, onPick) {
    var list = doc.getElementById(input.getAttribute('aria-controls'));
    var active = -1;
    function options() { return $$('[role="option"]', list); }
    function render() {
      var q = norm(input.value);
      list.innerHTML = '';
      var n = 0;
      build().forEach(function (grp) {
        var matches = grp.items.filter(function (it) { return !q || norm(it.label).indexOf(q) > -1 || norm(grp.g || '').indexOf(q) > -1; });
        if (!matches.length) return;
        if (grp.g) {
          var h = doc.createElement('li'); h.className = 'group'; h.setAttribute('role', 'presentation'); h.textContent = grp.g; list.appendChild(h);
        }
        matches.forEach(function (it) {
          var li = doc.createElement('li');
          li.setAttribute('role', 'option'); li.id = input.id + '-opt-' + (n++);
          li.textContent = it.label; li.dataset.value = it.value || it.label;
          if (it.group) li.dataset.group = it.group;
          li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(li); });
          list.appendChild(li);
        });
      });
      if (!n) { var em = doc.createElement('li'); em.className = 'empty'; em.setAttribute('role', 'presentation'); em.textContent = 'Nenhum resultado'; list.appendChild(em); }
      active = -1; input.removeAttribute('aria-activedescendant');
    }
    function open() { render(); list.hidden = false; input.setAttribute('aria-expanded', 'true'); }
    function close() { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
    function move(d) {
      var o = options(); if (!o.length) return;
      if (active > -1) o[active].classList.remove('is-active');
      active = (active + d + o.length) % o.length;
      o[active].classList.add('is-active');
      o[active].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', o[active].id);
    }
    function pick(li) {
      input.value = li.textContent;
      options().forEach(function (o) { o.setAttribute('aria-selected', String(o === li)); });
      close();
      if (onPick) onPick(li);
    }
    input.addEventListener('focus', open);
    input.addEventListener('input', open);
    input.addEventListener('blur', function () { setTimeout(close, 120); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) open(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (list.hidden) open(); move(-1); }
      else if (e.key === 'Enter' && !list.hidden && active > -1) { e.preventDefault(); pick(options()[active]); }
      else if (e.key === 'Escape') { close(); }
    });
  }

  var search = $('[data-search]');
  if (search) {
    var base = search.getAttribute('data-base') || '';
    var where = $('#s-onde', search), condo = $('#s-condo', search);
    if (where) combobox(where, function () {
      return PLACES.map(function (g) { return { g: g.g, items: g.items.map(function (i) { return { label: i + ' — ' + g.g.replace(' e Litoral Sul', ''), value: i, group: g.g }; }) }; });
    });
    var condoStatus = $('#condo-pick', search);
    if (condo) combobox(condo, function () {
      return [{ g: '', items: CONDOS.map(function (c) { return { label: c[0], value: c[1] }; }) }];
    }, function (li) {
      if (condoStatus) {
        condoStatus.innerHTML = 'Condomínio selecionado: <a href="' + base + 'condominios/' + li.dataset.value + '/index.html">ver página de ' + li.textContent + ' →</a>';
      }
    });

    /* finalidade radiogroup */
    var seg = $('[role="radiogroup"]', search);
    var radios = $$('[role="radio"]', seg);
    var price = $('#s-valor', search);
    var fin = 'comprar';
    function setFin(i, focus) {
      radios.forEach(function (r, j) { r.setAttribute('aria-checked', String(j === i)); r.tabIndex = j === i ? 0 : -1; });
      seg.setAttribute('data-active', String(i));
      fin = radios[i].getAttribute('data-value');
      var temp = fin === 'temporada';
      search.classList.toggle('is-temp', temp);
      $$('[data-when]', search).forEach(function (el) {
        var show = el.getAttribute('data-when') === (temp ? 'temp' : 'std');
        el.hidden = !show;
      });
      if (price) {
        price.innerHTML = SCALES[fin].map(function (s) { return '<option>' + s + '</option>'; }).join('');
      }
      var lbl = $('#s-valor-label', search);
      if (lbl) lbl.textContent = temp ? 'Diária' : (fin === 'alugar' ? 'Aluguel' : 'Faixa de valor');
      if (focus) radios[i].focus();
    }
    radios.forEach(function (r, i) {
      r.addEventListener('click', function () { setFin(i); });
      r.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setFin((i + 1) % radios.length, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setFin((i - 1 + radios.length) % radios.length, true); }
      });
    });
    var startAt = parseInt(search.getAttribute('data-start') || '0', 10);
    setFin(startAt);

    var codeBtn = $('.code-link', search), codeBox = $('.code-box', search);
    if (codeBtn && codeBox) codeBtn.addEventListener('click', function () {
      codeBox.hidden = !codeBox.hidden;
      codeBtn.setAttribute('aria-expanded', String(!codeBox.hidden));
      if (!codeBox.hidden) $('input', codeBox).focus();
    });
    search.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = $('.form-status', search);
      if (s) s.textContent = 'Demonstração: a busca (' + fin + ') será ligada ao catálogo imoflex na implantação — resultados com URLs próprias por finalidade, região e condomínio.';
    });
  }

  /* tabs */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n); n.focus(); }
      });
    });
  });

  /* carousels */
  $$('[data-carousel]').forEach(function (c) {
    function track() { var ts = $$('.track', c).filter(function (t) { return t.offsetParent !== null; }); return ts[0]; }
    function step(t) { var f = t.firstElementChild; return f ? f.getBoundingClientRect().width + 20 : 300; }
    $$('[data-dir]', c).forEach(function (b) {
      b.addEventListener('click', function () {
        var t = track(); if (!t) return;
        t.scrollBy({ left: (b.getAttribute('data-dir') === 'prev' ? -1 : 1) * step(t), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* favourites counter */
  var favs = [];
  try { favs = JSON.parse(store(FAV_KEY) || '[]') || []; } catch (e) { favs = []; }
  var counter = $('.fav-count');
  function paintFavs() {
    if (counter) {
      counter.textContent = favs.length;
      if (!reduce) { counter.classList.add('bump'); setTimeout(function () { counter.classList.remove('bump'); }, 250); }
    }
    $$('.heart').forEach(function (h) { h.setAttribute('aria-pressed', String(favs.indexOf(h.getAttribute('data-id')) > -1)); });
  }
  $$('.heart').forEach(function (h) {
    h.addEventListener('click', function (e) {
      e.preventDefault();
      var id = h.getAttribute('data-id'), i = favs.indexOf(id);
      if (i > -1) favs.splice(i, 1); else favs.push(id);
      store(FAV_KEY, JSON.stringify(favs));
      paintFavs();
    });
  });
  paintFavs();

  /* demo forms */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', f), consent = $('input[name="lgpd"]', f);
      if (consent && !consent.checked) { if (status) status.textContent = 'Para enviar, marque o consentimento LGPD.'; consent.focus(); return; }
      if (status) status.textContent = 'Demonstração: nada foi enviado. Na versão final, os dados seguem para o WhatsApp da corretora.';
    });
  });

  /* click-to-load map */
  $$('.js-load-map').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.map-panel'), src = btn.getAttribute('data-src');
      if (!panel || !src) return;
      var f = doc.createElement('iframe');
      f.src = src; f.title = btn.getAttribute('data-title') || 'Mapa'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      panel.appendChild(f); btn.disabled = true;
    });
  });

  /* LGPD cookie banner */
  var banner = $('#cookie-banner');
  if (banner) {
    var prefs = $('#cookie-prefs', banner), cbA = $('#ck-analytics', banner), cbM = $('#ck-marketing', banner);
    var show = function () { banner.hidden = false; requestAnimationFrame(function () { banner.classList.add('is-visible'); }); };
    var hide = function () { banner.classList.remove('is-visible'); setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 450); };
    var save = function (a, m) { store(COOKIE_KEY, JSON.stringify({ necessarios: true, analise: !!a, marketing: !!m, data: new Date().toISOString() })); hide(); };
    var saved = null;
    try { saved = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved) show();
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') save(true, true);
      if (act === 'reject') save(false, false);
      if (act === 'prefs') { prefs.hidden = !prefs.hidden; b.setAttribute('aria-expanded', String(!prefs.hidden)); }
      if (act === 'save') save(cbA.checked, cbM.checked);
    });
    $$('.js-cookie-prefs').forEach(function (l) {
      l.addEventListener('click', function (e) {
        e.preventDefault();
        var cur = null;
        try { cur = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (er) { cur = null; }
        cbA.checked = !!(cur && cur.analise); cbM.checked = !!(cur && cur.marketing);
        prefs.hidden = false; show();
      });
    });
  }
})();

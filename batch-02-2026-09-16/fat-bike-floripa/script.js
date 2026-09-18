/* Fat Bike Floripa — mockup script (vanilla, sem dependências) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = body.getAttribute('data-wa') || '';
  var WA_DEFAULT = body.getAttribute('data-wa-default') || 'Olá!';
  var EN = (doc.getAttribute('lang') || '').indexOf('en') === 0;

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

  /* Parallax suave no hero (só transform) */
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroMedia.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* Tabela de tarifas a partir do JSON (editável) */
  var rateData = document.getElementById('tarifas-json');
  var rateTable = document.getElementById('rate-table');
  if (rateData && rateTable) {
    try {
      var R = JSON.parse(rateData.textContent);
      var ph = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(\[[^\]]+\])/g, '<span class="ph">$1</span>'); };
      var head = '<tr><th scope="col">' + ph(R.labels.bike) + '</th>' + R.durations.map(function (d) { return '<th scope="col">' + ph(d) + '</th>'; }).join('') + '</tr>';
      var rows = R.bikes.map(function (b) {
        return '<tr><th scope="row">' + ph(b.name) + '</th>' + b.rates.map(function (r) { return '<td>' + ph(r) + '</td>'; }).join('') + '</tr>';
      }).join('');
      rateTable.querySelector('thead').innerHTML = head;
      rateTable.querySelector('tbody').innerHTML = rows;
    } catch (e) { /* mantém a tabela estática */ }
  }

  /* Reserva por WhatsApp — nada é armazenado nem enviado a servidor */
  var bk = document.getElementById('booking');
  if (bk) {
    var track = bk.querySelector('.bk-track');
    var steps = bk.querySelectorAll('.bk-step');
    var dots = bk.querySelectorAll('.bk-dots li');
    var prevB = bk.querySelector('[data-bk-prev]');
    var nextB = bk.querySelector('[data-bk-next]');
    var sendB = bk.querySelector('[data-bk-send]');
    var cur = 0;
    var T = {
      pick: bk.getAttribute('data-msg-pick'),
      pickDate: bk.getAttribute('data-msg-date'),
      tpl: bk.getAttribute('data-template'),
      none: bk.getAttribute('data-msg-none') || '—'
    };
    var start = bk.querySelector('input[name="data-inicio"]');
    var end = bk.querySelector('input[name="data-fim"]');
    try {
      var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
      var iso = t.toISOString().slice(0, 10);
      if (start) start.min = iso;
      if (end) end.min = iso;
    } catch (e) {}
    function ddmm(v) { if (!v) return ''; var p = v.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
    function val(name) { var el = bk.querySelector('input[name="' + name + '"]:checked'); return el ? el.getAttribute('data-label') : ''; }
    function dates() {
      var s = start ? ddmm(start.value) : '';
      var e = end ? ddmm(end.value) : '';
      if (!s) return '';
      return e && e !== s ? s + ' → ' + e : s;
    }
    function summary() {
      var set = function (k, v) { var el = bk.querySelector('[data-sum="' + k + '"]'); if (el) el.textContent = v || T.none; };
      set('bike', val('bike')); set('date', dates()); set('dur', val('duracao'));
    }
    function go(i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      if (track && doc.classList.contains('js')) track.style.transform = 'translateX(' + (-100 * cur) + '%)';
      fit();
      steps.forEach(function (s, k) { s.setAttribute('aria-hidden', String(k !== cur)); s.querySelectorAll('input,button').forEach(function (x) { x.tabIndex = k === cur ? 0 : -1; }); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k <= cur); if (k === cur) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      if (prevB) prevB.disabled = cur === 0;
      if (nextB) nextB.hidden = cur === steps.length - 1;
      if (sendB) sendB.hidden = cur !== steps.length - 1;
    }
    function fit() { var vp = bk.querySelector('.bk-viewport'); if (vp && steps[cur]) vp.style.height = steps[cur].offsetHeight + 'px'; }
    window.addEventListener('resize', fit);
    function valid(i) {
      if (i === 0 && !val('bike')) { window.mockToast(T.pick); return false; }
      if (i === 1 && !(start && start.value)) { window.mockToast(T.pickDate); return false; }
      if (i === 2 && !val('duracao')) { window.mockToast(T.pick); return false; }
      return true;
    }
    bk.addEventListener('change', summary);
    bk.addEventListener('input', summary);
    if (nextB) nextB.addEventListener('click', function () { if (valid(cur)) { go(cur + 1); var f = steps[cur].querySelector('input'); if (f) f.focus({ preventScroll: true }); } });
    if (prevB) prevB.addEventListener('click', function () { go(cur - 1); });
    bk.addEventListener('submit', function (e) {
      e.preventDefault();
      for (var i = 0; i < steps.length; i++) { if (!valid(i)) { go(i); return; } }
      var msg = T.tpl.replace('{bike}', val('bike')).replace('{date}', dates()).replace('{dur}', val('duracao')).replace(/\\n/g, '\n');
      var url = waHref(msg);
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (err) {} } else { window.location.href = url; }
    });
    go(0); summary();
  }

  /* Mapa carregado só com clique (evita cookies de terceiros antes do consentimento) */
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = btn.closest('.map-frame');
      var ifr = document.createElement('iframe');
      ifr.src = btn.getAttribute('data-map-load');
      ifr.title = btn.getAttribute('data-map-title') || (EN ? 'Map' : 'Mapa');
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
      showToast(EN ? 'Mockup: demo form — nothing was sent or stored.' : 'Mockup: formulário de demonstração — nada foi enviado ou armazenado.');
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
      showToast(EN ? 'Cookie preferences saved.' : 'Preferências de cookies salvas.');
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
        if (hidden) { prefs.removeAttribute('hidden'); b.textContent = EN ? 'Save preferences' : 'Salvar preferências'; prefBtn.setAttribute('aria-expanded', 'true'); }
        else close({ necessary: true, analytics: !!boxA.checked, marketing: !!boxM.checked, at: stamp });
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); prefs.removeAttribute('hidden'); prefBtn.textContent = EN ? 'Save preferences' : 'Salvar preferências'; prefBtn.setAttribute('aria-expanded', 'true'); open(); });
    });
    if (!read()) open();
  }
})();

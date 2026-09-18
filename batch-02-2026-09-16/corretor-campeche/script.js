/* Corretor Campeche — mockup interactions. Sem dependências. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  /* Ano no rodapé */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Cabeçalho que condensa */
  var header = $('.site-header');
  var mbar = $('.mbar');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (mbar) mbar.classList.toggle('show', y > 160);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* Menu mobile */
  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');
  var backdrop = $('.nav-backdrop');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('show', open);
    if (open) { var first = $('a', nav); if (first) first.focus(); }
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    if (backdrop) backdrop.addEventListener('click', function () { setMenu(false); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
  }

  /* Revelação ao rolar, com escalonamento */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--i', String(i)); });
  });
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Parallax suave no hero (transform apenas) */
  var heroImg = $('[data-parallax]');
  if (heroImg && !reduce) {
    var pTick = false;
    window.addEventListener('scroll', function () {
      if (pTick) return;
      pTick = true;
      window.requestAnimationFrame(function () {
        var y = Math.min(window.scrollY || 0, 900);
        heroImg.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
        pTick = false;
      });
    }, { passive: true });
  }

  /* Barra de avaliação (hero) → preenche o formulário completo */
  var quick = $('#owner-bar');
  var avalForm = $('#form-avaliacao');
  if (quick && avalForm) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var end = $('#qb-endereco', quick).value;
      var tipo = $('#qb-tipo', quick).value;
      var fin = $('#qb-finalidade', quick).value;
      if (end) $('#av-endereco').value = end;
      if (tipo) { var r = avalForm.querySelector('input[name="tipo"][value="' + tipo + '"]'); if (r) r.checked = true; }
      if (fin) { var f = avalForm.querySelector('input[name="finalidade"][value="' + fin + '"]'); if (f) f.checked = true; }
      var target = $('#avaliacao');
      if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(function () { var n = $('#av-area'); if (n) n.focus({ preventScroll: true }); }, reduce ? 0 : 650);
    });
  }

  /* Formulários de demonstração (nada é enviado) */
  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', form);
      var consent = $('input[data-consent]', form);
      if (!status) return;
      status.classList.remove('error');
      if (consent && !consent.checked) {
        status.textContent = 'Para continuar, marque a caixa de consentimento (LGPD).';
        status.classList.add('error', 'show');
        consent.focus();
        return;
      }
      if (!form.checkValidity()) {
        status.textContent = 'Confira os campos obrigatórios.';
        status.classList.add('error', 'show');
        form.reportValidity();
        return;
      }
      status.textContent = 'MOCKUP: formulário de demonstração — nenhum dado foi enviado ou armazenado. No site real, o pedido chega ao corretor [CONFIRM canal: WhatsApp / e-mail].';
      status.classList.add('show');
    });
  });

  /* Abas de imóveis (Venda / Locação / Terrenos) */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = doc.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (on) {
            panel.classList.remove('enter');
            void panel.offsetWidth;
            panel.classList.add('enter');
          }
        }
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* Links do menu que abrem uma aba específica (ex.: Alugar) */
  $$('[data-tab-link]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = doc.getElementById('tab-' + a.getAttribute('data-tab-link'));
      if (t) t.click();
    });
  });

  /* Favoritos (preferência local do visitante) */
  var favKey = 'cc-favoritos';
  var favs = [];
  try { favs = JSON.parse(store(favKey) || '[]') || []; } catch (e) { favs = []; }
  var favCount = $('[data-fav-count]');
  function paintFavs() {
    $$('.fav-btn').forEach(function (b) {
      var on = favs.indexOf(b.getAttribute('data-id')) > -1;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (favCount) favCount.textContent = String(favs.length);
  }
  $$('.fav-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-id');
      var at = favs.indexOf(id);
      if (at > -1) favs.splice(at, 1); else favs.push(id);
      store(favKey, JSON.stringify(favs));
      paintFavs();
    });
  });
  paintFavs();

  /* Buscar por referência (código) */
  var refForm = $('#ref-search');
  if (refForm) {
    refForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = ($('#ref-code').value || '').trim();
      var out = $('#ref-status');
      if (!out) return;
      out.textContent = v
        ? 'Nenhum imóvel com o código “' + v + '” — os cards desta página são estruturas de demonstração, sem dados reais.'
        : 'Digite um código de referência.';
    });
  }

  /* FAQ — filtro por categoria */
  var faqBtns = $$('.faq-tabs button');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-cat');
      faqBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      $$('.faq details').forEach(function (d) {
        d.hidden = !(cat === 'todas' || d.getAttribute('data-cat') === cat);
      });
    });
  });

  /* Mapa: só carrega após clique (LGPD — sem terceiros antes do consentimento) */
  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.map-panel');
      if (!panel || panel.classList.contains('loaded')) return;
      var f = doc.createElement('iframe');
      f.src = btn.getAttribute('data-src');
      f.title = btn.getAttribute('data-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      panel.appendChild(f);
      panel.classList.add('loaded');
    });
  });

  /* Banner de cookies (LGPD) */
  var cKey = 'cc-cookie-consent';
  var banner = $('#cookie');
  function readConsent() { try { return JSON.parse(store(cKey) || 'null'); } catch (e) { return null; } }
  function saveConsent(obj) { obj.data = new Date().toISOString(); store(cKey, JSON.stringify(obj)); }
  function showBanner(withPrefs) {
    if (!banner) return;
    var c = readConsent() || {};
    var a = $('#ck-analise'), m = $('#ck-marketing');
    if (a) a.checked = !!c.analise;
    if (m) m.checked = !!c.marketing;
    $('.cookie-prefs', banner).classList.toggle('show', !!withPrefs);
    banner.classList.add('show');
    if (withPrefs) { var h = $('h2', banner); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }
  function hideBanner() { if (banner) banner.classList.remove('show'); }
  if (banner) {
    if (!readConsent()) showBanner(false);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { saveConsent({ necessarios: true, analise: true, marketing: true }); hideBanner(); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { saveConsent({ necessarios: true, analise: false, marketing: false }); hideBanner(); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () { $('.cookie-prefs', banner).classList.toggle('show'); });
    $('[data-ck="save"]', banner).addEventListener('click', function () {
      saveConsent({ necessarios: true, analise: $('#ck-analise').checked, marketing: $('#ck-marketing').checked });
      hideBanner();
    });
  }
  $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function () { showBanner(true); }); });
})();

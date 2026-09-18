/* Lucato Imóveis Floripa — mockup interactions (no framework) */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = 'lucato_cookie_consent_v1';

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* year */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* sticky header condense */
  var header = $('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (header) root.style.setProperty('--hdr', (header.getBoundingClientRect().bottom) + 'px');
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); toggle.focus(); }
    });
  }

  /* stagger index */
  $$('[data-stagger]').forEach(function (group) {
    $$('[data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--i', i % 8); });
  });

  /* scroll reveals */
  var revealEls = $$('[data-reveal], .doors');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* hero parallax (transform only) */
  var par = $('[data-parallax]');
  if (par && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        par.style.transform = 'translate3d(0,' + (y * 0.18) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* perícia context: sticky bar surfaces e-mail instead of WhatsApp */
  var cool = $$('[data-context="pericia"]');
  if (cool.length && 'IntersectionObserver' in window) {
    var visible = new Set();
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      doc.body.classList.toggle('in-pericia', visible.size > 0);
    }, { threshold: 0.15 });
    cool.forEach(function (el) { cio.observe(el); });
  }

  /* carousels */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.track', c);
    var prev = $('[data-dir="prev"]', c);
    var next = $('[data-dir="next"]', c);
    function step() { var first = track.firstElementChild; return first ? first.getBoundingClientRect().width + 18 : 300; }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
  });

  /* segmented buttons (finalidade) */
  $$('[data-seg]').forEach(function (seg) {
    var btns = $$('button', seg);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var target = seg.getAttribute('data-seg');
        var out = target && doc.getElementById(target);
        if (out) out.value = b.getAttribute('data-value');
      });
    });
  });

  /* tabs */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0];
        if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n); n.focus(); }
      });
    });
  });

  /* demo forms */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', f);
      var consent = $('input[name="lgpd"]', f);
      if (consent && !consent.checked) {
        if (status) status.textContent = 'Para enviar, marque o consentimento LGPD.';
        consent.focus();
        return;
      }
      if (status) status.textContent = 'Demonstração: nada foi enviado. Este formulário é apenas um mockup — o canal real será configurado após confirmação com a Lucato.';
    });
  });
  $$('[data-demo-search]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = $('.form-status', f);
      if (s) s.textContent = 'Demonstração: a busca será ligada ao catálogo real na implantação.';
    });
  });

  /* click-to-load map (no third-party embed before user action) */
  $$('.js-load-map').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.map-panel');
      var src = btn.getAttribute('data-src');
      if (!panel || !src) return;
      var iframe = doc.createElement('iframe');
      iframe.src = src;
      iframe.title = btn.getAttribute('data-title') || 'Mapa';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      panel.appendChild(iframe);
      btn.disabled = true;
    });
  });

  /* LGPD cookie banner */
  var banner = $('#cookie-banner');
  if (banner) {
    var prefsBox = $('#cookie-prefs', banner);
    var cbA = $('#ck-analytics', banner);
    var cbM = $('#ck-marketing', banner);
    function show() {
      banner.hidden = false;
      requestAnimationFrame(function () { banner.classList.add('is-visible'); });
    }
    function hide() {
      banner.classList.remove('is-visible');
      setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 450);
    }
    function save(a, m) {
      store(COOKIE_KEY, JSON.stringify({ necessarios: true, analise: !!a, marketing: !!m, data: new Date().toISOString() }));
      hide();
    }
    var saved = null;
    try { saved = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved) show();
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') save(true, true);
      if (act === 'reject') save(false, false);
      if (act === 'prefs') { prefsBox.hidden = !prefsBox.hidden; b.setAttribute('aria-expanded', String(!prefsBox.hidden)); }
      if (act === 'save') save(cbA.checked, cbM.checked);
    });
    $$('.js-cookie-prefs').forEach(function (l) {
      l.addEventListener('click', function (e) {
        e.preventDefault();
        var cur = null;
        try { cur = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (er) { cur = null; }
        cbA.checked = !!(cur && cur.analise);
        cbM.checked = !!(cur && cur.marketing);
        prefsBox.hidden = false;
        show();
      });
    });
  }
})();

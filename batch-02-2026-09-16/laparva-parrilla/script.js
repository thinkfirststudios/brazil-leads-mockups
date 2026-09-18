/* Laparva Parrilla — mockup behaviour. No framework, no build step. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = 'laparva_cookie_consent_v1';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Sticky header: condenses + gains shadow; "Reservar mesa" stays visible */
  var header = $('.site-header');
  function onScrollHeader() { if (header) header.classList.toggle('is-condensed', window.scrollY > 30); }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Mobile menu */
  var toggle = $('.nav-toggle'), nav = $('.site-nav');
  function closeNav() { if (!toggle) return; toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      if (!open) header.classList.add('is-condensed');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); toggle.focus(); }
    });
  }

  /* Reveals + stagger */
  $$('[data-reveal-group]').forEach(function (g) {
    var step = parseInt(g.getAttribute('data-reveal-group'), 10) || 100;
    $$('[data-reveal]', g).forEach(function (el, i) { el.style.setProperty('--d', (i * step) + 'ms'); });
  });
  var rev = $$('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    rev.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  }

  /* Count-up: only elements with a verified data-count (none verified yet — tiles show [CONFIRM]) */
  var counters = $$('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')), t0 = null;
        (function tick(ts) {
          if (!t0) t0 = ts || performance.now();
          var p = Math.min(((ts || t0) - t0) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
          if (p < 1) requestAnimationFrame(tick);
        })();
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Slow horizontal parallax across the wide hero (transform only) */
  var px = $$('[data-parallax-x]');
  if (px.length && !reduce) {
    var busy = false;
    window.addEventListener('scroll', function () {
      if (busy) return; busy = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          px.forEach(function (el) {
            var f = parseFloat(el.getAttribute('data-parallax-x')) || 0.06;
            el.style.transform = 'translate3d(' + (-y * f).toFixed(1) + 'px,' + (y * 0.08).toFixed(1) + 'px,0)';
          });
        }
        busy = false;
      });
    }, { passive: true });
  }

  /* DD/MM helper */
  $$('input[data-ddmm]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var v = inp.value.replace(/\D/g, '').slice(0, 4);
      inp.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    });
  });

  /* Demo forms — inline validation, live summary, composes a WhatsApp message, never submits */
  function validDDMM(v) {
    var m = /^(\d{2})\/(\d{2})$/.exec(v); if (!m) return false;
    var d = +m[1], mo = +m[2];
    return mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
  }
  function checkField(f) {
    var ok = true;
    if (f.type === 'checkbox') ok = !f.required || f.checked;
    else if (f.type === 'radio') {
      var grp = $$('input[name="' + f.name + '"]', f.form);
      ok = !f.required || grp.some(function (r) { return r.checked; });
    }
    else if (f.required && !f.value.trim()) ok = false;
    else if (f.hasAttribute('data-ddmm') && f.value && !validDDMM(f.value)) ok = false;
    else if (f.type === 'number' && f.value && +f.value < +(f.min || 1)) ok = false;
    else if (f.type === 'tel' && f.value && f.value.replace(/\D/g, '').length < 10) ok = false;
    f.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var errId = f.getAttribute('data-err') || (f.id + '-err');
    var err = document.getElementById(errId);
    if (err) err.textContent = ok ? '' : (f.getAttribute('data-error') || '');
    return ok;
  }
  function compose(form) {
    var lines = [form.getAttribute('data-intro') || ''];
    $$('[data-label]', form).forEach(function (f) {
      if ((f.type === 'radio' || f.type === 'checkbox') && !f.checked) return;
      if (f.value && f.value.trim()) lines.push(f.getAttribute('data-label') + ': ' + f.value.trim());
    });
    return lines.join('\n');
  }
  $$('form[data-demo]').forEach(function (form) {
    var summary = $('[data-summary]', form);
    function refresh() { if (summary) summary.textContent = compose(form); }
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) checkField(e.target); refresh(); });
    form.addEventListener('change', refresh);
    $$('input,select,textarea', form).forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value && f.type !== 'radio' && f.type !== 'checkbox') checkField(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var seen = {};
      var fields = $$('input,select,textarea', form).filter(function (f) {
        if (f.type === 'radio') { if (seen[f.name]) return false; seen[f.name] = 1; }
        return f.required || f.hasAttribute('data-ddmm') || f.type === 'tel';
      });
      var ok = fields.map(checkField).every(Boolean);
      if (!ok) { var first = $('[aria-invalid="true"]', form); if (first) first.focus(); return; }
      var notice = $('.form-notice', form);
      if (notice) {
        var msg = compose(form), wa = form.getAttribute('data-wa');
        notice.hidden = false;
        $('.notice-text', notice).textContent = form.getAttribute('data-notice') || '';
        $('pre', notice).textContent = msg;
        var link = $('a.wa-compose', notice);
        if (link && wa) { link.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg); link.hidden = false; }
        notice.focus();
      }
    });
    refresh();
  });

  /* Lightbox */
  var lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('img', lb), lbCap = $('p', lb);
    $$('[data-lightbox]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        var img = $('img', a); lbImg.alt = img ? img.alt : '';
        lbCap.textContent = a.getAttribute('data-caption') || '';
        lb.showModal();
      });
    });
    $('.close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* Carousels */
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.carousel-track', wrap); if (!track) return;
    function by(dir) {
      var first = track.firstElementChild;
      var w = first ? first.getBoundingClientRect().width + 16 : 320;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    }
    var p = $('[data-prev]', wrap), n = $('[data-next]', wrap);
    if (p) p.addEventListener('click', function () { by(-1); });
    if (n) n.addEventListener('click', function () { by(1); });
  });

  /* Menu category rail (filter) */
  $$('[data-filter-rail]').forEach(function (rail) {
    var scope = document.getElementById(rail.getAttribute('data-filter-rail')); if (!scope) return;
    $$('button[data-filter]', rail).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-filter');
        $$('button[data-filter]', rail).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        $$('[data-cat]', scope).forEach(function (card) {
          var cats = card.getAttribute('data-cat').split(' ');
          card.hidden = !(val === 'all' || cats.indexOf(val) > -1);
          if (!card.hidden) card.classList.add('is-in');
        });
        var empty = $('[data-filter-empty]', scope);
        if (empty) empty.hidden = $$('[data-cat]:not([hidden])', scope).length > 0;
      });
    });
  });

  /* LGPD cookie banner */
  var banner = $('#cookie-banner');
  function readConsent() { try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch (e) { return null; } }
  function saveConsent(o) { try { localStorage.setItem(COOKIE_KEY, JSON.stringify(o)); } catch (e) { /* blocked storage */ } }
  if (banner) {
    var prefs = $('.cookie-prefs', banner), boxes = $$('input[data-cookie-cat]', banner);
    var open = function (showPrefs) {
      var c = readConsent();
      boxes.forEach(function (b) { b.checked = !!(c && c[b.getAttribute('data-cookie-cat')]); });
      prefs.hidden = !showPrefs;
      banner.hidden = false;
    };
    var close = function (o) { o.date = new Date().toISOString(); saveConsent(o); banner.hidden = true; };
    $$('[data-cookie]', banner).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-cookie');
        if (act === 'accept') close({ necessarios: true, analise: true, marketing: true });
        else if (act === 'reject') close({ necessarios: true, analise: false, marketing: false });
        else if (act === 'prefs') { prefs.hidden = !prefs.hidden; btn.setAttribute('aria-expanded', String(!prefs.hidden)); if (!prefs.hidden && boxes[0]) boxes[0].focus(); }
        else if (act === 'save') {
          var o = { necessarios: true };
          boxes.forEach(function (b) { o[b.getAttribute('data-cookie-cat')] = b.checked; });
          close(o);
        }
      });
    });
    $$('[data-cookie-open]').forEach(function (l) { l.addEventListener('click', function (e) { e.preventDefault(); open(true); }); });
    if (!readConsent()) open(false);
  }
})();

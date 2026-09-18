/* Cronópio Parrilla — mockup behaviour. No framework, no build step. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = 'cronopio_cookie_consent_v1';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* Year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Sticky header condense */
  var header = $('.site-header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-condensed', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Mobile menu */
  var toggle = $('.nav-toggle');
  var nav = $('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* Scroll reveals with stagger (groups set --d per child) */
  $$('[data-reveal-group]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-reveal-group'), 10) || 90;
    $$('[data-reveal]', group).forEach(function (el, i) { el.style.setProperty('--d', (i * step) + 'ms'); });
  });
  var revealEls = $$('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Count-up — only for elements carrying a verified data-count value (none verified yet) */
  var counters = $$('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')), t0 = null;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Very slow hero parallax (transform only) */
  var par = $$('[data-parallax]');
  if (par.length && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        par.forEach(function (el) {
          if (y > window.innerHeight * 1.2) return;
          var f = parseFloat(el.getAttribute('data-parallax')) || 0.15;
          el.style.transform = 'translate3d(0,' + (y * f).toFixed(1) + 'px,0)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* DD/MM auto-format */
  $$('input[data-ddmm]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      var v = inp.value.replace(/\D/g, '').slice(0, 4);
      inp.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    });
  });

  /* Demo forms: inline validation, compose WhatsApp message, never submit */
  function validDDMM(v) {
    var m = /^(\d{2})\/(\d{2})$/.exec(v);
    if (!m) return false;
    var d = +m[1], mo = +m[2];
    return mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
  }
  function checkField(f) {
    var ok = true;
    if (f.type === 'checkbox') ok = !f.required || f.checked;
    else if (f.required && !f.value.trim()) ok = false;
    else if (f.hasAttribute('data-ddmm') && f.value && !validDDMM(f.value)) ok = false;
    else if (f.type === 'number' && f.value && (+f.value < +(f.min || 1))) ok = false;
    f.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var err = f.id ? document.getElementById(f.id + '-err') : null;
    if (err) err.textContent = ok ? '' : (f.getAttribute('data-error') || '');
    return ok;
  }
  function compose(form) {
    var lines = [form.getAttribute('data-intro') || ''];
    $$('[data-label]', form).forEach(function (f) {
      if (f.value && f.value.trim()) lines.push(f.getAttribute('data-label') + ': ' + f.value.trim());
    });
    return lines.join('\n');
  }
  $$('form[data-demo]').forEach(function (form) {
    var summary = $('[data-summary]', form);
    function refresh() { if (summary) summary.textContent = compose(form); }
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') checkField(e.target);
      refresh();
    });
    $$('input,select,textarea', form).forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value) checkField(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('input,select,textarea', form).filter(function (f) { return f.required || f.hasAttribute('data-ddmm'); });
      var allOk = fields.map(checkField).every(Boolean);
      var notice = $('.form-notice', form);
      if (!allOk) {
        var first = $('[aria-invalid="true"]', form);
        if (first) first.focus();
        return;
      }
      if (notice) {
        var msg = compose(form);
        var wa = form.getAttribute('data-wa');
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
        var img = $('img', a);
        lbImg.alt = img ? img.alt : '';
        lbCap.textContent = a.getAttribute('data-caption') || '';
        lb.showModal();
      });
    });
    $('.close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* Carousels (scroll-snap + buttons) */
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.carousel-track', wrap);
    if (!track) return;
    function by(dir) {
      var card = track.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    }
    var prev = $('[data-prev]', wrap), next = $('[data-next]', wrap);
    if (prev) prev.addEventListener('click', function () { by(-1); });
    if (next) next.addEventListener('click', function () { by(1); });
  });

  /* Menu category filter (grid builds) */
  $$('[data-filter-rail]').forEach(function (rail) {
    var scope = document.getElementById(rail.getAttribute('data-filter-rail'));
    if (!scope) return;
    $$('button[data-filter]', rail).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-filter');
        $$('button[data-filter]', rail).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        $$('[data-cat]', scope).forEach(function (card) {
          var cats = card.getAttribute('data-cat').split(' ');
          card.hidden = !(val === 'all' || cats.indexOf(val) > -1);
        });
        var empty = $('[data-filter-empty]', scope);
        if (empty) empty.hidden = $$('[data-cat]:not([hidden])', scope).length > 0;
      });
    });
  });

  /* LGPD cookie banner */
  var banner = $('#cookie-banner');
  function readConsent() { try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch (e) { return null; } }
  function saveConsent(obj) { try { localStorage.setItem(COOKIE_KEY, JSON.stringify(obj)); } catch (e) { /* storage blocked: banner simply reappears */ } }
  if (banner) {
    var prefs = $('.cookie-prefs', banner);
    var boxes = $$('input[data-cookie-cat]', banner);
    function openBanner(showPrefs) {
      var c = readConsent();
      boxes.forEach(function (b) { b.checked = !!(c && c[b.getAttribute('data-cookie-cat')]); });
      if (prefs) prefs.hidden = !showPrefs;
      banner.hidden = false;
    }
    function close(obj) {
      obj.date = new Date().toISOString();
      saveConsent(obj);
      banner.hidden = true;
    }
    $$('[data-cookie]', banner).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-cookie');
        if (act === 'accept') close({ necessarios: true, analise: true, marketing: true });
        else if (act === 'reject') close({ necessarios: true, analise: false, marketing: false });
        else if (act === 'prefs') {
          prefs.hidden = !prefs.hidden;
          btn.setAttribute('aria-expanded', String(!prefs.hidden));
          if (!prefs.hidden && boxes[0]) boxes[0].focus();
        } else if (act === 'save') {
          var o = { necessarios: true };
          boxes.forEach(function (b) { o[b.getAttribute('data-cookie-cat')] = b.checked; });
          close(o);
        }
      });
    });
    $$('[data-cookie-open]').forEach(function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); });
    });
    if (!readConsent()) openBanner(false);
  }
})();

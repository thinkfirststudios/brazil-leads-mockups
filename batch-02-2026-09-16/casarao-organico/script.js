/* Casarão Vida Natural — mockup behaviour (no framework, no build step) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  /* Year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Sticky header condense */
  var header = $('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = $('.menu-toggle[aria-controls]');
  var menu = $('#mobile-menu');
  var scrim = $('.menu-scrim');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('open', open);
    $$('.menu-toggle[aria-controls="mobile-menu"]').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = menu.querySelector('a,button'); if (f) f.focus(); }
    else if (toggle) toggle.focus();
  }
  $$('.menu-toggle[aria-controls="mobile-menu"]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  });
  if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false);
  });

  /* Reveal on scroll (with stagger via --d set in markup or computed per group) */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', i); });
  });
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Count-up — only elements with a verified numeric data-count (none yet: all stats are [CONFIRM]) */
  var counters = $$('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')), t0 = null;
        if (isNaN(target)) return;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString(EN ? 'en' : 'pt-BR');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Hero parallax (transform only) */
  var heroMedia = $('[data-parallax]');
  if (heroMedia && !reduceMotion) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        heroMedia.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* Live "today" hours against the PUBLISHED schedule.
     Published: weekdays 9h–21h; Sundays & holidays 10h–20h. Saturday NOT published -> [CONFIRM].
     Holidays cannot be detected here -> noted in copy. */
  var schedule = { 0: [10, 20], 1: [9, 21], 2: [9, 21], 3: [9, 21], 4: [9, 21], 5: [9, 21], 6: null };
  function spNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], h: parseInt(map.hour, 10) % 24, m: parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date(); return { day: d.getDay(), h: d.getHours(), m: d.getMinutes() };
    }
  }
  var now = spNow();
  var todayEl = $('#today-hours');
  var dot = $('.status-dot');
  if (todayEl) {
    var s = schedule[now.day];
    if (!s) {
      todayEl.innerHTML = (EN ? 'Today (Saturday): ' : 'Hoje (sábado): ') + '<span class="confirm">[CONFIRM sábado]</span>';
      if (dot) dot.className = 'status-dot';
    } else {
      var mins = now.h * 60 + now.m, open = mins >= s[0] * 60 && mins < s[1] * 60;
      var range = s[0] + 'h–' + s[1] + 'h';
      if (EN) range = s[0] + ':00–' + s[1] + ':00';
      todayEl.textContent = (EN ? (open ? 'Open now · today ' : 'Closed now · today ') : (open ? 'Aberto agora · hoje ' : 'Fechado agora · hoje ')) + range;
      if (dot) dot.className = 'status-dot ' + (open ? 'open' : 'closed');
    }
  }
  $$('.hours-table tr[data-days]').forEach(function (tr) {
    var days = tr.getAttribute('data-days').split(',').map(Number);
    if (days.indexOf(now.day) > -1) tr.classList.add('is-today');
  });

  /* Catalogue filter */
  var rail = $('.cat-rail');
  if (rail) {
    var buttons = $$('button', rail);
    var cards = $$('[data-cat]', $('#catalogo-grid'));
    buttons.forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var n = f === 'all' ? cards.filter(function (c) { return c.classList.contains('product'); }).length
        : cards.filter(function (c) { return c.getAttribute('data-cat') === f && c.classList.contains('product'); }).length;
      var cnt = b.querySelector('.count'); if (cnt) cnt.textContent = n;
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        cards.forEach(function (c, i) {
          var show = f === 'all' || c.getAttribute('data-cat') === f;
          c.hidden = !show;
          if (show && !reduceMotion) {
            c.classList.remove('in'); c.style.setProperty('--d', 0);
            requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('in'); }); });
          }
        });
        var live = $('#catalogo-status');
        if (live) live.textContent = (EN ? 'Showing: ' : 'Exibindo: ') + b.textContent.replace(/\d+$/, '').trim();
      });
    });
  }

  /* Carousel buttons */
  $$('[data-carousel]').forEach(function (wrap) {
    var track = $('.carousel-track', wrap);
    $$('[data-dir]', wrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-dir'), 10);
        var item = track.firstElementChild;
        var w = item ? item.getBoundingClientRect().width + 14 : track.clientWidth;
        track.scrollBy({ left: dir * w, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  });

  /* Lightbox */
  var lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('img', lb), lbCap = $('p', lb);
    $$('[data-lightbox]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        lbImg.src = btn.getAttribute('data-lightbox');
        lbImg.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
        lbCap.textContent = btn.getAttribute('data-caption') || '';
        lb.showModal();
      });
    });
    $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* Demo-only forms */
  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = $('.form-notice', form);
      var consent = $('input[name="consent"]', form);
      if (consent && !consent.checked) {
        notice.className = 'form-notice show error';
        notice.textContent = EN ? 'Please tick the privacy consent box to continue.' : 'Marque a caixa de consentimento (LGPD) para continuar.';
        consent.focus();
        return;
      }
      notice.className = 'form-notice show';
      notice.textContent = EN
        ? 'Demo only: nothing was sent. This mockup form is not connected to any system.'
        : 'Apenas demonstração: nada foi enviado. Este formulário de mockup não está ligado a nenhum sistema.';
    });
  });

  /* LGPD cookie banner */
  var KEY = 'casarao_cookie_consent_v1';
  var banner = $('#cookie-banner');
  if (banner) {
    var prefs = $('.cookie-prefs', banner);
    var saved = null;
    try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) { saved = null; }
    function show() {
      banner.classList.add('show');
      banner.setAttribute('aria-hidden', 'false');
      if (saved) {
        $('#ck-analytics').checked = !!saved.analytics;
        $('#ck-marketing').checked = !!saved.marketing;
      }
    }
    function hide() { banner.classList.remove('show'); banner.setAttribute('aria-hidden', 'true'); prefs.classList.remove('show'); }
    function save(a, m) {
      saved = { necessary: true, analytics: a, marketing: m, ts: new Date().toISOString() };
      store(KEY, JSON.stringify(saved));
      hide();
    }
    if (!saved) setTimeout(show, 600);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { save(true, true); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { save(false, false); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () {
      prefs.classList.toggle('show');
      this.setAttribute('aria-expanded', prefs.classList.contains('show') ? 'true' : 'false');
    });
    $('[data-ck="save"]', banner).addEventListener('click', function () {
      save($('#ck-analytics').checked, $('#ck-marketing').checked);
    });
    $$('[data-open-cookies]').forEach(function (b) {
      b.addEventListener('click', function () { show(); prefs.classList.add('show'); });
    });
  }
})();

/* Click-to-load map: the Google iframe is only created after an explicit click */
(function () {
  var btns = document.querySelectorAll('[data-load-map]');
  Array.prototype.forEach.call(btns, function (b) {
    b.addEventListener('click', function () {
      var ph = b.closest('.map-ph');
      if (!ph) return;
      var f = document.createElement('iframe');
      f.src = ph.getAttribute('data-map-src');
      f.title = ph.getAttribute('data-map-title') || 'Mapa';
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      f.setAttribute('allowfullscreen', '');
      ph.parentNode.appendChild(f);
      ph.parentNode.removeChild(ph);
      f.focus();
    });
  });
})();
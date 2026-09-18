/* Green Lagoon — mockup behaviour. No framework, no build step. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = 'greenlagoon_cookie_consent_v1';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Tonight's status, computed in Florianópolis time against the DIRECTORY schedule [CONFIRM] ----------
     Schedule (unverified directory data): Tue–Sat 19:30–23:00, closed Mon and Sun. */
  var SCHEDULE = { 0: null, 1: null, 2: ['19:30', '23:00'], 3: ['19:30', '23:00'], 4: ['19:30', '23:00'], 5: ['19:30', '23:00'], 6: ['19:30', '23:00'] };
  function nowInFloripa() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[o.weekday], mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function toMins(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  var now = nowInFloripa();
  var today = SCHEDULE[now.day];
  $$('[data-open-status]').forEach(function (el) {
    var label;
    if (!today) { label = el.getAttribute('data-closed'); el.classList.add('is-closed'); }
    else {
      var range = today[0] + '–' + today[1];
      var o = toMins(today[0]), c = toMins(today[1]);
      if (now.mins >= o && now.mins < c) { label = el.getAttribute('data-open-now') + ' · ' + range; el.classList.add('is-open'); }
      else if (now.mins < o) { label = el.getAttribute('data-open-today') + ' · ' + range; el.classList.add('is-open'); }
      else { label = el.getAttribute('data-ended'); el.classList.add('is-closed'); }
    }
    var t = $('.status-text', el);
    if (t) t.textContent = label;
  });
  $$('[data-day]').forEach(function (el) {
    if (+el.getAttribute('data-day') === now.day) el.classList.add('today');
  });

  /* ---------- The descent: shade layer opacity follows scroll progress (background only) ---------- */
  var shade = $('.descent-shade');
  if (shade && !reduce) {
    var pending = false;
    var updateShade = function () {
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      shade.style.opacity = (0.15 + p * 0.85).toFixed(3);
      pending = false;
    };
    window.addEventListener('scroll', function () { if (!pending) { pending = true; requestAnimationFrame(updateShade); } }, { passive: true });
    window.addEventListener('resize', updateShade);
    updateShade();
  }

  /* Header */
  var header = $('.site-header');
  function onScrollHeader() { if (header) header.classList.toggle('is-condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Mobile menu */
  var toggle = $('.nav-toggle'), nav = $('.site-nav');
  function closeNav() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
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

  /* Reveals */
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

  /* Count-up — verified values only (none yet) */
  var counters = $$('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')), t0 = performance.now();
        (function tick() {
          var p = Math.min((performance.now() - t0) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
          if (p < 1) requestAnimationFrame(tick);
        })();
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Hero parallax (transform only) */
  var par = $$('[data-parallax]');
  if (par.length && !reduce) {
    var busy = false;
    window.addEventListener('scroll', function () {
      if (busy) return; busy = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          par.forEach(function (el) { el.style.transform = 'translate3d(0,' + (y * (parseFloat(el.getAttribute('data-parallax')) || 0.12)).toFixed(1) + 'px,0)'; });
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

  /* Demo forms */
  function validDDMM(v) {
    var m = /^(\d{2})\/(\d{2})$/.exec(v); if (!m) return false;
    var d = +m[1], mo = +m[2];
    return mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
  }
  function checkField(f) {
    var ok = true;
    if (f.type === 'checkbox') ok = !f.required || f.checked;
    else if (f.required && !f.value.trim()) ok = false;
    else if (f.hasAttribute('data-ddmm') && f.value && !validDDMM(f.value)) ok = false;
    else if (f.type === 'number' && f.value && +f.value < +(f.min || 1)) ok = false;
    f.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var err = document.getElementById(f.id + '-err');
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
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) checkField(e.target); refresh(); });
    form.addEventListener('change', refresh);
    $$('input,select,textarea', form).forEach(function (f) {
      f.addEventListener('blur', function () { if (f.value && f.type !== 'checkbox') checkField(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('input,select,textarea', form).filter(function (f) { return f.required || f.hasAttribute('data-ddmm'); });
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

  /* Click-to-load map: no Google request until the visitor asks for it (LGPD) */
  $$('[data-map]').forEach(function (box) {
    var btn = $('[data-map-load]', box);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.title = box.getAttribute('data-map-title') || 'Map';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.src = box.getAttribute('data-map-src');
      var ph = $('.map-ph', box);
      if (ph) ph.remove();
      box.appendChild(f);
      f.setAttribute('tabindex', '0');
      f.focus();
    });
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

  /* Menu rail filter (incl. vegetarian/vegan — no dish is verified yet, so it shows the honest empty state) */
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
  function saveConsent(o) { try { localStorage.setItem(COOKIE_KEY, JSON.stringify(o)); } catch (e) { /* blocked */ } }
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

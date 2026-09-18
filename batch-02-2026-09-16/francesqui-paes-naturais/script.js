/* Francesqui Pães Naturais — mockup behaviour (no framework, no build step) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var reduceMotion = mqReduce.matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Header condenses to a hairline */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var menu = $('#mobile-menu');
  var opener = $('.site-header .menu-toggle');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    $$('.menu-toggle[aria-controls="mobile-menu"]').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = menu.querySelector('a'); if (f) f.focus(); } else if (opener) opener.focus();
  }
  $$('.menu-toggle[aria-controls="mobile-menu"]').forEach(function (b) {
    b.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  });
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false); });

  /* Reveals */
  $$('[data-stagger]').forEach(function (g) { $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--d', i); }); });
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Count-up for monospace hour figures — only runs on elements carrying a VERIFIED data-count.
     Every figure is [CONFIRM] today, so nothing animates yet. */
  var counters = $$('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.getAttribute('data-count')), t0 = null;
        if (isNaN(target)) return;
        (function step(ts) {
          if (ts === undefined) return requestAnimationFrame(step);
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1200, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })();
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Hero parallax */
  var par = $('[data-parallax]');
  if (par && !reduceMotion) {
    var t1 = false;
    window.addEventListener('scroll', function () {
      if (t1) return; t1 = true;
      requestAnimationFrame(function () {
        par.style.transform = 'translate3d(0,' + (Math.min(window.scrollY, 900) * 0.12).toFixed(1) + 'px,0)';
        t1 = false;
      });
    }, { passive: true });
  }

  /* Fermentation timeline — horizontal scrub tied to scroll (desktop, motion allowed) */
  var tl = $('#processo');
  if (tl) {
    var scrub = $('.tl-scrub', tl), sticky = $('.tl-sticky', tl), track = $('.tl-track', tl), bar = $('.tl-progress', tl);
    var mqDesk = window.matchMedia('(min-width: 960px)');
    var active = false, dist = 0;
    function measure() {
      var want = mqDesk.matches && !reduceMotion;
      if (want !== active) {
        active = want;
        tl.classList.toggle('tl-scrub-on', active);
        if (!active) { scrub.style.height = ''; track.style.transform = ''; bar.style.setProperty('--p', 1); }
      }
      if (!active) return;
      track.style.transform = '';
      dist = Math.max(0, track.scrollWidth - track.clientWidth + 40);
      scrub.style.height = Math.round(sticky.offsetHeight + dist * 1.6) + 'px';
      update();
    }
    function update() {
      if (!active) return;
      var r = scrub.getBoundingClientRect();
      var total = scrub.offsetHeight - sticky.offsetHeight;
      var p = total > 0 ? Math.min(Math.max((56 - r.top) / total, 0), 1) : 0;
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)';
      bar.style.setProperty('--p', p.toFixed(3));
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();
    if (!active) bar.style.setProperty('--p', 1);
  }

  /* Calendar: highlight today's column (America/Sao_Paulo) */
  var dayIdx;
  try {
    var wd = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short' }).format(new Date());
    dayIdx = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[wd];
  } catch (e) { dayIdx = (new Date().getDay() + 6) % 7; }
  var cal = $('.bake-cal');
  if (cal) {
    var th = $$('thead th', cal)[dayIdx + 1];
    if (th) { th.classList.add('is-today'); th.setAttribute('aria-current', 'date'); }
    $$('tbody tr', cal).forEach(function (tr) { var td = $$('td', tr)[dayIdx]; if (td) td.classList.add('is-today'); });
  }

  /* Menu filter */
  var rail = $('.cat-rail');
  if (rail) {
    var buttons = $$('button', rail);
    var cards = $$('[data-cat]', $('#menu-grid'));
    buttons.forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var n = cards.filter(function (c) { return c.classList.contains('item') && (f === 'all' || c.getAttribute('data-cat') === f); }).length;
      var cnt = $('.count', b); if (cnt) cnt.textContent = n;
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        cards.forEach(function (c) {
          var show = f === 'all' || c.getAttribute('data-cat') === f;
          c.hidden = !show;
          if (show && !reduceMotion) { c.classList.remove('in'); c.style.setProperty('--d', 0); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add('in'); }); }); }
        });
        var live = $('#menu-status'); if (live) live.textContent = (EN ? 'Showing: ' : 'Exibindo: ') + b.textContent.replace(/\d+\s*$/, '').trim();
      });
    });
  }

  /* Lightbox */
  var lb = $('#lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = $('img', lb), lbCap = $('p', lb);
    $$('[data-lightbox]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        lbImg.src = btn.getAttribute('data-lightbox');
        var im = $('img', btn); lbImg.alt = im ? im.alt : '';
        lbCap.textContent = btn.getAttribute('data-caption') || '';
        lb.showModal();
      });
    });
    $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  function consentOk(form, notice) {
    var c = $('input[name="consent"]', form);
    if (c && !c.checked) {
      notice.className = 'form-notice show error';
      notice.textContent = EN ? 'Please tick the privacy consent box to continue.' : 'Marque a caixa de consentimento (LGPD) para continuar.';
      c.focus();
      return false;
    }
    return true;
  }

  /* Pre-order form: COMPOSES a WhatsApp message, sends nothing */
  var order = $('#order-form');
  if (order) {
    order.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = $('.form-notice', order);
      if (!consentOk(order, notice)) return;
      var v = function (n) { var el = order.elements[n]; return el ? (el.value || '').trim() : ''; };
      var mode = (order.querySelector('input[name="modo"]:checked') || {}).value || '';
      var dateTxt = v('dia');
      if (dateTxt && /^\d{4}-\d{2}-\d{2}$/.test(dateTxt)) { var p = dateTxt.split('-'); dateTxt = p[2] + '/' + p[1] + '/' + p[0]; }
      var lines = EN ? [
        'Hello Francesqui! I would like to pre-order:',
        '• Item: ' + (v('item') || '—'),
        '• Quantity: ' + (v('qtd') || '—'),
        '• Day: ' + (dateTxt || '—'),
        '• ' + (mode || '—'),
        v('nome') ? '• Name: ' + v('nome') : '',
        v('obs') ? '• Notes: ' + v('obs') : ''
      ] : [
        'Olá, Francesqui! Gostaria de encomendar:',
        '• Item: ' + (v('item') || '—'),
        '• Quantidade: ' + (v('qtd') || '—'),
        '• Dia: ' + (dateTxt || '—'),
        '• ' + (mode || '—'),
        v('nome') ? '• Nome: ' + v('nome') : '',
        v('obs') ? '• Observações: ' + v('obs') : ''
      ];
      var msg = lines.filter(Boolean).join('\n');
      var comp = $('.composer', order);
      $('textarea', comp).value = msg;
      comp.classList.add('show');
      notice.className = 'form-notice show';
      notice.textContent = EN
        ? 'Message composed below. Nothing was sent — the WhatsApp number is still to be confirmed.'
        : 'Mensagem montada abaixo. Nada foi enviado — o número de WhatsApp ainda precisa ser confirmado.';
    });
    var copyBtn = $('[data-copy]', order);
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var ta = $('.composer textarea', order);
      ta.select();
      var ok = false;
      try { if (navigator.clipboard) { navigator.clipboard.writeText(ta.value); ok = true; } else { ok = document.execCommand('copy'); } } catch (err) { ok = false; }
      copyBtn.textContent = ok ? (EN ? 'Copied' : 'Copiada') : (EN ? 'Select and copy' : 'Selecione e copie');
    });
  }

  /* Newsletter + any other demo form */
  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = $('.form-notice', form);
      if (!consentOk(form, notice)) return;
      notice.className = 'form-notice show';
      notice.textContent = EN
        ? 'Demo only: nothing was sent. In production you would receive a confirmation email (double opt-in).'
        : 'Apenas demonstração: nada foi enviado. Na versão final, você receberá um e-mail para confirmar a inscrição (double opt-in).';
    });
  });

  /* LGPD cookie banner */
  var KEY = 'francesqui_cookie_consent_v1';
  var banner = $('#cookie-banner');
  if (banner) {
    var prefs = $('.cookie-prefs', banner), saved = null;
    try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) { saved = null; }
    function show() {
      banner.classList.add('show'); banner.setAttribute('aria-hidden', 'false');
      if (saved) { $('#ck-analytics').checked = !!saved.analytics; $('#ck-marketing').checked = !!saved.marketing; }
    }
    function hide() { banner.classList.remove('show'); banner.setAttribute('aria-hidden', 'true'); prefs.classList.remove('show'); }
    function save(a, m) { saved = { necessary: true, analytics: a, marketing: m, ts: new Date().toISOString() }; store(KEY, JSON.stringify(saved)); hide(); }
    if (!saved) setTimeout(show, 600);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { save(true, true); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { save(false, false); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () {
      prefs.classList.toggle('show');
      this.setAttribute('aria-expanded', prefs.classList.contains('show') ? 'true' : 'false');
    });
    $('[data-ck="save"]', banner).addEventListener('click', function () { save($('#ck-analytics').checked, $('#ck-marketing').checked); });
    $$('[data-open-cookies]').forEach(function (b) { b.addEventListener('click', function () { show(); prefs.classList.add('show'); }); });
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
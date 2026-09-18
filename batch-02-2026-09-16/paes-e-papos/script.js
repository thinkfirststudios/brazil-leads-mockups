/* Pães e Papos — MOCKUP interactions. No framework, no build step. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var T = EN ? {
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today', unknown: 'Sunday hours not confirmed',
    required: 'Please fill in this field.',
    dateFmt: 'Use the format DD/MM (e.g. 05/11).',
    consent: 'Consent is required to continue.',
    built: 'Message ready. DEMO ONLY: nothing was sent. The WhatsApp number is still [CONFIRM]; for now, call +55 48 4009-3364.',
    copied: 'Message copied.', copyFail: 'Could not copy automatically. Select the text above.',
    news: 'DEMO ONLY: nothing was sent. On the live site you would get a confirmation e-mail (double opt-in) first.',
    head: 'Hello, Pães e Papos!', type: 'Request', date: 'Date (DD/MM)', qty: 'Quantity / people', name: 'Name', notes: 'Notes',
    pause: 'Pause rotation', play: 'Resume rotation', quote: 'Line'
  } : {
    days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje', unknown: 'horário de domingo não confirmado',
    required: 'Preencha este campo.',
    dateFmt: 'Use o formato DD/MM (ex.: 05/11).',
    consent: 'O consentimento é necessário para continuar.',
    built: 'Mensagem pronta. DEMONSTRAÇÃO: nada foi enviado. O número de WhatsApp ainda é [CONFIRM]; por enquanto, ligue (48) 4009-3364.',
    copied: 'Mensagem copiada.', copyFail: 'Não foi possível copiar automaticamente. Selecione o texto acima.',
    news: 'DEMONSTRAÇÃO: nada foi enviado. No site real você receberia antes um e-mail de confirmação (dupla confirmação).',
    head: 'Olá, Pães e Papos!', type: 'Pedido', date: 'Data (DD/MM)', qty: 'Quantidade / pessoas', name: 'Nome', notes: 'Observações',
    pause: 'Pausar rotação', play: 'Retomar rotação', quote: 'Frase'
  };

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- today's hours: directory data, Sunday UNKNOWN (rendered as [CONFIRM]) ---------- */
  var now = new Date();
  var dow = now.getDay();
  $$('[data-schedule]').forEach(function (el) {
    var sched;
    try { sched = JSON.parse(el.getAttribute('data-schedule')); } catch (e) { return; }
    var slot = sched[String(dow)];
    var out = $('[data-today-text]', el);
    var flag = $('[data-today-flag]', el);
    if (!out) return;
    if (!slot || slot === 'CONFIRM') {
      out.textContent = T.today + ' (' + T.days[dow] + '): ' + T.unknown;
      if (flag) flag.textContent = EN ? '[CONFIRM Sunday]' : '[CONFIRM domingo]';
    } else {
      out.textContent = T.today + ' (' + T.days[dow] + '): ' + slot;
    }
  });
  $$('.hours-table tr[data-day]').forEach(function (tr) {
    if (String(dow) === tr.getAttribute('data-day')) tr.classList.add('is-today');
  });

  /* ---------- header + hero parallax ---------- */
  var header = $('.site-header');
  var heroImg = $('.hero__media img');
  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop;
    if (header) header.classList.toggle('is-condensed', y > 40);
    if (heroImg && !reduce && y < window.innerHeight * 1.2) heroImg.style.setProperty('--py', (y * 0.18).toFixed(1) + 'px');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = $('.site-header .menu-toggle');
  var mnav = $('#mobile-nav');
  function setMenu(open) {
    if (!mnav) return;
    mnav.classList.toggle('is-open', open);
    $$('.menu-toggle').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = $('.menu-close', mnav); if (f) f.focus(); } else if (toggle) { toggle.focus(); }
  }
  if (toggle && mnav) {
    $$('li', mnav).forEach(function (li, i) { li.style.setProperty('--i', i); });
    $$('.menu-toggle').forEach(function (b) { b.addEventListener('click', function () { setMenu(!mnav.classList.contains('is-open')); }); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- reveal ---------- */
  $$('[data-stagger]').forEach(function (g) { $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--i', i); }); });
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up: ONLY verified figures (add data-count="N" once confirmed) ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        if (reduce) { el.textContent = target; return; }
        var t0 = null;
        var step = function (t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1500, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- papos wall: slow ambient cross-fade (9s) ---------- */
  var wall = $('#papos-wall');
  if (wall) {
    var quotes = $$('.quote', wall);
    var dotsWrap = $('#papos-dots');
    var btnPrev = $('#papos-prev'), btnNext = $('#papos-next'), btnPause = $('#papos-pause');
    if (reduce || quotes.length < 2) {
      wall.classList.add('is-static');
      quotes.forEach(function (q) { q.classList.add('is-active'); q.removeAttribute('aria-hidden'); });
    } else {
      var i = 0, timer = null, paused = false;
      var dots = quotes.map(function (q, k) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', T.quote + ' ' + (k + 1));
        d.addEventListener('click', function () { go(k); restart(); });
        dotsWrap.appendChild(d);
        return d;
      });
      var go = function (k) {
        i = (k + quotes.length) % quotes.length;
        quotes.forEach(function (q, n) {
          var on = n === i;
          q.classList.toggle('is-active', on);
          if (on) q.removeAttribute('aria-hidden'); else q.setAttribute('aria-hidden', 'true');
          dots[n].setAttribute('aria-current', on ? 'true' : 'false');
        });
      };
      var restart = function () { clearInterval(timer); if (!paused) timer = setInterval(function () { go(i + 1); }, 9000); };
      btnPrev.addEventListener('click', function () { go(i - 1); restart(); });
      btnNext.addEventListener('click', function () { go(i + 1); restart(); });
      btnPause.addEventListener('click', function () {
        paused = !paused;
        btnPause.setAttribute('aria-pressed', paused ? 'true' : 'false');
        btnPause.setAttribute('aria-label', paused ? T.play : T.pause);
        $('.i-pause', btnPause).style.display = paused ? 'none' : '';
        $('.i-play', btnPause).style.display = paused ? '' : 'none';
        restart();
      });
      wall.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { go(i - 1); restart(); }
        if (e.key === 'ArrowRight') { go(i + 1); restart(); }
      });
      // pause while the user is hovering/focused inside (WCAG 2.2.2)
      wall.parentNode.addEventListener('mouseenter', function () { clearInterval(timer); });
      wall.parentNode.addEventListener('mouseleave', restart);
      wall.parentNode.addEventListener('focusin', function () { clearInterval(timer); });
      wall.parentNode.addEventListener('focusout', restart);
      go(0); restart();
    }
  }

  /* ---------- menu rail ---------- */
  var rail = $('.rail');
  if (rail) {
    var btns = $$('button', rail), items = $$('.menu-grid .item');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var cat = b.getAttribute('data-filter');
        items.forEach(function (it) {
          it.hidden = !(cat === 'all' || it.getAttribute('data-cat') === cat);
          if (!it.hidden) it.classList.add('is-in');
        });
      });
    });
  }

  /* ---------- encomendas & grupos composer ---------- */
  var of = $('#order-form');
  if (of) {
    var box = $('#order-message'), note = $('#order-notice'), copy = $('#order-copy');
    var val = function (n) {
      var el = of.elements[n];
      if (!el) return '';
      if (el.length !== undefined && el.tagName !== 'SELECT') { for (var k = 0; k < el.length; k++) if (el[k].checked) return el[k].value; return ''; }
      return (el.value || '').trim();
    };
    var wrap = function (n) {
      var el = of.elements[n];
      el = el && el.length !== undefined && el.tagName !== 'SELECT' ? el[0] : el;
      return el && el.closest ? el.closest('.field') : null;
    };
    var err = function (n, m) { var w = wrap(n); if (!w) return; w.classList.add('is-invalid'); var e = $('.error', w); if (e) e.textContent = m; };
    of.addEventListener('input', function (e) { var w = e.target.closest('.field'); if (w) w.classList.remove('is-invalid'); });
    of.addEventListener('change', function (e) { var w = e.target.closest('.field'); if (w) w.classList.remove('is-invalid'); });
    of.addEventListener('submit', function (e) {
      e.preventDefault();
      $$('.field.is-invalid', of).forEach(function (w) { w.classList.remove('is-invalid'); });
      var ok = true;
      ['tipo', 'data', 'qtd', 'nome'].forEach(function (n) { if (!val(n)) { err(n, T.required); ok = false; } });
      var d = val('data');
      if (d && !/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/.test(d)) { err('data', T.dateFmt); ok = false; }
      if (!of.elements['lgpd'].checked) { err('lgpd', T.consent); ok = false; }
      if (!ok) { var first = $('.field.is-invalid input, .field.is-invalid select', of); if (first) first.focus(); return; }
      var lines = [T.head, '', '• ' + T.type + ': ' + val('tipo'), '• ' + T.date + ': ' + val('data'), '• ' + T.qty + ': ' + val('qtd')];
      if (val('obs')) lines.push('• ' + T.notes + ': ' + val('obs'));
      lines.push('', T.name + ': ' + val('nome'));
      box.hidden = false; box.textContent = lines.join('\n');
      copy.hidden = false;
      note.textContent = T.built; note.classList.add('is-shown');
      /* Once a WhatsApp number is CONFIRMED: open 'https://wa.me/55DDDNUMBER?text=' + encodeURIComponent(msg) */
    });
    copy.addEventListener('click', function () {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(box.textContent).then(function () { note.textContent = T.copied; }, function () { note.textContent = T.copyFail; });
        else note.textContent = T.copyFail;
      } catch (x) { note.textContent = T.copyFail; }
    });
  }

  /* ---------- newsletter (demo) ---------- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('.form-notice', f), c = $('input[type=checkbox][required]', f);
      if (c && !c.checked) { c.focus(); n.textContent = T.consent; n.classList.add('is-shown'); return; }
      if (!f.checkValidity()) { f.reportValidity(); return; }
      n.textContent = T.news; n.classList.add('is-shown'); f.reset();
    });
  });

  /* ---------- lightbox ---------- */
  var lb = $('#lightbox'), shots = $$('[data-lightbox]');
  if (lb && shots.length && typeof lb.showModal === 'function') {
    var li = $('img', lb), cap = $('figcaption', lb), idx = 0;
    var show = function (k) {
      idx = (k + shots.length) % shots.length;
      var im = $('img', shots[idx]);
      li.src = shots[idx].getAttribute('data-lightbox');
      li.alt = im ? im.alt : '';
      cap.textContent = (im ? im.alt : '') + (EN ? ' — ILLUSTRATIVE PHOTO, placeholder' : ' — FOTO ILUSTRATIVA, placeholder');
    };
    shots.forEach(function (s, k) { s.addEventListener('click', function () { show(k); lb.showModal(); }); });
    $('.lightbox__close', lb).addEventListener('click', function () { lb.close(); });
    $('.lightbox__prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lightbox__next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- LGPD cookie banner ---------- */
  var KEY = 'paesepapos-cookie-consent-v1';
  var banner = $('#cookie-banner');
  var read = function () { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  var save = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* unavailable */ } };
  var open = function (prefs) {
    if (!banner) return;
    banner.hidden = false;
    var st = read();
    $('#ck-analytics', banner).checked = !!(st && st.analytics);
    $('#ck-marketing', banner).checked = !!(st && st.marketing);
    $('.cookie__prefs', banner).classList.toggle('is-open', !!prefs);
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
    setTimeout(function () { var b = $('button', banner); if (b) b.focus(); }, 60);
  };
  var close = function (v) { save(v); banner.classList.remove('is-open'); setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 500); };
  if (banner) {
    if (!read()) setTimeout(function () { open(false); }, 700);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { close({ necessary: true, analytics: true, marketing: true, ts: Date.now() }); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { close({ necessary: true, analytics: false, marketing: false, ts: Date.now() }); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () { $('.cookie__prefs', banner).classList.toggle('is-open'); });
    $('[data-ck="save"]', banner).addEventListener('click', function () { close({ necessary: true, analytics: $('#ck-analytics', banner).checked, marketing: $('#ck-marketing', banner).checked, ts: Date.now() }); });
  }
  $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); open(true); }); });

  /* ---------- Google Maps: click-to-load (LGPD — no Google request before consent click) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-map-load]'), function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('[data-map-src]');
      if (!box) return;
      var f = document.createElement('iframe');
      f.title = box.getAttribute('data-map-title') || 'Google Maps';
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      f.setAttribute('allowfullscreen', '');
      f.src = box.getAttribute('data-map-src');
      box.parentNode.replaceChild(f, box);
      f.setAttribute('tabindex', '-1');
      f.focus();
    });
  });
})();
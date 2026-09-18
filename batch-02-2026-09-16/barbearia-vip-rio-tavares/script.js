/* Mockup TFS — script compartilhado (sem framework, sem backend, nada é armazenado além da escolha de cookies). */
(function () {
  'use strict';
  var doc = document, body = doc.body, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var calm = body.getAttribute('data-motion') === 'calm';
  var WA = (body.getAttribute('data-wa') || '').replace(/\D/g, '');
  var SITE = body.getAttribute('data-site') || 'site';
  var FALLBACK = body.getAttribute('data-wa-fallback') || '#contato';

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function waHref(text) { return WA ? 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '') : FALLBACK; }
  function store(k, v) { try { if (v === undefined) return window.localStorage.getItem(k); window.localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = doc.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-shown');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('is-shown'); }, 4200);
  }

  /* ---------- ano ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- cabeçalho ---------- */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var toggle = $('.nav-toggle'), nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !open);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggle.click(); toggle.focus(); } });
  }

  /* ---------- revelações ---------- */
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- parallax suave (apenas sites não "calm") ---------- */
  var px = $$('[data-parallax]');
  if (px.length && !reduce && !calm) {
    var ticking = false;
    var run = function () {
      px.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        el.style.transform = 'translate3d(0,' + (r.top * -0.12).toFixed(1) + 'px,0) scale(1.08)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  /* ---------- WhatsApp: links e mensagem por secção ---------- */
  $$('[data-wa-text]').forEach(function (a) {
    a.setAttribute('href', waHref(a.getAttribute('data-wa-text')));
    if (WA) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
  });
  var waLive = $$('[data-wa-live]');
  function setLive(text) { waLive.forEach(function (a) { a.setAttribute('href', waHref(text)); }); }
  if (waLive.length) {
    if (WA) waLive.forEach(function (a) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); });
    setLive(body.getAttribute('data-wa-default') || '');
    var secs = $$('[data-wa-msg]');
    if (secs.length && 'IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setLive(en.target.getAttribute('data-wa-msg')); });
      }, { rootMargin: '-45% 0px -45% 0px' });
      secs.forEach(function (s) { so.observe(s); });
    }
  }

  /* ---------- status aberto/fechado ---------- */
  var hoursData = $('#hours-data');
  var chip = $('[data-hours-chip]');
  if (hoursData && chip) {
    try {
      var hours = JSON.parse(hoursData.textContent || '[]');
      if (hours.length) {
        var now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), open = false;
        hours.forEach(function (h) {
          if (h.days.indexOf(day) > -1) {
            var o = h.opens.split(':'), c = h.closes.split(':');
            if (mins >= +o[0] * 60 + +o[1] && mins < +c[0] * 60 + +c[1]) open = true;
          }
        });
        chip.innerHTML = '<span class="dot" aria-hidden="true"></span>' + (open ? 'Aberto agora' : 'Fechado agora');
      }
    } catch (e) { /* mantém o texto estático */ }
  }

  /* ---------- tabela de preços (fonte: JSON na página) ---------- */
  function tokenize(v) {
    var s = esc(v);
    return s.replace(/\[(CONFIRM[^\]]*|CONFIRMAR[^\]]*)\]/g, '<span class="confirm">[$1]</span>')
            .replace(/\[(PLACEHOLDER[^\]]*)\]/g, '<span class="ph">[$1]</span>');
  }
  $$('[data-price-source]').forEach(function (tbody) {
    var src = doc.getElementById(tbody.getAttribute('data-price-source'));
    if (!src) return;
    try {
      var data = JSON.parse(src.textContent);
      var cols = data.columns;
      tbody.innerHTML = data.rows.map(function (r) {
        return '<tr>' + cols.map(function (c, i) {
          var val = tokenize(r[c.key] || '');
          if (i === 0) return '<th scope="row">' + val + '</th>';
          return '<td data-label="' + esc(c.label) + '"' + (c.cls ? ' class="' + c.cls + '"' : '') + '>' + val + '</td>';
        }).join('') + '</tr>';
      }).join('');
      var stamp = doc.querySelector('[data-price-stamp="' + tbody.getAttribute('data-price-source') + '"]');
      if (stamp && data.updated) stamp.innerHTML = 'atualizado em ' + tokenize(data.updated);
    } catch (e) { /* mantém as linhas estáticas */ }
  });

  /* ---------- carrossel ---------- */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.carousel__track', c);
    $$('[data-dir]', c).forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = +b.getAttribute('data-dir');
        var item = track.firstElementChild;
        var step = item ? item.getBoundingClientRect().width + 16 : track.clientWidth;
        track.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------- mapa: iframe só é injetado após clique (LGPD — nada de terceiros antes do consentimento) ---------- */
  $$('[data-load-map]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('.map-ph');
      var q = b.getAttribute('data-load-map');
      var ifr = doc.createElement('iframe');
      ifr.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
      ifr.title = 'Mapa: ' + q;
      ifr.loading = 'lazy';
      ifr.referrerPolicy = 'no-referrer-when-downgrade';
      ifr.setAttribute('allowfullscreen', '');
      ifr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:3';
      box.appendChild(ifr);
      box.classList.add('is-loaded');
    });
  });

  /* ---------- formulários de demonstração ---------- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('.form-status', f);
      if (st) { st.textContent = 'Demonstração: nada foi enviado nem armazenado.'; st.classList.add('is-shown'); }
      toast('Formulário de demonstração — nenhum dado foi enviado.');
    });
  });

  /* ---------- agendamento (compõe mensagem de WhatsApp) ---------- */
  function fmtDate(v) { var p = (v || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v; }
  function fieldValue(el) {
    if (el.tagName === 'FIELDSET') {
      var c = $('input:checked', el); return c ? c.value : '';
    }
    if (el.type === 'date') return fmtDate(el.value);
    return (el.value || '').trim();
  }

  $$('input[type="date"][data-min-today]').forEach(function (el) {
    var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    el.min = d.toISOString().slice(0, 10);
  });

  $$('form[data-booking]').forEach(function (form) {
    var panels = $$('.step-panel', form);
    var dots = $$('.steps li', form);
    var cur = 0;
    var status = $('.form-status', form);

    function panelValid(p) {
      var ok = true;
      $$('[data-required]', p).forEach(function (el) { if (!fieldValue(el)) ok = false; });
      return ok;
    }
    function show(i) {
      cur = Math.max(0, Math.min(i, panels.length - 1));
      panels.forEach(function (p, k) { p.hidden = k !== cur; });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-current', k === cur);
        d.classList.toggle('is-done', k < cur);
        if (k === cur) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      if (cur === panels.length - 1) summary();
    }
    function summary() {
      var dl = $('[data-summary]', form); if (!dl) return;
      dl.innerHTML = $$('[data-label]', form).filter(function (el) { return !el.closest('[data-summary-skip]'); }).map(function (el) {
        var v = fieldValue(el);
        return '<dt>' + esc(el.getAttribute('data-label')) + '</dt><dd>' + (v ? esc(v) : '—') + '</dd>';
      }).join('');
    }
    if (panels.length) {
      show(0);
      $$('[data-next]', form).forEach(function (b) {
        b.addEventListener('click', function () {
          if (!panelValid(panels[cur])) { toast('Escolha uma opção para continuar.'); return; }
          show(cur + 1);
          var first = $('input,select,button', panels[cur]); if (first) first.focus({ preventScroll: true });
        });
      });
      $$('[data-prev]', form).forEach(function (b) { b.addEventListener('click', function () { show(cur - 1); }); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('[data-required]', form).some(function (el) { return !fieldValue(el); });
      if (bad) { toast('Preencha as escolhas obrigatórias.'); return; }
      var consent = $('input[data-consent]', form);
      if (consent && !consent.checked) { toast('Marque a caixa de consentimento para continuar.'); consent.focus(); return; }
      var lines = [form.getAttribute('data-intro') || 'Olá!'];
      $$('[data-label]', form).forEach(function (el) {
        var v = fieldValue(el); if (v) lines.push(el.getAttribute('data-label') + ': ' + v);
      });
      var outro = form.getAttribute('data-outro'); if (outro) lines.push(outro);
      var text = lines.join('\n');
      if (status) {
        status.classList.add('is-shown');
        status.innerHTML = '<strong>Mensagem pronta (demonstração):</strong><br><span style="white-space:pre-line">' + esc(text) + '</span><br>' +
          (WA ? '<a class="btn btn--primary btn--sm" style="margin-top:10px" target="_blank" rel="noopener" href="' + esc(waHref(text)) + '">Abrir no WhatsApp</a>'
              : '<span class="confirm">[CONFIRM WhatsApp — número ainda não verificado]</span>');
      }
    });

    form.addEventListener('change', function () { if (panels.length && cur === panels.length - 1) summary(); });
  });

  /* "agendar com" — pré-seleciona o profissional */
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var val = b.getAttribute('data-pick');
      var input = doc.querySelector('input[data-pick-target][value="' + val.replace(/"/g, '\\"') + '"]');
      if (input) { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); }
      toast('Profissional pré-selecionado: ' + val);
      if (openSheet(e)) return;
    });
  });

  /* ---------- painel deslizante de agendamento (móvel) ---------- */
  var card = $('#booking-card');
  var backdrop;
  function isMobile() { return window.matchMedia('(max-width: 759px)').matches; }
  function closeSheet() {
    if (!card || !card.classList.contains('is-open')) return;
    card.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    setTimeout(function () { card.classList.remove('is-sheet'); card.removeAttribute('role'); card.removeAttribute('aria-modal'); }, reduce ? 0 : 450);
    root.style.overflow = '';
  }
  function openSheet(e) {
    if (!card || !isMobile() || !card.hasAttribute('data-sheet')) return false;
    if (e) e.preventDefault();
    if (!backdrop) { backdrop = doc.createElement('div'); backdrop.className = 'sheet-backdrop'; body.appendChild(backdrop); backdrop.addEventListener('click', closeSheet); }
    card.classList.add('is-sheet'); card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true');
    // força reflow antes de animar
    void card.offsetWidth;
    card.classList.add('is-open'); backdrop.classList.add('is-open');
    root.style.overflow = 'hidden';
    var f = $('input,select,button', card); if (f) f.focus({ preventScroll: true });
    return true;
  }
  $$('[data-open-booking]').forEach(function (a) { a.addEventListener('click', function (e) { openSheet(e); }); });
  $$('.sheet-close').forEach(function (b) { b.addEventListener('click', closeSheet); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  window.addEventListener('resize', function () { if (!isMobile()) closeSheet(); });

  /* ---------- banner de cookies (LGPD) ---------- */
  var KEY = 'tfs-consent-' + SITE;
  var cookie = $('#cookie');
  if (cookie) {
    var prefs = $('#cookie-prefs', cookie);
    var cats = $$('input[data-cat]', cookie);
    var saved = null;
    try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) { saved = null; }
    function apply(s) { cats.forEach(function (c) { c.checked = !!(s && s[c.getAttribute('data-cat')]); }); }
    function save(s) { s.date = new Date().toISOString(); store(KEY, JSON.stringify(s)); cookie.hidden = true; toast('Preferências de cookies salvas.'); }
    function openBanner(showPrefs) {
      apply(saved); cookie.hidden = false;
      if (prefs) prefs.hidden = !showPrefs;
      var pb = $('[data-cookie="prefs"]', cookie); if (pb) pb.setAttribute('aria-expanded', String(!!showPrefs));
      var first = $('button', cookie); if (first) first.focus({ preventScroll: true });
    }
    if (!saved) cookie.hidden = false;
    cookie.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') { saved = { necessarios: true, analise: true, marketing: true }; save(saved); }
      else if (act === 'reject') { saved = { necessarios: true, analise: false, marketing: false }; save(saved); }
      else if (act === 'prefs') { var o = prefs.hidden; prefs.hidden = !o; b.setAttribute('aria-expanded', String(o)); }
      else if (act === 'save') {
        saved = { necessarios: true };
        cats.forEach(function (c) { saved[c.getAttribute('data-cat')] = c.checked; });
        save(saved);
      }
    });
    $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); }); });
  }
})();

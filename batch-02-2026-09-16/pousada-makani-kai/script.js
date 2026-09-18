/* Pousada Makani Kai — mockup behaviour (no framework, no build step).
   WhatsApp: body[data-wa] = the published mobile +55 48 99246-1507 (brief: "likely WhatsApp-capable [CONFIRM]").
   The page labels it [CONFIRM WhatsApp] wherever it is used. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = (root.getAttribute('lang') || 'pt-BR').slice(0, 2);
  var WA = (body.getAttribute('data-wa') || '').replace(/\D/g, '');
  var COOKIE_KEY = body.getAttribute('data-cookie-key') || 'mockup-cookie-consent';

  var T = {
    pt: {
      nights: function (n) { return n + (n === 1 ? ' noite' : ' noites'); },
      nightsLabel: 'Noites', required: 'Campo obrigatório.', dateFmt: 'Use o formato DD/MM/AAAA.',
      dateInvalid: 'Data inválida.', datePast: 'A data não pode estar no passado.',
      after: 'A saída precisa ser depois da entrada.', min1: 'Informe pelo menos 1.',
      consent: 'É preciso aceitar a Política de Privacidade para continuar.',
      empty: 'Preencha os campos para ver o resumo da sua consulta.',
      fix: 'Revise os campos destacados.',
      composed: 'Mensagem pronta (demonstração — nada foi enviado):',
      waOpen: 'Abrir no WhatsApp',
      noWa: 'O número de WhatsApp ainda não foi confirmado pela pousada [CONFIRM WhatsApp]. Na versão final, este botão abre a conversa com a mensagem acima já preenchida.',
      demo: 'Formulário de demonstração — nada foi enviado.',
      close: 'Fechar', prev: 'Anterior', next: 'Próxima'
    },
    en: {
      nights: function (n) { return n + (n === 1 ? ' night' : ' nights'); },
      nightsLabel: 'Nights', required: 'Required field.', dateFmt: 'Use the DD/MM/YYYY format.',
      dateInvalid: 'Invalid date.', datePast: 'The date cannot be in the past.',
      after: 'Check-out must be after check-in.', min1: 'Enter at least 1.',
      consent: 'Please accept the Privacy Policy to continue.',
      empty: 'Fill in the fields to see a summary of your enquiry.',
      fix: 'Please review the highlighted fields.',
      composed: 'Message ready (demo — nothing was sent):',
      waOpen: 'Open in WhatsApp',
      noWa: 'The WhatsApp number has not yet been confirmed by the guesthouse [CONFIRM WhatsApp]. In the live version this button opens the chat with the message above pre-filled.',
      demo: 'Demo form — nothing was sent.',
      close: 'Close', prev: 'Previous', next: 'Next'
    },
    es: {
      nights: function (n) { return n + (n === 1 ? ' noche' : ' noches'); },
      nightsLabel: 'Noches', required: 'Campo obligatorio.', dateFmt: 'Usa el formato DD/MM/AAAA.',
      dateInvalid: 'Fecha no válida.', datePast: 'La fecha no puede ser anterior a hoy.',
      after: 'La salida debe ser posterior a la entrada.', min1: 'Indica al menos 1.',
      consent: 'Debes aceptar la Política de Privacidad para continuar.',
      empty: 'Completa los campos para ver el resumen de tu consulta.',
      fix: 'Revisa los campos resaltados.',
      composed: 'Mensaje listo (demostración — no se envió nada):',
      waOpen: 'Abrir en WhatsApp',
      noWa: 'La posada aún no ha confirmado el número de WhatsApp [CONFIRM WhatsApp]. En la versión final, este botón abre el chat con el mensaje de arriba ya escrito.',
      demo: 'Formulario de demostración — no se envió nada.',
      close: 'Cerrar', prev: 'Anterior', next: 'Siguiente'
    }
  };
  var t = T[lang] || T.pt;

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function waLink(text) { return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : ''); }

  /* year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* WhatsApp links (only when a verified number exists) */
  if (WA) {
    $$('[data-wa-text]').forEach(function (a) {
      a.setAttribute('href', waLink(a.getAttribute('data-wa-text')));
      a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
    });
  }

  /* sticky header */
  var header = $('.site-header'), top = $('.site-top');
  if (header && top) {
    var threshold = 0;
    var measure = function () { threshold = Math.max(0, top.offsetHeight - header.offsetHeight) + 40; };
    measure();
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > threshold); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); onScroll(); });
    onScroll();
  }

  /* mobile menu */
  var toggle = $('.nav-toggle'), panel = $('#mobile-panel');
  if (toggle && panel) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', String(!open));
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); toggle.focus(); } });
    doc.addEventListener('click', function (e) { if (panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
  }

  /* stagger indices */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--i', i); });
  });

  /* dividers: measure path lengths */
  $$('.divider path').forEach(function (p) {
    try { var l = Math.ceil(p.getTotalLength()); p.style.setProperty('--len', l); } catch (e) { /* noop */ }
  });

  /* reveal on scroll */
  var revealEls = $$('.reveal, .fork-grid, .divider');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in', 'drawn'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          if (en.target.classList.contains('divider')) en.target.classList.add('drawn');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* hero parallax (transform only) */
  var heroMedia = $('.hero-media');
  if (heroMedia && !reduce) {
    var ticking = false;
    var par = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) heroMedia.style.transform = 'translate3d(' + (-y * 0.08).toFixed(1) + 'px,' + (y * 0.16).toFixed(1) + 'px,0)';
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
  }

  /* carousels */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.carousel-track', c), prev = $('[data-prev]', c), next = $('[data-next]', c);
    if (!track) return;
    var step = function () { var f = track.firstElementChild; return f ? f.getBoundingClientRect().width + 18 : track.clientWidth; };
    var update = function () {
      var max = track.scrollWidth - track.clientWidth - 4;
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); }
    });
    window.addEventListener('resize', update);
    update();
  });

  /* lightbox */
  var lb = $('#lightbox');
  if (lb) {
    var lbImg = $('img', lb), lbCap = $('figcaption', lb), items = [], idx = 0, lastFocus = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var it = items[idx];
      lbImg.src = it.getAttribute('data-full');
      lbImg.alt = it.querySelector('img') ? it.querySelector('img').alt : '';
      lbCap.textContent = it.getAttribute('data-caption') || '';
    };
    var open = function (btn) {
      var g = btn.getAttribute('data-lightbox');
      items = $$('[data-lightbox="' + g + '"]');
      lastFocus = btn;
      show(items.indexOf(btn));
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
      $('.lb-close', lb).focus();
    };
    var close = function () {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    $$('[data-lightbox]').forEach(function (b) { b.addEventListener('click', function () { open(b); }); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'Tab') {
        var f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- enquiry composer (availability / therapies) ---------- */
  function parseDate(v) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v || '');
    if (!m) return null;
    var d = new Date(+m[3], +m[2] - 1, +m[1]);
    if (d.getFullYear() !== +m[3] || d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[1]) return 'bad';
    return d;
  }
  function maskDate(input) {
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '').slice(0, 8), out = d;
      if (d.length > 4) out = d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
      else if (d.length > 2) out = d.slice(0, 2) + '/' + d.slice(2);
      input.value = out;
    });
  }
  function fieldWrap(el) { return el.closest('.field'); }
  function setMsg(el, msg) {
    var w = fieldWrap(el); if (!w) return;
    var m = $('.field-msg', w);
    w.classList.toggle('invalid', !!msg);
    w.classList.toggle('valid', !msg && !!el.value);
    if (m) m.textContent = msg || '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function validateField(form, el, strict) {
    var v = (el.value || '').trim(), msg = '';
    if (el.hasAttribute('required') && !v) msg = strict ? t.required : '';
    else if (el.hasAttribute('data-date') && v) {
      var d = parseDate(v);
      if (d === null) msg = v.length >= 10 || strict ? t.dateFmt : '';
      else if (d === 'bad') msg = t.dateInvalid;
      else {
        var today = new Date(); today.setHours(0, 0, 0, 0);
        if (d < today) msg = t.datePast;
        var afterName = el.getAttribute('data-after');
        if (!msg && afterName) {
          var other = parseDate(form.elements[afterName].value);
          if (other instanceof Date && d <= other) msg = t.after;
        }
      }
    } else if (el.type === 'number' && v && +v < 1) msg = t.min1;
    setMsg(el, msg);
    return !msg && !(el.hasAttribute('required') && !v);
  }
  function nightsOf(form) {
    var ci = form.elements.checkin, co = form.elements.checkout;
    if (!ci || !co) return 0;
    var a = parseDate(ci.value), b = parseDate(co.value);
    if (a instanceof Date && b instanceof Date && b > a) return Math.round((b - a) / 86400000);
    return 0;
  }
  function collect(form) {
    var rows = [];
    $$('[data-sum]', form).forEach(function (el) {
      var v = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].text : '') : (el.value || '').trim();
      if (v) rows.push([el.getAttribute('data-sum'), v]);
      if (el.name === 'checkout') { var n = nightsOf(form); if (n) rows.push([t.nightsLabel, t.nights(n)]); }
    });
    return rows;
  }
  function renderSummary(form) {
    var box = $('.summary', form); if (!box) return;
    var rows = collect(form);
    if (!rows.length) { box.innerHTML = '<p class="sum-empty" style="margin:0">' + t.empty + '</p>'; return; }
    var dl = doc.createElement('dl');
    rows.forEach(function (r) {
      var wrap = doc.createElement('div'), dt = doc.createElement('dt'), dd = doc.createElement('dd');
      dt.textContent = r[0]; dd.textContent = r[1];
      wrap.appendChild(dt); wrap.appendChild(dd); dl.appendChild(wrap);
    });
    box.innerHTML = ''; box.appendChild(dl);
  }
  $$('form[data-composer]').forEach(function (form) {
    var inputs = $$('input, select, textarea', form).filter(function (el) { return el.type !== 'checkbox'; });
    var glowBox = form.closest('.widget') || form;
    var progress = function () {
      var req = inputs.filter(function (el) { return el.hasAttribute('required'); });
      var done = req.filter(function (el) { var w = fieldWrap(el); return el.value && !(w && w.classList.contains('invalid')); }).length;
      glowBox.style.setProperty('--progress', req.length ? (done / req.length).toFixed(2) : 0);
    };
    $$('[data-date]', form).forEach(maskDate);
    inputs.forEach(function (el) {
      el.addEventListener('input', function () { validateField(form, el, false); renderSummary(form); progress(); });
      el.addEventListener('change', function () { validateField(form, el, false); renderSummary(form); progress(); });
      el.addEventListener('blur', function () { if (el.value) validateField(form, el, true); });
    });
    renderSummary(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      inputs.forEach(function (el) { if (!validateField(form, el, true)) ok = false; });
      var consent = $('input[name="consent"]', form), cMsg = $('.consent-msg', form);
      if (consent && !consent.checked) { ok = false; if (cMsg) cMsg.textContent = t.consent; }
      else if (cMsg) cMsg.textContent = '';
      var notice = $('.form-notice', form);
      if (!ok) {
        notice.innerHTML = '<strong>' + t.fix + '</strong>';
        notice.classList.add('show');
        var firstBad = $('.invalid input, .invalid select', form) || (consent && !consent.checked ? consent : null);
        if (firstBad) firstBad.focus();
        return;
      }
      var rows = collect(form);
      var msg = (form.getAttribute('data-intro') || '') + '\n' + rows.map(function (r) { return '• ' + r[0] + ': ' + r[1]; }).join('\n');
      notice.innerHTML = '';
      var p = doc.createElement('p'); p.style.margin = '0'; p.innerHTML = '<strong>' + t.composed + '</strong>';
      var pre = doc.createElement('div'); pre.className = 'wa-preview'; pre.textContent = msg;
      notice.appendChild(p); notice.appendChild(pre);
      if (WA) {
        var a = doc.createElement('a'); a.className = 'btn btn-sol btn-sm'; a.href = waLink(msg);
        a.target = '_blank'; a.rel = 'noopener'; a.textContent = t.waOpen;
        notice.appendChild(a);
      } else {
        var n = doc.createElement('p'); n.style.margin = '0'; n.style.fontSize = '.85rem'; n.textContent = t.noWa;
        notice.appendChild(n);
      }
      notice.classList.add('show');
      notice.setAttribute('tabindex', '-1'); notice.focus({ preventScroll: false });
    });
  });

  /* ---------- click-to-load map (no third-party request until the visitor asks) ---------- */
  $$('[data-map-src]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.map-box');
      var f = doc.createElement('iframe');
      f.src = btn.getAttribute('data-map-src');
      f.title = btn.getAttribute('data-map-title') || 'Mapa';
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      box.innerHTML = ''; box.appendChild(f);
    });
  });

  /* ---------- cookie consent (LGPD) ---------- */
  var cookie = $('#cookie');
  if (cookie) {
    var prefs = $('.cookie-prefs', cookie);
    var save = function (analytics, marketing) {
      try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: analytics, marketing: marketing, ts: Date.now() })); } catch (e) { /* storage unavailable */ }
      cookie.classList.remove('show');
    };
    var stored = null;
    try { stored = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null'); } catch (e) { stored = null; }
    if (!stored) cookie.classList.add('show');
    var openBanner = function () {
      var s = null;
      try { s = JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null'); } catch (e) { s = null; }
      $('#ck-analytics').checked = !!(s && s.analytics);
      $('#ck-marketing').checked = !!(s && s.marketing);
      cookie.classList.add('show');
      $('[data-ck="accept"]', cookie).focus();
    };
    $('[data-ck="accept"]', cookie).addEventListener('click', function () { save(true, true); });
    $('[data-ck="reject"]', cookie).addEventListener('click', function () { save(false, false); });
    var prefBtn = $('[data-ck="prefs"]', cookie), prefLabel = prefBtn.textContent;
    prefBtn.addEventListener('click', function () {
      var open = !prefs.classList.contains('show');
      if (open) {
        prefs.classList.add('show'); prefBtn.setAttribute('aria-expanded', 'true');
        prefBtn.textContent = prefBtn.getAttribute('data-save-label') || prefLabel;
      } else {
        save($('#ck-analytics').checked, $('#ck-marketing').checked);
        prefBtn.setAttribute('aria-expanded', 'false'); prefs.classList.remove('show');
        prefBtn.textContent = prefLabel;
      }
    });
    $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', openBanner); });
  }
})();

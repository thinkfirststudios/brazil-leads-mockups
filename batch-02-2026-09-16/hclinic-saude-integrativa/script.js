/* MOCKUP script — calm motion, LGPD cookie banner, WhatsApp composer (demo only).
   No analytics, no pixels, no data stored except the cookie choice (localStorage). */
(function () {
  'use strict';
  var doc = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COOKIE_KEY = (body.getAttribute('data-site') || 'site') + '-cookie-consent-v1';

  /* ---------- year ---------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });

  /* ---------- sticky header condense ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-condensed', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 960) setOpen(false); });
  }

  /* ---------- scroll reveals (stagger via --i) ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add('reveal');
      child.style.setProperty('--i', i);
    });
  });
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- click-to-load map (no third-party request until asked) ---------- */
  document.querySelectorAll('[data-map-src]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var holder = btn.closest('.map');
      var iframe = document.createElement('iframe');
      iframe.src = btn.getAttribute('data-map-src');
      iframe.title = btn.getAttribute('data-map-title') || 'Mapa';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      holder.innerHTML = '';
      holder.appendChild(iframe);
    });
  });

  /* ---------- WhatsApp composer (demo only — nothing is sent or stored) ---------- */
  var form = document.getElementById('wa-form');
  if (form) {
    var notice = document.getElementById('wa-notice');
    var number = form.getAttribute('data-wa-number') || '';
    var intro = form.getAttribute('data-wa-intro') || 'Olá! Gostaria de agendar.';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = form.querySelector('[name="consent"]');
      notice.hidden = false;
      if (consent && !consent.checked) {
        notice.className = 'form-notice is-error';
        notice.textContent = 'Para continuar, marque a caixa de ciência sobre a Política de Privacidade.';
        consent.focus();
        return;
      }
      var lines = [intro];
      form.querySelectorAll('[data-wa-label]').forEach(function (field) {
        var value = '';
        if (field.tagName === 'FIELDSET') {
          var checked = field.querySelector('input:checked');
          value = checked ? checked.value : '';
        } else {
          value = (field.value || '').trim();
        }
        if (value) lines.push(field.getAttribute('data-wa-label') + ': ' + value);
      });
      var message = lines.join('\n');
      notice.className = 'form-notice';
      notice.innerHTML = '';
      var p = document.createElement('p');
      p.innerHTML = '<strong>Demonstração (mockup):</strong> nada foi enviado nem armazenado. No site publicado, este botão abrirá o WhatsApp com a mensagem abaixo:';
      var pre = document.createElement('pre');
      pre.textContent = message;
      notice.appendChild(p);
      notice.appendChild(pre);
      if (number) {
        var a = document.createElement('a');
        a.className = 'btn btn--primary';
        a.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Abrir no WhatsApp';
        notice.appendChild(a);
      }
    });
  }

  /* ---------- LGPD cookie banner ---------- */
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    var prefs = document.getElementById('cookie-prefs');
    var boxes = banner.querySelectorAll('input[data-cookie-cat]');
    var read = function () {
      try { return JSON.parse(window.localStorage.getItem(COOKIE_KEY)); } catch (err) { return null; }
    };
    var write = function (value) {
      try { window.localStorage.setItem(COOKIE_KEY, JSON.stringify(value)); } catch (err) { /* storage unavailable */ }
    };
    var open = function (showPrefs) {
      var saved = read();
      boxes.forEach(function (b) { b.checked = !!(saved && saved[b.getAttribute('data-cookie-cat')]); });
      prefs.hidden = !showPrefs;
      banner.hidden = false;
      if (showPrefs) {
        var focusTarget = banner.querySelector('input[data-cookie-cat]');
        if (focusTarget) focusTarget.focus();
      }
    };
    var close = function (value) {
      value.date = new Date().toISOString();
      write(value);
      banner.hidden = true;
      /* Analytics would only be loaded here if value.analise === true. None is configured in this mockup. */
    };
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      var action = btn.getAttribute('data-cookie');
      if (action === 'accept') close({ necessarios: true, analise: true, marketing: true });
      else if (action === 'reject') close({ necessarios: true, analise: false, marketing: false });
      else if (action === 'prefs') { prefs.hidden = !prefs.hidden; btn.setAttribute('aria-expanded', String(!prefs.hidden)); }
      else if (action === 'save') {
        var v = { necessarios: true };
        boxes.forEach(function (b) { v[b.getAttribute('data-cookie-cat')] = b.checked; });
        close(v);
      }
    });
    document.querySelectorAll('[data-open-cookies]').forEach(function (link) {
      link.addEventListener('click', function (e) { e.preventDefault(); open(true); });
    });
    if (!read()) open(false);
  }
})();

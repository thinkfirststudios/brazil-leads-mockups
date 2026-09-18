/* Cristina Imóveis — MOCKUP script (no framework, no build step) */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONFIG — fill in ONLY with verified values.
     WA_NUMBER: digits only, format 55 + DDD + número (e.g. 5548XXXXXXXXX).
     While empty, every WhatsApp button stays labelled [CONFIRM WhatsApp]
     and points to #contato — never to a fake wa.me link.
  ------------------------------------------------------------------ */
  var WA_NUMBER = '';   // [CONFIRM WhatsApp]
  var TEL_NUMBER = '';  // [CONFIRM telefone] e.g. +55480000000
  var CONSENT_KEY = 'ci_cookie_consent_v1';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- WhatsApp / phone links ---------- */
  function waHref(text) {
    return 'https://wa.me/' + WA_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  if (WA_NUMBER) {
    document.querySelectorAll('.js-wa').forEach(function (a) {
      a.href = waHref(a.getAttribute('data-wa-text') || '');
      a.target = '_blank';
      a.rel = 'noopener';
      a.querySelectorAll('.confirm').forEach(function (c) { c.remove(); });
    });
  }
  if (TEL_NUMBER) {
    document.querySelectorAll('.js-tel').forEach(function (a) {
      a.href = 'tel:' + TEL_NUMBER;
      a.querySelectorAll('.confirm').forEach(function (c) { c.remove(); });
    });
  }

  /* ---------- sticky header condense ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-condensed', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
    };
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- scroll reveals (stagger via --i) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // auto-stagger siblings that have no explicit --i
    reveals.forEach(function (el) {
      if (!el.style.getPropertyValue('--i') && el.parentElement) {
        var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
        el.style.setProperty('--i', Math.min(sibs.indexOf(el), 6));
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- click-to-load map (no third-party request before user action) ---------- */
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slot = btn.closest('[data-map]');
      if (!slot) return;
      var q = encodeURIComponent(slot.getAttribute('data-query') || '');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + q + '&output=embed';
      iframe.title = 'Mapa: ' + (slot.getAttribute('data-query') || 'localização');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      slot.innerHTML = '';
      slot.classList.add('is-loaded');
      slot.appendChild(iframe);
    });
  });

  /* ---------- demo forms → WhatsApp hand-off ---------- */
  document.querySelectorAll('.js-demo-form').forEach(function (form) {
    var notice = form.querySelector('.demo-notice');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = form.querySelector('input[name="lgpd"]');
      var missing = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (f) {
        return f.type === 'checkbox' ? !f.checked : !String(f.value).trim();
      });
      if (missing.length) {
        notice.textContent = consent && !consent.checked && missing.length === 1
          ? 'Para continuar, marque a caixa de consentimento (LGPD).'
          : 'Preencha todos os campos e marque a caixa de consentimento para continuar.';
        notice.classList.add('is-shown');
        missing[0].focus();
        return;
      }
      var parts = [];
      form.querySelectorAll('select, input[type="text"]').forEach(function (f) {
        var label = form.querySelector('label[for="' + f.id + '"]');
        parts.push((label ? label.textContent.trim() : f.name) + ': ' + f.value.trim());
      });
      var text = 'Olá! Quero vender/anunciar meu imóvel. ' + parts.join(' | ');
      if (WA_NUMBER) {
        window.open(waHref(text), '_blank', 'noopener');
        notice.textContent = 'Abrimos o WhatsApp com a sua mensagem.';
      } else {
        notice.textContent = 'MOCKUP: formulário de demonstração — nada foi enviado. No site real, esta mensagem abrirá no WhatsApp da corretora ([CONFIRM número]): "' + text + '"';
      }
      notice.classList.add('is-shown');
    });
  });

  /* ---------- LGPD cookie banner ---------- */
  var banner = document.getElementById('cookie');
  if (banner) {
    var prefsBox = document.getElementById('cookie-prefs');
    var prefsBtn = banner.querySelector('[data-cookie="prefs"]');
    var saveBtn = banner.querySelector('[data-cookie="save"]');
    var boxes = banner.querySelectorAll('input[data-cat]');
    var read = function () { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (err) { return null; } };
    var write = function (val) { try { localStorage.setItem(CONSENT_KEY, JSON.stringify(val)); } catch (err) { /* storage unavailable */ } };
    var apply = function (c) {
      window.__consent = c;
      // Hook: load analytics/marketing tags ONLY here, and only if c.analise / c.marketing is true.
      html.setAttribute('data-consent-analise', c && c.analise ? 'yes' : 'no');
      html.setAttribute('data-consent-marketing', c && c.marketing ? 'yes' : 'no');
    };
    var open = function (showPrefs) {
      var c = read();
      boxes.forEach(function (b) { b.checked = !!(c && c[b.getAttribute('data-cat')]); });
      banner.hidden = false;
      togglePrefs(!!showPrefs);
      requestAnimationFrame(function () { banner.classList.add('is-open'); });
      var first = banner.querySelector('button');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, reduce ? 0 : 350);
    };
    var close = function () {
      banner.classList.remove('is-open');
      setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 400);
    };
    var togglePrefs = function (show) {
      prefsBox.classList.toggle('is-open', show);
      prefsBtn.setAttribute('aria-expanded', String(show));
      saveBtn.hidden = !show;
    };
    var decide = function (analise, marketing) {
      var c = { necessarios: true, analise: analise, marketing: marketing, data: new Date().toISOString() };
      write(c); apply(c); close();
    };
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') decide(true, true);
      else if (act === 'reject') decide(false, false);
      else if (act === 'prefs') togglePrefs(!prefsBox.classList.contains('is-open'));
      else if (act === 'save') {
        var v = {};
        boxes.forEach(function (x) { v[x.getAttribute('data-cat')] = x.checked; });
        decide(!!v.analise, !!v.marketing);
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); open(true); });
    });
    var existing = read();
    if (existing) apply(existing); else open(false);
  }
})();

/* MOCKUP — script compartilhado (sem framework, sem build).
   Nenhuma tag de análise ou marketing é carregada por este arquivo.
   Pixel da Meta / remarketing: NÃO instalar nesta propriedade (dado sensível — LGPD art. 11). */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano atual ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Cabeçalho que condensa ---------- */
  var head = document.querySelector('.site-head');
  if (head) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        head.classList.toggle('is-condensed', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu móvel ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  var scrim = document.querySelector('.nav-scrim');
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = nav.querySelector('a,button');
      if (first) first.focus();
    }
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  /* ---------- Revelação ao rolar (com escalonamento) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 100;
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add('reveal');
      child.style.setProperty('--d', (i * step) + 'ms');
    });
  });
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ---------- WhatsApp: mensagem pré-preenchida por seção ----------
     O botão flutuante só recebe link wa.me se tiver data-wa-number (número verificado).
     Sem número verificado, o href permanece "#contato" e o rótulo [CONFIRM] continua visível. */
  var wa = document.querySelector('.wa-float');
  var waNumber = wa ? wa.getAttribute('data-wa-number') : '';
  function waHref(text) {
    return 'https://wa.me/' + waNumber + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  Array.prototype.forEach.call(document.querySelectorAll('a[data-wa-text]'), function (a) {
    var num = a.getAttribute('data-wa-number') || waNumber;
    if (num) {
      a.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(a.getAttribute('data-wa-text'));
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });
  if (wa && waNumber && 'IntersectionObserver' in window) {
    var defaultText = wa.getAttribute('data-wa-text') || '';
    wa.href = waHref(defaultText);
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          wa.href = waHref(entry.target.getAttribute('data-wa-section') || defaultText);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa-section]'), function (s) { secIO.observe(s); });
  }

  /* ---------- Formulários (demonstração) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-demo]'), function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = form.querySelector('input[name="lgpd"]');
      status.classList.remove('ok', 'err');
      if (!form.checkValidity() || (consent && !consent.checked)) {
        status.textContent = consent && !consent.checked
          ? 'Para enviar, marque a caixa de consentimento (LGPD). Nada foi enviado.'
          : 'Preencha os campos obrigatórios. Nada foi enviado.';
        status.classList.add('err', 'is-visible');
        var bad = form.querySelector(':invalid') || consent;
        if (bad) bad.focus();
        return;
      }
      status.innerHTML = '<strong>Pedido registrado (demonstração).</strong> Este é um mockup — nenhum dado foi enviado ou armazenado. ' +
        'No site real, esta mensagem confirmaria o recebimento e o prazo de resposta <span class="confirm">[CONFIRM prazo]</span>.';
      status.classList.add('ok', 'is-visible');
      status.focus();
      form.reset();
    });
  });

  /* ---------- Consentimento de cookies (LGPD) ---------- */
  var KEY = 'mockup-cookie-consent-v1';
  var banner = document.getElementById('cookie');
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function saveConsent(obj) {
    obj.date = new Date().toISOString();
    try { window.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) { /* armazenamento indisponível */ }
    applyConsent(obj);
  }
  function applyConsent(c) {
    /* Ponto de integração: carregar análise first-party SOMENTE se c.analytics === true.
       Marketing permanece desativado por recomendação (sem pixel/remarketing). */
    doc.setAttribute('data-consent-analytics', c && c.analytics ? 'on' : 'off');
    doc.setAttribute('data-consent-marketing', c && c.marketing ? 'on' : 'off');
  }
  function openBanner(showPrefs) {
    if (!banner) return;
    banner.hidden = false;
    var prefs = banner.querySelector('.cookie-prefs');
    var c = readConsent() || {};
    var a = banner.querySelector('#ck-analytics');
    var m = banner.querySelector('#ck-marketing');
    if (a) a.checked = !!c.analytics;
    if (m) m.checked = !!c.marketing;
    if (prefs) prefs.hidden = !showPrefs;
    var prefBtn = banner.querySelector('[data-ck="prefs"]');
    if (prefBtn) {
      prefBtn.textContent = showPrefs ? 'Salvar preferências' : 'Preferências';
      prefBtn.setAttribute('aria-expanded', showPrefs ? 'true' : 'false');
    }
    var h = banner.querySelector('h2');
    if (h) h.focus();
  }
  function closeBanner() { if (banner) banner.hidden = true; }
  if (banner) {
    var existing = readConsent();
    applyConsent(existing);
    if (!existing) openBanner(false);
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-ck]');
      if (!btn) return;
      var act = btn.getAttribute('data-ck');
      if (act === 'accept') { saveConsent({ necessary: true, analytics: true, marketing: true }); closeBanner(); }
      if (act === 'reject') { saveConsent({ necessary: true, analytics: false, marketing: false }); closeBanner(); }
      if (act === 'prefs') {
        var prefs = banner.querySelector('.cookie-prefs');
        if (prefs && !prefs.hidden) {
          saveConsent({
            necessary: true,
            analytics: !!banner.querySelector('#ck-analytics').checked,
            marketing: !!banner.querySelector('#ck-marketing').checked
          });
          closeBanner();
        } else {
          openBanner(true);
        }
      }
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-cookie-open]'), function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); });
  });
})();

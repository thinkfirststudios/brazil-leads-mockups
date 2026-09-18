/* Almir Nahas / Instituto Aurora Sistêmica — mockup behaviour (no framework) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var isEN = (doc.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0;
  var STORE_KEY = 'ans-cookie-consent-v1';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var T = isEN ? {
    formOk: 'Demo only — this mockup does not send data. On the live site your message would be delivered to the team and you would receive a reply within [CONFIRM response time].',
    formConsent: 'Please tick the consent box to continue.',
    saved: 'Preferences saved.'
  } : {
    formOk: 'Demonstração — este mockup não envia dados. No site publicado, sua mensagem seria encaminhada à equipe, com retorno em [CONFIRM prazo de resposta].',
    formConsent: 'Marque a caixa de consentimento para continuar.',
    saved: 'Preferências salvas.'
  };

  /* Year */
  var y = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });

  /* Sticky header condense */
  var header = document.querySelector('.header');
  function onScroll() {
    var s = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-condensed', s > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var menuBtn = document.querySelector('[data-menu-open]');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.querySelector('[data-menu-close]');
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = menu.querySelector('a,button'); if (f) f.focus(); }
    else menuBtn.focus();
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; } });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
      if (e.key === 'Tab') {
        var items = menu.querySelectorAll('a,button');
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* Scroll reveals with stagger (no count-up until the experience-figure inconsistency is resolved, by brief) */
  var groups = document.querySelectorAll('[data-stagger]');
  groups.forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.classList.add('reveal'); c.style.setProperty('--i', Math.min(i, 10)); });
  });
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Subtle hero parallax (transform only) */
  var par = document.querySelector('[data-parallax]');
  if (par && !reduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var s = Math.min(window.scrollY, 900);
        par.style.transform = 'translate3d(0,' + (s * 0.12).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* Contact path switch (individual vs corporate) */
  document.querySelectorAll('[data-path-form]').forEach(function (form) {
    function apply() {
      var v = (form.querySelector('input[name="caminho"]:checked') || {}).value;
      form.querySelectorAll('[data-path-only]').forEach(function (el) {
        var show = el.getAttribute('data-path-only') === v;
        el.hidden = !show;
        el.querySelectorAll('input,select,textarea').forEach(function (i) { i.disabled = !show; });
      });
    }
    form.addEventListener('change', function (e) { if (e.target.name === 'caminho') apply(); });
    apply();
  });
  /* Links that preselect the corporate path */
  document.querySelectorAll('[data-select-path]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = document.querySelector('input[name="caminho"][value="' + a.getAttribute('data-select-path') + '"]');
      if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  });

  /* Demo forms */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var consent = form.querySelector('input[name="consentimento"]');
      if (consent && !consent.checked) {
        if (status) { status.textContent = T.formConsent; status.classList.add('is-visible'); }
        consent.focus();
        return;
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (status) { status.textContent = T.formOk; status.classList.add('is-visible'); status.focus(); }
    });
  });

  /* LGPD cookie sheet */
  var sheet = document.getElementById('cookie-sheet');
  function readConsent() { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; } }
  function writeConsent(obj) { try { localStorage.setItem(STORE_KEY, JSON.stringify(obj)); } catch (e) { /* storage unavailable */ } }
  function openSheet(showPrefs) {
    if (!sheet) return;
    var c = readConsent();
    var a = sheet.querySelector('input[name="analise"]');
    var m = sheet.querySelector('input[name="marketing"]');
    if (a) a.checked = !!(c && c.analise);
    if (m) m.checked = !!(c && c.marketing);
    sheet.classList.add('is-open');
    var prefs = sheet.querySelector('.cookie-prefs');
    if (prefs) prefs.classList.toggle('is-open', !!showPrefs);
    if (showPrefs) { var t = sheet.querySelector('h2'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } }
  }
  function closeSheet() { if (sheet) sheet.classList.remove('is-open'); }
  function save(analise, marketing) {
    writeConsent({ necessarios: true, analise: !!analise, marketing: !!marketing, data: new Date().toISOString() });
    closeSheet();
    /* Google Tag Manager (currently firing unconditionally on the live site) must only be injected here, after opt-in. Not loaded in this mockup. */
  }
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') save(true, true);
      else if (act === 'reject') save(false, false);
      else if (act === 'prefs') sheet.querySelector('.cookie-prefs').classList.toggle('is-open');
      else if (act === 'save') save(sheet.querySelector('input[name="analise"]').checked, sheet.querySelector('input[name="marketing"]').checked);
    });
    sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape' && readConsent()) closeSheet(); });
    if (!readConsent()) setTimeout(function () { openSheet(false); }, 600);
  }
  document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openSheet(true); });
  });
})();

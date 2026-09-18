/* Adriana Beria – Arquitetura.Interiores.Paisagismo — mockup behaviour (no framework) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var isEN = (doc.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0;
  var STORE_KEY = 'aba-cookie-consent-v1';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var T = isEN ? {
    okTitle: 'Thank you — enquiry received (demo)',
    okBody: 'This mockup does not send data. On the live site the studio would reply within [CONFIRM response time].',
    consent: 'Please tick the consent box to continue.',
    of: 'of', stock: 'Illustrative stock photo — not the studio\'s work'
  } : {
    okTitle: 'Obrigado — pedido recebido (demonstração)',
    okBody: 'Este mockup não envia dados. No site publicado, o estúdio responderia em [CONFIRM prazo de resposta].',
    consent: 'Marque a caixa de consentimento para continuar.',
    of: 'de', stock: 'Foto ilustrativa de banco de imagens — não é projeto do estúdio'
  };

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Header condense */
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', (window.scrollY || 0) > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile menu with focus trap */
  var menuBtn = document.querySelector('[data-menu-open]');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open, restore) {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = menu.querySelector('button,a'); if (f) f.focus(); }
    else if (restore) menuBtn.focus();
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(true); });
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-menu-close]')) setMenu(false, true);
      else if (e.target.closest('a')) setMenu(false, false);
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false, true);
      if (e.key === 'Tab') {
        var items = menu.querySelectorAll('a,button'); var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* Reveals */
  document.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.classList.add('reveal'); c.style.setProperty('--i', Math.min(i, 8)); });
  });
  var rev = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) rev.forEach(function (el) { el.classList.add('is-in'); });
  else {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    rev.forEach(function (el) { io.observe(el); });
  }

  /* Hero cross-fade (disabled under reduced motion) */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots button');
  var cur = 0, timer = null;
  function show(i) {
    if (!slides.length) return;
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === cur); s.setAttribute('aria-hidden', String(k !== cur)); });
    dots.forEach(function (d, k) { d.setAttribute('aria-pressed', String(k === cur)); });
  }
  function play() { if (!reduced && slides.length > 1) { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 6500); } }
  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); play(); }); });
  show(0); play();
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else play(); });

  /* Project filters */
  var grid = document.querySelector('[data-projects]');
  var fbtns = document.querySelectorAll('[data-filter]');
  function applyFilter(f) {
    if (!grid) return;
    grid.classList.toggle('is-filtered', f !== 'all');
    grid.querySelectorAll('[data-disc]').forEach(function (li) { li.hidden = !(f === 'all' || li.getAttribute('data-disc') === f); });
    document.querySelectorAll('.filters [data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === f)); });
  }
  fbtns.forEach(function (b) {
    b.addEventListener('click', function (e) {
      var f = b.getAttribute('data-filter');
      applyFilter(f);
      if (b.tagName === 'A') { e.preventDefault(); var t = document.getElementById('projetos') || document.getElementById('projects'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    });
  });

  /* Lightbox with focus trap + escape */
  var lb = document.getElementById('lightbox');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var lbIndex = 0, lastFocus = null;
  function lbRender() {
    var t = triggers[lbIndex]; if (!t || !lb) return;
    var img = lb.querySelector('img');
    var src = t.getAttribute('data-full');
    var alt = t.querySelector('img') ? t.querySelector('img').alt : '';
    img.classList.add('is-swapping');
    setTimeout(function () {
      img.src = src; img.alt = alt;
      lb.querySelector('.lb-cap').textContent = alt;
      lb.querySelector('.lb-count').textContent = (lbIndex + 1) + ' ' + T.of + ' ' + triggers.length;
      img.classList.remove('is-swapping');
    }, reduced ? 0 : 180);
  }
  function lbOpen(i) {
    if (!lb) return;
    lastFocus = document.activeElement; lbIndex = i;
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbRender();
    lb.querySelector('.lb-close').focus();
  }
  function lbClose() {
    if (!lb) return;
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  triggers.forEach(function (t, i) { t.addEventListener('click', function () { lbOpen(i); }); });
  if (lb) {
    lb.querySelector('.lb-close').addEventListener('click', lbClose);
    lb.querySelector('.lb-prev').addEventListener('click', function () { lbIndex = (lbIndex - 1 + triggers.length) % triggers.length; lbRender(); });
    lb.querySelector('.lb-next').addEventListener('click', function () { lbIndex = (lbIndex + 1) % triggers.length; lbRender(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); lbClose(); }
      else if (e.key === 'ArrowLeft') lb.querySelector('.lb-prev').click();
      else if (e.key === 'ArrowRight') lb.querySelector('.lb-next').click();
      else if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button'); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* Enquiry form (demo) with visible confirmation state */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var consent = form.querySelector('input[name="consentimento"]');
      if (consent && !consent.checked) {
        status.innerHTML = '';
        var p = document.createElement('p'); p.textContent = T.consent; status.appendChild(p);
        status.classList.add('is-visible'); consent.focus(); return;
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.innerHTML = '';
      var h = document.createElement('h3'); h.textContent = T.okTitle;
      var b = document.createElement('p'); b.textContent = T.okBody;
      status.appendChild(h); status.appendChild(b);
      status.classList.add('is-visible'); status.focus();
    });
  });

  /* LGPD cookie sheet */
  var sheet = document.getElementById('cookie-sheet');
  function readC() { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; } }
  function writeC(o) { try { localStorage.setItem(STORE_KEY, JSON.stringify(o)); } catch (e) { /* unavailable */ } }
  function openSheet(prefs) {
    if (!sheet) return;
    var c = readC();
    sheet.querySelector('input[name="analise"]').checked = !!(c && c.analise);
    sheet.querySelector('input[name="marketing"]').checked = !!(c && c.marketing);
    sheet.querySelector('.cookie-prefs').classList.toggle('is-open', !!prefs);
    sheet.classList.add('is-open');
    if (prefs) { var t = sheet.querySelector('h2'); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }
  function save(a, m) { writeC({ necessarios: true, analise: !!a, marketing: !!m, data: new Date().toISOString() }); sheet.classList.remove('is-open'); /* analytics would load here only after opt-in */ }
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]'); if (!b) return;
      var a = b.getAttribute('data-cookie');
      if (a === 'accept') save(true, true);
      else if (a === 'reject') save(false, false);
      else if (a === 'prefs') sheet.querySelector('.cookie-prefs').classList.toggle('is-open');
      else if (a === 'save') save(sheet.querySelector('input[name="analise"]').checked, sheet.querySelector('input[name="marketing"]').checked);
    });
    if (!readC()) setTimeout(function () { openSheet(false); }, 700);
  }
  document.querySelectorAll('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openSheet(true); }); });
})();

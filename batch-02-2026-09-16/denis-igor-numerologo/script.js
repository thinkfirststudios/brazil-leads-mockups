/* Denis Igor — Numerologia Pitagórica · mockup script (no framework, no build step) */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* [CONFIRM WhatsApp number] — none was found (only @denis.igor on Instagram).
     While null, every WhatsApp CTA keeps href="#agendamento" (scrolls to the booking form; no dead or invented wa.me link). */
  var WA_NUMBER = null;
  var COOKIE_KEY = 'di_cookie_consent_v1';

  function store(k, v) { try { if (v === undefined) { return window.localStorage.getItem(k); } window.localStorage.setItem(k, v); } catch (e) { return null; } return null; }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  $all('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* WhatsApp prefill — only activates once a real number exists */
  if (WA_NUMBER) {
    $all('[data-wa]').forEach(function (a) {
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  /* header condense + hero parallax */
  var heroImg = d.querySelector('[data-parallax]');
  var ticking = false;
  function frame() {
    var y = window.scrollY;
    root.classList.toggle('is-scrolled', y > 40);
    if (heroImg && !reduce && y < window.innerHeight * 1.2) {
      heroImg.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(frame); } }, { passive: true });
  frame();

  /* mobile menu */
  var toggle = d.querySelector('.menu-toggle');
  var menu = d.getElementById('mobile-menu');
  var scrim = d.querySelector('.scrim');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    if (scrim) { scrim.classList.toggle('is-open', open); }
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) { var f = menu.querySelector('a,button'); if (f) { f.focus(); } } else { toggle.focus({ preventScroll: true }); }
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
    $all('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); }); });
    $all('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); } });
  }

  /* reveal */
  var reveals = $all('.reveal, .num-in');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* accordion height animation (keeps native <details>) */
  if (!reduce) {
    $all('.faq details').forEach(function (det) {
      var sum = det.querySelector('summary');
      var body = det.querySelector('.faq__body');
      if (!sum || !body) { return; }
      sum.addEventListener('click', function (e) {
        e.preventDefault();
        if (det.open) {
          body.style.height = body.scrollHeight + 'px';
          window.requestAnimationFrame(function () { body.style.height = '0px'; });
          window.setTimeout(function () { det.open = false; body.style.height = ''; }, 450);
        } else {
          det.open = true;
          var h = body.scrollHeight;
          body.style.height = '0px';
          window.requestAnimationFrame(function () { body.style.height = h + 'px'; });
          window.setTimeout(function () { body.style.height = ''; }, 470);
        }
      });
    });
  }

  /* preselect consultation type from CTA links: <a data-type="empresarial" href="#agendamento"> */
  $all('[data-type]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = d.getElementById('b-tipo');
      if (sel) { sel.value = a.getAttribute('data-type'); }
    });
  });

  /* LGPD cookie sheet */
  var sheet = d.getElementById('cookie');
  if (sheet) {
    var prefs = d.getElementById('cookie-prefs');
    var btnPrefs = sheet.querySelector('[data-cookie="prefs"]');
    var btnSave = sheet.querySelector('[data-cookie="save"]');
    var boxA = sheet.querySelector('input[name="analytics"]');
    var boxM = sheet.querySelector('input[name="marketing"]');
    var saved = null;
    try { saved = JSON.parse(store(COOKIE_KEY) || 'null'); } catch (e) { saved = null; }
    var openSheet = function () {
      if (saved) { boxA.checked = !!saved.analytics; boxM.checked = !!saved.marketing; }
      sheet.hidden = false;
      var h = sheet.querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    };
    var save = function (a, m) {
      saved = { necessary: true, analytics: !!a, marketing: !!m, date: new Date().toISOString() };
      store(COOKIE_KEY, JSON.stringify(saved));
      sheet.hidden = true; /* mockup: no analytics/marketing script is loaded in any case */
    };
    sheet.querySelector('[data-cookie="accept"]').addEventListener('click', function () { save(true, true); });
    sheet.querySelector('[data-cookie="reject"]').addEventListener('click', function () { save(false, false); });
    btnPrefs.addEventListener('click', function () {
      var show = prefs.hidden;
      prefs.hidden = !show; btnSave.hidden = !show;
      btnPrefs.setAttribute('aria-expanded', show ? 'true' : 'false');
    });
    btnSave.addEventListener('click', function () { save(boxA.checked, boxM.checked); });
    $all('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', openSheet); });
    if (!saved) { sheet.hidden = false; }
  }

  /* demo booking form with visible confirmation state */
  $all('form[data-demo]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var success = d.getElementById(form.getAttribute('data-success') || '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) { status.hidden = false; status.textContent = 'Verifique os campos obrigatórios e a autorização de uso dos dados.'; }
        return;
      }
      if (status) { status.hidden = true; }
      if (success) {
        var tipo = form.querySelector('#b-tipo');
        var out = success.querySelector('[data-out="tipo"]');
        if (tipo && out) { out.textContent = tipo.options[tipo.selectedIndex].text; }
        var ref = success.querySelector('[data-out="ref"]');
        if (ref) { ref.textContent = 'DEMO-' + Date.now().toString(36).toUpperCase(); }
        form.hidden = true;
        success.hidden = false;
        var h = success.querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
      }
      form.reset();
    });
    var again = success && success.querySelector('[data-again]');
    if (again) {
      again.addEventListener('click', function () { success.hidden = true; form.hidden = false; var f = form.querySelector('input'); if (f) { f.focus(); } });
    }
  });
})();

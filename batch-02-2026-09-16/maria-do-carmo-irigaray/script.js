/* Maria do Carmo Irigaray — mockup script (no framework, no build step) */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* [CONFIRM WhatsApp number] — none was found. Set e.g. '5548XXXXXXXXX' once supplied.
     While null, every WhatsApp CTA keeps href="#contato" (no dead or invented wa.me link). */
  var WA_NUMBER = null;
  var CITY_KEY = 'mdc_city';
  var COOKIE_KEY = 'mdc_cookie_consent_v1';

  function store(k, v) { try { if (v === undefined) { return window.localStorage.getItem(k); } window.localStorage.setItem(k, v); } catch (e) { return null; } return null; }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  /* ---------- year ---------- */
  $all('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- header condense ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () {
      root.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = d.querySelector('.menu-toggle');
  var menu = d.getElementById('mobile-menu');
  var scrim = d.querySelector('.scrim');
  function setMenu(open) {
    if (!menu || !toggle) { return; }
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

  /* ---------- city selector ---------- */
  var CITIES = { florianopolis: 'Florianópolis', cuiaba: 'Cuiabá' };
  var city = store(CITY_KEY);
  if (!CITIES[city]) { city = root.getAttribute('data-default-city') || 'florianopolis'; }
  if (CITIES[root.getAttribute('data-force-city')]) { city = root.getAttribute('data-force-city'); }

  function waHref(tpl) {
    if (!WA_NUMBER) { return null; }
    var text = (tpl || 'Olá! Vim pelo site e gostaria de mais informações.').replace(/\{cidade\}/g, CITIES[city]);
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function updateWa() {
    $all('[data-wa]').forEach(function (a) {
      var h = waHref(a.getAttribute('data-wa'));
      if (h) { a.setAttribute('href', h); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
    });
  }
  function applyCity(next, animate) {
    city = next;
    store(CITY_KEY, next);
    $all('.city-select button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-city') === next ? 'true' : 'false'); });
    $all('[data-city-name]').forEach(function (el) {
      if (animate && !reduce) {
        el.classList.add('is-fading');
        window.setTimeout(function () { el.textContent = CITIES[next]; el.classList.remove('is-fading'); }, 260);
      } else { el.textContent = CITIES[next]; }
    });
    $all('.city[data-city-card]').forEach(function (c) { c.classList.toggle('is-selected', c.getAttribute('data-city-card') === next); });
    $all('select[data-city-field]').forEach(function (s) { s.value = next; });
    updateWa();
  }
  $all('.city-select button').forEach(function (b) {
    b.addEventListener('click', function () { applyCity(b.getAttribute('data-city'), true); });
  });
  applyCity(city, false);

  /* ---------- scroll reveal ---------- */
  var reveals = $all('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- accordion height animation (native <details> semantics kept) ---------- */
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
          window.setTimeout(function () { det.open = false; body.style.height = ''; }, 400);
        } else {
          det.open = true;
          var h = body.scrollHeight;
          body.style.height = '0px';
          window.requestAnimationFrame(function () { body.style.height = h + 'px'; });
          window.setTimeout(function () { body.style.height = ''; }, 420);
        }
      });
    });
  }

  /* ---------- LGPD cookie sheet ---------- */
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
    var closeSheet = function () { sheet.hidden = true; };
    var save = function (a, m) {
      saved = { necessary: true, analytics: !!a, marketing: !!m, date: new Date().toISOString() };
      store(COOKIE_KEY, JSON.stringify(saved));
      /* Mockup: no analytics or marketing script is loaded, whatever the choice. */
      closeSheet();
    };
    sheet.querySelector('[data-cookie="accept"]').addEventListener('click', function () { save(true, true); });
    sheet.querySelector('[data-cookie="reject"]').addEventListener('click', function () { save(false, false); });
    btnPrefs.addEventListener('click', function () {
      var show = prefs.hidden;
      prefs.hidden = !show;
      btnSave.hidden = !show;
      btnPrefs.setAttribute('aria-expanded', show ? 'true' : 'false');
    });
    btnSave.addEventListener('click', function () { save(boxA.checked, boxM.checked); });
    $all('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', openSheet); });
    if (!saved) { sheet.hidden = false; }
  }

  /* ---------- demo forms ---------- */
  $all('form[data-demo]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) { status.hidden = false; status.classList.add('is-error'); status.textContent = 'Verifique os campos obrigatórios e a autorização de uso dos dados.'; }
        return;
      }
      if (status) {
        status.hidden = false;
        status.classList.remove('is-error');
        status.textContent = 'Demonstração: este formulário ainda não está ligado a nenhum serviço, e nenhum dado foi enviado. No site publicado, você verá aqui a confirmação de recebimento e o prazo de resposta [CONFIRM].';
        status.focus();
      }
      form.reset();
      applyCity(city, false);
    });
  });
})();

/* ==========================================================================
   JOAQUINA BEACH HOTEL — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   Three things this file is built around:

   1) THE AMENITY MATRIX IS HONEST. Their own room copy reads "ALGUNS quartos
      possuem ar-condicionado, TV, frigobar e cofre." That hedge is preserved
      everywhere — no room card asserts A/C, and every matrix cell is a
      [CONFIRM] until the front desk fills it in. Their reviewers praise them
      for being plainly what they are; overselling the rooms would lose exactly
      the guest who books.

   2) THE DISTANCE LADDER IS THE PRODUCT. 100 m from the sand, 2 km to Lagoa,
      15 km to the airport, 20 km to Centro. They publish those numbers inside
      a paragraph nobody reads.

   3) THE WHATSAPP NUMBER IS IN THEIR MARKUP AND NOWHERE ON THEIR PAGE.
      5548991855729 appears in the source but is never shown to a guest. It is
      wired here with the caveat visible rather than asserted away.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* --- published contact facts (joaquinabeachhotel.com.br) ------------------ */
var TEL   = '554832325059';          // (48) 3232-5059 — displayed on their site
var EMAIL = 'reservas@joaquinabeachhotel.com.br';
/* ⚠ Found in their page markup, displayed nowhere on the page. [CONFIRM] */
var WA_NUMBER = '5548991855729';     // (48) 99185-5729
var WA_UNCONFIRMED = true;

var T = IS_EN ? {
  generic: 'Hello! I found Joaquina Beach Hotel online and would like to ask about a stay.',
  book: function (d) {
    return 'Hello! I would like to check availability at Joaquina Beach Hotel.\n\n' +
           'Check-in: ' + d.inn + '\nCheck-out: ' + d.out + '\nGuests: ' + d.pax;
  },
  needDates: 'Please choose an arrival and a departure date.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  waCaveat: 'This WhatsApp number appears in the hotel’s own page markup, but is displayed nowhere on their site.\n\n' +
            'It has not been confirmed as a staffed line, so this mockup surfaces it with the caveat rather than ' +
            'presenting it as verified. [CONFIRM before launch.]',
  mock: 'This is a mockup — nothing is sent.'
} : {
  generic: 'Olá! Encontrei o Joaquina Beach Hotel na internet e queria falar sobre uma estadia.',
  book: function (d) {
    return 'Olá! Queria consultar disponibilidade no Joaquina Beach Hotel.\n\n' +
           'Entrada: ' + d.inn + '\nSaída: ' + d.out + '\nHóspedes: ' + d.pax;
  },
  needDates: 'Escolha uma data de entrada e uma de saída.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  waCaveat: 'Este número de WhatsApp aparece no código da própria página do hotel, mas não é exibido em lugar nenhum do site.\n\n' +
            'Ele não foi confirmado como uma linha atendida, então este mockup o mostra com a ressalva em vez de ' +
            'apresentá-lo como verificado. [CONFIRM antes do lançamento.]',
  mock: 'Isto é um mockup — nada é enviado.'
};

function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

/* DD/MM — Brazilian order, always */
function ddmm(iso) {
  if (!iso) return '';
  var p = iso.split('-');
  return p.length === 3 ? (p[2] + '/' + p[1] + '/' + p[0]) : iso;
}

function wireLinks() {
  var i, n = document.querySelectorAll('[data-wa]');
  for (i = 0; i < n.length; i++) {
    (function (el) {
      el.setAttribute('href', wa(el.getAttribute('data-wa') || T.generic));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      if (WA_UNCONFIRMED && !el.getAttribute('data-warned')) {
        el.addEventListener('click', function () {
          if (el.getAttribute('data-warned')) return;
          el.setAttribute('data-warned', '1');
          alert(T.waCaveat);
        });
      }
    })(n[i]);
  }
  var t = document.querySelectorAll('[data-tel]');
  for (i = 0; i < t.length; i++) t[i].setAttribute('href', 'tel:+' + TEL);
  var m = document.querySelectorAll('[data-email]');
  for (i = 0; i < m.length; i++) m[i].setAttribute('href', 'mailto:' + EMAIL);
}

/* ==========================================================================
   availability strip — matches the fields they already run
   ========================================================================== */
function availability() {
  var form = document.getElementById('availForm');
  if (!form) return;
  var inn = form.querySelector('#entrada');
  var out = form.querySelector('#saida');
  var iso = function (d) { return d.toISOString().slice(0, 10); };
  var today = new Date();
  if (inn) inn.min = iso(today);
  if (out) out.min = iso(new Date(today.getTime() + 86400000));
  if (inn && out) {
    inn.addEventListener('change', function () {
      if (!inn.value) return;
      var next = new Date(inn.value);
      next.setDate(next.getDate() + 1);
      out.min = iso(next);
      if (out.value && out.value <= inn.value) out.value = iso(next);
    });
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!inn.value || !out.value) { alert(T.needDates); (inn.value ? out : inn).focus(); return; }
    var pax = form.querySelector('#hospedes');
    window.open(wa(T.book({ inn: ddmm(inn.value), out: ddmm(out.value), pax: pax ? pax.value : '' })),
                '_blank', 'noopener');
  });
}

/* ==========================================================================
   distance ladder
   --------------------------------------------------------------------------
   The fill animates because the FIGURES are theirs and published — 100 m,
   2 km, 15 km, 20 km. Only the first carries a [CONFIRM], because their site
   says "a poucos metros" while a published guest review says 100 m.
   ========================================================================== */
function ladder() {
  var l = document.querySelector('.ladder');
  if (!l) return;
  var fill = l.querySelector('.ladder__fill');
  if (!fill) return;
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fill.style.width = '100%';
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      fill.style.width = '100%';
      io.unobserve(e.target);
    });
  }, { threshold: .3 });
  io.observe(l);
}

/* ==========================================================================
   room carousel + gallery filter
   --------------------------------------------------------------------------
   Every gallery tile ships visible in the HTML; JS only filters, so with
   scripting off the whole gallery is still there and still indexable.
   ========================================================================== */
function carousel() {
  var rail = document.querySelector('.rail');
  if (!rail) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step = function () {
    var c = rail.querySelector('.room');
    return c ? c.getBoundingClientRect().width + 16 : 300;
  };
  var p = document.querySelector('[data-rail="prev"]');
  var n = document.querySelector('[data-rail="next"]');
  if (p) p.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  if (n) n.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
}

function gallery() {
  var btns = document.querySelectorAll('.filters button');
  if (!btns.length) return;
  var figs = document.querySelectorAll('.gal figure');
  function apply(cat) {
    for (var i = 0; i < figs.length; i++) {
      figs[i].hidden = !(cat === 'all' || figs[i].getAttribute('data-cat') === cat);
    }
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute('aria-pressed', btns[j].getAttribute('data-cat') === cat ? 'true' : 'false');
    }
  }
  for (var k = 0; k < btns.length; k++) {
    (function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-cat')); }); })(btns[k]);
  }
  apply('all');
}

/* ==========================================================================
   chrome, reveals, counters, forms, LGPD
   ========================================================================== */
function chrome() {
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var stick = function () { hdr.classList.toggle('is-stuck', window.scrollY > 10); };
    stick();
    window.addEventListener('scroll', stick, { passive: true });
  }
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      mnav.classList.toggle('open', !open);
    });
    var links = mnav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mnav.classList.remove('open');
      });
    }
  }
  var img = document.querySelector('.hero__img');
  if (img && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    img.style.transform = 'scale(1.06)';
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 720);
        img.style.transform = 'translate3d(0,' + (y * 0.13) + 'px,0) scale(1.06)';
        ticking = false;
      });
    }, { passive: true });
  }
}

function reveals() {
  var els = document.querySelectorAll('[data-rv]');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var sibs = el.parentNode ? el.parentNode.children : [el];
      var idx = Array.prototype.indexOf.call(sibs, el);
      el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* Their published distances animate — those are their own figures. Rates,
   room counts and any review score are [CONFIRM] and isNaN stops them dead.
   No star rating and no aggregate score is rendered anywhere: their site
   publishes none, and their quotes are attributed to booking.com. */
function counters() {
  var els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = parseFloat(el.getAttribute('data-count'));
      io.unobserve(el);
      if (isNaN(to)) return;
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = pre + to + suf; return; }
      var t0 = null;
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1200, 1);
        el.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: .4 });
  for (var i = 0; i < els.length; i++) io.observe(els[i]);
}

function forms() {
  var fs = document.querySelectorAll('form[data-mock]');
  for (var i = 0; i < fs.length; i++) {
    fs[i].addEventListener('submit', function (ev) {
      ev.preventDefault();
      var need = this.querySelectorAll('[required]');
      for (var j = 0; j < need.length; j++) {
        if (!need[j].value) { alert(T.needFields); need[j].focus(); return; }
      }
      var c = this.querySelector('[data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      alert(T.mock);
    });
  }
}

/* ==========================================================================
   LGPD
   --------------------------------------------------------------------------
   Their live newsletter form collects an email address with NO visible consent
   mechanism and no privacy link. That is a live compliance gap and a concrete,
   non-cosmetic reason to rebuild — so the newsletter here carries its own
   unticked consent box, and nothing non-essential runs until it is switched on.
   ========================================================================== */
var CKKEY = 'jbh_lgpd_v1';

function lgpd() {
  var bar = document.querySelector('.ck');
  if (!bar) return;
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(CKKEY) || 'null'); } catch (e) { saved = null; }
  function apply(pref) {
    if (pref && pref.analytics) { /* analytics tag goes HERE and only here — [CONFIRM] */ }
    if (pref && pref.marketing) { /* remarketing tag goes HERE and only here — [CONFIRM] */ }
  }
  function save(pref) {
    try { localStorage.setItem(CKKEY, JSON.stringify(pref)); } catch (e) {}
    bar.classList.remove('show');
    apply(pref);
  }
  if (saved) apply(saved); else bar.classList.add('show');
  var a = document.getElementById('ckA'), m = document.getElementById('ckM');
  var btns = bar.querySelectorAll('[data-ck]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
      var k = this.getAttribute('data-ck');
      if (k === 'all')  return save({ analytics: true,  marketing: true });
      if (k === 'none') return save({ analytics: false, marketing: false });
      save({ analytics: !!(a && a.checked), marketing: !!(m && m.checked) });
    });
  }
  var reopen = document.querySelectorAll('[data-ck-open]');
  for (var j = 0; j < reopen.length; j++) {
    reopen[j].addEventListener('click', function (ev) { ev.preventDefault(); bar.classList.add('show'); });
  }
}

/* ========================================================================== */
function boot() {
  wireLinks();
  chrome();
  availability();
  ladder();
  carousel();
  gallery();
  reveals();
  counters();
  forms();
  lgpd();

  var links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (ev) {
      var t = document.querySelector(this.getAttribute('href'));
      if (!t) return;
      ev.preventDefault();
      t.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
      history.replaceState(null, '', this.getAttribute('href'));
    });
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

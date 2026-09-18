/* ==========================================================================
   HOTEL SETE ILHAS — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   Three things drive this file:

   1) THERE IS NO AVAILABILITY WIDGET ON THEIR SITE AT ALL. Every booking path
      is a bare "Faça Reserva" link. This adds the widget the reference has —
      and one thing the reference does not need: a CHILDREN'S AGE field, because
      Sete Ilhas' own sofa-bed policy is age-conditional at eleven years
      ("01 adulto e uma criança até 11 anos ou 02 crianças").

   2) THEIR INVENTORY SPANS A 20 m² STUDIO TO AN EIGHT-PERSON HOUSE, with no
      way for a guest to filter by party size. Hence the capacity filter.

   3) THE BOOKING 9,4 IS HARDCODED AND UNDATED. A review score that drifts is
      a CDC exposure, not merely stale content — so it is never written into
      the page as a fact here. It is pulled, or it carries a visible date
      stamp, or it does not appear.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* --- published contact facts (seteilhas.com.br) --------------------------- */
var TEL = '5548999470275';        // (48) 99947-0275
var EMAIL = 'reservas@seteilhas.com.br';
/* Their footer links a WhatsApp icon but the number is not resolvable from
   source. The published mobile is the only candidate, so it is used and the
   caveat is stated on the page rather than asserted away. [CONFIRM] */
var WA_NUMBER = TEL;

var T = IS_EN ? {
  generic: 'Hello! I found Hotel Sete Ilhas online and would like some information.',
  needDates: 'Please choose a check-in and a check-out date.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  book: function (d) {
    return 'Hello! I would like to check availability at Hotel Sete Ilhas.\n\n' +
           'Check-in: ' + d.inn + '\nCheck-out: ' + d.out + '\n' +
           'Adults: ' + d.ad + '\nChildren: ' + d.ch + (d.ages ? ' (ages: ' + d.ages + ')' : '') +
           '\nAccommodation type: ' + d.type;
  },
  mock: 'This is a mockup — nothing is sent. On the live site this hands the enquiry straight to reservations with the dates and party size already filled in.'
} : {
  generic: 'Olá! Encontrei o Hotel Sete Ilhas na internet e queria uma informação.',
  needDates: 'Escolha uma data de check-in e uma de check-out.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  book: function (d) {
    return 'Olá! Queria verificar disponibilidade no Hotel Sete Ilhas.\n\n' +
           'Check-in: ' + d.inn + '\nCheck-out: ' + d.out + '\n' +
           'Adultos: ' + d.ad + '\nCrianças: ' + d.ch + (d.ages ? ' (idades: ' + d.ages + ')' : '') +
           '\nTipo de acomodação: ' + d.type;
  },
  mock: 'Isto é um mockup — nada é enviado. No site real, isto entrega a consulta às reservas com as datas e a composição do grupo já preenchidas.'
};

function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

/* DD/MM — Brazilian order, always. Their package windows are 24/12 and 01/01
   and those must never render as 12/24 or 1/1. */
function ddmm(iso) {
  if (!iso) return '';
  var p = iso.split('-');
  return p.length === 3 ? (p[2] + '/' + p[1] + '/' + p[0]) : iso;
}

function wireLinks() {
  var i, n = document.querySelectorAll('[data-wa]');
  for (i = 0; i < n.length; i++) {
    n[i].setAttribute('href', wa(n[i].getAttribute('data-wa') || T.generic));
    n[i].setAttribute('target', '_blank');
    n[i].setAttribute('rel', 'noopener');
  }
  var t = document.querySelectorAll('[data-tel]');
  for (i = 0; i < t.length; i++) t[i].setAttribute('href', 'tel:+' + TEL);
  var m = document.querySelectorAll('[data-email]');
  for (i = 0; i < m.length; i++) m[i].setAttribute('href', 'mailto:' + EMAIL);
}

/* ==========================================================================
   ⭐ availability widget
   ========================================================================== */
function availability() {
  var form = document.getElementById('availForm');
  if (!form) return;
  var inn = form.querySelector('#checkin');
  var out = form.querySelector('#checkout');
  var kids = form.querySelector('#criancas');
  var agesBox = form.querySelector('.avail__kids');
  var agesIn = form.querySelector('#idades');

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

  /* The ages field only appears when there are children — and it exists at all
     because their own sofa-bed rule turns on whether a child is 11 or under. */
  if (kids && agesBox) {
    var toggle = function () {
      agesBox.classList.toggle('show', parseInt(kids.value, 10) > 0);
    };
    kids.addEventListener('change', toggle);
    toggle();
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!inn.value || !out.value) { alert(T.needDates); (inn.value ? out : inn).focus(); return; }
    var ad = form.querySelector('#adultos');
    var tp = form.querySelector('#tipo');
    window.open(wa(T.book({
      inn: ddmm(inn.value), out: ddmm(out.value),
      ad: ad ? ad.value : '', ch: kids ? kids.value : '0',
      ages: (agesIn && agesBox.classList.contains('show')) ? agesIn.value : '',
      type: tp ? tp.options[tp.selectedIndex].text : ''
    })), '_blank', 'noopener');
  });
}

/* ==========================================================================
   capacity filter + carousel
   --------------------------------------------------------------------------
   Every unit card ships visible in the HTML; JS only filters, so with
   scripting off the whole inventory is readable and indexable.
   ========================================================================== */
function units() {
  var btns = document.querySelectorAll('.caps button');
  var cards = document.querySelectorAll('.unit');
  if (btns.length && cards.length) {
    var apply = function (cap) {
      for (var i = 0; i < cards.length; i++) {
        var max = parseInt(cards[i].getAttribute('data-cap'), 10);
        cards[i].hidden = !(cap === 'all' || max >= parseInt(cap, 10));
      }
      for (var j = 0; j < btns.length; j++) {
        btns[j].setAttribute('aria-pressed', btns[j].getAttribute('data-cap') === cap ? 'true' : 'false');
      }
    };
    for (var k = 0; k < btns.length; k++) {
      (function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-cap')); }); })(btns[k]);
    }
    apply('all');
  }

  var rail = document.querySelector('.rail');
  if (!rail) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step = function () {
    var c = rail.querySelector('.unit:not([hidden])');
    return c ? c.getBoundingClientRect().width + 16 : 320;
  };
  var prev = document.querySelector('[data-rail="prev"]');
  var next = document.querySelector('[data-rail="next"]');
  if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
}

/* ==========================================================================
   the fifteen-metre elevation diagram
   --------------------------------------------------------------------------
   Drawn in CSS, not shipped as an image: it scales, it is legible at phone
   width and it costs nothing to load. The fill animates to 100% because the
   distance itself IS published ("menos de 15 metros"); nothing else about it
   is asserted.
   ========================================================================== */
function elevation() {
  var el = document.querySelector('.elev__fill');
  if (!el) return;
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.width = '100%';
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      el.style.width = '100%';
      io.unobserve(e.target);
    });
  }, { threshold: .35 });
  io.observe(el.parentNode);
}

/* ==========================================================================
   chrome, reveals, counters, forms
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
        var y = Math.min(window.scrollY, 800);
        img.style.transform = 'translate3d(0,' + (y * 0.14) + 'px,0) scale(1.06)';
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
      el.style.transitionDelay = Math.min(idx, 6) * 100 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* The inventory figures — 18 suítes, 2 studios, 3 residences, 23 in total, and
   the 20 m² studio — are published by Sete Ilhas themselves, so those animate.
   Every rate and every unconfirmed measurement is a [CONFIRM] and isNaN stops
   the counter dead rather than inventing a number to count up to.
   The Booking score is NEVER passed through here: a hardcoded review score
   that drifts is a CDC exposure, not just stale content. */
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
        var p = Math.min((ts - t0) / 1150, 1);
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
   LGPD — no privacy policy or consent banner was found on the pages fetched
   ========================================================================== */
var CKKEY = 'si_lgpd_v1';

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
  units();
  elevation();
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

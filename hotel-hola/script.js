/* ==========================================================================
   HOTEL HOLA — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   Two things here are genuinely theirs and are treated as assets, not as
   things to replace:

   1) THE FOUR-DEPARTMENT WHATSAPP ROUTER. Reservas · Dúvidas ou Informações ·
      Elogios, Sugestão ou Reclamação · Cancelar Reserva, each labelled
      "de segunda a segunda, 24 horas". No other property in this batch runs
      one. They built the hard part — staffing — and left the website doing
      nothing with it. Here each department gets its own pre-filled message.

   2) "O SEU 5 ESTRELINHAS DE FLORIPA". The best line in the batch, currently
      buried in a slider while Google shows the template vendor's sales copy.

   And one thing is a live defect this file exists to fix: their cookie banner
   works by consent-by-continuing, which is not valid consent under the LGPD.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* --- published contact facts (hotelhola.com.br) --------------------------- */
var WA_NUMBER = '554888288575';   // their own live wa.me deep link
var TEL_FIXO  = '554832261002';   // (48) 3226-1002
var TEL_CEL   = '5548988288575';  // (48) 98828-8575

var T = IS_EN ? {
  generic: 'Hello! I found Hotel Hola online and would like some information.',
  needDates: 'Please choose an arrival and a departure date.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  book: function (d) {
    return 'Hello! I would like to check availability at Hotel Hola.\n\n' +
           'Arrival: ' + d.inn + '\nDeparture: ' + d.out + '\nGuests: ' + d.pax +
           (d.suite ? '\nSuite of interest: ' + d.suite : '');
  },
  mock: 'This is a mockup — nothing is sent. On the live site this hands the enquiry to the Reservas department on WhatsApp with the dates already filled in.'
} : {
  generic: 'Olá! Encontrei o Hotel Hola na internet e queria uma informação.',
  needDates: 'Escolha uma data de chegada e uma de saída.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  book: function (d) {
    return 'Olá! Queria verificar disponibilidade no Hotel Hola.\n\n' +
           'Chegada: ' + d.inn + '\nSaída: ' + d.out + '\nHóspedes: ' + d.pax +
           (d.suite ? '\nSuíte de interesse: ' + d.suite : '');
  },
  mock: 'Isto é um mockup — nada é enviado. No site real, isto entrega a consulta ao departamento de Reservas no WhatsApp com as datas já preenchidas.'
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
    n[i].setAttribute('href', wa(n[i].getAttribute('data-wa') || T.generic));
    n[i].setAttribute('target', '_blank');
    n[i].setAttribute('rel', 'noopener');
  }
  var f = document.querySelectorAll('[data-tel-fixo]');
  for (i = 0; i < f.length; i++) f[i].setAttribute('href', 'tel:+' + TEL_FIXO);
  var c = document.querySelectorAll('[data-tel-cel]');
  for (i = 0; i < c.length; i++) c[i].setAttribute('href', 'tel:+' + TEL_CEL);
}

/* The stale "Copyright © 2023" is on every page of their live site. Rendering
   the year rather than typing it means it can never go stale again. */
function year() {
  var y = document.querySelectorAll('[data-year]');
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();
}

/* ==========================================================================
   ⭐ availability strip
   --------------------------------------------------------------------------
   No booking engine is in place. Rather than pretend one is, the submit routes
   into the RESERVAS department of the router they already run, with the dates
   pre-filled — machinery they already staff, doing work it currently doesn't.
   ========================================================================== */
function availability() {
  var form = document.getElementById('availForm');
  if (!form) return;
  var inn = form.querySelector('#chegada');
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
    window.open(wa(T.book({
      inn: ddmm(inn.value), out: ddmm(out.value),
      pax: pax ? pax.value : '', suite: ''
    })), '_blank', 'noopener');
  });
}

/* ==========================================================================
   suite carousel + gallery filter
   ========================================================================== */
function carousel() {
  var rail = document.querySelector('.rail');
  if (!rail) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step = function () {
    var c = rail.querySelector('.suite');
    return c ? c.getBoundingClientRect().width + 16 : 320;
  };
  var prev = document.querySelector('[data-rail="prev"]');
  var next = document.querySelector('[data-rail="next"]');
  if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
}

/* Every gallery tile ships visible in the HTML; JS only adds the filtering,
   so with scripting off the whole gallery is still there. */
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
    (function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-cat')); });
    })(btns[k]);
  }
  apply('all');
}

/* ==========================================================================
   header, mobile nav, hero parallax
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
  var img = document.querySelector('.plate__img img');
  if (img && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    img.style.transform = 'scale(1.06)';
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 600);
        img.style.transform = 'translate3d(0,' + (y * 0.08) + 'px,0) scale(1.06)';
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

/* Nothing on this site has a verified number attached to it except the suite
   count — and even that is contradicted by their own page. So the count-up
   engine exists, and refuses every [CONFIRM] it meets. */
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
   LGPD — replacing a live, invalid banner
   --------------------------------------------------------------------------
   Theirs today: "Ao clicar em 'ok' e continuar navegando, você concorda com a
   nossa política de privacidade." Continuing to browse is not consent under
   the LGPD, and there is no reject path at all. Here nothing non-essential
   runs until it is switched on, and refusing is exactly as easy as accepting.
   ========================================================================== */
var CKKEY = 'hola_lgpd_v1';

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
  year();
  chrome();
  availability();
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

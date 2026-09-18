/* ==========================================================================
   IMOBILIÁRIA ILHA DA MAGIA — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   THE WHOLE BUILD TURNS ON ONE IDEA:
   temporada and locação anual are two products with two search behaviours,
   and the dual search card below changes the FIELDS, not just the results.
   A seasonal renter needs dates, guests and a beach. An annual tenant needs a
   neighbourhood, bedrooms, a monthly ceiling and a pet policy — and needs to
   understand fiador, caução and seguro-fiança before they will enquire at all.

   Their current site has neither. It has ONE price ladder running from R$500
   to R$5.000.000 — a rental ladder and a sales ladder in the same control —
   and no rentals section in the navigation whatsoever.

   NOTHING IS INVENTED HERE: no listing, no rent, no nightly rate, no
   occupancy figure, no tenant name, no review, no years in business. And no
   return, yield or appreciation projection appears anywhere on this build.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* --- published facts (ilhadamagiaimoveis.com.br + its own schema) --------- */
var WA_NUMBER = '5548998229955';     // (48) 99822-9955
var TEL       = '5548998229955';
var CRECI     = 'CRECI-SC 22.482';   // published; física, consistent with a solo broker
var BROKER    = 'André Krüger';      // named in their own RealEstateAgent schema

var T = IS_EN ? {
  generic: 'Hello! I found Ilha da Magia Imóveis online and would like to talk to ' + BROKER + '.',
  temp: function (d) {
    return 'Hello! I am looking for a seasonal rental (temporada).\n\n' +
           'Destination: ' + d.dest + '\nCheck-in: ' + d.inn + '\nCheck-out: ' + d.out +
           '\nGuests: ' + d.pax + '\nNightly budget: ' + d.faixa;
  },
  anual: function (d) {
    return 'Hello! I am looking for a long-term rental (locação anual).\n\n' +
           'Neighbourhood: ' + d.bairro + '\nBedrooms: ' + d.dorm +
           '\nMaximum monthly budget: ' + d.valor +
           '\nPets: ' + d.pet + '\nFurnished: ' + d.mob;
  },
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  mock: 'This is a mockup — nothing is sent. On the live site this opens WhatsApp with your search already written out.'
} : {
  generic: 'Olá! Encontrei a Ilha da Magia Imóveis na internet e queria falar com o ' + BROKER + '.',
  temp: function (d) {
    return 'Olá! Estou procurando um imóvel por temporada.\n\n' +
           'Destino: ' + d.dest + '\nCheck-in: ' + d.inn + '\nCheck-out: ' + d.out +
           '\nHóspedes: ' + d.pax + '\nFaixa de diária: ' + d.faixa;
  },
  anual: function (d) {
    return 'Olá! Estou procurando aluguel anual.\n\n' +
           'Bairro: ' + d.bairro + '\nDormitórios: ' + d.dorm +
           '\nValor mensal máximo: ' + d.valor +
           '\nAceita pet: ' + d.pet + '\nMobiliado: ' + d.mob;
  },
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  mock: 'Isto é um mockup — nada é enviado. No site real, isto abre o WhatsApp com a sua busca já escrita.'
};

function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

/* DD/MM/AAAA for dates; temporada uses a DD/MM–DD/MM night range with a
   NIGHTLY rate, never a monthly one. */
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
}

/* ==========================================================================
   ⭐ THE DUAL SEARCH CARD — real ARIA tabs, keyboard-operable
   --------------------------------------------------------------------------
   Both panels ship in the HTML. JS hides the inactive one, so with scripting
   off both search forms are present and usable.
   ========================================================================== */
function dualSearch() {
  var list = document.querySelector('.search__tabs[role="tablist"]');
  if (!list) return;
  var tabs = list.querySelectorAll('[role="tab"]');

  function select(i, focus) {
    for (var j = 0; j < tabs.length; j++) {
      var on = (j === i);
      tabs[j].setAttribute('aria-selected', on ? 'true' : 'false');
      tabs[j].setAttribute('tabindex', on ? '0' : '-1');
      var panel = document.getElementById(tabs[j].getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    }
    if (focus) tabs[i].focus();
  }

  for (var i = 0; i < tabs.length; i++) {
    (function (idx) {
      tabs[idx].addEventListener('click', function () { select(idx, false); });
      tabs[idx].addEventListener('keydown', function (ev) {
        var k = ev.key, next = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') next = (idx + 1) % tabs.length;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = tabs.length - 1;
        if (next === null) return;
        ev.preventDefault();
        select(next, true);
      });
    })(i);
  }
  select(0, false);

  /* temporada date range — check-out can never precede check-in */
  var inn = document.getElementById('t-in');
  var out = document.getElementById('t-out');
  var iso = function (d) { return d.toISOString().slice(0, 10); };
  if (inn && out) {
    var today = new Date();
    inn.min = iso(today);
    out.min = iso(new Date(today.getTime() + 86400000));
    inn.addEventListener('change', function () {
      if (!inn.value) return;
      var next = new Date(inn.value);
      next.setDate(next.getDate() + 1);
      out.min = iso(next);
      if (out.value && out.value <= inn.value) out.value = iso(next);
    });
  }

  var ft = document.getElementById('formTemporada');
  if (ft) {
    ft.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = function (id) { var el = document.getElementById(id);
        return el ? (el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value) : ''; };
      window.open(wa(T.temp({
        dest: v('t-dest'), inn: ddmm(inn ? inn.value : ''), out: ddmm(out ? out.value : ''),
        pax: v('t-pax'), faixa: v('t-faixa')
      })), '_blank', 'noopener');
    });
  }

  var fa = document.getElementById('formAnual');
  if (fa) {
    fa.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = function (id) { var el = document.getElementById(id);
        return el ? (el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value) : ''; };
      var chk = function (id) { var el = document.getElementById(id);
        return el && el.checked ? L('sim', 'yes') : L('indiferente', 'no preference'); };
      window.open(wa(T.anual({
        bairro: v('a-bairro'), dorm: v('a-dorm'), valor: v('a-valor'),
        pet: chk('a-pet'), mob: chk('a-mob')
      })), '_blank', 'noopener');
    });
  }
}

/* ==========================================================================
   FAQ — two tab groups (temporada / anual), each an accordion.
   Every panel ships open; JS collapses. Scripting off leaves the whole FAQ
   readable, which also means Google reads it.
   ========================================================================== */
function faq() {
  var tabs = document.querySelectorAll('.faqtabs button');
  if (tabs.length) {
    var apply = function (key) {
      for (var i = 0; i < tabs.length; i++) {
        var on = tabs[i].getAttribute('data-faq') === key;
        tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
      }
      var groups = document.querySelectorAll('.acc[data-faq]');
      for (var j = 0; j < groups.length; j++) {
        groups[j].hidden = groups[j].getAttribute('data-faq') !== key;
      }
    };
    for (var k = 0; k < tabs.length; k++) {
      (function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-faq')); }); })(tabs[k]);
    }
    apply(tabs[0].getAttribute('data-faq'));
  }

  var btns = document.querySelectorAll('.acc__b');
  for (var i = 0; i < btns.length; i++) {
    (function (b, idx) {
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (!p) return;
      var open = (idx === 0);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      p.hidden = !open;
      b.addEventListener('click', function () {
        var isOpen = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        p.hidden = isOpen;
      });
    })(btns[i], i);
  }
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
        var y = Math.min(window.scrollY, 700);
        img.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0) scale(1.06)';
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

/* Count-up exists, and refuses every [CONFIRM] it meets. There is no inventory
   count, no transaction volume and no years-in-business figure on this site,
   because none of those was published or verified. */
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

/* Forms never collect CPF, income documents or guarantor data — that moves to
   a secure channel after first contact, and the page says so. */
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

var CKKEY = 'idm_lgpd_v1';

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
  dualSearch();
  faq();
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

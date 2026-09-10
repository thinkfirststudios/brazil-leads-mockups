/* ==========================================================================
   HAUTE HAUS GUEST HOUSE — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   The single most important thing in this file is the availability widget.
   Haute Haus's entire booking mechanism today is a form with ONE dropdown —
   "1 Hóspede" or "2 Hóspedes" — and a send button. There are no date fields.
   A guest who wants to stay in March literally cannot say so. Every enquiry
   becomes a manual email thread, and every guest who will not wait for a reply
   goes to an OTA instead, where commission in this segment typically runs in
   the mid-to-high teens as a percentage of gross [CONFIRM current OTA rates].

   Nothing is invented here: no rate, no room size, no review score, no
   CADASTUR number, no CNPJ. The widget composes a WhatsApp message carrying
   the dates and the view the guest actually chose.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* --- published contact facts (hautehaus.com.br) --------------------------- */
var MOBILE   = '5548988119246';   // +55 (48) 98811-9246 — celular
var LANDLINE = '554832067934';    // +55 (48) 3206-7934  — fixo

/* ⚠ The mobile number is PUBLISHED, but nothing on their site marks it as a
   WhatsApp line: there is no wa.me link anywhere on hautehaus.com.br. So the
   WhatsApp controls are wired to that number and carry a visible caveat rather
   than asserting a channel the client has never claimed. [CONFIRM] */
var WA_NUMBER = MOBILE;
var WA_UNCONFIRMED = true;

var T = IS_EN ? {
  generic: 'Hello! I found Haute Haus online and would like to ask about a stay.',
  avail: function (d) {
    return 'Hello! I would like to check availability at Haute Haus.\n\n' +
           'Check-in: ' + d.inn + '\nCheck-out: ' + d.out + '\n' +
           'Guests: ' + d.pax + '\nPreferred view: ' + d.view;
  },
  event: function (d) {
    return 'Hello! I would like to enquire about an event at Haute Haus.\n\n' +
           'Name: ' + d.nome + '\nType of event: ' + d.tipo + '\n' +
           'Approximate date: ' + d.data + '\nGuests: ' + d.pax;
  },
  needDates: 'Please choose a check-in and a check-out date — that is the whole point of this widget.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  waCaveat: 'Haute Haus publishes this mobile number, but nowhere on their site is it identified as a WhatsApp line, and there is no wa.me link anywhere on it.\n\n' +
            'This mockup will not assert a channel the client has never claimed, so the button is opening the number as published — [CONFIRM] before launch.'
} : {
  generic: 'Olá! Encontrei a Haute Haus na internet e queria falar sobre uma estadia.',
  avail: function (d) {
    return 'Olá! Queria consultar disponibilidade na Haute Haus.\n\n' +
           'Check-in: ' + d.inn + '\nCheck-out: ' + d.out + '\n' +
           'Hóspedes: ' + d.pax + '\nVista preferida: ' + d.view;
  },
  event: function (d) {
    return 'Olá! Queria fazer uma consulta sobre evento na Haute Haus.\n\n' +
           'Nome: ' + d.nome + '\nTipo de evento: ' + d.tipo + '\n' +
           'Data prevista: ' + d.data + '\nConvidados: ' + d.pax;
  },
  needDates: 'Escolha uma data de check-in e uma de check-out — é exatamente para isso que este campo existe.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  waCaveat: 'A Haute Haus publica este celular, mas em nenhum lugar do site dela ele é identificado como WhatsApp, e não existe link wa.me em página nenhuma.\n\n' +
            'Este mockup não afirma um canal que o cliente nunca afirmou, então o botão está abrindo o número como publicado — [CONFIRM] antes do lançamento.'
};

function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

/* DD/MM — Brazilian order, always. Never MM/DD, never a US month name. */
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
      if (WA_UNCONFIRMED) {
        el.setAttribute('data-wa-unconfirmed', 'true');
        el.addEventListener('click', function () {
          /* informs, then still lets the click through — the number IS real,
             it is only the CHANNEL that is unconfirmed */
          if (!el.getAttribute('data-warned')) {
            el.setAttribute('data-warned', '1');
            alert(T.waCaveat);
          }
        });
      }
    })(n[i]);
  }
  var m = document.querySelectorAll('[data-tel-mobile]');
  for (i = 0; i < m.length; i++) m[i].setAttribute('href', 'tel:+' + MOBILE);
  var f = document.querySelectorAll('[data-tel-landline]');
  for (i = 0; i < f.length; i++) f[i].setAttribute('href', 'tel:+' + LANDLINE);
}

/* ==========================================================================
   ⭐ availability widget
   ========================================================================== */
function availability() {
  var form = document.getElementById('availForm');
  if (!form) return;

  var inn = form.querySelector('#checkin');
  var out = form.querySelector('#checkout');

  /* sensible, keyboard-operable defaults: today and tomorrow, and check-out can
     never precede check-in */
  var today = new Date();
  var iso = function (d) { return d.toISOString().slice(0, 10); };
  if (inn) { inn.min = iso(today); }
  if (out) { out.min = iso(new Date(today.getTime() + 86400000)); }
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
    var pax = form.querySelector('#pax');
    var view = form.querySelector('#vista');
    window.open(wa(T.avail({
      inn: ddmm(inn.value),
      out: ddmm(out.value),
      pax: pax ? pax.value : '',
      view: view ? view.options[view.selectedIndex].text : ''
    })), '_blank', 'noopener');
  });
}

/* ==========================================================================
   room carousel
   ========================================================================== */
function carousel() {
  var rail = document.querySelector('.rail');
  if (!rail) return;
  var prev = document.querySelector('[data-rail="prev"]');
  var next = document.querySelector('[data-rail="next"]');
  var step = function () {
    var card = rail.querySelector('.room');
    return card ? card.getBoundingClientRect().width + 2 : 320;
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var go = function (dir) {
    rail.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
  };
  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });
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

  var img = document.querySelector('.hero__img');
  if (img && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    img.style.transform = 'scale(1.05)';
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 800);
        img.style.transform = 'translate3d(0,' + (y * 0.14) + 'px,0) scale(1.05)';
        ticking = false;
      });
    }, { passive: true });
  }
}

/* ==========================================================================
   reveals + count-up
   ========================================================================== */
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
      el.style.transitionDelay = Math.min(idx, 6) * 110 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* The only figures on this site that are real are 2 hectares, 8 suites, 6 room
   types and 2015. Those animate. Everything else is a [CONFIRM] and isNaN
   stops it dead — no placeholder ever counts up to an invented number. */
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
      var t0 = null, dur = 1200;
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        el.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: .4 });
  for (var i = 0; i < els.length; i++) io.observe(els[i]);
}

/* ==========================================================================
   events + contact forms
   --------------------------------------------------------------------------
   Events and room bookings never share a funnel. An events enquiry has a
   different lead time, a different decision-maker and a different margin —
   and today Haute Haus has one nav item for it and no enquiry path at all.
   ========================================================================== */
function forms() {
  var ev = document.getElementById('eventForm');
  if (ev) {
    ev.addEventListener('submit', function (e2) {
      e2.preventDefault();
      var need = ev.querySelectorAll('[required]');
      for (var i = 0; i < need.length; i++) {
        if (!need[i].value) { alert(T.needFields); need[i].focus(); return; }
      }
      var c = ev.querySelector('[data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      var d = ev.querySelector('#evdata');
      window.open(wa(T.event({
        nome: ev.querySelector('#evnome').value,
        tipo: ev.querySelector('#evtipo').value,
        data: d && d.value ? ddmm(d.value) : '[CONFIRM]',
        pax:  ev.querySelector('#evpax').value
      })), '_blank', 'noopener');
    });
  }

  var fs = document.querySelectorAll('form[data-mock]');
  for (var k = 0; k < fs.length; k++) {
    fs[k].addEventListener('submit', function (e3) {
      e3.preventDefault();
      var need = this.querySelectorAll('[required]');
      for (var j = 0; j < need.length; j++) {
        if (!need[j].value) { alert(T.needFields); need[j].focus(); return; }
      }
      var c = this.querySelector('[data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      alert(L('Isto é um mockup — nada é enviado.', 'This is a mockup — nothing is sent.'));
    });
  }
}

/* ==========================================================================
   LGPD — their contact form currently collects nome, e-mail and mensagem with
   no visible consent checkbox, and no privacy policy link was found on either
   page fetched. Both are fixed here.
   ========================================================================== */
var CKKEY = 'hh_lgpd_v1';

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
  carousel();
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

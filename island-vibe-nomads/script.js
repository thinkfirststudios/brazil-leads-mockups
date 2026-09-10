/* ==========================================================================
   ISLAND VIBE NOMADS / NÔMADES VIBE DA ILHA — one engine, three language trees
   / (pt-BR) · /en/ · /es/
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed, and nothing about this business is verified.

   The Instagram profile returned a JavaScript login shell: no bio, no follower
   count, no posts, no link in bio, no Open Graph metadata, no contact button.
   There is NO website, NO address, NO phone, NO rate, NO bed count and NO
   confirmed trading name — the lead sheet says "Island Vibe Nomads", the
   handle says "nomades.vibedailha".

   So this file deliberately does the opposite of filling gaps. Every rate,
   count, speed and address is the literal string "[CONFIRM]", rendered inside
   a visible dashed slot. A fully working pricing table with the client's data
   missing is a more persuasive artefact than a filled-in guess — and a mockup
   that invents "6-bed mixed dorm, R$ 75/night" and gets it wrong in front of
   the owner loses the meeting.

   THE ONE STRUCTURAL BET made without confirmation: if they are genuinely
   nomad-oriented, they have a MONTHLY product, and it is the most valuable
   thing on the site. The slot for it is built prominently. That is a bet on
   the shape of the business, not an invented fact about it.
   ========================================================================== */

'use strict';

var LANG = document.documentElement.lang.toLowerCase();
var IS_EN = LANG.indexOf('en') === 0;
var IS_ES = LANG.indexOf('es') === 0;
function L(pt, en, es) { return IS_EN ? en : (IS_ES ? (es || en) : pt); }

/* ==========================================================================
   CONTACT — there is nothing to wire
   --------------------------------------------------------------------------
   No phone, no WhatsApp, no email was captured. Every WhatsApp control on the
   site renders, is visibly disabled, and explains why when pressed. A wa.me
   link is non-negotiable on the FINAL build — but the number has to come from
   them, and a fabricated one can be dialled.
   ========================================================================== */
var WA_NUMBER = null;                                                // [CONFIRM]
var INSTAGRAM = 'https://www.instagram.com/nomades.vibedailha/';     // the only real URL

var T = IS_EN ? {
  waMissing: 'No WhatsApp number has been confirmed for this property yet.\n\n' +
             'The only verified channel is Instagram: @nomades.vibedailha — and that ' +
             'profile is behind a login wall, which is the entire point of this pitch.\n\n' +
             'This mockup never prints a contact detail it cannot verify.',
  needDates: 'Please choose a check-in and a check-out date.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  mock: 'This is a mockup — nothing is sent.'
} : IS_ES ? {
  waMissing: 'Todavía no se ha confirmado ningún número de WhatsApp para este alojamiento.\n\n' +
             'El único canal verificado es Instagram: @nomades.vibedailha — y ese perfil ' +
             'está detrás de un muro de inicio de sesión, que es precisamente el argumento ' +
             'de esta propuesta.\n\nEste mockup nunca publica un dato de contacto sin verificar.',
  needDates: 'Elige una fecha de entrada y una de salida.',
  needFields: 'Completa los campos obligatorios.',
  needConsent: 'Marca la casilla de consentimiento para saber cómo podemos responderte.',
  mock: 'Esto es un mockup — no se envía nada.'
} : {
  waMissing: 'Nenhum número de WhatsApp foi confirmado para esta hospedagem.\n\n' +
             'O único canal verificado é o Instagram: @nomades.vibedailha — e esse perfil ' +
             'está atrás de um login, que é exatamente o argumento desta proposta.\n\n' +
             'Este mockup nunca imprime um dado de contato que não pôde verificar.',
  needDates: 'Escolha uma data de check-in e uma de check-out.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  mock: 'Isto é um mockup — nada é enviado.'
};

/* DD/MM everywhere, on every tree. And BRL only — never converted to USD or
   EUR even on the EN and ES trees. A nomad audience specifically needs the
   real local number, because that is the number they will actually pay. */
function ddmm(iso) {
  if (!iso) return '';
  var p = iso.split('-');
  return p.length === 3 ? (p[2] + '/' + p[1] + '/' + p[0]) : iso;
}

function wireWhatsApp() {
  var nodes = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < nodes.length; i++) {
    (function (el) {
      if (el.getAttribute('data-wa-wired')) return;
      el.setAttribute('data-wa-wired', '1');
      var msg = el.getAttribute('data-wa') || '';
      if (WA_NUMBER) {
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        el.setAttribute('data-unconfirmed', 'true');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', function (ev) { ev.preventDefault(); alert(T.waMissing); });
      }
    })(nodes[i]);
  }
}

/* ==========================================================================
   availability widget
   ========================================================================== */
function availability() {
  var form = document.getElementById('availForm');
  if (!form) return;
  var inn = form.querySelector('#checkin');
  var out = form.querySelector('#checkout');
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
    /* With no number to send to, the widget explains itself rather than
       pretending to work. On the live build this composes a WhatsApp message
       carrying the dates, the guest count and the room type. */
    alert(T.waMissing);
  });
}

/* ==========================================================================
   FAQ accordion — every panel ships open, JS collapses.
   Scripting off leaves the whole FAQ readable, which also means Google reads
   it — which for a business currently invisible to search is the point.
   ========================================================================== */
function accordion() {
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
      el.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* There is not a single verified number attached to this business. The
   count-up engine is here so the day real figures arrive it works — and until
   then isNaN stops every one of them dead. Nothing counts up to a guess. */
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
   LGPD
   --------------------------------------------------------------------------
   This is the one lead in the batch with no existing site to remediate, which
   makes it the one lead where consent can be built correctly from the first
   line of code. Nothing non-essential runs until it is switched on.

   NOTE ON THE INSTAGRAM EMBED: a live feed is a third-party processor. It goes
   inside the consented branch and is disclosed in the privacy policy — it does
   not load on page view. The tiles on the page are stock placeholders until
   embed access is granted.
   ========================================================================== */
var CKKEY = 'ivn_lgpd_v1';

function lgpd() {
  var bar = document.querySelector('.ck');
  if (!bar) return;
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(CKKEY) || 'null'); } catch (e) { saved = null; }
  function apply(pref) {
    if (pref && pref.analytics) { /* analytics tag goes HERE and only here — [CONFIRM] */ }
    if (pref && pref.marketing) {
      /* the Instagram embed loads HERE and only here — never on page view.
         [CONFIRM handle and embed access] */
    }
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
  wireWhatsApp();
  chrome();
  availability();
  accordion();
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

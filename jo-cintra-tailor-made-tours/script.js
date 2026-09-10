/* ==========================================================================
   JO CINTRA TAILOR MADE TOURS® — one engine, three locale trees
   / (pt-BR) · /en/ · /es/
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   This is the strongest existing site in the batch. Nothing in this file is a
   rescue. Two things are being demonstrated:

   1) THE CONSULTATION INTAKE, which replaces the reference's destination /
      guests / date search widget. A tailor-made agency has no "search results"
      state, and building one would misrepresent the product. So this is a
      staged conversation that resolves to a NAMED CONSULTANT, not a queue —
      and its most valuable branch is deliberately the one that sounds least
      like a lead: "ainda não sei, me ajude a escolher".

   2) THREE MISSING PRODUCTS. Their own About page says they do "turismo
      receptivo em Santa Catarina" and "eventos profissionais", they staff a
      two-person events department and a dedicated câmbio desk, and none of
      those three exists as a page a customer could find.

   NOTHING IS INVENTED: no price (they publish none and should not), no
   itinerary, no hotel or partner name, no testimonial, no CADASTUR, no CNPJ,
   and no logo of any third-party network.
   ========================================================================== */

'use strict';

var LANG = document.documentElement.lang.toLowerCase();
var IS_EN = LANG.indexOf('en') === 0;
var IS_ES = LANG.indexOf('es') === 0;
function L(pt, en, es) { return IS_EN ? en : (IS_ES ? (es || en) : pt); }

/* --- published contact facts (jocintra.com.br) ---------------------------- */
var WA_NUMBER = '5548988282565';   // (48) 98828 2565 — their own wa.me link
var TEL       = '554831318100';    // (48) 3131 8100 — plantão 24h, opção 5
var EMAIL     = 'contato@jocintra.com.br';

var T = IS_EN ? {
  generic: 'Hello! I found Jo Cintra Tailor Made Tours online and would like to talk to a consultant.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  needChoice: 'Please choose one option to continue.',
  waHours: 'WhatsApp is staffed Monday to Friday, 09:00–19:00.\n\n' +
           'The 24-hour line is a different channel: it is the emergency plantão on ' +
           '(48) 3131 8100, option 5, for clients who are already travelling. ' +
           'The two are not the same thing and this site does not blur them.',
  sent: 'This is a mockup — nothing is sent. On the live site this enquiry reaches a named consultant, not a shared inbox.'
} : IS_ES ? {
  generic: '¡Hola! Encontré Jo Cintra Tailor Made Tours en internet y quisiera hablar con un consultor.',
  needFields: 'Completa los campos obligatorios.',
  needConsent: 'Marca la casilla de consentimiento para saber cómo podemos responderte.',
  needChoice: 'Elige una opción para continuar.',
  waHours: 'El WhatsApp se atiende de lunes a viernes, 09:00–19:00.\n\n' +
           'La línea de 24 horas es otro canal: es la guardia de emergencias en el ' +
           '(48) 3131 8100, opción 5, para clientes que ya están de viaje. ' +
           'No son lo mismo y este sitio no las confunde.',
  sent: 'Esto es un mockup — no se envía nada. En el sitio real esta consulta llega a un consultor con nombre, no a un buzón compartido.'
} : {
  generic: 'Olá! Encontrei a Jo Cintra Tailor Made Tours e queria falar com um consultor.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  needChoice: 'Escolha uma opção para continuar.',
  waHours: 'O WhatsApp é atendido de segunda a sexta, das 09h às 19h.\n\n' +
           'A linha 24 horas é outro canal: é o plantão de emergências no ' +
           '(48) 3131 8100, opção 5, para clientes que já estão viajando. ' +
           'São coisas diferentes e este site não mistura as duas.',
  sent: 'Isto é um mockup — nada é enviado. No site real, esta consulta chega a um consultor com nome, e não a uma caixa compartilhada.'
};

function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

function wireLinks() {
  var i, n = document.querySelectorAll('[data-wa]');
  for (i = 0; i < n.length; i++) {
    (function (el) {
      el.setAttribute('href', wa(el.getAttribute('data-wa') || T.generic));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      /* The staffed hours travel with the button. Their site publishes a 24h
         emergency plantão AND a 09h–19h WhatsApp, and confusing the two is the
         easiest way to disappoint a client at the exact moment they need help. */
      el.setAttribute('title', L('WhatsApp: seg a sex, 09h–19h',
                                 'WhatsApp: Mon–Fri, 09:00–19:00',
                                 'WhatsApp: lun–vie, 09:00–19:00'));
    })(n[i]);
  }
  var t = document.querySelectorAll('[data-tel]');
  for (i = 0; i < t.length; i++) t[i].setAttribute('href', 'tel:+' + TEL);
  var m = document.querySelectorAll('[data-email]');
  for (i = 0; i < m.length; i++) m[i].setAttribute('href', 'mailto:' + EMAIL);
  var h = document.querySelectorAll('[data-wa-hours]');
  for (i = 0; i < h.length; i++) {
    h[i].addEventListener('click', function (ev) { ev.preventDefault(); alert(T.waHours); });
  }
}

/* ==========================================================================
   ⭐ THE CONSULTATION INTAKE
   --------------------------------------------------------------------------
   One question per screen. Every step ships in the HTML and JS collapses them,
   so with scripting off the whole intake is a single readable form rather than
   a dead widget.
   ========================================================================== */
function intake() {
  var root = document.getElementById('intake');
  if (!root) return;
  var steps = root.querySelectorAll('.step');
  var bars = root.querySelectorAll('.intake__bar span');
  var prev = root.querySelector('[data-step="prev"]');
  var next = root.querySelector('[data-step="next"]');
  var send = root.querySelector('[data-step="send"]');
  var count = root.querySelector('.count');
  var at = 0;

  function paint() {
    for (var i = 0; i < steps.length; i++) steps[i].hidden = (i !== at);
    for (var j = 0; j < bars.length; j++) bars[j].classList.toggle('on', j <= at);
    if (prev) prev.hidden = (at === 0);
    if (next) next.hidden = (at === steps.length - 1);
    if (send) send.hidden = (at !== steps.length - 1);
    if (count) {
      count.textContent = L('Passo ', 'Step ', 'Paso ') + (at + 1) +
                          L(' de ', ' of ', ' de ') + steps.length;
    }
  }

  function valid() {
    var s = steps[at];
    var radios = s.querySelectorAll('input[type="radio"]');
    if (radios.length) {
      var any = false;
      for (var i = 0; i < radios.length; i++) if (radios[i].checked) any = true;
      if (!any) { alert(T.needChoice); return false; }
    }
    var need = s.querySelectorAll('[required]');
    for (var j = 0; j < need.length; j++) {
      if (!need[j].value) { alert(T.needFields); need[j].focus(); return false; }
    }
    return true;
  }

  if (next) next.addEventListener('click', function () {
    if (!valid()) return;
    at = Math.min(at + 1, steps.length - 1);
    paint();
    root.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  if (prev) prev.addEventListener('click', function () { at = Math.max(at - 1, 0); paint(); });

  var form = root.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!valid()) return;
      var c = form.querySelector('[data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      alert(T.sent);
    });
  }
  paint();
}

/* ==========================================================================
   destination rail + team filter
   ========================================================================== */
function rail() {
  var r = document.querySelector('.rail');
  if (!r) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step = function () {
    var c = r.querySelector('.dest');
    return c ? c.getBoundingClientRect().width + 18 : 280;
  };
  var p = document.querySelector('[data-rail="prev"]');
  var n = document.querySelector('[data-rail="next"]');
  if (p) p.addEventListener('click', function () { r.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  if (n) n.addEventListener('click', function () { r.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
}

/* Every team card ships visible; JS only filters. The roster is real and
   published on their own /jo-cintra/equipe page — but [CONFIRM it is current
   before any name goes live, and no portrait publishes without consent]. */
function team() {
  var btns = document.querySelectorAll('.teamfilters button');
  if (!btns.length) return;
  var cards = document.querySelectorAll('.member');
  function apply(key) {
    for (var i = 0; i < cards.length; i++) {
      cards[i].hidden = !(key === 'all' || cards[i].getAttribute('data-role') === key);
    }
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute('aria-pressed', btns[j].getAttribute('data-role') === key ? 'true' : 'false');
    }
  }
  for (var k = 0; k < btns.length; k++) {
    (function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-role')); }); })(btns[k]);
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
    img.style.transform = 'scale(1.05)';
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        img.style.transform = 'translate3d(0,' + (y * 0.1) + 'px,0) scale(1.05)';
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
      el.style.transitionDelay = Math.min(idx, 6) * 110 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* 2013 is theirs and published, so it animates. The "500+ suppliers" figure is
   their claim and carries a visible [CONFIRM] — isNaN keeps it exactly where
   it is rather than counting up to a number nobody has verified. */
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
        var p = Math.min((ts - t0) / 1250, 1);
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
      alert(T.sent);
    });
  }
}

/* ==========================================================================
   LGPD
   --------------------------------------------------------------------------
   Their existing Política de Privacidade and Política de Cookies are CARRIED
   OVER and reviewed, not replaced with boilerplate — the URLs stay.
   Note that the consultation intake collects travel dates, party composition
   and honeymoon status. That is data a client would consider sensitive even
   though it is not "sensitive" in the art. 11 sense, and the policy states its
   purpose and retention plainly rather than burying it.
   ========================================================================== */
var CKKEY = 'jc_lgpd_v1';

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
  intake();
  rail();
  team();
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

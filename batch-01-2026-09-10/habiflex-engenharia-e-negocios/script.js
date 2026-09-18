/* ==========================================================================
   HABIFLEX ENGENHARIA E NEGÓCIOS — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed. Habiflex has not reviewed any of this.

   Two facts drive almost every decision in this file:

   1) THE UNRESOLVED QUESTION. The lead sheet calls Habiflex a boutique
      developer; their live site presents as an imobiliária running a
      syndicated Kenlo listing portal. "Engenharia" in the trading name and
      "Personal EMPREENDIMENTOS Imobiliários Ltda" in the footer both point at
      incorporação. Until that is answered, this build is developer-first with
      the brokerage arm demoted — and every project field is a visible
      [CONFIRM]. If they turn out to be broker-only, the developer track is
      DELETED, not redressed with third-party stock.

   2) WHAT MAY NOT BE INVENTED. No development name. No unit count. No price.
      No delivery date. No sold percentage. No CREA number. No RI/memorial
      registration. No "valorização de X%" and no rental yield — return
      projections are not published anywhere on this build without documented
      substantiation.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* --- real, published contact facts (habiflex.com.br, fetched 09/09/2026) --- */
var WA_NUMBER = '5548991144424';        // (48) 99114-4424 — published
var TEL       = '554832403992';         // (48) 3240-3992  — published
var CRECI     = '2910J';                // published in their own footer, twice

var T = IS_EN ? {
  waGeneric: 'Hello! I found Habiflex online and would like to talk to a broker.',
  waProject: 'Hello! I would like more information about the featured development.',
  waPlan:    'Hello! Could you send me the full floorplan for unit type: ',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  needFields: 'Please fill in the required fields.',
  mock: 'This is a mockup — nothing is sent. On the live site this hands the enquiry straight to WhatsApp, not to a black-box mailbox.'
} : {
  waGeneric: 'Olá! Encontrei a Habiflex na internet e queria falar com um corretor.',
  waProject: 'Olá! Queria mais informações sobre o empreendimento em destaque.',
  waPlan:    'Olá! Pode me enviar a planta completa da tipologia: ',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  needFields: 'Preencha os campos obrigatórios.',
  mock: 'Isto é um mockup — nada é enviado. No site real, isto entrega a mensagem direto no WhatsApp, e não em uma caixa de e-mail cega.'
};

function wa(msg) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg); }

function wireLinks() {
  var n = document.querySelectorAll('[data-wa]'), i;
  for (i = 0; i < n.length; i++) {
    n[i].setAttribute('href', wa(n[i].getAttribute('data-wa') || T.waGeneric));
    n[i].setAttribute('target', '_blank');
    n[i].setAttribute('rel', 'noopener');
  }
  var t = document.querySelectorAll('[data-tel]');
  for (i = 0; i < t.length; i++) t[i].setAttribute('href', 'tel:+' + TEL);
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

  /* hero parallax — transform only, rAF-throttled, off under reduced motion */
  var img = document.querySelector('.hero__img');
  if (img && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        img.style.transform = 'translate3d(0,' + (y * 0.16) + 'px,0) scale(1.06)';
        ticking = false;
      });
    };
    img.style.transform = 'scale(1.06)';
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/* ==========================================================================
   floorplan tabs — full ARIA tablist with arrow-key operation.
   Every plan ships in the HTML; JS only hides the inactive ones, so with
   scripting off all three tipologias are readable and printable.
   ========================================================================== */
function planTabs() {
  var list = document.querySelector('.tabs[role="tablist"]');
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
}

/* ==========================================================================
   memorial descritivo accordion — every panel ships open, JS collapses
   ========================================================================== */
function accordion() {
  var btns = document.querySelectorAll('.acc__b');
  for (var i = 0; i < btns.length; i++) {
    (function (b) {
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (!p) return;
      p.hidden = true;
      b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', open ? 'false' : 'true');
        p.hidden = open;
      });
    })(btns[i]);
  }
  var first = document.querySelector('.acc__b');
  if (first) { first.setAttribute('aria-expanded', 'true');
               var fp = document.getElementById(first.getAttribute('aria-controls'));
               if (fp) fp.hidden = false; }
}

/* ==========================================================================
   construction rail
   --------------------------------------------------------------------------
   The fill bar is driven by data-done on the rail. It is set to 0 here on
   purpose: no phase percentage is confirmed, so nothing is drawn as progress.
   The moment Habiflex supplies real percentages and dated site photographs,
   this becomes the strongest trust asset a developer has — and almost nobody
   in this market does it at all.
   ========================================================================== */
function rail() {
  var r = document.querySelector('.rail');
  if (!r) return;
  var fill = r.querySelector('.rail__fill');
  var done = parseFloat(r.getAttribute('data-done'));
  if (!fill || isNaN(done)) return;          // [CONFIRM] -> nothing is drawn
  if (!('IntersectionObserver' in window)) { fill.style.width = done + '%'; return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      fill.style.width = done + '%';
      io.unobserve(e.target);
    });
  }, { threshold: .3 });
  io.observe(r);
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
      el.style.transitionDelay = Math.min(idx, 7) * 100 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* Count-up refuses to animate an unconfirmed figure: isNaN -> leave the
   [CONFIRM] marker exactly where it is. There is no version of this site
   where a placeholder counts up to a number nobody has verified. */
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
      var t0 = null, dur = 1150;
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
   forms — every one hands off to WhatsApp, never to a black-box mailbox
   --------------------------------------------------------------------------
   "Imóvel sob encomenda" is genuinely the best-converting feature Habiflex
   already owns, and today it is buried under a wall of auto-generated tag
   links. Here it is three fields and a WhatsApp handoff.
   ========================================================================== */
function forms() {
  var fs = document.querySelectorAll('form[data-wa-form]');
  for (var i = 0; i < fs.length; i++) {
    fs[i].addEventListener('submit', function (ev) {
      ev.preventDefault();
      var need = this.querySelectorAll('[required]');
      for (var j = 0; j < need.length; j++) {
        if (!need[j].value) { alert(T.needFields); need[j].focus(); return; }
      }
      var c = this.querySelector('input[type="checkbox"][data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      alert(T.mock);
    });
  }

  /* "solicitar planta completa" composes a message naming the tipologia the
     visitor is actually looking at */
  var pb = document.querySelectorAll('[data-plan-cta]');
  for (var k = 0; k < pb.length; k++) {
    pb[k].addEventListener('click', function (ev) {
      ev.preventDefault();
      var sel = document.querySelector('.tabs [role="tab"][aria-selected="true"]');
      var name = sel ? sel.textContent.trim() : '[CONFIRM]';
      window.open(wa(T.waPlan + name), '_blank', 'noopener');
    });
  }
}

/* ==========================================================================
   LGPD — non-essential OFF by default, reject as prominent as accept.
   Habiflex currently runs no consent banner at all, and their forms collect
   personal AND financial-intent data (faixa de valor, financiamento).
   ========================================================================== */
var CKKEY = 'hbf_lgpd_v1';

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

/* ==========================================================================
   boot
   ========================================================================== */
function boot() {
  wireLinks();
  chrome();
  planTabs();
  accordion();
  rail();
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

/* ==========================================================================
   ILHA FORMOSA — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed.

   ⚠⚠ THE FORMAT IS NOT CONFIRMED, AND THIS FILE IS BUILT AROUND THAT.
   The lead spreadsheet calls Ilha Formosa "a traditional local seafood
   restaurant". Their own Instagram handle is @pastelariailhaformosa —
   pastelaria, a fried-pastel shop. Three live possibilities:
     (a) a seafood-filled pastel counter (pastel de camarão, pastel de siri)
     (b) a sit-down seafood restaurant that kept a pastelaria name
     (c) a hybrid — pastel counter plus full seafood plates
   FORMAT below is the single switch. It ships as 'hibrido' and the page
   carries a visible banner asking the question. Change it to 'pastelaria' or
   'restaurante' the moment the answer arrives, and the menu module reorders
   itself: the pastel rail leads, or the plates section does.

   ⚠ AND: not one dish name and not one price on this site is real. Instagram
   served a login wall to every server-side fetch, so nothing was recoverable.
   Every card ships the literal string "[CONFIRM nome do prato]" and
   "[CONFIRM preço]". A plausible-sounding invented dish is worse than a blank
   one: the client reads it, assumes it came from somewhere, and it ships.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* ==========================================================================
   1 · THE FORMAT SWITCH
   ========================================================================== */
var FORMAT = 'hibrido';    // 'pastelaria' | 'restaurante' | 'hibrido'  [CONFIRM]

/* ==========================================================================
   2 · CONTACT — nothing invented
   --------------------------------------------------------------------------
   No phone, no WhatsApp, no email was captured for Ilha Formosa. The handle
   is the only confirmed digital surface in existence. So WA_NUMBER stays null:
   every WhatsApp control renders, is visibly disabled, and explains why. Nearly
   every Floripa food business takes orders on WhatsApp — but "almost certainly
   exists" is not a number, and a fabricated number can be dialled.
   ========================================================================== */
var WA_NUMBER = null;                                                  // [CONFIRM]
var INSTAGRAM = 'https://www.instagram.com/pastelariailhaformosa/';    // real

/* ==========================================================================
   3 · THE CARDÁPIO — one array, editable live in the pitch meeting
   --------------------------------------------------------------------------
   This is the whole argument. Their menu today, if it is online at all, is a
   photograph inside an Instagram Story highlight: invisible to Google,
   unreadable to a screen reader, impossible to search, gone within a day.
   A tourist in Lagoa searching "pastel de camarão Florianópolis" cannot find
   them.

   TO LOAD A REAL MENU: fill in `nome` and `preco` below, category by category.
   The page rebuilds itself. Doing that edit live, in the meeting, is the close.

   ALLERGENS (ANVISA RDC 26/2015) — mandatory declaration per item. For a
   seafood pastelaria the relevant set is at minimum: crustáceos (camarão),
   peixes, trigo (glúten), leite, ovos, soja, castanhas. Every item also needs
   the cross-contact line, which for a SHARED FRYER is close to certain.
   ========================================================================== */
var ALLERGENS = {
  crustaceos: { pt: 'crustáceos', en: 'crustaceans' },
  peixes:     { pt: 'peixes',     en: 'fish' },
  gluten:     { pt: 'glúten',     en: 'gluten' },
  leite:      { pt: 'leite',      en: 'milk' },
  ovos:       { pt: 'ovos',       en: 'eggs' },
  soja:       { pt: 'soja',       en: 'soy' },
  castanhas:  { pt: 'castanhas',  en: 'tree nuts' }
};

function ITEM(al) {
  return {
    nome: '[CONFIRM nome do prato]',
    desc: '[CONFIRM descrição]',
    preco: 'R$ 00,00',              // BRL, comma decimal. NEVER converted to USD.
    alergenos: al || [],            // [CONFIRM per item, with the kitchen]
    veg: false, semGluten: false    // [CONFIRM]
  };
}

var CARDAPIO = [
  { key: 'pasteis-salgados', pt: 'Pastéis salgados', en: 'Savoury pastéis',
    tier: 'pastel', n: 6, al: ['gluten', 'ovos', 'leite'] },
  { key: 'pasteis-mar', pt: 'Pastéis de frutos do mar', en: 'Seafood pastéis',
    tier: 'pastel', n: 5, al: ['gluten', 'ovos', 'crustaceos', 'peixes'] },
  { key: 'pasteis-doces', pt: 'Pastéis doces', en: 'Sweet pastéis',
    tier: 'pastel', n: 4, al: ['gluten', 'ovos', 'leite', 'castanhas'] },
  { key: 'porcoes', pt: 'Porções', en: 'Sharing plates',
    tier: 'ambos', n: 5, al: ['gluten', 'crustaceos'] },
  { key: 'pratos', pt: 'Pratos / Peixes', en: 'Plates / Fish',
    tier: 'prato', n: 6, al: ['peixes', 'crustaceos', 'leite'] },
  { key: 'bebidas', pt: 'Bebidas', en: 'Drinks',
    tier: 'ambos', n: 6, al: [] },
  { key: 'caldo', pt: 'Caldo de cana / sucos', en: 'Sugarcane juice / juices',
    tier: 'ambos', n: 4, al: [] }
];

/* Destaques rail — six hero cards. Which six depends on FORMAT, which is why
   the ordering is computed rather than typed. */
function destaqueOrder() {
  if (FORMAT === 'pastelaria') return ['pasteis-mar', 'pasteis-salgados', 'porcoes', 'pasteis-doces', 'caldo', 'bebidas'];
  if (FORMAT === 'restaurante') return ['pratos', 'porcoes', 'pasteis-mar', 'bebidas', 'pasteis-salgados', 'caldo'];
  return ['pasteis-mar', 'pratos', 'pasteis-salgados', 'porcoes', 'pasteis-doces', 'caldo'];
}

/* ==========================================================================
   4 · language strings
   ========================================================================== */
var T = IS_EN ? {
  waMissing: 'No WhatsApp number has been confirmed for Ilha Formosa yet.\n\n' +
             'The only verified channel is Instagram: @pastelariailhaformosa\n\n' +
             'Almost every food business in Florianópolis takes orders on WhatsApp, ' +
             'so this one almost certainly does too — but "almost certainly" is not ' +
             'a number, and this mockup never prints a contact detail it cannot verify.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  mock: 'This is a mockup — nothing is sent.'
} : {
  waMissing: 'Nenhum número de WhatsApp foi confirmado para a Ilha Formosa.\n\n' +
             'O único canal verificado é o Instagram: @pastelariailhaformosa\n\n' +
             'Quase todo negócio de comida em Florianópolis atende por WhatsApp, então ' +
             'este quase certamente também atende — mas “quase certamente” não é um ' +
             'número, e este mockup nunca imprime um dado de contato que não pôde verificar.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  mock: 'Isto é um mockup — nada é enviado.'
};

/* ==========================================================================
   5 · WhatsApp wiring — renders, disabled, honest
   ========================================================================== */
function wireWhatsApp() {
  var nodes = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < nodes.length; i++) {
    (function (el) {
      if (el.getAttribute('data-wa-wired')) return;
      el.setAttribute('data-wa-wired', '1');
      var msg = el.getAttribute('data-wa') ||
                L('Olá! Vim pelo site da Ilha Formosa.', 'Hello! I found you through the Ilha Formosa website.');
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
   6 · rendering the cardápio
   ========================================================================== */
function allergenChips(cat) {
  if (!cat.al || !cat.al.length) return '';
  var out = '<div class="aller">';
  for (var i = 0; i < cat.al.length; i++) {
    var a = ALLERGENS[cat.al[i]];
    if (!a) continue;
    /* the word is always printed — a colour alone never conveys an allergen */
    out += '<span>' + L(a.pt, a.en) + ' <span class="cfm">[CONFIRM]</span></span>';
  }
  return out + '</div>';
}

function catBy(key) {
  for (var i = 0; i < CARDAPIO.length; i++) if (CARDAPIO[i].key === key) return CARDAPIO[i];
  return null;
}

function renderRail(host) {
  if (!host) return;
  var order = destaqueOrder();
  var imgs = (host.getAttribute('data-imgs') || '').split('|');
  var h = '';
  for (var i = 0; i < order.length; i++) {
    var c = catBy(order[i]);
    if (!c) continue;
    var img = imgs[i % imgs.length] || '';
    h += '<article class="dish">' +
           '<div class="dish__i">' +
             '<img src="' + img + '" width="600" height="750" loading="lazy" decoding="async" alt="' +
               L('Imagem ilustrativa de banco de imagens para a categoria ' + c.pt,
                 'Illustrative stock photograph for the ' + c.en + ' category') + '">' +
           '</div>' +
           '<div class="dish__b">' +
             '<h3>' + L(c.pt, c.en) + '</h3>' +
             '<p><span class="cfm">[CONFIRM nome do prato]</span></p>' +
             '<span class="price">R$ 00,00 <span class="cfm" style="margin-left:6px">[CONFIRM]</span></span>' +
             allergenChips(c) +
             '<a class="btn btn--wa btn--sm btn--full" style="margin-top:auto" href="#" data-wa="' +
               L('Olá! Queria pedir: [CONFIRM nome do prato]', 'Hello! I would like to order: [CONFIRM item name]') +
             '">' + L('Pedir no WhatsApp', 'Order on WhatsApp') + '</a>' +
           '</div>' +
         '</article>';
  }
  host.innerHTML = h;
  wireWhatsApp();
}

function renderAccordion(host) {
  if (!host) return;
  /* categories are ordered by FORMAT: a pastelaria leads with pastéis, a
     seafood restaurant leads with plates. Nothing else about them changes. */
  var cats = CARDAPIO.slice();
  if (FORMAT === 'restaurante') {
    cats.sort(function (a, b) {
      var rank = function (c) { return c.tier === 'prato' ? 0 : (c.tier === 'ambos' ? 1 : 2); };
      return rank(a) - rank(b);
    });
  } else if (FORMAT === 'pastelaria') {
    cats.sort(function (a, b) {
      var rank = function (c) { return c.tier === 'pastel' ? 0 : (c.tier === 'ambos' ? 1 : 2); };
      return rank(a) - rank(b);
    });
  }

  var h = '';
  for (var i = 0; i < cats.length; i++) {
    var c = cats[i];
    var items = '';
    for (var j = 0; j < c.n; j++) {
      var it = ITEM(c.al);
      items += '<li>' +
                 '<div>' +
                   '<span class="nm cfm">' + it.nome + '</span>' +
                   '<p class="ds"><span class="cfm">' + it.desc + '</span></p>' +
                   allergenChips(c) +
                 '</div>' +
                 '<span class="pr">' + it.preco + '</span>' +
                 '<span class="act"><a class="btn btn--wa btn--sm" href="#" data-wa="' +
                   L('Olá! Queria pedir: [CONFIRM nome do prato]', 'Hello! I would like to order: [CONFIRM item name]') +
                 '">' + L('Pedir este item', 'Order this item') + '</a></span>' +
               '</li>';
    }
    h += '<div class="acc__i">' +
           '<button class="acc__b" id="accb' + i + '" aria-controls="accp' + i + '" aria-expanded="true">' +
             '<span>' + L(c.pt, c.en) + '</span><span class="pm" aria-hidden="true"></span>' +
           '</button>' +
           '<div class="acc__p" id="accp' + i + '" role="region" aria-labelledby="accb' + i + '">' +
             '<ul class="mlist">' + items + '</ul>' +
           '</div>' +
         '</div>';
  }
  host.innerHTML = h;
  wireWhatsApp();

  /* Progressive enhancement: every panel is rendered OPEN, then collapsed here.
     With scripting off the whole cardápio is readable and indexable. */
  var btns = host.querySelectorAll('.acc__b');
  for (var k = 0; k < btns.length; k++) {
    (function (b, idx) {
      var p = document.getElementById(b.getAttribute('aria-controls'));
      if (!p) return;
      var startOpen = (idx === 0);
      b.setAttribute('aria-expanded', startOpen ? 'true' : 'false');
      p.hidden = !startOpen;
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', open ? 'false' : 'true');
        p.hidden = open;
      });
    })(btns[k], k);
  }
}

/* ==========================================================================
   7 · chrome, carousel, reveals, counters, forms, LGPD
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
  var img = document.querySelector('.hero__img img');
  if (img && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 600);
        img.style.transform = 'translate3d(0,' + (y * 0.07) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }
}

function carousel() {
  var rail = document.querySelector('.rail');
  if (!rail) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var step = function () {
    var c = rail.querySelector('.dish');
    return c ? c.getBoundingClientRect().width + 14 : 280;
  };
  var prev = document.querySelector('[data-rail="prev"]');
  var next = document.querySelector('[data-rail="next"]');
  if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }); });
  if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }); });
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

/* Nothing on this site has a verified number attached to it. The counter
   engine exists so the numbers band works the day real figures arrive — and
   until then isNaN stops every one of them dead. The band ships EMPTY. */
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

var CKKEY = 'if_lgpd_v1';

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
  renderRail(document.querySelector('[data-rail-host]'));
  renderAccordion(document.querySelector('[data-cardapio]'));
  chrome();
  carousel();
  wireWhatsApp();
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

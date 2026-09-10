/* ==========================================================================
   KAIRÚ — one engine, both language trees
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed. Instagram-only (@kairu.veg), login-walled,
   nothing recoverable. Every business fact ships as a visible [CONFIRM].

   TWO CLAIMS ON THIS SITE ARE LOAD-BEARING AND NEITHER MAY SHIP UNCONFIRMED:

   1) "100% VEGETAL". This is a claim, not a decoration. It must not appear
      anywhere — not in the ticker, not in the trust strip, not in a meta
      description — until the kitchen confirms that the BREAD, the SAUCES, the
      FRYER OIL and every ingredient are free of animal products, and states
      whether the kitchen also handles non-vegan items. Two different people
      rely on that sentence: someone with an ethical commitment, and someone
      with a dairy or egg allergy. Under the CDC a false one is misleading
      advertising. VEGAN_CONFIRMED below is the single switch that governs it.

   2) THE iFOOD LISTING. No delivery badge, link or rating ships unverified,
      and no delivery rating or review count is ever invented.

   And one rule about the food itself: NOT ONE burger, patty, sauce,
   ingredient or price on this page is real. On a burger menu the temptation
   to write something plausible is high and the damage is total — a vegan
   customer choosing on an ingredient list cannot be shown an invented one.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
function L(pt, en) { return IS_EN ? en : pt; }

/* ==========================================================================
   1 · THE TWO SWITCHES
   ========================================================================== */
var VEGAN_CONFIRMED = false;   // [CONFIRM bread, sauces, fryer oil, every ingredient]
var ON_IFOOD = null;           // [CONFIRM] — null = unknown, do not render a badge

/* ==========================================================================
   2 · CONTACT — nothing to wire
   --------------------------------------------------------------------------
   No phone, WhatsApp or email was captured. Every WhatsApp control renders,
   is visibly disabled, and explains why. A burger joint without a dialable
   number in a mockup is honest; a fabricated one can be dialled.
   ========================================================================== */
var WA_NUMBER = null;                                           // [CONFIRM]
var INSTAGRAM = 'https://www.instagram.com/kairu.veg/';         // real

/* ==========================================================================
   3 · THE BOARD — one array, editable live in the pitch
   --------------------------------------------------------------------------
   The dietary tag set is the most important schema decision on this lead.
   Because the whole menu is plant-based, "vegan" carries no information —
   every item is. The useful signal is WHICH ALLERGEN AN ITEM AVOIDS, and that
   is what a customer actually filters on. Plant-based does not reduce the
   allergen burden, it SHIFTS it: soy and nuts are everywhere in vegan patties
   and cheeses.
   ========================================================================== */
var TAGS = {
  'sem-gluten':   { pt: 'sem glúten',     en: 'gluten free',  cls: 'tag--free' },
  'sem-soja':     { pt: 'sem soja',       en: 'soy free',     cls: 'tag--free' },
  'sem-castanhas':{ pt: 'sem castanhas',  en: 'nut free',     cls: 'tag--free' },
  'sem-oleaginosas':{ pt: 'sem oleaginosas', en: 'tree-nut free', cls: 'tag--free' },
  'picante':      { pt: 'picante',        en: 'spicy',        cls: 'tag--hot' }
};

function ITEM(tags) {
  return {
    nome: '[CONFIRM nome]',
    build: '[CONFIRM ingredientes]',
    preco: 'R$ 00,00',          // BRL, comma decimal. NEVER converted to USD.
    tags: tags || []
  };
}

var CATEGORIES = [
  { key: 'burgers',  pt: 'Burgers',              en: 'Burgers',            n: 4 },
  { key: 'limitada', pt: 'Do dia / Edição limitada', en: 'Today / Limited edition', n: 1 },
  { key: 'acomp',    pt: 'Acompanhamentos',      en: 'Sides',              n: 3 },
  { key: 'molhos',   pt: 'Molhos',               en: 'Sauces',             n: 2 },
  { key: 'sobremesas', pt: 'Sobremesas',         en: 'Desserts',           n: 2 },
  { key: 'bebidas',  pt: 'Bebidas',              en: 'Drinks',             n: 2 },
  { key: 'combos',   pt: 'Combos',               en: 'Combos',             n: 2 }
];

var T = IS_EN ? {
  waMissing: 'No WhatsApp number has been confirmed for Kairú yet.\n\n' +
             'The only verified channel is Instagram: @kairu.veg\n\n' +
             'This mockup never prints a contact detail it cannot verify — an invented ' +
             'number can be dialled, and that is worse than no number at all.',
  veganNote: '"100% vegetal" is a claim, not a decoration — so it is switched OFF in this build.\n\n' +
             'It goes live only once the kitchen confirms that the bread, the sauces, the fryer oil ' +
             'and every ingredient are free of animal products, and states whether the kitchen also ' +
             'handles non-vegan items.\n\nSomeone with a dairy allergy and someone with an ethical ' +
             'commitment both rely on that sentence.',
  ifoodNote: 'No delivery-app badge, link or rating ships until the listing is confirmed.\n\n' +
             '[CONFIRM whether Kairú is on iFood] — it is the most commercially important open ' +
             'question on this lead.',
  needFields: 'Please fill in the required fields.',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  comboMsg: 'Hello! I would like to build a combo:'
} : {
  waMissing: 'Nenhum número de WhatsApp foi confirmado para a Kairú.\n\n' +
             'O único canal verificado é o Instagram: @kairu.veg\n\n' +
             'Este mockup nunca imprime um dado de contato que não pôde verificar — um número ' +
             'inventado pode ser discado, e isso é pior do que não ter número.',
  veganNote: '“100% vegetal” é uma afirmação, não um enfeite — por isso está DESLIGADA neste build.\n\n' +
             'Ela só entra no ar quando a cozinha confirmar que o pão, os molhos, o óleo da fritadeira ' +
             'e todos os ingredientes são livres de produtos de origem animal, e disser se a cozinha ' +
             'também manipula itens não veganos.\n\nQuem tem alergia a leite e quem tem compromisso ' +
             'ético dependem, os dois, dessa frase.',
  ifoodNote: 'Nenhum selo, link ou nota de app de entrega entra no ar antes de a listagem ser confirmada.\n\n' +
             '[CONFIRM se a Kairú está no iFood] — é a pergunta comercialmente mais importante deste lead.',
  needFields: 'Preencha os campos obrigatórios.',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  comboMsg: 'Olá! Queria montar um combo:'
};

/* ==========================================================================
   4 · WhatsApp — renders, disabled, honest
   ========================================================================== */
function wireWhatsApp() {
  var nodes = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < nodes.length; i++) {
    (function (el) {
      if (el.getAttribute('data-wa-wired')) return;
      el.setAttribute('data-wa-wired', '1');
      var msg = el.getAttribute('data-wa') ||
                L('Olá! Vim pelo site da Kairú.', 'Hello! I found you through the Kairú website.');
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
  var v = document.querySelectorAll('[data-vegan-note]');
  for (var j = 0; j < v.length; j++) {
    v[j].addEventListener('click', function (ev) { ev.preventDefault(); alert(T.veganNote); });
  }
  var f = document.querySelectorAll('[data-ifood]');
  for (var k = 0; k < f.length; k++) {
    (function (el) {
      if (ON_IFOOD !== true) {
        el.setAttribute('data-unconfirmed', 'true');
        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', function (ev) { ev.preventDefault(); alert(T.ifoodNote); });
      }
    })(f[k]);
  }
}

/* ==========================================================================
   5 · rendering the board + the filter chips
   ========================================================================== */
function tagHTML(tags) {
  if (!tags || !tags.length) return '';
  var out = '<div class="tags">';
  for (var i = 0; i < tags.length; i++) {
    var t = TAGS[tags[i]];
    if (!t) continue;
    /* the word is always printed — an allergen is never conveyed by colour */
    out += '<span class="tag ' + t.cls + '">' + L(t.pt, t.en) + ' <span class="cfm">[CONFIRM]</span></span>';
  }
  return out + '</div>';
}

function renderBoard(host) {
  if (!host) return;
  var imgs = (host.getAttribute('data-imgs') || '').split('|');
  var h = '', n = 0;
  for (var c = 0; c < CATEGORIES.length; c++) {
    var cat = CATEGORIES[c];
    for (var i = 0; i < cat.n; i++) {
      var it = ITEM();
      var img = imgs[n % imgs.length] || '';
      n++;
      h += '<article class="item" data-tags="">' +
             '<div class="item__i">' +
               '<img src="' + img + '" width="600" height="750" loading="lazy" decoding="async" alt="' +
                 L('Hambúrguer fotografado em fundo escuro — imagem de banco de imagens, não é um produto da Kairú e não é um item vegetal',
                   'A burger photographed on a dark background — stock image, not a Kairú product and not a plant-based item') +
               '">' +
             '</div>' +
             '<div class="item__b">' +
               '<span class="cfm">' + L(cat.pt, cat.en) + '</span>' +
               '<h3><span class="cfm">' + it.nome + '</span></h3>' +
               '<p><span class="cfm">' + it.build + '</span></p>' +
               '<span class="price">' + it.preco + '</span>' +
               '<div class="tags">' +
                 '<span class="tag tag--free">' + L('alérgenos', 'allergens') + ' <span class="cfm">[CONFIRM]</span></span>' +
               '</div>' +
               '<a class="btn btn--sm btn--full" style="margin-top:auto" href="#" data-wa="' +
                 L('Olá! Queria pedir: [CONFIRM nome do item]', 'Hello! I would like to order: [CONFIRM item name]') +
               '">' + L('Pedir no WhatsApp', 'Order on WhatsApp') + '</a>' +
             '</div>' +
           '</article>';
    }
  }
  host.innerHTML = h;
  wireWhatsApp();
}

/* The filter chips are client-side, no framework, and cost almost nothing to
   build — but an Instagram highlight literally cannot do this, which is the
   point. Every card ships visible; JS only filters. */
function filters() {
  var btns = document.querySelectorAll('.chips button');
  if (!btns.length) return;
  function apply(key) {
    var items = document.querySelectorAll('.item');
    for (var i = 0; i < items.length; i++) {
      var t = items[i].getAttribute('data-tags') || '';
      items[i].hidden = !(key === 'all' || t.indexOf(key) !== -1);
    }
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute('aria-pressed', btns[j].getAttribute('data-f') === key ? 'true' : 'false');
    }
  }
  for (var k = 0; k < btns.length; k++) {
    (function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-f')); }); })(btns[k]);
  }
  apply('all');
}

/* ==========================================================================
   6 · combo builder — assembles a WhatsApp message, not a cart.
   No payment, no backend, no complexity. The cheapest possible way to raise
   average ticket, and it costs an afternoon.
   ========================================================================== */
function combo() {
  var form = document.getElementById('comboForm');
  if (!form) return;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = function (id) {
      var el = document.getElementById(id);
      return el ? el.options[el.selectedIndex].text : '';
    };
    var msg = T.comboMsg + '\n\n' +
              L('Burger: ', 'Burger: ') + v('c-burger') + '\n' +
              L('Acompanhamento: ', 'Side: ') + v('c-side') + '\n' +
              L('Bebida: ', 'Drink: ') + v('c-drink');
    if (!WA_NUMBER) { alert(T.waMissing); return; }
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
}

/* ==========================================================================
   7 · chrome, reveals, counters, forms, LGPD
   ========================================================================== */
function chrome() {
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
}

function reveals() {
  var els = document.querySelectorAll('[data-rv], .sec-head');
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

/* The numbers band ships EMPTY. Nothing about this business has a verified
   figure attached to it, and isNaN keeps every placeholder exactly where it is. */
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
      alert(L('Isto é um mockup — nada é enviado.', 'This is a mockup — nothing is sent.'));
    });
  }
}

var CKKEY = 'kairu_lgpd_v1';

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
  renderBoard(document.querySelector('[data-board]'));
  wireWhatsApp();
  chrome();
  filters();
  combo();
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

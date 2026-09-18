/* ==========================================================================
   GRÃO MESTRE — one engine, four pages, two languages
   /  ·  /buffet/  ·  /emporio/   and the parallel /en/ tree
   --------------------------------------------------------------------------
   SPEC MOCKUP — lead not signed. Nothing here is invented: every product,
   dish, price, hour and phone number ships as a visible [CONFIRM] until the
   client supplies it.

   THE ONE FILE THE OWNER EDITS is BOARD, immediately below. Posting the day's
   buffet takes under a minute: change `data`, type the dishes, save. That is
   the whole pitch — a daily-changing buffet is exactly the business that
   "a website just goes stale" objections come from, and this answers it.
   ========================================================================== */

'use strict';

var IS_EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;

/* ==========================================================================
   1 · CONTACT — nothing is invented
   --------------------------------------------------------------------------
   The lead sheet captured NO phone, NO WhatsApp and NO email for Grão Mestre.
   The only confirmed digital surface in existence is the Instagram handle.
   So WA_NUMBER stays null: every WhatsApp control on the site renders, but is
   visibly disabled and explains why when pressed. A fabricated number in a
   spec mockup is worse than no number — it can be dialled.
   ========================================================================== */
var WA_NUMBER = null;                              // [CONFIRM] WhatsApp comercial
var INSTAGRAM = 'https://www.instagram.com/emporiograomestresc/';   // real, verified

/* ==========================================================================
   2 · THE BUFFET BOARD  ⭐  — the piece to demonstrate live in the pitch
   --------------------------------------------------------------------------
   HOW TO POST TODAY'S BUFFET (one minute):
     1. find the object below whose `data` is today, in "DD/MM" — or change the
        first one's `data` to today's date;
     2. type what is out, in the five groups;
     3. tag each dish: 'vegano' 'vegetariano' 'sem-gluten' 'sem-lactose';
     4. save. Done. The hero, the board, the week strip and /buffet/ all update.

   EVERY dish below is the literal string "[CONFIRM prato]". These are three
   clearly-labelled EXAMPLE DAYS showing the shape of a board — they are NOT a
   menu. No dish name is invented, ever, and the tags are examples of the
   mechanism, not claims about real food. Allergen data must come from the
   kitchen before a single real dish is typed in (ANVISA RDC 26/2015).

   PRICE: the single most-searched fact about any buffet, and the single most
   common source of billing complaints (CDC). Whether it is POR QUILO (by
   weight) or LIVRE (fixed price) must be stated unambiguously ALONGSIDE the
   figure. Until Grão Mestre confirms both, the price line renders as the
   question itself. Nothing is guessed.
   ========================================================================== */
var PRECO = {
  modelo: null,                    // 'quilo' | 'livre'   [CONFIRM]
  valor: null,                     // 45.90 etc.          [CONFIRM]
  texto_pt: '[CONFIRM — por quilo (R$ 00,00/kg) ou livre (R$ 00,00)?]',
  texto_en: '[CONFIRM — por quilo (by weight, R$ 00.00/kg) or livre (fixed price, R$ 00.00)?]'
};

var JANELA = {                     // the serving window — the fact people need most
  dias_pt: '[CONFIRM dias]',
  dias_en: '[CONFIRM days]',
  ini: null,                       // '11:00'  [CONFIRM]
  fim: null,                       // '14:30'  [CONFIRM]
  texto_pt: '[CONFIRM horário do buffet]',
  texto_en: '[CONFIRM buffet serving hours]',
  fimDeSemana_pt: '[CONFIRM se o buffet funciona aos sábados e domingos]',
  fimDeSemana_en: '[CONFIRM whether the buffet runs on Saturdays and Sundays]'
};

var GRUPOS = [
  { key: 'saladas',    pt: 'Saladas',    en: 'Salads' },
  { key: 'quentes',    pt: 'Quentes',    en: 'Hot dishes' },
  { key: 'proteinas',  pt: 'Proteínas',  en: 'Proteins' },
  { key: 'vegano',     pt: 'Vegano',     en: 'Vegan' },
  { key: 'sobremesas', pt: 'Sobremesas', en: 'Desserts' }
];

function P(tags) { return { nome: '[CONFIRM prato]', tags: tags || [] }; }

var BOARD = [
  {
    data: '02/06',                        // DD/MM — Brazilian order, always
    dia_pt: 'Segunda', dia_en: 'Monday',
    exemplo: true,                        // <- flags this as an EXAMPLE day
    saladas:    [P(['vegano','sem-gluten']), P(['vegano']), P(['sem-lactose'])],
    quentes:    [P(['vegetariano']), P(['sem-gluten']), P([])],
    proteinas:  [P([]), P(['sem-lactose'])],
    vegano:     [P(['vegano','sem-gluten']), P(['vegano'])],
    sobremesas: [P(['sem-gluten']), P(['vegano','sem-lactose'])]
  },
  {
    data: '03/06',
    dia_pt: 'Terça', dia_en: 'Tuesday',
    exemplo: true,
    saladas:    [P(['vegano']), P(['vegano','sem-gluten'])],
    quentes:    [P(['vegetariano','sem-lactose']), P([])],
    proteinas:  [P([]), P([])],
    vegano:     [P(['vegano'])],
    sobremesas: [P(['vegano','sem-gluten'])]
  },
  {
    data: '04/06',
    dia_pt: 'Quarta', dia_en: 'Wednesday',
    exemplo: true,
    saladas:    [P(['vegano','sem-gluten']), P(['vegetariano'])],
    quentes:    [P(['sem-gluten']), P(['vegetariano'])],
    proteinas:  [P([])],
    vegano:     [P(['vegano','sem-lactose']), P(['vegano'])],
    sobremesas: [P(['sem-lactose'])]
  }
];

/* The rest of the week — same array, no dishes typed yet. A regular who checks
   the week's board on Sunday comes three times that week instead of once. */
var SEMANA = [
  { data: '[CONFIRM]', dia_pt: 'Quinta',  dia_en: 'Thursday' },
  { data: '[CONFIRM]', dia_pt: 'Sexta',   dia_en: 'Friday' },
  { data: '[CONFIRM]', dia_pt: 'Sábado',  dia_en: 'Saturday' },
  { data: '[CONFIRM]', dia_pt: 'Domingo', dia_en: 'Sunday' }
];

/* ==========================================================================
   3 · THE EMPÓRIO STOCK LIST
   --------------------------------------------------------------------------
   Seven categories — every one of them a live search query in Florianópolis
   that currently finds a competitor. NOT ONE brand, supplier, origin or price
   is named. `itens` carries the SHAPE of a shelf label so the client can see
   exactly what they are being asked for, and nothing more.

   Note on "orgânico": it is a regulated term in Brazil and may not appear on
   a product, a heading or a meta description without valid certification.
   It appears nowhere in this file. The same restraint applies to "integral",
   "sem açúcar" and "funcional" — state only what the supplier's label states,
   and never restate a nutritional claim beyond it.
   ========================================================================== */
function ITEM() {
  return { nome: '[CONFIRM produto]', unidade: '[CONFIRM unidade]', preco: 'R$ 00,00' };
}

var CATEGORIAS = [
  { key: 'graos',   pt: 'Grãos & cereais',        en: 'Grains & cereals',
    nota_pt: 'a granel / pacote [CONFIRM]', nota_en: 'loose / packaged [CONFIRM]', n: 6 },
  { key: 'castanhas', pt: 'Castanhas & frutas secas', en: 'Nuts & dried fruit',
    nota_pt: 'a granel [CONFIRM]', nota_en: 'loose [CONFIRM]', n: 6 },
  { key: 'farinhas', pt: 'Farinhas',              en: 'Flours',
    nota_pt: 'sem glúten? [CONFIRM]', nota_en: 'gluten-free? [CONFIRM]', n: 6 },
  { key: 'temperos', pt: 'Temperos & ervas',      en: 'Spices & herbs',
    nota_pt: '[CONFIRM]', nota_en: '[CONFIRM]', n: 6 },
  { key: 'chas',    pt: 'Chás',                   en: 'Teas',
    nota_pt: '[CONFIRM]', nota_en: '[CONFIRM]', n: 6 },
  { key: 'naturais', pt: 'Naturais & suplementos', en: 'Natural products & supplements',
    nota_pt: '[CONFIRM]', nota_en: '[CONFIRM]', n: 6 },
  { key: 'doces',   pt: 'Doces sem açúcar',       en: 'Sugar-free sweets',
    nota_pt: '[CONFIRM]', nota_en: '[CONFIRM]', n: 6 }
];

/* ==========================================================================
   4 · language strings
   ========================================================================== */
var T = IS_EN ? {
  waMissing: 'No WhatsApp number has been confirmed for Grão Mestre yet.\n\n' +
             'The only verified channel is Instagram: @emporiograomestresc\n\n' +
             'This mockup never invents a contact detail — a fabricated number ' +
             'can be dialled, and that is worse than no number at all.',
  hoje: 'Today', semana: 'This week', semTags: 'no tags confirmed',
  vazio: 'Today&rsquo;s board is coming soon — follow @emporiograomestresc',
  needConsent: 'Please tick the consent box so we know how we may reply to you.',
  needFields: 'Please fill in the required fields.',
  sent: 'This is a mockup — no message is actually sent. On the live site this ' +
        'opens WhatsApp with your enquiry ready to send.',
  exemplo: 'EXAMPLE DAY'
} : {
  waMissing: 'Nenhum número de WhatsApp foi confirmado para o Grão Mestre.\n\n' +
             'O único canal verificado é o Instagram: @emporiograomestresc\n\n' +
             'Este mockup nunca inventa um dado de contato — um número ' +
             'fabricado pode ser discado, e isso é pior do que não ter número.',
  hoje: 'Hoje', semana: 'Cardápio da semana', semTags: 'sem tags confirmadas',
  vazio: 'Cardápio de hoje em breve — acompanhe no @emporiograomestresc',
  needConsent: 'Marque a autorização para sabermos como podemos responder.',
  needFields: 'Preencha os campos obrigatórios.',
  sent: 'Isto é um mockup — nenhuma mensagem é enviada. No site real, este botão ' +
        'abre o WhatsApp com a sua mensagem pronta.',
  exemplo: 'DIA DE EXEMPLO'
};

function L(pt, en) { return IS_EN ? en : pt; }

var TAGMAP = {
  'vegano':       { cls: 'tag--veg', pt: 'vegano',       en: 'vegan' },
  'vegetariano':  { cls: 'tag--veg', pt: 'vegetariano',  en: 'vegetarian' },
  'sem-gluten':   { cls: 'tag--gl',  pt: 'sem glúten',   en: 'gluten free' },
  'sem-lactose':  { cls: 'tag--lac', pt: 'sem lactose',  en: 'lactose free' }
};

/* ==========================================================================
   5 · WhatsApp wiring — renders, disabled, honest
   ========================================================================== */
function waHref(msg) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
}

function wireWhatsApp() {
  var nodes = document.querySelectorAll('[data-wa]');
  for (var i = 0; i < nodes.length; i++) {
    (function (el) {
      var msg = el.getAttribute('data-wa') ||
                L('Olá! Vim pelo site do Grão Mestre.', 'Hello! I found you through the Grão Mestre website.');
      if (WA_NUMBER) {
        el.setAttribute('href', waHref(msg));
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
   6 · THE TWO-STATE HERO ⭐
   --------------------------------------------------------------------------
   Between the confirmed buffet hours the hero defaults to BUFFET (today's
   date, the window, the price line, a preview of the board). Outside them it
   defaults to EMPÓRIO (the shop, its hours, a "ver produtos" button).

   Both states are ALWAYS in the HTML and both are ALWAYS reachable from the
   visible toggle — the clock only chooses which one opens first. With
   scripting off, the static combined hero in the markup is what ships, which
   is why .nojs-hero is visible by default and hidden here.

   Until JANELA is confirmed, the clock cannot run, so the default state falls
   back to [CONFIRM which side is the bigger revenue line] — currently BUFFET,
   because the lunch decision is the more time-critical of the two.
   ========================================================================== */
function toMinutes(hhmm) {
  if (!hhmm) return null;
  var p = String(hhmm).split(':');
  return (parseInt(p[0], 10) * 60) + parseInt(p[1] || '0', 10);
}

function defaultState() {
  var ini = toMinutes(JANELA.ini), fim = toMinutes(JANELA.fim);
  if (ini === null || fim === null) return 'buffet';   // [CONFIRM hours] -> see note above
  var now = new Date();
  var mins = now.getHours() * 60 + now.getMinutes();
  // opens the buffet state a little before service, while people are deciding
  return (mins >= ini - 75 && mins <= fim) ? 'buffet' : 'emporio';
}

function heroInit() {
  var wrapEl = document.querySelector('[data-hero]');
  if (!wrapEl) return;
  var nojs = wrapEl.querySelector('.nojs-hero');
  if (nojs) nojs.hidden = true;

  var tabs   = wrapEl.querySelectorAll('.states button');
  var panes  = wrapEl.querySelectorAll('.hstate');
  var shots  = document.querySelectorAll('.hero__media img');

  function show(state) {
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute('aria-selected', tabs[i].getAttribute('data-state') === state ? 'true' : 'false');
    }
    for (var j = 0; j < panes.length; j++) {
      panes[j].hidden = panes[j].getAttribute('data-pane') !== state;
    }
    for (var k = 0; k < shots.length; k++) {
      if (shots[k].getAttribute('data-shot') === state) shots[k].classList.add('show');
      else shots[k].classList.remove('show');
    }
  }

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () { show(this.getAttribute('data-state')); });
  }
  show(defaultState());
}

/* ==========================================================================
   7 · rendering the board
   ========================================================================== */
function tagHTML(tags) {
  if (!tags || !tags.length) return '';
  var out = '<span class="tags">';
  for (var i = 0; i < tags.length; i++) {
    var t = TAGMAP[tags[i]];
    if (!t) continue;
    /* the word is always printed — state is never conveyed by colour alone */
    out += '<span class="tag ' + t.cls + '">' + L(t.pt, t.en) + ' <span class="cfm">[CONFIRM]</span></span>';
  }
  return out + '</span>';
}

function precoTexto() { return L(PRECO.texto_pt, PRECO.texto_en); }
function janelaTexto() { return L(JANELA.texto_pt, JANELA.texto_en); }

function renderBoard(host, day) {
  if (!host) return;
  if (!day) {
    host.innerHTML = '<div class="empty-state"><p>' + T.vazio + '</p>' +
      '<a class="btn btn--sm" href="' + INSTAGRAM + '" target="_blank" rel="noopener">@emporiograomestresc</a></div>';
    return;
  }
  var h = '';
  h += '<div class="board__top">' +
         '<div class="board__date"><b>' + day.data + '</b>' +
           '<span>' + L(day.dia_pt, day.dia_en) + '</span>' +
           (day.exemplo ? ' <span class="cfm">' + T.exemplo + '</span>' : '') +
         '</div>' +
         '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">' +
           '<span class="flag">' + L('Hoje no buffet', 'On the buffet today') + '</span>' +
           '<span class="pricepill">' + precoTexto() + '</span>' +
         '</div>' +
       '</div>';

  h += '<div class="board__cols">';
  for (var g = 0; g < GRUPOS.length; g++) {
    var grupo = GRUPOS[g];
    var itens = day[grupo.key] || [];
    h += '<div class="bgroup"><h3>' + L(grupo.pt, grupo.en) + '</h3><ul>';
    if (!itens.length) {
      h += '<li><span class="cfm">[CONFIRM]</span></li>';
    } else {
      for (var i = 0; i < itens.length; i++) {
        h += '<li><span class="cfm">' + itens[i].nome + '</span>' + tagHTML(itens[i].tags) + '</li>';
      }
    }
    h += '</ul></div>';
  }
  h += '</div>';

  h += '<div class="board__foot">' +
         '<span class="muted">' + L('Servimos', 'Served') + ': ' + janelaTexto() + ' &middot; ' +
           L('fim de semana', 'weekends') + ': <span class="cfm">[CONFIRM]</span></span>' +
         '<a class="btn btn--sm" href="#" data-wa="' +
           L('Olá! Queria levar marmita do buffet de hoje.', 'Hello! I would like a takeaway box from today&rsquo;s buffet.') +
           '">' + L('Levar marmita', 'Takeaway box') + ' <span class="cfm">[CONFIRM]</span></a>' +
       '</div>';

  host.innerHTML = h;
}

function renderWeek(host) {
  if (!host) return;
  var all = BOARD.concat(SEMANA);
  var h = '';
  for (var i = 0; i < all.length; i++) {
    var d = all[i];
    var count = 0;
    for (var g = 0; g < GRUPOS.length; g++) { count += (d[GRUPOS[g].key] || []).length; }
    h += '<div class="wday' + (i === 0 ? ' is-today' : '') + '">' +
           '<b>' + d.data + '</b><span>' + L(d.dia_pt, d.dia_en) + '</span>' +
           '<p>' + (count
             ? count + ' ' + L('itens', 'items') + ' &middot; <span class="cfm">[CONFIRM pratos]</span>'
             : '<span class="cfm">[CONFIRM cardápio]</span>') + '</p>' +
         '</div>';
  }
  host.innerHTML = h;
}

/* hero preview chips — the two-line "what's out today" the brief asks for */
function renderHeroPreview(host) {
  if (!host) return;
  var day = BOARD[0];
  if (!day) { host.innerHTML = '<span>' + T.vazio + '</span>'; return; }
  var h = '';
  for (var g = 0; g < GRUPOS.length; g++) {
    var itens = day[GRUPOS[g].key] || [];
    if (!itens.length) continue;
    h += '<span>' + L(GRUPOS[g].pt, GRUPOS[g].en) + ': <span class="cfm">[CONFIRM]</span></span>';
  }
  host.innerHTML = h;
}

/* ==========================================================================
   8 · the empório category strips (progressive enhancement)
   --------------------------------------------------------------------------
   Every strip ships OPEN in the HTML so the stock list is readable, indexable
   and printable with scripting off. JS collapses them into an accordion, which
   is the only reason a closed state exists at all.
   ========================================================================== */
function shelfHTML(cat) {
  var h = '<div class="strip__h"><h3>' + L(cat.pt, cat.en) + '</h3>' +
          '<a class="btn btn--emp btn--sm" href="#" data-wa="' +
            L('Olá! Queria encomendar itens da categoria ' + cat.pt + '.',
              'Hello! I would like to order items from the ' + cat.en + ' category.') + '">' +
            L('Encomendar pelo WhatsApp', 'Order over WhatsApp') + '</a></div><ul class="shelf">';
  for (var i = 0; i < cat.n; i++) {
    var it = ITEM();
    h += '<li><span class="nm cfm">' + it.nome + '</span>' +
         '<span class="un">' + it.unidade + '</span>' +
         '<span class="pr">' + it.preco + '</span></li>';
  }
  return h + '</ul>';
}

function emporioInit() {
  var host = document.querySelector('[data-cats]');
  if (!host) return;
  var strips = document.querySelector('[data-strips]');

  var tiles = '';
  var body  = '';
  for (var i = 0; i < CATEGORIAS.length; i++) {
    var c = CATEGORIAS[i];
    var img = host.getAttribute('data-img-' + c.key) || '';
    tiles += '<button class="cat" type="button" data-rv aria-expanded="' + (i === 0 ? 'true' : 'false') +
             '" aria-controls="strip-' + c.key + '">' +
               '<span class="cat__i"><img src="' + img + '" loading="lazy" decoding="async" width="600" height="450" alt="' +
                 L(c.pt + ' — imagem ilustrativa de banco de imagens', c.en + ' — illustrative stock photograph') + '"></span>' +
               '<span class="cat__b"><b>' + L(c.pt, c.en) + '</b><span>' + L(c.nota_pt, c.nota_en) + '</span></span>' +
             '</button>';
    body += '<div class="strip" id="strip-' + c.key + '">' + shelfHTML(c) + '</div>';
  }
  host.innerHTML = tiles;
  if (strips) strips.innerHTML = body;

  var btns = host.querySelectorAll('.cat');
  function open(idx) {
    for (var j = 0; j < btns.length; j++) {
      var on = (j === idx);
      btns[j].setAttribute('aria-expanded', on ? 'true' : 'false');
      var s = document.getElementById('strip-' + CATEGORIAS[j].key);
      if (s) s.hidden = !on;
    }
    wireWhatsApp();
  }
  for (var k = 0; k < btns.length; k++) {
    (function (idx) {
      btns[idx].addEventListener('click', function () { open(idx); });
    })(k);
  }
  open(0);
}

/* ==========================================================================
   9 · header, mobile nav, reveals, count-up
   ========================================================================== */
function chrome() {
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var stick = function () { hdr.classList.toggle('is-stuck', window.scrollY > 12); };
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
      el.style.transitionDelay = Math.min(idx, 7) * 90 + 'ms';
      el.classList.add('in');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .1 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
}

/* Count-up. It REFUSES to animate a [CONFIRM] slot — an unverified figure
   renders as the placeholder it is, never as a zero counting up to a number
   nobody has confirmed. The numbers band on this site ships entirely empty. */
function counters() {
  var els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = parseFloat(el.getAttribute('data-count'));
      io.unobserve(el);
      if (isNaN(to)) return;                                  // <- [CONFIRM] stays put
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = pre + to + suf; return; }
      var t0 = null, dur = 1150;
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(to * eased) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: .4 });
  for (var i = 0; i < els.length; i++) io.observe(els[i]);
}

/* ==========================================================================
   10 · forms — mockup only, nothing is transmitted
   ========================================================================== */
function forms() {
  var fs = document.querySelectorAll('form[data-mock]');
  for (var i = 0; i < fs.length; i++) {
    fs[i].addEventListener('submit', function (ev) {
      ev.preventDefault();
      var need = this.querySelectorAll('[required]');
      for (var j = 0; j < need.length; j++) {
        if (!need[j].value) { alert(T.needFields); need[j].focus(); return; }
      }
      var c = this.querySelector('input[type="checkbox"][data-consent]');
      if (c && !c.checked) { alert(T.needConsent); c.focus(); return; }
      alert(T.sent);
    });
  }
}

/* ==========================================================================
   11 · LGPD — non-essential OFF by default, reject as prominent as accept
   --------------------------------------------------------------------------
   Nothing third-party loads outside the consented branch. Grão Mestre has no
   analytics or pixel today; when they add one it goes inside apply(), and
   nowhere else.
   ========================================================================== */
var CKKEY = 'gm_lgpd_v1';

function lgpd() {
  var bar = document.querySelector('.ck');
  if (!bar) return;
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(CKKEY) || 'null'); } catch (e) { saved = null; }

  function apply(pref) {
    if (pref && pref.analytics) {
      /* analytics tag would be injected HERE and only here — [CONFIRM] */
    }
    if (pref && pref.marketing) {
      /* marketing/remarketing tag would be injected HERE and only here — [CONFIRM] */
    }
  }

  function save(pref) {
    try { localStorage.setItem(CKKEY, JSON.stringify(pref)); } catch (e) {}
    bar.classList.remove('show');
    apply(pref);
  }

  if (saved) { apply(saved); } else { bar.classList.add('show'); }

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
   12 · boot
   ========================================================================== */
function boot() {
  chrome();
  heroInit();
  renderHeroPreview(document.querySelector('[data-hero-preview]'));
  renderBoard(document.querySelector('[data-board]'), BOARD[0]);
  renderWeek(document.querySelector('[data-week]'));
  emporioInit();
  wireWhatsApp();
  reveals();
  counters();
  forms();
  lgpd();

  /* smooth in-page anchors that still leave the URL usable */
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

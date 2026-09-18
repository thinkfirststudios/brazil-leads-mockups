/* ==========================================================================
   PARADISO — Mercato e Caffè — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch. Runs from
   file:// exactly as it runs from a server.

   Shared by the pt-BR tree (/) and the EN tree (/en/). Language is read off
   <html lang>. Both trees are real, separately authored pages — nothing here
   swaps text in the DOM.

   ┌──────────────────────────────────────────────────────────────────────┐
   │  ⬇  THE DATA FILE  ⬇                                                 │
   │                                                                      │
   │  Both modules — the café cardápio and the mercato shelves — are      │
   │  driven from the two arrays below, so real content can be pasted in  │
   │  during the meeting without touching markup or CSS.                  │
   │                                                                      │
   │  EVERY entry is deliberately empty. Nothing on this lead was         │
   │  recoverable: the spreadsheet carried no description at all, and     │
   │  Instagram serves a login wall. No dish, product, brand, origin,     │
   │  price, hour or CNPJ has been invented, and none should be added     │
   │  here except from what Paradiso hands over directly.                 │
   │                                                                      │
   │  Prices are strings in BRL, formatted 'R$ 00,00'. NEVER convert to   │
   │  USD. Dates anywhere on the site are DD/MM.                          │
   └──────────────────────────────────────────────────────────────────────┘
   ========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  /* ---------------------------------------------------------------------- */
  /*  CAFÉ — cardápio                                                       */
  /*  category: the accordion heading                                       */
  /*  items:    [{ name, desc, price, alerg:[], tags:[] }]                  */
  /*  Leave items EMPTY and the accordion renders an honest [CONFIRM] row   */
  /*  instead of a fabricated dish.                                         */
  /* ---------------------------------------------------------------------- */
  var CARDAPIO = [
    { key: 'espresso', pt: 'Café / Espresso',    en: 'Coffee / Espresso',   items: [] },
    { key: 'geladas',  pt: 'Bebidas geladas',    en: 'Cold drinks',         items: [] },
    { key: 'padaria',  pt: 'Padaria & doces',    en: 'Bakery & sweets',     items: [] },
    { key: 'paninis',  pt: 'Sanduíches / Paninis', en: 'Sandwiches / Paninis', items: [] },
    { key: 'massas',   pt: 'Massas',             en: 'Pasta',               items: [] },
    { key: 'dia',      pt: 'Pratos do dia',      en: 'Daily specials',      items: [] },
    { key: 'vinhos',   pt: 'Vinhos em taça',     en: 'Wine by the glass',   items: [] }
  ];

  /* ---------------------------------------------------------------------- */
  /*  MERCATO — shelves                                                     */
  /*  products: [{ name, origin, price }] — shelf-label fields.             */
  /*  NOT ONE BRAND, IMPORT, REGION OR PRODUCER IS NAMED. No "azeite da     */
  /*  Toscana", no named cheese, no DOP/IGP designation. Category           */
  /*  placeholders only, until they hand over a stock list.                 */
  /* ---------------------------------------------------------------------- */
  var MERCATO = [
    { key: 'massas',    pt: 'Massas',              en: 'Pasta',                products: [] },
    { key: 'azeites',   pt: 'Azeites & vinagres',  en: 'Oils & vinegars',      products: [] },
    { key: 'molhos',    pt: 'Molhos & conservas',  en: 'Sauces & preserves',   products: [] },
    { key: 'queijos',   pt: 'Queijos & embutidos', en: 'Cheese & charcuterie', products: [] },
    { key: 'vinhos',    pt: 'Vinhos',              en: 'Wine',                 products: [] },
    { key: 'cafes',     pt: 'Cafés em grão',       en: 'Coffee beans',         products: [] },
    { key: 'doces',     pt: 'Doces',               en: 'Sweets',               products: [] }
  ];

  /* WhatsApp: no number was captured for this lead. Not one. So no number is
     dialled. Every WhatsApp control explains why instead of ringing a
     stranger's phone — a placeholder number on a live site is worse than no
     button at all. Fill this in and every control below wakes up. */
  var WA_NUMBER = null;   /* [CONFIRM WhatsApp comercial] */

  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var CFM = '<span class="cfm">[CONFIRM]</span>';

  /* ---------------------------------------------------------------- header */
  var hdr = $('.hdr'), burger = $('.burger'), nav = $('.nav');
  window.addEventListener('scroll', function () {
    if (hdr) hdr.classList.toggle('is-stuck', window.pageYOffset > 12);
  }, { passive: true });

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var rv = $$('.rv');
  if (RM || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var i = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = Math.min(i, 6) * 95 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- hero parallax */
  var panes = $$('.hero__pane img');
  if (panes.length && !RM) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.4) {
          panes.forEach(function (im, k) {
            im.style.transform =
              'translate3d(0,' + (y * (k ? 0.13 : 0.08)).toFixed(1) + 'px,0) scale(1.1)';
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------ WhatsApp gating -
     One place decides what a WhatsApp control does. With no number captured
     the control stays visibly disabled and says why.                      */
  function waHref(msg) {
    return WA_NUMBER
      ? 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg)
      : null;
  }
  function noNumber() {
    window.alert(t(
      'Nenhum número de WhatsApp foi capturado para o Paradiso — nem um. O único canal ' +
      'confirmado é o Instagram @paradisomercatoecaffe, que serve uma barreira de login.\n\n' +
      'Esta maquete deliberadamente NÃO coloca um número no lugar: um número de exemplo num ' +
      'site publicado toca no telefone de um desconhecido.\n\n' +
      'Confirme o WhatsApp comercial e todos os botões desta página passam a funcionar.',
      'No WhatsApp number was captured for Paradiso — not one. The only confirmed channel is ' +
      'the Instagram profile @paradisomercatoecaffe, which serves a login wall.\n\n' +
      'This mockup deliberately does NOT put a stand-in number in its place: a placeholder ' +
      'number on a published site rings a stranger’s phone.\n\n' +
      'Confirm the business WhatsApp number and every button on this page wakes up.'));
  }

  function wireWA(el, msg) {
    var href = waHref(msg);
    if (href) {
      el.setAttribute('href', href);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.removeAttribute('data-unconfirmed');
    } else {
      el.setAttribute('data-unconfirmed', '');
      el.setAttribute('href', '#');
      el.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
    }
  }

  $$('[data-wa]').forEach(function (el) {
    wireWA(el, el.getAttribute('data-wa') || t('Olá! Vim pelo site do Paradiso.',
                                               'Hello! I came from the Paradiso website.'));
  });

  /* ===================================================================== */
  /*  CAFÉ — accordion cardápio, rendered from CARDAPIO                     */
  /* ===================================================================== */
  var accRoot = $('#cardapio-acc');
  if (accRoot) {
    var accHtml = '';
    CARDAPIO.forEach(function (cat, i) {
      var name = EN ? cat.en : cat.pt;
      var body;
      if (!cat.items.length) {
        body = '<div class="mrow"><b>' + t('Itens desta categoria', 'Items in this category') +
               '</b><span class="pill">R$ ' + CFM + '</span>' +
               '<p class="d">' + t(
                 'Nenhum item foi inventado. O cardápio completo desta categoria — nomes, ' +
                 'descrições, preços em R$ e alérgenos por item — é ',
                 'No item has been invented. The full menu for this category — names, ' +
                 'descriptions, prices in R$ and per-item allergens — is ') + CFM + '.</p>' +
               '<ul class="alg"><li class="gl">' +
               t('CONTÉM GLÚTEN? [CONFIRM]', 'CONTAINS GLUTEN? [CONFIRM]') +
               '</li><li>' + t('alérgenos [CONFIRM]', 'allergens [CONFIRM]') + '</li></ul></div>';
      } else {
        body = cat.items.map(function (it) {
          return '<div class="mrow"><b>' + it.name + '</b>' +
                 '<span class="pill">' + (it.price || 'R$ ' + CFM) + '</span>' +
                 '<p class="d">' + (it.desc || '') + '</p>' +
                 '<ul class="alg">' + (it.alerg || []).map(function (a) {
                   return '<li>' + a + '</li>';
                 }).join('') + '</ul>' +
                 '<a class="btn btn--sm" data-wa="' +
                 t('Olá! Queria pedir: ', 'Hello! I would like to order: ') + it.name +
                 '">' + t('Pedir no WhatsApp', 'Order on WhatsApp') + '</a></div>';
        }).join('');
      }
      accHtml +=
        '<div class="acc__i"><h3 style="margin:0">' +
        '<button class="acc__h" type="button" aria-expanded="' + (i === 0 ? 'true' : 'false') +
        '" aria-controls="acc-p-' + cat.key + '" id="acc-h-' + cat.key + '">' +
        '<span class="n">0' + (i + 1) + '</span><b>' + name + '</b><span class="cx"></span>' +
        '</button></h3>' +
        '<div class="acc__p" id="acc-p-' + cat.key + '" role="region" ' +
        'aria-labelledby="acc-h-' + cat.key + '"' + (i === 0 ? '' : ' hidden') + '>' +
        body + '</div></div>';
    });
    accRoot.innerHTML = accHtml;

    /* Progressive enhancement note: the accordion is built by JS here because
       every panel's content is [CONFIRM] and identical. Once real items land,
       render them server-side and let this only collapse them. */
    $$('.acc__h', accRoot).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        var p = document.getElementById(btn.getAttribute('aria-controls'));
        if (p) p.hidden = open;
      });
    });
    $$('[data-wa]', accRoot).forEach(function (el) { wireWA(el, el.getAttribute('data-wa')); });
  }

  /* ===================================================================== */
  /*  MERCATO — category tiles opening shelf-label product strips           */
  /* ===================================================================== */
  var tilesRoot = $('#mercato-tiles');
  if (tilesRoot) {
    $$('.tile__b', tilesRoot).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-cat');
        var open = btn.getAttribute('aria-expanded') === 'true';
        $$('.tile__b', tilesRoot).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
        $$('.shelf', tilesRoot).forEach(function (s) { s.hidden = true; });
        if (!open) {
          btn.setAttribute('aria-expanded', 'true');
          var shelf = document.getElementById('shelf-' + key);
          if (shelf) {
            shelf.hidden = false;
            fillShelf(shelf, key);
          }
        }
      });
    });
  }

  function fillShelf(shelf, key) {
    if (shelf.getAttribute('data-filled') === 'yes') return;
    var cat = null;
    MERCATO.forEach(function (c) { if (c.key === key) cat = c; });
    if (!cat) return;
    var g = $('.shelf__g', shelf);
    if (!g) return;
    var html = '';
    if (!cat.products.length) {
      for (var i = 0; i < 4; i++) {
        html += '<li class="lbl"><b>' + t('Produto ', 'Product ') + (i + 1) + ' [CONFIRM]</b>' +
                '<span class="org">' +
                t('Origem e produtor: [CONFIRM] — nenhuma marca, região ou denominação foi nomeada',
                  'Origin and producer: [CONFIRM] — no brand, region or designation has been named') +
                '</span><span class="pr">R$ 00,00 [CONFIRM]</span></li>';
      }
    } else {
      html = cat.products.map(function (p) {
        return '<li class="lbl"><b>' + p.name + '</b>' +
               '<span class="org">' + (p.origin || '') + '</span>' +
               '<span class="pr">' + (p.price || 'R$ 00,00 [CONFIRM]') + '</span></li>';
      }).join('');
    }
    g.innerHTML = html;
    shelf.setAttribute('data-filled', 'yes');
    $$('[data-wa]', shelf).forEach(function (el) { wireWA(el, el.getAttribute('data-wa')); });
  }

  /* ------------------------------------------------------------ the rail */
  $$('.railctl').forEach(function (ctl) {
    var rail = document.getElementById(ctl.getAttribute('data-rail'));
    if (!rail) return;
    $$('button', ctl).forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.getAttribute('data-dir') === 'next' ? 1 : -1;
        var step = rail.firstElementChild ? rail.firstElementChild.offsetWidth + 18 : 260;
        rail.scrollBy({ left: dir * step, behavior: RM ? 'auto' : 'smooth' });
      });
    });
  });

  /* ------------------------------------------------------- generic forms -
     Every form composes a message and hands it to WhatsApp. Nothing is
     posted anywhere, and with no number captured nothing is dialled either. */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Paradiso', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        lines.push((lab ? lab.textContent.trim() : f.name) + ': ' + (f.value || '—'));
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Sent from the site form — demonstration mockup.)'));
      var href = waHref(lines.join('\n'));
      if (!href) { noNumber(); return; }
      window.open(href, '_blank', 'noopener');
    });
  });

  /* ------------------------------------------------------- cookie consent -
     LGPD art. 7 / 8: non-essential OFF by default, reject as prominent as
     accept, granular. Third-party tags load only inside the consented
     branch — and none is wired in this mockup at all.                     */
  var ck = $('#ck');
  var CK_KEY = 'paradiso.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function writeConsent(o) {
    try { window.localStorage.setItem(CK_KEY, JSON.stringify(o)); } catch (e) {}
    if (ck) ck.classList.remove('is-on');
    if (o && o.analytics) { /* consented tags would be injected here, nowhere else */ }
  }
  if (ck) {
    if (!readConsent()) window.setTimeout(function () { ck.classList.add('is-on'); }, 900);
    var acc = $('#ck-accept'), rej = $('#ck-reject'), sav = $('#ck-save');
    if (acc) acc.addEventListener('click', function () {
      writeConsent({ essential: true, analytics: true, marketing: true, ts: Date.now() });
    });
    if (rej) rej.addEventListener('click', function () {
      writeConsent({ essential: true, analytics: false, marketing: false, ts: Date.now() });
    });
    if (sav) sav.addEventListener('click', function () {
      writeConsent({
        essential: true,
        analytics: !!($('#ck-an') && $('#ck-an').checked),
        marketing: !!($('#ck-mk') && $('#ck-mk').checked),
        ts: Date.now()
      });
    });
  }

  /* -------------------------------------------------------- year in footer */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

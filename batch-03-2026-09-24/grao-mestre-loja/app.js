/* Grao Mestre - loja. Maquete especulativa ThinkFirst Studios.

   CATALOGO ILUSTRATIVO. Nenhum produto, peso ou preco veio da Grao Mestre:
   sao itens plausiveis de um emporio de produtos naturais brasileiro,
   escritos para esta maquete.

   O formato do array e o da Storefront API do Shopify de proposito - id,
   title, priceCents, compareAtCents, availableForSale, tags, options - para
   que a troca por dados reais seja um adaptador, nao uma reescrita. Em
   producao a propria Grao Mestre cadastra produto, foto, preco, estoque e
   promocao no Shopify, e este array some.

   Nada aqui cobra, cria pedido ou guarda dado pessoal. O carrinho vive no
   localStorage do proprio navegador para sobreviver a navegacao entre
   paginas, e e isso que a politica de privacidade descreve. */
(function () {
  'use strict';

  var QUIET = window.matchMedia('(prefers-reduced-motion: reduce)');
  var quiet = function () { return QUIET.matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var CATS = {
    graos: 'Grãos', castanhas: 'Castanhas', temperos: 'Temperos',
    chas: 'Chás', suplementos: 'Suplementos', congelados: 'Congelados'
  };

  /* Ladrilhos de produto, desenhados na hora. Ver gm_tiles.py para o porque.
     A fotografia real dos produtos e um entregavel do cliente. */
  var CAT_TONE = {
    graos: ['#e8dcc2', '#cfbf9d'],
    castanhas: ['#e9dcc8', '#d2bb98'],
    temperos: ['#eddcc6', '#d8b894'],
    chas: ['#e0e6d6', '#bfcdab'],
    suplementos: ['#e2e4dc', '#c2c7b6'],
    congelados: ['#dce6ec', '#b9cdd9']
  };
  var CAT_ICON = {
    graos: '\u{1F33E}', castanhas: '\u{1F330}',
    temperos: '\u{1F336}\uFE0F', chas: '\u{1F375}',
    suplementos: '\u{1F9C3}', congelados: '\u2744\uFE0F'
  };

  var PRODUCTS = [
    { id: 'gm-01', cat: 'graos', title: 'Arroz integral', unit: '1 kg', price: 2190, stock: true,
      opts: ['500 g', '1 kg', '2 kg'], desc: 'Arroz integral vendido a granel, pesado na loja. Fornecedor e safra a confirmar.' },
    { id: 'gm-02', cat: 'graos', title: 'Feijão preto', unit: '1 kg', price: 1890, stock: true,
      opts: ['500 g', '1 kg'], desc: 'Feijão preto de produção familiar. Origem a confirmar.' },
    { id: 'gm-03', cat: 'graos', title: 'Grão-de-bico', unit: '500 g', price: 2490, compare: 2990, stock: true,
      opts: ['500 g', '1 kg'], desc: 'Grão-de-bico selecionado, ideal para homus e saladas.' },
    { id: 'gm-04', cat: 'graos', title: 'Quinoa em grãos', unit: '250 g', price: 3290, stock: true,
      opts: ['250 g', '500 g'], desc: 'Quinoa branca em grãos, lavada e pronta para cozinhar.' },
    { id: 'gm-05', cat: 'graos', title: 'Aveia em flocos', unit: '500 g', price: 1290, stock: true,
      opts: ['500 g', '1 kg'], desc: 'Aveia em flocos grossos, sem açúcar adicionado.' },
    { id: 'gm-06', cat: 'graos', title: 'Farinha de trigo integral', unit: '1 kg', price: 1490, stock: false,
      opts: ['1 kg'], desc: 'Farinha integral moída em moinho de pedra. Moinho a confirmar.' },

    { id: 'gm-07', cat: 'castanhas', title: 'Castanha-do-pará', unit: '250 g', price: 3990, stock: true,
      opts: ['250 g', '500 g'], desc: 'Castanha-do-pará inteira, comprada em volume e pesada na loja.' },
    { id: 'gm-08', cat: 'castanhas', title: 'Castanha de caju', unit: '250 g', price: 4490, compare: 5290, stock: true,
      opts: ['250 g', '500 g'], desc: 'Castanha de caju torrada sem sal.' },
    { id: 'gm-09', cat: 'castanhas', title: 'Amêndoas cruas', unit: '250 g', price: 3790, stock: true,
      opts: ['250 g', '500 g'], desc: 'Amêndoas cruas com pele, sem sal.' },
    { id: 'gm-10', cat: 'castanhas', title: 'Nozes em metades', unit: '200 g', price: 3490, stock: true,
      opts: ['200 g', '400 g'], desc: 'Nozes em metades, selecionadas.' },

    { id: 'gm-11', cat: 'temperos', title: 'Páprica defumada', unit: '100 g', price: 1690, stock: true,
      opts: ['50 g', '100 g'], desc: 'Páprica defumada moída na hora.' },
    { id: 'gm-12', cat: 'temperos', title: 'Cúrcuma em pó', unit: '100 g', price: 1490, stock: true,
      opts: ['50 g', '100 g'], desc: 'Cúrcuma em pó, sem corante e sem aditivo.' },
    { id: 'gm-13', cat: 'temperos', title: 'Mix de ervas finas', unit: '60 g', price: 1890, stock: true,
      opts: ['60 g'], desc: 'Mistura de ervas desidratadas para molhos e assados.' },
    { id: 'gm-14', cat: 'temperos', title: 'Sal marinho grosso', unit: '500 g', price: 990, stock: true,
      opts: ['500 g', '1 kg'], desc: 'Sal marinho grosso, sem aditivo.' },

    { id: 'gm-15', cat: 'chas', title: 'Camomila em flores', unit: '60 g', price: 1990, stock: true,
      opts: ['30 g', '60 g'], desc: 'Camomila em flores inteiras, a granel.' },
    { id: 'gm-16', cat: 'chas', title: 'Hibisco desidratado', unit: '80 g', price: 1790, stock: true,
      opts: ['40 g', '80 g'], desc: 'Hibisco em pétalas inteiras.' },
    { id: 'gm-17', cat: 'chas', title: 'Erva-cidreira', unit: '50 g', price: 1590, stock: false,
      opts: ['50 g'], desc: 'Erva-cidreira desidratada, colhida e seca à sombra.' },
    { id: 'gm-18', cat: 'chas', title: 'Chá verde em folhas', unit: '80 g', price: 2490, stock: true,
      opts: ['40 g', '80 g'], desc: 'Chá verde em folhas soltas.' },

    { id: 'gm-19', cat: 'suplementos', title: 'Proteína vegetal em pó', unit: '900 g', price: 12900, compare: 14900, stock: true,
      opts: ['450 g', '900 g'], desc: 'Proteína de ervilha e arroz, sem sabor. Marca e composição a confirmar.' },
    { id: 'gm-20', cat: 'suplementos', title: 'Pasta de amendoim integral', unit: '450 g', price: 3290, stock: true,
      opts: ['450 g', '1 kg'], desc: 'Amendoim torrado e moído, sem açúcar e sem óleo adicionado.' },
    { id: 'gm-21', cat: 'suplementos', title: 'Óleo de coco extravirgem', unit: '200 ml', price: 3490, stock: true,
      opts: ['200 ml', '500 ml'], desc: 'Óleo de coco prensado a frio.' },

    { id: 'gm-22', cat: 'congelados', title: 'Marmita vegana do dia', unit: '400 g', price: 2790, stock: true,
      opts: ['400 g'], desc: 'Refeição pronta congelada, montada na cozinha do buffet. Cardápio da semana a confirmar.' },
    { id: 'gm-23', cat: 'congelados', title: 'Marmita fit de frango', unit: '400 g', price: 2990, stock: true,
      opts: ['400 g'], desc: 'Refeição pronta congelada com frango, legumes e arroz integral.' },
    { id: 'gm-24', cat: 'congelados', title: 'Sopa de legumes congelada', unit: '500 ml', price: 2290, compare: 2690, stock: true,
      opts: ['500 ml'], desc: 'Sopa de legumes da estação, congelada em porção individual.' },
    { id: 'gm-25', cat: 'congelados', title: 'Pão de fermentação natural', unit: '500 g', price: 2590, stock: false,
      opts: ['500 g'], desc: 'Pão de fermentação natural, congelado após assado. Padaria parceira a confirmar.' }
  ];

  /* ------------------------------------------------------------ utilidades */
  function money(cents) {
    return 'R$ ' + (cents / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function imgFor(p) {
    var tone = CAT_TONE[p.cat] || ['#e6e0d2', '#ccc4b0'];
    var icon = CAT_ICON[p.cat] || '';
    var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var w = p.title.split(' ');
    var l1 = esc(w.slice(0, 2).join(' '));
    var l2 = esc(w.slice(2).join(' '));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + tone[0] + '"/>' +
      '<stop offset="1" stop-color="' + tone[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="400" fill="url(#g)"/>' +
      '<text x="200" y="168" font-size="78" text-anchor="middle">' + icon + '</text>' +
      '<text x="200" y="250" font-family="Georgia,serif" font-size="27" fill="#3a3327" text-anchor="middle">' + l1 + '</text>' +
      '<text x="200" y="283" font-family="Georgia,serif" font-size="27" fill="#3a3327" text-anchor="middle">' + l2 + '</text>' +
      '<text x="200" y="338" font-family="Inter,sans-serif" font-size="14" letter-spacing="2.5" fill="#6b6255" text-anchor="middle">FOTO DO PRODUTO</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) { if (PRODUCTS[i].id === id) { return PRODUCTS[i]; } }
    return null;
  }
  function catName(c) { return CATS[c] || c; }

  /* ------------------------------------------------------------- carrinho */
  var KEY = 'gm-cart';
  var cart = [];
  try { cart = JSON.parse(window.localStorage.getItem(KEY) || '[]'); } catch (e) { cart = []; }
  if (!Array.isArray(cart)) { cart = []; }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* modo privado */ }
  }
  function units() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() {
    return cart.reduce(function (n, l) {
      var p = byId(l.id);
      return p ? n + p.price * l.qty : n;
    }, 0);
  }
  function add(id, qty, opt) {
    var p = byId(id);
    if (!p || !p.stock) { return; }
    var key = id + '|' + (opt || p.unit);
    var line = null;
    cart.forEach(function (l) { if (l.key === key) { line = l; } });
    if (line) { line.qty += qty; } else { cart.push({ key: key, id: id, opt: opt || p.unit, qty: qty }); }
    save(); paint(); openDrawer();
  }
  function setQty(key, qty) {
    cart = cart.filter(function (l) {
      if (l.key !== key) { return true; }
      l.qty = qty;
      return qty > 0;
    });
    save(); paint();
  }

  /* ------------------------------------------------------------- pintura */
  function cardHTML(p, i) {
    var sale = p.compare && p.compare > p.price;
    var badge = !p.stock ? '<span class="badge badge--out">Esgotado</span>'
      : (sale ? '<span class="badge badge--sale">Promoção</span>' : '');
    return '<article class="card' + (p.stock ? '' : ' is-out') + '" style="--i:' + (i || 0) + '">' +
      '<a class="card__media" href="produto.html?id=' + p.id + '">' +
        '<img src="' + imgFor(p) + '" alt="Espaço reservado para a foto de ' + p.title + '" loading="lazy" decoding="async" width="600" height="600">' +
        badge +
      '</a>' +
      '<div class="card__body">' +
        '<p class="card__cat">' + catName(p.cat) + '</p>' +
        '<h3 class="card__name"><a href="produto.html?id=' + p.id + '">' + p.title + '</a></h3>' +
        '<p class="card__unit">' + p.unit + '</p>' +
        '<div class="card__foot">' +
          '<p class="card__price"><span class="price">' + money(p.price) + '</span>' +
            (sale ? ' <span class="price price--old">' + money(p.compare) + '</span>' : '') + '</p>' +
          (p.stock
            ? '<button class="card__add" type="button" data-add="' + p.id + '" aria-label="Adicionar ' + p.title + ' ao carrinho">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>'
            : '<span class="card__outmsg">Sem estoque</span>') +
        '</div>' +
      '</div></article>';
  }

  var state = { cat: 'todos', search: '' };

  function listFor(kind) {
    if (kind === 'destaques') {
      return PRODUCTS.filter(function (p) { return p.compare || p.cat === 'congelados'; }).slice(0, 4);
    }
    if (kind === 'relacionados') {
      var cur = current();
      return PRODUCTS.filter(function (p) {
        return cur && p.cat === cur.cat && p.id !== cur.id && p.stock;
      }).slice(0, 4);
    }
    return PRODUCTS.filter(function (p) {
      if (state.cat !== 'todos' && p.cat !== state.cat) { return false; }
      if (state.search && (p.title + ' ' + p.desc).toLowerCase().indexOf(state.search.toLowerCase()) === -1) { return false; }
      return true;
    });
  }

  function paintGrids() {
    $$('[data-grid]').forEach(function (g) {
      var list = listFor(g.getAttribute('data-grid'));
      var lim = parseInt(g.getAttribute('data-limit'), 10);
      if (lim) { list = list.slice(0, lim); }
      g.innerHTML = list.length
        ? list.map(function (p, i) { return cardHTML(p, i); }).join('')
        : '<p class="empty">Nenhum produto encontrado. <button class="btn btn--ghost btn--sm" type="button" data-clear>Limpar filtros</button></p>';
    });
    var c = $('[data-count]');
    if (c) {
      var n = listFor('loja').length;
      c.textContent = n + (n === 1 ? ' produto' : ' produtos');
    }
  }

  function paintCart() {
    var n = units();
    $$('[data-cart-count]').forEach(function (el) {
      var was = el.textContent;
      el.textContent = String(n);
      el.hidden = n === 0;
      if (was !== String(n) && n > 0 && !quiet()) {
        el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump');
      }
    });
    $$('[data-subtotal]').forEach(function (el) { el.textContent = money(subtotal()); });

    var rows = cart.map(function (l) {
      var p = byId(l.id);
      if (!p) { return ''; }
      return '<div class="ci">' +
        '<img src="' + imgFor(p) + '" alt="" width="64" height="64" loading="lazy">' +
        '<div><p class="ci__n">' + p.title + '</p><p class="ci__d">' + l.opt + '</p>' +
        '<div class="ci__qty">' +
          '<button type="button" data-line="' + l.key + '" data-step="-1" aria-label="Diminuir">−</button>' +
          '<span>' + l.qty + '</span>' +
          '<button type="button" data-line="' + l.key + '" data-step="1" aria-label="Aumentar">+</button>' +
        '</div></div>' +
        '<p class="ci__p price">' + money(p.price * l.qty) + '</p></div>';
    }).join('');

    var empty = '<p class="empty">Seu carrinho está vazio. <a class="link-quiet" href="loja.html">Ver a loja</a></p>';
    var d = $('[data-cart-list]');
    if (d) { d.innerHTML = cart.length ? rows : empty; }
    var pg = $('[data-cart-page]');
    if (pg) { pg.innerHTML = cart.length ? rows : empty; }
  }

  function paint() { paintGrids(); paintCart(); }

  /* --------------------------------------------------------------- gaveta */
  var drawer = $('[data-drawer]'), scrim = $('[data-scrim]');
  function openDrawer() {
    if (!drawer) { return; }
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (scrim) { scrim.classList.add('is-on'); }
  }
  function closeDrawer() {
    if (!drawer) { return; }
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (scrim) { scrim.classList.remove('is-on'); }
  }
  $$('[data-cart-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  if (scrim) { scrim.addEventListener('click', closeDrawer); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDrawer(); } });

  /* ------------------------------------------------------ pagina de produto */
  function current() {
    var m = window.location.search.match(/[?&]id=([^&]+)/);
    var p = m ? byId(decodeURIComponent(m[1])) : null;
    return p || PRODUCTS[0];
  }

  function paintProduct() {
    var root = $('[data-produto]');
    if (!root) { return; }
    var p = current();
    var sale = p.compare && p.compare > p.price;
    document.title = p.title + ' — Grão Mestre';
    $('[data-p-crumb]').textContent = p.title;
    $('[data-p-cat]').textContent = catName(p.cat);
    $('[data-p-name]').textContent = p.title;
    $('[data-p-price]').textContent = money(p.price);
    var old = $('[data-p-old]');
    old.hidden = !sale;
    if (sale) { old.textContent = money(p.compare); }
    $('[data-p-unit]').textContent = p.unit;
    $('[data-p-desc]').textContent = p.desc;
    var im = $('[data-p-img]');
    im.src = imgFor(p);
    im.alt = catName(p.cat) + ' — foto ilustrativa de banco de imagens';
    $('[data-p-thumbs]').innerHTML = ['600', '400', '300'].map(function (w, i) {
      return '<span class="pdp__thumb' + (i === 0 ? ' is-on' : '') + '"><img src="' + imgFor(p) +
        '" alt="Miniatura da foto do produto" width="120" height="120" loading="lazy"></span>';
    }).join('') + '<span class="pdp__thumbnote">Fotos reais do produto: cliente fornecerá</span>';
    $('[data-p-weight]').innerHTML = p.opts.map(function (o) {
      return '<option' + (o === p.unit ? ' selected' : '') + '>' + o + '</option>';
    }).join('');
    $('[data-p-entrega]').textContent = p.cat === 'congelados'
      ? 'Entrega local ou retirada — congelado não vai por transportadora'
      : 'Entrega local ou retirada na loja';
    var stockEl = $('[data-p-stock]');
    var addBtn = $('[data-p-add]');
    if (p.stock) {
      stockEl.textContent = 'Disponível hoje. Estoque real vem do Shopify.';
      stockEl.className = 'pdp__stock';
    } else {
      stockEl.textContent = 'Esgotado no momento.';
      stockEl.className = 'pdp__stock is-out';
      addBtn.disabled = true;
      addBtn.textContent = 'Esgotado';
    }
    var qty = 1;
    var out = $('[data-qty]');
    $$('[data-q]').forEach(function (b) {
      b.addEventListener('click', function () {
        qty = Math.max(1, qty + parseInt(b.getAttribute('data-q'), 10));
        out.textContent = String(qty);
      });
    });
    addBtn.addEventListener('click', function () {
      if (!p.stock) { return; }
      add(p.id, qty, $('[data-p-weight]').value);
    });
  }

  /* ---------------------------------------------------------------- eventos */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-add]');
    if (a) { add(a.getAttribute('data-add'), 1); return; }

    var line = e.target.closest('[data-line]');
    if (line) {
      var key = line.getAttribute('data-line');
      var step = parseInt(line.getAttribute('data-step'), 10);
      cart.forEach(function (l) { if (l.key === key) { setQty(key, l.qty + step); } });
      return;
    }

    var chip = e.target.closest('[data-cat]');
    if (chip) {
      state.cat = chip.getAttribute('data-cat');
      $$('[data-cat]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-cat') === state.cat ? 'true' : 'false');
      });
      paintGrids();
      return;
    }

    if (e.target.closest('[data-clear]')) {
      state.cat = 'todos'; state.search = '';
      var si = $('[data-search]'); if (si) { si.value = ''; }
      $$('[data-cat]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-cat') === 'todos' ? 'true' : 'false');
      });
      paintGrids();
      return;
    }

    var co = e.target.closest('[data-checkout]');
    if (co) {
      var note = $('[data-checkout-note]');
      if (note) {
        note.innerHTML = '<strong>Fim da maquete.</strong> Em produção, daqui o cliente segue para o ' +
          'checkout seguro da plataforma, com Pix ou cartão. Nada aqui cobra, guarda dados ou cria pedido.';
        note.classList.add('is-loud');
      }
      co.disabled = true;
      co.textContent = 'Checkout da plataforma — fora desta maquete';
    }
  });

  var s = $('[data-search]');
  if (s) {
    s.addEventListener('input', function () { state.search = s.value.trim(); paintGrids(); });
  }

  /* ---------------------------------------------------------------- chrome */
  var burger = $('[data-burger]'), sheet = $('[data-sheet]');
  if (burger && sheet) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheet.hidden = !open;
    });
  }
  var hdr = $('[data-header]');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 20); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var reveals = $$('[data-reveal]');
  if (!reveals.length) { /* nada */ }
  else if (quiet() || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      var n = 0;
      es.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        en.target.style.setProperty('--d', (n * 80) + 'ms');
        n += 1;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var bar = $('[data-consent]');
  if (bar) {
    var CK = 'gm-cookie';
    var stored = null;
    try { stored = window.localStorage.getItem(CK); } catch (e) { stored = null; }
    if (!stored) { window.setTimeout(function () { bar.hidden = false; }, 800); }
    var close = function (v) {
      try { window.localStorage.setItem(CK, v); } catch (e) { /* modo privado */ }
      bar.hidden = true;
    };
    var yes = $('[data-consent-yes]', bar), no = $('[data-consent-no]', bar);
    if (yes) { yes.addEventListener('click', function () { close('accept'); }); }
    if (no) { no.addEventListener('click', function () { close('decline'); }); }
  }

  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  paintProduct();
  paint();
})();

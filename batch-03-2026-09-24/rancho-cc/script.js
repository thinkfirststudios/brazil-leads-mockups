/* Rancho | Compras Coletivas — maquete especulativa ThinkFirst Studios.

   O catalogo abaixo e ILUSTRATIVO. Nenhum produto, preco ou peso aqui foi
   copiado do rancho.cc: sao itens plausiveis de um mercado de produtos
   naturais brasileiro, escritos para a maquete. Em producao este array some e
   os mesmos campos passam a vir da Storefront API do Shopify — por isso o
   formato ja e o do Shopify: id, title, price em centavos, image, tags.

   Nada aqui trata pagamento, conta de cliente ou pedido de verdade. */
(function () {
  'use strict';

  var QUIET = window.matchMedia('(prefers-reduced-motion: reduce)');
  var quiet = function () { return QUIET.matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* =============================================================== dados */
  /* categorias: as oito que a propria Rancho publica em rancho.cc, mais
     "Congelados", que o site atual nao lista — [CONFIRM se ha congelados] */
  var CATEGORIES = [
    { id: 'granel', name: 'Granel', icon: '\u{1F33E}' },
    { id: 'mercearia', name: 'Mercearia', icon: '\u{1F9FA}' },
    { id: 'laticinios', name: 'Laticínios e frios', icon: '\u{1F9C0}' },
    { id: 'hortifruti', name: 'Hortifrúti e fungos', icon: '\u{1F344}' },
    { id: 'doces', name: 'Doces e geleias', icon: '\u{1F36F}' },
    { id: 'bebidas', name: 'Bebidas', icon: '\u{1F375}' },
    { id: 'limpeza', name: 'Limpeza e higiene', icon: '\u{1F9F4}' },
    { id: 'cosmetica', name: 'Cosmética e medicinais', icon: '\u{1F33F}' },
    { id: 'congelados', name: 'Congelados', icon: '❄️' }
  ];

  /* Ladrilhos de produto: SVG gerado na hora, nao fotografia.
     Tentamos fotos de banco e varias vinham com o assunto errado - brocolis
     para pasta de amendoim, tenis para sabao de coco, marca de terceiros a
     vista em duas. Num catalogo que ja e ilustrativo, um ladrilho honesto
     vale mais que uma foto bonita do produto errado. A fotografia real dos
     produtos e um entregavel do projeto, nao um detalhe da maquete. */
  var CAT_TONE = {
    granel: ['#e8dcc2', '#cfbf9d'],
    mercearia: ['#e4ded0', '#c9c0aa'],
    laticinios: ['#efe7d8', '#d8ccb6'],
    hortifruti: ['#dde7d2', '#bed0ae'],
    doces: ['#f0e0c8', '#dcc09a'],
    bebidas: ['#e3dccb', '#c6bba3'],
    limpeza: ['#dbe4e6', '#bacbd0'],
    cosmetica: ['#e2e6da', '#c3cdb8'],
    congelados: ['#dce6ec', '#b9cdd9']
  };

  /* price = centavos. entrega: 'local' (perecivel/congelado) | 'nacional' */
  var PRODUCTS = [
    { id: 'gr-01', title: 'Arroz integral agroecológico', cat: 'granel', price: 2190, unit: '1 kg',
      img: '1586201375761-83865001e31c', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Arroz integral de cultivo agroecológico, embalado a granel na loja. Fornecedor e safra [CONFIRM].' },
    { id: 'gr-02', title: 'Feijão preto orgânico', cat: 'granel', price: 1890, unit: '1 kg',
      img: '1615485500704-8e990f9900f7', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Feijão preto de produção familiar. Certificação orgânica [CONFIRM certificação].' },
    { id: 'gr-03', title: 'Castanha-do-pará', cat: 'granel', price: 4490, unit: '500 g',
      img: '1447078806655-40579c2520d6', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Castanha-do-pará inteira, comprada em volume pelo grupo. Origem [CONFIRM].' },
    { id: 'gr-04', title: 'Farinha de trigo integral', cat: 'granel', price: 1290, unit: '1 kg',
      img: '1509440159596-0249088772ff', entrega: 'nacional', tags: ['vegano'],
      desc: 'Farinha integral moída em moinho de pedra. Moinho e data de moagem [CONFIRM].' },
    { id: 'me-01', title: 'Azeite extravirgem', cat: 'mercearia', price: 6990, unit: '500 ml',
      img: '1474979266404-7eaacbcd87c5', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Azeite de oliva extravirgem, acidez e safra [CONFIRM].' },
    { id: 'me-02', title: 'Molho de tomate artesanal', cat: 'mercearia', price: 2450, unit: '340 g',
      img: '1472476443507-c7a5948772fc', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Molho de tomate sem conservantes, produção artesanal. Produtor [CONFIRM].' },
    { id: 'me-03', title: 'Pasta de amendoim integral', cat: 'mercearia', price: 3290, unit: '450 g',
      img: '1615485290382-441e4d049cb5', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Amendoim torrado e moído, sem açúcar e sem óleo adicionado.' },
    { id: 'la-01', title: 'Queijo colonial curado', cat: 'laticinios', price: 5890, unit: '~400 g',
      img: '1452195100486-9cc805987862', entrega: 'local', tags: ['perecivel'],
      desc: 'Queijo de produção colonial, maturação [CONFIRM]. Item refrigerado: sai apenas na entrega local.' },
    { id: 'la-02', title: 'Iogurte natural integral', cat: 'laticinios', price: 1690, unit: '500 g',
      img: '1488477181946-6428a0291777', entrega: 'local', tags: ['perecivel'],
      desc: 'Iogurte natural sem açúcar, fermentação artesanal. Refrigerado.' },
    { id: 'ho-01', title: 'Cesta de folhas da semana', cat: 'hortifruti', price: 3500, unit: 'cesta',
      img: '1540420773420-3366772f4999', entrega: 'local', tags: ['perecivel', 'vegano'],
      desc: 'Composição varia conforme a colheita da semana. Itens da cesta [CONFIRM].' },
    { id: 'ho-02', title: 'Cogumelos shimeji frescos', cat: 'hortifruti', price: 2290, unit: '200 g',
      img: '1518977676601-b53f82aba655', entrega: 'local', tags: ['perecivel', 'vegano'],
      desc: 'Shimeji fresco de produtor local. Produtor [CONFIRM].' },
    { id: 'ho-03', title: 'Frutas da estação', cat: 'hortifruti', price: 1290, unit: '~1,5 kg',
      img: '1559181567-c3190ca9959b', entrega: 'local', tags: ['perecivel', 'vegano', 'sem-gluten'],
      desc: 'Seleção de frutas conforme a colheita da semana. Composição e certificação [CONFIRM certificação].' },
    { id: 'do-01', title: 'Mel silvestre', cat: 'doces', price: 3790, unit: '500 g',
      img: '1587049352846-4a222e784d38', entrega: 'nacional', tags: ['sem-gluten'],
      desc: 'Mel de florada silvestre, envasado pelo apicultor. Apiário [CONFIRM].' },
    { id: 'do-02', title: 'Geleia de amora sem açúcar', cat: 'doces', price: 2890, unit: '240 g',
      img: '1600788907416-456578634209', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Geleia adoçada apenas com a própria fruta.' },
    { id: 'be-01', title: 'Chá de hibisco', cat: 'bebidas', price: 1990, unit: '80 g',
      img: '1597481499750-3e6b22637e12', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Hibisco desidratado em pétalas inteiras.' },
    { id: 'be-02', title: 'Café torrado em grãos', cat: 'bebidas', price: 4290, unit: '500 g',
      img: '1447933601403-0c6688de566e', entrega: 'nacional', tags: ['vegano', 'sem-gluten'],
      desc: 'Café de produção familiar, torra média. Região e lote [CONFIRM].' },
    { id: 'li-01', title: 'Sabão de coco em barra', cat: 'limpeza', price: 990, unit: '200 g',
      img: '1585232004423-244e0e6904e3', entrega: 'nacional', tags: ['biodegradavel'],
      desc: 'Sabão de coco biodegradável, sem perfume sintético.' },
    { id: 'li-02', title: 'Detergente biodegradável', cat: 'limpeza', price: 1890, unit: '500 ml',
      img: '1610557892470-55d9e80c0bce', entrega: 'nacional', tags: ['biodegradavel', 'vegano'],
      desc: 'Detergente de base vegetal. Composição completa [CONFIRM rótulo].' },
    { id: 'co-01', title: 'Óleo de coco extravirgem', cat: 'cosmetica', price: 3490, unit: '200 ml',
      img: '1590301157890-4810ed352733', entrega: 'nacional', tags: ['vegano'],
      desc: 'Óleo de coco prensado a frio, uso alimentar e cosmético.' },
    { id: 'co-02', title: 'Argila verde em pó', cat: 'cosmetica', price: 2190, unit: '150 g',
      img: '1556228578-8c89e6adf883', entrega: 'nacional', tags: ['vegano'],
      desc: 'Argila verde peneirada. ⚠️ Nenhuma indicação terapêutica é feita aqui — ver nota de conformidade.' },
    { id: 'cg-01', title: 'Marmita vegana congelada', cat: 'congelados', price: 2790, unit: '400 g',
      img: '1546069901-ba9599a7e63c', entrega: 'local', tags: ['congelado', 'vegano'],
      desc: 'Refeição pronta congelada. Cardápio da semana [CONFIRM]. Congelados saem apenas na entrega local.' },
    { id: 'cg-02', title: 'Pão de fermentação natural congelado', cat: 'congelados', price: 2490, unit: '500 g',
      img: '1608198093002-ad4e005484ec', entrega: 'local', tags: ['congelado', 'vegano'],
      desc: 'Pão de fermentação natural, congelado após assado. Padaria parceira [CONFIRM].' },
    { id: 'cg-03', title: 'Polpa de açaí congelada', cat: 'congelados', price: 1990, unit: '400 g',
      img: '1553530666-ba11a7da3888', entrega: 'local', tags: ['congelado', 'vegano', 'sem-gluten'],
      desc: 'Polpa de açaí sem xarope. Origem [CONFIRM].' }
  ];

  var TAG_LABELS = {
    'vegano': 'Vegano', 'sem-gluten': 'Sem glúten', 'congelado': 'Congelado',
    'perecivel': 'Perecível', 'biodegradavel': 'Biodegradável'
  };

  /* bairros com entrega local — os que a Rancho ja atende hoje [CONFIRM lista atual].
     A maquete decide pelo prefixo do CEP; em producao isto vira consulta real. */
  var CEP_LOCAL_PREFIX = ['8800', '8801', '8802', '8803', '8804', '8805', '8806'];

  var money = function (cents) {
    return 'R$ ' + (cents / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  function tile(p) {
    var tone = CAT_TONE[p.cat] || ['#e6e0d2', '#ccc4b0'];
    var icon = '';
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === p.cat) { icon = CATEGORIES[i].icon; }
    }
    var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var words = p.title.split(' ');
    var l1 = esc(words.slice(0, 2).join(' '));
    var l2 = esc(words.slice(2).join(' '));
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + tone[0] + '"/>' +
      '<stop offset="1" stop-color="' + tone[1] + '"/></linearGradient></defs>' +
      '<rect width="400" height="400" fill="url(#g)"/>' +
      '<text x="200" y="170" font-size="84" text-anchor="middle">' + icon + '</text>' +
      '<text x="200" y="252" font-family="Georgia,serif" font-size="26" fill="#3b3428" text-anchor="middle">' + l1 + '</text>' +
      '<text x="200" y="284" font-family="Georgia,serif" font-size="26" fill="#3b3428" text-anchor="middle">' + l2 + '</text>' +
      '<text x="200" y="338" font-family="Inter,sans-serif" font-size="14" letter-spacing="2.5" fill="#6a6156" text-anchor="middle">FOTO DO PRODUTO</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  var imgUrl = function (p) { return tile(p); };

  /* =============================================================== estado */
  var state = { cat: 'todos', tags: [], search: '', cart: [] };

  /* =============================================================== catálogo */
  var grid = $('[data-grid]');
  var countEl = $('[data-count]');

  var matches = function (p) {
    if (state.cat !== 'todos' && p.cat !== state.cat) { return false; }
    if (state.tags.length && !state.tags.every(function (t) { return p.tags.indexOf(t) > -1; })) { return false; }
    if (state.search) {
      var hay = (p.title + ' ' + p.desc + ' ' + p.unit).toLowerCase();
      if (hay.indexOf(state.search.toLowerCase()) === -1) { return false; }
    }
    return true;
  };

  var cardHTML = function (p) {
    var badges = p.entrega === 'local'
      ? '<span class="badge badge--local">Entrega local</span>'
      : '<span class="badge badge--nac">Envio para todo o Brasil</span>';
    if (p.tags.indexOf('congelado') > -1) {
      badges += '<span class="badge badge--frozen">Congelado</span>';
    }
    return '<article class="card">' +
      '<div class="card__media">' +
        '<img src="' + imgUrl(p) + '" alt="Espaço reservado para a fotografia de ' + p.title + '" loading="lazy" decoding="async" width="500" height="500">' +
        '<div class="card__badges">' + badges + '</div>' +
        '<button class="card__open" data-open="' + p.id + '">Ver ' + p.title + '</button>' +
      '</div>' +
      '<div class="card__body">' +
        '<p class="card__cat">' + catName(p.cat) + '</p>' +
        '<h3 class="card__name">' + p.title + '</h3>' +
        '<p class="card__unit">' + p.unit + '</p>' +
        '<div class="card__foot">' +
          '<span class="card__price">' + money(p.price) + '</span>' +
          '<button class="card__add" data-add="' + p.id + '" aria-label="Adicionar ' + p.title + ' ao carrinho">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
          '</button>' +
        '</div>' +
      '</div></article>';
  };

  function catName(id) {
    for (var i = 0; i < CATEGORIES.length; i++) { if (CATEGORIES[i].id === id) { return CATEGORIES[i].name; } }
    return id;
  }
  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) { if (PRODUCTS[i].id === id) { return PRODUCTS[i]; } }
    return null;
  }

  function render() {
    if (!grid) { return; }
    var list = PRODUCTS.filter(matches);
    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : '<p class="empty">Nenhum produto encontrado com esses filtros. <button class="btn btn--ghost btn--sm" data-clear>Limpar filtros</button></p>';
    if (countEl) {
      countEl.textContent = list.length + (list.length === 1 ? ' produto' : ' produtos');
    }
  }

  /* categorias no cabeçalho e na grade de categorias */
  var catbar = $('[data-catbar]');
  if (catbar) {
    catbar.innerHTML = '<button type="button" data-cat="todos" aria-pressed="true">Todos</button>' +
      CATEGORIES.map(function (c) {
        return '<button type="button" data-cat="' + c.id + '" aria-pressed="false">' + c.name + '</button>';
      }).join('');
  }
  var catgrid = $('[data-cats]');
  if (catgrid) {
    catgrid.innerHTML = CATEGORIES.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<button class="cat" type="button" data-cat="' + c.id + '">' +
        '<span class="cat__i" aria-hidden="true">' + c.icon + '</span>' +
        '<span class="cat__n">' + c.name + '</span>' +
        '<span class="cat__c">' + n + ' ' + (n === 1 ? 'item' : 'itens') + '</span></button>';
    }).join('');
  }

  function setCat(id) {
    state.cat = id;
    $$('[data-cat]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-cat') === id ? 'true' : 'false');
    });
    render();
  }

  document.addEventListener('click', function (e) {
    var catBtn = e.target.closest('[data-cat]');
    if (catBtn) {
      setCat(catBtn.getAttribute('data-cat'));
      var loja = $('#loja');
      if (loja && catBtn.closest('[data-cats]')) { loja.scrollIntoView({ behavior: quiet() ? 'auto' : 'smooth' }); }
      return;
    }
    var chip = e.target.closest('[data-tag]');
    if (chip) {
      var t = chip.getAttribute('data-tag');
      var i = state.tags.indexOf(t);
      if (i > -1) { state.tags.splice(i, 1); } else { state.tags.push(t); }
      chip.setAttribute('aria-pressed', i > -1 ? 'false' : 'true');
      render();
      return;
    }
    if (e.target.closest('[data-clear]')) {
      state.tags = []; state.cat = 'todos'; state.search = '';
      var si = $('[data-search]'); if (si) { si.value = ''; }
      $$('[data-tag]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      setCat('todos');
      return;
    }
    var add = e.target.closest('[data-add]');
    if (add) { addToCart(add.getAttribute('data-add'), 1); return; }
    var open = e.target.closest('[data-open]');
    if (open) { openProduct(open.getAttribute('data-open')); }
  });

  var searchInput = $('[data-search]');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.search = searchInput.value.trim();
      render();
    });
  }

  /* =============================================================== carrinho */
  var drawer = $('[data-drawer]');
  var scrim = $('[data-scrim]');
  var listEl = $('[data-cart-list]');
  var countBadge = $('[data-cart-count]');
  var subEls = $$('[data-subtotal]');
  var localEl = $('[data-local-line]');
  var nacEl = $('[data-nac-line]');

  function addToCart(id, qty) {
    var p = byId(id);
    if (!p) { return; }
    var line = null;
    for (var i = 0; i < state.cart.length; i++) { if (state.cart[i].id === id) { line = state.cart[i]; } }
    if (line) { line.qty += qty; } else { state.cart.push({ id: id, qty: qty }); }
    drawCart();
    openDrawer();
  }
  function removeFromCart(id) {
    state.cart = state.cart.filter(function (l) { return l.id !== id; });
    drawCart();
  }

  function drawCart() {
    var units = state.cart.reduce(function (n, l) { return n + l.qty; }, 0);
    if (countBadge) {
      countBadge.textContent = String(units);
      countBadge.hidden = units === 0;
    }
    if (!listEl) { return; }
    if (!state.cart.length) {
      listEl.innerHTML = '<p class="empty">Seu carrinho está vazio.</p>';
    } else {
      listEl.innerHTML = state.cart.map(function (l) {
        var p = byId(l.id);
        var mode = p.entrega === 'local' ? 'Entrega local' : 'Envio nacional';
        return '<div class="ci">' +
          '<img src="' + imgUrl(p) + '" alt="" loading="lazy" width="62" height="62">' +
          '<div><p class="ci__n">' + p.title + '</p>' +
          '<p class="ci__d">' + l.qty + ' × ' + p.unit + ' · ' + mode + '</p>' +
          '<button class="ci__rm" data-rm="' + p.id + '">Remover</button></div>' +
          '<p class="ci__p price">' + money(p.price * l.qty) + '</p></div>';
      }).join('');
    }
    var sub = state.cart.reduce(function (n, l) { return n + byId(l.id).price * l.qty; }, 0);
    subEls.forEach(function (el) { el.textContent = money(sub); });
    var hasLocal = state.cart.some(function (l) { return byId(l.id).entrega === 'local'; });
    var hasNac = state.cart.some(function (l) { return byId(l.id).entrega === 'nacional'; });
    if (localEl) { localEl.hidden = !hasLocal; }
    if (nacEl) { nacEl.hidden = !hasNac; }
  }

  document.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-rm]');
    if (rm) { removeFromCart(rm.getAttribute('data-rm')); }
  });

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
  $$('[data-cart-open]').forEach(function (b) { b.addEventListener('click', openDrawer); });
  $$('[data-cart-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  if (scrim) { scrim.addEventListener('click', function () { closeDrawer(); closeModal(); }); }

  /* =============================================================== modal */
  var modal = $('[data-modal]');
  var modalBody = $('[data-modal-body]');
  var lastFocus = null;
  var modalQty = 1;

  function openProduct(id) {
    var p = byId(id);
    if (!p || !modal || !modalBody) { return; }
    modalQty = 1;
    lastFocus = document.activeElement;
    var tags = p.tags.map(function (t) {
      return '<li><span>' + (TAG_LABELS[t] || t) + '</span><span>sim</span></li>';
    }).join('');
    var mode = p.entrega === 'local'
      ? 'Entrega local — item perecível ou congelado, sai apenas para bairros atendidos'
      : 'Envio para todo o Brasil — item de prateleira, seco e estável';
    modalBody.innerHTML =
      '<div class="modal__grid">' +
        '<div class="modal__media"><img src="' + imgUrl(p) + '" alt="Espaço reservado para a fotografia de ' + p.title + '" width="800" height="600"></div>' +
        '<div class="modal__body">' +
          '<p class="eyebrow">' + catName(p.cat) + '</p>' +
          '<h2 id="modal-t">' + p.title + '</h2>' +
          '<p class="modal__price price">' + money(p.price) + '</p>' +
          '<p class="card__unit">' + p.unit + '</p>' +
          '<p>' + p.desc + '</p>' +
          '<div class="qty">' +
            '<button type="button" data-q="-1" aria-label="Diminuir quantidade">−</button>' +
            '<output data-qty aria-live="polite">1</output>' +
            '<button type="button" data-q="1" aria-label="Aumentar quantidade">+</button>' +
            '<button class="btn btn--forest" type="button" data-add-modal="' + p.id + '">Adicionar ao carrinho</button>' +
          '</div>' +
          '<ul class="spec">' +
            '<li><span>Entrega</span><span>' + mode + '</span></li>' +
            '<li><span>Unidade</span><span>' + p.unit + '</span></li>' +
            tags +
            '<li><span>Produtor</span><span class="cfm">[CONFIRM]</span></li>' +
            '<li><span>Certificação</span><span class="cfm">[CONFIRM certificação]</span></li>' +
          '</ul>' +
        '</div>' +
      '</div>';
    modal.hidden = false;
    var x = $('[data-modal-close]', modal);
    if (x) { x.focus(); }
  }
  function closeModal() {
    if (!modal || modal.hidden) { return; }
    modal.hidden = true;
    if (lastFocus) { lastFocus.focus(); }
  }
  $$('[data-modal-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (!e.target.closest('.modal__box')) { closeModal(); }
    });
  }

  document.addEventListener('click', function (e) {
    var qb = e.target.closest('[data-q]');
    if (qb) {
      modalQty = Math.max(1, modalQty + parseInt(qb.getAttribute('data-q'), 10));
      var out = $('[data-qty]');
      if (out) { out.textContent = String(modalQty); }
      return;
    }
    var am = e.target.closest('[data-add-modal]');
    if (am) { addToCart(am.getAttribute('data-add-modal'), modalQty); closeModal(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeDrawer(); }
  });


  /* ----------------------------------------------------------- checkout */
  $$('[data-checkout]').forEach(function (b) {
    b.addEventListener('click', function () {
      b.textContent = document.documentElement.lang === 'en'
        ? 'Shopify checkout — not part of this mockup'
        : 'Checkout do Shopify — fora desta maquete';
      b.disabled = true;
    });
  });

  /* =============================================================== CEP */
  var cepForm = $('[data-cep]');
  if (cepForm) {
    cepForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = ($('[data-cep-input]').value || '').replace(/\D/g, '');
      var out = $('[data-cep-out]');
      if (!out) { return; }
      if (raw.length < 8) {
        out.hidden = false;
        out.className = 'cep__out cep__out--nac';
        out.innerHTML = '<strong>CEP incompleto</strong>Digite os oito números do CEP.';
        return;
      }
      var local = CEP_LOCAL_PREFIX.some(function (pre) { return raw.indexOf(pre) === 0; });
      out.hidden = false;
      out.className = 'cep__out ' + (local ? 'cep__out--local' : 'cep__out--nac');
      out.innerHTML = local
        ? '<strong>Entregamos na sua região, incluindo congelados</strong>' +
          'Perecíveis, congelados e hortifrúti chegam até você. Frete local <span class="cfm">[CONFIRM valor e bairros atendidos]</span>.'
        : '<strong>Sua região recebe apenas produtos com envio nacional</strong>' +
          'Itens secos e de prateleira seguem por transportadora. Congelados e perecíveis saem só na entrega local. Prazo e frete <span class="cfm">[CONFIRM]</span>.';
    });
  }

  /* =============================================================== revelar */
  var reveals = $$('[data-reveal]');
  if (!reveals.length) { /* nada */ }
  else if (quiet() || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        en.target.style.setProperty('--d', (n * 80) + 'ms');
        n += 1;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* =============================================================== LGPD */
  var bar = $('[data-consent]');
  if (bar) {
    var KEY = 'rancho-cookie-choice';
    var stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch (err) { stored = null; }
    if (!stored) { window.setTimeout(function () { bar.hidden = false; }, 800); }
    var close = function (v) {
      try { window.localStorage.setItem(KEY, v); } catch (err) { /* modo privado */ }
      bar.hidden = true;
    };
    var yes = $('[data-consent-yes]', bar);
    var no = $('[data-consent-no]', bar);
    if (yes) { yes.addEventListener('click', function () { close('accept'); }); }
    if (no) { no.addEventListener('click', function () { close('decline'); }); }
  }

  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* =============================================================== início */
  render();
  drawCart();
})();

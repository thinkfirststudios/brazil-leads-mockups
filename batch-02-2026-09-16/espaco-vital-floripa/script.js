/* =====================================================================
   ESPAÇO VITAL — CATÁLOGO (edite somente este bloco)
   ---------------------------------------------------------------------
   Cada produto é um objeto no array CATALOGO abaixo:
     id           identificador único (texto curto, sem espaços)
     produto      nome do produto exatamente como no rótulo
     marca        marca do fabricante (exibir logotipo só com autorização)
     apresentacao tamanho / forma (ex.: "pote 500 g")
     preco        número em reais (ex.: 49.9) — ou null enquanto não confirmado
     categoria    um dos slugs de CATEGORIAS
     restricoes   lista com: 'sem-gluten', 'sem-lactose', 'vegano',
                  'sem-acucar', 'zero-adicao-acucar'  (somente se o RÓTULO declarar)
     imagem       URL da foto do produto
     alt          descrição da foto (sem nenhuma alegação de benefício)
     rotulo       URL da foto do rótulo registrado (ou null)
   REGRAS (ANVISA): não escreva benefícios, efeitos ou indicações.
   A descrição exibida é apenas "conforme rótulo do fabricante".
   Os cartões estáticos no HTML são a versão sem JavaScript — mantenha-os
   alinhados a este array ao publicar.
   ===================================================================== */
var WHATSAPP = ''; /* [CONFIRM] número com DDI + DDD, só dígitos (ex.: '55489...'). Vazio = botões levam à seção de contato. */

var CATEGORIAS = [
  { slug: 'suplementos', nome: 'Suplementos', en: 'Supplements' },
  { slug: 'proteinas', nome: 'Proteínas', en: 'Protein' },
  { slug: 'vitaminas-e-minerais', nome: 'Vitaminas & minerais', en: 'Vitamins & minerals' },
  { slug: 'alimentos-naturais', nome: 'Alimentos naturais', en: 'Wholefoods' },
  { slug: 'sem-gluten', nome: 'Sem glúten', en: 'Gluten-free' },
  { slug: 'sem-lactose', nome: 'Sem lactose', en: 'Lactose-free' },
  { slug: 'cosmeticos-naturais', nome: 'Cosméticos naturais', en: 'Natural cosmetics' },
  { slug: 'chas-e-ervas', nome: 'Chás & ervas', en: 'Teas & herbs' }
];

var CATALOGO = [
  { id: 'p01', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'suplementos', restricoes: ['sem-gluten'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1608571423902-eed4a5ad8108', alt: 'Frasco conta-gotas âmbar sobre suporte de madeira, fundo claro', rotulo: null },
  { id: 'p02', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'proteinas', restricoes: ['vegano'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1593095948071-474c5cc2989d', alt: 'Pó branco com colher dosadora, visto de cima', rotulo: null },
  { id: 'p03', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'vitaminas-e-minerais', restricoes: ['sem-lactose'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1550159793-baf23ed9b337', alt: 'Frascos âmbar sem rótulo sobre mesa clara', rotulo: null },
  { id: 'p04', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'alimentos-naturais', restricoes: ['sem-acucar'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1590301157890-4810ed352733', alt: 'Tigela de flocos e sementes sobre tecido claro, com pote de vidro ao fundo', rotulo: null },
  { id: 'p05', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'sem-gluten', restricoes: ['sem-gluten'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1586201375761-83865001e31c', alt: 'Grãos de arroz crus vistos de perto', rotulo: null },
  { id: 'p06', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'sem-lactose', restricoes: ['sem-lactose', 'vegano'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1691480208637-6ed63aac6694', alt: 'Pote de vidro com pasta de oleaginosas e rótulo em branco', rotulo: null },
  { id: 'p07', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'cosmeticos-naturais', restricoes: ['vegano'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1607006344380-b6775a0824a7', alt: 'Barras de sabonete empilhadas sobre fundo claro', rotulo: null },
  { id: 'p08', produto: null /* [CONFIRM produto] */, marca: null /* [CONFIRM marca] */, apresentacao: null /* [CONFIRM] */, preco: null /* [CONFIRM preço] */,
    categoria: 'chas-e-ervas', restricoes: ['zero-adicao-acucar'] /* exemplo de estrutura — [CONFIRM rótulo] */,
    imagem: 'photo-1596040033229-a9821ebd058d', alt: 'Especiarias e ervas secas dispostas sobre madeira clara, vistas de cima', rotulo: null }
];

var RESTRICOES = {
  'sem-gluten': 'Sem glúten',
  'sem-lactose': 'Sem lactose',
  'vegano': 'Vegano',
  'sem-acucar': 'Sem açúcar',
  'zero-adicao-acucar': 'Zero adição de açúcar'
};
/* ===================== fim do bloco editável ===================== */

/* Espaço Vital — site behaviour (progressive enhancement; everything works without JS) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = (doc.getAttribute('lang') || 'pt-BR').slice(0, 2);

  var T = {
    pt: { found: function (n) { return n === 1 ? '1 especialidade encontrada' : n + ' especialidades encontradas'; }, none: 'Nenhuma especialidade encontrada. Tente outro termo ou fale com a recepção.', demo: 'Demonstração: este formulário não envia dados. Na versão final, a solicitação segue para o sistema de agendamento da clínica.', consent: 'Marque a caixa de consentimento para continuar.', plans: function (n) { return n + ' resultado(s)'; } },
    en: { found: function (n) { return n === 1 ? '1 specialty found' : n + ' specialties found'; }, none: 'No specialty found. Try another term or contact reception.', demo: 'Demo only: this form does not send any data. In the live version the request goes to the clinic’s booking system.', consent: 'Please tick the consent box to continue.', plans: function (n) { return n + ' result(s)'; } },
    es: { found: function (n) { return n === 1 ? '1 especialidad encontrada' : n + ' especialidades encontradas'; }, none: 'No se encontró ninguna especialidad. Pruebe otro término o contacte a recepción.', demo: 'Demostración: este formulario no envía datos. En la versión final, la solicitud va al sistema de turnos de la clínica.', consent: 'Marque la casilla de consentimiento para continuar.', plans: function (n) { return n + ' resultado(s)'; } }
  }[lang] || null;
  if (!T) { T = { found: function (n) { return n; }, none: '', demo: '', consent: '', plans: function (n) { return n; } }; }

  /* ---------- year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- sticky header condense ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');
  function setNavTop() { if (header && nav) nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px'); }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      setNavTop();
      burger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); burger.focus(); }
    });
    window.addEventListener('resize', setNavTop);
  }

  /* ---------- scroll reveal (calm) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- count-up (only for elements carrying a VERIFIED data-count) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || reduce || !('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; o.disconnect();
      var start = null, from = Math.max(0, target - 20);
      function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / 900, 1); el.textContent = Math.round(from + (target - from) * p); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
    o.observe(el);
  });

  /* ---------- specialty finder ---------- */
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var finder = document.querySelector('[data-finder]');
  if (finder) {
    var input = finder.querySelector('[data-finder-input]');
    var chips = finder.querySelectorAll('[data-filter]');
    var tiles = finder.querySelectorAll('.tile');
    var groups = finder.querySelectorAll('[data-group]');
    var status = finder.querySelector('[data-finder-status]');
    var current = 'all';
    function apply() {
      var q = norm(input ? input.value : '');
      var shown = 0;
      Array.prototype.forEach.call(tiles, function (t) {
        var okGroup = current === 'all' || t.getAttribute('data-kind') === current;
        var okText = !q || norm(t.textContent + ' ' + (t.getAttribute('data-keywords') || '')).indexOf(q) > -1;
        var show = okGroup && okText;
        var wasHidden = t.classList.contains('is-hidden');
        t.classList.toggle('is-hidden', !show);
        if (show) {
          shown++;
          if (wasHidden && !reduce) { t.classList.remove('is-entering'); void t.offsetWidth; t.classList.add('is-entering'); }
        }
      });
      Array.prototype.forEach.call(groups, function (g) {
        g.hidden = !g.querySelector('.tile:not(.is-hidden)');
      });
      if (status) status.textContent = shown ? T.found(shown) : T.none;
    }
    if (input) input.addEventListener('input', apply);
    Array.prototype.forEach.call(chips, function (c) {
      c.setAttribute('role', 'button');
      c.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); c.click(); } });
      c.addEventListener('click', function (e) {
        e.preventDefault();
        current = c.getAttribute('data-filter');
        Array.prototype.forEach.call(chips, function (x) { x.setAttribute('aria-pressed', String(x === c)); });
        apply();
      });
    });
    var ff = finder.querySelector('form');
    if (ff) ff.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
  }

  /* ---------- convênios search ---------- */
  var planInput = document.querySelector('[data-plan-input]');
  if (planInput) {
    var plans = document.querySelectorAll('[data-plan-list] li');
    var pStatus = document.querySelector('[data-plan-status]');
    planInput.addEventListener('input', function () {
      var q = norm(planInput.value), n = 0;
      Array.prototype.forEach.call(plans, function (li) { var ok = !q || norm(li.textContent).indexOf(q) > -1; li.classList.toggle('is-hidden', !ok); if (ok) n++; });
      if (pStatus) pStatus.textContent = T.plans(n);
    });
    var pf = planInput.closest('form');
    if (pf) pf.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ---------- quick select → specialty page ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-quick]'), function (form) {
    form.addEventListener('submit', function (e) {
      var sel = form.querySelector('select');
      if (sel && sel.value) { e.preventDefault(); window.location.href = sel.value; }
    });
  });

  /* ---------- carousels ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (c) {
    var track = c.querySelector('.carousel-track');
    Array.prototype.forEach.call(c.querySelectorAll('[data-dir]'), function (b) {
      b.addEventListener('click', function () {
        var dir = parseInt(b.getAttribute('data-dir'), 10);
        var item = track.firstElementChild;
        var w = item ? item.getBoundingClientRect().width + 16 : 300;
        track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* ---------- demo forms ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-demo]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = form.querySelector('input[data-consent]');
      var notice = form.querySelector('.form-notice');
      if (consent && !consent.checked) { consent.focus(); if (notice) { notice.textContent = T.consent; notice.classList.add('is-visible'); } return; }
      if (notice) { notice.textContent = T.demo; notice.classList.add('is-visible'); }
    });
  });

  /* ---------- LGPD cookie banner ---------- */
  var KEY = 'ev_cookie_consent_v1';
  var sheet = document.getElementById('cookie-sheet');
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  if (sheet) {
    var prefs = sheet.querySelector('.cookie-prefs');
    var an = sheet.querySelector('#ck-analytics');
    var mk = sheet.querySelector('#ck-marketing');
    var prefBtn = sheet.querySelector('[data-ck="prefs"]');
    var saveBtn = sheet.querySelector('[data-ck="save"]');
    function openSheet(showPrefs) {
      var saved = read();
      if (an) an.checked = !!(saved && saved.analytics);
      if (mk) mk.checked = !!(saved && saved.marketing);
      sheet.hidden = false;
      if (prefs) prefs.hidden = !showPrefs;
      if (saveBtn) saveBtn.hidden = !showPrefs;
      if (prefBtn) prefBtn.setAttribute('aria-expanded', String(!!showPrefs));
    }
    function close(v) { v.date = new Date().toISOString(); store(v); sheet.hidden = true; }
    sheet.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ck]'); if (!b) return;
      var k = b.getAttribute('data-ck');
      if (k === 'accept') close({ necessary: true, analytics: true, marketing: true });
      if (k === 'reject') close({ necessary: true, analytics: false, marketing: false });
      if (k === 'prefs') { var o = prefs.hidden; prefs.hidden = !o; saveBtn.hidden = !o; b.setAttribute('aria-expanded', String(o)); }
      if (k === 'save') close({ necessary: true, analytics: !!(an && an.checked), marketing: !!(mk && mk.checked) });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-cookie-open]'), function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); openSheet(true); var f = sheet.querySelector('button'); if (f) f.focus(); });
    });
    if (!read()) openSheet(false);
  }

  /* ---------- click-to-load maps (LGPD: no third-party embed before consent/click) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-map-load]'), function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map-src]'); if (!box) return;
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-map-src');
      f.title = box.getAttribute('data-map-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('is-loaded');
      f.focus();
    });
  });
})();

/* ---------- catalogue renderer + dietary filter (enhances the static no-JS cards) ---------- */
(function () {
  'use strict';
  var root = document.querySelector('[data-catalog]');
  if (!root || typeof CATALOGO === 'undefined') return;
  var en = (document.documentElement.getAttribute('lang') || '').slice(0, 2) === 'en';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var grid = root.querySelector('[data-catalog-grid]');
  var status = root.querySelector('[data-catalog-status]');
  var catSel = root.querySelector('[data-catalog-cat]');
  var chips = root.querySelectorAll('[data-diet]');
  var fixedCat = root.getAttribute('data-fixed-cat') || '';
  var fixedDiet = root.getAttribute('data-fixed-diet') || '';
  var dietEN = { 'sem-gluten': 'Gluten-free', 'sem-lactose': 'Lactose-free', 'vegano': 'Vegan', 'sem-acucar': 'No sugar', 'zero-adicao-acucar': 'No added sugar' };
  var catName = {};
  CATEGORIAS.forEach(function (c) { catName[c.slug] = en ? c.en : c.nome; });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function conf(t) { return '<span class="confirm">' + esc(t) + '</span>'; }
  function price(p) {
    if (typeof p === 'number') return esc(p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    return 'R$ 00,00 ' + conf(en ? '[CONFIRM price]' : '[CONFIRM preço]');
  }
  function waHref(item) {
    if (!WHATSAPP) return root.getAttribute('data-contact') || '#contato';
    var name = item.produto || item.id;
    var txt = (en ? 'Hello! I would like to ask about: ' : 'Olá! Gostaria de consultar o produto: ') + name;
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(txt);
  }
  function card(item) {
    var diets = (item.restricoes || []).map(function (r) { return '<li>' + esc(en ? dietEN[r] : RESTRICOES[r]) + '</li>'; }).join('');
    return '<article class="product" data-cat="' + esc(item.categoria) + '" data-diet="' + esc((item.restricoes || []).join(' ')) + '">' +
      '<figure class="ph-img"><img loading="lazy" src="https://images.unsplash.com/' + esc(item.imagem) + '?auto=format&fit=crop&w=600&h=600&q=70" width="600" height="600" alt="' + esc(item.alt) + '"></figure>' +
      '<div class="product-body">' +
      '<p class="curated-line">' + esc(catName[item.categoria] || item.categoria) + '</p>' +
      '<h3>' + (item.produto ? esc(item.produto) : conf(en ? '[CONFIRM product]' : '[CONFIRM produto]')) + '</h3>' +
      '<p class="brand">' + (en ? 'Brand: ' : 'Marca: ') + (item.marca ? esc(item.marca) : conf(en ? '[CONFIRM brand]' : '[CONFIRM marca]')) + ' · ' + (item.apresentacao ? esc(item.apresentacao) : conf(en ? '[CONFIRM size]' : '[CONFIRM apresentação]')) + '</p>' +
      '<p class="price">' + price(item.preco) + '</p>' +
      (diets ? '<ul class="tags" aria-label="' + (en ? 'Dietary information' : 'Restrições alimentares') + '">' + diets + '</ul>' + conf(en ? '[CONFIRM on label]' : '[CONFIRM rótulo]') : '') +
      '<p class="desc"><span class="ph">' + (en ? '[PLACEHOLDER: description as per the manufacturer’s label — no benefit claims]' : '[PLACEHOLDER: descrição conforme rótulo do fabricante — nenhuma alegação de benefício]') + '</span></p>' +
      '<a class="btn btn-wa btn-sm" href="' + esc(waHref(item)) + '"' + (WHATSAPP ? ' rel="noopener" target="_blank"' : '') + '>' + (en ? 'Ask on WhatsApp' : 'Consultar pelo WhatsApp') + (WHATSAPP ? '' : ' ' + conf('[CONFIRM WhatsApp]')) + '</a>' +
      '</div></article>';
  }

  var items = CATALOGO.filter(function (i) {
    return (!fixedCat || i.categoria === fixedCat) && (!fixedDiet || (i.restricoes || []).indexOf(fixedDiet) > -1);
  });
  grid.innerHTML = items.map(card).join('') || '<p class="catalog-empty">' + conf('[CONFIRM produtos]') + '</p>';
  if (!reduce) {
    Array.prototype.forEach.call(grid.querySelectorAll('.product'), function (p, i) {
      p.style.animationDelay = (i % 4) * 100 + 'ms';
      p.classList.add('is-entering');
    });
  }

  var diet = 'all';
  function apply() {
    var cat = catSel ? catSel.value : 'all';
    var n = 0;
    Array.prototype.forEach.call(grid.querySelectorAll('.product'), function (p) {
      var ok = (diet === 'all' || (' ' + p.getAttribute('data-diet') + ' ').indexOf(' ' + diet + ' ') > -1) && (cat === 'all' || p.getAttribute('data-cat') === cat);
      var was = p.classList.contains('is-hidden');
      p.classList.toggle('is-hidden', !ok);
      if (ok) { n++; if (was && !reduce) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); } }
    });
    if (status) status.textContent = en ? (n + (n === 1 ? ' product' : ' products')) : (n + (n === 1 ? ' produto' : ' produtos'));
  }
  Array.prototype.forEach.call(chips, function (c) {
    c.setAttribute('role', 'button');
    c.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); c.click(); } });
    c.addEventListener('click', function (e) {
      e.preventDefault();
      diet = c.getAttribute('data-diet');
      Array.prototype.forEach.call(chips, function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      apply();
    });
  });
  if (catSel) {
    catSel.addEventListener('change', apply);
    var f = catSel.closest('form');
    if (f) f.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
  }
  apply();
})();

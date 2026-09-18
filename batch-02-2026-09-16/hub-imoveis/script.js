/* =========================================================================
   HUB Imóveis — mockup de redesign · script compartilhado (pt-BR + /en/)
   ========================================================================= */

/* -------------------------------------------------------------------------
   LISTINGS — DADOS DE DEMONSTRAÇÃO (PLACEHOLDER)
   -------------------------------------------------------------------------
   ⚠ NENHUM IMÓVEL REAL É PUBLICADO NESTE MOCKUP. Todos os campos abaixo são
     placeholders; `null` = [CONFIRM] e é exibido como tal na página.
   ⚠ Nunca inventar tipo, endereço, bairro, área, preço, corretor ou CRECI.
   ⚠ As fotos são banco de imagens ILUSTRATIVO e jamais representam um imóvel.

   PRODUÇÃO — RENDERIZAÇÃO NO SERVIDOR (requisito central do projeto):
   - Este array existe só para a demonstração. Em produção os cards são HTML
     renderizado no servidor, alimentado pelo feed/exportação/API da Imoalert
     [CONFIRM se a Imoalert oferece feed ou exportação].
   - Cada imóvel ganha URL durável e indexável: /imovel/[codigo]-[tipo]-[bairro]/
   - Cada filtro relevante vira página indexável: /comprar/florianopolis/trindade/
   - As URLs antigas (/imovel?… e /pagina/53/empresa) recebem 301.
   - Os cards abaixo também já estão escritos no HTML (funcionam sem JS);
     este script só os re-renderiza quando o visitante filtra.
   Campos:
     id, track ('comprar' | 'alugar'), exclusivo (bool | null),
     img (id Unsplash), alt (pt), altEn (en),
     tipo, dormitorios, bairro, cidade, area, vagas, preco,
     condominio, iptu, mobiliado, pet  → null = [CONFIRM]
   ------------------------------------------------------------------------- */
const LISTINGS = [
  { id: 'PH-01', track: 'comprar', exclusivo: true,  img: '1600607687939-ce8a6c25118c', alt: 'Sala de estar ampla e clara com sofá cinza, painel de madeira e portas de vidro', altEn: 'Bright open living room with grey sofa, timber wall panel and glass doors', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-02', track: 'comprar', exclusivo: false, img: '1484154218962-a197022b5858', alt: 'Cozinha branca com ilha central, bancos altos e revestimento escuro', altEn: 'White kitchen with central island, bar stools and dark splashback', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-03', track: 'comprar', exclusivo: false, img: '1512917774080-9991f1c4c750', alt: 'Casa contemporânea branca com piscina e vegetação tropical sob céu azul', altEn: 'White contemporary house with pool and tropical planting under a blue sky', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-04', track: 'comprar', exclusivo: true,  img: '1600573472550-8090b5e0745e', alt: 'Sala com portas de vidro do piso ao teto abrindo para terraço com vista para o mar', altEn: 'Room with floor-to-ceiling glass doors opening onto a sea-view terrace', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-05', track: 'comprar', exclusivo: false, img: '1616594039964-ae9021a400a0', alt: 'Quarto em tons neutros com cabeceira estofada, luminária pendente e cortinas', altEn: 'Neutral-toned bedroom with upholstered headboard, pendant light and curtains', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-06', track: 'comprar', exclusivo: false, img: '1628744448840-55bdb2497bd4', alt: 'Fachada de unidade comercial térrea com revestimento de madeira e vidro', altEn: 'Single-storey commercial unit facade with timber cladding and glazing', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-07', track: 'comprar', exclusivo: false, img: '1502672260266-1c1ef2d93688', alt: 'Studio claro com sofá, estante com plantas e mesa de jantar redonda', altEn: 'Bright studio with sofa, plant-filled shelving and a round dining table', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-08', track: 'comprar', exclusivo: false, img: '1545324418-cc1a3fa10c00', alt: 'Fachada de edifício residencial com sacadas vista de baixo contra o céu', altEn: 'Residential building facade with balconies seen from below against the sky', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-09', track: 'comprar', exclusivo: false, img: '1681157864613-f1a667b4b225', alt: 'Vista aérea de bairro residencial à beira-mar com praia e morro verde', altEn: 'Aerial view of a seaside residential neighbourhood with beach and green hill', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null },
  { id: 'PH-R1', track: 'alugar', exclusivo: false, img: '1522708323590-d24dbb6b0267', alt: 'Apartamento claro com sala e cozinha integradas e janela ampla', altEn: 'Bright apartment with open-plan living, kitchen and a wide window', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null, condominio: null, iptu: null, mobiliado: null, pet: null },
  { id: 'PH-R2', track: 'alugar', exclusivo: false, img: '1560448204-e02f11c3d0e2', alt: 'Sala de estar com sofá e poltronas bege e janelas amplas', altEn: 'Living room with beige sofa and armchairs and large windows', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null, condominio: null, iptu: null, mobiliado: null, pet: null },
  { id: 'PH-R3', track: 'alugar', exclusivo: false, img: '1493809842364-78817add7ffb', alt: 'Sala clara com sofá azul, rack branco e piso de madeira em espinha de peixe', altEn: 'Bright room with blue sofa, white sideboard and herringbone timber floor', tipo: null, dormitorios: null, bairro: null, cidade: null, area: null, vagas: null, preco: null, condominio: null, iptu: null, mobiliado: null, pet: null }
];

(function () {
  'use strict';
  var doc = document.documentElement;
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var ROOT = doc.getAttribute('data-root') || '';
  var LANGROOT = doc.getAttribute('data-langroot') || ROOT;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Número de WhatsApp: o site atual publica "0489 3505 3639" (formato inválido).
     Enquanto o número correto não for confirmado, nenhum link wa.me é gerado. */
  var WA_NUMBER = null; // [CONFIRM] ex.: '5548XXXXXXXXX'

  var T = EN ? {
    confirm: 'CONFIRM', type: 'type', beds: 'bedrooms', hood: 'neighbourhood', city: 'city', area: 'm²', parking: 'parking',
    price: 'price', rent: 'rent / month', condo: 'Condo fee', iptu: 'IPTU (property tax)', total: 'Total monthly cost',
    furnished: 'Furnished?', pets: 'Pets allowed?', excl: 'Exclusive', sale: 'For sale', rental: 'For rent',
    photo: 'Illustrative photo — placeholder', view: 'View property', perListing: 'per listing',
    demo: 'Demo only — nothing was sent.', urlLabel: 'Indexable URL that would be server-rendered:',
    waCompose: 'Message that would open in WhatsApp (number [CONFIRM]):', consent: 'Please tick the privacy consent box to continue.',
    results: 'results'
  } : {
    confirm: 'CONFIRM', type: 'tipo', beds: 'dormitórios', hood: 'bairro', city: 'cidade', area: 'm²', parking: 'vagas',
    price: 'preço', rent: 'aluguel / mês', condo: 'Condomínio', iptu: 'IPTU', total: 'Custo mensal total',
    furnished: 'Mobiliado?', pets: 'Aceita pet?', excl: 'Exclusivo', sale: 'Venda', rental: 'Locação',
    photo: 'Foto ilustrativa — placeholder', view: 'Ver imóvel', perListing: 'por anúncio',
    demo: 'Demonstração — nada foi enviado.', urlLabel: 'URL indexável que seria renderizada no servidor:',
    waCompose: 'Mensagem que abriria no WhatsApp (número [CONFIRM]):', consent: 'Marque a caixa de consentimento de privacidade para continuar.',
    results: 'resultados'
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cf(v, label) { return v == null ? '<span class="confirm">[' + T.confirm + (label ? ' ' + esc(label) : '') + ']</span>' : esc(v); }
  function img(id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&q=70'; }

  var ICON = {
    area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M4 9h5V4M20 15h-5v5"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="11" r="1.6"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 16h14M6 16l1.5-5h9L18 16M5 16v3M19 16v3"/><circle cx="8" cy="16" r=".6"/><circle cx="16" cy="16" r=".6"/></svg>'
  };

  function cardHTML(l, i) {
    var rent = l.track === 'alugar';
    var href = LANGROOT + (EN ? 'property/model/index.html' : 'imovel/modelo/index.html');
    var h = '<article class="card' + (rent ? ' card--rent' : '') + '" style="--i:' + i + '">' +
      '<figure class="card__media"><img src="' + img(l.img, 800) + '" alt="' + esc(EN ? l.altEn : l.alt) + '" loading="lazy" width="800" height="600">' +
      (l.exclusivo ? '<span class="badge">' + T.excl + '</span>' : '') +
      '<span class="badge badge--op' + (rent ? ' badge--sage' : '') + '">' + (rent ? T.rental : T.sale) + '</span>' +
      '<figcaption class="photo-tag">' + T.photo + '</figcaption></figure>' +
      '<div class="card__body">' +
      '<p class="card__loc">' + cf(l.bairro, T.hood) + ' · ' + cf(l.cidade, T.city) + '</p>' +
      '<h3 class="card__title"><a href="' + href + '">' + cf(l.tipo, T.type) + ' · ' + cf(l.dormitorios, T.beds) + '</a></h3>' +
      '<ul class="specs"><li>' + ICON.area + cf(l.area, '') + ' ' + T.area + '</li><li>' + ICON.bed + cf(l.dormitorios, T.beds) + '</li><li>' + ICON.car + cf(l.vagas, T.parking) + '</li></ul>';
    if (rent) {
      h += '<table class="cost-table"><tbody>' +
        '<tr><th scope="row">' + T.rent + '</th><td>R$ 0.000,00</td></tr>' +
        '<tr><th scope="row">' + T.condo + '</th><td>' + cf(l.condominio, T.perListing) + '</td></tr>' +
        '<tr><th scope="row">' + T.iptu + '</th><td>' + cf(l.iptu, T.perListing) + '</td></tr>' +
        '<tr class="total"><th scope="row">' + T.total + '</th><td>R$ 0.000,00</td></tr></tbody></table>' +
        '<div class="chips"><span class="chip">' + T.furnished + ' ' + cf(l.mobiliado, '') + '</span><span class="chip">' + T.pets + ' ' + cf(l.pet, '') + '</span></div>';
    }
    h += '<div class="price-row"><span class="price">R$ ' + (rent ? '0.000,00' : '000.000,00') + '</span>' + cf(l.preco, T.price) + '</div></div></article>';
    return h;
  }

  /* ---- boot ---------------------------------------------------------- */
  doc.classList.add('js');

  // year
  var y = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });

  // header condense
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('mobile-panel');
  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && panel) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // scroll reveals
  var reveals = document.querySelectorAll('.reveal, .intent');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // count-up — only for elements with a VERIFIED data-count value (none ship in this mockup)
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseFloat(el.getAttribute('data-count'));
        cio.unobserve(el);
        if (isNaN(end)) return;
        if (reduce) { el.textContent = end.toLocaleString(EN ? 'en' : 'pt-BR'); return; }
        var t0 = null;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * e).toLocaleString(EN ? 'en' : 'pt-BR');
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // hero parallax (transform only)
  var heroMedia = document.querySelector('.hero__media');
  if (heroMedia && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var s = Math.min(window.scrollY, 900);
        heroMedia.style.transform = 'translate3d(0,' + (s * 0.18).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  // three-intent switcher (tabs)
  var doors = Array.prototype.slice.call(document.querySelectorAll('.door'));
  function selectDoor(d, focus) {
    doors.forEach(function (o) {
      var on = o === d;
      o.setAttribute('aria-selected', String(on));
      o.tabIndex = on ? 0 : -1;
      var p = document.getElementById(o.getAttribute('aria-controls'));
      if (p) { if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); }
    });
    if (focus) d.focus();
  }
  if (doors.length) {
    var start = doors.filter(function (d) { return d.getAttribute('aria-selected') === 'true'; })[0] || doors[0];
    selectDoor(start);
    doors.forEach(function (d, i) {
      d.addEventListener('click', function () { selectDoor(d); });
      d.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = doors[(i + 1) % doors.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = doors[(i - 1 + doors.length) % doors.length];
        if (e.key === 'Home') n = doors[0];
        if (e.key === 'End') n = doors[doors.length - 1];
        if (n) { e.preventDefault(); selectDoor(n, true); }
      });
    });
  }

  // slug helper
  function slug(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // search forms → build crawlable URL + re-render grid (demo)
  function buildUrl(fd) {
    var op = fd.get('operacao') === 'locacao' ? (EN ? 'rent' : 'alugar') : (EN ? 'buy' : 'comprar');
    var path = (EN ? '/en/' : '/') + op + '/';
    var c = fd.get('cidade'), b = fd.get('bairro');
    if (c) path += slug(c) + '/';
    if (c && b) path += slug(b) + '/';
    var q = [];
    ['tipo', 'faixa_min', 'faixa_max', 'dormitorios', 'vagas'].forEach(function (k) {
      var v = fd.get(k); if (v) q.push(k + '=' + encodeURIComponent(slug(v) || v));
    });
    return 'https://imobiliariahub.com.br' + path + (q.length ? '?' + q.join('&') : '');
  }
  var searchForm = document.getElementById('search-form');
  var grid = document.getElementById('results-grid');
  function runSearch(form) {
    var fd = new FormData(form);
    var prev = form.querySelector('.url-preview') || document.getElementById('url-preview');
    if (prev) prev.innerHTML = T.urlLabel + '<br><b>' + esc(buildUrl(fd)) + '</b>';
    if (grid) {
      var op = fd.get('operacao');
      var list = LISTINGS.filter(function (l) {
        if (op === 'locacao') return l.track === 'alugar';
        if (op === 'venda') return l.track === 'comprar';
        return true;
      }).slice(0, 9);
      grid.classList.remove('is-refreshing');
      grid.innerHTML = list.map(cardHTML).join('');
      void grid.offsetWidth;
      grid.classList.add('is-refreshing');
      var cnt = document.getElementById('results-count');
      if (cnt) cnt.innerHTML = '<span class="confirm">[' + T.confirm + ']</span> ' + T.results + ' · ' + (EN ? 'showing ' : 'exibindo ') + list.length + (EN ? ' placeholder cards' : ' cards de demonstração');
    }
  }
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) { e.preventDefault(); runSearch(searchForm); });
    // preselect from query string (e.g. ?tipo=empreendimento from the "Lançamentos" nav item)
    try {
      var qs = new URLSearchParams(location.search);
      var changed = false;
      qs.forEach(function (v, k) {
        var el = searchForm.elements[k];
        if (el) { el.value = v; changed = true; }
      });
      if (changed) runSearch(searchForm);
    } catch (err) { /* ignore */ }
  }
  // hero quick-search panels hand off to the main search
  document.querySelectorAll('form[data-handoff]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!searchForm) return;
      e.preventDefault();
      var fd = new FormData(f);
      fd.forEach(function (v, k) { if (searchForm.elements[k]) searchForm.elements[k].value = v; });
      runSearch(searchForm);
      var tgt = document.getElementById('busca') || document.getElementById('search');
      if (tgt) tgt.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  // segmented operation toggle in results bar
  document.querySelectorAll('[data-op]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!searchForm) return;
      searchForm.elements.operacao.value = b.getAttribute('data-op');
      document.querySelectorAll('[data-op]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      runSearch(searchForm);
    });
  });

  // demo forms (lead capture) — never submit
  document.querySelectorAll('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = f.querySelector('.form-note');
      var consent = f.querySelector('input[name="lgpd"]');
      if (consent && !consent.checked) {
        if (note) { note.textContent = T.consent; note.classList.add('is-on'); }
        consent.focus();
        return;
      }
      var msg = T.demo;
      if (f.hasAttribute('data-wa')) {
        var fd = new FormData(f), parts = [];
        f.querySelectorAll('[data-wa-label]').forEach(function (el) {
          var v = fd.get(el.name);
          if (v) parts.push(el.getAttribute('data-wa-label') + ': ' + v);
        });
        var text = (EN ? 'Hello HUB Imóveis, I would like to list my property. ' : 'Olá, HUB Imóveis! Quero anunciar meu imóvel. ') + parts.join(' | ');
        var link = WA_NUMBER ? 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text) : 'https://wa.me/[CONFIRM]?text=' + encodeURIComponent(text);
        msg += '<br>' + T.waCompose + '<br><code>' + esc(link) + '</code>';
      }
      if (note) { note.innerHTML = msg; note.classList.add('is-on'); }
    });
  });

  // gallery carousel
  document.querySelectorAll('.gallery').forEach(function (g) {
    var track = g.querySelector('.gallery__track');
    var slides = g.querySelectorAll('.gallery__slide');
    var dots = g.querySelectorAll('.dots span');
    function go(dir) {
      var w = slides[0].getBoundingClientRect().width + 10;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    }
    var prev = g.querySelector('[data-prev]'), next = g.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.addEventListener('scroll', function () {
      var w = slides[0].getBoundingClientRect().width + 10;
      var idx = Math.round(track.scrollLeft / w);
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    }, { passive: true });
  });

  /* ---- Map: third-party iframe injected ONLY after an explicit click (LGPD) ---- */
  document.querySelectorAll('[data-map-load]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map]');
      if (!box) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(box.getAttribute('data-map')) + '&output=embed';
      f.title = box.getAttribute('data-map-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.className = 'map-frame';
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('is-loaded');
    });
  });

  /* ---- LGPD cookie consent ------------------------------------------ */
  var KEY = 'hub-imoveis-cookie-consent-v1';
  var banner = document.getElementById('cookie');
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function openBanner(showPrefs) {
    if (!banner) return;
    var saved = read() || {};
    banner.querySelectorAll('input[data-cat]').forEach(function (i) { i.checked = !!saved[i.getAttribute('data-cat')]; });
    var prefs = banner.querySelector('.cookie__prefs');
    if (prefs) prefs.hidden = !showPrefs;
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
  }
  function closeBanner() {
    if (!banner) return;
    banner.classList.remove('is-open');
    setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 450);
  }
  if (banner) {
    if (!read()) openBanner(false);
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cookie]');
      if (!b) return;
      var a = b.getAttribute('data-cookie');
      if (a === 'accept') { store({ necessarios: true, analise: true, marketing: true, ts: Date.now() }); closeBanner(); }
      if (a === 'reject') { store({ necessarios: true, analise: false, marketing: false, ts: Date.now() }); closeBanner(); }
      if (a === 'prefs') {
        var prefs = banner.querySelector('.cookie__prefs');
        if (prefs.hidden) { prefs.hidden = false; b.textContent = EN ? 'Save choices' : 'Salvar escolhas'; }
        else {
          var v = { necessarios: true, ts: Date.now() };
          banner.querySelectorAll('input[data-cat]').forEach(function (i) { v[i.getAttribute('data-cat')] = i.checked; });
          store(v); closeBanner();
          b.textContent = EN ? 'Preferences' : 'Preferências';
        }
      }
    });
  }
  document.querySelectorAll('[data-cookie-open]').forEach(function (b) {
    b.addEventListener('click', function () { openBanner(true); });
  });
})();

/* ==========================================================================
   Forneria Catarina — mockup script
   --------------------------------------------------------------------------
   ▼▼▼ DADOS EDITÁVEIS — CASAS E CARDÁPIO ▼▼▼
   • UNITS: addresses are verified (their /unidades page). hours / tagme / phone
     are null = rendered as visible [CONFIRM]. Paste each unit's Tagme URL into
     `tagme` and the reservation buttons go live for that unit only.
   • MENU: nothing here comes from their Google Drive PDF (unreadable).
     null = visible [CONFIRM]. A price change is a one-line edit: price: 'R$ 00,00'.
     units: null (= [CONFIRM availability]) or e.g. ['centro','santa-monica']
       → when a unit is selected, items not served there are hidden.
     gluten: 'contem' | 'nao-contem' | null  (Lei 10.674/2003)
     allergens: ['leite','trigo'] | null      (ANVISA RDC 26/2015)
     diet: ['vegetariano'] | null
   The HTML ships a pre-rendered copy for no-JS / crawlers; in production,
   pre-render from this same data.
   ========================================================================== */
const UNITS = {
  'centro': {
    name: 'Forneria Centro', short: 'Centro',
    address: 'Rua Esteves Junior, 604 — Centro, Florianópolis, SC, 88015-130',
    hours: null, tagme: null, phone: null
  },
  'santa-monica': {
    name: 'Forneria Santa Mônica', short: 'Santa Mônica',
    address: 'Avenida Me. Benvenuta, 1248 — Santa Mônica, Florianópolis, SC, 88035-111',
    hours: null, tagme: null, phone: null
  },
  'sao-jose': {
    name: 'Forneria São José', short: 'São José',
    address: 'Av. Presidente Kennedy, 568, sala 01 e 06 — Campinas, São José, SC, 88101-000',
    hours: null, tagme: null, phone: null
  }
};

const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;
const MENU = {
  laticinio: [ // A — goes FIRST, above the pizzas
    { name: null, desc: null, price: null, gluten: null, allergens: ['leite'], diet: null, units: null, img: '1760023570385-ee484f7076b3', alt: 'Burrata inteira sobre tomates-cereja e manjericão', altEn: 'Whole burrata on cherry tomatoes and basil' },
    { name: null, desc: null, price: null, gluten: null, allergens: ['leite'], diet: null, units: null, img: '1649400454485-b8ad827f929d', alt: 'Burrata sobre tomates fatiados em prato escuro', altEn: 'Burrata on sliced tomatoes on a dark plate' },
    { name: null, desc: null, price: null, gluten: null, allergens: ['leite'], diet: null, units: null, img: '1571081538808-612772b00e9f', alt: 'Burrata servida com pães rústicos', altEn: 'Burrata served with rustic bread' }
  ],
  pizzas: [ // B
    { name: null, desc: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, units: null, img: '1564936281291-294551497d81', alt: 'Pizza estilo napolitano com muçarela fresca e manjericão', altEn: 'Neapolitan-style pizza with fresh mozzarella and basil' },
    { name: null, desc: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, units: null, img: '1593560708920-61dd98c46a4e', alt: 'Pizza com folhas verdes e queijo fresco', altEn: 'Pizza with greens and fresh cheese' },
    { name: null, desc: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, units: null, img: '1574071318508-1cdbab80d002', alt: 'Pizza de borda alta com manjericão', altEn: 'Puffy-crust pizza with basil' },
    { name: null, desc: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, units: null, img: '1595854341625-f33ee10dbf94', alt: 'Pizza com tomate e manjericão em fundo escuro', altEn: 'Tomato and basil pizza on a dark background' },
    { name: null, desc: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, units: null, img: '1541745537411-b8046dc6d66c', alt: 'Fatia de pizza com queijo derretido', altEn: 'Slice of pizza with melted cheese' },
    { name: null, desc: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, units: null, img: '1590947132387-155cc02f3212', alt: 'Pizza fatiada com tomates sobre tábua', altEn: 'Sliced pizza with tomatoes on a board' }
  ],
  lists: [ // C, D, E
    { id: 'menu-entradas',   letter: 'C', pt: 'Entradas',   en: 'Starters', items: [ {}, {}, {}, {} ] },
    { id: 'menu-sobremesas', letter: 'D', pt: 'Sobremesas', en: 'Desserts', items: [ {}, {}, {} ] },
    { id: 'menu-bebidas',    letter: 'E', pt: 'Bebidas',    en: 'Drinks',   items: [ {}, {}, {}, {} ] }
  ]
};
/* ▲▲▲ FIM DOS DADOS EDITÁVEIS ▲▲▲ */

(function () {
  'use strict';
  const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOT = document.body.dataset.root || '';
  const KEY_UNIT = 'fc_unit_v1';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* blocked */ } }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cf = t => `<span class="confirm">[${esc(t)}]</span>`;
  const L = EN ? {
    name: 'CONFIRM name', dish: 'CONFIRM dish', desc: 'CONFIRM description', price: 'CONFIRM price', sizes: 'CONFIRM sizes', sizesL: 'Sizes',
    gluten: 'Contains / gluten-free', allergens: 'Allergens', diet: 'Dietary', units: 'Units', unitsC: 'CONFIRM availability per unit',
    milk: 'Milk', photo: 'Illustrative photo — placeholder', reserve: 'Book', at: 'at', all: 'All units', choose: 'Choose a unit',
    tagmeC: 'CONFIRM Tagme URL', hoursC: 'CONFIRM hours', selected: 'Selected'
  } : {
    name: 'CONFIRM nome', dish: 'CONFIRM prato', desc: 'CONFIRM descrição', price: 'CONFIRM preço', sizes: 'CONFIRM tamanhos', sizesL: 'Tamanhos',
    gluten: 'Contém / não contém glúten', allergens: 'Alérgenos', diet: 'Dieta', units: 'Casas', unitsC: 'CONFIRM disponibilidade por casa',
    milk: 'Leite', photo: 'Foto ilustrativa — placeholder', reserve: 'Reservar', at: 'em', all: 'Todas as casas', choose: 'Escolha a casa',
    tagmeC: 'CONFIRM URL Tagme', hoursC: 'CONFIRM horário', selected: 'Selecionada'
  };

  /* ---------------- menu ---------------- */
  const priceHtml = p => p ? `<span class="price">${esc(p)}</span>` : `<span class="price">R$ 00,00</span> ${cf(L.price)}`;
  const glutenTag = g => g === 'contem' ? `<span class="tag tag--gluten">${EN ? 'Contains gluten' : 'Contém glúten'}</span>`
    : g === 'nao-contem' ? `<span class="tag tag--gluten">${EN ? 'Gluten-free' : 'Não contém glúten'}</span>`
    : `<span class="tag tag--gluten">${L.gluten} ${cf('CONFIRM')}</span>`;
  const allergenTags = a => {
    if (!a) return `<span class="tag">${L.allergens} ${cf('CONFIRM')}</span>`;
    return a.map(x => x === 'leite' ? `<span class="tag tag--milk">${L.milk}</span>` : `<span class="tag">${esc(x)}</span>`).join('') + `<span class="tag">+ ${cf('CONFIRM')}</span>`;
  };
  const dietTags = d => d ? d.map(x => `<span class="tag tag--diet">${esc(x)}</span>`).join('') : `<span class="tag tag--diet">${L.diet} ${cf('CONFIRM')}</span>`;
  const unitTag = u => u ? `<span class="tag tag--unit">${u.map(k => UNITS[k] ? UNITS[k].short : k).join(' · ')}</span>` : `<span class="tag tag--unit">${L.units} ${cf(L.unitsC)}</span>`;
  const unitsAttr = u => u ? u.join(' ') : 'all';

  function card(item, n, h, group) {
    return `<article class="dish reveal" style="--i:${n % 3}" data-units="${unitsAttr(item.units)}">
      <figure class="dish__media"><!-- PLACEHOLDER-${group}-${n + 1} -->
        <img src="${IMG(item.img)}" alt="${esc(EN && item.altEn ? item.altEn : item.alt)}" loading="lazy" width="640" height="480">
        <span class="photo-badge">${L.photo}</span>
      </figure>
      <div class="dish__body">
        <${h} class="dish__name">${item.name ? esc(item.name) : cf(group === 'laticinio' ? L.dish : L.name)}</${h}>
        <p class="dish__desc">${item.desc ? esc(item.desc) : cf(L.desc)}</p>
        ${group === 'pizzas' ? `<p class="dish__meta">${L.sizesL}: ${item.sizes ? esc(item.sizes) : cf(L.sizes)}</p>` : ''}
        <p class="dish__meta">${priceHtml(item.price)}</p>
        <div class="tags">${glutenTag(item.gluten)}${allergenTags(item.allergens)}${dietTags(item.diet)}${unitTag(item.units)}</div>
      </div>
    </article>`;
  }
  function row(item) {
    return `<div class="row" data-units="${unitsAttr(item.units)}">
      <div class="row__top"><span class="row__name">${item.name ? esc(item.name) : cf(L.name)}</span><span class="row__dots" aria-hidden="true"></span>${priceHtml(item.price)}</div>
      <p>${item.desc ? esc(item.desc) : cf(L.desc)}</p>
      <div class="tags">${glutenTag(item.gluten)}${allergenTags(item.allergens)}${unitTag(item.units)}</div>
    </div>`;
  }
  function renderMenu() {
    document.querySelectorAll('[data-menu]').forEach(el => {
      const k = el.dataset.menu, h = el.dataset.heading || 'h4';
      if (k === 'laticinio' || k === 'pizzas') el.innerHTML = MENU[k].map((it, n) => card(it, n, h, k)).join('');
      else {
        const g = MENU.lists.find(x => x.id === k);
        if (g) el.innerHTML = g.items.map(row).join('');
      }
    });
  }

  /* ---------------- unit state ---------------- */
  let current = document.body.dataset.unit || store.get(KEY_UNIT) || '';
  if (!UNITS[current]) current = '';
  if (document.body.dataset.unit) store.set(KEY_UNIT, current);

  function applyUnit(swap) {
    const u = UNITS[current];
    document.querySelectorAll('[data-unit-label]').forEach(el => { el.textContent = u ? u.short : L.choose; });
    document.querySelectorAll('.unit-pick__menu a[data-unit]').forEach(a => a.setAttribute('aria-current', String(a.dataset.unit === current)));
    document.querySelectorAll('.unit[data-unit]').forEach(c => {
      const on = c.dataset.unit === current;
      c.classList.toggle('is-selected', on);
      const b = c.querySelector('[data-select-unit]');
      if (b) b.setAttribute('aria-pressed', String(on));
    });
    // sticky CTA is unit-aware: never books "a" restaurant, only the selected one
    document.querySelectorAll('[data-cta-reserve]').forEach(a => {
      const sm = a.querySelector('small');
      if (u) { a.href = `${ROOT}casas/${current}/index.html#reservar`; if (sm) sm.textContent = u.short; }
      else { a.href = `${ROOT}index.html#reservas`; if (sm) sm.textContent = L.choose; }
      if (swap && !reduce) { a.classList.add('fade-swap', 'is-swapping'); setTimeout(() => a.classList.remove('is-swapping'), 180); }
    });
    // menu filter
    document.querySelectorAll('.chip[data-filter]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.filter === (current || 'all'))));
    document.querySelectorAll('[data-units]').forEach(it => {
      const list = it.dataset.units;
      it.classList.toggle('is-hidden', !!current && list !== 'all' && !list.split(' ').includes(current));
    });
    // reservation module
    const r = document.querySelector(`input[name="res-unit"][value="${current}"]`);
    if (r && !r.checked) { r.checked = true; }
    renderResTarget();
  }
  function setUnit(k, swap) {
    current = UNITS[k] ? k : '';
    store.set(KEY_UNIT, current);
    applyUnit(swap);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-select-unit]');
    if (b) { e.preventDefault(); setUnit(b.dataset.selectUnit, true); }
    const ch = e.target.closest('.chip[data-filter]');
    if (ch) setUnit(ch.dataset.filter === 'all' ? '' : ch.dataset.filter, true);
  });
  document.querySelectorAll('.unit-pick__menu a[data-unit]').forEach(a => a.addEventListener('click', () => store.set(KEY_UNIT, a.dataset.unit)));

  function renderResTarget() {
    const box = document.querySelector('.res-target');
    if (!box) return;
    const checked = document.querySelector('input[name="res-unit"]:checked');
    const u = checked && UNITS[checked.value];
    const out = box.querySelector('.res-out');
    if (!u) { box.dataset.state = 'empty'; out.innerHTML = EN ? 'Choose a unit above — the booking widget only loads after that.' : 'Escolha a casa acima — o widget de reserva só carrega depois disso.'; return; }
    box.dataset.state = 'ready';
    out.innerHTML = `<strong>${esc(u.name)}</strong><br><span style="color:var(--muted)">${esc(u.address)}</span><br>${EN ? 'Hours' : 'Horário'}: ${u.hours ? esc(u.hours) : cf(L.hoursC)}`;
    const go = box.querySelector('.res-go');
    if (u.tagme) { go.href = u.tagme; go.removeAttribute('aria-disabled'); go.innerHTML = `${L.reserve} ${L.at} ${esc(u.short)} (Tagme)`; }
    else { go.removeAttribute('href'); go.setAttribute('aria-disabled', 'true'); go.innerHTML = `${L.reserve} ${L.at} ${esc(u.short)} ${cf(L.tagmeC)}`; }
  }
  document.querySelectorAll('input[name="res-unit"]').forEach(r => r.addEventListener('change', () => setUnit(r.value, true)));

  /* ---------------- chrome ---------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => { if (header) header.classList.toggle('is-condensed', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const mnav = document.getElementById('mobile-nav');
  if (toggle && mnav) {
    const setOpen = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? (EN ? 'Close menu' : 'Fechar menu') : (EN ? 'Open menu' : 'Abrir menu'));
      mnav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    mnav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (mnav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } document.querySelectorAll('.unit-pick[open]').forEach(d => d.removeAttribute('open')); } });
  }
  document.addEventListener('click', e => { document.querySelectorAll('.unit-pick[open]').forEach(d => { if (!d.contains(e.target)) d.removeAttribute('open'); }); });

  const menuLinks = [...document.querySelectorAll('.menu-nav a')];
  if (menuLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) menuLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    menuLinks.forEach(a => { const t = document.querySelector(a.getAttribute('href')); if (t) io.observe(t); });
  }

  // dairy rail: slow horizontal scroll-reveal (transform only)
  const rail = document.querySelector('.dairy-rail');
  if (rail) {
    const track = rail.querySelector('.dairy-track');
    if (reduce) rail.classList.add('is-static');
    else {
      let tick = false;
      const move = () => {
        const r = rail.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
        const max = Math.max(track.scrollWidth - rail.clientWidth, 0);
        track.style.transform = `translate3d(${-p * max}px,0,0)`;
        tick = false;
      };
      window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(move); } }, { passive: true });
      window.addEventListener('resize', move);
      move();
    }
  }

  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduce) {
    let t = false;
    window.addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { heroImg.style.transform = `translate3d(0,${Math.min(window.scrollY, 900) * 0.18}px,0) scale(1.06)`; t = false; }); }, { passive: true });
  }

  function reveals() {
    const els = document.querySelectorAll('.reveal:not(.is-in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }
  // count-up: wired for verified numbers only (data-count). None are verified on this lead — ships empty.
  function countUps() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const el = en.target, to = parseFloat(el.dataset.count);
      if (reduce || isNaN(to)) { el.textContent = el.dataset.count; return; }
      const t0 = performance.now();
      const step = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }));
    els.forEach(e => io.observe(e));
  }

  document.querySelectorAll('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const n = f.querySelector('.form-notice'); if (n) { n.classList.add('is-shown'); n.focus(); }
  }));

  // LGPD cookies
  const KEY = 'fc_cookie_consent_v1';
  const banner = document.getElementById('cookie');
  if (banner) {
    const prefs = banner.querySelector('.cookie__prefs');
    const a = banner.querySelector('#ck-analytics'), m = banner.querySelector('#ck-marketing');
    const pb = banner.querySelector('[data-ck="prefs"]');
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
    const close = v => { try { localStorage.setItem(KEY, JSON.stringify(Object.assign({ necessary: true, date: new Date().toISOString() }, v))); } catch (e) {} banner.hidden = true; prefs.hidden = true; pb.textContent = EN ? 'Preferences' : 'Preferências'; };
    banner.querySelector('[data-ck="accept"]').addEventListener('click', () => close({ analytics: true, marketing: true }));
    banner.querySelector('[data-ck="reject"]').addEventListener('click', () => close({ analytics: false, marketing: false }));
    pb.addEventListener('click', () => { if (prefs.hidden) { prefs.hidden = false; pb.textContent = EN ? 'Save preferences' : 'Salvar preferências'; } else close({ analytics: a.checked, marketing: m.checked }); });
    document.querySelectorAll('[data-cookie-open]').forEach(b => b.addEventListener('click', () => { const s = read(); a.checked = !!(s && s.analytics); m.checked = !!(s && s.marketing); banner.hidden = false; banner.querySelector('h2').focus(); }));
    if (!read()) banner.hidden = false;
  }
  // click-to-load map (LGPD: no third-party embed before the visitor asks)
  document.querySelectorAll('[data-map-load]').forEach(b => b.addEventListener('click', () => {
    const box = b.closest('[data-map]');
    if (!box) return;
    const f = document.createElement('iframe');
    f.src = `https://www.google.com/maps?q=${box.dataset.map}&output=embed`;
    f.title = box.dataset.mapTitle || 'Google Maps';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.innerHTML = ''; box.appendChild(f); box.classList.add('is-loaded');
  }));
  document.querySelectorAll('[data-year]').forEach(y => { y.textContent = new Date().getFullYear(); });

  renderMenu();
  applyUnit(false);
  reveals();
  countUps();
})();

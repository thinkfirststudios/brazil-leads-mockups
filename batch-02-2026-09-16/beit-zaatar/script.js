/* ==========================================================================
   Beit Za'atar — mockup script
   --------------------------------------------------------------------------
   ▼▼▼ CARDÁPIO (MESA DE MEZZE) — EDITE AQUI ▼▼▼
   • Dish names below come ONLY from a search-engine cache of their now-offline
     site (hummus, babaganoush, kibes, kaftas, shawarmas, falafel, esfihas).
     They indicate range — every one renders with a visible [CONFIRM].
     Set `confirmed: true` once the client confirms the dish is on the current menu.
   • origin: the Arabic-origin name exactly as the CLIENT writes it. Never
     machine-translate or transliterate. null = visible [CONFIRM].
   • diet:  confirmed dietary labels, e.g. ['vegano','vegetariano'] (confirm
     PREPARATION — shared fryer, butter, yoghurt sauces — not just ingredients).
     dietQ: candidate labels awaiting confirmation (shown as "Vegano? [CONFIRM]").
   • gluten: 'contem' | 'nao-contem' | null   (Lei 10.674/2003)
   • allergens: ['gergelim','trigo'] | null    (ANVISA RDC 26/2015)
   • price: 'R$ 00,00' | null · portion: shared-plate size | null
   ========================================================================== */
const IMG = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 320}&q=70`;
const COURSES = [
  { id: 'para-comecar', pt: 'Para começar', en: 'To start', notePt: 'Pastas e pequenos pratos', noteEn: 'Dips and small plates', items: [
    { name: 'Hummus', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: ['vegano', 'vegetariano'], gluten: null, allergens: null, img: '1637949385162-e416fb15b2ce', alt: 'Tigela de hummus com azeite e páprica, vista de cima', altEn: 'Bowl of hummus with olive oil and paprika, from above' },
    { name: 'Babaganoush', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: ['vegano', 'vegetariano'], gluten: null, allergens: null, img: '1697126248437-db26a30024c5', alt: 'Pasta cremosa servida com pão sírio, vista de cima', altEn: 'Creamy dip served with pita bread, from above' },
    { name: 'Falafel', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: ['vegano', 'vegetariano'], gluten: null, allergens: null, img: '1593001872095-7d5b3868fb1d', alt: 'Bolinhos de falafel em tigela branca', altEn: 'Falafel balls in a white bowl' }
  ]},
  { id: 'para-dividir', pt: 'Para dividir', en: 'To share', notePt: 'Travessas de mezze para a mesa', noteEn: 'Mezze platters for the table', share: true, items: [
    { name: null, confirmed: false, origin: null, desc: null, price: null, portion: null, diet: null, dietQ: ['vegetariano'], gluten: null, allergens: null, img: '1743674453093-592bed88018e', alt: 'Travessa de mezze com pães, pastas e salada', altEn: 'Mezze platter with breads, dips and salad' },
    { name: null, confirmed: false, origin: null, desc: null, price: null, portion: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1748540459503-19efc015143b', alt: 'Mesa com vários pratos para compartilhar, vista de cima', altEn: 'Table with several sharing dishes, from above' }
  ]},
  { id: 'do-forno', pt: 'Do forno', en: 'From the oven', notePt: 'Esfihas, pães e assados', noteEn: 'Esfihas, breads and bakes', items: [
    { name: 'Esfiha', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1549931319-a545dcf3bc73', alt: 'Pão assado fatiado sobre tábua de madeira', altEn: 'Sliced baked bread on a wooden board' },
    { name: 'Kibe', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1558458601-0d69a278b8e6', alt: 'Bolinhos dourados com gergelim', altEn: 'Golden bites with sesame' }
  ]},
  { id: 'no-espeto', pt: 'No espeto / na chapa', en: 'Skewers & griddle', notePt: 'Shawarma, kafta e grelhados', noteEn: 'Shawarma, kafta and grills', items: [
    { name: 'Shawarma', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1529006557810-274b9b2fc783', alt: 'Shawarma enrolado com carne, cebola e batata', altEn: 'Wrapped shawarma with meat, onion and fries' },
    { name: 'Kafta', confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1771285119408-04cca3b35036', alt: 'Travessa de espetos grelhados com salada', altEn: 'Platter of grilled skewers with salad' }
  ]},
  { id: 'doces', pt: 'Doces', en: 'Sweets', notePt: 'Sobremesas', noteEn: 'Desserts', items: [
    { name: null, confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1761828122856-8703baac8e86', alt: 'Doces folhados com pistache', altEn: 'Flaky pastries with pistachio' }
  ]},
  { id: 'bebidas', pt: 'Bebidas', en: 'Drinks', notePt: 'Incluindo bebidas tradicionais', noteEn: 'Including traditional drinks', items: [
    { name: null, confirmed: false, origin: null, desc: null, price: null, diet: null, dietQ: null, gluten: null, allergens: null, img: '1474979266404-7eaacbcd87c5', alt: 'Garrafa de vidro com azeite sobre mesa escura', altEn: 'Glass bottle of olive oil on a dark table' }
  ]}
];
/* ▲▲▲ FIM DO BLOCO EDITÁVEL ▲▲▲ */

(function () {
  'use strict';
  const EN = (document.documentElement.lang || '').toLowerCase().startsWith('en');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cf = t => `<span class="confirm">[${esc(t)}]</span>`;
  const L = EN ? {
    dish: 'CONFIRM dish', origin: 'Name of origin', originC: 'CONFIRM — client spelling only', desc: 'CONFIRM description', price: 'CONFIRM price',
    gluten: 'Contains / gluten-free', allergens: 'Allergens', share: 'To share · portion', photo: 'Illustrative photo', q: 'CONFIRM preparation',
    empty: 'No dish here has a confirmed label for this filter yet.', diet: { vegano: 'Vegan', vegetariano: 'Vegetarian' }
  } : {
    dish: 'CONFIRM prato', origin: 'Nome de origem', originC: 'CONFIRM — grafia do cliente', desc: 'CONFIRM descrição', price: 'CONFIRM preço',
    gluten: 'Contém / não contém glúten', allergens: 'Alérgenos', share: 'Para dividir · porção', photo: 'Foto ilustrativa', q: 'CONFIRM preparo',
    empty: 'Nenhum prato deste grupo tem este selo ainda.', diet: { vegano: 'Vegano', vegetariano: 'Vegetariano' }
  };

  function plate(it, n, share, h) {
    const tags = [];
    (it.diet || []).forEach(d => tags.push(`<span class="tag tag--diet">${L.diet[d] || esc(d)}</span>`));
    (it.dietQ || []).filter(d => !(it.diet || []).includes(d)).forEach(d => tags.push(`<span class="tag tag--diet-q">${L.diet[d] || esc(d)}? ${cf(L.q)}</span>`));
    tags.push(it.gluten === 'contem' ? `<span class="tag">${EN ? 'Contains gluten' : 'Contém glúten'}</span>` : it.gluten === 'nao-contem' ? `<span class="tag">${EN ? 'Gluten-free' : 'Não contém glúten'}</span>` : `<span class="tag">${L.gluten} ${cf('CONFIRM')}</span>`);
    tags.push(it.allergens ? it.allergens.map(a => `<span class="tag tag--allergen">${esc(a)}</span>`).join('') : `<span class="tag tag--allergen">${L.allergens} ${cf('CONFIRM')}</span>`);
    if (share) tags.push(`<span class="tag tag--share">${L.share} ${it.portion ? esc(it.portion) : cf('CONFIRM')}</span>`);
    const dietAttr = [...new Set([...(it.diet || []), ...(it.dietQ || [])])].join(' ');
    return `<article class="plate reveal" style="--i:${n % 4}" data-diet="${dietAttr}">
      <figure class="plate__img"><img src="${IMG(it.img, 320)}" alt="${esc(EN && it.altEn ? it.altEn : it.alt)}" loading="lazy" width="264" height="264"></figure>
      <span class="plate__badge">${L.photo}</span>
      <${h} class="plate__name">${it.name ? esc(it.name) + (it.confirmed ? '' : ' ' + cf('CONFIRM')) : cf(L.dish)}</${h}>
      <p class="plate__origin">${L.origin}: ${it.origin ? esc(it.origin) : cf(L.originC)}</p>
      <p class="plate__desc">${it.desc ? esc(it.desc) : cf(L.desc)}</p>
      <p style="margin:0">${it.price ? `<span class="price">${esc(it.price)}</span>` : `<span class="price">R$ 00,00</span> ${cf(L.price)}`}</p>
      <div class="tags">${tags.join('')}</div>
    </article>`;
  }
  function renderMenu() {
    document.querySelectorAll('[data-course]').forEach(el => {
      const c = COURSES.find(x => x.id === el.dataset.course);
      if (!c) return;
      const h = el.dataset.heading || 'h4';
      el.setAttribute('data-empty', L.empty);
      el.innerHTML = c.items.map((it, n) => plate(it, n, c.share, h)).join('');
    });
  }

  /* ---------- vegan / vegetarian filter (signature motion) ---------- */
  const KEY_DIET = 'bz_diet_v1';
  let diet = document.body.dataset.diet || (function () { try { return localStorage.getItem(KEY_DIET); } catch (e) { return null; } })() || 'all';
  function applyDiet(animate) {
    document.querySelectorAll('.chip[data-diet]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.diet === diet)));
    document.querySelectorAll('.plate[data-diet]').forEach(p => {
      const show = diet === 'all' || p.dataset.diet.split(' ').includes(diet);
      if (!animate || reduce) { p.classList.toggle('is-gone', !show); p.classList.toggle('is-out', false); return; }
      if (show) { p.classList.remove('is-gone'); requestAnimationFrame(() => requestAnimationFrame(() => p.classList.remove('is-out'))); p.classList.add('is-in'); }
      else { p.classList.add('is-out'); setTimeout(() => { if (p.classList.contains('is-out')) p.classList.add('is-gone'); }, 320); }
    });
    setTimeout(() => {
      document.querySelectorAll('.course').forEach(c => {
        const plates = c.querySelectorAll('.plate');
        c.classList.toggle('is-empty', plates.length > 0 && [...plates].every(p => p.classList.contains('is-gone')));
      });
    }, animate && !reduce ? 340 : 0);
    const live = document.getElementById('diet-live');
    if (live) {
      const n = [...document.querySelectorAll('.plate[data-diet]')].filter(p => diet === 'all' || p.dataset.diet.split(' ').includes(diet)).length;
      live.textContent = EN ? `${n} dishes shown` : `${n} pratos exibidos`;
    }
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('.chip[data-diet]');
    if (!c) return;
    diet = c.dataset.diet;
    if (!document.body.dataset.diet) { try { localStorage.setItem(KEY_DIET, diet); } catch (err) { /* blocked */ } }
    applyDiet(true);
  });

  /* ---------- chrome ---------- */
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
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
  }

  const anchors = [...document.querySelectorAll('.menu-anchors a')];
  if (anchors.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) anchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    anchors.forEach(a => { const t = document.querySelector(a.getAttribute('href')); if (t) io.observe(t); });
  }

  // hero tile parallax + warm drift (transform only)
  const tiles = document.querySelector('.hero__tiles');
  if (tiles && !reduce) {
    let t = false;
    window.addEventListener('scroll', () => { if (t) return; t = true; requestAnimationFrame(() => { tiles.style.transform = `translate3d(0,${Math.min(window.scrollY, 1000) * 0.25}px,0)`; t = false; }); }, { passive: true });
  }

  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.carousel__track');
    const step = () => Math.max(track.clientWidth * 0.8, 240);
    c.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    c.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  function reveals() {
    const els = document.querySelectorAll('.reveal:not(.is-in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }
  // count-up: wired for verified numbers only (data-count). None verified on this lead — ships empty.
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

  // click-to-load map — stays disabled until a confirmed address is set in data-map
  document.querySelectorAll('[data-map-load]').forEach(b => b.addEventListener('click', () => {
    const box = b.closest('[data-map]');
    if (!box || !box.dataset.map) return;
    const f = document.createElement('iframe');
    f.src = `https://www.google.com/maps?q=${box.dataset.map}&output=embed`;
    f.title = box.dataset.mapTitle || 'Google Maps';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.innerHTML = ''; box.appendChild(f); box.classList.add('is-loaded');
  }));

  // LGPD cookies
  const KEY = 'bz_cookie_consent_v1';
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
  document.querySelectorAll('[data-year]').forEach(y => { y.textContent = new Date().getFullYear(); });

  renderMenu();
  applyDiet(false);
  reveals();
  countUps();
})();

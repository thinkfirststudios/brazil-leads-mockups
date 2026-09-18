/* ==========================================================================
   BIBI Pizza — mockup script
   --------------------------------------------------------------------------
   ▼▼▼ CARDÁPIO — EDITE AQUI ▼▼▼
   The whole menu renders from the MENU object below. A price change is a
   one-line edit: replace `null` with the value, e.g.  price: 'R$ 54,00'.
   `null` renders a visible [CONFIRM] placeholder — nothing is invented.
   NOTHING below comes from their Google Drive PDF (it could not be read).
   gluten: 'contem' | 'nao-contem' | null   (Lei 10.674/2003 — required per item)
   allergens: array, e.g. ['trigo','leite']  (ANVISA RDC 26/2015) — null = [CONFIRM]
   diet: array, e.g. ['vegetariano']         — null = no tag shown until confirmed
   In production this same data should be pre-rendered to static HTML
   (the HTML files already ship a pre-rendered copy for no-JS / crawlers).
   ========================================================================== */
const U = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 640}&q=70`;

const MENU = {
  rodizio: {
    price: null,                 // [CONFIRM preço do rodízio] e.g. 'R$ 00,00 por pessoa'
    optionsLine: 'mais de 40 opções, entre entradas, massas e pizzas napolitanas salgadas e doces', // verified on their site
    rules: null,                 // [CONFIRM: dias, horários, política de crianças, tempo limite]
    categories: [
      { pt: 'Entradas',         en: 'Starters',      items: [null, null, null] },
      { pt: 'Massas',           en: 'Pasta',         items: [null, null, null] },
      { pt: 'Pizzas salgadas',  en: 'Savoury pizzas',items: [null, null, null, null] },
      { pt: 'Pizzas doces',     en: 'Sweet pizzas',  items: [null, null] }
    ]
  },
  pizzas: [
    { name: null, ingredients: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, img: '1574071318508-1cdbab80d002', alt: 'Pizza napolitana com borda alta e manjericão sobre mesa de pedra', altEn: 'Neapolitan pizza with a puffy crust and basil on a stone table' },
    { name: null, ingredients: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, img: '1593560708920-61dd98c46a4e', alt: 'Pizza com folhas verdes e queijo fresco em fundo escuro', altEn: 'Pizza topped with greens and fresh cheese on a dark background' },
    { name: null, ingredients: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, img: '1595854341625-f33ee10dbf94', alt: 'Pizza com tomate e manjericão vista de cima em fundo escuro', altEn: 'Overhead view of a tomato and basil pizza on a dark background' },
    { name: null, ingredients: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, img: '1506354666786-959d6d497f1a', alt: 'Pizza fatiada com tomate e azeitonas sobre mesa de madeira', altEn: 'Sliced pizza with tomato and olives on a wooden table' },
    { name: null, ingredients: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, img: '1541745537411-b8046dc6d66c', alt: 'Fatia de pizza sendo levantada com queijo derretido', altEn: 'A slice of pizza being lifted with melted cheese' },
    { name: null, ingredients: null, sizes: null, price: null, gluten: null, allergens: null, diet: null, img: '1590947132387-155cc02f3212', alt: 'Pizza fatiada com tomates e folhas sobre tábua escura', altEn: 'Sliced pizza with tomatoes and greens on a dark board' }
  ],
  lists: [
    { pt: 'Entradas',   en: 'Starters', items: [ {name:null,desc:null,price:null,gluten:null}, {name:null,desc:null,price:null,gluten:null}, {name:null,desc:null,price:null,gluten:null} ] },
    { pt: 'Massas',     en: 'Pasta',    items: [ {name:null,desc:null,price:null,gluten:null}, {name:null,desc:null,price:null,gluten:null}, {name:null,desc:null,price:null,gluten:null} ] },
    { pt: 'Sobremesas', en: 'Desserts', items: [ {name:null,desc:null,price:null,gluten:null}, {name:null,desc:null,price:null,gluten:null} ] }
  ],
  bebidas: [
    { pt: 'Chopp',          en: 'Draught beer',    items: [ {name:null,desc:null,price:null,happy:true}, {name:null,desc:null,price:null,happy:true} ] },
    { pt: 'Vinhos (taça)',  en: 'Wine (glass)',    items: [ {name:null,desc:null,price:null,happy:true}, {name:null,desc:null,price:null,happy:true} ] },
    { pt: 'Sem álcool',     en: 'Non-alcoholic',   items: [ {name:null,desc:null,price:null}, {name:null,desc:null,price:null} ] }
  ]
};

/* HAPPY HOUR — verified on their site. [CONFIRM — promoção vigente?]
   Promotions expire: a stale promo left online is a CDC exposure. Edit or set active:false. */
const HAPPY_HOUR = { active: true, days: [1, 2, 3, 4, 5], start: '18:00', end: '19:30', tz: 'America/Sao_Paulo' };
/* ▲▲▲ FIM DO BLOCO EDITÁVEL ▲▲▲ */

(function () {
  'use strict';
  const doc = document.documentElement;
  const EN = (doc.lang || '').toLowerCase().startsWith('en');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const T = EN ? {
    flavour: 'CONFIRM flavour', name: 'CONFIRM name', ingr: 'CONFIRM ingredients', sizes: 'CONFIRM sizes', price: 'CONFIRM price',
    gluten: 'CONFIRM gluten', allergens: 'CONFIRM allergens', desc: 'CONFIRM description', hh: 'Happy hour 50% OFF', sizesLabel: 'Sizes'
  } : {
    flavour: 'CONFIRM sabor', name: 'CONFIRM nome', ingr: 'CONFIRM ingredientes', sizes: 'CONFIRM tamanhos', price: 'CONFIRM preço',
    gluten: 'CONFIRM glúten', allergens: 'CONFIRM alérgenos', desc: 'CONFIRM descrição', hh: 'Happy hour 50% OFF', sizesLabel: 'Tamanhos'
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cf = label => `<span class="confirm">[${esc(label)}]</span>`;
  const priceHtml = p => p ? `<span class="price">${esc(p)}</span>` : `<span class="price">R$ 00,00</span> ${cf(T.price)}`;
  const glutenTag = g => g === 'contem' ? `<span class="tag tag--gluten">${EN ? 'Contains gluten' : 'Contém glúten'}</span>`
    : g === 'nao-contem' ? `<span class="tag tag--gluten">${EN ? 'Gluten-free' : 'Não contém glúten'}</span>`
    : `<span class="tag tag--gluten">${EN ? 'Contains / gluten-free' : 'Contém / não contém glúten'} ${cf(T.gluten)}</span>`;
  const allergenTag = a => a ? a.map(x => `<span class="tag tag--allergen">${esc(x)}</span>`).join('') : `<span class="tag tag--allergen">${EN ? 'Allergens' : 'Alérgenos'} ${cf(T.allergens)}</span>`;
  const dietTag = d => d ? d.map(x => `<span class="tag tag--diet">${esc(x)}</span>`).join('') : `<span class="tag tag--diet">${EN ? 'Dietary' : 'Dieta'} ${cf('CONFIRM')}</span>`;

  function renderMenu() {
    const cats = document.querySelectorAll('[data-menu="rodizio"]');
    cats.forEach(el => {
      const h = el.dataset.heading || 'h4';
      el.innerHTML = MENU.rodizio.categories.map(c => `
        <div class="rodizio-cat"><${h}>${esc(EN ? c.en : c.pt)}</${h}><ul>${c.items.map(i => `<li>${i ? esc(i) : cf(T.flavour)}</li>`).join('')}</ul></div>`).join('');
    });
    document.querySelectorAll('[data-menu="rodizio-price"]').forEach(el => {
      el.innerHTML = MENU.rodizio.price ? esc(MENU.rodizio.price) : `R$ 00,00 ${cf(EN ? 'CONFIRM all-you-can-eat price' : 'CONFIRM preço do rodízio')}`;
    });
    document.querySelectorAll('[data-menu="pizzas"]').forEach(el => {
      const h = el.dataset.heading || 'h4';
      el.innerHTML = MENU.pizzas.map((p, n) => `
        <article class="dish reveal" style="--i:${n % 3}">
          <figure class="dish__media"><!-- PLACEHOLDER-menu-pizza-${n + 1} -->
            <img src="${U(p.img, 640)}" alt="${esc(EN && p.altEn ? p.altEn : p.alt)}" loading="lazy" width="640" height="480">
            <span class="photo-badge">${EN ? 'Illustrative photo — placeholder' : 'Foto ilustrativa — placeholder'}</span>
          </figure>
          <div class="dish__body">
            <div class="dish__top"><${h} class="dish__name">${p.name ? esc(p.name) : cf(T.name)}</${h}></div>
            <p class="dish__desc">${p.ingredients ? esc(p.ingredients) : cf(T.ingr)}</p>
            <p class="dish__meta">${T.sizesLabel}: ${p.sizes ? esc(p.sizes) : cf(T.sizes)}</p>
            <p class="dish__meta">${priceHtml(p.price)}</p>
            <div class="tags">${glutenTag(p.gluten)}${allergenTag(p.allergens)}${dietTag(p.diet)}</div>
          </div>
        </article>`).join('');
    });
    const listHtml = (groups, h) => groups.map(g => `<${h}>${esc(EN ? g.en : g.pt)}</${h}>` + g.items.map(i => `
        <div class="row">
          <div class="row__top"><span class="row__name">${i.name ? esc(i.name) : cf(T.name)}</span><span class="row__dots" aria-hidden="true"></span>${priceHtml(i.price)}</div>
          <p>${i.desc ? esc(i.desc) : cf(T.desc)}</p>
          <div class="tags">${i.happy ? `<span class="tag tag--diet">${T.hh}</span>` : ''}${i.gluten !== undefined ? glutenTag(i.gluten) + allergenTag(i.allergens || null) : ''}</div>
        </div>`).join('')).join('');
    document.querySelectorAll('[data-menu="lists"]').forEach(el => { el.innerHTML = listHtml(MENU.lists, el.dataset.heading || 'h4'); });
    document.querySelectorAll('[data-menu="bebidas"]').forEach(el => { el.innerHTML = listHtml(MENU.bebidas, el.dataset.heading || 'h4'); });
  }

  /* ---------- header condense ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => { if (header) header.classList.toggle('is-condensed', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
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

  /* ---------- four-track switcher ---------- */
  document.querySelectorAll('[data-tabs]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const line = root.querySelector('.tab-underline');
    const select = (tab, focus) => {
      tabs.forEach((t, i) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        if (on) {
          panel.hidden = false;
          panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering');
          if (line) { line.style.transform = `translateX(${i * 100}%)`; line.style.setProperty('--track-color', t.dataset.color || ''); }
          root.style.setProperty('--track-color', t.dataset.color || '');
        } else panel.hidden = true;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') n = 0;
        if (e.key === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(tabs[n], true); }
      });
    });
    const hashTab = tabs.find(t => location.hash && t.dataset.hash === location.hash.slice(1));
    select(hashTab || tabs[0]);
  });

  /* ---------- menu anchor highlight ---------- */
  const menuLinks = [...document.querySelectorAll('.menu-nav a')];
  if (menuLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) menuLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    menuLinks.forEach(a => { const t = document.querySelector(a.getAttribute('href')); if (t) io.observe(t); });
  }

  /* ---------- carousel ---------- */
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.carousel__track');
    const step = () => Math.max(track.clientWidth * 0.8, 240);
    c.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    c.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  /* ---------- happy-hour status (degrades to static text) ---------- */
  function hhStatus() {
    const el = document.querySelectorAll('[data-hh-status]');
    if (!el.length || !HAPPY_HOUR.active) return;
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: HAPPY_HOUR.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const get = t => parts.find(p => p.type === t).value;
      const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
      const mins = parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10);
      const toM = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
      const s = toM(HAPPY_HOUR.start), e = toM(HAPPY_HOUR.end);
      const isDay = HAPPY_HOUR.days.includes(dayIdx);
      let txt, live = false;
      if (isDay && mins >= s && mins < e) { const left = e - mins; live = true; txt = EN ? `Happy hour is on now — ends in ${Math.floor(left / 60)}h${String(left % 60).padStart(2, '0')}` : `Happy hour acontecendo agora — termina em ${Math.floor(left / 60)}h${String(left % 60).padStart(2, '0')}`; }
      else if (isDay && mins < s) { const left = s - mins; txt = EN ? `Happy hour starts in ${Math.floor(left / 60)}h${String(left % 60).padStart(2, '0')}` : `Happy hour começa em ${Math.floor(left / 60)}h${String(left % 60).padStart(2, '0')}`; }
      else txt = EN ? 'Next happy hour: Monday to Friday, 18:00–19:30' : 'Próximo happy hour: segunda a sexta, 18h às 19h30';
      el.forEach(n => { n.querySelector('.txt').textContent = txt; n.classList.toggle('is-live', live); });
    } catch (err) { /* keep static text */ }
  }
  hhStatus();
  setInterval(hhStatus, 60000);

  /* ---------- scroll reveals ---------- */
  function reveals() {
    const els = document.querySelectorAll('.reveal:not(.is-in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }

  /* ---------- count-up (only for verified numbers: data-count) ---------- */
  function countUps() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const run = el => {
      const to = parseFloat(el.dataset.count);
      if (reduce || isNaN(to)) { el.textContent = el.dataset.count; return; }
      const t0 = performance.now(), d = 1400;
      const tick = t => { const p = Math.min((t - t0) / d, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }));
    els.forEach(e => io.observe(e));
  }

  /* ---------- hero parallax (transform only) ---------- */
  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduce) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { const y = Math.min(window.scrollY, 900); heroImg.style.transform = `translate3d(0,${y * 0.18}px,0) scale(1.06)`; ticking = false; });
    }, { passive: true });
  }

  /* ---------- demo forms ---------- */
  document.querySelectorAll('form[data-demo]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const n = f.querySelector('.form-notice');
      if (!f.checkValidity()) { f.reportValidity(); return; }
      if (n) { n.classList.add('is-shown'); n.focus?.(); }
    });
  });
  // DD/MM mask for date inputs
  document.querySelectorAll('input[data-ddmm]').forEach(i => i.addEventListener('input', () => {
    let v = i.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    i.value = v;
  }));

  /* ---------- LGPD cookie banner ---------- */
  const KEY = 'bibi_cookie_consent_v1';
  const banner = document.getElementById('cookie');
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };
  if (banner) {
    const prefs = banner.querySelector('.cookie__prefs');
    const boxA = banner.querySelector('#ck-analytics');
    const boxM = banner.querySelector('#ck-marketing');
    const prefBtn = banner.querySelector('[data-ck="prefs"]');
    const open = () => {
      const s = store.get();
      boxA.checked = !!(s && s.analytics); boxM.checked = !!(s && s.marketing);
      banner.hidden = false;
      banner.querySelector('h2').focus();
    };
    const close = v => { store.set(Object.assign({ necessary: true, date: new Date().toISOString() }, v)); banner.hidden = true; prefs.hidden = true; prefBtn.textContent = EN ? 'Preferences' : 'Preferências'; };
    banner.querySelector('[data-ck="accept"]').addEventListener('click', () => close({ analytics: true, marketing: true }));
    banner.querySelector('[data-ck="reject"]').addEventListener('click', () => close({ analytics: false, marketing: false }));
    prefBtn.addEventListener('click', () => {
      if (prefs.hidden) { prefs.hidden = false; prefBtn.textContent = EN ? 'Save preferences' : 'Salvar preferências'; }
      else close({ analytics: boxA.checked, marketing: boxM.checked });
    });
    document.querySelectorAll('[data-cookie-open]').forEach(b => b.addEventListener('click', open));
    if (!store.get()) banner.hidden = false;
  }

  /* ---------- click-to-load map (LGPD: no third-party embed before the visitor asks) ---------- */
  document.querySelectorAll('[data-map-load]').forEach(b => b.addEventListener('click', () => {
    const box = b.closest('[data-map]');
    if (!box) return;
    const f = document.createElement('iframe');
    f.src = `https://www.google.com/maps?q=${box.dataset.map}&output=embed`;
    f.title = box.dataset.mapTitle || 'Google Maps';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.innerHTML = '';
    box.appendChild(f);
    box.classList.add('is-loaded');
  }));

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(y => { y.textContent = new Date().getFullYear(); });

  renderMenu();
  reveals();
  countUps();
})();

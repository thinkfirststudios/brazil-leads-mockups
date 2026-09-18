/* ==========================================================================
   Divina Terra Floripa — MOCKUP script
   ==========================================================================
   ██ DATA FILE — edit everything the page shows from here ██
   Every value below is a PLACEHOLDER until the franchisee confirms it.
   • Never add a product, brand, price or certification that is not on the
     Trindade shelf and confirmed in writing.
   • There is deliberately NO "benefits" / "para que serve" field on a
     product. Do not add one (ANVISA — no health claims).
   • `cert` holds a REAL certification mark only (name + certificate ref).
     While null, the card shows "[CONFIRM certificação]".
   ========================================================================== */
const STORE = {
  // WhatsApp NOT verified — keep null until the unit's own number is confirmed.
  // Format when confirmed: '55' + DDD + number, digits only, e.g. '5548XXXXXXXXX'.
  whatsapp: null,
  // Opening hours NOT published anywhere — keep null until confirmed.
  // Shape when confirmed (24h format, 0 = domingo):
  // hours: { 0:null, 1:[['09:00','19:00']], ... 6:[['09:00','13:00']] }
  hours: null,
  mapsQuery: 'R. Lauro Linhares, 898 - Trindade, Florianópolis - SC' // [CONFIRM] third-party address
};

const IMG = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// price: number in BRL or null · perKg: true when sold by weight
// stock: 'loja' | 'encomenda' | null · cert: null | {name:'', ref:''}
// diet: any of 'sem-gluten','sem-lactose','vegano','sem-acucar' (all [CONFIRM])
const PH_PRODUCT = (o = {}) => Object.assign({ name: null, brand: null, unit: null, price: null, perKg: false, stock: null, cert: null, diet: [], img: null }, o);

const AISLES = [
  { id: 'suplementos', label: { pt: 'Suplementos', en: 'Supplements' }, img: 'photo-1593095948071-474c5cc2989d',
    products: [
      PH_PRODUCT({ stock: 'loja', diet: ['vegano'], img: 'photo-1593095948071-474c5cc2989d' }),
      PH_PRODUCT({ stock: 'encomenda', img: 'photo-1601647998384-a6e5b618e8f6' }),
      PH_PRODUCT({ diet: ['sem-lactose'], img: 'photo-1584473457406-6240486418e9' })
    ] },
  { id: 'mercearia', label: { pt: 'Mercearia', en: 'Pantry' }, img: 'photo-1614961233913-a5113a4a34ed',
    products: [
      PH_PRODUCT({ stock: 'loja', diet: ['sem-gluten'], img: 'photo-1614961233913-a5113a4a34ed' }),
      PH_PRODUCT({ perKg: true, stock: 'loja', img: 'photo-1586201375761-83865001e31c' }),
      PH_PRODUCT({ diet: ['sem-acucar'], img: 'photo-1558642452-9d2a7deb7f62' }),
      PH_PRODUCT({ perKg: true, img: 'photo-1515543904379-3d757afe72e4' })
    ] },
  { id: 'congelados', label: { pt: 'Congelados', en: 'Frozen' }, img: 'photo-1498557850523-fd3d118b962e',
    products: [
      PH_PRODUCT({ stock: 'encomenda', diet: ['vegano'], img: 'photo-1498557850523-fd3d118b962e' }),
      PH_PRODUCT({ img: 'photo-1464965911861-746a04b4bca6' })
    ] },
  { id: 'padaria', label: { pt: 'Padaria', en: 'Bakery' }, img: 'photo-1509440159596-0249088772ff',
    products: [
      PH_PRODUCT({ stock: 'loja', diet: ['sem-gluten'], img: 'photo-1509440159596-0249088772ff' }),
      PH_PRODUCT({ img: 'photo-1549931319-a545dcf3bc73' })
    ] },
  { id: 'bebidas', label: { pt: 'Bebidas', en: 'Drinks' }, img: 'photo-1556767576-5ec41e3239ea',
    products: [
      PH_PRODUCT({ stock: 'loja', img: 'photo-1556767576-5ec41e3239ea' }),
      PH_PRODUCT({ diet: ['sem-acucar'], img: 'photo-1622597467836-f3285f2131b8' })
    ] },
  { id: 'higiene', label: { pt: 'Higiene & cosméticos', en: 'Personal care' }, img: 'photo-1612817288484-6f916006741a',
    products: [
      PH_PRODUCT({ stock: 'loja', diet: ['vegano'], img: 'photo-1612817288484-6f916006741a' }),
      PH_PRODUCT({ img: 'photo-1607006344380-b6775a0824a7' })
    ] },
  // Empty on purpose — demonstrates the empty state until a stock list arrives.
  { id: 'casa', label: { pt: 'Casa', en: 'Home' }, img: 'photo-1563453392212-326f5e854473', products: [] }
];

/* ---------------- i18n (labels only — content lives in the HTML trees) --- */
const LANG = (document.documentElement.lang || 'pt-BR').toLowerCase().startsWith('en') ? 'en' : 'pt';
const T = {
  pt: {
    product: '[CONFIRM produto]', brand: '[CONFIRM marca]', unit: '[CONFIRM unidade — 300g / 1kg / 60 cápsulas / a granel]',
    loja: 'Disponível em loja', encomenda: 'Sob encomenda', unknown: 'Disponibilidade',
    cert: '[CONFIRM certificação]', certLabel: 'Selo de certificação',
    diet: { 'sem-gluten': 'sem glúten', 'sem-lactose': 'sem lactose', vegano: 'vegano', 'sem-acucar': 'sem açúcar adicionado' },
    ask: 'Perguntar pelo WhatsApp', askConfirm: '[CONFIRM WhatsApp]',
    empty: 'Estoque em atualização — pergunte pelo WhatsApp o que você procura.',
    photo: 'FOTO ILUSTRATIVA — placeholder', aisleConfirm: '[CONFIRM corredor nesta unidade]',
    waMsg: a => `Olá! Vocês têm no corredor ${a} o produto: `,
    open: 'Aberto agora', closed: 'Fechado', hoursPending: 'Horário a confirmar',
    formOk: 'Demonstração: nada foi enviado. No site real, esta mensagem seguiria para a loja.',
    formErr: 'Preencha os campos obrigatórios e marque o consentimento para continuar.',
    alt: a => `Foto ilustrativa de banco de imagens para o corredor ${a} — não é a loja da Trindade`
  },
  en: {
    product: '[CONFIRM product]', brand: '[CONFIRM brand]', unit: '[CONFIRM size — 300g / 1kg / 60 capsules / bulk]',
    loja: 'In store now', encomenda: 'To order', unknown: 'Availability',
    cert: '[CONFIRM certification]', certLabel: 'Certification mark',
    diet: { 'sem-gluten': 'gluten-free', 'sem-lactose': 'lactose-free', vegano: 'vegan', 'sem-acucar': 'no added sugar' },
    ask: 'Ask on WhatsApp', askConfirm: '[CONFIRM WhatsApp]',
    empty: 'Stock list being updated — ask us on WhatsApp for what you need.',
    photo: 'STOCK PHOTO — placeholder', aisleConfirm: '[CONFIRM aisle at this store]',
    waMsg: a => `Hi! Do you have this in the ${a} aisle: `,
    open: 'Open now', closed: 'Closed', hoursPending: 'Hours to be confirmed',
    formOk: 'Demo only: nothing was sent. On the live site this message would go to the store.',
    formErr: 'Please fill in the required fields and tick the consent box to continue.',
    alt: a => `Illustrative stock photo for the ${a} aisle — not the Trindade store`
  }
}[LANG];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* WhatsApp link helper: real wa.me only when a verified number exists. */
function waHref(text) {
  if (!STORE.whatsapp) return '#contato';
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}
const WA_SVG = '<svg class="wa-ico" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.3.6 4.5 1.8 6.5L3 29l6.9-1.8c1.9 1 4 1.6 6.1 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.4 16 26.4zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2s0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/></svg>',
  seal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="10" r="6"/><path d="m9 15-1.5 6L12 19l4.5 2L15 15"/><path d="m9.5 10 1.8 1.8L14.8 8.5"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14zm0 0 7-7"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>'
};

/* ---------------- Aisle navigator ---------------- */
function productCard(p, aisleLabel) {
  const stockCls = p.stock ? `stock-${p.stock}` : 'stock-unknown';
  const stockTxt = p.stock ? T[p.stock] : T.unknown;
  const price = p.price != null ? brl(p.price) : 'R$ 00,00';
  const diet = p.diet.length
    ? `<ul class="diet" aria-label="Marcas alimentares">${p.diet.map(d => `<li>${ICON.leaf}${T.diet[d]} <span class="confirm">[CONFIRM]</span></li>`).join('')}</ul>`
    : '';
  const cert = p.cert
    ? `<div class="cert-slot">${ICON.seal}<span>${esc(p.cert.name)} — ${esc(p.cert.ref)}</span></div>`
    : `<div class="cert-slot" aria-label="${T.certLabel}">${ICON.seal}<span>${T.certLabel}: <span class="confirm">${T.cert}</span></span></div>`;
  return `<article class="product reveal">
    <div class="product-photo" data-slot="PLACEHOLDER-produto">
      <img src="${IMG(p.img, 480)}" alt="${esc(T.alt(aisleLabel))}" loading="lazy" width="480" height="480">
      <span class="photo-badge">${T.photo}</span>
    </div>
    <div class="product-body">
      <h4 class="product-name">${p.name ? esc(p.name) : `<span class="confirm">${T.product}</span>`}</h4>
      <p class="product-brand">${p.brand ? esc(p.brand) : `<span class="confirm">${T.brand}</span>`}</p>
      <p class="product-unit">${p.unit ? esc(p.unit) : `<span class="confirm">${T.unit}</span>`}</p>
      <div class="price-row">
        <span class="price">${price}${p.perKg ? '<small>/kg</small>' : ''}</span>
        <span class="stock ${stockCls}">${ICON[p.stock ? 'check' : 'help']}${stockTxt} <span class="confirm">[CONFIRM]</span></span>
      </div>
      ${diet}
      ${cert}
    </div>
  </article>`;
}

function initAisles() {
  const tabs = document.querySelector('[data-aisle-tabs]');
  const host = document.querySelector('[data-aisle-panels]');
  if (!tabs || !host) return;
  tabs.innerHTML = AISLES.map((a, i) => `
    <button class="aisle-tab" role="tab" id="tab-${a.id}" aria-controls="panel-${a.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
      <img src="${IMG(a.img, 320)}" alt="" loading="lazy" width="320" height="240">
      <span>${a.label[LANG]}</span>
    </button>`).join('');
  host.innerHTML = AISLES.map((a, i) => {
    const label = a.label[LANG];
    const body = a.products.length
      ? `<div class="products">${a.products.map(p => productCard(p, label)).join('')}</div>`
      : `<div class="empty-state">${ICON.box}<span>${T.empty}</span></div>`;
    const waLabel = STORE.whatsapp ? T.ask : `${T.ask} <span class="confirm">${T.askConfirm}</span>`;
    return `<div class="aisle-panel" role="tabpanel" id="panel-${a.id}" aria-labelledby="tab-${a.id}" ${i === 0 ? '' : 'hidden'} tabindex="0">
      <div class="aisle-panel-head">
        <h3>${label} <span class="confirm">${T.aisleConfirm}</span></h3>
        <a class="btn btn-wa btn-sm" data-wa-text="${esc(T.waMsg(label))}" href="${waHref(T.waMsg(label))}">${WA_SVG}${waLabel}</a>
      </div>
      ${body}
    </div>`;
  }).join('');

  const btns = [...tabs.querySelectorAll('[role="tab"]')];
  const select = (btn, focus) => {
    btns.forEach(b => {
      const on = b === btn;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) btn.focus();
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    panel.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
  };
  btns.forEach((b, i) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', e => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % btns.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + btns.length) % btns.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = btns.length - 1;
      if (j !== null) { e.preventDefault(); select(btns[j], true); }
    });
  });
  // stagger cards
  host.querySelectorAll('.products').forEach(g => g.querySelectorAll('.reveal').forEach((c, k) => c.style.setProperty('--i', k)));
}

/* ---------------- Open / closed pill ---------------- */
function initStatus() {
  const pills = document.querySelectorAll('[data-status]');
  if (!pills.length) return;
  const render = () => {
    pills.forEach(pill => {
      const label = pill.querySelector('[data-status-label]');
      if (!STORE.hours) { pill.className = 'status-pill'; label.textContent = T.hoursPending; return; }
      const now = new Date();
      const today = STORE.hours[now.getDay()] || [];
      const mins = now.getHours() * 60 + now.getMinutes();
      const toM = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
      const open = today.some(([a, b]) => mins >= toM(a) && mins < toM(b));
      pill.className = `status-pill ${open ? 'is-open' : 'is-closed'}`;
      label.textContent = open ? T.open : T.closed;
    });
  };
  render();
  setInterval(render, 60000);
  const row = document.querySelector(`[data-day="${new Date().getDay()}"]`);
  if (row) row.classList.add('is-today');
}

/* ---------------- Header, menu ---------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-condensed', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const close = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open);
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
}

/* ---------------- Reveal, parallax ---------------- */
function initReveal() {
  document.querySelectorAll('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => { c.classList.add('reveal'); c.style.setProperty('--i', i); }));
  const els = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach(e => io.observe(e));
}
function initParallax() {
  const media = document.querySelector('[data-parallax]');
  if (!media || REDUCED) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      media.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      ticking = false;
    });
  }, { passive: true });
}

/* ---------------- Carousel ---------------- */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.carousel-track');
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 14 : 300);
    c.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: REDUCED ? 'auto' : 'smooth' }));
    c.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: REDUCED ? 'auto' : 'smooth' }));
  });
}

/* ---------------- WhatsApp links (per-section prefill) ---------------- */
function initWhatsApp() {
  document.querySelectorAll('[data-wa-text]').forEach(a => { a.href = waHref(a.dataset.waText); });
}

/* ---------------- Forms (demo only) ---------------- */
function initForms() {
  document.querySelectorAll('form[data-demo]').forEach(f => {
    f.addEventListener('submit', e => {
      e.preventDefault();
      const status = f.querySelector('.form-status');
      const ok = f.checkValidity();
      status.textContent = ok ? T.formOk : T.formErr;
      status.classList.toggle('is-error', !ok);
      status.classList.add('is-visible');
      if (!ok) f.reportValidity();
    });
  });
}

/* ---------------- LGPD cookie banner ---------------- */
const CONSENT_KEY = 'dt-floripa-consent-v1';
function readConsent() { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; } }
function saveConsent(v) { try { localStorage.setItem(CONSENT_KEY, JSON.stringify(Object.assign({ necessary: true, date: new Date().toISOString() }, v))); } catch (e) { /* storage blocked */ } }
function initCookies() {
  const box = document.getElementById('cookie');
  if (!box) return;
  const prefs = box.querySelector('.cookie-prefs');
  const an = box.querySelector('#ck-analytics');
  const mk = box.querySelector('#ck-marketing');
  const open = showPrefs => {
    const c = readConsent();
    an.checked = !!(c && c.analytics);
    mk.checked = !!(c && c.marketing);
    prefs.hidden = !showPrefs;
    box.hidden = false;
    box.querySelector('h2').focus();
  };
  const close = v => { saveConsent(v); box.hidden = true; };
  box.querySelector('[data-ck="accept"]').addEventListener('click', () => close({ analytics: true, marketing: true }));
  box.querySelector('[data-ck="reject"]').addEventListener('click', () => close({ analytics: false, marketing: false }));
  box.querySelector('[data-ck="prefs"]').addEventListener('click', () => { prefs.hidden = !prefs.hidden; });
  box.querySelector('[data-ck="save"]').addEventListener('click', () => close({ analytics: an.checked, marketing: mk.checked }));
  document.querySelectorAll('[data-cookie-open]').forEach(b => b.addEventListener('click', () => open(true)));
  if (!readConsent()) { box.hidden = false; }
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(y => { y.textContent = new Date().getFullYear(); });
  initAisles();
  initStatus();
  initHeader();
  initReveal();
  initParallax();
  initCarousels();
  initWhatsApp();
  initForms();
  initCookies();
});

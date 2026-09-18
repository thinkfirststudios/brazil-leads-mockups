/* ==========================================================================
   Morro das Pedras Clube Hotel & Spa — MOCKUP script
   ==========================================================================
   ██ DATA FILE — every room, rate, treatment and capacity is a PLACEHOLDER ██
   • Never enter a room type, rate, inclusion, treatment, duration, price or
     capacity until the hotel confirms it in writing.
   • Rates must be the ones Omnibees will honour (CDC) and must be shown with
     breakfast / taxes / cancellation terms alongside.
   ========================================================================== */
const HOTEL = {
  whatsapp: '5548988030206',            // verified on their own site — correct unhyphenated format
  omnibees: {
    base: 'https://book.omnibees.com/hotel/12715',   // system of record — preserve
    // [CONFIRM Omnibees deep-link parameter names and date format with the provider]
    params: { checkin: 'CheckIn', checkout: 'CheckOut', adults: 'ad', rooms: 'NRooms', lang: 'lang' },
    dateFormat: 'DDMMYYYY'
  },
  maxGuests: 10,     // [CONFIRM max occupancy] — sane bound only
  maxRooms: 5,       // [CONFIRM]
  nightlyFrom: null, // number in BRL once Omnibees can surface real rates — otherwise [CONFIRM tarifa]
  rooms: [           // [CONFIRM] — do not guess a taxonomy
    { img: 'photo-1631049307264-da0ec9d70304', name: null, desc: null, beds: null, guests: null, view: null, balcony: null, ac: null, rate: null },
    { img: 'photo-1631049035182-249067d7618e', name: null, desc: null, beds: null, guests: null, view: null, balcony: null, ac: null, rate: null },
    { img: 'photo-1578683010236-d716f9a3f461', name: null, desc: null, beds: null, guests: null, view: null, balcony: null, ac: null, rate: null },
    { img: 'photo-1591088398332-8a7791972843', name: null, desc: null, beds: null, guests: null, view: null, balcony: null, ac: null, rate: null }
  ],
  treatments: [      // [CONFIRM] — no health, aesthetic or therapeutic outcome may be claimed
    { img: 'photo-1600334089648-b0d9d3028eb2', name: null, desc: null, minutes: null, price: null },
    { img: 'photo-1560750588-73207b1ef5b8', name: null, desc: null, minutes: null, price: null },
    { img: 'photo-1515377905703-c4788e51af15', name: null, desc: null, minutes: null, price: null }
  ]
};

const LANG = (() => { const l = (document.documentElement.lang || 'pt').toLowerCase(); return l.startsWith('en') ? 'en' : l.startsWith('es') ? 'es' : 'pt'; })();
const T = {
  pt: {
    room: n => `[CONFIRM tipo de quarto ${n}]`, roomDesc: '[PLACEHOLDER: 1–2 frases sobre o quarto — cliente a fornecer]',
    beds: '0 camas', guests: '0 hóspedes', view: 'Vista', balcony: 'Varanda', ac: 'Ar-condicionado',
    perNight: '/ noite', rateConfirm: '[CONFIRM diária]', terms: 'Café da manhã, taxas e cancelamento:', details: 'Ver detalhes',
    photo: 'FOTO ILUSTRATIVA — placeholder', roomAlt: 'Quarto de hotel arrumado, sem pessoas — foto ilustrativa, não é um quarto do hotel',
    treat: n => `[CONFIRM tratamento ${n}]`, treatDesc: '[PLACEHOLDER: descrição]', minutes: '[CONFIRM: 00 min]', book: 'Agendar no spa',
    treatAlt: 'Ambiente de spa sereno, sem rostos — foto ilustrativa',
    waSpa: n => `Olá! Gostaria de agendar no spa: ${n}. Data desejada: ___`,
    night: n => (n === 1 ? 'noite' : 'noites'),
    errMissing: 'Escolha as datas de check-in e check-out.', errPast: 'O check-in não pode ser uma data passada.',
    errOrder: 'O check-out precisa ser depois do check-in.', errGuests: n => `Hóspedes: entre 1 e ${n}.`, errRooms: n => `Quartos: entre 1 e ${n}.`,
    errRatio: 'O número de quartos não pode ser maior que o de hóspedes.',
    handoff: 'Abrimos o motor de reservas Omnibees em outra aba com as suas datas. A reserva é concluída lá.',
    estimate: 'valor estimado — sujeito a confirmação', omnLang: 'pt-BR',
    formOk: 'Demonstração: nada foi enviado. No site real, o pedido seguiria para a equipe comercial.',
    formErr: 'Preencha os campos obrigatórios e marque o consentimento.',
    goTo: n => `Ir para o item ${n}`
  },
  en: {
    room: n => `[CONFIRM room type ${n}]`, roomDesc: '[PLACEHOLDER: 1–2 sentence room description — client to supply]',
    beds: '0 beds', guests: '0 guests', view: 'View', balcony: 'Balcony', ac: 'Air conditioning',
    perNight: '/ night', rateConfirm: '[CONFIRM nightly rate]', terms: 'Breakfast, taxes & cancellation:', details: 'See details',
    photo: 'STOCK PHOTO — placeholder', roomAlt: 'Made-up hotel room, no people — illustrative stock photo, not a room at this hotel',
    treat: n => `[CONFIRM treatment ${n}]`, treatDesc: '[PLACEHOLDER: description]', minutes: '[CONFIRM: 00 min]', book: 'Book at the spa',
    treatAlt: 'Calm spa setting, no faces — illustrative stock photo',
    waSpa: n => `Hi! I'd like to book at the spa: ${n}. Preferred date: ___`,
    night: n => (n === 1 ? 'night' : 'nights'),
    errMissing: 'Please choose check-in and check-out dates.', errPast: 'Check-in cannot be in the past.',
    errOrder: 'Check-out must be after check-in.', errGuests: n => `Guests: between 1 and ${n}.`, errRooms: n => `Rooms: between 1 and ${n}.`,
    errRatio: 'Rooms cannot exceed guests.',
    handoff: 'We opened the Omnibees booking engine in a new tab with your dates. Your booking is completed there.',
    estimate: 'estimate — subject to confirmation', omnLang: 'en-US',
    formOk: 'Demo only: nothing was sent. On the live site this request would go to the sales team.',
    formErr: 'Please fill in the required fields and tick the consent box.',
    goTo: n => `Go to item ${n}`
  },
  es: {
    room: n => `[CONFIRM tipo de habitación ${n}]`, roomDesc: '[PLACEHOLDER: 1–2 frases sobre la habitación — a cargo del cliente]',
    beds: '0 camas', guests: '0 huéspedes', view: 'Vista', balcony: 'Balcón', ac: 'Aire acondicionado',
    perNight: '/ noche', rateConfirm: '[CONFIRM tarifa por noche]', terms: 'Desayuno, impuestos y cancelación:', details: 'Ver detalles',
    photo: 'FOTO ILUSTRATIVA — placeholder', roomAlt: 'Habitación de hotel ordenada, sin personas — foto ilustrativa, no es una habitación del hotel',
    treat: n => `[CONFIRM tratamiento ${n}]`, treatDesc: '[PLACEHOLDER: descripción]', minutes: '[CONFIRM: 00 min]', book: 'Reservar en el spa',
    treatAlt: 'Ambiente de spa sereno, sin rostros — foto ilustrativa',
    waSpa: n => `¡Hola! Quisiera reservar en el spa: ${n}. Fecha deseada: ___`,
    night: n => (n === 1 ? 'noche' : 'noches'),
    errMissing: 'Elija las fechas de check-in y check-out.', errPast: 'El check-in no puede ser una fecha pasada.',
    errOrder: 'El check-out debe ser posterior al check-in.', errGuests: n => `Huéspedes: entre 1 y ${n}.`, errRooms: n => `Habitaciones: entre 1 y ${n}.`,
    errRatio: 'Las habitaciones no pueden superar a los huéspedes.',
    handoff: 'Abrimos el motor de reservas Omnibees en otra pestaña con sus fechas. La reserva se completa allí.',
    estimate: 'valor estimado — sujeto a confirmación', omnLang: 'es-ES',
    formOk: 'Demostración: no se envió nada. En el sitio real, la solicitud iría al equipo comercial.',
    formErr: 'Complete los campos obligatorios y marque el consentimiento.',
    goTo: n => `Ir al elemento ${n}`
  }
}[LANG];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMG = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wa = text => `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(text)}`;
const svg = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const cf = t => `<span class="confirm">${t}</span>`;

/* ---------------- Rooms ---------------- */
function renderRooms() {
  document.querySelectorAll('[data-rooms]').forEach(host => {
    const detail = host.dataset.detail || '#';
    host.innerHTML = HOTEL.rooms.map((r, i) => `
      <article class="room" aria-roledescription="slide" aria-label="${i + 1} / ${HOTEL.rooms.length}">
        <div class="room-media">
          <!-- PLACEHOLDER-quarto-${i + 1} -->
          <img src="${IMG(r.img, 720)}" alt="${esc(T.roomAlt)}" loading="lazy" width="720" height="540">
          <span class="photo-badge">${T.photo}</span>
        </div>
        <div class="room-body">
          <h3>${r.name ? esc(r.name) : cf(T.room(i + 1))}</h3>
          <p>${r.desc ? esc(r.desc) : `<span class="ph">${T.roomDesc}</span>`}</p>
          <ul class="amenities">
            <li>${svg('i-bed')}${r.beds ?? T.beds} ${r.beds ? '' : cf('[CONFIRM]')}</li>
            <li>${svg('i-users')}${r.guests ?? T.guests} ${r.guests ? '' : cf('[CONFIRM]')}</li>
            <li>${svg('i-wave')}${T.view} ${r.view ?? cf('[CONFIRM]')}</li>
            <li>${svg('i-balcony')}${T.balcony} ${r.balcony ?? cf('[CONFIRM]')}</li>
            <li>${svg('i-snow')}${T.ac} ${r.ac ?? cf('[CONFIRM]')}</li>
          </ul>
          <div class="room-foot">
            <div><span class="rate">${r.rate != null ? brl(r.rate) : 'R$ 000,00'} <small>${T.perNight}</small></span><br>${r.rate != null ? `<small class="terms">${T.estimate}</small>` : cf(T.rateConfirm)}</div>
            <a class="btn btn-outline btn-sm" href="${detail}">${T.details}</a>
          </div>
          <p class="terms">${T.terms} ${cf('[CONFIRM]')}</p>
        </div>
      </article>`).join('');
  });
}

/* ---------------- Spa ---------------- */
function renderTreatments() {
  document.querySelectorAll('[data-treatments]').forEach(host => {
    host.innerHTML = HOTEL.treatments.map((t, i) => {
      const label = t.name || T.treat(i + 1);
      return `
      <article class="treat">
        <div class="treat-media">
          <!-- PLACEHOLDER-spa-${i + 1} -->
          <img src="${IMG(t.img, 640)}" alt="${esc(T.treatAlt)}" loading="lazy" width="640" height="427">
          <span class="photo-badge">${T.photo}</span>
        </div>
        <div class="treat-body">
          <h3>${t.name ? esc(t.name) : cf(T.treat(i + 1))}</h3>
          <p>${t.desc ? esc(t.desc) : `<span class="ph">${T.treatDesc}</span>`}</p>
          <div class="treat-meta">
            <span>${svg('i-clock')} ${t.minutes ? `${t.minutes} min` : cf(T.minutes)}</span>
            <span class="price-ochre">${t.price != null ? brl(t.price) : 'R$ 00,00'}</span>
          </div>
          <a class="btn btn-light btn-sm" href="${wa(T.waSpa(label))}" target="_blank" rel="noopener">${svg('i-wa')}${T.book}</a>
        </div>
      </article>`;
    }).join('');
  });
}

/* ---------------- Carousels (prev/next + dots) ---------------- */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track = c.querySelector('.c-track, .g-track');
    const prev = c.querySelector('[data-prev]');
    const next = c.querySelector('[data-next]');
    const dotsHost = c.querySelector('.dots');
    if (!track) return;
    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 14;
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + gap() : 300);
    const pages = () => Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
    const current = () => Math.round(track.scrollLeft / step());
    const buildDots = () => {
      if (!dotsHost) return;
      const n = pages();
      dotsHost.innerHTML = Array.from({ length: n }, (_, i) => `<button type="button" aria-label="${T.goTo(i + 1)}"></button>`).join('');
      [...dotsHost.children].forEach((b, i) => b.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: REDUCED ? 'auto' : 'smooth' })));
      update();
    };
    const update = () => {
      const i = current();
      if (dotsHost) [...dotsHost.children].forEach((b, k) => b.setAttribute('aria-current', k === i));
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
    };
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: REDUCED ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: REDUCED ? 'auto' : 'smooth' }));
    let t; track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
    window.addEventListener('resize', buildDots);
    buildDots();
  });
}

/* ---------------- Availability widget → Omnibees ---------------- */
const pad = n => String(n).padStart(2, '0');
const localISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return localISO(d); };
const nightsBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
const fmt = (iso, f) => { const [y, m, d] = iso.split('-'); return f === 'DDMMYYYY' ? `${d}${m}${y}` : `${d}/${m}/${y}`; };

function initWidget() {
  document.querySelectorAll('form[data-availability]').forEach(form => {
    const P = HOTEL.omnibees.params;
    const cin = form.querySelector(`[name="${P.checkin}"]`);
    const cout = form.querySelector(`[name="${P.checkout}"]`);
    const guests = form.querySelector(`[name="${P.adults}"]`);
    const rooms = form.querySelector(`[name="${P.rooms}"]`);
    const err = form.querySelector('.form-error');
    const nightsEl = form.querySelector('[data-nights]');
    const nightsLbl = form.querySelector('[data-nights-label]');
    const totalEl = form.querySelector('[data-total]');
    const status = form.querySelector('[data-handoff]');
    const today = localISO(new Date());
    cin.min = today; cout.min = addDays(today, 1);
    guests.max = HOTEL.maxGuests; rooms.max = HOTEL.maxRooms;

    const check = show => {
      [cin, cout, guests, rooms].forEach(el => el.removeAttribute('aria-invalid'));
      const a = cin.value, b = cout.value, g = +guests.value, r = +rooms.value;
      let msg = '', bad = null;
      if (!a || !b) { msg = T.errMissing; bad = !a ? cin : cout; }
      else if (a < today) { msg = T.errPast; bad = cin; }
      else if (b <= a) { msg = T.errOrder; bad = cout; }
      else if (!(g >= 1 && g <= HOTEL.maxGuests)) { msg = T.errGuests(HOTEL.maxGuests); bad = guests; }
      else if (!(r >= 1 && r <= HOTEL.maxRooms)) { msg = T.errRooms(HOTEL.maxRooms); bad = rooms; }
      else if (r > g) { msg = T.errRatio; bad = rooms; }
      const n = a && b && b > a ? nightsBetween(a, b) : 0;
      nightsEl.textContent = n; nightsLbl.textContent = T.night(n);
      if (totalEl && HOTEL.nightlyFrom != null && n > 0) totalEl.textContent = `${brl(HOTEL.nightlyFrom * n * r)} · ${T.estimate}`;
      if (bad && (show || (a && b))) bad.setAttribute('aria-invalid', 'true');
      err.textContent = msg;
      err.classList.toggle('is-visible', !!msg && (show || !!(a && b)));
      return { ok: !msg, bad, a, b, g, r };
    };

    cin.addEventListener('change', () => {
      if (cin.value) {
        const next = addDays(cin.value, 1);
        cout.min = next;
        if (!cout.value || cout.value <= cin.value) cout.value = next;
        cout.focus(); // auto-advance
      }
      check(false);
    });
    [cout, guests, rooms].forEach(el => el.addEventListener('change', () => check(false)));
    [guests, rooms].forEach(el => el.addEventListener('input', () => check(false)));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = check(true);
      if (!v.ok) { v.bad && v.bad.focus(); return; }
      const f = HOTEL.omnibees.dateFormat;
      const q = new URLSearchParams({ [P.checkin]: fmt(v.a, f), [P.checkout]: fmt(v.b, f), [P.adults]: v.g, [P.rooms]: v.r, [P.lang]: T.omnLang });
      const url = `${HOTEL.omnibees.base}?${q.toString()}`;
      const win = window.open(url, '_blank', 'noopener');
      status.hidden = false;
      const link = status.querySelector('a');
      if (link) link.href = url;
      if (!win) location.href = url;
    });
    check(false);
  });
}

/* ---------------- Shared UI ---------------- */
function initHeader() {
  const m = document.querySelector('.masthead');
  const f = () => m && m.classList.toggle('is-condensed', window.scrollY > 40);
  f(); window.addEventListener('scroll', f, { passive: true });
  const btn = document.querySelector('.menu-toggle'), nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  const close = () => { btn.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  btn.addEventListener('click', () => { const o = btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', o); nav.classList.toggle('is-open', o); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
function initReveal() {
  document.querySelectorAll('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => { c.classList.add('reveal'); c.style.setProperty('--i', i); }));
  const els = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  els.forEach(e => io.observe(e));
}
function initParallax() {
  const el = document.querySelector('[data-parallax]');
  if (!el || REDUCED) return;
  let busy = false;
  window.addEventListener('scroll', () => {
    if (busy) return; busy = true;
    requestAnimationFrame(() => { el.style.transform = `translate3d(0,${Math.min(window.scrollY, 900) * 0.22}px,0)`; busy = false; });
  }, { passive: true });
}
function initWhatsApp() { document.querySelectorAll('[data-wa-text]').forEach(a => { a.href = wa(a.dataset.waText); }); }
function initForms() {
  document.querySelectorAll('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const s = f.querySelector('.form-status'); const ok = f.checkValidity();
    s.textContent = ok ? T.formOk : T.formErr; s.classList.toggle('is-error', !ok); s.classList.add('is-visible');
    if (!ok) f.reportValidity();
  }));
}
const CK = 'morro-das-pedras-consent-v1';
const readCk = () => { try { return JSON.parse(localStorage.getItem(CK)); } catch (e) { return null; } };
const saveCk = v => { try { localStorage.setItem(CK, JSON.stringify(Object.assign({ necessary: true, date: new Date().toISOString() }, v))); } catch (e) { /* blocked */ } };
function initCookies() {
  const box = document.getElementById('cookie'); if (!box) return;
  const prefs = box.querySelector('.cookie-prefs'), an = box.querySelector('#ck-analytics'), mk = box.querySelector('#ck-marketing');
  const close = v => { saveCk(v); box.hidden = true; };
  box.querySelector('[data-ck="accept"]').addEventListener('click', () => close({ analytics: true, marketing: true }));
  box.querySelector('[data-ck="reject"]').addEventListener('click', () => close({ analytics: false, marketing: false }));
  box.querySelector('[data-ck="prefs"]').addEventListener('click', () => { prefs.hidden = !prefs.hidden; });
  box.querySelector('[data-ck="save"]').addEventListener('click', () => close({ analytics: an.checked, marketing: mk.checked }));
  document.querySelectorAll('[data-cookie-open]').forEach(b => b.addEventListener('click', () => {
    const c = readCk(); an.checked = !!(c && c.analytics); mk.checked = !!(c && c.marketing);
    prefs.hidden = false; box.hidden = false; box.querySelector('h2').focus();
  }));
  if (!readCk()) box.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(y => { y.textContent = new Date().getFullYear(); });
  renderRooms();
  renderTreatments();
  initWidget();
  initHeader();
  initReveal();
  initParallax();
  initCarousels();
  initWhatsApp();
  initForms();
  initCookies();
});

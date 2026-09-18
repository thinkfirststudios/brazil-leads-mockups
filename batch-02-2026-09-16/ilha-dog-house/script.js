/* ==========================================================================
   Ilha Dog House — MOCKUP script
   ==========================================================================
   ██ DATA FILE — everything below is PLACEHOLDER until the client confirms ██
   • No rate, capacity, minimum stay, vaccination list, partner vet or staff
     qualification may be entered until confirmed in writing.
   • Competitor rates must NEVER be used as a proxy.
   ========================================================================== */
const DATA = {
  // Lead-sheet phone (48 98440-9131). [CONFIRM this number is the WhatsApp]
  whatsapp: '5548984409131',
  timeZone: 'America/Sao_Paulo',   // clock + sky follow Florianópolis time
  boarding: {
    dailyRate: null,       // e.g. { pequeno: 0, medio: 0, grande: 0 } — BRL, per night [CONFIRM]
    minNights: null,       // [CONFIRM] — the form falls back to 1 night until confirmed
    tiers: [               // [CONFIRM the real tiers]
      { id: 'padrao', pt: 'Hospedagem padrão', en: 'Standard boarding', price: null },
      { id: 'longa', pt: 'Hospedagem longa estadia', en: 'Long-stay boarding', price: null },
      { id: 'gatos', pt: 'Hospedagem para gatos', en: 'Cat boarding', price: null }
    ]
  },
  daycare: {
    passes: [              // [CONFIRM the real offering]
      { id: 'avulsa', pt: 'Diária avulsa', en: 'Single day', price: null },
      { id: 'p5', pt: 'Pacote 5 dias', en: '5-day pack', price: null },
      { id: 'p10', pt: 'Pacote 10 dias', en: '10-day pack', price: null },
      { id: 'mensal', pt: 'Mensal', en: 'Monthly', price: null }
    ],
    // times null → shown as 00:00 [CONFIRM]
    timeline: ['chegada', 'atividade', 'descanso', 'alimentacao', 'atividade2', 'saida'].map(id => ({ id, time: null }))
  },
  stats: { anos: null, capacidade: null, horas: null, tutores: null } // numbers only once confirmed
};

/* ---------------- i18n ---------------- */
const LANG = (document.documentElement.lang || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
const T = {
  pt: {
    night: n => (n === 1 ? 'noite' : 'noites'),
    errPast: 'O check-in não pode ser uma data que já passou.',
    errOrder: 'O check-out precisa ser depois do check-in.',
    errMissing: 'Escolha as datas de check-in e check-out.',
    errConsent: 'Marque a caixa de consentimento para continuar.',
    errMin: n => `A estadia mínima é de ${n} ${n === 1 ? 'noite' : 'noites'}.`,
    rate: '[CONFIRM diária]',
    estimate: 'valor estimado — sujeito a confirmação',
    species: { cao: 'Cão', gato: 'Gato' },
    size: { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande', na: 'Não se aplica' },
    wa: (d) => `Olá, Ilha Dog House! Gostaria de consultar disponibilidade de hospedagem.\n• Check-in: ${d.in}\n• Check-out: ${d.out}\n• ${d.n} ${d.n === 1 ? 'noite' : 'noites'}\n• Espécie: ${d.species}\n• Porte: ${d.size}${d.name ? `\n• Nome do pet: ${d.name}` : ''}`,
    ready: 'Pronto! Abra o WhatsApp — a mensagem já vai com as suas datas. A disponibilidade é confirmada pela equipe.',
    formOk: 'Demonstração: nada foi enviado. No site real, esta mensagem seguiria para a equipe.',
    formErr: 'Preencha os campos obrigatórios e marque o consentimento.'
  },
  en: {
    night: n => (n === 1 ? 'night' : 'nights'),
    errPast: 'Check-in cannot be a date in the past.',
    errOrder: 'Check-out must be after check-in.',
    errMissing: 'Please choose check-in and check-out dates.',
    errConsent: 'Please tick the consent box to continue.',
    errMin: n => `Minimum stay is ${n} ${n === 1 ? 'night' : 'nights'}.`,
    rate: '[CONFIRM nightly rate]',
    estimate: 'estimate — subject to confirmation',
    species: { cao: 'Dog', gato: 'Cat' },
    size: { pequeno: 'Small', medio: 'Medium', grande: 'Large', na: 'N/A' },
    wa: (d) => `Hi Ilha Dog House! I'd like to check boarding availability.\n• Check-in: ${d.in}\n• Check-out: ${d.out}\n• ${d.n} ${d.n === 1 ? 'night' : 'nights'}\n• Species: ${d.species}\n• Size: ${d.size}${d.name ? `\n• Pet's name: ${d.name}` : ''}`,
    ready: 'Ready! Open WhatsApp — your dates are already in the message. Availability is confirmed by the team.',
    formOk: 'Demo only: nothing was sent. On the live site this message would go to the team.',
    formErr: 'Please fill in the required fields and tick the consent box.'
  }
}[LANG];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wa = text => (DATA.whatsapp ? `https://wa.me/${DATA.whatsapp}?text=${encodeURIComponent(text)}` : '#contato');
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ---------------- Florianópolis time helpers ---------------- */
function floripaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: DATA.timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t).value;
  return { y: g('year'), m: g('month'), d: g('day'), h: +g('hour'), min: g('minute') };
}
const todayISO = () => { const n = floripaNow(); return `${n.y}-${n.m}-${n.d}`; };
const toBR = iso => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
const daysBetween = (a, b) => Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 86400000);
const addDays = (iso, n) => new Date(Date.parse(iso + 'T12:00:00Z') + n * 86400000).toISOString().slice(0, 10);

/* ---------------- Relógio 24h ---------------- */
function phaseFor(h) {
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
}
function initClock() {
  const clocks = document.querySelectorAll('[data-clock]');
  const hero = document.querySelector('[data-phase]');
  const tick = () => {
    const n = floripaNow();
    const txt = `${String(n.h).padStart(2, '0')}:${n.min}`;
    clocks.forEach(c => { c.textContent = txt; c.setAttribute('datetime', txt); });
    if (hero) hero.dataset.phase = phaseFor(n.h);
  };
  tick();
  setInterval(tick, 20000);
}

/* ---------------- Booking (date range → WhatsApp) ---------------- */
function initBooking() {
  document.querySelectorAll('form[data-booking]').forEach(form => {
    const $ = n => form.querySelector(`[name="${n}"]`);
    const cin = $('checkin'), cout = $('checkout'), species = $('species'), size = $('size'), pet = $('pet');
    const nightsEl = form.querySelector('[data-nights]');
    const nightsLabel = form.querySelector('[data-nights-label]');
    const rangeEl = form.querySelector('[data-range]');
    const err = form.querySelector('.form-error');
    const out = form.querySelector('[data-wa-out]');
    const ok = form.querySelector('[data-ready]');
    const minN = DATA.boarding.minNights || 1;
    const today = todayISO();
    cin.min = today;
    cout.min = addDays(today, minN);

    const validate = (show) => {
      const a = cin.value, b = cout.value;
      let msg = '';
      cin.removeAttribute('aria-invalid'); cout.removeAttribute('aria-invalid');
      if (!a || !b) msg = T.errMissing;
      else if (a < today) { msg = T.errPast; cin.setAttribute('aria-invalid', 'true'); }
      else if (b <= a) { msg = T.errOrder; cout.setAttribute('aria-invalid', 'true'); }
      else if (daysBetween(a, b) < minN) { msg = T.errMin(minN); cout.setAttribute('aria-invalid', 'true'); }
      const n = a && b && b > a ? daysBetween(a, b) : 0;
      nightsEl.textContent = n;
      nightsLabel.textContent = T.night(n);
      rangeEl.textContent = a && b && b > a ? `${toBR(a).slice(0, 5)} → ${toBR(b).slice(0, 5)}` : 'DD/MM → DD/MM';
      if (show || (a && b)) { err.textContent = msg; err.classList.toggle('is-visible', !!msg && (show || !!(a && b))); }
      return { ok: !msg, n, a, b };
    };

    cin.addEventListener('change', () => {
      if (cin.value) {
        const next = addDays(cin.value, minN);
        cout.min = next;
        if (!cout.value || cout.value <= cin.value) { cout.value = next; }
        if (typeof cout.showPicker === 'function' && !REDUCED) { try { cout.focus(); } catch (e) { /* noop */ } }
      }
      validate(false);
    });
    [cout, species, size].forEach(el => el && el.addEventListener('change', () => validate(false)));
    if (species && size) species.addEventListener('change', () => {
      const cat = species.value === 'gato';
      size.disabled = cat;
      if (cat) size.value = 'na'; else if (size.value === 'na') size.value = 'medio';
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = validate(true);
      ok.hidden = true;
      if (!v.ok) { (cin.getAttribute('aria-invalid') ? cin : cout).focus(); return; }
      const consent = form.querySelector('[name="lgpd"]');
      if (consent && !consent.checked) { err.textContent = T.errConsent; err.classList.add('is-visible'); consent.focus(); return; }
      err.classList.remove('is-visible');
      const text = T.wa({ in: toBR(v.a), out: toBR(v.b), n: v.n, species: T.species[species.value], size: T.size[size.value], name: pet && pet.value.trim() });
      out.href = wa(text);
      ok.hidden = false;
      out.focus();
    });
    validate(false);
  });
}

/* ---------------- Count-up (verified numbers only) ---------------- */
function initCounts() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const key = el.dataset.count;
    const val = DATA.stats[key];
    if (val == null) return; // stays as [CONFIRM] placeholder
    const run = () => {
      if (REDUCED) { el.textContent = val; return; }
      const t0 = performance.now(), dur = 1400;
      const step = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(val * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { run(); io.disconnect(); } }), { threshold: .5 });
    io.observe(el);
  });
}

/* ---------------- Header / menu / reveal / carousel ---------------- */
function initHeader() {
  const h = document.querySelector('.site-header');
  const f = () => h && h.classList.toggle('is-condensed', window.scrollY > 20);
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
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  els.forEach(e => io.observe(e));
}
function initParallax() {
  const el = document.querySelector('[data-parallax]');
  if (!el || REDUCED) return;
  let busy = false;
  window.addEventListener('scroll', () => {
    if (busy) return; busy = true;
    requestAnimationFrame(() => { el.style.transform = `translate3d(0,${Math.min(window.scrollY, 800) * 0.06}px,0)`; busy = false; });
  }, { passive: true });
}
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const tr = c.querySelector('.track');
    const step = () => (tr.firstElementChild ? tr.firstElementChild.getBoundingClientRect().width + 14 : 300);
    c.querySelector('[data-prev]').addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: REDUCED ? 'auto' : 'smooth' }));
    c.querySelector('[data-next]').addEventListener('click', () => tr.scrollBy({ left: step(), behavior: REDUCED ? 'auto' : 'smooth' }));
  });
}
function initWhatsApp() {
  document.querySelectorAll('[data-wa-text]').forEach(a => { a.href = wa(a.dataset.waText); });
}
function initHoursToday() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: DATA.timeZone })).getDay();
  document.querySelectorAll(`[data-day="${d}"]`).forEach(r => r.classList.add('is-today'));
}
function initForms() {
  document.querySelectorAll('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const s = f.querySelector('.form-status'); const ok = f.checkValidity();
    s.textContent = ok ? T.formOk : T.formErr; s.classList.toggle('is-error', !ok); s.classList.add('is-visible');
    if (!ok) f.reportValidity();
  }));
}

/* ---------------- LGPD cookies ---------------- */
const CK = 'ilha-dog-house-consent-v1';
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
  document.querySelectorAll('[data-rate]').forEach(el => {
    const r = DATA.boarding.dailyRate;
    if (r && typeof r === 'number') el.textContent = `${brl(r)} · ${T.estimate}`;
  });
  initClock();
  initBooking();
  initCounts();
  initHeader();
  initReveal();
  initParallax();
  initCarousels();
  initWhatsApp();
  initHoursToday();
  initForms();
  initCookies();
});

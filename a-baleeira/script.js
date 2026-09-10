/* ==========================================================================
   A BALEEIRA — script.js
   MOCKUP BUILD. Every string below marked [CONFIRM] is a visible placeholder.
   ========================================================================== */

/* --------------------------------------------------------------------------
   ⬇⬇  CARDÁPIO — SINGLE SOURCE OF TRUTH  ⬇⬇
   Paste the real menu straight into this array during the pitch and the whole
   page rebuilds. NOTHING here is a real dish or a real price — no dish name
   and no price was recoverable from @restauranteabaleeira.
   NEVER invent a dish name or a price.

   item = {
     n:   nome do prato            → "[CONFIRM nome do prato]"
     p:   preço em BRL             → "[CONFIRM R$ 00,00]"   (vírgula decimal)
     d:   descrição curta          → "[CONFIRM descrição]"
     two: serve 2 pessoas?         → true | false | null (null = [CONFIRM])
     alg: alérgenos (ANVISA RDC 26/2015) → ['peixes','crustáceos','moluscos',
          'leite','ovos','trigo (glúten)','soja','castanhas']
     diet:['vegetariano'|'sem lactose'|'sem glúten']
   }
-------------------------------------------------------------------------- */
const CARDAPIO = [
  { cat:'Entradas', items:[
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { cat:'Frutos do mar', items:[
    { n:null, p:null, d:null, two:null, alg:['crustáceos','moluscos'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['moluscos'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['crustáceos'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { cat:'Peixes', items:[
    { n:null, p:null, d:null, two:null, alg:['peixes'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['peixes'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['peixes','leite'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['peixes'], diet:[] }
  ]},
  { cat:'Carnes', items:[
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { cat:'Pratos regionais', items:[
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, two:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { cat:'Sobremesas', items:[
    { n:null, p:null, d:null, two:false, alg:['leite','ovos','trigo (glúten)'], diet:[] },
    { n:null, p:null, d:null, two:false, alg:['leite','ovos'], diet:[] },
    { n:null, p:null, d:null, two:false, alg:['[CONFIRM]'], diet:[] }
  ]},
  { cat:'Bebidas / Carta de vinhos', items:[
    { n:null, p:null, d:null, two:false, alg:[], diet:[] },
    { n:null, p:null, d:null, two:false, alg:[], diet:[] },
    { n:null, p:null, d:null, two:false, alg:[], diet:[] },
    { n:null, p:null, d:null, two:false, alg:[], diet:[] }
  ]}
];

/* WhatsApp — [CONFIRM WhatsApp number]. Placeholder digits are intentionally
   non-dialable so nothing ships pointing at a stranger's phone. */
const WA_NUMBER = '5548000000000';                 // [CONFIRM]
const WA_BASE   = 'https://wa.me/' + WA_NUMBER + '?text=';

/* ========================================================================== */
/* Parallel trees, one engine: strings follow <html lang>. */
const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');
const T = IS_EN ? {
  dish:'dish name', price:'R$ 00,00', desc:'dish description',
  serves:'serves 2?', contains:'contains', cat:'category',
  cta:'Order / Book on WhatsApp',
  waCat:g => `Hello! I'd like to book / order — ${g}. Name: `,
  resv:(n,d,h,p,o) =>
    `Hello, A Baleeira! I'd like to book a table.\n` +
    `• Name: ${n}\n• Date (DD/MM): ${d}\n• Time: ${h}\n• Guests: ${p}\n• Notes: ${o}\n\n` +
    `(I understand the booking is only confirmed once the restaurant replies.)`
} : {
  dish:'nome do prato', price:'R$ 00,00', desc:'descrição do prato',
  serves:'serve 2?', contains:'contém', cat:'categoria',
  cta:'Pedir / Reservar no WhatsApp',
  waCat:g => `Olá! Gostaria de reservar / pedir — ${g}. Nome: `,
  resv:(n,d,h,p,o) =>
    `Olá, A Baleeira! Gostaria de reservar uma mesa.\n` +
    `• Nome: ${n}\n• Data: ${d}\n• Horário: ${h}\n• Pessoas: ${p}\n• Observações: ${o}\n\n` +
    `(Entendo que a reserva só está confirmada após a resposta do restaurante.)`
};

document.addEventListener('DOMContentLoaded', () => {

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CFM = t => `<span class="cfm">[CONFIRM ${t}]</span>`;

  /* ---------- Render cardápio ---------- */
  const host = document.getElementById('menuCats');
  if (host) {
    host.innerHTML = CARDAPIO.map(group => {
      const rows = group.items.map(it => {
        const tags = [];
        if (it.two === true)  tags.push(`<span class="chip chip--two">${IS_EN?'serves 2 people':'serve 2 pessoas'}</span>`);
        if (it.two === null)  tags.push(`<span class="chip chip--two">[CONFIRM ${T.serves}]</span>`);
        it.diet.forEach(d => tags.push(`<span class="chip chip--diet">${d}</span>`));
        it.alg.forEach(a  => tags.push(`<span class="chip chip--alg">${T.contains}: ${a}</span>`));
        return `<div class="mi">
            <div class="mi__top">
              <span class="mi__n">${it.n ? it.n : CFM(T.dish)}</span>
              <i class="mi__dots"></i>
              <span class="mi__p">${it.p ? it.p : CFM(T.price)}</span>
            </div>
            <p class="mi__d">${it.d ? it.d : CFM(T.desc)}</p>
            ${tags.length ? `<div class="mi__tags">${tags.join('')}</div>` : ''}
          </div>`;
      }).join('');
      const msg = encodeURIComponent(T.waCat(group.cat));
      return `<div class="menu-cat" data-rv>
          <div class="menu-cat__h"><h3>${group.cat}</h3><i></i>
            <span class="chip">[CONFIRM ${T.cat}]</span></div>
          <div class="menu-list">${rows}</div>
          <div class="menu-cat__cta">
            <a class="btn btn--wa btn--sm" href="${WA_BASE}${msg}" target="_blank" rel="noopener">
              ${T.cta} <span class="ar">→</span></a>
          </div>
        </div>`;
    }).join('');
  }

  /* ---------- Sticky header ---------- */
  const hdr = document.querySelector('.hdr');
  const onScroll = () => hdr && hdr.classList.toggle('is-stuck', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.burger');
  const mnav   = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('on');
      burger.classList.toggle('on', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
      [...mnav.querySelectorAll('a')].forEach((a,i) => {
        a.style.transitionDelay = open ? `${90 + i*55}ms` : '0ms';
      });
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Scroll reveal + stagger ---------- */
  const rv = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
      e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 95}ms`;
      e.target.classList.add('in');
      rv.unobserve(e.target);
    });
  }, { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  const bindRv = () => document.querySelectorAll('[data-rv]:not(.in)').forEach(el => rv.observe(el));
  bindRv();

  /* ---------- Count-up (stats ship EMPTY — runs only on confirmed numbers) ---------- */
  const cu = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseFloat(el.dataset.count);
      cu.unobserve(el);
      if (!isFinite(target)) return;              // unconfirmed → leave placeholder
      if (reduce) { el.textContent = target; return; }
      const t0 = performance.now(), dur = 1500;
      const step = now => {
        const k = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1-k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold:.5 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- Hero parallax ---------- */
  const heroImg = document.querySelector('.hero__bg img');
  if (heroImg && !reduce) {
    let tick = false;
    window.addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.06)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- Reservation form → WhatsApp deep link (DD/MM) ---------- */
  const form = document.getElementById('resvForm');
  if (form) {
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const f = new FormData(form);
      const raw = (f.get('data') || '').toString();          // yyyy-mm-dd
      const br  = raw ? raw.split('-').reverse().slice(0,2).join('/') : '[data]';  // DD/MM
      const msg = T.resv(
        f.get('nome') || '—', br, f.get('hora') || '—',
        f.get('pessoas') || '—', f.get('obs') || '—');
      window.open(WA_BASE + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* ---------- LGPD cookie consent (non-essential OFF by default) ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'baleeira_lgpd_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 1100);
    const save = prefs => { localStorage.setItem(KEY, JSON.stringify(prefs)); ck.classList.remove('on'); };
    ck.querySelector('[data-ck="all"]') ?.addEventListener('click', () => save({ ess:true, analytics:true,  marketing:true  }));
    ck.querySelector('[data-ck="ess"]') ?.addEventListener('click', () => save({ ess:true, analytics:false, marketing:false }));
    ck.querySelector('[data-ck="save"]')?.addEventListener('click', () => save({
      ess:true,
      analytics: ck.querySelector('#ckAnalytics')?.checked || false,
      marketing: ck.querySelector('#ckMarketing')?.checked || false
    }));
  }

  /* ---------- Smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const top = t.getBoundingClientRect().top + window.scrollY - (window.innerWidth > 860 ? 78 : 62);
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  bindRv();
});

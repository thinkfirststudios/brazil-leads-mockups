/* ==========================================================================
   BONI RESTAURANTE — script.js (shared by / and /en/)
   ========================================================================== */

/* --------------------------------------------------------------------------
   ⬇⬇  CARDÁPIO — ONE ARRAY DRIVES THE WHOLE MENU  ⬇⬇

   For a seasonal kitchen this is the feature worth demonstrating live in the
   pitch: change the menu here and the page rebuilds — no developer, no ticket,
   one minute. That removes the standard objection that a website goes stale.

   NOTHING BELOW IS A REAL DISH OR A REAL PRICE. No dish, ingredient or price
   was recoverable from @bonigastronomia. NEVER invent one.

   ⚠ ALLERGEN DATA TRAVELS WITH THE MENU DATA, in this same array, on purpose.
     A seasonal menu makes ANVISA RDC 26/2015 compliance HARDER, not easier —
     if the allergens live somewhere else they go stale the first time a dish
     changes.

   item = {
     n:    nome do prato        → null renders "[CONFIRM nome do prato]"
     d:    descrição de uma linha
     p:    preço "R$ 00,00"     (vírgula decimal, BRL — nunca converter para USD)
     saz:  sazonal?             true | false | null (null = [CONFIRM])
     alg:  ['trigo (glúten)','leite','ovos','soja','castanhas','amendoim',
            'peixes','crustáceos','moluscos']
     diet: ['vegetariano','vegano','sem glúten','sem lactose']
   }
-------------------------------------------------------------------------- */
const CARDAPIO = [
  { id:'entradas', cat:{ pt:'Entradas', en:'Starters' },
    img:'1546069901-ba9599a7e63c', items:[
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { id:'principais', cat:{ pt:'Principais', en:'Mains' },
    img:'1504674900247-0877df9cc836', items:[
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { id:'do-mar', cat:{ pt:'Do mar', en:'From the sea' },
    img:'1476224203421-9ac39bcb3327', items:[
    { n:null, p:null, d:null, saz:null, alg:['peixes'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['crustáceos'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['moluscos'], diet:[] }
  ]},
  { id:'da-terra', cat:{ pt:'Da terra', en:'From the land' },
    img:'1432139555190-58524dae6a55', items:[
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:[] }
  ]},
  { id:'vegetariano', cat:{ pt:'Vegetariano', en:'Vegetarian' },
    img:'1540189549336-e6e99c3679fe', items:[
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:['vegetariano'] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:['[CONFIRM vegano?]'] },
    { n:null, p:null, d:null, saz:null, alg:['[CONFIRM]'], diet:['vegetariano'] }
  ]},
  { id:'sobremesas', cat:{ pt:'Sobremesas', en:'Desserts' },
    img:'1578985545062-69928b1d9587', items:[
    { n:null, p:null, d:null, saz:false, alg:['leite','ovos','trigo (glúten)'], diet:[] },
    { n:null, p:null, d:null, saz:false, alg:['leite','ovos'], diet:[] },
    { n:null, p:null, d:null, saz:false, alg:['[CONFIRM]'], diet:[] }
  ]},
  { id:'bebidas', cat:{ pt:'Carta de bebidas', en:'Drinks list' },
    img:'1470337458703-46ad1756a187', items:[
    { n:null, p:null, d:null, saz:false, alg:[], diet:[] },
    { n:null, p:null, d:null, saz:false, alg:[], diet:[] },
    { n:null, p:null, d:null, saz:false, alg:[], diet:[] },
    { n:null, p:null, d:null, saz:false, alg:[], diet:[] }
  ]}
];

/* ⚠ [CONFIRM WhatsApp] — Instagram-only lead, nothing captured.
   Placeholder digits are intentionally non-dialable. */
const WA_NUMBER = null;   // [CONFIRM] - was '5548000000000', a placeholder, not a number
const WA = 'https://wa.me/' + WA_NUMBER + '?text=';
const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=72`;

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');
const T = IS_EN ? {
  dish:'dish name', price:'R$ 00,00', desc:'one-line description', saz:'seasonal?',
  contains:'contains', cta:'Book a table', seasonal:'seasonal',
  waCat:c => `Hello Boni! I'd like to book a table — ${c}. Name: `,
  resv:(n,d,h,p,o) => `Hello Boni! I'd like to book a table.\n• Name: ${n}\n• Date (DD/MM): ${d}\n` +
    `• Time: ${h}\n• Guests: ${p}\n• Notes: ${o}\n\n(I understand the booking is only confirmed once the restaurant replies.)`
} : {
  dish:'nome do prato', price:'R$ 00,00', desc:'descrição de uma linha', saz:'sazonal?',
  contains:'contém', cta:'Reservar', seasonal:'sazonal',
  waCat:c => `Olá, Boni! Gostaria de reservar uma mesa — ${c}. Nome: `,
  resv:(n,d,h,p,o) => `Olá, Boni! Gostaria de reservar uma mesa.\n• Nome: ${n}\n• Data (DD/MM): ${d}\n` +
    `• Horário: ${h}\n• Pessoas: ${p}\n• Observações: ${o}\n\n(Entendo que a reserva só está confirmada após a resposta do restaurante.)`
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CFM = t => `<span class="cfm">[CONFIRM ${t}]</span>`;
  const L = IS_EN ? 'en' : 'pt';

  /* ---------- Render the cardápio ---------- */
  const host = document.getElementById('menuList');
  const photo = document.getElementById('menuPhoto');
  if (host) {
    host.innerHTML = CARDAPIO.map(g => {
      let k = 0;
      const rows = g.items.map(it => {
        k++;
        const tags = [];
        if (it.saz === true) tags.push(`<span class="chip chip--saz">${T.seasonal}</span>`);
        if (it.saz === null) tags.push(`<span class="chip chip--saz">[CONFIRM ${T.saz}]</span>`);
        it.diet.forEach(x => tags.push(`<span class="chip">${x}</span>`));
        it.alg.forEach(a => tags.push(`<span class="chip chip--alg">${T.contains}: ${a}</span>`));
        return `<div class="mi">
            <span class="mi__n">${String(k).padStart(2,'0')}</span>
            <div class="mi__b">
              <h4>${it.n || CFM(T.dish)}</h4>
              <p class="mi__d">${it.d || CFM(T.desc)}</p>
              ${tags.length ? `<div class="mi__tags">${tags.join('')}</div>` : ''}
            </div>
            <span class="mi__p">${it.p || CFM(T.price)}</span>
          </div>`;
      }).join('');
      return `<section class="cat" id="cat-${g.id}" data-cat="${g.id}" data-rv>
          <div class="cat__h"><h3>${g.cat[L]}</h3><span>[CONFIRM]</span></div>
          ${rows}
          <div class="cat__cta">
            <a class="btn btn--wa btn--sm" href="${WA}${encodeURIComponent(T.waCat(g.cat[L]))}"
               target="_blank" rel="noopener">${T.cta} <span class="ar">→</span></a>
          </div>
        </section>`;
    }).join('');
  }

  /* ---------- Sticky paired photograph — swaps to the active category ---------- */
  if (photo) {
    photo.innerHTML = CARDAPIO.map((g, i) =>
      `<img src="${IMG(g.img)}" alt="${IS_EN
        ? 'Plated dish photographed on dark ceramic against off-white linen — placeholder for the ' + g.cat.en + ' category.'
        : 'Prato fotografado sobre louça escura e linho off-white — placeholder da categoria ' + g.cat.pt + '.'}"
        class="${i === 0 ? 'on' : ''}" data-for="${g.id}" loading="lazy">`).join('') +
      `<span class="menu__cap">${IS_EN ? 'Placeholder — replace with the kitchen’s own photography'
                                       : 'Placeholder — substituir pela fotografia da casa'}</span>`;
    const imgs = photo.querySelectorAll('img');
    const swap = id => imgs.forEach(im => im.classList.toggle('on', im.dataset.for === id));
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) swap(e.target.dataset.cat);
    }), { rootMargin:'-45% 0px -45% 0px' });
    document.querySelectorAll('.cat').forEach(c => spy.observe(c));
  }

  /* ---------- Sticky header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 40);
  stick(); addEventListener('scroll', stick, { passive:true });

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.burger'), mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('on');
      burger.classList.toggle('on', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
      [...mnav.querySelectorAll('a')].forEach((a,i) =>
        a.style.transitionDelay = open ? `${80 + i*54}ms` : '0ms');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Scroll reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -8% 0px' });
  const bind = () => document.querySelectorAll('[data-rv]:not(.in)').forEach(el => rv.observe(el));
  bind();

  /* ---------- Reservation form → WhatsApp, DD/MM ---------- */
  const rf = document.getElementById('resvForm');
  if (rf) rf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(rf);
    const raw = (f.get('data') || '').toString();
    const br = raw ? raw.split('-').reverse().slice(0,2).join('/') : '—';
    open(WA + encodeURIComponent(T.resv(f.get('nome') || '—', br, f.get('hora') || '—',
      f.get('pessoas') || '—', f.get('obs') || '—')), '_blank', 'noopener');
  });

  /* ---------- Count-up — stats ship EMPTY, so this never fires unconfirmed ---------- */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, n = parseFloat(el.dataset.count); cu.unobserve(el);
    if (!isFinite(n)) return;
    if (reduce) { el.textContent = n; return; }
    const t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0)/1400, 1);
      el.textContent = Math.round(n * (1 - Math.pow(1-k,3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.6 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'boni_lgpd_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 1000);
    const save = p => { localStorage.setItem(KEY, JSON.stringify(p)); ck.classList.remove('on'); };
    ck.querySelector('[data-ck="all"]') ?.addEventListener('click', () => save({ ess:true, analytics:true,  marketing:true  }));
    ck.querySelector('[data-ck="none"]')?.addEventListener('click', () => save({ ess:true, analytics:false, marketing:false }));
    ck.querySelector('[data-ck="save"]')?.addEventListener('click', () => save({
      ess:true,
      analytics: ck.querySelector('#ckA')?.checked || false,
      marketing: ck.querySelector('#ckM')?.checked || false
    }));
  }

  /* ---------- Smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a =>
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href')); if (!t) return;
      e.preventDefault();
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: reduce ? 'auto' : 'smooth' });
    }));

  bind();
});


/* ---------------------------------------------------------------------
   No confirmed WhatsApp number  [CONFIRM]
   The placeholder above is not a phone number, and a placeholder still
   concatenates into a working wa.me URL - which is how this build ended
   up with a live button pointing at somebody else's line. Until the real
   number is supplied, nothing dials: every WhatsApp control is inert and
   says why when it is clicked. Remove this block once WA_NUMBER is real.
   ------------------------------------------------------------------ */
(function () {
  if (typeof WA_NUMBER !== 'undefined' && WA_NUMBER) return;
  var isEN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var isES = (document.documentElement.lang || '').toLowerCase().indexOf('es') === 0;
  var MSG = isEN
    ? 'No WhatsApp number has been confirmed for this business, so no button '
      + 'on this mockup dials. Supply the number you actually answer and every '
      + 'WhatsApp link here starts working.'
    : (isES
      ? 'No se ha confirmado ningun numero de WhatsApp, asi que ningun boton '
        + 'de esta maqueta marca. Indique el numero que realmente atienden y '
        + 'todos los enlaces de WhatsApp empezaran a funcionar.'
      : 'Nenhum numero de WhatsApp foi confirmado, entao nenhum botao deste '
        + 'mockup disca. Informe o numero que voces realmente atendem e todos '
        + 'os links de WhatsApp passam a funcionar.');
  function neutralise() {
    var sel = 'a[href*="wa.me"], a[href*="api.whatsapp"], a[data-wa], '
            + '.btn--wa, .wa, .wa-float';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (a) {
      if (a.tagName !== 'A') return;
      a.setAttribute('href', '#');
      a.removeAttribute('target');
      a.setAttribute('aria-disabled', 'true');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        alert(MSG);
      }, true);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(neutralise, 0);
    });
  } else {
    setTimeout(neutralise, 0);
  }
})();

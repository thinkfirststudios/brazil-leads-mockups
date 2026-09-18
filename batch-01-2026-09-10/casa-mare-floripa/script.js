/* ==========================================================================
   CASA MARÉ FLORIPA — script.js (shared by / and /en/)
   ========================================================================== */

/* REAL, published on casamare.fun — not a placeholder. */
const WA_NUMBER = '554891986553';                    // wa.me/554891986553
const BOOKING   = 'https://booking.casamare.fun';    // their existing engine
const RECEPCAO  = '/recepcao-online';                // their Online Reception page

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  wa: "Hello Casa Maré! I came from your website and I'd like to ask about a stay.",
  waRoom: r => `Hello Casa Maré! I came from your website and I'd like to check availability for ${r}.`,
  waMare: "Hello Casa Maré! I'd like to hear about the next Mare Day.",
  showT: 'Show translation', hideT: 'Hide translation',
  joined: '[CONFIRM community-list provider and double opt-in flow before launch.]'
} : {
  wa: 'Olá, Casa Maré! Vim pelo site e gostaria de saber sobre uma estadia.',
  waRoom: r => `Olá, Casa Maré! Vim pelo site e gostaria de consultar disponibilidade do ${r}.`,
  waMare: 'Olá, Casa Maré! Gostaria de saber sobre o próximo Mare Day.',
  showT: 'Ver tradução', hideT: 'Ocultar tradução',
  joined: '[CONFIRM ferramenta da lista da comunidade e fluxo de double opt-in antes do lançamento.]'
};

const wa = msg => 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp + booking handoffs ----------
     Every booking CTA points at their EXISTING booking subdomain rather than
     inventing a reservation flow. */
  document.querySelectorAll('[data-wa]').forEach(a => {
    const room = a.getAttribute('data-wa');
    a.href = wa(room === 'mare' ? T.waMare : (room && room !== 'true' ? T.waRoom(room) : T.wa));
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-book]').forEach(a => {
    a.href = BOOKING; a.target = '_blank'; a.rel = 'noopener';
  });

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
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Seasonal offer ribbon — data-driven so any promo swaps in ---------- */
  const rib = document.querySelector('.ribbon');
  if (rib) {
    const KEY = 'casamare_ribbon_v1';
    if (localStorage.getItem(KEY)) rib.hidden = true;
    rib.querySelector('button')?.addEventListener('click', () => {
      rib.hidden = true; localStorage.setItem(KEY, '1');
    });
  }

  /* ---------- Hero parallax — slow, gentle, off under reduced motion ---------- */
  const hb = document.querySelector('.hero__bg img');
  if (hb && !reduce) {
    let t = false;
    addEventListener('scroll', () => {
      if (t) return; t = true;
      requestAnimationFrame(() => {
        hb.style.transform = `translate3d(0,${Math.min(scrollY, innerHeight) * 0.15}px,0)`;
        t = false;
      });
    }, { passive:true });
  }

  /* ---------- Scroll reveal with a staggered fade-up on the room cards ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 100}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Testimonial translation toggle ----------
     The reviews are reproduced VERBATIM from their public Booking reviews, in
     the language each guest actually wrote in. Nothing is edited, aggregated
     or converted into a star rating. The translation is additive, shown only
     on request, and clearly marked as a translation. */
  document.querySelectorAll('.rev__toggle').forEach(b => {
    const tr = b.previousElementSibling;
    b.textContent = T.showT;
    b.addEventListener('click', () => {
      const hidden = tr.hidden;
      tr.hidden = !hidden;
      b.textContent = hidden ? T.hideT : T.showT;
    });
  });

  /* ---------- Community list capture ---------- */
  const cf = document.getElementById('mareForm');
  if (cf) cf.addEventListener('submit', ev => { ev.preventDefault(); alert(T.joined); });

  /* ---------- LGPD — Complianz-style, and it actually gates the trackers ----------
     Their live site loads Google Analytics (G-3HRM7B9E5W) and a Meta Pixel
     (1600398044671015) behind a banner that fires regardless of intent.
     Here NOTHING is injected until the matching category is consented to. */
  const ck = document.querySelector('.ck');
  const applyConsent = p => {
    if (!p) return;
    // [CONFIRM] Analytics (G-3HRM7B9E5W) is only injected inside this branch.
    if (p.analytics) { /* inject GA4 here — never before consent */ }
    // [CONFIRM] Meta Pixel (1600398044671015) is only injected inside this branch.
    if (p.marketing) { /* inject Meta Pixel here — never before consent */ }
  };
  if (ck) {
    const KEY = 'casamare_lgpd_v1';
    const saved = localStorage.getItem(KEY);
    if (!saved) setTimeout(() => ck.classList.add('on'), 900); else applyConsent(JSON.parse(saved));
    const save = p => { localStorage.setItem(KEY, JSON.stringify(p)); ck.classList.remove('on'); applyConsent(p); };
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 78, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

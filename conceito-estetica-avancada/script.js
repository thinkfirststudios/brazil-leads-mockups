/* ==========================================================================
   CONCEITO ESTÉTICA AVANÇADA — script.js (shared by / and /en/)

   ⚠ WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN, because Brazilian rules on
     advertising medical procedures prohibit it:
       · no price, no "a partir de", no package builder, no price calculator
       · no before/after slider or gallery of any kind
       · no promotion, discount, countdown or "promoções" capture
       · no "resultados em X sessões" claim
     Their live site runs an SMS/WhatsApp capture reading "Cadastre-se e receba
     promoções e novidades no seu celular!" on a page that also advertises
     Toxina Botulínica and Ácido Hialurônico. That is the central regulatory
     exposure of this lead, and it is not rebuilt here in any form.

   ⭐ The conversion engine is instead their OWN best idea, which their site
     half-builds and abandons: goal-first navigation. The visitor picks an
     objective and the treatment grid filters live to the technologies that
     address it — each card carrying MECHANISM, not outcome.
   ========================================================================== */

/* REAL, published in their own navigation. TWO numbers for TWO service lines. */
const WA_TRAT = '5548991063680';   // (48) 99106-3680 — "Agende seu tratamento"
const WA_DEPI = '5548991674272';   // (48) 99167-4272 — "Agende sua depilação"

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  /* their own pre-fill text, translated */
  generic: "Hello! I'd like more information about the treatments.",
  free:    "Hello! I'd like to book a free assessment.",
  trat: t => `Hello! I'd like more information about: ${t}.`,
  depi:    "Hello! I'd like to book hair removal (depilação)."
} : {
  generic: 'Gostaria de mais informações sobre os tratamentos.',
  free:    'Olá! Gostaria de agendar uma avaliação gratuita.',
  trat: t => `Olá! Gostaria de mais informações sobre: ${t}.`,
  depi:    'Olá! Gostaria de agendar minha depilação.'
};

const wa = (num, msg) => 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp: treatments line vs depilação line ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    const k = a.getAttribute('data-wa');
    if (k === 'depilacao') a.href = wa(WA_DEPI, T.depi);
    else if (k === 'free')  a.href = wa(WA_TRAT, T.free);
    else if (k && k !== 'true') a.href = wa(WA_TRAT, T.trat(k));
    else a.href = wa(WA_TRAT, T.generic);
    a.target = '_blank'; a.rel = 'noopener';
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

  /* ---------- ⭐ Goal-first filter — the engine of the page ----------
     Filters on their eight REAL published goal tags. 200ms fade, nothing
     decorative, and the whole thing is keyboard-operable. */
  const gbtns = document.querySelectorAll('.goals button');
  const cards = document.querySelectorAll('.txc');
  const count = document.getElementById('txCount');
  const setCount = n => { if (count) count.textContent = n; };

  if (gbtns.length) {
    const apply = goal => {
      let n = 0;
      cards.forEach(c => {
        const goals = (c.dataset.goals || '').split(' ');
        const show = goal === 'todos' || goals.includes(goal);
        c.hidden = !show;
        if (show) n++;
      });
      setCount(n);
    };
    gbtns.forEach(b => b.addEventListener('click', () => {
      gbtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      apply(b.dataset.goal);
      const grid = document.getElementById('tratamentos');
      if (grid && scrollY > grid.offsetTop) {
        scrollTo({ top: grid.offsetTop - 130, behavior: reduce ? 'auto' : 'smooth' });
      }
    }));
    setCount(cards.length);
  }

  /* ---------- Scroll reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 70}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Assessment enquiry form → WhatsApp ----------
     NOTE: this form collects a stated aesthetic concern. Under the LGPD that is
     health-adjacent and is treated as SENSITIVE DATA (art. 11): explicit
     consent, restricted access, stated purpose. It NEVER collects a medical
     history, a photograph of the body, or any diagnosis through the website. */
  const f = document.getElementById('avalForm');
  if (f) f.addEventListener('submit', ev => {
    ev.preventDefault();
    const d = new FormData(f), g = k => (d.get(k) || '—');
    const msg = IS_EN
      ? `Hello! I'd like to book a free assessment.\n• Name: ${g('nome')}\n• Goal: ${g('objetivo')}\n• Preferred time: ${g('horario')}`
      : `Olá! Gostaria de agendar uma avaliação gratuita.\n• Nome: ${g('nome')}\n• Objetivo: ${g('objetivo')}\n• Melhor horário: ${g('horario')}`;
    open(wa(WA_TRAT, msg), '_blank', 'noopener');
  });

  /* ---------- LGPD — gates GTM (GTM-KZNJV34) and anything else ---------- */
  const ck = document.querySelector('.ck');
  const applyConsent = p => {
    if (!p) return;
    // [CONFIRM] Google Tag Manager (GTM-KZNJV34) is injected only inside this branch.
    if (p.analytics) { /* inject GTM here — never before consent */ }
    if (p.marketing) { /* inject marketing tags here — never before consent */ }
  };
  if (ck) {
    const KEY = 'conceito_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 120, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

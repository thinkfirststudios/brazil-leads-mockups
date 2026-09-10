/* ==========================================================================
   CARDOSO & ADVOGADOS ASSOCIADOS — script.js (shared by / and /en/)

   ⚖️ WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN, because the OAB's
      advertising rules prohibit it:
        · no animated counters (no client counts, case counts, success rates)
        · no testimonial or review carousel
        · no countdown, urgency or scarcity timer
        · no exit-intent popup
        · no live-chat "talk to a lawyer now" widget
        · no "free consultation" hook of any kind
      Every one of those is standard on a US law-firm site and every one is
      prohibited or highly risky here. Their absence is a feature to be
      explained to the prospect, not an omission to be apologised for.
   ========================================================================== */

/* ⚠ [CONFIRM WhatsApp] — Instagram-only lead behind a login wall; nothing was
   captured. Intentionally non-dialable until confirmed. */
const WA_NUMBER = null;                       // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  /* Neutral wording only. Never "talk to a lawyer now", never "free consultation". */
  wa: 'Hello. I came from the firm’s website and I would like to arrange an appointment.',
  noNumber: '[CONFIRM] No WhatsApp number was obtained for the firm — this lead is Instagram-only and the ' +
            'profile is behind a login wall. This control is intentionally inert until the number is confirmed.',
  sent: 'This form does not create a lawyer–client relationship. Please do not send confidential information ' +
        'before a formal engagement. [CONFIRM the firm’s own intake process before this form goes live.]'
} : {
  wa: 'Olá. Vim pelo site do escritório e gostaria de agendar um atendimento.',
  noNumber: '[CONFIRM] Nenhum número de WhatsApp foi obtido para o escritório — este lead é somente Instagram e o ' +
            'perfil está atrás de login. Este controle fica inativo de propósito até o número ser confirmado.',
  sent: 'O envio deste formulário não estabelece relação advogado–cliente. Não envie informações confidenciais ' +
        'antes da contratação formal. [CONFIRM o fluxo de atendimento do escritório antes de publicar este formulário.]'
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp: a contact channel, never a solicitation hook ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    if (WA_NUMBER) {
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(T.wa);
      a.target = '_blank'; a.rel = 'noopener';
    } else {
      a.href = '#'; a.title = T.noNumber; a.setAttribute('data-unconfirmed', 'true');
      a.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNumber); });
    }
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

  /* ---------- Scroll reveal — short, slow, unshowy ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 5) * 90}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Contact form ----------
     No "response within X hours" promise, no case-evaluation offer, no urgency.
     It restates the no-relationship notice on submit, which is the point. */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    alert(T.sent);
  });

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'cardoso_lgpd_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 1100);
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 88, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

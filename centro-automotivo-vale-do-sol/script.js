/* ==========================================================================
   CENTRO AUTOMOTIVO VALE DO SOL — script.js
   pt-BR only. There is deliberately no /en/ tree: a workshop's customers live
   here and drive here.

   ⚠ WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN:
     · no animated stat counters — there is NO verified figure of any kind for
       this business (years, customers, cars serviced, reviews), and inventing
       one is exactly what this build exists to prevent
     · no review score, star rating or review count
     · no price calculator — no price is verified, and a wrong price on a
       workshop mockup is worse than no price
   ========================================================================== */

/* ⚠ [CONFIRM] — NOTHING was captured. No phone, no WhatsApp, no email, no
   address. The only public source is an Instagram profile behind a login wall.
   Both controls below stay inert until the real numbers are confirmed, because
   a wrong number on a phone-first workshop site is the worst possible bug. */
const TEL       = null;   // [CONFIRM telefone]
const WA_NUMBER = null;   // [CONFIRM WhatsApp]

const NO_CONTACT =
  '[CONFIRM] Nenhum telefone ou WhatsApp foi capturado para esta oficina — a única fonte pública é um perfil ' +
  'de Instagram atrás de login. Este botão fica inativo de propósito até o número real ser confirmado. ' +
  'Num site de oficina, que é telefone-primeiro, um número errado é o pior bug possível.';

const msg = {
  generic: 'Olá! Vim pelo site e gostaria de agendar um orçamento.',
  service: s => `Olá! Vim pelo site e gostaria de um orçamento para: ${s}.`,
  diag: 'Olá! Vim pelo site. Vou mandar um vídeo do barulho / uma foto do painel para vocês verem.',
  fleet: 'Olá! Vim pelo site e gostaria de falar sobre atendimento a frota.',
  prepurchase: 'Olá! Vim pelo site e gostaria de uma revisão pré-compra.'
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    const k = a.getAttribute('data-wa');
    const text = msg[k] || (k && k !== 'true' ? msg.service(k) : msg.generic);
    if (WA_NUMBER) {
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
      a.target = '_blank'; a.rel = 'noopener';
    } else {
      a.href = '#'; a.title = NO_CONTACT; a.setAttribute('data-unconfirmed', 'true');
      a.addEventListener('click', ev => { ev.preventDefault(); alert(NO_CONTACT); });
    }
  });

  /* ---------- Click-to-call ---------- */
  document.querySelectorAll('[data-tel]').forEach(a => {
    if (TEL) { a.href = 'tel:' + TEL; }
    else {
      a.href = '#'; a.title = NO_CONTACT; a.setAttribute('data-unconfirmed', 'true');
      a.addEventListener('click', ev => { ev.preventDefault(); alert(NO_CONTACT); });
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

  /* ---------- Scroll reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 85}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'valedosol_lgpd_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 900);
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 76, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

/* ==========================================================================
   COOL OFFICE LAGOA — script.js (shared by / and /en/)

   ⚠ THIS PROSPECT HAS NO WEBSITE. Everything is inferred from a public
     Instagram profile card behind a login wall. So this file deliberately
     contains NO invented data: no prices, no hours, no capacity, no rating,
     no review count, no member figure, no follower count.

   ⚠ The booking block below composes a WhatsApp MESSAGE and nothing else.
     There is no real-time inventory, no calendar sync and no fake availability.
     The date picker only builds the text.
   ========================================================================== */

/* ⚠ [CONFIRM] — the number was not readable from the public profile card.
   Until it is confirmed, every WhatsApp control renders in a DISABLED state
   with a visible [CONFIRM] label rather than a placeholder number that could
   dial a stranger. */
const WA_NUMBER = null;   // [CONFIRM]
const EMAIL     = null;   // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: "Hello! I came from your website and I'd like to book a desk.",
  plan: (p, d) => `Hello! I'd like to book ${p}${d ? ' for ' + d : ''}.`,
  noNumber: '[CONFIRM] Cool Office Lagoa’s WhatsApp number could not be read from the public Instagram ' +
            'profile card. This control is intentionally disabled until the real number is confirmed — a ' +
            'placeholder number could dial a stranger.',
  previewL: 'Message that will be composed:',
  pickPlan: 'Choose a plan and a date.'
} : {
  generic: 'Olá! Vim pelo site e queria reservar uma mesa.',
  plan: (p, d) => `Olá! Queria reservar ${p}${d ? ' para ' + d : ''}.`,
  noNumber: '[CONFIRM] O WhatsApp da Cool Office Lagoa não foi legível no cartão público do Instagram. ' +
            'Este controle fica desativado de propósito até o número real ser confirmado — um número ' +
            'placeholder poderia ligar para um desconhecido.',
  previewL: 'Mensagem que será composta:',
  pickPlan: 'Escolha um plano e uma data.'
};

const ddmm = iso => iso ? iso.split('-').reverse().slice(0, 2).join('/') : '';

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openWa = msg => {
    if (!WA_NUMBER) { alert(T.noNumber); return; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };

  document.querySelectorAll('[data-wa]').forEach(a => {
    const plan = a.getAttribute('data-wa');
    a.addEventListener('click', ev => {
      ev.preventDefault();
      openWa(plan && plan !== 'true' ? T.plan(plan, '') : T.generic);
    });
    if (!WA_NUMBER) { a.setAttribute('data-unconfirmed', 'true'); a.title = T.noNumber; }
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    if (EMAIL) a.href = 'mailto:' + EMAIL;
    else {
      a.href = '#'; a.setAttribute('data-unconfirmed', 'true'); a.title = T.noNumber;
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

  /* ---------- Booking block: composes a message, nothing else ---------- */
  const bf = document.getElementById('bookForm');
  if (bf) {
    const prev = document.getElementById('bookPreview');
    const build = () => {
      const f = new FormData(bf);
      const p = f.get('plano') || '—';
      const d = ddmm((f.get('data') || '').toString());
      const msg = T.plan(p, d);
      if (prev) prev.textContent = T.previewL + ' ' + msg;
      return msg;
    };
    bf.addEventListener('input', build);
    bf.addEventListener('submit', ev => {
      ev.preventDefault();
      const f = new FormData(bf);
      if (!f.get('plano') || !f.get('data')) { alert(T.pickPlan); return; }
      openWa(build());
    });
    build();
  }

  /* ---------- Scroll reveal — capped at 200ms, functional only ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.08, rootMargin:'0px 0px -4% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'cooloffice_lgpd_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 800);
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 74, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

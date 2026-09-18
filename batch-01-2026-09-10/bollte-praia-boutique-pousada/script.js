/* ==========================================================================
   BOLLTÉ PRAIA BOUTIQUE POUSADA — script.js (shared by / and /en/)

   ⚠ BLOCKING: no WhatsApp number was obtainable. This lead is Instagram-only
   (@bolltepousada) and the profile sits behind a login wall. The sticky
   WhatsApp button and the availability widget both depend on it, so
   WA_NUMBER stays null and every control shows a visible [CONFIRM] state
   rather than dialling a guessed number.

   ⚠ NO RATING LOGIC EXISTS IN THIS FILE, DELIBERATELY. The source calls the
   property "highly rated"; that is unverified. No score, star count, review
   count or aggregateRating is rendered anywhere — an unsourced rating is a
   CDC exposure and, in structured data, a Google manual-action risk.
   ========================================================================== */

const WA_NUMBER = null;                       // [CONFIRM → wa.me/55XXXXXXXXXXX]
const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: "Hello Bollté! I came from your website and I'd like to ask about a stay.",
  avail: (a, b, g) =>
    `Hello Bollté! I'd like to check availability.\n• Check-in: ${a}\n• Check-out: ${b}\n• Guests: ${g}`,
  contact: (n, w, e, d, m) =>
    `Hello Bollté! Enquiry from the website.\n• Name: ${n}\n• WhatsApp: ${w}\n• Email: ${e}\n• Dates: ${d}\n\n${m}`,
  noNumber: '[CONFIRM] No WhatsApp number could be obtained for Bollté — this lead is Instagram-only and the ' +
            'profile is behind a login wall. This control is intentionally inert until the real number is confirmed.',
  pickDates: 'Please choose a check-in and a check-out date.'
} : {
  generic: 'Olá, Bollté! Vim pelo site e gostaria de falar sobre uma hospedagem.',
  avail: (a, b, g) =>
    `Olá, Bollté! Gostaria de verificar disponibilidade.\n• Chegada: ${a}\n• Saída: ${b}\n• Hóspedes: ${g}`,
  contact: (n, w, e, d, m) =>
    `Olá, Bollté! Contato pelo site.\n• Nome: ${n}\n• WhatsApp: ${w}\n• E-mail: ${e}\n• Datas: ${d}\n\n${m}`,
  noNumber: '[CONFIRM] Nenhum número de WhatsApp foi obtido para a Bollté — este lead é somente Instagram e o ' +
            'perfil está atrás de login. Este controle fica inativo de propósito até o número real ser confirmado.',
  pickDates: 'Escolha uma data de chegada e uma de saída.'
};

/* DD/MM — Brazilian date format throughout */
const ddmm = iso => iso ? iso.split('-').reverse().slice(0, 2).join('/') : '';

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openWa = msg => {
    if (!WA_NUMBER) { alert(T.noNumber); return; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };

  document.querySelectorAll('[data-wa]').forEach(a => {
    a.addEventListener('click', ev => { ev.preventDefault(); openWa(T.generic); });
    if (!WA_NUMBER) { a.setAttribute('data-unconfirmed', 'true'); a.title = T.noNumber; }
  });

  /* ---------- Sticky nav ---------- */
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
        a.style.transitionDelay = open ? `${80 + i*60}ms` : '0ms');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- ⭐ Availability widget → WhatsApp deep link with DD/MM dates ----------
     Until a booking engine is chosen, submit routes to WhatsApp. This is the
     specified behaviour, not a stopgap: it matches how the property will
     actually take the enquiry. */
  const av = document.getElementById('availForm');
  if (av) av.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(av);
    const a = ddmm(f.get('in')), b = ddmm(f.get('out'));
    if (!a || !b) { alert(T.pickDates); return; }
    openWa(T.avail(a, b, f.get('guests') || '2'));
  });

  /* ---------- Contact form ---------- */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    openWa(T.contact(g('nome'), g('zap'), g('email'), g('datas'), g('mensagem')));
  });

  /* ---------- Scroll reveal — slow and wide, to match the rhythm ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 110}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Hero parallax ---------- */
  const hb = document.querySelector('.hero__bg img');
  if (hb && !reduce) {
    let t = false;
    addEventListener('scroll', () => {
      if (t) return; t = true;
      requestAnimationFrame(() => {
        hb.style.transform = `translate3d(0,${Math.min(scrollY, innerHeight) * 0.16}px,0)`;
        t = false;
      });
    }, { passive:true });
  }

  /* ---------- LGPD — the Instagram embed stays gated behind marketing consent ---------- */
  const ck = document.querySelector('.ck');
  const gate = document.querySelector('.ig-gate');
  const applyConsent = p => {
    if (gate) gate.hidden = !!(p && p.marketing);
    // [CONFIRM] When a real embed is added, it is only injected here, inside this branch.
  };
  if (ck) {
    const KEY = 'bollte_lgpd_v1';
    const saved = localStorage.getItem(KEY);
    if (!saved) setTimeout(() => ck.classList.add('on'), 1000); else applyConsent(JSON.parse(saved));
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

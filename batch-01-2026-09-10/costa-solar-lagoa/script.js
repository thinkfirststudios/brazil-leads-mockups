/* ==========================================================================
   COSTA SOLAR LAGOA — script.js (shared by / and /en/)

   🚩 THE THINNEST LEAD IN THE BATCH.
      The only public reference supplied is ONE login-walled Instagram post.
      We do not know: the category (lodging is ASSUMED and UNVERIFIED), the
      address, whether "Lagoa" means Lagoa da Conceição, the phone, or whether
      the business is currently trading.

   ⚠ Consequently this file contains NO business data at all. No rate, no unit,
     no amenity, no check-in time, no review, no distance figure. The availability
     widget composes a WhatsApp message and performs no lookup — there is no
     booking engine, and pretending otherwise would be inventing a fact.
   ========================================================================== */

/* 🚩 BLOCKING: the sticky WhatsApp button cannot be wired without this number.
   Until it exists every WhatsApp control renders visibly unconfirmed rather
   than dialling a placeholder that could reach a stranger. */
const WA_NUMBER = null;   // [CONFIRM] → '55' + DDD + number
const EMAIL     = null;   // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to check availability.',
  stay: (i, o, g) => `Hello! I would like to check availability.\n• Check-in: ${i}\n• Check-out: ${o}\n• Guests: ${g}`,
  form: d => `Hello! I would like to enquire about a stay.\n• Name: ${d.nome}\n• Dates: ${d.datas}\n• Email: ${d.email}\n• Message: ${d.msg}`,
  noNum: '[CONFIRM] No phone or WhatsApp number was supplied for Costa Solar Lagoa — the only public ' +
         'reference we have is a single login-walled Instagram post. This control stays disabled until ' +
         'the real number is confirmed.',
  needDates: 'Please choose a check-in and a check-out date.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  preview: 'Message to be sent:'
} : {
  generic: 'Olá! Vim pelo site e gostaria de verificar a disponibilidade.',
  stay: (i, o, g) => `Olá! Gostaria de verificar disponibilidade.\n• Chegada: ${i}\n• Saída: ${o}\n• Hóspedes: ${g}`,
  form: d => `Olá! Gostaria de fazer uma consulta de hospedagem.\n• Nome: ${d.nome}\n• Datas: ${d.datas}\n• E-mail: ${d.email}\n• Mensagem: ${d.msg}`,
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp foi fornecido para a Costa Solar Lagoa — a única ' +
         'referência pública que temos é um post do Instagram atrás de login. Este controle fica ' +
         'desativado até o número real ser confirmado.',
  needDates: 'Escolha a data de chegada e a de saída.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  preview: 'Mensagem que será enviada:'
};

/* Dates always render DD/MM — never MM/DD, on either tree. */
const ddmm = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return d && m ? `${d}/${m}` : '—';
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openWa = msg => {
    if (!WA_NUMBER) { alert(T.noNum); return false; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    return true;
  };

  document.querySelectorAll('[data-wa]').forEach(el => {
    el.addEventListener('click', ev => { ev.preventDefault(); openWa(T.generic); });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  document.querySelectorAll('[data-email]').forEach(el => {
    if (EMAIL) { el.href = 'mailto:' + EMAIL; return; }
    el.href = '#'; el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum;
    el.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNum); });
  });

  /* ---------- Sticky nav: condenses and gains a shadow ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 40);
  stick(); addEventListener('scroll', stick, { passive:true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger'), mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const on = mnav.classList.toggle('on');
      burger.classList.toggle('on', on);
      burger.setAttribute('aria-expanded', on);
      document.body.style.overflow = on ? 'hidden' : '';
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Hero parallax — rAF-throttled, transform only ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        const y = Math.min(scrollY, 900);
        hbg.style.transform = `translate3d(0,${y * 0.16}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ Availability widget ----------
     ⚠ NO LOOKUP HAPPENS. No booking engine has been chosen and no inventory
     exists, so submitting composes a WhatsApp message with the dates in DD/MM
     and nothing more. */
  const av = document.getElementById('availForm');
  if (av) av.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(av);
    const i = f.get('in'), o = f.get('out');
    if (!i || !o) { alert(T.needDates); return; }
    openWa(T.stay(ddmm(i), ddmm(o), f.get('guests') || '—'));
  });

  /* ---------- Accommodation carousel ---------- */
  const track = document.querySelector('.track');
  if (track) {
    const step = () => (track.querySelector('.card')?.offsetWidth || 340) + 22;
    document.querySelector('[data-carou="prev"]')?.addEventListener('click',
      () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    document.querySelector('[data-carou="next"]')?.addEventListener('click',
      () => track.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }));
  }

  /* ---------- Scroll reveals with row stagger ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -7% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Deliberately finds nothing on this build: there is no verified stat,
     no unit count, no review score and no "years in business" to count up to.
     The engine stays so the section works the moment real figures arrive. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1400;
    const tickf = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tickf);
    };
    requestAnimationFrame(tickf);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- Contact form → WhatsApp, with an explicit LGPD consent gate ---- */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!cf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    openWa(T.form({ nome:g('nome'), datas:g('datas'), email:g('email'), msg:g('msg') }));
  });

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'costasolar_lgpd_v1';
    const applyConsent = p => {
      if (!p) return;
      if (p.analytics) { /* analytics tags are injected ONLY inside this branch */ }
      if (p.marketing) { /* marketing tags are injected ONLY inside this branch */ }
    };
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

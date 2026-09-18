/* ==========================================================================
   ESSÊNCIA DO SOL POUSADA — script.js (shared by / and /en/)

   Their WhatsApp deep link is ALREADY in their own markup, so unlike most of
   this batch the sticky button here is wired for real.

   ⚠ WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN:
     · no rate. No price is published on any of their seven suites.
     · NO AGGREGATE REVIEW SCORE. Their site self-publishes "4,5/5" described
       as aggregated across Booking, TripAdvisor and Google. A self-aggregated
       figure is NOT a platform-verified one, and republishing it without a
       source is a real CDC advertising-claim risk — so the three attributed
       guest quotes run WITHOUT a numeric score until it is sourced.
     · no star rating and no award: their site publishes none.

   ⚠ The availability widget performs no lookup. Their "reserve agora" button
     may or may not have an engine behind it [CONFIRM], so submitting composes a
     WhatsApp message with the dates pre-filled — which is exactly the mechanism
     their own site argues for and does not have.
   ========================================================================== */

/* REAL, taken from the wa.me deep link already present in their markup. */
const WA_NUMBER = '5548991406160';        // +55 48 99140-6160
const TEL_1     = '5548991406160';
const TEL_2     = '998646060';            // 99864-6060 as published [CONFIRM DDD]
const EMAIL     = 'pousadaessenciasol@gmail.com';

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like information about the pousada.',
  host: 'Hello Ranieri! I came from the website and I would like to ask about a stay.',
  suite: s => `Hello! I would like information and rates for the ${s} suite.`,
  stay: q => `Hello! I would like to check availability at Essência do Sol.\n• Check-in: ${q.i}\n` +
             `• Check-out: ${q.o}\n• Guests: ${q.g}`,
  contact: d => `Hello!\n• Name: ${d.nome}\n• Email: ${d.email}\n• Dates: ${d.datas}\n• Message: ${d.msg}`,
  needDates: 'Please choose a check-in and a check-out date.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  showing: (n, t) => `Showing ${n} of ${t}`
} : {
  generic: 'Olá! Vim pelo site e gostaria de informações sobre a pousada.',
  host: 'Olá Ranieri! Vim pelo site e gostaria de falar sobre uma hospedagem.',
  suite: s => `Olá! Gostaria de informações e valores da suíte ${s}.`,
  stay: q => `Olá! Gostaria de verificar disponibilidade na Essência do Sol.\n• Chegada: ${q.i}\n` +
             `• Saída: ${q.o}\n• Hóspedes: ${q.g}`,
  contact: d => `Olá!\n• Nome: ${d.nome}\n• E-mail: ${d.email}\n• Datas: ${d.datas}\n• Mensagem: ${d.msg}`,
  needDates: 'Escolha a data de chegada e a de saída.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  showing: (n, t) => `Exibindo ${n} de ${t}`
};

/* DD/MM on both trees. */
const ddmm = iso => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return d && m ? `${d}/${m}` : '—';
};
const wa = msg => 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-wa]').forEach(a => {
    const k = a.getAttribute('data-wa');
    a.href = wa(k === 'host' ? T.host : (k && k !== 'true') ? T.suite(k) : T.generic);
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tel="1"]').forEach(a => a.href = 'tel:+' + TEL_1);
  document.querySelectorAll('[data-tel="2"]').forEach(a => a.href = 'tel:' + TEL_2);
  document.querySelectorAll('[data-email]').forEach(a => a.href = 'mailto:' + EMAIL);

  /* ---------- Sticky nav ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 55);
  stick(); addEventListener('scroll', stick, { passive:true });

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

  /* ---------- Hero parallax ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 900) * 0.15}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- Availability widget → the mechanism their own copy argues for --
     Their site already says, verbatim, "Reserve diretamente conosco para o
     melhor preço e atendimento personalizado" — and has nothing behind it.
     This composes the message; it does not pretend to hold inventory. */
  const av = document.getElementById('availForm');
  if (av) av.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(av);
    const i = f.get('chegada'), o = f.get('saida');
    if (!i || !o) { alert(T.needDates); return; }
    open(wa(T.stay({ i: ddmm(i), o: ddmm(o), g: f.get('hospedes') || '2' })), '_blank', 'noopener');
  });

  /* ---------- Carousels: destinations and reviews ---------- */
  document.querySelectorAll('[data-carou-for]').forEach(ctl => {
    const track = document.getElementById(ctl.dataset.carouFor);
    if (!track) return;
    const step = () => (track.firstElementChild?.offsetWidth || 340) + 22;
    ctl.querySelector('[data-carou="prev"]')?.addEventListener('click',
      () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    ctl.querySelector('[data-carou="next"]')?.addEventListener('click',
      () => track.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  /* ---------- Gallery filter ---------- */
  const fb = document.querySelector('.filters');
  if (fb) {
    const items = [...document.querySelectorAll('.gal figure')];
    const out = document.getElementById('galCount');
    const apply = k => {
      let n = 0;
      items.forEach(it => {
        const show = k === 'all' || (it.dataset.k || '').split(' ').includes(k);
        it.hidden = !show; if (show) n++;
      });
      if (out) out.textContent = T.showing(n, items.length);
    };
    fb.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      fb.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      apply(b.dataset.k);
    }));
    apply('all');
  }

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ The only figure it could animate on this build is the number of suites,
     which is REAL and published by them: seven. It will not animate the "4,5"
     review score — that value never reaches the DOM. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1100;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- Contact form ---------- */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!cf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    open(wa(T.contact({ nome:g('nome'), email:g('email'), datas:g('datas'), msg:g('msg') })), '_blank', 'noopener');
  });

  /* ---------- LGPD — the consent copy covers FORM SUBMISSIONS too ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'essencia_lgpd_v1';
    const applyConsent = p => {
      if (!p) return;
      if (p.analytics) { /* analytics injected ONLY inside this branch */ }
      if (p.marketing) { /* marketing tags injected ONLY inside this branch */ }
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 86, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

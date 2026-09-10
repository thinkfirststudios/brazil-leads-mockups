/* ==========================================================================
   CAMILA SAUNIER INTERNATIONAL REALTY — script.js (shared by /en/ and /)

   ⚠ NO RETURN, YIELD, APPRECIATION OR ROI LOGIC EXISTS IN THIS FILE.
     Marketing brokerage as investment does not turn it into a regulated
     advisory service, but publishing unsubstantiated return figures is
     prohibited regardless — and if securitised products (FIIs, funds) ever
     enter the offer, CVM rules apply. There is no "Investment Properties"
     collection and no yield calculator, by design.

   ⚠ DUAL CURRENCY: R$ is the transacting currency and is ALWAYS primary.
     USD is secondary, always labelled indicative, always carries a
     [CONFIRM] conversion basis and date, and NEVER appears alone.
   ========================================================================== */

/* ⚠ [CONFIRM] — no phone, WhatsApp, email or address was recoverable from
   camilasaunier.com. Placeholders are intentionally non-dialable. */
const WA_NUMBER = null;                          // [CONFIRM]
const EMAIL     = 'contact@example.com';         // [CONFIRM]

/* ⚠ [CONFIRM conversion basis and date.] This rate is a PLACEHOLDER and is
   labelled indicative everywhere it is used. Never imply a fixed rate or a
   guaranteed price in USD. */
const FX = { usdPerBrl: null, basis: '[CONFIRM basis]', date: '[CONFIRM DD/MM/AAAA]' };

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  wa: "Hello Camila! I came from your website and I'd like to talk about a property in Brazil.",
  subject: 'Private consultation request — Camila Saunier International Realty',
  noNumber: '[CONFIRM] No WhatsApp number was recoverable from camilasaunier.com. This control is intentionally ' +
            'inert until the real number is confirmed — email is wired and works.',
  indicative: 'indicative only',
  f: { name:'Name', email:'Email', phone:'Phone', market:'Market of interest',
       budget:'Budget band', timeline:'Timeline', note:'Note' }
} : {
  wa: 'Olá, Camila! Vim pelo site e gostaria de falar sobre um imóvel no Brasil.',
  subject: 'Pedido de consultoria privada — Camila Saunier International Realty',
  noNumber: '[CONFIRM] Nenhum número de WhatsApp foi recuperado de camilasaunier.com. Este controle fica inativo ' +
            'de propósito até o número real ser confirmado — o e-mail está ligado e funciona.',
  indicative: 'valor indicativo',
  f: { name:'Nome', email:'E-mail', phone:'Telefone', market:'Mercado de interesse',
       budget:'Faixa de investimento', timeline:'Prazo', note:'Observações' }
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Contact channels ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    if (WA_NUMBER) {
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(T.wa);
      a.target = '_blank'; a.rel = 'noopener';
    } else {
      a.href = '#'; a.title = T.noNumber; a.setAttribute('data-unconfirmed', 'true');
      a.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNumber); });
    }
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject);
  });

  /* ---------- Sticky header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 30);
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

  /* ---------- Hero carousel: keyboard-operable, pausable, reduced-motion aware ---------- */
  const slides = [...document.querySelectorAll('.hero__slide')];
  if (slides.length) {
    let i = 0, timer = null;
    const counter = document.querySelector('.hero__count');
    const show = n => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle('on', k === i);
        s.setAttribute('aria-hidden', String(k !== i));
      });
      if (counter) counter.textContent =
        String(i + 1).padStart(2, '0') + ' — ' + String(slides.length).padStart(2, '0');
    };
    const start = () => { if (!reduce) timer = setInterval(() => show(i + 1), 6500); };
    const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };
    document.querySelector('[data-slide="prev"]')?.addEventListener('click', () => { stop(); show(i - 1); });
    document.querySelector('[data-slide="next"]')?.addEventListener('click', () => { stop(); show(i + 1); });
    const hero = document.querySelector('.hero');
    hero?.addEventListener('mouseenter', stop);
    hero?.addEventListener('focusin', stop);
    show(0);
    start();                    // never auto-advances under prefers-reduced-motion
  }

  /* ---------- Currency toggle — R$ primary, USD indicative, never alone ---------- */
  const cbtns = document.querySelectorAll('[data-cur]');
  if (cbtns.length) cbtns.forEach(b => b.addEventListener('click', () => {
    const cur = b.dataset.cur;
    cbtns.forEach(x => x.classList.toggle('on', x === b));
    // Emphasis swaps; BOTH lines always stay visible, because USD must never appear alone.
    document.querySelectorAll('.price').forEach(p => {
      const brl = p.querySelector('.price__brl'), usd = p.querySelector('.price__usd');
      if (!brl || !usd) return;
      const showUsdFirst = cur === 'usd';
      p.style.display = 'flex';
      p.style.flexDirection = showUsdFirst ? 'column-reverse' : 'column';
      brl.style.fontSize = showUsdFirst ? '.9rem' : '';
      usd.style.fontSize = showUsdFirst ? '1.2rem' : '';
    });
  }));

  /* ---------- Scroll reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Consultation form → email ----------
     Collects budget, timeline and identity — sensitive commercial information.
     It NEVER collects CPF, passport numbers or financial documents. */
  const cf = document.getElementById('consultForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    const body = [
      `${T.f.name}: ${g('name')}`, `${T.f.email}: ${g('email')}`, `${T.f.phone}: ${g('phone')}`,
      `${T.f.market}: ${g('market')}`, `${T.f.budget}: ${g('budget')}`, `${T.f.timeline}: ${g('timeline')}`,
      '', g('note')
    ].join('\n');
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject) +
                    '&body=' + encodeURIComponent(body);
  });

  /* ---------- LGPD + GDPR — her audience is explicitly foreign, so both apply ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'camila_consent_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 92, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

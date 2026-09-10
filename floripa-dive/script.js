/* ==========================================================================
   FLORIPA DIVE — script.js (shared by / and /en/)

   Their published WhatsApp number is REAL and reservations happen there by
   their own instruction ("Reservas whatsapp 48-999042041"), so every control
   here is wired for real.

   ⚠ WHAT WAS STRIPPED OUT OF THEIR CURRENT TEMPLATE AND IS ABSENT HERE:
     · the three template testimonials attributed to "João P.", "Maria F." and
       "Carlos S." — there is no testimonial rendering code in this file
     · the three counters still rendering as "0 +" — the count-up engine below
       refuses to animate an unconfirmed figure, so it shows a visible blank
       rather than a zero
     · the four generic "differentiator" blocks and the 2022 filler posts

   ⚠ WHAT IS NEVER WRITTEN HERE: no agency other than NAUI (the only one they
     name), no instructor name, no credential number, no vessel registration,
     no CADASTUR, no CNPJ, no marine-life species list, no visibility figure,
     no water temperature. Diving is the most safety-critical activity in this
     batch and a fabricated credential is the worst possible thing to invent.
   ========================================================================== */

/* REAL, published on their own site. */
const WA_NUMBER = '5548999042041';   // +55 48 99904-2041
const EMAIL     = 'contato@floripadive.com.br';

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hi! I came from your website and I would like to book a dive.',
  prod: p => `Hi! I would like to book: ${p}. Which departure has space — 08h or 14h?`,
  course: c => `Hi! I would like information and the price for the course: ${c}.`,
  form: d => `Hi!\n• Name: ${d.nome}\n• WhatsApp: ${d.wpp}\n• Activity: ${d.atividade}\n` +
             `• Preferred date: ${d.data}\n• Departure: ${d.saida}\n• People: ${d.pax}\n• Message: ${d.msg}`,
  needConsent: 'Please tick the consent box so we can reply to you.',
  min: 'Departures need a minimum of 2 people.'
} : {
  generic: 'Oi! Vim pelo site e gostaria de reservar um mergulho.',
  prod: p => `Oi! Gostaria de reservar: ${p}. Qual saída tem vaga — 08h ou 14h?`,
  course: c => `Oi! Gostaria de informações e valor do curso: ${c}.`,
  form: d => `Oi!\n• Nome: ${d.nome}\n• WhatsApp: ${d.wpp}\n• Atividade: ${d.atividade}\n` +
             `• Data pretendida: ${d.data}\n• Saída: ${d.saida}\n• Pessoas: ${d.pax}\n• Mensagem: ${d.msg}`,
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  min: 'As saídas precisam de no mínimo 2 pessoas.'
};

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
    a.href = wa(k === 'true' || !k ? T.generic
              : k.startsWith('curso:') ? T.course(k.slice(6)) : T.prod(k));
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tel]').forEach(a => a.href = 'tel:+' + WA_NUMBER);
  document.querySelectorAll('[data-email]').forEach(a => a.href = 'mailto:' + EMAIL);

  /* ---------- Header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 60);
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

  /* ---------- ⭐ THE DEPTH RAIL ----------
     Maps scroll progress onto the real depth range this business publishes:
     0 m at the waterline, 34 m at the deepest of their three island sites.
     It is decorative and aria-hidden — it never carries information that is
     not also stated in text. */
  const rail = document.querySelector('.rail');
  if (rail) {
    const marker = rail.querySelector('.rail__m');
    const read = rail.querySelector('[data-depth]');
    let tick = false;
    const run = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(scrollY / max, 1) : 0;
      const top = 80 + p * (innerHeight - 130);
      if (marker) marker.style.top = top + 'px';
      if (read) read.textContent = Math.round(p * 34) + ' m';
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive:true });
    addEventListener('resize', run, { passive:true });
    run();
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

  /* ---------- Booking enquiry — hands off to WhatsApp, which is the channel
       they themselves instruct people to use. Every booking action on the page
       otherwise points at their existing WooCommerce products. ---------- */
  const bf = document.getElementById('bookForm');
  if (bf) bf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!bf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(bf), g = k => (f.get(k) || '—');
    const pax = parseInt(f.get('pax'), 10);
    /* their own rule: a departure needs a minimum of two divers */
    if (pax === 1) alert(T.min);
    open(wa(T.form({ nome:g('nome'), wpp:g('wpp'), atividade:g('atividade'),
                     data:ddmm(f.get('data')), saida:g('saida'), pax:g('pax'), msg:g('msg') })),
         '_blank', 'noopener');
  });

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 90}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ THE POINT HERE IS WHAT IT REFUSES TO DO. Their live site ships three
     counters that were never configured and still render as "0 +" — Mergulhos,
     Passeios, Certificados. A zero on a dive school's homepage is worse than
     no number at all. So this animates only a real figure, and an unconfirmed
     one stays a visible blank. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to) || to === 0) return;   // "[CONFIRM]" and 0 both land here
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- LGPD.
     ⚠ Their current site has NO cookie consent mechanism at all — mandatory
     and missing. This one is granular, nothing is pre-ticked, and rejecting is
     exactly as easy and as prominent as accepting.

     ⚠⚠ SEPARATE AND MORE IMPORTANT: a diving operation collects a MEDICAL
     QUESTIONNAIRE. That is health data — dado pessoal sensível under LGPD
     art. 11 — and it requires its own explicit consent, a stricter retention
     regime and controlled access. It must NEVER be a plain web input feeding
     an inbox, which is why no medical form exists anywhere in this build. --- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'floripadive_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 110, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

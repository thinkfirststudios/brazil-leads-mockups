/* ==========================================================================
   FLORIPA STAND UP PADDLE — script.js (shared by / and /en/)

   ⭐ THE RARE ONE. On this lead the prices, the CNPJ and the product list are
     all VERIFIED from their live catalogue, so this file is not full of nulls.
     Twelve tours, twelve real prices, R$ 160 – R$ 250, all per their own
     storefront on 09/09/2026.

   ⚠ WHAT IS STILL MISSING, AND IS MARKED RATHER THAN GUESSED:
     · DURATION — not published for a single one of the twelve. That is a
       MATERIAL TERM under the consumer code: nobody can compare a R$ 160
       full-moon paddle against a R$ 250 Naufragados trip without knowing how
       long each takes.
     · meeting points, departure times, group size, what to bring
     · minimum age on eleven of twelve tours. Only the Ilha do Campeche sunrise
       tour publishes "Para maiores de 18 anos" — and silence is not a policy.
     · guide certification, CADASTUR, insurance, support boat

   ⚠ Every booking action HANDS OFF TO THEIR EXISTING PAYTOUR ENGINE. This file
     invents no reservation flow, holds no inventory and fakes no availability.

   ⚠ NO review score is synthesised. Their TripAdvisor rating and review count
     are unverified, and a summarised score never appears.
   ========================================================================== */

/* REAL, published by them. */
const WA_NUMBER = '5548999441220';   // +55 (48) 99944-1220 [CONFIRM international format]
const CNPJ      = '55.446.599/0001-83';
const PAYTOUR   = 'https://loja-floripastandup.paytour.com.br';

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hi! I came from your website and I would like to book a paddle tour.',
  tour: t => `Hi! I would like to book: ${t}. Could you tell me the duration, the meeting point and the departure time?`,
  form: d => `Hi!\n• Name: ${d.nome}\n• WhatsApp: ${d.wpp}\n• Tour: ${d.tour}\n• Date: ${d.data}\n` +
             `• People: ${d.pax}\n• SUP or kayak: ${d.kit}\n• Message: ${d.msg}`,
  needConsent: 'Please tick the consent box so we can reply to you.',
  showing: (n, t) => n === t ? `Showing all ${t} tours` : `Showing ${n} of ${t} tours`,
  none: 'No tour matches those filters. Clearing them.',
  age18: 'This tour is published as 18+ only.'
} : {
  generic: 'Oi! Vim pelo site e gostaria de reservar um passeio.',
  tour: t => `Oi! Gostaria de reservar: ${t}. Vocês podem me dizer a duração, o ponto de encontro e o horário de saída?`,
  form: d => `Oi!\n• Nome: ${d.nome}\n• WhatsApp: ${d.wpp}\n• Passeio: ${d.tour}\n• Data: ${d.data}\n` +
             `• Pessoas: ${d.pax}\n• SUP ou caiaque: ${d.kit}\n• Mensagem: ${d.msg}`,
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  showing: (n, t) => n === t ? `Exibindo os ${t} passeios` : `Exibindo ${n} de ${t} passeios`,
  none: 'Nenhum passeio combina com esses filtros. Limpando.',
  age18: 'Este passeio é publicado como maiores de 18 anos.'
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
    a.href = wa(!k || k === 'true' ? T.generic : T.tour(k));
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tel]').forEach(a => a.href = 'tel:+' + WA_NUMBER);
  /* every booking hands off to the engine they already run */
  document.querySelectorAll('[data-paytour]').forEach(a => {
    a.href = PAYTOUR; a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Header ---------- */
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

  /* ---------- Hero parallax — water-slow ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 900) * 0.13}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ THE FILTER RAIL ----------
     Twelve products are too many to scan and too few to need search. Filters
     by type AND by price, because those are the two axes a customer actually
     decides on. Sunrise is a first-class filter: departure time is the most
     decision-relevant attribute in this catalogue. */
  const bar = document.querySelector('.filters');
  const cards = [...document.querySelectorAll('.tour')];
  const out = document.getElementById('tourCount');
  if (bar && cards.length) {
    const apply = key => {
      let n = 0;
      cards.forEach(c => {
        let show;
        if (key === 'all') show = true;
        else if (key === 'cheap') show = parseInt(c.dataset.price, 10) <= 200;
        else show = (c.dataset.kind || '').split(' ').includes(key);
        c.hidden = !show;
        if (show) n++;
      });
      if (out) out.textContent = T.showing(n, cards.length);
      return n;
    };
    bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const n = apply(b.dataset.k);
      bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      if (n === 0) {
        alert(T.none);
        apply('all');
        bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === 'all')));
      }
    }));
    apply('all');
  }

  /* ---------- Search widget.
     ⚠ It FILTERS the catalogue and hands off to the matching Paytour product.
     It does not fake availability and it does not invent a price. ---------- */
  const sf = document.getElementById('searchForm');
  if (sf) sf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(sf);
    const dest = (f.get('destino') || '').toString();
    const grid = document.getElementById('tourGrid');
    if (dest && dest !== 'all') {
      let n = 0;
      cards.forEach(c => { const s = c.dataset.slug === dest; c.hidden = !s; if (s) n++; });
      if (out) out.textContent = T.showing(n, cards.length);
      bar?.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
    }
    grid?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block:'start' });
  });

  /* ---------- Destinations map rail ----------
     Eleven searchable place names, each with a real page behind it. This is the
     strongest organic asset in the whole project, and today it does not exist
     anywhere outside a hosted storefront. */
  const map = document.querySelector('.mapwrap');
  if (map) {
    const card = map.querySelector('.pincard');
    const pins = [...map.querySelectorAll('.pin')];
    const list = document.querySelectorAll('.destlist button');
    const show = pin => {
      pins.forEach(x => x.setAttribute('aria-pressed', String(x === pin)));
      list.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.slug === pin.dataset.slug)));
      if (!card) return;
      card.querySelector('b').textContent = pin.dataset.name;
      card.querySelector('p').textContent = pin.dataset.note;
      const a = card.querySelector('a');
      if (a) { a.href = '#' + pin.dataset.slug; a.hidden = false; }
    };
    pins.forEach(pin => pin.addEventListener('click', () => show(pin)));
    list.forEach(b => b.addEventListener('click', () => {
      const pin = pins.find(x => x.dataset.slug === b.dataset.slug);
      if (pin) show(pin);
    }));
    if (pins[0]) show(pins[0]);
  }

  /* ---------- Contact form ---------- */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!cf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    open(wa(T.form({ nome:g('nome'), wpp:g('wpp'), tour:g('tour'), data:ddmm(f.get('data')),
                     pax:g('pax'), kit:g('kit'), msg:g('msg') })), '_blank', 'noopener');
  });

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 80}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     Animates only the figures that are REAL: twelve tours, and the R$ 160
     entry price. The fourth stat slot carries "[CONFIRM]" and stays a visible
     blank — years operating and guests guided are both unverified. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = el.dataset.prefix ? el.dataset.prefix + to : to; return; }
    const t0 = performance.now(), dur = 1300;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = el.dataset.prefix ? el.dataset.prefix + v : v;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- LGPD.
     ⚠ Their current notice is a single "Entendi" button with no reject option
     and no granular control. That is not valid consent under the LGPD, and it
     is replaced here by a real banner: analytics and marketing off by default,
     nothing pre-ticked, reject exactly as easy and as prominent as accept.

     ⚠ PAYTOUR IS A THIRD-PARTY PROCESSOR handling booking and payment data and
     must be named as one in the privacy policy.

     ⚠ If a medical-condition disclosure is collected before a tour, that is
     health data — sensitive under art. 11 — and it is never collected by this
     website. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'fsup_lgpd_v1';
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

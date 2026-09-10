/* ==========================================================================
   CUMBUCA CAFÉ — script.js (shared by / and /en/)

   ⚠ INSTAGRAM-ONLY LEAD. instagram.com/cumbuca__/ returns 200 and serves a
     login wall with no readable metadata. NOTHING about this business is
     verified, so this file contains:
       · no drink, no dish, no price
       · no coffee origin, producer, process, roast level or roaster name
       · no brew method (V60, Aeropress, Chemex, prensa, espresso variants are
         NOT listed — listing an unoffered method in front of a specialty
         audience is the fastest way to lose them)
       · no opening hours, no address, no phone
       · no review, no rating

   ⭐ The one thing this file DOES do is compute today's hours live from a
     schedule object — which is empty on purpose. The moment the real schedule
     is supplied, the topbar starts answering "are they open right now", which
     is the single question Instagram structurally cannot answer.
   ========================================================================== */

/* [CONFIRM] — no phone or WhatsApp is readable from the login-walled profile. */
const WA_NUMBER = null;
const EMAIL     = null;

/* ⭐ [CONFIRM schedule] — the live-hours engine below is complete and correct;
   it simply has nothing to read yet. Fill this in as
   { 0:[['09:00','17:00']], 1:[['08:00','18:00']], … } with 0 = Sunday, and the
   topbar goes live with no other change. `kitchen` is the last-order time,
   which is the question specialty cafés get asked most. */
const HOURS   = null;   // [CONFIRM]
const KITCHEN = null;   // [CONFIRM last order]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to ask about Cumbuca.',
  item: n => `Hello! I would like to ask about: ${n}.`,
  beans: n => `Hello! I would like to reserve beans: ${n}.`,
  order: 'Hello! I would like to place an order.',
  event: d => `Hello! I would like to ask about an event at Cumbuca.\n• Name: ${d.nome}\n• Type: ${d.tipo}\n` +
              `• Date (DD/MM): ${d.data}\n• People: ${d.pax}\n• Message: ${d.msg}`,
  news: em => `Hello! Please add me to the Cumbuca list: ${em}`,
  noNum: '[CONFIRM] No phone or WhatsApp number is readable for Cumbuca — the Instagram profile is behind a ' +
         'login wall and there is no website. This control stays disabled until the real number is confirmed.',
  hoursUnknown: 'Hours [CONFIRM]',
  open: c => `Open now · until ${c}`,
  shut: 'Closed now',
  kitchen: k => `Kitchen until ${k}`,
  needConsent: 'Please tick the consent box so we may reply to you.'
} : {
  generic: 'Olá! Vim pelo site e queria tirar uma dúvida sobre a Cumbuca.',
  item: n => `Olá! Queria saber sobre: ${n}.`,
  beans: n => `Olá! Queria reservar grãos: ${n}.`,
  order: 'Olá! Queria fazer um pedido.',
  event: d => `Olá! Queria falar sobre um evento na Cumbuca.\n• Nome: ${d.nome}\n• Tipo: ${d.tipo}\n` +
              `• Data (DD/MM): ${d.data}\n• Pessoas: ${d.pax}\n• Mensagem: ${d.msg}`,
  news: em => `Olá! Quero entrar na lista da Cumbuca: ${em}`,
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp da Cumbuca é legível — o perfil do Instagram está atrás de login ' +
         'e não existe site. Este controle fica desativado até o número real ser confirmado.',
  hoursUnknown: 'Horário [CONFIRM]',
  open: c => `Aberto agora · até ${c}`,
  shut: 'Fechado agora',
  kitchen: k => `Cozinha até ${k}`,
  needConsent: 'Marque a caixa de consentimento para podermos responder.'
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openWa = msg => {
    if (!WA_NUMBER) { alert(T.noNum); return false; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    return true;
  };
  document.querySelectorAll('[data-wa]').forEach(el => {
    const k = el.getAttribute('data-wa');
    el.addEventListener('click', ev => {
      ev.preventDefault();
      openWa(k === 'order' ? T.order
           : k && k.startsWith('beans:') ? T.beans(k.slice(6))
           : (k && k !== 'true') ? T.item(k) : T.generic);
    });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    if (EMAIL) { a.href = 'mailto:' + EMAIL; return; }
    a.href = '#'; a.setAttribute('data-unconfirmed', 'true'); a.title = T.noNum;
    a.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNum); });
  });

  /* ---------- ⭐ Live "are they open right now" ---------- */
  const hoursEl = document.getElementById('todayHours');
  const kitEl   = document.getElementById('kitchenLast');
  if (hoursEl) {
    const mins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
    if (!HOURS) {
      hoursEl.innerHTML = '<span class="dot"></span>' + T.hoursUnknown;
    } else {
      const now = new Date(), n = now.getHours() * 60 + now.getMinutes();
      const spans = HOURS[now.getDay()] || [];
      const live = spans.find(([a, b]) => n >= mins(a) && n < mins(b));
      hoursEl.innerHTML = live
        ? '<span class="dot dot--open"></span>' + T.open(live[1])
        : '<span class="dot dot--shut"></span>' + T.shut;
    }
  }
  if (kitEl) kitEl.textContent = KITCHEN ? T.kitchen(KITCHEN) : '';

  /* ---------- Header: SNAPS to solid, no fade ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 120);
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

  /* ---------- Menu category tabs with scroll-spy ---------- */
  const cats = document.querySelector('.cats');
  if (cats) {
    const btns = [...cats.querySelectorAll('button')];
    const secs = btns.map(b => document.getElementById(b.dataset.go)).filter(Boolean);
    btns.forEach(b => b.addEventListener('click', () => {
      const t = document.getElementById(b.dataset.go);
      if (!t) return;
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 130, behavior: reduce ? 'auto' : 'smooth' });
    }));
    const mark = id => btns.forEach(b => b.setAttribute('aria-current', String(b.dataset.go === id)));
    const spy = new IntersectionObserver(es => {
      const vis = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) mark(vis.target.id);
    }, { rootMargin:'-140px 0px -62% 0px', threshold:0 });
    secs.forEach(s => spy.observe(s));
    if (btns[0]) mark(btns[0].dataset.go);
  }

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 85}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Finds nothing on this build. There is no verified figure to count to —
     no years open, no number of origins, no cups served, no rating. The engine
     stays so the day a real figure arrives it works with no other change. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1200;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- Events enquiry + newsletter ---------- */
  const ef = document.getElementById('eventForm');
  if (ef) ef.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!ef.querySelector('#consentEv')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(ef), g = k => (f.get(k) || '—');
    openWa(T.event({ nome:g('nome'), tipo:g('tipo'), data:g('data'), pax:g('pax'), msg:g('msg') }));
  });
  const nf = document.getElementById('newsForm');
  if (nf) nf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!nf.querySelector('#consentNews')?.checked) { alert(T.needConsent); return; }
    openWa(T.news(new FormData(nf).get('email') || '—'));
  });

  /* ---------- LGPD — required for the newsletter and the events form ------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'cumbuca_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

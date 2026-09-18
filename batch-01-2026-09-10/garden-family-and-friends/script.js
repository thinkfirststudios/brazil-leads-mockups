/* ==========================================================================
   GARDEN FAMILY AND FRIENDS — script.js (shared by /, /en/ and /es/)

   ⚠ INSTAGRAM-ONLY LEAD, behind a login wall. There is no website to read, so
     every fact came from secondary sources. This file therefore contains:
       · no dish, no price, no wine, no cocktail
       · no court count, no hourly rate, no class time
       · no chef name in any composed message — Michael Williann and Ju Reis are
         SECONDARY-SOURCE names, and a chef credit is a professional reputation
       · no CNPJ, no AVCB, no capacity figure, no CREF number
       · no rating, no review count, no award, no "desde 20XX"

   ⭐ The day-arc selector is the structural answer to "what is this place":
     08h–23h is fifteen hours, and a venue open that long is four different
     places across one day.

   ⚠ The reservation block composes a WhatsApp message and NOTHING ELSE. This
     venue takes reservations on WhatsApp, so the handoff is honest: no
     confirmed booking is faked and no table is held.
   ========================================================================== */

const WA_NUMBER = null;   // [CONFIRM] — the first thing to obtain
const EMAIL     = null;   // [CONFIRM]

/* ⭐ [CONFIRM hours]. Reported as 08h–23h by a secondary source. The live
   open/closed status in the topbar reads from this and nothing else — set the
   real schedule and it starts telling the truth with no other change. */
const HOURS = null;       // e.g. { 0:[['08:00','23:00']], 1:[['08:00','23:00']], … }

const LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
const IS_EN = LANG.startsWith('en');
const IS_ES = LANG.startsWith('es');

const T = IS_EN ? {
  generic: 'Hi! I came from your website and I would like to ask about Garden.',
  resv: d => `Hi! I came from your website and I would like to book a table.\n` +
             `• Area: ${d.area}\n• Date: ${d.data}\n• Time: ${d.hora}\n• People: ${d.pax}\n• Name: ${d.nome}` +
             (d.obs && d.obs !== '—' ? `\n• Notes: ${d.obs}` : ''),
  court: 'Hi! I would like to book a beach tennis court. Which times are free, and what is the hourly rate?',
  event: 'Hi! I would like to ask about hiring the space for a private event.',
  noNum: '[CONFIRM] No phone or WhatsApp number was captured for Garden — the Instagram profile is behind a ' +
         'login wall and there is no website. This control stays disabled until the real number is confirmed.',
  needConsent: 'Please tick the consent box so we can reply to you.',
  preview: 'This is the message that will be sent:',
  openTo: c => `Open until ${c}`, shut: 'Closed now', unknown: 'Hours [CONFIRM]'
} : IS_ES ? {
  generic: '¡Hola! Vengo del sitio web y quisiera consultar sobre el Garden.',
  resv: d => `¡Hola! Vengo del sitio y quisiera reservar una mesa.\n` +
             `• Área: ${d.area}\n• Fecha: ${d.data}\n• Hora: ${d.hora}\n• Personas: ${d.pax}\n• Nombre: ${d.nome}` +
             (d.obs && d.obs !== '—' ? `\n• Observaciones: ${d.obs}` : ''),
  court: '¡Hola! Quisiera reservar una cancha de beach tennis. ¿Qué horarios hay y cuál es el valor por hora?',
  event: '¡Hola! Quisiera consultar sobre alquilar el espacio para un evento privado.',
  noNum: '[CONFIRM] No se obtuvo teléfono ni WhatsApp del Garden — el perfil de Instagram está detrás de un ' +
         'login y no existe sitio web. Este control queda desactivado hasta confirmar el número real.',
  needConsent: 'Marque la casilla de consentimiento para poder responderle.',
  preview: 'Este es el mensaje que se enviará:',
  openTo: c => `Abierto hasta las ${c}`, shut: 'Cerrado ahora', unknown: 'Horario [CONFIRM]'
} : {
  generic: 'Olá! Vim pelo site e gostaria de tirar uma dúvida sobre o Garden.',
  resv: d => `Olá! Vim pelo site e gostaria de reservar mesa.\n` +
             `• Área: ${d.area}\n• Data: ${d.data}\n• Horário: ${d.hora}\n• Pessoas: ${d.pax}\n• Nome: ${d.nome}` +
             (d.obs && d.obs !== '—' ? `\n• Observações: ${d.obs}` : ''),
  court: 'Olá! Gostaria de reservar uma quadra de beach tennis. Quais horários têm vaga e qual o valor da hora?',
  event: 'Olá! Gostaria de falar sobre locação do espaço para um evento.',
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp do Garden foi captado — o perfil do Instagram está atrás de ' +
         'login e não existe site. Este controle fica desativado até o número real ser confirmado.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  preview: 'Esta é a mensagem que será enviada:',
  openTo: c => `Aberto até ${c}`, shut: 'Fechado agora', unknown: 'Horário [CONFIRM]'
};

/* DD/MM on every tree. */
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
    const k = el.getAttribute('data-wa');
    el.addEventListener('click', ev => {
      ev.preventDefault();
      openWa(k === 'court' ? T.court : k === 'event' ? T.event : T.generic);
    });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    if (EMAIL) { a.href = 'mailto:' + EMAIL; return; }
    a.href = '#'; a.setAttribute('data-unconfirmed', 'true'); a.title = T.noNum;
    a.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNum); });
  });

  /* ---------- Live open/closed status ---------- */
  const st = document.querySelector('.status');
  if (st) {
    const label = st.querySelector('span:last-child');
    if (!HOURS) { st.classList.remove('open', 'shut'); if (label) label.textContent = T.unknown; }
    else {
      const mins = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
      const now = new Date(), n = now.getHours() * 60 + now.getMinutes();
      const live = (HOURS[now.getDay()] || []).find(([a, b]) => n >= mins(a) && n < mins(b));
      st.classList.toggle('open', !!live);
      st.classList.toggle('shut', !live);
      if (label) label.textContent = live ? T.openTo(live[1]) : T.shut;
    }
  }

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

  /* ---------- Hero parallax ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 900) * 0.14}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ THE DAY ARC — a real ARIA tablist, keyboard-operable, with
       the selected period announced. It answers "what is this place" in one
       gesture, which no About paragraph does. ---------- */
  const arc = document.querySelector('.arc__tabs');
  if (arc) {
    const tabs = [...arc.querySelectorAll('[role="tab"]')];
    const select = tab => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach(t => t.addEventListener('click', () => select(t)));
    arc.addEventListener('keydown', ev => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (ev.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (ev.key === 'ArrowLeft')  j = (i - 1 + tabs.length) % tabs.length;
      if (ev.key === 'Home') j = 0;
      if (ev.key === 'End')  j = tabs.length - 1;
      if (j === null) return;
      ev.preventDefault(); tabs[j].focus(); select(tabs[j]);
    });
    /* open on the period that matches the visitor's own clock — a small thing
       that makes the device feel like it is about this venue, right now */
    const h = new Date().getHours();
    const idx = h < 12 ? 0 : h < 17 ? 1 : h < 20 ? 2 : 3;
    select(tabs[Math.min(idx, tabs.length - 1)]);
  }

  /* ---------- ⭐ Reservation — composes, never confirms ---------- */
  const rf = document.getElementById('resvForm');
  if (rf) {
    const prev = rf.querySelector('.msg');
    const collect = () => {
      const f = new FormData(rf), g = k => (f.get(k) || '—').toString().trim() || '—';
      return { area:g('area'), data:ddmm(f.get('data')), hora:g('hora'), pax:g('pax'),
               nome:g('nome'), obs:g('obs') };
    };
    const render = () => { if (prev) prev.textContent = T.preview + '\n\n' + T.resv(collect()); };
    rf.addEventListener('input', render);
    rf.addEventListener('change', render);
    render();
    rf.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!rf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
      openWa(T.resv(collect()));
    });
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
     ⚠ Nothing to count. No covers served, no years open, no rating, no court
     count, no capacity — and the capacity figure in particular must come from
     the AVCB certificate rather than from anybody's estimate. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1300;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- LGPD.
     The reservation flow collects a name, a phone number, a date and a party
     size. Nothing is stored by this site — the form composes a WhatsApp
     message — but the policy must still name the purpose, the retention period
     and every processor, including WhatsApp Business and any booking tool
     added later. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'garden_lgpd_v1';
    const applyConsent = p => {
      if (!p) return;
      if (p.analytics) { /* analytics injected ONLY inside this branch */ }
      if (p.marketing) { /* marketing tags injected ONLY inside this branch */ }
    };
    const saved = localStorage.getItem(KEY);
    if (!saved) setTimeout(() => ck.classList.add('on'), 950); else applyConsent(JSON.parse(saved));
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 88, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

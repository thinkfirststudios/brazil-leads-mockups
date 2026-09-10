/* ==========================================================================
   CAMPECHE PARK — script.js (shared by /, /en/ and /es/)

   ⭐ The programação calendar is the reason this site would exist: it is the
   one asset none of the neighbouring venues has, and the reason to come back
   weekly. It treats a skate session, an organic market, an exhibition opening
   and a live set as the same class of object.

   ⚠ EVERY ENTRY SHIPS AS [CONFIRM]. The structure ships; invented events do
   not. EVENTS below is empty on purpose. The two RECURRING entries carry only
   what a secondary source stated (feira orgânica, Mondays and Fridays) and are
   themselves marked [CONFIRM — secondary source].
   ========================================================================== */

/* ⚠ [CONFIRM WhatsApp] — NOTHING was captured for this lead. No phone, no
   email, no address. Intentionally non-dialable until confirmed. */
const WA_NUMBER = null;                       // [CONFIRM]

const LANG = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();

/* Opening hours per secondary source — Mon–Sat 08h–00h, Sun 10h–18h.
   [CONFIRM — secondary source. The Sunday early close is counter-intuitive
   enough to be worth confirming twice.] day: 0 = Sunday … 6 = Saturday */
const HOURS = {
  0: [10, 18],
  1: [8, 24], 2: [8, 24], 3: [8, 24], 4: [8, 24], 5: [8, 24], 6: [8, 24]
};

/* --------------------------------------------------------------------------
   ⬇⬇ REAL PROGRAMMING GOES HERE ⬇⬇
   { day:'YYYY-MM-DD', time:'20h00', kind:'esporte'|'arte'|'gastronomia'|'feira',
     title:'…', where:'…', price:'R$ 00,00' | 'Entrada franca' }
   Anything not listed renders as an explicit [CONFIRM] placeholder row, never
   as an invented event.
-------------------------------------------------------------------------- */
const EVENTS = [];              // [CONFIRM — programação a confirmar]

/* Standing weekly entries so the calendar is never empty.
   dow: 0 = Sunday … 6 = Saturday */
const RECURRING = [
  { dow:1, time:null, kind:'feira', key:'feira' },   // segunda — [CONFIRM secondary source]
  { dow:5, time:null, kind:'feira', key:'feira' }    // sexta  — [CONFIRM secondary source]
];

const T = {
  pt: {
    days:['domingo','segunda','terça','quarta','quinta','sexta','sábado'],
    open:'Aberto agora', shut:'Fechado', until:'até', opensAt:'abre',
    tomorrow:'amanhã às', today:'Hoje',
    kinds:{ esporte:'Esporte', arte:'Arte', gastronomia:'Gastronomia', feira:'Feira' },
    feira:'Feira orgânica', feiraWhere:'no parque',
    cfmEvent:'[CONFIRM — programação a confirmar]',
    cfmTime:'[CONFIRM horário]', cfmPrice:'[CONFIRM preço ou entrada franca]',
    cfmWhere:'[CONFIRM local no parque]',
    nothing:'Nenhuma programação confirmada para este dia.',
    wa:'Olá, Campeche Park! Vim pelo site e queria saber sobre ',
    waGeneric:'Olá, Campeche Park! Vim pelo site.',
    noNumber:'[CONFIRM] O WhatsApp do Campeche Park ainda não foi obtido — nenhum número foi capturado para este ' +
             'lead. Este botão fica inativo de propósito até o número real ser confirmado.',
    newsOk:'[CONFIRM ferramenta de newsletter e fluxo de double opt-in antes do lançamento.]'
  },
  en: {
    days:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    open:'Open now', shut:'Closed', until:'until', opensAt:'opens',
    tomorrow:'tomorrow at', today:'Today',
    kinds:{ esporte:'Sport', arte:'Art', gastronomia:'Food', feira:'Market' },
    feira:'Organic market', feiraWhere:'in the park',
    cfmEvent:'[CONFIRM — programme to be confirmed]',
    cfmTime:'[CONFIRM time]', cfmPrice:'[CONFIRM price or free entry]',
    cfmWhere:'[CONFIRM location in the park]',
    nothing:'No confirmed programme for this day.',
    wa:"Hello Campeche Park! I came from the website and I'd like to ask about ",
    waGeneric:'Hello Campeche Park! I came from the website.',
    noNumber:'[CONFIRM] Campeche Park’s WhatsApp number has not been obtained — nothing was captured for this ' +
             'lead. This button is intentionally inert until the real number is confirmed.',
    newsOk:'[CONFIRM newsletter provider and double opt-in flow before launch.]'
  },
  es: {
    days:['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
    open:'Abierto ahora', shut:'Cerrado', until:'hasta', opensAt:'abre',
    tomorrow:'mañana a las', today:'Hoy',
    kinds:{ esporte:'Deporte', arte:'Arte', gastronomia:'Gastronomía', feira:'Feria' },
    feira:'Feria orgánica', feiraWhere:'en el parque',
    cfmEvent:'[CONFIRM — programación por confirmar]',
    cfmTime:'[CONFIRM horario]', cfmPrice:'[CONFIRM precio o entrada libre]',
    cfmWhere:'[CONFIRM lugar en el parque]',
    nothing:'Sin programación confirmada para este día.',
    wa:'¡Hola, Campeche Park! Vengo desde la web y quería saber sobre ',
    waGeneric:'¡Hola, Campeche Park! Vengo desde la web.',
    noNumber:'[CONFIRM] Aún no se obtuvo el WhatsApp de Campeche Park — no se capturó ningún número para este ' +
             'lead. Este botón queda inactivo a propósito hasta confirmar el número real.',
    newsOk:'[CONFIRM herramienta de newsletter y doble opt-in antes del lanzamiento.]'
  }
}[LANG] || null;

const L = T || {
  days:['domingo','segunda','terça','quarta','quinta','sexta','sábado'],
  open:'Aberto agora', shut:'Fechado', until:'até', opensAt:'abre', tomorrow:'amanhã às', today:'Hoje',
  kinds:{ esporte:'Esporte', arte:'Arte', gastronomia:'Gastronomia', feira:'Feira' },
  feira:'Feira orgânica', feiraWhere:'no parque', cfmEvent:'[CONFIRM]', cfmTime:'[CONFIRM]',
  cfmPrice:'[CONFIRM]', cfmWhere:'[CONFIRM]', nothing:'[CONFIRM]',
  wa:'', waGeneric:'', noNumber:'[CONFIRM]', newsOk:'[CONFIRM]'
};

const dd = d => String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0');

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openWa = msg => {
    if (!WA_NUMBER) { alert(L.noNumber); return; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };
  document.querySelectorAll('[data-wa]').forEach(a => {
    const topic = a.getAttribute('data-wa');
    a.addEventListener('click', ev => {
      ev.preventDefault();
      openWa(topic && topic !== 'true' ? L.wa + topic + '.' : L.waGeneric);
    });
    if (!WA_NUMBER) { a.setAttribute('data-unconfirmed', 'true'); a.title = L.noNumber; }
  });

  /* ---------- Live status — the most useful eight pixels on the site ---------- */
  const flag = document.querySelector('.live');
  if (flag) {
    const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes()/60;
    const [o, c] = HOURS[d];
    const isOpen = h >= o && h < c;
    flag.classList.toggle('is-open', isOpen);
    flag.classList.toggle('is-shut', !isOpen);
    const lbl = flag.querySelector('span');
    if (lbl) {
      const hh = n => String(Math.floor(n) % 24).padStart(2,'0') + 'h';
      lbl.textContent = isOpen
        ? `${L.open} · ${L.until} ${hh(c)}`
        : (h < o ? `${L.shut} · ${L.opensAt} ${hh(o)}`
                 : `${L.shut} · ${L.opensAt} ${L.tomorrow} ${hh(HOURS[(d+1)%7][0])}`);
    }
    const dEl = document.querySelector('[data-today]');
    if (dEl) dEl.textContent = dd(now);
  }

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

  /* ---------- Marquee: duplicate the track so the loop is seamless ---------- */
  const mt = document.querySelector('.marquee__t');
  if (mt) mt.innerHTML = mt.innerHTML + mt.innerHTML;

  /* ================= ⭐ PROGRAMAÇÃO ================= */
  const host = document.getElementById('agenda');
  if (host) {
    let filter = 'tudo';

    const evtCard = (kind, time, title, where, price) =>
      `<article class="evt" data-k="${kind}">
        <div class="evt__top">
          <span class="evt__time">${time}</span>
          <span class="evt__k">${L.kinds[kind] || kind}</span>
        </div>
        <h4>${title}</h4>
        <div class="evt__meta"><span>${where}</span><span class="evt__price">${price}</span></div>
      </article>`;

    const render = () => {
      const today = new Date(); today.setHours(0,0,0,0);
      let html = '';
      for (let i = 0; i < 7; i++) {
        const day = new Date(today); day.setDate(today.getDate() + i);
        const dow = day.getDay();
        const iso = day.toISOString().slice(0,10);

        let cards = EVENTS
          .filter(e => e.day === iso && (filter === 'tudo' || e.kind === filter))
          .map(e => evtCard(e.kind, e.time, e.title, e.where, e.price));

        /* standing weekly entries — the feira keeps the calendar populated */
        RECURRING.filter(r => r.dow === dow && (filter === 'tudo' || r.kind === filter))
          .forEach(() => cards.push(evtCard(
            'feira',
            `<span class="cfm">${L.cfmTime}</span>`,
            L.feira,
            `${L.feiraWhere} <span class="cfm">[CONFIRM — fonte secundária]</span>`,
            `<span class="cfm">${L.cfmPrice}</span>`)));

        /* nothing invented: an empty day says so, and says why */
        if (!cards.length) cards = [
          `<article class="evt" data-k="">
            <div class="evt__top"><span class="evt__time">—</span>
              <span class="evt__k">[CONFIRM]</span></div>
            <h4 style="font-size:1.05rem"><span class="cfm">${L.cfmEvent}</span></h4>
            <div class="evt__meta"><span>${L.nothing}</span></div>
          </article>`];

        html += `<div class="day" data-rv>
            <div class="day__h">${L.days[dow]}<b>${dd(day)}</b>
              ${i === 0 ? `<span style="color:var(--magenta)">${L.today}</span>` : ''}</div>
            <div class="evts">${cards.join('')}</div>
          </div>`;
      }
      host.innerHTML = html;
      host.querySelectorAll('[data-rv]').forEach(el => el.classList.add('in'));
    };

    document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
      filter = b.dataset.f;
      document.querySelectorAll('.filters button').forEach(x =>
        x.setAttribute('aria-pressed', String(x === b)));
      render();
    }));
    render();
  }

  /* ---------- Park map: tapping a label jumps to that section ---------- */
  document.querySelectorAll('.pin[data-jump]').forEach(p => {
    p.style.cursor = 'pointer';
    p.addEventListener('click', () => {
      const t = document.querySelector(p.getAttribute('data-jump'));
      if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80,
                        behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 80}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Newsletter — its own SEPARATE consent, never bundled ---------- */
  const nf = document.getElementById('newsForm');
  if (nf) nf.addEventListener('submit', ev => { ev.preventDefault(); alert(L.newsOk); });

  /* ---------- Event-hire enquiry ---------- */
  const ef = document.getElementById('eventForm');
  if (ef) ef.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(ef), g = k => (f.get(k) || '—');
    openWa(`${L.waGeneric}\n• ${g('nome')}\n• ${g('data')}\n• ${g('pessoas')}\n• ${g('tipo')}\n\n${g('msg')}`);
  });

  /* ---------- LGPD sheet — nothing pre-ticked ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'campechepark_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

/* ==========================================================================
   anómada — script.js (shared by / and /en/)
   ========================================================================== */

/* ⚠⚠ WHATSAPP NUMBER — DO NOT GUESS ⚠⚠
   Their site publishes: +55 48 8843-8819 "(apenas mensagens de whatsapp)".
   As published that is an EIGHT-digit local number. Brazilian mobiles carry
   NINE digits after the DDD. A wa.me deep link cannot be built reliably until
   the full number is confirmed, and we must not invent a ninth digit.

   Until then WA_NUMBER stays null: every WhatsApp control still renders and is
   still clickable, but it opens a visible [CONFIRM] state instead of dialling
   a stranger. This is deliberate — it is also one of the strongest points in
   the pitch, because the single contact route on their live site may not work. */
const WA_NUMBER = null;                       // [CONFIRM full 9-digit mobile]
const WA_PUBLISHED = '+55 48 8843-8819';      // as published by them — 8 digits

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  order:  n => `Hello anómada! I'd like to order: ${n}.`,
  book:   (d,h,p,s) => `Hello anómada! I'd like to book a table.\n• Date (DD/MM): ${d}\n• Time: ${h}\n• People: ${p}\n• Service: ${s}`,
  generic:"Hello anómada! I'd like to place an order.",
  noNumber:"The WhatsApp number published on their site has 8 digits — one short of a Brazilian mobile. [CONFIRM the full number before this link goes live.]",
  open:'Open now', shut:'Closed now'
} : {
  order:  n => `Olá anómada! Gostaria de pedir: ${n}.`,
  book:   (d,h,p,s) => `Olá anómada! Gostaria de reservar uma mesa.\n• Data (DD/MM): ${d}\n• Hora: ${h}\n• Pessoas: ${p}\n• Serviço: ${s}`,
  generic:'Olá anómada! Gostaria de fazer um pedido.',
  noNumber:'O número de WhatsApp publicado no site tem 8 dígitos — falta um para um celular brasileiro. [CONFIRM o número completo antes de este link entrar no ar.]',
  open:'Aberto agora', shut:'Fechado agora'
};

const waHref = msg => WA_NUMBER
  ? 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg)
  : null;

/* Their three schedules, verbatim from their own site.
   Days: 0 = Sunday … 6 = Saturday. "terça a dom" = Tue–Sun; Monday closed is
   IMPLIED, not stated — flagged [CONFIRM] in the markup rather than asserted. */
const SCHEDULES = [
  { key:'padaria', days:[2,3,4,5,6,0], from:9,  to:23 },   // ter–dom 9h–23h
  { key:'pizza',   days:[2,3,4,5,6,0], from:18, to:23 },   // ter–dom 18h–23h
  { key:'brunch',  days:[6,0],         from:8,  to:18 }    // sáb, dom e feriados 8h–18h
];

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp controls ---------- */
  const wire = (el, msg) => {
    const href = waHref(msg);
    if (href) { el.href = href; el.target = '_blank'; el.rel = 'noopener'; }
    else {
      el.href = '#';
      el.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNumber); });
      el.setAttribute('data-wa-unconfirmed', 'true');
      el.title = T.noNumber;
    }
  };
  document.querySelectorAll('[data-wa]').forEach(el => {
    const item = el.getAttribute('data-wa');
    wire(el, item && item !== 'true' ? T.order(item) : T.generic);
  });

  /* ---------- Live "open now" flag, computed against all three schedules ---------- */
  const flag = document.querySelector('.openflag');
  if (flag) {
    const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    const live = SCHEDULES.filter(s => s.days.includes(d) && h >= s.from && h < s.to);
    const open = live.length > 0;
    flag.classList.toggle('is-open', open);
    flag.classList.toggle('is-shut', !open);
    const label = flag.querySelector('span');
    if (label) label.textContent = open ? T.open : T.shut;
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
      [...mnav.querySelectorAll('a')].forEach((a,i) =>
        a.style.transitionDelay = open ? `${80 + i*54}ms` : '0ms');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Menu category tabs ---------- */
  const tabs = document.querySelectorAll('.tabs button');
  if (tabs.length) {
    tabs.forEach(t => t.addEventListener('click', () => {
      const target = t.dataset.tab;
      tabs.forEach(x => x.setAttribute('aria-selected', String(x === t)));
      document.querySelectorAll('[data-panel]').forEach(p => {
        p.hidden = p.dataset.panel !== target;
      });
      document.querySelectorAll(`[data-panel="${target}"] [data-rv]`).forEach(el => el.classList.add('in'));
    }));
  }

  /* ---------- Scroll reveal + stagger ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 95}ms`;
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
        hb.style.transform = `translate3d(0,${Math.min(scrollY, innerHeight) * 0.2}px,0)`;
        t = false;
      });
    }, { passive:true });
  }

  /* ---------- Reservation form → composes a WhatsApp message (sends nothing itself) ---------- */
  const rf = document.getElementById('resvForm');
  if (rf) rf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(rf);
    const raw = (f.get('data') || '').toString();
    const br = raw ? raw.split('-').reverse().slice(0,2).join('/') : '—';   // DD/MM
    const msg = T.book(br, f.get('hora') || '—', f.get('pessoas') || '—', f.get('servico') || '—');
    const href = waHref(msg);
    if (href) open(href, '_blank', 'noopener'); else alert(T.noNumber);
  });

  /* ---------- Newsletter (LGPD: consent required, nothing is sent from the mockup) ---------- */
  const nf = document.getElementById('newsForm');
  if (nf) nf.addEventListener('submit', ev => {
    ev.preventDefault();
    alert(IS_EN
      ? '[CONFIRM newsletter provider and double opt-in flow before launch.]'
      : '[CONFIRM ferramenta de newsletter e fluxo de double opt-in antes do lançamento.]');
  });

  /* ---------- LGPD cookie consent ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'anomada_lgpd_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 1000);
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 74,
                 behavior: reduce ? 'auto' : 'smooth' });
    }));
});

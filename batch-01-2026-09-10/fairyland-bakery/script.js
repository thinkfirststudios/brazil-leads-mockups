/* ==========================================================================
   FAIRYLAND BAKERY (& MAY?) — script.js (shared by / and /en/)

   ⚠ INSTAGRAM-ONLY LEAD, login-walled. Nothing is verified, so this file names
     NO bread, pastry, cake, dish, coffee or price. A boutique bakery-bistro
     menu is exactly the kind of thing that is easy to fabricate plausibly,
     which is why none of it is fabricated at all.

   ⚠ THE BIGGEST UNKNOWN IS THE NAME. The lead sheet says "FairyLand Bakery &
     May"; the Instagram handle is simply `fairylandbakery`. "& May" is
     unexplained — a second brand, a co-founder, a partner business sharing the
     premises, a sister café, or a transcription artefact. So: no person called
     May is invented, no founder story is written around the name, and "& May"
     is not silently dropped either. The logotype reads FairyLand Bakery with a
     visible [CONFIRM: "& May"?] chip beside it, so the question gets asked.

   ⭐ THE HINGE of this build is the persistent Padaria | Bistrô switch. It
     re-scopes the menu sections, swaps the sticky CTA label between "Pedir" and
     "Reservar", and remembers the visitor's choice for the session — because a
     customer who came for the evening service should not have to find it twice.
   ========================================================================== */

const WA_NUMBER = null;   // [CONFIRM]
const EMAIL     = null;   // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');
const HKEY = 'fairyland_half_v1';

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to ask about FairyLand.',
  item: n => `Hello! I would like to order: ${n}.`,
  book: d => `Hello! I would like to book a table at the bistro.\n• Date: ${d.data}\n• Time: ${d.hora}\n` +
             `• People: ${d.pax}\n• Occasion: ${d.ocasiao}\n• Notes: ${d.obs}`,
  order: d => `Hello! I would like to place an order.\n• Item: ${d.item}\n• Size / servings: ${d.tam}\n` +
              `• Needed on: ${d.data}\n• Notes: ${d.obs}`,
  news: em => `Hello! Please add me to the FairyLand list: ${em}`,
  noNum: '[CONFIRM] No phone or WhatsApp number is readable for FairyLand — the Instagram profile sits behind ' +
         'a login wall and there is no website. This control stays disabled until the real number is confirmed.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  needFields: 'Please give at least a date and a party size.',
  ctaDay: 'Order on WhatsApp', ctaNight: 'Book a table'
} : {
  generic: 'Olá! Vim pelo site e gostaria de tirar uma dúvida sobre a FairyLand.',
  item: n => `Olá! Gostaria de pedir: ${n}.`,
  book: d => `Olá! Gostaria de reservar uma mesa no bistrô.\n• Data: ${d.data}\n• Horário: ${d.hora}\n` +
             `• Pessoas: ${d.pax}\n• Ocasião: ${d.ocasiao}\n• Observações: ${d.obs}`,
  order: d => `Olá! Gostaria de fazer uma encomenda.\n• Item: ${d.item}\n• Tamanho / porções: ${d.tam}\n` +
              `• Para o dia: ${d.data}\n• Observações: ${d.obs}`,
  news: em => `Olá! Quero entrar na lista da FairyLand: ${em}`,
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp da FairyLand é legível — o perfil do Instagram está atrás de ' +
         'login e não existe site. Este controle fica desativado até o número real ser confirmado.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  needFields: 'Informe pelo menos a data e o número de pessoas.',
  ctaDay: 'Pedir no WhatsApp', ctaNight: 'Reservar mesa'
};

/* DD/MM on both trees. */
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
      openWa(k && k !== 'true' ? T.item(k) : T.generic);
    });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    if (EMAIL) { a.href = 'mailto:' + EMAIL; return; }
    a.href = '#'; a.setAttribute('data-unconfirmed', 'true'); a.title = T.noNum;
    a.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNum); });
  });

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

  /* ---------- ⭐ THE PADARIA | BISTRÔ SWITCH ----------
     Most bakery-bistros publish one half and hide the other, and customers end
     up not knowing the evening service exists. Here one switch re-scopes the
     page, and the choice persists for the session. */
  const switches = [...document.querySelectorAll('.switch')];
  const halves = [...document.querySelectorAll('[data-half-section]')];
  const mbarCta = document.querySelector('[data-half-cta]');
  const setHalf = half => {
    halves.forEach(s => s.hidden = s.dataset.halfSection !== half && s.dataset.halfSection !== 'both');
    switches.forEach(sw => sw.querySelectorAll('button').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.half === half))));
    if (mbarCta) {
      mbarCta.textContent = half === 'bistro' ? T.ctaNight : T.ctaDay;
      mbarCta.setAttribute('href', half === 'bistro' ? '#reservas' : '#vitrine');
    }
    try { sessionStorage.setItem(HKEY, half); } catch (_) {}
  };
  switches.forEach(sw => sw.querySelectorAll('button').forEach(b =>
    b.addEventListener('click', () => setHalf(b.dataset.half))));
  let start = 'padaria';
  try { start = sessionStorage.getItem(HKEY) || 'padaria'; } catch (_) {}
  if (location.hash === '#bistro' || location.hash === '#reservas') start = 'bistro';
  setHalf(start);
  /* deep links into the night half flip the switch rather than landing on a
     hidden section */
  document.querySelectorAll('a[href="#bistro"],a[href="#reservas"]').forEach(a =>
    a.addEventListener('click', () => setHalf('bistro')));
  document.querySelectorAll('a[href="#vitrine"],a[href="#padaria"]').forEach(a =>
    a.addEventListener('click', () => setHalf('padaria')));

  /* ---------- Menu category filters (one bar per half) ---------- */
  document.querySelectorAll('.cats').forEach(bar => {
    const grid = document.getElementById(bar.dataset.for);
    if (!grid) return;
    const items = [...grid.querySelectorAll('.item')];
    const apply = k => items.forEach(it => { it.hidden = !(k === 'all' || it.dataset.k === k); });
    bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      apply(b.dataset.k);
    }));
    apply('all');
  });

  /* ---------- Signature carousel ---------- */
  document.querySelectorAll('.carou').forEach(c => {
    const track = c.querySelector('.track');
    if (!track) return;
    const step = () => (track.firstElementChild?.offsetWidth || 370) + 26;
    c.querySelector('[data-carou="prev"]')?.addEventListener('click',
      () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    c.querySelector('[data-carou="next"]')?.addEventListener('click',
      () => track.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  /* ---------- Bistro reservation — composes, never submits ---------- */
  const bf = document.getElementById('bookForm');
  if (bf) bf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(bf), g = k => (f.get(k) || '—');
    if (!f.get('data') || !f.get('pax')) { alert(T.needFields); return; }
    if (!bf.querySelector('#consentBook')?.checked) { alert(T.needConsent); return; }
    openWa(T.book({ data:ddmm(f.get('data')), hora:g('hora'), pax:g('pax'),
                    ocasiao:g('ocasiao'), obs:g('obs') }));
  });

  /* ---------- Encomendas — deliberately simpler: for FairyLand this is a
       supporting line, not the main event. ---------- */
  const of_ = document.getElementById('orderForm');
  if (of_) of_.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!of_.querySelector('#consentOrd')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(of_), g = k => (f.get(k) || '—');
    openWa(T.order({ item:g('item'), tam:g('tam'), data:ddmm(f.get('data')), obs:g('obs') }));
  });

  /* ---------- Newsletter ---------- */
  const nf = document.getElementById('newsForm');
  if (nf) nf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!nf.querySelector('#consentNews')?.checked) { alert(T.needConsent); return; }
    openWa(T.news(new FormData(nf).get('email') || '—'));
  });

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Nothing to count. No founding year, no covers, no rating, no review
     count — none of it is verified. ref-01's confident numbers are render
     artefacts, not facts about this business. */
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

  /* ---------- LGPD — required for the newsletter, the reservation form and
       the encomenda form. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'fairyland_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

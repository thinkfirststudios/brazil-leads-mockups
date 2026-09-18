/* ==========================================================================
   CRIS HOTEL — script.js (shared by / and /en/)

   ⚠ THE WHATSAPP NUMBER IS CONTRADICTED BY THEIR OWN SITE.
     Their markup deep-links wa.me/554832325104 → (48) 3232-5104, which is
     NEITHER of the two numbers their page displays: (48) 3748-0630 and
     (48) 9 9181-5380. That contradiction is real and it is left surfaced,
     not quietly resolved. Until they confirm which line is live, the WhatsApp
     controls render visibly unconfirmed — a wrong guess would send guests to
     a number that may not be theirs.

   The two DISPLAYED phone numbers and the e-mail ARE published by them and are
   wired for real.

   ⚠ The availability widget composes a WhatsApp message and performs no lookup.
     No rate is published anywhere on their site, so no rate appears here.
   ========================================================================== */

const TEL_FIXO  = '4837480630';        // (48) 3748-0630 — displayed on their site
const TEL_CEL   = '48991815380';       // (48) 9 9181-5380 — displayed on their site
const EMAIL     = 'contato@crishotel.com.br';
/* [CONFIRM] wa.me/554832325104 appears in their markup but matches neither
   displayed number. Not wired until confirmed. */
const WA_NUMBER = null;
const WA_IN_MARKUP = '554832325104';

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like information about a stay at Cris Hotel.',
  stay: q => `Hello! I would like to check availability at Cris Hotel.\n• Check-in: ${q.i}\n• Check-out: ${q.o}\n` +
             `• Adults: ${q.a}\n• Children: ${q.c}` + (q.code ? `\n• Promo code: ${q.code}` : ''),
  room: r => `Hello! I would like information and rates for the ${r} room.`,
  romantic: 'Hello! I would like to know the price and lead time for the romantic decoration package.',
  event: d => `Hello! I would like a quote for the events room.\n• Name: ${d.nome}\n• Type of event: ${d.tipo}\n` +
              `• Date (DD/MM): ${d.data}\n• Attendees: ${d.pax}\n• WhatsApp: ${d.wpp}`,
  contact: d => `Hello!\n• Name: ${d.nome}\n• Email: ${d.email}\n• Dates: ${d.datas}\n• Message: ${d.msg}`,
  access: 'Hello! I need step-free access. Is there a ground-floor room available?',
  noNum: '[CONFIRM] Cris Hotel’s live WhatsApp number is not settled: their markup deep-links (48) 3232-5104, ' +
         'while the page displays (48) 3748-0630 and (48) 9 9181-5380. Until they confirm which line is live, this ' +
         'control stays disabled rather than messaging a number that may not be theirs. The two displayed phone ' +
         'numbers on this page do dial.',
  needDates: 'Please choose a check-in and a check-out date.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  nights: n => n === 1 ? '1 night' : n + ' nights'
} : {
  generic: 'Olá! Vim pelo site e gostaria de informações sobre uma hospedagem no Cris Hotel.',
  stay: q => `Olá! Gostaria de verificar disponibilidade no Cris Hotel.\n• Chegada: ${q.i}\n• Saída: ${q.o}\n` +
             `• Adultos: ${q.a}\n• Crianças: ${q.c}` + (q.code ? `\n• Cód. promocional: ${q.code}` : ''),
  room: r => `Olá! Gostaria de informações e valores da acomodação ${r}.`,
  romantic: 'Olá! Gostaria de saber o valor e a antecedência da decoração romântica.',
  event: d => `Olá! Gostaria de um orçamento para o salão de eventos.\n• Nome: ${d.nome}\n• Tipo de evento: ${d.tipo}\n` +
              `• Data (DD/MM): ${d.data}\n• Nº de participantes: ${d.pax}\n• WhatsApp: ${d.wpp}`,
  contact: d => `Olá!\n• Nome: ${d.nome}\n• E-mail: ${d.email}\n• Datas: ${d.datas}\n• Mensagem: ${d.msg}`,
  access: 'Olá! Preciso de acesso sem escadas. Existe algum quarto no térreo disponível?',
  noNum: '[CONFIRM] O WhatsApp do Cris Hotel não está resolvido: o código do site deep-linka (48) 3232-5104, ' +
         'enquanto a página exibe (48) 3748-0630 e (48) 9 9181-5380. Até vocês confirmarem qual linha está ativa, ' +
         'este controle fica desativado em vez de mandar mensagem para um número que pode não ser de vocês. ' +
         'Os dois telefones exibidos nesta página discam normalmente.',
  needDates: 'Escolha a data de chegada e a de saída.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  nights: n => n === 1 ? '1 diária' : n + ' diárias'
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
      openWa(k === 'romantic' ? T.romantic : k === 'access' ? T.access
           : (k && k !== 'true') ? T.room(k) : T.generic);
    });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  /* these two ARE published by them and dial for real */
  document.querySelectorAll('[data-tel="fixo"]').forEach(a => a.href = 'tel:+55' + TEL_FIXO);
  document.querySelectorAll('[data-tel="cel"]').forEach(a => a.href = 'tel:+55' + TEL_CEL);
  document.querySelectorAll('[data-email]').forEach(a => a.href = 'mailto:' + EMAIL);

  /* ---------- Sticky nav ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 50);
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

  /* ---------- Hero parallax (the poster/video sits behind) ---------- */
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

  /* ---------- Availability widget — their real field set, promo code kept ---- */
  const av = document.getElementById('availForm');
  if (av) av.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(av);
    const i = f.get('chegada'), o = f.get('saida');
    if (!i || !o) { alert(T.needDates); return; }
    openWa(T.stay({ i: ddmm(i), o: ddmm(o), a: f.get('adultos') || '—',
                    c: f.get('criancas') || '0', code: (f.get('promo') || '').trim() }));
  });

  /* ---------- ⭐ THE TIER LADDER ----------
     Sem vista → Parcial Mar → Frente Mar. The sea-foam wave line fills as the
     guest advances, which is the upsell mechanic their site currently wastes. */
  const lad = document.querySelector('.ladder');
  if (lad) {
    const steps = [...lad.querySelectorAll('.step')];
    const fill  = lad.querySelector('.ladder__fill');
    const select = i => {
      steps.forEach((s, j) => {
        const on = j === i;
        s.setAttribute('aria-selected', String(on));
        s.tabIndex = on ? 0 : -1;
        const p = document.getElementById(s.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (fill) fill.style.width = (steps.length > 1 ? (i / (steps.length - 1)) * 100 : 0) + '%';
    };
    steps.forEach((s, i) => s.addEventListener('click', () => select(i)));
    lad.addEventListener('keydown', ev => {
      const i = steps.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (ev.key === 'ArrowRight') j = Math.min(i + 1, steps.length - 1);
      if (ev.key === 'ArrowLeft')  j = Math.max(i - 1, 0);
      if (ev.key === 'Home') j = 0;
      if (ev.key === 'End')  j = steps.length - 1;
      if (j === null) return;
      ev.preventDefault(); steps[j].focus(); select(j);
    });
    select(0);
  }

  /* ---------- Carousels (rooms, reviews) ---------- */
  document.querySelectorAll('.carou').forEach(c => {
    const track = c.querySelector('.track');
    if (!track) return;
    const step = () => (track.firstElementChild?.offsetWidth || 340) + 22;
    c.querySelector('[data-carou="prev"]')?.addEventListener('click',
      () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    c.querySelector('[data-carou="next"]')?.addEventListener('click',
      () => track.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Only counts figures THEY publish: reception hours (24) and the number of
     room categories on their own Acomodações page. No review score, no star
     rating, no award — their site publishes none, so neither does this. */
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

  /* ---------- Events + contact forms ---------- */
  const ef = document.getElementById('eventForm');
  if (ef) ef.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!ef.querySelector('#consentEv')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(ef), g = k => (f.get(k) || '—');
    openWa(T.event({ nome:g('nome'), tipo:g('tipo'), data:g('data'), pax:g('pax'), wpp:g('wpp') }));
  });
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!cf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    openWa(T.contact({ nome:g('nome'), email:g('email'), datas:g('datas'), msg:g('msg') }));
  });

  /* ---------- LGPD — covers FORM SUBMISSIONS, not only cookies ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'crishotel_lgpd_v1';
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

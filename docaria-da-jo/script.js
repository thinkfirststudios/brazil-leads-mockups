/* ==========================================================================
   DOCARIA DA JÔ — script.js (shared by / and /en/)

   ⚠ INSTAGRAM-ONLY LEAD. instagram.com/docariadajo/ returns 200 and serves a
     login wall with no readable metadata. So this file names NO flavour, NO
     filling, NO cake, NO doce, NO size, NO serving count and NO price. Custom
     cake pricing especially varies by size, tier count, finish and lead time —
     a fabricated number would be both wrong and embarrassing in the pitch.

   ⭐ THE POINT OF THIS FILE is the multi-step commission flow. Every cake sale
     starts with the same eight questions; the website asks them, and Jô
     receives a fully-briefed enquiry instead of "oi, faz bolo?".

     Built to the brief exactly: plain JS, no framework, state in
     sessionStorage, validated per step, keyboard-accessible, ending in a wa.me
     deep link with a URL-encoded, line-broken summary — and it DEGRADES TO A
     SINGLE LONG FORM if JS fails, because the markup ships with every step
     visible and this script is what collapses it into steps.

   ⛔ No children's-party occasion exists in the option list, by instruction.
   ========================================================================== */

const WA_NUMBER = null;    // [CONFIRM]
const EMAIL     = null;    // [CONFIRM]
/* ⭐ [CONFIRM lead time, in days]. The date step warns live when the chosen
   delivery date falls inside it. Set the real number and the warning starts
   working with no other change. */
const LEAD_DAYS = null;    // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');
const KEY = 'docaria_encomenda_v1';

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to ask about a commission.',
  item: n => `Hello! I would like to ask about: ${n}.`,
  wholesale: d => `Hello! I would like to talk about supplying my business.\n` +
                  `• Business: ${d.empresa}\n• Type: ${d.tipo}\n• Volume: ${d.volume}\n` +
                  `• Frequency: ${d.freq}\n• Contact: ${d.contato}`,
  events: 'Hello! I would like to ask about a dessert table for an event.',
  noNum: '[CONFIRM] No phone or WhatsApp number is readable for Docaria da Jô — the Instagram profile sits ' +
         'behind a login wall and there is no website. This control stays disabled until the real number ' +
         'is confirmed rather than messaging a stranger.',
  needStep: 'Please complete this step before continuing.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  warnLead: d => `⚠ The date you chose is inside the current lead time of ${d} days. It may not be possible — ` +
                 `send the request anyway and Jô will tell you.`,
  warnUnknown: '⚠ The current lead time is [CONFIRM]. Until it is set, this form cannot tell you whether your ' +
               'date is possible — Jô will confirm.',
  head: 'COMMISSION REQUEST — via the website',
  labels: { ocasiao:'Occasion', data:'Delivery date', porcoes:'Servings', estilo:'Style',
            ref:'Reference', sabores:'Flavours', restricoes:'Allergies / dietary',
            entrega:'Delivery or collection', nome:'Name', wpp:'WhatsApp' },
  none: 'not given'
} : {
  generic: 'Olá! Vim pelo site e gostaria de falar sobre uma encomenda.',
  item: n => `Olá! Gostaria de saber sobre: ${n}.`,
  wholesale: d => `Olá! Gostaria de falar sobre fornecimento para o meu negócio.\n` +
                  `• Estabelecimento: ${d.empresa}\n• Tipo: ${d.tipo}\n• Volume: ${d.volume}\n` +
                  `• Frequência: ${d.freq}\n• Contato: ${d.contato}`,
  events: 'Olá! Gostaria de falar sobre uma mesa de doces para um evento.',
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp da Docaria da Jô é legível — o perfil do Instagram está atrás ' +
         'de login e não existe site. Este controle fica desativado até o número real ser confirmado, em vez ' +
         'de mandar mensagem para um desconhecido.',
  needStep: 'Complete esta etapa antes de continuar.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  warnLead: d => `⚠ A data escolhida está dentro do prazo mínimo atual de ${d} dias. Pode não ser possível — ` +
                 `envie assim mesmo e a Jô confirma.`,
  warnUnknown: '⚠ O prazo mínimo de encomenda está como [CONFIRM]. Enquanto ele não for definido, este formulário ' +
               'não consegue dizer se a sua data é possível — a Jô confirma.',
  head: 'PEDIDO DE ORÇAMENTO — pelo site',
  labels: { ocasiao:'Ocasião', data:'Data de entrega', porcoes:'Porções', estilo:'Estilo',
            ref:'Referência', sabores:'Sabores', restricoes:'Restrições / alergias',
            entrega:'Entrega ou retirada', nome:'Nome', wpp:'WhatsApp' },
  none: 'não informado'
};

/* Dates in DD/MM/AAAA throughout — the picker AND the composed message. */
const ddmmyyyy = iso => {
  if (!iso) return T.none;
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : T.none;
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
      openWa(k === 'events' ? T.events : (k && k !== 'true') ? T.item(k) : T.generic);
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

  /* ---------- ⭐⭐ THE COMMISSION FLOW ---------- */
  const flow = document.getElementById('encomendaForm');
  if (flow) {
    const steps = [...flow.querySelectorAll('.flow__step')];
    const bar   = flow.querySelector('.flow__bar');
    const prevB = flow.querySelector('[data-flow="prev"]');
    const nextB = flow.querySelector('[data-flow="next"]');
    const sendB = flow.querySelector('[data-flow="send"]');
    const msgEl = flow.querySelector('.msg');
    const warn  = flow.querySelector('.warn');
    const nojs  = flow.querySelector('.nojs-note');
    let i = 0;

    /* JS is present, so collapse the long form into steps. Without JS the
       markup stays a single scrollable form and still works. */
    if (nojs) nojs.hidden = true;
    steps.forEach(s => s.classList.remove('on'));

    /* state survives a refresh — a commission brief is long enough that
       losing it halfway is a real abandonment cause */
    let state = {};
    try { state = JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch (_) { state = {}; }
    const persist = () => {
      const f = new FormData(flow);
      state = {};
      for (const [k, v] of f.entries()) state[k] = v;
      try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
    };
    /* restore */
    Object.entries(state).forEach(([k, v]) => {
      const el = flow.elements[k];
      if (!el) return;
      if (el.type === 'radio' || el.length) {
        [...flow.querySelectorAll(`[name="${k}"]`)].forEach(r => { if (r.value === v) r.checked = true; });
      } else el.value = v;
    });

    const compose = () => {
      const f = new FormData(flow), g = k => (f.get(k) || '').toString().trim() || T.none;
      const L = T.labels;
      return `*${T.head}*\n` +
        `• ${L.ocasiao}: ${g('ocasiao')}\n` +
        `• ${L.data}: ${ddmmyyyy(f.get('data'))}\n` +
        `• ${L.porcoes}: ${g('porcoes')}\n` +
        `• ${L.estilo}: ${g('estilo')}\n` +
        `• ${L.ref}: ${g('ref')}\n` +
        `• ${L.sabores}: ${g('massa')} / ${g('recheio')}\n` +
        `• ${L.restricoes}: ${g('restricoes')}\n` +
        `• ${L.entrega}: ${g('entrega')}\n` +
        `• ${L.nome}: ${g('nome')}\n` +
        `• ${L.wpp}: ${g('wpp')}`;
    };

    const render = () => {
      steps.forEach((s, j) => s.classList.toggle('on', j === i));
      if (bar) [...bar.children].forEach((b, j) => b.classList.toggle('done', j <= i));
      if (prevB) prevB.hidden = i === 0;
      if (nextB) nextB.hidden = i === steps.length - 1;
      if (sendB) sendB.hidden = i !== steps.length - 1;
      if (msgEl) { msgEl.hidden = i !== steps.length - 1; msgEl.textContent = compose(); }
      const h = steps[i].querySelector('legend');
      if (h) h.setAttribute('tabindex', '-1'), h.focus({ preventScroll:true });
    };

    /* per-step validation: only fields inside the visible step are checked */
    const valid = () => {
      const req = [...steps[i].querySelectorAll('[required]')];
      for (const el of req) {
        if (el.type === 'radio') {
          if (!flow.querySelector(`[name="${el.name}"]:checked`)) { alert(T.needStep); return false; }
        } else if (!el.value.trim()) { alert(T.needStep); el.focus(); return false; }
      }
      return true;
    };

    /* ⭐ the live lead-time warning on the date step */
    const dateEl = flow.querySelector('#data');
    const checkDate = () => {
      if (!warn || !dateEl) return;
      if (!dateEl.value) { warn.hidden = true; return; }
      if (LEAD_DAYS === null) { warn.textContent = T.warnUnknown; warn.hidden = false; return; }
      const days = Math.ceil((new Date(dateEl.value) - new Date()) / 86400000);
      if (days < LEAD_DAYS) { warn.textContent = T.warnLead(LEAD_DAYS); warn.hidden = false; }
      else warn.hidden = true;
    };
    dateEl?.addEventListener('change', checkDate);
    checkDate();

    nextB?.addEventListener('click', () => { if (!valid()) return; persist(); i = Math.min(i + 1, steps.length - 1); render(); });
    prevB?.addEventListener('click', () => { persist(); i = Math.max(i - 1, 0); render(); });
    flow.addEventListener('input', () => { persist(); if (msgEl && !msgEl.hidden) msgEl.textContent = compose(); });
    flow.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!valid()) return;
      if (!flow.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
      persist();
      openWa(compose());
    });
    render();
  }

  /* ---------- Wholesale / supplier enquiry — a different funnel entirely.
       A café or restaurant buyer will not open a purchasing relationship in an
       Instagram DM, which is why this has its own short form. ---------- */
  const wf = document.getElementById('atacadoForm');
  if (wf) wf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!wf.querySelector('#consentAt')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(wf), g = k => (f.get(k) || '—');
    openWa(T.wholesale({ empresa:g('empresa'), tipo:g('tipo'), volume:g('volume'),
                         freq:g('freq'), contato:g('contato') }));
  });

  /* ---------- Portfolio filter ---------- */
  const fb = document.querySelector('.filters');
  if (fb) {
    const items = [...document.querySelectorAll('.pf figure')];
    const apply = k => items.forEach(it => { it.hidden = !(k === 'all' || (it.dataset.k || '').split(' ').includes(k)); });
    fb.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      fb.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      apply(b.dataset.k);
    }));
    apply('all');
  }

  /* ---------- Signature carousel ---------- */
  document.querySelectorAll('.carou').forEach(c => {
    const track = c.querySelector('.track');
    if (!track) return;
    const step = () => (track.firstElementChild?.offsetWidth || 360) + 26;
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
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Nothing to count: no years, no cakes delivered, no rating. All [CONFIRM]. */
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
     This site collects more personal data than any other in the batch: names,
     phone numbers, event dates, uploaded reference images and — crucially —
     ALLERGY INFORMATION, which is health data and therefore SENSITIVE under
     LGPD art. 11. The privacy policy is not boilerplate here. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const CKEY = 'docaria_lgpd_v1';
    const applyConsent = p => {
      if (!p) return;
      if (p.analytics) { /* analytics injected ONLY inside this branch */ }
      if (p.marketing) { /* marketing tags injected ONLY inside this branch */ }
    };
    const saved = localStorage.getItem(CKEY);
    if (!saved) setTimeout(() => ck.classList.add('on'), 950); else applyConsent(JSON.parse(saved));
    const save = p => { localStorage.setItem(CKEY, JSON.stringify(p)); ck.classList.remove('on'); applyConsent(p); };
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

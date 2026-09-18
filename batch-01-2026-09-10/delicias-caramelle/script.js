/* ==========================================================================
   DELÍCIAS CARAMELLE — script.js (shared by / and /en/)

   ⚠ INSTAGRAM-ONLY LEAD. instagram.com/caramellecafecolonial/ returns 200 and
     serves a login wall with no readable metadata. The handle is the only
     genuine signal. So this file contains NO cake, torta, cuca, bread, cheese,
     sausage or jam — and above all NO PER-PERSON PRICE. That number is the
     entire buying decision, and a wrong one poisons the pitch.

   ⭐ The booking module below is the conversion engine. It COMPOSES a complete,
     structured WhatsApp message and opens WhatsApp. It never submits anything
     on its own and it holds no inventory — which is exactly the point: it fixes
     lost and double-booked group DMs on day one without asking them to change
     any software.

   Vocabulary rule enforced throughout: this is a CAFÉ COLONIAL. Not brunch,
   not high tea, not a buffet — on either language tree.
   ========================================================================== */

const WA_NUMBER = null;   // [CONFIRM]
const EMAIL     = null;   // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to ask about the café colonial.',
  item: n => `Hello! I would like to ask about: ${n}.`,
  group: 'Hello! I would like to enquire about a large table / a private booking.',
  book: d => `Hello! I would like to book a table for the café colonial.\n` +
             `• Name: ${d.nome}\n• Date: ${d.data}\n• Time: ${d.hora}\n• People: ${d.pax}\n` +
             `• Occasion: ${d.ocasiao}\n• Dietary notes: ${d.dieta}\n• Message: ${d.msg}`,
  order: d => `Hello! I would like to order:\n• Item: ${d.item}\n• Size: ${d.tam}\n` +
              `• Needed on: ${d.data}\n• Notes: ${d.obs}`,
  news: em => `Hello! Please add me to the Caramelle list: ${em}`,
  noNum: '[CONFIRM] No phone or WhatsApp number is readable for Delícias Caramelle — the Instagram profile ' +
         'sits behind a login wall and there is no website. This control stays disabled until the real ' +
         'number is confirmed rather than messaging a stranger.',
  needFields: 'Please give at least a name, a date and the number of people.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  previewL: 'This is the message that will be sent:'
} : {
  generic: 'Olá! Vim pelo site e gostaria de informações sobre o café colonial.',
  item: n => `Olá! Gostaria de saber sobre: ${n}.`,
  group: 'Olá! Gostaria de falar sobre uma mesa grande / reserva de grupo.',
  book: d => `Olá! Gostaria de reservar uma mesa para o café colonial.\n` +
             `• Nome: ${d.nome}\n• Data: ${d.data}\n• Horário: ${d.hora}\n• Pessoas: ${d.pax}\n` +
             `• Ocasião: ${d.ocasiao}\n• Restrições alimentares: ${d.dieta}\n• Mensagem: ${d.msg}`,
  order: d => `Olá! Gostaria de fazer uma encomenda:\n• Item: ${d.item}\n• Tamanho: ${d.tam}\n` +
              `• Para o dia: ${d.data}\n• Observações: ${d.obs}`,
  news: em => `Olá! Quero entrar na lista da Caramelle: ${em}`,
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp da Delícias Caramelle é legível — o perfil do Instagram está ' +
         'atrás de login e não existe site. Este controle fica desativado até o número real ser confirmado, ' +
         'em vez de mandar mensagem para um desconhecido.',
  needFields: 'Informe pelo menos nome, data e número de pessoas.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  previewL: 'Esta é a mensagem que será enviada:'
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
      openWa(k === 'group' ? T.group : (k && k !== 'true') ? T.item(k) : T.generic);
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
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 110);
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

  /* ---------- Hero parallax on the overhead table ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 950) * 0.14}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ Booking form → a complete, structured WhatsApp message ------
     Live preview, so the guest sees exactly what gets sent. No children's-party
     occasion exists in the option list, by instruction. */
  const bf = document.getElementById('bookForm');
  if (bf) {
    const prev = document.getElementById('bookPreview');
    const collect = () => {
      const f = new FormData(bf), g = k => (f.get(k) || '—').toString().trim() || '—';
      return { nome:g('nome'), data:ddmm(f.get('data')), hora:g('hora'), pax:g('pax'),
               ocasiao:g('ocasiao'), dieta:g('dieta'), msg:g('msg') };
    };
    const render = () => { if (prev) prev.textContent = T.previewL + '\n\n' + T.book(collect()); };
    bf.addEventListener('input', render);
    bf.addEventListener('change', render);
    render();
    bf.addEventListener('submit', ev => {
      ev.preventDefault();
      const f = new FormData(bf);
      if (!f.get('nome') || !f.get('data') || !f.get('pax')) { alert(T.needFields); return; }
      if (!bf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
      openWa(T.book(collect()));
    });
  }

  /* ---------- Encomendas — deliberately simpler than the booking flow ------- */
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
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 100}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Nothing to count on this build. No founding year, no number of items on
     the table, no rating, no guests served — none of it is verified, and a
     heritage format is exactly where such figures get invented. The engine is
     here so it works the day a real number arrives. */
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

  /* ---------- LGPD — required: the booking form collects a name, a date and
       a phone number. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'caramelle_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 84, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

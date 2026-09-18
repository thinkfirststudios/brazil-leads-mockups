/* ==========================================================================
   GLOBAL TRAVEL & CORPORATE — script.js (shared by / and /en/)

   ⚠ B2B. The buyer is a finance director, an HR manager or an executive
     assistant — not a traveller. Every mechanic here serves a qualified
     proposal request, not a booking.

   ⭐ TWO PATHS, NEVER MERGED. The corporate enquiry and the leisure enquiry
     compose DIFFERENT messages, use DIFFERENT CTAs and are validated
     separately. A visitor planning a honeymoon must never land in a form
     asking for their company's CNPJ — which is exactly what their current
     site does.

   ⚠ THE PUBLISHED METRICS ARE THEIR CLAIMS, NOT OURS: 18% average saving,
     18+ years, 650+ companies, 130k+ tickets, 30+ events abroad. Every one is
     reproduced as published and every one carries a [CONFIRM] on the page.
     ⚠ THE ASTERISK ON THE 18% IS LOAD-BEARING and is carried across verbatim:
       "Implementado política de viagens aliada a descontos corporativos."
       A savings figure without its condition is an advertising claim.

   ⚠ NOT INVENTED ANYWHERE: no client name, no logo, no SLA, no integration,
     no contract term, no headcount, no price. TMC pricing is contractual and
     never belongs on a public page.
   ========================================================================== */

/* Published on their own site. */
const TEL = '554832091718';          // (48) 3209-1718
const WA_NUMBER = '5548991278852';   // (48) 99127-8852
const EMAIL = 'info@viajeglobal.com.br';   // ⚠ note the domain mismatch — see the page

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to talk about our company travel programme.',
  demo: 'Hello! I would like to see the Reserve platform.',
  /* the corporate intake — qualifying, deliberately */
  proposal: d => `PROPOSAL REQUEST — via the website\n` +
    `• Company: ${d.empresa}\n• CNPJ: ${d.cnpj}\n• Contact: ${d.nome} (${d.cargo})\n` +
    `• Email: ${d.email}\n• Phone: ${d.tel}\n• Travellers: ${d.viajantes}\n` +
    `• Estimated annual travel spend: ${d.gasto}\n• Main destinations: ${d.destinos}\n` +
    `• Currently using an agency or TMC: ${d.tmc}`,
  /* the leisure intake — a completely different conversation */
  leisure: d => `LEISURE ENQUIRY — via the website\n` +
    `• Name: ${d.nome}\n• Contact: ${d.contato}\n• Trip: ${d.tipo}\n` +
    `• Approximate dates: ${d.datas}\n• Travellers: ${d.pax}\n• Notes: ${d.msg}`,
  needConsent: 'Please tick the consent box so we may reply to you.',
  needFields: 'Please complete this step before continuing.'
} : {
  generic: 'Olá! Vim pelo site e gostaria de falar sobre o programa de viagens da nossa empresa.',
  demo: 'Olá! Gostaria de conhecer a plataforma Reserve.',
  proposal: d => `SOLICITAÇÃO DE PROPOSTA — pelo site\n` +
    `• Empresa: ${d.empresa}\n• CNPJ: ${d.cnpj}\n• Contato: ${d.nome} (${d.cargo})\n` +
    `• E-mail: ${d.email}\n• Telefone: ${d.tel}\n• Nº de viajantes: ${d.viajantes}\n` +
    `• Gasto anual estimado com viagens: ${d.gasto}\n• Principais destinos: ${d.destinos}\n` +
    `• Já usa agência ou TMC: ${d.tmc}`,
  leisure: d => `CONTATO LAZER & LUXO — pelo site\n` +
    `• Nome: ${d.nome}\n• Contato: ${d.contato}\n• Viagem: ${d.tipo}\n` +
    `• Datas aproximadas: ${d.datas}\n• Viajantes: ${d.pax}\n• Observações: ${d.msg}`,
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  needFields: 'Complete esta etapa antes de continuar.'
};

const wa = msg => 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

/* the CNPJ mask their live form already uses — kept, because it is theirs and
   because a masked field reads as a form built for a company */
const maskCNPJ = v => {
  const d = v.replace(/\D/g, '').slice(0, 14);
  return d.replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2');
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-wa]').forEach(a => {
    const k = a.getAttribute('data-wa');
    a.href = wa(k === 'demo' ? T.demo : T.generic);
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tel]').forEach(a => a.href = 'tel:+' + TEL);
  document.querySelectorAll('[data-email]').forEach(a => a.href = 'mailto:' + EMAIL);

  /* ---------- Header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 50);
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

  /* ---------- ⭐ Persona router — a controller and an HR manager are buying
       two different products from the same company, so these are real routers
       rather than decoration. ---------- */
  const prow = document.querySelector('.personas');
  if (prow) {
    const btns = [...prow.querySelectorAll('button')];
    const select = b => btns.forEach(x => {
      const on = x === b;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(x.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    btns.forEach(b => b.addEventListener('click', () => select(b)));
    prow.addEventListener('keydown', ev => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (ev.key === 'ArrowRight') j = (i + 1) % btns.length;
      if (ev.key === 'ArrowLeft')  j = (i - 1 + btns.length) % btns.length;
      if (ev.key === 'Home') j = 0;
      if (ev.key === 'End')  j = btns.length - 1;
      if (j === null) return;
      ev.preventDefault(); btns[j].focus(); select(btns[j]);
    });
    select(btns[0]);
  }

  /* ---------- ⭐ THE PROPOSAL FORM — two steps, light fields first.
       Spend is BANDED, never a free-text figure: a procurement contact will not
       type a number into a public form, and a band is enough to qualify. ----- */
  const pf = document.getElementById('proposalForm');
  if (pf) {
    const steps = [...pf.querySelectorAll('.fstep')];
    const bar = pf.querySelector('.fbar');
    const prev = pf.querySelector('[data-f="prev"]');
    const next = pf.querySelector('[data-f="next"]');
    const send = pf.querySelector('[data-f="send"]');
    let i = 0;

    const cnpj = pf.querySelector('#cnpj');
    cnpj?.addEventListener('input', () => { cnpj.value = maskCNPJ(cnpj.value); });

    const render = () => {
      steps.forEach((s, j) => s.classList.toggle('on', j === i));
      if (bar) [...bar.children].forEach((b, j) => b.classList.toggle('done', j <= i));
      if (prev) prev.hidden = i === 0;
      if (next) next.hidden = i === steps.length - 1;
      if (send) send.hidden = i !== steps.length - 1;
      const h = steps[i].querySelector('h3');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll:true }); }
    };
    const valid = () => {
      for (const el of steps[i].querySelectorAll('[required]')) {
        if (!el.value.trim()) { alert(T.needFields); el.focus(); return false; }
      }
      return true;
    };
    next?.addEventListener('click', () => { if (!valid()) return; i = Math.min(i + 1, steps.length - 1); render(); });
    prev?.addEventListener('click', () => { i = Math.max(i - 1, 0); render(); });
    pf.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!valid()) return;
      if (!pf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
      const f = new FormData(pf), g = k => (f.get(k) || '—').toString().trim() || '—';
      open(wa(T.proposal({ empresa:g('empresa'), cnpj:g('cnpj'), nome:g('nome'), cargo:g('cargo'),
                           email:g('email'), tel:g('tel'), viajantes:g('viajantes'), gasto:g('gasto'),
                           destinos:g('destinos'), tmc:g('tmc') })), '_blank', 'noopener');
    });
    render();
  }

  /* ---------- The LEISURE enquiry — a separate form, a separate message, and
       deliberately no company field anywhere in it. ---------- */
  const lf = document.getElementById('leisureForm');
  if (lf) lf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!lf.querySelector('#consentL')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(lf), g = k => (f.get(k) || '—');
    open(wa(T.leisure({ nome:g('nome'), contato:g('contato'), tipo:g('tipo'),
                        datas:g('datas'), pax:g('pax'), msg:g('msg') })), '_blank', 'noopener');
  });

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 85}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up on the metrics strip.
     These ARE their published figures, so they animate — but each one carries a
     visible [CONFIRM] beside it on the page, because republishing someone
     else's claim as your own design does not make it verified. The 18% keeps
     its asterisk and the asterisk keeps its footnote. ---------- */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + to + suf; return; }
    const t0 = performance.now(), dur = 1500;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- LGPD.
     ⚠ The proposal form collects a CNPJ, a job title, a traveller count and a
     spend band — commercially sensitive information about a company, not just
     personal data about a person. The policy must name the purpose, the
     retention period and every processor, and this data must never be used for
     unrelated marketing without separate consent.
     "Recusar" is visually equal to "Aceitar", by instruction. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'gtc_lgpd_v1';
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

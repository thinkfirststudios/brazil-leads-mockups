/* ==========================================================================
   DELPIZZO ARQUITETURA E INTERIORES — script.js (shared by / and /en/)

   ⚠ THEIR SITE COULD NOT BE READ. delpizzoarquitetura.com.br returned an empty
     body to a direct fetch and a 403 Forbidden to a browser request on
     09/09/2026. Nothing in this build came from their own site — every fact is
     secondary-source and every one of them is a visible [CONFIRM].

   ⚠ WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN:
       · no CAU number, no RRT, no CNPJ, no professional title, no
         post-graduate qualification — inventing any of those is a council
         matter in a regulated profession, not merely an error
       · no star rating, no review count, no award, no client logo, no
         publication masthead, no testimonial — none is verified, and there is
         no testimonial rendering code anywhere in this build
       · no fee, no fee percentage, no hourly rate, no timeline figure
       · the two most quotable numbers on the site — "20+ anos" and
         "300+ projetos" — are secondary-source ADVERTISING CLAIMS under CDC
         art. 37 and CAU's truthfulness rule. They are rendered as [CONFIRM]
         chips and the count-up engine below refuses to animate them until a
         real figure is supplied.
   ========================================================================== */

const TEL = '4832060523';                       // (48) 3206-0523 [CONFIRM — secondary source]
const EMAIL = 'contato@delpizzoarquitetura.com.br';  // [CONFIRM — secondary source]
/* [CONFIRM whether a WhatsApp number exists at all]. A boutique practice with
   no WhatsApp route is unusual in this market and, if true, is a finding in its
   own right — so the floating affordance falls back to the landline rather than
   inventing a mobile. */
const WA_NUMBER = null;

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to talk about a project.',
  brief: d => `Hello! I would like to talk about a project.\n• Name: ${d.nome}\n` +
              `• Project type: ${d.tipo}\n• Scope: ${d.escopo}\n• Location: ${d.local}\n` +
              `• Approx. area: ${d.area}\n• Desired timeline: ${d.prazo}\n• Brief: ${d.brief}`,
  noWa: '[CONFIRM] No WhatsApp number was found for Delpizzo — only the landline (48) 3206-0523, and that ' +
        'itself is a secondary source. Rather than invent a mobile, this control offers the phone and the ' +
        'email. Whether a WhatsApp route exists at all is a finding worth raising.',
  needFields: 'Please give at least a name, a project type and a location.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  showing: (n, t) => `Showing ${n} of ${t} projects`,
  before: 'Before', after: 'After'
} : {
  generic: 'Olá! Vim pelo site e gostaria de conversar sobre um projeto.',
  brief: d => `Olá! Gostaria de conversar sobre um projeto.\n• Nome: ${d.nome}\n` +
              `• Tipo de projeto: ${d.tipo}\n• Escopo: ${d.escopo}\n• Local: ${d.local}\n` +
              `• Metragem aproximada: ${d.area}\n• Prazo desejado: ${d.prazo}\n• Briefing: ${d.brief}`,
  noWa: '[CONFIRM] Nenhum número de WhatsApp foi encontrado para a Delpizzo — apenas o fixo (48) 3206-0523, ' +
        'e ele próprio é fonte secundária. Em vez de inventar um celular, este controle oferece o telefone e ' +
        'o e-mail. Se existe ou não um canal de WhatsApp é, por si só, um achado a levantar.',
  needFields: 'Informe pelo menos nome, tipo de projeto e local.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  showing: (n, t) => `Exibindo ${n} de ${t} projetos`,
  before: 'Antes', after: 'Depois'
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* the landline and the email ARE published (secondary-source) and are wired */
  document.querySelectorAll('[data-tel]').forEach(a => a.href = 'tel:+55' + TEL);
  document.querySelectorAll('[data-email]').forEach(a => a.href = 'mailto:' + EMAIL);
  document.querySelectorAll('[data-wa]').forEach(el => {
    if (WA_NUMBER) {
      el.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(T.generic);
      el.target = '_blank'; el.rel = 'noopener';
      return;
    }
    el.setAttribute('data-unconfirmed', 'true');
    el.title = T.noWa;
    el.addEventListener('click', ev => { ev.preventDefault(); alert(T.noWa); });
  });

  /* ---------- Sticky header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 60);
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

  /* ---------- Hero + parallax band. rAF-throttled, transform only, and both
       are switched off entirely under prefers-reduced-motion. ---------- */
  const hbg = document.querySelector('.hero__bg');
  const plx = document.querySelectorAll('.parallax');
  if (!reduce && (hbg || plx.length)) {
    let tick = false;
    const run = () => {
      if (hbg) hbg.style.transform = `translate3d(0,${Math.min(scrollY, 900) * 0.14}px,0)`;
      plx.forEach(p => {
        const r = p.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        p.style.transform = `translate3d(0,${(r.top - innerHeight / 2) * -0.08}px,0)`;
      });
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive:true });
    run();
  }

  /* ---------- Portfolio filters: by TYPE and by SCOPE.
       Scope matters more than type to the client this practice should be
       chasing — "projeto" vs "projeto + gestão de obra" is the actual buying
       decision, so it is a first-class filter rather than a footnote. -------- */
  const fbar = document.querySelector('.filters');
  if (fbar) {
    const cards = [...document.querySelectorAll('.pcard')];
    const out = document.getElementById('pcount');
    const state = { tipo:'all', escopo:'all' };
    const apply = () => {
      let n = 0;
      cards.forEach(c => {
        const okT = state.tipo === 'all' || c.dataset.tipo === state.tipo;
        const okE = state.escopo === 'all' || (c.dataset.escopo || '').split(' ').includes(state.escopo);
        const show = okT && okE;
        c.hidden = !show;
        if (show) n++;
      });
      if (out) out.textContent = T.showing(n, cards.length);
    };
    fbar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const key = b.dataset.k, val = b.dataset.v;
      state[key] = val;
      fbar.querySelectorAll(`button[data-k="${key}"]`).forEach(x =>
        x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    apply();
  }

  /* ---------- Before / after.
       A drag divider AND a keyboard-operable alternative: the range input is
       a real <input type="range">, so arrow keys, Home and End all work, and
       a two-button toggle jumps straight to either state. ---------- */
  document.querySelectorAll('.ba-wrap').forEach(wrap => {
    const ba = wrap.querySelector('.ba');
    const range = wrap.querySelector('.ba__range');
    if (!ba || !range) return;
    const set = v => { ba.style.setProperty('--x', v + '%'); range.value = v; };
    range.addEventListener('input', () => set(range.value));
    wrap.querySelectorAll('[data-ba]').forEach(b =>
      b.addEventListener('click', () => set(b.dataset.ba === 'before' ? 100 : 0)));
    /* pointer drag, without breaking the keyboard path */
    let down = false;
    const from = e => {
      const r = ba.getBoundingClientRect();
      const x = ((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width * 100;
      set(Math.max(0, Math.min(100, x)));
    };
    ba.addEventListener('pointerdown', e => { down = true; from(e); });
    addEventListener('pointermove', e => { if (down) from(e); });
    addEventListener('pointerup', () => { down = false; });
    set(50);
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
     ⚠ It animates ONLY where data-count carries a real number. Every figure in
     this build is currently "[CONFIRM]", so nothing animates — deliberately.
     An unverified project count on an architect's website is the kind of error
     that ends a relationship. */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;   // "[CONFIRM]" lands here and stays as written
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1500;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.4 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- Qualifying enquiry.
       Not a contact form: it captures what actually decides whether a lead is
       real. For engagements running six figures and a year, that saves more
       time than any automation. It composes an email (or WhatsApp, if a number
       is ever confirmed) and stores nothing. ---------- */
  const qf = document.getElementById('briefForm');
  if (qf) qf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(qf), g = k => (f.get(k) || '—').toString().trim() || '—';
    if (!f.get('nome') || !f.get('tipo') || !f.get('local')) { alert(T.needFields); return; }
    if (!qf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const body = T.brief({ nome:g('nome'), tipo:g('tipo'), escopo:g('escopo'), local:g('local'),
                           area:g('area'), prazo:g('prazo'), brief:g('brief') });
    if (WA_NUMBER) {
      open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
    } else {
      const subj = IS_EN ? 'Project enquiry via the website' : 'Contato sobre projeto pelo site';
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subj) +
                      '&body=' + encodeURIComponent(body);
    }
  });

  /* ---------- LGPD.
       The enquiry form is the sensitive piece: it collects a person's name,
       contact details, property location, property size and timeline — a rich
       profile of an identifiable individual and their home. Analytics and
       marketing stay off until switched on, and enquiry data is never used for
       unrelated marketing without separate consent. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'delpizzo_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 90, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

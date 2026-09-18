/* ==========================================================================
   FLORIPA FOR GRINGOS — Laiane Dethling — script.js (shared by / and /pt/)

   ⚠ THE LIVE SITE IS A JS SHELL. floripaforgringos.com is a Lovable-built SPA:
     the served HTML is ~2.9 KB of meta tags and a script bundle, and all
     visible content is client-rendered. Everything known about this business
     came from those meta tags. Body copy, service details, pricing and
     testimonials were NOT recoverable.

   ⚠ SO THIS FILE CONTAINS: no price, no package, no client count, no "families
     relocated", no success rate, no star rating and no testimonial. This is a
     trust-led business where a fabricated detail is the most damaging thing
     that could be published — and there is no testimonial rendering code here
     at all.

   ⚠⚠ THE DEFINING CONSTRAINT: non-lawyers may not give legal advice in Brazil.
     The practice of law is reserved to lawyers enrolled with the OAB. So the
     WhatsApp messages this file composes never say "visa", "residency",
     "we represent you" or "legal support" — they say what she actually does:
     administrative support, document preparation, scheduling, accompaniment,
     and COORDINATION with qualified professionals.

   ⚠ NEVER COLLECTED HERE: passport numbers, ID numbers, CPF, or any document
     upload. The contact form takes a name, email, nationality, need and
     timeline — nothing else. Document exchange moves to a secure,
     access-controlled channel after engagement.
   ========================================================================== */

const WA_NUMBER = null;   // [CONFIRM]
const EMAIL     = null;   // [CONFIRM]

/* EN is the primary tree — the business name settles it. */
const IS_PT = document.documentElement.lang.toLowerCase().startsWith('pt');

const T = IS_PT ? {
  generic: 'Olá, Laiane! Vim pelo site e preciso de ajuda com uma situação aqui no Brasil.',
  service: s => `Olá, Laiane! Vim pelo site e queria falar sobre: ${s}.`,
  stage: s => `Olá, Laiane! Estou na etapa "${s}" e queria saber por onde começar.`,
  form: d => `Olá, Laiane!\n• Nome: ${d.nome}\n• E-mail: ${d.email}\n• Nacionalidade: ${d.nac}\n` +
             `• Do que preciso: ${d.need}\n• Prazo: ${d.prazo}`,
  noNum: '[CONFIRM] O WhatsApp e o e-mail da Laiane não puderam ser lidos: o site atual é uma aplicação ' +
         'renderizada no navegador e o HTML servido traz apenas meta tags. Este controle fica desativado até ' +
         'o número real ser confirmado.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  noDocs: 'Não escreva número de passaporte, RG, CPF nem envie documento por aqui. Depois do primeiro contato, ' +
          'a troca de documentos acontece por um canal seguro.'
} : {
  generic: 'Hi Laiane! I found your site and I need help with something in Brazil.',
  service: s => `Hi Laiane! I found your site and I would like to talk about: ${s}.`,
  stage: s => `Hi Laiane! I am at the "${s}" stage and I would like to know where to start.`,
  form: d => `Hi Laiane!\n• Name: ${d.nome}\n• Email: ${d.email}\n• Nationality: ${d.nac}\n` +
             `• What I need: ${d.need}\n• Timeline: ${d.prazo}`,
  noNum: '[CONFIRM] Laiane&rsquo;s WhatsApp number and email could not be read: the current site is a ' +
         'browser-rendered app and the served HTML contains only meta tags. This control stays disabled until ' +
         'the real number is confirmed.',
  needConsent: 'Please tick the consent box so we can reply to you.',
  noDocs: 'Please do not type a passport number, ID number or CPF here, and do not attach documents. After ' +
          'first contact, document exchange moves to a secure channel.'
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
      openWa(!k || k === 'true' ? T.generic
           : k.startsWith('stage:') ? T.stage(k.slice(6)) : T.service(k));
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

  /* ---------- Hero parallax ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 800) * 0.13}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ THE TIMELINE ACCORDION ----------
     Fully keyboard-operable with correct ARIA. The markup ships with the first
     stage open and every panel present, so without JS the page is a readable
     sequence of four stages rather than four dead headings. */
  document.querySelectorAll('.tl__stage').forEach((stage, i) => {
    const head = stage.querySelector('.tl__head');
    const body = stage.querySelector('.tl__body');
    if (!head || !body) return;
    const set = open => {
      stage.dataset.open = String(open);
      head.setAttribute('aria-expanded', String(open));
      body.hidden = !open;
    };
    set(i === 0);
    head.addEventListener('click', () => set(body.hidden));
    /* arrow keys move between stages, as an accordion should */
    head.addEventListener('keydown', ev => {
      const heads = [...document.querySelectorAll('.tl__head')];
      const j = heads.indexOf(head);
      let k = null;
      if (ev.key === 'ArrowDown') k = (j + 1) % heads.length;
      if (ev.key === 'ArrowUp')   k = (j - 1 + heads.length) % heads.length;
      if (ev.key === 'Home') k = 0;
      if (ev.key === 'End')  k = heads.length - 1;
      if (k === null) return;
      ev.preventDefault(); heads[k].focus();
    });
  });

  /* ---------- Contact form.
     ⚠ It collects a name, email, nationality, need and timeline. Nothing else.
     No passport number, no ID number, no CPF, no document upload — and the
     field is guarded, not merely unlabelled. ---------- */
  const cf = document.getElementById('contactForm');
  if (cf) {
    const need = cf.querySelector('#need');
    /* a soft, non-blocking guard: if someone starts typing a document number,
       remind them once rather than silently accepting it */
    let warned = false;
    need?.addEventListener('input', () => {
      if (warned) return;
      const v = need.value.replace(/\D/g, '');
      if (v.length >= 9) { warned = true; alert(T.noDocs); }
    });
    cf.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!cf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
      const f = new FormData(cf), g = k => (f.get(k) || '—');
      const body = T.form({ nome:g('nome'), email:g('email'), nac:g('nacionalidade'),
                            need:g('need'), prazo:g('prazo') });
      if (WA_NUMBER) { openWa(body); return; }
      if (EMAIL) {
        const subj = IS_PT ? 'Contato pelo site' : 'Enquiry via the website';
        location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subj) +
                        '&body=' + encodeURIComponent(body);
        return;
      }
      alert(T.noNum);
    });
  }

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 85}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Deliberately finds nothing. Lingua's "5,000+ students" capsule is exactly
     the device this build refuses: no client count, no families relocated, no
     success rate, no years figure that has not been confirmed. */
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

  /* ---------- LGPD *and* GDPR.
     Many of her clients are in the EU or the UK when they first make contact,
     so GDPR applies alongside the LGPD: named controller, stated legal basis, a
     data-subject request path, retention periods, and a policy in both
     languages.

     ⚠ HER GOOGLE ADS CONVERSION TAG (AW-17670940912) IS LIVE ON THE CURRENT
     SITE. It is advertising measurement, so it belongs behind the marketing
     branch below and must not fire before consent. ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'ffg_consent_v1';
    const applyConsent = p => {
      if (!p) return;
      if (p.analytics) { /* analytics injected ONLY inside this branch */ }
      if (p.marketing) {
        /* [CONFIRM] Google Ads conversion tag AW-17670940912 is injected here,
           and only here — never on page load. */
      }
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 82, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

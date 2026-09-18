/* ==========================================================================
   GHIORZITAVARES ARQUITETURA — script.js (shared by /, /en/ and /fr/)

   Trilingual by design, not by afterthought. Their PT, EN and FR trees already
   exist with translated page AND portfolio slugs, so the language toggle here
   is primary navigation and this engine reads <html lang> to serve all three.

   ⚠ WHAT THIS FILE DELIBERATELY DOES NOT CONTAIN:
     · no CAU number, no CREA number, no RRT, no ART — none is published
       anywhere on their site and a professional registration is never invented
     · no project date, city, country, area or client beyond the two dates they
       actually publish (Casa F+A, dez 2018; Casa das Cascatas L+J, ago 2021)
     · no photographer credit invented — the credit is REQUIRED on a case study
       and is left as a visible slot
     · no counter figure. Their About page publishes the LABELS ("Anos de
       experiência", "Cidades no Brasil", "Países") and the NUMBERS did not
       render in the served markup, so the count-up engine below refuses to
       animate them.
     · no award, no rating, no review

   ⚠ THE ENGINEERING BOUNDARY. Their own words: "Trabalhamos com uma rede de
     profissionais e consultores nas áreas de engenharia". Engineering is a
     PARTNER NETWORK, not in-house — so no message composed here says or implies
     that the practice performs engineering itself.
   ========================================================================== */

/* Two numbers are published; which is the primary WhatsApp line is not. */
const TEL_1 = '5548984414426';   // (48) 9.8441.4426
const TEL_2 = '5548999118441';   // (48) 9.9911.8441
const WA_NUMBER = null;          // [CONFIRM which of the two is the WhatsApp line]
const EMAIL = 'contato@ghiorzitavares.com.br';

const LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
const IS_EN = LANG.startsWith('en');
const IS_FR = LANG.startsWith('fr');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like to talk about a project.',
  project: p => `Hello! I would like to know more about the project: ${p}.`,
  brief: d => `Hello! I would like to start a project.\n• Name: ${d.nome}\n• Where: ${d.local}\n` +
              `• Type: ${d.tipo}\n• Scope: ${d.escopo}\n• Construction system: ${d.sistema}\n` +
              `• Approx. area: ${d.area}\n• Timeline: ${d.prazo}\n• Brief: ${d.brief}`,
  noWa: '[CONFIRM] Two phone numbers are published — (48) 9.8441.4426 and (48) 9.9911.8441 — and it is not ' +
        'stated which is the WhatsApp line. Rather than guess, this control offers both numbers and the email.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  showing: (n, t) => n === t ? `Showing all ${t} projects` : `Showing ${n} of ${t} projects`,
  none: 'No project matches those filters.'
} : IS_FR ? {
  generic: 'Bonjour ! Je viens de votre site et je souhaiterais parler d’un projet.',
  project: p => `Bonjour ! J’aimerais en savoir plus sur le projet : ${p}.`,
  brief: d => `Bonjour ! Je souhaiterais démarrer un projet.\n• Nom : ${d.nome}\n• Lieu : ${d.local}\n` +
              `• Type : ${d.tipo}\n• Périmètre : ${d.escopo}\n• Système constructif : ${d.sistema}\n` +
              `• Surface approx. : ${d.area}\n• Délai : ${d.prazo}\n• Brief : ${d.brief}`,
  noWa: '[CONFIRM] Deux numéros sont publiés — (48) 9.8441.4426 et (48) 9.9911.8441 — sans préciser lequel est ' +
        'la ligne WhatsApp. Plutôt que de deviner, ce bouton propose les deux numéros et l’e-mail.',
  needConsent: 'Veuillez cocher la case de consentement pour que nous puissions vous répondre.',
  showing: (n, t) => n === t ? `${t} projets affichés` : `${n} projets sur ${t}`,
  none: 'Aucun projet ne correspond à ces filtres.'
} : {
  generic: 'Olá! Vim pelo site e gostaria de conversar sobre um projeto.',
  project: p => `Olá! Gostaria de saber mais sobre o projeto: ${p}.`,
  brief: d => `Olá! Gostaria de começar um projeto.\n• Nome: ${d.nome}\n• Local: ${d.local}\n` +
              `• Tipo: ${d.tipo}\n• Escopo: ${d.escopo}\n• Sistema construtivo: ${d.sistema}\n` +
              `• Área aproximada: ${d.area}\n• Prazo: ${d.prazo}\n• Briefing: ${d.brief}`,
  noWa: '[CONFIRM] Dois telefones são publicados — (48) 9.8441.4426 e (48) 9.9911.8441 — e não está dito qual ' +
        'é a linha de WhatsApp. Em vez de chutar, este controle oferece os dois números e o e-mail.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  showing: (n, t) => n === t ? `Exibindo os ${t} projetos` : `Exibindo ${n} de ${t} projetos`,
  none: 'Nenhum projeto combina com esses filtros.'
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const openWa = msg => {
    if (!WA_NUMBER) { alert(T.noWa); return false; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    return true;
  };
  document.querySelectorAll('[data-wa]').forEach(el => {
    const k = el.getAttribute('data-wa');
    el.addEventListener('click', ev => {
      ev.preventDefault();
      openWa(k && k !== 'true' ? T.project(k) : T.generic);
    });
    if (!WA_NUMBER) el.title = T.noWa;
  });
  /* both published numbers dial for real */
  document.querySelectorAll('[data-tel="1"]').forEach(a => a.href = 'tel:+' + TEL_1);
  document.querySelectorAll('[data-tel="2"]').forEach(a => a.href = 'tel:+' + TEL_2);
  document.querySelectorAll('[data-email]').forEach(a => a.href = 'mailto:' + EMAIL);

  /* ---------- Header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 80);
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
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 950) * 0.14}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ PORTFOLIO FILTERS — by TYPOLOGY and by CONSTRUCTION SYSTEM.
     Five systems (conventional, container, precast concrete, steel frame,
     engineered timber) is unusual enough to be a real filter axis, and it is
     the axis a client comparing prefab against conventional actually uses.
     Scope — projeto vs. projeto + obra — is the third, and the most important,
     because design-and-build is the differentiator their current portfolio
     gives no way to see. ---------- */
  const bar = document.querySelector('.filters');
  if (bar) {
    const cards = [...document.querySelectorAll('.proj')];
    const out = document.getElementById('pcount');
    const state = { tipo:'all', sistema:'all', escopo:'all' };
    const apply = () => {
      let n = 0;
      cards.forEach(c => {
        const ok = ['tipo', 'sistema', 'escopo'].every(k =>
          state[k] === 'all' || (c.dataset[k] || '').split(' ').includes(state[k]));
        c.hidden = !ok;
        if (ok) n++;
      });
      if (out) out.textContent = n === 0 ? T.none : T.showing(n, cards.length);
    };
    bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const key = b.dataset.k;
      state[key] = b.dataset.v;
      bar.querySelectorAll(`button[data-k="${key}"]`).forEach(x =>
        x.setAttribute('aria-pressed', String(x === b)));
      apply();
    }));
    apply();
  }

  /* ---------- Enquiry.
     ⚠ The brief-capture asks for the CONSTRUCTION SYSTEM and the SCOPE, because
     those two answers change everything downstream — and because an
     international client asking about a container house in another country is
     a completely different conversation from a conventional build in Trindade. */
  const bf = document.getElementById('briefForm');
  if (bf) bf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!bf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(bf), g = k => (f.get(k) || '—').toString().trim() || '—';
    const body = T.brief({ nome:g('nome'), local:g('local'), tipo:g('tipo'), escopo:g('escopo'),
                           sistema:g('sistema'), area:g('area'), prazo:g('prazo'), brief:g('brief') });
    if (WA_NUMBER) { openWa(body); return; }
    const subj = IS_EN ? 'Project enquiry via the website'
               : IS_FR ? 'Demande de projet via le site' : 'Contato sobre projeto pelo site';
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subj) +
                    '&body=' + encodeURIComponent(body);
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
     ⚠ THE POINT IS WHAT IT REFUSES TO DO. Their About page publishes three
     counter LABELS and the NUMBERS did not render in the served markup. The
     Inarche pattern is kept, but an unverified figure on an architecture
     practice's website is exactly the kind of error that ends a relationship,
     so "[CONFIRM]" stays "[CONFIRM]". */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = parseFloat(el.dataset.count);
    cu.unobserve(el);
    if (isNaN(to)) return;
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

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'gt_lgpd_v1';
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

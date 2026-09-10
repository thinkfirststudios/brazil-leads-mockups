/* ==========================================================================
   BCh ARQUITETOS — script.js (shared by / and /en/)
   ========================================================================== */

/* ⚠ [CONFIRM the WhatsApp / mobile number.]
   Only a LANDLINE is published today — (48) 3371-1005 — and for a firm whose
   buyer is a developer standing on a terreno with a phone in their hand, that
   is the single biggest conversion leak on the current site. The placeholder
   below is intentionally non-dialable so nothing ships pointing at a stranger. */
const WA_NUMBER = null;                       // [CONFIRM mobile / WhatsApp]
const TEL       = '+554833711005';            // published landline — real
const EMAIL     = 'contato@bcharquitetos.com.br';   // real, also the careers inbox

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  wa: "Hello! I came from the BCh Arquitetos website and I'd like to talk about a project.",
  waLand: "Hello! I came from the BCh Arquitetos website and I'd like to talk about a site viability study.",
  noNumber: '[CONFIRM] BCh publishes only a landline — (48) 3371-1005. No WhatsApp number has been confirmed, ' +
            'so this button is intentionally inert rather than pointing at a guessed number. ' +
            'Call the landline or email contato@bcharquitetos.com.br in the meantime.',
  subject: 'Website enquiry — BCh Arquitetos',
  f: { name:'Name', last:'Surname', email:'Email', tel:'Phone', kind:'Enquiry type', msg:'Message' }
} : {
  wa: 'Olá! Vim pelo site da BCh Arquitetos e gostaria de falar sobre um projeto.',
  waLand: 'Olá! Vim pelo site da BCh Arquitetos e gostaria de falar sobre um estudo de viabilidade para um terreno.',
  noNumber: '[CONFIRM] A BCh publica apenas um telefone fixo — (48) 3371-1005. Nenhum WhatsApp foi confirmado, ' +
            'então este botão fica inativo de propósito, em vez de apontar para um número adivinhado. ' +
            'Ligue para o fixo ou escreva para contato@bcharquitetos.com.br.',
  subject: 'Contato pelo site — BCh Arquitetos',
  f: { name:'Nome', last:'Sobrenome', email:'E-mail', tel:'Telefone', kind:'Tipo de contato', msg:'Mensagem' }
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    const msg = a.getAttribute('data-wa') === 'terreno' ? T.waLand : T.wa;
    if (WA_NUMBER) {
      a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      a.target = '_blank'; a.rel = 'noopener';
    } else {
      a.href = 'tel:' + TEL;                  // graceful fallback to the real landline
      a.title = T.noNumber;
      a.setAttribute('data-unconfirmed', 'true');
      a.addEventListener('click', ev => { ev.preventDefault(); alert(T.noNumber); });
    }
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject);
  });

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
        a.style.transitionDelay = open ? `${80 + i*55}ms` : '0ms');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Project filter (real use types only) ---------- */
  const fbtns = document.querySelectorAll('.filters button');
  if (fbtns.length) fbtns.forEach(b => b.addEventListener('click', () => {
    const t = b.dataset.filter;
    fbtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('.proj').forEach(p => {
      p.hidden = !(t === 'all' || p.dataset.type === t);
    });
  }));

  /* ---------- Scroll reveal + stagger ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 100}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Signature draw-on (two of them) ---------- */
  const sigs = document.querySelectorAll('.sig');
  if (sigs.length) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); so.unobserve(e.target); }
    }), { threshold:.6 });
    sigs.forEach(s => so.observe(s));
  }

  /* ---------- Count-up on the escala row (only on confirmed figures) ---------- */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseFloat(el.dataset.count); cu.unobserve(el);
    if (!isFinite(target)) return;
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1-k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold:.6 });
  document.querySelectorAll('[data-count]').forEach(el => cu.observe(el));

  /* ---------- Hero parallax ---------- */
  const hb = document.querySelector('.hero__bg img');
  if (hb && !reduce) {
    let t = false;
    addEventListener('scroll', () => {
      if (t) return; t = true;
      requestAnimationFrame(() => {
        hb.style.transform = `translate3d(0,${Math.min(scrollY, innerHeight) * 0.18}px,0)`;
        t = false;
      });
    }, { passive:true });
  }

  /* ---------- Contact form → email (mirrors the fields they already use) ---------- */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    const body = [
      `${T.f.name}: ${g('nome')}`, `${T.f.last}: ${g('sobrenome')}`,
      `${T.f.email}: ${g('email')}`, `${T.f.tel}: ${g('telefone')}`,
      `${T.f.kind}: ${g('tipo')}`, '', g('mensagem')
    ].join('\n');
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject) +
                    '&body=' + encodeURIComponent(body);
  });

  /* ---------- LGPD banner — gates analytics and any map/social embed ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'bch_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 82, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

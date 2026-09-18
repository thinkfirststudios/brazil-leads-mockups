/* ==========================================================================
   ADAIANE SCORSIN — script.js  (shared by / and /en/)
   Strings follow <html lang>. Every [CONFIRM] is a visible placeholder.
   ========================================================================== */

/* ⚠ [CONFIRM the real WhatsApp number.] The number in her live JSON-LD is
   +55-48-84645450 — MALFORMED: Brazilian mobiles carry 9 digits after the area
   code, this has 8. The placeholder below is intentionally non-dialable so
   nothing ever ships pointing at a stranger's phone. */
const WA_NUMBER = null;   // [CONFIRM] - was '5548900000000', a placeholder, not a number
const WA = 'https://wa.me/' + WA_NUMBER + '?text=';

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const PREFILL = IS_EN
  ? "Hello Adaiane! I saw your website and I'd like to talk about an interior design project."
  : "Olá Adaiane! Vi seu site e gostaria de falar sobre um projeto de interiores.";

const PREFILL_MENT = IS_EN
  ? "Hello Adaiane! I'd like to know more about the mentorship."
  : "Olá Adaiane! Gostaria de saber mais sobre a mentoria.";

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp links ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    const kind = a.getAttribute('data-wa');
    a.href = WA + encodeURIComponent(kind === 'mentoria' ? PREFILL_MENT : PREFILL);
    a.target = '_blank'; a.rel = 'noopener';
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

  /* ---------- Scroll reveal + stagger ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 100}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.12, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Signature draw-on ---------- */
  const sig = document.querySelector('.sig');
  if (sig) new IntersectionObserver((es,o) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
  }), { threshold:.6 }).observe(sig);

  /* ---------- Count-up (only fires on confirmed numbers) ---------- */
  const cu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseFloat(el.dataset.count); cu.unobserve(el);
    if (!isFinite(target)) return;                       // unconfirmed → leave as-is
    if (reduce) { el.textContent = '+' + target; return; }
    const t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0) / 1500, 1);
      el.textContent = '+' + Math.round(target * (1 - Math.pow(1-k,3)));
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

  /* ---------- Contact form → WhatsApp (form is the SECONDARY path) ---------- */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    const msg = IS_EN
      ? `Hello Adaiane! Message from the website.\n• Name: ${g('nome')}\n• WhatsApp: ${g('zap')}\n• Email: ${g('email')}\n• City/Area: ${g('cidade')}\n• Project type: ${g('tipo')}\n\n${g('msg')}`
      : `Olá Adaiane! Mensagem pelo site.\n• Nome: ${g('nome')}\n• WhatsApp: ${g('zap')}\n• E-mail: ${g('email')}\n• Cidade/Bairro: ${g('cidade')}\n• Tipo de projeto: ${g('tipo')}\n\n${g('msg')}`;
    open(WA + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* ---------- Mentorship multi-step application ---------- */
  const ms = document.getElementById('mentForm');
  if (ms) {
    const steps = [...ms.querySelectorAll('.fstep')];
    const tabs  = [...document.querySelectorAll('.stepper button')];
    let i = 0;
    const show = n => {
      i = Math.max(0, Math.min(n, steps.length - 1));
      steps.forEach((s,k) => s.hidden = k !== i);
      tabs.forEach((t,k) => t.setAttribute('aria-current', k === i ? 'step' : 'false'));
      ms.querySelector('[data-prev]').disabled = i === 0;
      ms.querySelector('[data-next]').hidden = i === steps.length - 1;
      ms.querySelector('[data-send]').hidden = i !== steps.length - 1;
    };
    tabs.forEach((t,k) => t.addEventListener('click', () => show(k)));
    ms.querySelector('[data-next]').addEventListener('click', () => show(i+1));
    ms.querySelector('[data-prev]').addEventListener('click', () => show(i-1));
    ms.addEventListener('submit', ev => {
      ev.preventDefault();
      const f = new FormData(ms), g = k => (f.get(k) || '—');
      const msg = IS_EN
        ? `Hello Adaiane! Mentorship application.\n• Name: ${g('nome')}\n• WhatsApp: ${g('zap')}\n• Email: ${g('email')}\n• City: ${g('cidade')}\n• Time in business: ${g('tempo')}\n• Team: ${g('equipe')}\n• Main challenge: ${g('desafio')}\n• What brought you here: ${g('motivo')}`
        : `Olá Adaiane! Aplicação para a mentoria.\n• Nome: ${g('nome')}\n• WhatsApp: ${g('zap')}\n• E-mail: ${g('email')}\n• Cidade: ${g('cidade')}\n• Tempo de atuação: ${g('tempo')}\n• Equipe: ${g('equipe')}\n• Maior desafio: ${g('desafio')}\n• O que te trouxe até aqui: ${g('motivo')}`;
      open(WA + encodeURIComponent(msg), '_blank', 'noopener');
    });
    show(0);
  }

  /* ---------- LGPD banner — non-essential OFF by default, reject as prominent as accept ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'adaiane_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - (innerWidth > 860 ? 80 : 64),
                 behavior: reduce ? 'auto' : 'smooth' });
    }));
});


/* ---------------------------------------------------------------------
   No confirmed WhatsApp number  [CONFIRM]
   The placeholder above is not a phone number, and a placeholder still
   concatenates into a working wa.me URL - which is how this build ended
   up with a live button pointing at somebody else's line. Until the real
   number is supplied, nothing dials: every WhatsApp control is inert and
   says why when it is clicked. Remove this block once WA_NUMBER is real.
   ------------------------------------------------------------------ */
(function () {
  if (typeof WA_NUMBER !== 'undefined' && WA_NUMBER) return;
  var isEN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var isES = (document.documentElement.lang || '').toLowerCase().indexOf('es') === 0;
  var MSG = isEN
    ? 'No WhatsApp number has been confirmed for this business, so no button '
      + 'on this mockup dials. Supply the number you actually answer and every '
      + 'WhatsApp link here starts working.'
    : (isES
      ? 'No se ha confirmado ningun numero de WhatsApp, asi que ningun boton '
        + 'de esta maqueta marca. Indique el numero que realmente atienden y '
        + 'todos los enlaces de WhatsApp empezaran a funcionar.'
      : 'Nenhum numero de WhatsApp foi confirmado, entao nenhum botao deste '
        + 'mockup disca. Informe o numero que voces realmente atendem e todos '
        + 'os links de WhatsApp passam a funcionar.');
  function neutralise() {
    var sel = 'a[href*="wa.me"], a[href*="api.whatsapp"], a[data-wa], '
            + '.btn--wa, .wa, .wa-float';
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (a) {
      if (a.tagName !== 'A') return;
      a.setAttribute('href', '#');
      a.removeAttribute('target');
      a.setAttribute('aria-disabled', 'true');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        alert(MSG);
      }, true);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(neutralise, 0);
    });
  } else {
    setTimeout(neutralise, 0);
  }
})();

/* ==========================================================================
   ANGELI GLOBAL — script.js (shared by /en/ and /)

   🔴 COMPLIANCE NOTE, DELIBERATE AND LOAD-BEARING:
   There is NO returns calculator in this file and there must never be one.
   The live site's "Simulador Proprietário" outputs 723% ROI, 25% TIR,
   7,20% cap rate and 6,02x vs CDI. Under the CDC, advertising claims must be
   substantiable on demand; unsubstantiated financial projections are
   prohibited. The only credential disclosed by this firm is CRECI/SC 37.050-F,
   a REAL-ESTATE BROKERAGE registration — not a CVM investment-advisor
   authorisation. Scenario modelling, if offered at all, is delivered
   PRIVATELY to an identified client under a signed mandate, with stated
   assumptions and a written disclaimer. Never as a public lead-gen tool.

   Consequently: no [data-count] elements exist on this build either. There is
   no number in the hero and no stat row anywhere on the page, by design.
   ========================================================================== */

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

/* [CONFIRM phone / WhatsApp / email] — none was recoverable from angeliglobal.com.
   Placeholders are intentionally non-dialable and non-deliverable. */
const WA_NUMBER = null;   // [CONFIRM] - was '5547000000000', a placeholder, not a number
const EMAIL     = 'contato@example.com';        // [CONFIRM]

const T = IS_EN ? {
  wa: "Hello Angeli Global. I'd like to request a consultation regarding property in Santa Catarina.",
  subject: 'Consultation request — Angeli Global',
  intro: 'Consultation request submitted from the website.',
  f: { name:'Name', email:'Email', phone:'Phone', juris:'Jurisdiction of residence',
       market:'Market of interest', budget:'Indicative budget band', timeline:'Timeline',
       referral:'How they were referred' }
} : {
  wa: 'Olá, Angeli Global. Gostaria de agendar uma consultoria sobre imóveis em Santa Catarina.',
  subject: 'Pedido de consultoria — Angeli Global',
  intro: 'Pedido de consultoria enviado pelo site.',
  f: { name:'Nome', email:'E-mail', phone:'Telefone', juris:'Jurisdição de residência',
       market:'Mercado de interesse', budget:'Faixa indicativa de investimento', timeline:'Prazo',
       referral:'Como nos conheceu' }
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Contact channels ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(T.wa);
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-email]').forEach(a => {
    a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject);
  });

  /* ---------- Sticky header ---------- */
  const hdr = document.querySelector('.hdr');
  const stick = () => hdr && hdr.classList.toggle('is-stuck', scrollY > 30);
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
        a.style.transitionDelay = open ? `${80 + i*52}ms` : '0ms');
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ---------- Scroll reveal + stagger ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 7) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Hero parallax (transform only) ---------- */
  const hb = document.querySelector('.hero__bg img');
  if (hb && !reduce) {
    let t = false;
    addEventListener('scroll', () => {
      if (t) return; t = true;
      requestAnimationFrame(() => {
        hb.style.transform = `translate3d(0,${Math.min(scrollY, innerHeight) * 0.16}px,0)`;
        t = false;
      });
    }, { passive:true });
  }

  /* ---------- Consultation intake → email (NOT a calculator) ----------
     Highly sensitive: wealth, jurisdiction and investment-intent data.
     The form NEVER collects CPF, passport numbers, bank details or
     source-of-funds documentation. Consent is unticked by default in markup. */
  const f = document.getElementById('consultForm');
  if (f) f.addEventListener('submit', ev => {
    ev.preventDefault();
    const d = new FormData(f), g = k => (d.get(k) || '—');
    const body = [
      T.intro, '',
      `${T.f.name}: ${g('name')}`,
      `${T.f.email}: ${g('email')}`,
      `${T.f.phone}: ${g('phone')}`,
      `${T.f.juris}: ${g('jurisdiction')}`,
      `${T.f.market}: ${g('market')}`,
      `${T.f.budget}: ${g('budget')}`,
      `${T.f.timeline}: ${g('timeline')}`,
      `${T.f.referral}: ${g('referral')}`,
      '', (d.get('notes') || '')
    ].join('\n');
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject) +
                    '&body=' + encodeURIComponent(body);
  });

  /* ---------- Accordions (keyboard-operable) ---------- */
  document.querySelectorAll('[data-acc] > button').forEach(b => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      const p = b.nextElementSibling; if (p) p.hidden = open;
    });
  });

  /* ---------- Cookie consent — LGPD *and* GDPR, non-essential OFF by default,
       reject-all as prominent as accept-all. Analytics must not fire before opt-in. */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'angeli_consent_v1';
    if (!localStorage.getItem(KEY)) setTimeout(() => ck.classList.add('on'), 900);
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 92,
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

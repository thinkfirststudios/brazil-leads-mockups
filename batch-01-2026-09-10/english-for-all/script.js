/* ==========================================================================
   ENGLISH FOR ALL — script.js (shared by / and /en/)

   ⚠ INSTAGRAM-ONLY LEAD, behind a login wall. Nothing about this school is
     verified. This file therefore contains NO teacher name, NO qualification
     (CELTA / TESOL / DELTA / Cambridge examiner status), NO accreditation, NO
     student count, NO success rate, NO review and NO price. Teaching
     qualifications are verifiable and a false claim is seriously damaging.

   ⭐ THE POINT OF THIS FILE is the free level check. The biggest reason people
     do not enrol is that they do not know their own level and are embarrassed
     to guess — nobody walks into a school and announces they are a beginner at
     34. So the check is PRIVATE: no signup, no email gate, no score published,
     nothing stored, nothing sent anywhere. It runs entirely in the browser and
     ends in a pre-filled WhatsApp message the student sends themselves.

   ⚠ PROGRESSIVE ENHANCEMENT, per the brief: the questions ship in the HTML and
     are visible without JS. This script is what turns them into one-at-a-time
     steps. With JS off, the page is a plain readable self-assessment and the
     WhatsApp handoff is still an ordinary link.

   ⛔ No minor's data is ever collected by this site. Enrolment enquiries about
     a young learner capture the RESPONSÁVEL's details only.
   ========================================================================== */

const WA_NUMBER = null;   // [CONFIRM]
const TEL       = null;   // [CONFIRM]

const IS_EN = document.documentElement.lang.toLowerCase().startsWith('en');

const T = IS_EN ? {
  generic: 'Hi! I came from your website and I would like to know more about the classes.',
  trial: 'Hi! I would like to book a free trial class.',
  level: lv => `Hi! I took the level check and the result was ${lv}. I would like to book a free trial class.`,
  course: c => `Hi! I would like to know more about the course: ${c}.`,
  form: d => `Hi!\n• Name: ${d.nome}\n• WhatsApp: ${d.wpp}\n• Course of interest: ${d.curso}\n` +
             `• Preferred time: ${d.horario}\n• Message: ${d.msg}`,
  noNum: '[CONFIRM] No phone or WhatsApp number is readable for English for All — the Instagram profile is ' +
         'behind a login wall and there is no website. This control stays disabled until the real number is ' +
         'confirmed rather than messaging a stranger.',
  needAnswer: 'Please choose an answer to continue.',
  needConsent: 'Please tick the consent box so we can reply to you.',
  resultNote: lv => `Your result: ${lv}. This is indicative only and is confirmed in the trial class.`,
  step: (a, b) => `Question ${a} of ${b}`
} : {
  generic: 'Oi! Vim pelo site e queria saber mais sobre as aulas.',
  trial: 'Oi! Gostaria de agendar uma aula experimental gratuita.',
  level: lv => `Oi! Fiz o teste de nível e o resultado foi ${lv}. Gostaria de agendar uma aula experimental.`,
  course: c => `Oi! Queria saber mais sobre o curso: ${c}.`,
  form: d => `Oi!\n• Nome: ${d.nome}\n• WhatsApp: ${d.wpp}\n• Curso de interesse: ${d.curso}\n` +
             `• Melhor horário: ${d.horario}\n• Mensagem: ${d.msg}`,
  noNum: '[CONFIRM] Nenhum telefone ou WhatsApp da English for All é legível — o perfil do Instagram está atrás ' +
         'de login e não existe site. Este controle fica desativado até o número real ser confirmado, em vez de ' +
         'mandar mensagem para um desconhecido.',
  needAnswer: 'Escolha uma resposta para continuar.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  resultNote: lv => `Seu resultado: ${lv}. É apenas indicativo e é confirmado na aula experimental.`,
  step: (a, b) => `Pergunta ${a} de ${b}`
};

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const waLink = msg => 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  const openWa = msg => {
    if (!WA_NUMBER) { alert(T.noNum); return false; }
    open(waLink(msg), '_blank', 'noopener');
    return true;
  };
  document.querySelectorAll('[data-wa]').forEach(el => {
    const k = el.getAttribute('data-wa');
    el.addEventListener('click', ev => {
      ev.preventDefault();
      openWa(k === 'trial' ? T.trial : (k && k !== 'true') ? T.course(k) : T.generic);
    });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  document.querySelectorAll('[data-tel]').forEach(a => {
    if (TEL) { a.href = 'tel:+55' + TEL; return; }
    a.href = '#'; a.title = T.noNum;
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

  /* ---------- ⭐ THE LEVEL CHECK ----------
     A CEFR self-description ladder rather than a grammar test: "consigo me
     apresentar e falar sobre minha rotina" is a question a nervous adult can
     answer honestly, where "which tense is correct" is a question that makes
     them close the tab. Scoring is the mean of the self-descriptions, rounded
     down — deliberately conservative, so nobody is placed above their comfort.

     Nothing here is stored, sent or logged. The result exists only on screen. */
  const quiz = document.getElementById('levelQuiz');
  if (quiz) {
    const qs   = [...quiz.querySelectorAll('.q')];
    const bar  = quiz.querySelector('.quiz__bar');
    const res  = quiz.querySelector('.result');
    const out  = quiz.querySelector('[data-result-level]');
    const note = quiz.querySelector('[data-result-note]');
    const link = quiz.querySelector('[data-result-wa]');
    const prevB = quiz.querySelector('[data-q="prev"]');
    const nextB = quiz.querySelector('[data-q="next"]');
    const again = quiz.querySelector('[data-q="again"]');
    const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
    let i = 0;

    /* JS is on, so collapse the long list into one question at a time.
       Without JS every .q stays visible and the page still reads correctly. */
    qs.forEach(q => q.classList.remove('on'));

    const render = () => {
      qs.forEach((q, j) => q.classList.toggle('on', j === i));
      if (bar) [...bar.children].forEach((b, j) => b.classList.toggle('done', j <= i));
      if (prevB) prevB.hidden = i === 0;
      if (nextB) nextB.textContent = i === qs.length - 1
        ? (IS_EN ? 'See my level' : 'Ver meu nível')
        : (IS_EN ? 'Next' : 'Próxima');
      const h = qs[i].querySelector('h3');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll:true }); }
    };

    const answered = j => quiz.querySelector(`input[name="q${j + 1}"]:checked`);

    const finish = () => {
      const vals = qs.map((_q, j) => parseInt(answered(j)?.value || '0', 10));
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const lv = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, Math.floor(mean)))];
      qs.forEach(q => q.classList.remove('on'));
      if (bar) bar.hidden = true;
      if (prevB) prevB.hidden = true;
      if (nextB) nextB.hidden = true;
      if (res) res.classList.add('on');
      if (out) out.textContent = lv;
      if (note) note.textContent = T.resultNote(lv);
      if (link) {
        if (WA_NUMBER) { link.href = waLink(T.level(lv)); link.removeAttribute('data-unconfirmed'); }
        else { link.setAttribute('data-unconfirmed', 'true'); link.title = T.noNum; }
        link.onclick = ev => { if (!WA_NUMBER) { ev.preventDefault(); alert(T.noNum); } };
      }
      res?.scrollIntoView({ block:'nearest', behavior: reduce ? 'auto' : 'smooth' });
    };

    nextB?.addEventListener('click', () => {
      if (!answered(i)) { alert(T.needAnswer); return; }
      if (i === qs.length - 1) { finish(); return; }
      i++; render();
    });
    prevB?.addEventListener('click', () => { i = Math.max(0, i - 1); render(); });
    again?.addEventListener('click', () => {
      quiz.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
      if (bar) bar.hidden = false;
      if (nextB) nextB.hidden = false;
      res?.classList.remove('on');
      i = 0; render();
    });
    render();
  }

  /* ---------- Enquiry form ----------
     ⛔ Collects the enquirer's own details only. If the enquiry is about a
     young learner, it is the RESPONSÁVEL who writes — no child name, age,
     school or photograph is ever requested by this site. */
  const cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!cf.querySelector('#consent')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(cf), g = k => (f.get(k) || '—');
    openWa(T.form({ nome:g('nome'), wpp:g('wpp'), curso:g('curso'), horario:g('horario'), msg:g('msg') }));
  });

  /* ---------- Scroll reveals ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 85}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Deliberately finds nothing. Lingua's "5,000+ students already learning"
     capsule is exactly the kind of figure this build refuses to invent — no
     student count, no years teaching, no success rate, no rating. */
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

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'efa_lgpd_v1';
    const applyConsent = p => {
      if (!p) return;
      /* ⚠ If the school teaches minors, pages aimed at young learners carry NO
         behavioural tracking at all, regardless of what is consented here. */
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 82, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

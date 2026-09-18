/* ==========================================================================
   COSTÃO DO SANTINHO RESORT — script.js (shared by /, /en/ and /es/)

   Language-aware from <html lang> so ONE engine serves all three real URL
   trees. Nothing here swaps text in the DOM — the trees are separate pages.

   ⚠ WHAT THIS FILE DOES NOT DO, and why:
     · It performs NO availability lookup. The resort runs a contracted booking
       engine / channel manager [CONFIRM which], and this mockup is a front-end
       and conversion layer that WRAPS that engine — not a replacement for it.
       Submitting the widget composes a WhatsApp message with the dates in DD/MM.
     · It shows NO rate. None were published on the fetched pages.
     · It shows NO star rating, review score, award or occupancy statistic.
       None were sourced, so none exist here.
   ========================================================================== */

/* Their own published number. 0800 is not WhatsApp-dialable, so the WhatsApp
   control stays visibly unconfirmed until a real mobile is supplied. */
const TEL_0800  = '0800 048 1000';   // published in their own footer
const WA_NUMBER = null;              // [CONFIRM] — 0800 048 1000 is not a WhatsApp line

const LANG = (document.documentElement.lang || 'pt-BR').toLowerCase();
const IS_EN = LANG.startsWith('en');
const IS_ES = LANG.startsWith('es');

const T = IS_EN ? {
  generic: 'Hello! I came from your website and I would like information about a stay at Costão do Santinho.',
  stay: q => `Hello! I would like to check availability at Costão do Santinho.\n• Check-in: ${q.i}\n• Check-out: ${q.o}\n` +
             `• Adults: ${q.a}\n• Children: ${q.c}${q.ages ? ' (ages: ' + q.ages + ')' : ''}\n• Rooms: ${q.r}` +
             (q.code ? `\n• Code: ${q.code}` : ''),
  event: d => `Hello! I would like a quote for an event at Costão do Santinho.\n• Name: ${d.nome}\n• Company: ${d.empresa}\n` +
              `• Expected date: ${d.data}\n• Attendees: ${d.pax}\n• WhatsApp: ${d.wpp}`,
  noNum: '[CONFIRM] The only published number is 0800 048 1000, which is not a WhatsApp line. This control stays ' +
         'disabled until a real WhatsApp number is supplied — a placeholder could reach a stranger.',
  needDates: 'Please choose a check-in and a check-out date.',
  needConsent: 'Please tick the consent box so we may reply to you.',
  nights: n => n === 1 ? '1 night' : n + ' nights',
  showing: (n, t) => `Showing ${n} of ${t}`
} : IS_ES ? {
  generic: '¡Hola! Vengo del sitio web y quisiera información sobre una estancia en Costão do Santinho.',
  stay: q => `¡Hola! Quisiera consultar disponibilidad en Costão do Santinho.\n• Entrada: ${q.i}\n• Salida: ${q.o}\n` +
             `• Adultos: ${q.a}\n• Niños: ${q.c}${q.ages ? ' (edades: ' + q.ages + ')' : ''}\n• Habitaciones: ${q.r}` +
             (q.code ? `\n• Código: ${q.code}` : ''),
  event: d => `¡Hola! Quisiera un presupuesto para un evento en Costão do Santinho.\n• Nombre: ${d.nome}\n• Empresa: ${d.empresa}\n` +
              `• Fecha prevista: ${d.data}\n• Participantes: ${d.pax}\n• WhatsApp: ${d.wpp}`,
  noNum: '[CONFIRM] El único número publicado es 0800 048 1000, que no es una línea de WhatsApp. Este control queda ' +
         'desactivado hasta que se confirme un número real de WhatsApp.',
  needDates: 'Elija la fecha de entrada y la de salida.',
  needConsent: 'Marque la casilla de consentimiento para que podamos responder.',
  nights: n => n === 1 ? '1 noche' : n + ' noches',
  showing: (n, t) => `Mostrando ${n} de ${t}`
} : {
  generic: 'Olá! Vim pelo site e gostaria de informações sobre uma hospedagem no Costão do Santinho.',
  stay: q => `Olá! Gostaria de verificar disponibilidade no Costão do Santinho.\n• Chegada: ${q.i}\n• Saída: ${q.o}\n` +
             `• Adultos: ${q.a}\n• Crianças: ${q.c}${q.ages ? ' (idades: ' + q.ages + ')' : ''}\n• Quartos: ${q.r}` +
             (q.code ? `\n• Código: ${q.code}` : ''),
  event: d => `Olá! Gostaria de um orçamento para evento no Costão do Santinho.\n• Nome: ${d.nome}\n• Empresa: ${d.empresa}\n` +
              `• Data prevista: ${d.data}\n• Nº de participantes: ${d.pax}\n• WhatsApp: ${d.wpp}`,
  noNum: '[CONFIRM] O único número publicado é 0800 048 1000, que não é uma linha de WhatsApp. Este controle fica ' +
         'desativado até um número real de WhatsApp ser confirmado — um placeholder poderia ligar para um desconhecido.',
  needDates: 'Escolha a data de chegada e a de saída.',
  needConsent: 'Marque a caixa de consentimento para podermos responder.',
  nights: n => n === 1 ? '1 noite' : n + ' noites',
  showing: (n, t) => `Exibindo ${n} de ${t}`
};

/* DD/MM everywhere, on every tree — never MM/DD, even on /en/. */
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
    el.addEventListener('click', ev => { ev.preventDefault(); openWa(T.generic); });
    if (!WA_NUMBER) { el.setAttribute('data-unconfirmed', 'true'); el.title = T.noNum; }
  });
  /* the 0800 IS real and IS published by them, so it dials for real */
  document.querySelectorAll('[data-tel]').forEach(el => {
    el.href = 'tel:' + TEL_0800.replace(/\s/g, '');
  });

  /* ---------- Sticky nav ---------- */
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

  /* ---------- Hero parallax ---------- */
  const hbg = document.querySelector('.hero__bg');
  if (hbg && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        hbg.style.transform = `translate3d(0,${Math.min(scrollY, 1000) * 0.15}px,0)`;
        tick = false;
      });
    }, { passive:true });
  }

  /* ---------- ⭐ Availability widget ----------
     Child AGES are collected because their own suite matrix is expressed in
     adults / crianças / bebê — a child's age changes which suite fits.
     ⚠ Still no lookup: it composes the message their team already answers. */
  const av = document.getElementById('availForm');
  if (av) {
    const kids = av.querySelector('#criancas');
    const ages = av.querySelector('.ages');
    const chip = document.querySelector('.datechip');

    const renderAges = () => {
      if (!ages || !kids) return;
      const n = parseInt(kids.value, 10) || 0;
      ages.innerHTML = '';
      for (let k = 1; k <= n; k++) {
        const lbl = IS_EN ? `Child ${k} — age` : IS_ES ? `Niño ${k} — edad` : `Criança ${k} — idade`;
        ages.insertAdjacentHTML('beforeend',
          `<div class="field"><label for="idade${k}">${lbl}</label>` +
          `<input type="number" id="idade${k}" name="idade${k}" min="0" max="17" inputmode="numeric"></div>`);
      }
      ages.classList.toggle('on', n > 0);
    };
    kids?.addEventListener('change', renderAges);
    renderAges();

    /* mini date-summary chip in the condensed header, once touched */
    const summarise = () => {
      if (!chip) return;
      const i = av.querySelector('#chegada').value, o = av.querySelector('#saida').value;
      if (!i || !o) return;
      const n = Math.max(1, Math.round((new Date(o) - new Date(i)) / 86400000));
      chip.textContent = `${ddmm(i)} – ${ddmm(o)} · ${T.nights(n)}`;
      chip.classList.add('on');
    };
    av.addEventListener('change', summarise);

    av.addEventListener('submit', ev => {
      ev.preventDefault();
      const f = new FormData(av);
      const i = f.get('chegada'), o = f.get('saida');
      if (!i || !o) { alert(T.needDates); return; }
      const n = parseInt(f.get('criancas'), 10) || 0;
      const list = [];
      for (let k = 1; k <= n; k++) list.push(f.get('idade' + k) || '—');
      openWa(T.stay({
        i: ddmm(i), o: ddmm(o),
        a: f.get('adultos') || '—', c: f.get('criancas') || '0',
        ages: list.join(', '), r: f.get('quartos') || '1', code: f.get('codigo') || ''
      }));
    });
  }

  /* ---------- Tabs: Hotel Internacional | Vilas Portuguesas ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const btns = [...group.querySelectorAll('[role="tab"]')];
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => {
        const on = x === b;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(x.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }));
    /* full keyboard operation of the tablist */
    group.addEventListener('keydown', ev => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (ev.key === 'ArrowRight') j = (i + 1) % btns.length;
      if (ev.key === 'ArrowLeft')  j = (i - 1 + btns.length) % btns.length;
      if (ev.key === 'Home') j = 0;
      if (ev.key === 'End')  j = btns.length - 1;
      if (j === null) return;
      ev.preventDefault(); btns[j].focus(); btns[j].click();
    });
  });

  /* ---------- Filterable directories (outlets, structures) ---------- */
  document.querySelectorAll('[data-filter]').forEach(bar => {
    const target = document.getElementById(bar.dataset.filter);
    if (!target) return;
    const items = [...target.querySelectorAll('[data-kind]')];
    const out = document.getElementById(bar.dataset.count || '');
    const apply = key => {
      let n = 0;
      items.forEach(it => {
        const show = key === 'all' || it.dataset.kind.split(' ').includes(key);
        it.hidden = !show;
        if (show) n++;
      });
      if (out) out.textContent = T.showing(n, items.length);
    };
    bar.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      bar.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      apply(b.dataset.k);
    }));
    apply('all');
  });

  /* ---------- Carousels ---------- */
  document.querySelectorAll('.carou').forEach(c => {
    const track = c.querySelector('.track');
    if (!track) return;
    const step = () => (track.querySelector('.card')?.offsetWidth || 340) + 22;
    c.querySelector('[data-carou="prev"]')?.addEventListener('click',
      () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    c.querySelector('[data-carou="next"]')?.addEventListener('click',
      () => track.scrollBy({ left:  step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  /* ---------- Scroll reveals with row stagger ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 95}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- Count-up ----------
     ⚠ Only counts figures the resort PUBLISHES ITSELF (its own counts of
     restaurants, structures, suite categories). No review score, no star
     rating, no guest count, no "years in business" — none were sourced. */
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

  /* ---------- Events lead-capture form ---------- */
  const ef = document.getElementById('eventForm');
  if (ef) ef.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!ef.querySelector('#consentEv')?.checked) { alert(T.needConsent); return; }
    const f = new FormData(ef), g = k => (f.get(k) || '—');
    openWa(T.event({ nome:g('nome'), empresa:g('empresa'), data:g('data'), pax:g('pax'), wpp:g('wpp') }));
  });

  /* ---------- LGPD ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'costao_lgpd_v1';
    const applyConsent = p => {
      if (!p) return;
      if (p.analytics) { /* analytics tags injected ONLY inside this branch */ }
      if (p.marketing) { /* marketing/remarketing tags injected ONLY inside this branch */ }
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 88, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

/* ==========================================================================
   AREIAS CAMPECHE — script.js (shared by /, /en/ and /es/)

   ⭐ The court availability grid is the whole point of this build. It is a REAL
   <table> with proper row/column headers, every cell keyboard-reachable, and
   every state announced in TEXT as well as colour (WCAG: state is never
   conveyed by colour alone).

   It does NOT fake a payment or a confirmed reservation. Tapping a free slot
   composes a WhatsApp message naming the exact court, sport, date and hour —
   because that is how this business actually takes bookings, and pretending
   otherwise breaks the handoff.

   ⚠ EVERY SLOT SHIPS AS [CONFIRM]. The structure ships; invented availability
   does not. SLOTS below is empty on purpose — paste the venue's real weekly
   pattern in and the grid fills itself.
   ========================================================================== */

/* ⚠ [CONFIRM WhatsApp] — NOTHING was captured for this lead. No phone, no
   email, no address. This is the first thing to obtain: the entire conversion
   path depends on it. The placeholder is intentionally non-dialable. */
const WA_NUMBER = null;                       // [CONFIRM]

const LANG = (document.documentElement.lang || 'pt').slice(0, 2).toLowerCase();

const T = {
  pt: {
    days:['dom','seg','ter','qua','qui','sex','sáb'],
    free:'Livre', booked:'Reservado', fixed:'Horário fixo', lesson:'Aula',
    freeA:'livre — toque para reservar', bookedA:'reservado, indisponível',
    fixedA:'horário fixo, indisponível', lessonA:'aula/turma — ver aulas',
    caption:'Grade semanal de quadras. Cada célula mostra o estado do horário em texto, não só em cor. ' +
            'Toque numa célula livre para compor uma mensagem de WhatsApp com a quadra, o esporte, a data e a hora.',
    weekOf:'Semana de',
    msg:(c,s,d,h)=>`Olá! Vim pelo site e quero reservar a ${c} para ${s} em ${d} às ${h}.`,
    generic:'Olá! Vim pelo site e quero reservar uma quadra.',
    noNumber:'[CONFIRM] O WhatsApp da Areias Campeche ainda não foi obtido — nenhum número foi capturado para este lead. ' +
             'Este botão fica inativo de propósito até o número real ser confirmado.',
    unconfirmed:'[CONFIRM — grade a confirmar]'
  },
  en: {
    days:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    free:'Free', booked:'Booked', fixed:'Fixed slot', lesson:'Lesson',
    freeA:'free — tap to book', bookedA:'booked, unavailable',
    fixedA:'fixed weekly slot, unavailable', lessonA:'lesson/class — see lessons',
    caption:'Weekly court grid. Every cell states its status in text, not only in colour. ' +
            'Tap a free cell to compose a WhatsApp message naming the court, sport, date and hour.',
    weekOf:'Week of',
    msg:(c,s,d,h)=>`Hello! I came from the website and I'd like to book ${c} for ${s} on ${d} at ${h}.`,
    generic:"Hello! I came from the website and I'd like to book a court.",
    noNumber:'[CONFIRM] Areias Campeche’s WhatsApp number has not been obtained — nothing was captured for this lead. ' +
             'This button is intentionally inert until the real number is confirmed.',
    unconfirmed:'[CONFIRM — schedule to be confirmed]'
  },
  es: {
    days:['dom','lun','mar','mié','jue','vie','sáb'],
    free:'Libre', booked:'Reservado', fixed:'Horario fijo', lesson:'Clase',
    freeA:'libre — toca para reservar', bookedA:'reservado, no disponible',
    fixedA:'horario fijo, no disponible', lessonA:'clase — ver clases',
    caption:'Grilla semanal de canchas. Cada celda indica su estado en texto, no solo con color. ' +
            'Toca una celda libre para redactar un mensaje de WhatsApp con la cancha, el deporte, la fecha y la hora.',
    weekOf:'Semana del',
    msg:(c,s,d,h)=>`¡Hola! Vengo desde la web y quiero reservar la ${c} para ${s} el ${d} a las ${h}.`,
    generic:'¡Hola! Vengo desde la web y quiero reservar una cancha.',
    noNumber:'[CONFIRM] Aún no se obtuvo el WhatsApp de Areias Campeche — no se capturó ningún número para este lead. ' +
             'Este botón queda inactivo a propósito hasta confirmar el número real.',
    unconfirmed:'[CONFIRM — grilla por confirmar]'
  }
}[LANG] || null;

const L = T || {
  days:['dom','seg','ter','qua','qui','sex','sáb'], free:'Livre', booked:'Reservado',
  fixed:'Horário fixo', lesson:'Aula', freeA:'livre', bookedA:'reservado', fixedA:'horário fixo',
  lessonA:'aula', caption:'', weekOf:'Semana de',
  msg:(c,s,d,h)=>`${c} ${s} ${d} ${h}`, generic:'', noNumber:'[CONFIRM]', unconfirmed:'[CONFIRM]'
};

/* --------------------------------------------------------------------------
   ⬇⬇ REAL AVAILABILITY GOES HERE ⬇⬇
   Shape: { court:1, sport:'beach-tennis', day:4, hour:18, state:'reservado' }
   day: 0 = Sunday … 6 = Saturday   ·   state: 'reservado' | 'fixo' | 'aula'
   Anything not listed renders as UNCONFIRMED, not as free — we do not invent
   availability. Once the venue supplies its real pattern, unlisted slots can
   flip to 'livre' by setting HAS_REAL_DATA to true.
-------------------------------------------------------------------------- */
const SLOTS = [];                 // [CONFIRM — nothing supplied yet]
const HAS_REAL_DATA = false;      // [CONFIRM] flip to true once SLOTS is real

/* Court list and opening hours are also unconfirmed. These are STRUCTURE, not claims. */
const COURTS = [1, 2, 3];         // [CONFIRM number of courts]
const HOURS  = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];  // [CONFIRM opening hours]
const SPORTS = [
  { id:'beach-tennis', pt:'Beach tennis', en:'Beach tennis', es:'Beach tennis' },
  { id:'futevolei',    pt:'Futevôlei',    en:'Footvolley',   es:'Futvóley' },
  { id:'volei',        pt:'Vôlei de praia', en:'Beach volleyball', es:'Vóley playa' }
];

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp wiring ---------- */
  const openWa = msg => {
    if (!WA_NUMBER) { alert(L.noNumber); return; }
    open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  };
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.addEventListener('click', ev => { ev.preventDefault(); openWa(L.generic); });
    if (!WA_NUMBER) { a.setAttribute('data-unconfirmed', 'true'); a.title = L.noNumber; }
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
    });
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mnav.classList.remove('on'); burger.classList.remove('on'); document.body.style.overflow = '';
    }));
  }

  /* ================= THE GRID ================= */
  const host = document.getElementById('courtGrid');
  if (host) {
    let weekOffset = 0;
    let fSport = 'all', fCourt = 'all';

    const monday = off => {
      const d = new Date(); d.setHours(0,0,0,0);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + off * 7);
      return d;
    };
    const dd = d => String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0');

    const sportName = id => {
      const s = SPORTS.find(x => x.id === id);
      return s ? (s[LANG] || s.pt) : id;
    };

    const stateFor = (court, day, hour) => {
      const hit = SLOTS.find(s => s.court === court && s.day === day && s.hour === hour &&
                                  (fSport === 'all' || s.sport === fSport));
      if (hit) return hit.state;
      return HAS_REAL_DATA ? 'livre' : 'cfm';
    };

    const render = () => {
      const start = monday(weekOffset);
      const days = [...Array(7)].map((_, i) => {
        const d = new Date(start); d.setDate(start.getDate() + i); return d;
      });
      const courts = fCourt === 'all' ? COURTS : [Number(fCourt)];

      const wl = document.querySelector('.weeklabel');
      if (wl) wl.textContent = `${L.weekOf} ${dd(days[0])} – ${dd(days[6])}`;

      let html = `<table class="grid"><caption>${L.caption}</caption><thead><tr>` +
        `<th scope="col">${LANG === 'en' ? 'Hour' : LANG === 'es' ? 'Hora' : 'Hora'}</th>` +
        days.map(d => `<th scope="col">${L.days[d.getDay()]}<span>${dd(d)}</span></th>`).join('') +
        `</tr></thead><tbody>`;

      HOURS.forEach(h => {
        html += `<tr><th scope="row">${String(h).padStart(2,'0')}h</th>`;
        days.forEach(d => {
          html += '<td>';
          courts.forEach(c => {
            const st = stateFor(c, d.getDay(), h);
            const courtLabel = (LANG === 'en' ? 'Court ' : LANG === 'es' ? 'Cancha ' : 'Quadra ') + c;
            if (st === 'cfm') {
              html += `<div class="cell cell--reservado" role="note" ` +
                      `aria-label="${courtLabel}, ${dd(d)} ${h}h — ${L.unconfirmed}">` +
                      `${L.unconfirmed}<small>${courtLabel}</small></div>`;
            } else if (st === 'livre') {
              html += `<button class="cell cell--livre" type="button" ` +
                      `data-court="${c}" data-date="${dd(d)}" data-hour="${h}" ` +
                      `aria-label="${courtLabel}, ${dd(d)} ${h}h — ${L.freeA}">` +
                      `${L.free}<small>${courtLabel}</small></button>`;
            } else if (st === 'aula') {
              html += `<a class="cell cell--aula" href="#aulas" ` +
                      `aria-label="${courtLabel}, ${dd(d)} ${h}h — ${L.lessonA}">` +
                      `${L.lesson}<small>${courtLabel}</small></a>`;
            } else if (st === 'fixo') {
              html += `<div class="cell cell--fixo" role="note" ` +
                      `aria-label="${courtLabel}, ${dd(d)} ${h}h — ${L.fixedA}">` +
                      `${L.fixed}<small>${courtLabel}</small></div>`;
            } else {
              html += `<div class="cell cell--reservado" role="note" ` +
                      `aria-label="${courtLabel}, ${dd(d)} ${h}h — ${L.bookedA}">` +
                      `${L.booked}<small>${courtLabel}</small></div>`;
            }
          });
          html += '</td>';
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      host.innerHTML = html;

      /* fast stagger on load — disabled under prefers-reduced-motion */
      const cells = host.querySelectorAll('.cell');
      if (reduce) cells.forEach(c => c.classList.add('in'));
      else cells.forEach((c, i) => setTimeout(() => c.classList.add('in'), Math.min(i * 6, 500)));

      /* tapping a free cell composes the WhatsApp message */
      host.querySelectorAll('.cell--livre').forEach(b => b.addEventListener('click', () => {
        const courtLabel = (LANG === 'en' ? 'Court ' : LANG === 'es' ? 'Cancha ' : 'Quadra ') + b.dataset.court;
        openWa(L.msg(courtLabel, sportName(fSport === 'all' ? 'beach-tennis' : fSport),
                     b.dataset.date, b.dataset.hour + 'h'));
      }));
    };

    document.getElementById('fSport')?.addEventListener('change', e => { fSport = e.target.value; render(); });
    document.getElementById('fCourt')?.addEventListener('change', e => { fCourt = e.target.value; render(); });
    document.querySelector('[data-week="prev"]')?.addEventListener('click', () => { weekOffset--; render(); });
    document.querySelector('[data-week="next"]')?.addEventListener('click', () => { weekOffset++; render(); });

    /* teaser chips scroll to the grid, pre-filtered */
    document.querySelectorAll('[data-jump]').forEach(c => c.addEventListener('click', () => {
      const s = c.getAttribute('data-jump');
      if (s && s !== 'all') { fSport = s; const sel = document.getElementById('fSport'); if (sel) sel.value = s; render(); }
      document.getElementById('grade')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }));

    render();
  }

  /* ---------- Scroll reveal ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = [...(e.target.parentElement?.children || [])].filter(c => c.hasAttribute('data-rv'));
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 80}ms`;
    e.target.classList.add('in'); rv.unobserve(e.target);
  }), { threshold:.1, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => rv.observe(el));

  /* ---------- LGPD consent sheet — nothing pre-ticked, reject as easy as accept ---------- */
  const ck = document.querySelector('.ck');
  if (ck) {
    const KEY = 'areias_lgpd_v1';
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
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 78, behavior: reduce ? 'auto' : 'smooth' });
    }));
});

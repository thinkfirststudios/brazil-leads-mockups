/* ===================================================================
   To na Arara Brecho - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). Runs off
   file:// so the prospect can double-click index.html.

   INSTAGRAM-ONLY LEAD, AND THAT CHANGES WHAT THIS FILE MAY DO.
   There is no website to read from and the Instagram profile is
   behind a login wall. The phone number, the address and the opening
   hours all come from SECONDARY sources, not from the business. So:

   - WA_NUMBER is null. The reported (48) 98466-9105 is not dialled
     from a mockup, because a wa.me link to an unverified number
     either reaches a stranger or fails in the prospect's face.

   - The "aberto agora" status is NOT computed. Reported hours are
     not confirmed hours, and a live open/closed badge computed from
     a secondary source is exactly the kind of small confident lie
     that costs a shop a customer who drove to Morro das Pedras.
     The widget renders, and it says what it is waiting for.

   NO PIECE, PRICE, SIZE, MEASUREMENT, BRAND OR CONDITION GRADE IS
   GENERATED HERE. The rail is structure. Every tag is a labelled
   placeholder, because a stock photograph beside a piece number and
   a price reads as an item for sale and someone will try to buy it.
   =================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = null;                  /* [CONFIRM] reported: 5548984669105 */
  var WA_REPORTED = '(48) 98466-9105';   /* secondary source, unverified */

  var EN = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
  function t(pt, en) { return EN ? en : pt; }

  var reduced = false;
  try {
    reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { reduced = false; }

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* ---------- contacts ---------------------------------------- */
  function noNumber() {
    window.alert(t(
      'MOCKUP: este lead e so Instagram. O numero ' + WA_REPORTED + ' aparece em fonte secundaria, nao no perfil, e nao foi verificado com a loja. Nenhum wa.me e montado ate a confirmacao por escrito - um link para um numero errado ou cai em cima de um estranho ou falha na frente do cliente. [CONFIRM o numero de WhatsApp da loja.]',
      'MOCKUP: this lead is Instagram-only. The number ' + WA_REPORTED + ' comes from a secondary source, not from the profile, and has not been verified with the shop. No wa.me link is built until it is confirmed in writing - a link to a wrong number either reaches a stranger or fails in front of the customer. [CONFIRM the shop\u0027s WhatsApp number.]'
    ));
  }

  function wireContacts() {
    var els = document.querySelectorAll('[data-wa]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (WA_NUMBER) {
        var msg = el.getAttribute('data-wa') ||
          t('Ola! Vim pelo site da To na Arara.',
            'Hi! I came from the To na Arara website.');
        el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
        el.removeAttribute('data-unconfirmed');
      } else {
        el.setAttribute('href', '#');
        el.setAttribute('data-unconfirmed', '');
        el.setAttribute('aria-describedby', 'wa-unconfirmed-note');
        el.addEventListener('click', function (ev) { ev.preventDefault(); noNumber(); });
      }
    }
  }

  /* ---------- opening status: deliberately not computed ------- */
  function openStatus() {
    var els = document.querySelectorAll('[data-status]');
    for (var i = 0; i < els.length; i++) {
      els[i].innerHTML = t(
        '<span class="dot" aria-hidden="true"></span>Hor&aacute;rio <span class="cfm">[CONFIRM]</span>',
        '<span class="dot" aria-hidden="true"></span>Hours <span class="cfm">[CONFIRM]</span>'
      );
      els[i].setAttribute('title', t(
        'O horario reportado vem de fonte secundaria e nao foi confirmado, entao o status aberto/fechado nao e calculado aqui.',
        'The reported hours come from a secondary source and are unconfirmed, so no open/closed status is computed here.'
      ));
    }
  }

  /* ---------- sticky header ----------------------------------- */
  function header() {
    var head = document.querySelector('.site-head');
    if (!head) { return; }
    var ticking = false;
    function apply() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 24) { head.classList.add('solid'); } else { head.classList.remove('solid'); }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  /* ---------- mobile menu ------------------------------------- */
  function menu() {
    var burger = document.querySelector('.burger');
    var panel = document.querySelector('.mobile-nav');
    if (!burger || !panel) { return; }
    function close() {
      panel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    var links = panel.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) { links[i].addEventListener('click', close); }
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && panel.classList.contains('open')) { close(); burger.focus(); }
    });
  }

  /* ---------- reveals ----------------------------------------- */
  function reveals() {
    var items = document.querySelectorAll('.rev');
    if (!items.length) { return; }
    if (reduced || !('IntersectionObserver' in window)) {
      for (var k = 0; k < items.length; k++) { items[k].classList.add('in'); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (!e.isIntersecting) { continue; }
        var el = e.target, idx = 0, sib = el.previousElementSibling;
        while (sib) {
          if (sib.classList && sib.classList.contains('rev')) { idx++; }
          sib = sib.previousElementSibling;
        }
        el.style.transitionDelay = Math.min(idx, 6) * 95 + 'ms';
        el.classList.add('in');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < items.length; j++) { io.observe(items[j]); }
  }

  /* ---------- the rail -----------------------------------------
     Fully keyboard-operable: the rail is a focusable region with
     arrow-key navigation, Home and End, and there is a vertical
     fallback list below for anyone who cannot drag at all. Pointer
     drag is an addition, never the only way in.
     ----------------------------------------------------------- */
  function rails() {
    var wraps = document.querySelectorAll('.railwrap');
    for (var w = 0; w < wraps.length; w++) {
      (function (wrap) {
        var rail = wrap.querySelector('.rail');
        if (!rail) { return; }
        var prev = wrap.querySelector('[data-rail="prev"]');
        var next = wrap.querySelector('[data-rail="next"]');

        function step() {
          var first = rail.querySelector('.tag');
          return first ? first.offsetWidth + 16 : 240;
        }
        function scrollBy(dir) {
          rail.scrollBy({ left: dir * step(),
                          behavior: reduced ? 'auto' : 'smooth' });
        }
        if (prev) { prev.addEventListener('click', function () { scrollBy(-1); }); }
        if (next) { next.addEventListener('click', function () { scrollBy(1); }); }

        rail.addEventListener('keydown', function (ev) {
          if (ev.key === 'ArrowRight') { ev.preventDefault(); scrollBy(1); }
          else if (ev.key === 'ArrowLeft') { ev.preventDefault(); scrollBy(-1); }
          else if (ev.key === 'Home') { ev.preventDefault(); rail.scrollTo({ left: 0 }); }
          else if (ev.key === 'End') {
            ev.preventDefault(); rail.scrollTo({ left: rail.scrollWidth });
          }
        });

        /* pointer drag, as an addition */
        var down = false, startX = 0, startL = 0;
        rail.addEventListener('pointerdown', function (ev) {
          if (ev.pointerType === 'mouse' && ev.button !== 0) { return; }
          down = true; startX = ev.clientX; startL = rail.scrollLeft;
        });
        rail.addEventListener('pointermove', function (ev) {
          if (!down) { return; }
          rail.scrollLeft = startL - (ev.clientX - startX);
        });
        function up() { down = false; }
        rail.addEventListener('pointerup', up);
        rail.addEventListener('pointercancel', up);
        rail.addEventListener('pointerleave', up);
      }(wraps[w]));
    }
  }

  /* ---------- garimpo filters ---------------------------------
     Size first, then condition - because in a shop with one of
     everything, "what fits me" is the only filter that reliably
     returns a useful result. Sold pieces stay visible by default:
     a rail of sold pieces is the best scarcity argument the
     business owns and every brecho throws it away.
     ----------------------------------------------------------- */
  function filters() {
    var box = document.querySelector('.filters');
    var grid = document.querySelector('.railfall.garimpo');
    if (!box || !grid) { return; }
    var status = document.getElementById('grid-status');
    var btns = box.querySelectorAll('button[data-kind]');
    var soldToggle = document.getElementById('show-sold');
    var cards = grid.querySelectorAll('.tag');
    var active = { size: 'all', cond: 'all', cat: 'all' };

    function apply() {
      var shown = 0, i;
      var showSold = !soldToggle || soldToggle.checked;
      for (i = 0; i < cards.length; i++) {
        var c = cards[i];
        var ok = true;
        for (var k in active) {
          if (!active.hasOwnProperty(k)) { continue; }
          if (active[k] !== 'all' && c.getAttribute('data-' + k) !== active[k]) { ok = false; }
        }
        if (!showSold && c.getAttribute('data-state') === 'sold') { ok = false; }
        c.hidden = !ok;
        if (ok) { shown++; }
      }
      for (i = 0; i < btns.length; i++) {
        var bk = btns[i].getAttribute('data-kind');
        var bv = btns[i].getAttribute('data-val');
        btns[i].setAttribute('aria-pressed', active[bk] === bv ? 'true' : 'false');
      }
      if (status) {
        status.textContent = shown + t(' pe&ccedil;a(s) em exibi&ccedil;&atilde;o.', ' piece(s) shown.')
          .replace(/&ccedil;/g, 'c').replace(/&atilde;/g, 'a');
      }
    }

    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        active[this.getAttribute('data-kind')] = this.getAttribute('data-val');
        apply();
      });
    }
    if (soldToggle) { soldToggle.addEventListener('change', apply); }
    apply();
  }

  /* ---------- the drop notification list ----------------------
     The most sensitive consent on this build. A WhatsApp broadcast
     list needs explicit, separable, revocable consent with an easy
     opt-out, and it must NEVER be assembled from people who merely
     messaged about a piece. Its own form, its own tick, unticked.
     ----------------------------------------------------------- */
  function dropList() {
    var form = document.getElementById('drop-list');
    if (!form) { return; }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var who = form.elements['contato'];
      var consent = form.elements['consent'];
      if (who && !who.value.trim()) {
        who.setAttribute('aria-invalid', 'true');
        if (status) {
          status.textContent = t('Informe um WhatsApp ou e-mail.',
                                 'Please enter a WhatsApp number or email.');
        }
        if (who.focus) { who.focus(); }
        return;
      }
      if (who) { who.removeAttribute('aria-invalid'); }
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao antes de enviar.',
                                 'Please tick the permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      if (status) {
        status.textContent = t(
          'MOCKUP: nada foi enviado e nenhuma lista existe ainda. No site publicado este consentimento fica separado de qualquer conversa sobre uma peca, e sai da lista com uma palavra.',
          'MOCKUP: nothing was sent and no list exists yet. On the published site this consent stays separate from any conversation about a piece, and one word takes you off the list.'
        );
      }
    });
  }

  /* ---------- consignment enquiry ------------------------------ */
  function consign() {
    var form = document.getElementById('consignar');
    if (!form) { return; }
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nome = form.elements['nome'];
      var consent = form.elements['consent'];
      if (nome && !nome.value.trim()) {
        nome.setAttribute('aria-invalid', 'true');
        if (status) { status.textContent = t('Diz teu nome, por favor.', 'Please enter your name.'); }
        if (nome.focus) { nome.focus(); }
        return;
      }
      if (nome) { nome.removeAttribute('aria-invalid'); }
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao antes de enviar.',
                                 'Please tick the permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      if (status) {
        status.textContent = t(
          'MOCKUP: este formulario nao envia, e os termos de consignacao ainda nao foram confirmados. No site publicado ele abriria o WhatsApp com as fotos das pecas.',
          'MOCKUP: this form does not send, and the consignment terms have not been confirmed yet. On the published site it would open WhatsApp with photographs of the pieces.'
        );
      }
    });
  }

  /* ---------- LGPD -------------------------------------------- */
  var STORE = 'arara_lgpd_v1';

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(STORE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveConsent(obj) {
    try { window.localStorage.setItem(STORE, JSON.stringify(obj)); } catch (e) {}
  }

  function applyConsent(c) {
    if (c && c.analytics) {
      /* Analytics would load here and only here. Nothing fires in
         this mockup. Prefer a cookieless, self-hosted tool. */
    }
    if (c && c.marketing) {
      /* Any pixel or Instagram embed would load here. Note that an
         Instagram embed is a marketing cookie, not a decoration. */
    }
  }

  function lgpd() {
    var bar = document.getElementById('lgpd');
    if (!bar) { return; }
    var prefs = document.getElementById('lgpd-prefs');
    var accept = document.getElementById('lgpd-accept');
    var reject = document.getElementById('lgpd-reject');
    var openp = document.getElementById('lgpd-open-prefs');
    var save = document.getElementById('lgpd-save');
    var ana = document.getElementById('ck-analytics');
    var mkt = document.getElementById('ck-marketing');

    function show() { bar.setAttribute('aria-hidden', 'false'); bar.classList.add('show'); }
    function hide() { bar.classList.remove('show'); bar.setAttribute('aria-hidden', 'true'); }
    function decide(c) { saveConsent(c); applyConsent(c); hide(); }

    var existing = readConsent();
    if (existing) { applyConsent(existing); } else { window.setTimeout(show, 700); }

    if (accept) {
      accept.addEventListener('click', function () {
        decide({ essential: true, analytics: true, marketing: true, at: Date.now() });
      });
    }
    if (reject) {
      reject.addEventListener('click', function () {
        decide({ essential: true, analytics: false, marketing: false, at: Date.now() });
      });
    }
    if (openp && prefs) {
      openp.addEventListener('click', function () {
        var open = prefs.hasAttribute('hidden');
        if (open) { prefs.removeAttribute('hidden'); } else { prefs.setAttribute('hidden', ''); }
        openp.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    if (save) {
      save.addEventListener('click', function () {
        decide({
          essential: true,
          analytics: !!(ana && ana.checked),
          marketing: !!(mkt && mkt.checked),
          at: Date.now()
        });
      });
    }
    var reopen = document.querySelectorAll('[data-lgpd-reopen]');
    for (var i = 0; i < reopen.length; i++) {
      reopen[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        var c = readConsent();
        if (ana) { ana.checked = !!(c && c.analytics); }
        if (mkt) { mkt.checked = !!(c && c.marketing); }
        if (prefs) { prefs.removeAttribute('hidden'); }
        if (openp) { openp.setAttribute('aria-expanded', 'true'); }
        show();
      });
    }
  }

  /* Current year only. No founding year is published anywhere. */
  function years() {
    var els = document.querySelectorAll('[data-year]');
    var y = String(new Date().getFullYear());
    for (var i = 0; i < els.length; i++) { els[i].textContent = y; }
  }

  ready(function () {
    wireContacts();
    openStatus();
    header();
    menu();
    reveals();
    rails();
    filters();
    dropList();
    consign();
    lgpd();
    years();
  });
}());

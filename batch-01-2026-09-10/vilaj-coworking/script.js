/* ===================================================================
   Vilaj Coworking - spec mockup behaviour
   LEAD, NOT A CLIENT.

   No framework, no build step, no ES modules, no fetch(). Runs off
   file:// so the prospect can double-click index.html.

   THE PHONE NUMBERS ARE REAL AND PUBLISHED.
   Vilaj publishes (48) 3039-4889 - which they also use as their
   WhatsApp, wa.me/554830394889 - and (48) 9663-8352. Both resolve
   here. Their existing prefill patterns are kept: a plain "Ola" and a
   reservation-specific variant.

   THE COUNT-UP ENGINE ONLY EVER RUNS ON FOUR NUMBERS.
   2011, +350, +5000 and +100 are Vilaj's own published figures. The
   engine returns on any non-numeric target, so a [CONFIRM] can never
   animate into an invented number - and NO price is ever computed,
   because Vilaj publishes no price for any product.
   =================================================================== */
(function () {
  'use strict';

  var WA_NUMBER = '554830394889';       /* published on their own site */
  var TEL_1 = '+554830394889';
  var TEL_2 = '+554896638352';

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

  function wireContacts() {
    var wa = document.querySelectorAll('[data-wa]');
    var i;
    for (i = 0; i < wa.length; i++) {
      var el = wa[i];
      var extra = el.getAttribute('data-wa');
      var msg = t('Ola', 'Hello');
      if (extra) {
        msg = t('Ola! Vim pelo site do Vilaj e queria saber sobre: ' + extra,
                'Hello! I came from the Vilaj website and would like to know about: ' + extra);
      }
      el.setAttribute('href', 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
    var tels = document.querySelectorAll('[data-tel]');
    for (i = 0; i < tels.length; i++) {
      tels[i].setAttribute('href',
        'tel:' + (tels[i].getAttribute('data-tel') === '2' ? TEL_2 : TEL_1));
    }
  }

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

  /* ---------- the numerals -------------------------------------
     Count up ONCE on first view, and show the final value
     immediately under prefers-reduced-motion. Returns on any
     non-numeric target so a [CONFIRM] can never animate.
     The prefix (2011 has none, the other three carry "+") is kept
     as separate markup so the number itself stays a number.
     ----------------------------------------------------------- */
  function counts() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) { return; }
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) { return; }
      if (reduced) { el.textContent = String(target); return; }
      var start = null, dur = 1100;
      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) { window.requestAnimationFrame(step); }
      }
      window.requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) { run(els[i]); }
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) { run(entries[j].target); io.unobserve(entries[j].target); }
      }
    }, { threshold: 0.45 });
    for (var k = 0; k < els.length; k++) { io.observe(els[k]); }
  }

  /* ---------- the plans segmented control ---------------------
     The page their nav links to and their server 404s. Keyboard
     operable, aria-pressed carries state, result count announced,
     and the comparison table filters with the same control.
     ----------------------------------------------------------- */
  function segments() {
    var bar = document.querySelector('.segbar');
    if (!bar) { return; }
    var status = document.getElementById('plan-status');
    var btns = bar.querySelectorAll('button');
    var cards = document.querySelectorAll('.plan');
    var rows = document.querySelectorAll('table.cmp tbody tr');

    function apply(fam) {
      var shown = 0, i;
      for (i = 0; i < cards.length; i++) {
        var on = fam === 'all' || cards[i].getAttribute('data-fam') === fam;
        cards[i].hidden = !on;
        if (on) { shown++; }
      }
      for (i = 0; i < rows.length; i++) {
        var rf = rows[i].getAttribute('data-fam');
        rows[i].hidden = !(fam === 'all' || !rf || rf === fam);
      }
      for (i = 0; i < btns.length; i++) {
        btns[i].setAttribute('aria-pressed',
          btns[i].getAttribute('data-fam') === fam ? 'true' : 'false');
      }
      if (status) {
        status.textContent = shown + t(' produto(s) em exibicao.', ' product(s) shown.');
      }
    }

    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        apply(this.getAttribute('data-fam'));
      });
    }
    bar.addEventListener('keydown', function (ev) {
      var list = Array.prototype.slice.call(btns);
      var at = list.indexOf(document.activeElement);
      if (at < 0) { return; }
      var to = -1;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { to = (at + 1) % list.length; }
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
        to = (at - 1 + list.length) % list.length;
      } else if (ev.key === 'Home') { to = 0; }
      else if (ev.key === 'End') { to = list.length - 1; }
      if (to >= 0) { ev.preventDefault(); list[to].focus(); }
    });
    apply('all');
  }

  function contactForm() {
    var form = document.getElementById('contato');
    if (!form) { return; }
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var get = function (n) {
        var el = form.elements[n];
        return el && el.value ? el.value.trim() : '';
      };
      var nome = form.elements['nome'];
      var consent = form.elements['consent'];
      if (nome && !nome.value.trim()) {
        nome.setAttribute('aria-invalid', 'true');
        if (status) { status.textContent = t('Informe o seu nome.', 'Please enter your name.'); }
        if (nome.focus) { nome.focus(); }
        return;
      }
      if (nome) { nome.removeAttribute('aria-invalid'); }
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = t('Marque a autorizacao de contato antes de enviar.',
                                 'Please tick the contact permission before sending.');
        }
        if (consent.focus) { consent.focus(); }
        return;
      }
      var msg = t(
        'Ola! Vim pelo site do Vilaj. Nome: ' + (get('nome') || '[nome]') +
          '. Interesse: ' + (get('interesse') || '[interesse]') + '. ' + get('mensagem'),
        'Hello! I came from the Vilaj website. Name: ' + (get('nome') || '[name]') +
          '. Interested in: ' + (get('interesse') || '[interest]') + '. ' + get('mensagem')
      );
      if (status) {
        status.textContent = t('Abrindo o WhatsApp com o resumo...',
                               'Opening WhatsApp with a summary...');
      }
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg),
                  '_blank', 'noopener');
    });
  }

  /* ---------- LGPD --------------------------------------------
     Their live Squarespace site has NO cookie consent banner and NO
     privacy policy page at all, on a site that also runs a client
     login area. Both are mandatory. This is the whole thing built:
     granular, nothing pre-ticked, reject as easy as accept.
     ----------------------------------------------------------- */
  var STORE = 'vilaj_lgpd_v1';

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
      /* Squarespace's own analytics and anything else would load here,
         and only here. Nothing fires in this mockup. */
    }
    if (c && c.marketing) {
      /* Any pixel or social embed would load here. Inert. */
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

  /* Current year, and "desde 2011" printed as a date. The founding
     year is theirs and verifiable; nothing is derived from it. */
  function years() {
    var els = document.querySelectorAll('[data-year]');
    var y = String(new Date().getFullYear());
    for (var i = 0; i < els.length; i++) { els[i].textContent = y; }
  }

  ready(function () {
    wireContacts();
    header();
    menu();
    reveals();
    counts();
    segments();
    contactForm();
    lgpd();
    years();
  });
}());

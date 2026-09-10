/* ==========================================================================
   OPOKE! — "The Raw Bar" — spec mockup
   Plain JS. No framework, no build step, no modules, no fetch. Runs from
   file:// exactly as it runs from a server.

   Shared by the pt-BR tree (/) and the EN tree (/en/). Language is read off
   <html lang>, never guessed and never used to swap text in the DOM — both
   trees are real, separately authored pages.

   The configurator is the point of this build. It is fully wired: seven
   steps, real state, real localStorage, and a composed WhatsApp message.
   What it does NOT do is invent anything. Opoke publishes no menu and no
   price, so every option label and every price delta reads [CONFIRM], the
   running total stays "R$ [CONFIRM]", and the composed message says so in
   plain words. Allergens, on the other hand, are real structure: each option
   carries its allergen list and those carry through into the message, because
   ANVISA RDC 26/2015 makes that mandatory and a build-your-own flow that
   drops allergens at the summary is a genuine liability.

   WhatsApp: +55 48 98850-5102 is published on their own site as a wa.me
   link. It is used exactly as published, unmodified.
   ========================================================================== */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'pt-BR').toLowerCase().indexOf('en') === 0;
  var WA_NUMBER = '5548988505102';               /* published by them — verbatim */
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function t(pt, en) { return EN ? en : pt; }

  /* ---------------------------------------------------------------- header */
  var hdr = $('.hdr');
  var burger = $('.burger');
  var nav = $('.nav');

  function onScroll() {
    if (hdr) hdr.classList.toggle('is-stuck', window.pageYOffset > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var rv = $$('.rv');
  if (!rv.length) { /* nothing to do */ }
  else if (RM || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = Math.min(sibs, 6) * 90 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- hero parallax */
  var tracks = $$('.track img');
  if (tracks.length && !RM) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (y < window.innerHeight * 1.3) {
          tracks.forEach(function (img) {
            img.style.transform = 'translate3d(0,' + (y * 0.11).toFixed(1) + 'px,0) scale(1.09)';
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------- Poke | Sushi switch --
     A real segmented control that re-scopes the menu below. It filters
     sections that declare data-track; anything without the attribute stays
     visible under both. State is remembered so a returning customer who only
     ever wants sushi is not made to switch every visit.                    */
  var switchBtns = $$('.switch button');
  var TRACK_KEY = 'opoke.track';

  function applyTrack(track) {
    $$('[data-track]').forEach(function (el) {
      var own = el.getAttribute('data-track');
      el.hidden = !(own === 'both' || own === track);
    });
    switchBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-go') === track ? 'true' : 'false');
    });
    try { window.localStorage.setItem(TRACK_KEY, track); } catch (e) {}
  }

  if (switchBtns.length) {
    switchBtns.forEach(function (b) {
      b.addEventListener('click', function () { applyTrack(b.getAttribute('data-go')); });
    });
    var saved = null;
    try { saved = window.localStorage.getItem(TRACK_KEY); } catch (e) {}
    applyTrack(saved === 'sushi' ? 'sushi' : 'poke');
  }

  /* ===================================================================== */
  /* ==========================  CONFIGURATOR  =========================== */
  /* ===================================================================== */

  var cfg = $('#configurador');

  if (cfg) {
    var steps = $$('.steprail button', cfg);
    var rows = $$('.optrow', cfg);

    /* --- step navigation ------------------------------------------------ */
    function showStep(key) {
      steps.forEach(function (b) {
        b.setAttribute('aria-selected', b.getAttribute('data-step') === key ? 'true' : 'false');
      });
      rows.forEach(function (r) { r.hidden = r.getAttribute('data-step') !== key; });
    }
    steps.forEach(function (b) {
      b.addEventListener('click', function () { showStep(b.getAttribute('data-step')); });
    });
    if (steps.length) showStep(steps[0].getAttribute('data-step'));

    /* --- selection state ------------------------------------------------
       Single-choice steps (tamanho, base, proteina, molho) behave like
       radios; multi-choice steps (toppings, crocantes, extras) like
       checkboxes. The step element declares which via data-multi.         */
    function stepIsMulti(key) {
      var row = cfg.querySelector('.optrow[data-step="' + key + '"]');
      return !!(row && row.getAttribute('data-multi') === 'yes');
    }

    $$('.opt', cfg).forEach(function (opt) {
      opt.addEventListener('click', function (ev) {
        ev.preventDefault();
        var key = opt.getAttribute('data-step');
        if (!stepIsMulti(key)) {
          $$('.opt[data-step="' + key + '"]', cfg).forEach(function (o) {
            if (o !== opt) { o.classList.remove('is-on'); o.setAttribute('aria-pressed', 'false'); }
          });
          opt.classList.add('is-on');
        } else {
          opt.classList.toggle('is-on');
        }
        opt.setAttribute('aria-pressed', opt.classList.contains('is-on') ? 'true' : 'false');
        render();
      });
      opt.addEventListener('keydown', function (ev) {
        if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); opt.click(); }
      });
    });

    /* --- reading the state ---------------------------------------------- */
    function chosen(key) {
      return $$('.opt[data-step="' + key + '"].is-on', cfg).map(function (o) {
        return {
          label: o.getAttribute('data-label') || '',
          alerg: (o.getAttribute('data-alerg') || '').split('|').filter(Boolean)
        };
      });
    }

    var STEP_KEYS = ['tamanho', 'base', 'proteina', 'toppings', 'molho', 'crocantes', 'extras'];
    var STEP_NAMES = {
      tamanho: t('Tamanho', 'Size'),
      base: t('Base', 'Base'),
      proteina: t('Proteína', 'Protein'),
      toppings: t('Toppings', 'Toppings'),
      molho: t('Molho', 'Sauce'),
      crocantes: t('Crocantes', 'Crunch'),
      extras: t('Extras', 'Extras')
    };

    var sumList = $('#sum-list', cfg);
    var sumTotal = $('#sum-total', cfg);
    var sumAlerg = $('#sum-alerg', cfg);
    var qtyEl = $('#c-qtd', cfg);
    var obsEl = $('#c-obs', cfg);

    function collectAllergens() {
      var seen = {}, out = [];
      STEP_KEYS.forEach(function (k) {
        chosen(k).forEach(function (c) {
          c.alerg.forEach(function (a) {
            if (!seen[a]) { seen[a] = 1; out.push(a); }
          });
        });
      });
      return out;
    }

    function render() {
      if (!sumList) return;
      var html = '';
      STEP_KEYS.forEach(function (k) {
        var picks = chosen(k);
        if (!picks.length) return;
        html += '<div><b>' + STEP_NAMES[k] + ':</b> ' +
                picks.map(function (p) { return p.label; }).join(', ') + '</div>';
      });
      sumList.innerHTML = html || '<div>' +
        t('Nada escolhido ainda — toque em uma opção acima.',
          'Nothing chosen yet — tap an option above.') + '</div>';

      /* The total NEVER animates to a number. No price is published, so no
         price is shown. It stays a [CONFIRM] marker until real prices land. */
      if (sumTotal) sumTotal.innerHTML = 'R$ <span class="cfm">[CONFIRM]</span>';

      if (sumAlerg) {
        var al = collectAllergens();
        if (!al.length) {
          sumAlerg.innerHTML = t(
            '⚠️ Alérgenos: aparecem aqui conforme você monta o bowl. Lista de ingredientes por etapa: [CONFIRM].',
            '⚠️ Allergens: they appear here as you build the bowl. Per-step ingredient lists: [CONFIRM].');
        } else {
          sumAlerg.innerHTML = t('⚠️ Contém: ', '⚠️ Contains: ') + '<b>' + al.join(' · ') + '</b>. ' +
            t('Confirme os ingredientes exatos de cada etapa antes de pedir — [CONFIRM].',
              'Confirm the exact ingredients of each step before ordering — [CONFIRM].');
        }
      }
    }
    render();

    /* --- salvar meu bowl (localStorage) ---------------------------------
       Disclosed in the privacy policy. Stored on this device only, never
       transmitted anywhere, and clearable from the button beside it.      */
    var SAVE_KEY = 'opoke.bowl.v1';

    function snapshot() {
      var s = { picks: {}, qtd: qtyEl ? qtyEl.value : '1', obs: obsEl ? obsEl.value : '' };
      STEP_KEYS.forEach(function (k) {
        s.picks[k] = $$('.opt[data-step="' + k + '"].is-on', cfg).map(function (o) {
          return o.getAttribute('data-id');
        });
      });
      return s;
    }

    function restore(s) {
      $$('.opt', cfg).forEach(function (o) { o.classList.remove('is-on'); o.setAttribute('aria-pressed', 'false'); });
      STEP_KEYS.forEach(function (k) {
        (s.picks[k] || []).forEach(function (id) {
          var o = cfg.querySelector('.opt[data-step="' + k + '"][data-id="' + id + '"]');
          if (o) { o.classList.add('is-on'); o.setAttribute('aria-pressed', 'true'); }
        });
      });
      if (qtyEl && s.qtd) qtyEl.value = s.qtd;
      if (obsEl && typeof s.obs === 'string') obsEl.value = s.obs;
      render();
    }

    var saveBtn = $('#c-save', cfg);
    var loadBtn = $('#c-load', cfg);
    var clearBtn = $('#c-clear', cfg);

    function haveSaved() {
      try { return !!window.localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
    }
    function syncSavedUI() {
      if (loadBtn) loadBtn.hidden = !haveSaved();
      if (clearBtn) clearBtn.hidden = !haveSaved();
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        try {
          window.localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot()));
          syncSavedUI();
          saveBtn.textContent = t('Bowl salvo ✓', 'Bowl saved ✓');
          window.setTimeout(function () {
            saveBtn.textContent = t('Salvar meu bowl', 'Save my bowl');
          }, 2200);
        } catch (e) {
          window.alert(t(
            'Não foi possível salvar neste navegador (armazenamento bloqueado ou janela privada).',
            'Could not save in this browser (storage blocked, or a private window).'));
        }
      });
    }
    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        try {
          var raw = window.localStorage.getItem(SAVE_KEY);
          if (raw) restore(JSON.parse(raw));
        } catch (e) {}
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        try { window.localStorage.removeItem(SAVE_KEY); } catch (e) {}
        syncSavedUI();
      });
    }
    syncSavedUI();

    /* --- compose the WhatsApp order ------------------------------------- */
    function composeOrder() {
      var L = [];
      L.push(t('*Pedido Opoke! — bowl montado no site*', '*Opoke! order — bowl built on the site*'));
      L.push('');
      var any = false;
      STEP_KEYS.forEach(function (k) {
        var picks = chosen(k);
        if (!picks.length) return;
        any = true;
        L.push(STEP_NAMES[k] + ': ' + picks.map(function (p) { return p.label; }).join(', '));
      });
      if (!any) {
        L.push(t('(nenhuma opção escolhida — as opções do site ainda são [CONFIRM])',
                 '(no option chosen — the site options are still [CONFIRM])'));
      }
      L.push('');
      L.push(t('Quantidade: ', 'Quantity: ') + (qtyEl ? qtyEl.value : '1'));
      if (obsEl && obsEl.value.trim()) {
        L.push(t('Observações: ', 'Notes: ') + obsEl.value.trim());
      }
      L.push('');

      var al = collectAllergens();
      L.push(t('⚠️ ALÉRGENOS DAS OPÇÕES ESCOLHIDAS: ', '⚠️ ALLERGENS IN THE CHOSEN OPTIONS: ') +
             (al.length ? al.join(' · ')
                        : t('(nenhuma opção com alérgeno marcada)', '(no allergen-tagged option selected)')));
      L.push(t('Confirmem por favor os ingredientes e os alérgenos reais de cada etapa.',
               'Please confirm the real ingredients and allergens of each step.'));
      L.push('');
      L.push(t('Total: R$ [A CONFIRMAR — o site ainda não publica preços]',
               'Total: R$ [TO CONFIRM — the site does not publish prices yet]'));
      L.push('');
      L.push(t('(Enviado pelo montador de bowl do site — maquete de demonstração.)',
               '(Sent from the bowl builder on the site — demonstration mockup.)'));
      return L.join('\n');
    }

    var sendBtn = $('#c-send', cfg);
    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(composeOrder());
        window.open(url, '_blank', 'noopener');
      });
    }

    var previewBtn = $('#c-preview', cfg);
    var previewBox = $('#c-preview-out', cfg);
    if (previewBtn && previewBox) {
      previewBtn.addEventListener('click', function () {
        previewBox.hidden = false;
        previewBox.value = composeOrder();
        previewBox.focus();
      });
    }
  }

  /* ------------------------------------------------- generic WA composers -
     Used by the events/platter form and the CEP check. Both compose a
     message and open WhatsApp; neither pretends to book anything.         */
  $$('[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) return;
      var lines = [form.getAttribute('data-wa-title') || 'Opoke!', ''];
      $$('input, select, textarea', form).forEach(function (f) {
        if (f.type === 'checkbox' || f.type === 'submit' || !f.name) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        var name = lab ? lab.textContent.trim() : f.name;
        lines.push(name + ': ' + (f.value || '—'));
      });
      lines.push('');
      lines.push(t('(Enviado pelo formulário do site — maquete de demonstração.)',
                   '(Sent from the site form — demonstration mockup.)'));
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')),
                  '_blank', 'noopener');
    });
  });

  /* --------------------------------------------------------- diet filters -
     Chips scope the bowls grid. Purely a front-end filter over data the
     client still has to confirm, so each chip carries its own [CONFIRM].  */
  var dietChips = $$('.diet [data-diet]');
  dietChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.getAttribute('aria-pressed') !== 'true';
      dietChips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      var want = on ? chip.getAttribute('data-diet') : '';
      $$('[data-diets]').forEach(function (card) {
        card.hidden = !!want && card.getAttribute('data-diets').indexOf(want) < 0;
      });
    });
  });

  /* ------------------------------------------------------- cookie consent -
     LGPD art. 7 / 8: non-essential OFF by default, reject as prominent as
     accept, granular. Nothing third-party loads outside the consented
     branch — and in this build nothing third-party exists at all.         */
  var ck = $('#ck');
  var CK_KEY = 'opoke.consent.v1';

  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(CK_KEY) || 'null'); }
    catch (e) { return null; }
  }
  function writeConsent(obj) {
    try { window.localStorage.setItem(CK_KEY, JSON.stringify(obj)); } catch (e) {}
    if (ck) ck.classList.remove('is-on');
    applyConsent(obj);
  }
  function applyConsent(c) {
    if (!c || !c.analytics) return;
    /* Consented analytics/pixels would be injected here and nowhere else.
       None is wired in this mockup. */
  }

  if (ck) {
    var existing = readConsent();
    if (!existing) {
      window.setTimeout(function () { ck.classList.add('is-on'); }, 900);
    } else {
      applyConsent(existing);
    }
    var acc = $('#ck-accept'), rej = $('#ck-reject'), sav = $('#ck-save');
    if (acc) acc.addEventListener('click', function () {
      writeConsent({ essential: true, analytics: true, marketing: true, ts: Date.now() });
    });
    if (rej) rej.addEventListener('click', function () {
      writeConsent({ essential: true, analytics: false, marketing: false, ts: Date.now() });
    });
    if (sav) sav.addEventListener('click', function () {
      writeConsent({
        essential: true,
        analytics: !!($('#ck-an') && $('#ck-an').checked),
        marketing: !!($('#ck-mk') && $('#ck-mk').checked),
        ts: Date.now()
      });
    });
  }

  /* -------------------------------------------------------- year in footer */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

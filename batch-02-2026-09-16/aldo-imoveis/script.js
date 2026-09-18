/* Aldo Imóveis — mockup behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Corrected links: their live site uses wa.me/055... (leading zero) which is malformed. */
  var WA = { locacao: '5548991487912', compra: '5548991487901', vendas: '5548991487901' };
  var LABEL = { compra: 'Compra', locacao: 'Locação' };

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* sticky header condense */
  var hdr = $('.site-header');
  function onScroll() { if (hdr) hdr.classList.toggle('condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  var mb = $('.menu-btn'), nav = $('#main-nav');
  if (mb && nav) {
    mb.addEventListener('click', function () {
      var open = mb.getAttribute('aria-expanded') === 'true';
      mb.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { mb.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { mb.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); mb.focus(); } });
  }

  /* accessible tablists (search modes + FAQ groups) */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') n = tabs[0];
        if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* scroll reveals with stagger */
  $$('[data-stagger]').forEach(function (g) { $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--i', i % 6); }); });
  var revealEls = $$('.reveal, .spring');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* count-up: only for elements with a verified numeric data-count (none are verified in this mockup) */
  $$('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || reduce) return;
    var done = false;
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting || done) return; done = true;
      var t0 = null;
      function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1200, 1); el.textContent = Math.round(target * p).toLocaleString('pt-BR'); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
    o.observe(el);
  });

  /* favourites (demo only) */
  $$('.fav').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); }); });

  /* popovers: WhatsApp chooser + call chooser */
  function popover(btnSel, popId) {
    var pop = doc.getElementById(popId);
    var btns = $$(btnSel);
    if (!pop || !btns.length) return;
    function close() { pop.classList.remove('open'); btns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); }); }
    btns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (b.hasAttribute('data-wa-float') && getTrack()) return;
        e.stopPropagation();
        var open = !pop.classList.contains('open');
        $$('.wa-pop.open').forEach(function (p) { p.classList.remove('open'); });
        pop.classList.toggle('open', open);
        b.setAttribute('aria-expanded', String(open));
        if (open) { var f = $('a', pop); if (f) f.focus(); }
      });
    });
    doc.addEventListener('click', function (e) { if (!pop.contains(e.target)) close(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop.classList.contains('open')) { close(); btns[0].focus(); } });
  }
  /* ---- Track (Compra | Locação): the fork that re-skins the page ---- */
  var TKEY = 'aldo-track';
  function getTrack() { try { return sessionStorage.getItem(TKEY); } catch (e) { return null; } }
  function setTrack(t, silent) {
    if (t !== 'compra' && t !== 'locacao') return;
    try { sessionStorage.setItem(TKEY, t); } catch (e) {}
    applyTrack(t, silent);
  }
  function applyTrack(t, silent) {
    doc.documentElement.setAttribute('data-track', t);
    $$('.door-pick').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-track') === t)); });
    $$('.door').forEach(function (d) { d.classList.toggle('is-active', d.getAttribute('data-track') === t); });
    $$('.rail').forEach(function (r) { r.classList.toggle('is-active', r.getAttribute('data-track') === t); });
    $$('.track-chip').forEach(function (c) {
      c.classList.add('on');
      var lab = $('.tc-label', c), sw = $('button', c);
      if (lab) lab.textContent = t === 'compra' ? 'Comprando' : 'Alugando';
      if (sw) { sw.textContent = t === 'compra' ? 'Trocar para Alugar' : 'Trocar para Comprar'; }
    });
    filterCards(t);
    var ft = doc.getElementById(t === 'compra' ? 'ft-comprar' : 'ft-alugar');
    if (ft) ft.click();
    var fl = $('[data-wa-float]');
    if (fl) { fl.setAttribute('aria-label', 'WhatsApp ' + LABEL[t] + ' — ' + (t === 'compra' ? '(48) 99148-7901' : '(48) 99148-7912')); }
    var live = doc.getElementById('track-live');
    if (live && !silent) live.textContent = 'Trilha selecionada: ' + LABEL[t] + '. Anúncios, perguntas e contato foram ajustados.';
  }
  function filterCards(f) {
    $$('.filter button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === f)); });
    $$('.cards [data-kind]').forEach(function (c) { c.hidden = !(f === 'todos' || c.getAttribute('data-kind') === f); });
  }
  $$('.filter button').forEach(function (b) { b.addEventListener('click', function () { filterCards(b.getAttribute('data-f')); }); });
  $$('.door-pick').forEach(function (b) {
    b.addEventListener('click', function () { setTrack(b.getAttribute('data-track')); });
  });
  $$('.track-chip button').forEach(function (b) {
    b.addEventListener('click', function () { setTrack(getTrack() === 'compra' ? 'locacao' : 'compra'); });
  });
  $$('[data-set-track]').forEach(function (a) { a.addEventListener('click', function () { setTrack(a.getAttribute('data-set-track')); }); });
  var initial = getTrack();
  if (initial) applyTrack(initial, true);

  /* floating WhatsApp: goes straight to the selected track's line; otherwise asks which track */
  $$('[data-wa-float]').forEach(function (fl) {
    fl.addEventListener('click', function (e) {
      var t = getTrack();
      if (t) {
        fl.href = 'https://wa.me/' + WA[t] + '?text=' + encodeURIComponent('Olá, Aldo Imóveis! Vim pelo site — ' + LABEL[t] + '.');
        fl.target = '_blank'; fl.rel = 'noopener';
        return; // let the link open
      }
      e.preventDefault();
    });
  });

  popover('[data-wa-open]', 'wa-pop');
  popover('[data-call-open]', 'call-pop');

  /* demo forms: never submit; optionally build a WhatsApp hand-off link from the fields */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.notice', f);
      var line = f.getAttribute('data-wa');
      if (line === 'by-finalidade') { var fin = f.querySelector('[name="finalidade"]'); line = fin && /Alug|Loca/.test(fin.value) ? 'locacao' : 'compra'; }
      if (line === 'by-track') { line = getTrack() || 'compra'; }
      if (f.hasAttribute('data-sets-track')) setTrack(f.getAttribute('data-sets-track'));
      var msg = f.getAttribute('data-msg') || 'Demonstração: nada foi enviado. No site real, esta etapa encaminha o contato.';
      if (note) {
        note.textContent = msg;
        if (line && WA[line]) {
          var parts = [];
          $$('select, input[type=text], input[type=tel], input[type=number], textarea', f).forEach(function (i) {
            if (i.value && i.name) parts.push(i.getAttribute('data-label') + ': ' + i.value);
          });
          var text = (f.getAttribute('data-intro') || 'Olá, Aldo Imóveis!') + '\n' + parts.join('\n');
          var a = doc.createElement('a');
          a.className = 'btn btn-wa btn-sm';
          a.style.marginTop = '.6rem';
          a.href = 'https://wa.me/' + WA[line] + '?text=' + encodeURIComponent(text);
          a.target = '_blank'; a.rel = 'noopener';
          a.textContent = 'Continuar no WhatsApp (' + (line === 'locacao' ? 'Locação' : 'Compra') + ')';
          note.appendChild(doc.createElement('br'));
          note.appendChild(a);
        }
        note.classList.add('show');
      }
    });
  });

  /* click-to-load map (LGPD: no third-party embed before an explicit action) */
  $$('[data-map-load]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map]');
      if (!box) return;
      var f = doc.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(box.getAttribute('data-map')) + '&output=embed';
      f.title = 'Mapa: ' + box.getAttribute('data-map');
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.style.cssText = 'border:0;width:100%;height:100%;border-radius:12px';
      box.innerHTML = '';
      box.style.padding = '0';
      box.appendChild(f);
      f.focus();
    });
  });

  /* financing simulator — indicative only, user supplies the rate */
  var sim = $('#sim-form');
  if (sim) {
    sim.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = parseFloat(sim.valor.value) || 0, en = parseFloat(sim.entrada.value) || 0;
      var n = parseInt(sim.prazo.value, 10) || 0, taxa = parseFloat(String(sim.taxa.value).replace(',', '.'));
      var out = $('#sim-result'), basis = $('#sim-basis');
      var pv = v - en;
      if (!(pv > 0) || !(n > 0) || isNaN(taxa) || taxa < 0) { out.textContent = 'Preencha valor, entrada, prazo e taxa.'; return; }
      var i = Math.pow(1 + taxa / 100, 1 / 12) - 1;
      var p;
      if (sim.sistema.value === 'SAC') { p = pv / n + pv * i; }
      else { p = i === 0 ? pv / n : pv * i / (1 - Math.pow(1 + i, -n)); }
      var fmt = function (x) { return x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
      out.textContent = fmt(p) + (sim.sistema.value === 'SAC' ? ' (1ª parcela)' : ' (parcela fixa)');
      var d = new Date();
      var dd = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
      basis.textContent = 'Base: financiado ' + fmt(pv) + ' · ' + n + ' meses · ' + taxa.toLocaleString('pt-BR') + '% a.a. informada por você · sistema ' + sim.sistema.value + ' · sem seguros, taxas e tarifas · simulado em ' + dd + '. Resultado indicativo, não vinculante, sujeito à análise de crédito do banco.';
    });
  }

  /* LGPD cookie consent — trackers (GTM, Meta Pixel) load ONLY after opt-in */
  var KEY = 'aldo-cookie-consent-v1';
  var banner = $('#cookie');
  function loadTrackers(c) {
    // Production: inject GTM here only if c.analise === true, Meta Pixel only if c.marketing === true.
    // Mockup: intentionally loads nothing.
    doc.documentElement.setAttribute('data-consent', (c.analise ? 'analise ' : '') + (c.marketing ? 'marketing' : ''));
  }
  function save(c) { store(KEY, JSON.stringify(c)); loadTrackers(c); hide(); }
  function show(withPrefs) {
    if (!banner) return;
    banner.classList.add('show');
    var p = $('.prefs', banner);
    if (p) p.classList.toggle('open', !!withPrefs);
    var first = $('button', banner); if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function hide() { if (banner) banner.classList.remove('show'); }
  if (banner) {
    var saved = null;
    try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) { saved = null; }
    if (saved) loadTrackers(saved); else setTimeout(function () { show(false); }, 600);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: true, marketing: true }); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: false, marketing: false }); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () { var p = $('.prefs', banner); p.classList.toggle('open'); });
    $('[data-ck="save"]', banner).addEventListener('click', function () {
      save({ necessarios: true, analise: $('#ck-analise').checked, marketing: $('#ck-marketing').checked });
    });
    $$('[data-cookie-prefs]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = null; try { s = JSON.parse(store(KEY) || 'null'); } catch (e) {}
        $('#ck-analise').checked = !!(s && s.analise);
        $('#ck-marketing').checked = !!(s && s.marketing);
        show(true);
      });
    });
  }
})();

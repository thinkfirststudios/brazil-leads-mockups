/* Santa Ilha Imóveis — mockup behaviour. Vanilla JS, no dependencies.
   Progressive enhancement: the page renders correctly for the Centro unit without JS. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* (48) 3206-4700 is published on their site as a WhatsApp link — [CONFIRM] it is WhatsApp-enabled and whether each unit has its own line. */
  var WA_NUMBER = '554832064700';
  var UNIT_LABEL = { centro: 'Centro', campeche: 'Campeche' };
  var UKEY = 'santailha-unit';

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* sticky header */
  var hdr = $('.site-header');
  function onScroll() { if (hdr) hdr.classList.toggle('condensed', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  var mb = $('.menu-btn'), nav = $('#main-nav');
  if (mb && nav) {
    mb.addEventListener('click', function () {
      var open = mb.getAttribute('aria-expanded') === 'true';
      mb.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open);
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { mb.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }); });
  }

  /* tablists */
  $$('[role="tablist"]').forEach(function (list) {
    var tabs = $$('[role="tab"]', list);
    var noPanel = list.hasAttribute('data-nopanel');
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (!noPanel) { var p = doc.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; }
      });
      if (focus) tab.focus();
      list.dispatchEvent(new CustomEvent('tabchange', { detail: tab }));
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

  /* nav links that open a specific Destaques tab */
  $$('[data-open-tab]').forEach(function (a) {
    a.addEventListener('click', function () { var t = doc.getElementById(a.getAttribute('data-open-tab')); if (t) t.click(); });
  });

  /* search: mode tabs <-> finalidade select, and separate value ladders */
  var fin = $('#sb-fin');
  function setLadder(v) {
    $$('[data-ladder]').forEach(function (s) { var on = s.getAttribute('data-ladder') === v; s.hidden = !on; s.disabled = !on; });
  }
  if (fin) {
    fin.addEventListener('change', function () {
      setLadder(fin.value);
      var t = $('.modes [data-mode="' + fin.value + '"]'); if (t && t.getAttribute('aria-selected') !== 'true') t.click();
    });
    var modes = $('.modes');
    if (modes) modes.addEventListener('tabchange', function (e) { var v = e.detail.getAttribute('data-mode'); fin.value = v; setLadder(v); });
    setLadder(fin.value);
  }

  /* reveals */
  $$('[data-stagger]').forEach(function (g) { $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--i', i % 6); }); });
  var revealEls = $$('.reveal, .spring');
  if (reduce || !('IntersectionObserver' in window)) { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* carousels */
  $$('.carousel').forEach(function (c) {
    var tr = $('.track', c);
    $$('[data-dir]', c).forEach(function (b) {
      b.addEventListener('click', function () {
        var card = tr.firstElementChild; var w = card ? card.getBoundingClientRect().width + 16 : 300;
        tr.scrollBy({ left: w * parseInt(b.getAttribute('data-dir'), 10), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });

  /* favourites + counter */
  function favCount() {
    var n = $$('.fav[aria-pressed="true"]').length;
    $$('[data-fav-count]').forEach(function (el) { el.textContent = n; });
    var b = $('.fav-btn'); if (b) b.setAttribute('aria-label', 'Favoritos: ' + n + ' imóveis');
  }
  $$('.fav').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); favCount(); }); });

  /* Área do Cliente disclosure */
  var cb = $('.client-btn'), cd = $('#client-drop');
  if (cb && cd) {
    cb.addEventListener('click', function (e) { e.stopPropagation(); var o = !cd.classList.contains('open'); cd.classList.toggle('open', o); cb.setAttribute('aria-expanded', String(o)); });
    doc.addEventListener('click', function (e) { if (!cd.contains(e.target)) { cd.classList.remove('open'); cb.setAttribute('aria-expanded', 'false'); } });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cd.classList.contains('open')) { cd.classList.remove('open'); cb.setAttribute('aria-expanded', 'false'); cb.focus(); } });
  }

  /* ---- UNIT: the organising principle ---- */
  function waHref(unit, tipo, extra) {
    var t = 'Olá, Santa Ilha Imóveis! Unidade: ' + UNIT_LABEL[unit] + '. Tipo de contato: ' + (tipo || 'Atendimento') + '.' + (extra ? ' ' + extra : '');
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(t);
  }
  function getUnit() { var u = sget(UKEY); return u === 'campeche' ? 'campeche' : 'centro'; }
  function applyUnit(u, announce) {
    doc.documentElement.setAttribute('data-unit', u);
    $$('input[name="unidade"]').forEach(function (r) { r.checked = r.value === u; });
    $$('select[data-unit-select]').forEach(function (s) { if (s.value !== UNIT_LABEL[u]) s.value = UNIT_LABEL[u]; });
    $$('.pick-unit').forEach(function (b) {
      var on = b.getAttribute('data-unit') === u;
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? 'Unidade selecionada' : 'Selecionar esta unidade';
    });
    $$('.unit-card').forEach(function (c) { c.classList.toggle('is-active', c.getAttribute('data-unit') === u); });
    $$('[data-unit-show]').forEach(function (el) {
      var on = el.getAttribute('data-unit-show') === u;
      el.hidden = !on;
      if (on && !reduce) { el.classList.remove('unit-flash'); void el.offsetWidth; el.classList.add('unit-flash'); }
    });
    $$('[data-wa-tipo]').forEach(function (a) {
      var fixed = a.getAttribute('data-wa-unit');
      a.href = waHref(fixed || u, a.getAttribute('data-wa-tipo'), a.getAttribute('data-wa-extra'));
    });
    var box = $('[data-map-unit]');
    if (box && !box.querySelector('iframe')) {
      box.setAttribute('data-map', box.getAttribute('data-map-' + u));
    }
    var live = doc.getElementById('unit-live');
    if (live && announce) live.textContent = 'Unidade selecionada: ' + UNIT_LABEL[u] + '. Registro, endereço, horário e contato atualizados.';
  }
  function setUnit(u) { if (u !== 'centro' && u !== 'campeche') return; sset(UKEY, u); applyUnit(u, true); }
  $$('input[name="unidade"]').forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setUnit(r.value); }); });
  $$('select[data-unit-select]').forEach(function (s) { s.addEventListener('change', function () { setUnit(s.value === 'Campeche' ? 'campeche' : 'centro'); }); });
  $$('.pick-unit').forEach(function (b) { b.addEventListener('click', function () { setUnit(b.getAttribute('data-unit')); }); });
  $$('[data-set-unit]').forEach(function (a) { a.addEventListener('click', function () { setUnit(a.getAttribute('data-set-unit')); }); });
  applyUnit(getUnit(), false);

  /* click-to-load map (LGPD: nothing from Google loads before the click) */
  $$('[data-map-load]').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('[data-map]'); if (!box) return;
      var f = doc.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(box.getAttribute('data-map')) + '&output=embed';
      f.title = 'Mapa: ' + box.getAttribute('data-map');
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      f.style.cssText = 'border:0;width:100%;height:100%;min-height:260px;border-radius:12px';
      box.innerHTML = ''; box.style.padding = '0'; box.appendChild(f);
    });
  });

  /* demo forms */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('.notice', f); if (!note) return;
      note.textContent = f.getAttribute('data-msg') || 'Demonstração: nada foi enviado.';
      if (f.hasAttribute('data-wa')) {
        var parts = [];
        $$('select, input[type=text], input[type=tel], input[type=date], input[type=number], textarea, input[type=radio]:checked', f).forEach(function (i) {
          if (i.value && i.getAttribute('data-label')) parts.push(i.getAttribute('data-label') + ': ' + i.value);
        });
        var tipoEl = f.querySelector('[name="tipo_contato"]');
        var unitEl = f.querySelector('[data-unit-select]');
        var u = unitEl ? (unitEl.value === 'Campeche' ? 'campeche' : 'centro') : getUnit();
        var a = doc.createElement('a');
        a.className = 'btn btn-wa btn-sm'; a.style.marginTop = '.6rem';
        a.href = waHref(u, tipoEl ? tipoEl.value : f.getAttribute('data-wa'), parts.join(' · '));
        a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'Continuar no WhatsApp (' + UNIT_LABEL[u] + ')';
        note.appendChild(doc.createElement('br')); note.appendChild(a);
      }
      note.classList.add('show');
    });
  });

  /* rent calculator (owner + tenant view) — uses only figures the visitor types */
  var calc = $('#calc-form');
  if (calc) {
    calc.addEventListener('submit', function (e) {
      e.preventDefault();
      function n(name) { var v = String(calc[name].value || '').replace(/\./g, '').replace(',', '.'); var x = parseFloat(v); return isNaN(x) ? 0 : x; }
      var fmt = function (x) { return x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
      var aluguel = n('aluguel'), cond = n('condominio'), iptu = n('iptu'), lixo = n('lixo'), seguro = n('seguro'), taxa = n('taxa');
      if (!(aluguel > 0)) { $('#calc-total').textContent = 'Informe o aluguel.'; return; }
      $('#calc-total').textContent = fmt(aluguel + cond + iptu + lixo + seguro);
      $('#calc-repasse').textContent = taxa > 0 ? fmt(aluguel - aluguel * taxa / 100) : 'Informe a taxa de administração';
    });
  }

  /* financing simulator — indicative only, visitor supplies the rate */
  var sim = $('#sim-form');
  if (sim) {
    sim.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = parseFloat(sim.valor.value) || 0, en = parseFloat(sim.entrada.value) || 0;
      var n = parseInt(sim.prazo.value, 10) || 0, taxa = parseFloat(String(sim.taxa.value).replace(',', '.'));
      var out = $('#sim-result'), basis = $('#sim-basis'), pv = v - en;
      if (!(pv > 0) || !(n > 0) || isNaN(taxa) || taxa < 0) { out.textContent = 'Preencha valor, entrada, prazo e taxa.'; return; }
      var i = Math.pow(1 + taxa / 100, 1 / 12) - 1;
      var p = sim.sistema.value === 'SAC' ? pv / n + pv * i : (i === 0 ? pv / n : pv * i / (1 - Math.pow(1 + i, -n)));
      var fmt = function (x) { return x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
      var d = new Date(), dd = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
      out.textContent = fmt(p) + (sim.sistema.value === 'SAC' ? ' (1ª parcela)' : ' (parcela fixa)');
      basis.textContent = 'Base: ' + fmt(pv) + ' · ' + n + ' meses · ' + taxa.toLocaleString('pt-BR') + '% a.a. informada por você · ' + sim.sistema.value + ' · sem seguros e tarifas · ' + dd + '. Indicativo, não é decisão de crédito.';
    });
  }

  /* WhatsApp float popover (asks Tipo de Contato, carries the unit) */
  var pop = $('#wa-pop');
  $$('[data-wa-open]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var o = !pop.classList.contains('open'); pop.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o));
      var lab = $('[data-unit-name]', pop); if (lab) lab.textContent = UNIT_LABEL[getUnit()];
      if (o) { var f = $('a', pop); if (f) f.focus(); }
    });
  });
  if (pop) {
    doc.addEventListener('click', function (e) { if (!pop.contains(e.target)) pop.classList.remove('open'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.classList.remove('open'); });
  }

  /* LGPD cookie consent — GTM-T2F48FTP loads only after opt-in */
  var KEY = 'santailha-cookie-consent-v1';
  var banner = $('#cookie');
  function loadTrackers(c) {
    // Production: inject GTM-T2F48FTP here only if c.analise === true; marketing tags only if c.marketing === true.
    doc.documentElement.setAttribute('data-consent', (c.analise ? 'analise ' : '') + (c.marketing ? 'marketing' : ''));
  }
  function save(c) { store(KEY, JSON.stringify(c)); loadTrackers(c); banner.classList.remove('show'); }
  function show(p) { banner.classList.add('show'); $('.prefs', banner).classList.toggle('open', !!p); var b = $('button', banner); if (b) setTimeout(function () { b.focus(); }, 50); }
  if (banner) {
    var saved = null; try { saved = JSON.parse(store(KEY) || 'null'); } catch (e) {}
    if (saved) loadTrackers(saved); else setTimeout(function () { show(false); }, 600);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: true, marketing: true }); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: false, marketing: false }); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () { $('.prefs', banner).classList.toggle('open'); });
    $('[data-ck="save"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: $('#ck-analise').checked, marketing: $('#ck-marketing').checked }); });
    $$('[data-cookie-prefs]').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = null; try { s = JSON.parse(store(KEY) || 'null'); } catch (e) {}
        $('#ck-analise').checked = !!(s && s.analise); $('#ck-marketing').checked = !!(s && s.marketing);
        show(true);
      });
    });
  }
})();

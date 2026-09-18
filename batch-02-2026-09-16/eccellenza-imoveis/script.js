/* Eccellenza Imóveis — MOCKUP script (no framework, no build step) */
(function () {
  'use strict';

  /* CONFIG — verified lines from the live site header (16/09/2026).
     [CONFIRM] that the Vendas and Locação mobiles are the WhatsApp lines. */
  var WA = { vendas: '5548991750033', locacao: '5548991213033' };
  var CONSENT_KEY = 'ecc_cookie_consent_v1';
  var FAV_KEY = 'ecc_favs_demo_v1';

  var html = document.documentElement;
  var lang = (html.lang || 'pt-BR').slice(0, 2);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DICT = {
    pt: { vendas: 'Vendas', locacao: 'Locação', waAria: 'WhatsApp da equipe de ', all: 'Todos os bairros', sel: ' selecionado(s)',
      openMenu: 'Abrir menu', closeMenu: 'Fechar menu',
      searchDemo: 'MOCKUP: busca de demonstração — nenhum resultado real. Contagem: [CONFIRM inventário]. ',
      seePage: 'Ver página da situação', valSale: 'Faixa de valor (venda)', valRent: 'Faixa de valor (aluguel mensal)', valLaunch: 'Faixa de valor (lançamentos)',
      codeDemo: 'MOCKUP: busca por código de demonstração.',
      fill: 'Preencha todos os campos e marque o consentimento para continuar.', consent: 'Para continuar, marque a caixa de consentimento (LGPD).',
      waOpened: 'Abrimos o WhatsApp com a sua mensagem (demonstração).', ownerMsg: 'Olá! Quero anunciar meu imóvel. ',
      ctaSell: 'Continuar no WhatsApp de Vendas', ctaRent: 'Continuar no WhatsApp de Locação',
      simNeed: 'Preencha valor, entrada, prazo e taxa com números válidos.', simFirst: 'Primeira parcela estimada', simLast: 'Última parcela estimada', simFin: 'Valor financiado', simConst: 'Parcela fixa estimada (Price)', favOn: 'Remover dos favoritos', favOff: 'Salvar nos favoritos',
      locale: 'pt-BR' },
    es: { vendas: 'Ventas', locacao: 'Alquiler', waAria: 'WhatsApp del equipo de ', all: 'Todos los barrios', sel: ' seleccionado(s)',
      openMenu: 'Abrir menú', closeMenu: 'Cerrar menú',
      searchDemo: 'MOCKUP: búsqueda de demostración — sin resultados reales. Cantidad: [CONFIRM inventario]. ',
      seePage: 'Ver página de la situación', valSale: 'Rango de valor (venta)', valRent: 'Rango de valor (alquiler mensual)', valLaunch: 'Rango de valor (lanzamientos)',
      codeDemo: 'MOCKUP: búsqueda por código de demostración.',
      fill: 'Complete todos los campos y marque el consentimiento para continuar.', consent: 'Para continuar, marque la casilla de consentimiento (LGPD).',
      waOpened: 'Abrimos WhatsApp con su mensaje (demostración).', ownerMsg: '¡Hola! Quiero publicar mi inmueble. ',
      ctaSell: 'Continuar en el WhatsApp de Ventas', ctaRent: 'Continuar en el WhatsApp de Alquiler',
      simNeed: 'Complete valor, entrada, plazo y tasa con números válidos.', simFirst: 'Primera cuota estimada', simLast: 'Última cuota estimada', simFin: 'Monto financiado', simConst: 'Cuota fija estimada (Price)', favOn: 'Quitar de favoritos', favOff: 'Guardar en favoritos',
      locale: 'es-AR' },
    en: { vendas: 'Sales', locacao: 'Rentals', waAria: 'WhatsApp — ', all: 'All neighbourhoods', sel: ' selected',
      openMenu: 'Open menu', closeMenu: 'Close menu',
      searchDemo: 'MOCKUP: demo search — no real results. Count: [CONFIRM inventory]. ',
      seePage: 'See the situation page', valSale: 'Price range (sale)', valRent: 'Price range (monthly rent)', valLaunch: 'Price range (launches)',
      codeDemo: 'MOCKUP: demo code search.',
      fill: 'Please fill in every field and tick the consent box to continue.', consent: 'Please tick the consent box (LGPD) to continue.',
      waOpened: 'WhatsApp opened with your message (demo).', ownerMsg: 'Hello! I would like to list my property. ',
      ctaSell: 'Continue on the Sales WhatsApp', ctaRent: 'Continue on the Rentals WhatsApp',
      simNeed: 'Enter valid numbers for price, down payment, term and rate.', simFirst: 'Estimated first instalment', simLast: 'Estimated last instalment', simFin: 'Amount financed', simConst: 'Estimated fixed instalment (Price)', favOn: 'Remove from favourites', favOff: 'Save to favourites',
      locale: 'en-GB' }
  };
  if (!DICT[lang]) lang = 'pt';
  var L = DICT[lang];

  var brl = function (n) {
    try { return n.toLocaleString(L.locale || 'pt-BR', { style: 'currency', currency: 'BRL' }); }
    catch (e) { return 'R$ ' + n.toFixed(2); }
  };

  /* year / today */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-today]').forEach(function (el) {
    var d = new Date();
    el.textContent = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
  });

  /* ---------- WhatsApp links ---------- */
  function waHref(branch, text) {
    var n = WA[branch] || WA.vendas;
    return 'https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function refreshWa(a) {
    a.href = waHref(a.getAttribute('data-branch'), a.getAttribute('data-wa-text') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  }
  document.querySelectorAll('.js-wa').forEach(refreshWa);

  var currentBranch = document.body.getAttribute('data-branch') || 'vendas';
  function setBranch(b) {
    if (!WA[b] || b === currentBranch) return;
    currentBranch = b;
    document.querySelectorAll('.js-wa-dynamic, .site-header .wa-pill').forEach(function (a) {
      a.setAttribute('data-branch', b);
      refreshWa(a);
      var lab = a.querySelector('.js-branch-label');
      if (lab) lab.textContent = L[b];
      if (a.classList.contains('wa-float')) a.setAttribute('aria-label', L.waAria + L[b]);
    });
  }
  (function initBranch() {
    var start = currentBranch; currentBranch = '';
    setBranch(start);
    if (!currentBranch) currentBranch = start;
  })();
  var zones = document.querySelectorAll('[data-branch-zone]');
  if (zones.length && 'IntersectionObserver' in window) {
    var zo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setBranch(e.target.getAttribute('data-branch-zone')); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    zones.forEach(function (z) { zo.observe(z); });
  }

  /* ---------- header / menu ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var tick = false;
    var onScroll = function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { header.classList.toggle('is-condensed', window.scrollY > 24); tick = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? L.closeMenu : L.openMenu);
      nav.classList.toggle('is-open', open);
    };
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });
  }

  /* ---------- reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    reveals.forEach(function (el) {
      if (!el.style.getPropertyValue('--i') && el.parentElement) {
        var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
        el.style.setProperty('--i', Math.min(sibs.indexOf(el), 6));
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- generic tablist (roving tabindex + arrow keys) ---------- */
  function tablist(list, onSelect) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tab.focus();
      onSelect(tab);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        else if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (k === 'Home') n = tabs[0];
        else if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  }

  /* ---------- search card ---------- */
  /* Filter bands only (UI), bound to the mode — [CONFIRM bands with the client]. Never listing prices. */
  var SALE = {
    pt: ['Até R$ 800 mil', 'R$ 800 mil a R$ 1,5 milhão', 'R$ 1,5 a R$ 3 milhões', 'Acima de R$ 3 milhões'],
    es: ['Hasta R$ 800 mil', 'R$ 800 mil a R$ 1,5 millón', 'R$ 1,5 a R$ 3 millones', 'Más de R$ 3 millones'],
    en: ['Up to R$ 800k', 'R$ 800k to R$ 1.5M', 'R$ 1.5M to R$ 3M', 'Over R$ 3M']
  }[lang];
  var RENT = {
    pt: ['Até R$ 10 mil/mês', 'R$ 10 mil a R$ 20 mil/mês', 'R$ 20 mil a R$ 35 mil/mês', 'Acima de R$ 35 mil/mês'],
    es: ['Hasta R$ 10 mil/mes', 'R$ 10 mil a R$ 20 mil/mes', 'R$ 20 mil a R$ 35 mil/mes', 'Más de R$ 35 mil/mes'],
    en: ['Up to R$ 10k/month', 'R$ 10k to R$ 20k/month', 'R$ 20k to R$ 35k/month', 'Over R$ 35k/month']
  }[lang];
  var LADDERS = { comprar: SALE, alugar: RENT, lancamentos: SALE };
  var anyLabel = { pt: 'Qualquer valor', es: 'Cualquier valor', en: 'Any price' }[lang];
  var LANDING = {
    comprar: { 'aceita-pet': 'comprar/aceita-pet/index.html', 'estuda-permuta': 'comprar/estuda-permuta/index.html', 'mcmv': 'comprar/mcmv/index.html', 'na-planta': 'comprar/na-planta/index.html', 'em-construcao': 'comprar/na-planta/index.html' },
    alugar: { 'sem-fiador': 'alugar/sem-fiador/index.html' },
    lancamentos: { 'na-planta': 'comprar/na-planta/index.html', 'em-construcao': 'comprar/na-planta/index.html' }
  };
  var rootPrefix = document.body.getAttribute('data-root') || '';

  document.querySelectorAll('[data-search]').forEach(function (form) {
    var mode = form.getAttribute('data-start-mode') || 'comprar';
    var panel = form.querySelector('[role="tabpanel"]');
    var valor = form.querySelector('[data-valor]');
    var valorLabel = form.querySelector('[data-valor-label]');
    var result = form.querySelector('[data-result]');
    var chips = form.querySelectorAll('.chip');
    var resultDefault = result ? result.innerHTML : '';

    function applyMode(m, animate) {
      mode = m;
      if (valor) {
        valor.innerHTML = '';
        var o0 = document.createElement('option'); o0.value = ''; o0.textContent = anyLabel; valor.appendChild(o0);
        LADDERS[m].forEach(function (txt) { var o = document.createElement('option'); o.textContent = txt; valor.appendChild(o); });
      }
      if (valorLabel) valorLabel.textContent = m === 'alugar' ? L.valRent : (m === 'lancamentos' ? L.valLaunch : L.valSale);
      chips.forEach(function (c) {
        var modes = c.getAttribute('data-modes');
        var show = !modes || modes.split(' ').indexOf(m) > -1;
        if (!show) c.setAttribute('aria-pressed', 'false');
        c.hidden = !show;
      });
      if (result) result.innerHTML = resultDefault;
      setBranch(m === 'alugar' ? 'locacao' : 'vendas');
      if (animate && panel && !reduce) {
        panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering');
      }
    }
    var tl = form.querySelector('[role="tablist"]');
    if (tl) tablist(tl, function (tab) {
      if (panel) panel.setAttribute('aria-labelledby', tab.id);
      applyMode(tab.getAttribute('data-mode'), true);
    });

    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
      });
    });

    form.querySelectorAll('[data-multi]').forEach(function (d) {
      var sum = d.querySelector('[data-multi-summary]');
      var boxes = d.querySelectorAll('input[type="checkbox"]');
      var upd = function () {
        var sel = Array.prototype.filter.call(boxes, function (b) { return b.checked; }).map(function (b) { return b.value; });
        sum.textContent = !sel.length ? L.all : (sel.length <= 2 ? sel.join(', ') : sel.length + L.sel);
      };
      boxes.forEach(function (b) { b.addEventListener('change', upd); });
      document.addEventListener('click', function (e) { if (d.open && !d.contains(e.target)) d.open = false; });
      d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { d.open = false; sum.focus(); } });
    });

    var codeBtn = form.querySelector('[data-code-toggle]');
    var codeIn = form.querySelector('#code-input, [data-code-input]');
    if (codeBtn && codeIn) {
      codeBtn.addEventListener('click', function () {
        var open = codeIn.hidden;
        codeIn.hidden = !open;
        codeBtn.setAttribute('aria-expanded', String(open));
        if (open) codeIn.focus();
      });
      codeIn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); if (result) result.textContent = L.codeDemo; }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!result) return;
      var active = Array.prototype.filter.call(chips, function (c) { return c.getAttribute('aria-pressed') === 'true' && !c.hidden; })
        .map(function (c) { return c.getAttribute('data-chip'); });
      result.textContent = L.searchDemo;
      var target = null;
      active.some(function (k) { if (LANDING[mode] && LANDING[mode][k]) { target = LANDING[mode][k]; return true; } return false; });
      if (!target) target = mode === 'alugar' ? 'alugar/index.html' : 'comprar/index.html';
      if (lang === 'pt' || rootPrefix) {
        var a = document.createElement('a');
        a.href = rootPrefix + target;
        a.textContent = L.seePage + ' →';
        result.appendChild(a);
      }
    });
    applyMode(mode, false);
  });

  /* ---------- favourites (demo, per-browser) ---------- */
  var favs = {};
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY)) || {}; } catch (e) { favs = {}; }
  document.querySelectorAll('.fav').forEach(function (b, i) {
    var key = location.pathname + '#' + i;
    var set = function (on) { b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', on ? L.favOn : L.favOff); };
    set(!!favs[key]);
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      set(on);
      if (on) favs[key] = 1; else delete favs[key];
      try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* ignore */ }
    });
  });

  /* ---------- launch stage filter ---------- */
  document.querySelectorAll('.stage-chips').forEach(function (group) {
    var btns = group.querySelectorAll('[data-stage]');
    var scope = group.parentElement;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var s = b.getAttribute('data-stage');
        scope.querySelectorAll('[data-stage-card]').forEach(function (card) {
          card.hidden = !(s === 'all' || card.getAttribute('data-stage-card') === s);
        });
      });
    });
  });

  /* ---------- simulator (indicative only) ---------- */
  var num = function (v) {
    v = String(v || '').trim();
    if (!v) return NaN;
    if (v.indexOf(',') > -1) v = v.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, '');
    return parseFloat(v.replace(/[^\d.]/g, ''));
  };
  document.querySelectorAll('[data-sim]').forEach(function (f) {
    var out = f.querySelector('[data-sim-out]');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var V = num(f.valor.value), E = num(f.entrada.value), n = Math.round(num(f.prazo.value)), ta = num(f.taxa.value);
      var sys = (f.querySelector('input[name="sistema"]:checked') || {}).value;
      var P = V - E;
      if (!(V > 0) || !(E >= 0) || !(n > 0) || !(ta >= 0) || !(P > 0)) { out.innerHTML = '<span class="muted small">' + L.simNeed + '</span>'; return; }
      var i = Math.pow(1 + ta / 100, 1 / 12) - 1;
      var htmlOut = '<div class="small muted">' + L.simFin + ': <strong>' + brl(P) + '</strong></div>';
      if (sys === 'price') {
        var pmt = i === 0 ? P / n : P * i / (1 - Math.pow(1 + i, -n));
        htmlOut += '<div class="small muted" style="margin-top:.4rem">' + L.simConst + '</div><div class="big">' + brl(pmt) + '</div>';
      } else {
        var amort = P / n;
        var first = amort + P * i;
        var last = amort + amort * i;
        htmlOut += '<div class="small muted" style="margin-top:.4rem">' + L.simFirst + '</div><div class="big">' + brl(first) + '</div>' +
          '<div class="small muted">' + L.simLast + ': ' + brl(last) + '</div>';
      }
      out.innerHTML = htmlOut;
    });
  });

  /* ---------- owner form ---------- */
  document.querySelectorAll('.js-owner-form').forEach(function (form) {
    var goal = 'vender';
    var cta = form.querySelector('[data-owner-cta]');
    var notice = form.querySelector('.demo-notice');
    var tl = form.querySelector('[role="tablist"]');
    var pnl = form.querySelector('[role="tabpanel"]');
    if (tl) tablist(tl, function (tab) {
      goal = tab.getAttribute('data-owner');
      if (pnl) pnl.setAttribute('aria-labelledby', tab.id);
      form.querySelectorAll('[data-owner-field]').forEach(function (fld) {
        var on = fld.getAttribute('data-owner-field') === goal;
        fld.hidden = !on;
        fld.querySelectorAll('select,input').forEach(function (x) { x.required = on; });
      });
      if (cta) cta.textContent = goal === 'alugar' ? L.ctaRent : L.ctaSell;
      setBranch(goal === 'alugar' ? 'locacao' : 'vendas');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var consent = form.querySelector('input[name="lgpd"]');
      var missing = Array.prototype.filter.call(form.querySelectorAll('[required]'), function (f) {
        if (f.closest('[hidden]')) return false;
        return f.type === 'checkbox' ? !f.checked : !String(f.value).trim();
      });
      if (missing.length) {
        notice.textContent = (consent && !consent.checked && missing.length === 1) ? L.consent : L.fill;
        notice.classList.add('is-shown'); missing[0].focus(); return;
      }
      var parts = [goal === 'alugar' ? '[Locação]' : '[Venda]'];
      form.querySelectorAll('select, input[type="text"]').forEach(function (f) {
        if (f.closest('[hidden]')) return;
        var lab = form.querySelector('label[for="' + f.id + '"]');
        parts.push((lab ? lab.textContent.trim() : f.name) + ': ' + f.value.trim());
      });
      window.open(waHref(goal === 'alugar' ? 'locacao' : 'vendas', L.ownerMsg + parts.join(' | ')), '_blank', 'noopener');
      notice.textContent = L.waOpened;
      notice.classList.add('is-shown');
    });
  });

  /* ---------- FAQ tabs ---------- */
  document.querySelectorAll('.faq-tabs').forEach(function (list) {
    tablist(list, function (tab) {
      list.querySelectorAll('[role="tab"]').forEach(function (t) {
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = t !== tab;
      });
    });
  });

  /* ---------- click-to-load map ---------- */
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slot = btn.closest('[data-map]');
      var q = slot.getAttribute('data-query') || '';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed';
      iframe.title = 'Mapa: ' + q;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      slot.innerHTML = '';
      slot.classList.add('is-loaded');
      slot.appendChild(iframe);
    });
  });

  /* ---------- LGPD cookie banner (tags gated on consent) ---------- */
  var banner = document.getElementById('cookie');
  if (banner) {
    var prefsBox = document.getElementById('cookie-prefs');
    var prefsBtn = banner.querySelector('[data-cookie="prefs"]');
    var saveBtn = banner.querySelector('[data-cookie="save"]');
    var boxes = banner.querySelectorAll('input[data-cat]');
    var read = function () { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; } };
    var write = function (v) { try { localStorage.setItem(CONSENT_KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } };
    var togglePrefs = function (show) {
      prefsBox.classList.toggle('is-open', show);
      prefsBtn.setAttribute('aria-expanded', String(show));
      saveBtn.hidden = !show;
    };
    var apply = function (c) {
      window.__consent = c;
      html.setAttribute('data-consent-analise', c && c.analise ? 'yes' : 'no');
      html.setAttribute('data-consent-marketing', c && c.marketing ? 'yes' : 'no');
      // PRODUCTION HOOK: inject Google Tag Manager only if c.analise, Meta Pixel only if c.marketing.
      // Nothing is loaded in this mockup.
    };
    var open = function (showPrefs) {
      var c = read();
      boxes.forEach(function (b) { b.checked = !!(c && c[b.getAttribute('data-cat')]); });
      banner.hidden = false;
      togglePrefs(!!showPrefs);
      requestAnimationFrame(function () { banner.classList.add('is-open'); });
    };
    var close = function () {
      banner.classList.remove('is-open');
      setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 400);
    };
    var decide = function (a, m) {
      var c = { necessarios: true, analise: a, marketing: m, data: new Date().toISOString() };
      write(c); apply(c); close();
    };
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') decide(true, true);
      else if (act === 'reject') decide(false, false);
      else if (act === 'prefs') togglePrefs(!prefsBox.classList.contains('is-open'));
      else if (act === 'save') {
        var v = {}; boxes.forEach(function (x) { v[x.getAttribute('data-cat')] = x.checked; });
        decide(!!v.analise, !!v.marketing);
      }
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); open(true); });
    });
    var ex = read();
    if (ex) apply(ex); else open(false);
  }
})();

/* Imóveis com Cris — mockup interactions. Sem dependências, sem backend. */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = 'https://wa.me/5548999098380'; /* número confirmado no link atual da corretora */

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } }

  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Cabeçalho + barra mobile */
  var header = $('.site-header');
  var mbar = $('.mbar');
  var tick = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (mbar && y > 80) mbar.classList.add('show');
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; window.requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Menu mobile em tela cheia */
  var toggle = $('.menu-toggle');
  var nav = $('#site-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
  }

  /* Revelação com escalonamento */
  $$('[data-stagger]').forEach(function (g) { $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--i', String(i)); }); });
  var reveals = $$('.reveal');
  var counters = $$('[data-count]');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce) { el.textContent = String(target).padStart(2, '0'); return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1100, 1);
      var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = String(v).padStart(2, '0');
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  /* Contador verdadeiro: número de blocos de bairro presentes na página */
  counters.forEach(function (el) {
    var sel = el.getAttribute('data-count-from');
    if (sel) el.setAttribute('data-count', String($$(sel).length));
    el.textContent = reduce ? String($$(sel).length).padStart(2, '0') : '00';
  });
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    counters.forEach(runCount);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Carrossel: setas, teclado, arrasto */
  var track = $('#shelf');
  var prev = $('[data-shelf="prev"]');
  var next = $('[data-shelf="next"]');
  function visibleCards() { return $$('.listing', track).filter(function (c) { return !c.hidden; }); }
  function stepSize() {
    var c = visibleCards()[0];
    return c ? c.getBoundingClientRect().width + 16 : track.clientWidth;
  }
  function updateArrows() {
    if (!track || !prev || !next) return;
    var max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  }
  if (track) {
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -stepSize(), behavior: reduce ? 'auto' : 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: stepSize(), behavior: reduce ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(updateArrows); }, { passive: true });
    window.addEventListener('resize', updateArrows);
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: stepSize(), behavior: reduce ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -stepSize(), behavior: reduce ? 'auto' : 'smooth' }); }
    });
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (e.target.closest('a,button')) return;
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); }
      if (moved) track.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      if (moved) {
        track.classList.remove('dragging');
        var w = stepSize();
        track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
    updateArrows();
  }

  /* Busca honesta: filtra os cards de demonstração */
  var filter = $('#filtro');
  if (filter && track) {
    var status = $('#filtro-status');
    var empty = $('#filtro-vazio');
    function apply() {
      var tipo = $('#f-tipo').value;
      var others = ['#f-bairro', '#f-preco', '#f-dorm', '#f-vagas'].some(function (s) { return $(s).value !== ''; });
      var shown = 0;
      $$('.listing', track).forEach(function (card) {
        var ok = !others && (tipo === '' || card.getAttribute('data-demo-tipo') === tipo);
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.classList.toggle('show', shown === 0);
      if (status) {
        status.textContent = shown === 0
          ? 'Nenhum card de demonstração corresponde. Bairro, preço, dormitórios e vagas ainda não têm dados — os cards são estruturas vazias.'
          : shown + ' card(s) de demonstração exibido(s) — não é contagem de estoque.';
      }
      track.scrollLeft = 0;
      updateArrows();
    }
    filter.addEventListener('change', apply);
    filter.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    filter.addEventListener('reset', function () { window.setTimeout(apply, 0); });
  }

  /* Fale com a Cris: compõe a mensagem e abre o WhatsApp — nada é armazenado */
  var intake = $('#intake');
  if (intake) {
    var preview = $('#wa-bubble');
    function compose() {
      var get = function (n) {
        var el = intake.querySelector('[name="' + n + '"]');
        if (!el) return '';
        if (el.type === 'radio') { var c = intake.querySelector('[name="' + n + '"]:checked'); return c ? c.value : ''; }
        return (el.value || '').trim();
      };
      var lines = [
        'Olá Cris, vim pelo site e gostaria de falar sobre imóveis.',
        'Nome: ' + (get('nome') || '—'),
        'WhatsApp: ' + (get('whatsapp') || '—'),
        'Procuro: ' + (get('objetivo') || '—'),
        'Bairro de interesse: ' + (get('bairro') || '—'),
        'Faixa de preço: ' + (get('faixa') || '—'),
        'Prazo: ' + (get('prazo') || '—')
      ];
      return lines.join('\n');
    }
    function refresh() { if (preview) preview.textContent = compose(); }
    intake.addEventListener('input', refresh);
    intake.addEventListener('change', refresh);
    refresh();
    intake.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('.form-status', intake);
      var consent = $('#in-lgpd');
      st.classList.remove('error');
      if (!intake.checkValidity()) {
        st.textContent = 'Preencha nome, WhatsApp e o que você procura.';
        st.classList.add('show', 'error');
        intake.reportValidity();
        return;
      }
      if (!consent.checked) {
        st.textContent = 'Para continuar, marque a caixa de consentimento.';
        st.classList.add('show', 'error');
        consent.focus();
        return;
      }
      var url = WA + '?text=' + encodeURIComponent(compose());
      st.textContent = 'Abrindo o WhatsApp da Cris… Se nada abrir, use este link: ';
      var a = doc.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'abrir conversa';
      st.appendChild(a);
      st.classList.add('show');
      window.open(url, '_blank', 'noopener');
    });
  }

  /* Acordeão FAQ */
  $$('.faq-q button').forEach(function (btn) {
    var panel = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = false;
    panel.style.maxHeight = '0px';
    panel.setAttribute('aria-hidden', 'true');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.setAttribute('aria-hidden', open ? 'true' : 'false');
      panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* Mapa: só carrega após clique */
  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.map-panel');
      if (!panel || panel.querySelector('iframe')) return;
      var f = doc.createElement('iframe');
      f.src = btn.getAttribute('data-src');
      f.title = btn.getAttribute('data-title') || 'Mapa';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      panel.appendChild(f);
    });
  });

  /* Cookies (LGPD) */
  var KEY = 'cris-cookie-consent';
  var banner = $('#cookie');
  function read() { try { return JSON.parse(lsGet(KEY) || 'null'); } catch (e) { return null; } }
  function save(o) { o.data = new Date().toISOString(); lsSet(KEY, JSON.stringify(o)); }
  function show(prefs) {
    if (!banner) return;
    var c = read() || {};
    $('#ck-analise').checked = !!c.analise;
    $('#ck-marketing').checked = !!c.marketing;
    $('.cookie-prefs', banner).classList.toggle('show', !!prefs);
    banner.classList.add('show');
    if (prefs) { var h = $('h2', banner); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  function hide() { banner.classList.remove('show'); }
  if (banner) {
    if (!read()) show(false);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: true, marketing: true }); hide(); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { save({ necessarios: true, analise: false, marketing: false }); hide(); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () { $('.cookie-prefs', banner).classList.toggle('show'); });
    $('[data-ck="save"]', banner).addEventListener('click', function () {
      save({ necessarios: true, analise: $('#ck-analise').checked, marketing: $('#ck-marketing').checked });
      hide();
    });
  }
  $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function () { show(true); }); });
})();

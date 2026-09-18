/* Mockup — script compartilhado do lote (sem dependências) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Cabeçalho que condensa ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-condensed', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000) setOpen(false);
    });
  }

  /* ---------- Revelação ao rolar (com escalonamento) ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var i = 0;
    Array.prototype.forEach.call(group.children, function (child) {
      if (child.classList.contains('reveal')) {
        child.style.setProperty('--d', (i * 100) + 'ms');
        i++;
      }
    });
  });
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax suave (somente transform) ---------- */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!reduce && parallaxEls.length) {
    var ticking = false;
    var runParallax = function () {
      var y = window.scrollY;
      parallaxEls.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        if (y < window.innerHeight * 1.5) {
          el.style.transform = 'translate3d(0,' + (y * f).toFixed(1) + 'px,0) scale(1.08)';
        }
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(runParallax); ticking = true; }
    }, { passive: true });
    runParallax();
  }

  /* ---------- Horário e status aberto/fechado ---------- */
  var DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  function nowInSaoPaulo() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
      var h = parseInt(map.hour, 10) % 24;
      return { day: wd, minutes: h * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function toMin(hhmm) { var p = hhmm.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function fmtHour(hhmm) {
    var p = hhmm.split(':');
    var h = parseInt(p[0], 10);
    return p[1] === '00' ? h + 'h' : h + 'h' + p[1];
  }

  var now = nowInSaoPaulo();
  document.querySelectorAll('[data-day]').forEach(function (row) {
    if (parseInt(row.getAttribute('data-day'), 10) === now.day) {
      row.classList.add('is-today');
      var tag = row.querySelector('.today-tag');
      if (tag) tag.hidden = false;
    }
  });

  var hours = null;
  try {
    var raw = document.body.getAttribute('data-hours');
    if (raw) hours = JSON.parse(raw);
  } catch (e) { hours = null; }

  function computeStatus() {
    if (!hours || !hours.days) {
      return { state: 'unknown', text: 'Horário de atendimento a confirmar' };
    }
    var n = nowInSaoPaulo();
    var today = hours.days[String(n.day)];
    var suffix = hours.confirmed ? '' : ' (horário a confirmar)';
    if (today && n.minutes >= toMin(today[0]) && n.minutes < toMin(today[1])) {
      return { state: 'open', text: 'Aberto agora · fecha às ' + fmtHour(today[1]) + suffix };
    }
    if (today && n.minutes < toMin(today[0])) {
      return { state: 'closed', text: 'Fechado · abre hoje às ' + fmtHour(today[0]) + suffix };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (n.day + i) % 7;
      var slot = hours.days[String(d)];
      if (slot) {
        var when = i === 1 ? 'amanhã' : DAY_NAMES[d];
        return { state: 'closed', text: 'Fechado · abre ' + when + ' às ' + fmtHour(slot[0]) + suffix };
      }
    }
    return { state: 'unknown', text: 'Horário de atendimento a confirmar' };
  }
  function paintStatus() {
    var s = computeStatus();
    document.querySelectorAll('[data-open-status]').forEach(function (el) {
      if (el.getAttribute('data-state') !== s.state || el.textContent !== s.text) {
        el.setAttribute('data-state', s.state);
        var label = el.querySelector('.status-text');
        if (label) label.textContent = s.text; else el.textContent = s.text;
        if (!reduce) {
          el.classList.remove('status-flash');
          void el.offsetWidth;
          el.classList.add('status-flash');
        }
      }
    });
  }
  paintStatus();
  window.setInterval(paintStatus, 60000);

  /* ---------- Mapa: só carrega após clique (LGPD) ---------- */
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.map-panel');
      if (!panel) return;
      var frame = panel.querySelector('.map-frame');
      var iframe = document.createElement('iframe');
      iframe.src = btn.getAttribute('data-map-load');
      iframe.title = btn.getAttribute('data-map-title') || 'Mapa';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      frame.innerHTML = '';
      frame.appendChild(iframe);
      panel.classList.add('is-loaded');
      btn.hidden = true;
    });
  });

  /* ---------- Formulários de demonstração ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      var note = form.querySelector('.form-notice');
      if (note) {
        note.hidden = false;
        note.textContent = 'Demonstração: nenhum dado foi enviado. No site real, este formulário encaminha a mensagem ao escritório [CONFIRM canal].';
        note.focus();
      }
    });
  });

  /* ---------- Total mensal aproximado (blocos de preço) ---------- */
  document.querySelectorAll('[data-total]').forEach(function (out) {
    var block = out.closest('[data-price-block]');
    if (!block) return;
    var sum = 0, ok = true;
    block.querySelectorAll('[data-amount]').forEach(function (el) {
      var v = parseFloat(el.getAttribute('data-amount'));
      if (isNaN(v)) ok = false; else sum += v;
    });
    if (ok) {
      out.textContent = sum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
  });

  /* ---------- Banner de cookies (LGPD) ---------- */
  var KEY = 'cookie-consent-v1';
  var banner = document.getElementById('cookie-banner');
  function readConsent() {
    try { return JSON.parse(window.localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function writeConsent(obj) {
    try { window.localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) { /* armazenamento indisponível */ }
  }
  if (banner) {
    var prefsPanel = banner.querySelector('.cookie-prefs');
    var chkA = banner.querySelector('input[name="analise"]');
    var chkM = banner.querySelector('input[name="marketing"]');
    var openBanner = function (showPrefs) {
      var c = readConsent();
      if (chkA) chkA.checked = !!(c && c.analise);
      if (chkM) chkM.checked = !!(c && c.marketing);
      banner.hidden = false;
      if (prefsPanel) prefsPanel.hidden = !showPrefs;
      window.requestAnimationFrame(function () { banner.classList.add('is-visible'); });
      var first = banner.querySelector('button');
      if (first) first.focus({ preventScroll: true });
    };
    var closeBanner = function () {
      banner.classList.remove('is-visible');
      window.setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 250);
    };
    var save = function (a, m) {
      writeConsent({ necessarios: true, analise: a, marketing: m, data: new Date().toISOString() });
      closeBanner();
    };
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      if (act === 'accept') save(true, true);
      else if (act === 'reject') save(false, false);
      else if (act === 'prefs') { if (prefsPanel) prefsPanel.hidden = !prefsPanel.hidden; }
      else if (act === 'save') save(!!(chkA && chkA.checked), !!(chkM && chkM.checked));
    });
    document.querySelectorAll('[data-cookie-open]').forEach(function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); });
    });
    if (!readConsent()) openBanner(false);
  }

  /* ---------- Orientador de garantias (se existir na página) ---------- */
  var wiz = document.getElementById('wizard');
  if (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll('.wz-step'));
    var result = document.getElementById('wizard-result');
    var progress = wiz.querySelector('.wz-progress-bar');
    var counter = wiz.querySelector('.wz-count');
    var idx = 0;
    wiz.classList.add('is-enhanced');
    if (reduce) wiz.classList.add('is-static');

    var show = function (i) {
      idx = i;
      if (!wiz.classList.contains('is-static')) {
        steps.forEach(function (s, k) {
          s.hidden = k !== i;
          s.classList.toggle('is-current', k === i);
        });
      }
      if (progress) progress.style.transform = 'scaleX(' + ((i + 1) / steps.length) + ')';
      if (counter) counter.textContent = 'Pergunta ' + (i + 1) + ' de ' + steps.length;
      var legend = steps[i] && steps[i].querySelector('legend');
      if (legend && !wiz.classList.contains('is-static')) {
        legend.setAttribute('tabindex', '-1');
        legend.focus({ preventScroll: true });
      }
    };
    var val = function (name) {
      var el = wiz.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : '';
    };

    wiz.addEventListener('click', function (e) {
      var b = e.target.closest('[data-wz]');
      if (!b) return;
      var act = b.getAttribute('data-wz');
      if (act === 'next') {
        var cur = steps[idx];
        if (!cur.querySelector('input:checked')) {
          var err = cur.querySelector('.wz-error');
          if (err) { err.hidden = false; }
          return;
        }
        var err2 = cur.querySelector('.wz-error');
        if (err2) err2.hidden = true;
        if (idx < steps.length - 1) show(idx + 1);
      } else if (act === 'back') {
        if (idx > 0) show(idx - 1);
      } else if (act === 'reset') {
        wiz.reset();
        if (result) { result.hidden = true; result.innerHTML = ''; }
        show(0);
      }
    });

    wiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var fiador = val('fiador');
      var mensal = val('mensal');
      var deposito = val('deposito');
      var perfil = val('perfil');
      if (!fiador || !mensal || !deposito || !perfil) {
        if (result) {
          result.hidden = false;
          result.innerHTML = '<p class="wz-warn">Responda às quatro perguntas para ver a explicação.</p>';
        }
        return;
      }
      var semCpf = perfil === 'estrangeiro';
      var rows = [];

      rows.push({
        name: 'Fiador', href: 'garantias-de-aluguel/fiador/index.html',
        state: fiador === 'sim' ? 'possivel' : (fiador === 'nao-sei' ? 'verificar' : 'depende'),
        why: fiador === 'sim'
          ? 'Você indicou ter uma pessoa com imóvel próprio em Florianópolis. Essa é a condição central desta modalidade.'
          : (fiador === 'nao-sei'
            ? 'Vale verificar com a pessoa se o imóvel dela atende às exigências (registro em nome dela, situação da matrícula).'
            : 'Esta modalidade depende de um fiador com imóvel; você indicou não ter um no momento.'),
        needs: 'Do fiador: documentos pessoais, comprovante de renda e matrícula atualizada do imóvel [CONFIRM lista da imobiliária].'
      });
      rows.push({
        name: 'Seguro-fiança', href: 'garantias-de-aluguel/seguro-fianca/index.html',
        state: semCpf ? 'depende' : 'possivel',
        why: semCpf
          ? 'A contratação costuma exigir CPF e passa por análise cadastral da seguradora [CONFIRM].'
          : 'Não exige imóvel nem fiador; o prêmio é pago à seguradora (à vista ou parcelado) e a contratação depende de análise cadastral feita por ela.' + (mensal === 'mensal' ? ' Você indicou preferir pagar mensalidades.' : ''),
        needs: 'Documentos pessoais e comprovação de renda para a análise da seguradora — ' + ({ servidor: 'para servidor público, em geral contracheques recentes', clt: 'para carteira assinada, em geral holerites', autonomo: 'para autônomos, em geral extratos, DECORE ou declaração de IR', estrangeiro: 'para estrangeiros, documentação específica' }[perfil] || 'documentação variável') + ' [CONFIRM].'
      });
      rows.push({
        name: 'Caução em dinheiro', href: 'garantias-de-aluguel/caucao/index.html',
        state: deposito === 'sim' ? 'possivel' : 'depende',
        why: deposito === 'sim'
          ? 'Você indicou ter valor disponível. Pela Lei 8.245/91 (art. 38, §2º), a caução em dinheiro não pode passar de três meses de aluguel.'
          : 'Esta modalidade depende de um depósito (limitado por lei a três meses de aluguel); você indicou não ter esse valor agora.',
        needs: 'O valor do depósito, feito em caderneta de poupança conforme a lei [CONFIRM procedimento da imobiliária].'
      });
      rows.push({
        name: 'Título de capitalização', href: 'garantias-de-aluguel/titulo-de-capitalizacao/index.html',
        state: semCpf ? 'depende' : (deposito === 'sim' ? 'possivel' : 'verificar'),
        why: semCpf
          ? 'A compra do título costuma exigir CPF [CONFIRM].'
          : 'O título é comprado de uma vez pelo inquilino e fica vinculado ao contrato; o valor exigido varia [CONFIRM].',
        needs: 'Recursos para adquirir o título e documentos pessoais [CONFIRM].'
      });

      var label = { possivel: 'Costuma ser um caminho nesta situação', verificar: 'Vale verificar', depende: 'Depende de algo que você indicou não ter' };
      var html = '<h3 class="wz-result-title" tabindex="-1">Rotas que costumam existir na situação descrita</h3>' +
        '<p class="wz-disclaimer"><strong>Isto não é aprovação nem recomendação.</strong> A análise é feita pela imobiliária e/ou pela seguradora; a aprovação não é garantida. Ferramenta apenas informativa — nenhuma resposta foi armazenada ou enviada.</p><ul class="wz-list">';
      rows.forEach(function (r) {
        html += '<li class="wz-item" data-state="' + r.state + '"><div class="wz-item-head"><strong>' + r.name + '</strong>' +
          '<span class="chip chip--' + r.state + '">' + label[r.state] + '</span></div>' +
          '<p>' + r.why + '</p><p class="wz-needs"><span>O que costuma ser pedido:</span> ' + r.needs + '</p>' +
          '<a class="text-link" href="' + (wiz.getAttribute('data-base') || '') + r.href + '">Entender a modalidade <span aria-hidden="true">→</span></a></li>';
      });
      html += '</ul><p class="wz-policy">Modalidades aceitas por esta imobiliária: [CONFIRM]</p>' +
        '<div class="wz-cta"><a class="btn btn-cta" href="' + (wiz.getAttribute('data-contact') || '#contato') + '">Fale com a gente</a><button type="button" class="btn btn-ghost" data-wz-reset>Recomeçar</button></div>';
      html = html.replace(/\[CONFIRM([^\]]*)\]/g, '<span class="confirm">[CONFIRM$1]</span>');
      result.innerHTML = html;
      result.hidden = false;
      var t = result.querySelector('.wz-result-title');
      if (t) t.focus({ preventScroll: false });
      var rb = result.querySelector('[data-wz-reset]');
      if (rb) rb.addEventListener('click', function () {
        wiz.reset(); result.hidden = true; result.innerHTML = ''; show(0);
      });
    });

    show(0);
  }
})();

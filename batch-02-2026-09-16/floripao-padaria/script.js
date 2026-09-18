/* Floripão — MOCKUP interactions. No framework, no build step. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var EN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var T = EN ? {
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today', closed: 'closed',
    empty: 'not chosen yet',
    required: 'Please fill in this field.',
    dateFmt: 'Use the format DD/MM (e.g. 05/11).',
    datePast: 'This date has already passed.',
    consent: 'Consent is required to continue.',
    built: 'Message ready. DEMO ONLY: nothing was sent. The WhatsApp number is still [CONFIRM]; until it is confirmed, orders go by phone on (48) 3232-2425.',
    copied: 'Message copied.',
    copyFail: 'Could not copy automatically. Select the text above.',
    news: 'DEMO ONLY: nothing was sent. On the live site you would receive a confirmation e-mail (double opt-in) before being added to the list.',
    msgHead: 'Hello Floripão! I would like to order a cake:',
    labels: { ocasiao: 'Occasion', tamanho: 'Size / serves', sabor: 'Flavour', recheio: 'Filling', acabamento: 'Finish', entrega: 'Pickup or delivery', data: 'Date (DD/MM)', alergias: 'Allergies / restrictions', nome: 'Name', obs: 'Notes' },
    none: 'none declared'
  } : {
    days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje', closed: 'fechado',
    empty: 'ainda não escolhido',
    required: 'Preencha este campo.',
    dateFmt: 'Use o formato DD/MM (ex.: 05/11).',
    datePast: 'Essa data já passou.',
    consent: 'O consentimento é necessário para continuar.',
    built: 'Mensagem pronta. DEMONSTRAÇÃO: nada foi enviado. O número de WhatsApp ainda é [CONFIRM]; até ser confirmado, encomendas pelo telefone (48) 3232-2425.',
    copied: 'Mensagem copiada.',
    copyFail: 'Não foi possível copiar automaticamente. Selecione o texto acima.',
    news: 'DEMONSTRAÇÃO: nada foi enviado. No site real você receberia um e-mail de confirmação (dupla confirmação) antes de entrar na lista.',
    msgHead: 'Olá, Floripão! Gostaria de encomendar um bolo:',
    labels: { ocasiao: 'Ocasião', tamanho: 'Tamanho / rendimento', sabor: 'Sabor', recheio: 'Recheio', acabamento: 'Acabamento', entrega: 'Retirada ou entrega', data: 'Data (DD/MM)', alergias: 'Alergias / restrições', nome: 'Nome', obs: 'Observações' },
    none: 'nenhuma informada'
  };

  /* ---------- year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- today's hours (directory hours — [CONFIRM]) ---------- */
  var now = new Date();
  var dow = now.getDay();
  $$('[data-schedule]').forEach(function (el) {
    var sched;
    try { sched = JSON.parse(el.getAttribute('data-schedule')); } catch (e) { return; }
    var slot = sched[String(dow)];
    var txt = T.today + ' (' + T.days[dow] + '): ' + (slot ? slot : T.closed);
    var out = $('[data-today-text]', el) || el;
    out.textContent = txt;
  });
  $$('.hours-table tr[data-day]').forEach(function (tr) {
    if (String(dow) === tr.getAttribute('data-day')) tr.classList.add('is-today');
  });

  /* ---------- sticky header ---------- */
  var header = $('.site-header');
  var hero = $('.hero');
  function onScroll() {
    var y = window.pageYOffset || doc.scrollTop;
    if (header) header.classList.toggle('is-condensed', y > 40);
    if (hero && !reduce) {
      var img = $('.hero__media img', hero);
      if (img && y < window.innerHeight * 1.2) {
        // horizontal drift "down the vitrine"
        img.style.setProperty('--px', (-y * 0.12).toFixed(1) + 'px');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = $('.menu-toggle[aria-controls]');
  var mnav = toggle ? document.getElementById(toggle.getAttribute('aria-controls')) : null;
  var scrim = $('.nav-scrim');
  function setMenu(open) {
    if (!mnav) return;
    mnav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    $$('.menu-toggle[aria-controls]').forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var f = $('a,button', mnav); if (f) f.focus(); } else if (toggle) { toggle.focus(); }
  }
  if (toggle && mnav) {
    $$('li', mnav).forEach(function (li, i) { li.style.setProperty('--i', i); });
    $$('.menu-toggle[aria-controls]').forEach(function (b) {
      b.addEventListener('click', function () { setMenu(!mnav.classList.contains('is-open')); });
    });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mnav.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- reveal + stagger ---------- */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--i', i); });
  });
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up (ONLY for verified numbers: add data-count="N" once confirmed) ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (reduce) { el.textContent = target; return; }
      var t0 = null, dur = 1400;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { cio.observe(c); });
    } else { counters.forEach(run); }
  }

  /* ---------- menu category rail ---------- */
  var rail = $('.rail');
  if (rail) {
    var ink = $('.rail__ink', rail);
    var btns = $$('button', rail);
    var items = $$('.menu-grid .item');
    var moveInk = function (b) {
      if (!ink || !b) return;
      ink.style.width = b.offsetWidth + 'px';
      ink.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var cat = b.getAttribute('data-filter');
        items.forEach(function (it) {
          it.hidden = !(cat === 'all' || it.getAttribute('data-cat') === cat);
          if (!it.hidden) it.classList.add('is-in');
        });
        moveInk(b);
        if (b.scrollIntoView) b.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    var active = $('button[aria-pressed="true"]', rail);
    moveInk(active);
    window.addEventListener('resize', function () { moveInk($('button[aria-pressed="true"]', rail)); });
    window.addEventListener('load', function () { moveInk($('button[aria-pressed="true"]', rail)); });
  }

  /* ---------- cake builder ---------- */
  var cake = $('#cake-form');
  if (cake) {
    var fields = ['ocasiao', 'tamanho', 'sabor', 'recheio', 'acabamento', 'entrega', 'data'];
    var bar = $('#cake-progress');
    var msgBox = $('#cake-message');
    var notice = $('#cake-notice');
    var copyBtn = $('#cake-copy');

    var valOf = function (name) {
      var els = cake.elements[name];
      if (!els) return '';
      if (els.length !== undefined && els.tagName !== 'SELECT') {
        for (var i = 0; i < els.length; i++) if (els[i].checked) return els[i].value;
        return '';
      }
      return (els.value || '').trim();
    };
    var allergies = function () {
      return $$('input[name="alergia"]:checked', cake).map(function (c) { return c.value; });
    };
    var render = function (changed) {
      var filled = 0;
      fields.forEach(function (f) {
        var li = $('[data-preview="' + f + '"]');
        if (!li) return;
        var v = valOf(f);
        var b = $('b', li);
        if (v) { filled++; b.textContent = v; li.classList.remove('is-empty'); }
        else { b.textContent = T.empty; li.classList.add('is-empty'); }
        if (changed === f && !reduce) { li.classList.remove('just-set'); void li.offsetWidth; li.classList.add('just-set'); }
      });
      var al = $('[data-preview="alergias"] b');
      if (al) { var a = allergies(); al.textContent = a.length ? a.join(', ') : T.none; }
      if (bar) bar.style.width = Math.round(filled / fields.length * 100) + '%';
    };
    cake.addEventListener('input', function (e) { var n = e.target.name === 'alergia' ? 'alergias' : e.target.name; render(n); clearErr(e.target); });
    cake.addEventListener('change', function (e) { var n = e.target.name === 'alergia' ? 'alergias' : e.target.name; render(n); clearErr(e.target); });
    render();

    var fieldWrap = function (el) { return el && el.closest ? el.closest('.field') : null; };
    var setErr = function (name, msg) {
      var el = cake.elements[name];
      var node = el && el.length !== undefined && el.tagName !== 'SELECT' ? el[0] : el;
      var w = fieldWrap(node);
      if (!w) return;
      w.classList.add('is-invalid');
      var er = $('.error', w);
      if (er) er.textContent = msg;
      if (node && node.setAttribute) node.setAttribute('aria-invalid', 'true');
    };
    function clearErr(el) {
      var w = fieldWrap(el);
      if (w) { w.classList.remove('is-invalid'); }
      if (el && el.removeAttribute) el.removeAttribute('aria-invalid');
    }
    var validDate = function (s) {
      var m = /^(\d{2})\/(\d{2})$/.exec(s);
      if (!m) return 'fmt';
      var d = +m[1], mo = +m[2];
      if (mo < 1 || mo > 12 || d < 1 || d > 31) return 'fmt';
      var y = now.getFullYear();
      var dt = new Date(y, mo - 1, d);
      if (dt.getMonth() !== mo - 1) return 'fmt';
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (dt < today) { dt = new Date(y + 1, mo - 1, d); } // assume next year
      return dt;
    };

    cake.addEventListener('submit', function (e) {
      e.preventDefault();
      $$('.field.is-invalid', cake).forEach(function (w) { w.classList.remove('is-invalid'); });
      var ok = true, first = null;
      fields.concat(['nome', 'telefone']).forEach(function (f) {
        if (!valOf(f)) { setErr(f, T.required); ok = false; first = first || f; }
      });
      var d = valOf('data');
      if (d) {
        var r = validDate(d);
        if (r === 'fmt') { setErr('data', T.dateFmt); ok = false; first = first || 'data'; }
      }
      var consent = cake.elements['lgpd'];
      if (consent && !consent.checked) { setErr('lgpd', T.consent); ok = false; first = first || 'lgpd'; }
      if (!ok) {
        var el = cake.elements[first];
        el = el && el.length !== undefined && el.tagName !== 'SELECT' ? el[0] : el;
        if (el && el.focus) el.focus();
        return;
      }
      var L = T.labels;
      var lines = [T.msgHead, ''];
      ['ocasiao', 'tamanho', 'sabor', 'recheio', 'acabamento', 'entrega', 'data'].forEach(function (f) { lines.push('• ' + L[f] + ': ' + valOf(f)); });
      var a = allergies();
      lines.push('• ' + L.alergias + ': ' + (a.length ? a.join(', ') : T.none));
      var obs = valOf('obs');
      if (obs) lines.push('• ' + L.obs + ': ' + obs);
      lines.push('', L.nome + ': ' + valOf('nome'));
      var msg = lines.join('\n');
      if (msgBox) { msgBox.hidden = false; msgBox.textContent = msg; }
      if (copyBtn) copyBtn.hidden = false;
      if (notice) { notice.textContent = T.built; notice.classList.add('is-shown'); }
      /* When a WhatsApp number is CONFIRMED, open:
         'https://wa.me/55DDDNUMBER?text=' + encodeURIComponent(msg)  */
    });
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var txt = msgBox ? msgBox.textContent : '';
      var done = function () { if (notice) notice.textContent = T.copied; };
      var fail = function () { if (notice) notice.textContent = T.copyFail; };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fail);
        else fail();
      } catch (err) { fail(); }
    });
  }

  /* ---------- generic demo forms ---------- */
  $$('form[data-demo]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('.form-notice', f);
      var c = $('input[type=checkbox][required]', f);
      if (c && !c.checked) { c.focus(); if (n) { n.textContent = T.consent; n.classList.add('is-shown'); } return; }
      if (!f.checkValidity()) { f.reportValidity(); return; }
      if (n) { n.textContent = T.news; n.classList.add('is-shown'); }
      f.reset();
    });
  });

  /* ---------- carousel + lightbox ---------- */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.carousel__track', c);
    var prev = $('[data-prev]', c), next = $('[data-next]', c);
    var by = function (dir) {
      var item = $('li', track);
      var w = item ? item.getBoundingClientRect().width + 12 : 300;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    };
    if (prev) prev.addEventListener('click', function () { by(-1); });
    if (next) next.addEventListener('click', function () { by(1); });
  });
  var lb = $('#lightbox');
  var lbItems = $$('[data-lightbox]');
  if (lb && lbItems.length && typeof lb.showModal === 'function') {
    var lbImg = $('img', lb), lbCap = $('figcaption', lb), idx = 0;
    var show = function (i) {
      idx = (i + lbItems.length) % lbItems.length;
      var src = lbItems[idx].getAttribute('data-lightbox');
      var im = $('img', lbItems[idx]);
      lbImg.src = src;
      lbImg.alt = im ? im.alt : '';
      lbCap.textContent = (im ? im.alt : '') + ' — ' + (EN ? 'ILLUSTRATIVE PHOTO, placeholder' : 'FOTO ILUSTRATIVA, placeholder');
    };
    lbItems.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); lb.showModal(); });
    });
    $('.lightbox__close', lb).addEventListener('click', function () { lb.close(); });
    $('.lightbox__prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lightbox__next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- LGPD cookie banner ---------- */
  var KEY = 'floripao-cookie-consent-v1';
  var banner = $('#cookie-banner');
  var read = function () { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  var save = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };
  var openBanner = function (withPrefs) {
    if (!banner) return;
    banner.hidden = false;
    var st = read();
    var an = $('#ck-analytics', banner), mk = $('#ck-marketing', banner);
    if (an) an.checked = !!(st && st.analytics);
    if (mk) mk.checked = !!(st && st.marketing);
    $('.cookie__prefs', banner).classList.toggle('is-open', !!withPrefs);
    requestAnimationFrame(function () { banner.classList.add('is-open'); });
    var focusEl = $('button', banner);
    if (focusEl) setTimeout(function () { focusEl.focus(); }, 60);
  };
  var closeBanner = function (v) {
    save(v);
    banner.classList.remove('is-open');
    setTimeout(function () { banner.hidden = true; }, reduce ? 0 : 450);
  };
  if (banner) {
    if (!read()) setTimeout(function () { openBanner(false); }, 600);
    $('[data-ck="accept"]', banner).addEventListener('click', function () { closeBanner({ necessary: true, analytics: true, marketing: true, ts: Date.now() }); });
    $('[data-ck="reject"]', banner).addEventListener('click', function () { closeBanner({ necessary: true, analytics: false, marketing: false, ts: Date.now() }); });
    $('[data-ck="prefs"]', banner).addEventListener('click', function () { $('.cookie__prefs', banner).classList.toggle('is-open'); });
    $('[data-ck="save"]', banner).addEventListener('click', function () {
      closeBanner({ necessary: true, analytics: $('#ck-analytics', banner).checked, marketing: $('#ck-marketing', banner).checked, ts: Date.now() });
    });
  }
  $$('[data-cookie-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openBanner(true); }); });

  /* ---------- Google Maps: click-to-load (LGPD — no Google request before consent click) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-map-load]'), function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('[data-map-src]');
      if (!box) return;
      var f = document.createElement('iframe');
      f.title = box.getAttribute('data-map-title') || 'Google Maps';
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      f.setAttribute('allowfullscreen', '');
      f.src = box.getAttribute('data-map-src');
      box.parentNode.replaceChild(f, box);
      f.setAttribute('tabindex', '-1');
      f.focus();
    });
  });
})();
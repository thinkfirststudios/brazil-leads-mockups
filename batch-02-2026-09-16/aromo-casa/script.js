/* Mockup script — shared behaviours (no framework). */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EN = /^en/i.test(doc.lang || '');
  var T = EN ? {open:'Open menu', close:'Close menu', consent:'To continue, please tick the consent box (LGPD).', demo:'Demo only: this form does not send any data. On the live site the message would be forwarded to the team.'} : {open:'Abrir menu', close:'Fechar menu', consent:'Para continuar, marque a caixa de consentimento (LGPD).', demo:'Demonstração: este formulário não envia dados. No site real, a mensagem seria encaminhada à equipe.'};

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* year */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* sticky header condense */
  var header = $('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var menuBtn = $('.menu-btn');
  var mobileNav = menuBtn ? document.getElementById(menuBtn.getAttribute('aria-controls')) : null;
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.setAttribute('aria-label', open ? T.open : T.close);
      mobileNav.classList.toggle('open', !open);
    });
    $$('a', mobileNav).forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        menuBtn.click();
        menuBtn.focus();
      }
    });
  }

  /* reveal on scroll (stagger via --i) */
  $$('[data-stagger]').forEach(function (group) {
    $$('.reveal', group).forEach(function (el, i) { el.style.setProperty('--i', i); });
  });
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* gentle parallax (transform only) */
  var para = $$('[data-parallax]');
  if (!reduce && para.length) {
    var ticking = false;
    var run = function () {
      para.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var k = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translate3d(0,' + (-r.top * k).toFixed(1) + 'px,0) scale(1.08)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(run); ticking = true; }
    }, { passive: true });
    run();
  }

  /* layered model: spread layers with scroll (transform only) */
  var model = $('[data-spread]');
  if (model && !reduce) {
    var spreadTick = false;
    var spread = function () {
      var r = model.getBoundingClientRect();
      var p = 1 - Math.min(Math.max((r.top + r.height / 2) / window.innerHeight, 0), 1);
      model.style.setProperty('--spread', (4 + p * 26).toFixed(1) + 'px');
      spreadTick = false;
    };
    window.addEventListener('scroll', function () {
      if (!spreadTick) { window.requestAnimationFrame(spread); spreadTick = true; }
    }, { passive: true });
    spread();
  }

  /* filterable grids */
  $$('[data-filter-group]').forEach(function (group) {
    var target = document.getElementById(group.getAttribute('data-filter-group'));
    var status = document.getElementById(group.getAttribute('data-status'));
    var extra = group.getAttribute('data-external-triggers');
    if (!target) return;
    var buttons = $$('.filter-btn', group);
    var items = $$('[data-item]', target);
    function apply(val, label) {
      var n = 0;
      items.forEach(function (it) {
        var tags = (it.getAttribute('data-tags') || '').split(' ');
        var show = val === 'all' || tags.indexOf(val) > -1;
        it.hidden = !show;
        if (show) n++;
      });
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === val)); });
      if (status) {
        status.textContent = (val === 'all' ? 'Mostrando todos os ' : 'Filtro “' + label + '”: ') + n + (n === 1 ? ' item' : ' itens') + ' (exemplos provisórios).';
      }
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.getAttribute('data-filter'), b.textContent.trim());
        if (extra) {
          $$(extra).forEach(function (o) { o.setAttribute('aria-pressed', String(o.getAttribute('data-filter-to') === 'all')); });
        }
      });
    });
    if (extra) {
      $$(extra).forEach(function (t) {
        t.addEventListener('click', function () {
          var v = t.getAttribute('data-filter-to');
          var match = buttons.filter(function (b) { return b.getAttribute('data-filter') === v; })[0];
          apply(v, match ? match.textContent.trim() : (t.getAttribute('data-label') || v));
          $$(extra).forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
        });
      });
    }
  });

  /* carousels */
  $$('[data-carousel]').forEach(function (c) {
    var track = $('.track', c);
    var prev = $('[data-prev]', c);
    var next = $('[data-next]', c);
    function step(dir) {
      var first = track.firstElementChild;
      var w = first ? first.getBoundingClientRect().width + 16 : 300;
      track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  });

  /* section-aware WhatsApp message */
  var wa = $('.wa-float[data-wa-number]');
  if (wa) {
    var num = wa.getAttribute('data-wa-number');
    var def = wa.getAttribute('data-wa-default') || 'Olá!';
    var setMsg = function (msg) { wa.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg); };
    setMsg(def);
    var sections = $$('[data-wa]');
    if ('IntersectionObserver' in window && sections.length) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setMsg(en.target.getAttribute('data-wa'));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      sections.forEach(function (s) { sio.observe(s); });
    }
  }

  /* demo forms */
  $$('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = $('.form-notice', form);
      var consent = $('input[data-consent]', form);
      if (consent && !consent.checked) {
        consent.focus();
        if (notice) {
          notice.textContent = T.consent;
          notice.classList.add('show');
        }
        return;
      }
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (notice) {
        notice.textContent = T.demo;
        notice.classList.add('show');
      }
    });
  });

  /* WhatsApp message builders (compose only; the visitor chooses to open) */
  $$('form[data-wa-builder]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = $('.form-notice', form);
      var consent = $('input[data-consent]', form);
      if (consent && !consent.checked) {
        consent.focus();
        notice.textContent = T.consent;
        notice.classList.add('show');
        return;
      }
      var lines = [form.getAttribute('data-wa-intro') || 'Olá!'];
      $$('[data-wa-field]', form).forEach(function (f) {
        var label = f.getAttribute('data-wa-field');
        var val = '';
        if (f.tagName === 'FIELDSET') {
          val = $$('input:checked', f).map(function (i) { return i.value; }).join(', ');
        } else {
          val = (f.value || '').trim();
        }
        if (val) lines.push(label + ': ' + val);
      });
      var url = 'https://wa.me/' + form.getAttribute('data-wa-builder') + '?text=' + encodeURIComponent(lines.join('\n'));
      notice.innerHTML = '';
      var p = document.createElement('p');
      p.textContent = 'Mensagem montada (demonstração). Revise e envie somente o necessário:';
      var pre = document.createElement('pre');
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.font = 'inherit';
      pre.style.margin = '6px 0 10px';
      pre.textContent = lines.join('\n');
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Abrir no WhatsApp →';
      notice.appendChild(p); notice.appendChild(pre); notice.appendChild(a);
      notice.classList.add('show');
    });
  });

  /* click-to-load maps (no third-party request before consent/click) */
  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = document.getElementById(btn.getAttribute('data-map-load'));
      if (!box) return;
      var iframe = document.createElement('iframe');
      iframe.src = box.getAttribute('data-map-src');
      iframe.title = box.getAttribute('data-map-title') || 'Mapa';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      box.innerHTML = '';
      box.appendChild(iframe);
      box.classList.add('loaded');
    });
  });

  /* LGPD cookie banner */
  var KEY = 'mockup-cookie-consent';
  var banner = document.getElementById('cookie-banner');
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function openBanner(showPrefs) {
    if (!banner) return;
    banner.classList.add('show');
    banner.setAttribute('aria-hidden', 'false');
    var prefs = $('.cookie-prefs', banner);
    if (showPrefs && prefs) prefs.classList.add('open');
    var first = $('button', banner);
    if (first) first.focus({ preventScroll: true });
  }
  function closeBanner() {
    if (!banner) return;
    banner.classList.remove('show');
    banner.setAttribute('aria-hidden', 'true');
  }
  if (banner) {
    var saved = read();
    if (saved) {
      $$('input[data-cat]', banner).forEach(function (i) { i.checked = !!saved[i.getAttribute('data-cat')]; });
    } else {
      setTimeout(function () { openBanner(false); }, 600);
    }
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var act = b.getAttribute('data-cookie');
      var cats = $$('input[data-cat]', banner);
      if (act === 'accept') { cats.forEach(function (i) { i.checked = true; }); store({ necessarios: true, analise: true, marketing: true, ts: Date.now() }); closeBanner(); }
      if (act === 'reject') { cats.forEach(function (i) { i.checked = false; }); store({ necessarios: true, analise: false, marketing: false, ts: Date.now() }); closeBanner(); }
      if (act === 'prefs') { $('.cookie-prefs', banner).classList.toggle('open'); }
      if (act === 'save') {
        var v = { necessarios: true, ts: Date.now() };
        cats.forEach(function (i) { v[i.getAttribute('data-cat')] = i.checked; });
        store(v); closeBanner();
      }
    });
  }
  $$('[data-cookie-open]').forEach(function (b) {
    b.addEventListener('click', function () { openBanner(true); });
  });
})();

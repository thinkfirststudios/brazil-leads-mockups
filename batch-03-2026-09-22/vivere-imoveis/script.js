/* VIVERE — mockup especulativo ThinkFirst Studios.
   Movimento contido: revelacoes curtas, parallax lento, hover discreto.
   Tudo desligado quando o sistema pede prefers-reduced-motion. */
(function () {
  'use strict';

  var QUIET = window.matchMedia('(prefers-reduced-motion: reduce)');
  var quiet = function () { return QUIET.matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------- ano corrente */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------------------------------------------------------- header */
  var hdr = $('[data-header]');
  var burger = $('[data-burger]');
  var sheet = $('[data-sheet]');

  if (hdr) {
    var condensed = false;
    var onScroll = function () {
      var want = window.scrollY > 40;
      if (want !== condensed) { condensed = want; hdr.classList.toggle('is-condensed', want); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (burger && sheet) {
    var setSheet = function (open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      sheet.hidden = !open;
    };
    burger.addEventListener('click', function () {
      setSheet(burger.getAttribute('aria-expanded') !== 'true');
    });
    sheet.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setSheet(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setSheet(false); burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1080) { setSheet(false); }
    });
  }

  /* ---------------------------------------------------------- revelacoes */
  var reveals = $$('[data-reveal]');
  if (!reveals.length) { /* nada a revelar */ }
  else if (quiet() || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        el.style.setProperty('--d', (n * 90) + 'ms');
        n += 1;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- parallax */
  var pmedia = $('[data-parallax]');
  if (pmedia && !quiet()) {
    var ticking = false;
    var move = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        pmedia.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(move); }
    }, { passive: true });
    move();
  }

  /* ---------------------------------------------------------- carrossel */
  $$('[data-carousel]').forEach(function (root) {
    var track = $('[data-track]', root);
    var prev = $('[data-prev]', root);
    var next = $('[data-next]', root);
    if (!track || !prev || !next) { return; }

    var step = function () {
      var first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    };
    var sync = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    var go = function (dir) {
      track.scrollBy({ left: dir * step(), behavior: quiet() ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', sync);
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    sync();
  });

  /* ---------------------------------------------------------- busca (ilustrativa) */
  $$('[data-search]').forEach(function (form) {
    $$('.search__mode', form).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.search__mode', form).forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var target = form.getAttribute('data-go') || 'imoveis.html';
      if (document.documentElement.lang !== 'pt-BR') { target = '../' + target; }
      window.location.href = target;
    });
  });

  /* ---------------------------------------------------------- formularios */
  $$('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) { return; }
      var ok = $('[data-form-ok]', form);
      if (ok) {
        ok.textContent = document.documentElement.lang === 'en'
          ? 'Mockup only — nothing was sent. In production this reaches VIVERE by email and WhatsApp.'
          : 'Maquete de demonstração — nada foi enviado. Em produção, o pedido chega à VIVERE por e-mail e WhatsApp.';
        ok.hidden = false;
      }
    });
  });


  /* ---------------------------------------------------------- contagem */
  var counters = $$('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (quiet()) { el.textContent = String(target); return; }
      var t0 = null, dur = 900;
      var tick = function (ts) {
        if (t0 === null) { t0 = ts; }
        var k = Math.min((ts - t0) / dur, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) { window.requestAnimationFrame(tick); }
      };
      window.requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { run(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---------------------------------------------------------- cookies */
  var bar = $('[data-cookie]');
  if (bar) {
    var KEY = 'vivere-cookie-choice';
    var stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch (err) { stored = null; }
    if (!stored) {
      window.setTimeout(function () { bar.hidden = false; }, 900);
    }
    var close = function (choice) {
      try { window.localStorage.setItem(KEY, choice); } catch (err) { /* modo privado */ }
      bar.hidden = true;
    };
    var yes = $('[data-cookie-yes]', bar);
    var no = $('[data-cookie-no]', bar);
    if (yes) { yes.addEventListener('click', function () { close('accept'); }); }
    if (no) { no.addEventListener('click', function () { close('decline'); }); }
  }
})();

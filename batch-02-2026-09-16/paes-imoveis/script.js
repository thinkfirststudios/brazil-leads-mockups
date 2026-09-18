/* Paes Imóveis — MOCKUP interactions. No framework. */
(function(){
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c){ return (c||doc).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c||doc).querySelectorAll(s)); }
  function store(k, v){ try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } }

  /* year */
  $$('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* sticky header */
  var header = $('.site-header');
  function onScroll(){ if(header) header.classList.toggle('is-scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobile menu */
  var mbtn = $('.menu-btn'), mnav = $('#mobile-nav');
  if(mbtn && mnav){
    mbtn.addEventListener('click', function(){
      var open = mbtn.getAttribute('aria-expanded') !== 'true';
      mbtn.setAttribute('aria-expanded', String(open));
      mnav.classList.toggle('open', open);
    });
    $$('a', mnav).forEach(function(a){ a.addEventListener('click', function(){ mbtn.setAttribute('aria-expanded','false'); mnav.classList.remove('open'); }); });
  }

  /* Buscar — collapsed search panel */
  var sbtn = $('.search-toggle'), spanel = $('#search-panel');
  if(sbtn && spanel){
    sbtn.addEventListener('click', function(){
      var open = sbtn.getAttribute('aria-expanded') !== 'true';
      sbtn.setAttribute('aria-expanded', String(open));
      spanel.classList.toggle('open', open);
      spanel.toggleAttribute('inert', !open);
      if(open){ var f = $('select, input', spanel); if(f) setTimeout(function(){ f.focus(); }, 250); }
    });
    doc.addEventListener('keydown', function(e){ if(e.key === 'Escape' && spanel.classList.contains('open')){ sbtn.click(); sbtn.focus(); } });
  }

  /* scroll reveals with stagger */
  var reveals = $$('.reveal');
  $$('[data-stagger]').forEach(function(group){
    $$('.reveal', group).forEach(function(el, i){ el.style.setProperty('--d', (i * 100) + 'ms'); });
  });
  if(reduce || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:.08});
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* count-up — only elements with a verified data-count (none on this build) */
  $$('[data-count]').forEach(function(el){
    var end = parseInt(el.getAttribute('data-count'), 10); if(isNaN(end)) return;
    if(reduce){ el.textContent = end; return; }
    var start = parseInt(el.getAttribute('data-from') || '0', 10), t0 = null;
    var obs = new IntersectionObserver(function(en){
      if(!en[0].isIntersecting) return; obs.disconnect();
      function step(t){ if(!t0) t0 = t; var p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3))); if(p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
    obs.observe(el);
  });

  /* HERO — one property at a time; finite rotation, pausable, no auto-advance under reduced motion */
  var hero = $('.hero[data-carousel]');
  if(hero){
    var slides = $$('.slide', hero), idx = 0, timer = null, paused = reduce;
    var cur = $('.count .cur', hero), live = $('#hero-live'), prog = $('.progress', hero);
    var pauseBtn = $('.hero-pause', hero), DUR = 7000;
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function show(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){
        var on = i === idx;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', String(!on));
        s.toggleAttribute('inert', !on);
      });
      if(cur){
        if(!reduce){ cur.classList.add('bump'); setTimeout(function(){ cur.textContent = pad(idx + 1); cur.classList.remove('bump'); }, 220); }
        else cur.textContent = pad(idx + 1);
      }
      if(live) live.textContent = 'Imóvel ' + (idx + 1) + ' de ' + slides.length;
      restart();
    }
    function restart(){
      clearTimeout(timer);
      if(prog){ prog.style.transition = 'none'; prog.style.transform = 'scaleX(0)'; }
      if(paused) return;
      if(prog){ void prog.offsetWidth; prog.style.transition = 'transform ' + DUR + 'ms linear'; prog.style.transform = 'scaleX(1)'; }
      timer = setTimeout(function(){ show(idx + 1); }, DUR);
    }
    function setPaused(p){
      paused = p;
      if(pauseBtn){
        pauseBtn.setAttribute('aria-pressed', String(p));
        pauseBtn.setAttribute('aria-label', p ? 'Retomar rotação automática' : 'Pausar rotação automática');
        $('.i-pause', pauseBtn).style.display = p ? 'none' : '';
        $('.i-play', pauseBtn).style.display = p ? '' : 'none';
      }
      restart();
    }
    $('.hero-prev', hero).addEventListener('click', function(){ show(idx - 1); });
    $('.hero-next', hero).addEventListener('click', function(){ show(idx + 1); });
    if(pauseBtn){
      if(reduce){ pauseBtn.hidden = true; }
      pauseBtn.addEventListener('click', function(){ setPaused(!paused); });
    }
    hero.addEventListener('keydown', function(e){
      if(e.key === 'ArrowLeft'){ show(idx - 1); } else if(e.key === 'ArrowRight'){ show(idx + 1); }
    });
    /* pause while user interacts */
    var hold = false;
    hero.addEventListener('focusin', function(){ if(!paused){ hold = true; clearTimeout(timer); if(prog){ prog.style.transition='none'; prog.style.transform='scaleX(0)'; } } });
    hero.addEventListener('focusout', function(e){ if(hold && !hero.contains(e.relatedTarget)){ hold = false; restart(); } });
    hero.addEventListener('mouseenter', function(){ if(!paused){ clearTimeout(timer); if(prog){ prog.style.transition='none'; prog.style.transform='scaleX(0)'; } } });
    hero.addEventListener('mouseleave', function(){ if(!hold) restart(); });
    if(reduce) setPaused(true);
    show(0);

    /* gentle parallax on the active frame */
    if(!reduce){
      var ticking = false;
      window.addEventListener('scroll', function(){
        if(ticking) return; ticking = true;
        requestAnimationFrame(function(){
          var y = Math.min(window.scrollY, 900) * 0.18;
          $$('.slide .media', hero).forEach(function(m){ m.style.transform = 'translate3d(0,' + y + 'px,0)'; });
          ticking = false;
        });
      }, {passive:true});
    }
  }

  /* §4 — per-card intent toggle */
  $$('.dual').forEach(function(card){
    var btns = $$('.seg button', card);
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        btns.forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
        card.setAttribute('data-mode', b.getAttribute('data-mode'));
      });
    });
  });

  /* folio filters */
  var fbtns = $$('.filters button');
  fbtns.forEach(function(b){
    b.addEventListener('click', function(){
      var f = b.getAttribute('data-filter');
      fbtns.forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      var n = 0;
      $$('.folio .card').forEach(function(c){
        var show = f === 'all' || c.getAttribute('data-status') === f;
        c.hidden = !show; if(show) n++;
      });
      var out = $('#folio-live'); if(out) out.textContent = n + ' imóveis exibidos (placeholders)';
    });
  });

  /* favourites + Comparar (real ARIA state, counter in header) */
  function updateCounts(){
    var favs = $$('.fav[aria-pressed="true"]').length, cmps = $$('.cmp[aria-pressed="true"]').length;
    $$('[data-fav-count]').forEach(function(e){ e.textContent = favs; });
    $$('[data-cmp-count]').forEach(function(e){ e.textContent = cmps; });
    var live = $('#cmp-live'); if(live) live.textContent = cmps + ' imóveis selecionados para comparar';
  }
  $$('.fav').forEach(function(b){ b.addEventListener('click', function(){ b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); updateCounts(); }); });
  $$('.cmp').forEach(function(b){
    b.addEventListener('click', function(){
      var on = b.getAttribute('aria-pressed') !== 'true';
      if(on && $$('.cmp[aria-pressed="true"]').length >= 3){ var l = $('#cmp-live'); if(l) l.textContent = 'Limite de 3 imóveis para comparar'; return; }
      b.setAttribute('aria-pressed', String(on)); updateCounts();
    });
  });
  updateCounts();

  /* generic tabs (role=tablist) */
  $$('[role="tablist"]').forEach(function(list){
    var tabs = $$('[role="tab"]', list);
    function select(t){
      tabs.forEach(function(x){
        var on = x === t;
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
        var p = doc.getElementById(x.getAttribute('aria-controls')); if(p) p.hidden = !on;
      });
      var ctx = list.getAttribute('data-sets');
      if(ctx){ var tgt = doc.getElementById(ctx); if(tgt) tgt.value = t.getAttribute('data-value') || ''; }
    }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ select(t); });
      t.addEventListener('keydown', function(e){
        var j = null;
        if(e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        if(e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        if(j !== null){ e.preventDefault(); tabs[j].focus(); select(tabs[j]); }
      });
    });
  });

  /* gallery carousels */
  $$('[data-gallery]').forEach(function(g){
    var track = $('.gallery', g);
    $$('[data-dir]', g).forEach(function(b){
      b.addEventListener('click', function(){ track.scrollBy({left: track.clientWidth * 0.8 * parseInt(b.getAttribute('data-dir'), 10), behavior: reduce ? 'auto' : 'smooth'}); });
    });
  });

  /* demo forms — never submit; optional WhatsApp hand-off built from fields */
  $$('form[data-demo]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var note = $('.form-notice', f);
      var consent = $('input[name="lgpd"]', f);
      if(consent && !consent.checked){
        if(note){ note.textContent = 'Para continuar, marque o consentimento LGPD (demonstração).'; note.classList.add('show'); }
        consent.focus(); return;
      }
      var msg = 'MOCKUP — formulário de demonstração. Nenhum dado foi enviado ou armazenado.';
      var wa = f.getAttribute('data-wa');
      if(wa){
        var parts = $$('select, input[type="text"]', f).filter(function(x){ return x.value; }).map(function(x){ return (x.getAttribute('data-label') || x.name) + ': ' + x.value; });
        var link = wa + '?text=' + encodeURIComponent((f.getAttribute('data-wa-intro') || 'Olá!') + ' ' + parts.join(' · '));
        if(note){ note.innerHTML = msg + ' Na versão final, o envio abre o WhatsApp: <a href="' + link + '" target="_blank" rel="noopener">pré-visualizar mensagem</a>.'; }
      } else if(note){ note.textContent = msg; }
      if(note) note.classList.add('show');
    });
  });

  /* TIMELINE RAIL — current year, draw-in, expandable milestone nodes (static + expanded under reduced motion) */
  var now = new Date().getFullYear();
  $$('[data-now]').forEach(function(el){ el.textContent = now; });
  $$('[data-count-now]').forEach(function(el){ el.setAttribute('data-count', now); });
  var rail = $('.rail-tl');
  if(rail){
    var nodes = $$('.tl-node', rail);
    if(reduce){
      rail.classList.add('drawn', 'static');
      nodes.forEach(function(n){ n.setAttribute('aria-expanded', 'true'); });
    } else {
      requestAnimationFrame(function(){ setTimeout(function(){ rail.classList.add('drawn'); }, 250); });
      nodes.forEach(function(n){
        n.addEventListener('click', function(){
          var open = n.getAttribute('aria-expanded') !== 'true';
          nodes.forEach(function(x){ x.setAttribute('aria-expanded', 'false'); });
          n.setAttribute('aria-expanded', String(open));
        });
        n.addEventListener('keydown', function(e){
          var i = nodes.indexOf(n), j = null;
          if(e.key === 'ArrowRight') j = Math.min(nodes.length - 1, i + 1);
          if(e.key === 'ArrowLeft') j = Math.max(0, i - 1);
          if(e.key === 'Escape'){ n.setAttribute('aria-expanded', 'false'); }
          if(j !== null){ e.preventDefault(); nodes[j].focus(); }
        });
      });
    }
  }
  /* gentle parallax (transform only) */
  var px = $$('[data-parallax]');
  if(px.length && !reduce){
    var tk = false;
    window.addEventListener('scroll', function(){
      if(tk) return; tk = true;
      requestAnimationFrame(function(){
        var y = Math.min(window.scrollY, 900) * 0.2;
        px.forEach(function(m){ m.style.transform = 'translate3d(0,' + y + 'px,0) scale(1.06)'; });
        tk = false;
      });
    }, {passive:true});
  }

  /* current-year count-up (1978 → today) */
  $$('[data-count-now]').forEach(function(el){
    var start = parseInt(el.getAttribute('data-from') || String(now), 10);
    if(reduce || !('IntersectionObserver' in window)){ el.textContent = now; return; }
    var t0 = null;
    var ob = new IntersectionObserver(function(en){
      if(!en[0].isIntersecting) return; ob.disconnect();
      function step(t){ if(!t0) t0 = t; var p = Math.min(1, (t - t0) / 1800); el.textContent = Math.round(start + (now - start) * (1 - Math.pow(1 - p, 3))); if(p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
    ob.observe(el);
  });

  /* search — three finalidades; Temporada swaps the fields */
  $$('[data-fin-switch]').forEach(function(box){
    var btns = $$('button[data-fin]', box);
    var form = box.closest('form') || doc;
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        var fin = b.getAttribute('data-fin');
        btns.forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
        $$('[data-for]', form).forEach(function(g){
          var show = g.getAttribute('data-for').split(' ').indexOf(fin) > -1;
          g.hidden = !show;
          $$('input,select', g).forEach(function(i){ i.disabled = !show; });
        });
        var h = $('input[name="finalidade"]', form); if(h) h.value = fin;
        var live = $('#fin-live'); if(live) live.textContent = 'Busca: ' + b.textContent;
      });
    });
  });

  /* LGPD: third-party map loads only on explicit click */
  $$('[data-map]').forEach(function(box){
    var b = $('[data-map-load]', box); if(!b) return;
    b.addEventListener('click', function(){
      var f = doc.createElement('iframe');
      f.className = 'map'; f.src = box.getAttribute('data-src'); f.title = box.getAttribute('data-title') || 'Mapa';
      f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade'); f.setAttribute('allowfullscreen', '');
      f.style.width = '100%'; f.style.height = '100%'; f.style.border = '0';
      box.innerHTML = ''; box.classList.add('loaded'); box.appendChild(f); f.focus();
    });
  });

  /* LGPD cookie banner */
  var KEY = 'paesimoveis-cookie-consent-v1';
  var banner = $('#cookie'), prefs = $('#cookie-prefs');
  function saved(){ try{ return JSON.parse(store(KEY) || 'null'); }catch(e){ return null; } }
  function save(obj){ obj.date = new Date().toISOString(); store(KEY, JSON.stringify(obj)); hide(); /* analytics/marketing tags would load here only if obj.analise / obj.marketing */ }
  function show(openPrefs){
    if(!banner) return;
    var s = saved();
    $$('input[data-cat]', banner).forEach(function(i){ i.checked = !!(s && s[i.getAttribute('data-cat')]); });
    if(prefs) prefs.classList.toggle('open', !!openPrefs);
    banner.hidden = false; requestAnimationFrame(function(){ banner.classList.add('show'); });
  }
  function hide(){ if(!banner) return; banner.classList.remove('show'); setTimeout(function(){ banner.hidden = true; }, reduce ? 0 : 450); }
  if(banner){
    $('[data-cookie="accept"]', banner).addEventListener('click', function(){ save({necessarios:true, analise:true, marketing:true}); });
    $('[data-cookie="reject"]', banner).addEventListener('click', function(){ save({necessarios:true, analise:false, marketing:false}); });
    $('[data-cookie="prefs"]', banner).addEventListener('click', function(){ prefs.classList.toggle('open'); });
    $('[data-cookie="save"]', banner).addEventListener('click', function(){
      var o = {necessarios:true};
      $$('input[data-cat]', banner).forEach(function(i){ o[i.getAttribute('data-cat')] = i.checked; });
      save(o);
    });
    $$('[data-cookie-open]').forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); show(true); }); });
    if(!saved()) setTimeout(function(){ show(false); }, 600);
  }
})();

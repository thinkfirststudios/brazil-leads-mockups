/* =====================================================================
   Mint Premium Ótica — mockup script
   ---------------------------------------------------------------------
   CONTATO: o telefone (48) 99130-6007 veio da planilha comercial e NÃO
   está confirmado como WhatsApp nem vinculado a uma loja específica.
   Por isso, nenhum link wa.me é gerado. Quando cada loja confirmar seu
   número de WhatsApp, preencha "wa" abaixo (formato 55DDDNUMERO) e os
   botões passam a abrir o WhatsApp da loja escolhida.
   ===================================================================== */
const LOJAS = {
  "loja-1": { wa: "", pagina: "lojas/loja-1/index.html" },       /* [CONFIRM bairro, endereço e WhatsApp] */
  "santa-monica": { wa: "", pagina: "lojas/santa-monica/index.html" } /* [CONFIRM endereço e WhatsApp] */
};

(function () {
  "use strict";
  const root = document.documentElement;
  const LANG = (root.lang || "pt").toLowerCase().startsWith("en") ? "en" : "pt";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BASE = root.dataset.base || ""; /* relative path back to site root, set per page */
  const STORE_KEY = "mint_loja_v1";
  const CK_KEY = "mint_cookie_consent_v1";
  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* ignore */ } }
  };
  const T = {
    pt: { filter: "Filtros ficam ativos quando o catálogo real for fornecido — nenhuma opção foi confirmada.", demo: "Mockup: formulário de demonstração — nada foi enviado ou armazenado.", subject: "Assunto: " },
    en: { filter: "Filters go live once the real catalogue is supplied — no option has been confirmed.", demo: "Mockup: demo form — nothing was sent or stored.", subject: "Subject: " }
  }[LANG];

  /* year */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* sticky header */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  const menuBtn = document.querySelector(".menu-btn");
  const mnav = document.getElementById("mobile-nav");
  if (menuBtn && mnav) {
    const set = (open) => {
      menuBtn.setAttribute("aria-expanded", String(open));
      mnav.classList.toggle("open", open);
      mnav.setAttribute("aria-hidden", String(!open));
    };
    menuBtn.addEventListener("click", () => set(menuBtn.getAttribute("aria-expanded") !== "true"));
    mnav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
  }

  /* store switcher (header + mobile) — highlights the chosen store everywhere */
  const applyStore = (id) => {
    if (!id || !LOJAS[id]) return;
    document.querySelectorAll("[data-store-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.storeBtn === id)));
    document.querySelectorAll("[data-store]").forEach((c) => c.classList.toggle("is-active", c.dataset.store === id));
    document.body.dataset.loja = id;
  };
  document.querySelectorAll("[data-store-btn]").forEach((b) =>
    b.addEventListener("click", () => {
      store.set(b.dataset.storeBtn);
      applyStore(b.dataset.storeBtn);
    })
  );
  applyStore(document.body.dataset.fixedStore || store.get());

  /* store chooser dialog */
  const chooser = document.getElementById("chooser");
  let lastFocus = null;
  const openChooser = (ctx) => {
    if (!chooser) return false;
    lastFocus = document.activeElement;
    const ctxEl = chooser.querySelector(".ctx");
    if (ctxEl) {
      ctxEl.textContent = ctx ? T.subject + ctx : "";
      ctxEl.hidden = !ctx;
    }
    const chosen = document.body.dataset.loja;
    chooser.querySelectorAll(".opt").forEach((o) => (o.style.borderColor = o.dataset.store === chosen ? "rgba(79,191,160,.8)" : ""));
    chooser.hidden = false;
    requestAnimationFrame(() => chooser.classList.add("open"));
    const first = chooser.querySelector("button, a");
    if (first) first.focus();
    return true;
  };
  const closeChooser = () => {
    if (!chooser) return;
    chooser.classList.remove("open");
    setTimeout(() => (chooser.hidden = true), reduce ? 0 : 450);
    if (lastFocus) lastFocus.focus();
  };
  document.querySelectorAll("[data-chooser]").forEach((el) =>
    el.addEventListener("click", (ev) => {
      if (openChooser(el.dataset.ctx || "")) ev.preventDefault();
    })
  );
  if (chooser) {
    chooser.addEventListener("click", (ev) => { if (ev.target === chooser) closeChooser(); });
    chooser.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeChooser));
    chooser.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      if (a.dataset.store) store.set(a.dataset.store);
      closeChooser();
    }));
    document.addEventListener("keydown", (ev) => {
      if (chooser.hidden) return;
      if (ev.key === "Escape") closeChooser();
      if (ev.key === "Tab") {
        const f = chooser.querySelectorAll("a[href], button:not([disabled])");
        const first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
  }
  /* when a store confirms a WhatsApp number, point its links at wa.me */
  Object.keys(LOJAS).forEach((id) => {
    if (!LOJAS[id].wa) return;
    document.querySelectorAll('[data-wa-store="' + id + '"]').forEach((a) => {
      a.href = "https://wa.me/" + LOJAS[id].wa;
      a.target = "_blank";
      a.rel = "noopener";
    });
  });

  /* catalogue filters — placeholder behaviour only */
  document.querySelectorAll(".filters select").forEach((s) =>
    s.addEventListener("change", () => {
      const note = s.closest(".filters").querySelector(".filter-note");
      if (note) note.textContent = T.filter;
    })
  );

  /* reveal */
  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) els.forEach((e) => e.classList.add("in"));
  else {
    const io = new IntersectionObserver((en) => en.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    els.forEach((e) => io.observe(e));
  }

  /* hero parallax */
  const heroImg = document.querySelector(".hero .bg img");
  if (heroImg && !reduce) {
    let tick = false;
    window.addEventListener("scroll", () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => {
        heroImg.style.transform = "translate3d(0," + Math.min(window.scrollY, 900) * 0.12 + "px,0)";
        tick = false;
      });
    }, { passive: true });
  }

  /* count-up — only for VERIFIED numbers (data-count must be numeric) */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const n = parseFloat(el.dataset.count);
    if (isNaN(n)) return;
    if (reduce) { el.textContent = n.toLocaleString(); return; }
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1800, 1);
        el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
  });

  /* demo forms */
  document.querySelectorAll("form[data-demo]").forEach((f) =>
    f.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      const n = f.querySelector(".form-notice");
      if (n) { n.textContent = T.demo; n.classList.add("show"); }
    })
  );

  /* click-to-load maps — no third-party embed before the user asks for it.
     data-map-query stays empty until each store address is confirmed. */
  document.querySelectorAll("[data-map]").forEach((panel) => {
    const btn = panel.querySelector("[data-map-load]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const q = panel.dataset.mapQuery;
      const note = panel.querySelector(".map-note");
      if (!q) {
        if (note) note.textContent = LANG === "en" ? "Map unavailable until the store address is confirmed." : "Mapa indisponível até o endereço da loja ser confirmado.";
        return;
      }
      const f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
      f.title = LANG === "en" ? "Store map" : "Mapa da loja";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      panel.classList.add("loaded");
      panel.appendChild(f);
    });
  });

  /* LGPD cookie banner */
  const banner = document.getElementById("cookie");
  const readCk = () => { try { return JSON.parse(localStorage.getItem(CK_KEY)); } catch (e) { return null; } };
  const saveCk = (v) => { try { localStorage.setItem(CK_KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  if (banner) {
    const prefs = banner.querySelector(".cookie-prefs");
    const an = banner.querySelector("#ck-analise");
    const mk = banner.querySelector("#ck-marketing");
    const show = () => {
      const c = readCk();
      an.checked = !!(c && c.analise);
      mk.checked = !!(c && c.marketing);
      banner.hidden = false;
      requestAnimationFrame(() => banner.classList.add("show"));
    };
    const hide = () => { banner.classList.remove("show"); setTimeout(() => (banner.hidden = true), 600); };
    const decide = (a, m) => { saveCk({ necessarios: true, analise: a, marketing: m, data: new Date().toISOString() }); hide(); };
    banner.querySelector("[data-ck=accept]").addEventListener("click", () => decide(true, true));
    banner.querySelector("[data-ck=reject]").addEventListener("click", () => decide(false, false));
    banner.querySelector("[data-ck=save]").addEventListener("click", () => decide(an.checked, mk.checked));
    banner.querySelector("[data-ck=prefs]").addEventListener("click", (e) => {
      const open = prefs.classList.toggle("show");
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll("[data-cookie-open]").forEach((b) => b.addEventListener("click", show));
    if (!readCk()) show();
  }
})();

/* =====================================================================
   inFlux — unit landing page mockup
   ---------------------------------------------------------------------
   WhatsApp da unidade: NÃO confirmado. Quando confirmado, preencha
   UNIT_WA (formato 55DDDNUMERO) e os botões "Falar com a unidade" /
   "Reservar vaga" passam a abrir o WhatsApp com mensagem pronta.
   Até lá, eles levam ao formulário de contato (demonstração).
   ===================================================================== */
const UNIT_WA = ""; /* [CONFIRM unit number] */

(function () {
  "use strict";
  const LANG = (document.documentElement.lang || "pt").toLowerCase().startsWith("en") ? "en" : "pt";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TX = {
    pt: { demo: "Mockup: formulário de demonstração — nada foi enviado ou armazenado.", reserve: (c, t) => "Olá! Gostaria de reservar uma vaga: " + c + " — " + t + ".", map: "Mapa indisponível até o endereço da unidade ser confirmado.", mapTitle: "Mapa da unidade" },
    en: { demo: "Mockup: demo form — nothing was sent or stored.", reserve: (c, t) => "Hi! I'd like to reserve a place: " + c + " — " + t + ".", map: "Map unavailable until the school's address is confirmed.", mapTitle: "School map" }
  }[LANG];

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* header */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 12);
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

  /* WhatsApp links — only activated when the unit number is confirmed */
  if (UNIT_WA) {
    document.querySelectorAll("[data-wa]").forEach((a) => {
      a.href = "https://wa.me/" + UNIT_WA + (a.dataset.wa ? "?text=" + encodeURIComponent(a.dataset.wa) : "");
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* timetable filter — the signature motion */
  const rows = Array.from(document.querySelectorAll(".tt tbody tr"));
  const chips = document.querySelectorAll(".chip[data-course]");
  const levelSel = document.getElementById("tt-level");
  let course = "all";
  const applyFilter = () => {
    const level = levelSel ? levelSel.value : "all";
    rows.forEach((r) => {
      const show = (course === "all" || r.dataset.course === course) && (level === "all" || r.dataset.level === level || r.dataset.level === "tbc");
      if (show && r.hidden) {
        r.hidden = false;
        r.classList.add("is-out");
        requestAnimationFrame(() => requestAnimationFrame(() => r.classList.remove("is-out")));
      } else if (show) {
        r.classList.remove("is-out");
      } else if (!r.hidden) {
        if (reduce) { r.hidden = true; return; }
        r.classList.add("is-out");
        setTimeout(() => { if (r.classList.contains("is-out")) r.hidden = true; }, 340);
      }
    });
  };
  chips.forEach((c) => c.addEventListener("click", () => {
    course = c.dataset.course;
    chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
    applyFilter();
  }));
  if (levelSel) levelSel.addEventListener("change", applyFilter);

  /* "Reservar vaga" → prefill contact form (or WhatsApp once confirmed) */
  const courseField = document.getElementById("c-curso");
  document.querySelectorAll("[data-reserve]").forEach((b) => b.addEventListener("click", (ev) => {
    const row = b.closest("tr");
    const cName = row ? row.dataset.label : "";
    if (UNIT_WA) {
      ev.preventDefault();
      window.open("https://wa.me/" + UNIT_WA + "?text=" + encodeURIComponent(TX.reserve(cName, row ? row.dataset.slot : "")), "_blank", "noopener");
      return;
    }
    if (courseField && cName) {
      Array.from(courseField.options).forEach((o) => { if (o.value === cName) courseField.value = cName; });
    }
  }));

  /* reveal */
  const els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) els.forEach((e) => e.classList.add("in"));
  else {
    const io = new IntersectionObserver((en) => en.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((e) => io.observe(e));
  }

  /* count-up — ONLY for verified numbers. Static number stays in the HTML so
     it degrades correctly without JS (unlike counters that render "0 K+"). */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const n = parseFloat(el.dataset.count);
    if (isNaN(n) || reduce) return;
    const suffix = el.dataset.suffix || "";
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
  });

  /* carousel buttons */
  document.querySelectorAll(".carousel").forEach((c) => {
    const track = c.querySelector(".track");
    c.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => {
      const fig = track.querySelector("figure");
      const w = fig ? fig.getBoundingClientRect().width + 14 : track.clientWidth;
      track.scrollBy({ left: w * Number(b.dataset.dir), behavior: reduce ? "auto" : "smooth" });
    }));
  });

  /* FAQ animation */
  document.querySelectorAll(".faq details").forEach((d) => {
    const s = d.querySelector("summary");
    const a = d.querySelector(".answer");
    if (!s || !a || reduce) return;
    s.addEventListener("click", (ev) => {
      ev.preventDefault();
      if (d.open) {
        a.animate([{ height: a.scrollHeight + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "ease-out" }).onfinish = () => (d.open = false);
      } else {
        d.open = true;
        a.animate([{ height: "0px", opacity: 0 }, { height: a.scrollHeight + "px", opacity: 1 }], { duration: 300, easing: "ease-out" });
      }
    });
  });

  /* click-to-load map — no third-party embed before user action */
  document.querySelectorAll("[data-map]").forEach((panel) => {
    const btn = panel.querySelector("[data-map-load]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const q = panel.dataset.mapQuery;
      const note = panel.querySelector(".map-note");
      if (!q) { if (note) note.textContent = TX.map; return; }
      const f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
      f.title = TX.mapTitle;
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      panel.classList.add("loaded");
      panel.appendChild(f);
    });
  });

  /* demo forms */
  document.querySelectorAll("form[data-demo]").forEach((f) => f.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const n = f.querySelector(".form-notice");
    if (n) { n.textContent = TX.demo; n.classList.add("show"); }
  }));

  /* LGPD cookie banner */
  const KEY = "influx_unit_cookie_consent_v1";
  const banner = document.getElementById("cookie");
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* ignore */ } };
  if (banner) {
    const prefs = banner.querySelector(".cookie-prefs");
    const an = banner.querySelector("#ck-analise");
    const mk = banner.querySelector("#ck-marketing");
    const show = () => {
      const c = read();
      an.checked = !!(c && c.analise);
      mk.checked = !!(c && c.marketing);
      banner.hidden = false;
      requestAnimationFrame(() => banner.classList.add("show"));
    };
    const hide = () => { banner.classList.remove("show"); setTimeout(() => (banner.hidden = true), 400); };
    const decide = (a, m) => { save({ necessarios: true, analise: a, marketing: m, data: new Date().toISOString() }); hide(); };
    banner.querySelector("[data-ck=accept]").addEventListener("click", () => decide(true, true));
    banner.querySelector("[data-ck=reject]").addEventListener("click", () => decide(false, false));
    banner.querySelector("[data-ck=save]").addEventListener("click", () => decide(an.checked, mk.checked));
    banner.querySelector("[data-ck=prefs]").addEventListener("click", (e) => {
      const open = prefs.classList.toggle("show");
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll("[data-cookie-open]").forEach((b) => b.addEventListener("click", show));
    if (!read()) show();
  }
})();

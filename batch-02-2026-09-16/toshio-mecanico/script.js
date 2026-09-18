/* =====================================================================
   Oficina Mecânica Toshio — mockup script
   ---------------------------------------------------------------------
   CATÁLOGO DE SERVIÇOS — edite AQUI (não é preciso mexer no HTML).
   Nenhum serviço, preço, prazo ou garantia foi confirmado com a oficina.
   Cada linha abaixo é um PLACEHOLDER até o cliente confirmar.
   tier: "A" = Revisão & manutenção preventiva
         "B" = Diagnóstico & reparo
         "C" = Serviços especializados (vazio até confirmar — se não houver
               especialidade, APAGUE o tier em vez de preencher)
   NUNCA adicionar preço, valor de mão de obra, prazo ou garantia sem
   confirmação por escrito (CDC art. 40).
   ===================================================================== */
const CATALOGO = [
  {
    tier: "A",
    nome: { pt: "[CONFIRM serviço]", en: "[CONFIRM service]" },
    desc: { pt: "[PLACEHOLDER: descrição em uma linha — cliente fornece]", en: "[PLACEHOLDER: one-line description — client to supply]" },
    periodicidade: { pt: "[CONFIRM periodicidade — por km ou por meses]", en: "[CONFIRM interval — by km or by months]" },
    duracao: "[CONFIRM]",
    img: "photo-1741827866663-6ad8ec20480c",
    alt: { pt: "Chave catraca com soquetes alinhados sobre superfície escura — foto ilustrativa", en: "Ratchet wrench with a row of sockets on a dark surface — illustrative photo" },
    slot: "servico-A1"
  },
  {
    tier: "A",
    nome: { pt: "[CONFIRM serviço]", en: "[CONFIRM service]" },
    desc: { pt: "[PLACEHOLDER: descrição em uma linha — cliente fornece]", en: "[PLACEHOLDER: one-line description — client to supply]" },
    periodicidade: { pt: "[CONFIRM periodicidade — por km ou por meses]", en: "[CONFIRM interval — by km or by months]" },
    duracao: "[CONFIRM]",
    img: "photo-1640556795357-71d4078d6228",
    alt: { pt: "Compartimento de motor limpo com mangueiras e polia em destaque — foto ilustrativa", en: "Clean engine bay with hoses and a pulley in focus — illustrative photo" },
    slot: "servico-A2"
  },
  {
    tier: "A",
    nome: { pt: "[CONFIRM serviço]", en: "[CONFIRM service]" },
    desc: { pt: "[PLACEHOLDER: descrição em uma linha — cliente fornece]", en: "[PLACEHOLDER: one-line description — client to supply]" },
    periodicidade: { pt: "[CONFIRM periodicidade — por km ou por meses]", en: "[CONFIRM interval — by km or by months]" },
    duracao: "[CONFIRM]",
    img: "photo-1730514782439-cd0e4b763483",
    alt: { pt: "Close da banda de rodagem de um pneu, sulcos em detalhe — foto ilustrativa", en: "Close-up of a tyre tread showing the grooves — illustrative photo" },
    slot: "servico-A3"
  },
  {
    tier: "B",
    nome: { pt: "[CONFIRM serviço]", en: "[CONFIRM service]" },
    desc: { pt: "[PLACEHOLDER: descrição em uma linha — cliente fornece]", en: "[PLACEHOLDER: one-line description — client to supply]" },
    duracao: "[CONFIRM]",
    img: "photo-1610913721979-b20ede600e63",
    alt: { pt: "Painel de instrumentos digital iluminado em ambiente escuro — foto ilustrativa", en: "Illuminated digital instrument cluster in low light — illustrative photo" },
    slot: "servico-B1"
  },
  {
    tier: "B",
    nome: { pt: "[CONFIRM serviço]", en: "[CONFIRM service]" },
    desc: { pt: "[PLACEHOLDER: descrição em uma linha — cliente fornece]", en: "[PLACEHOLDER: one-line description — client to supply]" },
    duracao: "[CONFIRM]",
    img: "photo-1760317890322-364a810cd4da",
    alt: { pt: "Disco de freio perfurado e cubo de roda vistos de perto — foto ilustrativa", en: "Drilled brake disc and wheel hub seen up close — illustrative photo" },
    slot: "servico-B2"
  },
  {
    tier: "B",
    unknown: true,
    nome: { pt: "Não sabe o que o carro tem?", en: "Not sure what's wrong with the car?" },
    desc: { pt: "Descreva o que está acontecendo e a oficina retorna para combinar uma avaliação. Nenhum diagnóstico é feito pelo site.", en: "Describe what is happening and the workshop will reply to arrange an inspection. No diagnosis is given through the website." },
    duracao: "[CONFIRM]",
    slot: "servico-B3"
  }
];

/* Tier labels */
const TIERS = {
  A: { pt: "Revisão & manutenção preventiva", en: "Scheduled servicing & preventive maintenance" },
  B: { pt: "Diagnóstico & reparo", en: "Diagnosis & repair" },
  C: { pt: "Serviços especializados", en: "Specialist services" }
};

/* WhatsApp — número da planilha comercial. [CONFIRM que é o WhatsApp da oficina e é monitorado] */
const WA_NUMBER = "5548984812456";

(function () {
  "use strict";
  const doc = document.documentElement;
  const LANG = (doc.lang || "pt-BR").toLowerCase().startsWith("en") ? "en" : "pt";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = (o) => (o && typeof o === "object" ? o[LANG] : o);
  const IMG = (id, w) => "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + w + "&q=70";
  const waLink = (msg) => "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* Wrap [CONFIRM …] and [PLACEHOLDER …] tokens so they render visibly */
  const mark = (s) =>
    esc(s)
      .replace(/\[(CONFIRM[^\]]*)\]/g, '<span class="confirm">[$1]</span>')
      .replace(/\[(PLACEHOLDER[^\]]*)\]/g, '<span class="ph">[$1]</span>');

  const L = {
    pt: {
      book: "Agendar",
      per: "Periodicidade",
      dur: "Duração estimada",
      quote: "Orçamento sem compromisso — ",
      quoteC: "[CONFIRM política de orçamento]",
      msgSvc: (n) => "Olá! Gostaria de agendar: " + n + ". Modelo/ano do carro: ",
      msgUnknown: "Olá! Não sei o que meu carro tem e gostaria de agendar uma avaliação. Modelo/ano: … O que está acontecendo: …",
      photo: "FOTO ILUSTRATIVA — placeholder",
      unknownOpt: "Não sei / quero uma avaliação",
      other: "Outro — descrevo na mensagem",
      ctaUnknown: "Descrever o problema",
      notice: "Mockup: a mensagem foi montada e o WhatsApp foi aberto em uma nova aba. Nada foi armazenado neste site.",
      err: "Preencha os campos obrigatórios e marque o consentimento para continuar.",
      demo: "Mockup: formulário de demonstração — nada foi enviado."
    },
    en: {
      book: "Book",
      per: "Interval",
      dur: "Estimated time",
      quote: "No-obligation estimate — ",
      quoteC: "[CONFIRM estimate policy]",
      msgSvc: (n) => "Hi! I'd like to book: " + n + ". Car model/year: ",
      msgUnknown: "Hi! I'm not sure what's wrong with my car and would like to book an inspection. Model/year: … What's happening: …",
      photo: "ILLUSTRATIVE PHOTO — placeholder",
      unknownOpt: "Not sure / I'd like an inspection",
      other: "Other — I'll describe it in the message",
      ctaUnknown: "Describe the problem",
      notice: "Mockup: the message was composed and WhatsApp opened in a new tab. Nothing was stored on this site.",
      err: "Please fill in the required fields and tick the consent box to continue.",
      demo: "Mockup: demo form — nothing was sent."
    }
  }[LANG];

  /* ---------- year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- sticky header ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("open", !open);
      mobileNav.setAttribute("aria-hidden", String(open));
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menuBtn.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("open");
        mobileNav.setAttribute("aria-hidden", "true");
      })
    );
  }

  /* ---------- render catalogue ---------- */
  const grids = { A: document.getElementById("tier-A"), B: document.getElementById("tier-B") };
  const svcSelect = document.getElementById("f-servico");
  CATALOGO.forEach((s, i) => {
    const grid = grids[s.tier];
    const name = T(s.nome);
    const art = document.createElement("article");
    art.className = "svc reveal" + (s.unknown ? " unknown" : "");
    art.dataset.tier = s.tier;
    art.style.setProperty("--d", (i % 3) * 100 + "ms");
    const media = s.img
      ? '<!-- PLACEHOLDER-' + s.slot + ' --><div class="media ph-img" data-placeholder="' + L.photo + '"><img src="' + IMG(s.img, 640) + '" srcset="' + IMG(s.img, 420) + ' 420w, ' + IMG(s.img, 640) + ' 640w, ' + IMG(s.img, 900) + ' 900w" sizes="(min-width:1000px) 33vw, (min-width:640px) 50vw, 100vw" alt="' + esc(T(s.alt)) + '" loading="lazy" decoding="async" width="640" height="400"></div>'
      : "";
    const per = s.periodicidade ? "<dt>" + L.per + "</dt><dd>" + mark(T(s.periodicidade)) + "</dd>" : "";
    const msg = s.unknown ? L.msgUnknown : L.msgSvc(name);
    art.innerHTML =
      media +
      '<div class="body"><h4>' + mark(name) + "</h4><p>" + mark(T(s.desc)) + "</p>" +
      "<dl>" + per + "<dt>" + L.dur + "</dt><dd>" + mark(s.duracao) + "</dd></dl>" +
      '<p class="quote">' + L.quote + mark(L.quoteC) + "</p>" +
      '<a class="btn btn-sm" href="' + waLink(msg) + '" target="_blank" rel="noopener">' + (s.unknown ? L.ctaUnknown : L.book) + ' <span class="arrow" aria-hidden="true">→</span></a></div>';
    if (grid) grid.appendChild(art);
    if (svcSelect && !s.unknown) {
      const o = document.createElement("option");
      o.value = TIERS[s.tier][LANG] + " — " + name + " #" + (i + 1);
      o.textContent = TIERS[s.tier][LANG] + " · " + name + " (" + (i + 1) + ")";
      svcSelect.appendChild(o);
    }
  });
  if (svcSelect) {
    [L.unknownOpt, L.other].forEach((t) => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      svcSelect.appendChild(o);
    });
  }

  /* ---------- filters ---------- */
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      document.querySelectorAll("[data-tier-block]").forEach((b) => {
        b.hidden = !(f === "all" || b.dataset.tierBlock === f);
      });
    })
  );

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- timeline hairline ---------- */
  const steps = document.querySelector(".steps");
  if (steps) {
    if (reduce || !("IntersectionObserver" in window)) steps.classList.add("drawn");
    else {
      const so = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) {
          steps.classList.add("drawn");
          so.disconnect();
        }
      }, { threshold: 0.35 });
      so.observe(steps);
    }
  }

  /* ---------- hero parallax ---------- */
  const heroImg = document.querySelector(".hero-media img");
  if (heroImg && !reduce) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 700);
        heroImg.style.transform = "translate3d(0," + (-y * 0.08) + "px,0)";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- count-up (only for elements with a VERIFIED data-count) ---------- */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return; /* unconfirmed → leave the [CONFIRM] text as is */
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
  });

  /* ---------- FAQ height animation ---------- */
  document.querySelectorAll(".faq details").forEach((d) => {
    const summary = d.querySelector("summary");
    const answer = d.querySelector(".answer");
    if (!summary || !answer || reduce) return;
    summary.addEventListener("click", (ev) => {
      ev.preventDefault();
      if (d.open) {
        const h = answer.scrollHeight;
        answer.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 280, easing: "ease-out" }).onfinish = () => (d.open = false);
      } else {
        d.open = true;
        const h = answer.scrollHeight;
        answer.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 320, easing: "ease-out" });
      }
    });
  });

  /* ---------- booking form → WhatsApp ---------- */
  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const err = form.querySelector(".form-error");
      const notice = form.querySelector(".form-notice");
      if (!form.checkValidity()) {
        err.classList.add("show");
        form.reportValidity();
        return;
      }
      err.classList.remove("show");
      const v = (id) => (form.querySelector("#" + id) || {}).value || "";
      const lines = LANG === "en"
        ? ["Hi! I'd like to book a slot.", "Name: " + v("f-nome"), "Vehicle (model/year): " + v("f-veiculo"), "Service: " + v("f-servico"), "Problem: " + v("f-problema"), "Preferred day/time: " + v("f-periodo")]
        : ["Olá! Gostaria de agendar um horário.", "Nome: " + v("f-nome"), "Veículo (modelo/ano): " + v("f-veiculo"), "Serviço: " + v("f-servico"), "Problema: " + v("f-problema"), "Preferência de dia/período: " + v("f-periodo")];
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
      notice.classList.add("show");
    });
  }
  document.querySelectorAll("form[data-demo]").forEach((f) =>
    f.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const n = f.querySelector(".form-notice");
      if (n) { n.textContent = L.demo; n.classList.add("show"); }
    })
  );

  /* ---------- click-to-load maps (no third-party embed before user action) ---------- */
  document.querySelectorAll("[data-map]").forEach((panel) => {
    const btn = panel.querySelector("[data-map-load]");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const q = panel.dataset.mapQuery;
      const note = panel.querySelector(".map-note");
      if (!q) {
        if (note) note.textContent = LANG === "en" ? "Map unavailable until the address is confirmed." : "Mapa indisponível até o endereço ser confirmado.";
        return;
      }
      const f = document.createElement("iframe");
      f.src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
      f.title = LANG === "en" ? "Map — Oficina Mecânica Toshio" : "Mapa — Oficina Mecânica Toshio";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      f.setAttribute("allowfullscreen", "");
      panel.classList.add("loaded");
      panel.appendChild(f);
    });
  });

  /* ---------- LGPD cookie banner ---------- */
  const KEY = "toshio_cookie_consent_v1";
  const banner = document.getElementById("cookie");
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable — choice applies to this page view only */ } };
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
    const decide = (analise, marketing) => { save({ necessarios: true, analise, marketing, data: new Date().toISOString() }); hide(); };
    banner.querySelector("[data-ck=accept]").addEventListener("click", () => decide(true, true));
    banner.querySelector("[data-ck=reject]").addEventListener("click", () => decide(false, false));
    banner.querySelector("[data-ck=prefs]").addEventListener("click", (e) => {
      const open = prefs.classList.toggle("show");
      e.currentTarget.setAttribute("aria-expanded", String(open));
    });
    banner.querySelector("[data-ck=save]").addEventListener("click", () => decide(an.checked, mk.checked));
    document.querySelectorAll("[data-cookie-open]").forEach((b) => b.addEventListener("click", show));
    if (!read()) show();
  }
})();

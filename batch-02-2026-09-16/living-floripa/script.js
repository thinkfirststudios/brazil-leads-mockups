/* Living Floripa — mockup behaviour. Static, no dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scriptSrc = (doc.currentScript && doc.currentScript.src) || "";
  var base = scriptSrc ? scriptSrc.replace(/script\.js(\?.*)?$/, "") : "";
  var lang = (root.getAttribute("lang") || "pt-BR").slice(0, 2);

  var I18N = {
    pt: {
      title: "Privacidade e cookies",
      body: "Usamos cookies necessários para o site funcionar. Cookies de análise e marketing só são ativados com a sua autorização — nenhum vem marcado. Você pode mudar a escolha a qualquer momento em “Preferências de cookies”, no rodapé.",
      accept: "Aceitar todos", reject: "Rejeitar não essenciais", prefs: "Preferências", save: "Salvar escolhas",
      nec: "Necessários — sempre ativos (funcionamento do site, registro desta escolha).",
      ana: "Análise — medir visitas de forma agregada (ex.: Google Tag Manager). Desativado por padrão.",
      mkt: "Marketing — anúncios e remarketing. Desativado por padrão.",
      policy: "Política de Privacidade",
      demo: "Demonstração: nada foi enviado. No site real, este formulário abre o WhatsApp da Living Floripa com os dados preenchidos.",
      consent: "Para enviar, marque o consentimento LGPD (demonstração)."
    },
    en: {
      title: "Privacy and cookies",
      body: "We use cookies that are necessary for the site to work. Analytics and marketing cookies are only switched on with your permission — none are pre-selected. You can change your choice at any time under “Cookie preferences” in the footer.",
      accept: "Accept all", reject: "Reject non-essential", prefs: "Preferences", save: "Save choices",
      nec: "Necessary — always on (site operation, storing this choice).",
      ana: "Analytics — aggregated visit measurement (e.g. Google Tag Manager). Off by default.",
      mkt: "Marketing — ads and remarketing. Off by default.",
      policy: "Privacy Policy (in Portuguese)",
      demo: "Demo only: nothing was sent. On the live site this form opens WhatsApp with your details filled in.",
      consent: "To send, please tick the data-consent box (demo)."
    },
    es: {
      title: "Privacidad y cookies",
      body: "Usamos cookies necesarias para que el sitio funcione. Las cookies de análisis y marketing solo se activan con tu autorización — ninguna viene marcada. Puedes cambiar tu elección en cualquier momento en “Preferencias de cookies”, en el pie de página.",
      accept: "Aceptar todas", reject: "Rechazar no esenciales", prefs: "Preferencias", save: "Guardar elección",
      nec: "Necesarias — siempre activas (funcionamiento del sitio, registro de esta elección).",
      ana: "Análisis — medición agregada de visitas (p. ej. Google Tag Manager). Desactivadas por defecto.",
      mkt: "Marketing — anuncios y remarketing. Desactivadas por defecto.",
      policy: "Política de Privacidad (en portugués)",
      demo: "Demostración: no se envió nada. En el sitio real, este formulario abre WhatsApp con tus datos.",
      consent: "Para enviar, marca la casilla de consentimiento (demostración)."
    }
  };
  var T = I18N[lang] || I18N.pt;

  /* ---------- year ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- sticky header ---------- */
  var header = doc.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-condensed", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var toggle = doc.querySelector(".menu-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });
  }

  /* ---------- reveal + stagger (slower, subtler for the gallery register) ---------- */
  var reveals = doc.querySelectorAll(".reveal");
  doc.querySelectorAll("[data-stagger]").forEach(function (group) {
    var step = parseInt(group.getAttribute("data-stagger"), 10) || 100;
    Array.prototype.forEach.call(group.querySelectorAll(":scope > .reveal"), function (el, i) {
      el.style.setProperty("--d", (i * step) + "ms");
    });
  });
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  }
  /* No count-up on this build: there are no substantiated statistics to animate. */

  /* ---------- search dialog (header affordance; native <dialog> + explicit focus trap) ---------- */
  var dlg = doc.getElementById("busca");
  var lastFocus = null;
  doc.querySelectorAll("[data-open-search]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      if (!dlg || typeof dlg.showModal !== "function") return;
      e.preventDefault();
      lastFocus = b;
      dlg.showModal();
      var f = dlg.querySelector("select, input");
      if (f) f.focus();
    });
  });
  if (dlg) {
    dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
    dlg.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var els = dlg.querySelectorAll("button, select, input, a[href]");
      var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- WhatsApp chooser (two published lines; main line [CONFIRM]) ---------- */
  var chooser = doc.querySelector(".wa-chooser");
  var setChooserText = function (txt) {
    if (!chooser) return;
    chooser.querySelectorAll("a[data-wa-base]").forEach(function (a) {
      a.href = a.getAttribute("data-wa-base") + "?text=" + encodeURIComponent(txt || a.getAttribute("data-wa-default") || "");
    });
  };
  doc.querySelectorAll("[data-open-chooser]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      if (!chooser) return;
      e.preventDefault();
      setChooserText(b.getAttribute("data-wa-text"));
      chooser.open = true;
      var first = chooser.querySelector(".wa-panel a");
      if (first) first.focus();
    });
  });
  if (chooser) {
    chooser.querySelector("summary").addEventListener("click", function () { setChooserText(null); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && chooser.open) { chooser.open = false; chooser.querySelector("summary").focus(); } });
    doc.addEventListener("click", function (e) { if (chooser.open && !chooser.contains(e.target) && !e.target.closest("[data-open-chooser]")) chooser.open = false; });
  }

  /* ---------- demo forms ---------- */
  doc.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var notice = f.querySelector(".form-notice");
      var consent = f.querySelector("input[name='lgpd']");
      if (consent && !consent.checked) {
        if (notice) { notice.textContent = T.consent; notice.classList.add("show"); }
        consent.focus();
        return;
      }
      if (notice) { notice.textContent = T.demo; notice.classList.add("show"); }
    });
  });

  /* ---------- click-to-load map (LGPD: nothing third-party loads before an explicit click) ---------- */
  doc.addEventListener("click", function (e) {
    var mapBtn = e.target.closest("[data-map-src]");
    if (!mapBtn) return;
    var holder = mapBtn.closest(".map-frame");
    var ifr = doc.createElement("iframe");
    ifr.src = mapBtn.getAttribute("data-map-src");
    ifr.title = mapBtn.getAttribute("data-map-title") || "Mapa";
    ifr.loading = "lazy";
    ifr.referrerPolicy = "no-referrer-when-downgrade";
    ifr.style.cssText = "border:0;width:100%;height:100%;min-height:340px;border-radius:6px";
    holder.innerHTML = "";
    holder.style.padding = "0";
    holder.appendChild(ifr);
  });

  /* ---------- LGPD cookie banner — GTM is injected ONLY after analytics consent ---------- */
  var KEY = "lf_cookie_consent_v1";
  var read = function () { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (err) { return null; } };
  var write = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (err) { /* storage blocked */ } };
  var banner = doc.createElement("div");
  banner.className = "cookie";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-labelledby", "cookie-title");
  banner.innerHTML =
    '<div class="cookie-inner">' +
    '<h2 id="cookie-title">' + T.title + '</h2>' +
    '<p>' + T.body + ' <a href="' + base + 'privacidade.html">' + T.policy + '</a>.</p>' +
    '<div class="cookie-prefs" id="cookie-prefs">' +
    '<label><input type="checkbox" checked disabled> <span>' + T.nec + '</span></label>' +
    '<label><input type="checkbox" name="analytics"> <span>' + T.ana + '</span></label>' +
    '<label><input type="checkbox" name="marketing"> <span>' + T.mkt + '</span></label>' +
    '</div>' +
    '<div class="cookie-actions">' +
    '<button type="button" class="btn btn-dark" data-c="accept">' + T.accept + '</button>' +
    '<button type="button" class="btn btn-dark" data-c="reject">' + T.reject + '</button>' +
    '<button type="button" class="btn btn-ghost" data-c="prefs" aria-expanded="false" aria-controls="cookie-prefs">' + T.prefs + '</button>' +
    '<button type="button" class="btn btn-ghost" data-c="save" hidden>' + T.save + '</button>' +
    '</div></div>';
  doc.body.appendChild(banner);
  var prefsBox = banner.querySelector(".cookie-prefs");
  var saveBtn = banner.querySelector("[data-c='save']");
  var prefsBtn = banner.querySelector("[data-c='prefs']");
  var openBanner = function (withPrefs) {
    var cur = read() || {};
    banner.querySelector("[name='analytics']").checked = !!cur.analytics;
    banner.querySelector("[name='marketing']").checked = !!cur.marketing;
    prefsBox.classList.toggle("show", !!withPrefs);
    saveBtn.hidden = !withPrefs;
    prefsBtn.setAttribute("aria-expanded", String(!!withPrefs));
    banner.classList.add("show");
  };
  var applyConsent = function (v) {
    root.setAttribute("data-consent-analytics", v.analytics ? "granted" : "denied");
    /* Production: if (v.analytics) inject the GTM snippet here (GTM-[CONFIRM]). Nothing loads in the mockup. */
  };
  var closeBanner = function (v) {
    v.date = new Date().toISOString();
    write(v);
    banner.classList.remove("show");
    applyConsent(v);
  };
  banner.addEventListener("click", function (e) {
    var b = e.target.closest("[data-c]");
    if (!b) return;
    var c = b.getAttribute("data-c");
    if (c === "accept") closeBanner({ necessary: true, analytics: true, marketing: true });
    if (c === "reject") closeBanner({ necessary: true, analytics: false, marketing: false });
    if (c === "prefs") { var open = !prefsBox.classList.contains("show"); prefsBox.classList.toggle("show", open); saveBtn.hidden = !open; b.setAttribute("aria-expanded", String(open)); }
    if (c === "save") closeBanner({ necessary: true, analytics: banner.querySelector("[name='analytics']").checked, marketing: banner.querySelector("[name='marketing']").checked });
  });
  doc.querySelectorAll("[data-cookie-prefs]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openBanner(true); });
  });
  var saved = read();
  if (saved) { applyConsent(saved); } else { setTimeout(function () { openBanner(false); }, 700); }
})();

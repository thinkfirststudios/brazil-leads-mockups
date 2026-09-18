/* Unik Imóveis — mockup behaviour. Static, no dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scriptSrc = (doc.currentScript && doc.currentScript.src) || "";
  var base = scriptSrc ? scriptSrc.replace(/script\.js(\?.*)?$/, "") : "";
  var lang = (root.getAttribute("lang") || "pt-BR").slice(0, 2);

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

  /* ---------- reveal + stagger ---------- */
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
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up: ONLY for elements carrying a numeric data-count generated from the real feed ---------- */
  var counters = [].filter.call(doc.querySelectorAll("[data-count]"), function (el) {
    return /^\d+$/.test(el.getAttribute("data-count") || "");
  });
  var runCount = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce) { el.textContent = target; return; }
    var t0 = null, dur = 900;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else { counters.forEach(runCount); }
  }

  /* ---------- favourite hearts (demo only, not stored) ---------- */
  doc.addEventListener("click", function (e) {
    var fav = e.target.closest(".fav");
    if (!fav) return;
    var on = fav.getAttribute("aria-pressed") === "true";
    fav.setAttribute("aria-pressed", String(!on));
  });

  /* ---------- matrix toggle (Para alugar is [CONFIRM]) ---------- */
  doc.querySelectorAll(".seg button:not([disabled])").forEach(function (b) {
    b.addEventListener("click", function () {
      b.parentElement.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
  });

  /* ---------- hero search → navigates to the matching static matrix cell ---------- */
  var search = doc.querySelector("form[data-matrix-search]");
  if (search) {
    search.addEventListener("submit", function (e) {
      e.preventDefault();
      var tipo = search.elements.tipo.value, bairro = search.elements.bairro.value;
      var out = search.querySelector(".search-note");
      if (tipo && bairro) {
        window.location.href = base + "imoveis/a-venda/" + tipo + "/florianopolis/" + bairro + "/index.html";
      } else if (out) {
        out.textContent = "Escolha um tipo e um bairro para abrir a página da matriz correspondente (faixa de valor: filtro demonstrativo — depende do feed real [CONFIRM]).";
      }
    });
  }

  /* ---------- demo forms ---------- */
  doc.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var notice = f.querySelector(".form-notice");
      var consent = f.querySelector("input[name='lgpd']");
      if (consent && !consent.checked) {
        if (notice) { notice.textContent = "Para enviar, marque o consentimento LGPD (demonstração)."; notice.classList.add("show"); }
        consent.focus();
        return;
      }
      if (notice) {
        notice.textContent = "Demonstração: nada foi enviado. No site real, este formulário abre o WhatsApp da imobiliária com os dados preenchidos — número [CONFIRM].";
        notice.classList.add("show");
      }
    });
  });

  /* ---------- click-to-load embeds (LGPD: nothing third-party loads before an explicit click) ---------- */
  doc.addEventListener("click", function (e) {
    var mapBtn = e.target.closest("[data-map-src]");
    if (mapBtn) {
      var holder = mapBtn.closest(".map-frame");
      var ifr = doc.createElement("iframe");
      ifr.src = mapBtn.getAttribute("data-map-src");
      ifr.title = mapBtn.getAttribute("data-map-title") || "Mapa";
      ifr.loading = "lazy";
      ifr.referrerPolicy = "no-referrer-when-downgrade";
      ifr.style.cssText = "border:0;width:100%;height:100%;min-height:320px;border-radius:12px";
      holder.innerHTML = "";
      holder.style.padding = "0";
      holder.appendChild(ifr);
      return;
    }
    var vid = e.target.closest(".video-facade");
    if (vid) {
      var id = vid.getAttribute("data-yt");
      if (!id) {
        var n = vid.parentElement.querySelector(".video-note");
        if (n) n.textContent = "Demonstração: vídeo ainda não definido — [CONFIRM que o canal do YouTube está ativo e é da Unik]. O iframe só carrega após o clique.";
        return;
      }
      var v = doc.createElement("iframe");
      v.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      v.title = vid.getAttribute("aria-label") || "Vídeo";
      v.allow = "autoplay; encrypted-media; picture-in-picture";
      v.allowFullscreen = true;
      v.style.cssText = "border:0;width:100%;aspect-ratio:16/9;border-radius:14px";
      vid.replaceWith(v);
    }
  });

  /* ---------- LGPD cookie banner ---------- */
  var KEY = "unik_cookie_consent_v1";
  var read = function () { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (err) { return null; } };
  var write = function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (err) { /* storage blocked: banner simply reappears */ } };
  var T = {
    title: "Privacidade e cookies",
    body: "Usamos cookies necessários para o site funcionar. Cookies de análise e marketing só são ativados com a sua autorização — nenhum vem marcado. Você pode mudar a escolha a qualquer momento em “Preferências de cookies”, no rodapé.",
    accept: "Aceitar todos", reject: "Rejeitar não essenciais", prefs: "Preferências", save: "Salvar escolhas",
    nec: "Necessários — sempre ativos (funcionamento do site, registro desta escolha).",
    ana: "Análise — medir visitas de forma agregada (ex.: Google Analytics / GTM). Desativado por padrão.",
    mkt: "Marketing — anúncios e remarketing. Desativado por padrão.",
    policy: "Política de Privacidade"
  };
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
  var closeBanner = function (v) {
    v.date = new Date().toISOString();
    write(v);
    banner.classList.remove("show");
    applyConsent(v);
  };
  /* Tags (GTM/Analytics) would be injected here ONLY when consent.analytics === true. Nothing loads in the mockup. */
  var applyConsent = function (v) { root.setAttribute("data-consent-analytics", v.analytics ? "granted" : "denied"); };
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
  if (saved) { applyConsent(saved); } else { setTimeout(function () { openBanner(false); }, 600); }
})();

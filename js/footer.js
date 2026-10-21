/**
 * FOOTER TEMPLATE — footer.js
 * =====================================================================
 * Merender footer dari window.FooterConfig (lihat footer-config.js).
 * File ini umumnya TIDAK perlu diubah saat dipakai di website lain.
 *
 * Pemakaian paling sederhana:
 *   <footer data-site-footer></footer>
 *   <script src="js/footer-config.js"></script>
 *   <script src="js/footer.js"></script>
 *
 * API (opsional, untuk kebutuhan lanjutan / upgrade):
 *   Footer.render(elementOrSelector, config)  -> render manual
 *   Footer.update(partialConfig)              -> ubah sebagian setting lalu render ulang
 *   Footer.getConfig()                        -> config yang sedang aktif (sudah di-merge)
 * =====================================================================
 */
(function (global) {
  "use strict";

  /* ---------- default aman bila config tidak lengkap ---------- */
  var DEFAULTS = {
    brand: { logoUrl: "", logoHeight: "", textMain: "BRAND", textAccent: "", href: "/", description: "" },
    columns: [],
    bottom: { copyright: "© {year} Nama Brand.", note: "" },
    layout: {
      maxWidth: "1240px",
      brandWeight: "1.4fr",
      mobileColumns: 1,
      mobileAlign: "left",
      showBrand: true,
      showBottomBar: true
    },
    theme: { mode: "dark", background: "", text: "", muted: "", faint: "", border: "", accent: "" }
  };

  var activeConfig = null;
  var mountedNodes = [];

  /* ---------- util ---------- */
  function isPlainObject(v) {
    return v && typeof v === "object" && !Array.isArray(v);
  }

  // Gabung objek secara dalam. Array TIDAK digabung (diganti utuh).
  function deepMerge(base, extra) {
    var out = {};
    Object.keys(base).forEach(function (k) {
      out[k] = isPlainObject(base[k]) ? deepMerge(base[k], {}) : base[k];
    });
    Object.keys(extra || {}).forEach(function (k) {
      if (isPlainObject(extra[k]) && isPlainObject(out[k])) out[k] = deepMerge(out[k], extra[k]);
      else out[k] = extra[k];
    });
    return out;
  }

  function esc(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Hanya izinkan protokol aman pada link (tolak "javascript:" dsb).
  function safeHref(href) {
    var h = String(href || "").trim();
    if (!h) return "#";
    if (/^(https?:|mailto:|tel:|#|\/|\.\.?\/)/i.test(h)) return h;
    if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return "#";   // protokol asing -> tolak
    return h;                                           // path relatif biasa, mis. "services.html"
  }

  function isImageValue(v) {
    var s = String(v || "").trim();
    return /^(https?:\/\/|\/|\.\.?\/|assets\/|data:image)/i.test(s) ||
           /\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/i.test(s);
  }

  function renderIcon(icon) {
    if (!icon) return "";
    var inner = isImageValue(icon)
      ? '<img src="' + esc(icon) + '" alt="">'
      : esc(icon);
    return '<span class="ft-icon" aria-hidden="true">' + inner + "</span>";
  }

  function fillYear(text) {
    return String(text || "").replace(/\{year\}/gi, String(new Date().getFullYear()));
  }

  /* ---------- builder markup ---------- */
  function buildBrand(cfg) {
    var b = cfg.brand;
    var label = (b.textMain || "") + (b.textAccent || "");
    var textBrand = esc(b.textMain) + (b.textAccent ? '<span class="ft-brand-accent">' + esc(b.textAccent) + "</span>" : "");
    var content = b.logoUrl
      ? '<img class="ft-brand-logo" src="' + esc(b.logoUrl) + '" alt="' + esc(label || "Logo") + '" data-ft-logo>'
      : textBrand;

    return (
      '<div class="ft-brand">' +
        '<a class="ft-brand-link" href="' + esc(safeHref(b.href)) + '">' + content + "</a>" +
        (b.description ? '<p class="ft-brand-text">' + esc(b.description) + "</p>" : "") +
      "</div>"
    );
  }

  function buildColumn(col) {
    var title = col.title ? '<h4 class="ft-col-title">' + esc(col.title) + "</h4>" : "";
    var items = "";

    (col.links || []).forEach(function (link) {
      var external = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
      items +=
        "<li>" + renderIcon(link.icon) +
        '<a href="' + esc(safeHref(link.href)) + '"' + external + ">" + esc(link.label) + "</a></li>";
    });

    (col.lines || []).forEach(function (line) {
      items += "<li>" + esc(line) + "</li>";
    });

    var tag = (col.links && col.links.length) ? "nav" : "div";
    var aria = tag === "nav" && col.title ? ' aria-label="' + esc(col.title) + '"' : "";
    return '<' + tag + ' class="ft-col"' + aria + ">" + title + '<ul class="ft-list">' + items + "</ul></" + tag + ">";
  }

  function buildBottom(cfg) {
    var b = cfg.bottom || {};
    var left = b.copyright ? "<span>" + esc(fillYear(b.copyright)) + "</span>" : "";
    var right = b.note ? "<span>" + esc(fillYear(b.note)) + "</span>" : "";
    if (!left && !right) return "";
    return '<div class="ft-wrap"><div class="ft-bottom">' + left + right + "</div></div>";
  }

  function buildMarkup(cfg) {
    var columns = (cfg.columns || []).map(buildColumn).join("");
    return (
      '<div class="ft-wrap">' +
        '<div class="ft-grid">' + buildBrand(cfg) + columns + "</div>" +
      "</div>" +
      buildBottom(cfg)
    );
  }

  /* ---------- terapkan setting ke elemen <footer> ---------- */
  function applySettings(el, cfg) {
    var l = cfg.layout, t = cfg.theme;

    el.classList.add("site-footer");
    el.setAttribute("data-footer-theme", t.mode === "light" ? "light" : "dark");
    el.setAttribute("data-mobile-columns", String(Number(l.mobileColumns) === 2 ? 2 : 1));
    el.setAttribute("data-mobile-align", l.mobileAlign === "center" ? "center" : "left");
    el.setAttribute("data-hide-brand", l.showBrand === false ? "true" : "false");
    el.setAttribute("data-hide-bottom", l.showBottomBar === false ? "true" : "false");

    var vars = {
      "--ft-max": l.maxWidth,
      "--ft-brand-weight": l.brandWeight,
      "--ft-cols": Math.max(1, (cfg.columns || []).length),
      "--ft-logo-height": cfg.brand.logoHeight,
      "--ft-bg": t.background,
      "--ft-text": t.text,
      "--ft-muted": t.muted,
      "--ft-faint": t.faint,
      "--ft-border": t.border,
      "--ft-accent": t.accent
    };
    Object.keys(vars).forEach(function (name) {
      var val = vars[name];
      if (val === "" || val === undefined || val === null) el.style.removeProperty(name);
      else el.style.setProperty(name, val);
    });
  }

  // Kalau file logo tidak ditemukan / gagal dimuat, otomatis kembali ke tulisan
  // supaya footer tidak menampilkan gambar rusak.
  function attachLogoFallback(el, cfg) {
    var img = el.querySelector("img[data-ft-logo]");
    if (!img) return;
    img.addEventListener("error", function () {
      var link = img.parentNode;
      var b = cfg.brand;
      link.innerHTML = esc(b.textMain) + (b.textAccent ? '<span class="ft-brand-accent">' + esc(b.textAccent) + "</span>" : "");
    }, { once: true });
  }

  /* ---------- API publik ---------- */
  function resolveElement(target) {
    if (!target) return null;
    return typeof target === "string" ? document.querySelector(target) : target;
  }

  function render(target, config) {
    var el = resolveElement(target);
    if (!el) return null;
    var cfg = deepMerge(DEFAULTS, config || global.FooterConfig || {});
    activeConfig = cfg;
    applySettings(el, cfg);
    el.innerHTML = buildMarkup(cfg);
    attachLogoFallback(el, cfg);
    if (mountedNodes.indexOf(el) === -1) mountedNodes.push(el);
    return el;
  }

  function update(partial) {
    var next = deepMerge(activeConfig || DEFAULTS, partial || {});
    mountedNodes.forEach(function (el) { render(el, next); });
    return next;
  }

  function getConfig() {
    return activeConfig ? deepMerge(activeConfig, {}) : deepMerge(DEFAULTS, global.FooterConfig || {});
  }

  function autoInit() {
    var nodes = document.querySelectorAll("[data-site-footer]");
    Array.prototype.forEach.call(nodes, function (el) { render(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoInit);
  else autoInit();

  global.Footer = { render: render, update: update, getConfig: getConfig };
})(window);

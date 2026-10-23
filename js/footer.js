/**
 * FOOTER TEMPLATE — footer.js
 * =====================================================================
 * Merender footer dari window.FooterConfig (lihat footer-config.js).
 * File ini umumnya TIDAK perlu diubah.
 *
 * Yang dilakukan file ini secara otomatis (website tidak perlu menambah apa pun):
 *   - memuat footer.css sendiri (lengkap dengan font Inter)
 *   - mengubah path gambar relatif (logo, ikon) agar menunjuk ke folder footer
 *   - membuat ikon PNG otomatis putih (latar gelap) / hitam (latar terang)
 *   - menerjemahkan teks footer + dropdown bahasa yang berfungsi
 *
 * Pemakaian paling sederhana:
 *   <footer data-site-footer></footer>
 *   <script src="js/footer-config.js"></script>
 *   <script src="js/footer.js"></script>
 *
 * API (opsional):
 *   Footer.render(elementOrSelector, config)  -> render manual
 *   Footer.update(partialConfig)              -> ubah sebagian setting lalu render ulang
 *   Footer.getConfig()                        -> config aktif (sudah di-merge)
 *   Footer.setLanguage("en")                  -> ganti bahasa lewat kode
 *   Footer.getLanguage()                      -> kode bahasa aktif
 *
 * Event (opsional, untuk website yang ingin ikut berganti bahasa):
 *   window.addEventListener("footer:languagechange", e => console.log(e.detail.lang));
 * =====================================================================
 */
(function (global) {
  "use strict";

  /* =================================================================
     1. DEFAULT AMAN (dipakai bila config tidak lengkap)
     ================================================================= */
  var DEFAULTS = {
    brand: { logoUrl: "", logoUrlLight: "", logoHeight: "", textMain: "BRAND", textAccent: "", href: "/", description: "" },
    icons: {},
    iconColor: "auto",
    assetBase: "",
    autoCss: true,
    columns: [],
    language: { show: true, default: "", remember: true, autoDetect: false, list: [] },
    texts: {},
    bottom: { copyright: "© {year} Nama Brand.", note: "" },
    layout: {
      maxWidth: "1240px",
      brandWeight: "1.4fr",
      iconSize: "20px",
      mobileColumns: 1,
      mobileAlign: "left",
      showBrand: true,
      showBottomBar: true
    },
    theme: { mode: "dark", background: "", text: "", muted: "", faint: "", border: "", accent: "" }
  };

  var LANG_STORAGE_KEY = "ft_lang";
  var activeConfig = null;
  var mountedNodes = [];
  var currentLang = null;

  // Lokasi file ini -> dipakai untuk mencari folder footer (css, assets)
  var SCRIPT_SRC = (function () {
    var s = document.currentScript;
    if (!s || !s.src) {
      var all = document.getElementsByTagName("script");
      for (var i = all.length - 1; i >= 0; i--) {
        if (/footer\.js(\?|#|$)/i.test(all[i].src || "")) { s = all[i]; break; }
      }
    }
    return s && s.src ? s.src : "";
  })();

  /* =================================================================
     2. UTIL
     ================================================================= */
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

  function fillYear(text) {
    return String(text || "").replace(/\{year\}/gi, String(new Date().getFullYear()));
  }

  /* =================================================================
     3. LOKASI ASET (logo, ikon, css)
     Path relatif dihitung dari folder footer (satu tingkat di atas js/),
     jadi footer tetap benar di website mana pun.
     Bisa diganti manual lewat config: assetBase: "https://situs/footer/"
     ================================================================= */
  function baseUrl(cfg) {
    var raw = (cfg && cfg.assetBase) || "";
    try {
      if (raw) {
        var u = new URL(raw, document.baseURI).href;
        return u.charAt(u.length - 1) === "/" ? u : u + "/";
      }
      if (SCRIPT_SRC) return new URL("../", SCRIPT_SRC).href;
    } catch (e) { /* abaikan */ }
    return document.baseURI;
  }

  function assetUrl(path, cfg) {
    var s = String(path || "").trim();
    if (!s) return "";
    if (/^(https?:)?\/\//i.test(s) || /^(data|blob):/i.test(s) || s.charAt(0) === "/") return s;
    try { return new URL(s, baseUrl(cfg)).href; } catch (e) { return s; }
  }

  /* =================================================================
     4. CSS OTOMATIS
     footer.css dimuat sendiri; footer disembunyikan sebentar sampai CSS
     siap supaya tidak "berkedip" tampil tanpa gaya.
     ================================================================= */
  var cssState = "idle";   // idle | loading | ready
  var cssWaiters = [];

  function ensureCss(cfg, done) {
    if (cssState === "ready") { done(); return; }
    cssWaiters.push(done);
    if (cssState === "loading") return;
    cssState = "loading";

    function finish() {
      if (cssState === "ready") return;
      cssState = "ready";
      cssWaiters.splice(0).forEach(function (fn) { fn(); });
    }

    var link = document.querySelector("link[data-ft-css]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = new URL("css/footer.css", baseUrl(cfg)).href;
      link.setAttribute("data-ft-css", "");
      document.head.appendChild(link);
    } else if (link.sheet) {
      finish();
      return;
    }
    link.addEventListener("load", finish);
    link.addEventListener("error", finish);
    setTimeout(finish, 3000);   // jaring pengaman
  }

  /* =================================================================
     5. WARNA IKON & LOGO OTOMATIS (ikut warna latar footer)
     ================================================================= */
  // Ubah warna CSS apa pun (hex, rgb, nama warna) menjadi [r,g,b], atau null.
  function parseColor(c) {
    if (!c || !document.body) return null;
    var probe = document.createElement("span");
    probe.style.color = "";
    probe.style.color = c;
    if (!probe.style.color) return null;           // warna tidak valid
    probe.style.display = "none";
    document.body.appendChild(probe);
    var rgb = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    var m = String(rgb).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    if (p.length > 3 && p[3] < 0.5) return null;   // hampir transparan -> tidak dipakai
    return p.slice(0, 3);
  }

  function luminance(rgb) {
    function lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
  }

  // true bila latar footer terang
  function isLightBackground(cfg) {
    var rgb = parseColor(cfg.theme.background);
    if (rgb) return luminance(rgb) > 0.179;        // titik tengah kontras hitam vs putih
    return cfg.theme.mode === "light";
  }

  // white | black | original
  function iconTone(cfg) {
    var c = String(cfg.iconColor || "auto").toLowerCase();
    if (c === "white" || c === "black" || c === "original") return c;
    return isLightBackground(cfg) ? "black" : "white";
  }

  /* =================================================================
     6. BAHASA
     ================================================================= */
  function langList(cfg) {
    return (cfg.language && Array.isArray(cfg.language.list)) ? cfg.language.list : [];
  }
  function hasLang(cfg, code) {
    return langList(cfg).some(function (l) { return l.code === code; });
  }
  function defaultLang(cfg) {
    var d = cfg.language && cfg.language.default;
    if (d && hasLang(cfg, d)) return d;
    var list = langList(cfg);
    return list.length ? list[0].code : (d || "");
  }

  function pickInitialLang(cfg) {
    var L = cfg.language || {};
    if (L.remember !== false) {
      try {
        var saved = localStorage.getItem(LANG_STORAGE_KEY);
        if (saved && hasLang(cfg, saved)) return saved;
      } catch (e) { /* abaikan */ }
    }
    if (L.autoDetect) {
      var nav = String(navigator.language || "").toLowerCase().split("-")[0];
      if (nav && hasLang(cfg, nav)) return nav;
    }
    return defaultLang(cfg);
  }

  // Terjemahkan sebuah nilai:
  //   "@kunci"            -> ambil dari texts[bahasa aktif][kunci]
  //   { id:"..", en:".." } -> pilih sesuai bahasa aktif
  //   "teks biasa"        -> dipakai apa adanya
  function tr(cfg, value) {
    var T = cfg.texts || {};
    var fallbackLang = defaultLang(cfg);

    if (isPlainObject(value)) {
      if (value[currentLang] != null) return value[currentLang];
      if (value[fallbackLang] != null) return value[fallbackLang];
      var first = Object.keys(value)[0];
      return first ? value[first] : "";
    }

    var s = String(value == null ? "" : value);
    if (s.charAt(0) !== "@") return s;

    var key = s.slice(1);
    if (T[currentLang] && T[currentLang][key] != null) return T[currentLang][key];
    if (T[fallbackLang] && T[fallbackLang][key] != null) return T[fallbackLang][key];
    return key;   // kunci tidak ditemukan -> tampilkan nama kuncinya agar mudah dilacak
  }

  /* =================================================================
     7. BUILDER MARKUP
     ================================================================= */
  function renderIcon(icon, cfg) {
    if (!icon) return "";
    var ref = (cfg.icons && cfg.icons[icon]) ? cfg.icons[icon] : icon;   // nama ikon -> path
    var inner = isImageValue(ref)
      ? '<img class="ft-icon-img" src="' + esc(assetUrl(ref, cfg)) + '" alt="" loading="lazy" decoding="async">'
      : esc(ref);                                                          // emoji / teks
    return '<span class="ft-icon" aria-hidden="true">' + inner + "</span>";
  }

  function buildBrand(cfg, light) {
    var b = cfg.brand;
    var label = (b.textMain || "") + (b.textAccent || "");
    var logo = (light && b.logoUrlLight) ? b.logoUrlLight : b.logoUrl;
    var textBrand = esc(b.textMain) + (b.textAccent ? '<span class="ft-brand-accent">' + esc(b.textAccent) + "</span>" : "");
    var content = logo
      ? '<img class="ft-brand-logo" src="' + esc(assetUrl(logo, cfg)) + '" alt="' + esc(label || "Logo") + '" data-ft-logo>'
      : textBrand;
    var desc = tr(cfg, b.description);

    return (
      '<div class="ft-brand">' +
        '<a class="ft-brand-link" href="' + esc(safeHref(b.href)) + '">' + content + "</a>" +
        (desc ? '<p class="ft-brand-text">' + esc(desc) + "</p>" : "") +
      "</div>"
    );
  }

  function buildColumn(cfg, col) {
    var titleText = tr(cfg, col.title);
    var title = titleText ? '<h4 class="ft-col-title">' + esc(titleText) + "</h4>" : "";
    var items = "";

    (col.links || []).forEach(function (link) {
      var external = link.external ? ' target="_blank" rel="noopener noreferrer"' : "";
      items +=
        "<li>" + renderIcon(link.icon, cfg) +
        '<a href="' + esc(safeHref(link.href)) + '"' + external + ">" + esc(tr(cfg, link.label)) + "</a></li>";
    });

    (col.lines || []).forEach(function (line) {
      items += "<li>" + esc(tr(cfg, line)) + "</li>";
    });

    var tag = (col.links && col.links.length) ? "nav" : "div";
    var aria = tag === "nav" && titleText ? ' aria-label="' + esc(titleText) + '"' : "";
    return "<" + tag + ' class="ft-col"' + aria + ">" + title + '<ul class="ft-list">' + items + "</ul></" + tag + ">";
  }

  function buildLanguageMenu(cfg) {
    var L = cfg.language || {};
    var list = langList(cfg);
    if (L.show === false || list.length < 2) return "";

    var label = tr(cfg, "@language");
    var options = list.map(function (l) {
      var text = (l.flag ? l.flag + " | " : "") + (l.name || l.code);
      return '<option value="' + esc(l.code) + '"' + (l.code === currentLang ? " selected" : "") + ">" + esc(text) + "</option>";
    }).join("");

    return (
      '<label class="ft-lang">' +
        '<span class="ft-sr-only">' + esc(label) + "</span>" +
        '<select class="ft-lang-select" aria-label="' + esc(label) + '">' + options + "</select>" +
      "</label>"
    );
  }

  function buildBottom(cfg) {
    var b = cfg.bottom || {};
    var copy = b.copyright ? fillYear(tr(cfg, b.copyright)) : "";
    var note = b.note ? fillYear(tr(cfg, b.note)) : "";
    var menu = buildLanguageMenu(cfg);
    if (!copy && !note && !menu) return "";

    var end = (note ? "<span>" + esc(note) + "</span>" : "") + menu;
    return (
      '<div class="ft-wrap"><div class="ft-bottom">' +
        (copy ? '<span class="ft-copy">' + esc(copy) + "</span>" : "") +
        (end ? '<div class="ft-bottom-end">' + end + "</div>" : "") +
      "</div></div>"
    );
  }

  function buildMarkup(cfg, light) {
    var columns = (cfg.columns || []).map(function (c) { return buildColumn(cfg, c); }).join("");
    return (
      '<div class="ft-wrap">' +
        '<div class="ft-grid">' + buildBrand(cfg, light) + columns + "</div>" +
      "</div>" +
      buildBottom(cfg)
    );
  }

  /* =================================================================
     8. TERAPKAN SETTING KE ELEMEN <footer>
     ================================================================= */
  function applySettings(el, cfg, tone) {
    var l = cfg.layout, t = cfg.theme;

    el.classList.add("site-footer");
    el.setAttribute("data-footer-theme", t.mode === "light" ? "light" : "dark");
    el.setAttribute("data-icon-tone", tone);
    el.setAttribute("data-mobile-columns", String(Number(l.mobileColumns) === 2 ? 2 : 1));
    el.setAttribute("data-mobile-align", l.mobileAlign === "center" ? "center" : "left");
    el.setAttribute("data-hide-brand", l.showBrand === false ? "true" : "false");
    el.setAttribute("data-hide-bottom", l.showBottomBar === false ? "true" : "false");
    if (currentLang) el.setAttribute("lang", currentLang);

    var vars = {
      "--ft-max": l.maxWidth,
      "--ft-brand-weight": l.brandWeight,
      "--ft-cols": Math.max(1, (cfg.columns || []).length),
      "--ft-logo-height": cfg.brand.logoHeight,
      "--ft-icon-size": l.iconSize,
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

  // Kalau gambar logo gagal dimuat -> kembali ke tulisan. Ikon gagal -> disembunyikan.
  function attachImageFallbacks(el, cfg) {
    var logo = el.querySelector("img[data-ft-logo]");
    if (logo) {
      logo.addEventListener("error", function () {
        var b = cfg.brand;
        logo.parentNode.innerHTML = esc(b.textMain) + (b.textAccent ? '<span class="ft-brand-accent">' + esc(b.textAccent) + "</span>" : "");
      }, { once: true });
    }
    Array.prototype.forEach.call(el.querySelectorAll("img.ft-icon-img"), function (img) {
      img.addEventListener("error", function () {
        if (img.parentNode) img.parentNode.style.display = "none";
      }, { once: true });
    });
  }

  function attachLanguageMenu(el) {
    var select = el.querySelector(".ft-lang-select");
    if (!select) return;
    select.addEventListener("change", function () {
      setLanguage(select.value, { from: el });
    });
  }

  /* =================================================================
     9. API PUBLIK
     ================================================================= */
  function resolveElement(target) {
    if (!target) return null;
    return typeof target === "string" ? document.querySelector(target) : target;
  }

  function render(target, config) {
    var el = resolveElement(target);
    if (!el) return null;

    var cfg = deepMerge(DEFAULTS, config || global.FooterConfig || {});
    activeConfig = cfg;
    if (currentLang === null || (langList(cfg).length && !hasLang(cfg, currentLang))) {
      currentLang = pickInitialLang(cfg);
    }

    var light = isLightBackground(cfg);
    var tone = iconTone(cfg);

    if (cfg.autoCss !== false) {
      if (cssState !== "ready") el.style.visibility = "hidden";
      ensureCss(cfg, function () { el.style.visibility = ""; });
    }

    applySettings(el, cfg, tone);
    el.innerHTML = buildMarkup(cfg, light);
    attachImageFallbacks(el, cfg);
    attachLanguageMenu(el);

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

  function setLanguage(code, opts) {
    var cfg = activeConfig || deepMerge(DEFAULTS, global.FooterConfig || {});
    if (!hasLang(cfg, code)) return false;

    currentLang = code;
    if (cfg.language.remember !== false) {
      try { localStorage.setItem(LANG_STORAGE_KEY, code); } catch (e) { /* abaikan */ }
    }

    mountedNodes.forEach(function (el) { render(el, cfg); });

    // kembalikan fokus ke dropdown setelah footer digambar ulang
    var from = opts && opts.from;
    if (from) {
      var sel = from.querySelector(".ft-lang-select");
      if (sel) sel.focus();
    }

    try {
      global.dispatchEvent(new CustomEvent("footer:languagechange", { detail: { lang: code } }));
    } catch (e) { /* browser lama */ }
    return true;
  }

  function getLanguage() {
    return currentLang;
  }

  function autoInit() {
    var nodes = document.querySelectorAll("[data-site-footer]");
    Array.prototype.forEach.call(nodes, function (el) { render(el); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoInit);
  else autoInit();

  global.Footer = {
    render: render,
    update: update,
    getConfig: getConfig,
    setLanguage: setLanguage,
    getLanguage: getLanguage
  };
})(window);

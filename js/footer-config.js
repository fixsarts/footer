/**
 * =====================================================================
 *  FOOTER — footer-config.js
 *  INI SATU-SATUNYA FILE YANG PERLU KAMU EDIT.
 *  Semua teks, link, ikon, bahasa, dan tampilan footer diatur di sini.
 * =====================================================================
 *
 *  DAFTAR ISI (cari nomornya dengan Ctrl+F)
 *    [1] BRAND ............ logo + deskripsi
 *    [2] IKON ............. daftar ikon + warna otomatis
 *    [3] KOLOM MENU ....... Jelajahi, Kontak, Lokasi (tambah/hapus bebas)
 *    [4] BAR BAWAH ........ copyright
 *    [5] BAHASA ........... dropdown bahasa
 *    [6] TEKS TERJEMAHAN .. semua kata yang tampil, per bahasa
 *    [7] LAYOUT ........... ukuran & tampilan HP / Web
 *    [8] TEMA ............. gelap / terang + warna
 *
 *  ATURAN MENULIS TEKS
 *    "Teks biasa"   -> tampil apa adanya, di semua bahasa (contoh: "WhatsApp")
 *    "@kunci"       -> diambil dari bagian [6], jadi ikut berganti bahasa
 *                      contoh: "@services" -> "Layanan" / "Services" / ...
 *
 *  CARA PASANG DI WEBSITE MANA PUN (tanpa tambah CSS apa pun):
 *    <footer data-site-footer></footer>
 *    <script src="https://fixsarts.github.io/footer/js/footer-config.js"></script>
 *    <script src="https://fixsarts.github.io/footer/js/footer.js"></script>
 * =====================================================================
 */
window.FooterConfig = {

  /* =================================================================
     [1] BRAND  (kolom paling kiri)
     ================================================================= */
  brand: {
    // Path logo dihitung dari folder footer ini, jadi aman dipakai di web lain.
    logoUrl:      "assets/Fixs Arts (White).png",  // logo untuk latar GELAP
    logoUrlLight: "assets/Fixs Arts.png",          // logo untuk latar TERANG (otomatis dipakai)
    logoHeight:   "50px",                          // tinggi logo (lebar mengikuti proporsi)

    // Dipakai bila logoUrl dikosongkan ("") atau gambar gagal dimuat:
    textMain:   "FIXS",
    textAccent: ".ARTS",                           // bagian yang diberi warna aksen

    href: "index.html",                            // link saat logo diklik
    description: "@tagline"                        // teksnya ada di bagian [6]
  },

  /* =================================================================
     [2] IKON
     Daftarkan ikon sekali di sini, lalu pakai namanya di kolom menu [3].
     File ikon boleh PNG berwarna APA SAJA — warnanya diubah otomatis.
     Mau ikon baru? Taruh file PNG-nya di assets/Icon/ lalu tambah satu baris.
     ================================================================= */
  icons: {
    whatsapp:  "assets/Icon/Whatsapp.png",
    email:     "assets/Icon/Mail.png",
    instagram: "assets/Icon/Instagram.png",
    tiktok:    "assets/Icon/TikTok.png",
    website:   "assets/Icon/Website.png"
  },

  // Warna ikon:
  //   "auto"     = ikut latar footer (latar gelap -> ikon putih, latar terang -> ikon hitam)
  //   "white"    = selalu putih
  //   "black"    = selalu hitam
  //   "original" = pakai warna asli file PNG
  iconColor: "auto",

  /* =================================================================
     [3] KOLOM MENU
     Tambah / hapus / urutkan kolom sesuka hati — layout menyesuaikan sendiri.

     Satu kolom = { title, links }  atau  { title, lines }
       links : daftar link   -> { label, href, icon?, external? }
       lines : daftar teks biasa tanpa link

     icon     : nama dari bagian [2] (mis. "whatsapp"), boleh juga emoji
     external : true = link dibuka di tab baru
     ================================================================= */
  columns: [

    /* ----- Kolom 1: Jelajahi ----- */
    {
      title: "@explore",
      links: [
        { label: "@services",  href: "services.html" },
        { label: "@portfolio", href: "https://www.behance.net/fixsarts", external: true },
        { label: "@about",     href: "about.html" }
      ]
    },

    /* ----- Kolom 2: Kontak ----- */
    {
      title: "@contact",
      links: [
        {
          label: "WhatsApp",
          href: "https://api.whatsapp.com/send/?phone=6285655526686&text=Hallo%21+%2Afixs.arts%2A%0ASaya+tertarik+dengan+jasa+Creative+Design&type=phone_number&app_absent=0",
          icon: "whatsapp",
          external: true
        },
        {
          label: "fixs.arts@gmail.com",
          href: "mailto:fixs.arts@gmail.com",
          icon: "email"
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/fixs.arts/",
          icon: "instagram",
          external: true
        }

        // Contoh menambah link lain (hapus tanda // di depan baris untuk mengaktifkan):
        // { label: "TikTok",  href: "https://www.tiktok.com/@namaakun", icon: "tiktok",  external: true },
        // { label: "Website", href: "https://namasitus.com",            icon: "website", external: true }
      ]
    },

    /* ----- Kolom 3: Lokasi (klik membuka Google Maps) ----- */
    {
      title: "@location",
      links: [
        { label: "Banjarmasin, Indonesia", href: "https://maps.app.goo.gl/n2NWofqy2PqZjbtX8", external: true }
      ]
    }
  ],

  /* =================================================================
     [4] BAR BAWAH
     {year} otomatis diganti tahun sekarang.
     Dropdown bahasa tampil di sisi kanan bar ini.
     ================================================================= */
  bottom: {
    copyright: "@copyright",   // teksnya ada di bagian [6]
    note: ""                   // catatan kecil tambahan (boleh kosong)
  },

  /* =================================================================
     [5] BAHASA
     Dropdown bahasa berfungsi: memilih bahasa langsung mengganti semua
     teks footer, dan pilihan diingat di browser pengunjung.
     Urutan di bawah = urutan di dropdown.
     ================================================================= */
  language: {
    show: true,          // false = sembunyikan dropdown bahasa
    default: "id",       // bahasa awal
    remember: true,      // true = ingat pilihan pengunjung
    autoDetect: false,   // true = pilih bahasa sesuai browser (bila belum pernah memilih)
    list: [
      { code: "id", flag: "ID", name: "Indonesia" },
      { code: "en", flag: "US", name: "United States" },
      { code: "ms", flag: "MY", name: "Malaysia" },
      { code: "ja", flag: "JP", name: "Japan" },
      { code: "ko", flag: "KR", name: "Korea" },
      { code: "zh", flag: "CN", name: "China" },
      { code: "es", flag: "ES", name: "Spain" },
      { code: "fr", flag: "FR", name: "France" },
      { code: "de", flag: "DE", name: "Germany" }
    ]
  },

  /* =================================================================
     [6] TEKS TERJEMAHAN
     Satu blok per bahasa. Kuncinya (kiri) sama di semua bahasa, isinya
     (kanan) yang diterjemahkan.
     Mau kata baru? Tambahkan kuncinya di SEMUA blok bahasa, lalu pakai
     di tempat lain dengan awalan @ (contoh: "@kunciBaru").
     Bahasa yang kuncinya belum diisi otomatis memakai bahasa default.
     ================================================================= */
  texts: {

    id: {
      tagline:   "Studio desain kreatif untuk brand yang ingin tampil beda — dari identitas visual sampai materi promosi.",
      explore:   "Jelajahi",
      services:  "Layanan",
      portfolio: "Portofolio",
      about:     "Tentang",
      contact:   "Kontak",
      location:  "Lokasi",
      copyright: "© {year} Fixs.Arts Studio. Seluruh hak cipta dilindungi.",
      language:  "Bahasa"
    },

    en: {
      tagline:   "A creative design studio for brands that want to stand out — from visual identity to promotional materials.",
      explore:   "Explore",
      services:  "Services",
      portfolio: "Portfolio",
      about:     "About",
      contact:   "Contact",
      location:  "Location",
      copyright: "© {year} Fixs.Arts Studio. All rights reserved.",
      language:  "Language"
    },

    ms: {
      tagline:   "Studio reka bentuk kreatif untuk jenama yang ingin tampil berbeza — daripada identiti visual hingga bahan promosi.",
      explore:   "Teroka",
      services:  "Perkhidmatan",
      portfolio: "Portfolio",
      about:     "Tentang",
      contact:   "Hubungi",
      location:  "Lokasi",
      copyright: "© {year} Fixs.Arts Studio. Hak cipta terpelihara.",
      language:  "Bahasa"
    },

    ja: {
      tagline:   "個性を打ち出したいブランドのためのクリエイティブデザインスタジオ。ビジュアルアイデンティティから販促物まで。",
      explore:   "探す",
      services:  "サービス",
      portfolio: "ポートフォリオ",
      about:     "私たちについて",
      contact:   "お問い合わせ",
      location:  "所在地",
      copyright: "© {year} Fixs.Arts Studio. 無断転載を禁じます。",
      language:  "言語"
    },

    ko: {
      tagline:   "차별화된 모습을 원하는 브랜드를 위한 크리에이티브 디자인 스튜디오 — 비주얼 아이덴티티부터 홍보 자료까지.",
      explore:   "둘러보기",
      services:  "서비스",
      portfolio: "포트폴리오",
      about:     "소개",
      contact:   "연락처",
      location:  "위치",
      copyright: "© {year} Fixs.Arts Studio. 모든 권리 보유.",
      language:  "언어"
    },

    zh: {
      tagline:   "为想要脱颖而出的品牌打造的创意设计工作室——从视觉形象到宣传物料。",
      explore:   "探索",
      services:  "服务",
      portfolio: "作品集",
      about:     "关于我们",
      contact:   "联系方式",
      location:  "地址",
      copyright: "© {year} Fixs.Arts Studio. 版权所有。",
      language:  "语言"
    },

    es: {
      tagline:   "Estudio de diseño creativo para marcas que quieren destacar: desde la identidad visual hasta el material promocional.",
      explore:   "Explorar",
      services:  "Servicios",
      portfolio: "Portafolio",
      about:     "Acerca de",
      contact:   "Contacto",
      location:  "Ubicación",
      copyright: "© {year} Fixs.Arts Studio. Todos los derechos reservados.",
      language:  "Idioma"
    },

    fr: {
      tagline:   "Studio de design créatif pour les marques qui veulent se démarquer : de l'identité visuelle aux supports promotionnels.",
      explore:   "Découvrir",
      services:  "Services",
      portfolio: "Portfolio",
      about:     "À propos",
      contact:   "Contact",
      location:  "Localisation",
      copyright: "© {year} Fixs.Arts Studio. Tous droits réservés.",
      language:  "Langue"
    },

    de: {
      tagline:   "Kreatives Designstudio für Marken, die auffallen wollen – von der visuellen Identität bis zu Werbematerialien.",
      explore:   "Entdecken",
      services:  "Leistungen",
      portfolio: "Portfolio",
      about:     "Über uns",
      contact:   "Kontakt",
      location:  "Standort",
      copyright: "© {year} Fixs.Arts Studio. Alle Rechte vorbehalten.",
      language:  "Sprache"
    }
  },

  /* =================================================================
     [7] LAYOUT  (mode WEB & HP)
     ================================================================= */
  layout: {
    maxWidth: "1240px",     // lebar konten maksimum di desktop
    brandWeight: "1.4fr",   // lebar kolom brand vs kolom link di desktop (mis. "1fr", "2fr")
    iconSize: "20px",       // ukuran ikon di kolom Kontak
    mobileColumns: 1,       // HP: 1 = ditumpuk, 2 = kolom link berdampingan
    mobileAlign: "left",    // HP: "left" | "center"
    showBrand: true,        // false = sembunyikan kolom brand
    showBottomBar: true     // false = sembunyikan bar bawah (copyright + bahasa)
  },

  /* =================================================================
     [8] TEMA
     mode: "dark" (latar hitam) | "light" (latar putih).
     Warna lain opsional: kosongkan ("") untuk memakai warna bawaan.
     Isi "background" bila ingin warna latar sendiri — ikon & logo
     otomatis menyesuaikan terang/gelapnya warna itu.
     ================================================================= */
  theme: {
    mode: "dark",
    background: "",         // mis. "#0A0A0D"
    text: "",
    muted: "",
    faint: "",
    border: "",
    accent: ""              // mis. "#6C7BFF"
  }
};

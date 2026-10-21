/**
 * FOOTER TEMPLATE — footer-config.js
 * =====================================================================
 * INI SATU-SATUNYA FILE YANG PERLU KAMU EDIT saat memakai template ini
 * di website lain. Semua isi & pengaturan tampilan footer ada di sini.
 *
 * Cara pakai:
 *   1. Ubah isi window.FooterConfig di bawah.
 *   2. Pastikan di halaman ada:   <footer data-site-footer></footer>
 *   3. Muat urutan ini sebelum </body>:
 *        <script src="js/footer-config.js"></script>
 *        <script src="js/footer.js"></script>
 * =====================================================================
 */
window.FooterConfig = {

  /* ---------- BRAND (kolom paling kiri) ---------- */
  brand: {
    // Path/URL gambar logo (PNG transparan disarankan).
    // Kosongkan ("") untuk memakai tulisan (textMain + textAccent).
    // Kalau file logo tidak ditemukan, footer otomatis kembali ke tulisan.
    logoUrl: "assets/fixs arts (white).png",
    logoHeight: "50px",         // tinggi logo (lebar mengikuti proporsi)
    textMain: "FIXS",           // dipakai bila logoUrl kosong / gambar gagal dimuat
    textAccent: ".ARTS",        // bagian yang diberi warna aksen
    href: "index.html",         // link saat logo diklik
    description: "Studio desain kreatif untuk brand yang ingin tampil beda — dari identitas visual sampai materi promosi."
  },

  /* ---------- KOLOM-KOLOM ----------
     Tambah / hapus / urutkan kolom sesuka hati. Jumlah kolom otomatis
     menyesuaikan layout desktop.

     Setiap kolom punya:  title  +  (links  ATAU  lines)
       links : daftar link   -> { label, href, icon?, external? }
       lines : daftar teks biasa (tanpa link), mis. alamat

     icon boleh berupa EMOJI ("💬") atau PATH/URL GAMBAR ("assets/icons/wa.svg").
  */
  columns: [
    {
      title: "Jelajahi",
      links: [
        { label: "Layanan",   href: "services.html" },
        { label: "Portfolio", href: "portfolio.html" },
        { label: "Tentang",   href: "about.html" }
      ]
    },
    {
      title: "Kontak",
      links: [
        { label: "WhatsApp",  href: "https://wa.me/6281234567890",       icon: "💬", external: true },
        { label: "fixs.arts@gmail.com", href: "mailto:fixs.arts@gmail.com", icon: "✉️" },
        { label: "Instagram", href: "https://instagram.com/fixs.arts", icon: "📷", external: true }
      ]
    },
    {
      title: "Lokasi",
      lines: ["Banjarmasin, Indonesia"]
    }
  ],

  /* ---------- BAR BAWAH ----------
     {year} otomatis diganti tahun sekarang. */
  bottom: {
    copyright: "© {year} Fixs.Arts Studio. Seluruh hak cipta dilindungi.",
    note: "Dibuat dengan HTML, CSS & JavaScript Murni."   // kosongkan "" untuk menyembunyikan
  },

  /* ---------- LAYOUT (mode WEB & HP) ---------- */
  layout: {
    maxWidth: "1240px",        // lebar konten maksimum di desktop
    brandWeight: "1.4fr",      // lebar kolom brand vs kolom link di desktop (mis. "1fr", "2fr")
    mobileColumns: 1,          // HP: 1 = ditumpuk, 2 = kolom link berdampingan
    mobileAlign: "left",       // HP: "left" | "center"
    showBrand: true,           // false = sembunyikan kolom brand
    showBottomBar: true        // false = sembunyikan bar copyright
  },

  /* ---------- TEMA ----------
     mode: "dark" | "light". Sisanya opsional: isi untuk menimpa warna bawaan,
     kosongkan ("") untuk memakai default dari footer.css. */
  theme: {
    mode: "dark",
    background: "",            // mis. "#0A0A0D"
    text: "",
    muted: "",
    faint: "",
    border: "",
    accent: ""                 // mis. "#6C7BFF"
  }
};

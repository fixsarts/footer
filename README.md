# Footer Template

Rangka footer (layout diambil dari Fixs.Arts Studio) yang **berdiri sendiri** dan siap dipakai ulang di website lain.
HTML + CSS + Vanilla JavaScript murni, tanpa framework, tanpa dependensi, tanpa backend.

## Isi folder

```
footer-template/
├── index.html            Halaman demo (buka di browser untuk lihat hasilnya)
├── preview.html          Preview Web / Tablet / HP + panel setting langsung
├── footer-static.html    Versi HTML polos (tanpa JavaScript)
├── assets/
│   └── logo.png          Logo (PNG transparan) — ganti dengan logo kamu
├── css/
│   └── footer.css        Seluruh gaya + responsive footer (file ini yang dibawa)
└── js/
    ├── footer-config.js  ⭐ SETTING footer — satu-satunya file yang kamu edit
    └── footer.js         Renderer (biasanya tidak perlu diubah)
```

Untuk dipakai di website lain, cukup bawa: **`css/footer.css`**, **`js/footer-config.js`**, **`js/footer.js`**, dan logo kamu di **`assets/logo.png`**.

---
## Cara Simple

**1. tambahkan file ini setelah `<head>`:

```
<head>

  <link rel="stylesheet"
    href="https://fixsarts.github.io/footer/css/footer.css">
  <style>
  footer[data-site-footer] {
    --ft-bg: #0A0A0D;
  }
</style>

```

**2. pasang di setelah `</script>` _dibagian sini_ `</body>` :

```
<!-- Footer -->
<footer data-site-footer></footer>

<script src="https://fixsarts.github.io/footer/js/footer-config.js"></script>
<script src="https://fixsarts.github.io/footer/js/footer.js"></script>

</body>
```

---

## Cara pakai di website baru (3 langkah)

**1. Muat CSS** di `<head>`:

```html
<link rel="stylesheet" href="css/footer.css">
```

**2. Taruh titik pemasangan** di tempat footer ingin muncul:

```html
<footer data-site-footer></footer>
```

**3. Muat script** sebelum `</body>` (urutan harus begini):

```html
<script src="js/footer-config.js"></script>
<script src="js/footer.js"></script>
```

Lalu edit isi footer di **`js/footer-config.js`**. Selesai.

> Tidak mau JavaScript? Pakai `footer-static.html` — salin blok `<footer>`-nya ke halaman mana pun dan edit teksnya langsung. Hasil tampilannya identik.

---

## Mengganti logo

Footer memakai **logo gambar** (bukan tulisan). Caranya:

1. Taruh file logo kamu di `assets/logo.png` (timpa file yang ada — **PNG dengan background transparan** paling bagus).
2. Selesai. Tidak ada kode yang perlu diubah.

Kalau logo ada di lokasi / nama lain, ubah di `footer-config.js`:

```js
brand: {
  logoUrl: "assets/logo-saya.png",   // path atau URL gambar
  logoHeight: "56px",                // tinggi logo, lebar mengikuti proporsi
  textMain: "FIXS", textAccent: ".ARTS"   // dipakai bila logo kosong / gagal dimuat
}
```

- Kosongkan `logoUrl: ""` kalau mau memakai **tulisan** saja.
- Kalau file logo **tidak ditemukan**, footer otomatis kembali ke tulisan (tidak muncul gambar rusak).
- Logo bertumpuk / persegi (seperti Fixs.Arts) cocok di `56px`–`72px`. Logo memanjang (wordmark) cukup `32px`–`40px`.
- Logo putih hanya terlihat di tema gelap. Untuk tema terang (`mode: "light"`), pakai versi logo yang gelap.

---

## Mengatur isi footer — `footer-config.js`

| Bagian | Fungsi |
|---|---|
| `brand` | Logo gambar (`logoUrl`) **atau** tulisan (`textMain` + `textAccent`), link logo, dan deskripsi singkat |
| `columns` | Daftar kolom. Tambah / hapus / urutkan bebas — layout desktop menyesuaikan jumlah kolom otomatis |
| `bottom` | Teks copyright & catatan kecil. `{year}` otomatis jadi tahun sekarang |
| `layout` | Pengaturan tampilan Web & HP (lihat bawah) |
| `theme` | Mode `dark` / `light` + warna opsional |

Setiap kolom memakai **`links`** (daftar link) atau **`lines`** (teks biasa tanpa link, mis. alamat):

```js
{ title: "Kontak", links: [
    { label: "WhatsApp", href: "https://wa.me/62812xxxx", icon: "💬", external: true }
]},
{ title: "Lokasi", lines: ["Jakarta, Indonesia"] }
```

`icon` boleh **emoji** (`"💬"`) atau **path gambar** (`"assets/icons/wa.svg"`). `external: true` membuka link di tab baru.

---

## Pengaturan tampilan Web & HP

Footer memakai tiga breakpoint (mobile-first):

| Perangkat | Lebar | Tampilan |
|---|---|---|
| **HP** | < 640px | Semua ditumpuk ke bawah (atau 2 kolom link, lihat opsi) |
| **Tablet** | ≥ 640px | Brand memanjang penuh di atas, kolom link dibagi 2 per baris |
| **Web** | ≥ 960px | Satu baris: kolom brand (lebih lebar) + semua kolom link sejajar |

Opsi di bagian `layout`:

| Opsi | Nilai | Keterangan |
|---|---|---|
| `maxWidth` | `"1240px"` | Lebar konten maksimum di layar besar |
| `brandWeight` | `"1.4fr"` | Lebar kolom brand dibanding kolom link (Web). Coba `"1fr"` atau `"2fr"` |
| `mobileColumns` | `1` / `2` | HP: ditumpuk 1 kolom atau 2 kolom link berdampingan |
| `mobileAlign` | `"left"` / `"center"` | HP: rata kiri atau tengah |
| `showBrand` | `true` / `false` | Sembunyikan / tampilkan kolom brand |
| `showBottomBar` | `true` / `false` | Sembunyikan / tampilkan bar copyright |

### Coba tanpa menebak — `preview.html`

Buka `preview.html` di browser. Di situ kamu bisa:
- pindah mode **Web / Tablet / HP** (ukuran viewport akurat, jadi breakpoint-nya benar-benar jalan),
- ganti tema, jumlah kolom HP, rata teks, lebar brand, tampil/sembunyikan bagian,
- klik **Salin pengaturan**, lalu tempel ke bagian `layout` / `theme` di `footer-config.js`.

---

## Mengubah warna & ukuran lewat CSS

Semua variabel berawalan `--ft-` supaya tidak bentrok dengan CSS website lain. Timpa di CSS halamanmu:

```css
.site-footer{
  --ft-bg:#0A0A0D;
  --ft-text:#F4F4F6;
  --ft-muted:#9B9BA5;
  --ft-faint:#5E5E68;
  --ft-border:#1D1D24;
  --ft-accent:#6C7BFF;

  --ft-font-body:'Inter', sans-serif;
  --ft-font-display:'Plus Jakarta Sans', sans-serif;

  --ft-max:1240px;
  --ft-pad-top:70px;
  --ft-gap:40px;
}
```

Footer otomatis mewarisi `font-family` halaman. Isi `--ft-font-body` / `--ft-font-display` bila ingin font khusus.

## Atribut `data-*` (alternatif dari config)

Dipakai pada versi statis, atau kalau ingin mengatur lewat HTML langsung:

```html
<footer class="site-footer"
        data-footer-theme="dark"        <!-- dark | light -->
        data-mobile-columns="1"         <!-- 1 | 2 -->
        data-mobile-align="left"        <!-- left | center -->
        data-hide-brand="false"
        data-hide-bottom="false"
        style="--ft-cols:3;">           <!-- jumlah kolom link di desktop -->
```

---

## API JavaScript (untuk upgrade lanjutan)

```js
Footer.render("[data-site-footer]", config)  // render manual dengan config sendiri
Footer.update({ layout: { mobileColumns: 2 } })  // ubah sebagian setting, render ulang
Footer.getConfig()                           // lihat config aktif (sudah digabung default)
```

### Menyambungkan ke data dinamis (contoh: panel admin / localStorage)

Karena `footer.js` hanya butuh sebuah objek config, sumber datanya bebas. Contoh memakai pengaturan situs yang sudah ada:

```js
const s = StorageManager.loadSettings();   // contoh: sistem admin Fixs.Arts

Footer.render("[data-site-footer]", {
  brand:  { logoUrl: s.logoUrl, description: s.footerDescription },
  columns: [
    { title: "Kontak", links: [
      { label: "WhatsApp", href: `https://wa.me/${s.whatsappNumber}`, icon: s.icons.whatsapp, external: true },
      { label: s.email,    href: `mailto:${s.email}`,                 icon: s.icons.email }
    ]},
    { title: "Lokasi", lines: [s.location] }
  ],
  bottom: { copyright: s.copyrightText }
});
```

---

## Keamanan

- Semua teks dari config di-escape sebelum masuk ke HTML (tidak bisa menyisipkan tag/script).
- Link dengan protokol berbahaya (mis. `javascript:`) otomatis diganti `#`. Hanya `http(s)`, `mailto`, `tel`, `#`, dan path relatif yang diizinkan.
- Link eksternal memakai `rel="noopener noreferrer"`.

## Aksesibilitas

Kolom link memakai `<nav aria-label="…">`, ikon dekoratif disembunyikan dari screen reader (`aria-hidden`), dan ada indikator fokus keyboard yang jelas.

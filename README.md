# Footer Template (Fixs.Arts)

Footer yang **berdiri sendiri**: dipasang di website mana pun tanpa menambah CSS apa pun.
Font Inter, warna, ikon, dan dropdown bahasa semuanya sudah ikut di dalam footer.

## Pasang di website (2 langkah)

Taruh di tempat footer ingin muncul:

```html
<footer data-site-footer></footer>

<script src="https://fixsarts.github.io/footer/js/footer-config.js"></script>
<script src="https://fixsarts.github.io/footer/js/footer.js"></script>
```

Selesai. **Tidak perlu** `<link>` CSS, tidak perlu mengatur font, tidak perlu mengatur warna ikon.
`footer.js` memuat `css/footer.css` dan font Inter sendiri, serta mencari logo & ikon dari folder footer.

> Kalau halamanmu sudah punya `<link ... footer.css>` dari versi lama, boleh dihapus. Kalau dibiarkan pun tidak masalah.

## Isi folder

```
footer/
├── index.html            Halaman demo
├── preview.html          Preview Web / Tablet / HP + panel setting
├── footer-static.html    Versi HTML polos (tanpa JavaScript)
├── assets/
│   ├── Icon/             Ikon PNG (warna apa saja, diubah otomatis)
│   ├── Fixs Arts (White).png   Logo untuk latar gelap
│   └── Fixs Arts.png           Logo untuk latar terang
├── css/footer.css        Gaya + responsive + font (dimuat otomatis)
└── js/
    ├── footer-config.js  ⭐ SATU-SATUNYA FILE YANG KAMU EDIT
    └── footer.js         Mesin footer (tidak perlu diubah)
```

## Mengedit isi footer — `js/footer-config.js`

File ini dibagi jadi 8 bagian bernomor (cari dengan Ctrl+F):

| Bagian | Isinya |
|---|---|
| `[1] BRAND` | Logo, tinggi logo, deskripsi |
| `[2] IKON` | Daftar ikon + pengaturan warna ikon |
| `[3] KOLOM MENU` | Jelajahi, Kontak, Lokasi — tambah/hapus bebas |
| `[4] BAR BAWAH` | Teks copyright |
| `[5] BAHASA` | Daftar bahasa di dropdown |
| `[6] TEKS TERJEMAHAN` | Semua kata yang tampil, satu blok per bahasa |
| `[7] LAYOUT` | Ukuran dan tampilan Web / HP |
| `[8] TEMA` | Gelap / terang, warna |

### Aturan menulis teks

- `"Teks biasa"` → tampil apa adanya di semua bahasa (contoh: `"WhatsApp"`, alamat email).
- `"@kunci"` → diambil dari bagian `[6]`, sehingga ikut berganti bahasa (contoh: `"@services"`).

### Mengubah / menambah link

Edit di bagian `[3]`. Contoh menambah TikTok di kolom Kontak:

```js
{ label: "TikTok", href: "https://www.tiktok.com/@namaakun", icon: "tiktok", external: true }
```

`external: true` membuka link di tab baru. Ikon `tiktok` dan `website` sudah terdaftar di bagian `[2]`.

## Ikon: warna otomatis

File ikon di `assets/Icon/` adalah PNG berwarna. Footer mengubah warnanya sendiri mengikuti latar:

| Latar footer | Ikon |
|---|---|
| Gelap (`mode: "dark"`) | Putih |
| Terang (`mode: "light"`) | Hitam |
| Warna sendiri (`theme.background`) | Menyesuaikan terang/gelapnya warna itu |

Mau selalu satu warna, atau pakai warna asli PNG? Ubah `iconColor` di bagian `[2]`:
`"auto"` (bawaan) · `"white"` · `"black"` · `"original"`.

**Menambah ikon baru:** taruh PNG-nya di `assets/Icon/` (latar transparan), tambah satu baris di `icons: {...}`,
lalu pakai namanya di `icon:` pada link. Logo juga ikut otomatis: `logoUrl` dipakai di latar gelap, `logoUrlLight` di latar terang.

## Bahasa

Dropdown bahasa ada di bar bawah (sisi kanan) dan **berfungsi**: memilih bahasa langsung mengganti semua teks footer.
Pilihan diingat di browser pengunjung.

Bahasa yang tersedia: ID Indonesia · US United States · MY Malaysia · JP Japan · KR Korea · CN China · ES Spain · FR France · DE Germany.

**Mengubah terjemahan:** edit bagian `[6]`, cari blok bahasanya, ubah teks di sebelah kanan.

**Menambah bahasa baru:**
1. Di bagian `[5]`, tambah satu baris: `{ code: "pt", flag: "BR", name: "Brazil" }`
2. Di bagian `[6]`, salin satu blok bahasa (mis. blok `en`), ganti namanya jadi `pt`, lalu terjemahkan isinya.

**Menambah kata baru yang bisa diterjemahkan:** tambahkan kuncinya di *semua* blok bahasa di `[6]`
(mis. `faq: "FAQ"`), lalu pakai `"@faq"` di kolom menu. Kunci yang belum diisi di suatu bahasa otomatis memakai bahasa default.

Opsi lain di bagian `[5]`: `show` (sembunyikan dropdown), `default` (bahasa awal), `remember`, `autoDetect` (ikuti bahasa browser).

Website yang memasang footer bisa ikut berganti bahasa lewat event:

```js
window.addEventListener("footer:languagechange", function (e) { console.log(e.detail.lang); });
```

## Tampilan Web & HP

| Perangkat | Lebar | Tampilan |
|---|---|---|
| HP | < 640px | Ditumpuk ke bawah (atau 2 kolom link) |
| Tablet | ≥ 640px | Brand memanjang di atas, kolom link 2 per baris |
| Web | ≥ 960px | Satu baris: brand + semua kolom link |

Pengaturan ada di bagian `[7] LAYOUT`. Buka `preview.html` untuk mencoba Web / Tablet / HP sekaligus.

## Mengubah font atau warna lewat CSS (opsional)

Semua variabel berawalan `--ft-`. Timpa di CSS halamanmu hanya jika memang perlu:

```css
.site-footer{
  --ft-font-body:'Poppins', sans-serif;
  --ft-bg:#0A0A0D;
  --ft-accent:#6C7BFF;
}
```

## Tanpa JavaScript

Pakai `footer-static.html`: salin blok `<footer>`-nya ke halaman lalu edit teks langsung.
Dropdown bahasa dan warna ikon otomatis hanya ada di versi JavaScript; di versi statis atur warna ikon lewat `data-icon-tone`.

## API JavaScript (opsional)

```js
Footer.render("[data-site-footer]", config)   // render manual
Footer.update({ layout: { mobileColumns: 2 } }) // ubah sebagian setting
Footer.getConfig()                             // config aktif
Footer.setLanguage("en")                       // ganti bahasa lewat kode
Footer.getLanguage()                           // bahasa aktif
```

## Keamanan & aksesibilitas

- Semua teks dari config di-escape sebelum masuk ke HTML.
- Link berprotokol berbahaya (mis. `javascript:`) otomatis diganti `#`; hanya `http(s)`, `mailto`, `tel`, `#`, dan path relatif yang diizinkan.
- Link eksternal memakai `rel="noopener noreferrer"`.
- Kolom link memakai `<nav aria-label>`, ikon dekoratif disembunyikan dari screen reader, dropdown bahasa punya label, dan fokus keyboard terlihat jelas.

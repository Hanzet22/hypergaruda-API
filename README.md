# 🌟 BintangAPI Dashboard

<p align="center">
  <strong>Web Interface resmi untuk melakukan testing, eksplorasi, dan eksekusi API langsung dari browser.</strong>
</p>

<p align="center">
  Dibuat dengan ❤️ oleh <b>HyperGaruda</b> — <i>Gabut Universe Edition 🐱‍👤</i>
</p>

<p align="center">
  <img src="https://shields.io" alt="Status Active">
  <img src="https://shields.io" alt="Endpoints 74">
  <img src="https://shields.io" alt="License MIT">
  <img src="https://shields.io" alt="Made With">
</p>

---

### 📚 Daftar Isi
- [📌 Tentang Project](#-tentang-project)
- [👥 Kontributor](#-kontributor)
- [📂 Struktur Project](#-struktur-project)
- [📊 Statistik Endpoint](#-statistik-endpoint)
- [🚀 Cara Menggunakan](#-cara-menggunakan)
- [✨ Fitur Utama](#-fitur-utama)
- [📸 Preview](#-preview)
- [🙏 Kredit & Apresiasi](#-kredit--apresiasi)
- [📄 Lisensi](#-lisensi)
- [📞 Kontak](#-kontak)
- [🧭 Phase 02 Blueprint](docs/PHASE-02-BLUEPRINT.md)

---

### 📌 Tentang Project
**BintangAPI Dashboard** merupakan platform web interaktif yang dirancang khusus untuk mempermudah akses ke seluruh endpoint gratis dari BintangAPI tanpa perlu melakukan *coding* manual atau konfigurasi di Postman.

**Dashboard ini sangat ideal untuk:**
* 🧪 **Testing Endpoint:** Melakukan uji coba parameter input secara langsung.
* 🔍 **Eksplorasi API:** Mengetahui respon data dari setiap fitur.
* 💻 **Bahan Pembelajaran:** Referensi integrasi REST API berbasis web bagi pemula.
* ⚡ **Eksekusi Cepat:** Mendapatkan output *real-time* langsung via browser.

> [!NOTE]
> Seluruh request diproses secara langsung menggunakan endpoint resmi dari server utama BintangAPI.

---

### 👥 Kontributor

| Peran | Nama / Instansi |
| :--- | :--- |
| 🖥️ **Web Development & UI/UX** | [HyperGaruda](https://github.com/Hanzet22) (`hanzet22`) |
| ⚙️ **API Development & Documentation** | [BintangAPI X](https://github.com/Bintang-X) (`Bintang-X`) |
| 🧠 **Ide & Konsep Dasar** | Gabut Universe Community |

---

### 📂 Struktur Project
Dashboard ini dibangun secara modular menggunakan skema penamaan file statis yang bersih:

```text
hanzet22.github.io/
└── hypergaruda-API
    ├── index.html          # Halaman Utama / Portal Dashboard
    ├── ai.html             # Endpoint Modul AI Chat
    ├── ai-image.html       # Endpoint Modul AI Image
    ├── ai-tools.html       # Endpoint Modul AI Tools
    ├── baca.html           # Endpoint Modul WattPad Reader
    ├── downloader.html     # Endpoint Modul Social Media Downloader
    ├── berita.html         # Endpoint Modul Berita Nasional
    ├── brat-maker.html     # Endpoint Modul Pembuat Teks Brat
    ├── nonton.html         # Endpoint Modul Portal Film/Streaming
    ├── scriptblox.html     # Endpoint Modul ScriptBlox Searcher
    ├── search.html         # Endpoint Modul Search Engine Integrator
    ├── stalker.html        # Endpoint Modul Media Social Stalker
    ├── tools.html          # Endpoint Modul Utilitas Umum
    ├── uploader.html       # Endpoint Modul Uploader Media
    └── README.md           # Dokumentasi Project
```

---

### 📊 Statistik Endpoint

| Kategori Modul | Jumlah Endpoint |
| :--- | :---: |
| 🧠 AI Chat | 9 |
| 🖼️ AI Image | 3 |
| 🔧 AI Tools | 5 |
| 📖 Baca WattPad | 4 |
| ⬇️ Downloader | 3 |
| 📰 Berita | 8 |
| 🎨 Brat Maker | 2 |
| 🎬 Nonton | 9 |
| 📜 ScriptBlox | 3 |
| 🔍 Search | 8 |
| 🕵️ Stalker | 16 |
| 🛠️ Tools | 3 |
| 📤 Uploader | 1 |
| 📈 **TOTAL ENDPOINT READY** | **74** |

---

### 🚀 Cara Menggunakan

1. **Akses Dashboard**  
   Buka interface web melalui link resmi: [HyperGaruda GitHub Pages](https://hanzet22.github.io/hypergaruda-API/)
2. **Pilih Kategori**  
   Navigasikan ke menu halaman modul sesuai kebutuhan lu pada daftar di atas.
3. **Isi Parameter**  
   Lengkapi form parameter yang diminta pada halaman terkait, seperti contoh berikut:
   * `prompt` (untuk AI text generation)
   * `username` / `url` / `query` (untuk pencarian & downloader)
4. **Eksekusi Request**  
   Tekan tombol **Fetch**.
5. **Analisis Output**  
   Respons server API akan langsung dimuat secara instan di layar dalam format **JSON Pretty Viewer** sehingga sangat mudah dibaca.

---

### 🧱 Phase 03 Foundation

Fondasi migrasi mulai disiapkan tanpa menghapus dashboard HTML lama. Struktur aplikasi baru dipisahkan berdasarkan tanggung jawab:

- `apps/web`: Next.js untuk aplikasi interaktif utama.
- `apps/docs`: Astro untuk dokumentasi dan konten.
- `apps/ui-lab`: Vite untuk eksperimen komponen terisolasi.
- `packages/contracts`: kontrak TypeScript lintas aplikasi.
- `packages/config`: validasi konfigurasi runtime yang bebas dari akses rahasia di browser.
- `services/native`: fondasi Rust yang belum diekspos sebagai service produksi.

Baseline toolchain: Node.js 22.23.4. Tailwind CSS digunakan per aplikasi; CSS Houdini hanya enhancement progresif dengan fallback CSS biasa.

Dokumentasi: [Phase 03 Foundation](docs/PHASE-03-FOUNDATION.md).

> [!IMPORTANT]
> Ini adalah fondasi monorepo, bukan klaim bahwa seluruh aplikasi Next.js, Astro, Vite, atau gateway sudah siap produksi. Halaman HTML lama tetap dipertahankan selama migrasi bertahap.

---

### 🧭 Phase 02 Blueprint

Dokumentasi rekonsiliasi inventaris dashboard, rancangan arsitektur, keamanan, privasi, deployment, dan roadmap tersedia di [docs/PHASE-02-BLUEPRINT.md](docs/PHASE-02-BLUEPRINT.md). Angka 74 merujuk pada kartu yang tercantum, bukan jaminan seluruh endpoint aktif.

---

### ✨ Fitur Utama
* 🚀 **74 Dashboard Cards:** Jumlah kartu endpoint yang tercantum di HTML; status layanan upstream belum diverifikasi.
* 📱 **Mobile Friendly & Responsive:** UI tetap presisi dibuka dari HP, tablet, maupun desktop.
* 🪄 **Automated Form Fields:** Input form otomatis menyesuaikan kebutuhan dari *endpoint* yang dipilih.
* 📦 **JSON Pretty Viewer:** Output data rapi dengan indentasi kode yang jelas.
* 📤 **Uguu Image Hosting Integration:** Memungkinkan unggah file langsung dari modul uploader.

---

### 📸 Preview
> [!TIP]
> Tempelkan screenshot beresolusi tinggi dari tampilan halaman utama dashboard lu di bawah ini agar repositori terlihat jauh lebih berkelas bagi pengunjung.

```text
💾 docs/images/dashboard.png
```

---

### 🙏 Kredit & Apresiasi

| Komponen Sistem | Kreator Utama |
| :--- | :--- |
| **Penyedia API & Dokumentasi Inti** | **BintangAPI (Bintang-X)** |
| **Arsitektur & Desain Dashboard Web** | **HyperGaruda (hanzet22)** |
| **Fasilitator Pengujian & Support** | **Gabut Universe Community** |

Apresiasi setinggi-tingginya kepada **Bintang-X** yang sudah bersedia membagikan API ini secara cuma-cuma demi mendukung ekosistem belajar developer lokal.

---

### 📄 Lisensi
Di bawah naungan **Lisensi MIT**. Lu bebas penuh untuk:
* 🔄 Menggunakan kembali kode program.
* 🛠️ Memodifikasi struktur komponen.
* 📚 Mempelajari alur logikanya.
* 🤝 Menyebarluaskan proyek ini secara massal.

> "Yang penting tetap lestarikan budaya gabut." ☕ — *Filosofi Gabut Universe*

---

### 📞 Kontak & Tautan

* 🌐 **Website Resmi BintangAPI:** [bintangapi.my.id](https://bintangapi.my.id)
* 💻 **GitHub HyperGaruda:** [@hanzet22](https://github.com/Hanzet22)
* 💻 **GitHub BintangAPI:** [@Bintang-X](https://github.com/Bintang-X)

---
<div align="center">

### 🐱‍👤 Gabut Universe
**AWOKAWOKAWOK 🔥**  
*"Gabut itu bukan dosa, tapi seni."*

⭐ *Kalau lu suka atau ngerasa kebantu sama project dashboard ini, jangan lupa tinggalin jejak dengan pencet tombol **Star** di pojok kanan atas repositori ini!*
</div>

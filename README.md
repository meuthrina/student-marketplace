# Student Marketplace — Active Student Talent

Proyek terintegrasi semester 5 Universitas Pertamina:

1. **Pengembangan Aplikasi Web (52355)**
2. **Kriptografi (52357)**
3. **Keamanan Komputasi dan Siber (52353)**

## 🎓 Identitas Akademis

- **Nama:** Iman Dwi Satrio
- **NIM:** 105224029
- **Program Studi:** Ilmu Komputer, Universitas Pertamina

## 📂 Struktur Folder Proyek

- `/app` : Application Router, UI Components, Server Actions & Dynamic Pages (MK Web)
- `/prisma` : Skema ORM 7 (`schema.prisma`), migrasi DDL SQL (`migrations/`), dan skrip seed (`seed.ts`)
- `/lib` : Modul Prisma singleton (`prisma.ts`), sesi JWT HS256 (`session.ts`), skema Zod (`skema.ts`)
- `/lib/crypto` : Modul & fungsi Kriptografi (MK Kriptografi)
- `/security` : Threat Model STRIDE, DFD, Risk Register, & Audit Log (MK Cybersecurity)

## 🏷️ Version Tags

- `v0.1` : Tugas 1 Web Programming (UI & Mock Data)
- `crypto-v0.1` : Tugas 1 Kriptografi (Komponen Dasar Hashing)
- `sec-0.1` : Tugas 1 Cybersecurity (Threat Modeling STRIDE)
- `v0.2` : Tugas 2 Web Programming (Server Actions, PostgreSQL & Prisma ORM 7 CRUD)
- `crypto-v0.2` : Tugas 2 Kriptografi (Enkripsi Terautentikasi AES-256-GCM, HKDF RFC 5869, Proposal Vault, Key Management 0o600, Strict Allowlist, Fail-Closed)

---

# Studance — Milestone v0.2: Logika Server, PostgreSQL & Prisma ORM 7

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.1-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Prisma ORM 7](https://img.shields.io/badge/Prisma_ORM-v7.10.1-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![PostgreSQL 17](https://img.shields.io/badge/PostgreSQL-17_Alpine-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Zod Validation](https://img.shields.io/badge/Zod-v4-3E67B1?style=flat-square&logo=zod)](https://zod.dev)

Platform Studance pada Milestone **v0.2** telah bertransformasi penuh dari antarmuka statis dengan _mock data_ (v0.1) menjadi aplikasi web dinamis dengan persistensi data relasional di basis data PostgreSQL 17 menggunakan Prisma ORM 7, arsitektur Next.js 16 App Router Server Actions, validasi server deklaratif Zod, dan manajemen sesi kriptografis berbasis signed cookie JWT HS256.

---

## 🔄 Perkembangan Versi (Changelog v0.1 ➔ v0.2)

1. **Migrasi Arsitektur Data Persisten:**
   - Menggantikan array _in-memory_ statis (`lib/mockData.ts`) dengan basis data relasional PostgreSQL 17 yang berjalan di dalam kontainer Docker terisolasi.
   - Mengadopsi **Prisma ORM 7** dengan driver adapter berkinerja tinggi `@prisma/adapter-pg` dan koneksi pooling bawaan pustaka `pg`.
   - Mengonfigurasi Prisma Client singleton dengan proteksi `import "server-only"` di [`lib/prisma.ts`](lib/prisma.ts) guna mencegah kebocoran koneksi dan menjaga keamanan kredensial basis data.

2. **Implementasi Operasi CRUD Lengkap pada Dua Entitas Berelasi:**
   - Memodelkan relasi 1:N antara entitas **`Project`** dan **`Bid`** dengan batasan integritas referensial ketat `onDelete: Restrict`.
   - Menghubungkan seluruh formulir antarmuka langsung ke **Server Actions** Next.js 16 tanpa melalui endpoint REST manual.
   - Mengimplementasikan **Transaksi Atomik (`prisma.$transaction`)** pada mutasi penawaran guna menjamin sinkronisasi kenaikan/penurunan counter `bidsCount` secara konsisten (ACID).

3. **Penegakan Validasi Sisi Server (Server-Side Validation):**
   - Menggunakan skema Zod terpusat di [`lib/skema.ts`](lib/skema.ts) sebagai _Single Source of Truth_ (SSOT) untuk validasi dua sisi (Client & Server).
   - Menangani pencegahan masukan ilegal (bypassing DevTools, angka negatif, teks kosong) dan aturan semantik lanjutan via `.superRefine()`.
   - Mengembalikan galat per-kolom terstruktur (`formatZodErrors`) yang langsung dihubungkan ke atribut aksesibilitas WAI-ARIA (`aria-invalid`, `aria-describedby`, `<p role="alert">`).

4. **Pengelolaan Sesi Kriptografis (Stateless Signed Cookie):**
   - Mengimplementasikan token JWT dengan algoritma tanda tangan digital **HMAC-SHA256 (HS256)** via pustaka industri `jose` di [`lib/session.ts`](lib/session.ts).
   - Pengerasan cookie sesi dengan atribut `httpOnly: true`, `secure: production`, `sameSite: "lax"`, dan umur kedaluwarsa 8 jam (28.800 detik).

---

## 🚀 Panduan Menjalankan Aplikasi Secara Eksplisit (Prisma 7 & Docker)

Ikuti langkah-langkah reproduktif berikut untuk menguji dan menjalankan produk dari _clean state_:

```bash
# 1. Pasang seluruh dependensi proyek (Next.js, Prisma ORM 7, dsb.)
npm install

# 2. Siapkan variabel lingkungan dari template resmi
cp .env.example .env
# Catatan: Pastikan DATABASE_URL mengarah ke "postgresql://studance_user:studance_secure_password@localhost:5433/studance_db?schema=public"
# dan SESSION_SECRET terisi kunci rahasia minimal 32 karakter.

# 3. Jalankan kontainer PostgreSQL via Docker Compose lokal
docker compose up -d db

# 4. Terapkan berkas migrasi SQL ke basis data PostgreSQL
npx prisma migrate dev

# 5. Sinkronkan dan hasilkan tipe Prisma Client terbaru secara eksplisit (Prisma 7)
npx prisma generate

# 6. Jalankan skrip seeding data awal sintetis realistis (6 Proyek + 6 Bid)
npx prisma db seed

# 7. Jalankan server pengembangan Next.js
npm run dev
```

Aplikasi siap diakses pada peramban web di `http://localhost:3000`.

---

## 📊 Tabel Matriks 10 Skenario Uji (8 CRUD + 2 Relasi)

Pengujian fungsional dan integritas data dievaluasi berdasarkan spesifikasi Rubrik R2 Tugas 2 PAW dengan target kelulusan $\ge 90\%$. Seluruh 10 skenario pengujian berhasil lulus (**Tingkat Kelulusan 10/10 = 100%**).

|   No   | Entitas     |  Operasi   | Masukan / Skenario Uji                                                                                                                                     | Hasil yang Diharapkan                                                                                                                                   | Hasil Aktual                                                                                                                                                                                           |  Status   |
| :----: | :---------- | :--------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: |
| **1**  | **Project** | **Create** | Mengisi formulir `/client/projects/create` dengan data valid (Judul $>5$ karakter, Anggaran $\ge$ Rp50.000, Tenggat waktu di masa depan, Kategori valid).  | Data proyek baru tersimpan di tabel `Project` PostgreSQL; cache rute `/projects` direvalidasi; dialihkan dengan status sukses.                          | Record proyek tersimpan persisten di PostgreSQL dengan status `OPEN` dan `bidsCount = 0`; banner hijau konfirmasi tampil di UI.                                                                        | **LULUS** |
| **2**  | **Project** |  **Read**  | 1. Membuka URL `/projects/[id]` dengan ID yang valid.<br>2. Membuka URL `/projects/id-acak-yang-tidak-ada`.                                                | 1. Menampilkan detail spesifikasi proyek dan daftar proposal.<br>2. Menangkap kondisi tidak ditemukan dan merender tampilan `not-found.tsx` (HTTP 404). | 1. Data proyek dan relasi bids tampil lengkap.<br>2. Server merespons `notFound()` dengan halaman status ramah pengguna dan status 404.                                                                | **LULUS** |
| **3**  | **Project** | **Update** | Klien mengubah status proyek melalui dropdown status di `/client/dashboard` (misal: `OPEN` $\rightarrow$ `IN_PROGRESS` atau `COMPLETED`).                  | Status pada tabel `Project` diperbarui; cache halaman detail `/projects/[id]` dan dashboard ter-update secara reaktif.                                  | Kueri `prisma.project.update` berhasil dieksekusi; badge status pada kartu proyek berubah seketika; pesan feedback sukses tampil.                                                                      | **LULUS** |
| **4**  | **Project** | **Delete** | Klien menekan tombol hapus pada proyek yang belum pernah menerima penawaran mahasiswa (`bidsCount = 0`).                                                   | Record proyek dihapus dari basis data PostgreSQL via `prisma.project.delete`; proyek hilang dari daftar dashboard.                                      | Proyek berhasil dihapus dari tabel `Project`; revalidasi cache menghapus kartu proyek dari daftar dashboard klien.                                                                                     | **LULUS** |
| **5**  | **Bid**     | **Create** | Mahasiswa terverifikasi mengajukan proposal penawaran pada proyek terbuka melalui modal form `/projects/[id]` dengan nominal dan durasi valid.             | Transaksi atomik `prisma.$transaction` berhasil: data proposal tersimpan di tabel `Bid` dan kolom `bidsCount` pada proyek bertambah 1.                  | Kedua mutasi tereksekusi secara ACID; counter pelamar bertambah secara real-time; banner sukses tampil di formulir proposal.                                                                           | **LULUS** |
| **6**  | **Bid**     |  **Read**  | Klien membuka halaman detail proyek `/projects/[id]` untuk meninjau penawaran proposal yang masuk.                                                         | Daftar proposal mahasiswa tampil terurut dari yang paling baru (`orderBy: { createdAt: 'desc' }`) tanpa kendala kueri berulang (N+1).                   | Seluruh proposal ter-load dalam 1 kueri via `include: { bids: true }`; nama mahasiswa, kampus, tawaran harga, dan durasi tampil presisi.                                                               | **LULUS** |
| **7**  | **Bid**     | **Update** | Mahasiswa mengubah rincian proposal penawaran yang berstatus `PENDING` melalui Server Action `ubahPenawaran`. Menguji pula masukan negatif (bypass klien). | Masukan tidak sah ditolak Zod; masukan valid berhasil memperbarui kolom `bidAmount`, `durationDays`, dan `message` pada tabel `Bid`.                    | Nilai baru tersimpan persisten di basis data; proposal yang sudah tidak berstatus PENDING ditolak secara aman oleh server.                                                                             | **LULUS** |
| **8**  | **Bid**     | **Delete** | Mahasiswa membatalkan penawaran proposal miliknya yang belum diproses klien via Server Action `batalkanPenawaran`.                                         | Transaksi atomik `prisma.$transaction` menghapus baris `Bid` dan menurunkan (`decrement: 1`) nilai counter `bidsCount` pada tabel `Project`.            | Record `Bid` terhapus dari PostgreSQL; counter `bidsCount` pada proyek berkurang 1 secara sinkron; cache halaman direvalidasi.                                                                         | **LULUS** |
| **9**  | **Relasi**  |  **Read**  | Mengakses halaman detail proyek beserta seluruh relasi penawaran yang terikat (`Project` 1 : N `Bid`).                                                     | Kueri Prisma Client memuat data induk `Project` beserta array anak `Bid[]` miliknya secara konsisten tanpa mencampur data proyek lain.                  | Data anak `Bid` yang tampil di panel penawaran hanya yang memiliki `projectId` sesuai; kueri terisolasi aman dan bebas N+1.                                                                            | **LULUS** |
| **10** | **Relasi**  | **Delete** | Klien mencoba menghapus proyek yang telah memiliki penawaran mahasiswa aktif (`bidsCount > 0`).                                                            | Server menolak penghapusan secara mutlak demi menjaga integritas data penawaran mahasiswa (batasan `onDelete: Restrict`).                               | Server melakukan pre-check (`count > 0`) dan menolak aksi dengan pesan: _"Proyek tidak dapat dihapus karena telah memiliki penawaran aktif dari mahasiswa (Integritas Terproteksi)"_. Data tetap utuh. | **LULUS** |

---

## 🛡️ Dokumentasi Bukti Penolakan Validasi Sisi Server (Zod & Server Actions)

Sesuai kriteria Rubrik K2 (Validasi Masukan Server $\ge 3$ Kasus Konkret), sistem membuktikan penolakan data cacat di sisi server dengan pesan galat per-kolom:

### Kasus 1: Bypass Validasi Klien via Browser DevTools

- **Skenario Serangan / Eksploitasi:** Pengguna membuka _Browser Developer Tools_ (Inspect Element), menghapus paksa atribut HTML `required`, `minlength`, dan `pattern` pada elemen `<input id="judul">` formulir proyek, kemudian mengirimkan formulir dengan nilai string kosong `""`.
- **Mekanisme Penolakan Server:** Server Action `simpanProyek` memproses form data mentah menggunakan `skemaProyek.safeParse(mentah)`. Parser mendeteksi bahwa panjang karakter string kosong tidak memenuhi aturan `.min(5)`.
- **Hasil & Pesan Galat per Field:**
  ```json
  {
    "success": false,
    "pesan": "Periksa kembali isian formulir proyek.",
    "galat": {
      "judul": ["Judul proyek minimal 5 karakter"]
    }
  }
  ```
- **Tampilan Antarmuka:** Kotak input ditandai `aria-invalid="true"` dengan pesan galat merah pada elemen `<p id="galat-judul" role="alert">`.

### Kasus 2: Masukan Angka Ilegal / Batas Ambang Dilanggar

- **Skenario Serangan / Eksploitasi:** Pengguna mengirimkan payload manipulasi dengan memotong nilai anggaran di bawah ketentuan upah minimum platform (misal: `anggaran: 15000` atau angka negatif `anggaran: -500000`) serta durasi penawaran `durasiHari: 0`.
- **Mekanisme Penolakan Server:**
  - `skemaProyek` mengeksekusi validasi angka via `.coerce.number().int().min(50000)`.
  - `skemaPenawaran` mengeksekusi validasi via `.coerce.number().int().min(25000)` dan `.durasiHari.min(1)`.
- **Hasil & Pesan Galat per Field:**
  ```json
  {
    "success": false,
    "galat": {
      "anggaran": ["Anggaran minimal Rp50.000"],
      "durasiHari": ["Durasi minimal 1 hari"]
    }
  }
  ```
- **Tampilan Antarmuka:** Input ditandai secara programatis dan pesan kesalahan ramah bahasa Indonesia dibacakan oleh pembaca layar (_screen reader_).

### Kasus 3: Pelanggaran Aturan Semantik Lanjutan (`superRefine`)

- **Skenario Serangan / Eksploitasi:**
  1. Pengguna mencentang opsi cakupan khusus kampus `isCampusOnly: true`, namun mengosongkan nama institusi (`campusName: ""`).
  2. Pengguna memanipulasi tanggal tenggat pengerjaan dengan memilih tanggal di masa lampau (misal: `tenggatWaktu: "2020-01-01"` atau hari kemarin).
- **Mekanisme Penolakan Server:** Mesin inferensi Zod menjalankan fungsi evaluasi bersyarat `.superRefine((data, ctx) => ...)`:
  - Pemeriksaan `data.isCampusOnly && (!data.campusName || data.campusName.trim().length < 3)`.
  - Komparasi waktu `deadlineDate <= new Date()`.
- **Hasil & Pesan Galat per Field:**
  ```json
  {
    "success": false,
    "galat": {
      "campusName": [
        "Nama institusi kampus wajib diisi untuk proyek khusus kampus"
      ],
      "tenggatWaktu": ["Tenggat waktu harus tanggal di masa depan"]
    }
  }
  ```
- **Tampilan Antarmuka:** Mutasi basis data dicegah sepenuhnya (_short-circuit_), tidak ada baris baru yang terbentuk di PostgreSQL, dan pengguna dipandu untuk melengkapi nama kampus sasaran serta memilih tanggal pengerjaan yang realistis di masa depan.

---

# Arsip Milestone v0.1: Antarmuka Web Responsif & Aksesibel (Pekan 1–3)

![Next.js 15+](https://img.shields.io/badge/Next.js-15%2B-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)
![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA-emerald?style=flat-square)

Studance adalah platform marketplace berbasis kampus yang menghubungkan mahasiswa aktif terverifikasi dengan proyek profesional, industri, dan peluang kolaborasi eksklusif.

---

## 🚀 Fitur Utama & Rute Antarmuka (`v0.1`)

1. **Beranda & Katalog Utama (`/`)**
   - Banner pencarian kata kunci dan kategori cepat.
   - Filter cakupan kampus (_Semua Kampus_ vs _Eksklusif Kampus Saya_).
   - Katalog dinamis Proyek Klien dan Jasa Mandiri Mahasiswa.
2. **Detail Proyek & Formulir Proposal (`/projects/[id]`)**
   - Verifikasi kelayakan akses proyek berdasarkan domain kampus.
   - Modal interaktif pengajuan proposal penawaran (bidding) beserta validasi masukan.
3. **Verifikasi Mahasiswa Kampus (`/auth/verify-student`)**
   - Formulir validasi email resmi universitas (`.ac.id`).
   - Blok input 6-digit OTP token dengan proteksi simulasi _brute-force_.

---

## 🧩 Komponen Reusable (`components/`)

- `components/ui/VerifiedBadge.tsx`: Lencana mahasiswa terverifikasi.
- `components/ui/ScopeBadge.tsx`: Lencana cakupan proyek (_Campus-Specific_ vs _Public_).
- `components/layout/Navbar.tsx`: Header melayang dengan _Context Role Switcher_ (`[ 🎓 Freelancer | 💼 Klien ]`).
- `components/layout/MobileNav.tsx`: Bar navigasi bawah untuk layar seluler ($\le 640\text{px}$).
- `components/layout/Footer.tsx`: Penutup halaman berfitur _Trust Engine_.
- `components/features/projects/ProjectCard.tsx`: Kartu ringkasan proyek.
- `components/features/services/ServiceCard.tsx`: Kartu ringkasan jasa mahasiswa.

---

## 📸 Bukti Pengujian & Tangkapan Layar (Tugas 1 PAW Milestone v0.1)

### 1. Responsivitas Layar (Mobile, Tablet, Desktop)

![Desktop View](docs/assets/screenshot-desktop.png)
![Mobile View](docs/assets/screenshot-mobile.png)

### 2. Laporan Aksesibilitas Lighthouse (Skor >= 85)

![Lighthouse Report](docs/assets/screenshot-lighthouse.png)
_Kondisi Uji: Chrome v130+, Device Desktop, Halaman `/`, Skor Accessibility: 96/100._

### 3. Validasi Formulir Sisi Klien & Pesan Kesalahan

![Form Validation Bid](docs/assets/screenshot-form-validation-bid.png)
![Form Validation OTP](docs/assets/screenshot-form-validation-otp.png)

---

## 🔐 Integrasi Kriptografi & Keamanan Siber

### Kartu Tema Kriptografi & Keamanan Produk (Milestone v0.2)

1. **Nama Produk:**
   Student Marketplace (Studance) — Platform pasar kerja lepas berbasis ekosistem mahasiswa & identitas terverifikasi kampus.

2. **Masalah & Pengguna:**
   - **Pengguna:** Mahasiswa aktif (sebagai _freelancer_) dan Klien (dosen, departemen kampus, UMKM, perusahaan).
   - **Masalah:** Penawaran (_bids/proposal_) mahasiswa memuat rahasia harga, durasi, dan kekayaan intelektual (IP) yang rentan disadap atau diubah di database oleh pihak ketiga (_insider tampering/MitM_); serta manipulasi konteks penawaran antar-proyek.

3. **Aset yang Dilindungi:**
   - Kerahasiaan & integritas nominal harga penawaran serta pitch proposal mahasiswa (`F1`).
   - Integritas lampiran portofolio/dokumen pengerjaan proyek (`document-signer.ts`).
   - Kredensial kunci master sistem (`~/.studance/master.key`).

4. **Tabel Sambungan Komponen Tugas 1 ➔ Tugas 2 (Sesuai Slide Pekan 6):**

| Tema                        | Komponen T1 (v0.1)                                          | Komponen T2 (v0.2)                                                                                             | Sambungan Komponen                                                                                                 | Uji yang Melintasi Sambungan                                                                                                     |
| :-------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Proposal Vault Studance** | Digest Integritas Dokumen SHA-256 (`calculateDocumentHash`) | Enkripsi Terautentikasi AEAD AES-256-GCM + HKDF-SHA256 (`symmetric.ts`, `proposal-vault.ts`, `key-manager.ts`) | Hash lampiran T1 disertakan dalam serialisasi payload sebelum disegel; AAD kontekstual `proyek:<id>\|student:<id>` | Modifikasi 1 byte file lampiran mendeteksi inkonsistensi hash terhadap data yang tersimpan di dalam Proposal Vault (`[UJI-05]`). |

5. **Spesifikasi Teknis & Manajemen Kunci (NIST SP 800-38D & SP 800-57):**
   - **Algoritma:** AES-256-GCM (`ALGORITHM = 'aes-256-gcm'`) dengan Nonce CSPRNG 96-bit unik per enkripsi dan Auth Tag GHASH 128-bit.
   - **Format Paket Terpadu:** `[Nonce (12 Byte) || Ciphertext (N Byte) || Auth Tag (16 Byte)]`.
   - **Derivasi Kunci HKDF (RFC 5869):** Penegakan _"Satu Kunci, Satu Tujuan"_ melalui `crypto.hkdfSync` dengan domain konteks `studance:v0.2:proposal-encryption` dan `studance:v0.2:badge-token`.
   - **Penyimpanan di Luar Repositori:** Kunci master disimpan di `~/.studance/master.key` (atau variabel lingkungan `STUDANCE_MASTER_KEY`). Menggunakan izin POSIX `0o600` dan flag `wx` (`O_EXCL`) untuk mencegah penimpaan file secara tidak sengaja.
   - **Catatan Kompatibilitas Windows:** Pada Windows OS host, bit izin POSIX `0o600` tidak berlaku sama pada file ACL NTFS sehingga file disimpan di direktori profil pengguna aktif (`%USERPROFILE%\.studance\master.key`) dengan verifikasi simulasi izin pada test suite.
   - **Validasi di Batas Kripto (OWASP Input Validation):** Strict allowlist, normalisasi teks Unicode NFC (`normalize('NFC')`), penolakan eksplisit tipe `boolean` / `NaN` / `Infinity` / bilangan negatif, serta penanganan _fail-closed_.

6. **Keterbatasan Mekanisme v0.2 (K2 Kunci Bersama) Menuju Tugas 3:**
   - Kunci simetris bersama (_shared key_) belum mendukung **Nirsangkal (_Non-Repudiation_)** karena pemegang kunci yang sama secara teoritis dapat memalsukan data. Keterbatasan ini menjadi dasar perancangan Tanda Tangan Digital Asimetris (Ed25519/RSA-PSS) pada Tugas 3.

---

### 🧪 Skenario Uji Otomatis Kriptografi Tugas 2 (`npm run test:crypto`)

| ID Uji      | Modul Pengujian              | Jenis             | Deskripsi Skenario & Kondisi Batas                                                | Ekspektasi & Respons Fail-Closed                                                 |
| :---------- | :--------------------------- | :---------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **UJI-01**  | `symmetric.test.ts`          | Positif           | Enkripsi payload proposal valid -> dekripsi dengan kunci sah                      | Data kembali 100% identik & nonce 96-bit terbukti selalu acak/baru               |
| **UJI-02**  | `symmetric.test.ts`          | Negatif           | Memodifikasi 1 byte pada bagian ciphertext terenkripsi                            | Dekripsi ditolak seketika (_fail-closed_) dengan galat `InvalidTag`              |
| **UJI-03**  | `symmetric.test.ts`          | Negatif           | Mendekripsi paket valid menggunakan kunci simetris 256-bit lain                   | Dekripsi ditolak seketika (_fail-closed_) dengan galat `InvalidTag`              |
| **UJI-04**  | `symmetric.test.ts`          | Negatif           | Context-swapping: AAD proyekId atau studentId ditukar                             | Verifikasi AAD gagal, memicu eksepsi `InvalidTag`                                |
| **UJI-05**  | `symmetric.test.ts`          | Integrasi T1      | Memodifikasi 1 byte berkas lampiran portofolio di penyimpanan                     | Verifikasi `verifyDocumentIntegrity` mendeteksi ketidaksesuaian hash             |
| **UJI-K01** | `key-and-validation.test.ts` | Positif & Negatif | Pembangkitan CSPRNG 256-bit & uji penimpaan file eksisting                        | Flag `O_EXCL` (`wx`) menolak penimpaan kunci lama (_FileExistsError_)            |
| **UJI-K02** | `key-and-validation.test.ts` | Positif           | Derivasi subkunci HKDF-SHA256 RFC 5869 untuk proposal & token                     | Subkunci terbukti terisolasi secara matematis satu sama lain dan dari master key |
| **UJI-K03** | `key-and-validation.test.ts` | Positif           | Masukan teks beraksen dengan encoding berbeda (Unicode NFC vs NFD)                | Normalisasi NFC menyamakan representasi biner sebelum enkripsi                   |
| **UJI-K04** | `key-and-validation.test.ts` | Negatif           | Masukan bernilai `NaN`, `Infinity`, `boolean`, angka negatif, atau properti asing | Ditolak seketika oleh `ValidationError` di batas kripto (_strict allowlist_)     |
| **UJI-K05** | `key-and-validation.test.ts` | Negatif           | Kunci dengan panjang salah (< 32 byte) atau izin terlalu terbuka (`0o644`)        | Ditolak secara _fail-closed_ dengan galat `KeyManagementError`                   |

---

## 🛡️ Skenario Uji Integrasi MVP berbasis Threat Model (v0.1)

Tabel skenario pengujian berikut diturunkan secara langsung dari dokumen **Threat Model (`security/threat-model.md`)** untuk memverifikasi efektivitas kontrol keamanan, mekanisme kriptografi, dan logika aplikasi web secara sistematis.

| ID Uji    | ID Ancaman | Jenis          | Skenario (Kondisi Awal)                                                                          | Aksi / Fitur yang Diuji                                                           | Ekspektasi / Target Harapan                                                                                                |
| :-------- | :--------- | :------------- | :----------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **U-01**  | **T-01**   | Negatif        | Attacker melakukan _brute force login_ ke akun mahasiswa (`F1`) > 5 kali dalam 1 menit           | API Auth & Rate Limiting (`P1` / `app/(auth)/auth`)                               | Rate limiter aktif, IP penyerang diblokir sementara dengan respons `429 Too Many Requests`.                                |
| **U-02**  | **T-02**   | Negatif        | Request penawaran proyek (`F1`) dikirimkan tanpa enkripsi TLS / HTTP biasa                       | Transmisi Data Network Boundary (`TB1` ke `P1`)                                   | Server menolak koneksi HTTP dan memaksa pengalihan (_enforce_) ke HTTPS/TLS 1.3.                                           |
| **U-03**  | **T-03**   | Negatif        | Klien mengubah payload JSON anggaran proyek (`F3`) dengan format/nilai invalid saat submit       | Server-side Input Validation (`P1` via Zod Schema)                                | Zod validator menolak request di server-side dan mengembalikan respons `400 Bad Request`.                                  |
| **U-04**  | **T-04**   | Positif        | Pengguna melakukan aksi sensitif (login, perubahan peran, submit bidding) pada platform          | Logging & Audit System (`DS2` / `lib/audit`)                                      | Log tercatat di `DS2` mencatat `user_id` unik, `IP address`, aksi, dan stempel waktu (_timestamp_) ISO-8601.               |
| **U-05**  | **T-05**   | Negatif        | Mahasiswa A mengubah parameter ID pada URL/API untuk mengintip PII Mahasiswa B (IDOR)            | API Endpoint Profil & Portofolio (`P1` / `F2`)                                    | Akses ditolak oleh otorisasi RBAC/ABAC dengan respons `403 Forbidden` atau `404 Not Found`.                                |
| **U-06**  | **T-06**   | Negatif        | Request API sengaja dikirim dengan payload merusak kueri basis data `DS1`                        | Error Handling & Stack Trace Sanitization (`P1`)                                  | Server mengembalikan respons error generik `500 Internal Server Error` tanpa membocorkan _stack trace_ DB.                 |
| **U-07**  | **T-07**   | Negatif        | Attacker mengirimkan request unggahan berkas berukuran raksasa (> 100MB) secara simultan         | Request Body Limit & Resource Management (`P1`)                                   | Gateway/Middleware menolak request sebelum masuk memori utama (`413 Payload Too Large`).                                   |
| **U-08**  | **T-08**   | Negatif        | Akses langsung dicoba dari host luar ke port PostgreSQL (5432) kontainer `DS1`                   | Docker Network Isolation & Host Firewall (`TB3`)                                  | Port 5432 tertutup dari jaringan publik (_connection refused_ / _timed out_), hanya terhubung internal via Docker network. |
| **U-09**  | **T-09**   | Negatif        | Mahasiswa biasa mencoba mengakses endpoint API khusus Admin/Klien (Bypass RBAC)                  | Middleware RBAC / Route Guard Next.js (`P1`)                                      | Middleware menolak akses dan mengembalikan respons `403 Forbidden` (_Broken Access Control_ dicegah).                      |
| **U-10A** | **T-10**   | **Vektor Uji** | Verifikasi token OTP/Lencana Mahasiswa (`P2`) menggunakan payload terstruktur yang diserialisasi | HMAC/SHA-256 Token Generator (`lib/crypto/token-verifier.ts`)                     | Token HMAC terbukti deterministik dan identik presisi untuk input payload yang sama (Sesuai Vektor Uji Kripto).            |
| **U-10B** | **T-10**   | Negatif        | Attacker mencoba memalsukan token lencana mahasiswa dengan _secret key_ palsu / data edit        | HMAC Verification & Security Comparison (`lib/crypto/token-verifier.ts`)          | Sistem membandingkan token secara _timing-safe_ dan menolak token palsu dengan hasil `false`.                              |
| **U-11**  | **T-11**   | Negatif        | Attacker mengunggah berkas `malicious.php` atau `webshell.exe` pada form portofolio (`F10`)      | File Upload Validation & Storage Zone (`DS3`)                                     | Server memvalidasi Magic Bytes / MIME-type, menolak berkas eksekutabel, dan mengembalikan `400 Bad Request`.               |
| **U-12**  | **T-10**   | Positif        | Mahasiswa terverifikasi mengunggah bukti pengerjaan proyek yang ditandatangani digital           | Digital Signature & SHA-256 Digest Verification (`lib/crypto/document-signer.ts`) | Hash SHA-256 dokumen tervalidasi cocok; jika berkas diubah 1 byte, verifikasi mendeteksi _tampering_.                      |
| **K-01**  | **T-04**   | Batasan        | Pengguna memodifikasi log lokal/sertifikat dan menghitung ulang rantai hash secara mandiri       | Cryptography Chain & Integrity Check (`lib/crypto`)                               | Belum terdeteksi jika _Private Key_ penandatangan ikut terkompromi (Dokumentasi keterbatasan sistem).                      |

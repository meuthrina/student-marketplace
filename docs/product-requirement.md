# Analisis Kebutuhan Produk: Studance (MVP)

**Document Type:** Software Requirements Specification (SRS) & Product Requirements Document (PRD) — Versi Awal (Milestone 1 / v0.1)  
**Mata Kuliah Terintegrasi:** Pengembangan Aplikasi Web (52355) | Kriptografi (52357) | Keamanan Komputasi & Siber (52353)  
**Program Studi:** Ilmu Komputer, Universitas Pertamina  
**Pengembang:** Iman Dwi Satrio (NIM: 105224029)  

---

## 1. Pernyataan Masalah (Problem Statement)

* **Mahasiswa Aktif Universitas** mengalami **kesulitan mendapatkan pengalaman kerja nyata, portofolio profesional terverifikasi, dan penghasilan tambahan yang fleksibel** karena **ketiadaan platform talenta terfokus ekosistem kampus serta tingginya hambatan masuk (*barrier to entry*) pada marketplace global seperti Fiverr/Upwork**, sehingga **banyak talenta mahasiswa tidak terserap optimal dan lulus tanpa riwayat rekam jejak kerja yang dapat dibuktikan.**

* **Klien (Dosen, Organisasi Kampus, UMKM, dan Perusahaan)** mengalami **kesulitan menemukan talenta terpercaya dengan keaktifan akademik yang tervalidasi dan tarif yang kompetitif** karena **proses perekrutan independen sering kali tidak memiliki mekanisme verifikasi identitas dan garansi reputasi yang jelas**, sehingga **perekrutan proyek jangka pendek menjadi berisiko tinggi dan tidak efisien.**

---

## 2. Pengguna Sasaran (Target User Personas)

Sistem Studance melayani 3 aktor/peran pengguna utama (sesuai pemetaan entitas pada DFD Level 0):

1. **Mahasiswa / Student Freelancer (Aktor Utama - DFD Entity `E1`):**
   - Mahasiswa aktif perguruan tinggi yang mencari proyek kerja lepas, menawarkan jasa independen (*Service Offerings*), membangun portofolio terverifikasi, dan memperoleh insentif finansial.
2. **Klien / Project Owner (Aktor Utama - DFD Entity `E2`):**
   - Dosen, peneliti, pengurus organisasi mahasiswa, pemilik UMKM, atau perwakilan perusahaan yang memerlukan jasa profesional berbasis proyek maupun membeli jasa yang ditawarkan mahasiswa.
3. **Administrator Sistem (Aktor Internal):**
   - Pengelola platform yang memantau keabsahan verifikasi identitas kampus, mengelola kategori proyek/jasa, dan menangani eskalasi perselisihan.

---

## 3. Kebutuhan Fungsional (Functional Requirements - FR) & Pemetaan Halaman/Komponen

Seluruh kebutuhan fungsional diturunkan langsung dari permasalahan pengguna, diberi penomoran unik `FR-xx`, serta dipetakan secara terstruktur ke rute halaman (*route*), komponen React utama, dan integrasi 3 Mata Kuliah.

| ID Kode | Kebutuhan Fungsional | Deskripsi & Cakupan Fitur | Halaman (*Route*) | Komponen Utama | Integrasi 3 Mata Kuliah | Kriteria Penerimaan (*Acceptance Criteria*) |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Eksplorasi Proyek & Penawaran Jasa (*Services*)** | Pengguna (Mahasiswa/Publik) dapat menjelajahi, menyaring, dan mencari daftar proyek terbuka dari Klien maupun daftar penawaran jasa (*services/gigs*) yang dibuka oleh Mahasiswa. | `/` *(Beranda)* | `Navbar`, `HeroSection`, `TabFilter`, `ProjectCard`, `ServiceCard`, `Footer` | **Web:** Client-side filtering & state React.<br>**Cybersec:** Sanitasi query pencarian dari XSS/SQLi. | - Menampilkan katalog terpisah untuk **Daftar Proyek** dan **Daftar Jasa Mahasiswa**.<br>- Katalog memuat judul, nama pembuat, harga/anggaran, batas waktu, kategori, dan indikator cakupan (*Public* vs *Campus-Specific*).<br>- Filter pencarian berfungsi berdasarkan kata kunci, kategori keahlian, dan rentang harga.<br>- Waktu respon pemuatan data tiruan (*mock data*) $< 2$ detik. |
| **FR-02** | **Visualisasi Detail Proyek/Jasa & Pembatasan Akses Kampus** | Pengguna dapat melihat rincian lengkap spesifikasi proyek Klien atau rincian penawaran jasa Mahasiswa beserta aturan kualifikasi ketersediaan. | `/projects/[id]`<br>`/services/[id]` | `HeaderNav`, `ProjectHeader`, `CampusBadge`, `PriceCard`, `RequirementsList` | **Web:** Dynamic Route Next.js.<br>**Cybersec:** Authorization check (*Campus-Specific Restriction*). | - Menampilkan deskripsi lengkap kebutuhan proyek/jasa, paket harga, dan lencana keanggotaan kampus yang dipersyaratkan.<br>- Proyek/Jasa berskala *Campus-Specific* secara eksplisit menampilkan indikator pembatasan dan menolak formulir lamaran/transaksi dari pengguna luar kampus. |
| **FR-03** | **Publikasi Penawaran Jasa Mandiri oleh Mahasiswa (*Service Listing*)** | Mahasiswa terautentikasi dapat membuat dan memublikasikan penawaran jasa mandiri (*Service Offering / Gig*) sesuai keahliannya agar dapat dibeli/disewa oleh Klien. | `/services/create` | `HeaderNav`, `ServiceForm`, `InputField`, `TextArea`, `FileUpload`, `SubmitButton` | **Web:** Form Handling & Zod Validation.<br>**Cybersec:** Safe File Upload validation (magic bytes). | - Formulir pembuatan jasa menyediakan masukan judul jasa, kategori, deskripsi layanan, estimasi durasi pengerjaan, patokan harga (IDR), dan gambar/berkas sampel kerja.<br>- Menjalankan validasi sisi klien (*client-side validation*): menolak masukan harga $\le 0$, deskripsi $< 20$ karakter, atau berkas bukan format `.pdf`/`.png`/`.jpg`.<br>- Menampilkan pesan kesalahan (*error message*) yang informatif tepat di bawah masukan yang tidak valid. |
| **FR-04** | **Pengajuan Penawaran Lamaran Proyek (*Project Bidding*)** | Mahasiswa terautentikasi dapat mengirimkan formulir proposal penawaran (*bid*) untuk melamar proyek yang dibuka oleh Klien. | `/projects/[id]` *(Modal / Section)* | `BidModalForm`, `InputField`, `ProposalTextArea`, `FileUpload`, `SubmitButton` | **Web:** React Modal State & Server Action.<br>**Crypto:** Integritas payload proposal (HMAC/Hash). | - Formulir lamaran menyediakan masukan nilai estimasi biaya (IDR), durasi pengerjaan (hari), proposal pesan penawaran, dan lampiran berkas portofolio.<br>- Validasi sisi klien menolak masukan biaya $\le 0$ atau proposal $< 20$ karakter.<br>- Menampilkan pesan kesalahan yang jelas dan informatif saat input tidak valid. |
| **FR-05** | **Profil Mahasiswa & Lencana Verifikasi Kampus (*Verified Student Badge*)** | Mahasiswa memiliki halaman profil publik yang menampilkan keahlian, daftar jasa yang ditawarkan, riwayat portofolio, dan status keabsahan sebagai mahasiswa aktif. | `/profile` *(Dashboard)*<br>`/profile/[id]` *(Public)* | `ProfileHeader`, `VerifiedBadge`, `SkillsTagList`, `ServiceGrid`, `PortfolioGallery` | **Web:** Layout & Composition Components.<br>**Crypto:** Verifikasi status terbukti sah (Digital Signature/Badge). | - Halaman profil menampilkan nama lengkap, program studi, daftar keahlian (*skills*), ringkasan biodata, daftar jasa aktif, dan galeri portofolio.<br>- Terdapat indikator visual *Verified Student Badge* yang terhubung dengan status verifikasi domain email kampus. |
| **FR-06** | **Verifikasi Identitas Mahasiswa Berbasis Email Kampus & Token** | Sistem menyediakan alur verifikasi keaktifan mahasiswa melalui verifikasi domain email institusi. | `/auth/verify-student` | `VerificationForm`, `EmailInput`, `OTPCodeInput`, `AlertMessage`, `SubmitButton` | **Crypto:** Pembangkitan OTP/Token via CSPRNG & HMAC-SHA256.<br>**Cybersec:** Anti-Brute Force Rate Limiting. | - Formulir verifikasi menerima masukan email berakhiran domain kampus (misal: `@student.universitaspertamina.ac.id`).<br>- Sistem menggenerasi token OTP verifikasi 6-digit sementara dan memvalidasi kebenaran masukan token pengguna sebelum mengubah status akun menjadi terverifikasi. |
| **FR-07** | **Manajemen Portofolio Terverifikasi (*Verified Experience*)** | Mahasiswa dapat mengunggah dan mengelola berkas bukti portofolio hasil pengerjaan proyek atau sampel karya. | `/profile/portfolio` | `PortfolioTable`, `UploadModal`, `FileInput`, `DeleteConfirmModal`, `ActionBadge` | **Web:** CRUD State Management.<br>**Crypto:** Hash Integritas Berkas (`DS3`). | - Pengguna dapat menambah, melihat detail, dan menghapus item portofolio dari dasbor pribadi.<br>- Setiap berkas portofolio yang diunggah menampilkan nama berkas, ukuran berkas, dan tanggal unggah yang tersimpan secara terstruktur. |
| **FR-08** | **Autentikasi & Kontrol Akses Berbasis Peran (RBAC)** | Sistem membatasi hak akses halaman dan fungsi API berdasarkan peran pengguna (*Student*, *Client*, *Admin*). | `/auth/login`<br>`/auth/register` | `LoginForm`, `RegisterForm`, `RoleSelector`, `InputField`, `SubmitButton` | **Web:** Session & Cookies.<br>**Crypto:** Argon2id Password Hashing.<br>**Cybersec:** Middleware RBAC & IDOR Prevention. | - Formulir masuk (*login*) dan daftar (*register*) berfungsi membedakan sesi peran pengguna.<br>- Pengguna dengan peran *Student* ditolak saat mencoba mengakses antarmuka/endpoint pembuatan proyek milik *Client*, begitu pula sebaliknya. |
| **FR-09** | **Dasbor Klien & Manajemen Penawaran/Lamaran** | Klien dapat memublikasikan proyek baru, melihat daftar penawaran jasa mahasiswa, serta meninjau lamaran yang masuk pada proyek miliknya. | `/client/projects/create`<br>`/client/dashboard` | `ProjectCreateForm`, `ApplicantListTable`, `ApplicantDetailModal`, `StatusBadge` | **Web:** Server Actions & Prisma Mutation.<br>**Cybersec:** Access Control endpoint Klien. | - Formulir penerbitan proyek baru berfungsi memuat judul, deskripsi, anggaran, dan batasan kampus.<br>- Dasbor Klien menampilkan seluruh proposal *bids* yang masuk untuk proyek tertentu beserta status verifikasi kampus kandidat. |

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

* **NFR-01 (Desain Responsif):** Antarmuka web wajib berfungsi baik, tidak *overlap*, dan dapat digunakan secara efisien pada minimal 3 ukuran layar: Mobile (360px–640px), Tablet (768px), dan Desktop ($\ge 1024\text{px}$).
* **NFR-02 (Aksesibilitas Web):** Pengujian otomatis menggunakan *Google Chrome Lighthouse Accessibility Audit* pada seluruh halaman utama wajib meraih skor minimal **85 / 100**.
* **NFR-03 (Semantik & Struktur HTML):** Menggunakan elemen HTML5 semantik (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`) serta atribut ARIA yang tepat untuk mendukung navigasi *screen reader*.

---

## 5. Batasan Produk (Product Scope Boundaries)

Untuk menjamin kelayakan penyelesaian proyek dalam 1 semester (MVP Scope Management), hal-hal berikut **DITEGASKAN TIDAK DIKERJAKAN** pada versi MVP saat ini:

1. **Sistem Pembayaran / Escrow Riil:** Sistem tidak mengintegrasikan *payment gateway* perbankan sungguhan (menggunakan simulasi *Mock Escrow Status*).
2. **Real-time Video Calling / Chatting:** Komunikasi antarpengguna dilakukan melalui pesan berbasis formulir, bukan WebSocket *real-time chat* atau panggil video.
3. **Integrasi Blockchain / Smart Contract:** Verifikasi reputasi dan sertifikat dilakukan menggunakan mekanisme basis data relasional dan fungsi hash kriptografi standar, bukan jaringan terdesentralisasi (*blockchain*).
4. **Mobile Native App:** Aplikasi hanya dikembangkan dalam bentuk *Responsive Web Application* (PWA/Browser-based), bukan aplikasi Android/iOS native.

---

## 6. Relevansi dan Pemetaan Data Terproteksi (Integrasi 3 Mata Kuliah)

Produk Studance memuat data sensitif dan area kritis yang memerlukan penerapan langsung dari 3 mata kuliah terintegrasi:

| Mata Kuliah | Elemen / Data Terproteksi | Mekanisme & Kontrol Teknis |
| :--- | :--- | :--- |
| **Pengembangan Aplikasi Web (52355)** | Interaksi formulir, rendering UI responsif, state management, penawaran jasa/proyek, dan validasi masukan client/server. | Next.js App Router, TypeScript, Tailwind CSS, Zod Validation, dan React Hooks. |
| **Kriptografi (52357)** | Kredensial kata sandi, token verifikasi email kampus (`F6`), dan integritas berkas portofolio (`DS3`). | Argon2id/bcrypt password hashing, OTP generator berbasis CSPRNG, dan verifikasi integritas HMAC-SHA256. |
| **Keamanan Komputasi & Siber (52353)** | Data pribadi mahasiswa (NIM, PII), sesi otorisasi RBAC, isolasi container Docker, dan audit log (`DS2`). | Mitigasi OWASP Top 10 (IDOR, XSS, CSRF), TLS 1.3, sanitasi input, dan *append-only audit logging*. |
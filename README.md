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
- `/app` : Application Router, UI Components, & API (MK Web)
- `/lib/crypto` : Modul & fungsi Kriptografi (MK Kriptografi)
- `/security` : Threat Model STRIDE, DFD, Risk Register, & Audit Log (MK Cybersecurity)

## 🏷️ Version Tags
- `v0.1` : Tugas 1 Web Programming (UI & Mock Data)
- `crypto-v0.1` : Tugas 1 Kriptografi (Komponen Dasar Hashing)
- `sec-0.1` : Tugas 1 Cybersecurity (Threat Modeling STRIDE)

# Studance — Marketplace Talenta & Jasa Mahasiswa Terverifikasi (`v0.1`)

![Next.js 15+](https://img.shields.io/badge/Next.js-15%2B-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)
![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA-emerald?style=flat-square)

Studance adalah platform marketplace berbasis kampus yang menghubungkan mahasiswa aktif terverifikasi dengan proyek profesional, industri, dan peluang kolaborasi eksklusif.

---

## 🚀 Fitur Utama & Rute Antarmuka (`v0.1`)

1. **Beranda & Katalog Utama (`/`)**
   - Banner pencarian kata kunci dan kategori cepat.
   - Filter cakupan kampus (*Semua Kampus* vs *Eksklusif Kampus Saya*).
   - Katalog dinamis Proyek Klien dan Jasa Mandiri Mahasiswa.
2. **Detail Proyek & Formulir Proposal (`/projects/[id]`)**
   - Verifikasi kelayakan akses proyek berdasarkan domain kampus.
   - Modal interaktif pengajuan proposal penawaran (bidding) beserta validasi masukan.
3. **Verifikasi Mahasiswa Kampus (`/auth/verify-student`)**
   - Formulir validasi email resmi universitas (`.ac.id`).
   - Blok input 6-digit OTP token dengan proteksi simulasi *brute-force*.

---

## 🧩 Komponen Reusable (`components/`)

- `components/ui/VerifiedBadge.tsx`: Lencana mahasiswa terverifikasi.
- `components/ui/ScopeBadge.tsx`: Lencana cakupan proyek (*Campus-Specific* vs *Public*).
- `components/layout/Navbar.tsx`: Header melayang dengan *Context Role Switcher* (`[ 🎓 Freelancer | 💼 Klien ]`).
- `components/layout/MobileNav.tsx`: Bar navigasi bawah untuk layar seluler ($\le 640\text{px}$).
- `components/layout/Footer.tsx`: Penutup halaman berfitur *Trust Engine*.
- `components/features/projects/ProjectCard.tsx`: Kartu ringkasan proyek.
- `components/features/services/ServiceCard.tsx`: Kartu ringkasan jasa mahasiswa.

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal

1. **Pengulangan Repositori & Instalasi Dependensi:**
   ```bash
   npm install

## 📸 Bukti Pengujian & Tangkapan Layar (Tugas 1 PAW Milestone v0.1)

### 1. Responsivitas Layar (Mobile, Tablet, Desktop)
![Desktop View](docs/assets/screenshot-desktop.png)
![Mobile View](docs/assets/screenshot-mobile.png)

### 2. Laporan Aksesibilitas Lighthouse (Skor >= 85)
![Lighthouse Report](docs/assets/screenshot-lighthouse.png)
*Kondisi Uji: Chrome v130+, Device Desktop, Halaman `/`, Skor Accessibility: 96/100.*

### 3. Validasi Formulir Sisi Klien & Pesan Kesalahan
![Form Validation Bid](docs/assets/screenshot-form-validation-bid.png)
![Form Validation OTP](docs/assets/screenshot-form-validation-otp.png)

## Kartu Tema Kriptografi & Keamanan Produk (v0.1)

1. **Nama Produk:**
   Student Marketplace — Platform pasar kerja lepas berbasis ekosistem mahasiswa & identitas terverifikasi kampus.

2. **Masalah & Pengguna:**
   - **Pengguna:** Mahasiswa aktif (sebagai *freelancer*) dan Klien (dosen, departemen kampus, UMKM, perusahaan).
   - **Masalah:** Banyak pemalsuan status mahasiswa pada proyek khusus kampus (*campus-specific projects*), serta tidak adanya bukti klaim riwayat pekerjaan/portofolio yang kredibel dan bebas dari manipulasi pihak dalam (*insider tampering*).

3. **Aset yang Dilindungi:**
   - Kredensial & status verifikasi mahasiswa (Email kampus / NIM / Identitas).
   - Catatan transaksi & bukti penyerahan proyek (*project completion evidence*).
   - Integritas riwayat reputasi/ulasan mahasiswa (*reputation log*).

4. **Model Penyerang (Attacker Model):**
   - **Orang Luar (External Attacker):** Mencoba mengakses proyek khusus kampus tanpa hak akses (*Chosen-Plaintext Attack / Unauthorized Access*).
   - **Orang Dalam (Insider / Malicious Student/Client):** Mencoba mengubah atau memalsukan catatan penyelesaian proyek / ulasan di database (*Active Attacker / Tampering*).

5. **Prioritas Tujuan Keamanan (Security Goals):**
   1. **Integritas (Integrity):** Bukti penyelesaian proyek & ulasan tidak dapat diubah/dihapus tanpa terdeteksi.
   2. **Autentikasi & Otorisasi (Authentication & Access Control):** Memastikan pembatasan akses proyek kampus (*campus-specific restriction*) tepat sasaran.
   3. **Nirsangkal (Non-repudiation):** Klien dan mahasiswa tidak dapat menyangkal persetujuan penyelesaian proyek yang telah ditandatangani/diverifikasi.
   4. **Kerahasiaan (Confidentiality):** Melindungi data sensitif profil mahasiswa/klien yang tidak dipublikasikan.

6. **Rencana Tahapan Tugas Kriptografi (T1 – T3):**
   - **Tugas 1 (v0.1):** Implementation of Integrity Chain / Hash Verification untuk bukti penyelesaian proyek (Rantai Hash Catatan / *Canonical JSON Hash*).
   - **Tugas 2 (v0.2):** Integrasi HMAC (Authentication Code) menggunakan *secret key* terdistribusi untuk verifikasi integritas catatan transaksi dan enkripsi terautentikasi (AES-GCM) untuk dokumen/pesan proyek.
   - **Tugas 3 (v0.3 & v1.0):** Skema Kunci Publik (Ed25519) untuk Tanda Tangan Digital sertifikat/portofolio mahasiswa + Manajemen Kunci & PKI.

7. **Uji Negatif Pertama (Negatf/Boundary Test v0.1):**
   - Mengubah 1 karakter/byte pada data penyerahan proyek (*deliverable payload*) atau mengubah status verifikasi mahasiswa secara ilegal → verifikasi integritas rantai hash langsung gagal (mengembalikan indeks data yang rusak).

---

---

## Skenario Uji Integrasi MVP berbasis Threat Model (v0.1)

Tabel skenario pengujian berikut diturunkan secara langsung dari dokumen **Threat Model (`security/threat-model.md`)** untuk memverifikasi efektivitas kontrol keamanan, mekanisme kriptografi, dan logika aplikasi web secara sistematis.

Skenario dikategorikan ke dalam empat jenis uji akademis: **Positif**, **Negatif**, **Vektor Uji (Deterministic Test Vector)**, dan **Batasan (Limitation)**.

| ID Uji | ID Ancaman | Jenis | Skenario (Kondisi Awal) | Aksi / Fitur yang Diuji | Ekspektasi / Target Harapan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **U-01** | **T-01** | Negatif | Attacker melakukan *brute force login* ke akun mahasiswa (`F1`) > 5 kali dalam 1 menit | API Auth & Rate Limiting (`P1` / `app/(auth)/auth`) | Rate limiter aktif, IP penyerang diblokir sementara dengan respons `429 Too Many Requests`. |
| **U-02** | **T-02** | Negatif | Request penawaran proyek (`F1`) dikirimkan tanpa enkripsi TLS / HTTP biasa | Transmisi Data Network Boundary (`TB1` ke `P1`) | Server menolak koneksi HTTP dan memaksa pengalihan (*enforce*) ke HTTPS/TLS 1.3. |
| **U-03** | **T-03** | Negatif | Klien mengubah payload JSON anggaran proyek (`F3`) dengan format/nilai invalid saat submit | Server-side Input Validation (`P1` via Zod Schema) | Zod validator menolak request di server-side dan mengembalikan respons `400 Bad Request`. |
| **U-04** | **T-04** | Positif | Pengguna melakukan aksi sensitif (login, perubahan peran, submit bidding) pada platform | Logging & Audit System (`DS2` / `lib/audit`) | Log tercatat di `DS2` mencatat `user_id` unik, `IP address`, aksi, dan stempel waktu (*timestamp*) ISO-8601. |
| **U-05** | **T-05** | Negatif | Mahasiswa A mengubah parameter ID pada URL/API untuk mengintip PII Mahasiswa B (IDOR) | API Endpoint Profil & Portofolio (`P1` / `F2`) | Akses ditolak oleh otorisasi RBAC/ABAC dengan respons `403 Forbidden` atau `404 Not Found`. |
| **U-06** | **T-06** | Negatif | Request API sengaja dikirim dengan payload merusak kueri basis data `DS1` | Error Handling & Stack Trace Sanitization (`P1`) | Server mengembalikan respons error generik `500 Internal Server Error` tanpa membocorkan *stack trace* DB. |
| **U-07** | **T-07** | Negatif | Attacker mengirimkan request unggahan berkas berukuran raksasa (> 100MB) secara simultan | Request Body Limit & Resource Management (`P1`) | Gateway/Middleware menolak request sebelum masuk memori utama (`413 Payload Too Large`). |
| **U-08** | **T-08** | Negatif | Akses langsung dicoba dari host luar ke port PostgreSQL (5432) kontainer `DS1` | Docker Network Isolation & Host Firewall (`TB3`) | Port 5432 tertutup dari jaringan publik (*connection refused* / *timed out*), hanya terhubung internal via Docker network. |
| **U-09** | **T-09** | Negatif | Mahasiswa biasa mencoba mengakses endpoint API khusus Admin/Klien (Bypass RBAC) | Middleware RBAC / Route Guard Next.js (`P1`) | Middleware menolak akses dan mengembalikan respons `403 Forbidden` (*Broken Access Control* dicegah). |
| **U-10A**| **T-10** | **Vektor Uji** | Verifikasi token OTP/Lencana Mahasiswa (`P2`) menggunakan payload terstruktur yang diserialisasi | HMAC/SHA-256 Token Generator (`lib/crypto/token-verifier.ts`) | Token HMAC terbukti deterministik dan identik presisi untuk input payload yang sama (Sesuai Vektor Uji Kripto). |
| **U-10B**| **T-10** | Negatif | Attacker mencoba memalsukan token lencana mahasiswa dengan *secret key* palsu / data edit | HMAC Verification & Security Comparison (`lib/crypto/token-verifier.ts`) | Sistem membandingkan token secara *timing-safe* dan menolak token palsu dengan hasil `false`. |
| **U-11** | **T-11** | Negatif | Attacker mengunggah berkas `malicious.php` atau `webshell.exe` pada form portofolio (`F10`) | File Upload Validation & Storage Zone (`DS3`) | Server memvalidasi Magic Bytes / MIME-type, menolak berkas eksekutabel, dan mengembalikan `400 Bad Request`. |
| **U-12** | **T-10** | Positif | Mahasiswa terverifikasi mengunggah bukti pengerjaan proyek yang ditandatangani digital | Digital Signature & SHA-256 Digest Verification (`lib/crypto/document-signer.ts`) | Hash SHA-256 dokumen tervalidasi cocok; jika berkas diubah 1 byte, verifikasi mendeteksi *tampering*. |
| **K-01** | **T-04** | Batasan | Pengguna memodifikasi log lokal/sertifikat dan menghitung ulang rantai hash secara mandiri | Cryptography Chain & Integrity Check (`lib/crypto`) | Belum terdeteksi jika *Private Key* penandatangan ikut terkompromi (Dokumentasi keterbatasan sistem). |

> **Catatan Pemetaan & Implementasi Pengujian**:
> 1. **Korelasi Threat Model**: Setiap ID Uji (`U-01` s.d. `U-12`) memitigasi secara langsung ID Ancaman (`T-01` s.d. `T-11`) yang telah didokumentasikan di `security/threat-model.md`.
> 2. **Metode Eksekusi**: 
>    - Skenario Web & Cyber (`U-01`, `U-03`, `U-05`, `U-06`, `U-07`, `U-09`, `U-11`) dieksekusi dengan **Vitest** dan **Playwright**.
>    - Skenario Keamanan Jaringan/Infrastruktur (`U-02`, `U-08`) dieksekusi via skrip audit lingkungan Docker (`Lynis` / `Nmap`).
>    - Skenario Kriptografi (`U-10`, `U-12`, `K-01`) dieksekusi via unit test deterministik pada modul `lib/crypto/`.

### Rancangan Komponen Kriptografi (Tugas 1)

1. **Modul Verifikasi Lencana Mahasiswa (`lib/crypto/token-verifier.ts`)**:
   - **Masukan (Input)**: Payload JSON Mahasiswa (`studentId`, `email`, `campusCode`) dan `SECRET_KEY` (string).
   - **Proses**: Kanonisasi string input `campus:{code}|email:{email}|id:{id}` → Penandatanganan HMAC-SHA256 menggunakan modul bawaan Node.js `crypto`.
   - **Keluaran (Output)**: String Hex Digest 64-karakter & boolean hasil verifikasi *timing-safe*.
   - **Alasan Pustaka**: Menggunakan modul native `node:crypto` untuk performa tinggi, keamanan bawaan engine V8, serta menghindari kerentanan *software supply chain* dari dependensi pihak ketiga.

2. **Modul Integritas Dokumen Proyek (`lib/crypto/document-signer.ts`)**:
   - **Masukan (Input)**: Buffer/Binary data berkas bukti pengerjaan proyek.
   - **Proses**: Pembentukan Hash Digest SHA-256 (256-bit).
   - **Keluaran (Output)**: Hash String Hex Digest & boolean hasil pencocokan integritas.
   - **Alasan Pustaka**: Standardisasi algoritma hash aman NIST FIPS 180-4.
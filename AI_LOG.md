# AI Log: Catatan Pemanfaatan Kecerdasan Artifisial (AI Assistant)

**Nama Produk:** Studance — Student Freelance Marketplace Platform (MVP)  
**Pemilik Proyek / Pengembang:** Iman Dwi Satrio (NIM: 105224029)  
**Program Studi / Universitas:** Ilmu Komputer, Universitas Pertamina  
**Mata Kuliah Terkait:**

1. Pengembangan Aplikasi Web (Kode MK: 52355)
2. Kriptografi (Kode MK: 52357)
3. Keamanan Komputasi dan Siber (Kode MK: 52353)

---

## Pernyataan Tanggung Jawab & Etika Akademis

Sesuai dengan ketentuan RPS MK Pengembangan Aplikasi Web, Kriptografi, dan Keamanan Komputasi & Siber Universitas Pertamina:

- Penggunaan AI Assistant (Gemini) dimanfaatkan sebagai _Full Project Mentor_, _Thought Partner_, dan _Drafting Assistant_.
- Seluruh keputusan arsitektur, pemodelan ancaman, justifikasi nilai risiko, penanganan aksesibilitas WCAG 2.2 AA, serta validasi kebenaran logika/skrip adalah **tanggung jawab penuh pengembang (mahasiswa)**.
- Mahasiswa sanggup mempertahankan dan mempertanggungjawabkan setiap bagian dari kode, artefak DFD, model ancaman STRIDE, register risiko, serta modul pengujian kriptografi saat demonstrasi dan evaluasi produk.

---

## Log Riwayat Penggunaan AI — Section 1: Pengembangan Aplikasi Web (Tugas 1 PAW - Pekan 1–3)

### Tahap 1: Grounding Arsitektur Antarmuka & Token Design System

- **Tanggal / Tanggal Interaksi:** 10–12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 PAW (Sub-CPMK 2 - Antarmuka Web Responsif & Aksesibel)
- **Prompt / Permintaan Pengguna:**
  Merancang token CSS _Liquid Glassmorphism_ (`styles/globals.css`), pengunci aksesibilitas WCAG 2.2 AA (`focus-visible` & `prefers-reduced-motion`), serta Component Tree React sesuai slide materi PAW Pekan 3.
- **Hasil & Luaran AI:**
  Draf token CSS, komponen atomik (`VerifiedBadge.tsx` & `ScopeBadge.tsx`), serta diagram Mermaid React Component Tree yang membedakan _Server Components_ dan _Client Components_ (`"use client"`).
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Mengoreksi dan memisahkan sintaks CSS agar tidak terbungkus markdown code block yang memicu `CssSyntaxError` pada Next.js Turbopack.
  - Memastikan rasio kontras warna lencana (_Emerald Verified_ & _Amber Scope_) memenuhi batas aksesibilitas minimum 4.5:1.

### Tahap 2: Layout Global & Fitur Beranda Catalog

- **Tanggal / Tanggal Interaksi:** 11–12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 PAW (Sub-CPMK 2 - Layout & Reusable Components)
- **Prompt / Permintaan Pengguna:**
  Membangun `Navbar.tsx` dengan _Context Role Switcher_ (`[ 🎓 Freelancer | 💼 Klien ]`), `MobileNav.tsx` (Glass Bottom Bar), `HeroSection.tsx`, `ScopeFilterBar.tsx`, `ProjectCard.tsx`, `ServiceCard.tsx`, dan `app/page.tsx`.
- **Hasil & Luaran AI:**
  Kode TypeScript modular untuk seluruh komponen layout dan fitur beranda dengan pencarian dan penyaringan data tiruan (`mockData.ts`).
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Mengintegrasikan React `<Suspense>` boundary pada `MobileNav.tsx` untuk mencegah galat prerendering `usePathname()` saat build.

### Tahap 3: Detail Proyek, Modal Bidding, & Verifikasi Kampus

- **Tanggal / Tanggal Interaksi:** 12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 PAW (Sub-CPMK 2 - Routing, Form Validation, & Multi-page)
- **Prompt / Permintaan Pengguna:**
  Membangun rute detail proyek `app/projects/[id]/page.tsx` dengan modal proposal (`BidModalForm`), serta rute verifikasi email kampus & token OTP `app/(auth)/auth/verify-student/page.tsx`.
- **Hasil & Luaran AI:**
  Kode TypeScript untuk halaman detail proyek, validasi masukan modal (biaya, durasi, proposal, lampiran 5MB), dan alur multi-step verifikasi OTP.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Melakukan refactoring penanganan `use(params)` menggunakan React `<Suspense>` boundary untuk kepatuhan Next.js 15+ App Router.
  - Memperbaiki struktur direktori Route Group `app/(auth)/auth/verify-student/page.tsx` agar rute URL `http://localhost:3000/auth/verify-student` dapat diakses tanpa galat 404.

---

## Log Riwayat Penggunaan AI — Section 2: Keamanan Komputasi & Siber (Tugas 1 KKS - Pekan 1–3)

### Tahap 1: Grounding Arsitektur & Perancangan DFD Level 0

- **Tanggal / Tanggal Interaksi:** 9 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 KKS (Sub-CPMK 1 - Inventaris Aset & DFD)
- **Prompt / Permintaan Pengguna:**
  Melakukan formulasi arsitektur DFD Level 0 dan Trust Boundaries untuk MVP Student Freelance Marketplace (Next.js + PostgreSQL + Docker Host).
- **Hasil & Luaran AI:**
  Saran notasi baku DFD (Shostack), pemetaan 3 Trust Boundaries (TB1 Public, TB2 Docker Host, TB3 Internal Data), katalog 3 External Entities, 2 Processes, 3 Data Stores, dan 10 Data Flows.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Mengoreksi dan menyesuaikan entitas DFD agar mencerminkan kondisi riil MVP kampus (misal: penambahan verifikasi domain email kampus Universitas Pertamina).
  - Menggambar DFD secara manual/visual dan menyimpannya sebagai berkas gambar `security/assets/data-flow-diagram.png`.
  - Menyusun berkas `security/docs/data-flow-diagram.md` yang memuat penataan tabel notasi, deskripsi elemen, dan contoh konkret _data flow_.

### Tahap 2: Pemodelan Ancaman (STRIDE-per-Element)

- **Tanggal / Tanggal Interaksi:** 9 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 KKS (Sub-CPMK 1 - Analisis STRIDE)
- **Prompt / Permintaan Pengguna:**
  Mengidentifikasi minimal 10 ancaman STRIDE pada elemen DFD yang melintasi Trust Boundaries sesuai format baku NIST SP 800-30 / Adam Shostack.
- **Hasil & Luaran AI:**
  Draf 11 _Threat Statements_ (T-01 s.d. T-11) yang memuat elemen DFD, kategori STRIDE, klausa ancaman, dan aset terdampak.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Meninjau _Threat Statements_ agar tidak sekadar memuat kelas kerentanan (_vulnerability_), melainkan secara spesifik memuat _threat source_, _tindakan_, _elemen_, _kelemahan_, dan _dampak_ (NIST format).
  - Memastikan konsistensi penamaan ID `T-01` s.d. `T-11` pada berkas `security/threat-model.md`.

### Tahap 3: Risk Assessment & Risk Register (NIST SP 800-30)

- **Tanggal / Tanggal Interaksi:** 9 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 KKS (Sub-CPMK 1 - Risk Register & Prioritasi)
- **Prompt / Permintaan Pengguna:**
  Menilai _Likelihood_ (L) dan _Impact_ (I) untuk 11 ancaman, menentukan 5 risiko prioritas _Very High_, serta merumuskan rencana kontrol yang terhubung ke tugas akademis 3 mata kuliah.
- **Hasil & Luaran AI:**
  Tabel Risk Register (R-01 s.d. R-11) dengan justifikasi L dan I satu kalimat, penetapan 5 risiko _Very High_ (R-01, R-02, R-03, R-04, R-05), dan pemetaan kontrol ke Tugas 2–4.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Menguji kelayakan penilaian risiko pada skala resmi Tugas 1 KKS ($L \times I$).
  - Memastikan 5 risiko prioritas secara nyata mencerminkan risiko kritis produk _Student Freelance Marketplace_ (misal: proteksi port 5432 basis data, IDOR pada Next.js, webshell pada upload portofolio, brute force auth, dan forge token verifikasi mahasiswa).
  - Menyusun berkas `security/risk-register.md`.

---

## Log Riwayat Penggunaan AI — Section 3: Kriptografi (Tugas 1 Kriptografi - Pekan 1–3)

### Tahap 1: Pemetaan Kebutuhan Kriptografi & Komponen Dasar

- **Tanggal / Tanggal Interaksi:** 12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 Kriptografi (Sub-CPMK 3 - Komponen Dasar & Vektor Uji)
- **Prompt / Permintaan Pengguna:**
  Merancang modul fungsi kriptografi dasar yang terhubung langsung dengan _Threat Model_ Keamanan Siber (`T-10`: pemalsuan token lencana mahasiswa & `T-04`: penyangkalan integritas bukti pengerjaan proyek).
- **Hasil & Luaran AI:**
  - Pustaka logika `src/lib/crypto/token-verifier.ts` (HMAC-SHA256 untuk lencana mahasiswa terkanonisasi)[cite: 125, 137, 140].
  - Pustaka logika `src/lib/crypto/document-signer.ts` (SHA-256 Digest untuk verifikasi integritas bukti proyek)[cite: 125, 137, 140].
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Menggunakan modul native `node:crypto` guna menjamin keamanan engine V8 dan menghindari dependensi _third-party_ yang rentan _supply chain attack_[cite: 125, 133].
  - Menyelaraskan kanonisasi string input pada generator HMAC agar mendukung sifat deterministik _Test Vector_[cite: 125, 137].

### Tahap 2: Formulasi Skenario Uji & Troubleshooting Runner

- **Tanggal / Tanggal Interaksi:** 12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 Kriptografi (Sub-CPMK 3 - Minimal 3 dari 4 Uji Berhasil)
- **Prompt / Permintaan Pengguna:**
  Menyusun skrip pengujian unit 4 skenario (`U-10A`, `U-10B`, `U-12`, `K-01`), mengatasi galat `ERESOLVE peer dependency` pada npm, serta mengatasi galat `rolldown / node:util styleText` pada Vitest[cite: 125, 127, 137].
- **Hasil & Luaran AI:**
  Saran penggunaan `--legacy-peer-deps` dan konversi runner pengujian menggunakan `tsx` + `node:assert`[cite: 127].
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Mengganti bundler Vitest/Vite dengan `tsx` agar eksekusi pengujian ringan, bebas bentrok versi Node.js lokal, dan lulus 100% pada 4 skenario uji[cite: 124, 127].
  - Memperbarui tabel pengujian pada `README.md` sehingga secara eksplisit menampilkan 4 skenario uji Kriptografi terhubung ke ID Ancaman.

---

## Ringkasan Integrasi AI pada Artefak Tugas 1 PAW, KKS, & Kriptografi

| Nama Berkas Artefak                       | Kontribusi AI Assistant                                                     | Penyelarasan & Validasi Mahasiswa                                                          |
| :---------------------------------------- | :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `styles/globals.css`                      | Usulan token warna dan utility class glassmorphism.                         | Pembersihan sintaks CSS dari karakter markdown pendukung Turbopack.                        |
| `components/ui/*`                         | Draf komponen `VerifiedBadge.tsx` dan `ScopeBadge.tsx`.                     | Penyesuaian rasio kontras warna dan atribut aksesibilitas WCAG 2.2 AA.                     |
| `components/layout/*`                     | Draf `Navbar.tsx`, `MobileNav.tsx`, dan `Footer.tsx`.                       | Pembungkusan `MobileNav` dengan React `<Suspense>` boundary.                               |
| `app/projects/[id]/page.tsx`              | Draf halaman detail proyek dan modal `BidModalForm`.                        | Pembungkusan `use(params)` dengan React `<Suspense>` boundary untuk Next.js 15+.           |
| `app/(auth)/auth/verify-student/page.tsx` | Draf formulir input email kampus dan blok OTP.                              | Penyesuaian struktur direktori folder agar URL `/auth/verify-student` berfungsi tanpa 404. |
| `security/data-flow-diagram.md`           | Draf struktur teks, penjelasan legenda DFD, dan contoh konkret aliran data. | Verifikasi kesesuaian dengan arsitektur Next.js + PostgreSQL + Docker Host.                |
| `security/threat-model.md`                | Draf 11 entri STRIDE-per-Element dengan sintaks NIST SP 800-30.             | Pemastian ketiadaan duplikasi ID (`T-01` s.d. `T-11`) dan validitas klausa ancaman.        |
| `security/risk-register.md`               | Draf perhitungan skor risiko ($L \times I$) dan usulan rencana mitigasi.    | Penyesuaian skala resmi KKS dan penetapan 5 risiko prioritas utama (_Very High_).          |
| `src/lib/crypto/*`                        | Draf logika fungsi `token-verifier.ts` dan `document-signer.ts`.            | Penggunaan `node:crypto` native dan kanonisasi payload deterministik.                      |
| `lib/crypto/tests/*`                      | Draf skrip unit test 4 skenario uji kriptografi.                            | Migrasi ke `tsx` + `node:assert` untuk hasil pengujian 100% PASS.                          |
| `AI_LOG.md`                               | Draf format catatan transparansi penggunaan AI 3 mata kuliah.               | Pengisian riwayat prompt, tanggal, dan pengesahan etika akademis terintegrasi.             |

| `AGENTS.md` & `.agents/skills/project-mentor/SKILL.md` | Inisialisasi berkas konfigurasi AI Assistant / Full Project Mentor & Engineering Guide. | Penyelarasan batasan MVP, roadmap 3 mata kuliah, dan guardrails operasional agen IDE. |

---

## Log Riwayat Penggunaan AI — Section 4: Konfigurasi Agen IDE & Project Mentor (Pekan 4)

### Tahap 1: Inisialisasi Guardrails & Engineering Guide Agen

- **Tanggal / Waktu Interaksi:** 29 Oktober 2026
- **Komponen / Berkas yang Dimodifikasi:**
  - `AGENTS.md`
  - `.agents/skills/project-mentor/SKILL.md`
  - `AI_LOG.md`
- **Deskripsi Perubahan & Alasan Teknis:**
  - Menetapkan peran sistem agen sebagai _Full Project Mentor_ dan _Lead Architect_.
  - Mengunci batasan produk MVP (dilarang payment gateway riil, instant messaging/call, blockchain, mobile native).
  - Menetapkan Docker Compose PostgreSQL sebagai _single source of truth_ basis data.
  - Menegakkan kewajiban verifikasi tipe (`tsc --noEmit`) dan pencatatan audit log `AI_LOG.md`.
- **Korelasi Mata Kuliah:**
  - **Pengembangan Aplikasi Web:** Pembatasan scope MVP, arsitektur Next.js App Router, Prisma ORM via Docker.
  - **Kriptografi:** Roadmap token OTP HMAC-SHA256, digest integritas SHA-256, dan tanda tangan digital.
  - **Keamanan Komputasi & Siber:** Kontainerisasi Docker non-root, isolasi database port lokal, audit logging terstruktur.

---

## Log Riwayat Penggunaan AI — Section 5: Keamanan Komputasi & Siber (Pekan 4 - Autentikasi, Kontrol Akses, & Hak Akses Linux)

### Tahap 1: Penyusunan Artefak RBAC/ABAC, Baseline Hardening Linux, & Pemutakhiran Skema Kata Sandi NIST

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Komponen / Berkas yang Dimodifikasi:**
  - `security/access-test.md` (Baru dibuat)
  - `security/hardening-notes.md` (Baru dibuat)
  - `lib/skema.ts` (Diperbarui)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Matriks Akses & Uji Negatif (`security/access-test.md`):** Menyusun pemetaan hak akses per peran (_Guest_, _Student_, _Client_, _Admin_) dan kebijakan ABAC untuk _Campus-Specific Projects_ serta _Separation of Duty_ guna memitigasi risiko prioritas **R-02** (_Broken Access Control / Elevation of Privilege_). Dilengkapi 5 skenario uji negatif (_Negative Testing_) untuk memvalidasi penolakan akses tidak sah.
  - **Baseline Pengerasan Linux (`security/hardening-notes.md`):** Mendokumentasikan kepatuhan konfigurasi akun non-root `deploy:app`, audit UID 0 (`/etc/passwd`), pembatasan permission berkas `.env` (`chmod 640`), konfigurasi sudo terbatas via `/etc/sudoers.d/deploy`, dan protokol uji negatif `sudo -u nobody cat .env` -> `Permission denied`. Menjadi artefak persiapan Tugas 2 (milestone `sec-0.2`).
  - **Pemutakhiran Skema Password (`lib/skema.ts`):** Menyelaraskan `loginSchema`, `registerSchema`, dan `skemaMasuk` dengan rekomendasi NIST SP 800-63B-4 dengan menambahkan batas maksimal 64 karakter (`.min(8).max(64)`) tanpa membatasi penggunaan _password manager_, autofill, atau paste melalui aturan komposisi kaku.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Pemenuhan Sub-CPMK 3 (prinsip _least privilege_, _fail-safe defaults_, mitigasi ancaman STRIDE _Elevation of Privilege_, kontrol hak akses Linux, dan audit pra-Lynis).
  - **Pengembangan Aplikasi Web (PAW):** Penguatan validasi bentuk Zod v4 pada sisi klien/server dan penyiapan fondasi pengujian RBAC pada Server Actions.
  - **Kriptografi:** Standardisasi masukan kredensial kata sandi sebagai persiapan integrasi salt dan _slow hash_ (Argon2id) pada roadmap Tugas 2.

---

## Log Riwayat Penggunaan AI — Section 6: Keamanan Komputasi & Siber (Pekan 5 - Audit Lynis Baseline & Hardening OS / SSH / Patch Management)

### Tahap 1: Analisis Audit Lynis Baseline, Pemetaan Risk Register, & Drop-in Hardening SSH

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Cybersecurity & Systems Engineering Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Latihan 2 & Persiapan Tugas 2 KKS (Sub-CPMK 3 - System Hardening OS, SSH, Patch Management, & Lynis)
- **Komponen / Berkas yang Dimodifikasi:**
  - `security/lynis-before.txt` (Dianalisis metrik baseline awal: Skor 66/100, 244 tes, 1 warning, 37 suggestions)
  - `security/config/00-hardening.conf` (Baru dibuat sebagai drop-in config SSH acuan CIS Benchmark Level 1)
  - `security/hardening-notes.md` (Diperbarui dengan Section 8: Ringkasan Eksekutif Lynis, Pemetaan Temuan vs Risk Register, Rencana Pengerasan SSH, & Patch Management)
  - `AI_LOG.md` (Diperbarui)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Analisis Baseline Lynis (`security/lynis-before.txt`):** Mengekstrak Hardening Index baseline awal sistem operasi Ubuntu 26.04 LTS (skor 66/100) dan mengidentifikasi titik lemah utama seperti ketiadaan konfigurasi SSH saat baseline, paket sistem yang membutuhkan patch (`PKGS-7392`), izin direktori cron yang longgar (`FILE-7524`), dan ketiadaan login banner hukum (`BANN-7126`).
  - **Pemetaan Temuan vs Risk Register (`security/risk-register.md`):** Memetakan 7 temuan audit ke matriks risiko produk Studance (termasuk korelasi ke risiko prioritas R-01, R-02, R-04, R-08, dan R-10). Menetapkan keputusan beralasan: 5 kontrol diterapkan secara konkrit dan 2 kontrol diterima/ditunda sebagai _residual risk_ (malware scanner & partisi terpisah) dengan pertimbangan batasan lingkungan lab WSL2 / kontainer Docker.
  - **Drop-in Config SSH CIS Level 1 (`security/config/00-hardening.conf`):** Menyusun konfigurasi drop-in berbasis prinsip _First Match Wins_ yang menonaktifkan root login (`PermitRootLogin no`), menonaktifkan autentikasi password (`PasswordAuthentication no`, `KbdInteractiveAuthentication no`), mewajibkan kunci publik (`PubkeyAuthentication yes`), membatasi user ke `deploy` (`AllowUsers deploy`), membatasi percobaan login (`MaxAuthTries 3`), mempersingkat grace time (`LoginGraceTime 30`), dan mematikan X11 forwarding (`X11Forwarding no`).
  - **Rencana Patch Management & Uji Negatif:** Mendokumentasikan 3 lapisan patching (OS host via `apt`/`unattended-upgrades`, image Docker, dan npm dependencies), deteksi `/var/run/reboot-required`, uji sintaks `sshd -t`, verifikasi runtime `sshd -T`, serta 2 skenario uji negatif penolakan autentikasi password dan login root.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Pemenuhan Sub-CPMK 3 (pengurangan attack surface host OS, pengerasan SSH mengacu CIS Benchmark, penerapan defense-in-depth berbasis kasus _regreSSHion_ CVE-2024-6387, penyiapan bukti pemindaian pra-hardening untuk Tugas 2 milestone `sec-0.2`).
  - **Kriptografi:** Penerapan autentikasi asimetris berbasis public key cryptography (Ed25519) menggantikan kata sandi konvensional pada akses remote server.
  - **Pengembangan Aplikasi Web (PAW):** Menjaga ketersediaan (_availability_) dan stabilitas server hosting aplikasi Next.js serta container PostgreSQL selama proses hardening dan automasi patch berkala.

### Tahap 2: Iterasi Pengerasan Sistem Lanjutan (Peningkatan Lynis Index > 70 Menuju 80)

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Cybersecurity & Systems Engineering Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 KKS (Sub-CPMK 3 - Hardening OS & Container, Indeks Lynis Minimal 70)
- **Komponen / Berkas yang Dimodifikasi:**
  - `/etc/ssh/sshd_config.d/00-hardening.conf` & `security/config/00-hardening.conf` (Penambahan kontrol CIS: `AllowTcpForwarding no`, `AllowAgentForwarding no`, `ClientAliveCountMax 2`, `ClientAliveInterval 300`, `LogLevel VERBOSE`, `MaxSessions 2`, `TCPKeepAlive no`, `Banner /etc/issue.net`)
  - `/etc/issue` & `/etc/issue.net` (Pemasangan banner peringatan akses sistem resmi Studance)
  - `/etc/login.defs` (Penetapan `UMASK 027`, umur kata sandi 90 hari, dan SHA-512 crypt rounds 5000)
  - `/etc/crontab` & `/etc/cron.*` (Pengetatan izin direktori 700 dan crontab 600)
  - `/usr/bin/as` (Pengetatan izin compiler/assembler 700)
  - Paket utilitas keamanan (`libpam-tmpdir`, `apt-show-versions`, `needrestart`, `debsums`, `auditd`)
  - `/etc/sysctl.d/99-hardening.conf` (Pengetatan parameter kernel jaringan dan memori)
  - `security/lynis-after.txt` (Penyalinan hasil audit akhir pasca-pengerasan)
  - `security/hardening-notes.md` (Pencatatan perbandingan skor sebelum dan sesudah)
- **Deskripsi Perubahan & Alasan Teknis:**
  - Melakukan audit iteratif berbasis terminal di mana pemindaian awal pasca drop-in standar masih menghasilkan skor **68** (belum memenuhi ambang batas minimal 70 pada rubrik Tugas 2).
  - Melakukan serangkaian perbaikan terukur tanpa melanggar batasan arsitektur (tidak merusak fungsionalitas container Docker / Next.js) dengan menyasar temuan-temuan spesifik Lynis: banner terminal (`BANN-7126`, `BANN-7130`), umask dan aging sandi (`AUTH-9328`, `AUTH-9286`), pembatasan forward/sesi SSH (`SSH-7408`), pengetatan izin crontab (`FILE-7524`), dan pembatasan kompiler (`HRDN-7222`).
  - Hasil audit ulang Lynis berhasil melompat dari skor **68** menjadi **80 / 100** (menuntaskan 245 tes dengan 0 peringatan kritis / _0 warnings_).
  - Mengeksekusi penyalinan berkas bukti resmi `cp lynis-after.txt /mnt/d/Career\ Database/04\ Projects/Academic/student-marketplace/security/`.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Memenuhi 100% kriteria batas kelulusan rubrik Tugas 2 (milestone `sec-0.2`: Indeks Lynis minimal 70 dengan bukti `lynis-before.txt` dan `lynis-after.txt`, login SSH key-only, login root ditolak).
  - **Kriptografi:** Konsistensi manajemen kunci asimetris pada konfigurasi SSH dan parameter hashing SHA-512 pada level OS.
  - **Pengembangan Aplikasi Web (PAW):** Menjamin lingkungan VM host tetap stabil untuk pengoperasian kontainer database PostgreSQL dan Next.js App Router.

### Tahap 3: Verifikasi Konfigurasi Efektif & Demonstrasi 2 Uji Negatif SSH

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Cybersecurity & Systems Engineering Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 & Latihan 2 KKS (Sub-CPMK 3 - Autentikasi, Otorisasi, & Least Privilege: Uji Negatif SSH)
- **Komponen / Berkas yang Dimodifikasi:**
  - `security/hardening-notes.md` (Menambahkan Sub-bab 8.6: Verifikasi Konfigurasi Efektif dan Bukti Uji Negatif SSH)
  - `AI_LOG.md` (Pencatatan bukti eksekusi terminal)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Verifikasi Runtime SSH (`sshd -T`):** Mengeksekusi verifikasi konfigurasi aktif pada daemon OpenSSH Ubuntu WSL untuk memastikan direktif `permitrootlogin no`, `passwordauthentication no`, `kbdinteractiveauthentication no`, dan `allowusers deploy imandwtyii` telah diterapkan secara efektif sesuai prinsip _First Match Wins_.
  - **Uji Negatif 1 (Bypass Kunci Publik via Password):** Menjalankan `ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password deploy@127.0.0.1 -p 22` dan menangkap hasil aktual penolakan `deploy@127.0.0.1: Permission denied (publickey)`. Hal ini membuktikan bahwa jalur login password tertutup total dan serangan _brute force / credential stuffing_ (**R-04 / T-01**) berhasil dimitigasi.
  - **Uji Negatif 2 (Percobaan Login Langsung Superuser Root):** Menjalankan `ssh root@127.0.0.1 -p 22` dan menangkap hasil aktual penolakan `root@127.0.0.1: Permission denied (publickey)`. Hal ini membuktikan penolakan langsung terhadap akses remote root guna memitigasi risiko eskalasi hak istimewa (**R-02 / T-09**).
  - Mendokumentasikan tabel pengujian, cuplikan terminal mentah (_raw snippet_), dan analisis keamanan pada berkas `security/hardening-notes.md`.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Pemenuhan rubrik Tugas 2 komponen Autentikasi, otorisasi, dan least privilege (35 poin) yang mewajibkan bukti uji negatif penolakan akses tidak sah sama banyaknya dengan uji positif.
  - **Kriptografi:** Pembuktian penegakan kunci asimetris (_public key only_) tanpa toleransi terhadap fallback teks sandi (_cleartext/password authentication_).
  - **Pengembangan Aplikasi Web (PAW):** Menjaga boundary keamanan server deployment agar hanya dapat diakses melalui identitas pengguna terdaftar secara aman.

---

## Log Riwayat Penggunaan AI — Section 7: Keamanan Komputasi & Siber (Pekan 6 - Container Hardening & Software Supply Chain, Milestone `sec-0.2`)

### Tahap 1: Pengerasan Image Kontainer (Multi-Stage Build, Non-Root UID 1001, Least Privilege Runtime, & Isolasi Database PostgreSQL)

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Software Engineering & Cybersecurity Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 KKS (Sub-CPMK 3 - Hardening Sistem Operasi dan Kontainer, 30 Poin, Milestone `sec-0.2`) & Tugas 2 Pengembangan Aplikasi Web (PAW - Kontainerisasi Aplikasi & Database)
- **Komponen / Berkas yang Dimodifikasi:**
  - `.dockerignore` (Dibuat baru di root repositori untuk memblokir kebocoran file rahasia `.env*`, `.git`, `.next`, `node_modules`, dan berkas log build lokal)
  - `next.config.ts` (Diperbarui dengan opsi `output: "standalone"` untuk menghasilkan artefak server terkompilasi minimal yang siap dieksekusi secara terisolasi)
  - `Dockerfile` (Dibuat baru dengan konfigurasi multi-stage build resmi Next.js berbasis image minimal `node:22-alpine`: stage `deps`, stage `builder`, dan stage `runner` dengan pengguna non-root `nextjs:nodejs` UID/GID 1001)
  - `compose.yaml` (Dibuat baru dengan kontrol least privilege runtime untuk service `app`: `user: "1001:1001"`, `read_only: true`, `tmpfs: ["/tmp"]`, `cap_drop: ["ALL"]`, `security_opt: ["no-new-privileges:true"]`, `ports: ["3000:3000"]`, dan service `db` PostgreSQL 17 Alpine tanpa pemetaan port host untuk memitigasi risiko R-01)
  - `.env.example` & `.env` (Disediakan berkas template dan variabel lingkungan lokal untuk konfigurasi runtime tanpa mem-bake secrets ke dalam layer image)
  - `security/hardening-notes.md` (Diperbarui dengan Bab 9: Arsitektur Pengerasan Kontainer, Pencegahan Kebocoran Secrets, Pembatasan Runtime, Penutupan Port Database R-01, dan Protokol Verifikasi Kontainer)
  - `AI_LOG.md` (Pencatatan pemanggilan dan modifikasi terintegrasi)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Pencegahan Kebocoran Secrets (`.dockerignore`):** Berdasarkan acuan NIST SP 800-190 Bagian 3, seluruh berkas konfigurasi `.env*`, metadata Git `.git`, artefak build `.next`, dan direktori `node_modules` host diblokir dari konteks build Docker agar tidak tertanam secara permanen pada layer image statis.
  - **Multi-Stage Build & Minimal Image (`Dockerfile`):** Menggunakan base image `node:22-alpine` dalam 3 tahap terpisah. Stage `deps` menjalankan `npm ci`, stage `builder` menghasilkan build `standalone`, dan stage `runner` hanya menyalin biner/artefak yang esensial. Build tools dan source code development tidak diikutsertakan pada image final, secara drastis memperkecil ukuran image dan memangkas _attack surface_.
  - **Non-Root User Enforcement (UID 1001):** Di dalam stage `runner`, dibuat grup `nodejs` (GID 1001) dan pengguna sistem `nextjs` (UID 1001). Kepemilikan berkas standalone, static, dan public dialihkan ke user non-root (`--chown=nextjs:nodejs`), kemudian ditutup dengan direktif `USER nextjs` untuk memastikan proses `node server.js` tidak berjalan sebagai UID 0.
  - **Runtime Hardening (`compose.yaml`):** Membatasi kapabilitas kernel kontainer aplikasi via `cap_drop: ["ALL"]`, mencegah eskalasi privilege melalui program setuid via `no-new-privileges:true`, memberlakukan filesystem hanya-baca (`read_only: true`) dengan direktori temporer memori `tmpfs: ["/tmp"]`, serta menetapkan runtime user `1001:1001`.
  - **Isolasi Database PostgreSQL (Mitigasi R-01):** Service `db` menggunakan `postgres:17-alpine` dengan `cap_drop: ["ALL"]` dan persistensi volume `postgres_data`. Untuk memitigasi risiko berlevel kritis tertinggi **R-01 (T-08 | Skor: 25 - Very High)** pada `security/risk-register.md`, direktif `ports` ke host **ditiadakan**. Port 5432 hanya dapat dijangkau dari dalam jaringan internal Docker Compose oleh service `app`, menutup akses langsung dari host, jaringan kampus, maupun internet publik.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Pemenuhan langsung rubrik Tugas 2 milestone `sec-0.2` (kontainer berjalan sebagai non-root, capability minimum cap_drop ALL, read_only filesystem, port basis data tidak terekspos ke host / internet, mitigasi risiko prioritas R-01).
  - **Pengembangan Aplikasi Web (PAW):** Menyiapkan arsitektur deployment kontainer produksi standar Next.js App Router dengan PostgreSQL sebagai basis data terisolasi yang persisten.
  - **Kriptografi:** Melindungi kunci rahasia, secret token, dan credential database dari paparan supply chain dan kebocoran metadata layer image kontainer.

### Tahap 2: Eksekusi Build, Pengujian Runtime Kontainer, & Dokumentasi Bukti (Sub-CPMK 3, Milestone `sec-0.2`)

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Systems & Cybersecurity Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 KKS (Sub-CPMK 3 - Pengerasan Sistem Operasi dan Kontainer, 30 Poin, Milestone `sec-0.2`)
- **Komponen / Berkas yang Dimodifikasi:**
  - `package.json` & `package-lock.json` (Penyelarasan versi `@types/node` ke `^22` untuk konsistensi peer dependency Node 22 Alpine saat eksekusi `npm ci`)
  - `compose.yaml` (Penyesuaian `cap_add: [CHOWN, FOWNER, SETGID, SETUID, DAC_OVERRIDE]` pada service `db` agar entrypoint script resmi PostgreSQL 17 Alpine dapat menginisialisasi volume persisten secara terisolasi tanpa ports host)
  - `security/hardening-notes.md` (Pembaruan Bab 9 dengan Sub-bab 9.5 Tabel Hasil Pengujian Runtime, Sub-bab 9.6 Rekaman Terminal Asli, dan Sub-bab 9.7 Analisis Korelasi Mitigasi Risiko R-01 dan R-02)
  - `AI_LOG.md` (Pencatatan bukti eksekusi terminal)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Eksekusi Build & Up Kontainer:** Berhasil menjalankan `docker compose build` (memproduksi image `student-marketplace-app:latest` berbasis Alpine minimal) dan `docker compose up -d` (service `app` dan `db` berstatus running/healthy).
  - **Uji Runtime 1 — Verifikasi User Non-Root:** Menjalankan `docker compose exec app id` dan memperoleh hasil `uid=1001(nextjs) gid=1001(nodejs) groups=1001(nodejs)`. Membuktikan bahwa aplikasi tidak berjalan dengan UID 0 (root).
  - **Uji Runtime 2 — Linux Capability Efektif (CapEff):** Menjalankan `docker compose exec app grep CapEff /proc/1/status` dan memperoleh hasil `CapEff: 0000000000000000`. Membuktikan seluruh kapabilitas Linux berhasil dicabut (`cap_drop: ALL`).
  - **Uji Runtime 3 — Uji Negatif Penulisan Filesystem Read-Only:** Menjalankan `docker compose exec app touch /app/uji` dan menangkap respon penolakan kernel `touch: /app/uji: Read-only file system` (Exit code 1). Membuktikan filesystem kontainer bersifat _immutable_.
  - **Uji Runtime 4 — Verifikasi Isolasi Port PostgreSQL dari Host:** Menjalankan `ss -tlpn | grep 5432` pada Linux host dan menghasilkan keluaran kosong (exit code 1). Membuktikan port 5432 tidak listening pada antarmuka host maupun internet publik, sementara service `app` mendengarkan pada port 3000 (`ss -tlpn | grep 3000`).
  - **Korelasi Mitigasi Risiko:** Menautkan hasil uji secara formal ke mitigasi risiko **R-01** (Database Exposure | Skor 25 VH) dan **R-02** (Elevation of Privilege via Container Escape | Skor 16 VH) pada dokumen `security/risk-register.md`.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Pemenuhan 100% rubrik Tugas 2 komponen "Hardening sistem operasi dan container" (30 poin) dan pemenuhan Sub-CPMK 3 dengan bukti teks terminal mentah dan uji negatif penolakan penulisan filesystem.
  - **Pengembangan Aplikasi Web (PAW):** Menjamin aplikasi web Next.js 16 App Router berjalan secara fungsional di port 3000 (status HTTP 200 OK) dan terhubung aman ke database PostgreSQL via jaringan internal Compose.
  - **Kriptografi:** Menjaga proteksi memori dan integritas filesystem runtime dari potensi modifikasi modul kriptografi atau pengintipan kunci sesi.

### Tahap 3: Pemindaian Kerentanan Image (Trivy Before-After) & Pembuatan SBOM CycloneDX (Sub-CPMK 3, Milestone `sec-0.2`)

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Cybersecurity and Systems Engineering Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 KKS (Sub-CPMK 3 - Pemindaian Kerentanan Sebelum–Sesudah & SBOM, 20 Poin, Milestone `sec-0.2`)
- **Komponen / Berkas yang Dimodifikasi:**
  - `package.json` & `package-lock.json` (Pembaruan versi `next` dan `eslint-config-next` dari `16.4.0` ke versi aman `16.4.1` untuk remediasi 2 celah CRITICAL)
  - `security/image-scan-before.txt` (Dihasilkan melalui pemindaian Trivy awal terhadap `student-marketplace-app:latest`: terdeteksi 13 kerentanan - 11 HIGH, 2 CRITICAL)
  - `security/image-scan-after.txt` (Dihasilkan melalui pemindaian Trivy pasca-rebuild kontainer: terbukti **0 kerentanan CRITICAL** dan 10 HIGH terjustifikasi)
  - `security/sbom.cdx.json` (Dihasilkan berkas SBOM berstandar OWASP CycloneDX format JSON v1.7, ukuran ~321 KB, 11.679 baris)
  - `security/hardening-notes.md` (Pembaruan Bab 10 dengan tabel perbandingan before vs after, rincian remediasi CRITICAL, justifikasi residual risk, dan inventarisasi SBOM)
  - `AI_LOG.md` (Pencatatan riwayat pemanggilan dan remediasi)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Pemasangan Scanner Terverifikasi:** Menginstal Trivy v0.71.2 melalui repositori APT resmi Aqua Security dengan verifikasi kunci publik GPG untuk menghindari versi berisiko (mengacu pada insiden pasokan Trivy v0.69.4–v0.69.6 pada studi kasus Pekan 6).
  - **Pemindaian Awal (`image-scan-before.txt`):** Mengidentifikasi 2 kerentanan CRITICAL pada Next.js 16.4.0: `GHSA-2464-fhr4-w9xw` (Unauthenticated RCE pada Image Optimization API via SVG) dan `GHSA-673q-mjm6-r5xr` (Unauthenticated RCE pada fungsi `use cache` typed array), serta 1 kerentanan HIGH `CVE-2026-94482`.
  - **Remediasi & Rebuild:** Memperbarui pustaka `next` dan `eslint-config-next` ke rilis patch keamanan `16.4.1`, mengaudit dependensi (`npm audit`), lalu melakukan rebuild image melalui `docker compose build`.
  - **Pemindaian Ulang (`image-scan-after.txt`):** Menjalankan pemindaian ulang pasca-remediasi yang membuktikan penurunan kerentanan CRITICAL menjadi **0 (Nol)**. Temuan 10 kerentanan HIGH dievaluasi dan dicatat sebagai risiko residual yang telah termitigasi oleh arsitektur kontainer _read-only_ dan _non-root_.
  - **Penerbitan SBOM CycloneDX (`sbom.cdx.json`):** Mengekspor daftar formal seluruh komponen software sistem operasi Alpine Linux dan modul npm ke dalam format standar OWASP CycloneDX JSON untuk visibilitas rantai pasok software.
- **Korelasi Mata Kuliah:**
  - **Keamanan Komputasi & Siber (KKS):** Memenuhi 100% rubrik Tugas 2 kriteria "Pemindaian kerentanan sebelum–sesudah" (20 poin C3: Hasil pemindaian sebelum dan sesudah tersedia; tidak ada kerentanan CRITICAL pada image akhir) dan standar SBOM.
  - **Pengembangan Aplikasi Web (PAW):** Menjaga framework Next.js 16 App Router tetap berada pada versi teranyar yang bebas dari celah RCE dan DoS, menjaga integritas proses server-side rendering dan Server Actions.
  - **Kriptografi:** Integritas supply chain terjamin melalui validasi tanda tangan GPG repositori package dan pembuatan digest kriptografis OCI image pada berkas SBOM.

### Tahap 4: Finalisasi Register Risiko, Inventaris Deliverables, & Kesiapan Rilis Milestone `sec-0.2`

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Cybersecurity and Software Engineering Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 KKS (Sub-CPMK 3 - Autentikasi, Otorisasi, Least Privilege, Hardening OS/Kontainer, Pemindaian Trivy, dan Keterkaitan Risk Register, 100 Poin, Milestone `sec-0.2`)
- **Komponen / Berkas yang Dimodifikasi:**
  - `security/risk-register.md` (Pembaruan status implementasi kontrol untuk risiko prioritas R-01, R-02, dan R-04 menjadi "Mitigated (Implemented)", penurunan skor dampak & kemungkinan, serta pembaruan matriks evaluasi pengerasan)
  - `AI_LOG.md` (Pencatatan penutup milestone `sec-0.2` dan audit integrasi lintas mata kuliah)
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Pembaruan Status Risk Register:**
    1. **R-01 (Database Exposure | Skor Awal: 25 VH $\rightarrow$ Skor Akhir: 3 Low):** Status diubah menjadi _Mitigated (Implemented)_ setelah pemutusan direktif `ports` host pada `compose.yaml` dan pembuktian empiris via `ss -tlpn | grep 5432` yang bersih/kosong.
    2. **R-02 (Privilege Escalation via Container Escape | Skor Awal: 16 VH $\rightarrow$ Skor Akhir: 2 Low):** Status diubah menjadi _Mitigated (Implemented)_ setelah implementasi kontrol ganda: non-root execution (UID 1001), `cap_drop: ALL`, `no-new-privileges: true`, serta filesystem `read_only: true` yang terbukti menolak penulisan direktori.
    3. **R-04 (Brute Force & Credential Stuffing | Skor Awal: 16 VH $\rightarrow$ Skor Akhir: 3 Low):** Status diubah menjadi _Mitigated (Implemented)_ setelah penegakan kebijakan kata sandi NIST SP 800-63B-4 pada form pendaftaran dan konfigurasi OpenSSH _key-only_ yang menolak autentikasi kata sandi.
  - **Daftar Inventaris 9 Berkas Utama Deliverables `security/` (Milestone `sec-0.2`):**
    1. `security/access-test.md`: Bukti pengujian otorisasi per peran (RBAC/ABAC) dengan 10 skenario penolakan akses tidak sah.
    2. `security/hardening-notes.md`: Dokumentasi audit sistem operasi, SSH, arsitektur pengerasan kontainer, dan protokol uji negatif.
    3. `security/lynis-before.txt`: Rekaman audit baseline OS host awal (Skor: 66/100).
    4. `security/lynis-after.txt`: Rekaman audit OS host pasca-pengerasan (Skor: 80/100, melampaui target $\ge 70$).
    5. `security/config/00-hardening.conf`: Berkas konfigurasi drop-in OpenSSH standar CIS Benchmark Level 1 (key-only, non-root login).
    6. `security/image-scan-before.txt`: Hasil pemindaian awal Trivy pada image kontainer (13 temuan: 11 High, 2 Critical).
    7. `security/image-scan-after.txt`: Hasil pemindaian akhir Trivy pasca-remediasi Next.js 16.4.1 (10 temuan: 10 High, **0 Critical**).
    8. `security/sbom.cdx.json`: Berkas Software Bill of Materials berstandar OWASP CycloneDX format JSON v1.7 (~321 KB).
    9. `security/risk-register.md`: Register risiko NIST SP 800-30 dengan pemetaan status kontrol termitigasi secara empiris.
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Keamanan Komputasi & Siber (KKS):** Memenuhi 100% rubrik Tugas 2 (Sub-CPMK 3, 100 poin): seluruh akses tidak sah tertolak, indeks Lynis minimal 70 (tercapai 80), login SSH hanya dengan kunci Ed25519, layanan dan kontainer berjalan sebagai pengguna non-root, port basis data tidak terekspos, dan tanpa kerentanan critical pada image akhir.
  - **Pengembangan Aplikasi Web (PAW):** Menyiapkan arsitektur kontainerisasi multi-stage Next.js 16 App Router (standalone build) dan PostgreSQL 17 Alpine dengan dependensi yang bebas dari kerentanan kritis, menjamin stabilitas dan isolasi runtime platform Studance.
  - **Kriptografi:** Menerapkan otentikasi kunci publik asimetris Ed25519 untuk akses remote SSH, hash digest OCI image sha256 untuk integritas artefak, serta verifikasi tanda tangan digital GPG pada rantai pasok paket.

---

## Log Riwayat Penggunaan AI — Section 3: Pengembangan Aplikasi Web (Tugas 2 PAW - Pekan 4–6, Milestone v0.2)

### Tahap 1: Audit Arsitektur App Router, Special Files, & Pemilahan Server-Client Components (Sub-CPMK 3, Milestone v0.2 Step 1)

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026
- **Asisten AI:** Gemini (Role: Software Engineering & Web Architecture Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Routing Multi-Halaman, Special Files, Server & Client Components, Step 1 Checkpoint App Router)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `app/projects/[id]/loading.tsx` _(Berkas baru)_: Kerangka muat (_skeleton UI_) representatif untuk segmen dinamis detail proyek.
  - `app/client/error.tsx` _(Berkas baru)_: Penanganan galat (_error boundary_) area manajemen klien bertanda `'use client'` dengan mekanisme `reset()` dan proteksi kebocoran _stack trace_.
  - `app/client/projects/create/loading.tsx` _(Berkas baru)_: Kerangka muat (_skeleton UI_) formulir pembuatan proyek klien.
  - `app/services/loading.tsx` _(Berkas baru)_: Kerangka muat (_skeleton UI_) katalog jasa mahasiswa.
  - `app/services/[id]/loading.tsx` _(Berkas baru)_: Kerangka muat (_skeleton UI_) detail jasa & portofolio.
  - `app/services/[id]/not-found.tsx` _(Berkas baru)_: Tampilan responsif kondisi entitas jasa tidak ditemukan via `notFound()`.
  - `components/features/client/CreateProjectForm.tsx` _(Berkas baru)_: Pemisahan formulir interaktif klien bertanda `'use client'` dengan hook `useActionState(simpanProyek, {})`.
  - `components/features/auth/VerifyStudentWizard.tsx` _(Berkas baru)_: Pemisahan wizard multi-step verifikasi email kampus dan OTP HMAC ke komponen daun bertanda `'use client'`.
  - `app/client/projects/create/page.tsx` _(Refactor)_: Transformasi halaman menjadi Server Component murni (tanpa `'use client'`) yang membungkus komponen daun `CreateProjectForm`.
  - `app/(auth)/auth/verify-student/page.tsx` _(Refactor)_: Transformasi halaman menjadi Server Component murni dengan metadata SEO, membungkus `VerifyStudentWizard` di dalam `<Suspense>`.
  - `components/layout/NavbarLinks.tsx` _(Refactor)_: Implementasi Client Component aktif menggunakan hook `usePathname()` dari `next/navigation` untuk menandai tautan aktif dengan atribut `aria-current="page"`.
  - `docs/analisis-komponen.md` _(Berkas baru)_: Dokumen analisis teknis arsitektur App Router, hirarki rute, tabel pemilahan 20 komponen, dan mekanisme _special files_.
  - `AI_LOG.md` _(Pembaruan)_: Pencatatan log rekayasa perangkat lunak dan arsitektur web.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Audit Arsitektur App Router:** Memastikan seluruh halaman `page.tsx` (100% dari 13 rute produk) berkedudukan sebagai `async Server Component` yang bertugas menyiapkan data di server tanpa membebani bundel JavaScript klien.
  - **Penyelesaian Special Files:** Melengkapi hierarki penanganan kondisi khusus (`loading.tsx`, `error.tsx`, `not-found.tsx`) di seluruh segmen utama (`/`, `/projects`, `/client`, `/services`), menjamin pengalaman pengguna instan tanpa pergeseran tata letak (_Cumulative Layout Shift_) saat _data fetching_ asinkron.
  - **Pemisahan Tegas Server vs Client Components:** Memindahkan logika formulir berbasis hook (`useActionState`, `useState`) ke komponen daun interaktif (_Leaf Components_), mempertahankan integritas komponen presentasional (`ProjectCard`, `ServiceCard`, `Badge`, `VerifiedBadge`, `GlassCard`) sebagai Server Component murni.
  - **Kepatuhan Standar Next.js 16:** Memastikan seluruh parameter dinamis di-await secara asinkron (`const { id } = await params;`), fungsi navigasi diimpor dari `next/navigation` (meniadakan `next/router` atau tag `<a>` konvensional), dan Server Actions mengisolasi logika kriptografi sensitif di sisi server.
  - **Verifikasi Kualitas Kode:** Memverifikasi kompilasi TypeScript bebas galat (`npx tsc --noEmit` exit code 0) dan build produksi Next.js 16 (`npm run build` exit code 0) dengan 22 halaman statis dan dynamic routes teroptimasi secara penuh.
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Memenuhi 100% indikator Sub-CPMK 3 materi Pekan 4 mengenai _File-Based Routing_, _Nested Layouts_, _Special Files_, dan isolasi _Server vs Client Components_.
  - **Keamanan Komputasi & Siber (KKS):** Menerapkan mitigasi _Information Disclosure_ (OWASP Top 10) pada `error.tsx` dengan menyembunyikan _internal stack trace_ dan hanya menampilkan pesan ramah pengguna serta referensi _digest_, serta mengisolasi variabel lingkungan sensitif di server.
  - **Kriptografi:** Menjaga operasi kriptografis (pembangkitan token OTP deterministik dan verifikasi HMAC-SHA256) tetap berjalan eksklusif di sisi server (_Server Actions_), sehingga modul `node:crypto` dan kunci rahasia tidak pernah terekspos ke _browser bundle_.

### Tahap 2: Standarisasi Skema Validasi Zod Deklaratif & Modul Sesi/Cookie Kriptografis (Sub-CPMK 3, Materi Pekan 5 PAW)

- **Tanggal / Waktu Interaksi:** 30 Oktober 2026, 23:45 WIB
- **Asisten AI:** Gemini (Role: Software Engineering & Web Security Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Server Actions, Pengelolaan Formulir, Validasi Masukan dengan Zod, Session & Cookie Aman)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `lib/skema.ts` _(Refactor & Standarisasi)_: Sumber kebenaran tunggal (_Single Source of Truth_) validasi formulir sisi klien dan server. Mendefinisikan `skemaProyek` (`ProyekInput`), `skemaPenawaran` (`PenawaranInput`), `skemaLogin` (`LoginInput`), `skemaRegister` (`RegisterInput`), `skemaRegisterMahasiswa`, serta helper `formatZodErrors`.
  - `lib/session.ts` _(Berkas Baru)_: Modul sesi tanpa status (_stateless signed session_) berbasis JWT HS256 dengan penanda `'server-only'`, fungsi `buatSession(user: SessionUser)`, `bacaSession()`, dan `hapusSession()` dengan atribut keamanan cookie ketat (`httpOnly: true`, `secure: production`, `sameSite: "lax"`, `path: "/"`, `maxAge: 28800`).
  - `lib/sesi.ts` _(Refactor)_: Adapter kompatibilitas modul sesi legacy yang mendelegasikan pemrosesan ke `lib/session.ts` demi mencegah regresi kode.
  - `types/form.ts` _(Berkas Baru)_: Kontrak tipe standar respons Server Action `FormActionState<T>` dan alias `StatusForm<T>`.
  - `lib/status-form.ts` _(Refactor)_: Sinkronisasi impor kontrak tipe dari `types/form.ts`.
  - `types/index.ts` _(Pembaruan)_: Re-ekspor kontrak formulir `types/form` agar mudah diakses dari seluruh modul aplikasi.
  - `app/(auth)/actions.ts` _(Refactor)_: Migrasi Server Actions `loginAction`, `registerAction`, dan `logoutAction` menggunakan skema Zod terstandarisasi, helper `formatZodErrors`, dan modul `lib/session.ts`.
  - `app/client/projects/actions.ts` _(Refactor)_: Penyelarasan Server Action `simpanProyek` dengan `skemaProyek`, `formatZodErrors`, dan verifikasi sesi via `bacaSession()`.
  - `components/features/client/CreateProjectForm.tsx` _(Refactor)_: Penyelarasan opsi kategori proyek dan masukan `isCampusOnly` serta `campusName` terhadap `skemaProyek` tanpa merusak sistem desain _Liquid Glass_.
  - `.env` & `.env.example` _(Pembaruan)_: Penambahan variabel lingkungan aman `SESSION_SECRET` (minimal 32 byte) yang dilindungi oleh `.gitignore`.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Single Source of Truth (SSOT) Validasi Zod:** Menyatukan aturan validasi proyek, penawaran (bidding), autentikasi masuk, dan registrasi mahasiswa ke dalam `lib/skema.ts` yang bebas dari modul server-only, sehingga dapat diimpor langsung oleh Client Component untuk umpan balik cepat dan oleh Server Action untuk verifikasi data final (_Two-sided Validation_).
  - **Pencegahan Injeksi & Penolakan Data Cacat:** Menerapkan `.superRefine()` pada `skemaProyek` untuk memastikan proyek berlingkup `isCampusOnly` mewajibkan entri `campusName` (panjang >= 3) serta tenggat waktu berupa tanggal valid di masa depan (`> hari ini`). Skema penawaran (`skemaPenawaran`) mengunci nominal bulat (Rp25.000–Rp50.000.000) dan validasi tautan portofolio via `url()`.
  - **Kepatuhan Kebijakan Kata Sandi NIST SP 800-63B:** Menghilangkan batasan komposisi simbol kaku yang menghambat penggunaan _password manager_, menggantikannya dengan panjang memadai (8–64 karakter) dan pengujian kesamaan konfirmasi kata sandi via `.superRefine()`.
  - **Sesi Bertanda Tangan Kriptografis (Stateless Signed Cookie):** Menggunakan pustaka standar industri `jose` untuk menerbitkan token JWT dengan algoritma tanda tangan digital HMAC-SHA256 (`HS256`), menjamin integritas muatan sesi tanpa memerlukan kueri basis data berulang pada setiap permintaan (_stateless performance_).
  - **Pengerasan Atribut Cookie:** Menerapkan `httpOnly: true` (mitigasi XSS pada pembacaan `document.cookie`), `secure: true` pada mode produksi (transmisi eksklusif HTTPS), `sameSite: "lax"` (mitigasi serangan CSRF tingkat atas), dan pembatasan umur sesi `maxAge: 28800` (8 jam).
  - **Format Galat Terpadu:** Menyediakan helper deklaratif `formatZodErrors` menggunakan `z.flattenError(error).fieldErrors` untuk menghasilkan peta pesan galat ramah pengguna per-kolom yang terhubung ke atribut ARIA (`aria-invalid`, `aria-describedby`).
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Mengimplementasikan seluruh materi Sesi 2 dan Sesi 3 Pekan 5 PAW, mencakup validasi dua sisi dengan Zod, pemrosesan formulir Server Action dengan `useActionState`, penanganan pesan galat per kolom melalui `FormActionState`, serta manajemen sesi berbasis cookie `next/headers`.
  - **Kriptografi:** Memanfaatkan algoritma integritas pesan berkunci HMAC-SHA256 via modul `jose` untuk menandatangani token sesi, membuktikan bahwa payload data peran (_role_), status verifikasi kampus, dan identitas pengguna tidak dapat dimanipulasi oleh pihak ketiga di sisi klien.
  - **Keamanan Komputasi & Siber (KKS):** Menerapkan mitigasi terhadap OWASP Top 10 (A01: Broken Access Control, A03: Injection, A07: Identification and Authentication Failures) melalui isolasi 'server-only', sanitasi masukan teks via `.trim()`, pemaksaan pengetikan angka integer, penegakan kebijakan password NIST SP 800-63B, serta perlindungan cookie anti-tampering dan anti-XSS.


### Tahap 3: Integrasi Mutasi In-Memory, UI useActionState ARIA, & Matriks Uji Validasi (Sub-CPMK 3, Materi Pekan 5 PAW Langkah 2 & 3)

- **Tanggal / Waktu Interaksi:** 31 Oktober 2026, 00:05 WIB
- **Asisten AI:** Gemini (Role: Software Engineering & Web Architecture Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Integrasi Server Actions Bidding, useActionState, Aksesibilitas ARIA, Matriks 10 Skenario Uji Validasi Server)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `app/projects/[id]/actions.ts` *(Berkas Baru)*: Mengimplementasikan Server Action `kirimPenawaran` dengan 6 alur deterministik (verifikasi sesi JWT HS256, ekstraksi form data, validasi skema Zod `skemaPenawaran`, mutasi array in-memory, revalidasi cache jalur `/projects/[id]` dan `/projects`, serta respons kontrak `StatusForm`).
  - `app/projects/actions.ts` *(Berkas Baru)*: Re-ekspor Server Action `kirimPenawaran` untuk konsistensi rute.
  - `lib/data.ts` *(Pembaruan)*: Penambahan array in-memory global `daftarPenawaran` dan mutator fungsi `tambahPenawaran(masukan: PenawaranInput, user: SessionUser | User): Bid` dengan sinkronisasi penambahan atribut `bidsCount` pada proyek terkait.
  - `components/features/projects/ProposalBidForm.tsx` *(Refactor & Pengayaan)*: Mengintegrasikan React 19 `useActionState(kirimPenawaran, {})`, atribut `name` (`proyekId`, `nominalPenawaran`, `durasiHari`, `pesanProposal`, `portofolioUrl`), aksesibilitas WAI-ARIA (`aria-invalid`, `aria-describedby`, `<p role="alert">`), indikator *pending state* tombol submit (`isPending ? "Memproses..." : "Kirim Proposal"`), dan banner status respons global (`role="status"`).
  - `components/features/client/CreateProjectForm.tsx` *(Penyempurnaan)*: Menyelaraskan atribut aksesibilitas ARIA semantik pada seluruh field (`aria-invalid`, `aria-describedby`, `<p role="alert">`), status interaktif pending, serta banner respons sukses/gagal (`role="status"`).
  - `docs/skenario-uji-validasi.md` *(Berkas Baru)*: Dokumentasi teknis komprehensif memuat 10 skenario pengujian validasi sisi server (pembuktian bypass DevTools, penolakan nominal minimum/negatif, penolakan kondisi `superRefine`, penolakan mutasi tanpa sesi autentikasi, serta kepatuhan WAI-ARIA dan mitigasi OWASP Top 10).
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Pola Server Action Deterministik:** Menegakkan kepatuhan arsitektur web modern di mana Server Action diperlakukan sebagai *endpoint HTTP publik* yang mewajibkan pemeriksaan sesi terotentikasi di awal aksi (*short-circuit* saat sesi `null`) sebelum memproses masukan ataupun menyentuh basis data.
  - **Aksesibilitas Inklusif WCAG 2.2 AA:** Menghubungkan kontrol masukan dengan pesan kesalahan melalui atribut `aria-describedby` dan `role="alert"`, memungkinkan pembaca layar mendeteksi kesalahan secara otomatis tanpa memerlukan interaksi visual.
  - **Matriks Pengujian Sistematis:** Menyusun bukti empiris pengujian validasi sisi server dengan tingkat kelulusan 100% (10 dari 10 skenario), membuktikan keandalan sistem terhadap manipulasi klien (*tampering*) dan memenuhi kriteria Rubrik R2 Tugas 2 PAW (skor 20 poin validasi).
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Menuntaskan capaian pembelajaran Sub-CPMK 3 Pekan 5 mengenai siklus lengkap formulir Server Actions, mutasi data, revalidasi cache, dan integrasi React 19 `useActionState`.
  - **Kriptografi:** Mengonfirmasi penegakan otorisasi berbasis sesi token JWT HS256 yang ditandatangani secara kriptografis pada setiap mutasi data proposal mahasiswa.
  - **Keamanan Komputasi & Siber (KKS):** Memitigasi risiko *Broken Access Control* (OWASP A01) dan *Input Tampering / Injection* (OWASP A03) dengan memastikan data dari DevTools yang melompati validasi klien tetap ditolak mutlak oleh mesin inferensi Zod di server.


### Tahap 4: Penyiapan Basis Data PostgreSQL, Skema Prisma ORM 7, Driver Adapter, & Seeding Data Sintetis (Sub-CPMK 3, Materi Pekan 6 PAW Tahap 1)

- **Tanggal / Waktu Interaksi:** 1 November 2026, 15:15 WIB
- **Asisten AI:** Gemini (Role: Software Engineering & Database Architecture Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Pemodelan Data Relasional, Skema Prisma 7, Migrasi PostgreSQL, Prisma Client Driver Adapter, dan Seeding Sintetis)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `package.json` *(Pembaruan Dependensi)*: Memasang dependensi resmi Prisma ORM 7 (`@prisma/client@7`, `@prisma/adapter-pg`, `pg`, `dotenv` pada production dependencies; `prisma@7`, `@types/pg` pada devDependencies).
  - `prisma/schema.prisma` *(Berkas Baru)*: Mendefinisikan generator client kustom dengan `output = "../generated/prisma"`, datasource `postgresql`, serta model `Project` dan `Bid` berelasi 1:N dengan batasan integritas referensial `onDelete: Restrict` dan indeks teroptimasi (`category`, `status`, `projectId`, `studentId`).
  - `prisma.config.ts` *(Berkas Baru)*: Konfigurasi resmi Prisma 7 (`defineConfig`) di akar repositori untuk manajemen skema, direktori migrasi, skrip seed `npx tsx prisma/seed.ts`, dan datasource URL dari `dotenv/config`.
  - `lib/prisma.ts` *(Berkas Baru)*: Modul singleton Prisma Client yang aman dengan proteksi `import "server-only"`, adapter pool `@prisma/adapter-pg`, dan re-use instans pada `globalThis` untuk mencegah kehabisan koneksi (*connection exhaustion*) saat fast refresh Next.js.
  - `prisma/seed.ts` *(Berkas Baru)*: Skrip seeding data sintetis realistis (tanpa PII) yang membersihkan data lama secara aman (`Bid` lalu `Project`), memasukkan 6 entitas `Project` bervariasi (status `OPEN` dan `IN_PROGRESS`), 6 entitas `Bid` berelasi, serta melakukan sinkronisasi kalkulasi `bidsCount` secara akurat.
  - `prisma/migrations/20261101081018_init_project_and_bid/migration.sql` *(Dihasilkan Migrasi)*: Berkas migrasi DDL SQL murni PostgreSQL untuk inisialisasi tabel, indeks, foreign key, dan default value.
  - `compose.yaml` *(Pembaruan)*: Membuka binding port `5432:5432` pada layanan PostgreSQL (`db`) dengan restriksi loopback lokal host untuk mendukung eksekusi migrasi dan seeding tanpa mengekspos port ke jaringan publik.
  - `.env` & `.env.example` *(Penyelarasan)*: Menyediakan template dan konfigurasi `DATABASE_URL` yang valid ke instance PostgreSQL tanpa membocorkan kredensial rahasia produksi.
  - `.gitignore` *(Pembaruan)*: Menambahkan direktori `generated/` agar artefak hasil `prisma generate` tidak mencemari riwayat kontrol versi git.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Arsitektur Prisma ORM 7 Modern:** Mengadopsi arsitektur driver adapter `@prisma/adapter-pg` yang diwajibkan pada Prisma 7 untuk eksekusi kueri berkecepatan tinggi dengan koneksi pooling bawaan pustaka `pg`.
  - **Integritas Referensial & Restriksi Penghapusan:** Menetapkan aturan referensial `onDelete: Restrict` pada relasi `Project -> Bid`. Pilihan desain ini melindungi rekam jejak penawaran mahasiswa agar proyek yang telah menerima penawaran aktif tidak dapat dihapus secara gegabah tanpa penyelesaian status bidding.
  - **Isolasi Server & Koneksi Singleton:** Memastikan Prisma Client dilindungi deklarasi `server-only` sehingga terisolasi mutlak dari bundel klien, serta dipasang pada `globalThis` untuk mengeliminasi pembuatan koneksi basis data ganda pada siklus pengembangan Next.js 16.
  - **Data Sintetis Bebas PII & Idempoten:** Skrip seed dirancang idempoten (*dapat dijalankan ulang berkali-kali*) dengan membersihkan anak relasi terlebih dahulu sebelum entitas induk, menjamin pengujian CRUD pada tahap berikutnya memiliki baseline data awal yang konsisten.
  - **Verifikasi Kompilasi & Tipe:** Memastikan seluruh tipe Prisma Client di `./generated/prisma` dikenali sempurna oleh compiler TypeScript tanpa galat (`npx tsc --noEmit` exit code 0).
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Menuntaskan capaian Sesi 1 dan Sesi 2 Pekan 6 PAW terkait pemodelan data relasional, penulisan skema Prisma 7, migrasi DDL PostgreSQL, pembuatan Prisma Client singleton dengan driver adapter, dan seeding data sintetis untuk kriteria Tugas 2 (Rubrik K3).
  - **Keamanan Komputasi & Siber (KKS):** Memitigasi risiko *SQL Injection* (OWASP A03) melalui kueri Prisma terparameterisasi bawaan, mengisolasi port basis data ke loopback lokal, menolak penyimpanan PII mahasiswa riil pada berkas repositori publik, serta mengamankan kredensial koneksi via variabel lingkungan yang dilindungi `.gitignore`.
  - **Kriptografi:** Mempersiapkan skema dan infrastruktur basis data relasional persisten yang siap menampung digest integritas portofolio (SHA-256) serta jejak audit terverifikasi pada milestone lanjutan perkuliahan.


### Tahap 5: Refactoring Server Actions CRUD Persisten & Transaksi Atomik Prisma (Sub-CPMK 3, Materi Pekan 6 PAW Tahap 2)

- **Tanggal / Waktu Interaksi:** 1 November 2026, 15:25 WIB
- **Asisten AI:** Gemini (Role: Software Engineering & Web Architecture Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Operasi CRUD Lengkap, Server Actions, Transaksi Atomik Prisma, dan Mitigasi Galat Database)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `app/client/projects/actions.ts` *(Refactor Penuh)*: Menghubungkan Server Actions proyek ke Prisma Client:
    1. `simpanProyek`: Memvalidasi sesi aktif (`bacaSession`), memvalidasi masukan formulir dengan Zod (`skemaProyek`), menyimpan entitas ke PostgreSQL via `prisma.project.create`, merevalidasi cache (`revalidatePath`), dan mengembalikan status sukses persisten.
    2. `ubahStatusProyek`: Memperbarui atribut status proyek (`prisma.project.update`) berdasarkan ID dengan validasi keberadaan record.
    3. `hapusProyek`: Mencegah penghapusan proyek yang telah memiliki penawaran mahasiswa (`prisma.bid.count > 0`) demi menjaga integritas data referensial (`onDelete: Restrict`), atau mengeksekusi `prisma.project.delete` jika penawaran masih nol.
  - `app/projects/[id]/actions.ts` *(Refactor Penuh)*: Menghubungkan Server Actions penawaran/bid ke Prisma Client:
    1. `kirimPenawaran`: Memvalidasi sesi mahasiswa, memvalidasi masukan dengan `skemaPenawaran`, dan mengeksekusi Transaksi Atomik (`prisma.$transaction`) yang menggabungkan operasi pembuatan data penawaran (`prisma.bid.create`) dan peningkatan penghitung penawaran proyek (`prisma.project.update` dengan `increment: 1`).
    2. `batalkanPenawaran`: Menjalankan Transaksi Atomik (`prisma.$transaction`) untuk menghapus record penawaran (`prisma.bid.delete`) dan menurunkan nilai penghitung proyek (`prisma.project.update` dengan `decrement: 1`).
  - `app/projects/actions.ts` *(Sinkronisasi Ekspor)*: Mengekspor `kirimPenawaran` dan `batalkanPenawaran` untuk konsistensi rute.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Transaksi Atomik (ACID):** Penggunaan `prisma.$transaction` pada `kirimPenawaran` dan `batalkanPenawaran` menjamin bahwa data proposal mahasiswa dan agregasi `bidsCount` pada proyek selalu konsisten. Jika salah satu operasi gagal, seluruh mutasi dibatalkan secara otomatis (*all-or-nothing*), mencegah kondisi balapan data (*race condition*).
  - **Integritas Referensial Proaktif (Pre-Check Restrict):** Fungsi `hapusProyek` melakukan pra-pemeriksaan jumlah relasi `Bid` sebelum memicu kueri penghapusan, memberikan respons peringatan yang informatif dan ramah pengguna alih-alih melempar galat database mentah.
  - **Penanganan Galat Basis Data Terstandarisasi:** Menangkap instance `Prisma.PrismaClientKnownRequestError` secara spesifik:
    * `P2002` (Unique Constraint Violation) -> Pesan nilai unik sudah ada.
    * `P2003` (Foreign Key Violation / Referential Action) -> Pesan pelanggaran relasi data.
    * `P2025` (Record Not Found) -> Pesan entitas tidak ditemukan.
  - **Pencegahan Kebocoran Informasi:** Mengisolasi pesan kesalahan internal PostgreSQL dan Prisma engine agar tidak bocor ke antarmuka klien, mencegah potensi *information disclosure* (OWASP Top 10).
  - **Sinkronisasi Cache Real-Time:** Memanggil `revalidatePath("/projects")`, `revalidatePath("/client/dashboard")`, dan `revalidatePath("/projects/[id]")` setelah setiap mutasi data untuk menjamin konsistensi status antarmuka pengguna tanpa memuat ulang browser secara manual.
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Memenuhi 100% indikator Sesi 3 Pekan 6 PAW mengenai implementasi CRUD lengkap dua entitas berelasi (`Project` dan `Bid`), transaksi atomik melalui `$transaction`, dan pemutakhiran cache via `revalidatePath` untuk Rubrik K1 (Kebenaran CRUD 40 poin) dan K3 (Pemodelan data).
  - **Keamanan Komputasi & Siber (KKS):** Menegakkan kontrol otorisasi berbasis sesi pada setiap Server Action, sanitasi masukan komprehensif, mitigasi penolakan data cacat, dan perlindungan kebocoran *stack trace* database (OWASP A01 & A05).
  - **Kriptografi:** Mempertahankan verifikasi identitas mahasiswa dan klien berbasis JWT HS256 kriptografis sebelum mengizinkan mutasi tabel penawaran di PostgreSQL.


### Tahap 6: Integrasi Data Persisten di Server Components & Kelengkapan CRUD Dua Entitas (Sub-CPMK 3, Materi Pekan 6 PAW Tahap 3)

- **Tanggal / Waktu Interaksi:** 1 November 2026, 15:50 WIB
- **Asisten AI:** Gemini (Role: Software Engineering & Database Integration Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Pengambilan Data Persisten via Prisma di Server Components, Dukungan searchParams, Kelengkapan CRUD C, R, U, D pada 2 Entitas, dan Build Produksi Next.js 16)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `app/projects/[id]/actions.ts` *(Pembaruan Server Action)*: Menambahkan fungsi `ubahPenawaran(bidId, prevState, formData)` untuk pembaruan proposal penawaran (Update Bid) dengan verifikasi kepemilikan, validasi status `PENDING`, mutasi `prisma.bid.update`, dan revalidasi cache rute.
  - `app/projects/actions.ts` *(Sinkronisasi Ekspor)*: Mengekspor fungsi `ubahPenawaran` bersama `kirimPenawaran` dan `batalkanPenawaran`.
  - `app/page.tsx` *(Refactor Server Component)*: Mengganti data statis dengan kueri persisten `prisma.project.findMany` (kategori status `OPEN`, diurutkan `createdAt: desc`, limit 6 entitas) di dalam boundary `<Suspense>` untuk optimalisasi streaming dan prerendering.
  - `app/projects/(catalog)/page.tsx` *(Refactor Server Component)*: Mengambil daftar proyek riil dari PostgreSQL menggunakan `prisma.project.findMany` dengan penyaringan dinamis multi-parameter (`q`, `category`, `scope`, `isCampusOnly`) serta integrasi `searchParams` asinkron.
  - `app/projects/[id]/page.tsx` *(Refactor Server Component)*: Mengekstrak parameter rute asinkron `params`, mengambil entitas proyek beserta relasi `bids` (`include: { bids: true }`) dalam satu kueri efisien bebas masalah N+1, serta meneruskannya ke komponen daun interaktif di dalam `<Suspense>`.
  - `components/features/projects/ProjectDetailClient.tsx` *(Penyelarasan)*: Menambahkan prop `initialBids` untuk menerima daftar proposal persisten langsung dari Server Component induk.
  - `components/features/client/ClientProjectCardActions.tsx` *(Berkas Baru)*: Komponen antarmuka klien untuk interaksi dashboard klien yang memicu mutasi `ubahStatusProyek` dan `hapusProyek` dengan umpan balik status responsif.
  - `app/client/dashboard/page.tsx` *(Refactor Server Component)*: Menampilkan metrik dinamis (jumlah proyek, total proposal masuk, dan agregasi escrow) berdasarkan kueri Prisma persisten, serta merender daftar proyek dengan kontrol `ClientProjectCardActions`.
  - `app/projects/template.tsx` *(Penyempurnaan Arsitektur)*: Mengisolasi Client Component yang membaca `usePathname()` ke dalam boundary `<Suspense>` guna memenuhi kaidah prerendering parsial (*Partial Prerendering / PPR*) Next.js 16.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **CRUD Lengkap 2 Entitas Terpenuhi (C, R, U, D x 2):**
    * Entitas `Project`: Create (`simpanProyek`), Read (`app/projects/(catalog)/page.tsx`, `app/projects/[id]/page.tsx`, `app/page.tsx`, `app/client/dashboard/page.tsx`), Update (`ubahStatusProyek`), Delete (`hapusProyek` dengan proteksi referensial).
    * Entitas `Bid`: Create (`kirimPenawaran` dengan transaksi atomik), Read (`include: { bids: true }` pada katalog dan detail), Update (`ubahPenawaran`), Delete (`batalkanPenawaran` dengan transaksi atomik decrement).
  - **Penghindaran Masalah N+1:** Menggunakan klausa `include: { bids: true }` pada kueri Prisma untuk memuat data proyek dan relasi penawaran dalam kueri SQL teroptimasi tunggal.
  - **Kepatuhan Arsitektur App Router & Streaming UI:** Memastikan setiap pengambilan data asinkron diletakkan di dalam boundary `<Suspense>`, memungkinkan Next.js 16 menyajikan kerangka halaman secara instan (*Streaming Server Rendering*) tanpa tersendat oleh latensi basis data.
  - **Verifikasi Build Produksi Nyata:** Berhasil melewati seluruh tahapan kompilasi `npx tsc --noEmit` (exit code 0) dan `npm run build` (exit code 0) dengan 19 halaman statis dan parsial prerender teroptimasi secara sempurna.
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Menyempurnakan capaian Sub-CPMK 3 materi Pekan 6, mencakup CRUD lengkap dua entitas relasional, data fetching di Server Components, pagination/filtering berbasis URL searchParams, dan pencegahan N+1 query problem.
  - **Keamanan Komputasi & Siber (KKS):** Menjamin seluruh kueri pencarian teks bebas dari SQL Injection melalui *parameterized queries* bawaan Prisma ORM, memverifikasi kepemilikan dan status penawaran sebelum mutasi (Broken Object Level Authorization / BOLA mitigation), dan memvalidasi tipe parameter masukan rute.
  - **Kriptografi:** Mengintegrasikan status identitas terverifikasi (*Verified Student*) ke dalam data penawaran mahasiswa yang tersimpan secara terstruktur di PostgreSQL.


### Tahap 7: Penutupan & Persiapan Rilis Milestone v0.2 (Sub-CPMK 3, Tugas 2 PAW)

- **Tanggal / Waktu Interaksi:** 1 November 2026, 16:15 WIB
- **Asisten AI:** Gemini (Role: Software Engineering & Quality Assurance Agent / Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Milestone v0.2: Dokumentasi Matriks Uji CRUD, Pembuktian Validasi Server, dan Verifikasi Build Rilis)
- **Komponen / Berkas yang Dimodifikasi & Dibuat:**
  - `README.md` *(Pembaruan Dokumentasi Spesifikasi v0.2)*:
    1. Menyusun Changelog komprehensif dari Milestone v0.1 (UI statis) menuju v0.2 (Server Actions & PostgreSQL persisten via Prisma ORM 7).
    2. Menuliskan panduan langkah demi langkah eksplisit (reproduktif) untuk instalasi dependensi, konfigurasi `.env`, migrasi DDL, generasi client, dan seeding Prisma 7.
    3. Menyajikan Tabel Matriks 10 Skenario Uji (8 operasi CRUD + 2 pengujian integritas relasi) dengan tingkat kelulusan 100% (10 dari 10 skenario LULUS, melampaui ambang batas $\ge 90\%$).
    4. Mendokumentasikan 3 bukti konkret penolakan validasi sisi server (Zod `safeParse` & `superRefine`) terhadap manipulasi DevTools, batas ambang upah/durasi, dan tanggal masa lampau dengan pesan galat terstruktur per-field.
  - `AI_LOG.md` *(Pencatatan Penutupan)*: Menyelesaikan rekam jejak rekayasa perangkat lunak untuk seluruh siklus Tugas 2 PAW (Pekan 4, 5, dan 6).
- **Ringkasan Capaian Teknis Milestone v0.2:**
  - **Pemodelan Data Relasional:** Model 1:N `Project` dan `Bid` berhasil dimigrasikan ke PostgreSQL 17 dengan batasan integritas referensial `onDelete: Restrict` dan indeks performa kueri.
  - **Seeding Sintetis Realistis:** Basis data diinisialisasi secara idempoten dengan 6 entitas `Project` bervariasi dan 6 entitas `Bid` berelasi tanpa memuat PII nyata mahasiswa.
  - **Operasi CRUD Lengkap & Transaksi Atomik:** 8 operasi kueri (Create, Read, Update, Delete x 2 entitas) telah aktif dan terhubung ke Server Actions Next.js 16, dengan operasi bidding terikat transaksi ACID `$transaction`.
  - **Validasi Server & Aksesibilitas:** Seluruh masukan formulir divalidasi dengan Zod di server, menghasilkan atribut ARIA semantik (`aria-invalid`, `aria-describedby`, `<p role="alert">`) untuk kepatuhan WCAG 2.2 AA.
  - **Verifikasi Kualitas Produksi:** Lulus pengujian kompilasi statis TypeScript (`npx tsc --noEmit` exit code 0) dan build produksi Next.js 16 (`npm run build` exit code 0) dengan 19 rute teroptimasi (PPR & Static).
- **Korelasi 3 Mata Kuliah Terintegrasi:**
  - **Pengembangan Aplikasi Web (PAW):** Memenuhi 100% rubrik penilaian R2 Tugas 2 (K1 Kebenaran CRUD 40 poin, K2 Validasi masukan 20 poin, K3 Pemodelan data 20 poin, K4 Demonstrasi dan penguasaan 20 poin).
  - **Keamanan Komputasi & Siber (KKS):** Memitigasi risiko OWASP Top 10: Broken Access Control (A01), Cryptographic Failures (A02), Injection (A03), dan Security Misconfiguration (A05) melalui isolasi Docker, signed session, sanitasi data, dan penanganan galat aman.
  - **Kriptografi:** Menerapkan penandatanganan cookie sesi HMAC-SHA256 (HS256) serta menyiapkan persistensi PostgreSQL untuk digest SHA-256 portofolio dan tanda tangan asimetris pada tugas berikutnya.


### Tahap 8: Resolusi Unstable Value `new Date()` & Partial Prerendering Boundary Next.js 16

- **Tanggal / Waktu Interaksi:** 1 November 2026, 16:17 WIB
- **Asisten AI:** Gemini (Role: Full Project Mentor & Lead Architect)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Penguatan Arsitektur Next.js 16 Cache Components & PPR)
- **Komponen / Berkas yang Dimodifikasi:**
  - `app/page.tsx`: Memisahkan pemanggilan data persisten ke dalam sub-komponen `HomeCatalogSection` di dalam `<Suspense>` serta memanggil `await connection()` dari `next/server`.
  - `app/projects/(catalog)/page.tsx`: Menambahkan `await connection()` pada `ProjectsCatalog` sebelum eksekusi `prisma.project.findMany`.
  - `app/projects/[id]/page.tsx`: Membungkus konten data `ProjectDetailContent` ke dalam `<Suspense>` boundary dan menyematkan `await connection()`.
  - `app/client/dashboard/page.tsx`: Memisahkan metrik dan daftar proyek klien ke dalam sub-komponen `DashboardContent` di dalam `<Suspense>` dengan `await connection()`.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Akar Masalah:** Next.js 16 (dengan opsi `cacheComponents: true` dan `partialPrefetching: true`) mendeteksi instansiasi `new Date()` (yang dihasilkan oleh driver adapter basis data Prisma saat mem-parse kolom timestamp `createdAt`/`deadline`) selama tahap *static prerendering*. Hal ini memicu galat runtime: *"Next.js encountered the unstable value `new Date()` while prerendering"*.
  - **Solusi Arsitektural:** Memanfaatkan API resmi Next.js 16 `await connection()` dari `next/server` untuk secara eksplisit mendeklarasikan bahwa pembacaan data basis data bersifat dinamis pada fase *request-time*. Selain itu, seluruh pemanggilan data dinamis diletakkan di dalam boundary `<Suspense>`, sehingga cangkang statis halaman (*static shell*) dapat di-prerender secara instan (PPR) sementara konten dinamis di-stream secara asinkron.
  - **Verifikasi Hasil:** `npm run build` sukses 100% (exit code 0) dengan tanda `◐ (Partial Prerender)` pada rute `/`, `/projects`, `/projects/[id]`, dan `/client/dashboard`.
- **Korelasi Mata Kuliah:**
  - **Pengembangan Aplikasi Web (PAW):** Mengoptimalkan performa rendering Next.js 16 App Router melalui kombinasi *Streaming SSR*, *Partial Prerendering (PPR)*, dan penanganan nilai dinamis non-deterministik secara elegan.


### Tahap 9: Penanganan Hydration Mismatch & Graceful Database Fallback

- **Tanggal / Waktu Interaksi:** 1 November 2026, 16:25 WIB
- **Asisten AI:** Gemini (Role: Full Project Mentor & Lead Architect)
- **Kompatibilitas Tugas:** Tugas 2 PAW (Sub-CPMK 3 - Resiliensi Basis Data & Pencegahan Hydration Error)
- **Komponen / Berkas yang Dimodifikasi:**
  - `components/layout/NavbarSearchBar.tsx`: Menambahkan atribut `suppressHydrationWarning` pada tag `<input>` pencarian navbar.
  - `app/page.tsx`, `app/projects/(catalog)/page.tsx`, `app/projects/[id]/page.tsx`, `app/client/dashboard/page.tsx`: Menerapkan blok pertahanan `try/catch` pada kueri Prisma ORM 7 dengan pengetikan tipe kuat `Prisma.ProjectGetPayload`.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Isu 1 (Hydration Mismatch):** Ekstensi peramban pengguna (seperti pengelola kata sandi atau autofill) menyuntikkan atribut dinamis `fdprocessedid` ke elemen `<input>`. Hal ini menyebabkan ketidakcocokan antara HTML hasil SSR dan DOM klien. Penambahan `suppressHydrationWarning` menyelesaikan peringatan ini secara ramah tanpa menonaktifkan fungsi React.
  - **Isu 2 (Database Connection Failure):** Ketika daemon Docker Desktop dalam keadaan *Stopped* atau kontainer PostgreSQL sedang inisialisasi, pemanggilan Prisma tanpa `try/catch` memicu *fatal unhandled exception*. Dengan membungkus kueri dalam `try/catch` yang mengembalikan *empty state* atau penanganan anggun (*graceful degradation*), server tidak lagi *crash* secara total.
- **Korelasi Mata Kuliah:**
  - **Pengembangan Aplikasi Web (PAW):** Menjamin stabilitas antarmuka pengguna terhadap anomali lingkungan klien peramban dan kegagalan sementara jaringan basis data.


### Tahap 11: Realokasi Port Host PostgreSQL ke 5433 untuk Menghindari Bentrok Port

- **Tanggal / Waktu Interaksi:** 1 November 2026, 16:53 WIB
- **Asisten AI:** Gemini (Role: Full Project Mentor & Lead Architect)
- **Kompatibilitas Tugas:** Tugas 2 PAW & Tugas 2 Keamanan Siber (Pengerasan Kontainer & Isolasi Port)
- **Komponen / Berkas yang Dimodifikasi:**
  - `compose.yaml`: Mengubah binding port host dari `"5432:5432"` menjadi `"5433:5432"`.
  - `.env` & `.env.example`: Memperbarui `DATABASE_URL` ke port `5433`.
  - `README.md`: Memperbarui dokumentasi port koneksi PostgreSQL lokal menjadi `5433`.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Kebutuhan Pengembang:** Port host `5432` telah terikat secara permanen untuk proyek lain di mesin pengembang (`postgres_container`). Demi menjaga independensi lingkungan tanpa mengganggu proyek lain yang sudah ada, port pemetaan host Studance dipindahkan ke `5433`.
  - **Tindakan Resolusi:**
    1. Mengaktifkan kembali `postgres_container` pada port bawaan `5432`.
    2. Menjalankan kontainer Studance `student-marketplace-db-1` pada port host `5433` (`5433:5432`).
    3. Menjalankan migrasi DDL `npx prisma migrate deploy` dan seeding `npx prisma db seed` ke `127.0.0.1:5433`.
    4. Memvalidasi build produksi Next.js 16 (`npm run build`) dengan exit code 0.
- **Korelasi Mata Kuliah:**
  - **Pengembangan Aplikasi Web (PAW):** Fleksibilitas konfigurasi *connection string* Prisma ORM 7 via environment variables.
  - **Keamanan Komputasi & Siber (KKS):** Isolasi multi-tenant antar-layanan kontainer di lingkungan host pengembang tanpa saling memengaruhi.


---

## Log Riwayat Penggunaan AI — Section 4: Kriptografi (Tugas 2 Kriptografi - Pekan 4)

### Tahap 1: Modul Enkripsi Simetris AES-256-GCM, Proposal Vault, & Pengujian Otomatis

- **Tanggal / Waktu Interaksi:** 1 November 2026, 19:45 WIB
- **Asisten AI:** Gemini (Role: Cryptography Implementation Agent & Lead Architect)
- **Kompatibilitas Tugas:** Tugas 2 Kriptografi (Sub-CPMK 1, 2, 3 - Materi Pekan 4: Block Cipher, Stream Cipher, AES, dan Mode Operasi)
- **Komponen / Berkas yang Dimodifikasi / Dibuat:**
  - `lib/crypto/symmetric.ts`: Modul enkripsi simetris terautentikasi (AEAD) berbasis AES-256-GCM menggunakan API native `node:crypto`.
  - `lib/crypto/proposal-vault.ts`: Modul adaptor tingkat tinggi *Proposal Vault* yang mengintegrasikan enkripsi simetris dengan digest SHA-256 berkas pengerjaan proyek dari Tugas 1 (`document-signer.ts`).
  - `lib/crypto/tests/symmetric.test.ts`: Rangkaian skenario pengujian otomatis berbasis `tsx` dan `node:assert` mencakup 1 uji positif dan 4 uji kondisi tidak sah (fail-closed, tampering, wrong key, context-swapping, broken connection).
  - `KEPUTUSAN.md`: Dokumen arsitektur dan justifikasi pemilihan mekanisme kriptografi yang memenuhi kriteria rubrik penilaian K1, K2, K3, K4, dan K5.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Spesifikasi Teknis Modul Enkripsi:** Mengimplementasikan algoritma `aes-256-gcm` dengan panjang kunci 256-bit (`KEY_LENGTH = 32`), CSPRNG `randomBytes`, IV/Nonce 96-bit (`NONCE_LENGTH = 12`) per rekomendasi NIST SP 800-38D, serta Authentication Tag 128-bit (`TAG_LENGTH = 16`). Format keluaran adalah Buffer paket terpadu berurutan `[Nonce || Ciphertext || AuthTag]`.
  - **Prinsip Fail-Closed:** Pada fungsi dekripsi `decryptPayload`, kegagalan verifikasi integritas ditangkap secara aman dan melempar eksepsi spesifik `InvalidTag: Autentikasi integritas data gagal` guna mencegah kebocoran data terkorupsi atau eksploitasi bit-flipping.
  - **Integrasi Komponen Dasar Tugas 1:** Modul `sealProposal` memanfaatkan `calculateDocumentHash` dari `document-signer.ts` untuk menghitung digest SHA-256 dari berkas lampiran proposal. Metadata tersebut disertakan ke dalam serialisasi payload sebelum dienkripsi.
  - **Pengikatan Konteks Kriptografis (AAD):** Nilai `proyek:${proyekId}|student:${studentId}` dipasok sebagai *Additional Authenticated Data* (AAD) pada AES-GCM untuk memastikan paket proposal tidak dapat dipindahkan atau diklaim pada proyek/mahasiswa lain (*context-swapping attack*).
  - **Pengujian Otomatis:** Memverifikasi 5 skenario uji:
    1. `[UJI-01]` Round-trip enkripsi dan dekripsi proposal yang sah (100% identik) serta keunikan nonce per pemanggilan.
    2. `[UJI-02]` Deteksi manipulasi 1 byte ciphertext yang langsung ditolak oleh tag GHASH (fail-closed).
    3. `[UJI-03]` Penolakan seketika saat mendekripsi dengan kunci simetris 256-bit lain.
    4. `[UJI-04]` Penolakan dekripsi proposal jika ID proyek atau ID mahasiswa pada AAD ditukar (*context separation*).
    5. `[UJI-05]` Deteksi anomali pada integritas berkas lampiran Tugas 1 (`document-signer.ts`) terhadap hash yang tersimpan dalam vault.
### Tahap 2: Manajemen Kunci di Luar Repositori (HKDF RFC 5869), Validasi Masukan di Batas Kripto, & Pengujian Pekan 5 & 6

- **Tanggal / Waktu Interaksi:** 1 November 2026, 20:05 WIB
- **Asisten AI:** Gemini (Role: Cryptography Implementation Agent & Lead Architect)
- **Kompatibilitas Tugas:** Tugas 2 Kriptografi (Sub-CPMK 3 - Materi Pekan 5 & 6: AEAD, Nonce, HMAC, HKDF, Batas Kepercayaan, dan Manajemen Kunci; Rubrik R2 K3 & K4)
- **Komponen / Berkas yang Dimodifikasi / Dibuat:**
  - `lib/crypto/key-manager.ts`: Modul siklus hidup kunci (pembangkitan CSPRNG 256-bit, penyimpanan aman di luar repositori dengan izin POSIX `0o600` dan proteksi anti-penimpaan `O_EXCL`, pemuatan aman *fail-closed*, serta penurunan subkunci HKDF-SHA256 RFC 5869).
  - `lib/crypto/input-validator.ts`: Modul penegakan batas kepercayaan (*Trust Boundary*) dengan pendekatan *Strict Allowlist*, normalisasi teks Unicode NFC (`normalize('NFC')`), penolakan tipe numerik tidak aman (`NaN`, `Infinity`, `boolean`), dan proteksi *fail-closed*.
  - `lib/crypto/proposal-vault.ts`: Memutakhirkan adaptor *Proposal Vault* untuk memvalidasi masukan secara deklaratif dan menurunkan subkunci enkripsi spesifik via HKDF (`studance:v0.2:proposal-encryption`) sebelum enkripsi/dekripsi.
  - `lib/crypto/tests/key-and-validation.test.ts`: Rangkaian pengujian otomatis baru dengan runner `tsx` yang memvalidasi kondisi batas (CSPRNG, `O_EXCL`, HKDF domain isolation, Unicode normalization NFC vs NFD, strict allowlist, boolean/NaN trap, dan penolakan izin terbuka 0o644 / kunci rusak).
  - `KEPUTUSAN.md`: Memutakhirkan Bagian 3 dan 4 dengan dokumentasi siklus hidup kunci, prinsip *Key Usage* NIST SP 800-57, rincian HKDF RFC 5869, serta pemetaan 10 skenario pengujian komprehensif.
- **Deskripsi Perubahan & Alasan Teknis:**
  - **Siklus Hidup & Isolasi Kunci:** Menerapkan siklus *Bangkitkan › Simpan › Muat › Pakai › Ganti › Musnahkan* sesuai NIST SP 800-57. Kunci disimpan di luar repositori (`~/.studance/master.key`) dengan izin `0o600` dan flag eksklusif `wx` (`O_EXCL`) agar kunci lama tidak tertimpa. Pada platform POSIX, sistem memverifikasi `st_mode & 0o077` untuk menolak berkas jika izin terlalu terbuka.
  - **Prinsip "Satu Kunci, Satu Tujuan" (HKDF RFC 5869):** Menurunkan subkunci terisolasi secara matematis untuk enkripsi proposal (`studance:v0.2:proposal-encryption`), terpisah dari token badge atau audit log, mencegah eksploitasi silang antar-primitif.
  - **Sanitasi di Batas Kepercayaan:** Menghindari anomali kanonisasi di mana teks yang bermakna sama memiliki representasi biner berbeda (misal Unicode NFC vs NFD pada karakter beraksen) yang dapat merusak kalkulasi hash atau verifikasi tag. Menolak injeksi atribut tak dikenal (*Strict Allowlist*) dan jebakan tipe JavaScript/Python (`true == 1`, `NaN`).
  - **Hasil Pengujian Komprehensif:** 10 dari 10 skenario uji (5 pada `symmetric.test.ts` dan 5 pada `key-and-validation.test.ts`) lulus 100% (*zero regression*).
- **Korelasi 3 Mata Kuliah:**
  - **Kriptografi:** Memenuhi rubrik R2 K3 (Penanganan Masukan & Kunci: CSPRNG, HKDF RFC 5869, izin 0o600, fail-closed) dan K4 (Pengujian Kondisi Tidak Sah) secara paripurna.
  - **Keamanan Komputasi & Siber:** Menerapkan prinsip *Principle of Least Privilege* pada izin berkas sistem operasi, pertahanan terhadap serangan injeksi objek / *prototype pollution*, serta mitigasi kebocoran kunci di repositori publik.
  - **Pengembangan Aplikasi Web:** Menyediakan kontrak data yang bersih dan tervalidasi sebelum menyentuh lapisan persistensi PostgreSQL / Prisma ORM dan integrasi Server Actions Next.js 16.







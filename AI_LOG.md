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
  - **Uji Runtime 3 — Uji Negatif Penulisan Filesystem Read-Only:** Menjalankan `docker compose exec app touch /app/uji` dan menangkap respon penolakan kernel `touch: /app/uji: Read-only file system` (Exit code 1). Membuktikan filesystem kontainer bersifat *immutable*.
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
  - **Pemindaian Ulang (`image-scan-after.txt`):** Menjalankan pemindaian ulang pasca-remediasi yang membuktikan penurunan kerentanan CRITICAL menjadi **0 (Nol)**. Temuan 10 kerentanan HIGH dievaluasi dan dicatat sebagai risiko residual yang telah termitigasi oleh arsitektur kontainer *read-only* dan *non-root*.
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
    1. **R-01 (Database Exposure | Skor Awal: 25 VH $\rightarrow$ Skor Akhir: 3 Low):** Status diubah menjadi *Mitigated (Implemented)* setelah pemutusan direktif `ports` host pada `compose.yaml` dan pembuktian empiris via `ss -tlpn | grep 5432` yang bersih/kosong.
    2. **R-02 (Privilege Escalation via Container Escape | Skor Awal: 16 VH $\rightarrow$ Skor Akhir: 2 Low):** Status diubah menjadi *Mitigated (Implemented)* setelah implementasi kontrol ganda: non-root execution (UID 1001), `cap_drop: ALL`, `no-new-privileges: true`, serta filesystem `read_only: true` yang terbukti menolak penulisan direktori.
    3. **R-04 (Brute Force & Credential Stuffing | Skor Awal: 16 VH $\rightarrow$ Skor Akhir: 3 Low):** Status diubah menjadi *Mitigated (Implemented)* setelah penegakan kebijakan kata sandi NIST SP 800-63B-4 pada form pendaftaran dan konfigurasi OpenSSH *key-only* yang menolak autentikasi kata sandi.
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

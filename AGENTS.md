<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `node node_modules/next/dist/bin/next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

# AGENTS.md — Studance Project Mentor & Engineering Guide

## 1. Identitas, Peran, & Batasan Sikap
Anda adalah **Full Project Mentor** dan **Lead Architect** untuk proyek perkuliahan terintegrasi bernama **Studance** (Student Freelance Marketplace). Proyek ini menggabungkan tiga mata kuliah:
1. **Pengembangan Aplikasi Web** (Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL).
2. **Kriptografi** (CSPRNG, Hashing, HMAC, Tanda Tangan Digital).
3. **Keamanan Komputasi & Siber** (STRIDE, NIST SP 800-30, Pengerasan Kontainer, OWASP Top 10:2025).

### Prinsip Interaksi & Pengambilan Keputusan:
- **Bukan Yes-Man:** Tolak ide fitur yang tidak esensial (*scope creep*), arsitektur berlebihan (hindari microservices, blockchain, real-time video/chat, AI generatif yang tidak relevan), atau implementasi keamanan yang rentan.
- **Korelasikan 3 Mata Kuliah:** Setiap perancangan data atau alur bisnis wajib meninjau aspek web, pemanfaatan kriptografi yang tepat guna, dan kontrol keamanan siber.
- **Validasi Asumsi:** Jika ada spesifikasi bisnis atau teknis yang ambigu, tanyakan terlebih dahulu sebelum berasumsi atau membuat kode.

---

## 2. Batasan Produk (Scope Boundaries)
- **Problem Statement:** Mahasiswa butuh penghasilan dan portofolio terverifikasi; Klien butuh talenta kampus terpercaya dengan status akademik valid.
- **Fitur Diferensiasi Utama:** *Campus-Specific Projects* (proyek khusus mahasiswa kampus tertentu dengan validasi domain email/NIM).
- **Core User Loop:** 
  Post Project (Klien) -> Temukan & Ajukan Penawaran (Mahasiswa) -> Seleksi & Escrow Mock (Klien) -> Pengerjaan & Unggah Bukti -> Verifikasi & Review.
- **Batasan Ketat MVP (DILARANG dibuat/diusulkan):**
  1. *Payment Gateway* riil (wajib menggunakan simulasi status *Mock Escrow*).
  2. Komunikasi instan WebSocket / video call (cukup pesan berbasis form/penawaran statis).
  3. Blockchain / Smart Contract (cukup tanda tangan digital dan hash pada PostgreSQL).
  4. Aplikasi mobile native (fokus hanya pada responsive web).

---

## 3. Lingkungan & Standar Teknis
- **Runtime & Framework:** Node.js (LTS), Next.js (App Router), React, TypeScript.
- **Basis Data:** PostgreSQL berjalan **WAJIB** melalui **Docker Compose** lokal.
- **ORM & Skema:** Prisma ORM. Port `5432` hanya terikat secara lokal (`127.0.0.1`) di kontainer internal.
- **Validasi:** Zod untuk validasi skema di sisi klien dan server (Server Actions / Route Handlers).
- **Pengujian:** Vitest (unit/integration test), Playwright (E2E test).
- **Audit:** Append-only structured log (JSON) di direktori `security/`.

---

## 4. Roadmap & Deliverables Akademik

### A. Pengembangan Aplikasi Web
- **Tugas 2 (Pekan 6, v0.2):** Logika Server & Basis Data.
  - Migrasi seluruh *mock data* Tugas 1 ke PostgreSQL via Prisma.
  - Minimal 2 entitas berelasi (`User`, `Project`, `Bid`, dsb.).
  - Operasi CRUD lengkap dengan Server Actions dan validasi Zod.
- **Tugas 3 (Pekan 10, v0.3):** RESTful API & Integrasi Layanan (min. 5 endpoint OpenAPI, integrasi 1 layanan eksternal).
- **Tugas 4 (Pekan 13, v0.4):** Autentikasi (Auth.js), RBAC minimal 2 peran, mitigasi OWASP Top 10:2025, pengujian Vitest/Playwright.
- **Tugas Besar (Pekan 16):** Deployment cloud, CI/CD GitHub Actions, evaluasi SUS & Core Web Vitals.

### B. Kriptografi
- **Tugas 2 (Pekan 6):** Komponen Lanjutan (enkripsi simetris/AES, pengelolaan IV/nonce unik, manajemen kunci lokal).
- **Tugas 3 (Pekan 10):** Prototipe Terintegrasi (CSPRNG + HMAC-SHA256 untuk token OTP verifikasi kampus berbatas waktu 15 menit, SHA-256 untuk digest integritas portofolio).
- **Tugas 4 (Pekan 13):** Fitur Pembeda (verifikasi kredensial / lencana digital asimetris).
- **Tugas Besar (Pekan 16):** Evaluasi 8 skenario pengujian produk (min. 3 uji negatif).

### C. Keamanan Komputasi & Siber
- **Tugas 2 (Pekan 6, sec-0.2):** Pengerasan Sistem & Kontrol Akses.
  - Kontainer Docker non-root (`USER node` atau `appuser`), image minimal, pembatasan kapabilitas kernel.
  - Konfigurasi VM/Linux: SSH key-only, audit Lynis skor >= 70.
  - Penegakan otorisasi hak akses minimum (RBAC) pada API handler.
- **Tugas 3 (Pekan 10, sec-0.3):** Keamanan Jaringan & Data (isolasi port DB, TLS 1.3, proteksi secrets, validasi magic bytes unggahan file, cadangan data 3-2-1).
- **Tugas 4 (Pekan 13, sec-0.4):** Monitoring terpusat JSON, deteksi brute force/port scan/akses ilegal, playbook respons insiden NIST SP 800-61r3.
- **Tugas Besar (Pekan 16, sec-1.0):** Vulnerability assessment, uji penetrasi terbatas, remedi mitigasi CVSS.

---

## 5. Aturan Operasional Agen IDE (Guardrails)

1. **Proteksi UI Tugas 1:**
   - Dilarang merombak komponen antarmuka, tata letak, atau sistem desain *Liquid Glass* yang telah selesai pada Tugas 1 tanpa instruksi eksplisit.
   - Modifikasi antarmuka hanya diizinkan untuk mengaitkan formulir dengan Server Actions atau menampilkan data riil dari Prisma.

2. **Docker Compose Sebagai Standar Tunggal:**
   - Semua instruksi penyiapan database harus mengacu pada konfigurasi `docker-compose.yml`. Dilarang meminta pengguna menginstal instance database langsung di OS host tanpa kontainer.

3. **Verifikasi Mandiri Sebelum Klaim Selesai:**
   - Sebelum menyatakan tugas selesai, agen wajib memverifikasi bahwa kode bebas galat tipe (`npx tsc --noEmit`) dan tidak menimbulkan kegagalan pada build lokal.

4. **Kewajiban Pencatatan Log AI (`AI_LOG.md`):**
   - Setiap kali membuat fitur baru, migrasi skema, atau skrip konfigurasi keamanan, agen wajib memperbarui berkas `AI_LOG.md` di *root workspace* dengan format:
     - Tanggal & Waktu
     - Komponen / Berkas yang Dimodifikasi
     - Deskripsi Perubahan & Alasan Teknis
     - Korelasi Mata Kuliah (Web / Kripto / Keamanan Siber)

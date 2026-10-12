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
- Penggunaan AI Assistant (Gemini) dimanfaatkan sebagai *Full Project Mentor*, *Thought Partner*, dan *Drafting Assistant*.
- Seluruh keputusan arsitektur, pemodelan ancaman, justifikasi nilai risiko, penanganan aksesibilitas WCAG 2.2 AA, serta validasi kebenaran logika/skrip adalah **tanggung jawab penuh pengembang (mahasiswa)**.
- Mahasiswa sanggup mempertahankan dan mempertanggungjawabkan setiap bagian dari kode, artefak DFD, model ancaman STRIDE, register risiko, serta modul pengujian kriptografi saat demonstrasi dan evaluasi produk.

---

## Log Riwayat Penggunaan AI — Section 1: Pengembangan Aplikasi Web (Tugas 1 PAW - Pekan 1–3)

### Tahap 1: Grounding Arsitektur Antarmuka & Token Design System
- **Tanggal / Tanggal Interaksi:** 10–12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 PAW (Sub-CPMK 2 - Antarmuka Web Responsif & Aksesibel)
- **Prompt / Permintaan Pengguna:**
  Merancang token CSS *Liquid Glassmorphism* (`styles/globals.css`), pengunci aksesibilitas WCAG 2.2 AA (`focus-visible` & `prefers-reduced-motion`), serta Component Tree React sesuai slide materi PAW Pekan 3.
- **Hasil & Luaran AI:**
  Draf token CSS, komponen atomik (`VerifiedBadge.tsx` & `ScopeBadge.tsx`), serta diagram Mermaid React Component Tree yang membedakan *Server Components* dan *Client Components* (`"use client"`).
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Mengoreksi dan memisahkan sintaks CSS agar tidak terbungkus markdown code block yang memicu `CssSyntaxError` pada Next.js Turbopack.
  - Memastikan rasio kontras warna lencana (*Emerald Verified* & *Amber Scope*) memenuhi batas aksesibilitas minimum 4.5:1.

### Tahap 2: Layout Global & Fitur Beranda Catalog
- **Tanggal / Tanggal Interaksi:** 11–12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 PAW (Sub-CPMK 2 - Layout & Reusable Components)
- **Prompt / Permintaan Pengguna:**
  Membangun `Navbar.tsx` dengan *Context Role Switcher* (`[ 🎓 Freelancer | 💼 Klien ]`), `MobileNav.tsx` (Glass Bottom Bar), `HeroSection.tsx`, `ScopeFilterBar.tsx`, `ProjectCard.tsx`, `ServiceCard.tsx`, dan `app/page.tsx`.
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
  - Menyusun berkas `security/docs/data-flow-diagram.md` yang memuat penataan tabel notasi, deskripsi elemen, dan contoh konkret *data flow*.

### Tahap 2: Pemodelan Ancaman (STRIDE-per-Element)
- **Tanggal / Tanggal Interaksi:** 9 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 KKS (Sub-CPMK 1 - Analisis STRIDE)
- **Prompt / Permintaan Pengguna:**
  Mengidentifikasi minimal 10 ancaman STRIDE pada elemen DFD yang melintasi Trust Boundaries sesuai format baku NIST SP 800-30 / Adam Shostack.
- **Hasil & Luaran AI:**
  Draf 11 *Threat Statements* (T-01 s.d. T-11) yang memuat elemen DFD, kategori STRIDE, klausa ancaman, dan aset terdampak.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Meninjau *Threat Statements* agar tidak sekadar memuat kelas kerentanan (*vulnerability*), melainkan secara spesifik memuat *threat source*, *tindakan*, *elemen*, *kelemahan*, dan *dampak* (NIST format).
  - Memastikan konsistensi penamaan ID `T-01` s.d. `T-11` pada berkas `security/threat-model.md`.

### Tahap 3: Risk Assessment & Risk Register (NIST SP 800-30)
- **Tanggal / Tanggal Interaksi:** 9 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 KKS (Sub-CPMK 1 - Risk Register & Prioritasi)
- **Prompt / Permintaan Pengguna:**
  Menilai *Likelihood* (L) dan *Impact* (I) untuk 11 ancaman, menentukan 5 risiko prioritas *Very High*, serta merumuskan rencana kontrol yang terhubung ke tugas akademis 3 mata kuliah.
- **Hasil & Luaran AI:**
  Tabel Risk Register (R-01 s.d. R-11) dengan justifikasi L dan I satu kalimat, penetapan 5 risiko *Very High* (R-01, R-02, R-03, R-04, R-05), dan pemetaan kontrol ke Tugas 2–4.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Menguji kelayakan penilaian risiko pada skala resmi Tugas 1 KKS ($L \times I$).
  - Memastikan 5 risiko prioritas secara nyata mencerminkan risiko kritis produk *Student Freelance Marketplace* (misal: proteksi port 5432 basis data, IDOR pada Next.js, webshell pada upload portofolio, brute force auth, dan forge token verifikasi mahasiswa).
  - Menyusun berkas `security/risk-register.md`.

---

## Log Riwayat Penggunaan AI — Section 3: Kriptografi (Tugas 1 Kriptografi - Pekan 1–3)

### Tahap 1: Pemetaan Kebutuhan Kriptografi & Komponen Dasar
- **Tanggal / Tanggal Interaksi:** 12 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 Kriptografi (Sub-CPMK 3 - Komponen Dasar & Vektor Uji)
- **Prompt / Permintaan Pengguna:**
  Merancang modul fungsi kriptografi dasar yang terhubung langsung dengan *Threat Model* Keamanan Siber (`T-10`: pemalsuan token lencana mahasiswa & `T-04`: penyangkalan integritas bukti pengerjaan proyek).
- **Hasil & Luaran AI:**
  - Pustaka logika `src/lib/crypto/token-verifier.ts` (HMAC-SHA256 untuk lencana mahasiswa terkanonisasi)[cite: 125, 137, 140].
  - Pustaka logika `src/lib/crypto/document-signer.ts` (SHA-256 Digest untuk verifikasi integritas bukti proyek)[cite: 125, 137, 140].
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Menggunakan modul native `node:crypto` guna menjamin keamanan engine V8 dan menghindari dependensi *third-party* yang rentan *supply chain attack*[cite: 125, 133].
  - Menyelaraskan kanonisasi string input pada generator HMAC agar mendukung sifat deterministik *Test Vector*[cite: 125, 137].

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

| Nama Berkas Artefak | Kontribusi AI Assistant | Penyelarasan & Validasi Mahasiswa |
| :--- | :--- | :--- |
| `styles/globals.css` | Usulan token warna dan utility class glassmorphism. | Pembersihan sintaks CSS dari karakter markdown pendukung Turbopack. |
| `components/ui/*` | Draf komponen `VerifiedBadge.tsx` dan `ScopeBadge.tsx`. | Penyesuaian rasio kontras warna dan atribut aksesibilitas WCAG 2.2 AA. |
| `components/layout/*` | Draf `Navbar.tsx`, `MobileNav.tsx`, dan `Footer.tsx`. | Pembungkusan `MobileNav` dengan React `<Suspense>` boundary. |
| `app/projects/[id]/page.tsx` | Draf halaman detail proyek dan modal `BidModalForm`. | Pembungkusan `use(params)` dengan React `<Suspense>` boundary untuk Next.js 15+. |
| `app/(auth)/auth/verify-student/page.tsx` | Draf formulir input email kampus dan blok OTP. | Penyesuaian struktur direktori folder agar URL `/auth/verify-student` berfungsi tanpa 404. |
| `security/data-flow-diagram.md` | Draf struktur teks, penjelasan legenda DFD, dan contoh konkret aliran data. | Verifikasi kesesuaian dengan arsitektur Next.js + PostgreSQL + Docker Host. |
| `security/threat-model.md` | Draf 11 entri STRIDE-per-Element dengan sintaks NIST SP 800-30. | Pemastian ketiadaan duplikasi ID (`T-01` s.d. `T-11`) dan validitas klausa ancaman. |
| `security/risk-register.md` | Draf perhitungan skor risiko ($L \times I$) dan usulan rencana mitigasi. | Penyesuaian skala resmi KKS dan penetapan 5 risiko prioritas utama (*Very High*). |
| `src/lib/crypto/*` | Draf logika fungsi `token-verifier.ts` dan `document-signer.ts`. | Penggunaan `node:crypto` native dan kanonisasi payload deterministik. |
| `lib/crypto/tests/*` | Draf skrip unit test 4 skenario uji kriptografi. | Migrasi ke `tsx` + `node:assert` untuk hasil pengujian 100% PASS. |
| `AI_LOG.md` | Draf format catatan transparansi penggunaan AI 3 mata kuliah. | Pengisian riwayat prompt, tanggal, dan pengesahan etika akademis terintegrasi. |
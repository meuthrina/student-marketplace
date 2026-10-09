# AI Log: Catatan Pemanfaatan Kecerdasan Artifisial (AI Assistant)

**Nama Produk:** Student Freelance Marketplace (MVP)  
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
- Seluruh keputusan arsitektur, pemodelan ancaman, justifikasi nilai risiko, serta validasi kebenaran logika/skrip adalah **tanggung jawab penuh pengembang (mahasiswa)**.
- Mahasiswa sanggup mempertahankan dan mempertanggungjawabkan setiap bagian dari kode, artefak DFD, model ancaman STRIDE, dan register risiko saat demonstrasi serta evaluasi.

---

## Log Riwayat Penggunaan AI (Tugas 1 KKS - Pekan 1–3)

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

---

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

---

### Tahap 3: Risk Assessment & Risk Register (NIST SP 800-30)
- **Tanggal / Tanggal Interaksi:** 9 Oktober 2026
- **Asisten AI:** Gemini (Role: Full Project Mentor)
- **Kompatibilitas Tugas:** Tugas 1 KKS (Sub-CPMK 1 - Risk Register & Prioritasi)[cite: 336, 340]
- **Prompt / Permintaan Pengguna:**
  Menilai *Likelihood* (L) dan *Impact* (I) untuk 11 ancaman, menentukan 5 risiko prioritas *Very High*, serta merumuskan rencana kontrol yang terhubung ke tugas akademis 3 mata kuliah.
- **Hasil & Luaran AI:**
  Tabel Risk Register (R-01 s.d. R-11) dengan justifikasi L dan I satu kalimat, penetapan 5 risiko *Very High* (R-01, R-02, R-03, R-04, R-05), dan pemetaan kontrol ke Tugas 2–4.
- **Tindakan & Validasi Pengembang (Mahasiswa):**
  - Menguji kelayakan penilaian risiko pada skala resmi Tugas 1 KKS ($L \times I$).
  - Memastikan 5 risiko prioritas secara nyata mencerminkan risiko kritis produk *Student Freelance Marketplace* (misal: proteksi port 5432 basis data, IDOR pada Next.js, webshell pada upload portofolio, brute force auth, dan forge token verifikasi mahasiswa).
  - Menyusun berkas `security/risk-register.md`.

---

## Ringkasan Integrasi AI pada Artefak Tugas 1 KKS

| Nama Berkas Artefak | Kontribusi AI Assistant | Penyelarasan & Validasi Mahasiswa |
| :--- | :--- | :--- |
| `security/data-flow-diagram.md` | Draf struktur teks, penjelasan legenda DFD, dan contoh konkret aliran data. | Verifikasi kesesuaian dengan arsitektur Next.js + PostgreSQL + Docker Host. |
| `security/threat-model.md` | Draf 11 entri STRIDE-per-Element dengan sintaks NIST SP 800-30. | Pemastian ketiadaan duplikasi ID (`T-01` s.d. `T-11`) dan validitas klausa ancaman. |
| `security/risk-register.md` | Draf perhitungan skor risiko ($L \times I$) dan usulan rencana mitigasi. | Penyesuaian skala resmi KKS dan penetapan 5 risiko prioritas utama (*Very High*). |
| `AI_LOG.md` | Draf format catatan transparansi penggunaan AI. | Pengisian riwayat prompt, tanggal, dan pengesahan etika akademis. |
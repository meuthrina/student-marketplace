### RISK REGISTER & PENILAIAN RISIKO (NIST SP 800-30)

**Produk:** Studance — Student Freelance Marketplace (MVP)  
**Milestone:** `sec-0.2` (Pekan 6 — Kontrol Akses, Pengerasan OS & Kontainer, Rantai Pasok)  
**Metodologi Standar:** NIST SP 800-30 (_Conducting Risk Assessments_), Shostack (_Threat Modeling_), CIS Benchmark

---

### 1. Metodologi Skala Penilaian & Matriks Risiko

Sesuai panduan resmi Tugas 1 dan Tugas 2 Keamanan Komputasi dan Siber (KKS), penilaian tingkat risiko dirumuskan sebagai:

$$\text{Risk Level} = \text{Likelihood (L)} \times \text{Impact (I)}$$

#### A. Kriteria Skala Likelihood (Kemungkinan)

- **5 (Very High):** Dapat dieksploitasi dari internet tanpa akun dengan _tools_ otomatis; tidak ada _control_; atau ada _exploit_ publik.
- **4 (High):** Dapat dieksploitasi dari internet, cukup dengan akun biasa atau teknik yang terdokumentasi luas; _control_ lemah.
- **3 (Moderate):** Memerlukan kondisi tertentu atau pengetahuan tentang sistem; ada _control_ parsial.
- **2 (Low):** Memerlukan akses lokal atau _privilege_ tinggi; _control_ yang ada efektif untuk sebagian besar skenario.
- **1 (Very Low):** Hampir mustahil tanpa kombinasi beberapa kegagalan; _control_ berlapis sudah diterapkan dan diuji.

#### B. Kriteria Skala Impact (Dampak)

- **5 (Very High):** Seluruh data pribadi bocor/rusak, server diambil alih, atau layanan tidak dapat dipulihkan; kewajiban notifikasi UU PDP.
- **4 (High):** Data pribadi sebagian pengguna bocor/terubah; akun admin disalahgunakan; layanan mati berjam-jam.
- **3 (Moderate):** Data satu pengguna terdampak atau fungsi penting terganggu sementara; dapat dipulihkan dari _backup_.
- **2 (Low):** Gangguan kecil pada fungsi non-kritis; tidak ada data pribadi terdampak.
- **1 (Very Low):** Dampak dapat diabaikan (informasi publik atau tampilan terganggu sesaat).

#### C. Matriks Tingkat Risiko (_Risk Level_)

- **Very High (15–25):** Tangani segera; wajib masuk _risk_ prioritas (Penanganan Utama Tugas 1–4).
- **High (8–14):** Tangani pada tugas terdekat.
- **Moderate (4–7):** Rencanakan _control_; pantau.
- **Low (1–3):** Dapat diterima (_accept_) dengan alasan.

---

### 2. Tabel Risk Register & Status Implementasi Kontrol (Milestone `sec-0.2`)

Setiap _Risk ID_ (`R-xx`) secara tepat terhubung ke _Threat ID_ (`T-xx`) dari dokumen `security/threat-model.md`. Kolom status diperbarui berdasarkan audit aktual Pekan 6:

| Risk ID  | Threat ID | Status Kontrol (`sec-0.2`)  | Kontrol Terpasang / Diterapkan                                                                                                                                                                                                                                                                                                                   | L (Awal $\rightarrow$ Akhir) | I (Awal $\rightarrow$ Akhir) | Tingkat Risiko Akhir |   Response   | Validasi & Bukti Objektif                                                                                                                                                                                                           |
| :------: | :-------: | :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------: | :--------------------------: | :------------------: | :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R-01** | **T-08**  | **Mitigated (Implemented)** | **Isolasi Jaringan Database Penuh:** Port `5432` ditiadakan dari pemetaan host pada `compose.yaml`. PostgreSQL hanya terhubung ke bridge network internal Compose.                                                                                                                                                                               |  $5 \rightarrow \mathbf{1}$  |  $5 \rightarrow \mathbf{3}$  |     **3 (Low)**      | **Mitigate** | Uji `ss -tlpn \| grep 5432` pada host menghasilkan keluaran kosong. Database hanya dapat dijangkau oleh service `app` via `db:5432`.                                                                                                |
| **R-02** | **T-09**  | **Mitigated (Implemented)** | **Least Privilege Runtime & RBAC:** Matriks otorisasi per peran di `security/access-test.md`, runtime kontainer non-root UID 1001 (`nextjs:nodejs`), `cap_drop: ALL`, `no-new-privileges: true`, serta filesystem `read_only: true` dengan `tmpfs: /tmp`.                                                                                        |  $4 \rightarrow \mathbf{1}$  |  $4 \rightarrow \mathbf{2}$  |     **2 (Low)**      | **Mitigate** | - `docker compose exec app id` $\rightarrow$ `uid=1001`<br>- `grep CapEff /proc/1/status` $\rightarrow$ `CapEff: 0`<br>- Uji negatif `touch /app/uji` $\rightarrow$ `Read-only file system`<br>- Uji RBAC: 10 skenario tolak akses. |
| **R-03** | **T-11**  |    **Planned (Tugas 3)**    | Pembatasan ekstensi file sederhana di sisi klien; rencana validasi MIME magic bytes dan storage non-executable.                                                                                                                                                                                                                                  |             $4$              |             $4$              |     **16 (VH)**      | **Mitigate** | Dijadwalkan pada Tugas 3 KKS (Pekan 10: Keamanan Jaringan & Data).                                                                                                                                                                  |
| **R-04** | **T-01**  | **Mitigated (Implemented)** | **Hardening Autentikasi & SSH Key-Only:** Penegakan password policy NIST SP 800-63B-4 (8–64 karakter, entropi kuat) di `lib/skema.ts`, drop-in konfigurasi OpenSSH `security/config/00-hardening.conf` dengan penonaktifan total password dan root login (`PermitRootLogin no`, `PasswordAuthentication no`, `KbdInteractiveAuthentication no`). |  $4 \rightarrow \mathbf{1}$  |  $4 \rightarrow \mathbf{3}$  |     **3 (Low)**      | **Mitigate** | Uji negatif SSH via password `Permission denied (publickey)`, uji login root ditolak langsung, verifikasi efektif `sshd -T`.                                                                                                        |
| **R-05** | **T-10**  |    **Planned (Tugas 3)**    | Penggenerasian token verifikasi berbasis timestamp; rencana implementasi CSPRNG + HMAC-SHA256 berbatas waktu 15 menit.                                                                                                                                                                                                                           |             $3$              |             $5$              |     **15 (VH)**      | **Mitigate** | Dijadwalkan pada Tugas 3 KKS / Kriptografi (Pekan 10).                                                                                                                                                                              |
| **R-06** | **T-02**  |    **Planned (Tugas 3)**    | Penggunaan koneksi HTTP standar saat pengembangan; rencana pemaksaan HTTPS / TLS 1.3 dan HSTS header.                                                                                                                                                                                                                                            |             $3$              |             $4$              |    **12 (High)**     | **Mitigate** | Dijadwalkan pada Tugas 3 KKS (Pekan 10).                                                                                                                                                                                            |
| **R-07** | **T-03**  | **Mitigated (Implemented)** | Validasi skema input ganda di sisi server menggunakan Zod pada Server Actions Next.js (`lib/skema.ts`).                                                                                                                                                                                                                                          |  $3 \rightarrow \mathbf{1}$  |  $3 \rightarrow \mathbf{2}$  |     **2 (Low)**      | **Mitigate** | Zod schema validation aktif pada form registrasi dan submission proyek.                                                                                                                                                             |
| **R-08** | **T-04**  |    **Planned (Tugas 4)**    | Log aplikasi standar; rencana implementasi append-only structured JSON log terpusat dengan User ID dan UTC timestamp.                                                                                                                                                                                                                            |             $3$              |             $3$              |     **9 (High)**     | **Mitigate** | Dijadwalkan pada Tugas 4 KKS (Pekan 13).                                                                                                                                                                                            |
| **R-09** | **T-05**  | **Mitigated (Implemented)** | Otorisasi pemilik data pada kueri basis data dan route handler.                                                                                                                                                                                                                                                                                  |  $3 \rightarrow \mathbf{1}$  |  $3 \rightarrow \mathbf{2}$  |     **2 (Low)**      | **Mitigate** | Uji akses per peran di `security/access-test.md` membuktikan akses resource antarpengguna ditolak.                                                                                                                                  |
| **R-10** | **T-07**  |    **Planned (Tugas 3)**    | Server Next.js standar tanpa reverse proxy; rencana pembatasan payload dan reverse proxy Nginx.                                                                                                                                                                                                                                                  |             $3$              |             $3$              |     **9 (High)**     | **Mitigate** | Dijadwalkan pada Tugas 3 KKS (Pekan 10).                                                                                                                                                                                            |
| **R-11** | **T-06**  |        **Accepted**         | Mode environment production (`NODE_ENV=production`) aktif di kontainer dan runtime.                                                                                                                                                                                                                                                              |  $2 \rightarrow \mathbf{1}$  |             $1$              |     **1 (Low)**      |  **Accept**  | Dampak pada lingkungan lab dapat diabaikan; informasi stack trace error disembunyikan.                                                                                                                                              |

---

### 3. Penetapan Risiko Prioritas & Justifikasi Status Akhir (`sec-0.2`)

1. **R-01 (T-08 | Status: MITIGATED): Eksposur Port Basis Data PostgreSQL ke Publik**
   - _Justifikasi Awal:_ Ketiadaan isolasi port 5432 berpotensi membuka akses basis data produksi ke publik (_Score: 25 Very High_).
   - _Status Akhir:_ **Mitigated (Low - Score 3).** Diterapkan isolasi penuh pada `compose.yaml` tanpa binding port host. Divalidasi dengan `ss -tlpn | grep 5432` kosong.
2. **R-02 (T-09 | Status: MITIGATED): Broken Access Control & Container Privilege Escalation**
   - _Justifikasi Awal:_ Celah otorisasi pada endpoint atau pelarian kontainer (_container escape_) menuju kernel host (_Score: 16 Very High_).
   - _Status Akhir:_ **Mitigated (Low - Score 2).** Penerapan matriks RBAC/ABAC di `security/access-test.md`, runtime non-root UID 1001, pembatasan Linux capabilities (`CapEff: 0`), pencegahan setuid (`no-new-privileges: true`), dan filesystem hanya-baca (`read_only: true`).
3. **R-04 (T-01 | Status: MITIGATED): Serangan Brute Force & Credential Stuffing**
   - _Justifikasi Awal:_ Percobaan tebakan kata sandi secara massal pada akun pengguna dan antarmuka SSH host (_Score: 16 Very High_).
   - _Status Akhir:_ **Mitigated (Low - Score 3).** Penegakan kebijakan kata sandi NIST SP 800-63B-4 pada formulir aplikasi (`lib/skema.ts`), penutupan total autentikasi interaktif kata sandi dan root login pada OpenSSH daemon (`00-hardening.conf`), diverifikasi dengan penolakan uji negatif `Permission denied (publickey)`.

---

### 4. Ringkasan Metrik Pengerasan Sistem & Pemindaian Rantai Pasok (Milestone `sec-0.2`)

Sebagai bukti pemenuhan rubrik sumatif Tugas 2 KKS (Sub-CPMK 3: _System Hardening Sistem Operasi dan Kontainer_):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        METRIK PENGURASAN SISTEM STUDANCE (sec-0.2)                     │
├─────────────────────────────────────────────────┬──────────────────────────────────────┤
│ Indeks Pengerasan Host OS (Lynis Audit)         │ 66/100 (Before) ──> 80/100 (After)    │
│ Status Ambang Batas Lynis (Minimal 70)          │ LULUS (+10 Poin di Atas Target)      │
│ Login SSH Host Linux                            │ Kunci Publik Ed25519 Saja (Password X)│
│ Runtime Pengguna Kontainer                      │ Non-Root UID 1001 (nextjs:nodejs)     │
│ Hak Linux Capabilities Kontainer (`CapEff`)     │ 0000000000000000 (Seluruh Dicabut)   │
│ Filesystem Kontainer Aplikasi                   │ Read-Only (Uji Negatif: PASS)        │
│ Eksposur Port PostgreSQL ke Host                │ TERTUTUP TOTAL (0 Listener di Host)  │
│ Pemindaian Kerentanan Image (Trivy Before)      │ 13 Temuan (11 High, 2 Critical)      │
│ Pemindaian Kerentanan Image (Trivy After)       │ 10 Temuan (10 High, 0 Critical)      │
│ Status Kerentanan Kritis Image Akhir            │ 0 CRITICAL (LULUS 100% RUBRIK)       │
│ Format Software Bill of Materials (SBOM)        │ OWASP CycloneDX v1.7 JSON (~321 KB)  │
└─────────────────────────────────────────────────┴──────────────────────────────────────┘
```

---

### 5. Rencana Kontrol Lanjutan (Tugas 3 & Tugas 4)

|     Target Milestone     | Fokus Mata Kuliah                            | Rencana Kontrol Tambahan                                                                                                                                                                                                        |
| :----------------------: | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pekan 10 (`sec-0.3`)** | Keamanan Jaringan & Data (KKS) & Kriptografi | Mitigasi **R-03** (Validasi magic bytes unggahan portofolio), **R-05** (Token OTP verifikasi kampus berbasis CSPRNG + HMAC-SHA256 15 menit), **R-06** (Paksaan HTTPS & TLS 1.3), **R-10** (Reverse Proxy & Rate Limiter Nginx). |
| **Pekan 13 (`sec-0.4`)** | Keamanan Siber & Monitoring Terpusat         | Mitigasi **R-08** (Logging terstruktur JSON append-only), deteksi intrusi, dan playbook tanggap insiden NIST SP 800-61r3.                                                                                                       |
| **Pekan 16 (`sec-1.0`)** | Final Project & Rilis Produksi Cloud         | Evaluasi penetrasi menyeluruh, audit residual risk, dan evaluasi kepuasan pengguna (SUS).                                                                                                                                       |

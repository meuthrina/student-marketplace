# Modul Kriptografi Platform Studance (`lib/crypto`)

**Mata Kuliah:** Kriptografi (Kode: 052357) — Semester Ganjil 2026/2027  
**Program Studi:** Ilmu Komputer, Universitas Pertamina  
**Milestone:** v0.2 (Tugas 2: Enkripsi Terautentikasi, Manajemen Kunci, & Validasi Masukan)  
**Dokumen ADR Utama:** [KEPUTUSAN.md](../../KEPUTUSAN.md) | **Catatan AI:** [AI_LOG.md](../../AI_LOG.md)

---

## 1. Ikhtisar Arsitektur Modul

Direktori `lib/crypto` memuat pustaka kriptografi internal platform **Studance** (Student Freelance Marketplace). Modul ini bertanggung jawab melindungi kerahasiaan (*confidentiality*), integritas (*integrity*), dan keaslian (*authenticity*) data bernilai tinggi, khususnya penawaran mahasiswa (*bids/proposal*), token lencana universitas, dan berkas portofolio proyek.

```
lib/crypto/
├── README.md                   # Panduan teknis internal direktori ini
├── symmetric.ts                # [T2] Primitif AEAD AES-256-GCM (NIST SP 800-38D)
├── key-manager.ts              # [T2] CSPRNG, Penyimpanan Kunci (0o600), & HKDF-SHA256 (RFC 5869)
├── input-validator.ts          # [T2] Validasi Batas Kripto (Strict Allowlist & Unicode NFC)
├── proposal-vault.ts           # [T2] Adaptor tingkat tinggi integrasi T1 & T2 (Proposal Vault)
├── document-signer.ts          # [T1] Komponen dasar SHA-256 hash digest dokumen proyek
├── token-verifier.ts           # [T1] Komponen dasar HMAC-SHA256 token lencana mahasiswa
└── tests/
    ├── crypto-scenario.test.ts     # Pengujian regresi Tugas 1 (4 skenario)
    ├── symmetric.test.ts          # Pengujian AES-256-GCM & sambungan T1 (5 skenario)
    └── key-and-validation.test.ts # Pengujian HKDF, CSPRNG, masukan cacat, izin berkas (5 skenario)
```

---

## 2. Alur Kerja Terpadu (Data Flow: Proposal Vault)

Diagram alir berikut mengilustrasikan bagaimana komponen Tugas 1 dan Tugas 2 saling terhubung saat mahasiswa menyegel penawaran proyek (*seal proposal*):

```
+-----------------------------------------------------------------------------------------+
|                                ALUR PENYEGELAN PROPOSAL                                 |
+-----------------------------------------------------------------------------------------+
                                             
   [Masukan Mentah Proposal] 
              │
              ▼
  ┌────────────────────────┐
  │   input-validator.ts   │  ──▶ Tolak NaN, Infinity, bool, negatif, & atribut tak dikenal
  │ (Strict Allowlist/NFC) │  ──▶ Normalisasi string ke bentuk Unicode NFC
  └───────────┬────────────┘
              │ Payload Bersih & Tervalidasi
              ▼
  ┌────────────────────────┐
  │   document-signer.ts   │  ──▶ Hitung SHA-256 digest dari attachmentBuffer (Koneksi T1)
  │    (calculateHash)     │
  └───────────┬────────────┘
              │ attachmentHash
              ▼
  ┌────────────────────────┐       ┌───────────────────────┐
  │     key-manager.ts     │ ────▶ │ ~/.studance/master.key│ (Kunci Master 256-bit di luar repo)
  │ (HKDF-SHA256 RFC 5869) │       └───────────────────────┘
  └───────────┬────────────┘
              │ Subkunci 'proposal-encryption' ("Satu Kunci, Satu Tujuan")
              ▼
  ┌────────────────────────┐
  │      symmetric.ts      │  ──▶ Nonce CSPRNG 96-bit unik per enkripsi (NIST SP 800-38D)
  │     (AES-256-GCM)      │  ──▶ AAD: "proyek:<proyekId>|student:<studentId>" (Context Binding)
  └───────────┬────────────┘  ──▶ Auth Tag GHASH 128-bit (Fail-Closed)
              │
              ▼
   [Buffer Paket Terpadu: Nonce (12B) || Ciphertext (N B) || Auth Tag (16B)]
```

---

## 3. Rincian Modul & Tanggung Jawab Teknis

### A. `symmetric.ts` (Primitif Enkripsi Simetris)
- Menggunakan pustaka native `node:crypto` (`createCipheriv`, `createDecipheriv`, `randomBytes`).
- Menegakkan parameter standar NIST: Kunci 256-bit, Nonce 96-bit unik, Tag GHASH 128-bit.
- Format paket terpadu: `Buffer.concat([nonce, ciphertext, authTag])`.
- Prinsip *Fail-Closed*: Melempar eksepsi deskriptif `InvalidTag: Autentikasi integritas data gagal` jika ada manipulasi 1 bit pada ciphertext, auth tag, atau AAD.

### B. `key-manager.ts` (Siklus Hidup & Derivasi Kunci)
- **CSPRNG:** Membangkitkan 32 byte acak dari generator entropi sistem operasi.
- **Penyimpanan di Luar Repositori:** Lokasi default `~/.studance/master.key` (atau variabel lingkungan `STUDANCE_MASTER_KEY`).
- **Izin Berkas Ketat:** Mode izin POSIX `0o600` (hanya pemilik yang dapat membaca/menulis). Sistem menolak memuat kunci jika izin terlalu terbuka (`st_mode & 0o077 !== 0`).
- **Proteksi Penimpaan Kunci:** Menggunakan flag eksklusif `wx` (`O_CREAT | O_EXCL`) untuk mencegah kehilangan kunci lama.
- **HKDF RFC 5869:** Menurunkan subkunci independen berdasarkan konteks (`studance:v0.2:proposal-encryption` vs `studance:v0.2:badge-token`), mematuhi prinsip *Key Usage* NIST SP 800-57 Part 1 §5.2.

### C. `input-validator.ts` (Batas Kepercayaan Masukan)
- Mengisolasi sistem dari masukan berbahaya sebelum menyentuh fungsi kriptografi.
- Menerapkan **Strict Allowlist** pada properti objek proposal.
- Menormalkan string teks menggunakan **Unicode NFC** (`str.normalize('NFC')`) untuk memastikan keseragaman representasi biner teks beraksen.
- Menolak nilai non-semantik: `NaN`, `Infinity`, angka negatif, serta jebakan konversi boolean (`true == 1`).

### D. `proposal-vault.ts` (Adaptor Tingkat Tinggi)
- Menyambungkan komponen Tugas 1 (`document-signer.ts`) dengan komponen Tugas 2 (`symmetric.ts`, `key-manager.ts`, `input-validator.ts`).
- Fungsi `sealProposal(masterKey, rawPayload)`: Memvalidasi, menyertakan hash lampiran, mengikat AAD proyek/mahasiswa, dan mengenkripsi data.
- Fungsi `openProposal(masterKey, sealedData, proyekId, studentId)`: Menegakkan subkunci HKDF yang sama, mencocokkan AAD, mendekripsi, dan mem-parse objek JSON asli.

---

## 4. Cara Menjalankan Pengujian Otomatis

Seluruh pengujian dirancang menggunakan runner `tsx` dan asersi native `node:assert`.

### Eksekusi Seluruh Pengujian Kriptografi (Rekomendasi):
```bash
npm run test:crypto
```

### Eksekusi Uji Spesifik per Modul:
```bash
# 1. Pengujian Modul Enkripsi Simetris AES-256-GCM (Tugas 2 Pekan 4)
npx tsx lib/crypto/tests/symmetric.test.ts

# 2. Pengujian Manajemen Kunci, HKDF, & Validasi Masukan (Tugas 2 Pekan 5 & 6)
npx tsx lib/crypto/tests/key-and-validation.test.ts

# 3. Pengujian Regresi Komponen Dasar Hashing & HMAC (Tugas 1)
npx tsx lib/crypto/tests/crypto-scenario.test.ts
```

---

## 5. Ringkasan Matriks Pengujian (14 Skenario Lulus 100%)

| File Uji | Kode Skenario | Kategori | Kondisi yang Diverifikasi |
| :--- | :--- | :--- | :--- |
| `symmetric.test.ts` | **UJI-01** | Positif | Round-trip enkripsi/dekripsi proposal 100% identik & keunikan nonce 96-bit |
| `symmetric.test.ts` | **UJI-02** | Negatif | Modifikasi 1 byte ciphertext ditolak seketika (*InvalidTag fail-closed*) |
| `symmetric.test.ts` | **UJI-03** | Negatif | Dekripsi menggunakan kunci simetris 256-bit lain ditolak seketika |
| `symmetric.test.ts` | **UJI-04** | Negatif | Serangan *Context-Swapping* (AAD proyekId / studentId dimanipulasi) ditangkal |
| `symmetric.test.ts` | **UJI-05** | Integrasi T1 | Modifikasi 1 byte file lampiran terdeteksi tidak cocok dengan hash di Proposal Vault |
| `key-and-validation.test.ts` | **UJI-K01** | Positif/Negatif | Pembangkitan CSPRNG 256-bit & flag `O_EXCL` menolak penimpaan berkas kunci |
| `key-and-validation.test.ts` | **UJI-K02** | Positif | Isolasi domain subkunci HKDF-SHA256 RFC 5869 ("Satu Kunci, Satu Tujuan") |
| `key-and-validation.test.ts` | **UJI-K03** | Positif | Normalisasi Unicode NFC vs NFD menghasilkan kanonisasi dan tag yang konsisten |
| `key-and-validation.test.ts` | **UJI-K04** | Negatif | Masukan bernilai `NaN`, `Infinity`, `boolean`, negatif, atau properti asing ditolak |
| `key-and-validation.test.ts` | **UJI-K05** | Negatif | Izin berkas terlalu terbuka (`0o644`) atau kunci tidak valid (< 32 byte) ditolak |
| `crypto-scenario.test.ts` | **U-10A** | Positif | Vektor uji deterministik token HMAC-SHA256 lencana mahasiswa |
| `crypto-scenario.test.ts` | **U-10B** | Negatif | Penolakan token lencana yang dimanipulasi atau menggunakan kunci salah |
| `crypto-scenario.test.ts` | **U-12** | Positif/Negatif | Integritas dokumen proyek & digest SHA-256 mendeteksi manipulasi berkas |
| `crypto-scenario.test.ts` | **K-01** | Batasan | Pembuktian keterbatasan re-computation rantai hash tanpa PKI terpusat |

---

## 6. Keterbatasan Teknis v0.2 & Roadmap Tugas 3

1. **Ketiadaan Nirsangkal (*Non-Repudiation*):**  
   Mekanisme simetris saat ini menjamin kerahasiaan (*confidentiality*) dan integritas (*integrity*). Namun, karena kunci master/subkunci simetris diketahui oleh pihak pemverifikasi, mahasiswa atau klien secara teknis dapat menyangkal bahwa merekalah pencipta sah penawaran tersebut.
2. **Roadmap Tugas 3 (v0.3):**  
   Keterbatasan ini akan diatasi dengan mengimplementasikan **Kriptografi Kunci Publik Asimetris (Digital Signature Ed25519 / RSA-PSS)** untuk penandatanganan penawaran (*bid signing*) dan penerbitan lencana mahasiswa terverifikasi.


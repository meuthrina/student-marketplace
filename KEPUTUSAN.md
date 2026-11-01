# Dokumen Keputusan Arsitektur Kriptografi (KEPUTUSAN.md)
**Proyek:** Studance — Student Freelance Marketplace Platform  
**Komponen:** Modul Enkripsi Simetris & Proposal Vault (`lib/crypto/symmetric.ts`, `lib/crypto/proposal-vault.ts`)  
**Mata Kuliah:** Kriptografi (Kode: 052357) — Semester Ganjil 2026/2027  
**Penyusun:** Iman Dwi Satrio (NIM: 105224029) — Program Studi Ilmu Komputer, Universitas Pertamina  
**Milestone:** Tugas 2 Kriptografi (Pekan 4: Enkripsi Terautentikasi & Integritas Data)  
**Kepatuhan Rubrik:** K1 (Pemilihan Mekanisme Sesuai Kebutuhan), K2 (Spesifikasi Parameter Teknis), K3 (Manajemen Kunci & CSPRNG), K4 (Skenario Uji Respons Negatif), K5 (Dokumentasi & AI Log)

---

## 1. Kebutuhan Keamanan Produk (Security Requirements & Threat Context)

### 1.1 Latar Belakang & Pernyataan Masalah Produk
Platform **Studance** memfasilitasi mahasiswa universitas untuk mengajukan penawaran (*bid / proposal*) terhadap proyek yang dipublikasikan oleh klien industri maupun civitas akademika kampus. Data penawaran mahasiswa memuat aset bernilai tinggi dan bersifat konfidensial:
1. **Nominal Penawaran Harga (*bidding amount*):** Apabila bocor, kompetitor mahasiswa lain dapat melakukan strategi *underbidding* yang merugikan iklim kompetisi sehat.
2. **Durasi Pengerjaan & Strategi Solusi Teknis (*proposal pitch*):** Merupakan kekayaan intelektual (IP) mahasiswa.
3. **Lampiran Portofolio & Bukti Pengerjaan Awal:** Berkas rancangan, source code, atau sertifikat keahlian pendukung.

### 1.2 Pemetaan Terhadap Model Ancaman (Threat Model STRIDE)
Berdasarkan dokumen pemodelan ancaman sistem (`security/threat-model.md`), mekanisme kriptografi simetris ini dirancang khusus untuk memitigasi dua ancaman kritis:

* **Ancaman T-02 (Tampering & Information Disclosure pada Data Penawaran / `F1`):**
  > *Attacker pada jaringan atau pihak ketiga yang memiliki akses ke basis data dapat mencegat, mengintip nominal penawaran, atau memodifikasi nilai penawaran proyek mahasiswa (misal: mengubah biaya penawaran dari Rp1.500.000 menjadi Rp150.000) sebelum dievaluasi klien.*
  * **Kebutuhan Produk:** Kerahasiaan (*confidentiality*) dan Integritas (*integrity*) tingkat tinggi yang tidak dapat dimanipulasi tanpa terdeteksi seketika (*fail-closed*).

* **Ancaman T-10 (Spoofing & Replay Attack / Context-Swapping):**
  > *Penyerang atau entitas yang sah dapat mencoba memindahkan data penawaran terenkripsi milik Mahasiswa A ke Proyek B milik Klien lain, atau mengklaim penawaran Mahasiswa A atas nama Mahasiswa B.*
  * **Kebutuhan Produk:** Pengikatan konteks data secara kriptografis (*cryptographic context-binding*) sehingga data penawaran hanya sah dan dapat didekripsi jika dibuka pada konteks `proyekId` dan `studentId` yang bersangkutan.

---

## 2. Evaluasi & Perbandingan Pilihan Mekanisme (Mode of Operation Comparison)

Dalam memilih mode operasi untuk algoritma enkripsi simetris baku **AES (Advanced Encryption Standard - FIPS 197)**, dilakukan evaluasi mendalam terhadap 4 mode operasi simetris:

| Parameter Evaluasi | ECB (Electronic Codebook) | CBC (Cipher Block Chaining) | CTR (Counter Mode) | AES-GCM (Galois/Counter Mode) |
| :--- | :--- | :--- | :--- | :--- |
| **Standar Acuan** | NIST SP 800-38A | NIST SP 800-38A | NIST SP 800-38A | **NIST SP 800-38D** |
| **Karakteristik Mode** | Block Cipher murni | Block Chaining berantai | Stream Cipher dari counter | **AEAD (Stream CTR + GHASH)** |
| **Kebutuhan IV / Nonce** | Tidak menggunakan IV | IV acak 128-bit tak terduga | Nonce unik per enkripsi | **Nonce 96-bit (CSPRNG) wajib unik** |
| **Kebutuhan Padding** | Wajib (PKCS#7) | Wajib (PKCS#7) | Tidak perlu padding | **Tidak perlu padding** |
| **Jaminan Integritas** | ❌ Tidak Ada | ❌ Tidak Ada | ❌ Tidak Ada | **✅ Ya (128-bit Auth Tag GHASH)** |
| **Dukungan AAD** | ❌ Tidak Ada | ❌ Tidak Ada | ❌ Tidak Ada | **✅ Ya (Additional Authenticated Data)** |
| **Ketahanan Bit-Flip** | Rentan manipulasi blok | Rentan serangan bit-flip IV | Sangat rentan bit-flip | **✅ Kebal (Tag verifikasi gagal seketika)** |
| **Ketahanan Padding Oracle** | Rentan (jika ada error padding) | **Sangat rentan (Vaudenay 2002)** | Kebal padding oracle | **✅ Kebal mutlak (tanpa skema padding)** |
| **Performa & Paralelisasi** | Paralel (tetapi tidak aman) | Enkripsi sekuensial (lambat) | Enkripsi & dekripsi paralel | **✅ Paralel penuh + AES-NI Hardware Accel** |
| **Kelayakan untuk Produk** | ⛔ **DILARANG** | ⚠️ Warisan (hanya jika + HMAC) | ⚠️ Warisan (hanya jika + HMAC) | **🏆 PILIHAN UTAMA (Gold Standard)** |

### Mengapa AES-GCM Terpilih untuk Studance?
1. **Prinsip "Enkripsi Saja Tidak Menjamin Integritas":**
   Mode CBC dan CTR hanya memberikan kerahasiaan (*confidentiality*). Pada CBC, pembalikan 1 bit pada IV membalik bit yang sama pada blok plaintext pertama ($P_1 = D_K(C_1) \oplus IV$) tanpa penyerang perlu mengetahui kunci (seperti demonstrasi pengubahan nilai 60 menjadi 90 pada materi perkuliahan). Pada CTR, serangan *malleability* bahkan lebih mudah karena sifat XOR keystream ($C_i = P_i \oplus KS$). AES-GCM memecahkan ini melalui skema **AEAD (Authenticated Encryption with Associated Data)** yang menyematkan tag integritas 128-bit melalui perkalian medan Galois $GF(2^{128})$ (GHASH).
2. **Eliminasi Kerentanan Padding Oracle:**
   Karena GCM mengoperasikan AES sebagai generator keystream (seperti CTR), ukuran ciphertext persis sama dengan ukuran plaintext. Ketiadaan fungsi *padding* PKCS#7 secara fundamental melenyapkan seluruh vektor serangan *Padding Oracle Attack* (Vaudenay 2002) yang lazim menyerang implementasi CBC.
3. **Perlindungan Terhadap Context-Swapping Melalui AAD:**
   Fitur *Additional Authenticated Data* (AAD) memungkinkan metadata publik yang tidak dienkripsi (seperti ID proyek dan ID mahasiswa) ikut diperhitungkan dalam kalkulasi auth tag GHASH. Hal ini mencegah manipulasi swap konteks tanpa membebani penyimpanan dengan enkripsi berulang.

---

## 3. Spesifikasi Parameter Teknis (Technical Parameter Specifications)

Implementasi pada `lib/crypto/symmetric.ts` dan `lib/crypto/proposal-vault.ts` mematuhi parameter standar NIST SP 800-38D:

```
+-----------------------------------------------------------------------------------+
|                        STRUKTUR PAKET TERPADU AES-256-GCM                        |
+------------------------------------+--------------------------+--------------------+
|            Nonce / IV              |        Ciphertext        |  Auth Tag (GHASH)  |
|         12 Byte (96-bit)           |    N Byte (panjang data) |  16 Byte (128-bit) |
+------------------------------------+--------------------------+--------------------+
```

1. **Panjang Kunci Simetris (`KEY_LENGTH = 32`):**
   * Menggunakan panjang 256 bit (32 byte) untuk menjamin margin keamanan jangka panjang terhadap brute-force dan komputasi pasca-kuantum (*Grover's algorithm reduction* dari 256 bit menjadi 128 bit tingkat keamanan efektif).
   * Kunci wajib dibangkitkan menggunakan CSPRNG sistem operasi (`crypto.randomBytes(32)`).
2. **Panjang Nonce / IV (`NONCE_LENGTH = 12`):**
   * Ditetapkan tepat 12 byte (96 bit) sesuai rekomendasi NIST SP 800-38D. Panjang 96 bit memungkinkan operasi GCM memproses counter 32 bit tanpa memerlukan pemanggilan GHASH tambahan untuk inisialisasi counter.
   * **Aturan Kritis Nonce:** Nonce dibangkitkan baru dan acak via CSPRNG untuk setiap payload proposal. Nonce tidak dirahasiakan, namun **pantang digunakan ulang** (*never reuse a nonce under the same key*) demi mencegah kebocoran *keystream* (*two-time pad*) dan pemalsuan tag GHASH.
3. **Panjang Authentication Tag (`TAG_LENGTH = 16`):**
   * Ditetapkan 16 byte (128 bit), yaitu ukuran penuh output GHASH, memberikan probabilitas pemalsuan tag acak sebesar $2^{-128}$ (praktis mustahil dipalsukan).
4. **Additional Authenticated Data (AAD):**
   * Format AAD kanonis yang diterapkan: `proyek:${proyekId}|student:${studentId}`.
   * AAD menjamin bahwa paket data proposal mahasiswa yang sah tidak dapat didekripsi jika disuntikkan ke dalam relasi proyek lain (*context separation*).
5. **Siklus Hidup & Kebijakan Penyimpanan Kunci (K3 Rubrik Kriptografi):**
   * **Siklus Hidup (NIST SP 800-57):** *Bangkitkan › Simpan › Muat › Pakai › Ganti › Musnahkan*.
   * **Pembangkitan (CSPRNG):** Kunci master dibangkitkan menggunakan CSPRNG sistem operasi (`crypto.randomBytes(32)`).
   * **Penyimpanan di Luar Repositori:** Kunci disimpan di luar direktori kode sumber dan repositori Git (path default: `~/.studance/master.key` atau via environment variable `STUDANCE_MASTER_KEY`). Berkas di dalam repositori dilarang mutlak dan telah diamankan oleh `.gitignore` (`*.key`, `*.pem`, `.env*`).
   * **Izin Berkas Ketat (POSIX mode 0o600):** Pada sistem POSIX/Linux, berkas kunci wajib berizin `0o600` (hanya pemilik yang dapat membaca/menulis). Sistem secara aktif memeriksa `st_mode & 0o077` saat memuat kunci; jika izin terlalu terbuka (misal `0o644` atau `0o666`), proses digagalkan secara *fail-closed*.
   * **Catatan Kompatibilitas Windows:** Pada Windows OS host, bit izin POSIX group/other tidak berlaku secara native sehingga file disimpan di direktori profil pengguna pengguna aktif (`%USERPROFILE%\.studance\master.key`) dengan fallback environment variable dan verifikasi simulasi izin pada pengujian otomatis.
   * **Pencegahan Penimpaan Kunci (O_EXCL):** Penyimpanan kunci menggunakan flag `wx` (`O_CREAT | O_EXCL`) sehingga kunci lama tidak dapat tertimpa secara tidak sengaja (*anti-loss protection*).

6. **Penurunan Kunci HKDF (RFC 5869) & Prinsip "Satu Kunci, Satu Tujuan":**
   * Berdasarkan NIST SP 800-57 Part 1 §5.2 (*Key Usage*), sebuah kunci kriptografi tidak boleh digunakan untuk keperluan ganda (misal: kunci enkripsi tidak boleh dipakai sebagai kunci HMAC).
   * Modul `lib/crypto/key-manager.ts` menerapkan HKDF-SHA256 (RFC 5869) untuk menurunkan subkunci independen dari master key:
     $$K_{\text{sub}} = \text{HKDF-Expand}(\text{HKDF-Extract}(\text{salt}=\emptyset, \text{IKM}=\text{MasterKey}), \text{info}=\text{"studance:v0.2:"} \parallel \text{purpose}, L=32)$$
   * Subkunci `proposal-encryption` terisolasi secara matematis dari subkunci `badge-token` dan `audit-log`.

7. **Batas Kepercayaan Masukan (*Input Trust Boundary*) & Strict Allowlist (OWASP):**
   * Berdasarkan prinsip *Trust Boundary* (slide Pekan 6), seluruh data yang melintasi batas sistem dari luar dianggap tidak tepercaya.
   * Modul `lib/crypto/input-validator.ts` menegakkan:
     * **Strict Allowlist:** Menolak masukan yang memuat properti tak dikenal di luar skema (*anti-prototype pollution / injection*).
     * **Normalisasi Unicode NFC:** Mengonversi representasi string masukan ke format *Unicode Normalization Form C* (`str.normalize('NFC')`), menjamin kesamaan byte kanonis antara masukan biner NFC dan NFD (menangkal anomali byte yang merusak kalkulasi hash/tag).
     * **Validasi Tipe Ketat & Numerik Aman:** Menolak nilai `NaN`, `Infinity`, bilangan negatif, serta konversi implisit tipe `boolean` (menghindari jebakan `True == 1`).
     * **Prinsip Fail-Closed:** Masukan cacat langsung melempar `ValidationError` deskriptif tanpa memproses fungsi kriptografi internal.

---

## 4. Evaluasi Skenario Uji (Automated Test Strategy & Failure Responses)

Pengujian sistem dibagi menjadi dua suite otomatis yang mencakup 10 skenario evaluasi (2 positif + 8 uji kondisi tidak sah/negatif), memenuhi skor penuh kriteria K4:

### 4.1 Suite 1: Enkripsi Simetris AES-256-GCM (`lib/crypto/tests/symmetric.test.ts`)
1. **[UJI-01] Positive Round-trip Verification:**
   Membuktikan enkripsi payload penawaran mahasiswa dan dekripsi menghasilkan objek yang identik secara deterministik, serta membuktikan bahwa dua proses enkripsi berurutan menghasilkan nonce yang berbeda.
2. **[UJI-02] Ciphertext Tampering Test (Kondisi Tidak Sah 1):**
   Membalikkan 1 bit pada badan ciphertext. Sistem bereaksi secara *fail-closed* dengan melemparkan eksepsi deskriptif: `InvalidTag: Autentikasi integritas data gagal`. Plaintext yang rusak tidak pernah diekspos ke memori aplikasi.
3. **[UJI-03] Wrong Key Test (Kondisi Tidak Sah 2):**
   Mendekripsi paket proposal valid menggunakan kunci simetris 256-bit lain. Autentikasi tag GHASH seketika menolak proses dan memicu error `InvalidTag`.
4. **[UJI-04] Context-Swapping / AAD Tampering Test (Kondisi Tidak Sah 3):**
   Mendekripsi paket data sah tetapi menyertakan `proyekId` atau `studentId` yang berbeda pada parameter AAD. Tag verifikasi gagal seketika, membuktikan konteks kepemilikan proposal terkunci rapat.
5. **[UJI-05] Broken Connection Test (Integrasi Modul Tugas 1):**
   Menguji sambungan fungsi `calculateDocumentHash` & `verifyDocumentIntegrity` dari Tugas 1 (`document-signer.ts`). Apabila lampiran berkas dimodifikasi di media penyimpanan, sistem mendeteksi ketidaksesuaian digest terhadap hash yang tersimpan di dalam Proposal Vault.

### 4.2 Suite 2: Manajemen Kunci & Batas Validasi Masukan (`lib/crypto/tests/key-and-validation.test.ts`)
6. **[UJI-K01] Uji CSPRNG & O_EXCL File Storage:**
   Membuktikan bahwa kunci master dibangkitkan dari sumber acak CSPRNG 256-bit dan flag `O_EXCL` (`wx`) berhasil menolak penimpaan file kunci yang sudah ada (*FileExistsError*).
7. **[UJI-K02] Uji HKDF Derivation (RFC 5869):**
   Membuktikan bahwa subkunci untuk tujuan `proposal-encryption` berbeda dari subkunci `badge-token`, keduanya berbeda dari master key, serta bersifat deterministik untuk konteks yang sama.
8. **[UJI-K03] Uji Normalisasi Masukan (Unicode NFC vs NFD):**
   Membuktikan bahwa string dengan representasi byte berbeda (NFC vs NFD) dinormalkan secara seragam di batas sistem sehingga menghasilkan serialisasi dan tag verifikasi yang konsisten.
9. **[UJI-K04] Uji Negatif Masukan Cacat (Strict Allowlist & Fail-Closed):**
   Membuktikan bahwa injeksi properti asing, nilai `NaN`, `Infinity`, `boolean`, dan angka negatif ditolak seketika oleh `ValidationError` sebelum menyentuh fungsi kriptografi.
10. **[UJI-K05] Uji Kunci Rusak & Izin Terlalu Terbuka:**
    Membuktikan bahwa berkas kunci dengan izin terlalu terbuka (`0o644`) serta berkas kunci dengan panjang tidak valid (< 32 byte) langsung ditolak secara *fail-closed* oleh `KeyManagementError`.

---

## 5. Keterbatasan Mekanisme Saat Ini & Rencana Pengembangan Lanjutan

Meskipun AES-256-GCM menjamin kerahasiaan (*confidentiality*) dan integritas (*integrity*) data penawaran:
1. **Ketiadaan Nirsangkal (*Non-Repudiation*):**
   Karena menggunakan kriptografi simetris (*shared secret*), setiap entitas yang memegang kunci simetris memiliki kemampuan yang sama untuk mengenkripsi dan mendekripsi data. Apabila terjadi sengketa antara mahasiswa dan klien, kunci simetris tidak dapat membuktikan secara hukum pihak mana yang secara sah menyusun proposal tersebut (tidak ada jaminan nirsangkal).
2. **Tantangan Distribusi Kunci (*Key Distribution Problem*):**
   Jika klien dan mahasiswa harus saling berbagi kunci simetris secara langsung, dibutuhkan saluran aman (*secure channel*) untuk pertukaran kunci.
3. **Pondasi Milestone Tugas 3 & 4:**
   Keterbatasan ini menjadi dasar akademis mengapa pada **Tugas 3 dan 4 Kriptografi**, Studance akan mengadopsi **Kriptografi Kunci Publik Asimetris (Digital Signature - RSA / Ed25519)** untuk penandatanganan penawaran (*bid signing*), sehingga integritas, kerahasiaan, dan nirsangkal (*non-repudiation*) tercapai secara komprehensif.


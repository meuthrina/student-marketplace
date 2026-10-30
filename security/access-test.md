# MATRIKS KONTROL AKSES & DOKUMEN UJI AKSES PER PERAN (RBAC / ABAC)
**Produk:** Studance — Student Freelance Marketplace  
**Milestone:** `sec-0.2` (Pekan 4 – Persiapan Tugas 2 KKS)  
**Mata Kuliah:** Keamanan Komputasi dan Siber (CS5-2026, Universitas Pertamina)  
**Standar Acuan:** NIST SP 800-162 (ABAC), NIST SP 800-30, OWASP Top 10:2025 (A01: Broken Access Control), Stallings & Brown (2018) Bab 4  

---

## 1. Kaitan Langsung dengan Risk Register (NIST SP 800-30)

Dokumen ini disusun sebagai wujud implementasi rencana kontrol mitigasi terhadap risiko prioritas tertinggi (*Very High*) pada `security/risk-register.md`:

| Risk ID | Threat ID | Kategori STRIDE | Tingkat Risiko | Deskripsi Risiko | Rencana Kontrol (Mitigation Plan) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R-02** | **T-09** | **Elevation of Privilege** / Broken Access Control | **16 (Very High)** | Pemeriksaan hak akses hanya terjadi di tingkat antarmuka/middleware optimistik; penyerang dengan akun mahasiswa dapat memanggil Server Action atau endpoint Klien secara langsung. | Penerapan validasi otorisasi berbasis peran (RBAC) dan atribut (ABAC) di setiap Server Action & Route Handler, disertai dokumentasi matriks uji dan skenario uji negatif (*Negative Testing*). |

### Temuan Kondisi Awal (Baseline Audit)
1. **Server Action `simpanProyek` (`app/client/projects/actions.ts`):** Menggunakan fallback `sesi?.email || "klien@pertamina.ac.id"` tanpa memvalidasi apakah pengguna memiliki sesi aktif dan apakah perannya adalah `CLIENT`.
2. **Middleware Guard (`proxy.ts`):** Hanya mengecek keberadaan fisik cookie (`request.cookies.has('sesi')`), tanpa verifikasi kriptografi token dan tanpa pengecekan peran (`role`).
3. **Prinsip *Default Deny*:** Belum ditegakkan secara menyeluruh pada Server Action, melanggar prinsip *fail-safe defaults*.

---

## 2. Definisi Subjek, Objek, dan Hak Akses (Access Matrix Model)

Berdasarkan Stallings & Brown (2018 Bab 4), sistem kontrol akses membagi komponen menjadi:
* **Subject ($S$):** Pengguna atau proses yang meminta akses (`Guest`, `Student`, `Client`, `Admin`).
* **Object ($O$):** Sumber daya yang dilindungi (katalog publik, proyek kampus, form penerbitan proyek, Server Action, pengajuan penawaran, verifikasi mahasiswa, log audit).
* **Access Right ($A$):** Jenis operasi yang diizinkan (`read`, `write/create`, `update`, `delete`, `execute`).

### Hierarki & Definisi Peran (Roles)
1. **Guest (Unauthenticated Visitor):** Pengunjung anonim yang belum melakukan proses login.
2. **Student (Mahasiswa):**
   * *Unverified Student:* Mahasiswa terdaftar namun belum memvalidasi email institusi / lencana kampus.
   * *Verified Student:* Mahasiswa yang telah memvalidasi email domain `@student.universitaspertamina.ac.id` melalui OTP CSPRNG+HMAC.
3. **Client (Klien / Pemberi Kerja):** Pihak mitra, UMKM, unit fakultas, atau mahasiswa senior yang menerbitkan kebutuhan proyek.
4. **Admin (System Administrator):** Akun tata kelola platform dengan hak pengawasan dan audit kepatuhan.

---

## 3. Matriks Kontrol Akses Per Peran (RBAC Matrix)

Setiap entri memetakan izin operasi subjek terhadap objek dengan prinsip **Default Deny** (seluruh akses ditolak kecuali didefinisikan secara eksplisit):

| No | Sumber Daya / Operasi (Object) | Endpoint / Action Terkait | Guest | Student (Unverified) | Student (Verified) | Client | Admin |
| :-: | :--- | :--- | :-: | :-: | :-: | :-: | :-: |
| **O-01** | Lihat Katalog Proyek Publik | `GET /projects` | **ALLOW** (Read) | **ALLOW** (Read) | **ALLOW** (Read) | **ALLOW** (Read) | **ALLOW** (Read) |
| **O-02** | Lihat Proyek Eksklusif Kampus | `GET /projects` (Scope: Campus) | **DENY** | **DENY** | **ALLOW** (Read) | **DENY** | **ALLOW** (Read) |
| **O-03** | Lihat Detail Proyek | `GET /projects/[id]` | **ALLOW** (Read) | **ALLOW** (Read) | **ALLOW** (Read) | **ALLOW** (Read) | **ALLOW** (Read) |
| **O-04** | Buka Halaman Buat Proyek | `GET /client/projects/create` | **DENY** (Redirect `/login`) | **DENY** (Redirect `/projects`) | **DENY** (Redirect `/projects`) | **ALLOW** (Read) | **ALLOW** (Read) |
| **O-05** | Eksekusi Server Action Buat Proyek | `POST simpanProyek()` | **DENY** (401/403) | **DENY** (403) | **DENY** (403) | **ALLOW** (Create) | **ALLOW** (Create) |
| **O-06** | Pengajuan Proposal/Penawaran (Bid) | `POST ajukanBid()` | **DENY** (401) | **ALLOW** (Hanya Proyek Publik) | **ALLOW** (Publik & Kampus) | **DENY** (403 - Separation of Duty) | **DENY** (403) |
| **O-07** | Akses Form Verifikasi Mahasiswa | `GET /auth/verify-student` | **DENY** (Redirect `/login`) | **ALLOW** | **ALLOW** (View Status) | **DENY** (403) | **ALLOW** (Manage) |
| **O-08** | Eksekusi Verifikasi OTP Kampus | `POST verifikasiOTP()` | **DENY** (401) | **ALLOW** | **DENY** (Already Verified) | **DENY** (403) | **ALLOW** |
| **O-09** | Akses Berkas & Catatan Log Audit | `security/*` / Log Viewer | **DENY** (403) | **DENY** (403) | **DENY** (403) | **DENY** (403) | **ALLOW** (Read-Only) |

---

## 4. Kebijakan Kontrol Berbasis Atribut (ABAC Policy Rules)

Mengacu pada **NIST SP 800-162**, beberapa sumber daya memerlukan evaluasi kontekstual melebihi label peran statis (ABAC):

### Aturan ABAC 1: Pembatasan Penawaran Proyek Khusus Kampus (*Campus-Specific Projects*)
```text
ALLOW ajukanBid(Subject, Project) IF:
    Subject.role == "STUDENT"
    AND Subject.isVerifiedStudent == TRUE
    AND (
        Project.scope == "PUBLIC"
        OR (
            Project.scope == "CAMPUS_SPECIFIC"
            AND Subject.campusDomain == Project.targetCampusDomain
        )
    )
ELSE:
    DENY ("Hanya mahasiswa terverifikasi dari kampus bersangkutan yang dapat mengajukan penawaran.")
```

### Aturan ABAC 2: Pemisahan Tugas (*Separation of Duty*) Penerbit dan Penawar
```text
DENY ajukanBid(Subject, Project) IF:
    Subject.id == Project.clientId
    OR Subject.role == "CLIENT"
REASON:
    "Klien tidak diperkenankan mengajukan penawaran pada proyek (mencegah penipuan escrow/reputasi palsu)."
```

---

## 5. Skenario Pengujian Akses Negatif (*Negative Testing Protocol*)

Uji negatif membuktikan bahwa pembatasan hak akses bekerja secara efektif dan menolak upaya eskalasi hak istimewa (*Elevation of Privilege*) secara konsisten di sisi server:

### Skenario 1 (NEG-01): Akses Langsung Halaman Klien oleh Tamu (Guest)
* **Kondisi Awal:** Peramban tidak memiliki cookie `sesi`.
* **Aksi Uji:** Pengguna mengakses URL `http://localhost:3000/client/projects/create`.
* **Hasil yang Diharapkan:**
  * Penjaga rute (`proxy.ts`) mencegat permintaan.
  * Respon HTTP dialihkan (*307 Temporary Redirect*) ke `/login`.
  * Halaman formulir pembuatan proyek sama sekali tidak dirender ke DOM.

### Skenario 2 (NEG-02): Eksekusi Server Action `simpanProyek()` oleh Mahasiswa (Student)
* **Kondisi Awal:** Pengguna masuk sebagai Mahasiswa (`nadia.putri@student.universitaspertamina.ac.id`, role: `STUDENT`).
* **Aksi Uji:** Melakukan panggilan fungsi Server Action `simpanProyek(formData)` secara manual atau melalui console/skrip HTTP.
* **Hasil yang Diharapkan:**
  * Server Action membaca sesi aktif via `bacaSesi()`.
  * Evaluasi otorisasi server mendeteksi `sesi.role !== "CLIENT"`.
  * Eksekusi dihentikan seketika (*fail-safe*); tidak ada mutasi data pada `daftarProyek`.
  * Respon mengembalikan objek status:
    ```json
    {
      "status": "error",
      "pesan": "Akses Ditolak: Hanya akun Klien yang berhak menerbitkan proyek."
    }
    ```

### Skenario 3 (NEG-03): Penawaran Proyek Kampus oleh Mahasiswa Belum Terverifikasi
* **Kondisi Awal:** Pengguna masuk sebagai Mahasiswa umum dari domain non-kampus atau belum memverifikasi OTP (`isVerifiedStudent: false`).
* **Aksi Uji:** Mengklik tombol ajukan penawaran pada proyek berlabel `CAMPUS_SPECIFIC` (Universitas Pertamina).
* **Hasil yang Diharapkan:**
  * Sistem antarmuka menonaktifkan modal bid dan menampilkan lencana peringatan.
  * Jika request `ajukanBid()` dikirim paksa melalui API/Action, server memvalidasi flag atribut subjek dan menolak dengan pesan: `"Silakan lengkapi verifikasi email kampus Anda sebelum mengajukan penawaran pada proyek ini."`.

### Skenario 4 (NEG-04): Klien Mencoba Mengajukan Penawaran pada Proyek Sendiri
* **Kondisi Awal:** Pengguna masuk sebagai Klien (`klien@pertamina.ac.id`, role: `CLIENT`).
* **Aksi Uji:** Mengakses endpoint pengajuan bid terhadap proyek miliknya sendiri.
* **Hasil yang Diharapkan:**
  * Server Action menolak mutasi dengan aturan *Separation of Duty*.
  * Kode status / respon: Error 403 Forbidden.

### Skenario 5 (NEG-05): Upaya Pembacaan Berkas Log Audit oleh Pengguna Non-Admin
* **Kondisi Awal:** Pengguna login sebagai `STUDENT` atau `CLIENT`.
* **Aksi Uji:** Melakukan request ke endpoint atau rute internal yang membaca berkas `security/*.md`.
* **Hasil yang Diharapkan:**
  * Akses ditolak secara tegas (HTTP 403 Forbidden).
  * Sistem mencatat upaya akses ilegal ke dalam log audit keamanan.

---

## 6. Status Kepatuhan & Checklist Implementasi Tugas 2 (sec-0.2)

- [x] Matriks RBAC per peran disusun dan dipetakan ke seluruh sumber daya MVP Studance.
- [x] Aturan ABAC untuk *Campus-Specific Projects* dan *Separation of Duty* diformulasikan.
- [x] 5 skenario uji negatif (*Negative Testing*) terdefinisi dengan hasil harapan yang terukur.
- [ ] Pengikatan validasi otorisasi `sesi.role === "CLIENT"` pada Server Action `simpanProyek` (Tugas 2 Web / KKS).
- [ ] Implementasi pengujian otomatis (*Automated Negative Unit Test*) menggunakan Vitest/Playwright.


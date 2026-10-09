### DOKUMENTASI ARSITEKTUR & DATA FLOW DIAGRAM (DFD) LEVEL 0

**Nama Produk:** Student Freelance Marketplace (MVP)

**Tujuan Dokumentasi:** Landasan Arsitektur Web, Mekanisme Kriptografi, dan Pemodelan Keamanan Sistem

---

## 1. Pendahuluan & Grounding Metodologi

Dokumen ini berisi spesifikasi Data Flow Diagram (DFD) Level 0 dan pemetaan Batas Kepercayaan (*Trust Boundaries*) untuk platform *Student Freelance Marketplace* (MVP). Metodologi perancangan DFD ini mematuhi kaidah perancangan sistem dan pemodelan ancaman berstandar **Adam Shostack (*Threat Modeling: Designing for Security*)** serta **NIST SP 800-30 Rev. 1 / NIST CSF 2.0**.

### 1.1 Penyelarasan Integrasi 3 Mata Kuliah

1. **Pengembangan Aplikasi Web (52355):**
Menggambarkan arsitektur *Client-Server*, pola *rendering* Next.js (App Router, Server Actions, API Routes), interaksi browser, serta persistensi data pada PostgreSQL melalui Prisma ORM.


2. **Kriptografi (52357):**
Menitikberatkan pada transmisi kredensial/payload sensitif terenkripsi (TLS 1.3), hashing data autentikasi, serta pembentukan One-Time Token/HMAC untuk verifikasi status mahasiswa.


3. **Keamanan Komputasi dan Siber (52353):**
Menjadi landasan analisis entitas dan *data flow* yang melintasi *Trust Boundaries* (TB1, TB2, TB3), pengelolaan isolasi kontainer Docker, kontrol akses berbasis peran (RBAC), serta pencatatan audit log.



---

## 2. Legenda Notasi DFD & Representasi Elemen

Sesuai standar pemodelan DFD baku (Shostack, Bab 1–3), setiap elemen visual memiliki fungsi dan batasan teknis sebagai berikut:

| Notasi Geometri | Warna / Gaya Visual | Tipe Elemen | Deskripsi & Cakupan Teknis |
| --- | --- | --- | --- |
| **Persegi Panjang Tajam** | Pink / Merah Muda (`#f9f`) | **External Entity (EE)** | Pihak, aktor, atau sistem eksternal di luar kendali batas ekosistem aplikasi yang berinteraksi mengirim atau menerima data. |
| **Lingkaran / Oval** | Ungu / Biru (`#bbf`) | **Process (P)** | Komponen kode program atau modul eksekusi aktif (*runtime*) yang memproses, mentransformasikan, atau memvalidasi aliran data. |
| **Paralelogram / Open Box** | Hijau Muda (`#dfd`) | **Data Store (DS)** | Media penyimpanan data persisten (*state*) seperti basis data relasional, direktori berkas, atau sistem log. |
| **Garis Panah Berarah** | Garis Hitam Solid | **Data Flow (F)** | Aliran objek data/informasi spesifik yang berpindah antar-elemen. **Wajib berupa kata benda / payload spesifik** (bukan kata kerja). |
| **Batas Kotak Putus-Putus** | Garis Terisolasi (Sub-graph) | **Trust Boundary (TB)** | Perimeter yang menandai perubahan tingkat kepercayaan (*privilege/trust level*) atau batas jaringan/lingkungan eksekusi. |

---

## 3. Visualisasi DFD Level 0 & Trust Boundaries

Catatan: Gambar diagram DFD Level 0 dapat dilihat pada berkas gambar `../assets/data-flow-diagram.png` di repositori proyek.

![Data Flow Diagram](../assets/data-flow-diagram.png)

---

## 4. Rincian Elemen DFD & Batas Kepercayaan (Trust Boundaries)

### 4.1 Identifikasi Trust Boundaries (TB)

* **TB1 (Public / Untrusted Network Boundary):**
Perimeter luar yang mencakup entitas publik (browser mahasiswa dan klien). Area ini sepenuhnya berada di luar kendali server (*untrusted zone*) dan berisiko terhadap penyadapan jaringan (*eavesdropping*), manipulasi paket, serta serangan berbasis klien.


* **TB2 (Application Server Environment - Docker Host):**
Perimeter lingkungan eksekusi internal aplikasi web di dalam *isolated container/host*. Membatasi lalu lintas eksternal dan mewajibkan enkripsi TLS serta validasi/sanitasi ketat untuk setiap payload data yang masuk dari TB1.


* **TB3 (Internal Data & Restricted Storage Zone):**
Perimeter keamanan tertinggi untuk komponen penyimpan data persisten (*Data Stores*). Mengisolasi PostgreSQL, audit log, dan berkas portofolio dari akses internet langsung. Hanya modul aplikasi internal (`Process 1`) yang memiliki otorisasi kueri terenkripsi ke zona ini.



### 4.2 Katalog Elemen DFD, Contoh Spesifik, dan Penjelasan

#### A. External Entities (EE)

* **`E1: Student / Freelancer (Browser)`**
*Deskripsi:* Pengguna bertipe Mahasiswa Aktif yang mengakses sistem melalui peramban web.


*Contoh Konkret:* Mahasiswa Universitas Pertamina yang membuka aplikasi dari laptopnya untuk memperbarui profil, melamar proyek, dan mengunggah berkas portofolio.
* **`E2: Client / Project Owner (Browser)`**
*Deskripsi:* Pengguna bertipe Klien yang memublikasikan proyek dan mencari talent.


*Contoh Konkret:* Dosen, pengurus organisasi mahasiswa, UMKM, atau perusahaan eksternal yang membuka lowongan pekerjaan lepas dan meninjau tawaran (*bids*) yang masuk.
* **`E3: Third-Party Email / Campus Auth Service`**
*Deskripsi:* Layanan otentikasi/email eksternal untuk verifikasi identitas sivitas akademika.


*Contoh Konkret:* Server SMTP Universitas Pertamina atau Google Workspace for Education yang mengirimkan kode OTP/link konfirmasi ke alamat `@student.universitaspertamina.ac.id`.

#### B. Processes (P)

* **`P1: Next.js Web Application & API`**
*Deskripsi:* Core server aplikasi (Next.js App Router) yang menangani rendering UI, penanganan API/Server Actions, dan kontrol akses RBAC.


*Contoh Konkret:* Route Handler `/api/projects` yang menerima filter pencarian proyek, melakukan verifikasi sesi JWT/Cookie pengguna, dan mengembalikan daftar proyek dalam format JSON.


* **`P2: Auth & Verification Module`**
*Deskripsi:* Modul logika keamanan yang memvalidasi kredensial, mengelola pendaftaran, dan memverifikasi klaim status mahasiswa aktif.


*Contoh Konkret:* Fungsi server backend yang menerima kode OTP verifikasi kampus, mencocokkan hash token, dan memperbarui atribut `is_verified_student = true` pada profil pengguna.



#### C. Data Stores (DS)

* **`DS1: PostgreSQL Database`**
*Deskripsi:* Penyimpanan data relasional terenkripsi untuk entitas bisnis utama.


*Contoh Konkret:* Tabel `users`, `projects`, `bids`, dan `roles` yang dikelola melalui Prisma ORM dengan skema relasional.


* **`DS2: System & Audit Logs`**
*Deskripsi:* Penyimpanan catatan riwayat aktivitas keamanan aplikasi secara persisten (*append-only*).


*Contoh Konkret:* File log terstruktur yang mencatat stempel waktu (*timestamp*), IP address, User ID, dan jenis kejadian (misal: `LOGIN_SUCCESS`, `UNAUTHORIZED_ACCESS_ATTEMPT`, `ROLE_CHANGE`).


* **`DS3: File Storage (Portfolios & Attachments)`**
*Deskripsi:* Penyimpanan terisolasi untuk berkas unggahan pengguna.


*Contoh Konkret:* Direktori terproteksi pada server/volume Docker yang menampung file portofolio Mahasiswa (`PDF/PNG`) dan dokumen spesifikasi proyek dari Klien.



#### D. Data Flows (F)

* **`F1: Auth Credentials, Profile Data, Bid Payload`**
*Asal:* `E1` $\rightarrow$ *Tujuan:* `P1`
*Contoh Konkret:* Paket JSON berisi email mahasiswa, kata sandi (saat login), atau formulir penawaran proyek berisi estimasi biaya, durasi pengerjaan, dan pesan penawaran.


* **`F2: Project List, Verification Status, UI Response`**
*Asal:* `P1` $\rightarrow$ *Tujuan:* `E1`
*Contoh Konkret:* Respon HTML/JSON yang dikirim ke browser mahasiswa memuat daftar proyek terbuka, lencana status terverifikasi, dan komponen antarmuka pengguna.


* **`F3: Client Credentials, Project Spec, Escrow Mock Status`**
*Asal:* `E2` $\rightarrow$ *Tujuan:* `P1`
*Contoh Konkret:* Data formulir pembuatan proyek baru dari Klien (judul, deskripsi kebutuhan, anggaran, batas waktu) serta status simulasi deposit dana (*mock escrow*).


* **`F4: Candidate Bids, Student Verified Badges`**
*Asal:* `P1` $\rightarrow$ *Tujuan:* `E2`
*Contoh Konkret:* Tampilan antarmuka dasbor Klien yang menampilkan daftar mahasiswa yang melamar beserta skor reputasi dan lencana verifikasi kampus.


* **`F5: Verification Request (Campus Domain/OTP)`**
*Asal:* `P1` $\rightarrow$ *Tujuan:* `E3`
*Contoh Konkret:* Panggilan API/SMTP outbound dari server aplikasi ke layanan email eksternal untuk mengirimkan email berisi 6 digit kode OTP verifikasi ke akun mahasiswa.


* **`F6: Verification Response / Token`**
*Asal:* `E3` $\rightarrow$ *Tujuan:* `P2`
*Contoh Konkret:* Payload konfirmasi balik atau token callback yang dikirim saat mahasiswa mengklik tautan verifikasi email kampus.


* **`F7: Validated Student Status`**
*Asal:* `P2` $\rightarrow$ *Tujuan:* `P1`
*Contoh Konkret:* Objek status internal (misal: `{ userId: "STD-105224029", verified: true, campus: "Universitas Pertamina" }`) yang diteruskan dari modul autentikasi ke logika utama aplikasi.


* **`F8: SQL Read/Write (Users, Projects, Bids)`**
*Asal:* `P1` $\rightarrow$ *Tujuan:* `DS1` (dan sebaliknya)
*Contoh Konkret:* Kueri SQL terparameterisasi lewat Prisma ORM, seperti `INSERT INTO bids ...` atau `SELECT * FROM projects WHERE campus_restriction = 'UP'`.


* **`F9: Append Audit Log (Login, RBAC Changes)`**
*Asal:* `P1` $\rightarrow$ *Tujuan:* `DS2`
*Contoh Konkret:* Penulisan string JSON log satu arah, seperti `{"timestamp": "2026-10-09T09:43:00Z", "event": "FAILED_LOGIN", "ip": "182.253.x.x"}`.


* **`F10: Read/Write Attachments (Portfolio Files)`**
*Asal:* `P1` $\rightarrow$ *Tujuan:* `DS3` (dan sebaliknya)
*Contoh Konkret:* Operasi I/O penyimpanan berkas stream PDF portofolio ke direktori `/uploads/portfolios/` atau pembacaan berkas lampiran saat diunduh Klien.

---

## 5. Referensi Literatur & Acuan Akademis

1. **Shostack, A. (2014).** *Threat Modeling: Designing for Security*. John Wiley & Sons.


2. **National Institute of Standards and Technology (NIST). (2012).** *Guide for Conducting Risk Assessments*. NIST Special Publication 800-30 Rev. 1.


3. **National Institute of Standards and Technology (NIST). (2024).** *The NIST Cybersecurity Framework (CSF) 2.0*. NIST CSWP 29.


4. **OWASP Foundation. (2025).** *OWASP Top 10:2025 - Application Security Risks*.


5. **Rencana Pembelajaran Semester (RPS) Universitas Pertamina (2026):**
* RPS Pengembangan Aplikasi Web (Kode MK: 52355)


* RPS Kriptografi (Kode MK: 52357)


* RPS Keamanan Komputasi dan Siber (Kode MK: 52353)
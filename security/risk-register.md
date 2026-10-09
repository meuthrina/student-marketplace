### RISK REGISTER & PENILAIAN RISIKO (NIST SP 800-30)

**Produk:** Student Freelance Marketplace (MVP)

**Metodologi Standar:** NIST SP 800-30 (*Conducting Risk Assessments*) & Shostack (*Threat Modeling*)

---

### 1. Metodologi Skala Penilaian & Matriks Risiko

Sesuai panduan resmi Tugas 1 Keamanan Komputasi dan Siber (KKS), penilaian tingkat risiko dirumuskan sebagai:

$$\text{Risk Level} = \text{Likelihood (L)} \times \text{Impact (I)}$$

#### A. Kriteria Skala Likelihood (Kemungkinan)



* **5 (Very High):** Dapat dieksploitasi dari internet tanpa akun dengan *tools* otomatis; tidak ada *control*; atau ada *exploit* publik.


* **4 (High):** Dapat dieksploitasi dari internet, cukup dengan akun biasa atau teknik yang terdokumentasi luas; *control* lemah.


* **3 (Moderate):** Memerlukan kondisi tertentu atau pengetahuan tentang sistem; ada *control* parsial.


* **2 (Low):** Memerlukan akses lokal atau *privilege* tinggi; *control* yang ada efektif untuk sebagian besar skenario.


* **1 (Very Low):** Hampir mustahil tanpa kombinasi beberapa kegagalan; *control* berlapis sudah diterapkan dan diuji.



#### B. Kriteria Skala Impact (Dampak)



* **5 (Very High):** Seluruh data pribadi bocor/rusak, server diambil alih, atau layanan tidak dapat dipulihkan; kewajiban notifikasi UU PDP.


* **4 (High):** Data pribadi sebagian pengguna bocor/terubah; akun admin disalahgunakan; layanan mati berjam-jam.


* **3 (Moderate):** Data satu pengguna terdampak atau fungsi penting terganggu sementara; dapat dipulihkan dari *backup*.


* **2 (Low):** Gangguan kecil pada fungsi non-kritis; tidak ada data pribadi terdampak.


* **1 (Very Low):** Dampak dapat diabaikan (informasi publik atau tampilan terganggu sesaat).



#### C. Matriks Tingkat Risiko (*Risk Level*)



* **Very High (15–25):** Tangani segera; wajib masuk *risk* prioritas (Penanganan Utama Tugas 1–4).


* **High (8–14):** Tangani pada tugas terdekat.


* **Moderate (4–7):** Rencanakan *control*; pantau.


* **Low (1–3):** Dapat diterima (*accept*) dengan alasan.



---

### 2. Tabel Risk Register

Setiap *Risk ID* (`R-xx`) secara tepat terhubung ke *Threat ID* (`T-xx`) dari dokumen `security/threat-model.md` sebelumnya.

| Risk ID | Threat ID | Control Saat Ini | L | Alasan L | I | Alasan I | Risk Level | Response | Rencana Control | Target Tugas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **R-01** | **T-08** | Tidak ada firewall host; port 5432 terekspos | **5** | Port 5432 terekspos ke internet tanpa proteksi firewall sehingga dapat discan tools otomatis. | **5** | Pengambilalihan/penghapusan basis data memicu kehilangan data permanen dan pelanggaran UU PDP. | **25 VH** | **Mitigate** | Bind PostgreSQL hanya ke loopback/docker network internal, konfigurasikan UFW firewall, ganti kredensial default. | **Tugas 3 (KKS)**<br> |
| **R-02** | **T-09** | Pemeriksaan *role* hanya ada pada middleware UI | **4** | Cukup dengan akun mahasiswa biasa, penyerang dapat menebak endpoint API Next.js dan mengubah ID resource. | **4** | Mahasiswa biasa dapat mengubah status penawaran, mengambil hak akses Klien, atau memanipulasi data pengguna lain. | **16 VH** | **Mitigate** | Penerapan validasi otorisasi RBAC/ABAC di setiap *Route Handler* dan *Server Action* Next.js, serta pengujian akses per peran. | **Tugas 2 (KKS) / Tugas 4 (Web)**<br> |
| **R-03** | **T-11** | Pembatasan ekstensi file sederhana di sisi klien | **4** | Pengguna terautentikasi dapat mengunggah file webshell/executable dengan mencegat request API unggahan portofolio. | **4** | Eksekusi file berbahaya di server dapat berujung pada *Remote Code Execution* dan akses file sensitif. | **16 VH** | **Mitigate** | Validasi MIME-type berbasis magic bytes di server, pembatasan ekstensi ketat (PDF/PNG saja), penyimpanan file di direktori non-executable. | **Tugas 3 (KKS)**<br> |
| **R-04** | **T-01** | Validasi format email baku tanpa *rate limiting* | **4** | Dapat dieksploitasi dari internet dengan akun/script otomatis brute force karena tidak ada pembatasan request. | **4** | Penguasaan akun mahasiswa terverifikasi secara massal dapat merusak reputasi platform dan membocorkan data pribadi. | **16 VH** | **Mitigate** | Penerapan *rate limiting* pada endpoint auth menggunakan Redis/Upstash, hashing kata sandi dengan Argon2id, dan MFA/OTP. | **Tugas 2 (KKS) / Tugas 4 (Web)**<br> |
| **R-05** | **T-10** | Penggenerasian token verifikasi berbasis timestamp/random standar | **3** | Memerlukan pengetahuan logika token verifikasi email kampus untuk melakukan tebakan (*brute force token*). | **5** | Penyerang eksternal dapat memalsukan lencana *Verified Student* Universitas Pertamina, merusak nilai tawar utama produk. | **15 VH** | **Mitigate** | Penggunaan cryptographically secure pseudo-random number generator (CSPRNG) dengan HMAC-SHA256 untuk One-Time Token bertempo kedaluwarsa singkat. | **Tugas 3 (KKS) / Tugas 3 (Kripto)**<br> |
| **R-06** | **T-02** | Penggunaan koneksi HTTP standar saat pengembangan | **3** | Memerlukan posisi man-in-the-middle di jaringan Wi-Fi publik yang sama dengan pengguna. | **4** | Paket penawaran proyek dan kredensial terintersepsi di jaringan publik, membocorkan data sensitif. | **12 High** | **Mitigate** | Penerapan sertifikat SSL/TLS 1.3 mandiri/Let's Encrypt, pemaksaan HTTPS via HSTS header. | **Tugas 3 (KKS)**<br> |
| **R-07** | **T-03** | Validasi form sederhana di UI | **3** | Klien terautentikasi dapat mengubah paket HTTP request anggaran sebelum dikirim ke server. | **3** | Nilai deposit escrow terganggu sementara dan memerlukan penyesuaian manual dari basis data backup. | **9 High** | **Mitigate** | Validasi skema input ganda di sisi server menggunakan Zod pada Server Actions Next.js. | **Tugas 2 (Web)**<br> |
| **R-08** | **T-04** | Log aplikasi standar tanpa identitas pengguna terpusat | **3** | Memerlukan penyalahgunaan wewenang atau aksi arbitrer dari pengguna yang telah masuk ke sistem. | **3** | Penyangkalan tindakan transaksi tidak dapat dibuktikan karena ketiadaan log audit yang sah. | **9 High** | **Mitigate** | Penerapan log audit terstruktur berbasis JSON (*append-only*) yang mencatat User ID, IP, dan stempel waktu UTC. | **Tugas 4 (KKS)**<br> |
| **R-09** | **T-05** | Otorisasi berbasis ID umum | **3** | Penyerang harus menebak UUID/ID profil mahasiswa pada URL endpoint API. | **3** | Data pribadi satu mahasiswa (NIM, email, kontak) dapat diakses pihak tak berhak. | **9 High** | **Mitigate** | Pemastian kontrol akses berbasis otorisasi pemilik data pada kueri basis data Prisma. | **Tugas 2 (Web)**<br> |
| **R-10** | **T-07** | Server Next.js standar tanpa reverse proxy | **3** | Memerlukan skrip pengirim beban berulang (*traffic flooding*) ke server aplikasi. | **3** | Layanan aplikasi web menjadi lambat atau tidak merespon (*downtime* sementara). | **9 High** | **Mitigate** | Pembatasan ukuran payload request unggahan dan penambahan reverse proxy Nginx / Cloudflare. | **Tugas 3 (KKS)**<br> |
| **R-11** | **T-06** | Mode environment `development` | **2** | Memerlukan kondisi kueri error yang disengaja oleh pengguna. | **1** | Tampak pesan galat teknis di layar browser tanpa membocorkan data pribadi pengguna. | **2 Low** | **Accept** | Mengatur `NODE_ENV=production` saat pengujian rilis; dampak pada lingkungan lab dapat diabaikan. | **Final Project**<br> |

---

### 3. Penetapan 5 Risiko Prioritas (*Very High*) & Justifikasi Produk

Berdasarkan hasil perkalian $L \times I$ pada tabel di atas, ditetapkan **5 Risiko Prioritas Utama (Skor 15–25 / Very High)** yang wajib mendapatkan penanganan pengetatan kontrol pada Tugas berikutnya / 2–4:

1. **R-01 (T-08 | Skor: 25 - Very High): Eksposur Port Basis Data PostgreSQL ke Publik**
* *Justifikasi Produk:* Sebagai produk MVP berbasis Docker, basis data `DS1` menyimpan seluruh asset data pengguna dan proyek. Ketiadaan konfigurasi firewall host yang mengunci port 5432 membuat basis data dapat langsung diakses dari internet, berisiko tinggi terhadap pengambilalihan atau perusakan data secara total.




2. **R-02 (T-09 | Skor: 16 - Very High): Broken Access Control / Elevation of Privilege pada Endpoint Next.js**
* *Justifikasi Produk:* Fitur utama platform membedakan hak akses Mahasiswa dan Klien. Jika otorisasi hanya diperiksa di tingkat UI/Middleware Next.js tanpa pengecekan di setiap handler API, Mahasiswa dapat memanggil endpoint Klien secara langsung (*IDOR*), merusak logika bisnis marketplace.




3. **R-03 (T-11 | Skor: 16 - Very High): Eksekusi File Berbahaya (Webshell) via Unggahan Portofolio**
* *Justifikasi Produk:* Mengunggah berkas portofolio (`DS3`) adalah *core loop* Mahasiswa. Tanpa validasi *magic bytes* di sisi server, penyerang dapat mengunggah skrip berbahaya yang dieksekusi oleh runtime server, menyebabkan kebocoran kontrol server secara penuh.




4. **R-04 (T-01 | Skor: 16 - Very High): Serangan Brute Force & Credential Stuffing pada Akun Pengguna**
* *Justifikasi Produk:* Platform mengelola identitas Mahasiswa dan Klien. Ketiadaan pembatasan laju permintaan (*rate limiting*) memungkinkan penyerang menguasai akun-akun mahasiswa terverifikasi secara massal menggunakan metode otomatisasi.




5. **R-05 (T-10 | Skor: 15 - Very High): Pemalsuan Token Verifikasi Identitas Mahasiswa Kampus**
* *Justifikasi Produk:* Diferensiasi nilai jual (*core value*) utama produk ini dibanding Fiverr/Upwork adalah *Verified Student Status* (khususnya untuk *Campus-Specific Projects*). Jika generator OTP/Token verifikasi mudah ditebak, legitimasi identitas mahasiswa di platform akan runtuh.





---

### 4. Rencana Kontrol & Peta Keterikatan Tugas Akademis (Tugas 2–4)

Tabel di bawah menguraikan pemetaan rencana kontrol konkret untuk 5 risiko prioritas di atas yang terintegrasi langsung dengan RPS 3 Mata Kuliah:

| Risk ID | Rencana Kontrol Spesifik (*Mitigation Plan*) | Integrasi Mata Kuliah & Tugas Akademis |
| --- | --- | --- |
| **R-01** | - Konfigurasi `docker-compose` untuk memastikan port `5432` hanya terikat pada `127.0.0.1` (loopback).<br>- Penerapan aturan UFW firewall (*Default Deny*) pada server host.<br>- Pengubahan password default PostgreSQL dan pengaktifan koneksi terinternalisasi. | **KKS (Tugas 3):** Keamanan Jaringan dan Data (Pengerasan Firewall & Segmentasi). |
| **R-02** | - Penerapan pengecekan otorisasi berbasis peran (RBAC) secara eksplisit di dalam setiap Server Action dan Route Handler Next.js.<br>- Pengujian otomatis perannya (*role-based unit test*) menggunakan Vitest/Playwright. | **Web Prog (Tugas 4):** Keamanan & Pengujian.<br><br>**KKS (Tugas 2):** Kontrol Akses & Pengerasan Sistem. |
| **R-03** | - Penambahan fungsi validasi *magic bytes* (header file) di server Next.js sebelum menyimpan file unggahan.<br>- Pembatasan ekstensi ketat hanya `.pdf`, `.png`, `.jpg`.<br>- Penyimpanan file pada direktori terisolasi dengan hak akses *non-executable*. | **Web Prog (Tugas 2/3):** Server Actions & File Handling.<br><br>**KKS (Tugas 3):** Keamanan Data & System Hardening. |
| **R-04** | - Implementasi *rate limiting* berbasis IP dan User ID pada endpoint `/api/auth/*`.<br>- Proteksi hashing kata sandi menggunakan fungsi lambat Argon2id/bcrypt dengan *salt*.<br>- Penambahan mekanisme penguncian akun sementara setelah 5 kali percobaan gagal. | **Web Prog (Tugas 4):** Autentikasi & Mitigasi OWASP.<br><br>**KKS (Tugas 2):** Autentikasi Kuat. |
| **R-05** | - Penggenerasian token One-Time Password (OTP) 6-digit menggunakan modul `crypto` berbasis CSPRNG.<br>- Pembentukan signature token menggunakan HMAC-SHA256 berbatas waktu (kedaluwarsa dalam 15 menit).<br>- Penghapusan token seketika setelah 1 kali pemakaian (*single-use token*). | **Kriptografi (Tugas 3):** Prototipe Terintegrasi (Fungsi Hash, HMAC, CSPRNG).<br><br>**Web Prog (Tugas 3):** API & Verifikasi Layanan. |
### TABEL THREAT MODEL (STRIDE-PER-ELEMENT)

Dokumentasi ini memuat identifikasi **11 Ancaman STRIDE** yang dipetakan langsung dari elemen-elemen DFD Level 0 *Student Freelance Marketplace* (`security/assets/data-flow-diagram.png`). Analisis difokuskan utama pada elemen dan *data flow* yang melintasi *Trust Boundaries* (TB1, TB2, TB3).

Format penulisan *Threat Statement* menggunakan standar baku NIST SP 800-30 / Adam Shostack (*Threat Modeling*):

`[Threat Source] dapat [tindakan] terhadap [elemen/asset] melalui [cara/kelemahan], sehingga [impact].`

---

### Tabel Threat Model

| ID | Elemen | STRIDE | Threat Statement (Format Baku NIST / Shostack) | Asset Terdampak |
| --- | --- | --- | --- | --- |
| **T-01** | `F1` | **S** | Attacker oportunistik dapat melakukan *credential stuffing* atau *brute force* pada formulir login mahasiswa (`F1`) melalui ketiadaan *rate limiting* pada endpoint authentication (`P1`), sehingga akun mahasiswa sah dapat dikuasai oleh pihak tak berwenang (*Spoofing Identity*). | Kredensial & Akses Akun Mahasiswa |
| **T-02** | `F1` | **T** | Attacker pada jaringan publik (*untrusted zone* TB1) dapat mencegat dan mengubah *payload bidding* proyek (`F1`) melalui serangan *Man-in-the-Middle* (MitM) jika transmisi tidak dipaksa menggunakan HTTPS/TLS 1.3, sehingga nilai penawaran proyek mahasiswa berubah tanpa izin (*Tampering*). | Integritas Penawaran Proyek (*Bids*) |
| **T-03** | `F3` | **T** | Klien jahat dapat memanipulasi parameter HTTP (*request tampering*) pada spesifikasi nilai anggaran proyek (`F3`) sebelum disimpan melalui kelemahan validasi input di sisi server (`P1`), sehingga nilai deposit proyek (*escrow mock*) berbeda dari yang dipublikasikan (*Tampering*). | Data Anggaran & Escrow Proyek |
| **T-04** | `DS2` | **R** | Pengguna yang menyalahgunakan hak akses dapat menyangkal telah melakukan tindakan perubahan data sensitif karena sistem log (`DS2`) tidak mencatat identitas akun unik dan stempel waktu (*timestamp*) yang dapat diverifikasi secara terpusat, sehingga jejak aktivitas tidak dapat diaudit (*Repudiation*). | Akuntabilitas Audit Log Sistem |
| **T-05** | `F2` | **I** | Attacker luar dapat menyadap dan membaca data pribadi sensitif mahasiswa (NIM, email, riwayat portofolio) pada `F2` melalui *Insecure Direct Object Reference* (IDOR) atau endpoint API publik yang tidak terotorisasi (`P1`), sehingga terjadi kebocoran data pribadi (*Information Disclosure*). | Data Pribadi Mahasiswa (PII) |
| **T-06** | `P1` | **I** | Attacker dapat mengekstraksi informasi struktur basis data dan skema tabel dari `DS1` melalui pesan kesalahan internal (*stack trace*) yang ditayangkan secara publik oleh `P1` saat kueri mengalami kegagalan, sehingga mengekspos kerentanan arsitektur server (*Information Disclosure*). | Skema & Arsitektur Internal Basis Data |
| **T-07** | `P1` | **D** | Attacker dapat melumpuhkan ketersediaan aplikasi web Next.js (`P1`) dengan mengirimkan ribuan permintaan *payload* unggahan berkas palsu atau kueri berat secara serentak, sehingga menghabiskan memori dan CPU server (*Denial of Service*). | Ketersediaan Layanan Aplikasi (`P1`) |
| **T-08** | `DS1` | **D** | Attacker yang berhasil melakukan penembusan pada kontainer Docker dapat menghapus atau merusak seluruh isi basis data `DS1` melalui port PostgreSQL (5432) yang terekspos langsung ke jaringan luar tanpa proteksi *firewall* berbasis host, sehingga menyebabkan kehilangan data permanen (*Denial of Service*). | Keutuhan & Ketersediaan Data Basis Data |
| **T-09** | `P1` | **E** | Mahasiswa terverifikasi dapat mengakses dan mengubah data proyek klien lain melalui pengubahan parameter ID pada *Route Handler* Next.js (`P1`) akibat ketiadaan pemeriksaan otorisasi berbasis peran (*RBAC / Broken Access Control*), sehingga pengguna biasa mendapatkan hak akses setingkat Admin/Klien (*Elevation of Privilege*). | Otorisasi Akses & Peran (*RBAC*) |
| **T-10** | `P2` | **S** | Pihak luar dapat memalsukan status sebagai mahasiswa terverifikasi Universitas Pertamina pada `P2` dengan memanfaatkan *Predictable Verification Token/OTP* (`F6`) yang tidak menggunakan algoritma Kriptografi yang aman (HMAC/SHA-256), sehingga akun luar mendapatkan lencana *Verified Student* (*Spoofing Identity*). | Keabsahan Lencana *Verified Student* |
| **T-11** | `DS3` | **T** | Attacker dapat mengunggah berkas eksekutabel berbahaya (*malicious file/webshell*) ke dalam penyimpanan portofolio `DS3` melalui formulir unggahan berkas `F10` yang tidak memiliki validasi tipe berkas (*MIME-type*) dan pembatasan ekstensi, sehingga kode berbahaya dapat dieksekusi di server (*Tampering / Remote Code Execution*). | Integritas Server & File Storage (`DS3`) |

---

### Catatan:

* **Penggunaan ID (`T-01` s.d. `T-11`):** ID ini ditetapkan secara permanen dan akan dirujuk secara konsisten pada penugasan *Risk Assessment / Risk Register* (`security/risk-register.md`) serta pengujian kontrol keamanan berikutnya.


* **Kepatuhan Format:** Seluruh *Threat Statement* memuat *Threat Source*, *Tindakan*, *Elemen/Asset*, *Kelemahan*, dan *Impact* sesuai panduan penulisan baku Shostack & NIST SP 800-30.
# CATATAN AUDIT SISTEM OPERASI & PENGURASAN HAK AKSES LINUX (SYSTEM HARDENING)
**Produk:** Studance — Student Freelance Marketplace  
**Milestone:** `sec-0.2` (Pekan 4 – Persiapan Tugas 2 KKS)  
**Mata Kuliah:** Keamanan Komputasi dan Siber (CS5-2026, Universitas Pertamina)  
**Target Environment:** VM Linux Server (Ubuntu 24.04 LTS / Debian) Host Kontainer Studance  
**Standar Acuan:** CIS Ubuntu Linux Benchmark v2.0, NIST SP 800-30, Stallings & Brown (2018) Bab 12  

---

## 1. Kaitan dengan Risk Register & Prinsip *Least Privilege*

Sesuai materi Pekan 4 dan tabel `security/risk-register.md`, pengerasan sistem operasi pada host aplikasi memitigasi ancaman berikut:

| Kategori STRIDE | Ancaman Konkret | Dampak pada Studance | Kontrol Mitigasi Pekan 4 |
| :--- | :--- | :--- | :--- |
| **Elevation of Privilege** | Akun non-root atau proses penyusup memperoleh hak UID 0 / root | Pengambilalihan VM hosting, perusakan image kontainer dan database | Audit UID 0 ketat, penonaktifan login root langsung, sudo terbatas per-command via `visudo` |
| **Information Disclosure** | Kredensial database dan JWT secret pada berkas `.env` terbaca akun sistem lain | Kebocoran rahasia platform, pemalsuan sesi, kebocoran data pengguna | Pembatasan hak akses berkas `chmod 640 .env` atau `600`, pemisahan group `deploy:app` |
| **Tampering** | Berkas konfigurasi atau `.env` dimodifikasi oleh proses tanpa izin | Manipulasi parameter runtime sistem atau pembelokan alamat database | Hak tulis (*write*) hanya diberikan secara eksklusif kepada akun `deploy` |

---

## 2. Baseline Konfigurasi Akun, Pengguna, dan Grup

Kernel Linux mengevaluasi hak akses berdasarkan User ID (**UID**) dan Group ID (**GID**), bukan berdasarkan nama akun. Seluruh akun dengan **UID 0** memiliki hak istimewa root penuh tanpa batasan.

### 2.1. Pemisahan Peran Pengguna Khusus Aplikasi
Untuk menghindari pengoperasian runtime aplikasi dengan hak akses root (yang melanggar prinsip *least privilege*), dibuat akun dan grup layanan tersendiri:

```bash
# 1. Membuat grup sistem aplikasi
sudo groupadd app

# 2. Membuat pengguna deployment non-root dengan direktori home dan shell terbatas
sudo useradd -m -s /bin/bash -G app deploy

# 3. Memverifikasi pembuatan akun dan keanggotaan grup
getent passwd deploy
# Output diharapkan: deploy:x:1001:1001::/home/deploy:/bin/bash

getent group app
# Output diharapkan: app:x:1001:deploy
```

### 2.2. Audit Akun Ber-UID 0 (Pencegahan Backdoor / Rogue Accounts)
Pemeriksaan berkala pada basis data `/etc/passwd` memastikan tidak ada akun tersembunyi yang memiliki UID 0 selain akun `root`:

```bash
# Perintah Audit UID 0:
awk -F: '$3 == 0' /etc/passwd

# Baseline Output yang Sah (Tepat 1 baris):
root:x:0:0:root:/root:/bin/bash
```
*Kriteria Lulus Checkpoint:* Jika terdapat baris tambahan selain `root` (misalnya `admin:x:0:...`), sistem dinyatakan **terkompromi** dan akun terkait wajib segera dinonaktifkan.

---

## 3. Pengerasan Hak Akses Direktori Aplikasi dan Berkas Rahasia (`.env`)

Direktori kerja aplikasi pada server production ditempatkan di path `/srv/studance` dengan penetapan izin akses yang ketat mengacu pada notasi oktal POSIX:

### 3.1. Penataan Kepemilikan dan Permission
```bash
# 1. Menyerahkan kepemilikan direktori kepada akun deploy dan grup app
sudo chown -R deploy:app /srv/studance

# 2. Mengatur hak akses direktori utama (rwxr-x--- = 750)
# Owner (deploy): read, write, execute (cd)
# Group (app): read, execute (cd)
# Others: tidak ada akses sama sekali
sudo chmod 750 /srv/studance

# 3. Mengatur hak akses berkas konfigurasi rahasia .env (rw-r----- = 640)
# Owner (deploy): read, write
# Group (app): read-only
# Others: TIDAK BOLEH MEMBACA ATAU MENGUBAH
sudo chmod 640 /srv/studance/.env
```

### 3.2. Rincian Notasi Oktal Berkas `.env` (`640`)
| Klasifikasi | Simbol Izin | Nilai Oktal | Deskripsi Operasional |
| :--- | :---: | :---: | :--- |
| **Owner (deploy)** | `rw-` | `4 + 2 + 0 = 6` | Dapat membaca dan memperbarui isi konfigurasi rahasia saat proses deployment. |
| **Group (app)** | `r--` | `4 + 0 + 0 = 4` | Proses runtime aplikasi Next.js/Node.js yang berjalan di bawah grup `app` dapat membaca rahasia. |
| **Others (Dunia Luar)** | `---` | `0 + 0 + 0 = 0` | Pengguna lain, akun daemon web (misal `nobody` / `www-data`), atau proses luar sama sekali tidak dapat melihat isi rahasia. |

*Alternatif Lebih Ketat:* Jika kontainer dijalankan langsung oleh pengguna `deploy`, izin dapat diperketat menjadi **`chmod 600 /srv/studance/.env`** (`rw-------`).

### 3.3. Penegakan Kebijakan `umask`
* Nilai default umask Linux standar (`022`) secara otomatis memberi izin `644` pada berkas baru yang mengakibatkan berkas dapat dibaca oleh seluruh akun sistem (*others*).
* Untuk akun `deploy`, disetel umask aman pada `~/.bashrc`:
  ```bash
  umask 027
  ```
  *Efek:* Berkas baru otomatis dibuat dengan hak akses `640` dan direktori baru dengan hak akses `750`.

---

## 4. Konfigurasi `sudo` Terbatas Berprinsip *Least Privilege*

Sesuai materi slide 25, pemberian hak `NOPASSWD: ALL` merupakan anti-pattern berbahaya yang setara dengan memberikan akses root penuh tanpa autentikasi sekunder.

### 4.1. Pembuatan Aturan Sudoers Khusus Akun Deploy
Hak `sudo` untuk akun `deploy` dibatasi hanya untuk perintah spesifik pengelolaan kontainer Docker, dikonfigurasi melalui berkas drop-in `/etc/sudoers.d/deploy` dengan editor tervalidasi `visudo`:

```bash
# Membuka editor konfigurasi sudoers khusus
sudo visudo -f /etc/sudoers.d/deploy
```

**Isi Konfigurasi `/etc/sudoers.d/deploy`:**
```sudoers
# Mengizinkan akun deploy merestart dan memeriksa status layanan kontainer Docker tanpa hak root penuh
deploy ALL=(root) /usr/bin/systemctl restart docker, /usr/bin/systemctl status docker, /usr/bin/docker compose *
```

### 4.2. Validasi Hak Akses Sudo
Verifikasi hak istimewa yang dimiliki pengguna `deploy`:
```bash
sudo -l -U deploy
```
*Hasil yang Diharapkan:* Menampilkan daftar terbatas dari perintah yang didelegasikan di atas, bukan `(ALL : ALL) ALL`.

---

## 5. Audit Program Khusus (`setuid` / `setgid`)

Program dengan bit `setuid` (`4xxx`) berjalan dengan hak akses pemilik berkas (biasanya `root`). Jika utilitas arbitrer memiliki bit setuid aktif, penyerang dapat memanfaatkannya untuk eskalasi hak istimewa (*Privilege Escalation*).

```bash
# Perintah audit program setuid di seluruh filesystem:
sudo find / -xdev -perm -4000 -type f 2>/dev/null
```
*Daftar yang Diizinkan (Standard Core Utilities):*
* `/usr/bin/passwd`
* `/usr/bin/sudo`
* `/usr/bin/su`
* `/usr/bin/newgrp`
* `/usr/bin/gpasswd`

*Peringatan Audit:* Jika ditemukan biner seperti `/bin/bash`, `vim`, `python`, atau utilitas aplikasi kustom memiliki flag `4000`, maka flag tersebut wajib segera dicabut (`sudo chmod u-s <path-file>`).

---

## 6. Protokol Uji Verifikasi & Uji Negatif (Checkpoints)

Mengikuti panduan Checkpoint Pekan 4 (Slide 27), berikut matriks verifikasi pengerasan sistem sebelum dan sesudah konfigurasi diterapkan:

| No | Parameter Pemeriksaan | Perintah Audit Verifikasi | Hasil yang Diharapkan (Pass Criteria) | Keterangan Uji |
| :-: | :--- | :--- | :--- | :--- |
| **CK-01** | Integritas Akun UID 0 | `awk -F: '$3 == 0' /etc/passwd` | Tepat satu baris: `root:x:0:0:...` | Memastikan tiada akun rogue ber-UID 0. |
| **CK-02** | Metadata & Permission `.env` | `stat -c "%A %U %G" /srv/studance/.env` | `-rw-r----- deploy app` (atau `-rw------- deploy deploy`) | Hak akses tidak mengizinkan read/write pada *others*. |
| **CK-03** | **Uji Negatif Pembacaan Secrets** | `sudo -u nobody cat /srv/studance/.env` | `cat: /srv/studance/.env: Permission denied` | **Uji Negatif Wajib:** Menolak akses baca dari subjek yang tidak berhak. |
| **CK-04** | **Uji Negatif Penulisan Direktori** | `sudo -u nobody touch /srv/studance/test.txt` | `touch: cannot touch '/srv/studance/test.txt': Permission denied` | Mencegah penempatan skrip liar oleh akun luar. |
| **CK-05** | Pembatasan Wewenang Sudo | `sudo -l -U deploy` | Hanya mencantumkan perintah `systemctl` & `docker` | Larangan akses shell tak terbatas (`/bin/sh` / `ALL`). |
| **CK-06** | Status Keanggotaan Grup Sudo | `getent group sudo docker` | Akun `deploy` tidak dimasukkan secara gegabah ke grup `sudo` tanpa batas | Meminimalkan *attack surface*. |

---

## 7. Catatan Log Perubahan (Evidence Log untuk Tugas 2 / sec-0.2)

* **Tanggal Konfigurasi Baseline:** 30 Oktober 2026
* **Status Hardening VM:** Baseline hak akses Linux pekan 4 selesai dan diverifikasi.
* **Tautan Latihan Pekan 5:** Integrasi hasil audit Lynis, konfigurasi drop-in SSH, dan perencanaan patch management otomatis pada Bab 8 di bawah ini.

---

## 8. Audit Baseline Sistem Operasi (Pekan 5: Lynis)

### 8.1. Ringkasan Eksekutif Baseline (Audit Awal)
Audit baseline sistem operasi dilakukan menggunakan *tool* kepatuhan dan audit keamanan sumber terbuka **Lynis 3.1.6** (CISOfy). Rekaman mentah pemindaian awal sebelum tindakan pengerasan disimpan pada berkas [`security/lynis-before.txt`](file:///d:/Career%20Database/04%20Projects/Academic/student-marketplace/security/lynis-before.txt).

* **Hardening Index Awal (Baseline Score):** **66 / 100** `[#############       ]`
* **Tanggal Pelaksanaan Audit:** 30 Oktober 2026
* **Versi Lynis:** 3.1.6 (Database build 2025/2026)
* **Lingkungan Host Pengujian:** Ubuntu 26.04 LTS (x86_64, Kernel `6.18.33.1`, Hostname `IMANDWTYII`, Lingkungan Virtualisasi WSL2)
* **Ringkasan Metrik Pengujian:**
  * **Total Pengujian Dijalankan (`Tests performed`):** 244 tes
  * **Peringatan Kritis (`Warnings`):** **1** (`[PKGS-7392]` — Paket rentan belum diperbarui)
  * **Rekomendasi Saran (`Suggestions`):** **37** butir
  * **Status Komponen Perangkat Lunak:**
    * Firewall: `[V]` Terdeteksi aktif
    * Intrusion Software (IDS/IPS): `[X]` Tidak ditemukan
    * Malware Scanner: `[X]` Tidak ditemukan

> [!NOTE]
> Skor Hardening Index awal sebesar 66 menunjukkan bahwa sistem operasi berada dalam kondisi instalasi standar yang belum diamankan secara spesifik untuk lingkungan produksi (*out-of-the-box*). Berdasarkan target Sub-CPMK 3 MK Keamanan Komputasi dan Siber, indeks ini wajib ditingkatkan melampaui ambang batas minimal **70** melalui konfigurasi pengerasan SSH, patch management, dan pengetatan parameter kernel.

---

### 8.2. Tabel Pemetaan Temuan Lynis vs Risk Register

Sesuai metodologi NIST SP 800-30 dan slide kuliah Pekan 5, perbaikan tidak dilakukan secara membabi-buta (*blind fixing*), melainkan dipilih berdasarkan relevansi terhadap profil produk Studance dan register risiko (`security/risk-register.md`). Keputusan "Tidak Diterapkan" yang beralasan teknis valid bernilai setara dengan kontrol yang diterapkan.

| No | Test ID Lynis | Deskripsi Temuan Lynis | Korelasi Risk ID & STRIDE | Status Keputusan | Justifikasi Teknis & Tindakan Terpilih |
| :-: | :---: | :--- | :--- | :---: | :--- |
| **1** | `SSH-7408` | *SSH Daemon Hardening*: Port dan konfigurasi SSH belum diperkeras; pada saat baseline awal, daemon SSH belum aktif (`Checking running SSH daemon: NOT FOUND`). | **R-02 (T-09)** (*Elevation of Privilege*) & **R-04 (T-01)** (*Brute Force / Spoofing*) | **Diterapkan** | Diterapkan konfigurasi SSH drop-in CIS Level 1 (`00-hardening.conf`): mematikan login root, menolak autentikasi kata sandi, mewajibkan kunci publik Ed25519, dan membatasi hanya untuk pengguna `deploy`. Menutup jalur kompromi akun administratif server. |
| **2** | `PKGS-7392` | *Found one or more vulnerable packages / Outdated packages*: Terdeteksi paket sistem yang memiliki kerentanan keamanan dan memerlukan pembaruan. | **R-01 (T-08)** (*Host Exposure*) & **R-02 (T-09)** (*Elevation of Privilege via Exploit*) | **Diterapkan** | Diterapkan pembaruan menyeluruh `apt update && apt upgrade` serta konfigurasi otomatis pembaruan keamanan harian melalui `unattended-upgrades`. Mitigasi eksploitasi kerentanan tingkat sistem seperti kasus *regreSSHion* (CVE-2024-6387). |
| **3** | `FILE-7524` & `AUTH-9328` | *Restrict file permissions*: Izin direktori sistem `/etc/cron.*` dan berkas crontab longgar; default umask tidak didefinisikan secara eksplisit di `/etc/login.defs`. | **R-01 (T-08)** & **R-08 (T-04)** (*Information Disclosure & Tampering*) | **Diterapkan** | Mengetatkan hak akses direktori penjadwalan berkala (`chmod 700 /etc/cron.*`) dan menegakkan `umask 027` pada konfigurasi sistem serta lingkungan pengguna `deploy` agar setiap berkas baru otomatis tertutup bagi *others* (`640`/`750`). |
| **4** | `BANN-7126` & `BANN-7130` | *Add legal banner to `/etc/issue` and `/etc/issue.net`*: Ketiadaan peringatan hukum saat pengguna atau bot terhubung ke sesi terminal host. | **R-08 (T-04)** (*Repudiation / Non-repudiation Defense*) | **Diterapkan** | Menambahkan banner peringatan resmi hak akses sistem Studance pada `/etc/issue` dan `/etc/issue.net`. Memberikan dasar hukum yang kuat bahwa akses tidak sah dilarang dan seluruh aktivitas dimonitor. |
| **5** | `KRNL-6000` | *Sysctl kernel parameter tweaking*: Nilai parameter kernel berbeda dari profil rekomendasi (misal: `accept_redirects`, `log_martians`, `dmesg_restrict`). | **R-01 (T-08)** (*Network Spoofing & Information Disclosure*) | **Diterapkan** | Menyetel parameter pengerasan jaringan dan memori pada `/etc/sysctl.d/99-hardening.conf`: menolak ICMP redirects (`accept_redirects = 0`), mengaktifkan pencatatan martian packets (`log_martians = 1`), dan membatasi akses dmesg (`kernel.dmesg_restrict = 1`). |
| **6** | `HRDN-7230` | *Install malware scanner (rkhunter / chkrootkit / ClamAV)*: Sistem tidak memiliki pemindai berkas jahat otomatis periodik. | *Risiko Rendah Host Lab* (Tidak ada korelasi langsung pada core MVP) | **Tidak Diterapkan (Residual Risk)** | Lingkungan VM lab/WSL2 berfokus pada runtime kontainer Docker terisolasi dan penghematan utilisasi CPU/RAM. Ancaman berkas berbahaya dari pengguna ditangani secara independen pada layer aplikasi melalui validasi MIME type & magic bytes (R-03). Diterima sebagai *residual risk*. |
| **7** | `FILE-6310` | *Separate partition for `/home` and `/var`*: Filesystem menggunakan partisi tunggal tanpa pemisahan mount point. | **R-10 (T-07)** (*Denial of Service via Disk Exhaustion*) | **Ditunda (Residual Risk)** | Pembuatan partisi disk terpisah berisiko merusak struktur storage virtual (VHDX WSL2 / VM lab) dan menambah overhead manajemen partisi. Mitigasi penumpukan data dialihkan ke pembatasan kuota volume Docker dan retensi log `systemd-journald`. |

---

### 8.3. Rencana Pengerasan SSH (CIS Benchmark Level 1)

SSH merupakan pintu masuk administratif utama yang paling sering menjadi sasaran pemindaian dan serangan berbasis kamus (*credential stuffing/brute force*). Sesuai materi Pekan 5 (Slide 12), implementasi konfigurasi dilakukan menggunakan berkas drop-in agar tidak menimpa berkas utama distributor dan menjamin aturan **First Match Wins**.

#### A. Spesifikasi Berkas Drop-In Acuan
Telah dibuat berkas konfigurasi acuan di repositori pada path [`security/config/00-hardening.conf`](file:///d:/Career%20Database/04%20Projects%20Academic/student-marketplace/security/config/00-hardening.conf) yang dirancang untuk disalin ke `/etc/ssh/sshd_config.d/00-hardening.conf` pada host Linux:

```text
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
```

#### B. Justifikasi Teknis Parameter Keamanan (CIS Level 1)
1. **`PermitRootLogin no`**: Mematikan opsi autentikasi langsung sebagai superuser `root`. Setiap administrator wajib masuk sebagai pengguna non-root (`deploy`) terlebih dahulu, sehingga menciptakan jejak audit akuntabel (*accountability*).
2. **`PasswordAuthentication no` & `KbdInteractiveAuthentication no`**: Menutup seluruh jalur autentikasi berbasis kata sandi (dua pintu password wajib ditutup bersamaan). Menghilangkan risiko serangan tebakan kredensial secara online (*online password guessing*).
3. **`PubkeyAuthentication yes`**: Hanya mengizinkan pertukaran kunci kriptografis asimetris modern (disarankan kurva eliptik `Ed25519`). Kunci privat tidak pernah dikirimkan melalui kabel jaringan.
4. **`AllowUsers deploy`**: Menerapkan prinsip *default-deny*. Hanya akun pengguna yang secara eksplisit didaftarkan yang diizinkan menginisiasi sesi SSH; akun sistem lain otomatis ditolak.
5. **`MaxAuthTries 3`**: Membatasi percobaan autentikasi maksimal 3 kali per koneksi sebelum sesi diputus paksa.
6. **`LoginGraceTime 30`**: Memperpendek waktu tunggu pra-autentikasi menjadi 30 detik (default 120 detik). Pembatasan ini memperkecil jendela paparan terhadap kerentanan unauthenticated race-condition seperti kasus *regreSSHion* (CVE-2024-6387) tanpa membuka celah DoS.
7. **`X11Forwarding no`**: Menonaktifkan pengalihan antarmuka grafis X11 yang tidak diperlukan pada server headless, memangkas *attack surface*.

#### C. Prosedur Uji Sintaks & Restart Layanan
```bash
# 1. Menguji validitas sintaks konfigurasi sshd sebelum me-restart layanan
sudo sshd -t

# 2. Me-restart layanan SSH hanya jika uji sintaks sukses (exit code 0)
sudo systemctl restart ssh
```

#### D. Verifikasi Konfigurasi Efektif & Uji Negatif
Sesuai panduan Slide 13, bukti verifikasi konfigurasi dievaluasi melalui dua tahap:
1. **Pemeriksaan Runtime Configuration (`sshd -T`):**
   ```bash
   sudo sshd -T | grep -Ei "permitrootlogin|passwordauth|kbdinteractive|allowusers|maxauthtries"
   ```
   *Keluaran Diharapkan:*
   ```text
   permitrootlogin no
   passwordauthentication no
   kbdinteractiveauthentication no
   allowusers deploy
   maxauthtries 3
   ```
2. **Pengujian Uji Negatif (*Negative Testing* dari Host Klien):**
   * **Uji Negatif 1 (Penolakan Kata Sandi):**
     ```bash
     ssh -o PubkeyAuthentication=no deploy@<ip-server>
     ```
     *Hasil Diharapkan:* `deploy@<ip-server>: Permission denied (publickey).`
   * **Uji Negatif 2 (Penolakan Login Root Langsung):**
     ```bash
     ssh root@<ip-server>
     ```
     *Hasil Diharapkan:* `root@<ip-server>: Permission denied (publickey).`

---

### 8.4. Rencana Patch Management Sistem & Pencegahan Regresi

Konfigurasi pengerasan (*hardening*) tidak dapat menggantikan kelemahan kode biner perangkat lunak (*software vulnerability*), sebagaimana terbukti pada studi kasus *regreSSHion* (CVE-2024-6387). Oleh karena itu, pengerasan SSH wajib ditopang oleh manajemen patch yang berkesinambungan.

#### A. Arsitektur 3 Lapisan Patching
1. **Lapisan 1: Sistem Operasi Host (Pekan 5):** Pembaruan berkala pustaka dasar Linux (`glibc`, `openssh-server`, `kernel`, `systemd`) melalui manajer paket `apt`.
2. **Lapisan 2: Image Kontainer Docker (Pekan 6):** Pembangunan ulang image kontainer berbasis *distroless* atau Alpine minimal dan pemindaian kerentanan image secara berkala.
3. **Lapisan 3: Dependensi Aplikasi (Pekan 6):** Pemantauan dan audit pustaka dependensi Node.js / Next.js melalui `npm audit` guna mencegah *software supply chain attack*.

#### B. Konfigurasi Pembaruan Keamanan Otomatis (`unattended-upgrades`)
Untuk memastikan patch keamanan terpasang tanpa intervensi manual harian, diaktifkan modul `unattended-upgrades`:

```bash
# 1. Memastikan paket terpasang
sudo apt update && sudo apt install -y unattended-upgrades update-notifier-common

# 2. Mengaktifkan penjadwalan pembaruan pada /etc/apt/apt.conf.d/20auto-upgrades
sudo tee /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

# 3. Uji simulasi pembaruan keamanan tanpa eksekusi langsung
sudo unattended-upgrade --dry-run --debug
```

#### C. Pemantauan Kebutuhan Reboot & Riwayat Audit
Pembaruan kernel atau pustaka krusial (seperti `glibc`) baru aktif setelah layanan di-restart atau sistem di-reboot:
```bash
# Memeriksa apakah pembaruan memerlukan restart server host
if [ -f /var/run/reboot-required ]; then
    echo "[PERINGATAN] Server memerlukan reboot untuk mengaktifkan patch keamanan."
    cat /var/run/reboot-required.pkgs
fi

# Memantau riwayat log instalasi patch otomatis
less /var/log/unattended-upgrades/unattended-upgrades.log
```

---

### 8.5. Hasil Audit Pasca-Pengerasan (Post-Hardening Lynis Score) & Pembuktian Tugas 2

Setelah implementasi kontrol pengerasan menyeluruh berstandar CIS Benchmark Level 1, dilakukan pemindaian ulang menggunakan Lynis. Rekaman lengkap tersimpan pada berkas [`security/lynis-after.txt`](file:///d:/Career%20Database/04%20Projects/Academic/student-marketplace/security/lynis-after.txt).

#### A. Perbandingan Metrik Audit (Before vs After)

| Parameter Evaluasi | Kondisi Awal (`lynis-before.txt`) | Pasca Drop-in SSH Awal | Hasil Akhir Pengerasan (`lynis-after.txt`) | Status Capaian Rubrik Tugas 2 |
| :--- | :---: | :---: | :---: | :---: |
| **Hardening Index** | **66 / 100** | 68 / 100 | **80 / 100** | **LULUS** (Target minimal 70 terlampaui) |
| **Status Visual Bar** | `[#############       ]` | `[#############       ]` | `[################    ]` | Peningkatan signifikan (+14 poin) |
| **Tests Performed** | 244 tes | 244 tes | 245 tes | Evaluasi komprehensif |
| **Peringatan (Warnings)** | 1 (`PKGS-7392`) | 0 | **0** | Seluruh warning kritis teratasi |
| **SSH Daemon Status** | `NOT FOUND` | `ACTIVE (68)` | `HARDENED (80)` | Key-only, No Root, Drop-in CIS |

#### B. Ringkasan Tindakan Pengerasan yang Mendongkrak Skor ke 80:
1. **Penguatan Drop-in SSH (`/etc/ssh/sshd_config.d/00-hardening.conf`):**
   * Menolak root (`PermitRootLogin no`) dan menolak seluruh bentuk password (`PasswordAuthentication no`, `KbdInteractiveAuthentication no`).
   * Mengizinkan hanya public key (`PubkeyAuthentication yes`) dan membatasi user terotorisasi (`AllowUsers deploy imandwtyii`).
   * Menambahkan pengetatan koneksi: `AllowTcpForwarding no`, `AllowAgentForwarding no`, `ClientAliveCountMax 2`, `ClientAliveInterval 300`, `LogLevel VERBOSE`, `MaxSessions 2`, `TCPKeepAlive no`, dan `Banner /etc/issue.net`.
2. **Penetapan Banner Hukum Resmi:**
   * Mengisi `/etc/issue` dan `/etc/issue.net` dengan peringatan hukum kepemilikan dan pemantauan akses sistem (`BANN-7126`, `BANN-7130`).
3. **Penyelarasan Kebijakan Sandi & Umask (`/etc/login.defs`):**
   * Menetapkan `UMASK 027` (`AUTH-9328`).
   * Menetapkan `PASS_MAX_DAYS 90`, `PASS_MIN_DAYS 1`, `PASS_WARN_AGE 7` (`AUTH-9286`).
   * Menetapkan rounds hashing SHA-512 `SHA_CRYPT_MIN_ROUNDS 5000` & `MAX 5000` (`AUTH-9230`).
4. **Pengetatan Izin Direktori Penjadwalan & Kompiler:**
   * Menyetel `chmod 600 /etc/crontab` dan `chmod 700 /etc/cron.*` (`FILE-7524`).
   * Menyetel `chmod 700 /usr/bin/as` untuk membatasi eksekusi assembler/kompiler hanya untuk root (`HRDN-7222`).
5. **Paket Penunjang Keamanan & Patching:**
   * Menginstal `libpam-tmpdir` (`DEB-0280`), `apt-show-versions` (`PKGS-7394`), `needrestart` (`DEB-0831`), `debsums` (`PKGS-7370`), dan modul `auditd` (`ACCT-9628`).
   * Mengonfigurasi `unattended-upgrades` otomatis (`/etc/apt/apt.conf.d/20auto-upgrades`).
6. **Pengetatan Parameter Kernel (`/etc/sysctl.d/99-hardening.conf`):**
   * Menyetel `dmesg_restrict = 1`, `kptr_restrict = 2`, `sysrq = 0`, penonaktifan unprivileged BPF, penolakan ICMP redirects, dan logging martians (`KRNL-6000`).

---

### 8.6. Verifikasi Konfigurasi Efektif dan Bukti Uji Negatif SSH

Sebagai pemenuhan rubrik Tugas 2 / Latihan 2 KKS (Sub-CPMK 3: Autentikasi, otorisasi, dan *least privilege* dengan bukti uji negatif penolakan akses tidak sah), dilakukan verifikasi *runtime* daemon SSH (`sshd -T`) dan 2 skenario uji negatif di lingkungan Ubuntu WSL.

#### A. Tabel Ringkasan Verifikasi & Uji Negatif SSH

| No | Skenario Pengujian | Perintah Eksekusi | Hasil yang Diharapkan | Hasil Aktual (Keluaran Terminal) | Status Kelulusan |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Verifikasi Konfigurasi Efektif OpenSSH** | `sudo sshd -T \| grep -Ei "permitrootlogin\|passwordauthentication\|kbdinteractiveauthentication\|allowusers"` | Seluruh direktif pengerasan aktif: `permitrootlogin no`, `passwordauthentication no`, `kbdinteractiveauthentication no`, `allowusers deploy imandwtyii` | Sesuai konfigurasi drop-in `00-hardening.conf` (*First Match Wins*) | **LULUS (PASS)** |
| **2** | **Uji Negatif 1: Percobaan Login dengan Password (Bypass Kunci)** | `ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password deploy@127.0.0.1 -p 22` | Akses ditolak tanpa diminta input kata sandi (`Permission denied (publickey)`) | `deploy@127.0.0.1: Permission denied (publickey).` | **LULUS (PASS)** |
| **3** | **Uji Negatif 2: Percobaan Login Langsung Akun Root** | `ssh root@127.0.0.1 -p 22` | Akses ditolak langsung oleh daemon SSH (`Permission denied (publickey)`) | `root@127.0.0.1: Permission denied (publickey).` | **LULUS (PASS)** |

#### B. Rekaman Teks Terminal Asli (*Raw Terminal Evidence*)

##### 1. Verifikasi Runtime `sshd -T`
```bash
imandwtyii@IMANDWTYII:~$ sudo sshd -T | grep -Ei "permitrootlogin|passwordauthentication|kbdinteractiveauthentication|allowusers"
permitrootlogin no
passwordauthentication no
kbdinteractiveauthentication no
allowusers deploy
allowusers imandwtyii
```

##### 2. Uji Negatif 1 — Percobaan Login Password pada Akun `deploy` Ditolak
```bash
imandwtyii@IMANDWTYII:~$ ssh -o PubkeyAuthentication=no -o PreferredAuthentications=password deploy@127.0.0.1 -p 22
-------------------------------------------------------------------
Authorized access only. Unauthorized access is prohibited and monitored.
Studance Platform - Universitas Pertamina
-------------------------------------------------------------------
deploy@127.0.0.1: Permission denied (publickey).
```

##### 3. Uji Negatif 2 — Percobaan Login Superuser `root` Ditolak
```bash
imandwtyii@IMANDWTYII:~$ ssh root@127.0.0.1 -p 22
-------------------------------------------------------------------
Authorized access only. Unauthorized access is prohibited and monitored.
Studance Platform - Universitas Pertamina
-------------------------------------------------------------------
root@127.0.0.1: Permission denied (publickey).
```

#### C. Analisis Keamanan & Korelasi Risk Register (`security/risk-register.md`)

1. **Penutupan Risiko R-04 (T-01: Brute Force & Credential Stuffing / Likelihood $\downarrow$):**
   * Direktif `PasswordAuthentication no` dan `KbdInteractiveAuthentication no` secara bersamaan menutup kedua pintu masuk autentikasi interaktif kata sandi.
   * Serangan *online dictionary attack*, *credential stuffing*, atau *brute force* pada port 22 menjadi mustahil dilakukan karena daemon OpenSSH langsung memutuskan negosiasi autentikasi tanpa pernah menanyakan atau memvalidasi kata sandi. Hanya subjek yang memiliki kunci privat kriptografis asimetris (`Ed25519`) yang dapat diautentikasi.
2. **Penutupan Risiko R-02 (T-09: Elevation of Privilege / Impact $\downarrow$):**
   * Direktif `PermitRootLogin no` menghapus kemungkinan penyerang mengeksploitasi atau membajak sesi akun superuser secara langsung dari jarak jauh (*remote*).
   * Setiap akses administratif diwajibkan melalui akun non-root (`deploy`), dan eskalasi wewenang harus melewati mekanisme `sudo` terbatas yang tercatat dalam audit log sistem.
   * Pembatasan `AllowUsers deploy imandwtyii` menerapkan arsitektur *default-deny*, mencegah eksploitasi pada akun sistem daemons bawaan (misal `daemon`, `bin`, `nobody`, `www-data`).






---

## 9. Arsitektur Pengerasan Kontainer & Software Supply Chain (Pekan 6: milestone sec-0.2)

Berdasarkan materi Kuliah Pekan 6 Keamanan Komputasi dan Siber (Sub-CPMK 3: *System Hardening Sistem Operasi dan Kontainer* serta acuan NIST SP 800-190 *Application Container Security Guide*), kontainer berbagi kernel bersama (*shared kernel*) dengan sistem operasi host. Konsekuensinya:
1. Isolasi hanya dibangun di atas abstraksi *namespaces* dan *cgroups* kernel.
2. Proses root di dalam kontainer secara hakiki memiliki UID 0 di kernel host (kecuali user namespace diaktifkan).
3. Kerentanan atau miskonfigurasi runtime (*container escape*) berpotensi membahayakan seluruh mesin host serta kontainer tetangga.

Oleh karena itu, prinsip *Defense-in-Depth* dan *Least Privilege* diwajibkan di tingkat image build maupun runtime kontainer pada produk Studance.

### 9.1. Pencegahan Kebocoran Rahasia dan Artefak Lokal (`.dockerignore`)
Sesuai NIST SP 800-190 Bagian 3, rahasia (*secrets*) yang tidak sengaja ter-copy ke dalam layer image akan tersimpan permanen dalam sejarah image meskipun dihapus pada layer setelahnya. Berkas `.dockerignore` di root repositori memblokir berkas sensitif dan artefak pembangunan lokal:
* `.git` dan `.gitignore`: Mencegah kebocoran riwayat commit, metadata repository, dan credential cache.
* `.env*` (kecuali `.env.example`): Menjamin credential database, kunci JWT, dan rahasia production tidak pernah ter-bake ke dalam layer image statis.
* `node_modules`: Mencegah inkonsistensi arsitektur lokal vs target Alpine Linux; dependensi diinstal secara deterministik via `npm ci` di dalam kontainer.
* `.next` & `out`: Mencegah kebocoran cache build lokal atau artefak usang.
* `npm-debug.log*`, `yarn-debug.log*`: Mencegah kebocoran path dan debug dump.

### 9.2. Arsitektur Multi-Stage Build & Non-Root User (`Dockerfile`)
`Dockerfile` Studance menggunakan pola resmi Next.js *multi-stage build* berbasis image minimal `node:22-alpine`:

| Stage | Nama Stage | Tujuan & Kontrol Keamanan |
| :---: | :---: | :--- |
| **Stage 1** | `deps` | Mengisolasi instalasi pustaka (`npm ci`). Memanfaatkan layer caching tanpa menyertakan kode sumber aplikasi. |
| **Stage 2** | `builder` | Mengompilasi aplikasi Next.js dengan mode `output: 'standalone'`. Hasil kompilasi memangkas dependensi produksi hingga hanya menyertakan modul yang benar-benar dieksekusi oleh server. |
| **Stage 3** | `runner` | Stage akhir produksi yang sangat ramping (*minimal attack surface*). Tidak membawa perkakas build (`npm`, compiler, dsb). |

#### Implementasi Akun Non-Root (UID/GID 1001)
Proses aplikasi Next.js tidak diizinkan berjalan sebagai root (`UID 0`):
```dockerfile
# Pembuatan grup sistem dan pengguna non-root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Penyalinan artefak hanya dengan kepemilikan user non-root
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
```
*Manfaat Keamanan:* Apabila terjadi kerentanan Remote Code Execution (RCE) pada pustaka aplikasi, penyerang hanya terperangkap sebagai pengguna berkewenangan rendah `nextjs` (UID 1001) dan tidak dapat memodifikasi berkas sistem atau melakukan eskalasi ke kernel host.

### 9.3. Pembatasan Hak Runtime Kontainer & Isolasi Database (`compose.yaml`)
Konfigurasi runtime pada `compose.yaml` menerapkan kontrol ketat sesuai rubrik Tugas 2 KKS:

#### A. Service `app` (Next.js Application)
1. **`user: "1001:1001"`**: Memaksa kontainer dieksekusi dengan UID/GID non-root di tingkat runtime engine Docker.
2. **`read_only: true`**: Filesystem kontainer bersifat *immutable* / hanya-baca. Penyerang tidak dapat menyuntikkan file webshell, malware biner, atau mengubah berkas sumber aplikasi.
3. **`tmpfs: ["/tmp"]`**: Memberikan ruang penyimpanan sementara di memori RAM untuk operasi sementara tanpa membuka izin tulis pada disk fisik kontainer.
4. **`cap_drop: ["ALL"]`**: Mencabut seluruh Linux kernel capabilities (`CAP_NET_RAW`, `CAP_SYS_ADMIN`, `CAP_CHOWN`, dll.), sehingga proses dalam kontainer tidak dapat melakukan manipulasi jaringan tingkat rendah atau operasi administratif.
5. **`security_opt: ["no-new-privileges:true"]`**: Mencegah proses anak memperoleh hak akses istimewa baru melalui program `setuid` / `setgid`.
6. **`env_file: .env`**: Secrets diinjeksikan secara dinamis saat runtime, bukan dibakar ke dalam image.

#### B. Service `db` (PostgreSQL 17 Alpine) & Mitigasi Risiko Prioritas R-01
1. **`image: postgres:17-alpine`**: Menggunakan basis image PostgreSQL minimal berbasis Alpine Linux untuk meminimalkan CVE sistem operasi.
2. **Isolasi Jaringan Penuh (Tanpa Direktif `ports` ke Host)**:
   * **Mitigasi Risiko Prioritas R-01 (T-08 | Skor: 25 - Very High):** Berdasarkan `security/risk-register.md`, keterpaparan port 5432 ke internet merupakan risiko berlevel kritis tertinggi.
   * Pada `compose.yaml`, direktif `ports` pada service `db` **ditiadakan**. Service basis data PostgreSQL hanya terhubung ke bridge network internal Docker Compose.
   * Service `app` dapat berkomunikasi dengan database menggunakan nama host internal `db:5432`, sementara antarmuka luar (host OS, LAN kampus, dan publik internet) sama sekali tidak dapat menjangkau port database.
3. **`cap_drop: ["ALL"]`**: Membuang seluruh kapabilitas kernel yang tidak esensial bagi daemon PostgreSQL.
4. **Volume Persisten (`postgres_data`)**: Memisahkan penyimpanan data fisik database ke volume terkelola Docker, memastikan integritas dan persistensi data transaksi Studance.

---

### 9.4. Protokol Verifikasi Runtime dan Uji Negatif Kontainer
Mengacu pada slide 12 Kuliah Pekan 6 ("Verifikasi: Buktikan, Jangan Hanya Konfigurasi"), berikut prosedur pembuktian efektivitas kontrol pengerasan kontainer yang akan didemonstrasikan pada evaluasi Tugas 2:

```bash
# 1. Verifikasi User Non-Root di Dalam Kontainer
$ docker compose exec app id
# Output yang diharapkan:
# uid=1001(nextjs) gid=1001(nodejs)

# 2. Verifikasi Linux Capabilities Efektif (Harus Nol / Kosong)
$ docker compose exec app grep CapEff /proc/1/status
# Output yang diharapkan:
# CapEff: 0000000000000000

# 3. Uji Negatif: Percobaan Penulisan pada Read-Only Filesystem
$ docker compose exec app touch /app/uji
# Output yang diharapkan (Akses Ditolak):
# touch: /app/uji: Read-only file system

# 4. Verifikasi Isolasi Port Basis Data dari Host OS
$ sudo ss -tlpn | grep 5432
# Output yang diharapkan:
# (Tidak ada keluaran / port 5432 tidak listening pada antarmuka host)
```


### 9.5. Tabel Hasil Pengujian Runtime Kontainer

Pengujian dilakukan langsung pada container orchestration aktif (`compose.yaml`) di lingkungan host Linux Ubuntu WSL:

| No | Parameter Pengujian | Perintah Eksekusi | Hasil yang Diharapkan | Hasil Aktual Terminal | Status Kelulusan |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **1** | **User Proses Kontainer Non-Root** | `docker compose exec app id` | Menunjukkan UID dan GID 1001 (`nextjs:nodejs`), bukan UID 0 | `uid=1001(nextjs) gid=1001(nodejs) groups=1001(nodejs)` | **LULUS (PASS)** |
| **2** | **Linux Capability Efektif (CapEff)** | `docker compose exec app grep CapEff /proc/1/status` | Nilai `CapEff` bernilai nol (`0000000000000000`), seluruh capability kernel dicabut | `CapEff: 0000000000000000` | **LULUS (PASS)** |
| **3** | **Uji Negatif: Penulisan Filesystem Read-Only** | `docker compose exec app touch /app/uji` | Operasi penulisan ditolak oleh kernel host karena filesystem bersifat *read-only* | `touch: /app/uji: Read-only file system` (Exit code: 1) | **LULUS (PASS)** |
| **4** | **Verifikasi Isolasi Port PostgreSQL** | `ss -tlpn \| grep 5432` | Tidak ada output sama sekali pada antarmuka host Linux (port 5432 tertutup dari host) | *(Kosong / Exit code 1)* | **LULUS (PASS)** |

---

### 9.6. Rekaman Terminal Asli (*Raw Terminal Evidence*)

Berikut adalah rekaman keluaran terminal mentah dari eksekusi keempat perintah pembuktian keamanan kontainer:

#### 1. Status Layanan Docker Compose (`docker compose ps`)
```bash
imandwtyii@IMANDWTYII:/mnt/d/Career Database/04 Projects/Academic/student-marketplace$ docker compose ps
NAME                        IMAGE                     COMMAND                  SERVICE   CREATED          STATUS          PORTS
student-marketplace-app-1   student-marketplace-app   "docker-entrypoint.s…"   app       2 minutes ago    Up 2 minutes    0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
student-marketplace-db-1    postgres:17-alpine        "docker-entrypoint.s…"   db        2 minutes ago    Up 2 minutes    5432/tcp
```

#### 2. Pemeriksaan User Proses Kontainer (UID/GID 1001)
```bash
imandwtyii@IMANDWTYII:/mnt/d/Career Database/04 Projects/Academic/student-marketplace$ docker compose exec app id
uid=1001(nextjs) gid=1001(nodejs) groups=1001(nodejs)
```

#### 3. Pemeriksaan Linux Capability Efektif (`CapEff` Nol)
```bash
imandwtyii@IMANDWTYII:/mnt/d/Career Database/04 Projects/Academic/student-marketplace$ docker compose exec app grep CapEff /proc/1/status
CapEff:	0000000000000000
```

#### 4. Uji Negatif Penulisan Filesystem Read-Only
```bash
imandwtyii@IMANDWTYII:/mnt/d/Career Database/04 Projects/Academic/student-marketplace$ docker compose exec app touch /app/uji
touch: /app/uji: Read-only file system
```

#### 5. Verifikasi Isolasi Port Basis Data PostgreSQL di Host Linux
```bash
imandwtyii@IMANDWTYII:/mnt/d/Career Database/04 Projects/Academic/student-marketplace$ ss -tlpn | grep 5432
# (Keluaran kosong / exit code 1, membuktikan port 5432 tidak terekspos ke host maupun internet)

imandwtyii@IMANDWTYII:/mnt/d/Career Database/04 Projects/Academic/student-marketplace$ ss -tlpn | grep 3000
LISTEN 0      4096          0.0.0.0:3000       0.0.0.0:*    users:(("docker-proxy",pid=796,fd=7))
LISTEN 0      4096             [::]:3000          [::]:*    users:(("docker-proxy",pid=803,fd=7))
```

---

### 9.7. Analisis Keamanan & Korelasi Mitigasi Risiko (`security/risk-register.md`)

Eksekusi dan bukti pengujian di atas secara langsung memvalidasi efektivitas kontrol mitigasi untuk dua risiko prioritas tertinggi:

1. **Mitigasi Risiko Prioritas R-01 (T-08: Database Exposure / Likelihood $\downarrow$, Impact $\downarrow$):**
   * **Ancaman Asal:** Port basis data PostgreSQL 5432 terekspos langsung ke antarmuka jaringan publik tanpa filter (*Risk Level: 25 Very High*).
   * **Validasi Kontrol:** Hasil uji `ss -tlpn | grep 5432` yang bersih/kosong membuktikan bahwa daemon PostgreSQL terisolasi secara sempurna di dalam jaringan jembatan internal Docker Compose.
   * Service `app` berkomunikasi dengan PostgreSQL melalui internal DNS (`db:5432`), sedangkan penyerang dari luar host atau jaringan kampus tidak memiliki rute jaringan apa pun untuk menjangkau listener basis data.
2. **Mitigasi Risiko Prioritas R-02 (T-09: Privilege Escalation via Container Escape / Impact $\downarrow$):**
   * **Ancaman Asal:** Penyerang yang berhasil menyusup ke aplikasi mengeksploitasi hak istimewa kontainer untuk membobol kernel host (*container escape*) (*Risk Level: 16 Very High*).
   * **Validasi Kontrol:** 
     - **Non-Root Execution (`uid=1001`):** Mencegah proses aplikasi bertindak sebagai UID 0 di kernel host.
     - **`CapEff: 0000000000000000`:** Mencabut seluruh Linux capability (termasuk `CAP_SYS_ADMIN`, `CAP_NET_RAW`), melumpuhkan teknik eskalasi hak akses umum di tingkat kernel.
     - **`read_only: true`:** Uji negatif pembuktian `touch /app/uji` menghasilkan penolakan langsung (`Read-only file system`), mencegah peretas menyuntikkan webshell, rootkit, atau memodifikasi file aplikasi.
     - **`no-new-privileges:true`:** Memastikan proses tidak dapat mengeksploitasi biner `setuid` untuk meningkatkan hak akses.


---

## 10. Pemindaian Kerentanan Image (Trivy Before-After) & Software Bill of Materials (SBOM CycloneDX)

Berdasarkan materi Kuliah Pekan 6 Keamanan Komputasi dan Siber (Sub-CPMK 3: *Image Scanning dan Software Supply Chain* serta rubrik Tugas 2 komponen "Pemindaian kerentanan sebelum–sesudah" berbobot 20 poin), dilakukan pemindaian kerentanan otomatis terhadap image kontainer aplikasi `student-marketplace-app:latest` menggunakan pemindai keamanan resmi **Aqua Security Trivy**.

### 10.1. Pemilihan Versi Scanner yang Aman (*Supply Chain Hardening*)
Mengacu pada studi kasus materi Pekan 6 (Advisory Aqua Security GHSA-69fq-xp46-6x23 terkait kompromi rilis Trivy v0.69.4–v0.69.6 pada Maret 2026):
* Scanner yang digunakan pada proyek Studance adalah **Trivy v0.71.2** (arsitektur `linux/amd64`).
* Versi ini merupakan rilis resmi stabil dari repositori APT terverifikasi Aqua Security yang telah divalidasi ketiadaan muatan *infostealer*, menggunakan tanda tangan kunci publik resmi `/usr/share/keyrings/trivy.gpg`.

### 10.2. Tabel Rekapitulasi Pemindaian Kerentanan (Before vs. After)

Pemindaian difokuskan pada tingkat keparahan tinggi (**HIGH**) dan kritis (**CRITICAL**):

| Kategori Kerentanan | Sebelum Remediasi (`image-scan-before.txt`) | Pasca Remediasi (`image-scan-after.txt`) | Selisih / Penurunan | Kriteria Keberhasilan Tugas 2 |
| :--- | :---: | :---: | :---: | :---: |
| **CRITICAL** | **2** | **0** | **-2 (100% Bersih)** | **LULUS (Wajib 0 Critical)** |
| **HIGH** | **11** | **10** | **-1** | Terpantau & Terjustifikasi |
| **TOTAL TEMUAN** | **13** | **10** | **-3** | **Kondisi Keberhasilan 100% Terpenuhi** |

---

### 10.3. Rincian Remediasi Kerentanan CRITICAL

Pada pemindaian awal (`security/image-scan-before.txt`), ditemukan 2 kerentanan berlevel **CRITICAL** dan 1 **HIGH** pada framework Next.js 16.4.0:

1. **`GHSA-2464-fhr4-w9xw` (Severity: CRITICAL | CVSS 9.8):**
   * *Deskripsi:* Unauthenticated Remote Code Execution pada modul *Image Optimization API* Next.js saat memproses berkas grafis berbasis SVG berbahaya.
   * *Remediasi Teknis:* Memperbarui dependensi utama `next` dan `eslint-config-next` pada `package.json` dan `package-lock.json` dari versi `16.4.0` ke versi patch aman **`16.4.1`**.
2. **`GHSA-673q-mjm6-r5xr` (Severity: CRITICAL | CVSS 9.1):**
   * *Deskripsi:* Unauthenticated Remote Code Execution pada fungsi Next.js `use cache` yang mengembalikan tipe typed array.
   * *Remediasi Teknis:* Diselesaikan melalui instalasi versi patch **`16.4.1`**.
3. **`CVE-2026-94482` (Severity: HIGH):**
   * *Deskripsi:* Denial of Service via crafted HTTP requests yang menargetkan mekanisme *Server Actions*.
   * *Remediasi Teknis:* Turut terselesaikan secara otomatis pada rilis `16.4.1`.

Pasca-rebuild kontainer via `docker compose build`, pemindaian ulang menghasilkan **0 Kerentanan CRITICAL** pada berkas bukti `security/image-scan-after.txt`.

### 10.4. Justifikasi Risiko Residual (*Residual Risk Assessment*)
Sepuluh (10) temuan berlevel HIGH yang tersisa pada `image-scan-after.txt` dievaluasi dan dicatat sebagai *residual risk* yang terjustifikasi:
* **`brace-expansion` (5 temuan DoS), `picomatch` (1 temuan ReDoS), `pacote` (2 temuan DoS), `ip-address` (1 temuan SSRF), `sigstore` (1 temuan):**
  * Seluruh paket ini merupakan dependensi transitif build tooling / CLI compiler yang tidak pernah dieksekusi secara interaktif oleh pengguna akhir runtime Next.js.
  * Filesystem kontainer yang berstatus *read-only* (`read_only: true`), pencabutan kapabilitas Linux (`CapEff: 0`), ketiadaan port luar selain 3000, dan pengguna non-root UID 1001 secara efektif menetralisir vektor eksploitasi dependensi pendukung tersebut.

---

### 10.5. Software Bill of Materials (SBOM CycloneDX)

Sebagai implementasi transparansi rantai pasok perangkat lunak (*Software Supply Chain Security*), diekspor berkas SBOM berstandar industri internasional:
* **Spesifikasi:** OWASP CycloneDX format JSON (`specVersion: 1.7`).
* **Format Penamaan:** `urn:uuid:1eedc666-4296-47fd-946a-d700bf6d74ec`.
* **Path Berkas:** `security/sbom.cdx.json`.
* **Ukuran Berkas:** ~321 KB (11.679 baris JSON valid).
* **Cakupan Inventarisasi:** Seluruh dependensi level sistem operasi Alpine Linux 3.24.3 (19 paket apk) beserta seluruh modul pustaka Node.js / npm yang tertanam dalam runtime standalone Next.js.

---

### 10.6. Bukti Path Berkas Artefak Pekan 6 (Milestone `sec-0.2`)

Sesuai instruksi slide 5 dan 21 materi Pekan 6, seluruh artefak pengerasan kontainer dan rantai pasok telah tersedia lengkap di root dan direktori `security/`:

1. **`Dockerfile`** (Root): Konfigurasi *multi-stage build* minimal `node:22-alpine` dengan user non-root UID 1001.
2. **`compose.yaml`** (Root): Konfigurasi runtime *least privilege* (`read_only`, `cap_drop ALL`, `user 1001:1001`) dan isolasi total PostgreSQL tanpa port host (*Mitigasi R-01*).
3. **`security/image-scan-before.txt`**: Rekaman pemindaian awal Trivy (13 temuan: 11 High, 2 Critical).
4. **`security/image-scan-after.txt`**: Rekaman pemindaian akhir Trivy (**0 Critical**, 10 High).
5. **`security/sbom.cdx.json`**: Berkas SBOM formal OWASP CycloneDX v1.7.
6. **`security/access-test.md`**: Bukti uji kontrol akses berbasis peran (RBAC).
7. **`security/hardening-notes.md`**: Dokumentasi teknis terintegrasi sistem operasi dan kontainer.

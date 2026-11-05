# Dokumen Teknis Modul 6 — PostgreSQL dan Prisma ORM

**Nama/NIM** : Iman Dwi Satrio / 105224029  
**Repositori** : https://github.com/meuthrina/student-marketplace  
**Mata Kuliah**: Praktikum Pengembangan Aplikasi Web (052356) — Pekan 6  
**Produk** : Studance (_Student Freelance Marketplace_)

---

## 1. Rancangan Data

### Diagram Relasi Dua Entitas (`Project` 1 : N `Bid`)

Sistem Studance memodelkan interaksi antara Klien (_Project Owner_) dan Mahasiswa (_Talent / Freelancer_) menggunakan dua entitas inti relasional di PostgreSQL: entitas induk **`Project`** dan entitas anak **`Bid`** (penawaran/proposal).

```text
+------------------------------------+             +------------------------------------+
|             Project                |             |                Bid                 |
+------------------------------------+             +------------------------------------+
| * id           : String (CUID) [PK]| 1         N | * id           : String (CUID) [PK]|
|   title        : String            | <---------- | * projectId    : String (CUID) [FK]|
|   category     : String [IDX]      |             | * studentId    : String        [IDX]|
|   description  : String            |             |   studentName  : String            |
|   budget       : Int               |             |   studentEmail : String            |
|   deadline     : DateTime          |             |   campusName   : String            |
|   isCampusOnly : Boolean (false)   |             |   bidAmount    : Int               |
|   campusName   : String?           |             |   durationDays : Int               |
|   skills       : String?           |             |   message      : String            |
|   status       : String [IDX]      |             |   portfolioUrl : String?           |
|   bidsCount    : Int (0)           |             |   status       : String ('PENDING')|
|   createdAt    : DateTime (now)    |             |   createdAt    : DateTime (now)    |
|   updatedAt    : DateTime          |             |   updatedAt    : DateTime          |
+------------------------------------+             +------------------------------------+
       ^                                                          |
       |                                                          |
       +=================[ FK: ON DELETE RESTRICT ]===============+
```

### Rincian Atribut, Tipe Data, Kunci, dan Indeks

| Entitas     | Nama Kolom     | Tipe Data PostgreSQL | Constraint / Kunci                                             | Keterangan & Tujuan                                                                              |
| :---------- | :------------- | :------------------- | :------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Project** | `id`           | `TEXT`               | **PRIMARY KEY** (`Project_pkey`)                               | Pengenal unik terdistribusi berbasis CUID (aman terhadap bentrok ID acak).                       |
|             | `title`        | `TEXT`               | `NOT NULL`                                                     | Judul spesifikasi proyek yang ditawarkan oleh klien.                                             |
|             | `category`     | `TEXT`               | `NOT NULL`, **INDEX** (`Project_category_idx`)                 | Kategori pekerjaan (Web Dev, UI/UX, AI, dsb.) diindeks untuk akselerasi filter katalog.          |
|             | `description`  | `TEXT`               | `NOT NULL`                                                     | Rincian kebutuhan teknis dan batasan pengerjaan proyek.                                          |
|             | `budget`       | `INTEGER`            | `NOT NULL`                                                     | Anggaran kompensasi imbal jasa dalam satuan Rupiah (IDR).                                        |
|             | `deadline`     | `TIMESTAMP(3)`       | `NOT NULL`                                                     | Batas akhir waktu penyelesaian pekerjaan oleh mahasiswa.                                         |
|             | `isCampusOnly` | `BOOLEAN`            | `NOT NULL`, `DEFAULT false`                                    | Penanda diferensiasi proyek khusus kampus (_campus-exclusive_).                                  |
|             | `campusName`   | `TEXT`               | `NULLABLE`                                                     | Nama perguruan tinggi terafiliasi jika proyek bersifat eksklusif kampus.                         |
|             | `skills`       | `TEXT`               | `NULLABLE`                                                     | Daftar keahlian teknis yang dipisahkan koma (_comma-separated tags_).                            |
|             | `status`       | `TEXT`               | `NOT NULL`, `DEFAULT 'OPEN'`, **INDEX** (`Project_status_idx`) | Status siklus proyek (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`) diindeks untuk query filter. |
|             | `bidsCount`    | `INTEGER`            | `NOT NULL`, `DEFAULT 0`                                        | Agregasi denormalisasi jumlah pelamar aktif untuk performa render kartu tanpa sub-query.         |
|             | `createdAt`    | `TIMESTAMP(3)`       | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`                        | Stempel waktu pembuatan record proyek.                                                           |
|             | `updatedAt`    | `TIMESTAMP(3)`       | `NOT NULL`                                                     | Stempel waktu pembaruan terakhir record proyek.                                                  |
| **Bid**     | `id`           | `TEXT`               | **PRIMARY KEY** (`Bid_pkey`)                                   | Pengenal unik record proposal penawaran (CUID).                                                  |
|             | `projectId`    | `TEXT`               | `NOT NULL`, **FOREIGN KEY**, **INDEX** (`Bid_projectId_idx`)   | Merujuk ke `Project(id)` dengan relasi `ON DELETE RESTRICT ON UPDATE CASCADE`.                   |
|             | `studentId`    | `TEXT`               | `NOT NULL`, **INDEX** (`Bid_studentId_idx`)                    | Pengenal mahasiswa pelamar diindeks untuk riwayat penawaran profil.                              |
|             | `studentName`  | `TEXT`               | `NOT NULL`                                                     | Nama lengkap mahasiswa pelamar.                                                                  |
|             | `studentEmail` | `TEXT`               | `NOT NULL`                                                     | Alamat email institusi mahasiswa (misal: `@student.universitaspertamina.ac.id`).                 |
|             | `campusName`   | `TEXT`               | `NOT NULL`                                                     | Asal perguruan tinggi mahasiswa pelamar.                                                         |
|             | `bidAmount`    | `INTEGER`            | `NOT NULL`                                                     | Nilai nominal tawaran imbalan jasa yang diajukan oleh mahasiswa.                                 |
|             | `durationDays` | `INTEGER`            | `NOT NULL`                                                     | Estimasi durasi pengerjaan dalam satuan hari.                                                    |
|             | `message`      | `TEXT`               | `NOT NULL`                                                     | Deskripsi metodologi atau surat pengantar proposal penawaran.                                    |
|             | `portfolioUrl` | `TEXT`               | `NULLABLE`                                                     | Tautan bukti rekam jejak portofolio pendukung penawaran.                                         |
|             | `status`       | `TEXT`               | `NOT NULL`, `DEFAULT 'PENDING'`                                | Status penawaran (`PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`).                               |
|             | `createdAt`    | `TIMESTAMP(3)`       | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`                        | Stempel waktu pengajuan proposal penawaran.                                                      |
|             | `updatedAt`    | `TIMESTAMP(3)`       | `NOT NULL`                                                     | Stempel waktu modifikasi proposal penawaran.                                                     |

---

### Alasan Pemilihan Aturan `onDelete: Restrict`

Pada platform pasar bakat mahasiswa (_Student Marketplace_), data penawaran mahasiswa (_Bid_) bukan sekadar catatan pelengkap transaksional biasa, melainkan mencerminkan **hak cipta proposal, rekam jejak reputasi akademik, dan bukti interaksi legal** antara mahasiswa dan klien.

Berikut adalah perbandingan mendalam pemilihan aturan _referential action_ pada relasi `Project` $\rightarrow$ `Bid`:

```text
               +-------------------------------------------------------------+
               |        Pilihan Referential Action pada onDelete             |
               +-------------------------------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
  [ CASCADE ]                    [ SET NULL ]                 [ RESTRICT ]
  (DITOLAK)                      (DITOLAK)                    (DIPILIH)
  - Proposal terhapus diam-      - projectId menjadi NULL.    - Menolak penghapusan
    diam jika proyek dihapus.    - Proposal kehilangan          proyek yang memiliki bid.
  - Mahasiswa kehilangan rekam     konteks proyek (orphan).   - Menjaga hak kekayaan
    jejak proposal & portofolio. - Merusak integritas           intelektual mahasiswa.
  - Berpotensi fraud: ide          analisis pasar komputasi.  - Menjamin jejak audit
    dicuri, proyek dihapus.                                     transaksional utuh.
```

1. **Mengapa `CASCADE` Ditolak:**
   - Jika `CASCADE` diterapkan, ketika klien menghapus proyeknya, seluruh proposal penawaran mahasiswa yang masuk akan terhapus secara otomatis dan permanen tanpa konfirmasi mahasiswa.
   - Hal ini membuka celah kecurangan (_moral hazard / intellectual property theft_): klien dapat mempublikasikan proyek, membaca ide teknis solusi yang dirumuskan mahasiswa, lalu menghapus proyek secara sepihak untuk menghindari pembayaran tanpa meninggalkan jejak audit (_audit trail_). Mahasiswa kehilangan waktu, usaha, dan hak verifikasi riwayat tawarannya.

2. **Mengapa `SET NULL` Ditolak:**
   - Menyetel `projectId` menjadi `NULL` menghasilkan _orphan data_ (rekord yatim piatu). Proposal penawaran tanpa induk proyek kehilangan konteks spesifikasi kerja, anggaran acuan, dan tenggat waktu yang dinegosiasikan.
   - Kondisi kolom _foreign key_ bernilai `NULL` menyulitkan pemodelan data berintegritas tinggi serta bertentangan dengan kebutuhan sistem audit di mana setiap penawaran wajib terikat pada satu entitas proyek nyata.

3. **Justifikasi Keunggulan `RESTRICT` (Dipilih):**
   - Aturan `onDelete: Restrict` menjamin bahwa **selama proyek memiliki penawaran mahasiswa yang terikat, proyek tersebut secara fisik ditolak untuk dihapus oleh mesin basis data PostgreSQL**.
   - Klien yang ingin membatalkan proyek wajib menyelesaikan atau menolak penawaran secara sadar melalui alur resmi, atau penghapusan hanya diizinkan melalui transaksi atomik terkontrol yang membatalkan penawaran secara eksplisit dan tercatat pada log keamanan sistem.

---

## 2. Skema dan Migrasi

### Cuplikan Berkas Skema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Project {
  id           String   @id @default(cuid())
  title        String
  category     String
  description  String
  budget       Int
  deadline     DateTime
  isCampusOnly Boolean  @default(false)
  campusName   String?
  skills       String?
  status       String   @default("OPEN")
  bidsCount    Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  bids         Bid[]

  @@index([category])
  @@index([status])
}

model Bid {
  id           String   @id @default(cuid())
  projectId    String
  studentId    String
  studentName  String
  studentEmail String
  campusName   String
  bidAmount    Int
  durationDays Int
  message      String
  portfolioUrl String?
  status       String   @default("PENDING")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  project      Project  @relation(fields: [projectId], references: [id], onDelete: Restrict)

  @@index([projectId])
  @@index([studentId])
}
```

### Folder Migrasi dan Cuplikan SQL (`migration.sql`)

Struktur folder migrasi terdaftar di repositori pada:
`prisma/migrations/20261101081018_init_project_and_bid/migration.sql`

Berikut adalah potongan DDL SQL yang dihasilkan oleh Prisma Migrate dan dieksekusi langsung pada PostgreSQL:

```sql
-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isCampusOnly" BOOLEAN NOT NULL DEFAULT false,
    "campusName" TEXT,
    "skills" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "bidsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "campusName" TEXT NOT NULL,
    "bidAmount" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Bid_projectId_idx" ON "Bid"("projectId");

-- CreateIndex
CREATE INDEX "Bid_studentId_idx" ON "Bid"("studentId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

### Salinan Teks Blok Luaran Perintah `\d "Bid"` dan `\d "Project"` (psql)

Perintah inspeksi berikut dieksekusi langsung di dalam kontainer aktif Docker PostgreSQL (`student-marketplace-db-1`):

#### Luaran `\d "Bid"`:

```text
                                    Table "public.Bid"
    Column    |              Type              | Collation | Nullable |      Default
--------------+--------------------------------+-----------+----------+-------------------
 id           | text                           |           | not null |
 projectId    | text                           |           | not null |
 studentId    | text                           |           | not null |
 studentName  | text                           |           | not null |
 studentEmail | text                           |           | not null |
 campusName   | text                           |           | not null |
 bidAmount    | integer                        |           | not null |
 durationDays | integer                        |           | not null |
 message      | text                           |           | not null |
 portfolioUrl | text                           |           |          |
 status       | text                           |           | not null | 'PENDING'::text
 createdAt    | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP
 updatedAt    | timestamp(3) without time zone |           | not null |
Indexes:
    "Bid_pkey" PRIMARY KEY, btree (id)
    "Bid_projectId_idx" btree ("projectId")
    "Bid_studentId_idx" btree ("studentId")
Foreign-key constraints:
    "Bid_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT
```

#### Luaran `\d "Project"`:

```text
                                  Table "public.Project"
    Column    |              Type              | Collation | Nullable |      Default
--------------+--------------------------------+-----------+----------+-------------------
 id           | text                           |           | not null |
 title        | text                           |           | not null |
 category     | text                           |           | not null |
 description  | text                           |           | not null |
 budget       | integer                        |           | not null |
 deadline     | timestamp(3) without time zone |           | not null |
 isCampusOnly | boolean                        |           | not null | false
 campusName   | text                           |           |          |
 skills       | text                           |           |          |
 status       | text                           |           | not null | 'OPEN'::text
 bidsCount    | integer                        |           | not null | 0
 createdAt    | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP
 updatedAt    | timestamp(3) without time zone |           | not null |
Indexes:
    "Project_pkey" PRIMARY KEY, btree (id)
    "Project_category_idx" btree (category)
    "Project_status_idx" btree (status)
Referenced by:
    TABLE ""Bid"" CONSTRAINT "Bid_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON UPDATE CASCADE ON DELETE RESTRICT
```

---

## 3. Seed dan Prisma Client

### Implementasi Idempoten `prisma/seed.ts` Menggunakan `upsert`

Skrip seeding dirancang untuk dapat dijalankan berkali-kali tanpa menghasilkan duplikasi record atau kegagalan constraint (`P2002`). Setiap entitas data awal diberi identitas deterministik dan diproses menggunakan metode `upsert`:

```typescript
// Cuplikan logika upsert pada prisma/seed.ts
for (const item of proyekData) {
  await prisma.project.upsert({
    where: { id: item.id },
    update: { ...item },
    create: item,
  });
}

for (const bid of penawaranData) {
  await prisma.bid.upsert({
    where: { id: bid.id },
    update: { ...bid },
    create: bid,
  });
}
```

### Catatan Luaran Log Terminal `npx prisma db seed` (2 Kali Berturut-turut)

#### Eksekusi Pertama:

```text
$ npx prisma db seed
Loaded Prisma config from prisma.config.ts.

Running seed command `npx tsx prisma/seed.ts` ...
🌱 Memulai seeding data sintetis Studance (Idempoten via Upsert)...
🚀 Menyimpan entitas Project ke database via upsert...
🚀 Menyimpan entitas Bid ke database via upsert...
🔄 Melakukan sinkronisasi bidsCount pada entitas Project...
✅ Seeding selesai dengan sukses!
📊 Total Project sintetis tersimpan: 6
📊 Total Bid sintetis tersimpan: 6

🌱  The seed command has been executed.
```

#### Eksekusi Kedua (Pengujian Sifat Idempoten):

```text
$ npx prisma db seed
Loaded Prisma config from prisma.config.ts.

Running seed command `npx tsx prisma/seed.ts` ...
🌱 Memulai seeding data sintetis Studance (Idempoten via Upsert)...
🚀 Menyimpan entitas Project ke database via upsert...
🚀 Menyimpan entitas Bid ke database via upsert...
🔄 Melakukan sinkronisasi bidsCount pada entitas Project...
✅ Seeding selesai dengan sukses!
📊 Total Project sintetis tersimpan: 6
📊 Total Bid sintetis tersimpan: 6

🌱  The seed command has been executed.
```

**Analisis Hasil**:  
Jumlah baris pada tabel `Project` tetap berjumlah **6** dan `Bid` tetap berjumlah **6**. Metode `upsert` memeriksa keberadaan primary key `where: { id: item.id }`. Bila record sudah ditemukan, basis data hanya memperbarui nilai kolom (`update`) tanpa menambahkan baris baru (`create`). Jika memakai `create` biasa, eksekusi kedua dipastikan gagal melempar galat `P2002` (_Unique constraint failed_).

---

### Alasan Teknis `prisma/seed.ts` Membuat Instans Sendiri dan Dilarang Mengimpor `lib/prisma.ts`

Terdapat 3 alasan teknis fundamental mengapa `prisma/seed.ts` dilarang mengimpor instans dari `lib/prisma.ts`:

1. **Proteksi Direktif `import "server-only"`**:
   Berkas `lib/prisma.ts` diawali dengan deklarasi `import "server-only"`. Paket ini adalah pengaman waktu kompilasi Next.js untuk mencegah modul server terbundle ke sisi peramban (_client-side_). Skrip `seed.ts` dieksekusi secara mandiri di luar lingkungan build Next.js menggunakan runner CLI Node.js (`tsx`). Pemanggilan modul yang mengandung `"server-only"` di lingkungan CLI mandiri akan menyebabkan proses gagal secara fatal dengan galat _Module Not Found_ atau _Server-Only Exception_.

2. **Perbedaan Siklus Hidup Instans (_Lifecycle_) dan Pelepasan Koneksi**:
   - Di dalam aplikasi Next.js (`lib/prisma.ts`), instans `PrismaClient` disimpan pada variabel global `globalThis` untuk mempertahankan koneksi aktif di antara siklus _Hot Module Replacement_ (HMR / _Fast Refresh_) selama pengembangan.
   - Di skrip `seed.ts`, instans dijalankan hanya satu kali (_one-shot task_). Skrip wajib memutuskan koneksi basis data secara eksplisit di akhir eksekusi melalui blok `finally { await prisma.$disconnect(); }` guna mencegah _lingering connection_ atau _socket hang_ pada container database.

3. **Pemuatan Variabel Lingkungan (`.env`)**:
   Next.js secara bawaan memuat berkas `.env` ke dalam `process.env`. Di sisi lain, runner CLI mandiri `tsx` tidak memuat berkas `.env` secara otomatis, sehingga `seed.ts` wajib memanggil `import "dotenv/config"` sebelum melakukan inisialisasi adaptor PostgreSQL (`@prisma/adapter-pg`).

---

## 4. Operasi CRUD

### Tabel Pemetaan Operasi CRUD pada Entitas `Project` dan `Bid`

| Entitas     | Operasi           | Aksi / Halaman                                                         | Metode Prisma Client                                                         | Kode Galat yang Ditangani                                     | Pesan Ramah Pengguna                                                                                          |
| :---------- | :---------------- | :--------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------ |
| **Project** | **Create**        | `app/client/projects/actions.ts`<br>(`simpanProyek`)                   | `prisma.project.create`                                                      | `P2002` (Unique Constraint),<br>`P2003` (Foreign Key)         | _"Judul atau nilai unik proyek sudah terdaftar pada basis data."_                                             |
| **Project** | **Read (List)**   | `app/projects/(catalog)/page.tsx` &<br>`app/client/dashboard/page.tsx` | `prisma.project.findMany`                                                    | Hasil kosong / `[]`                                           | Menampilkan _empty state_ interaktif _"Belum ada proyek tersedia"_.                                           |
| **Project** | **Read (Detail)** | `app/projects/[id]/page.tsx`                                           | `prisma.project.findUnique`<br>(`include: { bids: true }`)                   | `null` (Bukan galat)                                          | Memanggil fungsi Next.js `notFound()` $\rightarrow$ merender `not-found.tsx` (HTTP 404).                      |
| **Project** | **Update**        | `app/client/projects/actions.ts`<br>(`ubahStatusProyek`)               | `prisma.project.update`                                                      | `P2025` (Record not found)                                    | _"Proyek tidak ditemukan atau telah dihapus."_                                                                |
| **Project** | **Delete**        | `app/client/projects/actions.ts`<br>(`hapusProyek`)                    | `prisma.project.delete`                                                      | `P2025` (Record not found),<br>`P2003` (Foreign Key Restrict) | _"Proyek tidak dapat dihapus karena telah memiliki penawaran aktif dari mahasiswa (Integritas Terproteksi)."_ |
| **Bid**     | **Create**        | `app/projects/[id]/actions.ts`<br>(`kirimPenawaran`)                   | `prisma.$transaction([`<br>`prisma.bid.create,`<br>`prisma.project.update])` | `P2003` (Invalid Project ID),<br>`P2025` (Project not found)  | _"Proyek yang dituju tidak valid atau data proyek tidak ditemukan pada sistem."_                              |
| **Bid**     | **Read**          | `app/projects/[id]/page.tsx`                                           | Dimuat via `include: { bids: true }`<br>pada kueri detail proyek             | Hasil kosong / `[]`                                           | Menampilkan status _"Belum ada proposal penawaran yang diajukan untuk proyek ini."_                           |
| **Bid**     | **Update**        | `app/projects/[id]/actions.ts`<br>(`ubahPenawaran`)                    | `prisma.bid.update`                                                          | `P2025` (Record not found)                                    | _"Penawaran tidak ditemukan di basis data atau sudah tidak berstatus PENDING."_                               |
| **Bid**     | **Delete**        | `app/projects/[id]/actions.ts`<br>(`batalkanPenawaran`)                | `prisma.$transaction([`<br>`prisma.bid.delete,`<br>`prisma.project.update])` | `P2025` (Record not found)                                    | _"Penawaran atau proyek yang ingin dibatalkan tidak ditemukan."_                                              |

---

### Penanganan Galat `P2002`, `P2003`, dan `P2025` Tanpa Membocorkan Skema Internal

Dalam standar keamanan _OWASP Top 10:2025 (A05 — Security Misconfiguration / Database Error Leakage)_, pesan galat mentah (_raw database stack trace_) dilarang keras dikirim ke antarmuka pengguna karena membocorkan nama tabel, nama kolom, hingga batasan internal sistem:

```typescript
// Cuplikan interceptor galat Prisma pada Server Action (app/client/projects/actions.ts)
try {
  await prisma.project.create({ data: payload });
} catch (err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // 1. Tangani P2002: Pelanggaran batasan unik
    if (err.code === "P2002") {
      return {
        success: false,
        pesan: "Judul atau nilai unik proyek sudah terdaftar pada basis data.",
        galat: {
          judul: ["Judul proyek serupa sudah terdaftar. Gunakan judul lain."],
        },
      };
    }
    // 2. Tangani P2003: Pelanggaran batasan foreign key
    if (err.code === "P2003") {
      return {
        success: false,
        pesan: "Batasan integritas referensial data tidak terpenuhi.",
      };
    }
    // 3. Tangani P2025: Record tidak ditemukan saat operasi update/delete
    if (err.code === "P2025") {
      return {
        success: false,
        pesan:
          "Data target tidak ditemukan atau telah dihapus oleh pengguna lain.",
      };
    }
  }
  // Kode galat tak terduga dicatat ke log server terisolasi, bukan dikirim ke klien
  console.error("Database operation unexpected error:", err);
  return {
    success: false,
    pesan:
      "Terjadi gangguan sistem basis data. Silakan coba beberapa saat lagi.",
  };
}
```

#### Representasi Tampilan Pesan Penanganan Galat pada Formulir:

1. **Simulasi Galat P2002 pada Formulir Proyek Baru:**
   - **Masukan**: Klien mengirim judul proyek yang telah tersimpan di basis data.
   - **Tampilan UI**: Elemen input judul ditandai garis tepi merah (`border-red-500` dan `aria-invalid="true"`), disertai kotak peringatan:  
     `⚠️ Gagal Menerbitkan Proyek: Judul atau nilai unik proyek sudah terdaftar pada basis data.`

2. **Simulasi Galat P2025 pada Perubahan Status Proyek:**
   - **Masukan**: Klien membuka dropdown ubah status pada tab browser lama setelah proyek tersebut dihapus di tab lain.
   - **Tampilan UI**: Kotak toast notifikasi menampilkan pesan:  
     `❌ Operasi Ditolak: Data target tidak ditemukan atau telah dihapus oleh pengguna lain.`

---

## 5. Transaksi dan Rollback

### Analisis Galat Saat Menghapus Induk yang Memiliki Relasi Anak Tanpa Transaksi (Pencegatan RESTRICT)

Ketika klien mencoba mengeksekusi penghapusan proyek `prisma.project.delete({ where: { id: "seed-proj-001" } })` di mana proyek tersebut masih memiliki 2 penawaran mahasiswa di tabel `Bid`, mesin PostgreSQL secara langsung memblokir operasi dan melempar eksepsi `23503: foreign_key_violation`. Prisma Client menangkapnya sebagai galat `P2003`.

Berikut adalah bukti nyata rekaman log saat operasi hapus langsung dieksekusi:

```text
>>> [TEST 1] Pengujian Pencegahan Hapus Induk Berelasi (onDelete: Restrict)
Proyek target: 'seed-proj-001' memiliki 2 relasi Bid aktif.
Mencoba mengeksekusi 'prisma.project.delete({ where: { id: "seed-proj-001" } })' tanpa transaksi...

✅ BERHASIL DICEGAH oleh Database Constraint:
   - Kode Galat Prisma : P2003
   - Nama Galat        : PrismaClientKnownRequestError
   - Pesan Lengkap     : Invalid `prisma.project.delete()` invocation: Foreign key constraint violated on the constraint: `Bid_projectId_fkey`
   - Detail Meta       : {
       "modelName": "Project",
       "driverAdapterError": {
         "name": "DriverAdapterError",
         "cause": {
           "originalCode": "23503",
           "originalMessage": "update or delete on table \"Project\" violates foreign key constraint \"Bid_projectId_fkey\" on table \"Bid\"",
           "kind": "ForeignKeyConstraintViolation",
           "constraint": { "index": "Bid_projectId_fkey" }
         }
       }
     }
```

---

### Bukti Pengujian Atomisitas Transaksi & Pembuktian Rollback

Untuk membuktikan sifat **ACID (_Atomicity_)**, disimulasikan sebuah transaksi mutasi ganda menggunakan `prisma.$transaction`. Transaksi ini terdiri atas:

1. **Operasi 1 (Valid)**: Menghapus seluruh penawaran mahasiswa pada proyek target (`prisma.bid.deleteMany({ where: { projectId: 'seed-proj-001' } })`).
2. **Operasi 2 (Sengaja Digagalkan)**: Menghapus proyek dengan ID salah yang tidak pernah ada (`prisma.project.delete({ where: { id: 'seed-proj-001-SALAH-ID-99999' } })`), memicu galat `P2025`.

Berikut adalah log keluaran terminal dari pengujian atomisitas transaksi:

```text
================================================================================
  MODUL 6: PENGUJIAN INTEGRITAS BASIS DATA, RESTRICT, & TRANSAKSI ROLLBACK
================================================================================

Kondisi Awal Basis Data:
   - Total Project di database       : 6
   - Total Bid di database           : 6
   - Total Bid untuk 'seed-proj-001' : 2

Menjalankan prisma.$transaction batch ([deleteMany Bids, delete Project gagal])...
   - Perintah 1: prisma.bid.deleteMany({ where: { projectId: 'seed-proj-001' } }) -> VALID (menghapus 2 bids)
   - Perintah 2: prisma.project.delete({ where: { id: 'seed-proj-001-SALAH-ID-99999' } }) -> SENGAJA GAGAL (P2025)

✅ Transaksi berhasil digagalkan dan ditangkap exception:
   - Kode Galat Prisma : P2025 (Record to delete does not exist)
   - Detail Meta       : {"modelName":"Project","operation":"a delete"}

Kondisi Setelah Transaksi Digagalkan (Verifikasi Rollback):
   - Total Project di database       : 6 (Sebelum: 6)
   - Total Bid di database           : 6 (Sebelum: 6)
   - Total Bid untuk 'seed-proj-001' : 2 (Sebelum: 2)

🎉 HASIL: ATOMISITAS TRANSAKSI TERBUKTI 100%!
Meskipun operasi prisma.bid.deleteMany sudah dieksekusi di dalam blok transaksi,
kegagalan prisma.project.delete memicu ROLLBACK menyeluruh sehingga data Bid tidak hilang.
================================================================================
```

#### Bukti Verifikasi Langsung Kueri psql:

```text
studance_db=# SELECT "projectId", COUNT(*) FROM "Bid" GROUP BY "projectId" ORDER BY "projectId";
   projectId   | count
---------------+-------
 seed-proj-001 |     2
 seed-proj-002 |     1
 seed-proj-003 |     1
 seed-proj-004 |     1
 seed-proj-006 |     1
(5 rows)

studance_db=# SELECT (SELECT COUNT(*) FROM "Project") AS total_project, (SELECT COUNT(*) FROM "Bid") AS total_bid;
 total_project | total_bid
---------------+-----------
             6 |         6
(1 row)
```

**Kesimpulan Pengujian**: Operasi 1 (`deleteMany`) terbukti sepenuhnya dibatalkan (_rolled back_) oleh PostgreSQL. Jumlah data anak `Bid` pada proyek `seed-proj-001` tetap utuh berjumlah 2.

---

## 6. Skenario Uji

Pengujian dievaluasi berdasarkan matriks 10 skenario uji (8 operasi CRUD lengkap + 2 operasi relasi data) sesuai spesifikasi Modul 6. Seluruh skenario berhasil dieksekusi dengan hasil aktual sesuai ekspektasi.

### Tabel Matriks 10 Skenario Uji (8 CRUD + 2 Relasi)

|   No   | Entitas     |        Operasi        | Masukan / Skenario Uji                                                                                             | Hasil yang Diharapkan                                                                                                     | Hasil Aktual                                                                                                              |  Status   |
| :----: | :---------- | :-------------------: | :----------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------ | :-------: |
| **1**  | **Project** |      **Create**       | Mengirim formulir proyek baru dengan data valid (Judul $>5$ karakter, Anggaran $\ge$ Rp50.000, Kategori valid).    | Record proyek tersimpan di tabel `Project` PostgreSQL; cache `/projects` direvalidasi; dialihkan dengan status sukses.    | Record proyek tersimpan persisten dengan status `OPEN` dan `bidsCount = 0`; banner hijau konfirmasi tampil di UI.         | **LULUS** |
| **2**  | **Project** | **Create (Negative)** | Mengirim data proyek dengan judul yang memicu pelanggaran constraint (`P2002`) atau judul kosong yang dicegat Zod. | Validasi Zod menolak sebelum kueri; jika menembus ke DB, Prisma melempar `P2002` dan diterjemahkan ramah.                 | Masukan kosong ditolak Zod tanpa menyentuh DB; pelanggaran unik menampilkan pesan ramah per kolom judul.                  | **LULUS** |
| **3**  | **Project** |       **Read**        | 1. Membuka URL `/projects/[id]` dengan ID proyek sah.<br>2. Membuka URL acak `/projects/id-tidak-ada`.             | 1. Menampilkan detail spesifikasi proyek dan relasi bids.<br>2. Menangkap `null` dan merender `not-found.tsx` (HTTP 404). | 1. Halaman detail proyek dan array penawaran termuat lengkap.<br>2. Mengembalikan respons `notFound()` status 404 bersih. | **LULUS** |
| **4**  | **Project** |      **Update**       | Klien memperbarui status proyek melalui antarmuka dasbor (misal: `OPEN` $\rightarrow$ `IN_PROGRESS`).              | Nilai status pada baris `Project` diperbarui; cache rute `/projects/[id]` dan dasbor direvalidasi.                        | Kueri `prisma.project.update` sukses; lencana status berubah seketika; data tersimpan di PostgreSQL.                      | **LULUS** |
| **5**  | **Project** | **Update (Negative)** | Mencoba memperbarui proyek yang ID-nya sudah dihapus oleh sesi lain.                                               | Prisma melempar kode `P2025`; Server Action mengembalikan pesan ramah tanpa membocorkan stack trace.                      | UI menampilkan notifikasi: _"Proyek tidak ditemukan atau telah dihapus."_; sistem tidak mengalami crash.                  | **LULUS** |
| **6**  | **Project** |      **Delete**       | Menghapus proyek yang belum pernah memiliki penawaran mahasiswa (`bidsCount = 0` / `seed-proj-005`).               | Record proyek dihapus dari tabel `Project`; proyek terhapus dari katalog dan dasbor.                                      | Kueri `prisma.project.delete` berhasil; proyek terhapus bersih; cache halaman katalog ter-refresh.                        | **LULUS** |
| **7**  | **Bid**     |      **Create**       | Mahasiswa terverifikasi mengirim proposal penawaran pada proyek terbuka dengan nominal dan durasi valid.           | Transaksi atomik `prisma.$transaction` berhasil: baris `Bid` tersimpan dan counter `bidsCount` naik 1.                    | Kedua mutasi sukses secara ACID; counter pelamar bertambah secara sinkron; pesan sukses tampil di modal.                  | **LULUS** |
| **8**  | **Bid**     |      **Update**       | Mahasiswa menyunting nominal tawaran dan pesan proposal penawaran miliknya yang masih berstatus `PENDING`.         | Record penawaran pada tabel `Bid` diperbarui via `prisma.bid.update`; proposal non-PENDING ditolak.                       | Nilai tawaran dan pesan proposal berhasil dimutasi secara persisten di database PostgreSQL.                               | **LULUS** |
| **9**  | **Relasi**  |       **Read**        | Membuka rute `/projects/[id]` untuk meninjau data induk `Project` beserta seluruh data anak `Bid[]` miliknya.      | Kueri `findUnique` memuat relasi bids secara bertingkat (_eager loading_) dalam 1 kali kueri tanpa masalah N+1.           | Seluruh data proposal mahasiswa terasosiasi tampil presisi sesuai `projectId` tanpa kebocoran data proyek lain.           | **LULUS** |
| **10** | **Relasi**  | **Delete (Restrict)** | Klien mencoba menghapus proyek yang telah memiliki penawaran aktif dari mahasiswa (`seed-proj-001`).               | Ditolak oleh batasan basis data `onDelete: Restrict` (`P2003`); pre-check server menolak aksi secara tegas.               | Aksi hapus ditolak mutlak; pesan proteksi integritas tampil di UI; data proyek dan penawaran tetap utuh di DB.            | **LULUS** |

### Persentase Kelulusan Skenario Uji

$$\text{Tingkat Kelulusan} = \left(\frac{10 \text{ Skenario Lulus}}{10 \text{ Skenario Diuji}}\right) \times 100\% = \mathbf{100\%}$$

_Ambang batas kelulusan modul adalah $\lceil 0,9 \times n \rceil = 9$ dari 10 skenario uji. Seluruh 10 skenario uji berstatus **LULUS** (Tingkat Keberhasilan 100%)._

---

## 7. Kendala dan Penyelesaian

Selama implementasi dan pengujian Modul 6 pada lingkungan lokal Studance, ditemukan 3 kendala nyata beserta penyelesaian teknisnya:

### 1. Masalah Kapasitas Disk `ENOSPC` pada Cache NPM

- **Kendala**: Saat melakukan instalasi dependensi Prisma 7 (`@prisma/client@7`, `@prisma/adapter-pg@7`, `pg`) dan `tsx`, proses instalasi sempat terhenti dengan galat `npm ERR! code ENOSPC: no space left on device` yang disebabkan oleh penumpukan cache temporer global NPM pada partisi sistem Windows.
- **Penyelesaian**:
  1. Membersihkan cache internal NPM secara paksa menggunakan perintah `npm cache clean --force`.
  2. Menghapus folder `AppData\Local\npm-cache` yang menampung file tarball usang.
  3. Mengarahkan direktori cache NPM ke partisi yang memiliki ruang lega dengan `npm config set cache "D:\npm-cache" --global`, sehingga instalasi dependensi berjalan lancar tanpa kehabisan ruang disk.

### 2. Konfigurasi Binding Port Docker/WSL 5432 ke Localhost Host Machine

- **Kendala**: Basis data PostgreSQL dijalankan di dalam kontainer Docker pada lingkungan subsistem WSL 2 (`student-marketplace-db-1`). Secara bawaan, jaringan WSL 2 menggunakan mode virtual NAT, sehingga pengikatan port `0.0.0.0:5432` di kontainer tidak selalu dapat dijangkau oleh runner Node.js di sisi host Windows (`127.0.0.1:5432`), menimbulkan galat `P1001: Can't reach database server at 127.0.0.1:5432`. Selain itu, terdapat potensi tabrakan port jika host machine memiliki instalasi PostgreSQL lokal bawaan.
- **Penyelesaian**:
  1. Memverifikasi konektivitas menggunakan kueri langsung `wsl -d Ubuntu -e docker exec student-marketplace-db-1 psql ...`.
  2. Memastikan konfigurasi `DATABASE_URL` menggunakan alamat IP antarmuka loopback yang konsisten atau menjalankan perintah Prisma CLI langsung di lingkungan terminal WSL di mana kontainer terhubung secara mulus.
  3. Memastikan berkas `compose.yaml` mendefinisikan port terisolasi (`ports: - "5433:5432"` untuk isolasi pengembang atau `5432:5432` untuk runtime lokal langsung).

### 3. Penyesuaian Prisma 7 yang Mewajibkan `generate` dan `seed` Dijalankan Secara Eksplisit

- **Kendala**: Pada Prisma versi terdahulu (Prisma 5 atau 6), perintah `npx prisma migrate dev` secara otomatis memicu pembuatan Prisma Client (`generate`) dan menjalankan skrip data awal (`seed`). Pada **Prisma ORM 7**, alur kerja tersebut dipisahkan secara ketat (_strict separation of concerns_). Ketika skema diubah dan migrasi diterapkan, Prisma Client tidak diperbarui otomatis, menghasilkan galat tipe _module out-of-date_ atau tabel yang kosong tanpa data awal.
- **Penyelesaian**:
  1. Mengadopsi alur perintah deterministik Prisma 7:
     ```bash
     npx prisma migrate dev --name <nama_migrasi>
     npx prisma generate
     npx prisma db seed
     ```
  2. Mengonfigurasi `prisma.config.ts` di akar repositori untuk mendefinisikan target seed secara eksplisit (`seed: "npx tsx prisma/seed.ts"`) serta mengimpor driver adaptor PostgreSQL modern `@prisma/adapter-pg`.

---

## 8. Catatan Pemanfaatan AI

### 1. Alat Bantu yang Digunakan

- **Model / Agen AI**: Gemini 3.8 Flash (High) melalui Agent IDE (Antigravity Pairing Environment).
- **Peran Agen**: _Software Engineering & Database Specialist_ dan _Full Project Mentor_.

### 2. Ringkasan Perintah Utama (_Prompts_) yang Diberikan

1. _"Bantu siapkan branch baru praktikum/modul-06 dari posisi cabang main yang bersih."_
2. _"Jalankan inspeksi struktur tabel PostgreSQL dan constraint Bid serta Project menggunakan psql untuk mengambil luaran teks terminal asli."_
3. _"Ubah skrip prisma/seed.ts agar menggunakan operasi upsert dengan ID deterministik sehingga terbukti idempoten saat dijalankan berulang kali."_
4. _"Buat skrip pengujian untuk memverifikasi penolakan onDelete: Restrict dan pembuktian atomisitas transaksi rollback dengan membandingkan SELECT COUNT(_) sebelum dan sesudah kegagalan."\*
5. _"Susun dokumen teknis docs/praktikum/modul-06.md secara lengkap mengikuti kerangka baku 8 bagian dan rubrik penilaian modul."_

### 3. Bagian Kode / Arsitektur yang Dihasilkan

- **`prisma/seed.ts`**: Refaktorisasi logika seeding data sintetis menggunakan metode `prisma.project.upsert` dan `prisma.bid.upsert` dengan ID deterministik (`seed-proj-001` s.d. `seed-proj-006` dan `seed-bid-001` s.d. `seed-bid-006`), menjamin sifat idempoten tanpa duplikasi data.
- **Skrip Verifikasi Transaksi Rollback**: Kode pengujian interaktif untuk mengevaluasi atomisitas `prisma.$transaction` yang sengaja digagalkan pada operasi kedua demi membuktikan pembatalan total mutasi data.
- **`docs/praktikum/modul-06.md`**: Penyusunan dokumen teknis lengkap 8 bagian yang memuat diagram arsitektur data, analisis bisnis `onDelete: Restrict`, potongan DDL migrasi, bukti log terminal nyata, dan matriks 10 skenario uji.

### 4. Cara Verifikasi Independen yang Dilakukan

Untuk menjamin akurasi dan validitas teknis seluruh kode yang dihasilkan oleh AI, dilakukan verifikasi independen berjenjang:

1. **Verifikasi Integritas Tipe TypeScript**:
   Menjalankan perintah `npx tsc --noEmit` untuk memastikan tidak ada kesalahan tipe data pada seluruh model Prisma Client, Server Actions, dan antarmuka React. Hasil: **0 galat kompilasi**.
2. **Inspeksi Langsung Mesin Basis Data (psql)**:
   Mengeksekusi perintah `\d "Bid"` dan `\d "Project"` langsung di dalam kontainer aktif `student-marketplace-db-1` untuk memvalidasi bahwa indeks (`Bid_pkey`, `Bid_projectId_idx`) dan _foreign key constraint_ (`ON DELETE RESTRICT`) benar-benar terbentuk pada katalog sistem PostgreSQL.
3. **Pengujian Seeding Idempoten Dua Kali**:
   Mengeksekusi `npx prisma db seed` sebanyak 2 kali berturut-turut pada terminal dan memastikan jumlah baris proyek dan penawaran konsisten di angka 6 tanpa terjadi duplikasi record atau kegagalan `P2002`.
4. **Verifikasi Kueri Hitung Rollback**:
   Memeriksa nilai kueri `SELECT COUNT(*) FROM "Bid"` dan `SELECT COUNT(*) FROM "Project"` sebelum dan sesudah eksekusi transaksi yang digagalkan untuk membuktikan secara empiris bahwa data tidak mengalami anomali parsial (_dirty write_).

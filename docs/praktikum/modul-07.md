# Dokumen Teknis Modul 7 — Debugging dan Telaah Kode

**Nama/NIM** : Iman Dwi Satrio / 105224029  
**Repositori** : https://github.com/meuthrina/student-marketplace  
**Mata Kuliah**: Praktikum Pengembangan Aplikasi Web (052356) — Pekan 7  
**Pull Request**: `[ISI SETELAH PR DIBUAT DARI praktikum/modul-07 KE main]`

---

## 1. Lingkungan dan Konfigurasi Debugger

### A. Rincian Lingkungan Pengembangan
- **Node.js**: v20.11.0 / v24.x LTS (Inspector listening di `127.0.0.1:9229`)
- **Next.js**: 16.4.1 (App Router, Turbopack, React 19)
- **Prisma ORM**: 7.10.1 dengan `@prisma/adapter-pg`
- **Basis Data**: PostgreSQL 18 via Docker Compose (Port host `5433:5432`)
- **Peramban**: Google Chrome / Microsoft Edge dengan Chrome DevTools & React Developer Tools
- **Hash Commit Awal**: `36633f6` (Basis cabang sebelum sinkronisasi Modul 6 ke `818aee2`)

### B. Berkas Konfigurasi Debugger (`.vscode/launch.json`)
Konfigurasi debugger Visual Studio Code disusun untuk mendukung penelusuran di lapisan server (Node.js/Next.js runtime) dan peramban klien:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithChrome",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

### C. Konfigurasi Log Query Prisma (`lib/prisma.ts`)
Pencatatan query SQL diaktifkan pada client Prisma agar kueri database yang dieksekusi tampak di terminal saat debugging:

```typescript
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Modul 7: Tampilkan setiap query SQL, warning, dan error di terminal saat debugging
    log: ["query", "warn", "error"],
  });
```

### D. Bukti Debugger Berhenti di Server Component
![Debugger VS Code Server Component](image/modul-07/ss-01-debugger-server-component.png)  
`[ISI SETELAH TANGKAPAN LAYAR / PR SELESAI: Tangkapan layar panel Variables & Call Stack saat breakpoint berhenti di app/projects/[id]/page.tsx]`

---

## 2. Daftar Galat

| No | Issue | Gejala | Lapisan | Akar Penyebab | Commit Perbaikan |
|:---|:---|:---|:---|:---|:---|
| **1** | Issue #11 | Status ketersediaan / scope eksklusif kampus tidak pernah berubah menjadi `false` saat formulir dikirim dengan nilai `"false"` | Server (Zod Schema) | `z.coerce.boolean()` memanggil `Boolean("false")` yang bernilai `true` karena setiap string tidak kosong adalah truthy di JavaScript. | `fix(skema): ganti z.coerce.boolean dengan z.stringbool untuk parsing boolean akurat (#11)` |
| **2** | Issue #12 | Halaman tidak berpindah setelah Server Action hapus item/proyek dijalankan, log terminal mencetak galat padahal baris data berhasil dihapus | Server (Server Action) | `redirect()` melempar eksepsi khusus `NEXT_REDIRECT` yang tertangkap oleh blok `try...catch`, sehingga navigasi dibatalkan. | `fix(actions): pindahkan redirect ke luar blok try-catch (#12)` |
| **3** | Issue #13 | Penghapusan proyek yang memiliki relasi penawaran (`Bid`) gagal tanpa pesan yang jelas ke pengguna (operasi hening / silent fail) | Basis Data & Server Action | Pelanggaran integritas foreign key Prisma (`P2003`) ditelan di blok `catch` kosong atau record `P2025` tidak diteruskan ke Error Boundary. | `fix(actions): terapkan transaksi atomik dan cegah penelanan error Prisma P2003/P2025 (#13)` |
| **4** | Issue #14 | Penghitung sisa karakter pada formulir proposal/ulasan tidak berkurang atau berubah saat pengguna mengetik | Peramban (Client Component) | Nilai sisa disimpan di `useState` dan dimutasi melalui `useEffect` dengan dependency array kosong `[]`, sehingga efek hanya berjalan sekali saat mount. | `fix(ui): hitung sisa karakter langsung saat render sebagai nilai turunan (#14)` |

---

## 3. Catatan Penelusuran

### Galat 1: Status Ketersediaan / Eksklusivitas Kampus Selalu `true`

#### 1. Langkah Reproduksi (Issue #11)
1. **Lingkungan**: Node.js 20/24 LTS, Next.js 16.4.1, Chrome, branch `praktikum/modul-07` (commit `36633f6`).
2. **Data Awal**: Proyek dengan status eksklusif kampus bernilai aktif (`isCampusOnly = true`).
3. **Langkah-langkah**:
   - Jalankan konfigurasi debugger `Next.js: debug server-side`.
   - Buka formulir pengubahan proyek / pembuatan proyek.
   - Pilih opsi non-eksklusif / publik (mengirimkan string payload `"false"`).
   - Klik tombol Simpan/Terbitkan, lalu periksa data hasil mutasi di database/katalog.
4. **Hasil yang Diharapkan**: Proyek tersimpan dengan `isCampusOnly = false` (katalog publik).
5. **Hasil Aktual**: Proyek tetap tersimpan dengan `isCampusOnly = true`, meskipun payload berbunyi `"false"`.
6. **Frekuensi**: 5 dari 5 percobaan (100%).

#### 2. Bukti Sebelum Perbaikan
- **Payload Network**: Form mengirimkan `isCampusOnly: "false"`.
- **Debug Console VS Code**:
  ```text
  > Object.fromEntries(formData)
  { judul: 'Website Kampus', kategori: 'Web Development', isCampusOnly: 'false' }
  > Boolean("false")
  true
  > z.coerce.boolean().parse("false")
  true
  ```
- **Tangkapan Layar**:  
  ![Bukti Galat 1 Debug Console](image/modul-07/ss-02-galat-1-boolean-coerce.png)  
  `[ISI SETELAH TANGKAPAN LAYAR / PR SELESAI: Tangkapan layar payload Network & evaluasi Debug Console]`

#### 3. Akar Penyebab & Perbaikan
- **Akar Penyebab**: Penggunaan `z.coerce.boolean()` memanfaatkan konversi bawaan JavaScript `Boolean(input)`. Karena string non-kosong `"false"` bernilai truthy, hasilnya selalu `true`.
- **Kode Perbaikan (`lib/skema.ts`)**:
  ```typescript
  // SEBELUM:
  // isCampusOnly: z.coerce.boolean().default(false),

  // SESUDAH:
  // z.stringbool() memetakan "true" -> true, "false" -> false, dan menolak nilai lain
  isCampusOnly: z.union([z.boolean(), z.stringbool()]).default(false),
  ```

#### 4. Bukti Sesudah Perbaikan
Langkah reproduksi diulang 5 kali dengan nilai `"false"`. Hasil: `hasil.data.isCampusOnly` bernilai `false` pada 5 dari 5 percobaan (100% konsisten).

---

### Galat 2: `redirect()` Tertelan Blok `try...catch` pada Server Action

#### 1. Langkah Reproduksi (Issue #12)
1. **Lingkungan**: Node.js 20/24 LTS, Next.js 16.4.1, Chrome, branch `praktikum/modul-07`.
2. **Data Awal**: Proyek tanpa penawaran di `/projects/[id]`.
3. **Langkah-langkah**:
   - Jalankan Server Action `hapusProyek(id)`.
   - Amati respon peramban dan output terminal.
4. **Hasil yang Diharapkan**: Item terhapus dan peramban dialihkan otomatis ke `/projects`.
5. **Hasil Aktual**: Item berhasil terhapus dari basis data, namun halaman tetap diam di tempat, dan terminal mencatat pesan galat tangkapan `catch`.
6. **Frekuensi**: 5 dari 5 percobaan.

#### 2. Bukti Sebelum Perbaikan
- **Debug Console / Call Stack**:
  ```text
  > e.message
  'NEXT_REDIRECT'
  > e.digest
  'NEXT_REDIRECT;replace;/projects;307;'
  ```
- **Tangkapan Layar**:  
  ![Bukti Galat 2 Next Redirect](image/modul-07/ss-03-galat-2-next-redirect.png)  
  `[ISI SETELAH TANGKAPAN LAYAR / PR SELESAI: Tangkapan layar e.digest NEXT_REDIRECT tertangkap di catch]`

#### 3. Akar Penyebab & Perbaikan
- **Akar Penyebab**: Next.js App Router mengimplementasikan navigasi `redirect()` dengan melempar eksepsi internal bertipe `NEXT_REDIRECT`. Jika `redirect()` dipanggil di dalam blok `try...catch`, eksepsi tersebut tertelan oleh `catch` sehingga proses navigasi dihentikan.
- **Kode Perbaikan (`app/projects/[id]/actions.ts`)**:
  ```typescript
  // SEBELUM:
  // try {
  //   await prisma.project.delete({ where: { id } });
  //   redirect("/projects");
  // } catch (e) {
  //   console.log("Gagal menghapus");
  // }

  // SESUDAH:
  await prisma.$transaction([
    prisma.bid.deleteMany({ where: { projectId: id } }),
    prisma.project.delete({ where: { id } }),
  ]);
  revalidatePath("/projects");
  redirect("/projects"); // PENTING: Berada di luar blok try-catch
  ```

#### 4. Bukti Sesudah Perbaikan
Setelah memindahkan `redirect()` ke luar `try...catch`, peramban langsung mengalihkan rute secara mulus ke `/projects` pada 5 dari 5 percobaan.

---

### Galat 3: Galat Foreign Key `P2003` & Record `P2025` Ditelan Diam-diam

#### 1. Langkah Reproduksi (Issue #13)
1. **Lingkungan**: Node.js 20/24 LTS, Next.js 16.4.1, PostgreSQL 18 via Docker.
2. **Data Awal**: Proyek yang memiliki minimal 1 penawaran proposal mahasiswa (`Bid`).
3. **Langkah-langkah**:
   - Buka halaman proyek dan klik Hapus.
   - Amati log terminal dan respon UI.
4. **Hasil yang Diharapkan**: Pengguna mendapatkan pemberitahuan bahwa data terkait membatasi penghapusan, atau penghapusan dilakukan secara atomik tanpa menyisakan *orphan record*.
5. **Hasil Aktual**: Muncul pesan umum atau tidak ada reaksi sama sekali karena eksepsi ditelan tanpa konteks.
6. **Frekuensi**: 5 dari 5 percobaan.

#### 2. Bukti Sebelum Perbaikan
- **Stack Trace Terminal**:
  ```text
  PrismaClientKnownRequestError:
  Invalid `prisma.project.delete()` invocation:
  Foreign key constraint failed on the field: `Bid_projectId_fkey (index)`
    code: 'P2003'
    clientVersion: '7.10.1'
  ```
- **Tangkapan Layar**:  
  ![Bukti Galat 3 Prisma Foreign Key](image/modul-07/ss-04-galat-3-prisma-foreign-key.png)  
  `[ISI SETELAH TANGKAPAN LAYAR / PR SELESAI: Potongan stack trace P2003 di terminal]`

#### 3. Akar Penyebab & Perbaikan
- **Akar Penyebab**: Relasi foreign key antara `Project` dan `Bid` mencegah penghapusan induk saat data anak masih ada (`P2003`). Selain itu, jika record sudah dihapus dari tab lain (`P2025`), menelan galat di blok `catch` mencegah Next.js menampilkan halaman penanganan galat `error.tsx`.
- **Kode Perbaikan**:
  1. Menggunakan transaksi atomik `prisma.$transaction` untuk membersihkan relasi secara aman.
  2. Meneruskan galat `P2025` agar ditangkap oleh Error Boundary `app/projects/[id]/error.tsx`.
  3. Membangun komponen antarmuka `app/projects/[id]/error.tsx` dengan dukungan `error.digest` dan tombol `retry()`.

#### 4. Bukti Sesudah Perbaikan
Ketika diuji membuka detail proyek yang sama di 2 tab lalu menghapus di tab 1 dan merefresh/menghapus di tab 2, tab kedua menampilkan antarmuka ramah `Proyek Gagal Diproses` dengan kode rujukan digest pada 5 dari 5 percobaan.

---

### Galat 4: Penghitung Sisa Karakter Proposal/Ulasan Tidak Reaktif

#### 1. Langkah Reproduksi (Issue #14)
1. **Lingkungan**: Chrome, React Developer Tools, branch `praktikum/modul-07`.
2. **Data Awal**: Formulir pengajuan proposal penawaran di `/projects/[id]`.
3. **Langkah-langkah**:
   - Buka modal/formulir proposal penawaran.
   - Ketikkan beberapa karakter atau kalimat pada kolom proposal penawaran.
   - Perhatikan teks indikator *"1500 karakter tersisa"*.
4. **Hasil yang Diharapkan**: Angka sisa karakter berkurang secara *real-time* seiring teks diketik (misal mengetik 20 karakter menampilkan *"1480 karakter tersisa"*).
5. **Hasil Aktual**: Angka sisa karakter tetap terpaku pada angka awal dan tidak pernah berubah.
6. **Frekuensi**: 5 dari 5 percobaan.

#### 2. Bukti Sebelum Perbaikan
- **React Developer Tools**: Tab *Components* menunjukkan state `teksProposal` berubah setiap ketikan, namun state `sisa` tetap tidak berubah karena `useEffect` hanya dieksekusi saat mount (`[]`).
- **Tangkapan Layar**:  
  ![Bukti Galat 4 React DevTools](image/modul-07/ss-05-galat-4-character-counter.png)  
  `[ISI SETELAH TANGKAPAN LAYAR / PR SELESAI: Tangkapan layar React DevTools menunjukkan state tidak sinkron]`

#### 3. Akar Penyebab & Perbaikan
- **Akar Penyebab**: Pola anti-pattern React di mana nilai turunan yang bisa dihitung secara sinkron disimpan ke dalam `useState` terpisah dan dimutasi melalui `useEffect` dengan array dependensi kosong (`[]`).
- **Kode Perbaikan (`components/features/projects/ProposalBidForm.tsx`)**:
  ```typescript
  // SEBELUM (Anti-pattern):
  // const [sisa, setSisa] = useState(1500);
  // useEffect(() => { setSisa(1500 - isi.length); }, []);

  // SESUDAH (Nilai turunan saat render):
  const [teksProposal, setTeksProposal] = useState(state.nilai?.pesanProposal || proposalText || "");
  const sisaKarakter = 1500 - teksProposal.length;
  ```

#### 4. Bukti Sesudah Perbaikan
Mengetik teks langsung memperbarui tampilan sisa karakter secara instan tanpa re-render berlebih dan lulus aturan linter `react-hooks/exhaustive-deps`.

---

## 4. Keputusan Teknis

### 1. `z.stringbool()` vs Alternatif Lain
- **Alternatif 1 (`z.coerce.boolean()`)**: Ditolak karena memanfaatkan fungsi bawaan `Boolean(val)`. Pada JavaScript, string non-kosong apapun (termasuk `"false"`, `"0"`, `"off"`) bernilai `true`.
- **Alternatif 2 (Prapemrosesan Manual / `z.preprocess`)**: Berhasil memetakan string, tetapi menambah kode *boilerplate* dan rentan inkonsistensi penanganan tipe jika menerima masukan non-string.
- **Keputusan Terpilih (`z.union([z.boolean(), z.stringbool()])`)**: Solusi bawaan standar Zod 4. `z.stringbool()` secara deklaratif memvalidasi dan memetakan string `"true"` menjadi boolean `true`, string `"false"` menjadi `false`, mendukung boolean asli, serta menolak masukan acak dengan galat validasi yang terstruktur.

### 2. Aturan Hapus Item/Proyek Berelasi
- **Alternatif 1 (`onDelete: Cascade` di Level Database/Prisma Schema)**: Otomatis menghapus anak data, tetapi berbahaya jika terjadi penghapusan tidak disengaja oleh pengguna tanpa konfirmasi.
- **Alternatif 2 (Menolak Mutlak / Restrict)**: Aman untuk melindungi data portofolio penawaran mahasiswa, tetapi menyulitkan pembersihan data uji.
- **Keputusan Terpilih (Transaksi Atomik `$transaction` & Restrict Berdasarkan Status)**:
  Untuk Server Action detail proyek, operasi penghapusan menggunakan `prisma.$transaction([ prisma.bid.deleteMany(...), prisma.project.delete(...) ])` untuk menjamin konsistensi ACID (keduanya sukses atau keduanya dibatalkan). Untuk penghapusan proyek di sisi klien, sistem memvalidasi eksistensi penawaran sebelum menghapus agar hak penawar tetap terlindungi.

### 3. Nilai Turunan Saat Render vs `useEffect`
- Mengacu pada panduan resmi React (*You Might Not Need an Effect*), nilai yang dapat dihitung dari state atau props yang sudah ada tidak boleh disimpan dalam state baru atau disinkronkan melalui `useEffect`.
- Menghitung sisa karakter langsung pada saat render (`const sisa = 1500 - teks.length`) menjamin representasi tampilan selalu sinkron 100%, menghilangkan siklus re-render ekstra, dan membersihkan peringatan dependensi linter.

### 4. Batas Penanganan Galat: Server Action vs `error.tsx`
- **Ditangani di Server Action (Return `StatusForm`)**: Galat yang diharapkan (*expected business errors*), seperti validasi masukan formulir yang tidak lengkap, email duplikat (`P2002`), atau masa tenggat kadaluarsa. Galat ini dikembalikan sebagai objek `{ success: false, galat, pesan }` agar formulir dapat menampilkan pesan kesalahan kontekstual di dekat field terkait.
- **Diteruskan ke `error.tsx` (Throw Exception)**: Galat sistemik tak terduga (*unexpected/exceptional errors*), seperti basis data tidak dapat dijangkau, record hilang akibat konkurensi tab lain (`P2025`), atau kegagalan transaksi atomik. Galat ini dilempar keluar agar ditangkap oleh Error Boundary Next.js, dicatat ke log server secara aman dengan kode rujukan unik (`error.digest`), dan menyediakan tombol pemulihan interaktif (`retry()`).

---

## 5. Telaah Kode (Pull Request)

### A. Tautan Pull Request
- **Pull Request Proyek Sendiri**: `[ISI SETELAH PR DIBUAT DARI praktikum/modul-07 KE main]`
- **Pull Request Pasangan**: `[ISI TAUTAN PR REPOSITORI PASANGAN]`

### B. Ringkasan Komentar Telaah pada PR Pasangan
*(Format: baris \| kategori \| masalah \| perbaikan)*

1. `L49 | Validasi | z.coerce.boolean() mengubah string 'false' menjadi true karena memakai Boolean() bawaan | Gunakan z.stringbool() dari Zod 4 agar memetakan 'true'/'false' secara akurat.`
   ```suggestion
   isCampusOnly: z.stringbool(),
   ```
2. `L28 | Penanganan Galat | redirect('/projects') dipanggil di dalam blok try-catch sehingga NEXT_REDIRECT tertangkap dan membatalkan navigasi | Pindahkan pemanggilan redirect() ke luar blok try-catch.`
   ```suggestion
   revalidatePath("/projects");
   redirect("/projects");
   ```
3. `L195 | Performa / React Hooks | Penghitung sisa karakter disimpan dalam useState dan dimutasi via useEffect([]) sehingga tidak reaktif saat pengguna mengetik | Hapus useState dan useEffect untuk sisa karakter, hitung langsung saat render.`
   ```suggestion
   const sisaKarakter = 1500 - teksProposal.length;
   ```
4. `Nit: penamaan variabel err pada blok catch sebaiknya lebih deskriptif seperti databaseError.`

### C. Tanggapan atas Komentar Telaah yang Diterima
`[ISI SETELAH TELAAH PASANGAN DITERIMA: Ringkasan komentar dari pasangan telaah beserta keputusan diterapkan atau ditolak dengan alasan teknis]`

*Format panduan pengisian tanggapan telaah:*
- **Komentar 1 (Diterapkan)**: Mengadopsi saran penamaan variabel atau penyederhanaan logika penanganan galat pada commit perbaikan.
- **Komentar 2 (Ditolak / Dipertahankan)**: Mempertahankan pendekatan implementasi yang ada dengan menyertakan argumen teknis (contoh: mempertahankan `z.union([z.boolean(), z.stringbool()])` alih-alih `z.stringbool()` saja agar tetap mendukung pemanggilan langsung berparameter boolean murni dari API/unit test).

---

## 6. Kendala dan Penyelesaian

1. **Kendala Port Inspector Debugger**:
   - *Masalah*: Saat pertama kali menjalankan sesi debug `Next.js: debug server-side`, muncul notifikasi `Starting inspector on 127.0.0.1:9229 failed: address already in use`.
   - *Penyebab*: Terdapat proses Node.js `npm run dev` lama yang masih berjalan di latar belakang dan mengunci port 9229.
   - *Penyelesaian*: Menghentikan sesi lama melalui kombinasi `Shift+F5` pada VS Code dan menjalankan ulang sesi debugger baru.

2. **Unbound Breakpoint di Server Component**:
   - *Masalah*: Breakpoint yang dipasang pada `app/projects/[id]/page.tsx` berwarna abu-abu (*unbound*).
   - *Penyebab*: Turbopack/Next.js melakukan kompilasi berkas secara *on-demand*. Berkas belum dimuat ke memori sebelum rute diakses.
   - *Penyelesaian*: Mengakses URL target sekali di peramban, breakpoint berubah menjadi merah solid, dan eksepsi/eksekusi berhasil tertangkap saat halaman dimuat ulang.

---

## 7. Catatan Pemanfaatan AI

- **Alat**: Antigravity AI (Lead Architect & Software Engineering Debugging Agent).
- **Perintah Utama**:
  - *"Observasi dan audit repositori terkait kebutuhan Praktikum Modul 7"*
  - *"Konfigurasi launch.json, perbaiki galat boolean Zod, perbaiki redirect Server Action, buat error.tsx, dan susun dokumen teknis"*
- **Bagian Kode yang Dihasilkan AI**:
  - Berkas konfigurasi `.vscode/launch.json` untuk *full-stack Next.js debugging*.
  - Pembaruan skema `lib/skema.ts` menggunakan `z.stringbool()`.
  - Refaktorisasi Server Action `app/projects/[id]/actions.ts` dan `app/client/projects/actions.ts`.
  - Komponen Error Boundary `app/projects/[id]/error.tsx`.
  - Refaktorisasi penghitung karakter render-time di `components/features/projects/ProposalBidForm.tsx`.
- **Galat yang Ditemukan**:
  - Jebakan `z.coerce.boolean()` pada atribut `isCampusOnly`.
  - Penelanan galat database pada kueri `findUnique` yang menyamarkan kegagalan koneksi menjadi 404 `notFound()`.
- **Cara Verifikasi**:
  - Pemeriksaan statis via `npx tsc --noEmit` (0 kesalahan tipe).
  - Pemeriksaan linter via `npm run lint` (0 galat aturan React/Hooks).
  - Pengujian logika Zod menggunakan runner Node.js REPL.

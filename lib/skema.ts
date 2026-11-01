import { z } from "zod";

/**
 * SKEMA VALIDASI ZOD - STUDANCE PLATFORM (PEKAN 5 PAW)
 * 
 * Berkas ini bertindak sebagai Single Source of Truth (SSOT) untuk validasi masukan formulir
 * baik di sisi klien (Client Components) maupun di sisi server (Server Actions & Route Handlers).
 * Bebas dari modul server-only sehingga aman diimpor oleh Client Component.
 */

// =============================================================================
// A. Skema Proyek Klien (skemaProyek) & Tipe ProyekInput
// =============================================================================

export const KATEGORI_PROYEK = [
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "Graphic Design",
  "Data & AI",
  "Writing & Translation",
  "Video & Audio",
  "Academic & Tutoring",
] as const;

export const skemaProyek = z
  .object({
    judul: z
      .string()
      .trim()
      .min(5, { error: "Judul proyek minimal 5 karakter" })
      .max(100, { error: "Judul proyek maksimal 100 karakter" }),
    kategori: z.enum(KATEGORI_PROYEK, {
      error: "Pilih kategori proyek yang valid",
    }),
    deskripsi: z
      .string()
      .trim()
      .min(20, { error: "Deskripsi kebutuhan proyek minimal 20 karakter" })
      .max(2000, { error: "Deskripsi maksimal 2000 karakter" }),
    anggaran: z.coerce
      .number()
      .int({ error: "Anggaran harus berupa bilangan bulat" })
      .min(50000, { error: "Anggaran minimal Rp50.000" })
      .max(50000000, { error: "Anggaran maksimal Rp50.000.000 untuk skema MVP" }),
    tenggatWaktu: z
      .string()
      .min(1, { error: "Tenggat waktu pengerjaan wajib diisi" }),
    isCampusOnly: z.coerce.boolean().default(false),
    campusName: z.string().trim().optional(),
    keahlian: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. Proyek khusus kampus wajib menyertakan nama kampus (panjang >= 3)
    if (data.isCampusOnly && (!data.campusName || data.campusName.trim().length < 3)) {
      ctx.addIssue({
        code: "custom",
        message: "Nama institusi kampus wajib diisi untuk proyek khusus kampus",
        path: ["campusName"],
      });
    }

    // 2. Tenggat waktu harus tanggal valid dan berada di masa depan (> hari ini)
    const deadlineDate = new Date(data.tenggatWaktu);
    const today = new Date();
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= today) {
      ctx.addIssue({
        code: "custom",
        message: "Tenggat waktu harus tanggal di masa depan",
        path: ["tenggatWaktu"],
      });
    }
  });

export type ProyekInput = z.infer<typeof skemaProyek>;
// Alias kompatibilitas kode sebelumnya
export type MasukanProyek = ProyekInput;

// =============================================================================
// B. Skema Proposal / Penawaran Proyek (skemaPenawaran) & Tipe PenawaranInput
// =============================================================================

export const skemaPenawaran = z.object({
  proyekId: z.string().min(1, { error: "ID proyek tidak valid" }),
  nominalPenawaran: z.coerce
    .number()
    .int({ error: "Nominal penawaran harus bulat" })
    .min(25000, { error: "Penawaran minimal Rp25.000" })
    .max(50000000, { error: "Penawaran maksimal Rp50.000.000" }),
  durasiHari: z.coerce
    .number()
    .int({ error: "Durasi harus berupa angka bulat" })
    .min(1, { error: "Durasi minimal 1 hari" })
    .max(180, { error: "Durasi maksimal 180 hari" }),
  pesanProposal: z
    .string()
    .trim()
    .min(20, { error: "Pesan proposal minimal 20 karakter agar klien memahami tawaranmu" })
    .max(1500, { error: "Pesan proposal maksimal 1500 karakter" }),
  portofolioUrl: z
    .string()
    .trim()
    .url({ error: "Format tautan portofolio tidak valid (gunakan awalan http/https)" })
    .optional()
    .or(z.literal("")),
});

export type PenawaranInput = z.infer<typeof skemaPenawaran>;

// =============================================================================
// C. Skema Masuk & Pendaftaran (skemaLogin & skemaRegister) - Standar NIST SP 800-63B
// =============================================================================

/**
 * Skema Masuk (Login)
 * Kebijakan kata sandi NIST SP 800-63B:
 * - Panjang 8-64 karakter
 * - Tanpa aturan komposisi kaku (mendukung password manager, passphrase, & paste)
 */
export const skemaLogin = z.object({
  email: z
    .email({ error: "Format email tidak valid" })
    .trim(),
  password: z
    .string()
    .min(8, { error: "Kata sandi minimal 8 karakter" })
    .max(64, { error: "Kata sandi maksimal 64 karakter" }),
});

export type LoginInput = z.infer<typeof skemaLogin>;
export const loginSchema = skemaLogin; // Alias kompatibilitas
export const skemaMasuk = skemaLogin;   // Alias kompatibilitas
export type MasukanMasuk = LoginInput;

/**
 * Helper validasi format email institusi resmi kampus (.ac.id / .edu)
 */
export const skemaEmailKampus = z
  .email({ error: "Format email kampus tidak valid" })
  .trim()
  .refine(
    (val) => val.endsWith(".ac.id") || val.endsWith(".edu"),
    {
      message: "Email harus menggunakan domain resmi institusi kampus (contoh: student.universitas.ac.id)",
    }
  );

/**
 * Skema Pendaftaran Akun Pengguna Baru (Register)
 * Menampung pendaftaran umum maupun mahasiswa terverifikasi kampus.
 */
export const skemaRegister = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, { error: "Nama lengkap minimal 3 karakter" })
      .max(80, { error: "Nama maksimal 80 karakter" }),
    email: z
      .email({ error: "Format email institusi kampus atau pribadi tidak valid" })
      .trim(),
    role: z.enum(["STUDENT", "CLIENT", "ADMIN"]).default("STUDENT"),
    password: z
      .string()
      .min(8, { error: "Kata sandi minimal 8 karakter" })
      .max(64, { error: "Kata sandi maksimal 64 karakter" }),
    confirmPassword: z
      .string()
      .min(8, { error: "Konfirmasi kata sandi wajib diisi" })
      .max(64, { error: "Konfirmasi kata sandi maksimal 64 karakter" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Konfirmasi kata sandi tidak cocok dengan kata sandi",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterInput = z.infer<typeof skemaRegister>;
export const registerSchema = skemaRegister; // Alias kompatibilitas

/**
 * Skema Khusus Pendaftaran Mahasiswa dengan Validasi Email Kampus & NIM
 */
export const skemaRegisterMahasiswa = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, { error: "Nama lengkap minimal 3 karakter" })
      .max(80, { error: "Nama maksimal 80 karakter" }),
    email: skemaEmailKampus,
    nim: z
      .string()
      .trim()
      .min(5, { error: "NIM / ID Mahasiswa minimal 5 karakter" })
      .max(20, { error: "NIM / ID Mahasiswa maksimal 20 karakter" })
      .optional(),
    campusName: z
      .string()
      .trim()
      .min(3, { error: "Nama institusi kampus minimal 3 karakter" })
      .optional(),
    password: z
      .string()
      .min(8, { error: "Kata sandi minimal 8 karakter" })
      .max(64, { error: "Kata sandi maksimal 64 karakter" }),
    confirmPassword: z
      .string()
      .min(8, { error: "Konfirmasi kata sandi wajib diisi" })
      .max(64, { error: "Konfirmasi kata sandi maksimal 64 karakter" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Konfirmasi kata sandi tidak cocok dengan kata sandi",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterMahasiswaInput = z.infer<typeof skemaRegisterMahasiswa>;

// =============================================================================
// D. Helper Format Galat Zod
// =============================================================================

/**
 * Format Galat Zod: Mengonversi ZodError menjadi Record pesan galat per field
 */
export function formatZodErrors<T>(error: z.ZodError<T>): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors;
}

import { z } from 'zod';

/**
 * Skema Validasi Zod 4 untuk Formulir Penerbitan Proyek Klien (Studance)
 * Mengikuti kaidah Modul 5 dan standar Zod v4.x
 */
export const skemaProyek = z.object({
  judul: z
    .string()
    .trim()
    .min(5, 'Judul proyek minimal 5 karakter')
    .max(100, 'Judul proyek maksimal 100 karakter'),
  kategori: z.enum(
    ['web_dev', 'mobile_dev', 'ui_ux', 'academic_research'],
    { error: 'Pilih salah satu kategori proyek yang valid' }
  ),
  anggaran: z.coerce
    .number({ error: 'Anggaran harus berupa angka valid' })
    .min(50000, 'Anggaran proyek minimal Rp50.000'),
  tenggatWaktu: z
    .string()
    .min(10, 'Tenggat waktu proyek wajib diisi'),
  deskripsi: z
    .string()
    .trim()
    .min(20, 'Deskripsi proyek minimal 20 karakter')
    .max(1000, 'Deskripsi proyek maksimal 1000 karakter'),
  eksklusifKampus: z.stringbool().default(false),
  keahlian: z.string().optional(),
});

export type MasukanProyek = z.infer<typeof skemaProyek>;

/**
 * Skema Validasi Zod 4 untuk Formulir Masuk / Login Demo (Legacy/Compat)
 */
export const skemaMasuk = z.object({
  email: z.email('Format email tidak valid'),
  kataSandi: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});

export type MasukanMasuk = z.infer<typeof skemaMasuk>;

/**
 * Skema Validasi Autentikasi Zod 4 (Figma Design Spec)
 */
export const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Nama lengkap minimal 3 karakter')
      .max(80, 'Nama maksimal 80 karakter'),
    email: z.email('Format email institusi/pribadi tidak valid'),
    password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;


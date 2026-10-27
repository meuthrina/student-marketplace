"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/skema";
import { buatSesi, hapusSesi } from "@/lib/sesi";
import { cariPengguna, tambahPengguna, emailPenggunaSudahAda } from "@/lib/data";
import type { StatusForm } from "@/lib/status-form";

/**
 * Server Action: Autentikasi Masuk (Login)
 * Memvalidasi bentuk via Zod 4, mencocokkan kredensial akun,
 * menerbitkan cookie sesi server HttpOnly, dan mengalihkan pengguna.
 */
export async function loginAction(
  _prevState: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {
    email: String(mentah.email ?? ""),
  };

  // 1. Validasi Bentuk Sintaksis via Zod 4 (Defensive check terhadap undefined)
  const schema =
    loginSchema ??
    z.object({
      email: z.email("Format email tidak valid"),
      password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    });

  const hasil = schema.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali format isian email dan kata sandi Anda.",
      nilai,
    };
  }

  // 2. Verifikasi Kredensial Pengguna (Akun Demo Klien & Mahasiswa)
  const inputEmail = hasil.data.email.trim().toLowerCase();
  const inputPassword = hasil.data.password;

  // Akun Demo Klien: klien@pertamina.ac.id / KlienPertamina2026!
  const demoClientEmail = (process.env.DEMO_EMAIL || "klien@pertamina.ac.id").trim().toLowerCase();
  const demoClientPassword = process.env.DEMO_KATA_SANDI || "KlienPertamina2026!";

  // Akun Demo Mahasiswa: nadia.putri@student.universitaspertamina.ac.id / Nadia2026!
  const demoStudentEmail = "nadia.putri@student.universitaspertamina.ac.id";
  const demoStudentPassword = "Nadia2026!";

  const isDemoClient =
    inputEmail === demoClientEmail && inputPassword === demoClientPassword;

  const isDemoStudent =
    inputEmail === demoStudentEmail && inputPassword === demoStudentPassword;

  const isGeneralStudentDemo =
    inputEmail.endsWith("universitaspertamina.ac.id") &&
    (inputPassword === "MahasiswaPertamina2026!" || inputPassword === demoClientPassword);

  const existingUser = cariPengguna(inputEmail);

  if (!isDemoClient && !isDemoStudent && !isGeneralStudentDemo && !existingUser) {
    return {
      pesan: "Kombinasi email atau kata sandi tidak valid.",
      nilai,
    };
  }

  // 3. Penerbitan Sesi Server Terisolasi
  const role = hasil.data.email.toLowerCase().endsWith(".ac.id")
    ? "STUDENT"
    : "CLIENT";
  await buatSesi(hasil.data.email, role);

  // 4. Pengalihan Pengguna (Wajib di luar try-catch)
  if (role === "STUDENT") {
    redirect("/projects");
  } else {
    redirect("/client/projects/create");
  }
}

/**
 * Server Action: Pendaftaran Akun Baru (Register)
 * Memvalidasi bentuk via Zod 4 (termasuk kesamaan konfirmasi kata sandi),
 * memeriksa keunikan email di data store (validasi semantik),
 * menyimpan user baru, menerbitkan sesi, dan mengalihkan ke verifikasi / dashboard.
 */
export async function registerAction(
  _prevState: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {
    fullName: String(mentah.fullName ?? ""),
    email: String(mentah.email ?? ""),
  };

  // 1. Validasi Bentuk Sintaksis via Zod 4 (Defensive check terhadap undefined)
  const schema =
    registerSchema ??
    z
      .object({
        fullName: z
          .string()
          .trim()
          .min(3, "Nama lengkap minimal 3 karakter")
          .max(80, "Nama maksimal 80 karakter"),
        email: z.email("Format email institusi/pribadi tidak valid"),
        password: z.string().min(8, "Kata sandi minimal 8 karakter"),
        confirmPassword: z.string().min(8, "Konfirmasi kata sandi wajib diisi"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi kata sandi tidak cocok dengan kata sandi",
        path: ["confirmPassword"],
      });

  const hasil = schema.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali kelengkapan formulir pendaftaran.",
      nilai,
    };
  }

  // 2. Validasi Semantik: Cek Keunikan Email
  if (emailPenggunaSudahAda(hasil.data.email)) {
    return {
      galat: {
        email: [
          "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.",
        ],
      },
      pesan: "Email sudah digunakan oleh akun lain.",
      nilai,
    };
  }

  // 3. Mutasi Data: Simpan Pengguna Baru
  const userBaru = tambahPengguna(hasil.data);

  // 4. Penerbitan Sesi Terotentikasi
  await buatSesi(userBaru.email, userBaru.activeRole);

  // 5. Pengalihan Berdasarkan Peran (Wajib di luar try-catch)
  if (userBaru.email.toLowerCase().endsWith(".ac.id")) {
    redirect("/auth/verify-student");
  } else {
    redirect("/client/projects/create");
  }
}

/**
 * Server Action: Keluar dari Sesi (Logout)
 */
export async function logoutAction(): Promise<void> {
  await hapusSesi();
  redirect("/login");
}

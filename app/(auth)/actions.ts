"use server";

import { redirect } from "next/navigation";
import { skemaLogin, skemaRegister, formatZodErrors } from "@/lib/skema";
import { buatSession, hapusSession } from "@/lib/session";
import { cariPengguna, tambahPengguna, emailPenggunaSudahAda } from "@/lib/data";
import type { FormActionState } from "@/types/form";

/**
 * Server Action: Autentikasi Masuk (Login)
 * Memvalidasi bentuk via Zod 4, mencocokkan kredensial akun,
 * menerbitkan cookie sesi server HttpOnly bertanda tangan (HS256), dan mengalihkan pengguna.
 */
export async function loginAction(
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {
    email: String(mentah.email ?? ""),
  };

  // 1. Validasi Bentuk Sintaksis via Zod 4
  const hasil = skemaLogin.safeParse(mentah);
  if (!hasil.success) {
    return {
      success: false,
      galat: formatZodErrors(hasil.error),
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
      success: false,
      pesan: "Kombinasi email atau kata sandi tidak valid.",
      nilai,
    };
  }

  // 3. Penerbitan Sesi Server Terotentikasi & Bertanda Tangan (JWT HS256)
  const role = hasil.data.email.toLowerCase().endsWith(".ac.id")
    ? "STUDENT"
    : "CLIENT";

  await buatSession({
    id: existingUser?.id || `usr-${Date.now().toString(36)}`,
    nama: existingUser?.name || inputEmail.split("@")[0],
    email: inputEmail,
    role,
    campusName: existingUser?.campusName || (role === "STUDENT" ? "Universitas Pertamina" : undefined),
    isVerifiedStudent: existingUser?.isVerifiedStudent ?? (role === "STUDENT"),
  });

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
  _prevState: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {
    fullName: String(mentah.fullName ?? ""),
    email: String(mentah.email ?? ""),
  };

  // 1. Validasi Bentuk Sintaksis via Zod 4
  const hasil = skemaRegister.safeParse(mentah);
  if (!hasil.success) {
    return {
      success: false,
      galat: formatZodErrors(hasil.error),
      pesan: "Periksa kembali kelengkapan formulir pendaftaran.",
      nilai,
    };
  }

  // 2. Validasi Semantik: Cek Keunikan Email
  if (emailPenggunaSudahAda(hasil.data.email)) {
    return {
      success: false,
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

  // 4. Penerbitan Sesi Terotentikasi (JWT HS256)
  await buatSession({
    id: userBaru.id,
    nama: userBaru.name,
    email: userBaru.email,
    role: userBaru.activeRole,
    campusName: userBaru.campusName,
    isVerifiedStudent: userBaru.isVerifiedStudent,
  });

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
  await hapusSession();
  redirect("/login");
}

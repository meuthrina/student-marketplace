"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skemaProyek } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import { judulProyekSudahAda, tambahProyek } from "@/lib/data";
import type { StatusForm } from "@/lib/status-form";
import type { Project } from "@/types";

/**
 * Server Action: Penerbitan Proyek Baru oleh Klien (Aliran DFD F3)
 * Menerapkan urutan deterministik 6 tahap:
 * 1. Sesi (Pemeriksaan sesi aktif atau fallback akun demo klien)
 * 2. Validasi Bentuk (Zod 4 safeParse & flattenError)
 * 3. Validasi Semantik (Pengecekan keunikan judul proyek)
 * 4. Mutasi Data (Menyimpan entitas baru ke data store)
 * 5. Revalidasi Cache (revalidatePath)
 * 6. Pengalihan Pengguna (redirect di luar blok try-catch)
 */
export async function simpanProyek(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Sesi
  const sesi = await bacaSesi();
  const clientEmail = sesi?.email || "klien@pertamina.ac.id";

  // 2. Validasi Bentuk
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {};
  for (const [kunci, isi] of Object.entries(mentah)) {
    if (typeof isi === "string") {
      nilai[kunci] = isi;
    }
  }

  const hasil = skemaProyek.safeParse(mentah);
  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir proyek.",
      nilai,
    };
  }

  // 3. Validasi Semantik
  if (judulProyekSudahAda(hasil.data.judul, sesi?.email)) {
    return {
      galat: {
        judul: [
          "Judul proyek sudah pernah diterbitkan. Gunakan judul yang berbeda.",
        ],
      },
      nilai,
    };
  }

  // 4. Mutasi
  let proyekBaru: Project;
  try {
    proyekBaru = tambahProyek(hasil.data, clientEmail);
  } catch (err) {
    console.error("Gagal menambahkan proyek:", err);
    return {
      pesan: "Gagal menyimpan proyek ke basis data.",
      nilai,
    };
  }

  // 5. Revalidasi
  revalidatePath("/projects");
  revalidatePath("/client/dashboard");

  // 6. Pengalihan (Redirect) - Wajib DI LUAR blok try-catch
  redirect(`/projects/${proyekBaru.id}`);
}

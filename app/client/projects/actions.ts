"use server";

import { revalidatePath } from "next/cache";
import { skemaProyek, formatZodErrors } from "@/lib/skema";
import { bacaSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { FormActionState, StatusForm } from "@/types/form";

/**
 * Server Action: Penerbitan Proyek Baru oleh Klien (Pekan 6 PAW)
 * Menggunakan Prisma Client terhubung langsung ke basis data PostgreSQL.
 *
 * Urutan Eksekusi Deterministik:
 * 1. Verifikasi Sesi Aktif (bacaSession)
 * 2. Ekstraksi Masukan & Validasi Zod (skemaProyek.safeParse)
 * 3. Persistensi ke PostgreSQL via Prisma Client (prisma.project.create)
 * 4. Revalidasi Jalur Cache (revalidatePath)
 * 5. Pengembalian Status Respon Terstruktur
 */
export async function simpanProyek(
  _sebelumnya: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  // 1. Verifikasi Sesi Aktif
  const sesi = await bacaSession();
  if (!sesi) {
    return {
      success: false,
      pesan: "Silakan masuk terlebih dahulu untuk menerbitkan proyek.",
    };
  }

  // 2. Ekstraksi & Normalisasi Masukan
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {};
  for (const [kunci, isi] of Object.entries(mentah)) {
    if (typeof isi === "string") {
      nilai[kunci] = isi;
    }
  }

  // Kompatibilitas field checkbox dan nama kampus default
  if (mentah.eksklusifKampus && !mentah.isCampusOnly) {
    mentah.isCampusOnly = mentah.eksklusifKampus;
  }
  if (!mentah.campusName && (mentah.isCampusOnly === "on" || mentah.isCampusOnly === "true")) {
    mentah.campusName = sesi.campusName || "Universitas Pertamina";
  }

  const hasil = skemaProyek.safeParse(mentah);
  if (!hasil.success) {
    return {
      success: false,
      galat: formatZodErrors(hasil.error),
      pesan: "Periksa kembali isian formulir proyek.",
      nilai,
    };
  }

  // 3. Persistensi Data ke Basis Data PostgreSQL
  try {
    await prisma.project.create({
      data: {
        title: hasil.data.judul,
        category: hasil.data.kategori,
        description: hasil.data.deskripsi,
        budget: hasil.data.anggaran,
        deadline: new Date(hasil.data.tenggatWaktu),
        isCampusOnly: hasil.data.isCampusOnly,
        campusName: hasil.data.campusName || null,
        skills: hasil.data.keahlian || null,
        status: "OPEN",
        bidsCount: 0,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return {
          success: false,
          pesan: "Judul atau nilai unik proyek sudah terdaftar pada basis data.",
          nilai,
        };
      }
      if (err.code === "P2003") {
        return {
          success: false,
          pesan: "Batasan integritas referensial data tidak terpenuhi.",
          nilai,
        };
      }
    }
    console.error("Gagal menambahkan proyek ke database:", err);
    return {
      success: false,
      pesan: "Gagal menyimpan proyek ke basis data.",
      nilai,
    };
  }

  // 4. Revalidasi Jalur Cache
  revalidatePath("/projects");
  revalidatePath("/client/dashboard");

  // 5. Kembalikan Status Berhasil
  return {
    success: true,
    pesan: "Proyek berhasil diterbitkan secara persisten!",
  };
}

/**
 * Server Action: Perubahan Status Proyek (Pekan 6 PAW)
 * Mengubah status entitas proyek pada basis data PostgreSQL via prisma.project.update.
 */
export async function ubahStatusProyek(
  id: string,
  statusBaru: string
): Promise<StatusForm> {
  const sesi = await bacaSession();
  if (!sesi) {
    return {
      success: false,
      pesan: "Silakan masuk terlebih dahulu untuk mengubah status proyek.",
    };
  }

  if (!id || typeof id !== "string") {
    return {
      success: false,
      pesan: "ID proyek tidak valid.",
    };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: { status: statusBaru },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return {
          success: false,
          pesan: "Proyek tidak ditemukan.",
        };
      }
    }
    console.error("Gagal mengubah status proyek:", err);
    return {
      success: false,
      pesan: "Gagal memperbarui status proyek di basis data.",
    };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);

  return {
    success: true,
    pesan: `Status proyek berhasil diubah menjadi ${statusBaru}.`,
  };
}

/**
 * Server Action: Penghapusan Proyek Berdasarkan ID (Pekan 6 PAW)
 * Menegakkan batasan integritas referensial (onDelete: Restrict):
 * Jika proyek telah memiliki penawaran mahasiswa, aksi hapus ditolak mutlak.
 */
export async function hapusProyek(id: string): Promise<StatusForm> {
  const sesi = await bacaSession();
  if (!sesi) {
    return {
      success: false,
      pesan: "Silakan masuk terlebih dahulu untuk menghapus proyek.",
    };
  }

  if (!id || typeof id !== "string") {
    return {
      success: false,
      pesan: "ID proyek tidak valid.",
    };
  }

  try {
    // 1. Periksa apakah proyek memiliki penawaran terkait
    const count = await prisma.bid.count({
      where: { projectId: id },
    });

    if (count > 0) {
      return {
        success: false,
        pesan:
          "Proyek tidak dapat dihapus karena telah memiliki penawaran aktif dari mahasiswa (Integritas Terproteksi).",
      };
    }

    // 2. Eksekusi penghapusan jika count === 0
    await prisma.project.delete({
      where: { id },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return {
          success: false,
          pesan: "Proyek tidak ditemukan.",
        };
      }
      if (err.code === "P2003") {
        return {
          success: false,
          pesan:
            "Proyek tidak dapat dihapus karena batasan integritas referensial (onDelete: Restrict).",
        };
      }
    }
    console.error("Gagal menghapus proyek:", err);
    return {
      success: false,
      pesan: "Gagal menghapus proyek dari basis data.",
    };
  }

  revalidatePath("/projects");
  return {
    success: true,
    pesan: "Proyek berhasil dihapus.",
  };
}

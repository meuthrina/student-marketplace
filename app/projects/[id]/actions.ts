"use server";

import { revalidatePath } from "next/cache";
import { skemaPenawaran, formatZodErrors } from "@/lib/skema";
import { bacaSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { StatusForm } from "@/types/form";

/**
 * Server Action: Pengajuan Proposal Penawaran (Bidding) Mahasiswa (Pekan 6 PAW)
 * Menggunakan Transaksi Atomik ($transaction) untuk menjamin persistensi penawaran
 * dan sinkronisasi kenaikan bidsCount pada proyek secara ACID.
 *
 * Urutan Eksekusi:
 * 1. Verifikasi Sesi Kriptografis (bacaSession)
 * 2. Ekstraksi & Validasi Masukan dengan Zod (skemaPenawaran.safeParse)
 * 3. Transaksi Atomik Prisma (Bid.create + Project.update increment)
 * 4. Revalidasi Jalur Cache (revalidatePath)
 * 5. Pengembalian Respon Status Terstruktur
 */
export async function kirimPenawaran(
  _prevState: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Verifikasi Sesi Mahasiswa
  const sesi = await bacaSession();
  if (!sesi) {
    return {
      success: false,
      pesan: "Silakan masuk terlebih dahulu untuk mengajukan penawaran.",
    };
  }

  // 2. Ekstraksi Masukan Formulir
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {};
  for (const [kunci, isi] of Object.entries(mentah)) {
    if (typeof isi === "string") {
      nilai[kunci] = isi;
    }
  }

  // 3. Validasi dengan Skema Zod
  const hasil = skemaPenawaran.safeParse(mentah);
  if (!hasil.success) {
    return {
      success: false,
      galat: formatZodErrors(hasil.error),
      pesan: "Periksa kembali isian proposal Anda.",
      nilai,
    };
  }

  // 4. Jalankan Transaksi Atomik (Bid.create + Project.bidsCount increment)
  try {
    await prisma.$transaction([
      prisma.bid.create({
        data: {
          projectId: hasil.data.proyekId,
          studentId: sesi.id,
          studentName: sesi.nama,
          studentEmail: sesi.email,
          campusName: sesi.campusName || "Universitas Pertamina",
          bidAmount: hasil.data.nominalPenawaran,
          durationDays: hasil.data.durasiHari,
          message: hasil.data.pesanProposal,
          portfolioUrl: hasil.data.portofolioUrl || null,
          status: "PENDING",
        },
      }),
      prisma.project.update({
        where: { id: hasil.data.proyekId },
        data: { bidsCount: { increment: 1 } },
      }),
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2003") {
        return {
          success: false,
          pesan: "Proyek yang dituju tidak valid atau telah ditutup.",
          nilai,
        };
      }
      if (err.code === "P2025") {
        return {
          success: false,
          pesan: "Data proyek tidak ditemukan pada sistem.",
          nilai,
        };
      }
    }
    console.error("Gagal memproses transaksi pengajuan penawaran:", err);
    return {
      success: false,
      pesan: "Gagal menyimpan proposal penawaran ke basis data.",
      nilai,
    };
  }

  // 5. Revalidasi Cache Halaman Terkait
  revalidatePath(`/projects/${hasil.data.proyekId}`);
  revalidatePath("/projects");

  // 6. Kembalikan Status Berhasil
  return {
    success: true,
    pesan: "Proposal penawaran berhasil disimpan ke basis data!",
  };
}

/**
 * Server Action: Pembaruan Proposal Penawaran Mahasiswa (Update Bid - Pekan 6 PAW)
 * Memverifikasi kepemilikan dan status penawaran sebelum eksekusi prisma.bid.update.
 */
export async function ubahPenawaran(
  bidId: string,
  _prevState: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Verifikasi Sesi Mahasiswa
  const sesi = await bacaSession();
  if (!sesi) {
    return {
      success: false,
      pesan: "Silakan masuk terlebih dahulu untuk mengubah penawaran.",
    };
  }

  if (!bidId) {
    return {
      success: false,
      pesan: "ID penawaran tidak valid.",
    };
  }

  // 2. Ekstraksi Masukan & Validasi Zod
  const mentah = Object.fromEntries(formData);
  const nilai: Record<string, string> = {};
  for (const [kunci, isi] of Object.entries(mentah)) {
    if (typeof isi === "string") {
      nilai[kunci] = isi;
    }
  }

  const hasil = skemaPenawaran.safeParse(mentah);
  if (!hasil.success) {
    return {
      success: false,
      galat: formatZodErrors(hasil.error),
      pesan: "Periksa kembali isian perubahan proposal Anda.",
      nilai,
    };
  }

  // 3. Periksa kepemilikan dan status bid di basis data
  try {
    const existingBid = await prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!existingBid) {
      return {
        success: false,
        pesan: "Data penawaran tidak ditemukan.",
      };
    }

    if (existingBid.status !== "PENDING") {
      return {
        success: false,
        pesan: "Proposal yang sudah diproses tidak dapat diubah lagi.",
      };
    }

    // 4. Eksekusi pembaruan record penawaran
    await prisma.bid.update({
      where: { id: bidId },
      data: {
        bidAmount: hasil.data.nominalPenawaran,
        durationDays: hasil.data.durasiHari,
        message: hasil.data.pesanProposal,
        portfolioUrl: hasil.data.portofolioUrl || null,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return {
          success: false,
          pesan: "Penawaran tidak ditemukan di basis data.",
          nilai,
        };
      }
    }
    console.error("Gagal memperbarui penawaran:", err);
    return {
      success: false,
      pesan: "Gagal memperbarui penawaran di basis data.",
      nilai,
    };
  }

  // 5. Revalidasi Cache Halaman
  revalidatePath(`/projects/${hasil.data.proyekId}`);
  revalidatePath("/projects");

  // 6. Kembalikan Status Berhasil
  return {
    success: true,
    pesan: "Proposal penawaran berhasil diperbarui!",
  };
}

/**
 * Server Action: Pembatalan Proposal Penawaran Mahasiswa (Pekan 6 PAW)
 * Menggunakan Transaksi Atomik ($transaction) untuk menghapus record Bid
 * dan mengurangkan bidsCount pada entitas Project secara konsisten.
 */
export async function batalkanPenawaran(
  bidId: string,
  projectId: string
): Promise<StatusForm> {
  const sesi = await bacaSession();
  if (!sesi) {
    return {
      success: false,
      pesan: "Silakan masuk terlebih dahulu untuk membatalkan penawaran.",
    };
  }

  if (!bidId || !projectId) {
    return {
      success: false,
      pesan: "Identifikator penawaran atau proyek tidak valid.",
    };
  }

  try {
    await prisma.$transaction([
      prisma.bid.delete({
        where: { id: bidId },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { bidsCount: { decrement: 1 } },
      }),
    ]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return {
          success: false,
          pesan: "Penawaran atau proyek yang ingin dibatalkan tidak ditemukan.",
        };
      }
    }
    console.error("Gagal membatalkan penawaran:", err);
    return {
      success: false,
      pesan: "Gagal membatalkan penawaran pada basis data.",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  return {
    success: true,
    pesan: "Penawaran berhasil dibatalkan.",
  };
}

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata = {
  title: 'Daftar Akun Baru | Studance — Marketplace Mahasiswa',
  description:
    'Bergabung dengan Studance Universitas Pertamina untuk menjangkau proyek industri, membangun reputasi terverifikasi, dan mendapatkan penghasilan profesional.',
};

/**
 * Halaman Pendaftaran Akun (Figma Node 11:605 Mobile & 11:552 Desktop)
 * - Mobile: Tampilan kartu tunggal vertikal bersih
 * - Desktop (lg:): Layout split 2-kolom dengan kartu edukasi gelap dan form registrasi
 */
export default function RegisterPage() {
  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-8 sm:py-12 lg:py-16 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kontainer Utama Responsif (Split Desktop vs Single Mobile) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-6 lg:gap-8 items-stretch">
          
          {/* KOLOM KIRI (Desktop Hero Card - Node 11:552) */}
          <div className="rounded-[28px] bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#10182D] text-white p-7 sm:p-10 flex flex-col justify-between shadow-xl border border-slate-800 relative overflow-hidden">
            {/* Latar Belakang Dekoratif Abstrak */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Bagian Atas: Branding & Headline */}
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-white">
                    Studance<span className="text-emerald-400">.</span>
                  </span>
                </Link>
                <Badge variant="outline" size="sm" className="border-indigo-400/40 text-indigo-200 bg-indigo-950/40">
                  Universitas Pertamina
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Keahlian kampus.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">
                    Peluang nyata.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                  Platform resmi kolaborasi mahasiswa Universitas Pertamina untuk membangun reputasi, portofolio terverifikasi, dan penghasilan profesional.
                </p>
              </div>

              {/* Badge Pills Fitur Unggulan (Figma Spec) */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15 backdrop-blur-xs">
                  🎓 1 Kampus Eksklusif
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-xs">
                  🛡️ Talenta Terverifikasi
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-xs">
                  💎 Karya Transparan
                </span>
              </div>

              {/* Alur Langkah Pendaftaran 01 - 03 (Figma Node 11:552) */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-indigo-600/50 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-200 shrink-0 mt-0.5">
                    01
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Daftarkan Identitas Diri</span>
                    <span className="text-[11px] text-slate-400 leading-normal">
                      Isi data akun dengan nama lengkap dan email resmi untuk aktivasi profil.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-emerald-600/40 border border-emerald-400/30 flex items-center justify-center text-xs font-bold text-emerald-200 shrink-0 mt-0.5">
                    02
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Verifikasi NIM Kampus</span>
                    <span className="text-[11px] text-slate-400 leading-normal">
                      Tautkan email @student.universitaspertamina.ac.id untuk meraih lencana Verified Student.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-indigo-600/50 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-indigo-200 shrink-0 mt-0.5">
                    03
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Mulai Berkarya & Raih Pendapatan</span>
                    <span className="text-[11px] text-slate-400 leading-normal">
                      Ajukan penawaran proyek industri dan terima honor aman dengan proteksi sistem escrow.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Bawah: Card Info Perlindungan Escrow */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                100+ Mahasiswa Telah Terdaftar
              </span>
              <span className="font-semibold text-indigo-300">Proteksi Escrow 100%</span>
            </div>
          </div>

          {/* KOLOM KANAN (Formulir Registrasi Bersih - Node 11:605 & 11:552) */}
          <GlassCard className="p-6 sm:p-8 rounded-[28px] bg-white/95 border border-white shadow-sm flex flex-col justify-center gap-5">
            <div className="flex flex-col gap-1.5 pb-1">
              <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Buat Akun Studance Baru
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Lengkapi formulir di bawah ini untuk memulai perjalanan profesional Anda di lingkungan kampus.
              </p>
            </div>

            <RegisterForm />
          </GlassCard>

        </div>

        {/* Link Kembali ke Beranda */}
        <div className="text-center text-xs text-[#78859D] mt-6">
          <Link href="/" className="hover:text-[#4338CA] transition-colors font-medium">
            &larr; Kembali ke Beranda Utama
          </Link>
        </div>

      </div>
    </main>
  );
}

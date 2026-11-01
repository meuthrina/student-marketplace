'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { simpanProyek } from '@/app/client/projects/actions';

/**
 * CreateProjectForm Component (Client Component)
 *
 * Komponen daun interaktif untuk formulir penerbitan proyek baru (Pekan 5 PAW).
 * Menggunakan React 19 `useActionState` dengan Server Action `simpanProyek`,
 * penanganan galat deklaratif Zod, dan aksesibilitas inklusif WCAG 2.2 / ARIA.
 */
export function CreateProjectForm() {
  const [status, formAction, isPending] = useActionState(simpanProyek, {});

  return (
    <GlassCard className="p-6 sm:p-8 rounded-[24px] bg-white/80 border border-white flex flex-col gap-6 shadow-sm">
      <form action={formAction} className="flex flex-col gap-5">
        {/* Banner Notifikasi Umum (role="status") */}
        {status.pesan && (
          <div
            role="status"
            aria-live="polite"
            className={`p-3.5 rounded-[16px] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
              status.success
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}
          >
            <svg
              className={`w-4 h-4 shrink-0 ${status.success ? 'text-emerald-500' : 'text-rose-500'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {status.success ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
            <span>{status.pesan}</span>
          </div>
        )}

        {/* Field 1: Judul Proyek */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="judul" className="text-xs font-bold text-[#0F172A]">
            Judul Proyek <span className="text-red-500">*</span>
          </label>
          <input
            id="judul"
            name="judul"
            type="text"
            defaultValue={status.nilai?.judul}
            aria-invalid={Boolean(status.galat?.judul)}
            aria-describedby={status.galat?.judul ? "galat-judul" : undefined}
            placeholder="Misal: Pengembangan Landing Page Campus Week 2026"
            className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
              status.galat?.judul ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
            } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
          />
          {status.galat?.judul?.[0] && (
            <p id="galat-judul" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {status.galat.judul[0]}
            </p>
          )}
        </div>

        {/* Field 2: Kategori Proyek */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="kategori" className="text-xs font-bold text-[#0F172A]">
            Kategori Utama <span className="text-red-500">*</span>
          </label>
          <select
            id="kategori"
            name="kategori"
            defaultValue={status.nilai?.kategori || ''}
            aria-invalid={Boolean(status.galat?.kategori)}
            aria-describedby={status.galat?.kategori ? "galat-kategori" : undefined}
            className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
              status.galat?.kategori ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
            } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
          >
            <option value="">Pilih salah satu kategori proyek</option>
            <option value="Web Development">Pengembangan Web (Web Development)</option>
            <option value="Mobile Apps">Aplikasi Mobile (Mobile Apps)</option>
            <option value="UI/UX Design">Desain Antarmuka (UI/UX Design)</option>
            <option value="Graphic Design">Desain Grafis (Graphic Design)</option>
            <option value="Data & AI">Data & Kecerdasan Buatan (Data & AI)</option>
            <option value="Writing & Translation">Penulisan & Terjemahan (Writing & Translation)</option>
            <option value="Video & Audio">Video & Audio</option>
            <option value="Academic & Tutoring">Akademik & Bimbingan (Academic & Tutoring)</option>
          </select>
          {status.galat?.kategori?.[0] && (
            <p id="galat-kategori" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {status.galat.kategori[0]}
            </p>
          )}
        </div>

        {/* Field 3: Scope Eksklusif Kampus */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-[#0F172A]">
            Scope Akses Kampus (DFD F3)
          </span>
          <div className="flex items-start gap-3 p-4 rounded-[18px] bg-slate-50/80 border border-[#D8DDF0]">
            <input
              type="checkbox"
              name="isCampusOnly"
              id="isCampusOnly"
              defaultChecked={status.nilai?.isCampusOnly === 'on' || status.nilai?.isCampusOnly === 'true' || status.nilai?.eksklusifKampus === 'on'}
              aria-invalid={Boolean(status.galat?.isCampusOnly || status.galat?.campusName)}
              aria-describedby={status.galat?.isCampusOnly || status.galat?.campusName ? "galat-isCampusOnly" : undefined}
              className="mt-1 h-4 w-4 rounded border-[#D8DDF0] text-[#4338CA] focus:ring-[#4338CA] cursor-pointer"
            />
            <input type="hidden" name="campusName" value="Universitas Pertamina" />
            <div className="flex flex-col gap-1">
              <label htmlFor="isCampusOnly" className="text-xs font-bold text-[#0F172A] cursor-pointer flex items-center gap-2">
                🎓 Eksklusif Universitas Pertamina
                <ScopeBadge scope="CAMPUS_SPECIFIC" targetCampus="Universitas Pertamina" size="sm" />
              </label>
              <p className="text-xs text-[#475569] leading-relaxed">
                Centang opsi ini agar proyek dibatasi hanya untuk mahasiswa aktif berstatus <strong>Verified Student</strong> Universitas Pertamina. Jika tidak dicentang, proyek terbuka untuk umum (Public).
              </p>
            </div>
          </div>
          {(status.galat?.isCampusOnly?.[0] || status.galat?.campusName?.[0]) && (
            <p id="galat-isCampusOnly" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {status.galat.isCampusOnly?.[0] || status.galat.campusName?.[0]}
            </p>
          )}
        </div>

        {/* Field 4 & 5: Anggaran & Tenggat Waktu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="anggaran" className="text-xs font-bold text-[#0F172A]">
              Anggaran Proyek (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              id="anggaran"
              name="anggaran"
              type="number"
              step={10000}
              defaultValue={status.nilai?.anggaran}
              aria-invalid={Boolean(status.galat?.anggaran)}
              aria-describedby={status.galat?.anggaran ? "galat-anggaran" : undefined}
              placeholder="Minimal Rp50.000"
              className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                status.galat?.anggaran ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
              } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
            />
            {status.galat?.anggaran?.[0] && (
              <p id="galat-anggaran" role="alert" className="text-red-500 text-xs mt-1 font-medium">
                {status.galat.anggaran[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tenggatWaktu" className="text-xs font-bold text-[#0F172A]">
              Batas Waktu Pengerjaan <span className="text-red-500">*</span>
            </label>
            <input
              id="tenggatWaktu"
              name="tenggatWaktu"
              type="date"
              defaultValue={status.nilai?.tenggatWaktu}
              aria-invalid={Boolean(status.galat?.tenggatWaktu)}
              aria-describedby={status.galat?.tenggatWaktu ? "galat-tenggatWaktu" : undefined}
              className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                status.galat?.tenggatWaktu ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
              } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
            />
            {status.galat?.tenggatWaktu?.[0] && (
              <p id="galat-tenggatWaktu" role="alert" className="text-red-500 text-xs mt-1 font-medium">
                {status.galat.tenggatWaktu[0]}
              </p>
            )}
          </div>
        </div>

        {/* Field 6: Deskripsi Kebutuhan */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="deskripsi" className="text-xs font-bold text-[#0F172A]">
            Deskripsi Kebutuhan & Hasil Akhir (Deliverables) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={4}
            defaultValue={status.nilai?.deskripsi}
            aria-invalid={Boolean(status.galat?.deskripsi)}
            aria-describedby={status.galat?.deskripsi ? "galat-deskripsi" : undefined}
            placeholder="Jelaskan kebutuhan spesifikasi teknis, fitur-fitur yang diinginkan, dan deliverables yang wajib dipenuhi pelamar..."
            className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
              status.galat?.deskripsi ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
            } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] resize-none`}
          />
          {status.galat?.deskripsi?.[0] && (
            <p id="galat-deskripsi" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {status.galat.deskripsi[0]}
            </p>
          )}
        </div>

        {/* Field 7: Tags Keahlian */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="keahlian" className="text-xs font-bold text-[#0F172A]">
            Keahlian yang Dibutuhkan (Pisahkan dengan koma)
          </label>
          <input
            id="keahlian"
            name="keahlian"
            type="text"
            defaultValue={status.nilai?.keahlian}
            aria-invalid={Boolean(status.galat?.keahlian)}
            aria-describedby={status.galat?.keahlian ? "galat-keahlian" : undefined}
            placeholder="Contoh: React, Next.js, Figma, Python"
            className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]"
          />
          {status.galat?.keahlian?.[0] && (
            <p id="galat-keahlian" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {status.galat.keahlian[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            href="/client/dashboard"
            className="min-h-[46px] px-6 rounded-full bg-white border border-[#D8DDEC] hover:bg-slate-50 text-[#0F172A] font-semibold text-xs inline-flex items-center justify-center transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="min-h-[46px] px-8 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-xs inline-flex items-center justify-center shadow-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Memproses...' : 'Terbitkan Proyek'}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}

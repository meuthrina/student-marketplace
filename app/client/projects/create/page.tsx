'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { simpanProyek } from '@/app/client/projects/actions';

/**
 * CreateProjectPage
 *
 * Formulir pembuatan dan publikasi proyek baru oleh Klien (Aliran DFD F3).
 * Mengintegrasikan Server Action `simpanProyek` dengan hook React 19 `useActionState`,
 * validasi Zod 4, preservasi nilai input gagal, dan kepatuhan aksesibilitas ARIA.
 */
export default function CreateProjectPage() {
  const [status, formAction, isPending] = useActionState(simpanProyek, {});

  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#78859D]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#4338CA] transition-colors">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/client/dashboard" className="hover:text-[#4338CA] transition-colors">
                Dashboard Klien
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#0F172A]">Buat Proyek Baru</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" className="min-h-[28px]">
              Aliran DFD F3: Posting Proyek
            </Badge>
            <span className="text-xs font-semibold text-[#475569]">
              Formulir Klien
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Publikasikan Kebutuhan Proyek Anda
          </h1>
          <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
            Tentukan ruang lingkup proyek, tetapkan anggaran dengan proteksi escrow, dan jangkau talenta mahasiswa terverifikasi Universitas Pertamina.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          
          {/* Main Form Card */}
          <GlassCard className="p-6 sm:p-8 rounded-[24px] bg-white/80 border border-white flex flex-col gap-6 shadow-sm">
            <form action={formAction} className="flex flex-col gap-5">
              
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
                  aria-invalid={!!status.galat?.judul}
                  aria-describedby="galat-judul"
                  placeholder="Misal: Pengembangan Landing Page Campus Week 2026"
                  className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                    status.galat?.judul ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
                  } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
                />
                {status.galat?.judul?.[0] && (
                  <p id="galat-judul" className="text-xs text-rose-500 font-medium mt-1">
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
                  aria-invalid={!!status.galat?.kategori}
                  aria-describedby="galat-kategori"
                  className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                    status.galat?.kategori ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
                  } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
                >
                  <option value="">Pilih salah satu kategori proyek</option>
                  <option value="web_dev">Pengembangan Web (Web Dev)</option>
                  <option value="mobile_dev">Aplikasi Mobile (Mobile Dev)</option>
                  <option value="ui_ux">Desain Antarmuka (UI/UX)</option>
                  <option value="academic_research">Riset & Akademik (Academic Research)</option>
                </select>
                {status.galat?.kategori?.[0] && (
                  <p id="galat-kategori" className="text-xs text-rose-500 font-medium mt-1">
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
                    name="eksklusifKampus"
                    id="eksklusifKampus"
                    defaultChecked={status.nilai?.eksklusifKampus === 'on'}
                    aria-invalid={!!status.galat?.eksklusifKampus}
                    aria-describedby="galat-eksklusifKampus"
                    className="mt-1 h-4 w-4 rounded border-[#D8DDF0] text-[#4338CA] focus:ring-[#4338CA] cursor-pointer"
                  />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="eksklusifKampus" className="text-xs font-bold text-[#0F172A] cursor-pointer flex items-center gap-2">
                      🎓 Eksklusif Universitas Pertamina
                      <ScopeBadge scope="CAMPUS_SPECIFIC" targetCampus="Universitas Pertamina" size="sm" />
                    </label>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Centang opsi ini agar proyek dibatasi hanya untuk mahasiswa aktif berstatus <strong>Verified Student</strong> Universitas Pertamina. Jika tidak dicentang, proyek terbuka untuk umum (Public).
                    </p>
                  </div>
                </div>
                {status.galat?.eksklusifKampus?.[0] && (
                  <p id="galat-eksklusifKampus" className="text-xs text-rose-500 font-medium mt-1">
                    {status.galat.eksklusifKampus[0]}
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
                    aria-invalid={!!status.galat?.anggaran}
                    aria-describedby="galat-anggaran"
                    placeholder="Minimal Rp50.000"
                    className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                      status.galat?.anggaran ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
                    } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
                  />
                  {status.galat?.anggaran?.[0] && (
                    <p id="galat-anggaran" className="text-xs text-rose-500 font-medium mt-1">
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
                    aria-invalid={!!status.galat?.tenggatWaktu}
                    aria-describedby="galat-tenggatWaktu"
                    className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                      status.galat?.tenggatWaktu ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
                    } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
                  />
                  {status.galat?.tenggatWaktu?.[0] && (
                    <p id="galat-tenggatWaktu" className="text-xs text-rose-500 font-medium mt-1">
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
                  aria-invalid={!!status.galat?.deskripsi}
                  aria-describedby="galat-deskripsi"
                  placeholder="Jelaskan kebutuhan spesifikasi teknis, fitur-fitur yang diinginkan, dan deliverables yang wajib dipenuhi pelamar..."
                  className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                    status.galat?.deskripsi ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
                  } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] resize-none`}
                />
                {status.galat?.deskripsi?.[0] && (
                  <p id="galat-deskripsi" className="text-xs text-rose-500 font-medium mt-1">
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
                  aria-invalid={!!status.galat?.keahlian}
                  aria-describedby="galat-keahlian"
                  placeholder="Contoh: React, Next.js, Figma, Python"
                  className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]"
                />
                {status.galat?.keahlian?.[0] && (
                  <p id="galat-keahlian" className="text-xs text-rose-500 font-medium mt-1">
                    {status.galat.keahlian[0]}
                  </p>
                )}
              </div>

              {/* Wadah Status Global */}
              {status.pesan && (
                <p role="status" aria-live="polite" className="text-sm font-medium text-rose-600 mt-3">
                  {status.pesan}
                </p>
              )}

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
                  {isPending ? 'Menerbitkan Proyek...' : 'Terbitkan Proyek'}
                </button>
              </div>

            </form>
          </GlassCard>

          {/* Right Guidance Sidebar */}
          <div className="flex flex-col gap-5">
            <GlassCard className="p-6 rounded-[22px] bg-white/75 border border-white flex flex-col gap-3 shadow-2xs">
              <span className="text-xs font-bold text-[#4338CA] uppercase tracking-wider">
                💡 Petunjuk Pasang Proyek
              </span>
              <ul className="space-y-2 text-xs text-[#475569] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#4338CA] font-bold">1.</span>
                  <span><strong>Khusus Kampus:</strong> Centang opsi eksklusif Universitas Pertamina untuk menjamin pelamar adalah mahasiswa aktif dengan verifikasi email resmi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4338CA] font-bold">2.</span>
                  <span><strong>Proteksi Escrow:</strong> Anggaran ditampung di sistem penampung Studance sampai Anda puas dengan deliverables.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4338CA] font-bold">3.</span>
                  <span><strong>Batas Waktu:</strong> Berikan waktu pengerjaan yang wajar agar kualitas pekerjaan mahasiswa optimal.</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6 rounded-[22px] bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-indigo-200/60 flex flex-col gap-2 shadow-2xs">
              <span className="text-xs font-bold text-[#3730A3]">
                Aliran Data Diagram (DFD Level 0)
              </span>
              <p className="text-xs text-[#4338CA] leading-relaxed">
                Formulir ini mengeksekusi <strong>Aliran DFD F3 (Data Kebutuhan Proyek)</strong> yang disimpan dan dipublikasikan ke katalog penawaran mahasiswa.
              </p>
            </GlassCard>
          </div>

        </div>

      </div>
    </main>
  );
}

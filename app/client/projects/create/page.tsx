'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { ProjectScope } from '@/types';

/**
 * CreateProjectPage
 *
 * Formulir pembuatan dan publikasi proyek baru oleh Klien (Aliran DFD F3).
 * Menghubungkan kebutuhan klien dengan talenta mahasiswa terverifikasi
 * tanpa error 404 pada rute /client/projects/create.
 */
export default function CreateProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Dev');
  const [scope, setScope] = useState<ProjectScope>('CAMPUS_SPECIFIC');
  const [targetCampus, setTargetCampus] = useState('Universitas Pertamina');
  const [budget, setBudget] = useState('1500000');
  const [deadline, setDeadline] = useState('2026-11-20');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('Next.js, Tailwind CSS, TypeScript');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    'Web Dev',
    'Mobile App',
    'UI/UX Design',
    'Data',
    'Content & Copywriting',
    'Desain Grafis',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim() || title.length < 5) {
      newErrors.title = 'Judul proyek minimal 5 karakter.';
    }

    if (!budget || Number(budget) <= 0) {
      newErrors.budget = 'Anggaran proyek harus lebih dari 0.';
    }

    if (!deadline) {
      newErrors.deadline = 'Batas waktu (deadline) wajib ditentukan.';
    }

    if (!description.trim() || description.length < 20) {
      newErrors.description = 'Deskripsi kebutuhan proyek minimal 20 karakter.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSuccessMessage('Proyek berhasil dipublikasikan ke katalog marketplace!');

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/client/dashboard');
    }, 1500);
  };

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

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="w-full p-4 rounded-[18px] bg-[#ECFDF5] border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-in fade-in shadow-xs">
            <svg
              className="w-5 h-5 text-emerald-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>{successMessage} Mengalihkan ke dashboard klien...</span>
          </div>
        )}

        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          
          {/* Main Form Card */}
          <GlassCard className="p-6 sm:p-8 rounded-[24px] bg-white/80 border border-white flex flex-col gap-6 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Field 1: Judul Proyek */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="project-title" className="text-xs font-bold text-[#0F172A]">
                  Judul Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  id="project-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Pengembangan Landing Page Campus Week 2026"
                  className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
                    errors.title ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
                  } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]`}
                />
                {errors.title && (
                  <span className="text-xs text-red-600 font-semibold">{errors.title}</span>
                )}
              </div>

              {/* Field 2: Kategori Proyek */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="project-category" className="text-xs font-bold text-[#0F172A]">
                  Kategori Utama <span className="text-red-500">*</span>
                </label>
                <select
                  id="project-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Scope Kampus (Publik vs Universitas Pertamina) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0F172A]">
                  Scope Akses Kampus (DFD F3) <span className="text-red-500">*</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setScope('CAMPUS_SPECIFIC');
                      setTargetCampus('Universitas Pertamina');
                    }}
                    className={`p-4 rounded-[18px] border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                      scope === 'CAMPUS_SPECIFIC'
                        ? 'bg-[#EEF2FF] border-[#4338CA] shadow-2xs'
                        : 'bg-white border-[#D8DDF0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4338CA]">
                        🎓 Khusus Universitas Pertamina
                      </span>
                      <ScopeBadge scope="CAMPUS_SPECIFIC" targetCampus="Universitas Pertamina" size="sm" />
                    </div>
                    <p className="text-xs text-[#475569]">
                      Hanya mahasiswa aktif berstatus <strong>Verified Student</strong> dengan NIM resmi yang dapat mengajukan proposal.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScope('PUBLIC');
                      setTargetCampus('');
                    }}
                    className={`p-4 rounded-[18px] border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                      scope === 'PUBLIC'
                        ? 'bg-[#EEF2FF] border-[#4338CA] shadow-2xs'
                        : 'bg-white border-[#D8DDF0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F766E]">
                        🌐 Terbuka Publik
                      </span>
                      <ScopeBadge scope="PUBLIC" size="sm" />
                    </div>
                    <p className="text-xs text-[#475569]">
                      Terbuka untuk semua mahasiswa umum di seluruh penjuru Indonesia.
                    </p>
                  </button>
                </div>
              </div>

              {/* Field 4 & 5: Anggaran & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="project-budget" className="text-xs font-bold text-[#0F172A]">
                    Anggaran Proyek (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="project-budget"
                    type="number"
                    required
                    min={50000}
                    step={50000}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]"
                  />
                  {errors.budget && (
                    <span className="text-xs text-red-600 font-semibold">{errors.budget}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="project-deadline" className="text-xs font-bold text-[#0F172A]">
                    Batas Waktu Pengerjaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="project-deadline"
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]"
                  />
                  {errors.deadline && (
                    <span className="text-xs text-red-600 font-semibold">{errors.deadline}</span>
                  )}
                </div>
              </div>

              {/* Field 6: Deskripsi Kebutuhan */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="project-desc" className="text-xs font-bold text-[#0F172A]">
                  Deskripsi Kebutuhan & Hasil Akhir (Deliverables) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="project-desc"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kebutuhan spesifikasi teknis, fitur-fitur yang diinginkan, dan deliverables yang wajib dipenuhi pelamar..."
                  className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] resize-none"
                />
                {errors.description && (
                  <span className="text-xs text-red-600 font-semibold">{errors.description}</span>
                )}
              </div>

              {/* Field 7: Tags Keahlian */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="project-skills" className="text-xs font-bold text-[#0F172A]">
                  Keahlian yang Dibutuhkan (Pisahkan dengan koma)
                </label>
                <input
                  id="project-skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Next.js, Figma, Python"
                  className="w-full px-4 py-3 rounded-[16px] bg-white border border-[#D8DDF0] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA]"
                />
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
                  disabled={isSubmitting}
                  className="min-h-[46px] px-8 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-xs inline-flex items-center justify-center shadow-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Menerbitkan Proyek...' : 'Publikasikan Proyek'}
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
                  <span><strong>Khusus Kampus:</strong> Pilih Universitas Pertamina untuk menjamin pelamar adalah mahasiswa aktif dengan verifikasi email resmi.</span>
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

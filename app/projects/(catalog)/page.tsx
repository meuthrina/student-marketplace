import React, { Suspense } from 'react';
import Link from 'next/link';
import { mockProjects } from '@/lib/mockData';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

/**
 * ProjectsPage (React Server Component)
*
* Menampilkan katalog proyek freelance yang terbuka untuk penawaran (bidding).
* Menggunakan arsitektur RSC siap integrasi Prisma ORM (Tugas 2) dan Suspense untuk searchParams.
*/
interface ProjectsPageProps {
  searchParams?: Promise<{ scope?: string; cat?: string }>;
}

async function ProjectsCatalog({ searchParams }: ProjectsPageProps) {
  // ⏳ Simulasi delay jaringan (2,5 detik) (LOADING.TSX)
  await new Promise((resolve) => setTimeout(resolve, 2500)); // Jeda 2,5 detik
  
  // SIMULASI ERROR: Lempar di dalam fungsi saat runtime
  // throw new Error("Simulasi error pengambilan katalog proyek");

  const resolvedParams = searchParams ? await searchParams : {};
  const currentScope = resolvedParams.scope?.toUpperCase() || 'ALL';

  // Filter proyek berdasarkan parameter scope di URL
  const projects = mockProjects.filter((project) => {
    if (currentScope === 'UP') {
      return project.scope === 'CAMPUS_SPECIFIC';
    }
    if (currentScope === 'PUBLIC') {
      return project.scope === 'PUBLIC';
    }
    return true;
  });

  const scopeTabs = [
    { label: 'Semua Proyek', value: 'ALL', href: '/projects' },
    { label: 'Eksklusif Universitas Pertamina', value: 'UP', href: '/projects?scope=UP' },
    { label: 'Terbuka Publik', value: 'PUBLIC', href: '/projects?scope=PUBLIC' },
  ];

  return (
    <>
      {/* Quick Filter Scope Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {scopeTabs.map((tab) => {
          const isActive = currentScope === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#4338CA] text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-[#475569] border border-[#D8DDEC]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Projects Grid (Responsive 1-col mobile, 2-col tablet/desktop) */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-8 rounded-[24px] text-center bg-white/70 flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-[#0F172A]">Tidak ada proyek dengan filter ini</p>
          <Link href="/projects" className="text-xs text-[#4338CA] font-medium hover:underline">
            Lihat semua proyek
          </Link>
        </GlassCard>
      )}
    </>
  );
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" className="min-h-[32px]">
              Katalog Proyek
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Eksplorasi Proyek Freelance Mahasiswa
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Temukan kesempatan kolaborasi pengerjaan proyek dari internal kampus Universitas Pertamina maupun klien umum dengan perlindungan escrow dan kontrak transparan.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="w-full p-8 text-center text-xs text-[#475569]">
              Memuat katalog proyek...
            </div>
          }
        >
          <ProjectsCatalog searchParams={searchParams} />
        </Suspense>

        {/* Call-to-Action for Clients */}
        <GlassCard className="w-full p-6 sm:p-8 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/80">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Punya Kebutuhan Proyek? Pasang Lowongan Anda
            </h2>
            <p className="text-sm text-[#475569] max-w-xl">
              Dapatkan proposal penawaran harga dan estimasi waktu terbaik dari mahasiswa terverifikasi Universitas Pertamina dalam hitungan jam.
            </p>
          </div>

          <Link
            href="/client/projects/create"
            className="min-h-[48px] px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-sm inline-flex items-center justify-center shrink-0 shadow-md transition-colors"
          >
            + Pasang Proyek Baru
          </Link>
        </GlassCard>

      </div>
    </main>
  );
}

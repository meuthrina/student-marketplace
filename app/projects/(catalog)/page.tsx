import React, { Suspense } from 'react';
import Link from 'next/link';
import { connection } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import type { Project, ProjectScope, ProjectStatus } from '@/types';

/**
 * ProjectsPage (React Server Component - Pekan 6 PAW)
 *
 * Menampilkan katalog proyek freelance secara persisten dari PostgreSQL via Prisma ORM 7.
 * Mendukung pencarian teks (q), penyaringan kategori (category), dan filter cakupan kampus (scope / campusOnly).
 */
interface ProjectsPageProps {
  searchParams?: Promise<{ q?: string; category?: string; campusOnly?: string; scope?: string }>;
}

async function ProjectsCatalog({ searchParams }: ProjectsPageProps) {
  await connection();
  const resolvedParams = searchParams ? await searchParams : {};
  const currentScope = resolvedParams.scope?.toUpperCase() || (resolvedParams.campusOnly === 'true' ? 'UP' : 'ALL');
  const q = resolvedParams.q?.trim();
  const category = resolvedParams.category?.trim();

  // Membangun klausa pencarian Prisma WhereInput
  const whereClause: Prisma.ProjectWhereInput = {
    status: 'OPEN',
    ...(category && category !== 'Semua' ? { category } : {}),
    ...(currentScope === 'UP' ? { isCampusOnly: true } : {}),
    ...(currentScope === 'PUBLIC' ? { isCampusOnly: false } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { skills: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  type ProjectWithBids = Prisma.ProjectGetPayload<{ include: { bids: true } }>;
  let dbProjects: ProjectWithBids[] = [];
  try {
    dbProjects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { bids: true },
    });
  } catch (error) {
    console.error('Gagal mengambil data proyek dari PostgreSQL:', error);
    dbProjects = [];
  }

  const projects: Project[] = dbProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    budget: p.budget,
    deadline: p.deadline.toISOString(),
    scope: (p.isCampusOnly ? 'CAMPUS_SPECIFIC' : 'PUBLIC') as ProjectScope,
    targetCampus: p.campusName || undefined,
    clientId: p.id,
    clientName: p.isCampusOnly && p.campusName ? `${p.campusName} Lab/Faculty` : 'Klien Terverifikasi',
    clientAvatar: '',
    skillTags: p.skills ? p.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    status: (p.status as ProjectStatus) || 'OPEN',
    createdAt: p.createdAt.toISOString(),
    isCampusOnly: p.isCampusOnly,
    skills: p.skills ? p.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    bidsCount: p.bidsCount || p.bids.length,
  }));

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
          <p className="text-sm text-[#475569] max-w-2xl">
            Temukan berbagai lowongan proyek terverifikasi dari civitas akademika dan klien terpercaya.
          </p>
        </div>

        {/* Content with Suspense */}
        <Suspense
          fallback={
            <div className="w-full text-center py-16 text-sm text-[#78859D]">
              Memuat katalog proyek dari database...
            </div>
          }
        >
          <ProjectsCatalog searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

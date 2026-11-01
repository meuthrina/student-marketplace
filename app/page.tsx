import React, { Suspense } from 'react';
import { connection } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockServices } from '@/lib/mockData';
import { HomeClientCatalog } from '@/components/features/home/HomeClientCatalog';
import type { Project, ProjectScope, ProjectStatus } from '@/types';

/**
 * HomeCatalogSection (React Server Component - Asynchronous Data Fetching inside Suspense)
 *
 * Memanggil connection() secara eksplisit agar Next.js 16 mengenali pengambilan
 * data dinamis dari PostgreSQL via Prisma ORM 7 pada fase request time.
 */
async function HomeCatalogSection() {
  await connection();

  let dbProjects: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    budget: number;
    deadline: Date;
    isCampusOnly: boolean;
    campusName: string | null;
    skills: string | null;
    status: string;
    createdAt: Date;
    bidsCount: number;
    bids: Array<{ id: string }>;
  }> = [];

  try {
    dbProjects = await prisma.project.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { bids: true },
    });
  } catch (error) {
    console.error("Gagal terhubung ke basis data PostgreSQL:", error);
    dbProjects = [];
  }

  const initialProjects: Project[] = dbProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    budget: p.budget,
    deadline: p.deadline.toISOString(),
    scope: (p.isCampusOnly ? 'CAMPUS_SPECIFIC' : 'PUBLIC') as ProjectScope,
    targetCampus: p.campusName || undefined,
    clientId: p.id,
    clientName: p.isCampusOnly && p.campusName ? `${p.campusName} Lab/Faculty` : "Klien Terverifikasi",
    clientAvatar: "",
    skillTags: p.skills ? p.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    status: (p.status as ProjectStatus) || 'OPEN',
    createdAt: p.createdAt.toISOString(),
    isCampusOnly: p.isCampusOnly,
    skills: p.skills ? p.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    bidsCount: p.bidsCount || p.bids.length,
  }));

  const initialServices = mockServices;

  return (
    <HomeClientCatalog
      initialProjects={initialProjects}
      initialServices={initialServices}
    />
  );
}

/**
 * HomePage (React Server Component - Pekan 6 PAW)
 */
export default function HomePage() {
  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm font-medium text-[#78859D]">
            Memuat katalog Studance...
          </div>
        }
      >
        <HomeCatalogSection />
      </Suspense>
    </main>
  );
}

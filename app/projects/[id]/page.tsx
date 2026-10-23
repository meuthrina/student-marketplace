import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { mockProjects, mockCurrentUser } from '@/lib/mockData';
import { projectIdSchema } from '@/lib/validations/project';
import { ProjectDetailClient } from '@/components/features/projects/ProjectDetailClient';
import type { Project } from '@/types';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockProjects.map((p) => ({
    id: p.id,
  }));
}

/**
 * Komponen penyaji konten (Server Component) di dalam Suspense boundary.
 * Menerima data `project` yang sudah tervalidasi dari komponen induk.
 */
function ProjectDetailContent({ project }: { project: Project }) {
  return <ProjectDetailClient project={project} currentUser={mockCurrentUser} />;
}

/**
 * ProjectDetailPage (Root React Server Component)
 *
 * Garis pertahanan pertama (Input Sanitization & Route Validation):
 * 1. Mengekstrak dan meng-await params secara asinkron (standar Next.js App Router).
 * 2. Memvalidasi skema ID menggunakan Zod sebelum data layer diakses.
 * 3. Memverifikasi keberadaan entitas; jika tidak ditemukan, langsung memanggil notFound()
 *    pada level terluar agar server mengembalikan header HTTP 404 Not Found yang sah.
 */
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // 1. Await params sesuai standar Next.js App Router
  const { id } = await params;

// 2. Validasi format skema masukan via Zod (Mencegah format cacat / injeksi)
  const validation = projectIdSchema.safeParse(id);
  if (!validation.success) {
    notFound();
  }

  // 3. Verifikasi ketersediaan entitas di Data Store
  const project = mockProjects.find((p) => p.id === id);
  if (!project) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-sm font-medium text-[#78859D]">
            Memuat detail proyek...
          </div>
        }
      >
        <ProjectDetailContent project={project} />
      </Suspense>
    </main>
  );
}
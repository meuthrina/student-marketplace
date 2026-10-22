import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { mockProjects, mockCurrentUser } from '@/lib/mockData';
import { ProjectDetailClient } from '@/components/features/projects/ProjectDetailClient';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockProjects.map((p) => ({
    id: p.id,
  }));
}

async function ProjectDetailFetcher({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  // Server-side lookup (nantinya: await prisma.project.findUnique({ where: { id } }))
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} currentUser={mockCurrentUser} />;
}

/**
 * ProjectDetailPage (React Server Component)
 *
 * Mengambil data detail proyek secara asynchronous di sisi server untuk persiapan integrasi Prisma ORM,
 * lalu merender Client Component interaktif `ProjectDetailClient` di dalam Suspense boundary.
 */
export default function ProjectDetailPage(props: ProjectDetailPageProps) {
  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-sm font-medium text-[#78859D]">
            Memuat detail proyek...
          </div>
        }
      >
        <ProjectDetailFetcher {...props} />
      </Suspense>
    </main>
  );
}
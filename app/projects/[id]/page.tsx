import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { mockCurrentUser } from '@/lib/mockData';
import { ProjectDetailClient } from '@/components/features/projects/ProjectDetailClient';
import type { Project, ProjectScope, ProjectStatus, Bid, BidStatus } from '@/types';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * ProjectDetailContent (Asynchronous Data Fetching inside Suspense Boundary)
 */
async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  await connection();
  const { id } = await params;

  if (!id) {
    notFound();
  }

  // Ambil data proyek dan relasi bids sekaligus dari PostgreSQL via Prisma
  type ProjectWithBids = Prisma.ProjectGetPayload<{
    include: {
      bids: {
        orderBy: { createdAt: 'desc' };
      };
    };
  }>;
  let dbProject: ProjectWithBids | null = null;
  try {
    dbProject = await prisma.project.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (error) {
    console.error('Gagal mengambil data detail proyek dari PostgreSQL:', error);
    dbProject = null;
  }

  if (!dbProject) {
    notFound();
  }

  // Mapping data persisten ke serializable UI model
  const project: Project = {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    category: dbProject.category,
    budget: dbProject.budget,
    deadline: dbProject.deadline.toISOString(),
    scope: (dbProject.isCampusOnly ? 'CAMPUS_SPECIFIC' : 'PUBLIC') as ProjectScope,
    targetCampus: dbProject.campusName || undefined,
    clientId: dbProject.id,
    clientName: dbProject.isCampusOnly && dbProject.campusName ? `${dbProject.campusName} Lab/Faculty` : 'Klien Terverifikasi',
    clientAvatar: '',
    skillTags: dbProject.skills ? dbProject.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    status: (dbProject.status as ProjectStatus) || 'OPEN',
    createdAt: dbProject.createdAt.toISOString(),
    isCampusOnly: dbProject.isCampusOnly,
    skills: dbProject.skills ? dbProject.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    bidsCount: dbProject.bidsCount || dbProject.bids.length,
  };

  const initialBids: Bid[] = dbProject.bids.map((b) => ({
    id: b.id,
    projectId: b.projectId,
    studentId: b.studentId,
    studentName: b.studentName,
    studentAvatar: '',
    isVerifiedStudent: true,
    campusName: b.campusName,
    bidAmount: b.bidAmount,
    estimatedDays: b.durationDays,
    proposalMessage: b.message,
    attachmentUrl: b.portfolioUrl || undefined,
    status: (b.status as BidStatus) || 'PENDING',
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <ProjectDetailClient
      project={project}
      initialBids={initialBids}
      currentUser={mockCurrentUser}
    />
  );
}

/**
 * ProjectDetailPage (Root React Server Component - Pekan 6 PAW)
 */
export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-sm font-medium text-[#78859D]">
            Memuat detail proyek...
          </div>
        }
      >
        <ProjectDetailContent params={params} />
      </Suspense>
    </main>
  );
}

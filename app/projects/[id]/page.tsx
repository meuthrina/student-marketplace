'use client';

import React, { useState, use, Suspense } from 'react';
import Link from 'next/link';
import { mockProjects, mockCurrentUser } from '@/lib/mockData';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ProposalModal } from '@/components/features/projects/ProposalModal';
import { useProposalForm } from '@/hooks/useProposalForm';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { id } = use(params);

  // Load project mock data by ID
  const project = mockProjects.find((p) => p.id === id) || mockProjects[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    bidAmount,
    durationDays,
    proposalText,
    errors,
    isSubmitted,
    setBidAmount,
    setDurationDays,
    setProposalText,
    setSelectedFile,
    handleSubmit,
  } = useProposalForm({
    onSuccess: () => setIsModalOpen(false),
  });

  // Check Eligibility Logic
  const isCampusMatch =
    project.scope === 'PUBLIC' ||
    (project.scope === 'CAMPUS_SPECIFIC' &&
      mockCurrentUser.campusDomain?.endsWith('universitaspertamina.ac.id') &&
      mockCurrentUser.isVerifiedStudent);

  return (
    <div className="mx-auto max-w-[1160px] space-y-4 px-5 py-4 sm:px-6 lg:px-0 lg:py-6">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="hidden text-xs text-[var(--color-text-muted)] lg:block">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/projects" className="hover:text-[var(--color-primary)] transition-colors">
              Proyek
            </Link>
          </li>
          <li>/</li>
          <li className="font-semibold text-[var(--color-text-primary)] truncate max-w-[200px]">
            {project.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
        
        {/* Left Column: Project Detail Specification */}
        <div className="space-y-4 lg:col-span-2">
          <div className="glass-card space-y-4 rounded-[var(--radius-lg)] p-4 sm:p-6">
            
            <div className="space-y-2">
              <ScopeBadge scope={project.scope} targetCampus={project.targetCampus} size="md" />
              <h1 className="text-[1.35rem] font-extrabold leading-tight text-[var(--color-text-primary)] sm:text-2xl">
                {project.title}
              </h1>
              
              <div className="pt-1 text-[0.625rem] text-[var(--color-text-secondary)]">
                <div>
                  <p className="font-medium">{project.clientName} · Panitia Campus Week</p>
                  <p className="text-[0.563rem] text-[var(--color-text-muted)]">
                    Diposting 10 Oktober 2026 • Deadline {project.deadline}
                  </p>
                </div>
              </div>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-2">
              {project.skillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-[0.563rem] font-semibold text-[var(--color-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description Sections */}
            <div className="space-y-4 pt-1 text-[0.688rem] leading-relaxed text-[var(--color-text-secondary)]">
              <div className="space-y-2">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Tentang Proyek
                </h2>
                <p>{project.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Kebutuhan Utama
                </h2>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Halaman informasi acara dan jadwal yang responsif</li>
                  <li>Formulir pendaftaran peserta dengan validasi masukan</li>
                  <li>Dashboard panitia dan ekspor data CSV</li>
                  <li>Tampilan optimal di perangkat mobile, tablet, dan desktop</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Deliverables
                </h2>
                <p className="text-xs">
                  Source code React + Tailwind, dokumentasi setup, demo deployment, serta 2 kali revisi.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Lampiran brief</h2>
                <p className="text-[0.625rem]">Dokumen proyek</p>
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2 text-[0.625rem] text-[var(--color-text-primary)]">
                  ▤ spesifikasi.pdf · 480 KB
                </div>
                <p className="text-[0.563rem] text-[var(--color-text-muted)]">Brief kebutuhan dan contoh alur peserta</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Action Area & Eligibility Box */}
        <div className="space-y-4">
          <div className="glass-card space-y-4 rounded-[var(--radius-lg)] p-4 lg:sticky lg:top-24">
            <div>
              <p className="text-[0.563rem] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Anggaran Proyek
              </p>
              <p className="text-xl font-extrabold text-[var(--color-text-primary)]">
                Rp{project.budget.toLocaleString('id-ID')}
              </p>
              <p className="mt-1 text-[0.625rem] text-[var(--color-text-muted)]">
                Deadline: {project.deadline}
              </p>
            </div>

            {/* Eligibility Banner */}
            {isCampusMatch ? (
              <div className="space-y-1 rounded-[var(--radius-md)] border border-[rgba(15,146,149,0.3)] bg-[var(--color-success-bg)] p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-teal)]">
                  <VerifiedBadge size="sm" />
                </div>
                <p className="pt-1 text-[0.625rem] font-medium text-[var(--color-teal)]">
                  Anda memenuhi syarat kampus untuk mengajukan proposal.
                </p>
              </div>
            ) : (
              <div className="space-y-2 rounded-[var(--radius-md)] border border-[rgba(245,160,0,0.3)] bg-[var(--color-warning-bg)] p-3">
                <p className="text-[0.625rem] font-bold text-[var(--color-amber)]">
                  Proyek ini khusus Mahasiswa Terverifikasi {project.targetCampus}
                </p>
                <p className="text-[0.625rem] text-[var(--color-text-secondary)]">
                  Identitas Anda belum diverifikasi atau berasal dari kampus berbeda.
                </p>
                <Link
                  href="/auth/verify-student"
                  className="inline-block text-[0.625rem] font-bold text-[var(--color-primary)] underline hover:opacity-80"
                >
                  Verifikasi Mahasiswa Sekarang
                </Link>
              </div>
            )}

            {/* CTA Button */}
            <button
              type="button"
              disabled={!isCampusMatch}
              onClick={() => setIsModalOpen(true)}
              className={`w-full rounded-[var(--radius-pill)] px-4 py-2.5 text-xs font-bold transition-all shadow-md ${
                isCampusMatch
                  ? 'bg-brand-gradient text-white hover:opacity-90 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              Kirim Proposal Penawaran / Bid
            </button>
          </div>
        </div>

      </div>

      <ProposalModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bidAmount={bidAmount}
        durationDays={durationDays}
        proposalText={proposalText}
        errors={errors}
        isSubmitted={isSubmitted}
        onBidAmountChange={setBidAmount}
        onDurationChange={setDurationDays}
        onProposalChange={setProposalText}
        onFileChange={setSelectedFile}
        onSubmit={handleSubmit}
      />

    </div>
  );
}

export default function ProjectDetailPage(props: ProjectDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-xs font-bold text-[var(--color-text-muted)]">
          Memuat Detail Proyek...
        </div>
      }
    >
      <ProjectDetailContent {...props} />
    </Suspense>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Project, User, Bid } from '@/types';
import { mockCurrentUser, mockBids } from '@/lib/mockData';
import { ProposalModal } from '@/components/features/projects/ProposalModal';
import { useProposalForm } from '@/hooks/useProposalForm';
import { useModal } from '@/hooks/useModal';
import { useRole } from '@/contexts/RoleContext';
import { ProjectMainCard } from '@/components/features/projects/ProjectMainCard';
import { ProjectBidsPanel } from '@/components/features/projects/ProjectBidsPanel';
import { ProjectActionCard } from '@/components/features/projects/ProjectActionCard';

export interface ProjectDetailClientProps {
  project: Project;
  currentUser?: User;
}

export function ProjectDetailClient({
  project,
  currentUser = mockCurrentUser,
}: ProjectDetailClientProps) {
  const searchParams = useSearchParams();
  const { activeRole } = useRole();

  // Local state for incoming bids (Aliran DFD F4)
  const [projectBids, setProjectBids] = useState<Bid[]>(() =>
    mockBids.filter((b) => b.projectId === project.id)
  );

  // Declarative Modal Management using useModal (with WCAG AA Focus Return)
  const {
    isOpen: isModalOpen,
    openModal,
    closeModal,
  } = useModal();

  // Preview state for testing & design verification (33:54462 vs 33:54565)
  const verifiedParam = searchParams?.get('verified');
  const [isSimulatedVerified, setIsSimulatedVerified] = useState<boolean | null>(
    verifiedParam !== null ? verifiedParam !== 'false' : null
  );

  const {
    bidAmount,
    durationDays,
    proposalText,
    errors,
    isSubmitted,
    successMessage,
    setBidAmount,
    setDurationDays,
    setProposalText,
    setSelectedFile,
    handleSubmit,
  } = useProposalForm({
    projectId: project.id,
    currentUser,
    onSuccess: (newBid) => {
      setProjectBids((prev) => [newBid, ...prev]);
      closeModal();
    },
  });

  // Base Eligibility Logic
  const defaultEligibility =
    project.scope === 'PUBLIC' ||
    (project.scope === 'CAMPUS_SPECIFIC' &&
      currentUser.campusDomain?.endsWith('universitaspertamina.ac.id') &&
      currentUser.isVerifiedStudent);

  const isEligible = Boolean(isSimulatedVerified !== null ? isSimulatedVerified : defaultEligibility);

  // Format deadline dinamis dari project.deadline
  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '24 Oktober 2026';

  return (
    <div className="w-full bg-[#F0F1FB] min-h-screen">
      {/* Dev Mode Switcher: Guarded for Non-production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-2">
          <div className="flex items-center justify-between py-1.5 px-4 bg-white/85 backdrop-blur-md rounded-full border border-slate-200/80 shadow-xs text-xs">
            <span className="text-[#475569] font-medium text-xs">Preview State (Dev Only):</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSimulatedVerified(true)}
                className={`min-h-[32px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isEligible
                    ? 'bg-[#4338CA] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-slate-100'
                }`}
              >
                Verified (33:54462)
              </button>
              <button
                type="button"
                onClick={() => setIsSimulatedVerified(false)}
                className={`min-h-[32px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  !isEligible
                    ? 'bg-[#4338CA] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-slate-100'
                }`}
              >
                Not Verified (33:54565)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Container */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-12 flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8 lg:py-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="col-span-full text-xs text-[#78859D]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#4338CA] transition-colors">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/projects" className="hover:text-[#4338CA] transition-colors">
                Proyek
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#0F172A] truncate max-w-[320px]">
              {project.title}
            </li>
          </ol>
        </nav>

        {/* ─── LEFT COLUMN: Main Detail Card + Client Bids Review Panel ─── */}
        <div className="w-full flex flex-col gap-6">
          <ProjectMainCard
            project={project}
            formattedDeadline={formattedDeadline}
          />

          {/* Client Proposal Review Panel (DFD F4) */}
          {activeRole === 'CLIENT' && (
            <ProjectBidsPanel bids={projectBids} />
          )}
        </div>

        {/* ─── RIGHT COLUMN: Anggaran & Action Card (Extracted Component) ─── */}
        <ProjectActionCard
          project={project}
          formattedDeadline={formattedDeadline}
          activeRole={activeRole}
          projectBids={projectBids}
          isEligible={isEligible}
          onOpenModal={openModal}
        />

      </div>

      {/* Modal Bid Form */}
      <ProposalModal
        project={project}
        isOpen={isModalOpen}
        onClose={closeModal}
        bidAmount={bidAmount}
        durationDays={durationDays}
        proposalText={proposalText}
        errors={errors}
        isSubmitted={isSubmitted}
        successMessage={successMessage}
        onBidAmountChange={setBidAmount}
        onDurationChange={setDurationDays}
        onProposalChange={setProposalText}
        onFileChange={setSelectedFile}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default ProjectDetailClient;

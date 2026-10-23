'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import { ProposalProjectSummary } from '@/components/features/projects/ProposalProjectSummary';
import { ProposalBidForm } from '@/components/features/projects/ProposalBidForm';

export interface ProposalModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  bidAmount: string;
  durationDays: string;
  proposalText: string;
  errors: Record<string, string>;
  isSubmitted: boolean;
  successMessage?: string | null;
  onBidAmountChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onProposalChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ProposalModal({
  project,
  isOpen,
  onClose,
  bidAmount,
  durationDays,
  proposalText,
  errors: externalErrors,
  isSubmitted,
  successMessage,
  onBidAmountChange,
  onDurationChange,
  onProposalChange,
  onFileChange,
  onSubmit,
}: ProposalModalProps) {
  // Mode toggle between Normal (33:54710) and Invalid Bid (33:54780)
  const [modalMode, setModalMode] = useState<'normal' | 'invalid'>('normal');
  const [rejectedFile, setRejectedFile] = useState<string | null>(null);

  const handleModeChange = (newMode: 'normal' | 'invalid') => {
    setModalMode(newMode);
    if (newMode === 'invalid') {
      onBidAmountChange('0');
      onDurationChange('5');
      onProposalChange('Halo');
      setRejectedFile('berkas.exe');
    } else {
      if (bidAmount === '0') onBidAmountChange('1200000');
      if (proposalText === 'Halo') onProposalChange('');
      setRejectedFile(null);
    }
  };

  if (!isOpen) return null;

  // Compute error flags based on values or active invalid mode
  const isBidInvalid = modalMode === 'invalid' || Number(bidAmount) <= 0 || !bidAmount || !!externalErrors.bidAmount;
  const isProposalInvalid = modalMode === 'invalid' || proposalText.length < 20;
  const hasFileError = modalMode === 'invalid' || rejectedFile !== null || !!externalErrors.file;
  const hasErrors = isBidInvalid || isProposalInvalid || hasFileError;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isSupportedExt =
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.png') ||
      lowerName.endsWith('.jpg') ||
      lowerName.endsWith('.jpeg');
    const isSupportedMime =
      !file.type ||
      ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type);

    if (!isSupportedExt || !isSupportedMime || lowerName.endsWith('.exe')) {
      setRejectedFile(file.name);
      onFileChange(null);
    } else {
      setRejectedFile(null);
      onFileChange(file);
    }
  };

  const handleRemoveFile = () => {
    setRejectedFile(null);
    onFileChange(null);
    if (modalMode === 'invalid') {
      setModalMode('normal');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-slate-900/60 p-3.5 md:p-6 lg:p-8 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-[1200px] bg-white rounded-[24px] lg:rounded-[32px] lg:bg-[#E3E5F4]/95 border border-white/80 p-5 sm:p-6 md:p-8 shadow-[0_20px_40px_rgba(27,35,69,0.16)] flex flex-col gap-4 my-auto">
        
        {/* Dev Mode Switcher: Guarded for Non-production */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex items-center justify-between py-1.5 px-3 bg-white/80 rounded-full border border-slate-200/60 text-xs">
            <span className="text-[#475569] font-medium text-xs">Preview State (Dev):</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleModeChange('normal')}
                className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  modalMode === 'normal'
                    ? 'bg-[#4338CA] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-slate-100'
                }`}
              >
                Normal (33:54710)
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('invalid')}
                className={`min-h-[38px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  modalMode === 'invalid'
                    ? 'bg-[#B91C1C] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-slate-100'
                }`}
              >
                Invalid Bid (33:54780)
              </button>
            </div>
          </div>
        )}

        {/* Desktop 2-Column Split Container */}
        <div className="flex flex-col lg:grid lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-8 lg:items-start">
          
          {/* Left Summary Panel (Extracted Component) */}
          <ProposalProjectSummary project={project} />

          {/* Right Form Panel (Extracted Component) */}
          <ProposalBidForm
            project={project}
            bidAmount={bidAmount}
            durationDays={durationDays}
            proposalText={proposalText}
            isBidInvalid={isBidInvalid}
            isProposalInvalid={isProposalInvalid}
            hasErrors={hasErrors}
            isSubmitted={isSubmitted}
            successMessage={successMessage}
            rejectedFile={rejectedFile}
            onBidAmountChange={onBidAmountChange}
            onDurationChange={onDurationChange}
            onProposalChange={onProposalChange}
            onFileUpload={handleFileUpload}
            onRemoveFile={handleRemoveFile}
            onSubmit={onSubmit}
            onClose={onClose}
          />

        </div>

      </div>
    </div>
  );
}

export default ProposalModal;

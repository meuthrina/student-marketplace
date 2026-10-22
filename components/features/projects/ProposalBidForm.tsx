'use client';

import React from 'react';
import { Project } from '@/types';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ProposalFileField } from '@/components/features/projects/ProposalFileField';

export interface ProposalBidFormProps {
  project: Project;
  bidAmount: string;
  durationDays: string;
  proposalText: string;
  isBidInvalid: boolean;
  isProposalInvalid: boolean;
  hasErrors: boolean;
  isSubmitted: boolean;
  successMessage?: string | null;
  rejectedFile: string | null;
  onBidAmountChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onProposalChange: (value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export const ProposalBidForm: React.FC<ProposalBidFormProps> = ({
  project,
  bidAmount,
  durationDays,
  proposalText,
  isBidInvalid,
  isProposalInvalid,
  hasErrors,
  isSubmitted,
  successMessage,
  rejectedFile,
  onBidAmountChange,
  onDurationChange,
  onProposalChange,
  onFileUpload,
  onRemoveFile,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="flex flex-col gap-4 min-w-0 lg:bg-white/90 lg:backdrop-blur-md lg:p-6 lg:rounded-[24px] lg:border lg:border-white/70 lg:shadow-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h2 id="modal-title" className="text-[26px] sm:text-[28px] font-semibold leading-[34px] tracking-tight text-[#0F172A]">
            Formulir Proposal Penawaran
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#475569] hover:text-[#0F172A] min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-lg font-bold transition-colors shrink-0 cursor-pointer"
            aria-label="Tutup Modal"
          >
            ✕
          </button>
        </div>
        <p className="text-sm font-normal leading-[21px] text-[#475569]">
          Untuk {project.title}
        </p>
      </div>

      <VerifiedBadge size="sm" label="Verified Student" />

      {/* Form Body */}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Success Feedback Alert (Aliran DFD F4) */}
        {successMessage && (
          <div className="w-full p-4 rounded-[16px] bg-[#ECFDF5] border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
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
            <span>{successMessage}</span>
          </div>
        )}

        {/* Field 1: Biaya penawaran (IDR) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bid-amount-input" className="text-xs font-bold text-[#0F172A]">
            Biaya penawaran (IDR)
          </label>
          <input
            id="bid-amount-input"
            type="number"
            value={bidAmount}
            onChange={(e) => onBidAmountChange(e.target.value)}
            className={`w-full h-12 px-3.5 bg-white border ${
              isBidInvalid ? 'border-[#B91C1C]' : 'border-[#D8DDF0]'
            } rounded-[16px] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
            placeholder="0"
          />
          {isBidInvalid && (
            <p className="text-xs font-medium text-[#B91C1C]">
              Biaya penawaran harus lebih besar dari 0
            </p>
          )}
        </div>

        {/* Field 2: Durasi pengerjaan (hari) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="duration-days-input" className="text-xs font-bold text-[#0F172A]">
            Durasi pengerjaan (hari)
          </label>
          <input
            id="duration-days-input"
            type="number"
            value={durationDays}
            onChange={(e) => onDurationChange(e.target.value)}
            className="w-full h-12 px-3.5 bg-white border border-[#D8DDF0] rounded-[16px] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors"
          />
        </div>

        {/* Field 3: Proposal penawaran */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proposal-text-input" className="text-xs font-bold text-[#0F172A]">
            Proposal penawaran
          </label>
          <div
            className={`w-full p-3.5 bg-white border ${
              isProposalInvalid && proposalText.length > 0 ? 'border-[#B91C1C]' : 'border-[#D8DDF0]'
            } rounded-[16px] flex flex-col justify-between transition-colors`}
          >
            <textarea
              id="proposal-text-input"
              rows={4}
              maxLength={500}
              value={proposalText}
              onChange={(e) => onProposalChange(e.target.value)}
              placeholder="Tuliskan pendekatan teknis, deliverables, dan pengalaman relevan Anda..."
              className="w-full min-h-[110px] text-sm font-normal text-[#0F172A] placeholder-[#475569] resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className={isProposalInvalid && proposalText.length > 0 ? 'text-[#B91C1C]' : 'text-[#475569]'}>
                Minimal 20 karakter
              </span>
              <span className="font-medium text-[#475569]">{proposalText.length} / 500</span>
            </div>
          </div>
        </div>

        {/* Field 4: Attachment Upload */}
        <ProposalFileField
          rejectedFile={rejectedFile}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="submit"
            disabled={hasErrors || isSubmitted}
            className={`w-full h-12 px-[18px] rounded-full font-bold text-sm flex items-center justify-center transition-all ${
              hasErrors
                ? 'bg-gradient-to-r from-[#4A4EB5]/50 to-[#6647B9]/50 text-white cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-[#4A4EB5] to-[#6647B9] text-white shadow-md hover:opacity-95 active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isSubmitted ? 'Mengirim Proposal...' : 'Kirim Proposal'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 px-[18px] rounded-full bg-white border border-slate-200 text-[#0F172A] font-semibold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
        </div>

      </form>
    </div>
  );
};

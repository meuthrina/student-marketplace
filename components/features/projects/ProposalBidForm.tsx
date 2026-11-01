'use client';

import React, { useActionState, useEffect } from 'react';
import { Project } from '@/types';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { ProposalFileField } from '@/components/features/projects/ProposalFileField';
import { kirimPenawaran } from '@/app/projects/[id]/actions';

export interface ProposalBidFormProps {
  project: Project;
  onClose: () => void;
  onSuccess?: () => void;
  // Kompatibilitas dengan wrapper modal sebelumnya
  bidAmount?: string;
  durationDays?: string;
  proposalText?: string;
  isBidInvalid?: boolean;
  isProposalInvalid?: boolean;
  hasErrors?: boolean;
  isSubmitted?: boolean;
  successMessage?: string | null;
  rejectedFile?: string | null;
  onBidAmountChange?: (value: string) => void;
  onDurationChange?: (value: string) => void;
  onProposalChange?: (value: string) => void;
  onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile?: () => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ProposalBidForm: React.FC<ProposalBidFormProps> = ({
  project,
  onClose,
  onSuccess,
  bidAmount = '1200000',
  durationDays = '5',
  proposalText = '',
  isBidInvalid = false,
  isProposalInvalid = false,
  successMessage,
  rejectedFile = null,
  onFileUpload,
  onRemoveFile,
}) => {
  // Integrasi React 19 useActionState dengan Server Action kirimPenawaran
  const [state, formAction, isPending] = useActionState(kirimPenawaran, {});

  // Menutup modal secara otomatis setelah sukses pengajuan proposal
  useEffect(() => {
    if (state.success && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onSuccess]);

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

      {/* Form Body dengan Server Action */}
      <form action={formAction} className="flex flex-col gap-4">
        {/* Hidden Field: ID Proyek Terkait */}
        <input type="hidden" name="proyekId" value={project.id} />

        {/* Banner Notifikasi Umum (role="status") */}
        {(state.pesan || successMessage) && (
          <div
            role="status"
            aria-live="polite"
            className={`w-full p-4 rounded-[16px] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
              state.success || (!state.galat && successMessage)
                ? 'bg-[#ECFDF5] border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-700'
            }`}
          >
            <svg
              className={`w-5 h-5 shrink-0 ${
                state.success || (!state.galat && successMessage)
                  ? 'text-emerald-600'
                  : 'text-rose-500'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {state.success || (!state.galat && successMessage) ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
            <span>{state.pesan || successMessage}</span>
          </div>
        )}

        {/* Field 1: Biaya penawaran (IDR) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nominalPenawaran" className="text-xs font-bold text-[#0F172A]">
            Biaya penawaran (IDR) <span className="text-red-500">*</span>
          </label>
          <input
            id="nominalPenawaran"
            name="nominalPenawaran"
            type="number"
            defaultValue={state.nilai?.nominalPenawaran || bidAmount}
            aria-invalid={Boolean(state.galat?.nominalPenawaran || isBidInvalid)}
            aria-describedby={state.galat?.nominalPenawaran ? "galat-nominalPenawaran" : undefined}
            className={`w-full h-12 px-3.5 bg-white border ${
              state.galat?.nominalPenawaran || isBidInvalid
                ? 'border-red-500 ring-1 ring-red-400'
                : 'border-[#D8DDF0]'
            } rounded-[16px] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
            placeholder="Minimal Rp25.000"
          />
          {state.galat?.nominalPenawaran?.[0] ? (
            <p id="galat-nominalPenawaran" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {state.galat.nominalPenawaran[0]}
            </p>
          ) : isBidInvalid ? (
            <p role="alert" className="text-red-500 text-xs mt-1 font-medium">
              Biaya penawaran harus lebih besar dari 0
            </p>
          ) : null}
        </div>

        {/* Field 2: Durasi pengerjaan (hari) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="durasiHari" className="text-xs font-bold text-[#0F172A]">
            Durasi pengerjaan (hari) <span className="text-red-500">*</span>
          </label>
          <input
            id="durasiHari"
            name="durasiHari"
            type="number"
            defaultValue={state.nilai?.durasiHari || durationDays}
            aria-invalid={Boolean(state.galat?.durasiHari)}
            aria-describedby={state.galat?.durasiHari ? "galat-durasiHari" : undefined}
            placeholder="1 - 180 hari"
            className={`w-full h-12 px-3.5 bg-white border ${
              state.galat?.durasiHari ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
            } rounded-[16px] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
          />
          {state.galat?.durasiHari?.[0] && (
            <p id="galat-durasiHari" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {state.galat.durasiHari[0]}
            </p>
          )}
        </div>

        {/* Field 3: Proposal penawaran */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pesanProposal" className="text-xs font-bold text-[#0F172A]">
            Proposal penawaran <span className="text-red-500">*</span>
          </label>
          <div
            className={`w-full p-3.5 bg-white border ${
              state.galat?.pesanProposal || isProposalInvalid
                ? 'border-red-500 ring-1 ring-red-400'
                : 'border-[#D8DDF0]'
            } rounded-[16px] flex flex-col justify-between transition-colors`}
          >
            <textarea
              id="pesanProposal"
              name="pesanProposal"
              rows={4}
              maxLength={1500}
              defaultValue={state.nilai?.pesanProposal || proposalText}
              aria-invalid={Boolean(state.galat?.pesanProposal || isProposalInvalid)}
              aria-describedby={state.galat?.pesanProposal ? "galat-pesanProposal" : undefined}
              placeholder="Tuliskan pendekatan teknis, deliverables, dan pengalaman relevan Anda (minimal 20 karakter)..."
              className="w-full min-h-[110px] text-sm font-normal text-[#0F172A] placeholder-[#475569] resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className={state.galat?.pesanProposal || isProposalInvalid ? 'text-red-500 font-medium' : 'text-[#475569]'}>
                Minimal 20 karakter
              </span>
              <span className="font-medium text-[#475569]">Maksimal 1500 karakter</span>
            </div>
          </div>
          {state.galat?.pesanProposal?.[0] && (
            <p id="galat-pesanProposal" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {state.galat.pesanProposal[0]}
            </p>
          )}
        </div>

        {/* Field 4: Tautan Portofolio Opsional */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="portofolioUrl" className="text-xs font-bold text-[#0F172A]">
            Tautan Portofolio Pendukung (Opsional)
          </label>
          <input
            id="portofolioUrl"
            name="portofolioUrl"
            type="url"
            defaultValue={state.nilai?.portofolioUrl}
            aria-invalid={Boolean(state.galat?.portofolioUrl)}
            aria-describedby={state.galat?.portofolioUrl ? "galat-portofolioUrl" : undefined}
            placeholder="https://github.com/username atau https://portofolio.me"
            className={`w-full h-12 px-3.5 bg-white border ${
              state.galat?.portofolioUrl ? 'border-red-500 ring-1 ring-red-400' : 'border-[#D8DDF0]'
            } rounded-[16px] text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
          />
          {state.galat?.portofolioUrl?.[0] && (
            <p id="galat-portofolioUrl" role="alert" className="text-red-500 text-xs mt-1 font-medium">
              {state.galat.portofolioUrl[0]}
            </p>
          )}
        </div>

        {/* Field 5: Attachment Upload (Preview / Magic Bytes Validation) */}
        {onFileUpload && onRemoveFile && (
          <ProposalFileField
            rejectedFile={rejectedFile}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 px-[18px] rounded-full font-bold text-sm flex items-center justify-center transition-all bg-gradient-to-r from-[#4A4EB5] to-[#6647B9] text-white shadow-md hover:opacity-95 active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Memproses...' : 'Kirim Proposal'}
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

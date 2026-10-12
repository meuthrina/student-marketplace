'use client';

import React from 'react';
import { Project } from '@/types';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { mockCurrentUser } from '@/lib/mockData';

export interface ProposalModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  bidAmount: string;
  durationDays: string;
  proposalText: string;
  errors: Record<string, string>;
  isSubmitted: boolean;
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
  errors,
  isSubmitted,
  onBidAmountChange,
  onDurationChange,
  onProposalChange,
  onFileChange,
  onSubmit,
}: ProposalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="glass-card max-h-[92vh] w-full max-w-[920px] space-y-5 overflow-y-auto rounded-[var(--radius-xl)] border border-white/40 p-4 shadow-2xl sm:p-6 lg:grid lg:grid-cols-[250px_1fr] lg:gap-5 lg:space-y-0 lg:p-5">
        <div className="hidden rounded-[var(--radius-lg)] bg-white/70 p-4 lg:block">
          <p className="text-[0.563rem] font-bold uppercase text-[var(--color-text-muted)]">Ringkasan proyek</p>
          <h4 className="mt-3 text-sm font-bold">{project.title}</h4>
          <div className="mt-3"><ScopeBadge scope={project.scope} targetCampus={project.targetCampus} size="sm" /></div>
          <p className="mt-3 text-lg font-extrabold">Rp{project.budget.toLocaleString('id-ID')}</p>
          <p className="mt-2 text-[0.625rem] text-[var(--color-text-secondary)]">{project.description}</p>
          <div className="mt-4 rounded-md bg-[var(--color-success-bg)] p-2 text-[0.625rem] text-[var(--color-teal)]">
            {mockCurrentUser.name} · Verified Student<br />Eligible untuk mengirim bid.
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div>
              <h3 id="modal-title" className="text-lg font-bold text-[var(--color-text-primary)]">
                Formulir Proposal Penawaran
              </h3>
              <p className="max-w-[280px] truncate text-xs text-[var(--color-text-muted)]">
                Untuk: {project.title}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-lg font-bold text-gray-400 hover:text-gray-600" aria-label="Tutup Modal">
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3 pt-4">
            <div className="mb-2"><VerifiedBadge size="sm" /></div>

            <div className="space-y-1">
              <label htmlFor="bid-amount" className="block text-xs font-bold text-[var(--color-text-primary)]">
                Biaya penawaran (IDR) <span className="text-red-500">*</span>
              </label>
              <input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={(event) => onBidAmountChange(event.target.value)}
                className={`glass-input w-full rounded-[var(--radius-md)] px-3.5 py-2.5 text-xs ${errors.bidAmount ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Masukkan biaya total"
              />
              {errors.bidAmount && <p className="text-[0.75rem] font-semibold text-red-500">{errors.bidAmount}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="bid-duration" className="block text-xs font-bold text-[var(--color-text-primary)]">
                Durasi pengerjaan (hari) <span className="text-red-500">*</span>
              </label>
              <input
                id="bid-duration"
                type="number"
                value={durationDays}
                onChange={(event) => onDurationChange(event.target.value)}
                className="glass-input w-full rounded-[var(--radius-md)] px-3.5 py-2.5 text-xs"
                placeholder="Estimasi hari"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="bid-proposal" className="font-bold text-[var(--color-text-primary)]">
                  Proposal Anda <span className="text-red-500">*</span>
                </label>
                <span className="text-[0.688rem] text-[var(--color-text-muted)]">{proposalText.length} / 500</span>
              </div>
              <textarea
                id="bid-proposal"
                rows={4}
                maxLength={500}
                value={proposalText}
                onChange={(event) => onProposalChange(event.target.value)}
                placeholder="Tuliskan pendekatan teknis, rencana pengerjaan, dan keahlian relevan Anda..."
                className={`glass-input w-full resize-none rounded-[var(--radius-md)] p-3 text-xs ${errors.proposalText ? 'border-red-500' : ''}`}
              />
              {errors.proposalText && <p className="text-[0.75rem] font-semibold text-red-500">{errors.proposalText}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[var(--color-text-primary)]">
                Lampiran Pendukung (PDF / PNG • Maks 5 MB)
              </label>
              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-primary)] bg-white/60 p-5 text-center text-[0.625rem] text-[var(--color-text-secondary)]">
                <p>Pilih PDF / PNG · Maks. 5 MB</p>
                <label htmlFor="bid-file" className="mt-2 inline-block cursor-pointer font-semibold text-[var(--color-primary)]">Pilih berkas</label>
              </div>
              <input id="bid-file" type="file" accept=".pdf,.png" onChange={(event) => onFileChange(event.target.files?.[0] || null)} className="sr-only" />
              {errors.file && <p className="text-[0.75rem] font-semibold text-red-500">{errors.file}</p>}
            </div>

            <div className="space-y-2 pt-4">
              <button type="submit" disabled={isSubmitted} className="w-full rounded-[var(--radius-pill)] bg-brand-gradient py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90">
                {isSubmitted ? 'Mengirim Proposal...' : 'Kirim Proposal Penawaran'}
              </button>
              <button type="button" onClick={onClose} className="w-full rounded-[var(--radius-pill)] bg-white py-2.5 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm transition-colors hover:bg-[var(--color-surface-soft)]">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

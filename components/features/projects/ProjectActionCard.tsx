'use client';

import React from 'react';
import Link from 'next/link';
import { Project, Role, Bid } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export interface ProjectActionCardProps {
  project: Project;
  formattedDeadline: string;
  activeRole: Role;
  projectBids: Bid[];
  isEligible?: boolean;
  onOpenModal: () => void;
}

export const ProjectActionCard: React.FC<ProjectActionCardProps> = ({
  project,
  formattedDeadline,
  activeRole,
  projectBids,
  isEligible = false,
  onOpenModal,
}) => {
  return (
    <div className="w-full">
      <GlassCard as="section" className="p-6 flex flex-col gap-4 sticky top-24 bg-white/70">
        <p className="text-xs font-medium uppercase tracking-wider text-[#475569] leading-[17px]">
          ANGGARAN PROYEK
        </p>

        <p className="text-[28px] font-semibold leading-[36px] text-[#0F172A]">
          Rp{project.budget.toLocaleString('id-ID')}
        </p>

        <p className="text-sm font-normal leading-[21px] text-[#475569]">
          Deadline · {formattedDeadline}
        </p>

        {/* Role-Dependent Action Area */}
        {activeRole === 'CLIENT' ? (
          <div className="w-full flex flex-col gap-3">
            <div className="w-full p-4 rounded-[16px] bg-[#EEF2FF] border border-indigo-100 flex flex-col gap-1">
              <span className="text-xs font-bold text-[#4338CA] uppercase">
                Mode Klien Aktif
              </span>
              <p className="text-sm font-medium text-[#1E1B4B]">
                Anda mengelola proyek ini. Tinjau proposal penawaran mahasiswa di panel sebelah kiri.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
              <span className="text-[#475569]">Total Pelamar Proposal</span>
              <span className="font-bold text-[#0F172A]">{projectBids.length} Mahasiswa</span>
            </div>
            <Link
              href="/client/dashboard"
              className="w-full min-h-[48px] px-5 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-sm flex items-center justify-center shadow-md transition-colors no-underline text-center"
            >
              Buka Dashboard Klien
            </Link>
          </div>
        ) : isEligible ? (
          <>
            <VerifiedBadge size="sm" label="Verified Student" />
            <div className="w-full p-4 rounded-[16px] bg-[#ECFDF5] border border-emerald-100 flex flex-col justify-center">
              <p className="text-sm font-medium leading-[21px] text-[#047857]">
                Anda memenuhi syarat kampus untuk mengajukan proposal.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenModal}
              className="w-full min-h-[48px] px-5 rounded-full bg-gradient-to-r from-[#4A4EB5] to-[#6647B9] text-white font-bold text-sm flex items-center justify-center shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
            >
              Kirim Proposal Penawaran / Bid
            </button>
          </>
        ) : (
          <>
            <div className="w-full p-4 rounded-[16px] bg-[#FFFBEB] border border-amber-200/60 flex flex-col justify-center">
              <p className="text-sm font-medium leading-[21px] text-[#78350F]">
                Proyek ini khusus Mahasiswa Terverifikasi {project.targetCampus || 'Universitas Pertamina'}
              </p>
            </div>
            <p className="text-sm font-normal leading-[21px] text-[#475569]">
              Identitas Anda belum diverifikasi atau berasal dari kampus berbeda.
            </p>
            <Link
              href="/auth/verify-student"
              className="w-full min-h-[48px] px-5 rounded-full bg-gradient-to-r from-[#4A4EB5] to-[#6647B9] text-white font-bold text-sm flex items-center justify-center shadow-md hover:opacity-95 active:scale-[0.99] transition-all no-underline text-center"
            >
              Verifikasi Mahasiswa
            </Link>
            <p className="text-xs font-medium leading-[17px] text-[#475569]">
              Kampus berbeda: akses penawaran diblokir. Tidak ada formulir bid yang aktif.
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
};

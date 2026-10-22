import React from 'react';
import { Bid } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { GlassCard } from '@/components/ui/GlassCard';

export interface ProjectBidsPanelProps {
  bids: Bid[];
}

export const ProjectBidsPanel: React.FC<ProjectBidsPanelProps> = ({ bids }) => {
  return (
    <GlassCard as="section" className="p-6 sm:p-8 flex flex-col gap-6 bg-white/70">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E8E7FC] text-[#4338CA] text-[11px] font-bold uppercase tracking-wider">
              Aliran DFD F4
            </span>
            <span className="text-xs font-semibold text-[#475569]">
              {bids.length} Proposal Mahasiswa
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
            Daftar Proposal Mahasiswa Masuk
          </h2>
        </div>
        <span className="text-xs text-[#475569] font-medium">
          Perlindungan Escrow Otomatis Aktif
        </span>
      </div>

      {bids.length === 0 ? (
        <div className="p-8 text-center rounded-[18px] bg-white/50 border border-slate-200/60 flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-[#0F172A]">Belum ada proposal penawaran</p>
          <p className="text-xs text-[#475569]">
            Mahasiswa terverifikasi belum mengajukan penawaran pada proyek ini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="p-5 rounded-[20px] bg-white border border-[#D8DDF0] shadow-2xs flex flex-col gap-3 hover:border-[#4338CA]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={bid.studentAvatar}
                    initials={bid.studentName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                    alt={bid.studentName}
                    size="md"
                    verified={bid.isVerifiedStudent}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-[#0F172A]">
                        {bid.studentName}
                      </h3>
                      {bid.isVerifiedStudent && (
                        <VerifiedBadge
                          size="sm"
                          label="Verified Student"
                          campusDomain="universitaspertamina.ac.id"
                        />
                      )}
                    </div>
                    <p className="text-xs text-[#475569]">
                      {bid.campusName} · Diajukan {bid.createdAt}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-lg font-bold text-[#4338CA]">
                    Rp{bid.bidAmount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-[#475569]">
                    Estimasi pengerjaan: {bid.estimatedDays} hari
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-[14px] border border-slate-100">
                {bid.proposalMessage}
              </p>

              {bid.attachmentUrl && (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4338CA]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span>Lampiran: {bid.attachmentUrl.split('/').pop()}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Status: {bid.status}
                </span>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  Pilih & Danai Escrow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default ProjectBidsPanel;

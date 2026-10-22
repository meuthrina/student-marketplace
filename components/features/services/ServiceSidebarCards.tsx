import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ServiceFolioPreview } from '@/components/features/services/ServiceFolioPreview';

/**
 * ServiceSidebarCards Component
 *
 * Menampilkan portofolio deliverable penyedia dan ulasan klien di kolom kanan.
 */
export const ServiceSidebarCards: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
        Portofolio penyedia
      </h2>

      {/* ─── CARD 3: Completion Card / Portfolio Deliverable ─── */}
      <GlassCard as="section" className="p-6 flex flex-col gap-4 bg-white/70">
        <ServiceFolioPreview />

        <h3 className="text-lg font-semibold leading-tight text-[#0F172A]">
          Dashboard Komunitas Kampus
        </h3>

        <p className="text-sm font-normal leading-[21px] text-[#475569]">
          Selesai · September 2026<br />
          Next.js · Tailwind · Figma
        </p>

        <div className="w-full p-4 rounded-[16px] bg-[#E9EDF8] flex flex-col gap-2">
          <svg
            className="w-5 h-5 text-[#4338CA] shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-sm font-normal leading-[21px] text-[#0F172A] italic">
            “Rapi, responsif, dan sesuai kebutuhan tim kami.”
          </p>
          <p className="text-xs font-normal leading-[17px] text-[#475569]">
            Ratih Arini · ulasan klien
          </p>
        </div>

        <button
          type="button"
          className="w-full min-h-[48px] px-5 rounded-full bg-white border border-slate-200 text-[#0F172A] font-semibold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          Lihat Deliverables ↗
        </button>
      </GlassCard>

      {/* ─── CARD 4: Ulasan Klien ─── */}
      <GlassCard as="section" className="p-6 flex flex-col gap-2.5 bg-white/70">
        <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
          Ulasan klien
        </h2>
        <div className="flex flex-col gap-1 text-sm leading-[21px]">
          <p className="font-medium text-[#0F172A]">
            <span className="text-amber-500">★</span> 5.0 · Ratih Arini
          </p>
          <p className="font-normal text-[#475569] italic">
            “Rapi, responsif, dan komunikasinya jelas.”
          </p>
        </div>
        <p className="text-xs font-medium leading-[17px] text-[#475569] pt-1">
          September 2026 · proyek selesai
        </p>
      </GlassCard>
    </div>
  );
};

import React from 'react';
import Link from 'next/link';
import { ServiceOffering } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

interface ServiceCardProps {
  service: ServiceOffering;
}

/**
 * ServiceCard Component
 *
 * Sesuai spesifikasi Figma Desktop (437×540px) & Design System:
 * - Editable portfolio interface: mockup window 389x180px, bg #E9E7FC, rounded-16px
 * - Creator: Avatar modular, Nadia Putri, VerifiedBadge terstandarisasi
 * - Title: Inter 500 18px / lh 25px text #0F172A
 * - Description: Inter 400 14px / lh 21px text #475569
 * - Reviews: star icon + "4.9/5.0 · 12 ulasan"
 * - Price: "Mulai Rp350.000" (18px/600 text #0F172A)
 * - Action: "Lihat Jasa" (48px pill button)
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <GlassCard
      as="article"
      hoverEffect={true}
      className="w-full bg-white p-6 flex flex-col justify-between gap-4"
    >
      <div className="flex flex-col gap-4">
        {/* 1. Editable Portfolio Interface Mockup Banner */}
        <div className="w-full h-[180px] rounded-[16px] bg-[#E8E7FC] p-3 flex flex-col gap-2 overflow-hidden select-none border border-[#D8DDEC]/60">
          {/* Browser Chrome Header */}
          <div className="flex items-center gap-1.5 px-1">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span className="ml-2 text-xs text-[#64748B] font-mono">
              campusweek.design / register
            </span>
          </div>

          {/* Interface Canvas */}
          <div className="flex-1 bg-white rounded-[10px] p-3 flex gap-3 shadow-xs border border-white">
            {/* Sidebar preview */}
            <div className="w-28 border-r border-slate-100 pr-2 flex flex-col gap-1 text-xs text-[#64748B]">
              <span className="font-bold text-[#4338CA] text-xs flex items-center gap-0.5">
                CAMPUS <span className="text-xs">↗</span>
              </span>
              <span className="text-[#0F172A] font-medium pt-0.5">Overview</span>
              <span>Projects</span>
              <span>Schedule</span>
            </div>

            {/* Main content preview */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-[#0F172A] m-0 leading-tight">
                  Campus Week.
                </p>
                <p className="text-xs text-[#64748B] m-0 line-clamp-1">
                  Campus Week • Talks, ideas & connections
                </p>
              </div>

              {/* Purple accent banner */}
              <div className="w-full rounded-[6px] bg-[#4338CA] p-2 text-white">
                <p className="text-xs font-semibold m-0 leading-tight">Campus Week</p>
                <p className="text-xs opacity-90 m-0">24 OKTOBER 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Creator Identity */}
        <div className="flex items-center gap-3">
          <Avatar
            initials="NP"
            alt={service.studentName || 'Nadia Putri'}
            size="md"
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-medium leading-[21px] text-[#0F172A] truncate m-0">
              {service.studentName || 'Nadia Putri'}
            </p>
            <div className="flex items-center">
              <VerifiedBadge size="sm" label="Verified Student" />
            </div>
          </div>
        </div>

        {/* 3. Service Title */}
        <h3 className="text-lg font-medium leading-[25px] text-[#0F172A] line-clamp-1 m-0">
          {service.title}
        </h3>

        {/* 4. Description */}
        <p className="text-sm font-normal leading-[21px] text-[#475569] line-clamp-2 m-0">
          {service.description}
        </p>

        {/* 5. Rating & Reviews */}
        <div className="flex items-center gap-1.5 text-sm text-[#0F172A]">
          <span className="text-[#F59E0B]">★</span>
          <span className="font-medium">
            {(service.rating || 4.9).toFixed(1)}/5.0 · {service.reviewCount || 12} ulasan
          </span>
        </div>

        {/* 6. Starting Price */}
        <div className="flex flex-col">
          <span className="text-lg font-semibold leading-[27px] text-[#0F172A]">
            Mulai Rp{service.price.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* 7. Action CTA */}
      <div className="pt-2">
        <Link
          href={`/services/${service.id}`}
          className="w-full h-12 inline-flex items-center justify-center rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-sm text-center"
        >
          Lihat Jasa
        </Link>
      </div>
    </GlassCard>
  );
};

export default ServiceCard;
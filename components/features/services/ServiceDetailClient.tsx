'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceOffering } from '@/types';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { useModal } from '@/hooks/useModal';
import { ServiceSidebarCards } from '@/components/features/services/ServiceSidebarCards';
import { ServiceContactModal } from '@/components/features/services/ServiceContactModal';

export interface ServiceDetailClientProps {
  service: ServiceOffering;
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const {
    isOpen: isContactModalOpen,
    openModal: openContactModal,
    closeModal: closeContactModal,
  } = useModal();

  return (
    <div className="w-full bg-[#F0F1FB] min-h-screen">
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
              <Link href="/services" className="hover:text-[#4338CA] transition-colors">
                Jasa
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#0F172A] truncate max-w-[320px]">
              {service.title}
            </li>
          </ol>
        </nav>

        {/* Left Column (Cards 1 & 2) */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* ─── CARD 1: Provider & Service Header ─── */}
          <GlassCard as="section" className="p-6 sm:p-8 flex flex-col gap-4 bg-white/70">
            <div className="flex items-center">
              <ScopeBadge
                scope="CAMPUS_SPECIFIC"
                targetCampus={service.campusName || 'Universitas Pertamina'}
                size="sm"
              />
            </div>

            <h1 className="text-2xl sm:text-[28px] font-semibold leading-[34px] tracking-tight text-[#0F172A]">
              {service.title}
            </h1>

            {/* Provider Row: 64x64 Avatar + Name + Verified Student Badge */}
            <div className="flex items-center gap-4">
              <Avatar
                initials="NP"
                alt={service.studentName}
                size="xl"
              />
              <div className="flex flex-col gap-1.5 min-w-0">
                <h2 className="text-xl sm:text-[22px] font-semibold leading-tight text-[#0F172A] truncate">
                  {service.studentName}
                </h2>
                <VerifiedBadge size="sm" label="Verified Student" />
              </div>
            </div>

            <p className="text-sm font-normal leading-[21px] text-[#475569]">
              Ilmu Komputer 2024 · {service.campusName || 'Universitas Pertamina'}
            </p>

            <p className="text-sm font-normal leading-[21px] text-[#475569]">
              <span className="text-amber-500 font-medium">★</span> {service.rating.toFixed(1)}/5.0 · {service.reviewCount} ulasan · 8 proyek selesai
            </p>
          </GlassCard>

          {/* ─── CARD 2: Service Description & Package Details ─── */}
          <GlassCard as="section" className="p-6 sm:p-8 flex flex-col gap-4 bg-white/70">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
                Website rapi, siap dikembangkan
              </h2>
              <p className="text-sm font-normal leading-[21px] text-[#475569]">
                Saya membantu mengubah desain Anda menjadi antarmuka Next.js dan Tailwind yang responsif, ringan, serta mudah dikelola.
              </p>
            </div>

            <div className="flex flex-col gap-1 pt-2 border-t border-slate-100/80">
              <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
                Paket dasar
              </h2>
              <p className="text-[28px] font-semibold leading-[36px] text-[#0F172A]">
                Mulai Rp{service.price.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-2 rounded-full bg-[#E8E7FC] text-[#4338CA] text-xs font-semibold leading-none">
                5 Hari
              </span>
              <span className="px-3.5 py-2 rounded-full bg-[#E8E7FC] text-[#4338CA] text-xs font-semibold leading-none">
                2 revisi
              </span>
              <span className="px-3.5 py-2 rounded-full bg-[#E8E7FC] text-[#4338CA] text-xs font-semibold leading-none">
                Web Dev
              </span>
            </div>

            <ul className="space-y-1.5 text-sm font-normal leading-[21px] text-[#475569]">
              <li className="flex items-start gap-2">
                <span className="select-none text-[#4338CA] font-bold">•</span>
                <span>1 halaman responsif</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-[#4338CA] font-bold">•</span>
                <span>Komponen Next.js + Tailwind modern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-[#4338CA] font-bold">•</span>
                <span>Source code dan panduan setup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-[#4338CA] font-bold">•</span>
                <span>Preview deployment siap pakai</span>
              </li>
            </ul>

            <div className="flex flex-col gap-2 pt-1">
              <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
                Yang perlu Anda siapkan
              </h2>
              <p className="text-sm font-normal leading-[21px] text-[#475569]">
                File Figma atau referensi, logo, konten final, dan akses repository bila tersedia.
              </p>
            </div>

            <div className="w-full p-4 rounded-[16px] bg-[#FFFBEB] border border-amber-200/60 flex flex-col justify-center">
              <p className="text-sm font-medium leading-[21px] text-[#78350F]">
                Jasa ini khusus mahasiswa terverifikasi Universitas Pertamina. Pengguna noneligible tidak mendapat formulir permintaan jasa.
              </p>
            </div>

            <button
              type="button"
              onClick={openContactModal}
              className="w-full min-h-[48px] px-5 rounded-full bg-gradient-to-r from-[#4A4EB5] to-[#6647B9] text-white font-bold text-sm flex items-center justify-center shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
            >
              Hubungi Penyedia Jasa
            </button>
          </GlassCard>

        </div>

        {/* Right Column (Portfolio Deliverable & Reviews Sidebar) */}
        <ServiceSidebarCards />

      </div>

      {/* Contact Provider Modal (Managed via useModal with Focus Return) */}
      <ServiceContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        serviceTitle={service.title}
        studentName={service.studentName}
      />
    </div>
  );
}

export default ServiceDetailClient;

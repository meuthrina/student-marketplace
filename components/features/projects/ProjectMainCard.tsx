import React from 'react';
import { Project } from '@/types';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { GlassCard } from '@/components/ui/GlassCard';

export interface ProjectMainCardProps {
  project: Project;
  formattedDeadline: string;
}

export const ProjectMainCard: React.FC<ProjectMainCardProps> = ({
  project,
  formattedDeadline,
}) => {
  return (
    <GlassCard as="section" className="p-6 sm:p-8 flex flex-col gap-6 bg-white/70">
      {/* Campus Scope Badge */}
      <div className="flex items-center">
        <ScopeBadge scope={project.scope} targetCampus={project.targetCampus} size="sm" />
      </div>

      {/* Project Title */}
      <h1 className="text-2xl sm:text-[28px] font-semibold leading-[34px] tracking-tight text-[#0F172A]">
        {project.title}
      </h1>

      {/* Client / Author Info */}
      <p className="text-sm font-normal leading-[21px] text-[#475569]">
        {project.clientName} · {project.clientRole}
      </p>

      {/* Posting & Deadline Meta */}
      <p className="text-xs font-medium leading-[17px] text-[#475569]">
        Diposting 10 Oktober 2026 · Deadline {formattedDeadline}
      </p>

      {/* Category Skill Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {project.skillTags.map((tag) => (
          <span
            key={tag}
            className="px-3.5 py-2 rounded-full bg-[#E8E7FC] text-[#4338CA] text-xs font-semibold leading-none"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Section 1: Tentang proyek */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100/80">
        <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
          Tentang proyek
        </h2>
        <p className="text-sm font-normal leading-[21px] text-[#475569]">
          {project.description ||
            'Kami membutuhkan website untuk registrasi peserta Campus Week Universitas Pertamina. Pengalaman pendaftaran harus sederhana, responsif, dan mudah dikelola panitia.'}
        </p>
      </div>

      {/* Section 2: Kebutuhan utama */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
          Kebutuhan utama
        </h2>
        <ul className="space-y-1.5 text-sm font-normal leading-[21px] text-[#475569]">
          <li className="flex items-start gap-2">
            <span className="select-none text-[#4338CA] font-bold">•</span>
            <span>Halaman informasi acara dan jadwal</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="select-none text-[#4338CA] font-bold">•</span>
            <span>Formulir peserta dengan validasi data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="select-none text-[#4338CA] font-bold">•</span>
            <span>Dashboard panitia dan fitur ekspor CSV</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="select-none text-[#4338CA] font-bold">•</span>
            <span>Layout responsif mobile, tablet, dan desktop</span>
          </li>
        </ul>
      </div>

      {/* Section 3: Deliverables */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
          Deliverables
        </h2>
        <p className="text-sm font-normal leading-[21px] text-[#475569]">
          Source code React + Tailwind, dokumentasi setup, demo deployment, serta 2 kali revisi.
        </p>
      </div>

      {/* Section 4: Lampiran brief */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl sm:text-[22px] font-semibold leading-[29px] text-[#0F172A]">
          Lampiran brief
        </h2>
        <p className="text-sm font-normal leading-[21px] text-[#0F172A]">
          Dokumen proyek
        </p>

        {/* Attachment Box */}
        <div className="w-full flex items-center gap-3 p-3.5 bg-white border border-[#D8DDF0] rounded-[16px] min-h-[52px]">
          <svg
            className="w-5 h-5 text-[#475569] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 8h10M7 12h10M7 16h6" />
          </svg>
          <span className="text-sm font-medium text-[#0F172A]">
            spesifikasi.pdf · 480 KB
          </span>
        </div>

        <p className="text-xs font-medium leading-[17px] text-[#475569]">
          Brief kebutuhan dan contoh alur peserta
        </p>
      </div>
    </GlassCard>
  );
};

export default ProjectMainCard;

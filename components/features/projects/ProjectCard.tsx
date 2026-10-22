import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';

interface ProjectCardProps {
  project: Project;
}

/**
 * ProjectCard Component
 *
 * Sesuai spesifikasi Figma Tablet (352×494px) & Design System:
 * - Container: GlassCard modular pad 24px, gap 18px, rounded 24px
 * - Trust badge: Campus-Specific (#FEF3C7/#78350F) / Public (#DBEAFE/#1E40AF)
 * - Title: Inter 600 22px / lh 28.6px, text #0F172A
 * - Client: Avatar component (44×44px, initials, WCAG AA)
 * - Description: Inter 400 14px / lh 21px, text #475569
 * - Budget: "Anggaran proyek" 12px/400, "Rp..." 22px/600, text #0F172A
 * - Skills: badges bg #DBEAFE, text #1E40AF, code icon
 * - Deadline: calendar icon + "Deadline: 24 Oktober 2026"
 * - Action: "Lihat Proyek" 48px rounded-full button
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const initials = project.clientName
    ? project.clientName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'RA';

  const formatDeadline = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = date.getDate();
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <GlassCard
      as="article"
      hoverEffect={true}
      className="w-full bg-white p-6 flex flex-col justify-between gap-[18px]"
    >
      <div className="flex flex-col gap-[18px] min-w-0">
        {/* 1. Scope Badge */}
        <div className="flex items-center min-w-0 max-w-full">
          <ScopeBadge
            scope={project.scope}
            targetCampus={project.targetCampus}
            size="sm"
          />
        </div>

        {/* 2. Project Title */}
        <h3 className="text-[22px] font-semibold leading-[28.6px] text-[#0F172A] line-clamp-2 m-0">
          {project.title}
        </h3>

        {/* 3. Client Identity */}
        <div className="flex items-center gap-3">
          <Avatar
            initials={initials}
            alt={project.clientName}
            size="md"
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-medium leading-[21px] text-[#0F172A] truncate m-0">
              {project.clientName}
            </p>
            <p className="text-xs font-normal leading-[18px] text-[#475569] truncate m-0">
              {project.clientRole || 'Panitia Campus Week'}
            </p>
          </div>
        </div>

        {/* 4. Description */}
        <p className="text-sm font-normal leading-[21px] text-[#475569] line-clamp-2 m-0">
          {project.description}
        </p>

        {/* 5. Budget */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal leading-[18px] text-[#475569]">
            Anggaran proyek
          </span>
          <span className="text-[22px] font-semibold leading-[26.6px] text-[#0F172A]">
            Rp{project.budget.toLocaleString('id-ID')}
          </span>
        </div>

        {/* 6. Skill Tags */}
        <div className="flex flex-wrap gap-2">
          {project.skillTags.map((tag) => (
            <span
              key={tag}
              title={tag}
              className="inline-flex max-w-full items-center gap-1.5 px-3 py-[7px] rounded-full bg-[#DBEAFE] text-[#1E40AF] text-xs font-medium"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span className="truncate">{tag}</span>
            </span>
          ))}
        </div>

        {/* 7. Deadline */}
        <div className="flex items-center gap-1.5 text-xs font-normal leading-[18px] text-[#475569]">
          <svg
            className="w-4 h-4 shrink-0 text-[#475569]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Deadline: {formatDeadline(project.deadline)}</span>
        </div>
      </div>

      {/* 8. Action CTA */}
      <div className="pt-2">
        <Link
          href={`/projects/${project.id}`}
          className="w-full h-12 inline-flex items-center justify-center rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-sm text-center"
        >
          Lihat Proyek
        </Link>
      </div>
    </GlassCard>
  );
};

export default ProjectCard;
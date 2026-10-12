'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { ScopeBadge } from '@/components/ui/ScopeBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface ProjectCardProps {
  project: Project;
}

/**
 * ProjectCard Component
 *
 * Kartu ringkasan proyek yang ditawarkan oleh Klien (FR-01).
 * Menggunakan prinsip WCAG 2.2 AA, responsif, dan efek Liquid Glassmorphism.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="surface-card card-hover flex min-h-[250px] flex-col justify-between space-y-2 rounded-[var(--radius-lg)] p-3 sm:p-4">
      <div className="space-y-2">
        {/* Scope Badge Status */}
        <div className="min-w-0">
          <ScopeBadge
            scope={project.scope}
            targetCampus={project.targetCampus}
            size="sm"
          />
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[var(--color-text-primary)] sm:text-base">
          {project.title}
        </h3>

        {/* Client Info */}
        <div className="flex items-center gap-2 pt-1">
          <Avatar
            src={project.clientAvatar}
            alt={project.clientName}
            className="ring-1 ring-[var(--color-border)]"
          />
          <div className="text-[0.563rem]">
            <p className="font-semibold text-[var(--color-text-primary)] truncate">
              {project.clientName}
            </p>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="line-clamp-2 text-[0.625rem] leading-relaxed text-[var(--color-text-secondary)]">
          {project.description}
        </p>

        {/* Budget */}
        <div className="pt-2 border-t border-[var(--color-border)]">
          <p className="text-[0.5rem] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Anggaran Proyek
          </p>
          <p className="text-sm font-extrabold text-[var(--color-primary)]">
            Rp{project.budget.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.skillTags.map((tag) => (
            <Badge
              key={tag}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-3">
        <Link
          href={`/projects/${project.id}`}
          className="btn-secondary min-h-8 w-full text-[0.625rem] text-[var(--color-primary)]"
        >
          Lihat Proyek
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;
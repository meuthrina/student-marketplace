'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceOffering } from '@/types';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface ServiceCardProps {
  service: ServiceOffering;
}

/**
 * ServiceCard Component
 *
 * Kartu ringkasan penawaran jasa mandiri mahasiswa (FR-01).
 * Menampilkan status mahasiswa terverifikasi, rating, dan sampel karya.
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <article className="surface-card card-hover flex min-h-[280px] flex-col justify-between space-y-2 rounded-[var(--radius-lg)] p-3 sm:p-4">
      <div className="space-y-2">
        {/* Sample Work Preview Banner */}
        {service.sampleImages.length > 0 && (
          <div className="h-24 w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] sm:h-28">
            <img
              src={service.sampleImages[0]}
              alt={service.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Student Creator Header */}
        <div className="flex items-center gap-2 pt-1">
          <Avatar
            src={service.studentAvatar}
            alt={service.studentName}
            className="ring-2 ring-[var(--color-primary-light)]"
          />
          <div className="space-y-0.5 text-[0.563rem]">
            <p className="font-bold text-[var(--color-text-primary)]">
              {service.studentName}
            </p>
            {service.isVerifiedStudent && (
              <VerifiedBadge size="sm" />
            )}
          </div>
        </div>

        {/* Service Title */}
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[var(--color-text-primary)] sm:text-base">
          {service.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 text-[0.625rem] leading-relaxed text-[var(--color-text-secondary)]">
          {service.description}
        </p>

        {/* Rating & Review Summary */}
        <div className="flex items-center gap-1.5 text-[0.625rem] text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-amber)] font-bold">★ {service.rating.toFixed(1)}</span>
          <span className="text-[var(--color-text-muted)]">({service.reviewCount} ulasan)</span>
        </div>

        {/* Price & Duration */}
        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-[0.5rem] font-bold uppercase text-[var(--color-text-muted)]">
              Mulai Dari
            </p>
            <p className="text-sm font-extrabold text-[var(--color-primary)]">
              Rp{service.price.toLocaleString('id-ID')}
            </p>
          </div>
          <Badge variant="muted" size="sm" className="px-2 py-1 text-[0.563rem]">
            {service.durationDays} Hari
          </Badge>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-3">
        <Link
          href={`/services/${service.id}`}
          className="btn-secondary min-h-8 w-full text-[0.625rem] text-[var(--color-primary)]"
        >
          Lihat Jasa
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
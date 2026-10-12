'use client';

import React, { Suspense, use } from 'react';
import Link from 'next/link';
import { mockServices } from '@/lib/mockData';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

function ServiceDetailContent({ params }: ServiceDetailPageProps) {
  const { id } = use(params);
  const service = mockServices.find((item) => item.id === id) ?? mockServices[0];
  const sampleImage = service.sampleImages[0];

  return (
    <div className="mx-auto max-w-[1160px] space-y-4 px-5 py-4 sm:px-6 lg:px-0 lg:py-6">
      <nav aria-label="Breadcrumb" className="hidden text-xs text-[var(--color-text-muted)] lg:block">
        <Link href="/" className="hover:text-[var(--color-primary)]">Beranda</Link> /{' '}
        <Link href="/services" className="hover:text-[var(--color-primary)]">Jasa</Link> / {service.title}
      </nav>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
        <div className="space-y-4">
          <section className="glass-card space-y-3 rounded-[var(--radius-lg)] p-4 sm:p-6">
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-primary-light)]">
              <img src={sampleImage} alt={service.title} className="h-40 w-full object-cover sm:h-56" />
            </div>
            <div className="flex items-center gap-2">
              <img src={service.studentAvatar} alt={service.studentName} className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--color-primary-light)]" />
              <div className="text-[0.625rem]">
                <p className="font-bold text-[var(--color-text-primary)]">{service.studentName}</p>
                <VerifiedBadge size="sm" />
              </div>
            </div>
            <h1 className="text-[1.35rem] font-extrabold leading-tight text-[var(--color-text-primary)] sm:text-2xl">
              {service.title}
            </h1>
            <p className="text-[0.625rem] text-[var(--color-text-secondary)]">{service.category} · {service.campusName}</p>
            <div className="flex items-center gap-1.5 text-[0.625rem] text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-amber)]">★ {service.rating.toFixed(1)}</span>
              <span>· {service.reviewCount} ulasan · 8 proyek selesai</span>
            </div>
          </section>

          <section className="surface-card space-y-3 rounded-[var(--radius-lg)] p-4 sm:p-6">
            <h2 className="text-sm font-bold">Website rapi, siap dikembangkan</h2>
            <p className="text-[0.688rem] leading-relaxed text-[var(--color-text-secondary)]">{service.description}</p>
            <h2 className="text-sm font-bold">Paket dasar</h2>
            <p className="text-lg font-extrabold text-[var(--color-text-primary)]">Mulai Rp{service.price.toLocaleString('id-ID')}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-[0.563rem] text-[var(--color-primary)]">{service.durationDays} Hari</span>
              <span className="rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-[0.563rem] text-[var(--color-primary)]">2 revisi</span>
              <span className="rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-[0.563rem] text-[var(--color-primary)]">Web Dev</span>
            </div>
            <ul className="list-disc space-y-1 pl-4 text-[0.625rem] text-[var(--color-text-secondary)]">
              <li>1 halaman responsif</li>
              <li>Komponen Next.js + Tailwind</li>
              <li>Source code dan panduan setup</li>
              <li>Preview deployment</li>
            </ul>
            <h2 className="text-sm font-bold">Yang perlu Anda siapkan</h2>
            <p className="text-[0.625rem] leading-relaxed text-[var(--color-text-secondary)]">File Figma atau referensi, logo, konten final, dan akses repository bila tersedia.</p>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-warning-bg)] p-3 text-[0.625rem] text-[var(--color-amber)]">
              Jasa ini khusus mahasiswa terverifikasi Universitas Pertamina. Pengguna non-verified tetap dapat mengirim permintaan jasa.
            </div>
            <button type="button" className="w-full rounded-full bg-brand-gradient py-2.5 text-xs font-bold text-white">
              Hubungi Penyedia Jasa
            </button>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="glass-card space-y-3 rounded-[var(--radius-lg)] p-4 sm:p-6 lg:sticky lg:top-24">
            <p className="text-[0.563rem] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Harga mulai</p>
            <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">Rp{service.price.toLocaleString('id-ID')}</p>
            <p className="text-[0.625rem] text-[var(--color-text-secondary)]">Estimasi pengerjaan {service.durationDays} hari</p>
            <button type="button" className="w-full rounded-full bg-brand-gradient py-2.5 text-xs font-bold text-white">Hubungi Penyedia Jasa</button>
          </section>
          <section className="space-y-2">
            <h2 className="text-sm font-bold">Portofolio penyedia</h2>
            <div className="surface-card overflow-hidden rounded-[var(--radius-lg)] p-3">
              <img src={sampleImage} alt="Portofolio penyedia" className="h-28 w-full rounded-md object-cover" />
              <span className="mt-2 inline-block rounded-full bg-[var(--color-success-bg)] px-2 py-1 text-[0.5rem] font-semibold text-[var(--color-teal)]">Verified Completion</span>
              <h3 className="mt-2 text-xs font-bold">Dashboard Komunitas Kampus</h3>
              <p className="mt-1 text-[0.563rem] text-[var(--color-text-secondary)]">Selesai · September 2026<br />Next.js · Tailwind · Figma</p>
              <button type="button" className="btn-secondary mt-3 min-h-8 w-full text-[0.625rem]">Lihat Deliverables →</button>
            </div>
          </section>
          <section className="surface-card space-y-2 rounded-[var(--radius-lg)] p-4">
            <h2 className="text-sm font-bold">Ulasan klien</h2>
            <p className="text-[0.625rem] text-[var(--color-text-secondary)]">★ 5.0 · Ratih Arini</p>
            <p className="text-[0.625rem] text-[var(--color-text-secondary)]">“Rapi, responsif, dan sesuai kebutuhan kami.”</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function ServiceDetailPage(props: ServiceDetailPageProps) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16 text-center text-sm text-[var(--color-text-muted)]">Memuat detail jasa...</div>}>
      <ServiceDetailContent {...props} />
    </Suspense>
  );
}

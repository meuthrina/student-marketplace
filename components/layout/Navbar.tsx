'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Role } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export interface NavbarProps {
  /** Initial active role override (optional) */
  initialRole?: Role;
  /** Callback saat pengguna merubah role switch */
  onRoleChange?: (newRole: Role) => void;
}

/**
 * Navbar Component
 *
 * Header navigasi utama dengan tampilan Liquid Glassmorphism.
 * Memuat fitur Context Role Switcher ([🎓 Freelancer | 💼 Klien])
 * serta mematuhi kriteria WCAG 2.2 AA (semantic header/nav, focus ring).
 */
export const Navbar: React.FC<NavbarProps> = ({
  initialRole = mockCurrentUser.activeRole,
  onRoleChange,
}) => {
  const [activeRole, setActiveRole] = useState<Role>(initialRole);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleRoleToggle = (role: Role) => {
    setActiveRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pb-2 pt-3 transition-all sm:px-6 lg:px-0">
      <div className="mx-auto max-w-[1160px]">
        <div className="flex min-h-12 items-center justify-between gap-3 rounded-[var(--radius-pill)] bg-white px-3 py-2 shadow-[var(--shadow-card)] sm:px-4">
        
        {/* 1. Brand Logo */}
        <div className="flex min-w-0 shrink-0 items-center">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-sm font-bold tracking-tight transition-opacity hover:opacity-90 sm:text-base"
            aria-label="Studance Beranda"
          >
            <span className="font-extrabold text-[var(--color-text-primary)]">
              studance
            </span>
          </Link>
        </div>

        {/* 2. Desktop Navigation Links (Restricted dynamically by activeRole) */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden items-center gap-5 whitespace-nowrap text-[0.688rem] font-medium text-[var(--color-text-secondary)] lg:flex"
        >
          {activeRole === 'STUDENT' ? (
            <>
              <Link
                href="/projects"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Proyek
              </Link>
              <Link
                href="/services"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Jasa Saya
              </Link>
              <Link
                href="/profile"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Profil
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/client/dashboard"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/client/projects/create"
                className="hover:text-[var(--color-primary)] transition-colors"
              >
                Buat Proyek
              </Link>
            </>
          )}
        </nav>

        {/* 3. Action Controls & Context Role Switcher */}
        <div className="flex items-center gap-2">
          <Link href="/services" className="hidden min-h-8 items-center rounded-full bg-[var(--color-primary)] px-3 text-[0.625rem] font-bold text-white lg:inline-flex">
            + Buat Jasa
          </Link>

          {/* Pill Toggle Switcher (🎓 Mode Freelancer vs 💼 Mode Klien) */}
          <div
            role="radiogroup"
            aria-label="Pilih Mode Peran Pengguna"
            className="flex min-w-0 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1 text-[0.625rem] font-semibold shadow-inner sm:text-[0.688rem]"
          >
            <button
              type="button"
              role="radio"
              aria-checked={activeRole === 'STUDENT'}
              onClick={() => handleRoleToggle('STUDENT')}
              className={`min-h-9 px-3 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                activeRole === 'STUDENT'
                  ? 'bg-white text-[var(--color-primary)] shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>🎓</span>
              Freelancer
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={activeRole === 'CLIENT'}
              onClick={() => handleRoleToggle('CLIENT')}
              className={`min-h-9 px-3 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                activeRole === 'CLIENT'
                  ? 'bg-[var(--color-surface-dark)] text-white shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>💼</span>
              Klien
            </button>
          </div>

          {/* User Profile Avatar Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              aria-label="Menu Profil Pengguna"
              className="flex items-center gap-2 rounded-full p-1 hover:bg-[var(--color-surface-soft)] transition-colors"
            >
              <img
                src={mockCurrentUser.avatarUrl}
                alt={mockCurrentUser.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[var(--color-primary-light)]"
              />
            </button>

            {/* Simple Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 glass-card p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-dropdown)] border border-[var(--color-border)] space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="border-b border-[var(--color-border)] pb-2.5">
                  <p className="font-bold text-sm text-[var(--color-text-primary)]">
                    {mockCurrentUser.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {mockCurrentUser.email}
                  </p>
                  <div className="mt-2">
                    <VerifiedBadge
                      size="sm"
                      campusDomain={mockCurrentUser.campusDomain}
                      className="max-w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  <Link
                    href="/profile"
                    className="block px-2 py-1.5 rounded-md hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profil Saya ({mockCurrentUser.studentId})
                  </Link>
                  <Link
                    href="/auth/verify-student"
                    className="block px-2 py-1.5 rounded-md hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Status Verifikasi Kampus
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
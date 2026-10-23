'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Role } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useRole } from '@/contexts/RoleContext';
import { NavbarProfileDropdown } from '@/components/layout/NavbarProfileDropdown';
import { NavbarTabletDrawer } from '@/components/layout/NavbarTabletDrawer';
import { NavbarSearchBar } from '@/components/layout/NavbarSearchBar';
import { NavbarLinks } from '@/components/layout/NavbarLinks';
import { NavbarMobileActions } from '@/components/layout/NavbarMobileActions';

export interface NavbarProps {
  /** Initial active role override (optional) */
  initialRole?: Role;
  /** Callback saat pengguna merubah role switch */
  onRoleChange?: (newRole: Role) => void;
}

/**
 * Navbar Component (Liquid Glassmorphism Header)
 */
function NavbarContent({
  onRoleChange,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { activeRole, setActiveRole } = useRole();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);
  const urlQ = searchParams.get('q') ?? '';
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  const [navSearchQuery, setNavSearchQuery] = useState(urlQ);

  // Sinkronkan input pencarian jika query string ?q berubah dari luar
  if (prevUrlQ !== urlQ) {
    setPrevUrlQ(urlQ);
    setNavSearchQuery(urlQ);
  }

  // Debounce otomatis saat mengetik di halaman Beranda (/)
  useEffect(() => {
    if (pathname !== '/') return;
    const currentQ = searchParams.get('q') ?? '';
    if (navSearchQuery.trim() === currentQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (navSearchQuery.trim()) {
        params.set('q', navSearchQuery.trim());
      } else {
        params.delete('q');
      }
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
    }, 350);

    return () => clearTimeout(timer);
  }, [navSearchQuery, pathname, router, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = navSearchQuery.trim();
    if (pathname === '/') {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
    } else {
      router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
    }
  };

  const handleRoleToggle = (role: Role) => {
    setActiveRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-4 lg:pt-6 pb-0">
        {/* Glass pill navbar: 48px tall on mobile/tablet, 80px tall on desktop (lg:h-20) */}
        <div className="flex h-12 lg:h-20 items-center justify-between rounded-full px-3 lg:px-6 bg-white/65 backdrop-blur-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/90 gap-4 lg:gap-6">
          {/* 1. Brand Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Studance Beranda"
          >
            <span className="text-[22px] font-bold leading-[26.6px] tracking-tight text-[#0F172A]">
              studance
            </span>
          </Link>

          {/* 2. Desktop Navigation Links (Figma: Jelajah, Jasa, Profil) */}
          <NavbarLinks />

          {/* 3. Desktop Search Bar (Figma: "Cari talenta atau proyek", 748x44px max) */}
          <NavbarSearchBar
            value={navSearchQuery}
            onChange={setNavSearchQuery}
            onSubmit={handleSearchSubmit}
          />

          {/* 4. Desktop Right Side Controls (Avatar NP + "+ Buat Jasa") */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Profile Avatar with Verification Dot */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                aria-label="Menu Profil Pengguna"
                className="relative flex items-center justify-center rounded-full hover:opacity-90 transition-opacity"
              >
                <Avatar
                  initials="NP"
                  alt="Nadia Putri"
                  size="md"
                  verified={true}
                />
              </button>

              {/* Profile Dropdown Menu */}
              <NavbarProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                activeRole={activeRole}
                onRoleToggle={handleRoleToggle}
              />
            </div>

            {/* Dynamic Action Button (+ Buat Jasa for Student vs + Buat Proyek for Client) */}
            <Link
              href={activeRole === 'CLIENT' ? '/client/projects/create' : '/services'}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#4338CA] px-5 text-sm font-bold text-white hover:bg-[#3730A3] transition-colors shadow-sm"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{activeRole === 'CLIENT' ? 'Buat Proyek' : 'Buat Jasa'}</span>
            </Link>
          </div>

          {/* 5. Tablet Right Side: Hamburger Menu Button */}
          <div className="hidden sm:flex lg:hidden relative">
            <button
              type="button"
              aria-label="Buka Menu Navigasi"
              aria-expanded={isTabletMenuOpen}
              onClick={() => setIsTabletMenuOpen(!isTabletMenuOpen)}
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full hover:bg-[#E8E7FC] transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4338CA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Tablet Dropdown Menu Drawer */}
            <NavbarTabletDrawer
              isOpen={isTabletMenuOpen}
              onClose={() => setIsTabletMenuOpen(false)}
              activeRole={activeRole}
              onRoleToggle={handleRoleToggle}
            />
          </div>

          {/* 6. Mobile: Role Switcher & Bell icon (< sm) */}
          <NavbarMobileActions
            activeRole={activeRole}
            onRoleToggle={() => handleRoleToggle(activeRole === 'STUDENT' ? 'CLIENT' : 'STUDENT')}
          />
        </div>
      </div>
    </header>
  );
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <NavbarContent {...props} />
    </Suspense>
  );
};

export default Navbar;
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/types';
import { useRole } from '@/contexts/RoleContext';

export interface MobileNavProps {
  activeRole?: Role;
}

/**
 * MobileNav – Bottom Navigation Bar
 *
 * Figma specs (mobile, 360px):
 * - Container: 360×80px, white bg, padding 8px all
 * - 4 nav items, each 86×64px, padding 6px all, gap 4px (vertical), radius 18px
 * - Active item: bg #E8E7FC, icon stroke #4338CA, label #4338CA 12px/600
 * - Inactive item: bg white, icon stroke #475569, label #475569 12px/500
 * - Icon size: 22×22px wrapper, actual vector ~16-18px
 */
function MobileNavContent({ activeRole: propRole }: MobileNavProps) {
  const pathname = usePathname();
  const { activeRole: contextRole } = useRole();
  const activeRole = propRole ?? contextRole;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const studentNavItems = [
    {
      label: 'Home',
      href: '/',
      icon: (
        // house icon — Lucide "house"
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: (
        // compass icon — Lucide "compass"
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      label: 'Services',
      href: '/services',
      icon: (
        // briefcase-business icon — Lucide "briefcase-business"
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="12.01" />
          <path d="M2 12h5m10 0h5" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: (
        // user-round icon — Lucide "user-round"
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
  ];

  const clientNavItems = [
    {
      label: 'Home',
      href: '/',
      icon: studentNavItems[0].icon,
    },
    {
      label: 'Dashboard',
      href: '/client/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      label: 'Buat Proyek',
      href: '/client/projects/create',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Profil',
      href: '/profile',
      icon: studentNavItems[3].icon,
    },
  ];

  const currentNavItems = activeRole === 'STUDENT' ? studentNavItems : clientNavItems;

  return (
    <nav
      aria-label="Navigasi Bawah Seluler"
      className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white p-2 sm:hidden border-t border-slate-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="mx-auto flex h-full w-full max-w-md px-2 items-center justify-around">
        {currentNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`w-[86px] h-16 p-1.5 rounded-[18px] flex flex-col items-center justify-center gap-1 no-underline transition-colors ${
                active ? 'bg-[#E8E7FC] text-[#4338CA]' : 'bg-transparent text-[#475569] hover:bg-slate-50'
              }`}
            >
              {/* Icon: with correct stroke color */}
              <span
                className={`flex items-center justify-center w-[22px] h-[22px] ${
                  active ? 'text-[#4338CA] stroke-[#4338CA]' : 'text-[#475569] stroke-[#475569]'
                }`}
              >
                {item.icon}
              </span>
              {/* Label */}
              <span
                className={`text-xs leading-[14.5px] whitespace-nowrap ${
                  active ? 'font-semibold text-[#4338CA]' : 'font-medium text-[#475569]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export const MobileNav: React.FC<MobileNavProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <MobileNavContent {...props} />
    </Suspense>
  );
};

export default MobileNav;
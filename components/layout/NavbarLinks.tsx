'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavbarLinks: React.FC = () => {
  const pathname = usePathname();

  const isHomeActive = pathname === '/' || pathname.startsWith('/projects');
  const isServicesActive = pathname.startsWith('/services');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <nav
      aria-label="Navigasi Utama"
      className="hidden lg:flex items-center gap-6 whitespace-nowrap text-sm font-medium"
    >
      <Link
        href="/"
        aria-current={isHomeActive ? 'page' : undefined}
        className={`transition-colors ${
          isHomeActive
            ? 'text-[#4338CA] font-bold'
            : 'text-[#475569] hover:text-[#4338CA]'
        }`}
      >
        Jelajah
      </Link>
      <Link
        href="/services"
        aria-current={isServicesActive ? 'page' : undefined}
        className={`transition-colors ${
          isServicesActive
            ? 'text-[#4338CA] font-bold'
            : 'text-[#475569] hover:text-[#4338CA]'
        }`}
      >
        Jasa
      </Link>
      <Link
        href="/profile"
        aria-current={isProfileActive ? 'page' : undefined}
        className={`transition-colors ${
          isProfileActive
            ? 'text-[#4338CA] font-bold'
            : 'text-[#475569] hover:text-[#4338CA]'
        }`}
      >
        Profil
      </Link>
    </nav>
  );
};

export default NavbarLinks;

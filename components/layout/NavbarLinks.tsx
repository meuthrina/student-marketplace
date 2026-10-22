import React from 'react';
import Link from 'next/link';

export const NavbarLinks: React.FC = () => {
  return (
    <nav
      aria-label="Navigasi Utama"
      className="hidden lg:flex items-center gap-6 whitespace-nowrap text-sm font-medium"
    >
      <Link
        href="/"
        className="text-[#4338CA] font-semibold hover:opacity-80 transition-opacity"
      >
        Jelajah
      </Link>
      <Link
        href="/services"
        className="text-[#475569] hover:text-[#4338CA] transition-colors"
      >
        Jasa
      </Link>
      <Link
        href="/profile"
        className="text-[#475569] hover:text-[#4338CA] transition-colors"
      >
        Profil
      </Link>
    </nav>
  );
};

export default NavbarLinks;

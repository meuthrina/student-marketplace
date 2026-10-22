'use client';

import React from 'react';
import Link from 'next/link';
import { Role } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';

export interface NavbarTabletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: Role;
  onRoleToggle: (newRole: Role) => void;
}

export const NavbarTabletDrawer: React.FC<NavbarTabletDrawerProps> = ({
  isOpen,
  onClose,
  activeRole,
  onRoleToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-[24px] p-4 rounded-[20px] shadow-[0_20px_40px_rgba(27,35,69,0.12)] border border-white z-50 flex flex-col gap-3 animate-in fade-in duration-150"
    >
      <div className="flex items-center justify-between border-b border-[#D8DDEC] pb-2.5">
        <span className="text-xs font-semibold text-[#0F172A]">Mode Peran</span>
        <button
          type="button"
          onClick={() => onRoleToggle(activeRole === 'STUDENT' ? 'CLIENT' : 'STUDENT')}
          className="text-xs font-medium text-[#4338CA] bg-[#E8E7FC] px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#d8ddec] transition-colors"
        >
          {activeRole === 'STUDENT' ? '🎓 Freelancer' : '💼 Klien'}
        </button>
      </div>

      <nav className="flex flex-col gap-1 text-sm font-medium text-[#0F172A]">
        <Link
          href="/"
          className="px-3 py-2 rounded-lg hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors"
          onClick={onClose}
        >
          Beranda
        </Link>
        <Link
          href="/projects"
          className="px-3 py-2 rounded-lg hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors"
          onClick={onClose}
        >
          Katalog Proyek
        </Link>
        <Link
          href="/services"
          className="px-3 py-2 rounded-lg hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors"
          onClick={onClose}
        >
          Katalog Jasa
        </Link>
        {activeRole === 'CLIENT' && (
          <Link
            href="/client/dashboard"
            className="px-3 py-2 rounded-lg hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors font-semibold"
            onClick={onClose}
          >
            Dashboard Klien
          </Link>
        )}
        <Link
          href="/profile"
          className="px-3 py-2 rounded-lg hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors"
          onClick={onClose}
        >
          Profil ({mockCurrentUser.name.split(' ')[0]})
        </Link>
      </nav>
    </div>
  );
};

export default NavbarTabletDrawer;

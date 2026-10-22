'use client';

import React from 'react';
import Link from 'next/link';
import { Role } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';

export interface NavbarProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: Role;
  onRoleToggle: (newRole: Role) => void;
}

export const NavbarProfileDropdown: React.FC<NavbarProfileDropdownProps> = ({
  isOpen,
  onClose,
  activeRole,
  onRoleToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-[24px] p-4 rounded-[20px] shadow-[0_20px_40px_rgba(27,35,69,0.12)] border border-[#D8DDEC] space-y-3 z-50 animate-in fade-in duration-150"
    >
      <div className="border-b border-[#D8DDEC] pb-2.5">
        <p className="font-bold text-sm text-[#0F172A]">
          Nadia Putri
        </p>
        <p className="text-xs text-[#475569] truncate">
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

      <div className="space-y-1 text-xs font-medium text-[#475569]">
        <Link
          href="/profile"
          className="block px-2 py-1.5 rounded-md hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors"
          onClick={onClose}
        >
          Profil Saya ({mockCurrentUser.studentId})
        </Link>
        <Link
          href="/auth/verify-student"
          className="block px-2 py-1.5 rounded-md hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors"
          onClick={onClose}
        >
          Status Verifikasi Kampus
        </Link>
        {activeRole === 'CLIENT' && (
          <Link
            href="/client/dashboard"
            className="block px-2 py-1.5 rounded-md hover:bg-[#E8E7FC] hover:text-[#4338CA] transition-colors font-semibold"
            onClick={onClose}
          >
            Dashboard Klien
          </Link>
        )}
      </div>

      <div className="border-t border-[#D8DDEC] pt-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0F172A]">Mode Peran</span>
        <button
          type="button"
          onClick={() => onRoleToggle(activeRole === 'STUDENT' ? 'CLIENT' : 'STUDENT')}
          className="text-xs font-semibold text-[#4338CA] bg-[#E8E7FC] px-3 py-1 rounded-full hover:bg-[#d8ddec] transition-colors cursor-pointer"
        >
          {activeRole === 'STUDENT' ? '🎓 Freelancer' : '💼 Klien'}
        </button>
      </div>
    </div>
  );
};

export default NavbarProfileDropdown;

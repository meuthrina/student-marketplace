'use client';

import React from 'react';
import { Role } from '@/types';

export interface NavbarMobileActionsProps {
  activeRole: Role;
  onRoleToggle: () => void;
}

export const NavbarMobileActions: React.FC<NavbarMobileActionsProps> = ({
  activeRole,
  onRoleToggle,
}) => {
  return (
    <div className="flex sm:hidden items-center gap-1.5">
      <button
        type="button"
        onClick={onRoleToggle}
        className="min-h-[38px] px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#E8E7FC] text-[#4338CA] hover:bg-[#D8DDEC] transition-colors flex items-center gap-1 cursor-pointer"
        aria-label={`Beralih ke mode ${activeRole === 'STUDENT' ? 'Klien' : 'Freelancer'}`}
      >
        <span>{activeRole === 'STUDENT' ? '🎓 Freelancer' : '💼 Klien'}</span>
      </button>

      <button
        type="button"
        aria-label="Notifikasi"
        className="flex h-10 w-10 min-h-[38px] min-w-[38px] items-center justify-center rounded-full hover:bg-[#E8E7FC] transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4338CA"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    </div>
  );
};

export default NavbarMobileActions;

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';

export interface RoleContextType {
  /** Peran aktif saat ini: STUDENT (Freelancer) atau CLIENT (Pemberi Proyek) */
  activeRole: Role;
  /** Mengatur peran aktif */
  setActiveRole: (role: Role) => void;
  /** Beralih peran antara STUDENT dan CLIENT */
  toggleRole: () => void;
  /** Status verifikasi mahasiswa via HMAC OTP kampus */
  isVerifiedStudent: boolean;
  /** Memperbarui status verifikasi */
  setIsVerifiedStudent: (verified: boolean) => void;
  /** Data profil pengguna aktif */
  currentUser: User;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<Role>('STUDENT');
  const [isVerifiedStudent, setIsVerifiedStudent] = useState<boolean>(
    mockCurrentUser.isVerifiedStudent
  );
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
  };

  const toggleRole = () => {
    setActiveRoleState((prev) => (prev === 'STUDENT' ? 'CLIENT' : 'STUDENT'));
  };

  useEffect(() => {
    setCurrentUser((prev) => ({
      ...prev,
      activeRole,
      isVerifiedStudent,
    }));
  }, [activeRole, isVerifiedStudent]);

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        setActiveRole,
        toggleRole,
        isVerifiedStudent,
        setIsVerifiedStudent,
        currentUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export default RoleContext;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { GlassCard } from '@/components/ui/GlassCard';

export interface ProfileHeaderCardProps {
  user: User;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ user: initialUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialUser.bio);
  const [skills, setSkills] = useState(initialUser.skills.join(', '));
  const [activeUser, setActiveUser] = useState(initialUser);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setActiveUser((prev) => ({
      ...prev,
      bio,
      skills: parsedSkills,
    }));

    setIsEditing(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const handleCancel = () => {
    setBio(activeUser.bio);
    setSkills(activeUser.skills.join(', '));
    setIsEditing(false);
  };

  return (
    <GlassCard className="p-6 sm:p-8 rounded-[24px] flex flex-col gap-6 bg-white/70 shadow-xs">
      {saveNotice && (
        <div className="w-full p-3.5 rounded-[16px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <span>✓ Informasi profil berhasil diperbarui!</span>
        </div>
      )}

      {/* Profile Header Avatar & Identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Avatar
          initials="ID"
          src={activeUser.avatarUrl}
          alt={activeUser.name}
          size="xl"
          verified={activeUser.isVerifiedStudent}
        />
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              {activeUser.name}
            </h1>
            {activeUser.isVerifiedStudent && (
              <VerifiedBadge size="sm" label="Verified Student" />
            )}
          </div>
          <p className="text-sm font-medium text-[#475569]">
            {activeUser.major} · {activeUser.campusName}
          </p>
          <p className="text-xs text-[#475569]">
            NIM: <span className="font-semibold text-[#0F172A]">{activeUser.studentId}</span> · {activeUser.email}
          </p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-bio" className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Tentang Mahasiswa (Bio)
            </label>
            <textarea
              id="edit-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 text-xs rounded-[14px] bg-white border border-[#D8DDEC] text-[#0F172A] focus:border-[#4338CA] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-skills" className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Keahlian & Kejuruan (Pisahkan dengan koma)
            </label>
            <input
              id="edit-skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-[14px] bg-white border border-[#D8DDEC] text-[#0F172A] focus:border-[#4338CA] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="min-h-[44px] px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="min-h-[44px] px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#475569] text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Bio */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Tentang Mahasiswa
            </h2>
            <p className="text-sm text-[#0F172A] leading-relaxed">
              {activeUser.bio}
            </p>
          </div>

          {/* Skills & Badges */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Keahlian & Kejuruan
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {activeUser.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full bg-[#E8E7FC] text-[#4338CA] text-xs font-semibold leading-none"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="min-h-[44px] px-5 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Edit Informasi Profil
            </button>
            <Link
              href="/services"
              className="min-h-[44px] px-5 rounded-full bg-white border border-[#D8DDEC] hover:bg-slate-50 text-[#0F172A] text-xs font-semibold inline-flex items-center justify-center transition-colors shadow-2xs"
            >
              + Tambah Jasa Baru
            </Link>
          </div>
        </>
      )}
    </GlassCard>
  );
};

export default ProfileHeaderCard;

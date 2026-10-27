'use client';

import React, { useState, useActionState, useId } from 'react';
import Link from 'next/link';
import { registerAction } from '@/app/(auth)/actions';

/**
 * RegisterForm (Client Component)
 *
 * Mengimplementasikan formulir registrasi sesuai desain Figma Node 11:605 & 11:552:
 * - Field: Nama Lengkap, Email, Password, Konfirmasi Password
 * - Komponen Password Strength Meter reaktif (4 bar visual bergradasi)
 * - State toggle intip password
 * - Integrasi React 19 useActionState & Server Action registerAction
 * - Kepatuhan aksesibilitas ARIA inklusif
 */
export function RegisterForm() {
  const [status, formAction, isPending] = useActionState(registerAction, {});
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kalkulasi Kekuatan Kata Sandi (Password Strength Calculator)
  const calculateStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Masukkan kata sandi', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Lemah — gunakan minimal 8 karakter', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Cukup — padukan huruf & angka', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Kuat — tambahkan simbol khusus', color: 'bg-indigo-600' };
      case 4:
        return { score: 4, label: 'Sangat Kuat — proteksi maksimal', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'Masukkan kata sandi', color: 'bg-slate-200' };
    }
  };

  const strength = calculateStrength(password);
  const strengthId = useId();

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full">
      {/* Pesan Kesalahan Global */}
      {status.pesan && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-[16px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in"
        >
          <svg
            className="w-4 h-4 text-rose-500 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{status.pesan}</span>
        </div>
      )}

      {/* Field 1: Nama Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="text-xs font-bold text-[#0F172A]">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          defaultValue={status.nilai?.fullName}
          aria-invalid={!!status.galat?.fullName}
          aria-describedby={status.galat?.fullName ? 'galat-fullName' : undefined}
          placeholder="Sesuai KTM atau KTP resmi"
          className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
            status.galat?.fullName
              ? 'border-red-500 ring-1 ring-red-400'
              : 'border-[#D8DDF0]'
          } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
        />
        {status.galat?.fullName?.[0] && (
          <p id="galat-fullName" className="text-xs text-rose-500 font-medium mt-1">
            {status.galat.fullName[0]}
          </p>
        )}
      </div>

      {/* Field 2: Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-xs font-bold text-[#0F172A]">
          Email Institusi / Pribadi <span className="text-red-500">*</span>
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={status.nilai?.email}
          aria-invalid={!!status.galat?.email}
          aria-describedby={status.galat?.email ? 'galat-reg-email' : undefined}
          placeholder="nama@student.universitaspertamina.ac.id"
          className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
            status.galat?.email
              ? 'border-red-500 ring-1 ring-red-400'
              : 'border-[#D8DDF0]'
          } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
        />
        <p className="text-[11px] text-[#78859D]">
          Gunakan domain <strong className="text-[#4338CA]">.ac.id</strong> untuk otomatis mendapatkan akses terverifikasi mahasiswa.
        </p>
        {status.galat?.email?.[0] && (
          <p id="galat-reg-email" className="text-xs text-rose-500 font-medium mt-0.5">
            {status.galat.email[0]}
          </p>
        )}
      </div>

      {/* Field 3: Kata Sandi */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-password" className="text-xs font-bold text-[#0F172A]">
          Kata Sandi <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="reg-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!status.galat?.password}
            aria-describedby={`${strengthId} ${status.galat?.password ? 'galat-reg-password' : ''}`}
            placeholder="Minimal 8 karakter"
            className={`w-full px-4 py-3 pr-11 rounded-[16px] bg-white border ${
              status.galat?.password
                ? 'border-red-500 ring-1 ring-red-400'
                : 'border-[#D8DDF0]'
            } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {/* Password Strength Meter (Figma Spec) */}
        <div id={strengthId} className="flex flex-col gap-1.5 pt-1">
          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${
                  strength.score >= step ? strength.color : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#78859D]">
            <span>Kekuatan sandi: <strong className="text-[#0F172A]">{strength.label}</strong></span>
            <span className="font-semibold text-[#4338CA]">{strength.score}/4</span>
          </div>
        </div>

        {status.galat?.password?.[0] && (
          <p id="galat-reg-password" className="text-xs text-rose-500 font-medium mt-0.5">
            {status.galat.password[0]}
          </p>
        )}
      </div>

      {/* Field 4: Konfirmasi Kata Sandi */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-xs font-bold text-[#0F172A]">
          Ulangi Kata Sandi <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={!!status.galat?.confirmPassword}
            aria-describedby={status.galat?.confirmPassword ? 'galat-confirmPassword' : undefined}
            placeholder="Ketik ulang kata sandi persis sama"
            className={`w-full px-4 py-3 pr-11 rounded-[16px] bg-white border ${
              status.galat?.confirmPassword
                ? 'border-red-500 ring-1 ring-red-400'
                : 'border-[#D8DDF0]'
            } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
          >
            {showConfirmPassword ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {status.galat?.confirmPassword?.[0] && (
          <p id="galat-confirmPassword" className="text-xs text-rose-500 font-medium mt-1">
            {status.galat.confirmPassword[0]}
          </p>
        )}
      </div>

      {/* Tombol Submit Pendaftaran */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full min-h-[48px] px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-xs inline-flex items-center justify-center shadow-md transition-all disabled:opacity-50 cursor-pointer mt-2"
      >
        {isPending ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru'}
      </button>

      {/* Footer Navigasi ke Login */}
      <div className="text-center text-xs text-[#78859D] pt-2">
        Sudah memiliki akun?{' '}
        <Link
          href="/login"
          className="font-bold text-[#4338CA] hover:text-[#3730A3] transition-colors"
        >
          Masuk di sini
        </Link>
      </div>
    </form>
  );
}

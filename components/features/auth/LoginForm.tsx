'use client';

import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/(auth)/actions';

/**
 * LoginForm (Client Component)
 *
 * Mengimplementasikan formulir masuk sesuai desain Figma Node 11:644:
 * - State toggle intip password
 * - Integrasi React 19 useActionState & Server Action loginAction
 * - Aksesibilitas inklusif (ARIA invalid & describedby)
 * - Pemisahan opsi masuk mandiri vs verifikasi email kampus
 */
export function LoginForm() {
  const [status, formAction, isPending] = useActionState(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5 w-full">
      {/* Pesan Kesalahan Global Server */}
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

      {/* Field: Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-bold text-[#0F172A]">
          Email Klien atau Mahasiswa <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={status.nilai?.email ?? 'klien@pertamina.ac.id'}
            aria-invalid={!!status.galat?.email}
            aria-describedby={status.galat?.email ? 'galat-email' : undefined}
            placeholder="nama@pertamina.ac.id"
            className={`w-full px-4 py-3 rounded-[16px] bg-white border ${
              status.galat?.email
                ? 'border-red-500 ring-1 ring-red-400'
                : 'border-[#D8DDF0]'
            } text-sm text-[#0F172A] focus:outline-none focus:border-[#4338CA] transition-colors`}
          />
        </div>
        {status.galat?.email?.[0] && (
          <p id="galat-email" className="text-xs text-rose-500 font-medium mt-1">
            {status.galat.email[0]}
          </p>
        )}
      </div>

      {/* Field: Kata Sandi */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-bold text-[#0F172A]">
            Kata Sandi <span className="text-red-500">*</span>
          </label>
          <a
            href="#lupa-kata-sandi"
            onClick={(e) => {
              e.preventDefault();
              alert(
                'Fitur pemulihan kata sandi demo: Silakan gunakan kredensial demo praktikum atau daftar akun baru.'
              );
            }}
            className="text-xs font-semibold text-[#4338CA] hover:text-[#3730A3] transition-colors"
          >
            Lupa kata sandi?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            defaultValue="KlienPertamina2026!"
            aria-invalid={!!status.galat?.password}
            aria-describedby={status.galat?.password ? 'galat-password' : undefined}
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
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {status.galat?.password?.[0] && (
          <p id="galat-password" className="text-xs text-rose-500 font-medium mt-1">
            {status.galat.password[0]}
          </p>
        )}
      </div>

      {/* Tombol Masuk Utama */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full min-h-[48px] px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-xs inline-flex items-center justify-center shadow-md transition-all disabled:opacity-50 cursor-pointer"
      >
        {isPending ? 'Memproses Masuk...' : 'Masuk ke Akun'}
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-[#D8DDF0] w-full" />
        <span className="bg-white px-3 text-[11px] font-medium text-[#78859D] uppercase tracking-wider shrink-0">
          atau gunakan akun institusi
        </span>
      </div>

      {/* Tombol Masuk Email Kampus */}
      <Link
        href="/auth/verify-student"
        className="w-full min-h-[46px] px-4 rounded-full bg-slate-50 hover:bg-slate-100 border border-[#D8DDEC] text-[#0F172A] font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
      >
        <span>🎓</span>
        <span>Masuk dengan Email Kampus (@student.universitaspertamina.ac.id)</span>
      </Link>

      {/* Footer Navigasi ke Register */}
      <div className="text-center text-xs text-[#78859D] pt-2">
        Belum memiliki akun?{' '}
        <Link
          href="/register"
          className="font-bold text-[#4338CA] hover:text-[#3730A3] transition-colors"
        >
          Daftar sekarang
        </Link>
      </div>

      {/* Catatan Bantuan Akun Demo */}
      <div className="p-3.5 rounded-[16px] bg-[#F8FAFC] border border-slate-200 text-xs text-[#475569] flex flex-col gap-1.5 mt-1">
        <span className="font-bold text-[#0F172A]">Kredensial Demo Praktikum:</span>
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-700">1. Akun Klien:</span>
          <span className="pl-2">Email: <code className="text-[#4338CA] font-semibold">klien@pertamina.ac.id</code> | Sandi: <code className="text-[#4338CA] font-semibold">KlienPertamina2026!</code></span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-700">2. Akun Mahasiswa:</span>
          <span className="pl-2">Email: <code className="text-[#4338CA] font-semibold">nadia.putri@student.universitaspertamina.ac.id</code> | Sandi: <code className="text-[#4338CA] font-semibold">Nadia2026!</code></span>
        </div>
      </div>
    </form>
  );
}

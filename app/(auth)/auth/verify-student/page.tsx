'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { mockCurrentUser } from '@/lib/mockData';

function VerifyStudentContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper handling OTP Input Focus Next Box
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Step 1: Request OTP Email Kampus Validation
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('.ac.id')) {
      setError('Email harus menggunakan domain kampus resmi berakhiran .ac.id (misal: @universitaspertamina.ac.id)');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  // Step 2: Verify 6-Digit OTP Token (Mock Static Validation: '123456')
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Masukkan 6-digit kode OTP lengkap.');
      return;
    }

    if (attemptsLeft <= 1) {
      setError('Batas percobaan habis. Silakan minta kode OTP baru.');
      setAttemptsLeft(0);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      if (fullOtp === '123456') {
        setStep(3); // Verified Success
      } else {
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        setError(`Kode OTP salah! Sisa percobaan: ${remaining} kali. (Petunjuk demo: gunakan '123456')`);
      }
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 space-y-8">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
          Verifikasi Identitas Mahasiswa
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Dapatkan lencana <span className="font-bold text-[var(--color-teal)]">Verified Student</span> untuk mengakses proyek eksklusif kampus.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-xl)] space-y-6 shadow-xl border border-white/50">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-bold border-b border-[var(--color-border)] pb-4">
          <span className={step >= 1 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
            1. Email Kampus
          </span>
          <span className="text-gray-300">•</span>
          <span className={step >= 2 ? 'text-[var(--color-primary)]' : 'text-gray-400'}>
            2. Token OTP
          </span>
          <span className="text-gray-300">•</span>
          <span className={step === 3 ? 'text-[var(--color-teal)]' : 'text-gray-400'}>
            3. Terverifikasi
          </span>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-[var(--radius-md)] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: FORM EMAIL KAMPUS */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="campus-email" className="block text-xs font-bold text-[var(--color-text-primary)]">
                Email Kampus Resmi (.ac.id) <span className="text-red-500">*</span>
              </label>
              <input
                id="campus-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@universitaspertamina.ac.id"
                className="glass-input w-full px-3.5 py-2.5 text-xs rounded-[var(--radius-md)]"
              />
              <p className="text-[0.688rem] text-[var(--color-text-muted)]">
                Sistem akan mengirorkan token OTP 6-digit ke email universitas Anda.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs rounded-[var(--radius-pill)] transition-all shadow-md cursor-pointer"
            >
              {isLoading ? 'Mengirim Token OTP...' : 'Kirim Kode OTP Verifikasi'}
            </button>
          </form>
        )}

        {/* STEP 2: FORM 6-DIGIT OTP TOKEN */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2 text-center">
              <label className="block text-xs font-bold text-[var(--color-text-primary)]">
                Masukkan 6-Digit Kode OTP
              </label>
              <p className="text-[0.75rem] text-[var(--color-text-muted)]">
                Kode dikirim ke <span className="font-bold text-[var(--color-text-primary)]">{email}</span>
              </p>

              {/* 6 Digit Individual Input Boxes */}
              <div className="flex justify-center gap-2 pt-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-10 h-12 text-center font-extrabold text-lg glass-input rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || attemptsLeft === 0}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-xs rounded-[var(--radius-pill)] transition-all shadow-md cursor-pointer disabled:bg-gray-300"
            >
              {isLoading ? 'Memverifikasi Kode...' : 'Verifikasi OTP'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[var(--color-text-muted)] underline hover:text-[var(--color-text-primary)]"
              >
                Ganti Email Kampus
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS VERIFIED STATE */}
        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <VerifiedBadge size="md" campusDomain="universitaspertamina.ac.id" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                Selamat! Identitas Mahasiswa Terverifikasi
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Akun Anda sekarang memiliki akses penuh untuk mengajukan proposal pada proyek eksklusif kampus.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/projects"
                className="inline-block px-6 py-2.5 bg-brand-gradient text-white font-bold text-xs rounded-[var(--radius-pill)] shadow-md hover:opacity-90 transition-opacity"
              >
                Eksplorasi Proyek Kampus
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyStudentPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl py-16 text-center text-xs font-bold text-[var(--color-text-muted)]">
          Memuat Halaman Verifikasi...
        </div>
      }
    >
      <VerifyStudentContent />
    </Suspense>
  );
}
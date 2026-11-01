'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { useRole } from '@/contexts/RoleContext';
import {
  requestVerificationToken,
  verifyStudentTokenAction,
} from '@/app/actions/verifyStudent';

export function VerifyStudentWizard() {
  const { currentUser, setIsVerifiedStudent } = useRole();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState(currentUser?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string>('');
  const [tokenPreview, setTokenPreview] = useState<string>('');

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

  // Step 1: Request OTP Email Kampus Validation via Server Action
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('.ac.id')) {
      setError(
        'Email harus menggunakan domain kampus resmi berakhiran .ac.id (misal: @student.universitaspertamina.ac.id)'
      );
      return;
    }

    setIsLoading(true);
    try {
      const studentId = currentUser.studentId || '105224029';
      const result = await requestVerificationToken(email, studentId);
      if (result.success) {
        setDemoOtp(result.demoOtp || '');
        setTokenPreview(result.tokenPreview || '');
        setStep(2);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Terjadi kendala saat menghubungi server verifikasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 6-Digit OTP Token via Server Action (HMAC-SHA256 Cryptographic Check)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      setError('Silakan masukkan 6 digit token verifikasi secara lengkap.');
      return;
    }

    setIsLoading(true);
    try {
      const studentId = currentUser.studentId || '105224029';
      const result = await verifyStudentTokenAction(email, studentId, fullOtp);
      if (result.success) {
        setIsVerifiedStudent(true);
        setStep(3);
      } else {
        setError(result.message);
        setAttemptsLeft((prev) => Math.max(0, prev - 1));
      }
    } catch {
      setError('Terjadi kendala saat memverifikasi token OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-xl)] space-y-6">
        
        {/* Step Indicator Header */}
        <div className="space-y-2 text-center">
          <span className="text-[0.75rem] font-bold text-[var(--color-primary)] uppercase tracking-wider">
            Langkah {step} dari 3 — Verifikasi Kampus
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            Validasi Status Mahasiswa Aktif
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
            Gunakan email resmi berakhiran <strong>.ac.id</strong> untuk mendapatkan lencana <em>Verified Student</em> dan akses proyek eksklusif kampus.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 bg-[var(--color-danger-bg)] border border-[rgba(235,0,20,0.3)] text-[var(--color-crimson)] text-xs rounded-[var(--radius-md)] leading-relaxed"
          >
            {error}
          </div>
        )}

        {/* STEP 1: INPUT EMAIL FORM */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="student-email" className="text-xs font-bold text-[var(--color-text-primary)]">
                Alamat Email Kampus (.ac.id)
              </label>
              <input
                id="student-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.mahasiswa@student.universitaspertamina.ac.id"
                className="w-full px-3.5 py-2.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <span className="text-[0.7rem] text-[var(--color-text-muted)]">
                Email ini diverifikasi melalui simulasi pengiriman token CSPRNG 6-digit.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-gradient text-white font-bold text-xs rounded-[var(--radius-pill)] shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
            >
              {isLoading ? 'Mengirim Token OTP...' : 'Kirim Kode Verifikasi OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION FORM */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-2 text-center">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Kode 6-digit OTP telah dikirimkan ke:
              </span>
              <p className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--color-surface-soft)] py-1 px-3 rounded-full inline-block border border-[var(--color-border)]">
                {email}
              </p>
            </div>

            {/* Sandbox Simulation Note for Reviewers/Demonstrations */}
            {demoOtp && (
              <div className="p-3 bg-[var(--color-warning-bg)] border border-[rgba(245,160,0,0.3)] rounded-[var(--radius-md)] text-[0.7rem] text-[var(--color-text-primary)] space-y-1">
                <p className="font-bold text-[var(--color-amber)]">
                  Mode Evaluasi Akademik (Tugas Kriptografi & PAW):
                </p>
                <p>
                  Token OTP CSPRNG yang dibuat server:{' '}
                  <strong className="font-mono text-xs text-[var(--color-primary)] bg-white px-1.5 py-0.5 rounded border">
                    {demoOtp}
                  </strong>
                </p>
                {tokenPreview && (
                  <p className="font-mono text-[0.65rem] text-[var(--color-text-muted)] truncate">
                    HMAC Hash Token: {tokenPreview}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--color-text-primary)] block text-center">
                Masukkan 6-Digit Kode Verifikasi
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-base sm:text-lg bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center text-[0.7rem] text-[var(--color-text-muted)] pt-1">
                <span>Sisa percobaan: <strong>{attemptsLeft} kali</strong></span>
                <span>Kedaluwarsa dalam 15 menit</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading || attemptsLeft <= 0}
                className="w-full py-3 bg-brand-gradient text-white font-bold text-xs rounded-[var(--radius-pill)] shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                {isLoading ? 'Memverifikasi...' : 'Verifikasi & Terbitkan Lencana'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Ganti Alamat Email Kampus
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

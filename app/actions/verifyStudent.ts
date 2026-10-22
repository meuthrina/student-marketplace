'use server';

import {
  generateStudentBadgeToken,
  verifyStudentBadgeToken,
  StudentPayload,
} from '@/lib/crypto/token-verifier';

const SECRET_KEY =
  process.env.STUDENT_VERIFICATION_SECRET || 'studance-dev-hmac-secret-key-2026';

export interface RequestTokenResult {
  success: boolean;
  message: string;
  demoOtp?: string;
  tokenPreview?: string;
  fullToken?: string;
}

export interface VerifyTokenResult {
  success: boolean;
  message: string;
  verifiedToken?: string;
}

/**
 * Server Action: Minta Token OTP HMAC Verifikasi Mahasiswa (Aliran DFD F5 & F6)
 *
 * Menghasilkan token deterministik HMAC-SHA256 di sisi server aman tanpa
 * mengekspos kunci rahasia (SECRET_KEY) maupun modul node:crypto ke browser klien.
 */
export async function requestVerificationToken(
  email: string,
  studentId: string
): Promise<RequestTokenResult> {
  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanStudentId = studentId?.trim() || '105224029';

  if (!cleanEmail.endsWith('.ac.id')) {
    return {
      success: false,
      message:
        'Email harus menggunakan domain resmi institusi kampus berakhiran .ac.id (misal: @student.universitaspertamina.ac.id)',
    };
  }

  const payload: StudentPayload = {
    studentId: cleanStudentId,
    email: cleanEmail,
    campusCode: 'UP',
  };

  const fullHmac = generateStudentBadgeToken(payload, SECRET_KEY);
  // OTP 6-digit deterministik turunan HMAC untuk pengujian form angka 6 kotak
  const numericOtp = (
    (parseInt(fullHmac.slice(0, 8), 16) % 900000) +
    100000
  ).toString();
  const hexSlice = fullHmac.slice(0, 6).toUpperCase();

  return {
    success: true,
    message: `Kode verifikasi OTP HMAC berhasil dikirim ke ${cleanEmail}.`,
    demoOtp: numericOtp,
    tokenPreview: hexSlice,
    fullToken: fullHmac,
  };
}

/**
 * Server Action: Verifikasi Integritas Token OTP Mahasiswa (Aliran DFD F7)
 *
 * Memvalidasi token masukan terhadap tanda tangan kriptografis HMAC-SHA256
 * menggunakan perbandingan timing-safe di sisi server.
 */
export async function verifyStudentTokenAction(
  email: string,
  studentId: string,
  inputToken: string
): Promise<VerifyTokenResult> {
  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanStudentId = studentId?.trim() || '105224029';
  const cleanToken = inputToken?.trim() || '';

  if (!cleanEmail || !cleanToken) {
    return {
      success: false,
      message: 'Data email dan kode token verifikasi wajib diisi.',
    };
  }

  const payload: StudentPayload = {
    studentId: cleanStudentId,
    email: cleanEmail,
    campusCode: 'UP',
  };

  const expectedFullHmac = generateStudentBadgeToken(payload, SECRET_KEY);
  const expectedNumericOtp = (
    (parseInt(expectedFullHmac.slice(0, 8), 16) % 900000) +
    100000
  ).toString();

  // 1. Validasi Full 64-character Hex Token via timingSafeEqual
  if (cleanToken.length === 64) {
    const isValid = verifyStudentBadgeToken(
      payload,
      cleanToken.toLowerCase(),
      SECRET_KEY
    );
    if (isValid) {
      return {
        success: true,
        message: 'Verifikasi tanda tangan kriptografis HMAC-SHA256 berhasil!',
        verifiedToken: cleanToken,
      };
    }
  }

  // 2. Validasi 6-digit numeric OTP atau 6-char hex prefix
  if (
    cleanToken === expectedNumericOtp ||
    cleanToken.toUpperCase() === expectedFullHmac.slice(0, 6).toUpperCase()
  ) {
    return {
      success: true,
      message:
        'Verifikasi berhasil! Akun Anda kini resmi berstatus Verified Student.',
      verifiedToken: expectedFullHmac,
    };
  }

  return {
    success: false,
    message: 'Kode token OTP salah atau tidak cocok dengan data mahasiswa Anda.',
  };
}

import { createHmac, timingSafeEqual } from 'crypto';

export interface StudentPayload {
  studentId: string;
  email: string;
  campusCode: string;
}

/**
 * Menghasilkan HMAC-SHA256 token deterministik untuk Lencana Mahasiswa
 */
export function generateStudentBadgeToken(payload: StudentPayload, secretKey: string): string {
  // Kanonisasi payload agar konsisten (Vektor Uji)
  const canonicalData = `campus:${payload.campusCode}|email:${payload.email.toLowerCase()}|id:${payload.studentId}`;
  return createHmac('sha256', secretKey).update(canonicalData).digest('hex');
}

/**
 * Memverifikasi token HMAC menggunakan perbandingan timing-safe
 */
export function verifyStudentBadgeToken(payload: StudentPayload, tokenToVerify: string, secretKey: string): boolean {
  const expectedToken = generateStudentBadgeToken(payload, secretKey);
  const expectedBuffer = Buffer.from(expectedToken, 'hex');
  const actualBuffer = Buffer.from(tokenToVerify, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }
  return timingSafeEqual(expectedBuffer, actualBuffer);
}
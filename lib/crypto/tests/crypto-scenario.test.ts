import assert from 'node:assert';
import { generateStudentBadgeToken, verifyStudentBadgeToken } from '../token-verifier';
import { calculateDocumentHash, verifyDocumentIntegrity } from '../document-signer';

console.log('\n================================================================');
console.log('  Tugas 1 Kriptografi - Pengujian Skenario & Threat Model Integration');
console.log('================================================================\n');

const SECRET_KEY = 'super-secret-universitas-pertamina-key';

try {
  // ----------------------------------------------------------------
  // Skenario U-10A (Vektor Uji Kripto - Deterministic HMAC-SHA256)
  // ----------------------------------------------------------------
  console.log('Running [U-10A]: Vektor Uji HMAC-SHA256 Token Lencana Mahasiswa (T-10)...');
  const payload1 = { studentId: '105224029', email: 'student@student.universitaspertamina.ac.id', campusCode: 'UP' };
  const payload2 = { studentId: '105224029', email: 'STUDENT@student.universitaspertamina.ac.id', campusCode: 'UP' };

  const token1 = generateStudentBadgeToken(payload1, SECRET_KEY);
  const token2 = generateStudentBadgeToken(payload2, SECRET_KEY);

  assert.strictEqual(token1, token2, 'Token HMAC harus identik presisi untuk payload kanonis!');
  assert.strictEqual(token1.length, 64, 'Panjang hash SHA-256 harus 64 karakter hex!');
  console.log('  [PASS] U-10A: Token deterministik & kanonis terverifikasi!\n');

  // ----------------------------------------------------------------
  // Skenario U-10B (Negatif - Key/Payload Tampering)
  // ----------------------------------------------------------------
  console.log('Running [U-10B]: Penolakan Token Lencana Mahasiswa yang Dimanipulasi (T-10)...');
  const payload = { studentId: '105224029', email: 'student@student.universitaspertamina.ac.id', campusCode: 'UP' };
  const validToken = generateStudentBadgeToken(payload, SECRET_KEY);

  const isValidWithWrongKey = verifyStudentBadgeToken(payload, validToken, 'wrong-secret-key');
  assert.strictEqual(isValidWithWrongKey, false, 'Harus menolak jika secret key salah!');

  const tamperedPayload = { ...payload, studentId: '105224099' };
  const isValidWithTamperedData = verifyStudentBadgeToken(tamperedPayload, validToken, SECRET_KEY);
  assert.strictEqual(isValidWithTamperedData, false, 'Harus menolak jika payload dimanipulasi!');
  console.log('  [PASS] U-10B: Deteksi manipulasi token berhasil!\n');

  // ----------------------------------------------------------------
  // Skenario U-12 (Positif & Negatif Integritas Berkas Proyek)
  // ----------------------------------------------------------------
  console.log('Running [U-12]: Verifikasi Integritas Dokumen & Hash SHA-256 Digest (T-10)...');
  const mockFileContent = Buffer.from('Laporan Pengerjaan Proyek Student Marketplace - 100% Selesai');
  const tamperedFileContent = Buffer.from('Laporan Pengerjaan Proyek Student Marketplace - 000% Selesai');
  
  const originalHash = calculateDocumentHash(mockFileContent);

  assert.strictEqual(verifyDocumentIntegrity(mockFileContent, originalHash), true, 'Dokumen asli harus valid!');
  assert.strictEqual(verifyDocumentIntegrity(tamperedFileContent, originalHash), false, 'Dokumen ter-tamper harus ditolak!');
  console.log('  [PASS] U-12: Integrity check & Hash Digest terverifikasi!\n');

  // ----------------------------------------------------------------
  // Skenario K-01 (Batasan Sistem / Limitation)
  // ----------------------------------------------------------------
  console.log('Running [K-01]: Dokumentasi Keterbatasan Sistem Tanpa PKI Terpusat (T-04/Limitation)...');
  const originalFileData = Buffer.from('Dokumen Asli Laporan');
  const hashAsli = calculateDocumentHash(originalFileData);

  const modifiedFileData = Buffer.from('Dokumen Palsu Laporan');
  const recomputedHash = calculateDocumentHash(modifiedFileData);

  assert.strictEqual(verifyDocumentIntegrity(modifiedFileData, recomputedHash), true, 'Hash baru cocok dengan file baru');
  assert.notStrictEqual(recomputedHash, hashAsli, 'Hash baru tidak sama dengan hash asli');
  console.log('  [PASS] K-01: Dokumentasi batasan re-computation terkonfirmasi!\n');

  console.log('================================================================');
  console.log('  HASIL: 4 DARI 4 SKENARIO UJI KRIPTOGRAFI LULUS (100% PASS)');
  console.log('================================================================\n');

} catch (error) {
  console.error('\n  [FAIL] Skenario Uji Gagal:', error);
  process.exit(1);
}
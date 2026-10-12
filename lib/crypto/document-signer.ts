import { createHash, createSign, createVerify } from 'crypto';

/**
 * Menghitung SHA-256 Hash Digest dari dokumen/file pengerjaan proyek
 */
export function calculateDocumentHash(fileBuffer: Buffer): string {
  return createHash('sha256').update(fileBuffer).digest('hex');
}

/**
 * Memverifikasi integritas dokumen pengerjaan proyek berdasarkan Hash SHA-256
 */
export function verifyDocumentIntegrity(fileBuffer: Buffer, expectedHash: string): boolean {
  const actualHash = calculateDocumentHash(fileBuffer);
  return actualHash === expectedHash;
}
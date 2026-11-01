import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * Modul Enkripsi Simetris Berbasis AES-256-GCM (NIST SP 800-38D)
 * Platform: Studance (Student Freelance Marketplace)
 * Mata Kuliah: Kriptografi (Sub-CPMK 1, 2, 3 - Pekan 4)
 */

export const ALGORITHM = 'aes-256-gcm';
export const NONCE_LENGTH = 12; // 96-bit Initial Vector / Nonce per NIST SP 800-38D
export const TAG_LENGTH = 16;   // 128-bit Authentication Tag (GHASH)
export const KEY_LENGTH = 32;   // 256-bit Key Length (AES-256)

/**
 * Membangkitkan kunci simetris 256-bit (32 byte) menggunakan CSPRNG sistem operasi (CSPRNG).
 */
export function generateSymmetricKey(): Buffer {
  return randomBytes(KEY_LENGTH);
}

/**
 * Mengenkrpsi plaintext menggunakan mode AES-256-GCM (Authenticated Encryption with Associated Data / AEAD).
 *
 * @param key Kunci simetris 32 byte (256-bit)
 * @param plaintext Plaintext berupa Buffer atau string
 * @param aad Additional Authenticated Data opsional (data konteks yang diverifikasi integritasnya tanpa dienkripsi)
 * @returns Buffer paket terpadu berurutan: [Nonce (12B) || Ciphertext (N B) || AuthTag (16B)]
 */
export function encryptPayload(
  key: Buffer,
  plaintext: Buffer | string,
  aad?: Buffer | string
): Buffer {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new Error(
      `InvalidKeyLength: Panjang kunci simetris wajib ${KEY_LENGTH} byte (256 bit), diterima: ${key ? key.length : 0} byte`
    );
  }

  // Bangkitkan 96-bit nonce unik menggunakan CSPRNG
  const nonce = randomBytes(NONCE_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, nonce);

  // Sematkan AAD jika disertakan
  if (aad !== undefined) {
    const aadBuffer = Buffer.isBuffer(aad) ? aad : Buffer.from(aad, 'utf-8');
    cipher.setAAD(aadBuffer);
  }

  const plaintextBuffer = Buffer.isBuffer(plaintext)
    ? plaintext
    : Buffer.from(plaintext, 'utf-8');

  const ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Susun paket terpadu: [Nonce (12B) || Ciphertext || AuthTag (16B)]
  return Buffer.concat([nonce, ciphertext, authTag]);
}

/**
 * Mendekripsi paket terpadu dan memverifikasi integritas autentikasi AES-256-GCM.
 * Menerapkan prinsip fail-closed: jika ada modifikasi 1 bit saja pada nonce, ciphertext,
 * authTag, atau AAD, fungsi akan langsung menggagalkan operasi dan melempar error deskriptif.
 *
 * @param key Kunci simetris 32 byte (256-bit)
 * @param encryptedPackage Buffer paket terpadu [Nonce (12B) || Ciphertext || AuthTag (16B)]
 * @param aad Additional Authenticated Data yang wajib identik dengan saat proses enkripsi
 * @returns Buffer plaintext asli yang telah didekripsi
 */
export function decryptPayload(
  key: Buffer,
  encryptedPackage: Buffer,
  aad?: Buffer | string
): Buffer {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new Error(
      `InvalidKeyLength: Panjang kunci simetris wajib ${KEY_LENGTH} byte (256 bit), diterima: ${key ? key.length : 0} byte`
    );
  }

  const minPackageLength = NONCE_LENGTH + TAG_LENGTH;
  if (!Buffer.isBuffer(encryptedPackage) || encryptedPackage.length < minPackageLength) {
    throw new Error(
      `InvalidPayloadLength: Paket terenkripsi tidak valid, panjang minimal ${minPackageLength} byte (Nonce ${NONCE_LENGTH}B + Tag ${TAG_LENGTH}B)`
    );
  }

  // Ekstrak komponen paket terpadu
  const nonce = encryptedPackage.subarray(0, NONCE_LENGTH);
  const authTag = encryptedPackage.subarray(encryptedPackage.length - TAG_LENGTH);
  const ciphertext = encryptedPackage.subarray(NONCE_LENGTH, encryptedPackage.length - TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, nonce);
  decipher.setAuthTag(authTag);

  if (aad !== undefined) {
    const aadBuffer = Buffer.isBuffer(aad) ? aad : Buffer.from(aad, 'utf-8');
    decipher.setAAD(aadBuffer);
  }

  try {
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext;
  } catch (error: any) {
    // Fail-closed security principle: tolak seketika jika autentikasi tag gagal
    throw new Error('InvalidTag: Autentikasi integritas data gagal', { cause: error });
  }
}

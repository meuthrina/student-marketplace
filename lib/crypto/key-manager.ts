import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomBytes, hkdfSync } from 'node:crypto';

/**
 * Modul Manajemen Kunci Kriptografi & HKDF (RFC 5869)
 * Platform: Studance (Student Freelance Marketplace)
 * Mata Kuliah: Kriptografi (Materi Pekan 5 & 6 - Sub-CPMK 3: K3 Rubrik R2)
 */

export const MASTER_KEY_ENV = 'STUDANCE_MASTER_KEY';
export const DEFAULT_KEY_PATH = path.join(os.homedir(), '.studance', 'master.key');
export const KEY_LENGTH = 32; // 256-bit

export class KeyManagementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KeyManagementError';
  }
}

/**
 * Memeriksa izin berkas kunci sesuai standar keamanan POSIX (NIST SP 800-57 / slide Pekan 6).
 * Izin berkas wajib tepat 0o600 (hanya owner read/write, dilarang diakses oleh group/other).
 */
export function checkFilePermissions(mode: number): void {
  if ((mode & 0o077) !== 0) {
    throw new KeyManagementError(
      `InsecureKeyPermissions: Izin berkas kunci terlalu terbuka (mode: 0o${(mode & 0o777).toString(8)}). Izin wajib 0o600 (owner only).`
    );
  }
}

/**
 * Membangkitkan kunci master 256-bit baru dari CSPRNG dan menyimpannya ke berkas di luar repositori.
 * Menggunakan flag O_EXCL ('wx') untuk mencegah penimpaan kunci yang telah ada secara tidak sengaja.
 *
 * @param targetPath Path berkas tujuan penyimpanan (default: ~/.studance/master.key)
 * @returns Path lengkap tempat kunci disimpan
 */
export function generateAndSaveMasterKey(targetPath?: string): string {
  const destination = targetPath ?? DEFAULT_KEY_PATH;
  const dir = path.dirname(destination);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  // Bangkitkan 32 byte acak dari CSPRNG sistem operasi
  const masterKey = randomBytes(KEY_LENGTH);

  try {
    // Simpan kunci dalam format hex (64 karakter) dengan mode 0o600 dan flag 'wx' (O_CREAT | O_EXCL)
    fs.writeFileSync(destination, masterKey.toString('hex'), {
      encoding: 'ascii',
      mode: 0o600,
      flag: 'wx',
    });
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      throw new KeyManagementError(
        `FileExistsError: Berkas kunci sudah ada di '${destination}'. Operasi dibatalkan demi mencegah penimpaan kunci.`
      );
    }
    throw new KeyManagementError(`WriteKeyError: Gagal menyimpan berkas kunci master: ${error.message}`);
  }

  return destination;
}

/**
 * Memuat kunci master 256-bit dari berkas penyimpanan lokal atau variabel lingkungan.
 * Menerapkan prinsip fail-closed: jika berkas izin terlalu terbuka (pada POSIX)
 * atau panjang kunci tidak tepat 32 byte, operasi langsung digagalkan.
 *
 * @param keyPath Path berkas kunci opsional
 * @param options Opsi verifikasi tambahan (misal simulasi mode izin pada pengujian)
 * @returns Buffer kunci master 32 byte
 */
export function loadMasterKey(
  keyPath?: string,
  options?: { simulatedMode?: number; forcePermissionCheck?: boolean }
): Buffer {
  let rawContent: string | null = null;
  const resolvedPath = keyPath ?? (fs.existsSync(DEFAULT_KEY_PATH) ? DEFAULT_KEY_PATH : null);

  if (resolvedPath) {
    if (!fs.existsSync(resolvedPath)) {
      throw new KeyManagementError(`KeyFileNotFound: Berkas kunci master tidak ditemukan di '${resolvedPath}'`);
    }

    // Periksa hak akses berkas (mode 0o600 pada POSIX / saat simulasi)
    if (options?.simulatedMode !== undefined) {
      checkFilePermissions(options.simulatedMode);
    } else if (process.platform !== 'win32' || options?.forcePermissionCheck) {
      const stat = fs.statSync(resolvedPath);
      checkFilePermissions(stat.mode);
    }

    try {
      rawContent = fs.readFileSync(resolvedPath, 'ascii').trim();
    } catch (err: any) {
      throw new KeyManagementError(`ReadError: Gagal membaca berkas kunci master: ${err.message}`);
    }
  } else if (process.env[MASTER_KEY_ENV]) {
    rawContent = process.env[MASTER_KEY_ENV]!.trim();
  } else {
    throw new KeyManagementError(
      `KeyNotFound: Kunci master tidak ditemukan pada path default (${DEFAULT_KEY_PATH}) maupun environment variable '${MASTER_KEY_ENV}'`
    );
  }

  // Parse kunci: dukung format hex string (panjang genap) maupun raw binary (32 byte)
  let keyBuffer: Buffer;
  if (/^[0-9a-fA-F]+$/.test(rawContent) && rawContent.length % 2 === 0) {
    keyBuffer = Buffer.from(rawContent, 'hex');
  } else {
    keyBuffer = Buffer.from(rawContent, 'binary');
  }

  // Validasi panjang kunci wajib tepat 32 byte (256-bit)
  if (keyBuffer.length !== KEY_LENGTH) {
    throw new KeyManagementError(
      `InvalidKeyLength: Panjang kunci master tidak valid (${keyBuffer.length} byte). Wajib tepat ${KEY_LENGTH} byte (256-bit).`
    );
  }

  return keyBuffer;
}

/**
 * Menurunkan subkunci kriptografis dari kunci master menggunakan HKDF-SHA256 (RFC 5869).
 * Menegakkan prinsip keamanan "Satu Kunci, Satu Tujuan" (NIST SP 800-57 Part 1 §5.2).
 *
 * @param masterKey Kunci master 32 byte
 * @param contextPurpose Nama tujuan spesifik subkunci (misal: "proposal-encryption", "badge-token")
 * @returns Buffer subkunci 32 byte yang terisolasi secara kriptografis
 */
export function deriveSubKey(masterKey: Buffer, contextPurpose: string): Buffer {
  if (!Buffer.isBuffer(masterKey) || masterKey.length !== KEY_LENGTH) {
    throw new KeyManagementError(
      `InvalidMasterKey: Kunci master wajib berupa Buffer ${KEY_LENGTH} byte`
    );
  }

  if (!contextPurpose || typeof contextPurpose !== 'string') {
    throw new KeyManagementError('InvalidPurpose: Context purpose wajib berupa string non-kosong');
  }

  const info = Buffer.from(`studance:v0.2:${contextPurpose}`, 'utf-8');
  const subKeyArrayBuffer = hkdfSync('sha256', masterKey, Buffer.alloc(0), info, KEY_LENGTH);

  return Buffer.from(subKeyArrayBuffer);
}

import { calculateDocumentHash } from './document-signer';
import { encryptPayload, decryptPayload } from './symmetric';
import { deriveSubKey } from './key-manager';
import { validateAndNormalizeProposalInput } from './input-validator';

/**
 * Adaptor Tingkat Tinggi Proposal Vault
 * Platform: Studance (Student Freelance Marketplace)
 * Menghubungkan Enkripsi Simetris AES-256-GCM (T2), HKDF RFC 5869 (T2),
 * Validasi Masukan Allowlist & Normalisasi NFC (T2),
 * serta Digest Integritas Dokumen SHA-256 (T1).
 */

export interface ProposalSecretPayload {
  studentId: string;
  proyekId: string;
  nominalPenawaran: number;
  durasiHari: number;
  pesanProposal: string;
  attachmentBuffer?: Buffer;
}

export interface UnsealedProposal {
  studentId: string;
  proyekId: string;
  nominalPenawaran: number;
  durasiHari: number;
  pesanProposal: string;
  attachmentHash: string | null;
  sealedAt: string;
}

/**
 * Menyegel (memvalidasi, mengenkripsi, dan mengotentikasi) proposal penawaran mahasiswa.
 * - Memvalidasi masukan di batas kripto menggunakan Strict Allowlist & Unicode NFC (Materi Pekan 6).
 * - Menurunkan subkunci enkripsi spesifik dari masterKey via HKDF-SHA256 RFC 5869 ("Satu Kunci, Satu Tujuan").
 * - Menghitung digest SHA-256 berkas lampiran (Sambungan ke Tugas 1 document-signer).
 * - Mengikat konteks proyek dan identitas mahasiswa via AAD: `proyek:<id>|student:<id>`.
 *
 * @param masterKey Kunci master 32 byte (CSPRNG)
 * @param rawPayload Objek masukan proposal mentah
 * @returns Buffer paket terenkripsi terpadu [Nonce || Ciphertext || AuthTag]
 */
export function sealProposal(masterKey: Buffer, rawPayload: ProposalSecretPayload | any): Buffer {
  // 1. Validasi dan normalisasi masukan di batas sistem (Trust Boundary)
  const payload = validateAndNormalizeProposalInput(rawPayload);

  // 2. Turunkan subkunci enkripsi khusus untuk proposal vault (RFC 5869 HKDF)
  const encryptionKey = deriveSubKey(masterKey, 'proposal-encryption');

  // 3. Hitung SHA-256 hash digest dari lampiran jika ada (Sambungan ke Tugas 1)
  const attachmentHash = payload.attachmentBuffer
    ? calculateDocumentHash(payload.attachmentBuffer)
    : null;

  // 4. Bentuk serialisasi JSON kanonis dari proposal beserta metadata integritas
  const serializedPayload = JSON.stringify({
    studentId: payload.studentId,
    proyekId: payload.proyekId,
    nominalPenawaran: payload.nominalPenawaran,
    durasiHari: payload.durasiHari,
    pesanProposal: payload.pesanProposal,
    attachmentHash,
    sealedAt: new Date().toISOString(),
  });

  // 5. Tentukan AAD yang mengikat konteks proyek dan mahasiswa
  const aad = `proyek:${payload.proyekId}|student:${payload.studentId}`;

  // 6. Enkripsi payload menggunakan subkunci turunan dan kembalikan paket terpadu
  return encryptPayload(encryptionKey, serializedPayload, aad);
}

/**
 * Membuka (mendekripsi dan memverifikasi integritas) proposal mahasiswa yang telah disegel.
 *
 * @param masterKey Kunci master 32 byte
 * @param sealedData Buffer paket terenkripsi
 * @param proyekId ID proyek terkait (bagian dari AAD)
 * @param studentId ID mahasiswa pengaju penawaran (bagian dari AAD)
 * @returns Objek payload proposal yang telah terverifikasi
 */
export function openProposal(
  masterKey: Buffer,
  sealedData: Buffer,
  proyekId: string,
  studentId: string
): UnsealedProposal {
  // 1. Turunkan subkunci enkripsi yang sama via HKDF-SHA256
  const encryptionKey = deriveSubKey(masterKey, 'proposal-encryption');

  // 2. Normalisasikan parameter AAD untuk konsistensi verifikasi
  const normProyekId = (proyekId ?? '').trim().normalize('NFC');
  const normStudentId = (studentId ?? '').trim().normalize('NFC');
  const aad = `proyek:${normProyekId}|student:${normStudentId}`;

  // 3. Dekripsi paket dengan penegakan AAD
  const decryptedBuffer = decryptPayload(encryptionKey, sealedData, aad);

  // 4. Parse hasil dekripsi ke objek JSON
  return JSON.parse(decryptedBuffer.toString('utf-8')) as UnsealedProposal;
}

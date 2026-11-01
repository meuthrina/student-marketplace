import { ProposalSecretPayload } from './proposal-vault';

/**
 * Modul Validasi & Normalisasi Masukan di Batas Kriptografi (Trust Boundary)
 * Platform: Studance (Student Freelance Marketplace)
 * Mematuhi OWASP Input Validation Cheat Sheet & Materi Pekan 6 Kriptografi
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const ALLOWED_PROPOSAL_FIELDS = new Set([
  'studentId',
  'proyekId',
  'nominalPenawaran',
  'durasiHari',
  'pesanProposal',
  'attachmentBuffer',
]);

/**
 * Memvalidasi dan menormalkan masukan proposal di batas sistem (boundary) sebelum
 * diteruskan ke modul kriptografi.
 *
 * Menerapkan prinsip:
 * 1. Strict Allowlist: Menolak objek yang memuat properti tambahan / asing.
 * 2. Normalisasi Unicode: Menyamakan representasi biner teks via Unicode NFC (Normalization Form C).
 * 3. Tipe Ketat & Numerik Aman: Menolak boolean, NaN, Infinity, dan bilangan non-positif.
 * 4. Fail-closed: Melemparkan ValidationError deskriptif seketika saat anomali terdeteksi.
 *
 * @param raw Objek mentah masukan pengguna/klien
 * @returns ProposalSecretPayload yang telah dinormalkan dan aman
 */
export function validateAndNormalizeProposalInput(raw: any): ProposalSecretPayload {
  // 1. Validasi struktur objek dasar
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ValidationError('InvalidInputStructure: Masukan proposal wajib berupa objek JSON terstruktur.');
  }

  // 2. Strict Allowlist: Tolak properti asing di luar skema
  const keys = Object.keys(raw);
  for (const key of keys) {
    if (!ALLOWED_PROPOSAL_FIELDS.has(key)) {
      throw new ValidationError(
        `StrictAllowlistViolation: Properti asing '${key}' ditolak di batas kriptografi.`
      );
    }
  }

  // 3. Validasi & Normalisasi studentId
  if (typeof raw.studentId !== 'string' || raw.studentId.trim().length === 0) {
    throw new ValidationError('InvalidStudentId: studentId wajib berupa string non-kosong.');
  }
  const studentId = raw.studentId.trim().normalize('NFC');

  // 4. Validasi & Normalisasi proyekId
  if (typeof raw.proyekId !== 'string' || raw.proyekId.trim().length === 0) {
    throw new ValidationError('InvalidProyekId: proyekId wajib berupa string non-kosong.');
  }
  const proyekId = raw.proyekId.trim().normalize('NFC');

  // 5. Validasi nominalPenawaran (bilangan bulat positif terhingga, tolak boolean)
  if (
    typeof raw.nominalPenawaran === 'boolean' ||
    typeof raw.nominalPenawaran !== 'number' ||
    Number.isNaN(raw.nominalPenawaran) ||
    !Number.isFinite(raw.nominalPenawaran) ||
    !Number.isInteger(raw.nominalPenawaran) ||
    raw.nominalPenawaran <= 0
  ) {
    throw new ValidationError(
      'InvalidNominalPenawaran: nominalPenawaran wajib berupa bilangan bulat positif terhingga (bukan NaN/Infinity/bool/negatif).'
    );
  }
  const nominalPenawaran = raw.nominalPenawaran;

  // 6. Validasi durasiHari (bilangan bulat positif terhingga, tolak boolean)
  if (
    typeof raw.durasiHari === 'boolean' ||
    typeof raw.durasiHari !== 'number' ||
    Number.isNaN(raw.durasiHari) ||
    !Number.isFinite(raw.durasiHari) ||
    !Number.isInteger(raw.durasiHari) ||
    raw.durasiHari <= 0
  ) {
    throw new ValidationError(
      'InvalidDurasiHari: durasiHari wajib berupa bilangan bulat positif terhingga (bukan NaN/Infinity/bool/negatif).'
    );
  }
  const durasiHari = raw.durasiHari;

  // 7. Validasi & Normalisasi pesanProposal
  if (typeof raw.pesanProposal !== 'string' || raw.pesanProposal.trim().length === 0) {
    throw new ValidationError('InvalidPesanProposal: pesanProposal wajib berupa teks string non-kosong.');
  }
  const pesanProposal = raw.pesanProposal.trim().normalize('NFC');

  // 8. Validasi attachmentBuffer opsional
  let attachmentBuffer: Buffer | undefined = undefined;
  if (raw.attachmentBuffer !== undefined && raw.attachmentBuffer !== null) {
    if (!Buffer.isBuffer(raw.attachmentBuffer)) {
      throw new ValidationError(
        'InvalidAttachmentBuffer: attachmentBuffer wajib berupa instance Buffer biner yang valid.'
      );
    }
    attachmentBuffer = raw.attachmentBuffer;
  }

  // Kembalikan salinan baru (sanitized & normalized copy)
  return {
    studentId,
    proyekId,
    nominalPenawaran,
    durasiHari,
    pesanProposal,
    attachmentBuffer,
  };
}


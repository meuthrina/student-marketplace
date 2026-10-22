export interface ProposalValidationInput {
  bidAmount: string;
  proposalText: string;
  selectedFile?: File | null;
  fileName?: string;
}

export type ProposalErrors = Record<string, string>;

export function validateProposal({
  bidAmount,
  proposalText,
  selectedFile,
  fileName,
}: ProposalValidationInput): ProposalErrors {
  const errors: ProposalErrors = {};
  const amount = Number(bidAmount);

  if (!bidAmount || Number.isNaN(amount) || amount <= 0) {
    errors.bidAmount = 'Biaya harus lebih besar dari 0';
  }

  if (proposalText.length < 20) {
    errors.proposalText = 'Minimal 20 karakter';
  }

  const checkFileName = fileName || selectedFile?.name || '';
  if (checkFileName) {
    const isExe = checkFileName.toLowerCase().endsWith('.exe');
    const isSupported =
      checkFileName.toLowerCase().endsWith('.pdf') ||
      checkFileName.toLowerCase().endsWith('.png') ||
      checkFileName.toLowerCase().endsWith('.jpg') ||
      checkFileName.toLowerCase().endsWith('.jpeg');
    if (isExe || !isSupported) {
      errors.file = `${checkFileName} ditolak. Hanya PDF, PNG, atau JPEG (maksimal 5 MB) yang diperbolehkan.`;
    }
  }

  // Aliran DFD F10: Validasi MIME-type aman di sisi berkas yang diunggah
  if (selectedFile) {
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (selectedFile.type && !allowedMimeTypes.includes(selectedFile.type)) {
      errors.file = `Format MIME berkas '${selectedFile.type}' tidak diizinkan. Wajib application/pdf, image/png, atau image/jpeg.`;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      errors.file = 'Ukuran berkas melebihi batas maksimal 5 MB.';
    }
  }

  return errors;
}

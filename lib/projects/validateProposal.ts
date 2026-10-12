export interface ProposalValidationInput {
  bidAmount: string;
  proposalText: string;
  selectedFile: File | null;
}

export type ProposalErrors = Record<string, string>;

export function validateProposal({
  bidAmount,
  proposalText,
  selectedFile,
}: ProposalValidationInput): ProposalErrors {
  const errors: ProposalErrors = {};
  const amount = Number(bidAmount);

  if (!bidAmount || Number.isNaN(amount) || amount <= 0) {
    errors.bidAmount = 'Biaya harus lebih besar dari 0.';
  }

  if (proposalText.length < 20) {
    errors.proposalText = 'Minimal 20 karakter. Jelaskan pendekatan Anda.';
  }

  if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
    errors.file = 'Ukuran berkas melebihi batas maksimal 5 MB.';
  }

  return errors;
}

'use client';

import { FormEvent, useState } from 'react';
import { ProposalErrors, validateProposal } from '@/lib/projects/validateProposal';

interface UseProposalFormOptions {
  onSuccess: () => void;
}

export function useProposalForm({ onSuccess }: UseProposalFormOptions) {
  const [bidAmount, setBidAmount] = useState('1200000');
  const [durationDays, setDurationDays] = useState('5');
  const [proposalText, setProposalText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ProposalErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateProposal({ bidAmount, proposalText, selectedFile });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onSuccess();
      alert('Proposal penawaran berhasil dikirim!');
    }, 1200);
  };

  return {
    bidAmount,
    durationDays,
    proposalText,
    selectedFile,
    errors,
    isSubmitted,
    setBidAmount,
    setDurationDays,
    setProposalText,
    setSelectedFile,
    handleSubmit,
  };
}

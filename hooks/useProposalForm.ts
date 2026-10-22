'use client';

import { FormEvent, useState } from 'react';
import { ProposalErrors, validateProposal } from '@/lib/projects/validateProposal';
import { Bid, User } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';

export interface UseProposalFormOptions {
  projectId: string;
  currentUser?: User;
  onSuccess?: (newBid: Bid) => void;
}

export function useProposalForm({
  projectId,
  currentUser = mockCurrentUser,
  onSuccess,
}: UseProposalFormOptions) {
  const [bidAmount, setBidAmount] = useState('1200000');
  const [durationDays, setDurationDays] = useState('5');
  const [proposalText, setProposalText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ProposalErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateProposal({ bidAmount, proposalText, selectedFile });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
    setSuccessMessage('Proposal penawaran berhasil dikirim kepada Klien!');

    // Konstruksi objek Bid baru yang valid sesuai interface Bid (types/index.ts)
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      projectId,
      studentId: currentUser?.id || 'usr-001',
      studentName: currentUser?.name || 'Iman Dwi Satrio',
      studentAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVerifiedStudent: currentUser?.isVerifiedStudent ?? true,
      campusName: currentUser?.campusName || 'Universitas Pertamina',
      bidAmount: Number(bidAmount),
      estimatedDays: Number(durationDays) || 5,
      proposalMessage: proposalText,
      attachmentUrl: selectedFile ? `/portfolio/${selectedFile.name}` : undefined,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setIsSubmitted(false);
      setSuccessMessage(null);
      if (onSuccess) {
        onSuccess(newBid);
      }
    }, 1200);
  };

  return {
    bidAmount,
    durationDays,
    proposalText,
    selectedFile,
    errors,
    isSubmitted,
    successMessage,
    setBidAmount,
    setDurationDays,
    setProposalText,
    setSelectedFile,
    handleSubmit,
  };
}

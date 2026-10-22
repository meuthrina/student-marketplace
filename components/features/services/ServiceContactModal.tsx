'use client';

import React, { useState } from 'react';

export interface ServiceContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  studentName: string;
}

export const ServiceContactModal: React.FC<ServiceContactModalProps> = ({
  isOpen,
  onClose,
  serviceTitle,
  studentName,
}) => {
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        setInquiryMessage('');
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[440px] bg-white rounded-[24px] border border-slate-200 p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 id="contact-modal-title" className="text-lg font-bold text-[#0F172A]">
              Hubungi {studentName}
            </h3>
            <p className="text-xs text-[#475569]">{serviceTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 transition-colors text-lg font-bold cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {successNotice ? (
          <div className="p-4 rounded-[16px] bg-[#ECFDF5] border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <span>✓ Pesan berhasil dikirim ke penyedia jasa!</span>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="inquiry-message" className="text-xs font-bold text-[#0F172A]">
                Pesan atau Kebutuhan Proyek Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                id="inquiry-message"
                required
                rows={4}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Ceritakan gambaran website atau desain yang ingin Anda buat..."
                className="w-full resize-none rounded-[16px] border border-slate-200 p-3 text-xs text-[#0F172A] focus:border-[#4338CA] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full min-h-[48px] rounded-full bg-gradient-to-r from-[#4A4EB5] to-[#6647B9] text-white font-bold text-sm flex items-center justify-center shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitted ? 'Mengirim Pesan...' : 'Kirim Pesan'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full min-h-[44px] rounded-full bg-slate-100 text-[#475569] font-semibold text-xs flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceContactModal;

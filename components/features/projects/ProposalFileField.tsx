'use client';

import React from 'react';

export interface ProposalFileFieldProps {
  rejectedFile: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export const ProposalFileField: React.FC<ProposalFileFieldProps> = ({
  rejectedFile,
  onFileUpload,
  onRemoveFile,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Dropzone */}
      <label
        htmlFor="bid-file-upload"
        className="w-full p-5 bg-white border-2 border-dashed border-[#4338CA] rounded-[16px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <svg
          className="w-7 h-7 text-[#4338CA]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="text-sm font-medium text-[#0F172A]">
          Pilih PDF / PNG / JPEG · Maks. 5 MB
        </span>
        <span className="text-xs font-semibold text-[#4338CA]">
          Pilih berkas
        </span>
        <input
          id="bid-file-upload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.exe"
          onChange={onFileUpload}
          className="sr-only"
        />
      </label>

      {/* Rejected File Card (Node 33:54780) */}
      {rejectedFile && (
        <div className="flex flex-col gap-3 animate-in fade-in">
          <div className="w-full p-3 bg-white border border-slate-100 rounded-[12px] flex items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <svg
                className="w-5 h-5 text-[#4338CA] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#0F172A] truncate">
                  {rejectedFile}
                </p>
                <p className="text-xs text-[#475569] leading-tight">
                  Ditolak · format tidak didukung
                </p>
                <div className="w-full h-1 bg-[#C6D2D9] rounded-full overflow-hidden mt-1.5">
                  <div className="w-full h-full bg-[#115E59] rounded-full" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveFile}
              className="px-2.5 py-1.5 rounded-[12px] bg-[#FEE2E2] text-[#991B1B] flex items-center gap-1.5 text-xs font-medium hover:bg-red-200 transition-colors shrink-0 cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Hapus</span>
            </button>
          </div>

          <div className="w-full p-4 rounded-[16px] bg-[#FEF2F2] border border-[#FECACA] flex items-center">
            <p className="text-sm font-normal leading-[21px] text-[#B91C1C]">
              {rejectedFile} ditolak. Hanya PDF / PNG / JPEG, maksimal 5 MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalFileField;

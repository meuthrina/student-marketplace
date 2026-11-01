'use client';

import React, { useTransition, useState } from 'react';
import Link from 'next/link';
import { ubahStatusProyek, hapusProyek } from '@/app/client/projects/actions';

interface ClientProjectCardActionsProps {
  projectId: string;
  currentStatus: string;
  bidsCount: number;
}

/**
 * ClientProjectCardActions (Client Component - Pekan 6 PAW)
 * Menyediakan interaksi mutasi Update Status & Delete Proyek dengan penanganan feedback.
 */
export function ClientProjectCardActions({
  projectId,
  currentStatus,
  bidsCount,
}: ClientProjectCardActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; pesan: string } | null>(null);

  const handleStatusChange = (newStatus: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await ubahStatusProyek(projectId, newStatus);
      if (res.pesan) {
        setFeedback({ success: Boolean(res.success), pesan: res.pesan });
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    setFeedback(null);
    startTransition(async () => {
      const res = await hapusProyek(projectId);
      if (res.pesan) {
        setFeedback({ success: Boolean(res.success), pesan: res.pesan });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2.5 w-full md:w-auto items-stretch md:items-end">
      {feedback && (
        <div
          role="status"
          className={`p-2.5 rounded-[12px] text-xs font-semibold max-w-sm ${
            feedback.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {feedback.pesan}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Link ke halaman detail untuk meninjau proposal */}
        <Link
          href={`/projects/${projectId}`}
          className="min-h-[38px] px-4 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold inline-flex items-center justify-center transition-colors shadow-2xs"
        >
          Tinjau Proposal ({bidsCount}) ↗
        </Link>

        {/* Status Dropdown/Selector (Update Status) */}
        <select
          value={currentStatus}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value)}
          aria-label="Ubah Status Proyek"
          className="min-h-[38px] px-3 py-1.5 rounded-full bg-white border border-[#D8DDF0] text-xs font-semibold text-[#0F172A] hover:border-[#4338CA] focus:outline-none focus:ring-1 focus:ring-[#4338CA] cursor-pointer disabled:opacity-50"
        >
          <option value="OPEN">Status: OPEN</option>
          <option value="IN_PROGRESS">Status: IN_PROGRESS</option>
          <option value="COMPLETED">Status: COMPLETED</option>
          <option value="CANCELLED">Status: CANCELLED</option>
        </select>

        {/* Delete Button (Hapus Proyek) */}
        <button
          type="button"
          disabled={isPending}
          onClick={handleDelete}
          aria-label="Hapus Proyek"
          className="min-h-[38px] px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? '...' : 'Hapus'}
        </button>
      </div>
    </div>
  );
}


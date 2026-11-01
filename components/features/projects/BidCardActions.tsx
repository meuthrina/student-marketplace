'use client';

import React, { useState, useTransition } from 'react';
import { ubahPenawaran, batalkanPenawaran } from '@/app/projects/[id]/actions';
import type { Bid } from '@/types';

interface BidCardActionsProps {
  bid: Bid;
  projectId: string;
}

/**
 * BidCardActions (Client Component - Pekan 6 PAW)
 * Menyediakan antarmuka interaktif untuk aksi Ubah Proposal (Update) dan Batalkan Proposal (Delete)
 * langsung pada kartu penawaran mahasiswa di halaman detail proyek.
 */
export function BidCardActions({ bid, projectId }: BidCardActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ success: boolean; pesan: string } | null>(null);

  // State isian formulir ubah penawaran
  const [nominal, setNominal] = useState(bid.bidAmount);
  const [durasi, setDurasi] = useState(bid.estimatedDays);
  const [pesan, setPesan] = useState(bid.proposalMessage);
  const [portofolio, setPortofolio] = useState(bid.attachmentUrl || '');

  const handleDelete = () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan proposal penawaran ini?')) return;
    setFeedback(null);
    startTransition(async () => {
      const res = await batalkanPenawaran(bid.id, projectId);
      if (res.pesan) {
        setFeedback({ success: Boolean(res.success), pesan: res.pesan });
      }
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    formData.append('proyekId', projectId);
    formData.append('nominalPenawaran', String(nominal));
    formData.append('durasiHari', String(durasi));
    formData.append('pesanProposal', pesan);
    if (portofolio) {
      formData.append('portofolioUrl', portofolio);
    }

    startTransition(async () => {
      const res = await ubahPenawaran(bid.id, {}, formData);
      if (res.pesan) {
        setFeedback({ success: Boolean(res.success), pesan: res.pesan });
      }
      if (res.success) {
        setIsEditing(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2.5 w-full pt-2">
      {/* Banner Notifikasi Aksi */}
      {feedback && (
        <div
          role="status"
          className={`p-2.5 rounded-[12px] text-xs font-semibold ${
            feedback.success
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {feedback.pesan}
        </div>
      )}

      {/* Tombol Aksi Normal */}
      {!isEditing ? (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Status: {bid.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {bid.status === 'PENDING' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-[#D8DDF0] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Ubah Tawaran
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isPending ? '...' : 'Batalkan'}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Formulir Pengubahan Proposal (Update Bid) */
        <form onSubmit={handleUpdate} className="flex flex-col gap-3 p-4 rounded-[16px] bg-slate-50 border border-indigo-100 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A]">Perbarui Isian Proposal</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">Nominal Penawaran (IDR)</label>
              <input
                type="number"
                min={25000}
                max={50000000}
                value={nominal}
                onChange={(e) => setNominal(Number(e.target.value))}
                className="px-3 py-2 rounded-[10px] bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4338CA]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">Estimasi Durasi (Hari)</label>
              <input
                type="number"
                min={1}
                max={180}
                value={durasi}
                onChange={(e) => setDurasi(Number(e.target.value))}
                className="px-3 py-2 rounded-[10px] bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4338CA]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700">Pesan Proposal (min. 20 karakter)</label>
            <textarea
              rows={2}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              className="px-3 py-2 rounded-[10px] bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4338CA] resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700">Tautan Portofolio (Opsional)</label>
            <input
              type="url"
              value={portofolio}
              placeholder="https://..."
              onChange={(e) => setPortofolio(e.target.value)}
              className="px-3 py-2 rounded-[10px] bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4338CA]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1.5 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold transition-colors shadow-2xs disabled:opacity-50"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


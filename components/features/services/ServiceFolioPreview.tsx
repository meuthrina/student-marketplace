import React from 'react';

export const ServiceFolioPreview: React.FC = () => {
  return (
    <div className="w-full bg-[#E3F4F1] border border-emerald-100/60 rounded-[16px] p-4 flex flex-col gap-3">
      {/* Browser chrome header */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#B6AECF]" />
        <span className="w-2 h-2 rounded-full bg-[#C7BEE0]" />
        <span className="w-2 h-2 rounded-full bg-[#D6CEE8]" />
        <span className="text-xs font-normal text-[#475569] ml-2 tracking-tight">
          folio.design / dashboard
        </span>
      </div>

      {/* Interface canvas: white card with mini sidebar and workspace */}
      <div className="w-full bg-white rounded-[10px] p-3 flex gap-3 shadow-xs">
        {/* Mini sidebar */}
        <div className="flex flex-col gap-2 w-20 shrink-0 border-r border-slate-100 pr-2">
          <span className="text-xs font-bold text-[#4338CA]">Folio.</span>
          <div className="flex flex-col gap-1 text-xs text-[#475569]">
            <span className="text-[#4338CA] font-medium">Overview</span>
            <span>Projects</span>
            <span>Schedule</span>
          </div>
        </div>

        {/* Mini workspace */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div>
            <p className="text-xs font-bold text-[#0F172A] leading-tight">Halo, Nadia.</p>
            <p className="text-xs font-normal text-[#475569]">
              Your creative projects, beautifully organized.
            </p>
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-[8px] bg-[#EAE6F9] border border-indigo-100">
              <p className="text-xs text-[#475569]">Active Projects</p>
              <p className="text-sm font-bold text-[#4338CA]">8 Proyek</p>
            </div>
            <div className="p-2 rounded-[8px] bg-[#E3F4F1] border border-teal-100">
              <p className="text-xs text-[#475569]">Completion</p>
              <p className="text-sm font-bold text-[#0F766E]">98%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFolioPreview;

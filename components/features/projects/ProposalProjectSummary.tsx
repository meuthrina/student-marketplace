import React from 'react';
import { Project } from '@/types';
import { ScopeBadge } from '@/components/ui/ScopeBadge';

export interface ProposalProjectSummaryProps {
  project: Project;
}

export const ProposalProjectSummary: React.FC<ProposalProjectSummaryProps> = ({
  project,
}) => {
  return (
    <div className="hidden lg:flex flex-col gap-4 w-[420px] bg-white/90 backdrop-blur-md rounded-[24px] p-5 border border-white/70 shadow-xs self-start">
      <span className="text-xs font-medium tracking-wide uppercase text-[#475569]">
        RINGKASAN PROYEK
      </span>
      <h3 className="text-[22px] font-semibold leading-[29px] text-[#0F172A]">
        {project.title}
      </h3>
      <div>
        <ScopeBadge
          scope={project.scope}
          targetCampus={project.targetCampus}
          size="sm"
        />
      </div>
      <p className="text-sm font-normal text-[#475569]">
        Klien: {project.clientName}
      </p>
      <p className="text-[28px] font-semibold leading-[36px] text-[#0F172A]">
        Rp{project.budget.toLocaleString('id-ID')}
      </p>
      <p className="text-sm font-normal leading-[21px] text-[#475569]">
        {project.description}
      </p>
      <div className="p-4 rounded-[16px] bg-[#ECFDF5] border border-emerald-100 flex flex-col gap-1">
        <p className="text-sm font-medium text-[#047857]">
          Nadia Putri · Verified Student
        </p>
        <p className="text-sm font-normal text-[#047857]">
          Eligible untuk mengirim bid.
        </p>
      </div>
    </div>
  );
};

export default ProposalProjectSummary;

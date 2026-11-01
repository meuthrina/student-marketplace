export default function CreateProjectLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          <span className="text-slate-300">/</span>
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <span className="text-slate-300">/</span>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-2/3 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        {/* 2-Column Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          {/* Form Card Skeleton */}
          <div className="space-y-5 rounded-[24px] bg-white/80 p-6 sm:p-8 shadow-sm border border-white">
            {/* Field 1 */}
            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-11 w-full animate-pulse rounded-[16px] bg-slate-200" />
            </div>

            {/* Field 2 */}
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-11 w-full animate-pulse rounded-[16px] bg-slate-200" />
            </div>

            {/* Field 3: Scope Checkbox */}
            <div className="h-24 w-full animate-pulse rounded-[18px] bg-slate-200/70" />

            {/* Field 4 & 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                <div className="h-11 w-full animate-pulse rounded-[16px] bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-11 w-full animate-pulse rounded-[16px] bg-slate-200" />
              </div>
            </div>

            {/* Field 6 */}
            <div className="space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-28 w-full animate-pulse rounded-[16px] bg-slate-200" />
            </div>

            {/* Field 7 */}
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-11 w-full animate-pulse rounded-[16px] bg-slate-200" />
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <div className="h-11 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="h-11 w-36 animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>

          {/* Right Guidance Sidebar */}
          <div className="space-y-5">
            <div className="h-48 animate-pulse rounded-[22px] bg-white/75 shadow-2xs border border-white" />
            <div className="h-32 animate-pulse rounded-[22px] bg-indigo-100/50 shadow-2xs border border-indigo-200/60" />
          </div>
        </div>
      </div>
    </div>
  );
}


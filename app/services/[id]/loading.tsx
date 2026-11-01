export default function ServiceDetailLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          <span className="text-slate-300">/</span>
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
          <span className="text-slate-300">/</span>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
          {/* Main Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-6 rounded-[24px] bg-white/80 p-6 sm:p-8 shadow-sm border border-white">
              <div className="space-y-3">
                <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="h-9 w-4/5 animate-pulse rounded-lg bg-slate-200" />
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
              </div>
            </div>

            {/* Portfolio Preview Skeleton */}
            <div className="h-48 animate-pulse rounded-[24px] bg-white/70 p-6 shadow-sm border border-white" />
          </div>

          {/* Sidebar Freelancer Card Skeleton */}
          <div className="space-y-4">
            <div className="space-y-4 rounded-[24px] bg-white/80 p-6 shadow-sm border border-white">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
              <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
              <div className="h-11 w-full animate-pulse rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


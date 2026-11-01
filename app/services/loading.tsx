export default function ServicesLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-2/3 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
          ))}
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-[24px] bg-white/70 p-6 shadow-sm border border-slate-100 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
                <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
                <div className="h-12 w-full animate-pulse rounded bg-slate-200" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


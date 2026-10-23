export default function ProjectsLoading() {
  return (
    <div className="w-full min-h-[80vh] bg-[#F0F1FB] py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
        
        {/* Grid Card Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/70 p-6 shadow-sm border border-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
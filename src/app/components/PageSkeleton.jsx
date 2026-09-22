export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm"
        >
          <div className="h-52 shimmer" />
          <div className="p-6 space-y-4">
            <div className="h-3 w-24 rounded-full shimmer" />
            <div className="h-6 w-4/5 rounded-lg shimmer" />
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-2/3 rounded shimmer" />
            <div className="flex items-center justify-between pt-3">
              <div className="h-8 w-24 rounded-lg shimmer" />
              <div className="h-11 w-32 rounded-xl shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
      <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white">
        <div className="h-[420px] shimmer" />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 space-y-5">
        <div className="h-4 w-28 rounded shimmer" />
        <div className="h-10 w-4/5 rounded-xl shimmer" />
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-5/6 rounded shimmer" />
        <div className="h-14 w-36 rounded-xl shimmer mt-8" />
        <div className="h-12 w-full rounded-xl shimmer" />
      </div>
    </div>
  );
}

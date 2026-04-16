import { Skeleton } from "@/components/ui/skeleton";

export function AboutSkeleton() {
  return (
    <div className="container py-12 md:py-20">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Bio */}
        <div className="md:col-span-2 rounded-3xl border bg-card p-6 space-y-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* Philosophy */}
        <div className="rounded-3xl border bg-card p-6 space-y-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        {/* Lab image */}
        <div className="md:col-span-2 rounded-3xl border bg-card overflow-hidden">
          <Skeleton className="h-48 md:h-64 w-full" />
        </div>
        {/* Mission */}
        <div className="rounded-3xl border bg-card p-6 space-y-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        {/* Timeline */}
        <div className="md:col-span-2 lg:col-span-3 rounded-3xl border bg-card p-6 space-y-5">
          <Skeleton className="h-6 w-56" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-3 w-3 rounded-full shrink-0 mt-1" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
        {/* Expertise */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border bg-card p-6 space-y-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

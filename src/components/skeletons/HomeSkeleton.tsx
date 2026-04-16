import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="container py-12 md:py-20">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hero card */}
        <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-3xl border bg-card p-6 space-y-5">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-4 items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
        {/* Stats */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border bg-card p-6 flex flex-col items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
        {/* About card */}
        <div className="md:col-span-2 rounded-3xl border bg-card p-6 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        {/* Featured cards */}
        {[1, 2].map((i) => (
          <div key={i} className="rounded-3xl border bg-card p-6 space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

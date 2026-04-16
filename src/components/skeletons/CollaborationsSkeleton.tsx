import { Skeleton } from "@/components/ui/skeleton";

export function CollaborationsSkeleton() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12 space-y-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

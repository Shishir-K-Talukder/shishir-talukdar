import { Skeleton } from "@/components/ui/skeleton";

export function ContactSkeleton() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mb-12 space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-3xl border bg-card p-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl border bg-card p-6 space-y-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

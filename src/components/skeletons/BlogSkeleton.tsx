import { Skeleton } from "@/components/ui/skeleton";

export function BlogSkeleton() {
  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/8 via-background to-background">
        <div className="container pt-16 pb-10 md:pt-24 md:pb-14 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border bg-card/60 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Categories */}
      <section className="border-b border-border/30 bg-card/30">
        <div className="container py-8 space-y-5">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
      {/* Posts */}
      <div className="container py-10">
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl border bg-card p-5 flex flex-col md:flex-row gap-4">
              <Skeleton className="w-full md:w-44 h-32 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function ResourcesSkeleton({ resourcesCount = 1 }: { resourcesCount?: number }) {
  return (
    <div>
      <div className="space-y-2">
        {Array.from({ length: resourcesCount }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge skeleton */}
            <Skeleton className="h-5 w-36" /> {/* Link text skeleton */}
          </div>
        ))}
      </div>
    </div>
  );
}

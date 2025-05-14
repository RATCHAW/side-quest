import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";

export function CommentSkeleton({ hasReplies = false }: { hasReplies?: boolean }) {
  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8">
        <Skeleton className="h-full w-full rounded-full" />
      </Avatar>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="h-8 w-14" /> {/* Reply button */}
        {hasReplies && (
          <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-6">
            {/* Show 2 reply skeletons */}
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex gap-3">
                <Avatar className="h-6 w-6">
                  <Skeleton className="h-full w-full rounded-full" />
                </Avatar>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-14" />
                  </div>
                  <Skeleton className="mb-1 h-3 w-full" />
                  <Skeleton className="mb-2 h-3 w-4/5" />
                  <Skeleton className="h-6 w-12" /> {/* Reply button */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { PostCardSkeleton } from "./post-card-skeleton";

export function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
}

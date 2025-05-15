import { PostCardSkeleton } from "./post-card-skeleton";

export function PostsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </>
  );
}

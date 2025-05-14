import { CommentSkeleton } from "./comment-skeleton";

export function CommentsSectionSkeleton({ commentCount = 3 }: { commentCount?: number }) {
  return (
    <div>
      <div className="space-y-6">
        {Array.from({ length: commentCount }).map((_, index) => (
          <CommentSkeleton key={index} hasReplies={index === 0} />
        ))}
      </div>
    </div>
  );
}

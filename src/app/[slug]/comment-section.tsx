import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NewComment } from "./_components/new-comment";
import type { Post } from "@prisma/client";
import type { PostWithDetails } from "@/server/api/routers/post";

interface CommentSectionProps {
  comments: PostWithDetails["comments"];
  postId: Post["id"];
}

export function CommentSection({ comments, postId }: CommentSectionProps) {
  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-semibold">Discussion ({comments.length})</h3>

      <NewComment postId={postId} parentId={null} />

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={comment.user.image || "/placeholder.svg"}
                alt={comment.user.name}
              />
              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-gray-500">
                  {comment.createdAt.toDateString()}
                </span>
              </div>
              <p className="text-gray-800">{comment.content}</p>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-6">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reply.user.image || undefined}
                          alt={reply.user.name}
                        />
                        <AvatarFallback>
                          {reply.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">{reply.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {reply.createdAt.toDateString()}
                          </span>
                        </div>
                        <p className="text-gray-800">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="ghost" size="sm" className="mt-2 text-gray-500">
                Reply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

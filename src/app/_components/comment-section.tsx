"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewComment } from "./new-comment";
import type { Post } from "@prisma/client";
import type { PostWithDetails } from "@/server/api/routers/post";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CommentsSectionSkeleton } from "./skeletons/comment-section-skeleton";

interface CommentSectionProps {
  comments: PostWithDetails["comments"];
  postId: Post["id"];
  commentsCount?: number;
  isLoading?: boolean;
}

export function CommentSection({ comments, postId, commentsCount = 0, isLoading = false }: CommentSectionProps) {
  const [showReply, setShowReply] = useState("");
  return (
    <div className="mt-6 w-full space-y-6">
      <h3 className="text-xl font-semibold">Discussion ({commentsCount})</h3>

      <NewComment postId={postId} parentId={null} />

      <div className="space-y-6">
        {isLoading ? (
          <CommentsSectionSkeleton commentCount={commentsCount} />
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.user.image || undefined} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(comment.createdAt)}</span>
                </div>
                <p className="text-gray-800">{comment.content}</p>
                {showReply === comment.id && <NewComment postId={postId} parentId={comment.id} />}
                <Button
                  onClick={() => setShowReply(comment.id)}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-gray-500"
                >
                  Reply
                </Button>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.user.image || undefined} alt={reply.user.name} />
                          <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium">{reply.user.name}</span>
                            <span className="text-xs text-gray-500">{formatDistanceToNow(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-800">{reply.content}</p>
                          {showReply === reply.id && <NewComment postId={postId} parentId={comment.id} />}
                          <Button
                            onClick={() => setShowReply(reply.id)}
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-gray-500"
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

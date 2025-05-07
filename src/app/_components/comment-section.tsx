"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  comments: Comment[];
  projectId: string;
}

export function CommentSection({
  comments: initialComments,
  projectId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User",
      avatar: "/placeholder.svg?height=40&width=40",
      content: newComment,
      date: "Just now",
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-semibold">Discussion ({comments.length})</h3>

      <div className="flex gap-4">
        <Avatar>
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="Current User"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Share your thoughts or ask questions..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleAddComment}>Post Comment</Button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={comment.avatar || "/placeholder.svg"}
                alt={comment.author}
              />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-medium">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-800">{comment.content}</p>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-6">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reply.avatar || "/placeholder.svg"}
                          alt={reply.author}
                        />
                        <AvatarFallback>
                          {reply.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">{reply.author}</span>
                          <span className="text-xs text-gray-500">
                            {reply.date}
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

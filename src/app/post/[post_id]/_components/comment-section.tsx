"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, MessageSquare, MoreHorizontal, Reply } from "lucide-react";
import { cn } from "@/lib/utils";

type Comment = {
  id: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  isUpvoted: boolean;
  isDownvoted: boolean;
};

export default function CommentSection({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Mock data - in a real app, you would fetch comments from an API
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "sarahc",
      },
      content:
        "This is really insightful! I've been using AI coding assistants for a few months now and they've definitely improved my productivity.",
      createdAt: "1 hour ago",
      upvotes: 24,
      downvotes: 2,
      isUpvoted: true,
      isDownvoted: false,
      replies: [
        {
          id: "1-1",
          author: {
            name: "Mike Wilson",
            avatar: "/placeholder.svg?height=40&width=40",
            username: "mikew",
          },
          content: "Which tools have you found most helpful? I'm still exploring options.",
          createdAt: "45 minutes ago",
          upvotes: 8,
          downvotes: 0,
          isUpvoted: false,
          isDownvoted: false,
          replies: [],
        },
        {
          id: "1-2",
          author: {
            name: "Sarah Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            username: "sarahc",
          },
          content: "I've been using GitHub Copilot and v0 by Vercel. Both are excellent for different use cases!",
          createdAt: "30 minutes ago",
          upvotes: 12,
          downvotes: 0,
          isUpvoted: false,
          isDownvoted: false,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "davidk",
      },
      content:
        "I'm concerned about over-reliance on AI tools. What happens to our fundamental understanding of programming concepts if we let AI do more of the work?",
      createdAt: "45 minutes ago",
      upvotes: 18,
      downvotes: 5,
      isUpvoted: false,
      isDownvoted: false,
      replies: [],
    },
  ]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `${comments.length + 1}`,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "currentuser",
      },
      content: newComment,
      createdAt: "Just now",
      upvotes: 0,
      downvotes: 0,
      isUpvoted: false,
      isDownvoted: false,
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "currentuser",
      },
      content: replyContent,
      createdAt: "Just now",
      upvotes: 0,
      downvotes: 0,
      isUpvoted: false,
      isDownvoted: false,
      replies: [],
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, reply],
        };
      }

      // Check nested replies
      if (comment.replies.some((r) => r.id === commentId)) {
        return {
          ...comment,
          replies: comment.replies.map((r) => (r.id === commentId ? { ...r, replies: [...r.replies, reply] } : r)),
        };
      }

      return comment;
    });

    setComments(updatedComments);
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleVote = (commentId: string, isUpvote: boolean) => {
    const updateVote = (comment: Comment): Comment => {
      if (comment.id === commentId) {
        if (isUpvote) {
          if (comment.isUpvoted) {
            return { ...comment, upvotes: comment.upvotes - 1, isUpvoted: false };
          } else {
            const downvoteAdjustment = comment.isDownvoted ? -1 : 0;
            return {
              ...comment,
              upvotes: comment.upvotes + 1,
              downvotes: comment.downvotes + downvoteAdjustment,
              isUpvoted: true,
              isDownvoted: false,
            };
          }
        } else {
          if (comment.isDownvoted) {
            return { ...comment, downvotes: comment.downvotes - 1, isDownvoted: false };
          } else {
            const upvoteAdjustment = comment.isUpvoted ? -1 : 0;
            return {
              ...comment,
              downvotes: comment.downvotes + 1,
              upvotes: comment.upvotes + upvoteAdjustment,
              isDownvoted: true,
              isUpvoted: false,
            };
          }
        }
      }

      if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map(updateVote),
        };
      }

      return comment;
    };

    setComments(comments.map(updateVote));
  };

  const renderComment = (comment: Comment, depth = 0) => {
    return (
      <div key={comment.id} className={cn("py-4", depth > 0 && "border-l pl-6")}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-muted-foreground text-xs">@{comment.author.username}</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">{comment.createdAt}</span>
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => handleVote(comment.id, true)}
                >
                  <ChevronUp className={cn("h-4 w-4", comment.isUpvoted && "fill-green-500 text-green-500")} />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="text-xs font-medium">{comment.upvotes - comment.downvotes}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => handleVote(comment.id, false)}
                >
                  <ChevronDown className={cn("h-4 w-4", comment.isDownvoted && "fill-red-500 text-red-500")} />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="mr-1 h-3 w-3" />
                Reply
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-0">{comment.replies.map((reply) => renderComment(reply, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Comments</h3>

      <div className="mb-6">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={handleSubmitComment}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Comment
          </Button>
        </div>
      </div>

      <div className="divide-y">{comments.map((comment) => renderComment(comment))}</div>
    </div>
  );
}

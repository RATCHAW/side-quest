"use client";

import { Button } from "@/components/ui/button";
import type { PostsWithActions } from "@/server/api/routers/post";
import { api } from "@/trpc/react";
import {
  Bookmark,
  MessageSquare,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";

export const PostAction = ({ post }: { post: PostsWithActions[number] }) => {
  const voteType = post.votes[0]?.voteType;

  const vote = api.post.vote.useMutation({
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You must be logged in to vote");
      }
    },
  });

  const bookmark = api.post.bookmark.useMutation({
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You must be logged in to bookmark");
      }
    },
  });

  const handleBookmark = () => {
    if (post.bookmarks[0]) {
      bookmark.mutate({ postId: post.id, actionType: "REMOVE" });
    } else {
      bookmark.mutate({ postId: post.id, actionType: "ADD" });
    }
  };
  const handleVote = (voteType: "UP" | "DOWN") => {
    if (voteType === "UP") {
      vote.mutate({ postId: post.id, voteType });
    } else {
      vote.mutate({ postId: post.id, voteType });
    }
  };
  return (
    <div className="flex w-full justify-between border-t pt-4">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className={voteType === "UP" ? "text-green-500" : ""}
          onClick={() => handleVote("UP")}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{post._count.votes}</span>
        <Button
          variant="ghost"
          size="icon"
          className={voteType === "DOWN" ? "text-red-500" : ""}
          onClick={() => handleVote("DOWN")}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className={post.bookmarks[0] ? "text-blue-500" : ""}
          onClick={handleBookmark}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
          <span className="ml-1 text-xs">{post._count.comments}</span>
        </Button>
      </div>
    </div>
  );
};

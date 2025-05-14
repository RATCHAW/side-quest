"use client";

import { Button } from "@/components/ui/button";
import type { PostsWithActions } from "@/server/api/routers/post";
import { api } from "@/trpc/react";
import { Bookmark, MessageSquare, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

export const PostAction = ({ post }: { post: PostsWithActions[number] }) => {
  const [q] = useQueryState("q");

  const utils = api.useUtils();

  const currentVote = post.votes[0]?.voteType;

  const vote = api.post.vote.useMutation({
    onSuccess: async (data) => {
      utils.post.all.setData({ q: q ?? undefined }, (oldData) => {
        if (!oldData) return oldData;
        const newData = oldData.map((item) => {
          if (item.id === post.id) {
            return {
              ...item,
              _count: {
                ...item._count,
                votes:
                  data.voteType === "DOWN" || data.voteType === undefined
                    ? Math.max(0, item._count.votes - 1)
                    : item._count.votes + 1,
              },
              votes: data.voteType === undefined ? [] : [{ voteType: data.voteType }],
            };
          }
          return item;
        });
        return newData;
      });

      await utils.post.getById.invalidate({ id: post.id });
    },
  });

  const bookmark = api.post.bookmark.useMutation({
    onSuccess: async (data, variables) => {
      utils.post.all.setData({ q: q ?? undefined }, (oldData) => {
        if (!oldData) return oldData;
        const newData = oldData.map((item) => {
          if (item.id === variables.postId) {
            return {
              ...item,
              bookmarks: variables.actionType === "ADD" ? (data ? [data] : []) : [],
            };
          }
          return item;
        });
        return newData;
      });

      await utils.post.getById.invalidate({ id: post.id });
    },
  });

  const handleBookmark = () => {
    if (post.bookmarks.length > 0) {
      bookmark.mutate({ postId: post.id, actionType: "REMOVE" });
    } else {
      bookmark.mutate({ postId: post.id, actionType: "ADD" });
    }
  };

  const handleVote = (voteType: "UP" | "DOWN") => {
    if (voteType === currentVote) {
      vote.mutate({ postId: post.id, voteType: "REMOVE" });
    } else {
      vote.mutate({ postId: post.id, voteType });
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard", {
      position: "bottom-center",
    });
  };

  return (
    <div className="flex w-full justify-between border-t pt-4">
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className={currentVote === "UP" ? "text-green-500" : ""}
          onClick={() => handleVote("UP")}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{post._count.votes}</span>
        <Button
          variant="ghost"
          size="icon"
          className={currentVote === "DOWN" ? "text-red-500" : ""}
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
        <Button onClick={handleShare} variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button asChild variant="ghost" size="icon">
          <Link href={`/?p=${post.id}${q ? `&q=${q}` : ""}&comment=true`}>
            <MessageSquare className="h-4 w-4" />
            <span className="ml-1 text-xs">{post._count.comments}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

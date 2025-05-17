"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PostsWithActions } from "@/server/api/routers/post";
import { api } from "@/trpc/react";
import type { PostBookmark, PostVote, Vote } from "@prisma/client";
import { Bookmark, MessageSquare, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useQueryStates } from "nuqs";
import { toast } from "sonner";
import { postSearchParams } from "./search-params";
import { useSession } from "@/lib/auth-client";
import { LIMIT } from "@/hooks/use-infinite-posts";
import { calculateVotesCount } from "./votes-count";

export const PostAction = ({ post }: { post: PostsWithActions["posts"][number] }) => {
  const [searchParams, setSearchParams] = useQueryStates(postSearchParams);
  const session = useSession();
  const isSignedIn = !!session.data?.user;
  const utils = api.useUtils();

  const userCurrentVote = post.votes?.length > 0 && post.votes[0]?.voteType;

  const vote = api.post.vote.useMutation({
    onMutate: async ({ postId, voteType }) => {
      const shouldRemoveVote = userCurrentVote === voteType;

      utils.post.all.setInfiniteData({ q: searchParams.q ?? undefined, limit: LIMIT }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  _count: {
                    ...post._count,
                    votes: calculateVotesCount({
                      currentVoteCount: post._count.votes,
                      userCurrentVote: post.votes?.[0]?.voteType,
                      voteType,
                    }),
                  },
                  votes: shouldRemoveVote ? [] : ([{ voteType: voteType as Vote }] as PostVote[]),
                };
              }
              return post;
            }),
          })),
        };
      });
    },
  });

  const bookmark = api.post.bookmark.useMutation({
    onMutate: async ({ postId, actionType }) => {
      utils.post.all.setInfiniteData({ q: searchParams.q ?? undefined, limit: LIMIT }, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((item) => {
              if (item.id === postId) {
                return {
                  ...item,
                  bookmarks: actionType === "ADD" ? ([{ createdAt: new Date() }] as PostBookmark[]) : [],
                };
              }
              return item;
            }),
          })),
        };
      });
    },
  });

  const handleBookmark = () => {
    if (!isSignedIn) {
      toast.error("You need to be signed in to bookmark a post");
      return;
    }
    if (post.bookmarks.length > 0) {
      bookmark.mutate({ postId: post.id, actionType: "REMOVE" });
    } else {
      bookmark.mutate({ postId: post.id, actionType: "ADD" });
    }
  };

  const handleVote = (voteType: "UP" | "DOWN") => {
    if (!isSignedIn) {
      toast.error("You need to be signed in to vote on a post");
      return;
    }

    vote.mutate({
      postId: post.id,
      voteType: userCurrentVote === voteType ? "REMOVE" : voteType,
    });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href + `/posts/${post.id}`);
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
          className={cn("", {
            "text-green-500": userCurrentVote === "UP",
            "hover:text-green-500/50": userCurrentVote !== "UP",
          })}
          onClick={() => handleVote("UP")}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{post._count.votes}</span>
        <Button
          variant="ghost"
          size="icon"
          className={cn("", {
            "text-red-500": userCurrentVote === "DOWN",
            "hover:text-red-500/50": userCurrentVote !== "DOWN",
          })}
          onClick={() => handleVote("DOWN")}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={bookmark.isPending}
          className={post.bookmarks?.length > 0 && post.bookmarks[0] ? "text-blue-500" : ""}
          onClick={handleBookmark}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button onClick={handleShare} variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={async () => {
            await setSearchParams({ comment: true, post_id: post.id });
          }}
          variant="ghost"
          size="icon"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="ml-1 text-xs">{post._count.comments}</span>
        </Button>
      </div>
    </div>
  );
};

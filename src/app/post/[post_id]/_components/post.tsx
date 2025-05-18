"use client";

import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "@/app/_components/comment-section";
import { PostAction } from "@/app/_components/post-actions";
import { calculateVotesCount } from "@/app/_components/votes-count";
import type { PostBookmark, PostVote, Vote } from "@prisma/client";

export function Post({ post_id }: { post_id: string }) {
  const utils = api.useUtils();
  const [post] = api.post.getById.useSuspenseQuery({ id: post_id });
  const userCurrentVote = post.votes?.length > 0 && post.votes[0]?.voteType;

  const vote = api.post.vote.useMutation({
    onMutate: async ({ postId, voteType }) => {
      const shouldRemoveVote = userCurrentVote === voteType;

      utils.post.getById.setData({ id: postId }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            votes: calculateVotesCount({
              currentVoteCount: oldData._count.votes,
              userCurrentVote: oldData.votes?.[0]?.voteType,
              voteType,
            }),
          },
          votes: shouldRemoveVote ? [] : ([{ voteType: voteType as Vote }] as PostVote[]),
        };
      });
    },
  });

  const bookmark = api.post.bookmark.useMutation({
    onMutate: async ({ postId, actionType }) => {
      utils.post.getById.setData({ id: postId }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bookmarks: actionType === "ADD" ? ([{ createdAt: new Date() }] as PostBookmark[]) : [],
        };
      });
    },
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-6 md:py-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="pb-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.user.image || "/placeholder.svg"} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{post.user.name}</h2>
                  <p className="text-muted-foreground text-sm" suppressHydrationWarning>
                    {formatDistanceToNow(post.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h1 className="mb-4 text-2xl font-bold md:text-3xl">{post.title}</h1>
            <p className="text-muted-foreground mb-6">{post.description}</p>
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post thumbnail"
                fill
                className="object-cover"
                priority
              />
            </div>
            <PostAction bookmark={bookmark} vote={vote} post={post} />
          </CardContent>
          <Separator />
          <CardFooter className="flex w-full flex-col gap-4 pt-4">
            <CommentSection comments={post.comments} postId={post.id} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

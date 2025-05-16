"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "./comment-section";
import { PostAction } from "../_components/post-actions";
import type { PostsWithActions, PostWithDetails } from "@/server/api/routers/post";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/trpc/react";
import { useQueryStates } from "nuqs";
import { ResourcesSkeleton } from "./skeletons/resources-skeleton";
import { postSearchParams } from "./search-params";
import { useState } from "react";

const createIntialPostData = (post: PostsWithActions["posts"][number]): PostWithDetails => {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    imageUrl: post.imageUrl,
    createdAt: new Date(post.createdAt),
    user: {
      name: post.user.name,
      image: post.user.image,
    },
    userId: post.userId,
    votes: post.votes,
    _count: {
      comments: post._count?.comments ?? 0,
      votes: post._count?.votes ?? 0,
      resources: post._count?.resources ?? 0,
    },
    bookmarks: post.bookmarks,
    updatedAt: new Date(post.updatedAt),
    resources: [],
    comments: [],
  };
};

export const PostDialog = ({
  postInit,
  children,
}: {
  postInit: PostsWithActions["posts"][number];
  children: React.ReactNode;
}) => {
  const [_searchParams, setSearchParams] = useQueryStates(postSearchParams);
  const initialData = createIntialPostData(postInit);
  const [isOpen, setIsOpen] = useState(false);

  const { data: post, isFetching } = api.post.getById.useQuery(
    {
      id: postInit.id,
    },
    {
      initialData: initialData,
      initialDataUpdatedAt: postInit.updatedAt.getTime(),
      enabled: isOpen,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  );
  const createAt = formatDistanceToNow(post.createdAt);
  return (
    <Dialog
      onOpenChange={async (open) => {
        setIsOpen(open);
        await setSearchParams({ comment: null });
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] !max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.user.image || undefined} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            Posted by {post.user.name} • {createAt}
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-4 h-64 w-full">
          <Image
            src={post.imageUrl || "/placeholder.svg?height=300&width=600"}
            alt={post.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-4">
          <p>{post.description}</p>

          {post._count.resources > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Resources</h3>
              <div className="space-y-2">
                {isFetching && post._count.resources > 0 && post.resources.length === 0 ? (
                  <ResourcesSkeleton resourcesCount={post._count.resources} />
                ) : (
                  post.resources.map((resource, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline">{resource.title}</Badge>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {resource.title}
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <PostAction post={postInit} />
        </div>

        <CommentSection
          isLoading={isFetching && post.resources.length === 0}
          commentsCount={post._count.comments}
          comments={post.comments}
          postId={post.id}
        />
      </DialogContent>
    </Dialog>
  );
};

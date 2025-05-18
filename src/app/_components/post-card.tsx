"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import type { PostsWithActions } from "@/server/api/routers/post";
import { PostAction } from "./post-actions";
import { PostDialog } from "./post-dialog";
import { usePostMutations } from "./use-post-mutations";

interface PostCardProps {
  post: PostsWithActions["posts"][number];
  query?: string;
}

export function PostCard({ post }: PostCardProps) {
  const { bookmark, vote } = usePostMutations(post);
  return (
    <div>
      <Card className="flex h-full flex-col gap-4 transition-shadow hover:shadow-md">
        <PostDialog postInit={post}>
          <div className="text-start">
            <div className="px-4">
              <div className="relative h-48 w-full">
                {post.imageUrl ? (
                  <Image src={post.imageUrl} alt={post.title} fill className="rounded-3xl" />
                ) : (
                  <CardDescription className="line-clamp-3 truncate">{post.description}</CardDescription>
                )}
              </div>
            </div>
            <CardContent className="flex-grow pt-4">
              <CardTitle className="truncate text-xl font-bold">{post.title}</CardTitle>
            </CardContent>
          </div>
        </PostDialog>
        <CardFooter className="w-full">
          <PostAction vote={vote} bookmark={bookmark} post={post} />
        </CardFooter>
      </Card>
    </div>
  );
}

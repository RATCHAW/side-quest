"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import type { PostsWithActions } from "@/server/api/routers/post";
import { PostAction } from "./post-actions";

interface PostCardProps {
  post: PostsWithActions[number];
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div>
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
        <Link href={`/${post.id}`}>
          <div className="relative h-48 w-full">
            <Image
              src={post.imageUrl || "/placeholder.svg?height=200&width=400"}
              alt={post.title}
              fill
              className="rounded-t-lg object-cover"
            />
          </div>
          <CardContent className="flex-grow pt-4">
            <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
            <p className="line-clamp-3 text-gray-600">{post.description}</p>
          </CardContent>
        </Link>
        <CardFooter className="w-full">
          <PostAction post={post} />
        </CardFooter>
      </Card>
    </div>
  );
}

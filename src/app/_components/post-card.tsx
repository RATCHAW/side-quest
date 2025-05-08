"use client";

import Image from "next/image";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import type { PostsWithActions } from "@/server/api/routers/post";

interface PostCardProps {
  post: PostsWithActions[number];
}

export function PostCard({ post }: PostCardProps) {
  const voteType = post.votes[0]?.voteType;

  return (
    <Link href={`/${post.id}`}>
      <Card className="flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md">
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
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={voteType === "UP" ? "text-green-500" : ""}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{post._count.votes}</span>
            <Button
              variant="ghost"
              size="icon"
              className={voteType === "DOWN" ? "text-red-500" : ""}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{post._count.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={true ? "text-blue-500" : ""}
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
        </CardFooter>
      </Card>
    </Link>
  );
}

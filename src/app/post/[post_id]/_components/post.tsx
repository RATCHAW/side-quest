"use client";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookmarkIcon, ChevronDown, ChevronUp, MessageSquare, Share2 } from "lucide-react";
import Image from "next/image";
import CommentSection from "./comment-section";
import { formatDistanceToNow } from "date-fns";

export function Post({ post_id }: { post_id: string }) {
  const [post] = api.post.getById.useSuspenseQuery({ id: post_id });
  return (
    <div className="container max-w-4xl px-4 py-6 md:py-12">
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
                <p className="text-muted-foreground text-sm">
                  @{post.user.name} • {formatDistanceToNow(post.createdAt)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">More options</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </Button>
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
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="group rounded-full">
                  <ChevronUp className="h-5 w-5 group-hover:text-green-500" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="font-medium">{post._count.votes}</span>
                <Button variant="ghost" size="icon" className="group rounded-full">
                  <ChevronDown className="h-5 w-5 group-hover:text-red-500" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{post._count.comments} Comments</span>
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full">
                <BookmarkIcon className="h-5 w-5" />
                <span className="sr-only">Bookmark</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="block p-0">
          <CommentSection postId={post.id} />
        </CardFooter>
      </Card>
    </div>
  );
}

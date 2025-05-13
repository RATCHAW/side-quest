import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import type { PostsWithActions } from "@/server/api/routers/post";
import { PostAction } from "./post-actions";
import { PostDialog } from "./post-dialog";

interface PostCardProps {
  post: PostsWithActions[number];
  query?: string;
}

export function PostCard({ post, query }: PostCardProps) {
  return (
    <div>
      <Card className="flex h-full flex-col gap-4 transition-shadow hover:shadow-md">
        <Link href={`/?p=${post.id}${query ? `&q=${query}` : ""}`}>
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
        </Link>
        <CardFooter className="w-full">
          <PostAction post={post} />
        </CardFooter>
        <PostDialog postInit={post} />
      </Card>
    </div>
  );
}

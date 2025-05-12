"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "./comment-section";
import { PostAction } from "../_components/post-actions";
import type { PostsWithActions, PostWithDetails } from "@/server/api/routers/post";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/trpc/react";

const createIntialPostData = (post: PostsWithActions[number]): PostWithDetails => {
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
    },
    bookmarks: post.bookmarks,
    updatedAt: new Date(post.updatedAt),
    resources: [],
    comments: [],
  };
};

export const PostDialog = ({ postInit }: { postInit: PostsWithActions[number] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const p = searchParams.get("p");
  const initialData = createIntialPostData(postInit);

  const { data: post } = api.post.getById.useQuery(
    {
      id: postInit.id,
    },
    {
      initialData: initialData,
      enabled: p === postInit.id,
      staleTime: 0,
    },
  );
  const createAt = formatDistanceToNow(post.createdAt);
  return (
    <Dialog
      open={p === postInit.id}
      onOpenChange={(open) => {
        if (!open) {
          const query = q ? `?q=${encodeURIComponent(q)}` : "";
          router.push(`/${query}`);
        }
      }}
    >
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

          {post.resources && post.resources.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Resources</h3>
              <div className="space-y-2">
                {post.resources.map((resource, index) => (
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
                ))}
              </div>
            </div>
          )}

          <PostAction post={post} />
        </div>

        <CommentSection comments={post.comments} postId={post.id} />
      </DialogContent>
    </Dialog>
  );
};

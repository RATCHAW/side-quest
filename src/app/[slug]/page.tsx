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
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostDialog } from "./_components/post-dialog";
import { api } from "@/trpc/server";
import { CommentSection } from "./comment-section";
import { PostAction } from "../_components/post-actions";

const IdeaPage = async ({ params }: { params: { slug: string } }) => {
  const post = await api.post.getById({ id: params.slug });

  return (
    <PostDialog>
      <DialogHeader>
        <DialogTitle className="text-2xl">{post.title}</DialogTitle>
        <DialogDescription className="flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={post.user.image || undefined}
              alt={post.user.name}
            />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          Posted by {post.user.name} • {post.createdAt.toLocaleDateString()}
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
    </PostDialog>
  );
};

export default IdeaPage;

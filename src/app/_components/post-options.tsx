"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { usePostMutations } from "./use-post-mutations";
import type { PostsWithActions } from "@/server/api/routers/post";

export function PostOptions({
  post,
  onEditClick,
}: {
  post: PostsWithActions["posts"][number];
  onEditClick: () => void;
}) {
  const { deletePost } = usePostMutations(post);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border transition-colors">
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Open post options</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={onEditClick}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => e.preventDefault()}
          variant="destructive"
          onClick={() => deletePost.mutate({ id: post.id })}
        >
          {deletePost.isPending ? <Loader className="animate-spin" /> : <Trash2 />}
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

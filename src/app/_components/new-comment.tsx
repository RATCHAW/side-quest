"use client";

import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newPostCommentSchema, type NewPostComment } from "@/validation/post";
import { api } from "@/trpc/react";
import type { Post, PostComment } from "@prisma/client";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

export const NewComment = ({
  postId,
  parentId,
}: {
  postId: Post["id"];
  parentId: PostComment["parentCommentId"] | null;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<NewPostComment>({
    resolver: zodResolver(newPostCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const createComment = api.postComment.create.useMutation({
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries([]);
    },
  });

  const onSubmit = (data: NewPostComment) => {
    createComment.mutate({
      content: data.content,
      postId: postId,
      parentId: parentId,
    });
  };
  const { data } = authClient.useSession();
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage
          src={data?.user.image || undefined}
          alt={data?.user.name}
        />
        <AvatarFallback>{data?.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 items-end space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts or ask questions..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Post Comment</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

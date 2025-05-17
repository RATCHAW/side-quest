"use client";

import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { newPostCommentSchema, type NewPostComment } from "@/validation/post";
import { api } from "@/trpc/react";
import type { Post, PostComment } from "@prisma/client";
import { useSession } from "@/lib/auth-client";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export const NewComment = ({
  postId,
  parentId,
}: {
  postId: Post["id"];
  parentId: PostComment["parentCommentId"] | null;
}) => {
  const [comment] = useQueryState("comment", parseAsBoolean.withDefault(false));
  const utils = api.useUtils();

  const form = useForm<NewPostComment>({
    resolver: zodResolver(newPostCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (comment) {
      form.setFocus("content");
    }
  }, [comment, form]);

  const createComment = api.postComment.create.useMutation({
    onSuccess: async () => {
      form.reset();

      await utils.post.getById.invalidate({
        id: postId,
      });
    },
  });
  const { data: userSession } = useSession();

  const onSubmit = (data: NewPostComment) => {
    if (!userSession) {
      toast.error("You must be logged in to comment");
      return;
    }
    createComment.mutate({
      content: data.content,
      postId: postId,
      parentId: parentId,
    });
  };
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={userSession?.user.image || undefined} alt={userSession?.user.name} />
        <AvatarFallback>{userSession?.user.name.charAt(0)}</AvatarFallback>
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
            <Button disabled={createComment.isPending}>
              {createComment.isPending && <Loader className="animate-spin" />}
              Post Comment
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

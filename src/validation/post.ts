import { z } from "zod";

export const newPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  imageUrl: z.string().url("Please enter a valid URL").optional(),
  resources: z.array(
    z.object({
      title: z.string().max(100, "Title is too long"),
      url: z.string().url("Please enter a valid URL"),
    }),
  ),
});

export const newPostCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
});

export type NewPostComment = z.infer<typeof newPostCommentSchema>;

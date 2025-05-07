import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Please enter a valid URL").optional(),
  resources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url("Please enter a valid URL"),
    }),
  ),
});

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { newPostCommentSchema } from "@/validation/post";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      newPostCommentSchema.extend({
        postId: z.string(),
        parentId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.postComment.create({
        data: {
          content: input.content,
          postId: input.postId,
          parentCommentId: input.parentId,
          userId: ctx.session.user.id,
        },
      });
    }),
});

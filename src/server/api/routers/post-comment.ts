import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { newPostCommentSchema } from "@/validation/post";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      newPostCommentSchema.extend({
        postId: z.string(),
        parentId: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a comment",
        });
      }

      return ctx.db.postComment.create({
        data: {
          content: input.content,
          postId: input.postId,
          parentCommentId: input.parentId,
          userId: ctx.session.user.id,
        },
      });
    }),
});

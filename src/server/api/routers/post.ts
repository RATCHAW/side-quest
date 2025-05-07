import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postSchema } from "@/validation/post";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.post.create({
      data: {
        title: input.title,
        description: input.description,
        PostResources: {
          createMany: {
            data: input.resources,
          },
        },
      },
    });
  }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),
});

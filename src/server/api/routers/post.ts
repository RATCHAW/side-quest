import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { newPostSchema } from "@/validation/post";
import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { Prisma, Vote } from "@prisma/client";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          _count: {
            select: {
              votes: {
                where: {
                  voteType: "UP",
                },
              },
              comments: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
              parentComment: {
                select: {
                  id: true,
                  content: true,
                  createdAt: true,
                },
              },
            },
          },
          bookmarks: {
            where: {
              userId: ctx.session?.user.id,
            },
          },
          resources: true,
          votes: {
            where: {
              userId: ctx.session?.user.id,
            },
          },
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Post with id '${input.id}' not found`,
        });
      }
      return post;
    }),

  all: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          title: {
            contains: input.q,
          },
        },
        include: {
          _count: {
            select: {
              votes: {
                where: {
                  voteType: "UP",
                },
              },
              comments: true,
            },
          },

          bookmarks: {
            where: {
              userId: ctx.session?.user.id,
            },
          },
          votes: {
            where: {
              userId: ctx.session?.user.id,
            },
            select: {
              voteType: true,
            },
          },
        },
      });
      return posts;
    }),

  create: publicProcedure
    .input(newPostSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a post",
        });
      }
      return ctx.db.post.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          resources: {
            createMany: {
              data: input.resources,
            },
          },
        },
      });
    }),

  vote: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        voteType: z.enum(["UP", "DOWN", "REMOVE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to vote on a post",
        });
      }
      if (input.voteType === "REMOVE") {
        await ctx.db.postVote.delete({
          where: {
            postId_userId: {
              userId: ctx.session.user.id,
              postId: input.postId,
            },
          },
        });
        return {
          voteType: undefined,
        };
      }
      return await ctx.db.postVote.upsert({
        where: {
          postId_userId: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        },
        create: {
          userId: ctx.session.user.id,
          postId: input.postId,
          voteType: input.voteType,
        },
        update: {
          voteType: input.voteType,
        },

        select: {
          voteType: true,
        },
      });
    }),
  bookmark: publicProcedure
    .input(
      z.object({ postId: z.string(), actionType: z.enum(["ADD", "REMOVE"]) }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to bookmark a post",
        });
      }
      if (input.actionType === "ADD") {
        return await ctx.db.postBookmark.create({
          data: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        });
      }
      if (input.actionType === "REMOVE") {
        return await ctx.db.postBookmark.delete({
          where: {
            postId_userId: {
              userId: ctx.session.user.id,
              postId: input.postId,
            },
          },
        });
      }
    }),
});

type PostRouterOutput = inferRouterOutputs<typeof postRouter>;

export type PostsWithActions = PostRouterOutput["all"];
export type PostWithDetails = PostRouterOutput["getById"];

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { newPostSchema } from "@/validation/post";
import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { Prisma } from "@prisma/client";

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
              userId: ctx.sesssion?.user.id,
            },
          },
          resources: true,
          votes: {
            where: {
              userId: ctx.sesssion?.user.id,
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

  all: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
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
            userId: ctx.sesssion?.user.id,
          },
        },
        votes: {
          where: {
            userId: ctx.sesssion?.user.id,
          },
        },
      },
    });
    return posts;
  }),

  create: publicProcedure
    .input(newPostSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.sesssion?.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a post",
        });
      }
      return ctx.db.post.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.sesssion.user.id,
          resources: {
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

type PostRouterOutput = inferRouterOutputs<typeof postRouter>;

export type PostsWithActions = PostRouterOutput["all"];
export type PostWithDetails = PostRouterOutput["getById"];

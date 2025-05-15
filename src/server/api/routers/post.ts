import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { newPostSchema } from "@/validation/post";
import { TRPCError, type inferRouterOutputs } from "@trpc/server";

export const postRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
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
            resources: true,
          },
        },
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        comments: {
          where: {
            parentCommentId: null,
          },
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
          },
        },
        bookmarks: {
          where: {
            userId: ctx.session?.user.id,
          },
          select: {
            createdAt: true,
          },
        },
        resources: true,
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
    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        cause: "POST_NOT_FOUND",
        message: `Post with id '${input.id}' not found`,
      });
    }
    return post;
  }),

  all: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),

        cursor: z.string().nullish(), // Use post.id as cursor
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, q } = input;

      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            votes: {
              _count: "desc",
            },
          },
          {
            id: "desc",
          },
        ],
        where: {
          title: {
            contains: q,
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
              resources: true,
              comments: true,
            },
          },
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          bookmarks: ctx.session?.user.id
            ? {
                where: {
                  userId: ctx.session?.user.id,
                },
                select: {
                  createdAt: true,
                },
              }
            : undefined,
          votes: ctx.session?.user.id
            ? {
                where: {
                  userId: ctx.session?.user.id,
                },
                select: {
                  voteType: true,
                },
              }
            : undefined,
        },
      });
      const nextCursor = posts.length > limit ? posts.pop()?.id : null;

      return {
        posts,
        nextCursor,
      };
    }),

  create: protectedProcedure.input(newPostSchema).mutation(async ({ ctx, input }) => {
    return await ctx.db.post.create({
      data: {
        title: input.title,
        description: input.description,
        userId: ctx.session.user.id,
        imageUrl: input.imageUrl,
        resources: {
          createMany: {
            data: input.resources,
          },
        },
      },
    });
  }),

  vote: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        voteType: z.enum(["UP", "DOWN", "REMOVE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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
  bookmark: protectedProcedure
    .input(z.object({ postId: z.string(), actionType: z.enum(["ADD", "REMOVE"]) }))
    .mutation(async ({ ctx, input }) => {
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

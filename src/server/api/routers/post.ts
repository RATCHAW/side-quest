import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { newPostSchema } from "@/validation/post";
import { TRPCError, type inferRouterOutputs } from "@trpc/server";
import { Prisma, type PostVote } from "@prisma/client";

export const postRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [post, downVotesCount] = await ctx.db.$transaction(async (tx) => [
      await tx.post.findUnique({
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
          resources: true,
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
              }
            : undefined,
        },
      }),
      await tx.postVote.count({
        where: {
          postId: input.id,
          voteType: "DOWN",
        },
      }),
    ]);

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        cause: "POST_NOT_FOUND",
        message: `Post with id '${input.id}' not found`,
      });
    }
    return {
      ...post,
      _count: {
        ...post._count,
        votes: post._count.votes - downVotesCount,
      },
    };
  }),

  all: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        limit: z.number().min(1).max(20).default(10),
        cursor: z.string().nullish(),
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
            votes: {
              _count: "desc",
            },
          },
          {
            createdAt: "desc",
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
          votes: true,
        },
      });
      const postsWithVoteCount = posts.map((post) => {
        let votesCount = 0;
        post.votes.forEach((vote) => {
          if (vote.voteType === "UP") {
            votesCount++;
          } else {
            votesCount--;
          }
        });
        let userVote: PostVote[] = [];
        if (ctx.session?.user.id) {
          const foundVote = post.votes.find((vote) => vote.userId === ctx.session?.user.id);
          userVote = foundVote ? [foundVote] : [];
        }
        return {
          ...post,
          votes: userVote,
          _count: {
            ...post._count,
            votes: votesCount,
          },
        };
      });
      const nextCursor = posts.length > limit ? posts.pop()?.id : null;

      return {
        posts: postsWithVoteCount,
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

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { postSchema } from "@/validation/post";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

export const postWithActionsInclude =
  Prisma.validator<Prisma.PostFindManyArgs>()({
    include: {
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
      bookmarks: true,
      votes: true,
    },
  });

export type PostWithActions = Prisma.PostGetPayload<
  typeof postWithActionsInclude
>;

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
            },
          },
          comments: {
            include: {
              parentComment: true,
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

  create: publicProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
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

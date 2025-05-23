import { api } from "@/trpc/react";
import type { PostBookmark, PostVote, Vote } from "@prisma/client";

import { LIMIT } from "@/hooks/use-infinite-posts";
import { calculateVotesCount } from "./votes-count";
import { usePathname, useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { postSearchParams } from "./search-params";
import type { PostsWithActions } from "@/server/api/routers/post";
import { toast } from "sonner";

export const usePostMutations = (post?: PostsWithActions["posts"][number]) => {
  const [searchParams, setSearchParams] = useQueryStates(postSearchParams);
  const utils = api.useUtils();
  const router = useRouter();
  const pathname = usePathname();

  const bookmarks = !!pathname.startsWith("/bookmarks");
  const myPosts = !!pathname.startsWith("/myposts");

  const vote = api.post.vote.useMutation({
    onMutate: async ({ postId, voteType }) => {
      if (!post) return;
      const userCurrentVote = post.votes?.length > 0 && post.votes[0]?.voteType;
      const shouldRemoveVote = userCurrentVote === voteType;

      utils.post.all.setInfiniteData(
        { q: searchParams.q ?? undefined, limit: LIMIT, bookmarks, myPosts },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    _count: {
                      ...post._count,
                      votes: calculateVotesCount({
                        currentVoteCount: post._count.votes,
                        userCurrentVote: post.votes?.[0]?.voteType,
                        voteType,
                      }),
                    },
                    votes: shouldRemoveVote ? [] : ([{ voteType: voteType as Vote }] as PostVote[]),
                  };
                }
                return post;
              }),
            })),
          };
        },
      );
    },
  });

  const bookmark = api.post.bookmark.useMutation({
    onMutate: async ({ postId, actionType }) => {
      utils.post.all.setInfiniteData(
        { q: searchParams.q ?? undefined, limit: LIMIT, bookmarks, myPosts },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((item) => {
                if (item.id === postId) {
                  return {
                    ...item,
                    bookmarks: actionType === "ADD" ? ([{ createdAt: new Date() }] as PostBookmark[]) : [],
                  };
                }
                return item;
              }),
            })),
          };
        },
      );
    },
  });

  const deletePost = api.post.delete.useMutation({
    onSuccess: async ({}, { id: postId }) => {
      toast.success("Post deleted successfully");
      utils.post.all.setInfiniteData(
        { q: searchParams.q ?? undefined, limit: LIMIT, bookmarks, myPosts },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((item) => item.id !== postId),
            })),
          };
        },
      );
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: async (data) => {
      utils.post.all.setInfiniteData(
        { q: searchParams.q ?? undefined, limit: LIMIT, bookmarks, myPosts },
        (oldData) => {
          console.log("oldData", oldData, bookmarks, myPosts);
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: [data, ...page.posts],
            })),
          };
        },
      );
    },
  });

  const editPost = api.post.edit.useMutation({
    onSuccess: async (updatedPost, input) => {
      toast.success("Idea has been updated", {
        action: {
          label: "View",
          onClick: () => {
            router.push(`/post/${updatedPost.id}`);
          },
        },
      });
      void setSearchParams({ post_edit_id: null });
      utils.post.all.setInfiniteData(
        { q: searchParams.q ?? undefined, limit: LIMIT, bookmarks, myPosts },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === input.id) {
                  return {
                    ...post,
                    title: updatedPost.title,
                    description: updatedPost.description,
                    resources: updatedPost.resources,
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      // Invalidate the getById query to refresh the detailed view if needed
      await utils.post.getById.invalidate({ id: input.id });
    },
  });

  return {
    editPost,
    createPost,
    vote,
    bookmark,
    deletePost,
  };
};

"use client";

import { PostCard } from "./post-card";
import { useQueryState } from "nuqs";
import { NewPostDialog } from "./new-post";
import { Lightbulb } from "lucide-react";
import { useInfinitePosts } from "@/hooks/use-infinite-posts";
import { useInView } from "react-intersection-observer";
import { PostsSkeleton } from "./skeletons/posts-skeleton";

export const Posts = ({ bookmarks, myPosts }: { bookmarks?: boolean; myPosts?: boolean }) => {
  const [q] = useQueryState("q");

  const [data, { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage }] = useInfinitePosts({
    q: q ?? undefined,
    bookmarks: bookmarks ?? false,
    myPosts: myPosts ?? false,
  });

  const { ref } = useInView({
    threshold: 1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard query={q ?? undefined} key={post.id} post={post} />
        ))}
        {isFetchingNextPage || isFetching ? <PostsSkeleton /> : hasNextPage ? <div ref={ref}></div> : null}
      </div>
      <div>
        {posts.length === 0 &&
          (!bookmarks ? (
            <div className="bg-background my-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center shadow-sm">
              <div className="mb-4 rounded-full border p-4">
                <Lightbulb className="text-yellow-200" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">{q ? `No posts about "${q}" yet ` : "Create the first post"}</h2>
              <p className="mb-6 max-w-md">
                {q
                  ? "Be the first to share your thoughts on this topic and start the conversation!"
                  : "Share your thoughts and kick off the discussion. Your post will appear right here."}
              </p>
              <div className="mt-2 transform transition-transform hover:scale-105">
                <NewPostDialog />
              </div>
            </div>
          ) : (
            <div className="text-center">You have no bookmarks yet</div>
          ))}
      </div>
    </div>
  );
};

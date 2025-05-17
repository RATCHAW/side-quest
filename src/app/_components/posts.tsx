import { api, HydrateClient } from "@/trpc/server";
import { PostsClient } from "./posts-client";
import { LIMIT } from "@/hooks/use-infinite-posts";

export const Posts = async ({ q }: { q: string | null }) => {
  void api.post.all.prefetchInfinite({ q: q ?? undefined, limit: LIMIT });
  return (
    <HydrateClient>
      <PostsClient />
    </HydrateClient>
  );
};

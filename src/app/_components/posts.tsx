import { api, HydrateClient } from "@/trpc/server";
import { PostsClient } from "./posts-client";

export const Posts = async ({ q }: { q: string | null }) => {
  void api.post.all.prefetch({ q: q ?? undefined });
  return (
    <HydrateClient>
      <PostsClient />
    </HydrateClient>
  );
};

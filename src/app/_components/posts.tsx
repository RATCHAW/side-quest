import { api, HydrateClient } from "@/trpc/server";
import { PostsClient } from "./postsClient";

export const Posts = async ({ q }: { q: string | null }) => {
  await api.post.all.prefetch({ q: q ?? undefined });
  return (
    <HydrateClient>
      <PostsClient />
    </HydrateClient>
  );
};

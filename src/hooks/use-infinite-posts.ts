import { api } from "@/trpc/react";

export const LIMIT = 9;

export function useInfinitePosts({ query }: { query: string | null }) {
  return api.post.all.useInfiniteQuery(
    { limit: LIMIT, q: query ?? undefined },

    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
    },
  );
}

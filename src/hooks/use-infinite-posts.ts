import { api } from "@/trpc/react";
import { useDebounce } from "use-debounce";

export const LIMIT = 9;

export function useInfinitePosts({ query }: { query: string | null }) {
  const [debouncedQuery] = useDebounce(query, 300);

  return api.post.all.useSuspenseInfiniteQuery(
    { limit: LIMIT, q: debouncedQuery ?? undefined },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
    },
  );
}

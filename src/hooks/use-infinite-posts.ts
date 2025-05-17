import type { PostAllInput } from "@/server/api/routers/post";
import { api } from "@/trpc/react";
import { useDebounce } from "use-debounce";

export const LIMIT = 9;

export function useInfinitePosts(inputs: PostAllInput) {
  const [debouncedQuery] = useDebounce(inputs.q, 300);
  return api.post.all.useSuspenseInfiniteQuery(
    { limit: LIMIT, q: debouncedQuery ?? undefined, ...inputs },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
    },
  );
}

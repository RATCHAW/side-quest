import { loadSearchParams } from "./_components/search-params";
import { Suspense } from "react";
import { PostsSkeleton } from "./_components/skeletons/posts-skeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Posts } from "./_components/posts";
import { LIMIT } from "@/hooks/use-infinite-posts";

const HomePage = async ({ searchParams }: { searchParams: Promise<{ p: string; q: string }> }) => {
  const { q } = await loadSearchParams(searchParams);
  void api.post.all.prefetchInfinite({ q: q ?? undefined, limit: LIMIT, bookmarks: false, myPosts: false });
  return (
    <div>
      <HydrateClient>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PostsSkeleton />
            </div>
          }
        >
          <Posts />
        </Suspense>
      </HydrateClient>
    </div>
  );
};

export default HomePage;

import { loadSearchParams } from "../_components/search-params";
import { Suspense } from "react";
import { PostsSkeleton } from "../_components/skeletons/posts-skeleton";
import { api, HydrateClient } from "@/trpc/server";
import { Posts } from "../_components/posts";
import { LIMIT } from "@/hooks/use-infinite-posts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const IdeaPage = async ({ searchParams }: { searchParams: Promise<{ p: string; q: string }> }) => {
  const { q } = await loadSearchParams(searchParams);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Please sign in to view your bookmarks</h1>
      </div>
    );
  }
  void api.post.all.prefetchInfinite({ q: q ?? undefined, limit: LIMIT, bookmarks: true, myPosts: false });
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
          <Posts bookmarks={true} />
        </Suspense>
      </HydrateClient>
    </div>
  );
};

export default IdeaPage;

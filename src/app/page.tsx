import { loadSearchParams } from "./_components/search-params";
import { Posts } from "./_components/posts";
import { Suspense } from "react";
import { PostsSkeleton } from "./_components/skeletons/posts-skeleton";

const IdeaPage = async ({ searchParams }: { searchParams: Promise<{ p: string; q: string }> }) => {
  const { q } = await loadSearchParams(searchParams);

  return (
    <div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PostsSkeleton />
          </div>
        }
      >
        <Posts q={q} />
      </Suspense>
    </div>
  );
};

export default IdeaPage;

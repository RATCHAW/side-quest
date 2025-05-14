import { loadSearchParams } from "./_components/search-params";
import { Posts } from "./_components/posts";
import { Suspense } from "react";
import { PostsSkeleton } from "./_components/skeletons/posts-skeleton";

const IdeaPage = async ({ searchParams }: { searchParams: Promise<{ p: string; q: string }> }) => {
  const { q } = await loadSearchParams(searchParams);

  return (
    <div>
      <Suspense fallback={<PostsSkeleton />}>
        <Posts q={q} />
      </Suspense>
    </div>
  );
};

export default IdeaPage;

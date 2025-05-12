import { loadSearchParams } from "./_components/searchparams";
import { Posts } from "./_components/posts";
import { Suspense } from "react";

const IdeaPage = async ({ searchParams }: { searchParams: Promise<{ p: string; q: string }> }) => {
  const { q } = await loadSearchParams(searchParams);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense key={q} fallback={<div>Loading...</div>}>
        <Posts q={q} />
      </Suspense>
    </div>
  );
};

export default IdeaPage;

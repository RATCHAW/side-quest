import { api } from "@/trpc/server";
import { PostDialog } from "./_components/post-dialog";
import type { PostWithDetails } from "@/server/api/routers/post";
import { loadSearchParams } from "./_components/searchparams";
import { Posts } from "./_components/posts";
import { Suspense } from "react";

const IdeaPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ p: string; q: string }>;
}) => {
  const { p, q } = await loadSearchParams(searchParams);
  let postDetails: PostWithDetails | null = null;
  if (p) {
    postDetails = await api.post.getById({ id: p });
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense key={q} fallback={<div>Loading...</div>}>
        <Posts q={q} />
      </Suspense>
      {postDetails && <PostDialog post={postDetails} />}
    </div>
  );
};

export default IdeaPage;

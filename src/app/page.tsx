import { api } from "@/trpc/server";
import { PostCard } from "./_components/post-card";
import { PostDialog } from "./_components/post-dialog";
import type { PostWithDetails } from "@/server/api/routers/post";
import { Suspense } from "react";
import { Posts } from "./_components/posts";
import { loadSearchParams } from "./_components/searchparams";

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
  console.log("q", q);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense key={q} fallback={<div>Loading...</div>}>
        <Posts key={q} query={q ? q : undefined} />
      </Suspense>
      {postDetails && <PostDialog post={postDetails} />}
    </div>
  );
};

export default IdeaPage;

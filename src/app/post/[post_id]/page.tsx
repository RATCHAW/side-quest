import { Suspense } from "react";
import { Post } from "./_components/post";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page({ params }: { params: Promise<{ post_id: string }> }) {
  const { post_id } = await params;
  void api.post.getById.prefetch({ id: post_id });
  return (
    <HydrateClient>
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <Post post_id={post_id} />
      </Suspense>
    </HydrateClient>
  );
}

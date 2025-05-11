"use client";

import { api } from "@/trpc/react";
import { PostCard } from "./post-card";
import { useSearchParams } from "next/navigation";

export const PostsClient = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q");

  const { data: posts } = api.post.all.useQuery({
    q: search ?? undefined,
  });

  return (
    <>
      {posts?.map((post) => (
        <PostCard query={search ?? undefined} key={post.id} post={post} />
      ))}
    </>
  );
};

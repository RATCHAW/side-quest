"use client";

import { api } from "@/trpc/react";
import { PostCard } from "./post-card";
import { useQueryState } from "nuqs";

export const PostsClient = () => {
  const [q] = useQueryState("q");

  const { data: posts } = api.post.all.useQuery({
    q: q ?? undefined,
  });

  return <>{posts?.map((post) => <PostCard query={q ?? undefined} key={post.id} post={post} />)}</>;
};

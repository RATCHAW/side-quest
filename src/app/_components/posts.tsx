import { api } from "@/trpc/server";
import { PostCard } from "./post-card";

export const Posts = async ({ query }: { query: string | undefined }) => {
  const posts = await api.post.all({ q: query });
  return (
    <>
      {posts.map((post) => (
        <PostCard query={query} key={post.id} post={post} />
      ))}
    </>
  );
};

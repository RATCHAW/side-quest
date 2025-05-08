import { api } from "@/trpc/server";
import { PostCard } from "./post-card";

export const Posts = async () => {
  const posts = await api.post.all();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

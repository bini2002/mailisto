import type { BlogPost } from "@/lib/types";
import { BlogCard } from "./BlogCard";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <BlogCard key={p.id} post={p} />
      ))}
    </div>
  );
}

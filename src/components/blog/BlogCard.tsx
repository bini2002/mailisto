import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export function BlogCard({ post, large = false }: { post: BlogPost; large?: boolean }) {
  return (
    <article className="reveal group relative flex h-full flex-col border-t border-ink pt-6">
      {post.featured_image_url && (
        <div className={cn("relative mb-6 overflow-hidden bg-paper-2", large ? "aspect-[16/9]" : "aspect-[16/10]")}>
          <Image
            src={post.featured_image_url}
            alt={post.featured_image_alt || ""}
            fill
            sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <p className="label flex items-center gap-3 text-muted">
        {post.category && <span className="text-ink">{post.category}</span>}
        <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
      </p>
      <h3 className={cn("mt-4 font-semibold tracking-tight", large ? "text-3xl sm:text-4xl" : "text-xl")}>
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:underline group-hover:decoration-lime group-hover:decoration-2 group-hover:underline-offset-4">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className={cn("mt-3 text-muted", large && "text-lg")}>{post.excerpt}</p>}
      <span className="label mt-auto pt-6 text-ink">Read article →</span>
    </article>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, StatusPill } from "@/components/admin/AdminTable";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";
import type { BlogPost } from "@/lib/types";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as BlogPost;
  return (
    <>
      <Link href="/admin/posts" className="text-sm text-muted hover:text-ink">
        ← All posts
      </Link>
      <div className="mt-4">
        <AdminPageHeader
          title={post.title}
          actions={
            <>
              <StatusPill value={post.status} />
              {post.status === "published" && (
                <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm underline underline-offset-2">
                  View live ↗
                </Link>
              )}
            </>
          }
        />
      </div>
      <PostForm key={post.updated_at} post={post} />
    </>
  );
}

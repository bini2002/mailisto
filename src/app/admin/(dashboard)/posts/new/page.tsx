import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminTable";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/posts" className="text-sm text-muted hover:text-ink">
        ← All posts
      </Link>
      <div className="mt-4">
        <AdminPageHeader title="New post" />
      </div>
      <PostForm />
    </>
  );
}

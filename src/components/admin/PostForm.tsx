import { deletePost, savePost } from "@/app/admin/actions";
import type { BlogPost } from "@/lib/types";
import { ActionButton, AdminForm } from "./AdminForm";
import { AdminCheckbox, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "./AdminFields";
import { ImageUploader } from "./ImageUploader";

const CATEGORIES = ["Klaviyo", "Flows", "Campaigns", "Segmentation", "Deliverability", "Design", "Copywriting", "Retention", "Strategy", "BFCM"];

export function PostForm({ post }: { post?: BlogPost }) {
  return (
    <>
      <AdminForm action={savePost} submitLabel={post ? "Save changes" : "Create post"}>
        {post && <input type="hidden" name="id" value={post.id} />}
        <AdminSection title="Article">
          <AdminInput name="title" label="Title" defaultValue={post?.title} required maxLength={200} />
          <AdminInput name="slug" label="Slug" hint="URL: /blog/your-slug. Leave blank to generate from the title." defaultValue={post?.slug} maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" />
          <AdminTextarea name="excerpt" label="Excerpt" hint="One or two sentences for cards and search results." rows={3} maxLength={400} defaultValue={post?.excerpt ?? ""} />
          <AdminTextarea
            name="content"
            label="Content (Markdown)"
            hint="## Heading, ### Subheading, **bold**, *italic*, - lists, 1. lists, > quote, [link](https://…), ![alt](https://image-url)"
            rows={24}
            defaultValue={post?.content ?? ""}
            className="font-mono"
          />
        </AdminSection>

        <AdminSection title="Details">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminSelect name="category" label="Category" options={[{ value: "", label: "None" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]} defaultValue={post?.category ?? ""} />
            <AdminInput name="author_name" label="Author" defaultValue={post?.author_name ?? "Mailisto"} maxLength={80} />
          </div>
          <ImageUploader name="featured_image_url" label="Featured image" folder="blog" defaultValue={post?.featured_image_url} hint="Optional. 1600×900 works well." />
          <AdminInput name="featured_image_alt" label="Featured image alt text" defaultValue={post?.featured_image_alt ?? ""} maxLength={200} />
        </AdminSection>

        <AdminSection title="Publishing">
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminSelect name="status" label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} defaultValue={post?.status ?? "draft"} />
            <AdminInput name="published_at" type="datetime-local" label="Publish date (UTC)" hint="Leave blank to use now when publishing. Future dates are scheduled." defaultValue={post?.published_at ? post.published_at.slice(0, 16) : ""} />
          </div>
          <AdminCheckbox name="featured" label="Featured article" hint="Shown first on the blog page." defaultChecked={post?.featured} />
        </AdminSection>

        <AdminSection title="SEO" description="Optional overrides. Defaults to the title and excerpt.">
          <AdminInput name="seo_title" label="SEO title" maxLength={70} hint="Up to 70 characters." defaultValue={post?.seo_title ?? ""} />
          <AdminTextarea name="seo_description" label="Meta description" maxLength={170} rows={2} hint="Up to 170 characters." defaultValue={post?.seo_description ?? ""} />
          <ImageUploader name="og_image_url" label="Social share image" folder="blog" defaultValue={post?.og_image_url} hint="1200×630. Falls back to the featured image, then the site default." />
        </AdminSection>
      </AdminForm>
      {post && (
        <div className="mt-6 flex justify-end">
          <ActionButton action={deletePost} values={{ id: post.id }} label="Delete post" variant="danger" confirm="Delete this post permanently?" />
        </div>
      )}
    </>
  );
}

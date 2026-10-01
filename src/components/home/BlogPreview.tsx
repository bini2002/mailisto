import { getPublishedPosts } from "@/lib/data";
import { BlogGrid } from "../blog/BlogGrid";
import { LinkButton } from "../ui/Button";
import { SectionHeading } from "../ui/SectionHeading";

export async function BlogPreview() {
  const posts = await getPublishedPosts(3);
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="blog-title" className="section-y border-t border-line bg-white">
      <div className="container-x">
        <SectionHeading
          id="blog-title"
          index="08"
          label="From the blog"
          title="Notes on email, SMS and ecommerce retention."
          intro={
            <>
              <p>Practical articles for founders and ecommerce teams. No filler.</p>
              <LinkButton href="/blog" variant="outline" size="sm" className="mt-6" arrow beam={false}>
                All articles
              </LinkButton>
            </>
          }
        />
        <div className="mt-14">
          <BlogGrid posts={posts} />
        </div>
      </div>
    </section>
  );
}

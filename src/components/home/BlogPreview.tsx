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
          title="Email & SMS advice, minus the waffle."
          intro={
            <>
              <p>Short, practical articles for busy shop owners. Read one with your coffee.</p>
              <LinkButton href="/blog" variant="outline" size="sm" className="mt-6" arrow>
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

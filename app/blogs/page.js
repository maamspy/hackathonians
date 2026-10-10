import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/blog";

const ACCENTS = {
  blue: "bg-brand-blue",
  purple: "bg-brand-purple",
  yellow: "bg-brand-yellow",
};

export const metadata = {
  title: "Blogs",
  description: "Announcements, build stories, the occasional 3am thought.",
};

export default async function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.find((post) => post.featured);
  const rest = posts.filter((post) => !post.featured);

  return (
    <div className="bg-background font-display text-foreground">
      <main className="py-10">
        <header className="max-w-2xl">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
            Blogs
          </h1>
          <p className="mt-3 text-lg text-foreground/70">
            Announcements, build stories, the occasional 3am thought.
          </p>
        </header>

        {featured && (
          <div className="mt-10">
            <Link
              href={`/blogs/${featured.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg bg-card p-6 transition hover:bg-card/80 sm:p-8"
            >
              <span
                aria-hidden
                className={`h-1 w-10 transition-all duration-300 group-hover:w-full ${
                  ACCENTS[featured.accent] ?? ACCENTS.blue
                }`}
              />
              <p className="mt-4 text-xs font-bold uppercase tracking-tight text-brand-blue">
                Featured
              </p>
              <h2 className="mt-2 text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight tracking-tight transition group-hover:text-brand-blue">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl text-foreground/70">
                {featured.description}
              </p>
              <PostMeta post={featured} className="mt-6" />
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg bg-card p-6 transition hover:bg-card/80"
            >
              <span
                aria-hidden
                className={`h-1 w-10 transition-all duration-300 group-hover:w-full ${
                  ACCENTS[post.accent] ?? ACCENTS.blue
                }`}
              />
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight transition group-hover:text-brand-blue">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/60">
                {post.description}
              </p>
              <PostMeta post={post} className="mt-6" />
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="mt-10 text-foreground/70">No posts yet.</p>
        )}
      </main>
    </div>
  );
}

function PostMeta({ post, className = "" }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-tight text-foreground/50 ${className}`}
    >
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>|</span>
      <span>{post.readingTime} min read</span>
      {post.tags?.map((tag) => (
        <span
          key={tag}
          className="rounded-sm bg-foreground/5 px-2 py-1 text-foreground/70"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

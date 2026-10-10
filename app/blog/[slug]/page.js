import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { db } from "@/data";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = db.posts.findById(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="bg-background font-display text-foreground">
      <main className="py-10">
        <article className="mx-auto max-w-3xl">
          <header>
            <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              {post.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-4">
              {post.author && (
                <a
                  href={`https://github.com/${post.author.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Avatar>
                    <AvatarImage
                      src={post.author.avatarUrl}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {post.author.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-foreground">
                    {post.author.name}
                  </span>
                </a>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-tight text-foreground/50">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden>|</span>
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </header>

          <div className="prose-hackathonians mt-8">
            <MDXRemote source={post.source} />
          </div>

          {post.tags?.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm bg-foreground/5 px-2 py-1 text-xs font-bold uppercase tracking-tight text-foreground/70"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </article>
      </main>
    </div>
  );
}

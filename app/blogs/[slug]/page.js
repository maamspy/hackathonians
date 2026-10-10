import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { JsonLd } from "@/components/shared";
import { db } from "@/data";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import {
  OG_SIZE,
  absoluteUrl,
  blogPostingLd,
  breadcrumbLd,
  graphLd,
  pageMetadata,
  webPageLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = db.posts.findById(slug);
  if (!post) return {};

  const ogImage = `${absoluteUrl("/")}blogs/${slug}/opengraph-image`;
  const twitterImage = `${absoluteUrl("/")}blogs/${slug}/twitter-image`;

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blogs/${slug}`,
    ogType: "article",
    publishedTime: post.date,
    modifiedTime: post.modifiedDate ?? post.date,
    authors: post.author ? [`https://github.com/${post.author}`] : undefined,
    tags: post.tags,
    images: [
      {
        url: ogImage,
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt: post.title,
      },
    ],
    twitterImages: [
      {
        url: twitterImage,
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt: post.title,
      },
    ],
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const breadcrumbs = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blogs" },
    { name: post.title, path: `/blogs/${slug}` },
  ]);

  const jsonLd = graphLd([
    webPageLd({
      path: `/blogs/${slug}`,
      title: post.title,
      description: post.description,
      breadcrumb: { "@id": `${absoluteUrl(`/blogs/${slug}`)}#breadcrumb` },
    }),
    { ...breadcrumbs, "@id": `${absoluteUrl(`/blogs/${slug}`)}#breadcrumb` },
    blogPostingLd(post, {
      author: post.author
        ? {
            name: post.author.name,
            username: post.author.username,
            url: `https://github.com/${post.author.username}`,
          }
        : null,
      image: post.banner ? absoluteUrl(post.banner) : undefined,
    }),
  ]);

  return (
    <div className="bg-background font-display text-foreground">
      <JsonLd data={jsonLd} />
      <main className="py-10">
        <article className="mx-auto max-w-3xl">
          {post.banner && (
            <Image
              src={post.banner}
              alt=""
              width={1200}
              height={600}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="mb-8 h-auto w-full rounded-lg border border-border"
            />
          )}
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

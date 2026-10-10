import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/data";
import { getGitHubProfile } from "./github";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function getAllPosts() {
  return [...db.posts.all()].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
}

export function getPostBySlug(slug) {
  return db.posts.findById(slug);
}

const normalizeHeading = (value) =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function stripDuplicateTitle(source, title, slug) {
  if (!title) return source;

  const match = source.match(/^\uFEFF?\s*#[ \t]+(.+?)[ \t]*\r?\n/);
  if (!match) return source;

  const [line, heading] = match;
  if (normalizeHeading(heading) !== normalizeHeading(title)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[blog] "${slug}" opens with "# ${heading}", which differs from its title in data/posts.js.`,
      );
    }
    return source;
  }

  return source.slice(line.length).replace(/^\s+/, "");
}

export async function getPostSource(slug) {
  const post = getPostBySlug(slug);
  const source = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  return stripDuplicateTitle(source, post?.title, slug);
}

export async function getPost(slug) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const [source, author] = await Promise.all([
    getPostSource(slug),
    post.author
      ? Promise.resolve(getGitHubProfile(post.author)).then((profile) => ({
          username: post.author,
          ...profile,
        }))
      : null,
  ]);

  return { ...post, source, author };
}

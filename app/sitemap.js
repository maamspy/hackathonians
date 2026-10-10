import { db } from "@/data";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

const newestDate = (dates) => {
  const newest = dates
    .filter(Boolean)
    .map((date) => new Date(date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a)[0];
  return newest ?? null;
};

export default function sitemap() {
  const posts = getAllPosts();
  const members = db.members.all();
  const mentors = db.mentors.all();

  const lastPostDate = newestDate(posts.map((post) => post.date));
  const lastEventDate = newestDate(db.events.all().map((event) => event.date));

  const entry = (path, extra = {}) => ({
    url: absoluteUrl(path),
    ...extra,
  });

  return [
    entry("/", {
      lastModified: lastPostDate,
      changeFrequency: "weekly",
      priority: 1,
    }),
    entry("/projects", {
      lastModified: lastEventDate,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    entry("/blogs", {
      lastModified: lastPostDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    entry("/members", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/mentors", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/upcoming", {
      lastModified: lastEventDate,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
    entry("/previous", {
      lastModified: lastEventDate,
      changeFrequency: "monthly",
      priority: 0.6,
    }),

    ...posts.map((post) =>
      entry(`/blogs/${post.slug}`, {
        lastModified: newestDate([post.modifiedDate, post.date]),
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    ),

    ...members.map((member) =>
      entry(`/members/${member.id}`, {
        changeFrequency: "monthly",
        priority: 0.5,
      }),
    ),

    ...mentors.map((mentor) =>
      entry(`/mentors/${mentor.id}`, {
        changeFrequency: "monthly",
        priority: 0.6,
      }),
    ),
  ];
}

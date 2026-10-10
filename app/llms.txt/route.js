import { db } from "@/data";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl, siteConfig } from "@/lib/seo";

function buildLlmsTxt() {
  const posts = getAllPosts();
  const members = db.members.all();
  const mentors = db.mentors.all();

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.tagline}`,
    "",
    siteConfig.description,
    "",
    "## Pages",
    "",
    `- [Home](${absoluteUrl("/")})- ${siteConfig.name} | A teenage hackathon team from Dhaka, Bangladesh.`,
    `- [Projects](${absoluteUrl("/projects")})- Open-source web and AI projects we shipped at hackathons.`,
    `- [Blogs](${absoluteUrl("/blogs")})- Announcements, build stories and hackathon write-ups.`,
    `- [Members](${absoluteUrl("/members")})- The people who showed up and built things.`,
    `- [Mentors](${absoluteUrl("/mentors")})- The mentors who show up for our teams.`,
    `- [Upcoming hackathons](${absoluteUrl("/upcoming")})- Hackathons we are joining next.`,
    `- [Previous hackathons](${absoluteUrl("/previous")})- Hackathons we have already taken part in.`,
    "",
    `## Blog (${posts.length} post${posts.length === 1 ? "" : "s"})`,
    "",
    ...posts.map(
      (post) =>
        `- [${post.title}](${absoluteUrl(`/blogs/${post.slug}`)})- ${post.description}`,
    ),
    "",
    `## Mentors (${mentors.length})`,
    "",
    ...mentors.map(
      (mentor) =>
        `- [${mentor.name}](${absoluteUrl(`/mentors/${mentor.id}`)})- ${mentor.role}${
          mentor.organization ? ` at ${mentor.organization}` : ""
        }.${mentor.bio ? ` ${mentor.bio}` : ""}`,
    ),
    "",
    `## Members (${members.length})`,
    "",
    `- [All members](${absoluteUrl("/members")})`,
    "",
    "## Optional",
    "",
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})- Every indexable URL on the site.`,
    "",
  ];

  return lines.join("\n");
}

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

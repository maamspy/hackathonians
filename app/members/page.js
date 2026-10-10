import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import { JsonLd } from "@/components/shared";
import { getMembers } from "@/lib/members";
import {
  absoluteUrl,
  breadcrumbLd,
  graphLd,
  itemListLd,
  pageMetadata,
  webPageLd,
} from "@/lib/seo";

const DESCRIPTION =
  "Meet the teenage developers of Team Hackathonians. The people who showed up to hackathons across Bangladesh and built things.";

export const metadata = pageMetadata({
  title: "Members",
  description: DESCRIPTION,
  path: "/members",
});

export default async function MembersPage() {
  const members = (await getMembers()).filter((member) => member.membership);

  return (
    <div className="bg-background font-display text-foreground">
      <JsonLd
        data={graphLd([
          webPageLd({
            path: "/members",
            title: "Members | Hackathonians",
            description: DESCRIPTION,
            breadcrumb: breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Members", path: "/members" },
            ]),
          }),
          itemListLd(
            "Members",
            members.map((member) => ({
              name: member.name,
              url: absoluteUrl(`/members/${member.id}`),
            })),
          ),
        ])}
      />
      <main className="py-10">
        <header className="max-w-2xl">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
            Members
          </h1>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className="group relative flex flex-col overflow-hidden rounded-lg bg-card p-6"
            >
              <span
                aria-hidden
                className="h-1 w-10 transition-all duration-300 group-hover:w-full bg-brand-blue"
              />

              <div className="mt-4 flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>
                    {member.github.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Link
                    href={`/members/${member.id}`}
                    className="text-xl font-bold tracking-tight transition hover:text-brand-blue"
                  >
                    {member.name}
                  </Link>
                  <p className="text-sm text-foreground/50">@{member.github}</p>
                </div>
              </div>

              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-tight text-foreground/50">
                <div className="flex gap-1.5">
                  <dt>Teams</dt>
                  <dd className="text-foreground">{member.teams.length}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>Projects</dt>
                  <dd className="text-foreground">{member.projects.length}</dd>
                </div>
              </dl>

              <div className="mt-5 flex shrink-0 items-center gap-4">
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`@${member.github} on GitHub`}
                  aria-label={`@${member.github} on GitHub`}
                  className="text-foreground transition hover:text-brand-blue"
                >
                  <FaGithub className="size-5" aria-hidden />
                </a>
                {member.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${member.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${member.name} on LinkedIn`}
                    aria-label={`${member.name} on LinkedIn`}
                    className="text-foreground transition hover:text-brand-blue"
                  >
                    <FaLinkedin className="size-5" aria-hidden />
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${member.name} portfolio`}
                    aria-label={`${member.name} portfolio`}
                    className="text-foreground transition hover:text-brand-blue"
                  >
                    <FaGlobe className="size-5" aria-hidden />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

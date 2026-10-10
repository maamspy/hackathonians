import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { JsonLd } from "@/components/shared";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import { db } from "@/data";
import { getMember } from "@/lib/members";
import { formatDate } from "@/lib/blog";
import {
  absoluteUrl,
  breadcrumbLd,
  graphLd,
  pageMetadata,
  personLd,
  webPageLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return db.members.all().map((member) => ({ id: member.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return {};

  return pageMetadata({
    title: `${member.name} (@${member.github})`,
    description: `${member.name} is a ${member.membership ? "member" : "contributor"} of Team Hackathonians in Dhaka, Bangladesh, taking part in hackathons and building open-source projects.`,
    path: `/members/${member.id}`,
  });
}

export default async function MemberPage({ params }) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  const statusesById = new Map(db.statuses.all().map((s) => [s.id, s]));

  const path = `/members/${member.id}`;
  const projects = member.projects ?? [];

  const sameAs = [
    `https://github.com/${member.github}`,
    member.linkedin ? `https://linkedin.com/in/${member.linkedin}` : null,
    member.website ?? null,
  ].filter(Boolean);

  const jsonLd = graphLd([
    webPageLd({
      path,
      title: `${member.name} | Hackathonians`,
      description: `${member.name} | Member of Team Hackathonians.`,
      breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` },
    }),
    {
      ...breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Members", path: "/members" },
        { name: member.name, path },
      ]),
      "@id": `${absoluteUrl(path)}#breadcrumb`,
    },
    {
      "@type": "ProfilePage",
      "@id": `${absoluteUrl(path)}#profilepage`,
      url: absoluteUrl(path),
      name: `${member.name} | Hackathonians`,
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      about: { "@id": `${absoluteUrl(path)}#person` },
      mainEntity: { "@id": `${absoluteUrl(path)}#person` },
    },
    personLd({
      name: member.name,
      path,
      description: `${member.name} is a ${member.membership ? "member" : "contributor"} of Team Hackathonians, a teenage hackathon team in Dhaka, Bangladesh.`,
      image: member.avatarUrl,
      jobTitle: member.membership ? "Member" : "Contributor",
      memberOf: { "@id": `${absoluteUrl("/")}#organization` },
      knowsAbout: projects.flatMap((project) => project.tags ?? []),
      sameAs,
    }),
  ]);

  return (
    <div className="bg-background font-display text-foreground">
      <JsonLd data={jsonLd} />
      <main className="py-10">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-foreground/60 transition hover:text-brand-blue"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All members
        </Link>

        <header className="mt-8 flex flex-wrap items-center gap-5">
          <Avatar className="size-20">
            <AvatarImage src={member.avatarUrl} alt={member.name} />
            <AvatarFallback className="text-2xl">
              {member.github.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight">
              {member.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4">
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
          </div>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Teams</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {member.teams.map((team) => (
              <article
                key={team.id}
                className="flex flex-col rounded-lg bg-card p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight">
                    {team.name}
                  </h3>
                  {team.rank && (
                    <span className="inline-flex items-center rounded-sm bg-brand-blue px-2 py-1 text-xl font-bold text-brand-white">
                      <Hash className="size-4" />
                      {team.rank}
                    </span>
                  )}
                </div>

                {team.event && (
                  <div className="mt-2 text-xs font-bold uppercase tracking-tight text-foreground/50">
                    <Link
                      href={`/events/${team.event.id}`}
                      className="block text-brand-blue transition hover:text-brand-blue/70"
                    >
                      {team.event.name}
                    </Link>
                    <time dateTime={team.event.date}>
                      {formatDate(team.event.date)}
                    </time>
                  </div>
                )}

                {team.statuses?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {team.statuses.map((statusId) => {
                      const status = statusesById.get(statusId);
                      return status ? (
                        <li
                          key={status.id}
                          className="rounded-sm bg-brand-yellow px-2 py-1 text-xs font-bold uppercase tracking-tight text-brand-black"
                        >
                          {status.label}
                        </li>
                      ) : null;
                    })}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        {member.projects.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {member.projects.map((project) => (
                <li
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-card p-5"
                >
                  <div className="min-w-0">
                    <Link
                      href="/projects"
                      className="text-lg font-bold tracking-tight transition hover:text-brand-blue"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-1 text-sm text-foreground/60">
                      {project.tagline}
                    </p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-sm bg-foreground/5 px-2 py-1 text-xs font-bold uppercase tracking-tight text-foreground/70"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

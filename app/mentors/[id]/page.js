import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import { JsonLd } from "@/components/shared";
import { db } from "@/data";
import { formatDate } from "@/lib/blog";
import { experienceForMentor } from "@/lib/mentors";
import {
  absoluteUrl,
  breadcrumbLd,
  graphLd,
  pageMetadata,
  personLd,
  webPageLd,
} from "@/lib/seo";

const ACCENTS = {
  blue: "bg-brand-blue",
  purple: "bg-brand-purple",
  yellow: "bg-brand-yellow",
};

const SOCIALS = [
  {
    key: "github",
    label: "GitHub",
    href: (m) => `https://github.com/${m.github}`,
    Icon: FaGithub,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: (m) => `https://linkedin.com/in/${m.linkedin}`,
    Icon: FaLinkedin,
  },
  { key: "website", label: "Website", href: (m) => m.website, Icon: FaGlobe },
];

export function generateStaticParams() {
  return db.mentors.all().map((mentor) => ({ id: mentor.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const mentor = db.mentors.findById(id);
  if (!mentor) return {};

  const description =
    mentor.bio ??
    `${mentor.name} is ${mentor.role} at ${mentor.organization}, mentoring Team Hackathonians at hackathons in Dhaka, Bangladesh.`;

  return pageMetadata({
    title: `${mentor.name}, ${mentor.role}`,
    description,
    path: `/mentors/${id}`,
    tags: mentor.topics,
  });
}

export default async function MentorPage({ params }) {
  const { id } = await params;
  const mentor = db.mentors.findById(id);
  if (!mentor) notFound();

  const statusesById = new Map(db.statuses.all().map((s) => [s.id, s]));
  const experience = experienceForMentor(mentor.id);
  const teams = db.teams
    .all()
    .filter((team) => team.mentors?.includes(mentor.id))
    .map((team) => ({ ...team, event: db.events.findById(team.eventId) }))
    .filter((team) => team.event)
    .sort((a, b) => new Date(b.event.date) - new Date(a.event.date));

  const path = `/mentors/${mentor.id}`;
  const sameAs = [
    mentor.github ? `https://github.com/${mentor.github}` : null,
    mentor.linkedin ? `https://linkedin.com/in/${mentor.linkedin}` : null,
    mentor.researchgate
      ? `https://www.researchgate.net/profile/${mentor.researchgate}`
      : null,
    mentor.website ?? null,
  ].filter(Boolean);

  const jsonLd = graphLd([
    webPageLd({
      path,
      title: `${mentor.name} | Hackathonians`,
      description: mentor.bio ?? `${mentor.name}, ${mentor.role}.`,
      breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` },
    }),
    {
      ...breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Mentors", path: "/mentors" },
        { name: mentor.name, path },
      ]),
      "@id": `${absoluteUrl(path)}#breadcrumb`,
    },
    {
      "@type": "ProfilePage",
      "@id": `${absoluteUrl(path)}#profilepage`,
      url: absoluteUrl(path),
      name: `${mentor.name} | Hackathonians`,
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      about: { "@id": `${absoluteUrl(path)}#person` },
      mainEntity: { "@id": `${absoluteUrl(path)}#person` },
    },
    personLd({
      name: mentor.name,
      path,
      description: mentor.bio,
      image: mentor.image ? absoluteUrl(mentor.image) : undefined,
      jobTitle: mentor.role,
      worksFor: mentor.organization
        ? { name: mentor.organization, url: mentor.organizationUrl }
        : null,
      knowsAbout: mentor.topics ?? [],
      sameAs,
    }),
  ]);

  return (
    <div className="bg-background font-display text-foreground">
      <JsonLd data={jsonLd} />
      <main className="py-10">
        <Link
          href="/mentors"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-foreground/60 transition hover:text-brand-blue"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All mentors
        </Link>

        <header className="mt-8 flex flex-wrap items-start gap-5">
          {mentor.image ? (
            <Image
              src={mentor.image}
              alt={`${mentor.name}, ${mentor.role}`}
              width={112}
              height={112}
              className="size-24 shrink-0 rounded-full object-cover sm:size-28"
            />
          ) : (
            <div
              aria-hidden
              className="flex size-24 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-3xl font-bold uppercase sm:size-28"
            >
              {mentor.name.slice(0, 2)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span
              aria-hidden
              className={`block h-1 w-10 ${ACCENTS[mentor.accent] ?? ACCENTS.blue}`}
            />
            <h1 className="mt-4 text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight">
              {mentor.name}
            </h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-tight text-foreground/60">
              {mentor.role}
            </p>
            {mentor.organization && (
              <p className="mt-1 text-foreground/50">
                {mentor.organizationUrl ? (
                  <a
                    href={mentor.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold transition hover:text-brand-blue"
                  >
                    {mentor.organization}
                  </a>
                ) : (
                  mentor.organization
                )}
              </p>
            )}

            {mentor.bio && (
              <p className="mt-5 max-w-2xl leading-relaxed text-foreground/70">
                {mentor.bio}
              </p>
            )}

            {(mentor.topics?.length ?? 0) > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {mentor.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-sm bg-foreground/5 px-2 py-1 text-xs font-bold uppercase tracking-tight text-foreground/70"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex items-center gap-4">
              {SOCIALS.filter(({ key }) => mentor[key]).map(
                ({ key, href, Icon, label }) => (
                  <a
                    key={key}
                    href={href(mentor)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${mentor.name} on ${label}`}
                    aria-label={`${mentor.name} on ${label}`}
                    className="text-foreground transition hover:text-brand-blue"
                  >
                    <Icon className="size-5" aria-hidden />
                  </a>
                ),
              )}
            </div>
          </div>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Teams he guided</h2>
          {teams.length === 0 ? (
            <p className="mt-4 text-foreground/70">
              {mentor.name.split(" ")[0]} has not guided a listed team yet.
            </p>
          ) : (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <li key={team.id} className="rounded-lg bg-card p-5">
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

                  {(team.statuses?.length ?? 0) > 0 && (
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
                </li>
              ))}
            </ul>
          )}
        </section>

        {experience.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experience.map((entry) => (
                <li
                  key={`${entry.event.id}-${entry.id}`}
                  className="rounded-lg bg-card p-5"
                >
                  <span className="inline-flex items-center rounded-sm bg-brand-blue px-2 py-1 text-xs font-bold uppercase tracking-tight text-brand-white">
                    {entry.label}
                  </span>
                  <Link
                    href={`/events/${entry.event.id}`}
                    className="mt-3 block text-lg font-bold tracking-tight transition hover:text-brand-blue"
                  >
                    {entry.event.name}
                  </Link>
                  <time
                    dateTime={entry.event.date}
                    className="mt-1 block text-xs font-bold uppercase tracking-tight text-foreground/50"
                  >
                    {formatDate(entry.event.date)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

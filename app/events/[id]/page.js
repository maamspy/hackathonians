import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa6";
import { ArrowLeft, CalendarDays, Hash, MapPin } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { JsonLd } from "@/components/shared";
import { db } from "@/data";
import { formatDate } from "@/lib/blog";
import { isPast } from "@/lib/events";
import { getGitHubProfile } from "@/lib/github";
import { resolveMentors, staffForEvent } from "@/lib/mentors";
import {
  absoluteUrl,
  breadcrumbLd,
  eventLd,
  graphLd,
  pageMetadata,
  webPageLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return db.events.all().map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = db.events.findById(id);
  if (!event) return {};

  const description = [
    event.name,
    `hosted by ${event.host}`,
    formatDate(event.date),
    event.venue?.name ?? null,
  ]
    .filter(Boolean)
    .join(", ");

  return pageMetadata({
    title: `${event.name}, ${formatDate(event.date)}`,
    description,
    path: `/events/${id}`,
  });
}

export default async function EventPage({ params }) {
  const { id } = await params;
  const event = db.events.findById(id);
  if (!event) notFound();

  const path = `/events/${event.id}`;
  const statusesById = new Map(db.statuses.all().map((s) => [s.id, s]));
  const membersById = new Map(db.members.all().map((m) => [m.id, m]));

  const teams = await Promise.all(
    db.teams
      .all()
      .filter((team) => team.eventId === event.id)
      .map(async (team) => ({
        ...team,
        mentors: resolveMentors(team.mentors),
        members: await Promise.all(
          team.members.map(async (memberId) => {
            const github = membersById.get(memberId).github;
            return { github, ...(await getGitHubProfile(github)) };
          }),
        ),
      })),
  );

  const teamIds = new Set(teams.map((team) => team.id));
  const projects = db.projects.all().filter((p) => teamIds.has(p.teamId));
  const staff = staffForEvent(event.id);

  const past = isPast(event);
  const parent = past
    ? { path: "/previous", label: "Previous hackathons" }
    : { path: "/upcoming", label: "Upcoming hackathons" };

  return (
    <div className="bg-background font-display text-foreground">
      <JsonLd
        data={graphLd([
          webPageLd({
            path,
            title: `${event.name} | Hackathonians`,
            description: `${event.name}, hosted by ${event.host} on ${formatDate(event.date)}.`,
            breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` },
          }),
          {
            ...breadcrumbLd([
              { name: "Home", path: "/" },
              { name: parent.label, path: parent.path },
              { name: event.name, path },
            ]),
            "@id": `${absoluteUrl(path)}#breadcrumb`,
          },
          eventLd(event, path),
        ])}
      />

      <main className="py-10">
        <Link
          href={parent.path}
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-foreground/60 transition hover:text-brand-blue"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All {parent.label.toLowerCase()}
        </Link>

        <header className="mt-8">
          <span
            aria-hidden
            className={`block h-1 w-10 ${event.accent === "purple" ? "bg-brand-purple" : event.accent === "yellow" ? "bg-brand-yellow" : "bg-brand-blue"}`}
          />

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tight">
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-brand-blue"
                >
                  {event.name}
                </a>
              ) : (
                event.name
              )}
            </h1>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-foreground/70">
            <span className="inline-flex items-center gap-2">
              <FaCalendar className="size-4" aria-hidden />
              <time dateTime={event.date}>{formatDate(event.date)}</time>
            </span>
            {event.venue?.name && (
              <span className="inline-flex items-center gap-2">
                <FaMapMarkerAlt className="size-4" aria-hidden />
                {event.venue.name}
              </span>
            )}
          </div>

          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="font-bold uppercase tracking-tight text-foreground/50">
                Host
              </dt>
              <dd className="mt-0.5 font-bold text-foreground">{event.host}</dd>
            </div>
            {event.poweredBy && (
              <div>
                <dt className="font-bold uppercase tracking-tight text-foreground/50">
                  Powered by
                </dt>
                <dd className="mt-0.5 font-bold text-foreground">
                  {event.poweredBy}
                </dd>
              </div>
            )}
            {event.festivalName && (
              <div>
                <dt className="font-bold uppercase tracking-tight text-foreground/50">
                  Part of
                </dt>
                <dd className="mt-0.5 font-bold text-foreground">
                  {event.festivalName}
                </dd>
              </div>
            )}
          </dl>
        </header>

        {staff.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Board</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {staff.map((group) => (
                <li key={group.id}>
                  <p className="text-xs font-bold uppercase tracking-tight text-foreground/50">
                    {group.label}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-4">
                    {group.mentors.map((mentor) => (
                      <li key={mentor.id} className="flex items-center gap-3">
                        {mentor.image ? (
                          <Image
                            src={mentor.image}
                            alt={mentor.name}
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-bold uppercase"
                          >
                            {mentor.name.slice(0, 2)}
                          </span>
                        )}
                        <Link
                          href={`/mentors/${mentor.id}`}
                          className="min-w-0 font-bold transition hover:text-brand-blue"
                        >
                          {mentor.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Our teams</h2>
          {teams.length === 0 ? (
            <p className="mt-4 text-foreground/70">
              We did not enter a team at this event.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <article key={team.id} className="rounded-lg bg-card p-5">
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

                  {(team.statuses?.length ?? 0) > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
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

                  <ul className="mt-4 flex flex-col gap-3">
                    {team.members.map((member) => (
                      <li key={member.github}>
                        <a
                          href={`https://github.com/${member.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-w-0 items-center gap-3"
                        >
                          <Image
                            src={member.avatarUrl}
                            alt={`${member.name} avatar`}
                            width={48}
                            height={48}
                            className="size-8 shrink-0 object-contain"
                          />
                          <span className="min-w-0 wrap-break-word font-bold text-foreground transition hover:text-brand-blue">
                            {member.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {team.mentors.length > 0 && (
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-xs font-bold uppercase tracking-tight text-foreground/50">
                        Mentored by
                      </p>
                      <p className="mt-1 text-sm font-bold text-foreground">
                        {team.mentors.map((m) => m.name).join(", ")}
                      </p>
                    </div>
                  )}

                  {team.gallery?.length > 0 && (
                    <div className="mt-5 flex gap-2 overflow-x-auto">
                      {team.gallery.map((src, index) => (
                        <Image
                          key={`${team.id}-gallery-${index}`}
                          src={src}
                          alt={`${team.name} photo ${index + 1}`}
                          width={72}
                          height={72}
                          className="size-16 shrink-0 rounded object-cover"
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {projects.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {projects.map((project) => (
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

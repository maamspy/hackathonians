import Image from "next/image";
import { Hash } from "lucide-react";
import { db } from "@/data";
import { getGitHubProfile } from "@/lib/github";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function PreviousPage() {
  const teams = db.join("teams", "eventId", "event").map((team) => ({
    ...team,
    statuses: (team.statuses ?? []).map((id) => db.statuses.findById(id)),
  }));

  const membersById = new Map(
    db.members.all().map((member) => [member.id, member]),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = await Promise.all(
    db.events
      .all()
      .filter((event) => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(async (event) => ({
        ...event,
        teams: await Promise.all(
          teams
            .filter((team) => team.eventId === event.id)
            .map(async (team) => ({
              ...team,
              members: await Promise.all(
                team.members.map(async (memberId) => {
                  const github = membersById.get(memberId).github;
                  return {
                    github,
                    ...(await getGitHubProfile(github)),
                  };
                }),
              ),
            })),
        ),
      })),
  );

  return (
    <div className="bg-background font-display text-foreground">
      <main className="py-10">
        <header className="max-w-2xl">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
            Previous hackathons
          </h1>
          <p className="mt-3 text-lg text-foreground/70">
            The teams, results and galleries from the hackathons we have been
            part of.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border bg-foreground/5 p-10 text-center sm:p-14">
            <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              No previous hackathons yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-10">
            {events.map((event) => (
              <section key={event.id} className="bg-foreground/5 p-5 sm:p-8">
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
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
                  </h2>
                  <time
                    dateTime={event.date}
                    className="text-sm font-bold text-foreground/50"
                  >
                    {formatDate(event.date)}
                  </time>
                </header>
                {(event.poweredBy ?? event.host) && (
                  <p className="mt-1 text-sm font-bold uppercase tracking-tight text-foreground/50">
                    by {event.poweredBy ?? event.host}
                  </p>
                )}

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {event.teams.map((team) => (
                    <article key={team.id} className="bg-card p-5">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {team.name}
                        </h3>
                        {(team.rank || team.statuses.length > 0) && (
                          <div className="mt-2 flex items-center gap-2">
                            {team.rank && (
                              <span className="inline-flex items-center rounded-sm bg-brand-blue px-2 py-1.5 text-xl font-bold uppercase tracking-tight text-white">
                                <Hash className="size-4" />
                                {team.rank}
                              </span>
                            )}
                            {team.statuses.map(
                              (status) =>
                                status && (
                                  <span
                                    key={status.id}
                                    className="rounded-sm bg-brand-yellow px-2 py-1 text-xs font-bold uppercase tracking-tight text-brand-black"
                                  >
                                    {status.label}
                                  </span>
                                ),
                            )}
                          </div>
                        )}
                      </div>

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
                                className="h-8 w-8 shrink-0 object-contain"
                              />
                              <span className="min-w-0 wrap-break-word font-bold text-foreground transition hover:text-brand-blue">
                                {member.name}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>

                      {team.gallery?.length > 0 && (
                        <div className="mt-6 flex gap-2 overflow-x-auto">
                          {team.gallery.map((src, index) => (
                            <Image
                              key={`${team.id}-gallery-${index}`}
                              src={src}
                              alt={`${team.name} photo ${index + 1}`}
                              width={72}
                              height={72}
                              className="h-16 w-16 shrink-0 rounded object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

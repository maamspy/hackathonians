import Image from "next/image";
import { EVENTS } from "@/lib/events";
import { getGitHubProfile } from "@/lib/github";

export default async function UpcomingPage() {
  const events = await Promise.all(
    EVENTS.map(async (event) => ({
      ...event,
      teams: await Promise.all(
        event.teams.map(async (team) => ({
          ...team,
          members: await Promise.all(
            team.members.map(async (member) => ({
              github: member.github,
              ...(await getGitHubProfile(member.github)),
            })),
          ),
        })),
      ),
    })),
  );

  return (
    <div className="min-h-dvh bg-background font-display text-brand-white">
      <main className="container mx-auto py-10">
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
          Hackathons we are joining
        </h1>
        <div className="mt-10 flex flex-col gap-10">
          {events.map((event) => (
            <section key={event.id} className="bg-brand-white/5 p-5 sm:p-8">
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
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {event.teams.map((team) => (
                  <article key={team.name} className="bg-brand-black p-5">
                    <h3 className="text-lg font-bold text-brand-white">
                      {team.name}
                    </h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {team.members.map((member) => (
                        <li key={member.github}>
                          <a
                            href={`https://github.com/${member.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3"
                          >
                            <Image
                              src={member.avatarUrl}
                              alt={`${member.name} avatar`}
                              width={48}
                              height={48}
                              className="h-8 w-8 object-contain"
                            />
                            <span className="font-bold text-brand-white transition hover:text-brand-blue">
                              {member.name}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

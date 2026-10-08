import Image from "next/image";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";
import { db } from "@/data";

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

export const metadata = {
  title: "Mentors",
  description: "The mentors who show up for our teams.",
};

export default async function MentorsPage() {
  const mentors = db.mentors.all().filter((mentor) => mentor.featured);

  return (
    <div className="bg-background font-display text-foreground">
      <main className="py-10">
        <header className="max-w-2xl">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
            Mentors
          </h1>
          <p className="mt-3 text-lg text-foreground/70">
            The mentors who show up for our teams.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {mentors.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-foreground/5 p-10 text-center sm:col-span-2 sm:p-14">
              <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                No mentors yet.
              </p>
            </div>
          ) : (
            mentors.map((mentor) => (
              <article
                key={mentor.id}
                className="flex flex-col overflow-hidden rounded-lg bg-card p-6"
              >
                <span
                  aria-hidden
                  className={`h-1 w-10 ${ACCENTS[mentor.accent] ?? ACCENTS.blue}`}
                />

                <div className="mt-4 flex items-start gap-4">
                  {mentor.image ? (
                    <Image
                      src={mentor.image}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-lg font-bold uppercase"
                    >
                      {mentor.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight">
                      {mentor.name}
                    </h2>
                    <p className="mt-0.5 text-sm font-bold uppercase tracking-tight text-foreground/60">
                      {mentor.role}
                    </p>
                    {mentor.organization && (
                      <p className="text-sm text-foreground/50">
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
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/70">
                  {mentor.bio}
                </p>

                {(mentor.topics?.length ?? 0) > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
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

                <div className="mt-5 flex shrink-0 items-center gap-4">
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
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

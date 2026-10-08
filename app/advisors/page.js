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
    href: (a) => `https://github.com/${a.github}`,
    Icon: FaGithub,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: (a) => `https://linkedin.com/in/${a.linkedin}`,
    Icon: FaLinkedin,
  },
  { key: "website", label: "Website", href: (a) => a.website, Icon: FaGlobe },
];

export const metadata = {
  title: "Advisors",
  description: "The mentors and reviewers who show up for our teams.",
};

export default async function AdvisorsPage() {
  const advisors = db.advisors.all().filter((advisor) => advisor.featured);

  return (
    <div className="bg-background font-display text-foreground">
      <main className="py-10">
        <header className="max-w-2xl">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
            Advisors
          </h1>
          <p className="mt-3 text-lg text-foreground/70">
            The mentors and reviewers who show up for our teams.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {advisors.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-foreground/5 p-10 text-center sm:col-span-2 sm:p-14">
              <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                No advisors yet.
              </p>
            </div>
          ) : (
            advisors.map((advisor) => (
              <article
                key={advisor.id}
                className="flex flex-col overflow-hidden rounded-lg bg-card p-6"
              >
                <span
                  aria-hidden
                  className={`h-1 w-10 ${ACCENTS[advisor.accent] ?? ACCENTS.blue}`}
                />

                <div className="mt-4 flex items-start gap-4">
                  {advisor.image ? (
                    <Image
                      src={advisor.image}
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
                      {advisor.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight">
                      {advisor.name}
                    </h2>
                    <p className="mt-0.5 text-sm font-bold uppercase tracking-tight text-foreground/60">
                      {advisor.role}
                    </p>
                    {advisor.organization && (
                      <p className="text-sm text-foreground/50">
                        {advisor.organizationUrl ? (
                          <a
                            href={advisor.organizationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold transition hover:text-brand-blue"
                          >
                            {advisor.organization}
                          </a>
                        ) : (
                          advisor.organization
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/70">
                  {advisor.bio}
                </p>

                {(advisor.topics?.length ?? 0) > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {advisor.topics.map((topic) => (
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
                  {SOCIALS.filter(({ key }) => advisor[key]).map(
                    ({ key, href, Icon, label }) => (
                      <a
                        key={key}
                        href={href(advisor)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${advisor.name} on ${label}`}
                        aria-label={`${advisor.name} on ${label}`}
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

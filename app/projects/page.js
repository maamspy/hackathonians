import { Code, ExternalLink } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui";
import { JsonLd } from "@/components/shared";
import { getProjects } from "@/lib/projects";
import {
  absoluteUrl,
  breadcrumbLd,
  creativeWorkLd,
  graphLd,
  itemListLd,
  pageMetadata,
  webPageLd,
} from "@/lib/seo";

const ACCENTS = {
  blue: "bg-brand-blue",
  purple: "bg-brand-purple",
  yellow: "bg-brand-yellow",
};

const DESCRIPTION =
  "Open-source web, AI and data projects shipped by Team Hackathonians at hackathons across Bangladesh.";

export const metadata = pageMetadata({
  title: "Projects",
  description: DESCRIPTION,
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="bg-background font-display text-foreground">
      <JsonLd
        data={graphLd([
          webPageLd({
            path: "/projects",
            title: "Projects | Hackathonians",
            description: DESCRIPTION,
            breadcrumb: breadcrumbLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]),
          }),
          itemListLd(
            "Projects",
            projects.map((project) => ({
              name: project.name,
              url: absoluteUrl("/projects"),
            })),
          ),
          ...projects.map((project) => creativeWorkLd(project)),
        ])}
      />
      <main className="py-10">
        <header className="max-w-2xl">
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-tight tracking-tight">
            Projects we built
          </h1>
          <p className="mt-3 text-lg text-foreground/70">
            Crazy ideas we shipped together at hackathons.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-foreground/5 p-10 text-center sm:col-span-2 sm:p-14 lg:col-span-3">
              <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                No projects yet.
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <article
                key={project.id}
                className="group relative flex flex-col overflow-hidden rounded-lg bg-card p-6"
              >
                <span
                  aria-hidden
                  className={`h-1 w-10 transition-all duration-300 group-hover:w-full ${
                    ACCENTS[project.accent] ?? ACCENTS.blue
                  }`}
                />
                <h2 className="mt-4 text-2xl font-bold tracking-tight">
                  {project.name}
                </h2>
                <p className="mt-1 text-foreground/70">{project.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/60">
                  {project.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-sm bg-foreground/5 px-2 py-1 text-xs font-bold uppercase tracking-tight text-foreground/70"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {project.links && (
                  <div className="mt-6 flex shrink-0 gap-5">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition hover:text-brand-blue"
                      >
                        <Code className="size-4" aria-hidden />
                        Code
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition hover:text-brand-blue"
                      >
                        <ExternalLink className="size-4" aria-hidden />
                        Live
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex flex-col gap-4">
                    {project.event && (
                      <p className="text-xs font-bold uppercase tracking-tight text-foreground/50">
                        <span className="block text-brand-blue">
                          {project.event.name}
                        </span>
                        {(project.event.poweredBy ?? project.event.host) && (
                          <span className="block truncate">
                            by {project.event.poweredBy ?? project.event.host}
                          </span>
                        )}
                      </p>
                    )}
                    {project.members?.length > 0 && (
                      <AvatarGroup className="shrink-0">
                        {project.members.map((member) => (
                          <a
                            key={member.username}
                            href={`https://github.com/${member.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`@${member.username} on GitHub`}
                          >
                            <Avatar>
                              <AvatarImage
                                src={member.avatarUrl}
                                alt={member.name}
                              />
                              <AvatarFallback>
                                {member.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </a>
                        ))}
                      </AvatarGroup>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

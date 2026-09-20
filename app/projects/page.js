"use client";

import { useEffect, useState } from "react";
import { Code, ExternalLink } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui";

const ACCENTS = {
  blue: "bg-brand-blue",
  purple: "bg-brand-purple",
  yellow: "bg-brand-yellow",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((body) => {
        if (!body.success) throw new Error(body.error?.message);
        setProjects(body.data.projects);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <div className="bg-background font-display text-foreground">
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
          {error && (
            <p className="text-foreground/70">
              Failed to load projects. Please try again.
            </p>
          )}
          {!error &&
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
            ))}
        </div>
      </main>
    </div>
  );
}

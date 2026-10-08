import { unstable_cache } from "next/cache";
import { db } from "@/data";
import { getGitHubProfile } from "./github";

async function buildProjects() {
  const teamById = new Map(
    db.join("teams", "eventId", "event").map((team) => [team.id, team]),
  );
  const membersById = new Map(
    db.members.all().map((member) => [member.id, member]),
  );

  return Promise.all(
    db.join("projects", "teamId", "team").map(async (project) => {
      const team = teamById.get(project.teamId) ?? null;

      const members = team?.members
        ? await Promise.all(
            team.members.map(async (memberId) => {
              const member = membersById.get(memberId);
              const { name, avatarUrl } = await getGitHubProfile(member.github);
              return {
                id: member.id,
                username: member.github,
                name,
                avatarUrl,
              };
            }),
          )
        : [];

      return {
        id: project.id,
        name: project.name,
        tagline: project.tagline,
        description: project.description,
        accent: project.accent,
        tags: project.tags ?? [],
        links: project.links ?? null,
        event: team?.event
          ? {
              id: team.event.id,
              name: team.event.name,
              host: team.event.host,
              accent: team.event.accent,
              poweredBy: team.event.poweredBy ?? null,
              festivalName: team.event.festivalName ?? null,
              venue: team.event.venue ?? null,
            }
          : null,
        members,
      };
    }),
  );
}

export const getProjects = unstable_cache(buildProjects, ["projects"], {
  revalidate: 60 * 60 * 24,
});

import { db } from "@/data";
import { getGitHubProfile } from "@/lib/github";
import { success, error } from "@/lib/response";

export async function GET() {
  try {
    const teamsWithEvents = db.join("teams", "eventId", "event");
    const teamById = new Map(teamsWithEvents.map((team) => [team.id, team]));
    const membersById = new Map(
      db.members.all().map((member) => [member.id, member]),
    );

    const linked = db.join("projects", "teamId", "team");

    const projects = await Promise.all(
      linked.map(async (project) => {
        const team = teamById.get(project.teamId) ?? null;

        const members = team?.members
          ? await Promise.all(
              team.members.map(async (memberId) => {
                const member = membersById.get(memberId);
                const { name, avatarUrl } = await getGitHubProfile(
                  member.github,
                );
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

    return success({ projects }, { status: 200 });
  } catch {
    return error("Failed to load projects", { status: 500 });
  }
}

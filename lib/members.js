import { db } from "@/data";
import { getGitHubProfile } from "./github";

export async function getMembers() {
  const teamsWithEvents = db
    .join("teams", "eventId", "event")
    .sort(
      (a, b) =>
        new Date(b.event?.date ?? 0).getTime() -
        new Date(a.event?.date ?? 0).getTime(),
    );

  const projectsByTeam = new Map();
  for (const project of db.projects.all()) {
    const list = projectsByTeam.get(project.teamId) ?? [];
    list.push(project);
    projectsByTeam.set(project.teamId, list);
  }

  return Promise.all(
    db.members.all().map(async (member) => {
      const teams = teamsWithEvents.filter((team) =>
        team.members.includes(member.id),
      );

      return {
        ...member,
        ...(await getGitHubProfile(member.github)),
        teams,
        projects: teams.flatMap((team) => projectsByTeam.get(team.id) ?? []),
      };
    }),
  );
}

export async function getMember(id) {
  const members = await getMembers();
  return members.find((member) => member.id === id) ?? null;
}

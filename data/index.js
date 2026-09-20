import { EVENTS, schema as eventsSchema } from "./events";
import { PROJECTS, schema as projectsSchema } from "./projects";
import { TEAMS, schema as teamsSchema } from "./teams";
import { STATUSES, schema as statusesSchema } from "./statuses";
import { MEMBERS, schema as membersSchema } from "./members";

function createTable(name, rows, { primaryKey = "id", foreignKeys = [] } = {}) {
  return {
    name,
    primaryKey,
    foreignKeys,
    all: () => rows,
    findById: (id) => rows.find((row) => row[primaryKey] === id) ?? null,
    find: (predicate) => rows.filter(predicate),
  };
}

export const db = {
  projects: createTable("projects", PROJECTS, projectsSchema),
  events: createTable("events", EVENTS, eventsSchema),
  teams: createTable("teams", TEAMS, teamsSchema),
  statuses: createTable("statuses", STATUSES, statusesSchema),
  members: createTable("members", MEMBERS, membersSchema),

  join(from, fkColumn, alias) {
    const source = this[from];
    const fk = source.foreignKeys.find((key) => key.column === fkColumn);
    if (!fk) throw new Error(`No FK "${from}.${fkColumn}"`);
    const target = this[fk.references];
    if (!target) throw new Error(`Unknown table "${fk.references}"`);

    return source.all().map((row) => ({
      ...row,
      [alias ?? fk.as ?? fk.references]: target.findById(row[fkColumn]) ?? null,
    }));
  },
};

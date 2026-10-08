import { db } from "@/data";

export function resolveMentors(ids) {
  return (ids ?? []).map((id) => db.mentors.findById(id)).filter(Boolean);
}

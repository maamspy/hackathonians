import { db } from "@/data";

export function resolveAdvisors(ids) {
  return (ids ?? []).map((id) => db.advisors.findById(id)).filter(Boolean);
}

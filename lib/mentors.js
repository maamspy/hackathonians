import { db } from "@/data";

export function resolveMentors(ids) {
  return (ids ?? []).map((id) => db.mentors.findById(id)).filter(Boolean);
}

export function roleById(id) {
  const role = db.roles.findById(id);
  if (!role) throw new Error(`Unknown mentor role "${id}"`);
  return role;
}

export function staffForEvent(eventId) {
  const grouped = new Map();

  for (const mentor of db.mentors.all()) {
    for (const entry of mentor.experience ?? []) {
      if (entry.eventId !== eventId) continue;
      const role = roleById(entry.role);
      const serving = grouped.get(role.id) ?? [];
      if (!serving.includes(mentor)) serving.push(mentor);
      grouped.set(role.id, serving);
    }
  }

  return db.roles
    .all()
    .filter((role) => grouped.has(role.id))
    .map((role) => ({ ...role, mentors: grouped.get(role.id) }));
}

export function experienceForMentor(mentorId) {
  const mentor = db.mentors.findById(mentorId);

  return (mentor?.experience ?? [])
    .map((entry) => ({
      ...roleById(entry.role),
      event: db.events.findById(entry.eventId),
    }))
    .filter((entry) => entry.event)
    .sort((a, b) => new Date(b.event.date) - new Date(a.event.date));
}

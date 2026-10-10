import { db } from "@/data";

export function resolveMentors(ids) {
  return (ids ?? []).map((id) => db.mentors.findById(id)).filter(Boolean);
}

function roleById(id) {
  const role = db.roles.findById(id);
  if (!role) throw new Error(`Unknown mentor role "${id}"`);
  return role;
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

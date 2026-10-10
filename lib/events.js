import { db } from "@/data";

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const isPast = (event) => new Date(event.date) < startOfToday();

export const isUpcoming = (event) => new Date(event.date) >= startOfToday();

export function eventsNewestFirst() {
  return [...db.events.all()].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
}

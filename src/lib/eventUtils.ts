export interface EventData {
  date: string;
  name: string;
  url: string;
  location: string;
  locationUrl: string;
}

export interface Event {
  data: EventData;
}

export interface EventClassification {
  upcoming: Event[];
  past: Event[];
  next: Event | undefined;
}

export function parseEventDate(dateString: string): Date {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getToday(baseDate: Date = new Date()): Date {
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);
  return today;
}

export function sortEventsByDate<T extends Event>(events: T[]): T[] {
  return [...events].sort(
    (a, b) =>
      parseEventDate(a.data.date).getTime() -
      parseEventDate(b.data.date).getTime(),
  );
}

export function classifyEvents<T extends Event>(
  events: T[],
  today: Date = getToday(),
): { upcoming: T[]; past: T[]; next: T | undefined } {
  const sortedEvents = sortEventsByDate(events);
  const todayTime = today.getTime();

  const upcoming = sortedEvents.filter(
    (e) => parseEventDate(e.data.date).getTime() >= todayTime,
  );

  const past = sortedEvents
    .filter((e) => parseEventDate(e.data.date).getTime() < todayTime)
    .reverse();

  return {
    upcoming,
    past,
    next: upcoming[0],
  };
}

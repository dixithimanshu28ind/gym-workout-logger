const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function weekdayName(dateKey: string): string {
  return WEEKDAY_NAMES[parseLocalDateKey(dateKey).getDay()];
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

/** Monday–Sunday week containing `date`. */
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const day = date.getDay(); // 0 = Sunday .. 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = addDays(date, diffToMonday);
  start.setHours(0, 0, 0, 0);
  const end = addDays(start, 6);
  return { start, end };
}

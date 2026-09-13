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

function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export interface OrdinalDateParts {
  day: number;
  suffix: string;
  month: string;
  year: string;
}

/** Parts for a compact ordinal date, e.g. day 13 + suffix "th" + "Sep" + "26" — lets the suffix be rendered as a superscript to save width. */
export function getOrdinalDateParts(dateKey: string): OrdinalDateParts {
  const date = parseLocalDateKey(dateKey);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = String(date.getFullYear()).slice(-2);
  return { day, suffix: ordinalSuffix(day), month, year };
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

export interface MonthGridCell {
  date: Date;
  dateKey: string;
  inCurrentMonth: boolean;
}

/**
 * 6-week Monday-start grid for the month containing `monthDate`, so calendar
 * layouts stay a fixed 42-cell size across months.
 */
export function getMonthGridWeeks(monthDate: Date): MonthGridCell[][] {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = getWeekRange(firstOfMonth).start;

  const weeks: MonthGridCell[][] = [];
  let cursor = gridStart;
  for (let week = 0; week < 6; week++) {
    const days: MonthGridCell[] = [];
    for (let day = 0; day < 7; day++) {
      days.push({
        date: cursor,
        dateKey: formatDateKey(cursor),
        inCurrentMonth: cursor.getMonth() === monthDate.getMonth(),
      });
      cursor = addDays(cursor, 1);
    }
    weeks.push(days);
  }
  return weeks;
}

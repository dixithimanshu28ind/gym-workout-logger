function toLocalDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Current consecutive-day streak, counted backward from today.
 * A streak stays alive through "today" even if today has no entry yet,
 * as long as yesterday did — it only breaks once a full day is skipped.
 */
export function computeCurrentStreak(workoutDates: string[]): number {
  const dateSet = new Set(workoutDates);
  const cursor = new Date();

  if (!dateSet.has(toLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dateSet.has(toLocalDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

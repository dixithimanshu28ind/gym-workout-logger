import { addDays, formatDateKey as toLocalDateKey, parseLocalDateKey } from "@/lib/dates";

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

export interface LongestStreakInfo {
  longestStreak: number;
  visible: boolean;
}

const ELIGIBLE_DAYS_THRESHOLD = 7;
const INACTIVITY_HIDE_THRESHOLD = 14;
const REBUILD_DAYS_THRESHOLD = 7;

/**
 * All-time longest consecutive-day streak, plus whether the "Longest Streak"
 * section should currently be shown (GYM-2). Both are derived by replaying
 * the user's distinct workout dates day-by-day from their first workout
 * through today — no persisted state needed, so it's always consistent with
 * the actual workout history (edits/deletes just change the next replay).
 *
 * Visibility rules:
 * - Hidden until the user has logged workouts on at least 7 distinct days.
 * - Hidden again after 14 consecutive inactive days, and stays hidden
 *   (even once the user resumes) until they rebuild a fresh 7-day streak —
 *   the stored longest-streak value itself is untouched by this hiding.
 * - "Today" gets the same leniency as computeCurrentStreak: an unlogged
 *   today doesn't yet break a run or count toward the inactivity gap.
 */
export function computeLongestStreak(workoutDates: string[]): LongestStreakInfo {
  const uniqueDateKeys = Array.from(new Set(workoutDates)).sort();
  if (uniqueDateKeys.length === 0) {
    return { longestStreak: 0, visible: false };
  }

  const hasEnoughWorkouts = uniqueDateKeys.length >= ELIGIBLE_DAYS_THRESHOLD;
  const dateSet = new Set(uniqueDateKeys);
  const todayKey = toLocalDateKey(new Date());

  let runLength = 0;
  let gapDays = 0;
  let longestStreak = 0;
  let lockedForRebuild = false;

  let cursor = parseLocalDateKey(uniqueDateKeys[0]);
  while (toLocalDateKey(cursor) <= todayKey) {
    const cursorKey = toLocalDateKey(cursor);
    const isToday = cursorKey === todayKey;

    if (dateSet.has(cursorKey)) {
      runLength += 1;
      gapDays = 0;
    } else if (!isToday) {
      runLength = 0;
      gapDays += 1;
    }
    // Today with no workout yet: leave runLength/gapDays as-is (leniency).

    if (runLength > longestStreak) longestStreak = runLength;

    if (lockedForRebuild) {
      if (runLength >= REBUILD_DAYS_THRESHOLD) lockedForRebuild = false;
    } else if (gapDays >= INACTIVITY_HIDE_THRESHOLD) {
      lockedForRebuild = true;
    }

    cursor = addDays(cursor, 1);
  }

  return { longestStreak, visible: hasEnoughWorkouts && !lockedForRebuild };
}

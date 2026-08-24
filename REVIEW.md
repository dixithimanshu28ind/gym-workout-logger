# Senior-Engineer Review Pass

Review performed with `/code-review high` over the full application source (no diff existed — `main` was clean and in sync with `origin/main` at review time).

## Findings

### 1. `lib/workouts.ts:63` — `updateWorkout` has no rollback on partial failure
Deletes all existing exercises for a workout before re-inserting the new ones, with no transaction. If `insertExercises` fails partway through (e.g. a dropped connection mid-edit), the old exercises are already gone and only some of the new ones were inserted — the workout is silently and permanently corrupted with no rollback path.

### 2. `lib/workouts.ts:49` — `createWorkout` has no rollback on partial failure
If the workout row insert succeeds but `insertExercises` fails partway through, an orphaned workout row with partial exercise data is left in the database. The error propagates to the UI as a generic failure, but the partial row can't be found or cleaned up by the user.

### 3. `components/WorkoutForm.tsx:16` — default date uses UTC, not local time
`new Date().toISOString().slice(0, 10)` returns the UTC date. A user west of UTC opening "Log New Workout" in the evening can get tomorrow's date pre-filled instead of today's, unless they notice and correct it.

### 4. `lib/workouts.ts:87` — N+1 insert pattern
`insertExercises` inserts exercises one at a time in a sequential loop (2 round-trips per exercise) instead of batching all exercises, then all sets, in two requests. Save latency scales linearly with exercise count.

### 5. `components/WorkoutForm.tsx:130` — array index used as React key
Exercise and set list items key on their array index, which is unstable across removal. Removing an earlier set/exercise can cause a later input to lose focus or appear to hold the wrong row's data during a re-render, even though the underlying state stays correct.

### 6. Duplicated error-extraction pattern
The `e instanceof Error ? e.message : "..."` pattern is repeated verbatim across `app/dashboard/page.tsx`, `app/workout/new/page.tsx`, and `app/workout/[id]/page.tsx` instead of a shared helper. Not a bug — a maintenance cost if error surfacing ever needs to change.

## Disposition

Findings #1 and #2 are genuine data-integrity bugs; #3 is a real but low-impact correctness bug; #4–#6 are efficiency/maintainability cleanups. For this submission, all six were **documented but not fixed**, by request — the app is functionally correct for the assignment's scope and has been verified end-to-end in production (see commit history / dashboard testing).

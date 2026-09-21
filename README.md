# Daily Gym Workout Logger

A simple web app to log daily gym workouts, track exercises and sets, and review past sessions from a dashboard.

Built for the MukeshGenAI Course "Breakout Task 1" assignment: *Build, Push & Deploy an End-to-End Application Using AI*.

## Features

- Email/password authentication
- Log a workout: date, workout type, and any number of exercises, each with any number of sets (effort + reps)
- Dashboard with a summary list of all logged workouts
- Edit or delete an existing workout
- Data is scoped per user via Supabase Row Level Security — each user only ever sees their own workouts

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Auth + Postgres) — client components talk to Supabase directly, with RLS policies handling authorization instead of custom API routes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the project root with your Supabase project credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Feature flags

A feature can be merged to production **switched off**, then revealed from the CMS with no deploy. Each feature is in one of three states:

| State | What visitors see |
|---|---|
| **Off** (default) | The feature does not exist: no entry points, its pages return a real 404, its APIs refuse requests |
| **Coming soon** | Entry points show a teaser (no prices, no working checkout). Pages and APIs still refuse requests |
| **Live** | Everything works |

Flags are switched in the CMS at **/admin, Feature Flags**. Every save is kept as a version, with who changed it and when. Changing a flag takes effect on the next request, with no redeploy.

### Adding a feature flag

1. **Register it** in `FEATURES` in `lib/featureFlags.ts` (key, label, description, default). That is the only place features are declared.
2. **Generate the migration** for its new column and commit it. It is additive:
   ```bash
   npx payload migrate:create add_<key>_flag
   npx payload generate:types
   ```
   Run `npx payload migrate` before, or right after, deploying. Until it has run the flags cannot be read, so every feature reads as Off (see below). **There is one database** (see the next section), so with your normal `.env.local`, `migrate` changes **production**. To try a migration first, point `DATABASE_URI` at a scratch Postgres for that command.
3. **Guard it**, on the server (`lib/features.ts`). Never use a `NEXT_PUBLIC_` variable: those are fixed at build time, so a change would need a redeploy and the hidden feature would ship in the browser bundle.
   ```ts
   // A page that belongs to the feature: 404 unless Live. Keep it dynamic.
   export const dynamic = "force-dynamic";
   export default async function Page() {
     await requireFeature("custom_programs");
     // ...
   }

   // An API route or webhook: 404 unless Live.
   export async function POST(req: Request) {
     const blocked = await requireFeatureForApi("custom_programs");
     if (blocked) return blocked;
     // ...
   }

   // An entry point on a page that exists anyway (a card, a nav link):
   const state = await getFeatureState("custom_programs"); // "off" | "coming_soon" | "live"
   ```
   Render nothing when Off, the teaser when Coming soon, the real thing when Live. Each feature defines its own teaser.

### Testing before launch: the environment override

**Production, preview and local all share one CMS database** (`DATABASE_URI` is the same in all three Vercel environments), so setting a flag to Live in the CMS to test something would also make it Live in production. To test unfinished work, use an environment variable, which wins over the CMS:

```
FEATURE_FLAGS_OVERRIDE=custom_programs=live,community=coming_soon
```

- Set it on **Preview** and in your local `.env.local`. Do **not** set it on Production: Vercel offers "all environments" by default, so untick Production. If it is set there anyway it is ignored, with a warning in the logs.
- Production is controlled by the CMS alone.
- A typo in a state (`custom_programs=liev`) turns that feature **Off**, with a warning; an unknown feature name is skipped with a warning.
- `vercel env pull` writes `VERCEL_ENV="production"` into `.env.local`. That is fine under `npm run dev`, but with `npm run build && npm start` locally the override is ignored; run it with `VERCEL_ENV=development` in front.

### If the flags cannot be read

If the CMS is unreachable, the flags table is missing (code deployed before the migration), or the CMS does not answer within 4 seconds, **every feature is Off** and the error is logged. An outage never reveals a feature. One nuance: a value that was read successfully earlier stays cached for up to 5 minutes and, if the CMS is still down when that expires, is kept until it can be refreshed. So an outage does not switch off something that was already Live.

### Checking what an environment is showing

`GET /api/features` lists the features that are **Coming soon or Live**. Features that are Off are left out, so nothing unreleased is revealed:

```json
{ "features": { "custom_programs": "coming_soon" } }
```

The e2e suite checks its shape, and each feature's own tests read it to know which branch to expect in an environment (absent means hidden and 404; Live means it works).

### Tests

`node ./node_modules/.bin/tsx scripts/feature-flags-test.ts` checks the rules (override, fail-safe, public list) without a database. Page and API behaviour is covered by the e2e suite.

## Database tables

**Every table must be protected from the public Supabase key.** That key is in the website's JavaScript, so anyone can use it, and Supabase serves every table in the `public` schema through a REST API to whoever holds it. A table is only safe if **row-level security is on** and the `anon` and `authenticated` roles have **no privileges** on it.

The CMS (Payload) creates its tables with neither, and Supabase grants those roles full access by default. Until 2026-09-21 that let a stranger read the CMS admin's email and password hash and attempt writes to programs, users and feature flags (GYM-46). It was closed by hand on production, and `migrations/20260921_133736_enable_rls_on_cms_tables.ts` makes a freshly built database safe too.

**When you add a table** (a new collection or global), end its migration with:

```ts
import { PROTECT_PUBLIC_TABLES_SQL } from '../lib/rlsSql'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ... the generated statements ...
  await db.execute(sql.raw(PROTECT_PUBLIC_TABLES_SQL))
}
```

It does nothing to tables that are already protected, so it is safe to run repeatedly, and it never affects the CMS itself, which connects as `postgres` and bypasses row-level security. The app's own tables (`workouts`, `exercises`, `sets`, `profiles`) have their own policies and are left alone.

**It is checked, not just written down.** The e2e suite lists every table in the database and tries to read and write each one with the public key. If a table is left open, the test `cms-tables-not-public` fails after the next production deploy or nightly run, and names the table.

Adding a column to an existing table does not create a table, so a feature flag's migration does not need this.

## Project Plan

See [PLAN.md](../PLAN.md) in the assignment root for the full Plan → Develop → Verify → Push → Deploy breakdown.

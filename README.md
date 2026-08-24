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

## Project Plan

See [PLAN.md](../PLAN.md) in the assignment root for the full Plan → Develop → Verify → Push → Deploy breakdown.

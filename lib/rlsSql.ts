/**
 * SQL that closes the public REST API on every table in the database.
 *
 * WHY. Supabase serves every table in the `public` schema over a REST API, and
 * the public key that API accepts is in the website's JavaScript, so anyone can
 * use it. A table is only safe from that if row-level security is ON and the
 * public roles (`anon`, `authenticated`) have no privileges on it. Payload
 * creates its tables with neither, and Supabase grants the public roles full
 * access by default, so until 2026-09-21 the CMS tables (including the admin's
 * password hash) could be read and written by a stranger (GYM-46).
 *
 * The CMS connects as `postgres`, which bypasses row-level security, so this
 * never affects it. It does not touch tables that already have row-level
 * security on, which is how the app's own tables (workouts, sets, ...) keep the
 * policies that let signed-in users reach their own rows.
 *
 * Safe to run any number of times. The role checks let it run on a plain local
 * Postgres, where `anon` and `authenticated` do not exist.
 *
 * USE. Any migration that creates a table must end with:
 *
 *   import { PROTECT_PUBLIC_TABLES_SQL } from '../lib/rlsSql'
 *   await db.execute(sql.raw(PROTECT_PUBLIC_TABLES_SQL))
 *
 * The e2e suite has a test (cms-tables-not-public) that fails after the next
 * production deploy or nightly run if a table is left open.
 */
export const PROTECT_PUBLIC_TABLES_SQL = `
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' and not rowsecurity order by 1 loop
    execute format('alter table public.%I enable row level security', t.tablename);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on table public.%I from anon', t.tablename);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on table public.%I from authenticated', t.tablename);
    end if;
  end loop;
end $$;
`;

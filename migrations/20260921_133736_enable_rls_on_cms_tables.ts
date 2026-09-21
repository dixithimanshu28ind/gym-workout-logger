import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { PROTECT_PUBLIC_TABLES_SQL } from '../lib/rlsSql'

/**
 * GYM-46. Closes the public REST API on every table that has row-level
 * security off (see lib/rlsSql.ts for why). Production already had this applied
 * by hand on 2026-09-21, so there it changes nothing; this migration is what
 * makes a freshly built database (local, or the staging one planned later) safe
 * too.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(PROTECT_PUBLIC_TABLES_SQL))
}

/**
 * Deliberately does nothing. Undoing this would switch the protection off and
 * re-open the tables to anyone holding the public key.
 */
export async function down({}: MigrateDownArgs): Promise<void> {}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

import { PROTECT_PUBLIC_TABLES_SQL } from '../lib/rlsSql'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_interest_registrations_interest" AS ENUM('custom-training-program');
  CREATE TYPE "public"."enum_interest_registrations_email_status" AS ENUM('pending', 'sent', 'failed', 'not_configured', 'skipped_test', 'skipped_cap');
  CREATE TABLE "interest_registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"interest" "enum_interest_registrations_interest" NOT NULL,
  	"message" varchar,
  	"notice_version" varchar,
  	"email_status" "enum_interest_registrations_email_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "interest_registrations_id" integer;
  CREATE INDEX "interest_registrations_email_idx" ON "interest_registrations" USING btree ("email");
  CREATE INDEX "interest_registrations_interest_idx" ON "interest_registrations" USING btree ("interest");
  CREATE INDEX "interest_registrations_updated_at_idx" ON "interest_registrations" USING btree ("updated_at");
  CREATE INDEX "interest_registrations_created_at_idx" ON "interest_registrations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interest_registrations_fk" FOREIGN KEY ("interest_registrations_id") REFERENCES "public"."interest_registrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_interest_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("interest_registrations_id");`)

  // This table holds email addresses: never readable with the public key (GYM-46).
  await db.execute(sql.raw(PROTECT_PUBLIC_TABLES_SQL))
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Hand-ordered: Payload's generated version dropped the table first and then
  // failed on the foreign key that had gone with it. Dropping the column takes
  // its foreign key and index with it, then the table, then the types.
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "interest_registrations_id";
  DROP TABLE IF EXISTS "interest_registrations" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_interest_registrations_interest";
  DROP TYPE IF EXISTS "public"."enum_interest_registrations_email_status";`)
}

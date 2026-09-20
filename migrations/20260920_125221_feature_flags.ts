import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_feature_flags_custom_programs" AS ENUM('off', 'coming_soon', 'live');
  CREATE TYPE "public"."enum_feature_flags_community" AS ENUM('off', 'coming_soon', 'live');
  CREATE TYPE "public"."enum__feature_flags_v_version_custom_programs" AS ENUM('off', 'coming_soon', 'live');
  CREATE TYPE "public"."enum__feature_flags_v_version_community" AS ENUM('off', 'coming_soon', 'live');
  CREATE TABLE "feature_flags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"custom_programs" "enum_feature_flags_custom_programs" DEFAULT 'off' NOT NULL,
  	"community" "enum_feature_flags_community" DEFAULT 'off' NOT NULL,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_feature_flags_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_custom_programs" "enum__feature_flags_v_version_custom_programs" DEFAULT 'off' NOT NULL,
  	"version_community" "enum__feature_flags_v_version_community" DEFAULT 'off' NOT NULL,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_feature_flags_v" ADD CONSTRAINT "_feature_flags_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "feature_flags_updated_by_idx" ON "feature_flags" USING btree ("updated_by_id");
  CREATE INDEX "_feature_flags_v_version_version_updated_by_idx" ON "_feature_flags_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_feature_flags_v_created_at_idx" ON "_feature_flags_v" USING btree ("created_at");
  CREATE INDEX "_feature_flags_v_updated_at_idx" ON "_feature_flags_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "feature_flags" CASCADE;
  DROP TABLE "_feature_flags_v" CASCADE;
  DROP TYPE "public"."enum_feature_flags_custom_programs";
  DROP TYPE "public"."enum_feature_flags_community";
  DROP TYPE "public"."enum__feature_flags_v_version_custom_programs";
  DROP TYPE "public"."enum__feature_flags_v_version_community";`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_targets_target_type" AS ENUM('body_part', 'muscle_region', 'core', 'warm_up', 'cool_down', 'mobility', 'conditioning', 'other');
  CREATE TYPE "public"."enum_cms_exercises_equipment" AS ENUM('barbell', 'dumbbell', 'cable', 'machine', 'bench', 'bodyweight', 'resistance_band', 'treadmill', 'stationary_bike', 'other');
  CREATE TYPE "public"."enum_cms_exercises_category" AS ENUM('strength', 'core', 'warm_up', 'cool_down', 'mobility', 'cardio', 'recovery', 'other');
  CREATE TYPE "public"."enum_cms_exercises_default_measurement_type" AS ENUM('total_weight', 'weight_each', 'bodyweight', 'duration');
  CREATE TABLE "targets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"target_type" "enum_targets_target_type" NOT NULL,
  	"parent_target_id" integer,
  	"description" jsonb,
  	"image_id" integer,
  	"active" boolean DEFAULT true,
  	"display_order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms_exercises_equipment" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_cms_exercises_equipment",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cms_exercises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"primary_target_id" integer,
  	"category" "enum_cms_exercises_category" NOT NULL,
  	"default_measurement_type" "enum_cms_exercises_default_measurement_type" NOT NULL,
  	"instructions" jsonb,
  	"coaching_notes" jsonb,
  	"image_id" integer,
  	"demo_video_id" integer,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms_exercises_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"targets_id" integer,
  	"cms_exercises_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "targets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cms_exercises_id" integer;
  ALTER TABLE "targets" ADD CONSTRAINT "targets_parent_target_id_targets_id_fk" FOREIGN KEY ("parent_target_id") REFERENCES "public"."targets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "targets" ADD CONSTRAINT "targets_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms_exercises_equipment" ADD CONSTRAINT "cms_exercises_equipment_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cms_exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_exercises" ADD CONSTRAINT "cms_exercises_primary_target_id_targets_id_fk" FOREIGN KEY ("primary_target_id") REFERENCES "public"."targets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms_exercises" ADD CONSTRAINT "cms_exercises_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms_exercises" ADD CONSTRAINT "cms_exercises_demo_video_id_media_id_fk" FOREIGN KEY ("demo_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms_exercises_rels" ADD CONSTRAINT "cms_exercises_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cms_exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_exercises_rels" ADD CONSTRAINT "cms_exercises_rels_targets_fk" FOREIGN KEY ("targets_id") REFERENCES "public"."targets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms_exercises_rels" ADD CONSTRAINT "cms_exercises_rels_exercises_fk" FOREIGN KEY ("cms_exercises_id") REFERENCES "public"."cms_exercises"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "targets_name_idx" ON "targets" USING btree ("name");
  CREATE UNIQUE INDEX "targets_slug_idx" ON "targets" USING btree ("slug");
  CREATE INDEX "targets_parent_target_idx" ON "targets" USING btree ("parent_target_id");
  CREATE INDEX "targets_image_idx" ON "targets" USING btree ("image_id");
  CREATE INDEX "targets_updated_at_idx" ON "targets" USING btree ("updated_at");
  CREATE INDEX "targets_created_at_idx" ON "targets" USING btree ("created_at");
  CREATE INDEX "cms_exercises_equipment_order_idx" ON "cms_exercises_equipment" USING btree ("order");
  CREATE INDEX "cms_exercises_equipment_parent_idx" ON "cms_exercises_equipment" USING btree ("parent_id");
  CREATE UNIQUE INDEX "cms_exercises_name_idx" ON "cms_exercises" USING btree ("name");
  CREATE UNIQUE INDEX "cms_exercises_slug_idx" ON "cms_exercises" USING btree ("slug");
  CREATE INDEX "cms_exercises_primary_target_idx" ON "cms_exercises" USING btree ("primary_target_id");
  CREATE INDEX "cms_exercises_image_idx" ON "cms_exercises" USING btree ("image_id");
  CREATE INDEX "cms_exercises_demo_video_idx" ON "cms_exercises" USING btree ("demo_video_id");
  CREATE INDEX "cms_exercises_updated_at_idx" ON "cms_exercises" USING btree ("updated_at");
  CREATE INDEX "cms_exercises_created_at_idx" ON "cms_exercises" USING btree ("created_at");
  CREATE INDEX "cms_exercises_rels_order_idx" ON "cms_exercises_rels" USING btree ("order");
  CREATE INDEX "cms_exercises_rels_parent_idx" ON "cms_exercises_rels" USING btree ("parent_id");
  CREATE INDEX "cms_exercises_rels_path_idx" ON "cms_exercises_rels" USING btree ("path");
  CREATE INDEX "cms_exercises_rels_targets_id_idx" ON "cms_exercises_rels" USING btree ("targets_id");
  CREATE INDEX "cms_exercises_rels_cms_exercises_id_idx" ON "cms_exercises_rels" USING btree ("cms_exercises_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_targets_fk" FOREIGN KEY ("targets_id") REFERENCES "public"."targets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exercises_fk" FOREIGN KEY ("cms_exercises_id") REFERENCES "public"."cms_exercises"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_targets_id_idx" ON "payload_locked_documents_rels" USING btree ("targets_id");
  CREATE INDEX "payload_locked_documents_rels_cms_exercises_id_idx" ON "payload_locked_documents_rels" USING btree ("cms_exercises_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "targets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms_exercises_equipment" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms_exercises" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms_exercises_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "targets" CASCADE;
  DROP TABLE "cms_exercises_equipment" CASCADE;
  DROP TABLE "cms_exercises" CASCADE;
  DROP TABLE "cms_exercises_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_targets_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_exercises_fk";
  
  DROP INDEX "payload_locked_documents_rels_targets_id_idx";
  DROP INDEX "payload_locked_documents_rels_cms_exercises_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "targets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cms_exercises_id";
  DROP TYPE "public"."enum_targets_target_type";
  DROP TYPE "public"."enum_cms_exercises_equipment";
  DROP TYPE "public"."enum_cms_exercises_category";
  DROP TYPE "public"."enum_cms_exercises_default_measurement_type";`)
}

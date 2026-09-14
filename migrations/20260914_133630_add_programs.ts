import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_programs_warmup_items_item_type" AS ENUM('exercise', 'text');
  CREATE TYPE "public"."enum_phase_day_warmup_items_item_type" AS ENUM('exercise', 'text');
  CREATE TYPE "public"."enum_phase_group_items_measurement_type" AS ENUM('total_weight', 'weight_each', 'bodyweight', 'duration');
  CREATE TYPE "public"."enum_phase_group_items_prescription_type" AS ENUM('fixed', 'range', 'time', 'distance', 'until_comfortable', 'custom');
  CREATE TYPE "public"."enum_phase_group_items_duration_unit" AS ENUM('sec', 'min');
  CREATE TYPE "public"."enum_phase_group_items_distance_unit" AS ENUM('m', 'km', 'mi');
  CREATE TYPE "public"."enum_phase_group_items_per_side_label" AS ENUM('side', 'arm', 'leg');
  CREATE TYPE "public"."enum_phase_days_groups_workout_type" AS ENUM('Full Body', 'Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Biceps', 'Triceps', 'Core / Abs', 'Calves', 'Forearms', 'Cardio', 'HIIT', 'Mobility / Recovery', 'Rest Day', 'Other');
  CREATE TYPE "public"."enum_phase_create_days_warm_up_behavior" AS ENUM('use_program', 'add_to_program', 'replace_program', 'none');
  CREATE TYPE "public"."enum_programs_blocks_phase_phase_type" AS ENUM('introduction', 'foundation', 'progression', 'strength', 'hypertrophy', 'conditioning', 'recovery', 'deload', 'assessment', 'custom');
  CREATE TYPE "public"."enum_programs_blocks_phase_content_mode" AS ENUM('create', 'reuse', 'info');
  CREATE TYPE "public"."enum_programs_cooldown_items_item_type" AS ENUM('exercise', 'text');
  CREATE TYPE "public"."enum_programs_blocks_rich_text_display_style" AS ENUM('standard', 'information', 'success', 'warning', 'safety');
  CREATE TYPE "public"."enum_programs_difficulty" AS ENUM('beginner', 'intermediate', 'advanced', 'all_levels');
  CREATE TYPE "public"."enum_programs_program_type" AS ENUM('bro_split', 'ppl', 'upper_lower', 'full_body', 'strength', 'mobility', 'custom');
  CREATE TYPE "public"."enum_programs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__programs_warmup_items_v_item_type" AS ENUM('exercise', 'text');
  CREATE TYPE "public"."enum__phase_day_warmup_items_v_item_type" AS ENUM('exercise', 'text');
  CREATE TYPE "public"."enum__phase_group_items_v_measurement_type" AS ENUM('total_weight', 'weight_each', 'bodyweight', 'duration');
  CREATE TYPE "public"."enum__phase_group_items_v_prescription_type" AS ENUM('fixed', 'range', 'time', 'distance', 'until_comfortable', 'custom');
  CREATE TYPE "public"."enum__phase_group_items_v_duration_unit" AS ENUM('sec', 'min');
  CREATE TYPE "public"."enum__phase_group_items_v_distance_unit" AS ENUM('m', 'km', 'mi');
  CREATE TYPE "public"."enum__phase_group_items_v_per_side_label" AS ENUM('side', 'arm', 'leg');
  CREATE TYPE "public"."enum__phase_days_groups_v_workout_type" AS ENUM('Full Body', 'Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs', 'Chest', 'Back', 'Shoulders', 'Arms', 'Biceps', 'Triceps', 'Core / Abs', 'Calves', 'Forearms', 'Cardio', 'HIIT', 'Mobility / Recovery', 'Rest Day', 'Other');
  CREATE TYPE "public"."enum__phase_create_days_v_warm_up_behavior" AS ENUM('use_program', 'add_to_program', 'replace_program', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_phase_phase_type" AS ENUM('introduction', 'foundation', 'progression', 'strength', 'hypertrophy', 'conditioning', 'recovery', 'deload', 'assessment', 'custom');
  CREATE TYPE "public"."enum__programs_v_blocks_phase_content_mode" AS ENUM('create', 'reuse', 'info');
  CREATE TYPE "public"."enum__programs_cooldown_items_v_item_type" AS ENUM('exercise', 'text');
  CREATE TYPE "public"."enum__programs_v_blocks_rich_text_display_style" AS ENUM('standard', 'information', 'success', 'warning', 'safety');
  CREATE TYPE "public"."enum__programs_v_version_difficulty" AS ENUM('beginner', 'intermediate', 'advanced', 'all_levels');
  CREATE TYPE "public"."enum__programs_v_version_program_type" AS ENUM('bro_split', 'ppl', 'upper_lower', 'full_body', 'strength', 'mobility', 'custom');
  CREATE TYPE "public"."enum__programs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "programs_warmup_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_type" "enum_programs_warmup_items_item_type",
  	"exercise_id" integer,
  	"prescription_text" varchar,
  	"text_content" jsonb,
  	"instructions" jsonb
  );
  
  CREATE TABLE "programs_blocks_warm_up" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'General Warm-Up',
  	"description" jsonb,
  	"extra_info" jsonb,
  	"initially_expanded" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "phase_reuse_day_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_number" numeric,
  	"excluded" boolean DEFAULT false,
  	"notes" jsonb
  );
  
  CREATE TABLE "phase_day_warmup_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_type" "enum_phase_day_warmup_items_item_type",
  	"exercise_id" integer,
  	"prescription_text" varchar,
  	"text_content" jsonb,
  	"instructions" jsonb
  );
  
  CREATE TABLE "phase_group_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"exercise_id" integer,
  	"measurement_type" "enum_phase_group_items_measurement_type",
  	"sets" numeric,
  	"prescription_type" "enum_phase_group_items_prescription_type",
  	"fixed_reps" numeric,
  	"min_reps" numeric,
  	"max_reps" numeric,
  	"duration_value" numeric,
  	"duration_unit" "enum_phase_group_items_duration_unit",
  	"distance_value" numeric,
  	"distance_unit" "enum_phase_group_items_distance_unit",
  	"custom_prescription" jsonb,
  	"per_side" boolean DEFAULT false,
  	"per_side_label" "enum_phase_group_items_per_side_label",
  	"min_rest_sec" numeric,
  	"max_rest_sec" numeric,
  	"notes" jsonb,
  	"extra_info" jsonb,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "phase_days_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"workout_type" "enum_phase_days_groups_workout_type",
  	"group_target_id" integer,
  	"description" jsonb,
  	"display_table_header" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "phase_interval_rounds" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"warm_up" varchar,
  	"hard_effort" varchar,
  	"recovery" varchar,
  	"repeat" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "phase_create_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_number" numeric,
  	"day_name" varchar,
  	"display_title" varchar,
  	"description" jsonb,
  	"warm_up_behavior" "enum_phase_create_days_warm_up_behavior" DEFAULT 'use_program',
  	"intervals_intro" jsonb,
  	"intervals_cool_down" varchar,
  	"progression_note" jsonb,
  	"extra_info" jsonb,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "programs_blocks_phase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase_key" varchar,
  	"name" varchar,
  	"display_title" varchar,
  	"phase_type" "enum_programs_blocks_phase_phase_type",
  	"custom_type_label" varchar,
  	"description" jsonb,
  	"internal_notes" jsonb,
  	"content_mode" "enum_programs_blocks_phase_content_mode" DEFAULT 'create',
  	"start_week" numeric,
  	"end_week" numeric,
  	"source_phase_key" varchar,
  	"sets_scale" numeric DEFAULT 1,
  	"instructions" jsonb,
  	"progression_guidance" jsonb,
  	"recovery_guidance" jsonb,
  	"initially_expanded" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_cooldown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_type" "enum_programs_cooldown_items_item_type",
  	"exercise_id" integer,
  	"prescription_text" varchar,
  	"text_content" jsonb,
  	"instructions" jsonb
  );
  
  CREATE TABLE "programs_blocks_cool_down" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Cool-Down',
  	"description" jsonb,
  	"extra_info" jsonb,
  	"initially_expanded" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"display_style" "enum_programs_blocks_rich_text_display_style" DEFAULT 'standard',
  	"collapsible" boolean DEFAULT false,
  	"initially_expanded" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_safety" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Before You Start',
  	"safety_content" jsonb,
  	"require_acknowledgement" boolean DEFAULT true,
  	"acknowledgement_content" jsonb,
  	"action_label" varchar DEFAULT 'Select & Start',
  	"block_name" varchar
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"subtitle" varchar,
  	"slug" varchar,
  	"abbreviation" varchar,
  	"short_description" jsonb,
  	"full_description" jsonb,
  	"weeks" numeric,
  	"days_per_week" numeric,
  	"session_minutes" numeric,
  	"difficulty" "enum_programs_difficulty",
  	"program_type" "enum_programs_program_type",
  	"custom_program_type_label" varchar,
  	"cover_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_programs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "programs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"targets_id" integer,
  	"cms_exercises_id" integer
  );
  
  CREATE TABLE "_programs_warmup_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_type" "enum__programs_warmup_items_v_item_type",
  	"exercise_id" integer,
  	"prescription_text" varchar,
  	"text_content" jsonb,
  	"instructions" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_warm_up" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'General Warm-Up',
  	"description" jsonb,
  	"extra_info" jsonb,
  	"initially_expanded" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_phase_reuse_day_overrides_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day_number" numeric,
  	"excluded" boolean DEFAULT false,
  	"notes" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_phase_day_warmup_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_type" "enum__phase_day_warmup_items_v_item_type",
  	"exercise_id" integer,
  	"prescription_text" varchar,
  	"text_content" jsonb,
  	"instructions" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_phase_group_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"exercise_id" integer,
  	"measurement_type" "enum__phase_group_items_v_measurement_type",
  	"sets" numeric,
  	"prescription_type" "enum__phase_group_items_v_prescription_type",
  	"fixed_reps" numeric,
  	"min_reps" numeric,
  	"max_reps" numeric,
  	"duration_value" numeric,
  	"duration_unit" "enum__phase_group_items_v_duration_unit",
  	"distance_value" numeric,
  	"distance_unit" "enum__phase_group_items_v_distance_unit",
  	"custom_prescription" jsonb,
  	"per_side" boolean DEFAULT false,
  	"per_side_label" "enum__phase_group_items_v_per_side_label",
  	"min_rest_sec" numeric,
  	"max_rest_sec" numeric,
  	"notes" jsonb,
  	"extra_info" jsonb,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_phase_days_groups_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"workout_type" "enum__phase_days_groups_v_workout_type",
  	"group_target_id" integer,
  	"description" jsonb,
  	"display_table_header" boolean DEFAULT true,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_phase_interval_rounds_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"warm_up" varchar,
  	"hard_effort" varchar,
  	"recovery" varchar,
  	"repeat" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_phase_create_days_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day_number" numeric,
  	"day_name" varchar,
  	"display_title" varchar,
  	"description" jsonb,
  	"warm_up_behavior" "enum__phase_create_days_v_warm_up_behavior" DEFAULT 'use_program',
  	"intervals_intro" jsonb,
  	"intervals_cool_down" varchar,
  	"progression_note" jsonb,
  	"extra_info" jsonb,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_phase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"phase_key" varchar,
  	"name" varchar,
  	"display_title" varchar,
  	"phase_type" "enum__programs_v_blocks_phase_phase_type",
  	"custom_type_label" varchar,
  	"description" jsonb,
  	"internal_notes" jsonb,
  	"content_mode" "enum__programs_v_blocks_phase_content_mode" DEFAULT 'create',
  	"start_week" numeric,
  	"end_week" numeric,
  	"source_phase_key" varchar,
  	"sets_scale" numeric DEFAULT 1,
  	"instructions" jsonb,
  	"progression_guidance" jsonb,
  	"recovery_guidance" jsonb,
  	"initially_expanded" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_cooldown_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_type" "enum__programs_cooldown_items_v_item_type",
  	"exercise_id" integer,
  	"prescription_text" varchar,
  	"text_content" jsonb,
  	"instructions" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_cool_down" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Cool-Down',
  	"description" jsonb,
  	"extra_info" jsonb,
  	"initially_expanded" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"display_style" "enum__programs_v_blocks_rich_text_display_style" DEFAULT 'standard',
  	"collapsible" boolean DEFAULT false,
  	"initially_expanded" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_safety" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Before You Start',
  	"safety_content" jsonb,
  	"require_acknowledgement" boolean DEFAULT true,
  	"acknowledgement_content" jsonb,
  	"action_label" varchar DEFAULT 'Select & Start',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_subtitle" varchar,
  	"version_slug" varchar,
  	"version_abbreviation" varchar,
  	"version_short_description" jsonb,
  	"version_full_description" jsonb,
  	"version_weeks" numeric,
  	"version_days_per_week" numeric,
  	"version_session_minutes" numeric,
  	"version_difficulty" "enum__programs_v_version_difficulty",
  	"version_program_type" "enum__programs_v_version_program_type",
  	"version_custom_program_type_label" varchar,
  	"version_cover_image_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__programs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_programs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"targets_id" integer,
  	"cms_exercises_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "programs_warmup_items" ADD CONSTRAINT "programs_warmup_items_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_warmup_items" ADD CONSTRAINT "programs_warmup_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_warm_up"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_warm_up" ADD CONSTRAINT "programs_blocks_warm_up_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "phase_reuse_day_overrides" ADD CONSTRAINT "phase_reuse_day_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_phase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "phase_day_warmup_items" ADD CONSTRAINT "phase_day_warmup_items_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "phase_day_warmup_items" ADD CONSTRAINT "phase_day_warmup_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."phase_create_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "phase_group_items" ADD CONSTRAINT "phase_group_items_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "phase_group_items" ADD CONSTRAINT "phase_group_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."phase_days_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "phase_days_groups" ADD CONSTRAINT "phase_days_groups_group_target_id_targets_id_fk" FOREIGN KEY ("group_target_id") REFERENCES "public"."targets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "phase_days_groups" ADD CONSTRAINT "phase_days_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."phase_create_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "phase_interval_rounds" ADD CONSTRAINT "phase_interval_rounds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."phase_create_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "phase_create_days" ADD CONSTRAINT "phase_create_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_phase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_phase" ADD CONSTRAINT "programs_blocks_phase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_cooldown_items" ADD CONSTRAINT "programs_cooldown_items_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_cooldown_items" ADD CONSTRAINT "programs_cooldown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_cool_down"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_cool_down" ADD CONSTRAINT "programs_blocks_cool_down_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_rich_text" ADD CONSTRAINT "programs_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_safety" ADD CONSTRAINT "programs_blocks_safety_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_targets_fk" FOREIGN KEY ("targets_id") REFERENCES "public"."targets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_rels" ADD CONSTRAINT "programs_rels_exercises_fk" FOREIGN KEY ("cms_exercises_id") REFERENCES "public"."cms_exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_warmup_items_v" ADD CONSTRAINT "_programs_warmup_items_v_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_warmup_items_v" ADD CONSTRAINT "_programs_warmup_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_warm_up"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_warm_up" ADD CONSTRAINT "_programs_v_blocks_warm_up_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_phase_reuse_day_overrides_v" ADD CONSTRAINT "_phase_reuse_day_overrides_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_phase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_phase_day_warmup_items_v" ADD CONSTRAINT "_phase_day_warmup_items_v_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_phase_day_warmup_items_v" ADD CONSTRAINT "_phase_day_warmup_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_phase_create_days_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_phase_group_items_v" ADD CONSTRAINT "_phase_group_items_v_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_phase_group_items_v" ADD CONSTRAINT "_phase_group_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_phase_days_groups_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_phase_days_groups_v" ADD CONSTRAINT "_phase_days_groups_v_group_target_id_targets_id_fk" FOREIGN KEY ("group_target_id") REFERENCES "public"."targets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_phase_days_groups_v" ADD CONSTRAINT "_phase_days_groups_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_phase_create_days_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_phase_interval_rounds_v" ADD CONSTRAINT "_phase_interval_rounds_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_phase_create_days_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_phase_create_days_v" ADD CONSTRAINT "_phase_create_days_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_phase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_phase" ADD CONSTRAINT "_programs_v_blocks_phase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_cooldown_items_v" ADD CONSTRAINT "_programs_cooldown_items_v_exercise_id_cms_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."cms_exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_cooldown_items_v" ADD CONSTRAINT "_programs_cooldown_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_cool_down"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_cool_down" ADD CONSTRAINT "_programs_v_blocks_cool_down_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_rich_text" ADD CONSTRAINT "_programs_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_safety" ADD CONSTRAINT "_programs_v_blocks_safety_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_targets_fk" FOREIGN KEY ("targets_id") REFERENCES "public"."targets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_rels" ADD CONSTRAINT "_programs_v_rels_exercises_fk" FOREIGN KEY ("cms_exercises_id") REFERENCES "public"."cms_exercises"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_warmup_items_order_idx" ON "programs_warmup_items" USING btree ("_order");
  CREATE INDEX "programs_warmup_items_parent_id_idx" ON "programs_warmup_items" USING btree ("_parent_id");
  CREATE INDEX "programs_warmup_items_exercise_idx" ON "programs_warmup_items" USING btree ("exercise_id");
  CREATE INDEX "programs_blocks_warm_up_order_idx" ON "programs_blocks_warm_up" USING btree ("_order");
  CREATE INDEX "programs_blocks_warm_up_parent_id_idx" ON "programs_blocks_warm_up" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_warm_up_path_idx" ON "programs_blocks_warm_up" USING btree ("_path");
  CREATE INDEX "phase_reuse_day_overrides_order_idx" ON "phase_reuse_day_overrides" USING btree ("_order");
  CREATE INDEX "phase_reuse_day_overrides_parent_id_idx" ON "phase_reuse_day_overrides" USING btree ("_parent_id");
  CREATE INDEX "phase_day_warmup_items_order_idx" ON "phase_day_warmup_items" USING btree ("_order");
  CREATE INDEX "phase_day_warmup_items_parent_id_idx" ON "phase_day_warmup_items" USING btree ("_parent_id");
  CREATE INDEX "phase_day_warmup_items_exercise_idx" ON "phase_day_warmup_items" USING btree ("exercise_id");
  CREATE INDEX "phase_group_items_order_idx" ON "phase_group_items" USING btree ("_order");
  CREATE INDEX "phase_group_items_parent_id_idx" ON "phase_group_items" USING btree ("_parent_id");
  CREATE INDEX "phase_group_items_exercise_idx" ON "phase_group_items" USING btree ("exercise_id");
  CREATE INDEX "phase_days_groups_order_idx" ON "phase_days_groups" USING btree ("_order");
  CREATE INDEX "phase_days_groups_parent_id_idx" ON "phase_days_groups" USING btree ("_parent_id");
  CREATE INDEX "phase_days_groups_group_target_idx" ON "phase_days_groups" USING btree ("group_target_id");
  CREATE INDEX "phase_interval_rounds_order_idx" ON "phase_interval_rounds" USING btree ("_order");
  CREATE INDEX "phase_interval_rounds_parent_id_idx" ON "phase_interval_rounds" USING btree ("_parent_id");
  CREATE INDEX "phase_create_days_order_idx" ON "phase_create_days" USING btree ("_order");
  CREATE INDEX "phase_create_days_parent_id_idx" ON "phase_create_days" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_phase_order_idx" ON "programs_blocks_phase" USING btree ("_order");
  CREATE INDEX "programs_blocks_phase_parent_id_idx" ON "programs_blocks_phase" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_phase_path_idx" ON "programs_blocks_phase" USING btree ("_path");
  CREATE INDEX "programs_cooldown_items_order_idx" ON "programs_cooldown_items" USING btree ("_order");
  CREATE INDEX "programs_cooldown_items_parent_id_idx" ON "programs_cooldown_items" USING btree ("_parent_id");
  CREATE INDEX "programs_cooldown_items_exercise_idx" ON "programs_cooldown_items" USING btree ("exercise_id");
  CREATE INDEX "programs_blocks_cool_down_order_idx" ON "programs_blocks_cool_down" USING btree ("_order");
  CREATE INDEX "programs_blocks_cool_down_parent_id_idx" ON "programs_blocks_cool_down" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_cool_down_path_idx" ON "programs_blocks_cool_down" USING btree ("_path");
  CREATE INDEX "programs_blocks_rich_text_order_idx" ON "programs_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "programs_blocks_rich_text_parent_id_idx" ON "programs_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_rich_text_path_idx" ON "programs_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "programs_blocks_safety_order_idx" ON "programs_blocks_safety" USING btree ("_order");
  CREATE INDEX "programs_blocks_safety_parent_id_idx" ON "programs_blocks_safety" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_safety_path_idx" ON "programs_blocks_safety" USING btree ("_path");
  CREATE UNIQUE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_cover_image_idx" ON "programs" USING btree ("cover_image_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs__status_idx" ON "programs" USING btree ("_status");
  CREATE INDEX "programs_rels_order_idx" ON "programs_rels" USING btree ("order");
  CREATE INDEX "programs_rels_parent_idx" ON "programs_rels" USING btree ("parent_id");
  CREATE INDEX "programs_rels_path_idx" ON "programs_rels" USING btree ("path");
  CREATE INDEX "programs_rels_targets_id_idx" ON "programs_rels" USING btree ("targets_id");
  CREATE INDEX "programs_rels_cms_exercises_id_idx" ON "programs_rels" USING btree ("cms_exercises_id");
  CREATE INDEX "_programs_warmup_items_v_order_idx" ON "_programs_warmup_items_v" USING btree ("_order");
  CREATE INDEX "_programs_warmup_items_v_parent_id_idx" ON "_programs_warmup_items_v" USING btree ("_parent_id");
  CREATE INDEX "_programs_warmup_items_v_exercise_idx" ON "_programs_warmup_items_v" USING btree ("exercise_id");
  CREATE INDEX "_programs_v_blocks_warm_up_order_idx" ON "_programs_v_blocks_warm_up" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_warm_up_parent_id_idx" ON "_programs_v_blocks_warm_up" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_warm_up_path_idx" ON "_programs_v_blocks_warm_up" USING btree ("_path");
  CREATE INDEX "_phase_reuse_day_overrides_v_order_idx" ON "_phase_reuse_day_overrides_v" USING btree ("_order");
  CREATE INDEX "_phase_reuse_day_overrides_v_parent_id_idx" ON "_phase_reuse_day_overrides_v" USING btree ("_parent_id");
  CREATE INDEX "_phase_day_warmup_items_v_order_idx" ON "_phase_day_warmup_items_v" USING btree ("_order");
  CREATE INDEX "_phase_day_warmup_items_v_parent_id_idx" ON "_phase_day_warmup_items_v" USING btree ("_parent_id");
  CREATE INDEX "_phase_day_warmup_items_v_exercise_idx" ON "_phase_day_warmup_items_v" USING btree ("exercise_id");
  CREATE INDEX "_phase_group_items_v_order_idx" ON "_phase_group_items_v" USING btree ("_order");
  CREATE INDEX "_phase_group_items_v_parent_id_idx" ON "_phase_group_items_v" USING btree ("_parent_id");
  CREATE INDEX "_phase_group_items_v_exercise_idx" ON "_phase_group_items_v" USING btree ("exercise_id");
  CREATE INDEX "_phase_days_groups_v_order_idx" ON "_phase_days_groups_v" USING btree ("_order");
  CREATE INDEX "_phase_days_groups_v_parent_id_idx" ON "_phase_days_groups_v" USING btree ("_parent_id");
  CREATE INDEX "_phase_days_groups_v_group_target_idx" ON "_phase_days_groups_v" USING btree ("group_target_id");
  CREATE INDEX "_phase_interval_rounds_v_order_idx" ON "_phase_interval_rounds_v" USING btree ("_order");
  CREATE INDEX "_phase_interval_rounds_v_parent_id_idx" ON "_phase_interval_rounds_v" USING btree ("_parent_id");
  CREATE INDEX "_phase_create_days_v_order_idx" ON "_phase_create_days_v" USING btree ("_order");
  CREATE INDEX "_phase_create_days_v_parent_id_idx" ON "_phase_create_days_v" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_phase_order_idx" ON "_programs_v_blocks_phase" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_phase_parent_id_idx" ON "_programs_v_blocks_phase" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_phase_path_idx" ON "_programs_v_blocks_phase" USING btree ("_path");
  CREATE INDEX "_programs_cooldown_items_v_order_idx" ON "_programs_cooldown_items_v" USING btree ("_order");
  CREATE INDEX "_programs_cooldown_items_v_parent_id_idx" ON "_programs_cooldown_items_v" USING btree ("_parent_id");
  CREATE INDEX "_programs_cooldown_items_v_exercise_idx" ON "_programs_cooldown_items_v" USING btree ("exercise_id");
  CREATE INDEX "_programs_v_blocks_cool_down_order_idx" ON "_programs_v_blocks_cool_down" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_cool_down_parent_id_idx" ON "_programs_v_blocks_cool_down" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_cool_down_path_idx" ON "_programs_v_blocks_cool_down" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_rich_text_order_idx" ON "_programs_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_rich_text_parent_id_idx" ON "_programs_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_rich_text_path_idx" ON "_programs_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_safety_order_idx" ON "_programs_v_blocks_safety" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_safety_parent_id_idx" ON "_programs_v_blocks_safety" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_safety_path_idx" ON "_programs_v_blocks_safety" USING btree ("_path");
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version_slug_idx" ON "_programs_v" USING btree ("version_slug");
  CREATE INDEX "_programs_v_version_version_cover_image_idx" ON "_programs_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_version_version__status_idx" ON "_programs_v" USING btree ("version__status");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_latest_idx" ON "_programs_v" USING btree ("latest");
  CREATE INDEX "_programs_v_rels_order_idx" ON "_programs_v_rels" USING btree ("order");
  CREATE INDEX "_programs_v_rels_parent_idx" ON "_programs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_programs_v_rels_path_idx" ON "_programs_v_rels" USING btree ("path");
  CREATE INDEX "_programs_v_rels_targets_id_idx" ON "_programs_v_rels" USING btree ("targets_id");
  CREATE INDEX "_programs_v_rels_cms_exercises_id_idx" ON "_programs_v_rels" USING btree ("cms_exercises_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs_warmup_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_blocks_warm_up" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "phase_reuse_day_overrides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "phase_day_warmup_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "phase_group_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "phase_days_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "phase_interval_rounds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "phase_create_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_blocks_phase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_cooldown_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_blocks_cool_down" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_blocks_safety" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_warmup_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_blocks_warm_up" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_phase_reuse_day_overrides_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_phase_day_warmup_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_phase_group_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_phase_days_groups_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_phase_interval_rounds_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_phase_create_days_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_blocks_phase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_cooldown_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_blocks_cool_down" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_blocks_safety" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "programs_warmup_items" CASCADE;
  DROP TABLE "programs_blocks_warm_up" CASCADE;
  DROP TABLE "phase_reuse_day_overrides" CASCADE;
  DROP TABLE "phase_day_warmup_items" CASCADE;
  DROP TABLE "phase_group_items" CASCADE;
  DROP TABLE "phase_days_groups" CASCADE;
  DROP TABLE "phase_interval_rounds" CASCADE;
  DROP TABLE "phase_create_days" CASCADE;
  DROP TABLE "programs_blocks_phase" CASCADE;
  DROP TABLE "programs_cooldown_items" CASCADE;
  DROP TABLE "programs_blocks_cool_down" CASCADE;
  DROP TABLE "programs_blocks_rich_text" CASCADE;
  DROP TABLE "programs_blocks_safety" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_rels" CASCADE;
  DROP TABLE "_programs_warmup_items_v" CASCADE;
  DROP TABLE "_programs_v_blocks_warm_up" CASCADE;
  DROP TABLE "_phase_reuse_day_overrides_v" CASCADE;
  DROP TABLE "_phase_day_warmup_items_v" CASCADE;
  DROP TABLE "_phase_group_items_v" CASCADE;
  DROP TABLE "_phase_days_groups_v" CASCADE;
  DROP TABLE "_phase_interval_rounds_v" CASCADE;
  DROP TABLE "_phase_create_days_v" CASCADE;
  DROP TABLE "_programs_v_blocks_phase" CASCADE;
  DROP TABLE "_programs_cooldown_items_v" CASCADE;
  DROP TABLE "_programs_v_blocks_cool_down" CASCADE;
  DROP TABLE "_programs_v_blocks_rich_text" CASCADE;
  DROP TABLE "_programs_v_blocks_safety" CASCADE;
  DROP TABLE "_programs_v" CASCADE;
  DROP TABLE "_programs_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_programs_fk";
  
  DROP INDEX "payload_locked_documents_rels_programs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "programs_id";
  DROP TYPE "public"."enum_programs_warmup_items_item_type";
  DROP TYPE "public"."enum_phase_day_warmup_items_item_type";
  DROP TYPE "public"."enum_phase_group_items_measurement_type";
  DROP TYPE "public"."enum_phase_group_items_prescription_type";
  DROP TYPE "public"."enum_phase_group_items_duration_unit";
  DROP TYPE "public"."enum_phase_group_items_distance_unit";
  DROP TYPE "public"."enum_phase_group_items_per_side_label";
  DROP TYPE "public"."enum_phase_days_groups_workout_type";
  DROP TYPE "public"."enum_phase_create_days_warm_up_behavior";
  DROP TYPE "public"."enum_programs_blocks_phase_phase_type";
  DROP TYPE "public"."enum_programs_blocks_phase_content_mode";
  DROP TYPE "public"."enum_programs_cooldown_items_item_type";
  DROP TYPE "public"."enum_programs_blocks_rich_text_display_style";
  DROP TYPE "public"."enum_programs_difficulty";
  DROP TYPE "public"."enum_programs_program_type";
  DROP TYPE "public"."enum_programs_status";
  DROP TYPE "public"."enum__programs_warmup_items_v_item_type";
  DROP TYPE "public"."enum__phase_day_warmup_items_v_item_type";
  DROP TYPE "public"."enum__phase_group_items_v_measurement_type";
  DROP TYPE "public"."enum__phase_group_items_v_prescription_type";
  DROP TYPE "public"."enum__phase_group_items_v_duration_unit";
  DROP TYPE "public"."enum__phase_group_items_v_distance_unit";
  DROP TYPE "public"."enum__phase_group_items_v_per_side_label";
  DROP TYPE "public"."enum__phase_days_groups_v_workout_type";
  DROP TYPE "public"."enum__phase_create_days_v_warm_up_behavior";
  DROP TYPE "public"."enum__programs_v_blocks_phase_phase_type";
  DROP TYPE "public"."enum__programs_v_blocks_phase_content_mode";
  DROP TYPE "public"."enum__programs_cooldown_items_v_item_type";
  DROP TYPE "public"."enum__programs_v_blocks_rich_text_display_style";
  DROP TYPE "public"."enum__programs_v_version_difficulty";
  DROP TYPE "public"."enum__programs_v_version_program_type";
  DROP TYPE "public"."enum__programs_v_version_status";`)
}

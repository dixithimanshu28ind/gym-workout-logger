import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Exercises } from "./collections/Exercises";
import { InterestRegistrations } from "./collections/InterestRegistrations";
import { Media } from "./collections/Media";
import { Programs } from "./collections/Programs";
import { Targets } from "./collections/Targets";
import { Users } from "./collections/Users";
import { FeatureFlags } from "./globals/FeatureFlags";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Targets, Exercises, Programs, InterestRegistrations],
  globals: [FeatureFlags],
  editor: lexicalEditor(),
  routes: {
    api: "/api/payload",
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      max: 5,
    },
    // This Postgres instance already hosts the app's own unrelated tables
    // (profiles/exercises/workouts/sets). Drizzle's interactive dev-mode
    // `push` introspects the whole DB and can misread an unfamiliar
    // existing table as a rename target for a new Payload table — never
    // let that run against a shared DB. Explicit, reviewed migrations only.
    push: false,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
      },
    }),
  ],
});

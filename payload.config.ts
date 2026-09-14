import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users],
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
});

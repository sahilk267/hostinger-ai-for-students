import { defineConfig } from "drizzle-kit";
import { buildDatabaseUrl } from "./server/_core/env";

const connectionString = buildDatabaseUrl(process.env);
if (!connectionString) {
  throw new Error("DATABASE_URL or a complete split database configuration is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});

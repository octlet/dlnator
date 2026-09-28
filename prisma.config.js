import { defineConfig, env } from "prisma/config";

try {
  process.loadEnvFile();
} catch {
  // no .env file, env vars are expected to be set directly (e.g. docker-compose)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

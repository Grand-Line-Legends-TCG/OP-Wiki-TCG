import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./server/schema/index.ts",
    out: "./server/migrations/",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});s
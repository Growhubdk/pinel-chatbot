import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Indlæs miljøvariabler fra .env.local
config({ path: '.env.local' });

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Brug DATABASE_URL, som er standardnavnet for databaseforbindelser
    url: process.env.DATABASE_URL!,
  },
});

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Hent URL fra miljøvariabel
const sql = postgres(process.env.DATABASE_URL!, {
  // Hvis du vil, kan du sætte ekstra options her, fx ssl osv.
  ssl: { rejectUnauthorized: false }, // hvis det er nødvendigt for Supabase
});

const db = drizzle(sql);

export { db };

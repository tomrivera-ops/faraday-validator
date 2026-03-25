import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const requiredVars = ["SUPABASE_URL", "SUPABASE_ANON_KEY"] as const;

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`Missing required env var: ${varName}`);
    process.exit(1);
  }
}

export const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

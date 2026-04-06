import { supabase } from "../connectors/supabase";
import { ValidationResult } from "../utils/types";

export async function validateSchema(): Promise<ValidationResult> {
  // Attempt a minimal select to verify the table exists and is accessible.
  // We cannot inspect column metadata via the anon key (information_schema
  // is typically blocked by RLS/permissions), so we use a limit-0 select
  // and check that the response shape is valid (no relation-not-found error).
  const { data, error } = await supabase
    .from("family_groups")
    .select("id, name, created_at")
    .limit(0);

  if (error) {
    return {
      name: "schema",
      status: "FAIL",
      message: `Schema check failed: ${error.message} (code: ${error.code})`,
    };
  }

  // data should be an empty array if the table exists and columns are valid
  if (!Array.isArray(data)) {
    return {
      name: "schema",
      status: "FAIL",
      message: "Unexpected response shape from family_groups query",
    };
  }

  return {
    name: "schema",
    status: "PASS",
    message: "family_groups table is accessible with expected columns (id, name, created_at)",
  };
}

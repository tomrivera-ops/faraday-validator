import { supabase } from "../connectors/supabase";
import { ValidationResult } from "../utils/types";

export async function validateRLS(): Promise<ValidationResult> {
  const testName = `validator-test-${Date.now()}`;

  const { data, error } = await supabase
    .from("family_groups")
    .insert({ name: testName })
    .select("id")
    .single();

  if (error) {
    return {
      name: "rls",
      status: "FAIL",
      message: `RLS insert blocked: ${error.message} (code: ${error.code})`,
    };
  }

  // Clean up the test row. If this fails it's not critical — the row has a
  // clearly identifiable name prefix. Cleanup can fail if RLS delete policies
  // differ from insert policies, which is itself useful diagnostic info.
  if (data?.id) {
    const { error: deleteError } = await supabase
      .from("family_groups")
      .delete()
      .eq("id", data.id);

    if (deleteError) {
      return {
        name: "rls",
        status: "PASS",
        message: `Insert succeeded but cleanup failed: ${deleteError.message}. Test row "${testName}" may remain.`,
      };
    }
  }

  return {
    name: "rls",
    status: "PASS",
    message: "Insert and cleanup on family_groups succeeded",
  };
}

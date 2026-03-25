import { supabase } from "../connectors/supabase";
import { ValidationResult } from "../utils/types";

export async function validateAuth(): Promise<ValidationResult> {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    return {
      name: "auth",
      status: "FAIL",
      message: "Missing TEST_EMAIL or TEST_PASSWORD env vars",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      name: "auth",
      status: "FAIL",
      message: `Auth failed: ${error.message}`,
    };
  }

  if (!data.session) {
    return {
      name: "auth",
      status: "FAIL",
      message: "Auth returned no session",
    };
  }

  return {
    name: "auth",
    status: "PASS",
    message: `Authenticated as ${data.user?.email}`,
  };
}

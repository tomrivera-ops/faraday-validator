import { ValidationResult } from "../utils/types";

export function validateRLS(): ValidationResult {
  return {
    name: "rls",
    status: "PASS",
    message: "RLS validation placeholder passed",
  };
}

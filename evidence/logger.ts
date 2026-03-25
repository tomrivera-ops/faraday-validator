import { ValidationResult } from "../utils/types";

export function logResult(result: ValidationResult) {
  console.log(JSON.stringify(result, null, 2));
}

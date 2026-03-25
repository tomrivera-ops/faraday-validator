import * as fs from "fs";
import * as path from "path";
import { validateAuth } from "../validators/authValidator";
import { validateRLS } from "../validators/rlsValidator";
import { validateSchema } from "../validators/schemaValidator";
import { logResult } from "../evidence/logger";
import { ValidationResult } from "../utils/types";

const validatorMap: Record<string, () => Promise<ValidationResult>> = {
  auth: validateAuth,
  rls: validateRLS,
  schema: validateSchema,
};

export async function run(profileName: string) {
  const profilePath = path.join(__dirname, "..", "profiles", `${profileName}.json`);

  if (!fs.existsSync(profilePath)) {
    console.error(`Profile not found: ${profileName}`);
    process.exit(1);
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
  console.log(`\n Running profile: ${profile.name}\n`);

  const results: ValidationResult[] = [];

  for (const name of profile.validators) {
    const validator = validatorMap[name];
    if (!validator) {
      console.error(`Unknown validator: ${name}`);
      continue;
    }
    const result = await validator();
    logResult(result);
    results.push(result);
  }

  console.log("\n --- Results ---\n");
  for (const r of results) {
    const icon = r.status === "PASS" ? "[PASS]" : "[FAIL]";
    console.log(`  ${icon} ${r.name}: ${r.message}`);
  }

  const allPassed = results.every((r) => r.status === "PASS");
  console.log(`\n Summary: ${allPassed ? "PASS" : "FAIL"}\n`);
  process.exit(allPassed ? 0 : 1);
}

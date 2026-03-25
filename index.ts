import { run } from "./cli/run";

const args = process.argv.slice(2);
const command = args[0];
const profile = args[1];

if (command === "validate" && profile) {
  run(profile).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
} else {
  console.log("Usage: faraday validate <profile>");
  process.exit(1);
}

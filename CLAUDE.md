# CLAUDE.md — faraday-validator

> This file provides context for AI assistants (Claude, Cursor, etc.) working in this repo.

---

## Repo purpose

faraday-validator is a CLI-based deployment validation engine for the Faraday system. It runs live checks against a Supabase instance — verifying auth flows, RLS (Row Level Security) policies, and schema accessibility — then outputs structured JSON evidence with pass/fail results. It uses profile-based validation so different deployment targets (e.g., FSO) can define which validators to run.

## How it fits the system

- **Upstream dependencies** (this repo depends on): Supabase (live instance for auth, RLS, and schema checks), FSO project data (family_groups table)
- **Downstream consumers** (repos that depend on this): Deployment pipelines and CI workflows that gate releases on validation results
- **Role**: Standalone CLI tool — deployment gatekeeper that produces evidence logs

## Stack

- **Language**: TypeScript
- **Runtime**: Node.js (ts-node for development)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Package manager**: npm
- **Key dependencies**:
  - `@supabase/supabase-js` ^2.43.4
  - `dotenv` ^16.4.5
  - `typescript` ^5.4.5
  - `ts-node` ^10.9.2

## Key directories

```
/cli              — CLI entry point and runner (run.ts)
/validators       — Individual validation modules (auth, RLS, schema)
/connectors       — External service clients (Supabase)
/evidence         — Result logging utilities
/profiles         — Validation profile definitions (JSON)
/utils            — Shared types and helpers
index.ts          — Main entry point
```

## Dev commands

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, TEST_EMAIL, TEST_PASSWORD

# Run validation (FSO profile)
npm run dev -- validate fso

# Build (compile TypeScript)
npx tsc

# Type check without emitting
npx tsc --noEmit
```

## Branch workflow

This repo follows the org-wide branch strategy (see `tomrivera-ops/.github/CONTRIBUTING.md`):

- `main` — Production. No direct commits.
- `dev` — Integration. PRs only.
- `feat/*` — Feature work off `dev`.
- `mobile/*` — Scoped mobile edits off `dev`.
- `hotfix/*` — Emergency fixes off `main`.

### Repo-specific notes

- Validators run against a **live Supabase instance**. Never run validation commands in CI without confirming the target environment.
- The RLS validator inserts and deletes test rows in `family_groups`. Ensure test credentials have appropriate permissions.

## Safe vs unsafe changes

| Safe (Green zone) | Needs review (Yellow zone) | Do NOT touch (Red zone) |
|--------------------|---------------------------|------------------------|
| Add new validators following existing pattern | Modify existing validator logic | `.env` and credentials |
| Add new validation profiles | Change Supabase connector config | Supabase project settings |
| Update evidence logging format | Modify CLI argument parsing | Branch protection rules |
| Add types to utils/types.ts | Change the ValidationResult interface | Production profile definitions (without testing) |
| Fix typos in docs | Add new dependencies | |
| Add tests | Modify RLS test behavior (insert/delete) | |

## Do not touch

- `.env` — Contains live Supabase credentials and test user passwords. Never commit, never modify without explicit instruction.
- `connectors/supabase.ts` — Supabase client initialization. Changes here affect every validator. Requires careful review.
- `profiles/fso.json` — Active validation profile for FSO. Incorrect changes skip or break required checks.

## Areas requiring caution

- `validators/authValidator.ts` — Signs in with real credentials against live Supabase Auth. Incorrect changes could lock out the test user or leak auth errors.
- `validators/rlsValidator.ts` — Inserts and deletes real rows in `family_groups`. A broken cleanup path leaves test data in the database.
- `validators/schemaValidator.ts` — Verifies schema structure. Changes must match the actual Supabase table definitions.
- `evidence/logger.ts` — Evidence output format. Downstream consumers may parse this; changes could break integrations.

## PR expectations

- Use the org PR template
- Include validation steps (did you run `npm run dev -- validate fso` against a test instance?)
- Tag files modified
- Reference the issue number
- If AI wrote the code, note it in the PR
- For new validators: include sample PASS and FAIL output

## Notes for Claude

- Always read this file at the start of a session
- Run `git fetch origin && git status` before making changes
- Check `gh pr list` for open PRs that might conflict
- This repo runs against **live infrastructure** — never execute validation commands without confirming the target environment
- The `.env.example` shows required vars but never put real values in committed files
- When adding a new validator, follow the existing pattern: export an async function returning `ValidationResult`, register it in `cli/run.ts`'s `validatorMap`
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- When in doubt, ask — don't guess

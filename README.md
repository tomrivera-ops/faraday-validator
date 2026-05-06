# Faraday Validator

CLI-based deployment validation engine for auth, RLS, environment, and bootstrap checks across multi-tenant applications.

## Profiles

Each application gets its own profile file under `/profiles`. A profile defines which validators run and in what order, allowing different deployment targets to customize their validation pipeline.

Current profiles:
- **fso** (active)

## How it fits the system

This is the first real validation phase for FSO. faraday-validator acts as a deployment gatekeeper — it runs against a live Supabase instance to confirm auth, RLS, and schema are correctly configured before a release proceeds. Ensure your `.env` points to the correct project.

## Quick start

```bash
npm install
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, TEST_EMAIL, TEST_PASSWORD
npm run dev -- validate fso
```

## What it validates

| Validator | What it checks |
|-----------|---------------|
| `auth` | Signs in with test credentials, verifies a session is returned |
| `schema` | Verifies `family_groups` table is accessible with expected columns |
| `rls` | Inserts a test row into `family_groups`, verifies RLS allows it, cleans up |

## Environment variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `TEST_EMAIL` | Email of an existing test user |
| `TEST_PASSWORD` | Password for the test user |

## Output

Each validator prints structured JSON evidence and a readable summary. Final line is `PASS` (all checks passed) or `FAIL` (one or more failed). Exit code is non-zero on failure.

## AI usage

See [CLAUDE.md](./CLAUDE.md) for AI assistant context and operating guidelines.

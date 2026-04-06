# faraday-validator

CLI-based deployment validation engine for the Faraday system. Runs live checks against a Supabase instance — verifying auth flows, RLS policies, and schema accessibility — then outputs structured JSON evidence with pass/fail results. Part of the [tomrivera-ops](https://github.com/tomrivera-ops) platform.

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

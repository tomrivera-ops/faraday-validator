# Faraday Validator

CLI-based deployment validation engine for FSO. Checks Supabase auth, RLS policies, and schema accessibility.

## Setup

```bash
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Required env vars:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `TEST_EMAIL` | Email of an existing test user |
| `TEST_PASSWORD` | Password for the test user |

## Run

```bash
npm run dev -- validate fso
```

This runs the FSO validation profile which checks:

1. **auth** — signs in with test credentials, verifies a session is returned
2. **schema** — verifies `family_groups` table is accessible with expected columns
3. **rls** — inserts a test row into `family_groups`, verifies RLS allows it, then cleans up

## Output

Each validator prints structured JSON evidence and a readable summary. Final line is `PASS` (all checks passed) or `FAIL` (one or more failed). Exit code is non-zero on failure.

## Note

This is the first real validation phase for FSO. Validators run against a live Supabase instance — ensure your `.env` points to the correct project.

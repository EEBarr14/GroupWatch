# Data-isolation test prompt log

## Prompt

Build the data-isolation test from section 4 of `PLAN.md` on its own branch. Given User A has a private media entry and User B is the authenticated request identity, prove that User B cannot read, edit, or delete User A's entry.

Exercise the actual Supabase Row Level Security policies rather than mocking the database. Keep the test safe for the connected project: create only temporary data inside a transaction, return clear pass/fail results, and roll everything back. Do not print account IDs, personal email addresses, credentials, or real private entries.

For the assignment evidence, temporarily add an intentionally permissive policy inside the same transaction, capture the failing red run, remove that temporary break, and capture the passing green run. Document in plain English what the test checks and what real change would make it fail.

## Implementation notes

- Added a SQL integration test that runs as Supabase's `authenticated` role with a different generated user ID.
- Checked read, update, and delete access separately instead of checking only the library list.
- Added an assertion that fails the run if any protected operation affects a row.
- Ended every run with a rollback so the fixture entry, results, and red-only policy do not persist.

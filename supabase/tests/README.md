# Database integration tests

`data-isolation.sql` checks the privacy rule in `PLAN.md` against the real Supabase Row Level Security policies.

The test creates one temporary entry for User A, changes the request identity to a different authenticated User B, and checks that User B reads, edits, and deletes zero rows. It runs inside a transaction and ends with `rollback`, so the entry and test results do not remain in the database.

Run the complete file in the Supabase SQL editor. A successful run returns three rows marked `PASS`. The test raises an error if any check returns a row it should not be able to access.

For the required red screenshot, I temporarily added this permissive policy immediately before `set local role authenticated`, ran the test, and then removed it:

```sql
create policy "Temporary broken isolation for red evidence"
  on public.media_entries
  for all
  to authenticated
  using (true)
  with check (true);
```

That policy exists only inside the test transaction. Even when the test fails, PostgreSQL aborts and rolls back the transaction, so the real policies and data are unchanged.

The test would catch a real change that replaced the ownership checks on `media_entries` with a permissive `using (true)` policy, because User B would be able to read, edit, or delete User A's entry.

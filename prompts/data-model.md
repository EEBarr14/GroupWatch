# Data model prompt

Build feature 2 from `PLAN.md` on the `feature/data-model` branch and keep it limited to the database foundation.

Add a versioned Supabase migration for the `users`, `genres`, `media_entries`, and `stars` tables. Match the planned columns, relationships, required values, rating range, review length, and watch-status choices. Create a GroupWatch user row automatically when Supabase Auth creates an account, and backfill any existing email accounts safely.

Enable Row Level Security. A signed-in user should be able to access only their own profile, entries, and stars. Genres are a shared read-only lookup list for signed-in users. Enforce at the database level that a user can star only their own media entry. Keep public sharing disabled for now.

Add `schema.md` in a direct first-person voice that explains every table and relationship without sounding like marketing copy. Update the README with the live URL, but do not claim the library interface works yet. Do not commit keys, email addresses, or `.env.local` values.

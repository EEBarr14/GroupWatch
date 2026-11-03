# Ratings and reviews prompt log

## Prompt

Build feature 6 from `PLAN.md` on its own branch. Let me optionally rate a movie or show from one through five and save a short review of up to 500 characters. Use little TV icons instead of stars so the rating feels specific to GroupWatch. Keep the controls accessible, preserve entries after validation errors, and show the saved rating on library cards and the full rating and review on the detail page. Use the existing database columns and desert sunrise design.

## Implementation notes

- Added an optional five-TV rating control with native radio inputs and a clear option.
- Added an optional review field with a 500-character client and server limit.
- Saved ratings and reviews through the existing create and update actions.
- Displayed compact TV ratings on library cards and the full personal take on detail pages.
- Reused the existing database fields, so this feature does not need a migration.

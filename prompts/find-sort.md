# Find and sort prompt log

## Prompt

Build feature 8 from `PLAN.md` on its own branch. Let me search my library by title, filter by media type, genre, or watch status, and sort by newest, title, or rating. Keep the choices in the URL so the result survives a refresh, handle invalid URL values safely, and match the existing desert sunrise design.

## Implementation notes

- Added a labeled search and filter panel to the main library page.
- Applied search, filters, and sorting in the Supabase query rather than hiding cards only in the browser.
- Added a filtered empty state and a clear-filters path.
- Validated query-string choices against the app's known media types, statuses, genres, and sort options.

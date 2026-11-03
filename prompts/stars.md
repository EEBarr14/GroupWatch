# Stars prompt log

## Prompt

Build feature 7 from `PLAN.md` on its own branch. Let me star or unstar any movie or show from its library card or detail page, and add a Starred view where I can quickly find those titles. Keep the interaction accessible, protect every change with the signed-in user's identity, and use the existing `stars` table and desert sunrise design.

## Implementation notes

- Added an accessible star toggle to library cards and title detail pages.
- Added a dedicated Starred page and navigation link with a friendly empty state.
- Verified ownership inside the server action before inserting or deleting a star.
- Reused the existing `stars` table and Row Level Security policies, so this feature does not need a migration.

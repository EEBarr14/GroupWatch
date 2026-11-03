# Watch status prompt log

## Prompt

Build feature 5 from `PLAN.md` on its own branch. The add and edit forms already include watch status, so make the feature more useful instead of rebuilding the same control. Let me move a title between Want to Watch, Watching, and Watched directly from its detail page. Keep the current status obvious, save only that field, and show friendly success or error feedback. Preserve account ownership checks, refresh every page that displays status, and keep the existing desert sunrise design.

## Implementation notes

- Added a one-click status control to each library detail page.
- Kept the current status visually selected and disabled to prevent duplicate updates.
- Added a focused server action that verifies the signed-in owner before updating.
- Revalidated the library, detail page, and dashboard after every change.

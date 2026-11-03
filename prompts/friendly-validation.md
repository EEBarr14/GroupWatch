# Friendly validation prompt log

## Prompt

Build feature 4 from `PLAN.md` on its own branch. When someone submits the add or edit form with missing information, show a clear message beside each required field and keep everything they already entered. Use the existing GroupWatch voice and desert color scheme. Make the validation accessible with labels, error relationships, and an announced summary. Keep server-side validation as the source of truth and do not add another dependency.

## Implementation notes

- Added specific server-side messages for title, media type, genre, and watch status.
- Added an error summary plus inline messages and visible error styling.
- Connected each error to its field with `aria-invalid` and `aria-describedby`.
- Disabled the browser's generic validation pop-ups so GroupWatch can provide consistent, useful guidance.

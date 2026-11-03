# Public sharing prompt log

## Prompt

Build feature 10 from `PLAN.md` on its own branch. Let a signed-in user choose a public link, edit the display name friends will see, and turn sharing on or off. The public page must work without signing in and must be read-only.

Return only display name, title, media type, watch status, rating, and genre from the database. Do not expose email, review, private dates, streaming service, stars, edit controls, or account IDs—even if someone probes the public endpoint. Sharing must stay off by default, and disabled or unknown links must not reveal a watchlist. Match the desert sunrise design and keep the settings language clear about what is public and private.

## Implementation notes

- Added private sharing settings with a user-controlled display name, link name, and on/off switch.
- Added a read-only `/share/[slug]` page that works without an account.
- Added a security-definer database function returning one JSON object containing only approved public fields.
- Kept the underlying private tables unavailable to signed-out visitors.

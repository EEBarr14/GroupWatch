# GroupWatch Plan

## 1. Pitch

I'm building **GroupWatch** because I want one place to track the TV shows and movies I watch, remember what I thought, and optionally share my current watchlist with friends. It is a Goodreads-style personal library for screen entertainment. I expect to use it several times a week when I start or finish something or want to show a friend what I have enjoyed.

The first version will be private by default, with an optional public read-only page. It will not include friend requests, a social feed, comments, notifications, episode tracking, poster uploads, or an external movie database.

## 2. Features

The features are numbered in the order I plan to build them. Each feature will have its own GitHub Issue, feature branch, prompt log, pull request, merge, and deployment.

1. **Sign up and login:** As a new visitor, I want to sign up with my email and password and later log in and log out, so that my watch history belongs to my account.
2. **Account-owned data model:** As an account holder, I want every media entry I create to be connected to my user account and a genre, so that my library is organized and other signed-in users cannot access my private data.
3. **Library CRUD:** As a viewer, I want to add a movie or TV show, see my library, open an entry's detail page, edit it, and delete it after confirming, so that my library stays accurate.
4. **Friendly validation:** As a viewer, I want the app to require a title, media type, genre, and watch status and show a clear message when something is missing, so that I can correct the form without losing my work.
5. **Watch status (original feature 1):** As a viewer, I want to mark an entry as Want to Watch, Watching, or Watched, so that I can tell where each title is in my viewing journey.
6. **Ratings and reviews (original feature 2):** As a viewer, I want to give an entry an optional 1-5 rating and short review, so that I remember what I thought after watching it.
7. **Stars:** As a viewer, I want to star or unstar entries and open a view containing only my starred entries, so that I can quickly return to my favorites.
8. **Find and sort:** As a viewer, I want to search by title, filter by media type, genre, or watch status, and sort by newest, title, or rating, so that I can find an entry in a growing library.
9. **Dashboard:** As a viewer, I want to see my total number of entries, number watched, average rating, and a chart of entries by watch status, so that I can understand my viewing habits at a glance.
10. **Public share page (original feature 3):** As a viewer, I want to enable or disable a public, read-only link that shows selected watchlist information, so that friends can see what I am watching without signing in or changing my data.

The public page will show display name, title, media type, watch status, rating, and genre. It will not expose emails, reviews, private dates, edit controls, or unshared accounts. Sharing will be off by default.

## 3. Database

The database will contain four application tables in addition to Supabase's authentication tables. Each `users.id` will match the authenticated user's ID.

### `users`

| Column | Type | Rules and purpose |
| --- | --- | --- |
| `id` | UUID | Primary key; references the authenticated user's ID |
| `email` | Text | Required and unique |
| `display_name` | Text | Required; shown in the app and public page |
| `share_enabled` | True/false | Required; defaults to false |
| `share_slug` | Text | Unique and optional; used in the public share URL |
| `created_at` | Date/time | Required; defaults to the current time |

### `genres`

| Column | Type | Rules and purpose |
| --- | --- | --- |
| `id` | Number | Primary key, generated automatically |
| `name` | Text | Required and unique, such as Comedy, Drama, or Documentary |

Genres will be a small shared lookup list selected by users.

### `media_entries`

| Column | Type | Rules and purpose |
| --- | --- | --- |
| `id` | UUID | Primary key, generated automatically |
| `user_id` | UUID | Required foreign key to `users.id` |
| `genre_id` | Number | Required foreign key to `genres.id` |
| `title` | Text | Required |
| `media_type` | Text | Required; either Movie or TV Show |
| `watch_status` | Text | Required; Want to Watch, Watching, or Watched |
| `rating` | Number | Optional integer from 1 through 5 |
| `review` | Text | Optional; maximum 500 characters |
| `started_on` | Date | Optional |
| `finished_on` | Date | Optional |
| `created_at` | Date/time | Required; defaults to the current time |
| `updated_at` | Date/time | Required; updated whenever the entry changes |

### `stars`

| Column | Type | Rules and purpose |
| --- | --- | --- |
| `user_id` | UUID | Foreign key to `users.id`; first half of the combined primary key |
| `media_entry_id` | UUID | Foreign key to `media_entries.id`; second half of the combined primary key |
| `created_at` | Date/time | Required; defaults to the current time |

Each `(user_id, media_entry_id)` pair may appear once, and users may star only their own entries.

### Relationships

```text
users 1 -------- many media_entries many -------- 1 genres
  |                         |
  |                         |
  +---- many stars many ----+
```

- One user owns many media entries; one genre classifies many media entries.
- `stars` is the junction table connecting users and media entries.
- Row Level Security will let users create, read, update, delete, and star only their own entries.
- A read-only rule will expose limited public fields only when the owner's `share_enabled` is true.

## 4. Tests

1. **Data isolation:** Given User A has a private media entry and User B is logged in, when User B loads their library or requests User A's private entry, then User A's entry is not returned and cannot be edited or deleted.
2. **Dashboard average:** Given a user has two rated entries with ratings of 4 and 2, when the dashboard summary is calculated, then the average rating is displayed as 3.

For each test PR, I will include a plain-English explanation, a failing red screenshot, a passing green screenshot, and a change that would make the test fail.

## 5. Technologies

- **Coding agent - Codex:** I will build one scoped feature at a time and save key prompts in `prompts/<feature>.md`.
- **Application - Next.js with TypeScript:** Next.js provides the pages, forms, server logic, and deployment structure in one project, while TypeScript catches incorrect data shapes.
- **Database - Supabase PostgreSQL:** A relational database fits the connected users, entries, genres, and stars tables.
- **Authentication - Supabase Auth:** Email-and-password authentication connects directly to Supabase user IDs.
- **Authorization - Supabase Row Level Security:** Database policies will enforce private record ownership even if a request bypasses the interface.
- **Hosting - Vercel:** Its GitHub and Next.js integration can deploy every merge automatically.
- **Styling - Tailwind CSS:** It supports a consistent responsive design without a large custom stylesheet.
- **Charts - Recharts:** It can render the required chart from the calculated dashboard data.
- **Tests - Vitest and React Testing Library:** They provide repeatable tests for calculations and visible behavior.

## 6. Design

GroupWatch will use a desert sunrise and sunset theme: `#2D1B3D` aubergine and `#6E3B5D` dusk for backgrounds, `#D65A4A` coral and `#F29E4C` orange for actions, `#F6C85F` sunrise gold for highlights, and `#FFF1D6` sand for cards and light text areas.

The interface should feel warm, calm, and personal. Text-based cards will show a Movie or TV Show badge, status, rating, genre, and star. Goodreads inspires the tracking and reviews; Letterboxd inspires the compact presentation. Version one will not use poster artwork.

Navigation will contain Library, Starred, Dashboard, Share Settings, and Log Out and collapse on small screens. Forms will have visible labels, inline validation, keyboard-accessible controls, sufficient contrast, and delete confirmation.

## 7. Risks and Cuts

The riskiest feature is the public page because it must expose selected fields without exposing private data. I will limit it to one read-only page with an on/off setting and unique URL and test that disabled pages cannot be viewed.

If time becomes limited, I will cut or simplify work in this order:

1. Remove optional start and finish dates from the interface while keeping the core status field.
2. Offer fewer sort combinations while preserving search, at least one filter, and at least one sort.
3. Share only title, media type, status, and rating on the public page.
4. Reduce decorative animation and visual polish.

I will not cut authentication, data isolation, CRUD, validation, stars, the dashboard, either required test, or the three original features. I will not add an outside API, posters, following, comments, notifications, or episode tracking before the graded requirements work.

## 8. Plan vs. Reality

I will complete this table after the application is built without rewriting the original plan above.

| Planned feature | Shipped / Changed / Cut | Status (Done/Backlogged) | Learning | What changed and why |
| --- | --- | --- | --- | --- |
| Sign up and login | To be completed | Backlogged | To be completed | To be completed |
| Account-owned data model | To be completed | Backlogged | To be completed | To be completed |
| Library CRUD | To be completed | Backlogged | To be completed | To be completed |
| Friendly validation | To be completed | Backlogged | To be completed | To be completed |
| Watch status | To be completed | Backlogged | To be completed | To be completed |
| Ratings and reviews | To be completed | Backlogged | To be completed | To be completed |
| Stars | To be completed | Backlogged | To be completed | To be completed |
| Find and sort | To be completed | Backlogged | To be completed | To be completed |
| Dashboard | To be completed | Backlogged | To be completed | To be completed |
| Public share page | To be completed | Backlogged | To be completed | To be completed |

Reflection note for Library CRUD: I considered pulling poster artwork automatically, but that would require an outside movie database, API credentials, title matching, and attribution. I kept the text-based cards from my original scope instead. This is one place where the finished app will feel less visual than I first imagined, but it avoids adding a fragile dependency before the required features are complete.

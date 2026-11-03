# GroupWatch Database Schema

I use four application tables in Supabase. Supabase Auth still handles passwords and sessions; these tables hold the GroupWatch data connected to each account.

```text
auth.users 1 --- 1 users 1 --- many media_entries many --- 1 genres
                         |                 |
                         +--- many stars --+
```

## `users`

This is the GroupWatch profile that belongs to a Supabase Auth account.

| Column | Type | What it does |
| --- | --- | --- |
| `id` | UUID | Primary key and foreign key to `auth.users.id` |
| `email` | Text | Required and unique account email |
| `display_name` | Text | Required name for the app and future public page |
| `share_enabled` | True/false | Required; defaults to false |
| `share_slug` | Text | Optional unique value for a future public URL |
| `created_at` | Date/time | Required; defaults to the current time |

A database trigger creates this row when a new Supabase Auth account is created. If the signup does not include a display name yet, I use the part of the email before `@` as a temporary name.

## `genres`

This is a shared lookup list so genres stay consistent.

| Column | Type | What it does |
| --- | --- | --- |
| `id` | Number | Generated primary key |
| `name` | Text | Required and unique genre name |

The migration starts the list with common choices such as Comedy, Drama, Documentary, and Science Fiction. Signed-in users can read genres but cannot change the shared list.

## `media_entries`

This holds each movie or TV show in one user's library.

| Column | Type | What it does |
| --- | --- | --- |
| `id` | UUID | Generated primary key |
| `user_id` | UUID | Required foreign key to the owner in `users` |
| `genre_id` | Number | Required foreign key to `genres` |
| `title` | Text | Required title, up to 200 characters |
| `media_type` | Text | Required; Movie or TV Show |
| `watch_status` | Text | Required; Want to Watch, Watching, or Watched |
| `rating` | Number | Optional whole number from 1 through 5 |
| `review` | Text | Optional, up to 500 characters |
| `started_on` | Date | Optional start date |
| `finished_on` | Date | Optional finish date |
| `created_at` | Date/time | Required; defaults to the current time |
| `updated_at` | Date/time | Required; refreshed automatically after an edit |

## `stars`

This is the junction table for favorites. One row means one user starred one media entry.

| Column | Type | What it does |
| --- | --- | --- |
| `user_id` | UUID | Foreign key to `users`; first half of the primary key |
| `media_entry_id` | UUID | Foreign key to `media_entries`; second half of the primary key |
| `created_at` | Date/time | Required; defaults to the current time |

The combined foreign key also checks that the starred entry belongs to the same user. A user cannot star another account's entry.

## Privacy rules

Row Level Security is enabled on every table.

- A signed-in user can read and update only their own profile.
- A signed-in user can create, read, update, and delete only their own media entries.
- A signed-in user can create, read, and delete only their own stars.
- Signed-in users can read the shared genre list.
- Signed-out visitors cannot read these private tables.

Public sharing stays off by default. The later share-page feature will add a narrow read-only policy for fields that are safe to show.

# Library CRUD prompt

Build GroupWatch's third planned feature from GitHub issue #7 on its own feature branch.

Add a private, Supabase-backed library where a signed-in user can create a movie or TV show entry, view their library, open an entry's details, edit it, and delete it after confirming. Use the existing account-owned schema and Row Level Security instead of adding another data model. Include the required title, media type, genre, and watch status fields, but leave ratings, reviews, stars, search, filters, and public sharing for their planned feature branches.

Give the signed-in experience a responsive design pass using the established desert sunrise and sunset palette. Keep the writing direct and personal, make the empty state useful, and make the hierarchy clear without adding poster art. Verify authentication inside every server action, keep secrets out of the repository, and run lint and a production build before opening the pull request.

During visual review, add original continuous-line illustrations inspired by people watching together, using the GroupWatch palette across the landing, account, library, and entry screens. Also add a complete password recovery flow so a user who forgot their password can request a secure email link, choose and confirm a new password, then log in with it. Do not log or store password values.

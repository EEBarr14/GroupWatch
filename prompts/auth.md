# Authentication feature prompt log

## User story from the plan

> As a new visitor, I want to sign up with my email and password and later log in and log out, so that my watch history belongs to my account.

## Main build prompt

Build the first GroupWatch feature on its own branch. Set up a Next.js app with TypeScript and Tailwind, then connect Supabase email/password authentication. Add sign-up, login, logout, and a protected starting page. Use the desert sunrise and sunset colors in `PLAN.md`. Keep validation messages friendly. Do not commit credentials, real environment values, or personal email addresses. Add an `.env.example` with placeholders only, and make sure `.env.local` stays ignored.

Write the README in a direct first-person student voice. It should sound like the person building the class project, not like marketing copy or framework documentation, and it should only describe features that actually work.

## Follow-up direction

The app should stay private by default. Authentication must be checked on the server, not only hidden in the interface. The branch should remain limited to account access; the watchlist data model belongs in the next feature.

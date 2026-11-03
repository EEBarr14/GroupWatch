# GroupWatch

I'm building GroupWatch as a Goodreads-style tracker for TV shows and movies. I want one place to remember what I'm watching, what I want to watch next, and what I thought after I finished something. The longer-term goal is to let friends see a simple version of that list too.

Live app: [group-watch-beta.vercel.app](https://group-watch-beta.vercel.app)

## What works right now

Account access is working: a visitor can sign up with an email and password, log in, reset a forgotten password, and log out. A signed-in user can add, view, edit, and delete movies and shows in a private library, update watch status, save ratings and reviews, star favorites, search or filter the library, and see a personal dashboard. Supabase keeps each account's entries separate with Row Level Security. I am still building the public sharing page one pull request at a time.

## Tools I'm using

- Next.js and TypeScript for the app
- Tailwind CSS for the design
- Supabase for account authentication and the database
- Vercel for hosting the live app

## Run it locally

1. Install the project packages:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add the URL and publishable key from your own Supabase project. `.env.local` is ignored by Git and should never be committed.

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Project status

The full project plan is in [PLAN.md](./PLAN.md). The database tables and relationships are documented in [schema.md](./schema.md).

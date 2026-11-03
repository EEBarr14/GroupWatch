# GroupWatch

I'm building GroupWatch as a Goodreads-style tracker for TV shows and movies. I want one place to remember what I'm watching, what I want to watch next, and what I thought after I finished something. The longer-term goal is to let friends see a simple version of that list too.

## What works right now

This branch adds the first real feature: account access. A visitor can sign up with an email and password, log in, reach a protected starting page, and log out. The watchlist itself comes next.

## Tools I'm using

- Next.js and TypeScript for the app
- Tailwind CSS for the design
- Supabase for account authentication and, next, the database
- Vercel for hosting once the first feature is ready to deploy

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

The full project plan is in [PLAN.md](./PLAN.md). The live URL will be added here after the app is connected to Vercel.

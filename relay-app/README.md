# RELAY — Pass it like a baton

RELAY is a username-first private file delivery app. Instead of sharing public file links, a sender types `@username` and the file is delivered into that person's RELAY inbox.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, RLS and Realtime
- Cloudflare R2 private storage
- AWS SDK presigned POST / signed downloads
- Vercel Cron

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with your Supabase and R2 credentials.

### Supabase

The database schema has already been designed for RELAY. If starting a new project, run the SQL migration in `supabase/schema.sql`.

### R2

Create a private bucket called `relay-files`. Create R2 API credentials with object read/write access to this bucket.

For browser presigned POST uploads, configure bucket CORS to allow your app origin. A development example:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["POST", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Set a lifecycle rule in R2 to delete objects after 10 days. RELAY also marks expired database transfers as `baton_dropped` through the Vercel cron endpoint.

## Security model

- R2 objects are private.
- Browser uploads receive short-lived presigned POST fields.
- Downloads are issued only after the authenticated server verifies transfer ownership.
- Download URLs expire after one hour.
- Supabase RLS restricts transfer metadata to the sender/receiver.
- Never expose an R2 secret or Supabase secret/service-role key to the browser.

## GitHub

Push this project to `bmspadmin/relay`, then connect the repository to Vercel.

## Production environment variables

See `.env.example`.

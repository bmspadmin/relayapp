# RELAY — Pass it like a baton

RELAY is a username-first private file delivery app. Instead of sharing public file links, a sender types `@username` and the file is delivered into that person's RELAY inbox.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, RLS, Realtime and private Storage
- Vercel Cron

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with your Supabase project URL and publishable key.

### Supabase Storage

RELAY stores files in a private Supabase Storage bucket named `relay-files`.

Run `supabase/storage.sql` once in the Supabase SQL Editor. It creates the private bucket and policies that allow authenticated users to upload only into their own username folder, while only transfer participants can read a file.

The browser uploads directly to Supabase using a short-lived signed upload token, so large files do not have to pass through the Next.js server.

### Security model

- Storage bucket is private.
- Upload tokens are created only for authenticated users.
- Downloads are issued only after the authenticated server verifies transfer ownership.
- Download URLs expire after one hour.
- Supabase RLS restricts transfer metadata to the sender/receiver.
- Never expose a Supabase secret/service-role key to the browser.

## Deployment

The application lives under `relay-app/`; use that folder as the Vercel Root Directory.

See `.env.example` for production environment variables.

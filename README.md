# Frank Binette's site, now with Supabase

My personal site (rebuilt in Next.js) plus a few small features that each exercise a part of Supabase:

| Feature | Supabase part | Where |
| --- | --- | --- |
| Guestbook anyone can read, only I can moderate | Postgres + row level security | `supabase/migrations/*_guestbook*.sql`, `app/guestbook` |
| Magic-link (and optional GitHub) sign-in to post | Auth | `app/login`, `app/auth/callback`, `middleware.ts` |
| Post images and PDFs served from a bucket | Storage | `supabase/storage/site-assets`, `lib/storage.ts` |
| View counter on each post | Edge Functions | `supabase/functions/page-views`, `components/PageViews.tsx` |
| Guestbook updates live, "N people reading now" | Realtime | `app/guestbook/GuestbookEntries.tsx`, `components/ReadersBadge.tsx` |
| CI, deploys from GitHub, preview branches | Platform | `.github/workflows`, [docs/supabase.md](docs/supabase.md) |

## Run it locally

You need Node 22 and Docker Desktop running.

```sh
npm install
npx supabase start          # first run pulls the Docker images, takes a few minutes
npx supabase seed buckets   # uploads post images and PDFs to the local bucket
npm run env:local           # writes .env.local with the local API URL and key
npm run dev                 # http://localhost:3000
```

Then try each feature:

1. **Guestbook:** open http://localhost:3000/guestbook. You'll see two seeded entries.
2. **Sign in:** click "Sign in to sign the guestbook", enter any email, and open the link from
   [Mailpit](http://127.0.0.1:54324) (the local inbox). Back on the guestbook, leave a message.
3. **Moderate:** put the email you signed in with in `supabase/seed.sql` (replace `owner@example.com`),
   run `npm run db:reset`, sign in again, and delete buttons show up.
4. **Storage:** open any post with pictures, like `/2022/02/25/confoo-2022`. Images come from
   `http://127.0.0.1:54321/storage/v1/object/public/site-assets/...`.
5. **Edge Function:** the same post shows "👀 N views" under the date; reload to bump it.
6. **Realtime:** open the guestbook in two windows and post in one. The footer badge counts open tabs.

Useful extras:

- Studio (table editor, auth users, storage, logs): http://127.0.0.1:54323
- `npm run db:test` runs the pgTAP tests in `supabase/tests` (RLS rules).
- `npm run db:advisors` runs the security and performance advisors on the local database.
- `npm run functions:serve` serves Edge Functions with logs in your terminal, if you want to debug one.
- `npx supabase stop` when you're done. Your local data survives until `npm run db:reset`.

### Changing the database

Write a new file in `supabase/migrations` (`npx supabase migration new my_change`), then `npm run db:reset`
to rebuild from scratch, or make the change in Studio and capture it with `npx supabase db diff -f my_change`.

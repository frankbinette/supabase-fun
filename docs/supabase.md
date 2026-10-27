# Supabase platform: hosting, deploys and preview branches

Everything in the README runs locally. This is how to put it on a free hosted project and let GitHub
drive it.

## 1. Create and link a project

1. Create a project at https://supabase.com/dashboard (free plan is fine). Save the database password.
2. Copy the project ref from the URL (`https://supabase.com/dashboard/project/<ref>`).
3. Locally:

   ```sh
   npx supabase login
   npx supabase link --project-ref <ref>
   npx supabase db push                 # runs supabase/migrations on the hosted database
   npx supabase functions deploy        # deploys page-views
   npx supabase seed buckets --project-ref <ref>   # uploads post images and PDFs
   ```

4. Make yourself the site owner (the seed file only runs locally). In the dashboard SQL editor:

   ```sql
   insert into private.site_owners (email) values ('you@your-email.com');
   ```

5. In **Authentication → URL Configuration**, set the Site URL to where the site is hosted and add
   `https://<your-site>/auth/callback` to the redirect URLs.
6. Point the site at the hosted project with `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (from **Project Settings → API Keys**) wherever it's hosted.

## 2. Deploy from GitHub on every merge

`.github/workflows/deploy-supabase.yml` runs `db push`, deploys functions and uploads storage files
when something under `supabase/` changes on `main`. It's skipped until you add, in the repo's
**Settings → Secrets and variables → Actions**:

- Variable `SUPABASE_PROJECT_ID`: the project ref
- Secret `SUPABASE_ACCESS_TOKEN`: a token from https://supabase.com/dashboard/account/tokens
- Secret `SUPABASE_DB_PASSWORD`: the database password

`.github/workflows/ci.yml` runs on every pull request: it starts a throwaway Supabase stack, applies all
migrations, runs the pgTAP tests, the schema linter and the advisors.

## 3. A preview branch for each pull request

Branching gives each PR its own short-lived Supabase project with the PR's migrations and
`supabase/seed.sql` applied.

1. In the dashboard: **Project Settings → Integrations → GitHub**, connect `frankbinette/supabase-fun`,
   set the Supabase directory to `supabase`, and turn on **Automatic branching**.
2. Open a PR that touches `supabase/`. The Supabase bot comments with the branch's status and URL.
3. Branches are deleted when the PR is merged or closed. `npx supabase branches list` shows them.

Branching may need a paid plan; check the current pricing page if the toggle is disabled.

## 4. Logs and advisors

- **Logs:** dashboard → **Logs** (API, Postgres, Auth, Storage, Realtime). Edge Function logs are under
  **Edge Functions → page-views → Logs**; the function logs `increment_page_view failed` on errors.
- **Advisors:** dashboard → **Advisors** (security and performance), or `npx supabase db advisors --linked`.
  The deploy workflow prints them after each deploy.

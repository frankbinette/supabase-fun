// Writes .env.local from the running local Supabase stack (`npx supabase start`).
import { execSync } from "node:child_process";
import fs from "node:fs";

const status = JSON.parse(execSync("npx supabase status -o json", { encoding: "utf8" }));
const url = status.API_URL;
const key = status.PUBLISHABLE_KEY ?? status.ANON_KEY;

if (!url || !key) {
  console.error("Couldn't read the API URL and key from `supabase status`. Is the local stack running?");
  process.exit(1);
}

fs.writeFileSync(
  ".env.local",
  `NEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${key}\n`,
);
console.log(`Wrote .env.local for ${url}`);

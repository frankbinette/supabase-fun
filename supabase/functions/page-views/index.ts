// Counts a view of a post and returns the new total.
// Called from the browser with: supabase.functions.invoke("page-views", { body: { path } })
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Only post URLs like /2022/02/25/confoo-2022, so nobody can fill the table with junk paths.
const POST_PATH = /^\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]{1,100}$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const { path } = await req.json().catch(() => ({}));
  if (typeof path !== "string" || !POST_PATH.test(path)) {
    return json({ error: "path must look like /YYYY/MM/DD/slug" }, 400);
  }

  // The service role key is injected into every Edge Function; it's allowed to call increment_page_view.
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: views, error } = await supabase.rpc("increment_page_view", { page_path: path });
  if (error) {
    console.error("increment_page_view failed", error);
    return json({ error: "Couldn't count this view" }, 500);
  }

  return json({ path, views });
});

import { createClient } from "npm:@supabase/supabase-js@2";

// Near-identical to articles-list/index.ts, adapted for work_samples.
// Needed for the same reason: the public RLS SELECT policy on
// work_samples only exposes published rows, so the admin panel needs an
// authenticated path to see drafts too.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization" }, 401);
  }

  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: userData, error: authError } = await anonClient.auth.getUser();
  if (authError || !userData?.user) {
    return jsonResponse({ error: "Invalid or expired session" }, 401);
  }

  // Signed-in owner gets everything, drafts included — the public site
  // (via the RLS policy on work_samples) only ever sees published rows.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("work_samples")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("List error:", error);
    return jsonResponse({ error: "Failed to load work samples" }, 500);
  }

  return jsonResponse({ work_samples: data ?? [] }, 200);
});

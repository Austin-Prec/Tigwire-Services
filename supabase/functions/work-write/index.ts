import { createClient } from "npm:@supabase/supabase-js@2";

// Same auth-then-service-role pattern as articles-write/index.ts and
// pages-write/index.ts -- see either for the fuller original this was
// adapted from. work_samples is simpler than articles (no slug, no rich
// content body), so this function is correspondingly shorter.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WorkSamplePayload {
  id?: string;
  label?: string;
  before_image_url?: string;
  after_image_url?: string;
  display_order?: number;
  status?: "draft" | "published";
}

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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (req.method === "POST") {
      const body: WorkSamplePayload = await req.json();

      if (!body.label || !body.label.trim()) {
        return jsonResponse({ error: "Label is required" }, 400);
      }
      if (!body.before_image_url || !body.after_image_url) {
        return jsonResponse(
          { error: "Both before_image_url and after_image_url are required" },
          400
        );
      }

      const status = body.status === "published" ? "published" : "draft";

      const { data, error } = await supabase
        .from("work_samples")
        .insert({
          label: body.label.trim(),
          before_image_url: body.before_image_url,
          after_image_url: body.after_image_url,
          display_order: body.display_order ?? 0,
          status,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return jsonResponse({ error: "Failed to create work sample" }, 500);
      }

      return jsonResponse({ work_sample: data }, 201);
    }

    if (req.method === "PATCH") {
      const body: WorkSamplePayload = await req.json();

      if (!body.id) {
        return jsonResponse({ error: "Work sample id is required" }, 400);
      }

      const { data: current, error: fetchError } = await supabase
        .from("work_samples")
        .select("id")
        .eq("id", body.id)
        .maybeSingle();

      if (fetchError || !current) {
        return jsonResponse({ error: "Work sample not found" }, 404);
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (body.label !== undefined) updates.label = body.label.trim();
      if (body.before_image_url !== undefined) updates.before_image_url = body.before_image_url;
      if (body.after_image_url !== undefined) updates.after_image_url = body.after_image_url;
      if (body.display_order !== undefined) updates.display_order = body.display_order;
      if (body.status !== undefined) updates.status = body.status;

      const { data, error } = await supabase
        .from("work_samples")
        .update(updates)
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return jsonResponse({ error: "Failed to update work sample" }, 500);
      }

      return jsonResponse({ work_sample: data }, 200);
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return jsonResponse({ error: "Work sample id is required" }, 400);
      }

      const { error } = await supabase.from("work_samples").delete().eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        return jsonResponse({ error: "Failed to delete work sample" }, 500);
      }

      return jsonResponse({ success: true }, 200);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("work-write function error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

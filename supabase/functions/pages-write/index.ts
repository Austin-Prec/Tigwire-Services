import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VALID_TYPES = new Set([
  "header", "photo", "bio", "list", "credentials_panel", // About page blocks (header also used on Frameworks, Services, Contact, Case Studies)
  "hero", "value_cards", "stat_bar", "link_preview", // Home page blocks
  "framework_section", "cta_banner", // Frameworks page blocks
  "service_grid", "pricing_notes", // Services page blocks
  "contact_sidebar", // Contact page blocks
  "case_study_grid", // Case Studies page blocks
]);

interface BlockPayload {
  id?: string;
  page?: string;
  type?: string;
  position?: number;
  content?: Record<string, unknown>;
}

interface ReorderPayload {
  page: string;
  order: string[]; // block ids in their new top-to-bottom order
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
      const body: BlockPayload = await req.json();

      if (!body.page || !body.page.trim()) {
        return jsonResponse({ error: "Page is required" }, 400);
      }
      if (!body.type || !VALID_TYPES.has(body.type)) {
        return jsonResponse({ error: "A valid block type is required" }, 400);
      }

      // New blocks default to the end of the page unless a position was given.
      let position = body.position;
      if (position === undefined) {
        const { data: existing } = await supabase
          .from("page_blocks")
          .select("position")
          .eq("page", body.page)
          .order("position", { ascending: false })
          .limit(1)
          .maybeSingle();
        position = existing ? existing.position + 1 : 0;
      }

      const { data, error } = await supabase
        .from("page_blocks")
        .insert({
          page: body.page.trim(),
          type: body.type,
          position,
          content: body.content ?? {},
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return jsonResponse({ error: "Failed to create block" }, 500);
      }

      return jsonResponse({ block: data }, 201);
    }

    if (req.method === "PATCH") {
      const body: BlockPayload = await req.json();

      if (!body.id) {
        return jsonResponse({ error: "Block id is required" }, 400);
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.content !== undefined) updates.content = body.content;
      if (body.type !== undefined) {
        if (!VALID_TYPES.has(body.type)) {
          return jsonResponse({ error: "Invalid block type" }, 400);
        }
        updates.type = body.type;
      }

      const { data, error } = await supabase
        .from("page_blocks")
        .update(updates)
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return jsonResponse({ error: "Failed to update block" }, 500);
      }

      return jsonResponse({ block: data }, 200);
    }

    if (req.method === "PUT") {
      // Reorder: replace the position of every block on a page in one request,
      // so up/down/drag reordering in the admin panel is a single atomic call
      // rather than N separate position updates racing each other.
      const body: ReorderPayload = await req.json();

      if (!body.page || !Array.isArray(body.order)) {
        return jsonResponse({ error: "Page and order array are required" }, 400);
      }

      const updates = body.order.map((id, index) =>
        supabase
          .from("page_blocks")
          .update({ position: index, updated_at: new Date().toISOString() })
          .eq("id", id)
          .eq("page", body.page) // guard against reordering a block from a different page
      );

      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);

      if (failed) {
        console.error("Reorder error:", failed.error);
        return jsonResponse({ error: "Failed to reorder blocks" }, 500);
      }

      return jsonResponse({ success: true }, 200);
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return jsonResponse({ error: "Block id is required" }, 400);
      }

      const { error } = await supabase.from("page_blocks").delete().eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        return jsonResponse({ error: "Failed to delete block" }, 500);
      }

      return jsonResponse({ success: true }, 200);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("pages-write function error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

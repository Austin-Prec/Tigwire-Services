import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ArticlePayload {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  category?: string;
  author?: string;
  read_time?: string;
  icon?: string;
  status?: "draft" | "published";
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Every write must carry a valid Supabase Auth session for the site owner.
  // We verify the token against the anon-key client (which checks it's a real,
  // unexpired session) before ever touching the service-role client below.
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

  // Only past this point do we use the service role key, and only because
  // we've already confirmed the caller is a real signed-in user.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (req.method === "POST") {
      const body: ArticlePayload = await req.json();

      if (!body.title || !body.title.trim()) {
        return jsonResponse({ error: "Title is required" }, 400);
      }

      const baseSlug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
      let finalSlug = baseSlug;

      // Guard against duplicate slugs (e.g. two posts both titled "Untitled")
      // by appending a short suffix rather than failing the request outright.
      const { data: existing } = await supabase
        .from("articles")
        .select("slug")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (existing) {
        finalSlug = `${baseSlug}-${Date.now().toString(36).slice(-5)}`;
      }

      const status = body.status === "published" ? "published" : "draft";
      const nowIso = new Date().toISOString();

      const { data, error } = await supabase
        .from("articles")
        .insert({
          slug: finalSlug,
          title: body.title.trim(),
          excerpt: body.excerpt ?? "",
          content: body.content ?? "",
          cover_image_url: body.cover_image_url ?? "",
          category: body.category ?? "",
          author: body.author?.trim() || "Tigwire Services",
          read_time: body.read_time ?? "",
          icon: body.icon || "Sparkles",
          status,
          published_at: status === "published" ? nowIso : null,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert error:", error);
        return jsonResponse({ error: "Failed to create article" }, 500);
      }

      return jsonResponse({ article: data }, 201);
    }

    if (req.method === "PATCH") {
      const body: ArticlePayload = await req.json();

      if (!body.id) {
        return jsonResponse({ error: "Article id is required" }, 400);
      }

      const { data: current, error: fetchError } = await supabase
        .from("articles")
        .select("status, published_at, slug")
        .eq("id", body.id)
        .maybeSingle();

      if (fetchError || !current) {
        return jsonResponse({ error: "Article not found" }, 404);
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (body.title !== undefined) updates.title = body.title.trim();
      if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
      if (body.content !== undefined) updates.content = body.content;
      if (body.cover_image_url !== undefined) updates.cover_image_url = body.cover_image_url;
      if (body.category !== undefined) updates.category = body.category;
      if (body.author !== undefined) updates.author = body.author;
      if (body.read_time !== undefined) updates.read_time = body.read_time;
      if (body.icon !== undefined) updates.icon = body.icon;

      if (body.slug !== undefined && body.slug.trim()) {
        updates.slug = slugify(body.slug);
      }

      if (body.status !== undefined && body.status !== current.status) {
        updates.status = body.status;
        // Only stamp published_at the first time a post goes live, so
        // republishing an edit doesn't reset its original publish date.
        if (body.status === "published" && !current.published_at) {
          updates.published_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from("articles")
        .update(updates)
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        return jsonResponse({ error: "Failed to update article" }, 500);
      }

      return jsonResponse({ article: data }, 200);
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return jsonResponse({ error: "Article id is required" }, 400);
      }

      const { error } = await supabase.from("articles").delete().eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        return jsonResponse({ error: "Failed to delete article" }, 500);
      }

      return jsonResponse({ success: true }, 200);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (err) {
    console.error("articles-write function error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

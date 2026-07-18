import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

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

  if (req.method !== "POST") {
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

  try {
    // The client sends the raw file bytes with its content-type set to the
    // image's mime type, and the filename in a custom header — simpler than
    // multipart/form-data parsing for a single-file upload.
    const contentType = req.headers.get("content-type") || "";
    const extension = ALLOWED_TYPES[contentType];

    if (!extension) {
      return jsonResponse(
        { error: "Unsupported image type. Use JPG, PNG, WEBP, or GIF." },
        400
      );
    }

    const arrayBuffer = await req.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      return jsonResponse({ error: "Empty file" }, 400);
    }

    if (arrayBuffer.byteLength > MAX_BYTES) {
      return jsonResponse({ error: "Image must be smaller than 8MB" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    const path = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("article-images")
      .upload(path, arrayBuffer, { contentType, upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return jsonResponse({ error: "Failed to upload image" }, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from("article-images")
      .getPublicUrl(path);

    return jsonResponse({ url: publicUrlData.publicUrl }, 200);
  } catch (err) {
    console.error("articles-upload function error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
